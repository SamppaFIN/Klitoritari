# Setup Guide — Cosmic Map App

## Prereqs
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Node.js 18+ (for WebSocket server)
- Python 3+ (for local HTTP server)

## Quick Start (No Server)
1. **Open the app** in your browser:
   ```bash
   cd cosmic-map-app
   python -m http.server 8000
   # Then open http://localhost:8000
   ```

2. **Test features**:
   - Click "Start Tracking" for real geolocation
   - Click "Start Simulator" for demo mode
   - Click investigation markers to start mysteries

## Full Setup (With WebSocket Server)
1. **Start WebSocket server** (optional):
   ```bash
   cd cosmic-map-app
   npm install ws
   node js/websocket-server.js
   ```

2. **Open the app**:
   ```bash
   python -m http.server 8000
   # Then open http://localhost:8000
   ```

3. **Connect and explore**:
   - Click "Connect" to join multiplayer
   - Start tracking or simulator
   - Click mystery markers to begin investigations

## Mobile Setup
1. **Open on mobile**: Navigate to your server URL
2. **Install PWA**: Look for "Add to Home Screen" option
3. **Grant permissions**: Allow geolocation when prompted
4. **Start exploring**: Touch controls work automatically

## Features to Test
- **Infinite Scrolling**: Zoom and pan across the globe
- **Geolocation**: Real-time position tracking with accuracy
- **Investigations**: Click markers to start mysteries
- **Mystery Zones**: Enter special areas for unique experiences
- **Multiplayer**: Share positions with other players
- **PWA**: Install as mobile app

## Troubleshooting
- **Geolocation not working**: Check browser permissions and HTTPS
- **Map not loading**: Verify internet connection for tile loading
- **WebSocket errors**: Check server is running and port is available
- **Mobile issues**: Ensure PWA manifest is loaded correctly
- **Performance**: Reduce effects quality on older devices
