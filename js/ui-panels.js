// UIPanels - lightweight modal/open handlers for Quest Log, Base, and User Settings
(function () {
    const qs = (sel) => document.querySelector(sel);

    function openModal(el) {
        if (!el) return;
        el.classList.remove('hidden');
        el.classList.add('open');
    }

    function closeModal(el) {
        if (!el) return;
        el.classList.add('hidden');
        el.classList.remove('open');
    }

    // Quest Log
    function openQuestLog() {
        // Prefer dedicated UI controller if present
        if (window.questLogUI?.open) {
            window.questLogUI.open();
            if (window.questLogUI.refresh) window.questLogUI.refresh();
            return;
        }
        const modal = qs('#quest-log-modal');
        openModal(modal);
        // Attempt refresh/population via known systems
        try {
            if (window.questLogUI?.refresh) window.questLogUI.refresh();
            else if (window.unifiedQuestSystem?.refreshQuestLogUI) window.unifiedQuestSystem.refreshQuestLogUI();
        } catch (e) {
            console.warn('Quest log refresh unavailable', e);
        }
    }

    // Base Management
    function openBaseManagement() {
        if (window.baseSystem?.showBaseManagementModal) {
            window.baseSystem.showBaseManagementModal();
            return;
        }
        const modal = qs('#base-management-modal');
        openModal(modal);
    }

    // User Settings (name, path color, symbol)
    function populateUserSettings() {
        const nameInput = qs('#player-name-input');
        const colorInput = qs('#path-color-input');
        const symbolGrid = qs('#symbol-options');
        const profile = window.sessionPersistence?.restoreProfile?.() || window.multiplayerManager?.playerProfile || {};

        if (nameInput && profile.name) nameInput.value = profile.name;
        if (colorInput) {
            const restoredColor = window.sessionPersistence?.restorePathColor?.();
            if (restoredColor) colorInput.value = restoredColor;
        }

        // Try to reuse tutorial symbol options generator
        try {
            if (symbolGrid) {
                if (window.tutorialSystem?.getSymbolOptionsHTML) {
                    symbolGrid.innerHTML = window.tutorialSystem.getSymbolOptionsHTML();
                } else {
                    // Minimal fallback
                    symbolGrid.innerHTML = [
                        'finnish','flower','triangle','hexagon','spiral','star','swedish','norwegian'
                    ].map(sym => `<div class="symbol-option" data-symbol="${sym}">${sym}</div>`).join('');
                }

                // Select previously chosen
                const selected = profile.symbol || 'finnish';
                const pre = symbolGrid.querySelector(`[data-symbol="${selected}"]`);
                if (pre) pre.classList.add('selected');

                // Delegated selection
                symbolGrid.addEventListener('click', (e) => {
                    const opt = e.target.closest('.symbol-option');
                    if (!opt) return;
                    symbolGrid.querySelectorAll('.symbol-option.selected').forEach(el => el.classList.remove('selected'));
                    opt.classList.add('selected');
                }, { once: false });
            }
        } catch (e) {
            console.warn('Symbol options unavailable', e);
        }
    }

    function openUserSettings() {
        const modal = qs('#user-settings-modal');
        populateUserSettings();
        openModal(modal);
    }

    function saveUserSettings() {
        const nameInput = qs('#player-name-input');
        const colorInput = qs('#path-color-input');
        const symbolGrid = qs('#symbol-options');
        const selectedEl = symbolGrid ? symbolGrid.querySelector('.symbol-option.selected') : null;
        const symbol = selectedEl ? selectedEl.getAttribute('data-symbol') : (window.multiplayerManager?.playerProfile?.symbol || 'finnish');
        const name = (nameInput?.value || '').trim() || (window.multiplayerManager?.playerProfile?.name || 'Explorer');
        const color = colorInput?.value || '#6c5ce7';

        try {
            window.sessionPersistence?.saveProfile?.({ name, symbol });
            window.sessionPersistence?.savePathColor?.(color);
        } catch (e) { console.warn('Failed to persist settings', e); }

        try {
            if (window.multiplayerManager?.updateLocalProfile) {
                window.multiplayerManager.updateLocalProfile({ name, symbol, pathColor: color });
            } else if (window.multiplayerManager) {
                window.multiplayerManager.playerProfile = { name, symbol, pathColor: color };
                window.multiplayerManager.broadcastSelf?.();
            }
        } catch (e) { console.warn('Multiplayer profile update failed', e); }

        try {
            if (window.mapEngine?.applyPathColor) window.mapEngine.applyPathColor(color);
            if (window.mapEngine?.pathLine) window.mapEngine.pathLine.setStyle?.({ color });
        } catch (e) { console.warn('Map path update failed', e); }

        closeModal(qs('#user-settings-modal'));
        try { window.gruesomeNotifications?.show?.('Settings saved', 'success'); } catch (_) {}
    }

    function wireButtons() {
        // DISABLED - Using new tablist.js instead
        console.log('🎛️ Old UI panels disabled - using tablist.js');
        return;
        
        // Wire all toggle buttons using data-panel attributes (tablist behavior)
        document.querySelectorAll('[data-panel]').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const panelId = button.getAttribute('data-panel');
                console.log(`🎛️ Toggle button clicked for panel: ${panelId}`);
                togglePanel(panelId);
            });
        });
        
        // Inventory refresh button
        const inventoryRefresh = document.getElementById('inventory-refresh');
        if (inventoryRefresh) {
            inventoryRefresh.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('🔄 Manual inventory refresh clicked');
                populateInventoryPanel();
            });
        }
        
        // Debug footer toggle (separate from tablist)
        const debugFooterToggle = document.getElementById('debug-footer-toggle');
        if (debugFooterToggle) {
            debugFooterToggle.addEventListener('click', () => togglePanel('debug-footer-panel'));
        }

        // Event delegation for debug footer buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('dbg-open-window')) {
                const debugPanel = document.getElementById('debug-panel');
                if (debugPanel) {
                    debugPanel.style.display = 'block';
                    // Also show the debug content inside
                    const debugContent = debugPanel.querySelector('.debug-content');
                    if (debugContent) {
                        debugContent.style.display = 'block';
                    }
                    console.log('🔧 Debug window opened');
                }
            } else if (e.target.classList.contains('dbg-heal')) {
                console.log('🔧 Heal button clicked');
                if (window.encounterSystem && window.encounterSystem.healPlayer) {
                    window.encounterSystem.healPlayer();
                } else {
                    console.warn('🔧 Encounter system not available');
                }
            } else if (e.target.classList.contains('dbg-sanity')) {
                console.log('🔧 Sanity button clicked');
                if (window.encounterSystem && window.encounterSystem.restoreSanity) {
                    window.encounterSystem.restoreSanity();
                } else {
                    console.warn('🔧 Encounter system not available');
                }
            } else if (e.target.classList.contains('dbg-heavy')) {
                console.log('🔧 HEVY button clicked');
                if (window.encounterSystem && window.encounterSystem.testLegendaryEncounter) {
                    window.encounterSystem.testLegendaryEncounter('heavy');
                } else {
                    console.warn('🔧 Encounter system not available');
                }
            } else if (e.target.classList.contains('dbg-monster')) {
                console.log('🔧 Monster button clicked');
                if (window.encounterSystem && window.encounterSystem.testLegendaryEncounter) {
                    window.encounterSystem.testLegendaryEncounter('eldritchMonster');
                } else {
                    console.warn('🔧 Encounter system not available');
                }
            }
        });

        // Modal controls
        const closeQuest = qs('#close-quest-log');
        if (closeQuest) closeQuest.addEventListener('click', () => closeModal(qs('#quest-log-modal')));
        const closeUser = qs('#close-user-settings');
        if (closeUser) closeUser.addEventListener('click', () => closeModal(qs('#user-settings-modal')));
        const cancelUser = qs('#cancel-user-settings');
        if (cancelUser) cancelUser.addEventListener('click', () => closeModal(qs('#user-settings-modal')));
        const saveUser = qs('#save-user-settings');
        if (saveUser) saveUser.addEventListener('click', saveUserSettings);
    }

    function toggleDebugPanel() {
        const debugPanel = document.getElementById('debug-panel');
        const footerPanel = document.getElementById('debug-footer-panel');
        const footerToggle = document.getElementById('debug-footer-toggle');
        
        if (!debugPanel || !footerPanel || !footerToggle) return;
        
        const isHidden = debugPanel.style.display === 'none' || debugPanel.style.display === '';
        debugPanel.style.display = isHidden ? 'block' : 'none';
        
        // Also toggle the debug content visibility
        const debugContent = debugPanel.querySelector('.debug-content');
        if (debugContent) {
            debugContent.style.display = isHidden ? 'block' : 'none';
        }
        
        footerToggle.textContent = isHidden ? 'Hide' : 'Toggle';
        
        // Visual feedback for footer panel
        if (isHidden) {
            footerPanel.style.borderColor = 'rgba(74, 158, 255, 0.6)';
            footerPanel.style.boxShadow = '0 0 15px rgba(74, 158, 255, 0.3)';
        } else {
            footerPanel.style.borderColor = 'rgba(74, 158, 255, 0.3)';
            footerPanel.style.boxShadow = 'none';
        }
    }

    function togglePanel(panelId) {
        console.log(`🎛️ Simple tablist toggle: ${panelId}`);
        
        // All tab panels
        const allTabs = [
            'inventory-panel',
            'quest-log-panel', 
            'base-management-panel',
            'user-settings-panel',
            'debug-footer-panel'
        ];
        
        // Close all tabs first
        allTabs.forEach(tabId => {
            const tab = document.getElementById(tabId);
            const button = document.querySelector(`[data-panel="${tabId}"]`);
            
            if (tab) {
                tab.style.display = 'none';
                tab.classList.remove('active');
            }
            
            if (button) {
                button.classList.remove('active');
                const toggleText = button.querySelector('.toggle-text');
                if (toggleText) toggleText.textContent = '⚡';
            }
        });
        
        // If this tab wasn't active, open it
        const targetTab = document.getElementById(panelId);
        const targetButton = document.querySelector(`[data-panel="${panelId}"]`);
        
        if (targetTab && targetButton) {
            console.log(`🎛️ Opening tab: ${panelId}`);
            
            // Show the tab
            targetTab.style.display = 'block';
            targetTab.classList.add('active');
            
            // Highlight the button
            targetButton.classList.add('active');
            const toggleText = targetButton.querySelector('.toggle-text');
            if (toggleText) toggleText.textContent = '⚡';
            
            // Populate content
            switch (panelId) {
                case 'inventory-panel':
                    populateInventoryPanel();
                    break;
                case 'quest-log-panel':
                    populateQuestLogPanel();
                    break;
                case 'base-management-panel':
                    populateBaseManagementPanel();
                    break;
                case 'user-settings-panel':
                    populateUserSettingsPanel();
                    break;
                case 'debug-footer-panel':
                    populateDebugFooterPanel();
                    break;
            }
        }
    }

    // Init after DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            wireButtons();
            initializePanels();
        });
    } else {
        wireButtons();
        initializePanels();
    }

    // Populate panel content
    function populateQuestLogPanel() {
        const questList = document.getElementById('quest-log-list');
        if (!questList) return;
        
        try {
            // Try to get quest data from unified quest system
            if (window.unifiedQuestSystem && window.unifiedQuestSystem.activeQuests) {
                const activeQuests = window.unifiedQuestSystem.activeQuests;
                if (activeQuests.length > 0) {
                    questList.innerHTML = activeQuests.map(quest => 
                        `<div style="padding:4px; border-bottom:1px solid rgba(255,255,255,0.1);">
                            <div style="font-weight:bold;">${quest.title}</div>
                            <div style="font-size:0.8em; opacity:0.8;">${quest.description}</div>
                        </div>`
                    ).join('');
                } else {
                    questList.innerHTML = '<div style="opacity:0.7;">No active quests</div>';
                }
            } else {
                questList.innerHTML = '<div style="opacity:0.7;">Quest system not available</div>';
            }
        } catch (e) {
            questList.innerHTML = '<div style="opacity:0.7;">Error loading quests</div>';
        }
    }

    function populateBaseManagementPanel() {
        const baseList = document.getElementById('base-management-list');
        if (!baseList) return;
        
        try {
            if (window.baseSystem && window.baseSystem.playerBase) {
                const base = window.baseSystem.playerBase;
                baseList.innerHTML = `
                    <div style="padding:4px; border-bottom:1px solid rgba(255,255,255,0.1);">
                        <div style="font-weight:bold;">${base.name}</div>
                        <div style="font-size:0.8em; opacity:0.8;">Territory: ${base.radius}m radius</div>
                        <button onclick="window.UIPanels.openBaseManagement()" style="margin-top:4px; padding:2px 6px; font-size:0.7em;">Manage</button>
                    </div>
                `;
            } else {
                baseList.innerHTML = `
                    <div style="opacity:0.7;">No base established</div>
                    <button onclick="window.UIPanels.openBaseManagement()" style="margin-top:4px; padding:2px 6px; font-size:0.7em;">Establish Base</button>
                `;
            }
        } catch (e) {
            baseList.innerHTML = '<div style="opacity:0.7;">Error loading base info</div>';
        }
    }

    function populateInventoryPanel() {
        console.log('🎒 populateInventoryPanel called');
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) {
            console.warn('🎒 inventory-list element not found');
            return;
        }
        
        try {
            // Try to get inventory from encounter system first
            let items = [];
            console.log('🎒 Checking encounter system inventory:', !!window.encounterSystem?.playerStats?.inventory);
            console.log('🎒 Checking item system inventory:', !!window.itemSystem?.playerInventory);
            
            if (window.encounterSystem && window.encounterSystem.playerStats && window.encounterSystem.playerStats.inventory) {
                items = window.encounterSystem.playerStats.inventory;
                console.log('🎒 Using encounter system inventory:', items.length, 'items');
            } else if (window.itemSystem && window.itemSystem.playerInventory) {
                console.log('🎒 Item system inventory raw:', window.itemSystem.playerInventory);
                // Convert item system inventory to display format
                items = window.itemSystem.playerInventory.map(invItem => {
                    const itemDef = window.itemSystem.getItem(invItem.id);
                    console.log('🎒 Converting item:', invItem.id, '->', itemDef);
                    return {
                        id: invItem.id,
                        emoji: itemDef?.emoji || '💠',
                        name: itemDef?.name || 'Unknown Item',
                        description: itemDef?.description || 'Mysterious item',
                        type: itemDef?.type || 'item',
                        quantity: invItem.quantity,
                        equipped: invItem.equipped
                    };
                });
                console.log('🎒 Converted items:', items);
            }
            
            console.log('🎒 Final items to display:', items.length, items);
            
            if (items && items.length > 0) {
                inventoryList.innerHTML = `
                    <div class="inventory-items">
                        ${items.map(item => createInventoryItemHTML(item)).join('')}
                    </div>
                `;
                console.log('🎒 Inventory panel updated with', items.length, 'items');
                
                // Add click handlers for items
                addInventoryItemHandlers();
            } else {
                inventoryList.innerHTML = '<div class="inventory-empty">No items</div>';
                console.log('🎒 Inventory panel shows "No items"');
            }
        } catch (e) {
            console.error('🎒 Error populating inventory panel:', e);
            inventoryList.innerHTML = '<div class="inventory-empty">Error loading inventory</div>';
        }
    }
    
    function createInventoryItemHTML(item) {
        const isConsumable = item.type === 'consumable';
        const quantityText = item.quantity > 1 ? ` x${item.quantity}` : '';
        const rarityClass = item.rarity ? `rarity-${item.rarity}` : 'rarity-common';
        // Use compact layout for better space usage
        const compactClass = 'compact';
        
        return `
            <div class="inventory-item-card ${isConsumable ? 'consumable' : ''} ${rarityClass} ${compactClass}" 
                 data-item-id="${item.id}" 
                 data-item-type="${item.type}">
                
                <!-- Item Media Section -->
                <div class="item-media">
                    ${item.image ? `
                        <img src="${item.image}" alt="${item.name}" class="item-image" loading="lazy">
                    ` : `
                        <div class="item-icon-placeholder">
                            <span class="item-emoji">${item.emoji || '💠'}</span>
                        </div>
                    `}
                    ${item.video ? `
                        <video class="item-video" muted loop>
                            <source src="${item.video}" type="video/mp4">
                        </video>
                    ` : ''}
                    ${item.model3d ? `
                        <canvas class="item-3d" data-model="${item.model3d}"></canvas>
                    ` : ''}
                    
                    <!-- Rarity Glow Effect -->
                    <div class="rarity-glow"></div>
                    
                    <!-- Quantity Badge -->
                    ${quantityText ? `
                        <div class="quantity-badge">
                            <span class="quantity-number">${item.quantity}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Item Info Section -->
                <div class="item-info">
                    <div class="item-header">
                        <h3 class="item-name">${item.name || 'Unknown Item'}</h3>
                        <div class="item-type-badge">${item.type || 'item'}</div>
                    </div>
                    
                    <p class="item-description">${item.description || 'Mysterious item'}</p>
                    
                    ${item.lore ? `
                        <div class="item-lore">
                            <p class="lore-text">${item.lore}</p>
                        </div>
                    ` : ''}
                    
                    ${item.stats ? `
                        <div class="item-stats">
                            ${Object.entries(item.stats).map(([stat, value]) => `
                                <div class="stat-row">
                                    <span class="stat-name">${stat}:</span>
                                    <span class="stat-value">${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
                
                <!-- Action Buttons -->
                <div class="item-actions">
                    ${isConsumable ? `
                        <button class="action-btn primary use-btn" data-action="use">
                            <span class="btn-icon">⚡</span>
                            <span class="btn-text">Use</span>
                        </button>
                        <button class="action-btn info-btn" data-action="info">
                            <span class="btn-icon">ℹ️</span>
                            <span class="btn-text">Info</span>
                        </button>
                    ` : `
                        <button class="action-btn equip-btn" data-action="equip">
                            <span class="btn-icon">⚔️</span>
                            <span class="btn-text">Equip</span>
                        </button>
                        <button class="action-btn info-btn" data-action="info">
                            <span class="btn-icon">ℹ️</span>
                            <span class="btn-text">Info</span>
                        </button>
                    `}
                </div>
                
                <!-- Swipe Indicators -->
                <div class="swipe-indicators">
                    <div class="swipe-left">🗑️</div>
                    <div class="swipe-right">⚡</div>
                </div>
            </div>
        `;
    }
    
    function addInventoryItemHandlers() {
        // Remove existing handlers
        document.querySelectorAll('.inventory-item-card').forEach(item => {
            item.replaceWith(item.cloneNode(true));
        });
        
        // Add new handlers for modern card-based inventory
        document.querySelectorAll('.inventory-item-card').forEach(item => {
            const itemId = item.dataset.itemId;
            
            // Enhanced touch handling for Samsung Ultra 23
            setupInventoryCardGestures(item, itemId);
            
            // Action buttons
            item.querySelectorAll('.action-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    handleItemAction(itemId, action);
                });
            });
        });
    }
    
    function setupInventoryCardGestures(card, itemId) {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        let touchStartDistance = 0;
        let isDragging = false;
        let dragThreshold = 40; // Reduced for better Samsung U23 sensitivity
        let isLongPress = false;
        let longPressTimer = null;
        
        // Touch start - Enhanced Samsung U23 handling
        card.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            touchStartDistance = 0;
            isDragging = false;
            isLongPress = false;
            
            // Visual feedback
            card.style.transform = 'scale(0.96)';
            card.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Long press detection for info
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                console.log(`📱 Long press detected on ${itemId}`);
                // Enhanced haptic feedback for long press
                if (navigator.vibrate) {
                    navigator.vibrate([10, 20, 10]);
                }
                // Visual feedback for long press
                card.style.transform = 'scale(1.02)';
                card.style.boxShadow = '0 8px 32px rgba(74, 158, 255, 0.4)';
            }, 400); // Reduced from 500ms for better UX
            
            // Initial haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(8);
            }
        }, { passive: false });
        
        // Touch move - Enhanced swipe handling for Samsung U23
        card.addEventListener('touchmove', (e) => {
            if (!touchStartPos) return;
            
            const currentPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            const deltaX = currentPos.x - touchStartPos.x;
            const deltaY = currentPos.y - touchStartPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            touchStartDistance = distance;
            
            // Clear long press timer if moving
            if (distance > 10 && longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
                isLongPress = false;
            }
            
            // Check if this is a horizontal swipe (more sensitive for Samsung U23)
            if (Math.abs(deltaX) > Math.abs(deltaY) && distance > 15) {
                isDragging = true;
                e.preventDefault();
                
                // Enhanced visual feedback for swiping
                const swipeProgress = Math.min(Math.abs(deltaX) / 80, 1); // Reduced threshold
                const direction = deltaX > 0 ? 1 : -1;
                
                card.style.transform = `translateX(${deltaX * 0.4}px) scale(${1 - swipeProgress * 0.03})`;
                card.style.opacity = 1 - swipeProgress * 0.2;
                
                // Show swipe indicators with better visibility
                const swipeLeft = card.querySelector('.swipe-left');
                const swipeRight = card.querySelector('.swipe-right');
                
                if (direction > 0 && swipeRight) {
                    swipeRight.style.opacity = Math.min(swipeProgress * 1.5, 1);
                    swipeRight.style.transform = `scale(${Math.min(swipeProgress * 1.2, 1)})`;
                    swipeRight.style.background = 'rgba(0, 255, 136, 0.8)';
                } else if (direction < 0 && swipeLeft) {
                    swipeLeft.style.opacity = Math.min(swipeProgress * 1.5, 1);
                    swipeLeft.style.transform = `scale(${Math.min(swipeProgress * 1.2, 1)})`;
                    swipeLeft.style.background = 'rgba(255, 100, 100, 0.8)';
                }
                
                // Haptic feedback during swipe
                if (swipeProgress > 0.7 && navigator.vibrate) {
                    navigator.vibrate(3);
                }
            }
        }, { passive: false });
        
        // Touch end - Enhanced gesture handling for Samsung U23
        card.addEventListener('touchend', (e) => {
            const touchDuration = Date.now() - touchStartTime;
            const currentPos = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
            const deltaX = currentPos.x - touchStartPos.x;
            const deltaY = currentPos.y - touchStartPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            // Clear long press timer
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            // Reset visual state with smooth animation
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.boxShadow = '';
            card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Hide swipe indicators with animation
            card.querySelectorAll('.swipe-indicators > div').forEach(indicator => {
                indicator.style.opacity = '0';
                indicator.style.transform = 'scale(0.3)';
                indicator.style.background = '';
            });
            
            // Enhanced gesture recognition for Samsung U23
            if (isDragging && Math.abs(deltaX) > dragThreshold) {
                // Swipe gesture - enhanced feedback
                if (deltaX > 0) {
                    // Swipe right - use item
                    console.log(`📱 Swipe right on ${itemId} - using item`);
                    handleItemAction(itemId, 'use');
                    // Success haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate([10, 5, 10]);
                    }
                } else {
                    // Swipe left - delete item
                    console.log(`📱 Swipe left on ${itemId} - deleting item`);
                    handleItemAction(itemId, 'delete');
                    // Warning haptic feedback
                    if (navigator.vibrate) {
                        navigator.vibrate([15, 10, 15]);
                    }
                }
            } else if (isLongPress) {
                // Long press - show item info
                console.log(`📱 Long press on ${itemId} - showing info`);
                handleItemAction(itemId, 'info');
            } else if (touchDuration < 300 && distance < 25) {
                // Quick tap - use/equip item (increased tolerance for Samsung U23)
                console.log(`📱 Tap on ${itemId} - using item`);
                handleItemAction(itemId, 'use');
                // Light haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(5);
                }
            }
            
            // Reset state
            isDragging = false;
            isLongPress = false;
            touchStartPos = { x: 0, y: 0 };
        }, { passive: false });
        
        // Touch cancel - Enhanced cleanup
        card.addEventListener('touchcancel', (e) => {
            // Clear timers
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            
            // Reset visual state
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.boxShadow = '';
            card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Reset state
            isDragging = false;
            isLongPress = false;
            touchStartPos = { x: 0, y: 0 };
        });
        
        // Click fallback for desktop
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('action-btn')) {
                handleItemAction(itemId, 'use');
            }
        });
    }
    
    function handleItemAction(itemId, action) {
        console.log(`🎒 Item action: ${action} on ${itemId}`);
        
        if (!window.itemSystem) {
            console.warn('🎒 Item system not available');
            return;
        }
        
        const item = window.itemSystem.getItem(itemId);
        if (!item) {
            console.warn(`🎒 Item ${itemId} not found`);
            return;
        }
        
        switch (action) {
            case 'use':
                if (item.type === 'consumable') {
                    useConsumableItem(itemId);
                } else {
                    equipItem(itemId);
                }
                break;
            case 'equip':
                equipItem(itemId);
                break;
            case 'info':
                showItemInfo(item);
                break;
            case 'delete':
                deleteItem(itemId);
                break;
        }
    }
    
    function deleteItem(itemId) {
        console.log(`🗑️ Deleting item: ${itemId}`);
        
        if (window.itemSystem && window.itemSystem.removeFromInventory) {
            const success = window.itemSystem.removeFromInventory(itemId, 1);
            if (success) {
                console.log(`🗑️ Successfully deleted ${itemId}`);
                // Refresh inventory display
                populateInventoryPanel();
                // Show notification
                if (window.encounterSystem && window.encounterSystem.showNotification) {
                    const item = window.itemSystem.getItem(itemId);
                    window.encounterSystem.showNotification(`Deleted ${item.name}!`, 'info');
                }
            } else {
                console.warn(`🗑️ Failed to delete ${itemId}`);
            }
        }
    }
    
    function useConsumableItem(itemId) {
        console.log(`🧪 Using consumable: ${itemId}`);
        
        if (window.itemSystem && window.itemSystem.useConsumable) {
            const success = window.itemSystem.useConsumable(itemId);
            if (success) {
                console.log(`🧪 Successfully used ${itemId}`);
                // Refresh inventory display
                populateInventoryPanel();
                // Show visual feedback instead of notification
                const item = window.itemSystem.getItem(itemId);
                showItemUseFeedback(item);
            } else {
                console.warn(`🧪 Failed to use ${itemId}`);
            }
        }
    }
    
    function showItemUseFeedback(item) {
        // Create a temporary visual feedback element
        const feedback = document.createElement('div');
        feedback.className = 'item-use-feedback';
        feedback.innerHTML = `
            <div class="feedback-content">
                <span class="feedback-icon">${item.emoji || '💠'}</span>
                <span class="feedback-text">Used ${item.name}!</span>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.classList.add('show');
        }, 10);
        
        // Remove after animation
        setTimeout(() => {
            feedback.classList.add('hide');
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 2000);
    }
    
    function equipItem(itemId) {
        console.log(`⚔️ Equipping item: ${itemId}`);
        // TODO: Implement equipment system
        if (window.encounterSystem && window.encounterSystem.showNotification) {
            const item = window.itemSystem.getItem(itemId);
            window.encounterSystem.showNotification(`Equipped ${item.name}!`, 'info');
        }
    }
    
    function showItemInfo(item) {
        console.log(`ℹ️ Showing info for: ${item.name}`);
        
        // Create item info modal
        const modal = document.createElement('div');
        modal.className = 'item-info-modal';
        modal.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${item.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="item-info-image">
                        <span class="item-emoji-large">${item.emoji || '💠'}</span>
                    </div>
                    <div class="item-info-details">
                        <p class="item-description">${item.description}</p>
                        ${item.lore ? `<div class="item-lore"><p>${item.lore}</p></div>` : ''}
                        ${item.stats ? `
                            <div class="item-stats">
                                <h4>Properties</h4>
                                ${Object.entries(item.stats).map(([stat, value]) => `
                                    <div class="stat-row">
                                        <span class="stat-name">${stat}:</span>
                                        <span class="stat-value">${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal handlers
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.add('hide');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
        
        modal.querySelector('.modal-backdrop').addEventListener('click', () => {
            modal.classList.add('hide');
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
    }

    function populateQuestLogPanel() {
        const questList = document.getElementById('quest-log-list');
        if (!questList) return;
        
        questList.innerHTML = `
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
    
    function populateBaseManagementPanel() {
        const baseList = document.getElementById('base-management-list');
        if (!baseList) return;
        
        baseList.innerHTML = `
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

    function populateUserSettingsPanel() {
        const settingsList = document.getElementById('user-settings-list');
        if (!settingsList) return;
        
        try {
            const profile = window.sessionPersistence?.restoreProfile?.() || window.multiplayerManager?.playerProfile || {};
            const name = profile.name || 'Explorer';
            const symbol = profile.symbol || 'finnish';
            const color = window.sessionPersistence?.restorePathColor?.() || '#6c5ce7';
            
            settingsList.innerHTML = `
                <div style="padding:4px; border-bottom:1px solid rgba(255,255,255,0.1);">
                    <div style="font-weight:bold;">${name}</div>
                    <div style="font-size:0.8em; opacity:0.8;">Symbol: ${symbol}</div>
                    <div style="font-size:0.8em; opacity:0.8;">Color: <span style="color:${color};">●</span></div>
                    <button onclick="window.UIPanels.openUserSettings()" style="margin-top:4px; padding:2px 6px; font-size:0.7em;">Edit</button>
                </div>
            `;
        } catch (e) {
            settingsList.innerHTML = '<div style="opacity:0.7;">Error loading settings</div>';
        }
    }

    function populateDebugFooterPanel() {
        const debugList = document.getElementById('debug-footer-list');
        if (!debugList) return;
        
        try {
            debugList.innerHTML = `
                <div style="display:grid; gap:6px; grid-template-columns: repeat(2, 1fr);">
                    <button class="debug-btn dbg-open-window" style="grid-column:1 / -1; font-size:0.8em;">Open Debug Window</button>
                    <button class="debug-btn dbg-heal" style="font-size:0.8em;">❤️ Heal</button>
                    <button class="debug-btn dbg-sanity" style="font-size:0.8em;">🧠 Sanity</button>
                    <button class="debug-btn dbg-heavy" style="font-size:0.8em;">⚡ HEVY</button>
                    <button class="debug-btn dbg-monster" style="font-size:0.8em;">👹 Monster</button>
                </div>
            `;
        } catch (e) {
            debugList.innerHTML = '<div style="opacity:0.7;">Debug tools available</div>';
        }
    }

    // Initialize panel content
    function initializePanels() {
        // Initialize inventory panel with collapsed state
        const inventoryPanel = document.getElementById('inventory-panel');
        if (inventoryPanel) {
            inventoryPanel.classList.add('collapsed');
            inventoryPanel.classList.remove('expanded');
        }
        
        populateInventoryPanel();
        populateQuestLogPanel();
        populateBaseManagementPanel();
        populateUserSettingsPanel();
        populateDebugFooterPanel();
        
        // Refresh panels periodically
        setInterval(populateInventoryPanel, 3000);
        setInterval(populateQuestLogPanel, 5000);
    }

    // Expose minimal API
    window.UIPanels = {
        openQuestLog,
        openBaseManagement,
        openUserSettings,
        saveUserSettings,
        toggleDebugPanel,
        populateInventoryPanel,
        populateQuestLogPanel,
        populateBaseManagementPanel,
        populateUserSettingsPanel,
        populateDebugFooterPanel
    };
})();


