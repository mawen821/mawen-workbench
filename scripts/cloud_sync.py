"""
cloud_sync.py — 马雯工作台「全量云端化」统一调度器（无状态·语料轮换）。

核心设计（彻底去掉对钥匙/电脑/本地 agent 的依赖）：
1. 单一进程顺序处理当天该跑的模块，最后统一 git commit + push 一次，
   彻底避免多 workflow 并发改同一 js 文件（data-finance.js / data-english.js 被多模块共用）。
2. 全部操作基于 scripts/js_edit.py 的「纯文本插入」，不解析/不重排已有内容，
   任何一步失败仅跳过该模块，绝不留下半截文件、绝不中断整轮。
3. 内容来源 = scripts/corpus/<module>.json（一次性提交进仓库的语料库）。
   云端按 (今天-纪元).days % 语料轮数 取内容，并用当天日期填占位符。
   → 零 API Key、零本地、零状态文件、零人工；纯 GitHub Actions 自跑。
4. 可选增强：若仓库配了 LLM_API_KEY，则改用实时 LLM 生成（内容更"新"），
   但即使永远不配，语料模式也保证永不中断更新。

环境变量：
  LLM_API_KEY / NEWS_LLM_API_KEY   可选（配了则优先实时生成）
  LLM_BASE_URL / LLM_MODEL         可选
  FORCE_MODULE                     可选：只跑某一模块 key（调试用）
  DRY_RUN=1                        可选：只改文件不 push
"""

import json
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, date

try:
    from zoneinfo import ZoneInfo
    TZ = ZoneInfo("Asia/Shanghai")
except Exception:
    TZ = None

import js_edit
from llm_helper import call_llm_json as _real_call_llm_json, is_configured

SYSTEM = (
    "你是马雯学习工作台的内容生成引擎。请严格按要求生成结构化数据，只输出 JSON，"
    "不要任何解释或 markdown 围栏。内容须真实准确：不编造具体近期数字、日期、基金代码；"
    "若涉及最新市场或时事，基于稳健的公开常识作答，避免虚假精确值。中文用自然表达。"
)

EPOCH = date(2000, 1, 1)
CORPUS_DIR = os.path.join(os.path.dirname(__file__), "corpus")
# 当前模块的语料上下文：选中第几轮（由日期种子决定）
_CORPUS_CTX = {"module": None, "round_idx": 0}

# ---------------------------------------------------------------------------
# 语料（无状态）选择
# ---------------------------------------------------------------------------
def days_since_epoch(today):
    y, m, d = (int(x) for x in today.split("-"))
    return (date(y, m, d) - EPOCH).days


def corpus_items_for(module_key):
    p = os.path.join(CORPUS_DIR, f"{module_key}.json")
    if not os.path.exists(p):
        return None
    try:
        with open(p, encoding="utf-8") as f:
            return json.load(f).get("items", [])
    except Exception:
        return None


def _extract_array(prompt):
    m = re.search(r"数据结构\s*`([A-Za-z0-9_]+)`", prompt)
    if m:
        return m.group(1)
    m = re.search(r"`([A-Z][A-Z0-9_]{3,})`", prompt)
    return m.group(1) if m else "UNKNOWN"


def _fill_placeholders(obj, today):
    """把语料里的 {DATE}/{DATE8}/{ISOWEEK}/{WEEKCN}/{YEAR} 换成运行当天的真实值。"""
    y, m, d = today.split("-")
    iw = iso_week()
    week_no = iw.split("-W")[-1]
    mapping = {
        "{DATE}": today,
        "{DATE8}": y + m + d,
        "{ISOWEEK}": iw,
        "{WEEKCN}": f"第{int(week_no)}周",
        "{YEAR}": y,
    }
    if isinstance(obj, str):
        for k, v in mapping.items():
            obj = obj.replace(k, v)
        return obj
    if isinstance(obj, list):
        return [_fill_placeholders(x, today) for x in obj]
    if isinstance(obj, dict):
        return {k: _fill_placeholders(v, today) for k, v in obj.items()}
    return obj


