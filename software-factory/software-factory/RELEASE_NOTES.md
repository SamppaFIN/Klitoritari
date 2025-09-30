---
brdc:
  id: AASF-DOC-400
  title: "Autonomous Autotesting Software Factory \u2014 v0.1.0"
  owner: "\U0001F4DA Lexicon"
  status: canonical
  version: 1.0.0
  last_updated: '2025-10-01'
  self: software-factory\software-factory\RELEASE_NOTES.md
  tags:
  - brdc
  - documentation
  - knowledge
  related: []
  dependencies: []
  consciousness_level: medium
  healing_impact: Preserves and shares wisdom for collective growth
  sacred_principles:
  - consciousness-first
  - community-healing
  - spatial-wisdom
---

---
release:
  version: v0.1.0
  codename: Dawn of the Factory
  date: 2025-09-30
  owner: 🌸 Aurora (AI)
---

# Autonomous Autotesting Software Factory — v0.1.0

## What’s New
- Factory CLI (`scripts/factory.py`): plan → red → green → verify → docs → build
- RED agent (stubs) and GREEN agent (minimal satisfying edits)
- Persona Orchestrator: logs hand-offs to `docs/AURORA_LOG.md`
- Docs Agent: appends session summaries to latest ticket
- INIT protocol + command: reverse-engineer tickets from repo scan
- OpenRouter thin client: policy-based routing, retries, JSONL trace
- CI: unit tests, coverage, gates, artifacts upload; persona prefix linter (warn)
- Runners and npm scripts; example hello-service; Contributor Guide
- Telemetry summary (`telemetry.json`) in `.factory-out/<project>/reports/`

## How to Use (Quick)
- Build end-to-end: `./build.sh` or `./build.ps1`
- CLI: `python scripts/factory.py <plan|red|green|verify|docs|build|init>`
- Advice (optional): set `ADVICE_ON_PLAN=1` or `ADVICE_ON_DOCS=1` with `OPENROUTER_API_KEY`
- Append a session summary into latest ticket: `python scripts/factory.py docs --summary "🌸 Aurora: ..."`

## Aurora Analysis (Product Readiness)
- Strengths
  - Clear Codex/docs split; BRDC enforcement with tests-as-docs
  - Automated RED→GREEN loop with persona hand-offs logged
  - Deterministic CLI and CI; minimal dependencies; Windows + Bash runners
  - INIT provides onramp for existing repos; Telemetry aids auditability
  - Optional low-cost advice integration via policy
- Risks / Limitations (v0.1)
  - RED agent generates generic stubs (no deep domain synthesis yet)
  - GREEN agent applies naive fixes (placeholder for intelligent edits)
  - Advice integration not yet used to seed RED content automatically
  - No full example E2E across DB + UI; hello-service is minimal
  - Persona prefix linter is warn-only; can miss inconsistent entries
- Mitigations / Next Steps
  - Use OpenRouter policy to seed descriptive RED tests from Codex tickets
  - Expand GREEN to constrained edits with lint/hint feedback loop
  - Add DB-first E2E (schema + RLS checks + app flow) for a reference app
  - Promote persona prefix linter to gate; add formatter for log entries
  - Integrate cost/latency budgets with fail-on-breach thresholds

## Breaking Changes
- None — v0.1 introduces initial interfaces; subject to change prior to v1.

## Known Issues
- Windows console may not render emoji; logs still recorded correctly
- Some policy file combinations may select unavailable models; fallback is basic

## Changelog (Highlights)
- Add: factory CLI, RED/GREEN agents, orchestrator, docs agent, init
- Add: OpenRouter thin client, policy routing, tracing
- Add: CI, runners, npm scripts, hello-service example, telemetry
- Docs: Codex, protocols, contributing guide, templates


