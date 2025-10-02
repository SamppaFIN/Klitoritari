/**
 * 🌸 CONSCIOUSNESS MANAGER SINGLETON
 * 
 * Global consciousness state management system for spatial wisdom and community healing.
 * Implements singleton pattern with consciousness-aware features.
 * 
 * Sacred Purpose: Centralized consciousness tracking, meditation session management,
 * and spatial wisdom coordination across all game systems.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

class ConsciousnessManager {
    static instance = null;
    
    /**
     * Get the singleton instance of ConsciousnessManager
     * @returns {ConsciousnessManager} The singleton instance
     */
    static getInstance() {
        if (!ConsciousnessManager.instance) {
            ConsciousnessManager.instance = new ConsciousnessManager();
        }
        return ConsciousnessManager.instance;
    }
    
    /**
     * Constructor - Initialize consciousness state
     */
    constructor() {
        // Core consciousness metrics
        this.consciousnessLevel = 0;
        this.meditationState = 'awake';
        this.spatialWisdom = 0;
        this.communityHealing = 0;
        
        // Meditation session data
        this.meditationSession = null;
        this.meditationHistory = [];
        
        // Consciousness milestones and achievements
        this.achievedMilestones = [];
        this.consciousnessMilestones = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000];
        
        // Event system for consciousness changes
        this.eventBus = null;
        this.initializeEventBus();
        
        // Sacred geometry affinity
        this.sacredGeometryAffinity = 0;
        this.activeSacredPatterns = new Set();
        
        // Community healing metrics
        this.communityConnections = 0;
        this.healingActionsPerformed = 0;
        
        console.log('🌸 ConsciousnessManager initialized - Sacred consciousness state ready');
    }
    
    /**
     * Initialize the event bus for consciousness events
     */
    initializeEventBus() {
        // Use existing event bus if available, otherwise create a simple one
        if (window.eventBus) {
            this.eventBus = window.eventBus;
        } else {
            this.eventBus = {
                events: new Map(),
                on: function(event, callback) {
                    if (!this.events.has(event)) {
                        this.events.set(event, []);
                    }
                    this.events.get(event).push(callback);
                },
                emit: function(event, data) {
                    if (this.events.has(event)) {
                        this.events.get(event).forEach(callback => {
                            try {
                                callback(data);
                            } catch (error) {
                                console.error(`🌸 Error in consciousness event handler:`, error);
                            }
                        });
                    }
                }
            };
        }
    }
    
    /**
     * Increase consciousness level with source tracking
     * @param {number} amount - Amount of consciousness to add
     * @param {string} source - Source of consciousness gain
     */
    increaseConsciousness(amount, source = 'unknown') {
        const previousLevel = this.consciousnessLevel;
        this.consciousnessLevel += amount;
        
        console.log(`🌸 Consciousness increased: +${amount} (${source}) - Total: ${this.consciousnessLevel}`);
        
        // Emit consciousness change event
        this.eventBus.emit('consciousness:increased', {
            amount: amount,
            previousLevel: previousLevel,
            newLevel: this.consciousnessLevel,
            source: source,
            timestamp: Date.now()
        });
        
        // Check for consciousness milestones
        this.checkConsciousnessMilestones();
        
        // Update sacred geometry affinity
        this.updateSacredGeometryAffinity();
        
        // Save consciousness state
        this.saveConsciousnessState();
    }
    
    /**
     * Decrease consciousness level (for challenges or setbacks)
     * @param {number} amount - Amount of consciousness to subtract
     * @param {string} reason - Reason for consciousness loss
     */
    decreaseConsciousness(amount, reason = 'challenge') {
        const previousLevel = this.consciousnessLevel;
        this.consciousnessLevel = Math.max(0, this.consciousnessLevel - amount);
        
        console.log(`🌸 Consciousness decreased: -${amount} (${reason}) - Total: ${this.consciousnessLevel}`);
        
        // Emit consciousness change event
        this.eventBus.emit('consciousness:decreased', {
            amount: amount,
            previousLevel: previousLevel,
            newLevel: this.consciousnessLevel,
            reason: reason,
            timestamp: Date.now()
        });
        
        // Update sacred geometry affinity
        this.updateSacredGeometryAffinity();
        
        // Save consciousness state
        this.saveConsciousnessState();
    }
    
    /**
     * Check for consciousness milestones and trigger events
     */
    checkConsciousnessMilestones() {
        this.consciousnessMilestones.forEach(milestone => {
            if (this.consciousnessLevel >= milestone && 
                !this.achievedMilestones.includes(milestone)) {
                
                this.achievedMilestones.push(milestone);
                
                console.log(`🌸 Consciousness Milestone Achieved: ${milestone}!`);
                
                // Emit milestone event
                this.eventBus.emit('consciousness:milestone', {
                    milestone: milestone,
                    level: this.consciousnessLevel,
                    timestamp: Date.now()
                });
                
                // Special effects for major milestones
                if (milestone >= 1000) {
                    this.eventBus.emit('consciousness:major_milestone', {
                        milestone: milestone,
                        level: this.consciousnessLevel
                    });
                }
            }
        });
    }
    
    /**
     * Start a meditation session
     * @param {number} duration - Duration in milliseconds
     * @param {string} type - Type of meditation
     * @param {Object} options - Additional meditation options
     */
    startMeditationSession(duration, type = 'basic', options = {}) {
        this.meditationSession = {
            startTime: Date.now(),
            duration: duration,
            type: type,
            progress: 0,
            consciousnessGain: 0,
            options: options
        };
        
        this.meditationState = 'meditating';
        
        console.log(`🌸 Meditation session started: ${type} for ${duration}ms`);
        
        // Emit meditation start event
        this.eventBus.emit('meditation:started', {
            session: this.meditationSession,
            timestamp: Date.now()
        });
        
        // Start meditation progress tracking
        this.startMeditationProgressTracking();
    }
    
    /**
     * Start tracking meditation progress
     */
    startMeditationProgressTracking() {
        if (!this.meditationSession) return;
        
        const updateProgress = () => {
            if (this.meditationState !== 'meditating' || !this.meditationSession) {
                return;
            }
            
            const elapsed = Date.now() - this.meditationSession.startTime;
            this.meditationSession.progress = Math.min(elapsed / this.meditationSession.duration, 1);
            
            // Calculate consciousness gain based on progress
            const baseGain = Math.floor(this.meditationSession.progress * 50);
            this.meditationSession.consciousnessGain = baseGain;
            
            // Emit progress update
            this.eventBus.emit('meditation:progress', {
                progress: this.meditationSession.progress,
                consciousnessGain: this.meditationSession.consciousnessGain,
                session: this.meditationSession
            });
            
            // Check if meditation is complete
            if (this.meditationSession.progress >= 1) {
                this.completeMeditationSession();
            } else {
                // Continue tracking
                setTimeout(updateProgress, 1000);
            }
        };
        
        updateProgress();
    }
    
    /**
     * Complete the current meditation session
     */
    completeMeditationSession() {
        if (!this.meditationSession) return;
        
        const session = this.meditationSession;
        const consciousnessGain = session.consciousnessGain;
        
        // Add consciousness gain
        this.increaseConsciousness(consciousnessGain, 'meditation');
        
        // Add to meditation history
        this.meditationHistory.push({
            ...session,
            completedAt: Date.now(),
            consciousnessGained: consciousnessGain
        });
        
        // Update meditation state
        this.meditationState = 'enlightened';
        
        console.log(`🌸 Meditation completed! Gained ${consciousnessGain} consciousness`);
        
        // Emit meditation completion event
        this.eventBus.emit('meditation:completed', {
            session: session,
            consciousnessGained: consciousnessGain,
            timestamp: Date.now()
        });
        
        // Clear current session
        this.meditationSession = null;
        
        // Return to awake state after a brief enlightened period
        setTimeout(() => {
            this.meditationState = 'awake';
            this.eventBus.emit('meditation:awake', { timestamp: Date.now() });
        }, 5000);
    }
    
    /**
     * Update sacred geometry affinity based on consciousness level
     */
    updateSacredGeometryAffinity() {
        const oldAffinity = this.sacredGeometryAffinity;
        
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
        
        if (oldAffinity !== this.sacredGeometryAffinity) {
            this.eventBus.emit('sacred:geometry:affinity_changed', {
                oldAffinity: oldAffinity,
                newAffinity: this.sacredGeometryAffinity,
                consciousnessLevel: this.consciousnessLevel
            });
        }
    }
    
    /**
     * Add spatial wisdom points
     * @param {number} points - Points to add
     * @param {string} source - Source of wisdom
     */
    addSpatialWisdom(points, source = 'exploration') {
        this.spatialWisdom += points;
        
        console.log(`🌸 Spatial wisdom gained: +${points} (${source}) - Total: ${this.spatialWisdom}`);
        
        this.eventBus.emit('spatial:wisdom:gained', {
            points: points,
            total: this.spatialWisdom,
            source: source,
            timestamp: Date.now()
        });
        
        this.saveConsciousnessState();
    }
    
    /**
     * Add community healing points
     * @param {number} points - Points to add
     * @param {string} action - Healing action performed
     */
    addCommunityHealing(points, action = 'connection') {
        this.communityHealing += points;
        this.healingActionsPerformed++;
        
        console.log(`🌸 Community healing: +${points} (${action}) - Total: ${this.communityHealing}`);
        
        this.eventBus.emit('community:healing:gained', {
            points: points,
            total: this.communityHealing,
            action: action,
            timestamp: Date.now()
        });
        
        this.saveConsciousnessState();
    }
    
    /**
     * Get current consciousness state
     * @returns {Object} Current consciousness state
     */
    getConsciousnessState() {
        return {
            consciousnessLevel: this.consciousnessLevel,
            meditationState: this.meditationState,
            spatialWisdom: this.spatialWisdom,
            communityHealing: this.communityHealing,
            sacredGeometryAffinity: this.sacredGeometryAffinity,
            achievedMilestones: [...this.achievedMilestones],
            meditationHistory: [...this.meditationHistory],
            communityConnections: this.communityConnections,
            healingActionsPerformed: this.healingActionsPerformed
        };
    }
    
    /**
     * Save consciousness state to localStorage
     */
    saveConsciousnessState() {
        try {
            const state = this.getConsciousnessState();
            localStorage.setItem('consciousnessState', JSON.stringify(state));
        } catch (error) {
            console.error('🌸 Error saving consciousness state:', error);
        }
    }
    
    /**
     * Load consciousness state from localStorage
     */
    loadConsciousnessState() {
        try {
            const saved = localStorage.getItem('consciousnessState');
            if (saved) {
                const state = JSON.parse(saved);
                
                this.consciousnessLevel = state.consciousnessLevel || 0;
                this.meditationState = state.meditationState || 'awake';
                this.spatialWisdom = state.spatialWisdom || 0;
                this.communityHealing = state.communityHealing || 0;
                this.sacredGeometryAffinity = state.sacredGeometryAffinity || 0;
                this.achievedMilestones = state.achievedMilestones || [];
                this.meditationHistory = state.meditationHistory || [];
                this.communityConnections = state.communityConnections || 0;
                this.healingActionsPerformed = state.healingActionsPerformed || 0;
                
                console.log('🌸 Consciousness state loaded from storage');
                
                // Emit loaded event
                this.eventBus.emit('consciousness:state_loaded', {
                    state: this.getConsciousnessState(),
                    timestamp: Date.now()
                });
            }
        } catch (error) {
            console.error('🌸 Error loading consciousness state:', error);
        }
    }
    
    /**
     * Reset consciousness state (for new game or reset)
     */
    resetConsciousnessState() {
        this.consciousnessLevel = 0;
        this.meditationState = 'awake';
        this.spatialWisdom = 0;
        this.communityHealing = 0;
        this.sacredGeometryAffinity = 0;
        this.achievedMilestones = [];
        this.meditationHistory = [];
        this.communityConnections = 0;
        this.healingActionsPerformed = 0;
        this.meditationSession = null;
        
        console.log('🌸 Consciousness state reset');
        
        this.eventBus.emit('consciousness:state_reset', {
            timestamp: Date.now()
        });
        
        this.saveConsciousnessState();
    }
    
    /**
     * Get consciousness level description
     * @returns {string} Description of current consciousness level
     */
    getConsciousnessLevelDescription() {
        if (this.consciousnessLevel >= 50000) return 'Transcendent Being';
        if (this.consciousnessLevel >= 25000) return 'Enlightened Master';
        if (this.consciousnessLevel >= 10000) return 'Wise Sage';
        if (this.consciousnessLevel >= 5000) return 'Conscious Explorer';
        if (this.consciousnessLevel >= 1000) return 'Aware Seeker';
        if (this.consciousnessLevel >= 500) return 'Mindful Traveler';
        if (this.consciousnessLevel >= 100) return 'Conscious Beginner';
        return 'Awakening Soul';
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
}

// Initialize global consciousness manager
window.ConsciousnessManager = ConsciousnessManager;

// Create singleton instance
window.consciousnessManager = ConsciousnessManager.getInstance();

// Load saved consciousness state
window.consciousnessManager.loadConsciousnessState();

console.log('🌸 ConsciousnessManager singleton ready - Sacred consciousness state initialized');