def call_llm_json(prompt, system="", selector=None, **kw):
    """配了 LLM key 走真实生成（失败则自动降级到语料）；否则从语料库按日期种子取内容（无状态）。"""
    if is_configured():
        try:
            return _real_call_llm_json(prompt, system, **kw)
        except Exception as e:  # noqa: BLE001
            print(f"  ! LLM 调用失败（{str(e)[:120]}）→ 本次改用离线语料兜底")
    mod = _CORPUS_CTX.get("module")
    if not mod:
        raise RuntimeError("语料上下文缺失")
    items = corpus_items_for(mod)
    if not items:
        raise RuntimeError(f"语料缺失：{mod}")
    ridx = _CORPUS_CTX.get("round_idx", 0) % len(items)
    round_item = items[ridx]
    key = selector or _extract_array(prompt)
    val = round_item.get(key)
    if val is None:
        # 兼容 "NAME#2" 这种同一数组多次出现的键
        for kk, vv in round_item.items():
            if kk.split("#")[0] == key:
                val = vv
                break
    if val is None:
        raise RuntimeError(f"语料轮 {ridx} 缺键 {key}")
    return _fill_placeholders(val, today_str())


# ---------------------------------------------------------------------------
# 工具
# ---------------------------------------------------------------------------
def today_str():
    if TZ is not None:
        return datetime.now(TZ).strftime("%Y-%m-%d")
    # 兜底（极少触发，正常环境已用 Asia/Shanghai）：UTC+8 计算
    from datetime import timedelta, timezone
    return (datetime.now(timezone.utc) + timedelta(hours=8)).strftime("%Y-%m-%d")


def iso_week():
    d = date.today()
    y, w, _ = d.isocalendar()
    return f"{y}-W{w:02d}"


def _last_raw(text, name, k=1):
    try:
        return js_edit.last_items_raw(text, name, k)
    except Exception:
        return ""


def _last_raw_key(text, key, k=1):
    try:
        oi, ci = js_edit.find_key_array(text, key)
        body = text[oi + 1:ci]
        spans = js_edit._top_item_spans(body)
        if not spans:
            return ""
        pick = spans[-k:]
        return "\n\n".join(body[s:e + 1].strip() for (s, e) in pick)
    except Exception:
        return ""


def _max_num(text, name, pattern):
    try:
        oi, ci = js_edit.find_array(text, name)
        body = text[oi + 1:ci]
    except Exception:
        return 0
    nums = [int(m) for m in re.findall(pattern, body)]
    return max(nums) if nums else 0


def normalize(data, num, str_ok=False):
    # 语料模式下，selector 选中的值可能是一个「单条对象」（代表一条内容），
    # 也可能是一个列表。统一包成列表再裁剪，避免把对象内部的列表字段误当内容。
    if isinstance(data, dict):
        data = [data]
    if not isinstance(data, list):
        raise ValueError("返回非数组")
    items = data[:num] if num else data
    if not str_ok:
        items = [it for it in items if isinstance(it, dict)]
    return items


def build_prompt(op, few, note_extra=""):
    array = op.get("array") or op.get("key")
    num = op.get("num", 1)
    schema = op.get("schema", "")
    note = op.get("note", "")
    note_part = (f"\n【本周特别要求】{note}\n" if note else "") + (note_extra or "")
    verb = "整体重研并刷新，输出新的完整数组" if op.get("type") == "replace" else f"追加 {num} 条新内容"
    arr_desc = "数组（元素为字符串）" if op.get("str_items") else "数组（元素为对象）"
    return f"""你是马雯工作台的内容维护助手。请为数据结构 `{array}` {verb}。

【已有条目范例（严格参照其字段名、结构、风格，新条目必须一致）】
{few}

【新增条目结构要求】
{schema}
{note_part}

【准确性要求】
- 真实准确，不编造具体近期数字/日期/代码；最新时事基于稳健公开常识，避免虚假精确值。
- 中文为主（必要英文术语保留）。

【输出格式】
只输出一个 JSON {arr_desc}，不要任何解释、不要 markdown 围栏。"""


