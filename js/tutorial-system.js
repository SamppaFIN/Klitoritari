/**
 * Tutorial System for Eldritch Sanctuary
 * Provides guided introduction to encounter types and gameplay mechanics
 */

class TutorialSystem {
    constructor() {
        this.isInitialized = false;
        this.tutorialShown = false;
        this.encounterTypes = [
            {
                name: 'Monster Encounters',
                emoji: '👹',
                description: 'Walk within 50m of monster markers to trigger combat encounters. Use dice combat to defeat them and gain experience.',
                color: '#8b0000'
            },
            {
                name: 'Item Collection',
                emoji: '💎',
                description: 'Walk within 50m of item markers to collect useful items. Each item provides different stat bonuses.',
                color: '#ff00ff'
            },
            {
                name: 'Quest Markers',
                emoji: '🎭',
                description: 'Walk within 30m of quest markers to interact with quest objectives and progress through storylines.',
                color: '#4b0082'
            },
            {
                name: 'Shrine Interactions',
                emoji: '⛩️',
                description: 'Walk within 50m of shrine markers to restore health, sanity, or gain other beneficial effects.',
                color: '#00ff00'
            },
            {
                name: 'NPC Encounters',
                emoji: '👑',
                description: 'Walk within 20m of NPC markers to chat with Aurora, Zephyr, or other characters for guidance.',
                color: '#ffff00'
            },
            {
                name: 'HEVY Encounters',
                emoji: '⚡',
                description: 'Walk within 50m of HEVY markers for legendary cosmic encounters with massive rewards.',
                color: '#ff4500'
            }
        ];
    }

    init() {
        console.log('📚 Tutorial System initialized');
        this.isInitialized = true;
    }

    showEncounterTutorial() {
        if (this.tutorialShown) {
            console.log('📚 Tutorial already shown, skipping');
            return;
        }

        console.log('📚 Showing encounter tutorial...');
        this.tutorialShown = true;

        // Create tutorial overlay
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.id = 'tutorial-overlay';
        tutorialOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        `;

        // Create tutorial modal
        const tutorialModal = document.createElement('div');
        tutorialModal.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
            border: 2px solid #4a9eff;
            border-radius: 20px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            position: relative;
        `;

        // Create tutorial content
        tutorialModal.innerHTML = `
            <div style="text-align: center; margin-bottom: 25px;">
                <h2 style="color: #4a9eff; margin: 0 0 10px 0; font-size: 28px; text-shadow: 0 0 10px #4a9eff;">
                    🌌 Welcome to Eldritch Sanctuary
                </h2>
                <p style="color: #b8d4f0; margin: 0; font-size: 16px;">
                    Discover the different types of encounters you can find on the cosmic map
                </p>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="color: #4a9eff; margin: 0 0 15px 0; font-size: 20px; text-align: center;">
                    🎯 Encounter Types
                </h3>
                <div style="display: grid; gap: 15px;">
                    ${this.encounterTypes.map(encounter => `
                        <div style="
                            background: rgba(74, 158, 255, 0.1);
                            border: 1px solid ${encounter.color}40;
                            border-radius: 12px;
                            padding: 15px;
                            display: flex;
                            align-items: center;
                            gap: 15px;
                            transition: all 0.3s ease;
                        " onmouseover="this.style.background='rgba(74, 158, 255, 0.2)'" onmouseout="this.style.background='rgba(74, 158, 255, 0.1)'">
                            <div style="
                                font-size: 32px;
                                text-shadow: 0 0 10px ${encounter.color};
                                min-width: 50px;
                                text-align: center;
                            ">${encounter.emoji}</div>
                            <div style="flex: 1;">
                                <h4 style="
                                    color: ${encounter.color};
                                    margin: 0 0 8px 0;
                                    font-size: 18px;
                                    text-shadow: 0 0 5px ${encounter.color};
                                ">${encounter.name}</h4>
                                <p style="
                                    color: #b8d4f0;
                                    margin: 0;
                                    font-size: 14px;
                                    line-height: 1.4;
                                ">${encounter.description}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div style="
                background: rgba(74, 158, 255, 0.1);
                border: 1px solid #4a9eff40;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 25px;
                text-align: center;
            ">
                <h4 style="color: #4a9eff; margin: 0 0 10px 0; font-size: 18px;">
                    💡 How to Interact
                </h4>
                <p style="color: #b8d4f0; margin: 0; font-size: 14px; line-height: 1.5;">
                    Simply walk within the specified distance of any marker to trigger an encounter. 
                    No random encounters occur - you have full control over your cosmic journey!
                </p>
            </div>
            
            <div style="text-align: center;">
                <button id="tutorial-close" style="
                    background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
                    border: none;
                    color: white;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(74, 158, 255, 0.4)'" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 15px rgba(74, 158, 255, 0.3)'">
                    Begin Your Cosmic Journey
                </button>
            </div>
        `;

        tutorialOverlay.appendChild(tutorialModal);
        document.body.appendChild(tutorialOverlay);

        // Add close button functionality
        document.getElementById('tutorial-close').addEventListener('click', () => {
            this.closeTutorial();
        });

        // Add click outside to close
        tutorialOverlay.addEventListener('click', (e) => {
            if (e.target === tutorialOverlay) {
                this.closeTutorial();
            }
        });

        // Add escape key to close
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeTutorial();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);

        // Show notification
        this.showNotification('📚 Welcome to Eldritch Sanctuary! Learn about encounter types.');
    }

    closeTutorial() {
        const tutorialOverlay = document.getElementById('tutorial-overlay');
        if (tutorialOverlay) {
            tutorialOverlay.style.opacity = '0';
            tutorialOverlay.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                tutorialOverlay.remove();
            }, 300);
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #4a9eff 0%, #357abd 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            z-index: 10001;
            box-shadow: 0 8px 25px rgba(74, 158, 255, 0.4);
            animation: tutorialNotification 3s ease-in-out forwards;
        `;
        notification.textContent = message;

        // Add CSS animation
        if (!document.getElementById('tutorial-styles')) {
            const style = document.createElement('style');
            style.id = 'tutorial-styles';
            style.textContent = `
                @keyframes tutorialNotification {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }

    resetTutorial() {
        this.tutorialShown = false;
        console.log('📚 Tutorial reset - will show on next marker initialization');
    }
}

// Initialize tutorial system
window.tutorialSystem = new TutorialSystem();
