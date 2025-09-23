class DistortionEffectsCanvasLayer {
    constructor(mapEngine) {
        this.mapEngine = mapEngine;
        this.canvas = null;
        this.ctx = null;
        this.effects = []; // Array of active effects
        this.isVisible = true;
        this.opacity = 0.8;
        this.animationFrame = null;
        this.lastRenderTime = 0;
        this.maxEffects = 50; // Limit number of effects for performance
        this.effectDuration = 15000; // Effects last 15 seconds
        
        // Effect types and their properties
        this.effectTypes = {
            drippingBlood: {
                name: 'Dripping Blood',
                emoji: '🩸',
                color: '#8B0000',
                particles: 20,
                speed: 0.5,
                gravity: 0.02,
                size: 3
            },
            ghost: {
                name: 'Ghost',
                emoji: '👻',
                color: '#E6E6FA',
                particles: 15,
                speed: 0.3,
                float: 0.01,
                size: 8
            },
            cosmicDistortion: {
                name: 'Cosmic Distortion',
                emoji: '🌀',
                color: '#FF1493',
                particles: 25,
                speed: 0.4,
                spiral: 0.05,
                size: 6
            },
            shadowTendrils: {
                name: 'Shadow Tendrils',
                emoji: '🕷️',
                color: '#2F2F2F',
                particles: 30,
                speed: 0.2,
                wave: 0.03,
                size: 4
            },
            eldritchEyes: {
                name: 'Eldritch Eyes',
                emoji: '👁️',
                color: '#FFD700',
                particles: 10,
                speed: 0.1,
                blink: 0.02,
                size: 12
            },
            realisticSmoke: {
                name: 'Realistic Smoke',
                emoji: '💨',
                color: '#808080',
                particles: 50,
                speed: 0.8,
                turbulence: 0.15,
                size: 8,
                opacity: 0.6,
                wind: 0.02
            },
            waterRipple: {
                name: 'Water Ripple',
                emoji: '💧',
                color: '#4169E1',
                particles: 30,
                speed: 0.3,
                ripple: 0.1,
                size: 6,
                opacity: 0.7,
                wave: 0.05
            },
            fireSmoke: {
                name: 'Fire Smoke',
                emoji: '🔥',
                color: '#FF4500',
                particles: 40,
                speed: 1.2,
                turbulence: 0.2,
                size: 10,
                opacity: 0.8,
                heat: 0.03
            },
            mistyFog: {
                name: 'Misty Fog',
                emoji: '🌫️',
                color: '#F0F8FF',
                particles: 60,
                speed: 0.4,
                drift: 0.08,
                size: 12,
                opacity: 0.4,
                spread: 0.1
            }
        };
        
        this.init();
    }
    
    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'distortion-effects-canvas-layer';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
        this.canvas.style.zIndex = '1000'; // Above flag layer but below UI
        this.canvas.style.opacity = this.opacity;
        this.canvas.style.transition = 'opacity 0.5s ease-in-out';
        
        // Check if map engine and map are available
        if (this.mapEngine && this.mapEngine.map && this.mapEngine.map.getPane) {
            this.mapEngine.map.getPane('overlayPane').appendChild(this.canvas);
        } else {
            console.warn('🌀 Map engine not available, skipping distortion effects initialization');
            return;
        }
        this.ctx = this.canvas.getContext('2d');
        
        this.mapEngine.map.on('moveend zoomend resize', this.updateCanvasPositionAndSize.bind(this));
        this.updateCanvasPositionAndSize();
        this.startAnimationLoop();
        console.log('🌀 DistortionEffectsCanvasLayer initialized and added to map.');
    }
    
    updateCanvasPositionAndSize() {
        if (!this.canvas || !this.mapEngine.map) return;
        
        const container = this.mapEngine.map.getContainer();
        const rect = container.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        console.log('🌀 Canvas resized to:', rect.width, 'x', rect.height);
    }
    
    startAnimationLoop() {
        const animate = (timestamp) => {
            if (timestamp - this.lastRenderTime > 16) { // ~60 FPS
                this.render();
                this.lastRenderTime = timestamp;
            }
            this.animationFrame = requestAnimationFrame(animate);
        };
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    addEffect(effectType, lat, lng, intensity = 1.0) {
        if (!this.effectTypes[effectType]) {
            console.warn('🌀 Unknown effect type:', effectType);
            return;
        }
        
        const effectConfig = this.effectTypes[effectType];
        const effect = {
            type: effectType,
            lat: lat,
            lng: lng,
            intensity: intensity,
            particles: [],
            startTime: Date.now(),
            duration: this.effectDuration * intensity,
            config: effectConfig
        };
        
        // Create particles for this effect
        for (let i = 0; i < effectConfig.particles * intensity; i++) {
            effect.particles.push(this.createParticle(effectConfig, lat, lng));
        }
        
        this.effects.push(effect);
        
        // Keep only the latest effects for performance
        if (this.effects.length > this.maxEffects) {
            this.effects.splice(0, this.effects.length - this.maxEffects / 2);
        }
        
        console.log('🌀 Added effect:', effectType, 'at', lat, lng, 'intensity:', intensity);
        this.render(); // Render immediately
    }
    
    createParticle(effectConfig, lat, lng) {
        const point = this.mapEngine.map.latLngToContainerPoint([lat, lng]);
        return {
            x: point.x + (Math.random() - 0.5) * 100, // Random offset
            y: point.y + (Math.random() - 0.5) * 100,
            vx: (Math.random() - 0.5) * effectConfig.speed * 2,
            vy: (Math.random() - 0.5) * effectConfig.speed * 2,
            size: effectConfig.size + Math.random() * effectConfig.size,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.1,
            opacity: 0.8 + Math.random() * 0.2,
            phase: Math.random() * Math.PI * 2
        };
    }
    
    render() {
        if (!this.ctx || !this.isVisible) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const now = Date.now();
        
        // Filter out expired effects and update particles
        this.effects = this.effects.filter(effect => {
            const age = now - effect.startTime;
            if (age > effect.duration) {
                return false; // Remove expired effect
            }
            
            // Update particles
            effect.particles.forEach(particle => {
                this.updateParticle(particle, effect, age);
            });
            
            return true;
        });
        
        // Render all effects
        this.effects.forEach(effect => {
            this.renderEffect(effect);
        });
    }
    
    updateParticle(particle, effect, age) {
        const config = effect.config;
        const progress = age / effect.duration;
        
        // Update position based on effect type
        switch (effect.type) {
            case 'drippingBlood':
                particle.vy += config.gravity;
                particle.x += particle.vx;
                particle.y += particle.vy;
                break;
                
            case 'ghost':
                particle.x += particle.vx;
                particle.y += particle.vy + Math.sin(particle.phase + age * config.float) * 2;
                particle.phase += 0.02;
                break;
                
            case 'cosmicDistortion':
                const angle = particle.phase + age * config.spiral;
                particle.x += Math.cos(angle) * config.speed;
                particle.y += Math.sin(angle) * config.speed;
                particle.phase += 0.01;
                break;
                
            case 'shadowTendrils':
                particle.x += particle.vx + Math.sin(particle.phase + age * config.wave) * 1;
                particle.y += particle.vy + Math.cos(particle.phase + age * config.wave) * 1;
                particle.phase += 0.015;
                break;
                
            case 'eldritchEyes':
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.rotation += particle.rotationSpeed;
                break;
        }
        
        // Update rotation
        particle.rotation += particle.rotationSpeed;
        
        // Fade out over time
        particle.opacity = Math.max(0, 0.8 - progress * 0.8);
    }
    
    renderEffect(effect) {
        const config = effect.config;
        
        effect.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.globalAlpha = particle.opacity * this.opacity;
            
            switch (effect.type) {
                case 'drippingBlood':
                    this.renderBloodDrop(particle, config);
                    break;
                case 'ghost':
                    this.renderGhost(particle, config);
                    break;
                case 'cosmicDistortion':
                    this.renderCosmicDistortion(particle, config);
                    break;
                case 'shadowTendrils':
                    this.renderShadowTendril(particle, config);
                    break;
                case 'eldritchEyes':
                    this.renderEldritchEye(particle, config);
                    break;
                case 'realisticSmoke':
                    this.renderRealisticSmoke(particle, config);
                    break;
                case 'waterRipple':
                    this.renderWaterRipple(particle, config);
                    break;
                case 'fireSmoke':
                    this.renderFireSmoke(particle, config);
                    break;
                case 'mistyFog':
                    this.renderMistyFog(particle, config);
                    break;
            }
            
            this.ctx.restore();
        });
    }
    
    renderBloodDrop(particle, config) {
        const ctx = this.ctx;
        const size = particle.size;
        
        // Blood drop shape
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 1.5, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Add some shine
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.ellipse(-size * 0.3, -size * 0.3, size * 0.3, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderGhost(particle, config) {
        const ctx = this.ctx;
        const size = particle.size;
        
        // Ghost body
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Ghost eyes
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.arc(size * 0.3, -size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
        
        // Wavy bottom
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        for (let i = -size; i <= size; i += 2) {
            const y = Math.sin(i * 0.3 + particle.phase) * size * 0.3;
            ctx.lineTo(i, y);
        }
        ctx.lineTo(size, 0);
        ctx.closePath();
        ctx.fill();
    }
    
    renderCosmicDistortion(particle, config) {
        const ctx = this.ctx;
        const size = particle.size;
        
        // Spiral distortion
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = particle.phase + i * Math.PI * 2 / 3;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        
        // Center dot
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderShadowTendril(particle, config) {
        const ctx = this.ctx;
        const size = particle.size;
        
        // Wavy tendril
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i < 5; i++) {
            const x = i * size * 0.5;
            const y = Math.sin(i * 0.5 + particle.phase) * size * 0.3;
            ctx.lineTo(x, y);
        }
        ctx.stroke();
        
        // Tendril tip
        ctx.fillStyle = config.color;
        ctx.beginPath();
        ctx.arc(size * 2, Math.sin(4 * 0.5 + particle.phase) * size * 0.3, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
    }
    
    renderEldritchEye(particle, config) {
        const ctx = this.ctx;
        const size = particle.size;
        
        // Eye outer ring
        ctx.strokeStyle = config.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        
        // Eye pupil
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye highlight
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(-size * 0.2, -size * 0.2, size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyelid (blinking effect)
        const blink = Math.sin(particle.phase * 2) > 0.8 ? 1 : 0;
        if (blink) {
            ctx.fillStyle = config.color;
            ctx.beginPath();
            ctx.arc(0, 0, size, 0, Math.PI);
            ctx.fill();
        }
    }
    
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.canvas.style.opacity = this.isVisible ? this.opacity : 0;
        console.log('🌀 Distortion effects visibility toggled:', this.isVisible);
    }
    
    setOpacity(opacity) {
        this.opacity = Math.max(0, Math.min(1, opacity));
        this.canvas.style.opacity = this.opacity;
        console.log('🌀 Distortion effects opacity set to:', this.opacity);
    }
    
    clearEffects() {
        this.effects = [];
        this.render();
        console.log('🌀 All distortion effects cleared');
    }
    
    getEffectCount() {
        return this.effects.length;
    }
    
    getAvailableEffectTypes() {
        return Object.keys(this.effectTypes);
    }
    
    // Create test effects with all realistic types
    createTestRealisticEffects() {
        console.log('🌀 Creating test realistic effects...');
        const playerPos = this.mapEngine.getPlayerPosition();
        if (!playerPos) {
            console.log('🌀 No player position available for test effects');
            return;
        }
        
        // Create one of each realistic effect type around the player
        const realisticEffects = ['realisticSmoke', 'waterRipple', 'fireSmoke', 'mistyFog'];
        realisticEffects.forEach((effectType, index) => {
            const testLat = playerPos.lat + (index * 0.0001);
            const testLng = playerPos.lng + (index * 0.0001);
            this.addEffect(effectType, testLat, testLng, 0.8);
        });
        
        console.log('🌀 Test realistic effects created, total effects:', this.effects.length);
    }
    
    // Realistic Smoke Effect
    renderRealisticSmoke(particle, config) {
        const ctx = this.ctx;
        const size = particle.size * config.size;
        const opacity = particle.opacity * (config.opacity || 1);
        
        // Create gradient for realistic smoke
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `rgba(128, 128, 128, ${opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(160, 160, 160, ${opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(200, 200, 200, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.6, particle.rotation, 0, Math.PI * 2);
        ctx.fill();
        
        // Add turbulence detail
        ctx.strokeStyle = `rgba(100, 100, 100, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const angle = (particle.rotation + i * Math.PI * 2 / 3) * particle.turbulence;
            const x = Math.cos(angle) * size * 0.8;
            const y = Math.sin(angle) * size * 0.4;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
    
    // Water Ripple Effect
    renderWaterRipple(particle, config) {
        const ctx = this.ctx;
        const size = particle.size * config.size;
        const opacity = particle.opacity * (config.opacity || 1);
        
        // Create concentric ripples
        for (let i = 0; i < 3; i++) {
            const rippleSize = size * (1 + i * 0.3);
            const rippleOpacity = opacity * (1 - i * 0.3) * 0.6;
            
            ctx.strokeStyle = `rgba(65, 105, 225, ${rippleOpacity})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, rippleSize, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Center water drop
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size * 0.5);
        gradient.addColorStop(0, `rgba(65, 105, 225, ${opacity})`);
        gradient.addColorStop(1, `rgba(135, 206, 250, ${opacity * 0.3})`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Water highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * 0.8})`;
        ctx.beginPath();
        ctx.arc(-size * 0.2, -size * 0.2, size * 0.1, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Fire Smoke Effect
    renderFireSmoke(particle, config) {
        const ctx = this.ctx;
        const size = particle.size * config.size;
        const opacity = particle.opacity * (config.opacity || 1);
        
        // Fire base
        const fireGradient = ctx.createLinearGradient(0, size, 0, -size);
        fireGradient.addColorStop(0, `rgba(255, 69, 0, ${opacity})`);
        fireGradient.addColorStop(0.5, `rgba(255, 140, 0, ${opacity * 0.8})`);
        fireGradient.addColorStop(1, `rgba(255, 215, 0, ${opacity * 0.4})`);
        
        ctx.fillStyle = fireGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size * 0.8, size * 1.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Smoke above fire
        const smokeGradient = ctx.createRadialGradient(0, -size, 0, 0, -size, size * 2);
        smokeGradient.addColorStop(0, `rgba(105, 105, 105, ${opacity * 0.6})`);
        smokeGradient.addColorStop(0.5, `rgba(169, 169, 169, ${opacity * 0.3})`);
        smokeGradient.addColorStop(1, `rgba(211, 211, 211, 0)`);
        
        ctx.fillStyle = smokeGradient;
        ctx.beginPath();
        ctx.ellipse(0, -size * 0.5, size * 1.5, size * 0.8, particle.rotation * 0.5, 0, Math.PI * 2);
        ctx.fill();
    }
    
    // Misty Fog Effect
    renderMistyFog(particle, config) {
        const ctx = this.ctx;
        const size = particle.size * config.size;
        const opacity = particle.opacity * (config.opacity || 1);
        
        // Create soft, diffused fog
        const fogGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
        fogGradient.addColorStop(0, `rgba(240, 248, 255, ${opacity * 0.8})`);
        fogGradient.addColorStop(0.3, `rgba(248, 248, 255, ${opacity * 0.4})`);
        fogGradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.2})`);
        fogGradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
        
        ctx.fillStyle = fogGradient;
        ctx.beginPath();
        ctx.ellipse(0, 0, size, size * 0.7, particle.rotation * 0.3, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle movement lines
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < 2; i++) {
            const angle = particle.rotation + i * Math.PI;
            const x1 = Math.cos(angle) * size * 0.3;
            const y1 = Math.sin(angle) * size * 0.2;
            const x2 = Math.cos(angle) * size * 0.8;
            const y2 = Math.sin(angle) * size * 0.5;
            if (i === 0) ctx.moveTo(x1, y1);
            else ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
        }
        ctx.stroke();
    }
    
    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        console.log('🌀 DistortionEffectsCanvasLayer destroyed');
    }
}

// Make it globally available
window.DistortionEffectsCanvasLayer = DistortionEffectsCanvasLayer;
