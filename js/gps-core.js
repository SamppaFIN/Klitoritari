/**
 * GPS Core System - Complete Rewrite
 * Created by: 🏗️ Nova + 💻 Codex + 🧪 Testa + 🔍 Veritas + 📊 Sage + 🌸 Aurora
 * Purpose: Single source of truth for GPS functionality
 * Status: [SACRED] - Complete rewrite, do not modify without expert approval
 */

class GPSCore {
    constructor() {
        this.instanceId = 'gps-core-' + Date.now();
        this.state = {
            initialized: false,
            permission: 'unknown', // unknown, granted, denied, prompt
            tracking: false,
            position: null,
            lastValidPosition: null,
            accuracy: null,
            error: null
        };
        
        this.config = {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 5000,
            retryAttempts: 3,
            retryDelay: 2000,
            fallbackLocation: { lat: 61.2925, lng: 23.7153, name: 'Härmälä, Finland' }
        };
        
        this.eventListeners = new Map();
        this.watchId = null;
        this.retryCount = 0;
        
        console.log('🌍 GPS Core System initialized:', this.instanceId);
        this.init();
    }
    
    init() {
        console.log('🌍 GPS Core: Starting initialization...');
        
        // Check browser support
        if (!navigator.geolocation) {
            this.handleError('Geolocation not supported by this browser');
            return;
        }
        
        // Setup permission monitoring
        this.setupPermissionMonitoring();
        
        // Setup UI event listeners
        this.setupUIEventListeners();
        
        // Load last known position
        this.loadLastKnownPosition();
        
        this.state.initialized = true;
        console.log('🌍 GPS Core: Initialization complete');
        
        // Emit ready event
        this.emit('gps:ready');
    }
    
