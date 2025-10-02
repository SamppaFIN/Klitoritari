/**
 * 🌸 SACRED OBJECT POOL ENHANCEMENT
 * 
 * Enhanced object pooling system for consciousness-aware sacred objects.
 * Implements object pool pattern with consciousness-level-based optimization.
 * 
 * Sacred Purpose: Optimizes performance for sacred object creation and
 * management while maintaining consciousness-aware functionality.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Sacred Object Pool - Consciousness-aware object pooling
 */
class SacredObjectPool {
    constructor(objectType, poolSize, consciousnessLevel = 0) {
        this.objectType = objectType;
        this.poolSize = poolSize;
        this.consciousnessLevel = consciousnessLevel;
        this.pool = [];
        this.activeObjects = new Set();
        this.poolStats = {
            totalCreated: 0,
            totalReused: 0,
            totalDestroyed: 0,
            currentPoolSize: 0,
            currentActiveCount: 0
        };
        
        this.setupPool();
        console.log(`🌸 Sacred Object Pool initialized: ${objectType.name} (size: ${poolSize})`);
    }
    
    /**
     * Setup object pool
     */
    setupPool() {
        for (let i = 0; i < this.poolSize; i++) {
            const obj = new this.objectType();
            obj.deactivate();
            obj.consciousnessLevel = this.consciousnessLevel;
            obj.poolId = `pool-${i}`;
            this.pool.push(obj);
        }
        
        this.poolStats.currentPoolSize = this.poolSize;
        this.poolStats.totalCreated = this.poolSize;
    }
    
    /**
     * Get object from pool
     * @param {Object} position - Position for object
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Object options
     * @returns {Object} Pooled object
     */
    getObject(position, consciousnessLevel, options = {}) {
        let obj;
        
        if (this.pool.length > 0) {
            // Reuse existing object from pool
            obj = this.pool.pop();
            this.poolStats.totalReused++;
            this.poolStats.currentPoolSize--;
        } else {
            // Create new object if pool is empty
            obj = new this.objectType();
            obj.poolId = `new-${Date.now()}`;
            this.poolStats.totalCreated++;
        }
        
        // Configure object
        obj.position = position;
        obj.consciousnessLevel = consciousnessLevel;
        obj.options = options;
        obj.isActive = true;
        obj.createdAt = Date.now();
        
        // Initialize object
        obj.initialize();
        
        // Add to active objects
        this.activeObjects.add(obj);
        this.poolStats.currentActiveCount++;
        
        console.log(`🌸 Object retrieved from pool: ${obj.poolId} (active: ${this.poolStats.currentActiveCount})`);
        
        return obj;
    }
    
    /**
     * Return object to pool
     * @param {Object} obj - Object to return
     */
    returnObject(obj) {
        if (!this.activeObjects.has(obj)) {
            console.warn(`🌸 Object ${obj.poolId} not found in active objects`);
            return;
        }
        
        // Deactivate object
        obj.deactivate();
        obj.isActive = false;
        obj.position = null;
        obj.consciousnessLevel = 0;
        obj.options = {};
        
        // Remove from active objects
        this.activeObjects.delete(obj);
        this.poolStats.currentActiveCount--;
        
        // Return to pool if not at capacity
        if (this.pool.length < this.poolSize) {
            this.pool.push(obj);
            this.poolStats.currentPoolSize++;
        } else {
            // Destroy object if pool is full
            obj.destroy();
            this.poolStats.totalDestroyed++;
        }
        
        console.log(`🌸 Object returned to pool: ${obj.poolId} (pool: ${this.poolStats.currentPoolSize})`);
    }
    
    /**
     * Update consciousness level for all objects
     * @param {number} newLevel - New consciousness level
     */
    updateConsciousnessLevel(newLevel) {
        this.consciousnessLevel = newLevel;
        
        // Update consciousness level for all objects in pool
        this.pool.forEach(obj => {
            obj.consciousnessLevel = newLevel;
        });
        
        // Update consciousness level for all active objects
        this.activeObjects.forEach(obj => {
            obj.consciousnessLevel = newLevel;
            obj.updateConsciousnessEffects(0); // Trigger consciousness update
        });
        
        console.log(`🌸 Pool consciousness level updated to: ${newLevel}`);
    }
    
