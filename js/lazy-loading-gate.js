/**
 * Lazy Loading Gate System
 * Created by: 🌸 Aurora + 🏗️ Nova + 💻 Codex
 * Purpose: Control system initialization based on user permissions and choices
 * Status: [SACRED] - Core architecture, do not modify without approval
 * 
 * This system ensures that:
 * 1. GPS permissions are requested BEFORE any location-dependent systems initialize
 * 2. Player choice (continue/new) is made BEFORE game systems initialize
 * 3. Systems only initialize after user consent and choices are made
 */

class LazyLoadingGate {
    constructor() {
        this.instanceId = 'lazy-gate-' + Date.now();
        this.gates = {
            gpsPermission: {
                required: true,
                passed: false,
                blocking: true,
                description: 'GPS Location Permission'
            },
            playerChoice: {
                required: true,
                passed: false,
                blocking: true,
                description: 'Player Adventure Choice'
            },
            mapReady: {
                required: true,
                passed: true, // Always true since map is initialized after gate completes
                blocking: true,
                description: 'Map System Ready'
            }
        };
        
        this.initializationQueue = [];
        this.isInitializing = false;
        this.initializationComplete = false;
        
        console.log('🚪 Lazy Loading Gate System initialized:', this.instanceId);
        this.init();
    }
    
