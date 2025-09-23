/**
 * Inventory UI - Visual interface for the cosmic inventory system
 * Handles inventory display, equipment management, and item interactions
 */

class InventoryUI {
    constructor() {
        this.isInitialized = false;
        this.currentTab = 'inventory';
        this.tooltip = null;
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🎒 Initializing Inventory UI...');
        
        // Create tooltip element
        this.createTooltip();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initial render
        this.updateInventory();
        
        this.isInitialized = true;
        console.log('🎒 Inventory UI initialized!');
    }

    createTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.className = 'item-tooltip';
        this.tooltip.id = 'item-tooltip';
        document.body.appendChild(this.tooltip);
    }

    setupEventListeners() {
        // Inventory button
        const inventoryBtn = document.getElementById('inventory-btn');
        if (inventoryBtn) {
            inventoryBtn.addEventListener('click', () => this.toggleInventory());
        }

        // Close inventory
        const closeBtn = document.getElementById('close-inventory');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.hideInventory());
        }

        // Tab switching
        const tabs = document.querySelectorAll('.inventory-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Close on outside click
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideInventory();
                }
            });
        }
    }

    toggleInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            if (modal.classList.contains('hidden')) {
                this.showInventory();
            } else {
                this.hideInventory();
            }
        }
    }

    showInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateInventory();
        }
    }

    hideInventory() {
        const modal = document.getElementById('inventory-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.hideTooltip();
        }
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.inventory-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.inventory-tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Update content based on tab
        switch (tabName) {
            case 'inventory':
                this.updateInventory();
                break;
            case 'equipment':
                this.updateEquipment();
                break;
            case 'stats':
                this.updateStats();
                break;
        }
    }

    updateInventory() {
        const grid = document.getElementById('inventory-grid');
        if (!grid || !window.encounterSystem?.itemSystem) return;

        const inventory = window.encounterSystem.itemSystem.getPlayerInventory();
        grid.innerHTML = '';

        if (inventory.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: #666; padding: 40px;">Your inventory is empty. Go explore to find cosmic treasures!</div>';
            return;
        }

        inventory.forEach(invItem => {
            const item = window.encounterSystem.itemSystem.getItem(invItem.id);
            if (!item) return;

            const itemElement = this.createInventoryItemElement(item, invItem);
            grid.appendChild(itemElement);
        });
    }

    createInventoryItemElement(item, invItem) {
        const div = document.createElement('div');
        div.className = `inventory-item ${item.rarity}`;
        div.dataset.itemId = item.id;

        // Get item icon based on type
        const icon = this.getItemIcon(item);
        
        div.innerHTML = `
            <div class="item-icon">${icon}</div>
            <div class="item-name">${item.name}</div>
            <div class="item-rarity ${item.rarity}">${item.rarity}</div>
            ${invItem.quantity > 1 ? `<div class="item-quantity">${invItem.quantity}</div>` : ''}
        `;

        // Add click handlers
        div.addEventListener('click', () => this.handleItemClick(item, invItem));
        div.addEventListener('mouseenter', (e) => this.showTooltip(e, item));
        div.addEventListener('mouseleave', () => this.hideTooltip());
        div.addEventListener('mousemove', (e) => this.updateTooltipPosition(e));

        return div;
    }

    getItemIcon(item) {
        const icons = {
            weapon: {
                melee: '⚔️',
                ranged: '🏹',
                eldritch: '🔮'
            },
            armor: {
                cloth: '👕',
                heavy: '🛡️',
                light: '🥋'
            },
            accessory: {
                magic: '💍',
                utility: '🧭',
                eldritch: '🌀'
            }
        };

        return icons[item.type]?.[item.category] || '📦';
    }

    handleItemClick(item, invItem) {
        if (item.type === 'weapon' || item.type === 'armor' || item.type === 'accessory') {
            if (invItem.equipped) {
                this.unequipItem(item);
            } else {
                this.equipItem(item);
            }
        } else {
            // Consumables: use immediately
            if (item.type === 'consumable' && window.encounterSystem?.itemSystem) {
                const ok = window.encounterSystem.itemSystem.useConsumable(item.id);
                if (ok) {
                    this.updateInventory();
                    this.updateStats();
                } else {
                    this.showNotification(`Cannot use ${item.name}`, 'error');
                }
            } else {
                this.showItemInfo(item);
            }
        }
    }

    equipItem(item) {
        if (window.encounterSystem?.itemSystem) {
            const success = window.encounterSystem.itemSystem.equipItem(item.id);
            if (success) {
                this.updateInventory();
                this.updateEquipment();
                this.updateStats();
                this.showNotification(`Equipped ${item.name}!`, 'success');
            } else {
                this.showNotification(`Failed to equip ${item.name}`, 'error');
            }
        }
    }

    unequipItem(item) {
        if (window.encounterSystem?.itemSystem) {
            const success = window.encounterSystem.itemSystem.unequipItem(item.id);
            if (success) {
                this.updateInventory();
                this.updateEquipment();
                this.updateStats();
                this.showNotification(`Unequipped ${item.name}!`, 'info');
            } else {
                this.showNotification(`Failed to unequip ${item.name}`, 'error');
            }
        }
    }

    showItemInfo(item) {
        // For now, just show a simple alert
        // In the future, this could open a detailed item info modal
        alert(`${item.name}\n\n${item.description}\n\n${item.lore}`);
    }

    updateEquipment() {
        if (!window.encounterSystem?.itemSystem) return;

        const equippedItems = window.encounterSystem.itemSystem.getEquippedItems();
        
        // Update weapon slot
        this.updateEquipmentSlot('weapon', equippedItems.weapon);
        this.updateEquipmentSlot('armor', equippedItems.armor);
        this.updateEquipmentSlot('accessory', equippedItems.accessory);
    }

    updateEquipmentSlot(slotType, item) {
        const slot = document.getElementById(`${slotType}-slot`);
        if (!slot) return;

        if (item) {
            const icon = this.getItemIcon(item);
            slot.innerHTML = `
                <div class="equipped-item">
                    <div class="equipped-item-icon">${icon}</div>
                    <div class="equipped-item-name">${item.name}</div>
                    <div class="equipped-item-stats">
                        ${item.stats.attack ? `Attack: +${item.stats.attack}` : ''}
                        ${item.stats.defense ? `Defense: +${item.stats.defense}` : ''}
                        ${item.stats.sanityBonus ? `Sanity: +${item.stats.sanityBonus}` : ''}
                    </div>
                    <button class="unequip-btn" onclick="window.inventoryUI.unequipItem(window.encounterSystem.itemSystem.getItem('${item.id}'))">
                        Unequip
                    </button>
                </div>
            `;
        } else {
            slot.innerHTML = '<div class="empty-slot">No ' + slotType + ' equipped</div>';
        }
    }

    updateStats() {
        const statsContainer = document.getElementById('equipment-stats');
        if (!statsContainer || !window.encounterSystem?.itemSystem) return;

        const baseStats = window.encounterSystem.playerStats;
        const equipmentStats = window.encounterSystem.itemSystem.getTotalStats();

        statsContainer.innerHTML = `
            <div class="stat-section">
                <h3>⚔️ Combat Stats</h3>
                <div class="stat-row">
                    <span class="stat-label">Attack</span>
                    <span class="stat-value">
                        ${baseStats.attack}
                        ${equipmentStats.attack > 0 ? `<span class="stat-bonus">+${equipmentStats.attack}</span>` : ''}
                    </span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Defense</span>
                    <span class="stat-value">
                        ${baseStats.defense}
                        ${equipmentStats.defense > 0 ? `<span class="stat-bonus">+${equipmentStats.defense}</span>` : ''}
                    </span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Luck</span>
                    <span class="stat-value">${baseStats.luck}</span>
                </div>
            </div>
            
            <div class="stat-section">
                <h3>❤️ Health & Sanity</h3>
                <div class="stat-row">
                    <span class="stat-label">Max Health</span>
                    <span class="stat-value">${baseStats.maxHealth}</span>
                </div>
                <div class="stat-row">
                    <span class="stat-label">Max Sanity</span>
                    <span class="stat-value">
                        ${baseStats.maxSanity}
                        ${equipmentStats.sanityBonus > 0 ? `<span class="stat-bonus">+${equipmentStats.sanityBonus}</span>` : ''}
                    </span>
                </div>
            </div>
            
            <div class="stat-section">
                <h3>🎒 Equipment Effects</h3>
                ${equipmentStats.effects.length > 0 ? 
                    equipmentStats.effects.map(effect => `<div class="stat-row"><span class="stat-label">${effect}</span><span class="stat-value">Active</span></div>`).join('') :
                    '<div class="stat-row"><span class="stat-label">No effects</span><span class="stat-value">-</span></div>'
                }
            </div>
        `;
    }

    showTooltip(event, item) {
        if (!this.tooltip) return;

        this.tooltip.innerHTML = `
            <div class="tooltip-name">${item.name}</div>
            <div class="tooltip-type">${item.type} • ${item.rarity}</div>
            <div class="tooltip-description">${item.description}</div>
            <div class="tooltip-stats">
                ${item.stats.attack ? `Attack: +${item.stats.attack}<br>` : ''}
                ${item.stats.defense ? `Defense: +${item.stats.defense}<br>` : ''}
                ${item.stats.sanityBonus ? `Sanity: +${item.stats.sanityBonus}<br>` : ''}
                ${item.stats.durability ? `Durability: ${item.stats.durability}<br>` : ''}
            </div>
            <div class="tooltip-lore">${item.lore}</div>
        `;

        this.tooltip.style.display = 'block';
        this.updateTooltipPosition(event);
    }

    updateTooltipPosition(event) {
        if (!this.tooltip || this.tooltip.style.display === 'none') return;

        const x = event.clientX + 10;
        const y = event.clientY + 10;

        this.tooltip.style.left = x + 'px';
        this.tooltip.style.top = y + 'px';
    }

    hideTooltip() {
        if (this.tooltip) {
            this.tooltip.style.display = 'none';
        }
    }

    showNotification(message, type = 'info') {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-weight: bold;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Make it globally available
window.InventoryUI = InventoryUI;
