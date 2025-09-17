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
        
        // Player stats
        this.playerStats = {
            health: 100,
            maxHealth: 100,
            attack: 15,
            defense: 10,
            luck: 12,
            experience: 0,
            level: 1,
            inventory: [],
            skills: {
                combat: 1,
                diplomacy: 1,
                investigation: 1,
                survival: 1
            }
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
    }

    init() {
        console.log('🎭 Encounter system initialized');
        this.isInitialized = true;
        this.startProximityDetection();
        this.setupUI();
        
        // Add some initial steps for testing
        this.addSteps(100);
        console.log('🎭 Added 100 initial steps for testing');
        
        // Create debug panel (hidden by default, use unified panel instead)
        this.createDebugPanel();
        this.hideIndividualDebugPanel();
    }

    setupUI() {
        // Create encounter UI elements
        this.createEncounterModal();
        this.createStepCounter();
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

    createStepCounter() {
        const existingCounter = document.getElementById('step-counter');
        if (existingCounter) {
            existingCounter.remove();
        }

        const counter = document.createElement('div');
        counter.id = 'step-counter';
        counter.className = 'step-counter';
        counter.innerHTML = `
            <div class="step-icon">👣</div>
            <div class="step-value">${this.playerSteps}</div>
            <div class="step-label">Steps</div>
        `;
        
        document.body.appendChild(counter);
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
        panel.innerHTML = `
            <div class="debug-content">
                <h3>🎭 Debug Panel</h3>
                <button id="test-monster" class="debug-btn">Test Monster Encounter</button>
                <button id="test-poi" class="debug-btn">Test POI Encounter</button>
                <button id="test-mystery" class="debug-btn">Test Mystery Encounter</button>
                <button id="add-steps" class="debug-btn">Add 50 Steps</button>
                <button id="toggle-debug" class="debug-btn">Toggle Debug Panel</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('test-monster').addEventListener('click', () => this.triggerMonsterEncounter());
        document.getElementById('test-poi').addEventListener('click', () => this.triggerPOIEncounter());
        document.getElementById('test-mystery').addEventListener('click', () => this.triggerMysteryEncounter());
        document.getElementById('add-steps').addEventListener('click', () => this.addSteps(50));
        document.getElementById('toggle-debug').addEventListener('click', () => {
            panel.classList.toggle('hidden');
        });
    }

    hideIndividualDebugPanel() {
        const panel = document.getElementById('debug-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
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
        
        this.activeEncounter = {
            type: this.encounterTypes.MYSTERY,
            data: mystery
        };
        
        this.showEncounterModal();
        this.showMysteryCutscene(mystery);
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
        const counter = document.getElementById('step-counter');
        if (counter) {
            counter.querySelector('.step-value').textContent = this.playerSteps;
        }
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
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine.monsters.length > 0) {
            const monster = window.eldritchApp.systems.mapEngine.monsters[0];
            this.startMonsterEncounter(monster);
        }
    }

    triggerPOIEncounter() {
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine.pointsOfInterest.length > 0) {
            const poi = window.eldritchApp.systems.mapEngine.pointsOfInterest[0];
            this.startPOIEncounter(poi);
        }
    }

    triggerMysteryEncounter() {
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.size > 0) {
            const mystery = Array.from(window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.values())[0];
            this.startMysteryEncounter(mystery);
        }
    }

    initializeStories() {
        return {
            monster: {
                shadowStalker: {
                    name: "Shadow Stalker",
                    description: "A creature born from the darkness between dimensions, the Shadow Stalker hunts those who venture too close to the cosmic rifts. Its form shifts and writhes like living smoke, and its eyes burn with the cold fire of the void.",
                    intro: "The air grows cold as shadows begin to move independently around you. A figure materializes from the darkness - tall, gaunt, and radiating an otherworldly menace. The Shadow Stalker has found its prey.",
                    combatIntro: "The Shadow Stalker lets out a bone-chilling shriek as it lunges forward, its form becoming more solid as it prepares for battle!",
                    victory: "The Shadow Stalker shrieks in agony as your attack strikes true! It dissolves into wisps of dark smoke, leaving behind only a faint whisper on the wind.",
                    defeat: "The Shadow Stalker's claws find their mark, and you feel your consciousness slipping away as the darkness claims you...",
                    loot: ["Shadow Essence", "Void Crystal", "Dark Knowledge"]
                },
                cosmicBeast: {
                    name: "Cosmic Beast",
                    description: "A magnificent creature that has adapted to the cosmic energies of this realm. Its scales shimmer with starlight, and its roar echoes across dimensions.",
                    intro: "A massive creature emerges from a shimmering portal - its form is both beautiful and terrifying. The Cosmic Beast has been drawn by the cosmic energies in this area.",
                    combatIntro: "The Cosmic Beast roars, and you feel the very fabric of space tremble around you! It charges forward with cosmic fury!",
                    victory: "The Cosmic Beast's roar turns to a whimper as it falls. Starlight pours from its wounds, and you feel a surge of cosmic energy.",
                    defeat: "The Cosmic Beast's cosmic power overwhelms you, and you collapse under the weight of its otherworldly might...",
                    loot: ["Starlight Scale", "Cosmic Essence", "Dimensional Fragment"]
                },
                voidWalker: {
                    name: "Void Walker",
                    description: "An entity that exists in the spaces between reality. It appears as a humanoid figure wrapped in shifting darkness, with eyes that show the infinite void.",
                    intro: "Reality itself seems to tear as a figure steps through the fabric of space. The Void Walker has crossed dimensions to reach this place.",
                    combatIntro: "The Void Walker's form becomes more solid as it prepares for combat, its void-touched claws extending menacingly!",
                    victory: "The Void Walker's form begins to unravel, returning to the void from whence it came. You feel a strange sense of completion.",
                    defeat: "The Void Walker's touch sends you spiraling into the void, your consciousness fading into nothingness...",
                    loot: ["Void Fragment", "Dimensional Tear", "Void Knowledge"]
                },
                energyPhantom: {
                    name: "Energy Phantom",
                    description: "A being of pure energy that has gained consciousness. It crackles with electrical power and moves with the speed of lightning.",
                    intro: "The air crackles with energy as a being of pure electricity materializes before you. The Energy Phantom pulses with raw power.",
                    combatIntro: "The Energy Phantom crackles with electrical fury, bolts of lightning arcing around it as it prepares to strike!",
                    victory: "The Energy Phantom explodes in a shower of sparks, leaving behind pure energy crystals that pulse with power.",
                    defeat: "Electricity courses through your body as the Energy Phantom's power overwhelms you, leaving you unconscious...",
                    loot: ["Energy Crystal", "Lightning Essence", "Power Fragment"]
                },
                crystalGuardian: {
                    name: "Crystal Guardian",
                    description: "An ancient construct of living crystal that has stood guard over this area for centuries. Its form is both beautiful and deadly.",
                    intro: "A massive crystal formation begins to move, revealing itself as a living guardian. The Crystal Guardian has awakened to protect its domain.",
                    combatIntro: "The Crystal Guardian's form shimmers as it prepares for battle, its crystalline structure becoming more defined!",
                    victory: "The Crystal Guardian shatters into beautiful fragments, each one pulsing with ancient magic and wisdom.",
                    defeat: "The Crystal Guardian's crystalline structure proves too strong, and you are overwhelmed by its ancient power...",
                    loot: ["Crystal Shard", "Ancient Wisdom", "Guardian Essence"]
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

    // Dice rolling system
    rollDice(sides = 20, modifier = 0) {
        const roll = Math.floor(Math.random() * sides) + 1;
        const total = roll + modifier;
        return { roll, modifier, total };
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
        
        const attackRoll = this.rollDice(20, this.playerStats.attack);
        const defenseRoll = this.rollDice(20, monster.defense);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry">You attack! Roll: ${attackRoll.roll} + ${attackRoll.modifier} = ${attackRoll.total}</div>`;
        log.innerHTML += `<div class="log-entry">${monster.name} defends! Roll: ${defenseRoll.roll} + ${defenseRoll.modifier} = ${defenseRoll.total}</div>`;
        
        if (attackRoll.total > defenseRoll.total) {
            const damage = this.rollDice(8, this.playerStats.attack);
            monster.health -= damage.total;
            log.innerHTML += `<div class="log-entry success">Hit! You deal ${damage.total} damage!</div>`;
            
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
            this.playerStats.health -= damage.total;
            log.innerHTML += `<div class="log-entry danger">Hit! ${monster.name} deals ${damage.total} damage!</div>`;
            
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
        const loot = monsterData.loot || ["Mysterious Item"];
        
        this.playerStats.experience += experience;
        this.playerStats.inventory.push(...loot);
        
        const log = document.getElementById('battle-log');
        log.innerHTML += `<div class="log-entry victory">${monsterData.victory}</div>`;
        log.innerHTML += `<div class="log-entry reward">You gain ${experience} experience!</div>`;
        log.innerHTML += `<div class="log-entry reward">You found: ${loot.join(", ")}</div>`;
        
        setTimeout(() => {
            this.hideModal();
            this.showRewards(experience, loot);
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
        const playerHealthFill = document.querySelector('.health-fill');
        const monsterHealthFill = document.querySelector('.monster-health-fill');
        
        if (playerHealthFill) {
            playerHealthFill.style.width = `${(this.playerStats.health / this.playerStats.maxHealth) * 100}%`;
        }
        
        if (monsterHealthFill) {
            const monster = this.encounters.get(this.activeEncounter);
            if (monster) {
                monsterHealthFill.style.width = `${(monster.health / monster.maxHealth) * 100}%`;
            }
        }
    }
}

// Make it globally available
window.EncounterSystem = EncounterSystem;
