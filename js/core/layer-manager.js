/**
 * LayerManager - Manages the layered rendering architecture
 * Coordinates all layers in the correct order and handles rendering
 */
class LayerManager {
    constructor(eventBus, gameState) {
        this.layers = new Map();
        this.renderOrder = [
            'map'  // Only use map layer - all others converted to Leaflet layers
        ];
        
        this.isRendering = false;
        this.renderQueue = [];
        this.lastRenderTime = 0;
        this.targetFPS = 60;
        this.frameTime = 1000 / this.targetFPS;
        
        this.eventBus = eventBus;
        this.gameState = gameState;
        this.canvas = null;
        this.ctx = null;
        
        this.performance = {
            frameCount: 0,
            fps: 0,
            lastFPSUpdate: 0,
            renderTimes: []
        };
    }

    /**
     * Initialize the layer manager
     * @param {HTMLCanvasElement} canvas - Main canvas element
     */
    init(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Set up canvas
        this.setupCanvas();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start render loop
        this.startRenderLoop();
        
        console.log('🎨 LayerManager initialized');
    }

    /**
     * Set up the canvas for rendering
     */
    setupCanvas() {
        if (!this.canvas) return;
        
        // Set canvas size
        this.resizeCanvas();
        
        // Set up device pixel ratio for high-DPI displays
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Resize canvas to match container
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        }
        
        // Update viewport in game state
        if (this.gameState) {
            this.gameState.set('map.viewport', {
                width: this.canvas.width,
                height: this.canvas.height
            }, 'LayerManager');
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        if (!this.eventBus) return;
        
        // Listen for layer events
        this.eventBus.on('layer:register', (layerData) => {
            this.registerLayer(layerData.name, layerData.layer);
        });
        
        this.eventBus.on('layer:unregister', (layerName) => {
            this.unregisterLayer(layerName);
        });
        
        this.eventBus.on('layer:show', (layerName) => {
            this.showLayer(layerName);
        });
        
        this.eventBus.on('layer:hide', (layerName) => {
            this.hideLayer(layerName);
        });
        
        // Listen for render events
        this.eventBus.on('render:request', () => {
            this.requestRender();
        });
        
        this.eventBus.on('render:pause', () => {
            this.pauseRendering();
        });
        
        this.eventBus.on('render:resume', () => {
            this.resumeRendering();
        });
    }

    /**
     * Register a layer
     * @param {string} name - Layer name
     * @param {Object} layer - Layer instance
     */
    registerLayer(name, layer) {
        if (this.layers.has(name)) {
            console.warn(`🎨 LayerManager: Layer '${name}' already registered`);
            return;
        }
        
        // Set up layer dependencies
        layer.eventBus = this.eventBus;
        layer.gameState = this.gameState;
        layer.canvas = this.canvas;
        layer.ctx = this.ctx;
        
        this.layers.set(name, layer);
        
        // Initialize layer
        if (typeof layer.init === 'function') {
            layer.init();
        }
        
        console.log(`🎨 LayerManager: Registered layer '${name}'`);
        this.eventBus.emit('layer:registered', { name, layer });
    }

    /**
     * Unregister a layer
     * @param {string} name - Layer name
     */
    unregisterLayer(name) {
        if (!this.layers.has(name)) {
            console.warn(`🎨 LayerManager: Layer '${name}' not found`);
            return;
        }
        
        const layer = this.layers.get(name);
        
        // Clean up layer
        if (typeof layer.destroy === 'function') {
            layer.destroy();
        }
        
        this.layers.delete(name);
        console.log(`🎨 LayerManager: Unregistered layer '${name}'`);
        this.eventBus.emit('layer:unregistered', { name });
    }

    /**
     * Show a layer
     * @param {string} name - Layer name
     */
    showLayer(name) {
        const layer = this.layers.get(name);
        if (layer) {
            layer.setVisible(true);
            this.eventBus.emit('layer:shown', { name });
        }
    }

    /**
     * Hide a layer
     * @param {string} name - Layer name
     */
    hideLayer(name) {
        const layer = this.layers.get(name);
        if (layer) {
            layer.setVisible(false);
            this.eventBus.emit('layer:hidden', { name });
        }
    }

    /**
     * Get a layer by name
     * @param {string} name - Layer name
     * @returns {Object|null} Layer instance
     */
    getLayer(name) {
        return this.layers.get(name) || null;
    }

    /**
     * Get all layers
     * @returns {Map} All registered layers
     */
    getAllLayers() {
        return new Map(this.layers);
    }

    /**
     * Start the render loop
     */
    startRenderLoop() {
        this.isRendering = true;
        this.render();
    }

    /**
     * Stop the render loop
     */
    stopRenderLoop() {
        this.isRendering = false;
    }

    /**
     * Pause rendering
     */
    pauseRendering() {
        this.isRendering = false;
        console.log('🎨 LayerManager: Rendering paused');
    }

    /**
     * Resume rendering
     */
    resumeRendering() {
        this.isRendering = true;
        this.render();
        console.log('🎨 LayerManager: Rendering resumed');
    }

    /**
     * Request a render frame
     */
    requestRender() {
        if (!this.isRendering) return;
        
        const now = performance.now();
        if (now - this.lastRenderTime >= this.frameTime) {
            this.render();
        }
    }

