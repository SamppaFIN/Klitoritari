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
        
        this.init();
    }
    
    init() {
        console.log('🚶‍♂️ Initializing Step Currency System...');
        this.loadStoredSteps();
        this.setupDeviceMotion();
        this.setupGoogleFit();
        this.createStepCounter();
        this.startStepDetection();
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
            });
        } else {
            // Direct access (older browsers)
            this.enableDeviceMotion();
        }
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
        
        // Calculate total acceleration magnitude
        const magnitude = Math.sqrt(
            acceleration.x * acceleration.x +
            acceleration.y * acceleration.y +
            acceleration.z * acceleration.z
        );
        
        // Store recent acceleration data
        this.accelerationData.push({
            magnitude: magnitude,
            timestamp: Date.now()
        });
        
        // Keep only last 50 readings
        if (this.accelerationData.length > 50) {
            this.accelerationData.shift();
        }
        
        // Detect step pattern
        this.detectStep(magnitude);
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
        this.checkMilestones();
        this.saveSteps();
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
        
        // Get current player position
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const position = window.eldritchApp.systems.geolocation.getCurrentPosition();
            if (position) {
                // Add flag to Finnish flag layer
                if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                    window.mapEngine.finnishFlagLayer.addFlagPin(position.lat, position.lng);
                }
                
                // Show notification
                if (window.gruesomeNotifications) {
                    window.gruesomeNotifications.showNotification({
                        type: 'success',
                        title: 'Path Marked!',
                        message: '50 steps earned - Finnish flag placed on your path',
                        duration: 3000
                    });
                }
            }
        }
    }
    
    triggerCelebration() {
        console.log('🎉 100 steps reached - celebration time!');
        
        // Show celebration animation
        this.showStepCelebration();
        
        // Show notification
        if (window.gruesomeNotifications) {
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
    }
    
    triggerAreaUnlock() {
        console.log('🌍 1000 steps reached - new area unlocked!');
        // Implementation for area unlocking
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
            </div>
        `;

        // Add to control panel
        const stepContainer = document.getElementById('step-counter-container');
        if (stepContainer) {
            stepContainer.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter created and added to control panel');
        } else {
            console.error('🚶‍♂️ Step counter container not found, cannot create step counter');
        }
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
