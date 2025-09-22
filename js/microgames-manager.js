/**
 * Microgames Manager - Lightweight mini-games for quest interactions
 * Includes dice, trivia, and Tetris stub with animations
 */

class MicrogamesManager {
    constructor() {
        this.activeGame = null;
        this.currentOverlay = null;
        this.scores = {
            dice: 0,
            trivia: 0,
            tetris: 0
        };
        this.sessionKey = this.computeSessionKey();
    }

    init() {
        console.log('🎮 Microgames Manager initialized');
        // Load scores from localStorage
        this.loadScores();
    }

    computeSessionKey() {
        try {
            const ua = navigator.userAgent || 'ua';
            const day = new Date().toISOString().slice(0,10);
            return `sess_${btoa(ua + '|' + day).slice(0,16)}`;
        } catch (_) {
            return 'sess_default';
        }
    }

    loadScores() {
        try {
            const saved = localStorage.getItem('eldritch-microgame-scores');
            if (saved) {
                this.scores = { ...this.scores, ...JSON.parse(saved) };
            }
        } catch (e) {
            console.warn('🎮 Failed to load microgame scores', e);
        }
    }

    saveScores() {
        try {
            localStorage.setItem('eldritch-microgame-scores', JSON.stringify(this.scores));
        } catch (e) {
            console.warn('🎮 Failed to save microgame scores', e);
        }
    }

    // Main entry point for starting microgames
    startGame(gameType, options = {}) {
        if (this.activeGame) {
            this.endGame();
        }

        switch (gameType) {
            case 'dice':
                return this.startDiceGame(options);
            case 'trivia':
                return this.startTriviaGame(options);
            case 'tetris':
                return this.startTetrisGame(options);
            default:
                console.warn('🎮 Unknown game type:', gameType);
                return false;
        }
    }

    endGame() {
        if (this.currentOverlay) {
            this.currentOverlay.remove();
            this.currentOverlay = null;
        }
        this.activeGame = null;
        if (window.soundManager) {
            try { window.soundManager.resumeAmbience('microgame'); } catch (e) {}
        }
    }

    // Dice Game - Simple dice rolling with animations
    startDiceGame({ target = 6, rolls = 3, onComplete = null } = {}) {
        this.activeGame = 'dice';
        if (window.soundManager) {
            try { window.soundManager.pauseAmbience('microgame'); } catch (e) {}
        }

        const overlay = document.createElement('div');
        overlay.className = 'microgame-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10002;
            display: flex; align-items: center; justify-content: center; font-family: 'Courier New', monospace;
        `;

        let currentRoll = 0;
        let total = 0;
        const results = [];

        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid #00ffff; border-radius: 15px; padding: 20px; text-align: center; color: white; max-width: 400px; width: 90%;">
                <h3 style="color: #00ffff; margin: 0 0 15px;">🎲 Dice Challenge</h3>
                <p style="margin: 0 0 15px;">Roll ${rolls} dice, try to reach ${target} or higher!</p>
                <div id="dice-container" style="display: flex; gap: 10px; justify-content: center; margin: 20px 0;">
                    ${Array(rolls).fill(0).map((_, i) => `
                        <div class="dice" id="dice-${i}" style="width: 60px; height: 60px; background: #fff; border: 2px solid #00ffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: bold; color: #000;">?</div>
                    `).join('')}
                </div>
                <div id="dice-status" style="margin: 15px 0; font-size: 16px;">Roll ${currentRoll + 1} of ${rolls}</div>
                <div id="dice-total" style="margin: 10px 0; font-size: 18px; font-weight: bold; color: #00ffff;">Total: ${total}</div>
                <button id="roll-btn" style="background: #00ffff; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin: 10px;">Roll Dice</button>
                <button id="close-btn" style="background: #ff6b6b; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer; margin: 10px;">Close</button>
            </div>
        `;

        document.body.appendChild(overlay);
        this.currentOverlay = overlay;

        const rollBtn = overlay.querySelector('#roll-btn');
        const closeBtn = overlay.querySelector('#close-btn');

        const rollDice = () => {
            if (currentRoll >= rolls) return;

            const diceValue = Math.floor(Math.random() * 6) + 1;
            results.push(diceValue);
            total += diceValue;

            const diceEl = overlay.querySelector(`#dice-${currentRoll}`);
            diceEl.textContent = diceValue;
            diceEl.style.animation = 'diceRoll 0.5s ease-out';

            currentRoll++;
            overlay.querySelector('#dice-status').textContent = currentRoll < rolls ? `Roll ${currentRoll + 1} of ${rolls}` : 'Complete!';
            overlay.querySelector('#dice-total').textContent = `Total: ${total}`;

            if (window.soundManager) {
                try { window.soundManager.playBling({ frequency: 800 + diceValue * 100, duration: 0.1 }); } catch (e) {}
            }

            if (currentRoll >= rolls) {
                rollBtn.textContent = 'Complete!';
                rollBtn.disabled = true;
                
                const success = total >= target;
                const message = success ? `🎉 Success! ${total} >= ${target}` : `💀 Failed! ${total} < ${target}`;
                overlay.querySelector('#dice-status').innerHTML = `<div style="color: ${success ? '#00ff00' : '#ff0000'}; font-weight: bold;">${message}</div>`;
                
                if (success) this.scores.dice++;
                this.saveScores();

                if (onComplete) {
                    setTimeout(() => {
                        onComplete(success, { total, target, results });
                        this.endGame();
                    }, 2000);
                }
            }
        };

        rollBtn.addEventListener('click', rollDice);
        closeBtn.addEventListener('click', () => this.endGame());

        // Auto-roll first dice
        setTimeout(rollDice, 500);
    }