    setupPermissionMonitoring() {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((result) => {
                this.state.permission = result.state;
                console.log('🌍 GPS Core: Initial permission state:', this.state.permission);
                
                result.onchange = () => {
                    this.state.permission = result.state;
                    console.log('🌍 GPS Core: Permission changed to:', this.state.permission);
                    this.handlePermissionChange(result.state);
                };
            }).catch((error) => {
                console.warn('🌍 GPS Core: Could not query permission:', error);
                this.state.permission = 'unknown';
            });
        }
    }
    
    setupUIEventListeners() {
        // Locate Me button
        const locateBtn = document.getElementById('locate-me-btn');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                console.log('🌍 GPS Core: Locate Me button clicked');
                this.requestLocation();
            });
        }
        
        // Header location button
        const headerLocationBtn = document.getElementById('location-btn');
        if (headerLocationBtn) {
            headerLocationBtn.addEventListener('click', () => {
                console.log('🌍 GPS Core: Header location button clicked');
                this.requestLocation();
            });
        }
    }
    
    loadLastKnownPosition() {
        try {
            const stored = localStorage.getItem('gps_last_position');
            if (stored) {
                const position = JSON.parse(stored);
                const age = Date.now() - position.timestamp;
                
                // Use if less than 1 hour old
                if (age < 3600000) {
                    this.state.lastValidPosition = position;
                    console.log('🌍 GPS Core: Loaded last known position:', position);
                }
            }
        } catch (error) {
            console.warn('🌍 GPS Core: Failed to load last known position:', error);
        }
    }
    
    savePosition(position) {
        try {
            const positionData = {
                lat: position.lat,
                lng: position.lng,
                accuracy: position.accuracy,
                timestamp: Date.now()
            };
            
            localStorage.setItem('gps_last_position', JSON.stringify(positionData));
            console.log('🌍 GPS Core: Position saved to storage');
        } catch (error) {
            console.warn('🌍 GPS Core: Failed to save position:', error);
        }
    }
    
    async requestLocation() {
        console.log('🌍 GPS Core: Requesting location...');
        
        if (this.state.tracking) {
            console.log('🌍 GPS Core: Already tracking, stopping...');
            this.stopTracking();
            return;
        }
        
        this.state.tracking = true;
        this.state.error = null;
        this.retryCount = 0;
        
        this.updateUI('requesting');
        this.emit('gps:requesting');
        
        try {
            // Request permission and get position
            const position = await this.getCurrentPosition();
            this.handlePositionSuccess(position);
        } catch (error) {
            this.handlePositionError(error);
        }
    }
    
    async getCurrentPosition() {
        return new Promise((resolve, reject) => {
            console.log('🌍 GPS Core: Getting current position...');
            
            const options = {
                enableHighAccuracy: this.config.enableHighAccuracy,
                timeout: this.config.timeout,
                maximumAge: this.config.maximumAge
            };
            
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('🌍 GPS Core: Position acquired:', position.coords);
                    resolve(this.normalizePosition(position));
                },
                (error) => {
                    console.error('🌍 GPS Core: Position error:', error);
                    reject(error);
                },
                options
            );
        });
    }
    
    startTracking() {
        if (this.watchId !== null) {
            console.log('🌍 GPS Core: Already watching position');
            return;
        }
        
        console.log('🌍 GPS Core: Starting position tracking...');
        
        const options = {
            enableHighAccuracy: this.config.enableHighAccuracy,
            timeout: this.config.timeout,
            maximumAge: this.config.maximumAge
        };
        
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                console.log('🌍 GPS Core: Position update:', position.coords);
                this.handlePositionSuccess(this.normalizePosition(position));
            },
            (error) => {
                console.error('🌍 GPS Core: Tracking error:', error);
                this.handlePositionError(error);
            },
            options
        );
        
        this.state.tracking = true;
        this.updateUI('tracking');
        this.emit('gps:tracking:started');
    }
    
    stopTracking() {
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
            console.log('🌍 GPS Core: Position tracking stopped');
        }
        
        this.state.tracking = false;
        this.updateUI('ready');
        this.emit('gps:tracking:stopped');
    }
    
    normalizePosition(position) {
        return {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp || Date.now()
        };
    }
    
    handlePositionSuccess(position) {
        console.log('🌍 GPS Core: Position success:', {
            lat: position.lat.toFixed(6),
            lng: position.lng.toFixed(6),
            accuracy: position.accuracy ? `${position.accuracy.toFixed(1)}m` : 'unknown'
        });
        
        // Validate coordinates
        if (!this.isValidCoordinates(position.lat, position.lng)) {
            console.error('🌍 GPS Core: Invalid coordinates received:', position);
            this.handlePositionError({ code: 2, message: 'Invalid coordinates' });
            return;
        }
        
        // Update state
        this.state.position = position;
        this.state.lastValidPosition = position;
        this.state.accuracy = position.accuracy;
        this.state.error = null;
        this.retryCount = 0;
        
        // Save position
        this.savePosition(position);
        
        // Update UI
        this.updateUI('success');
        this.updateLocationDisplay(position);
        
        // Emit events
        this.emit('gps:position:updated', position);
        this.emit('gps:success', position);
        
        // Initialize map and quests on first successful location
        if (!this.state.lastValidPosition || this.isFirstLocation()) {
            this.initializeMapAndQuests(position);
        }
    }
    
    handlePositionError(error) {
        console.error('🌍 GPS Core: Position error:', error);
        
        this.state.error = error;
        this.state.tracking = false;
        
        let message = 'Unknown GPS error';
        let displayMessage = 'Error';
        
        switch (error.code) {
            case 1: // PERMISSION_DENIED
                message = 'Location access denied. Please enable location services.';
                displayMessage = 'Permission Denied';
                this.state.permission = 'denied';
                break;
            case 2: // POSITION_UNAVAILABLE
                message = 'Location information unavailable.';
                displayMessage = 'Unavailable';
                break;
            case 3: // TIMEOUT
                message = 'Location request timed out.';
                displayMessage = 'Timeout';
                break;
        }
        
        // Update UI
        this.updateUI('error');
        this.updateLocationDisplay(null, displayMessage);
        
        // Emit events
        this.emit('gps:error', { code: error.code, message: message });
        
        // Handle retry logic
        if (error.code === 3 && this.retryCount < this.config.retryAttempts) {
            this.retryCount++;
            console.log(`🌍 GPS Core: Retrying (${this.retryCount}/${this.config.retryAttempts})...`);
            
            setTimeout(() => {
                this.requestLocation();
            }, this.config.retryDelay * this.retryCount);
        } else {
            // Use fallback position
            this.useFallbackPosition();
        }
    }
    
    useFallbackPosition() {
        console.log('🌍 GPS Core: Using fallback position');
        
        const fallbackPosition = {
            lat: this.config.fallbackLocation.lat,
            lng: this.config.fallbackLocation.lng,
            accuracy: 1000,
            timestamp: Date.now(),
            isFallback: true
        };
        
        this.state.position = fallbackPosition;
        this.updateUI('fallback');
        this.updateLocationDisplay(fallbackPosition, 'Fallback');
        
        this.emit('gps:fallback', fallbackPosition);
        this.initializeMapAndQuests(fallbackPosition);
    }
    
    handlePermissionChange(newState) {
        console.log('🌍 GPS Core: Permission changed to:', newState);
        
        switch (newState) {
            case 'granted':
                this.state.permission = 'granted';
                this.emit('gps:permission:granted');
                break;
            case 'denied':
                this.state.permission = 'denied';
                this.emit('gps:permission:denied');
                this.useFallbackPosition();
                break;
            case 'prompt':
                this.state.permission = 'prompt';
                this.emit('gps:permission:prompt');
                break;
        }
    }
    
    isValidCoordinates(lat, lng) {
        return lat >= -90 && lat <= 90 && 
               lng >= -180 && lng <= 180 && 
               !isNaN(lat) && !isNaN(lng) && 
               isFinite(lat) && isFinite(lng);
    }
    
    isFirstLocation() {
        return !this.state.lastValidPosition;
    }
    
    updateUI(state) {
        const locateBtn = document.getElementById('locate-me-btn');
        if (!locateBtn) return;
        
        switch (state) {
            case 'requesting':
                locateBtn.innerHTML = '<span class="btn-icon">⏳</span><span class="btn-text">REQUESTING</span><span class="btn-status">Getting location...</span>';
                locateBtn.classList.add('requesting');
                break;
            case 'tracking':
                locateBtn.innerHTML = '<span class="btn-icon">📍</span><span class="btn-text">TRACKING</span><span class="btn-status">GPS Active</span>';
                locateBtn.classList.add('tracking');
                break;
            case 'success':
                locateBtn.innerHTML = '<span class="btn-icon">✅</span><span class="btn-text">LOCATED</span><span class="btn-status">Position Found</span>';
                locateBtn.classList.add('success');
                break;
            case 'error':
                locateBtn.innerHTML = '<span class="btn-icon">❌</span><span class="btn-text">ERROR</span><span class="btn-status">GPS Failed</span>';
                locateBtn.classList.add('error');
                break;
            case 'fallback':
                locateBtn.innerHTML = '<span class="btn-icon">🏠</span><span class="btn-text">FALLBACK</span><span class="btn-status">Using Default</span>';
                locateBtn.classList.add('fallback');
                break;
            default:
                locateBtn.innerHTML = '<span class="btn-icon">📍</span><span class="btn-text">LOCATE</span><span class="btn-status">GPS Ready</span>';
                locateBtn.classList.remove('requesting', 'tracking', 'success', 'error', 'fallback');
        }
    }
    
    updateLocationDisplay(position, status = null) {
        // Update device location display
        const locationDisplay = document.getElementById('device-location-display');
        if (locationDisplay) {
            const coordsElement = locationDisplay.querySelector('.location-coords');
            const accuracyElement = locationDisplay.querySelector('.accuracy-value');
            
            if (position) {
                if (coordsElement) coordsElement.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
                if (accuracyElement) accuracyElement.textContent = position.accuracy ? `${position.accuracy.toFixed(1)}m` : 'unknown';
            } else {
                if (coordsElement) coordsElement.textContent = status || 'No position';
                if (accuracyElement) accuracyElement.textContent = 'N/A';
            }
        }
        
        // Update header display
        const headerLocation = document.getElementById('location-display-header');
        const headerAccuracy = document.getElementById('accuracy-display-header');
        
        if (position) {
            if (headerLocation) headerLocation.textContent = `${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`;
            if (headerAccuracy) headerAccuracy.textContent = position.accuracy ? `Accuracy: ${position.accuracy.toFixed(1)}m` : 'Accuracy: unknown';
        } else {
            if (headerLocation) headerLocation.textContent = status || 'No position';
            if (headerAccuracy) headerAccuracy.textContent = 'Accuracy: N/A';
        }
    }
    
    initializeMapAndQuests(position) {
        console.log('🌍 GPS Core: Initializing map and quests with position:', position);
        
        // Initialize map engine
        if (window.mapEngine) {
            if (typeof window.mapEngine.initializeWithPosition === 'function') {
                window.mapEngine.initializeWithPosition(position);
            } else if (typeof window.mapEngine.updatePlayerPosition === 'function') {
                window.mapEngine.updatePlayerPosition(position);
            }
        }
        
        // Initialize quest system
        if (window.unifiedQuestSystem && typeof window.unifiedQuestSystem.beginAfterLocate === 'function') {
            window.unifiedQuestSystem.beginAfterLocate();
        }
        
        // Center map on player
        this.centerMapOnPlayer(position);
        
        this.emit('gps:map:initialized', position);
    }
    
    centerMapOnPlayer(position) {
        if (window.mapEngine && window.mapEngine.map) {
            const map = window.mapEngine.map;
            map.setView([position.lat, position.lng], 18, {
                animate: true,
                duration: 1.0,
                easeLinearity: 0.25
            });
            console.log('🌍 GPS Core: Map centered on player');
        }
    }
    
    // Event system
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const listeners = this.eventListeners.get(event);
            const index = listeners.indexOf(callback);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        }
    }
    
    emit(event, data = null) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('🌍 GPS Core: Event listener error:', error);
                }
            });
        }
        console.log(`🌍 GPS Core: Event emitted: ${event}`, data);
    }
    
    // Public API methods
    getCurrentPosition() {
        return this.state.position;
    }
    
    getLastValidPosition() {
        return this.state.lastValidPosition;
    }
    
    getPermissionState() {
        return this.state.permission;
    }
    
    getTrackingState() {
        return this.state.tracking;
    }
    
    getAccuracy() {
        return this.state.accuracy;
    }
    
    getError() {
        return this.state.error;
    }
    
    // Force permission request
    async requestPermission() {
        console.log('🌍 GPS Core: Requesting permission...');
        try {
            const position = await this.getCurrentPosition();
            console.log('🌍 GPS Core: Permission request successful, position:', position);
            return true;
        } catch (error) {
            console.error('🌍 GPS Core: Permission request failed:', error);
            return false;
        }
    }
    
    // Cleanup
    destroy() {
        this.stopTracking();
        this.eventListeners.clear();
        console.log('🌍 GPS Core: Destroyed');
    }
}

// Initialize GPS Core System
window.gpsCore = new GPSCore();

// Export for use in other modules
window.GPSCore = GPSCore;

console.log('🌍 GPS Core System loaded and initialized');
