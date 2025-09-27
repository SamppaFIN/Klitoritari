/**
 * Map Engine - Leaflet integration with infinite scrolling and cosmic styling
 * Handles map rendering, markers, and real-time updates
 */

class MapEngine {
    constructor() {
        this.map = null;
        this.playerMarker = null;
        this.otherPlayerMarkers = new Map();
        this.otherPlayerPolylines = new Map();
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
        this.symbolCanvasLayer = null; // Canvas-based flag layer
        this.distortionEffectsLayer = null; // Canvas-based distortion effects layer
        this.distortionEffectsVisible = false; // Start with effects hidden by default
        this.lastPlayerPosition = null; // Track last position for path line
        this.pathLine = null; // Leaflet polyline for path visualization
        this.pathLineEnabled = false; // Toggleable path rendering
        this.otherPlayerMarkers = new Map(); // playerId -> marker
        this.baseMarker = null; // Player's base marker
        this.flagDropDistance = 10; // Drop flag every 10 meters
    }

    getCurrentPlayerLatLng() {
        try {
            if (this.playerPosition && typeof this.playerPosition.lat === 'number') {
                return { lat: this.playerPosition.lat, lng: this.playerPosition.lng };
            }
        } catch (_) {}
        return null;
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
        // Try restore map view from session
        try {
            if (window.sessionPersistence) {
                const restored = window.sessionPersistence.restoreMapView(this.map);
                if (restored) {
                    console.log('🗺️ Restored map view from session');
                }
            }
        } catch (_) {}
        if (window.soundManager) { try { window.soundManager.playBling({ frequency: 880, duration: 0.1, type: 'sine' }); } catch (e) {} }

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
                    <div id="player-names-row" style="font-size:11px; opacity:0.95; margin-top:2px; color:#0f5132; background:rgba(25,135,84,0.12); padding:2px 6px; border-radius:6px; border:1px solid rgba(25,135,84,0.35);">
                        <span id="player-names">You</span>
                    </div>
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
            
            // Ensure player marker is visible immediately when map is ready
            this.ensurePlayerMarkerVisible();
            
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

        // Map move events for investigation updates and persistence
        this.map.on('moveend', () => {
            this.updateInvestigationProximity();
            try { window.sessionPersistence?.saveMapView(this.map); } catch (_) {}
        });

        this.map.on('zoomend', () => {
            try { window.sessionPersistence?.saveMapView(this.map); } catch (_) {}
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
            
            // Ensure player marker is visible
            this.playerMarker.setOpacity(1);
            this.playerMarker.setZIndexOffset(1000);
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
            
            // Ensure player marker is visible
            this.playerMarker.setOpacity(1);
            this.playerMarker.setZIndexOffset(1000);
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
            
            console.log('📍 Updated geolocation system with new position:', `lat: ${position.lat}, lng: ${position.lng}`);
        }
    }

    // Create base marker with Norwegian flag styling
    createBaseMarker(position) {
        if (!this.map) return null;

        const latlng = [position.lat, position.lng];
        
        // Get the player's selected base logo
        const baseLogoType = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
        console.log('🏗️ Creating base marker with logo type:', baseLogoType);
        
        // Create base marker HTML using player's selected logo
        const baseIconHtml = this.createBaseMarkerHTML(baseLogoType);
        
        const baseIcon = L.divIcon({
            className: 'base-marker-icon',
            html: baseIconHtml,
            iconSize: [80, 80],
            iconAnchor: [40, 40]
        });
        
        console.log('🏗️ Base icon created with className: base-marker-icon');
        
        const baseMarker = L.marker(latlng, { icon: baseIcon }).addTo(this.map);
        baseMarker.bindPopup('<b>🏗️ My Base</b><br>Your established base in the cosmic realm');
        
        console.log('🏗️ Base marker created at:', latlng);
        
        // Ensure base marker is visible and on top
        baseMarker.setOpacity(1);
        baseMarker.setZIndexOffset(2000); // Higher than player marker
        
        console.log('🏗️ Base marker z-index set to 2000, opacity set to 1');
        
        return baseMarker;
    }

    // Update or create base marker
    updateBaseMarker(position) {
        if (!this.map) return;

        const latlng = [position.lat, position.lng];
        
        if (this.baseMarker) {
            // Update existing base marker position
            this.baseMarker.setLatLng(latlng);
            console.log('🏗️ Base marker updated to:', latlng);
        } else {
            // Create new base marker
            this.baseMarker = this.createBaseMarker(position);
        }
    }

    // Remove base marker
    removeBaseMarker() {
        if (this.baseMarker && this.map) {
            this.map.removeLayer(this.baseMarker);
            this.baseMarker = null;
            console.log('🏗️ Base marker removed');
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
    
    /**
     * Create Leaflet icon from SVG asset using AssetManager
     */
    createAssetIcon(assetId, options = {}) {
        if (!window.assetManager) {
            console.warn('📦 AssetManager not available, using fallback icon');
            return this.createFallbackIcon(options);
        }
        
        try {
            const icon = window.assetManager.createLeafletIcon(assetId, options);
            if (icon) {
                return icon;
            }
        } catch (error) {
            console.warn(`📦 Failed to create icon from asset ${assetId}:`, error);
        }
        
        return this.createFallbackIcon(options);
    }
    
    /**
     * Create fallback icon when AssetManager is not available
     */
    createFallbackIcon(options = {}) {
        const size = options.size || [24, 24];
        const color = options.color || '#666666';
        const text = options.text || '?';
        
        return L.divIcon({
            html: `
                <div style="
                    width: ${size[0]}px; 
                    height: ${size[1]}px; 
                    background: ${color}; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: white; 
                    font-weight: bold;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                    ${text}
                </div>
            `,
            className: 'fallback-icon',
            iconSize: size,
            iconAnchor: [size[0]/2, size[1]/2]
        });
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
        
        // Temporarily disabled for tutorial-first approach
        // 2. Generate points of interest
        // this.generatePointsOfInterest();
        
        // 3. Generate monsters
        // this.generateMonsters();
        
        // 4. Generate legendary encounters
        // this.generateLegendaryEncounters();
        
        // 5. Add HEVY and other special markers
        this.createSpecialMarkers();
        
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
        
        // Temporarily disabled for tutorial-first approach
        // 10. Load mystery zones if investigation system is available
        // if (window.investigationSystem) {
        //     const zones = window.investigationSystem.getMysteryZones();
        //     this.addMysteryZoneMarkers(zones);
        //     console.log('🎯 Mystery zones recreated:', zones.length);
        // }
        
        // 11. Load NPCs if NPC system is available
        // if (window.npcSystem) {
        //     window.npcSystem.generateNPCs();
        //     console.log('🎯 NPCs recreated');
        // }
        
        console.log('🎯 All markers recreated successfully');
    }

    // Initialize map with a specific position
    initializeWithPosition(position) {
        console.log('🗺️ Initializing map with position:', `lat: ${position.lat}, lng: ${position.lng}`);
        
        if (!this.map) {
            console.error('🗺️ Map not initialized');
            return;
        }
        
        // Update player position immediately
        this.updatePlayerPosition(position);
        
        // Center map on player
        this.map.setView([position.lat, position.lng], 18);
        
        // Start proximity detection
        this.startProximityDetection();
        
        console.log('🗺️ Map initialized with position');
    }
    
    // Ensure player marker is visible immediately when map is ready
    ensurePlayerMarkerVisible() {
        if (!this.map) return;
        
        // If we have a current position, create the player marker
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            const position = window.eldritchApp.systems.geolocation.currentPosition;
            console.log('📍 Ensuring player marker is visible at:', `lat: ${position.lat}, lng: ${position.lng}`);
            this.updatePlayerPosition(position);
        } else {
            // Create a default player marker at a known location
            const defaultPosition = { lat: 61.47184564562671, lng: 23.725938496942355, accuracy: 1, timestamp: Date.now() };
            console.log('📍 Creating default player marker at:', defaultPosition);
            this.updatePlayerPosition(defaultPosition);
        }
        
        // Also create special markers (HEVY, shrines, items, monsters)
        this.createSpecialMarkers();
        
        // Create NPCs (Aurora and Zephyr) if NPC system is available
        if (window.npcSystem) {
            console.log('👥 Creating NPCs on map ready...');
            window.npcSystem.generateNPCs();
            window.npcSystem.startSimulation();
        }
        
        // Create quest markers if quest system is available
        if (window.unifiedQuestSystem) {
            console.log('🎭 Creating quest markers on map ready...');
            window.unifiedQuestSystem.createQuestMarkers();
        }
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
        
        // Use the new base marker system
        const position = { lat: base.lat, lng: base.lng };
        this.updateBaseMarker(position);
        
        console.log('🏗️ Base marker created using new system');
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
        console.log('👹 Monster locations:', this.monsters.map(m => `${m.type.name} at [${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}]`));
        
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
            <button class="context-menu-btn" onclick="window.mapEngine.dropFlagHere(${latlng.lat}, ${latlng.lng})" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-green);">
                🇫🇮 Drop Flag Here
            </button>
            <button class="context-menu-btn" onclick="window.mapEngine.triggerRandomDistortionEffects()" style="width: 100%; margin-bottom: 5px; background: var(--cosmic-red);">
                👻 Test Effects
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
            // Ensure geolocation reflects the moved position and prefers it
            if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                const geo = window.eldritchApp.systems.geolocation;
                geo.deviceGPSEnabled = false;
                geo.fixedPosition = { lat, lng };
                geo.currentPosition = { lat, lng, accuracy: 1, timestamp: Date.now() };
                geo.lastValidPosition = { lat, lng, accuracy: 1, timestamp: Date.now() };
            }
            
            // If quest system awaits locate, treat this as first known position
            if (window.unifiedQuestSystem) {
                if (!window.unifiedQuestSystem.startingPosition) {
                    window.unifiedQuestSystem.startingPosition = { lat, lng };
                }
            }
            
            // Immediately run a proximity check at the new position
            if (window.encounterSystem && typeof window.encounterSystem.checkProximityEncountersWithPosition === 'function') {
                window.encounterSystem.checkProximityEncountersWithPosition({ lat, lng });
            } else if (window.encounterSystem && typeof window.encounterSystem.checkProximityEncounters === 'function') {
                window.encounterSystem.checkProximityEncounters();
            }
            
            if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
                try {
                    window.gruesomeNotifications.showNotification({
                        type: 'info',
                        title: 'Moving...',
                        message: 'Simulating path to destination',
                        duration: 1500
                    });
                } catch (_) {}
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
            
            // Simulate movement from fallback to target
            this.simulatePlayerMovement(fallback, { lat, lng });
            return;
        }
        
