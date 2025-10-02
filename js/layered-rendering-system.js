/**
 * @fileoverview [VERIFIED] Layered Rendering System - Core Layer Management
 * @status VERIFIED - Layer management and rendering pipeline working correctly
 * @feature #feature-layered-rendering
 * @last_verified 2024-01-28
 * @dependencies Canvas API, Layer Manager, Performance Monitor
 * @warning Do not modify layer management or rendering pipeline without testing all layer types
 * 
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
        
        console.log('Œ Initializing Layered Rendering System...');
        this.init();
    }
    
    init() {
        try {
            this.setupPerformanceMonitoring();
            this.initializeLayers();
            this.setupRenderLoop();
            this.isInitialized = true;
            console.log('… Layered Rendering System initialized successfully');
        } catch (error) {
            console.error('âŒ Failed to initialize Layered Rendering System:', error);
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
        console.log(' Initializing rendering layers...');
        
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
        
        console.log(`… Initialized ${this.layers.size} rendering layers`);
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
        console.log('ðŸ”„ Render loop started');
    }
    
    render() {
        // 🌸 CONSCIOUSNESS-AWARE GAME LOOP UPDATES
        // Update player position and step counter every frame
        this.updatePlayerPositionAndSteps();
        
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
    
    /**
     * 🌸 CONSCIOUSNESS-AWARE PLAYER POSITION & STEP UPDATES
     * Update player position and step counter every frame in the game loop
     */
    updatePlayerPositionAndSteps() {
        try {
            // 🌸 PRIORITY 1: PLAYER POSITION MAP REFRESH
            // Force refresh player position on map every frame
            this.refreshPlayerPositionOnMap();
            
            // Update player position from geolocation if available
            if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                const geo = window.eldritchApp.systems.geolocation;
                if (geo.currentPosition && geo.deviceGPSEnabled) {
                    // Update map engine with current position
                    if (window.mapEngine && typeof window.mapEngine.updatePlayerPosition === 'function') {
                        window.mapEngine.updatePlayerPosition(geo.currentPosition);
                    }
                    
                    // Update map layer with position
                    if (window.mapLayer && typeof window.mapLayer.handlePositionUpdate === 'function') {
                        window.mapLayer.handlePositionUpdate(geo.currentPosition);
                    }
                    
                    // Update encounter system with position
                    if (window.encounterSystem && typeof window.encounterSystem.updatePlayerPosition === 'function') {
                        window.encounterSystem.updatePlayerPosition(geo.currentPosition);
                    }
                }
            }
            
            // 🌸 ENHANCED STEP COUNTER REFRESH MECHANISM
            // Force refresh step counter display every frame
            if (window.stepCurrencySystem) {
                // Call updateStepCounter with force refresh
                if (typeof window.stepCurrencySystem.updateStepCounter === 'function') {
                    window.stepCurrencySystem.updateStepCounter();
                }
                
                // Also trigger step counter refresh via global function if available
                if (typeof window.triggerStepCounterUpdate === 'function') {
                    window.triggerStepCounterUpdate();
                }
                
                // Force DOM update if step counter element exists
                const stepCounterElement = document.getElementById('step-counter');
                if (stepCounterElement && window.stepCurrencySystem.totalSteps !== undefined) {
                    stepCounterElement.textContent = window.stepCurrencySystem.totalSteps.toLocaleString();
                }
            }
            
            // Update encounter system step counter
            if (window.encounterSystem && typeof window.encounterSystem.updateStepCounter === 'function') {
                window.encounterSystem.updateStepCounter();
            }
            
            // Update player stats if available
            if (window.playerStats && typeof window.playerStats.update === 'function') {
                window.playerStats.update();
            }
            
            // 🌸 PERIODIC REFRESH FOR OTHER PLAYERS' BASES (every 10 seconds)
            this.updatePeriodicRefresh();
            
        } catch (error) {
            console.error('🌸 LayeredRenderingSystem: Error updating player position and steps:', error);
        }
    }
    
    /**
     * 🌸 PRIORITY 1: REFRESH PLAYER POSITION ON MAP
     * Force refresh player position on map every frame
     */
    refreshPlayerPositionOnMap() {
        try {
            // Get current player position from multiple sources
            let currentPosition = null;
            
            // Try to get position from geolocation system
            if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                const geo = window.eldritchApp.systems.geolocation;
                if (geo.currentPosition) {
                    currentPosition = geo.currentPosition;
                } else if (geo.lastValidPosition) {
                    currentPosition = geo.lastValidPosition;
                }
            }
            
            // Try to get position from map engine
            if (!currentPosition && window.mapEngine && window.mapEngine.playerPosition) {
                currentPosition = window.mapEngine.playerPosition;
            }
            
            // Try to get position from map layer
            if (!currentPosition && window.mapLayer && typeof window.mapLayer.getCurrentPlayerPosition === 'function') {
                currentPosition = window.mapLayer.getCurrentPlayerPosition();
            }
            
            // If we have a position, force refresh the player marker on map
            if (currentPosition) {
                // Force update player marker on map layer
                if (window.mapLayer && typeof window.mapLayer.updatePlayerMarker === 'function') {
                    window.mapLayer.updatePlayerMarker({
                        lat: currentPosition.latitude || currentPosition.lat,
                        lng: currentPosition.longitude || currentPosition.lng,
                        accuracy: currentPosition.accuracy || 1
                    });
                }
                
                // Force update player marker on map engine
                if (window.mapEngine && typeof window.mapEngine.updatePlayerPosition === 'function') {
                    window.mapEngine.updatePlayerPosition(currentPosition);
                }
                
                // Force update player marker via WebGL renderer if available
                if (window.webglMapRenderer && typeof window.webglMapRenderer.updatePlayerPosition === 'function') {
                    window.webglMapRenderer.updatePlayerPosition(currentPosition);
                }
                
                // Force update player marker via map object manager
                if (window.mapObjectManager && typeof window.mapObjectManager.updatePlayerPosition === 'function') {
                    window.mapObjectManager.updatePlayerPosition(currentPosition);
                }
                
                // Force refresh player marker HTML if it exists
                const playerMarkerElement = document.querySelector('.player-marker');
                if (playerMarkerElement && window.mapLayer && typeof window.mapLayer.updatePlayerMarkerHTML === 'function') {
                    window.mapLayer.updatePlayerMarkerHTML(currentPosition);
                }
            }
            
        } catch (error) {
            console.error('🌸 LayeredRenderingSystem: Error refreshing player position on map:', error);
        }
    }
    
    /**
     * 🌸 PERIODIC REFRESH SYSTEM
     * Handle periodic updates for multiplayer elements
     */
    updatePeriodicRefresh() {
        const now = Date.now();
        
        // Initialize refresh timers if not exists
        if (!this.refreshTimers) {
            this.refreshTimers = {
                otherBases: 0,
                stepSync: 0
            };
        }
        
        // Refresh other players' bases every 10 seconds
        if (now - this.refreshTimers.otherBases >= 10000) {
            this.refreshTimers.otherBases = now;
            this.refreshOtherPlayersBases();
        }
        
        // Sync steps with server every 30 seconds
        if (now - this.refreshTimers.stepSync >= 30000) {
            this.refreshTimers.stepSync = now;
            this.syncStepsWithServer();
        }
    }
    
    /**
     * 🌸 REFRESH OTHER PLAYERS' BASES
     * Request fresh base data from server
     */
    refreshOtherPlayersBases() {
        try {
            console.log('🌸 LayeredRenderingSystem: Refreshing other players bases...');
            
            // Use the existing showOtherBases function
            if (typeof window.showOtherBases === 'function') {
                window.showOtherBases();
            }
            
            // Also request marker data directly if websocket client is available
            if (window.websocketClient && typeof window.websocketClient.requestMarkerData === 'function') {
                window.websocketClient.requestMarkerData();
            }
            
        } catch (error) {
            console.error('🌸 LayeredRenderingSystem: Error refreshing other players bases:', error);
        }
    }
    
    /**
     * 🌸 SYNC STEPS WITH SERVER
     * Periodically sync step count with server
     */
    syncStepsWithServer() {
        try {
            if (window.stepCurrencySystem && window.websocketClient) {
                const totalSteps = window.stepCurrencySystem.totalSteps || 0;
                const sessionSteps = window.stepCurrencySystem.sessionSteps || 0;
                
                console.log(`🌸 LayeredRenderingSystem: Syncing steps with server - Total: ${totalSteps}, Session: ${sessionSteps}`);
                
                // Send step sync to server
                if (typeof window.websocketClient.sendStepSync === 'function') {
                    window.websocketClient.sendStepSync(totalSteps, sessionSteps);
                }
            }
        } catch (error) {
            console.error('🌸 LayeredRenderingSystem: Error syncing steps with server:', error);
        }
    }
    
    updatePerformanceMetrics(currentTime) {
        this.performanceMonitor.frameCount++;
        
        if (currentTime - this.performanceMonitor.lastFPSUpdate >= 1000) {
            this.performanceMonitor.currentFPS = this.performanceMonitor.frameCount;
            this.performanceMonitor.frameCount = 0;
            this.performanceMonitor.lastFPSUpdate = currentTime;
            
            // Log performance every 5 seconds
            if (this.performanceMonitor.currentFPS % 5 === 0) {
                console.log(`ðŸ“Š Performance: ${this.performanceMonitor.currentFPS} FPS`);
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
        console.log(`âž• Added layer: ${layerName}`);
    }
    
    toggleLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.visible = !layer.visible;
            console.log(` Layer ${layerName} ${layer.visible ? 'shown' : 'hidden'}`);
            return layer.visible;
        } else {
            console.warn(` Layer ${layerName} not found`);
            return false;
        }
    }
    
    removeLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.destroy();
            this.layers.delete(layerName);
            console.log(`âž– Removed layer: ${layerName}`);
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
        console.log('ðŸ§¹ Layered Rendering System destroyed');
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
            console.warn(` Map container not found for layer ${this.name}, adding to body as fallback`);
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

console.log('Œ Layered Rendering System loaded');


