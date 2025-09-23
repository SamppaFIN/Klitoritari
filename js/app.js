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
        this.isMobile = this.detectMobile();
        this.panelManager = null;
        this.sound = null;
        this.assetManager = null;
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
            unifiedQuest: null
        };
    }
    
    // Detect if running on mobile device
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768);
    }
    
    // Initialize mobile-optimized UI
    initMobileUI() {
        console.log('📱 Initializing mobile UI...');
        
        if (this.isMobile) {
            // Show mobile footer
            const mobileFooter = document.getElementById('mobile-footer');
            if (mobileFooter) {
                mobileFooter.style.display = 'block';
                console.log('📱 Mobile footer enabled');
            }
            
            // Wire mobile footer buttons
            this.wireMobileFooterButtons();
        }
    }
    
    // Wire mobile footer button event listeners
    wireMobileFooterButtons() {
        console.log('📱 Wiring mobile footer buttons...');
        
        // Inventory button
        const inventoryBtn = document.getElementById('mobile-inventory-btn');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => {
                console.log('📱 Mobile inventory button clicked');
                if (window.UIPanels && window.UIPanels.togglePanel) {
                    window.UIPanels.togglePanel('inventory-panel');
                }
            });
        }
        
        // Locate button
        const locateBtn = document.getElementById('mobile-locate-btn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                console.log('📱 Mobile locate button clicked');
                this.locateMe();
            });
        }
        
        // Quest button
        const questBtn = document.getElementById('mobile-quest-btn');
        if (questBtn) {
            questBtn.addEventListener('click', () => {
                console.log('📱 Mobile quest button clicked');
                if (window.UIPanels && window.UIPanels.togglePanel) {
                    window.UIPanels.togglePanel('quest-log-panel');
                }
            });
        }
        
        // Base button
        const baseBtn = document.getElementById('mobile-base-btn');
        if (baseBtn) {
            baseBtn.addEventListener('click', () => {
                console.log('📱 Mobile base button clicked');
                if (window.UIPanels && window.UIPanels.togglePanel) {
                    window.UIPanels.togglePanel('base-management-panel');
                }
            });
        }
        
        // Settings button
        const settingsBtn = document.getElementById('mobile-settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                console.log('📱 Mobile settings button clicked');
                if (window.UIPanels && window.UIPanels.togglePanel) {
                    window.UIPanels.togglePanel('user-settings-panel');
                }
            });
        }
        
        console.log('📱 Mobile footer buttons wired');
    }
    
    // Hide all debug elements for mobile
    hideDebugElements() {
        // Hide debug panel
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.style.display = 'none';
        }
        
        // Hide quest controls
        const questControls = document.querySelector('.quest-controls');
        if (questControls) {
            questControls.style.display = 'none';
        }
        
        // Hide any other debug elements
        const debugElements = document.querySelectorAll('[class*="debug"], [id*="debug"]');
        debugElements.forEach(el => {
            el.style.display = 'none';
        });
    }
    
    // Create minimal mobile header
    createMobileHeader() {
        // Remove existing header if it exists
        const existingHeader = document.querySelector('.game-header');
        if (existingHeader) {
            existingHeader.remove();
        }
        
        // Create mobile header
        const header = document.createElement('div');
        header.className = 'mobile-header';
        header.innerHTML = `
            <div class="mobile-header-content">
                <div class="mobile-title">
                    <span class="title-icon">🌌</span>
                    <span class="title-text">Eldritch Sanctuary</span>
                </div>
                <div class="mobile-stats">
                    <div class="stat-item">
                        <span class="stat-icon">❤️</span>
                        <span class="stat-value" id="mobile-health">100</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">🧠</span>
                        <span class="stat-value" id="mobile-sanity">100</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(header);
    }
    
    // Create mobile controls
    createMobileControls() {
        // Create mobile control panel
        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        controls.innerHTML = `
            <div class="mobile-control-row">
                <button class="mobile-btn primary" id="mobile-locate">
                    <span class="btn-icon">📍</span>
                    <span class="btn-text">Locate</span>
                </button>
                <button class="mobile-btn secondary" id="mobile-flags">
                    <span class="btn-icon">🇫🇮</span>
                    <span class="btn-text">Flags</span>
                </button>
                <button class="mobile-btn secondary" id="mobile-effects">
                    <span class="btn-icon">🌀</span>
                    <span class="btn-text">Effects</span>
                </button>
            </div>
            <div class="mobile-location-info" id="mobile-location-info">
                <div class="location-coords">Getting location...</div>
                <div class="quest-distance">Quest: --</div>
            </div>
        `;
        
        document.body.appendChild(controls);
        
        // Add event listeners
        this.setupMobileControls();
    }
    
    // Setup mobile control event listeners
    setupMobileControls() {
        // Locate button
        const locateBtn = document.getElementById('mobile-locate');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                this.locateMe();
            });
        }
        
        // Flags button
        const flagsBtn = document.getElementById('mobile-flags');
        if (flagsBtn) {
            flagsBtn.addEventListener('click', () => {
                this.toggleFlagLayer();
                flagsBtn.classList.toggle('active');
            });
        }
        
        // Effects button
        const effectsBtn = document.getElementById('mobile-effects');
        if (effectsBtn) {
            effectsBtn.addEventListener('click', () => {
                this.toggleDistortionEffects();
                effectsBtn.classList.toggle('active');
            });
        }
    }
    
    // Optimize map for mobile
    optimizeMapForMobile() {
        // Add mobile-specific map styles
        const style = document.createElement('style');
        style.textContent = `
            #map {
                height: calc(100vh - 140px) !important;
                touch-action: pan-x pan-y;
            }
            
            .leaflet-control-container {
                display: none !important;
            }
            
            .mobile-header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 60px;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-bottom: 2px solid #00ffff;
                z-index: 1000;
                display: flex;
                align-items: center;
                padding: 0 15px;
            }
            
            .mobile-header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
            }
            
            .mobile-title {
                display: flex;
                align-items: center;
                gap: 8px;
                color: #00ffff;
                font-weight: bold;
                font-size: 18px;
            }
            
            .mobile-stats {
                display: flex;
                gap: 15px;
            }
            
            .stat-item {
                display: flex;
                align-items: center;
                gap: 4px;
                color: #ffffff;
                font-size: 14px;
            }
            
            .mobile-controls {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border-top: 2px solid #00ffff;
                padding: 15px;
                z-index: 1000;
            }
            
            .mobile-control-row {
                display: flex;
                gap: 10px;
                margin-bottom: 10px;
            }
            
            .mobile-btn {
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                padding: 12px 8px;
                border: 2px solid #00ffff;
                border-radius: 8px;
                background: linear-gradient(135deg, #0f3460, #16213e);
                color: #ffffff;
                font-size: 12px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .mobile-btn.primary {
                background: linear-gradient(135deg, #00ffff, #0099cc);
                color: #000000;
            }
            
            .mobile-btn.active {
                background: linear-gradient(135deg, #ffaa00, #ff6600);
                border-color: #ffaa00;
            }
            
            .mobile-btn:active {
                transform: scale(0.95);
            }
            
            .btn-icon {
                font-size: 16px;
            }
            
            .btn-text {
                font-size: 10px;
            }
            
            .mobile-location-info {
                text-align: center;
                color: #ffffff;
                font-size: 12px;
            }
            
            .location-coords {
                margin-bottom: 4px;
            }
            
            .quest-distance {
                color: #00ffff;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Disable console logging for mobile (optional)
    disableConsoleLogging() {
        // Only disable in production builds
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log = () => {};
            console.warn = () => {};
            console.error = () => {};
        }
    }
    
    // Update mobile UI stats
    updateMobileStats() {
        if (this.systems.encounter) {
            const health = this.systems.encounter.playerStats.health;
            const sanity = this.systems.encounter.playerStats.sanity;
            
            // Update mobile UI (if on mobile)
            if (this.isMobile) {
                const healthEl = document.getElementById('mobile-health');
                const sanityEl = document.getElementById('mobile-sanity');
                
                if (healthEl) healthEl.textContent = health;
                if (sanityEl) sanityEl.textContent = sanity;
            }
            
            // Update desktop header UI
            const desktopHealthEl = document.getElementById('health-value');
            const desktopSanityEl = document.getElementById('sanity-value');
            
            if (desktopHealthEl) desktopHealthEl.textContent = health;
            if (desktopSanityEl) desktopSanityEl.textContent = sanity;
        }
    }
    
    // Update mobile location info
    updateMobileLocationInfo() {
        if (!this.isMobile) return;
        
        const locationInfo = document.getElementById('mobile-location-info');
        if (!locationInfo) return;
        
        if (this.systems.geolocation) {
            const position = this.systems.geolocation.getCurrentPositionSafe();
            if (position) {
                const coordsEl = locationInfo.querySelector('.location-coords');
                if (coordsEl) {
                    coordsEl.textContent = `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`;
                }
            }
            
            // Update quest distance
            const questDistanceEl = locationInfo.querySelector('.quest-distance');
            if (questDistanceEl && this.systems.geolocation.targetQuestLocation) {
                const distance = this.systems.geolocation.calculateDistance(
                    position.lat, position.lng,
                    this.systems.geolocation.targetQuestLocation.lat,
                    this.systems.geolocation.targetQuestLocation.lng
                );
                questDistanceEl.textContent = `Quest: ${distance.toFixed(0)}m`;
            }
        }
    }

    async init() {
        console.log('🌌 Initializing Eldritch Sanctuary...');
        
        // Initialize mobile UI if on mobile
        if (this.isMobile) {
            this.initMobileUI();
        }
        
        // Store reference to this app instance globally first
        window.eldritchApp = this;
        
        // Initialize welcome screen first
        this.initWelcomeScreen();
        
        // Don't initialize game systems yet - wait for welcome screen to be dismissed
        console.log('🌌 App initialized, waiting for welcome screen to be dismissed');
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
            // Initialize sound and assets early so hooks are available to systems
            this.initSoundManager();
            await this.initAssetManager();

            // Initialize cosmic effects first
            await this.initCosmicEffects();

            // Initialize core systems
            await this.initCoreSystems();
            
        // Set up system integration
        this.setupSystemIntegration();
        
        // Set up header buttons
        this.setupHeaderButtons();

        // Initialize docked/draggable panels (non-blocking)
        this.initDockedPanels();
        
        if (this.sound) {
            // Start subtle ambience pulse during exploration
            try { this.sound.startAmbiencePulse({ intervalMs: 14000 }); } catch (e) {}
        }
        
        // Initialize multiplayer manager
        this.initMultiplayerManager();
        
        // Set up multiplayer status updates
        this.setupMultiplayerStatusUpdates();
        
        // Load initial data
        await this.loadInitialData();
            
            // Hide particle loading screen immediately after initialization
            this.hideParticleLoadingScreen();
            
            // Don't start NPC simulation yet - wait for welcome screen to be dismissed
            console.log('👥 NPC simulation paused until welcome screen is dismissed');
            
            this.isInitialized = true;
            console.log('🌌 Eldritch Sanctuary initialized successfully');
            
        } catch (error) {
            console.error('🌌 Failed to initialize Eldritch Sanctuary:', error);
            this.hideParticleLoadingScreen();
            this.showError('Failed to initialize the cosmic map. Please refresh the page.');
        }
    }

    // Initialize multiplayer manager
    initMultiplayerManager() {
        if (window.MultiplayerManager) {
            window.multiplayerManager = new MultiplayerManager();
            window.multiplayerManager.initialize().catch(error => {
                console.warn('🌐 Multiplayer initialization failed, continuing in single-player mode:', error);
            });
            console.log('🌐 Multiplayer manager initialized');
        } else {
            console.warn('🌐 MultiplayerManager not available');
        }
    }
    
    // Set up multiplayer status updates
    setupMultiplayerStatusUpdates() {
        const statusElement = document.getElementById('multiplayerStatus');
        const statusText = document.getElementById('multiplayerStatusText');
        
        if (!statusElement || !statusText) return;
        
        // Update status every 2 seconds
        setInterval(() => {
            if (window.multiplayerManager) {
                const isConnected = window.multiplayerManager.isConnected;
                const nearbyCount = window.multiplayerManager.getNearbyPlayersCount();
                
                statusElement.className = `multiplayer-status ${isConnected ? 'connected' : 'disconnected'}`;
                statusText.textContent = isConnected ? 
                    `Connected (${nearbyCount} nearby)` : 
                    'Disconnected';
            } else {
                statusElement.className = 'multiplayer-status disconnected';
                statusText.textContent = 'Unavailable';
            }
        }, 2000);
    }

    // Initialize a minimal docked/draggable panel manager
    initDockedPanels() {
        if (this.panelManager) return;
        try {
            this.panelManager = new DockedPanelManager();
            window.panelManager = this.panelManager;
            console.log('🧩 Docked panel manager initialized');
        } catch (e) {
            console.warn('🧩 Failed to initialize docked panels', e);
        }
    }

    // Initialize a tiny synth-based sound manager
    initSoundManager() {
        if (this.sound) return;
        try {
            this.sound = new SoundManager();
            this.sound.init(); // Initialize the audio context
            window.soundManager = this.sound;
            console.log('🔊 Sound manager initialized');
        } catch (e) {
            console.warn('🔊 Failed to initialize sound manager', e);
        }
    }
    
    async initAssetManager() {
        if (this.assetManager) return;
        try {
            this.assetManager = new AssetManager();
            window.assetManager = this.assetManager;
            await this.assetManager.initialize();
            console.log('📦 Asset manager initialized');
        } catch (e) {
            console.warn('📦 Failed to initialize asset manager', e);
        }
    }


    startNPCSimulation() {
        // Clear all system caches first to ensure fresh start
        this.clearAllSystemCaches();
        
        console.log('🎭 startNPCSimulation called');
        console.log('🎭 Systems available:', Object.keys(this.systems));
        console.log('🎭 Quest system available:', !!this.systems.unifiedQuest);
        
        // Start NPC simulation after welcome screen is dismissed
        if (this.systems.npc) {
            console.log('👥 Starting NPC simulation after welcome screen dismissed');
            this.systems.npc.startSimulation();
        }
        
        // Resume quest system after welcome screen is dismissed
        if (this.systems.unifiedQuest) {
            console.log('🎭 Resuming quest system after welcome screen dismissed');
            console.log('🎭 Quest system exists:', !!this.systems.unifiedQuest);
            console.log('🎭 Quest system methods:', Object.getOwnPropertyNames(this.systems.unifiedQuest));
            this.systems.unifiedQuest.resumeQuestSystem();
        } else {
            console.log('🎭 No quest system found to resume');
            // Try to initialize quest system if it's missing
            console.log('🎭 Attempting to initialize quest system...');
            this.systems.unifiedQuest = new UnifiedQuestSystem();
            this.systems.unifiedQuest.init();
            window.unifiedQuestSystem = this.systems.unifiedQuest;
            console.log('🎭 Quest system initialized, now resuming...');
            this.systems.unifiedQuest.resumeQuestSystem();
        }
    }
    
    // Clear all system caches to ensure fresh start
    clearAllSystemCaches() {
        console.log('🌌 Clearing all system caches for fresh start...');
        
        // Clear quest system caches
        if (this.systems.unifiedQuest) {
            this.systems.unifiedQuest.clearAllCaches();
        }
        
        // Clear encounter system caches
        if (this.systems.encounter) {
            // Reset any encounter-related caches
            if (this.systems.encounter.abilityCooldowns) {
                this.systems.encounter.abilityCooldowns = {};
            }
        }
        
        // Clear NPC system caches
        if (this.systems.npc) {
            // Reset any NPC-related caches
            if (this.systems.npc.npcMarkers) {
                if (typeof this.systems.npc.npcMarkers.clear === 'function') {
                    this.systems.npc.npcMarkers.clear();
                } else if (Array.isArray(this.systems.npc.npcMarkers)) {
                    this.systems.npc.npcMarkers.length = 0;
                } else {
                    this.systems.npc.npcMarkers = new Map();
                }
            }
        }
        
        // Clear map engine caches
        if (this.systems.mapEngine) {
            // Reset any map-related caches
            if (this.systems.mapEngine.otherPlayerMarkers) {
                this.systems.mapEngine.otherPlayerMarkers.clear();
            }
            if (this.systems.mapEngine.investigationMarkers) {
                this.systems.mapEngine.investigationMarkers.clear();
            }
            if (this.systems.mapEngine.mysteryZoneMarkers) {
                this.systems.mapEngine.mysteryZoneMarkers.clear();
            }
        }
        
        console.log('🌌 All system caches cleared successfully');
    }
    
    toggleFlagLayer() {
        if (this.systems.mapEngine) {
            this.systems.mapEngine.toggleFlagLayer();
            this.updateFlagButtonState();
        }
    }
    
    updateFlagButtonState() {
        const flagBtn = document.getElementById('flag-layer-btn');
        if (flagBtn && this.systems.mapEngine) {
            if (this.systems.mapEngine.flagLayerVisible) {
                flagBtn.classList.add('active');
                flagBtn.title = 'Hide Flag Layer';
            } else {
                flagBtn.classList.remove('active');
                flagBtn.title = 'Show Flag Layer';
            }
        }
    }
    
    toggleDistortionEffects() {
        if (this.systems.mapEngine) {
            this.systems.mapEngine.toggleDistortionEffects();
            this.updateDistortionButtonState();
        }
    }
    
    updateDistortionButtonState() {
        const distortionBtn = document.getElementById('distortion-effects-btn');
        if (distortionBtn && this.systems.mapEngine) {
            if (this.systems.mapEngine.distortionEffectsVisible) {
                distortionBtn.classList.add('active');
                distortionBtn.title = 'Hide Distortion Effects';
            } else {
                distortionBtn.classList.remove('active');
                distortionBtn.title = 'Show Distortion Effects';
            }
        }
    }
    
    showcaseAllEffects() {
        if (this.systems.mapEngine) {
            this.systems.mapEngine.showcaseAllEffects();
        }
    }
    
    locateMe() {
        console.log('📍 Locate Me button clicked');
        this.requestLocationWithFallback();
        // If quests are awaiting locate, begin them now
        try {
            if (window.unifiedQuestSystem?.awaitingLocate) {
                window.unifiedQuestSystem.beginAfterLocate?.();
            }
        } catch (_) {}
    }
    
    requestLocationWithFallback() {
        const locateBtn = document.getElementById('locate-me-btn');
        const locateText = locateBtn?.querySelector('.btn-text');
        
        // Set loading state
        if (locateBtn) {
            locateBtn.classList.add('loading');
            locateBtn.disabled = true;
        }
        if (locateText) {
            locateText.textContent = 'LOCATING...';
        }
        
        console.log('📍 Requesting location with 10-second timeout...');
        console.log('📍 Browser geolocation support:', !!navigator.geolocation);
        console.log('📍 Current protocol:', window.location.protocol);
        console.log('📍 Is HTTPS:', window.location.protocol === 'https:');
        
        // Check if we're on HTTPS (required for geolocation in production)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            console.log('📍 WARNING: Geolocation requires HTTPS in production');
            this.showLocationError('Geolocation requires HTTPS. Using fallback position.');
            this.useFallbackLocation();
            this.resetLocateButton();
            return;
        }
        
        // Set up 10-second timeout
        const timeoutId = setTimeout(() => {
            console.log('📍 Location request timed out, using fallback position');
            this.showLocationError('Location request timed out. Using fallback position.');
            this.useFallbackLocation();
            this.resetLocateButton();
        }, 10000);
        
        // Check if geolocation is available
        if (!navigator.geolocation) {
            console.log('📍 Geolocation not supported, using fallback');
            clearTimeout(timeoutId);
            this.showLocationError('Geolocation not supported. Using fallback position.');
            this.useFallbackLocation();
            this.resetLocateButton();
            return;
        }
        
        // Check permission state first
        if (navigator.permissions) {
            navigator.permissions.query({name: 'geolocation'}).then((result) => {
                console.log('📍 Geolocation permission state:', result.state);
                if (result.state === 'denied') {
                    console.log('📍 Geolocation permission denied');
                    clearTimeout(timeoutId);
                    this.showLocationError('Location permission denied. Please enable location access in your browser settings.');
                    this.resetLocateButton();
                    return;
                }
            }).catch((err) => {
                console.log('📍 Could not check permission state:', err);
            });
        }
        
        // Request location with high accuracy
        const options = {
            enableHighAccuracy: true,
            timeout: 30000, // allow up to 30s for a fresh GPS fix
            maximumAge: 10000 // accept positions up to 10s old
        };
        
        console.log('📍 Requesting location with options:', options);
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log('📍 Location obtained successfully');
                clearTimeout(timeoutId);
                
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy;
                const altitude = position.coords.altitude;
                const heading = position.coords.heading;
                const speed = position.coords.speed;
                
                console.log(`📍 GPS Position: ${lat.toFixed(6)}, ${lng.toFixed(6)} (accuracy: ${accuracy.toFixed(1)}m)`);
                console.log(`📍 Altitude: ${altitude ? altitude.toFixed(1) + 'm' : 'N/A'}`);
                console.log(`📍 Heading: ${heading ? heading.toFixed(1) + '°' : 'N/A'}`);
                console.log(`📍 Speed: ${speed ? speed.toFixed(1) + 'm/s' : 'N/A'}`);
                
                // Update player position
        if (this.systems.mapEngine) {
            this.systems.mapEngine.updatePlayerPosition({
                lat: lat,
                lng: lng,
                accuracy: accuracy,
                timestamp: Date.now()
            });
            try {
                // Also re-center map view for immediate feedback
                this.systems.mapEngine.map.setView([lat, lng], Math.max(this.systems.mapEngine.map.getZoom(), 16), { animate: true, duration: 0.8 });
            } catch (_) {}
        }
                
                // Note: Geolocation system handles position updates internally
                // No need to manually update it here
                
                this.resetLocateButton();
                this.showLocationSuccess(lat, lng, accuracy);
            },
            (error) => {
                console.log('📍 Location request failed:', error.message);
                console.log('📍 Error code:', error.code);
                clearTimeout(timeoutId);
                
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        console.log('📍 Location permission denied');
                        this.showLocationError('Location permission denied. Please allow location access in your browser settings and try again.');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        console.log('📍 Location unavailable');
                        this.showLocationError('Location unavailable. Your device may not have GPS or location services enabled. Using fallback position.');
                        this.useFallbackLocation();
                        break;
                    case error.TIMEOUT:
                        console.log('📍 Location request timed out');
                        this.showLocationError('Location request timed out. Your device may be taking too long to get GPS signal. Using fallback position.');
                        this.useFallbackLocation();
                        break;
                    default:
                        console.log('📍 Unknown location error');
                        this.showLocationError('Location error occurred. Using fallback position.');
                        this.useFallbackLocation();
                        break;
                }
                
                this.resetLocateButton();
            },
            options
        );
    }
    
    useFallbackLocation() {
        console.log('📍 Using fallback location for desktop testing');
        
        // Use a known location in Tampere for testing
        const fallbackLat = 61.472768; // User's known location
        const fallbackLng = 23.724032;
        const fallbackAccuracy = 1000; // 1km accuracy for fallback
        
        console.log(`📍 Fallback Position: ${fallbackLat}, ${fallbackLng} (accuracy: ${fallbackAccuracy}m)`);
        
        // Update player position
        if (this.systems.mapEngine) {
            this.systems.mapEngine.updatePlayerPosition({
                lat: fallbackLat,
                lng: fallbackLng,
                accuracy: fallbackAccuracy,
                timestamp: Date.now()
            });
        }
        
        // Note: Geolocation system handles position updates internally
        // No need to manually update it here
        
        this.showLocationSuccess(fallbackLat, fallbackLng, fallbackAccuracy, true);
    }
    
    resetLocateButton() {
        const locateBtn = document.getElementById('locate-me-btn');
        const locateText = locateBtn?.querySelector('.btn-text');
        
        if (locateBtn) {
            locateBtn.classList.remove('loading');
            locateBtn.disabled = false;
        }
        if (locateText) {
            locateText.textContent = 'LOCATE ME';
        }
    }
    
    showLocationSuccess(lat, lng, accuracy, isFallback = false) {
        const message = isFallback 
            ? `📍 Using fallback location: ${lat.toFixed(4)}, ${lng.toFixed(4)} (accuracy: ${accuracy}m)`
            : `📍 Location found: ${lat.toFixed(4)}, ${lng.toFixed(4)} (accuracy: ${accuracy}m)`;
        
        console.log(message);
        
        // Show notification
        if (window.eldritchApp && window.eldritchApp.systems.gruesomeNotifications) {
            window.eldritchApp.systems.gruesomeNotifications.showGeneralNotification(
                message,
                isFallback ? 'warning' : 'success',
                'info'
            );
        }
    }
    
    showLocationError(message) {
        console.log('📍 Location Error:', message);
        
        // Show detailed troubleshooting guide
        const troubleshootingGuide = this.getLocationTroubleshootingGuide();
        console.log('📍 Troubleshooting Guide:', troubleshootingGuide);
        
        // Show notification
        if (window.eldritchApp && window.eldritchApp.systems.gruesomeNotifications) {
            window.eldritchApp.systems.gruesomeNotifications.showGeneralNotification(
                message + '\n\nCheck console for troubleshooting guide.',
                'error',
                'info'
            );
        }
    }
    
    getLocationTroubleshootingGuide() {
        const isHTTPS = window.location.protocol === 'https:';
        const isLocalhost = window.location.hostname === 'localhost';
        const hasGeolocation = !!navigator.geolocation;
        
        let guide = '📍 LOCATION TROUBLESHOOTING GUIDE:\n\n';
        
        guide += `1. Browser Support: ${hasGeolocation ? '✅ Supported' : '❌ Not Supported'}\n`;
        guide += `2. Protocol: ${window.location.protocol} ${isHTTPS || isLocalhost ? '✅ OK' : '❌ Needs HTTPS'}\n`;
        guide += `3. Hostname: ${window.location.hostname} ${isLocalhost ? '✅ Localhost OK' : '✅ Production OK'}\n\n`;
        
        guide += 'COMMON SOLUTIONS:\n';
        guide += '• Check browser location permission (click the lock icon in address bar)\n';
        guide += '• Enable location services in Windows Settings > Privacy & Security > Location\n';
        guide += '• Try refreshing the page and allowing location when prompted\n';
        guide += '• Check if your PC has GPS or location services enabled\n';
        guide += '• Try a different browser (Chrome, Firefox, Edge)\n';
        guide += '• Make sure you\'re not using a VPN that blocks location\n\n';
        
        guide += 'WINDOWS LOCATION SETTINGS:\n';
        guide += '• Press Windows + I to open Settings\n';
        guide += '• Go to Privacy & Security > Location\n';
        guide += '• Turn on "Location services"\n';
        guide += '• Turn on "Allow apps to access your location"\n';
        guide += '• Turn on "Allow desktop apps to access your location"\n\n';
        
        guide += 'BROWSER SETTINGS:\n';
        guide += '• Chrome: Settings > Privacy and security > Site settings > Location\n';
        guide += '• Firefox: Settings > Privacy & Security > Permissions > Location\n';
        guide += '• Edge: Settings > Site permissions > Location\n\n';
        
        guide += 'If all else fails, the app will use a fallback location in Tampere, Finland.';
        
        return guide;
    }
    
    
    testLocationServices() {
        console.log('🧪 Testing location services...');
        
        // Test 1: Check if geolocation is supported
        console.log('🧪 Test 1 - Geolocation support:', !!navigator.geolocation);
        
        // Test 2: Check protocol
        console.log('🧪 Test 2 - Protocol:', window.location.protocol);
        console.log('🧪 Test 2 - Is HTTPS:', window.location.protocol === 'https:');
        console.log('🧪 Test 2 - Is localhost:', window.location.hostname === 'localhost');
        
        // Test 3: Check permissions
        if (navigator.permissions) {
            navigator.permissions.query({name: 'geolocation'}).then((result) => {
                console.log('🧪 Test 3 - Permission state:', result.state);
                console.log('🧪 Test 3 - Permission granted:', result.state === 'granted');
            }).catch((err) => {
                console.log('🧪 Test 3 - Permission check failed:', err);
            });
        } else {
            console.log('🧪 Test 3 - Permissions API not supported');
        }
        
        // Test 4: Try a simple location request
        if (navigator.geolocation) {
            console.log('🧪 Test 4 - Attempting simple location request...');
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('🧪 Test 4 - SUCCESS! Location:', position.coords);
                },
                (error) => {
                    console.log('🧪 Test 4 - FAILED! Error:', error);
                },
                {
                    enableHighAccuracy: false,
                    timeout: 15000,
                    maximumAge: 60000
                }
            );
        }
        
        // Test 5: Check if we can access location from other sources
        console.log('🧪 Test 5 - User agent:', navigator.userAgent);
        console.log('🧪 Test 5 - Platform:', navigator.platform);
        console.log('🧪 Test 5 - Language:', navigator.language);
        
        // Show results in notification
        if (window.eldritchApp && window.eldritchApp.systems.gruesomeNotifications) {
            window.eldritchApp.systems.gruesomeNotifications.showGeneralNotification(
                'Check console for detailed test results',
                'info',
                'info'
            );
        }
    }
    
    createQuestMarkers() {
        console.log('🎭 Creating quest markers...');
        if (this.systems.unifiedQuest && this.systems.mapEngine && this.systems.mapEngine.map) {
            this.systems.unifiedQuest.createQuestMarkers();
            console.log('🎭 Quest markers created successfully');
            
            // Add test button for quest triggering
            this.addQuestTestButton();
        } else {
            console.log('🎭 Quest system or map engine not ready for quest markers');
        }
    }
    
    addQuestTestButton() {
        // Quest debug buttons are now in the header - no need to create floating buttons
        console.log('🎭 Quest debug buttons moved to header');
    }
    
    addDebugButtons() {
        // Add debug buttons to the side panel for testing
        const sidePanel = document.getElementById('glassmorphic-side-panel');
        if (sidePanel) {
            const debugSection = document.createElement('div');
            debugSection.className = 'debug-section';
            debugSection.innerHTML = `
                <h4>🧪 Debug Tests</h4>
                <button id="test-flag-creation" class="debug-btn">Test Flag Creation</button>
                <button id="test-movement" class="debug-btn">Test Movement</button>
                <button id="add-50-steps" class="debug-btn">Add 50 Steps</button>
                <button id="test-dice-combat" class="debug-btn">Test Dice Combat</button>
                <button id="test-dice-game" class="debug-btn">Test Dice Game</button>
                <button id="test-trivia" class="debug-btn">Test Trivia</button>
                <button id="test-tetris" class="debug-btn">Test Tetris</button>
                <button id="test-moral-choice" class="debug-btn">Test Moral Choice</button>
                <button id="test-random-moral" class="debug-btn">Random Moral</button>
                <button id="test-screen-shake" class="debug-btn">Screen Shake</button>
                <button id="test-particle-burst" class="debug-btn">Particle Burst</button>
                <button id="test-cosmic-rift" class="debug-btn">Cosmic Rift</button>
                <div style="margin-top:10px; display:flex; gap:8px;">
                    <button id="steps-minus" class="debug-btn" style="flex:1;">− Steps</button>
                    <button id="steps-plus" class="debug-btn" style="flex:1;">+ Steps</button>
                </div>
                <div id="steps-readout" style="margin-top:6px; font-size:12px; opacity:0.8;"></div>
                
                <h4 style="margin-top:20px; margin-bottom:10px;">🔬 Device Testing</h4>
                <button id="run-device-tests" class="debug-btn" style="width:100%; margin-bottom:8px;">Run All Tests</button>
                <button id="run-core-tests" class="debug-btn" style="width:100%; margin-bottom:8px;">Core Tests Only</button>
                <button id="run-performance-tests" class="debug-btn" style="width:100%; margin-bottom:8px;">Performance Tests</button>
                <button id="export-test-results" class="debug-btn" style="width:100%; margin-bottom:8px;">Export Results</button>
                <div id="test-results" style="margin-top:10px; font-size:11px; opacity:0.8; max-height:200px; overflow-y:auto;"></div>
            `;
            sidePanel.appendChild(debugSection);
            
            // Add event listeners
            document.getElementById('test-flag-creation').addEventListener('click', () => {
                this.testFlagCreation();
            });
            
            document.getElementById('test-movement').addEventListener('click', () => {
                this.testMovement();
            });
            
            document.getElementById('add-50-steps').addEventListener('click', () => {
                this.addTestSteps();
            });
            
            document.getElementById('test-dice-combat').addEventListener('click', () => {
                this.testDiceCombat();
            });
            
            document.getElementById('test-dice-game').addEventListener('click', () => {
                this.testDiceGame();
            });
            
            document.getElementById('test-trivia').addEventListener('click', () => {
                this.testTrivia();
            });
            
            document.getElementById('test-tetris').addEventListener('click', () => {
                this.testTetris();
            });
            
            document.getElementById('test-moral-choice').addEventListener('click', () => {
                this.testMoralChoice();
            });
            
            document.getElementById('test-random-moral').addEventListener('click', () => {
                this.testRandomMoralChoice();
            });
            
            document.getElementById('test-screen-shake').addEventListener('click', () => {
                this.testScreenShake();
            });
            
            document.getElementById('test-particle-burst').addEventListener('click', () => {
                this.testParticleBurst();
            });
            
            document.getElementById('test-cosmic-rift').addEventListener('click', () => {
                this.testCosmicRift();
            });
            
            // Device testing event listeners
            document.getElementById('run-device-tests').addEventListener('click', () => {
                this.runDeviceTests();
            });
            
            document.getElementById('run-core-tests').addEventListener('click', () => {
                this.runCoreTests();
            });
            
            document.getElementById('run-performance-tests').addEventListener('click', () => {
                this.runPerformanceTests();
            });
            
            document.getElementById('export-test-results').addEventListener('click', () => {
                this.exportTestResults();
            });
            
            // Multiplayer test buttons
            const testMultiplayerBtn = document.createElement('button');
            testMultiplayerBtn.textContent = 'Test Multiplayer';
            testMultiplayerBtn.className = 'sacred-button';
            testMultiplayerBtn.onclick = () => this.testMultiplayer();
            sidePanel.appendChild(testMultiplayerBtn);
            
            const simulatePlayerBtn = document.createElement('button');
            simulatePlayerBtn.textContent = 'Simulate Other Player';
            simulatePlayerBtn.className = 'sacred-button';
            simulatePlayerBtn.onclick = () => this.simulateOtherPlayer();
            sidePanel.appendChild(simulatePlayerBtn);

            // Hold-to-repeat with acceleration for steps +/-
            const readout = sidePanel.querySelector('#steps-readout');
            const updateReadout = () => {
                try {
                    const stats = this.systems.stepCurrency?.getStepStats?.();
                    if (stats && readout) {
                        readout.textContent = `Total: ${stats.totalSteps} | Session: ${stats.sessionSteps}`;
                    }
                } catch (_) {}
            };
            updateReadout();

            const makeHoldRepeater = (el, onTick) => {
                if (!el) return;
                let intervalId = null;
                let timeoutId = null;
                let tickIntervalMs = 220; // start slower
                const minIntervalMs = 40;  // max speed
                const accelStep = 30;      // accelerate by this many ms per step

                const tick = () => {
                    onTick();
                    updateReadout();
                    tickIntervalMs = Math.max(minIntervalMs, tickIntervalMs - accelStep);
                    intervalId = setTimeout(tick, tickIntervalMs);
                };

                const start = () => {
                    clear();
                    tickIntervalMs = 220;
                    timeoutId = setTimeout(tick, 120); // slight delay before repeating
                    onTick();
                    updateReadout();
                };

                const clear = () => {
                    if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
                    if (intervalId) { clearTimeout(intervalId); intervalId = null; }
                };

                el.addEventListener('mousedown', start);
                el.addEventListener('touchstart', (e) => { e.preventDefault(); start(); }, { passive: false });
                ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => {
                    el.addEventListener(evt, clear);
                });
            };

            const minusBtn = sidePanel.querySelector('#steps-minus');
            const plusBtn = sidePanel.querySelector('#steps-plus');

            makeHoldRepeater(minusBtn, () => {
                if (this.systems.stepCurrency) {
                    this.systems.stepCurrency.subtractSteps(1);
                }
            });

            makeHoldRepeater(plusBtn, () => {
                if (this.systems.stepCurrency) {
                    this.systems.stepCurrency.addManualStep();
                }
            });
        }
    }
    
    testFlagCreation() {
        console.log('🧪 Testing flag creation...');
        if (this.systems.stepCurrency) {
            this.systems.stepCurrency.triggerFlagCreation();
        } else {
            console.warn('🧪 Step currency system not available');
        }
    }
    
    testMovement() {
        console.log('🧪 Testing movement simulation...');
        if (this.systems.mapEngine && this.systems.mapEngine.movePlayer) {
            // Move to a nearby location
            const currentPos = this.systems.geolocation.getCurrentPosition();
            if (currentPos) {
                const newLat = currentPos.lat + 0.001; // ~100m north
                const newLng = currentPos.lng + 0.001; // ~100m east
                this.systems.mapEngine.movePlayer(newLat, newLng);
            } else {
                console.warn('🧪 No current position available for movement test');
            }
        } else {
            console.warn('🧪 Map engine or movePlayer not available');
        }
    }
    
    addTestSteps() {
        console.log('🧪 Adding 50 test steps...');
        if (this.systems.stepCurrency) {
            for (let i = 0; i < 50; i++) {
                this.systems.stepCurrency.addManualStep();
            }
        } else {
            console.warn('🧪 Step currency system not available');
        }
    }
    
    testDiceCombat() {
        console.log('🧪 Testing dice combat...');
        if (window.simpleDiceCombat) {
            // Create a test enemy
            const testEnemy = {
                name: 'Test Shadow Stalker',
                type: 'shadowStalker',
                id: 'test_enemy'
            };
            
            // Start combat with win/lose callbacks
            window.simpleDiceCombat.startCombat(
                testEnemy,
                (enemy) => {
                    console.log('🎉 Test combat victory!', enemy);
                    if (window.gruesomeNotifications) {
                        window.gruesomeNotifications.show('🎉 Test Victory!', 'You defeated the test enemy!');
                    }
                },
                (enemy) => {
                    console.log('💀 Test combat defeat!', enemy);
                    if (window.gruesomeNotifications) {
                        window.gruesomeNotifications.show('💀 Test Defeat!', 'The test enemy defeated you!');
                    }
                }
            );
        } else {
            console.error('Simple dice combat system not available!');
        }
    }
    
    testDiceGame() {
        console.log('🧪 Testing dice game...');
        if (window.microgamesManager) {
            window.microgamesManager.startGame('dice');
        } else {
            console.warn('🧪 Microgames manager not available');
        }
    }
    
    testTrivia() {
        console.log('🧪 Testing trivia...');
        if (window.microgamesManager) {
            window.microgamesManager.startGame('trivia');
        } else {
            console.warn('🧪 Microgames manager not available');
        }
    }
    
    testTetris() {
        console.log('🧪 Testing tetris...');
        if (window.microgamesManager) {
            window.microgamesManager.startGame('tetris');
        } else {
            console.warn('🧪 Microgames manager not available');
        }
    }
    
    testMoralChoice() {
        console.log('🧪 Testing moral choice...');
        if (window.moralChoiceSystem) {
            window.moralChoiceSystem.showMoralChoice({
                title: "Test Cosmic Choice",
                description: "This is a test of the moral choice system. Choose wisely...",
                choices: [
                    {
                        text: "Embrace Chaos",
                        description: "Accept the cosmic chaos",
                        consequences: "Cosmic +20, Ethical -10",
                        alignment: { cosmic: 20, ethical: -10 },
                        color: "#ff00ff",
                        color2: "#cc00cc",
                        borderColor: "#ff0080"
                    },
                    {
                        text: "Seek Order",
                        description: "Strive for cosmic balance",
                        consequences: "Cosmic -10, Ethical +15",
                        alignment: { cosmic: -10, ethical: 15 },
                        color: "#00ff00",
                        color2: "#00cc00",
                        borderColor: "#ffffff"
                    },
                    {
                        text: "Remain Neutral",
                        description: "Avoid taking sides",
                        consequences: "No change",
                        alignment: {},
                        color: "#0080ff",
                        color2: "#0066cc",
                        borderColor: "#00ffff"
                    }
                ],
                onChoice: (index, choice, alignment) => {
                    console.log('⚖️ Test choice completed:', choice.text);
                    if (window.gruesomeNotifications) {
                        window.gruesomeNotifications.show('⚖️ Test Choice', `You chose: ${choice.text}`, 'info');
                    }
                }
            });
        } else {
            console.warn('🧪 Moral choice system not available');
        }
    }
    
    testRandomMoralChoice() {
        console.log('🧪 Testing random moral choice...');
        if (window.moralChoiceSystem) {
            window.moralChoiceSystem.triggerRandomChoice();
        } else {
            console.warn('🧪 Moral choice system not available');
        }
    }
    
    testScreenShake() {
        console.log('🧪 Testing screen shake...');
        if (window.discordEffects) {
            window.discordEffects.triggerScreenShake(15, 800);
        } else {
            console.warn('🧪 Discord effects system not available');
        }
    }
    
    testParticleBurst() {
        console.log('🧪 Testing particle burst...');
        if (window.discordEffects) {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            window.discordEffects.triggerParticleBurst(x, y, 30, '#ff00ff');
        } else {
            console.warn('🧪 Discord effects system not available');
        }
    }
    
    testCosmicRift() {
        console.log('🧪 Testing cosmic rift...');
        if (window.discordEffects) {
            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;
            window.discordEffects.triggerCosmicRift(x, y, 300, 200);
        } else {
            console.warn('🧪 Discord effects system not available');
        }
    }
    
    // Device Testing Methods
    async runDeviceTests() {
        console.log('🧪 Starting comprehensive device testing...');
        this.updateTestResults('Running all tests...');
        
        if (!window.DeviceTestingSuite) {
            this.updateTestResults('❌ Device testing suite not available');
            return;
        }
        
        try {
            const testSuite = new DeviceTestingSuite();
            await testSuite.runAllTests();
            this.displayTestResults(testSuite.testResults);
        } catch (error) {
            console.error('🧪 Device testing failed:', error);
            this.updateTestResults(`❌ Testing failed: ${error.message}`);
        }
    }
    
    async runCoreTests() {
        console.log('🧪 Running core tests only...');
        this.updateTestResults('Running core tests...');
        
        if (!window.DeviceTestingSuite) {
            this.updateTestResults('❌ Device testing suite not available');
            return;
        }
        
        try {
            const testSuite = new DeviceTestingSuite();
            await testSuite.runCoreTests();
            this.displayTestResults(testSuite.testResults);
        } catch (error) {
            console.error('🧪 Core testing failed:', error);
            this.updateTestResults(`❌ Core testing failed: ${error.message}`);
        }
    }
    
    async runPerformanceTests() {
        console.log('🧪 Running performance tests...');
        this.updateTestResults('Running performance tests...');
        
        if (!window.DeviceTestingSuite) {
            this.updateTestResults('❌ Device testing suite not available');
            return;
        }
        
        try {
            const testSuite = new DeviceTestingSuite();
            await testSuite.runPerformanceTests();
            this.displayTestResults(testSuite.testResults);
        } catch (error) {
            console.error('🧪 Performance testing failed:', error);
            this.updateTestResults(`❌ Performance testing failed: ${error.message}`);
        }
    }
    
    exportTestResults() {
        console.log('🧪 Exporting test results...');
        
        if (!window.deviceTestReport) {
            this.updateTestResults('❌ No test results to export');
            return;
        }
        
        try {
            const testSuite = new DeviceTestingSuite();
            testSuite.exportResults();
            this.updateTestResults('✅ Test results exported');
        } catch (error) {
            console.error('🧪 Export failed:', error);
            this.updateTestResults(`❌ Export failed: ${error.message}`);
        }
    }
    
    updateTestResults(message) {
        const resultsDiv = document.getElementById('test-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `<div style="color: #ffd700;">${message}</div>`;
        }
    }
    
    displayTestResults(testResults) {
        const resultsDiv = document.getElementById('test-results');
        if (!resultsDiv) return;
        
        const results = Array.from(testResults.entries());
        const passed = results.filter(([_, r]) => r.status === 'passed').length;
        const failed = results.filter(([_, r]) => r.status === 'failed').length;
        const warnings = results.filter(([_, r]) => r.status === 'warning').length;
        const skipped = results.filter(([_, r]) => r.status === 'skipped').length;
        
        let html = `
            <div style="margin-bottom: 8px; font-weight: bold;">
                📊 Results: ✅ ${passed} | ❌ ${failed} | ⚠️ ${warnings} | ⏭️ ${skipped}
            </div>
        `;
        
        results.forEach(([testName, result]) => {
            const statusIcon = {
                'passed': '✅',
                'failed': '❌',
                'warning': '⚠️',
                'skipped': '⏭️'
            }[result.status] || '❓';
            
            const duration = result.duration ? ` (${result.duration}ms)` : '';
            html += `<div style="margin: 2px 0; font-size: 10px;">
                ${statusIcon} ${testName}${duration}
            </div>`;
        });
        
        resultsDiv.innerHTML = html;
    }
    
    testMultiplayer() {
        console.log('🧪 Testing multiplayer connection...');
        if (window.multiplayerManager) {
            console.log('🌐 Multiplayer status:', {
                connected: window.multiplayerManager.isConnected,
                players: window.multiplayerManager.players.size,
                nearby: window.multiplayerManager.getNearbyPlayersCount()
            });
            
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.showNotification(
                    `Multiplayer: ${window.multiplayerManager.isConnected ? 'Connected' : 'Disconnected'} (${window.multiplayerManager.players.size} players)`,
                    window.multiplayerManager.isConnected ? 'success' : 'warning'
                );
            }
        } else {
            console.warn('🧪 Multiplayer manager not available');
        }
    }
    
    simulateOtherPlayer() {
        console.log('🧪 Simulating other player...');
        if (window.multiplayerManager && window.mapEngine) {
            // Create a simulated player at a random nearby location
            const playerPos = window.mapEngine.playerPosition;
            if (playerPos) {
                const offsetLat = (Math.random() - 0.5) * 0.01; // ~500m offset
                const offsetLng = (Math.random() - 0.5) * 0.01;
                
                const simulatedPlayerData = {
                    position: {
                        lat: playerPos.lat + offsetLat,
                        lng: playerPos.lng + offsetLng
                    },
                    markerConfig: {
                        emoji: ['👤', '🧙', '🧝', '🧚', '🧛'][Math.floor(Math.random() * 5)],
                        color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
                    },
                    steps: Math.floor(Math.random() * 1000),
                    timestamp: Date.now()
                };
                
                const simulatedPlayerId = 'sim_' + Date.now();
                window.multiplayerManager.addPlayer(simulatedPlayerId, simulatedPlayerData);
                
                console.log('🧪 Simulated player added:', simulatedPlayerId);
                
                // Remove after 10 seconds
                setTimeout(() => {
                    window.multiplayerManager.removePlayer(simulatedPlayerId);
                    console.log('🧪 Simulated player removed');
                }, 10000);
            }
        } else {
            console.warn('🧪 Multiplayer manager or map engine not available');
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
                this.locateMe();
            });
        }
        
        // Quest debug buttons removed for mobile optimization
        
        // Add debug buttons for testing
        this.addDebugButtons();
        
        // Initialize button status
        this.updateInventoryStatus();
        this.updateLocateStatus();
        
        // Initialize dev toggle
        this.initializeDevToggle();
        
        // Wire DEV button to toggle debug panel
        const devBtn = document.getElementById('dev-toggle');
        if (devBtn) {
            devBtn.addEventListener('click', () => {
                this.toggleDebugPanel();
            });
        }
        
        // Initialize step currency system
        this.initializeStepSystem();
        
        // Initialize side panel
        this.initializeSidePanel();
        // Setup side panel event listeners
        this.setupSidePanelListeners();
        // Apply current dev mode state after panel exists
        this.toggleDebugElements();
        
        // Initialize control panel
        this.initializeControlPanel();

        // Wire footer flag theme button
        const flagBtn = document.getElementById('flag-theme-btn');
        if (flagBtn) {
            flagBtn.addEventListener('click', () => {
                if (window.mapEngine && typeof window.mapEngine.cycleFlagTheme === 'function') {
                    window.mapEngine.cycleFlagTheme();
                }
            });
        }

        // Enforce step gating for starting investigations
        this.enforceStepGating();
        
        // Initialize debug panel
        // Debug functionality now integrated into side panel
    }

    enforceStepGating() {
        // Guard quest buttons to require 100 steps
        const questButtonIds = ['start-investigation', 'begin-quest', 'start-quest'];
        
        const attachGating = (buttonId) => {
            const btn = document.getElementById(buttonId);
            if (!btn) return;
            if (btn.__gated) return; // avoid duplicate
            btn.__gated = true;
            
            // Add visual lock indicator
            this.updateQuestButtonLockState(btn);
            
            btn.addEventListener('click', (e) => {
                const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
                if (steps < 100) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Show enhanced notification with payment option
                    this.showQuestLockNotification(steps, () => {
                        // Payment callback
                        if (window.stepCurrencySystem) {
                            const paid = window.stepCurrencySystem.subtractSteps(50);
                            if (paid >= 50) {
                                // Allow action by triggering a click again without blocking
                                setTimeout(() => btn.click(), 0);
                                return true;
                            } else {
                                this.showPaymentFailedNotification();
                                return false;
                            }
                        }
                        return false;
                    });
                }
            }, true);
        };
        
        // Attach gating to all quest buttons
        questButtonIds.forEach(attachGating);
        
        // Retry attachment for dynamically created buttons
        setTimeout(() => questButtonIds.forEach(attachGating), 1000);
        
        // Listen for new quest buttons
        document.addEventListener('click', (ev) => {
            if (ev.target && questButtonIds.includes(ev.target.id)) {
                attachGating(ev.target.id);
            }
        });
        
        // Update button states when steps change
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.onStepUpdate = () => {
                questButtonIds.forEach(id => {
                    const btn = document.getElementById(id);
                    if (btn) this.updateQuestButtonLockState(btn);
                });
            };
        }
    }
    
    updateQuestButtonLockState(btn) {
        const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
        const isLocked = steps < 100;
        
        if (isLocked) {
            btn.classList.add('quest-locked');
            btn.title = `Locked - Need 100 steps (${steps}/100) or pay 50 to unlock`;
            // Add lock icon
            if (!btn.querySelector('.lock-icon')) {
                const lockIcon = document.createElement('span');
                lockIcon.className = 'lock-icon';
                lockIcon.textContent = '🔒';
                lockIcon.style.marginRight = '5px';
                btn.insertBefore(lockIcon, btn.firstChild);
            }
        } else {
            btn.classList.remove('quest-locked');
            btn.title = 'Quest unlocked - Begin your investigation';
            const lockIcon = btn.querySelector('.lock-icon');
            if (lockIcon) lockIcon.remove();
        }
    }
    
    showQuestLockNotification(currentSteps, paymentCallback) {
        const stepsNeeded = 100 - currentSteps;
        const message = `Need ${stepsNeeded} more steps to unlock quest. Or pay 50 steps to open now?`;
        
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification({
                type: 'warning',
                title: '🔒 Quest Locked',
                message: message,
                duration: 4000,
                actions: [
                    {
                        text: 'Pay 50 Steps',
                        action: paymentCallback
                    }
                ]
            });
        } else {
            // Fallback to confirm dialog
            const confirmPay = confirm(`🔒 Quest Locked\n\n${message}`);
            if (confirmPay) {
                paymentCallback();
            }
        }
    }
    
    showPaymentFailedNotification() {
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification({
                type: 'error',
                title: '❌ Payment Failed',
                message: 'Not enough steps to pay 50. Keep walking!',
                duration: 3000
            });
        } else {
            alert('❌ Payment Failed\nNot enough steps to pay 50. Keep walking!');
        }
    }
    
    updateInventoryStatus() {
        const inventoryStatus = document.getElementById('inventory-status');
        const inventoryDetails = document.getElementById('inventory-details');
        
        if (inventoryStatus && inventoryDetails) {
            // Get inventory count from inventory system if available
            const itemCount = window.inventorySystem ? window.inventorySystem.items.length : 0;
            const maxItems = 50; // Maximum inventory capacity
            
            if (itemCount === 0) {
                inventoryStatus.textContent = 'Empty';
                inventoryStatus.style.color = '#ff6b6b';
            } else if (itemCount < 5) {
                inventoryStatus.textContent = `${itemCount} items`;
                inventoryStatus.style.color = '#ffa726';
            } else {
                inventoryStatus.textContent = `${itemCount} items`;
                inventoryStatus.style.color = '#4caf50';
            }
            
            // Update details with capacity info
            inventoryDetails.textContent = `${itemCount}/${maxItems} items`;
            
            // Color code based on capacity
            const capacityPercent = (itemCount / maxItems) * 100;
            if (capacityPercent >= 90) {
                inventoryDetails.style.color = '#ff6b6b'; // Red for nearly full
            } else if (capacityPercent >= 70) {
                inventoryDetails.style.color = '#ffa726'; // Orange for getting full
            } else {
                inventoryDetails.style.color = '#4caf50'; // Green for good capacity
            }
        }
    }
    
    updateLocateStatus() {
        const locateStatus = document.getElementById('locate-status');
        const locateDetails = document.getElementById('locate-details');
        
        if (locateStatus && locateDetails) {
            if (this.systems.geolocation) {
                const isEnabled = this.systems.geolocation.isDeviceGPSEnabled();
                const accuracy = this.systems.geolocation.getCurrentAccuracy();
                
                if (isEnabled) {
                    locateStatus.textContent = 'GPS Active';
                    locateStatus.style.color = '#4caf50';
                    locateDetails.textContent = `Accuracy: ${accuracy ? accuracy.toFixed(1) + 'm' : 'Unknown'}`;
                    locateDetails.style.color = '#4caf50';
                } else {
                    locateStatus.textContent = 'GPS Off';
                    locateStatus.style.color = '#ff6b6b';
                    locateDetails.textContent = 'Location disabled';
                    locateDetails.style.color = '#ff6b6b';
                }
            } else {
                locateStatus.textContent = 'GPS Ready';
                locateStatus.style.color = '#ffa726';
                locateDetails.textContent = 'Click to enable';
                locateDetails.style.color = '#ffa726';
            }
        }
    }
    
    initializeDevToggle() {
        console.log('🔧 Initializing dev toggle...');
        
        // Check if we're in production mode
        const isProduction = window.location.hostname !== 'localhost' && 
                           window.location.hostname !== '127.0.0.1' && 
                           !window.location.hostname.includes('dev');
        
        // Start with dev mode disabled in production
        this.devModeEnabled = !isProduction;
        
        const devToggle = document.getElementById('dev-toggle');
        if (devToggle) {
            // Set initial state
            this.updateDevToggleUI();
            
            // Add click handler
            devToggle.addEventListener('click', () => {
                this.toggleDevMode();
            });
            
            console.log('🔧 Dev toggle initialized, production mode:', isProduction);
        } else {
            console.log('🔧 Dev toggle button not found - skipping dev toggle initialization');
        }
    }
    
    toggleDevMode() {
        this.devModeEnabled = !this.devModeEnabled;
        console.log('🔧 Dev mode toggled:', this.devModeEnabled ? 'ON' : 'OFF');
        
        this.updateDevToggleUI();
        this.toggleDebugElements();
    }
    
    updateDevToggleUI() {
        const devToggle = document.getElementById('dev-toggle');
        if (devToggle) {
            if (this.devModeEnabled) {
                devToggle.classList.add('active');
                devToggle.title = 'Developer Mode: ON';
            } else {
                devToggle.classList.remove('active');
                devToggle.title = 'Developer Mode: OFF';
            }
        }
    }
    
    toggleDebugElements() {
        // Do NOT auto-open the debug panel on startup; user must open it via toggle
        const debugPanel = document.getElementById('glassmorphic-side-panel');
        if (debugPanel) {
            // Always keep panel hidden until explicitly opened by the user
            debugPanel.classList.remove('open');
            // Remove inline styles to let CSS handle visibility
            debugPanel.style.display = '';
            debugPanel.style.visibility = '';
            debugPanel.removeAttribute('data-dev-forced-open');
        }
        
        // Toggle debug elements
        const debugElements = document.querySelectorAll('[data-dev-only], [id*="debug"], .debug-btn');
        debugElements.forEach(el => {
            el.style.display = this.devModeEnabled ? '' : 'none';
        });
        
        // Light console cue
        console.log(this.devModeEnabled ? '🔧 Dev mode: ON' : '🔧 Dev mode: OFF');
    }
    
    // Method to check if dev mode should force panel open
    isDevModeForced() {
        return this.devModeEnabled;
    }

    
    cycleLocationMode() {
        console.log('📍 Toggling device GPS...');
        
        if (this.systems.geolocation) {
            // Check if we have a good GPS signal (accuracy <= 50m)
            const hasGoodSignal = this.systems.geolocation.currentPosition && 
                                 this.systems.geolocation.currentPosition.accuracy && 
                                 this.systems.geolocation.currentPosition.accuracy <= 50;
            
            if (hasGoodSignal) {
                // We have good GPS signal, keep GPS enabled for real tracking
                console.log('📍 Good GPS signal detected, keeping GPS enabled for real tracking');
                this.systems.geolocation.deviceGPSEnabled = true;
                this.systems.geolocation.startTracking();
            } else {
                // No good signal, disable GPS and use fixed position (allows Move Here to work)
                console.log('📍 No good GPS signal, switching to fixed position mode (Move Here enabled)');
                this.systems.geolocation.deviceGPSEnabled = false;
                this.systems.geolocation.updateDeviceLocationDisplay('Fixed Position', 'N/A');
            }
            
            this.updateLocationButtonText(this.systems.geolocation.deviceGPSEnabled);
            this.updateLocateStatus();
            this.updateStepDetectionMode();
        } else {
            console.error('📍 Geolocation system not available');
        }
    }
    
    updateLocationAccuracy() {
        // Update locate button details when accuracy changes
        this.updateLocateStatus();
    }
    
    updateInventoryCount() {
        // Update inventory button when items change
        this.updateInventoryStatus();
    }
    
    initializeStepSystem() {
        // Wait for step currency system to be available
        setTimeout(() => {
            if (window.stepCurrencySystem) {
                console.log('🚶‍♂️ Step currency system initialized');
                
                // Ensure step counter exists
                if (!document.getElementById('step-counter')) {
                    console.log('🚶‍♂️ Step counter not found, creating it...');
                    window.stepCurrencySystem.createStepCounter();
                }
                
                // Update location when steps are added (for flag placement)
                const originalAddStep = window.stepCurrencySystem.addStep.bind(window.stepCurrencySystem);
                window.stepCurrencySystem.addStep = () => {
                    originalAddStep();
                    // Update player position for accurate flag placement
                    this.updatePlayerPositionFromGPS();
                };
                
                // Set step detection mode based on GPS status
                this.updateStepDetectionMode();
            } else {
                console.log('🚶‍♂️ Step currency system not available, retrying...');
                // Retry after another second
                setTimeout(() => {
                    this.initializeStepSystem();
                }, 1000);
            }
        }, 1000);
    }
    
    updatePlayerPositionFromGPS() {
        // Force update player position from GPS when steps are added
        if (this.systems.geolocation) {
            this.systems.geolocation.getCurrentPosition(true); // Force update
        }
    }
    
    updateStepDetectionMode() {
        // Update step detection mode based on GPS tracking status
        if (window.stepCurrencySystem && this.systems.geolocation) {
            const geo = this.systems.geolocation;
            const isGPSTracking = typeof geo.isDeviceGPSEnabled === 'function' ? geo.isDeviceGPSEnabled() : !!geo.deviceGPSEnabled;
            if (typeof window.stepCurrencySystem.setStepDetectionMode === 'function') {
                window.stepCurrencySystem.setStepDetectionMode(isGPSTracking);
            }
        }
    }
    
    initializeDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        const debugToggle = document.getElementById('debug-panel-toggle');
        
        if (debugPanel && debugToggle) {
            // Toggle debug panel
            debugToggle.addEventListener('click', () => {
                debugPanel.classList.toggle('open');
                debugToggle.classList.toggle('open');
            });
            
            // Close panel when clicking outside
            document.addEventListener('click', (e) => {
                if (!debugPanel.contains(e.target) && !debugToggle.contains(e.target)) {
                    debugPanel.classList.remove('open');
                    debugToggle.classList.remove('open');
                }
            });
            
            // Setup debug button functionality
            this.setupDebugButtons();
            
            // Update debug status
            this.updateDebugStatus();
            
            // Update debug status every 2 seconds
            setInterval(() => {
                this.updateDebugStatus();
            }, 2000);
        }
    }
    
    setupDebugButtons() {
        console.log('🔧 Setting up debug buttons...');
        
        // Add step buttons
        const addStepBtn = document.getElementById('debug-add-step');
        const add50StepsBtn = document.getElementById('debug-add-50-steps');
        const add100StepsBtn = document.getElementById('debug-add-100-steps');
        
        console.log('🔧 Debug buttons found:', {
            addStep: !!addStepBtn,
            add50: !!add50StepsBtn,
            add100: !!add100StepsBtn
        });
        
        if (addStepBtn) {
            addStepBtn.addEventListener('click', () => {
                if (window.stepCurrencySystem) {
                    window.stepCurrencySystem.addManualStep();
                }
            });
        }
        
        if (add50StepsBtn) {
            add50StepsBtn.addEventListener('click', () => {
                if (window.stepCurrencySystem) {
                    for (let i = 0; i < 50; i++) {
                        window.stepCurrencySystem.addManualStep();
                    }
                }
            });
        }
        
        if (add100StepsBtn) {
            add100StepsBtn.addEventListener('click', () => {
                if (window.stepCurrencySystem) {
                    for (let i = 0; i < 100; i++) {
                        window.stepCurrencySystem.addManualStep();
                    }
                }
            });
        }
        
        // Game control buttons
        const resetStepsBtn = document.getElementById('debug-reset-steps');
        const clearFlagsBtn = document.getElementById('debug-clear-flags');
        const testLocationBtn = document.getElementById('debug-test-location');
        
        if (resetStepsBtn) {
            resetStepsBtn.addEventListener('click', () => {
                if (window.stepCurrencySystem) {
                    window.stepCurrencySystem.totalSteps = 0;
                    window.stepCurrencySystem.sessionSteps = 0;
                    window.stepCurrencySystem.saveSteps();
                    window.stepCurrencySystem.updateStepCounter();
                }
            });
        }
        
        if (clearFlagsBtn) {
            clearFlagsBtn.addEventListener('click', () => {
                if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                    window.mapEngine.finnishFlagLayer.flagPins = [];
                    window.mapEngine.finnishFlagLayer.render();
                }
            });
        }
        
        if (testLocationBtn) {
            testLocationBtn.addEventListener('click', () => {
                if (this.systems.geolocation) {
                    this.systems.geolocation.getCurrentPosition(true);
                }
            });
        }
    }
    
    updateDebugStatus() {
        // Update step detection status
        const stepStatusEl = document.getElementById('debug-step-status');
        if (stepStatusEl && window.stepCurrencySystem) {
            const stats = window.stepCurrencySystem.getStepStats();
            stepStatusEl.textContent = stats.detectionActive ? 'Active' : 'Inactive';
            stepStatusEl.className = `stat-value ${stats.detectionActive ? 'accuracy' : ''}`;
        }
        
        // Update GPS status
        const gpsStatusEl = document.getElementById('debug-gps-status');
        if (gpsStatusEl && this.systems.geolocation) {
            const isEnabled = this.systems.geolocation.isDeviceGPSEnabled();
            gpsStatusEl.textContent = isEnabled ? 'Active' : 'Inactive';
            gpsStatusEl.className = `stat-value ${isEnabled ? 'accuracy' : ''}`;
        }
        
        // Update map engine status
        const mapStatusEl = document.getElementById('debug-map-status');
        if (mapStatusEl) {
            mapStatusEl.textContent = 'Ready';
            mapStatusEl.className = 'stat-value accuracy';
        }
    }
    
    initializeSidePanel() {
        console.log('⚙️ Initializing side panel...');
        
        // Add a small delay to ensure DOM is fully loaded
        setTimeout(() => {
            const sidePanel = document.getElementById('glassmorphic-side-panel');
            
            console.log('⚙️ Side panel found:', !!sidePanel);
            
            if (sidePanel) {
                console.log('⚙️ Side panel initialized successfully');
                // Side panel content is already in HTML, no need to inject
            } else {
                console.error('⚙️ Side panel not found!');
            }
        }, 100);
    }
    
    initializeControlPanel() {
        console.log('🎮 Initializing control panel...');
        
        // Update location display
        this.updateLocationDisplay();
        
        console.log('🎮 Control panel initialized');
    }
    
    updateLocationDisplay() {
        const locationDisplayHeader = document.getElementById('location-display-header');
        const accuracyDisplayHeader = document.getElementById('accuracy-display-header');
        
        if (this.systems.geolocation) {
            const position = this.systems.geolocation.getCurrentPositionSafe();
            if (position) {
                if (locationDisplayHeader) {
                    locationDisplayHeader.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                }
                if (accuracyDisplayHeader) {
                    accuracyDisplayHeader.textContent = `Accuracy: ${position.accuracy ? position.accuracy.toFixed(1) + 'm' : 'Unknown'}`;
                }
            } else {
                if (locationDisplayHeader) {
                    locationDisplayHeader.textContent = 'Getting location...';
                }
                if (accuracyDisplayHeader) {
                    accuracyDisplayHeader.textContent = 'Accuracy: --';
                }
            }
        }
    }
    
    toggleSidePanel() {
        const sidePanel = document.getElementById('glassmorphic-side-panel');
        const devBtn = document.getElementById('dev-toggle');
        
        if (sidePanel) {
            console.log('⚙️ Toggling side panel...');
            const isOpen = sidePanel.classList.contains('open');
            console.log('⚙️ Current panel state:', isOpen ? 'open' : 'closed');
            
            sidePanel.classList.toggle('open');
            if (devBtn) {
                devBtn.classList.toggle('open');
            }
            
            console.log('⚙️ New panel state:', sidePanel.classList.contains('open') ? 'open' : 'closed');
        } else {
            console.error('⚙️ Side panel not found');
        }
    }

    toggleDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            debugPanel.classList.toggle('hidden');
            console.log('🔧 Debug panel toggled');
        } else {
            console.log('🔧 Debug panel not found, creating it...');
            // Create debug panel if it doesn't exist
            if (window.encounterSystem) {
                window.encounterSystem.createDebugPanel();
            }
        }
    }
    
    // Setup side panel event listeners
    setupSidePanelListeners() {
        // Close button
        const closeBtn = document.getElementById('close-side-panel');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.toggleSidePanel();
            });
        }
        
        // Debug buttons
        const debugToggleBtn = document.getElementById('debug-toggle-btn');
        if (debugToggleBtn) {
            debugToggleBtn.addEventListener('click', () => {
                this.toggleDebugPanel();
            });
        }
        
        const testQuestBtn = document.getElementById('test-quest-btn');
        if (testQuestBtn) {
            testQuestBtn.addEventListener('click', () => {
                this.testQuestSystem();
            });
        }
        
        const testEncounterBtn = document.getElementById('test-encounter-btn');
        if (testEncounterBtn) {
            testEncounterBtn.addEventListener('click', () => {
                this.testEncounterSystem();
            });
        }
        
        const resetGameBtn = document.getElementById('reset-game-btn');
        if (resetGameBtn) {
            resetGameBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
        
        // Settings toggles
        const soundToggle = document.getElementById('sound-toggle');
        if (soundToggle) {
            soundToggle.addEventListener('change', (e) => {
                console.log('🔊 Sound effects:', e.target.checked ? 'enabled' : 'disabled');
                // Add sound toggle logic here
            });
        }
        
        const particlesToggle = document.getElementById('particles-toggle');
        if (particlesToggle) {
            particlesToggle.addEventListener('change', (e) => {
                console.log('✨ Particle effects:', e.target.checked ? 'enabled' : 'disabled');
                // Add particle toggle logic here
            });
        }
        
        const autosaveToggle = document.getElementById('autosave-toggle');
        if (autosaveToggle) {
            autosaveToggle.addEventListener('change', (e) => {
                console.log('💾 Auto-save:', e.target.checked ? 'enabled' : 'disabled');
                // Add autosave toggle logic here
            });
        }
    }
    
    // Test quest system
    testQuestSystem() {
        console.log('🎭 Testing quest system...');
        if (window.unifiedQuestSystem) {
            window.unifiedQuestSystem.forceShowAllMarkers();
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.show('🎭 Quest Test', 'Quest system test completed!', 'info');
            }
        } else {
            console.error('🎭 Quest system not available');
        }
    }
    
    // Test encounter system
    testEncounterSystem() {
        console.log('⚔️ Testing encounter system...');
        if (window.encounterSystem) {
            // Trigger a test encounter
            window.encounterSystem.triggerTestEncounter();
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.show('⚔️ Encounter Test', 'Encounter system test completed!', 'info');
            }
        } else {
            console.error('⚔️ Encounter system not available');
        }
    }
    
    // Reset game
    resetGame() {
        console.log('🔄 Resetting game...');
        if (confirm('Are you sure you want to reset the game? This will clear all progress.')) {
            // Clear localStorage
            localStorage.clear();
            // Reload the page
            window.location.reload();
        }
    }
    
    updateSidePanel() {
        // Update location data
        if (this.systems.geolocation) {
            const position = this.systems.geolocation.getCurrentPosition();
            const accuracy = this.systems.geolocation.getCurrentAccuracy();
            const isEnabled = this.systems.geolocation.isDeviceGPSEnabled();
            
            const coordsEl = document.getElementById('panel-coordinates');
            const accuracyEl = document.getElementById('panel-accuracy');
            const gpsStatusEl = document.getElementById('panel-gps-status');
            
            if (coordsEl && position) {
                coordsEl.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            }
            if (accuracyEl) {
                accuracyEl.textContent = accuracy ? `${accuracy.toFixed(1)}m` : 'Unknown';
            }
            if (gpsStatusEl) {
                gpsStatusEl.textContent = isEnabled ? 'Enabled' : 'Disabled';
            }
        }
        
        // Update step data
        if (window.stepCurrencySystem) {
            const totalSteps = window.stepCurrencySystem.totalSteps;
            const sessionSteps = window.stepCurrencySystem.sessionSteps;
            
            const totalStepsEl = document.getElementById('panel-total-steps');
            const sessionStepsEl = document.getElementById('panel-session-steps');
            
            if (totalStepsEl) {
                totalStepsEl.textContent = totalSteps.toString();
            }
            if (sessionStepsEl) {
                sessionStepsEl.textContent = sessionSteps.toString();
            }
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
        
        // Add to page
        document.body.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 5000);
    }
    
    showWelcomeScreen() {
        console.log('🌌 Returning to welcome screen');
        if (this.welcomeScreen && this.welcomeScreen.showWelcomeScreen) {
            this.welcomeScreen.showWelcomeScreen();
        } else {
            // Fallback: reload the page to show welcome screen
            window.location.reload();
        }
    }
    
    async initCosmicEffects() {
        try {
            this.systems.cosmicEffects = new CosmicEffects();
            this.systems.cosmicEffects.init();
            return Promise.resolve();
        } catch (e) {
            console.warn('✨ Cosmic effects disabled (WebGL unavailable):', e?.message || e);
            this.systems.cosmicEffects = null;
            // Continue without blocking the rest of the initialization
            return Promise.resolve();
        }
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
        
        // Start tracking automatically
        this.systems.geolocation.startTracking();
        
        // Initialize health bar system first
        this.systems.healthBar = new HealthBar();
        window.healthBar = this.systems.healthBar;
        
        // Initialize tutorial encounter system
        this.systems.tutorialEncounter = new TutorialEncounterSystem();
        this.systems.tutorialEncounter.init();
        
        // Make globally available
        window.tutorialEncounterSystem = this.systems.tutorialEncounter;

        // Initialize map engine
        this.systems.mapEngine = new EnhancedMapEngine();
        
        // Set window.mapEngine immediately after creation for tutorial access
        window.mapEngine = this.systems.mapEngine;
        console.log('🌌 Setting window.mapEngine early for tutorial:', !!window.mapEngine);

        // Set up tutorial start callback immediately after map engine creation
        try {
            const previousOnMapReady = this.systems.mapEngine.onMapReady;
            this.systems.mapEngine.onMapReady = () => {
                if (typeof previousOnMapReady === 'function') {
                    try { previousOnMapReady(); } catch (_) {}
                }
                try {
                    const shouldStartTutorial = localStorage.getItem('eldritch_start_tutorial_encounter') === 'true';
                    console.log('🎓 Tutorial check:', { shouldStartTutorial, tutorialSystem: !!window.tutorialEncounterSystem, hasStartTutorial: !!(window.tutorialEncounterSystem && window.tutorialEncounterSystem.startTutorial) });
                    if (shouldStartTutorial && window.tutorialEncounterSystem && window.tutorialEncounterSystem.startTutorial) {
                        console.log('🎓 Starting tutorial from onMapReady callback');
                        window.tutorialEncounterSystem.startTutorial();
                        localStorage.removeItem('eldritch_start_tutorial_encounter');
                    } else {
                        console.log('🎓 Tutorial not started:', { shouldStartTutorial, tutorialSystem: !!window.tutorialEncounterSystem });
                    }
                } catch (error) {
                    console.warn('🎓 Failed to start tutorial:', error);
                }
            };
        } catch (error) {
            console.warn('🎓 Failed to set up tutorial callback:', error);
        }
        await this.systems.mapEngine.init();
        
        // Initialize raw WebSocket client (presence/positions) only once
        try {
            if (!this.systems.websocket) {
                this.systems.websocket = new WebSocketClient();
                this.systems.websocket.init();
                console.log('🌐 WebSocketClient initialized');
            } else {
                console.log('🌐 WebSocketClient already initialized, skipping');
            }
        } catch (e) {
            console.warn('🌐 WebSocketClient failed to initialize:', e?.message || e);
        }

        // Initialize quest system
        this.systems.quest = new UnifiedQuestSystem();
        this.systems.quest.init();
        
        // Initialize encounter system
        this.systems.encounter = new EncounterSystem();
        this.systems.encounter.init();
        
        // Initialize NPC system
        try {
            this.systems.npc = new NPCSystem();
            this.systems.npc.init();
        } catch (e) {
            console.warn('👥 NPC system failed to initialize:', e?.message || e);
        }

        // Initialize base system
        this.systems.base = new BaseSystem();
        this.systems.base.init();
        
        // Initialize item system
        this.systems.item = new ItemSystem();
        window.itemSystem = this.systems.item;
        
        // Initialize inventory UI
        this.systems.inventoryUI = new InventoryUI();
        this.systems.inventoryUI.init();
        
        // Initialize quest log UI
        this.systems.questLogUI = new QuestLogUI();
        this.systems.questLogUI.init();
        
        // Initialize step currency system
        this.systems.stepCurrency = new StepCurrencySystem();
        this.systems.stepCurrency.init();
        
        // Initialize session persistence
        this.systems.sessionPersistence = new SessionPersistenceManager();
        this.systems.sessionPersistence.init();
        
        // Initialize multiplayer manager (connect to WS)
        this.systems.multiplayer = new MultiplayerManager();
        try {
            this.systems.multiplayer.initialize();
        } catch (_) {
            this.systems.multiplayer.init();
        }
        
        // Initialize moral choice system
        this.systems.moralChoice = new MoralChoiceSystem();
        this.systems.moralChoice.init();
        
        // Initialize discord effects system
        this.systems.discordEffects = new DiscordEffectsSystem();
        this.systems.discordEffects.init();
        
        // Initialize microgames manager
        this.systems.microgames = new MicrogamesManager();
        this.systems.microgames.init();
        
        // Initialize statistics
        this.systems.statistics = new StatisticsManager();
        this.systems.statistics.init();
        
        // Initialize NPC system
        this.systems.npc = new NPCSystem();
        this.systems.npc.init();
        
        // Initialize path painting system
        this.systems.pathPainting = new PathPaintingSystem();
        this.systems.pathPainting.init();
        
        // Initialize Finnish flag generator
        this.systems.finnishFlagGenerator = new FinnishFlagGenerator();
        this.systems.finnishFlagGenerator.init();
        
        // Initialize WebGL vector renderer (with proper WebGL context)
        try {
            const canvas = document.getElementById('map-canvas');
            const gl = canvas ? canvas.getContext('webgl') || canvas.getContext('experimental-webgl') : null;
            if (gl) {
                this.systems.webglVectorRenderer = new WebGLVectorRenderer(gl, canvas);
            } else {
                console.warn('🎨 WebGL not available, skipping vector renderer');
                this.systems.webglVectorRenderer = null;
            }
        } catch (error) {
            console.warn('🎨 Failed to initialize WebGL vector renderer:', error);
            this.systems.webglVectorRenderer = null;
        }
        
        // Initialize enhanced path painting system
        this.systems.enhancedPathPainting = new EnhancedPathPaintingSystem();
        this.systems.enhancedPathPainting.init();
        
        // Initialize Finnish flag canvas layer
        this.systems.finnishFlagCanvasLayer = new FinnishFlagCanvasLayer();
        this.systems.finnishFlagCanvasLayer.init();
        
        // Initialize distortion effects canvas layer
        this.systems.distortionEffectsCanvasLayer = new DistortionEffectsCanvasLayer();
        this.systems.distortionEffectsCanvasLayer.init();
        
        // Initialize tutorial system
        this.systems.tutorial = new TutorialSystem();
        this.systems.tutorial.init();
        
        // Initialize other player simulation
        this.systems.otherPlayerSimulation = new OtherPlayerSimulation();
        this.systems.otherPlayerSimulation.init();
        
        // Initialize sanity distortion
        this.systems.sanityDistortion = new SanityDistortion();
        this.systems.sanityDistortion.init();
        
        // Initialize gruesome notifications
        this.systems.gruesomeNotifications = new GruesomeNotifications();
        
        // Welcome screen already initialized in initWelcomeScreen()
        this.systems.welcomeScreen = this.welcomeScreen;
        
        // Tutorial encounter system already initialized earlier
        
        // Initialize webgl map renderer
        this.systems.webglMapRenderer = new WebGLMapRenderer();
        this.systems.webglMapRenderer.init();
        
        // Initialize webgl map integration
        try {
            this.systems.webglMapIntegration = new WebGLMapIntegration(this.systems.mapEngine);
        } catch (error) {
            console.warn('🌌 Failed to initialize WebGL map integration:', error);
            this.systems.webglMapIntegration = null;
        }

        // Tutorial callback already set up earlier after map engine creation
        
        // Initialize webgl test (if available)
        try {
            if (typeof WebGLTest !== 'undefined') {
                this.systems.webglTest = new WebGLTest();
                this.systems.webglTest.init();
            } else {
                console.warn('🌌 WebGLTest not available, skipping');
                this.systems.webglTest = null;
            }
        } catch (error) {
            console.warn('🌌 Failed to initialize WebGL test:', error);
            this.systems.webglTest = null;
        }
        
        // Initialize mobile wake lock (if on mobile)
        if (this.isMobile && window.mobileWakeLock) {
            try {
                window.mobileWakeLock.enableForGame();
                console.log('📱 Mobile wake lock enabled for game session');
            } catch (e) {
                console.warn('📱 Failed to enable mobile wake lock:', e);
            }
        }
        
        console.log('🔧 Core systems initialized successfully');
    }
    
    exposeGlobalSystems() {
        // Make all systems globally available for debugging and external access
        window.eldritchApp = this;
        window.cosmicEffects = this.systems.cosmicEffects;
        window.sanityDistortion = this.systems.sanityDistortion;
        window.geolocationManager = this.systems.geolocation;
        window.mapEngine = this.systems.mapEngine;
        console.log('🌌 Setting window.mapEngine:', !!window.mapEngine);
        console.log('🌌 Map engine instance:', window.mapEngine);
        window.investigationSystem = this.systems.investigation;
        window.websocketClient = this.systems.websocket;
        window.baseSystem = this.systems.base;
        window.encounterSystem = this.systems.encounter;
        window.npcSystem = this.systems.npc;
        window.app = this; // Make app instance globally available
    }
    
    setupSystemIntegration() {
        // Geolocation to Map Engine
        this.systems.geolocation.onPositionUpdate = (position) => {
            this.systems.mapEngine.updatePlayerPosition(position);
            this.systems.websocket.sendPositionUpdate(position);
            
            // Update investigation system if available
            if (this.systems.investigation && this.systems.investigation.updateInvestigationProgress) {
                this.systems.investigation.updateInvestigationProgress(position);
            }
            
            // Update encounter system with position for step tracking
            if (this.systems.encounter) {
                this.systems.encounter.updatePlayerPosition(position);
            }
        };
        
        // Map Engine to Quest System
        this.systems.mapEngine.onPlayerMove = (position) => {
            this.systems.quest.updatePlayerPosition(position);
            this.systems.encounter.checkProximityEncounters(position);
        };
        
        // Quest System to Encounter System
        this.systems.quest.onQuestComplete = (quest) => {
            this.systems.encounter.onQuestComplete(quest);
        };
        
        // Encounter System to Map Engine
        this.systems.encounter.onEncounterStart = (encounter) => {
            this.systems.mapEngine.showEncounterMarker(encounter);
        };
        
        // Base System to Map Engine
        this.systems.base.onBaseEstablished = (base) => {
            this.systems.mapEngine.addBaseMarker(base);
        };
        
        // Item System to Inventory UI
        this.systems.item.onItemAdded = (item) => {
            this.systems.inventoryUI.addItem(item);
        };
        
        // Step Currency System to Quest System
        this.systems.stepCurrency.onStepsAdded = (steps) => {
            this.systems.quest.updateStepCount(steps);
        };
        
        // Multiplayer Manager to Map Engine
        this.systems.multiplayer.onPlayerUpdate = (player) => {
            this.systems.mapEngine.updateOtherPlayer(player);
        };
        
        // Moral Choice System to Quest System
        this.systems.moralChoice.onChoiceMade = (choice) => {
            this.systems.quest.updateAlignment(choice.alignment);
        };
        
        // Discord Effects System to Map Engine
        this.systems.discordEffects.onEffectTriggered = (effect) => {
            this.systems.mapEngine.triggerEffect(effect);
        };
        
        // Microgames Manager to Quest System
        this.systems.microgames.onGameComplete = (game) => {
            this.systems.quest.updateGameProgress(game);
        };
        
        // Statistics to Map Engine
        this.systems.statistics.onStatUpdate = (stat) => {
            this.systems.mapEngine.updateStatDisplay(stat);
        };
        
        // NPC System to Map Engine
        this.systems.npc.onNPCCreate = (npc) => {
            this.systems.mapEngine.addNPCMarker(npc);
        };
        
        // Path Painting System to Map Engine
        this.systems.pathPainting.onPathUpdate = (path) => {
            this.systems.mapEngine.updatePathDisplay(path);
        };
        
        // Finnish Flag Generator to Map Engine
        this.systems.finnishFlagGenerator.onFlagCreate = (flag) => {
            this.systems.mapEngine.addFlagMarker(flag);
        };
        
        // WebGL Vector Renderer to Map Engine
        if (this.systems.webglVectorRenderer) {
            this.systems.webglVectorRenderer.onRenderComplete = (data) => {
                if (this.systems.mapEngine && this.systems.mapEngine.updateWebGLDisplay) {
                    this.systems.mapEngine.updateWebGLDisplay(data);
                }
            };
        }
        
        // Enhanced Path Painting System to Map Engine
        this.systems.enhancedPathPainting.onPathUpdate = (path) => {
            this.systems.mapEngine.updateEnhancedPathDisplay(path);
        };
        
        // Finnish Flag Canvas Layer to Map Engine
        this.systems.finnishFlagCanvasLayer.onLayerUpdate = (layer) => {
            this.systems.mapEngine.updateFlagLayer(layer);
        };
        
        // Distortion Effects Canvas Layer to Map Engine
        this.systems.distortionEffectsCanvasLayer.onEffectUpdate = (effect) => {
            this.systems.mapEngine.updateDistortionLayer(effect);
        };
        
        // Other Player Simulation to Map Engine
        if (this.systems.otherPlayerSimulation) {
            this.systems.otherPlayerSimulation.onPlayerSimulate = (player) => {
                if (this.systems.mapEngine && this.systems.mapEngine.simulateOtherPlayer) {
                    this.systems.mapEngine.simulateOtherPlayer(player);
                }
            };
        }
        
        // Sanity Distortion to Map Engine
        if (this.systems.sanityDistortion) {
            this.systems.sanityDistortion.onDistortionTrigger = (distortion) => {
                if (this.systems.mapEngine && this.systems.mapEngine.triggerDistortion) {
                    this.systems.mapEngine.triggerDistortion(distortion);
                }
            };
        }
        
        // Gruesome Notifications to Map Engine
        if (this.systems.gruesomeNotifications) {
            this.systems.gruesomeNotifications.onNotificationShow = (notification) => {
                if (this.systems.mapEngine && this.systems.mapEngine.showNotification) {
                    this.systems.mapEngine.showNotification(notification);
                }
            };
        }
        
        // Welcome Screen to Map Engine
        if (this.systems.welcomeScreen) {
            this.systems.welcomeScreen.onWelcomeComplete = () => {
                if (this.systems.mapEngine) {
                    this.systems.mapEngine.initializeMap();
                }
            };
        }
        
        // WebGL Map Renderer to Map Engine
        if (this.systems.webglMapRenderer) {
            this.systems.webglMapRenderer.onRenderComplete = (data) => {
                if (this.systems.mapEngine && this.systems.mapEngine.updateWebGLMap) {
                    this.systems.mapEngine.updateWebGLMap(data);
                }
            };
        }
        
        // WebGL Map Integration to Map Engine
        this.systems.webglMapIntegration.onIntegrationComplete = (data) => {
            this.systems.mapEngine.updateWebGLIntegration(data);
        };
        
        // WebGL Test to Map Engine
        if (this.systems.webglTest) {
            this.systems.webglTest.onTestComplete = (data) => {
                if (this.systems.mapEngine && this.systems.mapEngine.updateWebGLTest) {
                    this.systems.mapEngine.updateWebGLTest(data);
                }
            };
        }
        
        console.log('🔧 System integration setup complete');
    }
    
    async loadInitialData() {
        // Load mystery zones
        this.loadMysteryZones();
        
        // Start geolocation tracking automatically
        console.log('📍 Starting geolocation tracking...');
        this.systems.geolocation.startTracking();
    }
    
    loadMysteryZones() {
        if (this.systems.investigation && this.systems.investigation.getMysteryZones) {
            const zones = this.systems.investigation.getMysteryZones();
            if (this.systems.mapEngine && this.systems.mapEngine.addMysteryZoneMarkers) {
                this.systems.mapEngine.addMysteryZoneMarkers(zones);
            }
        } else {
            console.log('🔍 Investigation system not available, skipping mystery zones');
        }
        
        // Update zone count in info panel
        const zoneCountElement = document.getElementById('zone-count');
        if (zoneCountElement) {
            const zoneCount = this.systems.investigation && this.systems.investigation.getMysteryZones ? 
                this.systems.investigation.getMysteryZones().length : 0;
            zoneCountElement.textContent = zoneCount;
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
            
            // Start NPC movement simulation
            this.systems.npc.startSimulation();
            
            console.log('👥 NPCs loaded and movement started successfully');
        } catch (error) {
            console.error('👥 Error loading NPCs:', error);
        }
    }
    
    showNotification(message) {
        console.log('📢 Notification:', message);
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
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
            console.error('📍 Geolocation system not available');
            this.showError('Geolocation system not available');
        }
    }
    
    // Cleanup
    destroy() {
        // Disable mobile wake lock
        if (window.mobileWakeLock) {
            try {
                window.mobileWakeLock.disableForGame();
                console.log('📱 Mobile wake lock disabled');
            } catch (e) {
                console.warn('📱 Failed to disable mobile wake lock:', e);
            }
        }
        
        Object.values(this.systems).forEach(system => {
            if (system && typeof system.destroy === 'function') {
                system.destroy();
            }
        });
        
        this.systems = {};
        this.isInitialized = false;
    }
}

