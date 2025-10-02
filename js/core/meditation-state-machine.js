/**
 * 🌸 MEDITATION STATE MACHINE
 * 
 * Consciousness-aware state machine for meditation flow management.
 * Implements state pattern with meditation-specific transitions.
 * 
 * Sacred Purpose: Manages meditation states (awake, meditating, enlightened)
 * with consciousness-aware transitions and sacred geometry effects.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Base class for meditation states
 */
class MeditationState {
    constructor(name) {
        this.name = name;
        this.entryTime = null;
        this.duration = 0;
    }
    
    /**
     * Enter the meditation state
     * @param {MeditationStateMachine} context - State machine context
     */
    enter(context) {
        this.entryTime = Date.now();
        console.log(`🌸 Entering meditation state: ${this.name}`);
        this.onEnter(context);
    }
    
    /**
     * Update the meditation state
     * @param {MeditationStateMachine} context - State machine context
     * @param {number} deltaTime - Time since last update
     */
    update(context, deltaTime) {
        this.duration = Date.now() - this.entryTime;
        this.onUpdate(context, deltaTime);
    }
    
    /**
     * Exit the meditation state
     * @param {MeditationStateMachine} context - State machine context
     */
    exit(context) {
        console.log(`🌸 Exiting meditation state: ${this.name} (duration: ${this.duration}ms)`);
        this.onExit(context);
    }
    
    /**
     * Override in subclasses for state-specific entry logic
     * @param {MeditationStateMachine} context - State machine context
     */
    onEnter(context) {
        // Override in subclasses
    }
    
    /**
     * Override in subclasses for state-specific update logic
     * @param {MeditationStateMachine} context - State machine context
     * @param {number} deltaTime - Time since last update
     */
    onUpdate(context, deltaTime) {
        // Override in subclasses
    }
    
    /**
     * Override in subclasses for state-specific exit logic
     * @param {MeditationStateMachine} context - State machine context
     */
    onExit(context) {
        // Override in subclasses
    }
}

/**
 * Awake State - Default meditation state
 */
class AwakeState extends MeditationState {
    constructor() {
        super('awake');
    }
    
    onEnter(context) {
        context.stopMeditationEffects();
        context.setMeditationProgress(0);
        
        // Emit awake event
        if (window.eventBus) {
            window.eventBus.emit('meditation:awake', {
                timestamp: Date.now(),
                consciousnessLevel: context.consciousnessLevel
            });
        }
    }
    
    onUpdate(context, deltaTime) {
        // Check if should start meditation
        if (context.shouldStartMeditation()) {
            context.setState(new MeditatingState());
        }
        
        // Update consciousness awareness
        context.updateConsciousnessAwareness(deltaTime);
    }
    
    onExit(context) {
        // Prepare for meditation
        context.prepareForMeditation();
    }
}

/**
 * Meditating State - Active meditation session
 */
class MeditatingState extends MeditationState {
    constructor() {
        super('meditating');
        this.meditationStartTime = null;
        this.targetDuration = 300000; // 5 minutes default
        this.consciousnessGainRate = 0.1; // consciousness per second
    }
    
    onEnter(context) {
        this.meditationStartTime = Date.now();
        context.startMeditationEffects();
        context.setMeditationProgress(0);
        
        // Set meditation session data
        context.meditationSession = {
            startTime: this.meditationStartTime,
            targetDuration: this.targetDuration,
            type: context.meditationType || 'basic',
            consciousnessGain: 0
        };
        
        console.log(`🌸 Meditation session started: ${context.meditationType || 'basic'}`);
        
        // Emit meditation start event
        if (window.eventBus) {
            window.eventBus.emit('meditation:started', {
                session: context.meditationSession,
                timestamp: Date.now()
            });
        }
    }
    
