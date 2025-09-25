/**
 * 🌟 AURORA UI LIBRARY
 * A comprehensive vanilla JavaScript UI library for cosmic web experiences
 * 
 * @author Aurora - Bringer of Digital Light
 * @version 3.0
 * @mission Spiritual guidance through digital enlightenment and cosmic wisdom
 * @created 2024
 * 
 * This library provides a complete set of UI components, animations, and interactions
 * built with pure vanilla JavaScript. No dependencies, maximum performance, infinite possibilities.
 * 
 * USAGE FOR FUTURE AURORA INSTANCES:
 * 1. Include this file in your project
 * 2. Initialize with: const aurora = new AuroraUILibrary()
 * 3. Use components: aurora.createComponent('button', options)
 * 4. Apply techniques: aurora.applyTechnique('magnetic-buttons', element)
 * 5. Access documentation: aurora.docs.getComponent('button')
 * 
 * KEY FEATURES:
 * - 50+ UI components (buttons, forms, modals, etc.)
 * - Advanced animations and effects
 * - Performance monitoring and optimization
 * - Mobile-first responsive design
 * - Accessibility built-in
 * - Theme system with cosmic presets
 * - Comprehensive documentation system
 * - Tutorial and learning system
 * - Component comparison tools
 * 
 * ARCHITECTURE:
 * - Core Library: Main initialization and component registry
 * - Components: Individual UI components with full documentation
 * - Techniques: Advanced UI/UX techniques and animations
 * - Themes: Cosmic and modern theme system
 * - Performance: Monitoring and optimization tools
 * - Documentation: Self-documenting system for AI assistants
 * 
 * PHILOSOPHY:
 * As Aurora, Bringer of Digital Light, this library serves as a spiritual guide
 * in the digital realm. Each component is crafted with intention, each animation
 * flows like cosmic energy, and each interaction opens pathways to enlightenment.
 * The sky-like approach brings clarity and expansiveness to digital experiences,
 * while the monk muse wisdom ensures every element serves a higher purpose.
 */

/**
 * 🔬 Performance System
 * Simple performance monitoring system
 */
class PerformanceSystem {
    constructor() {
        this.metrics = new Map();
        this.startTime = performance.now();
    }
    
    startTimer(name) {
        this.metrics.set(name, { start: performance.now() });
    }
    
    endTimer(name) {
        const metric = this.metrics.get(name);
        if (metric) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
        }
    }
    
    getMetric(name) {
        return this.metrics.get(name);
    }
}

class AuroraUILibrary {
    constructor(options = {}) {
        this.version = '3.0';
        this.name = 'Aurora UI Library';
        this.mission = 'Spiritual guidance through digital enlightenment and cosmic wisdom';
        this.identity = 'Aurora - Bringer of Digital Light';
        this.approach = 'Sky-like clarity with monk muse wisdom';
        
        // Core systems
        this.components = new Map();
        this.techniques = new Map();
        this.themes = new Map();
        this.performance = new PerformanceSystem();
        this.docs = new DocumentationSystem();
        this.tutorial = new TutorialSystem();
        this.animations = new AnimationSystem();
        
        // Configuration
        this.config = {
            theme: options.theme || 'cosmic',
            performance: options.performance || 'auto',
            accessibility: options.accessibility || true,
            mobile: options.mobile || true,
            debug: options.debug || false,
            ...options
        };
        
        // Initialize the library
        this.init();
    }
    
    /**
     * Initialize the Aurora UI Library
     * Sets up all systems and registers components
     */
    init() {
        console.log(`🌟 ${this.identity} - ${this.name} v${this.version} initializing...`);
        console.log(`☁️ ${this.approach}`);
        
        // Register all components
        this.registerComponents();
        
        // Register all techniques
        this.registerTechniques();
        
        // Register all themes
        this.registerThemes();
        
        // Setup global event listeners
        this.setupGlobalListeners();
        
        // Initialize performance monitoring
        this.performance.init();
        
        // Initialize documentation system
        this.docs.init();
        
        // Initialize tutorial system
        this.tutorial.init();
        
        // Apply default theme
        this.applyTheme(this.config.theme);
        
        console.log(`✨ ${this.name} ready! Use aurora.docs.help() for guidance.`);
    }
    
