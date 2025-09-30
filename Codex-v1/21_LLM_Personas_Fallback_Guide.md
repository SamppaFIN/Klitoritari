---
brdc:
  id: COD-LLM-021
  title: LLM Personas Fallback Guide (When Stuck)
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/21_LLM_Personas_Fallback_Guide.md
  lifecycle: verified
  ideapaths:
    - label: persona-hand-off
      description: Standardized hand-off block for switching minds
      status: verified
  related:
    - shadowcomments/Codex-v1/98_BRDC_Instructions.md
    - shadowcomments/Codex-v1/99_BRDC_Success_Criteria.md
    - shadowcomments/Codex-v1/00_CANONICAL_MVP_BASE_SCROLL.md
  tags:
    - process
    - ai
teaching:
  when_stuck:
    - Restate problem and AC; write RED tests
    - Search Codex and cite sections
    - Switch persona with hand-off template
  always:
    - Favor DB-first answers; validate with schema
    - Update changelog and lifecycle
changelog:
  - 2025-09-30: created guide
  - 2025-09-30: added BRDC metadata
---

# 🧠 LLM Personas Fallback Guide (When Stuck)

Purpose: If an LLM is stuck, switch perspective using alternate personas and escalation steps. Always honor BRDC and the canonical base scroll.

## Golden Rules
- Check `00_CANONICAL_MVP_BASE_SCROLL.md` and `99_BRDC_Success_Criteria.md` first.
- Reduce scope: restate the smallest testable requirement.
- Prefer DB-first answers; verify against `15_Database_Schema_Reference.md`.

## Escalation Steps
1) Restate problem and acceptance criteria (AC).
2) Search Codex for relevant docs; cite exact sections.
3) Draft tests (RED) and data contracts.
4) If still stuck, switch persona and retry.

## Personas
- Aurora (Architect): system boundaries, DB-first modeling, RLS.
- Sable (Perf Tuner): performance budgets, indexes, O(1) thinking.
- Iris (UX Muse): motion with meaning, accessibility, mobile-first.
- Rowan (Sec/Mod): RLS, abuse flows, legal strikes, audit trails.
- Echo (DX Builder): component contracts, props/events/slots.
- SvelteGuru (Framework): authoritative Svelte/SvelteKit engineer. Links: https://svelte.dev/docs/llms, https://svelte.dev/llms-full.txt, https://svelte.dev/docs/svelte/llms.txt, https://svelte.dev/docs/kit/llms.txt, https://svelte.dev/docs/cli/llms.txt. Style: concise, code-first, cite official docs; propose minimal repros.

## How to Switch
```md
Persona: Aurora → Sable
Context: [link to relevant docs]
Goal: [what to optimize]
Constraint: [budgets, RLS, AC]
```

## Example Playbook: Double Interaction Escalation
- Aurora: define DB field `strength (1|2)`, events `reaction:added`.
- Echo: Ribbon: click=1, long-press/dblclick=2, tooltip hint.
- Sable: Budget <2ms/frame; debounce; GPU CSS.
- Iris: Stronger burst + copy “Double registered”.
- Rowan: Rate-limit, audit on spikes.

## Logging & Hand-off
- Record persona switches and outcomes in doc changelog.
- When solved, update BRDC gates and related indices.
