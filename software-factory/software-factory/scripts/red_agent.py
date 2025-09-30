#!/usr/bin/env python3
"""
RED Test Authoring Agent (stub):
Reads Codex and docs to generate failing test stubs under the factory out dir.
"""
from __future__ import annotations

import re
from pathlib import Path
from typing import List


def find_markdown_files(root: Path, globs: List[str]) -> List[Path]:
    results: List[Path] = []
    for pattern in globs:
        results.extend(root.glob(pattern))
    # de-duplicate while preserving order
    seen = set()
    unique: List[Path] = []
    for p in results:
        if p not in seen and p.is_file():
            seen.add(p)
            unique.append(p)
    return unique


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "_", text)
    return text.strip("_")


def extract_titles(md_text: str) -> List[str]:
    titles: List[str] = []
    for line in md_text.splitlines():
        if line.startswith("# ") or line.startswith("## "):
            titles.append(line.lstrip("# ").strip())
    return titles[:5]  # limit for stub generation


def generate_test_stub(file_path: Path, titles: List[str]) -> str:
    name = slugify(file_path.stem)
    lines = [
        'import pytest',
        '',
        f'# RED stub tests generated for {file_path.as_posix()}',
    ]
    if not titles:
        titles = [file_path.stem]
    for idx, title in enumerate(titles, start=1):
        test_name = slugify(f"red_{name}_{idx}")
        lines += [
            '',
            f'def test_{test_name}():',
            '    pytest.fail("RED: implement according to Codex/AC")',
        ]
    return "\n".join(lines) + "\n"


def run_red_generation(repo_root: Path, out_dir: Path, doc_globs: List[str]) -> int:
    out_tests_dir = out_dir / "tests_red"
    out_tests_dir.mkdir(parents=True, exist_ok=True)
    docs = find_markdown_files(repo_root, doc_globs)
    generated: List[str] = []
    for md in docs:
        try:
            text = md.read_text(encoding="utf-8")
        except Exception:
            continue
        titles = extract_titles(text)
        test_code = generate_test_stub(md, titles)
        target = out_tests_dir / f"test_{slugify(md.stem)}.py"
        target.write_text(test_code, encoding="utf-8")
        generated.append(target.as_posix())
    return len(generated)


__all__ = [
    "run_red_generation",
]


