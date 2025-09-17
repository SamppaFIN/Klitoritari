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
            unifiedDebug: null
        };
    }

    async init() {
        console.log('🌌 Initializing Eldritch Sanctuary...');
        
        this.showLoadingScreen();
        
        try {
            // Initialize cosmic effects first
            await this.initCosmicEffects();
            
            // Initialize core systems
            await this.initCoreSystems();
            
            // Set up system integration
            this.setupSystemIntegration();
            
            // Load initial data
            await this.loadInitialData();
            
            // Hide loading screen
            this.hideLoadingScreen();
            
            this.isInitialized = true;
            console.log('🌌 Eldritch Sanctuary initialized successfully');
            
        } catch (error) {
            console.error('🌌 Failed to initialize Eldritch Sanctuary:', error);
            this.showError('Failed to initialize the cosmic map. Please refresh the page.');
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
            setTimeout(resolve, 1000);
        });
    }

    async initCoreSystems() {
        // Initialize geolocation manager
        this.systems.geolocation = new GeolocationManager();
        this.systems.geolocation.init();
        
        // Initialize investigation system first
        this.systems.investigation = new InvestigationSystem();
        this.systems.investigation.init();
        
        // Initialize base system
        this.systems.baseSystem = new BaseSystem();
        this.systems.baseSystem.init();
        
        // Initialize encounter system
        this.systems.encounter = new EncounterSystem();
        this.systems.encounter.init();
        
        // Initialize item system
        this.systems.itemSystem = new ItemSystem();
        
        // Initialize NPC system
        this.systems.npc = new NPCSystem();
        this.systems.npc.init();
        
        // Initialize path painting system
        this.systems.pathPainting = new PathPaintingSystem();
        this.systems.pathPainting.init();
        
        // Initialize unified debug panel
        this.systems.unifiedDebug = new UnifiedDebugPanel();
        this.systems.unifiedDebug.init();
        
        // Initialize map engine
        this.systems.mapEngine = new MapEngine();
        
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
        
        // Initialize WebSocket client
        this.systems.websocket = new WebSocketClient();
        this.systems.websocket.init();
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
            
            // Center map on first position update for debugging
            if (!this.hasCenteredOnLocation) {
                this.systems.mapEngine.centerOnPosition(position);
                this.hasCenteredOnLocation = true;
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
        
        // Enable simulator mode for testing (remove in production)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.systems.geolocation.enableSimulator();
        }
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
    
    // Make app globally accessible for debugging
    window.eldritchApp = app;
    window.cosmicEffects = app.getSystem('cosmicEffects');
    window.geolocationManager = app.getSystem('geolocation');
    window.mapEngine = app.getSystem('mapEngine');
    window.investigationSystem = app.getSystem('investigation');
    window.websocketClient = app.getSystem('websocket');
    window.baseSystem = app.getSystem('baseSystem');
    window.encounterSystem = app.getSystem('encounter');
    window.npcSystem = app.getSystem('npc');
    window.pathPaintingSystem = app.getSystem('pathPainting');
    window.unifiedDebugPanel = app.getSystem('unifiedDebug');
    
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
