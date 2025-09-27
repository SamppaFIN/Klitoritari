/**
 * Discord-Style Effects System - Visual overlays and atmospheric effects
 * Provides particle effects, screen shakes, glows, and other visual feedback
 */

class DiscordEffectsSystem {
    constructor() {
        this.effectsContainer = null;
        this.activeEffects = new Set();
        this.effectQueue = [];
        this.isProcessingQueue = false;
        this.maxConcurrentEffects = 3; // Prevent overwhelming
        this.effectCooldowns = new Map();
        
        this.init();
    }

    init() {
        console.log('¨ Discord Effects System initialized');
        this.createEffectsContainer();
        this.setupEffectQueue();
    }

    createEffectsContainer() {
        this.effectsContainer = document.createElement('div');
        this.effectsContainer.id = 'discord-effects-container';
        this.effectsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10005;
            overflow: hidden;
        `;
        document.body.appendChild(this.effectsContainer);
    }

    setupEffectQueue() {
        // Process effect queue every 100ms
        setInterval(() => {
            this.processEffectQueue();
        }, 100);
    }

    processEffectQueue() {
        if (this.isProcessingQueue || this.effectQueue.length === 0) return;
        
        this.isProcessingQueue = true;
        
        while (this.effectQueue.length > 0 && this.activeEffects.size < this.maxConcurrentEffects) {
            const effect = this.effectQueue.shift();
            this.executeEffect(effect);
        }
        
        this.isProcessingQueue = false;
    }

    // Queue an effect to prevent overwhelming
    queueEffect(effectType, options = {}) {
        const effectId = `${effectType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Check cooldown
        const cooldownKey = effectType;
        const lastUsed = this.effectCooldowns.get(cooldownKey) || 0;
        const cooldown = options.cooldown || 1000; // 1 second default cooldown
        
        if (Date.now() - lastUsed < cooldown) {
            console.log(`¨ Effect ${effectType} on cooldown, skipping`);
            return;
        }
        
        this.effectCooldowns.set(cooldownKey, Date.now());
        this.effectQueue.push({ id: effectId, type: effectType, options });
    }

    executeEffect(effect) {
        this.activeEffects.add(effect.id);
        
        switch (effect.type) {
            case 'screenShake':
                this.createScreenShake(effect.options);
                break;
            case 'particleBurst':
                this.createParticleBurst(effect.options);
                break;
            case 'glowPulse':
                this.createGlowPulse(effect.options);
                break;
            case 'energyWave':
                this.createEnergyWave(effect.options);
                break;
            case 'cosmicRift':
                this.createCosmicRift(effect.options);
                break;
            case 'notificationPop':
                this.createNotificationPop(effect.options);
                break;
            case 'screenFlash':
                this.createScreenFlash(effect.options);
                break;
            case 'particleRain':
                this.createParticleRain(effect.options);
                break;
            default:
                console.warn('¨ Unknown effect type:', effect.type);
        }
        
        // Auto-cleanup after duration
        setTimeout(() => {
            this.activeEffects.delete(effect.id);
        }, effect.options.duration || 3000);
    }

    // Screen shake effect
    createScreenShake(options = {}) {
        const intensity = options.intensity || 10;
        const duration = options.duration || 500;
        const frequency = options.frequency || 20;
        
        const shakeElement = document.createElement('div');
        shakeElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10006;
            background: transparent;
        `;
        
        this.effectsContainer.appendChild(shakeElement);
        
        let startTime = Date.now();
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                shakeElement.remove();
                return;
            }
            
            const progress = elapsed / duration;
            const currentIntensity = intensity * (1 - progress);
            const x = (Math.random() - 0.5) * currentIntensity;
            const y = (Math.random() - 0.5) * currentIntensity;
            
            shakeElement.style.transform = `translate(${x}px, ${y}px)`;
            requestAnimationFrame(shake);
        };
        
        shake();
        
        // Audio feedback
        if (window.soundManager) {
            try { window.soundManager.playBling({ frequency: 200, duration: 0.1, type: 'sawtooth' }); } catch (e) {}
        }
    }

    // Particle burst effect
    createParticleBurst(options = {}) {
        const x = options.x || window.innerWidth / 2;
        const y = options.y || window.innerHeight / 2;
        const count = options.count || 20;
        const color = options.color || '#00ffff';
        const size = options.size || 4;
        const duration = options.duration || 2000;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 10007;
                box-shadow: 0 0 ${size * 2}px ${color};
            `;
            
            this.effectsContainer.appendChild(particle);
            
            // Animate particle
            const angle = (Math.PI * 2 * i) / count;
            const velocity = 50 + Math.random() * 100;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            let startTime = Date.now();
            const animate = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    particle.remove();
                    return;
                }
                
                const progress = elapsed / duration;
                const currentX = x + vx * progress;
                const currentY = y + vy * progress - (progress * progress * 200); // Gravity effect
                const currentOpacity = 1 - progress;
                const currentScale = 1 - progress * 0.5;
                
                particle.style.left = `${currentX}px`;
                particle.style.top = `${currentY}px`;
                particle.style.opacity = currentOpacity;
                particle.style.transform = `scale(${currentScale})`;
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    }

