/**
 * Leaflet Layer Manager - Convert all canvas layers to Leaflet layers
 * 
 * This replaces the canvas-based layer system with pure Leaflet layers
 * for perfect synchronization with map zoom, pan, and positioning.
 * 
 * @status [IN_DEVELOPMENT] - Converting canvas layers to Leaflet layers
 * @feature #feature-leaflet-layer-conversion
 * @last_updated 2024-01-28
 */

class LeafletLayerManager {
    constructor(map) {
        this.map = map;
        this.layers = new Map();
        this.markers = new Map();
        this.polylines = new Map();
        this.circles = new Map();
        this.overlays = new Map();
        
        console.log('🗺️ LeafletLayerManager: Initializing...');
        this.init();
    }

    init() {
        console.log('🗺️ LeafletLayerManager: Setting up Leaflet layers...');
        
        // Create layer groups for different types of content
        this.createLayerGroups();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('🗺️ LeafletLayerManager: Initialized successfully');
    }

    createLayerGroups() {
        // Background effects layer (cosmic background, particles)
        this.layers.set('background', L.layerGroup());
        
        // Terrain layer (biomes, elevation)
        this.layers.set('terrain', L.layerGroup());
        
        // Territory layer (player territories, influence zones)
        this.layers.set('territory', L.layerGroup());
        
        // Path layer (player trails, waypoints)
        this.layers.set('path', L.layerGroup());
        
        // Player layer (player character, movement effects)
        this.layers.set('player', L.layerGroup());
        
        // Geolocation layer (GPS accuracy circles, location indicators)
        this.layers.set('geolocation', L.layerGroup());
        
        // Add all layers to map
        this.layers.forEach((layer, name) => {
            layer.addTo(this.map);
            console.log(`🗺️ LeafletLayerManager: Added ${name} layer to map`);
        });
    }

    setupEventListeners() {
        // Listen for map events to update layers
        this.map.on('zoomend', () => {
            this.updateLayersForZoom();
        });
        
        this.map.on('moveend', () => {
            this.updateLayersForPan();
        });
        
        this.map.on('viewreset', () => {
            this.updateLayersForViewReset();
        });
    }

    // Background Layer Methods
    addCosmicBackground() {
        const backgroundLayer = this.layers.get('background');
        
        // Create cosmic background as a large circle covering the visible area
        const cosmicBg = L.circle([0, 0], {
            radius: 10000000, // Very large radius to cover the world
            fillColor: '#0a0a0a',
            fillOpacity: 0.8,
            color: '#1a1a2e',
            weight: 0
        });
        
        cosmicBg.addTo(backgroundLayer);
        this.overlays.set('cosmic-bg', cosmicBg);
        
        console.log('🌌 LeafletLayerManager: Added cosmic background');
    }

