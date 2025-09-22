/**
 * Map Engine - Leaflet integration with infinite scrolling and cosmic styling
 * Handles map rendering, markers, and real-time updates
 */

class MapEngine {
    constructor() {
        this.map = null;
        this.playerMarker = null;
        this.otherPlayerMarkers = new Map();
        this.investigationMarkers = new Map();
        this.mysteryZoneMarkers = new Map();
        this.testQuestMarkers = new Map();
        this.playerBaseMarker = null;
        this.territoryPolygon = null;
        this.isInitialized = false;
        this.onMapReady = null;
        this.onMarkerClick = null;
        this.pointsOfInterest = [];
        this.monsters = [];
        this.monsterMovementInterval = null;
        this.movementInterval = null; // For smooth movement animation
        this.pathwayMarkers = [];
        this.flagLayerVisible = true; // Start with flags visible by default
        this.finnishFlagLayer = null; // Canvas-based flag layer
        this.distortionEffectsLayer = null; // Canvas-based distortion effects layer
        this.distortionEffectsVisible = false; // Start with effects hidden by default
        this.lastPlayerPosition = null; // Track last position for path line
        this.pathLine = null; // Leaflet polyline for path visualization
        this.flagDropDistance = 10; // Drop flag every 10 meters
    }

    init() {
        if (this.isInitialized) {
            console.log('🗺️ Map engine already initialized, skipping');
            return;
        }
        
        this.setupMap();
        this.setupMapEvents();
        this.setupManualControls();
        // Initialize Finnish flag canvas layer
        this.initFinnishFlagLayer();
        
        // Initialize distortion effects canvas layer
        this.initDistortionEffectsLayer();
        
        this.isInitialized = true;
        console.log('🗺️ Map engine initialized');
        
        // Don't clear markers on initialization - they should remain visible
    }

    setupMap() {
        // Check if map is already initialized
        if (this.map) {
            console.log('🗺️ Map already exists, skipping initialization');
            return;
        }
        
        // Check if the map container is already initialized by Leaflet
        const mapContainer = document.getElementById('map');
        if (mapContainer && mapContainer.classList.contains('leaflet-container')) {
            console.log('🗺️ Map container already initialized by Leaflet, reusing existing map');
            // Try to get the existing map instance
            try {
                this.map = L.map.get(mapContainer);
                if (this.map) {
                    console.log('🗺️ Successfully retrieved existing map instance');
                    return;
                }
            } catch (e) {
                console.log('🗺️ Could not retrieve existing map, will create new one');
            }
        }
        
        // Try to initialize Leaflet map with cosmic styling - centered on Tampere Härmälä
        try {
            this.map = L.map('map', {
            center: [61.473683430224284, 23.726548746143216], // Härmälänranta
            zoom: 15,
            zoomControl: true,
            attributionControl: false,
            worldCopyJump: true, // Enable infinite scrolling
            maxBounds: [[-90, -180], [90, 180]], // Prevent infinite panning
            maxBoundsViscosity: 1.0
        });

        // Add cosmic-styled tile layer
        this.addCosmicTileLayer();
        
        // Add custom controls
        this.addCustomControls();
        
        // Set up map events
        this.setupMapEvents();
        
        } catch (error) {
            console.error('🗺️ Failed to initialize map:', error);
            // If map initialization fails, try to get existing map
            const mapContainer = document.getElementById('map');
            if (mapContainer && mapContainer._leaflet_id) {
                console.log('🗺️ Attempting to get existing map instance...');
                this.map = L.map.get(mapContainer);
            } else {
                throw error; // Re-throw if we can't recover
            }
        }
    }

