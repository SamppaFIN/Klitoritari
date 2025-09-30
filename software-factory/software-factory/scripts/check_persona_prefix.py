#!/usr/bin/env python3
"""
Persona prefix linter: ensure persona icon + name prefixes are used in AURORA_LOG.md.

Rule: Lines representing assistant messages must begin with "🌸 Aurora:" (or other persona
icon+name in future). For now, we verify at least one such correctly formatted line exists and
that no lines starting with persona names are missing the icon.

Exit codes:
 0 OK
 1 Violations found
 2 File missing or unreadable
"""
from __future__ import annotations

import re
from pathlib import Path


LOG_PATH = Path("docs") / "AURORA_LOG.md"


def main() -> int:
    if not LOG_PATH.exists():
        print(f"ERROR: {LOG_PATH} not found")
        return 2

    text = LOG_PATH.read_text(encoding="utf-8", errors="ignore").splitlines()

    # Heuristics: Look for lines that look like persona speech and enforce prefix.
    # For now, we check for Aurora specifically.
    correct = 0
    violations = []
    persona_name_only = re.compile(r"^\s*Aurora:\s*")
    correct_prefix = re.compile(r"^\s*🌸\s+Aurora:\s*")

    for i, line in enumerate(text, 1):
        if correct_prefix.search(line):
            correct += 1
        # If a line starts with name but not with icon, flag
        elif persona_name_only.search(line):
            violations.append((i, line.strip()))

    if correct == 0:
        violations.append((0, "No correctly prefixed persona lines found (e.g., '🌸 Aurora: ...')"))

    if violations:
        print("Persona prefix violations:")
        for ln, content in violations:
            if ln > 0:
                print("  L{}: {}".format(ln, content.encode('ascii', 'replace').decode('ascii')))
            else:
                print("  {}".format(content.encode('ascii', 'replace').decode('ascii')))
        return 1

    print("Persona prefix check passed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())


