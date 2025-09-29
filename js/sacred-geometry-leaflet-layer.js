/**
 * @fileoverview [IN_DEVELOPMENT] Sacred Geometry Leaflet Layer - Integration with map system
 * @status IN_DEVELOPMENT - Phase 1: Leaflet integration
 * @feature #feature-sacred-geometry-leaflet
 * @feature #feature-map-background-fix
 * @last_updated 2025-01-28
 * @dependencies Leaflet, SacredGeometryRenderer
 * @warning Sacred geometry map integration - do not modify without testing map compatibility
 * 
 * Sacred Geometry Leaflet Layer
 * Integrates sacred geometry background with Leaflet map system
 * Fixes map zoom flickering and background visibility issues
 */

console.log('🌌 Sacred Geometry Leaflet Layer script loaded!');

// Create custom Leaflet layer for sacred geometry
L.SacredGeometryLayer = L.Layer.extend({
    
    initialize: function(options) {
        L.setOptions(this, options);
        this.sacredRenderer = null;
        this.isInitialized = false;
        this.container = null;
        
        // Layer options
        this.options = {
            opacity: 0.3,
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
                maxParticles: 50,
                batteryOptimized: true
            }
        };
        
        console.log('🌌 Sacred Geometry Leaflet Layer initialized');
    },
    
    /**
     * Add layer to map
     * @status [IN_DEVELOPMENT] - Layer addition
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onAdd: function(map) {
        console.log('🌌 Adding Sacred Geometry Layer to map...');
        
        this._map = map;
        
        // Create container for sacred geometry
        this.container = L.DomUtil.create('div', 'sacred-geometry-layer');
        this.container.style.position = 'absolute';
        this.container.style.top = '0';
        this.container.style.left = '0';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.pointerEvents = 'none';
        this.container.style.zIndex = '1'; // Behind map tiles but above base background
        this.container.style.opacity = this.options.opacity;
        
        // Add to map pane
        this.getPane().appendChild(this.container);
        
        // Initialize sacred geometry renderer
        this.initializeSacredRenderer();
        
        // Set up map event listeners
        this.setupMapEventListeners();
        
        this.isInitialized = true;
        console.log('🌌 Sacred Geometry Layer added to map');
    },
    
    /**
     * Remove layer from map
     * @status [IN_DEVELOPMENT] - Layer removal
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onRemove: function(map) {
        console.log('🌌 Removing Sacred Geometry Layer from map...');
        
        // Clean up sacred renderer
        if (this.sacredRenderer) {
            this.sacredRenderer.destroy();
            this.sacredRenderer = null;
        }
        
        // Remove container
        if (this.container && this.container.parentElement) {
            this.container.parentElement.removeChild(this.container);
        }
        
        // Remove event listeners
        this.removeMapEventListeners();
        
        this.isInitialized = false;
        console.log('🌌 Sacred Geometry Layer removed from map');
    },
    
    /**
     * Initialize sacred geometry renderer
     * @status [IN_DEVELOPMENT] - Renderer initialization
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    initializeSacredRenderer: function() {
        if (!this.container) return;
        
        try {
            // Create sacred geometry renderer
            this.sacredRenderer = new window.SacredGeometryRenderer();
            
            // Configure renderer with options
            this.sacredRenderer.patterns = this.options.patterns;
            this.sacredRenderer.effects = this.options.effects;
            this.sacredRenderer.performance = this.options.performance;
            this.sacredRenderer.setColorScheme(this.options.colorScheme);
            
            // Initialize renderer
            this.sacredRenderer.init(this.container);
            
            console.log('🌌 Sacred Geometry Renderer initialized');
            
        } catch (error) {
            console.error('🌌 Failed to initialize Sacred Geometry Renderer:', error);
        }
    },
    
    /**
     * Set up map event listeners
     * @status [IN_DEVELOPMENT] - Event listeners
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    setupMapEventListeners: function() {
        if (!this._map) return;
        
        // Listen for map events to update sacred geometry
        this._map.on('zoomstart', this.onMapZoomStart, this);
        this._map.on('zoomend', this.onMapZoomEnd, this);
        this._map.on('movestart', this.onMapMoveStart, this);
        this._map.on('moveend', this.onMapMoveEnd, this);
        this._map.on('resize', this.onMapResize, this);
        
        console.log('🌌 Sacred Geometry Layer event listeners set up');
    },
    
    /**
     * Remove map event listeners
     * @status [IN_DEVELOPMENT] - Event cleanup
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    removeMapEventListeners: function() {
        if (!this._map) return;
        
        this._map.off('zoomstart', this.onMapZoomStart, this);
        this._map.off('zoomend', this.onMapZoomEnd, this);
        this._map.off('movestart', this.onMapMoveStart, this);
        this._map.off('moveend', this.onMapMoveEnd, this);
        this._map.off('resize', this.onMapResize, this);
        
        console.log('🌌 Sacred Geometry Layer event listeners removed');
    },
    
    /**
     * Handle map zoom start
     * @status [IN_DEVELOPMENT] - Zoom start handling
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onMapZoomStart: function() {
        // Reduce sacred geometry complexity during zoom for performance
        if (this.sacredRenderer) {
            this.sacredRenderer.performance.maxParticles = Math.floor(this.sacredRenderer.performance.maxParticles * 0.5);
            this.sacredRenderer.effects.particles = false; // Disable particles during zoom
        }
    },
    
    /**
     * Handle map zoom end
     * @status [IN_DEVELOPMENT] - Zoom end handling
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onMapZoomEnd: function() {
        // Restore sacred geometry complexity after zoom
        if (this.sacredRenderer) {
            this.sacredRenderer.performance.maxParticles = this.options.performance.maxParticles;
            this.sacredRenderer.effects.particles = this.options.effects.particles;
        }
    },
    
    /**
     * Handle map move start
     * @status [IN_DEVELOPMENT] - Move start handling
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onMapMoveStart: function() {
        // Optimize sacred geometry during map movement
        if (this.sacredRenderer) {
            this.sacredRenderer.effects.particles = false;
        }
    },
    
    /**
     * Handle map move end
     * @status [IN_DEVELOPMENT] - Move end handling
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onMapMoveEnd: function() {
        // Restore sacred geometry effects after map movement
        if (this.sacredRenderer) {
            this.sacredRenderer.effects.particles = this.options.effects.particles;
        }
    },
    
    /**
     * Handle map resize
     * @status [IN_DEVELOPMENT] - Resize handling
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    onMapResize: function() {
        // Resize sacred geometry canvas
        if (this.sacredRenderer) {
            this.sacredRenderer.resizeCanvas();
        }
    },
    
    /**
     * Set layer opacity
     * @status [IN_DEVELOPMENT] - Opacity control
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    setOpacity: function(opacity) {
        this.options.opacity = opacity;
        if (this.container) {
            this.container.style.opacity = opacity;
        }
    },
    
    /**
     * Set color scheme
     * @status [IN_DEVELOPMENT] - Color scheme control
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    setColorScheme: function(scheme) {
        this.options.colorScheme = scheme;
        if (this.sacredRenderer) {
            this.sacredRenderer.setColorScheme(scheme);
        }
    },
    
    /**
     * Toggle pattern visibility
     * @status [IN_DEVELOPMENT] - Pattern control
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    togglePattern: function(patternName) {
        if (this.options.patterns.hasOwnProperty(patternName)) {
            this.options.patterns[patternName] = !this.options.patterns[patternName];
            if (this.sacredRenderer) {
                this.sacredRenderer.togglePattern(patternName);
            }
        }
    },
    
    /**
     * Get layer status
     * @status [IN_DEVELOPMENT] - Status monitoring
     * @feature #feature-sacred-geometry-leaflet
     * @last_tested 2025-01-28
     */
    getStatus: function() {
        return {
            isInitialized: this.isInitialized,
            isVisible: this.options.visible,
            opacity: this.options.opacity,
            colorScheme: this.options.colorScheme,
            patterns: this.options.patterns,
            effects: this.options.effects,
            performance: this.sacredRenderer ? this.sacredRenderer.getPerformanceStats() : null
        };
    }
});

// Factory function for creating sacred geometry layer
L.sacredGeometryLayer = function(options) {
    return new L.SacredGeometryLayer(options);
};

// Add to Leaflet namespace
L.SacredGeometryLayer = L.SacredGeometryLayer;

console.log('🌌 Sacred Geometry Leaflet Layer ready for cosmic map integration!');
