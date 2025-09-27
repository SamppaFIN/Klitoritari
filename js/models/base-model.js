/**
 * BaseModel - Unified base data model
 * Manages all base-related data and state
 */
class BaseModel {
    constructor(data = {}) {
        this.id = data.id || this.generateUUID();
        this.position = data.position || { lat: 0, lng: 0 };
        this.established = data.established || new Date().toISOString();
        this.level = data.level || 1;
        this.name = data.name || 'My Base';
        this.territory = {
            radius: data.territory?.radius || 50,
            points: data.territory?.points || [],
            energy: data.territory?.energy || 100,
            maxEnergy: data.territory?.maxEnergy || 100
        };
        this.settings = {
            logo: data.settings?.logo || 'finnish',
            name: data.settings?.name || 'My Base',
            color: data.settings?.color || '#8b5cf6'
        };
        this.buildings = data.buildings || [];
        this.resources = {
            steps: data.resources?.steps || 0,
            cosmic: data.resources?.cosmic || 0,
            eldritch: data.resources?.eldritch || 0,
            void: data.resources?.void || 0
        };
        this.isActive = data.isActive || true;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
    }

    /**
     * Update base position
     * @param {number} lat - Latitude
     * @param {number} lng - Longitude
     */
    updatePosition(lat, lng) {
        this.position = { lat, lng };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update base level
     * @param {number} level - New level
     */
    updateLevel(level) {
        this.level = level;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update base name
     * @param {string} name - New name
     */
    updateName(name) {
        this.name = name;
        this.settings.name = name;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update base settings
     * @param {Object} settings - Settings to update
     */
    updateSettings(settings) {
        this.settings = { ...this.settings, ...settings };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update territory data
     * @param {Object} territory - Territory data to update
     */
    updateTerritory(territory) {
        this.territory = { ...this.territory, ...territory };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add building to base
     * @param {Object} building - Building data
     */
    addBuilding(building) {
        this.buildings.push({
            id: building.id || this.generateUUID(),
            type: building.type,
            level: building.level || 1,
            position: building.position || { x: 0, y: 0 },
            createdAt: new Date().toISOString(),
            ...building
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Remove building from base
     * @param {string} buildingId - Building ID
     */
    removeBuilding(buildingId) {
        this.buildings = this.buildings.filter(b => b.id !== buildingId);
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Update base resources
     * @param {Object} resources - Resources to update
     */
    updateResources(resources) {
        this.resources = { ...this.resources, ...resources };
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Add resources to base
     * @param {Object} resources - Resources to add
     */
    addResources(resources) {
        Object.keys(resources).forEach(key => {
            if (this.resources.hasOwnProperty(key)) {
                this.resources[key] += resources[key];
            }
        });
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Expand territory
     * @param {number} radius - New radius
     */
    expandTerritory(radius) {
        this.territory.radius = Math.max(this.territory.radius, radius);
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Set base active status
     * @param {boolean} active - Active status
     */
    setActive(active) {
        this.isActive = active;
        this.updatedAt = new Date().toISOString();
        return this;
    }

    /**
     * Get base data as plain object
     * @returns {Object} Base data
     */
    toJSON() {
        return {
            id: this.id,
            position: this.position,
            established: this.established,
            level: this.level,
            name: this.name,
            territory: this.territory,
            settings: this.settings,
            buildings: this.buildings,
            resources: this.resources,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    /**
     * Create base from JSON data
     * @param {Object} data - JSON data
     * @returns {BaseModel} Base instance
     */
    static fromJSON(data) {
        return new BaseModel(data);
    }

    /**
     * Generate a UUID
     * @returns {string} UUID
     */
    generateUUID() {
        return 'base_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate base data
     * @returns {boolean} True if valid
     */
    validate() {
        return (
            this.id &&
            this.position &&
            typeof this.position.lat === 'number' &&
            typeof this.position.lng === 'number' &&
            this.territory &&
            typeof this.territory.radius === 'number' &&
            this.settings &&
            this.settings.logo
        );
    }
}

// Make BaseModel globally available
window.BaseModel = BaseModel;