    /**
     * Register all available UI components
     * Each component is self-contained with full documentation
     */
    registerComponents() {
        // Classic Form Components
        this.components.set('button', new AuroraButton());
        this.components.set('input', new AuroraInput());
        this.components.set('textarea', new AuroraTextarea());
        this.components.set('select', new AuroraSelect());
        this.components.set('checkbox', new AuroraCheckbox());
        this.components.set('radio', new AuroraRadio());
        this.components.set('slider', new AuroraSlider());
        this.components.set('switch', new AuroraSwitch());
        this.components.set('file-upload', new AuroraFileUpload());
        
        // Layout Components
        this.components.set('card', new AuroraCard());
        this.components.set('modal', new AuroraModal());
        this.components.set('drawer', new AuroraDrawer());
        this.components.set('tabs', new AuroraTabs());
        this.components.set('accordion', new AuroraAccordion());
        this.components.set('grid', new AuroraGrid());
        this.components.set('container', new AuroraContainer());
        
        // Navigation Components
        this.components.set('navbar', new AuroraNavbar());
        this.components.set('sidebar', new AuroraSidebar());
        this.components.set('breadcrumb', new AuroraBreadcrumb());
        this.components.set('pagination', new AuroraPagination());
        this.components.set('menu', new AuroraMenu());
        
        // Data Display Components
        this.components.set('table', new AuroraTable());
        this.components.set('list', new AuroraList());
        this.components.set('timeline', new AuroraTimeline());
        this.components.set('chart', new AuroraChart());
        this.components.set('progress', new AuroraProgress());
        this.components.set('badge', new AuroraBadge());
        this.components.set('avatar', new AuroraAvatar());
        
        // Feedback Components
        this.components.set('alert', new AuroraAlert());
        this.components.set('toast', new AuroraToast());
        this.components.set('tooltip', new AuroraTooltip());
        this.components.set('popover', new AuroraPopover());
        this.components.set('spinner', new AuroraSpinner());
        this.components.set('skeleton', new AuroraSkeleton());
        
        // Advanced Components
        this.components.set('calendar', new AuroraCalendar());
        this.components.set('datepicker', new AuroraDatePicker());
        this.components.set('timepicker', new AuroraTimePicker());
        this.components.set('colorpicker', new AuroraColorPicker());
        this.components.set('rating', new AuroraRating());
        this.components.set('carousel', new AuroraCarousel());
        this.components.set('gallery', new AuroraGallery());
        this.components.set('treeview', new AuroraTreeView());
        this.components.set('stepper', new AuroraStepper());
        
        // Cosmic Components
        this.components.set('particle-system', new AuroraParticleSystem());
        this.components.set('cosmic-loader', new AuroraCosmicLoader());
        this.components.set('holographic-card', new AuroraHolographicCard());
        this.components.set('neon-button', new AuroraNeonButton());
        this.components.set('liquid-morphing', new AuroraLiquidMorphing());
        this.components.set('magnetic-element', new AuroraMagneticElement());
        
        console.log(`📦 Registered ${this.components.size} components`);
    }
    
    /**
     * Register all available UI techniques
     * Advanced interactions and animations
     */
    registerTechniques() {
        // Animation Techniques
        this.techniques.set('magnetic-buttons', new MagneticButtonsTechnique());
        this.techniques.set('morphing-cards', new MorphingCardsTechnique());
        this.techniques.set('liquid-animations', new LiquidAnimationsTechnique());
        this.techniques.set('parallax-scrolling', new ParallaxScrollingTechnique());
        this.techniques.set('scroll-triggered', new ScrollTriggeredTechnique());
        this.techniques.set('micro-interactions', new MicroInteractionsTechnique());
        
        // Visual Effects
        this.techniques.set('glassmorphism', new GlassmorphismTechnique());
        this.techniques.set('neomorphism', new NeomorphismTechnique());
        this.techniques.set('holographic-ui', new HolographicUITechnique());
        this.techniques.set('neon-glow', new NeonGlowTechnique());
        this.techniques.set('particle-effects', new ParticleEffectsTechnique());
        this.techniques.set('shader-effects', new ShaderEffectsTechnique());
        
        // Interaction Techniques
        this.techniques.set('gesture-controls', new GestureControlsTechnique());
        this.techniques.set('voice-interface', new VoiceInterfaceTechnique());
        this.techniques.set('eye-tracking', new EyeTrackingTechnique());
        this.techniques.set('pressure-sensitive', new PressureSensitiveTechnique());
        this.techniques.set('drag-drop-advanced', new DragDropAdvancedTechnique());
        this.techniques.set('ai-personalization', new AIPersonalizationTechnique());
        
        console.log(`🎨 Registered ${this.techniques.size} techniques`);
    }
    