        // Simulate movement from current position to target
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
        if (!isFinite(totalDistance) || isNaN(totalDistance)) {
            console.warn('🎮 Movement distance invalid, aborting simulation');
            return;
        }
        if (totalDistance === 0) {
            console.log('🎮 Already at destination');
            return;
        }
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
                // Final proximity check at the destination
                if (window.encounterSystem && typeof window.encounterSystem.checkProximityEncountersWithPosition === 'function') {
                    window.encounterSystem.checkProximityEncountersWithPosition({ lat: endPos.lat, lng: endPos.lng });
                } else if (window.encounterSystem && typeof window.encounterSystem.checkProximityEncounters === 'function') {
                    window.encounterSystem.checkProximityEncounters();
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
            
            // Proximity check for encounters at this simulated step
            if (window.encounterSystem && typeof window.encounterSystem.checkProximityEncountersWithPosition === 'function') {
                window.encounterSystem.checkProximityEncountersWithPosition({ lat: currentLat, lng: currentLng });
            }
            
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
            if (this.symbolCanvasLayer) {
                this.symbolCanvasLayer.addFlagPin(lat, lng, null, null, this.getPathMarkerSymbol?.());
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
    
    // Create base marker HTML with player's selected symbol
    createBaseMarkerHTML(baseLogoType) {
        console.log('🏗️ createBaseMarkerHTML called with baseLogoType:', baseLogoType);
        const symbolHTML = this.getBaseSymbolHTML(baseLogoType);
        console.log('🏗️ Generated symbolHTML:', symbolHTML);
        
        return `
            <div style="position: relative; width: 50px; height: 50px; cursor: pointer; z-index: 1000;">
                <!-- Outer energy field -->
                <div style="position: absolute; top: -8px; left: -8px; width: 66px; height: 66px; background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%); border-radius: 50%; animation: baseEnergy 3s infinite; pointer-events: none;"></div>
                <!-- Middle ring -->
                <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: #8b5cf6; border: 4px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px rgba(139, 92, 246, 0.8); pointer-events: none;"></div>
                <!-- Player's selected symbol -->
                <div style="position: absolute; top: 12px; left: 12px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; pointer-events: none;">
                    ${symbolHTML}
                </div>
                <!-- Clickable overlay -->
                <div style="position: absolute; top: 0; left: 0; width: 50px; height: 50px; background: transparent; cursor: pointer; z-index: 1001;"></div>
            </div>
        `;
    }
    
    // Get HTML for base symbol based on type
    getBaseSymbolHTML(baseLogoType) {
        console.log('🏗️ getBaseSymbolHTML called with baseLogoType:', baseLogoType);
        switch (baseLogoType) {
            case 'finnish':
                console.log('🏗️ Using Finnish flag');
                return this.getFinnishFlagHTML();
            case 'swedish':
                console.log('🏗️ Using Swedish flag');
                return this.getSwedishFlagHTML();
            case 'norwegian':
                console.log('🏗️ Using Norwegian flag');
                return this.getNorwegianFlagHTML();
            case 'flower_of_life':
                return this.getFlowerOfLifeHTML();
            case 'sacred_triangle':
                return this.getSacredTriangleHTML();
            case 'hexagon':
                return this.getHexagonHTML();
            case 'cosmic_spiral':
                return this.getCosmicSpiralHTML();
            case 'star':
                return this.getStarHTML();
            default:
                return this.getDefaultSymbolHTML();
        }
    }
    
    // Flag HTML generators
    getFinnishFlagHTML() {
        return `
            <div style="width: 20px; height: 20px; background: white; border: 1px solid #ccc; position: relative;">
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 3px; background: #003580; transform: translateY(-50%);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; background: #003580; transform: translateX(-50%);"></div>
            </div>
        `;
    }
    
    getSwedishFlagHTML() {
        return `
            <div style="width: 20px; height: 20px; background: #006AA7; border: 1px solid #ccc; position: relative;">
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 3px; background: #FECC00; transform: translateY(-50%);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 3px; background: #FECC00; transform: translateX(-50%);"></div>
            </div>
        `;
    }
    
    getNorwegianFlagHTML() {
        return `
            <div style="width: 20px; height: 20px; background: #EF2B2D; border: 1px solid #ccc; position: relative;">
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 2px; background: white; transform: translateY(-50%);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: white; transform: translateX(-50%);"></div>
                <div style="position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: #002868; transform: translateY(-50%);"></div>
                <div style="position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: #002868; transform: translateX(-50%);"></div>
            </div>
        `;
    }
    
    getFlowerOfLifeHTML() {
        return `
            <div style="width: 20px; height: 20px; border: 2px solid #8b5cf6; border-radius: 50%; position: relative; display: flex; align-items: center; justify-content: center;">
                <div style="width: 8px; height: 8px; border: 1px solid #8b5cf6; border-radius: 50%;"></div>
            </div>
        `;
    }
    
    getSacredTriangleHTML() {
        return `
            <div style="width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-bottom: 17px solid #2ed573;"></div>
        `;
    }
    
    getHexagonHTML() {
        return `
            <div style="width: 20px; height: 20px; background: #ff6b35; clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);"></div>
        `;
    }
    
    getCosmicSpiralHTML() {
        return `
            <div style="width: 20px; height: 20px; border: 2px solid #ff69b4; border-radius: 50%; position: relative;">
                <div style="position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border: 1px solid #ff69b4; border-radius: 50%;"></div>
            </div>
        `;
    }
    
    getStarHTML() {
        return `
            <div style="width: 20px; height: 20px; background: #ffd700; clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);"></div>
        `;
    }
    
    getDefaultSymbolHTML() {
        return `
            <div style="width: 20px; height: 20px; background: #8b5cf6; border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">?</div>
        `;
    }
    
    // Update base marker with new symbol
    updateBaseMarker() {
        if (!this.playerBaseMarker) {
            console.log('🏗️ No base marker to update');
            return;
        }
        
        const baseLogoType = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
        console.log('🏗️ Updating base marker with logo type:', baseLogoType);
        
        const baseIcon = L.divIcon({
            className: 'base-marker multilayered',
            html: this.createBaseMarkerHTML(baseLogoType),
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        
        this.playerBaseMarker.setIcon(baseIcon);
        console.log('🏗️ Base marker updated successfully');
    }
    
    clearPathwayMarkers() {
        if (this.symbolCanvasLayer) {
            this.symbolCanvasLayer.clearFlags();
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
        
        if (this.symbolCanvasLayer) {
            this.symbolCanvasLayer.toggleVisibility();
            console.log('🇫🇮 Canvas flag layer toggled, total flags:', this.symbolCanvasLayer.getFlagCount());
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
        if (typeof SymbolCanvasLayer !== 'undefined') {
            this.symbolCanvasLayer = new SymbolCanvasLayer(this);
            console.log('🇫🇮 Finnish flag canvas layer initialized');
            // Make it globally accessible for step system
            window.mapEngine = this;

            // Persist flags on visibility change/app pause
            try {
                window.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        try { window.sessionPersistence?.saveFlags?.(this.symbolCanvasLayer.flagPins); } catch (_) {}
                    }
                });
            } catch (_) {}
        } else {
            console.warn('🇫🇮 SymbolCanvasLayer not available');
        }
    }

    // Read current symbol from profile
    getCurrentSymbol() {
        try {
            // First try to get path symbol from localStorage
            const pathSymbol = localStorage.getItem('eldritch_player_path_symbol');
            console.log('🔍 getCurrentSymbol - pathSymbol from localStorage:', pathSymbol);
            
            if (pathSymbol) {
                console.log('🔍 getCurrentSymbol - returning pathSymbol:', pathSymbol);
                return pathSymbol;
            }
            
            // Fallback to profile symbol
            const prof = window.sessionPersistence?.restoreProfile?.();
            const profileSymbol = (prof && prof.symbol) ? prof.symbol : 'finnish';
            console.log('🔍 getCurrentSymbol - using profile symbol:', profileSymbol);
            return profileSymbol;
        } catch (error) { 
            console.log('🔍 getCurrentSymbol - error, returning finnish:', error);
            return 'finnish'; 
        }
    }

    // Get symbol for path markers with alternating pattern
    getPathMarkerSymbol() {
        try {
            console.log('🔍 getPathMarkerSymbol called');
            console.log('🔍 symbolCanvasLayer available:', !!this.symbolCanvasLayer);
            
            // Get current flag count to determine which symbol to use
            let flagCount = 0;
            if (this.symbolCanvasLayer && typeof this.symbolCanvasLayer.getFlagCount === 'function') {
                flagCount = this.symbolCanvasLayer.getFlagCount();
                console.log('🔍 getPathMarkerSymbol - flag count from canvas layer:', flagCount);
            } else {
                console.log('🔍 getPathMarkerSymbol - canvas layer not available, using flagCount = 0');
            }
            
            // Every 5th marker (0, 5, 10, 15...) should be aurora (path marker)
            // Every 4th marker (1, 2, 3, 4, 6, 7, 8, 9, 11...) should be ant
            if (flagCount % 5 === 0) {
                console.log('🔍 getPathMarkerSymbol - using aurora (path marker) for flag count:', flagCount);
                return 'aurora';
            } else {
                console.log('🔍 getPathMarkerSymbol - using ant for flag count:', flagCount);
                return 'ant';
            }
        } catch (error) {
            console.log('🔍 getPathMarkerSymbol - error, returning aurora:', error);
            return 'aurora';
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
        if (this.symbolCanvasLayer) {
            const currentOpacity = this.symbolCanvasLayer.opacity;
            const newOpacity = currentOpacity === 0.5 ? 1.0 : currentOpacity === 1.0 ? 0.2 : 0.5;
            this.symbolCanvasLayer.setOpacity(newOpacity);
            console.log('🇫🇮 Flag opacity toggled to:', newOpacity);
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }
    
    cycleFlagColors() {
        if (this.symbolCanvasLayer) {
            this.symbolCanvasLayer.cycleColorScheme();
            console.log('🇫🇮 Flag colors cycled to:', this.symbolCanvasLayer.currentColorScheme);
        } else {
            console.log('🇫🇮 Finnish flag layer not available');
        }
    }
    
    cycleFlagTheme() {
        if (this.symbolCanvasLayer) {
            this.symbolCanvasLayer.cycleColorScheme();
            const currentTheme = this.symbolCanvasLayer.currentColorScheme;
            console.log('🇫🇮 Flag theme cycled to:', currentTheme);
            
            // Show notification of theme change
            if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
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
        if (!this.symbolCanvasLayer) {
            console.warn('🇫🇮 Symbol canvas layer not available');
            return;
        }
        console.log(`🇫🇮 Dropping flag at: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        this.symbolCanvasLayer.addFlagPin(lat, lng, null, null, this.getPathMarkerSymbol?.());
        if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
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
        
        if (this.symbolCanvasLayer) {
            // Create 5 test flags in a line using canvas layer
            for (let i = 0; i < 5; i++) {
                const testLat = playerPos.lat + (i * 0.0001);
                const testLng = playerPos.lng + (i * 0.0001);
                this.symbolCanvasLayer.addFlagPin(testLat, testLng, null, null, this.getPathMarkerSymbol?.());
            }
            console.log('🇫🇮 Test flags created on canvas layer, total flags:', this.symbolCanvasLayer.getFlagCount());
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
        if (this.symbolCanvasLayer) {
            const stats = this.symbolCanvasLayer.getFlagStatistics();
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
                console.log('📍 Using GPS position:', `lat: ${position.lat}, lng: ${position.lng}`);
                return {
                    lat: position.lat,
                    lng: position.lng
                };
            }
            
            // If no GPS position, try to get the last valid position
            if (geolocation.lastValidPosition) {
                console.log('📍 Using last valid position:', `lat: ${geolocation.lastValidPosition.lat}, lng: ${geolocation.lastValidPosition.lng}`);
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
        if (!this.symbolCanvasLayer) return;
        
        if (this.lastPlayerPosition) {
            const distance = this.calculateDistance(
                this.lastPlayerPosition.lat, this.lastPlayerPosition.lng,
                position.lat, position.lng
            );
            
            // Drop flag every 10 meters of movement
            if (distance >= this.flagDropDistance) {
                console.log(`🎨 Player moved ${distance.toFixed(1)}m - dropping flag`);
                this.symbolCanvasLayer.addFlagPin(position.lat, position.lng, null, null, this.getPathMarkerSymbol?.());
                
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
        if (!this.map || !this.pathLineEnabled) return;
        
        if (this.lastPlayerPosition) {
            // Create or update path line
            if (this.pathLine) {
                // Update existing path line
                const currentPath = this.pathLine.getLatLngs();
                currentPath.push([position.lat, position.lng]);
                this.pathLine.setLatLngs(currentPath);
                // Persist path points
                try {
                    const pts = this.pathLine.getLatLngs().map(ll => [ll.lat, ll.lng]);
                    window.sessionPersistence?.savePath(pts);
                } catch (_) {}
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
                // Seed persistence
                try {
                    const pts = this.pathLine.getLatLngs().map(ll => [ll.lat, ll.lng]);
                    window.sessionPersistence?.savePath(pts);
                } catch (_) {}
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
    
    // Multiplayer methods
    addOtherPlayerMarker(playerId, playerData) {
        if (!this.map || !playerData.position) return;
        
        const { position, markerConfig, profile } = playerData;
        const safeMarkerConfig = (markerConfig && typeof markerConfig === 'object') ? markerConfig : {};
        const isNewMarker = !this.otherPlayerMarkers.has(playerId);
        let marker = this.otherPlayerMarkers.get(playerId);
        
        if (marker) {
            try { marker.setLatLng([position.lat, position.lng]); } catch (_) {}
        } else {
            marker = L.marker([position.lat, position.lng], {
                icon: this.createOtherPlayerIcon(safeMarkerConfig, playerId)
            }).addTo(this.map);
            // Store reference for cleanup
            this.otherPlayerMarkers.set(playerId, marker);
        }
        
        // Add popup with player info (only for new markers)
        if (isNewMarker) {
            const pname = profile?.name || 'Player';
            const pnick = profile?.nickname ? `, ${profile.nickname}` : '';
            const emoji = safeMarkerConfig?.emoji || '👤';
            marker.bindPopup(`
                <div class="other-player-popup">
                    <h4>${emoji} ${pname}${pnick}</h4>
                    <p>Steps: ${playerData.steps || 0}</p>
                    <p>Distance: ${this.playerPosition ? Math.round(this.calculateDistance(this.playerPosition, position)) : 'Unknown'}m</p>
                </div>
            `);
        }
        
        console.log('🌐 Other player marker added:', playerId);
    }
    
    removeOtherPlayerMarker(playerId) {
        const marker = this.otherPlayerMarkers.get(playerId);
        if (marker) {
            this.map.removeLayer(marker);
            this.otherPlayerMarkers.delete(playerId);
            console.log('🌐 Other player marker removed:', playerId);
        }
        const line = this.otherPlayerPolylines.get(playerId);
        if (line) {
            this.map.removeLayer(line);
            this.otherPlayerPolylines.delete(playerId);
        }
    }
    
    createOtherPlayerIcon(markerConfig, playerId) {
        // Validate markerConfig
        if (!markerConfig || typeof markerConfig !== 'object') {
            console.warn('🗺️ Invalid markerConfig for player', playerId, ':', markerConfig);
            markerConfig = {};
        }
        
        const color = markerConfig.color || '#666666';
        const emoji = markerConfig.emoji || '👤';
        
        return L.divIcon({
            html: `
                <div class="other-player-marker" style="color: ${color};">
                    <div class="player-emoji">${emoji}</div>
                    <div class="player-pulse"></div>
                </div>
            `,
            className: 'other-player-icon',
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
    }

    updateOtherPlayerPath(playerId, latlngs, baseOpacity) {
        try {
            if (!this.map || !Array.isArray(latlngs) || latlngs.length < 2) return;
            let poly = this.otherPlayerPolylines.get(playerId);
            if (!poly) {
                poly = L.polyline(latlngs, { color: '#4a9eff', weight: 3, opacity: baseOpacity ?? 0.8 }).addTo(this.map);
                this.otherPlayerPolylines.set(playerId, poly);
            } else {
                poly.setLatLngs(latlngs);
                if (typeof baseOpacity === 'number') poly.setStyle({ opacity: baseOpacity });
            }
        } catch (e) { console.warn('updateOtherPlayerPath failed', e); }
    }

    clearOtherPlayerPath(playerId) {
        try {
            const poly = this.otherPlayerPolylines.get(playerId);
            if (poly) { this.map.removeLayer(poly); this.otherPlayerPolylines.delete(playerId); }
        } catch (e) { /* no-op */ }
    }
    
    calculateDistance(arg1, arg2, arg3, arg4) {
        // Flexible signature:
        //  - calculateDistance({lat,lng}, {lat,lng})
        //  - calculateDistance(lat1, lng1, lat2, lng2)
        let lat1, lng1, lat2, lng2;
        if (typeof arg1 === 'object' && typeof arg2 === 'object') {
            const pos1 = arg1;
            const pos2 = arg2;
            if (!pos1 || !pos2 || typeof pos1.lat !== 'number' || typeof pos1.lng !== 'number' || typeof pos2.lat !== 'number' || typeof pos2.lng !== 'number') {
                console.warn('🗺️ Invalid position data for distance calculation:', { pos1, pos2 });
                return 0;
            }
            lat1 = pos1.lat; lng1 = pos1.lng; lat2 = pos2.lat; lng2 = pos2.lng;
        } else {
            lat1 = Number(arg1); lng1 = Number(arg2); lat2 = Number(arg3); lng2 = Number(arg4);
            if (![lat1, lng1, lat2, lng2].every(v => typeof v === 'number' && isFinite(v))) {
                console.warn('🗺️ Invalid numeric args for distance calculation:', { lat1, lng1, lat2, lng2 });
                return 0;
            }
        }
        const R = 6371000; // meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    // Toggle path line on/off
    setPathLineEnabled(enabled) {
        this.pathLineEnabled = !!enabled;
        if (!this.pathLineEnabled) {
            this.clearPathLine();
        }
        console.log('🗺️ Path line enabled:', this.pathLineEnabled);
    }

    togglePathLine() {
        this.setPathLineEnabled(!this.pathLineEnabled);
    }

    triggerRandomDistortionEffects() {
        console.log('🎭 Triggering random distortion effects...');
        
        // Show notification
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification({
                type: 'info',
                title: 'Test Effects',
                message: 'Random distortion effects triggered',
                duration: 3000
            });
        }
        
        // Trigger enhanced random distortion effects
        if (window.sanityDistortion) {
            // Force trigger the 30s loop effects immediately with higher intensity
            window.sanityDistortion.triggerDistortionEffects();
            
            // Add additional random effects for testing
            const effects = ['addRandomGhostlyShadow', 'addRandomParticle', 'addRandomSlimeDrop', 'addRandomHallucination'];
            const randomEffect = effects[Math.floor(Math.random() * effects.length)];
            if (window.sanityDistortion[randomEffect]) {
                window.sanityDistortion[randomEffect]();
            }
        }

        // Add a small debug button for reloading flags
        try {
            if (!document.getElementById('reload-flags-debug')) {
                const btn = document.createElement('button');
                btn.id = 'reload-flags-debug';
                btn.textContent = 'Reload Flags';
                btn.style.position = 'absolute';
                btn.style.right = '12px';
                btn.style.bottom = '90px';
                btn.style.zIndex = '2000';
                btn.style.padding = '6px 10px';
                btn.style.borderRadius = '8px';
                btn.style.border = '1px solid rgba(74,158,255,0.5)';
                btn.style.background = 'rgba(10,10,30,0.6)';
                btn.style.color = '#b8d4f0';
                btn.addEventListener('click', () => {
                    try { window.multiplayerManager?.requestAllFlags?.(); } catch (_) {}
                });
                (this.map.getContainer() || document.body).appendChild(btn);
            }
        } catch (_) {}
    }
    
    // Create special markers (HEVY, shrines, items, etc.)
    clearAllSpecialMarkers() {
        console.log('🎯 Clearing all special markers...');
        
        // Clear HEVY marker
        if (this.hevyMarker && this.map) {
            this.map.removeLayer(this.hevyMarker);
            this.hevyMarker = null;
        }
        
        // Clear shrine markers
        if (this.shrineMarkers) {
            this.shrineMarkers.forEach(marker => {
                if (this.map) this.map.removeLayer(marker);
            });
            this.shrineMarkers = [];
        }
        
        // Clear item markers
        if (this.itemMarkers) {
            this.itemMarkers.forEach(itemData => {
                if (this.map && itemData.marker) this.map.removeLayer(itemData.marker);
            });
            this.itemMarkers = [];
        }
        
        // Clear monster markers
        if (this.monsterMarkers) {
            this.monsterMarkers.forEach(monsterData => {
                if (this.map && monsterData.marker) this.map.removeLayer(monsterData.marker);
            });
            this.monsterMarkers = [];
        }
        
        // Reset creation flag
        this.specialMarkersCreated = false;
        
        console.log('🎯 All special markers cleared');
    }

    createSpecialMarkers() {
        if (!this.map) return;
        
        console.log('🎯 Creating special markers...');
        
        // Check if markers already exist to prevent duplicates
        if (this.specialMarkersCreated) {
            console.log('🎯 Special markers already created, skipping');
            return;
        }
        
        // Get player position for marker placement
        let baseLat = 61.47184564562671;
        let baseLng = 23.725938496942355;
        
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            baseLat = window.eldritchApp.systems.geolocation.currentPosition.lat;
            baseLng = window.eldritchApp.systems.geolocation.currentPosition.lng;
        }
        
        // Create HEVY marker
        this.createHEVYMarker(baseLat, baseLng);
        
        // Create shrine markers
        this.createShrineMarkers(baseLat, baseLng);
        
        // Temporarily disable prepopulated random encounters/items scattered 100–300m
        // this.createItemMarkers(baseLat, baseLng);
        // this.createMonsterMarkers(baseLat, baseLng);
        
        // Mark as created to prevent duplicates
        this.specialMarkersCreated = true;
        
        console.log('🎯 Special markers created');
        
        // Show tutorial only if explicitly requested by fresh start
        try {
            const shouldShow = localStorage.getItem('eldritch_show_tutorial') === 'true';
            if (shouldShow && window.tutorialSystem && !window.tutorialSystem.tutorialShown) {
                setTimeout(() => {
                    window.tutorialSystem.showEncounterTutorial();
                    // Clear the flag so it doesn't show again on reload
                    localStorage.removeItem('eldritch_show_tutorial');
                }, 1000);
            }
        } catch (_) {}
        
        // Start tutorial encounter system if requested
        try {
            const shouldStartTutorial = localStorage.getItem('eldritch_start_tutorial_encounter') === 'true';
            if (shouldStartTutorial && window.tutorialEncounterSystem) {
                setTimeout(() => {
                    window.tutorialEncounterSystem.startTutorial();
                    // Clear the flag so it doesn't start again on reload
                    localStorage.removeItem('eldritch_start_tutorial_encounter');
                }, 1500);
            }
        } catch (_) {}
    }
    
    createHEVYMarker(baseLat, baseLng) {
        // Place HEVY 200m away from player
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.002; // ~200m in degrees
        const lat = baseLat + Math.cos(angle) * distance;
        const lng = baseLng + Math.sin(angle) * distance;
        
        const hevyIcon = L.divIcon({
            className: 'hevy-marker',
            html: `
                <div style="position: relative; width: 50px; height: 50px;">
                    <!-- HEVY's energy field -->
                    <div style="position: absolute; top: -8px; left: -8px; width: 66px; height: 66px; background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%); border-radius: 50%; animation: hevyPulse 2s infinite;"></div>
                    <!-- HEVY's core -->
                    <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: linear-gradient(45deg, #00ffff, #0080ff); border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 20px #00ffff;"></div>
                    <!-- HEVY's symbol -->
                    <div style="position: absolute; top: 12px; left: 12px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #ffffff; text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);">⚡</div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        
        this.hevyMarker = L.marker([lat, lng], { icon: hevyIcon }).addTo(this.map);
        this.hevyMarker.bindPopup(`
            <div class="hevy-popup">
                <h4>⚡ HEVY</h4>
                <p><strong>Type:</strong> Cosmic Entity</p>
                <p><strong>Status:</strong> Active</p>
                <p><strong>Description:</strong> A mysterious cosmic entity that grants power to those who approach.</p>
                <div class="popup-actions">
                    <button onclick="window.mapEngine.interactWithHEVY()" class="interact-btn">⚡ Interact</button>
                </div>
            </div>
        `);
        
        // Store HEVY position for proximity checks
        window.hevyPosition = { lat, lng };
        console.log('⚡ HEVY marker created at:', lat, lng);
    }
    
    createShrineMarkers(baseLat, baseLng) {
        const shrineTypes = [
            { name: 'Health Shrine', emoji: '❤️', color: '#ff0000', effect: 'health' },
            { name: 'Sanity Shrine', emoji: '🧠', color: '#8000ff', effect: 'sanity' },
            { name: 'Power Shrine', emoji: '⚡', color: '#ffff00', effect: 'power' },
            { name: 'Wisdom Shrine', emoji: '📚', color: '#00ff00', effect: 'wisdom' }
        ];
        
        this.shrineMarkers = [];
        shrineTypes.forEach((shrine, index) => {
            const angle = (Math.PI * 2 / shrineTypes.length) * index + Math.random() * 0.5;
            const distance = 0.0015 + Math.random() * 0.001; // 150-250m
            const lat = baseLat + Math.cos(angle) * distance;
            const lng = baseLng + Math.sin(angle) * distance;
            
            const shrineIcon = L.divIcon({
                className: 'shrine-marker',
                html: `
                    <div style="position: relative; width: 45px; height: 45px;">
                        <!-- Shrine aura -->
                        <div style="position: absolute; top: -6px; left: -6px; width: 57px; height: 57px; background: radial-gradient(circle, ${shrine.color}40 0%, transparent 70%); border-radius: 50%; animation: shrineGlow 3s infinite;"></div>
                        <!-- Shrine base -->
                        <div style="position: absolute; top: 3px; left: 3px; width: 39px; height: 39px; background: ${shrine.color}; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 15px ${shrine.color}80;"></div>
                        <!-- Shrine symbol -->
                        <div style="position: absolute; top: 10px; left: 10px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 16px; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">${shrine.emoji}</div>
                    </div>
                `,
                iconSize: [45, 45],
                iconAnchor: [22, 22]
            });
            
            const shrineMarker = L.marker([lat, lng], { icon: shrineIcon }).addTo(this.map);
            shrineMarker.bindPopup(`
                <div class="shrine-popup">
                    <h4>${shrine.emoji} ${shrine.name}</h4>
                    <p><strong>Effect:</strong> Restores ${shrine.effect}</p>
                    <p><strong>Status:</strong> Active</p>
                    <div class="popup-actions">
                        <button onclick="window.mapEngine.interactWithShrine('${shrine.effect}')" class="interact-btn">${shrine.emoji} Use Shrine</button>
                    </div>
                </div>
            `);
            
            this.shrineMarkers.push(shrineMarker);
        });
    }
    
    createItemMarkers(baseLat, baseLng) {
        const itemTypes = [
            { name: 'Cosmic Crystal', emoji: '💎', color: '#ff00ff', rarity: 'rare' },
            { name: 'Health Potion', emoji: '🧪', color: '#ff0000', rarity: 'common' },
            { name: 'Sanity Elixir', emoji: '🧠', color: '#8000ff', rarity: 'uncommon' },
            { name: 'Power Orb', emoji: '🔮', color: '#ffff00', rarity: 'rare' },
            { name: 'Ancient Scroll', emoji: '📜', color: '#8b4513', rarity: 'legendary' }
        ];
        
        // Initialize item markers storage if not exists
        if (!this.itemMarkers) {
            this.itemMarkers = [];
        }
        
        itemTypes.forEach((item, index) => {
            // Check if item has already been collected
            if (this.collectedItems && this.collectedItems.has(item.name)) {
                console.log(`💎 Item ${item.name} already collected, skipping marker creation`);
                return;
            }
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.001 + Math.random() * 0.002; // 100-300m
            const lat = baseLat + Math.cos(angle) * distance;
            const lng = baseLng + Math.sin(angle) * distance;
            
            const itemIcon = L.divIcon({
                className: 'item-marker',
                html: `
                    <div style="position: relative; width: 35px; height: 35px;">
                        <!-- Item glow -->
                        <div style="position: absolute; top: -4px; left: -4px; width: 43px; height: 43px; background: radial-gradient(circle, ${item.color}60 0%, transparent 70%); border-radius: 50%; animation: itemGlow 2s infinite;"></div>
                        <!-- Item container -->
                        <div style="position: absolute; top: 2px; left: 2px; width: 31px; height: 31px; background: ${item.color}; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px ${item.color}80;"></div>
                        <!-- Item symbol -->
                        <div style="position: absolute; top: 7px; left: 7px; width: 19px; height: 19px; display: flex; align-items: center; justify-content: center; font-size: 14px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">${item.emoji}</div>
                    </div>
                `,
                iconSize: [35, 35],
                iconAnchor: [17, 17]
            });
            
            const itemMarker = L.marker([lat, lng], { icon: itemIcon }).addTo(this.map);
            itemMarker.bindPopup(`
                <div class="item-popup">
                    <h4>${item.emoji} ${item.name}</h4>
                    <p><strong>Rarity:</strong> ${item.rarity}</p>
                    <p><strong>Status:</strong> Available</p>
                    <div class="popup-actions">
                        <button onclick="window.mapEngine.collectItem('${item.name}', '${item.rarity}')" class="interact-btn">${item.emoji} Collect</button>
                    </div>
                </div>
            `);
            
            // Store item marker reference with full data
            this.itemMarkers.push({
                marker: itemMarker,
                name: item.name,
                emoji: item.emoji,
                color: item.color,
                rarity: item.rarity,
                lat: lat,
                lng: lng,
                collected: false
            });
            
            console.log(`💎 Created ${item.name} marker at [${lat}, ${lng}]`);
        });
    }
    
    createMonsterMarkers(baseLat, baseLng) {
        const monsterTypes = [
            { name: 'Cosmic Horror', emoji: '👹', color: '#8b0000', difficulty: 'hard' },
            { name: 'Reality Distortion', emoji: '🌀', color: '#4b0082', difficulty: 'medium' },
            { name: 'Void Walker', emoji: '👻', color: '#2f4f4f', difficulty: 'easy' },
            { name: 'Dimensional Beast', emoji: '🐉', color: '#ff4500', difficulty: 'hard' }
        ];
        
        // Initialize monster markers storage if not exists
        if (!this.monsterMarkers) {
            this.monsterMarkers = [];
        }
        
        monsterTypes.forEach((monster, index) => {
            // Check if monster has already been defeated
            if (this.defeatedMonsters && this.defeatedMonsters.has(monster.name)) {
                console.log(`👹 Monster ${monster.name} already defeated, skipping marker creation`);
                return;
            }
            
            const angle = (Math.PI * 2 / monsterTypes.length) * index + Math.random() * 0.3;
            const distance = 0.002 + Math.random() * 0.001; // 200-300m
            const lat = baseLat + Math.cos(angle) * distance;
            const lng = baseLng + Math.sin(angle) * distance;
            
            const monsterIcon = L.divIcon({
                className: 'monster-marker',
                html: `
                    <div style="position: relative; width: 50px; height: 50px;">
                        <!-- Monster aura -->
                        <div style="position: absolute; top: -8px; left: -8px; width: 66px; height: 66px; background: radial-gradient(circle, ${monster.color}40 0%, transparent 70%); border-radius: 50%; animation: monsterPulse 1.5s infinite;"></div>
                        <!-- Monster body -->
                        <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: ${monster.color}; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 15px ${monster.color}80;"></div>
                        <!-- Monster symbol -->
                        <div style="position: absolute; top: 12px; left: 12px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);">${monster.emoji}</div>
                    </div>
                `,
                iconSize: [50, 50],
                iconAnchor: [25, 25]
            });
            
            const monsterMarker = L.marker([lat, lng], { icon: monsterIcon }).addTo(this.map);
            monsterMarker.bindPopup(`
                <div class="monster-popup">
                    <h4>${monster.emoji} ${monster.name}</h4>
                    <p><strong>Difficulty:</strong> ${monster.difficulty}</p>
                    <p><strong>Status:</strong> Hostile</p>
                    <div class="popup-actions">
                        <button onclick="window.mapEngine.fightMonster('${monster.name}', '${monster.difficulty}')" class="interact-btn">⚔️ Fight</button>
                    </div>
                </div>
            `);
            
            // Store monster marker reference with full data
            this.monsterMarkers.push({
                marker: monsterMarker,
                name: monster.name,
                emoji: monster.emoji,
                color: monster.color,
                difficulty: monster.difficulty,
                lat: lat,
                lng: lng,
                encountered: false
            });
            
            console.log(`👹 Created ${monster.name} marker at [${lat}, ${lng}]`);
        });
    }
    
    // Interaction methods for special markers
    interactWithHEVY() {
        console.log('⚡ Interacting with HEVY...');
        if (window.encounterSystem) {
            // Give player some cosmic power
            window.encounterSystem.playerStats.attack += 5;
            window.encounterSystem.playerStats.defense += 3;
            window.encounterSystem.updateStatBars();
            window.encounterSystem.showNotification('⚡ HEVY grants you cosmic power! +5 Attack, +3 Defense');
        }
    }
    
    interactWithShrine(effect) {
        console.log(`🏛️ Using ${effect} shrine...`);
        if (window.encounterSystem) {
            const amount = 20;
            switch(effect) {
                case 'health':
                    window.encounterSystem.playerStats.health = Math.min(100, window.encounterSystem.playerStats.health + amount);
                    window.encounterSystem.showNotification(`❤️ Health restored by ${amount}!`);
                    break;
                case 'sanity':
                    window.encounterSystem.playerStats.sanity = Math.min(100, window.encounterSystem.playerStats.sanity + amount);
                    window.encounterSystem.showNotification(`🧠 Sanity restored by ${amount}!`);
                    break;
                case 'power':
                    window.encounterSystem.playerStats.attack += 3;
                    window.encounterSystem.showNotification(`⚡ Attack power increased by 3!`);
                    break;
                case 'wisdom':
                    window.encounterSystem.playerStats.skills.investigation += 1;
                    window.encounterSystem.showNotification(`📚 Investigation skill increased!`);
                    break;
            }
            window.encounterSystem.updateStatBars();
        }
    }
    
    collectItem(itemName, rarity) {
        console.log(`💎 Collecting ${itemName} (${rarity})...`);
        if (window.encounterSystem) {
            // Add to inventory
            window.encounterSystem.playerStats.inventory.push({
                name: itemName,
                rarity: rarity,
                collected: Date.now()
            });
            window.encounterSystem.showNotification(`💎 Collected ${itemName}!`);
            
            // Remove item from map after collection
            this.removeItemFromMap(itemName);
        }
    }

    // Remove item from map after collection
    removeItemFromMap(itemName) {
        console.log(`💎 Removing collected item ${itemName} from map...`);
        
        // Initialize collected items storage if not exists
        if (!this.collectedItems) {
            this.collectedItems = new Set();
        }
        
        // Mark item as collected
        this.collectedItems.add(itemName);
        
        // Remove marker from map
        if (this.itemMarkers && this.itemMarkers.has(itemName)) {
            const marker = this.itemMarkers.get(itemName);
            if (marker && this.map) {
                this.map.removeLayer(marker);
                this.itemMarkers.delete(itemName);
                console.log(`💎 Item ${itemName} marker removed from map`);
            }
        }
    }
    
    fightMonster(monsterName, difficulty) {
        console.log(`⚔️ Fighting ${monsterName} (${difficulty})...`);
        if (window.encounterSystem) {
            const baseReward = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 30;
            window.encounterSystem.playerStats.experience += baseReward;
            window.encounterSystem.playerStats.health -= difficulty === 'easy' ? 5 : difficulty === 'medium' ? 15 : 25;
            window.encounterSystem.updateStatBars();
            window.encounterSystem.showNotification(`⚔️ Defeated ${monsterName}! Gained ${baseReward} XP, lost some health.`);
            
            // Remove monster from map after defeat
            this.removeMonsterFromMap(monsterName);
        }
    }

    // Remove monster from map after defeat
    removeMonsterFromMap(monsterName) {
        console.log(`👹 Removing defeated monster ${monsterName} from map...`);
        
        // Initialize defeated monsters storage if not exists
        if (!this.defeatedMonsters) {
            this.defeatedMonsters = new Set();
        }
        
        // Mark monster as defeated
        this.defeatedMonsters.add(monsterName);
        
        // Remove marker from map
        if (this.monsterMarkers && this.monsterMarkers.has(monsterName)) {
            const marker = this.monsterMarkers.get(monsterName);
            if (marker && this.map) {
                this.map.removeLayer(marker);
                this.monsterMarkers.delete(monsterName);
                console.log(`👹 Monster ${monsterName} marker removed from map`);
            }
        }
    }
    
}

// Export for use in other modules
window.MapEngine = MapEngine;
