/**
 * @fileoverview [VERIFIED] MapLayer - Leaflet map rendering and display
 * @status VERIFIED - Player marker visibility fixed, working correctly
 * @feature #feature-map-layer-rendering
 * @bugfix #bug-marker-visibility
 * @last_verified 2024-01-28
 * @dependencies Leaflet, BaseLayer, WebSocket
 * @warning Do not modify marker creation logic without testing visibility
 * 
 * This layer handles:
 * - Leaflet map rendering and display
 * - Map markers and overlays (visual only)
 * - Map centering and viewport management
 * - Map tile loading and styling
 * 
 * Z-Index: 4 (above paths)
 */

class MapLayer extends BaseLayer {
    constructor() {
        super('map');
        this.zIndex = 4;
        this.map = null;
        this.markers = new Map();
        this.overlays = new Map();
        this.mapReady = false;
        this.mapContainer = null;
        // Try to get GPS position first, fallback to random if not available
        this.initialPosition = this.getInitialPosition();
        this.initialZoom = 18;
        
        // Consciousness-Serving Player Marker Persistence
        this.playerMarkerPersistence = new PlayerMarkerPersistence();
    }

    /**
     * Get initial position - try GPS first, fallback to random
     * @returns {Object} Coordinates with lat/lng
     */
    getInitialPosition() {
        // Try to get GPS position from lazy loading gate
        if (window.playerPosition && window.playerPosition.lat && window.playerPosition.lng) {
            console.log(`🗺️ MapLayer: Using GPS position from lazy loading gate: ${window.playerPosition.lat}, ${window.playerPosition.lng}`);
            return {
                lat: window.playerPosition.lat,
                lng: window.playerPosition.lng,
                accuracy: window.playerPosition.accuracy
            };
        }
        
        // Try to get GPS position from GPS Core
        if (window.gpsCore && typeof window.gpsCore.getCurrentPosition === 'function') {
            const gpsPosition = window.gpsCore.getCurrentPosition();
            if (gpsPosition && gpsPosition.lat && gpsPosition.lng) {
                console.log(`🗺️ MapLayer: Using GPS position from GPS Core: ${gpsPosition.lat}, ${gpsPosition.lng}`);
                return gpsPosition;
            }
        }
        
        // Try to get position from localStorage
        const storedPosition = localStorage.getItem('eldritch_player_position');
        if (storedPosition) {
            try {
                const position = JSON.parse(storedPosition);
                if (position.lat && position.lng) {
                    console.log(`🗺️ MapLayer: Using stored GPS position: ${position.lat}, ${position.lng}`);
                    return position;
                }
            } catch (error) {
                console.warn('🗺️ MapLayer: Error parsing stored position:', error);
            }
        }
        
        // Fallback to random world location
        console.log('🗺️ MapLayer: No GPS position available, using random world location');
        const randomPosition = this.generateRandomWorldLocation();
        randomPosition.isRandom = true; // Mark as random for identification
        return randomPosition;
    }

