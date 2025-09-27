/**
 * MobileOptimizer - Mobile-specific optimizations and features
 * Handles performance tuning, touch gestures, and mobile-specific functionality
 */
class MobileOptimizer {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isLowEnd = false;
        this.performanceMode = 'balanced'; // low, balanced, high
        this.targetFPS = this.isMobile ? 30 : 60;
        this.memoryThreshold = 200; // MB
        this.batteryLevel = null;
        this.isCharging = false;
        
        // Performance monitoring
        this.performance = {
            frameCount: 0,
            lastFPSUpdate: 0,
            averageFrameTime: 0,
            memoryUsage: 0,
            droppedFrames: 0
        };
        
        // Touch gesture handling
        this.touchGestures = {
            enabled: true,
            sensitivity: 1.0,
            doubleTapDelay: 300,
            longPressDelay: 500,
            swipeThreshold: 50
        };
        
        // Wake lock
        this.wakeLock = null;
        this.wakeLockSupported = 'wakeLock' in navigator;
        
        // Event listeners
        this.boundVisibilityChange = this.handleVisibilityChange.bind(this);
        this.boundBatteryChange = this.handleBatteryChange.bind(this);
        this.boundMemoryPressure = this.handleMemoryPressure.bind(this);
        
        this.init();
    }

    /**
     * Initialize mobile optimizer
     */
    init() {
        console.log('📱 MobileOptimizer: Initializing...');
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Detect device capabilities
        this.detectDeviceCapabilities();
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Initialize wake lock if supported
        if (this.wakeLockSupported) {
            this.initWakeLock();
        }
        
        console.log(`📱 MobileOptimizer: Initialized for ${this.isMobile ? 'mobile' : 'desktop'} device`);
    }

    /**
     * Detect if device is mobile
     * @returns {boolean} True if mobile
     */
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (window.innerWidth <= 768) ||
               ('ontouchstart' in window);
    }

    /**
     * Detect device capabilities
     */
    detectDeviceCapabilities() {
        // Check for low-end device indicators
        const indicators = [
            navigator.hardwareConcurrency <= 2,
            navigator.deviceMemory <= 2,
            window.innerWidth <= 480,
            /Android.*Chrome\/[0-5]/.test(navigator.userAgent)
        ];
        
        this.isLowEnd = indicators.filter(Boolean).length >= 2;
        
        // Adjust performance mode based on device
        if (this.isLowEnd) {
            this.performanceMode = 'low';
            this.targetFPS = 20;
        } else if (this.isMobile) {
            this.performanceMode = 'balanced';
            this.targetFPS = 30;
        } else {
            this.performanceMode = 'high';
            this.targetFPS = 60;
        }
        
        console.log(`📱 Device capabilities: ${this.isLowEnd ? 'Low-end' : 'Standard'} mobile device`);
        console.log(`📱 Performance mode: ${this.performanceMode}, Target FPS: ${this.targetFPS}`);
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Visibility change (app backgrounding)
        document.addEventListener('visibilitychange', this.boundVisibilityChange);
        
        // Battery API (if available)
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.batteryLevel = battery.level;
                this.isCharging = battery.charging;
                battery.addEventListener('levelchange', this.boundBatteryChange);
                battery.addEventListener('chargingchange', this.boundBatteryChange);
            });
        }
        
        // Memory pressure (if available)
        if ('memory' in performance) {
            setInterval(() => {
                this.performance.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
                if (this.performance.memoryUsage > this.memoryThreshold) {
                    this.handleMemoryPressure();
                }
            }, 5000);
        }
    }

    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        let lastTime = performance.now();
        
        const monitor = (currentTime) => {
            const deltaTime = currentTime - lastTime;
            this.performance.frameCount++;
            
            // Update average frame time
            this.performance.averageFrameTime = 
                (this.performance.averageFrameTime * 0.9) + (deltaTime * 0.1);
            
            // Check for dropped frames
            if (deltaTime > (1000 / this.targetFPS) * 1.5) {
                this.performance.droppedFrames++;
            }
            
            // Update FPS every second
            if (currentTime - this.performance.lastFPSUpdate >= 1000) {
                this.performance.fps = this.performance.frameCount;
                this.performance.frameCount = 0;
                this.performance.lastFPSUpdate = currentTime;
                
                // Adjust performance if needed
                this.adjustPerformance();
            }
            
            lastTime = currentTime;
            requestAnimationFrame(monitor);
        };
        
        requestAnimationFrame(monitor);
    }

    /**
     * Adjust performance based on current metrics
     */
    adjustPerformance() {
        const fps = this.performance.fps;
        const memoryUsage = this.performance.memoryUsage;
        
        // Reduce quality if FPS is too low
        if (fps < this.targetFPS * 0.8) {
            this.reduceQuality();
        }
        
        // Reduce quality if memory usage is too high
        if (memoryUsage > this.memoryThreshold) {
            this.reduceQuality();
        }
        
        // Increase quality if performance is good
        if (fps > this.targetFPS * 1.2 && memoryUsage < this.memoryThreshold * 0.8) {
            this.increaseQuality();
        }
    }

    /**
     * Reduce quality to improve performance
     */
    reduceQuality() {
        if (this.performanceMode === 'low') return;
        
        this.performanceMode = 'low';
        this.targetFPS = 20;
        
        // Emit event for layers to adjust quality
        if (window.eventBus) {
            window.eventBus.emit('mobile:quality:reduce', {
                mode: this.performanceMode,
                targetFPS: this.targetFPS
            });
        }
        
        console.log('📱 Performance reduced to low quality mode');
    }

    /**
     * Increase quality if performance allows
     */
    increaseQuality() {
        if (this.performanceMode === 'high') return;
        
        this.performanceMode = 'balanced';
        this.targetFPS = this.isMobile ? 30 : 60;
        
        // Emit event for layers to adjust quality
        if (window.eventBus) {
            window.eventBus.emit('mobile:quality:increase', {
                mode: this.performanceMode,
                targetFPS: this.targetFPS
            });
        }
        
        console.log('📱 Performance increased to balanced quality mode');
    }

    /**
     * Initialize wake lock
     */
    async initWakeLock() {
        try {
            this.wakeLock = await navigator.wakeLock.request('screen');
            console.log('📱 Wake lock acquired');
            
            this.wakeLock.addEventListener('release', () => {
                console.log('📱 Wake lock released');
            });
        } catch (error) {
            console.warn('📱 Wake lock not available:', error);
        }
    }

    /**
     * Release wake lock
     */
    async releaseWakeLock() {
        if (this.wakeLock) {
            await this.wakeLock.release();
            this.wakeLock = null;
            console.log('📱 Wake lock released');
        }
    }

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
        if (document.hidden) {
            // App is backgrounded
            this.pauseOptimizations();
            if (this.wakeLock) {
                this.releaseWakeLock();
            }
        } else {
            // App is foregrounded
            this.resumeOptimizations();
            if (this.wakeLockSupported) {
                this.initWakeLock();
            }
        }
    }

    /**
     * Handle battery change
     */
    handleBatteryChange() {
        // Adjust performance based on battery level
        if (this.batteryLevel < 0.2 && !this.isCharging) {
            this.reduceQuality();
        }
    }

    /**
     * Handle memory pressure
     */
    handleMemoryPressure() {
        console.warn('📱 Memory pressure detected, reducing quality');
        this.reduceQuality();
        
        // Emit event for garbage collection
        if (window.eventBus) {
            window.eventBus.emit('mobile:memory:pressure', {
                memoryUsage: this.performance.memoryUsage,
                threshold: this.memoryThreshold
            });
        }
    }

    /**
     * Pause optimizations when app is backgrounded
     */
    pauseOptimizations() {
        console.log('📱 Pausing mobile optimizations');
        // Emit event for layers to pause
        if (window.eventBus) {
            window.eventBus.emit('mobile:pause', {});
        }
    }

    /**
     * Resume optimizations when app is foregrounded
     */
    resumeOptimizations() {
        console.log('📱 Resuming mobile optimizations');
        // Emit event for layers to resume
        if (window.eventBus) {
            window.eventBus.emit('mobile:resume', {});
        }
    }

    /**
     * Get current performance metrics
     * @returns {Object} Performance metrics
     */
    getPerformanceMetrics() {
        return {
            ...this.performance,
            isMobile: this.isMobile,
            isLowEnd: this.isLowEnd,
            performanceMode: this.performanceMode,
            targetFPS: this.targetFPS,
            batteryLevel: this.batteryLevel,
            isCharging: this.isCharging,
            wakeLockActive: !!this.wakeLock
        };
    }

    /**
     * Get mobile-specific settings
     * @returns {Object} Mobile settings
     */
    getMobileSettings() {
        return {
            touchGestures: this.touchGestures,
            performanceMode: this.performanceMode,
            targetFPS: this.targetFPS,
            isMobile: this.isMobile,
            isLowEnd: this.isLowEnd
        };
    }

    /**
     * Update mobile settings
     * @param {Object} settings - Settings to update
     */
    updateMobileSettings(settings) {
        if (settings.touchGestures) {
            this.touchGestures = { ...this.touchGestures, ...settings.touchGestures };
        }
        if (settings.performanceMode) {
            this.performanceMode = settings.performanceMode;
        }
        if (settings.targetFPS) {
            this.targetFPS = settings.targetFPS;
        }
    }

    /**
     * Destroy mobile optimizer
     */
    destroy() {
        // Remove event listeners
        document.removeEventListener('visibilitychange', this.boundVisibilityChange);
        
        // Release wake lock
        if (this.wakeLock) {
            this.releaseWakeLock();
        }
        
        console.log('📱 MobileOptimizer destroyed');
    }
}

// Make MobileOptimizer globally available
window.MobileOptimizer = MobileOptimizer;
