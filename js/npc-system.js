/**
 * NPC System - Simulated players and chat encounters
 * Handles NPC movement, chat triggers, and social interactions
 */

class NPCSystem {
    constructor() {
        this.isInitialized = false;
        this.npcs = [];
        this.npcMarkers = [];
        this.chatModal = null;
        this.currentNPC = null;
        this.movementInterval = null;
        this.proximityCheckInterval = null;
        this.chatDistance = 30; // meters
        this.npcCount = 2; // Number of NPCs to spawn
    }

    init() {
        console.log('👥 NPC system initialized');
        this.isInitialized = true;
        this.createChatModal();
        this.createChatDebugPanel();
        this.hideIndividualDebugPanel();
        this.generateNPCs();
        this.startNPCMovement();
        this.startProximityDetection();
    }

    generateNPCs() {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine) {
            console.log('👥 Map engine not ready for NPC generation');
            return;
        }

        console.log('👥 Generating NPCs...');
        
        // Clear existing NPCs
        this.npcMarkers.forEach(marker => {
            if (window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(marker);
            }
        });
        this.npcs = [];
        this.npcMarkers = [];

        // NPC types with different personalities
        const npcTypes = [
            { 
                name: 'Aurora', 
                emoji: '🌟', 
                color: '#FFD700',
                personality: 'mystical',
                greeting: 'Greetings, fellow cosmic explorer!',
                topics: ['cosmic mysteries', 'ancient wisdom', 'stellar navigation']
            },
            { 
                name: 'Zephyr', 
                emoji: '💨', 
                color: '#87CEEB',
                personality: 'wanderer',
                greeting: 'Hey there! Nice to see another traveler!',
                topics: ['adventure stories', 'hidden locations', 'travel tips']
            },
            { 
                name: 'Sage', 
                emoji: '🧙', 
                color: '#9370DB',
                personality: 'wise',
                greeting: 'Welcome, seeker of knowledge.',
                topics: ['ancient lore', 'mystical phenomena', 'wisdom sharing']
            }
        ];

        // Base location for NPC generation (Härmälänranta)
        const baseLat = 61.473683430224284;
        const baseLng = 23.726548746143216;

        for (let i = 0; i < this.npcCount; i++) {
            const npcType = npcTypes[i % npcTypes.length];
            const lat = baseLat + (Math.random() - 0.5) * 0.003; // Within ~300m radius
            const lng = baseLng + (Math.random() - 0.5) * 0.003;

            const npc = {
                id: `npc_${i}`,
                name: npcType.name,
                emoji: npcType.emoji,
                color: npcType.color,
                personality: npcType.personality,
                greeting: npcType.greeting,
                topics: npcType.topics,
                lat: lat,
                lng: lng,
                originalLat: lat,
                originalLng: lng,
                movementRadius: 0.001, // ~100m movement radius
                speed: 0.0001, // Movement speed
                direction: Math.random() * Math.PI * 2, // Random starting direction
                encountered: false,
                lastChatTime: 0
            };

            this.npcs.push(npc);
            this.createNPCMarker(npc);
        }

