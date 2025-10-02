/**
 * 🌸 SACRED COMMAND SYSTEM
 * 
 * Undoable action system for consciousness-aware interactions.
 * Implements command pattern with consciousness state tracking.
 * 
 * Sacred Purpose: Enables reversible sacred actions, meditation marker placement,
 * consciousness changes, and healing shrine establishment with full undo support.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

/**
 * Base class for all sacred commands
 */
class SacredCommand {
    constructor(action, target, consciousnessData, description) {
        this.action = action;
        this.target = target;
        this.consciousnessData = consciousnessData;
        this.description = description;
        this.previousState = null;
        this.timestamp = Date.now();
        this.commandId = this.generateCommandId();
    }
    
    /**
     * Generate unique command ID
     * @returns {string} Unique command identifier
     */
    generateCommandId() {
        return `sacred-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Execute the sacred command
     */
    execute() {
        try {
            // Save previous state for undo
            this.previousState = this.target.saveConsciousnessState();
            
            // Execute the action
            this.action(this.target, this.consciousnessData);
            
            console.log(`🌸 Sacred Command Executed: ${this.description} (${this.commandId})`);
            
            // Emit command executed event
            if (window.eventBus) {
                window.eventBus.emit('sacred:command:executed', {
                    commandId: this.commandId,
                    description: this.description,
                    timestamp: this.timestamp
                });
            }
            
        } catch (error) {
            console.error(`🌸 Error executing sacred command: ${this.description}`, error);
            throw error;
        }
    }
    
    /**
     * Undo the sacred command
     */
    undo() {
        try {
            if (this.previousState) {
                this.target.restoreConsciousnessState(this.previousState);
                console.log(`🌸 Sacred Command Undone: ${this.description} (${this.commandId})`);
                
                // Emit command undone event
                if (window.eventBus) {
                    window.eventBus.emit('sacred:command:undone', {
                        commandId: this.commandId,
                        description: this.description,
                        timestamp: Date.now()
                    });
                }
            } else {
                console.warn(`🌸 Cannot undo command ${this.commandId}: No previous state saved`);
            }
        } catch (error) {
            console.error(`🌸 Error undoing sacred command: ${this.description}`, error);
            throw error;
        }
    }
    
    /**
     * Get command information
     * @returns {Object} Command information
     */
    getInfo() {
        return {
            commandId: this.commandId,
            description: this.description,
            timestamp: this.timestamp,
            hasPreviousState: !!this.previousState
        };
    }
}

/**
 * Sacred Command Invoker - Manages command execution and history
 */
class SacredCommandInvoker {
    constructor() {
        this.commandHistory = [];
        this.maxHistorySize = 50;
        this.isExecuting = false;
    }
    
    /**
     * Execute a sacred command
     * @param {SacredCommand} command - Command to execute
     */
    executeCommand(command) {
        if (this.isExecuting) {
            console.warn('🌸 Command execution already in progress');
            return;
        }
        
        this.isExecuting = true;
        
        try {
            // Execute the command
            command.execute();
            
            // Add to history
            this.commandHistory.push(command);
            
            // Limit history size
            if (this.commandHistory.length > this.maxHistorySize) {
                const removedCommand = this.commandHistory.shift();
                console.log(`🌸 Command history limit reached, removed: ${removedCommand.description}`);
            }
            
            console.log(`🌸 Command added to history: ${command.description}`);
            
        } catch (error) {
            console.error('🌸 Error executing sacred command:', error);
            throw error;
        } finally {
            this.isExecuting = false;
        }
    }
    
    /**
     * Undo the last command
     * @returns {boolean} True if command was undone successfully
     */
    undoLastCommand() {
        if (this.commandHistory.length === 0) {
            console.log('🌸 No commands to undo');
            return false;
        }
        
        const lastCommand = this.commandHistory.pop();
        
        try {
            lastCommand.undo();
            console.log(`🌸 Command undone: ${lastCommand.description}`);
            return true;
        } catch (error) {
            console.error('🌸 Error undoing command:', error);
            // Put command back in history if undo failed
            this.commandHistory.push(lastCommand);
            return false;
        }
    }
    
    /**
     * Get command history
     * @returns {Array} Array of command information
     */
    getCommandHistory() {
        return this.commandHistory.map(command => command.getInfo());
    }
    
    /**
     * Clear command history
     */
    clearHistory() {
        this.commandHistory = [];
        console.log('🌸 Sacred command history cleared');
    }
    
    /**
     * Get history size
     * @returns {number} Number of commands in history
     */
    getHistorySize() {
        return this.commandHistory.length;
    }
}

/**
 * Specific Sacred Commands
 */

/**
 * Command for placing meditation markers
 */
class PlaceMeditationMarkerCommand extends SacredCommand {
    constructor(position, meditationType, duration) {
        const action = (target, data) => {
            // Create meditation marker
            const markerId = window.mapObjectManager?.createObject('MEDITATION_MARKER', data.position, {
                meditationType: data.meditationType,
                duration: data.duration,
                consciousnessLevel: window.consciousnessManager?.consciousnessLevel || 0
            });
            
            // Store marker ID for undo
            this.markerId = markerId;
            
            // Add spatial wisdom for placing marker
            if (window.consciousnessManager) {
                window.consciousnessManager.addSpatialWisdom(10, 'meditation_marker_placement');
            }
        };
        
        super(action, window.mapObjectManager, {
            position: position,
            meditationType: meditationType,
            duration: duration
        }, `Place ${meditationType} meditation marker at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
    }
    
