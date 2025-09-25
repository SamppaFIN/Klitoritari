/**
 * 🌟 Vanilla.js UI/UX Mastery System
 * Advanced UI/UX tricks and techniques using pure vanilla JavaScript
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 * @mission Community healing through cosmic exploration
 */

class VanillaUIMastery {
    constructor() {
        this.techniques = new Map();
        this.performance = new PerformanceMonitor();
        this.gestureManager = new AdvancedGestureManager();
        this.animationEngine = new CosmicAnimationEngine();
        this.tutorialSystem = new UITutorialSystem();
        
        this.init();
    }
    
    init() {
        this.registerTechniques();
        this.setupEventListeners();
        this.initializeTutorial();
        console.log('🌟 Vanilla UI Mastery System initialized - Ready to explore cosmic UI/UX!');
    }
    
    /**
     * Register all available UI/UX techniques
     */
    registerTechniques() {
        // Core Animation Techniques
        this.techniques.set('morphing-cards', new MorphingCardsTechnique());
        this.techniques.set('parallax-layers', new ParallaxLayersTechnique());
        this.techniques.set('magnetic-buttons', new MagneticButtonsTechnique());
        this.techniques.set('liquid-morphing', new LiquidMorphingTechnique());
        
        // Advanced Interaction Techniques
        this.techniques.set('gesture-navigation', new GestureNavigationTechnique());
        this.techniques.set('pressure-sensitive', new PressureSensitiveTechnique());
        this.techniques.set('voice-interactions', new VoiceInteractionsTechnique());
        this.techniques.set('eye-tracking', new EyeTrackingTechnique());
        
        // Visual Effects Techniques
        this.techniques.set('particle-systems', new ParticleSystemsTechnique());
        this.techniques.set('shader-effects', new ShaderEffectsTechnique());
        this.techniques.set('holographic-ui', new HolographicUITechnique());
        this.techniques.set('neon-glow', new NeonGlowTechnique());
        
        // Layout & Responsive Techniques
        this.techniques.set('fluid-grids', new FluidGridsTechnique());
        this.techniques.set('adaptive-layouts', new AdaptiveLayoutsTechnique());
        this.techniques.set('micro-interactions', new MicroInteractionsTechnique());
        this.techniques.set('scroll-triggered', new ScrollTriggeredTechnique());
    }
    
    /**
     * Setup global event listeners for cosmic interactions
     */
    setupEventListeners() {
        // Cosmic scroll effects
        window.addEventListener('scroll', this.throttle(this.handleCosmicScroll.bind(this), 16));
        
        // Touch and gesture events
        document.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
        document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        document.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
        
        // Mouse interactions
        document.addEventListener('mousemove', this.throttle(this.handleMouseMove.bind(this), 16));
        
        // Resize handling
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
    }
    
    /**
     * Initialize the tutorial system
     */
    initializeTutorial() {
        this.tutorialSystem.init();
        this.tutorialSystem.on('technique-learned', (technique) => {
            console.log(`✨ Technique mastered: ${technique}`);
            this.celebrateMastery(technique);
        });
    }
    
    /**
     * Get a specific technique by name
     */
    getTechnique(name) {
        return this.techniques.get(name);
    }
    
    /**
     * Apply a technique to an element
     */
    applyTechnique(techniqueName, element, options = {}) {
        const technique = this.getTechnique(techniqueName);
        if (technique) {
            return technique.apply(element, options);
        } else {
            console.warn(`Technique '${techniqueName}' not found`);
            return null;
        }
    }
    
    /**
     * Create a cosmic demo showcasing multiple techniques
     */
    createCosmicDemo(container) {
        const demo = new CosmicDemo(container, this);
        return demo;
    }
    
    // Event Handlers
    handleCosmicScroll(event) {
        this.animationEngine.updateScrollEffects(window.scrollY);
    }
    
    handleTouchStart(event) {
        this.gestureManager.handleTouchStart(event);
    }
    
    handleTouchMove(event) {
        this.gestureManager.handleTouchMove(event);
    }
    
    handleTouchEnd(event) {
        this.gestureManager.handleTouchEnd(event);
    }
    
    handleMouseMove(event) {
        this.animationEngine.updateMouseEffects(event.clientX, event.clientY);
    }
    