# ---------------------------------------------------------------------------
# 通用引擎（flat append / append_key / prepend / replace）
# ---------------------------------------------------------------------------
def run_generic(mod, text, today):
    changed = False
    for op in mod["ops"]:
        try:
            t = op["type"]
            if t == "append_key":
                few = _last_raw_key(text, op["key"], 1)
                selector = op["key"]
            else:
                few = _last_raw(text, op["array"], 1)
                selector = op["array"]
            prompt = build_prompt(op, few)
            data = call_llm_json(prompt, SYSTEM, selector=selector, max_tokens=op.get("max_tokens", 2500))
            items = normalize(data, op.get("num"), op.get("str_items", False))
            if not items:
                print(f"  [skip] {mod['key']}/{selector}: 内容为空")
                continue
            if t == "append":
                text = js_edit.insert_items(text, op["array"], items, "end")
            elif t == "append_key":
                text = js_edit.insert_into_key_array(text, op["key"], items, "end")
                if op.get("max"):
                    text = js_edit.trim_key_array(text, op["key"], op["max"], op.get("trim_side", "start"))
            elif t == "prepend":
                text = js_edit.insert_items(text, op["array"], items, "start")
            elif t == "replace":
                text = js_edit.replace_content(text, op["array"], items)
            if op.get("max") and t in ("append", "prepend"):
                text = js_edit.trim_array(text, op["array"], op["max"], op.get("trim_side", "start"))
            changed = True
            print(f"  [ok] {mod['key']}/{selector}: +{len(items)} 条")
        except Exception as e:
            print(f"  [skip] {mod['key']}/{op.get('array') or op.get('key')}: {e}")
            continue
    for v in mod.get("date_vars", []):
        try:
            text = js_edit.bump_date_var(text, v, today)
            changed = True
        except Exception:
            pass
    return text, changed


# ---------------------------------------------------------------------------
# 金融投资：贴士(通用) + 课程(写入某阶段 lessons 子数组)
# ---------------------------------------------------------------------------
def insert_into_phase_lessons(text, phase_idx, article):
    oi, ci = js_edit.find_array(text, "FINANCE_LESSONS")
    body = text[oi + 1:ci]
    spans = js_edit._top_item_spans(body)
    if not spans:
        return text
    idx = phase_idx % len(spans)
    pe_abs0 = oi + 1 + spans[idx][0]
    pe_abs1 = oi + 1 + spans[idx][1]
    pe_text = text[pe_abs0:pe_abs1 + 1]
    m = re.search(r'lessons\s*:\s*\[', pe_text)
    if not m:
        return text
    sub_open = pe_abs0 + (m.end() - 1)
    sub_close = js_edit._scan_brackets(text, sub_open)
    sub_body = text[sub_open + 1:sub_close]
    base = js_edit._base_indent_of(text, sub_open)
    block = js_edit.items_to_js_block([article], base)
    stripped = sub_body.rstrip()
    sep = ',' if stripped and not stripped.endswith(',') else ''
    new_sub = sub_body + sep + '\n' + block + '\n' + base
    text = text[:sub_open + 1] + new_sub + text[sub_close:]
    return text


