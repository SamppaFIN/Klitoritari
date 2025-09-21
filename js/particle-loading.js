/**
 * Particle Loading Screen - Animated particle effects for map loading
 * Creates beautiful cosmic particle animations during game initialization
 */

class ParticleLoadingScreen {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        this.isActive = false;
        this.loadingSteps = [
            '🌌 Initializing cosmic effects...',
            '🗺️ Loading map engine...',
            '📍 Setting up geolocation...',
            '🎭 Preparing encounters...',
            '✨ Finalizing cosmic realm...'
        ];
        this.currentStep = 0;
        this.progress = 0;
    }

    init() {
        console.log('🌟 Initializing particle loading screen...');
        this.setupCanvas();
        this.createParticles();
        this.startAnimation();
        this.startLoadingSequence();
    }

    setupCanvas() {
        this.canvas = document.getElementById('particle-canvas');
        if (!this.canvas) {
            console.error('🌟 Particle canvas not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        
        // Handle window resize
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (!this.canvas) return;
        
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 10000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.8 + 0.2,
                color: this.getRandomColor(),
                life: Math.random() * 100 + 50,
                maxLife: Math.random() * 100 + 50
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#ffd700', '#ffed4e', '#87ceeb', '#4fc3f7',
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4',
            '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    startAnimation() {
        if (this.animationId) return;
        
        this.isActive = true;
        this.animate();
    }

    animate() {
        if (!this.isActive || !this.ctx || !this.canvas) return;

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw particles
        this.particles.forEach((particle, index) => {
            this.updateParticle(particle);
            this.drawParticle(particle);
            
            // Reset particle if it's off screen or dead
            if (particle.x < 0 || particle.x > this.canvas.width || 
                particle.y < 0 || particle.y > this.canvas.height || 
                particle.life <= 0) {
                this.resetParticle(particle);
            }
        });

        // Draw connections between nearby particles
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    updateParticle(particle) {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life--;
        
        // Add some floating motion
        particle.vy += Math.sin(Date.now() * 0.001 + particle.x * 0.01) * 0.01;
        particle.vx += Math.cos(Date.now() * 0.001 + particle.y * 0.01) * 0.01;
        
        // Fade out as life decreases
        particle.opacity = (particle.life / particle.maxLife) * 0.8 + 0.2;
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.fillStyle = particle.color;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = particle.color;
        
        // Draw particle as a glowing circle
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add inner glow
        this.ctx.globalAlpha = particle.opacity * 0.5;
        this.ctx.fillStyle = '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    drawConnections() {
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
                
                if (distance < 100) {
                    this.ctx.globalAlpha = (100 - distance) / 100 * 0.3;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.restore();
    }

    resetParticle(particle) {
        particle.x = Math.random() * this.canvas.width;
        particle.y = Math.random() * this.canvas.height;
        particle.vx = (Math.random() - 0.5) * 0.5;
        particle.vy = (Math.random() - 0.5) * 0.5;
        particle.life = particle.maxLife = Math.random() * 100 + 50;
        particle.opacity = Math.random() * 0.8 + 0.2;
        particle.color = this.getRandomColor();
    }

    startLoadingSequence() {
        console.log('🌟 Starting loading sequence...');
        
        // Show the loading screen
        this.show();
        
        // Start the loading steps immediately
        this.updateStep(0);
        this.updateProgress(0);
        this.updateStep(1);
        this.updateStep(2);
        this.updateStep(3);
        this.updateStep(4);
        
        // Complete loading immediately
        this.completeLoading();
    }

    updateStep(stepIndex) {
        if (stepIndex >= this.loadingSteps.length) return;
        
        // Mark previous step as completed
        if (stepIndex > 0) {
            const prevStep = document.getElementById(`step-${stepIndex}`);
            if (prevStep) {
                prevStep.classList.remove('active');
                prevStep.classList.add('completed');
            }
        }
        
        // Mark current step as active
        const currentStep = document.getElementById(`step-${stepIndex + 1}`);
        if (currentStep) {
            currentStep.classList.add('active');
        }
        
        // Update loading text
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = this.loadingSteps[stepIndex];
        }
        
        // Update progress
        const progress = ((stepIndex + 1) / this.loadingSteps.length) * 100;
        this.updateProgress(progress);
        
        this.currentStep = stepIndex;
    }

    updateProgress(percentage) {
        this.progress = percentage;
        const progressFill = document.getElementById('loading-progress');
        if (progressFill) {
            progressFill.style.width = `${percentage}%`;
        }
    }

    completeLoading() {
        console.log('🌟 Loading completed!');
        
        // Update final step
        this.updateStep(4);
        this.updateProgress(100);
        
        // Update loading text
        const loadingText = document.getElementById('loading-text');
        if (loadingText) {
            loadingText.textContent = '✨ Cosmic realm ready!';
        }
        
        // Hide loading screen immediately
        this.hide();
    }

    show() {
        const loadingScreen = document.getElementById('particle-loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.remove('hidden');
            this.isActive = true;
        }
    }

    hide() {
        const loadingScreen = document.getElementById('particle-loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            this.isActive = false;
            this.stopAnimation();
        }
    }

    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    destroy() {
        this.stopAnimation();
        this.isActive = false;
        this.particles = [];
    }
}

// Make it globally available
window.ParticleLoadingScreen = ParticleLoadingScreen;
