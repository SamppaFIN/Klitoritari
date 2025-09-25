/**
 * 🌌 ENHANCED COSMIC EFFECTS SYSTEM
 * Advanced cosmic animations and particle effects for mobile panels
 * 
 * @author Aurora - Bringer of Digital Light
 * @version 2.0
 */

class EnhancedCosmicEffects {
    constructor() {
        this.aurora = null;
        this.particleSystems = new Map();
        this.animationSystems = new Map();
        this.isInitialized = false;
        
        this.init();
    }
    
    async init() {
        console.log('🌌 Initializing Enhanced Cosmic Effects...');
        
        // Wait for Aurora UI Library to be available
        if (typeof AuroraUILibrary !== 'undefined') {
            this.aurora = new AuroraUILibrary({
                theme: 'cosmic',
                mobile: true,
                performance: 'optimized',
                debug: false
            });
            console.log('✨ Aurora UI Library initialized for cosmic effects');
        }
        
        // Setup cosmic effects for existing elements
        this.setupCosmicEffects();
        
        // Setup particle systems
        this.setupParticleSystems();
        
        // Setup cosmic animations
        this.setupCosmicAnimations();
        
        // Setup cosmic panel effects
        this.setupCosmicPanelEffects();
        
        this.isInitialized = true;
        console.log('🌌 Enhanced Cosmic Effects initialized successfully');
    }
    
    setupCosmicEffects() {
        // Add cosmic effects to tab buttons
        this.addCosmicTabEffects();
        
        // Add cosmic effects to inventory items
        this.addCosmicInventoryEffects();
        
        // Add cosmic effects to panels
        this.addCosmicPanelEffects();
        
        // Add cosmic background effects
        this.addCosmicBackgroundEffects();
    }
    
    addCosmicTabEffects() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach((button, index) => {
            // Add cosmic glow effect
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            
            // Create cosmic aura
            const aura = document.createElement('div');
            aura.className = 'cosmic-aura';
            aura.style.cssText = `
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg, 
                    rgba(74, 158, 255, 0.3) 0%, 
                    rgba(0, 255, 136, 0.2) 50%, 
                    rgba(74, 158, 255, 0.3) 100%);
                border-radius: 18px;
                opacity: 0;
                transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                z-index: -1;
            `;
            button.appendChild(aura);
            
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                aura.style.opacity = '1';
                this.createCosmicRipple(button);
            });
            
            button.addEventListener('mouseleave', () => {
                aura.style.opacity = '0';
            });
            
