---
brdc:
  id: AASF-CODEX-README
  title: Codex — Canonical, Read-Only Knowledge Base
  owner: 🌸 Aurora (AI)
  status: canonical-index
  version: 1.0.0
  last_updated: 2025-09-30
---

# Codex
Canonical, read-only documents that define scope, architecture, workflows, and success criteria.

## Change Policy
- Files in `Codex/` are treated as read-only. Propose changes via an ADR in `docs/adr/` plus RED tests.
- The canonical blueprint `00_CANONICAL_BLUEPRINT_BASE_SCROLL.md` is immutable. See its Change Policy.

## Contents
- `00_CANONICAL_BLUEPRINT_BASE_SCROLL.md` — immutable scope
- `01_ARCHITECTURE_OVERVIEW.md` — system boundaries
- `10_IMPLEMENTATION_PLAYBOOK.md` — playbook
- `15_Testing_Autonomy_Framework.md` — testing loops
- `20_LLM_Personas_and_Orchestration.md` — personas and hand-offs
- `21_OpenRouter_Integration_Guide.md` — routing policies
- `98_BRDC_Instructions.md` — ticket discipline
- `99_Success_Criteria.md` — quality gates
- `LESSONS_LEARNED.md` — living insights

## How to Propose Changes
1. Open a ticket with Acceptance Criteria and budgets.
2. Draft RED tests proving the need.
3. Author an ADR in `docs/adr/` describing the proposal and impacts.
4. Run `factory verify --ci`. If all gates pass, submit PR.