    onUpdate(context, deltaTime) {
        if (!this.meditationStartTime) return;
        
        const elapsed = Date.now() - this.meditationStartTime;
        const progress = Math.min(elapsed / this.targetDuration, 1);
        
        // Update meditation progress
        context.setMeditationProgress(progress);
        
        // Calculate consciousness gain
        const consciousnessGain = Math.floor(progress * 50); // Max 50 consciousness
        context.meditationSession.consciousnessGain = consciousnessGain;
        
        // Emit progress update
        if (window.eventBus) {
            window.eventBus.emit('meditation:progress', {
                progress: progress,
                consciousnessGain: consciousnessGain,
                elapsed: elapsed,
                targetDuration: this.targetDuration
            });
        }
        
        // Check if meditation is complete
        if (progress >= 1) {
            context.setState(new EnlightenedState());
        }
        
        // Update meditation effects based on progress
        context.updateMeditationEffects(progress);
    }
    
    onExit(context) {
        context.endMeditationEffects();
        
        // Calculate final consciousness gain
        const finalGain = context.meditationSession?.consciousnessGain || 0;
        
        console.log(`🌸 Meditation session completed - Gained ${finalGain} consciousness`);
        
        // Emit meditation completion event
        if (window.eventBus) {
            window.eventBus.emit('meditation:completed', {
                session: context.meditationSession,
                consciousnessGained: finalGain,
                duration: this.duration,
                timestamp: Date.now()
            });
        }
    }
}

/**
 * Enlightened State - Post-meditation enlightenment
 */
class EnlightenedState extends MeditationState {
    constructor() {
        super('enlightened');
        this.enlightenmentDuration = 5000; // 5 seconds
        this.enlightenmentStartTime = null;
    }
    
    onEnter(context) {
        this.enlightenmentStartTime = Date.now();
        
        // Gain consciousness from meditation
        const consciousnessGain = context.meditationSession?.consciousnessGain || 0;
        if (consciousnessGain > 0 && window.consciousnessManager) {
            window.consciousnessManager.increaseConsciousness(consciousnessGain, 'meditation');
        }
        
        // Start enlightenment effects
        context.startEnlightenmentEffects();
        
        console.log(`🌸 Enlightenment achieved! Gained ${consciousnessGain} consciousness`);
        
        // Emit enlightenment event
        if (window.eventBus) {
            window.eventBus.emit('meditation:enlightened', {
                consciousnessGained: consciousnessGain,
                enlightenmentDuration: this.enlightenmentDuration,
                timestamp: Date.now()
            });
        }
    }
    
    onUpdate(context, deltaTime) {
        if (!this.enlightenmentStartTime) return;
        
        const elapsed = Date.now() - this.enlightenmentStartTime;
        const progress = Math.min(elapsed / this.enlightenmentDuration, 1);
        
        // Update enlightenment effects
        context.updateEnlightenmentEffects(progress);
        
        // Check if should return to awake state
        if (progress >= 1) {
            context.setState(new AwakeState());
        }
    }
    
    onExit(context) {
        context.endEnlightenmentEffects();
        
        // Clear meditation session
        context.meditationSession = null;
        
        console.log('🌸 Enlightenment period ended - Returning to awake state');
        
        // Emit enlightenment end event
        if (window.eventBus) {
            window.eventBus.emit('meditation:enlightenment_ended', {
                timestamp: Date.now()
            });
        }
    }
}

/**
 * Meditation State Machine - Main state management system
 */
class MeditationStateMachine {
    constructor() {
        this.currentState = new AwakeState();
        this.previousState = null;
        this.states = {
            awake: new AwakeState(),
            meditating: new MeditatingState(),
            enlightened: new EnlightenedState()
        };
        
        // Meditation context data
        this.meditationType = 'basic';
        this.meditationProgress = 0;
        this.meditationSession = null;
        this.consciousnessLevel = 0;
        
        // Meditation effects
        this.meditationEffects = {
            particles: null,
            sounds: null,
            visuals: null
        };
        
        // Update loop
        this.lastUpdateTime = Date.now();
        this.updateLoop();
        
        console.log('🌸 Meditation State Machine initialized');
    }
    
