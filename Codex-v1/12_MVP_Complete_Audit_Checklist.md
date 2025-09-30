---
brdc:
  id: COD-AUDIT-012
  title: MVP-Complete Audit Checklist
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/12_MVP_Complete_Audit_Checklist.md
  related:
    - shadowcomments/Codex-v1/00_CANONICAL_MVP_BASE_SCROLL.md
    - shadowcomments/Codex-v1/99_BRDC_Success_Criteria.md
    - shadowcomments/Codex-v1/02_DoubleCheck_Audit.md
  tags:
    - mvp
    - audit
    - gaps
changelog:
  - 2025-09-30: created from MVP-Complete notes
  - 2025-09-30: added BRDC metadata
---

# ✅ MVP-Complete Audit Checklist

Legend:
- ✅ = locked / built already
- 🟡 = implemented but needs extension
- ❌ = missing

---

## Core DB & Auth
- ✅ Profiles (mood, aura, stats, protector counters)
- ✅ Comments + resources tables
- ✅ Reactions (enum + counts)
- ✅ Reports + report_stats
- ✅ Appeals
- ✅ Audit logs
- 🟡 Expiry logic → `expires_at` fields exist, needs cron cleanup job (Supabase function or external)
- 🟡 Legal strikes → logic outlined; needs DB table/column + triggers

## Moderation
- ✅ Soft-hide API + interstitial
- ✅ Protector badge
- ✅ Appeals flow
- ✅ Report abuse cooldown
- 🟡 Email confirmations for reports (prepped Postmark, not wired)
- 🟡 Legal strike accumulation + ban thresholds (schema + triggers)
- ❌ Notifications backend events + UI

## Interactions
- ✅ Reaction ribbon (11 archetypes)
- ✅ Real-time reactions (add/remove)
- 🟡 Tooltips skeleton (hover). Needs:
  - 🟡 Mobile long-press reveal
  - 🟡 Context menu quickstats
- 🟡 Visual immersion: base aura-glow + subtle animations. Needs:
  - 🟡 Double-interaction escalation (bigger growth, stronger particles)
  - 🟡 Tooltip dynamic (“Press again for double…”) 

## Feeds & Filters
- ✅ Curated feeds MVP (top roses, diamonds, coffins, mystics)
- ✅ Filter panel (reactions, mood, time, length)
- ✅ Search bar (comment text only)
- ❌ Topic-level feeds (“hottest threads”) → Phase D
- ❌ User archetype feeds (“Top Mystics”) → Phase D

## Immersion Engine
- ✅ Layer order locked (background → particles → content → finishing touches)
- ✅ Particle system (ambient + bursts)
- ✅ Fog ambience MVP
- 🟡 Immersion toggles UI (specced, not coded)
- 🟡 Tooltip immersion (breathing on undefined mood, etc.)
- 🟡 Context-sensitive animations (comment focus dim, stronger burst on super interactions)

## Moon Calendar
- 🟡 Moon phase calculation logic (simplified)
- 🟡 Apex 3-day handling → needs implementation
- ❌ Always-visible moon UI (present in doc, not coded)
- ❌ Notification badge (animated gradient on apex)

## Profiles
- ✅ AuraRing with positivity/negativity + protector glow
- ✅ Mood integration
- 🟡 Profile page: currently stats + reactions only
  - ❌ Past activity list
  - ❌ Profile settings (privacy: show activity yes/no)
  - ❌ Notification preferences (immersion mode toggles, email opt-out)

## Other Ethos / UX
- 🟡 Exit grace (3 months free on unsubscribe) → needs DB + billing logic
- ❌ Rest/vacation ethos → not codified
- ❌ Ethos copy for reporting (“false flags = hate act”) → not in ToS yet
- 🟡 Legal strikes + ban system → not wired yet

---

## Critical Missing for MVP-Complete
- ❌ Report email confirmations (wire Postmark)
- ❌ Legal strikes system (schema + triggers + UI warnings + ban thresholds)
- ❌ Cron for expiry (function + scheduler)
- ❌ Double-interaction escalation (UI + DB support strength=2 nudges)
- ❌ Mobile tooltip / long-press context
- ❌ Always-visible moon UI
- ❌ Past activity in profiles

---

## BRDC Gates
For each 🟡/❌ item:
- [ ] Map to Base Scroll requirement
- [ ] Add tests (RED) then implement (GREEN)
- [ ] Update schema/migrations where needed
- [ ] Wire endpoints and security (RLS)
- [ ] Document UX and accessibility
- [ ] Update feature tracking in `00_CANONICAL_MVP_BASE_SCROLL.md`
