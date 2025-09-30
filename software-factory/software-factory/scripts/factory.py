#!/usr/bin/env python3
"""
Factory CLI skeleton: plan, red, green, verify, docs, build

Generates minimal run-report JSON files and output folders as per PROTOCOLS.md.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
from pathlib import Path
from datetime import datetime
import subprocess

ROOT = Path(__file__).resolve().parents[1]
from scripts.red_agent import run_red_generation
from scripts.green_agent import satisfy_red_stubs
from scripts.orchestrator import Handoff, record_handoff
from scripts.openrouter_client import OpenRouterClient
from scripts.telemetry import write_run_summary


def write_json(path: Path, data: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as fh:
        json.dump(data, fh, indent=2)


def now_iso() -> str:
    return datetime.utcnow().replace(microsecond=0).isoformat() + "Z"


def get_advice(system: str, message: str, model: str | None = None) -> str | None:
    """Call advice.py if OPENROUTER_API_KEY is present; return content or None."""
    if not os.environ.get("OPENROUTER_API_KEY"):
        return None
    cmd = ["python", str(ROOT / "scripts" / "advice.py"), "--message", message]
    if system:
        cmd += ["--system", system]
    if model:
        cmd += ["--model", model]
    try:
        out = subprocess.check_output(cmd, stderr=subprocess.STDOUT, text=True, cwd=str(ROOT))
        return out.strip()
    except Exception:
        return None


def detect_gaps(repo_root: Path) -> dict:
    gaps: dict = {"tests": False, "coverage": False, "ci": False, "docker": False,
                  "security": False, "perf_budget": False, "a11y": False, "openrouter": False,
                  "db_rls": False}
    # tests
    tests_dir = repo_root / "tests"
    gaps["tests"] = not (tests_dir.exists() and any(tests_dir.glob("test_*.py")))
    # coverage (pytest.ini with --cov or coverage config)
    pytest_ini = repo_root / "pytest.ini"
    if pytest_ini.exists() and "--cov" in pytest_ini.read_text(encoding="utf-8"):
        gaps["coverage"] = False
    else:
        gaps["coverage"] = True
    # CI
    gaps["ci"] = not (repo_root / ".github" / "workflows").exists()
    # Docker
    gaps["docker"] = not (repo_root / "Dockerfile").exists()
    # security (bandit in requirements-test.txt)
    req_test = repo_root / "requirements-test.txt"
    if req_test.exists() and "bandit" in req_test.read_text(encoding="utf-8").lower():
        gaps["security"] = False
    else:
        gaps["security"] = True
    # perf budget (env/example variables)
    env_example = repo_root / "env.example"
    perf_keys = ["PERF_P95_MS"]
    gaps["perf_budget"] = not (env_example.exists() and all(k in env_example.read_text(encoding="utf-8") for k in perf_keys))
    # a11y
    gaps["a11y"] = not (env_example.exists() and "A11Y_STANDARD" in env_example.read_text(encoding="utf-8"))
    # openrouter
    gaps["openrouter"] = not (env_example.exists() and "OPENROUTER_API_KEY" in env_example.read_text(encoding="utf-8"))
    # db/rls (look for local db dir with RLS cues)
    db_dir = repo_root / "db"
    if db_dir.exists():
        # naive search for 'row level security' or 'RLS' in .sql
        found_rls = False
        for sql in db_dir.rglob("*.sql"):
            txt = sql.read_text(encoding="utf-8", errors="ignore").lower()
            if "row level security" in txt or "enable row level security" in txt or "rls" in txt:
                found_rls = True
                break
        gaps["db_rls"] = not found_rls
    else:
        gaps["db_rls"] = True
    return gaps


def write_bug_ticket(tickets_dir: Path, title: str, body: str) -> Path:
    tickets_dir.mkdir(parents=True, exist_ok=True)
    slug = title.lower().replace(" ", "-")
    path = tickets_dir / f"AASF-BUG-{slug}.md"
    content = (
        "---\n"
        "ticket:\n"
        "  id: AASF-BUG-XXX\n"
        f"  title: {title}\n"
        "  type: bug\n"
        "  status: open\n"
        "  ac:\n"
        "    - Define acceptance criteria\n"
        "  budgets:\n"
        "    perf_p95_ms: 50\n"
        "    accessibility: AA\n"
        "    security: rls_enforced\n"
        "  links:\n"
        "    - Codex/98_BRDC_Instructions.md\n"
        "    - Codex/99_Success_Criteria.md\n"
        "---\n\n"
        f"## Summary\n{body}\n\n"
        "## Discussion Transcript Summary\n- User: \n- AI: \n- Decisions: \n\n"
        "## Proposed Tests (RED)\n- Unit: \n- Integration: \n"
    )
    path.write_text(content, encoding="utf-8")
    return path


def cmd_plan(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    report = {
        "phase": "plan",
        "timestamp": now_iso(),
        "project": project,
        "docs": args.from_docs,
        "tickets": args.tickets,
        "plan": [
            {"id": "plan-01", "task": "scan codex/docs", "status": "pending"},
            {"id": "plan-02", "task": "extract tickets", "status": "pending"},
        ],
    }
    if os.environ.get("ADVICE_ON_PLAN"):
        advice = None
        client = OpenRouterClient.from_env(trace_dir=out_dir / "logs")
        policy = OpenRouterClient.load_policy()
        model = (policy and policy.route_model("plan")) or os.environ.get("OPENROUTER_MODEL")
        if client and model:
            advice = client.chat(model, [
                {"role": "system", "content": "You are Aurora planning next steps for a software factory."},
                {"role": "user", "content": f"Given docs: {args.from_docs} and tickets: {args.tickets}, suggest 3 concrete next actions."}
            ])
        if not advice:
            advice = get_advice(
                system="You are Aurora planning next steps for a software factory.",
                message=f"Given docs: {args.from_docs} and tickets: {args.tickets}, suggest 3 concrete next actions.",
                model=os.environ.get("OPENROUTER_MODEL"),
            )
        if advice:
            report["advice"] = advice
    write_json(out_dir / "reports" / "plan.json", report)
    print(str(out_dir / "reports" / "plan.json"))
    return 0


def cmd_red(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    # generate failing tests from Codex/docs
    doc_globs = []
    for token in (args.from_docs or "").split():
        doc_globs.append(token)
    count = run_red_generation(ROOT, out_dir, doc_globs or ["Codex/*.md", "docs/*.md"])
    report = {
        "phase": "red",
        "timestamp": now_iso(),
        "generated_count": count,
        "out_dir": str(out_dir / "tests_red"),
        "notes": "RED: failing stubs generated from docs",
    }
    write_json(out_dir / "reports" / "red.json", report)
    print(str(out_dir / "reports" / "red.json"))
    return 0


def cmd_green(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    tests_red_dir = out_dir / "tests_red"
    modified = satisfy_red_stubs(tests_red_dir)
    report = {
        "phase": "green",
        "timestamp": now_iso(),
        "files_modified": modified,
        "guardrails": {"diff_max_lines": int(os.environ.get("FACTORY_DIFF_MAX_LINES", "500"))},
    }
    write_json(out_dir / "reports" / "green.json", report)
    print(str(out_dir / "reports" / "green.json"))
    return 0


def cmd_verify(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    report = {
        "phase": "verify",
        "timestamp": now_iso(),
        "gates": {
            "perf_p95_ms": int(os.environ.get("PERF_P95_MS", "50")),
            "coverage_min": float(os.environ.get("COVERAGE_MIN", "0.9")),
            "mutation_score_min": float(os.environ.get("MUTATION_SCORE_MIN", "0.7")),
            "a11y_standard": os.environ.get("A11Y_STANDARD", "AA"),
        },
        "result": "pass",
    }
    write_json(out_dir / "reports" / "verify.json", report)
    print(str(out_dir / "reports" / "verify.json"))
    return 0


def cmd_docs(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    # Append session summary to latest ticket if provided
    summary = getattr(args, 'summary', '') or os.environ.get("DOCS_SESSION_SUMMARY", "")
    appended_to = None
    if summary:
        ticket_dir = Path("docs") / "tickets"
        if ticket_dir.exists():
            tickets = sorted(ticket_dir.glob("*.md"), key=lambda p: p.stat().st_mtime, reverse=True)
            if tickets:
                latest = tickets[0]
                with latest.open("a", encoding="utf-8") as fh:
                    fh.write("\n\n## Session Summary (" + now_iso() + ")\n")
                    fh.write(summary + "\n")
                appended_to = latest.as_posix()
    # Optional advice note
    advice_note = None
    if os.environ.get("ADVICE_ON_DOCS"):
        advice_note = None
        client = OpenRouterClient.from_env(trace_dir=out_dir / "logs")
        policy = OpenRouterClient.load_policy()
        model = (policy and policy.route_model("docs")) or os.environ.get("OPENROUTER_MODEL")
        if client and model:
            advice_note = client.chat(model, [
                {"role": "system", "content": "Summarize session outcomes for the log in 2 sentences."},
                {"role": "user", "content": summary or "Summarize the latest session for docs."}
            ])
        if not advice_note:
            advice_note = get_advice(
                system="Summarize session outcomes for the log in 2 sentences.",
                message=summary or "Summarize the latest session for docs.",
                model=os.environ.get("OPENROUTER_MODEL"),
            )
    report = {
        "phase": "docs",
        "timestamp": now_iso(),
        "updated": ["docs/AURORA_LOG.md"],
        "ticket_appended": appended_to,
    }
    if advice_note:
        report["advice_note"] = advice_note
    write_json(out_dir / "reports" / "docs.json", report)
    print(str(out_dir / "reports" / "docs.json"))
    return 0


def cmd_build(args: argparse.Namespace) -> int:
    # simple orchestrated sequence
    # Plan
    rc = cmd_plan(args)
    if rc != 0:
        return rc
    # RED handoff: Aurora -> RED Author
    record_handoff(Handoff(persona_from="🌸 Aurora", persona_to="🧰 Echo", goal="Generate RED stubs"))
    rc = cmd_red(args)
    if rc != 0:
        return rc
    # GREEN handoff: RED Author -> GREEN Fixer
    record_handoff(Handoff(persona_from="🧰 Echo", persona_to="🌸 Aurora", goal="Minimal edits to pass RED"))
    rc = cmd_green(args)
    if rc != 0:
        return rc
    # QA handoff: GREEN -> QA (Sable/Rowan/Iris)
    record_handoff(Handoff(persona_from="🌸 Aurora", persona_to="🦅 Sable", goal="Verify gates (perf/sec/a11y)"))
    rc = cmd_verify(args)
    if rc != 0:
        return rc
    # DOCS handoff: QA -> Docs Agent
    record_handoff(Handoff(persona_from="🦅 Sable", persona_to="🌸 Aurora", goal="Update docs/logs"))
    rc = cmd_docs(args)
    if rc != 0:
        return rc
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_dir = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    (out_dir / "build").mkdir(parents=True, exist_ok=True)
    write_json(out_dir / "reports" / "build.json", {"phase": "build", "timestamp": now_iso(), "result": "ok"})
    # Telemetry summary
    write_run_summary(project, out_dir)
    print(str(out_dir))
    return 0


def cmd_init(args: argparse.Namespace) -> int:
    project = args.project or os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory")
    out_root = Path(args.out or os.environ.get("FACTORY_OUT_DIR", ".factory-out")).joinpath(project)
    tickets_dir = Path("docs") / "tickets"
    gaps = detect_gaps(ROOT)
    created: list[str] = []
    mapping = {
        "tests": ("Missing test coverage", "No test files detected under tests/"),
        "coverage": ("Missing coverage enforcement", "Coverage thresholds not enforced in pytest.ini"),
        "ci": ("CI not configured", "No GitHub Actions workflow found"),
        "docker": ("Ephemeral env missing", "Dockerfile not present"),
        "security": ("Security scan missing", "Bandit not configured in test deps"),
        "perf_budget": ("Performance budgets missing", "PERF_P95_MS not defined"),
        "a11y": ("Accessibility checks missing", "A11Y_STANDARD not defined"),
        "openrouter": ("Advice channel not configured", "OPENROUTER_API_KEY not present in env.example"),
        "db_rls": ("Database RLS missing", "Row Level Security not detected in db/*.sql; enforce least privilege"),
    }
    for key, missing in gaps.items():
        if missing:
            title, body = mapping[key]
            p = write_bug_ticket(tickets_dir, title, body)
            created.append(str(p))
    if not created:
        # Always create a baseline review ticket so the INIT has a visible artifact
        p = write_bug_ticket(tickets_dir, "Initialization baseline review",
                             "Record baseline; confirm gates, tickets, and RED generation are correct.")
        created.append(str(p))
    # Generate initial RED stubs
    run_red_generation(ROOT, out_root, ["Codex/*.md", "docs/*.md"])
    write_json(out_root / "reports" / "init.json", {"phase": "init", "timestamp": now_iso(), "gaps": gaps, "created": created})
    print(str(out_root / "reports" / "init.json"))
    return 0


def add_common(sub: argparse.ArgumentParser) -> None:
    sub.add_argument("--project", default=os.environ.get("FACTORY_PROJECT_NAME", "autonomous-factory"))
    sub.add_argument("--from-docs", dest="from_docs", default="Codex/*.md docs/*.md")
    sub.add_argument("--tickets", default="docs/tickets/")
    sub.add_argument("--out", default=os.environ.get("FACTORY_OUT_DIR", ".factory-out"))


def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(description="Autonomous Factory CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    s_plan = sub.add_parser("plan", help="extract build plan from docs")
    add_common(s_plan)
    s_plan.set_defaults(func=cmd_plan)

    s_red = sub.add_parser("red", help="generate failing tests (stub)")
    add_common(s_red)
    s_red.set_defaults(func=cmd_red)

    s_green = sub.add_parser("green", help="apply minimal edits (stub)")
    add_common(s_green)
    s_green.set_defaults(func=cmd_green)

    s_verify = sub.add_parser("verify", help="enforce quality gates (stub)")
    add_common(s_verify)
    s_verify.set_defaults(func=cmd_verify)

    s_docs = sub.add_parser("docs", help="update logs/docs (stub)")
    add_common(s_docs)
    s_docs.add_argument("--summary", default="", help="Session summary to append to latest ticket")
    s_docs.set_defaults(func=cmd_docs)

    s_build = sub.add_parser("build", help="end-to-end pipeline (stub)")
    add_common(s_build)
    s_build.set_defaults(func=cmd_build)

    s_init = sub.add_parser("init", help="reverse-engineer tickets from implementation")
    add_common(s_init)
    s_init.set_defaults(func=cmd_init)

    return p


def main() -> int:
    parser = build_parser()
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())


