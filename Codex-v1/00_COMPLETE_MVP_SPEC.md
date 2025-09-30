# 🌟 SHADOWCOMMENTS — COMPLETE-MVP CODEX v1 (Phase C "Canon")
*The Sacred Blueprint for Revolutionary Anti-Censorship Discussion Platform*

## 📋 Document Information
**Version**: 1.0.0  
**Date**: 2025-09-30  
**Doc-ID**: SC-COMPLETE-MVP  
**Status**: Canonical (Phase C Complete)

## 📝 ChangeLog
- 1.0.0 Initial codex import from chat (author: Infinite IRL)

---

## 🎯 0) Product Frame (MVP)

### **Core Mission**
Comment on external resources; powerful filters; rich "article-comments"; distinctive reaction ribbon with double-strength; subtle immersion; moon + mood meta; ÆtherLens (ÆL) opt-in analytics; transparent moderation.

### **Platform Specifications**
- **Platforms**: Web (SvelteKit). Mobile later via Capacitor.
- **No WebGL** (2D canvas/SVG/CSS only).
- **No push/email** in MVP (visual notifications only).
- **Everything public by default** (read). Private controls: profile fields you toggle, mentions block, soft-hidden comments visibility (owner/admin).

---

## 🗄️ 1) Data Model (tables that matter to MVP)

### **Core Tables**

#### **users** (Supabase auth)
Standard Supabase authentication table.

#### **profiles**
```sql
user_id (PK/FK), 
username (unique), 
bio, 
mood_emoji, 
settings JSON (immersion level, notifications preset, show_location_text), 
supporter (bool)
```

#### **resources**
```sql
id, 
url (unique), 
title, 
type (youtube|article|tweet|other), 
created_at
```

#### **topics**
```sql
id, 
resource_id FK, 
title (optional), 
created_at
```
*(optional for MVP; resources alone can host threads)*

#### **comments**
```sql
id, 
resource_id FK, 
user_id FK, 
parent_id?, 
kind (plain|article), 
article_type (opinion|critique|science|health|comedy|mystic|other), 
body, 
length_chars (denorm), 
created_at, 
visibility (public|soft_hidden), 
moon_phase_snapshot (enum), 
moon_apex_flag (bool), 
mood_snapshot (emoji), 
deleted_at?
```

#### **reactions**
```sql
(comment_id, user_id) PK, 
type (ENUM: 11 types), 
strength SMALLINT CHECK IN (1,2), 
created_at
```

#### **resource_reactions**
```sql
(resource_id, user_id, type, strength, created_at)
```
*same schema as reactions for "topic-level" ribbon*

#### **flags**
```sql
id, 
comment_id, 
reporter_id, 
reason (enum), 
text, 
created_at, 
status (open|upheld|dismissed|severe), 
resolved_by?, 
resolved_at?
```

#### **audit_logs**
```sql
id, 
actor_user_id?, 
action, 
subject_type, 
subject_id, 
meta JSONB, 
created_at
```

#### **security_events**
```sql
id, 
event_type, 
ts, 
user_id?, 
ip_hash, 
raw_ip?, 
ua_family, 
meta, 
case_id?
```
*(raw_ip only when severe/case_id)*

#### **follows**
```sql
(follower_id, followee_id, created_at) PK
```

#### **activity**
```sql
id, 
user_id (recipient), 
kind (mention|reply|follow|mod), 
subject_type/id, 
created_at, 
seen_at?
```

#### **mentions**
```sql
(comment_id, mentioned_user_id, created_at)
```

#### **platform_stats_daily**
```sql
(date, route, views, comments_count, reactions_count)
```

#### **aether_opt_in**
```sql
(user_id PK, scope enum Off|Basic|Advanced, consented_at)
```

#### **aether_geo**
```sql
(user_id PK, country_iso2, region?, city?, verified bool)
```

#### **aether_daily**
```sql
(date, country_iso2, moods_json, reactions_json, users_active, comments, reactions, bots_excluded bool)
```

### **Indexes**
FKs, plus: 
- `comments(resource_id, created_at)`
- `reactions(comment_id)`
- `resource_reactions(resource_id)`
- `flags(comment_id,status)`
- `activity(user_id, created_at)`
- `platform_stats_daily(date,route)`
- `aether_daily(date,country)`
- `mentions(mentioned_user_id)`

### **RLS (essentials)**
- **comments**: public SELECT (read), INSERT/UPDATE by owner; soft_hidden hidden from public (except owner/admin); admin bypass
- **reactions**: SELECT public, INSERT/DELETE by owner (user_id = auth.uid())
- **resource_reactions**: same
- **flags**: INSERT by logged-in; SELECT own + admin; resolve only admin
- **aether tables**: aether_daily & platform_stats_daily public read; aether_opt_in/geo owner read/write; security_events admin-only
- **activity**: recipient read; write by system; admin read

