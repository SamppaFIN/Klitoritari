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
        // Click events
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.activateTab(index));
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
    
    setInitialState() {
        // Set first tab as active
        this.activateTab(0);
    }
    
    activateTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        console.log(`🎛️ Activating tab ${index}`);
        
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
        
        // Populate content based on active panel
        this.populatePanelContent(index);
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
                <div class="quest-item">
                    <h4>🌌 The Cosmic Awakening</h4>
                    <p>Discover the mysteries of the cosmic convergence in Härmälä.</p>
                    <div class="quest-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 25%"></div>
                        </div>
                        <span class="progress-text">25% Complete</span>
                    </div>
                </div>
                <div class="quest-item">
                    <h4>🧪 First Steps</h4>
                    <p>Collect your first health potion and learn the basics.</p>
                    <div class="quest-status completed">✅ Completed</div>
                </div>
            </div>
        `;
    }
    
    populateBasePanel() {
        const container = document.getElementById('base-management-list');
        if (!container) return;
        
        container.innerHTML = `
            <div class="base-management-content">
                <h3>🏠 Base Management</h3>
                <div class="base-info">
                    <h4>Current Base</h4>
                    <p>No base established yet.</p>
                    <button class="establish-base-btn">Establish Base</button>
                </div>
                <div class="base-stats">
                    <h4>Base Statistics</h4>
                    <div class="stat-item">
                        <span class="stat-label">Territory Size:</span>
                        <span class="stat-value">0 m²</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Connected Bases:</span>
                        <span class="stat-value">0</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    populateSettingsPanel() {
        const container = document.getElementById('user-settings-list');
        if (!container) return;
        
        container.innerHTML = `
            <div class="settings-content">
                <h3>⚙️ Settings</h3>
                <div class="setting-group">
                    <h4>Profile</h4>
                    <p>Manage your cosmic explorer profile and preferences.</p>
                </div>
                <div class="setting-group">
                    <h4>Display</h4>
                    <p>Adjust visual settings and UI preferences.</p>
                </div>
                <div class="setting-group">
                    <h4>Audio</h4>
                    <p>Configure sound effects and music settings.</p>
                </div>
            </div>
        `;
    }
    
    populateDebugPanel() {
        const container = document.getElementById('debug-footer-list');
        if (!container) return;
        
        container.innerHTML = `
            <div class="debug-content">
                <h3>🔧 Debug Tools</h3>
                <div class="debug-actions">
                    <button class="debug-btn" onclick="window.encounterSystem?.healPlayer()">
                        <span class="btn-icon">❤️</span>
                        <span class="btn-text">Heal Player</span>
                    </button>
                    <button class="debug-btn" onclick="window.encounterSystem?.restoreSanity()">
                        <span class="btn-icon">🧠</span>
                        <span class="btn-text">Restore Sanity</span>
                    </button>
                    <button class="debug-btn" onclick="window.tablist.spawnTestItem()">
                        <span class="btn-icon">🎒</span>
                        <span class="btn-text">Spawn Test Item</span>
                    </button>
                </div>
            </div>
        `;
    }
    
    useItem(itemId) {
        console.log(`🎒 Using item: ${itemId}`);
        if (window.itemSystem && window.itemSystem.useConsumable) {
            const success = window.itemSystem.useConsumable(itemId);
            if (success) {
                this.populateInventoryPanel();
                this.showItemUseFeedback(itemId);
            }
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
    
    showItemUseFeedback(itemId) {
        if (window.itemSystem) {
            const item = window.itemSystem.getItem(itemId);
            if (item) {
                // Create visual feedback
                const feedback = document.createElement('div');
                feedback.className = 'item-use-feedback';
                feedback.innerHTML = `
                    <div class="feedback-content">
                        <span class="feedback-icon">${item.emoji || '💠'}</span>
                        <span class="feedback-text">Used ${item.name}!</span>
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
