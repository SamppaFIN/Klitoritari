/**
 * Main Application - Coordinates all systems and manages the cosmic exploration experience
 * Integrates geolocation, map engine, investigation system, and WebSocket communication
 */

class EldritchSanctuaryApp {
    constructor() {
        this.isInitialized = false;
        this.loadingScreen = null;
        this.hasCenteredOnLocation = false;
        this.systems = {
            cosmicEffects: null,
            geolocation: null,
            mapEngine: null,
            investigation: null,
            websocket: null,
            baseSystem: null
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
        
        // Initialize map engine
        this.systems.mapEngine = new MapEngine();
        this.systems.mapEngine.init();
        
        // Initialize investigation system
        this.systems.investigation = new InvestigationSystem();
        this.systems.investigation.init();
        
        // Initialize WebSocket client
        this.systems.websocket = new WebSocketClient();
        this.systems.websocket.init();
        
        // Initialize base system
        this.systems.baseSystem = new BaseSystem();
        this.systems.baseSystem.init();
    }

    setupSystemIntegration() {
        // Geolocation to Map Engine
        this.systems.geolocation.onPositionUpdate = (position) => {
            this.systems.mapEngine.updatePlayerPosition(position);
            this.systems.websocket.sendPositionUpdate(position);
            this.systems.investigation.updateInvestigationProgress(position);
            
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

        // Map Engine ready
        this.systems.mapEngine.onMapReady = () => {
            this.loadMysteryZones();
            this.loadPlayerBases();
        };

        // Base System integration
        this.systems.baseSystem.onBaseEstablished = (base) => {
            this.systems.mapEngine.addPlayerBaseMarker(base);
            this.showNotification(`🏗️ Base "${base.name}" established!`, 'success');
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
        // Load player's base if exists
        const playerBase = this.systems.baseSystem.getPlayerBase();
        if (playerBase) {
            this.systems.mapEngine.addPlayerBaseMarker(playerBase);
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
