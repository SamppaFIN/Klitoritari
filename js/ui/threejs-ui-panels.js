/**
 * Three.js UI Panels System
 * Creates floating 3D UI panels with modern effects
 */

class ThreeJSUIPanels {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.panels = new Map();
        this.activePanel = null;
        
        // Panel settings
        this.panelMaterial = new THREE.MeshLambertMaterial({
            color: 0x1a1a2e,
            transparent: true,
            opacity: 0.95,
            side: THREE.DoubleSide
        });
        
        this.glowMaterial = new THREE.MeshBasicMaterial({
            color: 0x6a0dad,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide
        });
        
        console.log('🎨 ThreeJS UI Panels: Initialized');
    }
    
    createPanel(config) {
        const {
            id,
            position = { x: 0, y: 0, z: 0 },
            size = { width: 4, height: 3, depth: 0.1 },
            title = 'Panel',
            content = [],
            draggable = true,
            closable = true,
            animated = true
        } = config;
        
        // Create panel group
        const panelGroup = new THREE.Group();
        panelGroup.position.set(position.x, position.y, position.z);
        
        // Create panel background
        const panelGeometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const panelMesh = new THREE.Mesh(panelGeometry, this.panelMaterial);
        panelMesh.castShadow = true;
        panelMesh.receiveShadow = true;
        panelGroup.add(panelMesh);
        
        // Create glow effect
        const glowGeometry = new THREE.BoxGeometry(size.width * 1.05, size.height * 1.05, size.depth * 1.05);
        const glowMesh = new THREE.Mesh(glowGeometry, this.glowMaterial);
        glowMesh.position.z = -size.depth / 2 - 0.01;
        panelGroup.add(glowMesh);
        
        // Create title bar
        const titleBar = this.createTitleBar(title, size.width, 0.3);
        titleBar.position.set(0, size.height / 2 - 0.15, size.depth / 2 + 0.01);
        panelGroup.add(titleBar);
        
        // Create close button if closable
        if (closable) {
            const closeButton = this.createCloseButton();
            closeButton.position.set(size.width / 2 - 0.2, size.height / 2 - 0.15, size.depth / 2 + 0.01);
            closeButton.userData = {
                type: 'closeButton',
                panelId: id,
                onClick: () => this.closePanel(id)
            };
            panelGroup.add(closeButton);
        }
        
        // Create content elements
        content.forEach((item, index) => {
            const element = this.createContentElement(item, size.width - 0.4);
            element.position.set(
                0,
                size.height / 2 - 0.5 - (index * 0.4),
                size.depth / 2 + 0.01
            );
            panelGroup.add(element);
        });
        
        // Store panel data
        const panel = {
            id,
            group: panelGroup,
            originalPosition: { ...position },
            size,
            draggable,
            animated,
            isVisible: true,
            isDragging: false,
            dragOffset: new THREE.Vector3()
        };
        
        this.panels.set(id, panel);
        
        // Add to scene
        this.sceneManager.addUIElement(id, {
            object: panelGroup,
            interactive: true,
            update: (deltaTime) => this.updatePanel(panel, deltaTime)
        });
        
        // Animate in
        if (animated) {
            this.animatePanelIn(panel);
        }
        
        console.log('🎨 Panel created:', id);
        return panel;
    }
    
    createTitleBar(title, width, height) {
        const titleGroup = new THREE.Group();
        
        // Title background
        const titleGeometry = new THREE.PlaneGeometry(width, height);
        const titleMaterial = new THREE.MeshBasicMaterial({
            color: 0x6a0dad,
            transparent: true,
            opacity: 0.8
        });
        const titleBackground = new THREE.Mesh(titleGeometry, titleMaterial);
        titleGroup.add(titleBackground);
        
        // Title text
        const titleText = this.createTextMesh(title, height * 0.6);
        titleText.position.z = 0.01;
        titleGroup.add(titleText);
        
        return titleGroup;
    }
    
    createCloseButton() {
        const closeGroup = new THREE.Group();
        
        // Close button background
        const closeGeometry = new THREE.PlaneGeometry(0.3, 0.3);
        const closeMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            transparent: true,
            opacity: 0.8
        });
        const closeBackground = new THREE.Mesh(closeGeometry, closeMaterial);
        closeGroup.add(closeBackground);
        
        // Close button text
        const closeText = this.createTextMesh('×', 0.2);
        closeText.position.z = 0.01;
        closeGroup.add(closeText);
        
        return closeGroup;
    }
    
    createContentElement(item, width) {
        const elementGroup = new THREE.Group();
        
        switch (item.type) {
            case 'text':
                const textMesh = this.createTextMesh(item.text, 0.3);
                textMesh.position.z = 0.01;
                elementGroup.add(textMesh);
                break;
                
            case 'button':
                const buttonGeometry = new THREE.PlaneGeometry(width * 0.8, 0.4);
                const buttonMaterial = new THREE.MeshBasicMaterial({
                    color: item.color || 0x3b82f6,
                    transparent: true,
                    opacity: 0.8
                });
                const buttonMesh = new THREE.Mesh(buttonGeometry, buttonMaterial);
                elementGroup.add(buttonMesh);
                
                if (item.text) {
                    const buttonText = this.createTextMesh(item.text, 0.25);
                    buttonText.position.z = 0.01;
                    elementGroup.add(buttonText);
                }
                
                if (item.onClick) {
                    buttonMesh.userData = {
                        type: 'contentButton',
                        onClick: item.onClick
                    };
                }
                break;
                
            case 'slider':
                // Slider implementation
                const sliderGroup = this.createSlider(item);
                elementGroup.add(sliderGroup);
                break;
        }
        
        return elementGroup;
    }
    
    createSlider(config) {
        const sliderGroup = new THREE.Group();
        
        // Slider track
        const trackGeometry = new THREE.PlaneGeometry(config.width || 2, 0.1);
        const trackMaterial = new THREE.MeshBasicMaterial({
            color: 0x333333,
            transparent: true,
            opacity: 0.8
        });
        const track = new THREE.Mesh(trackGeometry, trackMaterial);
        sliderGroup.add(track);
        
        // Slider handle
        const handleGeometry = new THREE.PlaneGeometry(0.2, 0.2);
        const handleMaterial = new THREE.MeshBasicMaterial({
            color: 0x6a0dad,
            transparent: true,
            opacity: 0.9
        });
        const handle = new THREE.Mesh(handleGeometry, handleMaterial);
        handle.position.x = (config.value || 0.5) * (config.width || 2) - (config.width || 2) / 2;
        sliderGroup.add(handle);
        
        return sliderGroup;
    }
    
    createTextMesh(text, size) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        context.fillStyle = '#ffffff';
        context.font = `${size * 50}px Arial`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(text, 256, 64);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true
        });
        const geometry = new THREE.PlaneGeometry(2, 0.5);
        const mesh = new THREE.Mesh(geometry, material);
        
        return mesh;
    }
    
    updatePanel(panel, deltaTime) {
        if (!panel.isVisible) return;
        
        // Floating animation
        if (panel.animated) {
            panel.group.position.y += Math.sin(Date.now() * 0.001) * 0.001;
        }
        
        // Update content elements
        panel.group.children.forEach(child => {
            if (child.userData && child.userData.update) {
                child.userData.update(deltaTime);
            }
        });
    }
    
    animatePanelIn(panel) {
        // Check if GSAP is available
        if (typeof GSAP === 'undefined') {
            console.warn('⚠️ GSAP not available, using fallback animation');
            panel.group.scale.set(1, 1, 1);
            return;
        }
        
        // Scale animation
        panel.group.scale.set(0, 0, 0);
        GSAP.to(panel.group.scale, {
            x: 1,
            y: 1,
            z: 1,
            duration: 0.5,
            ease: "back.out(1.7)"
        });
        
        // Position animation
        const originalY = panel.group.position.y;
        panel.group.position.y += 2;
        GSAP.to(panel.group.position, {
            y: originalY,
            duration: 0.5,
            ease: "power2.out"
        });
    }
    
    animatePanelOut(panel, callback) {
        // Check if GSAP is available
        if (typeof GSAP === 'undefined') {
            console.warn('⚠️ GSAP not available, using fallback animation');
            panel.group.scale.set(0, 0, 0);
            if (callback) callback();
            return;
        }
        
        GSAP.to(panel.group.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: "back.in(1.7)",
            onComplete: callback
        });
    }
    
    showPanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            panel.isVisible = true;
            panel.group.visible = true;
            this.animatePanelIn(panel);
            console.log('🎨 Panel shown:', id);
        }
    }
    
    hidePanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            panel.isVisible = false;
            this.animatePanelOut(panel, () => {
                panel.group.visible = false;
            });
            console.log('🎨 Panel hidden:', id);
        }
    }
    
    closePanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            this.animatePanelOut(panel, () => {
                this.sceneManager.removeUIElement(id);
                this.panels.delete(id);
            });
            console.log('🎨 Panel closed:', id);
        }
    }
    
    removePanel(id) {
        const panel = this.panels.get(id);
        if (panel) {
            this.sceneManager.removeUIElement(id);
            this.panels.delete(id);
            console.log('🎨 Panel removed:', id);
        }
    }
    
    dispose() {
        this.panels.forEach(panel => {
            this.sceneManager.removeUIElement(panel.id);
        });
        this.panels.clear();
        console.log('🧹 ThreeJS UI Panels disposed');
    }
}

// Export for use in other modules
window.ThreeJSUIPanels = ThreeJSUIPanels;
