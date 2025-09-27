/**
 * Eldritch Sanctuary App - New Layered Architecture
 * Main application coordinator using the new layered rendering system
 */
class EldritchSanctuaryApp {
    constructor() {
        this.isInitialized = false;
        this.isMobile = this.detectMobile();
        
        // Core systems
        this.eventBus = null;
        this.gameState = null;
        this.layerManager = null;
        
        // Mobile optimization
        this.mobileOptimizer = null;
        this.viewportCuller = null;
        this.memoryManager = null;
        
        // Canvas and rendering
        this.canvas = null;
        this.ctx = null;
        
        // Legacy systems disabled - using new layered architecture
        // this.legacySystems = {
        //     geolocation: null,
        //     mapEngine: null,
        //     welcomeScreen: null
        // };
        
        // Performance monitoring
        this.performance = {
            startTime: Date.now(),
            frameCount: 0,
            lastFPSUpdate: 0
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        // Prevent multiple initializations
        if (this.isInitialized) {
            console.log('🌌 App already initialized, skipping duplicate initialization');
            return;
        }
        
        // Direct initialization - no loading system checks
        
        const startTime = Date.now();
        console.log('🌌 STEP 1: Eldritch Sanctuary App: Starting initialization...');
        
        try {
            console.log('🌌 STEP 2: Initializing new architecture...');
            
            // Initialize core systems
            console.log('🌌 STEP 3: Initializing core systems...');
            await this.initCoreSystems();
            console.log('🌌 STEP 3 ✓: Core systems initialized');
            
            // Initialize canvas
            console.log('🌌 STEP 4: Initializing canvas...');
            await this.initCanvas();
            console.log('🌌 STEP 4 ✓: Canvas initialized');
            
            // Initialize layer manager
            console.log('🌌 STEP 5: Initializing layer manager...');
            await this.initLayerManager();
            console.log('🌌 STEP 5 ✓: Layer manager initialized');
            
            // Initialize mobile optimization
            console.log('🌌 STEP 6: Initializing mobile optimization...');
            await this.initMobileOptimization();
            console.log('🌌 STEP 6 ✓: Mobile optimization initialized');
            
            // Legacy systems disabled - using new layered architecture
            // await this.initLegacySystems();
            
            // Start the application
            console.log('🌌 STEP 7: Starting application...');
            this.start();
            
            this.isInitialized = true;
            const initTime = Date.now() - startTime;
            console.log('🌌 STEP 8 ✓: Eldritch Sanctuary App: Initialized successfully in ' + initTime + 'ms');
            
        } catch (error) {
            const errorTime = Date.now() - startTime;
            console.error('🌌 STEP X ❌: Eldritch Sanctuary App: Initialization failed after ' + errorTime + 'ms:', error);
            this.showError('Failed to initialize the cosmic map. Please refresh the page.');
        }
    }

    /**
     * Initialize core systems
     */
    async initCoreSystems() {
        console.log('🔧 Initializing core systems...');
        
        // Initialize event bus
        this.eventBus = new EventBus();
        this.eventBus.setDebugMode(true); // Enable debug mode for development
        
        // Initialize game state
        this.gameState = new GameState();
        
        // Set up global references
        window.eventBus = this.eventBus;
        window.gameState = this.gameState;
        
        console.log('🔧 Core systems initialized');
    }

    /**
     * Initialize canvas
     */
    async initCanvas() {
        console.log('🎨 Initializing canvas...');
        
        // Find or create canvas
        this.canvas = document.getElementById('game-canvas');
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.id = 'game-canvas';
            this.canvas.style.position = 'absolute';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.zIndex = '1';
            this.canvas.style.pointerEvents = 'none'; // Don't intercept events initially
            
            // Add to map container
            const mapContainer = document.getElementById('map');
            if (mapContainer) {
                mapContainer.appendChild(this.canvas);
            } else {
                document.body.appendChild(this.canvas);
            }
        }
        
        this.ctx = this.canvas.getContext('2d');
        
        // Set up canvas resize handling
        this.setupCanvasResize();
        
        console.log('🎨 Canvas initialized');
    }

    /**
     * Set up canvas resize handling
     */
    setupCanvasResize() {
        const resizeCanvas = () => {
            if (!this.canvas) return;
            
            const container = this.canvas.parentElement;
            if (container) {
                this.canvas.width = container.offsetWidth;
                this.canvas.height = container.offsetHeight;
                
                // Update game state with new viewport
                this.gameState.set('map.viewport', {
                    width: this.canvas.width,
                    height: this.canvas.height
                }, 'App');
            }
        };
        
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas(); // Initial resize
    }

