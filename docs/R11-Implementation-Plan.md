---
brdc:
  id: AASF-DOC-011
  title: "R11 Implementation Plan \u2014 Movement-Driven Gameplay & Map Interaction"
  owner: "\U0001F4BB Codex"
  status: canonical
  version: 1.0.0
  last_updated: '2025-10-01'
  self: docs\R11-Implementation-Plan.md
  tags:
  - brdc
  - implementation
  - development
  related: []
  dependencies: []
  consciousness_level: low
  healing_impact: Brings consciousness-serving features to life
  sacred_principles:
  - consciousness-first
  - community-healing
  - spatial-wisdom
---

# R11 Implementation Plan — Movement-Driven Gameplay & Map Interaction

Date: 2025-09-22  
Author: Aurora  
Partner: Inf

## Milestones (Testable Order)

### Phase 0 — Stabilize (Bugfix + Infra)
- Fix missing buttons/zones (overlay/panel z-index, pointer-events, stacking context).
- Fix base structures not rendering after build; ensure render triggers on construction events.
- Add global dev/debug toggle; hide dev UI in prod; route all debug actions through it.

### Phase 1 — Step System + Gating
- Real pedometer/gyroscope heuristics + shake refinement; keep +1/tick debug.
- +/– buttons next to step counter; hold → exponential step change (debug only).
- Gate intro task behind 100 steps; lock UI and payment prompt if <100.
- Prevent opening task dialogs unless requirement met.
- Render step-trigger flags with animation; auto-clear overlapping flags when region “captured.”

### Phase 2 — Map & Player Interaction
- Player-selectable territory marker (flag/icon/emoji) per player; distinct colors.
- Show current and last position with connecting line; fill distance with markers.
- Move base structure rendering onto the actual map (remove panel toggle dependency).

### Phase 3 — Adventure System
- Adventure selector: demo vs game; randomize objectives within a radius (~300 m).
- First quest “jumps” to player (highlight/animation).
- Wrong answers relocate objective to a distinct location; re-highlight.
- Microgames: dice (win/lose), trivia, Tetris stub with simple animations.

### Phase 4 — UI/UX & Effects
- Refactor modals to docked, draggable side panels; non-blocking.
- Moral choice overlays (non-blocking).
- Notifications for win/lose, events, chat, errors; polished copy/visuals.
- Discord-style effect overlays + linked SFX; throttle to avoid fatigue.
- Asset support: MP3 + SVG pipeline.

### Phase 5 — Persistence & Multiplayer-ready
- Local session persistence for flags/adventures; isolate per session/user.
- Show all players’ positions and recent paths; per-player markers/colors.
- Session/WebSocket sync for nearby players; Swedish-flag example for second player.

### Phase 6 — QA, Performance, Release
- Device matrix tests (Android/iOS/desktop) for steps/UI/adventures.
- Performance tuning (interval throttling, WebGL caps, DOM trims).
- Accessibility pass (contrast, focus order, ARIA, motion reduction).
- Production config: hide dev UI, cache headers, minimal error telemetry.

## Acceptance Tests
- Controls visible/usable; bases render on build; dev toggle works.
- Steps natural in real mode; debug +/- with hold; quest unlock at 100; animated flags; capture clears overlaps.
- Per-player markers; last→current line; backfilled markers; bases render on map after build.
- Adventures scatter; wrong answers relocate; microgames run and resolve.
- Non-blocking draggable panels; notifications + SFX; respects reduced-motion.
- Sessions isolated; two clients show each other with distinct markers.

## File Touchpoints
- index.html, styles.css, js/app.js, js/unified-debug-panel.js
- js/step-currency-system.js, js/unified-quest-system.js, js/map-engine.js
- js/base-system.js, js/websocket-client.js, js/database-client.js (or local storage module)

## Today’s Sprint
1) UI overlay stacking regression fix.  
2) Bases render on build fix.  
3) Global dev/debug toggle.  
Then Phase 1 step system.