// Global app instance and bootstrap
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new EldritchSanctuaryApp();
    app.init();
});

window.addEventListener('beforeunload', () => {
    if (app) {
        try { app.destroy(); } catch (_) {}
    }
});

document.addEventListener('visibilitychange', () => {
    if (!app || !app.isReady()) return;
});

// Lightweight docked/draggable panel manager
class DockedPanelManager {
    constructor() {
        this.container = null;
        this.ensureContainer();
        this.panels = new Map();
    }
    
    ensureContainer() {
        if (this.container) return;
        let container = document.getElementById('docked-panels');
        if (!container) {
            container = document.createElement('div');
            container.id = 'docked-panels';
            container.style.cssText = `
                position: fixed; right: 0; top: 60px; bottom: 0; width: 340px; max-width: 85vw;
                display: flex; flex-direction: column; gap: 10px; padding: 10px; z-index: 1001;
                pointer-events: none; /* panels will re-enable */
            `;
            document.body.appendChild(container);
        }
        this.container = container;
    }
    
    createPanel(id, title, content, options = {}) {
        const { width = 320, height = 200, draggable = true, dockable = true } = options;
        
        const panel = document.createElement('div');
        panel.id = `panel-${id}`;
        panel.className = 'docked-panel';
        panel.style.cssText = `
            width: ${width}px; height: ${height}px; background: rgba(15, 15, 35, 0.95);
            border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 8px;
            backdrop-filter: blur(10px); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            pointer-events: auto; position: relative; overflow: hidden;
        `;
        
        panel.innerHTML = `
            <div class="panel-header" style="display:flex; justify-content:space-between; align-items:center; padding:8px 12px; background:rgba(0, 255, 255, 0.1); border-bottom:1px solid rgba(0, 255, 255, 0.2);">
                <h4 style="margin:0; color:#00ffff; font-size:0.9rem;">${title}</h4>
                <div style="display:flex; gap:4px;">
                    ${dockable ? '<button class="dock-btn" style="background:none; border:none; color:#00ffff; cursor:pointer; font-size:0.8rem;">📌</button>' : ''}
                    <button class="close-btn" style="background:none; border:none; color:#ff6b6b; cursor:pointer; font-size:0.8rem;">×</button>
                </div>
            </div>
            <div class="panel-body" style="padding:10px; height:${height}px; overflow:auto;">${content}</div>
        `;
        
        this.container.appendChild(panel);
        this.panels.set(id, panel);
        
        // Event listeners
        const closeBtn = panel.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => this.removePanel(id));
        
