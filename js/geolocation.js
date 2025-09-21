/**
 * Geolocation Manager - Real-time position tracking with accuracy indicators
 * Handles HTML5 Geolocation API with fallback options and user consent
 */

class GeolocationManager {
    constructor() {
        this.currentPosition = null;
        this.watchId = null;
        this.isTracking = false;
        this.accuracyThreshold = 50; // meters - more strict
        this.updateInterval = 2000; // 2 seconds - less frequent but more accurate
        this.onPositionUpdate = null;
        this.onAccuracyChange = null;
        this.deviceGPSEnabled = true; // Toggle for device GPS
        this.fixedPosition = { lat: 61.4978, lng: 23.7608 }; // Default Tampere area
        this.lastValidPosition = null;
        this.positionHistory = [];
        this.maxHistorySize = 10;
        this.deviceLocationDisplay = null;
    }

    init() {
        this.setupUI();
        this.checkGeolocationSupport();
        this.createDeviceLocationDisplay();
        console.log('📍 Geolocation manager initialized');
    }

    setupUI() {
        const locateBtn = document.getElementById('locate-btn');
        const accuracyDisplay = document.getElementById('accuracy-value');
        
        if (locateBtn) {
            locateBtn.addEventListener('click', () => this.startTracking());
        }
        
        // Create device location display in header
        this.createDeviceLocationDisplay();
    }

    createDeviceLocationDisplay() {
        // Find the header controls area
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;

        // Create device location display
        const locationDisplay = document.createElement('div');
        locationDisplay.id = 'device-location-display';
        locationDisplay.className = 'device-location-display';
        locationDisplay.innerHTML = `
            <div class="location-info">
                <span class="location-label">📍 Device:</span>
                <span class="location-coords">Getting location...</span>
            </div>
            <div class="location-accuracy">
                <span class="accuracy-label">Accuracy:</span>
                <span class="accuracy-value">--</span>
            </div>
        `;

        // Insert after the locate button
        const locateBtn = document.getElementById('locate-btn');
        if (locateBtn && locateBtn.parentNode) {
            locateBtn.parentNode.insertBefore(locationDisplay, locateBtn.nextSibling);
        } else {
            headerControls.appendChild(locationDisplay);
        }

        this.deviceLocationDisplay = locationDisplay;
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

        if (!this.deviceGPSEnabled) {
            // Use fixed position instead of device GPS
            console.log('📍 Using fixed position (device GPS disabled)');
            this.updateDeviceLocationDisplay(
                `${this.fixedPosition.lat.toFixed(6)}, ${this.fixedPosition.lng.toFixed(6)}`,
                'Fixed'
            );
            this.handlePositionUpdate({
                coords: {
                    latitude: this.fixedPosition.lat,
                    longitude: this.fixedPosition.lng,
                    accuracy: 1
                },
                timestamp: Date.now()
            });
            return;
        }

        if (!this.checkGeolocationSupport()) {
            console.error('📍 Geolocation not supported');
            this.updateDeviceLocationDisplay('Not Supported', 'N/A');
            return;
        }

        // Request location permission explicitly
        console.log('📍 Requesting location permission...');
        this.updateDeviceLocationDisplay('Requesting permission...', '--');
        
        // Show a notification to the user about location permission
        if (window.eldritchApp) {
            window.eldritchApp.showNotification('📍 Please allow location access for the game to work properly', 'info');
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 20000,  // Increased timeout for better accuracy
            maximumAge: 10000  // Accept positions up to 10 seconds old
        };

        try {
            // Try high accuracy first
            console.log('📍 Requesting high accuracy location...');
            this.updateDeviceLocationDisplay('Getting high accuracy...', '--');
            
            const position = await this.getHighAccuracyPosition();
            this.handlePositionUpdate(position);
            
            // Start watching position with high accuracy
            this.watchId = navigator.geolocation.watchPosition(
                (position) => this.handlePositionUpdate(position),
                (error) => this.handleError(error),
                options
            );

            console.log('📍 Geolocation tracking started (high accuracy GPS)');
            
        } catch (error) {
            console.log('📍 High accuracy failed, trying standard accuracy...');
            this.updateDeviceLocationDisplay('Trying standard accuracy...', '--');
            
            try {
                const position = await this.getCurrentPosition(options);
                this.handlePositionUpdate(position);
                
                // Start watching position
                this.watchId = navigator.geolocation.watchPosition(
                    (position) => this.handlePositionUpdate(position),
                    (error) => this.handleError(error),
                    options
                );
                
                console.log('📍 Geolocation tracking started (standard GPS)');
            } catch (fallbackError) {
                this.handleError(fallbackError);
            }
        }
    }

