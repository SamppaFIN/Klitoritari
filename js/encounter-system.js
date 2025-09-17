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
    }

    init() {
        console.log('🎭 Encounter system initialized');
        this.isInitialized = true;
        this.startProximityDetection();
        this.setupUI();
        
        // Add some initial steps for testing
        this.addSteps(100);
        console.log('🎭 Added 100 initial steps for testing');
        
        // Create debug panel
        this.createDebugPanel();
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

    startProximityDetection() {
        this.proximityCheckInterval = setInterval(() => {
            this.checkProximityEncounters();
        }, 1000); // Check every second
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
            
            if (distance < 0.0005 && !monster.encountered) { // ~50m
                console.log('🎭 Monster encounter triggered!');
                monster.encountered = true;
                this.startMonsterEncounter(monster);
            }
        });
    }

    checkPOIProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.pointsOfInterest) return;
        
        window.eldritchApp.systems.mapEngine.pointsOfInterest.forEach(poi => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                poi.getLatLng().lat, poi.getLatLng().lng
            );
            
            if (distance < 0.0003 && !poi.encountered) { // ~30m
                poi.encountered = true;
                this.startPOIEncounter(poi);
            }
        });
    }

    checkMysteryProximity(playerPos) {
        if (!window.eldritchApp.systems.mapEngine.mysteryZoneMarkers) return;
        
        window.eldritchApp.systems.mapEngine.mysteryZoneMarkers.forEach(mystery => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                mystery.getLatLng().lat, mystery.getLatLng().lng
            );
            
            if (distance < 0.0004 && !mystery.encountered) { // ~40m
                mystery.encountered = true;
                this.startMysteryEncounter(mystery);
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
        
        this.showEncounterModal();
        this.showMonsterCutscene(monster);
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
}

// Make it globally available
window.EncounterSystem = EncounterSystem;