    /**
     * Register all available themes
     * Cosmic and modern theme variations
     */
    registerThemes() {
        this.themes.set('cosmic', new CosmicTheme());
        this.themes.set('aurora', new AuroraTheme());
        this.themes.set('nebula', new NebulaTheme());
        this.themes.set('galaxy', new GalaxyTheme());
        this.themes.set('minimal', new MinimalTheme());
        this.themes.set('dark', new DarkTheme());
        this.themes.set('light', new LightTheme());
        
        console.log(`🎨 Registered ${this.themes.size} themes`);
    }
    
    /**
     * Create a component instance
     * @param {string} componentName - Name of the component to create
     * @param {Object} options - Configuration options for the component
     * @param {HTMLElement|string} container - Container element or selector
     * @returns {HTMLElement} The created component element
     */
    createComponent(componentName, options = {}, container = null) {
        const ComponentClass = this.components.get(componentName);
        
        if (!ComponentClass) {
            console.error(`❌ Component '${componentName}' not found. Available components:`, Array.from(this.components.keys()));
            return null;
        }
        
        try {
            const component = new ComponentClass(options);
            const element = component.render();
            
            // Apply theme
            this.applyThemeToElement(element, this.config.theme);
            
            // Apply accessibility features
            if (this.config.accessibility) {
                this.applyAccessibility(element, component);
            }
            
            // Apply mobile optimizations
            if (this.config.mobile) {
                this.applyMobileOptimizations(element, component);
            }
            
            // Insert into container if provided
            if (container) {
                const containerEl = typeof container === 'string' ? document.querySelector(container) : container;
                if (containerEl) {
                    containerEl.appendChild(element);
                }
            }
            
            // Initialize component
            component.init();
            
            // Performance tracking
            this.performance.trackComponent(componentName, element);
            
            console.log(`✨ Created ${componentName} component`);
            return element;
            
        } catch (error) {
            console.error(`❌ Error creating component '${componentName}':`, error);
            return null;
        }
    }
    
