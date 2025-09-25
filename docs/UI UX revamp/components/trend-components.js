/**
 * 🌟 Trend Components
 * Cutting-edge UI components showcasing 2025 trends and advanced techniques
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🎨 3D Canvas Component
 */
class ThreeDCanvasComponent extends BaseComponent {
    constructor() {
        super('3D Canvas', 'Three.js integration with WebGL effects', 'trend');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'canvas-3d-container';
        
        const label = document.createElement('label');
        label.textContent = '3D Interactive Canvas';
        label.className = 'canvas-label';
        
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = 'vanilla-canvas-wrapper';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'vanilla-3d-canvas';
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'canvas-controls';
        controls.innerHTML = `
            <button class="control-btn" data-action="rotate">🔄 Rotate</button>
            <button class="control-btn" data-action="scale">📏 Scale</button>
            <button class="control-btn" data-action="color">🎨 Color</button>
        `;
        
        canvasWrapper.appendChild(canvas);
        container.appendChild(label);
        container.appendChild(canvasWrapper);
        container.appendChild(controls);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'canvas-3d-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} 3D Canvas`;
        label.className = 'canvas-label';
        
        const canvasWrapper = document.createElement('div');
        canvasWrapper.className = `library-canvas-wrapper ${libraryId}-canvas-wrapper`;
        
        const canvas = document.createElement('canvas');
        canvas.className = `library-3d-canvas ${libraryId}-3d-canvas`;
        canvas.width = 400;
        canvas.height = 300;
        
        // Create library-specific controls based on framework capabilities
        const controls = this.createLibraryControls(libraryId);
        
        canvasWrapper.appendChild(canvas);
        container.appendChild(label);
        container.appendChild(canvasWrapper);
        container.appendChild(controls);
        
        return container;
    }
    
    createLibraryControls(libraryId) {
        const controls = document.createElement('div');
        controls.className = 'canvas-controls';
        
        switch(libraryId) {
            case 'react':
                controls.innerHTML = `
                    <div class="react-controls">
                        <h4>React Features</h4>
                        <button class="control-btn react-btn" data-action="component-mount">⚛️ Mount</button>
                        <button class="control-btn react-btn" data-action="state-update">🔄 State</button>
                        <button class="control-btn react-btn" data-action="lifecycle">♻️ Lifecycle</button>
                        <button class="control-btn react-btn" data-action="hooks">🎣 Hooks</button>
                    </div>
                `;
                break;
            case 'vue':
                controls.innerHTML = `
                    <div class="vue-controls">
                        <h4>Vue Features</h4>
                        <button class="control-btn vue-btn" data-action="reactive">⚡ Reactive</button>
                        <button class="control-btn vue-btn" data-action="computed">🧮 Computed</button>
                        <button class="control-btn vue-btn" data-action="watchers">👀 Watchers</button>
                        <button class="control-btn vue-btn" data-action="directives">📋 Directives</button>
                    </div>
                `;
                break;
            case 'angular':
                controls.innerHTML = `
                    <div class="angular-controls">
                        <h4>Angular Features</h4>
                        <button class="control-btn angular-btn" data-action="dependency">💉 DI</button>
                        <button class="control-btn angular-btn" data-action="change-detection">🔍 Change Detection</button>
                        <button class="control-btn angular-btn" data-action="pipes">🔧 Pipes</button>
                        <button class="control-btn angular-btn" data-action="services">🛠️ Services</button>
                    </div>
                `;
                break;
            case 'svelte':
                controls.innerHTML = `
                    <div class="svelte-controls">
                        <h4>Svelte Features</h4>
                        <button class="control-btn svelte-btn" data-action="compile">⚡ Compile</button>
                        <button class="control-btn svelte-btn" data-action="stores">🏪 Stores</button>
                        <button class="control-btn svelte-btn" data-action="transitions">✨ Transitions</button>
                        <button class="control-btn svelte-btn" data-action="actions">🎯 Actions</button>
                    </div>
                `;
                break;
            case 'lit':
                controls.innerHTML = `
                    <div class="lit-controls">
                        <h4>Lit Features</h4>
                        <button class="control-btn lit-btn" data-action="web-components">🧩 Web Components</button>
                        <button class="control-btn lit-btn" data-action="properties">📝 Properties</button>
                        <button class="control-btn lit-btn" data-action="lifecycle">♻️ Lifecycle</button>
                        <button class="control-btn lit-btn" data-action="templates">📄 Templates</button>
                    </div>
                `;
                break;
            default:
                controls.innerHTML = `
                    <div class="generic-controls">
                        <h4>Framework Features</h4>
                        <button class="control-btn generic-btn" data-action="framework-specific">🔧 Framework</button>
                        <button class="control-btn generic-btn" data-action="optimized">⚡ Optimized</button>
                        <button class="control-btn generic-btn" data-action="ecosystem">🌐 Ecosystem</button>
                    </div>
                `;
        }
        
        return controls;
    }
    
