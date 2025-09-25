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
            type: 'consumable',
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
        
        this.gameObjectsRegistry.set('meditation_shrine', {
            type: 'shrine',
            name: 'Meditation Shrine',
            emoji: '🧘‍♀️',
            description: 'A peaceful shrine for meditation and sanity restoration',
            spawnRules: {
                stage: 3,
                flag: 'potion_used',
                distance: 80,
                maxCount: 1
            },
            interaction: {
                type: 'meditate',
                effect: 'sanity_restore',
                value: 30,
                message: 'You feel your mind clearing through meditation...'
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
        console.log('🎓 Setting up tutorial event listeners...');
        
        // Listen for player position updates to trigger proximity checks
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            console.log('🎓 Setting up geolocation proximity listener');
            window.eldritchApp.systems.geolocation.onPositionUpdate = (position) => {
                this.checkProximityTriggers(position);
            };
        } else {
            console.log('🎓 Geolocation system not available, setting up manual proximity checking');
            // Fallback: check proximity every 2 seconds
            setInterval(() => {
                if (this.isActive && this.spawnedObjects.size > 0) {
                    const position = this.getPlayerPosition();
                    this.checkProximityTriggers(position);
                }
            }, 2000);
        }

        // Listen for encounter completions
        document.addEventListener('encounterCompleted', (event) => {
            this.handleEncounterCompletion(event.detail);
        });
    }
    
    handleEncounterCompletion(detail) {
        console.log('🎓 Encounter completed:', detail);
        // Handle encounter completion if needed
    }

    startTutorial() {
        // Check if tutorial is already complete
        if (this.tutorialFlags.get('tutorial_complete')) {
            console.log('🎓 Tutorial already completed, not starting');
            return;
        }
        
        // Also check localStorage for tutorial completion
        try {
            const saved = localStorage.getItem('eldritch_tutorial_state');
            if (saved) {
                const state = JSON.parse(saved);
                const flags = new Map(state.flags || []);
                if (flags.get('tutorial_complete')) {
                    console.log('🎓 Tutorial already completed (from localStorage), not starting');
                    this.tutorialFlags.set('tutorial_complete', true);
                    return;
                }
            }
        } catch (e) {
            console.warn('🎓 Failed to check localStorage tutorial state:', e);
        }
        
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
        
        // Add event listener for continue button with a small delay to ensure DOM is ready
        setTimeout(() => {
            const continueBtn = document.getElementById('tutorial-welcome-continue');
            if (continueBtn) {
                continueBtn.addEventListener('click', () => {
                    console.log('🎓 Tutorial welcome continue button clicked');
                    modal.remove();
                    this.tutorialFlags.set('welcome_completed', true);
                    this.saveTutorialState();
                    // Proceed with tutorial stage 1
                    this.spawnTutorialStage1();
                });
                console.log('🎓 Tutorial welcome continue button event listener attached');
            } else {
                console.error('🎓 Tutorial welcome continue button not found!');
            }
        }, 100);
    }

    setPlayerHealth(health) {
        console.log(`🎓 Setting player health to ${health}/100`);
        
        // Set health in encounter system if available
        if (window.encounterSystem) {
            // Update the correct playerStats object
            window.encounterSystem.playerStats.health = health;
            window.encounterSystem.playerStats.maxHealth = 100;
            
            // Update health display if available
            if (window.encounterSystem.updateHealthDisplay) {
                window.encounterSystem.updateHealthDisplay();
            }
            
            // Update health bar system with a small delay to ensure it's initialized
            setTimeout(() => {
                if (window.healthBar) {
                    window.healthBar.setHealth(health, 100);
                    console.log(`🎓 Health bar updated: ${health}/100`);
                } else {
                    console.warn('🎓 Health bar system not available!');
                }
            }, 100);
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
        
        // Add to inventory using the main item system
        console.log('🧪 Checking item system availability...');
        console.log('🧪 window.itemSystem:', !!window.itemSystem);
        console.log('🧪 window.itemSystem.addToInventory:', !!(window.itemSystem && window.itemSystem.addToInventory));
        
        const addToInventory = () => {
            if (window.itemSystem && window.itemSystem.addToInventory) {
                const itemId = 'health_potion';
                console.log('🧪 Attempting to add health potion to inventory...');
                const success = window.itemSystem.addToInventory(itemId, 1);
                if (success) {
                    console.log('🧪 Added health potion to main item system inventory');
                    return true;
                } else {
                    console.warn('🧪 Failed to add health potion to main item system inventory');
                    return false;
                }
            }
            return false;
        };
        
        if (!addToInventory()) {
            console.warn('🧪 Main item system not available, trying fallback...');
            // Fallback: try encounter system item system
            if (window.encounterSystem && window.encounterSystem.itemSystem && window.encounterSystem.itemSystem.addToInventory) {
                const itemId = 'health_potion';
                const success = window.encounterSystem.itemSystem.addToInventory(itemId, 1);
                if (success) {
                    console.log('🧪 Added health potion to encounter system inventory (fallback)');
                } else {
                    console.warn('🧪 Failed to add health potion to encounter system inventory');
                }
            } else {
                console.warn('🧪 No item system available for inventory');
                console.warn('🧪 Available systems:', {
                    itemSystem: !!window.itemSystem,
                    encounterSystem: !!window.encounterSystem,
                    encounterItemSystem: !!(window.encounterSystem && window.encounterSystem.itemSystem)
                });
            }
        }
        
        // Set tutorial flag and advance stage
        this.tutorialFlags.set('potion_collected', true);
        this.tutorialFlags.set('potion_in_inventory', true);
        this.tutorialStage = 2;
        this.saveTutorialState();
        
        // Show pickup message
        this.showTutorialMessage(`
            🧪 Health potion added to your inventory! 
            <br><br>
            Open your inventory panel (bottom tab) and tap the health potion to use it. 
            <br><br>
            <strong>Warning:</strong> This cosmic potion will restore your health to maximum, but it comes at a cost to your sanity...
        `);
        
        // Remove from spawned objects
        this.spawnedObjects.delete('health_potion');
        
        // Advance to next stage
        this.tutorialStage = 2;
        this.spawnNextStage();
    }

    useHealthPotion() {
        console.log('🧪 Using health potion from inventory');
        
        // Use the main item system (same as mobile UI)
        if (window.itemSystem) {
            const hasPotion = Array.isArray(window.itemSystem.playerInventory)
                && window.itemSystem.playerInventory.some(item => item.id === 'health_potion' && (item.quantity ?? 0) > 0);
            if (!hasPotion) {
                this.showTutorialMessage('You don\'t have a health potion in your inventory!');
                return false;
            }
            
            // Try the primary path via item system
            let success = false;
            try {
                console.log('🧪 Attempting window.itemSystem.useConsumable("health_potion")');
                success = !!window.itemSystem.useConsumable('health_potion');
            } catch (err) {
                console.warn('🧪 useConsumable threw error, will attempt fallback', err);
                success = false;
            }
            
            if (!success) {
                console.log('🧪 Primary consumable path returned false — applying robust fallback');
                try {
                    // Ensure player stats exist
                    let ps = window.encounterSystem?.playerStats;
                    if (!ps) {
                        if (!window.encounterSystem) window.encounterSystem = {};
                        window.encounterSystem.playerStats = {
                            health: 50,
                            maxHealth: 100,
                            sanity: 100,
                            maxSanity: 100
                        };
                        ps = window.encounterSystem.playerStats;
                    }
                    const beforeHealth = ps.health;
                    const beforeSanity = ps.sanity;
                    // Apply effects similar to item-system handler
                    ps.health = ps.maxHealth;
                    ps.sanity = Math.max(0, ps.sanity - 30);
                    // Update UI bars if available
                    try { window.healthBar?.setHealth?.(ps.health, ps.maxHealth); } catch(_) {}
                    try { window.healthBar?.setSanity?.(ps.sanity, ps.maxSanity); } catch(_) {}
                    
                    // Remove one potion from inventory
                    try {
                        if (typeof window.itemSystem.removeFromInventory === 'function') {
                            window.itemSystem.removeFromInventory('health_potion', 1);
                        } else if (Array.isArray(window.itemSystem.playerInventory)) {
                            const entry = window.itemSystem.playerInventory.find(i => i.id === 'health_potion');
                            if (entry) {
                                entry.quantity = Math.max(0, (entry.quantity ?? 1) - 1);
                                if (entry.quantity === 0) {
                                    window.itemSystem.playerInventory = window.itemSystem.playerInventory.filter(i => i.id !== 'health_potion');
                                }
                                window.itemSystem.savePlayerInventory?.();
                            }
                        }
                    } catch (_) {
                        console.warn('🧪 Fallback removal failed (non-fatal)');
                    }
                    
                    // Tutorial progression
                    this.tutorialFlags.set('potion_used', true);
                    this.saveTutorialState();
                    try {
                        if (typeof window.itemSystem.handleTutorialPotionUsage === 'function') {
                            window.itemSystem.handleTutorialPotionUsage();
                        }
                    } catch (_) {}
                    
                    // Feedback
                    const healed = ps.health - beforeHealth;
                    const sanityLoss = beforeSanity - ps.sanity;
                    this.showTutorialMessage(`🧪 You used the health potion! +${healed} health, -${sanityLoss} sanity.`);
                    try { window.UIPanels?.populateInventoryPanel?.(); } catch(_) {}
                    return true;
                } catch (fallbackErr) {
                    console.error('🧪 Fallback application failed', fallbackErr);
                    this.showTutorialMessage('Failed to use the health potion!');
                    return false;
                }
            }
            
            // Primary path succeeded
            this.tutorialFlags.set('potion_used', true);
            this.saveTutorialState();
            const currentHealth = window.encounterSystem?.playerStats?.health || 100;
            this.showTutorialMessage(`🧪 You used the health potion! Your health is now ${currentHealth}/100. You feel much better!`);
            return true;
        } else {
            // Fallback to tutorial flags if item system not available
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
            
            return true;
        }
    }

    spawnMeditationShrine() {
        console.log('🧘‍♀️ Attempting to spawn meditation shrine...');
        console.log('🧘‍♀️ Map engine available:', !!window.mapEngine);
        console.log('🧘‍♀️ Map available:', !!(window.mapEngine && window.mapEngine.map));
        console.log('🧘‍♀️ Tutorial stage:', this.tutorialStage);
        
        const shrineDef = this.gameObjectsRegistry.get('meditation_shrine');
        if (!shrineDef) {
            console.error('🧘‍♀️ Meditation shrine definition not found');
            return;
        }

        const position = this.getPlayerPosition();
        if (!position) {
            console.error('🧘‍♀️ Player position not available');
            return;
        }

        // Wait for map to be ready if not available
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('🧘‍♀️ Map not ready, waiting...');
            setTimeout(() => {
                this.spawnMeditationShrine();
            }, 1000);
            return;
        }

        // Calculate spawn position 80m from player
        const spawnPos = this.calculateSpawnPosition(position, 80);
        console.log('🧘‍♀️ Calculated spawn position:', spawnPos);
        
        const marker = this.createShrineMarker(spawnPos, shrineDef);
        if (!marker) {
            console.error('🧘‍♀️ Failed to create shrine marker');
            return;
        }
        
        this.spawnedObjects.set('meditation_shrine', marker);
        
        console.log('🧘‍♀️ Meditation shrine spawned at:', spawnPos, 'Distance: 80m from player');
        console.log('🧘‍♀️ Spawned objects count:', this.spawnedObjects.size);
        
        // Add popup with meditation instructions
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Courier New', monospace;">
                <h3 style="color: #4a9eff; margin: 0 0 10px 0;">🧘‍♀️ Meditation Shrine</h3>
                <p style="margin: 0 0 10px 0; color: #00ff88;">${shrineDef.description}</p>
                <p style="margin: 0; font-size: 12px; color: #888;">
                    Click to meditate (within 20m)<br>
                    Restores ALL sanity points
                </p>
            </div>
        `);
        
        // Add click handler for meditation
        marker.on('click', () => {
            this.handleMeditationShrineClick(marker, shrineDef);
        });
        
        // Show player where the shrine is located
        this.showShrineLocation(spawnPos);
        
        // Force map update to ensure marker is visible
        if (window.mapEngine && window.mapEngine.map) {
            window.mapEngine.map.invalidateSize();
            console.log('🧘‍♀️ Map invalidated to ensure marker visibility');
        }
        
        // Trigger immediate proximity check and periodic proximity checks while shrine exists
        setTimeout(() => {
            const position = this.getPlayerPosition();
            console.log('🧘‍♀️ Triggering immediate proximity check after shrine spawn');
            this.checkProximityTriggers(position);
        }, 800);
        
        // Periodic checks (stop when shrine removed)
        const proximityTimer = setInterval(() => {
            if (!this.spawnedObjects.has('meditation_shrine')) {
                clearInterval(proximityTimer);
                return;
            }
            const pos = this.getPlayerPosition();
            this.checkProximityTriggers(pos);
        }, 2500);
    }
    
    showShrineLocation(shrinePos) {
        console.log('📍 Showing shrine location to player...');
        
        // Center map on shrine location
        if (window.mapEngine && window.mapEngine.map) {
            window.mapEngine.map.setView([shrinePos.lat, shrinePos.lng], 16, {
                animate: true,
                duration: 2
            });
        }
        
        // Show tutorial message with shrine location
        setTimeout(() => {
            this.showTutorialMessage(`
                🧘‍♀️ <strong>Meditation Shrine Located!</strong><br><br>
                A peaceful meditation shrine has appeared on your map. Walk to it and click to meditate to restore your sanity.<br><br>
                <em>The shrine glows with a golden aura - you can't miss it!</em>
            `);
        }, 1000);
        
        // Add a temporary pulsing effect to make the shrine more visible
        setTimeout(() => {
            const shrineMarker = this.spawnedObjects.get('meditation_shrine');
            if (shrineMarker) {
                shrineMarker.getElement()?.classList.add('shrine-pulse-highlight');
                
                // Remove highlight after 10 seconds
                setTimeout(() => {
                    shrineMarker.getElement()?.classList.remove('shrine-pulse-highlight');
                }, 10000);
            }
        }, 2000);
    }
    
    handleMeditationShrineClick(marker, shrineDef) {
        const playerPos = this.getPlayerPosition();
        const shrinePos = marker.getLatLng();
        
        if (!playerPos || !shrinePos) return;
        
        const distance = this.calculateDistance(playerPos, shrinePos);
        
        if (distance > 30) {
            this.showTutorialMessage('You need to be closer to the shrine to meditate (within 30m)');
            return;
        }
        
        // Restore all sanity points
        if (window.encounterSystem && window.encounterSystem.playerStats) {
            const beforeSanity = window.encounterSystem.playerStats.sanity;
            window.encounterSystem.playerStats.sanity = window.encounterSystem.playerStats.maxSanity;
            const sanityGained = window.encounterSystem.playerStats.sanity - beforeSanity;
            
            // Update health bar system
            if (window.healthBar) {
                window.healthBar.setSanity(window.encounterSystem.playerStats.sanity, window.encounterSystem.playerStats.maxSanity);
            }
            
            this.showTutorialMessage(`🧘‍♀️ You meditate at the shrine and feel your mind clearing... +${sanityGained} sanity restored! Your mind is now at peace.`);
            
            // Update tutorial stage
            this.tutorialStage = 4;
            this.tutorialFlags.set('shrine_meditated', true);
            this.saveTutorialState();
            
            // Show next tutorial message and trigger Aurora meeting
            setTimeout(() => {
                this.showTutorialMessage(`
                    🌟 Excellent! You have learned the basics of cosmic exploration:
                    <br><br>
                    • How to collect items and use them from your inventory
                    • The cosmic cost of powerful potions (sanity loss)
                    • How to restore your sanity through meditation
                    <br><br>
                    <em>As you finish meditating, you sense a presence approaching...</em>
                `);
                
                // Trigger Aurora meeting after meditation
                setTimeout(() => {
                    this.triggerAuroraMeeting();
                }, 3000);
                
                // Remove the shrine
                this.spawnedObjects.delete('meditation_shrine');
                if (marker && marker.remove) {
                    marker.remove();
                }
            }, 2000);
        }
    }
    
    triggerAuroraMeeting() {
        console.log('👑 Triggering Aurora meeting...');
        
        // Create Aurora meeting dialog
        this.showAuroraMeetingDialog();
        
        // Spawn Aurora marker near player
        this.spawnAuroraMarker();
        
        // Update tutorial stage
        this.tutorialStage = 5;
        this.tutorialFlags.set('aurora_met', true);
        this.saveTutorialState();
    }
    
    showAuroraMeetingDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'aurora-meeting-dialog';
        dialog.style.cssText = `
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
            animation: fadeIn 0.5s ease-in-out;
        `;
        
        dialog.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4ecdc4;
                border-radius: 20px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                position: relative;
                animation: slideInFromTop 0.6s ease-out;
            ">
                <div style="
                    background: linear-gradient(90deg, #4ecdc4, #44a08d);
                    color: #1a1a2e;
                    padding: 20px;
                    border-radius: 18px 18px 0 0;
                    font-weight: bold;
                    font-size: 20px;
                    text-align: center;
                    position: relative;
                ">
                    <div style="
                        position: absolute;
                        top: -10px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 60px;
                        height: 60px;
                        background: radial-gradient(circle, #ffd700, #ffed4e);
                        border: 3px solid #ffffff;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 30px;
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                        animation: auroraGlow 2s infinite;
                    ">👑</div>
                    <div style="margin-top: 30px;">
                        Aurora - The Cosmic Navigator
                    </div>
                </div>
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <p style="font-size: 18px; color: #4ecdc4; margin: 0 0 15px 0; font-style: italic;">
                            "Greetings, cosmic wanderer. I have been watching your journey..."
                        </p>
                    </div>
                    
                    <div style="background: rgba(74, 158, 255, 0.1); border: 1px solid #4a9eff; border-radius: 10px; padding: 20px; margin: 20px 0;">
                        <h3 style="color: #4a9eff; margin: 0 0 15px 0; text-align: center;">🌟 Main Quest: The Cosmic Convergence</h3>
                        <p style="color: #ffffff; line-height: 1.6; margin: 0 0 15px 0;">
                            The cosmic realm is in turmoil. Ancient forces are awakening, and the balance between light and shadow is shifting. 
                            As one who has proven their worth through trials of health, sanity, and wisdom, you are chosen to restore cosmic harmony.
                        </p>
                        <p style="color: #4ecdc4; line-height: 1.6; margin: 0 0 15px 0;">
                            <strong>Your first objective:</strong> Seek out the Corroding Lake, where the first signs of cosmic disturbance appeared. 
                            There, you will find clues to the greater mystery that threatens all of existence.
                        </p>
                        <div style="background: rgba(255, 215, 0, 0.1); border: 1px solid #ffd700; border-radius: 8px; padding: 15px; margin: 15px 0;">
                            <h4 style="color: #ffd700; margin: 0 0 10px 0; text-align: center;">🌐 Multiplayer Cosmic Realm</h4>
                            <p style="color: #feca57; line-height: 1.5; margin: 0; font-size: 14px;">
                                <strong>You are not alone in this cosmic journey!</strong> Other cosmic wanderers are exploring the realm simultaneously. 
                                You may encounter them at sacred sites, trade cosmic artifacts, or join forces to face greater cosmic challenges together.
                                <br><br>
                                <em>Look for golden markers on your map - these indicate areas where other players are active!</em>
                            </p>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 25px;">
                        <p style="color: #feca57; font-size: 14px; margin: 0;">
                            <em>"The path ahead is perilous, but I will guide you when I can. Trust in your cosmic intuition."</em>
                        </p>
                    </div>
                </div>
                <div style="
                    padding: 20px;
                    text-align: center;
                    border-top: 1px solid #333;
                ">
                    <button onclick="this.closest('#aurora-meeting-dialog').remove()" style="
                        background: linear-gradient(90deg, #4ecdc4, #44a08d);
                        color: #1a1a2e;
                        border: none;
                        padding: 15px 40px;
                        border-radius: 25px;
                        font-weight: bold;
                        cursor: pointer;
                        font-size: 16px;
                        transition: transform 0.2s ease;
                        box-shadow: 0 5px 15px rgba(78, 205, 196, 0.3);
                    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                        Accept the Quest
                    </button>
                </div>
            </div>
        `;
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideInFromTop {
                from { 
                    opacity: 0; 
                    transform: translateY(-50px) scale(0.9); 
                }
                to { 
                    opacity: 1; 
                    transform: translateY(0) scale(1); 
                }
            }
            @keyframes auroraGlow {
                0%, 100% { 
                    box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
                    transform: translateX(-50%) scale(1);
                }
                50% { 
                    box-shadow: 0 0 30px rgba(255, 215, 0, 0.9);
                    transform: translateX(-50%) scale(1.05);
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Auto-remove after 30 seconds if not closed
        setTimeout(() => {
            if (document.getElementById('aurora-meeting-dialog')) {
                document.getElementById('aurora-meeting-dialog').remove();
            }
        }, 30000);
    }
    
    spawnAuroraMarker() {
        console.log('👑 Spawning Aurora marker...');
        
        // Check if tutorial is complete - if so, don't spawn tutorial Aurora
        if (this.tutorialFlags.get('tutorial_complete')) {
            console.log('👑 Tutorial complete, not spawning tutorial Aurora');
            return;
        }
        
        const position = this.getPlayerPosition();
        if (!position) return;

        // Calculate spawn position 50m from player (further away for dramatic effect)
        const spawnPos = this.calculateSpawnPosition(position, 50);
        
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('👑 Map not ready, waiting...');
            setTimeout(() => {
                this.spawnAuroraMarker();
            }, 1000);
            return;
        }
        
        const icon = L.divIcon({
            className: 'aurora-marker',
            html: `
                <div style="position: relative; width: 60px; height: 60px;">
                    <div style="position: absolute; top: -5px; left: -5px; width: 70px; height: 70px; background: radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, transparent 70%); border-radius: 50%; animation: auroraMarkerGlow 3s infinite;"></div>
                    <div style="position: absolute; top: 5px; left: 5px; width: 50px; height: 50px; background: linear-gradient(45deg, #ffd700, #ffed4e); border: 3px solid #ffffff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; box-shadow: 0 0 20px rgba(255, 215, 0, 0.8);">👑</div>
                </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });

        const marker = L.marker([spawnPos.lat, spawnPos.lng], { icon }).addTo(window.mapEngine.map);
        
        marker.bindPopup(`
            <div style="text-align: center; font-family: 'Courier New', monospace;">
                <h3 style="color: #ffd700; margin: 0 0 10px 0;">👑 Aurora - The Cosmic Navigator</h3>
                <p style="margin: 0 0 10px 0; color: #4ecdc4;">Lost star pilot with stellar wisdom</p>
                <p style="margin: 0; font-size: 12px; color: #888;">
                    Walking towards you...<br>
                    Main quest giver
                </p>
            </div>
        `);
        
        // Store marker reference
        this.spawnedObjects.set('aurora', marker);
        
        console.log('👑 Aurora marker spawned at:', spawnPos);
        
        // Start Aurora walking animation towards player
        this.startAuroraWalkingAnimation(marker, spawnPos, position);
        
        // Add CSS animation for Aurora marker
        const style = document.createElement('style');
        style.textContent = `
            @keyframes auroraMarkerGlow {
                0%, 100% { 
                    opacity: 0.6;
                    transform: scale(1);
                }
                50% { 
                    opacity: 1;
                    transform: scale(1.1);
                }
            }
            @keyframes auroraWalking {
                0%, 100% { 
                    transform: translateY(0px);
                }
                50% { 
                    transform: translateY(-3px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    startAuroraWalkingAnimation(marker, startPos, targetPos) {
        console.log('👑 Starting Aurora walking animation...');
        
        // Show tutorial message about Aurora approaching
        this.showTutorialMessage(`
            👑 <strong>Aurora Approaches!</strong><br><br>
            You see a golden figure walking towards you from the distance. 
            The cosmic navigator Aurora has detected your presence and is coming to meet you!<br><br>
            <em>She moves with purpose, her golden aura glowing brighter as she approaches...</em>
        `);
        
        // Calculate walking path (straight line from start to target)
        const steps = 20; // Number of animation steps
        const latStep = (targetPos.lat - startPos.lat) / steps;
        const lngStep = (targetPos.lng - startPos.lng) / steps;
        
        let currentStep = 0;
        const walkInterval = setInterval(() => {
            currentStep++;
            
            // Calculate new position
            const newLat = startPos.lat + (latStep * currentStep);
            const newLng = startPos.lng + (lngStep * currentStep);
            
            // Update marker position
            marker.setLatLng([newLat, newLng]);
            
            // Add walking animation to the marker
            const markerElement = marker.getElement();
            if (markerElement) {
                markerElement.style.animation = 'auroraWalking 0.6s infinite';
            }
            
            // Check if Aurora has reached the player
            const distance = this.calculateDistance({ lat: newLat, lng: newLng }, targetPos);
            
            if (currentStep >= steps || distance < 5) {
                clearInterval(walkInterval);
                console.log('👑 Aurora has reached the player!');
                
                // Stop walking animation
                if (markerElement) {
                    markerElement.style.animation = 'auroraMarkerGlow 3s infinite';
                }
                
                // Update popup to show she's ready to talk
                marker.bindPopup(`
                    <div style="text-align: center; font-family: 'Courier New', monospace;">
                        <h3 style="color: #ffd700; margin: 0 0 10px 0;">👑 Aurora - The Cosmic Navigator</h3>
                        <p style="margin: 0 0 10px 0; color: #4ecdc4;">Lost star pilot with stellar wisdom</p>
                        <p style="margin: 0; font-size: 12px; color: #888;">
                            Click to talk (within 20m)<br>
                            Main quest giver
                        </p>
                    </div>
                `);
                
                // Add click handler for Aurora interaction
                marker.on('click', () => {
                    this.handleAuroraClick(marker);
                });
                
                // Show final approach message
                setTimeout(() => {
                    this.showTutorialMessage(`
                        👑 <strong>Aurora has arrived!</strong><br><br>
                        The cosmic navigator stands before you, her golden aura pulsing with ancient wisdom. 
                        She looks at you with knowing eyes, as if she's been waiting for this moment.<br><br>
                        <em>Click on her to begin your conversation...</em>
                    `);
                }, 1000);
            }
        }, 200); // Move every 200ms for smooth animation
    }
    
    handleAuroraClick(marker) {
        const playerPos = this.getPlayerPosition();
        const auroraPos = marker.getLatLng();
        
        if (!playerPos || !auroraPos) return;

        const distance = this.calculateDistance(playerPos, auroraPos);
        
        if (distance > 20) {
            this.showTutorialMessage('You need to be closer to Aurora to talk (within 20m)');
            return;
        }
        
        // Show Aurora dialogue
        this.showAuroraDialogue();
    }
    
    showAuroraDialogue() {
        const dialog = document.createElement('div');
        dialog.id = 'aurora-dialogue';
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid #ffd700;
            border-radius: 15px;
            padding: 25px;
            z-index: 10001;
            backdrop-filter: blur(20px);
            box-shadow: 0 20px 60px rgba(255, 215, 0, 0.4);
            max-width: 500px;
            text-align: center;
            animation: auroraDialogueAppear 0.5s ease-out;
        `;
        
        dialog.innerHTML = `
            <div style="text-align: center; font-family: 'Courier New', monospace;">
                <h3 style="color: #ffd700; margin: 0 0 15px 0; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8);">👑 Aurora</h3>
                <p style="margin: 0 0 15px 0; color: #4ecdc4; font-size: 16px; line-height: 1.6;">
                    "The cosmic realm needs your help, brave wanderer. The Corroding Lake holds the first key to understanding the great disturbance. 
                    Seek it out, and remember - trust in your cosmic intuition."
                </p>
                <p style="margin: 0 0 15px 0; color: #ffd700; font-size: 14px; line-height: 1.5;">
                    <strong>🌐 Multiplayer Note:</strong> You are not alone in this cosmic realm. Other cosmic wanderers are exploring simultaneously. 
                    Look for golden markers on your map - these indicate areas where other players are active!
                </p>
                <p style="margin: 0; color: #feca57; font-size: 14px;">
                    <em>"May the stars guide your path, and may you find allies in the cosmic darkness."</em>
                </p>
            </div>
            <div style="margin-top: 20px;">
                <button onclick="this.closest('#aurora-dialogue').remove()" style="
                    background: linear-gradient(90deg, #ffd700, #ffed4e);
                    color: #1a1a2e;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 25px;
                    font-weight: bold;
                    cursor: pointer;
                    font-size: 16px;
                    transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                    Continue Journey
                </button>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes auroraDialogueAppear {
                from { 
                    opacity: 0; 
                    transform: translate(-50%, -50%) scale(0.8); 
                }
                to { 
                    opacity: 1; 
                    transform: translate(-50%, -50%) scale(1); 
                }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(dialog);
        
        // Auto-remove after 15 seconds if not closed
        setTimeout(() => {
            if (document.getElementById('aurora-dialogue')) {
                document.getElementById('aurora-dialogue').remove();
            }
        }, 15000);
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
        console.log('🧪 createItemMarker called with:', { position, itemDef, mapEngine: !!window.mapEngine, map: !!(window.mapEngine && window.mapEngine.map) });
        if (!window.mapEngine || !window.mapEngine.map) {
            console.warn('🧪 Map engine or map not available');
            return null;
        }

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
        console.log('🧪 Leaflet marker created and added to map:', marker);
        
        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${itemDef.emoji} ${itemDef.name}</h4>
                <p>${itemDef.description}</p>
                <div class="popup-actions">
                    <button onclick="window.tutorialEncounterSystem.interactWithItem('${itemDef.name.toLowerCase().replace(' ', '_')}')" class="interact-btn">Pick Up</button>
                </div>
            </div>
        `);

            // Add to map engine's itemMarkers Map for WebGL integration
            if (window.mapEngine) {
                // Initialize itemMarkers Map if it doesn't exist
                if (!window.mapEngine.itemMarkers) {
                    window.mapEngine.itemMarkers = new Map();
                    console.log('🧪 Initialized map engine itemMarkers Map');
                }

                const itemKey = `tutorial_${itemDef.name.toLowerCase().replace(' ', '_')}`;
                window.mapEngine.itemMarkers.set(itemKey, {
                    marker: marker,
                    position: position,
                    itemDef: itemDef,
                    tutorialItem: true,
                    lat: position.lat,
                    lng: position.lng,
                    name: itemDef.name
                });
                console.log('🧪 Added tutorial item to map engine itemMarkers Map, total items:', window.mapEngine.itemMarkers.size);
            
                // Trigger WebGL conversion for the new item
                if (window.webglMapIntegration && window.webglMapIntegration.convertItemMarker) {
                    const itemData = window.mapEngine.itemMarkers.get(itemKey);
                    window.webglMapIntegration.convertItemMarker(itemData, itemKey);
                    console.log('🧪 Triggered WebGL conversion for tutorial item');
                }
            }
        } else {
            console.warn('🧪 Map engine not available for item marker registration');
        }

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

        const marker = L.marker([position.lat, position.lng], { icon, interactive: true, riseOnHover: true, bubblingMouseEvents: true }).addTo(window.mapEngine.map);
        
        marker.bindPopup(`
            <div class="tutorial-popup">
                <h4>${shrineDef.emoji} ${shrineDef.name}</h4>
                <p>${shrineDef.description}</p>
                <div class="popup-actions">
                    <button onclick="window.tutorialEncounterSystem.interactWithShrine('${shrineDef.name.toLowerCase().replace(' ', '_')}')" class="interact-btn">Activate</button>
                </div>
            </div>
        `);

        // Also bind direct click on marker to shrine interaction for reliability on mobile
        try {
            const shrineId = shrineDef.name.toLowerCase().replace(' ', '_');
            marker.on('click', () => {
                window.tutorialEncounterSystem?.interactWithShrine?.(shrineId);
            });
            // Extra safety: attach listener to underlying DOM element (helps some mobile browsers)
            setTimeout(() => {
                const el = marker.getElement?.();
                if (el) {
                    el.style.pointerEvents = 'auto';
                    el.addEventListener('click', () => window.tutorialEncounterSystem?.interactWithShrine?.(shrineId));
                    el.addEventListener('touchend', () => window.tutorialEncounterSystem?.interactWithShrine?.(shrineId), { passive: true });
                }
            }, 0);
        } catch (_) {}

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
        
        // If this is the meditation shrine, use the dedicated meditation handler with distance check
        if (shrineId === 'meditation_shrine') {
            const marker = this.spawnedObjects.get('meditation_shrine');
            if (marker) {
                this.handleMeditationShrineClick(marker, shrineDef);
                return;
            }
        }
        
        // Apply shrine effect
        if (shrineDef.interaction.effect === 'buff' && window.encounterSystem) {
            // Apply temporary buff
            this.showTutorialMessage(shrineDef.interaction.message);
        }

        // Check if all shrines have been activated
        const activatedShrines = Array.from(this.tutorialFlags.keys()).filter(flag => flag.includes('shrine_activated')).length;
        if (activatedShrines >= 1) { // At least one shrine activated progresses tutorial here
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
        console.log('🎯 Checking proximity triggers...');
        console.log('🎯 Player position:', position);
        console.log('🎯 Spawned objects count:', this.spawnedObjects.size);
        console.log('🎯 Spawned objects keys:', Array.from(this.spawnedObjects.keys()));
        
        // Check if player is near any tutorial objects
        this.spawnedObjects.forEach((marker, objectId) => {
            console.log(`🎯 Checking object: ${objectId}`);
            const markerPos = marker.getLatLng();
            const distance = this.calculateDistance(position, markerPos);
            console.log(`🎯 Distance to ${objectId}: ${distance.toFixed(1)}m`);
            
            if (distance < 40) { // Within 40 meters show hint
                console.log(`🎯 Player is within 40m of ${objectId}`);
                this.showProximityHint(objectId);
                
                // Check if this is a shrine and trigger interaction
                if (objectId === 'meditation_shrine') {
                    console.log('🧘‍♀️ Found meditation shrine in proximity check!');
                    const shrineDef = this.gameObjectsRegistry.get('meditation_shrine');
                    if (shrineDef) {
                        // Only show tutorial message once per shrine
                        if (!this.tutorialFlags.get('shrine_proximity_shown')) {
                            this.showTutorialMessage(`
                                🧘‍♀️ <strong>Meditation Shrine Nearby!</strong><br><br>
                                You sense the peaceful energy of a meditation shrine. Click on it to restore your sanity and find inner peace.
                                <br><br>
                                <em>The shrine glows with golden light - you can't miss it!</em>
                            `);
                            this.tutorialFlags.set('shrine_proximity_shown', true);
                        }
                        
                        // Auto-trigger shrine interaction if player is close enough
                        if (distance < 25 && !this.tutorialFlags.get('shrine_auto_triggered')) { // Within 25 meters, auto-trigger (more forgiving for mobile GPS)
                            console.log('🧘‍♀️ Player is very close to shrine, auto-triggering meditation...');
                            this.tutorialFlags.set('shrine_auto_triggered', true);
                            setTimeout(() => {
                                this.handleMeditationShrineClick(marker, shrineDef);
                            }, 1000);
                        }
                    }
                }
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
        
        // Initialize NPC system
        if (window.eldritchApp && window.eldritchApp.systems.npc) {
            console.log('👥 Starting NPC system after tutorial completion');
            window.eldritchApp.systems.npc.startSimulation();
        }
        
        // Initialize quest system
        if (window.eldritchApp && window.eldritchApp.systems.quest) {
            console.log('🎭 Starting quest system after tutorial completion');
            window.eldritchApp.systems.quest.isPaused = false;
            window.eldritchApp.systems.quest.createQuestMarkers();
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
        localStorage.removeItem('eldritch_start_tutorial_encounter');
        this.tutorialStage = 0;
        this.tutorialFlags.clear();
        this.spawnedObjects.clear();
        this.isActive = false;
        console.log('🎓 Tutorial reset');
    }
    
    // Clear tutorial flag and disable tutorial
    disableTutorial() {
        localStorage.removeItem('eldritch_start_tutorial_encounter');
        localStorage.removeItem('eldritch_tutorial_state');
        this.isActive = false;
        this.tutorialFlags.clear();
        this.tutorialStage = 0;
        console.log('🎓 Tutorial disabled and state cleared');
    }
    
    // Force complete tutorial to skip it
    forceCompleteTutorial() {
        this.tutorialFlags.set('tutorial_complete', true);
        this.saveTutorialState();
        this.isActive = false;
        console.log('🎓 Tutorial force completed');
    }
}

// Global functions for tutorial management
window.disableTutorial = function() {
    if (window.tutorialEncounterSystem) {
        window.tutorialEncounterSystem.disableTutorial();
    } else {
        localStorage.removeItem('eldritch_start_tutorial_encounter');
        localStorage.removeItem('eldritch_tutorial_state');
        console.log('🎓 Tutorial disabled (system not available)');
    }
};

window.forceCompleteTutorial = function() {
    if (window.tutorialEncounterSystem) {
        window.tutorialEncounterSystem.forceCompleteTutorial();
    } else {
        localStorage.setItem('eldritch_tutorial_state', JSON.stringify({
            stage: 0,
            flags: [['tutorial_complete', true]]
        }));
        console.log('🎓 Tutorial force completed (system not available)');
    }
};

window.clearTutorialModal = function() {
    // Remove any tutorial modals
    const tutorialModal = document.getElementById('tutorial-welcome-modal');
    if (tutorialModal) {
        tutorialModal.remove();
        console.log('🎓 Tutorial welcome modal removed');
    }
    
    // Remove any player identity modals
    const identityModal = document.getElementById('user-settings-modal');
    if (identityModal) {
        identityModal.classList.add('hidden');
        console.log('🎓 Player identity modal hidden');
    }
    
    // Clear tutorial flags
    localStorage.removeItem('eldritch_start_tutorial_encounter');
    localStorage.removeItem('eldritch_tutorial_state');
    console.log('🎓 Tutorial state cleared');
};

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
