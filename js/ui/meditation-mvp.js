/**
 * 🌸 MEDITATION MVP ARCHITECTURE
 * 
 * Model-View-Presenter architecture for meditation UI and logic separation.
 * Implements MVP pattern with consciousness-aware meditation management.
 * 
 * Sacred Purpose: Clean separation of meditation logic, UI presentation,
 * and user interaction handling for optimal meditation flow.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Meditation Model - Data and business logic
 */
class MeditationModel {
    constructor() {
        this.duration = 0;
        this.level = 0;
        this.progress = 0;
        this.consciousnessGain = 0;
        this.meditationType = 'basic';
        this.isActive = false;
        this.startTime = null;
        this.targetDuration = 300000; // 5 minutes default
        this.sessionHistory = [];
        this.totalSessions = 0;
        this.totalConsciousnessGained = 0;
        
        // Meditation types and their properties
        this.meditationTypes = {
            basic: {
                name: 'Basic Meditation',
                consciousnessMultiplier: 1.0,
                durationMultiplier: 1.0,
                description: 'Simple mindfulness meditation'
            },
            deep: {
                name: 'Deep Meditation',
                consciousnessMultiplier: 1.5,
                durationMultiplier: 1.2,
                description: 'Extended consciousness exploration'
            },
            healing: {
                name: 'Healing Meditation',
                consciousnessMultiplier: 1.3,
                durationMultiplier: 0.8,
                description: 'Community healing focused meditation'
            },
            wisdom: {
                name: 'Wisdom Meditation',
                consciousnessMultiplier: 1.8,
                durationMultiplier: 1.5,
                description: 'Spatial wisdom enhancement meditation'
            }
        };
        
        console.log('🌸 Meditation Model initialized');
    }
    
    /**
     * Start meditation session
     * @param {string} type - Type of meditation
     * @param {number} duration - Duration in milliseconds
     */
    startMeditation(type = 'basic', duration = 300000) {
        this.meditationType = type;
        this.targetDuration = duration;
        this.isActive = true;
        this.startTime = Date.now();
        this.duration = 0;
        this.progress = 0;
        this.consciousnessGain = 0;
        
        console.log(`🌸 Meditation session started: ${type} for ${duration}ms`);
        
        // Emit model change event
        this.notifyModelChanged('meditation_started', {
            type: type,
            duration: duration,
            startTime: this.startTime
        });
    }
    
    /**
     * Update meditation progress
     * @param {number} deltaTime - Time since last update in milliseconds
     */
    updateProgress(deltaTime) {
        if (!this.isActive || !this.startTime) return;
        
        this.duration += deltaTime;
        this.progress = Math.min(this.duration / this.targetDuration, 1);
        
        // Calculate consciousness gain based on meditation type and progress
        const meditationTypeData = this.meditationTypes[this.meditationType];
        const baseGain = Math.floor(this.progress * 50); // Max 50 base consciousness
        this.consciousnessGain = Math.floor(baseGain * meditationTypeData.consciousnessMultiplier);
        
        // Calculate meditation level
        this.level = Math.floor(this.progress * 10); // 0-10 levels
        
        // Emit progress update
        this.notifyModelChanged('progress_updated', {
            progress: this.progress,
            duration: this.duration,
            consciousnessGain: this.consciousnessGain,
            level: this.level
        });
        
        // Check if meditation is complete
        if (this.progress >= 1) {
            this.completeMeditation();
        }
    }
    
    /**
     * Complete meditation session
     */
    completeMeditation() {
        if (!this.isActive) return;
        
        const sessionData = {
            type: this.meditationType,
            duration: this.duration,
            consciousnessGained: this.consciousnessGain,
            level: this.level,
            completedAt: Date.now(),
            startTime: this.startTime
        };
        
        // Add to session history
        this.sessionHistory.push(sessionData);
        this.totalSessions++;
        this.totalConsciousnessGained += this.consciousnessGain;
        
        this.isActive = false;
        
        console.log(`🌸 Meditation completed! Gained ${this.consciousnessGain} consciousness`);
        
        // Emit completion event
        this.notifyModelChanged('meditation_completed', sessionData);
        
        // Reset session data
        this.startTime = null;
        this.duration = 0;
        this.progress = 0;
        this.consciousnessGain = 0;
        this.level = 0;
    }
    
