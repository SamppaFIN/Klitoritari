# Testing Plan — Cosmic Map Engine

> Status banner: All features below are currently marked as Untested pending full QA pass on 2025-09-23. Execute the manual/integration plan in order and update statuses after verification.

## Feature List — Eldritch Sanctuary Platform

### **Core Map Features**
- **Infinite Scrolling Maps**: Leaflet-based infinite scrolling with cosmic styling
- **Real-time Geolocation**: HTML5 GPS tracking with accuracy indicators and simulator mode
- **Player Position Tracking**: Live player marker with customizable appearance
- **Map Centering**: Automatic centering on player position with smooth animations
- **Context Menu**: Right-click/long-press menu with location-based actions
- **Flag System**: Finnish flag markers with customizable themes and placement
- **Path Visualization**: Player movement tracking with brush-based path painting
- **Territory System**: Base building and territory expansion through movement

### **Encounter System Features**
- **Direct Map Interactions**: Proximity-based encounters with map markers
- **Monster Encounters**: 50m trigger radius for combat encounters
- **Item Collection**: 50m trigger radius for item collection dialogs
- **Dice Combat System**: Turn-based combat with D20 rolls and strategic depth
- **Item Effects**: Health Potion, Sanity Elixir, Power Orb, Cosmic Crystal, Ancient Scroll
- **Map Cleanup**: Used markers disappear to prevent duplicate encounters
- **No Random Encounters**: Clean, predictable gameplay focused on exploration

### **Quest System Features**
- **Unified Quest System**: Complete quest chains with progressive marker revelation
- **Quest Markers**: Proximity-triggered quest interactions with 30m radius
- **Dialog System**: Lovecraftian storytelling with branching choices and consequences
- **Riddle Minigame**: Interactive riddle system with multiple questions and outcomes
- **Quest Progression**: Dynamic marker hiding/showing and objective completion
- **Stat Consequences**: Health and sanity changes based on player choices
- **Revive Shrine**: Health and sanity restoration at specific coordinates

### **NPC System Features**
- **Aurora (👑)**: Cosmic Navigator with mystical movement and wisdom
- **Zephyr (💨)**: Wandering Wind with fast directional movement
- **HEVY (⚡)**: Legendary cosmic entity with energy effects and riddles
- **Proximity Detection**: 20m trigger radius for NPC interactions
- **Chat System**: Full dialogue system with character-specific responses
- **Movement Patterns**: Distinct behaviors for each NPC type

### **Visual Effects Features**
- **Sanity Distortion System**: Psychological horror elements with visual effects
- **Cosmic Effects**: Three.js particle systems and energy wave animations
- **Screen Effects**: Blur, noise, chromatic aberration, vignette, shake, glitch
- **Particle Systems**: Dynamic particle effects based on player sanity
- **WebGL Integration**: High-performance rendering with fallback support
- **Animation System**: Smooth transitions and atmospheric animations

### **Audio System Features**
- **Sound Manager**: Centralized audio system with WebAudio fallbacks
- **Ambient Sounds**: Eerie hum and atmospheric audio
- **Combat Sounds**: Victory, defeat, and battle audio cues
- **Quest Sounds**: Quest completion and interaction audio
- **Step Sounds**: Movement audio feedback
- **Audio Fallbacks**: Graceful degradation when audio unavailable

### **UI/UX Features**
- **Debug Panel**: Unified draggable interface with tabbed organization
- **Settings Panel**: Player marker customization and system configuration
- **Notification System**: Centered notifications with smooth animations (Untested for join/leave)
- **Tutorial System**: Contextual help and guidance messages
- **Mobile Optimization**: Touch-friendly interface with responsive design
- **Accessibility**: Screen reader support and keyboard navigation

### **Persistence Features**
- **Session Persistence**: Map view and path restoration across sessions
- **Local Storage**: Investigation progress and player state storage
- **Marker Customization**: Persistent player marker appearance settings
- **Quest Progress**: Save and restore quest completion state
- **Statistics Tracking**: Player stats and encounter history

