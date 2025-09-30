/**
 * Initialization Manager
 * Created by: 💻 Codex + 🧪 Testa + 🌸 Aurora
 * Purpose: Prevent duplicate game initialization and manage init screen
 */

class InitializationManager {
    constructor() {
        this.isInitialized = false;
        this.isInitializing = false;
        this.initializationPromise = null;
        this.initScreen = null;
        this.initScreenVisible = true;
        
        this.init();
    }
    
    init() {
        console.log('🚀 Initialization Manager initialized');
        this.setupInitScreen();
        this.setupInitializationLock();
        this.setupGameStateMonitoring();
    }
    
    setupInitScreen() {
        // Create a clean init screen
        this.initScreen = document.createElement('div');
        this.initScreen.id = 'initialization-screen';
        this.initScreen.className = 'initialization-screen';
        this.initScreen.innerHTML = `
            <div class="init-content">
                <div class="init-header">
                    <div class="init-logo">🌸</div>
                    <h1>Eldritch Sanctuary</h1>
                    <p>Cosmic Map Exploration Platform</p>
                </div>
                <div class="init-body">
                    <div class="init-status">
                        <div class="status-indicator" id="init-status-indicator">⏳</div>
                        <div class="status-text" id="init-status-text">Initializing...</div>
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div class="progress-fill" id="init-progress-fill"></div>
                            </div>
                            <div class="progress-text" id="init-progress-text">0%</div>
                        </div>
                    </div>
                    <div class="init-actions">
                        <button id="force-init-btn" class="force-init-btn" style="display: none;">Force Initialize</button>
                        <button id="skip-init-btn" class="skip-init-btn" style="display: none;">Skip Initialization</button>
                    </div>
                </div>
                <div class="init-footer">
                    <p>Consciousness-aware development for community healing</p>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .initialization-screen {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #0f0f23, #1a1a2e, #16213e);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            }
            
            .init-content {
                text-align: center;
                max-width: 500px;
                width: 90%;
                padding: 40px;
            }
            
            .init-header {
                margin-bottom: 40px;
            }
            
            .init-logo {
                font-size: 64px;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .init-header h1 {
                font-size: 32px;
                margin: 0 0 10px 0;
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .init-header p {
                font-size: 16px;
                margin: 0;
                opacity: 0.8;
            }
            
            .init-body {
                margin-bottom: 40px;
            }
            
            .init-status {
                margin-bottom: 30px;
            }
            
            .status-indicator {
                font-size: 48px;
                margin-bottom: 20px;
                animation: spin 2s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .status-text {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            
            .progress-container {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .progress-bar {
                flex: 1;
                height: 8px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4a9eff, #6bb6ff);
                border-radius: 4px;
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .progress-text {
                font-size: 14px;
                font-weight: bold;
                min-width: 40px;
            }
            
            .init-actions {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .force-init-btn, .skip-init-btn {
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            
            .force-init-btn {
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                color: white;
            }
            
            .force-init-btn:hover {
                background: linear-gradient(45deg, #6bb6ff, #4a9eff);
                transform: translateY(-2px);
            }
            
            .skip-init-btn {
                background: transparent;
                color: #4a9eff;
                border: 2px solid #4a9eff;
            }
            
            .skip-init-btn:hover {
                background: #4a9eff;
                color: white;
            }
            
            .init-footer {
                opacity: 0.6;
                font-size: 12px;
            }
            
            .initialization-screen.hidden {
                display: none;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(this.initScreen);
        
        // Add event listeners
        document.getElementById('force-init-btn').addEventListener('click', () => {
            this.forceInitialization();
        });
        
        document.getElementById('skip-init-btn').addEventListener('click', () => {
            this.skipInitialization();
        });
    }
    
    setupInitializationLock() {
        // Prevent duplicate initialization
        const originalInitialize = window.eldritchApp?.initializeGame;
        if (originalInitialize) {
            window.eldritchApp.initializeGame = () => {
                return this.initializeGameWithLock(originalInitialize);
            };
        }
    }
    
    setupGameStateMonitoring() {
        // Monitor game state changes
        const checkGameState = () => {
            if (window.eldritchApp) {
                if (window.eldritchApp.isInitialized && !this.isInitialized) {
                    this.handleGameInitialized();
                }
            }
        };
        
        // Check every 500ms
        setInterval(checkGameState, 500);
        
        // Listen for game events
        document.addEventListener('gameInitialized', () => {
            this.handleGameInitialized();
        });
        
        document.addEventListener('gameInitializationFailed', () => {
            this.handleGameInitializationFailed();
        });
    }
    
    async initializeGameWithLock(originalInitialize) {
        if (this.isInitialized) {
            console.log('🚀 Game already initialized, skipping duplicate call');
            return Promise.resolve();
        }
        
        if (this.isInitializing) {
            console.log('🚀 Game initialization already in progress, returning existing promise');
            return this.initializationPromise;
        }
        
        this.isInitializing = true;
        this.updateInitStatus('Initializing game...', 0);
        
        this.initializationPromise = this.performInitialization(originalInitialize);
        
        try {
            const result = await this.initializationPromise;
            this.isInitialized = true;
            this.isInitializing = false;
            this.handleGameInitialized();
            return result;
        } catch (error) {
            this.isInitializing = false;
            this.handleGameInitializationFailed(error);
            throw error;
        }
    }
    
    async performInitialization(originalInitialize) {
        const steps = [
            { name: 'Checking geolocation...', progress: 10 },
            { name: 'Initializing map engine...', progress: 30 },
            { name: 'Setting up game systems...', progress: 50 },
            { name: 'Loading player data...', progress: 70 },
            { name: 'Finalizing initialization...', progress: 90 }
        ];
        
        for (const step of steps) {
            this.updateInitStatus(step.name, step.progress);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate work
        }
        
        // Call the original initialization
        const result = await originalInitialize.call(window.eldritchApp);
        
        this.updateInitStatus('Initialization complete!', 100);
        return result;
    }
    
    updateInitStatus(text, progress) {
        const statusText = document.getElementById('init-status-text');
        const progressFill = document.getElementById('init-progress-fill');
        const progressText = document.getElementById('init-progress-text');
        
        if (statusText) statusText.textContent = text;
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressText) progressText.textContent = `${progress}%`;
        
        console.log(`🚀 Init Status: ${text} (${progress}%)`);
    }
    
    handleGameInitialized() {
        console.log('🚀 Game initialized successfully');
        this.updateInitStatus('Game ready!', 100);
        
        // Hide init screen after a short delay
        setTimeout(() => {
            this.hideInitScreen();
        }, 2000);
    }
    
    handleGameInitializationFailed(error) {
        console.error('🚀 Game initialization failed:', error);
        this.updateInitStatus('Initialization failed', 0);
        
        // Show retry options
        const forceBtn = document.getElementById('force-init-btn');
        const skipBtn = document.getElementById('skip-init-btn');
        
        if (forceBtn) forceBtn.style.display = 'inline-block';
        if (skipBtn) skipBtn.style.display = 'inline-block';
    }
    
    hideInitScreen() {
        if (this.initScreen) {
            this.initScreen.classList.add('hidden');
            this.initScreenVisible = false;
            console.log('🚀 Init screen hidden');
        }
    }
    
    showInitScreen() {
        if (this.initScreen) {
            this.initScreen.classList.remove('hidden');
            this.initScreenVisible = true;
            console.log('🚀 Init screen shown');
        }
    }
    
    forceInitialization() {
        console.log('🚀 Force initialization requested');
        this.isInitialized = false;
        this.isInitializing = false;
        this.initializationPromise = null;
        
        // Hide retry buttons
        const forceBtn = document.getElementById('force-init-btn');
        const skipBtn = document.getElementById('skip-init-btn');
        
        if (forceBtn) forceBtn.style.display = 'none';
        if (skipBtn) skipBtn.style.display = 'none';
        
        // Restart initialization
        if (window.eldritchApp && window.eldritchApp.initializeGame) {
            window.eldritchApp.initializeGame();
        }
    }
    
    skipInitialization() {
        console.log('🚀 Skipping initialization');
        this.hideInitScreen();
        
        // Show a warning notification
        if (window.notificationSemaphore) {
            window.notificationSemaphore.showWarning(
                'Initialization Skipped',
                'Some features may not work properly without proper initialization.'
            );
        }
    }
    
    // Public methods
    getInitializationState() {
        return {
            isInitialized: this.isInitialized,
            isInitializing: this.isInitializing,
            initScreenVisible: this.initScreenVisible
        };
    }
    
    // Force show init screen (for debugging)
    showInitScreenForDebug() {
        this.showInitScreen();
        this.updateInitStatus('Debug mode - Init screen visible', 0);
    }
}

// Initialize initialization manager
window.initializationManager = new InitializationManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InitializationManager;
}
