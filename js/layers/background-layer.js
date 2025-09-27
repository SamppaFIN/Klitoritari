/**
 * BackgroundLayer - Cosmic background with particle effects
 * 
 * This layer provides the foundational cosmic background with:
 * - Animated particle systems
 * - Cosmic gradient backgrounds
 * - Aurora effects
 * - Sacred geometry patterns
 * 
 * Z-Index: 0 (bottom layer)
 */

class BackgroundLayer extends BaseLayer {
    constructor() {
        super('background');
        this.zIndex = 0;
        this.particles = [];
        this.particleCount = 100;
        this.aurora = {
            phase: 0,
            intensity: 0.8,
            colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
        };
        this.sacredGeometry = {
            enabled: true,
            patterns: ['flower', 'mandala', 'spiral'],
            currentPattern: 'flower',
            rotation: 0
        };
        this.animationId = null;
        this.lastTime = 0;
    }

    init() {
        super.init();
        console.log('🌌 BackgroundLayer: Initializing cosmic background...');
        
        // Initialize particles
        this.initializeParticles();
        
        // Set up sacred geometry
        this.setupSacredGeometry();
        
        // Start animation loop
        this.startAnimation();
        
        console.log('🌌 BackgroundLayer: Cosmic background initialized');
    }

    initializeParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.aurora.colors[Math.floor(Math.random() * this.aurora.colors.length)],
                life: Math.random() * 1000 + 500,
                maxLife: Math.random() * 1000 + 500
            });
        }
    }

    setupSacredGeometry() {
        // Sacred geometry patterns will be drawn in doRender
        this.sacredGeometry.rotation = 0;
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.isVisible) {
                this.animationId = requestAnimationFrame(animate);
                return;
            }

            const deltaTime = timestamp - this.lastTime;
            this.lastTime = timestamp;

            this.updateParticles(deltaTime);
            this.updateAurora(deltaTime);
            this.updateSacredGeometry(deltaTime);

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    updateParticles(deltaTime) {
        this.particles.forEach(particle => {
            // Update position
            particle.x += particle.vx * deltaTime * 0.1;
            particle.y += particle.vy * deltaTime * 0.1;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Update life
            particle.life -= deltaTime;
            if (particle.life <= 0) {
                particle.life = particle.maxLife;
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
            }

            // Update opacity based on life
            particle.opacity = (particle.life / particle.maxLife) * 0.8 + 0.2;
        });
    }

    updateAurora(deltaTime) {
        this.aurora.phase += deltaTime * 0.001;
        if (this.aurora.phase > Math.PI * 2) {
            this.aurora.phase = 0;
        }
    }

    updateSacredGeometry(deltaTime) {
        if (this.sacredGeometry.enabled) {
            this.sacredGeometry.rotation += deltaTime * 0.0005;
            if (this.sacredGeometry.rotation > Math.PI * 2) {
                this.sacredGeometry.rotation = 0;
            }
        }
    }

    doRender(deltaTime) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw cosmic gradient background
        this.drawCosmicBackground();

        // Draw sacred geometry
        if (this.sacredGeometry.enabled) {
            this.drawSacredGeometry();
        }

        // Draw aurora effects
        this.drawAurora();

        // Draw particles
        this.drawParticles();
    }

    drawCosmicBackground() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );

        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.3, '#1a1a2e');
        gradient.addColorStop(0.6, '#16213e');
        gradient.addColorStop(1, '#0f0f23');

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSacredGeometry() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.3;

        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.sacredGeometry.rotation);

        // Draw flower of life pattern
        this.drawFlowerOfLife(radius);

        this.ctx.restore();
    }

    drawFlowerOfLife(radius) {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();

        // Draw central circle
        this.ctx.arc(0, 0, radius * 0.2, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw surrounding circles
        const circleCount = 6;
        for (let i = 0; i < circleCount; i++) {
            const angle = (i / circleCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius * 0.4;
            const y = Math.sin(angle) * radius * 0.4;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
            this.ctx.stroke();
        }

        // Draw connecting lines
        this.ctx.beginPath();
        for (let i = 0; i < circleCount; i++) {
            const angle = (i / circleCount) * Math.PI * 2;
            const x = Math.cos(angle) * radius * 0.4;
            const y = Math.sin(angle) * radius * 0.4;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    drawAurora() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const waveHeight = 50;
        const waveLength = 200;

        this.ctx.save();
        this.ctx.globalAlpha = this.aurora.intensity * 0.3;

        // Draw multiple aurora waves
        for (let wave = 0; wave < 3; wave++) {
            const offset = wave * Math.PI / 3;
            const color = this.aurora.colors[wave % this.aurora.colors.length];
            
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();

            for (let x = 0; x < this.canvas.width; x += 5) {
                const y = centerY + Math.sin((x / waveLength) * Math.PI * 2 + this.aurora.phase + offset) * waveHeight;
                
                if (x === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }

            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    drawParticles() {
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    resize(width, height) {
        super.resize(width, height);
        
        // Reinitialize particles for new canvas size
        this.initializeParticles();
        
        console.log('🌌 BackgroundLayer: Resized to', width, 'x', height);
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        super.destroy();
        console.log('🌌 BackgroundLayer: Destroyed');
    }

    // Public methods for external control
    setAuroraIntensity(intensity) {
        this.aurora.intensity = Math.max(0, Math.min(1, intensity));
    }

    setParticleCount(count) {
        this.particleCount = Math.max(0, Math.min(500, count));
        this.initializeParticles();
    }

    toggleSacredGeometry() {
        this.sacredGeometry.enabled = !this.sacredGeometry.enabled;
    }

    setSacredGeometryPattern(pattern) {
        if (this.sacredGeometry.patterns.includes(pattern)) {
            this.sacredGeometry.currentPattern = pattern;
        }
    }
}

// Make globally available
window.BackgroundLayer = BackgroundLayer;