    init() {
        console.log('🚪 LazyLoadingGate: Starting init...');
        
        // Wait for DOM to be fully ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeGate());
        } else {
            this.initializeGate();
        }
    }
    
    initializeGate() {
        console.log('🚪 LazyLoadingGate: DOM ready, creating UI...');
        
        // Hide any existing welcome screens immediately
        this.hideWelcomeScreens();
        
        this.createPermissionGateUI();
        console.log('🚪 LazyLoadingGate: UI created, checking if elements exist...');
        
        // Check if UI elements were created
        const statusElement = document.getElementById('gps-permission-status');
        const stepElement = document.getElementById('gps-permission-step');
        console.log('🚪 Status element exists:', !!statusElement);
        console.log('🚪 Step element exists:', !!stepElement);
        
        // Wait for UI to be created before setting up event listeners
        setTimeout(() => {
            console.log('🚪 LazyLoadingGate: Setting up event listeners...');
            this.setupEventListeners();
            this.checkInitialGates();
            
            // Map readiness check removed - map will be initialized after gate completes
            
            // Set a timeout to show player choice if GPS permission takes too long
            setTimeout(() => {
                if (!this.gates.gpsPermission.passed) {
                    console.log('🚪 GPS permission timeout - showing player choice anyway');
                    this.updateGateStatus('gpsPermission', 'pending', 'GPS permission optional - you can continue');
                    this.gates.gpsPermission.passed = true; // Allow progression
                    this.updateGateVisibility();
                }
            }, 10000); // 10 second timeout
        }, 100);
    }
    
    hideWelcomeScreens() {
        console.log('🚪 Checking for existing welcome screens...');
        
        // Don't hide the welcome screen - we'll use it instead of creating our own UI
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            console.log('🚪 Found existing welcome screen - will use it instead of creating new UI');
            // Show the welcome screen
            welcomeScreen.style.display = 'flex';
        }
        
        // Hide any loading screens
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
            console.log('🚪 Loading screen hidden');
        }
        
        // Hide any splash screens
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.style.display = 'none';
            console.log('🚪 Splash screen hidden');
        }
        
        // Hide any init screens
        const initScreen = document.getElementById('init-screen');
        if (initScreen) {
            initScreen.style.display = 'none';
            console.log('🚪 Init screen hidden');
        }
    }
    
    modifyWelcomeScreenForLazyLoading() {
        console.log('🚪 Modifying welcome screen for lazy loading...');
        
        const welcomeScreen = document.getElementById('welcome-screen');
        if (!welcomeScreen) {
            console.error('🚪 Welcome screen not found!');
            return;
        }
        
        // Find the GPS button in the welcome screen
        const gpsButton = welcomeScreen.querySelector('.gps-active-btn');
        if (gpsButton) {
            // Store reference to the GPS button
            this.gpsButton = gpsButton;
            
            // Preserve the original beautiful structure but change the text
            const gpsCheck = gpsButton.querySelector('.gps-check');
            if (gpsCheck) {
                gpsCheck.textContent = '🔄'; // Change checkmark to loading icon
            }
            gpsButton.innerHTML = '<span class="gps-check">🔄</span>Enable Location Access';
            
            // Add click event listener
            gpsButton.addEventListener('click', () => {
                console.log('🚪 GPS button clicked in welcome screen');
                this.requestGPSPermission();
            });
            
            console.log('🚪 GPS button modified in welcome screen');
        }
        
        // Find the adventure buttons
        const continueButton = welcomeScreen.querySelector('#continue-adventure');
        const newButton = welcomeScreen.querySelector('#start-fresh'); // Correct ID from welcome screen
        
        console.log('🚪 Found buttons:', {
            continueButton: !!continueButton,
            newButton: !!newButton,
            continueId: continueButton?.id,
            newId: newButton?.id
        });
        
        if (continueButton) {
            continueButton.addEventListener('click', () => {
                console.log('🚪 Continue adventure button clicked');
                this.handlePlayerChoice('continue');
            });
            console.log('🚪 Continue button event listener attached');
        } else {
            console.error('🚪 Continue adventure button not found!');
        }
        
        if (newButton) {
            newButton.addEventListener('click', () => {
                console.log('🚪 Start new adventure button clicked');
                this.handlePlayerChoice('new');
            });
            console.log('🚪 New adventure button event listener attached');
        } else {
            console.error('🚪 Start fresh adventure button not found!');
        }
        
        console.log('🚪 Welcome screen modified for lazy loading');
    }
    
    createPermissionGateUI() {
        console.log('🚪 LazyLoadingGate: Creating permission gate UI...');
        
        // Check if we should use the existing welcome screen instead of creating our own overlay
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            console.log('🚪 Using existing welcome screen instead of creating overlay');
            this.modifyWelcomeScreenForLazyLoading();
            return;
        }
        
        // Check if overlay already exists
        const existingOverlay = document.getElementById('lazy-loading-gate-overlay');
        if (existingOverlay) {
            console.log('🚪 LazyLoadingGate: Overlay already exists, removing...');
            existingOverlay.remove();
        }
        
        // Create the permission gate overlay
        const overlay = document.createElement('div');
        overlay.id = 'lazy-loading-gate-overlay';
        overlay.className = 'lazy-loading-gate-overlay';
        // Create elements manually instead of innerHTML
        const gateContent = document.createElement('div');
        gateContent.className = 'gate-content';
        
        const gateHeader = document.createElement('div');
        gateHeader.className = 'gate-header';
        
        const gateIcon = document.createElement('div');
        gateIcon.className = 'gate-icon';
        gateIcon.textContent = '🌌';
        
        const title = document.createElement('h1');
        title.textContent = 'Eldritch Sanctuary';
        
        const subtitle = document.createElement('p');
        subtitle.className = 'gate-subtitle';
        subtitle.textContent = 'Cosmic Adventure Awaits';
        
        gateHeader.appendChild(gateIcon);
        gateHeader.appendChild(title);
        gateHeader.appendChild(subtitle);
        
        const gateSteps = document.createElement('div');
        gateSteps.className = 'gate-steps';
        
        // Create GPS permission step
        const gpsStep = document.createElement('div');
        gpsStep.className = 'gate-step';
        gpsStep.id = 'gps-permission-step';
        
        const gpsStepIcon = document.createElement('div');
        gpsStepIcon.className = 'step-icon';
        gpsStepIcon.textContent = '📍';
        
        const gpsStepContent = document.createElement('div');
        gpsStepContent.className = 'step-content';
        
        const gpsTitle = document.createElement('h3');
        gpsTitle.textContent = 'GPS Enabled Successfully!';
        
        const gpsDescription = document.createElement('p');
        gpsDescription.textContent = 'Location tracking is now active. You can continue your adventure.';
        
        const gpsButton = document.createElement('button');
        gpsButton.id = 'request-gps-permission';
        gpsButton.className = 'gate-button primary';
        gpsButton.textContent = 'Enable Location Access';
        
        const resetButton = document.createElement('button');
        resetButton.id = 'reset-gps-permission';
        resetButton.className = 'gate-button secondary';
        resetButton.textContent = 'Reset Permissions';
        resetButton.style.fontSize = '12px';
        resetButton.style.padding = '6px 12px';
        
        gpsStepContent.appendChild(gpsTitle);
        gpsStepContent.appendChild(gpsDescription);
        gpsStepContent.appendChild(gpsButton);
        gpsStepContent.appendChild(resetButton);
        
        gpsStep.appendChild(gpsStepIcon);
        gpsStep.appendChild(gpsStepContent);
        
        gateSteps.appendChild(gpsStep);
        
        // Create player choice step
        const playerStep = document.createElement('div');
        playerStep.className = 'gate-step';
        playerStep.id = 'player-choice-step';
        playerStep.style.display = 'none';
        
        const playerStepIcon = document.createElement('div');
        playerStepIcon.className = 'step-icon';
        playerStepIcon.textContent = '🎮';
        
        const playerStepContent = document.createElement('div');
        playerStepContent.className = 'step-content';
        
        const playerTitle = document.createElement('h3');
        playerTitle.textContent = 'Adventure Choice';
        
        const playerDescription = document.createElement('p');
        playerDescription.textContent = 'Choose your cosmic journey';
        
        const choiceButtons = document.createElement('div');
        choiceButtons.className = 'choice-buttons';
        
        const continueButton = document.createElement('button');
        continueButton.id = 'continue-adventure';
        continueButton.className = 'gate-button secondary';
        continueButton.textContent = 'Continue Adventure';
        
        const newButton = document.createElement('button');
        newButton.id = 'start-new-adventure';
        newButton.className = 'gate-button secondary';
        newButton.textContent = 'Start New Adventure';
        
        const playerStatus = document.createElement('div');
        playerStatus.className = 'step-status';
        playerStatus.id = 'player-choice-status';
        playerStatus.textContent = 'Pending';
        
        choiceButtons.appendChild(continueButton);
        choiceButtons.appendChild(newButton);
        
        playerStepContent.appendChild(playerTitle);
        playerStepContent.appendChild(playerDescription);
        playerStepContent.appendChild(choiceButtons);
        playerStepContent.appendChild(playerStatus);
        
        playerStep.appendChild(playerStepIcon);
        playerStep.appendChild(playerStepContent);
        
        gateSteps.appendChild(playerStep);
        
        gateContent.appendChild(gateHeader);
        gateContent.appendChild(gateSteps);
        overlay.appendChild(gateContent);
        
        console.log('🚪 All elements created manually - checking if they exist...');
        const testStatus = document.getElementById('gps-permission-status');
        const testStep = document.getElementById('gps-permission-step');
        const testPlayerStep = document.getElementById('player-choice-step');
        const testConsentStep = document.getElementById('user-consent-step');
        console.log('🚪 Manual creation - Status element exists:', !!testStatus);
        console.log('🚪 Manual creation - Step element exists:', !!testStep);
        console.log('🚪 Manual creation - Player step exists:', !!testPlayerStep);
        console.log('🚪 Manual creation - Consent step exists:', !!testConsentStep);
        
        // Also check if overlay is in DOM
        const overlayInDOM2 = document.getElementById('lazy-loading-gate-overlay');
        console.log('🚪 Overlay in DOM after creation:', !!overlayInDOM2);
        
        // Check if elements are inside the overlay
        if (overlayInDOM2) {
            const statusInOverlay = overlayInDOM2.querySelector('#gps-permission-status');
            const stepInOverlay = overlayInDOM2.querySelector('#gps-permission-step');
            console.log('🚪 Status element inside overlay:', !!statusInOverlay);
            console.log('🚪 Step element inside overlay:', !!stepInOverlay);
        }
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .lazy-loading-gate-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                animation: fadeIn 0.5s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .gate-button.secondary {
                background: rgba(74, 158, 255, 0.2);
                border: 1px solid #4a9eff;
                box-shadow: none;
            }
            .gate-button.secondary:hover {
                background: rgba(74, 158, 255, 0.3);
                transform: translateY(-2px);
            }
            
            /* GPS button styling now uses the beautiful welcome screen .gps-active-btn styling */
            
            .gate-button.error {
                background: linear-gradient(45deg, #ef4444, #dc2626);
                color: white;
            }
            
            .gate-button.error:hover {
                background: linear-gradient(45deg, #dc2626, #b91c1c);
                transform: translateY(-2px);
            }
            .choice-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 15px;
            }
            .choice-buttons .gate-button {
                flex: 1;
                margin-top: 0;
            }
            .consent-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-top: 15px;
                align-items: flex-start;
            }
            .consent-options label {
                font-size: 1em;
                color: #c0c0c0;
                cursor: pointer;
            }
            .consent-options input[type="checkbox"] {
                margin-right: 10px;
                transform: scale(1.2);
            }
            
            .gate-content {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 40px;
                max-width: 600px;
                width: 90%;
                text-align: center;
                color: white;
                backdrop-filter: blur(20px);
                border: 2px solid rgba(255, 255, 255, 0.2);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            }
            
            .gate-header {
                margin-bottom: 40px;
            }
            
            .gate-icon {
                font-size: 64px;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .gate-header h1 {
                font-size: 2.5em;
                margin: 0 0 10px 0;
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .gate-subtitle {
                font-size: 1.2em;
                color: #6bb6ff;
                margin: 0;
            }
            
            .gate-step {
                margin: 30px 0;
                padding: 30px;
                background: rgba(0, 0, 0, 0.3);
                border-radius: 15px;
                border-left: 4px solid #4a9eff;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.3s ease;
            }
            
            .gate-step.completed {
                background: rgba(0, 0, 0, 0.4);
                border-left: 4px solid #00ff88;
                border-radius: 20px;
                box-shadow: 0 0 30px rgba(0, 255, 136, 0.1);
            }
            
            .gate-step.active {
                border-left-color: #10b981;
                background: rgba(16, 185, 129, 0.1);
            }
            
            .gate-step.completed {
                border-left-color: #10b981;
                background: rgba(16, 185, 129, 0.2);
            }
            
            .step-icon {
                font-size: 48px;
                flex-shrink: 0;
            }
            
            .gate-step.completed .step-icon {
                filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.5));
                transform: scale(1.1);
            }
            
            .step-content {
                flex: 1;
            }
            
            .step-content h3 {
                margin: 0 0 10px 0;
                color: #4a9eff;
                font-size: 1.5em;
            }
            
            .gate-step.completed .step-content h3 {
                color: #ffd700;
                font-weight: bold;
                text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
            }
            
            .step-content p {
                margin: 0 0 20px 0;
                color: #ccc;
                line-height: 1.5;
            }
            
            .gate-button {
                padding: 12px 24px;
                border: none;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
                margin: 5px;
            }
            
            .gate-button.primary {
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                color: white;
            }
            
            .gate-button.primary:hover {
                background: linear-gradient(45deg, #6bb6ff, #4a9eff);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(74, 158, 255, 0.4);
            }
            
            .gate-button.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: white;
                border: 2px solid #4a9eff;
                margin-top: 10px;
            }
            
            .gate-button.secondary:hover {
                background: rgba(74, 158, 255, 0.2);
                transform: translateY(-2px);
            }
            
            .gate-button:disabled {
                background: #666;
                cursor: not-allowed;
                transform: none;
                box-shadow: none;
            }
            
            .choice-buttons {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin: 20px 0;
            }
            
            .consent-options {
                text-align: left;
                margin: 20px 0;
            }
            
            .consent-option {
                display: flex;
                align-items: center;
                margin: 15px 0;
                cursor: pointer;
            }
            
            .consent-option input[type="checkbox"] {
                margin-right: 10px;
                transform: scale(1.2);
            }
            
            .step-status {
                margin-top: 15px;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: bold;
            }
            
            .step-status.pending {
                background: rgba(245, 158, 11, 0.2);
                color: #f59e0b;
                border: 1px solid #f59e0b;
            }
            
            .step-status.success {
                background: rgba(16, 185, 129, 0.2);
                color: #10b981;
                border: 1px solid #10b981;
            }
            
            .step-status.error {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
                border: 1px solid #ef4444;
            }
            
            .loading-indicator {
                margin-top: 30px;
            }
            
            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255, 255, 255, 0.3);
                border-top: 4px solid #4a9eff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(overlay);
        
        console.log('🚪 Permission gate UI created');
        console.log('🚪 Overlay element:', overlay);
        console.log('🚪 Overlay innerHTML length:', overlay.innerHTML.length);
        console.log('🚪 Overlay children count:', overlay.children.length);
        
        // Check if overlay is actually in the DOM
        const overlayInDOM = document.getElementById('lazy-loading-gate-overlay');
        console.log('🚪 Overlay in DOM:', !!overlayInDOM);
        
        // Verify elements were created
        const statusElement = document.getElementById('gps-permission-status');
        const stepElement = document.getElementById('gps-permission-step');
        console.log('🚪 After UI creation - Status element exists:', !!statusElement);
        console.log('🚪 After UI creation - Step element exists:', !!stepElement);
        
        if (!statusElement) {
            console.error('🚪 CRITICAL: gps-permission-status element not found after UI creation!');
            // Try to find it within the overlay
            const statusInOverlay = overlay.querySelector('#gps-permission-status');
            console.log('🚪 Status element in overlay:', !!statusInOverlay);
        }
        if (!stepElement) {
            console.error('🚪 CRITICAL: gps-permission-step element not found after UI creation!');
            // Try to find it within the overlay
            const stepInOverlay = overlay.querySelector('#gps-permission-step');
            console.log('🚪 Step element in overlay:', !!stepInOverlay);
        }
        
        // Store element references for later use
        this.gpsButton = gpsButton;
        this.stepElement = stepElement;
        this.playerStatusElement = document.getElementById('player-choice-status');
        this.playerStepElement = document.getElementById('player-choice-step');
        
        console.log('🚪 Element references stored:', {
            gpsButton: !!this.gpsButton,
            step: !!this.stepElement,
            playerStatus: !!this.playerStatusElement,
            playerStep: !!this.playerStepElement
        });
    }
    
    setupEventListeners() {
        // GPS Permission button - use stored reference from welcome screen modification
        if (this.gpsButton) {
            // Event listener already attached in modifyWelcomeScreenForLazyLoading()
            console.log('🚪 GPS permission button event listener already attached');
        } else {
            console.error('🚪 GPS permission button not found!');
        }
        
        // Reset GPS button - not needed since we're using welcome screen
        console.log('🚪 Reset GPS button not needed - using welcome screen integration');
        
        // Player choice buttons - handled by welcome screen, no need to duplicate
        console.log('🚪 Player choice buttons handled by welcome screen');
        
        // No user consent button needed - adventure choice buttons will instantly load game
        
        console.log('🚪 Event listeners setup complete');
    }
    
    checkInitialGates() {
        // Check if we can skip any gates based on existing state
        this.checkGPSPermission();
        this.checkPlayerData();
        this.updateGateVisibility();
    }
    
    startMapReadinessCheck() {
        console.log('🚪 Starting map readiness check...');
        
        // Show map loading indicator
        this.showMapLoadingIndicator();
        
        const checkMapReady = () => {
            // Check if map is initialized and visible
            const mapExists = window.map && typeof window.map.getCenter === 'function';
            const mapContainer = document.getElementById('map');
            const mapVisible = mapContainer && 
                mapContainer.style.display !== 'none' && 
                mapContainer.style.visibility !== 'hidden' &&
                mapContainer.offsetWidth > 0 && 
                mapContainer.offsetHeight > 0;
            
            // Also check if map has tiles loaded (more reliable indicator)
            const mapHasTiles = mapExists && window.map.getContainer() && 
                window.map.getContainer().querySelector('.leaflet-tile-pane img');
            
            console.log('🚪 Map readiness check:', {
                mapExists,
                mapVisible,
                mapHasTiles,
                containerExists: !!mapContainer,
                display: mapContainer?.style.display,
                visibility: mapContainer?.style.visibility,
                dimensions: mapContainer ? `${mapContainer.offsetWidth}x${mapContainer.offsetHeight}` : 'N/A',
                mapCenter: mapExists ? window.map.getCenter() : 'N/A'
            });
            
            if (mapExists && mapVisible && mapHasTiles) {
                console.log('🚪 Map is ready with tiles loaded!');
                this.passGate('mapReady', 'Map system loaded and visible with tiles');
                return true;
            }
            
            return false;
        };
        
        // Check immediately
        if (checkMapReady()) {
            return;
        }
        
        // If not ready, check every 500ms for up to 10 seconds
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds
        
        const interval = setInterval(() => {
            attempts++;
            
            if (checkMapReady()) {
                clearInterval(interval);
                return;
            }
            
            if (attempts >= maxAttempts) {
                console.warn('🚪 Map readiness check timeout - proceeding anyway');
                this.passGate('mapReady', 'Map system timeout - proceeding');
                clearInterval(interval);
            }
        }, 500);
    }
    
    showMapLoadingIndicator() {
        // Add a small loading indicator to the welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen && !document.getElementById('map-loading-indicator')) {
            const indicator = document.createElement('div');
            indicator.id = 'map-loading-indicator';
            indicator.innerHTML = '🗺️ Loading map...';
            indicator.style.cssText = `
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                z-index: 1000;
                animation: pulse 1.5s infinite;
            `;
            welcomeScreen.appendChild(indicator);
            console.log('🚪 Map loading indicator shown');
        }
    }
    
    hideMapLoadingIndicator() {
        const indicator = document.getElementById('map-loading-indicator');
        if (indicator) {
            indicator.remove();
            console.log('🚪 Map loading indicator hidden');
        }
    }
    
    checkPlayerData() {
        console.log('🚪 Checking for existing player data...');
        
        const existingPlayerId = localStorage.getItem('eldritch_player_id');
        
        if (existingPlayerId) {
            console.log('🚪 Found existing player ID:', existingPlayerId);
            
            // Enable both buttons - user can choose to continue or start fresh
            this.updatePlayerChoiceButtons(true, true);
        } else {
            console.log('🚪 No existing player data found');
            this.updatePlayerChoiceButtons(false, true);
        }
    }
    
    updatePlayerChoiceButtons(enableContinue, enableNew) {
        const continueButton = document.getElementById('continue-adventure');
        const newButton = document.getElementById('start-fresh'); // Correct ID from welcome screen
        
        // Check if map is ready - buttons should be disabled until map is ready
        const mapReady = this.gates.mapReady.passed;
        
        // Only enable buttons if map is ready AND the original conditions are met
        const finalEnableContinue = enableContinue && mapReady;
        const finalEnableNew = enableNew && mapReady;
        
        if (continueButton) {
            continueButton.disabled = !finalEnableContinue;
            if (finalEnableContinue) {
                continueButton.style.opacity = '1';
                continueButton.style.cursor = 'pointer';
            } else {
                continueButton.style.opacity = '0.5';
                continueButton.style.cursor = 'not-allowed';
            }
            console.log('🚪 Continue button enabled:', finalEnableContinue, '(map ready:', mapReady, ')');
        }
        
        if (newButton) {
            newButton.disabled = !finalEnableNew;
            if (finalEnableNew) {
                newButton.style.opacity = '1';
                newButton.style.cursor = 'pointer';
            } else {
                newButton.style.opacity = '0.5';
                newButton.style.cursor = 'not-allowed';
            }
            console.log('🚪 New adventure button enabled:', finalEnableNew, '(map ready:', mapReady, ')');
        }
    }
    
    async checkGPSPermission() {
        console.log('🚪 Checking GPS permission...');
        
        // First check if we have a valid stored permission
        if (this.isGPSPermissionValid()) {
            console.log('🚪 Valid GPS permission found in storage, requesting current position...');
            
            // Even if permission was granted before, we need to get the current position
            try {
                const position = await this.requestCurrentPosition();
                this.initializeGPSCoreWithPosition(position);
                this.passGate('gpsPermission', 'GPS permission already granted (stored)');
            } catch (error) {
                console.error('🚪 Error getting current position despite stored permission:', error);
                this.passGate('gpsPermission', 'GPS permission granted but position unavailable');
            }
            return;
        }
        
        // Check if user previously denied
        const storedPermission = this.getGPSPermissionStatus();
        if (storedPermission && storedPermission.status === 'denied') {
            console.log('🚪 User previously denied GPS, allowing progression');
            this.passGate('gpsPermission', 'GPS permission denied');
            return;
        }
        
        // Check browser permissions API
        if (!navigator.permissions) {
            console.log('🚪 Permissions API not supported, setting to pending');
            this.updateGateStatus('gpsPermission', 'pending', 'Permissions API not supported');
            return;
        }
        
        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            console.log('🚪 GPS permission state:', result.state);
            
            if (result.state === 'granted') {
                console.log('🚪 GPS permission already granted by browser, storing and passing gate');
                this.storeGPSPermissionStatus('granted');
                this.passGate('gpsPermission', 'GPS permission already granted');
            } else {
                console.log('🚪 GPS permission not granted, setting to pending');
                this.updateGateStatus('gpsPermission', 'pending', 'GPS permission required');
            }
        } catch (error) {
            console.log('🚪 Error checking GPS permission:', error);
            this.updateGateStatus('gpsPermission', 'pending', 'Could not check GPS permission');
        }
    }
    
    async requestGPSPermission() {
        console.log('🚪 Requesting GPS permission...');
        this.updateGateStatus('gpsPermission', 'pending', 'Requesting permission...');
        
        // Use direct geolocation API (more reliable)
        if (!navigator.geolocation) {
            this.updateGateStatus('gpsPermission', 'error', 'Geolocation not supported');
            return;
        }
        
        try {
            console.log('🚪 Calling navigator.geolocation.getCurrentPosition...');
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (pos) => {
                        console.log('🚪 GPS position received:', pos.coords);
                        resolve(pos);
                    },
                    (err) => {
                        console.log('🚪 GPS error:', err.message, err.code);
                        reject(err);
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 15000,
                        maximumAge: 60000
                    }
                );
            });
            
            console.log('🚪 GPS permission granted, calling passGate...');
            this.storeGPSPermissionStatus('granted');
            
            // Initialize GPS Core system with the position data
            this.initializeGPSCoreWithPosition(position);
            
            this.passGate('gpsPermission', 'GPS permission granted');
            console.log('🚪 GPS permission granted:', position.coords);
        } catch (error) {
            console.log('🚪 GPS permission error:', error.message);
            this.storeGPSPermissionStatus('denied');
            this.updateGateStatus('gpsPermission', 'error', `GPS permission denied: ${error.message}`);
            console.error('🚪 GPS permission error:', error);
        }
    }
    
    async requestCurrentPosition() {
        console.log('🚪 Requesting current GPS position...');
        
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('🚪 GPS position acquired:', position.coords);
                    resolve(position);
                },
                (error) => {
                    console.error('🚪 GPS position error:', error.message, error.code);
                    reject(error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }
    
    storeGPSPermissionStatus(status) {
        const permissionData = {
            status: status, // 'granted', 'denied'
            timestamp: Date.now(),
            userAgent: navigator.userAgent
        };
        
        try {
            localStorage.setItem('eldritch_gps_permission', JSON.stringify(permissionData));
            console.log('🚪 GPS permission status stored:', permissionData);
        } catch (error) {
            console.error('🚪 Error storing GPS permission status:', error);
        }
    }
    
    getGPSPermissionStatus() {
        try {
            const stored = localStorage.getItem('eldritch_gps_permission');
            if (stored) {
                const data = JSON.parse(stored);
                console.log('🚪 Retrieved GPS permission status:', data);
                return data;
            }
        } catch (error) {
            console.error('🚪 Error retrieving GPS permission status:', error);
        }
        return null;
    }
    
    isGPSPermissionValid() {
        const permissionData = this.getGPSPermissionStatus();
        if (!permissionData) return false;
        
        // Check if permission is recent (within 24 hours)
        const twentyFourHours = 24 * 60 * 60 * 1000;
        const isRecent = (Date.now() - permissionData.timestamp) < twentyFourHours;
        
        console.log('🚪 GPS permission valid:', isRecent, 'Status:', permissionData.status);
        return isRecent && permissionData.status === 'granted';
    }
    
    clearGPSPermissionStatus() {
        try {
            localStorage.removeItem('eldritch_gps_permission');
            console.log('🚪 GPS permission status cleared from storage');
        } catch (error) {
            console.error('🚪 Error clearing GPS permission status:', error);
        }
    }
    
    resetGPSPermission() {
        console.log('🚪 Resetting GPS permission...');
        this.clearGPSPermissionStatus();
        
        // Reset the gate state
        this.gates.gpsPermission.passed = false;
        this.updateGateStatus('gpsPermission', 'pending', 'GPS permission required');
        
        // Reset button text using beautiful welcome screen styling
        if (this.gpsButton) {
            this.gpsButton.innerHTML = '<span class="gps-check">🔄</span>Enable Location Access';
            this.gpsButton.className = 'gps-active-btn';
        }
        
        console.log('🚪 GPS permission reset complete');
    }
    
    initializeGPSCoreWithPosition(position) {
        console.log('🚪 Initializing GPS Core with position data...');
        
        try {
            // Initialize GPS Core if available
            if (window.GPSCore) {
                if (!window.gpsCore) {
                    window.gpsCore = new window.GPSCore();
                    console.log('🚪 GPS Core initialized');
                }
                
                // Start location tracking in GPS Core
                if (window.gpsCore && typeof window.gpsCore.startTracking === 'function') {
                    window.gpsCore.startTracking();
                    console.log('🚪 GPS Core location tracking started');
                }
            } else {
                console.warn('🚪 GPS Core class not available');
            }
            
            // Store position globally for game systems
            window.playerPosition = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: position.timestamp
            };
            console.log('🚪 Position data stored globally:', window.playerPosition);
            
            // Also store in localStorage for persistence
            localStorage.setItem('eldritch_player_position', JSON.stringify(window.playerPosition));
            console.log('🚪 Position data stored in localStorage');
            
            // Set position in map engine if available
            if (window.mapEngine && typeof window.mapEngine.setPlayerPosition === 'function') {
                window.mapEngine.setPlayerPosition(window.playerPosition);
                console.log('🚪 Position data set in map engine');
            }
            
            // Update map position if map is already initialized
            if (window.map && typeof window.map.setView === 'function') {
                window.map.setView([window.playerPosition.lat, window.playerPosition.lng], 18);
                console.log('🚪 Map centered on GPS position:', window.playerPosition);
            }
            
            // Trigger position update event for other systems
            if (window.EventBus && typeof window.EventBus.emit === 'function') {
                window.EventBus.emit('player:position:updated', window.playerPosition);
                console.log('🚪 Position update event emitted');
            } else {
                console.log('🚪 EventBus not available yet, position will be updated when systems initialize');
            }
            
            // Force refresh multiplayer panel
            if (window.multiplayerPanel && typeof window.multiplayerPanel._refresh === 'function') {
                window.multiplayerPanel._refresh();
                console.log('🚪 Multiplayer panel refreshed');
            }
            
            // Send position update to server via websocket
            if (window.websocketClient && typeof window.websocketClient.sendPositionUpdate === 'function') {
                window.websocketClient.sendPositionUpdate(window.playerPosition);
                console.log('🚪 Position update sent to server:', window.playerPosition);
            }
            
        } catch (error) {
            console.error('🚪 Error initializing GPS Core:', error);
        }
    }
    
    handlePlayerChoice(choice) {
        console.log('🚪 handlePlayerChoice called with:', choice);
        
        try {
            // Store player choice
            localStorage.setItem('eldritch_player_choice', choice);
            console.log('🚪 Player choice stored in localStorage:', choice);
            
            // For continue adventure, check if there's existing player data
            if (choice === 'continue') {
                const existingPlayerId = localStorage.getItem('eldritch_player_id');
                console.log('🚪 Checking for existing player ID:', existingPlayerId);
                if (!existingPlayerId) {
                    console.log('🚪 No existing player found, switching to new adventure');
                    localStorage.setItem('eldritch_player_choice', 'new');
                    choice = 'new';
                } else {
                    console.log('🚪 Continuing with existing player:', existingPlayerId);
                    // Restore game state for continue adventure
                    this.restoreGameStateForContinue();
                }
            }
            
            // For new adventure, clear any existing player data
            if (choice === 'new') {
                localStorage.removeItem('eldritch_player_id');
                console.log('🚪 Cleared existing player data for new adventure');
            }
            
            console.log('🚪 Calling passGate with choice:', choice);
            this.passGate('playerChoice', `Player chose: ${choice === 'continue' ? 'Continue Adventure' : 'Start New Adventure'}`);
            
            // Show welcome notification for new adventures only
            if (choice === 'new') {
                console.log('🌟 New adventure selected - will show welcome notification after initialization');
                // Store flag to show welcome notification after systems initialize
                localStorage.setItem('show_new_adventure_welcome', 'true');
            }
        } catch (error) {
            console.error('🚪 Error handling player choice:', error);
            alert('Error saving your choice. Please try again.');
        }
    }
    
    /**
     * Restore complete game state for continue adventure
     * Consciousness-serving: Systematic restoration with error handling
     */
    restoreGameStateForContinue() {
        console.log('🚪 Restoring game state for continue adventure...');
        
        // Wait for systems to be fully initialized
        setTimeout(() => {
            this.performGameStateRestoration();
        }, 5000); // Increased delay for system initialization
    }
    
    /**
     * Perform game state restoration with system readiness checks
     */
    performGameStateRestoration() {
        // Check if all systems are ready
        if (!this.areSystemsReady()) {
            console.warn('⚠️ Systems not ready, retrying in 2 seconds...');
            setTimeout(() => this.performGameStateRestoration(), 2000);
            return;
        }
        
        console.log('🚪 All systems ready, performing restoration...');
        
        // Log current restoration status
        this.logRestorationStatus();
        
        // Perform restoration tasks
        const restorationTasks = [
            () => this.restorePlayerMarkers(),
            () => this.restorePlayerBase(),
            () => this.restoreQuestMarkers(),
            () => this.restorePathMarkers(),
            () => this.restoreMapObjects(),
            () => this.restoreAuroraNPC(),
            () => this.restoreStepDetection(),
            () => this.forceRequestGameState()
        ];
        
        restorationTasks.forEach((task, index) => {
            try {
                task();
                console.log(`🚪 Restoration task ${index + 1} completed successfully`);
            } catch (error) {
                console.error(`❌ Restoration task ${index + 1} failed:`, error);
            }
        });
        
        console.log('🚪 Game state restoration process completed');
    }
    
    /**
     * Check if all required systems are ready
     */
    areSystemsReady() {
        const systemsReady = {
            mapLayer: !!window.mapLayer,
            websocketClient: !!window.websocketClient,
            stepCurrencySystem: !!window.stepCurrencySystem,
            auroraEncounter: !!window.auroraEncounter
        };
        
        console.log('🚪 System readiness check:', systemsReady);
        
        return systemsReady.mapLayer && 
               systemsReady.websocketClient && 
               systemsReady.stepCurrencySystem &&
               systemsReady.auroraEncounter;
    }
    
    /**
     * Log current restoration status for debugging
     */
    logRestorationStatus() {
        console.log('🚪 === GAME STATE RESTORATION STATUS ===');
        console.log('🚪 Player ID:', localStorage.getItem('eldritch_player_id'));
        console.log('🚪 Player Choice:', localStorage.getItem('eldritch_player_choice'));
        console.log('🚪 Steps:', localStorage.getItem('eldritch_steps'));
        console.log('🚪 Aurora State:', localStorage.getItem('aurora_npc_state'));
        console.log('🚪 Base State:', localStorage.getItem('player_base_state'));
        console.log('🚪 WebSocket Connected:', window.websocketClient?.isConnected);
        console.log('🚪 Map Layer Ready:', !!window.mapLayer);
        console.log('🚪 Aurora System Ready:', !!window.auroraEncounter);
        console.log('🚪 ======================================');
    }
    
    /**
     * Restore player markers with consciousness-serving validation
     */
    restorePlayerMarkers() {
        if (!window.mapLayer?.playerMarkerPersistence) {
            console.warn('⚠️ MapLayer or player marker persistence not available');
            return;
        }
        
        const savedPosition = window.mapLayer.playerMarkerPersistence.loadMarkerPosition();
        if (savedPosition) {
            console.log('🚪 Restoring player marker position:', savedPosition);
        } else {
            console.log('🚪 No saved player marker position found');
        }
    }
    
    /**
     * Restore player base with consciousness-serving validation
     */
    restorePlayerBase() {
        console.log('🚪 Restoring player base...');
        
        // Try to restore from base system
        if (window.baseSystem && typeof window.baseSystem.loadPlayerBase === 'function') {
            try {
                window.baseSystem.loadPlayerBase();
                console.log('🚪 Player base restoration attempted via base system');
            } catch (error) {
                console.warn('⚠️ Base system restoration failed:', error);
            }
        }
        
        // Try to restore from step currency system
        if (window.stepCurrencySystem && typeof window.stepCurrencySystem.restorePlayerBase === 'function') {
            try {
                window.stepCurrencySystem.restorePlayerBase();
                console.log('🚪 Player base restoration attempted via step currency system');
            } catch (error) {
                console.warn('⚠️ Step currency system base restoration failed:', error);
            }
        }
        
        // Try to restore from localStorage directly
        this.restoreBaseFromStorage();
    }
    
    /**
     * Restore base from localStorage
     */
    restoreBaseFromStorage() {
        try {
            // Try multiple localStorage keys for base data
            let savedBase = localStorage.getItem('eldritch-player-base');
            if (!savedBase) {
                savedBase = localStorage.getItem('playerBase');
            }
            if (!savedBase) {
                savedBase = localStorage.getItem('base_bases');
            }
            
            if (savedBase) {
                const baseData = JSON.parse(savedBase);
                console.log('🚪 Found saved base data:', baseData);
                
                // Create base marker if map is available
                if (window.map && baseData.position) {
                    this.createBaseMarkerFromData(baseData);
                }
            } else {
                console.log('🚪 No saved base data found');
            }
        } catch (error) {
            console.warn('⚠️ Error restoring base from storage:', error);
        }
    }
    
    /**
     * Create base marker from saved data
     */
    createBaseMarkerFromData(baseData) {
        try {
            if (window.mapObjectManager && baseData.position) {
                const objectId = window.mapObjectManager.createObject('BASE', baseData.position, {
                    size: baseData.size || 40,
                    color: baseData.color || '#8b5cf6',
                    restored: true
                });
                console.log('🚪 Base marker restored with ID:', objectId);
            }
        } catch (error) {
            console.warn('⚠️ Error creating base marker:', error);
        }
    }
    
    /**
     * Restore quest markers with consciousness-serving validation
     */
    restoreQuestMarkers() {
        console.log('🚪 Restoring quest markers...');
        
        // Try to restore from quest system
        if (window.unifiedQuestSystem && typeof window.unifiedQuestSystem.restoreQuestMarkers === 'function') {
            try {
                window.unifiedQuestSystem.restoreQuestMarkers();
                console.log('🚪 Quest markers restoration attempted via quest system');
            } catch (error) {
                console.warn('⚠️ Quest system restoration failed:', error);
            }
        }
        
        // Try to restore from session persistence
        if (window.sessionPersistence && typeof window.sessionPersistence.restoreQuestState === 'function') {
            try {
                const questState = window.sessionPersistence.restoreQuestState();
                if (questState && questState.markers) {
                    this.restoreQuestMarkersFromData(questState.markers);
                }
            } catch (error) {
                console.warn('⚠️ Session persistence quest restoration failed:', error);
            }
        }
    }
    
    /**
     * Restore quest markers from data
     */
    restoreQuestMarkersFromData(markers) {
        try {
            if (Array.isArray(markers) && window.mapObjectManager) {
                markers.forEach(markerData => {
                    if (markerData.position) {
                        window.mapObjectManager.createObject('QUEST', markerData.position, {
                            size: markerData.size || 30,
                            color: markerData.color || '#00bfff',
                            restored: true,
                            questId: markerData.questId
                        });
                    }
                });
                console.log(`🚪 Restored ${markers.length} quest markers`);
            }
        } catch (error) {
            console.warn('⚠️ Error restoring quest markers from data:', error);
        }
    }
    
    /**
     * Restore path markers with consciousness-serving validation
     */
    restorePathMarkers() {
        console.log('🚪 Restoring path markers...');
        
        // Try to restore from session persistence
        if (window.sessionPersistence && typeof window.sessionPersistence.restorePathMarkers === 'function') {
            try {
                const pathMarkers = window.sessionPersistence.restorePathMarkers();
                if (pathMarkers && Array.isArray(pathMarkers)) {
                    this.restorePathMarkersFromData(pathMarkers);
                }
            } catch (error) {
                console.warn('⚠️ Session persistence path marker restoration failed:', error);
            }
        }
        
        // Try to restore from localStorage
        this.restorePathMarkersFromStorage();
    }
    
    /**
     * Restore path markers from localStorage
     */
    restorePathMarkersFromStorage() {
        try {
            const savedMarkers = localStorage.getItem('eldritch_path_markers');
            if (savedMarkers) {
                const markers = JSON.parse(savedMarkers);
                if (Array.isArray(markers)) {
                    this.restorePathMarkersFromData(markers);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error restoring path markers from storage:', error);
        }
    }
    
    /**
     * Restore path markers from data
     */
    restorePathMarkersFromData(markers) {
        try {
            if (Array.isArray(markers) && window.mapObjectManager) {
                markers.forEach(markerData => {
                    if (markerData.position) {
                        window.mapObjectManager.createObject('POI', markerData.position, {
                            size: markerData.size || 20,
                            color: markerData.color || '#ff6b6b',
                            restored: true,
                            pathMarker: true
                        });
                    }
                });
                console.log(`🚪 Restored ${markers.length} path markers`);
            }
        } catch (error) {
            console.warn('⚠️ Error restoring path markers from data:', error);
        }
    }
    
    /**
     * Restore other map objects with consciousness-serving validation
     */
    restoreMapObjects() {
        console.log('🚪 Restoring other map objects...');
        
        // Try to restore from session persistence
        if (window.sessionPersistence && typeof window.sessionPersistence.restoreMapObjects === 'function') {
            try {
                const mapObjects = window.sessionPersistence.restoreMapObjects();
                if (mapObjects && Array.isArray(mapObjects)) {
                    this.restoreMapObjectsFromData(mapObjects);
                }
            } catch (error) {
                console.warn('⚠️ Session persistence map object restoration failed:', error);
            }
        }
        
        // Try to restore from localStorage
        this.restoreMapObjectsFromStorage();
    }
    
    /**
     * Restore map objects from localStorage
     */
    restoreMapObjectsFromStorage() {
        try {
            const savedObjects = localStorage.getItem('eldritch_map_objects');
            if (savedObjects) {
                const objects = JSON.parse(savedObjects);
                if (Array.isArray(objects)) {
                    this.restoreMapObjectsFromData(objects);
                }
            }
        } catch (error) {
            console.warn('⚠️ Error restoring map objects from storage:', error);
        }
    }
    
    /**
     * Restore map objects from data
     */
    restoreMapObjectsFromData(objects) {
        try {
            if (Array.isArray(objects) && window.mapObjectManager) {
                objects.forEach(objectData => {
                    if (objectData.position && objectData.type) {
                        window.mapObjectManager.createObject(objectData.type, objectData.position, {
                            size: objectData.size || 25,
                            color: objectData.color || '#4ecdc4',
                            restored: true,
                            ...objectData.options
                        });
                    }
                });
                console.log(`🚪 Restored ${objects.length} map objects`);
            }
        } catch (error) {
            console.warn('⚠️ Error restoring map objects from data:', error);
        }
    }

    /**
     * Restore Aurora NPC with consciousness-serving validation
     */
    restoreAuroraNPC() {
        if (!window.auroraEncounter?.handleAppStarted) {
            console.warn('⚠️ Aurora encounter system not available');
            return;
        }
        
        console.log('🚪 Ensuring Aurora NPC is spawned for continue adventure');
        
        // Emit continue adventure event for Aurora system
        if (window.EventBus && typeof window.EventBus.emit === 'function') {
            window.EventBus.emit('game:continue:adventure');
        }
        
        window.auroraEncounter.handleAppStarted();
    }
    
    /**
     * Restore step detection with consciousness-serving validation
     */
    restoreStepDetection() {
        if (!window.stepCurrencySystem?.enableStepDetection) {
            console.warn('⚠️ Step currency system not available');
            return;
        }
        
        console.log('🚪 Enabling step detection for continue adventure');
        window.stepCurrencySystem.enableStepDetection();
    }
    
    /**
     * Request server game state with consciousness-serving validation
     */
    requestServerGameState() {
        if (!window.websocketClient?.isConnectedToServer || !window.websocketClient.isConnectedToServer()) {
            console.warn('⚠️ WebSocket client not connected, will retry when connection is ready');
            // Set up a retry mechanism for when WebSocket connects
            this.setupWebSocketRetry();
            return;
        }
        
        console.log('🚪 Requesting full game state from server...');
        window.websocketClient.requestGameState();
    }
    
    /**
     * Force request game state for continue adventure
     */
    forceRequestGameState() {
        console.log('🚪 Force requesting game state for continue adventure...');
        
        // Ensure player choice is set
        localStorage.setItem('eldritch_player_choice', 'continue');
        
        // Request game state if WebSocket is connected
        if (window.websocketClient?.isConnectedToServer && window.websocketClient.isConnectedToServer()) {
            console.log('🚪 WebSocket connected, requesting game state...');
            window.websocketClient.requestGameState();
        } else {
            console.log('🚪 WebSocket not connected, will retry...');
            this.setupWebSocketRetry();
        }
    }
    
    /**
     * Setup retry mechanism for WebSocket connection
     */
    setupWebSocketRetry() {
        const maxRetries = 20; // Increased retries
        let retryCount = 0;
        
        const retryInterval = setInterval(() => {
            retryCount++;
            
            if (window.websocketClient?.isConnectedToServer && window.websocketClient.isConnectedToServer()) {
                console.log('🚪 WebSocket connected, requesting game state...');
                window.websocketClient.requestGameState();
                clearInterval(retryInterval);
            } else if (retryCount >= maxRetries) {
                console.warn('⚠️ Max retries reached for WebSocket game state request');
                clearInterval(retryInterval);
            } else {
                console.log(`🚪 Retrying WebSocket game state request (${retryCount}/${maxRetries})`);
            }
        }, 500); // Faster retry interval
    }
    
    // User consent no longer needed - adventure choice buttons instantly load game
    
    passGate(gateName, message) {
        console.log(`🚪 Gate passed: ${gateName} - ${message}`);
        
        this.gates[gateName].passed = true;
        this.updateGateStatus(gateName, 'success', message);
        this.updateGateVisibility();
        
        // Update buttons when map becomes ready
        if (gateName === 'mapReady') {
            console.log('🚪 Map ready - updating adventure buttons...');
            // Re-evaluate button states now that map is ready
            this.checkPlayerData(); // This will call updatePlayerChoiceButtons with current state
            
            // Hide any map loading indicator
            this.hideMapLoadingIndicator();
        }
        
        // Check if all gates are passed
        if (this.allGatesPassed()) {
            this.initializeSystems();
        }
    }
    
    updateGateStatus(gateName, status, message) {
        console.log(`🚪 updateGateStatus called: ${gateName}, ${status}, ${message}`);
        
        // Use stored element references instead of getElementById
        let statusElement, stepElement;
        
        switch (gateName) {
            case 'gpsPermission':
                // Update GPS button text directly using beautiful welcome screen styling
                if (this.gpsButton) {
                    if (status === 'success') {
                        this.gpsButton.innerHTML = '<span class="gps-check">✓</span>GPS ACTIVE';
                        this.gpsButton.className = 'gps-active-btn'; // Use original beautiful styling
                    } else if (status === 'pending') {
                        this.gpsButton.innerHTML = '<span class="gps-check">🔄</span>Requesting Location Access...';
                        this.gpsButton.className = 'gps-active-btn'; // Keep beautiful styling
                    } else if (status === 'error') {
                        this.gpsButton.innerHTML = '<span class="gps-check">❌</span>Location Access Denied';
                        this.gpsButton.className = 'gps-active-btn'; // Keep beautiful styling
                    }
                    console.log(`🚪 GPS button updated:`, this.gpsButton.textContent);
                }
                stepElement = this.stepElement;
                break;
            case 'playerChoice':
                statusElement = this.playerStatusElement;
                stepElement = this.playerStepElement;
                break;
            case 'mapReady':
                // Map readiness doesn't need UI updates since it's handled internally
                console.log(`🚪 Map readiness gate: ${status} - ${message}`);
                return;
            default:
                console.error(`🚪 Unknown gate name: ${gateName}`);
                return;
        }
        
        // Update status element for non-GPS gates
        if (statusElement && gateName !== 'gpsPermission') {
            console.log(`🚪 Status element found:`, !!statusElement, statusElement);
            statusElement.textContent = message;
            statusElement.className = `step-status ${status}`;
            console.log(`🚪 Status element updated:`, statusElement.textContent, statusElement.className);
        }
        
        console.log(`🚪 Step element found:`, !!stepElement, stepElement);
        if (stepElement) {
            stepElement.classList.remove('active', 'completed');
            if (status === 'success') {
                stepElement.classList.add('completed');
                console.log(`🚪 Step element marked as completed`);
            } else if (status === 'pending') {
                stepElement.classList.add('active');
                console.log(`🚪 Step element marked as active`);
            }
        } else {
            // Step elements not needed when using welcome screen integration
            console.log(`🚪 Step element not found: ${gateName}-step (using welcome screen integration)`);
        }
    }
    
    updateGateVisibility() {
        // Use stored element references
        const gpsStep = this.stepElement;
        const playerStep = this.playerStepElement;
        
        // Show GPS step first (only if it exists)
        if (gpsStep) {
            gpsStep.style.display = 'flex';
        }
        
        // Show player choice step after GPS permission (only if it exists)
        if (this.gates.gpsPermission.passed && playerStep) {
            playerStep.style.display = 'flex';
        }
    }
    
    allGatesPassed() {
        // Check GPS permission and player choice
        const gpsPassed = this.gates.gpsPermission.passed;
        const playerPassed = this.gates.playerChoice.passed;
        // Map readiness not required - map will be initialized after gate completes
        const mapPassed = true; // Always true since map is initialized after gate
        
        // Note: Removed auto-passing player choice to allow user selection
        // Players must manually choose between Continue Adventure or Start New Adventure
        
        console.log('🚪 Checking if all gates passed:', {
            gpsPermission: gpsPassed,
            playerChoice: playerPassed,
            mapReady: mapPassed,
            allPassed: gpsPassed && playerPassed && mapPassed
        });
        
        return gpsPassed && playerPassed && mapPassed;
    }
    
    async initializeSystems() {
        if (this.isInitializing || this.initializationComplete) {
            return;
        }
        
        console.log('🚪 All gates passed - initializing systems...');
        this.isInitializing = true;
        
        try {
            // Initialize systems in proper order
            await this.initializeCoreSystems();
            await this.initializeLocationSystems();
            await this.initializeGameSystems();
            await this.initializeUISystems();
            
            this.initializationComplete = true;
            this.hideGateOverlay();
            
            // Ensure welcome screen stays hidden
            const welcomeScreen = document.getElementById('welcome-screen');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
                console.log('🚪 Welcome screen permanently hidden');
            }
            
            console.log('🚪 System initialization complete');
        } catch (error) {
            console.error('🚪 System initialization failed:', error);
            // Show error message to user
            alert('Game initialization failed. Please refresh the page and try again.');
        }
    }
    
    async initializeCoreSystems() {
        console.log('🚪 Initializing core systems...');
        
        // GPS Core is already initialized, just ensure it's ready
        if (window.gpsCore) {
            console.log('🚪 GPS Core already initialized and ready');
        } else {
            console.warn('🚪 GPS Core not found, but continuing...');
        }
        
        // Initialize other core systems
        // Add other core system initializations here
    }
    
    async initializeLocationSystems() {
        console.log('🚪 Initializing location systems...');
        
        // Initialize location-dependent systems only after GPS permission
        // Add location system initializations here
    }
    
    async initializeGameSystems() {
        console.log('🚪 Initializing game systems...');
        
        // Initialize game systems based on player choice
        const playerChoice = localStorage.getItem('eldritch_player_choice');
        console.log('🚪 Player choice for initialization:', playerChoice);
        
        // Trigger game state restoration for continue adventure
        if (playerChoice === 'continue') {
            console.log('🚪 Continue adventure detected - triggering game state restoration...');
            this.restoreGameStateForContinue();
        }
        
        // The main game initialization is handled by the HTML script
        // We just need to mark that we're ready for it
        console.log('🚪 Game systems ready for main initialization');
    }
    
    async initializeUISystems() {
        console.log('🚪 Initializing UI systems...');
        
        // Initialize UI systems last
        // Add UI system initializations here
    }
    
    hideGateOverlay() {
        console.log('🚪 Hiding gate overlay...');
        
        // Check if we're using the welcome screen
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen && welcomeScreen.style.display !== 'none') {
            console.log('🚪 Hiding welcome screen...');
            welcomeScreen.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                welcomeScreen.style.display = 'none';
                console.log('🚪 Welcome screen hidden');
            }, 500);
            return;
        }
        
        // Otherwise hide the lazy loading gate overlay
        const overlay = document.getElementById('lazy-loading-gate-overlay');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.5s ease';
            setTimeout(() => {
                overlay.remove();
                console.log('🚪 Lazy loading gate overlay removed');
            }, 500);
        } else {
            console.warn('🚪 Lazy loading gate overlay not found');
        }
    }
    
    // Public API methods
    getGateStatus(gateName) {
        return this.gates[gateName];
    }
    
    getAllGateStatus() {
        return this.gates;
    }
    
    isInitializationComplete() {
        return this.initializationComplete;
    }
    
    // Method to queue system initialization
    queueSystemInitialization(systemName, initFunction) {
        this.initializationQueue.push({ systemName, initFunction });
        console.log(`🚪 Queued system initialization: ${systemName}`);
    }
}

// Initialize the lazy loading gate system
console.log('🚪 Creating LazyLoadingGate instance...');
window.lazyLoadingGate = new LazyLoadingGate();
console.log('🚪 LazyLoadingGate instance created:', !!window.lazyLoadingGate);

// Export for use in other modules
window.LazyLoadingGate = LazyLoadingGate;

// Global function to manually trigger game state restoration (for testing)
window.triggerGameStateRestoration = () => {
    if (window.lazyLoadingGate) {
        console.log('🚪 Manual game state restoration triggered');
        window.lazyLoadingGate.restoreGameStateForContinue();
    } else {
        console.error('❌ LazyLoadingGate not available');
    }
};

console.log('🚪 Lazy Loading Gate System loaded');