### **Multiplayer Features**
- **WebSocket Communication**: Real-time position sharing and collaboration
- **Other Player Simulation**: AI-driven NPC players for testing
- **Position Sharing**: Live player positions and movement tracking (Untested)
- **Multiplayer Status**: Connection status, player count, and connected names (Untested)
- **Session Management**: Isolated sessions with proper cleanup (Untested)
- **Flag Replication**: Persisted remote pins, ownerId, rebroadcast on connect (Untested)
- **Manual Reload**: Trigger request_flags to pull all remote pins (Untested)

### **PWA Features**
- **Mobile Installation**: "Add to Home Screen" functionality
- **Service Worker**: Offline functionality and caching
- **Manifest**: Complete PWA manifest with icons and shortcuts
- **Icon System**: Favicon and PWA icons (72x72 to 512x512)
- **Offline Support**: Basic offline functionality with cached resources

### **Debug and Development Features**
- **Debug Toggle**: Global dev/debug mode with panel visibility control
- **Console Logging**: Comprehensive logging for debugging and development
- **Test Buttons**: Debug buttons for testing all implemented effects
- **Performance Monitoring**: FPS tracking and performance indicators
- **Error Handling**: Comprehensive error handling with user feedback
- **Development Tools**: Built-in testing and debugging utilities

### **Accessibility Features**
- **Keyboard Navigation**: Full keyboard support for all features
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast Mode**: Enhanced visibility for accessibility
- **Text Scaling**: Responsive text sizing for readability
- **Touch Targets**: Appropriately sized touch targets for mobile
- **Motion Reduction**: Respect for user motion preferences

### **Performance Features**
- **60fps Rendering**: Smooth map scrolling and zoom performance
- **Efficient Proximity Detection**: Optimized distance calculations
- **Memory Management**: Proper cleanup of markers and encounter instances
- **WebGL Optimization**: High-performance rendering with fallback support
- **Mobile Performance**: Optimized for mid-range mobile devices
- **Battery Optimization**: Efficient power usage for mobile devices

### **Security and Privacy Features**
- **Geolocation Consent**: Explicit permission requests with clear feedback
- **Local Storage Only**: No external tracking or data collection
- **Rate Limiting**: WebSocket message rate limiting for security
- **HTTPS/WSS**: Secure connections for production deployment
- **Privacy First**: No external analytics or user tracking
- **Data Protection**: Secure local storage with proper cleanup

---

## Testing Plan

## Unit Tests
- **Map System**: Leaflet initialization and infinite scrolling
- **Geolocation**: Position tracking and accuracy calculations
- **Investigation System**: Mystery progress and completion logic
- **WebSocket**: Message parsing and connection handling
- **PWA**: Service worker and manifest validation
- **Encounter System**: Proximity detection and encounter triggering
- **Monster System**: Combat encounters and marker management
- **Item System**: Collection mechanics and stat effects

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
- **Encounter Proximity Detection**:
  - `checkMonsterProximity(playerPos)` detects monsters within 50m radius and triggers encounters.
  - `checkItemProximity(playerPos)` detects items within 50m radius and triggers collection dialogs.
  - Distance calculations use proper Haversine formula for accurate measurements.
  - Encounter state tracking prevents duplicate encounters for same marker.
- **Monster Encounter System**:
  - `startMonsterEncounter(monster)` handles both `monster.type.name` and `monster.name` data structures.
  - `startDiceCombat(monster)` integrates with simple dice combat system correctly.
  - Monster markers are removed from map after defeat via `removeMonsterFromMap(monsterName)`.
  - Monster data structure includes: `{ marker, name, emoji, color, difficulty, lat, lng, encountered }`.
- **Item Collection System**:
  - `startItemEncounter(item)` shows collection dialog with Collect, Examine, Leave options.
  - `collectItem(item)` applies item effects and removes item from map.
  - `applyItemEffects(item)` handles different item types (Health Potion, Sanity Elixir, Power Orb, etc.).
  - Item data structure includes: `{ marker, name, emoji, color, rarity, lat, lng, collected }`.
- **Map Marker Management**:
  - `createMonsterMarkers()` stores complete monster data in `monsterMarkers` Map.
  - `createItemMarkers()` stores complete item data in `itemMarkers` Map.
  - Used markers are properly removed to prevent duplicate encounters.
  - Marker storage supports both array and Map-based systems for compatibility.

