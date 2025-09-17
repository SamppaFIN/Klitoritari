# Architecture (Cosmic Map + WebGL)

## Components
- **Frontend App** (Vanilla JavaScript)
  - Leaflet map with infinite scrolling and cosmic styling
  - WebGL effects using Three.js for particle systems
  - Geolocation API for real-time position tracking
  - PWA manifest for mobile app installation
- **WebSocket Server** (Node.js)
  - Real-time multiplayer collaboration
  - Position sharing and investigation updates
  - Rate limiting and connection management
- **Investigation System**
  - Mystery types: paranormal, cosmic-horror, conspiracy
  - Local storage for progress tracking
  - Real-time zone detection and notifications

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

## Map System (Leaflet)
- **Infinite Scrolling**: Seamless zoom and pan across the globe
- **Cosmic Styling**: Custom tile filters for atmospheric effects
- **Marker System**: Real-time player and investigation markers
- **Zone Detection**: Proximity-based mystery zone notifications
- **Mobile Support**: Touch gestures and responsive design

## Data Flows
- **Connection**: Web UI → WebSocket Server → Real-time updates
- **Geolocation**: Browser API → Position updates → Map markers
- **Investigations**: Click markers → Start mystery → Progress tracking
- **Multiplayer**: Position sharing → Other players' markers
- **Simulator**: Demo mode → Mock position updates → Testing

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
