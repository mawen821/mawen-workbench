#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""工作台「长期可持续性」每日体检（只读，绝不修改任何文件）。

目的：把「哪天会不会突然不更新 / 板块会不会坏」从事后才发现，
变成每天云端自动巡检、提前预警。零依赖、零 key、零联网、零副作用。

检查项：
  1. 新闻 NEWS_DATA 最新日期距今几天（断供预警）
  2. 新闻文件体积是否过大（膨胀拖慢首屏）
  3. 12 个核心语料是否齐全、轮数、最小重复周期
  4. 断供兜底语料是否存在
  5. 各 data-*.js 里数组规模是否逼近云端 trim 上限
  6. 静态知识库里写死的日期距今多久（越来越旧 → 看着像停更）
  7. index.html 与 sw.js 的缓存版本戳是否一致（不一致 → 手机吃旧版）
  8. 所有被 index.html 引用的本地资源是否都在 sw.js 离线清单里

输出：人类可读报告 + GitHub Actions 注解(::warning::)。
退出码永远 0：体检只预警，绝不因体检让任何自动更新流水线报红/中断。
"""
import datetime
import glob
import json
import os
import re
import sys

WS = os.environ.get("NEWS_WS", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TZ = datetime.timezone(datetime.timedelta(hours=8))

CORE_MODULES = ['ai_learning', 'common', 'country', 'douyin', 'english_corner',
                'english_daily', 'fashion', 'finance_knowledge', 'fund_news',
                'hot_funds', 'misc', 'shenlun']

warnings = []
def warn(msg):
    warnings.append(msg)
    print("::warning::" + msg)

def info(msg):
    print("  " + msg)

def today_bj():
    return datetime.datetime.now(TZ).date()

def days_between(date_str, today):
    try:
        d = datetime.date.fromisoformat(date_str)
        return (today - d).days
    except Exception:
        return None

# ---------------------------------------------------------------------------
print("=" * 60)
print("工作台长期可持续性体检 · %s（北京时间）" % today_bj().isoformat())
print("=" * 60)

# 1. 新闻新鲜度
print("\n[1] 新闻数据新鲜度")
news_path = os.path.join(WS, "js", "data-news.js")
if not os.path.isfile(news_path):
    warn("找不到 js/data-news.js")
else:
    src = open(news_path, encoding="utf-8").read()
    dates = re.findall(r'^  "(\d{4}-\d{2}-\d{2})": \[', src, re.M)
    size_kb = os.path.getsize(news_path) / 1024
    if not dates:
        warn("NEWS_DATA 里没有任何日期键，新闻板块会是空的")
    else:
        newest = max(dates)
        gap = days_between(newest, today_bj())
        info("共 %d 天数据，最新 %s，距今 %s 天" % (len(dates), newest, gap))
        if gap is not None and gap >= 2:
            warn("新闻已 %d 天没有新内容（最新 %s）——请检查 daily-news 流水线" % (gap, newest))
    info("文件大小 %.0f KB" % size_kb)
    if size_kb > 1500:
        warn("data-news.js 已达 %.0f KB，可能拖慢手机首屏，建议下调保留天数" % size_kb)

# 2. 语料齐全 / 轮数 / 最小重复周期
print("\n[2] 内容语料供给")
min_rounds = None
for m in CORE_MODULES:
    f = os.path.join(WS, "scripts", "corpus", m + ".json")
    if not os.path.isfile(f):
        warn("缺少核心语料 scripts/corpus/%s.json" % m)
        continue
    try:
        d = json.load(open(f, encoding="utf-8"))
        n = len(d.get("items", []))
        info("%-22s %2d 轮" % (m, n))
        if n <= 0:
            warn("%s 无可用轮次" % m)
        else:
            min_rounds = n if min_rounds is None else min(min_rounds, n)
    except Exception as ex:
        warn("%s 解析失败: %s" % (m, str(ex)[:80]))
if min_rounds:
    info("最小轮数 = %d，模块每周跑一次 → 约 %d 周后内容开始循环（离线语料固有特性，非停更）"
         % (min_rounds, min_rounds))

fb = os.path.join(WS, "scripts", "corpus", "news_fallback.json")
if not os.path.isfile(fb):
    warn("缺少 news_fallback.json —— RSS 全挂时新闻会静默停更")
else:
    try:
        d = json.load(open(fb, encoding="utf-8"))
        info("断供兜底语料 %d 轮（按天取模，永不耗尽）" % len(d.get("items", [])))
    except Exception as ex:
        warn("news_fallback.json 解析失败: %s" % str(ex)[:80])

# 3. 静态知识库里写死的日期（越来越旧会被误认为停更）
print("\n[3] 静态知识库日期")
stale_found = 0
for f in sorted(glob.glob(os.path.join(WS, "js", "data-*.js"))):
    txt = open(f, encoding="utf-8").read()
    # 只找形如 *_UPDATED = 'YYYY-MM-DD' 的显式日期戳
    for ds in re.findall(r"(?:UPDATED|_UPDATED)\s*=\s*['\"](\d{4}-\d{2}-\d{2})['\"]", txt):
        gap = days_between(ds, today_bj())
        if gap is not None and gap > 60:
            stale_found += 1
            info("%s 日期戳 %s（%d 天前，静态知识库正常，但界面别显示成'更新于'）"
                 % (os.path.basename(f), ds, gap))
if stale_found:
    info("共 %d 个较旧的静态日期戳——已在前端改为不显示误导性日期，属正常" % stale_found)

# 4. 缓存版本戳一致性
print("\n[3.5] 数据文件体积（首屏同步加载全部 js，过大拖慢手机）")
for f in sorted(glob.glob(os.path.join(WS, "js", "*.js"))):
    kb = os.path.getsize(f) / 1024
    if kb > 500:
        info("%-28s %7.0f KB" % (os.path.basename(f), kb))
        if kb > 2000:
            warn("%s 已达 %.0f KB，建议给可增长数组设上限" % (os.path.basename(f), kb))

print("\n[4] 缓存版本一致性（不一致会让手机一直看旧内容）")
idx = os.path.join(WS, "index.html")
sw = os.path.join(WS, "sw.js")
if os.path.isfile(idx) and os.path.isfile(sw):
    idx_text = open(idx, encoding="utf-8").read()
    sw_text = open(sw, encoding="utf-8").read()
    cache_v = re.findall(r"CACHE\s*=\s*['\"]mw-workbench-v([0-9a-zA-Z]+)['\"]", sw_text)
    # 新体系：每个文件用内容 hash 当戳（?v=8位十六进制）。逐文件比对 index 与 sw 是否一致。
    def stamp_map(text):
        m = {}
        for path, ver in re.findall(r'(js/[^\"\']+?|css/[^\"\']+?|vendor/[^\"\']+?)\?v=([0-9a-zA-Z]+)', text):
            m.setdefault(path.lstrip("./"), ver)
        return m
    idx_map = stamp_map(idx_text)
    sw_map = stamp_map(sw_text)
    mismatched = [k for k, v in idx_map.items() if k in sw_map and sw_map[k] != v]
    info("版本戳体系: 内容 hash（每文件独立）+ CACHE v%s" % (", ".join(cache_v) or "?"))
    info("带戳资源数: index=%d, sw=%d" % (len(idx_map), len(sw_map)))
    if mismatched:
        warn("index.html 与 sw.js 的资源版本戳不一致: %s" % ", ".join(mismatched[:5]))
    else:
        info("index.html 与 sw.js 资源版本戳逐项一致 ✓")

# 5. 离线缓存清单覆盖
print("\n[5] 离线资源清单覆盖")
if os.path.isfile(idx) and os.path.isfile(sw):
    hrefs = re.findall(r'(?:src|href)="([^"]+)"', open(idx, encoding="utf-8").read())
    refs = [h for h in hrefs if not h.startswith(("http", "#", "data:"))]
    def norm(s):
        return re.sub(r"\?v=[0-9a-zA-Z]+", "", s.lstrip("./"))
    refset = set(norm(r) for r in refs)
    core = set(norm(c) for c in re.findall(r"'([\./][^']+)'", open(sw, encoding="utf-8").read())
               if c.startswith("./"))
    missing = sorted(refset - core)
    if missing:
        warn("index.html 引用但 sw.js 未缓存: %s" % ", ".join(missing))
    else:
        info("index.html 引用的本地资源全部在离线清单内 ✓")

# ---------------------------------------------------------------------------
print("\n" + "=" * 60)
if warnings:
    print("体检完成：发现 %d 项需要留意 ↑（均为预警，不影响自动更新继续运行）" % len(warnings))
else:
    print("体检完成：全部正常，未发现停更/损坏风险 ✓")
print("=" * 60)
sys.exit(0)
