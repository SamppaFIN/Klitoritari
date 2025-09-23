/**
 * Mobile Wake Lock Manager
 * Prevents mobile devices from going to sleep while the game is active
 * Uses Wake Lock API with NoSleep.js fallback for broader compatibility
 */

class MobileWakeLockManager {
    constructor() {
        this.wakeLock = null;
        this.noSleepInstance = null;
        this.isActive = false;
        this.isSupported = false;
        this.fallbackActive = false;
        this.retryCount = 0;
        this.maxRetries = 3;
        this.retryDelay = 2000; // 2 seconds
        this.visibilityChangeHandler = null;
        this.userInteractionHandler = null;
        
        // Check for Wake Lock API support
        this.checkSupport();
        
        // Initialize NoSleep fallback
        this.initNoSleepFallback();
        
        console.log('📱 Mobile Wake Lock Manager initialized');
    }

    checkSupport() {
        // Check for Wake Lock API support
        if ('wakeLock' in navigator) {
            this.isSupported = true;
            console.log('📱 Wake Lock API supported');
        } else {
            console.log('📱 Wake Lock API not supported, using NoSleep fallback');
        }
    }

    initNoSleepFallback() {
        // Create NoSleep instance for fallback
        try {
            const init = () => {
                try {
                    this.noSleepInstance = this.createNoSleepFallback();
                    console.log('📱 NoSleep fallback initialized');
                } catch (err) {
                    console.warn('📱 Failed to initialize NoSleep fallback:', err);
                }
            };
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', init, { once: true });
            } else {
                init();
            }
        } catch (error) {
            console.warn('📱 Failed to initialize NoSleep fallback:', error);
        }
    }

    createNoSleepFallback() {
        // Create a hidden video element that plays silently to prevent sleep
        const video = document.createElement('video');
        video.setAttribute('muted', '');
        video.setAttribute('playsinline', '');
        video.setAttribute('loop', '');
        video.style.display = 'none';
        video.style.position = 'absolute';
        video.style.top = '-9999px';
        video.style.left = '-9999px';
        
        // Create a minimal video data URL (1x1 pixel, 1 second duration)
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1, 1);
        
        // Convert canvas to video data URL
        const dataURL = canvas.toDataURL('image/png');
        
        // Create a minimal video source
        const videoData = this.createMinimalVideoData();
        video.src = videoData;
        
        // Ensure body exists before appending
        const append = () => {
            if (document.body) {
                document.body.appendChild(video);
            }
        };
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', append, { once: true });
        } else {
            append();
        }
        
        return {
            video: video,
            start: () => {
                video.play().catch(e => {
                    console.warn('📱 NoSleep video play failed:', e);
                });
            },
            stop: () => {
                video.pause();
                video.currentTime = 0;
            },
            destroy: () => {
                if (video.parentNode) {
                    video.parentNode.removeChild(video);
                }
            }
        };
    }

    createMinimalVideoData() {
        // Create a minimal video data URL using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 1, 1);
        
        // Return a data URL that can be used as video source
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
    }

    async requestWakeLock() {
        if (!this.isSupported) {
            console.log('📱 Wake Lock API not supported, using NoSleep fallback');
            return this.startNoSleepFallback();
        }

        try {
            // Request wake lock
            this.wakeLock = await navigator.wakeLock.request('screen');
            this.isActive = true;
            this.fallbackActive = false;
            
            console.log('📱 Wake lock acquired successfully');
            
            // Handle wake lock release
            this.wakeLock.addEventListener('release', () => {
                console.log('📱 Wake lock released');
                this.isActive = false;
                this.handleWakeLockRelease();
            });
            
            return true;
        } catch (error) {
            console.warn('📱 Wake lock request failed:', error);
            this.retryCount++;
            
            if (this.retryCount < this.maxRetries) {
                console.log(`📱 Retrying wake lock request (${this.retryCount}/${this.maxRetries})`);
                setTimeout(() => this.requestWakeLock(), this.retryDelay);
                return false;
            } else {
                console.log('📱 Max retries reached, falling back to NoSleep');
                return this.startNoSleepFallback();
            }
        }
    }

    startNoSleepFallback() {
        if (!this.noSleepInstance) {
            console.warn('📱 NoSleep fallback not available');
            return false;
        }

        try {
            this.noSleepInstance.start();
            this.fallbackActive = true;
            this.isActive = true;
            console.log('📱 NoSleep fallback activated');
            return true;
        } catch (error) {
            console.warn('📱 NoSleep fallback failed:', error);
            return false;
        }
    }

    releaseWakeLock() {
        if (this.wakeLock) {
            this.wakeLock.release();
            this.wakeLock = null;
        }
        
        if (this.noSleepInstance && this.fallbackActive) {
            this.noSleepInstance.stop();
            this.fallbackActive = false;
        }
        
        this.isActive = false;
        console.log('📱 Wake lock released');
    }

    handleWakeLockRelease() {
        // Handle when wake lock is released (e.g., user switches tabs)
        console.log('📱 Wake lock was released, attempting to reacquire...');
        
        // Try to reacquire after a short delay
        setTimeout(() => {
            if (this.isActive) {
                this.requestWakeLock();
            }
        }, 1000);
    }

    setupVisibilityHandling() {
        // Handle visibility changes (tab switching, app backgrounding)
        this.visibilityChangeHandler = () => {
            if (document.hidden) {
                console.log('📱 Page hidden, maintaining wake lock');
                // Keep wake lock active when page is hidden
            } else {
                console.log('📱 Page visible, ensuring wake lock is active');
                // Ensure wake lock is active when page becomes visible
                if (this.isActive && !this.wakeLock && !this.fallbackActive) {
                    this.requestWakeLock();
                }
            }
        };
        
        document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    }

    setupUserInteractionHandling() {
        // Handle user interactions to maintain wake lock
        this.userInteractionHandler = (event) => {
            // Only handle touch/click events
            if (event.type === 'touchstart' || event.type === 'click') {
                if (this.isActive && !this.wakeLock && !this.fallbackActive) {
                    console.log('📱 User interaction detected, reacquiring wake lock');
                    this.requestWakeLock();
                }
            }
        };
        
        document.addEventListener('touchstart', this.userInteractionHandler, { passive: true });
        document.addEventListener('click', this.userInteractionHandler, { passive: true });
    }

    async start() {
        console.log('📱 Starting mobile wake lock...');
        
        // Setup event handlers
        this.setupVisibilityHandling();
        this.setupUserInteractionHandling();
        
        // Try to acquire wake lock
        const success = await this.requestWakeLock();
        
        if (success) {
            console.log('📱 Mobile wake lock started successfully');
        } else {
            console.warn('📱 Failed to start mobile wake lock');
        }
        
        return success;
    }

    stop() {
        console.log('📱 Stopping mobile wake lock...');
        
        // Remove event handlers
        if (this.visibilityChangeHandler) {
            document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
            this.visibilityChangeHandler = null;
        }
        
        if (this.userInteractionHandler) {
            document.removeEventListener('touchstart', this.userInteractionHandler);
            document.removeEventListener('click', this.userInteractionHandler);
            this.userInteractionHandler = null;
        }
        
        // Release wake lock
        this.releaseWakeLock();
        
        console.log('📱 Mobile wake lock stopped');
    }

    getStatus() {
        return {
            isActive: this.isActive,
            isSupported: this.isSupported,
            fallbackActive: this.fallbackActive,
            wakeLockActive: !!this.wakeLock,
            noSleepActive: this.fallbackActive
        };
    }

    // Method to be called when game starts
    enableForGame() {
        console.log('📱 Enabling wake lock for game session');
        return this.start();
    }

    // Method to be called when game ends or user leaves
    disableForGame() {
        console.log('📱 Disabling wake lock for game session');
        this.stop();
    }

    // Cleanup method
    destroy() {
        this.stop();
        
        if (this.noSleepInstance) {
            this.noSleepInstance.destroy();
            this.noSleepInstance = null;
        }
        
        console.log('📱 Mobile wake lock manager destroyed');
    }
}

// Create global instance
window.mobileWakeLock = new MobileWakeLockManager();

// Auto-start when page loads (for mobile devices)
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
        console.log('📱 Mobile device detected, auto-starting wake lock');
        // Start wake lock after a short delay to ensure page is fully loaded
        setTimeout(() => {
            window.mobileWakeLock.enableForGame();
        }, 1000);
    } else {
        console.log('📱 Desktop device detected, wake lock available but not auto-started');
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileWakeLockManager;
}