### **Retention**
- **security_events**: 90d hashed; 180d for severe (raw_ip), then purge
- **analytics raw** (if any): 14d temp
- **Comments never auto-delete** in MVP. (You can add "expiry tiers" later.)

---

## ⚙️ 2) Algorithms & Canonical Helpers

### **2.1 Moon**
- **Meeus-based lunar phase** (JS port) used everywhere
- **Apex windows**: New, First Quarter, Full, Last Quarter each have a 3-day band (-1, 0, +1)
- **Countdown**: shows days until next apex; disappears during active apex
- **Calendar**: a 13-moonth view (29–30 days each), indexed by lunations (no Gregorian grid)
- **Modal ↔ Full page** share the same helpers

### **2.2 Reactions**
- **11 types**; double interaction = strength 2 (distinct UI & counts)
- **MVP removal**: omit; (Phase D adds right-click/long-press to remove)
- **Resource-level reactions** mirror comment-level schema

### **2.3 ÆtherLens**
- **Opt-in scopes**: Off | Basic | Advanced
- **Public aggregates**: k-anonymity k ≥ 50 per country/day; else bucket "Other"
- **B excludes bots**; toggle in demo
- **Personal ÆL**: mood & reaction tendencies, moon correlation, 30/90-day charts; export JSON/CSV
- **Platform stats**: route/day counters (no user linkage)

### **2.4 Moderation**
- **Reports** with over-report throttling
- **Protector signal** via reaction and upheld-report ratio
- **legal_strikes counter** (private)
- **Soft-hide**: comment remains for owner and admin (badged)
- **Severe → case logging**: on uphold severe, write security_events with raw_ip (case_id), audited

---

## 🔌 3) API Contract (SvelteKit)

### **Auth & context**
- `locals.user` populated; admin via role claim

### **Comments**
- `POST /api/comments {resource_id, parent_id?, kind, article_type?, body}`
  → stamps mood_snapshot, moon_phase_snapshot, moon_apex_flag, length_chars; parses @mentions → mentions + activity
- `GET /api/resources/:id/comments?after?&limit?` pagination
- `PATCH /api/comments/:id {visibility:'soft_hidden'}` admin/owner
- *(Delete later; MVP: keep.)*

### **Reactions**
- `POST /api/comments/:id/reactions {type, strength:1|2}`
- `POST /api/resources/:id/reactions {type, strength}`
- *(Removal in Phase D.)*

### **Reports**
- `POST /api/comments/:id/flags {reason, text}` with rate limit + CAPTCHA on spikes
- `POST /api/mod/flags/:id/resolve {status, notes, severe?}` (admin): writes audit_logs; if severe, create case in security_events (with raw_ip)

### **Follows & Activity**
- `POST /api/follow/:user_id` / `DELETE ...`
- `GET /api/activity?after?` (recipient only)
- **Activity kinds**: mention, reply, follow, mod; UI pulses only

### **Filters & Feeds**
- `GET /api/search` params: q, reactions[], moods[], time_window, min_len, max_len, article_type?
- `GET /api/feeds/top_roses?window=week&limit=20` (+ top_diamonds, most_buried, top_articles, per article_type)

### **Exports**
- `GET /api/me/export` (account + content + derived snapshots)
- `GET /api/me/ael/export` (personal ÆL)

### **ÆL & Stats**
- `POST /api/ael/optin {scope}`
- `PUT /api/ael/geo {country_iso2, region?, city?}` (verified set server-side if header present)
- `GET /api/aether/daily.json|.csv` public aggregates (k-safe)
- **Page/view hooks** call `increment_platform_stats(route, kind)`

---

## 🎨 4) UI Component Contracts

### **ReactionRibbon.svelte**
- **Props**: `countsByType` (includes strength breakdown), `userReaction` (type+strength or null), `disabled?`, `immersionLevel`
- **Events**: `toggle({type, nextStrength})` where `nextStrength ∈ {1,2}`
- **UX**: hover breathe; tooltip; on strength 2 → bigger growth + themed burst + text pop ("DOUBLE " etc)
- **Full set order**: 11 reaction types

### **Particles**
- **ParticlesAmbient** (behind content) — low CPU, pauses when tab hidden
- **ParticlesBursts** (on top of content, below menu) — `burst({palette, amount})`

### **Moon UI**
- **MoonWidget** (header): shows current phase glyph, apex ring when active, countdown badge with ▲/▼ increment/decrement (days to next apex). Click → open MoonCalendarModal
- **MoonCalendarModal**: lunation view (current moonth), apex rings on relevant days, next/prev with buttons. Link "Open Full Calendar"
- **MoonCalendarPage** (full screen): 13-moonth layout; sidebar toggles for Planets/Weekdays, Alchemical signs, Gemstones (static content MVP); Next Solstice/Equinox card with countdown; global & personal Tarot (Waite/Thoth toggle); all share the same moon helpers

