/**
 * Geolocation Fixes and Initialization Improvements
 * Created by: 💻 Codex + 🧪 Testa + 🔍 Veritas + 🌸 Aurora
 * Purpose: Fix critical geolocation permissions and initialization issues
 */

class GeolocationFixes {
    constructor() {
        this.permissionRequested = false;
        this.initializationAttempts = 0;
        this.maxInitializationAttempts = 3;
        this.initializationDelay = 1000;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Geolocation Fixes initialized');
        this.setupPermissionHandlers();
        this.setupInitializationRetry();
        this.setupUserGestureHandlers();
    }
    
    setupPermissionHandlers() {
        // Handle permission state changes
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                console.log('🔧 Geolocation permission state:', result.state);
                
                result.onchange = () => {
                    console.log('🔧 Geolocation permission changed to:', result.state);
                    this.handlePermissionChange(result.state);
                };
            }).catch((error) => {
                console.warn('🔧 Could not query geolocation permission:', error);
            });
        }
    }
    
    setupInitializationRetry() {
        // Retry initialization if it fails
        document.addEventListener('geolocationInitFailed', () => {
            this.retryInitialization();
        });
        
        // Also retry on app initialization
        document.addEventListener('appInitializationFailed', () => {
            this.retryInitialization();
        });
    }
    
    setupUserGestureHandlers() {
        // Request permission on first user interaction
        const requestPermissionOnInteraction = () => {
            if (!this.permissionRequested) {
                this.requestGeolocationPermission();
                this.permissionRequested = true;
            }
        };
        
        // Listen for various user interactions
        document.addEventListener('click', requestPermissionOnInteraction, { once: true });
        document.addEventListener('touchstart', requestPermissionOnInteraction, { once: true });
        document.addEventListener('keydown', requestPermissionOnInteraction, { once: true });
        
        // Also request on page load after a short delay
        setTimeout(() => {
            if (!this.permissionRequested) {
                this.requestGeolocationPermission();
                this.permissionRequested = true;
            }
        }, 2000);
    }
    
    async requestGeolocationPermission() {
        console.log('🔧 Requesting geolocation permission...');
        
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported on this device');
            return false;
        }
        
        try {
            // Show permission request UI
            this.showPermissionRequestUI();
            
            // Request permission with a simple getCurrentPosition call
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    resolve,
                    reject,
                    {
                        enableHighAccuracy: false, // Start with low accuracy for permission
                        timeout: 10000,
                        maximumAge: 60000
                    }
                );
            });
            
            console.log('🔧 Geolocation permission granted');
            this.hidePermissionRequestUI();
            this.handlePermissionGranted(position);
            return true;
            
        } catch (error) {
            console.error('🔧 Geolocation permission denied or failed:', error);
            this.handlePermissionDenied(error);
            return false;
        }
    }
    
    showPermissionRequestUI() {
        // Create permission request modal
        const modal = document.createElement('div');
        modal.id = 'geolocation-permission-modal';
        modal.className = 'geolocation-permission-modal';
        modal.innerHTML = `
            <div class="permission-modal-content">
                <div class="permission-modal-header">
                    <div class="permission-icon">📍</div>
                    <h2>Location Permission Required</h2>
                </div>
                <div class="permission-modal-body">
                    <p>Eldritch Sanctuary needs access to your location to provide the full gaming experience.</p>
                    <p>This allows you to:</p>
                    <ul>
                        <li>Explore the real world map</li>
                        <li>Discover locations and quests</li>
                        <li>Interact with other players</li>
                        <li>Build bases at real locations</li>
                    </ul>
                    <p><strong>Your location data is never stored or shared.</strong></p>
                </div>
                <div class="permission-modal-footer">
                    <button id="deny-location" class="deny-btn">Deny</button>
                    <button id="allow-location" class="allow-btn">Allow Location Access</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .geolocation-permission-modal {
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
                animation: fadeIn 0.3s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .permission-modal-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                border: 2px solid #4a9eff;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                color: white;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .permission-modal-header {
                margin-bottom: 20px;
            }
            
            .permission-icon {
                font-size: 48px;
                margin-bottom: 10px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .permission-modal-body {
                margin-bottom: 30px;
                text-align: left;
            }
            
            .permission-modal-body p {
                margin-bottom: 15px;
                line-height: 1.5;
            }
            
            .permission-modal-body ul {
                margin: 15px 0;
                padding-left: 20px;
            }
            
            .permission-modal-body li {
                margin: 8px 0;
                color: #4a9eff;
            }
            
            .permission-modal-footer {
                display: flex;
                gap: 15px;
                justify-content: center;
            }
            
            .permission-modal-footer button {
                padding: 12px 24px;
                border: none;
                border-radius: 5px;
                font-weight: bold;
                cursor: pointer;
                font-size: 16px;
                transition: all 0.3s ease;
            }
            
            .deny-btn {
                background: #666;
                color: white;
            }
            
            .deny-btn:hover {
                background: #777;
            }
            
            .allow-btn {
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                color: white;
            }
            
            .allow-btn:hover {
                background: linear-gradient(45deg, #6bb6ff, #4a9eff);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('allow-location').addEventListener('click', () => {
            this.hidePermissionRequestUI();
            this.retryGeolocationRequest();
        });
        
        document.getElementById('deny-location').addEventListener('click', () => {
            this.hidePermissionRequestUI();
            this.handlePermissionDenied({ code: 1, message: 'User denied location permission' });
        });
    }
    
    hidePermissionRequestUI() {
        const modal = document.getElementById('geolocation-permission-modal');
        if (modal) {
            modal.remove();
        }
    }
    
    handlePermissionGranted(position) {
        console.log('🔧 Geolocation permission granted, position:', position);
        
        // Update geolocation manager with the position
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
        if (window.NotificationCenter) {
            window.NotificationCenter.showBanner('Location access granted!', 'success');
        }
        
        // Trigger app initialization
        this.triggerAppInitialization();
    }
    
    handlePermissionDenied(error) {
        console.error('🔧 Geolocation permission denied:', error);
        
        let message = 'Location access denied. Some features may not work properly.';
        if (error.code === 1) {
            message = 'Location access denied. Please enable location services in your browser settings.';
        }
        
        // Show error notification
        if (window.NotificationCenter) {
            window.NotificationCenter.showBanner(message, 'warning');
        }
        
        // Use fallback position
        this.useFallbackPosition();
    }
    
    useFallbackPosition() {
        console.log('🔧 Using fallback position due to permission denial');
        
        // Set a default position (can be changed to user's preferred location)
        const fallbackPosition = {
            coords: {
                latitude: 61.472768, // Tampere, Finland
                longitude: 23.724032,
                accuracy: 1000
            },
            timestamp: Date.now()
        };
        
        // Update geolocation manager with fallback position
        if (window.geolocationManager) {
            window.geolocationManager.handlePositionUpdate(fallbackPosition);
        }
        
        // Trigger app initialization with fallback
        this.triggerAppInitialization();
    }
    
    retryGeolocationRequest() {
        console.log('🔧 Retrying geolocation request...');
        
        // Wait a bit before retrying
        setTimeout(() => {
            this.requestGeolocationPermission();
        }, 1000);
    }
    
    retryInitialization() {
        if (this.initializationAttempts >= this.maxInitializationAttempts) {
            console.error('🔧 Max initialization attempts reached');
            return;
        }
        
        this.initializationAttempts++;
        console.log(`🔧 Retrying initialization (attempt ${this.initializationAttempts}/${this.maxInitializationAttempts})`);
        
        setTimeout(() => {
            this.triggerAppInitialization();
        }, this.initializationDelay * this.initializationAttempts);
    }
    
    triggerAppInitialization() {
        console.log('🔧 Triggering app initialization...');
        
        // Trigger the main app initialization
        if (window.eldritchApp && window.eldritchApp.initializeGame) {
            window.eldritchApp.initializeGame().then(() => {
                console.log('🔧 App initialization successful');
                this.initializationAttempts = 0; // Reset on success
            }).catch((error) => {
                console.error('🔧 App initialization failed:', error);
                this.retryInitialization();
            });
        } else {
            console.warn('🔧 App not available for initialization');
            this.retryInitialization();
        }
    }
    
    handlePermissionChange(newState) {
        console.log('🔧 Geolocation permission state changed to:', newState);
        
        switch (newState) {
            case 'granted':
                this.handlePermissionGranted({ coords: { latitude: 0, longitude: 0, accuracy: 0 }, timestamp: Date.now() });
                break;
            case 'denied':
                this.handlePermissionDenied({ code: 1, message: 'Permission denied' });
                break;
            case 'prompt':
                // Permission is back to prompt state, can request again
                this.permissionRequested = false;
                break;
        }
    }
    
    showError(message) {
        console.error('🔧 Geolocation error:', message);
        
        if (window.NotificationCenter) {
            window.NotificationCenter.showBanner(message, 'error');
        } else {
            alert(message);
        }
    }
    
    // Public method to force permission request
    forcePermissionRequest() {
        this.permissionRequested = false;
        this.requestGeolocationPermission();
    }
    
    // Public method to check permission status
    async checkPermissionStatus() {
        if (!navigator.permissions) {
            return 'unknown';
        }
        
        try {
            const result = await navigator.permissions.query({ name: 'geolocation' });
            return result.state;
        } catch (error) {
            console.warn('🔧 Could not check permission status:', error);
            return 'unknown';
        }
    }
}

// Initialize geolocation fixes
window.geolocationFixes = new GeolocationFixes();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeolocationFixes;
}
