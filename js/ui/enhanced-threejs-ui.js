/**
 * Enhanced Three.js UI System
 * Mobile-friendly UI with magnetic bottom tablist and game header integration
 */

// Prevent duplicate class declaration
if (typeof window.EnhancedThreeJSUI !== 'undefined') {
    console.warn('⚠️ EnhancedThreeJSUI already exists, skipping duplicate declaration');
} else {

class EnhancedThreeJSUI {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        
        // UI Systems
        this.magneticTabs = [];
        this.activeTab = 'inventory';
        this.tabPanels = new Map();
        
        // Animation
        this.clock = new THREE.Clock();
        this.isAnimating = false;
        this.isInitialized = false;
        
        // Event handlers
        this.eventBus = null;
        
        console.log('🎮 Enhanced Three.js UI: Initialized');
    }
    
    init(container) {
        console.log('🎮 Enhanced Three.js UI: Initializing...');
        
        if (typeof THREE === 'undefined') {
            console.error('❌ Three.js not loaded!');
            return;
        }
        
        this.setupScene(container);
        this.setupCamera();
        this.setupRenderer(container);
        this.setupControls();
        this.setupLighting();
        this.createMagneticTabs();
        this.setupEventListeners();
        this.startAnimation();
        
        this.isInitialized = true;
        console.log('🎮 Enhanced Three.js UI: Initialized successfully');
    }
    
    setupScene(container) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0a0a);
        
        // Add fog for depth
        this.scene.fog = new THREE.Fog(0x0a0a0a, 10, 50);
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, 
            window.innerWidth / window.innerHeight, 
            0.1, 
            1000
        );
        // Position camera to look down at the magnetic tabs
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, -3, 0); // Look at the tabs at y: -3
    }
    
    setupRenderer(container) {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);
    }
    
    setupControls() {
        // Disable 3D controls to prevent flickering during map interactions
        console.log('🎮 Disabling 3D controls to prevent map interaction conflicts');
        this.controls = {
            update: () => {
                // No-op: controls disabled
            }
        };
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);
        
        // Point lights for UI elements
        const pointLight1 = new THREE.PointLight(0x0a84ff, 1, 20);
        pointLight1.position.set(-5, 2, 0);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x10b981, 1, 20);
        pointLight2.position.set(5, 2, 0);
        this.scene.add(pointLight2);
    }
    
    createMagneticTabs() {
        console.log('🎮 Creating magnetic tabs...');
        
        const tabData = [
            { id: 'inventory', label: 'Inventory', icon: '🎒', color: 0x3b82f6, position: new THREE.Vector3(-6, -3, 0) },
            { id: 'quests', label: 'Quests', icon: '📜', color: 0x10b981, position: new THREE.Vector3(-2, -3, 0) },
            { id: 'base', label: 'Base', icon: '🏠', color: 0xf59e0b, position: new THREE.Vector3(2, -3, 0) },
            { id: 'settings', label: 'Settings', icon: '⚙️', color: 0x8b5cf6, position: new THREE.Vector3(6, -3, 0) }
        ];
        
        tabData.forEach((tab, index) => {
            const magneticTab = this.createMagneticTab(tab, index);
            this.magneticTabs.push(magneticTab);
            this.scene.add(magneticTab.group);
        });
        
        console.log('🎮 Magnetic tabs created:', this.magneticTabs.length);
    }
    
    createMagneticTab(tabData, index) {
        const group = new THREE.Group();
        group.position.copy(tabData.position);
        group.userData = { 
            id: tabData.id, 
            label: tabData.label, 
            icon: tabData.icon,
            color: tabData.color,
            isActive: false,
            originalPosition: tabData.position.clone()
        };
        
        // Create card geometry
        const cardGeometry = new THREE.BoxGeometry(2.5, 1.2, 0.2);
        const cardMaterial = new THREE.MeshPhongMaterial({ 
            color: tabData.color,
            transparent: true,
            opacity: 0.9
        });
        const card = new THREE.Mesh(cardGeometry, cardMaterial);
        card.castShadow = true;
        card.receiveShadow = true;
        group.add(card);
        
        // Create icon (using text geometry for simplicity)
        const iconGeometry = new THREE.PlaneGeometry(0.8, 0.8);
        const iconMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.9
        });
        const icon = new THREE.Mesh(iconGeometry, iconMaterial);
        icon.position.set(0, 0.2, 0.11);
        group.add(icon);
        
        // Create label (using text geometry for simplicity)
        const labelGeometry = new THREE.PlaneGeometry(2, 0.3);
        const labelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        const label = new THREE.Mesh(labelGeometry, labelMaterial);
        label.position.set(0, -0.3, 0.11);
        group.add(label);
        
        // Add glow effect
        const glowGeometry = new THREE.BoxGeometry(2.7, 1.4, 0.1);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: tabData.color,
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(0, 0, -0.1);
        group.add(glow);
        
        // Add hover effect
        group.userData.hoverScale = 1.1;
        group.userData.normalScale = 1.0;
        group.userData.targetScale = 1.0;
        
        return { group, tabData };
    }
    
    setupEventListeners() {
        // Mouse/touch events for magnetic tabs
        this.renderer.domElement.addEventListener('mousemove', (event) => {
            this.handleMouseMove(event);
        });
        
        this.renderer.domElement.addEventListener('click', (event) => {
            this.handleClick(event);
        });
        
        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });
        
        // Header button events
        this.setupHeaderEvents();
    }
    
    setupHeaderEvents() {
        // Steps button
        const addStepsBtn = document.getElementById('add-steps-btn');
        if (addStepsBtn) {
            addStepsBtn.addEventListener('click', () => {
                this.addSteps(50);
            });
        }
        
        // Player name updates
        this.updatePlayerInfo();
    }
    
    handleMouseMove(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(
            this.magneticTabs.map(tab => tab.group)
        );
        
        // Reset all tabs
        this.magneticTabs.forEach(tab => {
            tab.group.userData.targetScale = 1.0;
            tab.group.userData.isHovered = false;
        });
        
        // Highlight hovered tab
        if (intersects.length > 0) {
            const hoveredTab = intersects[0].object.parent;
            hoveredTab.userData.targetScale = 1.1;
            hoveredTab.userData.isHovered = true;
        }
    }
    
    handleClick(event) {
        const mouse = new THREE.Vector2();
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        
        const intersects = raycaster.intersectObjects(
            this.magneticTabs.map(tab => tab.group)
        );
        
        if (intersects.length > 0) {
            const clickedTab = intersects[0].object.parent;
            this.switchTab(clickedTab.userData.id);
        }
    }
    
    switchTab(tabId) {
        console.log('🎮 Switching to tab:', tabId);
        
        // Check if the same tab is being clicked (toggle behavior)
        if (this.activeTab === tabId) {
            console.log('🎮 Toggling off active tab:', tabId);
            this.hideAllPanels();
            this.activeTab = null;
            
            // Reset all tabs to inactive state
            this.magneticTabs.forEach(tab => {
                tab.group.userData.isActive = false;
                tab.group.userData.targetScale = 1.0;
                
                const card = tab.group.children[0];
                if (card.material) {
                    card.material.color.setHex(tab.group.userData.color);
                }
            });
            
            // Emit event for tab closed
            if (this.eventBus) {
                this.eventBus.emit('ui:tab:closed', { tabId });
            }
            
            return;
        }
        
        // Update active tab
        this.magneticTabs.forEach(tab => {
            const isActive = tab.group.userData.id === tabId;
            tab.group.userData.isActive = isActive;
            tab.group.userData.targetScale = isActive ? 1.2 : 1.0;
            
            // Update material color based on active state
            const card = tab.group.children[0];
            if (card.material) {
                card.material.color.setHex(isActive ? 0xffffff : tab.group.userData.color);
            }
        });
        
        this.activeTab = tabId;
        
        // Emit event for other systems
        if (this.eventBus) {
            this.eventBus.emit('ui:tab:changed', { tabId });
        }
        
        // Show corresponding panel
        this.showTabPanel(tabId);
    }
    
    /**
     * Hide all tab panels
     */
    hideAllPanels() {
        console.log('🎮 Hiding all tab panels');
        this.tabPanels.forEach((panel, id) => {
            panel.visible = false;
        });
    }
    
    showTabPanel(tabId) {
        // Hide all panels
        this.tabPanels.forEach((panel, id) => {
            panel.visible = false;
        });
        
        // Show active panel
        if (this.tabPanels.has(tabId)) {
            this.tabPanels.get(tabId).visible = true;
        } else {
            this.createTabPanel(tabId);
        }
    }
    
    createTabPanel(tabId) {
        console.log('🎮 Creating panel for tab:', tabId);
        
        const panel = new THREE.Group();
        panel.position.set(0, 2, 0);
        
        // Create panel background
        const panelGeometry = new THREE.PlaneGeometry(8, 6);
        const panelMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x1a1a1a,
            transparent: true,
            opacity: 0.9
        });
        const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
        panel.add(panelMesh);
        
        // Add panel content based on tab type
        this.addPanelContent(panel, tabId);
        
        this.tabPanels.set(tabId, panel);
        this.scene.add(panel);
    }
    
    addPanelContent(panel, tabId) {
        const contentGeometry = new THREE.PlaneGeometry(7, 5);
        const contentMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const content = new THREE.Mesh(contentGeometry, contentMaterial);
        content.position.set(0, 0, 0.01);
        panel.add(content);
        
        // Add specific content based on tab
        switch (tabId) {
            case 'inventory':
                this.addInventoryContent(panel);
                break;
            case 'quests':
                this.addQuestsContent(panel);
                break;
            case 'base':
                this.addBaseContent(panel);
                break;
            case 'settings':
                this.addSettingsContent(panel);
                break;
        }
    }
    
    addInventoryContent(panel) {
        // Add inventory items as 3D objects
        const itemGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const itemMaterial = new THREE.MeshPhongMaterial({ color: 0x3b82f6 });
        
        for (let i = 0; i < 6; i++) {
            const item = new THREE.Mesh(itemGeometry, itemMaterial);
            item.position.set(
                (i % 3) * 1.5 - 1.5,
                Math.floor(i / 3) * 1.5 - 0.75,
                0.1
            );
            panel.add(item);
        }
    }
    
    addQuestsContent(panel) {
        // Add quest items
        const questGeometry = new THREE.PlaneGeometry(6, 0.8);
        const questMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981 });
        
        for (let i = 0; i < 4; i++) {
            const quest = new THREE.Mesh(questGeometry, questMaterial);
            quest.position.set(0, 1.5 - i * 1, 0.1);
            panel.add(quest);
        }
    }
    
    addBaseContent(panel) {
        // Add base management content
        const baseGeometry = new THREE.BoxGeometry(1, 1, 0.2);
        const baseMaterial = new THREE.MeshPhongMaterial({ color: 0xf59e0b });
        
        for (let i = 0; i < 4; i++) {
            const baseItem = new THREE.Mesh(baseGeometry, baseMaterial);
            baseItem.position.set(
                (i % 2) * 2 - 1,
                Math.floor(i / 2) * 2 - 1,
                0.1
            );
            panel.add(baseItem);
        }
    }
    
    addSettingsContent(panel) {
        // Add settings options
        const settingGeometry = new THREE.PlaneGeometry(6, 0.6);
        const settingMaterial = new THREE.MeshBasicMaterial({ color: 0x8b5cf6 });
        
        for (let i = 0; i < 6; i++) {
            const setting = new THREE.Mesh(settingGeometry, settingMaterial);
            setting.position.set(0, 2 - i * 0.8, 0.1);
            panel.add(setting);
        }
    }
    
    addSteps(amount) {
        const stepCountEl = document.getElementById('step-count');
        if (stepCountEl) {
            const currentSteps = parseInt(stepCountEl.textContent, 10);
            const newSteps = currentSteps + amount;
            stepCountEl.textContent = newSteps;
            
            // Add visual feedback
            this.createStepEffect();
            
            console.log('🎮 Steps added:', amount, 'Total:', newSteps);
        }
    }
    
    createStepEffect() {
        // Create particle effect for step addition
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 20;
        const positions = new Float32Array(particleCount * 3);
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 4;
            positions[i * 3 + 1] = Math.random() * 2;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
        }
        
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        
        const particleMaterial = new THREE.PointsMaterial({
            color: 0x0a84ff,
            size: 0.1,
            transparent: true,
            opacity: 0.8
        });
        
        const particles = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(particles);
        
        // Animate particles
        const animateParticles = () => {
            particles.rotation.y += 0.01;
            particles.position.y += 0.02;
            
            if (particles.position.y > 10) {
                this.scene.remove(particles);
            } else {
                requestAnimationFrame(animateParticles);
            }
        };
        animateParticles();
    }
    
    updatePlayerInfo() {
        const playerNameEl = document.getElementById('player-name');
        if (playerNameEl) {
            const savedName = localStorage.getItem('eldritch_player_name');
            if (savedName) {
                playerNameEl.textContent = savedName;
            }
        }
    }
    
    updateHealth(current, max) {
        const healthProgress = document.getElementById('health-progress');
        const healthCount = document.getElementById('health-count');
        if (healthProgress && healthCount) {
            healthProgress.value = current;
            healthProgress.max = max;
            healthCount.textContent = `${current}/${max}`;
        }
    }
    
    updateSanity(current, max) {
        const sanityProgress = document.getElementById('sanity-progress');
        const sanityCount = document.getElementById('sanity-count');
        if (sanityProgress && sanityCount) {
            sanityProgress.value = current;
            sanityProgress.max = max;
            sanityCount.textContent = `${current}/${max}`;
        }
    }
    
    handleResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    startAnimation() {
        this.isAnimating = true;
        this.animate();
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        // Update controls
        if (this.controls && this.controls.update) {
            this.controls.update();
        }
        
        // Animate magnetic tabs
        this.magneticTabs.forEach(tab => {
            const targetScale = tab.group.userData.targetScale;
            const currentScale = tab.group.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
            
            tab.group.scale.setScalar(newScale);
            
            // Add subtle floating animation
            tab.group.position.y = tab.group.userData.originalPosition.y + Math.sin(Date.now() * 0.001 + tab.group.userData.id.length) * 0.1;
        });
        
        // Render
        this.renderer.render(this.scene, this.camera);
    }
    
    setEventBus(eventBus) {
        this.eventBus = eventBus;
    }
    
    /**
     * Show magnetic tabs (called when game starts)
     */
    showMagneticTabs() {
        console.log('🎮 Showing magnetic tabs...');
        console.log('🎮 UI initialized:', this.isInitialized);
        console.log('🎮 Number of magnetic tabs:', this.magneticTabs.length);
        console.log('🎮 Scene children count:', this.scene ? this.scene.children.length : 'no scene');
        console.log('🎮 Camera position:', this.camera ? this.camera.position : 'no camera');
        
        if (!this.isInitialized) {
            console.warn('⚠️ Enhanced UI not fully initialized yet, waiting...');
            setTimeout(() => this.showMagneticTabs(), 100);
            return;
        }
        
        // Make sure tabs are visible
        this.magneticTabs.forEach((tab, index) => {
            if (tab.group) {
                tab.group.visible = true;
                console.log(`🎮 Tab ${index} (${tab.group.userData.id}): visible=${tab.group.visible}, position=`, tab.group.position);
            }
        });
        
        // Animate tabs in
        this.animateTabsIn();
        
        console.log('🎮 Magnetic tabs shown');
    }
    
    /**
     * Animate tabs sliding in from bottom
     */
    animateTabsIn() {
        if (typeof GSAP !== 'undefined') {
            this.magneticTabs.forEach((tab, index) => {
                if (tab.mesh) {
                    // Start from below screen
                    tab.mesh.position.y = -2;
                    tab.mesh.visible = true;
                    
                    // Animate to final position
                    GSAP.to(tab.mesh.position, {
                        y: tab.originalY,
                        duration: 0.8,
                        delay: index * 0.1,
                        ease: "back.out(1.7)"
                    });
                }
            });
        } else {
            // Fallback without GSAP
            this.magneticTabs.forEach((tab, index) => {
                if (tab.mesh) {
                    tab.mesh.position.y = tab.originalY;
                    tab.mesh.visible = true;
                }
            });
        }
    }
    
    destroy() {
        this.isAnimating = false;
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

// Export for use in other modules
window.EnhancedThreeJSUI = EnhancedThreeJSUI;

} // End of duplicate check
