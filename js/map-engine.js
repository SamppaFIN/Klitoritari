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
        this.manualMode = false;
        this.manualPosition = { lat: 61.4978, lng: 23.7608 }; // Default Tampere area
        this.movementInterval = null; // For smooth movement animation
        this.manualClickHandler = null; // For manual mode click handler
    }

    init() {
        if (this.isInitialized) {
            console.log('🗺️ Map engine already initialized, skipping');
            return;
        }
        
        this.setupMap();
        this.setupMapEvents();
        this.setupManualControls();
        this.isInitialized = true;
        console.log('🗺️ Map engine initialized');
        
        // Clear any existing markers on initialization
        setTimeout(() => {
            this.clearAllMarkers();
            // Add some test quest markers for interaction
            this.addTestQuestMarkers();
        }, 300);
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
            console.log(`🎮 Manual mode: ${this.manualMode}, Handler: ${!!this.manualClickHandler}`);
            console.log(`🎮 Map engine instance:`, this);
            console.log(`🎮 Manual mode property:`, this.manualMode);
            
            // If in manual mode, handle movement
            if (this.manualMode && this.manualClickHandler) {
                console.log('🎮 Delegating to manual click handler');
                this.manualClickHandler(e);
            } else {
                console.log('🎮 Not in manual mode or no handler available');
            }
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
        
        if (!this.playerMarker) {
            // Create multilayered player marker
            const playerIcon = L.divIcon({
                className: 'player-marker multilayered',
                html: `
                    <div style="position: relative; width: 40px; height: 40px;">
                        <!-- Outer glow ring -->
                        <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, rgba(0, 255, 0, 0.3) 0%, transparent 70%); border-radius: 50%; animation: playerGlow 2s infinite;"></div>
                        <!-- Middle ring -->
                        <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #00ff00; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.8; box-shadow: 0 0 15px rgba(0, 255, 0, 0.8);"></div>
                        <!-- Inner core -->
                        <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; background: linear-gradient(45deg, #00ff00, #00cc00); border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #ffffff; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">👤</div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            this.playerMarker = L.marker(latlng, { icon: playerIcon }).addTo(this.map);
            this.playerMarker.bindPopup('<b>Player Location</b><br>Your current position in the cosmic realm');
            
            console.log('📍 Multilayered player marker created at:', latlng);
        } else {
            // Update existing marker position
            this.playerMarker.setLatLng(latlng);
            
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
        
        // Clear showcase markers
        if (this.showcaseMarkers) {
            this.showcaseMarkers.forEach(marker => {
                this.map.removeLayer(marker);
            });
            this.showcaseMarkers = [];
            console.log('🗺️ Showcase markers cleared');
        }
        
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
        
        // Reset manual mode
        this.manualMode = false;
        this.manualClickHandler = null;
        
        // Reset position to default
        this.manualPosition = { lat: 61.4978, lng: 23.7608 };
        
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
        
        // 1. Add test quest markers
        this.addTestQuestMarkers();
        
        // 2. Generate points of interest
        this.generatePointsOfInterest();
        
        // 3. Generate monsters
        this.generateMonsters();
        
        // 4. Generate legendary encounters
        this.generateLegendaryEncounters();
        
        // 5. Create marker showcase
        this.createMarkerShowcase();
        
        // 6. Add quest markers if quest system is available
        if (window.lovecraftianQuest) {
            this.addQuestMarkers();
        }
        
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
                    <div style="position: absolute; top: 0; left: 0; width: 50px; height: 50px; background: transparent; cursor: pointer; z-index: 1001;" onclick="if(window.mapEngine) window.mapEngine.openBaseManagement(); else console.error('Map engine not available');"></div>
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
        
        // Add click event to open base management
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

        // Also add mousedown event as backup
        this.playerBaseMarker.on('mousedown', (e) => {
            console.log('🏗️ Base marker mousedown! Opening base management...');
            e.originalEvent.preventDefault();
            e.originalEvent.stopPropagation();
            this.openBaseManagement();
        });
        
        this.playerBaseMarker.on('mouseup', (e) => {
            console.log('🏗️ Base marker mouseup!', e);
        });
        
        // Check if marker is interactive
        console.log('🏗️ Base marker interactive?', this.playerBaseMarker.options.interactive);
        console.log('🏗️ Base marker clickable?', this.playerBaseMarker.options.clickable);

        // Create territory circle (temporarily disabled for testing)
        // this.createTerritoryCircle(latlng, base.radius);
        console.log('🏗️ Territory circle disabled for testing');
        
        // Create marker showcase
        this.createMarkerShowcase();
        
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

    createMarkerShowcase() {
        if (!this.map) return;
        
        console.log('🎨 Creating marker showcase...');
        
        // Clear existing showcase markers
        if (this.showcaseMarkers) {
            this.showcaseMarkers.forEach(marker => this.map.removeLayer(marker));
        }
        this.showcaseMarkers = [];
        
        // Base location for showcase
        const baseLat = 61.4978;
        const baseLng = 23.7608;
        
        // 1. Circle Marker (Basic)
        const circleMarker = L.circleMarker([baseLat + 0.001, baseLng + 0.001], {
            radius: 15,
            fillColor: '#ff6b6b',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(this.map);
        circleMarker.bindPopup('<b>Circle Marker</b><br>Basic circle marker with custom colors');
        this.showcaseMarkers.push(circleMarker);
        
        // 2. Square Marker (Custom Icon)
        const squareIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 30px; height: 30px; background: #4ecdc4; border: 3px solid #fff; border-radius: 5px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: white;">⬜</div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        const squareMarker = L.marker([baseLat + 0.002, baseLng + 0.001], { icon: squareIcon }).addTo(this.map);
        squareMarker.bindPopup('<b>Square Marker</b><br>Custom divIcon with square shape');
        this.showcaseMarkers.push(squareMarker);
        
        // 3. Triangle Marker
        const triangleIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 0; height: 0; border-left: 15px solid transparent; border-right: 15px solid transparent; border-bottom: 25px solid #ff9ff3; filter: drop-shadow(0 0 5px rgba(255, 159, 243, 0.8));"></div>',
            iconSize: [30, 25],
            iconAnchor: [15, 25]
        });
        const triangleMarker = L.marker([baseLat + 0.001, baseLng + 0.002], { icon: triangleIcon }).addTo(this.map);
        triangleMarker.bindPopup('<b>Triangle Marker</b><br>CSS triangle with glow effect');
        this.showcaseMarkers.push(triangleMarker);
        
        // 4. Star Marker (Unicode)
        const starIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 40px; height: 40px; background: linear-gradient(45deg, #ffd700, #ffed4e); border: 3px solid #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; color: #333; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);">⭐</div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        const starMarker = L.marker([baseLat - 0.001, baseLng + 0.001], { icon: starIcon }).addTo(this.map);
        starMarker.bindPopup('<b>Star Marker</b><br>Unicode star with gradient background');
        this.showcaseMarkers.push(starMarker);
        
        // 5. Diamond Marker
        const diamondIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 0; height: 0; border-left: 20px solid transparent; border-right: 20px solid transparent; border-bottom: 15px solid #a8e6cf; transform: rotate(45deg); filter: drop-shadow(0 0 8px rgba(168, 230, 207, 0.8));"></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        const diamondMarker = L.marker([baseLat - 0.001, baseLng - 0.001], { icon: diamondIcon }).addTo(this.map);
        diamondMarker.bindPopup('<b>Diamond Marker</b><br>Rotated triangle creating diamond shape');
        this.showcaseMarkers.push(diamondMarker);
        
        // 6. Hexagon Marker
        const hexagonIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="width: 30px; height: 30px; background: #ff8a80; clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%); border: 3px solid #fff; filter: drop-shadow(0 0 10px rgba(255, 138, 128, 0.8));"></div>',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        const hexagonMarker = L.marker([baseLat + 0.001, baseLng - 0.001], { icon: hexagonIcon }).addTo(this.map);
        hexagonMarker.bindPopup('<b>Hexagon Marker</b><br>CSS clip-path hexagon shape');
        this.showcaseMarkers.push(hexagonMarker);
        
        // 7. Pulsing Circle Marker
        const pulsingIcon = L.divIcon({
            className: 'custom-marker pulsing',
            html: '<div style="width: 25px; height: 25px; background: #9c27b0; border: 3px solid #fff; border-radius: 50%; animation: pulse 2s infinite; box-shadow: 0 0 20px rgba(156, 39, 176, 0.8);"></div>',
            iconSize: [25, 25],
            iconAnchor: [12.5, 12.5]
        });
        const pulsingMarker = L.marker([baseLat - 0.002, baseLng - 0.001], { icon: pulsingIcon }).addTo(this.map);
        pulsingMarker.bindPopup('<b>Pulsing Marker</b><br>Animated pulsing circle with CSS animation');
        this.showcaseMarkers.push(pulsingMarker);
        
        // 8. Multi-layer Marker
        const multiLayerIcon = L.divIcon({
            className: 'custom-marker',
            html: '<div style="position: relative; width: 40px; height: 40px;"><div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; background: #ff5722; border-radius: 50%; opacity: 0.3;"></div><div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; background: #ff9800; border-radius: 50%; opacity: 0.6;"></div><div style="position: absolute; top: 10px; left: 10px; width: 20px; height: 20px; background: #ffc107; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #333;">🔥</div></div>',
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        const multiLayerMarker = L.marker([baseLat + 0.002, baseLng - 0.001], { icon: multiLayerIcon }).addTo(this.map);
        multiLayerMarker.bindPopup('<b>Multi-layer Marker</b><br>Layered circles with emoji center');
        this.showcaseMarkers.push(multiLayerMarker);
        
        console.log('🎨 Marker showcase created with', this.showcaseMarkers.length, 'markers');
    }

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
        if (!this.map) return;
        
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

    addQuestMarkers() {
        if (!this.map || !window.lovecraftianQuest) return;
        
        console.log('🐙 Adding quest markers...');
        
        // Clear existing quest markers
        if (this.questMarkers) {
            this.questMarkers.forEach(marker => {
                this.map.removeLayer(marker);
                // Also remove from mystery zone markers
                const index = this.mysteryZoneMarkers.indexOf(marker);
                if (index > -1) {
                    this.mysteryZoneMarkers.splice(index, 1);
                }
            });
        }
        this.questMarkers = [];
        
        window.lovecraftianQuest.questLocations.forEach((location, index) => {
            const questIcon = L.divIcon({
                className: 'quest-marker',
                html: `
                    <div style="position: relative; width: 35px; height: 35px;">
                        <!-- Quest aura -->
                        <div style="position: absolute; top: -6px; left: -6px; width: 47px; height: 47px; background: radial-gradient(circle, #00ff8840 0%, #00ff8820 30%, transparent 70%); border-radius: 50%; animation: questPulse 2s infinite;"></div>
                        <!-- Quest ring -->
                        <div style="position: absolute; top: -3px; left: -3px; width: 41px; height: 41px; border: 2px solid #00ff88; border-radius: 50%; animation: questRotate 3s linear infinite; opacity: 0.7;"></div>
                        <!-- Quest core -->
                        <div style="position: absolute; top: 2px; left: 2px; width: 31px; height: 31px; background: linear-gradient(45deg, #00ff88, #66ffaa); border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #00ff88;"></div>
                        <!-- Quest number -->
                        <div style="position: absolute; top: 6px; left: 6px; width: 23px; height: 23px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; color: #000000; text-shadow: 0 0 3px rgba(255, 255, 255, 0.8);">${index + 1}</div>
                    </div>
                `,
                iconSize: [35, 35],
                iconAnchor: [17.5, 17.5]
            });
            
            const questMarker = L.marker([location.lat, location.lng], {
                icon: questIcon,
                interactive: true,
                clickable: true
            });
            
            // Mark as quest marker for encounter system
            questMarker.isQuestMarker = true;
            questMarker.questIndex = index;
            
            questMarker.bindPopup(`
                <div class="quest-popup">
                    <div class="popup-header">
                        <h4>🐙 ${location.name}</h4>
                    </div>
                    <div class="quest-info">
                        <div><strong>Step:</strong> ${index + 1}/5</div>
                        <div><strong>Description:</strong> ${location.description}</div>
                    </div>
                    <div class="quest-actions">
                        <button onclick="window.lovecraftianQuest.teleportToLocation(${index})" class="sacred-button" style="margin-top: 10px; width: 100%;">Teleport Here</button>
                        <button onclick="window.lovecraftianQuest.startQuestFromLocation(${index})" class="sacred-button" style="background: var(--cosmic-purple); margin-top: 5px; width: 100%;">Start Quest Here</button>
                    </div>
                </div>
            `);
            
            this.questMarkers.push(questMarker);
            questMarker.addTo(this.map);
            
            // Don't add quest markers to mystery zone markers - they should only be triggered manually
        });
        
        console.log('🐙 Added', this.questMarkers.length, 'quest markers');
    }

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
            <button class="context-menu-btn" onclick="window.mapEngine.teleportPlayer(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px;">
                ⚡ Teleport Here
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.movePlayer(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px;">
                🚶 Move Here
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.centerOnLocation(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px;">
                🎯 Center Map
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
        
        // Disable device location when user moves manually
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            console.log('🎮 Disabling device location for manual movement');
            window.eldritchApp.systems.geolocation.stopTracking();
        }
        
        if (this.manualMode) {
            // Instant teleport in manual mode
            this.manualPosition.lat = lat;
            this.manualPosition.lng = lng;
            this.updateManualPosition(true); // Center map on teleport
        } else {
            // Switch to manual mode and move
            this.enableManualMode();
            setTimeout(() => {
                this.movePlayerToPosition(lat, lng);
            }, 50);
        }
    }
    
    movePlayer(lat, lng) {
        console.log(`🎮 Moving player to: ${lat}, ${lng}`);
        this.hideContextMenu();
        
        // Disable device location when user moves manually
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            console.log('🎮 Disabling device location for manual movement');
            window.eldritchApp.systems.geolocation.stopTracking();
        }
        
        if (this.manualMode) {
            this.movePlayerToPosition(lat, lng);
        } else {
            // Switch to manual mode and move
            this.enableManualMode();
            setTimeout(() => {
                this.movePlayerToPosition(lat, lng);
            }, 50);
        }
    }
    
    centerOnLocation(lat, lng) {
        console.log(`🎮 Centering map on: ${lat}, ${lng}`);
        this.hideContextMenu();
        this.map.setView([lat, lng], this.map.getZoom());
    }
    
    updateManualPosition(centerMap = false) {
        console.log(`🎮 Manual position: ${this.manualPosition.lat}, ${this.manualPosition.lng}`);
        
        // Only center map if explicitly requested (e.g., when starting manual mode)
        if (centerMap) {
            this.map.setView([this.manualPosition.lat, this.manualPosition.lng], this.map.getZoom());
        }
        
        // Update player marker
        this.updatePlayerPosition({
            lat: this.manualPosition.lat,
            lng: this.manualPosition.lng,
            accuracy: 1,
            timestamp: Date.now()
        });
        
        // Update geolocation system's current position for encounter system
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            window.eldritchApp.systems.geolocation.currentPosition = {
                lat: this.manualPosition.lat,
                lng: this.manualPosition.lng,
                accuracy: 1,
                timestamp: Date.now()
            };
            console.log('🎮 Updated geolocation position for encounters');
        }
        
        // Trigger proximity checks
        if (window.encounterSystem) {
            window.encounterSystem.checkProximityEncounters();
        }
    }

    getPlayerPosition() {
        if (this.manualMode) {
            return {
                lat: this.manualPosition.lat,
                lng: this.manualPosition.lng
            };
        } else if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            return {
                lat: window.eldritchApp.systems.geolocation.currentPosition?.lat || 61.4978,
                lng: window.eldritchApp.systems.geolocation.currentPosition?.lng || 23.7608
            };
        } else {
            // Fallback to default position
            return {
                lat: 61.4978,
                lng: 23.7608
            };
        }
    }
    
    enableManualMode() {
        console.log('🎮 Enabling manual movement mode');
        this.manualMode = true;
        console.log('🎮 Manual mode set to:', this.manualMode);
        console.log('🎮 Map engine instance:', this);
        
        // Set up click handler for manual movement
        this.setupClickHandler();
        
        // Set initial position and center map only when first enabling
        this.updateManualPosition(true);
        
        console.log('🎮 Manual mode enabled successfully');
    }
    
    setupClickHandler() {
        console.log('🎮 Setting up click handler for manual mode');
        
        // Create click handler for manual movement
        this.manualClickHandler = (e) => {
            if (!this.manualMode) {
                console.log('🎮 Click ignored - manual mode disabled');
                return;
            }
            
            console.log(`🎮 Manual mode click: ${e.latlng.lat}, ${e.latlng.lng}`);
            this.movePlayerToPosition(e.latlng.lat, e.latlng.lng);
        };
        
        console.log('🎮 Click handler created for manual mode');
    }
    
    disableManualMode() {
        console.log('🎮 Disabling manual movement mode');
        this.manualMode = false;
        
        // Clear click handler reference
        this.manualClickHandler = null;
        console.log('🎮 Click handler cleared');
        
        // Stop any ongoing movement
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
        }
    }
    
    movePlayerToPosition(targetLat, targetLng) {
        console.log(`🎮 movePlayerToPosition called: ${targetLat}, ${targetLng}`);
        console.log(`🎮 Manual mode active: ${this.manualMode}`);
        console.log(`🎮 Map available: ${!!this.map}`);
        
        // Stop any existing movement
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            console.log('🎮 Stopped existing movement');
        }
        
        const startLat = this.manualPosition.lat;
        const startLng = this.manualPosition.lng;
        
        // Calculate distance in meters
        const distance = this.calculateDistance(startLat, startLng, targetLat, targetLng);
        console.log(`🎮 Distance to target: ${distance.toFixed(2)} meters`);
        
        if (distance < 1) {
            // Already very close, just set position
            this.manualPosition.lat = targetLat;
            this.manualPosition.lng = targetLng;
            this.updateManualPosition();
            return;
        }
        
        // Calculate movement parameters
        const speed = 100; // meters per second (10x faster)
        const duration = distance / speed; // seconds
        const steps = Math.max(10, Math.floor(duration * 10)); // 10 updates per second
        const stepDuration = (duration * 1000) / steps; // milliseconds per step
        
        console.log(`🎮 Movement: ${distance.toFixed(2)}m at ${speed}m/s = ${duration.toFixed(2)}s (${steps} steps)`);
        
        let currentStep = 0;
        
        this.movementInterval = setInterval(() => {
            if (currentStep >= steps) {
                // Movement complete
                this.manualPosition.lat = targetLat;
                this.manualPosition.lng = targetLng;
                this.updateManualPosition();
                clearInterval(this.movementInterval);
                this.movementInterval = null;
                console.log('🎮 Movement complete');
                return;
            }
            
            // Calculate interpolated position
            const progress = currentStep / steps;
            const easeProgress = this.easeInOutCubic(progress);
            
            const currentLat = startLat + (targetLat - startLat) * easeProgress;
            const currentLng = startLng + (targetLng - startLng) * easeProgress;
            
            this.manualPosition.lat = currentLat;
            this.manualPosition.lng = currentLng;
            this.updateManualPosition(false); // Don't center map during movement
            
            currentStep++;
        }, stepDuration);
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
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
}

// Export for use in other modules
window.MapEngine = MapEngine;