    // Glow pulse effect
    createGlowPulse(options = {}) {
        const x = options.x || window.innerWidth / 2;
        const y = options.y || window.innerHeight / 2;
        const color = options.color || '#ff00ff';
        const size = options.size || 100;
        const duration = options.duration || 1500;
        
        const glow = document.createElement('div');
        glow.style.cssText = `
            position: absolute;
            left: ${x - size/2}px;
            top: ${y - size/2}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, ${color}40, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10008;
        `;
        
        this.effectsContainer.appendChild(glow);
        
        // Animate glow
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                glow.remove();
                return;
            }
            
            const progress = elapsed / duration;
            const currentSize = size * (0.5 + 0.5 * Math.sin(progress * Math.PI * 4));
            const currentOpacity = 1 - progress;
            
            glow.style.width = `${currentSize}px`;
            glow.style.height = `${currentSize}px`;
            glow.style.left = `${x - currentSize/2}px`;
            glow.style.top = `${y - currentSize/2}px`;
            glow.style.opacity = currentOpacity;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Energy wave effect
    createEnergyWave(options = {}) {
        const x = options.x || window.innerWidth / 2;
        const y = options.y || window.innerHeight / 2;
        const color = options.color || '#00ffff';
        const duration = options.duration || 1000;
        
        const wave = document.createElement('div');
        wave.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            border: 2px solid ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10009;
            transform: translate(-50%, -50%);
        `;
        
        this.effectsContainer.appendChild(wave);
        
        // Animate wave
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                wave.remove();
                return;
            }
            
            const progress = elapsed / duration;
            const currentSize = progress * Math.max(window.innerWidth, window.innerHeight) * 2;
            const currentOpacity = 1 - progress;
            
            wave.style.width = `${currentSize}px`;
            wave.style.height = `${currentSize}px`;
            wave.style.opacity = currentOpacity;
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Cosmic rift effect
    createCosmicRift(options = {}) {
        const x = options.x || window.innerWidth / 2;
        const y = options.y || window.innerHeight / 2;
        const width = options.width || 200;
        const height = options.height || 400;
        const duration = options.duration || 3000;
        
        const rift = document.createElement('div');
        rift.style.cssText = `
            position: absolute;
            left: ${x - width/2}px;
            top: ${y - height/2}px;
            width: ${width}px;
            height: ${height}px;
            background: linear-gradient(90deg, 
                transparent 0%, 
                #ff00ff20 25%, 
                #00ffff40 50%, 
                #ff00ff20 75%, 
                transparent 100%
            );
            pointer-events: none;
            z-index: 10010;
            border-radius: 10px;
            animation: cosmicRiftPulse 0.5s ease-in-out infinite alternate;
        `;
        
        this.effectsContainer.appendChild(rift);
        
        // Add pulsing animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cosmicRiftPulse {
                0% { opacity: 0.3; transform: scale(0.9); }
                100% { opacity: 0.8; transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        setTimeout(() => {
            rift.remove();
            style.remove();
        }, duration);
    }

    // Notification pop effect
    createNotificationPop(options = {}) {
        const x = options.x || window.innerWidth - 200;
        const y = options.y || 100;
        const text = options.text || 'Notification';
        const color = options.color || '#00ff00';
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: absolute;
            left: ${x}px;
            top: ${y}px;
            background: linear-gradient(135deg, rgba(10,10,14,0.95), rgba(26,26,46,0.95));
            border: 2px solid ${color};
            border-radius: 8px;
            padding: 12px 16px;
            color: ${color};
            font-family: 'Courier New', monospace;
            font-size: 14px;
            font-weight: bold;
            pointer-events: none;
            z-index: 10011;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 0 20px ${color}40;
        `;
        notification.textContent = text;
        
        this.effectsContainer.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Animate out
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Screen flash effect
    createScreenFlash(options = {}) {
        const color = options.color || '#ffffff';
        const duration = options.duration || 200;
        
        const flash = document.createElement('div');
        flash.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: ${color};
            pointer-events: none;
            z-index: 10012;
            opacity: 0.8;
        `;
        
        this.effectsContainer.appendChild(flash);
        
        // Fade out
        let startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                flash.remove();
                return;
            }
            
            const progress = elapsed / duration;
            flash.style.opacity = 0.8 * (1 - progress);
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    // Particle rain effect
    createParticleRain(options = {}) {
        const count = options.count || 50;
        const color = options.color || '#00ffff';
        const duration = options.duration || 5000;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                left: ${Math.random() * window.innerWidth}px;
                top: -10px;
                width: 2px;
                height: 10px;
                background: ${color};
                pointer-events: none;
                z-index: 10013;
                opacity: 0.6;
            `;
            
            this.effectsContainer.appendChild(particle);
            
            // Animate particle falling
            let startTime = Date.now();
            const fallSpeed = 50 + Math.random() * 100;
            const animate = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= duration) {
                    particle.remove();
                    return;
                }
                
                const progress = elapsed / duration;
                const currentY = -10 + (window.innerHeight + 20) * progress;
                const currentOpacity = 0.6 * (1 - progress);
                
                particle.style.top = `${currentY}px`;
                particle.style.opacity = currentOpacity;
                
                requestAnimationFrame(animate);
            };
            
