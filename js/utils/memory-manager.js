/**
 * MemoryManager - Memory management and garbage collection optimization
 * Monitors memory usage and triggers cleanup when needed
 */
class MemoryManager {
    constructor() {
        // Dynamic memory thresholds based on device capability
        const deviceMemory = navigator.deviceMemory || 4;
        this.memoryThreshold = Math.min(500, deviceMemory * 100); // Scale with device memory
        this.cleanupThreshold = this.memoryThreshold * 0.8; // 80% of threshold
        this.maxCleanupInterval = 60000; // 60 seconds (less frequent cleanup)
        
        console.log(`🧠 MemoryManager: Dynamic thresholds - ${this.memoryThreshold}MB limit, ${this.cleanupThreshold}MB cleanup`);
        this.lastCleanup = 0;
        
        // Memory tracking
        this.memoryUsage = 0;
        this.peakMemoryUsage = 0;
        this.cleanupCount = 0;
        
        // Object pools
        this.objectPools = new Map();
        this.poolSizes = new Map();
        
        // Weak references for automatic cleanup
        this.weakRefs = new Set();
        
        // Performance monitoring
        this.stats = {
            totalCleanups: 0,
            memoryFreed: 0,
            objectsRecycled: 0,
            averageMemoryUsage: 0,
            peakMemoryUsage: 0
        };
        
        this.init();
    }

    /**
     * Initialize memory manager
     */
    init() {
        console.log('🧠 MemoryManager: Initializing...');
        
        // Set up memory monitoring
        this.setupMemoryMonitoring();
        
        // Set up object pools
        this.setupObjectPools();
        
        console.log('🧠 MemoryManager: Initialized');
    }

    /**
     * Set up memory monitoring
     */
    setupMemoryMonitoring() {
        if (!performance.memory) {
            console.warn('🧠 Memory API not available, using fallback monitoring');
            return;
        }

        // Monitor memory usage every 5 seconds
        setInterval(() => {
            this.updateMemoryUsage();
        }, 5000);
    }

    /**
     * Update memory usage statistics
     */
    updateMemoryUsage() {
        if (performance.memory) {
            this.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024;
            this.peakMemoryUsage = Math.max(this.peakMemoryUsage, this.memoryUsage);
            
            // Update average memory usage
            this.stats.averageMemoryUsage = 
                (this.stats.averageMemoryUsage * 0.9) + (this.memoryUsage * 0.1);
            
            // Check if cleanup is needed
            if (this.memoryUsage > this.cleanupThreshold) {
                this.performCleanup();
            }
        }
    }

    /**
     * Set up object pools for common objects
     */
    setupObjectPools() {
        // Dynamic pool sizes based on device capability
        const deviceMemory = navigator.deviceMemory || 4;
        const poolMultiplier = Math.min(deviceMemory, 8);
        
        // Vector2 pool
        this.createObjectPool('Vector2', () => ({ x: 0, y: 0 }), 100 * poolMultiplier);
        
        // Vector3 pool
        this.createObjectPool('Vector3', () => ({ x: 0, y: 0, z: 0 }), 100 * poolMultiplier);
        
        // Color pool
        this.createObjectPool('Color', () => ({ r: 0, g: 0, b: 0, a: 1 }), 50 * poolMultiplier);
        
        // Rectangle pool
        this.createObjectPool('Rectangle', () => ({ x: 0, y: 0, width: 0, height: 0 }), 50 * poolMultiplier);
        
        // Map object pool for high-density scenarios
        this.createObjectPool('MapObject', () => ({
            id: '',
            type: 'POI',
            position: { x: 0, y: 0 },
            created: Date.now()
        }), 1000 * poolMultiplier);
        
        // Event data pool
        this.createObjectPool('EventData', () => ({}), 200);
    }

    /**
     * Create an object pool
     * @param {string} name - Pool name
     * @param {Function} factory - Object factory function
     * @param {number} maxSize - Maximum pool size
     */
    createObjectPool(name, factory, maxSize = 100) {
        this.objectPools.set(name, {
            factory,
            objects: [],
            maxSize,
            created: 0,
            reused: 0
        });
        this.poolSizes.set(name, 0);
    }

    /**
     * Get object from pool
     * @param {string} poolName - Pool name
     * @returns {Object} Object from pool
     */
    getFromPool(poolName) {
        const pool = this.objectPools.get(poolName);
        if (!pool) {
            console.warn(`🧠 Pool '${poolName}' not found`);
            return null;
        }

        if (pool.objects.length > 0) {
            const obj = pool.objects.pop();
            pool.reused++;
            this.poolSizes.set(poolName, pool.objects.length);
            return obj;
        } else {
            const obj = pool.factory();
            pool.created++;
            return obj;
        }
    }

