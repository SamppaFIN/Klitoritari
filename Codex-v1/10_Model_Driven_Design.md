# 🧱 Model-Driven Design (DB-First)

## Directive
Build database-first, model-driven. The schema is the source of truth; APIs and UI derive from models. The model must be robust and allow additive evolution without breaking changes.

## Principles
- Stable primary keys (UUID v4) and created_at/updated_at on all rows.
- Narrow enums with extension tables to avoid frequent enum churn.
- Soft-deletes via `deleted_at` rather than hard deletes where moderation needs auditability.
- RLS-first: define policies per table before exposing API.
- Event logging: `audit_logs`, `security_events` for traceability.
- Idempotent upserts for counters/aggregates.
- Versioned exports (include schema_version in bundles).

## Extensibility Patterns
- Tagging/labeling via join tables: `entity_tags(entity_id, tag_id)`.
- Polymorphic references with type + id columns or resource tables by domain (prefer explicit FKs where possible).
- Settings/metadata via JSONB columns constrained by CHECKs + generated columns for indexable fields.
- Feature flags via `features(feature, enabled, audience)` with RLS for rollout.
- Append-only ledgers for sensitive transitions (e.g., strikes).

## Migrations Strategy
- Forward-only migrations; never rewrite history.
- Use transactional migrations with `BEGIN; ... COMMIT;`.
- Add columns as NULLABLE → backfill → add NOT NULL and constraints.
- Avoid enum edits: use lookup tables (`reaction_type`, `subscription_tier`) with FKs.
- Partition or archive large audit tables by month for retention.

## Required Core Tables (Phase C)
- `profiles(user_id PK/FK, username unique, bio, mood_emoji, subscription_tier, legal_strikes, settings JSONB)`
- `comments(id PK, resource_id FK, user_id FK, parent_id?, kind, article_type?, body, length_chars, created_at, visibility, moon_phase_snapshot, moon_apex_flag, mood_snapshot, deleted_at?)`
- `reactions(comment_id, user_id, type, strength, created_at, PRIMARY KEY(comment_id, user_id))`
- `flags(id PK, comment_id FK, user_id FK, reason, text, created_at, resolved_at?)`
- `audit_logs(id PK, actor_id FK, action, entity_type, entity_id, created_at, meta JSONB)`
- `security_events(id PK, kind, user_id?, ip_hash, created_at, meta JSONB)`
- `activity(id PK, user_id, kind, subject_type, subject_id, created_at, seen_at?)`
- `mentions(id PK, comment_id FK, mentioned_user_id, created_at)`
- `follows(follower_id, followee_id, created_at, PRIMARY KEY(follower_id, followee_id))`

## Indexing & Performance
- Composite indexes to match access paths (e.g., `comments(resource_id, created_at DESC)`).
- Partial indexes for visibility filters (e.g., NOT deleted).
- GIN indexes for JSONB and full-text search.
- Covering indexes for hot feeds.

## API Derivation
- Derive REST/RPC from table contracts; one-write path per invariant.
- Enforce constraints in DB with CHECKs and FKs; API validates early and mirrors errors.

## Testing
- Migration tests (apply up, run smoke queries, roll forward).
- RLS tests for each role.
- Data integrity tests for FKs and unique constraints.

## Change Control
- Propose model changes via RFC linking to use-cases, constraints, and migration plan.
- Gate with BRDC tests + backfill scripts.