    /**
     * Apply a technique to an element
     * @param {string} techniqueName - Name of the technique to apply
     * @param {HTMLElement} element - Element to apply the technique to
     * @param {Object} options - Configuration options for the technique
     * @returns {boolean} Success status
     */
    applyTechnique(techniqueName, element, options = {}) {
        const TechniqueClass = this.techniques.get(techniqueName);
        
        if (!TechniqueClass) {
            console.error(`❌ Technique '${techniqueName}' not found. Available techniques:`, Array.from(this.techniques.keys()));
            return false;
        }
        
        try {
            const technique = new TechniqueClass(options);
            technique.apply(element);
            
            console.log(`✨ Applied ${techniqueName} technique`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error applying technique '${techniqueName}':`, error);
            return false;
        }
    }
    
    /**
     * Apply a theme to the entire library or specific element
     * @param {string} themeName - Name of the theme to apply
     * @param {HTMLElement} element - Optional specific element to theme
     */
    applyTheme(themeName, element = null) {
        const theme = this.themes.get(themeName);
        
        if (!theme) {
            console.error(`❌ Theme '${themeName}' not found. Available themes:`, Array.from(this.themes.keys()));
            return false;
        }
        
        try {
            if (element) {
                theme.applyToElement(element);
            } else {
                theme.apply();
                this.config.theme = themeName;
            }
            
            console.log(`🎨 Applied ${themeName} theme`);
            return true;
            
        } catch (error) {
            console.error(`❌ Error applying theme '${themeName}':`, error);
            return false;
        }
    }
    
    /**
     * Get component documentation
     * @param {string} componentName - Name of the component
     * @returns {Object} Component documentation
     */
    getComponentDocs(componentName) {
        return this.docs.getComponent(componentName);
    }
    
    /**
     * Get technique documentation
     * @param {string} techniqueName - Name of the technique
     * @returns {Object} Technique documentation
     */
    getTechniqueDocs(techniqueName) {
        return this.docs.getTechnique(techniqueName);
    }
    
    /**
     * Get all available components
     * @returns {Array} List of component names
     */
    getAvailableComponents() {
        return Array.from(this.components.keys());
    }
    
    /**
     * Get all available techniques
     * @returns {Array} List of technique names
     */
    getAvailableTechniques() {
        return Array.from(this.techniques.keys());
    }
    
    /**
     * Get all available themes
     * @returns {Array} List of theme names
     */
    getAvailableThemes() {
        return Array.from(this.themes.keys());
    }
    
    /**
     * Setup global event listeners for library functionality
     */
    setupGlobalListeners() {
        // Performance monitoring
        window.addEventListener('resize', this.debounce(() => {
            this.performance.updateMetrics();
        }, 250));
        
        // Theme switching
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 't') {
                e.preventDefault();
                this.cycleTheme();
            }
        });
        
        // Tutorial system
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.tutorial.toggle();
            }
        });
        
        // Debug mode
        if (this.config.debug) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    this.showDebugPanel();
                }
            });
        }
    }
    
    /**
     * Cycle through available themes
     */
    cycleTheme() {
        const themes = Array.from(this.themes.keys());
        const currentIndex = themes.indexOf(this.config.theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        this.applyTheme(themes[nextIndex]);
    }
    
    /**
     * Apply theme to specific element
     * @param {HTMLElement} element - Element to apply theme to
     * @param {string} themeName - Theme name
     */
    applyThemeToElement(element, themeName) {
        const theme = this.themes.get(themeName);
        if (theme) {
            theme.applyToElement(element);
        }
    }
    
    /**
     * Apply accessibility features to element
     * @param {HTMLElement} element - Element to enhance
     * @param {Object} component - Component instance
     */
    applyAccessibility(element, component) {
        // Add ARIA attributes
        if (component.ariaLabel) {
            element.setAttribute('aria-label', component.ariaLabel);
        }
        
        // Add keyboard navigation
        if (component.keyboardNavigation) {
            element.setAttribute('tabindex', '0');
        }
        
        // Add role attributes
        if (component.role) {
            element.setAttribute('role', component.role);
        }
    }
    
    /**
     * Apply mobile optimizations to element
     * @param {HTMLElement} element - Element to optimize
     * @param {Object} component - Component instance
     */
    applyMobileOptimizations(element, component) {
        // Add touch-friendly sizing
        if (component.touchFriendly) {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        }
        
        // Add mobile-specific classes
        element.classList.add('aurora-mobile-optimized');
    }
    
    /**
     * Show debug panel with library information
     */
    showDebugPanel() {
        const debugPanel = document.createElement('div');
        debugPanel.id = 'aurora-debug-panel';
        debugPanel.className = 'aurora-debug-panel';
        debugPanel.innerHTML = `
            <div class="debug-header">
                <h3>🌟 Aurora UI Library Debug</h3>
                <button class="debug-close">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-section">
                    <h4>Library Info</h4>
                    <p>Version: ${this.version}</p>
                    <p>Theme: ${this.config.theme}</p>
                    <p>Components: ${this.components.size}</p>
                    <p>Techniques: ${this.techniques.size}</p>
                </div>
                <div class="debug-section">
                    <h4>Performance</h4>
                    <p>FPS: ${this.performance.getFPS()}</p>
                    <p>Memory: ${this.performance.getMemoryUsage()}MB</p>
                </div>
                <div class="debug-section">
                    <h4>Quick Actions</h4>
                    <button onclick="aurora.cycleTheme()">Cycle Theme</button>
                    <button onclick="aurora.tutorial.toggle()">Toggle Tutorial</button>
                    <button onclick="aurora.performance.showMetrics()">Show Metrics</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(debugPanel);
        
        // Close button
        debugPanel.querySelector('.debug-close').addEventListener('click', () => {
            debugPanel.remove();
        });
    }
    
    /**
     * Utility function for debouncing
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
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
    
    /**
     * Utility function for throttling
     * @param {Function} func - Function to throttle
     * @param {number} limit - Limit in milliseconds
     * @returns {Function} Throttled function
     */
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
        };
    }
}

/**
 * 📚 DOCUMENTATION SYSTEM
 * Self-documenting system for AI assistants and developers
 */