    /**
     * Return object to pool
     * @param {string} poolName - Pool name
     * @param {Object} obj - Object to return
     */
    returnToPool(poolName, obj) {
        const pool = this.objectPools.get(poolName);
        if (!pool) {
            console.warn(`🧠 Pool '${poolName}' not found`);
            return;
        }

        if (pool.objects.length < pool.maxSize) {
            // Reset object properties
            this.resetObject(obj, poolName);
            pool.objects.push(obj);
            this.poolSizes.set(poolName, pool.objects.length);
            this.stats.objectsRecycled++;
        }
    }

    /**
     * Reset object properties
     * @param {Object} obj - Object to reset
     * @param {string} poolName - Pool name
     */
    resetObject(obj, poolName) {
        switch (poolName) {
            case 'Vector2':
                obj.x = 0;
                obj.y = 0;
                break;
            case 'Vector3':
                obj.x = 0;
                obj.y = 0;
                obj.z = 0;
                break;
            case 'Color':
                obj.r = 0;
                obj.g = 0;
                obj.b = 0;
                obj.a = 1;
                break;
            case 'Rectangle':
                obj.x = 0;
                obj.y = 0;
                obj.width = 0;
                obj.height = 0;
                break;
            case 'EventData':
                Object.keys(obj).forEach(key => delete obj[key]);
                break;
        }
    }

    /**
     * Perform memory cleanup with consciousness-aware optimization
     */
    performCleanup() {
        const now = Date.now();
        if (now - this.lastCleanup < this.maxCleanupInterval) {
            return; // Too soon for another cleanup
        }

        console.log('🧠 Performing consciousness-aware memory cleanup...');
        const startTime = performance.now();
        
        // Check if cleanup is actually needed
        if (this.memoryUsage < this.cleanupThreshold * 0.9) {
            console.log('🧠 Memory usage acceptable, skipping cleanup');
            return;
        }
        
        // Force garbage collection if available
        if (window.gc) {
            window.gc();
        }
        
        // Clean up object pools
        this.cleanupObjectPools();
        
        // Clean up weak references
        this.cleanupWeakReferences();
        
        // Emit cleanup event
        if (window.eventBus) {
            window.eventBus.emit('memory:cleanup', {
                memoryUsage: this.memoryUsage,
                threshold: this.cleanupThreshold
            });
        }
        
        this.lastCleanup = now;
        this.cleanupCount++;
        this.stats.totalCleanups++;
        
        const cleanupTime = performance.now() - startTime;
        console.log(`🧠 Memory cleanup completed in ${cleanupTime.toFixed(2)}ms`);
    }

    /**
     * Clean up object pools
     */
    cleanupObjectPools() {
        this.objectPools.forEach((pool, name) => {
            // Keep only half of the objects in each pool
            const targetSize = Math.floor(pool.maxSize / 2);
            if (pool.objects.length > targetSize) {
                pool.objects.splice(targetSize);
                this.poolSizes.set(name, pool.objects.length);
            }
        });
    }

    /**
     * Clean up weak references
     */
    cleanupWeakReferences() {
        const deadRefs = [];
        this.weakRefs.forEach(weakRef => {
            if (weakRef.deref() === undefined) {
                deadRefs.push(weakRef);
            }
        });
        
        deadRefs.forEach(weakRef => {
            this.weakRefs.delete(weakRef);
        });
    }

    /**
     * Add weak reference
     * @param {Object} obj - Object to track
     * @returns {WeakRef} Weak reference
     */
    addWeakReference(obj) {
        if (typeof WeakRef !== 'undefined') {
            const weakRef = new WeakRef(obj);
            this.weakRefs.add(weakRef);
            return weakRef;
        }
        return null;
    }

    /**
     * Get memory usage statistics
     * @returns {Object} Memory statistics
     */
    getMemoryStats() {
        return {
            currentUsage: this.memoryUsage,
            peakUsage: this.peakMemoryUsage,
            threshold: this.memoryThreshold,
            cleanupThreshold: this.cleanupThreshold,
            ...this.stats
        };
    }

    /**
     * Get object pool statistics
     * @returns {Object} Pool statistics
     */
    getPoolStats() {
        const stats = {};
        this.objectPools.forEach((pool, name) => {
            stats[name] = {
                currentSize: pool.objects.length,
                maxSize: pool.maxSize,
                created: pool.created,
                reused: pool.reused,
                efficiency: pool.created > 0 ? (pool.reused / (pool.created + pool.reused)) * 100 : 0
            };
        });
        return stats;
    }

    /**
     * Set memory thresholds
     * @param {number} threshold - Memory threshold in MB
     * @param {number} cleanupThreshold - Cleanup threshold in MB
     */
    setThresholds(threshold, cleanupThreshold) {
        this.memoryThreshold = threshold;
        this.cleanupThreshold = cleanupThreshold;
    }

    /**
     * Force cleanup
     */
    forceCleanup() {
        this.performCleanup();
    }

    /**
     * Destroy memory manager
     */
    destroy() {
        this.objectPools.clear();
        this.poolSizes.clear();
        this.weakRefs.clear();
        console.log('🧠 MemoryManager destroyed');
    }
}

// Make MemoryManager globally available
window.MemoryManager = MemoryManager;