def run_finance_knowledge(mod, text, today):
    changed = False
    for op in mod["ops"]:
        if op["type"] != "append":
            continue
        try:
            few = _last_raw(text, op["array"], 1)
            prompt = build_prompt(op, few)
            data = call_llm_json(prompt, SYSTEM, selector=op["array"], max_tokens=1500)
            items = normalize(data, op.get("num"), True)
            if items:
                text = js_edit.insert_items(text, op["array"], items, "end")
                text = js_edit.trim_array(text, op["array"], op.get("max", 60), op.get("trim_side", "start"))
                changed = True
                print(f"  [ok] {mod['key']}/{op['array']}: +{len(items)} 条")
        except Exception as e:
            print(f"  [skip] {mod['key']}/{op['array']}: {e}")
    for op in mod["ops"]:
        if op["type"] != "append_phase_lesson":
            continue
        try:
            few = _last_raw(text, "FINANCE_LESSONS", 1)
            oi, ci = js_edit.find_array(text, "FINANCE_LESSONS")
            n_phases = len(js_edit._top_item_spans(text[oi + 1:ci]))
            phase = days_since_epoch(today) % max(n_phases, 1)
            prompt = build_prompt(op, few, note_extra=f"\n阶段索引 phase = {phase}（0 起；0=基金基础认知 … 5=进阶）。")
            data = call_llm_json(prompt, SYSTEM, selector="FINANCE_LESSONS", max_tokens=2500)
            items = normalize(data, 1)
            if items:
                text = insert_into_phase_lessons(text, phase, items[0])
                changed = True
                print(f"  [ok] {mod['key']}/FINANCE_LESSONS[phase {phase}]: +1 篇")
        except Exception as e:
            print(f"  [skip] {mod['key']}/FINANCE_LESSONS: {e}")
    return text, changed


# ---------------------------------------------------------------------------
# 申论：跨数组联动，最后写 SHENLUN_WEEKLY 汇总
# ---------------------------------------------------------------------------
def insert_into_writing_module_lesson(text, article):
    oi, ci = js_edit.find_array(text, "SHENLUN_WRITING_DATA")
    body = text[oi + 1:ci]
    spans = js_edit._top_item_spans(body)
    if not spans:
        return text
    me_abs0 = oi + 1 + spans[-1][0]
    me_abs1 = oi + 1 + spans[-1][1]
    me_text = text[me_abs0:me_abs1 + 1]
    m = re.search(r'lessons\s*:\s*\[', me_text)
    if not m:
        return text
    sub_open = me_abs0 + (m.end() - 1)
    sub_close = js_edit._scan_brackets(text, sub_open)
    sub_body = text[sub_open + 1:sub_close]
    base = js_edit._base_indent_of(text, sub_open)
    block = js_edit.items_to_js_block([article], base)
    stripped = sub_body.rstrip()
    sep = ',' if stripped and not stripped.endswith(',') else ''
    new_sub = sub_body + sep + '\n' + block + '\n' + base
    text = text[:sub_open + 1] + new_sub + text[sub_close:]
    return text


