"""
js_edit.py — 纯文本方式操作工作台数据文件里的 JS 数组 / 日期变量。

设计原则（极其重要）：
- 不解析、不重排已有数组内容，只在其内部「插入 / 删除 / 替换」文本片段。
- 所有定位都基于「括号匹配 + 字符串/注释感知」，不依赖正则一次匹配整段。
- 任何一步出错就抛异常，由调用方捕获后跳过该模块，绝不留半截文件。
"""

import re


# ---------------------------------------------------------------------------
# 括号 / 字符串 / 注释 感知的扫描器
# ---------------------------------------------------------------------------
def _scan_brackets(text: str, start: int) -> int:
    """从 text[start] 处的开括号（[ { ( ）扫描到匹配闭括号，返回其下标。

    正确跳过字符串（' " `）、行注释 // 与块注释 /* */。
    """
    open_ch = text[start]
    close_ch = {'[': ']', '{': '}', '(': ')'}[open_ch]
    depth = 0
    i = start
    n = len(text)
    while i < n:
        c = text[i]
        if c in ("'", '"', '`'):
            q = c
            i += 1
            while i < n:
                if text[i] == '\\':
                    i += 2
                    continue
                if text[i] == q:
                    i += 1
                    break
                i += 1
            continue
        if c == '/' and i + 1 < n and text[i + 1] == '/':
            while i < n and text[i] != '\n':
                i += 1
            continue
        if c == '/' and i + 1 < n and text[i + 1] == '*':
            i += 2
            while i < n and not (text[i] == '*' and i + 1 < n and text[i + 1] == '/'):
                i += 1
            i += 2
            continue
        if c == open_ch:
            depth += 1
        elif c == close_ch:
            depth -= 1
            if depth == 0:
                return i
        i += 1
    raise ValueError(f"未找到匹配括号（起始字符 {open_ch!r} @ {start}）")


def _find_decl_open(text: str, name: str) -> int:
    """定位 `const NAME = [` 中 '[' 的下标。"""
    pat = re.compile(r'(?:const|let|var|window\.\w+|globalThis\.\w+)\s+' + re.escape(name) + r'(?!\w)\s*=\s*\[')
    m = pat.search(text)
    if not m:
        raise KeyError(f"未找到数组声明: {name}")
    return text.index('[', m.start())


def _find_key_open(text: str, key: str) -> int:
    """定位对象字面量里的 `key: [` 中 '[' 的下标（用于嵌套子数组）。"""
    pat = re.compile(re.escape(key) + r'\s*:\s*\[')
    m = pat.search(text)
    if not m:
        raise KeyError(f"未找到键值数组: {key}")
    return text.index('[', m.start())


def find_array(text: str, name: str):
    """返回 (open_idx, close_idx) 或抛异常。"""
    oi = _find_decl_open(text, name)
    ci = _scan_brackets(text, oi)
    return oi, ci


def find_key_array(text: str, key: str):
    oi = _find_key_open(text, key)
    ci = _scan_brackets(text, oi)
    return oi, ci


# ---------------------------------------------------------------------------
# 顶层条目扫描（用于裁剪 / 取样本）
# ---------------------------------------------------------------------------
def _top_item_spans(body: str):
    """返回 body 内每个顶层条目 (start, end) 闭区间下标列表。"""
    spans = []
    i = 0
    n = len(body)
    while i < n and body[i] in ' \t\r\n,':
        i += 1
    if i >= n:
        return spans
    while i < n:
        start = i
        c = body[i]
        if c in ('{', '['):
            j = _scan_brackets(body, i)
            end = j
            i = j + 1
        else:
            depth = 0
            while i < n:
                ch = body[i]
                if ch in ("'", '"', '`'):
                    q = ch
                    i += 1
                    while i < n:
                        if body[i] == '\\':
                            i += 2
                            continue
                        if body[i] == q:
                            i += 1
                            break
                        i += 1
                    continue
                if ch == '{':
                    depth += 1
                    i += 1
                    continue
                if ch == '}':
                    depth -= 1
                    i += 1
                    continue
                if ch == ',' and depth == 0:
                    break
                i += 1
            end = i - 1
        # 去掉结尾空白
        while end > start and body[end] in ' \t\r\n':
            end -= 1
        spans.append((start, end))
        # 跳到下一个
        while i < n and body[i] != ',':
            if body[i] in ' \t\r\n':
                i += 1
            else:
                break
        if i < n and body[i] == ',':
            i += 1
        while i < n and body[i] in ' \t\r\n,':
            i += 1
    return spans


def top_item_count(text: str, name: str) -> int:
    oi, ci = find_array(text, name)
    return len(_top_item_spans(text[oi + 1:ci]))


def last_items_raw(text: str, name: str, k: int = 2) -> str:
    """返回数组末尾 k 个条目的原始文本（作为 LLM 格式范例，不解析）。"""
    oi, ci = find_array(text, name)
    body = text[oi + 1:ci]
    spans = _top_item_spans(body)
    if not spans:
        return ""
    pick = spans[-k:]
    parts = [body[s:e + 1].strip() for (s, e) in pick]
    return "\n\n".join(parts)


# ---------------------------------------------------------------------------
# JSON -> JS 字面量序列化（保留中文反引号风格）
# ---------------------------------------------------------------------------
def _is_ident(s: str) -> bool:
    return bool(re.match(r'^[A-Za-z_$][A-Za-z0-9_$]*$', s))


