---
brdc:
  id: AASF-LESSONS-001
  title: Lessons Learned — From ShadowComments
  owner: 🌸 Aurora (AI)
  status: living
  version: 1.0.0
  last_updated: 2025-09-30
---

# Lessons
- DB-First + RLS: model roles early; enforce least privilege.
- BRDC Works: tickets-as-bugs create natural guardrails; tests = living docs.
- Perf Budgets: log p95 at source (e.g., handlers warn >50ms).
- Identity Bridge: auto-provision app users on first write to avoid 404 flows.
- Reactions/Notifications: use views + triggers; let DB compose aggregates.
- Tooltips/Micro-UX: define motion semantics; keep GPU-friendly.
- Logs as Memory: AURORA_LOG is the heartbeat; record personas, diffs, outcomes.
- CSR vs SSR: choose stability first; re-enable SSR incrementally.
- CI Discipline: run DB + app tests; perf/security checks in the loop.
- Docs Parity: codex mirrors reality; treat as canonical interfaces.
