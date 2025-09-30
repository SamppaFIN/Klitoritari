/**
 * @fileoverview Step Tracking Integration
 * @status [IN_DEVELOPMENT] - Integration between enhanced tracking and existing system
 * @feature #feature-step-tracking-integration
 * @bugfix #bug-pedometer-not-working
 * @last_updated 2025-01-29
 * @dependencies Enhanced Step Tracking, Step Currency System
 * @warning Do not modify without testing integration with existing systems
 * 
 * Step Tracking Integration
 * Bridges the enhanced step tracking system with the existing step currency system
 */

class StepTrackingIntegration {
    constructor() {
        this.enhancedTracking = null;
        this.stepCurrencySystem = null;
        this.isIntegrated = false;
        
        console.log('🔗 Step Tracking Integration initialized');
    }
    
    /**
     * Initialize the integration
     */
    async init() {
        console.log('🔗 Initializing Step Tracking Integration...');
        
        try {
            // Wait for both systems to be available
            await this.waitForSystems();
            
            // Initialize enhanced tracking
            this.enhancedTracking = new window.EnhancedStepTracking();
            await this.enhancedTracking.init();
            
            // Get existing step currency system
            this.stepCurrencySystem = window.eldritchApp?.systems?.stepCurrency;
            
            if (!this.stepCurrencySystem) {
                console.error('🔗 Step Currency System not found');
                return false;
            }
            
            // Setup integration
            this.setupIntegration();
            
            this.isIntegrated = true;
            console.log('🔗 Step Tracking Integration complete');
            
            return true;
            
        } catch (error) {
            console.error('🔗 Error initializing Step Tracking Integration:', error);
            return false;
        }
    }
    
    /**
     * Wait for required systems to be available
     */
    async waitForSystems() {
        return new Promise((resolve) => {
            const checkSystems = () => {
                if (window.eldritchApp?.systems?.stepCurrency && window.EnhancedStepTracking) {
                    resolve();
                } else {
                    setTimeout(checkSystems, 100);
                }
            };
            checkSystems();
        });
    }
    
    /**
     * Setup integration between systems
     */
    setupIntegration() {
        console.log('🔗 Setting up integration...');
        
        // Load existing step data
        this.loadExistingStepData();
        
        // Setup step update callback
        this.enhancedTracking.setStepUpdateCallback((stepData) => {
            this.handleStepUpdate(stepData);
        });
        
        // Setup method change callback
        this.enhancedTracking.setMethodChangeCallback((method) => {
            this.handleMethodChange(method);
        });
        
        // Override step currency system methods
        this.overrideStepCurrencyMethods();
        
        console.log('🔗 Integration setup complete');
    }
    
    /**
     * Load existing step data from step currency system
     */
    loadExistingStepData() {
        if (this.stepCurrencySystem) {
            const existingData = this.stepCurrencySystem.getStepData();
            if (existingData) {
                this.enhancedTracking.stepData.totalSteps = existingData.totalSteps || 0;
                this.enhancedTracking.stepData.sessionSteps = existingData.sessionSteps || 0;
                console.log(`🔗 Loaded existing step data: ${existingData.totalSteps} total steps`);
            }
        }
    }
    
    /**
     * Handle step updates from enhanced tracking
     */
    handleStepUpdate(stepData) {
        console.log(`🔗 Step update: ${stepData.totalSteps} total, ${stepData.sessionSteps} session, method: ${stepData.method}`);
        
        // Update step currency system
        if (this.stepCurrencySystem) {
            // Update internal step counts
            this.stepCurrencySystem.totalSteps = stepData.totalSteps;
            this.stepCurrencySystem.sessionSteps = stepData.sessionSteps;
            
            // Update UI
            this.stepCurrencySystem.updateStepCounter();
            
            // Check milestones
            this.stepCurrencySystem.checkMilestones();
            
            // Save to localStorage
            this.stepCurrencySystem.saveSteps();
        }
        
        // Update UI with method info
        this.updateMethodStatus(stepData.method);
    }
    
    /**
     * Handle method changes
     */
    handleMethodChange(method) {
        console.log(`🔗 Step tracking method changed to: ${method}`);
        this.updateMethodStatus(method);
    }
    
