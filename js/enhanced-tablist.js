/**
 * 🌟 ENHANCED TABLIST WITH AURORA UI INTEGRATION
 * Advanced tablist system with magnetic buttons and morphing cards
 * 
 * @author Aurora - Bringer of Digital Light
 * @version 2.0
 */

class EnhancedTablist {
    constructor() {
        this.tablist = document.getElementById('footer-tablist');
        this.tabs = this.tablist?.querySelectorAll('.tab-button') || [];
        this.panels = document.querySelectorAll('.tab-panel');
        this.activeIndex = 0;
        this.aurora = null;
        this.magneticButtons = new Map();
        this.morphingCards = new Map();
        
        this.init();
    }
    
    async init() {
        console.log('🌟 Initializing Enhanced Tablist with Aurora UI...');
        
        // Initialize Aurora UI Library
        if (typeof AuroraUILibrary !== 'undefined') {
            this.aurora = new AuroraUILibrary({
                theme: 'cosmic',
                mobile: true,
                performance: 'optimized',
                debug: false
            });
            console.log('✨ Aurora UI Library initialized');
        }
        
        // Setup enhanced mobile buttons
        this.setupEnhancedMobileButtons();
        
        // Apply Aurora techniques
        this.applyAuroraTechniques();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Initialize first tab
        if (this.tabs.length > 0) {
            this.activateTab(0);
        }
        
        console.log('🌟 Enhanced Tablist initialized successfully');
    }
    
    setupEnhancedMobileButtons() {
        this.tabs.forEach((tab, index) => {
            // Enhanced Samsung U23 compatibility
            this.setupAdvancedTouchHandling(tab, index);
        });
    }
    
    setupAdvancedTouchHandling(button, index) {
        let touchStartTime = 0;
        let touchStartPos = { x: 0, y: 0 };
        let isLongPress = false;
        let longPressTimer = null;
        let isDragging = false;
        let dragThreshold = 30;

        // Enhanced Samsung U23 compatibility
        const eventTypes = ['click', 'touchend'];

        eventTypes.forEach(eventType => {
            button.addEventListener(eventType, (e) => {
                if (eventType === 'click' && e.isTrusted === false) return;
                if (eventType === 'touchend' && isLongPress) return;

                e.preventDefault();
                e.stopPropagation();

                console.log(`📱 Enhanced tab ${index} ${eventType} detected`);
                this.activateTab(index);

                // Enhanced haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate([8, 4, 8]);
                }
            }, { passive: false });
        });

