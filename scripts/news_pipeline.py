#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
每日新闻云端生成管线（GitHub Actions 用，电脑关机也能跑）

流程：
  1. 抓取若干权威 RSS 源（免 key、可公网访问）
  2. 解析标题/链接/时间，按日期过滤、去重、截断到 N 条
  3. 若配置了 LLM_API_KEY（OpenAI 兼容接口），调用一次批量润色，
     生成 detail / meaning / expert 等深度字段；否则用模板兜底
  4. 把当天新闻块插入 js/data-news.js 的 NEWS_DATA（幂等：当天已有则跳过）
  5. 由 workflow 后续调用 _gen_news_audio.py 生成语音 + git 推送

环境变量（可选）：
  NEWS_WS       工作区根目录（默认取脚本上级目录；本地测试可覆盖）
  NEWS_DATE     指定日期 YYYY-MM-DD（默认今天，按北京时间）
  NEWS_MAX      最多生成条数（默认 12）
  LLM_API_KEY   OpenAI 兼容对话接口密钥（不填则模板兜底）
  LLM_BASE_URL  接口 base url（默认 https://api.openai.com/v1）
  LLM_MODEL     模型名（默认 gpt-4o-mini）
  NEWS_FEEDS    逗号分隔的 RSS 列表，覆盖内置默认源

