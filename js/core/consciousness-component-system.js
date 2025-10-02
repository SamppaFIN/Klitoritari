/**
 * 🌸 CONSCIOUSNESS COMPONENT SYSTEM
 * 
 * Modular consciousness-aware component system for entities and objects.
 * Implements component pattern with consciousness-specific behaviors.
 * 
 * Sacred Purpose: Enables composable consciousness behaviors, meditation
 * capabilities, and sacred geometry integration for game entities.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Base consciousness component class
 */
class ConsciousnessComponent {
    constructor(entity) {
        this.entity = entity;
        this.consciousnessLevel = 0;
        this.meditationCapability = false;
        this.sacredGeometryAffinity = 0;
        this.isActive = true;
        this.updateInterval = null;
    }
    
    /**
     * Initialize the consciousness component
     */
    init() {
        this.setupConsciousnessTracking();
        this.startUpdateLoop();
        console.log(`🌸 Consciousness component initialized for entity: ${this.entity.id || 'unknown'}`);
    }
    
    /**
     * Update the consciousness component
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isActive) return;
        
        this.updateConsciousness(deltaTime);
        this.updateSacredGeometry();
        this.updateMeditationCapability();
    }
    
    /**
     * Update consciousness level
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousness(deltaTime) {
        // Sync with global consciousness manager
        if (window.consciousnessManager) {
            this.consciousnessLevel = window.consciousnessManager.consciousnessLevel;
        }
    }
    
    /**
     * Update sacred geometry affinity
     */
    updateSacredGeometry() {
        if (this.consciousnessLevel >= 50000) {
            this.sacredGeometryAffinity = 5; // Metatron's Cube
        } else if (this.consciousnessLevel >= 25000) {
            this.sacredGeometryAffinity = 4; // Flower of Life
        } else if (this.consciousnessLevel >= 10000) {
            this.sacredGeometryAffinity = 3; // Golden Ratio
        } else if (this.consciousnessLevel >= 5000) {
            this.sacredGeometryAffinity = 2; // Sacred Geometry
        } else if (this.consciousnessLevel >= 1000) {
            this.sacredGeometryAffinity = 1; // Basic Patterns
        } else {
            this.sacredGeometryAffinity = 0; // No patterns
        }
    }
    
    /**
     * Update meditation capability
     */
    updateMeditationCapability() {
        this.meditationCapability = this.consciousnessLevel > 0;
    }
    
    /**
     * Check if entity can meditate
     * @returns {boolean} True if can meditate
     */
    canMeditate() {
        return this.meditationCapability && this.consciousnessLevel > 0;
    }
    
    /**
     * Get sacred geometry pattern for current consciousness level
     * @returns {string} Sacred geometry pattern name
     */
    getSacredGeometryPattern() {
        switch (this.sacredGeometryAffinity) {
            case 5: return 'metatronCube';
            case 4: return 'flowerOfLife';
            case 3: return 'goldenRatio';
            case 2: return 'sacredGeometry';
            case 1: return 'basicPatterns';
            default: return 'none';
        }
    }
    
    /**
     * Setup consciousness tracking
     */
    setupConsciousnessTracking() {
        // Listen for consciousness changes
        if (window.eventBus) {
            window.eventBus.on('consciousness:increased', (data) => {
                this.onConsciousnessChanged(data);
            });
            
            window.eventBus.on('consciousness:decreased', (data) => {
                this.onConsciousnessChanged(data);
            });
        }
    }
    
    /**
     * Handle consciousness changes
     * @param {Object} data - Consciousness change data
     */
    onConsciousnessChanged(data) {
        this.updateConsciousness(0);
        this.updateSacredGeometry();
        this.updateMeditationCapability();
        
        // Emit entity consciousness change
        if (window.eventBus) {
            window.eventBus.emit('entity:consciousness:changed', {
                entityId: this.entity.id,
                consciousnessLevel: this.consciousnessLevel,
                sacredGeometryAffinity: this.sacredGeometryAffinity,
                meditationCapability: this.meditationCapability
            });
        }
    }
    