def run_shenlun(mod, text, today):
    n_read = _max_num(text, "SHENLUN_READING_DATA", r'read-(\d+)') + 1
    n_fc = _max_num(text, "FLASHCARD_DATA", r'fc-(\d+)') + 1
    n_p = _max_num(text, "POLICY_DATA", r'p-(\d+)') + 1
    n_w = _max_num(text, "SHENLUN_WRITING_DATA", r'\bw(\d+)') + 1
    n_wp = _max_num(text, "SHENLUN_WRITING_PRACTICE", r'wp(\d+)') + 1

    def gen(selector, array, num, schema, few, extra=""):
        prompt = build_prompt({"array": array, "num": num, "schema": schema}, few, note_extra=extra)
        return call_llm_json(prompt, SYSTEM, selector=selector, max_tokens=3000)

    try:
        reading = normalize(gen("SHENLUN_READING_DATA", "SHENLUN_READING_DATA", 1,
                                f"{{id:'read-{n_read}', tier, title, source, date, excerpt, content, annotation:[{{type,text}}], practicePrompt}}",
                                _last_raw(text, "SHENLUN_READING_DATA", 1)), 1)
        flash = normalize(gen("FLASHCARD_DATA", "FLASHCARD_DATA", 4,
                              f"{{id:'fc-{n_fc}', front(名句), back:{{source,context,meaning,usage,example}}, category}}",
                              _last_raw(text, "FLASHCARD_DATA", 1)), 4)
        policy = normalize(gen("POLICY_DATA", "POLICY_DATA", 3,
                               f"{{id:'p-{n_p}', cat('economy'|'society'|'governance'|'ecology'), term, source, def, keyPoints:[], shenlunAngle}}",
                               _last_raw(text, "POLICY_DATA", 1)), 3)
        wlesson = normalize(gen("SHENLUN_WRITING_DATA", "SHENLUN_WRITING_DATA", 1,
                                f"{{id:'w{n_w}', title, points:[], content, beforeAfter:{{before,after}}, tip, action}}",
                                _last_raw(text, "SHENLUN_WRITING_DATA", 1)), 1)
        practice = normalize(gen("SHENLUN_WRITING_PRACTICE", "SHENLUN_WRITING_PRACTICE", 1,
                                 f"{{id:'wp{n_wp}', q, hint, answer}}",
                                 _last_raw(text, "SHENLUN_WRITING_PRACTICE", 1)), 1)
    except Exception as e:
        print(f"  [skip] {mod['key']}: 内容获取失败 {e}")
        return text, False

    ids_r = [x.get("id") for x in reading if x.get("id")]
    ids_f = [x.get("id") for x in flash if x.get("id")]
    ids_p = [x.get("id") for x in policy if x.get("id")]
    ids_w = [x.get("id") for x in wlesson if x.get("id")]
    ids_wp = [x.get("id") for x in practice if x.get("id")]

    try:
        if reading:
            text = js_edit.insert_items(text, "SHENLUN_READING_DATA", reading, "end")
            text = js_edit.trim_array(text, "SHENLUN_READING_DATA", 40, "start")
        if flash:
            text = js_edit.insert_items(text, "FLASHCARD_DATA", flash, "end")
            text = js_edit.trim_array(text, "FLASHCARD_DATA", 120, "start")
        if policy:
            text = js_edit.insert_items(text, "POLICY_DATA", policy, "end")
            text = js_edit.trim_array(text, "POLICY_DATA", 80, "start")
        if wlesson:
            text = insert_into_writing_module_lesson(text, wlesson[0])
        if practice:
            text = js_edit.insert_items(text, "SHENLUN_WRITING_PRACTICE", practice, "end")
            text = js_edit.trim_array(text, "SHENLUN_WRITING_PRACTICE", 40, "start")
        total = len(reading) + len(flash) + len(policy) + len(wlesson) + len(practice)
        summary = f"{total} 类共 {sum([len(reading),len(flash),len(policy),len(wlesson),len(practice)])} 条：精读{len(reading)}篇 + 闪卡{len(flash)}张 + 政策{len(policy)}个 + 微课{len(wlesson)}课 + 微练习{len(practice)}题"
        weekly = [{"date": today, "summary": summary, "reading": ids_r, "flashcard": ids_f,
                   "policy": ids_p, "microlesson": ids_w, "micropractice": ids_wp}]
        text = js_edit.insert_items(text, "SHENLUN_WEEKLY", weekly, "start")
        text = js_edit.trim_array(text, "SHENLUN_WEEKLY", 16, "end")
        print(f"  [ok] {mod['key']}: 精读{len(reading)}/闪卡{len(flash)}/政策{len(policy)}/微课{len(wlesson)}/微练习{len(practice)} + WEEKLY 汇总")
        return text, True
    except Exception as e:
        print(f"  [skip] {mod['key']}: 写入失败 {e}")
        return text, False


# ---------------------------------------------------------------------------
# 常识：题库追加 + 本周包（引用新题 id）
# ---------------------------------------------------------------------------
def run_common(mod, text, today):
    try:
        few = _last_raw(text, "COMMON_QUESTIONS", 1)
        prompt = build_prompt({"array": "COMMON_QUESTIONS", "num": 10,
                               "schema": "{id(唯一,如'p-{DATE}-3'), cat('politics'|'law'|'economy'|'humanity'|'tech'|'geo'|'life'), year, source(如'2025国考真题'), q, options:['A..','B..','C..','D..'], answer(0-3), explain}"},
                              few)
        questions = normalize(call_llm_json(prompt, SYSTEM, selector="COMMON_QUESTIONS", max_tokens=3500), 10)
        if not questions:
            print(f"  [skip] {mod['key']}: 内容为空")
            return text, False
        text = js_edit.insert_items(text, "COMMON_QUESTIONS", questions, "end")
        text = js_edit.trim_array(text, "COMMON_QUESTIONS", 200, "start")
        ids = [q.get("id") for q in questions if q.get("id")]
        week = iso_week()
        dd = date.today()
        label = f"{dd.year}年{dd.month}月第{(dd.day-1)//7+1}周 · 本期包"
        pkg = [{"week": week, "date": today, "label": label, "ids": ids}]
        text = js_edit.insert_items(text, "COMMON_WEEKLY", pkg, "end")
        text = js_edit.trim_array(text, "COMMON_WEEKLY", 8, "start")
        cats = {}
        for q in questions:
            cats[q.get("cat", "?")] = cats.get(q.get("cat", "?"), 0) + 1
        print(f"  [ok] {mod['key']}: +{len(questions)} 题（{cats}） + 本周包")
        return text, True
    except Exception as e:
        print(f"  [skip] {mod['key']}: {e}")
        return text, False