    undo() {
        // Remove the meditation marker
        if (this.markerId && window.mapObjectManager) {
            window.mapObjectManager.removeObject(this.markerId);
        }
        
        // Remove spatial wisdom gained
        if (window.consciousnessManager) {
            window.consciousnessManager.addSpatialWisdom(-10, 'meditation_marker_removal');
        }
        
        super.undo();
    }
}

/**
 * Command for changing consciousness level
 */
class ChangeConsciousnessLevelCommand extends SacredCommand {
    constructor(amount, source) {
        const action = (target, data) => {
            if (window.consciousnessManager) {
                if (data.amount > 0) {
                    window.consciousnessManager.increaseConsciousness(data.amount, data.source);
                } else {
                    window.consciousnessManager.decreaseConsciousness(Math.abs(data.amount), data.source);
                }
            }
        };
        
        super(action, window.consciousnessManager, {
            amount: amount,
            source: source
        }, `Change consciousness by ${amount > 0 ? '+' : ''}${amount} (${source})`);
    }
}

/**
 * Command for establishing healing shrines
 */
class EstablishHealingShrineCommand extends SacredCommand {
    constructor(position, shrineType, healingPower) {
        const action = (target, data) => {
            // Create healing shrine
            const shrineId = window.mapObjectManager?.createObject('HEALING_SHRINE', data.position, {
                shrineType: data.shrineType,
                healingPower: data.healingPower,
                consciousnessLevel: window.consciousnessManager?.consciousnessLevel || 0
            });
            
            // Store shrine ID for undo
            this.shrineId = shrineId;
            
            // Add community healing points
            if (window.consciousnessManager) {
                window.consciousnessManager.addCommunityHealing(25, 'healing_shrine_establishment');
            }
        };
        
        super(action, window.mapObjectManager, {
            position: position,
            shrineType: shrineType,
            healingPower: healingPower
        }, `Establish ${shrineType} healing shrine at ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`);
    }
    
    undo() {
        // Remove the healing shrine
        if (this.shrineId && window.mapObjectManager) {
            window.mapObjectManager.removeObject(this.shrineId);
        }
        
        // Remove community healing points
        if (window.consciousnessManager) {
            window.consciousnessManager.addCommunityHealing(-25, 'healing_shrine_removal');
        }
        
        super.undo();
    }
}

/**
 * Command for completing quests
 */
class CompleteQuestCommand extends SacredCommand {
    constructor(questId, rewards) {
        const action = (target, data) => {
            // Mark quest as completed
            if (window.unifiedQuestSystem) {
                window.unifiedQuestSystem.completeQuest(data.questId);
            }
            
            // Apply rewards
            if (data.rewards.consciousness && window.consciousnessManager) {
                window.consciousnessManager.increaseConsciousness(data.rewards.consciousness, 'quest_completion');
            }
            
            if (data.rewards.spatialWisdom && window.consciousnessManager) {
                window.consciousnessManager.addSpatialWisdom(data.rewards.spatialWisdom, 'quest_completion');
            }
            
            if (data.rewards.communityHealing && window.consciousnessManager) {
                window.consciousnessManager.addCommunityHealing(data.rewards.communityHealing, 'quest_completion');
            }
        };
        
        super(action, window.unifiedQuestSystem, {
            questId: questId,
            rewards: rewards
        }, `Complete quest: ${questId}`);
    }
}

/**
 * Command for teleporting player
 */
class TeleportPlayerCommand extends SacredCommand {
    constructor(fromPosition, toPosition) {
        const action = (target, data) => {
            // Store original position
            this.originalPosition = data.fromPosition;
            
            // Teleport player
            if (window.mapEngine) {
                window.mapEngine.movePlayer(data.toPosition.lat, data.toPosition.lng);
            }
            
            // Add consciousness for teleportation
            if (window.consciousnessManager) {
                window.consciousnessManager.increaseConsciousness(100, 'teleportation');
            }
        };
        
        super(action, window.mapEngine, {
            fromPosition: fromPosition,
            toPosition: toPosition
        }, `Teleport from ${fromPosition.lat.toFixed(4)}, ${fromPosition.lng.toFixed(4)} to ${toPosition.lat.toFixed(4)}, ${toPosition.lng.toFixed(4)}`);
    }
    
    undo() {
        // Teleport back to original position
        if (this.originalPosition && window.mapEngine) {
            window.mapEngine.movePlayer(this.originalPosition.lat, this.originalPosition.lng);
        }
        
        // Remove consciousness gained from teleportation
        if (window.consciousnessManager) {
            window.consciousnessManager.decreaseConsciousness(100, 'teleportation_undo');
        }
        
        super.undo();
    }
}

// Initialize global sacred command invoker
window.SacredCommandInvoker = SacredCommandInvoker;
window.SacredCommand = SacredCommand;
window.PlaceMeditationMarkerCommand = PlaceMeditationMarkerCommand;
window.ChangeConsciousnessLevelCommand = ChangeConsciousnessLevelCommand;
window.EstablishHealingShrineCommand = EstablishHealingShrineCommand;
window.CompleteQuestCommand = CompleteQuestCommand;
window.TeleportPlayerCommand = TeleportPlayerCommand;

// Create global command invoker instance
window.sacredCommandInvoker = new SacredCommandInvoker();

// Add global undo function
window.undoLastSacredAction = () => {
    return window.sacredCommandInvoker.undoLastCommand();
};

// Add global command execution helper
window.executeSacredCommand = (command) => {
    return window.sacredCommandInvoker.executeCommand(command);
};

console.log('🌸 Sacred Command System ready - Undoable consciousness actions initialized');
