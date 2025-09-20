/**
 * Geolocation Manager - Real-time position tracking with accuracy indicators
 * Handles HTML5 Geolocation API with fallback options and user consent
 */

class GeolocationManager {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.isTracking = false;
        this.accuracyThreshold = 100; // meters
        this.updateInterval = 1000; // 1 second
        this.onPositionUpdate = null;
        this.onAccuracyChange = null;
        this.simulatorMode = false;
        this.simulatorPosition = { lat: 40.7128, lng: -74.0060 }; // NYC default
    }

    init() {
        this.setupUI();
        this.checkGeolocationSupport();
        console.log('📍 Geolocation manager initialized');
    }

    setupUI() {
        const locateBtn = document.getElementById('locate-btn');
        const accuracyDisplay = document.getElementById('accuracy-value');
        
        if (locateBtn) {
            locateBtn.addEventListener('click', () => this.startTracking());
        }
    }

    checkGeolocationSupport() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser');
            return false;
        }
        return true;
    }

    async startTracking() {
        if (this.isTracking) {
            this.stopTracking();
            return;
        }

        this.isTracking = true;
        this.updateUI();

        if (this.simulatorMode) {
            // If simulator is enabled, just start the simulator
            console.log('📍 Geolocation tracking started (simulator mode)');
            return;
        }

        if (!this.checkGeolocationSupport()) return;

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000  // Accept positions up to 5 seconds old
        };

        try {
            // Get initial position
            const position = await this.getCurrentPosition(options);
            this.handlePositionUpdate(position);
            
            // Start watching position
            this.watchId = navigator.geolocation.watchPosition(
                (position) => this.handlePositionUpdate(position),
                (error) => this.handleError(error),
                options
            );

            console.log('📍 Geolocation tracking started (real GPS)');
            
        } catch (error) {
            this.handleError(error);
        }
    }

    getCurrentPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    handlePositionUpdate(position) {
        // Validate position object structure
        if (!position || !position.coords) {
            console.error('Invalid position object received:', position);
            return;
        }

        this.currentPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy || null,
            timestamp: position.timestamp || Date.now()
        };

        this.updateAccuracyDisplay();
        
        if (this.onPositionUpdate) {
            this.onPositionUpdate(this.currentPosition);
        }

        // Trigger cosmic effect for position updates
        if (window.cosmicEffects) {
            const screenX = (this.currentPosition.lng + 180) / 360 * window.innerWidth;
            const screenY = (90 - this.currentPosition.lat) / 180 * window.innerHeight;
            window.cosmicEffects.createEnergyBurst(screenX, screenY, 0.5);
        }
    }

    handleError(error) {
        let message = 'Unknown geolocation error';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Geolocation access denied. Please enable location services.';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable.';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out.';
                break;
        }

        this.showError(message);
        this.stopTracking();
    }

    showError(message) {
        console.error('📍 Geolocation error:', message);
        
        // Update UI to show error
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = 'Location Error';
        }
        
        const accuracyDisplay = document.getElementById('accuracy-value');
        if (accuracyDisplay) {
            accuracyDisplay.textContent = 'Error';
            accuracyDisplay.style.color = 'var(--cosmic-red)';
        }
    }

    updateAccuracyDisplay() {
        const accuracyDisplay = document.getElementById('accuracy-value');
        if (!accuracyDisplay || !this.currentPosition) return;

        const accuracy = this.currentPosition.accuracy;
        let displayText = '--';
        let color = 'var(--cosmic-green)';

        if (accuracy !== null) {
            if (accuracy <= 10) {
                displayText = `${Math.round(accuracy)}m (Excellent)`;
                color = 'var(--cosmic-green)';
            } else if (accuracy <= 50) {
                displayText = `${Math.round(accuracy)}m (Good)`;
                color = 'var(--cosmic-blue)';
            } else if (accuracy <= 100) {
                displayText = `${Math.round(accuracy)}m (Fair)`;
                color = 'var(--cosmic-purple)';
            } else {
                displayText = `${Math.round(accuracy)}m (Poor)`;
                color = 'var(--cosmic-red)';
            }
        }

        accuracyDisplay.textContent = displayText;
        accuracyDisplay.style.color = color;

        if (this.onAccuracyChange) {
            this.onAccuracyChange(accuracy);
        }
    }

    updateUI() {
        const locateBtn = document.getElementById('locate-btn');
        if (locateBtn) {
            if (this.isTracking) {
                locateBtn.innerHTML = '<span class="icon">⏹️</span> Stop Tracking';
                locateBtn.classList.add('tracking');
            } else {
                locateBtn.innerHTML = '<span class="icon">📍</span> Locate Me';
                locateBtn.classList.remove('tracking');
            }
        }
    }

    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        if (this.simulatorInterval) {
            clearInterval(this.simulatorInterval);
            this.simulatorInterval = null;
        }
        
        this.isTracking = false;
        this.updateUI();
        console.log('📍 Geolocation tracking stopped');
    }

    // Simulator mode for testing
    enableSimulator() {
        this.simulatorMode = true;
        this.simulatorPosition = { lat: 61.473683430224284, lng: 23.726548746143216 }; // Härmälänranta
        
        // Stop real geolocation if it's running
        if (this.isTracking && this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        // Simulate position updates
        this.simulatorInterval = setInterval(() => {
            if (this.isTracking) {
                // Add some random movement around Härmälä
                this.simulatorPosition.lat += (Math.random() - 0.5) * 0.0005;
                this.simulatorPosition.lng += (Math.random() - 0.5) * 0.0005;
                
                const simulatedPosition = {
                    coords: {
                        latitude: this.simulatorPosition.lat,
                        longitude: this.simulatorPosition.lng,
                        accuracy: 5 + Math.random() * 10
                    },
                    timestamp: Date.now()
                };
                
                this.handlePositionUpdate(simulatedPosition);
            }
        }, this.updateInterval);
        
        console.log('📍 Simulator mode enabled - centered on Tampere Härmälä');
    }

    disableSimulator() {
        this.simulatorMode = false;
        if (this.simulatorInterval) {
            clearInterval(this.simulatorInterval);
            this.simulatorInterval = null;
        }
        
        // Restart real geolocation if tracking was active
        if (this.isTracking) {
            this.startRealGeolocation();
        }
        
        console.log('📍 Simulator mode disabled');
    }
    
    startRealGeolocation() {
        if (!this.checkGeolocationSupport()) return;

        const options = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000
        };

        try {
            // Get initial position
            this.getCurrentPosition(options).then(position => {
                this.handlePositionUpdate(position);
            });
            
            // Start watching position
            this.watchId = navigator.geolocation.watchPosition(
                (position) => this.handlePositionUpdate(position),
                (error) => this.handleError(error),
                options
            );
            
            console.log('📍 Real geolocation restarted');
        } catch (error) {
            this.handleError(error);
        }
    }

    // Get current position (returns null if not available)
    getCurrentPositionData() {
        return this.currentPosition;
    }

    // Check if position is accurate enough
    isPositionAccurate() {
        return this.currentPosition && 
               this.currentPosition.accuracy && 
               this.currentPosition.accuracy <= this.accuracyThreshold;
    }

    // Calculate distance between two points (in meters)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    // Cleanup
    destroy() {
        this.stopTracking();
        this.disableSimulator();
    }
}

// Export for use in other modules
window.GeolocationManager = GeolocationManager;
