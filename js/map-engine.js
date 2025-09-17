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
        this.playerBaseMarker = null;
        this.territoryPolygon = null;
        this.isInitialized = false;
        this.onMapReady = null;
        this.onMarkerClick = null;
    }

    init() {
        if (this.isInitialized) {
            console.log('🗺️ Map engine already initialized, skipping');
            return;
        }
        
        this.setupMap();
        this.setupMapEvents();
        this.isInitialized = true;
        console.log('🗺️ Map engine initialized');
    }

    setupMap() {
        // Initialize Leaflet map with cosmic styling - centered on Tampere Härmälä
        this.map = L.map('map', {
            center: [61.4978, 23.7608], // Tampere Härmälä default
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
            // Create player marker
            this.playerMarker = L.circleMarker(latlng, {
                radius: 12,
                fillColor: '#00ff00',
                color: '#ffffff',
                weight: 4,
                opacity: 1,
                fillOpacity: 0.9,
                className: 'player-marker'
            }).addTo(this.map);

            // Add pulsing animation
            this.animatePlayerMarker();
            
            console.log('📍 Player marker created at:', latlng);
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

        // Create base marker with simple circle first (for testing)
        this.playerBaseMarker = L.circleMarker(latlng, {
            radius: 25,
            fillColor: '#ff0000',
            color: '#ffffff',
            weight: 3,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(this.map);
        
        console.log('🏗️ Created simple circle marker for testing');
        
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
                    <button onclick="window.mapEngine.closeBasePopup()" 
                            class="close-popup-btn" title="Close">&times;</button>
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
                </div>
            </div>
        `;
        
        console.log('🏗️ Binding popup to base marker:', popupContent);
        this.playerBaseMarker.bindPopup(popupContent);
        
        // Add click event for debugging
        this.playerBaseMarker.on('click', (e) => {
            console.log('🏗️ Base marker clicked!', e);
            console.log('🏗️ Event target:', e.target);
            console.log('🏗️ Event type:', e.type);
        });
        
        // Also try mousedown and mouseup events
        this.playerBaseMarker.on('mousedown', (e) => {
            console.log('🏗️ Base marker mousedown!', e);
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
            if (growing) {
                scale += 0.02;
                if (scale >= 1.3) growing = false;
            } else {
                scale -= 0.02;
                if (scale <= 1) growing = true;
            }

            // Update star marker scale using CSS transform
            const starElement = this.playerBaseMarker.getElement();
            if (starElement) {
                starElement.style.transform = `scale(${scale})`;
            }
            
            if (this.playerBaseMarker._map) {
                requestAnimationFrame(animate);
            }
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

    openBaseManagement() {
        if (window.baseSystem) {
            window.baseSystem.openBasePanel();
        }
    }

    closeBasePopup() {
        if (this.playerBaseMarker && this.playerBaseMarker.isPopupOpen()) {
            this.playerBaseMarker.closePopup();
        }
    }

    // Cleanup
    destroy() {
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
}

// Export for use in other modules
window.MapEngine = MapEngine;
