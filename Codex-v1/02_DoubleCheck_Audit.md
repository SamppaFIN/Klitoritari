# ✅ Double-Check Audit (Canonical Validation)

## 📋 Document Info
- Version: 1.0.0
- Date: 2025-09-30
- Doc-ID: SC-DOUBLE-CHECK-AUDIT
- Status: Canonical

---

## 🔁 Double-check audit

### Already specced/covered (don’t duplicate)
- Core DB: users, profiles, comments, reactions (with strength 1/2), audit_logs, flags.
- RLS: enforced per user (can only edit/delete own comments, reactions).
- Immersion Engine: background/svg/particles/content/finishing touches, ribbon interactions, double-interactions, particle bursts.
- Moon Calendar: always-visible icon, lite modal + apex bands, countdown, full-screen toggle.
- Mentions: parser, activity, block system → new today but consistent.
- Export: full account bundle, ÆL bundle → stable versioned.
- Moderation: reports, appeals, soft-hide, Protector role, strikes.
- Filters/Search: reactions, mood, time window, length, free-text, article-type.
- Profiles: AuraRing, writer dashboard, activity list.
- Feeds: curated by reaction, article-type. → all these are consistent. no contradictions or duplicates.

---

### Missing / incomplete (add to list)

1) Subscription classes / plans (Profiles + billing)
- DB: `subscriptions` table + `profiles.subscription_tier` ENUM (free, basic, normal, gold, supporter).
- API: assign/update tier; expose perks in profile JSON.
- UI: AuraRing badge or profile decoration (minimal for MVP).
- Payment: stub only → manual/admin assignment; actual billing integration Phase D.
- AC:
  - [ ] At least 4 tiers exist
  - [ ] Tier controls capabilities (e.g., free = read + react only; basic = can post; higher tiers = images/perks)

2) Notification center
- Current: visual aura pulses + activity panel.
- Missing: one central page/tab where all activity is collected (mentions, follows, replies, moderation).
- MVP UI: list view with filters (type, seen/unseen).
- AC:
  - [ ] Central notifications page exists
  - [ ] Filter by type and seen/unseen
  - [ ] Mark-all-seen works

3) Settings → Privacy toggle
- We specced SacredSettings stub, but need explicit “Hide my recent activity from profile” toggle.
- Behavior: Affects profile activity query.
- AC:
  - [ ] Toggle appears in Settings/Privacy
  - [ ] Profile activity feed excludes items when hidden is ON

4) Legal strikes system
- We have moderation/reporting but didn’t fully lock the `legal_strikes` counter + ToS integration.
- MVP DB: `profiles.legal_strikes INT DEFAULT 0`.
- Increment when report is abusive or when law-breaking confirmed.
- UI: Tooltip warning shown after 1, auto-ban at threshold (e.g., 3).
- AC:
  - [ ] Counter increments on qualifying events
  - [ ] Tooltip warning after first strike
  - [ ] Auto-ban triggers at configured threshold

5) GDPR/data exports
- Exports are defined but UI surface is missing (button in profile settings).
- Behavior: “Export my data” triggers backend route, email link or direct file download.
- AC:
  - [ ] Export button visible in profile settings
  - [ ] Backend route generates versioned JSON bundle
  - [ ] User receives file (download or emailed link)

---

### Optional “obvious but later” (Phase D)
- Equinox/Solstice calendar.
- Verified location (city/region) via 3rd-party geocoding (skip for MVP).
- Hashtags.
- Realtime curated feeds.

---

## 🧪 BRDC Validation Gates (per item)
For each missing/incomplete item above, BRDC gates must pass:
- [ ] Canonical requirement mapped to Base Scroll section
- [ ] Sacred scroll code references collected (shadowcomments.txt)
- [ ] Tests written first (RED)
- [ ] Implementation passes tests (GREEN)
- [ ] Refactor while green
- [ ] Docs updated (Codex + README indices)
- [ ] Feature status updated in `00_CANONICAL_MVP_BASE_SCROLL.md`

---

## 📈 Rollup Success Criteria
- No duplication of features covered in canonical spec.
- All “Missing/incomplete” items have clear AC, UI/API/DB notes.
- BRDC gates green for each item.
- Feature statuses propagated to canonical tracking.