    // Trivia Game - Simple Q&A with cosmic themes
    startTriviaGame({ questions = 3, onComplete = null } = {}) {
        this.activeGame = 'trivia';
        if (window.soundManager) {
            try { window.soundManager.pauseAmbience('microgame'); } catch (e) {}
        }

        const triviaQuestions = [
            {
                q: "What cosmic entity is known as the 'Dreamer in R'lyeh'?",
                options: ["Cthulhu", "Azathoth", "Nyarlathotep", "Yog-Sothoth"],
                correct: 0
            },
            {
                q: "In Lovecraftian lore, what color is the sun?",
                options: ["Yellow", "Red", "Green", "It varies by dimension"],
                correct: 2
            },
            {
                q: "What is the name of the cosmic horror that exists outside space and time?",
                options: ["Cthulhu", "Azathoth", "The Color Out of Space", "All of the above"],
                correct: 1
            },
            {
                q: "Which ancient text contains forbidden knowledge?",
                options: ["The Bible", "Necronomicon", "The Odyssey", "The Art of War"],
                correct: 1
            },
            {
                q: "What happens when you gaze upon the cosmic truth?",
                options: ["Nothing", "You gain power", "Your mind shatters", "You become immortal"],
                correct: 2
            }
        ];

        const overlay = document.createElement('div');
        overlay.className = 'microgame-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 10002;
            display: flex; align-items: center; justify-content: center; font-family: 'Courier New', monospace;
        `;

        let currentQ = 0;
        let correct = 0;
        const selectedQuestions = triviaQuestions.sort(() => 0.5 - Math.random()).slice(0, questions);

        const showQuestion = () => {
            const q = selectedQuestions[currentQ];
            overlay.innerHTML = `
                <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid #ff00ff; border-radius: 15px; padding: 20px; text-align: center; color: white; max-width: 500px; width: 90%;">
                    <h3 style="color: #ff00ff; margin: 0 0 15px;">🧠 Cosmic Trivia</h3>
                    <div style="margin: 10px 0; color: #ffaa00;">Question ${currentQ + 1} of ${questions}</div>
                    <div style="margin: 20px 0; font-size: 16px; line-height: 1.4;">${q.q}</div>
                    <div style="display: flex; flex-direction: column; gap: 10px; margin: 20px 0;">
                        ${q.options.map((opt, i) => `
                            <button class="trivia-option" data-answer="${i}" style="background: linear-gradient(45deg, #4b0082, #8a2be2); border: 2px solid #ff00ff; color: white; padding: 12px; border-radius: 8px; cursor: pointer; font-size: 14px; text-align: left;">
                                ${String.fromCharCode(65 + i)}. ${opt}
                            </button>
                        `).join('')}
                    </div>
                    <div style="margin: 15px 0; color: #ffaa00;">Score: ${correct}/${currentQ}</div>
                </div>
            `;

            overlay.querySelectorAll('.trivia-option').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const answer = parseInt(e.target.dataset.answer);
                    const isCorrect = answer === q.correct;
                    
                    if (isCorrect) {
                        correct++;
                        e.target.style.background = 'linear-gradient(45deg, #00ff00, #00cc00)';
                        e.target.style.color = '#000';
                        if (window.soundManager) {
                            try { window.soundManager.playBling({ frequency: 1200, duration: 0.15 }); } catch (e) {}
                        }
                    } else {
                        e.target.style.background = 'linear-gradient(45deg, #ff0000, #cc0000)';
                        if (window.soundManager) {
                            try { window.soundManager.playTerrifyingBling(); } catch (e) {}
                        }
                    }

                    currentQ++;
                    if (currentQ < questions) {
                        setTimeout(showQuestion, 1500);
                    } else {
                        const success = correct >= Math.ceil(questions / 2);
                        const message = success ? `🎉 Trivia Master! ${correct}/${questions} correct` : `💀 Failed! ${correct}/${questions} correct`;
                        
                        overlay.innerHTML = `
                            <div style="background: linear-gradient(135deg, #1a1a2e, #16213e); border: 2px solid ${success ? '#00ff00' : '#ff0000'}; border-radius: 15px; padding: 20px; text-align: center; color: white; max-width: 400px; width: 90%;">
                                <h3 style="color: ${success ? '#00ff00' : '#ff0000'}; margin: 0 0 15px;">${success ? '🎉' : '💀'} Trivia Complete</h3>
                                <div style="font-size: 18px; margin: 15px 0;">${message}</div>
                                <button onclick="window.microgamesManager.endGame()" style="background: #00ffff; color: #000; border: none; padding: 10px 20px; border-radius: 6px; font-weight: bold; cursor: pointer;">Close</button>
                            </div>
                        `;

                        if (success) this.scores.trivia++;
                        this.saveScores();

                        if (onComplete) {
                            setTimeout(() => {
                                onComplete(success, { correct, total: questions });
                                this.endGame();
                            }, 2000);
                        }
                    }
                });
            });
        };

        document.body.appendChild(overlay);
        this.currentOverlay = overlay;
        showQuestion();
    }

    // Tetris - Full implementation with falling pieces, rotation, line clears
    startTetrisGame({ onComplete = null } = {}) {
        this.activeGame = 'tetris';
        if (window.soundManager) {
            try { window.soundManager.pauseAmbience('microgame'); } catch (e) {}
        }

        const overlay = document.createElement('div');
        overlay.className = 'microgame-overlay';
        overlay.style.cssText = `
            position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 10002;
            display: flex; align-items: center; justify-content: center; font-family: 'Courier New', monospace;
        `;

        // Config
        const COLS = 10;
        const ROWS = 20;
        const CELL = 26;
        const PREVIEW_SIZE = 4;

        // State
        let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
        let current = null;
        let next = null;
        let x = 3, y = 0, rotation = 0;
        let dropInterval = 800; // ms
        let lastDrop = 0;
        let paused = false;
        let over = false;
        let lines = 0;
        let level = 1;
        let score = 0;

        // Pieces (Tetrominoes)
        const PIECES = {
            I: [
                [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
                [[0,0,1,0],[0,0,1,0],[0,0,1,0],[0,0,1,0]],
                [[0,0,0,0],[0,0,0,0],[1,1,1,1],[0,0,0,0]],
                [[0,1,0,0],[0,1,0,0],[0,1,0,0],[0,1,0,0]]
            ],
            O: [
                [[1,1],[1,1]],
                [[1,1],[1,1]],
                [[1,1],[1,1]],
                [[1,1],[1,1]]
            ],
            T: [
                [[0,1,0],[1,1,1],[0,0,0]],
                [[0,1,0],[0,1,1],[0,1,0]],
                [[0,0,0],[1,1,1],[0,1,0]],
                [[0,1,0],[1,1,0],[0,1,0]]
            ],
            S: [
                [[0,1,1],[1,1,0],[0,0,0]],
                [[0,1,0],[0,1,1],[0,0,1]],
                [[0,0,0],[0,1,1],[1,1,0]],
                [[1,0,0],[1,1,0],[0,1,0]]
            ],
            Z: [
                [[1,1,0],[0,1,1],[0,0,0]],
                [[0,0,1],[0,1,1],[0,1,0]],
                [[0,0,0],[1,1,0],[0,1,1]],
                [[0,1,0],[1,1,0],[1,0,0]]
            ],
            J: [
                [[1,0,0],[1,1,1],[0,0,0]],
                [[0,1,1],[0,1,0],[0,1,0]],
                [[0,0,0],[1,1,1],[0,0,1]],
                [[0,1,0],[0,1,0],[1,1,0]]
            ],
            L: [
                [[0,0,1],[1,1,1],[0,0,0]],
                [[0,1,0],[0,1,0],[0,1,1]],
                [[0,0,0],[1,1,1],[1,0,0]],
                [[1,1,0],[0,1,0],[0,1,0]]
            ]
        };
        const COLORS = {
            I: '#00ffff', O: '#ffd700', T: '#9b59b6', S: '#2ecc71', Z: '#e74c3c', J: '#3498db', L: '#e67e22'
        };

        // UI
        overlay.innerHTML = `
            <div style="background: linear-gradient(135deg, #0f1224, #131a35); border: 2px solid #ffaa00; border-radius: 12px; padding: 16px; color: #fff;">
                <h3 style="color:#ffaa00; margin:0 0 12px;">🧩 Eldritch Tetris</h3>
                <div style="display:flex; gap:16px; align-items:flex-start;">
                    <div>
                        <canvas id="tetris-canvas" width="${COLS * CELL}" height="${ROWS * CELL}" style="border:2px solid #ffaa00; background:#000;"></canvas>
                        <div style="display:flex; gap:16px; margin-top:8px; font-size:12px;">
                            <div>Score: <span id="t-score">0</span></div>
                            <div>Lines: <span id="t-lines">0</span></div>
                            <div>Level: <span id="t-level">1</span></div>
                        </div>
                    </div>
                    <div style="min-width:180px;">
                        <div style="margin-bottom:8px;">Next</div>
                        <canvas id="tetris-next" width="${PREVIEW_SIZE * CELL}" height="${PREVIEW_SIZE * CELL}" style="border:1px solid #444; background:#05070f;"></canvas>
                        <div style="margin:12px 0; font-size:12px;"><strong>Controls</strong><br>←/→ Move | ↓ Soft drop | ↑/Space Rotate | Shift Hard drop | P Pause</div>
                        <div style="display:flex; gap:8px;">
                            <button id="t-start" style="background:#ffaa00;color:#000;border:none;padding:6px 10px;border-radius:4px;cursor:pointer;">Start</button>
                            <button id="t-pause" style="background:#ff6b6b;color:#fff;border:none;padding:6px 10px;border-radius:4px;cursor:pointer;">Pause</button>
                            <button onclick="window.microgamesManager.endGame()" style="background:#666;color:#fff;border:none;padding:6px 10px;border-radius:4px;cursor:pointer;">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        this.currentOverlay = overlay;

        const canvas = overlay.querySelector('#tetris-canvas');
        const ctx = canvas.getContext('2d');
        const nextCanvas = overlay.querySelector('#tetris-next');
        const nctx = nextCanvas.getContext('2d');
        const scoreEl = overlay.querySelector('#t-score');
        const linesEl = overlay.querySelector('#t-lines');
        const levelEl = overlay.querySelector('#t-level');

        const pickPiece = () => {
            const keys = Object.keys(PIECES);
            const key = keys[Math.floor(Math.random() * keys.length)];
            return { key, rotations: PIECES[key] };
        };

        const spawn = () => {
            current = next || pickPiece();
            next = pickPiece();
            x = 3; y = 0; rotation = 0;
            if (collides(x, y, current.rotations[rotation])) {
                gameOver();
            }
            drawNext();
        };

        const collides = (nx, ny, matrix) => {
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (!matrix[r][c]) continue;
                    const bx = nx + c;
                    const by = ny + r;
                    if (bx < 0 || bx >= COLS || by >= ROWS) return true;
                    if (by >= 0 && board[by][bx]) return true;
                }
            }
            return false;
        };

        const merge = () => {
            const matrix = current.rotations[rotation];
            for (let r = 0; r < matrix.length; r++) {
                for (let c = 0; c < matrix[r].length; c++) {
                    if (matrix[r][c]) {
                        const by = y + r;
                        const bx = x + c;
                        if (by >= 0) board[by][bx] = current.key;
                    }
                }
            }
        };

        const clearLines = () => {
            let cleared = 0;
            for (let r = ROWS - 1; r >= 0; r--) {
                if (board[r].every(cell => cell)) {
                    board.splice(r, 1);
                    board.unshift(Array(COLS).fill(0));
                    cleared++;
                    r++;
                }
            }
            if (cleared > 0) {
                const points = [0, 100, 300, 500, 800][cleared] * level;
                score += points;
                lines += cleared;
                if (lines >= level * 10) {
                    level++;
                    dropInterval = Math.max(120, dropInterval - 80);
                }
                updateHUD();
                if (window.soundManager) {
                    try { window.soundManager.playBling({ frequency: 1200, duration: 0.12, type: 'triangle' }); } catch (e) {}
                }
            }
        };

        const hardDrop = () => {
            let dy = 0;
            while (!collides(x, y + dy + 1, current.rotations[rotation])) dy++;
            y += dy;
            lockPiece();
        };

        const rotate = (dir = 1) => {
            const prev = rotation;
            rotation = (rotation + dir + 4) % 4;
            // basic wall kick
            if (collides(x, y, current.rotations[rotation])) {
                if (!collides(x - 1, y, current.rotations[rotation])) x -= 1;
                else if (!collides(x + 1, y, current.rotations[rotation])) x += 1;
                else rotation = prev;
            }
        };

        const move = (dx) => {
            if (!collides(x + dx, y, current.rotations[rotation])) x += dx;
        };

        const drop = () => {
            if (!collides(x, y + 1, current.rotations[rotation])) {
                y++;
            } else {
                lockPiece();
            }
        };

        const lockPiece = () => {
            merge();
            clearLines();
            spawn();
        };

        const drawCell = (cx, cy, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(cx * CELL, cy * CELL, CELL - 1, CELL - 1);
        };

        const draw = () => {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // draw board
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const key = board[r][c];
                    if (key) drawCell(c, r, COLORS[key]);
                }
            }
            // draw current
            if (current) {
                const matrix = current.rotations[rotation];
                for (let r = 0; r < matrix.length; r++) {
                    for (let c = 0; c < matrix[r].length; c++) {
                        if (matrix[r][c]) drawCell(x + c, y + r, COLORS[current.key]);
                    }
                }
            }
        };

        const drawNext = () => {
            nctx.fillStyle = '#000';
            nctx.fillRect(0, 0, nextCanvas.width, nextCanvas.height);
            const mat = next.rotations[0];
            const offsetX = Math.floor((PREVIEW_SIZE - mat[0].length) / 2);
            const offsetY = Math.floor((PREVIEW_SIZE - mat.length) / 2);
            for (let r = 0; r < mat.length; r++) {
                for (let c = 0; c < mat[r].length; c++) {
                    if (mat[r][c]) {
                        nctx.fillStyle = COLORS[next.key];
                        nctx.fillRect((offsetX + c) * CELL, (offsetY + r) * CELL, CELL - 1, CELL - 1);
                    }
                }
            }
        };

        const updateHUD = () => {
            scoreEl.textContent = String(score);
            linesEl.textContent = String(lines);
            levelEl.textContent = String(level);
        };

        const gameOver = () => {
            over = true;
            if (window.soundManager) {
                try { window.soundManager.playTerrifyingBling(); } catch (e) {}
            }
            overlay.querySelector('h3').innerHTML = '💀 Game Over';
            overlay.querySelector('h3').style.color = '#ff4d4d';
            if (onComplete) {
                setTimeout(() => {
                    onComplete(false, { score, lines, level });
                    this.endGame();
                }, 1500);
            }
        };

        // Loop
        let rafId = null;
        const loop = (t) => {
            if (paused || over) { rafId = requestAnimationFrame(loop); return; }
            if (!lastDrop) lastDrop = t;
            const dt = t - lastDrop;
            if (dt >= dropInterval) {
                drop();
                lastDrop = t;
            }
            draw();
            rafId = requestAnimationFrame(loop);
        };

        // Controls
        const onKey = (e) => {
            if (over) return;
            switch (e.key) {
                case 'ArrowLeft': move(-1); break;
                case 'ArrowRight': move(1); break;
                case 'ArrowDown': drop(); break;
                case 'ArrowUp': rotate(1); break;
                case ' ': e.preventDefault(); rotate(1); break;
                case 'Shift': hardDrop(); break;
                case 'p':
                case 'P': paused = !paused; break;
            }
        };

        // Buttons
        const btnStart = overlay.querySelector('#t-start');
        const btnPause = overlay.querySelector('#t-pause');
        btnStart.addEventListener('click', () => {
            if (over) return;
            if (!current) { spawn(); }
            if (!rafId) rafId = requestAnimationFrame(loop);
        });
        btnPause.addEventListener('click', () => { paused = !paused; btnPause.textContent = paused ? 'Resume' : 'Pause'; });

        window.addEventListener('keydown', onKey);

        // Cleanup on close
        const originalEnd = this.endGame.bind(this);
        this.endGame = () => {
            try { window.removeEventListener('keydown', onKey); } catch (_) {}
            try { if (rafId) cancelAnimationFrame(rafId); } catch (_) {}
            this.scores.tetris = Math.max(this.scores.tetris, score);
            this.saveScores();
            this.endGame = originalEnd;
            originalEnd();
        };

        // Initialize UI
        updateHUD();
        draw();
    }
}

// Initialize global instance
window.microgamesManager = new MicrogamesManager();
window.microgamesManager.init();
