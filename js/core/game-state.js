/**
 * Generate a random world location for testing purposes
 * @returns {Object} Random coordinates with lat/lng
 */
function generateRandomWorldLocation() {
    // Generate random coordinates within reasonable world bounds
    const lat = (Math.random() - 0.5) * 180; // -90 to 90 degrees
    const lng = (Math.random() - 0.5) * 360; // -180 to 180 degrees
    
    console.log(`🌍 Generated random world location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    return { lat: lat, lng: lng };
}

/**
 * GameState - Central state management for the layered architecture
 * Manages all game data in a single, immutable state object
 */
class GameState {
    constructor() {
        this.state = {
            // Player data (using unified model)
            player: new PlayerModel(),
            
            // Base and territory data (using unified models)
            bases: new Map(),
            currentBase: null,
            
            // Quest and interaction data (using unified models)
            quests: new Map(),
            npcs: new Map(),
            encounters: [],
            
            // Map state
            map: {
                center: generateRandomWorldLocation(), // Random world location
                zoom: 13,
                activeOverlays: [],
                viewport: { width: 0, height: 0 }
            },
            
            // UI state
            ui: {
                activeModal: null,
                notifications: [],
                debugMode: false,
                selectedTab: 'base'
            },
            
            // System state
            system: {
                isInitialized: false,
                isPaused: false,
                lastUpdate: Date.now(),
                performance: {
                    fps: 0,
                    memoryUsage: 0,
                    renderTime: 0
                }
            }
        };
        
        this.listeners = [];
        this.history = [];
        this.maxHistorySize = 50;
    }

    /**
     * Update the game state with new data
     * @param {Object} updates - Partial state updates
     * @param {string} source - Source of the update (for debugging)
     */
    update(updates, source = 'unknown') {
        const previousState = this.getState();
        
        // Create new state with updates
        this.state = this.deepMerge(this.state, updates);
        
        // Add to history
        this.history.push({
            timestamp: Date.now(),
            source,
            updates,
            previousState: this.cloneState(previousState)
        });
        
        // Trim history
        if (this.history.length > this.maxHistorySize) {
            this.history = this.history.slice(-this.maxHistorySize);
        }
        
        // Notify listeners
        this.notifyListeners();
    }

    /**
     * Get a deep copy of the current state
     * @returns {Object} Immutable state copy
     */
    getState() {
        return Object.freeze(this.cloneState(this.state));
    }

    /**
     * Get a specific part of the state
     * @param {string} path - Dot notation path (e.g., 'player.stats.health')
     * @returns {*} Value at the path
     */
    get(path) {
        return this.getNestedValue(this.state, path);
    }

    /**
     * Update a specific part of the state
     * @param {string} path - Dot notation path
     * @param {*} value - New value
     * @param {string} source - Source of the update
     */
    set(path, value, source = 'unknown') {
        const updates = this.setNestedValue({}, path, value);
        this.update(updates, source);
    }

    /**
     * Subscribe to state changes
     * @param {Function} callback - Callback function
     * @param {string} path - Optional path to watch (e.g., 'player.position')
     * @returns {Function} Unsubscribe function
     */
    subscribe(callback, path = null) {
        const listener = { callback, path };
        this.listeners.push(listener);
        
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    /**
     * Notify all listeners of state changes
     */
    notifyListeners() {
        this.listeners.forEach(listener => {
            try {
                if (listener.path) {
                    // Only notify if the specific path changed
                    const currentValue = this.get(listener.path);
                    listener.callback(currentValue, listener.path);
                } else {
                    // Notify with full state
                    listener.callback(this.getState());
                }
            } catch (error) {
                console.error('❌ GameState: Error in listener:', error);
            }
        });
    }

    /**
     * Deep merge two objects
     * @param {Object} target - Target object
     * @param {Object} source - Source object
     * @returns {Object} Merged object
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    /**
     * Deep clone an object
     * @param {Object} obj - Object to clone
     * @returns {Object} Cloned object
     */
    cloneState(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Map) {
            return new Map(obj);
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.cloneState(item));
        }
        
        const cloned = {};
        for (const key in obj) {
            cloned[key] = this.cloneState(obj[key]);
        }
        
        return cloned;
    }

    /**
     * Get nested value using dot notation
     * @param {Object} obj - Object to search
     * @param {string} path - Dot notation path
     * @returns {*} Value at path
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    /**
     * Set nested value using dot notation
     * @param {Object} obj - Object to modify
     * @param {string} path - Dot notation path
     * @param {*} value - Value to set
     * @returns {Object} Modified object
     */
    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const result = { ...obj };
        let current = result;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            } else {
                current[key] = { ...current[key] };
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return result;
    }

    /**
     * Reset state to initial values
     */
    reset() {
        this.state = {
            player: {
                id: null,
                position: { lat: 0, lng: 0 },
                stats: { health: 100, sanity: 100, steps: 0, level: 1, experience: 0 },
                settings: { baseLogo: 'finnish', pathSymbol: 'ant', areaSymbol: 'finnish' },
                isOnline: false,
                lastSeen: null
            },
            bases: new Map(),
            territory: { points: [], radius: 50, energy: 100 },
            quests: new Map(),
            npcs: new Map(),
            encounters: [],
            map: { center: generateRandomWorldLocation(), zoom: 13, activeOverlays: [], viewport: { width: 0, height: 0 } },
            ui: { activeModal: null, notifications: [], debugMode: false, selectedTab: 'base' },
            system: { isInitialized: false, isPaused: false, lastUpdate: Date.now(), performance: { fps: 0, memoryUsage: 0, renderTime: 0 } }
        };
        this.history = [];
        this.notifyListeners();
    }

    /**
     * Get state history
     * @param {number} count - Number of recent states to return
     * @returns {Array} Recent state history
     */
    getHistory(count = 10) {
        return this.history.slice(-count);
    }

    /**
     * Get state statistics
     * @returns {Object} State statistics
     */
    getStats() {
        return {
            totalListeners: this.listeners.length,
            historySize: this.history.length,
            isInitialized: this.state.system.isInitialized,
            lastUpdate: this.state.system.lastUpdate,
            performance: this.state.system.performance
        };
    }

    /**
     * Get player data
     * @returns {PlayerModel} Player model
     */
    getPlayer() {
        return this.state.player;
    }

    /**
     * Update player data
     * @param {Object} data - Player data to update
     */
    updatePlayer(data) {
        this.state.player.update(data);
        this.notifyListeners();
    }

    /**
     * Get current base
     * @returns {BaseModel|null} Current base or null
     */
    getCurrentBase() {
        return this.state.currentBase;
    }

    /**
     * Set current base
     * @param {BaseModel} base - Base to set as current
     */
    setCurrentBase(base) {
        this.state.currentBase = base;
        this.notifyListeners();
    }

    /**
     * Add base
     * @param {BaseModel} base - Base to add
     */
    addBase(base) {
        this.state.bases.set(base.id, base);
        this.notifyListeners();
    }

    /**
     * Get base by ID
     * @param {string} id - Base ID
     * @returns {BaseModel|null} Base or null
     */
    getBase(id) {
        return this.state.bases.get(id) || null;
    }

    /**
     * Add quest
     * @param {QuestModel} quest - Quest to add
     */
    addQuest(quest) {
        this.state.quests.set(quest.id, quest);
        this.notifyListeners();
    }

    /**
     * Get quest by ID
     * @param {string} id - Quest ID
     * @returns {QuestModel|null} Quest or null
     */
    getQuest(id) {
        return this.state.quests.get(id) || null;
    }

    /**
     * Add NPC
     * @param {NPCModel} npc - NPC to add
     */
    addNPC(npc) {
        this.state.npcs.set(npc.id, npc);
        this.notifyListeners();
    }

    /**
     * Get NPC by ID
     * @param {string} id - NPC ID
     * @returns {NPCModel|null} NPC or null
     */
    getNPC(id) {
        return this.state.npcs.get(id) || null;
    }
}

// Make GameState globally available
window.GameState = GameState;
