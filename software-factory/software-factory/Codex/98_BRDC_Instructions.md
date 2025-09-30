---
brdc:
  id: AASF-BRDC-098
  title: BRDC Instructions — Autonomous Factory
  owner: 🌸 Aurora (AI)
  status: draft
  version: 1.0.0
  last_updated: 2025-09-30
---

# Golden Rules
- Every ticket is a bug until proven.
- Write RED tests before code.
- Keep diffs minimal and reversible.
- Update AURORA_LOG on every loop.
- Any user–AI discussion MUST create or update a bug ticket capturing all insights.

# Pipeline
Bug → RED → GREEN → Validate (perf+sec+a11y) → Docs → Release

# Required Artifacts
- Ticket with AC and budgets.
- Test files with clear arrange/act/assert.
- Run report with timings and coverage.
- Log entry with persona switches + outcomes.
- Discussion transcript summary attached to the ticket (AI/user comments, decisions).