    setupVanillaEventListeners(element) {
        const canvas = element.querySelector('.vanilla-3d-canvas');
        const controls = element.querySelectorAll('.control-btn');
        
        // Initialize 3D scene
        this.init3DScene(canvas);
        
        // Control handlers
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handle3DControl(e.target.dataset.action, canvas);
            });
        });
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, canvas);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleCanvasClick(e, canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const canvas = element.querySelector('.library-3d-canvas');
        const controls = element.querySelectorAll('.control-btn');
        
        // Initialize 3D scene with library-specific features
        this.initLibrary3DScene(canvas, libraryId);
        
        // Control handlers for framework-specific features
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleLibraryControl(e.target.dataset.action, canvas, libraryId);
            });
        });
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            this.handleLibraryMouseMove(e, canvas, libraryId);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleLibraryCanvasClick(e, canvas, libraryId);
        });
    }
    
    init3DScene(canvas) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Store canvas reference for animations
        canvas.animationData = {
            rotation: 0,
            scale: 1,
            color: 0,
            mouseX: 0,
            mouseY: 0,
            particles: []
        };
        
        // Create initial particles
        for (let i = 0; i < 20; i++) {
            canvas.animationData.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                hue: Math.random() * 360
            });
        }
        
        this.animate3D(canvas);
    }
    
    animate3D(canvas) {
        const ctx = canvas.getContext('2d');
        const data = canvas.animationData;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update particles
        data.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
            
            // Draw particle
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(data.rotation);
            ctx.scale(data.scale, data.scale);
            
            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, particle.size);
            gradient.addColorStop(0, `hsl(${particle.hue + data.color}, 70%, 60%)`);
            gradient.addColorStop(1, `hsl(${particle.hue + data.color}, 70%, 20%)`);
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
        
        // Draw central shape
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(data.rotation);
        ctx.scale(data.scale, data.scale);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 50);
        gradient.addColorStop(0, `hsl(${120 + data.color}, 80%, 70%)`);
        gradient.addColorStop(1, `hsl(${120 + data.color}, 80%, 30%)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = `hsl(${120 + data.color}, 80%, 50%)`;
        ctx.shadowBlur = 20;
        ctx.strokeStyle = `hsl(${120 + data.color}, 80%, 60%)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        
        // Update rotation
        data.rotation += 0.02;
        
        requestAnimationFrame(() => this.animate3D(canvas));
    }
    
    handle3DControl(action, canvas) {
        const data = canvas.animationData;
        
        switch(action) {
            case 'rotate':
                data.rotation += Math.PI / 4;
                break;
            case 'scale':
                data.scale = data.scale > 1 ? 0.5 : 1.5;
                break;
            case 'color':
                data.color = (data.color + 60) % 360;
                break;
        }
    }
    
    handleMouseMove(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const data = canvas.animationData;
        data.mouseX = e.clientX - rect.left;
        data.mouseY = e.clientY - rect.top;
        
        // Update particle velocities based on mouse position
        data.particles.forEach(particle => {
            const dx = data.mouseX - particle.x;
            const dy = data.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                particle.vx += dx * 0.001;
                particle.vy += dy * 0.001;
            }
        });
    }
    
    handleCanvasClick(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Add new particle at click location
        canvas.animationData.particles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 0.5) * 4,
            size: Math.random() * 4 + 2,
            hue: Math.random() * 360
        });
        
        // Limit particle count
        if (canvas.animationData.particles.length > 50) {
            canvas.animationData.particles.shift();
        }
    }
    
    // Library-specific methods
    initLibrary3DScene(canvas, libraryId) {
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        // Initialize with library-specific data
        canvas.animationData = {
            particles: [],
            time: 0,
            libraryId: libraryId,
            frameworkFeatures: this.getFrameworkFeatures(libraryId)
        };
        
        // Add library-specific visual elements
        this.addLibraryVisualElements(canvas, libraryId);
        
        // Start animation with framework-specific behavior
        this.animateLibraryScene(canvas);
    }
    
    getFrameworkFeatures(libraryId) {
        const features = {
            'react': {
                color: '#61dafb',
                pattern: 'component-based',
                particles: 15,
                speed: 1.2
            },
            'vue': {
                color: '#4fc08d',
                pattern: 'reactive',
                particles: 20,
                speed: 1.0
            },
            'angular': {
                color: '#dd0031',
                pattern: 'enterprise',
                particles: 12,
                speed: 0.8
            },
            'svelte': {
                color: '#ff3e00',
                pattern: 'compiled',
                particles: 25,
                speed: 1.5
            },
            'lit': {
                color: '#324fff',
                pattern: 'web-components',
                particles: 18,
                speed: 1.1
            }
        };
        
        return features[libraryId] || {
            color: '#4a9eff',
            pattern: 'generic',
            particles: 10,
            speed: 1.0
        };
    }
    
    addLibraryVisualElements(canvas, libraryId) {
        const features = canvas.animationData.frameworkFeatures;
        
        // Add framework-specific particles
        for (let i = 0; i < features.particles; i++) {
            canvas.animationData.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2 * features.speed,
                vy: (Math.random() - 0.5) * 2 * features.speed,
                life: Math.random(),
                color: features.color,
                size: Math.random() * 3 + 1,
                framework: libraryId
            });
        }
    }
    
    animateLibraryScene(canvas) {
        const ctx = canvas.getContext('2d');
        const data = canvas.animationData;
        
        // Clear canvas
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles with framework-specific behavior
        data.particles.forEach((particle, index) => {
            // Framework-specific movement patterns
            this.updateFrameworkParticle(particle, data.libraryId);
            
            // Draw particle
            ctx.save();
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            
            // Remove dead particles
            if (particle.life <= 0) {
                data.particles.splice(index, 1);
            }
        });
        
        data.time += 0.016;
        requestAnimationFrame(() => this.animateLibraryScene(canvas));
    }
    
    updateFrameworkParticle(particle, libraryId) {
        switch(libraryId) {
            case 'react':
                // React: Component-like behavior with state updates
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 0.005;
                if (Math.random() < 0.01) {
                    particle.vx = (Math.random() - 0.5) * 4;
                    particle.vy = (Math.random() - 0.5) * 4;
                }
                break;
            case 'vue':
                // Vue: Reactive behavior with smooth transitions
                particle.x += particle.vx * 0.8;
                particle.y += particle.vy * 0.8;
                particle.life -= 0.003;
                particle.vx *= 0.999;
                particle.vy *= 0.999;
                break;
            case 'angular':
                // Angular: Enterprise patterns with dependency injection
                particle.x += particle.vx * 0.6;
                particle.y += particle.vy * 0.6;
                particle.life -= 0.004;
                if (particle.life < 0.5) {
                    particle.size *= 1.01;
                }
                break;
            case 'svelte':
                // Svelte: Compiled optimization with fast updates
                particle.x += particle.vx * 1.2;
                particle.y += particle.vy * 1.2;
                particle.life -= 0.006;
                particle.size = Math.sin(particle.life * Math.PI) * 3 + 1;
                break;
            case 'lit':
                // Lit: Web component behavior
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 0.004;
                if (particle.life > 0.8) {
                    particle.color = `hsl(${(particle.life * 360) % 360}, 70%, 60%)`;
                }
                break;
            default:
                // Generic framework behavior
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.life -= 0.005;
        }
        
        // Boundary checking
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    }
    
    handleLibraryControl(action, canvas, libraryId) {
        switch(action) {
            case 'component-mount':
                this.simulateReactMount(canvas);
                break;
            case 'state-update':
                this.simulateReactStateUpdate(canvas);
                break;
            case 'lifecycle':
                this.simulateReactLifecycle(canvas);
                break;
            case 'hooks':
                this.simulateReactHooks(canvas);
                break;
            case 'reactive':
                this.simulateVueReactivity(canvas);
                break;
            case 'computed':
                this.simulateVueComputed(canvas);
                break;
            case 'watchers':
                this.simulateVueWatchers(canvas);
                break;
            case 'directives':
                this.simulateVueDirectives(canvas);
                break;
            case 'dependency':
                this.simulateAngularDI(canvas);
                break;
            case 'change-detection':
                this.simulateAngularChangeDetection(canvas);
                break;
            case 'pipes':
                this.simulateAngularPipes(canvas);
                break;
            case 'services':
                this.simulateAngularServices(canvas);
                break;
            case 'compile':
                this.simulateSvelteCompile(canvas);
                break;
            case 'stores':
                this.simulateSvelteStores(canvas);
                break;
            case 'transitions':
                this.simulateSvelteTransitions(canvas);
                break;
            case 'actions':
                this.simulateSvelteActions(canvas);
                break;
            case 'web-components':
                this.simulateLitWebComponents(canvas);
                break;
            case 'properties':
                this.simulateLitProperties(canvas);
                break;
            case 'lifecycle':
                this.simulateLitLifecycle(canvas);
                break;
            case 'templates':
                this.simulateLitTemplates(canvas);
                break;
            default:
                this.simulateGenericFramework(canvas, action);
        }
    }
    
    // Framework simulation methods
    simulateReactMount(canvas) {
        const data = canvas.animationData;
        data.particles.forEach(particle => {
            particle.life = 1.0;
            particle.size = 2;
        });
        console.log('⚛️ React: Component mounted!');
    }
    
    simulateReactStateUpdate(canvas) {
        const data = canvas.animationData;
        data.particles.forEach(particle => {
            particle.vx *= 1.5;
            particle.vy *= 1.5;
        });
        console.log('🔄 React: State updated!');
    }
    
    simulateVueReactivity(canvas) {
        const data = canvas.animationData;
        data.particles.forEach(particle => {
            particle.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
        });
        console.log('⚡ Vue: Reactive data changed!');
    }
    
    simulateSvelteCompile(canvas) {
        const data = canvas.animationData;
        data.particles.forEach(particle => {
            particle.vx *= 2;
            particle.vy *= 2;
        });
        console.log('⚡ Svelte: Code compiled and optimized!');
    }
    
    simulateAngularDI(canvas) {
        const data = canvas.animationData;
        for (let i = 0; i < 5; i++) {
            data.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 1.0,
                color: '#dd0031',
                size: 2,
                framework: 'angular'
            });
        }
        console.log('💉 Angular: Dependencies injected!');
    }
    
    simulateLitWebComponents(canvas) {
        const data = canvas.animationData;
        data.particles.forEach(particle => {
            particle.size = 4;
            particle.color = '#324fff';
        });
        console.log('🧩 Lit: Web component created!');
    }
    
    // Add more simulation methods for other frameworks...
    simulateReactLifecycle(canvas) { console.log('♻️ React: Lifecycle method called!'); }
    simulateReactHooks(canvas) { console.log('🎣 React: Hooks executed!'); }
    simulateVueComputed(canvas) { console.log('🧮 Vue: Computed property updated!'); }
    simulateVueWatchers(canvas) { console.log('👀 Vue: Watcher triggered!'); }
    simulateVueDirectives(canvas) { console.log('📋 Vue: Directive applied!'); }
    simulateAngularChangeDetection(canvas) { console.log('🔍 Angular: Change detection ran!'); }
    simulateAngularPipes(canvas) { console.log('🔧 Angular: Pipe transformed data!'); }
    simulateAngularServices(canvas) { console.log('🛠️ Angular: Service called!'); }
    simulateSvelteStores(canvas) { console.log('🏪 Svelte: Store updated!'); }
    simulateSvelteTransitions(canvas) { console.log('✨ Svelte: Transition applied!'); }
    simulateSvelteActions(canvas) { console.log('🎯 Svelte: Action executed!'); }
    simulateLitProperties(canvas) { console.log('📝 Lit: Properties updated!'); }
    simulateLitLifecycle(canvas) { console.log('♻️ Lit: Lifecycle method called!'); }
    simulateLitTemplates(canvas) { console.log('📄 Lit: Template rendered!'); }
    simulateGenericFramework(canvas, action) { console.log(`🔧 Framework: ${action} executed!`); }
    
    handleLibraryMouseMove(e, canvas, libraryId) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (Math.random() < 0.1) {
            const features = canvas.animationData.frameworkFeatures;
            canvas.animationData.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                life: 0.5,
                color: features.color,
                size: 1,
                framework: libraryId
            });
        }
    }
    
    handleLibraryCanvasClick(e, canvas, libraryId) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const features = canvas.animationData.frameworkFeatures;
        for (let i = 0; i < 3; i++) {
            canvas.animationData.particles.push({
                x: x + (Math.random() - 0.5) * 20,
                y: y + (Math.random() - 0.5) * 20,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                life: 1.0,
                color: features.color,
                size: 3,
                framework: libraryId
            });
        }
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('3d-canvas', `
            .canvas-3d-container {
                margin: 1rem 0;
            }
            
            .canvas-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-canvas-wrapper {
                position: relative;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                overflow: hidden;
                background: var(--cosmic-dark);
            }
            
            .vanilla-3d-canvas {
                display: block;
                width: 100%;
                height: 300px;
                cursor: crosshair;
            }
            
            .canvas-controls {
                display: flex;
                gap: 0.5rem;
                margin-top: 1rem;
                justify-content: center;
            }
            
            .control-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .control-btn:hover {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            /* Framework-specific control styles */
            .react-controls h4,
            .vue-controls h4,
            .angular-controls h4,
            .svelte-controls h4,
            .lit-controls h4,
            .generic-controls h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-size: 0.9rem;
                margin: 0 0 0.5rem 0;
                text-align: center;
            }
            
            .react-btn {
                background: #61dafb !important;
                color: #000 !important;
            }
            
            .vue-btn {
                background: #4fc08d !important;
                color: white !important;
            }
            
            .angular-btn {
                background: #dd0031 !important;
                color: white !important;
            }
            
            .svelte-btn {
                background: #ff3e00 !important;
                color: white !important;
            }
            
            .lit-btn {
                background: #324fff !important;
                color: white !important;
            }
            
            .generic-btn {
                background: var(--cosmic-neutral) !important;
                color: var(--cosmic-light) !important;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('3d-canvas-library', `
            .library-canvas-wrapper {
                position: relative;
                border: 2px solid var(--cosmic-neutral);
                border-radius: 8px;
                overflow: hidden;
                background: var(--cosmic-dark);
            }
            
            .library-3d-canvas {
                display: block;
                width: 100%;
                height: 300px;
                cursor: crosshair;
            }
        `);
    }
}

/**
 * 🎵 Audio Player Component
 */
class AudioPlayerComponent extends BaseComponent {
    constructor() {
        super('Audio Player', 'Custom audio playback interface', 'trend');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'audio-player-container';
        
        const label = document.createElement('label');
        label.textContent = 'Audio Player';
        label.className = 'audio-label';
        
        const player = document.createElement('div');
        player.className = 'vanilla-audio-player';
        
        const audio = document.createElement('audio');
        audio.className = 'audio-element';
        audio.controls = false;
        
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <button class="play-pause-btn" data-playing="false">▶️</button>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="time-display">
                    <span class="current-time">0:00</span>
                    <span class="duration">0:00</span>
                </div>
            </div>
            <div class="volume-container">
                <span class="volume-icon">🔊</span>
                <input type="range" class="volume-slider" min="0" max="100" value="50">
            </div>
        `;
        
        player.appendChild(audio);
        player.appendChild(controls);
        container.appendChild(label);
        container.appendChild(player);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'audio-player-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Audio Player`;
        label.className = 'audio-label';
        
        const player = document.createElement('div');
        player.className = `library-audio-player ${libraryId}-audio-player`;
        
        const audio = document.createElement('audio');
        audio.className = 'audio-element';
        audio.controls = false;
        
        const controls = document.createElement('div');
        controls.className = 'audio-controls';
        controls.innerHTML = `
            <button class="play-pause-btn" data-playing="false">▶️</button>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="time-display">
                    <span class="current-time">0:00</span>
                    <span class="duration">0:00</span>
                </div>
            </div>
            <div class="volume-container">
                <span class="volume-icon">🔊</span>
                <input type="range" class="volume-slider" min="0" max="100" value="50">
            </div>
        `;
        
        player.appendChild(audio);
        player.appendChild(controls);
        container.appendChild(label);
        container.appendChild(player);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const audio = element.querySelector('.audio-element');
        const playPauseBtn = element.querySelector('.play-pause-btn');
        const progressFill = element.querySelector('.progress-fill');
        const currentTimeSpan = element.querySelector('.current-time');
        const durationSpan = element.querySelector('.duration');
        const volumeSlider = element.querySelector('.volume-slider');
        const progressBar = element.querySelector('.progress-bar');
        
        // Create a demo audio source (using a data URL for demo)
        const audioDataUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        audio.src = audioDataUrl;
        
        // Play/Pause functionality
        playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause(audio, playPauseBtn);
        });
        
        // Progress bar interaction
        progressBar.addEventListener('click', (e) => {
            this.seekToPosition(e, audio, progressFill);
        });
        
        // Volume control
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(audio, e.target.value);
        });
        
        // Audio event listeners
        audio.addEventListener('loadedmetadata', () => {
            this.updateDuration(audio, durationSpan);
        });
        
        audio.addEventListener('timeupdate', () => {
            this.updateProgress(audio, progressFill, currentTimeSpan);
        });
        
        audio.addEventListener('ended', () => {
            this.handleAudioEnd(playPauseBtn);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const audio = element.querySelector('.audio-element');
        const playPauseBtn = element.querySelector('.play-pause-btn');
        const progressFill = element.querySelector('.progress-fill');
        const currentTimeSpan = element.querySelector('.current-time');
        const durationSpan = element.querySelector('.duration');
        const volumeSlider = element.querySelector('.volume-slider');
        const progressBar = element.querySelector('.progress-bar');
        
        const audioDataUrl = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
        audio.src = audioDataUrl;
        
        playPauseBtn.addEventListener('click', () => {
            this.togglePlayPause(audio, playPauseBtn);
        });
        
        progressBar.addEventListener('click', (e) => {
            this.seekToPosition(e, audio, progressFill);
        });
        
        volumeSlider.addEventListener('input', (e) => {
            this.setVolume(audio, e.target.value);
        });
        
        audio.addEventListener('loadedmetadata', () => {
            this.updateDuration(audio, durationSpan);
        });
        
        audio.addEventListener('timeupdate', () => {
            this.updateProgress(audio, progressFill, currentTimeSpan);
        });
        
        audio.addEventListener('ended', () => {
            this.handleAudioEnd(playPauseBtn);
        });
    }
    
    togglePlayPause(audio, button) {
        if (audio.paused) {
            audio.play();
            button.textContent = '⏸️';
            button.setAttribute('data-playing', 'true');
        } else {
            audio.pause();
            button.textContent = '▶️';
            button.setAttribute('data-playing', 'false');
        }
    }
    
    seekToPosition(e, audio, progressFill) {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;
        const newTime = percentage * audio.duration;
        
        audio.currentTime = newTime;
        progressFill.style.width = `${percentage * 100}%`;
    }
    
    setVolume(audio, volume) {
        audio.volume = volume / 100;
    }
    
    updateDuration(audio, durationSpan) {
        const duration = this.formatTime(audio.duration);
        durationSpan.textContent = duration;
    }
    
    updateProgress(audio, progressFill, currentTimeSpan) {
        if (audio.duration) {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percentage}%`;
            currentTimeSpan.textContent = this.formatTime(audio.currentTime);
        }
    }
    
    handleAudioEnd(button) {
        button.textContent = '▶️';
        button.setAttribute('data-playing', 'false');
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('audio-player', `
            .audio-player-container {
                margin: 1rem 0;
            }
            
            .audio-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-audio-player {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .audio-controls {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .play-pause-btn {
                background: var(--cosmic-primary);
                border: none;
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .play-pause-btn:hover {
                background: var(--cosmic-accent);
                transform: scale(1.1);
            }
            
            .progress-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .progress-bar {
                height: 6px;
                background: var(--cosmic-neutral);
                border-radius: 3px;
                cursor: pointer;
                position: relative;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--cosmic-primary), var(--cosmic-accent));
                border-radius: 3px;
                width: 0%;
                transition: width 0.1s ease;
            }
            
            .time-display {
                display: flex;
                justify-content: space-between;
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                color: var(--cosmic-neutral);
            }
            
            .volume-container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .volume-icon {
                font-size: 1.2rem;
            }
            
            .volume-slider {
                width: 80px;
                height: 4px;
                background: var(--cosmic-neutral);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
            }
            
            .volume-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
            }
            
            .volume-slider::-moz-range-thumb {
                width: 16px;
                height: 16px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
                border: none;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('audio-player-library', `
            .library-audio-player {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
        `);
    }
}

/**
 * 🎭 Micro Interactions Component
 */
class MicroInteractionsComponent extends BaseComponent {
    constructor() {
        super('Micro Interactions', 'Subtle UI feedback and animations', 'trend');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'micro-interactions-container';
        
        const label = document.createElement('label');
        label.textContent = 'Micro Interactions';
        label.className = 'interactions-label';
        
        const demo = document.createElement('div');
        demo.className = 'vanilla-micro-demo';
        demo.innerHTML = `
            <div class="interaction-grid">
                <div class="interaction-item hover-lift">
                    <div class="icon">✨</div>
                    <h4>Hover Lift</h4>
                    <p>Subtle elevation on hover</p>
                </div>
                <div class="interaction-item ripple-effect">
                    <div class="icon">🌊</div>
                    <h4>Ripple Effect</h4>
                    <p>Click for ripple animation</p>
                </div>
                <div class="interaction-item morphing">
                    <div class="icon">🔄</div>
                    <h4>Morphing</h4>
                    <p>Shape transformation</p>
                </div>
                <div class="interaction-item glow-pulse">
                    <div class="icon">💫</div>
                    <h4>Glow Pulse</h4>
                    <p>Pulsing glow effect</p>
                </div>
                <div class="interaction-item bounce-in">
                    <div class="icon">⚡</div>
                    <h4>Bounce In</h4>
                    <p>Bouncy entrance animation</p>
                </div>
                <div class="interaction-item shake">
                    <div class="icon">📳</div>
                    <h4>Shake</h4>
                    <p>Shake on interaction</p>
                </div>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(demo);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'micro-interactions-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Micro Interactions`;
        label.className = 'interactions-label';
        
        const demo = document.createElement('div');
        demo.className = `library-micro-demo ${libraryId}-micro-demo`;
        demo.innerHTML = `
            <div class="interaction-grid">
                <div class="interaction-item hover-lift">
                    <div class="icon">✨</div>
                    <h4>Hover Lift</h4>
                    <p>Subtle elevation on hover</p>
                </div>
                <div class="interaction-item ripple-effect">
                    <div class="icon">🌊</div>
                    <h4>Ripple Effect</h4>
                    <p>Click for ripple animation</p>
                </div>
                <div class="interaction-item morphing">
                    <div class="icon">🔄</div>
                    <h4>Morphing</h4>
                    <p>Shape transformation</p>
                </div>
                <div class="interaction-item glow-pulse">
                    <div class="icon">💫</div>
                    <h4>Glow Pulse</h4>
                    <p>Pulsing glow effect</p>
                </div>
                <div class="interaction-item bounce-in">
                    <div class="icon">⚡</div>
                    <h4>Bounce In</h4>
                    <p>Bouncy entrance animation</p>
                </div>
                <div class="interaction-item shake">
                    <div class="icon">📳</div>
                    <h4>Shake</h4>
                    <p>Shake on interaction</p>
                </div>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(demo);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const items = element.querySelectorAll('.interaction-item');
        
        items.forEach(item => {
            // Ripple effect
            if (item.classList.contains('ripple-effect')) {
                item.addEventListener('click', (e) => {
                    this.createRipple(e, item);
                });
            }
            
            // Shake effect
            if (item.classList.contains('shake')) {
                item.addEventListener('click', () => {
                    this.triggerShake(item);
                });
            }
            
            // Morphing effect
            if (item.classList.contains('morphing')) {
                item.addEventListener('click', () => {
                    this.triggerMorph(item);
                });
            }
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const items = element.querySelectorAll('.interaction-item');
        
        items.forEach(item => {
            if (item.classList.contains('ripple-effect')) {
                item.addEventListener('click', (e) => {
                    this.createRipple(e, item);
                });
            }
            
            if (item.classList.contains('shake')) {
                item.addEventListener('click', () => {
                    this.triggerShake(item);
                });
            }
            
            if (item.classList.contains('morphing')) {
                item.addEventListener('click', () => {
                    this.triggerMorph(item);
                });
            }
        });
    }
    
    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
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
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    triggerShake(element) {
        element.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 500);
    }
    
    triggerMorph(element) {
        const icon = element.querySelector('.icon');
        const originalText = icon.textContent;
        
        icon.style.transform = 'scale(0) rotate(180deg)';
        
        setTimeout(() => {
            icon.textContent = icon.textContent === '🔄' ? '✨' : '🔄';
            icon.style.transform = 'scale(1) rotate(0deg)';
        }, 300);
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('micro-interactions', `
            .micro-interactions-container {
                margin: 1rem 0;
            }
            
            .interactions-label {
                display: block;
                margin-bottom: 1rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-micro-demo {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 2rem;
            }
            
            .interaction-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1.5rem;
            }
            
            .interaction-item {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1.5rem;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .interaction-item:hover {
                border-color: var(--cosmic-primary);
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(74, 158, 255, 0.2);
            }
            
            .interaction-item .icon {
                font-size: 2rem;
                margin-bottom: 0.5rem;
                display: block;
                transition: all 0.3s ease;
            }
            
            .interaction-item h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
                margin: 0 0 0.5rem 0;
            }
            
            .interaction-item p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                margin: 0;
            }
            
            .hover-lift:hover {
                transform: translateY(-8px) scale(1.02);
            }
            
            .glow-pulse {
                animation: glowPulse 2s ease-in-out infinite;
            }
            
            .bounce-in {
                animation: bounceIn 0.6s ease-out;
            }
            
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            @keyframes glowPulse {
                0%, 100% { box-shadow: 0 0 5px var(--cosmic-primary); }
                50% { box-shadow: 0 0 20px var(--cosmic-accent), 0 0 30px var(--cosmic-primary); }
            }
            
            @keyframes bounceIn {
                0% { transform: scale(0.3); opacity: 0; }
                50% { transform: scale(1.05); }
                70% { transform: scale(0.9); }
                100% { transform: scale(1); opacity: 1; }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('micro-interactions-library', `
            .library-micro-demo {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 2rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ThreeDCanvasComponent,
        AudioPlayerComponent,
        MicroInteractionsComponent
    };
}