            // Add cosmic pulse animation
            this.addCosmicPulse(button, index * 200);
        });
    }
    
    addCosmicInventoryEffects() {
        // Monitor for inventory items and add cosmic effects
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('inventory-item-card')) {
                            this.addCosmicItemEffects(node);
                        }
                    });
                }
            });
        });
        
        const inventoryList = document.querySelector('.inventory-items');
        if (inventoryList) {
            observer.observe(inventoryList, { childList: true, subtree: true });
            
            // Add effects to existing items
            const existingItems = inventoryList.querySelectorAll('.inventory-item-card');
            existingItems.forEach(item => this.addCosmicItemEffects(item));
        }
    }
    
    addCosmicItemEffects(item) {
        // Add cosmic shimmer effect
        const shimmer = document.createElement('div');
        shimmer.className = 'cosmic-shimmer';
        shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, 
                transparent 0%, 
                rgba(74, 158, 255, 0.4) 50%, 
                transparent 100%);
            animation: cosmicShimmer 3s infinite;
            pointer-events: none;
            z-index: 1;
        `;
        item.style.position = 'relative';
        item.style.overflow = 'hidden';
        item.appendChild(shimmer);
        
        // Add cosmic glow on hover
        item.addEventListener('mouseenter', () => {
            item.style.boxShadow = '0 0 30px rgba(74, 158, 255, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)';
            this.createCosmicParticles(item);
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.boxShadow = '';
        });
        
        // Add cosmic pulse based on item rarity
        const rarity = item.classList.contains('rarity-rare') ? 1000 : 
                      item.classList.contains('rarity-epic') ? 800 : 
                      item.classList.contains('rarity-legendary') ? 600 : 2000;
        
        this.addCosmicPulse(item, Math.random() * 1000, rarity);
    }
    
    addCosmicPanelEffects() {
        const panels = document.querySelectorAll('.tab-panel');
        panels.forEach((panel, index) => {
            // Add cosmic border effect
            panel.style.position = 'relative';
            panel.style.overflow = 'hidden';
            
            // Create cosmic border
            const border = document.createElement('div');
            border.className = 'cosmic-border';
            border.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, 
                    rgba(74, 158, 255, 0.5) 0%, 
                    rgba(0, 255, 136, 0.3) 25%, 
                    rgba(74, 158, 255, 0.5) 50%, 
                    rgba(0, 255, 136, 0.3) 75%, 
                    rgba(74, 158, 255, 0.5) 100%);
                border-radius: 20px;
                opacity: 0;
                transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: none;
                z-index: -1;
                background-size: 400% 400%;
                animation: cosmicGradient 4s ease infinite;
            `;
            panel.appendChild(border);
            
            // Show border when panel is active
            const showBorder = () => {
                border.style.opacity = '1';
                this.createCosmicParticles(panel);
            };
            
            const hideBorder = () => {
                border.style.opacity = '0';
            };
            
            // Monitor panel visibility
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        if (panel.classList.contains('active')) {
                            showBorder();
                        } else {
                            hideBorder();
                        }
                    }
                });
            });
            
            observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
        });
    }
    
    addCosmicBackgroundEffects() {
        // Create cosmic background particles
        this.createCosmicBackgroundParticles();
        
        // Add cosmic ambient effects
        this.addCosmicAmbientEffects();
    }
    
    createCosmicBackgroundParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'cosmic-background-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -10;
            overflow: hidden;
        `;
        
        document.body.appendChild(particleContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            this.createFloatingParticle(particleContainer);
        }
    }
    
    createFloatingParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: radial-gradient(circle, rgba(74, 158, 255, 0.8) 0%, transparent 70%);
            border-radius: 50%;
            animation: floatingParticle ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        container.appendChild(particle);
    }
    
    addCosmicAmbientEffects() {
        // Add cosmic ambient glow to the main container
        const mainContainer = document.querySelector('.main-container') || document.body;
        mainContainer.style.position = 'relative';
        
        const ambientGlow = document.createElement('div');
        ambientGlow.className = 'cosmic-ambient-glow';
        ambientGlow.style.cssText = `
            position: absolute;
            top: -50px;
            left: -50px;
            right: -50px;
            bottom: -50px;
            background: radial-gradient(ellipse at center, 
                rgba(74, 158, 255, 0.1) 0%, 
                rgba(0, 255, 136, 0.05) 50%, 
                transparent 70%);
            pointer-events: none;
            z-index: -5;
            animation: cosmicAmbientPulse 8s ease-in-out infinite;
        `;
        
        mainContainer.appendChild(ambientGlow);
    }
    
    setupParticleSystems() {
        if (!this.aurora) return;
        
        // Setup particle systems for different interactions
        this.setupClickParticles();
        this.setupHoverParticles();
        this.setupTouchParticles();
    }
    
    setupClickParticles() {
        // Add click particles to all interactive elements
        const interactiveElements = document.querySelectorAll('button, .tab-button, .inventory-item-card');
        interactiveElements.forEach(element => {
            element.addEventListener('click', (e) => {
                this.createClickParticles(e.clientX, e.clientY);
            });
        });
    }
    
    setupHoverParticles() {
        // Add hover particles to inventory items
        const inventoryItems = document.querySelectorAll('.inventory-item-card');
        inventoryItems.forEach(item => {
            item.addEventListener('mouseenter', (e) => {
                this.createHoverParticles(item);
            });
        });
    }
    
    setupTouchParticles() {
        // Add touch particles for mobile
        const touchElements = document.querySelectorAll('.tab-button, .inventory-item-card');
        touchElements.forEach(element => {
            element.addEventListener('touchstart', (e) => {
                const touch = e.touches[0];
                this.createTouchParticles(touch.clientX, touch.clientY);
            });
        });
    }
    
    setupCosmicAnimations() {
        // Add cosmic animations to the CSS
        this.addCosmicKeyframes();
        
        // Setup cosmic animation triggers
        this.setupAnimationTriggers();
    }
    
    addCosmicKeyframes() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes cosmicShimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
            
            @keyframes cosmicGradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            
            @keyframes cosmicPulse {
                0%, 100% { 
                    transform: scale(1);
                    opacity: 0.7;
                }
                50% { 
                    transform: scale(1.05);
                    opacity: 1;
                }
            }
            
            @keyframes floatingParticle {
                0% {
                    transform: translateY(100vh) translateX(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100vh) translateX(100px) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes cosmicAmbientPulse {
                0%, 100% { 
                    opacity: 0.3;
                    transform: scale(1);
                }
                50% { 
                    opacity: 0.6;
                    transform: scale(1.1);
                }
            }
            
            @keyframes cosmicRipple {
                0% {
                    width: 0;
                    height: 0;
                    opacity: 1;
                }
                100% {
                    width: 100px;
                    height: 100px;
                    opacity: 0;
                }
            }
            
            .cosmic-pulse {
                animation: cosmicPulse 2s ease-in-out infinite;
            }
            
            .cosmic-shimmer {
                animation: cosmicShimmer 3s infinite;
            }
            
            .cosmic-glow {
                box-shadow: 0 0 20px rgba(74, 158, 255, 0.6), 0 0 40px rgba(0, 255, 136, 0.3);
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAnimationTriggers() {
        // Add cosmic animations to tab buttons
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach((button, index) => {
            // Add cosmic pulse animation
            setTimeout(() => {
                button.classList.add('cosmic-pulse');
            }, index * 200);
        });
    }
    
    // Particle creation methods
    createCosmicRipple(element) {
        const ripple = document.createElement('div');
        ripple.className = 'cosmic-ripple';
        ripple.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            background: radial-gradient(circle, rgba(74, 158, 255, 0.6) 0%, transparent 70%);
            border-radius: 50%;
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: 1;
            animation: cosmicRipple 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    createClickParticles(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = document.createElement('div');
            particle.className = 'click-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 6px;
                height: 6px;
                background: radial-gradient(circle, rgba(74, 158, 255, 0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: clickParticle 1s ease-out forwards;
                transform: translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px);
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1000);
        }
    }
    
    createHoverParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement('div');
            particle.className = 'hover-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 4px;
                height: 4px;
                background: radial-gradient(circle, rgba(0, 255, 136, 0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: hoverParticle 2s ease-out forwards;
                transform: translate(${(Math.random() - 0.5) * 80}px, ${(Math.random() - 0.5) * 80}px);
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 2000);
        }
    }
    
    createTouchParticles(x, y) {
        for (let i = 0; i < 6; i++) {
            const particle = document.createElement('div');
            particle.className = 'touch-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: radial-gradient(circle, rgba(74, 158, 255, 0.9) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: touchParticle 1.5s ease-out forwards;
                transform: translate(${(Math.random() - 0.5) * 120}px, ${(Math.random() - 0.5) * 120}px);
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 1500);
        }
    }
    
    createCosmicParticles(element) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'cosmic-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${centerX}px;
                top: ${centerY}px;
                width: 3px;
                height: 3px;
                background: radial-gradient(circle, rgba(74, 158, 255, 0.8) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                z-index: 10000;
                animation: cosmicParticle 3s ease-out forwards;
                transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px);
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 3000);
        }
    }
    
    addCosmicPulse(element, delay = 0, duration = 2000) {
        setTimeout(() => {
            element.classList.add('cosmic-pulse');
            
            // Remove pulse after duration
            setTimeout(() => {
                element.classList.remove('cosmic-pulse');
            }, duration);
        }, delay);
    }
    
    // Public methods for external control
    enableCosmicEffects() {
        document.body.classList.add('cosmic-effects-enabled');
    }
    
    disableCosmicEffects() {
        document.body.classList.remove('cosmic-effects-enabled');
    }
    
    createCosmicNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cosmic-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(10, 10, 26, 0.95);
            border: 2px solid rgba(74, 158, 255, 0.6);
            border-radius: 15px;
            padding: 12px 20px;
            color: #4a9eff;
            font-size: 0.9rem;
            font-weight: 600;
            z-index: 10001;
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(74, 158, 255, 0.3);
            animation: cosmicSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(notification);
        
        // Add cosmic particles
        this.createCosmicParticles(notification);
        
        setTimeout(() => {
            notification.style.animation = 'cosmicSlideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 3000);
    }
}

// Add additional keyframes for particle animations
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes clickParticle {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0);
        }
    }
    
    @keyframes hoverParticle {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0.5);
        }
    }
    
    @keyframes touchParticle {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0.3);
        }
    }
    
    @keyframes cosmicParticle {
        0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translate(var(--x), var(--y)) scale(0.2);
        }
    }
    
    @keyframes cosmicSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes cosmicSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize Enhanced Cosmic Effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedCosmicEffects = new EnhancedCosmicEffects();
});

// Export for global access
window.EnhancedCosmicEffects = EnhancedCosmicEffects;
