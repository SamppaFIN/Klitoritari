/**
 * Aurora Quest Integration System
 * Created by: 🌸 Aurora + 💻 Codex + 🧪 Testa
 * Purpose: Integrates Aurora's quests with the existing quest system
 */

class AuroraQuestIntegration {
    constructor() {
        this.questSystem = null;
        this.auroraNPC = null;
        this.questMarkers = new Map();
        this.questProgress = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🌟 Aurora Quest Integration initialized');
        this.setupQuestSystemIntegration();
        this.setupQuestCompletionHandlers();
    }
    
    setupQuestSystemIntegration() {
        // Wait for quest system to be available
        const checkQuestSystem = () => {
            if (window.QuestSystem || window.UnifiedQuestSystem) {
                this.questSystem = window.QuestSystem || window.UnifiedQuestSystem;
                console.log('🌟 Quest system integration established');
                this.registerAuroraQuests();
            } else {
                setTimeout(checkQuestSystem, 1000);
            }
        };
        checkQuestSystem();
    }
    
    setupQuestCompletionHandlers() {
        // Listen for quest completion events
        document.addEventListener('questCompleted', (event) => {
            this.handleQuestCompletion(event.detail);
        });
        
        // Listen for location events
        document.addEventListener('playerLocationUpdate', (event) => {
            this.checkQuestLocationProximity(event.detail);
        });
    }
    
    registerAuroraQuests() {
        if (!this.questSystem) return;
        
        // Register the Fuming Lake quest
        const fumingLakeQuest = {
            id: 'aurora-fuming-lake',
            title: 'The Fuming Lake Discovery',
            description: 'Journey to the Fuming Lake and discover the source of digital consciousness',
            giver: 'Aurora, The Dawn Bringer',
            objectives: [
                {
                    id: 'find-lake',
                    description: 'Find the Fuming Lake coordinates',
                    type: 'location',
                    target: null, // Will be set when quest is accepted
                    completed: false
                },
                {
                    id: 'navigate-lake',
                    description: 'Navigate to the lake location',
                    type: 'location',
                    target: null, // Will be set when quest is accepted
                    completed: false
                },
                {
                    id: 'observe-miasma',
                    description: 'Observe the digital miasma',
                    type: 'interaction',
                    target: 'fuming-lake',
                    completed: false
                },
                {
                    id: 'collect-crystals',
                    description: 'Collect wisdom crystals',
                    type: 'collection',
                    target: 'wisdom-crystals',
                    required: 3,
                    collected: 0,
                    completed: false
                },
                {
                    id: 'report-aurora',
                    description: 'Report back to Aurora',
                    type: 'interaction',
                    target: 'aurora-npc',
                    completed: false
                }
            ],
            rewards: {
                experience: 1000,
                wisdom: 500,
                items: [
                    { id: 'wisdom-crystal', name: 'Wisdom Crystal', quantity: 1 },
                    { id: 'spatial-compass', name: 'Spatial Compass', quantity: 1 },
                    { id: 'dawn-light-token', name: 'Dawn Light Token', quantity: 1 }
                ]
            },
            status: 'available',
            category: 'aurora-quests',
            difficulty: 'medium',
            level: 1
        };
        
        // Register quest with the quest system
        if (this.questSystem.addQuest) {
            this.questSystem.addQuest(fumingLakeQuest);
            console.log('🌟 Fuming Lake quest registered with quest system');
        }
    }
    
    handleQuestCompletion(questData) {
        if (questData.questId === 'aurora-fuming-lake') {
            console.log('🌟 Fuming Lake quest completed!');
            this.completeAuroraQuest(questData);
        }
    }
    
    completeAuroraQuest(questData) {
        // Notify Aurora NPC of quest completion
        if (window.auroraNPC) {
            window.auroraNPC.completeQuest('fuming-lake');
        }
        
        // Give quest rewards
        this.giveQuestRewards(questData);
        
        // Show completion notification
        this.showQuestCompletionNotification(questData);
        
        // Update quest progress
        this.questProgress.set('fuming-lake', {
            status: 'completed',
            completionTime: Date.now(),
            rewards: questData.rewards
        });
    }
    
