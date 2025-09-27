/**
 * Three.js Scene Manager
 * Handles 3D scene setup, lighting, camera, and mobile optimization
 */

class ThreeJSSceneManager {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.clock = new THREE.Clock();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.touch = new THREE.Vector2();
        
        // Mobile optimization
        this.isMobile = this.detectMobile();
        this.pixelRatio = Math.min(window.devicePixelRatio, 2);
        this.performanceMode = this.isMobile ? 'low' : 'high';
        
        // UI elements
        this.uiElements = new Map();
        this.interactiveObjects = [];
        
        // Animation
        this.animationId = null;
        this.isAnimating = false;
        
        console.log('🎮 ThreeJS Scene Manager: Initializing...');
        console.log('📱 Mobile detected:', this.isMobile);
        console.log('⚡ Performance mode:', this.performanceMode);
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth < 768;
    }
    
    init(container) {
        console.log('🎮 ThreeJS Scene Manager: Setting up scene...');
        
        try {
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0a0a0a);
            
            // Setup camera
            this.setupCamera();
            
            // Setup renderer
            this.setupRenderer(container);
            
            // Setup lighting
            this.setupLighting();
            
            // Setup controls
            this.setupControls();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.startAnimation();
            
            console.log('🎮 ThreeJS Scene Manager: Scene initialized successfully');
        } catch (error) {
            console.error('❌ ThreeJS Scene Manager: Initialization failed:', error);
            throw error;
        }
    }
    
    setupCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        const fov = this.isMobile ? 75 : 60;
        const near = 0.1;
        const far = 1000;
        
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        console.log('📷 Camera setup:', { fov, aspect, position: this.camera.position });
    }
    
    setupRenderer(container) {
        this.renderer = new THREE.WebGLRenderer({
            antialias: !this.isMobile,
            alpha: true,
            powerPreference: this.isMobile ? 'low-power' : 'high-performance'
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(this.pixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        
        // Mobile optimizations
        if (this.isMobile) {
            this.renderer.physicallyCorrectLights = false;
            this.renderer.sortObjects = false;
        }
        
        container.appendChild(this.renderer.domElement);
        
        console.log('🎨 Renderer setup:', {
            size: `${window.innerWidth}x${window.innerHeight}`,
            pixelRatio: this.pixelRatio,
            antialias: !this.isMobile
        });
    }
    
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Directional light
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = this.isMobile ? 1024 : 2048;
        directionalLight.shadow.mapSize.height = this.isMobile ? 1024 : 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -10;
        directionalLight.shadow.camera.right = 10;
        directionalLight.shadow.camera.top = 10;
        directionalLight.shadow.camera.bottom = -10;
        this.scene.add(directionalLight);
        
        // Point light for UI elements
        const pointLight = new THREE.PointLight(0x6a0dad, 1, 20);
        pointLight.position.set(0, 5, 0);
        this.scene.add(pointLight);
        
        console.log('💡 Lighting setup complete');
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
    
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', this.onWindowResize.bind(this));
        
        // Mouse events
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.renderer.domElement.addEventListener('click', this.onMouseClick.bind(this));
        
        // Touch events
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove.bind(this));
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd.bind(this));
        
        console.log('👂 Event listeners setup complete');
    }
    
    onWindowResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        console.log('📐 Window resized:', `${width}x${height}`);
    }
    
    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    onMouseClick(event) {
        this.handleInteraction(event.clientX, event.clientY);
    }
    
    onTouchStart(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.touch.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.touch.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchMove(event) {
        event.preventDefault();
        if (event.touches.length === 1) {
            this.touch.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.touch.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    onTouchEnd(event) {
        event.preventDefault();
        if (event.touches.length === 0) {
            this.handleInteraction(this.touch.x, this.touch.y);
        }
    }
    
    handleInteraction(x, y) {
        this.raycaster.setFromCamera({ x, y }, this.camera);
        const intersects = this.raycaster.intersectObjects(this.interactiveObjects);
        
        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (object.userData.onClick) {
                object.userData.onClick(object);
            }
        }
    }
    
    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.animate();
        
        console.log('🎬 Animation loop started');
    }
    
    stopAnimation() {
        this.isAnimating = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        console.log('⏹️ Animation loop stopped');
    }
    
    animate() {
        if (!this.isAnimating) return;
        
        this.animationId = requestAnimationFrame(this.animate.bind(this));
        
        const deltaTime = this.clock.getDelta();
        
        // Update controls
        if (this.controls && this.controls.update) {
            this.controls.update();
        }
        
        // Update UI elements
        this.updateUIElements(deltaTime);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    updateUIElements(deltaTime) {
        this.uiElements.forEach(element => {
            if (element.update) {
                element.update(deltaTime);
            }
        });
    }
    
    addUIElement(id, element) {
        this.uiElements.set(id, element);
        this.scene.add(element.object);
        
        if (element.interactive) {
            this.interactiveObjects.push(element.object);
        }
        
        console.log('➕ UI Element added:', id);
    }
    
    removeUIElement(id) {
        const element = this.uiElements.get(id);
        if (element) {
            this.scene.remove(element.object);
            this.uiElements.delete(id);
            
            const index = this.interactiveObjects.indexOf(element.object);
            if (index > -1) {
                this.interactiveObjects.splice(index, 1);
            }
            
            console.log('➖ UI Element removed:', id);
        }
    }
    
    dispose() {
        this.stopAnimation();
        
        // Dispose of renderer
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        // Dispose of controls
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Clear UI elements
        this.uiElements.clear();
        this.interactiveObjects = [];
        
        console.log('🧹 ThreeJS Scene Manager disposed');
    }
}

// Export for use in other modules
window.ThreeJSSceneManager = ThreeJSSceneManager;