说明：RSS 抓取只取真实标题/链接/摘要，LLM 仅做"基于标题的合规展开"，
不编造来源；模板兜底完全不依赖任何外部密钥。
"""
import datetime
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

WS = os.environ.get("NEWS_WS", os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
JS_PATH = os.path.join(WS, "js", "data-news.js")
UA = "Mozilla/5.0 (compatible; WorkBuddyNewsBot/1.0)"

DEFAULT_FEEDS = [
    # 主源：HTTP 国内站点（GitHub Actions 上可达、稳定）
    "http://www.gov.cn/xinwen/xxfb_rss.shtml",
    "http://www.xinhuanet.com/politics/news_politics.xml",
    "http://www.people.com.cn/rss/politics.xml",
    "http://www.people.com.cn/rss/world.xml",
    "http://www.xinhuanet.com/world/news_world.xml",
    "http://www.gov.cn/xinwen/yaowen/rss.xml",
    # 备用：https 源（个别网络环境下 HTTP 被拦时兜底）
    "https://rss.cctv.com.cn/rss/yaowen.xml",
    "https://www.chinanews.com.cn/rss/scroll-news.xml",
]

CATEGORIES = {
    "economy": ["经济", "金融", "股市", "基金", "gdp", "消费", "央行", "降准", "财政",
                "产业", "企业", "贸易", "出口", "投资", "物价", "通胀", "减税", "就业"],
    "politics": ["习近平", "会议", "政策", "国务院", "人大", "政协", "党建", "中央", "政治局",
                 "主席", "总理", "部长", "文件", "通知", "部署"],
    "tech": ["科技", "人工智能", "芯片", "量子", "航天", "卫星", "5g", "6g", "ai", "大模型",
             "创新", "机器人", "新能源", "电池", "算力", "数据中心"],
    "society": ["民生", "教育", "医疗", "养老", "住房", "社保", "食品", "安全", "疫情", "天气",
                "交通", "社区", "乡村振兴"],
    "world": ["国际", "美国", "俄罗斯", "乌克兰", "欧盟", "日本", "韩国", "中东", "联合国",
              "外交", "北约", "选举"],
    "law": ["法治", "法律", "法院", "检察", "公安", "条例", "法规", "立法", "判决", "司法"],
    "ecology": ["生态", "环保", "碳", "绿色", "污染", "气候", "植树", "长江", "黄河", "节能"],
    "culture": ["文化", "文物", "非遗", "博物馆", "图书", "遗产", "传统", "文艺"],
}


def beijing_now():
    # 以北京时间（UTC+8）为准
    return datetime.datetime.now(datetime.timezone.utc).astimezone(
        datetime.timezone(datetime.timedelta(hours=8)))


def fetch_url(url, timeout=25):
    # 支持本地文件源（便于测试与高级自定义）：file:// 或直接文件路径
    local = url
    if local.startswith("file://"):
        local = local[len("file://"):]
        if local.startswith("/") and re.match(r"^/[a-zA-Z]:", local):
            local = local[1:]
    if os.path.isfile(local):
        try:
            with open(local, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        except Exception as e:
            print("  [feed] 读取本地文件失败 %s : %s" % (local, str(e)[:80]))
            return None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            raw = r.read()
        # 尝试解码
        for enc in ("utf-8", "gbk", "gb18030"):
            try:
                return raw.decode(enc)
            except UnicodeDecodeError:
                continue
        return raw.decode("utf-8", "ignore")
    except Exception as e:
        print("  [feed] 抓取失败 %s : %s" % (url, str(e)[:80]))
        return None


def parse_feed(text):
    items = []
    if not text:
        return items
    try:
        root = ET.fromstring(text)
    except ET.ParseError:
        # 有些 RSS 带 html 实体/命名空间前缀，退而求其次用正则抓 item
        return parse_feed_regex(text)
    # RSS
    for it in root.iter("item"):
        items.append(_extract(it))
    # Atom
    for it in root.iter("{http://www.w3.org/2005/Atom}entry"):
        items.append(_extract_atom(it))
    return [x for x in items if x.get("title")]


def _text(el):
    if el is None:
        return ""
    t = (el.text or "") + "".join(c.text or "" for c in el)
    return t.strip()


def _extract(it):
    title = _text(it.find("title"))
    link = _text(it.find("link"))
    if not link and it.find("{http://www.w3.org/2005/Atom}link") is not None:
        link = it.find("{http://www.w3.org/2005/Atom}link").get("href", "")
    pub = _text(it.find("pubDate")) or _text(it.find("dc:date")) or _text(it.find("date"))
    desc = _text(it.find("description")) or _text(it.find("encoded")) or _text(it.find("summary"))
    desc = re.sub(r"<[^>]+>", "", desc)
    desc = re.sub(r"\s+", " ", desc).strip()
    return {"title": title, "link": link, "pub": pub, "summary": desc[:240]}


def _extract_atom(it):
    title = _text(it.find("{http://www.w3.org/2005/Atom}title"))
    link = ""
    for l in it.findall("{http://www.w3.org/2005/Atom}link"):
        link = l.get("href", "")
        if link:
            break
    pub = _text(it.find("{http://www.w3.org/2005/Atom}updated")) or _text(it.find("{http://www.w3.org/2005/Atom}published"))
    desc = _text(it.find("{http://www.w3.org/2005/Atom}summary")) or _text(it.find("{http://www.w3.org/2005/Atom}content"))
    desc = re.sub(r"<[^>]+>", "", desc)
    desc = re.sub(r"\s+", " ", desc).strip()
    return {"title": title, "link": link, "pub": pub, "summary": desc[:240]}


def parse_feed_regex(text):
    items = []
    blocks = re.findall(r"<item>(.*?)</item>", text, re.S)
    for b in blocks:
        t = re.search(r"<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</title>", b, re.S)
        l = re.search(r"<link>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</link>", b, re.S)
        d = re.search(r"<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?</description>", b, re.S)
        p = re.search(r"<pubDate>(.*?)</pubDate>", b, re.S)
        items.append({
            "title": (t.group(1).strip() if t else ""),
            "link": (l.group(1).strip() if l else ""),
            "pub": (p.group(1).strip() if p else ""),
            "summary": re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", d.group(1) if d else "")).strip()[:240],
        })
    return [x for x in items if x["title"]]


def parse_date(s):
    """解析新闻时间为"带时区(aware)"的 datetime。

    关键：必须统一成 aware，否则 aware 与 naive 混合排序会抛
    TypeError: can't compare offset-naive and offset-aware datetimes
    （2026-11-15 新闻停更的真正根因）。
    """
    bj = datetime.timezone(datetime.timedelta(hours=8))
    dt = None
    if s:
        for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%a, %d %b %Y %H:%M:%S",
                    "%Y-%m-%d %H:%M:%S", "%Y/%m/%d %H:%M:%S"):
            try:
                dt = datetime.datetime.strptime(s[:31], fmt)
                break
            except Exception:
                pass
        if dt is None:
            try:
                dt = datetime.datetime.fromisoformat(s.replace("Z", "+00:00"))
            except Exception:
                pass
    # 统一补齐时区：naive 一律当作北京时间
    if dt is not None and dt.tzinfo is None:
        dt = dt.replace(tzinfo=bj)
    return dt


def categorize(title):
    low = title.lower()
    for cat, kws in CATEGORIES.items():
        if any(k in low for k in kws):
            return cat
    return "politics"


def js_str(s):
    if s is None:
        return "null"
    s = str(s)
    s = s.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    return "`" + s + "`"


def js_links(links):
    if not links:
        return "[]"
    parts = []
    for lk in links[:3]:
        nm = lk.get("name") or lk.get("url") or "原文"
        parts.append("{name:%s, url:%s}" % (js_str(nm), js_str(lk.get("url", ""))))
    return "[" + ",".join(parts) + "]"


def js_expert(e):
    if not e:
        return "null"
    return "{who:%s, view:%s}" % (js_str(e.get("who", "")), js_str(e.get("view", "")))


def make_entries(items, date_str, use_llm):
    enriched = items
    if use_llm:
        enriched = llm_enrich(items)
    entries = []
    for i, it in enumerate(enriched[:int(os.environ.get("NEWS_MAX", "12"))], 1):
        cat = it.get("category") or categorize(it.get("title", ""))
        summary = it.get("summary") or it.get("title", "")
        detail = it.get("detail") or summary
        meaning = it.get("meaning") or ("本条涉及" + cat + "领域，是时事与申论的高频关注点。")
        expert = it.get("expert")
        links = it.get("links") or ([{"name": "原文链接", "url": it.get("link", "")}] if it.get("link") else [])
        entries.append({
            "id": date_str.replace("-", "") + ("-%02d" % i),
            "category": cat,
            "title": it.get("title", ""),
            "summary": summary,
            "time": beijing_now().strftime("%H:%M"),
            "source": it.get("source") or "公开报道（RSS 聚合）",
            "detail": detail,
            "meaning": meaning,
            "expert": expert,
            "links": links,
        })
    return entries


def llm_enrich(items):
    """可选：用 OpenAI 兼容接口对真实标题做一次性批量展开。失败则返回原始条目。"""
    key = os.environ.get("LLM_API_KEY")
    if not key:
        return items
    base = os.environ.get("LLM_BASE_URL", "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("LLM_MODEL", "gpt-4o-mini")
    payload = [{"title": it["title"], "link": it.get("link", ""), "summary": it.get("summary", "")}
               for it in items]
    prompt = (
        "你是为备考公务员的读者整理每日新闻的编辑。下面是一批真实新闻标题（含链接与摘要）。\n"
        "请严格基于标题与已知公开信息，返回 JSON 数组，每个元素对应一条，字段：\n"
        "detail: 2 段事实性展开（不要编造数字、引语或来源，只做合规阐述）；\n"
        "meaning: 1 句话说明对时政/申论备考为何重要；\n"
        "expert: 可空，{who, view} 或 null；\n"
        "category: 在 economy/politics/tech/society/world/law/ecology/culture 中选一。\n"
        "只返回 JSON 数组，不要多余文字。\n" + json.dumps(payload, ensure_ascii=False)
    )
    try:
        data = json.dumps({"model": model, "messages": [{"role": "user", "content": prompt}],
                           "response_format": {"type": "json_object"}}, ensure_ascii=False).encode("utf-8")
        req = urllib.request.Request(base + "/chat/completions",
                                     data=data, headers={"Authorization": "Bearer " + key,
                                                        "Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read().decode("utf-8"))
        content = resp["choices"][0]["message"]["content"]
        arr = json.loads(content)
        if isinstance(arr, dict) and "array" in arr:
            arr = arr["array"]
        for i, e in enumerate(arr):
            if i < len(items):
                items[i].update({k: e[k] for k in ("detail", "meaning", "expert", "category") if k in e})
    except Exception as ex:
        print("  [llm] 润色失败，使用原始条目：%s" % str(ex)[:100])
    return items


def entry_to_js(e):
    return (
        "    {\n"
        "      id: \"%s\",\n"
        "      category: \"%s\",\n"
        "      title: %s,\n"
        "      summary: %s,\n"
        "      time: \"%s\",\n"
        "      source: %s,\n"
        "      detail: %s,\n"
        "      meaning: %s,\n"
        "      expert: %s,\n"
        "      links: %s\n"
        "    }" % (
            e["id"], e["category"], js_str(e["title"]), js_str(e["summary"]), e["time"],
            js_str(e["source"]), js_str(e["detail"]), js_str(e["meaning"]),
            js_expert(e["expert"]), js_links(e["links"]),
        )
    )


def insert_block(date_str, entries, js_path, dry_run=False):
    with open(js_path, "r", encoding="utf-8") as f:
        src = f.read()
    # 幂等：当天已存在则跳过
    if '"%s"' % date_str in src:
        print("  [skip] %s 已存在，跳过" % date_str)
        return False
    block = '  "%s": [\n%s\n  ],\n' % (date_str, ",\n".join(entry_to_js(e) for e in entries))
    marker = "const NEWS_DATA = {"
    idx = src.index(marker) + len(marker)
    new_src = src[:idx] + "\n" + block + src[idx:]
    # 更新头部"最后更新"日期
    new_src = re.sub(r"最后更新：\d{4}-\d{2}-\d{2}[ \d:]*",
                     "最后更新：" + date_str + " " + beijing_now().strftime("%H:%M"), new_src, count=1)
    out = js_path + ".dryrun" if dry_run else js_path
    with open(out, "w", encoding="utf-8") as f:
        f.write(new_src)
    return True


def main():
    feeds = os.environ.get("NEWS_FEEDS", "").split(",") if os.environ.get("NEWS_FEEDS") else DEFAULT_FEEDS
    date_str = os.environ.get("NEWS_DATE") or beijing_now().strftime("%Y-%m-%d")
    dry_run = "--dry-run" in sys.argv
    use_llm = bool(os.environ.get("LLM_API_KEY"))

    print("[news] 日期=%s  源数=%d  LLM=%s  模式=%s" % (date_str, len(feeds), "on" if use_llm else "off", "dry" if dry_run else "real"))

    collected = []
    seen = set()
    for url in feeds:
        url = url.strip()
        if not url:
            continue
        items = parse_feed(fetch_url(url))
        print("  [feed] %s -> %d 条" % (url, len(items)))
        for it in items:
            t = it["title"]
            if t and t not in seen:
                seen.add(t)
                collected.append(it)
    # 按发布时间就近排序（无法解析时间的排后面）
    # 统一用 aware 时间戳排序，彻底避免 naive/aware 混比崩溃
    def _sort_key(x):
        d = parse_date(x.get("pub"))
        if d is None:
            # 无有效发布时间（多为存档旧闻）排到最后，
            # 不能被当成"今天"抢到前排，否则每天都会混入多年前的旧新闻。
            return float("-inf")
        if d.tzinfo is None:  # 最后一道保险
            d = d.replace(tzinfo=datetime.timezone(datetime.timedelta(hours=8)))
        return d.timestamp()

    try:
        collected.sort(key=_sort_key, reverse=True)
    except Exception as ex:
        print("  [warn] 时间排序异常，改用原始顺序：%s" % str(ex)[:100])
    print("[news] 去重后候选 %d 条" % len(collected))

    entries = make_entries(collected, date_str, use_llm)
    if not entries:
        print("[news] 未抓到可用新闻，今日跳过（不写文件、不报错）")
        return 0

    ok = insert_block(date_str, entries, JS_PATH, dry_run=dry_run)
    if ok:
        print("[news] 已写入 %d 条到 %s" % (len(entries), "dryrun" if dry_run else JS_PATH))
    return 0


def _safe_main():
    """任何未预期异常都只记日志、不崩流水线，保证后续语音/提交步骤照常。

    设计原则：新闻脚本失败 ≠ 整条流水线失败。哪怕本脚本出任何问题，
    也要让 workflow 继续往下走（后续步骤各自有内容缺失检查），
    避免"一个环节崩 -> 全站新闻停更"的连锁反应。
    """
    try:
        return main()
    except Exception as ex:
        import traceback
        print("[news][ERROR] 新闻生成遇到未预期异常，本次跳过写入，但流水线继续：%s" % str(ex)[:200])
        traceback.print_exc()
        return 0


if __name__ == "__main__":
    sys.exit(_safe_main())
