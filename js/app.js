/**
 * Main Application - Coordinates all systems and manages the cosmic exploration experience
 * Integrates geolocation, map engine, investigation system, and WebSocket communication
 */

class EldritchSanctuaryApp {
    constructor() {
        this.isInitialized = false;
        this.loadingScreen = null;
        this.hasCenteredOnLocation = false;
        this.playerBasesLoaded = false;
        this.systems = {
            cosmicEffects: null,
            geolocation: null,
            mapEngine: null,
            investigation: null,
            websocket: null,
            baseSystem: null,
            encounter: null,
            npc: null,
            pathPainting: null,
            unifiedDebug: null,
            questSimulation: null
        };
    }

    async init() {
        console.log('🌌 Initializing Eldritch Sanctuary...');
        
        // Store reference to this app instance globally first
        window.eldritchApp = this;
        
        // Initialize welcome screen first
        this.initWelcomeScreen();
        
        // The welcome screen will handle game initialization when appropriate
    }

    initWelcomeScreen() {
        console.log('🌟 Initializing welcome screen...');
        this.welcomeScreen = new WelcomeScreen();
        this.welcomeScreen.init();
    }

    async initializeGame() {
        console.log('🎮 Initializing game systems...');
        
        // Show particle loading screen
        this.showParticleLoadingScreen();
        
        try {
            // Initialize cosmic effects first
            await this.initCosmicEffects();
            
            // Initialize core systems
            await this.initCoreSystems();
            
        // Set up system integration
        this.setupSystemIntegration();
        
        // Set up header buttons
        this.setupHeaderButtons();
        
        // Load initial data
        await this.loadInitialData();
            
            // Hide particle loading screen (it will auto-hide after 3+ seconds)
            // The particle loading screen handles its own timing
            
            this.isInitialized = true;
            console.log('🌌 Eldritch Sanctuary initialized successfully');
            
        } catch (error) {
            console.error('🌌 Failed to initialize Eldritch Sanctuary:', error);
            this.hideParticleLoadingScreen();
            this.showError('Failed to initialize the cosmic map. Please refresh the page.');
        }
    }

    showParticleLoadingScreen() {
        console.log('🌟 Showing particle loading screen...');
        this.particleLoadingScreen = new ParticleLoadingScreen();
        this.particleLoadingScreen.init();
    }

    hideParticleLoadingScreen() {
        if (this.particleLoadingScreen) {
            this.particleLoadingScreen.hide();
        }
    }
    
