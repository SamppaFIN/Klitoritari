/**
 * 🌌 WebGL Integration Components
 * Advanced WebGL particle systems and 3D effects
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🎨 WebGL Particle System Component
 */
class WebGLParticleSystemComponent extends BaseComponent {
    constructor() {
        super('WebGL Particles', 'High-performance WebGL particle system', 'webgl');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'webgl-particle-container';
        
        const label = document.createElement('label');
        label.textContent = 'WebGL Particle System';
        label.className = 'webgl-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = 'vanilla-webgl-canvas';
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'webgl-controls';
        controls.innerHTML = `
            <button class="webgl-btn" data-effect="cosmic-storm">🌪️ Storm</button>
            <button class="webgl-btn" data-effect="galaxy-spiral">🌌 Spiral</button>
            <button class="webgl-btn" data-effect="energy-field">⚡ Energy</button>
            <button class="webgl-btn" data-effect="quantum-dots">🔬 Quantum</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'webgl-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Particles:</label>
                <input type="range" class="particle-slider" min="1000" max="10000" value="5000">
                <span class="particle-count">5000</span>
            </div>
            <div class="setting-group">
                <label>Speed:</label>
                <input type="range" class="speed-slider" min="0.1" max="3" step="0.1" value="1">
                <span class="speed-value">1.0</span>
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
        container.className = 'webgl-particle-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} WebGL Particles`;
        label.className = 'webgl-label';
        
        const canvas = document.createElement('canvas');
        canvas.className = `library-webgl-canvas ${libraryId}-webgl-canvas`;
        canvas.width = 400;
        canvas.height = 300;
        
        const controls = document.createElement('div');
        controls.className = 'webgl-controls';
        controls.innerHTML = `
            <button class="webgl-btn" data-effect="cosmic-storm">🌪️ Storm</button>
            <button class="webgl-btn" data-effect="galaxy-spiral">🌌 Spiral</button>
            <button class="webgl-btn" data-effect="energy-field">⚡ Energy</button>
            <button class="webgl-btn" data-effect="quantum-dots">🔬 Quantum</button>
        `;
        
        const settings = document.createElement('div');
        settings.className = 'webgl-settings';
        settings.innerHTML = `
            <div class="setting-group">
                <label>Particles:</label>
                <input type="range" class="particle-slider" min="1000" max="10000" value="5000">
                <span class="particle-count">5000</span>
            </div>
            <div class="setting-group">
                <label>Speed:</label>
                <input type="range" class="speed-slider" min="0.1" max="3" step="0.1" value="1">
                <span class="speed-value">1.0</span>
            </div>
        `;
        
        container.appendChild(label);
        container.appendChild(canvas);
        container.appendChild(controls);
        container.appendChild(settings);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const canvas = element.querySelector('.vanilla-webgl-canvas');
        const controls = element.querySelectorAll('.webgl-btn');
        const particleSlider = element.querySelector('.particle-slider');
        const speedSlider = element.querySelector('.speed-slider');
        
        // Initialize WebGL system
        this.initWebGLSystem(canvas);
        
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
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const canvas = element.querySelector('.library-webgl-canvas');
        const controls = element.querySelectorAll('.webgl-btn');
        const particleSlider = element.querySelector('.particle-slider');
        const speedSlider = element.querySelector('.speed-slider');
        
        this.initWebGLSystem(canvas);
        
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
        
        canvas.addEventListener('mousemove', (e) => {
            this.handleMouseMove(e, canvas);
        });
    }
    
    initWebGLSystem(canvas) {
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        
        if (!gl) {
            this.fallbackToCanvas(canvas);
            return;
        }
        
        // WebGL shaders
        const vertexShaderSource = `
            attribute vec2 a_position;
            attribute float a_size;
            attribute vec3 a_color;
            uniform float u_time;
            uniform vec2 u_mouse;
            varying vec3 v_color;
            
            void main() {
                vec2 position = a_position;
                
                // Add time-based animation
                position.x += sin(u_time * 0.001 + a_position.y * 0.01) * 10.0;
                position.y += cos(u_time * 0.001 + a_position.x * 0.01) * 10.0;
                
                // Mouse interaction
                vec2 mouseInfluence = (u_mouse - position) * 0.001;
                position += mouseInfluence;
                
                gl_Position = vec4(position, 0.0, 1.0);
                gl_PointSize = a_size;
                v_color = a_color;
            }
        `;
        
        const fragmentShaderSource = `
            precision mediump float;
            varying vec3 v_color;
            
            void main() {
                float distance = length(gl_PointCoord - vec2(0.5));
                float alpha = 1.0 - smoothstep(0.0, 0.5, distance);
                gl_FragColor = vec4(v_color, alpha);
            }
        `;
        
        // Create shader program
        const vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = this.createProgram(gl, vertexShader, fragmentShader);
        
        // Store WebGL context
        canvas.webglContext = {
            gl,
            program,
            particles: [],
            particleCount: 5000,
            speed: 1.0,
            effect: 'cosmic-storm',
            mouseX: 0,
            mouseY: 0,
            animationId: null
        };
        
        this.createParticles(canvas);
        this.startWebGLAnimation(canvas);
    }
    