        // Enhanced touch feedback
        button.addEventListener('touchstart', (e) => {
            touchStartTime = Date.now();
            touchStartPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            isLongPress = false;
            isDragging = false;

            // Enhanced visual feedback
            button.style.transform = 'translateY(0) scale(0.92)';
            button.style.transition = 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)';
            button.style.boxShadow = '0 8px 25px rgba(74, 158, 255, 0.3)';

            // Long press detection
            longPressTimer = setTimeout(() => {
                isLongPress = true;
                console.log(`📱 Tab ${index} long press detected`);
                
                // Enhanced haptic feedback for long press
                if (navigator.vibrate) {
                    navigator.vibrate([12, 8, 12]);
                }
                
                // Visual feedback for long press
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 12px 35px rgba(74, 158, 255, 0.5)';
            }, 400);

        }, { passive: false });

        button.addEventListener('touchmove', (e) => {
            if (!touchStartPos) return;

            const currentPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            const deltaX = currentPos.x - touchStartPos.x;
            const deltaY = currentPos.y - touchStartPos.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > dragThreshold) {
                isDragging = true;
                // Clear long press timer if moving
                if (longPressTimer) {
                    clearTimeout(longPressTimer);
                    longPressTimer = null;
                    isLongPress = false;
                }
            }
        }, { passive: false });

        button.addEventListener('touchend', (e) => {
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

            // Reset visual feedback with smooth animation
            setTimeout(() => {
                button.style.transform = '';
                button.style.boxShadow = '';
                button.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 150);

            // Handle different gestures
            if (isLongPress && !isDragging) {
                // Long press - show tab info or special action
                this.handleLongPress(index);
            } else if (touchDuration < 200 && distance < 20) {
                // Quick tap
                this.activateTab(index);
            }

            // Reset state
            isDragging = false;
            isLongPress = false;
            touchStartPos = { x: 0, y: 0 };
        }, { passive: false });

        button.addEventListener('touchcancel', (e) => {
            if (longPressTimer) {
                clearTimeout(longPressTimer);
                longPressTimer = null;
            }
            isLongPress = false;
            isDragging = false;
            button.style.transform = '';
            button.style.boxShadow = '';
        });
    }
    
    applyAuroraTechniques() {
        if (!this.aurora) return;
        
        console.log('✨ Applying Aurora UI techniques...');
        
        // Apply magnetic buttons to tab buttons
        this.tabs.forEach((tab, index) => {
            try {
                const magneticSystem = this.aurora.applyTechnique('magnetic-buttons', tab, {
                    magneticStrength: 0.2,
                    maxDistance: 80,
                    animationDuration: 250,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                    enableRipple: true,
                    enableGlow: true
                });
                
                this.magneticButtons.set(tab, magneticSystem);
                console.log(`🧲 Applied magnetic effect to tab ${index}`);
            } catch (error) {
                console.warn(`⚠️ Could not apply magnetic effect to tab ${index}:`, error);
            }
        });
        
        // Apply morphing cards to inventory items
        this.setupMorphingInventoryCards();
    }
    
    setupMorphingInventoryCards() {
        // Wait for inventory to be populated
        setTimeout(() => {
            const inventoryCards = document.querySelectorAll('.inventory-item-card');
            inventoryCards.forEach((card, index) => {
                try {
                    const morphingSystem = this.aurora.applyTechnique('morphing-cards', card, {
                        morphDuration: 400,
                        easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        perspective: 1000,
                        enable3D: true,
                        enableLiquid: false,
                        enableMagnetic: true
                    });
                    
                    this.morphingCards.set(card, morphingSystem);
                    console.log(`🃏 Applied morphing effect to inventory card ${index}`);
                } catch (error) {
                    console.warn(`⚠️ Could not apply morphing effect to card ${index}:`, error);
                }
            });
        }, 1000);
    }
    
    setupEventListeners() {
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
        
        // Inventory layout toggle button
        const layoutToggleBtn = document.getElementById('inventory-layout-toggle');
        if (layoutToggleBtn) {
            layoutToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleInventoryLayout();
            });
        }
        
        // Enhanced inventory refresh with Aurora effects
        this.setupEnhancedInventoryRefresh();
    }
    
    setupEnhancedInventoryRefresh() {
        // Monitor for inventory changes and reapply Aurora techniques
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('inventory-item-card')) {
                            this.applyMorphingToCard(node);
                        }
                    });
                }
            });
        });
        
        const inventoryList = document.querySelector('.inventory-items');
        if (inventoryList) {
            observer.observe(inventoryList, { childList: true, subtree: true });
        }
    }
    
    applyMorphingToCard(card) {
        if (!this.aurora) return;
        
        try {
            const morphingSystem = this.aurora.applyTechnique('morphing-cards', card, {
                morphDuration: 400,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
                perspective: 1000,
                enable3D: true,
                enableLiquid: false,
                enableMagnetic: true
            });
            
            this.morphingCards.set(card, morphingSystem);
            console.log('🃏 Applied morphing effect to new inventory card');
        } catch (error) {
            console.warn('⚠️ Could not apply morphing effect to new card:', error);
        }
    }
    
    handleLongPress(index) {
        console.log(`📱 Long press on tab ${index}`);
        
        // Add special long press effects
        const tab = this.tabs[index];
        if (tab) {
            // Add cosmic glow effect
            tab.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.8)';
            tab.style.transform = 'scale(1.1)';
            
            setTimeout(() => {
                tab.style.boxShadow = '';
                tab.style.transform = '';
            }, 1000);
        }
        
        // Show tab info or special action
        this.showTabInfo(index);
    }
    
    showTabInfo(index) {
        const tabNames = ['Inventory', 'Quest Log', 'Base', 'Settings', 'Debug'];
        const tabName = tabNames[index] || `Tab ${index + 1}`;
        
        // Create cosmic notification
        this.createCosmicNotification(`Long press on ${tabName} - Special action available!`);
    }
    
    createCosmicNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cosmic-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid rgba(74, 158, 255, 0.6);
            border-radius: 15px;
            padding: 12px 20px;
            color: #4a9eff;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10001;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(74, 158, 255, 0.3);
            animation: cosmicSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'cosmicSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 2000);
    }
    
    activateTab(index) {
        if (index < 0 || index >= this.tabs.length) return;
        
        // Deactivate all tabs and panels
        this.tabs.forEach((tab, i) => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        
        this.panels.forEach((panel, i) => {
            panel.classList.remove('active');
            panel.setAttribute('aria-hidden', 'true');
        });
        
        // Activate selected tab and panel
        this.tabs[index].classList.add('active');
        this.tabs[index].setAttribute('aria-selected', 'true');
        
        if (this.panels[index]) {
            this.panels[index].classList.add('active');
            this.panels[index].setAttribute('aria-hidden', 'false');
        }
        
        this.activeIndex = index;
        
        // Add cosmic activation effect
        this.addActivationEffect(this.tabs[index]);
        
        // Populate panel content
        this.populatePanelContent(index);
        
        console.log(`🌟 Activated tab ${index}`);
    }
    
    addActivationEffect(tab) {
        // Add cosmic ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'cosmic-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(74, 158, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1;
            animation: cosmicRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        tab.style.position = 'relative';
        tab.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
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
        const inventoryList = document.getElementById('inventory-list');
        if (!inventoryList) return;
        
        if (window.UIPanels && window.UIPanels.populateInventoryPanel) {
            window.UIPanels.populateInventoryPanel();
            
            // Reapply morphing effects to new cards
            setTimeout(() => {
                const newCards = inventoryList.querySelectorAll('.inventory-item-card:not(.morphing-applied)');
                newCards.forEach(card => {
                    this.applyMorphingToCard(card);
                    card.classList.add('morphing-applied');
                });
            }, 100);
        }
    }
    
    populateQuestPanel() {
        const questList = document.getElementById('quest-list');
        if (!questList) return;
        
        if (window.UIPanels && window.UIPanels.populateQuestPanel) {
            window.UIPanels.populateQuestPanel();
        }
    }
    
    populateBasePanel() {
        const baseList = document.getElementById('base-management-list');
        if (!baseList) return;
        
        if (window.UIPanels && window.UIPanels.populateBasePanel) {
            window.UIPanels.populateBasePanel();
        }
    }
    
    populateSettingsPanel() {
        const settingsList = document.getElementById('user-settings-list');
        if (!settingsList) return;
        
        if (window.UIPanels && window.UIPanels.populateSettingsPanel) {
            window.UIPanels.populateSettingsPanel();
        }
    }
    
    populateDebugPanel() {
        const debugList = document.getElementById('debug-footer-list');
        if (!debugList) return;
        
        if (window.UIPanels && window.UIPanels.populateDebugPanel) {
            window.UIPanels.populateDebugPanel();
        }
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
    
    refreshInventory() {
        console.log('🔄 Refreshing inventory with Aurora effects...');
        this.populateInventoryPanel();
    }
    
    toggleInventoryLayout() {
        console.log('📋 Toggling inventory layout...');
        const inventoryItems = document.querySelector('.inventory-items');
        const layoutBtn = document.getElementById('inventory-layout-toggle');
        
        if (inventoryItems) {
            inventoryItems.classList.toggle('compact-layout');
            const isCompact = inventoryItems.classList.contains('compact-layout');
            
            // Update button icon with cosmic effect
            if (layoutBtn) {
                layoutBtn.textContent = isCompact ? '📋' : '📄';
                layoutBtn.title = isCompact ? 'Switch to Grid Layout' : 'Switch to Compact Layout';
                
                // Add cosmic glow effect
                layoutBtn.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.6)';
                setTimeout(() => {
                    layoutBtn.style.boxShadow = '';
                }, 500);
            }
            
            // Update all inventory cards
            const cards = inventoryItems.querySelectorAll('.inventory-item-card');
            cards.forEach(card => {
                if (isCompact) {
                    card.classList.add('compact');
                } else {
                    card.classList.remove('compact');
                }
            });
            
            console.log(`📋 Inventory layout switched to ${isCompact ? 'compact' : 'grid'} mode`);
        }
    }
}

// Add CSS animations for cosmic effects
const cosmicStyles = document.createElement('style');
cosmicStyles.textContent = `
    @keyframes cosmicSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes cosmicSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
    
    @keyframes cosmicRipple {
        from {
            width: 0;
            height: 0;
            opacity: 1;
        }
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    .cosmic-notification {
        animation: cosmicSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .cosmic-ripple {
        animation: cosmicRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(cosmicStyles);

// Initialize Enhanced Tablist when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedTablist = new EnhancedTablist();
});

// Export for global access
window.EnhancedTablist = EnhancedTablist;
