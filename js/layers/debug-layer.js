/**
 * DebugLayer - Handles development tools and debugging information
 * Manages debug overlays, performance metrics, and development utilities
 */

class DebugLayer extends BaseLayer {
    constructor() {
        super('debug');
        this.zIndex = 9;
        
        // Debug state
        this.debugVisible = false;
        this.debugMode = 'minimal'; // minimal, detailed, verbose
        
        // Performance metrics
        this.performanceMetrics = {
            fps: 0,
            frameTime: 0,
            renderTime: 0,
            updateTime: 0,
            memoryUsage: 0,
            layerCount: 0,
            eventCount: 0
        };
        
        // Debug overlays
        this.overlays = {
            performance: true,
            layers: true,
            events: true,
            gameState: true,
            input: true,
            memory: true
        };
        
        // Debug data
        this.debugData = {
            layers: [],
            events: [],
            gameState: {},
            input: {},
            memory: {}
        };
        
        // Debug styling
        this.styles = {
            debug: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                borderColor: '#00ff00',
                textColor: '#00ff00',
                font: '12px monospace',
                titleFont: '14px monospace'
            },
            performance: {
                good: '#00ff00',
                warning: '#ffff00',
                bad: '#ff0000'
            }
        };
        
        // Event listeners
        this.boundDebugToggle = this.handleDebugToggle.bind(this);
        this.boundDebugModeChange = this.handleDebugModeChange.bind(this);
        this.boundOverlayToggle = this.handleOverlayToggle.bind(this);
        this.boundPerformanceUpdate = this.handlePerformanceUpdate.bind(this);
    }

    init() {
        console.log('🎨 DebugLayer: Initializing...');
        
        // Listen for events
        this.eventBus.on('debug:toggle', this.boundDebugToggle);
        this.eventBus.on('debug:mode:change', this.boundDebugModeChange);
        this.eventBus.on('debug:overlay:toggle', this.boundOverlayToggle);
        this.eventBus.on('debug:performance:update', this.boundPerformanceUpdate);
        
        // Initialize debug data collection
        this.initializeDebugData();
        
        console.log('🎨 DebugLayer: Initialized');
    }

    destroy() {
        console.log('🎨 DebugLayer: Destroying...');
        
        // Remove event listeners
        this.eventBus.off('debug:toggle', this.boundDebugToggle);
        this.eventBus.off('debug:mode:change', this.boundDebugModeChange);
        this.eventBus.off('debug:overlay:toggle', this.boundOverlayToggle);
        this.eventBus.off('debug:performance:update', this.boundPerformanceUpdate);
        
        console.log('🎨 DebugLayer: Destroyed');
    }

    doRender(deltaTime) {
        if (!this.ctx || !this.debugVisible) return;
        
        // Update debug data
        this.updateDebugData(deltaTime);
        
        // Render debug overlays
        this.renderDebugOverlays();
    }

    // Event Handlers
    handleDebugToggle(data) {
        this.debugVisible = data.visible !== undefined ? data.visible : !this.debugVisible;
        console.log('🎨 DebugLayer: Debug toggled', this.debugVisible);
    }

    handleDebugModeChange(data) {
        this.debugMode = data.mode || 'minimal';
        console.log('🎨 DebugLayer: Debug mode changed to', this.debugMode);
    }

    handleOverlayToggle(data) {
        const { overlay, visible } = data;
        if (this.overlays.hasOwnProperty(overlay)) {
            this.overlays[overlay] = visible !== undefined ? visible : !this.overlays[overlay];
            console.log(`🎨 DebugLayer: Overlay "${overlay}" toggled`, this.overlays[overlay]);
        }
    }

    handlePerformanceUpdate(data) {
        this.performanceMetrics = { ...this.performanceMetrics, ...data };
    }

    // Debug Data Management
    initializeDebugData() {
        // Initialize layer data
        this.debugData.layers = [];
        
        // Initialize event data
        this.debugData.events = [];
        
        // Initialize game state data
        this.debugData.gameState = {};
        
        // Initialize input data
        this.debugData.input = {
            lastClick: null,
            lastTouch: null,
            lastKey: null,
            mousePosition: { x: 0, y: 0 }
        };
        
        // Initialize memory data
        this.debugData.memory = {
            used: 0,
            total: 0,
            layers: 0,
            events: 0
        };
    }

    updateDebugData(deltaTime) {
        // Update performance metrics
        this.performanceMetrics.fps = Math.round(1000 / deltaTime);
        this.performanceMetrics.frameTime = deltaTime;
        
        // Update layer data
        if (this.overlays.layers) {
            this.updateLayerData();
        }
        
        // Update event data
        if (this.overlays.events) {
            this.updateEventData();
        }
        
        // Update game state data
        if (this.overlays.gameState) {
            this.updateGameStateData();
        }
        
        // Update memory data
        if (this.overlays.memory) {
            this.updateMemoryData();
        }
    }

    updateLayerData() {
        this.debugData.layers = [];
        
        // Get layer information from layer manager
        if (this.layerManager) {
            const layers = this.layerManager.getAllLayers();
            layers.forEach((layer, name) => {
                this.debugData.layers.push({
                    name: layer.name || name,
                    visible: layer.isVisible || false,
                    zIndex: layer.zIndex || 0,
                    renderTime: layer.renderTime || 0,
                    renderCount: layer.renderCount || 0
                });
            });
        }
    }

    updateEventData() {
        // Keep only recent events
        const now = Date.now();
        this.debugData.events = this.debugData.events.filter(event => 
            now - event.timestamp < 5000 // Keep 5 seconds of events
        );
    }

    updateGameStateData() {
        if (this.gameState) {
            this.debugData.gameState = {
                player: this.gameState.player || {},
                base: this.gameState.base || {},
                quest: this.gameState.quest || {},
                map: this.gameState.map || {},
                ui: this.gameState.ui || {}
            };
        }
    }

    updateMemoryData() {
        // Estimate memory usage
        this.debugData.memory = {
            used: this.estimateMemoryUsage(),
            total: this.performanceMetrics.memoryUsage || 0,
            layers: this.debugData.layers.length,
            events: this.debugData.events.length
        };
    }

    estimateMemoryUsage() {
        let usage = 0;
        
        // Estimate based on data structures
        usage += this.debugData.layers.length * 100;
        usage += this.debugData.events.length * 50;
        usage += JSON.stringify(this.debugData.gameState).length;
        
        return usage;
    }

    // Rendering Methods
    renderDebugOverlays() {
        const startY = 20;
        const lineHeight = 16;
        let currentY = startY;
        
        // Performance overlay
        if (this.overlays.performance) {
            currentY = this.renderPerformanceOverlay(currentY, lineHeight);
        }
        
        // Layers overlay
        if (this.overlays.layers) {
            currentY = this.renderLayersOverlay(currentY, lineHeight);
        }
        
        // Events overlay
        if (this.overlays.events) {
            currentY = this.renderEventsOverlay(currentY, lineHeight);
        }
        
        // Game state overlay
        if (this.overlays.gameState) {
            currentY = this.renderGameStateOverlay(currentY, lineHeight);
        }
        
        // Input overlay
        if (this.overlays.input) {
            currentY = this.renderInputOverlay(currentY, lineHeight);
        }
        
        // Memory overlay
        if (this.overlays.memory) {
            currentY = this.renderMemoryOverlay(currentY, lineHeight);
        }
    }

    renderPerformanceOverlay(y, lineHeight) {
        const x = 20;
        const width = 200;
        const height = 120;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Performance', x + 5, y + 5);
        
        // Metrics
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        // FPS
        const fpsColor = this.performanceMetrics.fps >= 55 ? this.styles.performance.good :
                        this.performanceMetrics.fps >= 30 ? this.styles.performance.warning :
                        this.styles.performance.bad;
        this.ctx.fillStyle = fpsColor;
        this.ctx.fillText(`FPS: ${this.performanceMetrics.fps}`, x + 5, currentY);
        currentY += lineHeight;
        
        // Frame time
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.fillText(`Frame: ${this.performanceMetrics.frameTime.toFixed(2)}ms`, x + 5, currentY);
        currentY += lineHeight;
        
        // Render time
        this.ctx.fillText(`Render: ${this.performanceMetrics.renderTime.toFixed(2)}ms`, x + 5, currentY);
        currentY += lineHeight;
        
        // Update time
        this.ctx.fillText(`Update: ${this.performanceMetrics.updateTime.toFixed(2)}ms`, x + 5, currentY);
        currentY += lineHeight;
        
        // Memory usage
        this.ctx.fillText(`Memory: ${this.performanceMetrics.memoryUsage}MB`, x + 5, currentY);
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    renderLayersOverlay(y, lineHeight) {
        const x = 20;
        const width = 250;
        const height = Math.min(200, this.debugData.layers.length * lineHeight + 30);
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Layers', x + 5, y + 5);
        
        // Layer info
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        this.debugData.layers.forEach(layer => {
            const color = layer.visible ? this.styles.performance.good : this.styles.performance.bad;
            this.ctx.fillStyle = color;
            this.ctx.fillText(`${layer.name}: ${layer.visible ? 'ON' : 'OFF'} (z:${layer.zIndex})`, x + 5, currentY);
            currentY += lineHeight;
        });
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    renderEventsOverlay(y, lineHeight) {
        const x = 20;
        const width = 300;
        const height = Math.min(150, this.debugData.events.length * lineHeight + 30);
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Recent Events', x + 5, y + 5);
        
        // Event info
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        this.debugData.events.slice(-10).forEach(event => {
            this.ctx.fillStyle = this.styles.debug.textColor;
            this.ctx.fillText(`${event.type}: ${event.data}`, x + 5, currentY);
            currentY += lineHeight;
        });
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    renderGameStateOverlay(y, lineHeight) {
        const x = 20;
        const width = 300;
        const height = 150;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Game State', x + 5, y + 5);
        
        // Game state info
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        Object.entries(this.debugData.gameState).forEach(([key, value]) => {
            this.ctx.fillStyle = this.styles.debug.textColor;
            this.ctx.fillText(`${key}: ${JSON.stringify(value).substring(0, 50)}...`, x + 5, currentY);
            currentY += lineHeight;
        });
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    renderInputOverlay(y, lineHeight) {
        const x = 20;
        const width = 200;
        const height = 100;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Input', x + 5, y + 5);
        
        // Input info
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        this.ctx.fillText(`Mouse: ${this.debugData.input.mousePosition.x}, ${this.debugData.input.mousePosition.y}`, x + 5, currentY);
        currentY += lineHeight;
        
        if (this.debugData.input.lastClick) {
            this.ctx.fillText(`Last Click: ${this.debugData.input.lastClick.x}, ${this.debugData.input.lastClick.y}`, x + 5, currentY);
            currentY += lineHeight;
        }
        
        if (this.debugData.input.lastTouch) {
            this.ctx.fillText(`Last Touch: ${this.debugData.input.lastTouch.x}, ${this.debugData.input.lastTouch.y}`, x + 5, currentY);
            currentY += lineHeight;
        }
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    renderMemoryOverlay(y, lineHeight) {
        const x = 20;
        const width = 200;
        const height = 100;
        
        this.ctx.save();
        
        // Background
        this.ctx.fillStyle = this.styles.debug.backgroundColor;
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = this.styles.debug.borderColor;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, width, height);
        
        // Title
        this.ctx.fillStyle = this.styles.debug.textColor;
        this.ctx.font = this.styles.debug.titleFont;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        this.ctx.fillText('Memory', x + 5, y + 5);
        
        // Memory info
        this.ctx.font = this.styles.debug.font;
        let currentY = y + 25;
        
        this.ctx.fillText(`Used: ${this.debugData.memory.used} bytes`, x + 5, currentY);
        currentY += lineHeight;
        
        this.ctx.fillText(`Layers: ${this.debugData.memory.layers}`, x + 5, currentY);
        currentY += lineHeight;
        
        this.ctx.fillText(`Events: ${this.debugData.memory.events}`, x + 5, currentY);
        
        this.ctx.restore();
        
        return y + height + 10;
    }

    // Public Methods
    toggleDebug() {
        this.handleDebugToggle({});
    }

    setDebugMode(mode) {
        this.handleDebugModeChange({ mode });
    }

    toggleOverlay(overlay) {
        this.handleOverlayToggle({ overlay });
    }

    logEvent(type, data) {
        this.debugData.events.push({
            type,
            data: JSON.stringify(data),
            timestamp: Date.now()
        });
    }

    updateInputData(inputData) {
        this.debugData.input = { ...this.debugData.input, ...inputData };
    }
}

// Make available globally
window.DebugLayer = DebugLayer;
