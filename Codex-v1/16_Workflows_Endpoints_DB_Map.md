---
brdc:
  id: COD-FLOW-016
  title: Workflows → Endpoints → DB Tables
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/16_Workflows_Endpoints_DB_Map.md
  related:
    - shadowcomments/Codex-v1/14_User_Interaction_Workflows.md
    - shadowcomments/Codex-v1/11_API_AI_Index.md
    - shadowcomments/Codex-v1/15_Database_Schema_Reference.md
  tags:
    - workflows
    - api
    - db
changelog:
  - 2025-09-30: created mapping
  - 2025-09-30: added BRDC metadata
---

# 🔗 Workflows → Endpoints → DB Tables

## React (strength 1/2)
- Endpoint: `POST /api/comments/:id/reactions { type, strength }`
- Tables: `reactions(comment_id,user_id,type,strength)`, counters via materialized views
- Events: `reaction:added`

## Comment / Reply
- Endpoint: `POST /api/comments { resource_id, parent_id?, kind, article_type?, body }`
- Tables: `comments`, `activity(kind=reply)`
- Events: `comment:created`

## Report
- Endpoint: `POST /api/comments/:id/flags { reason, text }`
- Tables: `flags`, `audit_logs`
- Events: `report:submitted`

## Appeals
- Endpoint: `POST /api/mod/appeals { flag_id, text }`
- Tables: `appeals`, `audit_logs`
- Events: `appeal:created`

## Notifications (mark seen)
- Endpoint: `POST /api/activity/:id/seen` | `POST /api/activity/seen-all`
- Tables: `activity(seen_at)`

## Mentions
- Endpoint: `POST /api/mentions { commentId, mentionedUserId }`
- Tables: `mentions`, `activity(kind=mention)`

## Feeds & Search
- Endpoints: `/api/feeds/top_roses|top_diamonds|most_buried|top_articles`, `/api/search`
- Tables: `resources`, `comments`, `reactions` (joins, FTS)

## Profiles (settings)
- Endpoint: `PUT /api/profiles/:username { privacy_settings, mood_emoji }`
- Tables: `profiles(settings, mood_emoji)`

## Moon Calendar
- Endpoint: `GET /api/moon/month?yyyy-mm`
- Tables: None (computed); cache table optional

## ÆtherLens
- Endpoints: `GET /api/ael/insights`, `PUT /api/ael/scope`, `GET /api/ael/export`
- Tables: `aether_opt_in`, `aether_daily`, `aether_geo`

## Legal Strikes (moderation)
- Triggered by: abusive report resolution, confirmed law-breaking
- Tables: `profiles(legal_strikes)`, `legal_events`
- Endpoint (admin): `POST /api/mod/legal_strike { user_id, reason }`

## Expiry Cleanup (cron)
- Task: delete/soft-delete expired rows
- Tables: any with `expires_at`
- Mechanism: Supabase cron or external scheduler hitting RPC