## Integration Tests
- **End-to-End Flow**: Geolocation → Map markers → Investigation system
- **WebSocket Communication**: Position sharing and multiplayer features
- **Mobile Touch**: Gesture recognition and responsive design
- **PWA Installation**: Mobile app installation and offline functionality
- **Encounter Flow**: Map markers → Proximity detection → Encounter dialogs → Stat updates
- **Monster Combat**: Monster encounter → Dice combat → Victory/Defeat → Map cleanup
- **Item Collection**: Item encounter → Collection dialog → Stat effects → Map cleanup

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
  - Multiplayer status text updates every 2s; simulated players render markers and are removable. (Untested)
  - Joining another tab shows a join notification and adds name to the green pill. (Untested)
  - Remote flags appear within ~2s and persist after reload. (Untested)
- **Direct Map Interactions**:
  - Walking within 50m of monster markers triggers combat encounters automatically.
  - Walking within 50m of item markers triggers collection dialogs automatically.
  - No random encounters occur - only proximity-based interactions.
  - Used markers disappear from map after interaction to prevent duplicates.
- **Monster Encounter Integration**:
  - Monster encounters integrate with dice combat system seamlessly.
  - Combat victory removes monster from map and updates player stats.
  - Combat defeat maintains monster on map for retry.
  - Monster data structure compatibility works with both old and new formats.
- **Item Collection Integration**:
  - Item collection dialogs show Collect, Examine, Leave options.
  - Collecting items applies appropriate stat effects (health, sanity, XP).
  - Items are removed from map after collection.
  - Item examination shows detailed information without collection.
- **Map State Management**:
  - Map remains clean with no duplicate or used markers.
  - Marker storage properly tracks encounter/collection status.
  - Proximity detection works efficiently with large numbers of markers.
  - Map performance maintained with enhanced marker management.

## Manual Scenarios
- **Map Navigation**: Infinite scrolling and zoom performance
- **Geolocation Accuracy**: Real-world position tracking and accuracy indicators
- **Investigation Flow**: Complete mystery from start to finish
- **Mobile Testing**: Touch controls and PWA installation
- **Multiplayer**: Multiple clients sharing positions and investigations
- **Direct Map Interactions**: Walk up to markers and interact directly
- **Monster Combat**: Approach monster markers and engage in dice combat
- **Item Collection**: Approach item markers and collect items with effects

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
- **Direct Map Interaction Testing**:
  1. Walk within 50m of monster marker → combat encounter triggers automatically.
  2. Walk within 50m of item marker → collection dialog appears automatically.
  3. Complete monster combat → monster disappears from map.
  4. Collect item → item disappears from map and stats update.
  5. Verify no random encounters occur during normal movement.
- **Monster Combat Testing**:
  1. Approach monster marker → dice combat interface appears.
  2. Complete combat victory → monster removed from map, stats updated.
  3. Combat defeat → monster remains on map for retry.
  4. Verify combat integrates with existing dice system correctly.
- **Item Collection Testing**:
  1. Approach item marker → collection dialog with 3 options appears.
  2. Select "Collect" → item effects applied, item removed from map.
  3. Select "Examine" → detailed item info shown, item remains on map.
  4. Select "Leave" → dialog closes, item remains on map.
  5. Verify different item types apply correct stat effects.
- **Map State Testing**:
  1. Interact with all available markers on map.
  2. Verify map becomes clean with no duplicate or used markers.
  3. Test with multiple markers in close proximity.
  4. Verify map performance remains smooth with many markers.

## Performance Targets
- **Map Rendering**: 60fps smooth scrolling and zoom
- **Geolocation Updates**: 1Hz position updates with <100ms latency
- **WebGL Effects**: 60fps particle systems and animations
- **Mobile Performance**: Smooth operation on mid-range devices
- **Proximity Detection**: <50ms response time for encounter triggers
- **Marker Management**: Efficient rendering with 100+ markers on map
- **Encounter System**: <100ms dialog response time for interactions

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
- **Encounter System Regression**:
  - Random encounters remain disabled after app restart.
  - Monster and item markers persist correctly across page reloads.
  - Proximity detection works with both old and new marker data structures.
  - Map cleanup prevents duplicate encounters after marker removal.