        if (dockable) {
            const dockBtn = panel.querySelector('.dock-btn');
            dockBtn.addEventListener('click', () => this.toggleDock(id));
        }
        
        if (draggable) {
            this.makeDraggable(panel);
        }
        
        return panel;
    }
    
    makeDraggable(panel) {
        const header = panel.querySelector('.panel-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(panel.style.left) || 0;
            startTop = parseInt(panel.style.top) || 0;
            panel.style.position = 'fixed';
            panel.style.zIndex = '2000';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            panel.style.left = (startLeft + deltaX) + 'px';
            panel.style.top = (startTop + deltaY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }
    
    toggleDock(id) {
        const panel = this.panels.get(id);
        if (!panel) return;
        
        const isDocked = panel.style.position !== 'fixed';
        if (isDocked) {
            panel.style.position = 'fixed';
            panel.style.left = '50%';
            panel.style.top = '50%';
            panel.style.transform = 'translate(-50%, -50%)';
            panel.style.zIndex = '2000';
        } else {
            panel.style.position = 'relative';
            panel.style.left = 'auto';
            panel.style.top = 'auto';
            panel.style.transform = 'none';
            panel.style.zIndex = 'auto';
        }
    }
    
    removePanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            panel.remove();
            this.panels.delete(id);
        }
    }
    
    getPanel(id) {
        return this.panels.get(id);
    }
}

