# Testing Plan — Cosmic Map Engine

## Unit Tests
- **Map System**: Leaflet initialization and infinite scrolling
- **Geolocation**: Position tracking and accuracy calculations
- **Investigation System**: Mystery progress and completion logic
- **WebSocket**: Message parsing and connection handling
- **PWA**: Service worker and manifest validation

## Unit Tests (New/Updated)
- **Context Menu**:
  - Ensure `showContextMenu(latlng, containerPoint)` renders only the allowed actions.
  - Verify button handlers call: `movePlayer`, `centerOnLocation`, `cycleFlagTheme`, `createTestDistortionEffects`, `openBaseManagement`, `unifiedQuestSystem.showQuestLog`, `eldritchApp.systems.inventory.showInventory`, and `eldritchApp.toggleSidePanel`.
- **Side Panel Toggle**:
  - `eldritchApp.toggleSidePanel()` toggles `#glassmorphic-side-panel.open` and `#unified-panel-toggle.open` consistently.
  - When panel has no content, minimal content is injected and a close button is present.
- **Step Detection**:
  - Thresholds and timing: `stepThreshold`, `minStepInterval`, `stepCooldown` respected in `detectStep`.
  - Gyroscope-based detection requires increased `totalChange` and higher orientation-change count.
  - `setStepDetectionMode(gpsTracking)` disables steps when GPS is not tracking or accuracy is poor.
- **Persistence**:
  - Map view save/restore via `sessionPersistence.saveMapView`/`restoreMapView`.
  - Path save/restore via `sessionPersistence.savePath`/`restorePath`.
- **Player Marker Config**:
  - `getPlayerMarkerConfig`/`setPlayerMarkerConfig` read/write localStorage and refresh marker icon.

## Integration Tests
- **End-to-End Flow**: Geolocation → Map markers → Investigation system
- **WebSocket Communication**: Position sharing and multiplayer features
- **Mobile Touch**: Gesture recognition and responsive design
- **PWA Installation**: Mobile app installation and offline functionality

## Integration Tests (New/Updated)
- **Context Menu Actions**:
  - Long-press/tap on map opens context menu at coordinates; validate only the specified buttons exist.
  - Clicking Settings from context menu opens side panel with content and close button works.
  - Quests button invokes `window.unifiedQuestSystem.showQuestLog()` without errors.
  - Inventory button opens inventory UI via `window.eldritchApp.systems.inventory.showInventory()`.
- **Location Header**:
  - When position available: `#location-display-header` shows `lat, lng` to 6 decimals; `#accuracy-display-header` shows `Accuracy: Xm`.
  - When no position: `Getting location...` and `Accuracy: --` shown.
- **Step Detection Accuracy**:
  - Stationary device for 2+ minutes: 0 steps added.
  - Walking test: moderate pace for 1 minute yields 80–140 steps; false positives < 2.
  - GPS disabled or poor accuracy (>50m): automatic step detection disabled; manual add still works.
  - Orientation shake without locomotion does not add steps due to stricter thresholds and cooldowns.
- **Path/Flag Rendering**:
  - Path line toggle adds/removes polyline; points append as movement updates.
  - Flag pins drop every ~10m of actual movement (verify distance calc); manual “Drop Flag Here” places at selected lat/lng.
  - Saved path restores after reload; last position seeded without drawing until user re-enables path line.
- **Marker Customization**:
  - Side panel emoji/color controls update player marker immediately and persist across reloads.
- **Multiplayer Hooks**:
  - Multiplayer status text updates every 2s; simulated players render markers and are removable.

## Manual Scenarios
- **Map Navigation**: Infinite scrolling and zoom performance
- **Geolocation Accuracy**: Real-world position tracking and accuracy indicators
- **Investigation Flow**: Complete mystery from start to finish
- **Mobile Testing**: Touch controls and PWA installation
- **Multiplayer**: Multiple clients sharing positions and investigations

## Manual Scenarios (New/Updated)
- **Settings Panel from Footer and Context Menu**:
  1. Tap footer Settings and context-menu Settings; ensure the same panel opens with content.
  2. Use the panel close button; verify panel hides and does not auto-reopen unless dev mode forces it.
- **False Step Prevention**:
  1. Place phone on a table; observe step counter for 5 minutes → remains unchanged.
  2. Lightly pick up and rotate phone without walking → no steps added.
  3. Walk a known 100m path → approx 120 steps ±30; verify flags drop about every 10m if enabled.
- **Path Persistence**:
  1. Enable path line, walk ~50m, reload app → last point persisted; enable path to continue appending.
  2. Use Clear Path → polyline removed and persistence cleared.
- **Marker Customization**:
  1. Change emoji/color; confirm marker updates; reload to confirm persistence.
- **Quest Gating**:
  1. With <100 steps, quest buttons show locked state and offer 50-step payment.
  2. Pay 50 steps; verify action proceeds and step total decreases.

## Performance Targets
- **Map Rendering**: 60fps smooth scrolling and zoom
- **Geolocation Updates**: 1Hz position updates with <100ms latency
- **WebGL Effects**: 60fps particle systems and animations
- **Mobile Performance**: Smooth operation on mid-range devices

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest versions)
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Feature Detection**: Graceful degradation for older browsers
- **PWA Support**: Service worker and manifest compatibility

## Security & Privacy
- **Geolocation Consent**: Explicit permission requests
- **WebSocket Security**: Rate limiting and connection validation
- **Local Storage**: Secure investigation progress storage
- **No Tracking**: No external analytics or data collection

## Mobile Testing
- **Touch Gestures**: Pinch to zoom, drag to pan
- **PWA Installation**: "Add to Home Screen" functionality
- **Geolocation**: High accuracy GPS tracking
- **Performance**: Battery usage and memory optimization

## Accessibility
- **Keyboard Navigation**: Full keyboard support for all features
- **Screen Readers**: ARIA labels and semantic HTML
- **Color Contrast**: High contrast mode support
- **Text Scaling**: Responsive text sizing

## Regression Tests (Added)
- Removing deprecated context-menu actions does not break existing handlers.
- Side panel remains closed on load unless explicitly toggled; dev mode does not force open unexpectedly.
- Session persistence calls do not throw when unavailable; app degrades gracefully.
- Inventory, Quests, and Base Management buttons are no-ops only if respective systems are absent, without console errors.
