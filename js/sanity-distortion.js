/**
 * Sanity Distortion System
 * Creates visual effects based on player sanity levels
 */

class SanityDistortion {
    constructor() {
        this.distortionLayer = null;
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.currentSanity = 100;
        this.distortionEffects = {
            blur: 0,
            noise: 0,
            chromaticAberration: 0,
            vignette: 0,
            shake: 0,
            ghostlyShadows: 0,
            colorShift: 0,
            slime: 0,
            particles: 0,
            hallucinations: 0,
            screenWarp: 0,
            glitch: 0,
            bloodDrips: 0,
            eyes: 0
        };
        this.ghostlyShadows = [];
        this.slimeDrops = [];
        this.particles = [];
        this.hallucinations = [];
        this.bloodDrips = [];
        this.eyes = [];
        this.timerInterval = null;
        this.timerDuration = 30000; // 30 seconds
        this.timerStartTime = Date.now();
        this.timerDisplayInterval = null;
        this.init();
    }

    init() {
        this.createDistortionLayer();
        this.startAnimation();
        this.startTimer();
        this.startTimerDisplay();
        this.setupMouseTracking();
        console.log('ðŸ§  Sanity distortion system initialized');
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            window.mouseX = e.clientX;
            window.mouseY = e.clientY;
        });
    }

    createDistortionLayer() {
        // Create the distortion overlay
        this.distortionLayer = document.createElement('div');
        this.distortionLayer.id = 'sanity-distortion-layer';
        this.distortionLayer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 5000;
            mix-blend-mode: overlay;
        `;

        // Create canvas for effects
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.distortionLayer.appendChild(this.canvas);
        
        document.body.appendChild(this.distortionLayer);
        
        // Resize canvas
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
    }

    updateSanity(sanity) {
        this.currentSanity = Math.max(0, Math.min(100, sanity));
        this.calculateDistortionEffects();
        this.updateCanvasOpacity();
        
        // If sanity is very low, trigger immediate distortion effects
        if (sanity < 30) {
            this.triggerDistortionEffects();
        }
    }
    
    // Method to manually trigger distortion effects
    triggerManualDistortion() {
        console.log('ðŸ§  Manual distortion triggered');
        this.triggerDistortionEffects();
    }
    
    // Method to make canvas visible for testing
    makeCanvasVisible() {
        if (this.canvas) {
            this.canvas.style.opacity = '1';
            console.log('ðŸ§  Canvas made visible for testing');
        }
    }
    
    // Check if any distortion effects are currently active
    hasActiveEffects() {
        return Object.values(this.distortionEffects).some(effect => effect > 0) || 
               this.ghostlyShadows.length > 0 || 
               this.slimeDrops.length > 0 || 
               this.particles.length > 0 || 
               this.hallucinations.length > 0 || 
               this.bloodDrips.length > 0 || 
               this.eyes.length > 0;
    }

    calculateDistortionEffects() {
        const sanityPercent = this.currentSanity / 100;
        const distortionLevel = 1 - sanityPercent;

        // Calculate individual effects based on sanity level - MUCH MORE DRAMATIC
        this.distortionEffects.blur = distortionLevel * 25; // 0-25px blur
        this.distortionEffects.noise = distortionLevel * 0.8; // 0-80% noise
        this.distortionEffects.chromaticAberration = distortionLevel * 15; // 0-15px CA
        this.distortionEffects.vignette = distortionLevel * 1.2; // 0-120% vignette
        this.distortionEffects.shake = distortionLevel * 15; // 0-15px shake
        this.distortionEffects.ghostlyShadows = distortionLevel * 1.0; // 0-100% ghost opacity
        this.distortionEffects.colorShift = distortionLevel * 0.8; // 0-80% color shift
        this.distortionEffects.slime = distortionLevel * 1.0; // 0-100% slime
        this.distortionEffects.particles = distortionLevel * 1.0; // 0-100% particles
        this.distortionEffects.hallucinations = distortionLevel * 1.0; // 0-100% hallucinations
        this.distortionEffects.screenWarp = distortionLevel * 0.6; // 0-60% screen warp
        this.distortionEffects.glitch = distortionLevel * 0.8; // 0-80% glitch
        this.distortionEffects.bloodDrips = distortionLevel * 0.7; // 0-70% blood drips
        this.distortionEffects.eyes = distortionLevel * 0.9; // 0-90% eyes

        // Generate various effects at low sanity
        if (this.currentSanity < 30 && Math.random() < 0.1) {
            this.addGhostlyShadow();
        }
        
        if (this.currentSanity < 50 && Math.random() < 0.05) {
            this.addSlimeDrop();
        }
        
        if (this.currentSanity < 40 && Math.random() < 0.08) {
            this.addParticle();
        }
        
        if (this.currentSanity < 25 && Math.random() < 0.03) {
            this.addHallucination();
        }
        
        if (this.currentSanity < 20 && Math.random() < 0.05) {
            this.addBloodDrip();
        }
        
        if (this.currentSanity < 15 && Math.random() < 0.02) {
            this.addEye();
        }
    }

    updateCanvasOpacity() {
        if (this.canvas) {
            const opacity = this.currentSanity < 100 ? 0.3 + (1 - this.currentSanity / 100) * 0.7 : 0;
            this.canvas.style.opacity = opacity;
        }
    }

    addGhostlyShadow() {
        const shadow = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 100 + 50,
            opacity: Math.random() * 0.3 + 0.1,
            speed: Math.random() * 2 + 0.5,
            direction: Math.random() * Math.PI * 2,
            life: 100
        };
        this.ghostlyShadows.push(shadow);
        
        // Limit number of shadows
        if (this.ghostlyShadows.length > 5) {
            this.ghostlyShadows.shift();
        }
    }

    addSlimeDrop() {
        const slime = {
            x: Math.random() * window.innerWidth,
            y: -20,
            size: Math.random() * 30 + 10,
            speed: Math.random() * 3 + 1,
            life: 200,
            color: `hsl(${Math.random() * 60 + 80}, 70%, 50%)` // Green to yellow slime
        };
        this.slimeDrops.push(slime);
        
        if (this.slimeDrops.length > 8) {
            this.slimeDrops.shift();
        }
    }

    addParticle() {
        const particle = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 8 + 2,
            speed: Math.random() * 4 + 1,
            direction: Math.random() * Math.PI * 2,
            life: 150,
            color: `hsl(${Math.random() * 360}, 100%, 60%)`,
            type: Math.random() > 0.5 ? 'circle' : 'square'
        };
        this.particles.push(particle);
        
        if (this.particles.length > 20) {
            this.particles.shift();
        }
    }

    addHallucination() {
        const hallucination = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 100 + 50,
            life: 300,
            type: ['spiral', 'wave', 'fractal'][Math.floor(Math.random() * 3)],
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            rotation: 0
        };
        this.hallucinations.push(hallucination);
        
        if (this.hallucinations.length > 3) {
            this.hallucinations.shift();
        }
    }

    addBloodDrip() {
        const drip = {
            x: Math.random() * window.innerWidth,
            y: -10,
            width: Math.random() * 3 + 1,
            length: Math.random() * 50 + 20,
            speed: Math.random() * 2 + 0.5,
            life: 200
        };
        this.bloodDrips.push(drip);
        
        if (this.bloodDrips.length > 5) {
            this.bloodDrips.shift();
        }
    }

    addEye() {
        const eye = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 40 + 20,
            life: 400,
            blinkTimer: 0,
            pupilX: 0,
            pupilY: 0
        };
        this.eyes.push(eye);
        
        if (this.eyes.length > 2) {
            this.eyes.shift();
        }
    }

    startAnimation() {
        const animate = () => {
            this.draw();
            this.animationId = requestAnimationFrame(animate);
        };
        animate();
    }

    draw() {
        if (!this.ctx) return;
        
        // Only skip drawing if sanity is 100 AND no effects are active
        if (this.currentSanity >= 100 && !this.hasActiveEffects()) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Apply CSS filters
        const filters = [];
        if (this.distortionEffects.blur > 0) {
            filters.push(`blur(${this.distortionEffects.blur}px)`);
        }
        if (this.distortionEffects.chromaticAberration > 0) {
            // Chromatic aberration effect
            this.drawChromaticAberration();
        }
        if (this.distortionEffects.vignette > 0) {
            this.drawVignette();
        }
        if (this.distortionEffects.noise > 0) {
            this.drawNoise();
        }
        if (this.distortionEffects.shake > 0) {
            this.drawShake();
        }
        if (this.distortionEffects.ghostlyShadows > 0) {
            this.drawGhostlyShadows();
        }
        if (this.distortionEffects.colorShift > 0) {
            this.drawColorShift();
        }
        if (this.distortionEffects.slime > 0) {
            this.drawSlimeDrops();
        }
        if (this.distortionEffects.particles > 0) {
            this.drawParticles();
        }
        if (this.distortionEffects.hallucinations > 0) {
            this.drawHallucinations();
        }
        if (this.distortionEffects.screenWarp > 0) {
            this.drawScreenWarp();
        }
        if (this.distortionEffects.glitch > 0) {
            this.drawGlitch();
        }
        if (this.distortionEffects.bloodDrips > 0) {
            this.drawBloodDrips();
        }
        if (this.distortionEffects.eyes > 0) {
            this.drawEyes();
        }

        // Apply filters to canvas
        if (filters.length > 0) {
            this.canvas.style.filter = filters.join(' ');
        }
    }

    drawChromaticAberration() {
        // Red channel offset
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = `rgba(255, 0, 0, ${this.distortionEffects.chromaticAberration * 0.1})`;
        this.ctx.fillRect(this.distortionEffects.chromaticAberration, 0, this.canvas.width, this.canvas.height);
        
        // Blue channel offset
        this.ctx.fillStyle = `rgba(0, 0, 255, ${this.distortionEffects.chromaticAberration * 0.1})`;
        this.ctx.fillRect(-this.distortionEffects.chromaticAberration, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    drawVignette() {
        const gradient = this.ctx.createRadialGradient(
            this.canvas.width / 2, this.canvas.height / 2, 0,
            this.canvas.width / 2, this.canvas.height / 2, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, `rgba(0, 0, 0, ${this.distortionEffects.vignette})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawNoise() {
        const imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * this.distortionEffects.noise * 255;
            data[i] = noise;     // Red
            data[i + 1] = noise; // Green
            data[i + 2] = noise; // Blue
            data[i + 3] = 128;   // Alpha
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }

    drawShake() {
        const shakeX = (Math.random() - 0.5) * this.distortionEffects.shake;
        const shakeY = (Math.random() - 0.5) * this.distortionEffects.shake;
        
        this.canvas.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
    }

    drawGhostlyShadows() {
        this.ghostlyShadows.forEach((shadow, index) => {
            shadow.life--;
            shadow.x += Math.cos(shadow.direction) * shadow.speed;
            shadow.y += Math.sin(shadow.direction) * shadow.speed;
            
            if (shadow.life <= 0) {
                this.ghostlyShadows.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = shadow.opacity * (shadow.life / 100);
            this.ctx.fillStyle = `rgba(100, 100, 255, 0.3)`;
            this.ctx.beginPath();
            this.ctx.arc(shadow.x, shadow.y, shadow.size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawColorShift() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'overlay';
        this.ctx.fillStyle = `rgba(255, 0, 255, ${this.distortionEffects.colorShift * 0.2})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }

    // Scream effect when sanity drops significantly
    playScreamEffect() {
        // Create scream notification
        const scream = document.createElement('div');
        scream.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 48px;
            color: #ff0000;
            text-shadow: 0 0 20px #ff0000;
            z-index: 10000;
            pointer-events: none;
            animation: screamPulse 0.5s ease-out;
        `;
        scream.textContent = 'ðŸ’€ SCREAM! ðŸ’€';
        
        document.body.appendChild(scream);
        
        // Add scream animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes screamPulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            scream.remove();
            style.remove();
        }, 1000);
    }

    startTimer() {
        console.log('ðŸ§  Starting 30-second distortion timer');
        this.timerStartTime = Date.now();
        this.timerInterval = setInterval(() => {
            this.triggerDistortionEffects();
            this.timerStartTime = Date.now(); // Reset timer after triggering
        }, this.timerDuration);
    }
    
    startTimerDisplay() {
        console.log('ðŸ§  Starting distortion timer display');
        this.timerDisplayInterval = setInterval(() => {
            this.updateTimerDisplay();
        }, 1000); // Update every second
    }
    
    updateTimerDisplay() {
        const timerElement = document.getElementById('distortion-timer');
        if (timerElement) {
            const elapsed = Date.now() - this.timerStartTime;
            const remaining = Math.max(0, this.timerDuration - elapsed);
            const seconds = Math.ceil(remaining / 1000);
            timerElement.textContent = `${seconds}s`;
            
            // Change color based on remaining time
            if (seconds <= 5) {
                timerElement.style.color = '#ff6b6b';
            } else if (seconds <= 10) {
                timerElement.style.color = '#ffa726';
            } else {
                timerElement.style.color = '#66bb6a';
            }
        }
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            console.log('ðŸ§  Distortion timer stopped');
        }
        if (this.timerDisplayInterval) {
            clearInterval(this.timerDisplayInterval);
            this.timerDisplayInterval = null;
            console.log('ðŸ§  Distortion timer display stopped');
        }
    }
    
    triggerDistortionEffects() {
        console.log('ðŸ§  Timer triggered - applying random distortion effects');
        
        // Get current sanity from encounter system if available
        if (window.encounterSystem && window.encounterSystem.playerStats) {
            this.currentSanity = window.encounterSystem.playerStats.sanity;
        }
        
        // Apply random distortion effects based on current sanity
        const sanityPercent = this.currentSanity / 100;
        
        // Randomly trigger different effects
        const effects = ['blur', 'noise', 'chromaticAberration', 'vignette', 'shake', 'ghostlyShadows', 'colorShift', 'screenWarp', 'glitch', 'particles', 'cosmicEffects'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        // Apply the random effect with intensity based on sanity
        const intensity = Math.random() * (1 - sanityPercent) * 0.8 + 0.2; // Min 20%, Max 100% intensity
        
        switch (randomEffect) {
            case 'blur':
                this.distortionEffects.blur = intensity;
                break;
            case 'noise':
                this.distortionEffects.noise = intensity;
                break;
            case 'chromaticAberration':
                this.distortionEffects.chromaticAberration = intensity;
                break;
            case 'vignette':
                this.distortionEffects.vignette = intensity;
                break;
            case 'shake':
                this.distortionEffects.shake = intensity;
                break;
            case 'ghostlyShadows':
                this.distortionEffects.ghostlyShadows = intensity;
                this.addRandomGhostlyShadow();
                break;
            case 'colorShift':
                this.distortionEffects.colorShift = intensity;
                break;
            case 'screenWarp':
                this.distortionEffects.screenWarp = intensity;
                break;
            case 'glitch':
                this.distortionEffects.glitch = intensity;
                break;
            case 'particles':
                this.distortionEffects.particles = intensity;
                this.addRandomParticles();
                break;
            case 'cosmicEffects':
                this.triggerCosmicEffects(intensity);
                break;
        }
        
        // Gradually fade out the effect over 10 seconds
        setTimeout(() => {
            this.distortionEffects[randomEffect] = 0;
        }, 10000);
        
        // Show a subtle notification only for strong effects (intensity > 0.6)
        if (intensity > 0.6 && window.gruesomeNotifications) {
            const messages = [
                "The walls between dimensions grow thin...",
                "Reality flickers like a dying candle...",
                "Something watches from the shadows...",
                "The cosmic winds whisper secrets...",
                "Time itself seems to stutter...",
                "The fabric of space trembles...",
                "Ancient voices echo in your mind...",
                "The universe holds its breath..."
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            window.gruesomeNotifications.showSanityLoss(0, randomMessage);
        }
    }
    
    addRandomGhostlyShadow() {
        const shadow = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 100 + 50,
            opacity: Math.random() * 0.3 + 0.1,
            speed: Math.random() * 2 + 1,
            direction: Math.random() * Math.PI * 2
        };
        this.ghostlyShadows.push(shadow);
    }

    addRandomParticles() {
        // Add 5-15 random particles
        const particleCount = 5 + Math.floor(Math.random() * 10);
        for (let i = 0; i < particleCount; i++) {
            const particle = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: 2 + Math.random() * 6,
                opacity: 0.3 + Math.random() * 0.7,
                life: 1.0,
                color: `hsl(${Math.random() * 360}, 70%, 50%)`
            };
            this.particles.push(particle);
        }
    }

    triggerCosmicEffects(intensity) {
        // Trigger cosmic effects if available
        if (window.cosmicEffects) {
            console.log('Œ Triggering cosmic effects with intensity:', intensity);
            // Create energy wave
            if (window.cosmicEffects.createEnergyWave) {
                window.cosmicEffects.createEnergyWave(intensity);
            }
            // Increase particle activity
            if (window.cosmicEffects.setParticleIntensity) {
                window.cosmicEffects.setParticleIntensity(intensity);
            }
        }
    }

    addRandomSlimeDrop() {
        this.addSlimeDrop();
    }

    addRandomParticle() {
        this.addParticle();
    }

    addRandomHallucination() {
        this.addHallucination();
    }

    addRandomBloodDrip() {
        this.addBloodDrip();
    }

    addRandomEye() {
        this.addEye();
    }

    drawSlimeDrops() {
        this.slimeDrops.forEach((slime, index) => {
            slime.y += slime.speed;
            slime.life--;
            
            if (slime.life <= 0 || slime.y > window.innerHeight) {
                this.slimeDrops.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.slime * 0.8;
            this.ctx.fillStyle = slime.color;
            this.ctx.beginPath();
            this.ctx.arc(slime.x, slime.y, slime.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Add slime trail
            this.ctx.globalAlpha = this.distortionEffects.slime * 0.3;
            this.ctx.beginPath();
            this.ctx.arc(slime.x, slime.y - slime.size, slime.size * 0.7, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            particle.x += Math.cos(particle.direction) * particle.speed;
            particle.y += Math.sin(particle.direction) * particle.speed;
            particle.life--;
            
            if (particle.life <= 0 || particle.x < 0 || particle.x > window.innerWidth || 
                particle.y < 0 || particle.y > window.innerHeight) {
                this.particles.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.particles * 0.9;
            this.ctx.fillStyle = particle.color;
            
            if (particle.type === 'circle') {
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                this.ctx.fill();
            } else {
                this.ctx.fillRect(particle.x - particle.size/2, particle.y - particle.size/2, particle.size, particle.size);
            }
            this.ctx.restore();
        });
    }

    drawHallucinations() {
        this.hallucinations.forEach((hall, index) => {
            hall.life--;
            hall.rotation += 0.02;
            
            if (hall.life <= 0) {
                this.hallucinations.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.hallucinations * 0.7;
            this.ctx.fillStyle = hall.color;
            this.ctx.translate(hall.x, hall.y);
            this.ctx.rotate(hall.rotation);
            
            if (hall.type === 'spiral') {
                this.drawSpiral(hall.size);
            } else if (hall.type === 'wave') {
                this.drawWave(hall.size);
            } else if (hall.type === 'fractal') {
                this.drawFractal(hall.size);
            }
            
            this.ctx.restore();
        });
    }

    drawSpiral(size) {
        this.ctx.beginPath();
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.1;
            const radius = i * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    drawWave(size) {
        this.ctx.beginPath();
        for (let x = -size/2; x < size/2; x += 2) {
            const y = Math.sin(x * 0.1) * 20;
            if (x === -size/2) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    drawFractal(size) {
        this.ctx.beginPath();
        for (let i = 0; i < 50; i++) {
            const angle = i * 0.2;
            const radius = size * Math.sin(angle * 3) * 0.5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
    }

    drawScreenWarp() {
        this.ctx.save();
        this.ctx.globalAlpha = this.distortionEffects.screenWarp * 0.3;
        this.ctx.fillStyle = 'rgba(255, 0, 255, 0.1)';
        
        // Create wave distortion
        for (let y = 0; y < this.canvas.height; y += 20) {
            const wave = Math.sin(y * 0.01 + Date.now() * 0.001) * this.distortionEffects.screenWarp * 10;
            this.ctx.fillRect(wave, y, this.canvas.width, 20);
        }
        this.ctx.restore();
    }

    drawGlitch() {
        if (Math.random() < this.distortionEffects.glitch * 0.1) {
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.glitch * 0.8;
            this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const width = Math.random() * 50 + 10;
            const height = Math.random() * 20 + 5;
            this.ctx.fillRect(x, y, width, height);
            this.ctx.restore();
        }
    }

    drawBloodDrips() {
        this.bloodDrips.forEach((drip, index) => {
            drip.y += drip.speed;
            drip.life--;
            
            if (drip.life <= 0 || drip.y > window.innerHeight) {
                this.bloodDrips.splice(index, 1);
                return;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.bloodDrips * 0.9;
            this.ctx.fillStyle = '#8B0000';
            this.ctx.fillRect(drip.x, drip.y, drip.width, drip.length);
            this.ctx.restore();
        });
    }

    drawEyes() {
        this.eyes.forEach((eye, index) => {
            eye.life--;
            eye.blinkTimer++;
            
            if (eye.life <= 0) {
                this.eyes.splice(index, 1);
                return;
            }
            
            // Make pupil follow mouse
            const mouseX = window.mouseX || eye.x;
            const mouseY = window.mouseY || eye.y;
            const dx = mouseX - eye.x;
            const dy = mouseY - eye.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = eye.size * 0.3;
            
            if (distance > maxDistance) {
                eye.pupilX = (dx / distance) * maxDistance;
                eye.pupilY = (dy / distance) * maxDistance;
            } else {
                eye.pupilX = dx;
                eye.pupilY = dy;
            }
            
            this.ctx.save();
            this.ctx.globalAlpha = this.distortionEffects.eyes * 0.8;
            
            // Draw eye
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(eye.x, eye.y, eye.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Draw pupil
            const isBlinking = eye.blinkTimer % 60 < 5; // Blink every 60 frames for 5 frames
            if (!isBlinking) {
                this.ctx.fillStyle = 'black';
                this.ctx.beginPath();
                this.ctx.arc(eye.x + eye.pupilX, eye.y + eye.pupilY, eye.size * 0.3, 0, Math.PI * 2);
                this.ctx.fill();
            }
            
            this.ctx.restore();
        });
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        if (this.timerDisplayInterval) {
            clearInterval(this.timerDisplayInterval);
        }
        if (this.distortionLayer) {
            this.distortionLayer.remove();
        }
    }
}

// Make globally available
window.SanityDistortion = SanityDistortion;


