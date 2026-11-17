#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""给 index.html / sw.js 里引用的数据脚本加「内容 hash 版本戳」，根治手机端拿到旧缓存。

背景（为什么要这个脚本）：
  PWA 手机上 Service Worker + 浏览器 HTTP 缓存会缓存 data-*.js。
  云端每天更新这些文件，但 URL 不变时，手机可能一直吃旧的缓存副本，
  表现为「云端全绿、git 有提交，可手机上看的还是几天前的内容」。
  根治办法：URL 带一个随内容变化的戳 ?v=<hash8>。内容一变 URL 就变，
  浏览器和 SW 必然重新下载；内容没变 URL 不变，缓存照用。

设计：
  - 每个被引用的 js/css 用文件内容的 sha256 前 8 位当版本戳。
  - 幂等：重复运行结果完全一致（git diff 为空）。
  - 同步处理 sw.js 的 CORE 清单，保证离线缓存与线上 URL 一致。
  - 零依赖、只读文件后原地写回、失败不影响其它文件。

用法（两个 workflow 在「提交并推送」之前各调一次）：
  python scripts/stamp_data_versions.py
"""
import hashlib
import os
import re
import sys

WS = os.environ.get("NEWS_WS", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# 会被云端更新、且必须让手机拿到最新版的文件。app.js/style.css 偶尔改也要让手机刷新。
STAMP_TARGETS = [
    "js/app.js", "js/data-news.js", "js/data-english.js", "js/data-english-shadow.js",
    "js/data-finance.js", "js/data-finance-trend.js", "js/data-shenlun.js",
    "js/data-misc.js", "js/data-common.js", "js/data-reading.js", "js/data-booktexts.js",
    "js/data-sport.js", "js/data-skill.js", "js/data-tenmin.js", "js/data-beauty.js",
    "js/data-pet.js", "js/data-ledger.js", "js/data-country.js", "js/data-country-auto.js",
    "js/data-country-track.js", "js/data-country-deep.js", "js/data-country-focus.js",
    "js/data-country-advantage.js", "js/news-check.js", "js/data-frontier.js",
    "js/data-gua64.js", "js/data-destiny.js", "js/data-tarot.js", "js/destiny.js",
    "js/tarot.js", "js/zimeiti.js", "js/ai.js", "js/imgstore.js", "css/style.css",
    "vendor/font-awesome/all.min.css",
]
STAMP_SET = set(STAMP_TARGETS)


def hash8(rel):
    p = os.path.join(WS, rel)
    if not os.path.isfile(p):
        return None
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:8]


def compute_stamps():
    return {rel: hv for rel in STAMP_TARGETS if (hv := hash8(rel))}


def rewrite_value(path, stamps, quote_char):
    """把单个资源 URL（不含引号）的 ?v= 替换成内容 hash；非目标文件原样返回。"""
    base = path.split("?", 1)[0].lstrip("./")
    if base not in stamps:
        return path
    return base_path_prefix(path) + "?v=" + stamps[base]


def base_path_prefix(path):
    # 保留原来的 ./ 前缀风格
    return "./" + path.split("?", 1)[0].lstrip("./")


def stamp_html(stamps):
    p = os.path.join(WS, "index.html")
    s = open(p, encoding="utf-8").read()
    orig = s

    def repl(m):
        q, path = m.group(1), m.group(2)
        return q + rewrite_value(path, stamps, q) + q

    # src/href="..." 里只处理看起来是资源路径的值
    s = re.sub(r'(src|href)=(["\'])([^"\']+)\2',
               lambda m: m.group(1) + "=" + m.group(2) + rewrite_value(m.group(3), stamps, m.group(2)) + m.group(2),
               s)
    if s != orig:
        open(p, "w", encoding="utf-8", newline="").write(s)
        return True
    return False


def stamp_sw(stamps):
    p = os.path.join(WS, "sw.js")
    s = open(p, encoding="utf-8").read()
    orig = s

    def repl(m):
        path = m.group(1)
        return "'" + rewrite_value(path, stamps, "'") + "'"

    s = re.sub(r"'([^']*\.(?:js|css)(?:\?v=[0-9a-zA-Z]+)?)'", repl, s)

    # CACHE 名随所有数据文件戳的总 hash 变化：任何一个数据文件更新 → CACHE 变 →
    # 新 SW install + activate 会清空旧缓存，彻底杜绝「手机吃旧版」。双保险。
    combined = hashlib.sha256(("|".join("%s=%s" % (k, v) for k, v in sorted(stamps.items()))).encode()).hexdigest()[:8]
    s = re.sub(r"CACHE\s*=\s*['\"]mw-workbench-v[0-9a-zA-Z]+['\"]",
               "CACHE = 'mw-workbench-v" + combined + "'", s, count=1)

    if s != orig:
        open(p, "w", encoding="utf-8", newline="").write(s)
        return True
    return False


def main():
    stamps = compute_stamps()
    changed_html = stamp_html(stamps)
    changed_sw = stamp_sw(stamps)
    print("[stamp] %d 个目标文件已计算内容 hash" % len(stamps))
    print("[stamp] index.html %s" % ("已更新版本戳" if changed_html else "版本戳已是最新"))
    print("[stamp] sw.js %s" % ("已更新版本戳" if changed_sw else "版本戳已是最新"))
    for k in ("js/app.js", "js/data-news.js", "js/data-shenlun.js"):
        if k in stamps:
            print("  %-28s ?v=%s" % (k, stamps[k]))
    return 0


if __name__ == "__main__":
    sys.exit(main())
