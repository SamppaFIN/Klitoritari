/**
 * QuestModel - Unified quest data model
 * Manages all quest-related data and state
 */
class QuestModel {
    constructor(data = {}) {
        this.id = data.id || this.generateUUID();
        this.title = data.title || 'Untitled Quest';
        this.description = data.description || '';
        this.type = data.type || 'exploration'; // exploration, combat, collection, story
        this.status = data.status || 'available'; // available, active, completed, failed
        this.priority = data.priority || 'normal'; // low, normal, high, urgent
        this.objectives = data.objectives || [];
        this.rewards = data.rewards || {
            experience: 0,
            steps: 0,
            items: [],
            cosmic: 0,
            eldritch: 0,
            void: 0
        };
        this.requirements = data.requirements || {
            level: 1,
            steps: 0,
            items: [],
            completedQuests: []
        };
        this.location = data.location || null;
        this.timeLimit = data.timeLimit || null; // in milliseconds
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.startedAt = data.startedAt || null;
        this.completedAt = data.completedAt || null;
    }

    /**
     * Start the quest
     */
    start() {
        if (this.status !== 'available') {
            throw new Error('Quest is not available to start');
        }
        this.status = 'active';
        this.startedAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Complete the quest
     */
    complete() {
        if (this.status !== 'active') {
            throw new Error('Quest is not active');
        }
        this.status = 'completed';
        this.completedAt = new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Fail the quest
     */
    fail() {
        if (this.status !== 'active') {
            throw new Error('Quest is not active');
        }
        this.status = 'failed';
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add objective to quest
     * @param {Object} objective - Objective data
     */
    addObjective(objective) {
        this.objectives.push({
            id: objective.id || this.generateUUID(),
            description: objective.description,
            type: objective.type || 'collect',
            target: objective.target || 1,
            current: objective.current || 0,
            completed: false,
            ...objective
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update objective progress
     * @param {string} objectiveId - Objective ID
     * @param {number} progress - Progress amount
     */
    updateObjective(objectiveId, progress) {
        const objective = this.objectives.find(obj => obj.id === objectiveId);
        if (objective) {
            objective.current = Math.min(objective.current + progress, objective.target);
            objective.completed = objective.current >= objective.target;
            this.updatedAt = new Date().toISOString();
        }
        return this;
    }

    /**
     * Check if quest is completed
     * @returns {boolean} True if completed
     */
    isCompleted() {
        return this.objectives.every(obj => obj.completed);
    }

    /**
     * Get quest progress percentage
     * @returns {number} Progress percentage (0-100)
     */
    getProgress() {
        if (this.objectives.length === 0) return 100;
        const completed = this.objectives.filter(obj => obj.completed).length;
        return Math.round((completed / this.objectives.length) * 100);
    }

    /**
     * Update quest data
     * @param {Object} data - Data to update
     */
    update(data) {
        Object.keys(data).forEach(key => {
            if (key !== 'id' && key !== 'createdAt' && this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Check if quest meets requirements
     * @param {Object} playerData - Player data to check against
     * @returns {boolean} True if requirements met
     */
    meetsRequirements(playerData) {
        const req = this.requirements;
        
        // Check level requirement
        if (playerData.stats.level < req.level) {
            return false;
        }
        
        // Check steps requirement
        if (playerData.stats.steps < req.steps) {
            return false;
        }
        
        // Check items requirement
        if (req.items.length > 0) {
            // This would need to be implemented based on inventory system
            // For now, assume all items are available
        }
        
        // Check completed quests requirement
        if (req.completedQuests.length > 0) {
            // This would need to be implemented based on quest history
            // For now, assume all quests are completed
        }
        
        return true;
    }

    /**
     * Get quest data as plain object
     * @returns {Object} Quest data
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            type: this.type,
            status: this.status,
            priority: this.priority,
            objectives: this.objectives,
            rewards: this.rewards,
            requirements: this.requirements,
            location: this.location,
            timeLimit: this.timeLimit,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            startedAt: this.startedAt,
            completedAt: this.completedAt
        };
    }

    /**
     * Create quest from JSON data
     * @param {Object} data - JSON data
     * @returns {QuestModel} Quest instance
     */
    static fromJSON(data) {
        return new QuestModel(data);
    }

    /**
     * Generate a UUID
     * @returns {string} UUID
     */
    generateUUID() {
        return 'quest_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate quest data
     * @returns {boolean} True if valid
     */
    validate() {
        return (
            this.id &&
            this.title &&
            this.type &&
            this.status &&
            Array.isArray(this.objectives) &&
            this.rewards &&
            this.requirements
        );
    }
}

// Make QuestModel globally available
window.QuestModel = QuestModel;
