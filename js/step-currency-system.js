/**
 * Step Currency System
 * Manages real-world step counting as the primary game currency
 */

class StepCurrencySystem {
    constructor() {
        this.totalSteps = 0;
        this.sessionSteps = 0;
        this.lastStepCount = 0;
        this.stepDetectionActive = false;
        this.accelerationData = [];
        this.stepThreshold = 2.5; // Higher acceleration threshold for step detection
        this.lastStepTime = 0;
        this.minStepInterval = 1000; // Minimum 1 second between steps
        this.stepCooldown = 2000; // 2 second cooldown after each step
        
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
        
        this.init();
    }
    
    setBaseBuildingLayer(layer) {
        this.baseBuildingLayer = layer;
        console.log('🏗️ Base building layer connected to step currency system');
    }
    
    init() {
        console.log('🚶‍♂️ Initializing Step Currency System...');
        this.loadStoredSteps();
        this.setupDeviceMotion();
        this.setupGoogleFit();
        this.createStepCounter();
        this.startStepDetection();
        this.optimizeForMobile();
    }
    
    loadStoredSteps() {
        // Load total steps from localStorage
        const stored = localStorage.getItem('eldritch_total_steps');
        if (stored) {
            this.totalSteps = parseInt(stored) || 0;
            console.log(`🚶‍♂️ Loaded ${this.totalSteps} total steps from storage`);
        }
    }
    
    saveSteps() {
        localStorage.setItem('eldritch_total_steps', this.totalSteps.toString());
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
        // Simulate steps for testing
        setInterval(() => {
            if (this.stepDetectionActive) {
                this.addStep();
            }
        }, 2000); // Add step every 2 seconds for testing
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
        this.totalSteps++;
        this.sessionSteps++;
        
        console.log(`🚶‍♂️ Step added! Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
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
        }
        
        this.checkMilestones();
        this.saveSteps();
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
        // Check for flag creation (every 50 steps)
        if (this.sessionSteps % this.milestones.flag === 0) {
            this.triggerFlagCreation();
        }
        
        // Check for celebration (every 100 steps)
        if (this.sessionSteps % this.milestones.celebration === 0) {
            this.triggerCelebration();
        }
        
        // Check for quest unlock (every 500 steps)
        if (this.totalSteps % this.milestones.quest === 0) {
            this.triggerQuestUnlock();
        }
        
        // Check for area unlock (every 1000 steps)
        if (this.totalSteps % this.milestones.area === 0) {
            this.triggerAreaUnlock();
        }
    }
    
    triggerFlagCreation() {
        console.log('🇫🇮 50 steps reached - creating flag!');
        
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
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
                console.log('🇫🇮 Using position for flag:', position);
                if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                    const layer = window.mapEngine.finnishFlagLayer;
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
        // Implementation for area unlocking
        if (window.soundManager) window.soundManager.playTerrifyingBling();
    }
    
    createStepCounter() {
        // Check if step counter already exists
        const existingCounter = document.getElementById('step-counter');
        if (existingCounter) {
            console.log('🚶‍♂️ Step counter already exists, removing duplicate');
            existingCounter.remove();
        }

        // Create step counter element
        const stepCounter = document.createElement('div');
        stepCounter.id = 'step-counter';
        stepCounter.innerHTML = `
            <div class="step-counter-container">
                <div class="step-icon">🚶‍♂️</div>
                <div class="step-number" id="step-number">${this.totalSteps}</div>
                <div class="step-label">COSMIC STEPS</div>
                <div class="step-session" id="step-session">+${this.sessionSteps}</div>
                <div class="step-controls" id="step-controls">
                    <button id="step-decrement" class="step-ctrl-btn" title="-1 step">−</button>
                    <button id="step-increment" class="step-ctrl-btn" title="+1 step">+</button>
                </div>
            </div>
        `;

        // Add to control panel
        const stepContainer = document.getElementById('step-counter-container');
        if (stepContainer) {
            stepContainer.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter created and added to control panel');
            this.setupStepControls();
        } else {
            console.error('🚶‍♂️ Step counter container not found, cannot create step counter');
        }
    }

    setupStepControls() {
        const incBtn = document.getElementById('step-increment');
        const decBtn = document.getElementById('step-decrement');
        if (!incBtn || !decBtn) return;

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
            button.addEventListener('touchstart', onDown, { passive: false });
            ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => button.addEventListener(evt, onUp));
        };

        bindHold(incBtn, +1);
        bindHold(decBtn, -1);
    }
    
    updateStepCounter() {
        const stepNumber = document.getElementById('step-number');
        const stepSession = document.getElementById('step-session');
        
        console.log(`🚶‍♂️ Updating step counter: ${this.totalSteps} total, ${this.sessionSteps} session`);
        
        if (stepNumber) {
            stepNumber.textContent = this.totalSteps.toLocaleString();
            
            // Add pulse animation
            stepNumber.style.animation = 'stepPulse 0.5s ease-out';
            setTimeout(() => {
                stepNumber.style.animation = '';
            }, 500);
            console.log('🚶‍♂️ Step number updated');
        } else {
            console.error('🚶‍♂️ Step number element not found');
        }
        
        if (stepSession) {
            stepSession.textContent = `+${this.sessionSteps}`;
            console.log('🚶‍♂️ Step session updated');
        } else {
            console.error('🚶‍♂️ Step session element not found');
        }
    }
    
    startStepDetection() {
        this.stepDetectionActive = true;
        console.log('🚶‍♂️ Step detection started');
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

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚶‍♂️ DOM loaded, initializing step currency system...');
        if (!window.stepCurrencySystem) {
            window.stepCurrencySystem = new StepCurrencySystem();
        }
    });
} else {
    console.log('🚶‍♂️ DOM already loaded, initializing step currency system...');
    if (!window.stepCurrencySystem) {
        window.stepCurrencySystem = new StepCurrencySystem();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StepCurrencySystem;
}
