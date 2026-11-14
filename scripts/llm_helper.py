"""
llm_helper.py — 调用 OpenAI 兼容的聊天接口（零第三方依赖，纯标准库）。

环境变量（由 workflow 从仓库 Secrets 注入）：
  LLM_API_KEY      必填：API Key（若缺，call_llm 抛 RuntimeError）
  LLM_BASE_URL     可选：默认 https://api.openai.com/v1
  LLM_MODEL        可选：默认 gpt-4o-mini
兼容：若未设 LLM_API_KEY 但设了 NEWS_LLM_API_KEY（news 流水线预留），自动复用。
"""

import json
import os
import urllib.request
import urllib.error


def _resolve_cfg():
    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("NEWS_LLM_API_KEY") or ""
    base_url = (os.environ.get("LLM_BASE_URL") or "https://api.openai.com/v1").rstrip("/")
    model = os.environ.get("LLM_MODEL") or "gpt-4o-mini"
    return api_key, base_url, model


def is_configured() -> bool:
    return bool(os.environ.get("LLM_API_KEY") or os.environ.get("NEWS_LLM_API_KEY"))


def call_llm(user_prompt: str, system_prompt: str = "", temperature: float = 0.7,
             max_tokens: int = 2000, timeout: int = 90) -> str:
    """返回模型文本。未配置 key 时抛 RuntimeError。"""
    api_key, base_url, model = _resolve_cfg()
    if not api_key:
        raise RuntimeError("LLM 未配置：请在仓库 Secrets 设置 LLM_API_KEY（或 NEWS_LLM_API_KEY）")

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": user_prompt})

    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    url = base_url + "/chat/completions"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, method="POST")
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {api_key}")

    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read().decode("utf-8")
        obj = json.loads(body)
        return obj["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", "replace")[:500]
        raise RuntimeError(f"LLM HTTP {e.code}: {detail}")
    except Exception as e:  # noqa: BLE001
        raise RuntimeError(f"LLM 调用失败: {e}")


def call_llm_json(user_prompt: str, system_prompt: str = "", **kw) -> object:
    """调用并把返回文本解析为 JSON 对象/数组。解析失败时抛 ValueError。"""
    raw = call_llm(user_prompt, system_prompt, **kw)
    # 去掉可能包裹的 ```json ... ``` 代码围栏
    t = raw.strip()
    if t.startswith("```"):
        t = t.split("```", 2)[1]
        if t.lstrip().startswith("json"):
            t = t.lstrip()[4:]
        t = t.strip()
    try:
        return json.loads(t)
    except json.JSONDecodeError:
        # 退一步：截取第一个 [ 或 { 到最后一个 ] 或 }
        s = t.find("{") if "{" in t else t.find("[")
        e = t.rfind("}") if "}" in t else t.rfind("]")
        if s != -1 and e != -1 and e > s:
            return json.loads(t[s:e + 1])
        raise ValueError(f"LLM 返回不是合法 JSON: {raw[:300]}")
