/**
 * Encounter System - Handles proximity encounters, cutscenes, battles, and puzzles
 * Currency: Steps (gained through movement)
 */

class EncounterSystem {
    constructor() {
        this.isInitialized = false;
        this.playerSteps = 0;
        this.encounters = new Map();
        this.activeEncounter = null;
        this.proximityCheckInterval = null;
        // Step calculation now based on distance moved
        this.lastPosition = null;
        
        // Initialize item system
        this.itemSystem = new ItemSystem();
        
        // Initialize quest system (disabled for testing)
        // this.questSystem = new QuestSystem();
        
        // Player stats - The cosmic horror comedy begins!
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            sanity: 100,
            maxSanity: 100,
            attack: 15,
            defense: 10,
            luck: 12,
            experience: 0,
            level: 1,
            inventory: [],
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            skills: {
                combat: 1,
                diplomacy: 1,
                investigation: 1,
                survival: 1
            },
            traits: [],
            reputation: {},
            isDead: false,
            deathReason: null
        };
        
        // Encounter types
        this.encounterTypes = {
            MONSTER: 'monster',
            POI: 'poi',
            MYSTERY: 'mystery'
        };
        
        // Rewards system
        this.rewards = {
            items: [],
            experience: 0,
            discoveries: []
        };

        // Story database
        this.stories = this.initializeStories();
        this.npcBackstories = this.initializeNPCBackstories();
        
