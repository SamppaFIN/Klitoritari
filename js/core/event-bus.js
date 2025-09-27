/**
 * EventBus - Central event communication system for layered architecture
 * Handles all inter-layer communication through a clean event system
 */
class EventBus {
    constructor() {
        this.listeners = new Map();
        this.eventHistory = [];
        this.maxHistorySize = 100;
        this.debugMode = false;
    }

    /**
     * Emit an event to all registered listeners
     * @param {string} event - Event name
     * @param {*} data - Event data payload
     */
    emit(event, data = null) {
        if (this.debugMode) {
            console.log(`🔔 EventBus: ${event}`, data);
        }

        // Store event in history
        this.eventHistory.push({
            event,
            data,
            timestamp: Date.now()
        });

        // Trim history if too large
        if (this.eventHistory.length > this.maxHistorySize) {
            this.eventHistory = this.eventHistory.slice(-this.maxHistorySize);
        }

        // Notify all listeners
        const eventListeners = this.listeners.get(event) || [];
        eventListeners.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error(`❌ EventBus: Error in listener for event '${event}':`, error);
            }
        });
    }

    /**
     * Register a listener for an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     * @returns {Function} Unsubscribe function
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        
        this.listeners.get(event).push(callback);

        // Return unsubscribe function
        return () => this.off(event, callback);
    }

    /**
     * Unregister a listener for an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function to remove
     */
    off(event, callback) {
        const eventListeners = this.listeners.get(event);
        if (eventListeners) {
            const index = eventListeners.indexOf(callback);
            if (index > -1) {
                eventListeners.splice(index, 1);
            }
        }
    }

    /**
     * Register a one-time listener for an event
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    once(event, callback) {
        const onceCallback = (data) => {
            callback(data);
            this.off(event, onceCallback);
        };
        this.on(event, onceCallback);
    }

    /**
     * Remove all listeners for an event
     * @param {string} event - Event name
     */
    removeAllListeners(event) {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    /**
     * Get all registered events
     * @returns {string[]} Array of event names
     */
    getEvents() {
        return Array.from(this.listeners.keys());
    }

    /**
     * Get listener count for an event
     * @param {string} event - Event name
     * @returns {number} Number of listeners
     */
    getListenerCount(event) {
        const eventListeners = this.listeners.get(event);
        return eventListeners ? eventListeners.length : 0;
    }

    /**
     * Enable or disable debug mode
     * @param {boolean} enabled - Debug mode state
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
    }

    /**
     * Get recent event history
     * @param {number} count - Number of recent events to return
     * @returns {Array} Recent events
     */
    getEventHistory(count = 10) {
        return this.eventHistory.slice(-count);
    }

    /**
     * Clear event history
     */
    clearHistory() {
        this.eventHistory = [];
    }

    /**
     * Get statistics about the event bus
     * @returns {Object} Event bus statistics
     */
    getStats() {
        const totalListeners = Array.from(this.listeners.values())
            .reduce((sum, listeners) => sum + listeners.length, 0);
        
        return {
            totalEvents: this.listeners.size,
            totalListeners,
            historySize: this.eventHistory.length,
            debugMode: this.debugMode
        };
    }
}

// Make EventBus globally available
window.EventBus = EventBus;
