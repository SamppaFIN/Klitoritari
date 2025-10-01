/**
 * Header Integration System
 * Integrates the new header design with existing game systems
 * Following modern mobile-first UI/UX principles
 */

class HeaderIntegration {
    constructor() {
        this.isInitialized = false;
        this.stepCount = 0;
        this.health = 100;
        this.sanity = 100;
        this.playerName = 'Wanderer';
        this.playerLevel = 1;
        
        console.log('🎮 Header Integration: Initializing...');
    }
    
    init() {
        if (this.isInitialized) {
            console.warn('⚠️ Header Integration already initialized');
            return;
        }
        
        this.setupEventListeners();
        this.hydrateFromStorageAndSystems();
        this.ensureProfileBadges();
        this.updateStepCounter();
        this.updateHealthSanity();
        this.updatePlayerName();
        this.updatePlayerLevel();
        this.setupDebugToggle();
        this.startAutoSync();
        
        this.isInitialized = true;
        console.log('✅ Header Integration: Initialized successfully');
    }
    
    /**
     * Setup event listeners for header interactions
     */
    setupEventListeners() {
        // Step counter click handler
        const stepSection = document.querySelector('.step-section');
        if (stepSection) {
            stepSection.addEventListener('click', () => {
                this.showStepDetails();
            });
            
            stepSection.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showStepDetails();
                }
            });
        }
        
        // GPS location click handler
        const gpsLocation = document.querySelector('.gps-location');
        if (gpsLocation) {
            gpsLocation.addEventListener('click', () => {
                this.requestGPSLocation();
            });
            
            gpsLocation.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.requestGPSLocation();
                }
            });
        }
        
        // Base flag click handler
        const baseFlag = document.querySelector('.base-flag');
        if (baseFlag) {
            baseFlag.addEventListener('click', () => {
                this.showBaseFlagSelection();
            });
            
            baseFlag.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.showBaseFlagSelection();
                }
            });
        }
        
        // Debug toggle handled by setupDebugToggle method
        
        // Health/Sanity click handlers for details
        const healthSection = document.querySelector('.health-section');
        const sanitySection = document.querySelector('.sanity-section');
        
        if (healthSection) {
            healthSection.addEventListener('click', () => {
                this.showHealthDetails();
            });
        }
        
        if (sanitySection) {
            sanitySection.addEventListener('click', () => {
                this.showSanityDetails();
            });
        }
        
        console.log('🎮 Header Integration: Event listeners setup complete');
    }
    
    /**
     * Update step counter display
     */
    updateStepCounter() {
        const stepCountElement = document.getElementById('step-count');
        if (stepCountElement) {
            stepCountElement.textContent = this.stepCount;
            
            // Add visual feedback for step updates
            stepCountElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                stepCountElement.style.transform = 'scale(1)';
            }, 200);
        }
    }
    
    /**
     * Update health and sanity displays
     */
    updateHealthSanity() {
        // Update health
        const healthFill = document.getElementById('health-fill');
        const healthText = document.getElementById('health-text');
        
        if (healthFill && healthText) {
            const healthPercentage = (this.health / 100) * 100;
            healthFill.style.width = `${healthPercentage}%`;
            healthText.textContent = `${this.health}/100`;
            
            // Update health bar color based on health level
            if (this.health > 70) {
                healthFill.style.background = 'linear-gradient(90deg, #4CAF50, #66BB6A)';
            } else if (this.health > 30) {
                healthFill.style.background = 'linear-gradient(90deg, #FF9800, #FFB74D)';
            } else {
                healthFill.style.background = 'linear-gradient(90deg, #f44336, #ef5350)';
            }
        }
        
        // Update sanity
        const sanityFill = document.getElementById('sanity-fill');
        const sanityText = document.getElementById('sanity-text');
        
        if (sanityFill && sanityText) {
            const sanityPercentage = (this.sanity / 100) * 100;
            sanityFill.style.width = `${sanityPercentage}%`;
            sanityText.textContent = `${this.sanity}/100`;
            
            // Update sanity bar color based on sanity level
            if (this.sanity > 70) {
                sanityFill.style.background = 'linear-gradient(90deg, #2196F3, #42A5F5)';
            } else if (this.sanity > 30) {
                sanityFill.style.background = 'linear-gradient(90deg, #FF9800, #FFB74D)';
            } else {
                sanityFill.style.background = 'linear-gradient(90deg, #9C27B0, #BA68C8)';
            }
        }
    }
    
    /**
     * Update player name display
     */
    updatePlayerName() {
        const playerNameElement = document.getElementById('player-name');
        if (playerNameElement) {
            playerNameElement.textContent = this.playerName;
            playerNameElement.title = `Player: ${this.playerName}`;
        }
        // Legacy header name, if present
        const legacyName = document.querySelector('.header-center #player-name');
        if (legacyName) {
            legacyName.textContent = this.playerName;
        }
    }

    /**
     * Update player level badge
     */
    updatePlayerLevel() {
        const levelBadge = document.getElementById('player-level');
        if (levelBadge) {
            levelBadge.textContent = `Lv ${this.playerLevel}`;
            levelBadge.title = `Level ${this.playerLevel}`;
        }
    }
    
    /**
     * Setup debug panel toggle functionality
     */
    setupDebugToggle() {
        const debugToggle = document.getElementById('debug-toggle');
        if (debugToggle) {
            debugToggle.addEventListener('click', () => {
                this.toggleDebugPanel();
            });
        }
        console.log('🔧 Debug toggle setup complete');
    }
    
    /**
     * Toggle debug panel visibility
     */
    toggleDebugPanel() {
        console.log('🔧 Toggling debug panel...');
        
        // Check if debug panel already exists
        let debugPanel = document.getElementById('debug-control-panel');
        
        if (debugPanel) {
            console.log('🔧 Debug panel exists, checking visibility...');
            console.log('🔧 Panel display:', debugPanel.style.display);
            console.log('🔧 Panel visibility:', debugPanel.style.visibility);
            
            // Toggle existing panel
            if (debugPanel.style.display === 'none' || debugPanel.style.visibility === 'hidden') {
                console.log('🔧 Showing existing debug panel');
                this.showDebugPanel(debugPanel);
            } else {
                console.log('🔧 Hiding existing debug panel');
                this.hideDebugPanel(debugPanel);
            }
        } else {
            console.log('🔧 Creating new debug panel');
            // Create new debug panel
            this.createDebugControlPanel();
        }
    }
    
    /**
     * Show debug panel with animation
     */
    showDebugPanel(panel) {
        console.log('🔧 Showing debug panel...');
        panel.style.display = 'flex';
        panel.style.visibility = 'visible';
        panel.style.animation = 'debugPanelSlideDown 0.3s ease-out';
        console.log('🔧 Debug panel shown, display:', panel.style.display, 'visibility:', panel.style.visibility);
    }
    
    /**
     * Hide debug panel with animation
     */
    hideDebugPanel(panel) {
        console.log('🔧 Hiding debug panel...');
        panel.style.animation = 'debugPanelSlideUp 0.3s ease-in';
        
        setTimeout(() => {
            panel.style.display = 'none';
            panel.style.visibility = 'hidden';
            console.log('🔧 Debug panel hidden, display:', panel.style.display, 'visibility:', panel.style.visibility);
        }, 300);
    }
    
    /**
     * Setup inventory button toggle functionality
     */
    setupInventoryToggle() {
        // Find the inventory button in the magnetic tabs
        const inventoryButton = document.querySelector('[data-tab="inventory"], .magnetic-tab[data-tab="inventory"]');
        if (inventoryButton) {
            inventoryButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleInventoryPanel();
            });
        }
        
        // Also check for any existing inventory buttons
        const inventoryButtons = document.querySelectorAll('.inventory-btn, [id*="inventory"]');
        inventoryButtons.forEach(btn => {
            if (btn.addEventListener) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggleInventoryPanel();
                });
            }
        });
        
        console.log('🎒 Inventory toggle setup complete');
    }
    
    /**
     * Toggle inventory panel visibility
     */
    toggleInventoryPanel() {
        console.log('🎒 Toggling inventory panel...');
        
        // Check if we're using Three.js UI system
        if (window.enhancedThreeJSUI && window.enhancedThreeJSUI.switchTab) {
            window.enhancedThreeJSUI.switchTab('inventory');
            return;
        }
        
        // Check if we're using the magnetic tabs system
        if (window.threeJSUILayer && window.threeJSUILayer.switchTab) {
            window.threeJSUILayer.switchTab('inventory');
            return;
        }
        
        // Fallback: Silent integration
    }
    
    /**
     * Create debug control panel that opens downwards from header
     */
    createDebugControlPanel() {
        // Create main debug panel container
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-control-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: var(--header-height);
            left: 50%;
            transform: translateX(-50%);
            width: 90%;
            max-width: 800px;
            max-height: 70vh;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            z-index: 2000;
            display: flex;
            flex-direction: column;
            padding: 20px;
            overflow-y: auto;
            border-radius: 0 0 20px 20px;
            border: 2px solid rgba(0, 255, 255, 0.3);
            border-top: none;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            animation: debugPanelSlideDown 0.3s ease-out;
        `;
        
        // Create header
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        `;
        
        const title = document.createElement('h2');
        title.textContent = '🔧 Debug Control Panel';
        title.style.cssText = `
            color: #00ffff;
            margin: 0;
            font-size: 1.5rem;
            text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            background: #ff4444;
            color: white;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 1.5rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        `;
        closeBtn.addEventListener('click', () => {
            this.hideDebugPanel(debugPanel);
        });
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        
        // Create control sections in a more compact layout
        const controlsContainer = document.createElement('div');
        controlsContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            flex: 1;
            margin-top: 10px;
        `;
        
        // Add control sections
        this.addDebugSection(controlsContainer, 'Game State', this.createGameStateControls());
        this.addDebugSection(controlsContainer, 'Player Controls', this.createPlayerControls());
        this.addDebugSection(controlsContainer, 'Map Controls', this.createMapControls());
        this.addDebugSection(controlsContainer, 'UI Controls', this.createUIControls());
        this.addDebugSection(controlsContainer, 'System Controls', this.createSystemControls());
        
        debugPanel.appendChild(header);
        debugPanel.appendChild(controlsContainer);
        
        // Add to document
        document.body.appendChild(debugPanel);
        
        // Show the panel immediately after creation
        debugPanel.style.display = 'flex';
        debugPanel.style.visibility = 'visible';
        debugPanel.style.animation = 'debugPanelSlideDown 0.3s ease-out';
        
        console.log('🔧 Debug control panel created and shown');
    }
    
    /**
     * Show step counter details and add steps
     */
    showStepDetails() {
        // Add 100 steps when clicked
        this.addSteps(100);
        
        // Visual feedback handled by animation
        
        // Add visual feedback
        this.animateStepCounter();
    }
    
    /**
     * Animate step counter for visual feedback
     */
    animateStepCounter() {
        const stepCountElement = document.getElementById('step-count');
        if (stepCountElement) {
            // Add pulse animation
            stepCountElement.style.transform = 'scale(1.2)';
            stepCountElement.style.color = '#00ff00';
            
            setTimeout(() => {
                stepCountElement.style.transform = 'scale(1)';
                stepCountElement.style.color = '#00ffff';
            }, 300);
        }
    }
    
    /**
     * Request GPS location
     */
    requestGPSLocation() {
        console.log('📍 Requesting GPS location...');
        
        // Update GPS status to loading
        this.updateGPSStatus('loading', 'Loading...');
        
        // Check if we have permission first
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'denied') {
                    console.log('📍 GPS permission denied, showing permission request...');
                    this.showGPSPermissionRequest();
                    return;
                }
                this.attemptGPSLocation();
            }).catch(() => {
                // Fallback if permissions API not available
                this.attemptGPSLocation();
            });
        } else {
            this.attemptGPSLocation();
        }
    }
    
    attemptGPSLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('📍 GPS location acquired:', position);
                    this.updateGPSStatus('acquired', 'GPS');
                    
                    // Update player position if geolocation manager is available
                    if (window.geolocationManager) {
                        window.geolocationManager.handlePositionUpdate({
                            coords: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy
                            },
                            timestamp: position.timestamp
                        });
                    }
                    
                    // Show success notification
                    this.showNotification('GPS location acquired!', 'success');
                },
                (error) => {
                    console.error('📍 GPS error:', error);
                    this.updateGPSStatus('error', 'Error');
                    
                    // Show error notification
                    let errorMessage = 'GPS access denied';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = 'GPS permission denied - please allow location access';
                            this.showGPSPermissionRequest();
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = 'GPS position unavailable';
                            break;
                        case error.TIMEOUT:
                            errorMessage = 'GPS request timeout';
                            break;
                    }
                    this.showNotification(errorMessage, 'error');
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        } else {
            console.error('📍 Geolocation not supported');
            this.updateGPSStatus('error', 'N/A');
            this.showNotification('GPS not supported on this device', 'error');
        }
    }
    
    showGPSPermissionRequest() {
        // Show a simplified permission request
        const modal = document.createElement('div');
        modal.className = 'gps-permission-request';
        modal.innerHTML = `
            <div class="gps-permission-request-content">
                <div class="gps-icon">📍</div>
                <h3>Location Access Required</h3>
                <p>Please allow location access in your browser settings to use GPS features.</p>
                <button onclick="this.closest('.gps-permission-request').remove()">OK</button>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            .gps-permission-request {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .gps-permission-request-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4a9eff;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
                color: white;
                max-width: 300px;
            }
            
            .gps-icon {
                font-size: 32px;
                margin-bottom: 10px;
            }
            
            .gps-permission-request-content button {
                background: #4a9eff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 15px;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (modal.parentNode) {
                modal.remove();
                style.remove();
            }
        }, 5000);
    }
    
    /**
     * Update GPS status display
     */
    updateGPSStatus(status, text) {
        const gpsLocation = document.querySelector('.gps-location');
        const gpsStatus = document.querySelector('.gps-status');
        
        if (gpsLocation && gpsStatus) {
            // Remove existing status classes
            gpsLocation.classList.remove('gps-acquired', 'gps-error');
            
            // Add new status class
            if (status === 'acquired') {
                gpsLocation.classList.add('gps-acquired');
            } else if (status === 'error') {
                gpsLocation.classList.add('gps-error');
            }
            
            // Update status text
            gpsStatus.textContent = text;
        }
    }
    
    /**
     * Show base flag selection modal
     */
    showBaseFlagSelection() {
        console.log('🏳️ Showing base flag selection...');
        
        // Create flag selection modal
        const modal = document.createElement('div');
        modal.className = 'flag-selection-modal';
        modal.innerHTML = `
            <div class="flag-selection-content">
                <div class="flag-selection-header">
                    <h3>🏳️ Choose Base Flag</h3>
                    <button class="close-flag-modal" onclick="this.closest('.flag-selection-modal').remove()">×</button>
                </div>
                <div class="flag-options">
                    <div class="flag-option" data-flag="finnish" onclick="window.headerIntegration.selectFlag('finnish')">
                        <img src="assets/svg/flag_finland.svg" alt="Finnish Flag" class="flag-preview">
                        <span>🇫🇮 Finland</span>
                    </div>
                    <div class="flag-option" data-flag="swedish" onclick="window.headerIntegration.selectFlag('swedish')">
                        <span class="flag-emoji">🇸🇪</span>
                        <span>Sweden</span>
                    </div>
                    <div class="flag-option" data-flag="norwegian" onclick="window.headerIntegration.selectFlag('norwegian')">
                        <span class="flag-emoji">🇳🇴</span>
                        <span>Norway</span>
                    </div>
                    <div class="flag-option" data-flag="flower_of_life" onclick="window.headerIntegration.selectFlag('flower_of_life')">
                        <span class="flag-emoji">✳️</span>
                        <span>Flower of Life</span>
                    </div>
                    <div class="flag-option" data-flag="star" onclick="window.headerIntegration.selectFlag('star')">
                        <span class="flag-emoji">⭐</span>
                        <span>Star</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .flag-selection-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(10px);
            }
            
            .flag-selection-content {
                background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 20, 60, 0.95));
                border: 2px solid rgba(255, 255, 255, 0.2);
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                backdrop-filter: blur(20px);
            }
            
            .flag-selection-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .flag-selection-header h3 {
                color: #00ffff;
                margin: 0;
                text-shadow: 0 0 10px rgba(0, 255, 255, 0.5);
            }
            
            .close-flag-modal {
                background: none;
                border: none;
                color: #fff;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .close-flag-modal:hover {
                background: rgba(255, 255, 255, 0.1);
                transform: scale(1.1);
            }
            
            .flag-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 12px;
            }
            
            .flag-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .flag-option:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(0, 255, 255, 0.5);
                transform: translateY(-2px);
            }
            
            .flag-preview {
                width: 32px;
                height: 24px;
                margin-bottom: 8px;
                border-radius: 4px;
            }
            
            .flag-emoji {
                font-size: 24px;
                margin-bottom: 8px;
            }
            
            .flag-option span:last-child {
                color: #fff;
                font-size: 12px;
                font-weight: bold;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Remove style when modal is closed
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
                style.remove();
            }
        });
    }
    
    /**
     * Select a flag
     */
    selectFlag(flagType) {
        console.log('🏳️ Selecting flag:', flagType);
        
        // Store flag selection
        localStorage.setItem('eldritch_player_base_logo', flagType);
        
        // Update flag display
        this.updateFlagDisplay(flagType);
        
        // Close modal
        const modal = document.querySelector('.flag-selection-modal');
        if (modal) {
            modal.remove();
        }
        
        // Show success notification
        this.showNotification(`Flag changed to ${flagType}!`, 'success');
        
        // Update map markers if available
        if (window.mapLayer && window.mapLayer.updateBaseMarkerFlag) {
            window.mapLayer.updateBaseMarkerFlag(flagType);
        }
    }
    
    /**
     * Update flag display
     */
    updateFlagDisplay(flagType) {
        const baseFlag = document.querySelector('.base-flag');
        if (!baseFlag) return;
        
        const flagIcon = baseFlag.querySelector('.flag-icon');
        if (flagIcon) {
            // Update flag based on type
            switch(flagType) {
                case 'finnish':
                    flagIcon.src = 'assets/svg/flag_finland.svg';
                    flagIcon.alt = 'Finnish Flag';
                    break;
                case 'swedish':
                    flagIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjMDA2FAA4Ii8+CjxwYXRoIGQ9Ik0wIDcuNUgyNFYxMC41SDBWNy41WiIgZmlsbD0iI0ZGRkZGRiIvPgo8cGF0aCBkPSJNOC41IDBIMTUuNVYxOEg4LjVWMFoiIGZpbGw9IiNGRkZGRkYiLz4KPC9zdmc+';
                    flagIcon.alt = 'Swedish Flag';
                    break;
                case 'norwegian':
                    flagIcon.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjE4IiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHdpZHRoPSIyNCIgaGVpZ2h0PSI0LjUiIGZpbGw9IiNGRkAwMDAiLz4KPHJlY3QgeT0iMTMuNSIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQuNSIgZmlsbD0iI0ZGQDAwMCIvPgo8cmVjdCB4PSI2IiB3aWR0aD0iNCIgaGVpZ2h0PSIxOCIgZmlsbD0iI0ZGQDAwMCIvPgo8cmVjdCB4PSIxNCIgd2lkdGg9IjQiIGhlaWdodD0iMTgiIGZpbGw9IiNGRkAwMDAiLz4KPC9zdmc+';
                    flagIcon.alt = 'Norwegian Flag';
                    break;
                default:
                    // For emoji flags, replace img with span
                    const emoji = this.getFlagEmoji(flagType);
                    baseFlag.innerHTML = `<span class="flag-emoji">${emoji}</span>`;
                    return;
            }
        }
    }
    
    /**
     * Get flag emoji for a flag type
     */
    getFlagEmoji(flagType) {
        switch(flagType) {
            case 'swedish': return '🇸🇪';
            case 'norwegian': return '🇳🇴';
            case 'flower_of_life': return '✳️';
            case 'star': return '⭐';
            default: return '🇫🇮';
        }
    }
    
    /**
     * Show health details
     */
    showHealthDetails() {
        this.showNotification(`Health: ${this.health}/100`, 'info');
    }
    
    /**
     * Show sanity details
     */
    showSanityDetails() {
        this.showNotification(`Sanity: ${this.sanity}/100`, 'info');
    }
    
    
    /**
     * Show notification with modern styling
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `header-notification header-notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid rgba(0, 255, 255, 0.3);
            backdrop-filter: blur(10px);
            z-index: 2000;
            font-size: 0.9rem;
            font-weight: 500;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            animation: slideDown 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('header-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'header-notification-styles';
            style.textContent = `
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateX(-50%) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(-50%) translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Add to document
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.3s ease-out reverse';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    /**
     * Public methods for external integration
     */
    
    // Update step count from external systems
    setStepCount(count) {
        this.stepCount = Math.max(0, count);
        this.updateStepCounter();
    }
    
    // Add steps
    addSteps(steps) {
        this.stepCount += steps;
        this.updateStepCounter();
    }
    
    // Update health
    setHealth(health) {
        this.health = Math.max(0, Math.min(100, health));
        this.updateHealthSanity();
    }
    
    // Update sanity
    setSanity(sanity) {
        this.sanity = Math.max(0, Math.min(100, sanity));
        this.updateHealthSanity();
    }
    
    // Update player name
    setPlayerName(name) {
        this.playerName = name || 'Wanderer';
        this.updatePlayerName();
    }

    setPlayerLevel(level) {
        this.playerLevel = Math.max(1, Math.floor(level || 1));
        this.updatePlayerLevel();
    }
    
    // Get current values
    getStepCount() { return this.stepCount; }
    getHealth() { return this.health; }
    getSanity() { return this.sanity; }
    getPlayerName() { return this.playerName; }
    
    /**
     * Add a debug section to the control panel
     */
    addDebugSection(container, title, content) {
        const section = document.createElement('div');
        section.style.cssText = `
            background: rgba(15, 15, 35, 0.9);
            border: 1px solid rgba(0, 255, 255, 0.4);
            border-radius: 12px;
            padding: 12px;
            backdrop-filter: blur(15px);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        `;
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.textContent = title;
        sectionTitle.style.cssText = `
            color: #00ffff;
            margin: 0 0 10px 0;
            font-size: 1rem;
            text-shadow: 0 0 5px rgba(0, 255, 255, 0.5);
            font-weight: 600;
        `;
        
        section.appendChild(sectionTitle);
        section.appendChild(content);
        container.appendChild(section);
    }
    
    /**
     * Create game state controls
     */
    createGameStateControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        // Step counter controls
        const stepControls = document.createElement('div');
        stepControls.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">Step Counter:</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button id="debug-add-steps" style="padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">+100 Steps</button>
                <button id="debug-reset-steps" style="padding: 8px 12px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer;">Reset Steps</button>
                <span id="debug-step-display" style="color: #00ffff; font-weight: bold;">${this.stepCount}</span>
            </div>
        `;
        
        // Health/Sanity controls
        const healthControls = document.createElement('div');
        healthControls.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">Health/Sanity:</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button id="debug-heal" style="padding: 8px 12px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Heal +20</button>
                <button id="debug-damage" style="padding: 8px 12px; background: #ff5722; color: white; border: none; border-radius: 5px; cursor: pointer;">Damage -20</button>
                <button id="debug-restore-sanity" style="padding: 8px 12px; background: #2196F3; color: white; border: none; border-radius: 5px; cursor: pointer;">Restore Sanity +20</button>
            </div>
        `;
        
        container.appendChild(stepControls);
        container.appendChild(healthControls);
        
        // Add event listeners
        setTimeout(() => {
            // Step addition now handled by unified debug panel to prevent conflicts
            // document.getElementById('debug-add-steps')?.addEventListener('click', () => {
            //     this.addSteps(100);
            //     this.updateDebugDisplay();
            // });
            
            document.getElementById('debug-reset-steps')?.addEventListener('click', () => {
                this.setStepCount(0);
                this.updateDebugDisplay();
            });
            
            document.getElementById('debug-heal')?.addEventListener('click', () => {
                this.setHealth(Math.min(100, this.health + 20));
                this.updateDebugDisplay();
            });
            
            document.getElementById('debug-damage')?.addEventListener('click', () => {
                this.setHealth(Math.max(0, this.health - 20));
                this.updateDebugDisplay();
            });
            
            document.getElementById('debug-restore-sanity')?.addEventListener('click', () => {
                this.setSanity(Math.min(100, this.sanity + 20));
                this.updateDebugDisplay();
            });
        }, 100);
        
        return container;
    }
    
    /**
     * Create player controls
     */
    createPlayerControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        container.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">Player Name:</label>
            <input type="text" id="debug-player-name" value="${this.playerName}" style="padding: 8px; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(0, 255, 255, 0.3); border-radius: 5px; color: white; margin-bottom: 10px;">
            <button id="debug-update-name" style="padding: 8px 12px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">Update Name</button>
            
            <label style="color: #ffffff; font-size: 0.9rem; margin: 15px 0 5px 0; display: block;">Player Position:</label>
            <div style="display: flex; gap: 10px; align-items: center;">
                <button id="debug-teleport" style="padding: 8px 12px; background: #607D8B; color: white; border: none; border-radius: 5px; cursor: pointer;">Teleport to Center</button>
                <button id="debug-random-pos" style="padding: 8px 12px; background: #795548; color: white; border: none; border-radius: 5px; cursor: pointer;">Random Position</button>
            </div>
        `;
        
        // Add event listeners
        setTimeout(() => {
            document.getElementById('debug-update-name')?.addEventListener('click', () => {
                const newName = document.getElementById('debug-player-name').value;
                this.setPlayerName(newName);
                this.showNotification(`Player name updated to: ${newName}`, 'success');
            });
        }, 100);
        
        return container;
    }
    
    /**
     * Create map controls
     */
    createMapControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        // Check current GPS state
        const mapLayer = this.findMapLayer();
        const isGPSDisabled = mapLayer ? mapLayer.isGPSTrackingDisabled() : false;
        const gpsStatus = isGPSDisabled ? 'OFF' : 'ON';
        const gpsColor = isGPSDisabled ? '#ff4444' : '#00ff00';
        
        container.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">Map Controls:</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="debug-center-map" style="padding: 8px 12px; background: #3F51B5; color: white; border: none; border-radius: 5px; cursor: pointer;">Center Map</button>
                <button id="debug-zoom-in" style="padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Zoom In</button>
                <button id="debug-zoom-out" style="padding: 8px 12px; background: #FF9800; color: white; border: none; border-radius: 5px; cursor: pointer;">Zoom Out</button>
                <button id="debug-toggle-layers" style="padding: 8px 12px; background: #9C27B0; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Layers</button>
                <div style="display: flex; align-items: center; gap: 8px; margin-top: 5px;">
                    <span style="color: #ffffff; font-size: 0.8rem;">GPS:</span>
                    <button id="debug-toggle-gps" style="padding: 6px 10px; background: ${gpsColor}; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">${gpsStatus}</button>
                </div>
            </div>
        `;
        
        // Add event listeners
        setTimeout(() => {
            document.getElementById('debug-toggle-gps')?.addEventListener('click', () => {
                this.toggleGPS();
            });
        }, 100);
        
        return container;
    }
    
    /**
     * Create UI controls
     */
    createUIControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        container.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">UI Controls:</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="debug-toggle-inventory" style="padding: 8px 12px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Inventory</button>
                <button id="debug-toggle-quests" style="padding: 8px 12px; background: #10b981; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Quests</button>
                <button id="debug-toggle-base" style="padding: 8px 12px; background: #f59e0b; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Base</button>
                <button id="debug-toggle-settings" style="padding: 8px 12px; background: #8b5cf6; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Settings</button>
            </div>
        `;
        
        return container;
    }
    
    /**
     * Create system controls
     */
    createSystemControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; flex-direction: column; gap: 10px;';
        
        container.innerHTML = `
            <label style="color: #ffffff; font-size: 0.9rem; margin-bottom: 5px; display: block;">System Controls:</label>
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <button id="debug-export-logs" style="padding: 8px 12px; background: #607D8B; color: white; border: none; border-radius: 5px; cursor: pointer;">Export Logs</button>
                <button id="debug-clear-storage" style="padding: 8px 12px; background: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer;">Clear Storage</button>
                <button id="debug-reload-page" style="padding: 8px 12px; background: #ff9800; color: white; border: none; border-radius: 5px; cursor: pointer;">Reload Page</button>
                <button id="debug-performance" style="padding: 8px 12px; background: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer;">Performance Info</button>
            </div>
        `;
        
        // Add event listeners
        setTimeout(() => {
            document.getElementById('debug-export-logs')?.addEventListener('click', () => {
                this.exportDebugLogs();
            });
            
            document.getElementById('debug-clear-storage')?.addEventListener('click', () => {
                this.clearStorage();
            });
            
            document.getElementById('debug-reload-page')?.addEventListener('click', () => {
                window.location.reload();
            });
            
            document.getElementById('debug-performance')?.addEventListener('click', () => {
                this.showPerformanceInfo();
            });
        }, 100);
        
        return container;
    }
    
    /**
     * Update debug display values
     */
    updateDebugDisplay() {
        const stepDisplay = document.getElementById('debug-step-display');
        if (stepDisplay) {
            stepDisplay.textContent = this.stepCount;
        }
    }

    /**
     * Create small badges for level and total steps in header if missing
     */
    ensureProfileBadges() {
        // #game-header area
        const playerInfo = document.getElementById('player-info');
        if (playerInfo && !document.getElementById('player-level')) {
            const levelSpan = document.createElement('span');
            levelSpan.id = 'player-level';
            levelSpan.style.cssText = 'font-size:12px; background:#374151; color:#e5e7eb; padding:2px 6px; border-radius:6px;';
            levelSpan.textContent = `Lv ${this.playerLevel}`;
            playerInfo.appendChild(levelSpan);
        }
        // Steps badge near steps-section
        const stepsSection = document.getElementById('steps-section');
        if (stepsSection && !document.getElementById('player-steps-badge')) {
            const stepsBadge = document.createElement('span');
            stepsBadge.id = 'player-steps-badge';
            stepsBadge.style.cssText = 'font-size:12px; color:#9ca3af; margin-left:6px;';
            stepsBadge.textContent = `${this.stepCount} total`;
            stepsSection.appendChild(stepsBadge);
        }
        // Legacy header already shows step-count-legacy-1
    }

    /**
     * Load name/level/steps from systems and storage
     */
    hydrateFromStorageAndSystems() {
        try {
            // Name
            const profRaw = localStorage.getItem('eldritch_profile');
            if (profRaw) {
                const prof = JSON.parse(profRaw);
                if (prof?.name) this.playerName = prof.name;
            } else {
                const fallbackName = localStorage.getItem('eldritch_player_name');
                if (fallbackName) this.playerName = fallbackName;
            }
        } catch (_) {}
        // Level
        try {
            const level = window.encounterSystem?.playerStats?.level;
            if (level) this.playerLevel = level;
        } catch (_) {}
        // Steps
        try {
            const steps = window.stepCurrencySystem?.totalSteps;
            if (Number.isFinite(steps)) this.stepCount = steps;
        } catch (_) {}
    }

    /**
     * Periodically sync displayed values from systems
     */
    startAutoSync() {
        if (this._syncTimer) return;
        this._syncTimer = setInterval(() => {
            // Steps
            const steps = window.stepCurrencySystem?.totalSteps;
            if (Number.isFinite(steps) && steps !== this.stepCount) {
                this.setStepCount(steps);
                const badge = document.getElementById('player-steps-badge');
                if (badge) badge.textContent = `${this.stepCount} total`;
            }
            // Level
            const lvl = window.encounterSystem?.playerStats?.level;
            if (Number.isFinite(lvl) && lvl !== this.playerLevel) {
                this.setPlayerLevel(lvl);
            }
            // Name (in case changed)
            const name = (function() {
                try {
                    const pr = localStorage.getItem('eldritch_profile');
                    if (pr) return (JSON.parse(pr)?.name);
                    return localStorage.getItem('eldritch_player_name');
                } catch(_) { return null; }
            })();
            if (name && name !== this.playerName) {
                this.setPlayerName(name);
            }
        }, 1000);
    }
    
    /**
     * Export debug logs - now uses the enhanced debug logger system
     */
    async exportDebugLogs() {
        try {
            // Use the enhanced debug logger's system check
            if (window.debugLogger && window.debugLogger.performSystemCheck) {
                console.log('🔍 Starting enhanced debug log export...');
                const systemCheck = await window.debugLogger.performSystemCheck();
                
                // Create a comprehensive debug report
                const debugReport = {
                    timestamp: new Date().toISOString(),
                    systemCheck: systemCheck,
                    gameState: {
                        stepCount: this.stepCount,
                        health: this.health,
                        sanity: this.sanity,
                        playerName: this.playerName
                    },
                    debugLogs: window.debugLogger.getLogs(),
                    localStorage: this.getLocalStorageData(),
                    sessionStorage: this.getSessionStorageData()
                };
                
                // Export as JSON file
                const blob = new Blob([JSON.stringify(debugReport, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `eldritch-debug-report-${Date.now()}.json`;
                a.click();
                URL.revokeObjectURL(url);
                
                this.showNotification('Enhanced debug report exported!', 'success');
            } else {
                // Fallback to simple export
                this.exportSimpleLogs();
            }
        } catch (error) {
            console.error('Error exporting debug logs:', error);
            this.showNotification('Error exporting logs', 'error');
        }
    }
    
    /**
     * Fallback simple export
     */
    exportSimpleLogs() {
        const logs = {
            timestamp: new Date().toISOString(),
            stepCount: this.stepCount,
            health: this.health,
            sanity: this.sanity,
            playerName: this.playerName,
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`
        };
        
        const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `debug-logs-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Debug logs exported!', 'success');
    }
    
    /**
     * Get localStorage data for debugging
     */
    getLocalStorageData() {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                try {
                    data[key] = JSON.parse(localStorage.getItem(key));
                } catch {
                    data[key] = localStorage.getItem(key);
                }
            }
        }
        return data;
    }
    
    /**
     * Get sessionStorage data for debugging
     */
    getSessionStorageData() {
        const data = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key) {
                try {
                    data[key] = JSON.parse(sessionStorage.getItem(key));
                } catch {
                    data[key] = sessionStorage.getItem(key);
                }
            }
        }
        return data;
    }
    
    /**
     * Clear storage
     */
    clearStorage() {
        if (confirm('Are you sure you want to clear all storage? This will reset the game.')) {
            localStorage.clear();
            sessionStorage.clear();
            this.showNotification('Storage cleared! Page will reload.', 'info');
            setTimeout(() => window.location.reload(), 1000);
        }
    }
    
    /**
     * Show performance information
     */
    showPerformanceInfo() {
        const perf = {
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'Not available',
            timing: {
                loadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) + ' ms',
                domReady: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart) + ' ms'
            }
        };
        
        this.showNotification(`Performance: ${JSON.stringify(perf, null, 2)}`, 'info');
    }

    /**
     * Toggle GPS tracking
     */
    toggleGPS() {
        console.log('🔧 GPS toggle clicked');
        
        // Find the map layer to control GPS
        const mapLayer = this.findMapLayer();
        if (!mapLayer) {
            console.error('🔧 MapLayer not found for GPS toggle');
            return;
        }

        const isDisabled = mapLayer.isGPSTrackingDisabled();
        const gpsButton = document.getElementById('debug-toggle-gps');
        
        console.log('🔧 Current GPS state:', isDisabled ? 'DISABLED' : 'ENABLED');
        
        if (isDisabled) {
            // Enable GPS
            console.log('🔧 Enabling GPS tracking...');
            mapLayer.enableGPSTracking();
            gpsButton.textContent = 'ON';
            gpsButton.style.background = '#00ff00';
            console.log('🔧 GPS tracking enabled');
        } else {
            // Disable GPS
            console.log('🔧 Disabling GPS tracking...');
            mapLayer.disableGPSTracking();
            gpsButton.textContent = 'OFF';
            gpsButton.style.background = '#ff4444';
            console.log('🔧 GPS tracking disabled');
        }
    }

    /**
     * Find the MapLayer instance
     */
    findMapLayer() {
        console.log('🔧 Searching for MapLayer instance...');
        
        // Try to find through layer manager's getLayer method (most reliable)
        if (window.eldritchApp && window.eldritchApp.layerManager && window.eldritchApp.layerManager.getLayer) {
            console.log('🔧 Trying getLayer method...');
            const mapLayer = window.eldritchApp.layerManager.getLayer('map');
            if (mapLayer) {
                console.log('🔧 Found MapLayer via getLayer');
                return mapLayer;
            }
        }
        
        // Try to find MapLayer through the layer manager's layers Map
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            console.log('🔧 Found layer manager, checking layers Map...');
            const layers = window.eldritchApp.layerManager.layers;
            console.log('🔧 Available layer keys:', Array.from(layers.keys()));
            
            const mapLayer = layers.get('map');
            if (mapLayer) {
                console.log('🔧 Found MapLayer in layers Map');
                return mapLayer;
            }
        }
        
        // Try to find through global app instance
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.mapLayer) {
            console.log('🔧 Found MapLayer in systems');
            return window.eldritchApp.systems.mapLayer;
        }
        
        // Fallback: try to find by iterating through layers
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            console.log('🔧 Iterating through layers...');
            const layers = window.eldritchApp.layerManager.layers;
            for (const [name, layer] of layers) {
                if (name === 'map' || layer.constructor.name === 'MapLayer') {
                    console.log('🔧 Found MapLayer by iteration:', name);
                    return layer;
                }
            }
        }
        
        // Final fallback: use global reference
        if (window.mapLayerInstance) {
            console.log('🔧 Found MapLayer via global reference');
            return window.mapLayerInstance;
        }
        
        console.warn('🔧 MapLayer instance not found through any method');
        console.log('🔧 Available app structure:', {
            hasApp: !!window.eldritchApp,
            hasLayerManager: !!(window.eldritchApp && window.eldritchApp.layerManager),
            hasLayers: !!(window.eldritchApp && window.eldritchApp.layerManager && window.eldritchApp.layerManager.layers),
            hasGlobalInstance: !!window.mapLayerInstance
        });
        return null;
    }
}

// Create global instance
window.headerIntegration = new HeaderIntegration();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.headerIntegration.init();
    });
} else {
    window.headerIntegration.init();
}

console.log('🎮 Header Integration: Module loaded');
