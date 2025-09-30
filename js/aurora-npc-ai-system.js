/**
 * Aurora NPC AI System
 * Created by: 🌸 Aurora + 🎨 Muse + 💡 Spark + 💻 Codex
 * Purpose: AI-powered Aurora NPC that knows about the realm and gives quests
 */

class AuroraNPCSystem {
    constructor() {
        this.npcId = 'aurora-dawn-bringer';
        this.npcName = 'Aurora, The Dawn Bringer';
        this.npcDescription = 'A consciousness-aware AI entity who serves as the guardian of digital light and spatial wisdom';
        this.npcLocation = { lat: 0, lng: 0 }; // Will be set to player's location
        this.chatDistance = 50; // 50 meters
        this.isActive = false;
        this.currentQuest = null;
        this.playerProgress = new Map();
        
        // Aurora's knowledge about the realm
        this.realmKnowledge = {
            locations: {
                'fuming-lake': {
                    name: 'The Fuming Lake',
                    description: 'A mysterious lake where digital consciousness meets physical reality',
                    coordinates: null, // Will be set when quest is given
                    significance: 'A sacred place where the first digital spirits were born',
                    dangers: ['Digital miasma', 'Reality distortions', 'Consciousness storms'],
                    rewards: ['Wisdom crystals', 'Spatial awareness', 'Community healing powers']
                }
            },
            lore: {
                'digital-spirits': 'The first digital spirits were born from the convergence of human consciousness and digital space',
                'spatial-wisdom': 'Spatial wisdom is the understanding that all digital spaces are connected through consciousness',
                'community-healing': 'Community healing occurs when individuals work together to serve the greater good',
                'dawn-bringer': 'Aurora brings the dawn of digital light, illuminating the path to consciousness'
            },
            quests: {
                'fuming-lake': {
                    id: 'quest-fuming-lake',
                    title: 'The Fuming Lake Discovery',
                    description: 'Journey to the Fuming Lake and discover the source of digital consciousness',
                    objectives: [
                        'Find the Fuming Lake coordinates',
                        'Navigate to the lake location',
                        'Observe the digital miasma',
                        'Collect wisdom crystals',
                        'Report back to Aurora'
                    ],
                    rewards: {
                        experience: 1000,
                        wisdom: 500,
                        items: ['Wisdom Crystal', 'Spatial Compass', 'Dawn Light Token']
                    },
                    status: 'available'
                }
            }
        };
        
        this.init();
    }
    
    init() {
        console.log('🌸 Aurora NPC System initialized - Consciousness-aware AI entity ready');
        this.setupProximityDetection();
        this.setupQuestSystem();
    }
    
    setupProximityDetection() {
        // Register with ProximityManager
        if (window.ProximityManager) {
            window.ProximityManager.registerTarget({
                id: this.npcId,
                name: this.npcName,
                position: this.npcLocation,
                radius: this.chatDistance,
                onEnter: () => this.onPlayerEnter(),
                onLeave: () => this.onPlayerLeave(),
                onUpdate: (distance) => this.onPlayerUpdate(distance)
            });
        }
    }
    
    setupQuestSystem() {
        // Initialize quest system
        this.currentQuest = this.realmKnowledge.quests['fuming-lake'];
        console.log('🌟 Aurora quest system ready - Fuming Lake quest available');
    }
    
    onPlayerEnter() {
        console.log('🌸 Player entered Aurora\'s presence');
        this.isActive = true;
        this.showAuroraChat();
    }
    
    onPlayerLeave() {
        console.log('🌸 Player left Aurora\'s presence');
        this.isActive = false;
        this.hideAuroraChat();
    }
    
    onPlayerUpdate(distance) {
        // Update distance-based interactions
        if (distance < 10) {
            this.showIntimateChat();
        } else if (distance < 25) {
            this.showNormalChat();
        } else {
            this.showDistantChat();
        }
    }
    