// Lightweight WebAudio sound manager (no external assets)
class SoundManager {
    constructor() {
        this.audioContext = null;
        this.sounds = new Map();
        this.masterVolume = 0.3;
        this.enabled = true;
    }
    
    init() {
        if (this.audioContext) return;
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Sound system initialized, state:', this.audioContext.state);
            
            // Resume audio context if suspended (required for user interaction)
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('🔊 Audio context resumed');
                });
            }
        } catch (e) {
            console.warn('🔊 WebAudio not supported:', e);
        }
    }
    
    playTone(frequency, duration, type = 'sine', volume = 0.1) {
        if (!this.enabled || !this.audioContext) {
            console.warn('🔊 Audio context not available or disabled:', {enabled: this.enabled, audioContext: !!this.audioContext});
            return;
        }
        
        // Ensure audio context is resumed
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                console.log('🔊 Audio context resumed for playback');
                this.playTone(frequency, duration, type, volume);
            });
            return;
        }
        
        console.log(`🔊 Playing tone: ${frequency}Hz, ${duration}s, ${type}, volume: ${volume * this.masterVolume}`);
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(volume * this.masterVolume, this.audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    playNotification() {
        this.playTone(800, 0.2, 'sine', 0.3);
        setTimeout(() => this.playTone(1000, 0.2, 'sine', 0.3), 100);
    }
    
    playError() {
        this.playTone(200, 0.5, 'sawtooth', 0.4);
    }
    
    playSuccess() {
        this.playTone(600, 0.1, 'sine', 0.3);
        setTimeout(() => this.playTone(800, 0.1, 'sine', 0.3), 50);
        setTimeout(() => this.playTone(1000, 0.2, 'sine', 0.3), 100);
    }
    
    playEerieHum(options = {}) {
        const duration = options.duration || 2.0;
        const volume = options.volume || 0.2;
        
        // Create a low-frequency eerie hum
        this.playTone(60, duration, 'sine', volume);
        setTimeout(() => this.playTone(80, duration * 0.8, 'sine', volume * 0.7), 200);
        setTimeout(() => this.playTone(100, duration * 0.6, 'sine', volume * 0.5), 400);
    }

    playSound(soundName) {
        // Generic sound player that maps sound names to appropriate methods
        switch(soundName) {
            case 'step_sound':
                this.playTone(400, 0.1, 'sine', 0.3);
                break;
            case 'quest_complete':
                this.playQuestComplete();
                break;
            case 'combat_win':
                this.playSuccess();
                break;
            case 'combat_lose':
                this.playError();
                break;
            case 'ambient_hum':
                this.playEerieHum();
                break;
            default:
                console.warn('Unknown sound:', soundName);
                this.playTone(440, 0.2, 'sine', 0.3);
        }
    }

    // Quest-related cues used by UnifiedQuestSystem
    playQuestOpen() {
        // rising triad
        this.playTone(523.25, 0.08, 'sine', 0.3); // C5
        setTimeout(() => this.playTone(659.25, 0.10, 'sine', 0.3), 60); // E5
        setTimeout(() => this.playTone(783.99, 0.14, 'sine', 0.3), 120); // G5
    }

    playQuestComplete() {
        // short success fanfare
        this.playTone(880.0, 0.10, 'triangle', 0.4);
        setTimeout(() => this.playTone(1174.66, 0.12, 'triangle', 0.4), 90);
        setTimeout(() => this.playTone(1046.50, 0.20, 'triangle', 0.5), 180);
    }
    
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }
    
    setEnabled(enabled) {
        this.enabled = enabled;
    }
}
