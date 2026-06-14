#!/usr/bin/env python3
"""
给 ModelCred 提交模型评分的轻量 CLI。

隐私原则：
- 不读取、不上传任何 prompt/response。
- 只提交用户主动选择的：模型、星级、标签、可选评价。
- 评价内容默认留空，由用户自己决定是否填写。

环境变量：
  MODEL_CREDIBILITY_API   站点地址，默认 http://localhost:3000
  MODEL_CREDIBILITY_MODEL 默认模型 slug，未设置则交互式选择

Windows 中文显示：
  如果终端出现乱码，启动前设置 PYTHONIOENCODING=utf-8：
    set PYTHONIOENCODING=utf-8
    python scripts/rate.py

用法：
  python rate.py
"""

import os
import sys
import json
import urllib.request
import urllib.error

API = os.environ.get("MODEL_CREDIBILITY_API", "http://localhost:3000").rstrip("/")

VALID_TAGS = [
    "幻觉",
    "引用造假",
    "回答准确",
    "创意好",
    "收费争议",
    "不安全内容",
    "速度慢",
    "客服/退款",
    "其他",
]


def api_get(path):
    url = f"{API}{path}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"请求失败: {e.code} {e.reason}", file=sys.stderr)
        try:
            print(json.loads(e.read().decode("utf-8")).get("error", ""), file=sys.stderr)
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"无法连接到 {url}: {e}", file=sys.stderr)
        sys.exit(1)


def api_post(path, payload):
    url = f"{API}{path}"
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"提交失败: {e.code} {e.reason}", file=sys.stderr)
        try:
            print(json.loads(e.read().decode("utf-8")).get("error", ""), file=sys.stderr)
        except Exception:
            pass
        sys.exit(1)
    except Exception as e:
        print(f"无法连接到 {url}: {e}", file=sys.stderr)
        sys.exit(1)


def choose_model():
    default = os.environ.get("MODEL_CREDIBILITY_MODEL", "").strip()
    if default:
        return default

    result = api_get("/api/models")
    models = result.get("models", [])
    if not models:
        print("站点没有可用模型", file=sys.stderr)
        sys.exit(1)

    print("\n可用模型：")
    for i, m in enumerate(models, 1):
        provider = m.get("cloud", {}).get("provider", {}).get("name", "未知")
        cloud = m.get("cloud", {}).get("name", "未知")
        print(f"  {i}. {m['name']} ({provider} / {cloud}) [{m['slug']}]")

    while True:
        choice = input("\n选择模型编号，或直接输入 slug: ").replace("\r", "").strip()
        if any(m["slug"] == choice for m in models):
            return choice
        try:
            idx = int(choice) - 1
            if 0 <= idx < len(models):
                return models[idx]["slug"]
        except ValueError:
            pass
        print("无效选择，请重新输入。")


def _read_line(prompt: str) -> str:
    """读取一行输入，兼容 Windows CRLF 与 Unix LF。"""
    try:
        return input(prompt).replace("\r", "").strip()
    except EOFError:
        return ""


def choose_score():
    while True:
        s = _read_line("\n请打分 (1-5，5 为最好): ")
        try:
            score = int(s)
            if 1 <= score <= 5:
                return score
        except ValueError:
            pass
        print("请输入 1 到 5 之间的整数。")


def choose_tags():
    print("\n可选标签（多选，输入编号，用空格或逗号分隔，直接回车跳过）：")
    for i, tag in enumerate(VALID_TAGS, 1):
        print(f"  {i}. {tag}")

    raw = _read_line("选择标签: ")
    if not raw:
        return []

    selected = []
    for part in raw.replace(",", " ").split():
        try:
            idx = int(part) - 1
            if 0 <= idx < len(VALID_TAGS):
                tag = VALID_TAGS[idx]
                if tag not in selected:
                    selected.append(tag)
        except ValueError:
            if part in VALID_TAGS and part not in selected:
                selected.append(part)
    return selected


def choose_comment():
    print("\n可选评价（吐槽/称赞，最多 1000 字；直接回车表示不填写）：")
    print("注意：这句话会公开显示在站点上，请不要包含个人隐私或敏感信息。")
    return _read_line("> ")


def main():
    print("ModelCred · 模型信誉分快速评分")
    print(f"站点: {API}")
    print("本工具不会读取你的任何对话内容，只提交你主动填写的信息。\n")

    model_slug = choose_model()
    score = choose_score()
    tags = choose_tags()
    comment = choose_comment()

    print("\n准备提交：")
    print(f"  模型: {model_slug}")
    print(f"  评分: {score}/5")
    print(f"  标签: {', '.join(tags) if tags else '无'}")
    print(f"  评价: {comment if comment else '无'}")

    confirm = _read_line("\n确认提交？(y/N): ").lower()
    if confirm not in ("y", "yes", "是"):
        print("已取消")
        sys.exit(0)

    payload = {
        "modelSlug": model_slug,
        "score": score,
        "tags": tags,
        "comment": comment,
    }

    result = api_post("/api/ratings", payload)
    if result.get("ok"):
        print(f"\n✓ {result.get('message', '提交成功')}")
    else:
        print(f"\n✗ 提交失败: {result.get('error', '未知错误')}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