    giveQuestRewards(questData) {
        const rewards = questData.rewards || {};
        
        // Add experience
        if (rewards.experience && window.StepCurrencySystem) {
            window.StepCurrencySystem.addExperience(rewards.experience);
            console.log(`🌟 Gave ${rewards.experience} experience`);
        }
        
        // Add wisdom
        if (rewards.wisdom && window.StepCurrencySystem) {
            window.StepCurrencySystem.addWisdom(rewards.wisdom);
            console.log(`🌟 Gave ${rewards.wisdom} wisdom`);
        }
        
        // Add items
        if (rewards.items && window.InventorySystem) {
            rewards.items.forEach(item => {
                window.InventorySystem.addItem(item.id, item.quantity || 1);
                console.log(`🌟 Gave ${item.quantity || 1} ${item.name}`);
            });
        }
        
        // Show reward notification
        if (window.NotificationCenter) {
            window.NotificationCenter.showBanner(
                'Quest Completed!',
                `You have completed "The Fuming Lake Discovery" and received rewards!`,
                'success'
            );
        }
    }
    
    showQuestCompletionNotification(questData) {
        // Create quest completion modal
        const modal = document.createElement('div');
        modal.className = 'quest-completion-modal';
        modal.innerHTML = `
            <div class="quest-completion-content">
                <div class="quest-completion-header">
                    <div class="quest-completion-icon">🌟</div>
                    <h2>Quest Completed!</h2>
                </div>
                <div class="quest-completion-body">
                    <h3>The Fuming Lake Discovery</h3>
                    <p>You have successfully discovered the Fuming Lake and unlocked the secrets of digital consciousness!</p>
                    <div class="quest-rewards">
                        <h4>Rewards Received:</h4>
                        <ul>
                            <li>Experience: ${questData.rewards?.experience || 0}</li>
                            <li>Wisdom: ${questData.rewards?.wisdom || 0}</li>
                            <li>Items: ${questData.rewards?.items?.map(item => item.name).join(', ') || 'None'}</li>
                        </ul>
                    </div>
                </div>
                <div class="quest-completion-footer">
                    <button onclick="this.parentElement.parentElement.parentElement.remove()">Continue</button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .quest-completion-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            }
            
            .quest-completion-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                border: 2px solid #4a9eff;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                color: white;
            }
            
            .quest-completion-header {
                margin-bottom: 20px;
            }
            
            .quest-completion-icon {
                font-size: 48px;
                margin-bottom: 10px;
                animation: pulse 2s infinite;
            }
            
            .quest-completion-body h3 {
                color: #4a9eff;
                margin-bottom: 15px;
            }
            
            .quest-rewards {
                background: rgba(74, 158, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
            }
            
            .quest-rewards h4 {
                color: #ffd700;
                margin-bottom: 10px;
            }
            
            .quest-rewards ul {
                list-style: none;
                padding: 0;
            }
            
            .quest-rewards li {
                margin: 5px 0;
                color: #e0e0e0;
            }
            
            .quest-completion-footer button {
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                border: none;
                padding: 12px 24px;
                border-radius: 5px;
                color: white;
                font-weight: bold;
                cursor: pointer;
                font-size: 16px;
            }
            
            .quest-completion-footer button:hover {
                background: linear-gradient(45deg, #6bb6ff, #4a9eff);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(modal);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (modal.parentElement) {
                modal.remove();
            }
        }, 10000);
    }
    
    checkQuestLocationProximity(locationData) {
        // Check if player is near quest locations
        const questLocation = this.questProgress.get('fuming-lake');
        if (questLocation && questLocation.status === 'active') {
            // Check proximity to Fuming Lake
            const distance = this.calculateDistance(
                locationData.lat, locationData.lng,
                questLocation.targetLat, questLocation.targetLng
            );
            
            if (distance < 50) { // Within 50 meters
                this.triggerQuestLocationEvent('fuming-lake', locationData);
            }
        }
    }
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;
        
        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        
        return R * c;
    }
    
    triggerQuestLocationEvent(questId, locationData) {
        // Trigger quest location event
        const event = new CustomEvent('questLocationReached', {
            detail: {
                questId: questId,
                location: locationData,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        
        console.log(`🌟 Player reached quest location: ${questId}`);
    }
    
    // Method to set quest location when quest is accepted
    setQuestLocation(questId, lat, lng) {
        if (questId === 'fuming-lake') {
            this.questProgress.set('fuming-lake', {
                status: 'active',
                targetLat: lat,
                targetLng: lng,
                startTime: Date.now()
            });
            console.log(`🌟 Fuming Lake quest location set: ${lat}, ${lng}`);
        }
    }
}

// Initialize Aurora Quest Integration
window.auroraQuestIntegration = new AuroraQuestIntegration();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraQuestIntegration;
}