    handleResize(event) {
        this.animationEngine.updateResponsiveLayouts();
    }
    
    handleKeyboard(event) {
        // Cosmic keyboard shortcuts
        if (event.ctrlKey || event.metaKey) {
            switch(event.key) {
                case 'k':
                    event.preventDefault();
                    this.tutorialSystem.toggle();
                    break;
                case 'd':
                    event.preventDefault();
                    this.createCosmicDemo(document.body);
                    break;
            }
        }
    }
    
    /**
     * Celebrate when a technique is mastered
     */
    celebrateMastery(technique) {
        // Create cosmic celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'cosmic-celebration';
        celebration.innerHTML = `
            <div class="celebration-text">✨ ${technique} Mastered! ✨</div>
            <div class="celebration-particles"></div>
        `;
        
        document.body.appendChild(celebration);
        
        // Animate celebration
        setTimeout(() => {
            celebration.classList.add('active');
        }, 100);
        
        // Remove after animation
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    
    // Utility functions
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

/**
 * 🎨 Performance Monitor
 * Monitors and optimizes UI performance
 */
class PerformanceMonitor {
    constructor() {
        this.fps = 0;
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.isMonitoring = false;
        
        this.startMonitoring();
    }
    
    startMonitoring() {
        this.isMonitoring = true;
        this.monitor();
    }
    
    monitor() {
        if (!this.isMonitoring) return;
        
        const now = performance.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;
        
        this.frameCount++;
        if (this.frameCount % 60 === 0) {
            this.fps = Math.round(1000 / deltaTime);
            this.optimizePerformance();
        }
        
        requestAnimationFrame(() => this.monitor());
    }
    
    optimizePerformance() {
        if (this.fps < 30) {
            // Reduce animation complexity
            document.documentElement.style.setProperty('--animation-quality', 'low');
        } else if (this.fps > 50) {
            // Increase animation complexity
            document.documentElement.style.setProperty('--animation-quality', 'high');
        }
    }
    
    getFPS() {
        return this.fps;
    }
}

/**
 * 🤲 Advanced Gesture Manager
 * Handles complex touch and gesture interactions
 */
class AdvancedGestureManager {
    constructor() {
        this.touches = new Map();
        this.gestures = {
            onSwipe: null,
            onPinch: null,
            onRotate: null,
            onTap: null,
            onLongPress: null,
            onPressure: null
        };
        
        this.longPressTimer = null;
        this.lastPinchDistance = 0;
    }
    
    handleTouchStart(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            this.touches.set(touch.identifier, {
                startX: touch.clientX,
                startY: touch.clientY,
                startTime: Date.now(),
                currentX: touch.clientX,
                currentY: touch.clientY,
                pressure: touch.force || 1,
                radiusX: touch.radiusX || 10,
                radiusY: touch.radiusY || 10
            });
        }
        
        // Long press detection
        if (this.touches.size === 1) {
            this.longPressTimer = setTimeout(() => {
                if (this.gestures.onLongPress) {
                    this.gestures.onLongPress(event);
                }
            }, 500);
        }
        
        // Pressure detection
        if (this.gestures.onPressure) {
            const touch = event.changedTouches[0];
            this.gestures.onPressure({
                pressure: touch.force || 1,
                x: touch.clientX,
                y: touch.clientY
            });
        }
    }
    
    handleTouchMove(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            if (this.touches.has(touch.identifier)) {
                const touchData = this.touches.get(touch.identifier);
                touchData.currentX = touch.clientX;
                touchData.currentY = touch.clientY;
                touchData.pressure = touch.force || 1;
            }
        }
        
        // Clear long press timer on movement
        if (this.longPressTimer) {
            clearTimeout(this.longPressTimer);
            this.longPressTimer = null;
        }
        
        // Multi-touch gestures
        if (this.touches.size === 2) {
            this.handlePinchGesture(event);
        }
    }
    
