/**
 * 🌸 CONSCIOUSNESS EVENT SYSTEM
 * 
 * Enhanced event-driven architecture for consciousness-aware interactions.
 * Implements observer pattern with consciousness-specific event handling.
 * 
 * Sacred Purpose: Centralized event management for consciousness changes,
 * meditation events, sacred object interactions, and community healing.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Consciousness Event System - Enhanced event management
 */
class ConsciousnessEventSystem {
    constructor() {
        this.events = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 1000;
        this.eventFilters = new Map();
        this.eventMiddleware = [];
        this.isProcessing = false;
        this.processingQueue = [];
        
        // Consciousness-specific event categories
        this.eventCategories = {
            consciousness: ['consciousness:increased', 'consciousness:decreased', 'consciousness:milestone'],
            meditation: ['meditation:started', 'meditation:progress', 'meditation:completed', 'meditation:enlightened'],
            sacred: ['sacred:object:created', 'sacred:object:removed', 'sacred:object:interacted'],
            healing: ['community:healing:gained', 'sacred:healing:started', 'sacred:healing:completed'],
            wisdom: ['spatial:wisdom:gained', 'sacred:wisdom:started', 'sacred:wisdom:completed'],
            geometry: ['sacred:geometry:affinity_changed', 'sacred:geometry:pattern_updated']
        };
        
        this.setupDefaultFilters();
        console.log('🌸 Consciousness Event System initialized');
    }
    
    /**
     * Setup default event filters
     */
    setupDefaultFilters() {
        // Filter for consciousness events
        this.eventFilters.set('consciousness', (event) => {
            return this.eventCategories.consciousness.includes(event.type);
        });
        
        // Filter for meditation events
        this.eventFilters.set('meditation', (event) => {
            return this.eventCategories.meditation.includes(event.type);
        });
        
        // Filter for sacred object events
        this.eventFilters.set('sacred', (event) => {
            return this.eventCategories.sacred.includes(event.type);
        });
        
        // Filter for healing events
        this.eventFilters.set('healing', (event) => {
            return this.eventCategories.healing.includes(event.type);
        });
        
        // Filter for wisdom events
        this.eventFilters.set('wisdom', (event) => {
            return this.eventCategories.wisdom.includes(event.type);
        });
        
        // Filter for geometry events
        this.eventFilters.set('geometry', (event) => {
            return this.eventCategories.geometry.includes(event.type);
        });
    }
    
    /**
     * Register event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @param {Object} options - Event options
     */
    on(event, callback, options = {}) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        
        const listener = {
            callback: callback,
            options: options,
            id: this.generateListenerId(),
            createdAt: Date.now()
        };
        
        this.events.get(event).push(listener);
        
