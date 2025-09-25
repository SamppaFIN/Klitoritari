/**
 * 🃏 Morphing Cards Technique
 * Advanced card morphing and transformation effects
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

class MorphingCardsTechnique {
    constructor() {
        this.name = 'Morphing Cards';
        this.description = 'Create fluid card transformations with advanced CSS and JavaScript';
        this.difficulty = 'Advanced';
        this.tags = ['animation', 'css', 'transforms', 'morphing'];
    }
    
    /**
     * Apply morphing cards technique to an element
     */
    apply(element, options = {}) {
        const config = {
            morphDuration: 600,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            perspective: 1000,
            enable3D: true,
            enableLiquid: false,
            enableMagnetic: false,
            ...options
        };
        
        // Add morphing card class
        element.classList.add('morphing-card');
        
        // Create morphing system
        const morphingSystem = new MorphingCardSystem(element, config);
        
        // Setup event listeners
        this.setupEventListeners(element, morphingSystem);
        
        // Add CSS styles
        this.addStyles();
        
        return morphingSystem;
    }
    
    setupEventListeners(element, morphingSystem) {
        // Hover effects
        element.addEventListener('mouseenter', () => {
            morphingSystem.morphTo('hover');
        });
        
        element.addEventListener('mouseleave', () => {
            morphingSystem.morphTo('default');
        });
        
        // Click effects
        element.addEventListener('click', () => {
            morphingSystem.morphTo('active');
        });
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            morphingSystem.morphTo('touch');
        });
        
        element.addEventListener('touchend', () => {
            morphingSystem.morphTo('default');
        });
    }
    
    addStyles() {
        if (document.getElementById('morphing-cards-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'morphing-cards-styles';
        style.textContent = `
            .morphing-card {
                position: relative;
                transform-style: preserve-3d;
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                overflow: hidden;
            }
            
            .morphing-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, 
                    rgba(74, 158, 255, 0.1), 
                    rgba(138, 43, 226, 0.1), 
                    rgba(0, 255, 136, 0.1)
                );
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            
            .morphing-card:hover::before {
                opacity: 1;
            }
            
            .morphing-card .card-content {
                position: relative;
                z-index: 2;
                transition: all 0.3s ease;
            }
            
            /* Morphing states */
            .morphing-card[data-morph="hover"] {
                transform: translateY(-8px) scale(1.02) rotateX(5deg);
                box-shadow: 
                    0 20px 40px rgba(74, 158, 255, 0.2),
                    0 0 0 1px rgba(74, 158, 255, 0.1);
            }
            
            .morphing-card[data-morph="active"] {
                transform: translateY(-4px) scale(0.98) rotateX(-2deg);
                box-shadow: 
                    0 10px 20px rgba(74, 158, 255, 0.3),
                    inset 0 0 0 2px rgba(74, 158, 255, 0.2);
            }
            
            .morphing-card[data-morph="touch"] {
                transform: scale(0.95) rotateX(2deg);
                box-shadow: 
                    0 5px 15px rgba(74, 158, 255, 0.4),
                    inset 0 0 0 1px rgba(74, 158, 255, 0.3);
            }
            
            /* Liquid morphing effect */
            .morphing-card.liquid {
                border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                animation: liquidMorph 3s ease-in-out infinite;
            }
            
            @keyframes liquidMorph {
                0%, 100% {
                    border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
                }
                25% {
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                }
                50% {
                    border-radius: 70% 30% 30% 70% / 40% 60% 60% 40%;
                }
                75% {
                    border-radius: 40% 60% 60% 40% / 70% 30% 30% 70%;
                }
            }
            
            /* Magnetic effect */
            .morphing-card.magnetic {
                transition: transform 0.1s ease-out;
            }
            
            .morphing-card.magnetic:hover {
                transform: translateY(-8px) scale(1.02) rotateX(5deg);
            }
            
            /* 3D flip effect */
            .morphing-card.flip-3d {
                transform-style: preserve-3d;
            }
            
            .morphing-card.flip-3d .card-front,
            .morphing-card.flip-3d .card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                backface-visibility: hidden;
                transition: transform 0.6s ease;
            }
            
            .morphing-card.flip-3d .card-back {
                transform: rotateY(180deg);
            }
            
            .morphing-card.flip-3d[data-morph="flip"] {
                transform: rotateY(180deg);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .morphing-card[data-morph="hover"] {
                    transform: translateY(-4px) scale(1.01);
                }
                
                .morphing-card[data-morph="active"] {
                    transform: translateY(-2px) scale(0.99);
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .morphing-card {
                    transition: none;
                }
                
                .morphing-card.liquid {
                    animation: none;
                    border-radius: 8px;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * 🃏 Morphing Card System
 * Core system for managing card morphing
 */
class MorphingCardSystem {
    constructor(element, config) {
        this.element = element;
        this.config = config;
        this.currentState = 'default';
        this.morphing = false;
        this.animationFrame = null;
        
        this.init();
    }
    
    init() {
        // Set initial state
        this.element.setAttribute('data-morph', this.currentState);
        
        // Add perspective for 3D effects
        if (this.config.enable3D) {
            this.element.style.perspective = `${this.config.perspective}px`;
        }
        
        // Enable liquid morphing if configured
        if (this.config.enableLiquid) {
            this.element.classList.add('liquid');
        }
        
        // Enable magnetic effect if configured
        if (this.config.enableMagnetic) {
            this.element.classList.add('magnetic');
            this.setupMagneticEffect();
        }
    }
    
    morphTo(state, options = {}) {
        if (this.morphing && !options.force) return;
        
        this.morphing = true;
        this.currentState = state;
        
        // Update data attribute
        this.element.setAttribute('data-morph', state);
        
        // Apply morphing animation
        this.animateMorph(state, options);
        
        // Reset morphing flag after animation
        setTimeout(() => {
            this.morphing = false;
        }, this.config.morphDuration);
    }
    
    animateMorph(state, options) {
        const startTime = performance.now();
        const startTransform = this.getCurrentTransform();
        const targetTransform = this.getTargetTransform(state);
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / this.config.morphDuration, 1);
            
            // Apply easing
            const easedProgress = this.easeInOutCubic(progress);
            
            // Interpolate transform
            const currentTransform = this.interpolateTransform(
                startTransform, 
                targetTransform, 
                easedProgress
            );
            
            // Apply transform
            this.element.style.transform = currentTransform;
            
            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.morphing = false;
            }
        };
        
        this.animationFrame = requestAnimationFrame(animate);
    }
    
    getCurrentTransform() {
        const computed = window.getComputedStyle(this.element);
        return computed.transform || 'matrix(1, 0, 0, 1, 0, 0)';
    }
    
    getTargetTransform(state) {
        const transforms = {
            default: 'translateY(0) scale(1) rotateX(0)',
            hover: 'translateY(-8px) scale(1.02) rotateX(5deg)',
            active: 'translateY(-4px) scale(0.98) rotateX(-2deg)',
            touch: 'scale(0.95) rotateX(2deg)',
            flip: 'rotateY(180deg)'
        };
        
        return transforms[state] || transforms.default;
    }
    
    interpolateTransform(start, end, progress) {
        // Simple interpolation - in a real implementation, you'd parse the matrix
        // and interpolate each component properly
        if (progress === 0) return start;
        if (progress === 1) return end;
        
        // For now, return the target transform
        return this.getTargetTransform(this.currentState);
    }
    
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    setupMagneticEffect() {
        this.element.addEventListener('mousemove', (e) => {
            if (this.morphing) return;
            
            const rect = this.element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const deltaX = (e.clientX - centerX) / rect.width;
            const deltaY = (e.clientY - centerY) / rect.height;
            
            const maxTilt = 15;
            const tiltX = deltaY * maxTilt;
            const tiltY = deltaX * maxTilt;
            
            this.element.style.transform = `translateY(-8px) scale(1.02) rotateX(${-tiltX}deg) rotateY(${tiltY}deg)`;
        });
        
        this.element.addEventListener('mouseleave', () => {
            this.morphTo('default');
        });
    }
    
    // Public methods
    flip() {
        this.morphTo('flip');
    }
    
    reset() {
        this.morphTo('default', { force: true });
    }
    
    enableLiquid() {
        this.element.classList.add('liquid');
    }
    
    disableLiquid() {
        this.element.classList.remove('liquid');
    }
    
    enableMagnetic() {
        this.element.classList.add('magnetic');
        this.setupMagneticEffect();
    }
    
    disableMagnetic() {
        this.element.classList.remove('magnetic');
    }
    
    destroy() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
        this.element.classList.remove('morphing-card', 'liquid', 'magnetic');
        this.element.removeAttribute('data-morph');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MorphingCardsTechnique, MorphingCardSystem };
}
