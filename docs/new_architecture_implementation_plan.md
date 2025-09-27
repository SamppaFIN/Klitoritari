# Eldritch Sanctuary – New Architecture Implementation Plan

## 🎯 **Game Vision**
A location-based, multiplayer mobile adventure where players gather steps to build mystical bases, uncover quests, and interact with others on a live map. Modular, event-driven, transparent: every game element is a distinct, interactive layer.

---

## 🏗️ **Layered Rendering Architecture**

### **Layer Stack (Bottom → Top)**
```
┌─────────────────────────────────────┐
│ 9. Debug/Dev Layer (dev only)      │ ← Mobile diagnostics, logging, testing
├─────────────────────────────────────┤
│ 8. UI Layer                        │ ← Controls, menus, navigation, settings
├─────────────────────────────────────┤
│ 7. Information Layer               │ ← Notifications, tooltips, quest status
├─────────────────────────────────────┤
│ 6. Player Layer                    │ ← Player avatars, other players, status
├─────────────────────────────────────┤
│ 5. Interaction Layer               │ ← Quest items, NPCs, clickable objects
├─────────────────────────────────────┤
│ 4. Map Layer (Main)                │ ← Leaflet.js map, coordinate transforms
├─────────────────────────────────────┤
│ 3. Path Layer                      │ ← Movement trails, step paths
├─────────────────────────────────────┤
│ 2. Territory Layer                 │ ← Bases, borders, sacred areas
├─────────────────────────────────────┤
│ 1. Terrain Layer (WebGL)           │ ← Elevation, biomes, weather (optional)
├─────────────────────────────────────┤
│ 0. Background Layer                │ ← Cosmic themes, aurora, starfields
└─────────────────────────────────────┘
```

### **Layer Responsibilities**

#### **0. Background Layer**
- **Purpose**: Full-viewport cosmic ambience
- **Content**: Aurora effects, starfields, fog, cosmic themes
- **Interactions**: None (visual only)
- **Performance**: Low-priority, can be disabled on low-end devices

#### **1. Terrain Layer (Optional)**
- **Purpose**: 2.5D terrain rendering
- **Content**: Elevation data, biome effects, weather overlays
- **Interactions**: None (visual enhancement)
- **Performance**: WebGL-based, can be stubbed for MVP

#### **2. Territory Layer**
- **Purpose**: Player base and territory visualization
- **Content**: Base markers, territory borders, sacred areas, expansion zones
- **Interactions**: Base selection, territory info popups
- **Performance**: Static elements, efficient rendering

#### **3. Path Layer**
- **Purpose**: Movement trail visualization
- **Content**: Player paths, step markers, other players' trails
- **Interactions**: Path history viewing, step counting
- **Performance**: Streaming data, chunked updates for multiplayer

#### **4. Map Layer (Main)**
- **Purpose**: Primary map interaction and coordinate system
- **Content**: OpenStreetMap tiles, zoom/pan controls, coordinate transforms
- **Interactions**: Map navigation, tap events, zoom controls
- **Performance**: Leaflet.js optimized, viewport culling

#### **5. Interaction Layer**
- **Purpose**: Interactive game elements
- **Content**: Quest markers, NPCs, pickups, buildings, clickable objects
- **Interactions**: Quest interactions, NPC dialogue, item collection
- **Performance**: Proximity-based rendering, interaction feedback

#### **6. Player Layer**
- **Purpose**: Player representation and status
- **Content**: Current player avatar, other players, status overlays
- **Interactions**: Player info, status updates, motion smoothing
- **Performance**: Real-time updates, smooth animations

#### **7. Information Layer**
- **Purpose**: Contextual information display
- **Content**: Notifications, quest progress, tooltips, alerts
- **Interactions**: Dismiss notifications, view details
- **Performance**: Transient elements, auto-dismiss timers

#### **8. UI Layer**
- **Purpose**: Game controls and navigation
- **Content**: Tab navigation, menus, settings, debug panels
- **Interactions**: All user interface interactions
- **Performance**: Static UI elements, responsive design

#### **9. Debug/Dev Layer (Development Only)**
- **Purpose**: Development and testing tools
- **Content**: FPS counter, event logs, device diagnostics
- **Interactions**: Debug controls, testing tools
- **Performance**: Development overhead, removed in production

---

## 🔧 **Implementation Plan**

### **Phase 1: Core Architecture Refactoring (Week 1-2)**

#### **1.1 Layer Manager System**
```javascript
// New file: js/layer-manager.js
class LayerManager {
    constructor() {
        this.layers = new Map();
        this.eventBus = new EventBus();
        this.renderOrder = [
            'background', 'terrain', 'territory', 'path', 
            'map', 'interaction', 'player', 'information', 
            'ui', 'debug'
        ];
    }
    
    registerLayer(name, layer) {
        this.layers.set(name, layer);
        layer.setEventBus(this.eventBus);
    }
    
    render() {
        this.renderOrder.forEach(layerName => {
            const layer = this.layers.get(layerName);
            if (layer && layer.isVisible()) {
                layer.render();
            }
        });
    }
}
```