        console.log(`🌸 Event listener registered: ${event} (${listener.id})`);
    }
    
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    off(event, callback) {
        if (!this.events.has(event)) return;
        
        const listeners = this.events.get(event);
        const index = listeners.findIndex(listener => listener.callback === callback);
        
        if (index !== -1) {
            const removedListener = listeners.splice(index, 1)[0];
            console.log(`🌸 Event listener removed: ${event} (${removedListener.id})`);
        }
    }
    
    /**
     * Emit event
     * @param {string} event - Event name
     * @param {Object} data - Event data
     */
    emit(event, data) {
        const eventData = {
            type: event,
            data: data,
            timestamp: Date.now(),
            consciousnessLevel: this.getCurrentConsciousnessLevel()
        };
        
        // Add to processing queue
        this.processingQueue.push(eventData);
        
        // Process events if not already processing
        if (!this.isProcessing) {
            this.processEventQueue();
        }
    }
    
    /**
     * Process event queue
     */
    processEventQueue() {
        if (this.isProcessing || this.processingQueue.length === 0) return;
        
        this.isProcessing = true;
        
        while (this.processingQueue.length > 0) {
            const eventData = this.processingQueue.shift();
            this.processEvent(eventData);
        }
        
        this.isProcessing = false;
    }
    
    /**
     * Process single event
     * @param {Object} eventData - Event data
     */
    processEvent(eventData) {
        // Apply middleware
        for (const middleware of this.eventMiddleware) {
            const result = middleware(eventData);
            if (result === false) {
                return; // Middleware blocked the event
            }
        }
        
        // Add to history
        this.addToHistory(eventData);
        
        // Emit to listeners
        if (this.events.has(eventData.type)) {
            const listeners = this.events.get(eventData.type);
            
            listeners.forEach(listener => {
                try {
                    listener.callback(eventData);
                } catch (error) {
                    console.error(`🌸 Error in event handler for ${eventData.type}:`, error);
                }
            });
        }
        
        // Emit to category listeners
        this.emitToCategoryListeners(eventData);
    }
    
    /**
     * Emit to category listeners
     * @param {Object} eventData - Event data
     */
    emitToCategoryListeners(eventData) {
        Object.keys(this.eventCategories).forEach(category => {
            if (this.eventCategories[category].includes(eventData.type)) {
                const categoryEvent = `category:${category}`;
                if (this.events.has(categoryEvent)) {
                    const listeners = this.events.get(categoryEvent);
                    listeners.forEach(listener => {
                        try {
                            listener.callback(eventData);
                        } catch (error) {
                            console.error(`🌸 Error in category handler for ${category}:`, error);
                        }
                    });
                }
            }
        });
    }
    
    /**
     * Add event to history
     * @param {Object} eventData - Event data
     */
    addToHistory(eventData) {
        this.eventHistory.push(eventData);
        
        // Limit history size
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory.shift();
        }
    }
    
    /**
     * Generate listener ID
     * @returns {string} Unique listener ID
     */
    generateListenerId() {
        return `listener-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Get current consciousness level
     * @returns {number} Current consciousness level
     */
    getCurrentConsciousnessLevel() {
        if (window.consciousnessManager) {
            return window.consciousnessManager.consciousnessLevel;
        }
        return 0;
    }
    
    /**
     * Consciousness-specific event methods
     */
    
    /**
     * Listen for consciousness changes
     * @param {Function} callback - Callback function
     */
    onConsciousnessChange(callback) {
        this.on('consciousness:changed', callback);
    }
    
    /**
     * Listen for consciousness increases
     * @param {Function} callback - Callback function
     */
    onConsciousnessIncrease(callback) {
        this.on('consciousness:increased', callback);
    }
    
    /**
     * Listen for consciousness decreases
     * @param {Function} callback - Callback function
     */
    onConsciousnessDecrease(callback) {
        this.on('consciousness:decreased', callback);
    }
    
    /**
     * Listen for consciousness milestones
     * @param {Function} callback - Callback function
     */
    onConsciousnessMilestone(callback) {
        this.on('consciousness:milestone', callback);
    }
    
    /**
     * Listen for meditation start
     * @param {Function} callback - Callback function
     */
    onMeditationStart(callback) {
        this.on('meditation:started', callback);
    }
    
    /**
     * Listen for meditation progress
     * @param {Function} callback - Callback function
     */
    onMeditationProgress(callback) {
        this.on('meditation:progress', callback);
    }
    
    /**
     * Listen for meditation completion
     * @param {Function} callback - Callback function
     */
    onMeditationComplete(callback) {
        this.on('meditation:completed', callback);
    }
    
    /**
     * Listen for meditation enlightenment
     * @param {Function} callback - Callback function
     */
    onMeditationEnlightenment(callback) {
        this.on('meditation:enlightened', callback);
    }
    
    /**
     * Listen for sacred object creation
     * @param {Function} callback - Callback function
     */
    onSacredObjectCreated(callback) {
        this.on('sacred:object:created', callback);
    }
    
    /**
     * Listen for sacred object removal
     * @param {Function} callback - Callback function
     */
    onSacredObjectRemoved(callback) {
        this.on('sacred:object:removed', callback);
    }
    
    /**
     * Listen for sacred object interaction
     * @param {Function} callback - Callback function
     */
    onSacredObjectInteraction(callback) {
        this.on('sacred:object:interacted', callback);
    }
    
    /**
     * Listen for spatial wisdom gain
     * @param {Function} callback - Callback function
     */
    onSpatialWisdomGained(callback) {
        this.on('spatial:wisdom:gained', callback);
    }
    
    /**
     * Listen for community healing
     * @param {Function} callback - Callback function
     */
    onCommunityHealing(callback) {
        this.on('community:healing:gained', callback);
    }
    
    /**
     * Listen for sacred geometry changes
     * @param {Function} callback - Callback function
     */
    onSacredGeometryChange(callback) {
        this.on('sacred:geometry:affinity_changed', callback);
    }
    
    /**
     * Emit consciousness event
     * @param {string} type - Event type
     * @param {Object} data - Event data
     */
    emitConsciousnessEvent(type, data) {
        const event = {
            type: type,
            data: data,
            timestamp: Date.now(),
            consciousnessLevel: this.getCurrentConsciousnessLevel()
        };
        
        this.emit(type, event);
    }
    
    /**
     * Get consciousness event history
     * @param {string} filter - Event filter
     * @returns {Array} Filtered event history
     */
    getConsciousnessEventHistory(filter = null) {
        if (filter) {
            const filterFunc = this.eventFilters.get(filter);
            if (filterFunc) {
                return this.eventHistory.filter(filterFunc);
            }
        }
        
        return this.eventHistory.filter(event => 
            this.eventCategories.consciousness.includes(event.type) || 
            this.eventCategories.meditation.includes(event.type) ||
            this.eventCategories.sacred.includes(event.type)
        );
    }
    
    /**
     * Get meditation event history
     * @returns {Array} Meditation event history
     */
    getMeditationEventHistory() {
        return this.eventHistory.filter(event => 
            this.eventCategories.meditation.includes(event.type)
        );
    }
    
    /**
     * Get sacred object event history
     * @returns {Array} Sacred object event history
     */
    getSacredObjectEventHistory() {
        return this.eventHistory.filter(event => 
            this.eventCategories.sacred.includes(event.type)
        );
    }
    
    /**
     * Add event middleware
     * @param {Function} middleware - Middleware function
     */
    addMiddleware(middleware) {
        this.eventMiddleware.push(middleware);
        console.log('🌸 Event middleware added');
    }
    
    /**
     * Remove event middleware
     * @param {Function} middleware - Middleware function
     */
    removeMiddleware(middleware) {
        const index = this.eventMiddleware.indexOf(middleware);
        if (index !== -1) {
            this.eventMiddleware.splice(index, 1);
            console.log('🌸 Event middleware removed');
        }
    }
    
    /**
     * Add event filter
     * @param {string} name - Filter name
     * @param {Function} filter - Filter function
     */
    addFilter(name, filter) {
        this.eventFilters.set(name, filter);
        console.log(`🌸 Event filter added: ${name}`);
    }
    
    /**
     * Remove event filter
     * @param {string} name - Filter name
     */
    removeFilter(name) {
        this.eventFilters.delete(name);
        console.log(`🌸 Event filter removed: ${name}`);
    }
    
    /**
     * Get event statistics
     * @returns {Object} Event statistics
     */
    getStatistics() {
        const stats = {
            totalEvents: this.eventHistory.length,
            eventsByType: {},
            eventsByCategory: {},
            listenersByEvent: {},
            averageEventsPerMinute: 0
        };
        
        // Count events by type
        this.eventHistory.forEach(event => {
            stats.eventsByType[event.type] = (stats.eventsByType[event.type] || 0) + 1;
        });
        
        // Count events by category
        Object.keys(this.eventCategories).forEach(category => {
            stats.eventsByCategory[category] = 0;
            this.eventCategories[category].forEach(eventType => {
                stats.eventsByCategory[category] += (stats.eventsByType[eventType] || 0);
            });
        });
        
        // Count listeners by event
        this.events.forEach((listeners, event) => {
            stats.listenersByEvent[event] = listeners.length;
        });
        
        // Calculate average events per minute
        if (this.eventHistory.length > 0) {
            const timeSpan = Date.now() - this.eventHistory[0].timestamp;
            stats.averageEventsPerMinute = (this.eventHistory.length / timeSpan) * 60000;
        }
        
        return stats;
    }
    
    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
        console.log('🌸 Event history cleared');
    }
    
    /**
     * Set max history size
     * @param {number} size - Maximum history size
     */
    setMaxHistorySize(size) {
        this.maxHistorySize = size;
        
        // Trim history if necessary
        if (this.eventHistory.length > size) {
            this.eventHistory = this.eventHistory.slice(-size);
        }
        
        console.log(`🌸 Max history size set to: ${size}`);
    }
    
    /**
     * Destroy event system
     */
    destroy() {
        this.events.clear();
        this.eventHistory = [];
        this.eventFilters.clear();
        this.eventMiddleware = [];
        this.processingQueue = [];
        
        console.log('🌸 Consciousness Event System destroyed');
    }
}

// Initialize global consciousness event system
window.ConsciousnessEventSystem = ConsciousnessEventSystem;

// Create global event system instance
window.consciousnessEventSystem = new ConsciousnessEventSystem();

// Add global event helpers
window.onConsciousnessChange = (callback) => {
    return window.consciousnessEventSystem.onConsciousnessChange(callback);
};

window.onMeditationStart = (callback) => {
    return window.consciousnessEventSystem.onMeditationStart(callback);
};

window.onSacredObjectCreated = (callback) => {
    return window.consciousnessEventSystem.onSacredObjectCreated(callback);
};

window.emitConsciousnessEvent = (type, data) => {
    return window.consciousnessEventSystem.emitConsciousnessEvent(type, data);
};

// Add consciousness event middleware for automatic logging
window.consciousnessEventSystem.addMiddleware((eventData) => {
    // Log consciousness-related events
    if (eventData.type.includes('consciousness') || 
        eventData.type.includes('meditation') || 
        eventData.type.includes('sacred')) {
        console.log(`🌸 Consciousness Event: ${eventData.type}`, eventData.data);
    }
    return true; // Allow event to proceed
});

console.log('🌸 Consciousness Event System ready - Enhanced event-driven architecture initialized');
