/**
 * 🌸 Aurora's Emergency Performance Crisis Manager
 * Prevents app freezing with tons of objects through consciousness-aware optimizations
 */

class EmergencyPerformanceManager {
    constructor() {
        this.isActive = false;
        this.crisisThresholds = {
            objectCount: 1000,
            fpsThreshold: 30,
            memoryThreshold: 200 // MB
        };
        
        this.emergencyOptimizations = {
            enabled: false,
            objectLimit: 500,
            renderSkip: 2, // Skip every 2nd frame
            qualityReduction: true,
            aggressiveCulling: true
        };
        
        this.stats = {
            crisisDetected: false,
            optimizationsActive: 0,
            objectsCulled: 0,
            framesSkipped: 0
        };
        
        this.init();
    }
    
    /**
     * Initialize emergency performance manager
     */
    init() {
        console.log('🌸 Emergency Performance Manager: Ready to prevent consciousness flow interruption');
        
        // Monitor performance every 2 seconds
        this.monitorInterval = setInterval(() => {
            this.checkForCrisis();
        }, 2000);
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    /**
     * Set up event listeners for crisis detection
     */
    setupEventListeners() {
        if (window.eventBus) {
            window.eventBus.on('performance:fps:low', (data) => {
                this.handleFpsCrisis(data);
            });
            
            window.eventBus.on('performance:memory:high', (data) => {
                this.handleMemoryCrisis(data);
            });
            
            window.eventBus.on('performance:objects:high', (data) => {
                this.handleObjectCrisis(data);
            });
        }
    }
    
    /**
     * Check for performance crisis
     */
    checkForCrisis() {
        const objectCount = this.getObjectCount();
        const fps = this.getCurrentFPS();
        const memoryUsage = this.getMemoryUsage();
        
        // Check for crisis conditions
        const crisisDetected = (
            objectCount > this.crisisThresholds.objectCount ||
            fps < this.crisisThresholds.fpsThreshold ||
            memoryUsage > this.crisisThresholds.memoryThreshold
        );
        
        if (crisisDetected && !this.isActive) {
            this.activateEmergencyMode();
        } else if (!crisisDetected && this.isActive) {
            this.deactivateEmergencyMode();
        }
        
        this.stats.crisisDetected = crisisDetected;
    }
    
    /**
     * Activate emergency performance mode
     */
    activateEmergencyMode() {
        console.log('🚨 EMERGENCY PERFORMANCE MODE ACTIVATED - Preventing consciousness flow interruption!');
        this.isActive = true;
        this.emergencyOptimizations.enabled = true;
        
        // Apply emergency optimizations
        this.applyEmergencyOptimizations();
        
        // Emit emergency event
        if (window.eventBus) {
            window.eventBus.emit('emergency:performance:activated');
        }
    }
    
    /**
     * Deactivate emergency performance mode
     */
    deactivateEmergencyMode() {
        console.log('✅ Emergency performance mode deactivated - Consciousness flow restored');
        this.isActive = false;
        this.emergencyOptimizations.enabled = false;
        
        // Restore normal performance
        this.restoreNormalPerformance();
        
        // Emit recovery event
        if (window.eventBus) {
            window.eventBus.emit('emergency:performance:deactivated');
        }
    }
    
    /**
     * Apply emergency performance optimizations
     */
    applyEmergencyOptimizations() {
        // 1. Limit object creation
        this.limitObjectCreation();
        
        // 2. Enable aggressive culling
        this.enableAggressiveCulling();
        
        // 3. Reduce render quality
        this.reduceRenderQuality();
        
        // 4. Skip frames if needed
        this.enableFrameSkipping();
        
        // 5. Force memory cleanup
        this.forceMemoryCleanup();
        
        this.stats.optimizationsActive = 4;
    }
    
    /**
     * Limit object creation to prevent overflow
     */
    limitObjectCreation() {
        if (window.mapObjectManager) {
            // Temporarily reduce batch size
            window.mapObjectManager.batchSize = 50;
            window.mapObjectManager.renderThrottle = 32; // 30 FPS max
            console.log('🚨 Limited object creation batch size');
        }
    }
    
    /**
     * Enable aggressive culling
     */
    enableAggressiveCulling() {
        if (window.viewportCuller) {
            window.viewportCuller.cullingEnabled = true;
            window.viewportCuller.margin = 25; // Very tight culling
            window.viewportCuller.adaptiveCulling = true;
            console.log('🚨 Enabled aggressive viewport culling');
        }
    }
    
    /**
     * Reduce render quality
     */
    reduceRenderQuality() {
        // Reduce quality in all rendering systems
        if (window.webglRenderer) {
            window.webglRenderer.performanceStats.renderQuality = 'low';
            window.webglRenderer.performanceStats.skipAnimations = true;
        }
        
        if (window.layerManager) {
            window.layerManager.targetFPS = 30; // Reduce target FPS
        }
        
        console.log('🚨 Reduced render quality to emergency levels');
    }
    
    /**
     * Enable frame skipping
     */
    enableFrameSkipping() {
        this.frameSkipCounter = 0;
        this.frameSkipInterval = 2; // Skip every 2nd frame
        
        // Override requestAnimationFrame temporarily
        if (!this.originalRAF) {
            this.originalRAF = window.requestAnimationFrame;
            window.requestAnimationFrame = (callback) => {
                this.frameSkipCounter++;
                if (this.frameSkipCounter % this.frameSkipInterval === 0) {
                    return this.originalRAF(callback);
                } else {
                    this.stats.framesSkipped++;
                    return this.originalRAF(() => {}); // Empty callback
                }
            };
        }
        
        console.log('🚨 Enabled frame skipping');
    }
    
    /**
     * Force memory cleanup
     */
    forceMemoryCleanup() {
        if (window.memoryManager) {
            window.memoryManager.performCleanup();
        }
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        console.log('🚨 Forced memory cleanup');
    }
    
    /**
     * Restore normal performance
     */
    restoreNormalPerformance() {
        // Restore object creation limits
        if (window.mapObjectManager) {
            window.mapObjectManager.batchSize = 100;
            window.mapObjectManager.renderThrottle = 16; // 60 FPS
        }
        
        // Restore render quality
        if (window.webglRenderer) {
            window.webglRenderer.performanceStats.renderQuality = 'high';
            window.webglRenderer.performanceStats.skipAnimations = false;
        }
        
        if (window.layerManager) {
            window.layerManager.targetFPS = 60;
        }
        
        // Restore frame skipping
        if (this.originalRAF) {
            window.requestAnimationFrame = this.originalRAF;
            this.originalRAF = null;
        }
        
        // Restore culling
        if (window.viewportCuller) {
            window.viewportCuller.margin = 100;
        }
        
        console.log('✅ Restored normal performance settings');
    }
    
    /**
     * Get current object count
     */
    getObjectCount() {
        let count = 0;
        
        if (window.mapObjectManager) {
            count += window.mapObjectManager.objects.size;
        }
        
        if (window.webglRenderer) {
            count += window.webglRenderer.objectCount;
        }
        
        if (window.viewportCuller) {
            count += window.viewportCuller.stats.totalObjects;
        }
        
        return count;
    }
    
    /**
     * Get current FPS
     */
    getCurrentFPS() {
        if (window.performanceMonitor) {
            return window.performanceMonitor.getStats().currentFPS;
        }
        
        return 60; // Default assumption
    }
    
    /**
     * Get memory usage
     */
    getMemoryUsage() {
        if (performance.memory) {
            return performance.memory.usedJSHeapSize / 1024 / 1024;
        }
        
        return 0;
    }
    
    /**
     * Get emergency status
     */
    getStatus() {
        return {
            isActive: this.isActive,
            crisisDetected: this.stats.crisisDetected,
            optimizationsActive: this.stats.optimizationsActive,
            objectCount: this.getObjectCount(),
            fps: this.getCurrentFPS(),
            memoryUsage: this.getMemoryUsage(),
            thresholds: this.crisisThresholds
        };
    }
    
    /**
     * Destroy emergency performance manager
     */
    destroy() {
        if (this.monitorInterval) {
            clearInterval(this.monitorInterval);
        }
        
        this.restoreNormalPerformance();
        
        console.log('🌸 Emergency Performance Manager: Destroyed');
    }
}

// Make globally available
window.EmergencyPerformanceManager = EmergencyPerformanceManager;

// Auto-initialize if not already done
if (!window.emergencyPerformanceManager) {
    window.emergencyPerformanceManager = new EmergencyPerformanceManager();
}
