---
brdc:
  id: AASF-PLAY-010
  title: Implementation Playbook — Autonomous Factory
  owner: 🌸 Aurora (AI)
  status: draft
  version: 1.0.0
  last_updated: 2025-09-30
---

# Step-by-Step
1) Bootstrap repo with test harness and CI skeleton.
2) Install agent orchestrator and wire personas.
3) Add RED Test Authoring Agent (unit→integration→perf).
4) Add GREEN Fix Agent with edit constraints and lints.
5) Add Docs Agent to update AURORA_LOG + codex.
6) Enable OpenRouter client and routing policies.
7) Turn on CI gates from 99_Success_Criteria.

# Working Agreements
- Every PR starts with failing tests.
- Edits are minimal, reversible, and logged.
- Persona switches are recorded with rationale.


