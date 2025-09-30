/**
 * @fileoverview Enhanced Step Tracking System
 * @status [IN_DEVELOPMENT] - Multi-method step tracking with offline estimation
 * @feature #feature-enhanced-step-tracking
 * @feature #feature-offline-step-estimation
 * @feature #feature-google-fit-integration
 * @feature #feature-gyroscope-tracking
 * @bugfix #bug-pedometer-not-working
 * @last_updated 2025-01-29
 * @dependencies Geolocation, WebSocket, Base System
 * @warning Do not modify step calculation algorithms without testing all methods
 * 
 * Enhanced Step Tracking System
 * Provides multiple fallback methods for step counting when pedometer fails
 */

class EnhancedStepTracking {
    constructor() {
        this.instanceId = 'enhanced-step-tracking-' + Date.now();
        console.log('🚶‍♂️ Enhanced Step Tracking System initialized');
        
        // Step tracking methods
        this.trackingMethods = {
            PEDOMETER: 'pedometer',
            GPS_DISTANCE: 'gps_distance',
            GYROSCOPE: 'gyroscope',
            GOOGLE_FIT: 'google_fit',
            FALLBACK: 'fallback'
        };
        
        // Current active method
        this.activeMethod = null;
        // Prefer GPS distance by default, then fallbacks
        this.methodPriority = [
            this.trackingMethods.GPS_DISTANCE,
            this.trackingMethods.PEDOMETER,
            this.trackingMethods.GOOGLE_FIT,
            this.trackingMethods.GYROSCOPE,
            this.trackingMethods.FALLBACK
        ];
        
        // Step calculation data
        this.stepData = {
            totalSteps: 0,
            sessionSteps: 0,
            lastPosition: null,
            lastStepTime: 0,
            stepHistory: [],
            distanceTraveled: 0,
            estimatedSteps: 0
        };
        
        // Configuration
        this.config = {
            // GPS distance estimation
            averageStepLength: 0.7, // meters (adjustable based on user height)
            minDistanceForStep: 0.3, // minimum distance to count as step
            maxStepLength: 1.2, // maximum reasonable step length
            
            // Gyroscope detection
            gyroThreshold: 0.5, // sensitivity for step detection
            gyroCooldown: 500, // minimum time between gyro steps
            
            // Google Fit
            googleFitEnabled: false,
            googleFitClient: null,
            
            // Fallback mode
            fallbackStepInterval: 30000, // 30 seconds between fallback steps
            fallbackEnabled: true
        };
        
        // Tracking state
        this.isTracking = false;
        this.lastUpdateTime = 0;
        this.positionHistory = [];
        this.gyroData = [];
        
        // Callbacks
        this.onStepUpdate = null;
        this.onMethodChange = null;
        
        console.log('🚶‍♂️ Enhanced Step Tracking System ready');
    }
    
    /**
     * Initialize the enhanced step tracking system
     */
    async init() {
        console.log('🚶‍♂️ Initializing Enhanced Step Tracking System...');
        
        try {
            // Try each method in priority order
            for (const method of this.methodPriority) {
                console.log(`🚶‍♂️ Trying method: ${method}`);
                
                const success = await this.initializeMethod(method);
                if (success) {
                    this.activeMethod = method;
                    console.log(`🚶‍♂️ Successfully initialized method: ${method}`);
                    this.notifyMethodChange(method);
                    break;
                }
            }
            
            if (!this.activeMethod) {
                console.warn('🚶‍♂️ All methods failed, using fallback mode');
                this.activeMethod = this.trackingMethods.FALLBACK;
                this.initializeFallbackMode();
            }
            
            // Start tracking
            this.startTracking();
            
            console.log(`🚶‍♂️ Enhanced Step Tracking active with method: ${this.activeMethod}`);
            
        } catch (error) {
            console.error('🚶‍♂️ Error initializing Enhanced Step Tracking:', error);
            this.initializeFallbackMode();
        }
    }
    
    /**
     * Initialize a specific tracking method
     */
    async initializeMethod(method) {
        switch (method) {
            case this.trackingMethods.PEDOMETER:
                return this.initializePedometer();
                
            case this.trackingMethods.GOOGLE_FIT:
                return await this.initializeGoogleFit();
                
            case this.trackingMethods.GYROSCOPE:
                return this.initializeGyroscope();
                
            case this.trackingMethods.GPS_DISTANCE:
                return this.initializeGPSDistance();
                
            case this.trackingMethods.FALLBACK:
                return this.initializeFallbackMode();
                
            default:
                return false;
        }
    }
    
