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
        this.stepGainRate = 0.1; // Steps per position update
        this.lastPosition = null;
        
        // Initialize item system (disabled for testing)
        // this.itemSystem = new ItemSystem();
        
        // Initialize quest system (disabled for testing)
        // this.questSystem = new QuestSystem();
        
        // Player stats - The cosmic horror comedy begins!
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            sanity: 100,
            maxSanity: 100,
            steps: 0, // Integer only - no half steps in the cosmic realm!
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
            steps: 0,
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
        
        // Add some initial steps for testing
        this.addSteps(100);
        console.log('🎭 Added 100 initial steps for testing');
        
        // Debug panel disabled - using unified debug console instead
        // this.createDebugPanel();
    }

    setupUI() {
        // Create encounter UI elements
        this.createEncounterModal();
        this.createRewardsPanel();
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
                                <div class="stat-bar">
                                    <div class="stat-label">Steps:</div>
                                    <div class="stat-value" id="player-steps">0</div>
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
                            <button id="attack-btn" class="battle-btn">Attack (10 steps)</button>
                            <button id="defend-btn" class="battle-btn">Defend (5 steps)</button>
                            <button id="flee-btn" class="battle-btn">Flee (20 steps)</button>
                        </div>
                    </div>
                    <div id="puzzle-interface" class="puzzle-interface hidden">
                        <h3 id="puzzle-title">Puzzle</h3>
                        <div id="puzzle-content" class="puzzle-content"></div>
                        <div class="puzzle-actions">
                            <button id="submit-puzzle" class="puzzle-btn">Submit</button>
                            <button id="skip-puzzle" class="puzzle-btn">Skip (50 steps)</button>
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
                        <div class="stat-bar">
                            <span class="stat-label">Steps:</span>
                            <span class="stat-value">${this.playerStats.steps}</span>
                        </div>
                    </div>
                    
                    <div class="debug-controls">
                        <button id="test-monster" class="debug-btn">Test Monster</button>
                        <button id="heal-player" class="debug-btn">Heal Player</button>
                        <button id="restore-sanity" class="debug-btn">Restore Sanity</button>
                        <button id="lose-health" class="debug-btn">Lose 10 Health</button>
                        <button id="lose-sanity" class="debug-btn">Lose 10 Sanity</button>
                        <button id="add-steps" class="debug-btn">Add 50 Steps</button>
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
        document.getElementById('add-steps').addEventListener('click', () => this.addSteps(50));
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
        const stepsValue = document.querySelectorAll('.stat-value')[2];
        
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
        
        if (stepsValue) {
            stepsValue.textContent = this.playerStats.steps;
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
        }, 3000); // Check every 3 seconds to slow down encounters
    }

    checkProximityEncounters() {
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) {
            console.log('🎭 No app or geolocation system available');
            return;
        }
        
        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) {
            console.log('🎭 No player position available');
            return;
        }

        console.log('🎭 Checking proximity encounters at:', playerPos);

        // Check distance to all markers
        this.checkMonsterProximity(playerPos);
        this.checkPOIProximity(playerPos);
        this.checkMysteryProximity(playerPos);
        
        // Check for legendary encounters
        this.checkLegendaryEncounters(playerPos);
        
        // Check for proximity warnings (within 100m)
        this.checkProximityWarnings(playerPos);
    }

    checkMonsterProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.monsters) {
            console.log('🎭 No monsters available');
            return;
        }
        
        console.log('🎭 Checking', window.eldritchApp.systems.mapEngine.monsters.length, 'monsters');
        
        window.eldritchApp.systems.mapEngine.monsters.forEach((monster, index) => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                monster.lat, monster.lng
            );
            
            console.log(`🎭 Monster ${index} distance:`, distance, 'meters');
            
            if (distance < 50 && !monster.encountered) { // 50m
                console.log('🎭 Monster encounter triggered!');
                monster.encountered = true;
                this.startMonsterEncounter(monster);
            }
        });
    }

    checkPOIProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.pointsOfInterest) {
            console.log('🎭 No POIs available');
            return;
        }
        
        console.log('🎭 Checking', window.eldritchApp.systems.mapEngine.pointsOfInterest.length, 'POIs');
        
        window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach((poi, index) => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                poi.getLatLng().lat, poi.getLatLng().lng
            );
            
            console.log(`🎭 POI ${index} distance:`, distance, 'meters');
            
            if (distance < 50 && !poi.encountered) { // 50m
                console.log('🎭 POI encounter triggered!');
                poi.encountered = true;
                this.startPOIEncounter(poi);
            }
        });
    }

    checkMysteryProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.mysteryZoneMarkers) {
            console.log('🎭 No mystery zones available');
            return;
        }
        
        console.log('🎭 Checking', window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.length, 'mystery zones');
        
        window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.forEach((mystery, index) => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                mystery.getLatLng().lat, mystery.getLatLng().lng
            );
            
            console.log(`🎭 Mystery ${index} distance:`, distance, 'meters');
            
            if (distance < 50 && !mystery.encountered) { // 50m
                console.log('🎭 Mystery encounter triggered!');
                mystery.encountered = true;
                this.startMysteryEncounter(mystery);
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
                <p>+${encounter.quest.rewards.steps} Steps</p>
                <p>+${encounter.quest.rewards.items.join(', ')}</p>
                <p>Title: ${encounter.quest.rewards.title}</p>
            </div>
            <button onclick="this.closest('.encounter-modal').remove()" class="quest-close-btn">Continue Your Journey</button>
        `;

        // Apply rewards
        this.playerStats.experience += encounter.quest.rewards.experience;
        this.playerStats.steps += encounter.quest.rewards.steps;
        
        // Add items to inventory (if item system is available)
        if (window.itemSystem) {
            encounter.quest.rewards.items.forEach(item => {
                window.itemSystem.addToInventory(item, 1);
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
        
        // Show proximity warning if close
        if (closestDistance < 100 && closestDistance > 50) {
            this.showProximityWarning(closestType, Math.round(closestDistance));
        } else if (closestDistance >= 100) {
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
        
        const typeEmoji = type === 'monster' ? '👹' : type === 'poi' ? '💎' : '🔍';
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

    startMonsterEncounter(monster) {
        console.log('👹 Monster encounter started:', monster.type.name);
        
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

    startMysteryEncounter(mystery) {
        console.log('🔍 Mystery encounter started');
        
        // Check if this is a quest marker
        if (mystery.isQuestMarker) {
            console.log('🐙 Quest marker detected, starting quest system');
            this.startQuestEncounter(mystery);
            return;
        }
        
        this.activeEncounter = {
            type: this.encounterTypes.MYSTERY,
            data: mystery
        };
        
        this.showEncounterModal();
        this.showMysteryCutscene(mystery);
    }
    
    startQuestEncounter(questMarker) {
        console.log('🐙 Starting quest encounter for marker:', questMarker.questIndex);
        
        if (window.lovecraftianQuest) {
            // Start quest from the specific location
            window.lovecraftianQuest.startQuestFromLocation(questMarker.questIndex);
        } else {
            console.error('🐙 Lovecraftian quest system not available');
        }
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
            <button id="action-1" class="encounter-btn">Fight (10 steps)</button>
            <button id="action-2" class="encounter-btn">Try to Flee (20 steps)</button>
            <button id="action-3" class="encounter-btn">Observe (5 steps)</button>
        `;
        
        battle.classList.add('hidden');
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.startBattle(monster));
        document.getElementById('action-2').addEventListener('click', () => this.attemptFlee(monster));
        document.getElementById('action-3').addEventListener('click', () => this.observeMonster(monster));
    }

    showPOICutscene(poi) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        const puzzle = document.getElementById('puzzle-interface');
        
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
            <button id="action-1" class="encounter-btn">Investigate (15 steps)</button>
            <button id="action-2" class="encounter-btn">Take a Sample (10 steps)</button>
            <button id="action-3" class="encounter-btn">Leave (0 steps)</button>
        `;
        
        puzzle.classList.add('hidden');
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.startPOIPuzzle(poi));
        document.getElementById('action-2').addEventListener('click', () => this.samplePOI(poi));
        document.getElementById('action-3').addEventListener('click', () => this.leavePOI(poi));
    }

    showMysteryCutscene(mystery) {
        const dialog = document.getElementById('dialog-text');
        const actions = document.getElementById('encounter-actions');
        
        dialog.innerHTML = `
            <div class="cutscene-text">
                <h3>🔍 Mystery Zone Entered!</h3>
                <p>You've entered a mysterious area filled with cosmic energy.</p>
                <p>The air crackles with unknown power. What will you do?</p>
            </div>
        `;
        
        actions.innerHTML = `
            <button id="action-1" class="encounter-btn">Investigate (20 steps)</button>
            <button id="action-2" class="encounter-btn">Meditate (15 steps)</button>
            <button id="action-3" class="encounter-btn">Leave (0 steps)</button>
        `;
        
        // Re-add event listeners
        document.getElementById('action-1').addEventListener('click', () => this.investigateMystery(mystery));
        document.getElementById('action-2').addEventListener('click', () => this.meditateMystery(mystery));
        document.getElementById('action-3').addEventListener('click', () => this.leaveMystery(mystery));
    }

    startBattle(monster) {
        this.spendSteps(10);
        
        const battle = document.getElementById('battle-interface');
        const actions = document.getElementById('encounter-actions');
        
        battle.classList.remove('hidden');
        actions.classList.add('hidden');
        
        // Update battle UI
        document.getElementById('monster-name').textContent = monster.type.name;
        document.getElementById('monster-health').textContent = `${this.activeEncounter.battleState.monsterHealth}/100`;
        document.getElementById('player-health').textContent = `${this.activeEncounter.battleState.playerHealth}/100`;
        document.getElementById('player-steps').textContent = this.playerSteps;
    }

    battleAction(action) {
        const battleState = this.activeEncounter.battleState;
        
        switch(action) {
            case 'attack':
                this.spendSteps(10);
                const damage = Math.floor(Math.random() * 20) + 10;
                battleState.monsterHealth -= damage;
                document.getElementById('monster-health').textContent = `${battleState.monsterHealth}/100`;
                
                if (battleState.monsterHealth <= 0) {
                    this.winBattle();
                    return;
                }
                
                // Monster counter-attack
                this.monsterAttack();
                break;
                
            case 'defend':
                this.spendSteps(5);
                battleState.playerDefending = true;
                this.showDialog('You brace for impact!');
                break;
                
            case 'flee':
                this.spendSteps(20);
                this.fleeBattle();
                break;
        }
        
        document.getElementById('player-steps').textContent = this.playerSteps;
    }

    monsterAttack() {
        const battleState = this.activeEncounter.battleState;
        const damage = battleState.playerDefending ? 
            Math.floor(Math.random() * 10) + 5 : 
            Math.floor(Math.random() * 15) + 10;
            
        battleState.playerHealth -= damage;
        battleState.playerDefending = false;
        
        document.getElementById('player-health').textContent = `${battleState.playerHealth}/100`;
        
        if (battleState.playerHealth <= 0) {
            this.loseBattle();
        }
    }

    winBattle() {
        const stepsReward = Math.floor(Math.random() * 50) + 25;
        this.addSteps(stepsReward);
        
        this.showDialog(`Victory! You defeated the monster and gained ${stepsReward} steps!`);
        this.giveReward('steps', stepsReward);
        this.closeEncounter();
    }

    loseBattle() {
        this.showDialog('You were defeated! The monster was too strong...');
        this.closeEncounter();
    }

    fleeBattle() {
        this.showDialog('You successfully fled from the monster!');
        this.closeEncounter();
    }

    startPOIPuzzle(poi) {
        this.spendSteps(15);
        
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
            feedback.innerHTML = '<span style="color: green;">Correct! Well done!</span>';
            const stepsReward = Math.floor(Math.random() * 30) + 20;
            this.addSteps(stepsReward);
            this.giveReward('steps', stepsReward);
            this.giveReward('discoveries', 'Ancient Knowledge');
            
            setTimeout(() => {
                this.showDialog(`Puzzle solved! You gained ${stepsReward} steps and ancient knowledge!`);
                this.closeEncounter();
            }, 2000);
        } else {
            feedback.innerHTML = '<span style="color: red;">Incorrect. Try again!</span>';
        }
    }

    skipPuzzle() {
        this.spendSteps(50);
        this.showDialog('You skipped the puzzle but it cost you 50 steps.');
        this.closeEncounter();
    }

    // Action handlers
    handleAction(actionNum) {
        // This will be handled by specific encounter types
    }

    attemptFlee(monster) {
        this.spendSteps(20);
        const success = Math.random() < 0.7; // 70% chance
        
        if (success) {
            this.showDialog('You successfully fled from the monster!');
        } else {
            this.showDialog('The monster caught you! You must fight!');
            this.startBattle(monster);
        }
    }

    observeMonster(monster) {
        this.spendSteps(5);
        this.showDialog(`You observe the ${monster.type.name}. It seems ${monster.type.speed > 0.0001 ? 'agile' : 'slow'} and ${monster.type.color === '#4B0082' ? 'mysterious' : 'powerful'}.`);
        this.closeEncounter();
    }

    samplePOI(poi) {
        this.spendSteps(10);
        const stepsReward = Math.floor(Math.random() * 20) + 10;
        this.addSteps(stepsReward);
        this.giveReward('items', 'Mysterious Sample');
        this.showDialog(`You collected a sample and gained ${stepsReward} steps!`);
        this.closeEncounter();
    }

    leavePOI(poi) {
        this.showDialog('You leave the location without investigating.');
        this.closeEncounter();
    }

    investigateMystery(mystery) {
        this.spendSteps(20);
        const stepsReward = Math.floor(Math.random() * 40) + 30;
        this.addSteps(stepsReward);
        this.giveReward('experience', 50);
        this.giveReward('discoveries', 'Cosmic Insight');
        this.showDialog(`You investigated the mystery and gained ${stepsReward} steps and cosmic insight!`);
        this.closeEncounter();
    }

    meditateMystery(mystery) {
        this.spendSteps(15);
        const stepsReward = Math.floor(Math.random() * 25) + 15;
        this.addSteps(stepsReward);
        this.giveReward('experience', 25);
        this.showDialog(`You meditated and gained ${stepsReward} steps and inner peace!`);
        this.closeEncounter();
    }

    leaveMystery(mystery) {
        this.showDialog('You leave the mysterious area.');
        this.closeEncounter();
    }

    // Step management
    addSteps(amount) {
        this.playerSteps += amount;
        this.updateStepCounter();
        console.log(`👣 Gained ${amount} steps. Total: ${this.playerSteps}`);
    }

    spendSteps(amount) {
        if (this.playerSteps >= amount) {
            this.playerSteps -= amount;
            this.updateStepCounter();
            console.log(`👣 Spent ${amount} steps. Remaining: ${this.playerSteps}`);
            return true;
        } else {
            this.showDialog('Not enough steps!');
            return false;
        }
    }

    updateStepCounter() {
        // Sync with player stats and check for death
        this.playerStats.steps = this.playerSteps;
        this.checkPlayerDeath();
    }

    // Death mechanics - because cosmic horror is no joke... or is it?
    checkPlayerDeath() {
        if (this.playerStats.health <= 0) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "Your physical form has been consumed by the cosmic void. The eldritch entities found your health bar... lacking.";
            this.handlePlayerDeath();
        } else if (this.playerStats.sanity <= 0) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "Your mind has shattered like a cosmic egg dropped from the 47th dimension. The forbidden knowledge was simply too much to bear.";
            this.handlePlayerDeath();
        } else if (this.playerStats.steps <= 0) {
            this.playerStats.isDead = true;
            this.playerStats.deathReason = "You have run out of steps in the cosmic dance of existence. Even the eldritch entities are impressed by your dedication to standing still.";
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
        const deathModal = document.createElement('div');
        deathModal.id = 'death-modal';
        deathModal.className = 'death-modal';
        deathModal.innerHTML = `
            <div class="death-content">
                <div class="death-header">
                    <h2>💀 Cosmic Demise</h2>
                </div>
                <div class="death-message">
                    <p>${this.playerStats.deathReason}</p>
                    <p class="death-subtitle">The cosmic realm is not without mercy... mostly.</p>
                </div>
                <div class="death-actions">
                    <button class="death-btn" onclick="window.encounterSystem.resurrectPlayer()">
                        🌌 Embrace Cosmic Rebirth
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(deathModal);
    }

    resurrectPlayer() {
        const deathModal = document.getElementById('death-modal');
        if (deathModal) {
            deathModal.remove();
        }
        
        // Update UI
        this.updateHealthBars();
        this.updateStepCounter();
        
        console.log('🌌 Player resurrected with cosmic mercy!');
    }

    // Sanity system - because knowing too much is... problematic
    loseSanity(amount, reason = "The cosmic truth weighs heavily on your mind.") {
        this.playerStats.sanity = Math.max(0, this.playerStats.sanity - amount);
        console.log(`🧠 Sanity lost: ${amount}. Reason: ${reason}`);
        
        // Check for sanity effects
        if (this.playerStats.sanity < 30) {
            console.log('⚠️ Warning: Your sanity is dangerously low! The cosmic entities are starting to look... reasonable.');
        }
        
        this.updateHealthBars();
        this.checkPlayerDeath();
    }

    gainSanity(amount, reason = "A moment of clarity in the cosmic chaos.") {
        this.playerStats.sanity = Math.min(this.playerStats.maxSanity, this.playerStats.sanity + amount);
        console.log(`🧠 Sanity gained: ${amount}. Reason: ${reason}`);
        
        this.updateHealthBars();
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
        modal.classList.remove('hidden');
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
                const stepsGained = Math.floor(distance / 10) * this.stepGainRate;
                this.addSteps(stepsGained);
            }
        }
        
        this.lastPosition = position;
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

    triggerMysteryEncounter() {
        console.log('🎭 Triggering mystery encounter...');
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.size > 0) {
            const mystery = Array.from(window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.values())[0];
            this.startMysteryEncounter(mystery);
        } else {
            console.log('🎭 No mysteries available, creating test mystery...');
            // Create a test mystery for demonstration
            const testMystery = {
                id: 'test_mystery',
                name: 'Test Cosmic Rift',
                type: 'cosmicRift',
                description: 'A swirling portal to another dimension'
            };
            this.startMysteryEncounter(testMystery);
        }
    }

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

    // Enhanced combat system with dice
    startDiceCombat(monster) {
        const monsterData = this.stories.monster[monster.type] || this.stories.monster.shadowStalker;
        
        this.showModal();
        this.encounterType = 'battle';
        
        const modal = document.getElementById('encounter-modal');
        modal.innerHTML = `
            <div class="encounter-content">
                <div class="encounter-header">
                    <h3>⚔️ ${monsterData.name}</h3>
                    <button class="close-btn" onclick="window.encounterSystem.hideModal()">×</button>
                </div>
                <div class="encounter-dialog">
                    <div class="story-text">${monsterData.combatIntro}</div>
                </div>
                <div class="battle-interface">
                    <div class="battle-stats">
                        <div class="player-stats">
                            <h4>Your Stats</h4>
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
                            <div class="stat-item">
                                <span class="stat-label">Attack:</span>
                                <span class="stat-value">${this.playerStats.attack}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Defense:</span>
                                <span class="stat-value">${this.playerStats.defense}</span>
                            </div>
                        </div>
                        <div class="monster-stats">
                            <h4>${monsterData.name}</h4>
                            <div class="stat-bar">
                                <span class="stat-label">Health:</span>
                                <div class="health-bar">
                                    <div class="monster-health-fill" style="width: ${(monster.health / monster.maxHealth) * 100}%"></div>
                                </div>
                                <span class="stat-value">${monster.health}/${monster.maxHealth}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Attack:</span>
                                <span class="stat-value">${monster.attack}</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Defense:</span>
                                <span class="stat-value">${monster.defense}</span>
                            </div>
                        </div>
                    </div>
                    <div class="battle-actions">
                        <button class="battle-btn" onclick="window.encounterSystem.playerAttack('${monster.id}')">⚔️ Attack</button>
                        <button class="battle-btn" onclick="window.encounterSystem.playerDefend('${monster.id}')">🛡️ Defend</button>
                        <button class="battle-btn" onclick="window.encounterSystem.playerFlee('${monster.id}')">🏃 Flee</button>
                        <button class="battle-btn" onclick="window.encounterSystem.useItem('${monster.id}')">🧪 Use Item</button>
                    </div>
                    <div class="battle-log" id="battle-log">
                        <div class="log-entry">Battle begins! Roll for initiative...</div>
                    </div>
                </div>
            </div>
        `;
        
        // Roll for initiative
        this.rollInitiative(monster);
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
        const totalAttack = this.playerStats.attack + weaponAttack;
        
        const attackRoll = this.rollDice(20, totalAttack);
        const defenseRoll = this.rollDice(20, monster.defense);
        
        const log = document.getElementById('battle-log');
        const weaponName = equippedWeapon ? ` with ${equippedWeapon.name}` : '';
        log.innerHTML += `<div class="log-entry">You attack${weaponName}! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">${monster.name} defends! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            const damage = this.rollDice(8, totalAttack);
            monster.health -= damage.total;
            log.innerHTML += `<div class="log-entry success">Hit! You deal ${damage.total} damage!</div>`;
            
            // Apply weapon effects
            if (equippedWeapon && equippedWeapon.effects) {
                this.applyWeaponEffects(equippedWeapon, monster, log);
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
    applyWeaponEffects(weapon, monster, log) {
        weapon.effects.forEach(effect => {
            switch (effect) {
                case 'void_damage':
                    const voidDamage = this.rollDice(4, 2);
                    monster.health -= voidDamage.total;
                    log.innerHTML += `<div class="log-entry success">Void damage! +${voidDamage.total} damage!</div>`;
                    break;
                case 'tentacle_whisper':
                    log.innerHTML += `<div class="log-entry">The tentacle whispers: "Why don't cosmic entities ever get cold? Because they're always in their element!"</div>`;
                    break;
                case 'starlight_arrows':
                    log.innerHTML += `<div class="log-entry">Starlight arrows pierce through ${monster.name}'s defenses!</div>`;
                    break;
                case 'reality_breach':
                    log.innerHTML += `<div class="log-entry">Reality tears around ${monster.name}! It looks confused!</div>`;
                    monster.defense -= 2; // Reduce defense
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
        const attackRoll = this.rollDice(20, monster.attack);
        const defenseRoll = this.rollDice(20, this.playerStats.defense);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">${monster.name} attacks! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">You defend! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            const damage = this.rollDice(6, monster.attack);
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
        this.playerStats.experience += experience;
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
