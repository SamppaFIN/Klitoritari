/**
 * @fileoverview [VERIFIED] Step Currency System - Manages real-world step counting as the primary game currency
 * @status VERIFIED - Step counting and milestone checking working correctly
 * @feature #feature-step-currency-system
 * @bugfix #bug-milestone-blocked
 * @last_verified 2024-01-28
 * @dependencies WebSocket, Base System, Event Bus
 * @warning Do not modify milestone logic or step counting without testing base establishment
 * 
 * Step Currency System
 * Manages real-world step counting as the primary game currency
 */

console.log('🚶‍♂️ Step currency system script file loaded!');
console.log('🚶‍♂️ About to define StepCurrencySystem class...');

class StepCurrencySystem {
    constructor() {
        this.instanceId = 'step-currency-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        console.log('🚶‍♂️ StepCurrencySystem constructor called, Instance ID:', this.instanceId);
        console.log('🚶‍♂️ Constructor starting...');
        this.totalSteps = 0;
        this.sessionSteps = 0;
        this.lastStepCount = 0;
        this.stepDetectionActive = false;
        this.accelerationData = [];
        this.stepThreshold = 2.5; // Higher acceleration threshold for step detection
        this.lastStepTime = 0;
        this.minStepInterval = 1000; // Minimum 1 second between steps
        this.stepCooldown = 2000; // 2 second cooldown after each step
        
        // Debug flag to disable automatic step detection
        this.autoStepDetectionEnabled = false;
        
        // Step milestones for rewards
        this.milestones = {
            flag: 50,      // Create flag every 50 steps
            celebration: 100, // Celebration every 100 steps
            quest: 500,    // Unlock quest every 500 steps
            area: 1000     // Unlock area every 1000 steps
        };
        
        // Google Fit integration
        this.googleFitEnabled = false;
        this.googleFitClient = null;
        
        // Callback for step updates
        this.onStepUpdate = null;
        
        // Base building integration
        this.baseBuildingLayer = null;
        
        // Milestone tracking
        this.areaUnlocked = false;
        
        this.init();
    }
    
    setBaseBuildingLayer(layer) {
        this.baseBuildingLayer = layer;
        console.log('🏗️ Base building layer connected to step currency system');
    }
    