        // Legendary encounters
        this.legendaryEncounters = this.initializeLegendaryEncounters();
    }

    init() {
        console.log('🎭 Encounter system initialized');
        this.isInitialized = true;
        this.startProximityDetection();
        this.setupUI();
        
        
        // Debug panel disabled - using unified debug console instead
        // this.createDebugPanel();
    }

    setupUI() {
        // Create encounter UI elements
        this.createEncounterModal();
        this.createRewardsPanel();
    }
    
    // Update mobile UI stats
    updateMobileStats() {
        if (window.eldritchApp && window.eldritchApp.isMobile) {
            window.eldritchApp.updateMobileStats();
        }
    }

    createEncounterModal() {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('encounter-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'encounter-modal';
        modal.className = 'encounter-modal hidden';
        modal.innerHTML = `
            <div class="encounter-content">
                <div class="encounter-header">
                    <h2 id="encounter-title">Encounter</h2>
                    <button id="close-encounter" class="close-btn">&times;</button>
                </div>
                <div class="encounter-body">
                    <div id="encounter-dialog" class="encounter-dialog">
                        <p id="dialog-text">Welcome to the encounter!</p>
                    </div>
                    <div id="encounter-actions" class="encounter-actions">
                        <button id="action-1" class="encounter-btn">Action 1</button>
                        <button id="action-2" class="encounter-btn">Action 2</button>
                        <button id="action-3" class="encounter-btn">Action 3</button>
                    </div>
                    <div id="battle-interface" class="battle-interface hidden">
                        <div class="battle-stats">
                            <div class="player-stats">
                                <h3>Player</h3>
                                <div class="stat-bar">
                                    <div class="stat-label">Health:</div>
                                    <div class="stat-value" id="player-health">100/100</div>
                                </div>
                            </div>
                            <div class="monster-stats">
                                <h3 id="monster-name">Monster</h3>
                                <div class="stat-bar">
                                    <div class="stat-label">Health:</div>
                                    <div class="stat-value" id="monster-health">100/100</div>
                                </div>
                            </div>
                        </div>
                        <div class="battle-actions">
                            <button id="attack-btn" class="battle-btn">Attack</button>
                            <button id="defend-btn" class="battle-btn">Defend</button>
                            <button id="flee-btn" class="battle-btn">Flee</button>
                        </div>
                    </div>
                    <div id="puzzle-interface" class="puzzle-interface hidden">
                        <h3 id="puzzle-title">Puzzle</h3>
                        <div id="puzzle-content" class="puzzle-content"></div>
                        <div class="puzzle-actions">
                            <button id="submit-puzzle" class="puzzle-btn">Submit</button>
                            <button id="skip-puzzle" class="puzzle-btn">Skip</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-encounter').addEventListener('click', () => this.closeEncounter());
        document.getElementById('action-1').addEventListener('click', () => this.handleAction(1));
        document.getElementById('action-2').addEventListener('click', () => this.handleAction(2));
        document.getElementById('action-3').addEventListener('click', () => this.handleAction(3));
        
        // Battle actions
        document.getElementById('attack-btn').addEventListener('click', () => this.battleAction('attack'));
        document.getElementById('defend-btn').addEventListener('click', () => this.battleAction('defend'));
        document.getElementById('flee-btn').addEventListener('click', () => this.battleAction('flee'));
        
        // Puzzle actions
        document.getElementById('submit-puzzle').addEventListener('click', () => this.submitPuzzle());
        document.getElementById('skip-puzzle').addEventListener('click', () => this.skipPuzzle());
    }


    createRewardsPanel() {
        const existingPanel = document.getElementById('rewards-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'rewards-panel';
        panel.className = 'rewards-panel hidden';
        panel.innerHTML = `
            <div class="rewards-content">
                <h3>Rewards Earned!</h3>
                <div id="rewards-list"></div>
                <button id="close-rewards" class="close-btn">Close</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        document.getElementById('close-rewards').addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }

    createDebugPanel() {
        const existingPanel = document.getElementById('debug-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'debug-panel';
        panel.className = 'debug-panel';
        panel.style.position = 'fixed';
        panel.style.top = '20px';
        panel.style.right = '20px';
        panel.style.zIndex = '10000';
        panel.innerHTML = `
            <div class="debug-content">
                <h3>🎭 Debug Panel</h3>
                <div class="debug-content-simple">
                    <h4>📊 Player Stats</h4>
                    <div class="health-sanity-display">
                        <div class="stat-bar">
                            <span class="stat-label">Health:</span>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${(this.playerStats.health / this.playerStats.maxHealth) * 100}%"></div>
                            </div>
                            <span class="stat-value">${this.playerStats.health}/${this.playerStats.maxHealth}</span>
                        </div>
                        <div class="stat-bar">
                            <span class="stat-label">Sanity:</span>
                            <div class="sanity-bar">
                                <div class="sanity-fill" style="width: ${(this.playerStats.sanity / this.playerStats.maxSanity) * 100}%"></div>
                            </div>
                            <span class="stat-value">${this.playerStats.sanity}/${this.playerStats.maxSanity}</span>
                        </div>
                    </div>
                    
                    <div class="debug-controls">
                        <button id="test-monster" class="debug-btn">Test Monster</button>
                        <button id="heal-player" class="debug-btn">Heal Player</button>
                        <button id="restore-sanity" class="debug-btn">Restore Sanity</button>
                        <button id="lose-health" class="debug-btn">Lose 10 Health</button>
                        <button id="lose-sanity" class="debug-btn">Lose 10 Sanity</button>
                        <button id="start-simulation" class="debug-btn simulation-btn">🎭 Start Quest Simulation</button>
                        <button id="stop-simulation" class="debug-btn simulation-btn">⏹️ Stop Simulation</button>
                    </div>
                </div>
                
                <button id="toggle-debug" class="debug-btn">Toggle Debug Panel</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        console.log('🎭 Debug panel created and added to DOM');
        
        // Add event listeners
        document.getElementById('test-monster').addEventListener('click', () => this.triggerMonsterEncounter());
        document.getElementById('toggle-debug').addEventListener('click', () => {
            panel.classList.toggle('hidden');
        });
        
        // Stats debug buttons
        document.getElementById('heal-player').addEventListener('click', () => {
            console.log('🎭 Heal Player button clicked');
            this.healPlayer();
        });
        document.getElementById('restore-sanity').addEventListener('click', () => {
            console.log('🎭 Restore Sanity button clicked');
            this.restoreSanity();
        });
        document.getElementById('lose-health').addEventListener('click', () => {
            console.log('🎭 Lose Health button clicked');
            this.loseHealth(10, 'Debug test');
        });
        document.getElementById('lose-sanity').addEventListener('click', () => {
            console.log('🎭 Lose Sanity button clicked');
            this.loseSanity(10, 'Debug test');
        });
        
        // Simulation buttons
        document.getElementById('start-simulation').addEventListener('click', () => {
            console.log('🎭 Start Simulation button clicked');
            if (window.questSimulation) {
                window.questSimulation.startSimulation();
            }
        });
        
        document.getElementById('stop-simulation').addEventListener('click', () => {
            console.log('🎭 Stop Simulation button clicked');
            if (window.questSimulation) {
                window.questSimulation.stopSimulation();
            }
        });
        
        // Initialize displays
        this.updateSimpleStatsDisplay();
    }

    hideIndividualDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    // Simple stats display method
    updateSimpleStatsDisplay() {
        const healthFill = document.querySelector('.health-fill');
        const sanityFill = document.querySelector('.sanity-fill');
        const healthValue = document.querySelector('.stat-value');
        const sanityValue = document.querySelectorAll('.stat-value')[1];
        
        if (healthFill) {
            healthFill.style.width = `${(this.playerStats.health / this.playerStats.maxHealth) * 100}%`;
        }
        
        if (sanityFill) {
            sanityFill.style.width = `${(this.playerStats.sanity / this.playerStats.maxSanity) * 100}%`;
        }
        
        if (healthValue) {
            healthValue.textContent = `${this.playerStats.health}/${this.playerStats.maxHealth}`;
        }
        
        if (sanityValue) {
            sanityValue.textContent = `${this.playerStats.sanity}/${this.playerStats.maxSanity}`;
        }
        
    }

    // Simple debug action methods
    healPlayer() {
        this.playerStats.health = this.playerStats.maxHealth;
        this.updateHealthBars();
        this.updateSimpleStatsDisplay();
        console.log('❤️ Player healed to full health!');
    }

    restoreSanity() {
        this.playerStats.sanity = this.playerStats.maxSanity;
        this.updateHealthBars();
        this.updateSimpleStatsDisplay();
        console.log('🧠 Sanity restored to full!');
    }

    startProximityDetection() {
        this.proximityCheckInterval = setInterval(() => {
            this.checkProximityEncounters();
        }, 1000); // Check every 1 second for more responsive detection
    }

    checkProximityEncounters() {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine) {
            console.log('🎭 No map engine available for proximity check');
            return;
        }
        
        // Check if getPlayerPosition method exists
        if (typeof window.eldritchApp.systems.mapEngine.getPlayerPosition !== 'function') {
            console.error('🎭 ERROR: getPlayerPosition method not found on map engine');
            console.log('🎭 Map engine methods:', Object.getOwnPropertyNames(window.eldritchApp.systems.mapEngine));
            return;
        }

        const playerPos = window.eldritchApp.systems.mapEngine.getPlayerPosition();
        if (!playerPos) {
            console.log('🎯 No player position available for proximity check');
            // Try to get position from geolocation system as fallback
            if (window.eldritchApp.systems.geolocation && window.eldritchApp.systems.geolocation.currentPosition) {
                console.log('🎯 Using geolocation fallback position');
                const fallbackPos = window.eldritchApp.systems.geolocation.currentPosition;
                this.checkProximityEncountersWithPosition(fallbackPos);
            }
            return;
        }
        
        this.checkProximityEncountersWithPosition(playerPos);
    }
    
    checkProximityEncountersWithPosition(playerPos) {

        // Debug: Log player position and nearby markers
        this.debugProximityInfo(playerPos);

        // Add visual proximity indicators
        this.addProximityIndicators(playerPos);

        // Check distance to all markers
        this.checkMonsterProximity(playerPos);
        this.checkPOIProximity(playerPos);
        this.checkMysteryProximity(playerPos);
        this.checkQuestMarkerProximity(playerPos);
        
        // Check for legendary encounters
        this.checkLegendaryEncounters(playerPos);
        
        // Check for proximity warnings (within 100m)
        this.checkProximityWarnings(playerPos);
    }

    checkMonsterProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.monsters) {
            return;
        }
        
        window.eldritchApp.systems.mapEngine.monsters.forEach((monster, index) => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                monster.lat, monster.lng
            );
            
            if (distance < 50 && !monster.encountered) { // 50m for closer interaction
                console.log(`🎭 Monster encounter triggered! Distance: ${distance.toFixed(2)}m`);
                monster.encountered = true;
                this.startMonsterEncounter(monster);
            }
        });
    }

    checkPOIProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.pointsOfInterest) {
            return;
        }
        
        window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach((poi, index) => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                poi.getLatLng().lat, poi.getLatLng().lng
            );
            
            if (distance < 30 && !poi.encountered) { // 30m for closer interaction
                console.log(`🎭 POI encounter triggered! Distance: ${distance.toFixed(2)}m`);
                poi.encountered = true;
                this.startPOIEncounter(poi);
            }
        });
    }

    checkMysteryProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.mysteryZoneMarkers) {
            return;
        }
        
        // Mystery encounters removed as requested
    }
    
    checkQuestMarkerProximity(playerPos) {
        if (!window.unifiedQuestSystem || !window.unifiedQuestSystem.questMarkers) {
            return;
        }
        
        window.unifiedQuestSystem.questMarkers.forEach((questMarker, key) => {
            if (questMarker.encountered) {
                return; // Skip already encountered markers
            }
            
            const questPos = questMarker.getLatLng();
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                questPos.lat, questPos.lng
            );
            
            // Use visual proximity - closer trigger area for better UX
            if (distance < 30) { // 30m for quest marker interaction
                console.log(`🎭 Quest marker encounter triggered! Distance: ${distance.toFixed(2)}m`);
                questMarker.encountered = true;
                this.startQuestMarkerEncounter(questMarker, key);
            }
        });
    }

    checkTestQuestProximity(playerPos) {
        if (!window.eldritchApp?.systems?.mapEngine?.testQuestMarkers) {
            return;
        }

        window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach((questMarker, key) => {
            if (questMarker.encountered) {
                return; // Skip already encountered markers
            }
            
            const questPos = questMarker.getLatLng();
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                questPos.lat, questPos.lng
            );
            
            // Use visual proximity - closer trigger area for better UX
            if (distance < 25) { // 25m for closer interaction
                console.log(`🎯 Test quest encounter triggered! Distance: ${distance.toFixed(2)}m`);
                questMarker.encountered = true;
                this.startTestQuestEncounter(questMarker);
            }
        });
    }

    checkLegendaryEncounters(playerPos) {
        // Check for legendary encounters based on spawn chance
        Object.values(this.legendaryEncounters).forEach(encounter => {
            if (Math.random() < encounter.spawnChance) {
                console.log('⚡ Legendary encounter chance triggered!');
                this.startLegendaryEncounter(encounter);
            }
        });
    }
    
    startLegendaryEncounter(encounter) {
        console.log('🌟 Starting legendary encounter:', encounter.name);
        
        this.activeEncounter = {
            type: 'legendary',
            data: encounter,
            startTime: Date.now()
        };
        
        this.showEncounterModal();
        this.showLegendaryEncounterCutscene(encounter);
    }
    
    showLegendaryEncounterCutscene(encounter) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        const battle = document.getElementById('battle-interface');
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>${encounter.emoji} ${encounter.name}</h3>
                <p><strong>${encounter.title}</strong></p>
                <p>${encounter.backstory}</p>
                <p>${encounter.dialogue.greeting}</p>
            </div>
        `;
        
        // Different actions based on encounter type
        if (encounter.name === "HEVY") {
            actions.innerHTML = `
                <button id="action-1" class="encounter-btn">Answer the Riddle</button>
                <button id="action-2" class="encounter-btn">Ask for a Hint</button>
                <button id="action-3" class="encounter-btn">Step Away</button>
            `;
            
            document.getElementById('action-1').addEventListener('click', () => this.answerHEVYRiddle(encounter));
            document.getElementById('action-2').addEventListener('click', () => this.askHEVYHint(encounter));
            document.getElementById('action-3').addEventListener('click', () => this.leaveHEVY(encounter));
        } else if (encounter.name === "Cosmic Shrine") {
            actions.innerHTML = `
                <button id="action-1" class="encounter-btn">Receive Blessing</button>
                <button id="action-2" class="encounter-btn">Meditate</button>
                <button id="action-3" class="encounter-btn">Leave</button>
            `;
            
            document.getElementById('action-1').addEventListener('click', () => this.receiveShrineBlessing(encounter));
            document.getElementById('action-2').addEventListener('click', () => this.meditateAtShrine(encounter));
            document.getElementById('action-3').addEventListener('click', () => this.leaveShrine(encounter));
        } else if (encounter.name === "Eldritch Horror") {
            actions.innerHTML = `
                <button id="action-1" class="encounter-btn">Fight</button>
                <button id="action-2" class="encounter-btn">Try to Flee</button>
                <button id="action-3" class="encounter-btn">Attempt Diplomacy</button>
            `;
            
            document.getElementById('action-1').addEventListener('click', () => this.fightEldritchHorror(encounter));
            document.getElementById('action-2').addEventListener('click', () => this.fleeFromHorror(encounter));
            document.getElementById('action-3').addEventListener('click', () => this.diplomacyWithHorror(encounter));
        } else if (encounter.name === "Wisdom Crystal") {
            actions.innerHTML = `
                <button id="action-1" class="encounter-btn">Touch Crystal</button>
                <button id="action-2" class="encounter-btn">Study Crystal</button>
                <button id="action-3" class="encounter-btn">Leave</button>
            `;
            
            document.getElementById('action-1').addEventListener('click', () => this.touchWisdomCrystal(encounter));
            document.getElementById('action-2').addEventListener('click', () => this.studyWisdomCrystal(encounter));
            document.getElementById('action-3').addEventListener('click', () => this.leaveWisdomCrystal(encounter));
        } else if (encounter.name === "Cosmic Merchant") {
            actions.innerHTML = `
                <button id="action-1" class="encounter-btn">Browse Wares</button>
                <button id="action-2" class="encounter-btn">Ask About Items</button>
                <button id="action-3" class="encounter-btn">Leave</button>
            `;
            
            document.getElementById('action-1').addEventListener('click', () => this.browseMerchantWares(encounter));
            document.getElementById('action-2').addEventListener('click', () => this.askMerchantAboutItems(encounter));
            document.getElementById('action-3').addEventListener('click', () => this.leaveMerchant(encounter));
        }
        
        battle.classList.add('hidden');
    }

    // Test function to trigger HEVY encounter (for testing purposes)
    testHeavyEncounter() {
        console.log('⚡ Testing HEVY encounter...');
        const heavy = this.legendaryEncounters.heavy;
        if (heavy) {
            this.startLegendaryEncounter(heavy);
        } else {
            console.error('HEVY encounter not found!');
        }
    }

    // Force HEVY to spawn at current location (for testing)
    forceHeavySpawn() {
        console.log('⚡ Forcing HEVY spawn at current location...');
        const heavy = this.legendaryEncounters.heavy;
        if (heavy) {
            // Temporarily increase spawn chance to 100%
            const originalChance = heavy.spawnChance;
            heavy.spawnChance = 1.0;
            
            // Trigger the encounter
            this.startLegendaryEncounter(heavy);
            
            // Restore original spawn chance
            heavy.spawnChance = originalChance;
        } else {
            console.error('HEVY encounter not found!');
        }
    }

    startLegendaryEncounter(encounter) {
        console.log(`⚡ Legendary encounter: ${encounter.name} appears!`);
        
        // Create special visual effects
        if (window.cosmicEffects) {
            const screenX = window.innerWidth / 2;
            const screenY = window.innerHeight / 2;
            window.cosmicEffects.createEnergyBurst(screenX, screenY, 2.0);
            
            // Create multiple energy bursts for dramatic effect
            setTimeout(() => window.cosmicEffects.createEnergyBurst(screenX - 100, screenY - 100, 1.5), 500);
            setTimeout(() => window.cosmicEffects.createEnergyBurst(screenX + 100, screenY + 100, 1.5), 1000);
        }
        
        this.showLegendaryModal(encounter);
    }

    showLegendaryModal(encounter) {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('legendary-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'legendary-modal';
        modal.className = 'encounter-modal';
        modal.innerHTML = `
            <div class="encounter-content legendary-encounter">
                <div class="encounter-header legendary-header">
                    <h2>${encounter.emoji} ${encounter.name}</h2>
                    <p class="legendary-title">${encounter.title}</p>
                    <button class="close-btn" onclick="this.closest('.encounter-modal').remove()">×</button>
                </div>
                <div class="legendary-dialogue">
                    <div class="legendary-text">
                        <p>${encounter.dialogue.greeting}</p>
                        <p class="quest-question">${encounter.quest.question}</p>
                    </div>
                    <div class="quest-answer-section">
                        <input type="text" id="quest-answer" placeholder="Your answer..." class="quest-input">
                        <button onclick="window.encounterSystem.submitQuestAnswer('heavy')" class="quest-submit-btn">Submit Answer</button>
                    </div>
                    <div class="quest-hints">
                        <button onclick="window.encounterSystem.showQuestHint('heavy')" class="hint-btn">Need a hint?</button>
                        <div id="hint-display" class="hint-display hidden"></div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        this.currentLegendaryEncounter = encounter;
        this.currentHintIndex = 0;
    }

    submitQuestAnswer(encounterName) {
        const answerInput = document.getElementById('quest-answer');
        const answer = answerInput.value.toLowerCase().trim();
        
        // Try both exact name and lowercase lookup
        let encounter = this.legendaryEncounters[encounterName.toLowerCase()];
        if (!encounter) {
            encounter = this.legendaryEncounters[encounterName];
        }
        
        if (!encounter) {
            console.error('Encounter not found:', encounterName);
            console.log('Available encounters:', Object.keys(this.legendaryEncounters));
            return;
        }

        const isCorrect = answer === encounter.quest.correctAnswer.toLowerCase();
        
        if (isCorrect) {
            this.handleCorrectAnswer(encounter);
        } else {
            this.handleIncorrectAnswer(encounter);
        }
    }

    handleCorrectAnswer(encounter) {
        const modal = document.getElementById('legendary-modal');
        const dialogueDiv = modal.querySelector('.legendary-dialogue');
        
        dialogueDiv.innerHTML = `
            <div class="legendary-text success">
                <p>${encounter.dialogue.correct}</p>
                <p>${encounter.dialogue.farewell}</p>
            </div>
            <div class="quest-rewards">
                <h3>🌟 Rewards Earned:</h3>
                <p>+${encounter.quest.rewards.experience} Experience</p>
                <p>+${encounter.quest.rewards.items.join(', ')}</p>
                <p>Title: ${encounter.quest.rewards.title}</p>
            </div>
            <button onclick="this.closest('.encounter-modal').remove()" class="quest-close-btn">Continue Your Journey</button>
        `;

        // Apply rewards
        this.playerStats.experience += encounter.quest.rewards.experience;
        
        // Add items to inventory (if item system is available)
        if (this.itemSystem) {
            encounter.quest.rewards.items.forEach(item => {
                this.itemSystem.addToInventory(item, 1);
            });
        }

        // Update UI
        this.updateHealthBars();
        
        // Create celebration effects
        if (window.cosmicEffects) {
            const screenX = window.innerWidth / 2;
            const screenY = window.innerHeight / 2;
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    window.cosmicEffects.createEnergyBurst(
                        screenX + (Math.random() - 0.5) * 200,
                        screenY + (Math.random() - 0.5) * 200,
                        1.0
                    );
                }, i * 200);
            }
        }

        console.log('⚡ Quest completed successfully!');
    }

    handleIncorrectAnswer(encounter) {
        const modal = document.getElementById('legendary-modal');
        const dialogueDiv = modal.querySelector('.legendary-dialogue');
        
        dialogueDiv.innerHTML = `
            <div class="legendary-text incorrect">
                <p>${encounter.dialogue.incorrect}</p>
                <p>The cosmic guardian fades away, but you sense they will return when you are ready...</p>
            </div>
            <button onclick="this.closest('.encounter-modal').remove()" class="quest-close-btn">Continue Your Journey</button>
        `;

        console.log('⚡ Quest answer was incorrect');
    }

    showQuestHint(encounterName) {
        // Try both exact name and lowercase lookup
        let encounter = this.legendaryEncounters[encounterName.toLowerCase()];
        if (!encounter) {
            encounter = this.legendaryEncounters[encounterName];
        }
        
        if (!encounter) {
            console.error('Encounter not found for hint:', encounterName);
            console.log('Available encounters:', Object.keys(this.legendaryEncounters));
            return;
        }
        
        const hintDisplay = document.getElementById('hint-display');
        if (!hintDisplay) {
            console.error('Hint display element not found');
            return;
        }
        
        if (this.currentHintIndex < encounter.quest.hints.length) {
            const hint = encounter.quest.hints[this.currentHintIndex];
            hintDisplay.innerHTML = `<p class="hint-text">💡 Hint: ${hint}</p>`;
            hintDisplay.classList.remove('hidden');
            this.currentHintIndex++;
        } else {
            hintDisplay.innerHTML = `<p class="hint-text">No more hints available. Trust your cosmic intuition!</p>`;
        }
    }

    checkProximityWarnings(playerPos) {
        let closestDistance = Infinity;
        let closestType = '';
        
        // Check monsters
        if (window.eldritchApp.systems.mapEngine.monsters) {
            window.eldritchApp.systems.mapEngine.monsters.forEach(monster => {
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    monster.lat, monster.lng
                );
                if (distance < closestDistance && distance < 100) {
                    closestDistance = distance;
                    closestType = 'monster';
                }
            });
        }
        
        // Check POIs
        if (window.eldritchApp.systems.mapEngine.pointsOfInterest) {
            window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach(poi => {
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    poi.getLatLng().lat, poi.getLatLng().lng
                );
                if (distance < closestDistance && distance < 100) {
                    closestDistance = distance;
                    closestType = 'poi';
                }
            });
        }
        
        // Check mystery zones
        if (window.eldritchApp.systems.mapEngine.mysteryZoneMarkers) {
            window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.forEach(mystery => {
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    mystery.getLatLng().lat, mystery.getLatLng().lng
                );
                if (distance < closestDistance && distance < 100) {
                    closestDistance = distance;
                    closestType = 'mystery';
                }
            });
        }
        
        // Check test quest markers
        if (window.eldritchApp.systems.mapEngine.testQuestMarkers) {
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach(questMarker => {
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    questMarker.getLatLng().lat, questMarker.getLatLng().lng
                );
                if (distance < closestDistance && distance < 100) {
                    closestDistance = distance;
                    closestType = 'quest';
                }
            });
        }
        
        // Show proximity warning if close
        if (closestDistance < 300 && closestDistance > 200) {
            this.showProximityWarning(closestType, Math.round(closestDistance));
        } else if (closestDistance >= 300) {
            this.hideProximityWarning();
        }
    }

    showProximityWarning(type, distance) {
        let warning = document.getElementById('proximity-warning');
        if (!warning) {
            warning = document.createElement('div');
            warning.id = 'proximity-warning';
            warning.className = 'proximity-warning';
            document.body.appendChild(warning);
        }
        
        const typeEmoji = type === 'monster' ? '👹' : type === 'poi' ? '💎' : type === 'quest' ? '🎯' : '🔍';
        warning.innerHTML = `${typeEmoji} ${type.toUpperCase()} nearby! ${distance}m away`;
        warning.classList.remove('hidden');
    }

    hideProximityWarning() {
        const warning = document.getElementById('proximity-warning');
        if (warning) {
            warning.classList.add('hidden');
        }
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

    // Debug method to show proximity information
    debugProximityInfo(playerPos) {
        if (!this.debugMode) return;
        
        console.log(`🎯 Player position: ${playerPos.lat.toFixed(6)}, ${playerPos.lng.toFixed(6)}`);
        
        // Check test quest markers
        if (window.eldritchApp?.systems?.mapEngine?.testQuestMarkers) {
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach((questMarker, index) => {
                const questPos = questMarker.getLatLng();
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    questPos.lat, questPos.lng
                );
                console.log(`🎯 Quest marker ${index + 1}: ${distance.toFixed(2)}m away (encountered: ${questMarker.encountered})`);
            });
        }
        
        // Check POI markers
        if (window.eldritchApp?.systems?.mapEngine?.pointsOfInterest) {
            window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach((poi, index) => {
                const poiPos = poi.getLatLng();
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    poiPos.lat, poiPos.lng
                );
                console.log(`💎 POI ${index + 1}: ${distance.toFixed(2)}m away (encountered: ${poi.encountered})`);
            });
        }
    }

    // Method to reset all encounter flags for testing
    resetEncounterFlags() {
        console.log('🔄 Resetting all encounter flags...');
        
        // Reset test quest markers
        if (window.eldritchApp?.systems?.mapEngine?.testQuestMarkers) {
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach(questMarker => {
                questMarker.encountered = false;
            });
        }
        
        // Reset POI markers
        if (window.eldritchApp?.systems?.mapEngine?.pointsOfInterest) {
            window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach(poi => {
                poi.encountered = false;
            });
        }
        
        // Reset monster markers
        if (window.eldritchApp?.systems?.mapEngine?.monsters) {
            window.eldritchApp.systems.mapEngine.monsters.forEach(monster => {
                monster.encountered = false;
            });
        }
        
        // Reset mystery zone markers
        if (window.eldritchApp?.systems?.mapEngine?.mysteryZoneMarkers) {
            window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.forEach(mystery => {
                mystery.encountered = false;
            });
        }
        
        console.log('🔄 All encounter flags reset!');
    }

    // Toggle debug mode for proximity detection
    toggleDebugMode() {
        this.debugMode = !this.debugMode;
        console.log(`🎯 Proximity debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
    }

    // Add visual proximity indicators to markers
    addProximityIndicators(playerPos) {
        if (!window.eldritchApp?.systems?.mapEngine?.map) return;

        // Check test quest markers
        if (window.eldritchApp.systems.mapEngine.testQuestMarkers) {
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach((questMarker, index) => {
                const questPos = questMarker.getLatLng();
                const distance = this.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    questPos.lat, questPos.lng
                );
                
                // Add proximity ring if close but not encountered
                if (distance < 100 && !questMarker.encountered) {
                    this.addProximityRing(questPos, 'quest', distance);
                }
            });
        }
    }

    // Add proximity ring around marker
    addProximityRing(position, type, distance) {
        if (!window.eldritchApp?.systems?.mapEngine?.map) return;

        const ringId = `proximity-ring-${type}-${position.lat}-${position.lng}`;
        
        // Remove existing ring
        const existingRing = document.getElementById(ringId);
        if (existingRing) {
            existingRing.remove();
        }

        // Create proximity ring
        const ring = L.circle([position.lat, position.lng], {
            radius: 25, // 25m radius
            color: '#ffaa00',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.1,
            dashArray: '10, 5',
            interactive: false
        });

        ring.addTo(window.eldritchApp.systems.mapEngine.map);
        
        // Auto-remove after 2 seconds
        setTimeout(() => {
            if (window.eldritchApp?.systems?.mapEngine?.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(ring);
            }
        }, 2000);
    }

    startMonsterEncounter(monster) {
        console.log('👹 Monster encounter started:', monster.type.name);
        
        // Trigger distortion effects for monster encounters
        this.triggerDistortionEffects();
        
        this.activeEncounter = {
            type: this.encounterTypes.MONSTER,
            data: monster,
            battleState: {
                playerHealth: 100,
                monsterHealth: 100,
                playerDefending: false
            }
        };
        
        // Use the new dice combat system
        this.startDiceCombat(monster);
    }

    startPOIEncounter(poi) {
        console.log('🗺️ POI encounter started');
        
        this.activeEncounter = {
            type: this.encounterTypes.POI,
            data: poi
        };
        
        this.showEncounterModal();
        this.showPOICutscene(poi);
    }

    // Mystery encounters removed as requested
    
    startQuestEncounter(questMarker) {
        console.log('🐙 Starting quest encounter for marker:', questMarker.questIndex);
        
        if (window.lovecraftianQuest) {
            // Start quest from the specific location
            window.lovecraftianQuest.startQuestFromLocation(questMarker.questIndex);
        } else {
            console.error('🐙 Lovecraftian quest system not available');
        }
    }

    startTestQuestEncounter(questMarker) {
        console.log('🎯 Test quest encounter started:', questMarker.questName);
        
        this.activeEncounter = {
            type: 'testQuest',
            data: questMarker,
            startTime: Date.now()
        };
        
        this.showEncounterModal();
        this.showTestQuestCutscene(questMarker);
    }
    
    startQuestMarkerEncounter(questMarker, markerKey) {
        console.log('🎭 Quest marker encounter started:', markerKey);
        
        this.activeEncounter = {
            type: 'questMarker',
            data: questMarker,
            markerKey: markerKey,
            startTime: Date.now()
        };
        
        this.showEncounterModal();
        this.showQuestMarkerCutscene(questMarker, markerKey);
    }

    showMonsterCutscene(monster) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        const battle = document.getElementById('battle-interface');
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>⚠️ Monster Encounter!</h3>
                <p>A <strong>${monster.type.name}</strong> blocks your path!</p>
                <p>${monster.type.emoji} The creature looks dangerous and ready to fight.</p>
                <p>What will you do?</p>
            </div>
        `;
        
        actions.innerHTML = `
            <button id="action-1" class="encounter-btn">Fight</button>
            <button id="action-2" class="encounter-btn">Try to Flee</button>
            <button id="action-3" class="encounter-btn">Observe</button>
        `;
        
        battle.classList.add('hidden');
        
        // Debug: Check if buttons are visible
        console.log('🎭 Encounter buttons created:', {
            action1: document.getElementById('action-1'),
            action2: document.getElementById('action-2'),
            action3: document.getElementById('action-3'),
            actionsElement: actions
        });
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.startBattle(monster));
        document.getElementById('action-2').addEventListener('click', () => this.attemptFlee(monster));
        document.getElementById('action-3').addEventListener('click', () => this.observeMonster(monster));
    }

    showPOICutscene(poi) {
        console.log('🎭 Showing POI cutscene for:', poi);
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        const puzzle = document.getElementById('puzzle-interface');
        
        if (!dialog || !actions) {
            console.error('🎭 Missing dialog elements:', { dialog: !!dialog, actions: !!actions });
            return;
        }
        
        // Extract POI info from popup content
        const poiName = poi.getPopup().getContent().match(/<b>(.*?)<\/b>/)?.[1] || 'Mysterious Location';
        const poiRarity = poi.getPopup().getContent().match(/Rarity: (.*?)</)?.[1] || 'Unknown';
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>🗺️ Point of Interest Discovered!</h3>
                <p>You've found <strong>${poiName}</strong></p>
                <p>Rarity: <span style="color: #ffd700;">${poiRarity}</span></p>
                <p>This location seems to hold ancient secrets. Will you investigate?</p>
            </div>
        `;
        
        actions.innerHTML = `
            <button id="action-1" class="encounter-btn">Investigate</button>
            <button id="action-2" class="encounter-btn">Take a Sample</button>
            <button id="action-3" class="encounter-btn">Leave</button>
        `;
        
        puzzle.classList.add('hidden');
        
        // Debug: Check if POI buttons are visible
        console.log('🎭 POI Encounter buttons created:', {
            action1: document.getElementById('action-1'),
            action2: document.getElementById('action-2'),
            action3: document.getElementById('action-3'),
            actionsElement: actions
        });
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.startPOIPuzzle(poi));
        document.getElementById('action-2').addEventListener('click', () => this.samplePOI(poi));
        document.getElementById('action-3').addEventListener('click', () => this.leavePOI(poi));
    }

    // Mystery cutscene removed as requested

    showTestQuestCutscene(questMarker) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>🎯 ${questMarker.questName}</h3>
                <p>${questMarker.questType === 'mystery' ? 'A strange forest where reality seems to bend...' : 
                   questMarker.questType === 'poi' ? 'Crumbling stones that whisper of forgotten times...' : 
                   'A swirling vortex of otherworldly energy...'}</p>
                <p>You've discovered a ${questMarker.questType} location! What will you do?</p>
            </div>
        `;
        
        actions.innerHTML = `
            <button id="action-1" class="encounter-btn">Investigate</button>
            <button id="action-2" class="encounter-btn">Study</button>
            <button id="action-3" class="encounter-btn">Leave</button>
        `;
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.investigateTestQuest(questMarker));
        document.getElementById('action-2').addEventListener('click', () => this.studyTestQuest(questMarker));
        document.getElementById('action-3').addEventListener('click', () => this.leaveTestQuest(questMarker));
    }
    
    showQuestMarkerCutscene(questMarker, markerKey) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        const battle = document.getElementById('battle-interface');
        
        // Determine marker type and content
        let markerInfo = {
            title: 'Quest Objective',
            description: 'A quest marker awaits your interaction.',
            symbol: '🎯',
            color: '#ffd700'
        };
        
        if (markerKey === 'aurora') {
            markerInfo = {
                title: '👑 Aurora - The Cosmic Entity',
                description: 'A mysterious cosmic entity that offers quests and guidance.',
                symbol: '👑',
                color: '#ffd700'
            };
        } else if (questMarker.objective) {
            markerInfo = {
                title: questMarker.objective.name || 'Quest Objective',
                description: questMarker.objective.description || 'Complete this quest objective.',
                symbol: '🎯',
                color: '#4ecdc4'
            };
        }
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>${markerInfo.symbol} ${markerInfo.title}</h3>
                <p>${markerInfo.description}</p>
                <p>You've discovered a quest location! What will you do?</p>
            </div>
        `;
        
        actions.innerHTML = `
            <button id="action-1" class="encounter-btn">Interact</button>
            <button id="action-2" class="encounter-btn">Observe</button>
            <button id="action-3" class="encounter-btn">Leave</button>
        `;
        
        battle.classList.add('hidden');
        
        // Add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.interactWithQuestMarker(questMarker, markerKey));
        document.getElementById('action-2').addEventListener('click', () => this.observeQuestMarker(questMarker, markerKey));
        document.getElementById('action-3').addEventListener('click', () => this.leaveQuestMarker(questMarker, markerKey));
    }
    
    interactWithQuestMarker(questMarker, markerKey) {
        console.log('🎭 Interacting with quest marker:', markerKey);
        
        // Close encounter modal
        this.closeEncounterModal();
        
        // Trigger quest system interaction
        if (window.unifiedQuestSystem) {
            if (markerKey === 'aurora') {
                window.unifiedQuestSystem.interactWithAurora();
            } else {
                // Find the objective ID from the marker
                const objectiveId = questMarker.objective?.id || markerKey.split('_').pop();
                if (objectiveId) {
                    window.unifiedQuestSystem.interactWithObjective(objectiveId);
                }
            }
        }
        
        // Award experience for interaction
        this.awardExperience(10);
        this.updatePlayerStats({ experience: 10 });
    }
    
    observeQuestMarker(questMarker, markerKey) {
        console.log('🎭 Observing quest marker:', markerKey);
        
        // Show observation dialog
        const dialog = document.getElementById('dialog-text');
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>🔍 Observation</h3>
                <p>You carefully study the quest marker...</p>
                <p>${markerKey === 'aurora' ? 
                    'The cosmic entity seems to pulse with otherworldly energy. You sense great power and ancient wisdom.' :
                    'The marker appears to be a point of interest for an ongoing quest. It radiates a faint magical aura.'}</p>
                <p>You gain insight into the area's significance.</p>
            </div>
        `;
        
        // Award small experience for observation
        this.awardExperience(5);
        this.updatePlayerStats({ experience: 5 });
        
        // Close after a delay
        setTimeout(() => {
            this.closeEncounterModal();
        }, 3000);
    }
    
    leaveQuestMarker(questMarker, markerKey) {
        console.log('🎭 Leaving quest marker:', markerKey);
        this.closeEncounterModal();
    }

    startBattle(monster) {
        
        const battle = document.getElementById('battle-interface');
        const actions = document.getElementById('encounter-actions');
        
        battle.classList.remove('hidden');
        actions.classList.add('hidden');
        
        // Update battle UI
        document.getElementById('monster-name').textContent = monster.type.name;
        document.getElementById('monster-health').textContent = `${this.activeEncounter.battleState.monsterHealth}/100`;
        document.getElementById('player-health').textContent = `${this.activeEncounter.battleState.playerHealth}/100`;
    }

    battleAction(action) {
        const battleState = this.activeEncounter.battleState;
        
        switch(action) {
            case 'attack':
                const damage = Math.floor(Math.random() * 20) + 10;
                battleState.monsterHealth -= damage;
                document.getElementById('monster-health').textContent = `${battleState.monsterHealth}/100`;
                
                // Moral nudge: each attack has consequences
                try { window.moralChoiceSystem?.updateAlignment?.({ ethical: -1, cosmic: +1 }); } catch (_) {}
                try { window.statistics?.logEvent?.('battle_attack', { damage, monster: this.activeEncounter?.monster?.type?.name || 'Unknown' }); } catch (_) {}
                
                if (battleState.monsterHealth <= 0) {
                    this.winBattle();
                    return;
                }
                
                // Monster counter-attack
                this.monsterAttack();
                break;
                
            case 'defend':
                battleState.playerDefending = true;
                // Moral nudge: defense shows wisdom
                try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +1, ethical: +1 }); } catch (_) {}
                try { window.statistics?.logEvent?.('battle_defend', { monster: this.activeEncounter?.monster?.type?.name || 'Unknown' }); } catch (_) {}
                this.showDialog('You brace for impact! The creature\'s eyes seem to respect your caution.');
                break;
                
            case 'flee':
                this.fleeBattle();
                break;
        }
        
    }

    monsterAttack() {
        const battleState = this.activeEncounter.battleState;
        const damage = battleState.playerDefending ? 
            Math.floor(Math.random() * 10) + 5 : 
            Math.floor(Math.random() * 15) + 10;
            
        battleState.playerHealth -= damage;
        battleState.playerDefending = false;
        
        document.getElementById('player-health').textContent = `${battleState.playerHealth}/100`;
        
        // Show different feedback based on defense
        if (battleState.playerDefending) {
            this.showDialog(`The creature strikes! Your defense reduces the damage to ${damage}.`);
        } else {
            this.showDialog(`The creature strikes for ${damage} damage! You feel the cosmic energy drain from your body.`);
        }
        
        if (battleState.playerHealth <= 0) {
            this.loseBattle();
        }
    }

    winBattle() {
        // Moral nudge: violence has consequences
        try { window.moralChoiceSystem?.updateAlignment?.({ ethical: -5, cosmic: +3 }); } catch (_) {}
        try { window.statistics?.logEvent?.('battle_victory', { monster: this.activeEncounter?.monster?.type?.name || 'Unknown' }); } catch (_) {}
        this.showDialog(`Victory! The creature's final breath sounds almost... human. You feel a strange emptiness.`);
        this.closeEncounter();
    }

    loseBattle() {
        // Moral nudge: defeat teaches humility
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +2, cosmic: -1 }); } catch (_) {}
        try { window.statistics?.logEvent?.('battle_defeat', { monster: this.activeEncounter?.monster?.type?.name || 'Unknown' }); } catch (_) {}
        this.showDialog('Defeat! As darkness claims you, you hear a voice whisper: "Perhaps violence was not the answer..."');
        this.closeEncounter();
    }

    fleeBattle() {
        // Moral nudge: flight can be wise
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +3, ethical: +1 }); } catch (_) {}
        try { window.statistics?.logEvent?.('battle_flee', { monster: this.activeEncounter?.monster?.type?.name || 'Unknown' }); } catch (_) {}
        this.showDialog('You flee! Behind you, the creature makes a sound that might be laughter. Or relief.');
        this.closeEncounter();
    }

    startPOIPuzzle(poi) {
        
        const puzzle = document.getElementById('puzzle-interface');
        const actions = document.getElementById('encounter-actions');
        
        puzzle.classList.remove('hidden');
        actions.classList.add('hidden');
        
        this.generatePuzzle(poi);
    }

    generatePuzzle(poi) {
        const puzzleContent = document.getElementById('puzzle-content');
        const puzzleTitle = document.getElementById('puzzle-title');
        
        // Simple number sequence puzzle
        const sequence = [2, 4, 8, 16, 32];
        const answer = sequence[sequence.length - 1] * 2; // 64
        
        puzzleTitle.textContent = 'Number Sequence Puzzle';
        puzzleContent.innerHTML = `
            <p>Complete the sequence:</p>
            <div class="sequence">${sequence.join(', ')}</div>
            <input type="number" id="puzzle-answer" placeholder="Next number?">
            <div id="puzzle-feedback"></div>
        `;
        
        this.puzzleAnswer = answer;
    }

    submitPuzzle() {
        const answer = parseInt(document.getElementById('puzzle-answer').value);
        const feedback = document.getElementById('puzzle-feedback');
        
        if (answer === this.puzzleAnswer) {
            feedback.innerHTML = '<span style="color: green;">Correct! The cosmic patterns align!</span>';
            this.giveReward('discoveries', 'Ancient Knowledge');
            // Moral nudge: solving puzzles increases wisdom
            try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +5, cosmic: +2 }); } catch (_) {}
            try { window.statistics?.logEvent?.('puzzle_solve', { answer, correct: true }); } catch (_) {}
            
            setTimeout(() => {
                this.showDialog(`Puzzle solved! Ancient knowledge floods your mind like starlight. You feel... different.`);
                this.closeEncounter();
            }, 2000);
        } else {
            // Moral nudge: failure teaches patience
            try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +1 }); } catch (_) {}
            try { window.statistics?.logEvent?.('puzzle_fail', { answer, correct: false }); } catch (_) {}
            feedback.innerHTML = '<span style="color: red;">Incorrect. The cosmic patterns mock your attempt. Try again!</span>';
        }
    }

    skipPuzzle() {
        // Moral nudge: skipping can be wise restraint
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +1, ethical: +1 }); } catch (_) {}
        try { window.statistics?.logEvent?.('puzzle_skip', {}); } catch (_) {}
        this.showDialog('You skip the puzzle. Sometimes the greatest wisdom is knowing when not to know.');
        this.closeEncounter();
    }

    // Action handlers
    handleAction(actionNum) {
        // This will be handled by specific encounter types
    }

    attemptFlee(monster) {
        const success = Math.random() < 0.7; // 70% chance
        
        if (success) {
            this.showDialog('You successfully fled from the monster!');
        } else {
            this.showDialog('The monster caught you! You must fight!');
            this.startBattle(monster);
        }
    }

    observeMonster(monster) {
        this.showDialog(`You observe the ${monster.type.name}. It seems ${monster.type.speed > 0.0001 ? 'agile' : 'slow'} and ${monster.type.color === '#4B0082' ? 'mysterious' : 'powerful'}.`);
        this.closeEncounter();
    }

    samplePOI(poi) {
        this.giveReward('items', 'Mysterious Sample');
        // Moral nudge: harvesting samples might be ethically gray
        try { window.moralChoiceSystem?.updateAlignment?.({ ethical: -2, wisdom: +1 }); } catch (_) {}
        try {
            const html = poi.getPopup().getContent();
            const nameMatch = /<b>(.*?)<\/b>/.exec(html);
            const name = nameMatch ? nameMatch[1] : 'Unknown';
            window.statistics?.logEvent?.('poi_sample', { name });
        } catch (_) {}
        this.showDialog(`You collected a sample. The air tastes like copper.`);
        this.closeEncounter();
    }

    leavePOI(poi) {
        // Moral nudge: restraint can be wise
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +1 }); } catch (_) {}
        try {
            const html = poi.getPopup().getContent();
            const nameMatch = /<b>(.*?)<\/b>/.exec(html);
            const name = nameMatch ? nameMatch[1] : 'Unknown';
            window.statistics?.logEvent?.('poi_leave', { name });
        } catch (_) {}
        this.showDialog('You leave the location untouched. Somewhere far away, something exhales.');
        this.closeEncounter();
    }

    // Mystery encounter actions removed as requested

    investigateTestQuest(questMarker) {
        this.giveReward('experience', 40);
        this.giveReward('discoveries', `${questMarker.questName} Knowledge`);
        
        // Show moral choice inline instead of overlay
        this.showMoralChoiceInDialog({
            title: "The Corroding Lake",
            description: `"The air itself burns with toxic vapors!" You cough violently as you approach the fuming lake. The water shimmers with an unnatural green glow, and strange bubbles rise from its depths. The very ground around the lake is cracked and withered, as if life itself is being drained away. "You must choose quickly - the fumes are growing stronger!" Your vision begins to blur as the toxic air takes its toll.`,
            choices: [
                {
                    text: "Swim Through the Toxins",
                    description: "Dive into the lake and swim to safety. (Risk: -25 Health, -10 Sanity)",
                    color: "#4b0082",
                    color2: "#8a2be2",
                    borderColor: "#ff00ff",
                    textColor: "#ffffff",
                    icon: "🏊"
                },
                {
                    text: "Run Around the Lake", 
                    description: "Take the long way around, but the fumes are spreading. (Risk: -15 Sanity)",
                    color: "#ff8c00",
                    color2: "#ff4500",
                    borderColor: "#ffaa00",
                    textColor: "#ffffff",
                    icon: "🏃"
                },
                {
                    text: "Accept Your Fate",
                    description: "Stand still and let the toxins take you. (Instant Death)",
                    color: "#8b0000",
                    color2: "#dc143c",
                    borderColor: "#ff0000",
                    textColor: "#ffffff",
                    icon: "💀"
                }
            ],
            onChoice: (index, choice, alignment) => {
                this.handleMoralChoice(index, choice, alignment, questMarker);
            }
        });
    }

    studyTestQuest(questMarker) {
        this.giveReward('experience', 25);
        // Moral nudge: study is patient wisdom
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +6, cosmic: +1 }); } catch (_) {}
        try { window.statistics?.logEvent?.('quest_study', { quest: questMarker.questName }); } catch (_) {}
        this.showDialog(`You study ${questMarker.questName}. The patterns reveal themselves slowly, like a cosmic dance.`);
        this.closeEncounter();
    }

    leaveTestQuest(questMarker) {
        // Moral nudge: leaving can be wise restraint
        try { window.moralChoiceSystem?.updateAlignment?.({ wisdom: +2, ethical: +2 }); } catch (_) {}
        try { window.statistics?.logEvent?.('quest_leave', { quest: questMarker.questName }); } catch (_) {}
        this.showDialog(`You leave ${questMarker.questName}. Sometimes the greatest wisdom is knowing when to walk away.`);
        this.closeEncounter();
    }

    // Show moral choice inline within the encounter dialog
    showMoralChoiceInDialog(choiceData) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        
        const { title, description, choices } = choiceData;
        
        dialog.innerHTML = `
            <div class="moral-choice-dialog">
                <h3 style="color: var(--cosmic-purple); margin-bottom: 15px;">⚖️ ${title}</h3>
                <div style="margin-bottom: 20px; line-height: 1.6; color: var(--cosmic-light);">
                    ${description}
                </div>
                <div style="margin-bottom: 15px; font-weight: bold; color: var(--cosmic-purple);">
                    Choose your response:
                </div>
            </div>
        `;
        
        actions.innerHTML = choices.map((choice, index) => `
            <button class="moral-choice-btn encounter-btn" data-choice-index="${index}" style="
                background: linear-gradient(45deg, ${choice.color}, ${choice.color2});
                border: 2px solid ${choice.borderColor};
                color: ${choice.textColor};
                padding: 12px 16px;
                border-radius: 8px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.2s ease;
                margin-bottom: 8px;
                width: 100%;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 10px;
            ">
                <span style="font-size: 18px;">${choice.icon}</span>
                <div>
                    <div style="font-size: 14px; font-weight: bold;">${choice.text}</div>
                    <div style="font-size: 12px; opacity: 0.9; margin-top: 2px;">${choice.description}</div>
                </div>
            </button>
        `).join('');
        
        // Add event listeners to moral choice buttons
        actions.querySelectorAll('.moral-choice-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.currentTarget || e.target.closest('.moral-choice-btn');
                const choiceIndex = parseInt(target?.dataset?.choiceIndex);
                if (!isNaN(choiceIndex) && choiceIndex >= 0 && choiceIndex < choices.length) {
                    this.handleMoralChoice(choiceIndex, choices[choiceIndex], choiceData.onChoice, questMarker);
                }
            });
            
            // Hover effects
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.02)';
                btn.style.boxShadow = '0 0 15px rgba(255, 0, 255, 0.3)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
                btn.style.boxShadow = 'none';
            });
        });
    }

    // Handle moral choice selection
    handleMoralChoice(choiceIndex, choice, onChoice, questMarker) {
        console.log('⚖️ Moral choice selected:', choice.text);
        
        // Update alignment based on choice
        let alignmentChanges = {};
        switch(choiceIndex) {
            case 0: // Swim Through Toxins
                alignmentChanges = { cosmic: +5, ethical: -2, wisdom: -1 };
                this.playerStats.health = Math.max(0, this.playerStats.health - 25);
                this.playerStats.sanity = Math.max(0, this.playerStats.sanity - 10);
                break;
            case 1: // Run Around Lake
                alignmentChanges = { cosmic: -1, ethical: +3, wisdom: +2 };
                this.playerStats.sanity = Math.max(0, this.playerStats.sanity - 15);
                break;
            case 2: // Accept Fate
                alignmentChanges = { cosmic: -10, ethical: -5, wisdom: -5 };
                this.playerStats.health = 0;
                this.playerStats.isDead = true;
                this.playerStats.deathReason = "Toxic Lake";
                break;
        }
        
        // Apply alignment changes
        if (window.moralChoiceSystem) {
            window.moralChoiceSystem.updateAlignment(alignmentChanges);
        }
        
        // Update stat bars
        this.updateStatBars();
        
        // Show result
        let resultText = '';
        switch(choiceIndex) {
            case 0:
                resultText = `You dive into the toxic lake! The water burns your skin, but you emerge on the other side. Your health and sanity have been reduced, but you've gained cosmic knowledge.`;
                break;
            case 1:
                resultText = `You wisely choose to go around the lake. The fumes still affect you, but you avoid the worst of the toxins. Your patience and wisdom have increased.`;
                break;
            case 2:
                resultText = `You stand still and let the toxins take you. Your cosmic journey ends here...`;
                break;
        }
        
        this.showDialog(resultText);
        
        // Call the original choice callback if provided
        if (onChoice) {
            onChoice(choiceIndex, choice, alignmentChanges);
        }
        
        // Close encounter after a delay
        setTimeout(() => {
            this.closeEncounter();
        }, 3000);
    }


    // Handle position updates from geolocation system
    handlePositionUpdate(position) {
        if (!position || !position.coords) return;
        
        const currentPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        
        if (this.lastPosition) {
            const distance = this.calculateDistance(
                this.lastPosition.lat, this.lastPosition.lng,
                currentPos.lat, currentPos.lng
            );
            
            // Gain steps based on distance moved
            if (distance > 10) { // Only count significant movement
                const stepsGained = Math.floor(distance / 100); // 1 step per 100 meters
                if (stepsGained > 0) {
                    this.addSteps(stepsGained);
                    console.log(`👣 Moved ${distance.toFixed(1)}m, gained ${stepsGained} steps`);
                }
            }
        }
        
        this.lastPosition = currentPos;
    }

    // Calculate distance between two points (in meters)
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }


    updateStepCounter() {
        // Sync with player stats and check for death
        this.playerStats.steps = this.playerSteps;
        this.checkPlayerDeath();
        this.updateStatBars();
    }

    // Update visual stat bars with animations
    updateStatBars() {
        this.updateHealthBar();
        this.updateSanityBar();
        this.updateStepsDisplay();
    }

    updateHealthBar() {
        const healthFill = document.getElementById('health-fill');
        const healthValue = document.getElementById('health-value');
        const healthExplanation = document.getElementById('health-explanation');
        
        if (!healthFill || !healthValue || !healthExplanation) return;

        const healthPercent = (this.playerStats.health / this.playerStats.maxHealth) * 100;
        const healthPercentRounded = Math.round(healthPercent);
        
        // Update bar width with smooth animation
        healthFill.style.width = `${healthPercentRounded}%`;
        healthValue.textContent = `${this.playerStats.health}/${this.playerStats.maxHealth}`;
        
        // Update visual state based on health level
        healthFill.classList.remove('low-health');
        if (healthPercent <= 25) {
            healthFill.classList.add('low-health');
            healthExplanation.textContent = 'Critical Health!';
        } else if (healthPercent <= 50) {
            healthExplanation.textContent = 'Low Health';
        } else if (healthPercent <= 75) {
            healthExplanation.textContent = 'Good Health';
        } else {
            healthExplanation.textContent = 'Perfect Health';
        }
    }

    updateSanityBar() {
        const sanityFill = document.getElementById('sanity-fill');
        const sanityValue = document.getElementById('sanity-value');
        const sanityExplanation = document.getElementById('sanity-explanation');
        
        if (!sanityFill || !sanityValue || !sanityExplanation) return;

        const sanityPercent = (this.playerStats.sanity / this.playerStats.maxSanity) * 100;
        const sanityPercentRounded = Math.round(sanityPercent);
        
        // Update bar width with smooth animation
        sanityFill.style.width = `${sanityPercentRounded}%`;
        sanityValue.textContent = `${this.playerStats.sanity}/${this.playerStats.maxSanity}`;
        
        // Update visual state based on sanity level
        sanityFill.classList.remove('low-sanity', 'critical-sanity');
        if (sanityPercent <= 15) {
            sanityFill.classList.add('critical-sanity');
            sanityExplanation.textContent = 'Reality Breaking!';
        } else if (sanityPercent <= 30) {
            sanityFill.classList.add('low-sanity');
            sanityExplanation.textContent = 'Sanity Failing';
        } else if (sanityPercent <= 60) {
            sanityExplanation.textContent = 'Stable Mind';
        } else {
            sanityExplanation.textContent = 'Perfect Sanity';
        }
    }

    updateStepsDisplay() {
        const stepsValue = document.getElementById('steps-value');
        const stepsExplanation = document.getElementById('steps-explanation');
        
        if (!stepsValue || !stepsExplanation) return;

        stepsValue.textContent = this.playerSteps;
        
        // Update explanation based on steps
        if (this.playerSteps >= 1000) {
            stepsExplanation.textContent = 'Cosmic Master';
        } else if (this.playerSteps >= 500) {
            stepsExplanation.textContent = 'Cosmic Explorer';
        } else if (this.playerSteps >= 100) {
            stepsExplanation.textContent = 'Cosmic Energy';
        } else {
            stepsExplanation.textContent = 'Cosmic Energy';
        }
    }

    // Experience and Leveling System
    gainExperience(amount, reason = "Cosmic knowledge gained") {
        this.playerStats.experience += amount;
        console.log(`⭐ Experience gained: ${amount}. Reason: ${reason}`);
        
        // Check for level up
        this.checkLevelUp();
        this.updateStatBars();
    }

    checkLevelUp() {
        const currentLevel = this.playerStats.level;
        const requiredExp = this.getRequiredExperience(currentLevel);
        
        if (this.playerStats.experience >= requiredExp) {
            this.levelUp();
        }
    }

    getRequiredExperience(level) {
        // Exponential growth: level 1 = 100 exp, level 2 = 250 exp, level 3 = 450 exp, etc.
        return Math.floor(100 * Math.pow(level, 1.5));
    }

    levelUp() {
        const oldLevel = this.playerStats.level;
        this.playerStats.level++;
        
        // Increase max health and sanity
        const healthIncrease = Math.floor(Math.random() * 10) + 5; // 5-14 points
        const sanityIncrease = Math.floor(Math.random() * 8) + 3;  // 3-10 points
        
        this.playerStats.maxHealth += healthIncrease;
        this.playerStats.maxSanity += sanityIncrease;
        
        // Restore some health and sanity
        this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + Math.floor(healthIncrease * 0.5));
        this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + Math.floor(sanityIncrease * 0.5));
        
        // Increase combat stats
        this.playerStats.attack += Math.floor(Math.random() * 3) + 1; // 1-3 points
        this.playerStats.defense += Math.floor(Math.random() * 2) + 1; // 1-2 points
        this.playerStats.luck += Math.floor(Math.random() * 2) + 1;    // 1-2 points
        
        // Show level up notification
        this.showLevelUpNotification(oldLevel, this.playerStats.level, {
            health: healthIncrease,
            sanity: sanityIncrease,
            attack: this.playerStats.attack,
            defense: this.playerStats.defense,
            luck: this.playerStats.luck
        });
        
        console.log(`🌟 Level up! ${oldLevel} → ${this.playerStats.level}`);
        console.log(`❤️ Max Health: +${healthIncrease} (${this.playerStats.maxHealth})`);
        console.log(`🧠 Max Sanity: +${sanityIncrease} (${this.playerStats.maxSanity})`);
        console.log(`⚔️ Attack: ${this.playerStats.attack}, Defense: ${this.playerStats.defense}, Luck: ${this.playerStats.luck}`);
        
        // Check for another level up
        this.checkLevelUp();
    }

    showLevelUpNotification(oldLevel, newLevel, statIncreases) {
        // Create level up notification
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-header">
                    <div class="level-up-icon">🌟</div>
                    <h3>Level Up!</h3>
                </div>
                <div class="level-up-stats">
                    <div class="level-up-stat">
                        <span class="stat-name">Level:</span>
                        <span class="stat-change">${oldLevel} → ${newLevel}</span>
                    </div>
                    <div class="level-up-stat">
                        <span class="stat-name">Max Health:</span>
                        <span class="stat-change">+${statIncreases.health}</span>
                    </div>
                    <div class="level-up-stat">
                        <span class="stat-name">Max Sanity:</span>
                        <span class="stat-change">+${statIncreases.sanity}</span>
                    </div>
                    <div class="level-up-stat">
                        <span class="stat-name">Attack:</span>
                        <span class="stat-change">${statIncreases.attack}</span>
                    </div>
                    <div class="level-up-stat">
                        <span class="stat-name">Defense:</span>
                        <span class="stat-change">${statIncreases.defense}</span>
                    </div>
                    <div class="level-up-stat">
                        <span class="stat-name">Luck:</span>
                        <span class="stat-change">${statIncreases.luck}</span>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Death mechanics - because cosmic horror is no joke... or is it?
    checkPlayerDeath() {
        if (this.playerStats.health <= 0 && !this.playerStats.isDead) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "health";
            this.handlePlayerDeath();
        } else if (this.playerStats.sanity <= 0 && !this.playerStats.isDead) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "sanity";
            this.handlePlayerDeath();
        } else if (this.playerStats.steps <= 0 && !this.playerStats.isDead) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "steps";
            this.handlePlayerDeath();
        }
    }

    handlePlayerDeath() {
        console.log('💀 Player has died:', this.playerStats.deathReason);
        
        // Show death screen
        this.showDeathScreen();
        
        // Reset player stats (but keep some progression)
        this.playerStats.health = Math.floor(this.playerStats.maxHealth * 0.5);
        this.playerStats.sanity = Math.floor(this.playerStats.maxSanity * 0.5);
        this.playerStats.steps = Math.max(0, this.playerStats.steps - 50); // Lose some steps
        this.playerStats.isDead = false;
        this.playerStats.deathReason = null;
    }

    showDeathScreen() {
        // Remove existing death modal if it exists
        const existingModal = document.getElementById('death-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const deathModal = document.createElement('div');
        deathModal.id = 'death-modal';
        deathModal.className = 'death-modal';
        
        const deathMessages = {
            health: {
                title: '💀 Physical Demise',
                icon: '💀',
                message: 'Your physical form has been consumed by the cosmic forces. The void claims another soul...',
                subtext: 'But in the cosmic realm, death is merely a transition to another state of being.'
            },
            sanity: {
                title: '🌀 Reality Collapse',
                icon: '🌀',
                message: 'Your mind has shattered under the weight of forbidden knowledge. Reality itself rejects your consciousness...',
                subtext: 'The cosmic truth was too much for mortal comprehension. You have become one with the madness.'
            },
            steps: {
                title: '⚡ Energy Depletion',
                icon: '⚡',
                message: 'You have run out of cosmic energy. Without steps, you cannot traverse the infinite realms.',
                subtext: 'The cosmic dance requires movement. Even the eldritch entities need to stretch their tentacles.'
            }
        };

        const deathData = deathMessages[this.playerStats.deathReason] || deathMessages.health;

        deathModal.innerHTML = `
            <div class="death-content">
                <div class="death-header">
                    <div class="death-icon">${deathData.icon}</div>
                    <h2>${deathData.title}</h2>
                </div>
                <div class="death-message">
                    <p>${deathData.message}</p>
                    <p class="death-subtext">${deathData.subtext}</p>
                </div>
                <div class="death-stats">
                    <div class="death-stat">
                        <span class="stat-label">Final Steps:</span>
                        <span class="stat-value">${this.playerSteps}</span>
                    </div>
                    <div class="death-stat">
                        <span class="stat-label">Final Level:</span>
                        <span class="stat-value">${this.playerStats.level}</span>
                    </div>
                    <div class="death-stat">
                        <span class="stat-label">Experience Gained:</span>
                        <span class="stat-value">${this.playerStats.experience}</span>
                    </div>
                </div>
                <div class="death-actions">
                    <button id="resurrect-btn" class="sacred-button primary">
                        🌟 Resurrect (Cost: 100 Steps)
                    </button>
                    <button id="new-game-btn" class="sacred-button secondary">
                        🌌 New Journey
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(deathModal);
        
        // Show with animation
        setTimeout(() => {
            deathModal.classList.add('show');
        }, 100);
        
        // Add event listeners
        document.getElementById('resurrect-btn').addEventListener('click', () => {
            this.resurrectPlayer();
        });
        
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.startNewGame();
        });
    }

    resurrectPlayer() {
        if (this.playerSteps >= 100) {
            this.playerSteps -= 100;
            this.playerStats.health = Math.floor(this.playerStats.maxHealth * 0.5);
            this.playerStats.sanity = Math.floor(this.playerStats.maxSanity * 0.5);
            this.playerStats.isDead = false;
            this.playerStats.deathReason = null;
            
            // Hide death modal
        const deathModal = document.getElementById('death-modal');
        if (deathModal) {
                deathModal.style.display = 'none';
                deathModal.classList.remove('show');
                setTimeout(() => deathModal.remove(), 300);
            }
            
            this.updateStatBars();
            this.showDialog('🌟 You have been resurrected! The cosmic forces grant you a second chance...');
        } else {
            this.showDialog('Not enough steps to resurrect! You need at least 100 steps.');
        }
    }

    startNewGame() {
        // Reset all player stats
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            sanity: 100,
            maxSanity: 100,
            steps: 0,
            attack: 15,
            defense: 10,
            luck: 12,
            experience: 0,
            level: 1,
            inventory: [],
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            skills: {
                combat: 1,
                diplomacy: 1,
                investigation: 1,
                survival: 1
            },
            traits: [],
            reputation: {},
            isDead: false,
            deathReason: null
        };
        
        this.playerSteps = 0;
        
        // Hide death modal
        const deathModal = document.getElementById('death-modal');
        if (deathModal) {
            deathModal.style.display = 'none';
            deathModal.classList.remove('show');
            setTimeout(() => deathModal.remove(), 300);
        }
        
        this.updateStatBars();
        this.showDialog('🌌 A new cosmic journey begins... Welcome back to the infinite realm!');
    }

    // Sanity system - because knowing too much is... problematic
    loseSanity(amount, reason = "The cosmic truth weighs heavily on your mind.") {
        this.playerStats.sanity = Math.max(0, this.playerStats.sanity - amount);
        console.log(`🧠 Sanity lost: ${amount}. Reason: ${reason}`);
        
        // Check for sanity effects
        if (this.playerStats.sanity < 30) {
            console.log('⚠️ Warning: Your sanity is dangerously low! The cosmic entities are starting to look... reasonable.');
        }
        
        // Trigger distortion effects based on sanity level
        this.triggerDistortionEffects();
        
        this.updateHealthBars();
        this.updateMobileStats();
        this.checkPlayerDeath();
    }

    gainSanity(amount, reason = "A moment of clarity in the cosmic chaos.") {
        this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + amount);
        console.log(`🧠 Sanity gained: ${amount}. Reason: ${reason}`);
        
        this.updateHealthBars();
    }
    
    triggerDistortionEffects() {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine) {
            return;
        }
        
        const mapEngine = window.eldritchApp.systems.mapEngine;
        const playerPos = mapEngine.getPlayerPosition();
        
        if (!playerPos) {
            return;
        }
        
        // Determine effect type and intensity based on sanity level
        let effectType = null;
        let intensity = 0.5;
        
        if (this.playerStats.sanity <= 10) {
            // Critical sanity - all effects
            const effects = ['drippingBlood', 'ghost', 'cosmicDistortion', 'shadowTendrils', 'eldritchEyes'];
            effectType = effects[Math.floor(Math.random() * effects.length)];
            intensity = 1.0;
        } else if (this.playerStats.sanity <= 30) {
            // Low sanity - strong effects
            const effects = ['ghost', 'cosmicDistortion', 'shadowTendrils'];
            effectType = effects[Math.floor(Math.random() * effects.length)];
            intensity = 0.8;
        } else if (this.playerStats.sanity <= 50) {
            // Medium sanity - mild effects
            const effects = ['cosmicDistortion', 'shadowTendrils'];
            effectType = effects[Math.floor(Math.random() * effects.length)];
            intensity = 0.6;
        } else if (this.playerStats.sanity <= 70) {
            // High sanity - subtle effects
            effectType = 'cosmicDistortion';
            intensity = 0.3;
        }
        
        if (effectType) {
            console.log(`🌀 Triggering distortion effect: ${effectType} (intensity: ${intensity})`);
            mapEngine.addDistortionEffect(effectType, playerPos.lat, playerPos.lng, intensity);
        }
    }

    // Health system - because physical damage is... physical
    loseHealth(amount, reason = "The cosmic realm is not kind to the unprepared.") {
        this.playerStats.health = Math.max(0, this.playerStats.health - amount);
        console.log(`❤️ Health lost: ${amount}. Reason: ${reason}`);
        
        this.updateHealthBars();
        this.checkPlayerDeath();
    }

    gainHealth(amount, reason = "Cosmic energy flows through your being.") {
        this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + amount);
        console.log(`❤️ Health gained: ${amount}. Reason: ${reason}`);
        
        this.updateHealthBars();
    }

    // Rewards system
    giveReward(type, amount) {
        this.rewards[type] += amount;
        console.log(`🎁 Reward: ${type} +${amount}`);
    }

    showRewards() {
        const panel = document.getElementById('rewards-panel');
        const list = document.getElementById('rewards-list');
        
        list.innerHTML = '';
        Object.entries(this.rewards).forEach(([type, amount]) => {
            if (amount > 0) {
                const item = document.createElement('div');
                item.className = 'reward-item';
                item.innerHTML = `<span class="reward-type">${type}:</span> <span class="reward-amount">+${amount}</span>`;
                list.appendChild(item);
            }
        });
        
        panel.classList.remove('hidden');
    }

    // UI management
    showEncounterModal() {
        const modal = document.getElementById('encounter-modal');
        if (modal) {
            modal.classList.remove('hidden');
            console.log('🎭 Encounter modal shown');
        } else {
            console.error('🎭 Encounter modal not found!');
        }
    }

    closeEncounter() {
        const modal = document.getElementById('encounter-modal');
        modal.classList.add('hidden');
        this.activeEncounter = null;
    }

    showDialog(message) {
        const dialog = document.getElementById('dialog-text');
        dialog.innerHTML = `<p>${message}</p>`;
    }

    // Step tracking from movement
    updatePlayerPosition(position) {
        if (this.lastPosition) {
            const distance = this.calculateDistance(
                this.lastPosition.lat, this.lastPosition.lng,
                position.lat, position.lng
            );
            
            // Gain steps based on distance moved (simulation mode)
            if (distance > 10) { // Only count significant movement
                const stepsGained = Math.floor(distance / 100); // 1 step per 100 meters
                if (stepsGained > 0) {
                this.addSteps(stepsGained);
                }
            }
        }
        
        this.lastPosition = position;
    }

    // Add steps to player's step count
    addSteps(steps) {
        this.playerSteps += steps;
        console.log(`👣 Added ${steps} steps. Total: ${this.playerSteps}`);
        
        // Update debug panel if available
        if (window.unifiedDebugPanel) {
            window.unifiedDebugPanel.updatePlayerStatsDisplay();
        }
    }

    // Debug methods for testing
    triggerMonsterEncounter() {
        console.log('🎭 Triggering monster encounter...');
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.monsters.length > 0) {
            const monster = window.eldritchApp.systems.mapEngine.monsters[0];
            this.startMonsterEncounter(monster);
        } else {
            console.log('🎭 No monsters available, creating test monster...');
            // Create a test monster for demonstration
            const testMonster = {
                id: 'test_monster',
                name: 'Test Shadow Stalker',
                type: 'shadowStalker',
                health: 50,
                maxHealth: 50,
                attack: 12,
                defense: 8,
                experience: 25
            };
            this.startMonsterEncounter(testMonster);
        }
    }

    triggerPOIEncounter() {
        console.log('🎭 Triggering POI encounter...');
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.pointsOfInterest.length > 0) {
            const poi = window.eldritchApp.systems.mapEngine.pointsOfInterest[0];
            this.startPOIEncounter(poi);
        } else {
            console.log('🎭 No POIs available, creating test POI...');
            // Create a test POI for demonstration
            const testPOI = {
                id: 'test_poi',
                name: 'Test Ancient Ruins',
                type: 'ancientRuins',
                description: 'Mysterious ruins that pulse with cosmic energy'
            };
            this.startPOIEncounter(testPOI);
        }
    }

    // Mystery encounters removed as requested

    triggerPvPCombat(otherPlayer) {
        console.log(`⚔️ Starting PvP combat with ${otherPlayer.name}!`);
        
        // Create PvP combat encounter
        const pvpEncounter = {
            id: `pvp_${otherPlayer.id}`,
            name: otherPlayer.name,
            type: 'pvp',
            health: otherPlayer.health,
            maxHealth: otherPlayer.maxHealth,
            attack: 10 + (otherPlayer.level * 2),
            defense: 8 + otherPlayer.level,
            level: otherPlayer.level,
            isHostile: otherPlayer.isHostile,
            emoji: otherPlayer.emoji,
            color: otherPlayer.color
        };
        
        this.startPvPCombat(pvpEncounter);
    }

    startPvPCombat(pvpEncounter) {
        this.showModal();
        this.encounterType = 'pvp';
        
        const modal = document.getElementById('encounter-modal');
        modal.innerHTML = `
            <div class="encounter-content pvp-combat">
                <div class="encounter-header pvp-combat-header">
                    <h3>⚔️ PvP Combat: ${pvpEncounter.emoji} ${pvpEncounter.name}</h3>
                    <p class="player-level">Level ${pvpEncounter.level} ${pvpEncounter.isHostile ? 'Hostile' : 'Friendly'} Player</p>
                    <button class="close-btn" onclick="window.encounterSystem.hideModal()">×</button>
                </div>
                <div class="combat-interface">
                    <div class="combat-stats">
                        <div class="player-stats">
                            <h4>You</h4>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${(this.playerStats.health / this.playerStats.maxHealth) * 100}%"></div>
                            </div>
                            <span>${this.playerStats.health}/${this.playerStats.maxHealth}</span>
                        </div>
                        <div class="vs-indicator">VS</div>
                        <div class="enemy-stats">
                            <h4>${pvpEncounter.name}</h4>
                            <div class="health-bar">
                                <div class="health-fill" style="width: ${(pvpEncounter.health / pvpEncounter.maxHealth) * 100}%"></div>
                            </div>
                            <span>${pvpEncounter.health}/${pvpEncounter.maxHealth}</span>
                        </div>
                    </div>
                    <div class="combat-actions">
                        <button class="battle-btn" onclick="window.encounterSystem.pvpAttack('${pvpEncounter.id}')">⚔️ Attack</button>
                        <button class="battle-btn" onclick="window.encounterSystem.pvpDefend('${pvpEncounter.id}')">🛡️ Defend</button>
                        <button class="battle-btn" onclick="window.encounterSystem.pvpFlee('${pvpEncounter.id}')">🏃 Flee</button>
                        <button class="battle-btn" onclick="window.encounterSystem.pvpUseItem('${pvpEncounter.id}')">🧪 Use Item</button>
                    </div>
                    <div id="battle-log" class="battle-log"></div>
                </div>
            </div>
        `;
        
        this.activeEncounter = pvpEncounter.id;
        this.encounters.set(pvpEncounter.id, pvpEncounter);
        this.playerTurn = true;
        
        const log = document.getElementById('battle-log');
        log.innerHTML = `<div class="log-entry">⚔️ PvP combat begins! You face ${pvpEncounter.name} in battle!</div>`;
    }

    pvpAttack(enemyId) {
        if (!this.playerTurn) return;
        
        const enemy = this.encounters.get(enemyId);
        if (!enemy) return;
        
        const attackRoll = this.rollDice(20, this.playerStats.attack);
        const defenseRoll = this.rollDice(20, enemy.defense);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You attack ${enemy.name}! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">${enemy.name} defends! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            const damage = this.rollDice(8, this.playerStats.attack);
            enemy.health -= damage.total;
            log.innerHTML += `<div class="log-entry success">Hit! You deal ${damage.total} damage to ${enemy.name}!</div>`;
            
            if (enemy.health <= 0) {
                this.pvpVictory(enemy);
                return;
            }
        } else {
            log.innerHTML += `<div class="log-entry miss">Miss! ${enemy.name} dodges your attack!</div>`;
        }
        
        this.playerTurn = false;
        setTimeout(() => this.pvpEnemyTurn(enemyId), 1000);
    }

    pvpDefend(enemyId) {
        if (!this.playerTurn) return;
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You take a defensive stance! Defense increased for this turn.</div>`;
        
        this.playerStats.defense += 5;
        this.playerTurn = false;
        setTimeout(() => this.pvpEnemyTurn(enemyId), 1000);
    }

    pvpFlee(enemyId) {
        const fleeRoll = this.rollDice(20, this.playerStats.luck);
        const enemyRoll = this.rollDice(20, 10);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You attempt to flee! Roll: ${fleeRoll.roll} + ${fleeRoll.modifier} = ${fleeRoll.total}</div>`;
        
        if (fleeRoll.total > enemyRoll.total) {
            log.innerHTML += `<div class="log-entry success">You successfully flee from combat!</div>`;
            this.hideModal();
        } else {
            log.innerHTML += `<div class="log-entry miss">You can't escape! The battle continues!</div>`;
            this.playerTurn = false;
            setTimeout(() => this.pvpEnemyTurn(enemyId), 1000);
        }
    }

    pvpUseItem(enemyId) {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You use an item! (Item system not implemented yet)</div>`;
        this.playerTurn = false;
        setTimeout(() => this.pvpEnemyTurn(enemyId), 1000);
    }

    pvpEnemyTurn(enemyId) {
        const enemy = this.encounters.get(enemyId);
        if (!enemy) return;
        
        const attackRoll = this.rollDice(20, enemy.attack);
        const defenseRoll = this.rollDice(20, this.playerStats.defense);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">${enemy.name} attacks! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">You defend! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            const damage = this.rollDice(6, enemy.attack);
            this.loseHealth(damage.total, `${enemy.name}'s attack strikes true!`);
            log.innerHTML += `<div class="log-entry danger">Hit! ${enemy.name} deals ${damage.total} damage!</div>`;
            
            if (this.playerStats.health <= 0) {
                this.pvpDefeat(enemy);
                return;
            }
        } else {
            log.innerHTML += `<div class="log-entry miss">Miss! You dodge ${enemy.name}'s attack!</div>`;
        }
        
        this.playerTurn = true;
        this.updateHealthBars();
    }

    pvpVictory(enemy) {
        const experience = enemy.level * 25;
        this.playerStats.experience += experience;
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry victory">Victory! You defeated ${enemy.name}!</div>`;
        log.innerHTML += `<div class="log-entry reward">You gain ${experience} experience!</div>`;
        
        setTimeout(() => {
            this.hideModal();
            this.showRewards(experience, [`Defeated ${enemy.name}`]);
        }, 2000);
    }

    pvpDefeat(enemy) {
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry defeat">Defeat! ${enemy.name} has bested you!</div>`;
        log.innerHTML += `<div class="log-entry">You are defeated! Your health will regenerate over time.</div>`;
        
        this.playerStats.health = Math.floor(this.playerStats.maxHealth * 0.5);
        
        setTimeout(() => {
            this.hideModal();
        }, 3000);
    }

    initializeStories() {
        return {
            monster: {
                shadowStalker: {
                    name: "Shadow Stalker",
                    description: "A creature born from the darkness between dimensions, the Shadow Stalker hunts those who venture too close to the cosmic rifts. Its form shifts and writhes like living smoke, and its eyes burn with the cold fire of the void. It's been stalking you for 47 dimensions now, and frankly, it's getting a bit tired of your evasive maneuvers.",
                    intro: "The air grows cold as shadows begin to move independently around you. A figure materializes from the darkness - tall, gaunt, and radiating an otherworldly menace. The Shadow Stalker has found its prey. It looks at you with eyes that have seen the end of 12 universes and sighs audibly, as if this is just another Tuesday in the cosmic void.",
                    combatIntro: "The Shadow Stalker lets out a bone-chilling shriek as it lunges forward, its form becoming more solid as it prepares for battle! It's actually quite impressive how it manages to look menacing while muttering about 'another day, another mortal to terrify' under its breath.",
                    victory: "The Shadow Stalker shrieks in agony as your attack strikes true! It dissolves into wisps of dark smoke, leaving behind only a faint whisper on the wind that sounds suspiciously like 'Finally, some excitement in this eternal void...'",
                    defeat: "The Shadow Stalker's claws find their mark, and you feel your consciousness slipping away as the darkness claims you... The last thing you hear is it muttering 'Well, that was easier than expected. I should probably update my resume.'",
                    loot: ["Shadow Essence", "Void Crystal", "Dark Knowledge", "Stalker's Business Card"],
                    sanityDamage: 2
                },
                cosmicBeast: {
                    name: "Cosmic Beast",
                    description: "A magnificent creature that has adapted to the cosmic energies of this realm. Its scales shimmer with starlight, and its roar echoes across dimensions. It's been trying to start a cosmic book club for eons, but no one ever shows up to the meetings. The loneliness is driving it to violence.",
                    intro: "A massive creature emerges from a shimmering portal - its form is both beautiful and terrifying. The Cosmic Beast has been drawn by the cosmic energies in this area. It looks at you with eyes full of starlight and what appears to be... hope? 'Finally,' it rumbles, 'someone to discuss the latest cosmic literature with!'",
                    combatIntro: "The Cosmic Beast roars, and you feel the very fabric of space tremble around you! It charges forward with cosmic fury! 'You WILL join my book club!' it bellows, 'Even if I have to beat you into submission!'",
                    victory: "The Cosmic Beast's roar turns to a whimper as it falls. Starlight pours from its wounds, and you feel a surge of cosmic energy. As it fades, it whispers, 'At least... at least I tried to share my love of cosmic poetry...'",
                    defeat: "The Cosmic Beast's cosmic power overwhelms you, and you collapse under the weight of its otherworldly might... The last thing you hear is it excitedly planning your first book club meeting.",
                    loot: ["Starlight Scale", "Cosmic Essence", "Dimensional Fragment", "Cosmic Poetry Anthology"],
                    sanityDamage: 1
                },
                voidWalker: {
                    name: "Void Walker",
                    description: "An entity that exists in the spaces between reality. It appears as a humanoid figure wrapped in shifting darkness, with eyes that show the infinite void. It's been walking between dimensions for so long that it's forgotten what it was originally looking for. Now it just wanders around asking people if they've seen its keys.",
                    intro: "Reality itself seems to tear as a figure steps through the fabric of space. The Void Walker has crossed dimensions to reach this place. It looks around confusedly and mutters, 'I know I left them somewhere... maybe in the 23rd dimension? Or was it the 47th? This is why I never get anything done.'",
                    combatIntro: "The Void Walker's form becomes more solid as it prepares for combat, its void-touched claws extending menacingly! 'Look, I don't want to fight,' it says, 'but you might have my keys, and I've been looking for them for 12 eons!'",
                    victory: "The Void Walker's form begins to unravel, returning to the void from whence it came. You feel a strange sense of completion. As it fades, it calls out, 'If you find my keys, just leave them in the void! I'll check back in a few millennia!'",
                    defeat: "The Void Walker's touch sends you spiraling into the void, your consciousness fading into nothingness... The last thing you hear is it muttering about checking the 89th dimension for its keys.",
                    loot: ["Void Fragment", "Dimensional Tear", "Void Knowledge", "Mysterious Keys"],
                    sanityDamage: 3
                },
                energyPhantom: {
                    name: "Energy Phantom",
                    description: "A being of pure energy that has gained consciousness. It crackles with electrical power and moves with the speed of lightning. It's been trying to learn to play the electric guitar, but every time it gets excited, it accidentally electrocutes the audience. The cosmic music scene is not kind to energy beings.",
                    intro: "The air crackles with energy as a being of pure electricity materializes before you. The Energy Phantom pulses with raw power. 'Finally!' it crackles excitedly, 'Someone who might appreciate my latest cosmic metal solo! You're going to love this - I've been practicing for 500 years!'",
                    combatIntro: "The Energy Phantom crackles with electrical fury, bolts of lightning arcing around it as it prepares to strike! 'This is going to be EPIC!' it screams, 'Prepare for the most electrifying performance of your life!'",
                    victory: "The Energy Phantom explodes in a shower of sparks, leaving behind pure energy crystals that pulse with power. As it fades, it whispers, 'At least... at least I got to play one last time...'",
                    defeat: "Electricity courses through your body as the Energy Phantom's power overwhelms you, leaving you unconscious... The last thing you hear is it excitedly planning your next jam session.",
                    loot: ["Energy Crystal", "Lightning Essence", "Power Fragment", "Cosmic Guitar Pick"],
                    sanityDamage: 2
                },
                crystalGuardian: {
                    name: "Crystal Guardian",
                    description: "An ancient construct of living crystal that has stood guard over this area for centuries. Its form is both beautiful and deadly. It's been standing in the same spot for so long that it's developed a severe case of existential dread and a bad back. The cosmic realm's health insurance doesn't cover pre-existing conditions.",
                    intro: "A massive crystal formation begins to move, revealing itself as a living guardian. The Crystal Guardian has awakened to protect its domain. It stretches its crystalline limbs with a series of audible cracks. 'Oh, my aching facets,' it groans, 'I've been standing here for 3,000 years waiting for something interesting to happen. You'll do.'",
                    combatIntro: "The Crystal Guardian's form shimmers as it prepares for battle, its crystalline structure becoming more defined! 'Look, I don't want to fight,' it says, 'but I've got a quota to meet, and you're the first interesting thing that's happened since the last ice age.'",
                    victory: "The Crystal Guardian shatters into beautiful fragments, each one pulsing with ancient magic and wisdom. As it falls, it sighs with relief, 'Finally... I can rest... Maybe I'll try being a coffee table in my next life...'",
                    defeat: "The Crystal Guardian's crystalline structure proves too strong, and you are overwhelmed by its ancient power... The last thing you hear is it muttering about finally getting some exercise.",
                    loot: ["Crystal Shard", "Ancient Wisdom", "Guardian Essence", "Crystal Guardian's Back Brace"],
                    sanityDamage: 1
                }
            },
            poi: {
                ancientRuins: {
                    name: "Ancient Ruins",
                    description: "The crumbling remains of a civilization that once thrived here. Strange energies still pulse through the weathered stones.",
                    story: "As you approach the ancient ruins, you feel the weight of centuries pressing down on you. The stones seem to whisper secrets of a time long past, when this place was a center of great power and knowledge.",
                    puzzle: "The ruins contain a series of ancient symbols that seem to respond to your presence. Can you decipher the pattern and unlock the secrets within?",
                    success: "The symbols glow with ancient power as you solve the puzzle! The ruins reveal their secrets, and you feel wiser for the experience.",
                    failure: "The ancient symbols remain silent, their secrets locked away for another time. Perhaps you need more knowledge to unlock them.",
                    loot: ["Ancient Artifact", "Historical Knowledge", "Mystical Insight"]
                },
                energyCrystal: {
                    name: "Energy Crystal",
                    description: "A massive crystal formation that pulses with raw cosmic energy. It seems to be a natural amplifier for the area's mystical properties.",
                    story: "The Energy Crystal hums with power as you approach. You can feel the cosmic energies flowing through it, and it seems to respond to your presence.",
                    puzzle: "The crystal's energy patterns form a complex sequence. You must match the rhythm to harmonize with its frequency.",
                    success: "The crystal's energy synchronizes with your own! You feel a surge of power and understanding flow through you.",
                    failure: "The crystal's energy remains chaotic and unresponsive. Perhaps you need to approach it differently.",
                    loot: ["Energy Fragment", "Cosmic Insight", "Power Crystal"]
                },
                mysticShrine: {
                    name: "Mystic Shrine",
                    description: "A small shrine dedicated to an unknown deity. The air around it shimmers with mystical energy.",
                    story: "The Mystic Shrine radiates an aura of peace and wisdom. You feel drawn to it, as if it has something important to tell you.",
                    puzzle: "The shrine contains a series of meditation stones. You must arrange them in the correct order to unlock its power.",
                    success: "The shrine's power awakens, and you feel a deep sense of peace and understanding wash over you.",
                    failure: "The shrine remains silent, its secrets locked away. Perhaps you need to approach it with a clearer mind.",
                    loot: ["Blessing", "Spiritual Insight", "Mystical Fragment"]
                }
            }
        };
    }

    initializeNPCBackstories() {
        return {
            Aurora: {
                name: "Aurora",
                title: "The Cosmic Navigator",
                backstory: "Aurora was once a star pilot who got lost in a cosmic storm and found herself in this realm. She's been exploring the cosmic mysteries ever since, using her knowledge of stellar navigation to help others find their way through the dimensional rifts.",
                personality: "Wise, mysterious, and deeply connected to the cosmic forces. She speaks in riddles and metaphors, often referencing stars and cosmic phenomena.",
                goals: "To find a way back to her home dimension and help others navigate the cosmic mysteries.",
                secrets: "She carries a fragment of her home star that glows with inner light, and she's been having visions of a great cosmic convergence.",
                relationships: "She's friends with Zephyr, who she met during her travels, and has a deep respect for Sage's wisdom.",
                dialogue: {
                    greeting: "Greetings, fellow cosmic traveler! The stars have whispered of your arrival.",
                    topics: {
                        cosmic: "The cosmic forces are in flux today. Can you feel the dimensional rifts shifting?",
                        navigation: "I've been mapping the cosmic currents. There's something strange happening near the ancient ruins.",
                        home: "I dream of my home star every night. One day, I'll find my way back through the cosmic storms.",
                        help: "If you need guidance through the cosmic mysteries, I'm here to help. The stars have much to teach us."
                    }
                }
            },
            Zephyr: {
                name: "Zephyr",
                title: "The Wandering Wind",
                backstory: "Zephyr is a free spirit who's been traveling between dimensions for as long as he can remember. He's never stayed in one place for long, always seeking new adventures and experiences. He's become something of a legend among travelers.",
                personality: "Cheerful, adventurous, and always ready for a new challenge. He's the kind of person who makes friends wherever he goes.",
                goals: "To see every dimension and experience every adventure the cosmos has to offer.",
                secrets: "He's actually been to the other side of the cosmic rifts and has seen things that would drive most people mad, but he keeps his cheerful demeanor.",
                relationships: "He's close friends with Aurora and has a playful rivalry with Sage, who he often teases about being too serious.",
                dialogue: {
                    greeting: "Hey there, fellow adventurer! Ready for some excitement?",
                    topics: {
                        adventure: "I've been to some amazing places! Want to hear about the time I found a floating city made of light?",
                        travel: "The best part of traveling is meeting new people like you! Every journey is an adventure waiting to happen.",
                        danger: "I've faced some pretty scary creatures in my travels. The key is to stay calm and think on your feet.",
                        friendship: "You seem like someone I could travel with! What do you say we explore together sometime?"
                    }
                }
            },
            Sage: {
                name: "Sage",
                title: "The Keeper of Ancient Wisdom",
                backstory: "Sage is an ancient being who has been studying the cosmic mysteries for millennia. He's seen civilizations rise and fall, and he's accumulated vast knowledge about the nature of reality itself. He's become a living repository of cosmic wisdom.",
                personality: "Wise, patient, and deeply philosophical. He speaks slowly and deliberately, choosing his words carefully.",
                goals: "To preserve and share the ancient wisdom he's accumulated, and to help others understand the deeper truths of existence.",
                secrets: "He's actually one of the last survivors of the first civilization that discovered the cosmic rifts, and he's been waiting for someone worthy to inherit his knowledge.",
                relationships: "He has a deep respect for Aurora's cosmic knowledge and enjoys Zephyr's youthful enthusiasm, though he sometimes finds it exhausting.",
                dialogue: {
                    greeting: "Welcome, seeker of knowledge. I sense you have questions that only time and wisdom can answer.",
                    topics: {
                        wisdom: "The ancient texts speak of a time when all dimensions were connected. Perhaps we're witnessing the beginning of a new era.",
                        history: "I've seen civilizations rise and fall like waves on the cosmic ocean. Each one teaches us something new about the nature of existence.",
                        mystery: "The cosmic rifts are not random occurrences. They're part of a greater pattern that we're only beginning to understand.",
                        guidance: "If you seek wisdom, you must first learn to listen to the silence between the stars. There, you'll find the answers you seek."
                    }
                }
            }
        };
    }

    initializeLegendaryEncounters() {
        return {
            heavy: {
                name: "HEVY",
                title: "The Legendary Cosmic Guardian",
                emoji: "⚡",
                color: "#FF4500",
                rarity: "legendary",
                spawnChance: 0.001, // 0.1% chance per position update
                backstory: "HEVY is a legendary cosmic guardian who has transcended the boundaries of space and time. Once a mortal who achieved perfect enlightenment, HEVY now exists as pure cosmic energy, appearing only to those who have walked the path of wisdom and are ready for the ultimate test of the heart.",
                personality: "Mysterious and powerful, HEVY speaks in cosmic riddles and tests the very essence of those who encounter them. They appear as a shimmering figure of pure energy, radiating ancient wisdom and infinite power.",
                quest: {
                    question: "In the cosmic dance of existence, what is the force that binds all dimensions together, that flows through every star and every soul, that is both the beginning and the end of all things?",
                    correctAnswer: "love",
                    hints: [
                        "It is not power, for power corrupts",
                        "It is not knowledge, for knowledge can be lost",
                        "It is the force that created the universe",
                        "It is what makes life worth living",
                        "It is the answer to every question"
                    ],
                    rewards: {
                        experience: 1000,
                        steps: 500,
                        items: ["Cosmic Heart Fragment", "Legendary Wisdom Crystal"],
                        title: "Heart of the Cosmos"
                    }
                },
                dialogue: {
                    greeting: "Greetings, mortal soul. I am HEVY, guardian of the cosmic realms. You have walked far to reach this moment...",
                    question: "In the cosmic dance of existence, what is the force that binds all dimensions together, that flows through every star and every soul, that is both the beginning and the end of all things?",
                    correct: "Ah, you understand the cosmic truth! Love is indeed the fundamental force that binds all existence together. You have proven yourself worthy of cosmic wisdom!",
                    incorrect: "Your answer reveals much about your understanding of the cosmic order. Perhaps you need more time to contemplate the mysteries of existence...",
                    farewell: "Go forth with the cosmic wisdom you have gained. Remember, love is the key to unlocking all mysteries of the universe."
                }
            },
            cosmicShrine: {
                name: "Cosmic Shrine",
                title: "Ancient Power Source",
                emoji: "🏛️",
                color: "#8A2BE2",
                rarity: "rare",
                spawnChance: 0.01, // 1% chance per position update
                backstory: "An ancient shrine imbued with cosmic energy. It pulses with otherworldly power and offers blessings to those who approach with pure intentions.",
                personality: "The shrine radiates a calming, mystical energy. It seems to respond to the thoughts and emotions of those who approach it.",
                effects: {
                    health: 20,
                    sanity: 15,
                    experience: 50
                },
                dialogue: {
                    greeting: "The ancient shrine pulses with cosmic energy...",
                    blessing: "You feel the shrine's power flowing through you, restoring your health and sanity!",
                    farewell: "The shrine's energy fades as you step away, but you feel renewed."
                }
            },
            eldritchMonster: {
                name: "Eldritch Horror",
                title: "Cosmic Terror",
                emoji: "👹",
                color: "#8B0000",
                rarity: "epic",
                spawnChance: 0.005, // 0.5% chance per position update
                backstory: "A terrifying creature from the depths of cosmic space. It feeds on fear and chaos, but defeating it grants immense power.",
                personality: "Malevolent and chaotic, this creature seeks to spread terror and destruction across the cosmic realm.",
                combat: {
                    health: 150,
                    attack: 25,
                    defense: 15
                },
                rewards: {
                    experience: 200,
                    items: ["Eldritch Essence", "Cosmic Terror Claw"],
                    stats: {
                        attack: 5,
                        defense: 3
                    }
                },
                dialogue: {
                    greeting: "The eldritch horror emerges from the shadows, its many eyes fixed on you...",
                    combat: "The creature attacks with otherworldly fury!",
                    defeat: "The eldritch horror collapses, its essence dispersing into cosmic energy!",
                    victory: "You have defeated the eldritch horror and gained its power!"
                }
            },
            wisdomCrystal: {
                name: "Wisdom Crystal",
                title: "Fragment of Cosmic Knowledge",
                emoji: "💎",
                color: "#00BFFF",
                rarity: "uncommon",
                spawnChance: 0.02, // 2% chance per position update
                backstory: "A crystal fragment containing ancient cosmic wisdom. Touching it grants insight and knowledge.",
                personality: "The crystal hums softly with contained knowledge, waiting to share its secrets with a worthy seeker.",
                effects: {
                    experience: 100,
                    sanity: 10,
                    skills: {
                        investigation: 2,
                        survival: 1
                    }
                },
                dialogue: {
                    greeting: "The wisdom crystal glows softly, pulsing with contained knowledge...",
                    blessing: "Ancient wisdom flows into your mind, enhancing your investigative and survival skills!",
                    farewell: "The crystal's glow dims as you step away, but the knowledge remains."
                }
            },
            cosmicMerchant: {
                name: "Cosmic Merchant",
                title: "Trader of Otherworldly Goods",
                emoji: "🛒",
                color: "#FFD700",
                rarity: "rare",
                spawnChance: 0.008, // 0.8% chance per position update
                backstory: "A mysterious merchant who deals in cosmic artifacts and otherworldly goods. They appear randomly to offer their wares to travelers.",
                personality: "Friendly but mysterious, the merchant speaks in riddles about their wares and seems to know more than they let on.",
                shop: {
                    items: [
                        { name: "Cosmic Potion", price: 50, effect: "health" },
                        { name: "Sanity Elixir", price: 75, effect: "sanity" },
                        { name: "Power Crystal", price: 100, effect: "attack" },
                        { name: "Wisdom Scroll", price: 150, effect: "experience" }
                    ]
                },
                dialogue: {
                    greeting: "Ah, a fellow traveler! I have some interesting wares that might interest you...",
                    trade: "Excellent choice! This item will serve you well in your cosmic journey.",
                    farewell: "Safe travels, and may the cosmic winds guide your path!"
                }
            }
        };
    }

    // Dice rolling system
    rollDice(sides = 20, modifier = 0) {
        const roll = Math.floor(Math.random() * sides) + 1;
        const total = roll + modifier;
        return { roll, modifier, total };
    }

    // Show modal method
    showModal() {
        const modal = document.getElementById('encounter-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }

    // Hide modal method
    hideModal() {
        const modal = document.getElementById('encounter-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Simplified dice combat system
    startDiceCombat(monster) {
        const monsterData = this.stories.monster[monster.type] || this.stories.monster.shadowStalker;
        
        console.log('🎲 Starting simplified dice combat with:', monsterData.name);
        
        // Use the simple dice combat system
        if (window.simpleDiceCombat) {
            window.simpleDiceCombat.startCombat(
                {
                    name: monsterData.name,
                    type: monster.type,
                    id: monster.id
                },
                (enemy) => this.handleCombatWin(enemy),
                (enemy) => this.handleCombatLose(enemy)
            );
        } else {
            console.error('Simple dice combat system not available!');
            this.showDialog('Combat system not available!');
        }
    }

    /**
     * Handle combat victory
     */
    handleCombatWin(enemy) {
        console.log('🎉 Combat victory!');
        
        // Award experience and items
        const experience = enemy.type === 'shadowStalker' ? 25 : 15;
        this.playerStats.experience += experience;
        
        // Show victory message
        this.showDialog(`🎉 Victory! You defeated ${enemy.name} and gained ${experience} experience!`);
        
        // Check for level up
        this.checkLevelUp();
        
        // Add some random items
        this.addRandomRewards();
        
        // Update mobile stats
        this.updateMobileStats();
    }

    /**
     * Handle combat defeat
     */
    handleCombatLose(enemy) {
        console.log('💀 Combat defeat!');
        
        // Lose some health and sanity
        const healthLoss = Math.floor(Math.random() * 20) + 10;
        const sanityLoss = Math.floor(Math.random() * 15) + 5;
        
        this.playerStats.health = Math.max(0, this.playerStats.health - healthLoss);
        this.playerStats.sanity = Math.max(0, this.playerStats.sanity - sanityLoss);
        
        // Show defeat message
        this.showDialog(`💀 Defeat! You lost ${healthLoss} health and ${sanityLoss} sanity!`);
        
        // Check if player is dead
        if (this.playerStats.health <= 0) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = `Defeated by ${enemy.name}`;
            this.showDialog('💀 You have died! The cosmic horror has consumed you...');
        }
        
        // Update mobile stats
        this.updateMobileStats();
    }

    /**
     * Add random rewards after victory
     */
    addRandomRewards() {
        const rewards = [
            { type: 'health', amount: 10, message: 'Found a healing potion! +10 Health' },
            { type: 'sanity', amount: 5, message: 'Ancient wisdom flows through you! +5 Sanity' },
            { type: 'attack', amount: 1, message: 'Your combat prowess increases! +1 Attack' },
            { type: 'defense', amount: 1, message: 'Your defensive skills improve! +1 Defense' }
        ];
        
        const reward = rewards[Math.floor(Math.random() * rewards.length)];
        
        switch (reward.type) {
            case 'health':
                this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + reward.amount);
                break;
            case 'sanity':
                this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + reward.amount);
                break;
            case 'attack':
                this.playerStats.attack += reward.amount;
                break;
            case 'defense':
                this.playerStats.defense += reward.amount;
                break;
        }
        
        console.log('🎁 Reward:', reward.message);
    }

    rollInitiative(monster) {
        const playerRoll = this.rollDice(20, this.playerStats.luck);
        const monsterRoll = this.rollDice(20, monster.luck || 10);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You roll ${playerRoll.roll} + ${playerRoll.modifier} = ${playerRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">${monster.name} rolls ${monsterRoll.roll} + ${monsterRoll.modifier} = ${monsterRoll.total}</div>`;
        
        if (playerRoll.total >= monsterRoll.total) {
            log.innerHTML += `<div class="log-entry">You go first!</div>`;
            this.playerTurn = true;
        } else {
            log.innerHTML += `<div class="log-entry">${monster.name} goes first!</div>`;
            this.playerTurn = false;
            setTimeout(() => this.monsterTurn(monster), 1000);
        }
    }

    playerAttack(monsterId) {
        if (!this.playerTurn) return;
        
        const monster = this.encounters.get(monsterId);
        if (!monster) return;
        
        // Get equipped weapon stats
        const equippedWeapon = this.itemSystem.getEquippedItems().weapon;
        const weaponAttack = equippedWeapon ? equippedWeapon.stats.attack : 0;
        
        // Apply stance modifiers
        const stanceMods = this.stanceModifiers || { attack: 0, defense: 0, accuracy: 0, critChance: 0 };
        const totalAttack = this.playerStats.attack + weaponAttack + stanceMods.attack;
        const accuracyBonus = stanceMods.accuracy || 0;
        
        const attackRoll = this.rollDice(20, totalAttack + accuracyBonus);
        const defenseRoll = this.rollDice(20, monster.defense);
        
        const log = document.getElementById('battle-log');
        const weaponName = equippedWeapon ? ` with ${equippedWeapon.name}` : '';
        log.innerHTML += `<div class="log-entry">You attack${weaponName}! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">${monster.name} defends! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        // Check for critical hit (natural 20 or stance bonus)
        const critChance = stanceMods.critChance || 0;
        const isCritical = attackRoll.roll === 20 || (attackRoll.roll >= 18 && Math.random() < critChance);
        const isMiss = attackRoll.total <= defenseRoll.total;
        
        if (isCritical) {
            // Critical hit - always hits and deals extra damage
            const baseDamage = this.rollDice(8, totalAttack);
            const criticalBonus = this.rollDice(8, totalAttack);
            const totalDamage = baseDamage.total + criticalBonus.total;
            
            monster.health -= totalDamage;
            log.innerHTML += `<div class="log-entry critical">CRITICAL HIT! You deal ${totalDamage} damage! (${baseDamage.total} + ${criticalBonus.total} crit bonus)</div>`;
            
            // Apply weapon effects with critical bonus
            if (equippedWeapon && equippedWeapon.effects) {
                this.applyWeaponEffects(equippedWeapon, monster, log, true);
            }
            
            if (monster.health <= 0) {
                this.victory(monster);
                return;
            }
        } else if (!isMiss) {
            // Normal hit
            const damage = this.rollDice(8, totalAttack);
            monster.health -= damage.total;
            log.innerHTML += `<div class="log-entry success">Hit! You deal ${damage.total} damage!</div>`;
            
            // Apply weapon effects
            if (equippedWeapon && equippedWeapon.effects) {
                this.applyWeaponEffects(equippedWeapon, monster, log, false);
            }
            
            if (monster.health <= 0) {
                this.victory(monster);
                return;
            }
        } else {
            log.innerHTML += `<div class="log-entry miss">Miss! ${monster.name} dodges your attack!</div>`;
        }
        
        this.playerTurn = false;
        setTimeout(() => this.monsterTurn(monster), 1000);
    }

    // Apply weapon effects
    applyWeaponEffects(weapon, monster, log, isCritical = false) {
        weapon.effects.forEach(effect => {
            switch (effect) {
                case 'void_damage':
                    const voidDamage = this.rollDice(4, 2);
                    const voidMultiplier = isCritical ? 2 : 1;
                    monster.health -= voidDamage.total * voidMultiplier;
                    log.innerHTML += `<div class="log-entry success">Void damage! +${voidDamage.total * voidMultiplier} damage!</div>`;
                    break;
                case 'tentacle_whisper':
                    const jokes = [
                        "Why don't cosmic entities ever get cold? Because they're always in their element!",
                        "What do you call a cosmic entity that's always late? A procrastinator from another dimension!",
                        "Why did the eldritch horror break up with its girlfriend? Because it couldn't handle the relationship's complexity!"
                    ];
                    const joke = jokes[Math.floor(Math.random() * jokes.length)];
                    log.innerHTML += `<div class="log-entry">The tentacle whispers: "${joke}"</div>`;
                    break;
                case 'starlight_arrows':
                    log.innerHTML += `<div class="log-entry">Starlight arrows pierce through ${monster.name}'s defenses!</div>`;
                    if (isCritical) {
                        monster.defense -= 3; // Critical starlight arrows reduce defense more
                        log.innerHTML += `<div class="log-entry critical">Critical starlight! Defense reduced by 3!</div>`;
                    }
                    break;
                case 'reality_breach':
                    log.innerHTML += `<div class="log-entry">Reality tears around ${monster.name}! It looks confused!</div>`;
                    const defenseReduction = isCritical ? 4 : 2;
                    monster.defense -= defenseReduction;
                    log.innerHTML += `<div class="log-entry success">Defense reduced by ${defenseReduction}!</div>`;
                    break;
                case 'cosmic_humor':
                    // Tentacle club's humor effect
                    if (Math.random() < 0.3) {
                        monster.defense -= 1;
                        log.innerHTML += `<div class="log-entry">The cosmic humor confuses ${monster.name}! Defense -1!</div>`;
                    }
                    break;
                case 'dimensional_portal':
                    // Reality gun's portal effect
                    if (Math.random() < 0.2) {
                        const portalDamage = this.rollDice(6, 3);
                        monster.health -= portalDamage.total;
                        log.innerHTML += `<div class="log-entry success">Dimensional portal opens! +${portalDamage.total} damage!</div>`;
                    }
                    break;
                case 'wisdom_protection':
                    // Crystal plate's wisdom effect
                    if (isCritical) {
                        this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + 5);
                        log.innerHTML += `<div class="log-entry success">Ancient wisdom flows through you! +5 Sanity!</div>`;
                    }
                    break;
                case 'existential_whispers':
                    // Void armor's existential effect
                    if (Math.random() < 0.4) {
                        monster.attack -= 2;
                        log.innerHTML += `<div class="log-entry">Existential dread weakens ${monster.name}! Attack -2!</div>`;
                    }
                    break;
                case 'sanity_protection':
                    // Sanity amulet's protection
                    if (isCritical) {
                        this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + 3);
                        log.innerHTML += `<div class="log-entry success">Sanity amulet protects your mind! +3 Sanity!</div>`;
                    }
                    break;
                case 'void_walking':
                    // Void ring's walking effect
                    if (Math.random() < 0.3) {
                        log.innerHTML += `<div class="log-entry">You phase through ${monster.name}'s attack! Next attack guaranteed hit!</div>`;
                        // Set a flag for guaranteed next hit
                        this.guaranteedHit = true;
                    }
                    break;
                case 'cosmic_navigation':
                    // Cosmic compass's navigation effect
                    if (isCritical) {
                        log.innerHTML += `<div class="log-entry">Cosmic compass reveals ${monster.name}'s weakness!</div>`;
                        monster.defense -= 2;
                        log.innerHTML += `<div class="log-entry success">Defense reduced by 2!</div>`;
                    }
                    break;
                case 'reality_stability':
                    // Reality anchor's stability effect
                    if (isCritical) {
                        this.playerStats.defense += 3;
                        log.innerHTML += `<div class="log-entry success">Reality anchor stabilizes your defenses! +3 Defense!</div>`;
                    }
                    break;
                case 'infinite_storage':
                    // Void pocket's storage effect
                    if (Math.random() < 0.1) {
                        const randomItem = this.itemSystem.generateRandomLoot('monster');
                        this.itemSystem.addToInventory(randomItem.itemId, 1);
                        log.innerHTML += `<div class="log-entry success">Void pocket produces ${randomItem.item.name}!</div>`;
                    }
                    break;
            }
        });
    }

    playerDefend(monsterId) {
        if (!this.playerTurn) return;
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You take a defensive stance! Defense increased for this turn.</div>`;
        
        this.playerStats.defense += 5; // Temporary defense boost
        this.playerTurn = false;
        setTimeout(() => this.monsterTurn(monsterId), 1000);
    }

    // Combat Stance System
    changeStance(stance) {
        this.currentStance = stance;
        const log = document.getElementById('battle-log');
        
        switch (stance) {
            case 'balanced':
                this.stanceModifiers = { attack: 0, defense: 0, accuracy: 0, critChance: 0 };
                log.innerHTML += `<div class="log-entry">You adopt a balanced stance. Ready for any situation.</div>`;
                break;
            case 'aggressive':
                this.stanceModifiers = { attack: 3, defense: -2, accuracy: -1, critChance: 0.05 };
                log.innerHTML += `<div class="log-entry">You adopt an aggressive stance! Attack +3, Defense -2, Accuracy -1, Crit +5%</div>`;
                break;
            case 'defensive':
                this.stanceModifiers = { attack: -2, defense: 4, accuracy: 1, critChance: -0.02 };
                log.innerHTML += `<div class="log-entry">You adopt a defensive stance! Attack -2, Defense +4, Accuracy +1, Crit -2%</div>`;
                break;
            case 'tactical':
                this.stanceModifiers = { attack: 0, defense: 1, accuracy: 2, critChance: 0.03 };
                log.innerHTML += `<div class="log-entry">You adopt a tactical stance! Defense +1, Accuracy +2, Crit +3%</div>`;
                break;
        }
    }

    // Special Abilities System
    useSpecialAbility(monsterId, ability) {
        if (!this.playerTurn) return;
        
        const monster = this.encounters.get(monsterId);
        if (!monster) return;

        const log = document.getElementById('battle-log');
        const abilityData = this.getSpecialAbility(ability);
        
        if (!abilityData) {
            log.innerHTML += `<div class="log-entry error">Unknown ability!</div>`;
            return;
        }

        // Check if player has enough resources
        if (this.playerStats.sanity < abilityData.sanityCost) {
            log.innerHTML += `<div class="log-entry error">Not enough sanity! Need ${abilityData.sanityCost}, have ${this.playerStats.sanity}</div>`;
            return;
        }

        // Check cooldown
        if (this.abilityCooldowns && this.abilityCooldowns[ability] > 0) {
            log.innerHTML += `<div class="log-entry error">${abilityData.name} is on cooldown for ${this.abilityCooldowns[ability]} turns!</div>`;
            return;
        }

        // Use ability
        this.playerStats.sanity -= abilityData.sanityCost;
        this.updateStatBars();

        log.innerHTML += `<div class="log-entry ability">You use ${abilityData.name}!</div>`;
        
        // Execute ability effect
        this.executeSpecialAbility(ability, monster, log);
        
        // Set cooldown
        if (!this.abilityCooldowns) this.abilityCooldowns = {};
        this.abilityCooldowns[ability] = abilityData.cooldown;

        this.playerTurn = false;
        setTimeout(() => this.monsterTurn(monsterId), 1000);
    }

    getSpecialAbility(ability) {
        const abilities = {
            cosmic_strike: {
                name: 'Cosmic Strike',
                description: 'Channel cosmic energy into a devastating attack',
                sanityCost: 15,
                cooldown: 3,
                type: 'attack'
            },
            reality_anchor: {
                name: 'Reality Anchor',
                description: 'Stabilize reality around you, reducing incoming damage',
                sanityCost: 10,
                cooldown: 4,
                type: 'defensive'
            },
            sanity_blast: {
                name: 'Sanity Blast',
                description: 'Attack the enemy\'s mind directly',
                sanityCost: 20,
                cooldown: 5,
                type: 'mental'
            },
            void_dodge: {
                name: 'Void Dodge',
                description: 'Phase through the void to avoid the next attack',
                sanityCost: 12,
                cooldown: 2,
                type: 'defensive'
            }
        };
        
        return abilities[ability];
    }
    
    // HEVY encounter interactions
    answerHEVYRiddle(encounter) {
        const answer = prompt(encounter.quest.question + "\n\nYour answer:");
        if (answer && answer.toLowerCase().includes(encounter.quest.correctAnswer)) {
            this.showDialog(encounter.dialogue.correct);
            this.applyEncounterRewards(encounter.quest.rewards);
        } else {
            this.showDialog(encounter.dialogue.incorrect);
        }
        this.closeEncounterModal();
    }
    
    askHEVYHint(encounter) {
        const hint = encounter.quest.hints[Math.floor(Math.random() * encounter.quest.hints.length)];
        this.showDialog(`HEVY whispers: "${hint}"`);
        setTimeout(() => this.closeEncounterModal(), 3000);
    }
    
    leaveHEVY(encounter) {
        this.showDialog(encounter.dialogue.farewell);
        this.closeEncounterModal();
    }
    
    // Cosmic Shrine interactions
    receiveShrineBlessing(encounter) {
        this.showDialog(encounter.dialogue.blessing);
        this.applyEncounterEffects(encounter.effects);
        this.closeEncounterModal();
    }
    
    meditateAtShrine(encounter) {
        this.showDialog("You meditate at the shrine, gaining deep insight and wisdom.");
        this.applyEncounterEffects({
            sanity: 25,
            experience: 75,
            skills: { investigation: 1, survival: 1 }
        });
        this.closeEncounterModal();
    }
    
    leaveShrine(encounter) {
        this.showDialog(encounter.dialogue.farewell);
        this.closeEncounterModal();
    }
    
    // Eldritch Horror interactions
    fightEldritchHorror(encounter) {
        this.showDialog(encounter.dialogue.combat);
        // Start combat with the horror
        this.startBattle({
            type: encounter.name.toLowerCase().replace(' ', '_'),
            name: encounter.name,
            health: encounter.combat.health,
            attack: encounter.combat.attack,
            defense: encounter.combat.defense
        });
    }
    
    fleeFromHorror(encounter) {
        const fleeChance = Math.random();
        if (fleeChance < 0.3) { // 30% chance to flee
            this.showDialog("You successfully flee from the eldritch horror!");
            this.closeEncounterModal();
        } else {
            this.showDialog("The horror blocks your escape! You must fight!");
            this.fightEldritchHorror(encounter);
        }
    }
    
    diplomacyWithHorror(encounter) {
        this.showDialog("You attempt to communicate with the eldritch horror, but it only responds with otherworldly screeches. It seems diplomacy is not an option.");
        setTimeout(() => this.fightEldritchHorror(encounter), 2000);
    }
    
    // Wisdom Crystal interactions
    touchWisdomCrystal(encounter) {
        this.showDialog(encounter.dialogue.blessing);
        this.applyEncounterEffects(encounter.effects);
        this.closeEncounterModal();
    }
    
    studyWisdomCrystal(encounter) {
        this.showDialog("You carefully study the crystal, gaining deeper understanding of its cosmic properties.");
        this.applyEncounterEffects({
            experience: 150,
            sanity: 15,
            skills: { investigation: 3, survival: 2 }
        });
        this.closeEncounterModal();
    }
    
    leaveWisdomCrystal(encounter) {
        this.showDialog(encounter.dialogue.farewell);
        this.closeEncounterModal();
    }
    
    // Cosmic Merchant interactions
    browseMerchantWares(encounter) {
        this.showDialog("The merchant shows you their wares. (Shop system would be implemented here)");
        // TODO: Implement shop system
        this.closeEncounterModal();
    }
    
    askMerchantAboutItems(encounter) {
        this.showDialog("The merchant tells you about the cosmic properties of their items and their origins.");
        this.applyEncounterEffects({ experience: 25, skills: { investigation: 1 } });
        this.closeEncounterModal();
    }
    
    leaveMerchant(encounter) {
        this.showDialog(encounter.dialogue.farewell);
        this.closeEncounterModal();
    }
    
    // Helper methods for applying encounter effects
    applyEncounterRewards(rewards) {
        if (rewards.experience) {
            this.playerStats.experience += rewards.experience;
            this.updatePlayerStats({ experience: rewards.experience });
        }
        if (rewards.steps) {
            // Add steps to step currency system
            if (window.stepCurrencySystem) {
                window.stepCurrencySystem.addSteps(rewards.steps);
            }
        }
        if (rewards.items) {
            rewards.items.forEach(item => {
                // Add items to inventory
                console.log('🎒 Received item:', item);
            });
        }
        if (rewards.title) {
            console.log('🏆 Earned title:', rewards.title);
        }
    }
    
    applyEncounterEffects(effects) {
        if (effects.health) {
            this.playerStats.health = Math.min(this.playerStats.maxHealth, this.playerStats.health + effects.health);
            this.updatePlayerStats({ health: effects.health });
        }
        if (effects.sanity) {
            this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + effects.sanity);
            this.updatePlayerStats({ sanity: effects.sanity });
        }
        if (effects.experience) {
            this.playerStats.experience += effects.experience;
            this.updatePlayerStats({ experience: effects.experience });
        }
        if (effects.skills) {
            Object.entries(effects.skills).forEach(([skill, value]) => {
                this.playerStats.skills[skill] = (this.playerStats.skills[skill] || 0) + value;
            });
        }
        if (effects.stats) {
            Object.entries(effects.stats).forEach(([stat, value]) => {
                this.playerStats[stat] = (this.playerStats[stat] || 0) + value;
            });
        }
        this.updateStatBars();
    }

    executeSpecialAbility(ability, monster, log) {
        switch (ability) {
            case 'cosmic_strike':
                const cosmicDamage = this.rollDice(12, this.playerStats.attack + 5);
                monster.health -= cosmicDamage.total;
                log.innerHTML += `<div class="log-entry success">Cosmic energy courses through your weapon! ${cosmicDamage.total} cosmic damage!</div>`;
                
                // Cosmic strike has a chance to stun
                if (Math.random() < 0.3) {
                    monster.stunned = 2;
                    log.innerHTML += `<div class="log-entry success">The cosmic energy stuns ${monster.name} for 2 turns!</div>`;
                }
                break;
                
            case 'reality_anchor':
                this.realityAnchored = 3;
                log.innerHTML += `<div class="log-entry success">Reality stabilizes around you! Next 3 attacks deal 50% less damage!</div>`;
                break;
                
            case 'sanity_blast':
                const sanityDamage = this.rollDice(8, this.playerStats.attack);
                monster.health -= sanityDamage.total;
                log.innerHTML += `<div class="log-entry success">You assault ${monster.name}'s mind! ${sanityDamage.total} mental damage!</div>`;
                
                // Sanity blast reduces monster's attack
                monster.attack = Math.max(1, monster.attack - 2);
                log.innerHTML += `<div class="log-entry success">${monster.name}'s attack reduced by 2!</div>`;
                break;
                
            case 'void_dodge':
                this.voidDodgeActive = 1;
                log.innerHTML += `<div class="log-entry success">You phase into the void! Next attack will miss!</div>`;
                break;
        }
        
        if (monster.health <= 0) {
            this.victory(monster);
            return;
        }
    }

    playerFlee(monsterId) {
        const fleeRoll = this.rollDice(20, this.playerStats.luck);
        const monsterRoll = this.rollDice(20, 10);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You attempt to flee! Roll: ${fleeRoll.roll} + ${fleeRoll.modifier} = ${fleeRoll.total}</div>`;
        
        if (fleeRoll.total > monsterRoll.total) {
            log.innerHTML += `<div class="log-entry success">You successfully flee!</div>`;
            this.hideModal();
        } else {
            log.innerHTML += `<div class="log-entry miss">You can't escape! ${monster.name} blocks your path!</div>`;
            this.playerTurn = false;
            setTimeout(() => this.monsterTurn(monsterId), 1000);
        }
    }

    monsterTurn(monster) {
        const log = document.getElementById('battle-log');
        
        // Check for stunned status
        if (monster.stunned && monster.stunned > 0) {
            monster.stunned--;
            log.innerHTML += `<div class="log-entry">${monster.name} is stunned and cannot act!</div>`;
            this.playerTurn = true;
            return;
        }
        
        // Check for void dodge
        if (this.voidDodgeActive && this.voidDodgeActive > 0) {
            this.voidDodgeActive--;
            log.innerHTML += `<div class="log-entry success">You phase through ${monster.name}'s attack!</div>`;
            this.playerTurn = true;
            return;
        }
        
        const attackRoll = this.rollDice(20, monster.attack);
        const defenseRoll = this.rollDice(20, this.playerStats.defense);
        
        log.innerHTML += `<div class="log-entry">${monster.name} attacks! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">You defend! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            let damage = this.rollDice(6, monster.attack);
            
            // Apply reality anchor damage reduction
            if (this.realityAnchored && this.realityAnchored > 0) {
                damage.total = Math.floor(damage.total * 0.5);
                this.realityAnchored--;
                log.innerHTML += `<div class="log-entry">Reality anchor reduces damage by 50%!</div>`;
            }
            
            this.loseHealth(damage.total, `${monster.name}'s attack strikes true!`);
            log.innerHTML += `<div class="log-entry danger">Hit! ${monster.name} deals ${damage.total} damage!</div>`;
            
            // Some monsters also cause sanity damage
            if (monster.sanityDamage) {
                const sanityLoss = this.rollDice(4, monster.sanityDamage);
                this.loseSanity(sanityLoss.total, `The eldritch nature of ${monster.name} assaults your mind!`);
                log.innerHTML += `<div class="log-entry danger">Your sanity trembles! -${sanityLoss.total} sanity!</div>`;
            }
            
            if (this.playerStats.health <= 0) {
                this.defeat(monster);
                return;
            }
        } else {
            log.innerHTML += `<div class="log-entry miss">Miss! You dodge ${monster.name}'s attack!</div>`;
        }
        
        // Update cooldowns
        if (this.abilityCooldowns) {
            Object.keys(this.abilityCooldowns).forEach(ability => {
                if (this.abilityCooldowns[ability] > 0) {
                    this.abilityCooldowns[ability]--;
                }
            });
        }
        
        this.playerTurn = true;
        this.updateHealthBars();
    }

    victory(monster) {
        const monsterData = this.stories.monster[monster.type] || this.stories.monster.shadowStalker;
        const experience = monster.experience || 50;
        
        // Generate random loot using item system
        const lootResult = this.itemSystem.generateRandomLoot('monster');
        const lootItem = lootResult.item;
        
        // Add experience and item
        this.gainExperience(experience, 'Monster defeated');
        this.itemSystem.addToInventory(lootResult.itemId, 1);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry victory">${monsterData.victory}</div>`;
        log.innerHTML += `<div class="log-entry reward">You gain ${experience} experience!</div>`;
        log.innerHTML += `<div class="log-entry reward">You found: ${lootItem.name} (${lootResult.rarity})</div>`;
        log.innerHTML += `<div class="log-entry reward">${lootItem.description}</div>`;
        
        // Gain some sanity back from victory
        this.gainSanity(5, `Victory over ${monster.name} restores your cosmic confidence!`);
        
        // Update quest progress
        this.updateQuestProgress('encounter', 'monster');
        
        setTimeout(() => {
            this.hideModal();
            this.showRewards(experience, [lootItem.name]);
        }, 2000);
    }

    defeat(monster) {
        const monsterData = this.stories.monster[monster.type] || this.stories.monster.shadowStalker;
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry defeat">${monsterData.defeat}</div>`;
        log.innerHTML += `<div class="log-entry">You are defeated! Your health will regenerate over time.</div>`;
        
        // Regenerate health
        this.playerStats.health = Math.floor(this.playerStats.maxHealth * 0.5);
        
        setTimeout(() => {
            this.hideModal();
        }, 3000);
    }

    updateHealthBars() {
        // Update main UI health/sanity bars
        const mainHealthFill = document.getElementById('health-fill');
        const mainSanityFill = document.getElementById('sanity-fill');
        const mainHealthValue = document.getElementById('health-value');
        const mainSanityValue = document.getElementById('sanity-value');
        const healthExplanation = document.getElementById('health-explanation');
        const sanityExplanation = document.getElementById('sanity-explanation');
        
        if (mainHealthFill) {
            mainHealthFill.style.width = `${(this.playerStats.health / this.playerStats.maxHealth) * 100}%`;
        }
        
        if (mainSanityFill) {
            mainSanityFill.style.width = `${(this.playerStats.sanity / this.playerStats.maxSanity) * 100}%`;
        }
        
        if (mainHealthValue) {
            mainHealthValue.textContent = `${Math.floor(this.playerStats.health)}/${Math.floor(this.playerStats.maxHealth)}`;
        }
        
        if (mainSanityValue) {
            mainSanityValue.textContent = `${Math.floor(this.playerStats.sanity)}/${Math.floor(this.playerStats.maxSanity)}`;
        }
        
        // Update health explanation
        if (healthExplanation) {
            healthExplanation.textContent = this.getHealthExplanation();
        }
        
        // Update sanity explanation
        if (sanityExplanation) {
            sanityExplanation.textContent = this.getSanityExplanation();
        }
        
        // Update steps counter in header
        const stepsValue = document.getElementById('steps-value');
        if (stepsValue) {
            stepsValue.textContent = Math.floor(this.playerStats.steps);
        }
        
        
        // Update debug panel bars
        const playerHealthFill = document.querySelector('.health-fill');
        const playerSanityFill = document.querySelector('.sanity-fill');
        const monsterHealthFill = document.querySelector('.monster-health-fill');
        
        if (playerHealthFill) {
            playerHealthFill.style.width = `${(this.playerStats.health / this.playerStats.maxHealth) * 100}%`;
        }
        
        if (playerSanityFill) {
            playerSanityFill.style.width = `${(this.playerStats.sanity / this.playerStats.maxSanity) * 100}%`;
        }
        
        if (monsterHealthFill) {
            const monster = this.encounters.get(this.activeEncounter);
            if (monster) {
                monsterHealthFill.style.width = `${(monster.health / monster.maxHealth) * 100}%`;
            }
        }
    }
    
    getHealthExplanation() {
        const healthPercent = (this.playerStats.health / this.playerStats.maxHealth) * 100;
        
        if (healthPercent >= 90) {
            return "Perfect Health";
        } else if (healthPercent >= 80) {
            return "Excellent Health";
        } else if (healthPercent >= 70) {
            return "Good Health";
        } else if (healthPercent >= 60) {
            return "Fair Health";
        } else if (healthPercent >= 50) {
            return "Poor Health";
        } else if (healthPercent >= 40) {
            return "Bad Health";
        } else if (healthPercent >= 30) {
            return "Critical Health";
        } else if (healthPercent >= 20) {
            return "Near Death";
        } else if (healthPercent >= 10) {
            return "Dying";
        } else if (healthPercent > 0) {
            return "Almost Dead";
        } else {
            return "DEAD";
        }
    }
    
    getSanityExplanation() {
        const sanityPercent = (this.playerStats.sanity / this.playerStats.maxSanity) * 100;
        
        if (sanityPercent >= 90) {
            return "Perfect Sanity";
        } else if (sanityPercent >= 80) {
            return "Excellent Sanity";
        } else if (sanityPercent >= 70) {
            return "Good Sanity";
        } else if (sanityPercent >= 60) {
            return "Fair Sanity";
        } else if (sanityPercent >= 50) {
            return "Poor Sanity";
        } else if (sanityPercent >= 40) {
            return "Bad Sanity";
        } else if (sanityPercent >= 30) {
            return "Critical Sanity";
        } else if (sanityPercent >= 20) {
            return "Near Madness";
        } else if (sanityPercent >= 10) {
            return "Madness";
        } else if (sanityPercent > 0) {
            return "Complete Madness";
        } else {
            return "MADNESS";
        }
    }
}

// Make it globally available
window.EncounterSystem = EncounterSystem;