- **Data Structure Compatibility**:
  - Monster encounters work with both `monster.type.name` and `monster.name` formats.
  - Item collection works with both array and Map-based marker storage.
  - Marker data includes all required fields for proper encounter handling.
  - Encounter state tracking prevents duplicate interactions.

## Encounter System Testing (New)

### **Unit Tests for Encounter System**
- **Proximity Detection Accuracy**:
  - Test distance calculations with known coordinates
  - Verify 50m trigger radius works correctly
  - Test edge cases (exactly 50m, 49.9m, 50.1m)
  - Validate Haversine formula implementation
- **Monster Encounter Flow**:
  - Test `checkMonsterProximity()` with various monster data structures
  - Verify `startMonsterEncounter()` handles different monster formats
  - Test `startDiceCombat()` integration with combat system
  - Validate monster removal after defeat
- **Item Collection Flow**:
  - Test `checkItemProximity()` with item markers
  - Verify `startItemEncounter()` shows correct dialog
  - Test `collectItem()`, `examineItem()`, `leaveItem()` actions
  - Validate item effects application and map cleanup
- **Data Structure Handling**:
  - Test compatibility with `monsters` array format
  - Test compatibility with `monsterMarkers` Map format
  - Verify marker data includes all required fields
  - Test encounter state tracking and prevention

### **Integration Tests for Encounter System**
- **End-to-End Monster Combat**:
  1. Player approaches monster marker within 50m
  2. Combat encounter dialog appears automatically
  3. Dice combat system launches with correct monster data
  4. Combat victory removes monster from map
  5. Player stats update correctly
- **End-to-End Item Collection**:
  1. Player approaches item marker within 50m
  2. Collection dialog appears with 3 options
  3. Collecting item applies correct stat effects
  4. Item marker disappears from map
  5. Player stats display updated values
- **Map State Management**:
  1. Multiple markers on map (monsters, items, shrines)
  2. Player interacts with all available markers
  3. Map becomes clean with no used markers
  4. Performance remains smooth with many markers
  5. No duplicate encounters occur

### **Performance Tests for Encounter System**
- **Proximity Detection Performance**:
  - Test with 100+ markers on map
  - Verify <50ms response time for encounter triggers
  - Test efficient distance calculations
  - Validate memory usage with large marker sets
- **Dialog Response Performance**:
  - Test encounter dialog appearance time
  - Verify <100ms response for user interactions
  - Test dialog closing and cleanup
  - Validate no memory leaks from dialog instances
- **Map Rendering Performance**:
  - Test map performance with many markers
  - Verify smooth scrolling with encounter system active
  - Test marker visibility and rendering
  - Validate WebGL integration maintained

### **Mobile Testing for Encounter System**
- **Touch Interaction**:
  - Test proximity detection on mobile devices
  - Verify encounter dialogs work with touch
  - Test combat interface on mobile screens
  - Validate item collection on touch devices
- **Performance on Mobile**:
  - Test encounter system on mid-range devices
  - Verify battery usage with proximity detection
  - Test memory usage with many markers
  - Validate smooth performance on mobile browsers
- **Accessibility on Mobile**:
  - Test encounter dialogs with screen readers
  - Verify touch targets are appropriately sized
  - Test high contrast mode with encounter UI
  - Validate keyboard navigation for encounters

### **Error Handling Tests for Encounter System**
- **Missing Data Handling**:
  - Test with incomplete monster data structures
  - Verify graceful handling of missing item properties
  - Test with null or undefined marker references
  - Validate fallback behavior for missing systems
- **Network and Storage Errors**:
  - Test encounter system with localStorage disabled
  - Verify graceful degradation without map engine
  - Test with missing combat system dependencies
  - Validate error recovery and user feedback
- **Edge Cases**:
  - Test rapid movement near multiple markers
  - Verify handling of overlapping encounter zones
  - Test with markers at exact boundary distances
  - Validate behavior with corrupted marker data