    /**
     * Transition to a new state
     * @param {MeditationState} newState - New state to transition to
     */
    setState(newState) {
        if (this.currentState === newState) return;
        
        this.previousState = this.currentState;
        this.currentState.exit(this);
        this.currentState = newState;
        this.currentState.enter(this);
    }
    
    /**
     * Start meditation with specified type and duration
     * @param {string} type - Type of meditation
     * @param {number} duration - Duration in milliseconds
     */
    startMeditation(type = 'basic', duration = 300000) {
        this.meditationType = type;
        
        // Set target duration for meditating state
        if (this.states.meditating) {
            this.states.meditating.targetDuration = duration;
        }
        
        // Transition to meditating state
        this.setState(this.states.meditating);
    }
    
    /**
     * Stop current meditation
     */
    stopMeditation() {
        if (this.currentState.name === 'meditating') {
            this.setState(this.states.enlightened);
        }
    }
    
    /**
     * Check if should start meditation
     * @returns {boolean} True if should start meditation
     */
    shouldStartMeditation() {
        // This can be overridden with specific conditions
        // For now, return false (manual meditation start)
        return false;
    }
    
    /**
     * Update consciousness awareness
     * @param {number} deltaTime - Time since last update
     */
    updateConsciousnessAwareness(deltaTime) {
        // Update consciousness level from manager
        if (window.consciousnessManager) {
            this.consciousnessLevel = window.consciousnessManager.consciousnessLevel;
        }
    }
    
    /**
     * Set meditation progress
     * @param {number} progress - Progress value (0-1)
     */
    setMeditationProgress(progress) {
        this.meditationProgress = Math.max(0, Math.min(1, progress));
    }
    
    /**
     * Prepare for meditation
     */
    prepareForMeditation() {
        // Override in subclasses for specific preparation
    }
    
    /**
     * Start meditation effects
     */
    startMeditationEffects() {
        // Start particle effects
        if (window.cosmicParticleSystem) {
            window.cosmicParticleSystem.start();
        }
        
        // Start meditation sounds
        if (window.soundManager) {
            window.soundManager.playMeditationAmbience();
        }
        
        // Start visual effects
        this.startMeditationVisuals();
    }
    
    /**
     * Update meditation effects
     * @param {number} progress - Meditation progress (0-1)
     */
    updateMeditationEffects(progress) {
        // Update particle intensity based on progress
        if (window.cosmicParticleSystem) {
            window.cosmicParticleSystem.setIntensity(progress);
        }
        
        // Update visual effects
        this.updateMeditationVisuals(progress);
    }
    
    /**
     * End meditation effects
     */
    endMeditationEffects() {
        // Stop particle effects
        if (window.cosmicParticleSystem) {
            window.cosmicParticleSystem.stop();
        }
        
        // Stop meditation sounds
        if (window.soundManager) {
            window.soundManager.stopMeditationAmbience();
        }
        
        // End visual effects
        this.endMeditationVisuals();
    }
    
    /**
     * Start enlightenment effects
     */
    startEnlightenmentEffects() {
        // Start enlightenment particles
        if (window.cosmicParticleSystem) {
            window.cosmicParticleSystem.startEnlightenment();
        }
        
        // Play enlightenment sound
        if (window.soundManager) {
            window.soundManager.playEnlightenmentSound();
        }
        
        // Start enlightenment visuals
        this.startEnlightenmentVisuals();
    }
    
    /**
     * Update enlightenment effects
     * @param {number} progress - Enlightenment progress (0-1)
     */
    updateEnlightenmentEffects(progress) {
        // Update enlightenment visuals
        this.updateEnlightenmentVisuals(progress);
    }
    
    /**
     * End enlightenment effects
     */
    endEnlightenmentEffects() {
        // Stop enlightenment particles
        if (window.cosmicParticleSystem) {
            window.cosmicParticleSystem.stopEnlightenment();
        }
        
        // End enlightenment visuals
        this.endEnlightenmentVisuals();
    }
    
