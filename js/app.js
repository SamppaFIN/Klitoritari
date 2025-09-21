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
    
    addLocationTestButton() {
        // Add a debug button to test location services
        const debugPanel = document.querySelector('.debug-panel');
        if (debugPanel) {
            const testButton = document.createElement('button');
            testButton.textContent = '🧪 Test Location';
            testButton.className = 'debug-btn';
            testButton.style.marginTop = '10px';
            testButton.addEventListener('click', () => {
                this.testLocationServices();
            });
            debugPanel.appendChild(testButton);
        }
    }
    
    addQuestMarkerDebugButton() {
        // Add a test button for quest marker debugging
        const testButton = document.createElement('button');
        testButton.textContent = '🎭 Test Quest Markers';
        testButton.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            z-index: 10000;
            background: var(--cosmic-green);
            color: white;
            border: none;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        `;
        
        testButton.addEventListener('click', () => {
            if (this.systems.unifiedQuest) {
                this.systems.unifiedQuest.forceShowAllMarkers();
            } else {
                console.log('🎭 Quest system not available');
            }
        });
        
        document.body.appendChild(testButton);
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
        
        // Add location test button for debugging
        this.addLocationTestButton();
        
        // Add quest marker debug button
        this.addQuestMarkerDebugButton();
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
            this.createQuestMarkers();
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
