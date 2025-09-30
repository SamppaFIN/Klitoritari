/**
 * @fileoverview [VERIFIED] NPC System - Simulated players and chat encounters
 * @status VERIFIED - NPC movement and chat system working correctly
 * @feature #feature-npc-system
 * @last_verified 2024-01-28
 * @dependencies Map Engine, Chat System, Proximity Detection
 * @warning Do not modify NPC movement or chat logic without testing proximity interactions
 * 
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
        this.chatDistance = 20; // meters
        this.npcCount = 2; // Number of NPCs to spawn
    }

    init() {
        console.log('ðŸ‘¥ NPC system initialized');
        this.isInitialized = true;
        this.createChatModal();
        this.createChatDebugPanel();
        this.hideIndividualDebugPanel();
        // Don't start NPC simulation until game is ready
        console.log('ðŸ‘¥ NPC simulation paused until game screen loads');
    }

    startSimulation() {
        console.log('ðŸ'¥ Starting NPC simulation...');
        this.generateNPCs();
        this.startNPCMovement();
        this.startProximityDetection();
        this.initializeAuroraNPC();
    }
    
    initializeAuroraNPC() {
        // Initialize Aurora NPC if the system is available
        if (window.auroraNPC) {
            console.log('🌸 Initializing Aurora NPC integration');
            // Aurora NPC will handle its own proximity detection
            // Just ensure it's properly integrated
        } else {
            console.log('🌸 Aurora NPC system not available, skipping integration');
        }
    }

    generateNPCs() {
        // Re-enabled NPC generation for full game experience
        console.log('ðŸ‘¥ Generating NPCs...');
        
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine) {
            console.log('ðŸ‘¥ Map engine not ready for NPC generation');
            return;
        }

        console.log('ðŸ‘¥ Clearing all NPCs...');
        console.log('ðŸ‘¥ NPC system state:', {
            isInitialized: this.isInitialized,
            npcCount: this.npcCount,
            mapEngine: !!window.eldritchApp.systems.mapEngine,
            map: !!window.eldritchApp.systems.mapEngine.map
        });
        
        // Clear existing NPCs
        this.npcMarkers.forEach(marker => {
            if (window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(marker);
            }
        });
        this.npcs = [];
        this.npcMarkers = [];
        
        // Generate new NPCs
        console.log('ðŸ‘¥ Generating new NPCs...');
        
        // Create Aurora and Zephyr specifically
        this.createAuroraNPC();
        this.createZephyrNPC();
        
        // Register proximity with universal manager
        try {
            if (window.proximityManager) {
                this.npcs.forEach(npc => {
                    const id = `npc:${npc.id}`;
                    const getPos = () => ({ lat: npc.lat, lng: npc.lng });
                    // Use chatDistance radius
                    if (!window.proximityManager.targets.has(id)) {
                        window.proximityManager.addTarget(id, getPos, this.chatDistance);
                        window.proximityManager.on(id, 'enter', () => {
                            if (!npc.encountered) {
                                npc.encountered = true;
                                this.startChat(npc.id);
                            }
                        });
                    }
                });
            } else {
                // Fallback to legacy polling
                this.startProximityDetection();
            }
        } catch (e) {
            console.warn('NPC proximity registration failed, using fallback:', e);
            this.startProximityDetection();
        }
        
        console.log('ðŸ‘¥ Generated', this.npcs.length, 'NPCs');
        
        // Return early to prevent old NPC generation code from running
        return;

        // Enhanced NPC types with lore integration
        const npcTypes = [
            { 
                name: 'Aurora', 
                emoji: 'Ÿ', 
                color: '#FFD700',
                personality: 'mystical',
                greeting: 'Greetings, fellow cosmic explorer!',
                topics: ['cosmic mysteries', 'ancient wisdom', 'stellar navigation'],
                role: 'lore_keeper',
                knowledge: ['harmala-history', 'cosmic-crystals', 'eldritch-entities'],
                quests: ['harmala-mystery-1'],
                dialogue: {
                    harmala: [
                        "The HÃ¤rmÃ¤lÃ¤ area... I've heard whispers about that place. Something dark stirs there.",
                        "The Great Collapse of 1987 was no natural disaster. The cosmic crystals... they were fragments of something much larger.",
                        "If you're investigating HÃ¤rmÃ¤lÃ¤, be careful. The entity beneath that sinkhole is awakening."
                    ],
                    cosmic_crystals: [
                        "Cosmic crystals are not mere minerals - they are fragments of ancient cosmic entities.",
                        "The crystals found in HÃ¤rmÃ¤lÃ¤ were particularly pure, which explains the unusual phenomena there.",
                        "I've studied these crystals for years. They possess properties that bend space and time itself."
                    ],
                    disappearances: [
                        "The recent disappearances follow a pattern. All during the full moon, all in the same age range.",
                        "The survivors of the Great Collapse spoke of 'blank-faced people' before the disappearances began.",
                        "Something is choosing its victims deliberately. It's not random - it's ritualistic."
                    ]
                }
            },
            { 
                name: 'Zephyr', 
                emoji: 'ðŸ’¨', 
                color: '#87CEEB',
                personality: 'wanderer',
                greeting: 'Hey there! Nice to see another traveler!',
                topics: ['adventure stories', 'hidden locations', 'travel tips'],
                role: 'information_broker',
                knowledge: ['recent-disappearances', 'cosmic-disturbances'],
                quests: ['cosmic-exploration-1'],
                dialogue: {
                    harmala: [
                        "I've been to HÃ¤rmÃ¤lÃ¤ a few times. Strange place - the air feels... wrong there.",
                        "The locals avoid the sinkhole area completely. Even the animals won't go near it.",
                        "I've heard stories about people seeing lights in the sky over HÃ¤rmÃ¤lÃ¤. Not normal lights, either."
                    ],
                    exploration: [
                        "The cosmic realm is vast and full of hidden wonders! I've discovered so many interesting places.",
                        "If you're looking for adventure, I can point you to some fascinating locations.",
                        "The key to exploration is keeping your eyes open and your mind curious."
                    ],
                    travel_tips: [
                        "Always carry cosmic crystals when exploring - they can protect you from reality distortions.",
                        "The cosmic realm has its own rules. Trust your instincts, but don't ignore the signs.",
                        "Some areas are more dangerous than others. HÃ¤rmÃ¤lÃ¤ is definitely one of the riskier ones."
                    ]
                }
            },
            { 
                name: 'Sage', 
                emoji: 'ðŸ§™', 
                color: '#9370DB',
                personality: 'wise',
                greeting: 'Welcome, seeker of knowledge.',
                topics: ['ancient lore', 'mystical phenomena', 'wisdom sharing'],
                role: 'quest_giver',
                knowledge: ['great-collapse', 'survivor-testimonies', 'the-entity-beneath'],
                quests: ['harmala-mystery-1', 'cosmic-exploration-1'],
                dialogue: {
                    harmala: [
                        "The HÃ¤rmÃ¤lÃ¤ mystery is deeper than most realize. The entity beneath that sinkhole has been dormant for millennia.",
                        "The Great Collapse was not the beginning - it was merely the entity's first attempt to surface.",
                        "If you seek to understand HÃ¤rmÃ¤lÃ¤, you must first understand the cosmic crystals and their true nature."
                    ],
                    entity_beneath: [
                        "The entity beneath HÃ¤rmÃ¤lÃ¤ is ancient beyond comprehension. It has been slumbering for thousands of years.",
                        "The cosmic crystals are fragments of this entity. The mining operations disturbed its rest.",
                        "The disappearances are not random - they are the entity's way of gathering consciousness to manifest fully."
                    ],
                    wisdom: [
                        "Knowledge is power, but wisdom is understanding how to use that power responsibly.",
                        "The cosmic realm teaches us that reality is more fluid than we once believed.",
                        "To truly understand the mysteries of the cosmos, one must be willing to question everything."
                    ]
                }
            },
            { 
                name: 'Maria', 
                emoji: 'ðŸ‘µ', 
                color: '#8B4513',
                personality: 'survivor',
                greeting: 'You... you\'re investigating HÃ¤rmÃ¤lÃ¤, aren\'t you?',
                topics: ['great-collapse', 'survivor-stories', 'warnings'],
                role: 'witness',
                knowledge: ['great-collapse', 'survivor-testimonies'],
                quests: ['harmala-mystery-1'],
                dialogue: {
                    great_collapse: [
                        "I was there that night... October 31st, 1987. The sinkhole appeared without warning.",
                        "I saw things that night that no human should ever see. Creatures that defied physics itself.",
                        "My husband... he walked toward the sinkhole. When I called out to him, he turned around and his face was... blank. No eyes, no mouth, just smooth skin."
                    ],
                    warnings: [
                        "Don't go to HÃ¤rmÃ¤lÃ¤. Whatever is down there, it's not human. It's not even alive in the way we understand.",
                        "The disappearances have started again. It's happening all over again, just like in 1987.",
                        "I've been warning people for years, but no one listens. They think I'm crazy, but I know what I saw."
                    ],
                    survivor_stories: [
                        "The government covered it up. They said it was a 'geological hazard zone' and evacuated everyone.",
                        "The rescue teams that went down the sinkhole... they never came back. Not a single one.",
                        "I've been having the same nightmare for 37 years. The humming sound, the lights, the blank faces..."
                    ]
                }
            }
        ];

        // Base location for NPC generation (HÃ¤rmÃ¤lÃ¤nranta)
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

        console.log(`ðŸ‘¥ Generated ${this.npcs.length} NPCs`);
    }

    createNPCMarker(npc) {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) {
            console.log('ðŸ‘¥ Map not ready for NPC marker creation');
            return;
        }
        
        console.log('ðŸ‘¥ Creating NPC marker for:', npc.name, 'at:', npc.lat, npc.lng);

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
                <h4>${npc.emoji} ${npc.name} <span class="npc-role ${npc.role || 'wanderer'}">${(npc.role || 'wanderer').replace('_', ' ')}</span></h4>
                <p><strong>Personality:</strong> ${npc.personality}</p>
                <p><strong>Status:</strong> ${npc.encountered ? 'Met' : 'Unknown'}</p>
                ${npc.knowledge ? `<div class="npc-knowledge">
                    <strong>Knowledge:</strong>
                    ${(npc.knowledge || []).map(k => `<span class="knowledge-tag">${(k || '').replace('-', ' ')}</span>`).join('')}
                </div>` : ''}
                <div class="popup-actions">
                    <button onclick="window.npcSystem.startChat('${npc.id}')" class="chat-btn">ðŸ’¬ Chat</button>
                    <button onclick="window.npcSystem.testEncounter('${npc.id}')" class="debug-btn">­ Test Encounter</button>
                </div>
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

            let angle, distance;
            
            // Special movement for Zephyr - fast directional movement
            if (npc.name === 'Zephyr') {
                // Zephyr moves fast in specific directions
                const directions = [0, Math.PI/2, Math.PI, 3*Math.PI/2]; // North, East, South, West
                const currentDirection = directions[Math.floor(Math.random() * directions.length)];
                angle = currentDirection;
                distance = npc.speed * 3; // 3x faster than normal
            } else {
                // Normal random movement for other NPCs
                angle = npc.direction + (Math.random() - 0.5) * 0.5; // Slight direction change
                distance = npc.speed * (0.5 + Math.random() * 0.5); // Variable speed
            }

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
                
                if (npc.name === 'Zephyr') {
                    console.log(`ðŸ’¨ Zephyr moved fast to: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
                }
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
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) {
            console.log('ðŸ‘¥ NPC proximity check: No geolocation system available');
            return;
        }

        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) {
            console.log('ðŸ‘¥ NPC proximity check: No player position available');
            return;
        }

        console.log('ðŸ‘¥ NPC proximity check: Player position:', playerPos);
        console.log('ðŸ‘¥ NPC proximity check: NPCs available:', this.npcs.length);

        this.npcs.forEach(npc => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                npc.lat, npc.lng
            );

            // Only log distance when close to encounter
            if (distance < this.chatDistance * 2) {
                console.log(`ðŸ‘¥ ${npc.name} distance:`, distance, 'meters (encounter distance:', this.chatDistance, ')');
            }

            if (distance < this.chatDistance && !npc.encountered) {
                console.log(`ðŸ‘¥ Chat encounter with ${npc.name}!`);
                npc.encountered = true;
                this.startChat(npc.id);
            }
        });
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const phi1 = lat1 * Math.PI/180;
        const phi2 = lat2 * Math.PI/180;
        const deltaPhi = (lat2-lat1) * Math.PI/180;
        const deltaLambda = (lng2-lng1) * Math.PI/180;

        const a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    createChatModal() {
        console.log('ðŸ’¬ Creating chat modal...');
        this.chatModal = document.createElement('div');
        this.chatModal.id = 'chat-modal';
        this.chatModal.className = 'chat-modal hidden';
        this.chatModal.innerHTML = `
            <div class="chat-content">
                <div class="chat-header">
                    <h3 id="chat-npc-name">NPC Name</h3>
                    <button id="close-chat" class="close-btn">Ã—</button>
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
                    <button id="ask-quest" class="chat-action-btn">Ask about quests</button>
                    <button id="ask-lore" class="chat-action-btn">Ask about lore</button>
                    <button id="end-chat" class="chat-action-btn">End conversation</button>
                </div>
                <div class="topic-buttons" id="topic-buttons" style="display: none;">
                    <!-- Topic buttons will be populated here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(this.chatModal);
        console.log('ðŸ’¬ Chat modal created and appended to body');
        this.setupChatEventListeners();
    }

    setupChatEventListeners() {
        console.log('ðŸ’¬ Setting up chat event listeners...');
        try {
            document.getElementById('close-chat').addEventListener('click', () => this.hideChat());
            document.getElementById('end-chat').addEventListener('click', () => this.hideChat());
            document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
            document.getElementById('ask-topic').addEventListener('click', () => this.askAboutTopics());
            document.getElementById('ask-quest').addEventListener('click', () => this.askAboutQuests());
            document.getElementById('ask-lore').addEventListener('click', () => this.askAboutLore());
            
            document.getElementById('chat-input').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
            console.log('ðŸ’¬ Chat event listeners set up successfully');
        } catch (error) {
            console.log('ðŸ’¬ Error setting up chat event listeners:', error);
        }
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
                <h3>ðŸ’¬ Chat Debug Panel</h3>
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
                    <input type="number" id="chat-distance" value="20" min="5" max="100">
                    <button id="update-chat-distance" class="debug-btn">Update Distance</button>
                </div>
                <div class="debug-section">
                    <h4>Debug</h4>
                    <button id="test-chat-modal" class="debug-btn">Test Chat Modal</button>
                    <button id="check-chat-modal" class="debug-btn">Check Chat Modal</button>
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
        
        // Debug buttons
        document.getElementById('test-chat-modal').addEventListener('click', () => this.testChatModal());
        document.getElementById('check-chat-modal').addEventListener('click', () => this.checkChatModal());
        
        // Toggle panel
        document.getElementById('toggle-chat-debug').addEventListener('click', () => {
            const panel = document.getElementById('chat-debug-panel');
            panel.classList.toggle('hidden');
        });
    }

    testChatWithNPC(npcName) {
        console.log(`ðŸ’¬ Testing chat with ${npcName}...`);
        
        // Ensure NPCs are generated if they don't exist
        if (!this.npcs || this.npcs.length === 0) {
            console.log('ðŸ’¬ No NPCs found, generating them...');
            this.generateNPCs();
        }
        
        const npc = this.npcs.find(n => n.name === npcName);
        if (npc) {
            console.log(`ðŸ’¬ Starting chat with ${npcName}`);
            this.startChat(npc.id);
        } else {
            console.log(`ðŸ’¬ NPC ${npcName} not found. Available NPCs:`, this.npcs.map(n => n.name));
            // Create a test NPC if none exists
            this.createTestNPC(npcName);
        }
    }

    createAuroraNPC() {
        console.log('ðŸ‘¥ Creating Aurora NPC...');
        
        // Get player position for NPC placement
        let baseLat = 61.473683430224284;
        let baseLng = 23.726548746143216;
        
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            baseLat = window.eldritchApp.systems.geolocation.currentPosition.lat;
            baseLng = window.eldritchApp.systems.geolocation.currentPosition.lng;
        }
        
        // Generate random position around player (within 200m radius)
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.001 + Math.random() * 0.002; // 100-300m in degrees
        const lat = baseLat + Math.cos(angle) * distance;
        const lng = baseLng + Math.sin(angle) * distance;
        
        const auroraNPC = {
            id: 'aurora',
            name: 'Aurora',
            emoji: 'Ÿ',
            color: '#FFD700',
            personality: 'mystical',
            greeting: 'Greetings, fellow cosmic explorer!',
            topics: ['cosmic mysteries', 'ancient wisdom', 'stellar navigation'],
            role: 'lore_keeper',
            lat: lat,
            lng: lng,
            originalLat: lat,
            originalLng: lng,
            movementRadius: 0.001, // ~100m movement radius
            speed: 0.00005, // Slow movement for Aurora
            direction: Math.random() * Math.PI * 2,
            encountered: false,
            lastChatTime: 0
        };
        
        this.npcs.push(auroraNPC);
        this.createNPCMarker(auroraNPC);
    }
    
    createZephyrNPC() {
        console.log('ðŸ‘¥ Creating Zephyr NPC...');
        
        // Get player position for NPC placement
        let baseLat = 61.473683430224284;
        let baseLng = 23.726548746143216;
        
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            baseLat = window.eldritchApp.systems.geolocation.currentPosition.lat;
            baseLng = window.eldritchApp.systems.geolocation.currentPosition.lng;
        }
        
        // Generate random position around player (within 200m radius)
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.001 + Math.random() * 0.002; // 100-300m in degrees
        const lat = baseLat + Math.cos(angle) * distance;
        const lng = baseLng + Math.sin(angle) * distance;
        
        const zephyrNPC = {
            id: 'zephyr',
            name: 'Zephyr',
            emoji: 'ðŸ’¨',
            color: '#87CEEB',
            personality: 'wanderer',
            greeting: 'Hey there! Nice to see another traveler!',
            topics: ['adventure stories', 'hidden locations', 'travel tips'],
            role: 'information_broker',
            lat: lat,
            lng: lng,
            originalLat: lat,
            originalLng: lng,
            movementRadius: 0.001, // ~100m movement radius
            speed: 0.0001, // Fast movement for Zephyr
            direction: Math.random() * Math.PI * 2,
            encountered: false,
            lastChatTime: 0
        };
        
        this.npcs.push(zephyrNPC);
        this.createNPCMarker(zephyrNPC);
    }

    createTestNPC(npcName) {
        console.log(`ðŸ’¬ Creating test NPC: ${npcName}`);
        
        // Get player position for NPC placement
        let baseLat = 61.473683430224284;
        let baseLng = 23.726548746143216;
        
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            baseLat = window.eldritchApp.systems.geolocation.currentPosition.lat;
            baseLng = window.eldritchApp.systems.geolocation.currentPosition.lng;
        }
        
        // Generate random position around player (within 200m radius)
        const angle = Math.random() * Math.PI * 2;
        const distance = 0.001 + Math.random() * 0.002; // 100-300m in degrees
        const lat = baseLat + Math.cos(angle) * distance;
        const lng = baseLng + Math.sin(angle) * distance;
        
        const testNPC = {
            id: `test_${npcName.toLowerCase()}`,
            name: npcName,
            emoji: 'Ÿ',
            color: '#FFD700',
            personality: 'mystical',
            greeting: `Greetings! I am ${npcName}, a test NPC created for your convenience.`,
            topics: ['cosmic mysteries', 'testing', 'development'],
            lat: lat,
            lng: lng,
            encountered: false,
            lastChatTime: 0
        };
        
        this.npcs.push(testNPC);
        // Don't auto-start chat for test NPCs
        console.log(`ðŸ’¬ Test NPC ${npcName} created but chat not auto-started`);
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
        
        console.log('ðŸ’¬ Moved NPCs closer to player');
    }

    resetNPCPositions() {
        this.generateNPCs();
        console.log('ðŸ’¬ Reset NPC positions');
    }

    toggleNPCMovement() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
            this.movementInterval = null;
            console.log('ðŸ’¬ NPC movement stopped');
        } else {
            this.startNPCMovement();
            console.log('ðŸ’¬ NPC movement started');
        }
    }

    updateChatDistance() {
        const newDistance = parseInt(document.getElementById('chat-distance').value);
        if (newDistance >= 5 && newDistance <= 100) {
            this.chatDistance = newDistance;
            console.log(`ðŸ’¬ Chat distance updated to ${newDistance}m`);
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

    testChatModal() {
        console.log('ðŸ’¬ Testing chat modal...');
        if (!this.chatModal) {
            console.log('ðŸ’¬ Chat modal not found, creating it...');
            this.createChatModal();
        }
        
        // Create a test NPC
        const testNPC = {
            id: 'test',
            name: 'Test NPC',
            emoji: 'ðŸ§ª',
            personality: 'test',
            greeting: 'Hello! This is a test chat.'
        };
        
        this.currentNPC = testNPC;
        this.showChat();
        this.addMessage(testNPC.name, testNPC.greeting, 'npc');
    }

    checkChatModal() {
        console.log('ðŸ’¬ Checking chat modal...');
        console.log('ðŸ’¬ Chat modal exists:', !!this.chatModal);
        console.log('ðŸ’¬ Chat modal element:', this.chatModal);
        console.log('ðŸ’¬ Chat modal classes:', this.chatModal ? this.chatModal.className : 'N/A');
        console.log('ðŸ’¬ Chat modal visible:', this.chatModal ? !this.chatModal.classList.contains('hidden') : 'N/A');
        console.log('ðŸ’¬ Current NPC:', this.currentNPC);
        
        if (this.chatModal) {
            const chatContent = this.chatModal.querySelector('.chat-content');
            console.log('ðŸ’¬ Chat content exists:', !!chatContent);
            console.log('ðŸ’¬ Chat messages container exists:', !!document.getElementById('chat-messages'));
        }
    }

    startChat(npcId) {
        console.log('ðŸ’¬ startChat called with npcId:', npcId);
        const npc = this.npcs.find(n => n.id === npcId);
        if (!npc) {
            console.log('ðŸ’¬ NPC not found for id:', npcId);
            return;
        }

        console.log('ðŸ’¬ Found NPC:', npc.name);
        this.currentNPC = npc;
        this.showChat();
        this.addMessage(npc.name, npc.greeting, 'npc');
        
        // Add some initial conversation
        setTimeout(() => {
            this.addMessage(npc.name, `I'm a ${npc.personality} traveler. What brings you to these cosmic lands?`, 'npc');
        }, 1000);
    }

    testEncounter(npcId) {
        console.log(`ðŸ‘¥ Testing encounter with ${npcId}`);
        this.startChat(npcId);
    }

    showChat() {
        console.log('ðŸ’¬ showChat called');
        if (!this.chatModal) {
            console.log('ðŸ’¬ Chat modal not found!');
            return;
        }
        
        console.log('ðŸ’¬ Chat modal found, showing chat for:', this.currentNPC.name);
        document.getElementById('chat-npc-name').textContent = `${this.currentNPC.emoji} ${this.currentNPC.name}`;
        this.chatModal.classList.remove('hidden');
        console.log('ðŸ’¬ Chat modal should now be visible');
    }

    hideChat() {
        if (this.chatModal) {
            this.chatModal.classList.add('hidden');
        }
        this.currentNPC = null;
    }

    addMessage(sender, message, type) {
        console.log('ðŸ’¬ addMessage called:', sender, message, type);
        const messagesContainer = document.getElementById('chat-messages');
        if (!messagesContainer) {
            console.log('ðŸ’¬ Chat messages container not found!');
            return;
        }
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.innerHTML = `
            <strong>${sender}:</strong> ${message}
        `;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        console.log('ðŸ’¬ Message added to chat');
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

        const message = playerMessage.toLowerCase();
        let response = null;
        let loreDiscovered = null;

        // Check for specific topic keywords
        const topicKeywords = {
            'harmala': ['harmala', 'hÃ¤rmÃ¤lÃ¤', 'sinkhole', 'collapse', 'disappearances'],
            'cosmic_crystals': ['crystal', 'cosmic crystal', 'mining', 'fragment'],
            'disappearances': ['disappear', 'missing', 'vanished', 'victim'],
            'great_collapse': ['1987', 'collapse', 'sinkhole', 'october'],
            'entity_beneath': ['entity', 'beneath', 'ancient', 'slumber'],
            'exploration': ['explore', 'adventure', 'discover', 'location'],
            'travel_tips': ['travel', 'tip', 'advice', 'safe'],
            'wisdom': ['wisdom', 'knowledge', 'understand', 'learn'],
            'warnings': ['warning', 'danger', 'careful', 'safe'],
            'survivor_stories': ['survivor', 'story', 'testimony', 'witness']
        };

        // Find matching topic
        for (const [topic, keywords] of Object.entries(topicKeywords)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                if (this.currentNPC.dialogue && this.currentNPC.dialogue[topic]) {
                    const responses = this.currentNPC.dialogue[topic];
                    response = responses[Math.floor(Math.random() * responses.length)];
                    
                    // Check if this reveals new lore
                    if (this.currentNPC.knowledge) {
                        const knowledgeTopics = {
                            'harmala': 'harmala-history',
                            'cosmic_crystals': 'cosmic-crystals',
                            'disappearances': 'recent-disappearances',
                            'great_collapse': 'great-collapse',
                            'entity_beneath': 'the-entity-beneath',
                            'survivor_stories': 'survivor-testimonies'
                        };
                        
                        if (knowledgeTopics[topic]) {
                            loreDiscovered = knowledgeTopics[topic];
                        }
                    }
                    break;
                }
            }
        }

        // Fallback responses based on NPC role
        if (!response) {
            const roleResponses = {
                'lore_keeper': [
                    "I have much knowledge to share about the cosmic realm.",
                    "The mysteries of the universe are vast and complex.",
                    "There are many secrets hidden in the cosmic realm."
                ],
                'information_broker': [
                    "I've heard many interesting stories in my travels.",
                    "The cosmic realm is full of fascinating places to explore.",
                    "I can tell you about some interesting locations I've discovered."
                ],
                'quest_giver': [
                    "There are many mysteries that need investigating.",
                    "The cosmic realm needs brave explorers like you.",
                    "I have some tasks that might interest you."
                ],
                'witness': [
                    "I've seen things that most people wouldn't believe.",
                    "The truth about what happened is more terrifying than you can imagine.",
                    "I've been trying to warn people, but they don't listen."
                ]
            };

            const responses = roleResponses[this.currentNPC.role] || [
                "That's really interesting!",
                "I see what you mean.",
                "Tell me more about that!",
                "Fascinating perspective!",
                "I hadn't thought of it that way."
            ];
            
            response = responses[Math.floor(Math.random() * responses.length)];
        }

        // Add response
        this.addMessage(this.currentNPC.name, response, 'npc');

        // Discover lore if applicable
        if (loreDiscovered && window.questLogUI) {
            window.questLogUI.addLoreEntry({
                id: loreDiscovered,
                title: this.getLoreTitle(loreDiscovered),
                content: this.getLoreContent(loreDiscovered),
                source: `Conversation with ${this.currentNPC.name}`,
                tags: ['npc', 'dialogue', 'harmala'],
                discovered: true
            });
            
            // Show lore discovery notification
            this.showLoreDiscoveryNotification(loreDiscovered);
        }

        // Check for quest triggers
        this.checkQuestTriggers(playerMessage);
    }

    getLoreTitle(loreId) {
        const titles = {
            'harmala-history': 'The History of HÃ¤rmÃ¤lÃ¤',
            'cosmic-crystals': 'Cosmic Crystals and Their Properties',
            'recent-disappearances': 'Recent Disappearances in the HÃ¤rmÃ¤lÃ¤ Area',
            'great-collapse': 'The Great Collapse of 1987',
            'the-entity-beneath': 'The Entity Beneath HÃ¤rmÃ¤lÃ¤',
            'survivor-testimonies': 'Survivor Testimonies from the Great Collapse'
        };
        return titles[loreId] || 'Unknown Lore';
    }

    getLoreContent(loreId) {
        const contents = {
            'harmala-history': 'HÃ¤rmÃ¤lÃ¤ was once a thriving mining town known for its cosmic crystals. The Great Collapse of 1987 changed everything.',
            'cosmic-crystals': 'Cosmic crystals are fragments of ancient cosmic entities that possess unique properties.',
            'recent-disappearances': 'Since 2020, there have been 12 new disappearances in the HÃ¤rmÃ¤lÃ¤ area, all during the full moon.',
            'great-collapse': 'On October 31st, 1987, a massive sinkhole appeared in HÃ¤rmÃ¤lÃ¤, swallowing 47 buildings and 23 people.',
            'the-entity-beneath': 'Something ancient and powerful slumbers beneath the HÃ¤rmÃ¤lÃ¤ sinkhole, awakened by mining operations.',
            'survivor-testimonies': 'Survivors of the Great Collapse reported seeing creatures that defied physics and blank-faced people.'
        };
        return contents[loreId] || 'This lore entry contains information about the cosmic realm.';
    }

    checkQuestTriggers(playerMessage) {
        if (!this.currentNPC || !window.questLogUI) return;

        const message = playerMessage.toLowerCase();
        
        // Check for quest-related keywords
        if (message.includes('quest') || message.includes('mission') || message.includes('investigate')) {
            if (this.currentNPC.quests && this.currentNPC.quests.length > 0) {
                this.addMessage(this.currentNPC.name, "I might have some tasks that could interest you. Let me think...", 'npc');
                setTimeout(() => {
                    this.addMessage(this.currentNPC.name, "Actually, there are some mysteries in the HÃ¤rmÃ¤lÃ¤ area that need investigating. Would you be interested in helping?", 'npc');
                }, 1500);
            }
        }
    }

    askAboutTopics() {
        if (!this.currentNPC) return;

        // Show topic buttons
        this.showTopicButtons();
        
        const topicsText = this.currentNPC.topics.join(', ');
        this.addMessage('You', `What can you tell me about ${topicsText}?`, 'player');
        
        setTimeout(() => {
            this.addMessage(this.currentNPC.name, `I'd be happy to discuss ${topicsText}! What specifically interests you?`, 'npc');
        }, 500);
    }

    askAboutQuests() {
        if (!this.currentNPC) return;

        if (this.currentNPC.quests && this.currentNPC.quests.length > 0) {
            this.addMessage('You', 'Do you have any quests or tasks for me?', 'player');
            setTimeout(() => {
                this.addMessage(this.currentNPC.name, "Yes! There are some mysteries in the HÃ¤rmÃ¤lÃ¤ area that need investigating. Would you be interested in helping?", 'npc');
            }, 500);
        } else {
            this.addMessage('You', 'Do you have any quests or tasks for me?', 'player');
            setTimeout(() => {
                this.addMessage(this.currentNPC.name, "I don't have any specific tasks right now, but I might have some information that could help you.", 'npc');
            }, 500);
        }
    }

    askAboutLore() {
        if (!this.currentNPC) return;

        if (this.currentNPC.knowledge && this.currentNPC.knowledge.length > 0) {
            this.addMessage('You', 'What knowledge do you have about the cosmic realm?', 'player');
            setTimeout(() => {
                this.addMessage(this.currentNPC.name, "I have knowledge about many cosmic mysteries. What would you like to know about?", 'npc');
                this.showLoreButtons();
            }, 500);
        } else {
            this.addMessage('You', 'What knowledge do you have about the cosmic realm?', 'player');
            setTimeout(() => {
                this.addMessage(this.currentNPC.name, "I'm afraid I don't have much specialized knowledge, but I can share what I've learned in my travels.", 'npc');
            }, 500);
        }
    }

    showTopicButtons() {
        const topicButtons = document.getElementById('topic-buttons');
        if (!topicButtons || !this.currentNPC) return;

        topicButtons.innerHTML = '';
        topicButtons.style.display = 'block';

        this.currentNPC.topics.forEach(topic => {
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.textContent = topic;
            button.addEventListener('click', () => {
                this.addMessage('You', `Tell me about ${topic}`, 'player');
                this.generateNPCResponse(`Tell me about ${topic}`);
                this.hideTopicButtons();
            });
            topicButtons.appendChild(button);
        });
    }

    showLoreButtons() {
        const topicButtons = document.getElementById('topic-buttons');
        if (!topicButtons || !this.currentNPC) return;

        topicButtons.innerHTML = '';
        topicButtons.style.display = 'block';

        const loreTopics = {
            'harmala-history': 'HÃ¤rmÃ¤lÃ¤ History',
            'cosmic-crystals': 'Cosmic Crystals',
            'recent-disappearances': 'Recent Disappearances',
            'great-collapse': 'Great Collapse',
            'the-entity-beneath': 'Entity Beneath',
            'survivor-testimonies': 'Survivor Stories'
        };

        this.currentNPC.knowledge.forEach(knowledgeId => {
            const button = document.createElement('button');
            button.className = 'topic-btn';
            button.textContent = loreTopics[knowledgeId] || knowledgeId;
            button.addEventListener('click', () => {
                this.addMessage('You', `Tell me about ${loreTopics[knowledgeId] || knowledgeId}`, 'player');
                this.generateNPCResponse(`Tell me about ${loreTopics[knowledgeId] || knowledgeId}`);
                this.hideTopicButtons();
            });
            topicButtons.appendChild(button);
        });
    }

    hideTopicButtons() {
        const topicButtons = document.getElementById('topic-buttons');
        if (topicButtons) {
            topicButtons.style.display = 'none';
        }
    }

    showLoreDiscoveryNotification(loreId) {
        const notification = document.createElement('div');
        notification.className = 'lore-discovery-notification';
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="font-size: 20px; margin-right: 10px;">ðŸ“œ</span>
                <div>
                    <div style="font-weight: bold;">New Lore Discovered!</div>
                    <div style="font-size: 12px;">${this.getLoreTitle(loreId)}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    clearAllMarkers() {
        console.log('ðŸ‘¥ Clearing all NPC markers...');
        
        // Clear existing NPCs
        this.npcMarkers.forEach(marker => {
            if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(marker);
            }
        });
        this.npcs = [];
        this.npcMarkers = [];
        
        console.log('ðŸ‘¥ All NPC markers cleared');
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

    // Quick helper: spawn Aurora near player and start chat
    startAuroraEncounterNearPlayer(offsetMeters = 10) {
        try {
            if (!window.eldritchApp || !window.eldritchApp.systems || !window.eldritchApp.systems.geolocation) {
                console.warn('🧑‍🚀 No geolocation available for Aurora encounter');
                return false;
            }
            const playerPos = window.eldritchApp.systems.geolocation.getCurrentPosition();
            if (!playerPos) {
                console.warn('🧑‍🚀 Player position not available');
                return false;
            }
            // small offset north-east ~offsetMeters
            const latOffset = (offsetMeters / 111320); // meters per degree lat
            const lngOffset = (offsetMeters / (40075000 * Math.cos(playerPos.lat * Math.PI/180) / 360));
            const aurora = this.createAuroraNPC({
                lat: playerPos.lat + latOffset,
                lng: playerPos.lng + lngOffset
            });
            if (aurora) {
                this.startChat(aurora.id);
                return true;
            }
        } catch (e) {
            console.error('Failed to start Aurora encounter near player:', e);
        }
        return false;
    }
}

// Expose global shortcut for testing
if (typeof window !== 'undefined') {
    window.encounterAurora = () => {
        if (!window.npcSystem) {
            console.warn('NPC system not ready');
            return false;
        }
        return window.npcSystem.startAuroraEncounterNearPlayer(10);
    };
}


