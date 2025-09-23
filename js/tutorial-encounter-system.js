/**
 * Tutorial Encounter System
 * Implements the incremental tutorial flow as outlined in the Perplexity plan
 * Starts with empty map and gradually introduces game elements
 */

class TutorialEncounterSystem {
    constructor() {
        this.tutorialStage = 0;
        this.maxTutorialStages = 4;
        this.tutorialFlags = new Map();
        this.gameObjectsRegistry = new Map();
        this.spawnedObjects = new Map();
        this.isActive = false;
        
        // Tutorial state persistence
        this.loadTutorialState();
        
        // Initialize game objects registry
        this.initializeGameObjectsRegistry();
    }

    init() {
        console.log('🎓 Tutorial Encounter System initialized');
        this.setupEventListeners();
        
        // Make tutorial system globally accessible
        window.tutorialEncounterSystem = this;
    }

    loadTutorialState() {
        try {
            const saved = localStorage.getItem('eldritch_tutorial_state');
            if (saved) {
                const state = JSON.parse(saved);
                this.tutorialStage = state.stage || 0;
                this.tutorialFlags = new Map(state.flags || []);
                console.log('🎓 Loaded tutorial state:', { stage: this.tutorialStage, flags: Array.from(this.tutorialFlags.entries()) });
            }
        } catch (e) {
            console.warn('🎓 Failed to load tutorial state:', e);
        }
    }

    saveTutorialState() {
        try {
            const state = {
                stage: this.tutorialStage,
                flags: Array.from(this.tutorialFlags.entries())
            };
            localStorage.setItem('eldritch_tutorial_state', JSON.stringify(state));
        } catch (e) {
            console.warn('🎓 Failed to save tutorial state:', e);
        }
    }

    initializeGameObjectsRegistry() {
        // Define all game objects with their spawn rules
        this.gameObjectsRegistry.set('health_potion', {
            type: 'item',
            name: 'Health Potion',
            emoji: '🧪',
            description: 'A glowing red potion that restores health',
            spawnRules: {
                stage: 1,
                flag: 'tutorial_stage_1',
                distance: 50, // meters from player
                maxCount: 1
            },
            interaction: {
                type: 'pickup',
                effect: 'heal',
                value: 50,
                message: 'You feel your wounds healing!'
            }
        });

        this.gameObjectsRegistry.set('health_shrine', {
            type: 'shrine',
            name: 'Health Shrine',
            emoji: '❤️',
            description: 'A mystical shrine that grants health blessings',
            spawnRules: {
                stage: 2,
                flag: 'potion_collected',
                distance: 100,
                maxCount: 2
            },
            interaction: {
                type: 'activate',
                effect: 'buff',
                duration: 300000, // 5 minutes
                message: 'The shrine\'s energy flows through you!'
            }
        });

        this.gameObjectsRegistry.set('wisdom_shrine', {
            type: 'shrine',
            name: 'Wisdom Shrine',
            emoji: '📚',
            description: 'A shrine of ancient knowledge',
            spawnRules: {
                stage: 2,
                flag: 'potion_collected',
                distance: 120,
                maxCount: 1
            },
            interaction: {
                type: 'activate',
                effect: 'buff',
                duration: 300000,
                message: 'Ancient wisdom fills your mind!'
            }
        });

        this.gameObjectsRegistry.set('neutral_wolf', {
            type: 'monster',
            name: 'Neutral Wolf',
            emoji: '🐺',
            description: 'A cautious wolf that watches from a distance',
            spawnRules: {
                stage: 3,
                flag: 'shrines_activated',
                distance: 150,
                maxCount: 1
            },
            stats: {
                health: 30,
                attack: 8,
                defense: 5,
                level: 1
            },
            interaction: {
                type: 'combat',
                options: ['attack', 'talk'],
                lootTable: ['wolf_pelt', 'small_coin']
            }
        });

        this.gameObjectsRegistry.set('diplomacy_goblin', {
            type: 'monster',
            name: 'Curious Goblin',
            emoji: '👹',
            description: 'A small goblin that seems more curious than hostile',
            spawnRules: {
                stage: 3,
                flag: 'shrines_activated',
                distance: 180,
                maxCount: 1
            },
            stats: {
                health: 25,
                attack: 6,
                defense: 4,
                level: 1
            },
            interaction: {
                type: 'diplomacy',
                options: ['talk', 'attack'],
                skillCheck: 'diplomacy',
                difficulty: 12,
                successReward: 'reputation_boost',
                failureFallback: 'combat'
            }
        });

        this.gameObjectsRegistry.set('aurora_npc', {
            type: 'npc',
            name: 'Aurora',
            emoji: '🌟',
            description: 'A mysterious figure who seems to know much about this place',
            spawnRules: {
                stage: 4,
                flag: 'first_encounter_completed',
                distance: 200,
                maxCount: 1
            },
            interaction: {
                type: 'quest_giver',
                quest: 'corroding_lake_investigation',
                dialogue: this.getAuroraDialogue()
            }
        });
    }

