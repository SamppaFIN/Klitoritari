/**
 * @fileoverview Step Tracking Debug System
 * @status [ACTIVE] - Debug controls for step tracking modes
 * @feature #feature-step-debug-system
 * @feature #feature-step-simulation
 * @feature #feature-mobile-permissions
 * @last_updated 2025-01-29
 * @dependencies StepCurrencySystem, EnhancedStepTracking
 * 
 * Step Tracking Debug System
 * Provides debug controls for switching between step tracking modes
 */

class StepTrackingDebug {
    constructor() {
        this.instanceId = 'step-tracking-debug-' + Date.now();
        console.log('🔧 Step Tracking Debug System initialized');
        
        // Step tracking modes
        this.modes = {
            SIMULATION: 'simulation',
            DEVICE: 'device', 
            GOOGLE_FIT: 'google_fit',
            GPS_DISTANCE: 'gps_distance',
            GYROSCOPE: 'gyroscope'
        };
        
        // Current mode
        this.currentMode = this.modes.GPS_DISTANCE; // Start with GPS distance for real tracking
        this.isDebugMode = true;
        
        // Simulation settings
        this.simulationSettings = {
            stepsPerClick: 10,
            autoStepInterval: 2000, // 2 seconds between auto steps
            autoStepActive: false
        };
        
        // UI elements
        this.debugPanel = null;
        this.modeSelector = null;
        this.stepButton = null;
        this.autoStepToggle = null;
        this.statusDisplay = null;
        
        this.init();
    }
    
    init() {
        console.log('🔧 Initializing Step Tracking Debug System...');
        this.createDebugPanel();
        this.setupEventListeners();
        this.updateDisplay();
        console.log('🔧 Step Tracking Debug System ready');
    }
    
