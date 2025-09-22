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
        
        // Hide debug elements
        this.hideDebugElements();
        
        // Create mobile header
        this.createMobileHeader();
        
        // Create mobile controls
        this.createMobileControls();
        
        // Optimize map for mobile
        this.optimizeMapForMobile();
        
        // Disable console logging in production
        this.disableConsoleLogging();
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
        if (!this.isMobile) return;
        
        if (this.systems.encounter) {
            const health = this.systems.encounter.playerStats.health;
            const sanity = this.systems.encounter.playerStats.sanity;
            
            const healthEl = document.getElementById('mobile-health');
            const sanityEl = document.getElementById('mobile-sanity');
            
            if (healthEl) healthEl.textContent = health;
            if (sanityEl) sanityEl.textContent = sanity;
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

        // Initialize lightweight sound manager (no MP3s)
        this.initSoundManager();
        if (this.sound) {
            // Start subtle ambience pulse during exploration
            try { this.sound.startAmbiencePulse({ intervalMs: 14000 }); } catch (e) {}
        }
        
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
            window.soundManager = this.sound;
            console.log('🔊 Sound manager initialized');
        } catch (e) {
            console.warn('🔊 Failed to initialize sound manager', e);
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
                this.systems.npc.npcMarkers.clear();
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
    }
    
    requestLocationWithFallback() {
        const locateBtn = document.getElementById('locate-me-btn');
        const locateText = locateBtn?.querySelector('.locate-text');
        
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
            timeout: 8000, // 8 seconds for the actual request
            maximumAge: 0 // Don't use cached location
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
        const locateText = locateBtn?.querySelector('.locate-text');
        
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
                    timeout: 5000,
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
        
        // Quest debug buttons removed for mobile optimization
        
        // Add debug buttons for testing
        this.addDebugButtons();
        
        // Initialize button status
        this.updateInventoryStatus();
        this.updateLocateStatus();
        
        // Initialize dev toggle
        this.initializeDevToggle();
        
        // Initialize step currency system
        this.initializeStepSystem();
        
        // Initialize side panel
        this.initializeSidePanel();
        // Apply current dev mode state after panel exists
        this.toggleDebugElements();
        
        // Initialize control panel
        this.initializeControlPanel();

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
            console.error('🔧 Dev toggle button not found');
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
        // Toggle debug panel visibility using the 'open' class so it slides in
        const debugPanel = document.getElementById('glassmorphic-side-panel');
        if (debugPanel) {
            if (this.devModeEnabled) {
                debugPanel.classList.add('open');
                debugPanel.style.display = 'block';
                debugPanel.style.visibility = 'visible';
                // Force the panel to stay open by adding a data attribute
                debugPanel.setAttribute('data-dev-forced-open', 'true');
            } else {
                debugPanel.classList.remove('open');
                debugPanel.style.display = 'none';
                debugPanel.style.visibility = 'hidden';
                debugPanel.removeAttribute('data-dev-forced-open');
            }
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
            const isGPSTracking = this.systems.geolocation.isDeviceGPSEnabled();
            window.stepCurrencySystem.setStepDetectionMode(isGPSTracking);
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
            const toggleBtn = document.getElementById('unified-panel-toggle');
            
            console.log('⚙️ Side panel found:', !!sidePanel);
            console.log('⚙️ Toggle button found:', !!toggleBtn);
            console.log('⚙️ Button element:', toggleBtn);
            
            if (sidePanel && toggleBtn) {
                console.log('⚙️ Setting up settings button event listener...');
                
                // Fallback: if panel has no content, inject minimal content so it's visible
                try {
                    const hasContent = sidePanel.innerText && sidePanel.innerText.trim().length > 0;
                    if (!hasContent) {
                        sidePanel.innerHTML = `
                            <button id="panel-close" class="close-btn" style="position:absolute; top:8px; right:8px; z-index:2">×</button>
                            <h3>🌌 Game Stats</h3>
                            <div class="stats-grid">
                                <div class="stat-card"><div class="stat-icon">❤️</div><div class="stat-info"><div class="stat-label">Health</div><div class="stat-value" id="panel-health">100/100</div></div></div>
                                <div class="stat-card"><div class="stat-icon">🧠</div><div class="stat-info"><div class="stat-label">Sanity</div><div class="stat-value" id="panel-sanity">100/100</div></div></div>
                                <div class="stat-card"><div class="stat-icon">🚶‍♂️</div><div class="stat-info"><div class="stat-label">Steps</div><div class="stat-value" id="panel-total-steps">0</div></div></div>
                            </div>
                            <div class="debug-tools"><h4>🔧 Debug Tools</h4><div class="debug-buttons">
                                <button id="debug-add-step" class="debug-btn small">+1 Step</button>
                                <button id="debug-add-50-steps" class="debug-btn small">+50 Steps</button>
                                <button id="debug-add-100-steps" class="debug-btn small">+100 Steps</button>
                                <button id="debug-reset-steps" class="debug-btn small">Reset</button>
                            </div></div>
                            <div class="debug-tools"><h4>🎯 Player Marker</h4><div class="debug-buttons">
                                <select id="marker-emoji" class="debug-btn small" style="background:#1b2a3a; color:#fff; min-width:120px;">
                                    <option>👤</option>
                                    <option>🚩</option>
                                    <option>⭐</option>
                                    <option>🛰️</option>
                                    <option>🧭</option>
                                </select>
                                <input id="marker-color" type="color" class="debug-btn small" value="#00ff00" style="padding:4px 6px; min-width:60px;" />
                                <button id="apply-marker" class="debug-btn small">Apply</button>
                            </div></div>
                        `;
                    }
                    // Ensure a close button exists even if content wasn't injected
                    if (!sidePanel.querySelector('#panel-close')) {
                        const closeBtn = document.createElement('button');
                        closeBtn.id = 'panel-close';
                        closeBtn.className = 'close-btn';
                        closeBtn.textContent = '×';
                        closeBtn.style.position = 'absolute';
                        closeBtn.style.top = '8px';
                        closeBtn.style.right = '8px';
                        closeBtn.style.zIndex = '2';
                        sidePanel.appendChild(closeBtn);
                    }

                    // Ensure player marker controls exist even if panel already had content
                    if (!sidePanel.querySelector('#marker-emoji') || !sidePanel.querySelector('#marker-color')) {
                        const tools = document.createElement('div');
                        tools.className = 'debug-tools';
                        tools.innerHTML = `
                            <h4>🎯 Player Marker</h4>
                            <div class="debug-buttons">
                                <select id="marker-emoji" class="debug-btn small" style="background:#1b2a3a; color:#fff; min-width:120px;">
                                    <option>👤</option>
                                    <option>🚩</option>
                                    <option>⭐</option>
                                    <option>🛰️</option>
                                    <option>🧭</option>
                                </select>
                                <input id="marker-color" type="color" class="debug-btn small" value="#00ff00" style="padding:4px 6px; min-width:60px;" />
                                <button id="apply-marker" class="debug-btn small">Apply</button>
                            </div>
                        `;
                        sidePanel.appendChild(tools);
                    }
                } catch (e) {
                    console.warn('⚙️ Could not probe/inject side panel content:', e);
                }

                // Toggle side panel
                toggleBtn.addEventListener('click', (e) => {
                    console.log('⚙️ Settings button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = sidePanel.classList.contains('open');
                    console.log('⚙️ Current panel state:', isOpen ? 'open' : 'closed');
                    
                    // If dev mode is forced open, don't allow manual toggle
                    if (this.isDevModeForced()) {
                        console.log('⚙️ Dev mode forced open - ignoring manual toggle');
                        return;
                    }
                    
                    sidePanel.classList.toggle('open');
                    toggleBtn.classList.toggle('open');
                    
                    console.log('⚙️ New panel state:', sidePanel.classList.contains('open') ? 'open' : 'closed');
                });
                
                console.log('⚙️ Settings button event listener attached successfully');

                // Close button inside panel
                const panelCloseBtn = sidePanel.querySelector('#panel-close');
                if (panelCloseBtn) {
                    panelCloseBtn.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        // If dev mode is forcing panel open, disable it so user can close
                        if (this.isDevModeForced()) {
                            this.devModeEnabled = false;
                            this.updateDevToggleUI();
                        }
                        sidePanel.classList.remove('open');
                        toggleBtn.classList.remove('open');
                        // Also hide when explicitly closed
                        sidePanel.style.display = 'none';
                    });
                }

                // Marker customization handlers
                const applyBtn = sidePanel.querySelector('#apply-marker');
                const emojiSel = sidePanel.querySelector('#marker-emoji');
                const colorInp = sidePanel.querySelector('#marker-color');
                if (applyBtn && emojiSel && colorInp) {
                    // Initialize controls from stored values
                    try {
                        const storedEmoji = localStorage.getItem('playerMarkerEmoji');
                        const storedColor = localStorage.getItem('playerMarkerColor');
                        if (storedEmoji) emojiSel.value = storedEmoji;
                        if (storedColor) colorInp.value = storedColor;
                    } catch (e) {}
                    applyBtn.addEventListener('click', () => {
                        const cfg = { emoji: emojiSel.value, color: colorInp.value };
                        if (window.mapEngine && typeof window.mapEngine.setPlayerMarkerConfig === 'function') {
                            window.mapEngine.setPlayerMarkerConfig(cfg);
                        } else {
                            localStorage.setItem('playerMarkerEmoji', cfg.emoji);
                            localStorage.setItem('playerMarkerColor', cfg.color);
                        }
                    });
                }
            
            // Close panel when clicking outside (unless dev mode is forced)
            document.addEventListener('click', (e) => {
                if (!sidePanel.contains(e.target) && !toggleBtn.contains(e.target)) {
                    // Don't close if dev mode is forcing it open
                    if (!this.isDevModeForced()) {
                        sidePanel.classList.remove('open');
                        toggleBtn.classList.remove('open');
                    }
                }
            });
            
            // Initialize panel data
            this.updateSidePanel();
            
            // Setup debug button functionality
            this.setupDebugButtons();
            
            // Update debug status
            this.updateDebugStatus();
            
            // Update panel every 2 seconds
            setInterval(() => {
                this.updateSidePanel();
                this.updateDebugStatus();
                this.updateLocationDisplay();
                
                // Ensure dev mode state is maintained
                if (this.isDevModeForced()) {
                    const debugPanel = document.getElementById('glassmorphic-side-panel');
                    if (debugPanel && !debugPanel.classList.contains('open')) {
                        console.log('🔧 Re-applying dev mode state to panel');
                        this.toggleDebugElements();
                    }
                }
            }, 2000);
        }
        }, 100); // Close the setTimeout
        
        // Also add a fallback event listener after a longer delay
        setTimeout(() => {
            const toggleBtn = document.getElementById('unified-panel-toggle');
            const sidePanel = document.getElementById('glassmorphic-side-panel');
            
            console.log('⚙️ Fallback check - Button:', toggleBtn);
            console.log('⚙️ Fallback check - Panel:', sidePanel);
            
            if (toggleBtn && sidePanel) {
                console.log('⚙️ Adding fallback event listener to footer button...');
                
                // Add a simple onclick handler as backup
                toggleBtn.onclick = function(e) {
                    console.log('⚙️ ONCLICK settings button clicked!');
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Test alert to confirm click is working
                    alert('Settings button clicked! Panel should open now.');
                    
                    sidePanel.classList.toggle('open');
                    toggleBtn.classList.toggle('open');
                    
                    console.log('⚙️ ONCLICK panel state:', sidePanel.classList.contains('open') ? 'open' : 'closed');
                };
                
                console.log('⚙️ ONCLICK event listener attached');
            } else {
                console.log('⚙️ Footer button or panel not found:', {
                    button: !!toggleBtn,
                    panel: !!sidePanel
                });
            }
        }, 1000);
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
                // Show getting location message if no position available
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
        const toggleBtn = document.getElementById('unified-panel-toggle');
        
        if (sidePanel && toggleBtn) {
            console.log('⚙️ Toggling side panel...');
            const isOpen = sidePanel.classList.contains('open');
            console.log('⚙️ Current panel state:', isOpen ? 'open' : 'closed');
            
            sidePanel.classList.toggle('open');
            toggleBtn.classList.toggle('open');
            
            console.log('⚙️ New panel state:', sidePanel.classList.contains('open') ? 'open' : 'closed');
        } else {
            console.error('⚙️ Side panel or toggle button not found');
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
                gpsStatusEl.textContent = isEnabled ? 'Active' : 'Off';
                gpsStatusEl.className = `stat-value ${isEnabled ? 'accuracy' : ''}`;
            }
        }
        
        // Update player stats
        const healthEl = document.getElementById('panel-health');
        const sanityEl = document.getElementById('panel-sanity');
        const inventoryEl = document.getElementById('panel-inventory');
        
        if (healthEl) {
            const healthValue = document.getElementById('health-value');
            if (healthValue) {
                healthEl.textContent = healthValue.textContent;
            }
        }
        
        if (sanityEl) {
            const sanityValue = document.getElementById('sanity-value');
            if (sanityValue) {
                sanityEl.textContent = sanityValue.textContent;
            }
        }
        
        if (inventoryEl) {
            const inventoryStatus = document.getElementById('inventory-status');
            if (inventoryStatus) {
                inventoryEl.textContent = inventoryStatus.textContent;
            }
        }
        
        // Update step data
        if (window.stepCurrencySystem) {
            const stats = window.stepCurrencySystem.getStepStats();
            const totalStepsEl = document.getElementById('panel-total-steps');
            const sessionStepsEl = document.getElementById('panel-session-steps');
            const nextFlagEl = document.getElementById('panel-next-flag');
            
            if (totalStepsEl) {
                totalStepsEl.textContent = stats.totalSteps.toLocaleString();
            }
            
            if (sessionStepsEl) {
                sessionStepsEl.textContent = stats.sessionSteps.toLocaleString();
            }
            
            if (nextFlagEl) {
                const stepsToNextFlag = 50 - (stats.sessionSteps % 50);
                nextFlagEl.textContent = `${stepsToNextFlag} steps`;
            }
        }
        
        // Update connection status
        const connectionEl = document.getElementById('panel-connection');
        const playersEl = document.getElementById('panel-players');
        
        if (connectionEl) {
            connectionEl.textContent = 'Connected';
            connectionEl.className = 'stat-value accuracy';
        }
        
        if (playersEl) {
            playersEl.textContent = '1';
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
            this.systems.cosmicEffects = new CosmicEffects();
            this.systems.cosmicEffects.init();
        return Promise.resolve();
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
        
        // Make geolocation manager globally available
        window.geolocationManager = this.systems.geolocation;
        
        // Connect geolocation to encounter system for step tracking
        this.systems.geolocation.onPositionUpdate = (position) => {
            if (this.systems.encounter) {
                this.systems.encounter.handlePositionUpdate(position);
            }
            
            // Update mobile UI
            this.updateMobileLocationInfo();
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
        
        // Initialize unified quest system (will create markers after map is ready)
        this.systems.unifiedQuest = new UnifiedQuestSystem();
        this.systems.unifiedQuest.init();
        
        // Make unified quest system globally available
        window.unifiedQuestSystem = this.systems.unifiedQuest;
        console.log('🎭 Unified quest system initialized');
        
        // Initialize NPC system
        this.systems.npc = new NPCSystem();
        this.systems.npc.init();
        
        // Make NPC system globally available
        window.npcSystem = this.systems.npc;
        
        // Initialize enhanced path painting system with vector graphics
        this.systems.pathPainting = new EnhancedPathPaintingSystem();
        this.systems.pathPainting.init();
        
        // Make path painting system globally available
        window.pathPaintingSystem = this.systems.pathPainting;
        
        // Initialize other player simulation
        this.systems.otherPlayerSimulation = new OtherPlayerSimulation();
        this.systems.otherPlayerSimulation.init();
        
        // Make other player simulation globally available
        window.otherPlayerSimulation = this.systems.otherPlayerSimulation;
        
        // Initialize sanity distortion system
        this.systems.sanityDistortion = new SanityDistortion();
        window.sanityDistortion = this.systems.sanityDistortion;
        console.log('🧠 Sanity distortion system initialized');
        
        // Initialize gruesome notifications
        this.systems.gruesomeNotifications = new GruesomeNotifications();
        window.gruesomeNotifications = this.systems.gruesomeNotifications;
        console.log('💀 Gruesome notifications system initialized');
        
        // Initialize enhanced map engine with WebGL support
        this.systems.mapEngine = new EnhancedMapEngine();
        console.log('🗺️ Enhanced map engine created:', !!this.systems.mapEngine);
        
        // Debug functionality now integrated into side panel
        
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
            this.createQuestMarkers();
            
            // Handle pending base if map wasn't ready when base was established
            if (this.pendingBase) {
                console.log('🏗️ Rendering pending base:', this.pendingBase);
                this.systems.mapEngine.addPlayerBaseMarker(this.pendingBase);
                this.showNotification(`🏗️ Base "${this.pendingBase.name}" rendered!`, 'success');
                this.pendingBase = null;
            }
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
                // If accuracy is poor or unknown, center anyway immediately
                        console.log('📍 Centering map on GPS position (poor accuracy):', position);
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
            console.log('🏗️ Base established callback triggered:', base);
            if (this.systems.mapEngine && this.systems.mapEngine.map) {
                this.systems.mapEngine.addPlayerBaseMarker(base);
                this.showNotification(`🏗️ Base "${base.name}" established!`, 'success');
            } else {
                console.log('🏗️ Map engine not ready, storing base for later rendering');
                // Store base for later rendering when map is ready
                this.pendingBase = base;
            }
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
        
        // Start geolocation tracking automatically
        console.log('📍 Starting geolocation tracking...');
        this.systems.geolocation.startTracking();
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
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--cosmic-darker), var(--cosmic-dark));
            border: 2px solid var(--cosmic-purple);
            color: var(--cosmic-light);
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 0 20px var(--cosmic-glow);
            backdrop-filter: blur(10px);
            animation: slideInCenter 0.3s ease-out;
            max-width: 300px;
            text-align: center;
        `;

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInCenter {
                    from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
                @keyframes slideOutCenter {
                    from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    to { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutCenter 0.3s ease-in';
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
    
    openPanel(id, { title = 'Panel', content = '', height = 320, draggable = true, dock = 'right' } = {}) {
        this.ensureContainer();
        // Close if exists
        this.closePanel(id);
        
        const panel = document.createElement('div');
        panel.className = 'docked-panel';
        panel.style.cssText = `
            pointer-events: auto; background: rgba(12,12,18,0.95); border: 1px solid var(--cosmic-purple);
            border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            overflow: hidden; user-select: none;
        `;
        panel.innerHTML = `
            <div class="panel-header" style="display:flex;align-items:center;justify-content:space-between;padding:8px 10px;background:linear-gradient(135deg,#1a1a2e,#16213e);border-bottom:1px solid var(--cosmic-purple);cursor:move;">
                <div style="font-weight:bold;color:var(--cosmic-purple);font-size:12px;">${title}</div>
                <div>
                    <button class="panel-close" style="background:var(--cosmic-red);color:#fff;border:none;border-radius:6px;padding:4px 8px;font-size:11px;cursor:pointer;">✕</button>
                </div>
            </div>
            <div class="panel-body" style="padding:10px; height:${height}px; overflow:auto;">${content}</div>
        `;
        this.container.appendChild(panel);
        if (window.soundManager) { try { window.soundManager.pauseAmbience('panel'); } catch (e) {} }
        this.panels.set(id, panel);
        
        // Close
        panel.querySelector('.panel-close').addEventListener('click', () => this.closePanel(id));
        
        // Draggable
        if (draggable) this.makeDraggable(panel);
        
        return panel;
    }
    
    updatePanelContent(id, { title, content }) {
        const panel = this.panels.get(id);
        if (!panel) return;
        if (title) panel.querySelector('.panel-header div').textContent = title;
        if (content !== undefined) panel.querySelector('.panel-body').innerHTML = content;
    }
    
    closePanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            panel.remove();
            this.panels.delete(id);
            if (this.panels.size === 0 && window.soundManager) { try { window.soundManager.resumeAmbience('panel'); } catch (e) {} }
        }
    }
    
    makeDraggable(panel) {
        const header = panel.querySelector('.panel-header');
        if (!header) return;
        let isDown = false; let startX = 0; let startY = 0; let startLeft = 0; let startTop = 0;
        panel.style.position = 'fixed';
        panel.style.right = '10px';
        panel.style.top = `${this.container.getBoundingClientRect().top}px`;
        
        const onDown = (e) => {
            isDown = true;
            const rect = panel.getBoundingClientRect();
            startLeft = rect.left; startTop = rect.top;
            startX = (e.touches ? e.touches[0].clientX : e.clientX);
            startY = (e.touches ? e.touches[0].clientY : e.clientY);
            document.addEventListener('mousemove', onMove);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('mouseup', onUp);
            document.addEventListener('touchend', onUp);
        };
        const onMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = (e.touches ? e.touches[0].clientX : e.clientX);
            const y = (e.touches ? e.touches[0].clientY : e.clientY);
            const dx = x - startX; const dy = y - startY;
            panel.style.left = `${startLeft + dx}px`;
            panel.style.top = `${startTop + dy}px`;
            panel.style.right = 'auto';
        };
        const onUp = () => {
            isDown = false;
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.removeEventListener('touchend', onUp);
        };
        header.addEventListener('mousedown', onDown);
        header.addEventListener('touchstart', onDown, { passive: true });
    }
}

// Lightweight WebAudio sound manager (no external assets)
class SoundManager {
	constructor() {
		this.audioCtx = null;
		this.masterGain = null;
		this.ambienceInterval = null;
		this.ambiencePausedReasons = new Set();
		this.init();
	}
	
	init() {
		try {
			const AudioContextRef = window.AudioContext || window.webkitAudioContext;
			this.audioCtx = new AudioContextRef();
			this.masterGain = this.audioCtx.createGain();
			this.masterGain.gain.value = 0.3;
			this.masterGain.connect(this.audioCtx.destination);
		} catch (e) {
			console.warn('🔊 WebAudio not available', e);
		}
	}
	
	// Ensure context resumed on user gesture
	resumeIfNeeded() {
		if (this.audioCtx && this.audioCtx.state === 'suspended') {
			this.audioCtx.resume();
		}
	}
	
	// Basic blip/bling using oscillator
	playBling({ frequency = 880, duration = 0.15, type = 'sine' } = {}) {
		if (!this.audioCtx) return;
		this.resumeIfNeeded();
		const now = this.audioCtx.currentTime;
		const osc = this.audioCtx.createOscillator();
		const gain = this.audioCtx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(frequency, now);
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
		osc.connect(gain).connect(this.masterGain);
		osc.start(now);
		osc.stop(now + duration + 0.02);
	}
	
	// Terrifying bling: descending minor third with noise burst
	playTerrifyingBling() {
		if (!this.audioCtx) return;
		this.resumeIfNeeded();
		const now = this.audioCtx.currentTime;
		// Tone sweep
		const osc = this.audioCtx.createOscillator();
		const gain = this.audioCtx.createGain();
		osc.type = 'sawtooth';
		osc.frequency.setValueAtTime(740, now);
		osc.frequency.exponentialRampToValueAtTime(440, now + 0.4);
		gain.gain.setValueAtTime(0.0001, now);
		gain.gain.exponentialRampToValueAtTime(0.5, now + 0.05);
		gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
		osc.connect(gain).connect(this.masterGain);
		osc.start(now);
		osc.stop(now + 0.5);
		// Noise burst
		const noiseDur = 0.2;
		const noise = this.createNoiseBufferSource(noiseDur);
		const nGain = this.audioCtx.createGain();
		nGain.gain.setValueAtTime(0.0001, now + 0.15);
		nGain.gain.exponentialRampToValueAtTime(0.4, now + 0.2);
		nGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
		noise.connect(nGain).connect(this.masterGain);
		noise.start(now + 0.15);
	}
	
	// Eerie hum: layered detuned oscillators with slow tremolo
	playEerieHum({ duration = 2.5 } = {}) {
		if (!this.audioCtx) return;
		this.resumeIfNeeded();
		const now = this.audioCtx.currentTime;
		const baseFreq = 110;
		const voices = [0, -3, +7].map(semi => baseFreq * Math.pow(2, semi / 12));
		const tremOsc = this.audioCtx.createOscillator();
		const tremGain = this.audioCtx.createGain();
		tremOsc.type = 'sine';
		tremOsc.frequency.setValueAtTime(4.5, now);
		tremGain.gain.value = 0.3;
		tremOsc.connect(tremGain);
		tremOsc.start(now);
		const outGain = this.audioCtx.createGain();
		outGain.gain.setValueAtTime(0.0001, now);
		outGain.gain.exponentialRampToValueAtTime(0.4, now + 0.4);
		outGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
		voices.forEach((f, idx) => {
			const osc = this.audioCtx.createOscillator();
			const vGain = this.audioCtx.createGain();
			osc.type = 'sine';
			osc.frequency.setValueAtTime(f * (1 + (idx - 1) * 0.002), now);
			// Apply tremolo
			tremGain.connect(vGain.gain);
			osc.connect(vGain).connect(outGain).connect(this.masterGain);
			osc.start(now);
			osc.stop(now + duration + 0.1);
		});
		setTimeout(() => tremOsc.stop(), (duration + 0.2) * 1000);
	}
	
	// Short UI ok/cancel
	playOk() { this.playBling({ frequency: 1200, duration: 0.09, type: 'triangle' }); }
	playCancel() { this.playBling({ frequency: 300, duration: 0.12, type: 'square' }); }
	playQuestOpen() { this.playBling({ frequency: 980, duration: 0.14, type: 'sine' }); }
	playQuestComplete() { this.playBling({ frequency: 1560, duration: 0.18, type: 'triangle' }); }
	playWarning() { this.playTerrifyingBling(); }
	
	// Subtle ambience pulse while exploring
	startAmbiencePulse({ intervalMs = 12000 } = {}) {
		if (!this.audioCtx) return;
		this.resumeIfNeeded();
		this.stopAmbiencePulse();
		this.ambienceInterval = setInterval(() => {
			if (this.ambiencePausedReasons.size > 0) return;
			try { this.playEerieHum({ duration: 1.6 }); } catch (e) {}
		}, intervalMs);
	}
	stopAmbiencePulse() {
		if (this.ambienceInterval) {
			clearInterval(this.ambienceInterval);
			this.ambienceInterval = null;
		}
	}
	pauseAmbience(reason = 'generic') {
		this.ambiencePausedReasons.add(reason);
	}
	resumeAmbience(reason = 'generic') {
		if (this.ambiencePausedReasons.has(reason)) this.ambiencePausedReasons.delete(reason);
	}

	// Helpers
	createNoiseBufferSource(duration = 0.2) {
		const sampleRate = this.audioCtx.sampleRate;
		const frameCount = Math.floor(sampleRate * duration);
		const buffer = this.audioCtx.createBuffer(1, frameCount, sampleRate);
		const data = buffer.getChannelData(0);
		for (let i = 0; i < frameCount; i++) {
			data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount); // quick decay
		}
		const source = this.audioCtx.createBufferSource();
		source.buffer = buffer;
		return source;
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
