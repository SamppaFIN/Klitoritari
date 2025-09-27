/**
 * MapLayer - Leaflet map rendering and display
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
        
        // Store global reference for easy access
        window.mapLayerInstance = this;
        
        // Create map container
        this.createMapContainer();
        
        // Initialize Leaflet map
        this.initializeMap();
        
        // Initialize player marker
        this.initializePlayerMarker();
        
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
        } else {
            // Create marker if it doesn't exist
            this.createPlayerMarker(position);
        }
    }

    createPlayerMarkerHTML() {
        return `
            <div style="position: relative; width: 40px; height: 40px;">
                <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #00ff004D 0%, transparent 70%); border-radius: 50%; animation: playerGlow 2s infinite;"></div>
                <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #00ff00; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 15px #00ff00;"></div>
                <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 5px rgba(0,0,0,0.8);">👤</div>
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
        this.createStepMarkers(currentPosition, targetPosition);
        
        // Add path marker at new position
        this.addPathMarker(targetPosition);
        
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
        
        // Create step markers
        for (let i = 1; i <= stepCount; i++) {
            const ratio = i / (stepCount + 1);
            const stepLat = fromPosition.lat + (toPosition.lat - fromPosition.lat) * ratio;
            const stepLng = fromPosition.lng + (toPosition.lng - fromPosition.lng) * ratio;
            
            this.addStepMarker({ lat: stepLat, lng: stepLng }, i);
        }
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
        
        console.log('👣 Added step marker', stepNumber, 'at', position);
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
        
        console.log('🇫🇮 Added path marker at', position);
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
        
        // Resume geolocation tracking if available
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            if (geolocation.resumeLocationUpdates) {
                geolocation.resumeLocationUpdates();
                console.log('📍 GPS tracking resumed');
            }
        }
        
        // Update header GPS indicator
        this.updateGPSIndicator(true);
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('gps:enabled', { reason: 'manual_toggle' });
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

// Make globally available
window.MapLayer = MapLayer;