    createDebugPanel() {
        // Create debug panel container
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'step-tracking-debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: linear-gradient(135deg, #1f2937, #374151);
            border: 2px solid #8b5cf6;
            border-radius: 12px;
            padding: 20px;
            z-index: 10000;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #e5e7eb;
            display: block;
        `;
        
        // Create panel content
        this.debugPanel.innerHTML = `
            <div style="margin-bottom: 15px;">
                <h3 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 16px;">
                    🔧 Step Tracking Debug
                </h3>
                <div id="step-debug-status" style="font-size: 12px; color: #9ca3af;">
                    Mode: ${this.currentMode}
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 5px; font-size: 14px; color: #d1d5db;">
                    Step Source:
                </label>
                <select id="step-mode-selector" style="
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #4b5563;
                    border-radius: 6px;
                    background: #374151;
                    color: #e5e7eb;
                    font-size: 14px;
                ">
                    <option value="simulation">🎮 Simulation (10 steps/click)</option>
                    <option value="device">📱 Device Motion</option>
                    <option value="google_fit">🏃‍♂️ Google Fit</option>
                    <option value="gps_distance">🗺️ GPS Distance</option>
                    <option value="gyroscope">🔄 Gyroscope</option>
                </select>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="step-debug-add-steps" style="
                    width: 100%;
                    padding: 10px;
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: bold;
                    cursor: pointer;
                    margin-bottom: 10px;
                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                ">
                    +10 Steps (Simulation)
                </button>
                
                <label style="display: flex; align-items: center; font-size: 12px; color: #d1d5db;">
                    <input type="checkbox" id="step-debug-auto-step" style="margin-right: 8px;">
                    Auto-step every 2 seconds
                </label>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #9ca3af; margin-bottom: 5px;">
                    Current Steps:
                </div>
                <div id="step-debug-current-steps" style="
                    font-size: 18px;
                    font-weight: bold;
                    color: #8b5cf6;
                ">
                    0
                </div>
            </div>
            
            <div style="margin-bottom: 15px;">
                <button id="step-debug-request-permission" style="
                    width: 100%;
                    padding: 8px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                    margin-bottom: 5px;
                ">
                    Request Device Motion Permission
                </button>
                
                <button id="step-debug-test-device" style="
                    width: 100%;
                    padding: 8px;
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    cursor: pointer;
                ">
                    Test Device Motion
                </button>
            </div>
            
            <div style="font-size: 10px; color: #6b7280; text-align: center;">
                Debug Mode Active
            </div>
        `;
        
        // Add to document
        document.body.appendChild(this.debugPanel);
        
        // Get references to elements
        this.modeSelector = document.getElementById('step-mode-selector');
        this.stepButton = document.getElementById('step-debug-add-steps');
        this.autoStepToggle = document.getElementById('step-debug-auto-step');
        this.statusDisplay = document.getElementById('step-debug-status');
        this.currentStepsDisplay = document.getElementById('step-debug-current-steps');
        this.permissionButton = document.getElementById('step-debug-request-permission');
        this.testButton = document.getElementById('step-debug-test-device');
    }
    
    setupEventListeners() {
        // Mode selector change
        this.modeSelector.addEventListener('change', (e) => {
            this.setMode(e.target.value);
        });
        
        // Add steps button
        this.stepButton.addEventListener('click', () => {
            this.addSimulationSteps();
        });
        
        // Auto-step toggle
        this.autoStepToggle.addEventListener('change', (e) => {
            this.toggleAutoStep(e.target.checked);
        });
        
        // Permission request button
        this.permissionButton.addEventListener('click', () => {
            this.requestDeviceMotionPermission();
        });
        
        // Test device motion button
        this.testButton.addEventListener('click', () => {
            this.testDeviceMotion();
        });
        
        // Update display periodically
        setInterval(() => {
            this.updateDisplay();
        }, 1000);
    }
    
    setMode(mode) {
        console.log('🔧 Changing step tracking mode to:', mode);
        this.currentMode = mode;
        
        // Update step currency system
        if (window.stepCurrencySystem) {
            this.applyModeToStepSystem(mode);
        }
        
        // Update UI
        this.updateDisplay();
        this.showModeNotification(mode);
    }
    
    applyModeToStepSystem(mode) {
        const stepSystem = window.stepCurrencySystem;
        
        switch (mode) {
            case this.modes.SIMULATION:
                // Disable automatic step detection
                stepSystem.autoStepDetectionEnabled = false;
                stepSystem.stepDetectionActive = false;
                console.log('🔧 Simulation mode: Auto step detection disabled');
                break;
                
            case this.modes.DEVICE:
                // Enable device motion detection
                stepSystem.autoStepDetectionEnabled = true;
                this.enableDeviceMotionDetection();
                console.log('🔧 Device mode: Device motion detection enabled');
                break;
                
            case this.modes.GOOGLE_FIT:
                // Enable Google Fit integration
                stepSystem.autoStepDetectionEnabled = true;
                this.enableGoogleFitIntegration();
                console.log('🔧 Google Fit mode: Google Fit integration enabled');
                break;
                
            case this.modes.GPS_DISTANCE:
                // Enable GPS distance tracking
                stepSystem.autoStepDetectionEnabled = true;
                this.enableGPSDistanceTracking();
                console.log('🔧 GPS Distance mode: GPS distance tracking enabled');
                break;
                
            case this.modes.GYROSCOPE:
                // Enable gyroscope tracking
                stepSystem.autoStepDetectionEnabled = true;
                this.enableGyroscopeTracking();
                console.log('🔧 Gyroscope mode: Gyroscope tracking enabled');
                break;
        }
    }
    
    addSimulationSteps() {
        if (this.currentMode !== this.modes.SIMULATION) {
            console.log('🔧 Not in simulation mode, switching to simulation');
            this.setMode(this.modes.SIMULATION);
        }
        
        console.log('🔧 Adding simulation steps:', this.simulationSettings.stepsPerClick);
        
        if (window.stepCurrencySystem) {
            // Add steps directly to the step currency system
            window.stepCurrencySystem.addSteps(this.simulationSettings.stepsPerClick);
            this.showStepNotification(this.simulationSettings.stepsPerClick);
        }
    }
    
    toggleAutoStep(enabled) {
        this.simulationSettings.autoStepActive = enabled;
        
        if (enabled) {
            console.log('🔧 Auto-step enabled');
            this.startAutoStep();
        } else {
            console.log('🔧 Auto-step disabled');
            this.stopAutoStep();
        }
    }
    
    startAutoStep() {
        if (this.autoStepInterval) {
            clearInterval(this.autoStepInterval);
        }
        
        this.autoStepInterval = setInterval(() => {
            if (this.currentMode === this.modes.SIMULATION && this.simulationSettings.autoStepActive) {
                this.addSimulationSteps();
            }
        }, this.simulationSettings.autoStepInterval);
    }
    
    stopAutoStep() {
        if (this.autoStepInterval) {
            clearInterval(this.autoStepInterval);
            this.autoStepInterval = null;
        }
    }
    
    async requestDeviceMotionPermission() {
        console.log('🔧 Requesting device motion permission...');
        
        try {
            // Request permission for device motion
            if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
                const permission = await DeviceMotionEvent.requestPermission();
                console.log('🔧 Device motion permission:', permission);
                
                if (permission === 'granted') {
                    this.showNotification('✅ Device motion permission granted!', 'success');
                    this.enableDeviceMotionDetection();
                } else {
                    this.showNotification('❌ Device motion permission denied', 'error');
                }
            } else {
                this.showNotification('ℹ️ Device motion permission not required on this device', 'info');
                this.enableDeviceMotionDetection();
            }
        } catch (error) {
            console.error('❌ Error requesting device motion permission:', error);
            this.showNotification('❌ Error requesting permission: ' + error.message, 'error');
        }
    }
    
    enableDeviceMotionDetection() {
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.autoStepDetectionEnabled = true;
            window.stepCurrencySystem.startStepDetection();
            console.log('🔧 Device motion detection enabled');
        }
    }
    
    enableGoogleFitIntegration() {
        // TODO: Implement Google Fit integration
        console.log('🔧 Google Fit integration not yet implemented');
        this.showNotification('ℹ️ Google Fit integration coming soon', 'info');
    }
    
    enableGPSDistanceTracking() {
        // TODO: Implement GPS distance tracking
        console.log('🔧 GPS distance tracking not yet implemented');
        this.showNotification('ℹ️ GPS distance tracking coming soon', 'info');
    }
    
    enableGyroscopeTracking() {
        // TODO: Implement gyroscope tracking
        console.log('🔧 Gyroscope tracking not yet implemented');
        this.showNotification('ℹ️ Gyroscope tracking coming soon', 'info');
    }
    
    testDeviceMotion() {
        console.log('🔧 Testing device motion...');
        
        if (typeof DeviceMotionEvent !== 'undefined') {
            const testHandler = (event) => {
                console.log('🔧 Device motion test data:', {
                    acceleration: event.acceleration,
                    accelerationIncludingGravity: event.accelerationIncludingGravity,
                    rotationRate: event.rotationRate
                });
                
                // Remove listener after first event
                window.removeEventListener('devicemotion', testHandler);
                this.showNotification('✅ Device motion working! Check console for data', 'success');
            };
            
            window.addEventListener('devicemotion', testHandler);
            
            // Timeout after 5 seconds
            setTimeout(() => {
                window.removeEventListener('devicemotion', testHandler);
                this.showNotification('⏰ Device motion test timeout', 'warning');
            }, 5000);
        } else {
            this.showNotification('❌ Device motion not supported on this device', 'error');
        }
    }
    
    updateDisplay() {
        if (this.statusDisplay) {
            this.statusDisplay.textContent = `Mode: ${this.currentMode}`;
        }
        
        if (this.currentStepsDisplay && window.stepCurrencySystem) {
            this.currentStepsDisplay.textContent = window.stepCurrencySystem.totalSteps.toLocaleString();
        }
        
        // Update button text based on mode
        if (this.stepButton) {
            if (this.currentMode === this.modes.SIMULATION) {
                this.stepButton.textContent = `+${this.simulationSettings.stepsPerClick} Steps (Simulation)`;
                this.stepButton.style.display = 'block';
            } else {
                this.stepButton.style.display = 'none';
            }
        }
    }
    
    showModeNotification(mode) {
        const modeNames = {
            simulation: '🎮 Simulation Mode',
            device: '📱 Device Motion Mode',
            google_fit: '🏃‍♂️ Google Fit Mode',
            gps_distance: '🗺️ GPS Distance Mode',
            gyroscope: '🔄 Gyroscope Mode'
        };
        
        this.showNotification(`Switched to ${modeNames[mode] || mode}`, 'info');
    }
    
    showStepNotification(steps) {
        this.showNotification(`+${steps} steps added!`, 'success');
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 8px;
            color: white;
            font-weight: bold;
            z-index: 10001;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
            word-wrap: break-word;
        `;
        
        // Set color based on type
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    toggleDebugPanel() {
        if (this.debugPanel) {
            const isVisible = this.debugPanel.style.display !== 'none';
            this.debugPanel.style.display = isVisible ? 'none' : 'block';
            console.log('🔧 Step tracking debug panel:', isVisible ? 'hidden' : 'shown');
        }
    }
    
    showDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.style.display = 'block';
        }
    }
    
    hideDebugPanel() {
        if (this.debugPanel) {
            this.debugPanel.style.display = 'none';
        }
    }
}