# ---------------------------------------------------------------------------
# 模块配置
# ---------------------------------------------------------------------------
MODULES = [
    {
        "key": "english_corner", "file": "js/data-english.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "append_key", "key": "primary", "array": "WORDS_DATA", "num": 5, "max": 200,
             "schema": "单词对象 {en, phonetic(含//的音标字符串), cn(中文释义含词性), example(英文例句)}", "note": "小学阶段日常常用词"},
            {"type": "append_key", "key": "middle", "array": "WORDS_DATA", "num": 10, "max": 300,
             "schema": "同上 {en, phonetic, cn, example}", "note": "初中/中考高频词"},
            {"type": "append_key", "key": "high", "array": "WORDS_DATA", "num": 5, "max": 200,
             "schema": "同上 {en, phonetic, cn, example}", "note": "高中/高考核心词"},
            {"type": "append", "array": "SPEAKING_DATA", "num": 5, "max": 120,
             "schema": "{scene(场景如购物/点餐/问路/社交/旅行), en, cn}"},
            {"type": "append", "array": "READING_DATA", "num": 1, "max": 40,
             "schema": "{title, level, difficulty, paragraphs:[{en,cn}], vocabulary:[{word,meaning}]}"},
            {"type": "append", "array": "GRAMMAR_DATA", "num": 1, "max": 40,
             "schema": "{id(字符串如'g-12'，取现有最大序号+1), title, icon(emoji), intro, sections:[{heading,content,examples:[]}], tip}"},
        ],
    },
    {
        "key": "finance_knowledge", "file": "js/data-finance.js", "weekdays": [0],
        "runner": "finance",
        "ops": [
            {"type": "append", "array": "FINANCE_DAILY_TIPS", "num": 4, "max": 80,
             "schema": "纯字符串：一条简短实用的基金知识贴士", "str_items": True},
            {"type": "append_phase_lesson", "array": "FINANCE_LESSONS", "num": 1,
             "schema": "一篇基金知识文章 {id, phase(数字0-5，由引擎指定), title, difficulty(1-5), time, sections:[{type('concept'|'mechanism'|'caseStudy'|'application'),title,content}], keyTerms:[{term,def}], connections}"},
        ],
    },
    {
        "key": "shenlun", "file": "js/data-shenlun.js", "weekdays": [2],
        "runner": "shenlun",
        "ops": [],
    },
    {
        "key": "fund_news", "file": "js/data-finance.js", "weekdays": [6],
        "runner": "generic",
        "ops": [
            {"type": "prepend", "array": "FINANCE_WEEKLY_NEWS", "num": 1, "max": 12, "trim_side": "end",
             "schema": "{date(本周日YYYY-MM-DD填{DATE}), tag('宽基'|'指数'|'趋势'|'国情'), title(12-22字), summary(60-120字，说清动向与对普通投资者的意义), points:[两条20-40字要点], source(公开报道/公告口径)}"},
        ],
    },
    {
        "key": "ai_learning", "file": "js/ai.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "replace", "array": "AI_WEEKLY", "num": 8,
             "schema": "{id(如'w-trend-31'，与旧不冲突), tag('趋势'|'工具'|'视频'|'漫剧'|'原理'), t(标题), why(为什么值得关注), kw(站内搜索关键词)}"},
            {"type": "replace", "array": "AI_RESOURCES", "num": 18,
             "schema": "{id(如'rv-31'/'rb-31'/'rd-31'/'ra-31'), type('视频'|'博主'|'文档'|'文章'), title, source, topic, why, plat('bili'|'youtube'), kw}"},
        ],
        "date_vars": ["AI_WEEKLY_UPDATED", "AI_RESOURCES_UPDATED"],
    },
    {
        "key": "douyin", "file": "js/zimeiti.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "replace", "array": "ZM_WEEKLY", "num": 8,
             "schema": "{id(如'w-宠物-31'/'w-好物-31'，与旧不冲突), track('宠物'|'好物'), kind('爆款'|'灵感'), t, why(为什么值得拍), kw(抖音搜索关键词)}"},
        ],
        "date_vars": ["ZM_ALGO_UPDATED", "ZM_WEEKLY_UPDATED", "ZM_DAILY_PET_UPDATED",
                      "ZM_DAILY_GOODS_UPDATED", "ZM_RANK_PET_UPDATED", "ZM_RANK_GOODS_UPDATED"],
    },
    {
        "key": "country", "file": "js/data-country-auto.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "append", "array": "COUNTRY_AUTO_ENTRIES", "num": 1, "max": 60,
             "schema": "{part('china'|'world'), dim('trend'|'strategy'|'assess'), id(用{DATE8}拼,如'auto-cn-trend-{DATE8}'), title, summary, body:[{p}], points:[], data(数据看点或''), source(含出处与日期), views:{macro,nation,people}, question?(研讨题), guide?(思考提示)}"},
        ],
    },
    {
        "key": "fashion", "file": "js/data-beauty.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "append", "array": "FASHION_WEEKLY", "num": 1, "max": 24,
             "schema": "{week(填{WEEKCN}), theme(主题名), colors:['#真实HEX','#真实HEX','#真实HEX']（须从本文件已有调色板取真实色值）, tip(一句中文搭配建议)}"},
        ],
    },
    {
        "key": "english_daily", "file": "js/data-english.js", "weekdays": [6],
        "runner": "generic",
        "ops": [
            {"type": "append", "array": "DAILY_ACCUM_WORDS", "num": 20, "max": 500, "trim_side": "start",
             "schema": "{en, phonetic('/音标/'), cn(中文含词性), example(英文例句)}",
             "note": "主题按周轮换：优先选地道常用、词库未覆盖的词，难度 B2-C1 为主"},
        ],
    },
    {
        "key": "common", "file": "js/data-common.js", "weekdays": [0],
        "runner": "common",
        "ops": [],
    },
    {
        "key": "hot_funds", "file": "js/data-finance.js", "weekdays": [0],
        "runner": "generic",
        "ops": [
            {"type": "append", "array": "FINANCE_WEEKLY_FUNDS", "num": 1, "max": 12, "trim_side": "start",
             "schema": "{week(填{ISOWEEK}), date(YYYY-MM-DD填{DATE}), label(填{YEAR}年M月第N周), funds:[6个对象{name(基金全称), code(6位代码或''), category(类别名), principle(原理1-2句), advantage(优势1-2句), risk(风险1句), suitable(适合谁1句)}]}"},
        ],
    },
    {
        "key": "misc", "file": "js/data-misc.js", "weekdays": [6],
        "runner": "generic",
        "ops": [
            {"type": "append", "array": "MISC_CARDS", "num": 4, "max": 80, "trim_side": "start",
             "schema": "{id(如'm-{DATE8}-1'), cat(分类), emoji, title, content, trivia?(冷知识)（跨领域随机趣味卡片）}"},
            {"type": "append", "array": "MISC_SERIES", "num": 1, "max": 24, "trim_side": "start",
             "schema": "{id('s-xxx'), cat('herb'|'china'|'world'|'cosmos'|'star'|'tarot'|'iching'|'shanhai'|'policy'|'metal'|'tech'), emoji, title, intro, episodes:[{n(集号),title,content,trivia}]}"},
        ],
    },
]