    getAuroraDialogue() {
        return {
            greeting: "Greetings, traveler. I am Aurora, keeper of the cosmic balance. I sense you have begun your journey into this realm.",
            quest_intro: "There is a disturbance in the Corroding Lake to the north. The waters have turned dark and strange creatures have been sighted. Will you investigate?",
            quest_accepted: "Excellent. The lake lies 300 meters north of here. Be cautious - the corruption there is strong.",
            quest_completed: "You have done well, traveler. The cosmic balance is restored. Your journey has only just begun.",
            default: "The cosmic energies flow through all things. Trust your instincts and the path will reveal itself."
        };
    }

    setupEventListeners() {
        // Listen for player position updates to trigger proximity checks
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            window.eldritchApp.systems.geolocation.onPositionUpdate = (position) => {
                this.checkProximityTriggers(position);
            };
        }

        // Listen for encounter completions
        document.addEventListener('encounterCompleted', (event) => {
            this.handleEncounterCompletion(event.detail);
        });
    }

    startTutorial() {
        console.log('🎓 Starting tutorial encounter system');
        this.isActive = true;
        this.tutorialStage = 1;
        this.clearAllMarkers();
        
        // Show welcome message and set up initial state
        this.showWelcomeMessage();
        
        // Set player health to 50/100 (wounded state)
        this.setPlayerHealth(50);
        
        // Spawn health potion and show tutorial message
        this.spawnNextStage();
        this.showTutorialMessage('You feel dizzy and wounded... Look around - you\'ll find a health potion nearby to restore your strength.');
    }

    showWelcomeMessage() {
        console.log('🎓 Showing welcome message');
        
        // Create a modal for the welcome message
        const modal = document.createElement('div');
        modal.id = 'tutorial-welcome-modal';
        modal.style.cssText = `
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
            font-family: 'Courier New', monospace;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4a9eff;
                border-radius: 15px;
                padding: 30px;
                max-width: 500px;
                text-align: center;
                box-shadow: 0 0 30px rgba(74, 158, 255, 0.5);
                color: #ffffff;
            ">
                <h2 style="color: #4a9eff; margin-bottom: 20px; font-size: 24px;">
                    🌌 Welcome to the Cosmic Realm
                </h2>
                <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    You wake up in an unfamiliar place, feeling dizzy and disoriented. 
                    The air shimmers with cosmic energy, and you sense that something 
                    has wounded you deeply...
                </p>
                <p style="font-size: 14px; color: #ff6b6b; margin-bottom: 25px;">
                    ⚠️ Your health is critically low! You need to find healing quickly.
                </p>
                <button id="tutorial-welcome-continue" style="
                    background: linear-gradient(45deg, #4a9eff, #6bb6ff);
                    border: none;
                    color: white;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Begin Your Journey
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener for continue button
        document.getElementById('tutorial-welcome-continue').addEventListener('click', () => {
            modal.remove();
            this.tutorialFlags.set('welcome_completed', true);
            this.saveTutorialState();
        });
    }

    setPlayerHealth(health) {
        console.log(`🎓 Setting player health to ${health}/100`);
        
        // Set health in encounter system if available
        if (window.encounterSystem) {
            window.encounterSystem.playerHealth = health;
            window.encounterSystem.maxHealth = 100;
            
            // Update health display if available
            if (window.encounterSystem.updateHealthDisplay) {
                window.encounterSystem.updateHealthDisplay();
            }
        }
        
        // Set health in tutorial flags
        this.tutorialFlags.set('player_health', health);
        this.tutorialFlags.set('max_health', 100);
        this.tutorialFlags.set('is_wounded', true);
        
        this.saveTutorialState();
    }

    clearAllMarkers() {
        console.log('🎓 Clearing all existing markers for tutorial');
        
        // Clear special markers
        if (window.mapEngine) {
            // Remove all existing markers except player marker
            window.mapEngine.clearAllSpecialMarkers();
        }

        // Clear quest markers (only if API exists)
        if (window.unifiedQuestSystem && typeof window.unifiedQuestSystem.clearAllQuestMarkers === 'function') {
            window.unifiedQuestSystem.clearAllQuestMarkers();
        } else {
            console.log('🎓 Skipping quest marker clear (API unavailable)');
        }

        // Clear NPC markers (only if API exists)
        if (window.npcSystem && typeof window.npcSystem.clearAllNPCs === 'function') {
            window.npcSystem.clearAllNPCs();
        } else {
            console.log('🎓 Skipping NPC clear (API unavailable)');
        }

        // Clear any spawned tutorial objects
        this.spawnedObjects.clear();
    }

    spawnNextStage() {
        if (!this.isActive) return;

        console.log(`🎓 Spawning tutorial stage ${this.tutorialStage}`);

        switch (this.tutorialStage) {
            case 1:
                this.spawnHealthPotion();
                break;
            case 2:
                this.spawnShrines();
                break;
            case 3:
                this.spawnMonsters();
                break;
            case 4:
                this.spawnAurora();
                break;
            default:
                console.log('🎓 Tutorial completed!');
                this.completeTutorial();
        }
    }

    spawnHealthPotion() {
        const potionDef = this.gameObjectsRegistry.get('health_potion');
        if (!potionDef) return;

        const position = this.getPlayerPosition();
        if (!position) return;

        // Spawn exactly 50m away from player
        const spawnPos = this.calculateSpawnPosition(position, 50);
        
        const marker = this.createItemMarker(spawnPos, potionDef);
        this.spawnedObjects.set('health_potion', marker);
        
        console.log('🧪 Health potion spawned at:', spawnPos, 'Distance: 50m from player');
        
        // Add pickup interaction
        this.setupPotionPickup(marker, potionDef);
    }

    setupPotionPickup(marker, potionDef) {
        if (!marker || !window.mapEngine || !window.mapEngine.map) return;

        // Add click event listener for pickup
        marker.on('click', () => {
            const playerPos = this.getPlayerPosition();
            const potionPos = marker.getLatLng();
            
            if (!playerPos || !potionPos) return;
            
            const distance = this.calculateDistance(playerPos, potionPos);
            console.log(`🧪 Health potion clicked! Distance: ${distance.toFixed(1)}m`);
            
            if (distance <= 20) { // Pickup range: 20m
                this.pickupHealthPotion(marker, potionDef);
            } else {
                this.showTutorialMessage(`You're too far away! Get within 20m to pick up the health potion. (Current distance: ${distance.toFixed(1)}m)`);
            }
        });

        // Add popup with pickup instructions
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Courier New', monospace;">
                <h3 style="color: #ff6b6b; margin: 0 0 10px 0;">🧪 Health Potion</h3>
                <p style="margin: 0 0 10px 0; color: #4a9eff;">${potionDef.description}</p>
                <p style="margin: 0; font-size: 12px; color: #888;">
                    Click to pick up (within 20m)<br>
                    Restores 50 HP
                </p>
            </div>
        `);
    }

    pickupHealthPotion(marker, potionDef) {
        console.log('🧪 Picking up health potion!');
        
        // Remove marker from map
        if (window.mapEngine && window.mapEngine.map) {
            window.mapEngine.map.removeLayer(marker);
        }
        
        // Add to inventory (if inventory system exists)
        if (window.itemSystem && window.itemSystem.addItem) {
            window.itemSystem.addItem({
                name: potionDef.name,
                emoji: potionDef.emoji,
                description: potionDef.description,
                type: 'consumable',
                effect: 'heal',
                value: potionDef.interaction.value
            });
        }
        
        // Set tutorial flag
        this.tutorialFlags.set('potion_collected', true);
        this.tutorialFlags.set('potion_in_inventory', true);
        this.saveTutorialState();
        
        // Show pickup message
        this.showTutorialMessage('🧪 Health potion added to your inventory! Open your inventory panel to use it and restore your health.');
        
        // Remove from spawned objects
        this.spawnedObjects.delete('health_potion');
        
        // Advance to next stage
        this.tutorialStage = 2;
        this.spawnNextStage();
    }

    useHealthPotion() {
        console.log('🧪 Using health potion from inventory');
        
        // Check if player has potion in inventory
        if (!this.tutorialFlags.get('potion_in_inventory')) {
            this.showTutorialMessage('You don\'t have a health potion in your inventory!');
            return false;
        }
        
        // Restore health
        const currentHealth = this.tutorialFlags.get('player_health') || 50;
        const maxHealth = this.tutorialFlags.get('max_health') || 100;
        const newHealth = Math.min(currentHealth + 50, maxHealth);
        
        this.setPlayerHealth(newHealth);
        
        // Remove potion from inventory
        this.tutorialFlags.set('potion_in_inventory', false);
        this.tutorialFlags.set('potion_used', true);
        this.saveTutorialState();
        
        // Show healing message
        this.showTutorialMessage(`🧪 You used the health potion! Your health is now ${newHealth}/100. You feel much better!`);
        
        // Update encounter system health
        if (window.encounterSystem) {
            window.encounterSystem.playerHealth = newHealth;
            if (window.encounterSystem.updateHealthDisplay) {
                window.encounterSystem.updateHealthDisplay();
            }
        }
        
        return true;
    }

    spawnShrines() {
        const shrineDefs = [
            this.gameObjectsRegistry.get('health_shrine'),
            this.gameObjectsRegistry.get('wisdom_shrine')
        ];

        const position = this.getPlayerPosition();
        if (!position) return;

        shrineDefs.forEach((shrineDef, index) => {
            if (!shrineDef) return;
            
            const spawnPos = this.calculateSpawnPosition(position, shrineDef.spawnRules.distance + (index * 20));
            const marker = this.createShrineMarker(spawnPos, shrineDef);
            this.spawnedObjects.set(shrineDef.name.toLowerCase().replace(' ', '_'), marker);
            
            console.log(`🏛️ ${shrineDef.name} spawned at:`, spawnPos);
        });
    }

    spawnMonsters() {
        const monsterDefs = [
            this.gameObjectsRegistry.get('neutral_wolf'),
            this.gameObjectsRegistry.get('diplomacy_goblin')
        ];

        const position = this.getPlayerPosition();
        if (!position) return;

        monsterDefs.forEach((monsterDef, index) => {
            if (!monsterDef) return;
            
            const spawnPos = this.calculateSpawnPosition(position, monsterDef.spawnRules.distance + (index * 30));
            const marker = this.createMonsterMarker(spawnPos, monsterDef);
            this.spawnedObjects.set(monsterDef.name.toLowerCase().replace(' ', '_'), marker);
            
            console.log(`👹 ${monsterDef.name} spawned at:`, spawnPos);
        });
    }

    spawnAurora() {
        const auroraDef = this.gameObjectsRegistry.get('aurora_npc');
        if (!auroraDef) return;

        const position = this.getPlayerPosition();
        if (!position) return;

        const spawnPos = this.calculateSpawnPosition(position, auroraDef.spawnRules.distance);
        const marker = this.createNPCMarker(spawnPos, auroraDef);
        this.spawnedObjects.set('aurora', marker);
        
        console.log('🌟 Aurora spawned at:', spawnPos);
    }

    createItemMarker(position, itemDef) {
        if (!window.mapEngine || !window.mapEngine.map) return null;

        const icon = L.divIcon({
            className: 'tutorial-item-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; background: radial-gradient(circle, rgba(255, 0, 0, 0.3) 0%, transparent 70%); border-radius: 50%; animation: itemPulse 2s infinite;"></div>
                    <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; background: rgba(255, 255, 255, 0.9); border: 2px solid #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">${itemDef.emoji}</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });

        const marker = L.marker([position.lat, position.lng], { icon }).addTo(window.mapEngine.map);
        
        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${itemDef.emoji} ${itemDef.name}</h4>
                <p>${itemDef.description}</p>
                <div class="popup-actions">
                    <button onclick="window.tutorialEncounterSystem.interactWithItem('${itemDef.name.toLowerCase().replace(' ', '_')}')" class="interact-btn">Pick Up</button>
                </div>
            </div>
        `);

        return marker;
    }

    createShrineMarker(position, shrineDef) {
        if (!window.mapEngine || !window.mapEngine.map) return null;

        const icon = L.divIcon({
            className: 'tutorial-shrine-marker',
            html: `
                <div style="position: relative; width: 50px; height: 50px;">
                    <div style="position: absolute; top: -5px; left: -5px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(255, 255, 0, 0.3) 0%, transparent 70%); border-radius: 50%; animation: shrineGlow 3s infinite;"></div>
                    <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: linear-gradient(45deg, #ffd700, #ffed4e); border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 15px rgba(255, 215, 0, 0.6);">${shrineDef.emoji}</div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        const marker = L.marker([position.lat, position.lng], { icon }).addTo(window.mapEngine.map);
        
        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${shrineDef.emoji} ${shrineDef.name}</h4>
                <p>${shrineDef.description}</p>
                <div class="popup-actions">
                    <button onclick="window.tutorialEncounterSystem.interactWithShrine('${shrineDef.name.toLowerCase().replace(' ', '_')}')" class="interact-btn">Activate</button>
                </div>
            </div>
        `);

        return marker;
    }

    createMonsterMarker(position, monsterDef) {
        if (!window.mapEngine || !window.mapEngine.map) return null;

        const icon = L.divIcon({
            className: 'tutorial-monster-marker',
            html: `
                <div style="position: relative; width: 45px; height: 45px;">
                    <div style="position: absolute; top: -3px; left: -3px; width: 51px; height: 51px; background: radial-gradient(circle, rgba(255, 0, 0, 0.2) 0%, transparent 70%); border-radius: 50%; animation: monsterPulse 2.5s infinite;"></div>
                    <div style="position: absolute; top: 2px; left: 2px; width: 41px; height: 41px; background: rgba(0, 0, 0, 0.8); border: 2px solid #ff0000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px;">${monsterDef.emoji}</div>
                </div>
            `,
            iconSize: [45, 45],
            iconAnchor: [22, 22]
        });

        const marker = L.marker([position.lat, position.lng], { icon }).addTo(window.mapEngine.map);
        
        const options = monsterDef.interaction.options.map(option => 
            `<button onclick="window.tutorialEncounterSystem.interactWithMonster('${monsterDef.name.toLowerCase().replace(' ', '_')}', '${option}')" class="interact-btn">${option.charAt(0).toUpperCase() + option.slice(1)}</button>`
        ).join('');

        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${monsterDef.emoji} ${monsterDef.name}</h4>
                <p>${monsterDef.description}</p>
                <p><strong>Level:</strong> ${monsterDef.stats.level}</p>
                <div class="popup-actions">
                    ${options}
                </div>
            </div>
        `);

        return marker;
    }

    createNPCMarker(position, npcDef) {
        if (!window.mapEngine || !window.mapEngine.map) return null;

        const icon = L.divIcon({
            className: 'tutorial-npc-marker',
            html: `
                <div style="position: relative; width: 50px; height: 50px;">
                    <div style="position: absolute; top: -5px; left: -5px; width: 60px; height: 60px; background: radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%); border-radius: 50%; animation: npcGlow 2s infinite;"></div>
                    <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: linear-gradient(45deg, #00ffff, #0080ff); border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; box-shadow: 0 0 20px rgba(0, 255, 255, 0.6);">${npcDef.emoji}</div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });

        const marker = L.marker([position.lat, position.lng], { icon }).addTo(window.mapEngine.map);
        
        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${npcDef.emoji} ${npcDef.name}</h4>
                <p>${npcDef.description}</p>
                <div class="popup-actions">
                    <button onclick="window.tutorialEncounterSystem.interactWithNPC('${npcDef.name.toLowerCase()}')" class="interact-btn">Talk</button>
                </div>
            </div>
        `);

        return marker;
    }

    // Interaction methods
    interactWithItem(itemId) {
        const itemDef = this.gameObjectsRegistry.get(itemId);
        if (!itemDef) return;

        console.log(`🎓 Interacting with ${itemDef.name}`);
        
        // Apply item effect
        if (itemDef.interaction.effect === 'heal' && window.encounterSystem) {
            window.encounterSystem.healPlayer(itemDef.interaction.value);
        }

        // Show message
        this.showTutorialMessage(itemDef.interaction.message);

        // Remove marker
        const marker = this.spawnedObjects.get(itemId);
        if (marker && window.mapEngine && window.mapEngine.map) {
            window.mapEngine.map.removeLayer(marker);
            this.spawnedObjects.delete(itemId);
        }

        // Set flag and advance stage
        this.setTutorialFlag('potion_collected', true);
        this.advanceTutorialStage();
    }

    interactWithShrine(shrineId) {
        const shrineDef = this.gameObjectsRegistry.get(shrineId);
        if (!shrineDef) return;

        console.log(`🎓 Interacting with ${shrineDef.name}`);
        
        // Apply shrine effect
        if (shrineDef.interaction.effect === 'buff' && window.encounterSystem) {
            // Apply temporary buff
            this.showTutorialMessage(shrineDef.interaction.message);
        }

        // Check if all shrines have been activated
        const activatedShrines = Array.from(this.tutorialFlags.keys()).filter(flag => flag.includes('shrine_activated')).length;
        if (activatedShrines >= 1) { // Both shrines activated
            this.setTutorialFlag('shrines_activated', true);
            this.advanceTutorialStage();
        }
    }

    interactWithMonster(monsterId, action) {
        const monsterDef = this.gameObjectsRegistry.get(monsterId);
        if (!monsterDef) return;

        console.log(`🎓 ${action} with ${monsterDef.name}`);

        if (action === 'attack') {
            this.startCombatTutorial(monsterDef);
        } else if (action === 'talk') {
            this.startDiplomacyTutorial(monsterDef);
        }
    }

    interactWithNPC(npcId) {
        const npcDef = this.gameObjectsRegistry.get(npcId);
        if (!npcDef) return;

        console.log(`🎓 Talking to ${npcDef.name}`);
        
        // Start quest dialogue
        this.startQuestDialogue(npcDef);
    }

    startCombatTutorial(monsterDef) {
        this.showTutorialMessage(`Combat begins! You face a ${monsterDef.name}. Use Attack to deal damage, Defend to reduce incoming damage.`);
        
        // Simulate combat resolution (simplified for tutorial)
        setTimeout(() => {
            this.showTutorialMessage(`Victory! You defeated the ${monsterDef.name} and gained experience.`);
            
            // Remove monster marker
            const marker = this.spawnedObjects.get(monsterDef.name.toLowerCase().replace(' ', '_'));
            if (marker && window.mapEngine && window.mapEngine.map) {
                window.mapEngine.map.removeLayer(marker);
                this.spawnedObjects.delete(monsterDef.name.toLowerCase().replace(' ', '_'));
            }

            this.setTutorialFlag('first_encounter_completed', true);
            this.advanceTutorialStage();
        }, 2000);
    }

    startDiplomacyTutorial(monsterDef) {
        this.showTutorialMessage(`You attempt to communicate with the ${monsterDef.name}. Roll diplomacy check...`);
        
        // Simulate diplomacy check
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% success rate for tutorial
            if (success) {
                this.showTutorialMessage(`Success! The ${monsterDef.name} is now friendly and shares some information.`);
            } else {
                this.showTutorialMessage(`The ${monsterDef.name} doesn't trust you. Combat begins!`);
                this.startCombatTutorial(monsterDef);
                return;
            }

            // Remove monster marker
            const marker = this.spawnedObjects.get(monsterDef.name.toLowerCase().replace(' ', '_'));
            if (marker && window.mapEngine && window.mapEngine.map) {
                window.mapEngine.map.removeLayer(marker);
                this.spawnedObjects.delete(monsterDef.name.toLowerCase().replace(' ', '_'));
            }

            this.setTutorialFlag('first_encounter_completed', true);
            this.advanceTutorialStage();
        }, 2000);
    }

    startQuestDialogue(npcDef) {
        const dialogue = npcDef.interaction.dialogue;
        this.showTutorialMessage(dialogue.greeting);
        
        setTimeout(() => {
            this.showTutorialMessage(dialogue.quest_intro);
            
            // Auto-accept quest for tutorial
            setTimeout(() => {
                this.showTutorialMessage(dialogue.quest_accepted);
                this.completeTutorial();
            }, 2000);
        }, 2000);
    }

    // Utility methods
    getPlayerPosition() {
        if (window.eldritchApp && window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
            return window.eldritchApp.systems.geolocation.currentPosition;
        }
        return { lat: 61.47184564562671, lng: 23.725938496942355 }; // Default position
    }

    calculateSpawnPosition(basePosition, distanceMeters) {
        const angle = Math.random() * Math.PI * 2;
        const distanceDegrees = distanceMeters / 111000; // Rough conversion to degrees
        
        return {
            lat: basePosition.lat + Math.cos(angle) * distanceDegrees,
            lng: basePosition.lng + Math.sin(angle) * distanceDegrees
        };
    }

    checkProximityTriggers(position) {
        // Check if player is near any tutorial objects
        this.spawnedObjects.forEach((marker, objectId) => {
            const markerPos = marker.getLatLng();
            const distance = this.calculateDistance(position, markerPos);
            
            if (distance < 20) { // Within 20 meters
                this.showProximityHint(objectId);
            }
        });
    }

    calculateDistance(pos1, pos2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const dLng = (pos2.lng - pos1.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(pos1.lat * Math.PI / 180) * Math.cos(pos2.lat * Math.PI / 180) *
                  Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    showProximityHint(objectId) {
        // Could show a subtle hint when player is near objects
        console.log(`🎓 Player is near ${objectId}`);
    }

    setTutorialFlag(flag, value) {
        this.tutorialFlags.set(flag, value);
        this.saveTutorialState();
        console.log(`🎓 Tutorial flag set: ${flag} = ${value}`);
    }

    advanceTutorialStage() {
        this.tutorialStage++;
        this.saveTutorialState();
        
        setTimeout(() => {
            this.spawnNextStage();
        }, 1000);
    }

    completeTutorial() {
        console.log('🎓 Tutorial completed!');
        this.isActive = false;
        this.setTutorialFlag('tutorial_complete', true);
        
        // Clear tutorial markers
        this.spawnedObjects.forEach((marker) => {
            if (window.mapEngine && window.mapEngine.map) {
                window.mapEngine.map.removeLayer(marker);
            }
        });
        this.spawnedObjects.clear();
        
        // Now allow normal game systems to take over
        this.showTutorialMessage('Tutorial complete! The cosmic realm is now open for exploration.');
        
        // Trigger normal game initialization
        if (window.mapEngine) {
            window.mapEngine.createSpecialMarkers();
        }
    }

    showTutorialMessage(message) {
        console.log(`🎓 Tutorial: ${message}`);
        
        // Create tutorial message overlay
        const tutorialOverlay = document.createElement('div');
        tutorialOverlay.className = 'tutorial-overlay';
        tutorialOverlay.innerHTML = `
            <div class="tutorial-message">
                <div class="tutorial-icon">🎓</div>
                <div class="tutorial-text">${message}</div>
                <button class="tutorial-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        tutorialOverlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: #ffffff;
            padding: 20px;
            border-radius: 15px;
            border: 2px solid #00ffff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            z-index: 10000;
            max-width: 400px;
            animation: tutorialSlideIn 0.5s ease-out;
        `;
        
        document.body.appendChild(tutorialOverlay);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (tutorialOverlay.parentElement) {
                tutorialOverlay.style.animation = 'tutorialSlideOut 0.5s ease-in';
                setTimeout(() => tutorialOverlay.remove(), 500);
            }
        }, 5000);
    }

    // Reset tutorial for testing
    resetTutorial() {
        localStorage.removeItem('eldritch_tutorial_state');
        this.tutorialStage = 0;
        this.tutorialFlags.clear();
        this.spawnedObjects.clear();
        this.isActive = false;
        console.log('🎓 Tutorial reset');
    }
}