    /**
     * Initialize layer manager
     */
    async initLayerManager() {
        console.log('🎨 STEP 5.1: Creating layer manager...');
        
        this.layerManager = new LayerManager(this.eventBus, this.gameState);
        this.layerManager.init(this.canvas);
        console.log('🎨 STEP 5.2 ✓: LayerManager initialized');
        
        // Add layers to the layer manager in order (lowest z-index first)
        console.log('🎨 STEP 5.3: Adding layers...');
        
        if (window.BackgroundLayer) {
            const backgroundLayer = new BackgroundLayer();
            this.layerManager.addLayer(backgroundLayer);
            console.log('🎨 STEP 5.4 ✓: Added BackgroundLayer');
        }
        
        if (window.TerrainLayer) {
            const terrainLayer = new TerrainLayer();
            this.layerManager.addLayer(terrainLayer);
            console.log('🎨 STEP 5.5 ✓: Added TerrainLayer');
        }
        
        if (window.TerritoryLayer) {
            const territoryLayer = new TerritoryLayer();
            this.layerManager.addLayer(territoryLayer);
            console.log('🎨 STEP 5.6 ✓: Added TerritoryLayer');
        }
        
        if (window.PathLayer) {
            const pathLayer = new PathLayer();
            this.layerManager.addLayer(pathLayer);
            console.log('🎨 STEP 5.7 ✓: Added PathLayer');
        }
        
        if (window.MapLayer) {
            const mapLayer = new MapLayer();
            this.layerManager.addLayer(mapLayer);
            console.log('🎨 STEP 5.8 ✓: Added MapLayer');
        }
        
        if (window.InteractionLayer) {
            const interactionLayer = new InteractionLayer();
            this.layerManager.addLayer(interactionLayer);
            console.log('🎨 STEP 5.9 ✓: Added InteractionLayer');
        }
        
        if (window.PlayerLayer) {
            const playerLayer = new PlayerLayer();
            this.layerManager.addLayer(playerLayer);
            console.log('🎨 STEP 5.10 ✓: Added PlayerLayer');
        }
        
        if (window.InformationLayer) {
            const informationLayer = new InformationLayer();
            this.layerManager.addLayer(informationLayer);
            console.log('🎨 STEP 5.11 ✓: Added InformationLayer');
        }
        
        if (window.UILayer) {
            const uiLayer = new UILayer();
            this.layerManager.addLayer(uiLayer);
            console.log('🎨 STEP 5.12 ✓: Added UILayer');
        }
        
        if (window.DebugLayer) {
            const debugLayer = new DebugLayer();
            this.layerManager.addLayer(debugLayer);
            console.log('🎨 STEP 5.13 ✓: Added DebugLayer');
        }
        
        if (window.GeolocationLayer) {
            console.log('🎨 STEP 5.14: GeolocationLayer class found, creating instance...');
            const geolocationLayer = new GeolocationLayer();
            this.layerManager.addLayer(geolocationLayer);
            console.log('🎨 STEP 5.14 ✓: Added GeolocationLayer');
        } else {
            console.error('🎨 STEP 5.14 ❌: GeolocationLayer class not found!');
        }
        
        // Add Three.js UI Layer
        if (window.ThreeJSUILayer) {
            console.log('🎨 STEP 5.15: ThreeJSUILayer class found, creating instance...');
            const threejsUILayer = new ThreeJSUILayer();
            this.layerManager.addLayer(threejsUILayer);
            console.log('🎨 STEP 5.15 ✓: Added ThreeJSUILayer');
        } else {
            console.error('🎨 STEP 5.15 ❌: ThreeJSUILayer class not found!');
            console.log('🎨 Available classes:', Object.keys(window).filter(key => key.includes('Layer')));
        }
        
        console.log('🎨 STEP 5.15 ✓: Layer manager initialization complete');
    }