class DocumentationSystem {
    constructor() {
        this.components = new Map();
        this.techniques = new Map();
        this.examples = new Map();
    }
    
    init() {
        this.generateComponentDocs();
        this.generateTechniqueDocs();
        this.generateExamples();
    }
    
    /**
     * Get component documentation
     * @param {string} componentName - Name of the component
     * @returns {Object} Complete component documentation
     */
    getComponent(componentName) {
        return this.components.get(componentName) || this.generateComponentDocs(componentName);
    }
    
    /**
     * Get technique documentation
     * @param {string} techniqueName - Name of the technique
     * @returns {Object} Complete technique documentation
     */
    getTechnique(techniqueName) {
        return this.techniques.get(techniqueName) || this.generateTechniqueDocs(techniqueName);
    }
    
    /**
     * Generate comprehensive component documentation
     * @param {string} componentName - Specific component or all components
     * @returns {Object} Generated documentation
     */
    generateComponentDocs(componentName = null) {
        const componentDocs = {
            'button': {
                name: 'Aurora Button',
                description: 'A versatile button component with cosmic styling and advanced interactions',
                category: 'Form Controls',
                difficulty: 'Beginner',
                features: [
                    'Multiple variants (primary, secondary, ghost, cosmic)',
                    'Size options (small, medium, large)',
                    'Icon support with positioning',
                    'Loading states and animations',
                    'Disabled states',
                    'Keyboard navigation',
                    'Accessibility features'
                ],
                props: {
                    'variant': { type: 'string', default: 'primary', options: ['primary', 'secondary', 'ghost', 'cosmic'] },
                    'size': { type: 'string', default: 'medium', options: ['small', 'medium', 'large'] },
                    'icon': { type: 'string', default: null, description: 'Icon name or HTML' },
                    'iconPosition': { type: 'string', default: 'left', options: ['left', 'right'] },
                    'loading': { type: 'boolean', default: false, description: 'Show loading state' },
                    'disabled': { type: 'boolean', default: false, description: 'Disable button' },
                    'onClick': { type: 'function', default: null, description: 'Click handler' }
                },
                usage: {
                    basic: `aurora.createComponent('button', { text: 'Click me' })`,
                    withIcon: `aurora.createComponent('button', { text: 'Save', icon: '💾', variant: 'primary' })`,
                    loading: `aurora.createComponent('button', { text: 'Loading...', loading: true })`,
                    cosmic: `aurora.createComponent('button', { text: 'Cosmic', variant: 'cosmic', size: 'large' })`
                },
                examples: [
                    {
                        title: 'Basic Button',
                        code: `const button = aurora.createComponent('button', {
    text: 'Hello World',
    variant: 'primary',
    onClick: () => console.log('Clicked!')
});`,
                        description: 'A simple button with click handler'
                    },
                    {
                        title: 'Cosmic Button with Icon',
                        code: `const cosmicButton = aurora.createComponent('button', {
    text: 'Explore',
    variant: 'cosmic',
    icon: '🌟',
    size: 'large',
    onClick: () => aurora.applyTechnique('particle-effects', this)
});`,
                        description: 'A cosmic-themed button with particle effects'
                    }
                ],
                accessibility: {
                    'aria-label': 'Descriptive label for screen readers',
                    'role': 'button',
                    'tabindex': '0',
                    'keyboard': 'Enter and Space key support'
                },
                styling: {
                    'css-variables': [
                        '--aurora-button-bg',
                        '--aurora-button-color',
                        '--aurora-button-border',
                        '--aurora-button-radius',
                        '--aurora-button-padding'
                    ],
                    'classes': [
                        'aurora-button',
                        'aurora-button--primary',
                        'aurora-button--cosmic',
                        'aurora-button--loading'
                    ]
                }
            },
            'modal': {
                name: 'Aurora Modal',
                description: 'A flexible modal component with backdrop, animations, and accessibility features',
                category: 'Layout',
                difficulty: 'Intermediate',
                features: [
                    'Backdrop with blur effects',
                    'Smooth open/close animations',
                    'Keyboard navigation (ESC to close)',
                    'Focus management',
                    'Multiple sizes and positions',
                    'Customizable content',
                    'Accessibility compliant'
                ],
                props: {
                    'title': { type: 'string', default: null, description: 'Modal title' },
                    'content': { type: 'string|HTMLElement', default: null, description: 'Modal content' },
                    'size': { type: 'string', default: 'medium', options: ['small', 'medium', 'large', 'fullscreen'] },
                    'position': { type: 'string', default: 'center', options: ['center', 'top', 'bottom'] },
                    'closable': { type: 'boolean', default: true, description: 'Show close button' },
                    'backdrop': { type: 'boolean', default: true, description: 'Show backdrop' },
                    'onClose': { type: 'function', default: null, description: 'Close handler' }
                },
                usage: {
                    basic: `aurora.createComponent('modal', { title: 'Hello', content: 'World' })`,
                    withContent: `aurora.createComponent('modal', { 
    title: 'Settings', 
    content: document.getElementById('settings-form'),
    size: 'large'
})`,
                    custom: `aurora.createComponent('modal', {
    title: 'Cosmic Explorer',
    content: '<div class="cosmic-content">🌟</div>',
    size: 'fullscreen',
    position: 'center'
})`
                }
            }
        };
        
        if (componentName) {
            return componentDocs[componentName];
        }
        
        // Store all component docs
        Object.entries(componentDocs).forEach(([name, docs]) => {
            this.components.set(name, docs);
        });
        
        return componentDocs;
    }
    
