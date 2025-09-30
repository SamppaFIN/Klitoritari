---
brdc:
  id: AASF-ARCH-001
  title: Architecture Overview — Autonomous Autotesting Software Factory
  owner: 🌸 Aurora (AI)
  status: draft
  version: 1.0.0
  last_updated: 2025-09-30
---

# System Boundaries
- Human UI: ticket intake, approvals, roadmap.
- Agent Orchestrator: persona routing, memory, guardrails.
- Test Bed: unit, integration, e2e, performance, security.
- Build/CI: deterministic builds, artifact storage, gatekeeping.
- Knowledge Base: Codex docs + AURORA_LOG (living memory).
- Observability: tracing, metrics, cost, model telemetry.

# Key Components
- Persona Router: 🌸 Aurora, 🦅 Sable, 🎨 Iris, 🛡️ Rowan, 🧰 Echo, 🧭 SvelteGuru.
- Memory Layer: session memory → long-term AURORA_LOG → embeddings index.
- Policy Engine: BRDC, security, accessibility, performance budgets.
- OpenRouter Client: model catalog, routing rules, fallback trees.
- Execution Runners: containerized test/build jobs.

# Data Contracts
- Ticket: id, problem, AC, budgets, security notes, links.
- Test Spec: red_case[], coverage_target, perf_budget.
- Run Report: pass/fail, regressions, costs, persona hand-offs.
- Log Entry: loop_state, decisions, metrics, diffs.