    /**
     * Stop meditation session
     */
    stopMeditation() {
        if (!this.isActive) return;
        
        const partialGain = Math.floor(this.consciousnessGain * 0.5); // 50% of potential gain
        
        this.isActive = false;
        
        console.log(`🌸 Meditation stopped early. Partial gain: ${partialGain} consciousness`);
        
        // Emit stop event
        this.notifyModelChanged('meditation_stopped', {
            partialGain: partialGain,
            duration: this.duration,
            progress: this.progress
        });
        
        // Reset session data
        this.startTime = null;
        this.duration = 0;
        this.progress = 0;
        this.consciousnessGain = 0;
        this.level = 0;
    }
    
    /**
     * Get meditation statistics
     * @returns {Object} Meditation statistics
     */
    getStatistics() {
        return {
            totalSessions: this.totalSessions,
            totalConsciousnessGained: this.totalConsciousnessGained,
            averageSessionDuration: this.getAverageSessionDuration(),
            favoriteMeditationType: this.getFavoriteMeditationType(),
            longestSession: this.getLongestSession(),
            recentSessions: this.getRecentSessions(5)
        };
    }
    
    /**
     * Get average session duration
     * @returns {number} Average duration in milliseconds
     */
    getAverageSessionDuration() {
        if (this.sessionHistory.length === 0) return 0;
        
        const totalDuration = this.sessionHistory.reduce((sum, session) => sum + session.duration, 0);
        return totalDuration / this.sessionHistory.length;
    }
    
    /**
     * Get favorite meditation type
     * @returns {string} Most used meditation type
     */
    getFavoriteMeditationType() {
        if (this.sessionHistory.length === 0) return 'basic';
        
        const typeCounts = {};
        this.sessionHistory.forEach(session => {
            typeCounts[session.type] = (typeCounts[session.type] || 0) + 1;
        });
        
        return Object.keys(typeCounts).reduce((a, b) => 
            typeCounts[a] > typeCounts[b] ? a : b
        );
    }
    
    /**
     * Get longest session
     * @returns {Object} Longest session data
     */
    getLongestSession() {
        if (this.sessionHistory.length === 0) return null;
        
        return this.sessionHistory.reduce((longest, session) => 
            session.duration > longest.duration ? session : longest
        );
    }
    
    /**
     * Get recent sessions
     * @param {number} count - Number of recent sessions to return
     * @returns {Array} Recent sessions
     */
    getRecentSessions(count = 5) {
        return this.sessionHistory
            .slice(-count)
            .reverse();
    }
    
    /**
     * Get meditation type data
     * @param {string} type - Meditation type
     * @returns {Object} Meditation type data
     */
    getMeditationTypeData(type) {
        return this.meditationTypes[type] || this.meditationTypes.basic;
    }
    
    /**
     * Get all meditation types
     * @returns {Object} All meditation types
     */
    getAllMeditationTypes() {
        return this.meditationTypes;
    }
    
    /**
     * Notify model changed
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    notifyModelChanged(event, data) {
        // This will be called by the presenter to notify the view
        if (this.onModelChanged) {
            this.onModelChanged(event, data);
        }
    }
    
    /**
     * Set model change callback
     * @param {Function} callback - Callback function
     */
    setModelChangeCallback(callback) {
        this.onModelChanged = callback;
    }
}

/**
 * Meditation View - UI presentation layer
 */