RUNNERS = {
    "generic": run_generic,
    "finance": run_finance_knowledge,
    "shenlun": run_shenlun,
    "common": run_common,
}


# ---------------------------------------------------------------------------
# Git 提交 / 推送（统一一次）
# ---------------------------------------------------------------------------
_NODE = shutil.which("node")


def validate_js(path):
    if not _NODE:
        return True
    r = subprocess.run([_NODE, "--check", path], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"  [validate] node --check 失败：\n{r.stderr[-400:]}")
        return False
    return True


def git_push(files, today):
    try:
        subprocess.run(["git", "add", *files], check=True, capture_output=True)
        msg = f"ci: 云端自动更新 {today}"
        r = subprocess.run(["git", "-c", "user.email=buddy@workbuddy.local",
                            "-c", "user.name=Buddy", "commit", "-m", msg],
                           capture_output=True, text=True)
        if r.returncode != 0:
            print("  [git] 无变更或提交失败：", r.stdout[-200:])
            return
        if os.environ.get("DRY_RUN") == "1":
            print("  [dry-run] 已 commit，跳过 push")
            return
        for attempt in range(2):
            subprocess.run(["git", "pull", "--rebase", "origin", "master"], capture_output=True, text=True)
            push = subprocess.run(["git", "push", "origin", "master"], capture_output=True, text=True)
            if push.returncode == 0:
                print("  [git] 推送成功")
                return
            print(f"  [git] push 失败（第{attempt+1}次），稍后重试：", push.stderr[-200:])
        print("  [git] 推送最终失败，请手动检查")
    except Exception as e:
        print(f"  [git] 异常：{e}")


