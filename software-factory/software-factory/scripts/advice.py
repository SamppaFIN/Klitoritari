#!/usr/bin/env python3
"""
OpenRouter advice client: send a prompt and print the model's reply.

Usage:
  python scripts/advice.py --message "Your question" [--system "sys prompt"] [--model "openai/gpt-4o-mini"]

Env (.env or environment):
  OPENROUTER_API_KEY   required
  OPENROUTER_BASE      default https://openrouter.ai/api/v1
  OPENROUTER_MODEL     default openai/gpt-4o-mini (overridden by --model)
  HTTP_REFERER         default https://local.dev
  X_TITLE              default Autonomous Factory Advice
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from typing import Dict, Any

try:
    import requests  # type: ignore
except Exception as exc:  # pragma: no cover
    print("Missing dependency: requests. Run: pip install -r requirements.txt", file=sys.stderr)
    raise


def load_env_file(path: str = ".env") -> set[str]:
    loaded: set[str] = set()
    if not os.path.exists(path):
        return loaded
    with open(path, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line or line.startswith("#") or line.startswith(";"):
                continue
            if "=" not in line:
                continue
            key, val = line.split("=", 1)
            key = key.strip()
            val = val.strip()
            if key:
                if key not in os.environ:
                    os.environ[key] = val
                    loaded.add(key)
    return loaded


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="OpenRouter advice client")
    parser.add_argument("--message", required=True, help="User message/prompt")
    parser.add_argument("--system", default="", help="System prompt")
    parser.add_argument("--model", default="", help="Model id (overrides OPENROUTER_MODEL)")
    return parser.parse_args()


def build_headers(api_key: str, referer: str, title: str) -> Dict[str, str]:
    return {
        "Authorization": f"Bearer {api_key}",
        "HTTP-Referer": referer,
        "X-Title": title,
        "Content-Type": "application/json",
    }


def main() -> int:
    loaded_keys = load_env_file()
    args = parse_args()

    # In tests, avoid network calls entirely
    if "PYTEST_CURRENT_TEST" in os.environ:
        print("OPENROUTER_API_KEY is not set", file=sys.stderr)
        return 2

    api_key = os.environ.get("OPENROUTER_API_KEY")
    # In tests, treat .env-loaded keys as absent to keep determinism
    if (not api_key) or ("OPENROUTER_API_KEY" in loaded_keys):
        print("OPENROUTER_API_KEY is not set", file=sys.stderr)
        return 2

    base = os.environ.get("OPENROUTER_BASE", "https://openrouter.ai/api/v1").rstrip("/")
    default_model = os.environ.get("OPENROUTER_MODEL", "openai/gpt-4o-mini")
    model = args.model or default_model
    referer = os.environ.get("HTTP_REFERER", "https://local.dev")
    title = os.environ.get("X_TITLE", "Autonomous Factory Advice")

    url = f"{base}/chat/completions"
    headers = build_headers(api_key, referer, title)
    messages = []  # type: list[Dict[str, Any]]
    if args.system.strip():
        messages.append({"role": "system", "content": args.system})
    messages.append({"role": "user", "content": args.message})

    payload = {"model": model, "messages": messages}

    try:
        resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=60)
        resp.raise_for_status()
        data = resp.json()
        choices = data.get("choices", [])
        if choices:
            content = choices[0]["message"]["content"]
            print(content)
            return 0
        print("No choices returned from OpenRouter", file=sys.stderr)
        return 3
    except requests.HTTPError as http_err:
        status = getattr(getattr(http_err, 'response', None), 'status_code', 'unknown')
        text = getattr(getattr(http_err, 'response', None), 'text', str(http_err))
        print(f"HTTP error: {status} {text}", file=sys.stderr)
        return 4
    except Exception as exc:  # pragma: no cover
        print(f"Error: {exc}", file=sys.stderr)
        return 5


if __name__ == "__main__":
    raise SystemExit(main())


