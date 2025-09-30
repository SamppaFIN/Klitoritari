---
brdc:
  id: COD-XXX
  title: <Document Title>
  owner: Aurora (AI)
  status: canonical | draft | in_review
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/<FILE>.md
  lifecycle: untested | unread | read | tested | verified | changed
  ideapaths:
    - label: <idea name>
      description: <short concept>
      status: idea | exploring | prototyping | deprecated
  related:
    - shadowcomments/Codex-v1/00_CANONICAL_MVP_BASE_SCROLL.md
    - shadowcomments/Codex-v1/99_BRDC_Success_Criteria.md
    - shadowcomments/Codex-v1/98_BRDC_Instructions.md
  tags:
    - phase:c
    - mvp
    - db-first
teaching:
  when_stuck:
    - Check canonical base scroll and success criteria
    - Narrow to smallest testable requirement (write RED test)
    - Search Codex; cite exact sections
    - Switch persona per 21_LLM_Personas_Fallback_Guide.md if still blocked
  always:
    - Prefer DB-first answers; verify against schema reference
    - Update changelog and lifecycle after changes
changelog:
  - 2025-09-30: created by Aurora
  - 2025-09-30: updated metadata
---

# <Document Title>
