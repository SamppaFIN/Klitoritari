/**
 * 🌌 Cosmic Animations
 * Advanced CSS3 animations and transitions for cosmic effects
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * ✨ Particle System Component
 */
class ParticleSystemComponent extends AuroraBaseComponent {
    constructor() {
        super('Particle System', 'Advanced particle effects with cosmic animations', 'cosmic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'particle-system-container';
        
        const label = document.createElement('label');
        label.textContent = 'Cosmic Particle System';
        label.className = 'particle-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'vanilla-particle-canvas';
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'particle-controls';
        controls.innerHTML = `
            <button class="particle-btn" data-effect="stars">⭐ Stars</button>
            <button class="particle-btn" data-effect="nebula">🌌 Nebula</button>
            <button class="particle-btn" data-effect="aurora">🌅 Aurora</button>
            <button class="particle-btn" data-effect="galaxy">🌌 Galaxy</button>
            <button class="particle-btn" data-effect="cosmic-dust">✨ Dust</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'particle-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Particle Count:</label>
                <input type="range" class="particle-slider" min="50" max="500" value="200">
                <span class="particle-count">200</span>
            </div>
            <div class="setting-group">
                <label>Speed:</label>
                <input type="range" class="speed-slider" min="0.1" max="2" step="0.1" value="1">
                <span class="speed-value">1.0</span>
            </div>
            <div class="setting-group">
                <label>Size:</label>
                <input type="range" class="size-slider" min="1" max="10" value="3">
                <span class="size-value">3</span>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(settings);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'particle-system-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Particle System`;
        label.className = 'particle-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = `library-particle-canvas ${libraryId}-particle-canvas`;
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'particle-controls';
        controls.innerHTML = `
            <button class="particle-btn" data-effect="stars">⭐ Stars</button>
            <button class="particle-btn" data-effect="nebula">🌌 Nebula</button>
            <button class="particle-btn" data-effect="aurora">🌅 Aurora</button>
            <button class="particle-btn" data-effect="galaxy">🌌 Galaxy</button>
            <button class="particle-btn" data-effect="cosmic-dust">✨ Dust</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'particle-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Particle Count:</label>
                <input type="range" class="particle-slider" min="50" max="500" value="200">
                <span class="particle-count">200</span>
            </div>
            <div class="setting-group">
                <label>Speed:</label>
                <input type="range" class="speed-slider" min="0.1" max="2" step="0.1" value="1">
                <span class="speed-value">1.0</span>
            </div>
            <div class="setting-group">
                <label>Size:</label>
                <input type="range" class="size-slider" min="1" max="10" value="3">
                <span class="size-value">3</span>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(settings);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const canvas = element.querySelector('.vanilla-particle-canvas');
        const controls = element.querySelectorAll('.particle-btn');
        const particleSlider = element.querySelector('.particle-slider');
        const speedSlider = element.querySelector('.speed-slider');
        const sizeSlider = element.querySelector('.size-slider');
        
        // Initialize particle system
        this.initParticleSystem(canvas);
        
        // Effect controls
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchEffect(canvas, e.target.dataset.effect);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        // Settings controls
        particleSlider.addEventListener('input', (e) => {
            this.updateParticleCount(canvas, parseInt(e.target.value));
            element.querySelector('.particle-count').textContent = e.target.value;
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.updateSpeed(canvas, parseFloat(e.target.value));
            element.querySelector('.speed-value').textContent = e.target.value;
        });
        
        sizeSlider.addEventListener('input', (e) => {
            this.updateSize(canvas, parseInt(e.target.value));
            element.querySelector('.size-value').textContent = e.target.value;
        });
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, canvas);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleClick(e, canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const canvas = element.querySelector('.library-particle-canvas');
        const controls = element.querySelectorAll('.particle-btn');
        const particleSlider = element.querySelector('.particle-slider');
        const speedSlider = element.querySelector('.speed-slider');
        const sizeSlider = element.querySelector('.size-slider');
        
        this.initParticleSystem(canvas);
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchEffect(canvas, e.target.dataset.effect);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        particleSlider.addEventListener('input', (e) => {
            this.updateParticleCount(canvas, parseInt(e.target.value));
            element.querySelector('.particle-count').textContent = e.target.value;
        });
        
        speedSlider.addEventListener('input', (e) => {
            this.updateSpeed(canvas, parseFloat(e.target.value));
            element.querySelector('.speed-value').textContent = e.target.value;
        });
        
        sizeSlider.addEventListener('input', (e) => {
            this.updateSize(canvas, parseInt(e.target.value));
            element.querySelector('.size-value').textContent = e.target.value;
        });
        
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, canvas);
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleClick(e, canvas);
        });
    }
    
    initParticleSystem(canvas) {
        const ctx = canvas.getContext('2d');
        canvas.particleSystem = {
            particles: [],
            effect: 'stars',
            count: 200,
            speed: 1.0,
            size: 3,
            mouseX: 0,
            mouseY: 0,
            animationId: null,
            isRunning: false
        };
        
        this.createParticles(canvas);
        this.startAnimation(canvas);
    }
    
    createParticles(canvas) {
        const system = canvas.particleSystem;
        system.particles = [];
        
        for (let i = 0; i < system.count; i++) {
            system.particles.push(this.createParticle(canvas));
        }
    }
    
    createParticle(canvas) {
        const system = canvas.particleSystem;
        const effect = system.effect;
        
        switch(effect) {
            case 'stars':
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5 * system.speed,
                    vy: (Math.random() - 0.5) * 0.5 * system.speed,
                    size: Math.random() * system.size + 1,
                    opacity: Math.random() * 0.8 + 0.2,
                    color: this.getStarColor(),
                    life: 1.0,
                    maxLife: 1.0
                };
            case 'nebula':
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3 * system.speed,
                    vy: (Math.random() - 0.5) * 0.3 * system.speed,
                    size: Math.random() * system.size * 2 + 2,
                    opacity: Math.random() * 0.6 + 0.1,
                    color: this.getNebulaColor(),
                    life: Math.random() * 0.5 + 0.5,
                    maxLife: 1.0
                };
            case 'aurora':
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.2 * system.speed,
                    vy: (Math.random() - 0.5) * 0.2 * system.speed,
                    size: Math.random() * system.size + 1,
                    opacity: Math.random() * 0.7 + 0.3,
                    color: this.getAuroraColor(),
                    life: Math.random() * 0.8 + 0.2,
                    maxLife: 1.0
                };
            case 'galaxy':
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * Math.min(canvas.width, canvas.height) / 2;
                return {
                    x: canvas.width / 2 + Math.cos(angle) * distance,
                    y: canvas.height / 2 + Math.sin(angle) * distance,
                    vx: -Math.sin(angle) * 0.1 * system.speed,
                    vy: Math.cos(angle) * 0.1 * system.speed,
                    size: Math.random() * system.size + 1,
                    opacity: Math.random() * 0.8 + 0.2,
                    color: this.getGalaxyColor(),
                    life: 1.0,
                    maxLife: 1.0
                };
            case 'cosmic-dust':
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.8 * system.speed,
                    vy: (Math.random() - 0.5) * 0.8 * system.speed,
                    size: Math.random() * system.size * 0.5 + 0.5,
                    opacity: Math.random() * 0.5 + 0.1,
                    color: this.getDustColor(),
                    life: Math.random() * 0.3 + 0.7,
                    maxLife: 1.0
                };
        }
    }
    
    getStarColor() {
        const colors = ['#ffffff', '#4A9EFF', '#00FF88', '#FF6B35', '#8A2BE2'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getNebulaColor() {
        const colors = ['#8A2BE2', '#4A9EFF', '#00FF88', '#FF6B35', '#FF3366'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getAuroraColor() {
        const colors = ['#00FF88', '#4A9EFF', '#8A2BE2', '#00FFFF', '#FF00FF'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getGalaxyColor() {
        const colors = ['#FFD700', '#FFA500', '#FF6347', '#FF1493', '#9370DB'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getDustColor() {
        const colors = ['#C0C0C0', '#A0A0A0', '#808080', '#606060', '#404040'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    startAnimation(canvas) {
        const system = canvas.particleSystem;
        system.isRunning = true;
        
        const animate = () => {
            if (!system.isRunning) return;
            
            this.updateParticles(canvas);
            this.drawParticles(canvas);
            
            system.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    updateParticles(canvas) {
        const system = canvas.particleSystem;
        const ctx = canvas.getContext('2d');
        
        // Clear canvas with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        system.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Update life
            particle.life -= 0.005;
            
            // Mouse interaction
            const dx = system.mouseX - particle.x;
            const dy = system.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.001;
                particle.vy += dy * force * 0.001;
            }
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Reset particle if life is over
            if (particle.life <= 0) {
                system.particles[index] = this.createParticle(canvas);
            }
        });
    }
    
    drawParticles(canvas) {
        const system = canvas.particleSystem;
        const ctx = canvas.getContext('2d');
        
        system.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.opacity * particle.life;
            ctx.fillStyle = particle.color;
            
            // Draw particle based on effect
            switch(system.effect) {
                case 'stars':
                    this.drawStar(ctx, particle);
                    break;
                case 'nebula':
                    this.drawNebula(ctx, particle);
                    break;
                case 'aurora':
                    this.drawAurora(ctx, particle);
                    break;
                case 'galaxy':
                    this.drawGalaxy(ctx, particle);
                    break;
                case 'cosmic-dust':
                    this.drawDust(ctx, particle);
                    break;
            }
            
            ctx.restore();
        });
    }
    
    drawStar(ctx, particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add glow effect
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = particle.size * 2;
        ctx.fill();
    }
    
    drawNebula(ctx, particle) {
        const gradient = ctx.createRadialGradient(
            particle.x, particle.y, 0,
            particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    drawAurora(ctx, particle) {
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = particle.size;
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(particle.x + particle.vx * 10, particle.y + particle.vy * 10);
        ctx.stroke();
    }
    
    drawGalaxy(ctx, particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Add spiral effect
        ctx.strokeStyle = particle.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
        ctx.stroke();
    }
    
    drawDust(ctx, particle) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    switchEffect(canvas, effect) {
        canvas.particleSystem.effect = effect;
        this.createParticles(canvas);
    }
    
    updateParticleCount(canvas, count) {
        canvas.particleSystem.count = count;
        this.createParticles(canvas);
    }
    
    updateSpeed(canvas, speed) {
        canvas.particleSystem.speed = speed;
    }
    
    updateSize(canvas, size) {
        canvas.particleSystem.size = size;
    }
    
    handleMouseMove(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        canvas.particleSystem.mouseX = e.clientX - rect.left;
        canvas.particleSystem.mouseY = e.clientY - rect.top;
    }
    
    handleClick(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Create explosion effect
        for (let i = 0; i < 20; i++) {
            const particle = this.createParticle(canvas);
            particle.x = x;
            particle.y = y;
            particle.vx = (Math.random() - 0.5) * 4;
            particle.vy = (Math.random() - 0.5) * 4;
            particle.life = 1.0;
            canvas.particleSystem.particles.push(particle);
        }
    }
    
    updateActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('particle-system', `
            .particle-system-container {
                margin: 1rem 0;
            }
            
            .particle-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-particle-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: radial-gradient(circle at center, #1a1a2e, #16213e, #0f0f23);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
            
            .particle-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .particle-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .particle-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .particle-btn.active {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
            
            .particle-settings {
                display: flex;
                gap: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .setting-group {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            
            .setting-group label {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                min-width: 80px;
            }
            
            .particle-slider,
            .speed-slider,
            .size-slider {
                width: 100px;
                height: 4px;
                background: var(--cosmic-neutral);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
            }
            
            .particle-slider::-webkit-slider-thumb,
            .speed-slider::-webkit-slider-thumb,
            .size-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
            }
            
            .particle-count,
            .speed-value,
            .size-value {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 30px;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('particle-system-library', `
            .library-particle-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: radial-gradient(circle at center, #1a1a2e, #16213e, #0f0f23);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
        `);
    }
}

/**
 * 🌟 Cosmic Loading Component
 */
class CosmicLoadingComponent extends AuroraBaseComponent {
    constructor() {
        super('Cosmic Loading', 'Advanced loading animations with cosmic effects', 'cosmic');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'cosmic-loading-container';
        
        const label = document.createElement('label');
        label.textContent = 'Cosmic Loading Animations';
        label.className = 'loading-label';
        
        const loadingArea = document.createElement('div');
        loadingArea.className = 'vanilla-loading-area';
        loadingArea.innerHTML = `
            <div class="loading-demo">
                <div class="cosmic-spinner" id="cosmic-spinner">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <div class="loading-text">Loading the cosmos...</div>
            </div>
            
            <div class="loading-demo">
                <div class="pulse-loader" id="pulse-loader">
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                </div>
                <div class="loading-text">Pulsing energy...</div>
            </div>
            
            <div class="loading-demo">
                <div class="wave-loader" id="wave-loader">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                </div>
                <div class="loading-text">Riding cosmic waves...</div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'loading-controls';
        controls.innerHTML = `
            <button class="loading-btn" data-type="spinner">🌀 Spinner</button>
            <button class="loading-btn" data-type="pulse">💫 Pulse</button>
            <button class="loading-btn" data-type="wave">🌊 Wave</button>
            <button class="loading-btn" data-type="orbit">🪐 Orbit</button>
            <button class="loading-btn" data-type="matrix">🔢 Matrix</button>
        `;
        
        container.appendChild(label);
        container.appendChild(loadingArea);
        container.appendChild(controls);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'cosmic-loading-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Cosmic Loading`;
        label.className = 'loading-label';
        
        const loadingArea = document.createElement('div');
        loadingArea.className = `library-loading-area ${libraryId}-loading-area`;
        loadingArea.innerHTML = `
            <div class="loading-demo">
                <div class="cosmic-spinner" id="cosmic-spinner-lib">
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                    <div class="spinner-ring"></div>
                </div>
                <div class="loading-text">Loading the cosmos...</div>
            </div>
            
            <div class="loading-demo">
                <div class="pulse-loader" id="pulse-loader-lib">
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                    <div class="pulse-dot"></div>
                </div>
                <div class="loading-text">Pulsing energy...</div>
            </div>
            
            <div class="loading-demo">
                <div class="wave-loader" id="wave-loader-lib">
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                    <div class="wave-bar"></div>
                </div>
                <div class="loading-text">Riding cosmic waves...</div>
            </div>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'loading-controls';
        controls.innerHTML = `
            <button class="loading-btn" data-type="spinner">🌀 Spinner</button>
            <button class="loading-btn" data-type="pulse">💫 Pulse</button>
            <button class="loading-btn" data-type="wave">🌊 Wave</button>
            <button class="loading-btn" data-type="orbit">🪐 Orbit</button>
            <button class="loading-btn" data-type="matrix">🔢 Matrix</button>
        `;
        
        container.appendChild(label);
        container.appendChild(loadingArea);
        container.appendChild(controls);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const controls = element.querySelectorAll('.loading-btn');
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLoadingType(element, e.target.dataset.type);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        // Initialize with spinner
        this.switchLoadingType(element, 'spinner');
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const controls = element.querySelectorAll('.loading-btn');
        
        controls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchLoadingType(element, e.target.dataset.type);
                this.updateActiveButton(controls, e.target);
            });
        });
        
        this.switchLoadingType(element, 'spinner');
    }
    
    switchLoadingType(element, type) {
        const loadingArea = element.querySelector('.vanilla-loading-area, .library-loading-area');
        
        switch(type) {
            case 'spinner':
                loadingArea.innerHTML = `
                    <div class="loading-demo">
                        <div class="cosmic-spinner">
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                            <div class="spinner-ring"></div>
                        </div>
                        <div class="loading-text">Loading the cosmos...</div>
                    </div>
                `;
                break;
            case 'pulse':
                loadingArea.innerHTML = `
                    <div class="loading-demo">
                        <div class="pulse-loader">
                            <div class="pulse-dot"></div>
                            <div class="pulse-dot"></div>
                            <div class="pulse-dot"></div>
                        </div>
                        <div class="loading-text">Pulsing energy...</div>
                    </div>
                `;
                break;
            case 'wave':
                loadingArea.innerHTML = `
                    <div class="loading-demo">
                        <div class="wave-loader">
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                            <div class="wave-bar"></div>
                        </div>
                        <div class="loading-text">Riding cosmic waves...</div>
                    </div>
                `;
                break;
            case 'orbit':
                loadingArea.innerHTML = `
                    <div class="loading-demo">
                        <div class="orbit-loader">
                            <div class="orbit-center"></div>
                            <div class="orbit-dot"></div>
                            <div class="orbit-dot"></div>
                            <div class="orbit-dot"></div>
                        </div>
                        <div class="loading-text">Orbiting celestial bodies...</div>
                    </div>
                `;
                break;
            case 'matrix':
                loadingArea.innerHTML = `
                    <div class="loading-demo">
                        <div class="matrix-loader">
                            <div class="matrix-column"></div>
                            <div class="matrix-column"></div>
                            <div class="matrix-column"></div>
                            <div class="matrix-column"></div>
                            <div class="matrix-column"></div>
                        </div>
                        <div class="loading-text">Decoding the matrix...</div>
                    </div>
                `;
                break;
        }
    }
    
    updateActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('cosmic-loading', `
            .cosmic-loading-container {
                margin: 1rem 0;
            }
            
            .loading-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-loading-area {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 200px;
            }
            
            .loading-demo {
                text-align: center;
            }
            
            .loading-text {
                margin-top: 1rem;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                font-size: 1.1rem;
            }
            
            /* Cosmic Spinner */
            .cosmic-spinner {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto;
            }
            
            .spinner-ring {
                position: absolute;
                width: 100%;
                height: 100%;
                border: 3px solid transparent;
                border-top: 3px solid var(--cosmic-primary);
                border-radius: 50%;
                animation: cosmicSpin 2s linear infinite;
            }
            
            .spinner-ring:nth-child(2) {
                width: 80%;
                height: 80%;
                top: 10%;
                left: 10%;
                border-top-color: var(--cosmic-accent);
                animation-duration: 1.5s;
                animation-direction: reverse;
            }
            
            .spinner-ring:nth-child(3) {
                width: 60%;
                height: 60%;
                top: 20%;
                left: 20%;
                border-top-color: var(--cosmic-secondary);
                animation-duration: 1s;
            }
            
            @keyframes cosmicSpin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            /* Pulse Loader */
            .pulse-loader {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.5rem;
            }
            
            .pulse-dot {
                width: 20px;
                height: 20px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                animation: cosmicPulse 1.5s ease-in-out infinite;
            }
            
            .pulse-dot:nth-child(2) {
                animation-delay: 0.2s;
                background: var(--cosmic-accent);
            }
            
            .pulse-dot:nth-child(3) {
                animation-delay: 0.4s;
                background: var(--cosmic-secondary);
            }
            
            @keyframes cosmicPulse {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.5); opacity: 0.7; }
            }
            
            /* Wave Loader */
            .wave-loader {
                display: flex;
                justify-content: center;
                align-items: end;
                gap: 0.3rem;
                height: 60px;
            }
            
            .wave-bar {
                width: 8px;
                background: linear-gradient(to top, var(--cosmic-primary), var(--cosmic-accent));
                border-radius: 4px;
                animation: cosmicWave 1.2s ease-in-out infinite;
            }
            
            .wave-bar:nth-child(1) { animation-delay: 0s; }
            .wave-bar:nth-child(2) { animation-delay: 0.1s; }
            .wave-bar:nth-child(3) { animation-delay: 0.2s; }
            .wave-bar:nth-child(4) { animation-delay: 0.3s; }
            .wave-bar:nth-child(5) { animation-delay: 0.4s; }
            
            @keyframes cosmicWave {
                0%, 100% { height: 20px; }
                50% { height: 60px; }
            }
            
            /* Orbit Loader */
            .orbit-loader {
                position: relative;
                width: 80px;
                height: 80px;
                margin: 0 auto;
            }
            
            .orbit-center {
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                background: var(--cosmic-accent);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 20px var(--cosmic-accent);
            }
            
            .orbit-dot {
                position: absolute;
                width: 12px;
                height: 12px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                animation: cosmicOrbit 3s linear infinite;
            }
            
            .orbit-dot:nth-child(2) {
                animation-delay: 0s;
            }
            
            .orbit-dot:nth-child(3) {
                animation-delay: 1s;
            }
            
            .orbit-dot:nth-child(4) {
                animation-delay: 2s;
            }
            
            @keyframes cosmicOrbit {
                0% {
                    transform: rotate(0deg) translateX(30px) rotate(0deg);
                }
                100% {
                    transform: rotate(360deg) translateX(30px) rotate(-360deg);
                }
            }
            
            /* Matrix Loader */
            .matrix-loader {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 0.2rem;
                height: 60px;
            }
            
            .matrix-column {
                width: 4px;
                height: 100%;
                background: linear-gradient(to bottom, transparent, var(--cosmic-accent), transparent);
                animation: cosmicMatrix 1s ease-in-out infinite;
            }
            
            .matrix-column:nth-child(1) { animation-delay: 0s; }
            .matrix-column:nth-child(2) { animation-delay: 0.1s; }
            .matrix-column:nth-child(3) { animation-delay: 0.2s; }
            .matrix-column:nth-child(4) { animation-delay: 0.3s; }
            .matrix-column:nth-child(5) { animation-delay: 0.4s; }
            
            @keyframes cosmicMatrix {
                0%, 100% { opacity: 0.3; transform: scaleY(0.5); }
                50% { opacity: 1; transform: scaleY(1); }
            }
            
            .loading-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .loading-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-neutral);
                color: var(--cosmic-light);
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .loading-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .loading-btn.active {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('cosmic-loading-library', `
            .library-loading-area {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 2rem;
                margin-bottom: 1rem;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 200px;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ParticleSystemComponent,
        CosmicLoadingComponent
    };
}