    /**
     * Update all active objects
     * @param {number} deltaTime - Time since last update
     */
    updateAll(deltaTime) {
        this.activeObjects.forEach(obj => {
            if (obj.update) {
                obj.update(deltaTime);
            }
        });
    }
    
    /**
     * Get pool statistics
     * @returns {Object} Pool statistics
     */
    getStatistics() {
        return {
            ...this.poolStats,
            consciousnessLevel: this.consciousnessLevel,
            poolUtilization: (this.poolStats.currentActiveCount / this.poolSize) * 100,
            reuseRate: this.poolStats.totalReused / (this.poolStats.totalReused + this.poolStats.totalCreated) * 100
        };
    }
    
    /**
     * Clear pool
     */
    clear() {
        // Destroy all active objects
        this.activeObjects.forEach(obj => {
            obj.destroy();
        });
        this.activeObjects.clear();
        
        // Destroy all pooled objects
        this.pool.forEach(obj => {
            obj.destroy();
        });
        this.pool = [];
        
        this.poolStats.currentActiveCount = 0;
        this.poolStats.currentPoolSize = 0;
        
        console.log('🌸 Sacred Object Pool cleared');
    }
    
    /**
     * Resize pool
     * @param {number} newSize - New pool size
     */
    resize(newSize) {
        const oldSize = this.poolSize;
        this.poolSize = newSize;
        
        if (newSize > oldSize) {
            // Add more objects to pool
            for (let i = oldSize; i < newSize; i++) {
                const obj = new this.objectType();
                obj.deactivate();
                obj.consciousnessLevel = this.consciousnessLevel;
                obj.poolId = `pool-${i}`;
                this.pool.push(obj);
            }
            this.poolStats.currentPoolSize = newSize;
            this.poolStats.totalCreated += (newSize - oldSize);
        } else if (newSize < oldSize) {
            // Remove objects from pool
            const objectsToRemove = oldSize - newSize;
            for (let i = 0; i < objectsToRemove && this.pool.length > 0; i++) {
                const obj = this.pool.pop();
                obj.destroy();
                this.poolStats.totalDestroyed++;
            }
            this.poolStats.currentPoolSize = this.pool.length;
        }
        
        console.log(`🌸 Pool resized from ${oldSize} to ${newSize}`);
    }
}

/**
 * Sacred Object Pool Manager - Manages multiple object pools
 */
class SacredObjectPoolManager {
    constructor() {
        this.pools = new Map();
        this.globalConsciousnessLevel = 0;
        this.updateInterval = null;
        this.isUpdating = false;
        
        this.startUpdateLoop();
        console.log('🌸 Sacred Object Pool Manager initialized');
    }
    
    /**
     * Create object pool
     * @param {string} poolName - Name of the pool
     * @param {Function} objectType - Object constructor
     * @param {number} poolSize - Pool size
     * @param {number} consciousnessLevel - Consciousness level
     * @returns {SacredObjectPool} Created pool
     */
    createPool(poolName, objectType, poolSize, consciousnessLevel = 0) {
        if (this.pools.has(poolName)) {
            console.warn(`🌸 Pool ${poolName} already exists`);
            return this.pools.get(poolName);
        }
        
        const pool = new SacredObjectPool(objectType, poolSize, consciousnessLevel);
        this.pools.set(poolName, pool);
        
        console.log(`🌸 Pool created: ${poolName} (size: ${poolSize})`);
        
        return pool;
    }
    
    /**
     * Get object from pool
     * @param {string} poolName - Name of the pool
     * @param {Object} position - Position for object
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Object options
     * @returns {Object} Pooled object
     */
    getObject(poolName, position, consciousnessLevel, options = {}) {
        const pool = this.pools.get(poolName);
        if (!pool) {
            console.error(`🌸 Pool ${poolName} not found`);
            return null;
        }
        
        return pool.getObject(position, consciousnessLevel, options);
    }
    
    /**
     * Return object to pool
     * @param {string} poolName - Name of the pool
     * @param {Object} obj - Object to return
     */
    returnObject(poolName, obj) {
        const pool = this.pools.get(poolName);
        if (!pool) {
            console.error(`🌸 Pool ${poolName} not found`);
            return;
        }
        
        pool.returnObject(obj);
    }
    