    getCurrentPosition(options) {
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, options);
        });
    }

    async getHighAccuracyPosition() {
        const options = {
            enableHighAccuracy: true,
            timeout: 30000,  // 30 seconds for high accuracy
            maximumAge: 0    // No cached positions
        };

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

        const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy || null,
            timestamp: position.timestamp || Date.now()
        };

        // Validate position coordinates
        if (!this.isValidCoordinates(newPosition.lat, newPosition.lng)) {
            console.error('Invalid coordinates received:', newPosition);
            return;
        }

        // Check if this position is significantly different from last valid position
        if (this.lastValidPosition && this.calculateDistance(this.lastValidPosition, newPosition) > 1000) {
            console.warn('📍 Large position jump detected, validating...', {
                from: this.lastValidPosition,
                to: newPosition,
                distance: this.calculateDistance(this.lastValidPosition, newPosition)
            });
            
            // If jump is too large, wait for confirmation
            if (this.calculateDistance(this.lastValidPosition, newPosition) > 5000) {
                console.warn('📍 Position jump too large, ignoring this update');
                return;
            }
        }

        // Log position updates for debugging
        console.log('📍 GPS Position Update:', {
            lat: newPosition.lat.toFixed(6),
            lng: newPosition.lng.toFixed(6),
            accuracy: newPosition.accuracy ? `${newPosition.accuracy.toFixed(1)}m` : 'unknown',
            timestamp: new Date(newPosition.timestamp).toLocaleTimeString()
        });

        // Update position history
        this.positionHistory.push(newPosition);
        if (this.positionHistory.length > this.maxHistorySize) {
            this.positionHistory.shift();
        }

        this.currentPosition = newPosition;
        this.lastValidPosition = newPosition;

        // Update device location display
        this.updateDeviceLocationDisplay(
            `${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)}`,
            newPosition.accuracy ? `${newPosition.accuracy.toFixed(1)}m` : 'unknown'
        );

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
        let displayMessage = 'Error';
        
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message = 'Geolocation access denied. Please enable location services.';
                displayMessage = 'Permission Denied';
                break;
            case error.POSITION_UNAVAILABLE:
                message = 'Location information unavailable.';
                displayMessage = 'Unavailable';
                break;
            case error.TIMEOUT:
                message = 'Location request timed out.';
                displayMessage = 'Timeout';
                break;
        }

        console.error('📍 Geolocation error:', message, error);
        this.showError(message);
        
        // Update device location display with error
        this.updateDeviceLocationDisplay(displayMessage, 'Error');
        
        // Don't stop tracking on timeout errors - keep trying
        if (error.code === error.TIMEOUT) {
            console.log('📍 Geolocation timeout - will retry...');
            return;
        }
        
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

    // Check if we have a valid current position
    hasValidPosition() {
        return this.currentPosition && 
               this.currentPosition.lat && 
               this.currentPosition.lng &&
               this.currentPosition.timestamp &&
               (Date.now() - this.currentPosition.timestamp) < 30000; // Position less than 30 seconds old
    }

    // Get current position with better error handling
    getCurrentPositionSafe() {
        if (this.hasValidPosition()) {
            return this.currentPosition;
        }
        return null;
    }

    // Validate coordinates
    isValidCoordinates(lat, lng) {
        return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180 && 
               !isNaN(lat) && !isNaN(lng) && isFinite(lat) && isFinite(lng);
    }

    // Calculate distance between two positions in meters
    calculateDistance(pos1, pos2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = pos1.lat * Math.PI/180;
        const φ2 = pos2.lat * Math.PI/180;
        const Δφ = (pos2.lat - pos1.lat) * Math.PI/180;
        const Δλ = (pos2.lng - pos1.lng) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    // Update device location display
    updateDeviceLocationDisplay(coords, accuracy) {
        if (!this.deviceLocationDisplay) {
            console.log('📍 Device location display not found, creating...');
            this.createDeviceLocationDisplay();
            if (!this.deviceLocationDisplay) return;
        }

        const coordsElement = this.deviceLocationDisplay.querySelector('.location-coords');
        const accuracyElement = this.deviceLocationDisplay.querySelector('.accuracy-value');

        console.log('📍 Updating device location display:', { coords, accuracy });

        if (coordsElement) {
            coordsElement.textContent = coords;
        } else {
            console.warn('📍 Location coords element not found');
        }
        if (accuracyElement) {
            accuracyElement.textContent = accuracy;
        } else {
            console.warn('📍 Accuracy element not found');
        }
    }


    // Toggle device GPS on/off
    toggleDeviceGPS() {
        this.deviceGPSEnabled = !this.deviceGPSEnabled;
        console.log(`📍 Device GPS ${this.deviceGPSEnabled ? 'enabled' : 'disabled'}`);
        
        // Update display
        if (this.deviceGPSEnabled) {
            this.updateDeviceLocationDisplay('GPS Enabled', '--');
        } else {
            this.updateDeviceLocationDisplay('Fixed Position', 'N/A');
        }
        
        // Restart tracking with new mode
        if (this.isTracking) {
            this.stopTracking();
            setTimeout(() => this.startTracking(), 100);
        }
        
        return this.deviceGPSEnabled;
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