    /**
     * Generate a random world location for testing purposes
     * @returns {Object} Random coordinates with lat/lng
     */
    generateRandomWorldLocation() {
        // Generate random coordinates within reasonable world bounds
        const lat = (Math.random() - 0.5) * 180; // -90 to 90 degrees
        const lng = (Math.random() - 0.5) * 360; // -180 to 180 degrees
        
        console.log(`🌍 Generated random world location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        return { lat: lat, lng: lng };
    }

    init() {
        super.init();
        console.log('🗺️ MapLayer: Initializing map system...');
        
        // Store global reference for easy access
        window.mapLayerInstance = this;
        
        // Create map container
        this.createMapContainer();
        
        // Initialize Leaflet map
        this.initializeMap();
        
        // Initialize Leaflet Layer Manager for canvas layer replacement
        if (this.mapReady) {
            this.leafletLayerManager = new LeafletLayerManager(this.map);
            console.log('🗺️ MapLayer: Leaflet Layer Manager initialized');
        }
        
        // Initialize Sacred Geometry Background Layer
        if (this.mapReady) {
            this.initializeSacredGeometryLayer();
        }
        
        // Initialize player marker after map is ready
        if (this.mapReady) {
            this.initializePlayerMarker();
        } else {
            // Wait for map to be ready
            this.waitForMapReady();
        }
        
        // Make MapLayer globally available
        window.mapLayer = this;
        window.mapEngine = { map: this.map }; // Compatibility alias
        console.log('🗺️ MapLayer: Made globally available as window.mapLayer and window.mapEngine');
        
        // Add test function for base marker creation
        window.testBaseMarker = () => {
            if (this.map && this.mapReady) {
                console.log('🗺️ Testing base marker creation...');
                const testPosition = this.generateRandomWorldLocation();
                const baseIcon = L.divIcon({
                    className: 'base-marker multilayered',
                    html: `<div style="position: relative; width: 40px; height: 40px;">
                        <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; 
                             background: radial-gradient(circle, #ff000040 0%, transparent 70%); 
                             border-radius: 50%; animation: basePulse 2s infinite;"></div>
                        <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; 
                             background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; 
                             box-shadow: 0 0 10px #ff000080;"></div>
                        <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; 
                             display: flex; align-items: center; justify-content: center; font-size: 18px; 
                             text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
                    </div>`,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
                
                const baseMarker = L.marker([testPosition.lat, testPosition.lng], { 
                    icon: baseIcon,
                    zIndexOffset: 2000
                }).addTo(this.map);
                
                console.log('🗺️ Test base marker created successfully!');
                return baseMarker;
            } else {
                console.error('🗺️ Map not ready for base marker creation');
                return null;
            }
        };

        // Add function to manually set player location to Nekala
        window.setPlayerLocationNekala = () => {
            if (this.map && this.mapReady) {
                const nekalaPosition = this.generateRandomWorldLocation();
                console.log('🗺️ Manually setting player location to Nekala:', nekalaPosition);
                this.updatePlayerMarker(nekalaPosition);
                this.map.setView(nekalaPosition, 18);
                console.log('🗺️ Player marker moved to Nekala and map centered');
            } else {
                console.warn('🗺️ Map not ready for manual location setting');
            }
        };
        
        console.log('🗺️ MapLayer: Map system initialized');
    }
    
    /**
     * Set up layer transparency and pointer events
     * MapLayer handles mouse events for map interactions
     */
    setupLayerTransparency() {
        // MapLayer handles mouse events for map interactions (zoom, pan, click)
        this.pointerEvents = 'auto';
    }

    createMapContainer() {
        // Use existing map container
        this.mapContainer = document.getElementById('map');
        if (!this.mapContainer) {
            console.error('🗺️ MapLayer: Map container not found!');
            return;
        }
        
        // Style the existing map container
        this.mapContainer.style.position = 'absolute';
        this.mapContainer.style.top = '0';
        this.mapContainer.style.left = '0';
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        this.mapContainer.style.zIndex = this.zIndex;
        this.mapContainer.style.pointerEvents = 'auto'; // MapLayer handles all mouse events
        
        console.log('🗺️ MapLayer: Using existing map container');
    }

    initializeMap() {
        if (typeof L === 'undefined') {
            console.error('🗺️ MapLayer: Leaflet not available');
            return;
        }

        // Check if map is already initialized
        if (this.map) {
            console.log('🗺️ MapLayer: Map already initialized, skipping');
            return;
        }

        // Check if container already has a map instance
        if (this.mapContainer._leaflet_id) {
            console.log('🗺️ MapLayer: Container already has a map instance, skipping');
            return;
        }

        try {
            // Try to use last known device position immediately
            let startPos = this.initialPosition;
            try {
                const cached = localStorage.getItem('eldritch_last_gps');
                if (cached) {
                    const p = JSON.parse(cached);
                    if (Number.isFinite(p.lat) && Number.isFinite(p.lng)) startPos = { lat: p.lat, lng: p.lng };
                }
            } catch (_) {}

            // Initialize Leaflet map
            this.map = L.map(this.mapContainer, {
                center: [startPos.lat, startPos.lng],
                zoom: this.initialZoom,
                zoomControl: true,
                attributionControl: true,
                dragging: true,
                touchZoom: true,
                doubleClickZoom: true,
                scrollWheelZoom: true,
                boxZoom: true,
                keyboard: true,
                zoomSnap: 0.1,
                zoomDelta: 0.5
            });

            // Add tile layer
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19
            }).addTo(this.map);

            // Set up map events
            this.setupMapEvents();

            this.mapReady = true;
            console.log('🗺️ MapLayer: Map initialized successfully');

            // Emit map ready event
            if (this.eventBus) {
                this.eventBus.emit('map:ready', {
                    map: this.map,
                    position: this.initialPosition,
                    zoom: this.initialZoom
                });
            }

        } catch (error) {
            console.error('🗺️ MapLayer: Failed to initialize map:', error);
        }
    }
    
    /**
     * Initialize Sacred Geometry Background Layer
     * @status [IN_DEVELOPMENT] - Sacred geometry integration
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    initializeSacredGeometryLayer() {
        console.log('🌌 MapLayer: Initializing Sacred Geometry Background Layer...');
        
        try {
            // Check if Sacred Geometry Layer is available
            if (typeof L.SacredGeometryLayer === 'undefined') {
                console.warn('🌌 Sacred Geometry Layer not available, skipping initialization');
                return;
            }
            
            // Create sacred geometry layer with cosmic settings
            this.sacredGeometryLayer = L.sacredGeometryLayer({
                opacity: 0.25, // Subtle sacred geometry
                visible: true,
                colorScheme: 'cosmic',
                patterns: {
                    flowerOfLife: true,
                    metatronsCube: true,
                    sriYantra: true,
                    goldenSpiral: true,
                    treeOfLife: true,
                    vesicaPiscis: true
                },
                effects: {
                    particles: true,
                    aurora: true,
                    cosmicGradient: true,
                    sacredSigils: true
                },
                performance: {
                    adaptiveQuality: true,
                    maxParticles: 30, // Reduced for performance
                    batteryOptimized: true
                }
            });
            
            // Add sacred geometry layer to map
            this.sacredGeometryLayer.addTo(this.map);
            
            // Make globally available for debugging
            window.sacredGeometryLayer = this.sacredGeometryLayer;
            
            console.log('🌌 MapLayer: Sacred Geometry Background Layer initialized successfully');
            
        } catch (error) {
            console.error('🌌 MapLayer: Failed to initialize Sacred Geometry Background Layer:', error);
        }
    }

    setupMapEvents() {
        if (!this.map) return;

        // Map ready event
        this.map.whenReady(() => {
            console.log('🗺️ MapLayer: Map is ready');
            this.mapReady = true;
            
            // Update player marker with GPS position if available
            setTimeout(() => {
                this.updatePlayerMarkerWithGPSPosition();
            }, 100); // Small delay to ensure everything is initialized
        });

        // Map move event
        this.map.on('move', () => {
            if (this.eventBus) {
                this.eventBus.emit('map:move', {
                    center: this.map.getCenter(),
                    zoom: this.map.getZoom()
                });
            }
        });

        // Map zoom event
        this.map.on('zoom', () => {
            if (this.eventBus) {
                this.eventBus.emit('map:zoom', {
                    zoom: this.map.getZoom(),
                    center: this.map.getCenter()
                });
            }
        });

        // Map click event
        this.map.on('click', (e) => {
            if (this.eventBus) {
                this.eventBus.emit('map:click', {
                    latlng: e.latlng,
                    layerPoint: e.layerPoint,
                    containerPoint: e.containerPoint
                });
            }
        });

        // Map context menu event - now handled by context-menu-system.js
        this.map.on('contextmenu', (e) => {
            e.originalEvent.preventDefault();
            // Context menu is now handled by the unified context-menu-system.js
        });
    }

    doRender(deltaTime) {
        // Map layer doesn't need canvas rendering
        // Leaflet handles its own rendering
    }

    // Public methods for external control
    addMarker(id, markerData) {
        if (!this.map || !this.mapReady) {
            console.warn('🗺️ MapLayer: Map not ready, cannot add marker');
            return;
        }

        const { position, icon, popup, options = {} } = markerData;
        
        if (!position || !position.lat || !position.lng) {
            console.warn('🗺️ MapLayer: Invalid position for marker', id);
            return;
        }

        // Create marker
        const marker = L.marker([position.lat, position.lng], options);
        
        // Add icon if provided
        if (icon) {
            marker.setIcon(icon);
        }
        
        // Add popup if provided
        if (popup) {
            marker.bindPopup(popup);
        }
        
        // Add to map
        marker.addTo(this.map);
        
        // Store marker
        this.markers.set(id, marker);
        
        console.log('🗺️ MapLayer: Added marker', id);
        return marker;
    }

    removeMarker(id) {
        const marker = this.markers.get(id);
        if (marker) {
            this.map.removeLayer(marker);
            this.markers.delete(id);
            console.log('🗺️ MapLayer: Removed marker', id);
        }
    }

    updateMarker(id, updates) {
        const marker = this.markers.get(id);
        if (marker) {
            if (updates.position) {
                marker.setLatLng([updates.position.lat, updates.position.lng]);
            }
            if (updates.icon) {
                marker.setIcon(updates.icon);
            }
            if (updates.popup) {
                marker.bindPopup(updates.popup);
            }
            console.log('🗺️ MapLayer: Updated marker', id);
        }
    }

    addOverlay(id, overlayData) {
        if (!this.map || !this.mapReady) {
            console.warn('🗺️ MapLayer: Map not ready, cannot add overlay');
            return;
        }

        const { type, data, options = {} } = overlayData;
        let overlay = null;

        switch (type) {
            case 'circle':
                overlay = L.circle([data.center.lat, data.center.lng], {
                    radius: data.radius,
                    ...options
                });
                break;
            case 'polygon':
                overlay = L.polygon(data.points.map(p => [p.lat, p.lng]), options);
                break;
            case 'polyline':
                overlay = L.polyline(data.points.map(p => [p.lat, p.lng]), options);
                break;
            case 'rectangle':
                overlay = L.rectangle([
                    [data.bounds.south, data.bounds.west],
                    [data.bounds.north, data.bounds.east]
                ], options);
                break;
            default:
                console.warn('🗺️ MapLayer: Unknown overlay type', type);
                return;
        }

        if (overlay) {
            overlay.addTo(this.map);
            this.overlays.set(id, overlay);
            console.log('🗺️ MapLayer: Added overlay', id);
        }
    }

    removeOverlay(id) {
        const overlay = this.overlays.get(id);
        if (overlay) {
            this.map.removeLayer(overlay);
            this.overlays.delete(id);
            console.log('🗺️ MapLayer: Removed overlay', id);
        }
    }

    updateOverlay(id, updates) {
        const overlay = this.overlays.get(id);
        if (overlay) {
            // Update overlay based on type
            if (updates.data) {
                if (overlay instanceof L.Circle) {
                    overlay.setLatLng([updates.data.center.lat, updates.data.center.lng]);
                    overlay.setRadius(updates.data.radius);
                } else if (overlay instanceof L.Polygon || overlay instanceof L.Polyline) {
                    overlay.setLatLngs(updates.data.points.map(p => [p.lat, p.lng]));
                }
            }
            console.log('🗺️ MapLayer: Updated overlay', id);
        }
    }

    setView(lat, lng, zoom) {
        if (this.map && this.mapReady) {
            this.map.setView([lat, lng], zoom);
            console.log('🗺️ MapLayer: Set view to', lat, lng, zoom);
        }
    }

    getCenter() {
        if (this.map && this.mapReady) {
            return this.map.getCenter();
        }
        return null;
    }

    getZoom() {
        if (this.map && this.mapReady) {
            return this.map.getZoom();
        }
        return null;
    }

    fitBounds(bounds) {
        if (this.map && this.mapReady) {
            this.map.fitBounds(bounds);
            console.log('🗺️ MapLayer: Fit bounds', bounds);
        }
    }

    // GPS to screen coordinate conversion
    gpsToScreen(lat, lng) {
        if (!this.map || !this.mapReady) {
            return null;
        }

        try {
            const point = this.map.latLngToContainerPoint([lat, lng]);
            return { x: point.x, y: point.y };
        } catch (error) {
            console.error('🗺️ MapLayer: Error converting GPS to screen coordinates:', error);
            return null;
        }
    }

    // Screen to GPS coordinate conversion
    screenToGps(x, y) {
        if (!this.map || !this.mapReady) {
            return null;
        }

        try {
            const latlng = this.map.containerPointToLatLng([x, y]);
            return { lat: latlng.lat, lng: latlng.lng };
        } catch (error) {
            console.error('🗺️ MapLayer: Error converting screen to GPS coordinates:', error);
            return null;
        }
    }

    // Get map bounds
    getBounds() {
        if (this.map && this.mapReady) {
            return this.map.getBounds();
        }
        return null;
    }

    // Check if point is visible
    isPointVisible(lat, lng) {
        if (!this.map || !this.mapReady) {
            return false;
        }

        const bounds = this.map.getBounds();
        return bounds.contains([lat, lng]);
    }

    // Enable/disable map interactions
    setInteractive(interactive) {
        if (this.map) {
            if (interactive) {
                this.map.dragging.enable();
                this.map.touchZoom.enable();
                this.map.doubleClickZoom.enable();
                this.map.scrollWheelZoom.enable();
                this.map.boxZoom.enable();
                this.map.keyboard.enable();
            } else {
                this.map.dragging.disable();
                this.map.touchZoom.disable();
                this.map.doubleClickZoom.disable();
                this.map.scrollWheelZoom.disable();
                this.map.boxZoom.disable();
                this.map.keyboard.disable();
            }
        }
    }

    resize(width, height) {
        super.resize(width, height);
        
        // Resize map container
        if (this.mapContainer) {
            this.mapContainer.style.width = `${width}px`;
            this.mapContainer.style.height = `${height}px`;
        }
        
        // Invalidate map size
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
        
        console.log('🗺️ MapLayer: Resized to', width, 'x', height);
    }

    destroy() {
        // Hide context menu
        this.hideContextMenu();
        
        // Remove all markers
        this.markers.forEach((marker, id) => {
            this.removeMarker(id);
        });
        
        // Remove all overlays
        this.overlays.forEach((overlay, id) => {
            this.removeOverlay(id);
        });
        
        // Remove step markers
        if (this.stepMarkers) {
            this.stepMarkers.forEach(marker => marker.remove());
            this.stepMarkers = [];
        }
        
        // Remove path markers
        if (this.pathMarkers) {
            this.pathMarkers.forEach(marker => marker.remove());
            this.pathMarkers = [];
        }
        
        // Remove map
        if (this.map) {
            this.map.remove();
            this.map = null;
        }
        
        // Remove map container
        if (this.mapContainer && this.mapContainer.parentNode) {
            this.mapContainer.parentNode.removeChild(this.mapContainer);
        }
        
        super.destroy();
        console.log('🗺️ MapLayer: Destroyed');
    }

    // Map Ready Methods
    waitForMapReady() {
        console.log('🗺️ MapLayer: Waiting for map to be ready...');
        const checkMapReady = () => {
            if (this.mapReady && this.map) {
                console.log('🗺️ MapLayer: Map is now ready, initializing player marker');
                this.initializePlayerMarker();
            } else {
                setTimeout(checkMapReady, 100);
            }
        };
        checkMapReady();
    }

    // Player Marker Methods
    initializePlayerMarker() {
        console.log('🗺️ MapLayer: Initializing player marker...');
        
        // Initialize player marker persistence system
        this.playerMarkerPersistence = new PlayerMarkerPersistence();
        
        // Listen for position updates from lazy loading gate
        if (this.eventBus) {
            this.eventBus.on('player:position:updated', this.handlePositionUpdate.bind(this));
            this.eventBus.on('geolocation:position:update', this.handlePositionUpdate.bind(this)); // Legacy support
        }
        
        // Consciousness-Serving: Create player marker immediately with current position
        let playerPosition = null;
        
        // Try GPS Core first
        if (window.gpsCore && window.gpsCore.currentPosition) {
            playerPosition = window.gpsCore.currentPosition;
            console.log('📍 MapLayer: Using GPS Core position for player marker:', playerPosition);
        }
        // Try saved position
        else if (this.playerMarkerPersistence.loadMarkerPosition()) {
            playerPosition = this.playerMarkerPersistence.loadMarkerPosition();
            console.log('📍 MapLayer: Using saved position for player marker:', playerPosition);
        }
        // Try initial position
        else if (this.initialPosition) {
            playerPosition = this.initialPosition;
            console.log('📍 MapLayer: Using initial position for player marker:', playerPosition);
        }
        
        // Create player marker immediately if we have a position
        if (playerPosition) {
            this.createPlayerMarker(playerPosition);
        } else {
            console.warn('📍 MapLayer: No position available for player marker, will create when position is available');
        }
        
        // If GPS position is available, update the marker immediately
        this.updatePlayerMarkerWithGPSPosition();
    }

    updatePlayerMarkerWithGPSPosition() {
        // Try to get current GPS position and update marker
        const gpsPosition = this.getInitialPosition();
        
        // Only update if we got a GPS position (not random fallback)
        if (gpsPosition && gpsPosition.lat && gpsPosition.lng && 
            !gpsPosition.isRandom && this.map && this.mapReady) {
            
            console.log('🗺️ MapLayer: Updating player marker with GPS position:', gpsPosition);
            this.updatePlayerMarker(gpsPosition);
        } else if (window.playerPosition && window.playerPosition.lat && window.playerPosition.lng) {
            console.log('🗺️ MapLayer: Updating player marker with window.playerPosition:', window.playerPosition);
            this.updatePlayerMarker(window.playerPosition);
        }
    }

    handlePositionUpdate(position) {
        console.log('🗺️ MapLayer: Position update received:', position);
        
        // Check if GPS tracking is disabled
        if (this.isGPSTrackingDisabled()) {
            console.log('🗺️ MapLayer: GPS tracking disabled, ignoring position update');
            return;
        }
        
        if (this.map && this.mapReady) {
            this.updatePlayerMarker({
                lat: position.latitude || position.lat,
                lng: position.longitude || position.lng,
                accuracy: position.accuracy
            });
        }
    }

    createPlayerMarker(position) {
        if (!this.map || !this.mapReady) {
            console.warn('🗺️ MapLayer: Map not ready, cannot create player marker');
            return;
        }

        // Consciousness-Serving: Ensure marker persistence
        this.playerMarkerPersistence.saveMarkerPosition(position);

        // Create player marker icon
        const playerIcon = L.divIcon({
            className: 'player-marker',
            html: this.createPlayerMarkerHTML(),
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Create marker
        const marker = L.marker([position.lat, position.lng], { 
            icon: playerIcon,
            zIndexOffset: 1000
        }).addTo(this.map);

        // Add popup
        marker.bindPopup('<b>Your Location</b><br>You are here in the cosmic realm');

        // Store marker
        this.markers.set('player', marker);
        
        // Consciousness-Serving: Force marker visibility
        this.playerMarkerPersistence.ensureMarkerVisible(marker);
        
        console.log('🗺️ MapLayer: Player marker created at:', position);
    }

    updatePlayerMarker(position) {
        const marker = this.markers.get('player');
        if (marker) {
            marker.setLatLng([position.lat, position.lng]);
            console.log('🗺️ MapLayer: Player marker updated to:', position);
            
            // Add a temporary flash effect to make the marker more noticeable
            this.flashPlayerMarker();
        } else {
            console.log('🗺️ MapLayer: No existing player marker, creating new one');
            // Create marker if it doesn't exist
            this.createPlayerMarker(position);
        }
    }

    flashPlayerMarker() {
        const marker = this.markers.get('player');
        if (marker) {
            // Get the marker's DOM element
            const element = marker._icon;
            if (element) {
                // Add flash effect
                element.style.animation = 'none';
                element.offsetHeight; // Trigger reflow
                element.style.animation = 'playerFlash 0.5s ease-in-out';
                
                // Remove animation after it completes
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
            }
        }
    }

    createPlayerMarkerHTML() {
        const iconChoice = (localStorage.getItem('eldritch_player_icon') || 'person');
        const colorChoice = localStorage.getItem('eldritch_player_color') || '#00ff00';
        const emoji = (() => {
            switch (iconChoice) {
                case 'comet': return '☄️';
                case 'sparkle': return '✨';
                case 'dragon': return '🐉';
                case 'beacon': return '📡';
                default: return '👤';
            }
        })();
        return `
            <div style="position: relative; width: 40px; height: 40px;">
                <div style="position: absolute; top: -10px; left: -10px; width: 60px; height: 60px; background: radial-gradient(circle, ${colorChoice}40 0%, transparent 70%); border-radius: 50%; animation: playerPulse 2s infinite;"></div>
                <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, ${colorChoice}60 0%, transparent 70%); border-radius: 50%; animation: playerGlow 2s infinite;"></div>
                <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: ${colorChoice}; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px ${colorChoice}, 0 0 40px ${colorChoice};"></div>
                <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 8px rgba(0,0,0,0.9); font-weight: bold;">${emoji}</div>
            </div>
        `;
    }

    // Context Menu Methods - now handled by context-menu-system.js

    // Player Teleportation Methods
    teleportPlayer(targetPosition) {
        console.log('🚀 Teleporting player to:', targetPosition);
        
        // Disable GPS tracking on first teleportation
        this.disableGPSTracking();
        
        // Get current player position
        const currentPosition = this.getCurrentPlayerPosition();
        
        // Update player marker position
        this.updatePlayerMarker({
            lat: targetPosition.lat,
            lng: targetPosition.lng,
            accuracy: 1
        });
        
        // Create step markers between positions
        const stepMarkers = this.createStepMarkers(currentPosition, targetPosition);
        console.log('🚶‍♂️ DEBUG: stepMarkers created:', stepMarkers);
        console.log('🚶‍♂️ DEBUG: stepMarkers length:', stepMarkers ? stepMarkers.length : 'undefined');
        console.log('🚶‍♂️ DEBUG: window.stepCurrencySystem available:', !!window.stepCurrencySystem);
        
        // Add path marker at new position
        this.addPathMarker(targetPosition);
        
        // Give steps for the movement (10 steps per step marker)
        if (window.stepCurrencySystem && stepMarkers && stepMarkers.length > 0) {
            const stepsToGive = stepMarkers.length * 10; // 10 steps per marker
            console.log(`🚶‍♂️ Giving ${stepsToGive} steps for Move Here (${stepMarkers.length} markers)`);
            
            for (let i = 0; i < stepsToGive; i++) {
                window.stepCurrencySystem.addManualStep();
            }
        } else {
            console.log('🚶‍♂️ DEBUG: Not giving steps - stepCurrencySystem:', !!window.stepCurrencySystem, 'stepMarkers:', stepMarkers, 'length:', stepMarkers ? stepMarkers.length : 'undefined');
        }
        
        // Center map on new position
        this.map.setView([targetPosition.lat, targetPosition.lng], this.map.getZoom(), { animate: true, duration: 0.5 });
        
        // Emit teleportation event
        if (this.eventBus) {
            this.eventBus.emit('player:teleported', {
                from: currentPosition,
                to: targetPosition
            });
        }
    }

    getCurrentPlayerPosition() {
        const playerMarker = this.markers.get('player');
        if (playerMarker) {
            const latlng = playerMarker.getLatLng();
            return { lat: latlng.lat, lng: latlng.lng };
        }
        return this.initialPosition;
    }

    createStepMarkers(fromPosition, toPosition) {
        console.log('👣 Creating step markers from', fromPosition, 'to', toPosition);
        
        // Calculate distance and number of steps
        const distance = this.calculateDistance(fromPosition.lat, fromPosition.lng, toPosition.lat, toPosition.lng);
        const maxMarkers = 10; // Limit to 10 markers maximum
        const stepCount = Math.min(maxMarkers, Math.max(1, Math.floor(distance / 10))); // One marker every 10 meters, max 10
        
        const stepMarkers = [];
        
        // Create step markers
        for (let i = 1; i <= stepCount; i++) {
            const ratio = i / (stepCount + 1);
            const stepLat = fromPosition.lat + (toPosition.lat - fromPosition.lat) * ratio;
            const stepLng = fromPosition.lng + (toPosition.lng - fromPosition.lng) * ratio;
            
            const marker = this.addStepMarker({ lat: stepLat, lng: stepLng }, i);
            stepMarkers.push(marker);
        }
        
        console.log(`👣 Created ${stepMarkers.length} step markers (limited to ${maxMarkers})`);
        return stepMarkers;
    }

    addStepMarker(position, stepNumber) {
        const stepIcon = L.divIcon({
            className: 'step-marker',
            html: `
                <div style="
                    width: 20px; 
                    height: 20px; 
                    background: #ff6b6b; 
                    border: 2px solid #ffffff; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 10px; 
                    color: white; 
                    font-weight: bold;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">
                    ${stepNumber}
                </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const marker = L.marker([position.lat, position.lng], { 
            icon: stepIcon,
            zIndexOffset: 500
        }).addTo(this.map);
        
        // Store step marker
        if (!this.stepMarkers) this.stepMarkers = [];
        this.stepMarkers.push(marker);
        
        // Send step marker to server for persistence
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log(`👣 Sending step marker ${stepNumber} to server for persistence...`);
            window.websocketClient.createMarker({
                type: 'step',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    stepNumber: stepNumber,
                    markerId: `step_${stepNumber}_${Date.now()}`
                }
            });
        } else {
            console.log(`👣 WebSocket not connected, step marker ${stepNumber} not persisted to server`);
        }
        
