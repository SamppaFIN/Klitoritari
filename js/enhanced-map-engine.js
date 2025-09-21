/**
 * Enhanced Map Engine with WebGL Integration
 * Combines Leaflet map functionality with high-performance WebGL rendering
 * Provides smooth LOD transitions and GPU-accelerated object rendering
 */

class EnhancedMapEngine extends MapEngine {
    constructor() {
        super();
        
        this.webglRenderer = null;
        this.webglIntegration = null;
        this.webglEnabled = false;
        
        this.initWebGL();
    }
    
    initWebGL() {
        try {
            // Initialize WebGL renderer
            this.webglRenderer = new WebGLMapRenderer();
            
            // Initialize integration layer
            this.webglIntegration = new WebGLMapIntegration(this, this.webglRenderer);
            
            console.log('🌌 Enhanced Map Engine with WebGL support initialized');
            
        } catch (error) {
            console.warn('🌌 WebGL initialization failed, falling back to DOM rendering:', error);
            this.webglEnabled = false;
        }
    }
    
    // Performance monitoring removed - WebGL is now forced
    
    // Override parent init to include WebGL setup
    init() {
        super.init();
        
        // Set up WebGL controls
        this.setupWebGLControls();
        
        // Force WebGL rendering mode
        this.forceWebGLRendering();
        console.log('🌌 WebGL rendering forced on');
    }
    
    setupWebGLControls() {
        // Add WebGL toggle button to header
        const header = document.getElementById('header');
        if (header) {
            const webglToggle = document.createElement('button');
            webglToggle.id = 'webgl-toggle';
            webglToggle.className = 'sacred-button';
            webglToggle.innerHTML = '🌌 WebGL';
            webglToggle.style.cssText = `
                background: var(--cosmic-purple);
                color: white;
                border: 2px solid var(--cosmic-purple);
                padding: 8px 16px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 12px;
                margin-left: 10px;
            `;
            
            webglToggle.addEventListener('click', () => {
                this.toggleWebGLRendering();
            });
            
            header.appendChild(webglToggle);
        }
    }
    
    // Performance panel removed - WebGL is now forced
    
    toggleWebGLRendering() {
        if (this.webglIntegration) {
            this.webglIntegration.toggleWebGLRendering();
            this.webglEnabled = this.webglIntegration.isEnabled;
            
            // Update button appearance
            const webglToggle = document.getElementById('webgl-toggle');
            if (webglToggle) {
                if (this.webglEnabled) {
                    webglToggle.style.background = 'var(--cosmic-green)';
                    webglToggle.style.borderColor = 'var(--cosmic-green)';
                    webglToggle.innerHTML = '🌌 WebGL ✓';
                } else {
                    webglToggle.style.background = 'var(--cosmic-purple)';
                    webglToggle.style.borderColor = 'var(--cosmic-purple)';
                    webglToggle.innerHTML = '🌌 WebGL';
                }
            }
        }
    }
    
    enableWebGLRendering() {
        if (this.webglIntegration && !this.webglEnabled) {
            this.webglIntegration.enableWebGLRendering();
            this.webglEnabled = true;
        }
    }
    
    enableDOMRendering() {
        if (this.webglIntegration && this.webglEnabled) {
            this.webglIntegration.disableWebGLRendering();
            this.webglEnabled = false;
        }
    }
    
    forceWebGLRendering() {
        this.enableWebGLRendering();
        console.log('🌌 Forced WebGL rendering mode');
    }
    
    forceDOMRendering() {
        this.enableDOMRendering();
        console.log('🌌 Forced DOM rendering mode');
    }
    
    // Override marker creation methods to work with both rendering modes
    updatePlayerPosition(position) {
        super.updatePlayerPosition(position);
        
        // Update WebGL object if enabled
        if (this.webglEnabled && this.webglIntegration) {
            this.webglIntegration.updatePlayerPosition(position);
        }
    }
    
    updateOtherPlayer(player) {
        super.updateOtherPlayer(player);
        
        // Update WebGL object if enabled
        if (this.webglEnabled && this.webglIntegration) {
            this.webglIntegration.updateOtherPlayer(player);
        }
    }
    
    addInvestigationMarker(investigation) {
        super.addInvestigationMarker(investigation);
        
        // Add WebGL object if enabled
        if (this.webglEnabled && this.webglIntegration) {
            this.webglIntegration.addInvestigationMarker(investigation);
        }
    }
    
    // Enhanced marker creation with LOD support
    createLODMarker(latlng, options) {
        const marker = L.marker(latlng, options);
        
        // Add LOD properties
        marker.lodData = {
            minZoom: options.minZoom || 10,
            maxZoom: options.maxZoom || 20,
            size: options.size || 20,
            color: options.color || '#6a0dad',
            animation: options.animation || 'none'
        };
        
        return marker;
    }
    
    // Get current rendering mode
    getRenderingMode() {
        return this.webglEnabled ? 'webgl' : 'dom';
    }
    
    // Cleanup method
    destroy() {
        // Clean up WebGL resources
        if (this.webglRenderer) {
            this.webglRenderer.destroy();
        }
        
        // Remove WebGL toggle button
        const webglToggle = document.getElementById('webgl-toggle');
        if (webglToggle) {
            webglToggle.remove();
        }
        
        // Call parent destroy
        super.destroy();
    }
}

// Export for use in other modules
window.EnhancedMapEngine = EnhancedMapEngine;