    /**
     * Update global consciousness level
     * @param {number} newLevel - New consciousness level
     */
    updateGlobalConsciousnessLevel(newLevel) {
        this.globalConsciousnessLevel = newLevel;
        
        // Update all pools
        this.pools.forEach((pool, poolName) => {
            pool.updateConsciousnessLevel(newLevel);
        });
        
        console.log(`🌸 Global consciousness level updated to: ${newLevel}`);
    }
    
    /**
     * Update all pools
     * @param {number} deltaTime - Time since last update
     */
    updateAllPools(deltaTime) {
        if (this.isUpdating) return;
        
        this.isUpdating = true;
        
        this.pools.forEach((pool, poolName) => {
            pool.updateAll(deltaTime);
        });
        
        this.isUpdating = false;
    }
    
    /**
     * Start update loop
     */
    startUpdateLoop() {
        const update = () => {
            this.updateAllPools(16); // ~60fps
            this.updateInterval = setTimeout(update, 16);
        };
        
        update();
    }
    
    /**
     * Stop update loop
     */
    stopUpdateLoop() {
        if (this.updateInterval) {
            clearTimeout(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Get pool statistics
     * @param {string} poolName - Name of the pool (optional)
     * @returns {Object} Pool statistics
     */
    getStatistics(poolName = null) {
        if (poolName) {
            const pool = this.pools.get(poolName);
            return pool ? pool.getStatistics() : null;
        }
        
        // Return global statistics
        const globalStats = {
            totalPools: this.pools.size,
            globalConsciousnessLevel: this.globalConsciousnessLevel,
            pools: {}
        };
        
        this.pools.forEach((pool, name) => {
            globalStats.pools[name] = pool.getStatistics();
        });
        
        return globalStats;
    }
    
    /**
     * Clear all pools
     */
    clearAllPools() {
        this.pools.forEach((pool, poolName) => {
            pool.clear();
        });
        
        console.log('🌸 All pools cleared');
    }
    
    /**
     * Remove pool
     * @param {string} poolName - Name of the pool to remove
     */
    removePool(poolName) {
        const pool = this.pools.get(poolName);
        if (pool) {
            pool.clear();
            this.pools.delete(poolName);
            console.log(`🌸 Pool removed: ${poolName}`);
        }
    }
    
    /**
     * Resize pool
     * @param {string} poolName - Name of the pool
     * @param {number} newSize - New pool size
     */
    resizePool(poolName, newSize) {
        const pool = this.pools.get(poolName);
        if (pool) {
            pool.resize(newSize);
            console.log(`🌸 Pool ${poolName} resized to ${newSize}`);
        }
    }
    
    /**
     * Get all pool names
     * @returns {Array} Array of pool names
     */
    getPoolNames() {
        return Array.from(this.pools.keys());
    }
    
    /**
     * Destroy pool manager
     */
    destroy() {
        this.stopUpdateLoop();
        this.clearAllPools();
        console.log('🌸 Sacred Object Pool Manager destroyed');
    }
}

/**
 * Consciousness-Aware Pool Optimizer - Optimizes pool sizes based on consciousness level
 */
class ConsciousnessAwarePoolOptimizer {
    constructor(poolManager) {
        this.poolManager = poolManager;
        this.optimizationRules = new Map();
        this.isOptimizing = false;
        
        this.setupOptimizationRules();
        console.log('🌸 Consciousness-Aware Pool Optimizer initialized');
    }
    
    /**
     * Setup optimization rules
     */
    setupOptimizationRules() {
        // Define optimization rules based on consciousness level
        this.optimizationRules.set('meditation_markers', {
            baseSize: 10,
            consciousnessMultiplier: 0.1, // +1 per 10 consciousness
            maxSize: 100,
            minSize: 5
        });
        
        this.optimizationRules.set('healing_shrines', {
            baseSize: 5,
            consciousnessMultiplier: 0.05, // +1 per 20 consciousness
            maxSize: 50,
            minSize: 2
        });
        
        this.optimizationRules.set('wisdom_portals', {
            baseSize: 3,
            consciousnessMultiplier: 0.02, // +1 per 50 consciousness
            maxSize: 25,
            minSize: 1
        });
        
        this.optimizationRules.set('sacred_geometry', {
            baseSize: 20,
            consciousnessMultiplier: 0.2, // +1 per 5 consciousness
            maxSize: 200,
            minSize: 10
        });
    }
    
    /**
     * Optimize all pools based on consciousness level
     * @param {number} consciousnessLevel - Current consciousness level
     */
    optimizePools(consciousnessLevel) {
        if (this.isOptimizing) return;
        
        this.isOptimizing = true;
        
        this.optimizationRules.forEach((rule, poolName) => {
            const optimalSize = this.calculateOptimalSize(rule, consciousnessLevel);
            const currentPool = this.poolManager.pools.get(poolName);
            
            if (currentPool) {
                const currentSize = currentPool.poolSize;
                if (optimalSize !== currentSize) {
                    console.log(`🌸 Optimizing pool ${poolName}: ${currentSize} → ${optimalSize}`);
                    this.poolManager.resizePool(poolName, optimalSize);
                }
            }
        });
        
        this.isOptimizing = false;
    }
    
    /**
     * Calculate optimal pool size
     * @param {Object} rule - Optimization rule
     * @param {number} consciousnessLevel - Consciousness level
     * @returns {number} Optimal pool size
     */
    calculateOptimalSize(rule, consciousnessLevel) {
        const calculatedSize = Math.floor(
            rule.baseSize + (consciousnessLevel * rule.consciousnessMultiplier)
        );
        
        return Math.max(
            rule.minSize,
            Math.min(rule.maxSize, calculatedSize)
        );
    }
    
    /**
     * Add optimization rule
     * @param {string} poolName - Pool name
     * @param {Object} rule - Optimization rule
     */
    addOptimizationRule(poolName, rule) {
        this.optimizationRules.set(poolName, rule);
        console.log(`🌸 Optimization rule added for pool: ${poolName}`);
    }
    
    /**
     * Remove optimization rule
     * @param {string} poolName - Pool name
     */
    removeOptimizationRule(poolName) {
        this.optimizationRules.delete(poolName);
        console.log(`🌸 Optimization rule removed for pool: ${poolName}`);
    }
    
    /**
     * Get optimization rules
     * @returns {Map} Optimization rules
     */
    getOptimizationRules() {
        return this.optimizationRules;
    }
}

// Initialize global sacred object pool system
window.SacredObjectPool = SacredObjectPool;
window.SacredObjectPoolManager = SacredObjectPoolManager;
window.ConsciousnessAwarePoolOptimizer = ConsciousnessAwarePoolOptimizer;

// Create global pool manager
window.sacredObjectPoolManager = new SacredObjectPoolManager();

// Create global pool optimizer
window.sacredObjectPoolOptimizer = new ConsciousnessAwarePoolOptimizer(window.sacredObjectPoolManager);

// Add global pool helpers
window.createSacredObjectPool = (poolName, objectType, poolSize, consciousnessLevel) => {
    return window.sacredObjectPoolManager.createPool(poolName, objectType, poolSize, consciousnessLevel);
};

window.getSacredObjectFromPool = (poolName, position, consciousnessLevel, options) => {
    return window.sacredObjectPoolManager.getObject(poolName, position, consciousnessLevel, options);
};

window.returnSacredObjectToPool = (poolName, obj) => {
    return window.sacredObjectPoolManager.returnObject(poolName, obj);
};

// Listen for consciousness changes to optimize pools
if (window.eventBus) {
    window.eventBus.on('consciousness:increased', (data) => {
        window.sacredObjectPoolManager.updateGlobalConsciousnessLevel(data.newLevel);
        window.sacredObjectPoolOptimizer.optimizePools(data.newLevel);
    });
    
    window.eventBus.on('consciousness:decreased', (data) => {
        window.sacredObjectPoolManager.updateGlobalConsciousnessLevel(data.newLevel);
        window.sacredObjectPoolOptimizer.optimizePools(data.newLevel);
    });
}

console.log('🌸 Sacred Object Pool Enhancement ready - Consciousness-aware performance optimization initialized');
