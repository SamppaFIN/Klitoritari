# 🕊️ User Interaction Workflows (Feel Like Flying)

Principles: instant affordances, gentle guidance, zero dead-ends, motion as meaning, mobile-first.

## 1) Discover → React → Deepen
- Gesture: swipe up reveals ReactionRibbon; long-press for strength 2.
- Flow:
  1) User scrolls a feed → ribbon floats into reach when pausing.
  2) Tap reaction → subtle glow + particle burst.
  3) Long-press → double-strength animation; tooltip: “Press again for double”.
  4) Tap count → opens quickstats (top reactions, trendline).
- Guardrails: never block scroll; ribbon collapses on scroll.

## 2) Read → Comment → Thread
- Gesture: tap “Comment” → input slides up; keyboard-safe.
- Flow:
  1) Tap comment → focus highlights; context dims around.
  2) Tap reply → nested composer; mention suggestions appear with @.
  3) Submit → optimistic insert; aura pulse at new node.
- Guardrails: fail states show inline error, preserve draft.

## 3) Moon Awareness → Action
- Gesture: tap MoonWidget (always-visible).
- Flow:
  1) Widget shows phase, illumination, countdown.
  2) Open modal → apex bands highlighted; swipe to full-screen calendar.
  3) Apex soon → notification badge animates; tap sets reminder.
- Guardrails: reduced motion respects OS setting.

## 4) Profile → Aura → Activity
- Gesture: tap avatar → profile with AuraRing.
- Flow:
  1) AuraRing color reflects positivity; micro-bands show roles.
  2) Tabs: Overview → Articles → Activity → ÆL.
  3) Activity list supports quick filters; follow/unfollow reachable.
- Guardrails: privacy toggle hides recent activity if enabled.

## 5) Mentions → Notifications → Resolve
- Gesture: type @ to mention; tap suggestions.
- Flow:
  1) Mention creates activity; notification center aggregates.
  2) Mark all seen with one tap; items slide to “seen”.
  3) Tap item → deep-link to thread; back returns to same scroll.
- Guardrails: blocklist prevents toxic mentions from notifying.

## 6) Report → Protect → Heal
- Gesture: long-press on comment → “Report”.
- Flow:
  1) Tooltip explains standards; submit adds cooldown.
  2) Protector badge escalates visibility for moderators.
  3) Abusive report increments legal strike; thresholds warn/ban.
- Guardrails: soft-hide avoids hard deletion; full audit retained.

## 7) Filters → Search → Focus
- Gesture: pull down to reveal filters; type to search.
- Flow:
  1) Pick reaction/mood/time/length; results animate, no jank.
  2) Tap result → focus thread; up-swipe returns to results.
- Guardrails: debounce queries; offline shows cached last view.

## Motion & Feedback Language
- Subtle glows for success; no harsh red dots.
- Particle bursts for celebrations; fog/ambience calm when idle.
- Context animations draw attention to next action, then fade.

## Accessibility & Comfort
- Touch targets ≥44px; one-handed reach.
- Reduced Motion: disable parallax/long animations.
- Haptics: gentle taps only; never continuous buzz.

## Performance Budgets
- Interaction to visible feedback ≤100ms.
- Modal open ≤200ms.
- 60fps scroll; no layout shifts on input.

## BRDC User Journeys (tests first)
- React with strength 2 via long-press → visible escalation.
- Report abusive comment → email confirmation queued; cooldown applied.
- Apex countdown badge → opens modal → full-screen calendar.
- Mark all seen in notifications → list updates without reload.