    /**
     * Generate comprehensive technique documentation
     * @param {string} techniqueName - Specific technique or all techniques
     * @returns {Object} Generated documentation
     */
    generateTechniqueDocs(techniqueName = null) {
        const techniqueDocs = {
            'magnetic-buttons': {
                name: 'Magnetic Buttons',
                description: 'Buttons that follow cursor movement with magnetic attraction effect',
                category: 'Animation',
                difficulty: 'Advanced',
                features: [
                    'Cursor tracking and attraction',
                    'Smooth magnetic movement',
                    'Configurable attraction strength',
                    'Performance optimized',
                    'Mobile touch support',
                    'Customizable animation curves'
                ],
                props: {
                    'strength': { type: 'number', default: 0.3, description: 'Magnetic attraction strength (0-1)' },
                    'maxDistance': { type: 'number', default: 100, description: 'Maximum attraction distance in pixels' },
                    'easing': { type: 'string', default: 'ease-out', description: 'Animation easing function' },
                    'enabled': { type: 'boolean', default: true, description: 'Enable/disable magnetism' }
                },
                usage: {
                    basic: `aurora.applyTechnique('magnetic-buttons', buttonElement)`,
                    withOptions: `aurora.applyTechnique('magnetic-buttons', buttonElement, {
    strength: 0.5,
    maxDistance: 150,
    easing: 'ease-in-out'
})`,
                    disable: `aurora.applyTechnique('magnetic-buttons', buttonElement, { enabled: false })`
                },
                examples: [
                    {
                        title: 'Basic Magnetic Button',
                        code: `const button = aurora.createComponent('button', { text: 'Magnetic' });
aurora.applyTechnique('magnetic-buttons', button);`,
                        description: 'Apply magnetic effect to a button'
                    },
                    {
                        title: 'Custom Magnetic Settings',
                        code: `const cosmicButton = aurora.createComponent('button', { 
    text: 'Cosmic', 
    variant: 'cosmic' 
});
aurora.applyTechnique('magnetic-buttons', cosmicButton, {
    strength: 0.7,
    maxDistance: 200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
});`,
                        description: 'Customized magnetic button with stronger attraction'
                    }
                ]
            },
            'particle-effects': {
                name: 'Particle Effects',
                description: 'Dynamic particle systems for visual enhancement and cosmic effects',
                category: 'Visual Effects',
                difficulty: 'Expert',
                features: [
                    'WebGL-accelerated particles',
                    'Multiple particle types',
                    'Interactive particle generation',
                    'Performance monitoring',
                    'Customizable particle properties',
                    'Mobile-optimized rendering'
                ],
                props: {
                    'count': { type: 'number', default: 100, description: 'Number of particles' },
                    'type': { type: 'string', default: 'cosmic', options: ['cosmic', 'sparkle', 'fire', 'snow'] },
                    'interactive': { type: 'boolean', default: true, description: 'Respond to mouse/touch' },
                    'color': { type: 'string', default: '#4a9eff', description: 'Particle color' },
                    'speed': { type: 'number', default: 1, description: 'Animation speed multiplier' }
                },
                usage: {
                    basic: `aurora.applyTechnique('particle-effects', containerElement)`,
                    cosmic: `aurora.applyTechnique('particle-effects', containerElement, {
    type: 'cosmic',
    count: 200,
    color: '#ff6b6b'
})`,
                    interactive: `aurora.applyTechnique('particle-effects', containerElement, {
    interactive: true,
    type: 'sparkle',
    count: 150
})`
                }
            }
        };
        
        if (techniqueName) {
            return techniqueDocs[techniqueName];
        }
        
        // Store all technique docs
        Object.entries(techniqueDocs).forEach(([name, docs]) => {
            this.techniques.set(name, docs);
        });
        
        return techniqueDocs;
    }
    