#### **1.2 Event System Standardization**
```javascript
// New file: js/event-bus.js
class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    
    emit(event, data) {
        const eventListeners = this.listeners.get(event) || [];
        eventListeners.forEach(callback => callback(data));
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
}
```

#### **1.3 Game State Management**
```javascript
// New file: js/game-state.js
class GameState {
    constructor() {
        this.state = {
            player: null,
            bases: new Map(),
            quests: new Map(),
            npcs: new Map(),
            map: { center: null, zoom: 13 },
            ui: { activeModal: null, notifications: [] }
        };
        this.listeners = [];
    }
    
    update(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }
    
    getState() {
        return Object.freeze({ ...this.state });
    }
}
```

### **Phase 2: Layer Implementation (Week 3-4)**

#### **2.1 Background Layer**
```javascript
// New file: js/layers/background-layer.js
class BackgroundLayer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.animations = [];
    }
    
    render() {
        // Render cosmic background effects
        this.renderAurora();
        this.renderStars();
        this.renderFog();
    }
    
    renderAurora() {
        // Aurora borealis effect
    }
    
    renderStars() {
        // Animated starfield
    }
}
```

#### **2.2 Territory Layer**
```javascript
// New file: js/layers/territory-layer.js
class TerritoryLayer {
    constructor(canvas, eventBus) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.eventBus = eventBus;
        this.bases = new Map();
    }
    
    render() {
        this.renderBases();
        this.renderTerritoryBorders();
        this.renderSacredAreas();
    }
    
    renderBases() {
        this.bases.forEach(base => {
            this.renderBaseMarker(base);
        });
    }
}
```

#### **2.3 Path Layer**
```javascript
// New file: js/layers/path-layer.js
class PathLayer {
    constructor(canvas, eventBus) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.eventBus = eventBus;
        this.pathPoints = [];
        this.stepMarkers = [];
    }
    
    render() {
        this.renderPath();
        this.renderStepMarkers();
    }
    
    addPathPoint(lat, lng) {
        this.pathPoints.push({ lat, lng, timestamp: Date.now() });
        this.eventBus.emit('pathUpdated', this.pathPoints);
    }
}
```

#### **2.4 Interaction Layer**
```javascript
// New file: js/layers/interaction-layer.js
class InteractionLayer {
    constructor(canvas, eventBus) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.eventBus = eventBus;
        this.interactables = new Map();
    }
    
    render() {
        this.renderQuestMarkers();
        this.renderNPCs();
        this.renderPickups();
    }
    
    handleClick(x, y) {
        const clicked = this.findInteractableAt(x, y);
        if (clicked) {
            this.eventBus.emit('interactionClicked', clicked);
        }
    }
}
```

### **Phase 3: Data Model Cleanup (Week 5)**

#### **3.1 Unified Data Models**
```javascript
// New file: js/models/player-model.js
class PlayerModel {
    constructor(data = {}) {
        this.id = data.id || generateUUID();
        this.position = data.position || { lat: 0, lng: 0 };
        this.stats = {
            health: 100,
            sanity: 100,
            steps: 0,
            level: 1,
            experience: 0
        };
        this.settings = {
            baseLogo: 'finnish',
            pathSymbol: 'ant',
            areaSymbol: 'finnish'
        };
    }
    
    updatePosition(lat, lng) {
        this.position = { lat, lng };
        this.eventBus.emit('playerMoved', this.position);
    }
}
```

#### **3.2 Base Model**
```javascript
// New file: js/models/base-model.js
class BaseModel {
    constructor(data = {}) {
        this.id = data.id || generateUUID();
        this.position = data.position || { lat: 0, lng: 0 };
        this.established = data.established || new Date().toISOString();
        this.level = data.level || 1;
        this.territory = {
            radius: 50,
            points: [],
            energy: 100
        };
        this.settings = {
            logo: data.logo || 'finnish',
            name: data.name || 'My Base'
        };
    }
}
```

### **Phase 4: Legacy System Cleanup (Week 6)**

#### **4.1 File Cleanup**
**Files to Remove:**
- `js/base-building-layer.js` (replace with TerritoryLayer)
- `js/finnish-flag-canvas-layer.js` (replace with PathLayer)
- `js/enhanced-path-painting-system.js` (already removed)
- `js/enhanced-tablist.js` (consolidate with tablist.js)
- `js/enhanced-map-engine.js` (consolidate with map-engine.js)

**Files to Refactor:**
- `js/app.js` → Simplify to only coordinate layers
- `js/map-engine.js` → Focus only on map functionality
- `js/tablist.js` → Move to UILayer
- `js/welcome-screen.js` → Keep as-is (working well)

