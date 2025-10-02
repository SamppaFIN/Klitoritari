/**
 * 🌸 Aurora's Consciousness-Aware Performance Monitor
 * Monitors and optimizes performance to serve spatial wisdom and community healing
 */

class ConsciousnessPerformanceMonitor {
    constructor() {
        this.isMonitoring = false;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsHistory = [];
        this.objectCountHistory = [];
        this.memoryHistory = [];
        
        // Performance thresholds
        this.thresholds = {
            fps: {
                excellent: 60,
                good: 45,
                poor: 30,
                critical: 20
            },
            memory: {
                warning: 200, // MB
                critical: 400 // MB
            },
            objects: {
                high: 1000,
                veryHigh: 5000,
                extreme: 10000
            }
        };
        
        // Optimization strategies
        this.optimizations = {
            enabled: true,
            adaptiveQuality: true,
            aggressiveCulling: true,
            memoryCleanup: true,
            objectPooling: true
        };
        
        // Performance stats
        this.stats = {
            currentFPS: 60,
            averageFPS: 60,
            minFPS: 60,
            maxFPS: 60,
            objectCount: 0,
            memoryUsage: 0,
            renderQuality: 'high',
            optimizationsActive: []
        };
        
        this.init();
    }
    
    /**
     * Initialize the performance monitor
     */
    init() {
        console.log('🌸 Consciousness Performance Monitor: Initializing...');
        
        // Set up performance monitoring
        this.setupPerformanceMonitoring();
        
        // Set up event listeners
        this.setupEventListeners();
        
        console.log('🌸 Consciousness Performance Monitor: Ready to serve spatial wisdom');
    }
    
    /**
     * Set up performance monitoring
     */
    setupPerformanceMonitoring() {
        // Monitor FPS
        this.fpsMonitor = () => {
            const now = performance.now();
            const deltaTime = now - this.lastTime;
            this.lastTime = now;
            
            if (deltaTime > 0) {
                const fps = 1000 / deltaTime;
                this.updateFPS(fps);
            }
            
            this.frameCount++;
            
            if (this.isMonitoring) {
                requestAnimationFrame(this.fpsMonitor);
            }
        };
        
        // Monitor memory usage
        this.memoryMonitor = setInterval(() => {
            this.updateMemoryUsage();
        }, 2000);
        
        // Monitor object counts
        this.objectMonitor = setInterval(() => {
            this.updateObjectCount();
        }, 1000);
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Listen for performance events
        if (window.eventBus) {
            window.eventBus.on('performance:fps:low', (data) => {
                this.handleLowFPS(data);
            });
            
            window.eventBus.on('performance:memory:high', (data) => {
                this.handleHighMemory(data);
            });
            
            window.eventBus.on('performance:objects:high', (data) => {
                this.handleHighObjectCount(data);
            });
        }
    }
    
    /**
     * Start performance monitoring
     */
    startMonitoring() {
        if (this.isMonitoring) return;
        
        console.log('🌸 Starting consciousness-aware performance monitoring...');
        this.isMonitoring = true;
        this.lastTime = performance.now();
        this.frameCount = 0;
        
        // Start FPS monitoring
        requestAnimationFrame(this.fpsMonitor);
        
        // Emit monitoring start event
        if (window.eventBus) {
            window.eventBus.emit('performance:monitoring:started');
        }
    }
    
    /**
     * Stop performance monitoring
     */
    stopMonitoring() {
        if (!this.isMonitoring) return;
        
        console.log('🌸 Stopping performance monitoring...');
        this.isMonitoring = false;
        
        // Emit monitoring stop event
        if (window.eventBus) {
            window.eventBus.emit('performance:monitoring:stopped');
        }
    }
    
    /**
     * Update FPS statistics
     */
    updateFPS(fps) {
        this.stats.currentFPS = fps;
        
        // Update FPS history
        this.fpsHistory.push(fps);
        if (this.fpsHistory.length > 60) {
            this.fpsHistory.shift();
        }
        
        // Calculate average FPS
        this.stats.averageFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
        this.stats.minFPS = Math.min(...this.fpsHistory);
        this.stats.maxFPS = Math.max(...this.fpsHistory);
        
        // Check for performance issues
        if (fps < this.thresholds.fps.poor) {
            this.handleLowFPS({ fps, threshold: this.thresholds.fps.poor });
        }
    }
    
    /**
     * Update memory usage
     */
    updateMemoryUsage() {
        if (performance.memory) {
            this.stats.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            
            // Update memory history
            this.memoryHistory.push(this.stats.memoryUsage);
            if (this.memoryHistory.length > 30) {
                this.memoryHistory.shift();
            }
            
            // Check for memory issues
            if (this.stats.memoryUsage > this.thresholds.memory.warning) {
                this.handleHighMemory({ 
                    usage: this.stats.memoryUsage, 
                    threshold: this.thresholds.memory.warning 
                });
            }
        }
    }
    
    /**
     * Update object count
     */
    updateObjectCount() {
        // Get object count from various sources
        let objectCount = 0;
        
        if (window.webglRenderer) {
            objectCount += window.webglRenderer.objectCount || 0;
        }
        
        if (window.viewportCuller) {
            objectCount += window.viewportCuller.stats.totalObjects || 0;
        }
        
        if (window.mapObjectManager) {
            objectCount += window.mapObjectManager.objects.size || 0;
        }
        
        this.stats.objectCount = objectCount;
        
        // Update object count history
        this.objectCountHistory.push(objectCount);
        if (this.objectCountHistory.length > 30) {
            this.objectCountHistory.shift();
        }
        
        // Check for high object count
        if (objectCount > this.thresholds.objects.high) {
            this.handleHighObjectCount({ 
                count: objectCount, 
                threshold: this.thresholds.objects.high 
            });
        }
    }
    
