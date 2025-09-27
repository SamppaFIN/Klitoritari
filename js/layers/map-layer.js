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
        
        // Create map container
        this.createMapContainer();
        
        // Initialize Leaflet map
        this.initializeMap();
        
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
        // Create a container for the Leaflet map
        this.mapContainer = document.createElement('div');
        this.mapContainer.id = 'leaflet-map-container';
        this.mapContainer.style.position = 'absolute';
        this.mapContainer.style.top = '0';
        this.mapContainer.style.left = '0';
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        this.mapContainer.style.zIndex = this.zIndex;
        this.mapContainer.style.pointerEvents = 'auto'; // MapLayer handles all mouse events
        
        // Add to canvas container
        if (this.canvas.parentNode) {
            this.canvas.parentNode.appendChild(this.mapContainer);
        }
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
            if (this.eventBus) {
                this.eventBus.emit('map:contextmenu', {
                    latlng: e.latlng,
                    layerPoint: e.layerPoint,
                    containerPoint: e.containerPoint
                });
            }
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
        // Remove all markers
        this.markers.forEach((marker, id) => {
            this.removeMarker(id);
        });
        
        // Remove all overlays
        this.overlays.forEach((overlay, id) => {
            this.removeOverlay(id);
        });
        
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
}

// Make globally available
window.MapLayer = MapLayer;
