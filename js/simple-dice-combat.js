/**
 * Simple Dice Combat System
 * Replaces complex combat with simple dice roll animations
 */

class SimpleDiceCombat {
    constructor() {
        this.isCombatActive = false;
        this.combatData = null;
        this.diceAnimationDuration = 1500; // 1.5 seconds
    }

    /**
     * Start a simple dice combat encounter
     * @param {Object} enemy - Enemy data
     * @param {Function} onWin - Callback when player wins
     * @param {Function} onLose - Callback when player loses
     */
    startCombat(enemy, onWin, onLose) {
        console.log('🎲 Starting simple dice combat with:', enemy.name);
        
        this.isCombatActive = true;
        this.combatData = {
            enemy: enemy,
            onWin: onWin,
            onLose: onLose,
            playerRoll: null,
            enemyRoll: null
        };

        this.showCombatModal();
    }

    /**
     * Show the combat modal with dice interface
     */
    showCombatModal() {
        // Remove existing modal if present
        const existingModal = document.getElementById('simple-combat-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'simple-combat-modal';
        modal.className = 'simple-combat-modal';
        
        modal.innerHTML = `
            <div class="combat-content">
                <div class="combat-header">
                    <h3>🎲 Dice Combat</h3>
                    <p>Face off against ${this.combatData.enemy.name}!</p>
                    <button class="close-btn" onclick="window.simpleDiceCombat.endCombat()">×</button>
                </div>
                
                <div class="dice-interface">
                    <div class="dice-container">
                        <div class="dice-section player-dice">
                            <h4>Your Roll</h4>
                            <div class="dice" id="player-dice">
                                <div class="dice-face">?</div>
                            </div>
                            <div class="dice-result" id="player-result">Rolling...</div>
                        </div>
                        
                        <div class="vs-divider">VS</div>
                        
                        <div class="dice-section enemy-dice">
                            <h4>${this.combatData.enemy.name}</h4>
                            <div class="dice" id="enemy-dice">
                                <div class="dice-face">?</div>
                            </div>
                            <div class="dice-result" id="enemy-result">Rolling...</div>
                        </div>
                    </div>
                    
                    <div class="combat-actions">
                        <button id="roll-dice-btn" class="roll-btn" onclick="window.simpleDiceCombat.rollDice()">
                            🎲 Roll Dice!
                        </button>
                        <button id="flee-btn" class="flee-btn" onclick="window.simpleDiceCombat.flee()">
                            🏃 Flee
                        </button>
                    </div>
                    
                    <div class="combat-log" id="combat-log">
                        <div class="log-entry">🎲 Combat begins! Roll the dice to determine the winner!</div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        if (window.soundManager) {
            try { window.soundManager.playEerieHum({ duration: 2.0 }); } catch (e) {}
        }
        
        // Start the dice rolling animation
        this.animateDiceRoll();
    }

    /**
     * Animate dice rolling with visual effects
     */
    animateDiceRoll() {
        const playerDice = document.getElementById('player-dice');
        const enemyDice = document.getElementById('enemy-dice');
        const rollBtn = document.getElementById('roll-dice-btn');
        
        // Disable roll button during animation
        rollBtn.disabled = true;
        rollBtn.textContent = '🎲 Rolling...';
        
        // Add rolling animation class
        playerDice.classList.add('rolling');
        enemyDice.classList.add('rolling');
        
        // Animate dice faces during roll
        let animationCount = 0;
        const maxAnimations = 20;
        const animationInterval = setInterval(() => {
            // Random dice faces during animation
            const playerFace = Math.floor(Math.random() * 6) + 1;
            const enemyFace = Math.floor(Math.random() * 6) + 1;
            
            playerDice.querySelector('.dice-face').textContent = playerFace;
            enemyDice.querySelector('.dice-face').textContent = enemyFace;
            
            animationCount++;
            
            if (animationCount >= maxAnimations) {
                clearInterval(animationInterval);
                this.finishDiceRoll();
            }
        }, 75); // 75ms intervals for smooth animation
    }

    /**
     * Finish the dice roll and determine winner
     */
    finishDiceRoll() {
        // Generate final dice rolls
        this.combatData.playerRoll = Math.floor(Math.random() * 6) + 1;
        this.combatData.enemyRoll = Math.floor(Math.random() * 6) + 1;
        
        const playerDice = document.getElementById('player-dice');
        const enemyDice = document.getElementById('enemy-dice');
        const playerResult = document.getElementById('player-result');
        const enemyResult = document.getElementById('enemy-result');
        const rollBtn = document.getElementById('roll-dice-btn');
        
        // Remove rolling animation
        playerDice.classList.remove('rolling');
        enemyDice.classList.remove('rolling');
        
        // Set final dice faces
        playerDice.querySelector('.dice-face').textContent = this.combatData.playerRoll;
        enemyDice.querySelector('.dice-face').textContent = this.combatData.enemyRoll;
        
        // Update result displays
        playerResult.textContent = this.combatData.playerRoll;
        enemyResult.textContent = this.combatData.enemyRoll;
        
        // Determine winner
        this.determineWinner();
        
        // Re-enable roll button for another round if needed
        rollBtn.disabled = false;
        rollBtn.textContent = '🎲 Roll Again!';
    }

    /**
     * Determine combat winner and handle result
     */
    determineWinner() {
        const log = document.getElementById('combat-log');
        const playerRoll = this.combatData.playerRoll;
        const enemyRoll = this.combatData.enemyRoll;
        
        let resultMessage = '';
        let isPlayerWin = false;
        
        if (playerRoll > enemyRoll) {
            resultMessage = `🎉 You win! ${playerRoll} beats ${enemyRoll}!`;
            isPlayerWin = true;
            this.addLogEntry(resultMessage, 'success');
        } else if (enemyRoll > playerRoll) {
            resultMessage = `💀 You lose! ${enemyRoll} beats ${playerRoll}!`;
            isPlayerWin = false;
            this.addLogEntry(resultMessage, 'danger');
        } else {
            resultMessage = `🤝 It's a tie! Both rolled ${playerRoll}!`;
            this.addLogEntry(resultMessage, 'warning');
            // On tie, roll again after a short delay
            setTimeout(() => {
                this.addLogEntry('🎲 Rolling again to break the tie...', 'info');
                this.animateDiceRoll();
            }, 2000);
            return;
        }
        
        // Handle win/lose result
        setTimeout(() => {
            if (isPlayerWin) {
                this.handleWin();
            } else {
                this.handleLose();
            }
        }, 2000);
    }

