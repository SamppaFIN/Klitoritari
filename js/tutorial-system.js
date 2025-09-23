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
            background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3a 25%, #2a2a4a 50%, #1a1a3a 75%, #0a0a1a 100%);
            border: 3px solid transparent;
            background-clip: padding-box;
            border-image: linear-gradient(45deg, #4a9eff, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57) 1;
            border-radius: 25px;
            padding: 40px;
            max-width: 700px;
            width: 90%;
            max-height: 85vh;
            overflow-y: auto;
            box-shadow: 
                0 25px 50px rgba(0, 0, 0, 0.7),
                0 0 0 1px rgba(74, 158, 255, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.1);
            position: relative;
            animation: tutorialModalAppear 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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
                        <div class="encounter-card" style="
                            background: linear-gradient(135deg, rgba(74, 158, 255, 0.08) 0%, rgba(74, 158, 255, 0.15) 100%);
                            border: 2px solid ${encounter.color}60;
                            border-radius: 15px;
                            padding: 20px;
                            display: flex;
                            align-items: center;
                            gap: 20px;
                            margin-bottom: 15px;
                            position: relative;
                            overflow: hidden;
                        ">
                            <div style="
                                background: linear-gradient(135deg, ${encounter.color}20, ${encounter.color}40);
                                border-radius: 50%;
                                width: 60px;
                                height: 60px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 28px;
                                text-shadow: 0 0 15px ${encounter.color};
                                box-shadow: 0 0 20px ${encounter.color}40;
                                animation: cosmicGlow 4s ease-in-out infinite;
                            ">${encounter.emoji}</div>
                            <div style="flex: 1;">
                                <h4 style="
                                    color: ${encounter.color};
                                    margin: 0 0 10px 0;
                                    font-size: 20px;
                                    font-weight: bold;
                                    text-shadow: 0 0 8px ${encounter.color};
                                    letter-spacing: 0.5px;
                                ">${encounter.name}</h4>
                                <p style="
                                    color: #c8d8f0;
                                    margin: 0;
                                    font-size: 15px;
                                    line-height: 1.5;
                                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
                <button id="tutorial-close" class="cosmic-button" style="
                    background: linear-gradient(135deg, #4a9eff 0%, #357abd 50%, #4a9eff 100%);
                    border: 2px solid rgba(74, 158, 255, 0.6);
                    color: white;
                    padding: 15px 40px;
                    border-radius: 30px;
                    font-size: 18px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 8px 25px rgba(74, 158, 255, 0.4);
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                    letter-spacing: 1px;
                " onmouseover="this.style.transform='translateY(-3px) scale(1.05)'; this.style.boxShadow='0 12px 35px rgba(74, 158, 255, 0.6)'" onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.boxShadow='0 8px 25px rgba(74, 158, 255, 0.4)'">
                    🌌 Begin Your Cosmic Journey 🌌
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

        // Add CSS animations and styles
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
                
                @keyframes tutorialModalAppear {
                    0% { 
                        opacity: 0; 
                        transform: translateY(-50px) scale(0.9); 
                        filter: blur(10px);
                    }
                    100% { 
                        opacity: 1; 
                        transform: translateY(0) scale(1); 
                        filter: blur(0);
                    }
                }
                
                @keyframes encounterCardHover {
                    0% { transform: translateY(0) scale(1); }
                    100% { transform: translateY(-5px) scale(1.02); }
                }
                
                @keyframes cosmicGlow {
                    0%, 100% { box-shadow: 0 0 20px rgba(74, 158, 255, 0.3); }
                    50% { box-shadow: 0 0 30px rgba(74, 158, 255, 0.6), 0 0 40px rgba(74, 158, 255, 0.3); }
                }
                
                .encounter-card {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    cursor: pointer;
                }
                
                .encounter-card:hover {
                    animation: encounterCardHover 0.3s ease forwards;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                }
                
                .cosmic-button {
                    animation: cosmicGlow 3s ease-in-out infinite;
                    position: relative;
                    overflow: hidden;
                }
                
                .cosmic-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s;
                }
                
                .cosmic-button:hover::before {
                    left: 100%;
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
