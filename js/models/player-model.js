/**
 * PlayerModel - Unified player data model
 * Manages all player-related data and state
 */
class PlayerModel {
    constructor(data = {}) {
        this.id = data.id || this.generateUUID();
        this.position = data.position || { lat: 0, lng: 0 };
        this.stats = {
            health: data.stats?.health || 100,
            sanity: data.stats?.sanity || 100,
            steps: data.stats?.steps || 0,
            level: data.stats?.level || 1,
            experience: data.stats?.experience || 0,
            energy: data.stats?.energy || 100,
            maxHealth: data.stats?.maxHealth || 100,
            maxSanity: data.stats?.maxSanity || 100,
            maxEnergy: data.stats?.maxEnergy || 100
        };
        this.settings = {
            baseLogo: data.settings?.baseLogo || 'finnish',
            pathSymbol: data.settings?.pathSymbol || 'ant',
            areaSymbol: data.settings?.areaSymbol || 'finnish',
            name: data.settings?.name || 'Cosmic Explorer'
        };
        this.isOnline = data.isOnline || false;
        this.lastSeen = data.lastSeen || new Date().toISOString();
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Update player position
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    updatePosition(lat, lng) {
        this.position = { lat, lng };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update player stats
     * @param {Object} stats - Stats to update
     */
    updateStats(stats) {
        this.stats = { ...this.stats, ...stats };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add steps to player
     * @param {number} steps - Number of steps to add
     */
    addSteps(steps) {
        this.stats.steps += steps;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update player settings
     * @param {Object} settings - Settings to update
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Set player online status
     * @param {boolean} online - Online status
     */
    setOnline(online) {
        this.isOnline = online;
        this.lastSeen = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Get player data as plain object
     * @returns {Object} Player data
     */
    toJSON() {
        return {
            id: this.id,
            position: this.position,
            stats: this.stats,
            settings: this.settings,
            isOnline: this.isOnline,
            lastSeen: this.lastSeen,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create player from JSON data
     * @param {Object} data - JSON data
     * @returns {PlayerModel} Player instance
     */
    static fromJSON(data) {
        return new PlayerModel(data);
    }

    /**
     * Generate a UUID
     * @returns {string} UUID
     */
    generateUUID() {
        return 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate player data
     * @returns {boolean} True if valid
     */
    validate() {
        return (
            this.id &&
            this.position &&
            typeof this.position.lat === 'number' &&
            typeof this.position.lng === 'number' &&
            this.stats &&
            typeof this.stats.health === 'number' &&
            typeof this.stats.sanity === 'number' &&
            typeof this.stats.steps === 'number'
        );
    }
}

// Make PlayerModel globally available
window.PlayerModel = PlayerModel;
