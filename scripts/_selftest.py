"""_selftest.py — 用 mock LLM 验证 cloud_sync 的插入/裁剪/语法逻辑（不调真实接口）。

做法：对每个模块，复制真实 js 文件到临时文件，用 mock LLM 跑对应 runner，
写入临时文件后 node --check 校验语法，并统计条目数变化。全部通过说明
「文本编辑层」不会破坏仓库；真实 LLM 调用质量由生产环境保证。
"""

import os
import re
import shutil
import sys
import tempfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import cloud_sync
import js_edit

NODE = "C:/Users/Lenovo/.workbuddy/binaries/node/versions/22.22.2/node.exe"

# ---- mock LLM ----
def gen_item(i, name):
    return {
        "id": f"{name.lower()}-{i}",
        "title": f"测试标题{i}",
        "cn": f"中文内容{i}",
        "content": f"测试内容{i}",
        "summary": f"测试摘要{i}",
        "points": [f"要点{i}-1", f"要点{i}-2"],
        "views": {"macro": f"宏观{i}", "nation": f"国家{i}", "people": f"人民{i}"},
    }

MOCK = {}

def make_gen(name):
    def g(num):
        return [gen_item(i, name) for i in range(1, num + 1)]
    return g

# 各数组的 mock
for arr in ["WORDS_DATA", "SPEAKING_DATA", "READING_DATA", "GRAMMAR_DATA",
            "FINANCE_LESSONS", "SHENLUN_READING_DATA", "FLASHCARD_DATA",
            "POLICY_DATA", "SHENLUN_WRITING_DATA", "SHENLUN_WRITING_PRACTICE",
            "FINANCE_WEEKLY_NEWS", "AI_WEEKLY", "AI_RESOURCES", "ZM_WEEKLY",
            "COUNTRY_AUTO_ENTRIES", "FASHION_WEEKLY", "DAILY_ACCUM_WORDS",
            "COMMON_QUESTIONS", "FINANCE_WEEKLY_FUNDS", "MISC_CARDS", "MISC_SERIES"]:
    MOCK[arr] = make_gen(arr)

# 字符串数组
MOCK["FINANCE_DAILY_TIPS"] = lambda num: [f"测试基金贴士{i}" for i in range(1, num + 1)]

def mock_call(prompt, system="", **kw):
    m = re.search(r"数据结构\s*`(\w+)`", prompt)
    name = m.group(1) if m else ""
    mnum = re.search(r"追加 (\d+) 条", prompt) or re.search(r"约 (\d+) 条", prompt)
    num = int(mnum.group(1)) if mnum else 1
    gen = MOCK.get(name, lambda n: [gen_item(1, name or "x")])
    return gen(num)

cloud_sync.call_llm_json = mock_call

# ---- 测试 ----
def count_arr(path, name):
    text = open(path, encoding="utf-8").read()
    return js_edit.top_item_count(text, name)

def run():
    today = cloud_sync.today_str()
    results = []
    for mod in cloud_sync.MODULES:
        src = os.path.join(cloud_sync.os.getcwd(), mod["file"])
        if not os.path.exists(src):
            src = mod["file"]
        tmp = tempfile.NamedTemporaryFile(suffix=".js", delete=False, dir=".")
        shutil.copy2(src, tmp.name)
        tmp.close()
        mod_copy = dict(mod)
        mod_copy["file"] = tmp.name
        before = {}
        for op in mod.get("ops", []):
            a = op.get("array") or op.get("key")
            if a:
                try:
                    before[a] = count_arr(tmp.name, a)
                except Exception as e:
                    before[a] = f"ERR:{e}"
        try:
            text = open(tmp.name, encoding="utf-8").read()
            runner = cloud_sync.RUNNERS[mod["runner"]]
            text, changed = runner(mod_copy, text, today)
            open(tmp.name, "w", encoding="utf-8").write(text)
            # node --check
            import subprocess
            r = subprocess.run([NODE, "--check", tmp.name], capture_output=True, text=True)
            ok = r.returncode == 0
            after = {}
            for op in mod.get("ops", []):
                a = op.get("array") or op.get("key")
                if a:
                    try:
                        after[a] = count_arr(tmp.name, a)
                    except Exception as e:
                        after[a] = f"ERR:{e}"
            results.append((mod["key"], ok, r.stderr[-200:] if not ok else "", before, after, changed))
        except Exception as e:
            results.append((mod["key"], False, f"EXC:{e}", before, {}, False))
        os.unlink(tmp.name)

    print("=" * 70)
    all_ok = True
    for key, ok, err, before, after, changed in results:
        status = "PASS" if ok else "FAIL"
        if not ok:
            all_ok = False
        print(f"[{status}] {key} (changed={changed})")
        if before or after:
            for a in set(list(before) + list(after)):
                print(f"    {a}: {before.get(a)} -> {after.get(a)}")
        if err:
            print(f"    ERR: {err}")
    print("=" * 70)
    print("ALL PASS" if all_ok else "SOME FAILED")
    sys.exit(0 if all_ok else 1)

if __name__ == "__main__":
    run()
