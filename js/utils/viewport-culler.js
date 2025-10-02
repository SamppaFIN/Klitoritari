/**
 * ViewportCuller - Viewport culling system for performance optimization
 * Only renders objects that are visible in the current viewport
 */
class ViewportCuller {
    constructor() {
        this.viewport = {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            zoom: 1
        };
        
        this.cullingEnabled = true;
        this.margin = 100; // Extra margin around viewport
        this.adaptiveCulling = true; // Enable adaptive culling for high object counts
        this.objects = new Map();
        this.visibleObjects = new Set();
        this.lastCullTime = 0;
        this.cullInterval = 100; // ms
        
        // Performance tracking
        this.stats = {
            totalObjects: 0,
            visibleObjects: 0,
            culledObjects: 0,
            cullTime: 0
        };
    }

    /**
     * Update viewport dimensions
     * @param {number} x - Viewport x position
     * @param {number} y - Viewport y position
     * @param {number} width - Viewport width
     * @param {number} height - Viewport height
     * @param {number} zoom - Viewport zoom level
     */
    updateViewport(x, y, width, height, zoom = 1) {
        this.viewport = { x, y, width, height, zoom };
        this.performCulling();
    }

    /**
     * Add object to culling system
     * @param {string} id - Object ID
     * @param {Object} object - Object with position and bounds
     */
    addObject(id, object) {
        this.objects.set(id, {
            ...object,
            id,
            lastCullTime: 0
        });
        this.stats.totalObjects = this.objects.size;
    }

    /**
     * Remove object from culling system
     * @param {string} id - Object ID
     */
    removeObject(id) {
        this.objects.delete(id);
        this.visibleObjects.delete(id);
        this.stats.totalObjects = this.objects.size;
    }

    /**
     * Update object position/bounds
     * @param {string} id - Object ID
     * @param {Object} updates - Object updates
     */
    updateObject(id, updates) {
        const object = this.objects.get(id);
        if (object) {
            Object.assign(object, updates);
            object.lastCullTime = 0; // Force re-culling
        }
    }

    /**
     * Perform viewport culling with consciousness-aware optimization
     */
    performCulling() {
        if (!this.cullingEnabled) {
            this.visibleObjects.clear();
            this.objects.forEach((_, id) => this.visibleObjects.add(id));
            return;
        }
        
        // Adaptive culling for high object counts
        if (this.adaptiveCulling && this.objects.size > 1000) {
            this.margin = Math.max(50, 100 - (this.objects.size / 100)); // Tighter culling
            this.cullInterval = Math.max(50, 100 - (this.objects.size / 200)); // More frequent culling
        }

        const startTime = performance.now();
        const margin = this.margin / this.viewport.zoom;
        
        const cullBounds = {
            left: this.viewport.x - margin,
            right: this.viewport.x + this.viewport.width + margin,
            top: this.viewport.y - margin,
            bottom: this.viewport.y + this.viewport.height + margin
        };

        this.visibleObjects.clear();
        let visibleCount = 0;
        let culledCount = 0;

        this.objects.forEach((object, id) => {
            if (this.isObjectVisible(object, cullBounds)) {
                this.visibleObjects.add(id);
                visibleCount++;
            } else {
                culledCount++;
            }
        });

        this.stats.visibleObjects = visibleCount;
        this.stats.culledObjects = culledCount;
        this.stats.cullTime = performance.now() - startTime;
        this.lastCullTime = Date.now();
        
        // Log performance improvements
        if (this.objects.size > 1000) {
            const cullRatio = (culledCount / this.objects.size * 100).toFixed(1);
            console.log(`🌌 Viewport Culling: ${visibleCount}/${this.objects.size} visible (${cullRatio}% culled) in ${this.stats.cullTime.toFixed(2)}ms`);
        }
    }

    /**
     * Check if object is visible in viewport
     * @param {Object} object - Object to check
     * @param {Object} cullBounds - Culling bounds
     * @returns {boolean} True if visible
     */
    isObjectVisible(object, cullBounds) {
        // Simple bounding box check
        if (object.bounds) {
            return !(
                object.bounds.right < cullBounds.left ||
                object.bounds.left > cullBounds.right ||
                object.bounds.bottom < cullBounds.top ||
                object.bounds.top > cullBounds.bottom
            );
        }

        // Point-based check
        if (object.position) {
            return !(
                object.position.x < cullBounds.left ||
                object.position.x > cullBounds.right ||
                object.position.y < cullBounds.top ||
                object.position.y > cullBounds.bottom
            );
        }

        // Default to visible if no position/bounds
        return true;
    }

    /**
     * Get visible objects
     * @returns {Set} Set of visible object IDs
     */
    getVisibleObjects() {
        return this.visibleObjects;
    }

    /**
     * Check if object is visible
     * @param {string} id - Object ID
     * @returns {boolean} True if visible
     */
    isObjectVisibleById(id) {
        return this.visibleObjects.has(id);
    }

    /**
     * Get all objects (visible and culled)
     * @returns {Map} All objects
     */
    getAllObjects() {
        return this.objects;
    }

    /**
     * Get visible objects as array
     * @returns {Array} Array of visible objects
     */
    getVisibleObjectsArray() {
        const visible = [];
        this.visibleObjects.forEach(id => {
            const object = this.objects.get(id);
            if (object) {
                visible.push(object);
            }
        });
        return visible;
    }

    /**
     * Enable/disable culling
     * @param {boolean} enabled - Culling enabled
     */
    setCullingEnabled(enabled) {
        this.cullingEnabled = enabled;
        if (enabled) {
            this.performCulling();
        } else {
            this.visibleObjects.clear();
            this.objects.forEach((_, id) => this.visibleObjects.add(id));
        }
    }

    /**
     * Set culling margin
     * @param {number} margin - Margin in pixels
     */
    setMargin(margin) {
        this.margin = margin;
        this.performCulling();
    }

    /**
     * Get culling statistics
     * @returns {Object} Culling statistics
     */
    getStats() {
        return {
            ...this.stats,
            cullingEnabled: this.cullingEnabled,
            margin: this.margin,
            lastCullTime: this.lastCullTime,
            cullEfficiency: this.stats.totalObjects > 0 
                ? (this.stats.culledObjects / this.stats.totalObjects) * 100 
                : 0
        };
    }

    /**
     * Clear all objects
     */
    clear() {
        this.objects.clear();
        this.visibleObjects.clear();
        this.stats.totalObjects = 0;
        this.stats.visibleObjects = 0;
        this.stats.culledObjects = 0;
    }

    /**
     * Destroy viewport culler
     */
    destroy() {
        this.clear();
        this.viewport = { x: 0, y: 0, width: 0, height: 0, zoom: 1 };
    }
}

// Make ViewportCuller globally available
window.ViewportCuller = ViewportCuller;