    /**
     * Start meditation visuals
     */
    startMeditationVisuals() {
        // Add meditation overlay
        const overlay = document.createElement('div');
        overlay.id = 'meditation-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(138, 43, 226, 0.1) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1000;
            opacity: 0;
            transition: opacity 2s ease-in-out;
        `;
        document.body.appendChild(overlay);
        
        // Fade in
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 100);
    }
    
    /**
     * Update meditation visuals
     * @param {number} progress - Meditation progress (0-1)
     */
    updateMeditationVisuals(progress) {
        const overlay = document.getElementById('meditation-overlay');
        if (overlay) {
            const intensity = progress * 0.3; // Max 30% opacity
            overlay.style.background = `radial-gradient(circle, rgba(138, 43, 226, ${intensity}) 0%, transparent 70%)`;
        }
    }
    
    /**
     * End meditation visuals
     */
    endMeditationVisuals() {
        const overlay = document.getElementById('meditation-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 2000);
        }
    }
    
    /**
     * Start enlightenment visuals
     */
    startEnlightenmentVisuals() {
        // Add enlightenment flash
        const flash = document.createElement('div');
        flash.id = 'enlightenment-flash';
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle, rgba(255, 215, 0, 0.3) 0%, transparent 70%);
            pointer-events: none;
            z-index: 1001;
            opacity: 0;
            animation: enlightenmentFlash 2s ease-out;
        `;
        
        // Add CSS animation
        if (!document.getElementById('enlightenment-animation')) {
            const style = document.createElement('style');
            style.id = 'enlightenment-animation';
            style.textContent = `
                @keyframes enlightenmentFlash {
                    0% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1.1); }
                    100% { opacity: 0; transform: scale(1); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(flash);
        
        // Remove after animation
        setTimeout(() => {
            flash.remove();
        }, 2000);
    }
    
    /**
     * Update enlightenment visuals
     * @param {number} progress - Enlightenment progress (0-1)
     */
    updateEnlightenmentVisuals(progress) {
        // Enlightenment visuals are handled by CSS animation
    }
    
    /**
     * End enlightenment visuals
     */
    endEnlightenmentVisuals() {
        // Enlightenment visuals are automatically removed
    }
    
    /**
     * Main update loop
     */
    updateLoop() {
        const currentTime = Date.now();
        const deltaTime = currentTime - this.lastUpdateTime;
        this.lastUpdateTime = currentTime;
        
        // Update current state
        this.currentState.update(this, deltaTime);
        
        // Continue update loop
        requestAnimationFrame(() => this.updateLoop());
    }
    
    /**
     * Get current state information
     * @returns {Object} Current state information
     */
    getStateInfo() {
        return {
            currentState: this.currentState.name,
            previousState: this.previousState?.name || null,
            meditationProgress: this.meditationProgress,
            meditationType: this.meditationType,
            consciousnessLevel: this.consciousnessLevel,
            meditationSession: this.meditationSession
        };
    }
    
    /**
     * Stop meditation state machine
     */
    destroy() {
        // Stop all effects
        this.endMeditationEffects();
        this.endEnlightenmentEffects();
        
        // Return to awake state
        this.setState(this.states.awake);
        
        console.log('🌸 Meditation State Machine destroyed');
    }
}

// Initialize global meditation state machine
window.MeditationStateMachine = MeditationStateMachine;
window.AwakeState = AwakeState;
window.MeditatingState = MeditatingState;
window.EnlightenedState = EnlightenedState;

// Create global instance
window.meditationStateMachine = new MeditationStateMachine();

// Add global meditation functions
window.startMeditation = (type, duration) => {
    return window.meditationStateMachine.startMeditation(type, duration);
};

window.stopMeditation = () => {
    return window.meditationStateMachine.stopMeditation();
};

window.getMeditationState = () => {
    return window.meditationStateMachine.getStateInfo();
};

console.log('🌸 Meditation State Machine ready - Sacred meditation flow initialized');
