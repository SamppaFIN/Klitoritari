/**
 * Three.js UI Layer
 * Integrates Three.js UI system with the layered architecture
 */

// Prevent duplicate class declaration
if (typeof window.ThreeJSUILayer !== 'undefined') {
    console.warn('⚠️ ThreeJSUILayer already exists, skipping duplicate declaration');
} else {

class ThreeJSUILayer extends BaseLayer {
    constructor() {
        super('threejs-ui');
        this.zIndex = 10; // Above all other layers
        
        // Three.js systems
        this.sceneManager = null;
        this.buttonSystem = null;
        this.panelSystem = null;
        this.particleSystem = null;
        
        // UI state
        this.isInitialized = false;
        this.uiElements = new Map();
        this.activeTab = null; // Track currently active tab for toggle behavior
        this.playerCreated = false; // Track if player has been created
        
        console.log('🎮 ThreeJS UI Layer: Initialized');
    }
    
    init() {
        super.init();
        console.log('🎮 ThreeJS UI Layer: DISABLED - Using 2D UI instead');
        
        // Three.js UI is disabled - using 2D magnetic UI instead
        this.isInitialized = true;
        console.log('🎮 ThreeJS UI Layer: Skipped (2D UI active)');
        
        // TODO: Implement 2D magnetic UI system
        this.init2DMagneticUI();
    }
    
    /**
     * Initialize 2D Magnetic UI System
     */
    init2DMagneticUI() {
        console.log('🎨 Initializing 2D Magnetic UI...');
        
        // Create magnetic tabs container
        this.createMagneticTabsContainer();
        
        // Setup event listeners for 2D UI
        this.setup2DEventListeners();
        
        console.log('🎨 2D Magnetic UI initialized');
    }
    
    createMagneticTabsContainer() {
        // Create bottom magnetic tabs with modern design
        this.tabsContainer = document.createElement('div');
        this.tabsContainer.id = 'magnetic-tabs-container';
        this.tabsContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 12px;
            z-index: 1000;
            pointer-events: auto;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(20px);
            border-radius: 30px;
            padding: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        `;
        
        // Create magnetic tab buttons
        const tabs = [
            { id: 'inventory', label: 'Inventory', icon: '🎒', color: '#3b82f6', shortcut: 'I' },
            { id: 'quests', label: 'Quests', icon: '📜', color: '#10b981', shortcut: 'Q' },
            { id: 'base', label: 'Base', icon: '🏠', color: '#f59e0b', shortcut: 'B' },
            { id: 'settings', label: 'Settings', icon: '⚙️', color: '#8b5cf6', shortcut: 'S' }
        ];
        
        // Store tab data for later use
        this.tabData = tabs;
        
        tabs.forEach(tab => {
            const tabElement = this.createMagneticTab(tab);
            this.tabsContainer.appendChild(tabElement);
        });
        
        // Add to document
        document.body.appendChild(this.tabsContainer);
        
        // Add keyboard shortcuts
        this.setupKeyboardShortcuts();
        
        console.log('🎨 Magnetic tabs container created');
    }
    
    createMagneticTab(tabData) {
        const tab = document.createElement('div');
        tab.className = 'magnetic-tab';
        tab.dataset.tabId = tabData.id;
        tab.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            color: rgba(255, 255, 255, 0.8);
            padding: 12px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: 600;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            user-select: none;
            min-width: 100px;
            justify-content: center;
            border: 1px solid rgba(255, 255, 255, 0.1);
            position: relative;
            overflow: hidden;
        `;
        
        tab.innerHTML = `
            <span class="tab-icon" style="font-size: 16px;">${tabData.icon}</span>
            <span class="tab-label">${tabData.label}</span>
            <span class="tab-shortcut" style="
                position: absolute;
                top: 2px;
                right: 4px;
                font-size: 10px;
                background: rgba(255, 255, 255, 0.2);
                padding: 2px 4px;
                border-radius: 4px;
                font-weight: bold;
            ">${tabData.shortcut}</span>
        `;
        
        // Add magnetic hover effect with modern animations
        tab.addEventListener('mouseenter', () => {
            tab.style.transform = 'translateY(-4px) scale(1.02)';
            tab.style.background = `linear-gradient(135deg, ${tabData.color}20, ${this.lightenColor(tabData.color, 30)}20)`;
            tab.style.borderColor = `${tabData.color}40`;
            tab.style.boxShadow = `0 8px 25px ${tabData.color}30`;
            tab.style.color = 'white';
        });
        
        tab.addEventListener('mouseleave', () => {
            if (!tab.classList.contains('active')) {
                tab.style.transform = 'translateY(0) scale(1)';
                tab.style.background = 'rgba(255, 255, 255, 0.1)';
                tab.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                tab.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                tab.style.color = 'rgba(255, 255, 255, 0.8)';
            }
        });
        
        // Add click handler with ripple effect
        tab.addEventListener('click', (e) => {
            this.createRippleEffect(e, tab);
            this.switchTab(tabData.id);
        });
        
        return tab;
    }
    
    switchTab(tabId) {
        console.log('🎨 Switching to tab:', tabId);
        
        // Check if the same tab is being clicked (toggle behavior)
        if (this.activeTab === tabId) {
            console.log('🎨 Toggling off active tab:', tabId);
            this.hideAllTabs();
            this.activeTab = null;
            
            // Hide any existing panels
            this.hideAllPanels();
            
            // Emit event for tab closed
            if (this.eventBus) {
                this.eventBus.emit('ui:tab:closed', { tabId });
            }
            
            // Visual feedback handled by tab state
            
            return;
        }
        
        // Update active tab with smooth transition
        const tabs = this.tabsContainer.querySelectorAll('.magnetic-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.opacity = '0.6';
            tab.style.transform = 'translateY(0) scale(1)';
            tab.style.background = 'rgba(255, 255, 255, 0.1)';
            tab.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        const activeTab = this.tabsContainer.querySelector(`[data-tab-id="${tabId}"]`);
        if (activeTab) {
            const tabData = this.tabData.find(tab => tab.id === tabId);
            const color = tabData ? tabData.color : '#4a90e2';
            
            activeTab.classList.add('active');
            activeTab.style.opacity = '1';
            activeTab.style.transform = 'translateY(-2px) scale(1.05)';
            activeTab.style.background = `linear-gradient(135deg, ${color}40, ${this.lightenColor(color, 20)}40)`;
            activeTab.style.borderColor = `${color}60`;
        }
        
        this.activeTab = tabId;
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('ui:tab:changed', { tabId });
        }
        
        // Show corresponding panel with fullscreen option
        this.showTabPanel(tabId);
        
        // Visual feedback handled by tab state
    }
    
    /**
     * Hide all tabs (reset to inactive state)
     */
    hideAllTabs() {
        console.log('🎨 Hiding all tabs');
        const tabs = this.tabsContainer.querySelectorAll('.magnetic-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            tab.style.opacity = '0.6';
            tab.style.transform = 'translateY(0) scale(1)';
            tab.style.background = 'rgba(255, 255, 255, 0.1)';
            tab.style.borderColor = 'rgba(255, 255, 255, 0.1)';
        });
    }
    
    /**
     * Hide all panels
     */
    hideAllPanels() {
        console.log('🎨 Hiding all panels');
        const existingPanel = document.getElementById('tab-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
    }
    
    /**
     * Show visual feedback for tab toggle
     */
    showTabToggleFeedback(action, tabId) {
        const tabData = this.tabData.find(tab => tab.id === tabId);
        const tabName = tabData ? tabData.label : tabId;
        
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: 600;
            z-index: 10000;
            pointer-events: none;
            backdrop-filter: blur(10px);
            border: 2px solid ${action === 'opened' ? '#4CAF50' : '#ff4444'};
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            animation: tabTogglePulse 0.6s ease-out;
        `;
        
        notification.textContent = `${action === 'opened' ? '📂' : '📁'} ${tabName} ${action === 'opened' ? 'Opened' : 'Closed'}`;
        
        // Add animation keyframes if not already added
        if (!document.getElementById('tab-toggle-animation')) {
            const style = document.createElement('style');
            style.id = 'tab-toggle-animation';
            style.textContent = `
                @keyframes tabTogglePulse {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 600);
    }
    
    
    showTabPanel(tabId) {
        // Remove existing panels
        const existingPanel = document.getElementById('tab-panel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // Create fullscreen panel following modern mobile design principles
        const panel = document.createElement('div');
        panel.id = 'tab-panel';
        panel.style.cssText = `
            position: fixed;
            top: var(--header-height);
            left: 0;
            right: 0;
            bottom: 100px; /* Leave space for footer tabs */
            background: linear-gradient(135deg, rgba(10, 10, 20, 0.95), rgba(20, 20, 40, 0.95));
            backdrop-filter: blur(20px);
            z-index: 1500;
            pointer-events: auto;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
        `;
        
        // Create header with close button
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.3);
        `;
        
        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '✕';
        closeBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: white;
            width: 44px;
            height: 44px;
            border-radius: 22px;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
        `;
        
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.2)';
            closeBtn.style.transform = 'scale(1.1)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.transform = 'scale(1)';
        });
        
        closeBtn.addEventListener('click', () => {
            this.closePanel();
        });
        
        const title = document.createElement('h2');
        title.style.cssText = `
            color: white;
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        `;
        
        // Create content area
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            padding: 20px;
            overflow-y: auto;
        `;
        
        // Add content based on tab
        const tabContent = this.getTabContent(tabId);
        content.innerHTML = tabContent;
        
        // Set title based on tab
        const tabTitles = {
            'inventory': '🎒 Inventory',
            'quests': '📜 Quests',
            'base': '🏠 Base Management',
            'settings': '⚙️ Settings'
        };
        title.textContent = tabTitles[tabId] || 'Panel';
        
        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);
        panel.appendChild(content);
        
        // Add to document
        document.body.appendChild(panel);
        
        // Animate in with modern slide-up animation
        panel.style.opacity = '0';
        panel.style.transform = 'translateY(100%)';
        requestAnimationFrame(() => {
            panel.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            panel.style.opacity = '1';
            panel.style.transform = 'translateY(0)';
        });
        
        // Add keyboard support (ESC to close)
        this.setupPanelKeyboard();
    }
    
    closePanel() {
        const panel = document.getElementById('tab-panel');
        if (panel) {
            panel.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            panel.style.opacity = '0';
            panel.style.transform = 'translateY(100%)';
            setTimeout(() => {
                panel.remove();
                // Reset the active tab state when closing
                this.activeTab = null;
                this.hideAllTabs();
            }, 300);
        }
    }
    
    setupPanelKeyboard() {
        const handleKeyPress = (e) => {
            if (e.key === 'Escape') {
                this.closePanel();
                document.removeEventListener('keydown', handleKeyPress);
            }
        };
        document.addEventListener('keydown', handleKeyPress);
    }
    
    getTabContent(tabId) {
        switch (tabId) {
            case 'inventory':
                return `
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h3 style="color: #3b82f6; margin: 0; font-size: 20px; font-weight: 600;">🎒 Inventory</h3>
                            <span style="color: rgba(255,255,255,0.6); font-size: 14px;">3/20 slots</span>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 12px;">
                            ${Array.from({length: 9}, (_, i) => `
                                <div class="inventory-slot" style="
                                    background: rgba(255,255,255,0.05);
                                    border: 2px solid rgba(255,255,255,0.1);
                                    padding: 16px 8px;
                                    border-radius: 12px;
                                    text-align: center;
                                    min-height: 80px;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 12px;
                                    color: rgba(255,255,255,0.4);
                                    transition: all 0.2s ease;
                                " onmouseover="this.style.borderColor='#3b82f6'; this.style.background='rgba(59,130,246,0.1)'" 
                                   onmouseout="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.05)'">
                                    ${i < 3 ? 'Empty' : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            case 'quests':
                return `
                    <div style="margin-bottom: 24px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                            <h3 style="color: #10b981; margin: 0; font-size: 20px; font-weight: 600;">📜 Quests</h3>
                            <span style="color: rgba(255,255,255,0.6); font-size: 14px;">2 active</span>
                        </div>
                        <div style="space-y: 12px;">
                            <div style="
                                background: rgba(16, 185, 129, 0.1);
                                border: 1px solid rgba(16, 185, 129, 0.3);
                                padding: 16px;
                                border-radius: 12px;
                                margin-bottom: 12px;
                            ">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <strong style="color: #10b981; font-size: 16px;">Explore the Area</strong>
                                    <span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">ACTIVE</span>
                                </div>
                                <p style="color: rgba(255,255,255,0.8); margin: 0 0 12px 0; font-size: 14px; line-height: 1.4;">Walk around and discover new locations</p>
                                <div style="background: rgba(0,0,0,0.3); height: 6px; border-radius: 3px; overflow: hidden;">
                                    <div style="background: #10b981; height: 100%; width: 30%; transition: width 0.3s ease;"></div>
                                </div>
                                <small style="color: rgba(255,255,255,0.6);">Progress: 3/10 locations</small>
                            </div>
                            <div style="
                                background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1);
                                padding: 16px;
                                border-radius: 12px;
                            ">
                                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                                    <strong style="color: white; font-size: 16px;">Find Resources</strong>
                                    <span style="background: rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600;">PENDING</span>
                                </div>
                                <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px; line-height: 1.4;">Collect materials for your base</p>
                            </div>
                        </div>
                    </div>
                `;
            case 'base':
                // Check if player has a base
                const hasBase = window.SimpleBaseInit && window.SimpleBaseInit.baseData;
                
                if (!hasBase) {
                    // No base - show establish base option
                    return `
                        <div style="margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <h3 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 600;">🏠 Base Management</h3>
                                <span style="color: rgba(255,255,255,0.6); font-size: 14px;">No Base</span>
                            </div>
                            
                            <!-- Lovecraftian Cosmic Narrative -->
                            <div style="
                                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                                border: 1px solid rgba(139, 92, 246, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                                font-family: 'Cinzel', serif;
                            ">
                                <div style="color: #8b5cf6; font-size: 16px; font-weight: 600; margin-bottom: 12px; text-align: center;">
                                    🌌 The Cosmic Void Beckons
                                </div>
                                <div style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; text-align: center; font-style: italic;">
                                    "In the vast emptiness between dimensions, where the stars themselves whisper ancient secrets, 
                                    a nexus of power awaits your claim. The cosmic energies that flow through this realm 
                                    yearn for a master to channel their infinite potential..."
                                </div>
                            </div>
                            
                            <!-- Establish Base Section -->
                            <div style="
                                background: rgba(34, 197, 94, 0.1);
                                border: 1px solid rgba(34, 197, 94, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                            ">
                                <div style="color: #22c55e; font-size: 18px; font-weight: 600; margin-bottom: 12px; text-align: center;">
                                    🏗️ Establish Your Cosmic Base
                                </div>
                                <div style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 16px; text-align: center;">
                                    Establish your base at your current location. You can only have one base at a time.
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                                    <div style="text-align: center;">
                                        <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 4px;">Cost</div>
                                        <div style="color: #f59e0b; font-size: 16px; font-weight: 600;">1,000 Steps</div>
                                    </div>
                                    <div style="text-align: center;">
                                        <div style="color: rgba(255,255,255,0.6); font-size: 12px; margin-bottom: 4px;">Limit</div>
                                        <div style="color: #22c55e; font-size: 16px; font-weight: 600;">1 Base Max</div>
                                    </div>
                                </div>
                                
                                <!-- Establish Base Button -->
                                <button onclick="window.establishBaseAtCurrentLocation()" style="
                                    background: linear-gradient(135deg, #22c55e, #16a34a);
                                    color: white;
                                    border: none;
                                    padding: 16px 24px;
                                    border-radius: 12px;
                                    cursor: pointer;
                                    font-size: 16px;
                                    font-weight: 600;
                                    width: 100%;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(34, 197, 94, 0.4)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(34, 197, 94, 0.3)'">
                                    🏗️ Establish Base
                                </button>
                            </div>
                            
                            <!-- Cosmic Shop Preview -->
                            <div style="
                                background: rgba(168, 85, 247, 0.1);
                                border: 1px solid rgba(168, 85, 247, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                            ">
                                <div style="color: #a855f7; font-size: 16px; font-weight: 600; margin-bottom: 12px; text-align: center;">
                                    🛒 Cosmic Shop (Coming Soon)
                                </div>
                                <div style="color: rgba(255,255,255,0.6); font-size: 14px; text-align: center; font-style: italic;">
                                    "The ancient merchants of the void await your patronage. 
                                    Once your base is established, cosmic wares and forbidden knowledge 
                                    shall be revealed to those worthy..."
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Has base - show management interface
                    return `
                        <div style="margin-bottom: 24px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                                <h3 style="color: #f59e0b; margin: 0; font-size: 20px; font-weight: 600;">🏠 Base Management</h3>
                                <span style="color: rgba(255,255,255,0.6); font-size: 14px;">Level 1</span>
                            </div>
                            
                            <!-- Lovecraftian Cosmic Narrative -->
                            <div style="
                                background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1));
                                border: 1px solid rgba(139, 92, 246, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                                font-family: 'Cinzel', serif;
                            ">
                                <div style="color: #8b5cf6; font-size: 16px; font-weight: 600; margin-bottom: 12px; text-align: center;">
                                    🌌 Your Cosmic Nexus
                                </div>
                                <div style="color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; text-align: center; font-style: italic;">
                                    "The cosmic energies flow through your established nexus, pulsing with the rhythm of the universe itself. 
                                    Your base stands as a beacon in the void, channeling the ancient powers that course through 
                                    the very fabric of reality..."
                                </div>
                            </div>
                            
                            <!-- Base Status -->
                            <div style="
                                background: rgba(245, 158, 11, 0.1);
                                border: 1px solid rgba(245, 158, 11, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                            ">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                                    <div>
                                        <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 4px;">Base Level</div>
                                        <div style="color: #f59e0b; font-size: 24px; font-weight: 700;">1</div>
                                    </div>
                                    <div>
                                        <div style="color: rgba(255,255,255,0.6); font-size: 14px; margin-bottom: 4px;">Resources</div>
                                        <div style="color: white; font-size: 18px; font-weight: 600;">0/100</div>
                                    </div>
                                </div>
                                <div style="background: rgba(0,0,0,0.3); height: 8px; border-radius: 4px; overflow: hidden;">
                                    <div style="background: #f59e0b; height: 100%; width: 0%; transition: width 0.3s ease;"></div>
                                </div>
                            </div>
                            
                            <!-- Base Management Buttons -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                                <button style="
                                    background: linear-gradient(135deg, #f59e0b, #fbbf24);
                                    color: white;
                                    border: none;
                                    padding: 16px 20px;
                                    border-radius: 12px;
                                    cursor: pointer;
                                    font-size: 14px;
                                    font-weight: 600;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(245, 158, 11, 0.4)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(245, 158, 11, 0.3)'">
                                    ⬆️ Upgrade Base
                                </button>
                                
                                <button onclick="window.relocateBase()" style="
                                    background: linear-gradient(135deg, #8b5cf6, #7c3aed);
                                    color: white;
                                    border: none;
                                    padding: 16px 20px;
                                    border-radius: 12px;
                                    cursor: pointer;
                                    font-size: 14px;
                                    font-weight: 600;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(139, 92, 246, 0.4)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'">
                                    📍 Relocate Base
                                </button>
                            </div>
                            
                            <!-- Player Activity Controls -->
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                                <button onclick="window.togglePlayerTrails()" style="
                                    background: linear-gradient(135deg, #10b981, #059669);
                                    color: white;
                                    border: none;
                                    padding: 12px 16px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-size: 12px;
                                    font-weight: 600;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(16, 185, 129, 0.4)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(16, 185, 129, 0.3)'">
                                    🛤️ Toggle Trails
                                </button>
                                
                                <button onclick="window.showOtherBases()" style="
                                    background: linear-gradient(135deg, #6366f1, #4f46e5);
                                    color: white;
                                    border: none;
                                    padding: 12px 16px;
                                    border-radius: 8px;
                                    cursor: pointer;
                                    font-size: 12px;
                                    font-weight: 600;
                                    transition: all 0.2s ease;
                                    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
                                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(99, 102, 241, 0.4)'"
                                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(99, 102, 241, 0.3)'">
                                    🏗️ Other Bases
                                </button>
                            </div>
                            
                            <!-- Cosmic Shop -->
                            <div style="
                                background: rgba(168, 85, 247, 0.1);
                                border: 1px solid rgba(168, 85, 247, 0.3);
                                padding: 20px;
                                border-radius: 12px;
                                margin-bottom: 20px;
                            ">
                                <div style="color: #a855f7; font-size: 18px; font-weight: 600; margin-bottom: 16px; text-align: center;">
                                    🛒 Cosmic Shop
                                </div>
                                
                                <!-- Shop Items -->
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                                    <button onclick="window.purchaseShopItem('energy-core')" style="
                                        background: rgba(0,0,0,0.2);
                                        border: 1px solid rgba(168, 85, 247, 0.3);
                                        padding: 12px;
                                        border-radius: 8px;
                                        text-align: center;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                                    " onmouseover="this.style.borderColor='rgba(168, 85, 247, 0.6)'; this.style.backgroundColor='rgba(0,0,0,0.3)'"
                                       onmouseout="this.style.borderColor='rgba(168, 85, 247, 0.3)'; this.style.backgroundColor='rgba(0,0,0,0.2)'">
                                        <div style="color: #a855f7; font-size: 24px; margin-bottom: 8px;">⚡</div>
                                        <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Energy Core</div>
                                        <div style="color: #f59e0b; font-size: 12px;">500 Steps</div>
                                    </button>
                                    
                                    <button onclick="window.purchaseShopItem('shield-generator')" style="
                                        background: rgba(0,0,0,0.2);
                                        border: 1px solid rgba(168, 85, 247, 0.3);
                                        padding: 12px;
                                        border-radius: 8px;
                                        text-align: center;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                                    " onmouseover="this.style.borderColor='rgba(168, 85, 247, 0.6)'; this.style.backgroundColor='rgba(0,0,0,0.3)'"
                                       onmouseout="this.style.borderColor='rgba(168, 85, 247, 0.3)'; this.style.backgroundColor='rgba(0,0,0,0.2)'">
                                        <div style="color: #a855f7; font-size: 24px; margin-bottom: 8px;">🛡️</div>
                                        <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Shield Generator</div>
                                        <div style="color: #f59e0b; font-size: 12px;">750 Steps</div>
                                    </button>
                                    
                                    <button onclick="window.purchaseShopItem('crystal-matrix')" style="
                                        background: rgba(0,0,0,0.2);
                                        border: 1px solid rgba(168, 85, 247, 0.3);
                                        padding: 12px;
                                        border-radius: 8px;
                                        text-align: center;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                                    " onmouseover="this.style.borderColor='rgba(168, 85, 247, 0.6)'; this.style.backgroundColor='rgba(0,0,0,0.3)'"
                                       onmouseout="this.style.borderColor='rgba(168, 85, 247, 0.3)'; this.style.backgroundColor='rgba(0,0,0,0.2)'">
                                        <div style="color: #a855f7; font-size: 24px; margin-bottom: 8px;">🔮</div>
                                        <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Crystal Matrix</div>
                                        <div style="color: #f59e0b; font-size: 12px;">1000 Steps</div>
                                    </button>
                                    
                                    <button onclick="window.purchaseShopItem('void-portal')" style="
                                        background: rgba(0,0,0,0.2);
                                        border: 1px solid rgba(168, 85, 247, 0.3);
                                        padding: 12px;
                                        border-radius: 8px;
                                        text-align: center;
                                        cursor: pointer;
                                        transition: all 0.2s ease;
                                    " onmouseover="this.style.borderColor='rgba(168, 85, 247, 0.6)'; this.style.backgroundColor='rgba(0,0,0,0.3)'"
                                       onmouseout="this.style.borderColor='rgba(168, 85, 247, 0.3)'; this.style.backgroundColor='rgba(0,0,0,0.2)'">
                                        <div style="color: #a855f7; font-size: 24px; margin-bottom: 8px;">🌌</div>
                                        <div style="color: white; font-size: 14px; font-weight: 600; margin-bottom: 4px;">Void Portal</div>
                                        <div style="color: #f59e0b; font-size: 12px;">1500 Steps</div>
                                    </button>
                                </div>
                                
                                <div style="color: rgba(255,255,255,0.6); font-size: 12px; text-align: center; font-style: italic;">
                                    "The cosmic merchants whisper of greater treasures yet to be discovered..."
                                </div>
                            </div>
                        </div>
                    `;
                }
            case 'settings':
                return `
                    <div style="margin-bottom: 24px;">
                        <h3 style="color: #8b5cf6; margin: 0 0 20px 0; font-size: 20px; font-weight: 600;">⚙️ Settings</h3>
                        <div style="space-y: 20px;">
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 16px;">Player Name</label>
                                <input type="text" value="Cosmic Explorer" style="
                                    width: 100%;
                                    padding: 16px;
                                    border-radius: 12px;
                                    border: 2px solid rgba(255,255,255,0.1);
                                    background: rgba(255,255,255,0.05);
                                    color: white;
                                    font-size: 16px;
                                    transition: all 0.2s ease;
                                " onfocus="this.style.borderColor='#8b5cf6'; this.style.background='rgba(139,92,246,0.1)'"
                                   onblur="this.style.borderColor='rgba(255,255,255,0.1)'; this.style.background='rgba(255,255,255,0.05)'">
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <label style="display: block; margin-bottom: 8px; color: white; font-weight: 500; font-size: 16px;">Path Color</label>
                                <div style="display: flex; gap: 12px; align-items: center;">
                                    <input type="color" value="#3b82f6" style="
                                        width: 60px;
                                        height: 60px;
                                        border-radius: 12px;
                                        border: 2px solid rgba(255,255,255,0.1);
                                        cursor: pointer;
                                    ">
                                    <div style="flex: 1; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 12px; color: rgba(255,255,255,0.8);">
                                        Choose your path color for the map
                                    </div>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <label style="color: white; font-weight: 500; font-size: 16px;">Dark Mode</label>
                                    <div class="toggle-switch" style="
                                        width: 50px;
                                        height: 28px;
                                        background: rgba(255,255,255,0.2);
                                        border-radius: 14px;
                                        position: relative;
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                    " onclick="this.style.background=this.style.background.includes('8b5cf6') ? 'rgba(255,255,255,0.2)' : '#8b5cf6'; this.querySelector('.toggle-knob').style.transform=this.querySelector('.toggle-knob').style.transform.includes('translateX(22px)') ? 'translateX(2px)' : 'translateX(22px)'">
                                        <div class="toggle-knob" style="
                                            width: 24px;
                                            height: 24px;
                                            background: white;
                                            border-radius: 12px;
                                            position: absolute;
                                            top: 2px;
                                            left: 2px;
                                            transition: all 0.3s ease;
                                            transform: translateX(2px);
                                        "></div>
                                    </div>
                                </div>
                                <small style="color: rgba(255,255,255,0.6);">Enable dark mode for better visibility</small>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <label style="color: white; font-weight: 500; font-size: 16px;">Notifications</label>
                                    <div class="toggle-switch" style="
                                        width: 50px;
                                        height: 28px;
                                        background: #8b5cf6;
                                        border-radius: 14px;
                                        position: relative;
                                        cursor: pointer;
                                        transition: all 0.3s ease;
                                    " onclick="this.style.background=this.style.background.includes('8b5cf6') ? 'rgba(255,255,255,0.2)' : '#8b5cf6'; this.querySelector('.toggle-knob').style.transform=this.querySelector('.toggle-knob').style.transform.includes('translateX(22px)') ? 'translateX(2px)' : 'translateX(22px)'">
                                        <div class="toggle-knob" style="
                                            width: 24px;
                                            height: 24px;
                                            background: white;
                                            border-radius: 12px;
                                            position: absolute;
                                            top: 2px;
                                            left: 2px;
                                            transition: all 0.3s ease;
                                            transform: translateX(22px);
                                        "></div>
                                    </div>
                                </div>
                                <small style="color: rgba(255,255,255,0.6);">Receive quest updates and achievements</small>
                            </div>
                            
                            <button id="settings-action-button" style="
                                background: linear-gradient(135deg, #8b5cf6, #a78bfa);
                                color: white;
                                border: none;
                                padding: 16px 24px;
                                border-radius: 12px;
                                cursor: pointer;
                                font-size: 16px;
                                font-weight: 600;
                                width: 100%;
                                transition: all 0.2s ease;
                                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(139, 92, 246, 0.4)'"
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 12px rgba(139, 92, 246, 0.3)'"
                               onclick="window.eldritchApp?.layerManager?.getLayer?.('threejs-ui')?.handleSettingsAction?.()">
                                ${this.playerCreated ? 'Save Settings' : 'Create Player And Enter Sanctuary'}
                            </button>
                        </div>
                    </div>
                `;
            default:
                return '<p style="color: rgba(255,255,255,0.6); text-align: center; padding: 40px;">Content not available</p>';
        }
    }
    
    setup2DEventListeners() {
        // Listen for player creation events
        this.eventBus.on('ui:show-player-creation', (data) => {
            console.log('🎨 2D UI: Received player creation request:', data);
            this.showPlayerCreationDialog(data);
        });
        
        // Listen for game start events
        this.eventBus.on('game:start', (data) => {
            console.log('🎨 2D UI: Game start requested:', data);
            this.showMagneticTabs();
        });
        
        console.log('🎨 2D UI event listeners setup complete');
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when no panel is open
            if (document.getElementById('tab-panel')) return;
            
            const shortcuts = {
                'i': 'inventory',
                'q': 'quests', 
                'b': 'base',
                's': 'settings'
            };
            
            const tabId = shortcuts[e.key.toLowerCase()];
            if (tabId) {
                e.preventDefault();
                this.switchTab(tabId);
            }
        });
    }
    
    createRippleEffect(event, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add CSS animation if not exists
        if (!document.getElementById('ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    showPlayerCreationDialog(data) {
        console.log('🎨 2D UI: Showing player creation dialog...');
        
        // Show the settings tab for player creation
        this.switchTab('settings');
    }
    
    showMagneticTabs() {
        console.log('🎨 2D UI: Showing magnetic tabs...');
        
        if (this.tabsContainer) {
            this.tabsContainer.style.display = 'flex';
            console.log('🎨 Magnetic tabs container displayed:', this.tabsContainer);
            console.log('🎨 Tab count:', this.tabsContainer.children.length);
        } else {
            console.error('❌ Magnetic tabs container not found!');
        }
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    /**
     * Set up layer transparency and pointer events
     * ThreeJSUILayer handles mouse events for 3D UI interactions
     */
    setupLayerTransparency() {
        // ThreeJSUILayer handles mouse events for 3D UI interactions (magnetic tabs, 3D panels)
        this.pointerEvents = 'auto';
    }
    
    initThreeJSSystems() {
        // Use the enhanced Three.js UI system
        if (typeof window.EnhancedThreeJSUI !== 'undefined') {
            this.enhancedUI = new window.EnhancedThreeJSUI();
            this.enhancedUI.setEventBus(this.eventBus);
            this.enhancedUI.init(this.canvas.parentElement);
            console.log('🎮 Enhanced ThreeJS UI initialized');
        } else {
            // Fallback to basic Three.js systems
            this.sceneManager = new ThreeJSSceneManager();
            this.sceneManager.init(this.canvas.parentElement);
            
            this.buttonSystem = new MagneticButtonSystem(this.sceneManager);
            this.panelSystem = new ThreeJSUIPanels(this.sceneManager);
            this.particleSystem = new ParticleEffectsSystem(this.sceneManager);
            
            console.log('🎮 Basic ThreeJS systems initialized');
        }
    }
    
    setupEventListeners() {
        console.log('🎮 Setting up Three.js UI event listeners...');
        
        // Listen for player creation events
        this.eventBus.on('ui:show-player-creation', (data) => {
            console.log('🎮 Received player creation request:', data);
            this.showPlayerCreationPanel(data);
        });
        
        // Listen for game start events
        this.eventBus.on('game:start', (data) => {
            console.log('🎮 Game start requested:', data);
            this.handleGameStart(data);
        });
        
        console.log('🎮 Three.js UI event listeners setup complete');
    }
    
    createInitialUI() {
        // Create main menu buttons
        this.createMainMenuButtons();
        
        // Create debug panel
        this.createDebugPanel();
        
        // Create ambient particles
        this.createAmbientEffects();
        
        console.log('🎮 Initial UI elements created');
    }
    
    createMainMenuButtons() {
        // Check if we're using enhanced UI or basic systems
        if (this.enhancedUI) {
            console.log('🎮 Using enhanced UI - buttons already created in magnetic tabs');
            return;
        }
        
        if (!this.buttonSystem) {
            console.error('❌ Button system not available!');
            return;
        }
        
        const buttonConfigs = [
            {
                id: 'gps-button',
                position: { x: -6, y: 2, z: 0 },
                size: { width: 2, height: 0.6, depth: 0.1 },
                color: 0x10b981,
                hoverColor: 0x34d399,
                text: 'GPS',
                icon: '📍',
                onClick: (button) => this.handleGPSButtonClick(button)
            },
            {
                id: 'menu-button',
                position: { x: -6, y: 1, z: 0 },
                size: { width: 2, height: 0.6, depth: 0.1 },
                color: 0x3b82f6,
                hoverColor: 0x60a5fa,
                text: 'Menu',
                icon: '☰',
                onClick: (button) => this.handleMenuButtonClick(button)
            },
            {
                id: 'settings-button',
                position: { x: -6, y: 0, z: 0 },
                size: { width: 2, height: 0.6, depth: 0.1 },
                color: 0x8b5cf6,
                hoverColor: 0xa78bfa,
                text: 'Settings',
                icon: '⚙️',
                onClick: (button) => this.handleSettingsButtonClick(button)
            },
            {
                id: 'debug-button',
                position: { x: -6, y: -1, z: 0 },
                size: { width: 2, height: 0.6, depth: 0.1 },
                color: 0xf59e0b,
                hoverColor: 0xfbbf24,
                text: 'Debug',
                icon: '🔧',
                onClick: (button) => this.handleDebugButtonClick(button)
            }
        ];
        
        buttonConfigs.forEach(config => {
            const button = this.buttonSystem.createButton(config);
            this.uiElements.set(config.id, button);
        });
        
        console.log('🎮 Main menu buttons created');
    }
    
    createDebugPanel() {
        // Check if we're using enhanced UI or basic systems
        if (this.enhancedUI) {
            console.log('🎮 Using enhanced UI - debug panel handled by tab system');
            return;
        }
        
        if (!this.panelSystem) {
            console.error('❌ Panel system not available!');
            return;
        }
        
        const debugPanel = this.panelSystem.createPanel({
            id: 'debug-panel',
            position: { x: 6, y: 0, z: 0 },
            size: { width: 3, height: 4, depth: 0.1 },
            title: 'Debug Info',
            content: [
                { type: 'text', text: 'FPS: 60' },
                { type: 'text', text: 'Memory: 100MB' },
                { type: 'text', text: 'Layers: 8' },
                { type: 'button', text: 'Reset', color: 0xff4444, onClick: () => this.resetGame() },
                { type: 'button', text: 'Export Logs', color: 0x3b82f6, onClick: () => this.exportLogs() }
            ],
            closable: true
        });
        
        this.uiElements.set('debug-panel', debugPanel);
        console.log('🎮 Debug panel created');
    }
    
    createAmbientEffects() {
        // Check if we're using enhanced UI or basic systems
        if (this.enhancedUI) {
            console.log('🎮 Using enhanced UI - ambient effects handled by enhanced system');
            return;
        }
        
        if (!this.particleSystem) {
            console.error('❌ Particle system not available!');
            return;
        }
        
        // Create ambient particles
        const ambientEffectId = this.particleSystem.createAmbientParticles({
            particleCount: 50,
            color: 0x6a0dad,
            size: 0.02,
            area: { width: 30, height: 20, depth: 30 },
            speed: 0.05
        });
        
        this.uiElements.set('ambient-particles', { id: ambientEffectId, type: 'effect' });
        
        // Create magnetic field around buttons
        const magneticEffectId = this.particleSystem.createMagneticField(
            new THREE.Vector3(-6, 0.5, 0),
            3,
            {
                particleCount: 20,
                color: 0x8b5cf6,
                size: 0.03,
                speed: 0.3
            }
        );
        
        this.uiElements.set('magnetic-field', { id: magneticEffectId, type: 'effect' });
        
        console.log('🎮 Ambient effects created');
    }
    
    // Event handlers
    handleGPSButtonClick(button) {
        console.log('🎮 GPS button clicked');
        this.eventBus.emit('gps:request');
        
        // Create burst effect
        this.particleSystem.createBurstEffect(button.mesh.position, {
            particleCount: 30,
            color: 0x10b981,
            size: 0.1,
            speed: 1.5
        });
    }
    
    handleMenuButtonClick(button) {
        console.log('🎮 Menu button clicked');
        this.eventBus.emit('ui:menu:toggle');
        
        // Create burst effect
        this.particleSystem.createBurstEffect(button.mesh.position, {
            particleCount: 30,
            color: 0x3b82f6,
            size: 0.1,
            speed: 1.5
        });
    }
    
    handleSettingsButtonClick(button) {
        console.log('🎮 Settings button clicked');
        this.eventBus.emit('ui:settings:toggle');
        
        // Create burst effect
        this.particleSystem.createBurstEffect(button.mesh.position, {
            particleCount: 30,
            color: 0x8b5cf6,
            size: 0.1,
            speed: 1.5
        });
    }
    
    handleDebugButtonClick(button) {
        console.log('🎮 Debug button clicked');
        this.toggleDebugPanel();
        
        // Create burst effect
        this.particleSystem.createBurstEffect(button.mesh.position, {
            particleCount: 30,
            color: 0xf59e0b,
            size: 0.1,
            speed: 1.5
        });
    }
    
    toggleDebugPanel() {
        const debugPanel = this.uiElements.get('debug-panel');
        if (debugPanel) {
            if (debugPanel.group.visible) {
                this.panelSystem.hidePanel('debug-panel');
            } else {
                this.panelSystem.showPanel('debug-panel');
            }
        }
    }
    
    resetGame() {
        console.log('🎮 Resetting game...');
        this.eventBus.emit('game:reset');
        
        // Create explosion effect
        this.particleSystem.createBurstEffect(new THREE.Vector3(0, 0, 0), {
            particleCount: 100,
            color: 0xff4444,
            size: 0.2,
            speed: 3,
            spread: 2
        });
    }
    
    showPlayerCreationPanel(data) {
        console.log('🎮 Showing Three.js player creation panel...');
        
        // Check if we're using enhanced UI or basic systems
        if (this.enhancedUI) {
            console.log('🎮 Using enhanced UI - showing player creation in tab system');
            console.log('🎮 Enhanced UI ready:', this.enhancedUI.isInitialized);
            console.log('🎮 Magnetic tabs count:', this.enhancedUI.magneticTabs ? this.enhancedUI.magneticTabs.length : 'undefined');
            
            // Wait a bit for the UI to be fully ready
            setTimeout(() => {
                // Show the magnetic tabs first
                this.enhancedUI.showMagneticTabs();
                // Then switch to the settings tab which can handle player creation
                this.enhancedUI.switchTab('settings');
            }, 100);
            return;
        }
        
        if (!this.panelSystem) {
            console.error('❌ Panel system not available!');
            return;
        }
        
        // Create a floating panel for player creation
        const panel = this.panelSystem.createPanel({
            title: '🌟 Create Your Cosmic Identity',
            position: new THREE.Vector3(0, 0, 5),
            size: { width: 4, height: 3 },
            color: 0x1a1a2e
        });
        
        // Add player creation form elements
        this.createPlayerCreationForm(panel, data);
        
        // Animate panel in
        this.panelSystem.animatePanelIn(panel);
        
        console.log('🎮 Player creation panel created');
    }
    
    handlePlayerCreationComplete() {
        console.log('🎮 Player creation completed - closing settings tab');
        
        // Mark player as created
        this.playerCreated = true;
        
        // Close the settings tab by switching to it again (toggle behavior)
        if (this.enhancedUI && this.enhancedUI.switchTab) {
            this.enhancedUI.switchTab('settings'); // This will toggle it off since it's already active
        }
        
        // Also emit an event to start the game
        if (this.eventBus) {
            this.eventBus.emit('game:start');
        }
    }

    handleSettingsAction() {
        if (this.playerCreated) {
            console.log('🎮 Saving settings - closing settings tab');
            // Save settings logic here if needed
        } else {
            console.log('🎮 Creating player - closing settings tab');
            // Mark player as created
            this.playerCreated = true;
            
            // Emit game start event
            if (this.eventBus) {
                this.eventBus.emit('game:start');
            }
        }
        
        // Close the settings tab by switching to it again (toggle behavior)
        console.log('🎮 Attempting to close settings tab...');
        console.log('🎮 enhancedUI available:', !!this.enhancedUI);
        console.log('🎮 switchTab method available:', !!(this.enhancedUI && this.enhancedUI.switchTab));
        
        if (this.enhancedUI && this.enhancedUI.switchTab) {
            console.log('🎮 Calling switchTab("settings") to close tab');
            this.enhancedUI.switchTab('settings'); // This will toggle it off since it's already active
        } else {
            console.warn('🎮 Enhanced UI or switchTab method not available, using basic 2D UI method');
            // Use the basic 2D UI method to close the tab
            this.switchTab('settings'); // This will toggle it off since it's already active
        }
    }

    // Method to refresh settings content when tab is opened
    refreshSettingsContent() {
        if (this.enhancedUI && this.enhancedUI.updateTabContent) {
            this.enhancedUI.updateTabContent('settings', this.getTabContent('settings'));
        }
    }

    // Fallback method to hide all tabs
    hideAllTabs() {
        console.log('🎮 Hiding all tabs as fallback');
        
        // Try multiple approaches to hide the settings tab
        let hidden = false;
        
        // Method 1: Try enhanced UI if available
        if (this.enhancedUI && this.enhancedUI.hideAllPanels) {
            console.log('🎮 Using enhanced UI hideAllPanels');
            this.enhancedUI.hideAllPanels();
            this.enhancedUI.activeTab = null;
            hidden = true;
        }
        
        // Method 2: Try to find and hide the settings tab directly
        if (!hidden) {
            console.log('🎮 Trying to hide settings tab directly');
            
            // Look for settings tab content
            const settingsTab = document.querySelector('[data-tab="settings"]');
            const settingsContent = document.querySelector('.settings-tab-content');
            const tabContent = document.querySelector('.tab-content');
            const magneticTabs = document.querySelector('.magnetic-tabs');
            
            if (settingsTab) {
                console.log('🎮 Found settings tab, hiding it');
                settingsTab.style.display = 'none';
                settingsTab.classList.remove('active');
                hidden = true;
            }
            
            if (settingsContent) {
                console.log('🎮 Found settings content, hiding it');
                settingsContent.style.display = 'none';
                hidden = true;
            }
            
            if (tabContent) {
                console.log('🎮 Found tab content, hiding it');
                tabContent.style.display = 'none';
                hidden = true;
            }
            
            if (magneticTabs) {
                console.log('🎮 Found magnetic tabs, hiding them');
                magneticTabs.style.display = 'none';
                hidden = true;
            }
        }
        
        // Method 3: Try to hide any visible panels
        if (!hidden) {
            console.log('🎮 Trying to hide any visible panels');
            const panels = document.querySelectorAll('.panel, .tab-panel, .ui-panel');
            panels.forEach(panel => {
                if (panel.style.display !== 'none') {
                    console.log('🎮 Hiding panel:', panel.className);
                    panel.style.display = 'none';
                    hidden = true;
                }
            });
        }
        
        // Method 4: Reset active tab state
        this.activeTab = null;
        
        if (hidden) {
            console.log('🎮 Successfully hid tabs using fallback method');
        } else {
            console.warn('🎮 Could not hide tabs - no suitable elements found');
        }
    }
    
    createPlayerCreationForm(panel, data) {
        // Check if we're using enhanced UI or basic systems
        if (this.enhancedUI) {
            console.log('🎮 Using enhanced UI - player creation form handled by tab system');
            return;
        }
        
        if (!this.buttonSystem) {
            console.error('❌ Button system not available!');
            return;
        }
        
        // Create form elements as 3D text and buttons
        const formElements = [];
        
        // Player name input (simplified for 3D UI)
        const nameButton = this.buttonSystem.createButton({
            text: 'Enter Name: Cosmic Explorer',
            position: new THREE.Vector3(0, 0.5, 0),
            size: { width: 2, height: 0.3 },
            color: 0x3b82f6,
            onClick: () => this.handleNameInput()
        });
        formElements.push(nameButton);
        
        // Path color selection
        const colorButton = this.buttonSystem.createButton({
            text: 'Path Color: Blue',
            position: new THREE.Vector3(0, 0, 0),
            size: { width: 2, height: 0.3 },
            color: 0x10b981,
            onClick: () => this.handleColorSelection()
        });
        formElements.push(colorButton);
        
        // Base symbol selection
        const symbolButton = this.buttonSystem.createButton({
            text: 'Base Symbol: Finland Flag',
            position: new THREE.Vector3(0, -0.5, 0),
            size: { width: 2, height: 0.3 },
            color: 0x8b5cf6,
            onClick: () => this.handleSymbolSelection()
        });
        formElements.push(symbolButton);
        
        // Create adventure button
        const createButton = this.buttonSystem.createButton({
            text: '🚀 Begin Adventure',
            position: new THREE.Vector3(0, -1, 0),
            size: { width: 2.5, height: 0.4 },
            color: 0xff6b35,
            onClick: () => this.handleCreatePlayer(data)
        });
        formElements.push(createButton);
        
        // Store form elements
        panel.userData.formElements = formElements;
    }
    
    handleNameInput() {
        // For now, use a simple prompt (in a real implementation, this would be a 3D input)
        const name = prompt('Enter your cosmic explorer name:', 'Cosmic Explorer');
        if (name) {
            console.log('🎮 Player name set:', name);
            // Update button text
            // This is simplified - in a real implementation, you'd update the 3D text
        }
    }
    
    handleColorSelection() {
        const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const currentIndex = 0; // This would be tracked in real implementation
        const nextColor = colors[(currentIndex + 1) % colors.length];
        console.log('🎮 Path color selected:', nextColor);
    }
    
    handleSymbolSelection() {
        const symbols = ['flag_finland', 'flag_norway', 'flag_sweden', 'crystal', 'mountain'];
        const currentIndex = 0; // This would be tracked in real implementation
        const nextSymbol = symbols[(currentIndex + 1) % symbols.length];
        console.log('🎮 Base symbol selected:', nextSymbol);
    }
    
    handleCreatePlayer(data) {
        console.log('🎮 Creating player with Three.js UI...');
        
        // Create player data (simplified)
        const playerData = {
            name: 'Cosmic Explorer', // This would come from form
            pathColor: '#3b82f6',
            areaSymbol: 'circle',
            baseSymbol: 'flag_finland'
        };
        
        // Call the callback
        if (data.callback) {
            data.callback(playerData);
        }
        
        // Hide the panel
        this.panelSystem.animatePanelOut(panel, () => {
            console.log('🎮 Player creation panel closed');
        });
    }
    
    handleGameStart(data) {
        console.log('🎮 Handling game start with Three.js UI...');
        
        // Hide any open panels
        if (this.panelSystem) {
            this.panelSystem.hideAllPanels();
        }
        
        // Show game UI elements
        this.showGameUI();
        
        // If using enhanced UI, show the magnetic tabs
        if (this.enhancedUI) {
            console.log('🎮 Showing enhanced UI tabs');
            this.enhancedUI.showMagneticTabs();
        }
        
        // Create welcome effect
        if (this.particleSystem) {
            this.particleSystem.createBurstEffect(new THREE.Vector3(0, 0, 0), {
                particleCount: 50,
                color: 0x10b981,
                size: 0.1,
                speed: 2,
                spread: 1
            });
        }
        
        console.log('🎮 Game started with Three.js UI');
    }
    
    showGameUI() {
        console.log('🎮 Showing game UI elements...');
        
        // Create game control buttons
        this.createGameControlButtons();
        
        // Show HUD elements
        this.createHUD();
    }
    
    createGameControlButtons() {
        // GPS button
        const gpsButton = this.buttonSystem.createButton({
            text: '📍 GPS',
            position: new THREE.Vector3(-3, 2, 0),
            size: { width: 1, height: 0.5 },
            color: 0x10b981,
            onClick: () => this.handleGPSButtonClick(gpsButton)
        });
        
        // Menu button
        const menuButton = this.buttonSystem.createButton({
            text: '☰ Menu',
            position: new THREE.Vector3(3, 2, 0),
            size: { width: 1, height: 0.5 },
            color: 0x3b82f6,
            onClick: () => this.handleMenuButtonClick(menuButton)
        });
        
        // Settings button
        const settingsButton = this.buttonSystem.createButton({
            text: '⚙️ Settings',
            position: new THREE.Vector3(3, 1, 0),
            size: { width: 1, height: 0.5 },
            color: 0x8b5cf6,
            onClick: () => this.handleSettingsButtonClick(settingsButton)
        });
    }
    
    createHUD() {
        // Create HUD elements (simplified)
        console.log('🎮 HUD elements created');
    }
    
    exportLogs() {
        console.log('🎮 Exporting logs...');
        if (window.exportDebugLogs) {
            window.exportDebugLogs();
        }
    }
    
    doRender(deltaTime) {
        if (!this.isInitialized || !this.sceneManager) return;
        
        // Update Three.js scene
        this.sceneManager.animate();
        
        // Update UI elements
        this.updateUIElements(deltaTime);
    }
    
    updateUIElements(deltaTime) {
        // Update debug panel with real-time info
        const debugPanel = this.uiElements.get('debug-panel');
        if (debugPanel && debugPanel.group.visible) {
            // Update FPS, memory, etc.
            this.updateDebugInfo();
        }
    }
    
    updateDebugInfo() {
        // This would update the debug panel with real-time information
        // For now, just log that we're updating
        console.log('🎮 Updating debug info...');
    }
    
    setVisible(visible) {
        super.setVisible(visible);
        
        if (this.sceneManager) {
            this.sceneManager.renderer.domElement.style.display = visible ? 'block' : 'none';
        }
    }
    
    dispose() {
        if (this.sceneManager) {
            this.sceneManager.dispose();
        }
        
        if (this.buttonSystem) {
            this.buttonSystem.dispose();
        }
        
        if (this.panelSystem) {
            this.panelSystem.dispose();
        }
        
        if (this.particleSystem) {
            this.particleSystem.dispose();
        }
        
        this.uiElements.clear();
        this.isInitialized = false;
        
        console.log('🧹 ThreeJS UI Layer disposed');
    }
    
    // Refresh the current tab content
    refreshCurrentTab() {
        console.log('🔄 Refreshing current tab content...');
        if (this.enhancedUI && this.enhancedUI.currentTab) {
            const currentTab = this.enhancedUI.currentTab;
            const newContent = this.getTabContent(currentTab);
            
            // Find the content container and update it
            const contentContainer = document.querySelector('.tab-content');
            if (contentContainer) {
                contentContainer.innerHTML = newContent;
                console.log(`🔄 Refreshed ${currentTab} tab content`);
            } else {
                console.warn('⚠️ Content container not found, trying alternative selectors');
                // Try alternative selectors
                const altContainer = document.querySelector('[class*="content"]') || 
                                   document.querySelector('[class*="panel"]') ||
                                   document.querySelector('[class*="tab"]');
                if (altContainer) {
                    altContainer.innerHTML = newContent;
                    console.log('🔄 Refreshed using alternative selector');
                }
            }
        }
    }
    
    // Force refresh base management tab
    forceRefreshBaseTab() {
        console.log('🔄 Force refreshing base management tab...');
        const newContent = this.getTabContent('base');
        
        // Try multiple selectors to find the content area
        const selectors = [
            '.tab-content',
            '[class*="content"]',
            '[class*="panel"]',
            '[class*="tab"]',
            'div[style*="margin-bottom"]'
        ];
        
        for (const selector of selectors) {
            const container = document.querySelector(selector);
            if (container) {
                container.innerHTML = newContent;
                console.log(`🔄 Refreshed using selector: ${selector}`);
                return;
            }
        }
        
        console.warn('⚠️ Could not find content container to refresh');
    }
}

// Export for use in other modules
window.ThreeJSUILayer = ThreeJSUILayer;

} // End of duplicate check
