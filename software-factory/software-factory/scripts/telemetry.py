from __future__ import annotations

import json
from pathlib import Path
from typing import Dict, Any


def write_run_summary(project: str, out_dir: Path) -> Path:
    reports_dir = out_dir / "reports"
    logs_dir = out_dir / "logs"
    summary: Dict[str, Any] = {
        "project": project,
        "reports": sorted([p.name for p in reports_dir.glob("*.json")]) if reports_dir.exists() else [],
        "openrouter_trace": (logs_dir / "openrouter_trace.jsonl").as_posix() if (logs_dir / "openrouter_trace.jsonl").exists() else None,
        "perf_budget_ms": int((out_dir.parent / ".." / "env.example").exists() or 0),
    }
    target = reports_dir / "telemetry.json"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(json.dumps(summary, indent=2), encoding="utf-8")
    return target


__all__ = ["write_run_summary"]


