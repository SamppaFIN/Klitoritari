/**
 * NPCModel - Unified NPC data model
 * Manages all NPC-related data and state
 */
class NPCModel {
    constructor(data = {}) {
        this.id = data.id || this.generateUUID();
        this.name = data.name || 'Unknown NPC';
        this.type = data.type || 'friendly'; // friendly, neutral, hostile, merchant, quest_giver
        this.position = data.position || { lat: 0, lng: 0 };
        this.sprite = data.sprite || '👤';
        this.dialogue = data.dialogue || [];
        this.quests = data.quests || [];
        this.inventory = data.inventory || [];
        this.stats = {
            health: data.stats?.health || 100,
            maxHealth: data.stats?.maxHealth || 100,
            level: data.stats?.level || 1,
            experience: data.stats?.experience || 0
        };
        this.settings = {
            respawnTime: data.settings?.respawnTime || 300000, // 5 minutes
            movementRange: data.settings?.movementRange || 50, // meters
            isStationary: data.settings?.isStationary || false,
            isVisible: data.settings?.isVisible || true
        };
        this.isActive = data.isActive || true;
        this.lastSeen = data.lastSeen || new Date().toISOString();
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Update NPC position
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    updatePosition(lat, lng) {
        this.position = { lat, lng };
        this.lastSeen = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update NPC stats
     * @param {Object} stats - Stats to update
     */
    updateStats(stats) {
        this.stats = { ...this.stats, ...stats };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add dialogue to NPC
     * @param {Object} dialogue - Dialogue data
     */
    addDialogue(dialogue) {
        this.dialogue.push({
            id: dialogue.id || this.generateUUID(),
            text: dialogue.text,
            conditions: dialogue.conditions || [],
            responses: dialogue.responses || [],
            createdAt: new Date().toISOString(),
            ...dialogue
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add quest to NPC
     * @param {string} questId - Quest ID
     */
    addQuest(questId) {
        if (!this.quests.includes(questId)) {
            this.quests.push(questId);
            this.updatedAt = new Date().toISOString();
        }
        return this;
    }

    /**
     * Remove quest from NPC
     * @param {string} questId - Quest ID
     */
    removeQuest(questId) {
        this.quests = this.quests.filter(id => id !== questId);
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add item to NPC inventory
     * @param {Object} item - Item data
     */
    addItem(item) {
        this.inventory.push({
            id: item.id || this.generateUUID(),
            name: item.name,
            type: item.type,
            quantity: item.quantity || 1,
            value: item.value || 0,
            ...item
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Remove item from NPC inventory
     * @param {string} itemId - Item ID
     * @param {number} quantity - Quantity to remove
     */
    removeItem(itemId, quantity = 1) {
        const item = this.inventory.find(i => i.id === itemId);
        if (item) {
            item.quantity = Math.max(0, item.quantity - quantity);
            if (item.quantity === 0) {
                this.inventory = this.inventory.filter(i => i.id !== itemId);
            }
            this.updatedAt = new Date().toISOString();
        }
        return this;
    }

    /**
     * Get available dialogue based on conditions
     * @param {Object} playerData - Player data for condition checking
     * @returns {Array} Available dialogue
     */
    getAvailableDialogue(playerData) {
        return this.dialogue.filter(dialogue => {
            if (dialogue.conditions.length === 0) return true;
            
            return dialogue.conditions.every(condition => {
                switch (condition.type) {
                    case 'level':
                        return playerData.stats.level >= condition.value;
                    case 'quest_completed':
                        return playerData.completedQuests?.includes(condition.value) || false;
                    case 'item_owned':
                        return playerData.inventory?.some(item => item.id === condition.value) || false;
                    case 'time_of_day':
                        const hour = new Date().getHours();
                        return hour >= condition.start && hour <= condition.end;
                    default:
                        return true;
                }
            });
        });
    }

    /**
     * Get available quests
     * @param {Object} playerData - Player data for quest checking
     * @returns {Array} Available quest IDs
     */
    getAvailableQuests(playerData) {
        // This would need to be implemented based on quest system
        // For now, return all quests
        return this.quests;
    }

    /**
     * Set NPC active status
     * @param {boolean} active - Active status
     */
    setActive(active) {
        this.isActive = active;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update NPC settings
     * @param {Object} settings - Settings to update
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Get NPC data as plain object
     * @returns {Object} NPC data
     */
    toJSON() {
        return {
            id: this.id,
            name: this.name,
            type: this.type,
            position: this.position,
            sprite: this.sprite,
            dialogue: this.dialogue,
            quests: this.quests,
            inventory: this.inventory,
            stats: this.stats,
            settings: this.settings,
            isActive: this.isActive,
            lastSeen: this.lastSeen,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create NPC from JSON data
     * @param {Object} data - JSON data
     * @returns {NPCModel} NPC instance
     */
    static fromJSON(data) {
        return new NPCModel(data);
    }

    /**
     * Generate a UUID
     * @returns {string} UUID
     */
    generateUUID() {
        return 'npc_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate NPC data
     * @returns {boolean} True if valid
     */
    validate() {
        return (
            this.id &&
            this.name &&
            this.type &&
            this.position &&
            typeof this.position.lat === 'number' &&
            typeof this.position.lng === 'number' &&
            this.stats &&
            typeof this.stats.health === 'number'
        );
    }
}

// Make NPCModel globally available
window.NPCModel = NPCModel;