            animate();
        }
    }

    // Public API methods
    triggerScreenShake(intensity = 10, duration = 500) {
        this.queueEffect('screenShake', { intensity, duration });
    }

    triggerParticleBurst(x, y, count = 20, color = '#00ffff') {
        this.queueEffect('particleBurst', { x, y, count, color });
    }

    triggerGlowPulse(x, y, color = '#ff00ff', size = 100) {
        this.queueEffect('glowPulse', { x, y, color, size });
    }

    triggerEnergyWave(x, y, color = '#00ffff') {
        this.queueEffect('energyWave', { x, y, color });
    }

    triggerCosmicRift(x, y, width = 200, height = 400) {
        this.queueEffect('cosmicRift', { x, y, width, height });
    }

    triggerNotificationPop(text, color = '#00ff00', x, y) {
        this.queueEffect('notificationPop', { text, color, x, y });
    }

    triggerScreenFlash(color = '#ffffff', duration = 200) {
        this.queueEffect('screenFlash', { color, duration });
    }

    triggerParticleRain(count = 50, color = '#00ffff') {
        this.queueEffect('particleRain', { count, color });
    }

    // Clear all effects
    clearAllEffects() {
        this.effectsContainer.innerHTML = '';
        this.activeEffects.clear();
        this.effectQueue.length = 0;
    }

    // Get effect statistics
    getStats() {
        return {
            activeEffects: this.activeEffects.size,
            queuedEffects: this.effectQueue.length,
            maxConcurrent: this.maxConcurrentEffects
        };
    }
}

// Initialize global instance
window.discordEffects = new DiscordEffectsSystem();