class MeditationView {
    constructor(uiElement) {
        this.uiElement = uiElement;
        this.progressBar = uiElement.querySelector('.meditation-progress');
        this.levelDisplay = uiElement.querySelector('.consciousness-level');
        this.typeDisplay = uiElement.querySelector('.meditation-type');
        this.durationDisplay = uiElement.querySelector('.meditation-duration');
        this.gainDisplay = uiElement.querySelector('.consciousness-gain');
        this.statusDisplay = uiElement.querySelector('.meditation-status');
        
        // Meditation controls
        this.startButton = uiElement.querySelector('.start-meditation');
        this.stopButton = uiElement.querySelector('.stop-meditation');
        this.typeSelect = uiElement.querySelector('.meditation-type-select');
        this.durationSelect = uiElement.querySelector('.meditation-duration-select');
        
        // Statistics elements
        this.statsContainer = uiElement.querySelector('.meditation-stats');
        this.totalSessionsDisplay = uiElement.querySelector('.total-sessions');
        this.totalGainDisplay = uiElement.querySelector('.total-consciousness-gained');
        this.averageDurationDisplay = uiElement.querySelector('.average-duration');
        this.favoriteTypeDisplay = uiElement.querySelector('.favorite-type');
        
        this.setupEventListeners();
        console.log('🌸 Meditation View initialized');
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.startButton) {
            this.startButton.addEventListener('click', () => {
                this.onStartMeditation?.();
            });
        }
        
        if (this.stopButton) {
            this.stopButton.addEventListener('click', () => {
                this.onStopMeditation?.();
            });
        }
        
        if (this.typeSelect) {
            this.typeSelect.addEventListener('change', (e) => {
                this.onMeditationTypeChanged?.(e.target.value);
            });
        }
        
