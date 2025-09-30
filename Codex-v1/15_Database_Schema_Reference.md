---
brdc:
  id: COD-DB-015
  title: Database Schema Reference (Phase C)
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/15_Database_Schema_Reference.md
  related:
    - shadowcomments/Codex-v1/11_API_AI_Index.md
    - shadowcomments/Codex-v1/16_Workflows_Endpoints_DB_Map.md
    - shadowcomments/Codex-v1/13_System_Orchestra.md
  tags:
    - db-first
    - reference
changelog:
  - 2025-09-30: created DB reference
  - 2025-09-30: added BRDC metadata
---

# 🗄️ Database Schema Reference (Phase C)

Note: DB-first, additive evolution. Keys are UUIDv4 unless noted.

## profiles
- user_id PK/FK → auth.users
- username unique
- bio text
- mood_emoji text
- subscription_tier text FK → subscription_tiers(name)
- legal_strikes int default 0
- settings JSONB
- created_at, updated_at

Indexes: (username), GIN(settings)

## resources
- id PK
- type enum: youtube|article|tweet|other (prefer lookup table resource_types)
- title, url unique
- created_at, meta JSONB

Indexes: (url), GIN(meta)

## comments
- id PK
- resource_id FK → resources(id)
- user_id FK → profiles(user_id)
- parent_id FK → comments(id) nullable
- kind enum: plain|article
- article_type enum: opinion|critique|science|health|comedy|mystic|other
- body text
- length_chars int
- visibility enum: public|soft_hidden
- moon_phase_snapshot text
- moon_apex_flag boolean
- mood_snapshot text
- created_at, deleted_at nullable

Indexes: (resource_id, created_at DESC), (user_id, created_at DESC)

## reactions
- comment_id FK → comments(id)
- user_id FK → profiles(user_id)
- type FK → reaction_types(name)
- strength smallint check in (1,2)
- created_at

Primary Key: (comment_id, user_id)
Indexes: (type), (created_at)

## flags
- id PK
- comment_id FK
- user_id FK
- reason text, text text
- created_at, resolved_at

Indexes: (comment_id), (user_id)

## appeals
- id PK
- flag_id FK → flags(id)
- user_id FK
- text, created_at, decided_at, outcome

## audit_logs
- id PK
- actor_id FK → profiles(user_id)
- action text
- entity_type text, entity_id text
- created_at, meta JSONB

## security_events
- id PK
- kind text
- user_id FK nullable
- ip_hash text
- created_at, meta JSONB

## activity
- id PK
- user_id (recipient)
- kind: mention|reply|follow|mod
- subject_type, subject_id
- created_at, seen_at

Indexes: (user_id, created_at DESC), (seen_at)

## mentions
- id PK
- comment_id FK
- mentioned_user_id FK → profiles(user_id)
- created_at

## follows
- follower_id FK → profiles(user_id)
- followee_id FK → profiles(user_id)
- created_at

Primary Key: (follower_id, followee_id)

## aether_* (opt-in analytics)
- aether_opt_in(user_id, scope, consent_date)
- aether_daily(date, metric, value, dim JSONB)
- aether_geo(user_id, country, timezone)
- platform_stats_daily(date, route, visits)

## lookup tables
- reaction_types(name)
- resource_types(name)
- subscription_tiers(name)

## RLS Summary
- profiles: users can read public fields; update self
- comments: read public; create/update own; soft-hide by mods
- reactions: create/delete own
- flags/appeals: create own; mods read/resolve
- activity/mentions: recipient only

## BRDC Verification
- See `docs/BRDC_DB_VERIFICATION.md` for commands, file-level verification, and test pass summary.

## Retention
- security_events: hash IPs; retain severe 180d; others 90d
- audit_logs: archive monthly partitions