    init() {
        console.log('🚶‍♂️ ===== STEP CURRENCY SYSTEM INITIALIZATION =====');
        console.log('🚶‍♂️ Instance ID:', this.instanceId || 'no-id');
        console.log('🚶‍♂️ Starting initialization process...');
        
        // Only load from localStorage during initialization - don't request game state yet
        console.log('🚶‍♂️ Step 1: Loading from localStorage (game state will be requested when continuing adventure)...');
        this.loadStoredSteps();
        console.log(`🚶‍♂️ After loadStoredSteps - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Force set to 10,000 if still 0 after loading
        if (this.totalSteps === 0) {
            console.log('🚶‍♂️ Total steps is 0, force setting to 10,000...');
            this.totalSteps = 10000;
            this.saveSteps();
            console.log(`🚶‍♂️ Force set totalSteps to: ${this.totalSteps}`);
        }
        
        console.log('🚶‍♂️ Step 2: Setting up device motion...');
        this.setupDeviceMotion();
        
        console.log('🚶‍♂️ Step 3: Setting up Google Fit...');
        this.setupGoogleFit();
        
        console.log('🚶‍♂️ Step 4: Creating step counter...');
        this.createStepCounter();
        
        console.log('🚶‍♂️ Step 5: Starting step detection...');
        this.startStepDetection();
        
        console.log('🚶‍♂️ Step 6: Optimizing for mobile...');
        this.optimizeForMobile();
        
        // Update step counter display (with delay to ensure HTML is ready)
        console.log('🚶‍♂️ Step 7: Updating step counter display...');
        setTimeout(() => {
            this.updateStepCounter();
        }, 100);
        
        // Sync steps to server for validation
        console.log('🚶‍♂️ Step 8: Syncing steps to server...');
        this.syncStepsToServer();
        
        // Check milestones for existing steps (in case user already has enough steps)
        console.log('🚶‍♂️ Step 9: Running initial milestone check...');
        this.checkMilestones();
        console.log('🚶‍♂️ ===== STEP CURRENCY SYSTEM INITIALIZATION COMPLETE =====');
    }
    
    requestInitialStepsFromServer() {
        console.log('🚶‍♂️ Requesting initial steps from server...');
        
        // Check if WebSocket is available
        if (window.websocketClient && window.websocketClient.socket && window.websocketClient.socket.readyState === WebSocket.OPEN) {
            console.log('🚶‍♂️ WebSocket available, requesting initial steps');
            window.websocketClient.send({
                type: 'request_initial_steps',
                payload: {}
            });
        } else {
            console.log('🚶‍♂️ WebSocket not available, falling back to localStorage');
            this.loadStoredSteps();
            this.updateStepCounter();
        }
    }
    
    syncStepsToServer() {
        console.log('🚶‍♂️ Syncing steps to server for validation...');
        
        // Check if WebSocket is available
        if (window.websocketClient && window.websocketClient.socket && window.websocketClient.socket.readyState === WebSocket.OPEN) {
            console.log('🚶‍♂️ WebSocket available, syncing steps to server');
            window.websocketClient.send({
                type: 'sync_steps',
                payload: {
                    totalSteps: this.totalSteps,
                    sessionSteps: this.sessionSteps,
                    timestamp: Date.now()
                }
            });
        } else {
            console.log('🚶‍♂️ WebSocket not available, steps will sync when connection is ready');
        }
    }

    handleInitialStepsFromServer(data) {
        console.log('🚶‍♂️ Received initial steps from server:', data);
        this.totalSteps = data.totalSteps || 10000;
        this.sessionSteps = data.sessionSteps || 0;
        
        // Save to localStorage for persistence
        this.saveSteps();
        
        // Update the display
        this.updateStepCounter();
        
        console.log(`🚶‍♂️ Set steps from server - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
    }

    handleStepsSyncedFromServer(data) {
        console.log('🚶‍♂️ Steps sync acknowledged by server:', data);
        
        if (data.validated) {
            console.log('✅ Steps validated by server');
        } else {
            console.warn('⚠️ Steps validation failed on server');
        }
    }
    
    loadStoredSteps() {
        console.log('🚶‍♂️ ===== LOADING STORED STEPS =====');
        
        // Load total steps from localStorage
        const stored = localStorage.getItem('eldritch_total_steps');
        console.log('🚶‍♂️ Stored value from localStorage:', stored);
        console.log('🚶‍♂️ Current totalSteps before load:', this.totalSteps);
        
        if (stored && stored !== 'null' && stored !== 'undefined') {
            const parsedSteps = parseInt(stored);
            console.log('🚶‍♂️ Parsed steps:', parsedSteps);
            if (!isNaN(parsedSteps) && parsedSteps >= 0) {
                this.totalSteps = parsedSteps;
                console.log(`🚶‍♂️ Loaded ${this.totalSteps} total steps from storage`);
            } else {
                console.log(`🚶‍♂️ Invalid stored steps value: "${stored}", setting to 10,000`);
                this.totalSteps = 10000;
                this.saveSteps();
            }
        } else {
            // Set initial steps to 10,000 for new players
            console.log('🚶‍♂️ No stored steps found, setting initial steps to 10,000');
            this.totalSteps = 10000;
            this.saveSteps();
            console.log(`🚶‍♂️ Set initial steps to ${this.totalSteps} for new player`);
        }
        
        console.log('🚶‍♂️ Final totalSteps after load:', this.totalSteps);
        console.log('🚶‍♂️ ===== LOADING STORED STEPS COMPLETE =====');
    }
    
    saveSteps() {
        localStorage.setItem('eldritch_total_steps', this.totalSteps.toString());
    }

    // Force reset steps to 10,000 (for debugging)
    forceResetSteps() {
        console.log('🚶‍♂️ Force resetting steps to 10,000');
        this.totalSteps = 10000;
        this.sessionSteps = 0;
        this.saveSteps();
        this.updateStepCounter();
        console.log('🚶‍♂️ Steps force reset complete');
    }
    
    setupDeviceMotion() {
        // Request permission for device motion
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.enableDeviceMotion();
                } else {
                    console.log('🚶‍♂️ Device motion permission denied, using fallback');
                    this.enableFallbackMode();
                }
            }).catch(error => {
                console.warn('🚶‍♂️ Device motion permission error:', error);
                this.enableFallbackMode();
            });
        } else {
            // Direct access (older browsers)
            this.enableDeviceMotion();
        }
        
        // Also try to access step counting if available
        this.setupStepCountingAPI();
    }
    
    setupStepCountingAPI() {
        // Try to access native step counting APIs if available
        if ('navigator' in window && 'permissions' in navigator) {
            // Check for step counting permission
            navigator.permissions.query({ name: 'accelerometer' }).then(result => {
                if (result.state === 'granted') {
                    console.log('🚶‍♂️ Accelerometer permission granted');
                    this.setupAdvancedStepDetection();
                }
            }).catch(() => {
                console.log('🚶‍♂️ Accelerometer permission not available');
            });
        }
        
        // Try to access health/fitness APIs if available
        if ('navigator' in window && 'health' in navigator) {
            this.setupHealthAPI();
        }
    }
    
    setupAdvancedStepDetection() {
        console.log('🚶‍♂️ Setting up advanced step detection');
        // Enhanced step detection using multiple sensors
        let lastAcceleration = null;
        let stepBuffer = [];
        let lastStepTime = 0;
        
        window.addEventListener('devicemotion', (event) => {
            if (!this.stepDetectionActive) return;
            
            const acceleration = {
                x: event.accelerationIncludingGravity?.x || 0,
                y: event.accelerationIncludingGravity?.y || 0,
                z: event.accelerationIncludingGravity?.z || 0,
                timestamp: Date.now()
            };
            
            if (lastAcceleration) {
                // Calculate acceleration magnitude
                const deltaX = acceleration.x - lastAcceleration.x;
                const deltaY = acceleration.y - lastAcceleration.y;
                const deltaZ = acceleration.z - lastAcceleration.z;
                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
                
                // Store acceleration data for pattern analysis
                stepBuffer.push({
                    magnitude: magnitude,
                    timestamp: acceleration.timestamp
                });
                
                // Keep only last 50 readings (about 5 seconds at 10Hz)
                if (stepBuffer.length > 50) {
                    stepBuffer.shift();
                }
                
                // Detect step pattern: look for peaks in acceleration
                if (stepBuffer.length >= 10) {
                    const recent = stepBuffer.slice(-10);
                    const avgMagnitude = recent.reduce((sum, reading) => sum + reading.magnitude, 0) / recent.length;
                    const currentMagnitude = recent[recent.length - 1].magnitude;
                    
                    // Step detection: significant peak above average
                    if (currentMagnitude > avgMagnitude * 1.5 && 
                        currentMagnitude > this.stepThreshold &&
                        acceleration.timestamp - lastStepTime > this.minStepInterval) {
                        
                        this.addStep();
                        lastStepTime = acceleration.timestamp;
                        stepBuffer = []; // Clear buffer after step detection
                    }
                }
            }
            
            lastAcceleration = acceleration;
        });
    }
    
    setupHealthAPI() {
        console.log('🚶‍♂️ Setting up health API integration');
        // This would integrate with health APIs if available
        // For now, we'll use the enhanced motion detection
        try {
            if (navigator.health && navigator.health.requestAccess) {
                navigator.health.requestAccess(['steps']).then(granted => {
                    if (granted) {
                        console.log('🚶‍♂️ Health API access granted');
                        this.enableHealthStepCounting();
                    }
                }).catch(error => {
                    console.log('🚶‍♂️ Health API not available:', error);
                });
            }
        } catch (error) {
            console.log('🚶‍♂️ Health API setup failed:', error);
        }
    }
    
    enableHealthStepCounting() {
        // Placeholder for health API step counting
        // This would integrate with platform-specific health APIs
        console.log('🚶‍♂️ Health API step counting enabled (placeholder)');
    }
    
    detectDevicePosition() {
        // Detect if device is in pocket, hand, or stationary
        // This helps adjust step detection sensitivity
        if (this.accelerationData.length < 10) return 'unknown';
        
        const recent = this.accelerationData.slice(-10);
        const avgX = recent.reduce((sum, reading) => sum + reading.x, 0) / recent.length;
        const avgY = recent.reduce((sum, reading) => sum + reading.y, 0) / recent.length;
        const avgZ = recent.reduce((sum, reading) => sum + reading.z, 0) / recent.length;
        
        // Analyze gravity vector to determine device orientation
        const gravityMagnitude = Math.sqrt(avgX * avgX + avgY * avgY + avgZ * avgZ);
        
        if (gravityMagnitude < 8) {
            return 'pocket'; // Low gravity suggests device is in pocket
        } else if (Math.abs(avgZ) > Math.abs(avgX) && Math.abs(avgZ) > Math.abs(avgY)) {
            return 'hand'; // Z-axis dominant suggests device is in hand
        } else {
            return 'stationary'; // Balanced gravity suggests device is stationary
        }
    }
    
    adjustStepSensitivity() {
        const position = this.detectDevicePosition();
        
        switch (position) {
            case 'pocket':
                this.stepThreshold = 2.0; // Lower threshold for pocket
                this.minStepInterval = 800; // Faster detection
                break;
            case 'hand':
                this.stepThreshold = 3.0; // Higher threshold for hand
                this.minStepInterval = 1200; // Slower detection
                break;
            case 'stationary':
                this.stepThreshold = 4.0; // Much higher threshold when stationary
                this.minStepInterval = 2000; // Much slower detection
                break;
            default:
                this.stepThreshold = 2.5; // Default threshold
                this.minStepInterval = 1000; // Default interval
        }
        
        console.log(`🚶‍♂️ Adjusted step sensitivity for ${position}: threshold=${this.stepThreshold}, interval=${this.minStepInterval}ms`);
    }
    
    getStepCountingStatus() {
        const position = this.detectDevicePosition();
        const accuracy = this.calculateAccuracy();
        
        return {
            position: position,
            accuracy: accuracy,
            threshold: this.stepThreshold,
            interval: this.minStepInterval,
            isActive: this.stepDetectionActive,
            totalSteps: this.totalSteps,
            sessionSteps: this.sessionSteps
        };
    }
    
    calculateAccuracy() {
        // Calculate step counting accuracy based on recent data
        if (this.accelerationData.length < 20) return 'unknown';
        
        const recent = this.accelerationData.slice(-20);
        const magnitudes = recent.map(reading => reading.magnitude);
        const avgMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length;
        const variance = magnitudes.reduce((sum, mag) => sum + Math.pow(mag - avgMagnitude, 2), 0) / magnitudes.length;
        const stdDev = Math.sqrt(variance);
        
        // Higher variance suggests more movement, potentially more accurate
        if (stdDev > 2.0) return 'high';
        if (stdDev > 1.0) return 'medium';
        return 'low';
    }
    
    optimizeForMobile() {
        // Mobile-specific optimizations
        if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
            console.log('🚶‍♂️ Mobile device detected, applying optimizations');
            
            // Reduce data collection frequency to save battery
            this.accelerationData = this.accelerationData.filter((_, index) => index % 2 === 0);
            
            // Adjust thresholds for mobile
            this.stepThreshold = Math.max(1.5, this.stepThreshold * 0.8);
            this.minStepInterval = Math.max(500, this.minStepInterval * 0.8);
            
            // Enable background step counting
            this.enableBackgroundStepCounting();
        }
    }
    
    enableBackgroundStepCounting() {
        // Use Page Visibility API to continue step counting in background
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('🚶‍♂️ Page hidden, reducing step detection frequency');
                this.stepDetectionActive = false;
                // Continue with reduced frequency
                setTimeout(() => {
                    this.stepDetectionActive = true;
                }, 5000);
            } else {
                console.log('🚶‍♂️ Page visible, resuming full step detection');
                this.stepDetectionActive = true;
            }
        });
    }
    
    // Expose step counting status for debugging
    getDebugInfo() {
        const status = this.getStepCountingStatus();
        return {
            ...status,
            accelerationDataLength: this.accelerationData.length,
            lastStepTime: this.lastStepTime,
            stepCooldown: this.stepCooldown,
            milestones: this.milestones,
            googleFitEnabled: this.googleFitEnabled
        };
    }
    
    enableDeviceMotion() {
        console.log('🚶‍♂️ Enabling device motion detection');
        window.addEventListener('devicemotion', (event) => {
            this.handleDeviceMotion(event);
        });
        this.stepDetectionActive = true;
        
        // Also enable gyroscope-based detection when GPS is tracking
        this.enableGyroscopeDetection();
    }
    
    enableGyroscopeDetection() {
        // Check if device orientation is available
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.startGyroscopeDetection();
                } else {
                    console.log('🚶‍♂️ Gyroscope permission denied');
                }
            });
        } else {
            // Direct access (older browsers)
            this.startGyroscopeDetection();
        }
    }
    
    startGyroscopeDetection() {
        console.log('🚶‍♂️ Starting gyroscope-based step detection');
        let lastOrientation = null;
        let orientationChangeCount = 0;
        
        window.addEventListener('deviceorientation', (event) => {
            if (!this.stepDetectionActive) return;
            
            const currentOrientation = {
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
                timestamp: Date.now()
            };
            
            if (lastOrientation) {
                // Calculate orientation change magnitude
                const alphaChange = Math.abs(currentOrientation.alpha - lastOrientation.alpha);
                const betaChange = Math.abs(currentOrientation.beta - lastOrientation.beta);
                const gammaChange = Math.abs(currentOrientation.gamma - lastOrientation.gamma);
                
                const totalChange = alphaChange + betaChange + gammaChange;
                
                // Detect significant orientation changes (walking motion) - more strict
                if (totalChange > 20 && totalChange < 80) {
                    orientationChangeCount++;
                    
                    // Add step every 8-10 orientation changes (more walking pattern required)
                    if (orientationChangeCount >= 8) {
                        this.addStep();
                        orientationChangeCount = 0;
                    }
                }
            }
            
            lastOrientation = currentOrientation;
        });
    }
    
    enableFallbackMode() {
        console.log('🚶‍♂️ Using fallback step detection mode');
        // Clear any existing fallback interval
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
        }
        // Simulate steps for testing (slower rate for easier testing)
        this.fallbackInterval = setInterval(() => {
            if (this.stepDetectionActive) {
                this.addStep();
            }
        }, 5000); // Add step every 5 seconds for testing
    }
    
    disableFallbackMode() {
        console.log('🚶‍♂️ Disabling fallback step detection mode');
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }
    
    handleDeviceMotion(event) {
        if (!this.stepDetectionActive) return;
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) return;
        
        // Store acceleration data with individual components
        this.accelerationData.push({
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
            magnitude: Math.sqrt(
                acceleration.x * acceleration.x +
                acceleration.y * acceleration.y +
                acceleration.z * acceleration.z
            ),
            timestamp: Date.now()
        });
        
        // Keep only last 50 readings
        if (this.accelerationData.length > 50) {
            this.accelerationData.shift();
        }
        
        // Adjust sensitivity based on device position
        this.adjustStepSensitivity();
        
        // Detect step pattern
        this.detectStep(this.accelerationData[this.accelerationData.length - 1].magnitude);
    }
    
    detectStep(magnitude) {
        const now = Date.now();
        
        // Check minimum interval between steps
        if (now - this.lastStepTime < this.minStepInterval) {
            return;
        }
        
        // Check cooldown period
        if (now - this.lastStepTime < this.stepCooldown) {
            return;
        }
        
        // Simple step detection: look for acceleration peaks
        if (this.accelerationData.length >= 5) {
            const recent = this.accelerationData.slice(-5);
            const current = recent[4].magnitude;
            const previous = recent[3].magnitude;
            const before = recent[2].magnitude;
            
            // More strict step detection: current must be significantly higher than previous readings
            if (current > previous && current > before && current > this.stepThreshold) {
                // Additional check: ensure it's a real peak, not just noise
                const isPeak = current > recent[1].magnitude && current > recent[0].magnitude;
                if (isPeak) {
                    this.addStep();
                    this.lastStepTime = now;
                }
            }
        }
    }
    
    addStep() {
        // Check if automatic step detection is disabled
        if (!this.autoStepDetectionEnabled && this.stepDetectionActive) {
            console.log('🚶‍♂️ Automatic step detection disabled - ignoring step');
            return;
        }
        
        this.totalSteps++;
        this.sessionSteps++;
        
        console.log(`🚶‍♂️ Step added! Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Save to localStorage
        this.saveSteps();
        
        // Sync to server for validation
        this.syncStepsToServer();
        
        // Debug: Check if we're at a 50-step milestone
        if (this.totalSteps % 50 === 0) {
            console.log(`🎯 50-step milestone reached! Total steps: ${this.totalSteps}`);
        }
        
        this.updateStepCounter();
        
        // Trigger step update callback
        if (this.onStepUpdate) {
            this.onStepUpdate();
        }
        
        // Update base building system
        if (this.baseBuildingLayer) {
            this.baseBuildingLayer.addStepFromExternal();
        }
        
        // Sound feedback
        if (window.soundManager) {
            try {
                if (this.sessionSteps % this.milestones.celebration === 0) {
                    window.soundManager.playBling({ frequency: 1400, duration: 0.12, type: 'triangle' });
                } else if (this.sessionSteps % this.milestones.flag === 0) {
                    window.soundManager.playBling({ frequency: 1100, duration: 0.1, type: 'sine' });
                } else {
                    window.soundManager.playBling({ frequency: 740, duration: 0.05, type: 'sine' });
                }
            } catch (e) {}
        }
        
        // Step milestone effects
        if (this.totalSteps % 50 === 0 && this.totalSteps > 0) {
            if (window.discordEffects) {
                try { 
                    window.discordEffects.triggerGlowPulse(window.innerWidth/2, window.innerHeight/2, '#ffaa00', 100);
                    window.discordEffects.triggerNotificationPop(`${this.totalSteps} Steps!`, '#ffaa00');
                } catch (e) {}
            }
            
            // Path markers are now created by the path painting system instead of step counting
            console.log(`🎯 50-step milestone reached! Path markers are now created by movement, not step counting.`);
        }
        
        // Emit step change event
        this.emitStepChangeEvent(1);
        
        this.checkMilestones();
        this.saveSteps();
    }

    addManualStep() {
        this.totalSteps++;
        this.sessionSteps++;
        
        console.log(`🚶‍♂️ Manual step added! Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Save to localStorage
        this.saveSteps();
        
        // Sync to server for validation
        this.syncStepsToServer();
        
        // Debug: Check if we're at a 50-step milestone
        if (this.totalSteps % 50 === 0) {
            console.log(`🎯 50-step milestone reached! Total steps: ${this.totalSteps}`);
        }
        
        this.updateStepCounter();
        
        // Trigger step update callback
        if (this.onStepUpdate) {
            this.onStepUpdate();
        }
        
        // Update base building system
        if (this.baseBuildingLayer) {
            this.baseBuildingLayer.addStepFromExternal();
        }
        
        // Sound feedback
        if (window.soundManager) {
            try {
                if (this.sessionSteps % this.milestones.celebration === 0) {
                    window.soundManager.playBling({ frequency: 1400, duration: 0.12, type: 'triangle' });
                } else if (this.sessionSteps % this.milestones.flag === 0) {
                    window.soundManager.playBling({ frequency: 1100, duration: 0.1, type: 'sine' });
                } else {
                    window.soundManager.playBling({ frequency: 740, duration: 0.05, type: 'sine' });
                }
            } catch (e) {}
        }
        
        // Step milestone effects
        if (this.totalSteps % 50 === 0 && this.totalSteps > 0) {
            if (window.discordEffects) {
                try { 
                    window.discordEffects.triggerGlowPulse(window.innerWidth/2, window.innerHeight/2, '#ffaa00', 100);
                    window.discordEffects.triggerNotificationPop(`${this.totalSteps} Steps!`, '#ffaa00');
                } catch (e) {}
            }
            
            // Path markers are now created by the path painting system instead of step counting
            console.log(`🎯 50-step milestone reached! Path markers are now created by movement, not step counting.`);
        }
        
        // Emit step change event
        this.emitStepChangeEvent(1);
        
        this.checkMilestones();
        this.saveSteps();
    }
    
    createPathMarker() {
        try {
            console.log(`🐜 createPathMarker called at step ${this.totalSteps}`);
            
            // Get current player position
            let playerPosition = null;
            if (window.mapEngine && typeof window.mapEngine.getPlayerPosition === 'function') {
                playerPosition = window.mapEngine.getPlayerPosition();
                console.log('🐜 Got position from getPlayerPosition():', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            } else if (window.mapEngine && window.mapEngine.playerPosition) {
                playerPosition = window.mapEngine.playerPosition;
                console.log('🐜 Got position from playerPosition:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            } else if (window.geolocationManager && window.geolocationManager.currentPosition) {
                playerPosition = window.geolocationManager.currentPosition;
                console.log('🐜 Got position from geolocationManager:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            }
            
            console.log('🐜 Final player position:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            console.log('🐜 mapEngine available:', !!window.mapEngine);
            console.log('🐜 dropFlagHere available:', !!(window.mapEngine && window.mapEngine.dropFlagHere));
            
            if (playerPosition && window.mapEngine && window.mapEngine.dropFlagHere) {
                console.log(`🐜 Creating path marker at step ${this.totalSteps} at position:`, `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
                window.mapEngine.dropFlagHere(playerPosition.lat, playerPosition.lng);
                console.log('🐜 Path marker creation completed');
            } else {
                console.log('🐜 Cannot create path marker - no position or mapEngine available');
                console.log('🐜 playerPosition:', playerPosition ? `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}` : 'null');
                console.log('🐜 mapEngine:', !!window.mapEngine);
                console.log('🐜 dropFlagHere:', !!(window.mapEngine && window.mapEngine.dropFlagHere));
            }
        } catch (error) {
            console.error('🐜 Error creating path marker:', error);
        }
    }

    // Reset only the session step counter (used when starting a new adventure)
    resetSessionSteps() {
        this.sessionSteps = 0;
        try {
            this.updateStepCounter();
        } catch (_) {}
        // Persist total steps only; session is transient
        try { this.saveSteps(); } catch (_) {}
        console.log('🚶‍♂️ Session steps reset to 0 for new adventure');
    }
    
    checkMilestones() {
        console.log(`🎯 Checking milestones - Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        console.log(`🎯 Milestone thresholds - Flag: ${this.milestones.flag}, Celebration: ${this.milestones.celebration}, Quest: ${this.milestones.quest}, Area: ${this.milestones.area}`);
        
        // Check for flag creation (every 50 steps)
        if (this.sessionSteps >= this.milestones.flag && this.sessionSteps % this.milestones.flag === 0) {
            console.log(`🇫🇮 Flag milestone triggered! Session steps: ${this.sessionSteps}`);
            this.emitMilestoneEvent('flag', this.sessionSteps, this.totalSteps);
            this.triggerFlagCreation();
        }
        
        // Check for celebration (every 100 steps)
        if (this.sessionSteps >= this.milestones.celebration && this.sessionSteps % this.milestones.celebration === 0) {
            console.log(`🎉 Celebration milestone triggered! Session steps: ${this.sessionSteps}`);
            this.emitMilestoneEvent('celebration', this.sessionSteps, this.totalSteps);
            this.triggerCelebration();
        }
        
        // Check for quest unlock (every 500 steps)
        if (this.totalSteps >= this.milestones.quest && this.totalSteps % this.milestones.quest === 0) {
            console.log(`📜 Quest milestone triggered! Total steps: ${this.totalSteps}`);
            this.emitMilestoneEvent('quest', this.sessionSteps, this.totalSteps);
            this.triggerQuestUnlock();
        }
        
        // Check for area unlock (reaching 1000 steps milestone)
        if (this.totalSteps >= this.milestones.area && !this.areaUnlocked) {
            console.log(`🎯 1000 steps milestone reached! Total: ${this.totalSteps}`);
            this.areaUnlocked = true;
            this.emitMilestoneEvent('area', this.sessionSteps, this.totalSteps);
            this.triggerAreaUnlock();
        }
    }

    /**
     * Emit step change event via event bus
     * @param {number} stepAmount - Number of steps added
     */
    emitStepChangeEvent(stepAmount) {
        if (window.eventBus) {
            const eventData = {
                stepAmount: stepAmount,
                sessionSteps: this.sessionSteps,
                totalSteps: this.totalSteps,
                timestamp: Date.now(),
                milestones: this.milestones
            };
            
            console.log(`🔔 Emitting step change event: steps:change`, eventData);
            window.eventBus.emit('steps:change', eventData);
        } else {
            console.warn('🚶‍♂️ EventBus not available for step change event emission');
        }
    }

    /**
     * Emit milestone event via event bus and send to server
     * @param {string} milestoneType - Type of milestone (flag, celebration, quest, area)
     * @param {number} sessionSteps - Current session steps
     * @param {number} totalSteps - Current total steps
     */
    emitMilestoneEvent(milestoneType, sessionSteps, totalSteps) {
        const eventData = {
            type: milestoneType,
            sessionSteps: sessionSteps,
            totalSteps: totalSteps,
            timestamp: Date.now(),
            thresholds: this.milestones
        };
        
        // Log milestone achievement
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`🎯 Milestone achieved: ${milestoneType} (${totalSteps} total steps)`, 'milestone');
        } else {
            console.log(`🎯 Milestone achieved: ${milestoneType} (${totalSteps} total steps)`);
        }
        
        // Emit local event bus events
        if (window.eventBus) {
            console.log(`🔔 Emitting milestone event: steps:${milestoneType}`, eventData);
            window.eventBus.emit(`steps:${milestoneType}`, eventData);
            window.eventBus.emit('steps:milestone', eventData);
        } else {
            console.warn('🚶‍♂️ EventBus not available for milestone event emission');
        }
        
        // Send milestone to server via WebSocket
        this.sendMilestoneToServer(eventData);
    }

    /**
     * Send milestone event to server via WebSocket
     * @param {Object} eventData - Milestone event data
     */
    sendMilestoneToServer(eventData) {
        // Log milestone sending attempt
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`🌐 Sending milestone to server: ${eventData.type}`, 'websocket');
        } else {
            console.log(`🌐 Sending milestone to server: ${eventData.type}`);
        }
        
        // Try to send via MultiplayerManager first
        if (window.multiplayerManager && window.multiplayerManager.isConnected) {
            console.log(`🌐 Sending milestone to server via MultiplayerManager: ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via MultiplayerManager: ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.multiplayerManager.sendMessage({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.multiplayerManager.playerId
                }
            });
            return;
        }
        
        // Fallback to WebSocketClient
        if (window.websocketClient && window.websocketClient.isConnected) {
            console.log(`🌐 Sending milestone to server via WebSocketClient: ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via WebSocketClient: ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.websocketClient.send({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.websocketClient.getPlayerId()
                }
            });
            return;
        }
        
        // Try direct websocket connection
        if (window.websocketClient && window.websocketClient.isConnectedToServer && window.websocketClient.isConnectedToServer()) {
            console.log(`🌐 Sending milestone to server via WebSocketClient (alternative check): ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via WebSocketClient (alt): ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.websocketClient.send({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.websocketClient.getPlayerId()
                }
            });
            return;
        }
        
        // If no WebSocket connection available
        console.warn('🚶‍♂️ No WebSocket connection available for milestone server communication');
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`❌ No WebSocket connection available for milestone: ${eventData.type}`, 'websocket');
        }
    }
    
    triggerFlagCreation() {
        console.log('🇫🇮 50 steps reached - creating flag!');
        
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
            const geo = window.eldritchApp.systems.geolocation;
            // Prefer a synchronous, cached position
            let position = null;
            if (typeof geo.getCurrentPositionSafe === 'function') {
                position = geo.getCurrentPositionSafe();
            }
            if (!position && geo.lastValidPosition) {
                position = geo.lastValidPosition;
            }
            if (!position && geo.currentPosition) {
                position = geo.currentPosition;
            }
            
            if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
                console.log('🇫🇮 Using position for flag:', `lat: ${position.lat}, lng: ${position.lng}`);
                if (window.mapEngine && window.mapEngine.symbolCanvasLayer) {
                    const layer = window.mapEngine.symbolCanvasLayer;
                    // Ensure visible
                    if (layer.canvas) {
                        layer.isVisible = true;
                        layer.canvas.style.opacity = layer.opacity || 1;
                    }
                    layer.addFlagPin(position.lat, position.lng);
                } else {
                    console.warn('🇫🇮 Map engine or flag layer not available');
                }
                
                if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
                    window.gruesomeNotifications.showNotification({
                        type: 'success',
                        title: 'Path Marked!',
                        message: '50 steps earned - Finnish flag placed on your path',
                        duration: 3000
                    });
                }
            } else {
                console.warn('🇫🇮 No valid position available for flag creation');
            }
        } else {
            console.warn('🇫🇮 Geolocation system not available');
        }
    }
    
    triggerCelebration() {
        console.log('🎉 100 steps reached - celebration time!');
        
        // Show celebration animation
        this.showStepCelebration();
        if (window.soundManager) window.soundManager.playEerieHum({ duration: 1.8 });
        
        // Show notification
        if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
            window.gruesomeNotifications.showNotification({
                type: 'celebration',
                title: 'Cosmic Steps!',
                message: '100 steps earned - Your cosmic energy grows!',
                duration: 4000
            });
        }
        
        // Add small stat bonus
        this.giveStepReward();
    }
    
    showStepCelebration() {
        // Create celebration particle effect
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #00ffff;
            pointer-events: none;
            z-index: 10000;
            animation: stepCelebration 2s ease-out forwards;
        `;
        celebration.textContent = '🚶‍♂️✨';
        
        document.body.appendChild(celebration);
        
        // Remove after animation
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 2000);
    }
    
    giveStepReward() {
        // Give small stat bonuses for step milestones
        if (window.encounterSystem) {
            // Small health and sanity boost
            window.encounterSystem.gainHealth(5);
            window.encounterSystem.gainSanity(3);
        }
    }
    
    triggerQuestUnlock() {
        console.log('🎭 500 steps reached - quest unlocked!');
        // Implementation for quest unlocking
        if (window.soundManager) window.soundManager.playBling({ frequency: 1600, duration: 0.2, type: 'triangle' });
    }
    
    triggerAreaUnlock() {
        console.log('🌍 1000 steps reached - new area unlocked!');
        console.log('🏗️ Base establishment now available!');
        
        // Play sound effect
        if (window.soundManager) window.soundManager.playTerrifyingBling();
        
        // Show base establishment notification
        this.showBaseEstablishmentNotification();
        
        // Trigger base establishment dialog
        this.triggerBaseEstablishmentDialog();
    }
    
    showBaseEstablishmentNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'base-establishment-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #e94560;
            padding: 16px 24px;
            border-radius: 12px;
            border: 2px solid #e94560;
            box-shadow: 0 8px 32px rgba(233, 69, 96, 0.3);
            z-index: 10000;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-align: center;
            max-width: 400px;
            animation: slideDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 8px;">🏗️ BASE ESTABLISHMENT UNLOCKED</div>
            <div style="font-size: 14px; color: #f0f0f0;">
                The cosmic energies have aligned. You may now establish your eldritch sanctuary.
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.5s ease-out reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }
    
    triggerBaseEstablishmentDialog() {
        console.log('🏗️ Triggering base establishment dialog...');
        
        // Don't show base establishment dialog during welcome screen
        if (this.isWelcomeScreenActive()) {
            console.log('🏗️ Welcome screen active, deferring base establishment dialog');
            return;
        }
        
        // Debug: Check what systems are available
        console.log('🔍 Debugging base system availability:');
        console.log('  - window.baseSystem:', !!window.baseSystem);
        console.log('  - window.eldritchApp:', !!window.eldritchApp);
        console.log('  - window.eldritchApp.systems:', !!window.eldritchApp?.systems);
        console.log('  - window.eldritchApp.systems.base:', !!window.eldritchApp?.systems?.base);
        console.log('  - window.SimpleBaseInit:', !!window.SimpleBaseInit);
        
        // Check if base system is available
        if (window.baseSystem && typeof window.baseSystem.showBaseEstablishmentModal === 'function') {
            console.log('🏗️ Triggering base establishment dialog (legacy)...');
            window.baseSystem.showBaseEstablishmentModal();
        } else if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.base) {
            console.log('🏗️ Triggering base establishment dialog...');
            window.eldritchApp.systems.base.showBaseEstablishmentModal();
        } else if (window.SimpleBaseInit) {
            console.log('🏗️ Triggering base establishment dialog (SimpleBaseInit)...');
            // Create a simple base establishment modal
            this.createSimpleBaseEstablishmentModal();
        } else {
            console.warn('⚠️ No base system available for establishment dialog');
            console.log('🏗️ Creating fallback base establishment dialog...');
            this.createFallbackBaseEstablishmentDialog();
        }
    }
    
    /**
     * Check if welcome screen is currently active
     * @returns {boolean} True if welcome screen is active
     */
    isWelcomeScreenActive() {
        // Check if welcome screen element is visible
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            const style = window.getComputedStyle(welcomeScreen);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            console.log('🏗️ Welcome screen visibility check:', {
                element: !!welcomeScreen,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                isVisible: isVisible
            });
            return isVisible;
        }
        
        // Check if welcome screen is in the DOM and visible
        const welcomeElements = document.querySelectorAll('[id*="welcome"], [class*="welcome"]');
        for (const element of welcomeElements) {
            const style = window.getComputedStyle(element);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                console.log('🏗️ Welcome screen element found and visible:', element.id || element.className);
                return true;
            }
        }
        
        console.log('🏗️ No welcome screen elements found or visible');
        return false;
    }

    /**
     * Request game state from server when continuing adventure
     * Ensures map systems are ready before requesting state
     */
    requestGameStateFromServer() {
        console.log('🎮 Requesting game state from server for continuing adventure...');
        
        // Wait for map systems to be ready before requesting game state
        this.waitForMapSystemsReady(() => {
            if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
                console.log('🎮 Map systems ready, requesting game state from server...');
                window.websocketClient.requestGameState();
            } else {
                console.log('⚠️ WebSocket not connected, will try again when connected...');
                // Try to connect to WebSocket after a delay
                setTimeout(() => {
                    if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
                        console.log('🎮 WebSocket connected after delay, requesting game state...');
                        window.websocketClient.requestGameState();
                    } else {
                        console.log('⚠️ WebSocket still not connected after delay');
                    }
                }, 2000);
            }
        });
    }
    
    /**
     * Wait for map systems to be ready before proceeding
     * @param {Function} callback - Callback to execute when ready
     */
    waitForMapSystemsReady(callback) {
        console.log('🗺️ Waiting for map systems to be ready...');
        
        const checkMapReady = () => {
            // Check for the actual map systems in the new layered architecture
            const mapReady = window.mapLayer && 
                           window.mapLayer.map && 
                           window.mapLayer.mapReady;
            
            console.log('🗺️ Map readiness check:', {
                mapLayer: !!window.mapLayer,
                map: !!(window.mapLayer && window.mapLayer.map),
                mapReady: !!(window.mapLayer && window.mapLayer.mapReady)
            });
            
            if (mapReady) {
                console.log('✅ Map systems ready, proceeding with game state request');
                callback();
            } else {
                console.log('⏳ Map systems not ready yet, waiting...');
                setTimeout(checkMapReady, 500);
            }
        };
        
        // Start checking immediately
        checkMapReady();
    }

    createFallbackBaseEstablishmentDialog() {
        console.log('🏗️ Creating fallback base establishment dialog...');
        
        // Create a beautiful modal for base establishment
        const modal = document.createElement('div');
        modal.id = 'fallback-base-establishment-modal';
        modal.style.cssText = `
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
            font-family: 'Arial', sans-serif;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #4a9eff;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(74, 158, 255, 0.3);
            animation: slideIn 0.5s ease-out;
        `;
        
        dialog.innerHTML = `
            <div style="color: #4a9eff; font-size: 24px; margin-bottom: 20px; font-weight: bold;">
                🌌 Base Establishment Available!
            </div>
            <div style="color: #ffffff; font-size: 16px; margin-bottom: 25px; line-height: 1.5;">
                Congratulations! You have reached 1000 steps and can now establish your cosmic base.<br>
                This will be your territory in the infinite cosmic realm.
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button id="establish-base-btn" style="
                    background: linear-gradient(45deg, #4a9eff, #00d4ff);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">🏗️ Establish Base</button>
                <button id="close-base-dialog-btn" style="
                    background: linear-gradient(45deg, #666, #888);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">❌ Close</button>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #establish-base-btn:hover, #close-base-dialog-btn:hover {
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('establish-base-btn').addEventListener('click', () => {
            console.log('🏗️ Base establishment confirmed!');
            console.log('🏗️ Calling handleBaseEstablishment...');
            try {
                this.handleBaseEstablishment();
                console.log('🏗️ handleBaseEstablishment completed');
            } catch (error) {
                console.error('🏗️ Error in handleBaseEstablishment:', error);
            }
            this.closeFallbackDialog();
        });
        
        document.getElementById('close-base-dialog-btn').addEventListener('click', () => {
            console.log('🏗️ Base establishment dialog closed');
            this.closeFallbackDialog();
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeFallbackDialog();
            }
        });
        
        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeFallbackDialog();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    closeFallbackDialog() {
        const modal = document.getElementById('fallback-base-establishment-modal');
        if (modal) {
            modal.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        }
    }
    
    handleBaseEstablishment() {
        console.log('🏗️ Handling base establishment...');
        console.log('🏗️ Step currency system context:', this);
        console.log('🏗️ Current step count:', this.totalSteps);
        
        // Here you can add the actual base establishment logic
        // For now, we'll just show a success message
        console.log('🏗️ Base establishment initiated! Your cosmic territory is being prepared...');
        
        // You can integrate with the actual base system here when it's available
        // For example: window.baseSystem.establishBase() or similar
        console.log('🏗️ Base establishment handling completed');
    }
    
    createSimpleBaseEstablishmentModal() {
        // Create a simple modal for base establishment
        const modal = document.createElement('div');
        modal.id = 'simple-base-establishment-modal';
        modal.style.cssText = `
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
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #8b5cf6;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            ">
                <h2 style="color: #8b5cf6; margin-bottom: 16px; font-size: 24px;">
                    🏗️ Establish Your Cosmic Base
                </h2>
                <p style="color: #e0e0e0; margin-bottom: 24px; line-height: 1.6;">
                    The cosmic energies have aligned! You have accumulated enough steps to establish a base in this realm. 
                    This will serve as your sanctuary and command center for future expeditions.
                </p>
                <div style="
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid #8b5cf6;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 24px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #f0f0f0;">Establish Base Cost:</span>
                        <span style="color: #e94560; font-weight: bold; font-size: 18px;">1000 Steps</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="color: #f0f0f0;">Your Current Steps:</span>
                        <span style="color: #00ff88; font-weight: bold; font-size: 18px;">${this.totalSteps}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 16px; justify-content: center;">
                    <button id="confirm-simple-base-establishment" style="
                        background: linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36));
                        color: white;
                        border: none;
                        padding: 16px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: 0.2s;
                        box-shadow: rgba(245, 158, 11, 0.3) 0px 4px 12px;
                    ">
                        <span class="icon">🏗️</span> Establish Base for 1000 Steps
                    </button>
                    <button id="cancel-simple-base-establishment" style="
                        background: rgba(255, 255, 255, 0.1);
                        color: #e0e0e0;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 16px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: 0.2s;
                    ">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('confirm-simple-base-establishment').onclick = () => {
            this.establishSimpleBase();
            modal.remove();
        };
        
        document.getElementById('cancel-simple-base-establishment').onclick = () => {
            modal.remove();
        };
    }
    
    establishSimpleBase(position = null) {
        console.log('🏗️ Establishing simple base...');
        console.log('🏗️ Current steps before base establishment:', this.totalSteps);
        
        // Check if player has enough steps
        if (this.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            return false;
        }
        
        // Deduct steps
        console.log('🏗️ Deducting 1000 steps for base establishment...');
        this.totalSteps -= 1000;
        console.log('🏗️ Steps after deduction:', this.totalSteps);
        this.saveSteps();
        this.updateStepCounter();
        console.log('🏗️ Step counter updated after base establishment');
        
        // Get position from parameter, or try to get current position
        let basePosition = position;
        
        if (!basePosition) {
            console.log('🏗️ No position provided, trying to get current player position...');
            
            // Try multiple sources for current position
            if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.geolocation) {
                basePosition = window.eldritchApp.systems.geolocation.getCurrentPosition();
                console.log('🏗️ Got position from eldritchApp.systems.geolocation:', basePosition);
            } else if (window.geolocationManager) {
                basePosition = window.geolocationManager.getCurrentPosition();
                console.log('🏗️ Got position from geolocationManager:', basePosition);
            } else if (window.mapEngine && window.mapEngine.getCurrentPlayerPosition) {
                basePosition = window.mapEngine.getCurrentPlayerPosition();
                console.log('🏗️ Got position from mapEngine.getCurrentPlayerPosition:', basePosition);
            } else if (window.mapEngine && window.mapEngine.playerPosition) {
                basePosition = window.mapEngine.playerPosition;
                console.log('🏗️ Got position from mapEngine.playerPosition:', basePosition);
            } else if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
                basePosition = window.mapLayer.getCurrentPlayerPosition();
                console.log('🏗️ Got position from mapLayer.getCurrentPlayerPosition:', basePosition);
            } else {
                // Try to get position from the actual player marker on the map
                if (window.mapEngine && window.mapEngine.map) {
                    const playerMarker = window.mapEngine.map._layers;
                    for (let layerId in playerMarker) {
                        const layer = playerMarker[layerId];
                        if (layer instanceof L.Marker && layer.options && layer.options.className && layer.options.className.includes('player-marker')) {
                            const latlng = layer.getLatLng();
                            basePosition = { lat: latlng.lat, lng: latlng.lng };
                            console.log('🏗️ Got position from player marker on map:', basePosition);
                            break;
                        }
                    }
                }
                
                // Last resort fallback - use MapLayer's current player position
                if (!basePosition) {
                    if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
                        basePosition = window.mapLayer.getCurrentPlayerPosition();
                        console.log('🏗️ Using MapLayer current player position:', basePosition);
                    } else {
                        basePosition = { lat: 61.4981, lng: 23.7608 };
                        console.warn('🏗️ Using hardcoded fallback position:', basePosition);
                    }
                }
            }
        }
        
        if (basePosition) {
                // Create base data
                const baseData = {
                lat: basePosition.lat,
                lng: basePosition.lng,
                    name: 'My Cosmic Base',
                established_at: new Date().toISOString(),
                level: 1,
                id: 'base_' + Date.now()
                };
                
                // Save to localStorage
                localStorage.setItem('playerBase', JSON.stringify(baseData));
                
            // Create base marker on map
            this.createBaseMarkerOnMap(basePosition);
            
            console.log('🏗️ Simple base established successfully!', baseData);
            return true;
            } else {
            console.warn('⚠️ Could not get position for base establishment');
            return false;
        }
    }
    
    createBaseMarkerOnMap(position) {
        console.log('🏗️ Creating base marker on map at position:', position);
        
        // Check if player has enough steps and deduct them
        if (this.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            return false;
        }
        
        // Deduct steps for base establishment
        console.log('🏗️ Deducting 1000 steps for base establishment...');
        console.log('🏗️ Current steps before base establishment:', this.totalSteps);
        this.totalSteps -= 1000;
        console.log('🏗️ Steps after deduction:', this.totalSteps);
        this.saveSteps();
        this.updateStepCounter();
        console.log('🏗️ Step counter updated after base establishment');
        
        // Create marker via server if connected
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🎮 Creating base marker via server...');
            window.websocketClient.establishBase(position);
            return true;
        }
        
        // Fallback to local creation
        console.log('⚠️ WebSocket not connected, creating base marker locally...');
        
        // Method 1: Use MapLayer's addBaseMarker method (most reliable)
        if (window.mapLayer && window.mapLayer.addBaseMarker) {
            console.log('🏗️ Creating base marker using MapLayer.addBaseMarker method');
            try {
                const marker = window.mapLayer.addBaseMarker(position);
                if (marker) {
                    console.log('🏗️ Base marker created successfully using MapLayer.addBaseMarker!');
                    return true;
                } else {
                    console.error('🏗️ MapLayer.addBaseMarker returned null');
                }
            } catch (error) {
                console.error('🏗️ Error creating base marker using MapLayer.addBaseMarker:', error);
            }
        }
        
        // Method 1b: Fallback to MapLayer's addMarker method
        if (window.mapLayer && window.mapLayer.addMarker) {
            console.log('🏗️ Creating base marker using MapLayer.addMarker method (fallback)');
            try {
                const baseIcon = L.divIcon({
                    className: 'base-marker cosmic-base',
                    html: `
                        <div style="position: relative; width: 60px; height: 60px;">
                            <!-- Outer cosmic ring -->
                            <div style="position: absolute; top: -10px; left: -10px; width: 80px; height: 80px; border: 2px solid #8b5cf6; border-radius: 50%; animation: cosmicRotate 8s linear infinite; opacity: 0.6;"></div>
                            
                            <!-- Middle energy ring -->
                            <div style="position: absolute; top: -5px; left: -5px; width: 70px; height: 70px; border: 1px solid #a78bfa; border-radius: 50%; animation: cosmicRotate 4s linear infinite reverse; opacity: 0.8;"></div>
                            
                            <!-- Base structure -->
                            <div style="position: absolute; top: 0px; left: 0px; width: 60px; height: 60px; background: radial-gradient(circle, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); border: 3px solid #8b5cf6; border-radius: 50%; box-shadow: 0 0 20px #8b5cf680, inset 0 0 20px #a78bfa40;"></div>
                            
                            <!-- Inner cosmic core -->
                            <div style="position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; background: radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, #d97706 100%); border-radius: 50%; animation: cosmicPulse 2s ease-in-out infinite; box-shadow: 0 0 15px #fbbf24, inset 0 0 10px #fbbf24;"></div>
                            
                            <!-- Central cosmic symbol -->
                            <div style="position: absolute; top: 20px; left: 20px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #1e1b4b; font-weight: bold; text-shadow: 0 0 5px #fbbf24; animation: cosmicGlow 1.5s ease-in-out infinite alternate;">★</div>
                            
                            <!-- Floating particles -->
                            <div style="position: absolute; top: 5px; left: 5px; width: 4px; height: 4px; background: #a78bfa; border-radius: 50%; animation: particleFloat1 3s ease-in-out infinite;"></div>
                            <div style="position: absolute; top: 15px; right: 5px; width: 3px; height: 3px; background: #fbbf24; border-radius: 50%; animation: particleFloat2 2.5s ease-in-out infinite;"></div>
                            <div style="position: absolute; bottom: 10px; left: 10px; width: 2px; height: 2px; background: #8b5cf6; border-radius: 50%; animation: particleFloat3 4s ease-in-out infinite;"></div>
                            <div style="position: absolute; bottom: 5px; right: 10px; width: 3px; height: 3px; background: #a78bfa; border-radius: 50%; animation: particleFloat4 3.5s ease-in-out infinite;"></div>
                        </div>
                    `,
                    iconSize: [60, 60],
                    iconAnchor: [30, 30]
                });
                
                const markerData = {
                    id: 'base-marker-' + Date.now(),
                    position: position,
                    type: 'base',
                    icon: baseIcon,
                    popup: `
                        <div style="text-align: center;">
                            <h3>🏗️ My Cosmic Base</h3>
                            <p>Established: ${new Date().toLocaleDateString()}</p>
                            <p>Level: 1</p>
                        </div>
                    `,
                    options: {
                        zIndexOffset: 2000
                    }
                };
                
                const success = window.mapLayer.addMarker(markerData.id, markerData);
                if (success) {
                    console.log('🏗️ Base marker created successfully using MapLayer.addMarker!');
                    return true;
        } else {
                    console.error('🏗️ MapLayer.addMarker returned false');
                }
            } catch (error) {
                console.error('🏗️ Error creating base marker using MapLayer.addMarker:', error);
            }
        }
        
        // Method 2: Fallback to direct map access - USE EXACT SAME MAP AS PLAYER MARKER
        if (window.mapLayer && window.mapLayer.map) {
            console.log('🏗️ Creating base marker using MapLayer.map (EXACT SAME MAP AS PLAYER MARKER)');
            console.log('🏗️ MapLayer.map reference:', window.mapLayer.map);
            console.log('🏗️ MapLayer.mapReady:', window.mapLayer.mapReady);
            
            try {
                // Create base marker icon similar to player marker
                const baseIcon = L.divIcon({
                    className: 'base-marker multilayered',
                    html: `
                        <div style="position: relative; width: 40px; height: 40px;">
                            <!-- Base aura -->
                            <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #ff000040 0%, transparent 70%); border-radius: 50%; animation: basePulse 2s infinite;"></div>
                            <!-- Base body -->
                            <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #ff000080;"></div>
                            <!-- Base emoji -->
                            <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
                        </div>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
                
                // Use EXACT same method as player marker creation
                const baseMarker = L.marker([position.lat, position.lng], { 
                    icon: baseIcon,
                    zIndexOffset: 2000
                }).addTo(window.mapLayer.map);
                
                baseMarker.bindPopup(`
                    <div style="text-align: center;">
                        <h3>🏗️ My Cosmic Base</h3>
                        <p>Established: ${new Date().toLocaleDateString()}</p>
                        <p>Level: 1</p>
                    </div>
                `);
                
                // Ensure marker is visible (same as player marker)
                baseMarker.setOpacity(1);
                baseMarker.setZIndexOffset(2000);
                
                console.log('🏗️ Base marker created successfully using EXACT SAME MAP as player marker!');
                console.log('🏗️ Base marker position:', baseMarker.getLatLng());
                console.log('🏗️ Base marker map reference:', baseMarker._map);
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker using direct map access:', error);
            }
        }
        
        // Method 2: Try using TerritoryLayer via layer manager
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            const territoryLayer = window.eldritchApp.layerManager.layers.get('territory');
            if (territoryLayer && territoryLayer.addTerritory) {
                console.log('🏗️ Creating base marker using TerritoryLayer');
                try {
                    territoryLayer.addTerritory('player-base', {
                        position: position,
                        radius: 50,
                        type: 'player',
                        level: 1,
                        owner: 'player'
                    });
                    console.log('🏗️ Base territory created successfully using TerritoryLayer');
                    return true;
                } catch (error) {
                    console.error('🏗️ Error creating base territory with TerritoryLayer:', error);
                }
            }
        }
        
        // Method 3: Try using mapEngine.map directly (if MapLayer not available)
        if (window.mapEngine && window.mapEngine.map && !window.mapLayer) {
            console.log('🏗️ Creating base marker using mapEngine.map (MapLayer not available)');
            try {
                const baseIcon = L.divIcon({
                    className: 'base-marker',
                    html: '🏗️',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                const baseMarker = L.marker([position.lat, position.lng], {
                    icon: baseIcon
                }).addTo(window.mapEngine.map);
                
                baseMarker.bindPopup(`
                    <div style="text-align: center;">
                        <h3>🏗️ My Cosmic Base</h3>
                        <p>Established: ${new Date().toLocaleDateString()}</p>
                        <p>Level: 1</p>
                    </div>
                `);
                
                console.log('🏗️ Base marker created successfully on map');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with mapEngine.map:', error);
            }
        }
        
        // Method 4: Try using mapEngine methods
        if (window.mapEngine && window.mapEngine.updateBaseMarker) {
            console.log('🏗️ Creating base marker using mapEngine.updateBaseMarker');
            try {
                window.mapEngine.updateBaseMarker(position);
                console.log('🏗️ Base marker created using updateBaseMarker');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with updateBaseMarker:', error);
            }
        }
        
        if (window.mapEngine && window.mapEngine.createBaseMarker) {
            console.log('🏗️ Creating base marker using mapEngine.createBaseMarker');
            try {
                window.mapEngine.createBaseMarker(position);
                console.log('🏗️ Base marker created using createBaseMarker');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with createBaseMarker:', error);
            }
        }
        
        // Method 5: Try using SimpleBaseInit
        if (window.SimpleBaseInit) {
            console.log('🏗️ Creating base marker using SimpleBaseInit');
            try {
                const simpleBase = new window.SimpleBaseInit();
                simpleBase.createNewBase(position);
                console.log('🏗️ Base marker created using SimpleBaseInit');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with SimpleBaseInit:', error);
            }
        }
        
        console.warn('⚠️ No map available to create base marker');
        return false;
    }
    
    // Test function to add steps (for development) - bypasses automatic detection check
    addTestSteps(amount = 1000) {
        console.log(`🧪 Adding ${amount} test steps...`);
        console.log(`🧪 Before: Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        
        // Disable fallback mode to prevent automatic step addition
        this.disableFallbackMode();
        
        // Temporarily enable step detection for manual test steps
        const wasAutoEnabled = this.autoStepDetectionEnabled;
        this.autoStepDetectionEnabled = true;
        
        // Add steps one by one to trigger milestone checking
        for (let i = 0; i < amount; i++) {
            this.totalSteps++;
            this.sessionSteps++;
            
            // Emit step change event for each step
            this.emitStepChangeEvent(1);
            
            // Check milestones after EVERY step to ensure 1000-step milestone triggers
            this.checkMilestones();
        }
        
        // Restore original auto detection setting
        this.autoStepDetectionEnabled = wasAutoEnabled;
        
        this.saveSteps();
        this.updateStepCounter();
        
        console.log(`🧪 After: Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
    }
    
    
    createStepCounter() {
        // Check if step counter already exists
        const existingCounter = document.getElementById('step-counter');
        if (existingCounter) {
            console.log('🚶‍♂️ Step counter already exists, removing duplicate');
            existingCounter.remove();
        }
        
        // Test button removed - using existing debug mechanism

        // Create step counter element (display only - controls handled by unified debug panel)
        const stepCounter = document.createElement('div');
        stepCounter.id = 'step-counter';
        stepCounter.innerHTML = `
            <div class="step-counter-container">
                <div class="step-icon">🚶‍♂️</div>
                <div class="step-number" id="step-number">${this.totalSteps}</div>
                <div class="step-label">COSMIC STEPS</div>
                <div class="step-session" id="step-session">+${this.sessionSteps}</div>
                <div class="step-info" style="font-size: 0.8em; color: #888; margin-top: 4px;">
                    Use Debug Panel for controls
                </div>
            </div>
        `;

        // Add to control panel or fallback to body
        const stepContainer = document.getElementById('step-counter-container');
        if (stepContainer) {
            stepContainer.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter created and added to control panel');
        } else {
            // Fallback to adding to body
            document.body.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter created and added to body (fallback)');
        }
        // Step controls now handled by unified debug panel
    }

    setupStepControls() {
        const incBtn = document.getElementById('step-increment');
        const decBtn = document.getElementById('step-decrement');
        if (!incBtn || !decBtn) return;

        // Remove any existing event listeners to prevent conflicts
        incBtn.replaceWith(incBtn.cloneNode(true));
        decBtn.replaceWith(decBtn.cloneNode(true));
        
        // Get fresh references after cloning
        const newIncBtn = document.getElementById('step-increment');
        const newDecBtn = document.getElementById('step-decrement');

        const startHold = (direction) => {
            let amount = 1;
            // Single tap immediate
            if (direction > 0) this.addManualStep(); else this.subtractSteps(1);
            // Hold acceleration
            let active = true;
            let intervalMs = 300;
            const tick = () => {
                if (!active) return;
                const count = Math.max(1, Math.floor(amount));
                if (direction > 0) {
                    for (let i = 0; i < count; i++) this.addManualStep();
                } else {
                    this.subtractSteps(count);
                }
                amount *= 1.5; // exponential growth
                setTimeout(tick, intervalMs);
            };
            // Start after short delay to differentiate click vs hold
            const holdTimeout = setTimeout(() => {
                if (!active) return;
                tick();
            }, 350);
            return () => { active = false; clearTimeout(holdTimeout); };
        };

        const bindHold = (button, direction) => {
            let stop;
            const onDown = (e) => { e.preventDefault(); stop = startHold(direction); };
            const onUp = () => { if (stop) stop(); };
            button.addEventListener('mousedown', onDown);
            button.addEventListener('touchstart', onDown, { passive: true });
            ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => button.addEventListener(evt, onUp));
        };

        bindHold(newIncBtn, +1);
        bindHold(newDecBtn, -1);
    }
    
    updateStepCounter() {
        console.log(`🚶‍♂️ ===== STEP COUNTER UPDATE START =====`);
        console.log(`🚶‍♂️ Current values - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        console.log(`🚶‍♂️ Instance ID: ${this.instanceId}`);
        
        // Update ALL step counter elements (including legacy ones)
        const stepCount = document.getElementById('step-count');
        const stepNumber = document.getElementById('step-number');
        const stepSession = document.getElementById('step-session');
        const stepCountLegacy1 = document.getElementById('step-count-legacy-1');
        
        console.log(`🚶‍♂️ Element search results:`);
        console.log(`🚶‍♂️   - step-count element found: ${!!stepCount}`);
        console.log(`🚶‍♂️   - step-number element found: ${!!stepNumber}`);
        console.log(`🚶‍♂️   - step-session element found: ${!!stepSession}`);
        console.log(`🚶‍♂️   - step-count-legacy-1 element found: ${!!stepCountLegacy1}`);
        
        const stepValue = this.totalSteps.toLocaleString();
        const sessionValue = `+${this.sessionSteps}`;
        
        // Update step-count (header counter)
        if (stepCount) {
            const oldValue = stepCount.textContent;
            stepCount.textContent = stepValue;
            console.log(`🚶‍♂️ step-count updated: "${oldValue}" → "${stepCount.textContent}"`);
        } else {
            console.warn(`🚶‍♂️ step-count element not found! This is the primary counter.`);
        }
        
        // Update step-count-legacy-1 (legacy counter)
        if (stepCountLegacy1) {
            const oldValue = stepCountLegacy1.textContent;
            stepCountLegacy1.textContent = stepValue;
            console.log(`🚶‍♂️ step-count-legacy-1 updated: "${oldValue}" → "${stepCountLegacy1.textContent}"`);
        }
        
        // Update step-number (step counter display)
        if (stepNumber) {
            const oldValue = stepNumber.textContent;
            stepNumber.textContent = stepValue;
            console.log(`🚶‍♂️ step-number updated: "${oldValue}" → "${stepNumber.textContent}"`);
        }
        
        // Update step-session (session counter)
        if (stepSession) {
            const oldValue = stepSession.textContent;
            stepSession.textContent = sessionValue;
            console.log(`🚶‍♂️ step-session updated: "${oldValue}" → "${stepSession.textContent}"`);
        }
        
        // Add pulse animation to all step counters
        [stepCount, stepCountLegacy1, stepNumber].forEach(element => {
            if (element) {
                element.style.animation = 'stepPulse 0.5s ease-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
                console.log(`🚶‍♂️ Added pulse animation to ${element.id || 'element'}`);
            }
        });
        
        // Check if any step counter elements were found
        if (!stepCount && !stepNumber && !stepSession) {
            console.error(`🚶‍♂️ ❌ NO STEP COUNTER ELEMENTS FOUND!`);
            console.error(`🚶‍♂️ This means the step counter will not display properly.`);
            console.error(`🚶‍♂️ Expected elements: step-count, step-number, step-session`);
        }
        
        console.log(`🚶‍♂️ ===== STEP COUNTER UPDATE END =====`);
    }
    
    startStepDetection() {
        this.stepDetectionActive = true;
        console.log('🚶‍♂️ Step detection started');
        
        // Disable automatic step detection - only manual steps allowed
        this.autoStepDetectionEnabled = false;
        console.log('🧪 Automatic step detection disabled - only manual steps allowed');
        
        // Do not enable fallback mode - we want manual control only
    }
    
    stopStepDetection() {
        this.stepDetectionActive = false;
        console.log('🚶‍♂️ Step detection stopped');
    }
    
    setStepDetectionMode(gpsTracking) {
        if (gpsTracking) {
            // Only enable step detection if GPS is actually tracking with good accuracy
            if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
                const position = window.eldritchApp.systems.geolocation.getCurrentPosition();
                if (position && position.accuracy && position.accuracy <= 50) {
                    // Good GPS signal, enable step detection
                    this.stepDetectionActive = true;
                    console.log('🚶‍♂️ Step detection enabled - GPS tracking with good accuracy');
                } else {
                    // Poor GPS signal or fixed position, disable step detection
                    this.stepDetectionActive = false;
                    console.log('🚶‍♂️ Step detection disabled - using fixed position or poor GPS');
                }
            } else {
                this.stepDetectionActive = false;
                console.log('🚶‍♂️ Step detection disabled - no geolocation system');
            }
        } else {
            // GPS not tracking - disable step detection to prevent false steps
            this.stepDetectionActive = false;
            console.log('🚶‍♂️ Step detection disabled - GPS not tracking');
        }
    }
    
    // Google Fit integration (future enhancement)
    setupGoogleFit() {
        // Placeholder for Google Fit API integration
        console.log('🚶‍♂️ Google Fit integration ready for future implementation');
    }
    
    // Manual step addition for testing
    addManualStep() {
        this.addStep();
    }
    
    // Test milestone checking manually
    testMilestoneChecking() {
        console.log('🧪 Testing milestone checking manually...');
        console.log(`Current state - Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        this.checkMilestones();
    }
    
    // Enable/disable automatic step detection
    setAutoStepDetection(enabled) {
        this.autoStepDetectionEnabled = enabled;
        console.log(`🚶‍♂️ Automatic step detection ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    subtractSteps(count) {
        // Subtract steps (minimum 0)
        const stepsToSubtract = Math.min(count, this.totalSteps);
        this.totalSteps = Math.max(0, this.totalSteps - stepsToSubtract);
        this.sessionSteps = Math.max(0, this.sessionSteps - stepsToSubtract);
        
        console.log(`🚶‍♂️ Subtracted ${stepsToSubtract} steps. Total: ${this.totalSteps}`);
        
        this.updateStepCounter();
        this.saveSteps();
        
        return stepsToSubtract;
    }
    
    // Get current step statistics
    getStepStats() {
        return {
            totalSteps: this.totalSteps,
            sessionSteps: this.sessionSteps,
            detectionActive: this.stepDetectionActive
        };
    }
}

// Step currency system will be initialized by app.js
console.log('🚶‍♂️ Step currency system script loaded - will be initialized by app.js');

// Make functions available globally for debugging
window.addTestSteps = (amount) => {
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.addTestSteps(amount);
    } else {
        console.warn('Step currency system not available');
    }
};

window.testMilestoneChecking = () => {
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.testMilestoneChecking();
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to test base marker creation
window.testBaseMarker = () => {
    console.log('🧪 Testing base marker creation...');
    
    // Get the EXACT same position as the player marker
    let testPosition = null;
    if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
        testPosition = window.mapLayer.getCurrentPlayerPosition();
        console.log('🧪 Using player position for base marker:', testPosition);
    } else {
        testPosition = { lat: 61.472768, lng: 23.724032 }; // Default position
        console.log('🧪 Using default position for base marker:', testPosition);
    }
    
    if (window.stepCurrencySystem) {
        const success = window.stepCurrencySystem.createBaseMarkerOnMap(testPosition);
        console.log('🧪 Base marker creation result:', success);
        
        // Also check if marker is actually on the map
        if (window.mapLayer && window.mapLayer.map) {
            const layers = [];
            window.mapLayer.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layers.push({
                        type: 'Marker',
                        latlng: layer.getLatLng(),
                        options: layer.options
                    });
                }
            });
            console.log('🧪 Current markers on map:', layers);
        }
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to force update step counter
window.forceUpdateStepCounter = () => {
    console.log('🧪 Force updating step counter...');
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.updateStepCounter();
        console.log('🧪 Step counter updated. Current steps:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to force reset steps to 10,000
window.forceResetSteps = () => {
    console.log('🧪 Force resetting steps to 10,000...');
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.forceResetSteps();
        console.log('🧪 Steps reset complete. Current steps:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to add steps and test
window.addStepsAndTest = (amount = 100) => {
    console.log(`🧪 Adding ${amount} steps and testing...`);
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.addTestSteps(amount);
        console.log('🧪 Steps added. Current total:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to check all step counter elements
window.checkStepCounters = () => {
    console.log('🔍 Checking all step counter elements...');
    const elements = [
        'step-count',
        'step-number', 
        'step-session',
        'step-count-legacy-1'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: "${element.textContent}" (visible: ${element.offsetParent !== null})`);
        } else {
            console.log(`❌ ${id}: Not found`);
        }
    });
    
    // Check for duplicate IDs
    const allElements = document.querySelectorAll('[id*="step-count"], [id*="step-number"], [id*="step-session"]');
    console.log(`🔍 Found ${allElements.length} step-related elements total`);
    allElements.forEach(el => {
        console.log(`  - ${el.id}: "${el.textContent}" (tag: ${el.tagName})`);
    });
};

// Debug function to test base establishment
window.testBaseEstablishment = () => {
    console.log('🧪 Testing base establishment...');
    if (window.stepCurrencySystem) {
        console.log('🧪 Current steps before test:', window.stepCurrencySystem.totalSteps);
        const success = window.stepCurrencySystem.establishSimpleBase();
        console.log('🧪 Base establishment result:', success);
        console.log('🧪 Steps after test:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// SIMPLE debug function
window.testMap = () => {
    console.log('🔍 Testing map references...');
    console.log('window.mapEngine:', window.mapEngine);
    console.log('window.mapEngine.map:', window.mapEngine?.map);
    console.log('Player marker:', window.mapEngine?.playerMarker);
    
    // Check if legacy app exists
    console.log('window.eldritchApp:', window.eldritchApp);
    console.log('Legacy app systems:', window.eldritchApp?.systems);
    console.log('Legacy app mapEngine:', window.eldritchApp?.systems?.mapEngine);
    
    if (window.mapEngine) {
        console.log('MapEngine isInitialized:', window.mapEngine.isInitialized);
        console.log('MapEngine map exists:', !!window.mapEngine.map);
    }
    
    // Check if there are any global app instances
    console.log('Global app variable:', typeof app !== 'undefined' ? app : 'undefined');
    
    return 'test complete';
};

// Test creating a simple marker
window.testCreateMarker = () => {
    console.log('🧪 Testing marker creation...');
    
    if (!window.mapEngine || !window.mapEngine.map) {
        console.error('❌ MapEngine or map not available');
        return false;
    }
    
    try {
        const testPosition = { lat: 61.4981, lng: 23.7608 };
        
        const marker = L.marker([testPosition.lat, testPosition.lng]).addTo(window.mapEngine.map);
        marker.bindPopup('🧪 TEST MARKER');
        
        console.log('✅ Test marker created successfully!');
        console.log('Marker position:', marker.getLatLng());
        console.log('Marker map:', marker._map);
        
        return marker;
    } catch (error) {
        console.error('❌ Error creating test marker:', error);
        return false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StepCurrencySystem;
}