    addCosmicTileLayer() {
        // Use OpenStreetMap with cosmic styling
        const cosmicTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18,
            tileSize: 256,
            zoomOffset: 0
        });

        // Apply cosmic filter to tiles
        cosmicTiles.on('tileload', (e) => {
            const img = e.tile;
            img.style.filter = 'hue-rotate(200deg) saturate(1.5) contrast(1.2) brightness(0.8) sepia(0.3)';
        });

        cosmicTiles.addTo(this.map);
    }

    addCustomControls() {
        // Add cosmic-themed zoom control
        const zoomControl = L.control.zoom({
            position: 'topright'
        });
        
        // Customize zoom control styling
        zoomControl.addTo(this.map);
        
        // Add cosmic info panel
        this.addInfoPanel();
    }

    addInfoPanel() {
        const infoPanel = L.control({ position: 'bottomright' });
        
        infoPanel.onAdd = () => {
            const div = L.DomUtil.create('div', 'cosmic-info-panel');
            div.innerHTML = `
                <div class="info-title">🌌 Eldritch Sanctuary</div>
                <div class="info-content">
                    <div>Explorers: <span id="player-count">1</span></div>
                    <div>Active Investigations: <span id="investigation-count">0</span></div>
                    <div>Mystery Zones: <span id="zone-count">0</span></div>
                </div>
            `;
            
            // Add cosmic styling
            div.style.cssText = `
                background: linear-gradient(135deg, #0a0a0a, #1a0a2e);
                border: 2px solid #6a0dad;
                border-radius: 10px;
                padding: 10px;
                color: #f0f0f0;
                font-size: 12px;
                box-shadow: 0 0 20px rgba(106, 13, 173, 0.3);
                backdrop-filter: blur(10px);
                min-width: 150px;
            `;
            
            return div;
        };
        
        infoPanel.addTo(this.map);
    }

    setupMapEvents() {
        // Map ready event
        this.map.whenReady(() => {
            console.log('🗺️ Map is ready');
            console.log('🗺️ onMapReady callback exists?', !!this.onMapReady);
            if (this.onMapReady) {
                console.log('🗺️ Calling onMapReady callback');
                this.onMapReady();
            } else {
                console.log('🗺️ No onMapReady callback to call');
            }
        });

        // Map click events
        this.map.on('click', (e) => {
            console.log('Map clicked at:', e.latlng);
        });

        // Right-click context menu
        this.map.on('contextmenu', (e) => {
            e.originalEvent.preventDefault();
            this.showContextMenu(e.latlng, e.containerPoint);
        });

        // Map move events for investigation updates
        this.map.on('moveend', () => {
            this.updateInvestigationProximity();
        });
    }

    // Player marker management
    updatePlayerPosition(position) {
        if (!this.map) return;

        const latlng = [position.lat, position.lng];
        
        const cfg = this.getPlayerMarkerConfig();
        const iconHtml = this.buildPlayerIconHTML(cfg);
        
        if (!this.playerMarker) {
            // Create multilayered player marker
            const playerIcon = L.divIcon({
                className: 'player-marker multilayered',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            this.playerMarker = L.marker(latlng, { icon: playerIcon }).addTo(this.map);
            this.playerMarker.bindPopup('<b>Player Location</b><br>Your current position in the cosmic realm');
            
            console.log('📍 Multilayered player marker created at:', latlng);
        } else {
            // Update existing marker position
            this.playerMarker.setLatLng(latlng);
            // Also refresh icon if config changed recently
            if (this._lastMarkerConfigKey !== JSON.stringify(cfg)) {
                this._lastMarkerConfigKey = JSON.stringify(cfg);
                const refreshedIcon = L.divIcon({
                    className: 'player-marker multilayered',
                    html: iconHtml,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
                this.playerMarker.setIcon(refreshedIcon);
            }
            
            // Ensure marker is still on the map
            if (!this.map.hasLayer(this.playerMarker)) {
                console.log('📍 Player marker was removed, re-adding to map');
                this.playerMarker.addTo(this.map);
            }
        }

        // Update accuracy circle
        if (position.accuracy) {
            this.updateAccuracyCircle(latlng, position.accuracy);
        }
        
        // Add flag to path if player has moved significantly
        this.addFlagToPathIfMoved(position);
        
        // Update path line between current and last position
        this.updatePathLine(position);
        
        // Update geolocation system with new position
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            
            // Update the geolocation system's position tracking
            geolocation.currentPosition = position;
            geolocation.lastValidPosition = position;
            
            // Update fallback position with the new position
            geolocation.updateFallbackPosition();
            
            console.log('📍 Updated geolocation system with new position:', position);
        }
    }

    getPlayerMarkerConfig() {
        // Read from localStorage with defaults
        let emoji = localStorage.getItem('playerMarkerEmoji') || '👤';
        let color = localStorage.getItem('playerMarkerColor') || '#00ff00';
        return { emoji, color };
    }

    setPlayerMarkerConfig(config) {
        if (config.emoji) localStorage.setItem('playerMarkerEmoji', config.emoji);
        if (config.color) localStorage.setItem('playerMarkerColor', config.color);
        // Force refresh on next position update
        this._lastMarkerConfigKey = null;
        if (this.playerMarker) {
            const iconHtml = this.buildPlayerIconHTML(this.getPlayerMarkerConfig());
            const refreshedIcon = L.divIcon({
                className: 'player-marker multilayered',
                html: iconHtml,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            this.playerMarker.setIcon(refreshedIcon);
        }
    }

    buildPlayerIconHTML(cfg) {
        const ringColor = cfg.color || '#00ff00';
        const emoji = cfg.emoji || '👤';
        return `
            <div style="position: relative; width: 40px; height: 40px;">
                <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, ${ringColor}4D 0%, transparent 70%); border-radius: 50%; animation: playerGlow 2s infinite;"></div>
                <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: ${ringColor}; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 15px ${ringColor};"></div>
                <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; background: linear-gradient(45deg, ${ringColor}, ${ringColor}); border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #ffffff; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">${emoji}</div>
            </div>
        `;
    }

    animatePlayerMarker() {
        if (!this.playerMarker) return;

        const marker = this.playerMarker;
        let scale = 1;
        let growing = true;

        const animate = () => {
            if (growing) {
                scale += 0.05;
                if (scale >= 1.3) growing = false;
            } else {
                scale -= 0.05;
                if (scale <= 1) growing = true;
            }

            marker.setRadius(8 * scale);
            
            if (marker._map) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    updateAccuracyCircle(center, accuracy) {
        // Remove existing accuracy circle
        if (this.accuracyCircle) {
            this.map.removeLayer(this.accuracyCircle);
        }

        // Create new accuracy circle
        this.accuracyCircle = L.circle(center, {
            radius: accuracy,
            color: '#00ff88',
            weight: 1,
            opacity: 0.3,
            fillOpacity: 0.1,
            dashArray: '5, 5'
        }).addTo(this.map);
    }

    // Other player markers
    updateOtherPlayer(player) {
        if (!this.map) return;

        const latlng = [player.position.lat, player.position.lng];
        
        if (this.otherPlayerMarkers.has(player.id)) {
            // Update existing marker
            this.otherPlayerMarkers.get(player.id).setLatLng(latlng);
        } else {
            // Create new marker
            const marker = L.circleMarker(latlng, {
                radius: 6,
                fillColor: '#6a0dad',
                color: '#ffffff',
                weight: 2,
                opacity: 1,
                fillOpacity: 0.8
            }).addTo(this.map);

            // Add popup with player info
            marker.bindPopup(`
                <div class="player-popup">
                    <strong>${player.name}</strong><br>
                    <small>Explorer</small>
                </div>
            `);

            this.otherPlayerMarkers.set(player.id, marker);
        }
    }

    removeOtherPlayer(playerId) {
        if (this.otherPlayerMarkers.has(playerId)) {
            this.map.removeLayer(this.otherPlayerMarkers.get(playerId));
            this.otherPlayerMarkers.delete(playerId);
        }
    }

    // Investigation markers
    addInvestigationMarker(investigation) {
        if (!this.map) return;

        const latlng = [investigation.lat, investigation.lng];
        const typeInfo = this.getInvestigationTypeInfo(investigation.type);
        
        const marker = L.circleMarker(latlng, {
            radius: 12,
            fillColor: typeInfo.color,
            color: '#ffffff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(this.map);

        // Add pulsing effect
        this.animateInvestigationMarker(marker);

        // Add popup
        marker.bindPopup(`
            <div class="investigation-popup">
                <h4>${typeInfo.icon} ${investigation.name}</h4>
                <p>${investigation.description}</p>
                <div class="investigation-meta">
                    <span class="difficulty">Difficulty: ${investigation.difficulty}</span><br>
                    <span class="type">Type: ${typeInfo.name}</span>
                </div>
                <button onclick="window.mapEngine.startInvestigation('${investigation.id}')" 
                        class="sacred-button" style="margin-top: 10px; width: 100%;">
                    Begin Investigation
                </button>
            </div>
        `);

        this.investigationMarkers.set(investigation.id, marker);
    }

    animateInvestigationMarker(marker) {
        let scale = 1;
        let growing = true;

        const animate = () => {
            if (growing) {
                scale += 0.02;
                if (scale >= 1.2) growing = false;
            } else {
                scale -= 0.02;
                if (scale <= 1) growing = true;
            }

            marker.setRadius(12 * scale);
            
            if (marker._map) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    removeInvestigationMarker(investigationId) {
        if (this.investigationMarkers.has(investigationId)) {
            this.map.removeLayer(this.investigationMarkers.get(investigationId));
            this.investigationMarkers.delete(investigationId);
        }
    }

    // Mystery zone markers
    addMysteryZoneMarkers(zones) {
        if (!this.map) return;

        zones.forEach(zone => {
            const latlng = [zone.lat, zone.lng];
            const typeInfo = this.getInvestigationTypeInfo(zone.type);
            
            const marker = L.circleMarker(latlng, {
                radius: 15,
                fillColor: typeInfo.color,
                color: '#ffffff',
                weight: 3,
                opacity: 1,
                fillOpacity: 0.6
            }).addTo(this.map);

            // Add pulsing effect
            this.animateMysteryZoneMarker(marker);

            // Add popup
            marker.bindPopup(`
                <div class="mystery-zone-popup">
                    <h4>${typeInfo.icon} ${zone.name}</h4>
                    <p>${zone.description}</p>
                    <div class="zone-meta">
                        <span class="difficulty">Difficulty: ${zone.difficulty}</span><br>
                        <span class="type">Type: ${typeInfo.name}</span>
                    </div>
                </div>
            `);

            // Add click handler to set this as target quest location
            marker.on('click', () => {
                if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                    window.eldritchApp.systems.geolocation.setTargetQuestLocation(
                        zone.lat, 
                        zone.lng, 
                        zone.name
                    );
                    console.log(`🎭 Set ${zone.name} as target quest location`);
                }
            });

            this.mysteryZoneMarkers.set(zone.id, marker);
        });
    }

    animateMysteryZoneMarker(marker) {
        let scale = 1;
        let growing = true;

        const animate = () => {
            if (growing) {
                scale += 0.01;
                if (scale >= 1.1) growing = false;
            } else {
                scale -= 0.01;
                if (scale <= 1) growing = true;
            }

            marker.setRadius(15 * scale);
            
            if (marker._map) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    getInvestigationTypeInfo(type) {
        const types = {
            paranormal: { name: 'Paranormal Activity', color: '#6a0dad', icon: '👻' },
            cosmicHorror: { name: 'Cosmic Horror', color: '#ff0040', icon: '🌌' },
            conspiracy: { name: 'Conspiracy', color: '#00ff88', icon: '🔍' }
        };
        
        return types[type] || { name: 'Unknown', color: '#666666', icon: '❓' };
    }

    // Investigation proximity updates
    updateInvestigationProximity() {
        if (!window.investigationSystem) return;

        const activeInvestigation = window.investigationSystem.getActiveInvestigation();
        if (!activeInvestigation) return;

        const playerPosition = window.geolocationManager?.getCurrentPositionData();
        if (!playerPosition) return;

        window.investigationSystem.updateInvestigationProgress(playerPosition);
    }

    // Map utilities
    centerOnPosition(position) {
        if (!this.map) return;
        
        this.map.setView([position.lat, position.lng], 15);
    }

    fitToMarkers() {
        if (!this.map) return;

        const group = new L.featureGroup();
        
        // Add all markers to group
        if (this.playerMarker) group.addLayer(this.playerMarker);
        this.otherPlayerMarkers.forEach(marker => group.addLayer(marker));
        this.investigationMarkers.forEach(marker => group.addLayer(marker));
        this.mysteryZoneMarkers.forEach(marker => group.addLayer(marker));

        if (group.getLayers().length > 0) {
            this.map.fitBounds(group.getBounds().pad(0.1));
        }
    }

    // Clear all markers
    clearAllMarkers() {
        if (!this.map) return;
        
        console.log('🗺️ Clearing all markers...');
        
        // Clear player marker
        if (this.playerMarker) {
            this.map.removeLayer(this.playerMarker);
            this.playerMarker = null;
            console.log('🗺️ Player marker cleared');
        }
        
        // Clear other player markers
        this.otherPlayerMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.otherPlayerMarkers.clear();
        console.log('🗺️ Other player markers cleared');
        
        // Clear investigation markers
        this.investigationMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.investigationMarkers.clear();
        console.log('🗺️ Investigation markers cleared');
        
        // Clear mystery zone markers
        this.mysteryZoneMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.mysteryZoneMarkers.clear();
        console.log('🗺️ Mystery zone markers cleared');
        
        // Clear test quest markers
        this.testQuestMarkers.forEach(marker => {
            this.map.removeLayer(marker);
        });
        this.testQuestMarkers.clear();
        console.log('🗺️ Test quest markers cleared');
        
        // Clear base marker
        if (this.playerBaseMarker) {
            this.map.removeLayer(this.playerBaseMarker);
            this.playerBaseMarker = null;
            console.log('🗺️ Base marker cleared');
        }
        
        // Showcase markers removed - using WebGL rendering instead
        
        // Clear POI markers
        if (this.pointsOfInterest) {
            this.pointsOfInterest.forEach(poi => {
                this.map.removeLayer(poi);
            });
            this.pointsOfInterest = [];
            console.log('🗺️ POI markers cleared');
        }
        
        // Clear monster markers
        if (this.monsters) {
            this.monsters.forEach(monster => {
                this.map.removeLayer(monster.marker);
            });
            this.monsters = [];
            console.log('🗺️ Monster markers cleared');
        }
        
        // Clear legendary markers
        if (this.legendaryMarkers) {
            this.legendaryMarkers.forEach(marker => {
                this.map.removeLayer(marker);
            });
            this.legendaryMarkers = [];
            console.log('🗺️ Legendary markers cleared');
        }
        
        // Clear quest markers
        if (this.questMarkers) {
            this.questMarkers.forEach(marker => {
                this.map.removeLayer(marker);
            });
            this.questMarkers = [];
            console.log('🗺️ Quest markers cleared');
        }
        
        // Clear territory polygon
        if (this.territoryPolygon) {
            this.map.removeLayer(this.territoryPolygon);
            this.territoryPolygon = null;
            console.log('🗺️ Territory polygon cleared');
        }
        
        // Clear accuracy circle
        if (this.accuracyCircle) {
            this.map.removeLayer(this.accuracyCircle);
            this.accuracyCircle = null;
            console.log('🗺️ Accuracy circle cleared');
        }
        
        // Clear any remaining markers by iterating through all layers
        this.map.eachLayer((layer) => {
            if (layer instanceof L.Marker || layer instanceof L.CircleMarker || layer instanceof L.Circle) {
                this.map.removeLayer(layer);
                console.log('🗺️ Removed additional marker:', layer);
            }
        });
        
        console.log('🗺️ All markers cleared');
    }

    // Reset entire game screen and recreate all markers
    resetGameScreen() {
        console.log('🔄 Resetting entire game screen...');
        
        // Clear all existing markers
        this.clearAllMarkers();
        
        // Stop any ongoing animations
        if (this.monsterMovementInterval) {
            clearInterval(this.monsterMovementInterval);
            this.monsterMovementInterval = null;
        }
        
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
        
        
        // Center map on default position
        if (this.map) {
            this.map.setView([61.4978, 23.7608], 15);
        }
        
        console.log('🔄 Game screen reset complete');
        
        // Recreate all markers after a short delay
        setTimeout(() => {
            this.recreateAllMarkers();
        }, 500);
    }

    // Recreate all marker types
    recreateAllMarkers() {
        console.log('🎯 Recreating all markers...');
        
        if (!this.map) {
            console.error('🗺️ Map not available for marker recreation');
            return;
        }
        
        // 1. Test quest markers removed as requested
        
        // 2. Generate points of interest
        this.generatePointsOfInterest();
        
        // 3. Generate monsters
        this.generateMonsters();
        
        // 4. Generate legendary encounters
        this.generateLegendaryEncounters();
        
        // 5. Marker showcase removed - using WebGL rendering instead
        
        // 6. Quest markers handled by unified quest system
        
        // 7. Add player base marker if exists
        if (window.baseSystem) {
            const playerBase = window.baseSystem.getPlayerBase();
            if (playerBase) {
                this.addPlayerBaseMarker(playerBase);
            }
        }
        
        // 8. Add player marker at default position
        this.updatePlayerPosition({
            lat: 61.4978,
            lng: 23.7608,
            accuracy: 1,
            timestamp: Date.now()
        });
        
        // 9. Start proximity detection
        this.startProximityDetection();
        
        // 10. Load mystery zones if investigation system is available
        if (window.investigationSystem) {
            const zones = window.investigationSystem.getMysteryZones();
            this.addMysteryZoneMarkers(zones);
            console.log('🎯 Mystery zones recreated:', zones.length);
        }
        
        // 11. Load NPCs if NPC system is available
        if (window.npcSystem) {
            window.npcSystem.generateNPCs();
            console.log('🎯 NPCs recreated');
        }
        
        console.log('🎯 All markers recreated successfully');
    }

    // Start proximity detection for encounters
    startProximityDetection() {
        if (window.encounterSystem) {
            window.encounterSystem.startProximityDetection();
            console.log('🎯 Proximity detection started');
        }
    }

    // Add test quest markers for interaction
    addTestQuestMarkers() {
        if (!this.map) return;
        
        console.log('🎯 Adding test quest markers...');
        
        // Test quest locations around Tampere
        const testQuests = [
            {
                name: "Mysterious Forest",
                lat: 61.4978,
                lng: 23.7608,
                type: "mystery",
                description: "A strange forest where reality seems to bend..."
            },
            {
                name: "Ancient Ruins",
                lat: 61.5000,
                lng: 23.7700,
                type: "poi",
                description: "Crumbling stones that whisper of forgotten times..."
            },
            {
                name: "Cosmic Anomaly",
                lat: 61.4950,
                lng: 23.7500,
                type: "monster",
                description: "A swirling vortex of otherworldly energy..."
            }
        ];
        
        testQuests.forEach((quest, index) => {
            const questIcon = L.divIcon({
                className: 'quest-marker',
                html: `
                    <div style="position: relative; width: 60px; height: 60px;">
                        <!-- Quest aura -->
                        <div style="position: absolute; top: -12px; left: -12px; width: 84px; height: 84px; background: radial-gradient(circle, #00ff8840 0%, #00ff8820 30%, transparent 70%); border-radius: 50%; animation: questPulse 2s infinite;"></div>
                        <!-- Quest ring -->
                        <div style="position: absolute; top: 3px; left: 3px; width: 54px; height: 54px; background: #00ff88; border: 4px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px #00ff8880;"></div>
                        <!-- Quest icon -->
                        <div style="position: absolute; top: 12px; left: 12px; width: 36px; height: 36px; background: linear-gradient(45deg, #00ff88, #00cc66); border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);">🎯</div>
                    </div>
                `,
                iconSize: [60, 60],
                iconAnchor: [30, 30]
            });
            
            const questMarker = L.marker([quest.lat, quest.lng], {
                icon: questIcon,
                interactive: true,
                clickable: true
            });
            
            // Mark as quest marker for encounter system
            questMarker.isQuestMarker = true;
            questMarker.questIndex = index;
            questMarker.questType = quest.type;
            questMarker.questName = quest.name;
            
            questMarker.bindPopup(`
                <div class="quest-popup">
                    <h4>🎯 ${quest.name}</h4>
                    <p>${quest.description}</p>
                    <p><strong>Type:</strong> ${quest.type}</p>
                    <p><strong>Distance:</strong> <span id="quest-distance-${index}">Calculating...</span></p>
                </div>
            `);
            
            questMarker.addTo(this.map);
            
            // Add to test quest markers collection
            this.testQuestMarkers.set(`quest-${index}`, questMarker);
            
            console.log(`🎯 Added quest marker: ${quest.name} at ${quest.lat}, ${quest.lng}`);
        });
        
        console.log('🎯 Added', testQuests.length, 'test quest markers');
    }

    // Base marker management
    addPlayerBaseMarker(base) {
        if (!this.map) return;

        console.log('🏗️ Adding base marker for:', base);
        
        // Prevent duplicate base marker creation
        if (this.playerBaseMarker) {
            console.log('🏗️ Base marker already exists, skipping duplicate creation');
            return;
        }
        
        const latlng = [base.lat, base.lng];
        console.log('🏗️ Base marker coordinates:', latlng);

        // Create multilayered base marker with proper click handling
        const baseIcon = L.divIcon({
            className: 'base-marker multilayered',
            html: `
                <div style="position: relative; width: 50px; height: 50px; cursor: pointer; z-index: 1000;">
                    <!-- Outer energy field -->
                    <div style="position: absolute; top: -8px; left: -8px; width: 66px; height: 66px; background: radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, transparent 70%); border-radius: 50%; animation: baseEnergy 3s infinite; pointer-events: none;"></div>
                    <!-- Middle ring -->
                    <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: #ff0000; border: 4px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px rgba(255, 0, 0, 0.8); pointer-events: none;"></div>
                    <!-- Inner star -->
                    <div style="position: absolute; top: 12px; left: 12px; width: 26px; height: 26px; background: linear-gradient(45deg, #ff0000, #cc0000); border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 8px rgba(255, 0, 0, 0.8); pointer-events: none;">⭐</div>
                    <!-- Clickable overlay -->
                    <div style="position: absolute; top: 0; left: 0; width: 50px; height: 50px; background: transparent; cursor: pointer; z-index: 1001;"></div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        
        this.playerBaseMarker = L.marker(latlng, { 
            icon: baseIcon,
            interactive: true,
            clickable: true
        }).addTo(this.map);
        
        console.log('🏗️ Created multilayered base marker');
        
        console.log('🏗️ Base marker created and added to map:', this.playerBaseMarker);
        console.log('🏗️ Base marker position:', this.playerBaseMarker.getLatLng());
        console.log('🏗️ Base marker is on map?', this.map.hasLayer(this.playerBaseMarker));
        console.log('🏗️ Base marker icon element:', this.playerBaseMarker.getElement());

        // Add pulsing animation
        this.animateBaseMarker();

        // Add popup with base info
        const popupContent = `
            <div class="base-popup">
                <div class="popup-header">
                    <h4>🏗️ ${base.name}</h4>
                </div>
                <div class="base-info">
                    <div><strong>Owner:</strong> Cosmic Explorer</div>
                    <div><strong>Established:</strong> ${base.establishedAt ? new Date(base.establishedAt).toLocaleDateString() : 'Unknown'}</div>
                    <div><strong>Territory:</strong> ${base.radius}m radius</div>
                </div>
                <div class="base-actions">
                    <button onclick="window.mapEngine.openBaseManagement()" 
                            class="sacred-button" style="margin-top: 10px; width: 100%;">
                        Manage Base
                    </button>
                    <button onclick="window.baseSystem.confirmDeleteBase()" 
                            class="sacred-button" style="background: var(--cosmic-red); margin-top: 5px; width: 100%;">
                        🗑️ Delete Base
                    </button>
                </div>
            </div>
        `;
        
        console.log('🏗️ Binding popup to base marker:', popupContent);
        this.playerBaseMarker.bindPopup(popupContent);
        
        // Add click event to open base management with delay to prevent immediate triggering
        setTimeout(() => {
            if (this.playerBaseMarker) {
        this.playerBaseMarker.on('click', (e) => {
            console.log('🏗️ Base marker clicked! Opening base management...');
            console.log('🏗️ Click event details:', e);
            console.log('🏗️ Event target:', e.target);
            console.log('🏗️ Event originalEvent:', e.originalEvent);
            
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
            e.originalEvent.stopImmediatePropagation();
            
            // Close any open popup first
            this.playerBaseMarker.closePopup();
            
            // Open base management modal
            this.openBaseManagement();
        });
            }
        }, 2000); // 2 second delay to prevent immediate triggering after creation

        // Note: Removed duplicate mousedown event listener to prevent multiple modal opens
        
        // Check if marker is interactive
        console.log('🏗️ Base marker interactive?', this.playerBaseMarker.options.interactive);
        console.log('🏗️ Base marker clickable?', this.playerBaseMarker.options.clickable);

        // Create territory circle (temporarily disabled for testing)
        // this.createTerritoryCircle(latlng, base.radius);
        console.log('🏗️ Territory circle disabled for testing');
        
        // Marker showcase removed - using WebGL rendering instead
        
        // Generate legendary encounters
        this.generateLegendaryEncounters();
        
        // Generate map content
        this.generatePointsOfInterest();
        this.generateMonsters();
    }

    openBaseManagement() {
        console.log('🏗️ Opening base management...');
        console.log('🏗️ Base system available:', !!window.baseSystem);
        console.log('🏗️ Base system methods:', window.baseSystem ? Object.keys(window.baseSystem) : 'N/A');
        
        if (window.baseSystem) {
            if (typeof window.baseSystem.showBaseManagementModal === 'function') {
                window.baseSystem.showBaseManagementModal();
            } else {
                console.error('🏗️ showBaseManagementModal method not found on base system');
            }
        } else {
            console.error('🏗️ Base system not available, trying to get it from app...');
            
            // Try to get base system from the main app
            if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.baseSystem) {
                console.log('🏗️ Found base system in app, using it...');
                window.baseSystem = window.eldritchApp.systems.baseSystem;
                if (typeof window.baseSystem.showBaseManagementModal === 'function') {
                    window.baseSystem.showBaseManagementModal();
                } else {
                    console.error('🏗️ showBaseManagementModal method still not found');
                }
            } else {
                console.error('🏗️ Base system not found in app either');
                alert('Base management system is not available. Please refresh the page.');
            }
        }
    }

    createStarIcon() {
        return `
            <div style="
                width: 50px; 
                height: 50px; 
                display: flex; 
                align-items: center; 
                justify-content: center;
                background: rgba(255, 0, 0, 0.2);
                border: 3px solid #ff0000;
                border-radius: 50%;
                font-size: 30px;
                color: #ff0000;
                text-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
            ">
                ★
            </div>
        `;
    }

    removePlayerBaseMarker() {
        if (this.playerBaseMarker) {
            this.map.removeLayer(this.playerBaseMarker);
            this.playerBaseMarker = null;
            console.log('🏗️ Base marker removed from map');
        }

        if (this.territoryPolygon) {
            this.map.removeLayer(this.territoryPolygon);
            this.territoryPolygon = null;
            console.log('🏗️ Territory circle removed from map');
        }
    }

    animateBaseMarker() {
        if (!this.playerBaseMarker) return;

        let scale = 1;
        let growing = true;

        const animate = () => {
            // Check if marker still exists and is on map
            if (!this.playerBaseMarker || !this.playerBaseMarker._map) {
                return;
            }

            if (growing) {
                scale += 0.02;
                if (scale >= 1.3) growing = false;
            } else {
                scale -= 0.02;
                if (scale <= 1) growing = true;
            }

            // Update star marker scale using CSS transform
            try {
                const starElement = this.playerBaseMarker.getElement();
                if (starElement) {
                    starElement.style.transform = `scale(${scale})`;
                }
            } catch (error) {
                // Marker might have been removed, stop animation
                console.log('🏗️ Base marker animation stopped - marker removed');
                return;
            }
            
            requestAnimationFrame(animate);
        };

        animate();
    }

    createTerritoryCircle(center, radius) {
        // Remove existing territory circle
        if (this.territoryPolygon) {
            this.map.removeLayer(this.territoryPolygon);
        }

        // Create territory circle
        this.territoryPolygon = L.circle(center, {
            radius: radius,
            color: '#ff0000',
            weight: 4,
            opacity: 1,
            fillOpacity: 0.2,
            dashArray: '20, 10',
            interactive: false  // Make it non-interactive so it doesn't capture clicks
        }).addTo(this.map);
    }

    updateTerritoryVisualization(territoryPoints) {
        if (!this.map || territoryPoints.length < 3) return;

        // Remove existing territory polygon
        if (this.territoryPolygon) {
            this.map.removeLayer(this.territoryPolygon);
        }

        // Create polygon from territory points
        const latLngs = territoryPoints.map(point => [point.lat, point.lng]);
        
        this.territoryPolygon = L.polygon(latLngs, {
            color: '#00ff88',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2,
            fillColor: '#00ff88'
        }).addTo(this.map);

        // Add pulsing effect to territory
        this.animateTerritoryPolygon();
    }

    animateTerritoryPolygon() {
        if (!this.territoryPolygon) return;

        let opacity = 0.2;
        let increasing = true;

        const animate = () => {
            if (increasing) {
                opacity += 0.01;
                if (opacity >= 0.4) increasing = false;
            } else {
                opacity -= 0.01;
                if (opacity <= 0.2) increasing = true;
            }

            this.territoryPolygon.setStyle({
                fillOpacity: opacity
            });
            
            if (this.territoryPolygon._map) {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }

    visitBase(baseId) {
        console.log('Visiting base:', baseId);
        // TODO: Implement base visiting functionality
    }


    closeBasePopup() {
        if (this.playerBaseMarker && this.playerBaseMarker.isPopupOpen()) {
            this.playerBaseMarker.closePopup();
        }
    }

    // Marker showcase removed - using WebGL rendering instead

    generatePointsOfInterest() {
        if (!this.map) return;
        
        console.log('🗺️ Generating points of interest...');
        
        // Clear existing POIs
        this.pointsOfInterest.forEach(poi => this.map.removeLayer(poi));
        this.pointsOfInterest = [];
        
        // Base location for POI generation - Härmälänranta
        const baseLat = 61.473683430224284;
        const baseLng = 23.726548746143216;
        
        // POI types with different visual styles
        const poiTypes = [
            { name: 'Ancient Ruins', emoji: '🏛️', color: '#8B4513', rarity: 'rare' },
            { name: 'Energy Crystal', emoji: '💎', color: '#00BFFF', rarity: 'common' },
            { name: 'Mystic Shrine', emoji: '⛩️', color: '#9370DB', rarity: 'uncommon' },
            { name: 'Cosmic Portal', emoji: '🌀', color: '#FF1493', rarity: 'legendary' },
            { name: 'Wisdom Stone', emoji: '🗿', color: '#708090', rarity: 'rare' },
            { name: 'Healing Spring', emoji: '💧', color: '#00CED1', rarity: 'uncommon' },
            { name: 'Shadow Grove', emoji: '🌲', color: '#2F4F4F', rarity: 'common' },
            { name: 'Stellar Observatory', emoji: '🔭', color: '#FFD700', rarity: 'rare' }
        ];
        
        // Generate 3 random POIs within 300m radius
        for (let i = 0; i < 3; i++) {
            const poiType = poiTypes[Math.floor(Math.random() * poiTypes.length)];
            const lat = baseLat + (Math.random() - 0.5) * 0.003; // Within ~300m radius
            const lng = baseLng + (Math.random() - 0.5) * 0.003;
            
            const poiIcon = L.divIcon({
                className: 'poi-marker multilayered',
                html: `
                    <div style="position: relative; width: 35px; height: 35px;">
                        <!-- Outer aura -->
                        <div style="position: absolute; top: -3px; left: -3px; width: 41px; height: 41px; background: radial-gradient(circle, ${poiType.color}20 0%, transparent 70%); border-radius: 50%; animation: poiAura 4s infinite;"></div>
                        <!-- Middle ring -->
                        <div style="position: absolute; top: 2px; left: 2px; width: 31px; height: 31px; background: ${poiType.color}; border: 2px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 10px ${poiType.color}80;"></div>
                        <!-- Inner emoji -->
                        <div style="position: absolute; top: 6px; left: 6px; width: 23px; height: 23px; background: linear-gradient(45deg, ${poiType.color}, ${poiType.color}CC); border: 1px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">${poiType.emoji}</div>
                    </div>
                `,
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            });
            
            const poi = L.marker([lat, lng], { icon: poiIcon }).addTo(this.map);
            poi.bindPopup(`
                <b>${poiType.name}</b><br>
                <span style="color: ${poiType.color}; font-weight: bold;">Rarity: ${poiType.rarity.toUpperCase()}</span><br>
                A mysterious location that may hold secrets or resources.<br>
                <button onclick="window.eldritchApp.systems.encounter.triggerPOIEncounter()" 
                        style="background: ${poiType.color}; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 5px; cursor: pointer;">
                    🎭 Test Encounter
                </button>
            `);
            
            this.pointsOfInterest.push(poi);
        }
        
        console.log('🗺️ Generated', this.pointsOfInterest.length, 'points of interest');
    }

    generateMonsters() {
        if (!this.map) return;
        
        console.log('👹 Generating monsters...');
        
        // Clear existing monsters
        this.monsters.forEach(monster => this.map.removeLayer(monster.marker));
        this.monsters = [];
        
        // Monster types
        const monsterTypes = [
            { name: 'Shadow Stalker', emoji: '👻', color: '#4B0082', speed: 0.0001 },
            { name: 'Cosmic Beast', emoji: '🐉', color: '#FF4500', speed: 0.00008 },
            { name: 'Void Walker', emoji: '🌑', color: '#2F4F4F', speed: 0.00012 },
            { name: 'Energy Phantom', emoji: '⚡', color: '#FFD700', speed: 0.00015 },
            { name: 'Crystal Guardian', emoji: '🛡️', color: '#00BFFF', speed: 0.00006 }
        ];
        
        // Generate 1 random monster
        for (let i = 0; i < 1; i++) {
            const monsterType = monsterTypes[Math.floor(Math.random() * monsterTypes.length)];
            const baseLat = 61.473683430224284;  // Härmälänranta
            const baseLng = 23.726548746143216;
            const lat = baseLat + (Math.random() - 0.5) * 0.003; // Within ~300m radius
            const lng = baseLng + (Math.random() - 0.5) * 0.003;
            
            const monsterIcon = L.divIcon({
                className: 'monster-marker multilayered',
                html: `
                    <div style="position: relative; width: 30px; height: 30px;">
                        <!-- Threat aura -->
                        <div style="position: absolute; top: -4px; left: -4px; width: 38px; height: 38px; background: radial-gradient(circle, ${monsterType.color}40 0%, transparent 70%); border-radius: 50%; animation: monsterThreat 2s infinite;"></div>
                        <!-- Monster body -->
                        <div style="position: absolute; top: 3px; left: 3px; width: 24px; height: 24px; background: ${monsterType.color}; border: 2px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 8px ${monsterType.color}80;"></div>
                        <!-- Monster face -->
                        <div style="position: absolute; top: 6px; left: 6px; width: 18px; height: 18px; background: linear-gradient(45deg, ${monsterType.color}, ${monsterType.color}CC); border: 1px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">${monsterType.emoji}</div>
                    </div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });
            
            const monster = L.marker([lat, lng], { icon: monsterIcon }).addTo(this.map);
            monster.bindPopup(`
                <b>${monsterType.name}</b><br>
                <span style="color: #ff4444; font-weight: bold;">⚠️ DANGEROUS</span><br>
                A hostile creature roaming the cosmic realm.<br>
                <button onclick="window.eldritchApp.systems.encounter.triggerMonsterEncounter()" 
                        style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 5px; margin-top: 5px; cursor: pointer;">
                    🎭 Test Encounter
                </button>
            `);
            
            this.monsters.push({
                marker: monster,
                type: monsterType,
                lat: lat,
                lng: lng,
                targetLat: lat,
                targetLng: lng,
                moveTimer: 0
            });
        }
        
        console.log('👹 Generated', this.monsters.length, 'monsters');
        
        // Start monster movement
        this.startMonsterMovement();
    }

    generateLegendaryEncounters() {
        if (!this.map) {
            console.log('⚡ Legendary encounters: Map not ready');
            return;
        }
        
        console.log('⚡ Generating legendary encounters...');
        
        // Clear existing legendary markers
        if (this.legendaryMarkers) {
            this.legendaryMarkers.forEach(marker => this.map.removeLayer(marker));
        }
        this.legendaryMarkers = [];
        
        // HEVY - The Legendary Cosmic Guardian
        const heavyLat = 61.473683430224284;  // Härmälänranta
        const heavyLng = 23.726548746143216;
        
        const heavyIcon = L.divIcon({
            className: 'legendary-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <!-- Cosmic aura -->
                    <div style="position: absolute; top: -8px; left: -8px; width: 56px; height: 56px; background: radial-gradient(circle, #ff450080 0%, #ff660040 30%, transparent 70%); border-radius: 50%; animation: legendaryPulse 3s infinite;"></div>
                    <!-- Energy rings -->
                    <div style="position: absolute; top: -4px; left: -4px; width: 48px; height: 48px; border: 2px solid #ff4500; border-radius: 50%; animation: legendaryRotate 4s linear infinite; opacity: 0.6;"></div>
                    <div style="position: absolute; top: -2px; left: -2px; width: 44px; height: 44px; border: 1px solid #ffcc00; border-radius: 50%; animation: legendaryRotate 3s linear infinite reverse; opacity: 0.4;"></div>
                    <!-- HEVY core -->
                    <div style="position: absolute; top: 4px; left: 4px; width: 32px; height: 32px; background: linear-gradient(45deg, #ff4500, #ff6600); border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 15px #ff4500, inset 0 0 10px #ffcc00;"></div>
                    <!-- HEVY symbol -->
                    <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold; color: #ffffff; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">⚡</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        const heavyMarker = L.marker([heavyLat, heavyLng], { icon: heavyIcon }).addTo(this.map);
        console.log('⚡ HEVY marker created at:', heavyLat, heavyLng);
        heavyMarker.bindPopup(`
            <div style="text-align: center; color: #ff4500; font-weight: bold;">
                <h3>⚡ HEVY</h3>
                <p style="margin: 10px 0; color: #ffcc00;">The Legendary Cosmic Guardian</p>
                <p style="color: #ffffff; font-size: 0.9em;">A transcendent being of pure cosmic energy, appearing only to those ready for the ultimate test of the heart.</p>
                <div style="margin: 15px 0; padding: 10px; background: rgba(255, 69, 0, 0.1); border-radius: 8px; border: 1px solid #ff4500;">
                    <strong>Quest:</strong> Answer the cosmic riddle<br>
                    <strong>Reward:</strong> 1000 XP + 500 Steps + Legendary Items
                </div>
                <button onclick="if(window.encounterSystem) { window.encounterSystem.testHeavyEncounter(); } else { console.error('Encounter system not available'); }" 
                        style="background: linear-gradient(45deg, #ff4500, #ff6600); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                    ⚡ Approach HEVY
                </button>
            </div>
        `);
        
        this.legendaryMarkers.push(heavyMarker);
        console.log('⚡ Generated HEVY legendary encounter marker');
    }

    // Quest markers handled by unified quest system

    startMonsterMovement() {
        if (this.monsterMovementInterval) {
            clearInterval(this.monsterMovementInterval);
        }
        
        this.monsterMovementInterval = setInterval(() => {
            this.monsters.forEach(monster => {
                // Update move timer
                monster.moveTimer++;
                
                // Change direction every 3-8 seconds
                if (monster.moveTimer > Math.random() * 5 + 3) {
                    const baseLat = 61.4978;
                    const baseLng = 23.7608;
                    monster.targetLat = baseLat + (Math.random() - 0.5) * 0.008;
                    monster.targetLng = baseLng + (Math.random() - 0.5) * 0.008;
                    monster.moveTimer = 0;
                }
                
                // Move towards target
                const latDiff = monster.targetLat - monster.lat;
                const lngDiff = monster.targetLng - monster.lng;
                const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
                
                if (distance > 0.0001) {
                    const moveSpeed = monster.type.speed;
                    monster.lat += (latDiff / distance) * moveSpeed;
                    monster.lng += (lngDiff / distance) * moveSpeed;
                    
                    monster.marker.setLatLng([monster.lat, monster.lng]);
                }
            });
        }, 100); // Update every 100ms
    }

    // Cleanup
    destroy() {
        if (this.monsterMovementInterval) {
            clearInterval(this.monsterMovementInterval);
        }
        
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        this.playerMarker = null;
        this.otherPlayerMarkers.clear();
        this.investigationMarkers.clear();
        this.mysteryZoneMarkers.clear();
        this.playerBaseMarker = null;
        this.territoryPolygon = null;
        this.isInitialized = false;
    }
    
    setupManualControls() {
        console.log('🎮 Setting up manual movement controls...');
        // Click handler will be set up when manual mode is enabled
    }
    
    showContextMenu(latlng, containerPoint) {
        console.log('🎮 Showing context menu at:', latlng);
        
        // Remove existing context menu
        this.hideContextMenu();
        
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'map-context-menu';
        contextMenu.className = 'map-context-menu';
        contextMenu.style.cssText = `
            position: absolute;
            left: ${containerPoint.x}px;
            top: ${containerPoint.y}px;
            background: var(--cosmic-dark);
            border: 2px solid var(--cosmic-purple);
            border-radius: 10px;
            padding: 10px;
            z-index: 2000;
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
            min-width: 200px;
        `;
        
        contextMenu.innerHTML = `
            <div style="color: var(--cosmic-light); font-weight: bold; margin-bottom: 10px; text-align: center;">
                🌌 Location Actions
            </div>
            <div style="color: var(--cosmic-light); font-size: 12px; margin-bottom: 10px; text-align: center;">
                ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}
            </div>
            <button class="context-menu-btn" onclick="window.mapEngine.movePlayer(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px;">
                🚶 Move Here
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.centerOnLocation(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px;">
                🎯 Center Map
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.dropFlagHere(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-green);">
                🇫🇮 Drop Flag Here
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.cycleFlagTheme()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-pink);">
                🌈 Flag Theme
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.createTestDistortionEffects()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-red);">
                👻 Test Effects
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.clearPathLine()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-orange);">
                🗑️ Clear Path
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.openBaseManagement()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-green);">
                🏗️ Establish/Open Base
            </button>
            <button class="context-menu-btn" onclick="window.unifiedQuestSystem.showQuestLog()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-orange);">
                📜 Quests
            </button>
            <button class="context-menu-btn" onclick="window.eldritchApp.toggleSidePanel()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-gray);">
                ⚙️ Settings
            </button>
            <button class="context-menu-btn" onclick="window.eldritchApp.systems.inventory.showInventory()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-purple);">
                🎒 Inventory
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.hideContextMenu()" style="width: 100%; background: var(--cosmic-red);">
                ❌ Close
            </button>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Close menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', this.hideContextMenu.bind(this), { once: true });
        }, 100);
    }
    
    hideContextMenu() {
        const contextMenu = document.getElementById('map-context-menu');
        if (contextMenu) {
            contextMenu.remove();
        }
    }
    
    teleportPlayer(lat, lng) {
        console.log(`🎮 Teleporting player to: ${lat}, ${lng}`);
        this.hideContextMenu();
        
        // Disable device GPS and use fixed position
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            console.log('🎮 Disabling device GPS for teleport');
            window.eldritchApp.systems.geolocation.deviceGPSEnabled = false;
            window.eldritchApp.systems.geolocation.fixedPosition = { lat, lng };
            window.eldritchApp.systems.geolocation.startTracking();
        }
    }
    
    movePlayer(lat, lng) {
        console.log(`🎮 Moving player to: ${lat}, ${lng}`);
        this.hideContextMenu();
        
        // Give 50 cosmic steps for using Move Here (async to not block movement)
        setTimeout(() => {
            this.giveMoveHereSteps();
        }, 100);
        
        // Pause location updates during movement
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            window.eldritchApp.systems.geolocation.pauseLocationUpdates();
        }
        
        // Fail-safe: snap marker immediately so the user sees movement
        try {
            this.updatePlayerPosition({ lat, lng, accuracy: 1, timestamp: Date.now() });
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.showNotification({
                    type: 'info',
                    title: 'Moving...',
                    message: 'Simulating path to destination',
                    duration: 1500
                });
            }
        } catch (e) {
            console.warn('🎮 Immediate marker snap failed:', e);
        }
        
        // Get current player position
        const currentPos = this.getPlayerPosition();
        if (!currentPos) {
            console.warn('🎮 No current player position available, using fallback');
            // Use fallback position if no GPS position available
            const fallback = { lat: 61.472768, lng: 23.724032 }; // User's known location
            this.simulatePlayerMovement(fallback, { lat, lng });
            return;
        }
        
        // Start simulated movement with pathway painting
        this.simulatePlayerMovement(currentPos, { lat, lng });
    }
    
    simulatePlayerMovement(startPos, endPos) {
        console.log(`🎮 Simulating movement from ${startPos.lat}, ${startPos.lng} to ${endPos.lat}, ${endPos.lng}`);
        
        // Disable device GPS for manual movement
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            window.eldritchApp.systems.geolocation.deviceGPSEnabled = false;
        }
        
        // Calculate movement parameters
        const totalDistance = this.calculateDistance(startPos.lat, startPos.lng, endPos.lat, endPos.lng);
        const steps = Math.max(10, Math.floor(totalDistance / 5)); // 5m per step
        const stepDuration = 100; // 100ms per step
        
        console.log(`🎮 Movement: ${totalDistance.toFixed(1)}m in ${steps} steps`);
        console.log(`🎮 Starting movement interval with ${stepDuration}ms duration`);
        
        let currentStep = 0;
        const movementInterval = setInterval(() => {
            console.log(`🎮 Movement step ${currentStep + 1}/${steps}`);
            
            if (currentStep >= steps) {
                clearInterval(movementInterval);
                console.log('🎮 Movement simulation complete');
                
                // Resume location updates when movement is complete
                if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                    window.eldritchApp.systems.geolocation.resumeLocationUpdates();
                }
                return;
            }
            
            // Calculate intermediate position
            const progress = currentStep / steps;
            const currentLat = startPos.lat + (endPos.lat - startPos.lat) * progress;
            const currentLng = startPos.lng + (endPos.lng - startPos.lng) * progress;
            
            console.log(`🎮 Step ${currentStep + 1}: Moving to ${currentLat.toFixed(6)}, ${currentLng.toFixed(6)} (progress: ${(progress * 100).toFixed(1)}%)`);
            
            // Update player position
            this.updatePlayerPosition({
                lat: currentLat,
                lng: currentLng,
                accuracy: 1,
                timestamp: Date.now()
            });
            
            // Paint pathway with Finnish flags
            this.paintPathwayStep(currentLat, currentLng, progress);
            
            currentStep++;
        }, stepDuration);
    }
    
    paintPathwayStep(lat, lng, progress) {
        console.log(`🎨 Painting pathway step at ${lat.toFixed(6)}, ${lng.toFixed(6)}, progress: ${progress.toFixed(2)}`);
        
        // Add to path painting system visited points
        if (window.eldritchApp && window.eldritchApp.systems.pathPainting) {
            const pathPainting = window.eldritchApp.systems.pathPainting;
            if (pathPainting.visitedPoints) {
                pathPainting.visitedPoints.push({
                    lat: lat,
                    lng: lng,
                    timestamp: Date.now()
                });
                console.log(`🎨 Added to visited points, total: ${pathPainting.visitedPoints.length}`);
            }
        }
        
        // Add Finnish flag every few steps using canvas layer
        if (Math.floor(progress * 20) % 3 === 0) {
            console.log(`🎨 Adding Finnish flag at progress ${progress.toFixed(2)}`);
            if (this.finnishFlagLayer) {
                this.finnishFlagLayer.addFlagPin(lat, lng);
                // Give 50 cosmic steps for drawing a flag (async to not block movement)
                setTimeout(() => {
                    this.giveFlagSteps();
                }, 50);
            } else {
                // Fallback to old method
                this.addFinnishFlagToPath(lat, lng, progress);
                // Give 50 cosmic steps for drawing a flag (async to not block movement)
                setTimeout(() => {
                    this.giveFlagSteps();
                }, 50);
            }
        }
    }
    
    giveMoveHereSteps() {
        // Give 50 cosmic steps for using Move Here button
        try {
            if (window.stepCurrencySystem) {
                for (let i = 0; i < 50; i++) {
                    window.stepCurrencySystem.addManualStep();
                }
                console.log('🚶‍♂️ Gave 50 cosmic steps for Move Here action');
            } else {
                console.warn('🚶‍♂️ Step currency system not available');
            }
        } catch (error) {
            console.error('🚶‍♂️ Error giving Move Here steps:', error);
        }
    }
    
    giveFlagSteps() {
        // Give 50 cosmic steps for drawing a flag
        if (window.stepCurrencySystem) {
            for (let i = 0; i < 50; i++) {
                window.stepCurrencySystem.addManualStep();
            }
            console.log('🚶‍♂️ Gave 50 cosmic steps for drawing flag');
        } else {
            console.warn('🚶‍♂️ Step currency system not available');
        }
    }
    
    addFinnishFlagToPath(lat, lng, progress) {
        console.log(`🇫🇮 Creating Finnish flag at ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        
        // Create a more visible Finnish flag marker for the pathway
        const flagIcon = L.divIcon({
            className: 'pathway-flag',
            html: `
                <div style="
                    width: 40px; 
                    height: 24px; 
                    background: linear-gradient(to right, #003580 0%, #003580 20%, #FFFFFF 20%, #FFFFFF 80%, #003580 80%, #003580 100%);
                    border: 2px solid #000;
                    border-radius: 4px;
                    position: relative;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.5);
                    animation: flagWave 2s ease-in-out infinite;
                ">
                    <div style="
                        position: absolute;
                        top: 50%;
                        left: 0;
                        right: 0;
                        height: 4px;
                        background: #003580;
                        transform: translateY(-50%);
                    "></div>
                    <div style="
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        left: 50%;
                        width: 4px;
                        background: #003580;
                        transform: translateX(-50%);
                    "></div>
                    <div style="
                        position: absolute;
                        top: -8px;
                        left: -2px;
                        width: 44px;
                        height: 40px;
                        background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
                        border-radius: 50%;
                        z-index: -1;
                    "></div>
                </div>
            `,
            iconSize: [40, 24],
            iconAnchor: [20, 12]
        });
        
        const flagMarker = L.marker([lat, lng], { icon: flagIcon }).addTo(this.map);
        console.log(`🇫🇮 Flag marker created and added to map:`, flagMarker);
        
        // Add to pathway markers collection
        if (!this.pathwayMarkers) {
            this.pathwayMarkers = [];
            console.log(`🇫🇮 Initialized pathwayMarkers array`);
        }
        this.pathwayMarkers.push(flagMarker);
        console.log(`🇫🇮 Added flag to collection, total flags: ${this.pathwayMarkers.length}`);
        
        // Fade out after some time
        setTimeout(() => {
            if (flagMarker && this.map.hasLayer(flagMarker)) {
                flagMarker.setOpacity(0.3);
                console.log(`🇫🇮 Flag faded to 30% opacity`);
            }
        }, 5000);
    }
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    centerOnLocation(lat, lng) {
        console.log(`🎮 Centering map on: ${lat}, ${lng}`);
        this.hideContextMenu();
        this.map.setView([lat, lng], this.map.getZoom());
    }
    
    clearPathwayMarkers() {
        if (this.finnishFlagLayer) {
            this.finnishFlagLayer.clearFlags();
            console.log('🎮 Cleared canvas flag layer');
        }
        
        if (this.pathwayMarkers) {
            this.pathwayMarkers.forEach(marker => {
                if (this.map.hasLayer(marker)) {
                    this.map.removeLayer(marker);
                }
            });
            this.pathwayMarkers = [];
            console.log('🎮 Cleared pathway markers');
        }
    }
    
    showFlagLayer() {
        console.log('🇫🇮 Showing flag layer...');
        
        if (this.finnishFlagLayer) {
            this.finnishFlagLayer.toggleVisibility();
            console.log('🇫🇮 Canvas flag layer toggled, total flags:', this.finnishFlagLayer.getFlagCount());
        } else {
            // Fallback to old method
            console.log('🇫🇮 Pathway markers count:', this.pathwayMarkers ? this.pathwayMarkers.length : 0);
            if (this.pathwayMarkers) {
                this.pathwayMarkers.forEach((marker, index) => {
                    console.log(`🇫🇮 Processing marker ${index}:`, marker);
                    if (!this.map.hasLayer(marker)) {
                        console.log(`🇫🇮 Adding marker ${index} to map`);
                        marker.addTo(this.map);
                    } else {
                        console.log(`🇫🇮 Marker ${index} already on map`);
                    }
                    marker.setOpacity(1);
                    console.log(`🇫🇮 Set marker ${index} opacity to 1`);
                });
            }
        }
        
        this.flagLayerVisible = true;
        console.log('🇫🇮 Flag layer visibility set to true');
    }
    
    hideFlagLayer() {
        console.log('🇫🇮 Hiding flag layer...');
        if (this.pathwayMarkers) {
            this.pathwayMarkers.forEach(marker => {
                marker.setOpacity(0);
            });
        }
        this.flagLayerVisible = false;
    }
    
    toggleFlagLayer() {
        if (this.flagLayerVisible) {
            this.hideFlagLayer();
        } else {
            this.showFlagLayer();
        }
        
        // Update button state in app
        if (window.eldritchApp) {
            window.eldritchApp.updateFlagButtonState();
        }
    }
    
    zoomToFlagLayer() {
        console.log('🇫🇮 Zooming to flag layer...');
        if (!this.pathwayMarkers || this.pathwayMarkers.length === 0) {
            console.log('🇫🇮 No flags to zoom to');
            return;
        }
        
        // Calculate bounds of all flags
        const group = new L.featureGroup(this.pathwayMarkers);
        this.map.fitBounds(group.getBounds().pad(0.1));
        console.log('🇫🇮 Zoomed to flag bounds');
    }
    
    initFinnishFlagLayer() {
        if (typeof FinnishFlagCanvasLayer !== 'undefined') {
            this.finnishFlagLayer = new FinnishFlagCanvasLayer(this);
            console.log('🇫🇮 Finnish flag canvas layer initialized');
            // Make it globally accessible for step system
            window.mapEngine = this;
        } else {
            console.warn('🇫🇮 FinnishFlagCanvasLayer not available');
        }
    }
    
    initDistortionEffectsLayer() {
        if (typeof DistortionEffectsCanvasLayer !== 'undefined') {
            this.distortionEffectsLayer = new DistortionEffectsCanvasLayer(this);
            console.log('🌀 Distortion effects canvas layer initialized');
        } else {
            console.warn('🌀 DistortionEffectsCanvasLayer not available');
        }
    }
    
    toggleFlagOpacity() {
        if (this.finnishFlagLayer) {
            const currentOpacity = this.finnishFlagLayer.opacity;
            const newOpacity = currentOpacity === 0.5 ? 1.0 : currentOpacity === 1.0 ? 0.2 : 0.5;
            this.finnishFlagLayer.setOpacity(newOpacity);
            console.log('🇫🇮 Flag opacity toggled to:', newOpacity);
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }
    
    cycleFlagColors() {
        if (this.finnishFlagLayer) {
            this.finnishFlagLayer.cycleColorScheme();
            console.log('🇫🇮 Flag colors cycled to:', this.finnishFlagLayer.currentColorScheme);
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }
    
    cycleFlagTheme() {
        if (this.finnishFlagLayer) {
            this.finnishFlagLayer.cycleColorScheme();
            const currentTheme = this.finnishFlagLayer.currentColorScheme;
            console.log('🇫🇮 Flag theme cycled to:', currentTheme);
            
            // Show notification of theme change
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.showNotification({
                    type: 'info',
                    title: 'Flag Theme Changed',
                    message: `Switched to ${currentTheme} theme`,
                    duration: 3000
                });
            }
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }

    dropFlagHere(lat, lng) {
        if (!this.finnishFlagLayer) {
            console.warn('🇫🇮 Finnish flag layer not available');
            return;
        }
        console.log(`🇫🇮 Dropping flag at: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        this.finnishFlagLayer.addFlagPin(lat, lng);
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification({
                type: 'success',
                title: 'Flag Dropped',
                message: 'A Finnish flag was placed at the selected location.',
                duration: 2000
            });
        }
    }
    
    // Distortion Effects Layer Methods
    showDistortionEffects() {
        console.log('🌀 Showing distortion effects layer...');
        if (this.distortionEffectsLayer) {
            this.distortionEffectsLayer.toggleVisibility();
            console.log('🌀 Canvas distortion effects layer toggled, total effects:', this.distortionEffectsLayer.getEffectCount());
        }
        this.distortionEffectsVisible = true;
        console.log('🌀 Distortion effects visibility set to true');
    }
    
    hideDistortionEffects() {
        console.log('🌀 Hiding distortion effects layer...');
        if (this.distortionEffectsLayer) {
            this.distortionEffectsLayer.toggleVisibility();
        }
        this.distortionEffectsVisible = false;
    }
    
    toggleDistortionEffects() {
        if (this.distortionEffectsVisible) {
            this.hideDistortionEffects();
        } else {
            this.showDistortionEffects();
        }
        
        // Update button state in app
        if (window.eldritchApp) {
            window.eldritchApp.updateDistortionButtonState();
        }
    }
    
    addDistortionEffect(effectType, lat, lng, intensity = 1.0) {
        if (this.distortionEffectsLayer) {
            this.distortionEffectsLayer.addEffect(effectType, lat, lng, intensity);
            console.log('🌀 Added distortion effect:', effectType, 'at', lat, lng);
        } else {
            console.log('🌀 Distortion effects layer not available');
        }
    }
    
    clearDistortionEffects() {
        if (this.distortionEffectsLayer) {
            this.distortionEffectsLayer.clearEffects();
            console.log('🌀 Cleared all distortion effects');
        }
    }
    
    createTestDistortionEffects() {
        console.log('🌀 Creating test distortion effects...');
        const playerPos = this.getPlayerPosition();
        if (!playerPos) {
            console.log('🌀 No player position available for test effects');
            return;
        }
        
        if (this.distortionEffectsLayer) {
            // Create one of each effect type around the player
            const effects = ['drippingBlood', 'ghost', 'cosmicDistortion', 'shadowTendrils', 'eldritchEyes'];
            effects.forEach((effectType, index) => {
                const testLat = playerPos.lat + (index * 0.0001);
                const testLng = playerPos.lng + (index * 0.0001);
                this.distortionEffectsLayer.addEffect(effectType, testLat, testLng, 0.5);
            });
            console.log('🌀 Test distortion effects created, total effects:', this.distortionEffectsLayer.getEffectCount());
        } else {
            console.log('🌀 Distortion effects layer not available');
        }
    }
    
    createTestRealisticEffects() {
        console.log('🌊 Creating test realistic effects...');
        if (this.distortionEffectsLayer) {
            this.distortionEffectsLayer.createTestRealisticEffects();
        } else {
            console.log('🌊 Distortion effects layer not available');
        }
    }
    
    showcaseAllEffects() {
        console.log('🎭 Starting effects showcase...');
        if (!this.distortionEffectsLayer) {
            console.log('🎭 Distortion effects layer not available');
            return;
        }
        
        // Clear existing effects first
        this.distortionEffectsLayer.clearEffects();
        
        // Show the effects layer
        this.showDistortionEffects();
        
        // Get all available effect types
        const allEffectTypes = this.distortionEffectsLayer.getAvailableEffectTypes();
        console.log('🎭 Available effect types:', allEffectTypes);
        
        // Get player position
        const playerPos = this.getPlayerPosition();
        if (!playerPos) {
            console.log('🎭 No player position available for effects showcase');
            return;
        }
        
        // Show each effect type for 5 seconds
        allEffectTypes.forEach((effectType, index) => {
            setTimeout(() => {
                console.log(`🎭 Showcasing effect: ${effectType}`);
                
                // Clear previous effects
                this.distortionEffectsLayer.clearEffects();
                
                // Create multiple instances of the current effect type around the player
                for (let i = 0; i < 3; i++) {
                    const angle = (i * Math.PI * 2 / 3) + (index * 0.5); // Spread around player
                    const offset = 0.0001; // Small offset for multiple instances
                    const testLat = playerPos.lat + Math.cos(angle) * offset;
                    const testLng = playerPos.lng + Math.sin(angle) * offset;
                    
                    this.distortionEffectsLayer.addEffect(effectType, testLat, testLng, 1.0);
                }
                
                // Show effect name in console
                const effectConfig = this.distortionEffectsLayer.effectTypes[effectType];
                console.log(`🎭 Now showing: ${effectConfig.emoji} ${effectConfig.name}`);
                
            }, index * 5000); // 5 seconds between each effect
        });
        
        // Clear all effects after showcase is complete
        setTimeout(() => {
            console.log('🎭 Effects showcase complete, clearing all effects...');
            this.distortionEffectsLayer.clearEffects();
        }, allEffectTypes.length * 5000 + 2000); // Clear after all effects + 2 seconds
        
        console.log(`🎭 Effects showcase started! Will show ${allEffectTypes.length} effect types over ${allEffectTypes.length * 5} seconds`);
    }
    
    // Debug function to create test flags
    createTestFlags() {
        console.log('🇫🇮 Creating test flags for debugging...');
        const playerPos = this.getPlayerPosition();
        if (!playerPos) {
            console.log('🇫🇮 No player position available for test flags');
            return;
        }
        
        if (this.finnishFlagLayer) {
            // Create 5 test flags in a line using canvas layer
            for (let i = 0; i < 5; i++) {
                const testLat = playerPos.lat + (i * 0.0001);
                const testLng = playerPos.lng + (i * 0.0001);
                this.finnishFlagLayer.addFlagPin(testLat, testLng);
            }
            console.log('🇫🇮 Test flags created on canvas layer, total flags:', this.finnishFlagLayer.getFlagCount());
        } else {
            // Fallback to old method
            for (let i = 0; i < 5; i++) {
                const testLat = playerPos.lat + (i * 0.0001);
                const testLng = playerPos.lng + (i * 0.0001);
                this.addFinnishFlagToPath(testLat, testLng, i / 4);
            }
            console.log('🇫🇮 Test flags created, total flags:', this.pathwayMarkers ? this.pathwayMarkers.length : 0);
        }
    }
    
    // Debug function to show flag statistics
    showFlagStatistics() {
        if (this.finnishFlagLayer) {
            const stats = this.finnishFlagLayer.getFlagStatistics();
            console.log('🇫🇮 Flag Statistics:', stats);
            
            // Show notification with flag stats
            if (window.gruesomeNotifications) {
                const sizeText = Object.entries(stats.sizeDistribution)
                    .map(([size, count]) => `${size}px: ${count}`)
                    .join(', ');
                
                window.gruesomeNotifications.showNotification({
                    type: 'info',
                    title: 'Flag Statistics',
                    message: `Total: ${stats.totalFlags} flags. Sizes: ${sizeText}`,
                    duration: 5000
                });
            }
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }
    

    getPlayerPosition() {
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            
            // First try to get current GPS position
            const position = geolocation.getCurrentPositionSafe();
            if (position) {
                console.log('📍 Using GPS position:', position);
                return {
                    lat: position.lat,
                    lng: position.lng
                };
            }
            
            // If no GPS position, try to get the last valid position
            if (geolocation.lastValidPosition) {
                console.log('📍 Using last valid position:', geolocation.lastValidPosition);
                return {
                    lat: geolocation.lastValidPosition.lat,
                    lng: geolocation.lastValidPosition.lng
                };
            }
            
            // If no valid position at all, use fallback
            console.log('📍 No valid position available, using fallback position');
            return {
                lat: 61.472768, // User's known location
                lng: 23.724032
            };
        } else {
            console.log('📍 No geolocation system available, using fallback position');
            return {
                lat: 61.472768, // User's known location
                lng: 23.724032
            };
        }
    }
    
    
    
    
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
    
    // Add flag to path if player has moved significantly
    addFlagToPathIfMoved(position) {
        if (!this.finnishFlagLayer) return;
        
        if (this.lastPlayerPosition) {
            const distance = this.calculateDistance(
                this.lastPlayerPosition.lat, this.lastPlayerPosition.lng,
                position.lat, position.lng
            );
            
            // Drop flag every 10 meters of movement
            if (distance >= this.flagDropDistance) {
                console.log(`🎨 Player moved ${distance.toFixed(1)}m - dropping flag`);
                this.finnishFlagLayer.addFlagPin(position.lat, position.lng);
                
                // Give steps for movement
                if (window.eldritchApp && window.eldritchApp.systems.stepCurrency) {
                    const stepsToAdd = Math.floor(distance / 5); // 1 step per 5 meters
                    for (let i = 0; i < stepsToAdd; i++) {
                        window.eldritchApp.systems.stepCurrency.addManualStep();
                    }
                }
            }
        }
        
        // Update last position
        this.lastPlayerPosition = { lat: position.lat, lng: position.lng };
    }
    
    // Update path line between current and last position
    updatePathLine(position) {
        if (!this.map) return;
        
        if (this.lastPlayerPosition) {
            // Create or update path line
            if (this.pathLine) {
                // Update existing path line
                const currentPath = this.pathLine.getLatLngs();
                currentPath.push([position.lat, position.lng]);
                this.pathLine.setLatLngs(currentPath);
            } else {
                // Create new path line
                this.pathLine = L.polyline([
                    [this.lastPlayerPosition.lat, this.lastPlayerPosition.lng],
                    [position.lat, position.lng]
                ], {
                    color: '#00ff00',
                    weight: 3,
                    opacity: 0.8,
                    dashArray: '5, 10'
                }).addTo(this.map);
            }
        }
    }
    
    // Clear path line
    clearPathLine() {
        if (this.pathLine) {
            this.map.removeLayer(this.pathLine);
            this.pathLine = null;
            console.log('🗺️ Path line cleared');
        }
    }
    
}

// Export for use in other modules
window.MapEngine = MapEngine;