    /**
     * Handle player victory
     */
    handleWin() {
        console.log('🎉 Player wins dice combat!');
        this.addLogEntry('🎉 Victory! You have defeated your opponent!', 'success');
        if (window.soundManager) {
            try { window.soundManager.playBling({ frequency: 1700, duration: 0.22, type: 'triangle' }); } catch (e) {}
        }
        
        // Call win callback
        if (this.combatData.onWin) {
            this.combatData.onWin(this.combatData.enemy);
        }
        
        // End combat after showing result
        setTimeout(() => {
            this.endCombat();
        }, 3000);
    }

    /**
     * Handle player defeat
     */
    handleLose() {
        console.log('💀 Player loses dice combat!');
        this.addLogEntry('💀 Defeat! Your opponent has bested you!', 'danger');
        if (window.soundManager) {
            try { window.soundManager.playTerrifyingBling(); } catch (e) {}
        }
        
        // Call lose callback
        if (this.combatData.onLose) {
            this.combatData.onLose(this.combatData.enemy);
        }
        
        // End combat after showing result
        setTimeout(() => {
            this.endCombat();
        }, 3000);
    }

    /**
     * Handle player fleeing
     */
    flee() {
        console.log('🏃 Player flees from combat!');
        this.addLogEntry('🏃 You flee from combat!', 'warning');
        
        // End combat immediately
        setTimeout(() => {
            this.endCombat();
        }, 1000);
    }

    /**
     * Add entry to combat log
     */
    addLogEntry(message, type = 'info') {
        const log = document.getElementById('combat-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = message;
        log.appendChild(entry);
        log.scrollTop = log.scrollHeight;
    }

    /**
     * End combat and clean up
     */
    endCombat() {
        this.isCombatActive = false;
        this.combatData = null;
        
        const modal = document.getElementById('simple-combat-modal');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Roll dice manually (called by button)
     */
    rollDice() {
        if (!this.isCombatActive) return;
        this.animateDiceRoll();
    }
}

// Initialize global instance
window.simpleDiceCombat = new SimpleDiceCombat();