    /**
     * Initialize pedometer (device motion) tracking
     */
    initializePedometer() {
        console.log('🚶‍♂️ Initializing pedometer tracking...');
        
        if (!('DeviceMotionEvent' in window)) {
            console.log('🚶‍♂️ DeviceMotionEvent not supported');
            return false;
        }
        
        // Request permission for device motion
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.setupDeviceMotionListener();
                    return true;
                } else {
                    console.log('🚶‍♂️ Device motion permission denied');
                    return false;
                }
            });
        } else {
            this.setupDeviceMotionListener();
            return true;
        }
        
        return false; // Will be set to true in permission callback
    }
    
    /**
     * Setup device motion listener for pedometer
     */
    setupDeviceMotionListener() {
        let lastAcceleration = null;
        let stepCount = 0;
        
        window.addEventListener('devicemotion', (event) => {
            if (!this.isTracking) return;
            
            const acceleration = event.accelerationIncludingGravity;
            if (!acceleration) return;
            
            const currentAcceleration = {
                x: acceleration.x || 0,
                y: acceleration.y || 0,
                z: acceleration.z || 0,
                timestamp: Date.now()
            };
            
            if (lastAcceleration) {
                // Calculate acceleration magnitude change
                const deltaX = Math.abs(currentAcceleration.x - lastAcceleration.x);
                const deltaY = Math.abs(currentAcceleration.y - lastAcceleration.y);
                const deltaZ = Math.abs(currentAcceleration.z - lastAcceleration.z);
                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
                
                // Detect step based on acceleration pattern
                if (magnitude > 1.5 && (currentAcceleration.timestamp - this.stepData.lastStepTime) > 500) {
                    this.addStep('pedometer');
                    stepCount++;
                }
            }
            
            lastAcceleration = currentAcceleration;
        });
        
        console.log('🚶‍♂️ Device motion listener setup complete');
        return true;
    }
    
    /**
     * Initialize Google Fit integration
     */
    async initializeGoogleFit() {
        console.log('🚶‍♂️ Initializing Google Fit integration...');
        
        if (!window.gapi) {
            console.log('🚶‍♂️ Google API not loaded');
            return false;
        }
        
        try {
            // Load Google Fit API
            await new Promise((resolve, reject) => {
                gapi.load('client', async () => {
                    try {
                        await gapi.client.init({
                            apiKey: 'YOUR_API_KEY', // Replace with actual API key
                            discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/fitness/v1/rest']
                        });
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
            
            // Request authorization
            const authResult = await gapi.auth2.getAuthInstance().signIn({
                scope: 'https://www.googleapis.com/auth/fitness.activity.read'
            });
            
            if (authResult.isSignedIn()) {
                this.config.googleFitEnabled = true;
                this.setupGoogleFitListener();
                return true;
            } else {
                console.log('🚶‍♂️ Google Fit authorization failed');
                return false;
            }
            
        } catch (error) {
            console.log('🚶‍♂️ Google Fit initialization failed:', error);
            return false;
        }
    }
    
    /**
     * Setup Google Fit step counting
     */
    setupGoogleFitListener() {
        console.log('🚶‍♂️ Setting up Google Fit step counting...');
        
        // Poll Google Fit for step data every 30 seconds
        setInterval(async () => {
            if (!this.isTracking) return;
            
            try {
                const response = await gapi.client.fitness.users.dataset.aggregate({
                    userId: 'me',
                    requestBody: {
                        aggregateBy: [{
                            dataTypeName: 'com.google.step_count.delta',
                            dataSourceId: 'derived:com.google.step_count.delta:com.google.android.gms:estimated_steps'
                        }],
                        bucketByTime: {
                            durationMillis: 30000 // 30 seconds
                        },
                        startTimeMillis: Date.now() - 60000, // Last minute
                        endTimeMillis: Date.now()
                    }
                });
                
                const steps = response.result.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
                if (steps > 0) {
                    this.addSteps(steps, 'google_fit');
                }
                
            } catch (error) {
                console.log('🚶‍♂️ Google Fit step fetch failed:', error);
            }
        }, 30000);
        
        return true;
    }
    
    /**
     * Initialize gyroscope-based step detection
     */
    initializeGyroscope() {
        console.log('🚶‍♂️ Initializing gyroscope tracking...');
        
        if (!('DeviceOrientationEvent' in window)) {
            console.log('🚶‍♂️ DeviceOrientationEvent not supported');
            return false;
        }
        
        // Request permission for device orientation
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.setupGyroscopeListener();
                    return true;
                } else {
                    console.log('🚶‍♂️ Device orientation permission denied');
                    return false;
                }
            });
        } else {
            this.setupGyroscopeListener();
            return true;
        }
        
        return false;
    }
    
    /**
     * Setup gyroscope listener for step detection
     */
    setupGyroscopeListener() {
        let lastOrientation = null;
        let stepCount = 0;
        
        window.addEventListener('deviceorientation', (event) => {
            if (!this.isTracking) return;
            
            const currentOrientation = {
                alpha: event.alpha || 0,
                beta: event.beta || 0,
                gamma: event.gamma || 0,
                timestamp: Date.now()
            };
            
            if (lastOrientation) {
                // Calculate orientation change magnitude
                const deltaAlpha = Math.abs(currentOrientation.alpha - lastOrientation.alpha);
                const deltaBeta = Math.abs(currentOrientation.beta - lastOrientation.beta);
                const deltaGamma = Math.abs(currentOrientation.gamma - lastOrientation.gamma);
                const magnitude = Math.sqrt(deltaAlpha * deltaAlpha + deltaBeta * deltaBeta + deltaGamma * deltaGamma);
                
                // Detect step based on orientation changes (walking motion)
                if (magnitude > this.config.gyroThreshold && 
                    (currentOrientation.timestamp - this.stepData.lastStepTime) > this.config.gyroCooldown) {
                    this.addStep('gyroscope');
                    stepCount++;
                }
            }
            
            lastOrientation = currentOrientation;
        });
        
        console.log('🚶‍♂️ Gyroscope listener setup complete');
        return true;
    }
    
    /**
     * Initialize GPS distance-based step estimation
     */
    initializeGPSDistance() {
        console.log('🚶‍♂️ Initializing GPS distance tracking...');
        
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) {
            console.log('🚶‍♂️ Geolocation system not available');
            return false;
        }
        
        // Listen for position updates
        const geolocation = window.eldritchApp.systems.geolocation;
        
        // Store original callback
        const originalCallback = geolocation.onPositionUpdate;
        
        // Override with step tracking
        geolocation.onPositionUpdate = (position) => {
            if (originalCallback) {
                originalCallback(position);
            }
            this.handlePositionUpdate(position);
        };
        
        console.log('🚶‍♂️ GPS distance tracking setup complete');
        return true;
    }
    
    /**
     * Handle GPS position updates for step estimation
     */
    handlePositionUpdate(position) {
        if (!this.isTracking || !position) return;
        
        const currentPosition = {
            lat: position.lat,
            lng: position.lng,
            timestamp: Date.now(),
            accuracy: position.accuracy
        };
        
        // Only process if accuracy is good enough
        if (currentPosition.accuracy > 50) {
            console.log('🚶‍♂️ GPS accuracy too poor for step estimation:', currentPosition.accuracy);
            return;
        }
        
        if (this.stepData.lastPosition) {
            const distance = this.calculateDistance(
                this.stepData.lastPosition.lat,
                this.stepData.lastPosition.lng,
                currentPosition.lat,
                currentPosition.lng
            );
            
            if (distance > this.config.minDistanceForStep) {
                this.stepData.distanceTraveled += distance;
                
                // Estimate steps based on distance
                const estimatedSteps = Math.floor(distance / this.config.averageStepLength);
                
                if (estimatedSteps > 0 && estimatedSteps <= Math.floor(distance / this.config.maxStepLength)) {
                    this.addSteps(estimatedSteps, 'gps_distance');
                }
            }
        }
        
        this.stepData.lastPosition = currentPosition;
        this.positionHistory.push(currentPosition);
        
        // Keep only last 100 positions
        if (this.positionHistory.length > 100) {
            this.positionHistory.shift();
        }
    }
    
    /**
     * Initialize fallback mode (time-based step simulation)
     */
    initializeFallbackMode() {
        console.log('🚶‍♂️ Initializing fallback mode...');
        
        if (!this.config.fallbackEnabled) {
            console.log('🚶‍♂️ Fallback mode disabled');
            return false;
        }
        
        // Add steps periodically as fallback
        this.fallbackInterval = setInterval(() => {
            if (this.isTracking) {
                this.addStep('fallback');
            }
        }, this.config.fallbackStepInterval);
        
        console.log('🚶‍♂️ Fallback mode active');
        return true;
    }
    
    /**
     * Start step tracking
     */
    startTracking() {
        console.log('🚶‍♂️ Starting step tracking...');
        this.isTracking = true;
        this.lastUpdateTime = Date.now();
    }
    
    /**
     * Stop step tracking
     */
    stopTracking() {
        console.log('🚶‍♂️ Stopping step tracking...');
        this.isTracking = false;
        
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }
    
    /**
     * Add a single step
     */
    addStep(method = 'unknown') {
        this.stepData.totalSteps++;
        this.stepData.sessionSteps++;
        this.stepData.lastStepTime = Date.now();
        
        console.log(`🚶‍♂️ Step added via ${method}. Total: ${this.stepData.totalSteps}, Session: ${this.stepData.sessionSteps}`);
        
        // Store step in history
        this.stepData.stepHistory.push({
            timestamp: this.stepData.lastStepTime,
            method: method,
            totalSteps: this.stepData.totalSteps
        });
        
        // Keep only last 1000 steps
        if (this.stepData.stepHistory.length > 1000) {
            this.stepData.stepHistory.shift();
        }
        
        // Notify callback
        if (this.onStepUpdate) {
            this.onStepUpdate({
                totalSteps: this.stepData.totalSteps,
                sessionSteps: this.stepData.sessionSteps,
                method: method,
                timestamp: this.stepData.lastStepTime
            });
        }
        
        // Save to localStorage
        this.saveStepData();
    }
    
    /**
     * Add multiple steps
     */
    addSteps(count, method = 'unknown') {
        for (let i = 0; i < count; i++) {
            this.addStep(method);
        }
    }
    
    /**
     * Calculate distance between two GPS coordinates
     */
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c; // Distance in meters
    }
    
    /**
     * Save step data to localStorage
     */
    saveStepData() {
        try {
            localStorage.setItem('enhanced_step_data', JSON.stringify({
                totalSteps: this.stepData.totalSteps,
                sessionSteps: this.stepData.sessionSteps,
                distanceTraveled: this.stepData.distanceTraveled,
                lastPosition: this.stepData.lastPosition,
                activeMethod: this.activeMethod,
                config: this.config
            }));
        } catch (error) {
            console.error('🚶‍♂️ Error saving step data:', error);
        }
    }
    
    /**
     * Load step data from localStorage
     */
    loadStepData() {
        try {
            const saved = localStorage.getItem('enhanced_step_data');
            if (saved) {
                const data = JSON.parse(saved);
                this.stepData.totalSteps = data.totalSteps || 0;
                this.stepData.sessionSteps = data.sessionSteps || 0;
                this.stepData.distanceTraveled = data.distanceTraveled || 0;
                this.stepData.lastPosition = data.lastPosition || null;
                this.activeMethod = data.activeMethod || null;
                
                if (data.config) {
                    this.config = { ...this.config, ...data.config };
                }
                
                console.log(`🚶‍♂️ Loaded step data: ${this.stepData.totalSteps} total steps`);
            }
        } catch (error) {
            console.error('🚶‍♂️ Error loading step data:', error);
        }
    }
    
    /**
     * Get current step data
     */
    getStepData() {
        return {
            ...this.stepData,
            activeMethod: this.activeMethod,
            isTracking: this.isTracking,
            config: this.config
        };
    }
    
    /**
     * Set step update callback
     */
    setStepUpdateCallback(callback) {
        this.onStepUpdate = callback;
    }
    
    /**
     * Set method change callback
     */
    setMethodChangeCallback(callback) {
        this.onMethodChange = callback;
    }
    
    /**
     * Notify method change
     */
    notifyMethodChange(method) {
        if (this.onMethodChange) {
            this.onMethodChange(method);
        }
    }
    
    /**
     * Get debug information
     */
    getDebugInfo() {
        return {
            activeMethod: this.activeMethod,
            isTracking: this.isTracking,
            stepData: this.stepData,
            positionHistoryLength: this.positionHistory.length,
            gyroDataLength: this.gyroData.length,
            config: this.config
        };
    }
    
    /**
     * Update step length based on user height
     */
    updateStepLength(heightInCm) {
        // Average step length is approximately 42% of height
        this.config.averageStepLength = (heightInCm * 0.42) / 100; // Convert to meters
        console.log(`🚶‍♂️ Updated step length to ${this.config.averageStepLength}m based on height ${heightInCm}cm`);
    }
    
    /**
     * Reset step data
     */
    resetStepData() {
        this.stepData = {
            totalSteps: 0,
            sessionSteps: 0,
            lastPosition: null,
            lastStepTime: 0,
            stepHistory: [],
            distanceTraveled: 0,
            estimatedSteps: 0
        };
        
        this.saveStepData();
        console.log('🚶‍♂️ Step data reset');
    }
    
    /**
     * Set user height for accurate step length calculation
     */
    setUserHeight(height) {
        if (height >= 100 && height <= 250) {
            this.userHeight = height;
            this.stepLength = this.getStepLength(height);
            console.log('🚶‍♂️ User height updated:', height, 'cm, step length:', this.stepLength, 'm');
            this.emit('heightUpdated', { height, stepLength: this.stepLength });
        } else {
            console.warn('🚶‍♂️ Invalid height:', height, 'must be between 100-250 cm');
        }
    }
}

// Export for use in other modules
window.EnhancedStepTracking = EnhancedStepTracking;

console.log('🚶‍♂️ Enhanced Step Tracking System loaded');