    /**
     * Initialize mobile optimization systems
     */
    async initMobileOptimization() {
        console.log('📱 Initializing mobile optimization...');
        
        // Initialize mobile optimizer
        if (window.MobileOptimizer) {
            this.mobileOptimizer = new MobileOptimizer();
            console.log('📱 Mobile optimizer initialized');
        }
        
        // Initialize viewport culler
        if (window.ViewportCuller) {
            this.viewportCuller = new ViewportCuller();
            console.log('📱 Viewport culler initialized');
        }
        
        // Initialize memory manager
        if (window.MemoryManager) {
            this.memoryManager = new MemoryManager();
            console.log('📱 Memory manager initialized');
        }
        
        // Set up mobile-specific event listeners
        this.setupMobileEventListeners();
        
        console.log('📱 Mobile optimization initialized');
    }

    /**
     * Set up mobile-specific event listeners
     */
    setupMobileEventListeners() {
        if (!this.eventBus) return;
        
        // Listen for mobile optimization events
        this.eventBus.on('mobile:quality:reduce', (data) => {
            console.log('📱 Reducing quality for mobile optimization');
            this.adjustLayerQuality('low');
        });
        
        this.eventBus.on('mobile:quality:increase', (data) => {
            console.log('📱 Increasing quality for mobile optimization');
            this.adjustLayerQuality('balanced');
        });
        
        this.eventBus.on('mobile:memory:pressure', (data) => {
            console.log('📱 Memory pressure detected, triggering cleanup');
            if (this.memoryManager) {
                this.memoryManager.forceCleanup();
            }
        });
        
        this.eventBus.on('mobile:pause', () => {
            console.log('📱 Pausing mobile optimizations');
            // Don't call pauseMobileOptimizations() here to avoid infinite loop
            // The mobile optimizer already handles the pause internally
        });
        
        // Removed mobile:resume event listener to prevent infinite loop
        // this.eventBus.on('mobile:resume', () => {
        //     console.log('📱 Resuming mobile optimizations');
        //     this.resumeMobileOptimizations();
        // });
    }

    /**
     * Adjust layer quality based on mobile optimization
     * @param {string} quality - Quality level (low, balanced, high)
     */
    adjustLayerQuality(quality) {
        if (!this.layerManager) return;
        
        // Emit quality adjustment event to all layers
        this.eventBus.emit('layer:quality:adjust', {
            quality,
            isMobile: this.isMobile,
            targetFPS: this.mobileOptimizer ? this.mobileOptimizer.targetFPS : 60
        });
    }

    /**
     * Pause mobile optimizations
     */
    pauseMobileOptimizations() {
        if (this.mobileOptimizer) {
            this.mobileOptimizer.pauseOptimizations();
        }
    }

    /**
     * Resume mobile optimizations
     */
    resumeMobileOptimizations() {
        if (this.mobileOptimizer) {
            this.mobileOptimizer.resumeOptimizations();
        }
    }

    /**
     * Initialize legacy systems (temporary)
     */
    async initLegacySystems() {
        console.log('🔄 Legacy systems disabled - using new layered architecture');
        
        // All legacy systems disabled to prevent conflicts
        // The new layered architecture handles all functionality
        
        console.log('🔄 Legacy systems disabled');
    }

