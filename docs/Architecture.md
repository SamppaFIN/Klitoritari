# Architecture (Three.js Layered Rendering System)

## Core Architecture
- **Layered Rendering System** (12 distinct layers with clear separation of concerns)
  - BackgroundLayer: Cosmic background with WebGL effects and particle systems
  - TerrainLayer: Ground textures and elevation data with mobile optimization
  - TerritoryLayer: Base territories and influence zones with visual representation
  - PathLayer: Player paths and trails with smooth animation
  - MapLayer: Leaflet map rendering, markers, and viewport management (visual only)
  - InteractionLayer: User input processing, UI interactions, and gesture recognition
  - PlayerLayer: Player avatar rendering with movement visualization and trail effects
  - InformationLayer: HUD elements, notifications, and game statistics
  - UILayer: Menus, dialogs, and interactive UI elements
  - DebugLayer: Development tools, performance metrics, and debugging overlays
  - GeolocationLayer: GPS data management, coordinate conversion, and location events
  - ThreeJSUILayer: Three.js UI system integration with magnetic tabs and 3D panels

## Three.js UI System
- **Enhanced Three.js UI** (Modern 3D Interface)
  - Magnetic bottom tabs: Inventory, Quests, Base, Settings as 3D cards
  - 3D floating panels: Interactive panels for each tab with smooth animations
  - Particle effects system: GPU-friendly particle systems for visual feedback
  - Loading system: Sequential loading with visual spinner and progress bar
  - HTML overlay: Fixed HTML elements positioned over Three.js canvas
- **Magnetic Button System**
  - Interactive 3D buttons with magnetic pull effects
  - GSAP-powered smooth animations with fallback support
  - Touch-optimized for mobile devices
- **3D UI Panels**
  - Floating, draggable 3D UI elements
  - Smooth animations and transitions
  - Responsive design for all screen sizes

## Mobile Optimization Systems
- **MobileOptimizer**: Performance optimization for mobile devices with quality adjustment
- **ViewportCuller**: Efficient rendering by culling off-screen elements
- **MemoryManager**: Memory pressure detection and cleanup for stable performance
- **Touch Handling**: Advanced touch gesture recognition with haptic feedback

## Unified Data Models
- **PlayerModel**: Centralized player data management with persistence
- **BaseModel**: Base establishment and territory expansion data
- **QuestModel**: Quest progression and objective tracking
- **NPCModel**: NPC character data and interaction states

## WebSocket Server** (Node.js)
- Real-time multiplayer collaboration
- Position sharing and investigation updates
- Rate limiting and connection management

## Message Contracts (JSON over WebSocket)
- PositionUpdate (Client → Server):
  {
    "type": "position.update",
    "payload": { "lat": number, "lng": number, "accuracy": number | null, "timestamp": number }
  }
- InvestigationStart (Client → Server):
  {
    "type": "investigation.start",
    "payload": { "investigationId": string, "playerId": string }
  }
- ZoneEntry (Client → Server):
  {
    "type": "zone.entry",
    "payload": { "zoneType": string, "playerId": string }
  }
- PlayerCount (Server → Client):
  { "type": "playerCount", "payload": { "count": number } }

## Layer Management System
- **LayerManager**: Centralized coordination of all rendering layers
- **BaseLayer**: Abstract foundation class for all layers
- **Event-Driven Communication**: Central EventBus for inter-layer communication
- **Z-Index Management**: Proper rendering order with configurable z-index values
- **Performance Optimization**: Efficient rendering with delta time calculations

## Layer Responsibilities (Clear Separation of Concerns)

### **Visual Rendering Layers**
- **BackgroundLayer**: Cosmic atmosphere and particle effects
- **TerrainLayer**: Ground textures and elevation visualization
- **TerritoryLayer**: Base territories and influence zone visualization
- **PathLayer**: Player movement trails and path visualization
- **MapLayer**: Leaflet map display, markers, and viewport management
- **PlayerLayer**: Player avatar and movement visualization

### **Interaction & Data Layers**
- **InteractionLayer**: User input processing, touch events, gesture recognition (transparent to mouse)
- **GeolocationLayer**: GPS data management, coordinate conversion, location events (transparent to mouse)
- **InformationLayer**: HUD elements, notifications, game statistics display (transparent to mouse)

### **UI & System Layers**
- **UILayer**: Traditional HTML/CSS UI elements (menus, dialogs) - **handles mouse events**
- **ThreeJSUILayer**: Modern 3D UI with magnetic tabs and floating panels - **handles mouse events**
- **DebugLayer**: Development tools and performance monitoring (transparent to mouse)

## Three.js Scene Management
- **Scene Setup**: Complete Three.js scene with camera, lighting, and controls
- **Magnetic Tabs**: Bottom tab bar with Inventory, Quests, Base, and Settings
- **3D Panels**: Floating panels for each tab with smooth animations
- **Particle Systems**: Cosmic atmosphere with WebGL particle effects
- **Animation System**: GSAP-powered smooth animations with fallback support

## Data Flows
- **Layer Communication**: EventBus → Layer updates → Rendering pipeline
- **User Input**: Touch/Click → InteractionLayer → Event processing → UI updates
- **GPS Data**: Browser API → GeolocationLayer → Coordinate conversion → MapLayer markers
- **Map Rendering**: MapLayer → Leaflet display → Visual markers and viewport
- **Three.js UI**: User interaction → ThreeJSUILayer → 3D panel updates → Visual feedback
- **Mobile Optimization**: Performance monitoring → Quality adjustment → Memory cleanup
- **Multiplayer**: WebSocket → Position sharing → Other players' markers

## Security & Privacy
- **HTTPS/WSS**: Secure connections in production
- **Local Storage**: Investigation progress stored locally
- **No Tracking**: No external analytics or data collection
- **Rate Limiting**: WebSocket message throttling
- **Geolocation Consent**: Explicit user permission required

## Deployment
- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **WebSocket Server**: Node.js with WebSocket support
- **CDN**: Global content delivery for maps and assets
- **PWA**: Service worker for offline functionality
