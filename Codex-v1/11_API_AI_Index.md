# 🤖 Canonical API Index — AI & Shared Endpoints

Scope: Centralize API endpoints that power AI-driven features, analytics, search, and shared contracts across the app. DB-first; contracts mirror models.

## Identity & Profiles
```http
GET /api/profiles/:username
PUT /api/profiles/:username           # bio, mood_emoji, privacy
GET /api/profiles/:username/articles  # writer dashboard list
```

## Comments & Reactions
```http
POST /api/comments                     # { resource_id, parent_id?, kind, article_type?, body }
GET  /api/resources/:id/comments       # ?after&limit
POST /api/comments/:id/reactions       # { type, strength:1|2 }
DELETE /api/comments/:id/reactions     # remove my reaction
```

## Moderation
```http
POST   /api/comments/:id/flags         # { reason, text }
POST   /api/mod/reports/:id/resolve    # { action, note }
GET    /api/mod/appeals                # list appeals
POST   /api/mod/appeals/:id/decision   # { outcome, note }
```

## Mentions & Activity
```http
POST /api/mentions                     # create mention { commentId, mentionedUserId }
GET  /api/activity?after&limit         # mentions|reply|follow|mod
POST /api/activity/:id/seen
POST /api/activity/seen-all
```

## Follows
```http
POST /api/follows/:userId
DELETE /api/follows/:userId
GET  /api/follows/:userId/followers
GET  /api/follows/:userId/following
```

## Feeds & Search
```http
GET /api/feeds/top_roses?window&limit
GET /api/feeds/top_diamonds?window&limit
GET /api/feeds/most_buried?window&limit
GET /api/feeds/top_articles?article_type&window&limit

GET /api/search?q&reactions[]&moods[]&time_window&min_len&max_len&article_type&resource_type
```

## Moon & ÆtherLens (AI/analytics)
```http
GET  /api/moon/month?yyyy-mm           # lunar phases, apex bands
GET  /api/ael/insights                 # { insights, scope }
PUT  /api/ael/scope                    # { scope: Off|Basic|Advanced }
GET  /api/ael/export                   # versioned JSON bundle
GET  /api/ael/weather                  # k≥50 public aggregates
```

## Notifications Center
```http
GET  /api/notifications?type&seen
POST /api/notifications/:id/seen
POST /api/notifications/seen-all
```

## Subscriptions (Phase C: admin/manual; billing Phase D)
```http
GET  /api/subscriptions/tiers
PUT  /api/profiles/:username/tier      # admin only
```

## Data Portability
```http
POST /api/export/account               # generates GDPR JSON bundle
GET  /api/export/account/:jobId        # fetch link/status
GET  /api/export/ael                   # ÆL personal export
```

---

## AI Integration Notes
- AetherLens insights are computed from `aether_*` tables; expose scope-aware aggregates only.
- Public AEL Weather enforces k-anonymity (k≥50) at the query level.
- Search can be augmented with AI reranking (Phase D) but MUST return DB-ranked baseline.
- Tooltips and ribbons trigger non-blocking event hooks; AI assistants SHOULD NOT block interactions.

## Security & Privacy
- All endpoints respect RLS; server executes role-guarded RPC where applicable.
- PII (email, passwords) never exposed.
- Rate-limit write endpoints; audit-log sensitive actions.
- Export routes stream files; signed URLs with expiry.

## Versioning & Stability
- Use `X-API-Version` header; breaking changes require new version.
- Include `schema_version` in exports.

## Error Model
```json
{ "error": { "code": "string", "message": "string", "details": {} } }
```

## Performance Targets
- p95 < 50ms for read endpoints on warm cache.
- Cursor pagination for long lists; avoid OFFSET for deep pages.
- GZIP/BR enabled; JSON concise field names.

## Test Contracts (examples)
```ts
it('enforces k-anonymity on /api/ael/weather', async () => {/* … */});
it('prevents reaction strength without login', async () => {/* … */});
```