    /**
     * Start the application
     */
    start() {
        console.log('🚀 Starting application...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Listen for GPS enabled event to enable canvas interactions
        this.eventBus.on('gps:enabled', () => {
            this.enableCanvasInteractions();
        });
        
        // Initialize welcome screen
        this.initWelcomeScreen();
        
        // Update game state
        this.gameState.update({
            system: {
                isInitialized: true,
                isPaused: false,
                lastUpdate: Date.now()
            }
        }, 'App');
        
        // Emit app started event
        this.eventBus.emit('app:started', {
            timestamp: Date.now(),
            isMobile: this.isMobile
        });
        
        console.log('🚀 Application started');
    }

    enableCanvasInteractions() {
        console.log('🎮 Enabling canvas interactions...');
        if (this.canvas) {
            this.canvas.style.pointerEvents = 'auto';
            console.log('🎮 Canvas interactions enabled');
        }
    }

    initWelcomeScreen() {
        console.log('🌟 Initializing welcome screen for GPS button...');
        
        // Check if WelcomeScreen class is available
        if (window.WelcomeScreen) {
            try {
                this.welcomeScreen = new WelcomeScreen();
                this.welcomeScreen.init();
                console.log('🌟 Welcome screen initialized successfully');
            } catch (error) {
                console.error('🌟 Failed to initialize welcome screen:', error);
            }
        } else {
            console.warn('🌟 WelcomeScreen class not available');
        }
    }

    /**
     * Initialize game (legacy compatibility method)
     * This method is called by the welcome screen
     */
    initializeGame() {
        console.log('🎮 Legacy initializeGame called - app already initialized');
        // The app is already initialized, so we don't need to do anything
        // This method exists for compatibility with the welcome screen
        return Promise.resolve();
    }

    /**
     * Start NPC simulation (legacy compatibility method)
     * This method is called by the welcome screen
     */
    startNPCSimulation() {
        console.log('👥 Legacy startNPCSimulation called - not implemented in new architecture yet');
        // This method exists for compatibility with the welcome screen
        // NPC simulation will be implemented in the new layer system
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for app events
        this.eventBus.on('app:pause', () => {
            this.pause();
        });
        
        this.eventBus.on('app:resume', () => {
            this.resume();
        });
        
        this.eventBus.on('app:shutdown', () => {
            this.shutdown();
        });
        
        // Listen for performance events
        this.eventBus.on('performance:report', (data) => {
            this.handlePerformanceReport(data);
        });
    }

    /**
     * Pause the application
     */
    pause() {
        console.log('⏸️ Application paused');
        this.gameState.set('system.isPaused', true, 'App');
        this.eventBus.emit('app:paused');
    }

    /**
     * Resume the application
     */
    resume() {
        console.log('▶️ Application resumed');
        this.gameState.set('system.isPaused', false, 'App');
        this.eventBus.emit('app:resumed');
    }

    /**
     * Shutdown the application
     */
    shutdown() {
        console.log('🛑 Application shutting down...');
        
        // Stop layer manager
        if (this.layerManager) {
            this.layerManager.destroy();
        }
        
        // Clean up mobile optimization systems
        if (this.mobileOptimizer) {
            this.mobileOptimizer.destroy();
        }
        if (this.viewportCuller) {
            this.viewportCuller.destroy();
        }
        if (this.memoryManager) {
            this.memoryManager.destroy();
        }
        
        // Legacy systems disabled - no cleanup needed
        // Object.values(this.legacySystems).forEach(system => {
        //     if (system && typeof system.destroy === 'function') {
        //         system.destroy();
        //     }
        // });
        
        // Clear references
        this.eventBus = null;
        this.gameState = null;
        this.layerManager = null;
        this.mobileOptimizer = null;
        this.viewportCuller = null;
        this.memoryManager = null;
        this.canvas = null;
        this.ctx = null;
        
        this.isInitialized = false;
        console.log('🛑 Application shutdown complete');
    }

    /**
     * Handle performance reports
     * @param {Object} data - Performance data
     */
    handlePerformanceReport(data) {
        this.performance.frameCount++;
        
        // Update FPS every second
        const now = Date.now();
        if (now - this.performance.lastFPSUpdate >= 1000) {
            const fps = this.performance.frameCount;
            this.performance.frameCount = 0;
            this.performance.lastFPSUpdate = now;
            
            // Update game state
            this.gameState.set('system.performance.fps', fps, 'App');
            
            // Log performance in debug mode
            if (this.eventBus.debugMode) {
                console.log(`📊 Performance: ${fps} FPS`);
            }
        }
    }

    /**
     * Show error message
     * @param {string} message - Error message
     */
    showError(message) {
        console.error('❌ Application Error:', message);
        
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ff4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            text-align: center;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        errorDiv.innerHTML = `
            <h3>❌ Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" style="
                background: white;
                color: #ff4444;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            ">Reload Page</button>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Detect mobile device
     * @returns {boolean} True if mobile device
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }

    /**
     * Get application statistics
     * @returns {Object} Application statistics
     */
    getStats() {
        return {
            isInitialized: this.isInitialized,
            isMobile: this.isMobile,
            uptime: Date.now() - this.performance.startTime,
            performance: this.performance,
            layerManager: this.layerManager ? this.layerManager.getStats() : null,
            gameState: this.gameState ? this.gameState.getStats() : null,
            eventBus: this.eventBus ? this.eventBus.getStats() : null
        };
    }
}

// Make app globally available
window.EldritchSanctuaryApp = EldritchSanctuaryApp;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌌 Initializing Eldritch Sanctuary with direct initialization...');
    
    // Initialize app directly - no loading system complexity
    const app = new EldritchSanctuaryApp();
    app.init().then(() => {
        console.log('🌌 New architecture initialization complete');
        window.eldritchApp = app; // Make globally available
    }).catch((error) => {
        console.error('🌌 New architecture initialization failed:', error);
    });
});
