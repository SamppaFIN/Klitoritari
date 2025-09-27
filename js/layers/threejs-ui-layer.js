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
        
        console.log('🎮 ThreeJS UI Layer: Initialized');
    }
    
    init() {
        console.log('🎮 ThreeJS UI Layer: Initializing...');
        
        // Wait for Three.js to be available
        if (typeof THREE === 'undefined') {
            console.error('❌ Three.js not loaded!');
            return;
        }
        
        // Wait a bit for all scripts to load
        setTimeout(() => {
            // Check if all dependencies are loaded
            if (typeof THREE === 'undefined') {
                console.error('❌ Three.js not loaded!');
                return;
            }
            
            if (typeof GSAP === 'undefined') {
                console.warn('⚠️ GSAP not loaded, using fallback animations');
            }
            
            // Initialize Three.js systems
            this.initThreeJSSystems();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Create initial UI elements
            this.createInitialUI();
            
            this.isInitialized = true;
            console.log('🎮 ThreeJS UI Layer: Initialized successfully');
        }, 500);
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
    
    createPlayerCreationForm(panel, data) {
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
}

// Export for use in other modules
window.ThreeJSUILayer = ThreeJSUILayer;

} // End of duplicate check
