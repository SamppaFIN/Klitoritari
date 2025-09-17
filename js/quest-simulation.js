/**
 * Quest Simulation System
 * Simulates the player playing through the Härmälä Mystery Arc
 */

class QuestSimulation {
    constructor() {
        this.isRunning = false;
        this.simulationStep = 0;
        this.simulationInterval = null;
        this.questSteps = [
            {
                step: 1,
                title: "The Cosmic Awakening",
                description: "You feel a strange energy in the air as you approach Härmälä. The cosmic entities are unusually chatty today.",
                action: "explore",
                healthChange: 0,
                sanityChange: -5,
                stepsGained: 25,
                message: "The cosmic realm stirs with ancient power..."
            },
            {
                step: 2,
                title: "First Anomaly Detected",
                description: "You discover a strange cosmic anomaly near the Härmälä forest. Reality seems to bend around it.",
                action: "investigate",
                healthChange: -10,
                sanityChange: -15,
                stepsGained: 50,
                message: "The anomaly pulses with otherworldly energy. Your mind struggles to comprehend what you're seeing."
            },
            {
                step: 3,
                title: "The Void Walker Appears",
                description: "A mysterious figure materializes from the void. 'I've been looking for my keys for 12 eons!' it exclaims.",
                action: "encounter",
                healthChange: 0,
                sanityChange: -20,
                stepsGained: 30,
                message: "The Void Walker's presence is both fascinating and terrifying. Your sanity wavers."
            },
            {
                step: 4,
                title: "Cosmic Battle",
                description: "A Shadow Stalker emerges from the darkness. 'Finally, some excitement in this eternal void!' it mutters.",
                action: "battle",
                healthChange: -25,
                sanityChange: -10,
                stepsGained: 75,
                message: "The battle is intense! Your health and sanity are tested by the eldritch combat."
            },
            {
                step: 5,
                title: "The Convergence Revealed",
                description: "You uncover the truth behind the Härmälä Mystery. The convergence was actually a cosmic prank!",
                action: "discover",
                healthChange: 0,
                sanityChange: 20,
                stepsGained: 100,
                message: "The cosmic entities are pleased with your performance and offer you a job as their cosmic consultant!"
            }
        ];
    }

    startSimulation() {
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.simulationStep = 0;
        
        console.log('🎭 Starting Härmälä Mystery Arc simulation...');
        this.showSimulationMessage('🎭 Quest Simulation Started', 'The Härmälä Mystery Arc begins...');
        
        this.simulationInterval = setInterval(() => {
            this.runSimulationStep();
        }, 5000); // Run every 5 seconds
    }

    stopSimulation() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        clearInterval(this.simulationInterval);
        console.log('🎭 Quest simulation stopped');
        this.showSimulationMessage('🎭 Simulation Stopped', 'The cosmic realm returns to normal...');
    }

    runSimulationStep() {
        if (this.simulationStep >= this.questSteps.length) {
            this.completeSimulation();
            return;
        }

        const currentStep = this.questSteps[this.simulationStep];
        console.log(`🎭 Simulation Step ${currentStep.step}: ${currentStep.title}`);
        
        // Apply stat changes
        this.applyStatChanges(currentStep);
        
        // Show step message
        this.showSimulationMessage(currentStep.title, currentStep.description);
        
        // Show action message
        setTimeout(() => {
            this.showSimulationMessage('Action', currentStep.message);
        }, 2000);
        
        this.simulationStep++;
    }

    applyStatChanges(step) {
        if (window.encounterSystem) {
            // Apply health changes
            if (step.healthChange > 0) {
                window.encounterSystem.gainHealth(step.healthChange, step.message);
            } else if (step.healthChange < 0) {
                window.encounterSystem.loseHealth(Math.abs(step.healthChange), step.message);
            }
            
            // Apply sanity changes
            if (step.sanityChange > 0) {
                window.encounterSystem.gainSanity(step.sanityChange, step.message);
            } else if (step.sanityChange < 0) {
                window.encounterSystem.loseSanity(Math.abs(step.sanityChange), step.message);
            }
            
            // Apply steps
            if (step.stepsGained > 0) {
                window.encounterSystem.addSteps(step.stepsGained);
            }
        }
    }

    completeSimulation() {
        this.stopSimulation();
        console.log('🎭 Härmälä Mystery Arc simulation completed!');
        this.showSimulationMessage('🎉 Quest Complete!', 'You have successfully solved the Härmälä Mystery! The cosmic entities are impressed and have offered you a position as their cosmic consultant.');
    }

    showSimulationMessage(title, message) {
        const notification = document.createElement('div');
        notification.className = 'quest-simulation-notification';
        notification.innerHTML = `
            <div class="simulation-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 4000);
    }
}

// Make it globally available
window.QuestSimulation = QuestSimulation;
