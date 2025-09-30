/**
 * Notification Semaphore System
 * Created by: 🎨 Muse + 💻 Codex + 🧪 Testa + 🌸 Aurora
 * Purpose: Manage notification queue and prevent duplicate game initialization
 */

class NotificationSemaphore {
    constructor() {
        this.notificationQueue = [];
        this.isProcessing = false;
        this.maxConcurrentNotifications = 3;
        this.currentNotifications = 0;
        this.gameInitializationState = 'idle'; // idle, initializing, initialized, failed
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 1;
        
        this.init();
    }
    
    init() {
        console.log('🚦 Notification Semaphore initialized');
        this.setupNotificationContainer();
        this.setupGameStateMonitoring();
        this.setupInitializationLock();
    }
    
    setupNotificationContainer() {
        // Create a dedicated notification container
        const container = document.createElement('div');
        container.id = 'notification-semaphore-container';
        container.className = 'notification-semaphore-container';
        container.innerHTML = `
            <div class="notification-queue" id="notification-queue"></div>
            <div class="initialization-status" id="initialization-status">
                <div class="status-indicator" id="status-indicator">⏳</div>
                <div class="status-text" id="status-text">Initializing...</div>
                <div class="progress-bar" id="progress-bar">
                    <div class="progress-fill" id="progress-fill"></div>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .notification-semaphore-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
                pointer-events: none;
            }
            
            .notification-queue {
                display: flex;
                flex-direction: column;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .notification-item {
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                border: 2px solid #4a9eff;
                border-radius: 10px;
                padding: 15px;
                color: white;
                animation: slideInRight 0.3s ease;
                pointer-events: auto;
                position: relative;
                overflow: hidden;
            }
            
            .notification-item.success {
                border-color: #4caf50;
                background: linear-gradient(135deg, #1a2e1a, #162e16, #0f340f);
            }
            
            .notification-item.warning {
                border-color: #ff9800;
                background: linear-gradient(135deg, #2e1a1a, #2e1616, #340f0f);
            }
            
            .notification-item.error {
                border-color: #f44336;
                background: linear-gradient(135deg, #2e1a1a, #2e1616, #340f0f);
            }
            
            .notification-item.info {
                border-color: #2196f3;
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            }
            
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            .notification-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 8px;
            }
            
            .notification-title {
                font-weight: bold;
                font-size: 14px;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .notification-message {
                font-size: 12px;
                line-height: 1.4;
                opacity: 0.9;
            }
            
            .notification-progress {
                width: 100%;
                height: 3px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-top: 8px;
                overflow: hidden;
            }
            
            .notification-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4a9eff, #6bb6ff);
                border-radius: 2px;
                animation: progress 3s linear forwards;
            }
            
            @keyframes progress {
                from { width: 100%; }
                to { width: 0%; }
            }
            
            .initialization-status {
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                border: 2px solid #4a9eff;
                border-radius: 10px;
                padding: 15px;
                color: white;
                text-align: center;
                pointer-events: auto;
            }
            
            .status-indicator {
                font-size: 24px;
                margin-bottom: 8px;
                animation: pulse 2s infinite;
            }
            
            .status-text {
                font-size: 14px;
                font-weight: bold;
                margin-bottom: 10px;
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 3px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #4a9eff, #6bb6ff);
                border-radius: 3px;
                width: 0%;
                transition: width 0.3s ease;
            }
            
            .initialization-status.initializing .progress-fill {
                animation: progressPulse 2s ease-in-out infinite;
            }
            
            @keyframes progressPulse {
                0%, 100% { width: 0%; }
                50% { width: 100%; }
            }
            
            .initialization-status.initialized {
                border-color: #4caf50;
                background: linear-gradient(135deg, #1a2e1a, #162e16, #0f340f);
            }
            
            .initialization-status.failed {
                border-color: #f44336;
                background: linear-gradient(135deg, #2e1a1a, #2e1616, #340f0f);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);
    }
    
    setupGameStateMonitoring() {
        // Monitor game initialization state
        const checkGameState = () => {
            if (window.eldritchApp) {
                if (window.eldritchApp.isInitialized) {
                    this.setGameState('initialized');
                } else if (window.eldritchApp.isInitializing) {
                    this.setGameState('initializing');
                }
            }
        };
        
        // Check every 500ms
        setInterval(checkGameState, 500);
        
        // Also listen for game events
        document.addEventListener('gameInitialized', () => {
            this.setGameState('initialized');
        });
        
        document.addEventListener('gameInitializationFailed', () => {
            this.setGameState('failed');
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
    
    async initializeGameWithLock(originalInitialize) {
        if (this.gameInitializationState === 'initializing') {
            console.log('🚦 Game initialization already in progress, skipping duplicate call');
            return Promise.resolve();
        }
        
        if (this.gameInitializationState === 'initialized') {
            console.log('🚦 Game already initialized, skipping duplicate call');
            return Promise.resolve();
        }
        
        if (this.initializationAttempts >= this.maxInitializationAttempts) {
            console.log('🚦 Max initialization attempts reached, skipping duplicate call');
            return Promise.reject(new Error('Max initialization attempts reached'));
        }
        
        this.setGameState('initializing');
        this.initializationAttempts++;
        
        try {
            const result = await originalInitialize.call(window.eldritchApp);
            this.setGameState('initialized');
            return result;
        } catch (error) {
            this.setGameState('failed');
            throw error;
        }
    }
    
    setGameState(state) {
        if (this.gameInitializationState === state) return;
        
        this.gameInitializationState = state;
        const statusElement = document.getElementById('initialization-status');
        const indicatorElement = document.getElementById('status-indicator');
        const textElement = document.getElementById('status-text');
        const progressElement = document.getElementById('progress-fill');
        
        if (!statusElement) return;
        
        statusElement.className = `initialization-status ${state}`;
        
        switch (state) {
            case 'idle':
                indicatorElement.textContent = '⏳';
                textElement.textContent = 'Ready to initialize...';
                progressElement.style.width = '0%';
                break;
            case 'initializing':
                indicatorElement.textContent = '🔄';
                textElement.textContent = 'Initializing game...';
                progressElement.style.width = '50%';
                break;
            case 'initialized':
                indicatorElement.textContent = '✅';
                textElement.textContent = 'Game initialized successfully!';
                progressElement.style.width = '100%';
                // Hide after 3 seconds
                setTimeout(() => {
                    statusElement.style.display = 'none';
                }, 3000);
                break;
            case 'failed':
                indicatorElement.textContent = '❌';
                textElement.textContent = 'Initialization failed';
                progressElement.style.width = '0%';
                break;
        }
    }
    
    addNotification(title, message, type = 'info', duration = 3000) {
        const notification = {
            id: Date.now() + Math.random(),
            title,
            message,
            type,
            duration,
            timestamp: Date.now()
        };
        
        this.notificationQueue.push(notification);
        this.processNotificationQueue();
    }
    
    processNotificationQueue() {
        if (this.isProcessing || this.currentNotifications >= this.maxConcurrentNotifications) {
            return;
        }
        
        if (this.notificationQueue.length === 0) {
            return;
        }
        
        this.isProcessing = true;
        const notification = this.notificationQueue.shift();
        this.showNotification(notification);
    }
    
    showNotification(notification) {
        const queueElement = document.getElementById('notification-queue');
        if (!queueElement) return;
        
        const notificationElement = document.createElement('div');
        notificationElement.className = `notification-item ${notification.type}`;
        notificationElement.innerHTML = `
            <div class="notification-header">
                <div class="notification-title">${notification.title}</div>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
            <div class="notification-message">${notification.message}</div>
            <div class="notification-progress">
                <div class="notification-progress-fill"></div>
            </div>
        `;
        
        queueElement.appendChild(notificationElement);
        this.currentNotifications++;
        
        // Auto-remove after duration
        setTimeout(() => {
            if (notificationElement.parentElement) {
                notificationElement.remove();
                this.currentNotifications--;
                this.isProcessing = false;
                this.processNotificationQueue();
            }
        }, notification.duration);
    }
    
    // Public methods for different notification types
    showSuccess(title, message, duration = 3000) {
        this.addNotification(title, message, 'success', duration);
    }
    
    showWarning(title, message, duration = 4000) {
        this.addNotification(title, message, 'warning', duration);
    }
    
    showError(title, message, duration = 5000) {
        this.addNotification(title, message, 'error', duration);
    }
    
    showInfo(title, message, duration = 3000) {
        this.addNotification(title, message, 'info', duration);
    }
    
    // Clear all notifications
    clearAllNotifications() {
        const queueElement = document.getElementById('notification-queue');
        if (queueElement) {
            queueElement.innerHTML = '';
        }
        this.notificationQueue = [];
        this.currentNotifications = 0;
        this.isProcessing = false;
    }
    
    // Get current game state
    getGameState() {
        return this.gameInitializationState;
    }
    
    // Force game state (for debugging)
    forceGameState(state) {
        this.setGameState(state);
    }
}

// Initialize notification semaphore
window.notificationSemaphore = new NotificationSemaphore();

// Override the existing NotificationCenter to use semaphore
if (window.NotificationCenter) {
    const originalShowBanner = window.NotificationCenter.showBanner;
    window.NotificationCenter.showBanner = function(title, message, type = 'info') {
        // Use semaphore for better management
        window.notificationSemaphore.addNotification(title, message, type);
        
        // Also call original if it exists
        if (originalShowBanner) {
            originalShowBanner.call(this, title, message, type);
        }
    };
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NotificationSemaphore;
}