#### **4.2 Single Entry Point**
```javascript
// Updated js/app.js
class EldritchSanctuaryApp {
    constructor() {
        this.layerManager = new LayerManager();
        this.gameState = new GameState();
        this.eventBus = new EventBus();
    }
    
    async init() {
        // Initialize only essential systems
        await this.initLayers();
        await this.initGameState();
        this.startGameLoop();
    }
    
    initLayers() {
        // Register all layers in order
        this.layerManager.registerLayer('background', new BackgroundLayer());
        this.layerManager.registerLayer('territory', new TerritoryLayer());
        this.layerManager.registerLayer('path', new PathLayer());
        // ... etc
    }
}
```

### **Phase 5: Mobile Optimization (Week 7)**

#### **5.1 Performance Optimizations**
- **Viewport Culling**: Only render visible elements
- **Lazy Loading**: Load layers on demand
- **Memory Management**: Clean up unused resources
- **Frame Rate Control**: Cap at 30fps on mobile

#### **5.2 Mobile-Specific Features**
- **Touch Gestures**: Swipe, pinch, tap handling
- **Wake Lock**: Prevent screen sleep during gameplay
- **Battery Optimization**: Reduce background processing
- **Network Handling**: Graceful offline/online transitions

### **Phase 6: Testing & Validation (Week 8)**

#### **6.1 Layer Testing**
```javascript
// New file: js/testing/layer-tests.js
class LayerTests {
    static runAllTests() {
        this.testLayerIsolation();
        this.testEventCommunication();
        this.testPerformance();
        this.testMobileCompatibility();
    }
    
    static testLayerIsolation() {
        // Ensure layers don't directly reference each other
    }
    
    static testEventCommunication() {
        // Test event bus communication
    }
}
```

#### **6.2 Integration Testing**
- **Layer Composition**: Test all layers working together
- **Event Flow**: Verify event propagation
- **Performance**: Test on various devices
- **Memory Usage**: Monitor for leaks

---

## 📁 **New File Structure**

```
js/
├── core/
│   ├── layer-manager.js
│   ├── event-bus.js
│   ├── game-state.js
│   └── app.js (simplified)
├── layers/
│   ├── background-layer.js
│   ├── terrain-layer.js
│   ├── territory-layer.js
│   ├── path-layer.js
│   ├── map-layer.js
│   ├── interaction-layer.js
│   ├── player-layer.js
│   ├── information-layer.js
│   ├── ui-layer.js
│   └── debug-layer.js
├── models/
│   ├── player-model.js
│   ├── base-model.js
│   ├── quest-model.js
│   └── npc-model.js
├── systems/
│   ├── geolocation.js (keep)
│   ├── quest-system.js (refactored)
│   ├── npc-system.js (refactored)
│   └── step-currency.js (refactored)
├── ui/
│   ├── welcome-screen.js (keep)
│   ├── tablist.js (refactored)
│   └── notifications.js
├── testing/
│   ├── layer-tests.js
│   ├── performance-tests.js
│   └── mobile-tests.js
└── utils/
    ├── math-utils.js
    ├── gps-utils.js
    └── device-utils.js
```

---

## 🎯 **Success Criteria**

### **Technical Success**
- ✅ All layers isolated and composable
- ✅ Single event system for all communication
- ✅ Only one base initialization system (simple-base-init.js)
- ✅ No legacy code conflicts
- ✅ Mobile performance > 30fps
- ✅ Memory usage < 100MB on mobile

### **Functional Success**
- ✅ Players can walk and see steps turn to currency
- ✅ Players can build and see territory expansion
- ✅ Players can interact with bases and quests
- ✅ Players can view other players' activities
- ✅ All interactions responsive at all zoom levels
- ✅ Stable performance on mobile devices

### **Architectural Success**
- ✅ Clear separation of concerns
- ✅ Unidirectional data flow
- ✅ Event-driven communication
- ✅ Modular and testable code
- ✅ Comprehensive documentation
- ✅ Easy to add new features

---

## 🚀 **Implementation Timeline**

| Week | Phase | Deliverables |
|------|-------|-------------|
| 1-2 | Core Architecture | LayerManager, EventBus, GameState |
| 3-4 | Layer Implementation | All 10 layers implemented |
| 5 | Data Model Cleanup | Unified models, single entry point |
| 6 | Legacy Cleanup | Remove deprecated code, refactor existing |
| 7 | Mobile Optimization | Performance tuning, mobile features |
| 8 | Testing & Validation | Comprehensive testing, bug fixes |

---

## 📋 **Next Steps**

1. **Start with Phase 1**: Implement LayerManager and EventBus
2. **Keep Welcome Screen**: Don't touch the working welcome screen
3. **Use Simple Base Init**: Keep using simple-base-init.js for base logic
4. **Test Each Layer**: Implement and test each layer independently
5. **Gradual Migration**: Move existing functionality to new layers
6. **Performance First**: Optimize for mobile from the start

This architecture provides a clean, modular foundation that will be much easier to maintain and extend than the current implementation.
