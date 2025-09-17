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
            encounter: { name: '🎭 Encounters', icon: '🎭' },
            chat: { name: '💬 Chat', icon: '💬' },
            path: { name: '🎨 Path', icon: '🎨' }
        };
    }

    init() {
        this.createPanel();
        this.createToggleButton();
        this.setupEventListeners();
        this.loadPanelState();
        this.startStatsUpdate();
        console.log('🔧 Unified debug panel initialized');
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
                    <span class="debug-icon">🔧</span>
                    <span class="debug-text">Debug Console</span>
                </div>
                <div class="debug-controls">
                    <button id="minimize-debug" class="debug-minimize">−</button>
                    <button id="close-debug" class="debug-close">×</button>
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
        this.toggleButton.innerHTML = '🔧';
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
                <h4>🎭 Encounter Tests</h4>
                <button id="test-monster" class="debug-btn">Test Monster Encounter</button>
                <button id="test-poi" class="debug-btn">Test POI Encounter</button>
                <button id="test-mystery" class="debug-btn">Test Mystery Encounter</button>
                <button id="add-steps" class="debug-btn">Add 50 Steps</button>
            </div>
            <div class="debug-section">
                <h4>📊 Encounter Stats</h4>
                <div id="encounter-stats">Steps: 0 | Encounters: 0</div>
            </div>
        `;
    }

    createChatTab() {
        return `
            <div class="debug-section">
                <h4>👥 NPC Controls</h4>
                <button id="test-chat-aurora" class="debug-btn">Chat with Aurora</button>
                <button id="test-chat-zephyr" class="debug-btn">Chat with Zephyr</button>
                <button id="test-chat-sage" class="debug-btn">Chat with Sage</button>
            </div>
            <div class="debug-section">
                <h4>📍 Proximity Controls</h4>
                <button id="move-npcs-closer" class="debug-btn">Move NPCs Closer</button>
                <button id="reset-npc-positions" class="debug-btn">Reset NPC Positions</button>
                <button id="toggle-npc-movement" class="debug-btn">Toggle Movement</button>
            </div>
            <div class="debug-section">
                <h4>⚙️ Chat Settings</h4>
                <label for="chat-distance">Chat Distance (m):</label>
                <input type="number" id="chat-distance" value="30" min="5" max="100">
                <button id="update-chat-distance" class="debug-btn">Update Distance</button>
            </div>
            <div class="debug-section">
                <h4>📊 Chat Stats</h4>
                <div id="chat-stats">NPCs: 0 | Chat: Closed</div>
            </div>
        `;
    }

    createPathTab() {
        return `
            <div class="debug-section">
                <h4>🎨 Brush Settings</h4>
                <label for="brush-size">Brush Size (m):</label>
                <input type="range" id="brush-size" min="5" max="50" value="10">
                <span id="brush-size-value">10m</span>
                <label for="brush-opacity">Opacity:</label>
                <input type="range" id="brush-opacity" min="0.1" max="0.8" step="0.1" value="0.3">
                <span id="brush-opacity-value">0.3</span>
            </div>
            <div class="debug-section">
                <h4>🎨 Brush Colors</h4>
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
                <h4>🛠️ Path Controls</h4>
                <button id="clear-painted-paths" class="debug-btn">Clear All Paths</button>
                <button id="export-paths" class="debug-btn">Export Paths</button>
                <button id="import-paths" class="debug-btn">Import Paths</button>
            </div>
            <div class="debug-section">
                <h4>📊 Path Stats</h4>
                <div id="path-stats">Points: 0 | Areas: 0</div>
                <div id="current-brush">Brush: Red (10m)</div>
            </div>
        `;
    }

    setupEventListeners() {
        // Panel controls
        document.getElementById('minimize-debug').addEventListener('click', () => this.toggle());
        document.getElementById('close-debug').addEventListener('click', () => this.hide());
        
        // Tab switching
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

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
    }

    setupEncounterEvents() {
        if (window.encounterSystem) {
            document.getElementById('test-monster').addEventListener('click', () => window.encounterSystem.triggerMonsterEncounter());
            document.getElementById('test-poi').addEventListener('click', () => window.encounterSystem.triggerPOIEncounter());
            document.getElementById('test-mystery').addEventListener('click', () => window.encounterSystem.triggerMysteryEncounter());
            document.getElementById('add-steps').addEventListener('click', () => window.encounterSystem.addSteps(50));
        }
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
        }
    }

    setupPathEvents() {
        if (window.pathPaintingSystem) {
            // Brush size control
            const brushSizeSlider = document.getElementById('brush-size');
            const brushSizeValue = document.getElementById('brush-size-value');
            brushSizeSlider.addEventListener('input', (e) => {
                window.pathPaintingSystem.brushSize = (parseInt(e.target.value) / 111000);
                brushSizeValue.textContent = `${e.target.value}m`;
                window.pathPaintingSystem.updateDebugInfo();
            });

            // Brush opacity control
            const brushOpacitySlider = document.getElementById('brush-opacity');
            const brushOpacityValue = document.getElementById('brush-opacity-value');
            brushOpacitySlider.addEventListener('input', (e) => {
                window.pathPaintingSystem.pathOpacity = parseFloat(e.target.value);
                brushOpacityValue.textContent = e.target.value;
                window.pathPaintingSystem.updateDebugInfo();
            });

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
            document.getElementById('clear-painted-paths').addEventListener('click', () => window.pathPaintingSystem.clearAllPaths());
            document.getElementById('export-paths').addEventListener('click', () => window.pathPaintingSystem.exportPaths());
            document.getElementById('import-paths').addEventListener('click', () => window.pathPaintingSystem.importPaths());
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.debug-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.debug-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

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
        this.savePanelState();
    }

    hide() {
        this.panel.classList.add('hidden');
        this.isVisible = false;
        this.savePanelState();
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

    updateStats() {
        // Update encounter stats
        if (window.encounterSystem) {
            const encounterStats = document.getElementById('encounter-stats');
            if (encounterStats) {
                encounterStats.textContent = `Steps: ${window.encounterSystem.playerSteps || 0} | Encounters: ${window.encounterSystem.encounters?.size || 0}`;
            }
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