    createShader(gl, type, source) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        
        return shader;
    }
    
    createProgram(gl, vertexShader, fragmentShader) {
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program linking error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        
        return program;
    }
    
    createParticles(canvas) {
        const context = canvas.webglContext;
        const gl = context.gl;
        const program = context.program;
        
        const positions = [];
        const sizes = [];
        const colors = [];
        
        for (let i = 0; i < context.particleCount; i++) {
            // Position (normalized coordinates)
            positions.push(
                (Math.random() - 0.5) * 2, // x
                (Math.random() - 0.5) * 2  // y
            );
            
            // Size
            sizes.push(Math.random() * 3 + 1);
            
            // Color
            colors.push(
                Math.random() * 0.5 + 0.5, // r
                Math.random() * 0.5 + 0.5, // g
                Math.random() * 0.5 + 0.5  // b
            );
        }
        
        // Create buffers
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        
        const sizeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.STATIC_DRAW);
        
        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        
        context.buffers = {
            position: positionBuffer,
            size: sizeBuffer,
            color: colorBuffer
        };
        
        // Get attribute locations
        context.attributes = {
            position: gl.getAttribLocation(program, 'a_position'),
            size: gl.getAttribLocation(program, 'a_size'),
            color: gl.getAttribLocation(program, 'a_color')
        };
        
        context.uniforms = {
            time: gl.getUniformLocation(program, 'u_time'),
            mouse: gl.getUniformLocation(program, 'u_mouse')
        };
    }
    
    startWebGLAnimation(canvas) {
        const context = canvas.webglContext;
        const gl = context.gl;
        const program = context.program;
        
        const animate = () => {
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.useProgram(program);
            
            // Set uniforms
            gl.uniform1f(context.uniforms.time, Date.now());
            gl.uniform2f(context.uniforms.mouse, context.mouseX, context.mouseY);
            
            // Draw particles
            this.drawParticles(canvas);
            
            context.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    drawParticles(canvas) {
        const context = canvas.webglContext;
        const gl = context.gl;
        
        // Position attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffers.position);
        gl.enableVertexAttribArray(context.attributes.position);
        gl.vertexAttribPointer(context.attributes.position, 2, gl.FLOAT, false, 0, 0);
        
        // Size attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffers.size);
        gl.enableVertexAttribArray(context.attributes.size);
        gl.vertexAttribPointer(context.attributes.size, 1, gl.FLOAT, false, 0, 0);
        
        // Color attribute
        gl.bindBuffer(gl.ARRAY_BUFFER, context.buffers.color);
        gl.enableVertexAttribArray(context.attributes.color);
        gl.vertexAttribPointer(context.attributes.color, 3, gl.FLOAT, false, 0, 0);
        
        // Draw points
        gl.drawArrays(gl.POINTS, 0, context.particleCount);
    }
    
    fallbackToCanvas(canvas) {
        // Fallback to Canvas 2D if WebGL is not available
        const ctx = canvas.getContext('2d');
        canvas.fallbackMode = true;
        
        canvas.particles = [];
        for (let i = 0; i < 1000; i++) {
            canvas.particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                size: Math.random() * 3 + 1,
                color: `hsl(${Math.random() * 360}, 70%, 60%)`
            });
        }
        
        const animate = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            canvas.particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    switchEffect(canvas, effect) {
        if (canvas.webglContext) {
            canvas.webglContext.effect = effect;
        }
    }
    
    updateParticleCount(canvas, count) {
        if (canvas.webglContext) {
            canvas.webglContext.particleCount = count;
            this.createParticles(canvas);
        }
    }
    
    updateSpeed(canvas, speed) {
        if (canvas.webglContext) {
            canvas.webglContext.speed = speed;
        }
    }
    
    handleMouseMove(e, canvas) {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width * 2 - 1;
        const y = -(e.clientY - rect.top) / rect.height * 2 + 1;
        
        if (canvas.webglContext) {
            canvas.webglContext.mouseX = x;
            canvas.webglContext.mouseY = y;
        }
    }
    
    updateActiveButton(buttons, activeButton) {
        buttons.forEach(btn => btn.classList.remove('active'));
        activeButton.classList.add('active');
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('webgl-particles', `
            .webgl-particle-container {
                margin: 1rem 0;
            }
            
            .webgl-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-webgl-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: radial-gradient(circle at center, #0f0f23, #1a1a2e, #16213e);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
            
            .webgl-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                justify-content: center;
                flex-wrap: wrap;
            }
            
            .webgl-btn {
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
            
            .webgl-btn:hover {
                background: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .webgl-btn.active {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
            
            .webgl-settings {
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
                min-width: 60px;
            }
            
            .particle-slider,
            .speed-slider {
                width: 100px;
                height: 4px;
                background: var(--cosmic-neutral);
                border-radius: 2px;
                outline: none;
                cursor: pointer;
            }
            
            .particle-slider::-webkit-slider-thumb,
            .speed-slider::-webkit-slider-thumb {
                appearance: none;
                width: 16px;
                height: 16px;
                background: var(--cosmic-primary);
                border-radius: 50%;
                cursor: pointer;
            }
            
            .particle-count,
            .speed-value {
                color: var(--cosmic-accent);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 40px;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('webgl-particles-library', `
            .library-webgl-canvas {
                display: block;
                width: 100%;
                height: 300px;
                background: radial-gradient(circle at center, #0f0f23, #1a1a2e, #16213e);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                cursor: crosshair;
                margin-bottom: 1rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WebGLParticleSystemComponent
    };
}
