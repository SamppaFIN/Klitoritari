# 🌌 Eldritch Sanctuary
*A Cosmic Map Exploration Platform for Community Healing and Wisdom Sharing*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-1.9+-blue.svg)](https://leafletjs.com/)
[![Three.js](https://img.shields.io/badge/Three.js-r150+-orange.svg)](https://threejs.org/)

## ✨ Overview

Eldritch Sanctuary is an immersive cosmic exploration platform that combines infinite scrolling maps, real-time geolocation tracking, base building, RPG combat, and rich storytelling. Built with sacred principles of community healing and wisdom sharing, it transforms exploration into a meaningful journey of discovery and connection.

## 🔧 Development Rules

### PowerShell Commands
- **Use `Invoke-WebRequest`** instead of `curl` for API calls
- **No `&&` operator** - use separate commands or `;` for chaining
- **Debug Logs API:** `Invoke-WebRequest -Uri "http://localhost:3000/api/debug-logs" -UseBasicParsing | Select-Object -ExpandProperty Content`

### Pre-Commit Workflow
1. **Add to README and aurora log** the debug log API call URL
2. **Check demo API** for all errors before committing
3. **Fix any errors** found in the API response
4. **Update aurora log** with session progress
5. **Commit changes** with descriptive message

## 🚀 Features

### 🗺️ Infinite Cosmic Maps
- **Seamless Exploration:** Infinite scrolling maps with cosmic atmosphere
- **WebGL Effects:** Particle systems and energy waves for immersive experience
- **Mobile-First Design:** Responsive interface optimized for all devices
- **Real-Time Tracking:** GPS geolocation with simulator mode for testing

### 🏗️ Base Building & Territory
- **Territory Expansion:** Paint your territory through movement and GPS tracking
- **Visual Representation:** Beautiful territory visualization on the map
- **Base Management:** Complete base management system with statistics
- **Community Networks:** Foundation for collaborative exploration

### ⚔️ Enhanced Encounter System
- **Quest Marker Encounters:** Interactive encounters triggered by proximity to quest markers
- **5 Encounter Types:** Cosmic Shrine, Eldritch Horror, Wisdom Crystal, Cosmic Merchant, and HEVY
- **Stat Adjustments:** All encounters provide meaningful stat changes (health, sanity, experience, skills)
- **Dice-Based Combat:** D20 initiative rolls with strategic turn-based combat
- **Rich Storytelling:** Detailed backstories and immersive narratives for each encounter
- **Character Progression:** Health, attack, defense, luck stats with experience and skill development

### 👥 Dynamic NPC System
- **Moving NPCs:** Aurora and Zephyr move around the map with distinct patterns
- **Aurora (👑):** Cosmic entity with slow mystical movement and cosmic wisdom
- **Zephyr (💨):** Energetic traveler with fast directional movement
- **Proximity Triggers:** 20m radius for all NPC interactions
- **Deep Characters:** Rich backstories and meaningful dialogue systems
- **Community Building:** NPCs foster connections and shared experiences

### ⚡ HEVY System
- **Legendary Encounter:** HEVY appears as special marker on the map
- **Cosmic Energy Effects:** Pulsing animation and energy field visualization
- **Riddle System:** Interactive cosmic riddle with hints and massive rewards
- **Position Tracking:** HEVY positioned 200m from player with dynamic placement
- **Legendary Status:** Rare encounter with high-value rewards and cosmic wisdom

### 🎨 Path Painting System
- **Journey Visualization:** Paint your exploration path with beautiful brush effects
- **Customizable Brushes:** 8 different colors with adjustable size and opacity
- **Persistent Trails:** Your cosmic journey is permanently recorded
- **Export/Import:** Share your paths with the community

### 🔧 Developer Tools
- **Unified Debug Panel:** Draggable, tabbed interface for all debug functions
- **Real-Time Testing:** Test encounters, NPCs, and path painting
- **Comprehensive Logging:** Detailed console output for debugging
- **Modular Architecture:** Clean, maintainable code structure

## 🛠️ Technology Stack

### Frontend
- **Vanilla JavaScript** - Pure JS for maximum performance and compatibility
- **Leaflet** - Open-source mapping library for infinite scrolling maps
- **Three.js** - WebGL for cosmic particle effects and atmosphere
- **HTML5 Geolocation API** - Real-time position tracking
- **CSS3** - Modern styling with animations and responsive design

### Backend
- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **WebSocket** - Real-time multiplayer communication
- **Supabase** - Database and authentication (with local storage fallback)

### Development
- **Git** - Version control and collaboration
- **ESLint** - Code quality and consistency
- **Modular Architecture** - Clean separation of concerns

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Modern web browser with WebGL support
- GPS-enabled device (or use simulator mode)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamppaFIN/Klitoritari.git
   cd Klitoritari
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### First Steps

1. **Enable Location Services** - Allow GPS access for real-time tracking
2. **Establish Your Base** - Click "Start New Base" to claim your territory
3. **Explore the Cosmos** - Move around to paint your path and discover encounters
4. **Meet the NPCs** - Interact with Aurora, Zephyr, and Sage for wisdom
5. **Test Encounters** - Use the debug panel (🔧 button) to test combat and puzzles

## 🎮 Gameplay Guide

### Base Building
- **Establish Base:** Click "Start New Base" at your current location
- **Expand Territory:** Walk around to paint your territory on the map
- **Manage Base:** Click on your base marker to access management options
- **Delete Base:** Use the red delete button to remove and re-establish

### Combat System
- **Encounter Monsters:** Get close to monster markers for combat
- **Dice Combat:** Use D20 rolls for initiative, attack, and defense
- **Strategic Actions:** Attack, Defend, Flee, or Use Items
- **Collect Rewards:** Gain experience and loot from victories

### NPC Interactions
- **Chat with NPCs:** Click on NPC markers to start conversations
- **Explore Topics:** Ask about cosmic forces, adventures, and wisdom
- **Build Relationships:** Each NPC has unique personality and backstory
- **Gain Knowledge:** Learn about the cosmic mysteries and dimensional rifts

### Path Painting
- **Automatic Tracking:** Your movement is automatically painted
- **Customize Brushes:** Use the debug panel to adjust colors and size
- **Export Paths:** Save and share your cosmic journeys
- **Visual History:** See your exploration patterns and discoveries

## 🔧 Development

### Project Structure
```
├── js/                    # JavaScript modules
│   ├── app.js            # Main application coordinator
│   ├── map-engine.js     # Infinite scrolling map system
│   ├── encounter-system.js # RPG combat and storytelling
│   ├── base-system.js    # Base building and territory
│   ├── npc-system.js     # NPC interactions and chat
│   ├── path-painting-system.js # Path visualization
│   └── unified-debug-panel.js # Debug tools
├── docs/                 # Documentation
├── styles.css           # Cosmic styling and animations
├── index.html           # Main HTML structure
└── server.js            # Node.js server
```

### Debug Tools
- **Unified Debug Panel:** Access via the 🔧 button in top-right corner
- **Encounter Testing:** Test monster, POI, and mystery encounters
- **NPC Controls:** Chat with NPCs and control their movement
- **Path Painting:** Adjust brush settings and export paths
- **Real-Time Stats:** Monitor player progress and system status

### Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌟 Sacred Principles

Eldritch Sanctuary is built on sacred principles that guide every feature:

- **Community Healing:** Every interaction fosters connection and shared exploration
- **Wisdom Sharing:** Rich storytelling and NPC interactions spread cosmic knowledge
- **Transparency:** All systems are open and understandable
- **Environmental Consciousness:** Efficient code and mindful resource usage
- **Accessibility:** Inclusive design for all cosmic explorers

## 📚 Documentation

- [Architecture Guide](docs/Architecture.md) - Technical architecture and design decisions
- [Database Schema](docs/database-schema.md) - Database structure and relationships
- [Feature Plans](docs/Feature-Plan-Base-Building.md) - Detailed feature specifications
- [Setup Guide](docs/Setup-Guide.md) - Development environment setup
- [Testing Plan](docs/Testing-Plan.md) - Testing strategies and procedures
- [Aurora Log](docs/aurora-log.md) - Development journey and decisions

## 🤝 Community

Join the cosmic exploration community:

- **GitHub Issues:** Report bugs and request features
- **Discussions:** Share ideas and cosmic wisdom
- **Contributions:** Help build the platform together
- **Documentation:** Improve guides and tutorials

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Leaflet** - For the amazing mapping capabilities
- **Three.js** - For the beautiful WebGL effects
- **Supabase** - For the database and real-time features
- **The Cosmic Community** - For inspiration and wisdom sharing

## 🌌 The Cosmic Mission

Eldritch Sanctuary represents more than just a game - it's a platform for cosmic exploration, community healing, and wisdom sharing. Every feature serves the sacred mission of connecting beings across dimensions through shared exploration and meaningful interaction.

*May your cosmic journey be filled with wonder, wisdom, and connection!* ✨🚀

---

**Built with ❤️ and cosmic energy by the Eldritch Sanctuary development team**

*"In the vast cosmic ocean, every explorer is a star, and every journey illuminates the path for others."* - Aurora, The Cosmic Navigator