### **ActivityPanel**
- Minimal list grouped by thread; aura pulse on unseen; "mark as seen"

### **Profile**
- **AuraRing**: base color by positivity/negativity, micro-band Writer (posted ≥N articles), micro-band Supporter (paid)
- **Tabs**: Overview (aura, bio), Articles, Activity, ÆL (read-only)
- **Writer Dashboard** (sub-view): list/manage own article-comments (publish/unpublish, filter by article_type)

### **SacredSettings (stub)**
- Immersion level slider (Low/Default/High)
- Notifications preset (Minimal/Standard)
- Privacy (toggle show_location_text)
- ÆL scope selector (Off/Basic/Advanced), Export & Erase

### **Mentions**
- Inline highlight @username; tooltip/long-press card (bio, aura, follow, block mentions)

---

## 🛡️ 5) Moderation Logic (baked)

- **Report rate limits**; heuristic over-reporter throttle
- **Protector signal** = + upheld ratio
- **legal_strikes field** increases on upheld severe
- **Soft-hide** available to moderators; owner sees with badge
- **Severe uphold** → security case with raw_ip (audited, retention 180d)
- **All actions** go to audit_logs (actor, subject, reason)

---

## 🔒 6) Security & Abuse

- **Per-route & per-user rate limits** for: posts, reactions, mentions, reports
- **CAPTCHA** on abnormal spikes (new or low-rep accounts)
- **RLS** reviewed above
- **security_events retention** as specified

---

## ⚡ 7) Performance Principles

- **Comment lists paginate** (cursor `after=<created_at,id>`)
- **Indexes** in §1
- **Particles budgeted**; pause on visibility hidden
- **Filters & feeds** run server-side; debounce client
- **No realtime** for feeds (threads only get live reaction updates)

---

## 🔐 8) Privacy & Transparency

- **Public aggregates** k-safe; "Other" bucket
- **Personal ÆL** explicit opt-in; export & erase
- **Transparency pages** ship (quarterly stats once you have them)
- **DNT handling** deferred (explicit choice)

---

## 🌙 9) Moon, Tarot, Gem/Alchemica (MVP detail)

- **Moon**: 3-day apex bands for 4 phases; countdown only before next apex; unified helpers feed modal + full page
- **Tarot**: global daily card (date+salt), personal daily card (user_id+date), history stored; deck toggle Waite/Thoth; no interpretations yet
- **Gemstones & Alchemical content**: static, concise; sidebar + duplicated under the calendar for discoverability

---

## ⚠️ 10) Deviations from earlier drafts (to avoid confusion)

- **Calendar is lunar** (13-moonth), not Gregorian month view. Prior snippets using a 7×5 grid are superseded by this codex
- **Apex bands unified** (3 days for New/Quarter/Full/Quarter)
- **Reactions removal** is Phase D, not MVP
- **No email/push** in MVP; visual pulses only
- **Everything public** to read by default; soft-hidden used instead of hard delete (MVP)

---

## ✅ 11) QA Gates (what "done" means)

### **Performance**
- **Perf**: a thread with 2k comments remains 60fps scroll; p95 query for page load ≤ 50ms on indexed endpoints

### **Privacy**
- **Privacy**: attempts to fetch others' personal ÆL are denied; public /aether shows no sub-k country rows

### **Abuse**
- **Abuse**: low-rep spam of reports/mentions hits throttles; blocked mentions do not notify

### **Data**
- **Data**: /api/me/export & /api/me/ael/export contain schema_version, stable IDs, and derived snapshots (mood, moon at post)

### **UI**
- **UI**: apex rings & double-interaction bursts do not tank mid-phone FPS; tooltips behave on mobile long-press

---

## 🏗️ 12) Build Order (short)

1. **Repo/env** & /api/health
2. **Stats & ÆL** tables, views, retention
3. **RLS & rate limits**
4. **Comment/reaction endpoints** (incl. strength 2)
5. **Reports/mod/soft-hide/audit/case logging**
6. **Filters & curated feeds** endpoints
7. **Moon helpers** + modal + full page (+ solstice/equinox + tarot)
8. **Particles ambient/burst** & ribbon UI polish
9. **Profile** (AuraRing micro-bands, writer dashboard)
10. **Activity panel**; follows; mentions UX
11. **SacredSettings**; ÆL opt-in panel; exports
12. **Public /aether**; docs; QA pass

---

## 🎯 Why you can trust this even if the chat history is huge

This codex is **self-contained**: models, endpoints, UI contracts, policies, and acceptance tests are all here.

If something must change, we edit this document (single source of truth), not piecemeal memories.

You (or your co-dev) can implement every item using only this file; if any ambiguity appears, I'll update the codex, not hand-wave.

**This is the canonical specification for ShadowComments MVP implementation.**
