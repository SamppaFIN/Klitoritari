# Eldritch Sanctuary — Cosmic Map Reboot

## Purpose
Reboot with infinite scrolling cosmic maps and real-time mystery exploration. Mobile-first design with WebGL effects and multiplayer support.

## MVP Scope (Cosmic Map Engine)
- Infinite scrolling map with Leaflet and cosmic styling
- Real-time geolocation tracking with accuracy indicators
- Investigation system with paranormal, cosmic-horror, and conspiracy mysteries
- WebGL particle effects and cosmic atmosphere
- PWA support for mobile app installation
- WebSocket multiplayer collaboration

## Target Architecture
- **Frontend**: Vanilla JavaScript + Leaflet + WebGL for infinite scrolling maps
- **Real-time**: WebSocket for multiplayer collaboration and position sharing
- **Geolocation**: HTML5 Geolocation API with accuracy indicators
- **Effects**: CSS3 animations + Three.js particles for cosmic atmosphere
- **PWA**: Service Worker + Manifest for mobile app installation

## Milestones
1. Infinite scrolling map with cosmic styling
2. Real-time geolocation tracking and markers
3. Investigation system with mystery types
4. WebGL effects and cosmic atmosphere
5. PWA mobile app installation
6. WebSocket multiplayer features

See `Architecture.md` and `MVP-Map-Engine.md` for details.

## Quickstart (Cosmic Map)
- Open `cosmic-map-app/index.html` in browser
- Or run local server: `python -m http.server 8000`
- Click "Start Tracking" for real geolocation
- Click "Start Simulator" for demo mode
- Click investigation markers to start mysteries