/**
 * Clean Tablist Implementation
 * Based on CSS-Tricks article: https://css-tricks.com/the-anatomy-of-a-tablist-component/
 */

class Tablist {
    constructor() {
        this.tablist = null;
        this.tabs = [];
        this.panels = [];
        this.activeIndex = 0;
        
        this.init();
    }
    
    init() {
        this.tablist = document.querySelector('.footer-tablist');
        if (!this.tablist) return;
        
        this.tabs = Array.from(this.tablist.querySelectorAll('.tab-button'));
        this.panels = Array.from(document.querySelectorAll('.tab-panel'));
        
        this.setupEventListeners();
        this.setInitialState();
        
        console.log('🎛️ Tablist initialized with', this.tabs.length, 'tabs');
    }
    
    setupEventListeners() {
        // Enhanced touch/click events for mobile
        this.tabs.forEach((tab, index) => {
            // Enhanced mobile touch handling
            this.setupEnhancedMobileButton(tab, index);
        });
        
        // Keyboard events
        this.tablist.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Inventory refresh button
        const refreshBtn = document.getElementById('inventory-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.refreshInventory();
            });
        }
    }
    
    setupEnhancedMobileButton(button, index) {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        let isLongPress = false;
        let longPressTimer = null;
        
        // Enhanced Samsung U23 compatibility
        const eventTypes = ['click', 'touchend'];
        
        eventTypes.forEach(eventType => {
            button.addEventListener(eventType, (e) => {
                if (eventType === 'click' && e.isTrusted === false) return; // Prevent synthetic clicks
                if (eventType === 'touchend' && isLongPress) return; // Don't trigger on long press
                
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`📱 Tab ${index} ${eventType} detected`);
                this.activateTab(index);
                
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            }, { passive: false });
        });
        
        // Enhanced touch feedback for Samsung devices
        button.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            isLongPress = false;
            
            // Visual feedback
            button.style.transform = 'translateY(0) scale(0.95)';
            button.style.transition = 'transform 0.1s ease';
            
            // Long press detection
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                console.log(`📱 Tab ${index} long press detected`);
                // Haptic feedback for long press
                if (navigator.vibrate) {
                    navigator.vibrate([5, 10, 5]);
                }
            }, 500);
            
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const touchEndPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const touchDistance = Math.sqrt(
                Math.pow(touchEndPos.x - touchStartPos.x, 2) + 
                Math.pow(touchEndPos.y - touchStartPos.y, 2)
            );
            
            // Clear long press timer
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            // Reset visual feedback
            setTimeout(() => {
                button.style.transform = '';
                button.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 100);
            
        }, { passive: false });
        
        // Handle touch cancel
        button.addEventListener('touchcancel', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            isLongPress = false;
            button.style.transform = '';
        });
    }
    
    setInitialState() {
        // Set first tab as active
        this.activateTab(0);
    }
    
    activateTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        // Check if clicking the same tab (toggle behavior)
        const wasActive = this.activeIndex === index;
        
        console.log(`🎛️ Activating tab ${index} (was active: ${wasActive})`);
        
        // If clicking the same tab, close it
        if (wasActive) {
            this.closeAllPanels();
            return;
        }
        
        // Update tab states
        this.tabs.forEach((tab, i) => {
            const isActive = i === index;
            tab.setAttribute('aria-selected', isActive);
            tab.setAttribute('tabindex', isActive ? '0' : '-1');
            tab.classList.toggle('active', isActive);
        });
        
        // Update panel states
        this.panels.forEach((panel, i) => {
            const isActive = i === index;
            panel.classList.toggle('active', isActive);
            panel.setAttribute('aria-hidden', !isActive);
        });
        
        this.activeIndex = index;
        
        // Update tablist visual state
        this.tablist.classList.add('has-active-panel');
        
        // Populate content based on active panel
        this.populatePanelContent(index);
    }
    
    closeAllPanels() {
        console.log('🎛️ Closing all panels');
        
        // Update tab states
        this.tabs.forEach((tab, i) => {
            tab.setAttribute('aria-selected', 'false');
            tab.setAttribute('tabindex', i === 0 ? '0' : '-1'); // First tab gets focus
            tab.classList.remove('active');
        });
        
        // Update panel states
        this.panels.forEach((panel, i) => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // Update tablist visual state
        this.tablist.classList.remove('has-active-panel');
        
        this.activeIndex = -1; // No active panel
    }
    
    handleKeydown(e) {
        const { key } = e;
        const currentIndex = this.activeIndex;
        let newIndex = currentIndex;
        
        switch (key) {
            case 'ArrowLeft':
                e.preventDefault();
                newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
                break;
            case 'ArrowRight':
                e.preventDefault();
                newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                // Tab is already activated by click, just focus it
                this.tabs[currentIndex].focus();
                return;
            default:
                return;
        }
        
        if (newIndex !== currentIndex) {
            this.activateTab(newIndex);
            this.tabs[newIndex].focus();
        }
    }
    
    populatePanelContent(index) {
        const panelId = this.panels[index]?.id;
        if (!panelId) return;
        
        console.log(`🎛️ Populating content for panel: ${panelId}`);
        
        switch (panelId) {
            case 'panel-inventory':
                this.populateInventoryPanel();
                break;
            case 'panel-quest':
                this.populateQuestPanel();
                break;
            case 'panel-base':
                this.populateBasePanel();
                break;
            case 'panel-settings':
                this.populateSettingsPanel();
                break;
            case 'panel-debug':
                this.populateDebugPanel();
                break;
        }
    }
    
    populateInventoryPanel() {
        const container = document.getElementById('inventory-list');
        if (!container) return;
        
        if (window.itemSystem && window.itemSystem.playerInventory) {
            const inventory = window.itemSystem.playerInventory;
            
            if (inventory.length === 0) {
                container.innerHTML = '<div class="inventory-empty">No items</div>';
                return;
            }
            
            const itemsHTML = inventory.map(invItem => {
                const item = window.itemSystem.getItem(invItem.id);
                if (!item) return '';
                
                return `
                    <div class="inventory-item-card ${item.type === 'consumable' ? 'consumable' : ''}">
                        <div class="item-media">
                            <div class="item-icon-placeholder">
                                <span class="item-emoji">${item.emoji || '💠'}</span>
                            </div>
                            ${invItem.quantity > 1 ? `
                                <div class="quantity-badge">
                                    <span class="quantity-number">${invItem.quantity}</span>
                                </div>
                            ` : ''}
                        </div>
                        <div class="item-info">
                            <div class="item-header">
                                <h3 class="item-name">${item.name}</h3>
                                <div class="item-type-badge">${item.type}</div>
                            </div>
                            <p class="item-description">${item.description}</p>
                            ${item.lore ? `
                                <div class="item-lore">
                                    <p class="lore-text">${item.lore}</p>
                                </div>
                            ` : ''}
                        </div>
                        <div class="item-actions">
                            ${item.type === 'consumable' ? `
                                <button class="action-btn primary" onclick="window.tablist.useItem('${item.id}')">
                                    <span class="btn-icon">⚡</span>
                                    <span class="btn-text">Use</span>
                                </button>
                            ` : `
                                <button class="action-btn" onclick="window.tablist.equipItem('${item.id}')">
                                    <span class="btn-icon">⚔️</span>
                                    <span class="btn-text">Equip</span>
                                </button>
                            `}
                            <button class="action-btn" onclick="window.tablist.showItemInfo('${item.id}')">
                                <span class="btn-icon">ℹ️</span>
                                <span class="btn-text">Info</span>
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = `<div class="inventory-items">${itemsHTML}</div>`;
        } else {
            container.innerHTML = '<div class="inventory-empty">No items</div>';
        }
    }
    
    populateQuestPanel() {
        const container = document.getElementById('quest-log-list');
        if (!container) return;
        
        container.innerHTML = `
            <div class="quest-log-content">
                <h3>Active Quests</h3>
                <div class="quest-item" onclick="window.tablist.showQuestInfo('cosmic-awakening')">
                    <h4>🌌 The Cosmic Awakening</h4>
                    <p>Discover the mysteries of the cosmic convergence in Härmälä.</p>
                    <div class="quest-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 25%"></div>
                        </div>
                        <span class="progress-text">25% Complete</span>
                    </div>
                    <div class="quest-click-hint">Click for details</div>
                </div>
                <div class="quest-item completed" onclick="window.tablist.showQuestInfo('first-steps')">
                    <h4>🧪 First Steps</h4>
                    <p>Collect your first health potion and learn the basics.</p>
                    <div class="quest-status completed">✅ Completed</div>
                    <div class="quest-click-hint">Click for details</div>
                </div>
            </div>
        `;
    }
    
    showQuestInfo(questId) {
        console.log(`📜 Showing quest info: ${questId}`);
        
        const questData = {
            'cosmic-awakening': {
                title: '🌌 The Cosmic Awakening',
                description: 'Discover the mysteries of the cosmic convergence in Härmälä.',
                status: 'Active',
                progress: 25,
                objectives: [
                    'Find the ancient shrine in Härmälä',
                    'Collect cosmic energy crystals',
                    'Unlock the hidden chamber',
                    'Face the cosmic guardian'
                ],
                rewards: [
                    'Cosmic Orb of Power',
                    '500 Experience Points',
                    'Access to Cosmic Realm'
                ],
                lore: 'The cosmic convergence is approaching, and only those who understand the ancient ways can harness its power. The shrine in Härmälä holds the key to unlocking your true potential.'
            },
            'first-steps': {
                title: '🧪 First Steps',
                description: 'Collect your first health potion and learn the basics.',
                status: 'Completed',
                progress: 100,
                objectives: [
                    'Find the health potion (50m from spawn)',
                    'Collect the potion',
                    'Learn about the inventory system'
                ],
                rewards: [
                    'Health Potion',
                    '100 Experience Points',
                    'Inventory Tutorial Complete'
                ],
                lore: 'Every cosmic explorer must start somewhere. This simple quest teaches the fundamentals of survival in the cosmic realm.'
            }
        };
        
        const quest = questData[questId];
        if (!quest) return;
        
        // Create quest info modal
        const modal = document.createElement('div');
        modal.className = 'quest-info-modal';
        modal.innerHTML = `
            <div class="quest-modal-content">
                <div class="quest-modal-header">
                    <h2>${quest.title}</h2>
                    <button class="quest-close-btn" onclick="this.closest('.quest-info-modal').remove()">&times;</button>
                </div>
                <div class="quest-modal-body">
                    <div class="quest-description">
                        <p>${quest.description}</p>
                    </div>
                    <div class="quest-status-info">
                        <span class="quest-status ${quest.status.toLowerCase()}">${quest.status}</span>
                        ${quest.progress < 100 ? `
                            <div class="quest-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${quest.progress}%"></div>
                                </div>
                                <span class="progress-text">${quest.progress}% Complete</span>
                            </div>
                        ` : ''}
                    </div>
                    <div class="quest-objectives">
                        <h3>Objectives:</h3>
                        <ul>
                            ${quest.objectives.map(obj => `<li>${obj}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="quest-rewards">
                        <h3>Rewards:</h3>
                        <ul>
                            ${quest.rewards.map(reward => `<li>${reward}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="quest-lore">
                        <h3>Lore:</h3>
                        <p>${quest.lore}</p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add click outside to close
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
    
    populateBasePanel() {
        const container = document.getElementById('base-management-list');
        if (!container) return;
        
        // Check if player has a base
        const hasBase = localStorage.getItem('playerBase') !== null;
        const baseData = hasBase ? JSON.parse(localStorage.getItem('playerBase')) : null;
        
        container.innerHTML = `
            <div class="base-management-content">
                <h3>🏠 Base Management</h3>
                <div class="base-info">
                    <h4>Current Base</h4>
                    ${hasBase ? `
                        <p>Base established at your current location.</p>
                        <div class="base-details">
                            <div class="base-location">
                                <span class="label">Location:</span>
                                <span class="value">${baseData.lat.toFixed(6)}, ${baseData.lng.toFixed(6)}</span>
                            </div>
                            <div class="base-established">
                                <span class="label">Established:</span>
                                <span class="value">${new Date(baseData.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <button class="establish-base-btn" onclick="window.tablist.establishBase()">Relocate Base</button>
                        <button class="abandon-base-btn" onclick="window.tablist.abandonBase()">Abandon Base</button>
                    ` : `
                        <p>No base established yet.</p>
                        <button class="establish-base-btn" onclick="window.tablist.establishBase()">Establish Base</button>
                    `}
                </div>
                <div class="base-stats">
                    <h4>Base Statistics</h4>
                    <div class="stat-item">
                        <span class="stat-label">Territory Size:</span>
                        <span class="stat-value">${hasBase ? '100 m²' : '0 m²'}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Connected Bases:</span>
                        <span class="stat-value">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Base Level:</span>
                        <span class="stat-value">${hasBase ? '1' : '0'}</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    establishBase() {
        console.log('🏠 Establishing base at current location');
        
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const baseData = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        timestamp: Date.now(),
                        level: 1
                    };
                    
                    localStorage.setItem('playerBase', JSON.stringify(baseData));
                    
                    // Add base marker to map
                    this.addBaseMarker(baseData);
                    
                    // Refresh base panel
                    this.populateBasePanel();
                    
                    // Show success notification
                    this.showBaseNotification('Base established successfully!', 'success');
                    
                    console.log('✅ Base established at:', baseData);
                },
                (error) => {
                    console.error('❌ Error getting location for base:', error);
                    this.showBaseNotification('Failed to get location for base establishment', 'error');
                }
            );
        } else {
            console.error('❌ Geolocation not supported');
            this.showBaseNotification('Geolocation not supported', 'error');
        }
    }
    
    abandonBase() {
        console.log('🏠 Abandoning base');
        
        if (confirm('Are you sure you want to abandon your base? This action cannot be undone.')) {
            localStorage.removeItem('playerBase');
            
            // Remove base marker from map
            this.removeBaseMarker();
            
            // Refresh base panel
            this.populateBasePanel();
            
            // Show notification
            this.showBaseNotification('Base abandoned', 'info');
            
            console.log('✅ Base abandoned');
        }
    }
    
    addBaseMarker(baseData) {
        if (window.mapEngine && window.mapEngine.addMarker) {
            window.mapEngine.addMarker({
                id: 'player-base',
                lat: baseData.lat,
                lng: baseData.lng,
                type: 'base',
                title: 'Player Base',
                icon: '🏠',
                color: '#4a9eff'
            });
        }
    }
    
    removeBaseMarker() {
        if (window.mapEngine && window.mapEngine.removeMarker) {
            window.mapEngine.removeMarker('player-base');
        }
    }
    
    showBaseNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.className = `base-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    populateSettingsPanel() {
        const container = document.getElementById('user-settings-list');
        if (!container) return;
        
        // Get current settings
        const playerName = localStorage.getItem('playerName') || 'Cosmic Explorer';
        const pathColor = localStorage.getItem('pathColor') || '#00ff88';
        const playerSymbol = localStorage.getItem('playerSymbol') || '🌟';
        
        container.innerHTML = `
            <div class="settings-content">
                <h3>⚙️ Settings</h3>
                
                <div class="setting-group">
                    <h4>👤 Profile</h4>
                    <div class="setting-item">
                        <label>Player Name</label>
                        <input type="text" id="settings-player-name" value="${playerName}" maxlength="24">
                        <button onclick="window.tablist.savePlayerName()">Save</button>
                    </div>
                    <div class="setting-item">
                        <label>Player Symbol</label>
                        <div class="symbol-selector">
                            <span class="current-symbol">${playerSymbol}</span>
                            <button onclick="window.tablist.changeSymbol()">Change</button>
                        </div>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>🎨 Visual</h4>
                    <div class="setting-item">
                        <label>Path Color</label>
                        <div class="color-picker-group">
                            <input type="color" id="settings-path-color" value="${pathColor}">
                            <button onclick="window.tablist.savePathColor()">Apply</button>
                        </div>
                    </div>
                    <div class="setting-item">
                        <label>UI Theme</label>
                        <select id="settings-theme" onchange="window.tablist.changeTheme()">
                            <option value="cosmic">Cosmic (Default)</option>
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                        </select>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>🎮 Gameplay</h4>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="settings-tutorial-hints" checked>
                            Show Tutorial Hints
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="settings-sound-effects" checked>
                            Sound Effects
                        </label>
                    </div>
                    <div class="setting-item">
                        <label>
                            <input type="checkbox" id="settings-haptic-feedback" checked>
                            Haptic Feedback
                        </label>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>📍 Location</h4>
                    <div class="setting-item">
                        <label>GPS Accuracy</label>
                        <select id="settings-gps-accuracy" onchange="window.tablist.changeGPSAccuracy()">
                            <option value="high">High (Most Accurate)</option>
                            <option value="medium" selected>Medium (Balanced)</option>
                            <option value="low">Low (Battery Saver)</option>
                        </select>
                    </div>
                    <div class="setting-item">
                        <button onclick="window.tablist.requestLocationPermission()" class="location-btn">
                            📍 Request Location Permission
                        </button>
                    </div>
                </div>
                
                <div class="setting-group">
                    <h4>🔧 Advanced</h4>
                    <div class="setting-item">
                        <button onclick="window.tablist.exportSaveData()" class="export-btn">
                            💾 Export Save Data
                        </button>
                    </div>
                    <div class="setting-item">
                        <button onclick="window.tablist.resetGameData()" class="reset-btn">
                            ⚠️ Reset Game Data
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    savePlayerName() {
        const nameInput = document.getElementById('settings-player-name');
        const newName = nameInput.value.trim();
        
        if (newName && newName.length > 0) {
            localStorage.setItem('playerName', newName);
            this.showSettingsNotification('Player name saved!', 'success');
            console.log('✅ Player name saved:', newName);
        } else {
            this.showSettingsNotification('Please enter a valid name', 'error');
        }
    }
    
    savePathColor() {
        const colorInput = document.getElementById('settings-path-color');
        const newColor = colorInput.value;
        
        localStorage.setItem('pathColor', newColor);
        this.showSettingsNotification('Path color saved!', 'success');
        console.log('✅ Path color saved:', newColor);
        
        // Apply color to path system if available
        if (window.pathPaintingSystem && window.pathPaintingSystem.setColor) {
            window.pathPaintingSystem.setColor(newColor);
        }
    }
    
    changeSymbol() {
        const symbols = ['🌟', '⭐', '✨', '💫', '🌙', '☀️', '🔥', '💎', '⚡', '🌈', '🎭', '🎪'];
        const currentSymbol = localStorage.getItem('playerSymbol') || '🌟';
        const currentIndex = symbols.indexOf(currentSymbol);
        const nextIndex = (currentIndex + 1) % symbols.length;
        const newSymbol = symbols[nextIndex];
        
        localStorage.setItem('playerSymbol', newSymbol);
        this.populateSettingsPanel(); // Refresh to show new symbol
        this.showSettingsNotification(`Symbol changed to ${newSymbol}`, 'success');
        console.log('✅ Player symbol changed to:', newSymbol);
    }
    
    changeTheme() {
        const themeSelect = document.getElementById('settings-theme');
        const theme = themeSelect.value;
        
        // Apply theme class to body
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${theme}`);
        
        localStorage.setItem('uiTheme', theme);
        this.showSettingsNotification(`Theme changed to ${theme}`, 'success');
        console.log('✅ Theme changed to:', theme);
    }
    
    changeGPSAccuracy() {
        const accuracySelect = document.getElementById('settings-gps-accuracy');
        const accuracy = accuracySelect.value;
        
        localStorage.setItem('gpsAccuracy', accuracy);
        this.showSettingsNotification(`GPS accuracy set to ${accuracy}`, 'success');
        console.log('✅ GPS accuracy changed to:', accuracy);
    }
    
    requestLocationPermission() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                () => {
                    this.showSettingsNotification('Location permission granted!', 'success');
                },
                (error) => {
                    this.showSettingsNotification('Location permission denied', 'error');
                    console.error('Location permission error:', error);
                }
            );
        } else {
            this.showSettingsNotification('Geolocation not supported', 'error');
        }
    }
    
    exportSaveData() {
        const saveData = {
            playerName: localStorage.getItem('playerName'),
            pathColor: localStorage.getItem('pathColor'),
            playerSymbol: localStorage.getItem('playerSymbol'),
            uiTheme: localStorage.getItem('uiTheme'),
            gpsAccuracy: localStorage.getItem('gpsAccuracy'),
            tutorialProgress: localStorage.getItem('tutorialProgress'),
            playerBase: localStorage.getItem('playerBase'),
            timestamp: new Date().toISOString()
        };
        
        const dataStr = JSON.stringify(saveData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `cosmic-explorer-save-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showSettingsNotification('Save data exported!', 'success');
    }
    
    resetGameData() {
        if (confirm('Are you sure you want to reset all game data? This cannot be undone!')) {
            if (confirm('This will delete ALL your progress. Are you absolutely sure?')) {
                localStorage.clear();
                this.showSettingsNotification('Game data reset!', 'success');
                console.log('⚠️ Game data reset by user');
                
                // Reload page to apply reset
                setTimeout(() => {
                    window.location.reload();
                }, 2000);
            }
        }
    }
    
    showSettingsNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    populateDebugPanel() {
        const container = document.getElementById('debug-footer-list');
        if (!container) return;
        
        container.innerHTML = `
            <div class="debug-content">
                <h3>🔧 Debug Tools</h3>
                <div class="debug-actions">
                    <button class="debug-btn" onclick="window.tablist.debugHealPlayer()">
                        <span class="btn-icon">❤️</span>
                        <span class="btn-text">Heal Player</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugRestoreSanity()">
                        <span class="btn-icon">🧠</span>
                        <span class="btn-text">Restore Sanity</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.spawnTestItem()">
                        <span class="btn-icon">🎒</span>
                        <span class="btn-text">Spawn Test Item</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugTeleportToSpawn()">
                        <span class="btn-icon">📍</span>
                        <span class="btn-text">Teleport to Spawn</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugClearInventory()">
                        <span class="btn-icon">🗑️</span>
                        <span class="btn-text">Clear Inventory</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugResetTutorial()">
                        <span class="btn-icon">🔄</span>
                        <span class="btn-text">Reset Tutorial</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugShowStats()">
                        <span class="btn-icon">📊</span>
                        <span class="btn-text">Show Stats</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.debugToggleWebGL()">
                        <span class="btn-icon">🎮</span>
                        <span class="btn-text">Toggle WebGL</span>
                    </button>
                </div>
                <div class="debug-info">
                    <h4>System Status</h4>
                    <div class="debug-stats">
                        <div class="stat-item">
                            <span class="stat-label">Health:</span>
                            <span class="stat-value" id="debug-health">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Sanity:</span>
                            <span class="stat-value" id="debug-sanity">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">Items:</span>
                            <span class="stat-value" id="debug-items">-</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-label">WebGL:</span>
                            <span class="stat-value" id="debug-webgl">-</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Update debug stats
        this.updateDebugStats();
    }
    
    debugHealPlayer() {
        console.log('🔧 Debug: Healing player');
        if (window.encounterSystem && window.encounterSystem.healPlayer) {
            window.encounterSystem.healPlayer();
            this.showDebugNotification('Player healed!', 'success');
        } else {
            this.showDebugNotification('Heal function not available', 'error');
        }
        this.updateDebugStats();
    }
    
    debugRestoreSanity() {
        console.log('🔧 Debug: Restoring sanity');
        if (window.encounterSystem && window.encounterSystem.restoreSanity) {
            window.encounterSystem.restoreSanity();
            this.showDebugNotification('Sanity restored!', 'success');
        } else {
            this.showDebugNotification('Sanity restore function not available', 'error');
        }
        this.updateDebugStats();
    }
    
    debugTeleportToSpawn() {
        console.log('🔧 Debug: Teleporting to spawn');
        if (window.mapEngine && window.mapEngine.setView) {
            // Get spawn coordinates (you can adjust these)
            const spawnLat = 60.1699; // Helsinki
            const spawnLng = 24.9384;
            window.mapEngine.setView([spawnLat, spawnLng], 15);
            this.showDebugNotification('Teleported to spawn!', 'success');
        } else {
            this.showDebugNotification('Map engine not available', 'error');
        }
    }
    
    debugClearInventory() {
        console.log('🔧 Debug: Clearing inventory');
        if (window.itemSystem && window.itemSystem.clearInventory) {
            window.itemSystem.clearInventory();
            this.populateInventoryPanel();
            this.showDebugNotification('Inventory cleared!', 'success');
        } else {
            this.showDebugNotification('Inventory clear function not available', 'error');
        }
        this.updateDebugStats();
    }
    
    debugResetTutorial() {
        console.log('🔧 Debug: Resetting tutorial');
        if (confirm('Are you sure you want to reset the tutorial? This will clear all tutorial progress.')) {
            localStorage.removeItem('tutorialProgress');
            localStorage.removeItem('tutorialFlags');
            this.showDebugNotification('Tutorial reset!', 'success');
        }
    }
    
    debugShowStats() {
        console.log('🔧 Debug: Showing stats');
        const stats = {
            health: window.encounterSystem?.playerHealth || 'Unknown',
            sanity: window.encounterSystem?.playerSanity || 'Unknown',
            items: window.itemSystem?.playerInventory?.length || 0,
            webgl: window.webglTest?.isSupported() ? 'Supported' : 'Not Supported',
            location: navigator.geolocation ? 'Available' : 'Not Available'
        };
        
        alert(`Debug Stats:
Health: ${stats.health}
Sanity: ${stats.sanity}
Items: ${stats.items}
WebGL: ${stats.webgl}
Location: ${stats.location}`);
    }
    
    debugToggleWebGL() {
        console.log('🔧 Debug: Toggling WebGL');
        if (window.webglTest) {
            const isEnabled = window.webglTest.toggle();
            this.showDebugNotification(`WebGL ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
        } else {
            this.showDebugNotification('WebGL test not available', 'error');
        }
    }
    
    updateDebugStats() {
        const healthEl = document.getElementById('debug-health');
        const sanityEl = document.getElementById('debug-sanity');
        const itemsEl = document.getElementById('debug-items');
        const webglEl = document.getElementById('debug-webgl');
        
        if (healthEl) {
            healthEl.textContent = window.encounterSystem?.playerHealth || 'Unknown';
        }
        if (sanityEl) {
            sanityEl.textContent = window.encounterSystem?.playerSanity || 'Unknown';
        }
        if (itemsEl) {
            itemsEl.textContent = window.itemSystem?.playerInventory?.length || 0;
        }
        if (webglEl) {
            webglEl.textContent = window.webglTest?.isSupported() ? 'Yes' : 'No';
        }
    }
    
    showDebugNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `debug-notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.add('hide');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
    
    useItem(itemId) {
        console.log(`🎒 Using item: ${itemId}`);
        if (window.itemSystem && window.itemSystem.useConsumable) {
            const success = window.itemSystem.useConsumable(itemId);
            if (success) {
                this.populateInventoryPanel();
                this.showItemUseFeedback(itemId);
                console.log(`✅ Successfully used item: ${itemId}`);
            } else {
                console.log(`❌ Failed to use item: ${itemId}`);
                this.showItemUseFeedback(itemId, false);
            }
        } else {
            console.error('❌ Item system not available');
            this.showItemUseFeedback(itemId, false);
        }
    }
    
    equipItem(itemId) {
        console.log(`⚔️ Equipping item: ${itemId}`);
        // TODO: Implement equipment system
    }
    
    showItemInfo(itemId) {
        console.log(`ℹ️ Showing info for: ${itemId}`);
        if (window.itemSystem) {
            const item = window.itemSystem.getItem(itemId);
            if (item) {
                // TODO: Show item info modal
                alert(`${item.name}: ${item.description}`);
            }
        }
    }
    
    showItemUseFeedback(itemId, success = true) {
        if (window.itemSystem) {
            const item = window.itemSystem.getItem(itemId);
            if (item) {
                // Create visual feedback
                const feedback = document.createElement('div');
                feedback.className = `item-use-feedback ${success ? 'success' : 'error'}`;
                feedback.innerHTML = `
                    <div class="feedback-content">
                        <span class="feedback-icon">${success ? (item.emoji || '💠') : '❌'}</span>
                        <span class="feedback-text">${success ? `Used ${item.name}!` : `Failed to use ${item.name}`}</span>
                    </div>
                `;
                
                document.body.appendChild(feedback);
                
                setTimeout(() => feedback.classList.add('show'), 10);
                setTimeout(() => {
                    feedback.classList.add('hide');
                    setTimeout(() => feedback.remove(), 300);
                }, 2000);
            }
        }
    }
    
    refreshInventory() {
        console.log('🔄 Refreshing inventory');
        this.populateInventoryPanel();
    }
    
    spawnTestItem() {
        console.log('🎒 Spawning test item');
        if (window.itemSystem) {
            window.itemSystem.addToInventory('health_potion', 1);
            this.populateInventoryPanel();
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.tablist = new Tablist();
    });
} else {
    window.tablist = new Tablist();
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tablist;
}