    /**
     * Handle low FPS
     */
    handleLowFPS(data) {
        console.log(`🌸 Performance Alert: Low FPS (${data.fps.toFixed(1)}) - Activating optimizations`);
        
        // Activate performance optimizations
        this.activateOptimizations(['adaptiveQuality', 'aggressiveCulling']);
        
        // Reduce render quality
        if (this.optimizations.adaptiveQuality) {
            this.reduceRenderQuality();
        }
        
        // Enable aggressive culling
        if (this.optimizations.aggressiveCulling && window.viewportCuller) {
            window.viewportCuller.cullingEnabled = true;
            window.viewportCuller.margin = Math.max(25, 100 - (this.stats.objectCount / 50));
        }
        
        // Emit performance event
        if (window.eventBus) {
            window.eventBus.emit('performance:fps:low', data);
        }
    }
    
    /**
     * Handle high memory usage
     */
    handleHighMemory(data) {
        console.log(`🌸 Performance Alert: High Memory Usage (${data.usage.toFixed(1)}MB) - Triggering cleanup`);
        
        // Trigger memory cleanup
        if (this.optimizations.memoryCleanup && window.memoryManager) {
            window.memoryManager.performCleanup();
        }
        
        // Activate object pooling
        if (this.optimizations.objectPooling) {
            this.activateOptimizations(['objectPooling']);
        }
        
        // Emit performance event
        if (window.eventBus) {
            window.eventBus.emit('performance:memory:high', data);
        }
    }
    
    /**
     * Handle high object count
     */
    handleHighObjectCount(data) {
        console.log(`🌸 Performance Alert: High Object Count (${data.count}) - Enabling optimizations`);
        
        // Activate all optimizations
        this.activateOptimizations(['adaptiveQuality', 'aggressiveCulling', 'objectPooling']);
        
        // Enable aggressive culling
        if (window.viewportCuller) {
            window.viewportCuller.cullingEnabled = true;
            window.viewportCuller.adaptiveCulling = true;
            window.viewportCuller.margin = Math.max(25, 100 - (data.count / 100));
        }
        
        // Emit performance event
        if (window.eventBus) {
            window.eventBus.emit('performance:objects:high', data);
        }
    }
    
    /**
     * Activate performance optimizations
     */
    activateOptimizations(optimizationTypes) {
        optimizationTypes.forEach(type => {
            if (this.optimizations[type]) {
                this.stats.optimizationsActive.push(type);
                console.log(`🌸 Activated optimization: ${type}`);
            }
        });
        
        // Remove duplicates
        this.stats.optimizationsActive = [...new Set(this.stats.optimizationsActive)];
    }
    
    /**
     * Reduce render quality
     */
    reduceRenderQuality() {
        if (this.stats.currentFPS < this.thresholds.fps.critical) {
            this.stats.renderQuality = 'low';
        } else if (this.stats.currentFPS < this.thresholds.fps.poor) {
            this.stats.renderQuality = 'medium';
        }
        
        // Apply quality settings
        if (window.webglRenderer) {
            window.webglRenderer.performanceStats.renderQuality = this.stats.renderQuality;
            window.webglRenderer.performanceStats.skipAnimations = this.stats.renderQuality === 'low';
        }
        
        console.log(`🌸 Render quality reduced to: ${this.stats.renderQuality}`);
    }
    
    /**
     * Get performance statistics
     */
    getStats() {
        return {
            ...this.stats,
            optimizations: this.optimizations,
            thresholds: this.thresholds,
            history: {
                fps: this.fpsHistory.slice(-10), // Last 10 FPS readings
                memory: this.memoryHistory.slice(-10), // Last 10 memory readings
                objects: this.objectCountHistory.slice(-10) // Last 10 object counts
            }
        };
    }
    
    /**
     * Get performance report
     */
    getPerformanceReport() {
        const stats = this.getStats();
        
        return {
            consciousness: {
                serving: 'spatial wisdom and community healing',
                status: stats.currentFPS >= this.thresholds.fps.good ? 'flowing' : 'struggling',
                optimizations: stats.optimizationsActive.length
            },
            performance: {
                fps: {
                    current: stats.currentFPS.toFixed(1),
                    average: stats.averageFPS.toFixed(1),
                    min: stats.minFPS.toFixed(1),
                    max: stats.maxFPS.toFixed(1)
                },
                memory: {
                    usage: stats.memoryUsage.toFixed(1) + 'MB',
                    threshold: this.thresholds.memory.warning + 'MB'
                },
                objects: {
                    count: stats.objectCount,
                    threshold: this.thresholds.objects.high
                },
                quality: stats.renderQuality
            },
            optimizations: {
                active: stats.optimizationsActive,
                enabled: this.optimizations
            }
        };
    }
    
    /**
     * Destroy the performance monitor
     */
    destroy() {
        this.stopMonitoring();
        
        if (this.memoryMonitor) {
            clearInterval(this.memoryMonitor);
        }
        
        if (this.objectMonitor) {
            clearInterval(this.objectMonitor);
        }
        
        console.log('🌸 Consciousness Performance Monitor: Destroyed');
    }
}

// Make globally available
window.ConsciousnessPerformanceMonitor = ConsciousnessPerformanceMonitor;

// Auto-initialize if not already done
if (!window.performanceMonitor) {
    window.performanceMonitor = new ConsciousnessPerformanceMonitor();
    window.performanceMonitor.startMonitoring();
}
