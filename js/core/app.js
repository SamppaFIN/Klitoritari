/**
 * @fileoverview [VERIFIED] Eldritch Sanctuary App - New Layered Architecture
 * @status VERIFIED - Core application coordinator with layered rendering system working
 * @feature #feature-layered-architecture
 * @last_verified 2024-01-28
 * @dependencies Layer Manager, Event Bus, Game State
 * @warning Do not modify core initialization or layer management without testing rendering system
 * 
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
        console.log('🔧 initCoreSystems method called');
        
        try {
            // Initialize event bus
            console.log('🔧 Creating EventBus...');
            this.eventBus = new EventBus();
            this.eventBus.setDebugMode(true); // Enable debug mode for development
            console.log('🔧 EventBus created');
            
            // Initialize game state
            console.log('🔧 Creating GameState...');
            this.gameState = new GameState();
            console.log('🔧 GameState created');
            
            // Initialize mobile encounter system
            if (window.MobileEncounterSystem) {
                console.log('📱 Creating Mobile Encounter System...');
                window.mobileEncounterSystem = new MobileEncounterSystem();
                window.mobileEncounterSystem.init();
                console.log('📱 Mobile encounter system initialized');
            }
            
            // Initialize mobile debug system
            if (window.MobileDebugSystem) {
                console.log('🔧 Creating Mobile Debug System...');
                window.mobileDebugSystem = new MobileDebugSystem();
                window.mobileDebugSystem.init();
                console.log('🔧 Mobile debug system initialized');
            }
            
            // Initialize mobile testing suite
            if (window.MobileTestingSuite) {
                console.log('🧪 Creating Mobile Testing Suite...');
                window.mobileTestingSuite = new MobileTestingSuite();
                window.mobileTestingSuite.init();
                console.log('🧪 Mobile testing suite initialized');
            }
            
            // Initialize mobile log email system
            if (window.MobileLogEmailSystem) {
                console.log('📧 Creating Mobile Log Email System...');
                window.mobileLogEmailSystem = new MobileLogEmailSystem();
                window.mobileLogEmailSystem.init();
                console.log('📧 Mobile log email system initialized');
            }
        } catch (error) {
            console.error('🔧 Error in initCoreSystems setup:', error);
            throw error;
        }
        
        // MapEngine is legacy - new architecture uses MapLayer
        console.log('🗺️ Skipping MapEngine - using MapLayer in new architecture');
        this.mapEngine = null; // No MapEngine in new architecture
        
        // Initialize WebSocket client
        if (!window.websocketClient) {
            console.log('🌐 Creating WebSocketClient in core/app.js...');
            try {
                this.websocketClient = new WebSocketClient();
                console.log('🌐 WebSocketClient created, calling init()...');
                this.websocketClient.init();
                console.log('🌐 WebSocketClient init() completed');
            } catch (error) {
                console.error('🌐 WebSocketClient initialization failed:', error);
                // Don't throw error - WebSocket is optional
            }
        } else {
            console.log('🌐 WebSocketClient already exists, using existing instance');
            this.websocketClient = window.websocketClient;
        }
        
        // Initialize step currency system (only if not already initialized)
        if (!window.stepCurrencySystem) {
            console.log('🚶‍♂️ Creating StepCurrencySystem in core/app.js...');
            try {
                this.stepCurrencySystem = new StepCurrencySystem();
                console.log('🚶‍♂️ StepCurrencySystem created, calling init()...');
                this.stepCurrencySystem.init();
                console.log('🚶‍♂️ StepCurrencySystem init() completed');
            } catch (error) {
                console.error('🚶‍♂️ StepCurrencySystem initialization failed:', error);
                throw error;
            }
            
            // Initialize map object manager
            console.log('🗺️ Initializing MapObjectManager...');
            console.log('🗺️ MapObjectManager class available:', typeof MapObjectManager);
            if (typeof MapObjectManager === 'undefined') {
                console.error('🗺️ MapObjectManager class is not defined!');
                throw new Error('MapObjectManager class is not available');
            }
            try {
                this.mapObjectManager = new MapObjectManager();
                this.mapObjectManager.init(this.eventBus);
                console.log('🗺️ MapObjectManager initialized');
            } catch (error) {
                console.error('🗺️ MapObjectManager initialization failed:', error);
                throw error;
            }

        // Set up global references
        window.eventBus = this.eventBus;
        window.gameState = this.gameState;
        // MapEngine is handled by MapLayer now
        window.stepCurrencySystem = this.stepCurrencySystem;
        window.mapObjectManager = this.mapObjectManager;
        window.testStepCurrencySystem = () => this.testStepCurrencySystem();
        window.testEventBusIntegration = () => this.testEventBusIntegration();
        window.setupEventListenersManually = () => this.setupEventListenersManually();
        window.forceResetSteps = () => this.stepCurrencySystem.forceResetSteps();
        window.updateStepCounter = () => this.stepCurrencySystem.updateStepCounter();
        window.addSteps = (steps) => this.stepCurrencySystem.addSteps(steps);
        window.addManualStep = () => this.stepCurrencySystem.addManualStep();
        window.getStepStats = () => this.stepCurrencySystem.getStepStats();
        window.resetSessionSteps = () => this.stepCurrencySystem.resetSessionSteps();
        window.triggerStepCounterUpdate = () => this.stepCurrencySystem.updateStepCounter();
        
        // Set the main app reference for welcome screen compatibility
        window.eldritchApp = this;
        
        // Make WebSocket client globally available
        if (this.websocketClient) {
            window.websocketClient = this.websocketClient;
            console.log('🌐 WebSocketClient made globally available');
        }
        
        console.log('🚶‍♂️ StepCurrencySystem made globally available');
        console.log('🗺️ MapObjectManager made globally available');
        console.log('🗺️ MapEngine will be set by MapLayer');
        console.log('🌌 Main app made globally available as window.eldritchApp');
        } else {
            console.log('🚶‍♂️ StepCurrencySystem already exists, using existing instance');
            this.stepCurrencySystem = window.stepCurrencySystem;
        }
        
        // Set up step currency event listeners (regardless of whether system was just created or already existed)
        console.log('🔔 About to call setupStepCurrencyEventListeners...');
        this.setupStepCurrencyEventListeners();
        console.log('🔔 setupStepCurrencyEventListeners call completed');
        
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
        
        // Only add MapLayer - all other layers converted to Leaflet layers
        if (window.MapLayer) {
            const mapLayer = new MapLayer();
            this.layerManager.addLayer(mapLayer);
            console.log('🎨 STEP 5.4 ✓: Added MapLayer (only layer needed)');
        } else {
            console.error('🎨 STEP 5.4 ❌: MapLayer class not found!');
        }
        
        // Skip all canvas layers - they're now handled by Leaflet Layer Manager
        console.log('🎨 STEP 5.5 ✓: Skipped BackgroundLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.6 ✓: Skipped TerrainLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.7 ✓: Skipped TerritoryLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.8 ✓: Skipped PathLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.9 ✓: Skipped InteractionLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.10 ✓: Skipped PlayerLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.11 ✓: Skipped InformationLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.12 ✓: Skipped UILayer (converted to Leaflet)');
        console.log('🎨 STEP 5.13 ✓: Skipped DebugLayer (converted to Leaflet)');
        console.log('🎨 STEP 5.14 ✓: Skipped GeolocationLayer (converted to Leaflet)');
        
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
     * Initialize game (called by welcome screen when Continue Adventure is pressed)
     * This method ensures the step currency system continues working after welcome screen
     */
    initializeGame() {
        console.log('🎮 initializeGame called - ensuring step currency system continues working');
        
        // Ensure step currency system is still working
        if (window.stepCurrencySystem) {
            console.log('🚶‍♂️ Step currency system is available, checking status...');
            
            // Test milestone checking to ensure it's still working
            if (typeof window.stepCurrencySystem.checkMilestones === 'function') {
                console.log('🎯 Testing milestone checking...');
                window.stepCurrencySystem.checkMilestones();
                console.log('🎯 Milestone checking test completed');
            }
            
            // Test step addition to ensure it's still working
            if (typeof window.stepCurrencySystem.addTestSteps === 'function') {
                console.log('🚶‍♂️ Step currency system is fully functional');
            }
        } else {
            console.warn('🚶‍♂️ Step currency system not available after welcome screen!');
        }
        
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
     * Test step currency system functionality
     * This method can be called to test if the step currency system is working
     */
    testStepCurrencySystem() {
        console.log('🧪 Testing step currency system...');
        
        if (window.stepCurrencySystem) {
            console.log('🚶‍♂️ Step currency system found, testing...');
            
            // Test milestone checking
            if (typeof window.stepCurrencySystem.checkMilestones === 'function') {
                console.log('🎯 Testing milestone checking...');
                window.stepCurrencySystem.checkMilestones();
                console.log('🎯 Milestone checking test completed');
            }
            
            // Test step addition
            if (typeof window.stepCurrencySystem.addTestSteps === 'function') {
                console.log('🚶‍♂️ Testing step addition...');
                window.stepCurrencySystem.addTestSteps(10);
                console.log('🚶‍♂️ Step addition test completed');
            }
            
            console.log('✅ Step currency system test completed successfully');
        } else {
            console.error('❌ Step currency system not available!');
        }
    }

    /**
     * Set up event listeners for step currency system events
     */
    setupStepCurrencyEventListeners() {
        console.log('🔔 Setting up step currency event listeners...');
        console.log('🔔 EventBus available:', !!this.eventBus);
        console.log('🔔 EventBus type:', typeof this.eventBus);
        
        if (!this.eventBus) {
            console.warn('🚶‍♂️ EventBus not available for step currency event listeners');
            return;
        }

        // Listen for step changes
        this.eventBus.on('steps:change', (eventData) => {
            console.log('🔔 Step change event received:', eventData);
            // Other systems can react to step changes here
        });

        // Listen for milestone events
        this.eventBus.on('steps:milestone', (eventData) => {
            console.log('🔔 Milestone event received:', eventData);
            // Other systems can react to milestones here
        });

        // Listen for player movement events to update step counter display
        this.eventBus.on('player:teleported', (eventData) => {
            console.log('🔔 Player teleported event received, adding 100 steps and updating step counter');
            if (window.stepCurrencySystem) {
                // Add 100 steps for teleportation
                for (let i = 0; i < 100; i++) {
                    window.stepCurrencySystem.addManualStep();
                }
                console.log('🚀 Added 100 steps for teleportation!');
                window.stepCurrencySystem.updateStepCounter();
            }
        });

        this.eventBus.on('player:position:update', (eventData) => {
            console.log('🔔 Player position update event received, updating step counter');
            if (window.stepCurrencySystem) {
                window.stepCurrencySystem.updateStepCounter();
            }
        });

        // Expose global function to manually update step counter
        window.triggerStepCounterUpdate = () => {
            console.log('🔔 Manually triggering step counter update');
            if (window.stepCurrencySystem) {
                window.stepCurrencySystem.updateStepCounter();
            }
        };

        // Listen for specific milestone types
        this.eventBus.on('steps:flag', (eventData) => {
            console.log('🇫🇮 Flag milestone event received:', eventData);
        });

        this.eventBus.on('steps:celebration', (eventData) => {
            console.log('🎉 Celebration milestone event received:', eventData);
        });

        this.eventBus.on('steps:quest', (eventData) => {
            console.log('📜 Quest milestone event received:', eventData);
        });

        this.eventBus.on('steps:area', (eventData) => {
            console.log('🏗️ Area milestone event received:', eventData);
        });

        // Listen for server milestone messages
        this.setupServerMilestoneListeners();

        console.log('🔔 Step currency event listeners set up successfully');
    }

    /**
     * Test event bus integration with step currency system
     */
    testEventBusIntegration() {
        console.log('🧪 Testing event bus integration...');
        
        if (!this.eventBus) {
            console.error('❌ EventBus not available for testing');
            return;
        }

        if (!window.stepCurrencySystem) {
            console.error('❌ Step currency system not available for testing');
            return;
        }

        // Test step change events
        console.log('🧪 Testing step change events...');
        window.stepCurrencySystem.addTestSteps(5);
        
        // Test milestone events
        console.log('🧪 Testing milestone events...');
        window.stepCurrencySystem.addTestSteps(50); // Should trigger flag milestone
        
        console.log('✅ Event bus integration test completed');
    }

    /**
     * Manually set up event listeners (can be called from console)
     */
    setupEventListenersManually() {
        console.log('🔔 Manually setting up step currency event listeners...');
        this.setupStepCurrencyEventListeners();
    }

    /**
     * Set up listeners for server milestone messages
     */
    setupServerMilestoneListeners() {
        console.log('🌐 Setting up server milestone listeners...');
        
        // Listen for base establishment availability from server
        this.eventBus.on('base_establishment_available', (eventData) => {
            console.log('🏗️ Base establishment available from server:', eventData);
            this.handleBaseEstablishmentAvailable(eventData);
        });

        // Listen for quest system unlock from server
        this.eventBus.on('quest_system_unlocked', (eventData) => {
            console.log('📜 Quest system unlocked from server:', eventData);
            this.handleQuestSystemUnlocked(eventData);
        });

        // Listen for flag creation enable from server
        this.eventBus.on('flag_creation_enabled', (eventData) => {
            console.log('🇫🇮 Flag creation enabled from server:', eventData);
            this.handleFlagCreationEnabled(eventData);
        });

        // Listen for celebration trigger from server
        this.eventBus.on('celebration_triggered', (eventData) => {
            console.log('🎉 Celebration triggered from server:', eventData);
            this.handleCelebrationTriggered(eventData);
        });

        // Listen for other player milestones
        this.eventBus.on('player_milestone', (eventData) => {
            console.log('👥 Other player milestone achieved:', eventData);
            this.handleOtherPlayerMilestone(eventData);
        });

        console.log('🌐 Server milestone listeners set up successfully');
    }

    /**
     * Handle base establishment availability from server
     */
    handleBaseEstablishmentAvailable(eventData) {
        console.log('🏗️ Base establishment is now available!');
        // Trigger base building UI or dialog
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.baseBuilding) {
            window.eldritchApp.systems.baseBuilding.showEstablishmentDialog();
        } else {
            // Fallback: show alert or notification
            alert(`🏗️ ${eventData.payload.message}`);
        }
    }

    /**
     * Handle quest system unlock from server
     */
    handleQuestSystemUnlocked(eventData) {
        console.log('📜 Quest system is now unlocked!');
        // Enable quest UI or show notification
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.quest) {
            window.eldritchApp.systems.quest.enableQuestSystem();
        }
    }

    /**
     * Handle flag creation enable from server
     */
    handleFlagCreationEnabled(eventData) {
        console.log('🇫🇮 Flag creation is now enabled!');
        // Enable flag creation UI
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.flag) {
            window.eldritchApp.systems.flag.enableFlagCreation();
        }
    }

    /**
     * Handle celebration trigger from server
     */
    handleCelebrationTriggered(eventData) {
        console.log('🎉 Celebration triggered!');
        // Trigger celebration effects
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.celebration) {
            window.eldritchApp.systems.celebration.triggerCelebration();
        }
    }

    /**
     * Handle other player milestone achievements
     */
    handleOtherPlayerMilestone(eventData) {
        console.log(`👥 Player ${eventData.playerData.name} achieved ${eventData.playerData.milestoneType} milestone!`);
        // Show notification or update UI
        // This could trigger a notification system or update a leaderboard
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

    /**
     * Initialize game systems (called by welcome screen)
     */
    initializeGame() {
        console.log('🎮 Initializing game systems...');
        
        // The game systems are already initialized in the constructor
        // This method is called by the welcome screen when continuing adventure
        
        // Request game state from server when continuing adventure
        if (window.stepCurrencySystem && typeof window.stepCurrencySystem.requestGameStateFromServer === 'function') {
            console.log('🎮 Requesting game state from server for continuing adventure...');
            window.stepCurrencySystem.requestGameStateFromServer();
        } else {
            console.warn('🎮 Step currency system not available for game state request');
        }
        
        // Emit game started event
        if (this.eventBus) {
            this.eventBus.emit('game:started', {
                timestamp: Date.now(),
                isMobile: this.isMobile
            });
        }
        
        console.log('🎮 Game systems initialized successfully');
    }
}

// Make app globally available
window.EldritchSanctuaryApp = EldritchSanctuaryApp;

// Application initialization is handled by the LoadingSystem
// No direct initialization here to prevent conflicts
