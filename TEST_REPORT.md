# Eldritch Sanctuary — Test Report (Living)

Updated: 2025-09-22

Legend: ✅ Pass | ⚠️ Partial | ❌ Fail | ⏳ Not tested

## Core Systems
- App initialization: ✅
- Map engine (Leaflet + WebGL overlay): ✅
- Geolocation (Locate Me; recenter + marker update): ✅
- Session persistence (map view, path, quests): ✅

## Exploration & Movement
- Manual Move Here context action: ✅ (no NaN; early-return on zero distance)
- Path line toggle and painting: ✅
- Step milestones (every 50): ✅ (flag drop + notification)

## Flags & Themes
- Finnish Flag Canvas Layer visible and interactive: ✅
- Footer FLAGS theme cycle: ✅ (toast shows current theme)

## Steps & Gating
- Step gating (100 steps to unlock intro): ✅
- Step +/- debug with hold acceleration: ✅

## Quests & Panels
- Quest dialogs docked/draggable: ✅
- Wrong-answer retargeting: ✅ (marker relocates + warning sting)
- Adventure selector (Demo vs Game): ✅ (persisted)

## Moral Choices
- Overlay non-blocking: ✅
- Random moral trigger: ✅ (fixed event target + guards)

## Combat & Microgames
- Dice combat (simplified): ✅
- Microgames: dice, trivia: ✅
- Tetris full loop (falling, rotation, line clears, levels): ✅

## Audio & Effects
- WebAudio demo sounds (no MP3s): ✅ (blings, terrifying blings, eerie hum)
- Event hooks (quest open/complete, steps, capture, combat): ✅
- Discord-style effects (shake, burst, rift, glow): ✅ (guarded)

## Dev & Debug
- Dev toggle clickable: ✅ (global z-index/pointer-events)
- Device Testing Suite: ✅ (summary rendered; exportable JSON)

## Multiplayer (basic)
- WebSocket client init and status: ✅
- Other player markers add/remove: ✅ (styles isolated)

## Known/Watchlist
- Real pedometer/gyro accuracy on diverse devices: ⏳ (field testing)
- Performance on low-end devices with effects enabled: ⏳

## Notes
- Report will be updated as new tests are added. Use Device Testing Suite (debug panel) to run checks and export results.
