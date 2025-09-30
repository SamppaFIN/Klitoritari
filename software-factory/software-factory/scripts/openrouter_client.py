#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional

import requests
import yaml


@dataclass
class Policy:
    raw: Dict[str, Any]

    def route_model(self, task: str) -> Optional[str]:
        tiers = self.raw.get("tiers", [])
        # naive: pick first tier whose use_for contains task, else first model of first tier
        for tier in tiers:
            if task in tier.get("use_for", []):
                models = tier.get("models", [])
                return models[0] if models else None
        if tiers and tiers[0].get("models"):
            return tiers[0]["models"][0]
        return None


class OpenRouterClient:
    def __init__(self, base_url: str, api_key: str, referer: str, title: str, trace_dir: Optional[Path] = None):
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.referer = referer
        self.title = title
        self.trace_dir = trace_dir
        if trace_dir:
            trace_dir.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def from_env(trace_dir: Optional[Path] = None) -> Optional["OpenRouterClient"]:
        api_key = os.environ.get("OPENROUTER_API_KEY")
        if not api_key:
            return None
        base = os.environ.get("OPENROUTER_BASE", "https://openrouter.ai/api/v1")
        referer = os.environ.get("HTTP_REFERER", "https://local.dev")
        title = os.environ.get("X_TITLE", "Autonomous Factory")
        return OpenRouterClient(base, api_key, referer, title, trace_dir)

    @staticmethod
    def load_policy(path: Optional[str] = None) -> Optional[Policy]:
        policy_path = path or os.environ.get("OPENROUTER_POLICY", "openrouter-policy.yml")
        try:
            with open(policy_path, "r", encoding="utf-8") as fh:
                data = yaml.safe_load(fh) or {}
            return Policy(raw=data)
        except Exception:
            return None

    def chat(self, model: str, messages: List[Dict[str, str]], max_retries: int = 2, timeout: int = 60) -> Optional[str]:
        url = f"{self.base_url}/chat/completions"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": self.referer,
            "X-Title": self.title,
            "Content-Type": "application/json",
        }
        payload = {"model": model, "messages": messages}

        last_err: Optional[str] = None
        for attempt in range(max_retries + 1):
            try:
                t0 = time.time()
                resp = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout)
                latency_ms = int((time.time() - t0) * 1000)
                resp.raise_for_status()
                data = resp.json()
                content = (data.get("choices") or [{}])[0].get("message", {}).get("content")
                self._trace({
                    "attempt": attempt,
                    "latency_ms": latency_ms,
                    "model": model,
                    "ok": True,
                })
                return content
            except Exception as exc:  # pragma: no cover
                last_err = str(exc)
                self._trace({
                    "attempt": attempt,
                    "model": model,
                    "ok": False,
                    "error": last_err,
                })
                time.sleep(0.5 * (attempt + 1))
        return None

    def _trace(self, record: Dict[str, Any]) -> None:
        if not self.trace_dir:
            return
        try:
            with (self.trace_dir / "openrouter_trace.jsonl").open("a", encoding="utf-8") as fh:
                fh.write(json.dumps(record) + "\n")
        except Exception:
            pass


