/**
 * @fileoverview [VERIFIED] Geolocation Manager - Real-time position tracking with accuracy indicators
 * @status VERIFIED - GPS tracking working correctly with fallback options
 * @feature #feature-geolocation-tracking
 * @last_verified 2024-01-28
 * @dependencies HTML5 Geolocation API, Map Engine
 * @warning Do not modify GPS accuracy logic or fallback systems without testing location updates
 * 
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
        this.fixedPosition = { lat: 61.472768, lng: 23.724032 }; // Initial fallback, will be updated with last known position
        this.lastValidPosition = null;
        this.positionHistory = [];
        this.maxHistorySize = 10;
        this.deviceLocationDisplay = null;
        this.targetQuestLocation = null;
        this.locationUpdatesPaused = false;
        this.isFirstLocation = true; // Track first successful location
        this.shownLowAccuracyNotice = false;
    }

    init() {
        this.setupUI();
        this.checkGeolocationSupport();
        this.createDeviceLocationDisplay();
        this.startPeriodicUpdates();
        this.setupBackgroundTracking();
        console.log('📍 Geolocation manager initialized');
    }

    setupBackgroundTracking() {
        // Request high accuracy location for better background tracking
        this.requestHighAccuracyLocation();
        
        // Set up visibility change handler to resume tracking when app becomes visible
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.isTracking) {
                console.log('📍 App became visible, resuming location tracking');
                this.startTracking();
            }
        });

        // Set up page focus handler
        window.addEventListener('focus', () => {
            if (this.isTracking) {
                console.log('📍 Page focused, resuming location tracking');
                this.startTracking();
            }
        });

        // Set up beforeunload handler to save position
        window.addEventListener('beforeunload', () => {
            if (this.currentPosition) {
                localStorage.setItem('eldritch_last_position', JSON.stringify({
                    lat: this.currentPosition.coords.latitude,
                    lng: this.currentPosition.coords.longitude,
                    timestamp: Date.now()
                }));
            }
        });
    }

    async requestHighAccuracyLocation() {
        return new Promise((resolve) => {
            if (!navigator.geolocation) {
                console.warn('📍 Geolocation not supported');
                resolve(false);
                return;
            }

            console.log('📍 Requesting high accuracy location for background tracking...');
            
            const options = {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('📍 High accuracy location granted');
                    this.currentPosition = position;
                    this.lastValidPosition = position;
                    resolve(true);
                },
                (error) => {
                    console.warn('📍 High accuracy location denied:', error.message);
                    resolve(false);
                },
                options
            );
        });
    }

    setupUI() {
        // Use the Locate Me button in the header
        const locateBtn = document.getElementById('locate-me-btn');
        const accuracyDisplay = document.getElementById('accuracy-display-header');
        
        if (locateBtn) {
            locateBtn.addEventListener('click', () => this.startTracking());
        }
        
        // Device location display is created in init(), no need to create it again
    }

    createDeviceLocationDisplay() {
        // Check if display already exists
        if (document.getElementById('device-location-display')) {
            console.log('📍 Device location display already exists, skipping creation');
            this.deviceLocationDisplay = document.getElementById('device-location-display');
            return;
        }

        // Find the header controls area
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;

        // Create device location display
        const locationDisplay = document.createElement('div');
        locationDisplay.id = 'device-location-display';
        locationDisplay.className = 'device-location-display';
        locationDisplay.innerHTML = `
            <div class="location-info">
                <span class="location-label">📍 Location:</span>
                <span class="location-coords">Getting location...</span>
            </div>
            <div class="location-accuracy">
                <span class="accuracy-label">Accuracy:</span>
                <span class="accuracy-value">--</span>
            </div>
            <div class="quest-distance">
                <span class="quest-label">🎭 Quest:</span>
                <span class="quest-distance-value">--</span>
            </div>
        `;

        // Insert after the locate button
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn && locateBtn.parentNode) {
            locateBtn.parentNode.insertBefore(locationDisplay, locateBtn.nextSibling);
        } else {
            headerControls.appendChild(locationDisplay);
        }

        this.deviceLocationDisplay = locationDisplay;
        console.log('📍 Device location display created');
    }
    
    // Start periodic updates to maintain display values
    startPeriodicUpdates() {
        // Update display every 5 seconds to maintain values
        setInterval(() => {
            this.refreshLocationDisplay();
        }, 5000);
        
        console.log('📍 Started periodic location display updates');
    }
    
    // Refresh location display with current values
    refreshLocationDisplay() {
        if (!this.deviceLocationDisplay) return;
        
        const position = this.getCurrentPositionSafe();
        if (position) {
            const coords = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            const accuracy = position.accuracy ? `${position.accuracy.toFixed(1)}m` : 'unknown';
            
            this.updateDeviceLocationDisplay(coords, accuracy);
            console.log('📍 Refreshed location display:', { coords, accuracy });
        } else {
            // Show fallback position
            const fallback = this.getFallbackPosition();
            this.updateDeviceLocationDisplay(
                `${fallback.lat.toFixed(6)}, ${fallback.lng.toFixed(6)}`,
                'N/A'
            );
            console.log('📍 Using fallback position in display');
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
        
        // Resume location updates when starting tracking
        this.resumeLocationUpdates();

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
            console.log('📍 Requesting high accuracy location...');
            this.updateDeviceLocationDisplay('Getting high accuracy...', '--');

            // Use a resilient multi-attempt strategy
            const position = await this.getPositionWithRetries();
            this.handlePositionUpdate(position);

            // Start watching position with optimized settings for background tracking
            const watchOptions = {
                enableHighAccuracy: true,
                timeout: 30000, // 30 seconds timeout
                maximumAge: 5000 // 5 seconds max age for fresher data
            };
            console.log('📍 Starting watchPosition with options:', watchOptions);
            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    console.log('📍 WatchPosition success:', position.coords);
                    this.handlePositionUpdate(position);
                },
                (error) => {
                    console.log('📍 WatchPosition error:', error.code, error.message);
                    this.handleError(error);
                },
                watchOptions
            );

            console.log('📍 Geolocation tracking started (watching GPS)');
        } catch (fallbackError) {
            console.log('📍 getPositionWithRetries failed:', fallbackError);
            this.handleError(fallbackError);
        }
    }

    getCurrentPosition(options) {
        const defaultOptions = {
            enableHighAccuracy: false,
            timeout: 30000,  // 30 seconds default
            maximumAge: 10000
        };
        const safeOptions = (options && typeof options === 'object') ? { ...defaultOptions, ...options } : defaultOptions;
        return new Promise((resolve, reject) => {
            try {
                navigator.geolocation.getCurrentPosition(resolve, reject, safeOptions);
            } catch (e) {
                reject(e);
            }
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

    // Try multiple strategies before giving up
    async getPositionWithRetries() {
        // Attempt 1: high accuracy
        try {
            return await this.getHighAccuracyPosition();
        } catch (e1) {
            console.log('📍 High accuracy attempt failed:', e1?.message || e1);
        }

        // Attempt 2: standard accuracy, longer timeout
        try {
            return await this.getCurrentPosition({
                enableHighAccuracy: false,
                timeout: 45000,
                maximumAge: 10000
            });
        } catch (e2) {
            console.log('📍 Standard accuracy attempt failed:', e2?.message || e2);
        }

        // Attempt 3: very relaxed timeout, accept cached
        return await this.getCurrentPosition({
            enableHighAccuracy: false,
            timeout: 60000,
            maximumAge: 30000
        });
    }

    handlePositionUpdate(position) {
        // Validate position object structure
        if (!position || !position.coords) {
            console.error('Invalid position object received:', position);
            return;
        }
        
        // Skip updates if location updates are paused
        if (this.locationUpdatesPaused) {
            console.log('📍 Location update skipped - updates are paused');
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
        
        // Update fallback position with the new valid position
        this.updateFallbackPosition();
        
        // Update quest marker position if investigation system is available
        if (window.eldritchApp && window.eldritchApp.systems.investigation) {
            window.eldritchApp.systems.investigation.updateQuestMarkerPosition();
        }

        // Update device location display
        this.updateDeviceLocationDisplay(
            `${newPosition.lat.toFixed(6)}, ${newPosition.lng.toFixed(6)}`,
            newPosition.accuracy ? `${newPosition.accuracy.toFixed(1)}m` : 'unknown'
        );
        
        // Update header display
        this.updateHeaderDisplay(newPosition);

        this.updateAccuracyDisplay();
        
        // Trigger map and quest initialization on first successful location
        if (this.isFirstLocation) {
            this.isFirstLocation = false;
            this.initializeMapAndQuests(newPosition);
            
            // Mobile-specific: Ensure map centers on player immediately and with retries
            this.ensureMapCenteredOnPlayer(newPosition);
            
            // Additional centering attempts for mobile reliability
            setTimeout(() => {
                this.ensureMapCenteredOnPlayer(newPosition);
            }, 1000);
            
            setTimeout(() => {
                this.ensureMapCenteredOnPlayer(newPosition);
            }, 3000);
        }
        
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
        
        // Handle permission denied gracefully without redirecting
        if (error.code === error.PERMISSION_DENIED) {
            console.log('📍 Geolocation permission denied - continuing without location services');
            // Don't redirect to welcome screen - let the game continue with fallback position
            return;
        }
        
        // Don't stop tracking on timeout errors - keep trying
        if (error.code === error.TIMEOUT) {
            console.log('📍 Geolocation timeout - will retry in background...');
            // Soft retry without blocking UI after a short delay
            setTimeout(() => {
                this.getCurrentPosition({
                    enableHighAccuracy: false,
                    timeout: 60000,
                    maximumAge: 30000
                }).then((pos) => this.handlePositionUpdate(pos)).catch((retryError) => {
                    console.log('📍 Background retry also failed:', retryError.message);
                });
            }, 2000); // Wait 2 seconds before retry
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
        const accuracyDisplay = document.getElementById('accuracy-display-header');
        if (!this.currentPosition) {
            if (accuracyDisplay) accuracyDisplay.textContent = 'Accuracy: --';
            return;
        }
        const accuracy = this.currentPosition.accuracy;
        let displayText = 'Accuracy: --';
        if (accuracy === null || accuracy === undefined) {
            displayText = 'Accuracy: unknown';
        } else {
            if (accuracy <= 10) {
                displayText = `Accuracy: ${Math.round(accuracy)}m`;
            } else if (accuracy <= 1100) {
                displayText = `Accuracy: ${Math.round(accuracy)}m`;
            } else {
                displayText = `Accuracy: ${Math.round(accuracy)}m`;
            }
            // Low-accuracy banner
            try {
                if (accuracy > this.accuracyThreshold) {
                    if (!this.shownLowAccuracyNotice && window.notificationCenter) {
                        window.notificationCenter.showBanner('Location accuracy low — using current best fix', 'warning');
                        this.shownLowAccuracyNotice = true;
                    }
                } else {
                    // Reset so we can notify again later if accuracy degrades
                    this.shownLowAccuracyNotice = false;
                }
            } catch (_) {}
        }
        if (accuracyDisplay) {
            accuracyDisplay.textContent = displayText;
            // Color hint
            if (accuracy !== null && accuracy !== undefined) {
                const good = accuracy <= this.accuracyThreshold;
                accuracyDisplay.style.color = good ? '#10b981' : '#f59e0b';
            }
        }
        // Emit accuracy change event
        if (this.onAccuracyChange) {
            this.onAccuracyChange(accuracy);
        }
    }

    updateUI() {
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn) {
            if (this.isTracking) {
                locateBtn.innerHTML = '<span class="btn-icon">⏹️</span><span class="btn-text">STOP</span><span class="btn-status" id="locate-status">Tracking</span>';
                locateBtn.classList.add('tracking');
            } else {
                locateBtn.innerHTML = '<span class="btn-icon">📍</span><span class="btn-text">LOCATE</span><span class="btn-status" id="locate-status">GPS Ready</span>';
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
            console.log('📍 Using valid cached position:', this.currentPosition);
            return this.currentPosition;
        }
        
        // Log why we're using fallback
        console.log('📍 No valid position available. Current position:', this.currentPosition ? 
            `lat: ${this.currentPosition.lat || this.currentPosition.coords?.latitude}, lng: ${this.currentPosition.lng || this.currentPosition.coords?.longitude}` : 
            'null');
        console.log('📍 Is tracking:', this.isTracking);
        console.log('📍 Device GPS enabled:', this.deviceGPSEnabled);
        
        // Fallback to fixed position if no GPS available
        if (this.fixedPosition) {
            // Update fallback position with last known position if available
            this.updateFallbackPosition();
            
            console.log('📍 Using fallback position:', `lat: ${this.fixedPosition.lat}, lng: ${this.fixedPosition.lng}`);
            return {
                lat: this.fixedPosition.lat,
                lng: this.fixedPosition.lng,
                accuracy: (this.lastValidPosition && this.lastValidPosition.accuracy) ? this.lastValidPosition.accuracy : null,
                timestamp: Date.now()
            };
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
        
        // Update quest distance
        this.updateQuestDistance();
    }
    
    // Set target quest location for distance tracking
    setTargetQuestLocation(lat, lng, questName = 'Quest') {
        this.targetQuestLocation = { lat, lng, name: questName };
        console.log('📍 Set target quest location:', { lat, lng, name: questName });
        this.updateQuestDistance();
    }
    
    // Clear target quest location
    clearTargetQuestLocation() {
        this.targetQuestLocation = null;
        console.log('📍 Cleared target quest location');
        this.updateQuestDistance();
    }
    
    // Update quest distance display
    updateQuestDistance() {
        if (!this.deviceLocationDisplay) return;
        
        const questDistanceElement = this.deviceLocationDisplay.querySelector('.quest-distance-value');
        if (!questDistanceElement) return;
        
        // Get current player position
        const playerPosition = this.getCurrentPositionSafe();
        if (!playerPosition) {
            questDistanceElement.textContent = 'No position';
            return;
        }
        
        // Use target quest location if set, otherwise use Questionable Sanity quest location
        let questLat, questLng, questName;
        if (this.targetQuestLocation) {
            questLat = this.targetQuestLocation.lat;
            questLng = this.targetQuestLocation.lng;
            questName = this.targetQuestLocation.name;
        } else {
            // Default quest start location (Questionable Sanity quest)
            questLat = 61.472768; // User's known location
            questLng = 23.724032;
            questName = 'Questionable Sanity';
        }
        
        // Calculate distance
        const distance = this.calculateDistance(
            playerPosition.lat, playerPosition.lng,
            questLat, questLng
        );
        
        // Update display with color coding
        questDistanceElement.textContent = `${distance.toFixed(0)}m`;
        
        // Update quest label to show which quest is being tracked
        const questLabelElement = this.deviceLocationDisplay.querySelector('.quest-label');
        if (questLabelElement) {
            questLabelElement.textContent = `🎭 ${questName}:`;
        }
        
        // Color code based on distance
        if (distance <= 50) {
            questDistanceElement.style.color = '#00ff00'; // Green - within trigger range
        } else if (distance <= 100) {
            questDistanceElement.style.color = '#ffaa00'; // Orange - getting close
        } else {
            questDistanceElement.style.color = '#ff6b6b'; // Red - far away
        }
        
        console.log(`📍 Quest distance to ${questName}: ${distance.toFixed(0)}m`);
    }
    
    // Pause location updates (e.g., during simulated movement)
    pauseLocationUpdates() {
        this.locationUpdatesPaused = true;
        console.log('📍 Location updates paused');
    }
    
    // Resume location updates (e.g., when Locate Me is clicked)
    resumeLocationUpdates() {
        this.locationUpdatesPaused = false;
        console.log('📍 Location updates resumed');
        // Refresh display with current position
        this.refreshLocationDisplay();
    }
    
    // Check if location updates are paused
    isLocationUpdatesPaused() {
        return this.locationUpdatesPaused;
    }
    
    // Update fallback position with last known position
    updateFallbackPosition() {
        if (this.lastValidPosition) {
            this.fixedPosition = {
                lat: this.lastValidPosition.lat,
                lng: this.lastValidPosition.lng
            };
            console.log('📍 Updated fallback position to last known position:', `lat: ${this.fixedPosition.lat}, lng: ${this.fixedPosition.lng}`);
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

    // Get current accuracy
    getCurrentAccuracy() {
        if (this.currentPosition && this.currentPosition.accuracy !== null) {
            return this.currentPosition.accuracy;
        }
        return null;
    }

    // Check if device GPS is enabled
    isDeviceGPSEnabled() {
        return this.deviceGPSEnabled;
    }
    
    // Update header display with current position
    updateHeaderDisplay(position) {
        const locationDisplay = document.getElementById('location-display-header');
        const accuracyDisplay = document.getElementById('accuracy-display-header');
        
        if (locationDisplay) {
            locationDisplay.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
        }
        
        if (accuracyDisplay) {
            const accuracy = position.accuracy ? `${position.accuracy.toFixed(1)}m` : 'Unknown';
            accuracyDisplay.textContent = `Accuracy: ${accuracy}`;
        }
    }
    
    // Initialize map and quest systems on first successful location
    initializeMapAndQuests(position) {
        console.log('📍 Initializing map and quest systems with position:', position);
        
        // Initialize quest system if available
        if (window.unifiedQuestSystem) {
            console.log('📍 Initializing quest system...');
            window.unifiedQuestSystem.beginAfterLocate();
        }
        
        // Initialize map engine if available
        if (window.mapEngine) {
            console.log('📍 Initializing map engine...');
            if (typeof window.mapEngine.initializeWithPosition === 'function') {
                window.mapEngine.initializeWithPosition(position);
            } else {
                console.log('📍 Map engine initializeWithPosition not available, using updatePlayerPosition');
                window.mapEngine.updatePlayerPosition(position);
            }
        }
        
        // Initialize encounter system if available
        if (window.encounterSystem) {
            console.log('📍 Initializing encounter system...');
            window.encounterSystem.checkProximityEncounters();
        }
    }
    
    // Mobile-specific: Ensure map is centered on player
    ensureMapCenteredOnPlayer(position) {
        console.log('📍 Ensuring map is centered on player...');
        
        // Try multiple methods to center the map
        if (window.mapEngine && window.mapEngine.map) {
            const map = window.mapEngine.map;
            const currentCenter = map.getCenter();
            const distance = this.calculateDistance(
                { lat: currentCenter.lat, lng: currentCenter.lng },
                position
            );
            
            console.log('📍 Map centering check:', {
                currentCenter: { lat: currentCenter.lat, lng: currentCenter.lng },
                playerPosition: { lat: position.lat, lng: position.lng },
                distance: distance.toFixed(2) + 'm'
            });
            
            // Mobile-specific: Always center on player for first location or if far away
            const shouldCenter = this.isFirstLocation || distance > 50; // Reduced threshold for mobile
            
            if (shouldCenter) {
                console.log('📍 Recentering map on player - mobile centering');
                
                // Use smooth pan for better mobile experience
                map.setView([position.lat, position.lng], 18, {
                    animate: true,
                    duration: 1.0,
                    easeLinearity: 0.25
                });
                
                // Double-check after centering with longer delay for mobile
                setTimeout(() => {
                    const newCenter = map.getCenter();
                    const newDistance = this.calculateDistance(
                        { lat: newCenter.lat, lng: newCenter.lng },
                        position
                    );
                    console.log('📍 Map centering result:', {
                        newCenter: { lat: newCenter.lat, lng: newCenter.lng },
                        distance: newDistance.toFixed(2) + 'm',
                        success: newDistance < 100
                    });
                    
                    // If still not centered, try again with force
                    if (newDistance > 100) {
                        console.log('📍 Map still not centered, forcing center...');
                        map.setView([position.lat, position.lng], 18, {
                            animate: false
                        });
                    }
                }, 500);
            } else {
                console.log('📍 Map is already centered on player');
            }
        } else {
            console.warn('📍 Map engine or map not available for centering');
            
            // Try alternative centering methods
            if (window.mapEngine) {
                console.log('📍 Trying alternative centering methods...');
                // Force map engine to update player position
                if (typeof window.mapEngine.updatePlayerPosition === 'function') {
                    window.mapEngine.updatePlayerPosition(position);
                }
            }
        }
    }

    // Cleanup
    destroy() {
        this.stopTracking();
        this.disableSimulator();
    }
}

// Export for use in other modules
window.GeolocationManager = GeolocationManager;
