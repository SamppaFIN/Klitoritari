/**
 * 🧲 Magnetic Buttons Technique
 * Buttons that follow your cursor with magnetic attraction
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

class MagneticButtonsTechnique {
    constructor() {
        this.name = 'Magnetic Buttons';
        this.description = 'Create buttons that magnetically follow your cursor';
        this.difficulty = 'Intermediate';
        this.tags = ['interaction', 'cursor', 'magnetic', 'animation'];
    }
    
    /**
     * Apply magnetic buttons technique to an element
     */
    apply(element, options = {}) {
        const config = {
            magneticStrength: 0.3,
            maxDistance: 100,
            animationDuration: 300,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            enableRipple: true,
            enableGlow: true,
            enableSound: false,
            ...options
        };
        
        // Add magnetic button class
        element.classList.add('magnetic-button');
        
        // Create magnetic system
        const magneticSystem = new MagneticButtonSystem(element, config);
        
        // Setup event listeners
        this.setupEventListeners(element, magneticSystem);
        
        // Add CSS styles
        this.addStyles();
        
        return magneticSystem;
    }
    
    setupEventListeners(element, magneticSystem) {
        // Mouse events
        element.addEventListener('mouseenter', () => {
            magneticSystem.activate();
        });
        
        element.addEventListener('mouseleave', () => {
            magneticSystem.deactivate();
        });
        
        element.addEventListener('mousemove', (e) => {
            magneticSystem.updatePosition(e.clientX, e.clientY);
        });
        
        element.addEventListener('click', (e) => {
            magneticSystem.handleClick(e);
        });
        
        // Touch events for mobile
        element.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            magneticSystem.activate();
            magneticSystem.updatePosition(touch.clientX, touch.clientY);
        });
        
        element.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            magneticSystem.updatePosition(touch.clientX, touch.clientY);
        }, { passive: false });
        
        element.addEventListener('touchend', () => {
            magneticSystem.deactivate();
        });
    }
    
    addStyles() {
        if (document.getElementById('magnetic-buttons-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'magnetic-buttons-styles';
        style.textContent = `
            .magnetic-button {
                position: relative;
                display: inline-block;
                padding: 12px 24px;
                background: linear-gradient(135deg, var(--cosmic-primary), var(--cosmic-secondary));
                color: white;
                border: none;
                border-radius: 8px;
                font-family: var(--font-primary);
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                overflow: hidden;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }
            
            .magnetic-button::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.2), 
                    rgba(255, 255, 255, 0.1)
                );
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: 1;
            }
            
            .magnetic-button::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: all 0.6s ease;
                z-index: 2;
            }
            
            .magnetic-button .button-content {
                position: relative;
                z-index: 3;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
            }
            
            .magnetic-button .button-icon {
                font-size: 1.2em;
                transition: transform 0.3s ease;
            }
            
            /* Magnetic states */
            .magnetic-button.magnetic-active {
                transform: scale(1.05);
                box-shadow: 
                    0 10px 30px rgba(74, 158, 255, 0.4),
                    0 0 0 1px rgba(74, 158, 255, 0.2);
            }
            
            .magnetic-button.magnetic-active::before {
                opacity: 1;
            }
            
            .magnetic-button.magnetic-active .button-icon {
                transform: scale(1.1) rotate(5deg);
            }
            
            /* Ripple effect */
            .magnetic-button.ripple::after {
                width: 300px;
                height: 300px;
                opacity: 0;
            }
            
            /* Glow effect */
            .magnetic-button.glow {
                box-shadow: 
                    0 0 20px rgba(74, 158, 255, 0.6),
                    0 0 40px rgba(74, 158, 255, 0.4),
                    0 0 60px rgba(74, 158, 255, 0.2);
            }
            
            /* Magnetic attraction effect */
            .magnetic-button.magnetic-attract {
                transition: transform 0.1s ease-out;
            }
            
            /* Hover effects */
            .magnetic-button:hover {
                transform: translateY(-2px);
                box-shadow: 
                    0 8px 25px rgba(74, 158, 255, 0.3),
                    0 0 0 1px rgba(74, 158, 255, 0.1);
            }
            
            .magnetic-button:hover .button-icon {
                transform: scale(1.05);
            }
            
            /* Active state */
            .magnetic-button:active {
                transform: scale(0.98);
            }
            
            /* Disabled state */
            .magnetic-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                transform: none !important;
            }
            
            .magnetic-button:disabled:hover {
                transform: none;
                box-shadow: none;
            }
            
            /* Size variants */
            .magnetic-button.small {
                padding: 8px 16px;
                font-size: 0.875rem;
            }
            
            .magnetic-button.large {
                padding: 16px 32px;
                font-size: 1.125rem;
            }
            
            /* Style variants */
            .magnetic-button.outline {
                background: transparent;
                color: var(--cosmic-primary);
                border: 2px solid var(--cosmic-primary);
            }
            
            .magnetic-button.outline:hover {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .magnetic-button.ghost {
                background: rgba(74, 158, 255, 0.1);
                color: var(--cosmic-primary);
                border: 1px solid rgba(74, 158, 255, 0.2);
            }
            
            .magnetic-button.ghost:hover {
                background: rgba(74, 158, 255, 0.2);
                border-color: rgba(74, 158, 255, 0.4);
            }
            
            /* Responsive adjustments */
            @media (max-width: 768px) {
                .magnetic-button {
                    padding: 10px 20px;
                    font-size: 0.9rem;
                }
                
                .magnetic-button.magnetic-active {
                    transform: scale(1.02);
                }
            }
            
            /* Reduced motion support */
            @media (prefers-reduced-motion: reduce) {
                .magnetic-button {
                    transition: none;
                }
                
                .magnetic-button.magnetic-attract {
                    transition: none;
                }
                
                .magnetic-button .button-icon {
                    transition: none;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
}

/**
 * 🧲 Magnetic Button System
 * Core system for managing magnetic button behavior
 */
class MagneticButtonSystem {
    constructor(element, config) {
        this.element = element;
        this.config = config;
        this.isActive = false;
        this.isAttracting = false;
        this.originalTransform = '';
        this.animationFrame = null;
        this.rippleTimeout = null;
        
        this.init();
    }
    
    init() {
        // Store original transform
        this.originalTransform = this.element.style.transform;
        
        // Add magnetic attract class for smooth transitions
        this.element.classList.add('magnetic-attract');
        
        // Setup sound if enabled
        if (this.config.enableSound) {
            this.setupSound();
        }
    }
    
    activate() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.element.classList.add('magnetic-active');
        
        // Add glow effect if enabled
        if (this.config.enableGlow) {
            this.element.classList.add('glow');
        }
        
        // Play activation sound
        if (this.config.enableSound) {
            this.playSound('activate');
        }
    }
    
    deactivate() {
        if (!this.isActive) return;
        
        this.isActive = false;
        this.isAttracting = false;
        this.element.classList.remove('magnetic-active', 'glow');
        
        // Reset position
        this.element.style.transform = this.originalTransform;
        
        // Cancel any ongoing animation
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Play deactivation sound
        if (this.config.enableSound) {
            this.playSound('deactivate');
        }
    }
    
    updatePosition(mouseX, mouseY) {
        if (!this.isActive) return;
        
        const rect = this.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = mouseX - centerX;
        const deltaY = mouseY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        
        // Check if within magnetic range
        if (distance <= this.config.maxDistance) {
            this.isAttracting = true;
            
            // Calculate magnetic force
            const force = 1 - (distance / this.config.maxDistance);
            const magneticX = deltaX * force * this.config.magneticStrength;
            const magneticY = deltaY * force * this.config.magneticStrength;
            
            // Apply magnetic transform
            const transform = `translate(${magneticX}px, ${magneticY}px) scale(${1 + force * 0.05})`;
            this.element.style.transform = transform;
            
            // Add magnetic attraction class
            this.element.classList.add('magnetic-attract');
        } else {
            this.isAttracting = false;
            this.element.classList.remove('magnetic-attract');
        }
    }
    
    handleClick(event) {
        // Create ripple effect
        if (this.config.enableRipple) {
            this.createRipple(event);
        }
        
        // Play click sound
        if (this.config.enableSound) {
            this.playSound('click');
        }
        
        // Add click animation
        this.element.classList.add('clicked');
        setTimeout(() => {
            this.element.classList.remove('clicked');
        }, 150);
    }
    
    createRipple(event) {
        // Remove existing ripple
        if (this.rippleTimeout) {
            clearTimeout(this.rippleTimeout);
        }
        
        // Add ripple class
        this.element.classList.add('ripple');
        
        // Remove ripple after animation
        this.rippleTimeout = setTimeout(() => {
            this.element.classList.remove('ripple');
        }, 600);
    }
    
    setupSound() {
        // Create audio context for sound effects
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {
            activate: this.createTone(440, 0.1, 'sine'),
            deactivate: this.createTone(220, 0.1, 'sine'),
            click: this.createTone(880, 0.05, 'square')
        };
    }
    
    createTone(frequency, duration, type = 'sine') {
        return () => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        };
    }
    
    playSound(soundName) {
        if (this.sounds && this.sounds[soundName]) {
            try {
                this.sounds[soundName]();
            } catch (error) {
                console.warn('Could not play sound:', error);
            }
        }
    }
    
    // Public methods
    setMagneticStrength(strength) {
        this.config.magneticStrength = Math.max(0, Math.min(1, strength));
    }
    
    setMaxDistance(distance) {
        this.config.maxDistance = Math.max(0, distance);
    }
    
    enableRipple(enable = true) {
        this.config.enableRipple = enable;
    }
    
    enableGlow(enable = true) {
        this.config.enableGlow = enable;
        if (!enable) {
            this.element.classList.remove('glow');
        }
    }
    
    enableSound(enable = true) {
        this.config.enableSound = enable;
        if (enable && !this.audioContext) {
            this.setupSound();
        }
    }
    
    destroy() {
        this.deactivate();
        
        if (this.rippleTimeout) {
            clearTimeout(this.rippleTimeout);
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        this.element.classList.remove(
            'magnetic-button', 
            'magnetic-active', 
            'magnetic-attract', 
            'glow', 
            'ripple'
        );
        
        this.element.style.transform = this.originalTransform;
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { MagneticButtonsTechnique, MagneticButtonSystem };
}
