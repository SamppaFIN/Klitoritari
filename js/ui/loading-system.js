/**
 * Loading System
 * Manages component initialization and loading states
 */

class LoadingSystem {
    constructor() {
        this.loadingStates = new Map();
        this.totalComponents = 0;
        this.loadedComponents = 0;
        this.isFullyLoaded = false;
        this.loadingStartTime = Date.now();
        
        // Loading UI elements
        this.loadingContainer = null;
        this.progressBar = null;
        this.statusText = null;
        this.spinner = null;
        
        // Component loading order
        this.loadingOrder = [
            'threejs',
            'gsap',
            'aurora',
            'layers',
            'ui-systems',
            'particles',
            'finalization'
        ];
        
        console.log('🔄 Loading System: Initialized');
    }
    
    init() {
        console.log('🔄 Loading System: Starting initialization...');
        window.loadingInProgress = true; // Set loading flag
        window.loadingSystemActive = true; // Prevent direct app initialization
        window.loadingSystemInitialized = true; // Mark as initialized
        this.createLoadingUI();
        this.startLoadingSequence();
    }
    
    createLoadingUI() {
        // Create loading container
        this.loadingContainer = document.createElement('div');
        this.loadingContainer.id = 'loading-container';
        this.loadingContainer.innerHTML = `
            <div class="loading-overlay">
                <div class="loading-content">
                    <div class="loading-logo">
                        <h1>🌌 Eldritch Sanctuary</h1>
                        <p>Initializing Cosmic Systems...</p>
                    </div>
                    
                    <div class="loading-spinner">
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                        <div class="spinner-ring"></div>
                    </div>
                    
                    <div class="loading-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" id="progress-fill"></div>
                        </div>
                        <div class="progress-text" id="progress-text">0%</div>
                    </div>
                    
                    <div class="loading-status" id="loading-status">
                        Loading core systems...
                    </div>
                    
                    <div class="loading-details" id="loading-details">
                        <div class="loading-item" id="threejs-status">⏳ Three.js</div>
                        <div class="loading-item" id="gsap-status">⏳ GSAP</div>
                        <div class="loading-item" id="aurora-status">⏳ Aurora UI</div>
                        <div class="loading-item" id="layers-status">⏳ Layer System</div>
                        <div class="loading-item" id="ui-status">⏳ UI Systems</div>
                        <div class="loading-item" id="particles-status">⏳ Particle Effects</div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        document.body.appendChild(this.loadingContainer);
        
        // Get references
        this.progressBar = document.getElementById('progress-fill');
        this.statusText = document.getElementById('loading-status');
        this.spinner = document.querySelector('.loading-spinner');
        
        console.log('🔄 Loading UI created');
    }
    
    startLoadingSequence() {
        console.log('🔄 Starting loading sequence...');
        
        // Load components in sequence
        this.loadComponent('threejs', () => this.loadThreeJS())
            .then(() => this.loadComponent('gsap', () => this.loadGSAP()))
            .then(() => this.loadComponent('aurora', () => this.loadAurora()))
            .then(() => this.loadComponent('layers', () => this.loadLayers()))
            .then(() => this.loadComponent('ui-systems', () => this.loadUISystems()))
            .then(() => this.loadComponent('particles', () => this.loadParticles()))
            .then(() => this.loadComponent('finalization', () => this.finalizeLoading()))
            .then(() => this.showWelcomeScreen())
            .catch(error => this.handleLoadingError(error));
    }
    
    loadComponent(name, loader) {
        return new Promise((resolve, reject) => {
            console.log(`🔄 Loading ${name}...`);
            this.updateStatus(`Loading ${name}...`);
            this.updateComponentStatus(name, 'loading');
            
            try {
                const result = loader();
                if (result && result.then) {
                    result.then(() => {
                        this.updateComponentStatus(name, 'loaded');
                        this.updateProgress();
                        resolve();
                    }).catch(reject);
                } else {
                    this.updateComponentStatus(name, 'loaded');
                    this.updateProgress();
                    resolve();
                }
            } catch (error) {
                this.updateComponentStatus(name, 'error');
                reject(error);
            }
        });
    }
    
    loadThreeJS() {
        return new Promise((resolve) => {
            if (typeof THREE !== 'undefined') {
                console.log('✅ Three.js already loaded');
                resolve();
                return;
            }
            
            // Wait for Three.js to load
            const checkThreeJS = () => {
                if (typeof THREE !== 'undefined') {
                    console.log('✅ Three.js loaded successfully');
                    resolve();
                } else {
                    setTimeout(checkThreeJS, 100);
                }
            };
            checkThreeJS();
        });
    }
    
    loadGSAP() {
        return new Promise((resolve) => {
            if (typeof GSAP !== 'undefined') {
                console.log('✅ GSAP already loaded');
                resolve();
                return;
            }
            
            // Try to load GSAP from CDN
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js';
            script.onload = () => {
                console.log('✅ GSAP loaded successfully');
                resolve();
            };
            script.onerror = () => {
                console.warn('⚠️ GSAP failed to load, using fallbacks');
                resolve(); // Continue without GSAP
            };
            document.head.appendChild(script);
        });
    }
    
    loadAurora() {
        return new Promise((resolve) => {
            if (window.AuroraUILibrary) {
                console.log('✅ Aurora UI already loaded');
                resolve();
                return;
            }
            
            // Wait for Aurora to load
            const checkAurora = () => {
                if (window.AuroraUILibrary) {
                    console.log('✅ Aurora UI loaded successfully');
                    resolve();
                } else {
                    setTimeout(checkAurora, 100);
                }
            };
            checkAurora();
        });
    }
    
    loadLayers() {
        return new Promise((resolve) => {
            // Wait for all layer classes to be available
            const requiredLayers = [
                'BackgroundLayer', 'TerrainLayer', 'TerritoryLayer', 'PathLayer',
                'MapLayer', 'InteractionLayer', 'PlayerLayer', 'InformationLayer',
                'UILayer', 'DebugLayer', 'GeolocationLayer', 'ThreeJSUILayer'
            ];
            
            const checkLayers = () => {
                const loadedLayers = requiredLayers.filter(layer => window[layer]);
                if (loadedLayers.length === requiredLayers.length) {
                    console.log('✅ All layers loaded successfully');
                    resolve();
                } else {
                    console.log(`🔄 Loading layers... ${loadedLayers.length}/${requiredLayers.length}`);
                    setTimeout(checkLayers, 100);
                }
            };
            checkLayers();
        });
    }
    
    loadUISystems() {
        return new Promise((resolve) => {
            // Wait for UI systems to be available
            const requiredSystems = [
                'ThreeJSSceneManager', 'MagneticButtonSystem', 
                'ThreeJSUIPanels', 'ParticleEffectsSystem'
            ];
            
            const checkSystems = () => {
                const loadedSystems = requiredSystems.filter(system => window[system]);
                if (loadedSystems.length === requiredSystems.length) {
                    console.log('✅ All UI systems loaded successfully');
                    resolve();
                } else {
                    console.log(`🔄 Loading UI systems... ${loadedSystems.length}/${requiredSystems.length}`);
                    setTimeout(checkSystems, 100);
                }
            };
            checkSystems();
        });
    }
    
    loadParticles() {
        return new Promise((resolve) => {
            // Initialize particle systems
            console.log('✅ Particle systems initialized');
            resolve();
        });
    }
    
    finalizeLoading() {
        return new Promise((resolve) => {
            // Final initialization steps
            console.log('✅ Finalizing loading...');
            
            // Add a small delay for smooth transition
            setTimeout(() => {
                this.isFullyLoaded = true;
                console.log('✅ All systems loaded successfully!');
                resolve();
            }, 500);
        });
    }
    
    updateStatus(text) {
        if (this.statusText) {
            this.statusText.textContent = text;
        }
    }
    
    updateComponentStatus(component, status) {
        const element = document.getElementById(`${component}-status`);
        if (element) {
            const icons = {
                'loading': '⏳',
                'loaded': '✅',
                'error': '❌'
            };
            element.innerHTML = `${icons[status]} ${component}`;
            element.className = `loading-item ${status}`;
        }
    }
    
    updateProgress() {
        this.loadedComponents++;
        const progress = (this.loadedComponents / this.loadingOrder.length) * 100;
        
        if (this.progressBar) {
            this.progressBar.style.width = `${progress}%`;
        }
        
        const progressText = document.getElementById('progress-text');
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        console.log(`🔄 Progress: ${Math.round(progress)}%`);
    }
    
    showWelcomeScreen() {
        console.log('🎉 Loading complete! Showing welcome screen...');
        window.loadingInProgress = false; // Clear loading flag
        
        // Animate out loading screen
        this.animateOutLoading(() => {
            // Remove loading container
            if (this.loadingContainer) {
                this.loadingContainer.remove();
            }
            
            // Initialize and show the welcome screen
            this.initializeWelcomeScreen();
        });
    }
    
    initializeWelcomeScreen() {
        console.log('🌟 Initializing welcome screen...');
        console.log('🌟 WelcomeScreen class available:', !!window.WelcomeScreen);
        console.log('🌟 Welcome screen element exists:', !!document.getElementById('welcome-screen'));
        
        // Check if welcome screen is already initialized
        if (window.welcomeScreenInitialized) {
            console.log('🌟 Welcome screen already initialized, skipping duplicate initialization');
            this.initializeMainApp();
            return;
        }
        
        // Check if WelcomeScreen class is available
        if (window.WelcomeScreen) {
            try {
                console.log('🌟 Creating WelcomeScreen instance...');
                const welcomeScreen = new WelcomeScreen();
                console.log('🌟 WelcomeScreen instance created:', welcomeScreen);
                
                console.log('🌟 Calling welcomeScreen.init()...');
                welcomeScreen.init();
                
                // Small delay to ensure welcome screen is ready
                setTimeout(() => {
                    console.log('🌟 Calling welcomeScreen.showWelcomeScreen()...');
                    // Show the welcome screen after initialization
                    welcomeScreen.showWelcomeScreen();
                    
                    // Remove loading mask to reveal welcome screen content
                    console.log('🌟 Removing loading mask...');
                    welcomeScreen.removeLoadingMask();
                    
                    // Initialize the main app after welcome screen is ready
                    console.log('🚀 Initializing main app after welcome screen...');
                    this.initializeMainApp();
                    
                    console.log('🌟 Welcome screen initialized and shown successfully');
                }, 100);
            } catch (error) {
                console.error('🌟 Failed to initialize welcome screen:', error);
                // Fallback: initialize main app directly
                this.initializeMainApp();
            }
        } else {
            console.error('🌟 WelcomeScreen class not available, initializing main app directly');
            this.initializeMainApp();
        }
    }
    
    animateOutLoading(callback) {
        if (this.loadingContainer) {
            this.loadingContainer.style.opacity = '0';
            this.loadingContainer.style.transform = 'scale(0.9)';
            this.loadingContainer.style.transition = 'all 0.5s ease-out';
            
            setTimeout(callback, 500);
        } else {
            callback();
        }
    }
    
    initializeMainApp() {
        // Clear loading system active flag to allow app initialization
        window.loadingSystemActive = false;
        
        // Initialize the main Eldritch Sanctuary app
        if (window.EldritchSanctuaryApp) {
            console.log('🚀 Initializing Eldritch Sanctuary App...');
            const app = new EldritchSanctuaryApp();
            app.init();
        } else {
            console.error('❌ EldritchSanctuaryApp not found!');
        }
    }
    
    handleLoadingError(error) {
        console.error('❌ Loading error:', error);
        this.updateStatus('Loading failed. Please refresh the page.');
        this.updateComponentStatus('error', 'error');
    }
    
    dispose() {
        if (this.loadingContainer) {
            this.loadingContainer.remove();
        }
        console.log('🧹 Loading System disposed');
    }
}

// Export for use
window.LoadingSystem = LoadingSystem;