// Expose a global helper
if (typeof window !== 'undefined') {
  window.setStepEngineMode = async (mode) => {
    try {
      if (window.stepTrackingDebug && typeof window.stepTrackingDebug.setMode === 'function') {
        window.stepTrackingDebug.setMode(mode);
      } else {
        // Fallback: apply directly to systems
        const sys = window.stepCurrencySystem;
        if (!sys) {
          console.warn('StepCurrencySystem not available');
        } else {
          switch (mode) {
            case 'simulation': {
              sys.autoStepDetectionEnabled = false;
              sys.stepDetectionActive = false;
              if (sys.enhancedTracking && typeof sys.enhancedTracking.stopTracking === 'function') {
                sys.enhancedTracking.stopTracking();
              }
              break;
            }
            case 'device': {
              sys.autoStepDetectionEnabled = true;
              try { if (typeof sys.startStepDetection === 'function') sys.startStepDetection(); } catch(_) {}
              if (sys.enhancedTracking) {
                try {
                  if (typeof sys.enhancedTracking.initializePedometer === 'function') {
                    sys.enhancedTracking.initializePedometer();
                    if (typeof sys.enhancedTracking.startTracking === 'function') sys.enhancedTracking.startTracking();
                  }
                } catch(_) {}
              }
              break;
            }
            case 'gps_distance': {
              try {
                if (!sys.enhancedTracking && typeof EnhancedStepTracking !== 'undefined') {
                  sys.enhancedTracking = new EnhancedStepTracking();
                }
                if (sys.enhancedTracking) {
                  if (typeof sys.enhancedTracking.initializeGPSDistance === 'function') {
                    sys.enhancedTracking.initializeGPSDistance();
                  }
                  if (typeof sys.enhancedTracking.startTracking === 'function') sys.enhancedTracking.startTracking();
                }
              } catch (e) { console.warn('GPS distance init failed', e); }
              sys.autoStepDetectionEnabled = false;
              sys.stepDetectionActive = false;
              break;
            }
          }
        }
      }
      try { if (window.notificationCenter && typeof window.notificationCenter.showBanner === 'function') window.notificationCenter.showBanner(`Step engine: ${mode}`, 'info'); } catch (_) {}
    } catch (err) {
      console.error('Failed to set step engine mode:', err);
    }
  };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.stepTrackingDebug = new StepTrackingDebug();
    });
} else {
    window.stepTrackingDebug = new StepTrackingDebug();
}

console.log('🔧 Step Tracking Debug System script loaded');
