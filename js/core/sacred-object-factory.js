/**
 * 🌸 SACRED OBJECT FACTORY
 * 
 * Factory pattern implementation for consciousness-aware sacred object creation.
 * Creates meditation markers, healing shrines, wisdom portals, and sacred geometry patterns.
 * 
 * Sacred Purpose: Centralized creation of consciousness-aware objects with
 * proper initialization, sacred geometry integration, and event emission.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Base class for all sacred objects
 */
class SacredObject {
    constructor(position, consciousnessLevel, options = {}) {
        this.id = this.generateId();
        this.position = position;
        this.consciousnessLevel = consciousnessLevel;
        this.options = options;
        this.isActive = false;
        this.createdAt = Date.now();
        this.sacredGeometryPattern = 'none';
        this.meditationAffinity = 0;
        this.healingPower = 0;
        this.wisdomLevel = 0;
        
        // Sacred object properties
        this.type = 'sacred';
        this.category = 'unknown';
        this.description = 'A sacred object';
        this.icon = '🌸';
        this.color = '#8a2be2';
        
        console.log(`🌸 Sacred object created: ${this.id} at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
    }
    
    /**
     * Generate unique ID
     * @returns {string} Unique identifier
     */
    generateId() {
        return `sacred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Initialize the sacred object
     */
    initialize() {
        this.setupSacredGeometry();
        this.setupConsciousnessEffects();
        this.setupMeditationAffinity();
        this.isActive = true;
        
        console.log(`🌸 Sacred object initialized: ${this.id}`);
    }
    
    /**
     * Setup sacred geometry based on consciousness level
     */
    setupSacredGeometry() {
        if (this.consciousnessLevel >= 50000) {
            this.sacredGeometryPattern = 'metatronCube';
        } else if (this.consciousnessLevel >= 25000) {
            this.sacredGeometryPattern = 'flowerOfLife';
        } else if (this.consciousnessLevel >= 10000) {
            this.sacredGeometryPattern = 'goldenRatio';
        } else if (this.consciousnessLevel >= 5000) {
            this.sacredGeometryPattern = 'sacredGeometry';
        } else if (this.consciousnessLevel >= 1000) {
            this.sacredGeometryPattern = 'basicPatterns';
        } else {
            this.sacredGeometryPattern = 'none';
        }
    }
    
    /**
     * Setup consciousness effects
     */
    setupConsciousnessEffects() {
        // Override in subclasses
    }
    
    /**
     * Setup meditation affinity
     */
    setupMeditationAffinity() {
        this.meditationAffinity = Math.floor(this.consciousnessLevel / 1000);
    }
    
    /**
     * Update sacred object
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        this.updateConsciousnessEffects(deltaTime);
        this.updateSacredGeometry(deltaTime);
    }
    
    /**
     * Update consciousness effects
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousnessEffects(deltaTime) {
        // Override in subclasses
    }
    
    /**
     * Update sacred geometry
     * @param {number} deltaTime - Time since last update
     */
    updateSacredGeometry(deltaTime) {
        // Override in subclasses
    }
    
    /**
     * Interact with the sacred object
     * @param {Object} player - Player interacting with object
     * @returns {Object} Interaction result
     */
    interact(player) {
        console.log(`🌸 Player ${player.id} interacted with sacred object ${this.id}`);
        
        return {
            success: true,
            message: 'Sacred object interaction',
            consciousnessGain: 0,
            effects: []
        };
    }
    
    /**
     * Deactivate the sacred object
     */
    deactivate() {
        this.isActive = false;
        console.log(`🌸 Sacred object deactivated: ${this.id}`);
    }
    
    /**
     * Destroy the sacred object
     */
    destroy() {
        this.deactivate();
        console.log(`🌸 Sacred object destroyed: ${this.id}`);
    }
    
    /**
     * Get sacred object data
     * @returns {Object} Sacred object data
     */
    getData() {
        return {
            id: this.id,
            type: this.type,
            category: this.category,
            position: this.position,
            consciousnessLevel: this.consciousnessLevel,
            sacredGeometryPattern: this.sacredGeometryPattern,
            meditationAffinity: this.meditationAffinity,
            healingPower: this.healingPower,
            wisdomLevel: this.wisdomLevel,
            isActive: this.isActive,
            createdAt: this.createdAt,
            options: this.options
        };
    }
}

/**
 * Meditation Marker - Sacred object for meditation sessions
 */
class MeditationMarker extends SacredObject {
    constructor(position, consciousnessLevel, options = {}) {
        super(position, consciousnessLevel, options);
        
        this.type = 'meditation_marker';
        this.category = 'meditation';
        this.description = 'A sacred meditation marker';
        this.icon = '🧘';
        this.color = '#4b0082';
        
        // Meditation-specific properties
        this.meditationType = options.meditationType || 'basic';
        this.duration = options.duration || 300000; // 5 minutes
        this.consciousnessGainRate = options.consciousnessGainRate || 0.1;
        this.isMeditationActive = false;
        this.meditationStartTime = null;
        this.meditationProgress = 0;
        
        this.setupMeditationEffects();
    }
    
    /**
     * Setup meditation effects
     */
    setupMeditationEffects() {
        this.healingPower = Math.floor(this.consciousnessLevel / 100);
        this.wisdomLevel = Math.floor(this.consciousnessLevel / 500);
    }
    
    /**
     * Start meditation at this marker
     * @param {Object} player - Player starting meditation
     * @returns {Object} Meditation start result
     */
    startMeditation(player) {
        if (this.isMeditationActive) {
            return {
                success: false,
                message: 'Meditation already active at this marker'
            };
        }
        
        this.isMeditationActive = true;
        this.meditationStartTime = Date.now();
        this.meditationProgress = 0;
        
        console.log(`🌸 Meditation started at marker ${this.id} by player ${player.id}`);
        
        // Emit meditation start event
        if (window.eventBus) {
            window.eventBus.emit('sacred:meditation:started', {
                markerId: this.id,
                playerId: player.id,
                meditationType: this.meditationType,
                duration: this.duration
            });
        }
        
        return {
            success: true,
            message: `Meditation started: ${this.meditationType}`,
            meditationType: this.meditationType,
            duration: this.duration
        };
    }
    
    /**
     * Update meditation progress
     * @param {number} deltaTime - Time since last update
     */
    updateMeditationProgress(deltaTime) {
        if (!this.isMeditationActive || !this.meditationStartTime) return;
        
        const elapsed = Date.now() - this.meditationStartTime;
        this.meditationProgress = Math.min(elapsed / this.duration, 1);
        
        // Emit progress update
        if (window.eventBus) {
            window.eventBus.emit('sacred:meditation:progress', {
                markerId: this.id,
                progress: this.meditationProgress,
                elapsed: elapsed,
                duration: this.duration
            });
        }
        
        // Check if meditation is complete
        if (this.meditationProgress >= 1) {
            this.completeMeditation();
        }
    }
    
    /**
     * Complete meditation
     */
    completeMeditation() {
        if (!this.isMeditationActive) return;
        
        const consciousnessGain = Math.floor(this.meditationProgress * 50 * this.consciousnessGainRate);
        
        this.isMeditationActive = false;
        this.meditationStartTime = null;
        this.meditationProgress = 0;
        
        console.log(`🌸 Meditation completed at marker ${this.id} - Gained ${consciousnessGain} consciousness`);
        
        // Emit meditation completion event
        if (window.eventBus) {
            window.eventBus.emit('sacred:meditation:completed', {
                markerId: this.id,
                consciousnessGained: consciousnessGain,
                meditationType: this.meditationType
            });
        }
        
        return consciousnessGain;
    }
    
    /**
     * Interact with meditation marker
     * @param {Object} player - Player interacting with marker
     * @returns {Object} Interaction result
     */
    interact(player) {
        if (this.isMeditationActive) {
            return {
                success: false,
                message: 'Meditation already active at this marker'
            };
        }
        
        return this.startMeditation(player);
    }
    
    /**
     * Update consciousness effects
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousnessEffects(deltaTime) {
        super.updateConsciousnessEffects(deltaTime);
        
        // Update meditation progress
        this.updateMeditationProgress(deltaTime);
    }
}

/**
 * Healing Shrine - Sacred object for community healing
 */
class HealingShrine extends SacredObject {
    constructor(position, consciousnessLevel, options = {}) {
        super(position, consciousnessLevel, options);
        
        this.type = 'healing_shrine';
        this.category = 'healing';
        this.description = 'A sacred healing shrine';
        this.icon = '🏛️';
        this.color = '#ff6b6b';
        
        // Healing-specific properties
        this.healingRadius = options.healingRadius || 100; // meters
        this.healingPower = options.healingPower || Math.floor(consciousnessLevel / 10);
        this.healingRate = options.healingRate || 1; // healing per second
        this.maxHealingPerSession = options.maxHealingPerSession || 100;
        this.healingSessions = [];
        this.isHealingActive = false;
        
        this.setupHealingEffects();
    }
    
    /**
     * Setup healing effects
     */
    setupHealingEffects() {
        this.wisdomLevel = Math.floor(this.consciousnessLevel / 200);
        this.meditationAffinity = Math.floor(this.consciousnessLevel / 1000);
    }
    
    /**
     * Start healing session
     * @param {Object} player - Player starting healing
     * @returns {Object} Healing start result
     */
    startHealing(player) {
        if (this.isHealingActive) {
            return {
                success: false,
                message: 'Healing already active at this shrine'
            };
        }
        
        this.isHealingActive = true;
        const sessionId = this.generateId();
        
        const healingSession = {
            id: sessionId,
            playerId: player.id,
            startTime: Date.now(),
            healingReceived: 0,
            isActive: true
        };
        
        this.healingSessions.push(healingSession);
        
        console.log(`🌸 Healing started at shrine ${this.id} for player ${player.id}`);
        
        // Emit healing start event
        if (window.eventBus) {
            window.eventBus.emit('sacred:healing:started', {
                shrineId: this.id,
                playerId: player.id,
                healingPower: this.healingPower,
                healingRadius: this.healingRadius
            });
        }
        
        return {
            success: true,
            message: 'Healing session started',
            sessionId: sessionId,
            healingPower: this.healingPower
        };
    }
    
    /**
     * Update healing progress
     * @param {number} deltaTime - Time since last update
     */
    updateHealingProgress(deltaTime) {
        if (!this.isHealingActive) return;
        
        this.healingSessions.forEach(session => {
            if (session.isActive) {
                const healingAmount = this.healingRate * (deltaTime / 1000);
                session.healingReceived += healingAmount;
                
                // Check if max healing reached
                if (session.healingReceived >= this.maxHealingPerSession) {
                    this.completeHealing(session);
                }
            }
        });
    }
    
    /**
     * Complete healing session
     * @param {Object} session - Healing session to complete
     */
    completeHealing(session) {
        session.isActive = false;
        session.endTime = Date.now();
        
        console.log(`🌸 Healing completed at shrine ${this.id} for player ${session.playerId} - ${session.healingReceived} healing received`);
        
        // Emit healing completion event
        if (window.eventBus) {
            window.eventBus.emit('sacred:healing:completed', {
                shrineId: this.id,
                playerId: session.playerId,
                healingReceived: session.healingReceived,
                sessionDuration: session.endTime - session.startTime
            });
        }
        
        // Add community healing points
        if (window.consciousnessManager) {
            window.consciousnessManager.addCommunityHealing(Math.floor(session.healingReceived), 'healing_shrine');
        }
    }
    
    /**
     * Interact with healing shrine
     * @param {Object} player - Player interacting with shrine
     * @returns {Object} Interaction result
     */
    interact(player) {
        if (this.isHealingActive) {
            return {
                success: false,
                message: 'Healing already active at this shrine'
            };
        }
        
        return this.startHealing(player);
    }
    
    /**
     * Update consciousness effects
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousnessEffects(deltaTime) {
        super.updateConsciousnessEffects(deltaTime);
        
        // Update healing progress
        this.updateHealingProgress(deltaTime);
    }
}

/**
 * Wisdom Portal - Sacred object for spatial wisdom
 */
class WisdomPortal extends SacredObject {
    constructor(position, consciousnessLevel, options = {}) {
        super(position, consciousnessLevel, options);
        
        this.type = 'wisdom_portal';
        this.category = 'wisdom';
        this.description = 'A sacred wisdom portal';
        this.icon = '🌀';
        this.color = '#00bcd4';
        
        // Wisdom-specific properties
        this.wisdomLevel = options.wisdomLevel || Math.floor(consciousnessLevel / 100);
        this.wisdomRadius = options.wisdomRadius || 200; // meters
        this.wisdomGainRate = options.wisdomGainRate || 0.5; // wisdom per second
        this.maxWisdomPerSession = options.maxWisdomPerSession || 50;
        this.wisdomSessions = [];
        this.isWisdomActive = false;
        
        this.setupWisdomEffects();
    }
    
    /**
     * Setup wisdom effects
     */
    setupWisdomEffects() {
        this.healingPower = Math.floor(this.consciousnessLevel / 200);
        this.meditationAffinity = Math.floor(this.consciousnessLevel / 500);
    }
    
    /**
     * Start wisdom session
     * @param {Object} player - Player starting wisdom session
     * @returns {Object} Wisdom start result
     */
    startWisdom(player) {
        if (this.isWisdomActive) {
            return {
                success: false,
                message: 'Wisdom already active at this portal'
            };
        }
        
        this.isWisdomActive = true;
        const sessionId = this.generateId();
        
        const wisdomSession = {
            id: sessionId,
            playerId: player.id,
            startTime: Date.now(),
            wisdomReceived: 0,
            isActive: true
        };
        
        this.wisdomSessions.push(wisdomSession);
        
        console.log(`🌸 Wisdom session started at portal ${this.id} for player ${player.id}`);
        
        // Emit wisdom start event
        if (window.eventBus) {
            window.eventBus.emit('sacred:wisdom:started', {
                portalId: this.id,
                playerId: player.id,
                wisdomLevel: this.wisdomLevel,
                wisdomRadius: this.wisdomRadius
            });
        }
        
        return {
            success: true,
            message: 'Wisdom session started',
            sessionId: sessionId,
            wisdomLevel: this.wisdomLevel
        };
    }
    
    /**
     * Update wisdom progress
     * @param {number} deltaTime - Time since last update
     */
    updateWisdomProgress(deltaTime) {
        if (!this.isWisdomActive) return;
        
        this.wisdomSessions.forEach(session => {
            if (session.isActive) {
                const wisdomAmount = this.wisdomGainRate * (deltaTime / 1000);
                session.wisdomReceived += wisdomAmount;
                
                // Check if max wisdom reached
                if (session.wisdomReceived >= this.maxWisdomPerSession) {
                    this.completeWisdom(session);
                }
            }
        });
    }
    
    /**
     * Complete wisdom session
     * @param {Object} session - Wisdom session to complete
     */
    completeWisdom(session) {
        session.isActive = false;
        session.endTime = Date.now();
        
        console.log(`🌸 Wisdom session completed at portal ${this.id} for player ${session.playerId} - ${session.wisdomReceived} wisdom received`);
        
        // Emit wisdom completion event
        if (window.eventBus) {
            window.eventBus.emit('sacred:wisdom:completed', {
                portalId: this.id,
                playerId: session.playerId,
                wisdomReceived: session.wisdomReceived,
                sessionDuration: session.endTime - session.startTime
            });
        }
        
        // Add spatial wisdom points
        if (window.consciousnessManager) {
            window.consciousnessManager.addSpatialWisdom(Math.floor(session.wisdomReceived), 'wisdom_portal');
        }
    }
    
    /**
     * Interact with wisdom portal
     * @param {Object} player - Player interacting with portal
     * @returns {Object} Interaction result
     */
    interact(player) {
        if (this.isWisdomActive) {
            return {
                success: false,
                message: 'Wisdom already active at this portal'
            };
        }
        
        return this.startWisdom(player);
    }
    
    /**
     * Update consciousness effects
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousnessEffects(deltaTime) {
        super.updateConsciousnessEffects(deltaTime);
        
        // Update wisdom progress
        this.updateWisdomProgress(deltaTime);
    }
}

/**
 * Sacred Object Factory - Creates consciousness-aware sacred objects
 */
class SacredObjectFactory {
    constructor() {
        this.objectTypes = new Map();
        this.registerObjectTypes();
        this.createdObjects = new Map();
        
        console.log('🌸 Sacred Object Factory initialized');
    }
    
    /**
     * Register sacred object types
     */
    registerObjectTypes() {
        this.objectTypes.set('meditation_marker', MeditationMarker);
        this.objectTypes.set('healing_shrine', HealingShrine);
        this.objectTypes.set('wisdom_portal', WisdomPortal);
        this.objectTypes.set('sacred_geometry', SacredObject); // Base class for custom patterns
    }
    
    /**
     * Create sacred object
     * @param {string} type - Type of sacred object
     * @param {Object} position - Position {lat, lng}
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Additional options
     * @returns {SacredObject} Created sacred object
     */
    createObject(type, position, consciousnessLevel, options = {}) {
        const ObjectClass = this.objectTypes.get(type);
        if (!ObjectClass) {
            throw new Error(`Unknown sacred object type: ${type}`);
        }
        
        const object = new ObjectClass(position, consciousnessLevel, options);
        object.initialize();
        
        // Store created object
        this.createdObjects.set(object.id, object);
        
        // Emit creation event
        if (window.eventBus) {
            window.eventBus.emit('sacred:object:created', {
                type: type,
                position: position,
                consciousnessLevel: consciousnessLevel,
                objectId: object.id,
                options: options
            });
        }
        
        console.log(`🌸 Sacred object created: ${type} (${object.id})`);
        
        return object;
    }
    
    /**
     * Create meditation marker
     * @param {Object} position - Position {lat, lng}
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Meditation options
     * @returns {MeditationMarker} Created meditation marker
     */
    createMeditationMarker(position, consciousnessLevel, options = {}) {
        return this.createObject('meditation_marker', position, consciousnessLevel, {
            meditationType: options.meditationType || 'basic',
            duration: options.duration || 300000,
            consciousnessGainRate: options.consciousnessGainRate || 0.1,
            ...options
        });
    }
    
    /**
     * Create healing shrine
     * @param {Object} position - Position {lat, lng}
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Healing options
     * @returns {HealingShrine} Created healing shrine
     */
    createHealingShrine(position, consciousnessLevel, options = {}) {
        return this.createObject('healing_shrine', position, consciousnessLevel, {
            healingRadius: options.healingRadius || 100,
            healingPower: options.healingPower || Math.floor(consciousnessLevel / 10),
            healingRate: options.healingRate || 1,
            maxHealingPerSession: options.maxHealingPerSession || 100,
            ...options
        });
    }
    
    /**
     * Create wisdom portal
     * @param {Object} position - Position {lat, lng}
     * @param {number} consciousnessLevel - Consciousness level
     * @param {Object} options - Wisdom options
     * @returns {WisdomPortal} Created wisdom portal
     */
    createWisdomPortal(position, consciousnessLevel, options = {}) {
        return this.createObject('wisdom_portal', position, consciousnessLevel, {
            wisdomLevel: options.wisdomLevel || Math.floor(consciousnessLevel / 100),
            wisdomRadius: options.wisdomRadius || 200,
            wisdomGainRate: options.wisdomGainRate || 0.5,
            maxWisdomPerSession: options.maxWisdomPerSession || 50,
            ...options
        });
    }
    
    /**
     * Get created object by ID
     * @param {string} objectId - Object identifier
     * @returns {SacredObject} Sacred object
     */
    getObject(objectId) {
        return this.createdObjects.get(objectId);
    }
    
    /**
     * Remove sacred object
     * @param {string} objectId - Object identifier
     * @returns {boolean} True if object was removed
     */
    removeObject(objectId) {
        const object = this.createdObjects.get(objectId);
        if (object) {
            object.destroy();
            this.createdObjects.delete(objectId);
            
            // Emit removal event
            if (window.eventBus) {
                window.eventBus.emit('sacred:object:removed', {
                    objectId: objectId,
                    type: object.type
                });
            }
            
            console.log(`🌸 Sacred object removed: ${objectId}`);
            return true;
        }
        return false;
    }
    
    /**
     * Get all created objects
     * @returns {Map} All created objects
     */
    getAllObjects() {
        return this.createdObjects;
    }
    
    /**
     * Get objects by type
     * @param {string} type - Object type
     * @returns {Array} Objects of specified type
     */
    getObjectsByType(type) {
        const objects = [];
        this.createdObjects.forEach(object => {
            if (object.type === type) {
                objects.push(object);
            }
        });
        return objects;
    }
    
    /**
     * Update all objects
     * @param {number} deltaTime - Time since last update
     */
    updateAllObjects(deltaTime) {
        this.createdObjects.forEach(object => {
            object.update(deltaTime);
        });
    }
    
    /**
     * Get factory statistics
     * @returns {Object} Factory statistics
     */
    getStatistics() {
        const stats = {
            totalObjects: this.createdObjects.size,
            objectsByType: {},
            totalConsciousnessLevel: 0
        };
        
        this.createdObjects.forEach(object => {
            stats.objectsByType[object.type] = (stats.objectsByType[object.type] || 0) + 1;
            stats.totalConsciousnessLevel += object.consciousnessLevel;
        });
        
        return stats;
    }
}

// Initialize global sacred object factory
window.SacredObject = SacredObject;
window.MeditationMarker = MeditationMarker;
window.HealingShrine = HealingShrine;
window.WisdomPortal = WisdomPortal;
window.SacredObjectFactory = SacredObjectFactory;

// Create global factory instance
window.sacredObjectFactory = new SacredObjectFactory();

// Add global creation helpers
window.createMeditationMarker = (position, consciousnessLevel, options) => {
    return window.sacredObjectFactory.createMeditationMarker(position, consciousnessLevel, options);
};

window.createHealingShrine = (position, consciousnessLevel, options) => {
    return window.sacredObjectFactory.createHealingShrine(position, consciousnessLevel, options);
};

window.createWisdomPortal = (position, consciousnessLevel, options) => {
    return window.sacredObjectFactory.createWisdomPortal(position, consciousnessLevel, options);
};

console.log('🌸 Sacred Object Factory ready - Consciousness-aware object creation initialized');
