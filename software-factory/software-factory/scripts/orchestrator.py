#!/usr/bin/env python3
from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Optional


@dataclass
class Handoff:
    persona_from: str
    persona_to: str
    goal: str
    context: str = ""


def append_log_entry(log_path: Path, content: str) -> None:
    log_path.parent.mkdir(parents=True, exist_ok=True)
    with log_path.open("a", encoding="utf-8") as fh:
        fh.write(content)


def record_handoff(handoff: Handoff, log_path: Optional[Path] = None) -> Path:
    """Append a persona handoff entry into AURORA_LOG.md and return path used."""
    target = log_path or Path("docs") / "AURORA_LOG.md"
    entry = (
        "\n\n### Persona Handoff\n"
        f"- From: {handoff.persona_from}\n"
        f"- To: {handoff.persona_to}\n"
        f"- Goal: {handoff.goal}\n"
    )
    if handoff.context:
        entry += f"- Context: {handoff.context}\n"
    append_log_entry(target, entry)
    return target


__all__ = ["Handoff", "record_handoff"]


