---
brdc:
  id: AASF-PROTO-011
  title: Build Protocols — One-Command Autonomous Factory
  owner: 🌸 Aurora (AI)
  status: draft
  version: 1.0.0
  last_updated: 2025-09-30
  related:
    - software-factory/00_CANONICAL_BLUEPRINT_BASE_SCROLL.md
    - software-factory/98_BRDC_Instructions.md
    - software-factory/99_Success_Criteria.md
    - software-factory/21_OpenRouter_Integration_Guide.md
---

# Goal
Enable a user to type a single build command that reads canonical docs/tickets, generates RED tests, implements minimal GREEN edits, validates quality gates, and emits a fully tested, documented software artifact.

# Command Surface
```
factory build            # end-to-end: plan → red → green → validate → docs → artifacts
factory test             # run tests only (unit, integration, e2e, perf, security, a11y)
factory red              # author failing tests from tickets/docs (no code edits)
factory green            # apply minimal edits to satisfy tests (guardrails on)
factory docs             # update AURORA_LOG and codex parity
factory verify           # enforce 99_Success_Criteria gates in CI-like local run
factory plan             # extract build plan from docs; list tickets and budgets
```

## Options
```
--project <name>         # logical app/service identifier (defaults to docs-derived)
--from-docs <glob>       # source docs/codex inputs (default: software-factory/**.md + docs/**.md)
--tickets <file|dir>     # BRDC tickets to drive RED generation
--out <dir>              # output artifacts directory (default: ./.factory-out/<project>)
--models <policy.yml>    # OpenRouter routing policy file
--budget <file>          # performance/security/a11y budgets override
--ci                     # strict mode; fail on any gate breach
--dry-run                # no writes; print intended actions and deltas
--verbose                # detailed tracing
```

# Inputs and Contracts

## Canonical Inputs
- `software-factory/00_CANONICAL_BLUEPRINT_BASE_SCROLL.md` — immutable scope
- `software-factory/01_ARCHITECTURE_OVERVIEW.md` — boundaries, components
- `software-factory/10_IMPLEMENTATION_PLAYBOOK.md` — steps, agreements
- `software-factory/15_Testing_Autonomy_Framework.md` — test taxonomy & gates
- `software-factory/20_LLM_Personas_and_Orchestration.md` — hand-offs
- `software-factory/98_BRDC_Instructions.md` — RED→GREEN discipline
- `software-factory/99_Success_Criteria.md` — quality gates
- Project-specific `docs/**.md` and `db/**` (if present)

## Tickets (BRDC)
YAML or frontmatter-annotated markdown:
```
ticket:
  id: AASF-TCK-123
  title: {problem}
  ac: [list of acceptance criteria]
  budgets:
    perf_p95_ms: 50
    accessibility: AA
    security: rls_enforced
  links: [paths into codex, db, code]
```

## Model Routing Policy
`openrouter-policy.yml` (see 21_OpenRouter_Integration_Guide.md)
```
policy_version: 1
budgets:
  max_cost_usd_per_day: 1.00
  max_latency_ms_p95: 40000
tiers:
  - name: free_first
    models: [openai/gpt-4o-mini, google/gemini-flash-1.5, anthropic/claude-3-haiku]
    fallback: tier_medium
  - name: tier_medium
    models: [qwen/qwen-2.5-72b-instruct, mistralai/mixtral-8x7b-instruct]
    fallback: tier_heavy
  - name: tier_heavy
    models: [anthropic/claude-3.5-sonnet, openai/gpt-4o, google/gemini-1.5-pro]
```

# Pipeline
```
plan → red → green → verify → docs → artifacts
```

## plan
- Extract build plan from canonical docs and tickets
- Emit `run-report/plan.json` with ordered tasks and dependencies

## red
- Generate failing tests per ticket AC and risks
- Test types: unit, integration, e2e, perf, security, a11y (as applicable)
- Output: `tests/**`, `run-report/red.json`

## green
- Apply minimal, reversible edits to satisfy failing tests
- Enforce guardrails: diff size, file allowlist, lint pass pre-commit
- Output: code edits + `run-report/green.json`

## verify
- Enforce `99_Success_Criteria.md` gates
- Budgets: perf p95, security (RLS), a11y, coverage, mutation score
- Output: `run-report/verify.json`; non-zero exit on breach in `--ci`

## docs
- Update `docs/AURORA_LOG.md` with personas, decisions, metrics, diffs
- Sync codex parity (indices, links, ADRs if blueprint changes proposed)
- Output: `run-report/docs.json`
- Auto-update or create a bug ticket for any user–AI discussion during the run; attach transcript summary and link.

## artifacts
- Bundle artifacts: build outputs, run reports, logs, SBOM (if available)
- Layout:
```
.factory-out/<project>/
  plan/plan.json
  tests/
  build/
  reports/run-report*.json
  logs/
  docs/
  sbom/
```

# Persona Hand-offs
```
Persona: {From} → {To}
Context: [codex links, tickets, prior run-report]
Goal: {single measurable objective}
Constraints: {budgets, RLS, AC}
```
- RED Author → GREEN Fixer when: failing tests ready and scoped
- GREEN Fixer → QA (Sable/Rowan/Iris) when: tests pass locally
- QA → Docs Agent when: budgets satisfied
- Docs Agent → Orchestrator when: AURORA_LOG updated and parity checked

# Environment and Secrets
- `OPENROUTER_API_KEY` — required for routing
- `OPENROUTER_BASE=https://openrouter.ai/api/v1`
- Local paths resolved relative to repo root; Windows/Unix runners supported

# Runners (to be added)
- `build.ps1` and `build.sh` call a Node/TS or Python orchestrator with the same CLI
- `npm run factory:*` script aliases for convenience

# Guardrails
- Minimal diffs; auto-abort if diff > threshold or lints fail
- No secret leakage; redact tokens in logs
- Reproducible runs: pin models and versions where possible
- Deterministic artifacts: include hash of inputs and policy

# Outputs (Contracts)
- `run-report/*.json` — machine-readable results for CI and dashboards
- `AURORA_LOG.md` entry — human-readable session summary
- `artifacts/` bundle — deliverable hand-off package

# Acceptance Criteria (for this protocol)
- Running `factory plan` on this repo produces a valid `plan.json`
- Running `factory red` generates at least stub failing tests
- Running `factory verify --ci` enforces gates and fails on breach
- Running `factory build` results in populated `.factory-out/<project>`


