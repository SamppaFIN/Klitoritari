/**
 * Welcome Screen System
 * Handles the onboarding experience for new players
 */

class WelcomeScreen {
    constructor() {
        this.isVisible = true;
        this.hasSeenWelcome = false;
        this.tutorialStep = 0;
        this.maxTutorialSteps = 4;
        this.gpsEnabled = false;
        this.gpsPermissionRequested = false;
    }

    init() {
        console.log('🌟 Welcome screen initialized');
        this.checkIfFirstVisit();
        this.setupEventListeners();
        this.showInitialLoading();
    }

    showInitialLoading() {
        // Show welcome screen immediately with integrated Klitoritarit branding
        this.showWelcomeScreen();
    }


    checkIfFirstVisit() {
        // Check if user has seen the welcome screen before
        const hasSeenWelcome = localStorage.getItem('eldritch_welcome_seen');
        if (hasSeenWelcome === 'true') {
            this.hasSeenWelcome = true;
            // Returning users: show welcome to choose Continue or Start Fresh
            console.log('🌟 Returning user detected, showing choice screen');
        }
    }

    setupEventListeners() {
        // GPS Enable button
        const enableGpsBtn = document.getElementById('enable-gps-btn');
        if (enableGpsBtn) {
            console.log('🌟 GPS enable button found, adding event listener');
            enableGpsBtn.addEventListener('click', () => {
                console.log('📍 GPS enable button clicked!');
                this.requestGPSPermission();
            });
        } else {
            console.error('🌟 GPS enable button not found!');
        }

        // Continue adventure button
        const continueBtn = document.getElementById('continue-adventure');
        if (continueBtn) {
            console.log('🌟 Continue adventure button found, adding event listener');
            continueBtn.addEventListener('click', () => {
                console.log('🔄 Continue adventure button clicked!');
                this.continueAdventure();
            });
        } else {
            console.error('🌟 Continue adventure button not found!');
        }

        // Start fresh adventure button
        const startFreshBtn = document.getElementById('start-fresh');
        if (startFreshBtn) {
            console.log('🌟 Start fresh adventure button found, adding event listener');
            startFreshBtn.addEventListener('click', () => {
                console.log('🚀 Start fresh adventure button clicked!');
                this.startFreshAdventure();
            });
        } else {
            console.error('🌟 Start fresh adventure button not found!');
        }

        // Close welcome screen on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.skipTutorial();
            }
        });
    }

    showWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'flex';
            this.isVisible = true;
            this.animateWelcomeScreen();
            this.updateContinueAdventureLabel();
        }
    }

    hideWelcomeScreen() {
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
            this.isVisible = false;
        }
    }

    animateWelcomeScreen() {
        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            welcomeContent.style.opacity = '0';
            welcomeContent.style.transform = 'scale(0.8) translateY(50px)';
            
            setTimeout(() => {
                welcomeContent.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                welcomeContent.style.opacity = '1';
                welcomeContent.style.transform = 'scale(1) translateY(0)';
            }, 100);
        }
    }

    continueAdventure() {
        console.log('🔄 Continuing existing adventure!');
        
        // Mark welcome as seen
        localStorage.setItem('eldritch_welcome_seen', 'true');
        this.hasSeenWelcome = true;
        
        // Hide welcome screen immediately and start game
        console.log('🌟 Hiding welcome screen and initializing game...');
        this.hideWelcomeScreen();
        this.initializeGame(false); // false = don't reset
        
        // Start NPC simulation after welcome screen is dismissed
        if (window.eldritchApp) {
            window.eldritchApp.startNPCSimulation();
        }
    }

    updateContinueAdventureLabel() {
        try {
            const btn = document.getElementById('continue-adventure');
            if (!btn) return;
            // Load profile
            let name = 'Wanderer';
            try {
                const raw = localStorage.getItem((window.sessionPersistence?.key && window.sessionPersistence.key('profile')) || '');
                if (raw) {
                    const prof = JSON.parse(raw);
                    if (prof?.name) name = prof.name;
                }
            } catch (_) {}
            // Load morals
            let morals = this.getMoralSummary();
            // Nickname
            let nick = '';
            try { nick = window.eldritchApp?.systems?.moralChoice?.getNickname?.() || ''; } catch (_) {}
            const nickText = nick ? `, ${nick}` : '';
            btn.textContent = morals ? `Continue as ${name}${nickText} ${morals}` : `Continue as ${name}${nickText}`;
        } catch (_) {}
    }

    getMoralSummary() {
        try {
            const raw = localStorage.getItem('eldritch-moral-alignment');
            if (!raw) return '';
            const a = JSON.parse(raw);
            const fmt = (v)=> (v>0?`+${v}`:`${v}`);
            // Keep short
            return `(cosmic ${fmt(Math.trunc(a.cosmic||0))} · ethical ${fmt(Math.trunc(a.ethical||0))} · wisdom ${fmt(Math.trunc(a.wisdom||0))})`;
        } catch (_) { return ''; }
    }

    startFreshAdventure() {
        console.log('🚀 Starting fresh cosmic adventure!');
        
        // Mark welcome as seen
        localStorage.setItem('eldritch_welcome_seen', 'true');
        // Ensure tutorial/onboarding will be shown after map init
        localStorage.setItem('eldritch_show_tutorial', 'true');
        // Start tutorial encounter system
        localStorage.setItem('eldritch_start_tutorial_encounter', 'true');
        this.hasSeenWelcome = true;
        
        // Reset all game state
        this.resetAllGameState();
        
        // Show player identity setup dialog first
        this.showPlayerIdentityDialog();
    }

    showPlayerIdentityDialog() {
        console.log('🎭 Showing player identity setup dialog');
        
        // Hide welcome screen
        this.hideWelcomeScreen();
        
        // Show user settings modal
        const modal = document.getElementById('user-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Populate the form with defaults
            this.populateIdentityForm();
            
            // Set up event listeners for the form
            this.setupIdentityFormListeners();
        } else {
            console.warn('🎭 User settings modal not found, proceeding without identity setup');
            this.proceedWithGameStart();
        }
    }

    populateIdentityForm() {
        const nameInput = document.getElementById('player-name-input');
        const colorInput = document.getElementById('path-color-input');
        const symbolGrid = document.getElementById('symbol-options');
        
        // Set default name
        if (nameInput) {
            nameInput.value = 'Cosmic Wanderer';
        }
        
        // Set default color
        if (colorInput) {
            colorInput.value = '#00ff88';
        }
        
        // Generate symbol options using tutorial system
        if (symbolGrid) {
            if (window.tutorialSystem && window.tutorialSystem.getSymbolOptionsHTML) {
                symbolGrid.innerHTML = window.tutorialSystem.getSymbolOptionsHTML();
            } else {
                // Fallback to simple symbols if tutorial system not available
                const symbols = ['🌟', '⭐', '✨', '💫', '🌙', '☀️', '🔮', '💎', '🌌', '🎭'];
                symbolGrid.innerHTML = symbols.map(symbol => 
                    `<div class="symbol-option" data-symbol="${symbol}">${symbol}</div>`
                ).join('');
            }
        }
    }

    setupIdentityFormListeners() {
        const modal = document.getElementById('user-settings-modal');
        const saveBtn = document.getElementById('save-user-settings');
        const cancelBtn = document.getElementById('cancel-user-settings');
        
        if (saveBtn) {
            saveBtn.onclick = () => this.saveIdentityAndStart();
        }
        
        if (cancelBtn) {
            cancelBtn.onclick = () => this.cancelIdentitySetup();
        }
        
        // Symbol selection
        const symbolGrid = document.getElementById('symbol-options');
        if (symbolGrid) {
            symbolGrid.addEventListener('click', (e) => {
                if (e.target.classList.contains('symbol-option')) {
                    // Remove previous selection
                    symbolGrid.querySelectorAll('.symbol-option').forEach(opt => opt.classList.remove('selected'));
                    // Add selection to clicked option
                    e.target.classList.add('selected');
                }
            });
        }
    }

    saveIdentityAndStart() {
        console.log('🎭 Saving player identity and starting game');
        
        const nameInput = document.getElementById('player-name-input');
        const colorInput = document.getElementById('path-color-input');
        const symbolGrid = document.getElementById('symbol-options');
        
        const name = (nameInput?.value || '').trim() || 'Cosmic Wanderer';
        const color = colorInput?.value || '#00ff88';
        const selectedSymbol = symbolGrid?.querySelector('.symbol-option.selected');
        const symbol = selectedSymbol?.dataset.symbol || '🌟';
        
        // Save to localStorage
        localStorage.setItem('eldritch_player_name', name);
        localStorage.setItem('eldritch_player_color', color);
        localStorage.setItem('eldritch_player_symbol', symbol);
        
        // Update multiplayer profile if available
        if (window.multiplayerManager) {
            window.multiplayerManager.updateLocalProfile({ name, symbol, pathColor: color });
        }
        
        // Hide modal and start game
        const modal = document.getElementById('user-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        this.proceedWithGameStart();
    }

    cancelIdentitySetup() {
        console.log('🎭 Canceling identity setup, returning to welcome screen');
        
        // Hide modal
        const modal = document.getElementById('user-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Show welcome screen again
        this.showWelcomeScreen();
    }

    proceedWithGameStart() {
        console.log('🌟 Starting game after identity setup...');
        this.initializeGame(true); // true = reset everything
        
        // Start NPC simulation after welcome screen is dismissed
        if (window.eldritchApp) {
            window.eldritchApp.startNPCSimulation();
        }
    }

    resetAllGameState() {
        console.log('🔄 Resetting all game state for fresh start...');
        
        try {
            // Clear any existing player base so fresh start has no base
            try {
                localStorage.removeItem('eldritch-player-base');
            } catch (e) {
                console.warn('Failed to clear player base storage:', e);
            }

            // Reset step currency system
            if (window.stepCurrencySystem) {
                window.stepCurrencySystem.totalSteps = 0;
                window.stepCurrencySystem.sessionSteps = 0;
                window.stepCurrencySystem.saveSteps();
                window.stepCurrencySystem.updateStepCounter();
                console.log('🚶‍♂️ Step currency reset');
            }
            
            // Reset encounter system
            if (window.encounterSystem) {
                window.encounterSystem.resetEncounterFlags();
                window.encounterSystem.playerSteps = 0;
                window.encounterSystem.playerStats = {
                    health: 100,
                    maxHealth: 100,
                    sanity: 100,
                    maxSanity: 100,
                    attack: 15,
                    defense: 10,
                    luck: 12,
                    experience: 0,
                    level: 1,
                    inventory: [],
                    equipment: {
                        weapon: null,
                        armor: null,
                        accessory: null
                    },
                    skills: {
                        combat: 1,
                        diplomacy: 1,
                        investigation: 1,
                        survival: 1
                    },
                    traits: [],
                    reputation: {},
                    isDead: false,
                    deathReason: null
                };
                window.encounterSystem.updateStatBars();
                console.log('🎭 Encounter system reset');
            }

            // Remove only current player's flags from the canvas and persistence
            try {
                const ownerId = window.multiplayerManager ? window.multiplayerManager.playerId : null;
                if (ownerId && window.mapEngine && window.mapEngine.finnishFlagLayer) {
                    window.mapEngine.finnishFlagLayer.removeFlagsByOwner(ownerId);
                    console.log('🇫🇮 Cleared current player\'s flags');
                } else {
                    // Fallback: clear all flags if ownerId not available
                    if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                        window.mapEngine.finnishFlagLayer.clearFlags();
                    }
                }
            } catch (_) {}
            
            // Reset quest system
            if (window.unifiedQuestSystem) {
                window.unifiedQuestSystem.resetQuestsForGameStart();
                window.unifiedQuestSystem.visitedQuests.clear();
                window.unifiedQuestSystem.questCooldowns.clear();
                console.log('📜 Quest system reset');
            }
            
            // Clear session persistence
            if (window.sessionPersistence) {
                try {
                    localStorage.removeItem(window.sessionPersistence.key('questState'));
                    localStorage.removeItem(window.sessionPersistence.key('mapView'));
                    localStorage.removeItem(window.sessionPersistence.key('path'));
                    localStorage.removeItem(window.sessionPersistence.key('flags'));
                    localStorage.removeItem(window.sessionPersistence.key('profile'));
                    localStorage.removeItem(window.sessionPersistence.key('inventory'));
                    localStorage.removeItem(window.sessionPersistence.key('stats'));
                    localStorage.removeItem(window.sessionPersistence.key('encounters'));
                } catch (e) {
                    console.warn('Failed to clear session persistence:', e);
                }
                console.log('💾 Session persistence cleared');
            }
            
            // Clear other game state
            try {
                localStorage.removeItem('eldritch-steps');
                localStorage.removeItem('adventureMode');
                localStorage.removeItem('eldritch_player_position');
                localStorage.removeItem('eldritch_quest_progress');
                localStorage.removeItem('eldritch_inventory');
                localStorage.removeItem('eldritch_player_stats');
                // Also ensure base modal is hidden if it was open
                const baseModal = document.getElementById('base-management-modal');
                if (baseModal) baseModal.classList.add('hidden');
            } catch (e) {
                console.warn('Failed to clear some localStorage items:', e);
            }
            
            console.log('✅ All game state reset for fresh start');
            
        } catch (error) {
            console.error('❌ Error resetting game state:', error);
        }
    }

    skipTutorial() {
        console.log('⏭️ Skipping tutorial - defaulting to continue adventure');
        
        // Mark welcome as seen
        localStorage.setItem('eldritch_welcome_seen', 'true');
        this.hasSeenWelcome = true;
        
        // Hide welcome screen immediately and continue existing adventure
        this.hideWelcomeScreen();
        this.initializeGame(false); // false = don't reset
        
        // Start NPC simulation after welcome screen is dismissed
        if (window.eldritchApp) {
            window.eldritchApp.startNPCSimulation();
        }
    }


    animateOut(callback) {
        const welcomeContent = document.querySelector('.welcome-content');
        if (welcomeContent) {
            welcomeContent.style.transition = 'all 0.5s ease-in-out';
            welcomeContent.style.opacity = '0';
            welcomeContent.style.transform = 'scale(0.8) translateY(-50px)';
            
            setTimeout(() => {
                if (callback) callback();
            }, 200);
        } else {
            if (callback) callback();
        }
    }

    initializeGame(resetEverything = false) {
        console.log('🎮 Initializing game systems...', resetEverything ? '(with reset)' : '(continuing)');
        
        // Initialize the main app
        if (window.eldritchApp) {
            console.log('🌌 Main app found, calling initializeGame...');
            window.eldritchApp.initializeGame();
        } else {
            console.error('🌌 Main app not found!');
            console.log('🌌 Available window objects:', Object.keys(window).filter(key => key.includes('App') || key.includes('app')));
        }
        
        // Show distortion animation for fresh adventures
        if (resetEverything) {
            // Small delay to ensure systems are initialized
            setTimeout(() => {
                this.showGameTips();
            }, 1000);
        }
    }

    showGameTips() {
        // Start a new distortion animation instead of showing notification
        try {
            if (window.sanityDistortion) {
                console.log('🧠 Starting distortion animation for fresh adventure');
                window.sanityDistortion.makeCanvasVisible?.();
                
                // Trigger a dramatic distortion sequence
                window.sanityDistortion.distortionEffects.blur = 0.8;
                window.sanityDistortion.distortionEffects.chromaticAberration = 0.6;
                window.sanityDistortion.distortionEffects.vignette = 0.7;
                window.sanityDistortion.distortionEffects.shake = 0.5;
                window.sanityDistortion.distortionEffects.colorShift = 0.4;
                
                // Add some dynamic effects
                window.sanityDistortion.addRandomGhostlyShadow();
                window.sanityDistortion.addRandomParticle();
                
                // Gradually fade out the effects over 3 seconds
                setTimeout(() => {
                    window.sanityDistortion.distortionEffects.blur = 0;
                    window.sanityDistortion.distortionEffects.chromaticAberration = 0;
                    window.sanityDistortion.distortionEffects.vignette = 0;
                    window.sanityDistortion.distortionEffects.shake = 0;
                    window.sanityDistortion.distortionEffects.colorShift = 0;
                }, 3000);
            }
        } catch (error) {
            console.warn('Failed to start distortion animation:', error);
        }
        
        // Play a scary scream-like sound if available
        try {
            if (window.soundManager) {
                // Use the most intense available effect as a "scream"
                if (typeof window.soundManager.playTerrifyingBling === 'function') {
                    window.soundManager.playTerrifyingBling();
                } else if (typeof window.soundManager.playWarningSting === 'function') {
                    window.soundManager.playWarningSting();
                } else if (typeof window.soundManager.playEerieHum === 'function') {
                    window.soundManager.playEerieHum({ duration: 1.2 });
                }
            }
        } catch (_) {}
    }

    showTip(message) {
        // Create a temporary tip notification
        const tip = document.createElement('div');
        tip.className = 'game-tip';
        tip.innerHTML = `
            <div class="tip-content">
                <span class="tip-icon">💡</span>
                <span class="tip-text">${message}</span>
                <button class="tip-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        // Add tip styles
        tip.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #ffd700, #ffed4e);
            color: #000;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 20px rgba(255, 215, 0, 0.4);
            z-index: 1000;
            max-width: 400px;
            animation: tipSlideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(tip);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (tip.parentElement) {
                tip.style.animation = 'tipSlideOut 0.5s ease-in';
                setTimeout(() => tip.remove(), 500);
            }
        }, 8000);
    }

    // Method to reset welcome screen (for testing)
    resetWelcome() {
        localStorage.removeItem('eldritch_welcome_seen');
        this.hasSeenWelcome = false;
        this.showWelcomeScreen();
    }

    // Method to show welcome screen again (for testing)
    showWelcomeAgain() {
        this.showWelcomeScreen();
    }

    // GPS Permission Methods
    async requestGPSPermission() {
        if (this.gpsPermissionRequested) {
            console.log('📍 GPS permission already requested');
            return;
        }

        this.gpsPermissionRequested = true;
        this.updateGPSStatus('Requesting GPS permission...', 'loading');

        try {
            // Request geolocation permission
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            });

            console.log('📍 GPS permission granted!', position);
            this.gpsEnabled = true;
            this.updateGPSStatus('GPS enabled successfully!', 'success');
            this.enableGameButtons();

        } catch (error) {
            console.log('📍 GPS permission denied or failed:', error);
            this.updateGPSStatus('GPS permission denied. Game will use fallback location.', 'warning');
            // Still enable buttons - game can work with fallback location
            this.gpsEnabled = true;
            this.enableGameButtons();
        }
    }

    updateGPSStatus(message, status) {
        const statusTitle = document.getElementById('gps-status-title');
        const statusMessage = document.getElementById('gps-status-message');
        const statusIcon = document.getElementById('gps-status-icon');
        const gpsSection = document.getElementById('gps-permission-section');
        const gpsBtn = document.getElementById('enable-gps-btn');

        if (statusTitle) statusTitle.textContent = message;
        if (statusMessage) {
            switch (status) {
                case 'loading':
                    statusMessage.textContent = 'Please allow location access in your browser...';
                    break;
                case 'success':
                    statusMessage.textContent = 'Location services are now active. You can start your adventure!';
                    break;
                case 'warning':
                    statusMessage.textContent = 'Location access was denied. The game will use a default location instead.';
                    break;
                default:
                    statusMessage.textContent = message;
            }
        }

        if (statusIcon) {
            switch (status) {
                case 'loading':
                    statusIcon.textContent = '⏳';
                    break;
                case 'success':
                    statusIcon.textContent = '✅';
                    break;
                case 'warning':
                    statusIcon.textContent = '⚠️';
                    break;
                default:
                    statusIcon.textContent = '📍';
            }
        }

        if (gpsSection) {
            gpsSection.className = `gps-permission-section ${status === 'success' ? 'gps-enabled' : ''}`;
        }

        if (gpsBtn) {
            if (status === 'success' || status === 'warning') {
                gpsBtn.textContent = '✅ GPS Ready';
                gpsBtn.disabled = true;
            } else if (status === 'loading') {
                gpsBtn.textContent = '⏳ Requesting...';
                gpsBtn.disabled = true;
            }
        }
    }

    enableGameButtons() {
        const gameActionsSection = document.getElementById('game-actions-section');
        const continueBtn = document.getElementById('continue-adventure');
        const startBtn = document.getElementById('start-fresh');

        if (gameActionsSection) {
            gameActionsSection.style.display = 'flex';
        }

        if (continueBtn) {
            continueBtn.disabled = false;
        }

        if (startBtn) {
            startBtn.disabled = false;
        }

        console.log('🎮 Game buttons enabled - GPS permission granted');
    }
}

// Add CSS for game tips
const tipStyles = document.createElement('style');
tipStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .game-tip {
        font-family: 'Arial', sans-serif;
    }
    
    .tip-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .tip-icon {
        font-size: 1.2rem;
    }
    
    .tip-text {
        flex: 1;
        font-weight: 500;
    }
    
    .tip-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #000;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .tip-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(tipStyles);

// Make welcome screen globally available
window.WelcomeScreen = WelcomeScreen;
