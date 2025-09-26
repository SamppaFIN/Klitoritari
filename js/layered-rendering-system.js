/**
 * Layered Rendering System - Core Layer Management
 * Transforms chaos into cosmic order with proper layer separation
 * Based on ShadowComments rendering architecture
 */

class LayeredRenderingSystem {
    constructor() {
        this.layers = new Map();
        this.layerManager = null;
        this.isInitialized = false;
        this.performanceMonitor = null;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        console.log('🌌 Initializing Layered Rendering System...');
        this.init();
    }
    
    init() {
        try {
            this.setupPerformanceMonitoring();
            this.initializeLayers();
            this.setupRenderLoop();
            this.isInitialized = true;
            console.log('✅ Layered Rendering System initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Layered Rendering System:', error);
        }
    }
    
    setupPerformanceMonitoring() {
        this.performanceMonitor = {
            frameCount: 0,
            lastFPSUpdate: 0,
            currentFPS: 0,
            averageFrameTime: 0,
            frameTimes: []
        };
    }
    
    initializeLayers() {
        console.log('🎨 Initializing rendering layers...');
        
        // Layer 8: Notification System (z-index: 50)
        this.layers.set('notifications', new NotificationLayer());
        
        // Layer 7: User Interaction (z-index: 40)
        this.layers.set('interaction', new UserInteractionLayer());
        
        // Layer 6: UI Overlay (z-index: 30)
        this.layers.set('ui', new UIOverlayLayer());
        
        // Layer 6.5: UI Controls (z-index: 35) - All floating buttons and controls
        this.layers.set('uiControls', new UIControlsLayer());
        
        // Layer 5: Map Objects (z-index: 20)
        this.layers.set('mapObjects', new MapObjectsLayer());
        
        // Layer 4.5: Base Building (z-index: 15)
        this.layers.set('baseBuilding', new BaseBuildingLayer());
        
        // Layer 4: Sacred Geometry (z-index: 10) - OUR PRIORITY
        this.layers.set('sacredGeometry', new SacredGeometryLayer());
        
        // Layer 3: Map Background (z-index: 5)
        this.layers.set('mapBackground', new MapBackgroundLayer());
        
        // Layer 2: Particle Effects (z-index: 0)
        this.layers.set('particles', new ParticleEffectsLayer());
        
        // Layer 1: Base Background (z-index: -1)
        this.layers.set('background', new BaseBackgroundLayer());
        
        console.log(`✅ Initialized ${this.layers.size} rendering layers`);
    }
    
    setupRenderLoop() {
        const animate = (currentTime) => {
            const deltaTime = currentTime - this.lastFrameTime;
            
            if (deltaTime >= this.frameInterval) {
                this.render();
                this.updatePerformanceMetrics(currentTime);
                this.lastFrameTime = currentTime;
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
        console.log('🔄 Render loop started');
    }
    
    render() {
        // Render layers in z-index order
        const layerOrder = [
            'background',
            'particles', 
            'mapBackground',
            'sacredGeometry',
            'baseBuilding',
            'mapObjects',
            'ui',
            'uiControls',
            'interaction',
            'notifications'
        ];
        
        layerOrder.forEach(layerName => {
            const layer = this.layers.get(layerName);
            if (layer && layer.isVisible()) {
                layer.render();
            }
        });
    }
    
    updatePerformanceMetrics(currentTime) {
        this.performanceMonitor.frameCount++;
        
        if (currentTime - this.performanceMonitor.lastFPSUpdate >= 1000) {
            this.performanceMonitor.currentFPS = this.performanceMonitor.frameCount;
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastFPSUpdate = currentTime;
            
            // Log performance every 5 seconds
            if (this.performanceMonitor.currentFPS % 5 === 0) {
                console.log(`📊 Performance: ${this.performanceMonitor.currentFPS} FPS`);
            }
        }
    }
    
    // Layer management methods
    getLayer(layerName) {
        return this.layers.get(layerName);
    }
    
    setLayerVisible(layerName, visible) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.setVisible(visible);
        }
    }
    
    addLayer(layerName, layer) {
        this.layers.set(layerName, layer);
        console.log(`➕ Added layer: ${layerName}`);
    }
    
    toggleLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.visible = !layer.visible;
            console.log(`🎨 Layer ${layerName} ${layer.visible ? 'shown' : 'hidden'}`);
            return layer.visible;
        } else {
            console.warn(`🎨 Layer ${layerName} not found`);
            return false;
        }
    }
    
    removeLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.destroy();
            this.layers.delete(layerName);
            console.log(`➖ Removed layer: ${layerName}`);
        }
    }
    
    // Performance methods
    getPerformanceMetrics() {
        return {
            fps: this.performanceMonitor.currentFPS,
            frameTime: this.performanceMonitor.averageFrameTime,
            layers: this.layers.size
        };
    }
    
    // Cleanup
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.layers.forEach((layer, name) => {
            layer.destroy();
        });
        
        this.layers.clear();
        console.log('🧹 Layered Rendering System destroyed');
    }
}

// Base Layer Class
class RenderLayer {
    constructor(name, zIndex, pointerEvents = 'none') {
        this.name = name;
        this.zIndex = zIndex;
        this.pointerEvents = pointerEvents;
        this.canvas = null;
        this.ctx = null;
        this.visible = true;
        this.isInitialized = false;
    }
    
    init() {
        this.setupCanvas();
        this.isInitialized = true;
    }
    
    setupCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = this.zIndex.toString();
        this.canvas.style.pointerEvents = this.pointerEvents;
        
        // Set canvas size
        this.resizeCanvas();
        
        // Add to map container instead of document.body
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.appendChild(this.canvas);
        } else {
            console.warn(`🎨 Map container not found for layer ${this.name}, adding to body as fallback`);
            document.body.appendChild(this.canvas);
        }
        
        // Get context
        this.ctx = this.canvas.getContext('2d');
        
        // Handle resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        if (this.canvas) {
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                const rect = mapContainer.getBoundingClientRect();
                this.canvas.width = rect.width;
                this.canvas.height = rect.height;
            } else {
                // Fallback to window size
                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            }
        }
    }
    
    render() {
        if (!this.isInitialized || !this.visible) return;
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Override in subclasses
        this.renderContent();
    }
    
    renderContent() {
        // Override in subclasses
    }
    
    isVisible() {
        return this.visible;
    }
    
    setVisible(visible) {
        this.visible = visible;
        if (this.canvas) {
            this.canvas.style.display = visible ? 'block' : 'none';
        }
    }
    
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.canvas = null;
        this.ctx = null;
    }
}

// Export for global access
window.LayeredRenderingSystem = LayeredRenderingSystem;
window.RenderLayer = RenderLayer;

console.log('🌌 Layered Rendering System loaded');