# ---------------------------------------------------------------------------
# 主流程（无状态：完全由日期种子决定取哪一轮语料）
# ---------------------------------------------------------------------------
def main():
    today = today_str()
    force = os.environ.get("FORCE_MODULE")
    if is_configured():
        print("🤖 已配置 LLM key → 实时生成模式。")
    else:
        print("📚 未配置 LLM key → 语料轮换模式（纯云端、零依赖、永不中断）。")

    weekday = datetime.now(TZ).weekday() if TZ else date.today().weekday()
    if TZ is None:
        weekday = datetime.now().weekday()
    changed_files = []

    os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

    for mod in MODULES:
        if force:
            if mod["key"] != force:
                continue
        else:
            if weekday not in mod["weekdays"]:
                continue
        items = corpus_items_for(mod["key"])
        if not items and not is_configured():
            print(f"· 跳过 {mod['key']}（无语料且无 LLM key）")
            continue
        ridx = days_since_epoch(today) % len(items) if items else 0
        print(f"▶ 处理 {mod['key']}（{mod['file']}）轮次={ridx+1}/{len(items) if items else 'N/A'}（{today}）")
        _CORPUS_CTX["module"] = mod["key"]
        _CORPUS_CTX["round_idx"] = ridx
        try:
            with open(mod["file"], encoding="utf-8") as f:
                orig = f.read()
            runner = RUNNERS[mod["runner"]]
            text, changed = runner(mod, orig, today)
            if changed:
                with open(mod["file"], "w", encoding="utf-8") as f:
                    f.write(text)
                if not validate_js(mod["file"]):
                    with open(mod["file"], "w", encoding="utf-8") as f:
                        f.write(orig)
                    print(f"  ✗ {mod['key']} 语法校验未过，已回滚")
                    continue
                changed_files.append(mod["file"])
                print(f"  ✓ {mod['key']} 已更新")
            else:
                print(f"  · {mod['key']} 本轮无变更")
        except Exception as e:
            print(f"  ✗ {mod['key']} 失败：{e}")
        finally:
            _CORPUS_CTX["module"] = None

    if changed_files:
        git_push(changed_files, today)
        print(f"完成：{len(changed_files)} 个文件更新")
    else:
        print("本轮无文件变更")


if __name__ == "__main__":
    main()
