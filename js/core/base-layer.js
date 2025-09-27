/**
 * BaseLayer - Base class for all rendering layers
 * Provides common functionality and interface for all layers
 */
class BaseLayer {
    constructor(name) {
        this.name = name;
        this.isVisible = true;
        this.isInitialized = false;
        this.zIndex = 0;
        
        // Dependencies
        this.eventBus = null;
        this.gameState = null;
        this.canvas = null;
        this.ctx = null;
        
        // Layer-specific data
        this.data = new Map();
        this.lastRenderTime = 0;
        this.renderCount = 0;
        
        // Performance tracking
        this.performance = {
            renderTime: 0,
            renderCount: 0,
            averageRenderTime: 0
        };
    }

    /**
     * Initialize the layer
     * Override in subclasses
     */
    init() {
        this.isInitialized = true;
        console.log(`🎨 ${this.name}Layer: Initialized`);
    }

    /**
     * Render the layer
     * Override in subclasses
     * @param {number} deltaTime - Time since last render
     */
    render(deltaTime = 0) {
        if (!this.isVisible || !this.ctx) return;
        
        const startTime = performance.now();
        this.renderCount++;
        
        // Call subclass render method
        this.doRender(deltaTime);
        
        // Update performance metrics
        this.updatePerformanceMetrics(startTime);
    }

    /**
     * Actual render implementation
     * Override in subclasses
     * @param {number} deltaTime - Time since last render
     */
    doRender(deltaTime = 0) {
        // Override in subclasses
    }

    /**
     * Set visibility
     * @param {boolean} visible - Visibility state
     */
    setVisible(visible) {
        this.isVisible = visible;
        this.eventBus?.emit('layer:visibilityChanged', {
            name: this.name,
            visible: this.isVisible
        });
    }

    /**
     * Get visibility state
     * @returns {boolean} Visibility state
     */
    isVisible() {
        return this.isVisible;
    }

    /**
     * Set z-index
     * @param {number} zIndex - Z-index value
     */
    setZIndex(zIndex) {
        this.zIndex = zIndex;
    }

    /**
     * Get z-index
     * @returns {number} Z-index value
     */
    getZIndex() {
        return this.zIndex;
    }

    /**
     * Set event bus
     * @param {EventBus} eventBus - Event bus instance
     */
    setEventBus(eventBus) {
        this.eventBus = eventBus;
        this.setupEventListeners();
    }

    /**
     * Set game state
     * @param {GameState} gameState - Game state instance
     */
    setGameState(gameState) {
        this.gameState = gameState;
    }

    /**
     * Set canvas
     * @param {HTMLCanvasElement} canvas - Canvas element
     */
    setCanvas(canvas) {
        this.canvas = canvas;
    }

    /**
     * Set context
     * @param {CanvasRenderingContext2D} ctx - Canvas context
     */
    setContext(ctx) {
        this.ctx = ctx;
    }

    /**
     * Set up event listeners
     * Override in subclasses
     */
    setupEventListeners() {
        // Override in subclasses
    }

    /**
     * Update performance metrics
     * @param {number} startTime - Render start time
     */
    updatePerformanceMetrics(startTime) {
        const renderTime = performance.now() - startTime;
        this.performance.renderTime = renderTime;
        this.performance.renderCount++;
        
        // Calculate average render time
        if (this.performance.renderCount > 0) {
            this.performance.averageRenderTime = 
                (this.performance.averageRenderTime * (this.performance.renderCount - 1) + renderTime) / 
                this.performance.renderCount;
        }
    }

    /**
     * Get layer data
     * @param {string} key - Data key
     * @returns {*} Data value
     */
    getData(key) {
        return this.data.get(key);
    }

    /**
     * Set layer data
     * @param {string} key - Data key
     * @param {*} value - Data value
     */
    setData(key, value) {
        this.data.set(key, value);
    }

    /**
     * Clear layer data
     * @param {string} key - Optional specific key to clear
     */
    clearData(key = null) {
        if (key) {
            this.data.delete(key);
        } else {
            this.data.clear();
        }
    }

    /**
     * Emit an event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data = null) {
        if (this.eventBus) {
            this.eventBus.emit(event, data);
        }
    }

    /**
     * Listen for an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (this.eventBus) {
            return this.eventBus.on(event, callback);
        }
        return () => {};
    }

    /**
     * Get game state value
     * @param {string} path - Dot notation path
     * @returns {*} State value
     */
    getState(path) {
        return this.gameState ? this.gameState.get(path) : null;
    }

    /**
     * Update game state
     * @param {Object} updates - State updates
     * @param {string} source - Update source
     */
    updateState(updates, source = null) {
        if (this.gameState) {
            this.gameState.update(updates, source || this.name);
        }
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Callback function
     * @param {string} path - Optional path to watch
     * @returns {Function} Unsubscribe function
     */
    subscribeToState(callback, path = null) {
        return this.gameState ? this.gameState.subscribe(callback, path) : () => {};
    }

    /**
     * Get layer statistics
     * @returns {Object} Layer statistics
     */
    getStats() {
        return {
            name: this.name,
            isVisible: this.isVisible,
            isInitialized: this.isInitialized,
            zIndex: this.zIndex,
            renderCount: this.renderCount,
            performance: { ...this.performance },
            dataSize: this.data.size
        };
    }

    /**
     * Destroy the layer
     * Override in subclasses for cleanup
     */
    destroy() {
        this.isInitialized = false;
        this.isVisible = false;
        this.data.clear();
        this.eventBus = null;
        this.gameState = null;
        this.canvas = null;
        this.ctx = null;
        
        console.log(`🎨 ${this.name}Layer: Destroyed`);
    }

    /**
     * Convert GPS coordinates to screen coordinates
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     * @returns {Object|null} Screen coordinates {x, y}
     */
    gpsToScreen(lat, lng) {
        // This should be implemented by the map layer
        // For now, return null - will be handled by map layer
        return null;
    }

    /**
     * Convert screen coordinates to GPS coordinates
     * @param {number} x - Screen X coordinate
     * @param {number} y - Screen Y coordinate
     * @returns {Object|null} GPS coordinates {lat, lng}
     */
    screenToGps(x, y) {
        // This should be implemented by the map layer
        // For now, return null - will be handled by map layer
        return null;
    }

    /**
     * Check if a point is within the viewport
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {boolean} True if within viewport
     */
    isInViewport(x, y) {
        if (!this.canvas) return false;
        return x >= 0 && x <= this.canvas.width && y >= 0 && y <= this.canvas.height;
    }

    /**
     * Get viewport bounds
     * @returns {Object} Viewport bounds {x, y, width, height}
     */
    getViewportBounds() {
        if (!this.canvas) return { x: 0, y: 0, width: 0, height: 0 };
        return {
            x: 0,
            y: 0,
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
}

// Make BaseLayer globally available
window.BaseLayer = BaseLayer;