    /**
     * Override step currency system methods
     */
    overrideStepCurrencyMethods() {
        if (!this.stepCurrencySystem) return;
        
        // Override addStep method
        const originalAddStep = this.stepCurrencySystem.addStep.bind(this.stepCurrencySystem);
        this.stepCurrencySystem.addStep = (method = 'manual') => {
            console.log(`🔗 Manual step added via ${method}`);
            this.enhancedTracking.addStep(method);
        };
        
        // Override addTestSteps method
        const originalAddTestSteps = this.stepCurrencySystem.addTestSteps.bind(this.stepCurrencySystem);
        this.stepCurrencySystem.addTestSteps = (count = 100) => {
            console.log(`🔗 Test steps added: ${count}`);
            this.enhancedTracking.addSteps(count, 'test');
        };
        
        // Override startStepDetection method
        const originalStartStepDetection = this.stepCurrencySystem.startStepDetection.bind(this.stepCurrencySystem);
        this.stepCurrencySystem.startStepDetection = () => {
            console.log('🔗 Starting enhanced step detection');
            this.enhancedTracking.startTracking();
        };
        
        // Override stopStepDetection method
        const originalStopStepDetection = this.stepCurrencySystem.stopStepDetection.bind(this.stepCurrencySystem);
        this.stepCurrencySystem.stopStepDetection = () => {
            console.log('🔗 Stopping enhanced step detection');
            this.enhancedTracking.stopTracking();
        };
        
        console.log('🔗 Step currency system methods overridden');
    }
    
    /**
     * Update method status in UI
     */
    updateMethodStatus(method) {
        // Find or create method status element
        let statusElement = document.getElementById('step-method-status');
        if (!statusElement) {
            statusElement = document.createElement('div');
            statusElement.id = 'step-method-status';
            statusElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 1000;
            `;
            document.body.appendChild(statusElement);
        }
        
        // Update status text
        const methodNames = {
            'pedometer': '📱 Pedometer',
            'gps_distance': '📍 GPS Distance',
            'gyroscope': '🔄 Gyroscope',
            'google_fit': '🏃 Google Fit',
            'fallback': '⏰ Fallback',
            'unknown': '❓ Unknown'
        };
        
        statusElement.textContent = `Step Method: ${methodNames[method] || method}`;
    }
    
    /**
     * Get integration status
     */
    getStatus() {
        return {
            isIntegrated: this.isIntegrated,
            enhancedTracking: this.enhancedTracking ? this.enhancedTracking.getDebugInfo() : null,
            stepCurrencySystem: this.stepCurrencySystem ? this.stepCurrencySystem.getDebugInfo() : null
        };
    }
    
    /**
     * Switch to a specific tracking method
     */
    switchMethod(method) {
        if (!this.enhancedTracking) {
            console.error('🔗 Enhanced tracking not initialized');
            return false;
        }
        
        console.log(`🔗 Switching to method: ${method}`);
        return this.enhancedTracking.initializeMethod(method);
    }
    
    /**
     * Get available methods
     */
    getAvailableMethods() {
        return this.enhancedTracking ? Object.values(this.enhancedTracking.trackingMethods) : [];
    }
    
    /**
     * Update step length based on user height
     */
    updateStepLength(heightInCm) {
        if (this.enhancedTracking) {
            this.enhancedTracking.updateStepLength(heightInCm);
        }
    }
    
    /**
     * Reset step data
     */
    resetStepData() {
        if (this.enhancedTracking) {
            this.enhancedTracking.resetStepData();
        }
        
        if (this.stepCurrencySystem) {
            this.stepCurrencySystem.totalSteps = 0;
            this.stepCurrencySystem.sessionSteps = 0;
            this.stepCurrencySystem.saveSteps();
            this.stepCurrencySystem.updateStepCounter();
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other systems to initialize
    setTimeout(() => {
        window.stepTrackingIntegration = new StepTrackingIntegration();
        window.stepTrackingIntegration.init().then(success => {
            if (success) {
                console.log('🔗 Step Tracking Integration auto-initialized successfully');
            } else {
                console.error('🔗 Step Tracking Integration auto-initialization failed');
            }
        });
    }, 2000);
});

// Export for manual initialization
window.StepTrackingIntegration = StepTrackingIntegration;

console.log('🔗 Step Tracking Integration loaded');