def json_to_js(val, indent: int = 0) -> str:
    pad = '  ' * indent
    pad1 = '  ' * (indent + 1)
    if isinstance(val, dict):
        if not val:
            return '{}'
        items = []
        for k, v in val.items():
            key = f"'{k}'" if not _is_ident(str(k)) else str(k)
            items.append(f'{pad1}{key}: {json_to_js(v, indent + 1)}')
        return '{\n' + ',\n'.join(items) + '\n' + pad + '}'
    if isinstance(val, list):
        if not val:
            return '[]'
        items = [f'{pad1}{json_to_js(v, indent + 1)}' for v in val]
        return '[\n' + ',\n'.join(items) + '\n' + pad + ']'
    if isinstance(val, str):
        s = val.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
        return f'`{s}`'
    if isinstance(val, bool):
        return 'true' if val else 'false'
    if val is None:
        return 'null'
    return str(val)


def items_to_js_block(items: list, base_indent: str) -> str:
    """把 list[dict|str] 序列化成若干条 JS 字面量，每条缩进 base_indent+'  '。"""
    item_indent = base_indent + '  '
    depth = len(base_indent.split('  ')) + 1
    blocks = []
    for it in items:
        if isinstance(it, str):
            s = it.replace('\\', '\\\\').replace('`', '\\`').replace('${', '\\${')
            blocks.append(item_indent + f'`{s}`')
        else:
            block = json_to_js(it, depth)
            lines = block.split('\n')
            lines = [item_indent + ln if ln.strip() else ln for ln in lines]
            blocks.append('\n'.join(lines))
    return ',\n'.join(blocks)


# ---------------------------------------------------------------------------
# 插入 / 替换 / 裁剪
# ---------------------------------------------------------------------------
def _base_indent_of(text: str, open_idx: int) -> str:
    line_start = text.rfind('\n', 0, open_idx) + 1
    decl = text[line_start:open_idx]
    return ' ' * (len(decl) - len(decl.lstrip(' ')))


def insert_items(text: str, name: str, items: list, pos: str = 'end') -> str:
    """在数组 name 末尾(pos='end')或开头(pos='start')插入 items(list[dict])。"""
    oi, ci = find_array(text, name)
    base = _base_indent_of(text, oi)
    block = items_to_js_block(items, base)
    body = text[oi + 1:ci]
    if pos == 'end':
        stripped = body.rstrip()
        sep = ',' if stripped and not stripped.endswith(',') else ''
        new_body = body + sep + '\n' + block + '\n' + base
        return text[:oi + 1] + new_body + text[ci:]
    else:  # start
        new_body = '\n' + block + ',\n' + body.lstrip('\n')
        return text[:oi + 1] + new_body + text[ci:]


def insert_into_key_array(text: str, key: str, items: list, pos: str = 'end') -> str:
    """向对象里的 `key: [` 子数组插入（用于 WORDS_DATA.primary 等）。"""
    oi, ci = find_key_array(text, key)
    base = _base_indent_of(text, oi)
    block = items_to_js_block(items, base)
    body = text[oi + 1:ci]
    if pos == 'end':
        stripped = body.rstrip()
        sep = ',' if stripped and not stripped.endswith(',') else ''
        new_body = body + sep + '\n' + block + '\n' + base
        return text[:oi + 1] + new_body + text[ci:]
    else:
        new_body = '\n' + block + ',\n' + body.lstrip('\n')
        return text[:oi + 1] + new_body + text[ci:]


def replace_content(text: str, name: str, items: list) -> str:
    """用 items(list[dict]) 整体替换数组内容（用于「刷新」类模块）。"""
    oi, ci = find_array(text, name)
    base = _base_indent_of(text, oi)
    block = items_to_js_block(items, base)
    new_body = '\n' + block + '\n' + base
    return text[:oi + 1] + new_body + text[ci:]


def trim_array(text: str, name: str, max_len: int, side: str = 'start') -> str:
    """裁剪数组到 max_len 条；side='start' 删最旧（头部），'end' 删最新（尾部）。"""
    oi, ci = find_array(text, name)
    body = text[oi + 1:ci]
    spans = _top_item_spans(body)
    if len(spans) <= max_len:
        return text
    remove = len(spans) - max_len
    if side == 'start':
        cut = spans[remove - 1][1] + 1
        j = cut
        while j < len(body) and body[j] in ' \t\r\n,':
            j += 1
        new_body = body[j:]
    else:
        cut = spans[-remove][0]
        k = cut
        while k > 0 and body[k - 1] in ' \t\r\n,':
            k -= 1
        new_body = body[:k]
    return text[:oi + 1] + new_body + text[ci:]


def bump_date_var(text: str, var_name: str, today: str) -> str:
    """把 `const VAR = '...'` / "..." 的日期改成 today。"""
    pat = re.compile(re.escape(var_name) + r'\s*=\s*([\'"])(.*?)\1')
    m = pat.search(text)
    if not m:
        return text
    return text[:m.start(2)] + today + text[m.end(2):]


if __name__ == '__main__':
    # 简易自检
    sample = "const X = [\n  { a: 1 },\n  { a: 2 }\n];\n"
    print("count:", top_item_count(sample, "X"))
    out = insert_items(sample, "X", [{"a": 3, "b": "中文"}], pos="end")
    print(out)
    out2 = trim_array(out, "X", 2, side="start")
    print(out2)