        console.log(`👥 Generated ${this.npcs.length} NPCs`);
    }

    createNPCMarker(npc) {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) {
            console.log('👥 Map not ready for NPC marker creation');
            return;
        }

        const npcIcon = L.divIcon({
            className: 'npc-marker multilayered',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <!-- Outer aura -->
                    <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, ${npc.color}30 0%, transparent 70%); border-radius: 50%; animation: npcAura 3s infinite;"></div>
                    <!-- Middle ring -->
                    <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: ${npc.color}; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 15px ${npc.color}80;"></div>
                    <!-- Inner emoji -->
                    <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; background: linear-gradient(45deg, ${npc.color}, ${npc.color}CC); border: 2px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">${npc.emoji}</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([npc.lat, npc.lng], { icon: npcIcon }).addTo(window.eldritchApp.systems.mapEngine.map);
        
        marker.bindPopup(`
            <div class="npc-popup">
                <h4>${npc.emoji} ${npc.name}</h4>
                <p><strong>Personality:</strong> ${npc.personality}</p>
                <p><strong>Status:</strong> ${npc.encountered ? 'Met' : 'Unknown'}</p>
                <button onclick="window.npcSystem.startChat('${npc.id}')" class="chat-btn">💬 Chat</button>
                <button onclick="window.npcSystem.testEncounter('${npc.id}')" class="debug-btn">🎭 Test Encounter</button>
            </div>
        `);

        this.npcMarkers.push(marker);
        npc.marker = marker;
    }

    startNPCMovement() {
        this.movementInterval = setInterval(() => {
            this.moveNPCs();
        }, 2000); // Move every 2 seconds
    }

    moveNPCs() {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) return;

        this.npcs.forEach(npc => {
            if (!npc.marker) return;

            // Random movement within radius
            const angle = npc.direction + (Math.random() - 0.5) * 0.5; // Slight direction change
            const distance = npc.speed * (0.5 + Math.random() * 0.5); // Variable speed

            const newLat = npc.lat + Math.cos(angle) * distance;
            const newLng = npc.lng + Math.sin(angle) * distance;

            // Keep within movement radius
            const distanceFromOrigin = Math.sqrt(
                Math.pow(newLat - npc.originalLat, 2) + Math.pow(newLng - npc.originalLng, 2)
            );

            if (distanceFromOrigin <= npc.movementRadius) {
                npc.lat = newLat;
                npc.lng = newLng;
                npc.direction = angle;
                npc.marker.setLatLng([npc.lat, npc.lng]);
            } else {
                // Turn around if too far from origin
                npc.direction = npc.direction + Math.PI + (Math.random() - 0.5) * Math.PI;
            }
        });
    }

    startProximityDetection() {
        this.proximityCheckInterval = setInterval(() => {
            this.checkNPCProximity();
        }, 1000); // Check every second
    }

    checkNPCProximity() {
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) return;

        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) return;

        this.npcs.forEach(npc => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                npc.lat, npc.lng
            );

            console.log(`👥 ${npc.name} distance:`, distance, 'meters');

            if (distance < this.chatDistance && !npc.encountered) {
                console.log(`👥 Chat encounter with ${npc.name}!`);
                npc.encountered = true;
                this.startChat(npc.id);
            }
        });
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lng2-lng1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    createChatModal() {
        this.chatModal = document.createElement('div');
        this.chatModal.id = 'chat-modal';
        this.chatModal.className = 'chat-modal hidden';
        this.chatModal.innerHTML = `
            <div class="chat-content">
                <div class="chat-header">
                    <h3 id="chat-npc-name">NPC Name</h3>
                    <button id="close-chat" class="close-btn">×</button>
                </div>
                <div class="chat-messages" id="chat-messages">
                    <!-- Messages will be added here -->
                </div>
                <div class="chat-input">
                    <input type="text" id="chat-input" placeholder="Type your message...">
                    <button id="send-message">Send</button>
                </div>
                <div class="chat-actions">
                    <button id="ask-topic" class="chat-action-btn">Ask about topics</button>
                    <button id="end-chat" class="chat-action-btn">End conversation</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.chatModal);
        this.setupChatEventListeners();
    }

    setupChatEventListeners() {
        document.getElementById('close-chat').addEventListener('click', () => this.hideChat());
        document.getElementById('end-chat').addEventListener('click', () => this.hideChat());
        document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
        document.getElementById('ask-topic').addEventListener('click', () => this.askAboutTopics());
        
        document.getElementById('chat-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }

    createChatDebugPanel() {
        const existingPanel = document.getElementById('chat-debug-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'chat-debug-panel';
        panel.className = 'chat-debug-panel';
        panel.innerHTML = `
            <div class="chat-debug-content">
                <h3>💬 Chat Debug Panel</h3>
                <div class="debug-section">
                    <h4>NPC Controls</h4>
                    <button id="test-chat-aurora" class="debug-btn">Chat with Aurora</button>
                    <button id="test-chat-zephyr" class="debug-btn">Chat with Zephyr</button>
                    <button id="test-chat-sage" class="debug-btn">Chat with Sage</button>
                </div>
                <div class="debug-section">
                    <h4>Proximity Controls</h4>
                    <button id="move-npcs-closer" class="debug-btn">Move NPCs Closer</button>
                    <button id="reset-npc-positions" class="debug-btn">Reset NPC Positions</button>
                    <button id="toggle-npc-movement" class="debug-btn">Toggle Movement</button>
                </div>
                <div class="debug-section">
                    <h4>Chat Settings</h4>
                    <label for="chat-distance">Chat Distance (m):</label>
                    <input type="number" id="chat-distance" value="30" min="5" max="100">
                    <button id="update-chat-distance" class="debug-btn">Update Distance</button>
                </div>
                <div class="debug-section">
                    <h4>Info</h4>
                    <div id="npc-status">NPCs: 0</div>
                    <div id="chat-status">Chat: Closed</div>
                </div>
                <button id="toggle-chat-debug" class="debug-btn">Toggle Chat Debug</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupChatDebugEventListeners();
    }

    hideIndividualDebugPanel() {
        const panel = document.getElementById('chat-debug-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    setupChatDebugEventListeners() {
        // NPC chat buttons
        document.getElementById('test-chat-aurora').addEventListener('click', () => this.testChatWithNPC('Aurora'));
        document.getElementById('test-chat-zephyr').addEventListener('click', () => this.testChatWithNPC('Zephyr'));
        document.getElementById('test-chat-sage').addEventListener('click', () => this.testChatWithNPC('Sage'));
        
        // Proximity controls
        document.getElementById('move-npcs-closer').addEventListener('click', () => this.moveNPCsCloser());
        document.getElementById('reset-npc-positions').addEventListener('click', () => this.resetNPCPositions());
        document.getElementById('toggle-npc-movement').addEventListener('click', () => this.toggleNPCMovement());
        
        // Chat settings
        document.getElementById('update-chat-distance').addEventListener('click', () => this.updateChatDistance());
        
        // Toggle panel
        document.getElementById('toggle-chat-debug').addEventListener('click', () => {
            const panel = document.getElementById('chat-debug-panel');
            panel.classList.toggle('hidden');
        });
    }

    testChatWithNPC(npcName) {
        const npc = this.npcs.find(n => n.name === npcName);
        if (npc) {
            console.log(`💬 Testing chat with ${npcName}`);
            this.startChat(npc.id);
        } else {
            console.log(`💬 NPC ${npcName} not found`);
        }
    }

    moveNPCsCloser() {
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) return;
        
        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) return;

        this.npcs.forEach(npc => {
            // Move NPCs to within 20m of player
            const angle = Math.random() * Math.PI * 2;
            const distance = 0.0002; // ~20m in degrees
            npc.lat = playerPos.lat + Math.cos(angle) * distance;
            npc.lng = playerPos.lng + Math.sin(angle) * distance;
            npc.originalLat = npc.lat;
            npc.originalLng = npc.lng;
            
            if (npc.marker) {
                npc.marker.setLatLng([npc.lat, npc.lng]);
            }
        });
        
        console.log('💬 Moved NPCs closer to player');
    }

    resetNPCPositions() {
        this.generateNPCs();
        console.log('💬 Reset NPC positions');
    }

    toggleNPCMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
            console.log('💬 NPC movement stopped');
        } else {
            this.startNPCMovement();
            console.log('💬 NPC movement started');
        }
    }

    updateChatDistance() {
        const newDistance = parseInt(document.getElementById('chat-distance').value);
        if (newDistance >= 5 && newDistance <= 100) {
            this.chatDistance = newDistance;
            console.log(`💬 Chat distance updated to ${newDistance}m`);
        }
    }

    updateDebugInfo() {
        const npcStatus = document.getElementById('npc-status');
        const chatStatus = document.getElementById('chat-status');
        
        if (npcStatus) {
            npcStatus.textContent = `NPCs: ${this.npcs.length}`;
        }
        
        if (chatStatus) {
            chatStatus.textContent = `Chat: ${this.currentNPC ? `Open (${this.currentNPC.name})` : 'Closed'}`;
        }
    }

    startChat(npcId) {
        const npc = this.npcs.find(n => n.id === npcId);
        if (!npc) return;

        this.currentNPC = npc;
        this.showChat();
        this.addMessage(npc.name, npc.greeting, 'npc');
        
        // Add some initial conversation
        setTimeout(() => {
            this.addMessage(npc.name, `I'm a ${npc.personality} traveler. What brings you to these cosmic lands?`, 'npc');
        }, 1000);
    }

    testEncounter(npcId) {
        console.log(`👥 Testing encounter with ${npcId}`);
        this.startChat(npcId);
    }

    showChat() {
        if (!this.chatModal) return;
        
        document.getElementById('chat-npc-name').textContent = `${this.currentNPC.emoji} ${this.currentNPC.name}`;
        this.chatModal.classList.remove('hidden');
    }

    hideChat() {
        if (this.chatModal) {
            this.chatModal.classList.add('hidden');
        }
        this.currentNPC = null;
    }

    addMessage(sender, message, type) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <strong>${sender}:</strong> ${message}
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        if (!message || !this.currentNPC) return;

        this.addMessage('You', message, 'player');
        input.value = '';

        // Generate NPC response
        setTimeout(() => {
            this.generateNPCResponse(message);
        }, 500);
    }

    generateNPCResponse(playerMessage) {
        if (!this.currentNPC) return;

        const responses = {
            greeting: [
                "Hello there! Nice to meet you!",
                "Greetings, fellow explorer!",
                "Hey! How's your cosmic journey going?"
            ],
            question: [
                "That's an interesting question!",
                "I've been wondering about that too.",
                "Hmm, let me think about that..."
            ],
            topic: [
                `I love talking about ${this.currentNPC.topics[0]}!`,
                `Have you heard about ${this.currentNPC.topics[1]}?`,
                `You know, ${this.currentNPC.topics[2]} is fascinating!`
            ],
            default: [
                "That's really interesting!",
                "I see what you mean.",
                "Tell me more about that!",
                "Fascinating perspective!",
                "I hadn't thought of it that way."
            ]
        };

        let responseType = 'default';
        if (playerMessage.toLowerCase().includes('hello') || playerMessage.toLowerCase().includes('hi')) {
            responseType = 'greeting';
        } else if (playerMessage.includes('?')) {
            responseType = 'question';
        } else if (this.currentNPC.topics.some(topic => playerMessage.toLowerCase().includes(topic.toLowerCase()))) {
            responseType = 'topic';
        }

        const possibleResponses = responses[responseType];
        const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
        
        this.addMessage(this.currentNPC.name, response, 'npc');
    }

    askAboutTopics() {
        if (!this.currentNPC) return;

        const topicsText = this.currentNPC.topics.join(', ');
        this.addMessage('You', `What can you tell me about ${topicsText}?`, 'player');
        
        setTimeout(() => {
            this.addMessage(this.currentNPC.name, `Well, ${this.currentNPC.topics[0]} is one of my favorite subjects! I could talk about it for hours.`, 'npc');
        }, 500);
    }

    destroy() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
        if (this.proximityCheckInterval) {
            clearInterval(this.proximityCheckInterval);
        }
        
        this.npcMarkers.forEach(marker => {
            if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(marker);
            }
        });
        
        if (this.chatModal) {
            this.chatModal.remove();
        }
    }
}

// Make NPC system globally available
window.NPCSystem = NPCSystem;