    handleTouchEnd(event) {
        event.preventDefault();
        
        for (let touch of event.changedTouches) {
            if (this.touches.has(touch.identifier)) {
                const touchData = this.touches.get(touch.identifier);
                const deltaX = touchData.currentX - touchData.startX;
                const deltaY = touchData.currentY - touchData.startY;
                const deltaTime = Date.now() - touchData.startTime;
                
                // Swipe detection
                if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
                    if (this.gestures.onSwipe) {
                        this.gestures.onSwipe({
                            direction: this.getSwipeDirection(deltaX, deltaY),
                            distance: Math.sqrt(deltaX * deltaX + deltaY * deltaY),
                            duration: deltaTime,
                            velocity: Math.sqrt(deltaX * deltaX + deltaY * deltaY) / deltaTime
                        });
                    }
                } else if (deltaTime < 300) {
                    // Tap detection
                    if (this.gestures.onTap) {
                        this.gestures.onTap({
                            x: touchData.currentX,
                            y: touchData.currentY,
                            pressure: touchData.pressure
                        });
                    }
                }
                
                this.touches.delete(touch.identifier);
            }
        }
    }
    
    handlePinchGesture(event) {
        if (this.touches.size === 2) {
            const touches = Array.from(this.touches.values());
            const distance = this.getDistance(touches[0], touches[1]);
            
            if (this.lastPinchDistance > 0) {
                const scale = distance / this.lastPinchDistance;
                if (this.gestures.onPinch) {
                    this.gestures.onPinch({ scale, distance });
                }
            }
            
            this.lastPinchDistance = distance;
        }
    }
    
    getSwipeDirection(deltaX, deltaY) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }
    
    getDistance(touch1, touch2) {
        const dx = touch1.currentX - touch2.currentX;
        const dy = touch1.currentY - touch2.currentY;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    on(event, callback) {
        if (this.gestures.hasOwnProperty(event)) {
            this.gestures[event] = callback;
        }
    }
}

/**
 * 🎭 Cosmic Animation Engine
 * Advanced animation system with cosmic effects
 */
class CosmicAnimationEngine {
    constructor() {
        this.animations = new Map();
        this.scrollEffects = [];
        this.mouseEffects = [];
        this.isRunning = false;
        
        this.start();
    }
    
    start() {
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
    }
    
    animate() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        
        // Update all animations
        this.animations.forEach((animation, id) => {
            if (animation.update(currentTime)) {
                this.animations.delete(id);
            }
        });
        
        // Update scroll effects
        this.scrollEffects.forEach(effect => effect.update(window.scrollY));
        
        // Update mouse effects
        this.mouseEffects.forEach(effect => effect.update());
        
        requestAnimationFrame(() => this.animate());
    }
    
    createAnimation(element, properties, options = {}) {
        const animation = new CosmicAnimation(element, properties, options);
        this.animations.set(animation.id, animation);
        return animation;
    }
    
    addScrollEffect(effect) {
        this.scrollEffects.push(effect);
    }
    
    addMouseEffect(effect) {
        this.mouseEffects.push(effect);
    }
    
    updateScrollEffects(scrollY) {
        this.scrollEffects.forEach(effect => effect.update(scrollY));
    }
    
    updateMouseEffects(x, y) {
        this.mouseEffects.forEach(effect => effect.update(x, y));
    }
    
    updateResponsiveLayouts() {
        // Update responsive layouts on resize
        this.scrollEffects.forEach(effect => effect.updateResponsive());
        this.mouseEffects.forEach(effect => effect.updateResponsive());
    }
}

/**
 * 🎓 UI Tutorial System
 * Interactive tutorial system for learning UI/UX techniques
 */
class UITutorialSystem {
    constructor() {
        this.isActive = false;
        this.currentTutorial = null;
        this.completedTechniques = new Set();
        this.listeners = new Map();
        
        this.createTutorialUI();
    }
    
    init() {
        this.loadProgress();
        this.setupKeyboardShortcuts();
    }
    
