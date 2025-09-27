/**
 * GeolocationLayer - Handles GPS data and coordinate management
 * 
 * This layer handles:
 * - GPS permission requests and management
 * - Location tracking and position updates
 * - Coordinate conversion and validation
 * - Location-based event emission
 * 
 * Z-Index: 10 (above all other layers)
 */

// Prevent duplicate class declaration
if (typeof window.GeolocationLayer !== 'undefined') {
    console.warn('⚠️ GeolocationLayer already exists, skipping duplicate declaration');
} else {

class GeolocationLayer extends BaseLayer {
    constructor() {
        super('geolocation');
        this.zIndex = 10;
        
        // Geolocation state
        this.isTracking = false;
        this.currentPosition = null;
        this.watchId = null;
        this.permissionGranted = false;
        this.permissionDenied = false;
        
        // Location settings
        this.options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        };
        
        // Event listeners
        this.boundPermissionGranted = this.handlePermissionGranted.bind(this);
        this.boundPermissionDenied = this.handlePermissionDenied.bind(this);
        this.boundLocationUpdate = this.handleLocationUpdate.bind(this);
        this.boundLocationError = this.handleLocationError.bind(this);
    }

    init() {
        super.init();
        console.log('📍 STEP 5.14.1: GeolocationLayer: Initializing...');
        
        // Check if geolocation is supported
        if (!navigator.geolocation) {
            console.error('📍 STEP 5.14.2 ❌: GeolocationLayer: Geolocation not supported');
            this.showGeolocationError('Geolocation is not supported by this browser');
            return;
        }
        console.log('📍 STEP 5.14.2 ✓: Geolocation supported');
        
        // Set up event listeners
        console.log('📍 STEP 5.14.3: Setting up event listeners...');
        this.setupEventListeners();
        console.log('📍 STEP 5.14.4 ✓: Event listeners set up');
        
        // Check existing permission status
        console.log('📍 STEP 5.14.5: Checking permission status...');
        this.checkPermissionStatus();
        console.log('📍 STEP 5.14.6 ✓: Permission status checked');
        
        // Add fallback for testing - if no response in 20 seconds, show error
        setTimeout(() => {
            if (!this.permissionGranted && !this.permissionDenied) {
                console.log('📍 STEP GPS.FALLBACK: No permission response, showing fallback');
                this.showGeolocationError('Location permission not received. Please check your browser settings and try again.');
            }
        }, 20000);
        
        console.log('📍 STEP 5.14.7 ✓: GeolocationLayer: Initialized');
    }

    setupEventListeners() {
        console.log('📍 GeolocationLayer: Setting up event listeners...');
        
        // Listen for GPS button clicks
        if (this.eventBus) {
            console.log('📍 GeolocationLayer: EventBus available, registering listeners...');
            this.eventBus.on('gps:request', this.handleGPSRequest.bind(this));
            this.eventBus.on('gps:start', this.startTracking.bind(this));
            this.eventBus.on('gps:stop', this.stopTracking.bind(this));
            console.log('📍 GeolocationLayer: Event listeners registered');
            
            // Test event bus connection
            this.eventBus.emit('geolocation:test', { message: 'GeolocationLayer event bus test' });
            console.log('📍 GeolocationLayer: Test event emitted');
            
            // Test direct event emission
            setTimeout(() => {
                console.log('📍 GeolocationLayer: Testing direct event emission...');
                this.eventBus.emit('gps:request');
            }, 1000);
        } else {
            console.error('📍 GeolocationLayer: No eventBus available!');
        }
    }

    checkPermissionStatus() {
        // Check if we already have permission
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                if (result.state === 'granted') {
                    this.permissionGranted = true;
                    this.startTracking();
                } else if (result.state === 'denied') {
                    this.permissionDenied = true;
                    this.showGeolocationError('Location access denied. Please enable location services in your browser settings.');
                }
            }).catch((error) => {
                console.warn('📍 GeolocationLayer: Permission check failed:', error);
            });
        }
    }

    handleGPSRequest() {
        console.log('📍 STEP GPS.REQUEST: GeolocationLayer: GPS request received!');
        console.log('📍 STEP GPS.REQUEST: EventBus available:', !!this.eventBus);
        console.log('📍 STEP GPS.REQUEST: GeolocationLayer state:', {
            isTracking: this.isTracking,
            permissionGranted: this.permissionGranted,
            permissionDenied: this.permissionDenied
        });
        this.requestLocationPermission();
    }

    requestLocationPermission() {
        console.log('📍 STEP GPS.PERMISSION: Requesting location permission...');
        
        // Show loading state
        this.showGeolocationLoading();
        
        // Add timeout to handle cases where permission dialog doesn't respond
        const timeoutId = setTimeout(() => {
            console.log('📍 STEP GPS.TIMEOUT: Permission request timed out');
            this.handlePermissionDenied({
                code: 3, // TIMEOUT
                message: 'Permission request timed out'
            });
        }, 15000); // 15 second timeout
        
        // Request current position to trigger permission dialog
        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                console.log('📍 STEP GPS.SUCCESS: Permission granted, position received');
                this.boundPermissionGranted(position);
            },
            (error) => {
                clearTimeout(timeoutId);
                console.log('📍 STEP GPS.ERROR: Permission denied or error:', error);
                this.boundPermissionDenied(error);
            },
            this.options
        );
    }

    handlePermissionGranted(position) {
        console.log('📍 GeolocationLayer: Permission granted');
        this.permissionGranted = true;
        this.permissionDenied = false;
        
        // Update position
        this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
        };
        
        // Hide loading and show success
        this.hideGeolocationLoading();
        this.showGeolocationSuccess();
        
        // Start continuous tracking
        this.startTracking();
        
        // Emit events
        if (this.eventBus) {
            this.eventBus.emit('geolocation:permission:granted', this.currentPosition);
            this.eventBus.emit('geolocation:position:update', this.currentPosition);
        }
    }

    handlePermissionDenied(error) {
        console.log('📍 STEP GPS.DENIED: Permission denied or error:', error);
        this.permissionDenied = true;
        this.permissionGranted = false;
        
        // Hide loading and show error
        this.hideGeolocationLoading();
        
        let errorMessage = 'Location access denied.';
        switch (error.code) {
            case 1: // PERMISSION_DENIED
                errorMessage = 'Location access denied. Please enable location services and refresh the page.';
                break;
            case 2: // POSITION_UNAVAILABLE
                errorMessage = 'Location information is unavailable.';
                break;
            case 3: // TIMEOUT
                errorMessage = 'Location request timed out. Please try again.';
                break;
            default:
                errorMessage = error.message || 'Location access failed. Please try again.';
                break;
        }
        
        this.showGeolocationError(errorMessage);
        
        // Emit event
        if (this.eventBus) {
            this.eventBus.emit('geolocation:permission:denied', { error: error.message });
        }
    }

    startTracking() {
        if (this.isTracking) {
            console.log('📍 GeolocationLayer: Already tracking');
            return;
        }
        
        if (!this.permissionGranted) {
            console.log('📍 GeolocationLayer: Permission not granted, requesting...');
            this.requestLocationPermission();
            return;
        }
        
        console.log('📍 GeolocationLayer: Starting location tracking...');
        this.isTracking = true;
        
        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
            this.boundLocationUpdate,
            this.boundLocationError,
            this.options
        );
        
        // Emit event
        if (this.eventBus) {
            this.eventBus.emit('geolocation:tracking:started');
        }
    }

    stopTracking() {
        if (!this.isTracking) {
            return;
        }
        
        console.log('📍 GeolocationLayer: Stopping location tracking...');
        this.isTracking = false;
        
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        // Emit event
        if (this.eventBus) {
            this.eventBus.emit('geolocation:tracking:stopped');
        }
    }

    handleLocationUpdate(position) {
        this.currentPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed,
            heading: position.coords.heading,
            timestamp: position.timestamp
        };
        
        console.log('📍 GeolocationLayer: Position updated:', {
            lat: this.currentPosition.latitude.toFixed(6),
            lng: this.currentPosition.longitude.toFixed(6),
            accuracy: this.currentPosition.accuracy
        });
        
        // Emit event
        if (this.eventBus) {
            this.eventBus.emit('geolocation:position:update', this.currentPosition);
        }
    }

    handleLocationError(error) {
        console.error('📍 GeolocationLayer: Location error:', error);
        
        // Emit event
        if (this.eventBus) {
            this.eventBus.emit('geolocation:error', { error: error.message });
        }
    }

    showGeolocationLoading() {
        // Show loading state in UI
        const button = document.querySelector('[data-action="gps-tracking"]');
        if (button) {
            button.textContent = 'Requesting GPS...';
            button.disabled = true;
        }
    }

    hideGeolocationLoading() {
        // Hide loading state
        const button = document.querySelector('[data-action="gps-tracking"]');
        if (button) {
            button.disabled = false;
        }
    }

    showGeolocationSuccess() {
        console.log('📍 STEP GPS.1: Showing geolocation success...');
        
        // Show success state for canvas button
        const button = document.querySelector('[data-action="gps-tracking"]');
        if (button) {
            button.textContent = 'GPS Active ✓';
            button.style.backgroundColor = '#00ff00';
            button.style.color = '#000';
        }
        
        // Update welcome screen GPS status
        const gpsStatusTitle = document.getElementById('gps-status-title');
        const gpsStatusMessage = document.getElementById('gps-status-message');
        const enableGpsBtn = document.getElementById('enable-gps-btn');
        
        if (gpsStatusTitle) {
            gpsStatusTitle.textContent = 'GPS Enabled Successfully!';
        }
        if (gpsStatusMessage) {
            gpsStatusMessage.textContent = 'Location tracking is now active. You can continue your adventure.';
        }
        if (enableGpsBtn) {
            enableGpsBtn.textContent = '✓ GPS Active';
            enableGpsBtn.style.backgroundColor = '#00ff00';
            enableGpsBtn.style.color = '#000';
        }
        
        // Enable game buttons
        this.enableGameButtons();
        
        // Hide the GPS permission dialog
        this.hideGPSDialog();
        
        console.log('📍 STEP GPS.2 ✓: Geolocation success UI updated');
    }

    showGeolocationError(message) {
        console.log('📍 STEP GPS.ERROR: Showing geolocation error...');
        
        // Show error state for canvas button
        const button = document.querySelector('[data-action="gps-tracking"]');
        if (button) {
            button.textContent = 'GPS Error';
            button.style.backgroundColor = '#ff0000';
            button.style.color = '#fff';
        }
        
        // Update welcome screen GPS status
        const gpsStatusTitle = document.getElementById('gps-status-title');
        const gpsStatusMessage = document.getElementById('gps-status-message');
        const enableGpsBtn = document.getElementById('enable-gps-btn');
        
        if (gpsStatusTitle) {
            gpsStatusTitle.textContent = 'GPS Error';
        }
        if (gpsStatusMessage) {
            gpsStatusMessage.textContent = message;
        }
        if (enableGpsBtn) {
            enableGpsBtn.textContent = '❌ GPS Error';
            enableGpsBtn.style.backgroundColor = '#ff0000';
            enableGpsBtn.style.color = '#fff';
        }
        
        // Show error message
        console.error('📍 GeolocationLayer:', message);
        alert(message);
        
        console.log('📍 STEP GPS.ERROR ✓: Error UI updated');
    }

    hideGPSDialog() {
        // Hide the GPS permission dialog
        const dialog = document.querySelector('.gps-dialog, .location-dialog, [data-dialog="gps"]');
        if (dialog) {
            dialog.style.display = 'none';
        }
        
        // Remove any GPS-related overlays
        const overlays = document.querySelectorAll('.gps-overlay, .location-overlay');
        overlays.forEach(overlay => overlay.remove());
    }

    enableGameButtons() {
        console.log('📍 STEP GPS.3: Enabling game buttons...');
        
        // Enable continue adventure button
        const continueBtn = document.getElementById('continue-adventure');
        if (continueBtn) {
            continueBtn.disabled = false;
            continueBtn.textContent = '🔄 Continue Adventure';
            console.log('📍 STEP GPS.4 ✓: Continue adventure button enabled');
        }
        
        // Show game actions section
        const gameActionsSection = document.getElementById('game-actions-section');
        if (gameActionsSection) {
            gameActionsSection.style.display = 'block';
            console.log('📍 STEP GPS.5 ✓: Game actions section shown');
        }
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('gps:enabled');
            console.log('📍 STEP GPS.6 ✓: GPS enabled event emitted');
        }
    }

    getCurrentPosition() {
        return this.currentPosition;
    }

    isLocationAvailable() {
        return this.permissionGranted && this.currentPosition !== null;
    }

    doRender(deltaTime) {
        if (!this.ctx) return;
        
        // Render location indicator if available
        if (this.isLocationAvailable()) {
            this.renderLocationIndicator();
        }
    }

    renderLocationIndicator() {
        // Render a small location indicator on the canvas
        const ctx = this.ctx;
        const canvas = this.canvas;
        
        // Position indicator in top-right corner
        const x = canvas.width - 60;
        const y = 20;
        const radius = 8;
        
        // Draw location dot
        ctx.save();
        ctx.fillStyle = '#00ff00';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Draw pulsing effect
        const pulseRadius = radius + Math.sin(Date.now() * 0.005) * 3;
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    destroy() {
        console.log('📍 GeolocationLayer: Destroying...');
        
        // Stop tracking
        this.stopTracking();
        
        // Remove event listeners
        if (this.eventBus) {
            this.eventBus.off('gps:request', this.handleGPSRequest);
            this.eventBus.off('gps:start', this.startTracking);
            this.eventBus.off('gps:stop', this.stopTracking);
        }
        
        console.log('📍 GeolocationLayer: Destroyed');
    }
}

// Export for use in other modules
window.GeolocationLayer = GeolocationLayer;

} // End of duplicate check