        console.log('👣 Added step marker', stepNumber, 'at', position);
        
        return marker;
    }

    addPathMarker(position) {
        const symbolChoice = (localStorage.getItem('eldritch_player_path_symbol') || 'sun');
        const symbolEmoji = (() => {
            switch (symbolChoice) {
                case 'star': return '⭐';
                case 'sparkle': return '✨';
                case 'crescent': return '🌙';
                case 'diamond': return '💎';
                case 'aurora': return '🌌';
                case 'lightning': return '⚡';
                case 'flame': return '🔥';
                case 'snowflake': return '❄️';
                case 'wave': return '🌊';
                default: return '☀️';
            }
        })();
        const pathIcon = L.divIcon({
            className: 'path-marker',
            html: `
                <div style="
                    width: 30px; 
                    height: 30px; 
                    background: #003580; 
                    border: 3px solid #ffffff; 
                    border-radius: 4px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 16px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                ">
                    ${symbolEmoji}
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        // DEBUG: Log path marker details
        console.log(`🇫🇮 PathMarker DEBUG: Creating path marker`);
        console.log(`🇫🇮 PathMarker DEBUG: Position:`, position);
        console.log(`🇫🇮 PathMarker DEBUG: Map reference:`, this.map);
        console.log(`🇫🇮 PathMarker DEBUG: Map center:`, this.map.getCenter());
        console.log(`🇫🇮 PathMarker DEBUG: Map zoom:`, this.map.getZoom());

        const marker = L.marker([position.lat, position.lng], { 
            icon: pathIcon,
            zIndexOffset: 600
        }).addTo(this.map);
        
        // DEBUG: Log marker details after creation
        console.log(`🇫🇮 PathMarker DEBUG: Marker created:`, marker);
        console.log(`🇫🇮 PathMarker DEBUG: Marker position:`, marker.getLatLng());
        console.log(`🇫🇮 PathMarker DEBUG: Marker element:`, marker.getElement());
        
        // Add popup
        marker.bindPopup(`
            <b>Path Marker</b><br>
            <small>${symbolChoice}</small><br>
            <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
        `);
        
        // Store path marker
        if (!this.pathMarkers) this.pathMarkers = [];
        this.pathMarkers.push(marker);
        
        // Send path marker to server for persistence
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🇫🇮 Sending path marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'path',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    symbol: symbolChoice,
                    markerId: `path_${Date.now()}`
                }
            });
        } else {
            console.log('🇫🇮 WebSocket not connected, path marker not persisted to server');
        }
        
        console.log('🇫🇮 Added path marker at', position);
    }

    // Base Marker Methods
    addBaseMarker(position) {
        if (!this.map || !this.mapReady) {
            console.warn('🗺️ MapLayer: Map not ready, cannot create base marker');
            return null;
        }
        
        // Remove existing base marker if it exists
        const existingBaseMarker = this.markers.get('base');
        if (existingBaseMarker) {
            console.log('🏗️ MapLayer: Removing existing base marker');
            this.map.removeLayer(existingBaseMarker);
            this.markers.delete('base');
        }

        // Resolve selected base flag/symbol
        const baseChoice = (localStorage.getItem('eldritch_player_base_logo') || 'finnish');
        const baseEmoji = (() => {
            switch (baseChoice) {
                case 'swedish': return '🇸🇪';
                case 'norwegian': return '🇳🇴';
                case 'flower_of_life': return '✳️';
                case 'sacred_triangle': return '🔺';
                case 'hexagon': return '⬣';
                case 'cosmic_spiral': return '🌀';
                case 'star': return '⭐';
                default: return '🇫🇮';
            }
        })();

        // Create base marker icon - TINY for starters
        const baseIcon = L.divIcon({
            className: 'base-marker',
            html: `
                <div style="
                    width: 16px; 
                    height: 16px; 
                    background: #8b5cf6; 
                    border: 2px solid #ffffff; 
                    border-radius: 50%; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    font-size: 10px;
                    color: white;
                    text-shadow: 0 0 2px rgba(0, 0, 0, 0.8);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                ">${baseEmoji}</div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        // DEBUG: Log base marker details (same as path markers)
        console.log(`🏗️ BaseMarker DEBUG: Creating base marker`);
        console.log(`🏗️ BaseMarker DEBUG: Position:`, position);
        console.log(`🏗️ BaseMarker DEBUG: Map reference:`, this.map);
        console.log(`🏗️ BaseMarker DEBUG: Map center:`, this.map.getCenter());
        console.log(`🏗️ BaseMarker DEBUG: Map zoom:`, this.map.getZoom());

        // Create marker using EXACT same method as path markers - DIRECT to map
        const marker = L.marker([position.lat, position.lng], { 
            icon: baseIcon,
            zIndexOffset: 600  // SAME as path markers
        }).addTo(this.map);  // DIRECT addition like path markers

        // DEBUG: Log marker details after creation (same as path markers)
        console.log(`🏗️ BaseMarker DEBUG: Marker created:`, marker);
        console.log(`🏗️ BaseMarker DEBUG: Marker position:`, marker.getLatLng());
        console.log(`🏗️ BaseMarker DEBUG: Marker element:`, marker.getElement());

        // Add popup (same as path markers)
        marker.bindPopup(`
            <b>Base Marker</b><br>
            <small>${baseChoice}</small><br>
            <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
        `);
        
        // Store marker in SAME way as path markers
        this.markers.set('base', marker);
        
        // Send base marker to server for persistence (same as path markers)
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🏗️ Sending base marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'base',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    symbol: baseChoice,
                    markerId: `base_${Date.now()}`
                }
            });
        } else {
            console.log('🏗️ WebSocket not connected, base marker not persisted to server');
        }
        
        console.log('🏗️ MapLayer: Base marker created at:', position);
        console.log('🏗️ MapLayer: Base marker added directly to map (same as path markers)');
        
        return marker;
    }

    getCurrentPlayerPosition() {
        console.log('🗺️ MapLayer: Getting current player position...');
        
        // Try to get from player marker
        const playerMarker = this.markers.get('player');
        if (playerMarker) {
            const latlng = playerMarker.getLatLng();
            const position = { lat: latlng.lat, lng: latlng.lng };
            console.log('🗺️ MapLayer: Player position from marker:', position);
            return position;
        }
        
        // Fallback: use map center
        if (this.map) {
            const center = this.map.getCenter();
            const position = { lat: center.lat, lng: center.lng };
            console.log('🗺️ MapLayer: Using map center as player position:', position);
            return position;
        }
        
        console.warn('🗺️ MapLayer: No player position available');
        return null;
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

    // GPS Tracking Control Methods
    disableGPSTracking() {
        console.log('📍 Disabling GPS tracking due to manual player movement');
        
        // Set flag to disable GPS updates
        this.gpsTrackingDisabled = true;
        
        // Stop geolocation tracking if available
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            if (geolocation.pauseLocationUpdates) {
                geolocation.pauseLocationUpdates();
                console.log('📍 GPS tracking paused');
            }
        }
        
        // Update header GPS indicator
        this.updateGPSIndicator(false);
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('gps:disabled', { reason: 'manual_movement' });
        }
    }

    enableGPSTracking() {
        console.log('📍 Re-enabling GPS tracking');
        
        // Set flag to enable GPS updates
        this.gpsTrackingDisabled = false;
        console.log('📍 GPS tracking flag set to:', this.gpsTrackingDisabled);
        
        // Resume geolocation tracking if available
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            console.log('📍 Found geolocation system:', !!geolocation);
            
            if (geolocation.resumeLocationUpdates) {
                geolocation.resumeLocationUpdates();
                console.log('📍 GPS tracking resumed');
            } else {
                console.warn('📍 resumeLocationUpdates method not found');
            }
            
            // Immediately request fresh GPS position from device
            console.log('📍 Requesting fresh GPS position...');
            this.requestFreshGPSPosition();
        } else {
            console.warn('📍 Geolocation system not found in app');
        }
        
        // Update header GPS indicator
        this.updateGPSIndicator(true);
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('gps:enabled', { reason: 'manual_toggle' });
        }
    }

    /**
     * Request fresh GPS position from device
     */
    requestFreshGPSPosition() {
        console.log('📍 Requesting fresh GPS position from device...');
        console.log('📍 Navigator geolocation available:', !!navigator.geolocation);
        
        if (navigator.geolocation) {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0 // Force fresh position
            };
            
            console.log('📍 GPS options:', options);
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('📍 Fresh GPS position received:', position);
                    const freshPosition = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: Date.now()
                    };
                    
                    console.log('📍 Fresh position data:', freshPosition);
                    
                    // Update player marker immediately
                    console.log('📍 Updating player marker...');
                    this.updatePlayerMarker(freshPosition);
                    
                    // Center map on fresh GPS location
                    if (this.map) {
                        console.log('📍 Centering map on fresh position...');
                        this.map.setView([freshPosition.lat, freshPosition.lng], this.map.getZoom(), { animate: true, duration: 0.5 });
                    } else {
                        console.warn('📍 Map not available for centering');
                    }
                    
                    // Update geolocation system with fresh position
                    if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
                        const geolocation = window.eldritchApp.systems.geolocation;
                        if (geolocation.handlePositionUpdate) {
                            console.log('📍 Updating geolocation system with fresh position...');
                            geolocation.handlePositionUpdate(position);
                        } else {
                            console.warn('📍 handlePositionUpdate method not found');
                        }
                    } else {
                        console.warn('📍 Geolocation system not found for position update');
                    }
                },
                (error) => {
                    console.error('📍 Failed to get fresh GPS position:', error);
                    console.error('📍 Error details:', {
                        code: error.code,
                        message: error.message
                    });
                    
                    // Fallback to cached position
                    if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
                        const geolocation = window.eldritchApp.systems.geolocation;
                        const cachedPosition = geolocation.getCurrentPositionSafe();
                        if (cachedPosition) {
                            console.log('📍 Using cached GPS position as fallback:', cachedPosition);
                            this.updatePlayerMarker(cachedPosition);
                            
                            if (this.map) {
                                this.map.setView([cachedPosition.lat, cachedPosition.lng], this.map.getZoom(), { animate: true, duration: 0.5 });
                            }
                        } else {
                            console.warn('📍 No cached position available');
                        }
                    }
                },
                options
            );
        } else {
            console.warn('📍 Geolocation not supported, using cached position');
            
            // Fallback to cached position
            if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
                const geolocation = window.eldritchApp.systems.geolocation;
                const cachedPosition = geolocation.getCurrentPositionSafe();
                if (cachedPosition) {
                    console.log('📍 Using cached GPS position:', cachedPosition);
                    this.updatePlayerMarker(cachedPosition);
                    
                    if (this.map) {
                        this.map.setView([cachedPosition.lat, cachedPosition.lng], this.map.getZoom(), { animate: true, duration: 0.5 });
                    }
                } else {
                    console.warn('📍 No cached position available');
                }
            }
        }
    }

    updateGPSIndicator(enabled) {
        // Update header GPS indicator if available
        const gpsIndicator = document.querySelector('.gps-status');
        if (gpsIndicator) {
            gpsIndicator.textContent = enabled ? 'GPS: ON' : 'GPS: OFF';
            gpsIndicator.style.color = enabled ? '#00ff00' : '#ff4444';
        }
    }

    isGPSTrackingDisabled() {
        return this.gpsTrackingDisabled || false;
    }
}