    /**
     * Start update loop
     */
    startUpdateLoop() {
        const update = () => {
            if (this.isActive) {
                this.update(16); // ~60fps
            }
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
     * Activate the component
     */
    activate() {
        this.isActive = true;
        if (!this.updateInterval) {
            this.startUpdateLoop();
        }
    }
    
    /**
     * Deactivate the component
     */
    deactivate() {
        this.isActive = false;
        this.stopUpdateLoop();
    }
    
    /**
     * Destroy the component
     */
    destroy() {
        this.deactivate();
        console.log(`🌸 Consciousness component destroyed for entity: ${this.entity.id || 'unknown'}`);
    }
}

/**
 * Meditation component for entities
 */
class MeditationComponent {
    constructor(entity) {
        this.entity = entity;
        this.meditationDuration = 0;
        this.meditationType = 'basic';
        this.isActive = false;
        this.startTime = null;
        this.targetDuration = 300000; // 5 minutes default
        this.consciousnessGainRate = 0.1; // consciousness per second
    }
    
    /**
     * Initialize the meditation component
     */
    init() {
        this.setupMeditationTracking();
        console.log(`🌸 Meditation component initialized for entity: ${this.entity.id || 'unknown'}`);
    }
    
    /**
     * Start meditation
     * @param {string} type - Type of meditation
     * @param {number} duration - Duration in milliseconds
     */
    startMeditation(type = 'basic', duration = 300000) {
        this.meditationType = type;
        this.targetDuration = duration;
        this.isActive = true;
        this.startTime = Date.now();
        this.meditationDuration = 0;
        
        console.log(`🌸 Entity ${this.entity.id} started ${type} meditation for ${duration}ms`);
        
        // Emit meditation start event
        if (window.eventBus) {
            window.eventBus.emit('entity:meditation:started', {
                entityId: this.entity.id,
                type: type,
                duration: duration,
                timestamp: Date.now()
            });
        }
    }
    
    /**
     * Update meditation progress
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        if (!this.isActive || !this.startTime) return;
        
        const elapsed = Date.now() - this.startTime;
        this.meditationDuration = elapsed;
        
        const progress = Math.min(elapsed / this.targetDuration, 1);
        
        // Emit progress update
        if (window.eventBus) {
            window.eventBus.emit('entity:meditation:progress', {
                entityId: this.entity.id,
                progress: progress,
                elapsed: elapsed,
                targetDuration: this.targetDuration
            });
        }
        
        // Check if meditation is complete
        if (progress >= 1) {
            this.completeMeditation();
        }
    }
    
    /**
     * Complete meditation
     */
    completeMeditation() {
        if (!this.isActive) return;
        
        const consciousnessGain = Math.floor(this.meditationDuration / 6000); // 1 consciousness per 6 seconds
        
        this.isActive = false;
        
        console.log(`🌸 Entity ${this.entity.id} completed meditation - Gained ${consciousnessGain} consciousness`);
        
        // Emit meditation completion event
        if (window.eventBus) {
            window.eventBus.emit('entity:meditation:completed', {
                entityId: this.entity.id,
                type: this.meditationType,
                duration: this.meditationDuration,
                consciousnessGained: consciousnessGain,
                timestamp: Date.now()
            });
        }
        
        // Add consciousness to global manager
        if (window.consciousnessManager) {
            window.consciousnessManager.increaseConsciousness(consciousnessGain, `entity_meditation_${this.entity.id}`);
        }
        
        // Reset meditation state
        this.startTime = null;
        this.meditationDuration = 0;
    }
    
    /**
     * Stop meditation
     */
    stopMeditation() {
        if (!this.isActive) return;
        
        this.isActive = false;
        
        console.log(`🌸 Entity ${this.entity.id} stopped meditation`);
        
        // Emit meditation stop event
        if (window.eventBus) {
            window.eventBus.emit('entity:meditation:stopped', {
                entityId: this.entity.id,
                duration: this.meditationDuration,
                timestamp: Date.now()
            });
        }
        
        this.startTime = null;
        this.meditationDuration = 0;
    }
    
    /**
     * Setup meditation tracking
     */
    setupMeditationTracking() {
        // Listen for global meditation events
        if (window.eventBus) {
            window.eventBus.on('meditation:started', (data) => {
                this.onGlobalMeditationStarted(data);
            });
            
            window.eventBus.on('meditation:completed', (data) => {
                this.onGlobalMeditationCompleted(data);
            });
        }
    }
    
    /**
     * Handle global meditation start
     * @param {Object} data - Meditation data
     */
    onGlobalMeditationStarted(data) {
        // Sync with global meditation if this entity is the player
        if (this.entity.isPlayer) {
            this.startMeditation(data.session.type, data.session.duration);
        }
    }
    
    /**
     * Handle global meditation completion
     * @param {Object} data - Meditation data
     */
    onGlobalMeditationCompleted(data) {
        // Sync with global meditation if this entity is the player
        if (this.entity.isPlayer) {
            this.completeMeditation();
        }
    }
    
    /**
     * Get meditation progress
     * @returns {number} Meditation progress (0-1)
     */
    getProgress() {
        if (!this.isActive || !this.startTime) return 0;
        return Math.min((Date.now() - this.startTime) / this.targetDuration, 1);
    }
    
    /**
     * Check if meditation is active
     * @returns {boolean} True if meditation is active
     */
    isMeditating() {
        return this.isActive;
    }
    
    /**
     * Destroy the meditation component
     */
    destroy() {
        this.stopMeditation();
        console.log(`🌸 Meditation component destroyed for entity: ${this.entity.id || 'unknown'}`);
    }
}

/**
 * Sacred geometry component for entities
 */
class SacredGeometryComponent {
    constructor(entity) {
        this.entity = entity;
        this.patternType = 'basic';
        this.consciousnessRequired = 0;
        this.isVisible = false;
        this.geometryRenderer = null;
    }
    
    /**
     * Initialize the sacred geometry component
     */
    init() {
        this.setupSacredGeometry();
        console.log(`🌸 Sacred geometry component initialized for entity: ${this.entity.id || 'unknown'}`);
    }
    
    /**
     * Setup sacred geometry
     */
    setupSacredGeometry() {
        // Determine consciousness requirement based on pattern type
        switch (this.patternType) {
            case 'metatronCube':
                this.consciousnessRequired = 50000;
                break;
            case 'flowerOfLife':
                this.consciousnessRequired = 25000;
                break;
            case 'goldenRatio':
                this.consciousnessRequired = 10000;
                break;
            case 'sacredGeometry':
                this.consciousnessRequired = 5000;
                break;
            case 'basicPatterns':
                this.consciousnessRequired = 1000;
                break;
            default:
                this.consciousnessRequired = 0;
        }
    }
    
    /**
     * Update sacred geometry
     * @param {number} deltaTime - Time since last update
     */
    update(deltaTime) {
        const currentConsciousness = this.entity.consciousnessComponent?.consciousnessLevel || 0;
        
        // Check if sacred geometry should be visible
        const shouldBeVisible = currentConsciousness >= this.consciousnessRequired;
        
        if (shouldBeVisible && !this.isVisible) {
            this.showSacredGeometry();
        } else if (!shouldBeVisible && this.isVisible) {
            this.hideSacredGeometry();
        }
        
        // Update geometry if visible
        if (this.isVisible) {
            this.updateSacredGeometryVisuals(deltaTime);
        }
    }
    
    /**
     * Show sacred geometry
     */
    showSacredGeometry() {
        this.isVisible = true;
        
        // Create geometry renderer
        this.geometryRenderer = this.createGeometryRenderer();
        
        console.log(`🌸 Sacred geometry ${this.patternType} shown for entity: ${this.entity.id}`);
        
        // Emit sacred geometry shown event
        if (window.eventBus) {
            window.eventBus.emit('entity:sacred:geometry:shown', {
                entityId: this.entity.id,
                patternType: this.patternType,
                consciousnessRequired: this.consciousnessRequired
            });
        }
    }
    
    /**
     * Hide sacred geometry
     */
    hideSacredGeometry() {
        this.isVisible = false;
        
        // Destroy geometry renderer
        if (this.geometryRenderer) {
            this.geometryRenderer.destroy();
            this.geometryRenderer = null;
        }
        
        console.log(`🌸 Sacred geometry ${this.patternType} hidden for entity: ${this.entity.id}`);
        
        // Emit sacred geometry hidden event
        if (window.eventBus) {
            window.eventBus.emit('entity:sacred:geometry:hidden', {
                entityId: this.entity.id,
                patternType: this.patternType
            });
        }
    }
    
    /**
     * Create geometry renderer
     * @returns {Object} Geometry renderer
     */
    createGeometryRenderer() {
        // This would integrate with the actual sacred geometry rendering system
        return {
            patternType: this.patternType,
            entity: this.entity,
            destroy: () => {
                console.log(`🌸 Sacred geometry renderer destroyed for ${this.patternType}`);
            }
        };
    }
    
    /**
     * Update sacred geometry visuals
     * @param {number} deltaTime - Time since last update
     */
    updateSacredGeometryVisuals(deltaTime) {
        // Update geometry animation, colors, etc.
        if (this.geometryRenderer) {
            // This would update the actual geometry visuals
        }
    }
    
    /**
     * Set pattern type
     * @param {string} patternType - Sacred geometry pattern type
     */
    setPatternType(patternType) {
        this.patternType = patternType;
        this.setupSacredGeometry();
        
        // Update visibility if already visible
        if (this.isVisible) {
            this.hideSacredGeometry();
            this.showSacredGeometry();
        }
    }
    
    /**
     * Get pattern type
     * @returns {string} Sacred geometry pattern type
     */
    getPatternType() {
        return this.patternType;
    }
    
    /**
     * Destroy the sacred geometry component
     */
    destroy() {
        this.hideSacredGeometry();
        console.log(`🌸 Sacred geometry component destroyed for entity: ${this.entity.id || 'unknown'}`);
    }
}

/**
 * Component manager for entities
 */
class ConsciousnessComponentManager {
    constructor() {
        this.entities = new Map();
        this.componentTypes = new Map();
        this.registerComponentTypes();
    }
    
    /**
     * Register component types
     */
    registerComponentTypes() {
        this.componentTypes.set('consciousness', ConsciousnessComponent);
        this.componentTypes.set('meditation', MeditationComponent);
        this.componentTypes.set('sacredGeometry', SacredGeometryComponent);
    }
    
    /**
     * Create entity with consciousness components
     * @param {string} entityId - Entity identifier
     * @param {Object} entityData - Entity data
     * @param {Array} componentTypes - Array of component types to add
     * @returns {Object} Created entity
     */
    createEntity(entityId, entityData, componentTypes = ['consciousness']) {
        const entity = {
            id: entityId,
            ...entityData,
            components: new Map()
        };
        
        // Add requested components
        componentTypes.forEach(componentType => {
            this.addComponent(entity, componentType);
        });
        
        this.entities.set(entityId, entity);
        
        console.log(`🌸 Entity ${entityId} created with components: ${componentTypes.join(', ')}`);
        
        return entity;
    }
    
    /**
     * Add component to entity
     * @param {Object} entity - Entity to add component to
     * @param {string} componentType - Type of component to add
     * @returns {Object} Added component
     */
    addComponent(entity, componentType) {
        const ComponentClass = this.componentTypes.get(componentType);
        if (!ComponentClass) {
            console.error(`🌸 Unknown component type: ${componentType}`);
            return null;
        }
        
        const component = new ComponentClass(entity);
        component.init();
        
        entity.components.set(componentType, component);
        
        console.log(`🌸 Component ${componentType} added to entity ${entity.id}`);
        
        return component;
    }
    
    /**
     * Remove component from entity
     * @param {Object} entity - Entity to remove component from
     * @param {string} componentType - Type of component to remove
     */
    removeComponent(entity, componentType) {
        const component = entity.components.get(componentType);
        if (component) {
            component.destroy();
            entity.components.delete(componentType);
            console.log(`🌸 Component ${componentType} removed from entity ${entity.id}`);
        }
    }
    
    /**
     * Get component from entity
     * @param {string} entityId - Entity identifier
     * @param {string} componentType - Component type
     * @returns {Object} Component instance
     */
    getComponent(entityId, componentType) {
        const entity = this.entities.get(entityId);
        if (entity) {
            return entity.components.get(componentType);
        }
        return null;
    }
    
    /**
     * Update all entities
     * @param {number} deltaTime - Time since last update
     */
    updateAll(deltaTime) {
        this.entities.forEach(entity => {
            entity.components.forEach(component => {
                if (component.update) {
                    component.update(deltaTime);
                }
            });
        });
    }
    
    /**
     * Destroy entity
     * @param {string} entityId - Entity identifier
     */
    destroyEntity(entityId) {
        const entity = this.entities.get(entityId);
        if (entity) {
            // Destroy all components
            entity.components.forEach(component => {
                component.destroy();
            });
            
            this.entities.delete(entityId);
            console.log(`🌸 Entity ${entityId} destroyed`);
        }
    }
    
    /**
     * Get all entities
     * @returns {Map} All entities
     */
    getAllEntities() {
        return this.entities;
    }
    
    /**
     * Get entities with specific component
     * @param {string} componentType - Component type
     * @returns {Array} Entities with component
     */
    getEntitiesWithComponent(componentType) {
        const entities = [];
        this.entities.forEach(entity => {
            if (entity.components.has(componentType)) {
                entities.push(entity);
            }
        });
        return entities;
    }
}

// Initialize global consciousness component system
window.ConsciousnessComponent = ConsciousnessComponent;
window.MeditationComponent = MeditationComponent;
window.SacredGeometryComponent = SacredGeometryComponent;
window.ConsciousnessComponentManager = ConsciousnessComponentManager;

// Create global component manager
window.consciousnessComponentManager = new ConsciousnessComponentManager();

// Add global entity creation helper
window.createConsciousnessEntity = (entityId, entityData, componentTypes) => {
    return window.consciousnessComponentManager.createEntity(entityId, entityData, componentTypes);
};

console.log('🌸 Consciousness Component System ready - Modular consciousness behaviors initialized');