    setupHeaderButtons() {
        console.log('🔧 Setting up header buttons...');
        
        // Initialize location mode tracking
        this.locationMode = 'device'; // device, random, manual
        
        // Locate me button - cycles through modes
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                this.cycleLocationMode();
            });
        }
    }
    
    cycleLocationMode() {
        console.log('📍 Toggling device GPS...');
        
        if (this.systems.geolocation) {
            const isEnabled = this.systems.geolocation.toggleDeviceGPS();
            this.updateLocationButtonText(isEnabled);
        } else {
            console.error('📍 Geolocation system not available');
        }
    }
    
    enableDeviceMode() {
        console.log('📍 Enabling device location mode');
        this.stopRandomWandering(); // Stop random wandering
        if (window.geolocationManager) {
            window.geolocationManager.startTracking();
        }
        if (window.mapEngine) {
            window.mapEngine.disableManualMode();
        }
        this.updateLocationButtonText();
    }
    
    
    
    
    updateLocationButtonText(isEnabled = null) {
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn) {
            const textElement = locateBtn.querySelector('.locate-text');
            if (textElement) {
                if (isEnabled === null) {
                    // Get current state from geolocation system
                    isEnabled = this.systems.geolocation ? this.systems.geolocation.deviceGPSEnabled : true;
                }
                
                if (isEnabled) {
                    textElement.textContent = 'GPS';
                } else {
                    textElement.textContent = 'FIXED';
                }
            }
        }
    }

    showLoadingScreen() {
        this.loadingScreen = document.getElementById('loading-screen');
        if (this.loadingScreen) {
            this.loadingScreen.classList.remove('hidden');
        }
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('hidden');
        }
    }

    showError(message) {
        console.error(message);
        
        // Create error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--cosmic-red);
            color: var(--cosmic-light);
            padding: 20px 30px;
            border-radius: 15px;
            font-weight: 600;
            z-index: 4000;
            text-align: center;
            box-shadow: 0 0 30px rgba(255, 0, 64, 0.5);
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }

    async initCosmicEffects() {
        return new Promise((resolve) => {
            this.systems.cosmicEffects = new CosmicEffects();
            this.systems.cosmicEffects.init();
            
            // Give cosmic effects time to initialize
            setTimeout(resolve, 100);
        });
    }

    async initCoreSystems() {
        // Check if systems are already initialized
        if (this.systems.mapEngine && this.systems.mapEngine.isInitialized) {
            console.log('🔧 Core systems already initialized, skipping');
            return;
        }
        
        // Initialize geolocation manager
        this.systems.geolocation = new GeolocationManager();
        this.systems.geolocation.init();
        
        // Make geolocation manager globally available
        window.geolocationManager = this.systems.geolocation;
        
        // Connect geolocation to encounter system for step tracking
        this.systems.geolocation.onPositionUpdate = (position) => {
            if (this.systems.encounter) {
                this.systems.encounter.handlePositionUpdate(position);
            }
        };
        
        // Initialize investigation system first
        this.systems.investigation = new InvestigationSystem();
        this.systems.investigation.init();
        
        // Initialize base system
        this.systems.baseSystem = new BaseSystem();
        this.systems.baseSystem.init();
        
        // Initialize encounter system
        this.systems.encounter = new EncounterSystem();
        this.systems.encounter.init();
        
        // Make encounter system globally available
        window.encounterSystem = this.systems.encounter;
        
        // Initialize item system
        this.systems.itemSystem = new ItemSystem();
        
        // Initialize quest system
        this.systems.questSystem = new QuestSystem();
        
        // Initialize NPC system
        this.systems.npc = new NPCSystem();
        this.systems.npc.init();
        
        // Make NPC system globally available
        window.npcSystem = this.systems.npc;
        
        // Initialize path painting system
        this.systems.pathPainting = new PathPaintingSystem();
        this.systems.pathPainting.init();
        
        // Make path painting system globally available
        window.pathPaintingSystem = this.systems.pathPainting;
        
        // Initialize quest simulation
        this.systems.questSimulation = new QuestSimulation();
        window.questSimulation = this.systems.questSimulation;
        console.log('🎭 Quest simulation system initialized');
        
        // Initialize other player simulation
        this.systems.otherPlayerSimulation = new OtherPlayerSimulation();
        this.systems.otherPlayerSimulation.init();
        
        // Make other player simulation globally available
        window.otherPlayerSimulation = this.systems.otherPlayerSimulation;
        
        // Initialize Lovecraftian quest system
        this.systems.lovecraftianQuest = new LovecraftianQuest();
        
        // Make Lovecraftian quest system globally available
        window.lovecraftianQuest = this.systems.lovecraftianQuest;
        console.log('🐙 Lovecraftian quest system initialized and available globally');
        
        // Initialize sanity distortion system
        this.systems.sanityDistortion = new SanityDistortion();
        window.sanityDistortion = this.systems.sanityDistortion;
        console.log('🧠 Sanity distortion system initialized');
        
        // Initialize gruesome notifications
        this.systems.gruesomeNotifications = new GruesomeNotifications();
        window.gruesomeNotifications = this.systems.gruesomeNotifications;
        console.log('💀 Gruesome notifications system initialized');
        
        // Initialize map engine BEFORE exposing global systems
        this.systems.mapEngine = new MapEngine();
        console.log('🗺️ Map engine created:', !!this.systems.mapEngine);
        
        // Initialize unified debug panel
        this.systems.unifiedDebug = new UnifiedDebugPanel();
        this.systems.unifiedDebug.init();
        
        // Initialize inventory UI
        this.systems.inventoryUI = new InventoryUI();
        this.systems.inventoryUI.init();
        
        // Initialize quest log UI
        this.systems.questLogUI = new QuestLogUI();
        this.systems.questLogUI.init();
        
        // Make all systems globally available after map engine is initialized
        this.exposeGlobalSystems();
        
        // Add global functions for easy console access
        window.resetGameScreen = () => this.resetGameScreen();
        window.centerOnCurrentLocation = () => this.centerOnCurrentLocation();
        
        // Set up map ready callback BEFORE initializing
        this.systems.mapEngine.onMapReady = () => {
            console.log('🗺️ onMapReady callback triggered!');
            this.loadMysteryZones();
            this.loadPlayerBases();
            this.loadNPCs();
        };
        console.log('🗺️ onMapReady callback set:', this.systems.mapEngine.onMapReady);
        
        // Now initialize the map engine
        this.systems.mapEngine.init();
        console.log('🗺️ Map engine initialized:', !!this.systems.mapEngine);
        
        // Initialize WebSocket client
        this.systems.websocket = new WebSocketClient();
        this.systems.websocket.init();
    }

    exposeGlobalSystems() {
        // Make all systems globally available for debugging and external access
        window.eldritchApp = this;
        window.cosmicEffects = this.systems.cosmicEffects;
        window.geolocationManager = this.systems.geolocation;
        window.mapEngine = this.systems.mapEngine;
        console.log('🌌 Setting window.mapEngine:', !!window.mapEngine);
        console.log('🌌 Map engine instance:', window.mapEngine);
        window.investigationSystem = this.systems.investigation;
        window.websocketClient = this.systems.websocket;
        window.baseSystem = this.systems.baseSystem;
        window.encounterSystem = this.systems.encounter;
        window.npcSystem = this.systems.npc;
        window.pathPaintingSystem = this.systems.pathPainting;
        window.unifiedDebugPanel = this.systems.unifiedDebug;
        window.inventoryUI = this.systems.inventoryUI;
        window.questLogUI = this.systems.questLogUI;
        window.questSimulation = this.systems.questSimulation;
        window.otherPlayerSimulation = this.systems.otherPlayerSimulation;
        
        console.log('🌌 All systems exposed globally');
    }

    setupSystemIntegration() {
        // Geolocation to Map Engine
        this.systems.geolocation.onPositionUpdate = (position) => {
            this.systems.mapEngine.updatePlayerPosition(position);
            this.systems.websocket.sendPositionUpdate(position);
            this.systems.investigation.updateInvestigationProgress(position);
            
            // Update encounter system with position for step tracking
            if (this.systems.encounter) {
                this.systems.encounter.updatePlayerPosition(position);
            }
            
            // Center map on first position update with better accuracy check
            if (!this.hasCenteredOnLocation && position.accuracy && position.accuracy < 100) {
                console.log('📍 Centering map on accurate GPS position:', position);
                this.systems.mapEngine.centerOnPosition(position);
                this.hasCenteredOnLocation = true;
            } else if (!this.hasCenteredOnLocation && (!position.accuracy || position.accuracy >= 100)) {
                // If accuracy is poor or unknown, center anyway after a delay
                setTimeout(() => {
                    if (!this.hasCenteredOnLocation) {
                        console.log('📍 Centering map on GPS position (poor accuracy):', position);
                        this.systems.mapEngine.centerOnPosition(position);
                        this.hasCenteredOnLocation = true;
                    }
                }, 2000);
            }
        };

        // Investigation System to WebSocket
        this.systems.investigation.onInvestigationStart = (investigation) => {
            this.systems.websocket.sendInvestigationStart(investigation);
            this.showNotification(`🔍 Started investigation: ${investigation.name}`);
        };

        this.systems.investigation.onInvestigationComplete = (investigation) => {
            this.systems.websocket.sendInvestigationComplete(investigation);
            this.showNotification(`🎉 Investigation completed: ${investigation.name}`);
        };

        this.systems.investigation.onInvestigationAbandon = (investigation) => {
            this.showNotification(`❌ Investigation abandoned: ${investigation.name}`);
        };

        // WebSocket to Map Engine
        this.systems.websocket.onPlayerUpdate = (player) => {
            this.systems.mapEngine.updateOtherPlayer(player);
        };

        this.systems.websocket.onConnectionChange = (connected) => {
            if (connected) {
                this.showNotification('🌐 Connected to cosmic network');
            } else {
                this.showNotification('🌐 Disconnected from cosmic network');
            }
        };

        // Map Engine ready callback is set in initCoreSystems()

        // Base System integration
        this.systems.baseSystem.onBaseEstablished = (base) => {
            this.systems.mapEngine.addPlayerBaseMarker(base);
            this.showNotification(`🏗️ Base "${base.name}" established!`, 'success');
        };

        this.systems.baseSystem.onBaseDeleted = () => {
            this.systems.mapEngine.removePlayerBaseMarker();
            this.showNotification('🏗️ Base deleted. You can now establish a new one.', 'info');
        };

        this.systems.baseSystem.onTerritoryUpdated = (territoryPoints) => {
            this.systems.mapEngine.updateTerritoryVisualization(territoryPoints);
        };
    }

    async loadInitialData() {
        // Load mystery zones
        this.loadMysteryZones();
        
        // Disable simulator mode by default - use real device location
        this.systems.geolocation.disableSimulator();
    }

    loadMysteryZones() {
        const zones = this.systems.investigation.getMysteryZones();
        this.systems.mapEngine.addMysteryZoneMarkers(zones);
        
        // Update zone count in info panel
        const zoneCountElement = document.getElementById('zone-count');
        if (zoneCountElement) {
            zoneCountElement.textContent = zones.length;
        }
    }

    loadPlayerBases() {
        // Prevent duplicate loading
        if (this.playerBasesLoaded) {
            console.log('🏗️ Player bases already loaded, skipping');
            return;
        }
        
        // Load player's base if exists
        const playerBase = this.systems.baseSystem.getPlayerBase();
        console.log('🏗️ Loading player base:', playerBase);
        console.log('🏗️ Map engine ready?', this.systems.mapEngine);
        console.log('🏗️ Map ready?', this.systems.mapEngine?.map);
        
        if (playerBase) {
            console.log('🏗️ Calling addPlayerBaseMarker with:', playerBase);
            try {
                this.systems.mapEngine.addPlayerBaseMarker(playerBase);
                console.log('🏗️ addPlayerBaseMarker called successfully');
                this.playerBasesLoaded = true;
            } catch (error) {
                console.error('🏗️ Error calling addPlayerBaseMarker:', error);
            }
        } else {
            console.log('🏗️ No player base found to load');
            this.playerBasesLoaded = true;
        }
    }

    loadNPCs() {
        console.log('👥 Loading NPCs...');
        
        try {
            // Check if NPC system and map engine are ready
            if (!this.systems.npc || !this.systems.mapEngine || !this.systems.mapEngine.map) {
                console.log('👥 NPC system or map engine not ready');
                return;
            }
            
            // Generate NPCs (this will create markers on the map)
            this.systems.npc.generateNPCs();
            console.log('👥 NPCs loaded successfully');
        } catch (error) {
            console.error('👥 Error loading NPCs:', error);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'cosmic-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--cosmic-darker), var(--cosmic-dark));
            border: 2px solid var(--cosmic-purple);
            color: var(--cosmic-light);
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 0 20px var(--cosmic-glow);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Public API methods
    getSystem(systemName) {
        return this.systems[systemName];
    }

    isReady() {
        return this.isInitialized;
    }

    // Reset game screen and recreate all markers
    resetGameScreen() {
        console.log('🔄 Resetting game screen from main app...');
        if (this.systems.mapEngine) {
            this.systems.mapEngine.resetGameScreen();
            this.showNotification('🔄 Game screen reset and markers recreated!', 'success');
        } else {
            console.error('🗺️ Map engine not available for reset');
            this.showError('Map engine not available for reset');
        }
    }

    // Force center map on current location
    centerOnCurrentLocation() {
        console.log('📍 Forcing center on current location...');
        if (this.systems.geolocation) {
            const position = this.systems.geolocation.getCurrentPositionSafe();
            if (position) {
                console.log('📍 Current position:', position);
                this.systems.mapEngine.centerOnPosition(position);
                this.showNotification('📍 Map centered on your location', 'success');
            } else {
                console.log('📍 No valid position available, requesting location...');
                this.systems.geolocation.startTracking();
                this.showNotification('📍 Requesting your location...', 'info');
            }
        } else {
            this.showError('Geolocation not available');
        }
    }

    // Cleanup
    destroy() {
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.destroy === 'function') {
                system.destroy();
            }
        });
        
        this.systems = {};
        this.isInitialized = false;
    }
}

// Global app instance
let app;

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app = new EldritchSanctuaryApp();
    app.init();
    
    // Global systems are now exposed during initialization
    
    // Debug: Check what systems are available
    console.log('🔍 Global systems check:');
    console.log('  - geolocationManager:', !!window.geolocationManager);
    console.log('  - databaseClient:', !!window.databaseClient);
    console.log('  - app.systems:', Object.keys(app.systems));
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});

// Handle visibility change (pause/resume)
document.addEventListener('visibilitychange', () => {
    if (app && app.isReady()) {
        if (document.hidden) {
            // Page is hidden, pause non-essential systems
            console.log('🌌 Pausing cosmic exploration...');
        } else {
            // Page is visible, resume systems
            console.log('🌌 Resuming cosmic exploration...');
        }
    }
});
