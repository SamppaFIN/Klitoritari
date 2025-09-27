/**
 * Unified Debug Panel System
 * Combines all debug panels into one draggable, tabbed interface
 */

class UnifiedDebugPanel {
    constructor() {
        this.panel = null;
        this.isVisible = false;
        this.currentTab = 'encounter';
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.position = { x: 20, y: 20 };
        this.tabs = {
            encounter: { name: '­ Encounters', icon: '­' },
            chat: { name: 'ðŸ’¬ Chat', icon: 'ðŸ’¬' },
            path: { name: ' Path', icon: '' },
            quest: { name: 'ðŸ™ Quest', icon: 'ðŸ™' }
        };
    }

    init() {
        this.createPanel();
        this.createToggleButton();
        
        // Delay event listener setup to ensure DOM is ready
        setTimeout(() => {
            this.setupEventListeners();
            this.setupHeaderToggle();
        }, 100);
        
        this.loadPanelState();
        this.startStatsUpdate();
        console.log('ðŸ”§ Unified debug panel initialized');
    }

    createPanel() {
        // Remove existing panel if it exists
        const existingPanel = document.getElementById('unified-debug-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        this.panel = document.createElement('div');
        this.panel.id = 'unified-debug-panel';
        this.panel.className = 'unified-debug-panel';
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
        
        this.panel.innerHTML = `
            <div class="debug-header">
                <div class="debug-title">
                    <span class="debug-icon">ðŸ”§</span>
                    <span class="debug-text">Debug Console</span>
                </div>
                <div class="debug-controls">
                    <button id="minimize-debug" class="debug-minimize">âˆ’</button>
                    <button id="close-debug" class="debug-close">Ã—</button>
                </div>
            </div>
            <div class="debug-tabs">
                ${Object.entries(this.tabs).map(([key, tab]) => 
                    `<button class="debug-tab ${key === this.currentTab ? 'active' : ''}" data-tab="${key}">
                        <span class="tab-icon">${tab.icon}</span>
                        <span class="tab-name">${tab.name}</span>
                    </button>`
                ).join('')}
            </div>
            <div class="debug-content">
                <div id="encounter-tab" class="debug-tab-content ${this.currentTab === 'encounter' ? 'active' : ''}">
                    ${this.createEncounterTab()}
                </div>
                <div id="chat-tab" class="debug-tab-content ${this.currentTab === 'chat' ? 'active' : ''}">
                    ${this.createChatTab()}
                </div>
                <div id="path-tab" class="debug-tab-content ${this.currentTab === 'path' ? 'active' : ''}">
                    ${this.createPathTab()}
                </div>
                <div id="quest-tab" class="debug-tab-content ${this.currentTab === 'quest' ? 'active' : ''}">
                    ${this.createQuestTab()}
                </div>
            </div>
        `;

        document.body.appendChild(this.panel);
    }

    createToggleButton() {
        // Remove existing toggle button if it exists
        const existingButton = document.getElementById('debug-toggle-button');
        if (existingButton) {
            existingButton.remove();
        }

        this.toggleButton = document.createElement('button');
        this.toggleButton.id = 'debug-toggle-button';
        this.toggleButton.className = 'debug-toggle-button';
        this.toggleButton.innerHTML = 'ðŸ”§';
        this.toggleButton.title = 'Toggle Debug Panel';
        
        // Position in top-right corner
        this.toggleButton.style.position = 'fixed';
        this.toggleButton.style.top = '20px';
        this.toggleButton.style.right = '20px';
        this.toggleButton.style.zIndex = '1500';
        
        this.toggleButton.addEventListener('click', () => this.toggle());
        
        document.body.appendChild(this.toggleButton);
    }

    createEncounterTab() {
        return `
            <div class="debug-section">
                <h4>ðŸ‘¤ Player Stats</h4>
                <div class="player-stats-display">
                    <div class="stat-row">
                        <span>Health: <span id="debug-health">100/100</span></span>
                        <button id="heal-player" class="debug-btn small">Heal</button>
                        <button id="damage-player" class="debug-btn small">-10 HP</button>
                    </div>
                    <div class="stat-row">
                        <span>Sanity: <span id="debug-sanity">100/100</span></span>
                        <button id="restore-sanity" class="debug-btn small">Restore</button>
                        <button id="lose-sanity" class="debug-btn small">-10 Sanity</button>
                    </div>
                    <div class="stat-row">
                        <span>Distortion: <span id="distortion-status">Active</span></span>
                        <button id="trigger-distortion" class="debug-btn small">Trigger Effect</button>
                        <button id="stop-distortion-timer" class="debug-btn small">Stop Timer</button>
                    </div>
                    <div class="stat-row">
                        <span>Steps: <span id="debug-steps">100</span></span>
                        <button id="add-steps" class="debug-btn small">+50 Steps</button>
                    </div>
                    <div class="stat-row">
                        <span>Level: <span id="debug-level">1</span></span>
                        <span>Exp: <span id="debug-exp">0</span>/<span id="debug-exp-needed">100</span></span>
                    </div>
                    <div class="stat-row">
                        <span>Attack: <span id="debug-attack">15</span></span>
                        <span>Defense: <span id="debug-defense">10</span></span>
                        <span>Luck: <span id="debug-luck">12</span></span>
                    </div>
                    <div class="stat-row">
                        <button id="add-exp" class="debug-btn small">+100 Exp</button>
                        <button id="level-up" class="debug-btn small">Level Up</button>
                        <button id="reset-stats" class="debug-btn small">Reset Stats</button>
                    </div>
            <div class="stat-row">
                <span>Items: <span id="debug-item-count">0</span></span>
                <button id="add-random-item" class="debug-btn small">Random Item</button>
                <button id="clear-inventory" class="debug-btn small">Clear Items</button>
            </div>
            <div class="stat-row">
                <span>NPCs: <span id="debug-npc-count">0</span></span>
                <button id="clear-npcs" class="debug-btn small">Clear NPCs</button>
            </div>
            <div class="stat-row">
                <span>Map Markers:</span>
                <button id="clear-all-markers" class="debug-btn small">Clear All Markers</button>
                <button id="reset-game-screen" class="debug-btn small">Reset Game Screen</button>
            </div>
            <div class="stat-row">
                <span>Proximity:</span>
                <button id="reset-encounter-flags" class="debug-btn small">Reset Encounters</button>
                <button id="toggle-proximity-debug" class="debug-btn small">Debug Mode</button>
            </div>
        <div class="stat-row">
            <span>Location:</span>
            <button id="center-on-location" class="debug-btn small">Center Map</button>
            <button id="force-geolocation" class="debug-btn small">Get Location</button>
            <button id="toggle-gps-manual" class="debug-btn small">Toggle GPS</button>
        </div>
            <div class="stat-row">
                <span>Movement:</span>
                <button id="test-distance" class="debug-btn small">Test Distance</button>
                <button id="add-steps-manual" class="debug-btn small">+10 Steps</button>
            </div>
            <div class="stat-row">
                <span>Quest Markers:</span>
                <button id="add-quest-markers" class="debug-btn small">Add Quest Markers</button>
                <button id="clear-quest-markers" class="debug-btn small">Clear Quest Markers</button>
                <button id="test-quest-proximity" class="debug-btn small">Test Proximity</button>
                <button id="force-quest-trigger" class="debug-btn small">Force Trigger</button>
            </div>
            <div class="stat-row">
                <span>Map Content:</span>
                <button id="add-map-content" class="debug-btn small">Add All Content</button>
                <button id="add-npcs" class="debug-btn small">Add NPCs</button>
                <button id="add-monsters" class="debug-btn small">Add Monsters</button>
            </div>
                </div>
            </div>
            <div class="debug-section">
                <h4>ðŸ§  Distortion Effects</h4>
                <div class="distortion-controls">
                    <button id="test-blur" class="debug-btn small">Test Blur</button>
                    <button id="test-noise" class="debug-btn small">Test Noise</button>
                    <button id="test-chromatic" class="debug-btn small">Test Chromatic</button>
                    <button id="test-vignette" class="debug-btn small">Test Vignette</button>
                    <button id="test-shake" class="debug-btn small">Test Shake</button>
                    <button id="test-ghost" class="debug-btn small">Test Ghost</button>
                    <button id="test-color-shift" class="debug-btn small">Test Color</button>
                    <button id="test-slime" class="debug-btn small">Test Slime</button>
                    <button id="test-particles" class="debug-btn small">Test Particles</button>
                    <button id="test-hallucinations" class="debug-btn small">Test Hallucinations</button>
                    <button id="test-screen-warp" class="debug-btn small">Test Warp</button>
                    <button id="test-glitch" class="debug-btn small">Test Glitch</button>
                    <button id="test-blood" class="debug-btn small">Test Blood</button>
                    <button id="test-eyes" class="debug-btn small">Test Eyes</button>
                    <button id="test-all-effects" class="debug-btn small">Test All</button>
                    <button id="clear-distortions" class="debug-btn small">Clear All</button>
                </div>
            </div>
            <div class="debug-section">
                <h4>­ Encounter Tests</h4>
                <button id="test-monster" class="debug-btn">Test Monster Encounter</button>
                <button id="test-poi" class="debug-btn">Test POI Encounter</button>
                <button id="test-mystery" class="debug-btn">Test Mystery Encounter</button>
                <div class="legendary-section">
                    <h5>âš¡ Legendary Encounters</h5>
                    <button id="test-heavy" class="debug-btn legendary-btn">Test HEVY Encounter</button>
                    <button id="force-heavy-spawn" class="debug-btn legendary-btn">Force HEVY Spawn</button>
                    <div class="legendary-info">
                        <small>HEVY: The Legendary Cosmic Guardian<br>Quest Answer: "love"</small>
                    </div>
                </div>
            </div>
            <div class="debug-section">
                <h4>âš”ï¸ PvP Simulation</h4>
                <button id="add-other-player" class="debug-btn">Add Other Player</button>
                <button id="remove-other-players" class="debug-btn">Remove All Players</button>
                <button id="test-pvp-encounter" class="debug-btn legendary-btn">âš”ï¸ Test PvP Encounter</button>
                <div class="pvp-stats">
                    <small>Players: <span id="other-player-count">0</span></small>
                </div>
            </div>
            <div class="debug-section">
                <h4>ðŸ“ Location Simulation</h4>
                <div class="toggle-container">
                    <label class="toggle-label">
                        <input type="checkbox" id="location-simulator-toggle" class="toggle-input">
                        <span class="toggle-slider"></span>
                        <span class="toggle-text">Use Simulated Location</span>
                    </label>
                </div>
                <div id="location-mode-status" class="status-indicator">Real GPS</div>
            </div>
            <div class="debug-section">
                <h4>ðŸ“Š Encounter Stats</h4>
                <div id="encounter-stats">Steps: 0 | Encounters: 0</div>
            </div>
        `;
    }

    createChatTab() {
        return `
            <div class="debug-section">
                <h4>ðŸ‘¥ NPC Controls</h4>
                <button id="test-chat-aurora" class="debug-btn">Chat with Aurora</button>
                <button id="test-chat-zephyr" class="debug-btn">Chat with Zephyr</button>
                <button id="test-chat-sage" class="debug-btn">Chat with Sage</button>
            </div>
            <div class="debug-section">
                <h4>ðŸ“ Proximity Controls</h4>
                <button id="move-npcs-closer" class="debug-btn">Move NPCs Closer</button>
                <button id="reset-npc-positions" class="debug-btn">Reset NPC Positions</button>
                <button id="toggle-npc-movement" class="debug-btn">Toggle Movement</button>
            </div>
            <div class="debug-section">
                <h4>âš™ï¸ Chat Settings</h4>
                <label for="chat-distance">Chat Distance (m):</label>
                <input type="number" id="chat-distance" value="30" min="5" max="100">
                <button id="update-chat-distance" class="debug-btn">Update Distance</button>
            </div>
            <div class="debug-section">
                <h4>ðŸ“Š Chat Stats</h4>
                <div id="chat-stats">NPCs: 0 | Chat: Closed</div>
            </div>
        `;
    }

    createPathTab() {
        return `
            <div class="debug-section">
                <h4> Brush Settings</h4>
                <label for="brush-size">Brush Size (m):</label>
                <input type="range" id="brush-size" min="5" max="50" value="10">
                <span id="brush-size-value">10m</span>
                <label for="brush-opacity">Opacity:</label>
                <input type="range" id="brush-opacity" min="0.1" max="0.8" step="0.1" value="0.3">
                <span id="brush-opacity-value">0.3</span>
            </div>
            <div class="debug-section">
                <h4> Brush Colors</h4>
                <div class="color-palette">
                    <button class="color-btn" style="background: #FF6B6B" data-color="#FF6B6B" title="Red"></button>
                    <button class="color-btn" style="background: #4ECDC4" data-color="#4ECDC4" title="Teal"></button>
                    <button class="color-btn" style="background: #45B7D1" data-color="#45B7D1" title="Blue"></button>
                    <button class="color-btn selected" style="background: #96CEB4" data-color="#96CEB4" title="Green"></button>
                    <button class="color-btn" style="background: #FFEAA7" data-color="#FFEAA7" title="Yellow"></button>
                    <button class="color-btn" style="background: #DDA0DD" data-color="#DDA0DD" title="Plum"></button>
                    <button class="color-btn" style="background: #98D8C8" data-color="#98D8C8" title="Mint"></button>
                    <button class="color-btn" style="background: #F7DC6F" data-color="#F7DC6F" title="Gold"></button>
                </div>
            </div>
            <div class="debug-section">
                <h4>ðŸ› ï¸ Path Controls</h4>
                <button id="clear-painted-paths" class="debug-btn">Clear All Paths</button>
                <button id="export-paths" class="debug-btn">Export Paths</button>
                <button id="import-paths" class="debug-btn">Import Paths</button>
            </div>
            <div class="debug-section">
                <h4>ðŸ“Š Path Stats</h4>
                <div id="path-stats">Points: 0 | Areas: 0</div>
                <div id="current-brush">Brush: Red (10m)</div>
            </div>
        `;
    }

    createQuestTab() {
        return `
            <div class="debug-section">
                <h4>­ Quest System</h4>
                <p style="color: #ccc; font-size: 12px; margin-bottom: 15px;">
                    Quest proximity detection and debugging
                </p>
                <div id="quest-distance-info" style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; margin-bottom: 15px;">
                    <div style="color: #00ff88; font-weight: bold;">ðŸ“ Quest Distance Debug</div>
                    <div id="quest-distance-display">Calculating distance...</div>
                    <div style="color: #ffaa00; font-size: 11px;">Trigger distance: 50m</div>
                </div>
                <button id="start-quest" class="debug-btn">Start Quest</button>
                <button id="start-quest-simulation" class="debug-btn">Start Quest Simulation</button>
                <button id="reset-quest" class="debug-btn">Reset Quest</button>
            </div>
            <div class="debug-section">
                <h4>ðŸ“ Quest Locations</h4>
                <div class="quest-locations-list">
                    <div class="quest-location-item">
                        <strong>1. The Fuming Lake of Despair</strong><br>
                        <small>61.476173436868, 23.725432936819306</small>
                    </div>
                    <div class="quest-location-item">
                        <strong>2. The Twisted Path of Wrong Turns</strong><br>
                        <small>61.473611708976755, 23.73287872299121</small>
                    </div>
                    <div class="quest-location-item">
                        <strong>3. The Summit of Madness</strong><br>
                        <small>61.47307885676524, 23.732106061397662</small>
                    </div>
                    <div class="quest-location-item">
                        <strong>4. The Bridge of Regret</strong><br>
                        <small>61.47668582005944, 23.730389713506298</small>
                    </div>
                    <div class="quest-location-item">
                        <strong>5. The Lake of Cosmic Horror</strong><br>
                        <small>61.4778436462739, 23.727063631949118</small>
                    </div>
                </div>
            </div>
            <div class="debug-section">
                <h4>® Quest Controls</h4>
                <button id="teleport-to-quest-location" class="debug-btn">Teleport to Current Location</button>
                <button id="show-quest-status" class="debug-btn">Show Quest Status</button>
            </div>
        `;
    }

    setupEventListeners() {
        if (!this.panel) {
            console.error('ðŸ”§ Debug panel not initialized, cannot setup event listeners');
            return;
        }

        // Panel controls
        const minimizeBtn = document.getElementById('minimize-debug');
        const closeBtn = document.getElementById('close-debug');
        
        if (minimizeBtn) minimizeBtn.addEventListener('click', () => this.toggle());
        if (closeBtn) closeBtn.addEventListener('click', () => this.hide());
        
        // Tab switching
        // Add delay to ensure DOM is ready
        setTimeout(() => {
            document.querySelectorAll('.debug-tab').forEach(tab => {
                tab.addEventListener('click', (e) => {
                    const tabName = e.target.dataset.tab;
                    if (tabName) {
                        console.log('ðŸ”§ Switching to tab:', tabName);
                        this.switchTab(tabName);
                    }
                });
            });
        }, 100);

        // Drag functionality
        this.panel.addEventListener('mousedown', (e) => this.startDrag(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());

        // Encounter tab events
        this.setupEncounterEvents();
        
        // Chat tab events
        this.setupChatEvents();
        
        
        // Path tab events
        this.setupPathEvents();
        
        // Quest tab events
        this.setupQuestEvents();
        
        // Header toggle
        this.setupHeaderToggle();
    }

    setupEncounterEvents() {
        if (window.encounterSystem) {
            // Encounter tests
            document.getElementById('test-monster').addEventListener('click', () => window.encounterSystem.triggerMonsterEncounter());
            document.getElementById('test-poi').addEventListener('click', () => window.encounterSystem.triggerPOIEncounter());
            // Mystery encounter test removed as requested
            document.getElementById('test-heavy').addEventListener('click', () => window.encounterSystem.testHeavyEncounter());
            document.getElementById('force-heavy-spawn').addEventListener('click', () => window.encounterSystem.forceHeavySpawn());
            document.getElementById('add-steps').addEventListener('click', () => window.encounterSystem.addSteps(50));
            
            // Player stats controls
            document.getElementById('heal-player').addEventListener('click', () => this.healPlayer());
            document.getElementById('damage-player').addEventListener('click', () => this.damagePlayer());
            document.getElementById('restore-sanity').addEventListener('click', () => this.restoreSanity());
            document.getElementById('lose-sanity').addEventListener('click', () => this.loseSanity());
            
            // Enhanced player stats controls
            document.getElementById('add-exp').addEventListener('click', () => this.addExperience());
            document.getElementById('level-up').addEventListener('click', () => this.forceLevelUp());
            document.getElementById('reset-stats').addEventListener('click', () => this.resetPlayerStats());
            
            // Item system controls
            document.getElementById('add-random-item').addEventListener('click', () => this.addRandomItem());
            document.getElementById('clear-inventory').addEventListener('click', () => this.clearInventory());
            document.getElementById('clear-npcs').addEventListener('click', () => this.clearNPCs());
        document.getElementById('clear-all-markers').addEventListener('click', () => this.clearAllMarkers());
        document.getElementById('reset-game-screen').addEventListener('click', () => this.resetGameScreen());
        document.getElementById('reset-encounter-flags').addEventListener('click', () => this.resetEncounterFlags());
        document.getElementById('toggle-proximity-debug').addEventListener('click', () => this.toggleProximityDebug());
        document.getElementById('center-on-location').addEventListener('click', () => this.centerOnLocation());
        document.getElementById('force-geolocation').addEventListener('click', () => this.forceGeolocation());
        document.getElementById('toggle-gps-manual').addEventListener('click', () => this.toggleGpsManual());
        document.getElementById('test-distance').addEventListener('click', () => this.testDistanceCalculation());
        document.getElementById('add-steps-manual').addEventListener('click', () => this.addStepsManual());
        document.getElementById('add-quest-markers').addEventListener('click', () => this.addQuestMarkers());
        document.getElementById('clear-quest-markers').addEventListener('click', () => this.clearQuestMarkers());
        document.getElementById('test-quest-proximity').addEventListener('click', () => this.testQuestProximity());
        document.getElementById('force-quest-trigger').addEventListener('click', () => this.forceQuestTrigger());
        document.getElementById('add-map-content').addEventListener('click', () => this.addMapContent());
        document.getElementById('add-npcs').addEventListener('click', () => this.addNPCs());
        document.getElementById('add-monsters').addEventListener('click', () => this.addMonsters());
            
            // Distortion controls
            document.getElementById('trigger-distortion').addEventListener('click', () => this.triggerDistortion());
            document.getElementById('stop-distortion-timer').addEventListener('click', () => this.stopDistortionTimer());
            
            // Distortion effect tests
            document.getElementById('test-blur').addEventListener('click', () => this.testDistortionEffect('blur'));
            document.getElementById('test-noise').addEventListener('click', () => this.testDistortionEffect('noise'));
            document.getElementById('test-chromatic').addEventListener('click', () => this.testDistortionEffect('chromaticAberration'));
            document.getElementById('test-vignette').addEventListener('click', () => this.testDistortionEffect('vignette'));
            document.getElementById('test-shake').addEventListener('click', () => this.testDistortionEffect('shake'));
            document.getElementById('test-ghost').addEventListener('click', () => this.testDistortionEffect('ghostlyShadows'));
            document.getElementById('test-color-shift').addEventListener('click', () => this.testDistortionEffect('colorShift'));
            document.getElementById('test-slime').addEventListener('click', () => this.testDistortionEffect('slime'));
            document.getElementById('test-particles').addEventListener('click', () => this.testDistortionEffect('particles'));
            document.getElementById('test-hallucinations').addEventListener('click', () => this.testDistortionEffect('hallucinations'));
            document.getElementById('test-screen-warp').addEventListener('click', () => this.testDistortionEffect('screenWarp'));
            document.getElementById('test-glitch').addEventListener('click', () => this.testDistortionEffect('glitch'));
            document.getElementById('test-blood').addEventListener('click', () => this.testDistortionEffect('bloodDrips'));
            document.getElementById('test-eyes').addEventListener('click', () => this.testDistortionEffect('eyes'));
            document.getElementById('test-all-effects').addEventListener('click', () => this.testAllDistortionEffects());
            document.getElementById('clear-distortions').addEventListener('click', () => this.clearAllDistortions());
        } else {
            // Show "not implemented" messages if systems aren't available
            this.setupFallbackEncounterEvents();
        }
        
        // PvP simulation controls
        if (window.otherPlayerSimulation) {
            document.getElementById('add-other-player').addEventListener('click', () => window.otherPlayerSimulation.addRandomPlayer());
            document.getElementById('remove-other-players').addEventListener('click', () => window.otherPlayerSimulation.removeAllPlayers());
            document.getElementById('test-pvp-encounter').addEventListener('click', () => window.otherPlayerSimulation.testPvPEncounter());
        } else {
            // Show "not implemented" messages for PvP
            this.setupFallbackPvPEvents();
        }
        
        // Location simulator toggle
        const locationToggle = document.getElementById('location-simulator-toggle');
        if (locationToggle) {
            locationToggle.addEventListener('change', (e) => this.toggleLocationSimulation(e.target.checked));
        }
    }

    setupFallbackEncounterEvents() {
        document.getElementById('test-monster').addEventListener('click', () => this.showNotImplemented('Test Monster Encounter'));
        document.getElementById('test-poi').addEventListener('click', () => this.showNotImplemented('Test POI Encounter'));
        document.getElementById('test-mystery').addEventListener('click', () => this.showNotImplemented('Test Mystery Encounter'));
        document.getElementById('test-heavy').addEventListener('click', () => this.showNotImplemented('Test HEVY Encounter'));
        document.getElementById('force-heavy-spawn').addEventListener('click', () => this.showNotImplemented('Force HEVY Spawn'));
        document.getElementById('add-steps').addEventListener('click', () => this.showNotImplemented('Add Steps'));
        document.getElementById('heal-player').addEventListener('click', () => this.showNotImplemented('Heal Player'));
        document.getElementById('damage-player').addEventListener('click', () => this.showNotImplemented('Damage Player'));
        document.getElementById('restore-sanity').addEventListener('click', () => this.showNotImplemented('Restore Sanity'));
        document.getElementById('lose-sanity').addEventListener('click', () => this.showNotImplemented('Lose Sanity'));
        document.getElementById('add-exp').addEventListener('click', () => this.showNotImplemented('Add Experience'));
        document.getElementById('level-up').addEventListener('click', () => this.showNotImplemented('Level Up'));
        document.getElementById('reset-stats').addEventListener('click', () => this.showNotImplemented('Reset Stats'));
        document.getElementById('add-random-item').addEventListener('click', () => this.showNotImplemented('Add Random Item'));
        document.getElementById('clear-inventory').addEventListener('click', () => this.showNotImplemented('Clear Inventory'));
        document.getElementById('trigger-distortion').addEventListener('click', () => this.showNotImplemented('Trigger Distortion'));
        document.getElementById('stop-distortion-timer').addEventListener('click', () => this.showNotImplemented('Stop Distortion Timer'));
        // Distortion test buttons are handled in setupDistortionEvents()
    }

    setupFallbackPvPEvents() {
        document.getElementById('add-other-player').addEventListener('click', () => this.showNotImplemented('Add Other Player'));
        document.getElementById('remove-other-players').addEventListener('click', () => this.showNotImplemented('Remove All Players'));
        document.getElementById('test-pvp-encounter').addEventListener('click', () => this.showNotImplemented('Test PvP Encounter'));
    }

    setupChatEvents() {
        if (window.npcSystem) {
            document.getElementById('test-chat-aurora').addEventListener('click', () => window.npcSystem.testChatWithNPC('Aurora'));
            document.getElementById('test-chat-zephyr').addEventListener('click', () => window.npcSystem.testChatWithNPC('Zephyr'));
            document.getElementById('test-chat-sage').addEventListener('click', () => window.npcSystem.testChatWithNPC('Sage'));
            document.getElementById('move-npcs-closer').addEventListener('click', () => window.npcSystem.moveNPCsCloser());
            document.getElementById('reset-npc-positions').addEventListener('click', () => window.npcSystem.resetNPCPositions());
            document.getElementById('toggle-npc-movement').addEventListener('click', () => window.npcSystem.toggleNPCMovement());
            document.getElementById('update-chat-distance').addEventListener('click', () => window.npcSystem.updateChatDistance());
        } else {
            // Show "not implemented" messages if systems aren't available
            this.setupFallbackChatEvents();
        }
    }

    setupFallbackChatEvents() {
        document.getElementById('test-chat-aurora').addEventListener('click', () => this.showNotImplemented('Chat with Aurora'));
        document.getElementById('test-chat-zephyr').addEventListener('click', () => this.showNotImplemented('Chat with Zephyr'));
        document.getElementById('test-chat-sage').addEventListener('click', () => this.showNotImplemented('Chat with Sage'));
        document.getElementById('move-npcs-closer').addEventListener('click', () => this.showNotImplemented('Move NPCs Closer'));
        document.getElementById('reset-npc-positions').addEventListener('click', () => this.showNotImplemented('Reset NPC Positions'));
        document.getElementById('toggle-npc-movement').addEventListener('click', () => this.showNotImplemented('Toggle NPC Movement'));
        document.getElementById('update-chat-distance').addEventListener('click', () => this.showNotImplemented('Update Chat Distance'));
    }

    setupPathEvents() {
        if (window.pathPaintingSystem) {
            // Brush size control
            const brushSizeSlider = document.getElementById('brush-size');
            const brushSizeValue = document.getElementById('brush-size-value');
            if (brushSizeSlider && brushSizeValue) {
                brushSizeSlider.addEventListener('input', (e) => {
                    window.pathPaintingSystem.brushSize = (parseInt(e.target.value) / 111000);
                    brushSizeValue.textContent = `${e.target.value}m`;
                    window.pathPaintingSystem.updateDebugInfo();
                });
            }

            // Brush opacity control
            const brushOpacitySlider = document.getElementById('brush-opacity');
            const brushOpacityValue = document.getElementById('brush-opacity-value');
            if (brushOpacitySlider && brushOpacityValue) {
                brushOpacitySlider.addEventListener('input', (e) => {
                    window.pathPaintingSystem.pathOpacity = parseFloat(e.target.value);
                    brushOpacityValue.textContent = e.target.value;
                    window.pathPaintingSystem.updateDebugInfo();
                });
            }

            // Color palette
            document.querySelectorAll('.color-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    window.pathPaintingSystem.currentBrushColor = e.target.dataset.color;
                    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                    e.target.classList.add('selected');
                    window.pathPaintingSystem.updateDebugInfo();
                });
            });

            // Path controls
            const clearPathsBtn = document.getElementById('clear-painted-paths');
            const exportPathsBtn = document.getElementById('export-paths');
            const importPathsBtn = document.getElementById('import-paths');
            
            if (clearPathsBtn) clearPathsBtn.addEventListener('click', () => window.pathPaintingSystem.clearAllPaths());
            if (exportPathsBtn) exportPathsBtn.addEventListener('click', () => window.pathPaintingSystem.exportPaths());
            if (importPathsBtn) importPathsBtn.addEventListener('click', () => window.pathPaintingSystem.importPaths());
        } else {
            // Show "not implemented" messages if systems aren't available
            this.setupFallbackPathEvents();
        }
    }

    setupFallbackPathEvents() {
        const clearPathsBtn = document.getElementById('clear-painted-paths');
        const exportPathsBtn = document.getElementById('export-paths');
        const importPathsBtn = document.getElementById('import-paths');
        
        if (clearPathsBtn) clearPathsBtn.addEventListener('click', () => this.showNotImplemented('Clear Painted Paths'));
        if (exportPathsBtn) exportPathsBtn.addEventListener('click', () => this.showNotImplemented('Export Paths'));
        if (importPathsBtn) importPathsBtn.addEventListener('click', () => this.showNotImplemented('Import Paths'));
    }

    setupQuestEvents() {
        if (window.lovecraftianQuest) {
            // Quest controls
            document.getElementById('start-quest').addEventListener('click', () => window.lovecraftianQuest.startQuest());
            document.getElementById('start-quest-simulation').addEventListener('click', () => {
                console.log('ðŸ™ Quest simulation button clicked - quests now trigger by proximity to markers');
                alert('ðŸ™ Quest simulation disabled. Quests now trigger when you approach quest markers within 50m!');
            });
            document.getElementById('reset-quest').addEventListener('click', () => window.lovecraftianQuest.resetQuest());
            document.getElementById('teleport-to-quest-location').addEventListener('click', () => this.teleportToCurrentQuestLocation());
            document.getElementById('show-quest-status').addEventListener('click', () => this.showQuestStatus());
        } else {
            // Show "not implemented" messages if quest system isn't available
            this.setupFallbackQuestEvents();
        }
    }

    setupFallbackQuestEvents() {
        const startQuestBtn = document.getElementById('start-quest');
        const startSimulationBtn = document.getElementById('start-quest-simulation');
        const resetQuestBtn = document.getElementById('reset-quest');
        const teleportBtn = document.getElementById('teleport-to-quest-location');
        const statusBtn = document.getElementById('show-quest-status');
        
        if (startQuestBtn) startQuestBtn.addEventListener('click', () => this.showNotImplemented('Start Quest'));
        if (startSimulationBtn) startSimulationBtn.addEventListener('click', () => this.showNotImplemented('Start Quest Simulation'));
        if (resetQuestBtn) resetQuestBtn.addEventListener('click', () => this.showNotImplemented('Reset Quest'));
        if (teleportBtn) teleportBtn.addEventListener('click', () => this.showNotImplemented('Teleport to Quest Location'));
        if (statusBtn) statusBtn.addEventListener('click', () => this.showNotImplemented('Show Quest Status'));
    }

    teleportToCurrentQuestLocation() {
        if (window.lovecraftianQuest && window.mapEngine) {
            const currentStep = window.lovecraftianQuest.currentQuestStep;
            const location = window.lovecraftianQuest.questLocations[currentStep];
            if (location) {
                window.mapEngine.map.setView([location.lat, location.lng], 18);
                console.log(`ðŸ™ Teleported to quest location: ${location.name}`);
            }
        }
    }

    showQuestStatus() {
        if (window.lovecraftianQuest) {
            const status = {
                active: window.lovecraftianQuest.questActive,
                currentStep: window.lovecraftianQuest.currentQuestStep,
                totalSteps: window.lovecraftianQuest.questLocations.length,
                health: window.lovecraftianQuest.playerStats.health,
                sanity: window.lovecraftianQuest.playerStats.sanity,
                items: window.lovecraftianQuest.playerStats.items
            };
            
            alert(`ðŸ™ Quest Status:
Active: ${status.active}
Current Step: ${status.currentStep + 1}/${status.totalSteps}
Health: ${status.health}
Sanity: ${status.sanity}
Items: ${status.items.join(', ') || 'None'}`);
        }
    }

    showNotImplemented(feature) {
        console.log(`§ Feature not implemented: ${feature}`);
        alert(`§ Feature not implemented: ${feature}\n\nThis feature is not yet available in the current version.`);
    }

    setupHeaderToggle() {
        const headerToggle = document.getElementById('debug-toggle-header');
        if (headerToggle) {
            headerToggle.addEventListener('click', () => this.toggle());
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTabButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTabButton) {
            activeTabButton.classList.add('active');
        }

        // Update tab content
        document.querySelectorAll('.debug-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        const activeTabContent = document.getElementById(`${tabName}-tab`);
        if (activeTabContent) {
            activeTabContent.classList.add('active');
        }

        this.currentTab = tabName;
        this.savePanelState();
    }

    startDrag(e) {
        if (e.target.closest('.debug-tab') || e.target.closest('.debug-controls')) return;
        
        this.isDragging = true;
        this.dragOffset.x = e.clientX - this.panel.offsetLeft;
        this.dragOffset.y = e.clientY - this.panel.offsetTop;
        this.panel.style.cursor = 'grabbing';
    }

    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.position.x = e.clientX - this.dragOffset.x;
        this.position.y = e.clientY - this.dragOffset.y;
        
        // Keep panel within viewport
        const maxX = window.innerWidth - this.panel.offsetWidth;
        const maxY = window.innerHeight - this.panel.offsetHeight;
        
        this.position.x = Math.max(0, Math.min(this.position.x, maxX));
        this.position.y = Math.max(0, Math.min(this.position.y, maxY));
        
        this.panel.style.left = `${this.position.x}px`;
        this.panel.style.top = `${this.position.y}px`;
    }

    endDrag() {
        this.isDragging = false;
        this.panel.style.cursor = 'grab';
        this.savePanelState();
    }

    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }

    show() {
        this.panel.classList.remove('hidden');
        this.isVisible = true;
        this.updateHeaderButtonState();
        this.savePanelState();
    }

    hide() {
        this.panel.classList.add('hidden');
        this.isVisible = false;
        this.updateHeaderButtonState();
        this.savePanelState();
    }

    updateHeaderButtonState() {
        const headerToggle = document.getElementById('debug-toggle-header');
        if (headerToggle) {
            if (this.isVisible) {
                headerToggle.classList.add('active');
            } else {
                headerToggle.classList.remove('active');
            }
        }
    }

    // Player stats control methods
    healPlayer() {
        if (window.encounterSystem) {
            window.encounterSystem.playerStats.health = window.encounterSystem.playerStats.maxHealth;
            window.encounterSystem.updateHealthBars();
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player healed to full health');
        }
    }

    damagePlayer() {
        if (window.encounterSystem) {
            window.encounterSystem.loseHealth(10, 'Debug damage');
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player took 10 damage');
        }
    }

    restoreSanity() {
        if (window.encounterSystem) {
            window.encounterSystem.playerStats.sanity = window.encounterSystem.playerStats.maxSanity;
            window.encounterSystem.updateHealthBars();
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player sanity restored to full');
        }
    }

    loseSanity() {
        if (window.encounterSystem) {
            window.encounterSystem.loseSanity(10, 'Debug sanity loss');
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player lost 10 sanity');
        }
    }

    addExperience() {
        if (window.encounterSystem) {
            window.encounterSystem.gainExperience(100, 'Debug experience gain');
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player gained 100 experience');
        }
    }

    forceLevelUp() {
        if (window.encounterSystem) {
            const requiredExp = window.encounterSystem.getRequiredExperience(window.encounterSystem.playerStats.level);
            const expNeeded = requiredExp - window.encounterSystem.playerStats.experience;
            window.encounterSystem.gainExperience(expNeeded + 1, 'Debug forced level up');
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player forced to level up');
        }
    }

    resetPlayerStats() {
        if (window.encounterSystem) {
            window.encounterSystem.playerStats = {
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
            window.encounterSystem.playerSteps = 0;
            window.encounterSystem.updateStatBars();
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¤ Player stats reset to default');
        }
    }

    addRandomItem() {
        if (window.encounterSystem?.itemSystem) {
            const lootResult = window.encounterSystem.itemSystem.generateRandomLoot('monster');
            window.encounterSystem.itemSystem.addToInventory(lootResult.itemId, 1);
            this.updatePlayerStatsDisplay();
            this.updateInventoryUI();
            console.log(`’ Added random item: ${lootResult.item.name} (${lootResult.rarity})`);
        }
    }

    clearInventory() {
        if (window.encounterSystem?.itemSystem) {
            window.encounterSystem.itemSystem.playerInventory = [];
            window.encounterSystem.itemSystem.equippedItems = {
                weapon: null,
                armor: null,
                accessory: null
            };
            window.encounterSystem.itemSystem.savePlayerInventory();
            this.updatePlayerStatsDisplay();
            this.updateInventoryUI();
            console.log('’ Inventory cleared');
        }
    }

    clearNPCs() {
        if (window.npcSystem) {
            window.npcSystem.clearAllMarkers();
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘¥ All NPC markers cleared');
        }
    }

    clearAllMarkers() {
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine) {
            window.eldritchApp.systems.mapEngine.clearAllMarkers();
            console.log('ðŸ—ºï¸ All map markers cleared');
        }
    }

    resetGameScreen() {
        if (window.eldritchApp) {
            window.eldritchApp.resetGameScreen();
            console.log('ðŸ”„ Game screen reset and markers recreated');
        } else {
            console.error('ðŸ”„ Main app not available for reset');
        }
    }

    resetEncounterFlags() {
        if (window.encounterSystem) {
            window.encounterSystem.resetEncounterFlags();
            console.log('ðŸ”„ Encounter flags reset');
        } else {
            console.error('ðŸ”„ Encounter system not available');
        }
    }

    toggleProximityDebug() {
        if (window.encounterSystem) {
            window.encounterSystem.toggleDebugMode();
            console.log('¯ Proximity debug toggled');
        } else {
            console.error('¯ Encounter system not available');
        }
    }

    centerOnLocation() {
        if (window.eldritchApp) {
            window.eldritchApp.centerOnCurrentLocation();
            console.log('ðŸ“ Centering map on current location');
        } else {
            console.error('ðŸ“ Main app not available');
        }
    }

    forceGeolocation() {
        if (window.geolocationManager) {
            window.geolocationManager.startTracking();
            console.log('ðŸ“ Forcing geolocation update');
        } else {
            console.error('ðŸ“ Geolocation manager not available');
        }
    }

    toggleGpsManual() {
        console.log('ðŸ“ Toggling device GPS...');
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            const isEnabled = geolocation.toggleDeviceGPS();
            
            if (isEnabled) {
                this.showNotification('ðŸ“ Device GPS enabled', 'info');
            } else {
                this.showNotification('ðŸ“ Using fixed position', 'info');
            }
        } else {
            console.error('ðŸ“ Geolocation system not available');
        }
    }

    testDistanceCalculation() {
        if (window.encounterSystem) {
            // Test distance calculation between two points
            const lat1 = 61.4978; // Tampere
            const lng1 = 23.7608;
            const lat2 = 61.5000; // 200m away
            const lng2 = 23.7650;
            
            const distance = window.encounterSystem.calculateDistance(lat1, lng1, lat2, lng2);
            console.log(`ðŸ§ª Distance test: ${distance.toFixed(1)}m between points`);
            alert(`Distance test: ${distance.toFixed(1)}m between test points`);
        }
    }

    addStepsManual() {
        if (window.encounterSystem) {
            window.encounterSystem.addSteps(10);
            this.updatePlayerStatsDisplay();
            console.log('ðŸ‘£ Added 10 steps manually');
        }
    }

    addQuestMarkers() {
        console.log('¯ DEBUG: addQuestMarkers called');
        console.log('¯ DEBUG: eldritchApp available:', !!window.eldritchApp);
        console.log('¯ DEBUG: mapEngine available:', !!window.eldritchApp?.systems?.mapEngine);
        console.log('¯ DEBUG: map available:', !!window.eldritchApp?.systems?.mapEngine?.map);
        
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine) {
            window.eldritchApp.systems.mapEngine.addTestQuestMarkers();
            console.log('¯ Quest markers added');
        } else {
            console.error('¯ DEBUG: Map engine not available');
        }
    }

    clearQuestMarkers() {
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine) {
            // Clear test quest markers
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach(marker => {
                if (window.eldritchApp.systems.mapEngine.map) {
                    window.eldritchApp.systems.mapEngine.map.removeLayer(marker);
                }
            });
            window.eldritchApp.systems.mapEngine.testQuestMarkers.clear();
            console.log('¯ Quest markers cleared');
        }
    }

    testQuestProximity() {
        console.log('¯ DEBUG: Testing quest proximity manually...');
        
        if (!window.encounterSystem) {
            console.error('¯ DEBUG: Encounter system not available');
            return;
        }
        
        if (!window.eldritchApp?.systems?.mapEngine) {
            console.error('¯ DEBUG: Map engine not available');
            return;
        }
        
        const playerPos = window.eldritchApp.systems.mapEngine.getPlayerPosition();
        if (!playerPos) {
            console.error('¯ DEBUG: Player position not available');
            return;
        }
        
        console.log('¯ DEBUG: Player position:', playerPos);
        console.log('¯ DEBUG: Test quest markers count:', window.eldritchApp.systems.mapEngine.testQuestMarkers?.size || 0);
        
        // Manually call the proximity check
        window.encounterSystem.checkTestQuestProximity(playerPos);
        
        // Also test individual markers
        if (window.eldritchApp.systems.mapEngine.testQuestMarkers) {
            window.eldritchApp.systems.mapEngine.testQuestMarkers.forEach((marker, key) => {
                const questPos = marker.getLatLng();
                const distance = window.encounterSystem.calculateDistance(
                    playerPos.lat, playerPos.lng,
                    questPos.lat, questPos.lng
                );
                console.log(`¯ DEBUG: Marker ${key} - Distance: ${distance.toFixed(1)}m, Position: ${questPos.lat}, ${questPos.lng}`);
            });
        }
    }

    forceQuestTrigger() {
        console.log('¯ DEBUG: Force triggering quest encounter...');
        
        if (!window.encounterSystem) {
            console.error('¯ DEBUG: Encounter system not available');
            return;
        }
        
        if (!window.eldritchApp?.systems?.mapEngine?.testQuestMarkers) {
            console.error('¯ DEBUG: No test quest markers available');
            return;
        }
        
        // Get the first available quest marker
        const firstMarker = window.eldritchApp.systems.mapEngine.testQuestMarkers.values().next().value;
        if (!firstMarker) {
            console.error('¯ DEBUG: No quest markers found');
            return;
        }
        
        console.log('¯ DEBUG: Force triggering quest with marker:', firstMarker);
        
        // Reset the encountered flag and trigger
        firstMarker.encountered = false;
        window.encounterSystem.startTestQuestEncounter(firstMarker);
    }

    addMapContent() {
        console.log('ðŸ—ºï¸ Adding all map content...');
        
        // Add quest markers
        this.addQuestMarkers();
        
        // Add NPCs
        this.addNPCs();
        
        // Add monsters
        this.addMonsters();
        
        console.log('ðŸ—ºï¸ All map content added');
    }

    addNPCs() {
        console.log('ðŸ‘¥ Adding NPCs...');
        
        if (window.npcSystem) {
            window.npcSystem.generateNPCs();
            console.log('ðŸ‘¥ NPCs added');
        } else {
            console.error('ðŸ‘¥ NPC system not available');
        }
    }

    addMonsters() {
        console.log('ðŸ‘¹ Adding monsters...');
        
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine) {
            window.eldritchApp.systems.mapEngine.generateMonsters();
            console.log('ðŸ‘¹ Monsters added');
        } else {
            console.error('ðŸ‘¹ Map engine not available');
        }
    }

    updateInventoryUI() {
        if (window.inventoryUI) {
            window.inventoryUI.updateInventory();
            window.inventoryUI.updateEquipment();
            window.inventoryUI.updateStats();
        }
    }
    
    triggerDistortion() {
        if (window.sanityDistortion) {
            window.sanityDistortion.triggerManualDistortion();
            console.log('ðŸ§  Manual distortion effect triggered');
        } else {
            console.log('ðŸ§  Sanity distortion system not available');
        }
    }
    
    stopDistortionTimer() {
        if (window.sanityDistortion) {
            window.sanityDistortion.stopTimer();
            const statusElement = document.getElementById('distortion-status');
            if (statusElement) {
                statusElement.textContent = 'Stopped';
                statusElement.style.color = '#ff6b6b';
            }
            console.log('ðŸ§  Distortion timer stopped');
        } else {
            console.log('ðŸ§  Sanity distortion system not available');
        }
    }
    
    testDistortionEffect(effectType) {
        if (window.sanityDistortion) {
            console.log(`ðŸ§  Testing ${effectType} distortion effect`);
            
            // Set the specific effect with high intensity
            window.sanityDistortion.distortionEffects[effectType] = 0.8;
            
            // Make canvas visible for testing
            window.sanityDistortion.makeCanvasVisible();
            
            // Add specific effects for certain types
            if (effectType === 'ghostlyShadows') {
                for (let i = 0; i < 3; i++) {
                    window.sanityDistortion.addRandomGhostlyShadow();
                }
            } else if (effectType === 'slime') {
                for (let i = 0; i < 5; i++) {
                    window.sanityDistortion.addRandomSlimeDrop();
                }
            } else if (effectType === 'particles') {
                for (let i = 0; i < 15; i++) {
                    window.sanityDistortion.addRandomParticle();
                }
            } else if (effectType === 'hallucinations') {
                for (let i = 0; i < 2; i++) {
                    window.sanityDistortion.addRandomHallucination();
                }
            } else if (effectType === 'bloodDrips') {
                for (let i = 0; i < 4; i++) {
                    window.sanityDistortion.addRandomBloodDrip();
                }
            } else if (effectType === 'eyes') {
                for (let i = 0; i < 2; i++) {
                    window.sanityDistortion.addRandomEye();
                }
            }
            
            // Clear the effect after 3 seconds
            setTimeout(() => {
                window.sanityDistortion.distortionEffects[effectType] = 0;
                // Reset canvas opacity based on current sanity
                if (window.sanityDistortion.canvas) {
                    const sanity = window.encounterSystem ? window.encounterSystem.playerStats.sanity : 100;
                    const opacity = sanity < 100 ? 0.3 + (1 - sanity / 100) * 0.7 : 0;
                    window.sanityDistortion.canvas.style.opacity = opacity;
                }
                console.log(`ðŸ§  ${effectType} distortion effect cleared`);
            }, 3000);
            
        } else {
            console.log('ðŸ§  Sanity distortion system not available');
        }
    }
    
    testAllDistortionEffects() {
        if (window.sanityDistortion) {
            console.log('ðŸ§  Testing all distortion effects');
            
            // Make canvas visible
            window.sanityDistortion.makeCanvasVisible();
            
            // Set all effects with moderate intensity
            const effects = ['blur', 'noise', 'chromaticAberration', 'vignette', 'shake', 'colorShift', 
                           'slime', 'particles', 'hallucinations', 'screenWarp', 'glitch', 'bloodDrips', 'eyes'];
            effects.forEach(effect => {
                window.sanityDistortion.distortionEffects[effect] = 0.5;
            });
            
            // Add multiple effects for dramatic testing
            for (let i = 0; i < 3; i++) {
                window.sanityDistortion.addRandomGhostlyShadow();
            }
            for (let i = 0; i < 5; i++) {
                window.sanityDistortion.addRandomSlimeDrop();
            }
            for (let i = 0; i < 10; i++) {
                window.sanityDistortion.addRandomParticle();
            }
            for (let i = 0; i < 2; i++) {
                window.sanityDistortion.addRandomHallucination();
            }
            for (let i = 0; i < 3; i++) {
                window.sanityDistortion.addRandomBloodDrip();
            }
            for (let i = 0; i < 2; i++) {
                window.sanityDistortion.addRandomEye();
            }
            
            // Clear all effects after 5 seconds
            setTimeout(() => {
                this.clearAllDistortions();
                console.log('ðŸ§  All distortion effects cleared');
            }, 5000);
            
        } else {
            console.log('ðŸ§  Sanity distortion system not available');
        }
    }
    
    clearAllDistortions() {
        if (window.sanityDistortion) {
            console.log('ðŸ§  Clearing all distortion effects');
            
            // Reset all distortion effects to 0
            Object.keys(window.sanityDistortion.distortionEffects).forEach(effect => {
                window.sanityDistortion.distortionEffects[effect] = 0;
            });
            
            // Clear ghostly shadows
            window.sanityDistortion.ghostlyShadows = [];
            
            console.log('ðŸ§  All distortion effects cleared');
        } else {
            console.log('ðŸ§  Sanity distortion system not available');
        }
    }
    

    updatePlayerStatsDisplay() {
        if (window.encounterSystem) {
            const healthElement = document.getElementById('debug-health');
            const sanityElement = document.getElementById('debug-sanity');
            const stepsElement = document.getElementById('debug-steps');
            const levelElement = document.getElementById('debug-level');
            const expElement = document.getElementById('debug-exp');
            const expNeededElement = document.getElementById('debug-exp-needed');
            const attackElement = document.getElementById('debug-attack');
            const defenseElement = document.getElementById('debug-defense');
            const luckElement = document.getElementById('debug-luck');
            
            if (healthElement) {
                healthElement.textContent = `${Math.floor(window.encounterSystem.playerStats.health)}/${Math.floor(window.encounterSystem.playerStats.maxHealth)}`;
            }
            if (sanityElement) {
                sanityElement.textContent = `${Math.floor(window.encounterSystem.playerStats.sanity)}/${Math.floor(window.encounterSystem.playerStats.maxSanity)}`;
            }
            if (stepsElement) {
                stepsElement.textContent = Math.floor(window.encounterSystem.playerStats.steps);
            }
            if (levelElement) {
                levelElement.textContent = window.encounterSystem.playerStats.level;
            }
            if (expElement) {
                expElement.textContent = window.encounterSystem.playerStats.experience;
            }
            if (expNeededElement) {
                const requiredExp = window.encounterSystem.getRequiredExperience(window.encounterSystem.playerStats.level);
                expNeededElement.textContent = requiredExp;
            }
            if (attackElement) {
                attackElement.textContent = window.encounterSystem.playerStats.attack;
            }
            if (defenseElement) {
                defenseElement.textContent = window.encounterSystem.playerStats.defense;
            }
            if (luckElement) {
                luckElement.textContent = window.encounterSystem.playerStats.luck;
            }
            
                    // Update item count
                    const itemCountElement = document.getElementById('debug-item-count');
                    if (itemCountElement && window.encounterSystem?.itemSystem?.playerInventory) {
                        const itemCount = window.encounterSystem.itemSystem.playerInventory.length;
                        itemCountElement.textContent = itemCount;
                    } else if (itemCountElement) {
                        itemCountElement.textContent = '0';
                    }

                    // Update NPC count
                    const npcCountElement = document.getElementById('debug-npc-count');
                    if (npcCountElement && window.npcSystem) {
                        const npcCount = window.npcSystem.npcs.length;
                        npcCountElement.textContent = npcCount;
                    }
        }
    }

    savePanelState() {
        const state = {
            visible: this.isVisible,
            currentTab: this.currentTab,
            position: this.position
        };
        localStorage.setItem('unified_debug_panel_state', JSON.stringify(state));
    }

    loadPanelState() {
        try {
            const savedState = localStorage.getItem('unified_debug_panel_state');
            if (savedState) {
                const state = JSON.parse(savedState);
                this.isVisible = state.visible;
                this.currentTab = state.currentTab || 'encounter';
                this.position = state.position || { x: 20, y: 20 };
                
                this.panel.style.left = `${this.position.x}px`;
                this.panel.style.top = `${this.position.y}px`;
                
                if (!this.isVisible) {
                    this.panel.classList.add('hidden');
                }
            }
        } catch (error) {
            console.error('Error loading panel state:', error);
        }
    }

    toggleLocationSimulation(enableSimulation) {
        if (window.geolocationManager) {
            if (enableSimulation) {
                window.geolocationManager.enableSimulator();
                this.updateLocationModeStatus('Simulated GPS');
                console.log('ðŸ”§ Location simulation enabled');
            } else {
                window.geolocationManager.disableSimulator();
                this.updateLocationModeStatus('Real GPS');
                console.log('ðŸ”§ Location simulation disabled');
            }
        }
    }

    updateLocationModeStatus(mode) {
        const statusElement = document.getElementById('location-mode-status');
        if (statusElement) {
            statusElement.textContent = mode;
            statusElement.className = `status-indicator ${mode.toLowerCase().includes('simulated') ? 'simulated' : 'real'}`;
        }
    }

    updateStats() {
        // Update encounter stats
        if (window.encounterSystem) {
            const encounterStats = document.getElementById('encounter-stats');
            if (encounterStats) {
                encounterStats.textContent = `Steps: ${window.encounterSystem.playerSteps || 0} | Encounters: ${window.encounterSystem.encounters?.size || 0}`;
            }
            
            // Update player stats display
            this.updatePlayerStatsDisplay();
        }

        // Update chat stats
        if (window.npcSystem) {
            const chatStats = document.getElementById('chat-stats');
            if (chatStats) {
                const npcCount = window.npcSystem.npcs?.length || 0;
                const chatStatus = window.npcSystem.currentNPC ? `Open (${window.npcSystem.currentNPC.name})` : 'Closed';
                chatStats.textContent = `NPCs: ${npcCount} | Chat: ${chatStatus}`;
            }
        }
        
        // Update quest distance
        this.updateQuestDistance();

        // Update path stats
        if (window.pathPaintingSystem) {
            const pathStats = document.getElementById('path-stats');
            const currentBrush = document.getElementById('current-brush');
            if (pathStats) {
                pathStats.textContent = `Points: ${window.pathPaintingSystem.visitedPoints?.length || 0} | Areas: ${window.pathPaintingSystem.paintedAreas?.size || 0}`;
            }
            if (currentBrush) {
                const brushSizeM = Math.round((window.pathPaintingSystem.brushSize || 0.0001) * 111000);
                currentBrush.textContent = `Brush: ${window.pathPaintingSystem.currentBrushColor || '#FF6B6B'} (${brushSizeM}m)`;
            }
        }
    }

    updateQuestDistance() {
        const questDistanceDisplay = document.getElementById('quest-distance-display');
        if (!questDistanceDisplay) return;
        
        // Get player position
        let playerPos = null;
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const position = window.eldritchApp.systems.geolocation.getCurrentPositionSafe();
            if (position) {
                playerPos = { lat: position.lat, lng: position.lng };
            }
        }
        
        if (!playerPos) {
            questDistanceDisplay.textContent = 'No GPS position available';
            questDistanceDisplay.style.color = '#ff6b6b';
            return;
        }
        
        // Quest start location
        const questLat = 61.476173436868;
        const questLng = 23.725432936819306;
        
        // Calculate distance
        const distance = this.calculateDistance(playerPos.lat, playerPos.lng, questLat, questLng);
        
        // Update display
        questDistanceDisplay.textContent = `${distance.toFixed(2)}m to cosmic entity`;
        
        // Color code based on distance
        if (distance <= 50) {
            questDistanceDisplay.style.color = '#00ff88'; // Green - within trigger range
        } else if (distance <= 100) {
            questDistanceDisplay.style.color = '#ffaa00'; // Orange - getting close
        } else {
            questDistanceDisplay.style.color = '#ff6b6b'; // Red - far away
        }
    }
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const Ï†1 = lat1 * Math.PI/180;
        const Ï†2 = lat2 * Math.PI/180;
        const Î”Ï† = (lat2-lat1) * Math.PI/180;
        const Î”Î» = (lng2-lng1) * Math.PI/180;

        const a = Math.sin(Î”Ï†/2) * Math.sin(Î”Ï†/2) +
                Math.cos(Ï†1) * Math.cos(Ï†2) *
                Math.sin(Î”Î»/2) * Math.sin(Î”Î»/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    startStatsUpdate() {
        // Update stats every 2 seconds
        setInterval(() => {
            this.updateStats();
        }, 2000);
    }


    destroy() {
        if (this.panel) {
            this.panel.remove();
        }
    }
}

// Make unified debug panel globally available
window.UnifiedDebugPanel = UnifiedDebugPanel;