    createTutorialUI() {
        const tutorialPanel = document.createElement('div');
        tutorialPanel.id = 'ui-tutorial-panel';
        tutorialPanel.className = 'tutorial-panel';
        tutorialPanel.innerHTML = `
            <div class="tutorial-header">
                <h2>🌟 UI/UX Mastery Tutorial</h2>
                <button class="tutorial-close">×</button>
            </div>
            <div class="tutorial-content">
                <div class="tutorial-progress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <span class="progress-text">0/12 Techniques Mastered</span>
                </div>
                <div class="tutorial-list">
                    <!-- Tutorial items will be populated here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(tutorialPanel);
        this.panel = tutorialPanel;
    }
    
    toggle() {
        this.isActive = !this.isActive;
        this.panel.classList.toggle('active', this.isActive);
        
        if (this.isActive) {
            this.updateTutorialList();
        }
    }
    
    updateTutorialList() {
        const list = this.panel.querySelector('.tutorial-list');
        list.innerHTML = '';
        
        const techniques = [
            { id: 'morphing-cards', name: 'Morphing Cards', description: 'Learn to create fluid card transformations' },
            { id: 'parallax-layers', name: 'Parallax Layers', description: 'Master depth and movement effects' },
            { id: 'magnetic-buttons', name: 'Magnetic Buttons', description: 'Create buttons that follow your cursor' },
            { id: 'liquid-morphing', name: 'Liquid Morphing', description: 'Smooth, organic shape transitions' },
            { id: 'gesture-navigation', name: 'Gesture Navigation', description: 'Touch and swipe interactions' },
            { id: 'pressure-sensitive', name: 'Pressure Sensitive', description: 'Respond to touch pressure' },
            { id: 'particle-systems', name: 'Particle Systems', description: 'Create stunning particle effects' },
            { id: 'shader-effects', name: 'Shader Effects', description: 'Advanced visual effects' },
            { id: 'holographic-ui', name: 'Holographic UI', description: 'Futuristic interface elements' },
            { id: 'neon-glow', name: 'Neon Glow', description: 'Electric, glowing effects' },
            { id: 'fluid-grids', name: 'Fluid Grids', description: 'Responsive, adaptive layouts' },
            { id: 'micro-interactions', name: 'Micro Interactions', description: 'Subtle, delightful details' }
        ];
        
        techniques.forEach(technique => {
            const item = document.createElement('div');
            item.className = `tutorial-item ${this.completedTechniques.has(technique.id) ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="technique-icon">${this.getTechniqueIcon(technique.id)}</div>
                <div class="technique-info">
                    <h3>${technique.name}</h3>
                    <p>${technique.description}</p>
                </div>
                <div class="technique-status">
                    ${this.completedTechniques.has(technique.id) ? '✅' : '⏳'}
                </div>
            `;
            
            item.addEventListener('click', () => {
                this.startTutorial(technique.id);
            });
            
            list.appendChild(item);
        });
    }
    
    getTechniqueIcon(techniqueId) {
        const icons = {
            'morphing-cards': '🃏',
            'parallax-layers': '🌊',
            'magnetic-buttons': '🧲',
            'liquid-morphing': '💧',
            'gesture-navigation': '👆',
            'pressure-sensitive': '👆',
            'particle-systems': '✨',
            'shader-effects': '🎨',
            'holographic-ui': '🔮',
            'neon-glow': '⚡',
            'fluid-grids': '📐',
            'micro-interactions': '🎯'
        };
        return icons[techniqueId] || '🌟';
    }
    
    startTutorial(techniqueId) {
        this.currentTutorial = techniqueId;
        // Implementation for specific tutorial
        console.log(`Starting tutorial for: ${techniqueId}`);
    }
    
    completeTechnique(techniqueId) {
        this.completedTechniques.add(techniqueId);
        this.updateProgress();
        this.emit('technique-learned', techniqueId);
    }
    
    updateProgress() {
        const total = 12;
        const completed = this.completedTechniques.size;
        const percentage = (completed / total) * 100;
        
        const progressFill = this.panel.querySelector('.progress-fill');
        const progressText = this.panel.querySelector('.progress-text');
        
        progressFill.style.width = `${percentage}%`;
        progressText.textContent = `${completed}/${total} Techniques Mastered`;
    }
    
    loadProgress() {
        const saved = localStorage.getItem('ui-tutorial-progress');
        if (saved) {
            this.completedTechniques = new Set(JSON.parse(saved));
            this.updateProgress();
        }
    }
    
    saveProgress() {
        localStorage.setItem('ui-tutorial-progress', JSON.stringify([...this.completedTechniques]));
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && this.isActive) {
                this.toggle();
            }
        });
    }
    
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => callback(data));
        }
    }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.VanillaUIMastery = new VanillaUIMastery();
    console.log('🌟 Vanilla UI Mastery System ready! Press Ctrl+K to open tutorial.');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VanillaUIMastery;
}