    /**
     * Main render function
     */
    render() {
        if (!this.isRendering || !this.ctx) return;
        
        const startTime = performance.now();
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 🌸 CONSCIOUSNESS-AWARE GAME LOOP UPDATES
        // Update player position and step counter every frame
        this.updatePlayerPositionAndSteps();
        
        // Render layers in order
        this.renderOrder.forEach(layerName => {
            const layer = this.layers.get(layerName);
            if (layer && layer.isVisible) {
                try {
                    if (typeof layer.render === 'function') {
                        const deltaTime = startTime - this.lastRenderTime;
                        layer.render(deltaTime);
                    }
                } catch (error) {
                    console.error(`🎨 LayerManager: Error rendering layer '${layerName}':`, error);
                }
            }
        });
        
        // Update performance metrics
        this.updatePerformanceMetrics(startTime);
        
        // Update last render time
        this.lastRenderTime = startTime;
        
        // Schedule next frame
        if (this.isRendering) {
            requestAnimationFrame(() => this.render());
        }
    }

    /**
     * 🌸 CONSCIOUSNESS-AWARE PLAYER POSITION & STEP UPDATES
     * Update player position and step counter every frame in the game loop
     */
    updatePlayerPositionAndSteps() {
        try {
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
            
            // 🌸 PRIORITY 1: PLAYER POSITION MAP REFRESH
            // Force refresh player position on map every frame
            this.refreshPlayerPositionOnMap();
            
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
            console.error('🌸 LayerManager: Error updating player position and steps:', error);
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
            console.error('🌸 LayerManager: Error refreshing player position on map:', error);
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
            console.log('🌸 LayerManager: Refreshing other players bases...');
            
            // Use the existing showOtherBases function
            if (typeof window.showOtherBases === 'function') {
                window.showOtherBases();
            }
            
            // Also request marker data directly if websocket client is available
            if (window.websocketClient && typeof window.websocketClient.requestMarkerData === 'function') {
                window.websocketClient.requestMarkerData();
            }
            
        } catch (error) {
            console.error('🌸 LayerManager: Error refreshing other players bases:', error);
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
                
                console.log(`🌸 LayerManager: Syncing steps with server - Total: ${totalSteps}, Session: ${sessionSteps}`);
                
                // Send step sync to server
                if (typeof window.websocketClient.sendStepSync === 'function') {
                    window.websocketClient.sendStepSync(totalSteps, sessionSteps);
                }
            }
        } catch (error) {
            console.error('🌸 LayerManager: Error syncing steps with server:', error);
        }
    }

    /**
     * Update performance metrics
     * @param {number} startTime - Render start time
     */
    updatePerformanceMetrics(startTime) {
        const renderTime = performance.now() - startTime;
        
        this.performance.frameCount++;
        this.performance.renderTimes.push(renderTime);
        
        // Keep only last 60 frames
        if (this.performance.renderTimes.length > 60) {
            this.performance.renderTimes = this.performance.renderTimes.slice(-60);
        }
        
        // Update FPS every second
        const now = performance.now();
        if (now - this.performance.lastFPSUpdate >= 1000) {
            this.performance.fps = this.performance.frameCount;
            this.performance.frameCount = 0;
            this.performance.lastFPSUpdate = now;
            
            // Update game state with performance data
            if (this.gameState) {
                this.gameState.set('system.performance', {
                    fps: this.performance.fps,
                    renderTime: renderTime,
                    memoryUsage: this.getMemoryUsage()
                }, 'LayerManager');
            }
        }
    }

    /**
     * Get memory usage (if available)
     * @returns {number} Memory usage in MB
     */
    getMemoryUsage() {
        if (performance.memory) {
            return Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
        }
        return 0;
    }

    /**
     * Add a layer to the manager
     * @param {BaseLayer} layer - Layer to add
     */
    addLayer(layer) {
        if (!layer || typeof layer.init !== 'function') {
            console.error('🎨 LayerManager: Invalid layer provided');
            return;
        }

        // Set dependencies
        layer.eventBus = this.eventBus;
        layer.gameState = this.gameState;
        layer.canvas = this.canvas;
        layer.ctx = this.ctx;
        layer.layerManager = this;

        // Add to layers map
        this.layers.set(layer.name, layer);

        // Initialize the layer
        layer.init();

        console.log(`🎨 LayerManager: Added layer "${layer.name}" with zIndex ${layer.zIndex}`);
    }

    /**
     * Remove a layer from the manager
     * @param {string} layerName - Name of layer to remove
     */
    removeLayer(layerName) {
        const layer = this.layers.get(layerName);
        if (layer) {
            if (typeof layer.destroy === 'function') {
                layer.destroy();
            }
            this.layers.delete(layerName);
            console.log(`🎨 LayerManager: Removed layer "${layerName}"`);
        }
    }

    /**
     * Get a layer by name
     * @param {string} layerName - Name of layer to get
     * @returns {BaseLayer|null} Layer or null if not found
     */
    getLayer(layerName) {
        return this.layers.get(layerName) || null;
    }

    /**
     * Get layer manager statistics
     * @returns {Object} Statistics
     */
    getStats() {
        return {
            totalLayers: this.layers.size,
            isRendering: this.isRendering,
            targetFPS: this.targetFPS,
            currentFPS: this.performance.fps,
            averageRenderTime: this.performance.renderTimes.length > 0 
                ? this.performance.renderTimes.reduce((a, b) => a + b, 0) / this.performance.renderTimes.length 
                : 0
        };
    }

    /**
     * Destroy the layer manager
     */
    destroy() {
        this.stopRenderLoop();
        
        // Destroy all layers
        this.layers.forEach((layer, name) => {
            if (typeof layer.destroy === 'function') {
                layer.destroy();
            }
        });
        
        this.layers.clear();
        this.eventBus = null;
        this.gameState = null;
        this.canvas = null;
        this.ctx = null;
        
        console.log('🎨 LayerManager destroyed');
    }
}

// Make LayerManager globally available
window.LayerManager = LayerManager;