        if (this.durationSelect) {
            this.durationSelect.addEventListener('change', (e) => {
                this.onDurationChanged?.(parseInt(e.target.value));
            });
        }
    }
    
    /**
     * Update meditation display
     * @param {Object} model - Meditation model
     */
    updateDisplay(model) {
        // Update progress bar
        if (this.progressBar) {
            this.progressBar.style.width = `${model.progress * 100}%`;
        }
        
        // Update consciousness level
        if (this.levelDisplay) {
            this.levelDisplay.textContent = `Level: ${model.level}`;
        }
        
        // Update meditation type
        if (this.typeDisplay) {
            this.typeDisplay.textContent = `Type: ${model.meditationType}`;
        }
        
        // Update duration
        if (this.durationDisplay) {
            const minutes = Math.floor(model.duration / 60000);
            const seconds = Math.floor((model.duration % 60000) / 1000);
            this.durationDisplay.textContent = `Duration: ${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
        
        // Update consciousness gain
        if (this.gainDisplay) {
            this.gainDisplay.textContent = `Consciousness: +${model.consciousnessGain}`;
        }
        
        // Update status
        if (this.statusDisplay) {
            this.statusDisplay.textContent = model.isActive ? 'Meditating...' : 'Ready';
        }
        
        // Update button states
        this.updateButtonStates(model.isActive);
    }
    
    /**
     * Update button states
     * @param {boolean} isActive - Whether meditation is active
     */
    updateButtonStates(isActive) {
        if (this.startButton) {
            this.startButton.disabled = isActive;
            this.startButton.textContent = isActive ? 'Meditating...' : 'Start Meditation';
        }
        
        if (this.stopButton) {
            this.stopButton.disabled = !isActive;
            this.stopButton.style.display = isActive ? 'block' : 'none';
        }
    }
    
    /**
     * Show meditation completion
     * @param {Object} sessionData - Session completion data
     */
    showMeditationComplete(sessionData) {
        // Create completion notification
        const notification = document.createElement('div');
        notification.className = 'meditation-completion-notification';
        notification.innerHTML = `
            <div class="completion-content">
                <h3>🌸 Meditation Complete!</h3>
                <p>Type: ${sessionData.type}</p>
                <p>Duration: ${Math.floor(sessionData.duration / 60000)}:${Math.floor((sessionData.duration % 60000) / 1000).toString().padStart(2, '0')}</p>
                <p>Consciousness Gained: +${sessionData.consciousnessGained}</p>
                <p>Level Reached: ${sessionData.level}</p>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #8a2be2, #4b0082);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(138, 43, 226, 0.3);
            z-index: 10000;
            animation: meditationComplete 3s ease-out forwards;
        `;
        
        // Add CSS animation
        if (!document.getElementById('meditation-completion-animation')) {
            const style = document.createElement('style');
            style.id = 'meditation-completion-animation';
            style.textContent = `
                @keyframes meditationComplete {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    /**
     * Update statistics display
     * @param {Object} statistics - Meditation statistics
     */
    updateStatistics(statistics) {
        if (this.totalSessionsDisplay) {
            this.totalSessionsDisplay.textContent = statistics.totalSessions;
        }
        
        if (this.totalGainDisplay) {
            this.totalGainDisplay.textContent = statistics.totalConsciousnessGained;
        }
        
        if (this.averageDurationDisplay) {
            const avgMinutes = Math.floor(statistics.averageSessionDuration / 60000);
            const avgSeconds = Math.floor((statistics.averageSessionDuration % 60000) / 1000);
            this.averageDurationDisplay.textContent = `${avgMinutes}:${avgSeconds.toString().padStart(2, '0')}`;
        }
        
        if (this.favoriteTypeDisplay) {
            this.favoriteTypeDisplay.textContent = statistics.favoriteMeditationType;
        }
    }
    
    /**
     * Populate meditation type options
     * @param {Object} meditationTypes - Available meditation types
     */
    populateMeditationTypes(meditationTypes) {
        if (!this.typeSelect) return;
        
        this.typeSelect.innerHTML = '';
        
        Object.keys(meditationTypes).forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = meditationTypes[type].name;
            this.typeSelect.appendChild(option);
        });
    }
    
    /**
     * Set event callbacks
     * @param {Object} callbacks - Event callback functions
     */
    setEventCallbacks(callbacks) {
        this.onStartMeditation = callbacks.onStartMeditation;
        this.onStopMeditation = callbacks.onStopMeditation;
        this.onMeditationTypeChanged = callbacks.onMeditationTypeChanged;
        this.onDurationChanged = callbacks.onDurationChanged;
    }
}

/**
 * Meditation Presenter - Business logic and coordination
 */
class MeditationPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.consciousnessManager = window.consciousnessManager;
        this.updateLoop = null;
        
        this.setupModelCallbacks();
        this.setupViewCallbacks();
        this.initializeView();
        
        console.log('🌸 Meditation Presenter initialized');
    }
    
    /**
     * Setup model callbacks
     */
    setupModelCallbacks() {
        this.model.setModelChangeCallback((event, data) => {
            this.handleModelChange(event, data);
        });
    }
    
    /**
     * Setup view callbacks
     */
    setupViewCallbacks() {
        this.view.setEventCallbacks({
            onStartMeditation: () => this.startMeditation(),
            onStopMeditation: () => this.stopMeditation(),
            onMeditationTypeChanged: (type) => this.changeMeditationType(type),
            onDurationChanged: (duration) => this.changeDuration(duration)
        });
    }
    
    /**
     * Initialize view
     */
    initializeView() {
        // Populate meditation types
        this.view.populateMeditationTypes(this.model.getAllMeditationTypes());
        
        // Update initial display
        this.view.updateDisplay(this.model);
        
        // Update statistics
        this.view.updateStatistics(this.model.getStatistics());
    }
    
    /**
     * Start meditation
     */
    startMeditation() {
        const selectedType = this.view.typeSelect?.value || 'basic';
        const selectedDuration = parseInt(this.view.durationSelect?.value) || 300000;
        
        this.model.startMeditation(selectedType, selectedDuration);
        
        // Start update loop
        this.startUpdateLoop();
        
        // Start global meditation state machine
        if (window.meditationStateMachine) {
            window.meditationStateMachine.startMeditation(selectedType, selectedDuration);
        }
    }
    
    /**
     * Stop meditation
     */
    stopMeditation() {
        this.model.stopMeditation();
        
        // Stop update loop
        this.stopUpdateLoop();
        
        // Stop global meditation state machine
        if (window.meditationStateMachine) {
            window.meditationStateMachine.stopMeditation();
        }
    }
    
    /**
     * Change meditation type
     * @param {string} type - New meditation type
     */
    changeMeditationType(type) {
        console.log(`🌸 Meditation type changed to: ${type}`);
    }
    
    /**
     * Change duration
     * @param {number} duration - New duration in milliseconds
     */
    changeDuration(duration) {
        console.log(`🌸 Meditation duration changed to: ${duration}ms`);
    }
    
    /**
     * Start update loop
     */
    startUpdateLoop() {
        if (this.updateLoop) return;
        
        const update = () => {
            if (this.model.isActive) {
                this.model.updateProgress(16); // ~60fps
                requestAnimationFrame(update);
            } else {
                this.updateLoop = null;
            }
        };
        
        this.updateLoop = requestAnimationFrame(update);
    }
    
    /**
     * Stop update loop
     */
    stopUpdateLoop() {
        if (this.updateLoop) {
            cancelAnimationFrame(this.updateLoop);
            this.updateLoop = null;
        }
    }
    
    /**
     * Handle model changes
     * @param {string} event - Event type
     * @param {Object} data - Event data
     */
    handleModelChange(event, data) {
        switch (event) {
            case 'meditation_started':
                console.log('🌸 Meditation started in presenter');
                break;
                
            case 'progress_updated':
                this.view.updateDisplay(this.model);
                break;
                
            case 'meditation_completed':
                this.handleMeditationCompleted(data);
                break;
                
            case 'meditation_stopped':
                this.handleMeditationStopped(data);
                break;
        }
    }
    
    /**
     * Handle meditation completion
     * @param {Object} sessionData - Session completion data
     */
    handleMeditationCompleted(sessionData) {
        // Add consciousness to global manager
        if (this.consciousnessManager) {
            this.consciousnessManager.increaseConsciousness(sessionData.consciousnessGained, 'meditation');
        }
        
        // Show completion notification
        this.view.showMeditationComplete(sessionData);
        
        // Update statistics
        this.view.updateStatistics(this.model.getStatistics());
        
        // Stop update loop
        this.stopUpdateLoop();
    }
    
    /**
     * Handle meditation stopped
     * @param {Object} data - Stop data
     */
    handleMeditationStopped(data) {
        // Add partial consciousness to global manager
        if (this.consciousnessManager && data.partialGain > 0) {
            this.consciousnessManager.increaseConsciousness(data.partialGain, 'meditation_partial');
        }
        
        // Update statistics
        this.view.updateStatistics(this.model.getStatistics());
        
        // Stop update loop
        this.stopUpdateLoop();
    }
    
    /**
     * Get meditation statistics
     * @returns {Object} Meditation statistics
     */
    getStatistics() {
        return this.model.getStatistics();
    }
    
    /**
     * Destroy presenter
     */
    destroy() {
        this.stopUpdateLoop();
        console.log('🌸 Meditation Presenter destroyed');
    }
}

// Initialize global meditation MVP system
window.MeditationModel = MeditationModel;
window.MeditationView = MeditationView;
window.MeditationPresenter = MeditationPresenter;

// Add global meditation MVP creation helper
window.createMeditationMVP = (uiElement) => {
    const model = new MeditationModel();
    const view = new MeditationView(uiElement);
    const presenter = new MeditationPresenter(model, view);
    
    return {
        model: model,
        view: view,
        presenter: presenter
    };
};

console.log('🌸 Meditation MVP Architecture ready - Clean meditation UI separation initialized');