/**
 * Consciousness-Serving Player Marker Persistence System
 * Ensures player marker always appears and persists across sessions
 */
class PlayerMarkerPersistence {
    constructor() {
        this.storageKey = 'eldritch_player_marker';
        this.marker = null;
        console.log('📍 Player Marker Persistence System initialized');
    }
    
    /**
     * Save marker position to consciousness-serving storage
     */
    saveMarkerPosition(position) {
        const markerData = {
            lat: position.lat,
            lng: position.lng,
            timestamp: Date.now(),
            accuracy: position.accuracy || 0,
            consciousnessLevel: 'spatial_awareness'
        };
        
        localStorage.setItem(this.storageKey, JSON.stringify(markerData));
        console.log('📍 Player marker position saved:', markerData);
    }
    
    /**
     * Load marker position from consciousness-serving storage
     */
    loadMarkerPosition() {
        const saved = localStorage.getItem(this.storageKey);
        if (saved) {
            try {
                const markerData = JSON.parse(saved);
                console.log('📍 Player marker position loaded:', markerData);
                return markerData;
            } catch (error) {
                console.error('📍 Error loading marker position:', error);
                return null;
            }
        }
        return null;
    }
    
    /**
     * Ensure marker is always visible (consciousness-serving)
     */
    ensureMarkerVisible(marker) {
        if (marker) {
            // Force marker visibility
            marker.setOpacity(1);
            marker.setZIndexOffset(1000);
            
            // Ensure marker is always on top (correct Leaflet API)
            // Leaflet markers don't have bringToFront, but we can use zIndexOffset
            // The higher zIndexOffset ensures it appears on top
            
            console.log('📍 Player marker visibility ensured');
        }
    }
    
    /**
     * Create player marker if it doesn't exist
     */
    createPlayerMarker(map) {
        const savedPosition = this.loadMarkerPosition();
        if (savedPosition && map) {
            const playerIcon = L.divIcon({
                className: 'player-marker',
                html: '<div class="player-marker-icon">📍</div>',
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            const marker = L.marker([savedPosition.lat, savedPosition.lng], {
                icon: playerIcon,
                zIndexOffset: 1000
            }).addTo(map);
            
            marker.bindPopup('<b>Your Location</b><br>Welcome back to the cosmic realm');
            this.marker = marker;
            
            console.log('📍 Player marker created from saved position');
            return marker;
        }
        return null;
    }
    
    /**
     * Clear saved marker data (for new game)
     */
    clear() {
        localStorage.removeItem(this.storageKey);
        console.log('📍 Player marker persistence cleared');
    }
}

// Make globally available
window.MapLayer = MapLayer;
window.PlayerMarkerPersistence = PlayerMarkerPersistence;
