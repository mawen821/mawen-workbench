#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
新闻听单 · 预生成中文语音 mp3

为什么需要它：用户手机侧「在线 TTS 接口」与「系统语音引擎」都靠不住
（无中文语音包 / 运营商拦第三方域名），只有**同源静态 mp3** 是 100% 可播的。
所以把每天新闻的「标题+摘要」离线合成成 mp3，随站点一起部署。

前端约定（js/app.js）：
  zhAudioKey(text) = 'news-' + djb2_hex(utf8(text.trim()))
  音频路径 = ./audio/news/<key>.mp3
本脚本的 djb2 必须与前端逐字节一致，否则文件名对不上。

用法：
  python _gen_news_audio.py            # 只生成 NEWS_DATA 里最新的日期
  python _gen_news_audio.py 2026-10-29 # 指定日期
  python _gen_news_audio.py --all      # 全部日期
  python _gen_news_audio.py --keep 5   # 生成后只保留最近 5 个日期的音频
"""
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

WS = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(WS, "audio", "news")
MANIFEST = os.path.join(OUT_DIR, "manifest.json")
NODE = r"C:\Users\Lenovo\.workbuddy\binaries\node\versions\22.22.2\node.exe"
JS_DATA = os.path.join(WS, "js", "data-news.js")

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"


def djb2_key(text, prefix="news"):
    """与前端 zhAudioKey 完全一致的 djb2 哈希"""
    h = 5381
    for b in text.strip().encode("utf-8"):
        h = ((h << 5) + h + b) & 0xFFFFFFFF
    return "%s-%08x" % (prefix, h)


def load_news_data():
    """用 node 读出 data-news.js 里的 NEWS_DATA，避免正则解析出错"""
    tmp = os.path.join(WS, "_tmp_news_dump.cjs")
    with open(tmp, "w", encoding="utf-8") as f:
        f.write(
            "const fs=require('fs'),vm=require('vm'),path=require('path');\n"
            "const code=fs.readFileSync(path.join(__dirname,'js','data-news.js'),'utf8')"
            "+'\\n;module.exports={NEWS_DATA};';\n"
            "const m={exports:{}};const ctx={module:m,exports:m.exports,console};\n"
            "vm.createContext(ctx);vm.runInContext(code,ctx);\n"
            "process.stdout.write(JSON.stringify(m.exports.NEWS_DATA||{}));\n"
        )
    try:
        out = subprocess.run([NODE, tmp], capture_output=True, timeout=120)
        if out.returncode != 0:
            raise RuntimeError(out.stderr.decode("utf-8", "ignore")[:500])
        return json.loads(out.stdout.decode("utf-8"))
    finally:
        try:
            os.remove(tmp)
        except OSError:
            pass


def fetch_tts(text, retries=3):
    """百度翻译中文 TTS：免 key、无 Referer 校验、支持较长中文（实测 200 字仍 200）"""
    q = urllib.parse.urlencode({"lan": "zh", "text": text, "spd": "3", "source": "wise"})
    url = "https://fanyi.baidu.com/gettts?" + q
    for i in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                data = r.read()
                if r.status == 200 and len(data) > 2000:
                    head = data[:3]
                    # mp3 帧头 0xFFFB/0xFFF3 或 ID3 标签
                    if head[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2") or head == b"ID3":
                        return data
            return None
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, OSError):
            if i == retries - 1:
                return None
            time.sleep(1.5 * (i + 1))
    return None


def compress_mp3(path, kbps=24, sample_rate=22050):
    """把百度返回的高码率立体声 mp3 压成单声道低码率语音，体积约减 60%+
    目的：音频要随 git 仓库长期累积，必须控制单条体积（语音 24kbps 完全够听清）"""
    try:
        import miniaudio
        import lameenc
    except ImportError:
        return False
    try:
        dec = miniaudio.decode_file(path, nchannels=1, sample_rate=sample_rate)
        pcm = dec.samples.tobytes() if hasattr(dec.samples, "tobytes") else bytes(dec.samples)
        enc = lameenc.Encoder()
        enc.set_bit_rate(kbps)
        enc.set_in_sample_rate(sample_rate)
        enc.set_channels(1)
        enc.set_quality(5)
        out = enc.encode(pcm) + enc.flush()
        if len(out) > 1000:
            with open(path, "wb") as f:
                f.write(out)
            return True
    except Exception as e:
        print("   (压缩失败，保留原文件：%s)" % str(e)[:60])
    return False


def main():
    args = [a for a in sys.argv[1:]]
    keep = 0
    if "--keep" in args:
        i = args.index("--keep")
        keep = int(args[i + 1])
        del args[i:i + 2]
    do_all = "--all" in args
    if do_all:
        args.remove("--all")
    explicit = [a for a in args if not a.startswith("-")]

    os.makedirs(OUT_DIR, exist_ok=True)
    data = load_news_data()
    dates = sorted(data.keys())
    if not dates:
        print("没有新闻数据")
        return 1

    targets = explicit if explicit else dates
    if not do_all and not explicit:
        targets = [dates[-1]]

    manifest = {}
    if os.path.exists(MANIFEST):
        try:
            with open(MANIFEST, "r", encoding="utf-8") as f:
                manifest = json.load(f)
        except Exception:
            manifest = {}

    total_ok = total_skip = total_fail = 0
    for d in targets:
        items = data.get(d) or []
        keys = []
        ok = skip = fail = 0
        for n in items:
            text = (n.get("title") or "").strip() + "。" + (n.get("summary") or "").strip()
            if not text.strip("。"):
                continue
            key = djb2_key(text)
            dest = os.path.join(OUT_DIR, key + ".mp3")
            keys.append(key)
            if os.path.exists(dest) and os.path.getsize(dest) > 2000:
                skip += 1
                continue
            blob = fetch_tts(text)
            if blob:
                with open(dest, "wb") as f:
                    f.write(blob)
                before = len(blob)
                compressed = compress_mp3(dest)
                after = os.path.getsize(dest)
                ok += 1
                print("  OK   %s  %5.1fKB -> %5.1fKB  %s%s" % (
                    key, before / 1024.0, after / 1024.0,
                    "" if compressed else "(未压缩) ", text[:24]))
            else:
                fail += 1
                print("  FAIL %s  %s" % (key, text[:26]))
            time.sleep(0.4)  # 轻微节流，避免被限流
        manifest[d] = keys
        total_ok += ok
        total_skip += skip
        total_fail += fail
        print("[%s] 共 %d 条：新生成 %d，已存在 %d，失败 %d" % (d, len(items), ok, skip, fail))

    # 清理超出保留窗口的日期音频
    if keep > 0:
        keep_dates = sorted(manifest.keys())[-keep:]
        removed = 0
        for d in list(manifest.keys()):
            if d in keep_dates:
                continue
            for key in manifest.get(d, []):
                p = os.path.join(OUT_DIR, key + ".mp3")
                if os.path.exists(p):
                    os.remove(p)
                    removed += 1
            del manifest[d]
        print("按 --keep %d 清理：删除 %d 个音频文件，保留日期 %s" % (keep, removed, ", ".join(keep_dates)))

    manifest_path = MANIFEST
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=1, sort_keys=True)

    size = sum(os.path.getsize(os.path.join(OUT_DIR, x)) for x in os.listdir(OUT_DIR) if x.endswith(".mp3"))
    print("完成：新生成 %d，跳过 %d，失败 %d；目录共 %.1fMB" % (total_ok, total_skip, total_fail, size / 1048576.0))
    return 0 if total_fail == 0 else 2


if __name__ == "__main__":
    sys.exit(main())
