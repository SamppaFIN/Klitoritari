---
brdc:
  id: COD-SYS-013
  title: System Orchestra (Subsystems & AI Extension Points)
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/13_System_Orchestra.md
  related:
    - shadowcomments/Codex-v1/11_API_AI_Index.md
    - shadowcomments/Codex-v1/15_Database_Schema_Reference.md
    - shadowcomments/Codex-v1/99_BRDC_Success_Criteria.md
  tags:
    - architecture
    - ai
changelog:
  - 2025-09-30: created systems orchestra
  - 2025-09-30: added BRDC metadata
---

# 🎼 System Orchestra (Subsystems & AI Extension Points)

Goal: Map the platform into robust subsystems with clear boundaries, contracts, and AI-ready extension points. DB-first; APIs mirror models; services are swappable.

## 1) Identity & Access
- Auth, sessions, profiles, roles, RLS.
- Extension points: SSO providers (Phase D), bot/service accounts.
- Owned tables: `profiles`, `follows`.

## 2) Content & Interactions
- Resources, comments, reactions (strength 1/2), flags.
- Extension points: AI moderation suggestions, AI reply drafts, semantic tagging (Phase D).
- Owned tables: `resources`, `comments`, `reactions`, `flags`.

## 3) Moderation & Governance
- Reports, appeals, soft-hide, protector workflow, legal strikes.
- Extension points: AI classifier for abuse triage, auto-summarize appeals.
- Owned tables: `flags`, `appeals`, `audit_logs`, `legal_events` (append-only strikes ledger).

## 4) Activity & Notifications
- Mentions, follows, replies, moderation events; center UI.
- Extension points: AI digest generation, smart priority queues.
- Owned tables: `activity`, `mentions`.

## 5) Feeds & Search
- Curated feeds, filters, full-text search.
- Extension points: AI reranking (kept optional; DB baseline required), vector search (Phase D).
- Owned indexes: FTS indexes, materialized views (optional).

## 6) Moon & ÆtherLens (Analytics)
- Moon calendar, apex countdown; AEL opt-in analytics, k-anonymity weather.
- Extension points: AI correlation insights, recommendation of rest periods.
- Owned tables: `aether_*` family, `platform_stats_daily`.

## 7) Immersion Engine
- Ambient particles, bursts, finishing touches, sacred toggles.
- Extension points: AI-driven theme/mood adjustments, adaptive fog.
- Contracts: Layer interface (`init/configure/pause/resume/destroy`).

## 8) Exports & Portability
- GDPR account export, AEL export.
- Extension points: AI redaction helpers, summarization bundles.
- Contracts: Versioned export schema with `schema_version`.

## 9) Billing & Subscriptions (Phase C admin/manual)
- Tiers and capabilities; Phase D billing provider.
- Extension points: AI perk recommendations.
- Owned tables: `subscriptions`, `profile_tier`.

---

## Event Bus & Hooks
- Internal events: `reaction:added`, `comment:created`, `report:submitted`, `appeal:created`, `activity:created`, `moon:apexSoon`.
- AI hooks: Subscribe to non-blocking topics; respond with suggestions stored separately (never block write path).
- Contract: At-most-once handling; idempotent consumers.

## API Contracts
- Public REST as in `11_API_AI_Index.md`.
- AI-only endpoints (Phase D): `/api/ai/moderation/suggest`, `/api/ai/summary`, `/api/ai/rerank` (must be optional; gated by flags).

## Data Governance
- PII minimization; hashed IPs in `security_events`.
- AEL scope gates all analytics queries; k≥50 for public.
- Legal strikes ledger append-only; admin audit required.

## Observability
- Metrics per subsystem; slow query logs.
- SLOs: p95 < 50ms reads; export jobs tracked; event lag < 2s.

## Extensibility Rules
- Add tables over mutating enums; prefer lookups + FKs.
- Introduce AI features via sidecar services; do not alter core write flows.
- Feature flags for all AI endpoints; default off.
