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
        this.isInitialized = false;
        this.eventListenersSetup = false;
        
    }

    init() {
        // Prevent multiple initializations globally
        if (window.welcomeScreenInitialized) {
            console.log('🌟 Welcome screen already initialized globally, skipping duplicate initialization');
            return;
        }
        
        // Prevent multiple initializations per instance
        if (this.isInitialized) {
            console.log('🌟 Welcome screen already initialized, skipping duplicate initialization');
            return;
        }
        
        console.log('🌟 Welcome screen initialized');
        this.isInitialized = true;
        window.welcomeScreenInitialized = true;
        
        // Tutorial system disabled - proceed with normal welcome screen
        
        this.checkIfFirstVisit();
        this.setupEventListeners();
        this.showInitialLoading();
    }

    showInitialLoading() {
        // Show welcome screen immediately with integrated Klitoritarit branding
        console.log('🌟 showInitialLoading called');
        this.showWelcomeScreen();
        
        // Ensure event listeners are attached after showing the screen
        setTimeout(() => {
            console.log('🌟 Re-attaching event listeners after screen show');
            this.setupEventListeners();
        }, 100);
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
        // Prevent multiple event listener setup
        if (this.eventListenersSetup) {
            console.log('🌟 Event listeners already setup, skipping');
            return;
        }
        
        console.log('🌟 Setting up event listeners...');
        console.log('🌟 DOM ready state:', document.readyState);
        console.log('🌟 Welcome screen visible:', this.isVisible);
        this.eventListenersSetup = true;
        
        // GPS Enable button
        const enableGpsBtn = document.getElementById('enable-gps-btn');
        if (enableGpsBtn) {
            console.log('🌟 GPS enable button found, adding event listener');
            enableGpsBtn.addEventListener('click', () => {
                console.log('📍 GPS enable button clicked! - Requesting GPS permission directly');
                // Use direct GPS permission request (simpler approach)
                this.requestGPSPermission();
            });
        } else {
            console.log('🌟 GPS enable button not found - GPS functionality may not be available');
        }

        // Continue adventure button
        const continueBtn = document.getElementById('continue-adventure');
        if (continueBtn) {
            console.log('🌟 Continue adventure button found, adding event listener');
            console.log('🌟 Button element:', continueBtn);
            console.log('🌟 Button computed style:', window.getComputedStyle(continueBtn));
            continueBtn.addEventListener('click', (e) => {
                console.log('🔄 Continue adventure button clicked!', e);
                e.preventDefault();
                e.stopPropagation();
                this.continueAdventure();
            });
        } else {
            console.error('🌟 Continue adventure button not found!');
        }

        // Start fresh adventure button
        const startFreshBtn = document.getElementById('start-fresh');
        if (startFreshBtn) {
            console.log('🌟 Start fresh adventure button found, adding event listener');
            console.log('🌟 Button element:', startFreshBtn);
            console.log('🌟 Button computed style:', window.getComputedStyle(startFreshBtn));
            startFreshBtn.addEventListener('click', (e) => {
                console.log('🚀 Start fresh adventure button clicked!', e);
                e.preventDefault();
                e.stopPropagation();
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
        console.log('🌟 showWelcomeScreen called - stack trace:', new Error().stack);
        console.log('🌟 this.isVisible:', this.isVisible);
        console.log('🌟 window.loadingInProgress:', window.loadingInProgress);
        
        // Prevent multiple calls to showWelcomeScreen
        if (this.isVisible) {
            console.log('🌟 Welcome screen already visible, skipping duplicate call');
            return;
        }
        
        // Loading system now controls when to show welcome screen
        // No need to check loadingInProgress here
        
        // Check if tutorial is active - if so, don't show welcome screen
        const tutorialActive = localStorage.getItem('eldritch_start_tutorial_encounter') === 'true';
        if (tutorialActive) {
            console.log('🎓 Tutorial active - preventing welcome screen from showing');
            this.hideWelcomeScreen();
            return;
        }
        
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            console.log('🌟 Showing welcome screen');
            console.log('🌟 Welcome screen element:', welcomeScreen);
            console.log('🌟 Welcome screen computed style:', window.getComputedStyle(welcomeScreen));
            console.log('🌟 Welcome screen current display:', welcomeScreen.style.display);
            console.log('🌟 Welcome screen current visibility:', welcomeScreen.style.visibility);
            
            // Show welcome screen and ensure it's interactive
            welcomeScreen.style.display = 'flex';
            welcomeScreen.style.visibility = 'visible';
            welcomeScreen.style.pointerEvents = 'auto';
            this.isVisible = true;
            
            console.log('🌟 Welcome screen shown');
            console.log('🌟 Loading mask status:', welcomeScreen.classList.contains('loading-mask'));
            console.log('🌟 Computed display:', window.getComputedStyle(welcomeScreen).display);
            console.log('🌟 Computed visibility:', window.getComputedStyle(welcomeScreen).visibility);
            
            this.animateWelcomeScreen();
            this.updateContinueAdventureLabel();
            
            // Debug: Check if buttons are clickable
            setTimeout(() => {
                const continueBtn = document.getElementById('continue-adventure');
                const startBtn = document.getElementById('start-fresh');
                console.log('🌟 Debug - Continue button:', continueBtn, 'clickable:', continueBtn?.style.pointerEvents);
                console.log('🌟 Debug - Start button:', startBtn, 'clickable:', startBtn?.style.pointerEvents);
                
                // Test direct click
                if (continueBtn) {
                    console.log('🌟 Testing direct click on continue button');
                    continueBtn.click();
                }
            }, 200);
        } else {
            console.error('🌟 Welcome screen element not found!');
        }
    }

    hideWelcomeScreen() {
        console.log('🌟 hideWelcomeScreen called - stack trace:', new Error().stack);
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            welcomeScreen.style.display = 'none';
            this.isVisible = false;
            console.log('🌟 Welcome screen hidden');
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
        this.hasSeenWelcome = true;
        
        // Reset all game state
        this.resetAllGameState();
        
        // Hide welcome screen
        this.hideWelcomeScreen();
        
        // Use new Three.js UI system for player creation
        console.log('🚀 Fresh adventure mode - using Three.js UI for player creation');
        this.showThreeJSPlayerCreation();
    }

    showThreeJSPlayerCreation() {
        console.log('🎮 Showing Three.js player creation UI');
        
        // Emit event to Three.js UI system to show player creation panel
        if (window.eventBus) {
            window.eventBus.emit('ui:show-player-creation', {
                mode: 'fresh',
                callback: (playerData) => {
                    console.log('🎮 Player creation completed:', playerData);
                    this.handlePlayerCreationComplete(playerData);
                }
            });
        } else {
            console.warn('⚠️ EventBus not available, falling back to old UI');
            this.showPlayerIdentityDialog();
        }
    }

    handlePlayerCreationComplete(playerData) {
        console.log('🎮 Player creation completed, starting game with:', playerData);
        
        // Store player data
        if (playerData.name) {
            localStorage.setItem('eldritch_player_name', playerData.name);
        }
        if (playerData.pathColor) {
            localStorage.setItem('eldritch_path_color', playerData.pathColor);
        }
        if (playerData.areaSymbol) {
            localStorage.setItem('eldritch_area_symbol', playerData.areaSymbol);
        }
        if (playerData.baseSymbol) {
            localStorage.setItem('eldritch_base_symbol', playerData.baseSymbol);
        }
        
        // Start the game
        this.startGame();
    }

    startGame() {
        console.log('🎮 Starting the game...');
        
        // Show the game header
        const gameHeader = document.getElementById('game-header');
        if (gameHeader) {
            gameHeader.style.display = 'flex';
            console.log('🎮 Game header shown');
        }
        
        // Emit event to start the main game
        if (window.eventBus) {
            window.eventBus.emit('game:start', {
                mode: 'fresh',
                playerData: {
                    name: localStorage.getItem('eldritch_player_name') || 'Cosmic Explorer',
                    pathColor: localStorage.getItem('eldritch_path_color') || '#3b82f6',
                    areaSymbol: localStorage.getItem('eldritch_area_symbol') || 'circle',
                    baseSymbol: localStorage.getItem('eldritch_base_symbol') || 'flag_finland'
                }
            });
        }
    }

    showPlayerIdentityDialog() {
        console.log('🎭 Showing player identity setup dialog');
        
        // Hide welcome screen
        this.hideWelcomeScreen();
        
        // Show notification
        this.showWelcomeNotification('🌟 Hello Cosmic Explorer! What is your name?');
        
        // Show user settings modal
        const modal = document.getElementById('user-settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Populate the form with defaults
            this.populateIdentityForm();
            
            // Set up event listeners for the form
            this.setupIdentityFormListeners();
            
            // Auto-focus and select the name input
            setTimeout(() => {
                const nameInput = document.getElementById('player-name-input');
                if (nameInput) {
                    nameInput.focus();
                    nameInput.select();
                }
            }, 100);
        } else {
            console.warn('🎭 User settings modal not found, proceeding without identity setup');
            this.proceedWithGameStart();
        }
    }

    populateIdentityForm() {
        const nameInput = document.getElementById('player-name-input');
        const colorInput = document.getElementById('path-color-input');
        
        // Set default name
        if (nameInput) {
            nameInput.value = 'Cosmic Wanderer';
        }
        
        // Set default RGB values (0, 255, 136 = #00ff88)
        this.setRGBValues(0, 255, 136);
        
        // Load saved symbols or set defaults
        const savedBaseLogo = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
        const savedAreaSymbol = localStorage.getItem('eldritch_player_area_symbol') || 'finnish';
        const savedPathSymbol = localStorage.getItem('eldritch_player_path_symbol') || 'finnish';
        
        // Initialize base logo options
        const baseLogoGrid = document.getElementById('base-logo-options');
        if (baseLogoGrid) {
            this.populateBaseLogoOptions(baseLogoGrid);
            this.selectSymbolOption(baseLogoGrid, savedBaseLogo, 'finnish');
        }
        
        // Initialize area symbol options
        const areaSymbolGrid = document.getElementById('area-symbol-options');
        if (areaSymbolGrid) {
            this.populateAreaSymbolOptions(areaSymbolGrid);
            this.selectSymbolOption(areaSymbolGrid, savedAreaSymbol, 'finnish');
        }
        
        // Initialize path symbol options
        const pathSymbolGrid = document.getElementById('path-symbol-options');
        if (pathSymbolGrid) {
            this.populatePathSymbolOptions(pathSymbolGrid);
            this.selectSymbolOption(pathSymbolGrid, savedPathSymbol, 'sun');
        }
    }

    setRGBValues(r, g, b) {
        const colorR = document.getElementById('color-r');
        const colorG = document.getElementById('color-g');
        const colorB = document.getElementById('color-b');
        const colorRValue = document.getElementById('color-r-value');
        const colorGValue = document.getElementById('color-g-value');
        const colorBValue = document.getElementById('color-b-value');
        const colorPreview = document.getElementById('color-preview');
        const colorPicker = document.getElementById('path-color-input');
        
        if (colorR) colorR.value = r;
        if (colorG) colorG.value = g;
        if (colorB) colorB.value = b;
        if (colorRValue) colorRValue.textContent = r;
        if (colorGValue) colorGValue.textContent = g;
        if (colorBValue) colorBValue.textContent = b;
        
        const hexColor = this.rgbToHex(r, g, b);
        if (colorPreview) colorPreview.style.background = hexColor;
        if (colorPicker) colorPicker.value = hexColor;
    }
    
    selectSymbolOption(grid, savedSymbol, defaultSymbol) {
        const symbolOption = grid.querySelector(`[data-symbol="${savedSymbol}"]`);
        if (symbolOption) {
            symbolOption.classList.add('selected');
        } else {
            // Default to fallback if saved symbol not found
            const defaultOption = grid.querySelector(`[data-symbol="${defaultSymbol}"]`);
            if (defaultOption) {
                defaultOption.classList.add('selected');
            }
        }
    }

    populateBaseLogoOptions(grid) {
        const symbols = [
            { id: 'finnish', label: 'Finnish Flag', svg: this.svgFinnishFlag(36) },
            { id: 'swedish', label: 'Swedish Flag', svg: this.svgSwedishFlag(36) },
            { id: 'norwegian', label: 'Norwegian Flag', svg: this.svgNorwegianFlag(36) },
            { id: 'flower_of_life', label: 'Flower of Life', svg: this.svgFlowerOfLife(36) },
            { id: 'sacred_triangle', label: 'Sacred Triangle', svg: this.svgTriangle(36) },
            { id: 'hexagon', label: 'Hexagon', svg: this.svgHexagon(36) },
            { id: 'cosmic_spiral', label: 'Cosmic Spiral', svg: this.svgSpiral(36) },
            { id: 'star', label: 'Star', svg: this.svgStar(36) }
        ];
        
        grid.innerHTML = symbols.map(opt => `
            <div class="symbol-option" data-symbol="${opt.id}" title="${opt.label}">
                ${opt.svg}
                <span>${opt.label}</span>
            </div>
        `).join('');
    }

    populateAreaSymbolOptions(grid) {
        const symbols = [
            { id: 'finnish', label: 'Finnish Flag', svg: this.svgFinnishFlag(24) },
            { id: 'swedish', label: 'Swedish Flag', svg: this.svgSwedishFlag(24) },
            { id: 'norwegian', label: 'Norwegian Flag', svg: this.svgNorwegianFlag(24) },
            { id: 'flower_of_life', label: 'Flower of Life', svg: this.svgFlowerOfLife(24) },
            { id: 'sacred_triangle', label: 'Sacred Triangle', svg: this.svgTriangle(24) },
            { id: 'hexagon', label: 'Hexagon', svg: this.svgHexagon(24) },
            { id: 'cosmic_spiral', label: 'Cosmic Spiral', svg: this.svgSpiral(24) },
            { id: 'star', label: 'Star', svg: this.svgStar(24) }
        ];
        
        grid.innerHTML = symbols.map(opt => `
            <div class="symbol-option" data-symbol="${opt.id}" title="${opt.label}">
                ${opt.svg}
                <span>${opt.label}</span>
            </div>
        `).join('');
    }

    populatePathSymbolOptions(grid) {
        const symbols = [
            { id: 'sun', label: 'Sun', svg: this.svgSun(24) },
            { id: 'star', label: 'Star', svg: this.svgStar(24) },
            { id: 'sparkle', label: 'Sparkle', svg: this.svgSparkle(24) },
            { id: 'crescent', label: 'Crescent', svg: this.svgMoon(24) },
            { id: 'diamond', label: 'Diamond', svg: this.svgDiamond(24) },
            { id: 'aurora', label: 'Aurora', svg: this.svgAurora(24) },
            { id: 'lightning', label: 'Lightning', svg: this.svgLightning(24) },
            { id: 'flame', label: 'Flame', svg: this.svgFlame(24) },
            { id: 'snowflake', label: 'Snowflake', svg: this.svgSnowflake(24) },
            { id: 'wave', label: 'Wave', svg: this.svgWave(24) }
        ];
        
        grid.innerHTML = symbols.map(opt => `
            <div class="symbol-option" data-symbol="${opt.id}" title="${opt.label}">
                ${opt.svg}
                <span>${opt.label}</span>
            </div>
        `).join('');
    }
    
    // SVG generation methods (copied from tutorial system)
    svgFinnishFlag(size) {
        return `<svg width="${size}" height="${size*0.66}" viewBox="0 0 60 40">
            <rect width="60" height="40" fill="#FFFFFF"/>
            <rect x="0" y="16" width="60" height="8" fill="#003580"/>
            <rect x="20" y="0" width="8" height="40" fill="#003580"/>
        </svg>`;
    }
    
    svgSwedishFlag(size) {
        return `<svg width="${size}" height="${size*0.66}" viewBox="0 0 60 40">
            <rect width="60" height="40" fill="#006AA7"/>
            <rect x="0" y="16" width="60" height="8" fill="#FECC00"/>
            <rect x="20" y="0" width="8" height="40" fill="#FECC00"/>
        </svg>`;
    }
    
    svgNorwegianFlag(size) {
        return `<svg width="${size}" height="${size*0.66}" viewBox="0 0 60 40">
            <rect width="60" height="40" fill="#EF2B2D"/>
            <rect x="0" y="16" width="60" height="8" fill="#FFFFFF"/>
            <rect x="20" y="0" width="8" height="40" fill="#FFFFFF"/>
            <rect x="0" y="18" width="60" height="4" fill="#002868"/>
            <rect x="22" y="0" width="4" height="40" fill="#002868"/>
        </svg>`;
    }
    
    svgFlowerOfLife(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="10" fill="none" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="20" cy="20" r="10" fill="none" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="40" cy="20" r="10" fill="none" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="20" cy="40" r="10" fill="none" stroke="#8b5cf6" stroke-width="2"/>
            <circle cx="40" cy="40" r="10" fill="none" stroke="#8b5cf6" stroke-width="2"/>
        </svg>`;
    }
    
    svgTriangle(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="30,10 50,45 10,45" fill="none" stroke="#00ff88" stroke-width="3"/>
            <polygon points="30,20 45,40 15,40" fill="#00ff88" opacity="0.3"/>
        </svg>`;
    }
    
    svgHexagon(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="30,5 50,20 50,40 30,55 10,40 10,20" fill="none" stroke="#ff8800" stroke-width="2"/>
            <polygon points="30,15 45,25 45,35 30,45 15,35 15,25" fill="#ff8800" opacity="0.3"/>
        </svg>`;
    }
    
    svgSpiral(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M30,30 Q20,20 30,10 Q40,20 30,30 Q20,40 30,50 Q40,40 30,30" 
                  fill="none" stroke="#ff69b4" stroke-width="2"/>
        </svg>`;
    }
    
    svgStar(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="30,5 35,20 50,20 40,30 45,45 30,35 15,45 20,30 10,20 25,20" 
                      fill="#ffff00" stroke="#ff8800" stroke-width="1"/>
        </svg>`;
    }
    
    svgCircle(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="none" stroke="#0080ff" stroke-width="3"/>
            <circle cx="30" cy="30" r="15" fill="#0080ff" opacity="0.3"/>
        </svg>`;
    }
    
    svgDiamond(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="30,5 55,30 30,55 5,30" fill="none" stroke="#ff0040" stroke-width="2"/>
            <polygon points="30,15 45,30 30,45 15,30" fill="#ff0040" opacity="0.3"/>
        </svg>`;
    }
    
    svgPentagram(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="30,5 35,25 55,25 40,35 45,55 30,45 15,55 20,35 5,25 25,25" 
                      fill="none" stroke="#6a0dad" stroke-width="2"/>
        </svg>`;
    }
    
    svgInfinity(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M15,30 Q15,15 30,15 Q45,15 45,30 Q45,45 30,45 Q15,45 15,30 Q15,15 30,15" 
                  fill="none" stroke="#00ff88" stroke-width="3"/>
        </svg>`;
    }
    
    svgYinYang(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="25" fill="#000000"/>
            <path d="M30,5 A25,25 0 0,1 30,55 A12.5,12.5 0 0,0 30,30 A12.5,12.5 0 0,1 30,5" fill="#ffffff"/>
            <circle cx="30" cy="20" r="5" fill="#000000"/>
            <circle cx="30" cy="40" r="5" fill="#ffffff"/>
        </svg>`;
    }
    
    svgCross(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <rect x="25" y="10" width="10" height="40" fill="#8b5cf6"/>
            <rect x="10" y="25" width="40" height="10" fill="#8b5cf6"/>
            <circle cx="30" cy="30" r="8" fill="none" stroke="#8b5cf6" stroke-width="2"/>
        </svg>`;
    }
    
    svgMoon(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M30,10 A20,20 0 0,1 30,50 A15,15 0 0,0 30,20 A15,15 0 0,1 30,10" 
                  fill="#c0c0c0" stroke="#808080" stroke-width="1"/>
        </svg>`;
    }
    
    svgSun(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="15" fill="#ffff00" stroke="#ff8800" stroke-width="2"/>
            <line x1="30" y1="5" x2="30" y2="15" stroke="#ff8800" stroke-width="3"/>
            <line x1="55" y1="30" x2="45" y2="30" stroke="#ff8800" stroke-width="3"/>
            <line x1="30" y1="55" x2="30" y2="45" stroke="#ff8800" stroke-width="3"/>
            <line x1="5" y1="30" x2="15" y2="30" stroke="#ff8800" stroke-width="3"/>
            <line x1="45" y1="15" x2="40" y2="20" stroke="#ff8800" stroke-width="2"/>
            <line x1="45" y1="45" x2="40" y2="40" stroke="#ff8800" stroke-width="2"/>
            <line x1="15" y1="45" x2="20" y2="40" stroke="#ff8800" stroke-width="2"/>
            <line x1="15" y1="15" x2="20" y2="20" stroke="#ff8800" stroke-width="2"/>
        </svg>`;
    }

    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
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
        
        // RGB color slider listeners
        const colorR = document.getElementById('color-r');
        const colorG = document.getElementById('color-g');
        const colorB = document.getElementById('color-b');
        const colorPicker = document.getElementById('path-color-input');
        
        [colorR, colorG, colorB].forEach(slider => {
            if (slider) {
                slider.addEventListener('input', () => this.updateColorFromSliders());
            }
        });
        
        if (colorPicker) {
            colorPicker.addEventListener('change', () => this.updateColorFromPicker());
        }
        
        // Base logo symbol selection
        const baseLogoGrid = document.getElementById('base-logo-options');
        if (baseLogoGrid) {
            baseLogoGrid.addEventListener('click', (e) => {
                const option = e.target.closest('.symbol-option');
                if (option) {
                    // Remove previous selection
                    baseLogoGrid.querySelectorAll('.symbol-option').forEach(opt => opt.classList.remove('selected'));
                    // Add selection to clicked option
                    option.classList.add('selected');
                    
                    // Store selection in localStorage
                    const logoType = option.dataset.logoType;
                    localStorage.setItem('eldritch_player_base_logo', logoType);
                    console.log('🏗️ Base logo selected:', logoType);
                    
                    // Update base marker if it exists
                    if (window.mapEngine && window.mapEngine.updateBaseMarker) {
                        window.mapEngine.updateBaseMarker();
                    }
                    
                    // Refresh base building layer rendering
                    if (window.layeredRenderingSystem && window.layeredRenderingSystem.layers) {
                        const baseBuildingLayer = window.layeredRenderingSystem.layers.find(layer => layer.name === 'baseBuilding');
                        if (baseBuildingLayer && baseBuildingLayer.refreshBaseRendering) {
                            baseBuildingLayer.refreshBaseRendering();
                        }
                    }
                }
            });
        }
        
        // Area symbol selection
        const areaSymbolGrid = document.getElementById('area-symbol-options');
        if (areaSymbolGrid) {
            areaSymbolGrid.addEventListener('click', (e) => {
                const option = e.target.closest('.symbol-option');
                if (option) {
                    // Remove previous selection
                    areaSymbolGrid.querySelectorAll('.symbol-option').forEach(opt => opt.classList.remove('selected'));
                    // Add selection to clicked option
                    option.classList.add('selected');
                }
            });
        }
        
        // Path symbol selection
        const pathSymbolGrid = document.getElementById('path-symbol-options');
        if (pathSymbolGrid) {
            pathSymbolGrid.addEventListener('click', (e) => {
                const option = e.target.closest('.symbol-option');
                if (option) {
                    // Remove previous selection
                    pathSymbolGrid.querySelectorAll('.symbol-option').forEach(opt => opt.classList.remove('selected'));
                    // Add selection to clicked option
                    option.classList.add('selected');
                }
            });
        }
    }

    updateColorFromSliders() {
        const colorR = document.getElementById('color-r');
        const colorG = document.getElementById('color-g');
        const colorB = document.getElementById('color-b');
        
        if (colorR && colorG && colorB) {
            const r = parseInt(colorR.value);
            const g = parseInt(colorG.value);
            const b = parseInt(colorB.value);
            
            this.setRGBValues(r, g, b);
        }
    }

    updateColorFromPicker() {
        const colorPicker = document.getElementById('path-color-input');
        if (colorPicker) {
            const rgb = this.hexToRgb(colorPicker.value);
            if (rgb) {
                this.setRGBValues(rgb.r, rgb.g, rgb.b);
            }
        }
    }

    saveIdentityAndStart() {
        console.log('🎭 Saving player identity and starting game');
        
        const nameInput = document.getElementById('player-name-input');
        const colorInput = document.getElementById('path-color-input');
        const baseLogoGrid = document.getElementById('base-logo-options');
        const areaSymbolGrid = document.getElementById('area-symbol-options');
        const pathSymbolGrid = document.getElementById('path-symbol-options');
        
        const name = (nameInput?.value || '').trim() || 'Cosmic Wanderer';
        const color = colorInput?.value || '#00ff88';
        const selectedBaseLogo = baseLogoGrid?.querySelector('.symbol-option.selected');
        const baseLogo = selectedBaseLogo?.dataset.symbol || 'finnish';
        const selectedAreaSymbol = areaSymbolGrid?.querySelector('.symbol-option.selected');
        const areaSymbol = selectedAreaSymbol?.dataset.symbol || 'finnish';
        const selectedPathSymbol = pathSymbolGrid?.querySelector('.symbol-option.selected');
        const pathSymbol = selectedPathSymbol?.dataset.symbol || 'sun';
        
        console.log('🎭 Selected symbols:', { baseLogo, areaSymbol, pathSymbol });
        
        // Save to localStorage
        localStorage.setItem('eldritch_player_name', name);
        localStorage.setItem('eldritch_player_color', color);
        localStorage.setItem('eldritch_player_base_logo', baseLogo);
        localStorage.setItem('eldritch_player_area_symbol', areaSymbol);
        localStorage.setItem('eldritch_player_symbol', pathSymbol); // Keep for backward compatibility
        localStorage.setItem('eldritch_player_path_symbol', pathSymbol);
        
        // Update multiplayer profile if available
        if (window.multiplayerManager) {
            window.multiplayerManager.updateLocalProfile({ name, symbol: pathSymbol, pathColor: color, pathSymbol: pathSymbol });
        }
        
        // Hide modal
        const modal = document.getElementById('user-settings-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        
        // Show story notification
        this.showStoryNotification(name);
        
        // Start game after story
        setTimeout(() => {
            this.proceedWithGameStart();
        }, 3000);
    }

    showStoryNotification(playerName) {
        const storyMessage = `🌙 ${playerName}, you wake up in an unknown place... You don't remember how you got here, but you feel wounded and weak. Your vision is blurry, and you sense danger nearby.`;
        
        const notification = document.createElement('div');
        notification.id = 'story-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 0, 40, 0.9) 100%);
            border: 2px solid #8b00ff;
            border-radius: 15px;
            padding: 25px 35px;
            color: #ffffff;
            font-size: 16px;
            font-weight: normal;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 0 40px rgba(139, 0, 255, 0.4);
            animation: storyNotificationFadeIn 0.8s ease-out;
            max-width: 500px;
            word-wrap: break-word;
            line-height: 1.6;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 15px; font-size: 20px; color: #8b00ff; font-weight: bold;">
                🌙 The Awakening
            </div>
            <div style="margin-bottom: 15px;">
                ${storyMessage}
            </div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 15px;">
                Look around... you might find something to help you survive.
            </div>
        `;
        
        // Add CSS animation
        if (!document.getElementById('story-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'story-notification-styles';
            style.textContent = `
                @keyframes storyNotificationFadeIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                        scale: 0.9;
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                        scale: 1;
                    }
                }
                @keyframes storyNotificationFadeOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                        scale: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                        scale: 0.9;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'storyNotificationFadeOut 0.5s ease-in';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 500);
            }
        }, 5000);
        
        console.log('🌙 Story notification:', storyMessage);
    }

    showWelcomeNotification(message) {
        // Create a beautiful notification overlay
        const notification = document.createElement('div');
        notification.id = 'welcome-notification';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.8) 100%);
            border: 2px solid #00ff88;
            border-radius: 15px;
            padding: 20px 30px;
            color: #ffffff;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            z-index: 10000;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
            animation: welcomeNotificationSlideIn 0.5s ease-out;
            max-width: 400px;
            word-wrap: break-word;
        `;
        
        notification.innerHTML = `
            <div style="margin-bottom: 10px; font-size: 24px;">${message}</div>
            <div style="font-size: 14px; color: rgba(255, 255, 255, 0.7); margin-top: 10px;">
                Choose your cosmic identity below
            </div>
        `;
        
        // Add CSS animation
        if (!document.getElementById('welcome-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'welcome-notification-styles';
            style.textContent = `
                @keyframes welcomeNotificationSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -60%);
                        scale: 0.8;
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                        scale: 1;
                    }
                }
                @keyframes welcomeNotificationSlideOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, -50%);
                        scale: 1;
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -40%);
                        scale: 0.8;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.animation = 'welcomeNotificationSlideOut 0.3s ease-in';
                setTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
        
        // Also log to console for debugging
        console.log('🌟 Welcome notification:', message);
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
        
        // Hide welcome screen first
        this.hideWelcomeScreen();
        
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
            if (status === 'success') {
                gpsBtn.textContent = '✅ GPS Ready';
                gpsBtn.disabled = true;
            } else if (status === 'warning') {
                gpsBtn.textContent = '⚠️ GPS Fallback Ready';
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

        console.log('🎮 Game buttons enabled');
    }

    // Additional SVG methods for new symbols
    svgSparkle(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <circle cx="30" cy="30" r="8" fill="#ff8c00"/>
            <path d="M30,5 L30,15 M30,45 L30,55 M5,30 L15,30 M45,30 L55,30 M10,10 L18,18 M42,42 L50,50 M10,50 L18,42 M42,18 L50,10" 
                  stroke="#ffd700" stroke-width="2"/>
        </svg>`;
    }

    svgAurora(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M5,20 Q15,10 25,20 Q35,30 45,20 Q50,25 55,20" 
                  stroke="#8b5cf6" stroke-width="3" fill="none"/>
            <path d="M5,30 Q15,25 25,35 Q35,40 45,30 Q50,35 55,30" 
                  stroke="#8b5cf6" stroke-width="3" fill="none"/>
            <path d="M5,40 Q15,35 25,45 Q35,50 45,40 Q50,45 55,40" 
                  stroke="#8b5cf6" stroke-width="3" fill="none"/>
        </svg>`;
    }

    svgLightning(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <polygon points="25,10 35,25 30,25 40,50 30,35 35,35" 
                      fill="#ffd700" stroke="#ff8800" stroke-width="1"/>
        </svg>`;
    }

    svgFlame(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M30,50 Q20,40 25,30 Q20,25 30,20 Q40,25 35,30 Q40,40 30,50" 
                  fill="#ff6b35" stroke="#ff4500" stroke-width="1"/>
        </svg>`;
    }

    svgSnowflake(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M30,10 L30,50 M10,30 L50,30 M20,20 L40,40 M20,40 L40,20" 
                  stroke="#87ceeb" stroke-width="2"/>
        </svg>`;
    }

    svgWave(size) {
        return `<svg width="${size}" height="${size}" viewBox="0 0 60 60">
            <path d="M5,30 Q15,20 25,30 Q35,40 45,30 Q50,35 55,30" 
                  stroke="#87ceeb" stroke-width="3" fill="none"/>
        </svg>`;
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

// Global function to clear all dialogs and fix stuck state
window.clearAllDialogs = function() {
    console.log('🧹 Clearing all dialogs...');
    
    // Clear tutorial modals
    const tutorialModal = document.getElementById('tutorial-welcome-modal');
    if (tutorialModal) {
        tutorialModal.remove();
        console.log('🎓 Tutorial welcome modal removed');
    }
    
    // Hide player identity modal
    const identityModal = document.getElementById('user-settings-modal');
    if (identityModal) {
        identityModal.classList.add('hidden');
        console.log('🎭 Player identity modal hidden');
    }
    
    // Hide welcome screen
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) {
        welcomeScreen.style.display = 'none';
        console.log('🌟 Welcome screen hidden');
    }
    
    // Clear tutorial flags
    localStorage.removeItem('eldritch_start_tutorial_encounter');
    localStorage.removeItem('eldritch_tutorial_state');
    localStorage.removeItem('eldritch_welcome_seen');
    console.log('🧹 All dialogs cleared and flags reset');
};

// Make welcome screen globally available
window.WelcomeScreen = WelcomeScreen;