// Add CSS animations
const tutorialStyles = document.createElement('style');
tutorialStyles.textContent = `
    @keyframes itemPulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
    }
    
    @keyframes shrineGlow {
        0%, 100% { transform: scale(1); opacity: 0.5; }
        50% { transform: scale(1.2); opacity: 0.8; }
    }
    
    @keyframes monsterPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50% { transform: scale(1.15); opacity: 0.9; }
    }
    
    @keyframes npcGlow {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.1); opacity: 1; }
    }
    
    @keyframes tutorialSlideIn {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
    
    @keyframes tutorialSlideOut {
        from { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        to { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
    }
    
    .tutorial-popup {
        font-family: 'Arial', sans-serif;
        color: #000;
    }
    
    .tutorial-popup h4 {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    .tutorial-popup p {
        margin: 5px 0;
        font-size: 14px;
    }
    
    .popup-actions {
        margin-top: 10px;
    }
    
    .interact-btn {
        background: linear-gradient(45deg, #00ffff, #0080ff);
        color: #000;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
        margin: 2px;
        transition: all 0.3s ease;
    }
    
    .interact-btn:hover {
        background: linear-gradient(45deg, #0080ff, #00ffff);
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 255, 255, 0.4);
    }
    
    .tutorial-message {
        display: flex;
        align-items: center;
        gap: 15px;
    }
    
    .tutorial-icon {
        font-size: 2rem;
    }
    
    .tutorial-text {
        flex: 1;
        font-size: 16px;
        line-height: 1.4;
    }
    
    .tutorial-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #ffffff;
        opacity: 0.7;
        transition: opacity 0.3s ease;
    }
    
    .tutorial-close:hover {
        opacity: 1;
    }
`;
document.head.appendChild(tutorialStyles);

// Make globally available
window.TutorialEncounterSystem = TutorialEncounterSystem;