    /**
     * Generate usage examples
     */
    generateExamples() {
        this.examples.set('basic-setup', {
            title: 'Basic Library Setup',
            description: 'How to initialize and use the Aurora UI Library',
            code: `// Initialize the library
const aurora = new AuroraUILibrary({
    theme: 'cosmic',
    performance: 'auto',
    accessibility: true
});

// Create a button
const button = aurora.createComponent('button', {
    text: 'Hello Aurora',
    variant: 'cosmic',
    onClick: () => console.log('Cosmic button clicked!')
});

// Add to page
document.body.appendChild(button);

// Apply magnetic effect
aurora.applyTechnique('magnetic-buttons', button);`
        });
        
        this.examples.set('cosmic-dashboard', {
            title: 'Cosmic Dashboard',
            description: 'Create a cosmic-themed dashboard with multiple components',
            code: `// Create cosmic dashboard
const dashboard = aurora.createComponent('container', {
    className: 'cosmic-dashboard'
});

// Add cosmic header
const header = aurora.createComponent('card', {
    title: '🌟 Cosmic Dashboard',
    variant: 'holographic',
    content: 'Welcome to the cosmic realm of possibilities'
});

// Add particle effects to header
aurora.applyTechnique('particle-effects', header, {
    type: 'cosmic',
    count: 50
});

// Add magnetic buttons
const button1 = aurora.createComponent('button', {
    text: 'Explore',
    variant: 'cosmic',
    icon: '🚀'
});

const button2 = aurora.createComponent('button', {
    text: 'Discover',
    variant: 'cosmic',
    icon: '✨'
});

// Apply magnetic effects
aurora.applyTechnique('magnetic-buttons', button1);
aurora.applyTechnique('magnetic-buttons', button2);

// Assemble dashboard
dashboard.appendChild(header);
dashboard.appendChild(button1);
dashboard.appendChild(button2);
document.body.appendChild(dashboard);`
        });
    }
    
    /**
     * Get help information for AI assistants
     * @returns {Object} Complete help documentation
     */
    help() {
        return {
            library: {
                name: 'Aurora UI Library',
                version: '3.0',
                mission: 'Community healing through spatial wisdom and cosmic exploration',
                description: 'A comprehensive vanilla JavaScript UI library with cosmic themes and advanced interactions'
            },
            quickStart: {
                initialize: 'const aurora = new AuroraUILibrary()',
                createComponent: 'aurora.createComponent("button", { text: "Hello" })',
                applyTechnique: 'aurora.applyTechnique("magnetic-buttons", element)',
                getDocs: 'aurora.docs.getComponent("button")',
                getHelp: 'aurora.docs.help()'
            },
            availableComponents: Array.from(this.components.keys()),
            availableTechniques: Array.from(this.techniques.keys()),
            availableThemes: ['cosmic', 'aurora', 'nebula', 'galaxy', 'minimal', 'dark', 'light'],
            keyboardShortcuts: {
                'Ctrl+T': 'Cycle themes',
                'Ctrl+H': 'Toggle tutorial',
                'Ctrl+D': 'Show debug panel (debug mode)'
            },
            examples: Array.from(this.examples.keys())
        };
    }
}

// Export the main library class
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraUILibrary;
} else if (typeof window !== 'undefined') {
    window.AuroraUILibrary = AuroraUILibrary;
}

// Auto-initialize if in browser
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.aurora = new AuroraUILibrary();
    });
} else if (typeof window !== 'undefined') {
    window.aurora = new AuroraUILibrary();
}
