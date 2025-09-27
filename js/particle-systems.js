/**
 * ¨ Particle Systems Technique
 * Advanced particle effects using Canvas and WebGL
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

class ParticleSystemsTechnique {
    constructor() {
        this.name = 'Particle Systems';
        this.description = 'Create stunning particle effects with Canvas and WebGL';
        this.difficulty = 'Advanced';
        this.tags = ['particles', 'canvas', 'webgl', 'effects', 'animation'];
    }
    
    /**
     * Apply particle systems technique to an element
     */
    apply(element, options = {}) {
        const config = {
            particleCount: 1000,
            particleSize: 2,
            particleSpeed: 1,
            particleLife: 3,
            particleColor: '#4a9eff',
            particleOpacity: 0.8,
            enableGravity: true,
            enableWind: false,
            enableCollision: false,
            enableTrails: false,
            enableGlow: true,
            renderer: 'canvas', // 'canvas' or 'webgl'
            ...options
        };
        
        // Add particle system class
        element.classList.add('particle-system');
        
        // Create particle system
        const particleSystem = new ParticleSystem(element, config);
        
        // Setup event listeners
        this.setupEventListeners(element, particleSystem);
        
        // Add CSS styles
        this.addStyles();
        
        return particleSystem;
    }
    
    setupEventListeners(element, particleSystem) {
        // Mouse events for interactive particles
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            particleSystem.setMousePosition(x, y);
        });
        
        element.addEventListener('mouseenter', () => {
            particleSystem.setMouseActive(true);
        });
        
        element.addEventListener('mouseleave', () => {
            particleSystem.setMouseActive(false);
        });
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = element.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            particleSystem.setMousePosition(x, y);
            particleSystem.setMouseActive(true);
        });
        
        element.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const rect = element.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            particleSystem.setMousePosition(x, y);
        }, { passive: false });
        
        element.addEventListener('touchend', () => {
            particleSystem.setMouseActive(false);
        });
        
        // Resize handling
        window.addEventListener('resize', () => {
            particleSystem.resize();
        });
    }
    
    addStyles() {
        if (document.getElementById('particle-systems-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'particle-systems-styles';
        style.textContent = `
            .particle-system {
                position: relative;
                overflow: hidden;
                background: transparent;
            }
            
            .particle-system canvas {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            }
            
            .particle-system .particle-content {
                position: relative;
                z-index: 2;
            }
            
            /* Particle system variants */
            .particle-system.cosmic {
                background: radial-gradient(ellipse at center, 
                    rgba(74, 158, 255, 0.1) 0%, 
                    rgba(138, 43, 226, 0.05) 50%, 
                    transparent 100%);
            }
            
            .particle-system.fire {
                background: radial-gradient(ellipse at center, 
                    rgba(255, 107, 53, 0.1) 0%, 
                    rgba(255, 51, 102, 0.05) 50%, 
                    transparent 100%);
            }
            
            .particle-system.snow {
                background: linear-gradient(180deg, 
                    rgba(255, 255, 255, 0.1) 0%, 
                    transparent 100%);
            }
            
            .particle-system.magic {
                background: radial-gradient(ellipse at center, 
                    rgba(0, 255, 136, 0.1) 0%, 
                    rgba(74, 158, 255, 0.05) 50%, 
                    transparent 100%);
            }
            
            /* Interactive states */
            .particle-system.interactive {
                cursor: pointer;
            }
            
            .particle-system.interactive:hover {
                background: radial-gradient(ellipse at center, 
                    rgba(74, 158, 255, 0.2) 0%, 
                    rgba(138, 43, 226, 0.1) 50%, 
                    transparent 100%);
            }
            
            /* Performance optimizations */
            .particle-system.low-performance {
                transform: translateZ(0);
                will-change: transform;
            }
            
            .particle-system.low-performance canvas {
                transform: translateZ(0);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .particle-system {
                    /* Reduce particle count on mobile */
                    --particle-count: 500;
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .particle-system canvas {
                    display: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * ¨ Particle System
 * Core system for managing particles
 */
class ParticleSystem {
    constructor(element, config) {
        this.element = element;
        this.config = config;
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationFrame = null;
        this.isRunning = false;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseActive = false;
        this.time = 0;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.start();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'particle-canvas';
        this.element.appendChild(this.canvas);
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }
    
    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * this.config.particleSpeed * 2,
            vy: (Math.random() - 0.5) * this.config.particleSpeed * 2,
            size: Math.random() * this.config.particleSize + 1,
            life: Math.random() * this.config.particleLife,
            maxLife: this.config.particleLife,
            color: this.config.particleColor,
            opacity: this.config.particleOpacity,
            trail: this.config.enableTrails ? [] : null
        };
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        this.time += 0.016; // ~60fps
        
        this.update();
        this.render();
        
        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
    
    update() {
        this.particles.forEach(particle => {
            this.updateParticle(particle);
        });
    }
    
    updateParticle(particle) {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        // Apply gravity
        if (this.config.enableGravity) {
            particle.vy += 0.1;
        }
        
        // Apply wind
        if (this.config.enableWind) {
            particle.vx += Math.sin(this.time * 0.01) * 0.1;
        }
        
        // Mouse interaction
        if (this.mouseActive) {
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                const force = (100 - distance) / 100;
                particle.vx += dx * force * 0.01;
                particle.vy += dy * force * 0.01;
            }
        }
        
        // Update life
        particle.life -= 0.016;
        
        // Update opacity based on life
        particle.opacity = (particle.life / particle.maxLife) * this.config.particleOpacity;
        
        // Update trail
        if (particle.trail) {
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > 10) {
                particle.trail.shift();
            }
        }
        
        // Reset particle if dead or out of bounds
        if (particle.life <= 0 || 
            particle.x < -50 || particle.x > this.canvas.width + 50 ||
            particle.y < -50 || particle.y > this.canvas.height + 50) {
            this.resetParticle(particle);
        }
    }
    
    resetParticle(particle) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.vx = (Math.random() - 0.5) * this.config.particleSpeed * 2;
        particle.vy = (Math.random() - 0.5) * this.config.particleSpeed * 2;
        particle.life = particle.maxLife;
        particle.opacity = this.config.particleOpacity;
        if (particle.trail) {
            particle.trail = [];
        }
    }
    
    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render particles
        this.particles.forEach(particle => {
            this.renderParticle(particle);
        });
    }
    
    renderParticle(particle) {
        this.ctx.save();
        
        // Set opacity
        this.ctx.globalAlpha = particle.opacity;
        
        // Render trail
        if (particle.trail && particle.trail.length > 1) {
            this.ctx.strokeStyle = particle.color;
            this.ctx.lineWidth = particle.size * 0.5;
            this.ctx.beginPath();
            
            for (let i = 1; i < particle.trail.length; i++) {
                const point = particle.trail[i];
                const prevPoint = particle.trail[i - 1];
                const alpha = i / particle.trail.length;
                
                this.ctx.globalAlpha = alpha * particle.opacity * 0.5;
                this.ctx.moveTo(prevPoint.x, prevPoint.y);
                this.ctx.lineTo(point.x, point.y);
            }
            
            this.ctx.stroke();
        }
        
        // Render particle
        this.ctx.fillStyle = particle.color;
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Render glow effect
        if (this.config.enableGlow) {
            const gradient = this.ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, particle.size * 3
            );
            gradient.addColorStop(0, particle.color);
            gradient.addColorStop(1, 'transparent');
            
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    resize() {
        const rect = this.element.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setMousePosition(x, y) {
        this.mouseX = x;
        this.mouseY = y;
    }
    
    setMouseActive(active) {
        this.mouseActive = active;
    }
    
    // Public methods
    setParticleCount(count) {
        this.config.particleCount = count;
        this.createParticles();
    }
    
    setParticleSize(size) {
        this.config.particleSize = size;
        this.particles.forEach(particle => {
            particle.size = Math.random() * size + 1;
        });
    }
    
    setParticleSpeed(speed) {
        this.config.particleSpeed = speed;
        this.particles.forEach(particle => {
            particle.vx = (Math.random() - 0.5) * speed * 2;
            particle.vy = (Math.random() - 0.5) * speed * 2;
        });
    }
    
    setParticleColor(color) {
        this.config.particleColor = color;
        this.particles.forEach(particle => {
            particle.color = color;
        });
    }
    
    enableGravity(enable) {
        this.config.enableGravity = enable;
    }
    
    enableWind(enable) {
        this.config.enableWind = enable;
    }
    
    enableTrails(enable) {
        this.config.enableTrails = enable;
        this.particles.forEach(particle => {
            particle.trail = enable ? [] : null;
        });
    }
    
    enableGlow(enable) {
        this.config.enableGlow = enable;
    }
    
    addParticleBurst(x, y, count = 50) {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;
            particle.vx = (Math.random() - 0.5) * 10;
            particle.vy = (Math.random() - 0.5) * 10;
            particle.life = particle.maxLife * 0.5;
            this.particles.push(particle);
        }
    }
    
    destroy() {
        this.stop();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.element.classList.remove('particle-system');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystemsTechnique, ParticleSystem };
}


