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
        this.initialPosition = { lat: 61.472768, lng: 23.724032 }; // Default position
        this.initialZoom = 18;
    }

    init() {
        super.init();
        console.log('🗺️ MapLayer: Initializing map system...');
        
        // Create map container
        this.createMapContainer();
        
        // Initialize Leaflet map
        this.initializeMap();
        
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
                const testPosition = { lat: 61.472768, lng: 23.724032 };
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
                const nekalaPosition = { lat: 61.472768, lng: 23.724032 };
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
            // Initialize Leaflet map
            this.map = L.map(this.mapContainer, {
                center: [this.initialPosition.lat, this.initialPosition.lng],
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

    setupMapEvents() {
        if (!this.map) return;

        // Map ready event
        this.map.whenReady(() => {
            console.log('🗺️ MapLayer: Map is ready');
            this.mapReady = true;
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

        // Map context menu event
        this.map.on('contextmenu', (e) => {
            e.originalEvent.preventDefault();
            this.showContextMenu(e);
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
        
        // Listen for geolocation position updates
        if (this.eventBus) {
            this.eventBus.on('geolocation:position:update', this.handlePositionUpdate.bind(this));
        }
        
        // Create initial player marker at default position
        this.createPlayerMarker(this.initialPosition);
    }

    handlePositionUpdate(position) {
        console.log('🗺️ MapLayer: Position update received:', position);
        
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
        return `
            <div style="position: relative; width: 40px; height: 40px;">
                <div style="position: absolute; top: -10px; left: -10px; width: 60px; height: 60px; background: radial-gradient(circle, #00ff0040 0%, transparent 70%); border-radius: 50%; animation: playerPulse 2s infinite;"></div>
                <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #00ff0060 0%, transparent 70%); border-radius: 50%; animation: playerGlow 2s infinite;"></div>
                <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #00ff00; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px #00ff00, 0 0 40px #00ff00;"></div>
                <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 8px rgba(0,0,0,0.9); font-weight: bold;">👤</div>
            </div>
        `;
    }

    // Context Menu Methods
    showContextMenu(e) {
        // Remove existing context menu
        this.hideContextMenu();
        
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.id = 'map-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${e.containerPoint.y}px;
            left: ${e.containerPoint.x}px;
            background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 40, 60, 0.95));
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 8px 0;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            min-width: 150px;
        `;
        
        // Add "Move Here" option
        const moveHereOption = document.createElement('div');
        moveHereOption.style.cssText = `
            padding: 12px 16px;
            color: #ffffff;
            cursor: pointer;
            transition: background-color 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        moveHereOption.innerHTML = '🚀 Move Here';
        moveHereOption.addEventListener('click', () => {
            this.teleportPlayer(e.latlng);
            this.hideContextMenu();
        });
        moveHereOption.addEventListener('mouseenter', () => {
            moveHereOption.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        moveHereOption.addEventListener('mouseleave', () => {
            moveHereOption.style.backgroundColor = 'transparent';
        });
        
        contextMenu.appendChild(moveHereOption);
        document.body.appendChild(contextMenu);
        
        // Store reference for cleanup
        this.contextMenu = contextMenu;
        
        // Hide menu when clicking elsewhere
        setTimeout(() => {
            document.addEventListener('click', this.hideContextMenu.bind(this), { once: true });
        }, 100);
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.remove();
            this.contextMenu = null;
        }
    }

    // Player Teleportation Methods
    teleportPlayer(targetPosition) {
        console.log('🚀 Teleporting player to:', targetPosition);
        
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
        const stepCount = Math.max(1, Math.floor(distance / 10)); // One marker every 10 meters
        
        const stepMarkers = [];
        
        // Create step markers
        for (let i = 1; i <= stepCount; i++) {
            const ratio = i / (stepCount + 1);
            const stepLat = fromPosition.lat + (toPosition.lat - fromPosition.lat) * ratio;
            const stepLng = fromPosition.lng + (toPosition.lng - fromPosition.lng) * ratio;
            
            const marker = this.addStepMarker({ lat: stepLat, lng: stepLng }, i);
            stepMarkers.push(marker);
        }
        
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
                    🇫🇮
                </div>
            `,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const marker = L.marker([position.lat, position.lng], { 
            icon: pathIcon,
            zIndexOffset: 600
        }).addTo(this.map);
        
        // Add popup
        marker.bindPopup(`
            <b>Path Marker</b><br>
            <small>Finnish Flag</small><br>
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
                    symbol: '🇫🇮',
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

        // Create base marker icon - SIMPLIFIED to match player marker style
        const baseIcon = L.divIcon({
            className: 'base-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <!-- Base aura -->
                    <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #ff000040 0%, transparent 70%); border-radius: 50%; animation: basePulse 2s infinite;"></div>
                    <!-- Base body -->
                    <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #ff000080;"></div>
                    <!-- Base emoji -->
                    <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        // Create marker using EXACT same method as player marker
        const marker = L.marker([position.lat, position.lng], { 
            icon: baseIcon,
            zIndexOffset: 1000  // SAME zIndexOffset as player marker
        }).addTo(this.map);

        // Add popup
        marker.bindPopup(`
            <div style="text-align: center;">
                <h3>🏗️ My Cosmic Base</h3>
                <p>Established: ${new Date().toLocaleDateString()}</p>
                <p>Level: 1</p>
            </div>
        `);

        // Store marker in SAME way as player marker
        this.markers.set('base', marker);
        
        console.log('🏗️ MapLayer: Base marker created at:', position);
        console.log('🏗️ MapLayer: Base marker zIndexOffset:', marker.options.zIndexOffset);
        console.log('🏗️ MapLayer: Base marker map reference:', marker._map);
        return marker;
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
}

// Make globally available
window.MapLayer = MapLayer;