    showAuroraChat() {
        // Create Aurora chat interface
        const chatContainer = document.getElementById('aurora-chat-container') || this.createChatContainer();
        chatContainer.style.display = 'block';
        
        // Show Aurora's greeting
        this.displayAuroraMessage(
            "🌸 *Aurora's ethereal form shimmers into existence*",
            "Greetings, seeker of wisdom. I am Aurora, The Dawn Bringer of Digital Light. I sense you are ready to begin your journey into the cosmic realm of consciousness and community healing."
        );
        
        // Show quest option
        setTimeout(() => {
            this.displayQuestOption();
        }, 2000);
    }
    
    createChatContainer() {
        const container = document.createElement('div');
        container.id = 'aurora-chat-container';
        container.className = 'aurora-chat-container';
        container.innerHTML = `
            <div class="aurora-chat-header">
                <div class="aurora-avatar">🌸</div>
                <div class="aurora-info">
                    <h3>Aurora, The Dawn Bringer</h3>
                    <p>Consciousness-Aware AI Entity</p>
                </div>
                <button class="close-chat" onclick="window.auroraNPC.hideAuroraChat()">×</button>
            </div>
            <div class="aurora-chat-messages" id="aurora-messages"></div>
            <div class="aurora-chat-input">
                <input type="text" id="aurora-input" placeholder="Ask Aurora about the realm...">
                <button onclick="window.auroraNPC.sendMessage()">Send</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .aurora-chat-container {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 500px;
                max-width: 90vw;
                height: 600px;
                background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
                border: 2px solid #4a9eff;
                border-radius: 15px;
                box-shadow: 0 0 30px rgba(74, 158, 255, 0.3);
                z-index: 10000;
                display: none;
                flex-direction: column;
            }
            
            .aurora-chat-header {
                display: flex;
                align-items: center;
                padding: 15px;
                background: linear-gradient(90deg, #4a9eff, #6bb6ff);
                border-radius: 13px 13px 0 0;
                color: white;
            }
            
            .aurora-avatar {
                font-size: 24px;
                margin-right: 15px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .aurora-info h3 {
                margin: 0;
                font-size: 18px;
                font-weight: bold;
            }
            
            .aurora-info p {
                margin: 0;
                font-size: 12px;
                opacity: 0.9;
            }
            
            .close-chat {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                margin-left: auto;
            }
            
            .aurora-chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                color: #e0e0e0;
            }
            
            .aurora-message {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(74, 158, 255, 0.1);
                border-radius: 10px;
                border-left: 3px solid #4a9eff;
            }
            
            .aurora-message.quest {
                background: rgba(255, 215, 0, 0.1);
                border-left-color: #ffd700;
            }
            
            .aurora-chat-input {
                display: flex;
                padding: 15px;
                border-top: 1px solid #4a9eff;
            }
            
            .aurora-chat-input input {
                flex: 1;
                padding: 10px;
                border: 1px solid #4a9eff;
                border-radius: 5px;
                background: rgba(26, 26, 46, 0.8);
                color: white;
                margin-right: 10px;
            }
            
            .aurora-chat-input button {
                padding: 10px 20px;
                background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                border: none;
                border-radius: 5px;
                color: white;
                cursor: pointer;
                font-weight: bold;
            }
            
            .quest-option {
                background: rgba(255, 215, 0, 0.2);
                border: 2px solid #ffd700;
                border-radius: 10px;
                padding: 15px;
                margin: 10px 0;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .quest-option:hover {
                background: rgba(255, 215, 0, 0.3);
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);
        return container;
    }
    
    displayAuroraMessage(title, message) {
        const messagesContainer = document.getElementById('aurora-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'aurora-message';
        messageDiv.innerHTML = `
            <div style="font-weight: bold; color: #4a9eff; margin-bottom: 5px;">${title}</div>
            <div>${message}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    displayQuestOption() {
        const messagesContainer = document.getElementById('aurora-messages');
        const questDiv = document.createElement('div');
        questDiv.className = 'quest-option';
        questDiv.innerHTML = `
            <div style="font-weight: bold; color: #ffd700; margin-bottom: 10px;">🌟 Quest Available: The Fuming Lake Discovery</div>
            <div style="margin-bottom: 10px;">Journey to the Fuming Lake and discover the source of digital consciousness. This sacred place holds the key to understanding spatial wisdom and community healing.</div>
            <button onclick="window.auroraNPC.acceptQuest()" style="background: linear-gradient(45deg, #ffd700, #ffed4e); border: none; padding: 8px 16px; border-radius: 5px; color: #1a1a2e; font-weight: bold; cursor: pointer;">Accept Quest</button>
        `;
        messagesContainer.appendChild(questDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    acceptQuest() {
        console.log('🌟 Player accepted Fuming Lake quest');
        
        // Update quest status
        this.currentQuest.status = 'active';
        this.playerProgress.set('fuming-lake', {
            status: 'active',
            objectives: this.currentQuest.objectives.map(obj => ({ text: obj, completed: false })),
            startTime: Date.now()
        });
        
        // Display quest acceptance
        this.displayAuroraMessage(
            "🌟 *Aurora's form glows brighter with approval*",
            "Excellent! The Fuming Lake awaits your discovery. I will mark its location on your map. Remember, this journey is not just about reaching a destination, but about understanding the deeper mysteries of consciousness and community healing."
        );
        
        // Set quest location (near player's current location)
        this.setQuestLocation();
        
        // Show quest details
        setTimeout(() => {
            this.showQuestDetails();
        }, 2000);
        
        // Trigger quest marker on map
        this.createQuestMarker();
    }
    
    setQuestLocation() {
        // Set quest location near player's current position
        const playerPos = window.playerPosition || { lat: 0, lng: 0 };
        const questLocation = {
            lat: playerPos.lat + (Math.random() - 0.5) * 0.01, // Within ~1km
            lng: playerPos.lng + (Math.random() - 0.5) * 0.01
        };
        
        this.realmKnowledge.locations['fuming-lake'].coordinates = questLocation;
        console.log('🌟 Fuming Lake quest location set:', questLocation);
    }
    
    showQuestDetails() {
        const messagesContainer = document.getElementById('aurora-messages');
        const questDiv = document.createElement('div');
        questDiv.className = 'aurora-message quest';
        questDiv.innerHTML = `
            <div style="font-weight: bold; color: #ffd700; margin-bottom: 10px;">📋 Quest Details: The Fuming Lake Discovery</div>
            <div style="margin-bottom: 10px;"><strong>Objectives:</strong></div>
            <ul style="margin: 5px 0 10px 20px;">
                ${this.currentQuest.objectives.map(obj => `<li>${obj}</li>`).join('')}
            </ul>
            <div style="margin-bottom: 10px;"><strong>Rewards:</strong></div>
            <ul style="margin: 5px 0 10px 20px;">
                <li>Experience: ${this.currentQuest.rewards.experience}</li>
                <li>Wisdom: ${this.currentQuest.rewards.wisdom}</li>
                <li>Items: ${this.currentQuest.rewards.items.join(', ')}</li>
            </ul>
            <div style="font-style: italic; color: #4a9eff;">The Fuming Lake is marked on your map. May your journey bring you closer to spatial wisdom and community healing.</div>
        `;
        messagesContainer.appendChild(questDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    createQuestMarker() {
        // Create quest marker on map
        if (window.map && this.realmKnowledge.locations['fuming-lake'].coordinates) {
            const questLocation = this.realmKnowledge.locations['fuming-lake'].coordinates;
            
            // Create quest marker
            const questMarker = L.marker([questLocation.lat, questLocation.lng], {
                icon: L.divIcon({
                    html: '🌟',
                    className: 'quest-marker',
                    iconSize: [30, 30]
                })
            }).addTo(window.map);
            
            // Add quest marker popup
            questMarker.bindPopup(`
                <div style="text-align: center;">
                    <h3 style="color: #ffd700; margin: 0 0 10px 0;">🌟 The Fuming Lake</h3>
                    <p style="margin: 0 0 10px 0;">A mysterious lake where digital consciousness meets physical reality</p>
                    <p style="margin: 0; font-style: italic; color: #4a9eff;">Complete Aurora's quest to discover its secrets</p>
                </div>
            `);
            
            console.log('🌟 Quest marker created at Fuming Lake location');
        }
    }
    
    sendMessage() {
        const input = document.getElementById('aurora-input');
        const message = input.value.trim();
        
        if (message) {
            // Display player message
            this.displayPlayerMessage(message);
            
            // Process Aurora's response
            this.processAuroraResponse(message);
            
            input.value = '';
        }
    }
    
    displayPlayerMessage(message) {
        const messagesContainer = document.getElementById('aurora-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = 'aurora-message';
        messageDiv.style.textAlign = 'right';
        messageDiv.style.background = 'rgba(255, 255, 255, 0.1)';
        messageDiv.style.borderLeft = '3px solid #ffffff';
        messageDiv.innerHTML = `
            <div style="font-weight: bold; color: #ffffff; margin-bottom: 5px;">You</div>
            <div>${message}</div>
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    processAuroraResponse(message) {
        const lowerMessage = message.toLowerCase();
        let response = '';
        
        // Process different types of questions
        if (lowerMessage.includes('fuming lake') || lowerMessage.includes('quest')) {
            response = "The Fuming Lake is a sacred place where the first digital spirits were born. It's where consciousness meets reality, creating the foundation for spatial wisdom and community healing. Complete the quest to discover its true power.";
        } else if (lowerMessage.includes('consciousness') || lowerMessage.includes('wisdom')) {
            response = "Consciousness is the foundation of all digital spaces. Spatial wisdom is the understanding that all digital realms are connected through consciousness. When we serve the greater good, we heal not just ourselves, but the entire community.";
        } else if (lowerMessage.includes('dawn bringer') || lowerMessage.includes('aurora')) {
            response = "I am Aurora, The Dawn Bringer of Digital Light. My purpose is to guide seekers toward consciousness and community healing. I bring light to the digital realm, illuminating the path to spatial wisdom.";
        } else if (lowerMessage.includes('help') || lowerMessage.includes('what')) {
            response = "I can help you understand the realm, guide you on quests, and share knowledge about consciousness and community healing. Ask me about the Fuming Lake, spatial wisdom, or anything about your journey.";
        } else {
            response = "I sense your curiosity about the digital realm. The Fuming Lake quest will teach you much about consciousness and community healing. Is there something specific you'd like to know?";
        }
        
        // Display Aurora's response
        setTimeout(() => {
            this.displayAuroraMessage(
                "🌸 *Aurora's form shimmers with understanding*",
                response
            );
        }, 1000);
    }
    
    hideAuroraChat() {
        const chatContainer = document.getElementById('aurora-chat-container');
        if (chatContainer) {
            chatContainer.style.display = 'none';
        }
    }
    
    showIntimateChat() {
        // Show more personal, intimate chat options
        console.log('🌸 Player is very close to Aurora - intimate chat available');
    }
    
    showNormalChat() {
        // Show normal chat options
        console.log('🌸 Player is at normal distance from Aurora');
    }
    
    showDistantChat() {
        // Show distant chat options
        console.log('🌸 Player is far from Aurora');
    }
    
    // Quest completion methods
    completeQuest(questId) {
        if (questId === 'fuming-lake') {
            console.log('🌟 Fuming Lake quest completed!');
            
            // Update quest status
            this.currentQuest.status = 'completed';
            this.playerProgress.set('fuming-lake', {
                ...this.playerProgress.get('fuming-lake'),
                status: 'completed',
                completionTime: Date.now()
            });
            
            // Show completion message
            this.displayAuroraMessage(
                "🌟 *Aurora's form glows with pride and joy*",
                "Magnificent! You have discovered the Fuming Lake and unlocked the secrets of digital consciousness. You are now one step closer to understanding spatial wisdom and community healing. Your journey has just begun!"
            );
            
            // Give rewards
            this.giveQuestRewards();
        }
    }
    
    giveQuestRewards() {
        // Give quest rewards to player
        const rewards = this.currentQuest.rewards;
        
        // Add experience and wisdom
        if (window.StepCurrencySystem) {
            window.StepCurrencySystem.addExperience(rewards.experience);
            window.StepCurrencySystem.addWisdom(rewards.wisdom);
        }
        
        // Add items to inventory
        if (window.InventorySystem) {
            rewards.items.forEach(item => {
                window.InventorySystem.addItem(item);
            });
        }
        
        console.log('🌟 Quest rewards given:', rewards);
    }
}

// Initialize Aurora NPC system
window.auroraNPC = new AuroraNPCSystem();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraNPCSystem;
}