    addParticleEffect(position, type = 'cosmic') {
        const backgroundLayer = this.layers.get('background');
        
        const particleIcon = L.divIcon({
            className: 'particle-effect',
            html: `<div class="particle-${type}">✨</div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        const particle = L.marker([position.lat, position.lng], { icon: particleIcon });
        particle.addTo(backgroundLayer);
        
        // Auto-remove after animation
        setTimeout(() => {
            backgroundLayer.removeLayer(particle);
        }, 3000);
        
        console.log(`✨ LeafletLayerManager: Added ${type} particle effect`);
    }

    // Terrain Layer Methods
    addTerrainTile(position, biome, elevation) {
        const terrainLayer = this.layers.get('terrain');
        
        const terrainIcon = L.divIcon({
            className: 'terrain-tile',
            html: `<div class="terrain-${biome}" style="opacity: ${elevation * 0.3}">🏔️</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const tile = L.marker([position.lat, position.lng], { icon: terrainIcon });
        tile.addTo(terrainLayer);
        
        this.markers.set(`terrain-${position.lat}-${position.lng}`, tile);
    }

    // Territory Layer Methods
    addTerritoryCircle(center, radius, owner, color = '#8b5cf6') {
        const territoryLayer = this.layers.get('territory');
        
        const territory = L.circle([center.lat, center.lng], {
            radius: radius,
            fillColor: color,
            fillOpacity: 0.2,
            color: color,
            weight: 2,
            dashArray: '5, 5'
        });
        
        territory.addTo(territoryLayer);
        this.circles.set(`territory-${owner}`, territory);
        
        console.log(`🏰 LeafletLayerManager: Added territory for ${owner}`);
    }

    // Path Layer Methods
    addPathTrail(positions, color = '#3b82f6', width = 3) {
        const pathLayer = this.layers.get('path');
        
        const trail = L.polyline(positions, {
            color: color,
            weight: width,
            opacity: 0.8,
            smoothFactor: 1
        });
        
        trail.addTo(pathLayer);
        this.polylines.set(`trail-${Date.now()}`, trail);
        
        console.log('🛤️ LeafletLayerManager: Added path trail');
    }

    addWaypoint(position, type = 'waypoint') {
        const pathLayer = this.layers.get('path');
        
        const waypointIcon = L.divIcon({
            className: 'waypoint-marker',
            html: `<div class="waypoint-${type}">📍</div>`,
            iconSize: [25, 25],
            iconAnchor: [12, 12]
        });
        
        const waypoint = L.marker([position.lat, position.lng], { icon: waypointIcon });
        waypoint.addTo(pathLayer);
        
        this.markers.set(`waypoint-${Date.now()}`, waypoint);
        console.log(`📍 LeafletLayerManager: Added ${type} waypoint`);
    }

    // Player Layer Methods
    addPlayerEffect(position, effectType = 'movement') {
        const playerLayer = this.layers.get('player');
        
        const effectIcon = L.divIcon({
            className: 'player-effect',
            html: `<div class="effect-${effectType}">💫</div>`,
            iconSize: [30, 30],
            iconAnchor: [15, 15]
        });
        
        const effect = L.marker([position.lat, position.lng], { icon: effectIcon });
        effect.addTo(playerLayer);
        
        // Auto-remove after effect duration
        setTimeout(() => {
            playerLayer.removeLayer(effect);
        }, 2000);
        
        console.log(`💫 LeafletLayerManager: Added ${effectType} effect`);
    }

    // Geolocation Layer Methods
    addAccuracyCircle(position, accuracy) {
        const geolocationLayer = this.layers.get('geolocation');
        
        const accuracyCircle = L.circle([position.lat, position.lng], {
            radius: accuracy,
            fillColor: '#3b82f6',
            fillOpacity: 0.1,
            color: '#3b82f6',
            weight: 1,
            dashArray: '3, 3'
        });
        
        accuracyCircle.addTo(geolocationLayer);
        this.circles.set('accuracy-circle', accuracyCircle);
        
        console.log(`📍 LeafletLayerManager: Added accuracy circle (${accuracy}m)`);
    }

    // Layer Update Methods
    updateLayersForZoom() {
        try {
            const zoom = this.map.getZoom();
            
            // For now, just log the zoom level - opacity changes can be added later
            // when we have proper layer identification system
            console.log(`🗺️ LeafletLayerManager: Updated layers for zoom level ${zoom}`);
        } catch (error) {
            console.warn('🗺️ LeafletLayerManager: Error in updateLayersForZoom:', error);
        }
    }

    updateLayersForPan() {
        // Update any pan-dependent effects
        console.log('🗺️ LeafletLayerManager: Updated layers for pan');
    }

    updateLayersForViewReset() {
        // Reset any view-dependent effects
        console.log('🗺️ LeafletLayerManager: Updated layers for view reset');
    }

    // Utility Methods
    clearLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.clearLayers();
            console.log(`🗺️ LeafletLayerManager: Cleared ${layerName} layer`);
        }
    }

    clearAllLayers() {
        this.layers.forEach((layer, name) => {
            layer.clearLayers();
        });
        this.markers.clear();
        this.polylines.clear();
        this.circles.clear();
        this.overlays.clear();
        
        console.log('🗺️ LeafletLayerManager: Cleared all layers');
    }

    // Public API
    getLayer(layerName) {
        return this.layers.get(layerName);
    }

    addToLayer(layerName, leafletObject) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.addLayer(leafletObject);
            return true;
        }
        return false;
    }

    removeFromLayer(layerName, leafletObject) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.removeLayer(leafletObject);
            return true;
        }
        return false;
    }
}

// Make globally available
window.LeafletLayerManager = LeafletLayerManager;
