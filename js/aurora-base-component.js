/**
 * Ÿ AURORA BASE COMPONENT
 * Base class for all Aurora UI components
 * 
 * This provides the foundation for all components with consistent patterns,
 * documentation, and functionality that future Aurora instances can rely on.
 */

class AuroraBaseComponent {
    constructor(options = {}) {
        this.options = this.mergeOptions(this.getDefaultOptions(), options);
        this.element = null;
        this.isInitialized = false;
        this.eventListeners = new Map();
        this.observers = new Map();
        
        // Component metadata
        this.metadata = {
            name: this.constructor.name,
            version: '1.0.0',
            category: 'Base',
            difficulty: 'Beginner',
            features: [],
            accessibility: true,
            mobile: true,
            performance: 'optimized'
        };
    }
    
    /**
     * Get default options for the component
     * Override in child classes
     * @returns {Object} Default options
     */
    getDefaultOptions() {
        return {
            className: '',
            id: null,
            style: {},
            attributes: {},
            events: {},
            accessibility: true,
            mobile: true,
            theme: 'cosmic'
        };
    }
    
    /**
     * Merge user options with defaults
     * @param {Object} defaults - Default options
     * @param {Object} user - User options
     * @returns {Object} Merged options
     */
    mergeOptions(defaults, user) {
        const merged = { ...defaults };
        
        for (const key in user) {
            if (user[key] !== null && user[key] !== undefined) {
                if (typeof user[key] === 'object' && !Array.isArray(user[key])) {
                    merged[key] = this.mergeOptions(merged[key] || {}, user[key]);
                } else {
                    merged[key] = user[key];
                }
            }
        }
        
        return merged;
    }
    
    /**
     * Render the component
     * Must be implemented by child classes
     * @returns {HTMLElement} The rendered component
     */
    render() {
        throw new Error('render() method must be implemented by child class');
    }
    
    /**
     * Initialize the component
     * Sets up event listeners and other initialization tasks
     */
    init() {
        if (this.isInitialized) return;
        
        this.setupEventListeners();
        this.setupAccessibility();
        this.setupMobileOptimizations();
        this.setupPerformanceOptimizations();
        
        this.isInitialized = true;
        this.emit('initialized', this);
    }
    
    /**
     * Setup event listeners
     * Override in child classes for specific events
     */
    setupEventListeners() {
        // Base event listeners can be added here
        if (this.options.events) {
            Object.entries(this.options.events).forEach(([event, handler]) => {
                this.addEventListener(event, handler);
            });
        }
    }
    
    /**
     * Setup accessibility features
     */
    setupAccessibility() {
        if (!this.options.accessibility || !this.element) return;
        
        // Add ARIA attributes
        if (this.ariaLabel) {
            this.element.setAttribute('aria-label', this.ariaLabel);
        }
        
        if (this.role) {
            this.element.setAttribute('role', this.role);
        }
        
        // Add keyboard navigation
        if (this.keyboardNavigation) {
            this.element.setAttribute('tabindex', '0');
        }
        
        // Add focus management
        if (this.focusable) {
            this.element.addEventListener('focus', () => this.emit('focus', this));
            this.element.addEventListener('blur', () => this.emit('blur', this));
        }
    }
    
    /**
     * Setup mobile optimizations
     */
    setupMobileOptimizations() {
        if (!this.options.mobile || !this.element) return;
        
        // Add touch-friendly classes
        this.element.classList.add('aurora-mobile-optimized');
        
        // Add touch event listeners if needed
        if (this.touchFriendly) {
            this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
            this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
        }
    }
    
    /**
     * Setup performance optimizations
     */
    setupPerformanceOptimizations() {
        if (!this.element) return;
        
        // Add performance monitoring
        this.element.addEventListener('click', () => {
            this.emit('interaction', { type: 'click', timestamp: Date.now() });
        });
    }
    
    /**
     * Add event listener
     * @param {string} event - Event name
     * @param {Function} handler - Event handler
     */
    addEventListener(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        
        this.eventListeners.get(event).push(handler);
        
        if (this.element) {
            this.element.addEventListener(event, handler);
        }
    }
    
    /**
     * Remove event listener
     * @param {string} event - Event name
     * @param {Function} handler - Event handler to remove
     */
    removeEventListener(event, handler) {
        if (!this.eventListeners.has(event)) return;
        
        const handlers = this.eventListeners.get(event);
        const index = handlers.indexOf(handler);
        
        if (index > -1) {
            handlers.splice(index, 1);
        }
        
        if (this.element) {
            this.element.removeEventListener(event, handler);
        }
    }
    
    /**
     * Emit custom event
     * @param {string} event - Event name
     * @param {*} data - Event data
     */
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(handler => {
                try {
                    handler(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            });
        }
    }
    
    /**
     * Update component options
     * @param {Object} newOptions - New options to merge
     */
    update(newOptions) {
        this.options = this.mergeOptions(this.options, newOptions);
        this.refresh();
    }
    
    /**
     * Refresh the component
     * Re-renders with current options
     */
    refresh() {
        if (!this.element) return;
        
        const parent = this.element.parentNode;
        const nextSibling = this.element.nextSibling;
        
        // Remove old element
        this.element.remove();
        
        // Create new element
        this.element = this.render();
        
        // Insert new element
        if (parent) {
            if (nextSibling) {
                parent.insertBefore(this.element, nextSibling);
            } else {
                parent.appendChild(this.element);
            }
        }
        
        // Re-initialize
        this.init();
    }
    
    /**
     * Destroy the component
     * Clean up event listeners and observers
     */
    destroy() {
        // Remove all event listeners
        this.eventListeners.forEach((handlers, event) => {
            handlers.forEach(handler => {
                if (this.element) {
                    this.element.removeEventListener(event, handler);
                }
            });
        });
        this.eventListeners.clear();
        
        // Disconnect observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
        
        // Remove element
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.element = null;
        this.isInitialized = false;
        
        this.emit('destroyed', this);
    }
    
    /**
     * Get component documentation
     * @returns {Object} Component documentation
     */
    getDocumentation() {
        return {
            name: this.metadata.name,
            version: this.metadata.version,
            category: this.metadata.category,
            difficulty: this.metadata.difficulty,
            features: this.metadata.features,
            accessibility: this.metadata.accessibility,
            mobile: this.metadata.mobile,
            performance: this.metadata.performance,
            options: this.getDefaultOptions(),
            methods: this.getPublicMethods(),
            events: this.getPublicEvents(),
            examples: this.getExamples()
        };
    }
    
    /**
     * Get public methods
     * @returns {Array} List of public methods
     */
    getPublicMethods() {
        return [
            'init()',
            'update(options)',
            'refresh()',
            'destroy()',
            'addEventListener(event, handler)',
            'removeEventListener(event, handler)',
            'emit(event, data)',
            'getDocumentation()'
        ];
    }
    
    /**
     * Get public events
     * @returns {Array} List of public events
     */
    getPublicEvents() {
        return [
            'initialized',
            'destroyed',
            'focus',
            'blur',
            'interaction'
        ];
    }
    
    /**
     * Get usage examples
     * @returns {Array} List of examples
     */
    getExamples() {
        return [
            {
                title: 'Basic Usage',
                code: `const component = new ${this.metadata.name}();
const element = component.render();
document.body.appendChild(element);
component.init();`,
                description: 'Basic component creation and initialization'
            }
        ];
    }
    
    /**
     * Handle touch start
     * @param {TouchEvent} event - Touch event
     */
    handleTouchStart(event) {
        this.emit('touchstart', event);
    }
    
    /**
     * Handle touch end
     * @param {TouchEvent} event - Touch event
     */
    handleTouchEnd(event) {
        this.emit('touchend', event);
    }
    
    /**
     * Get component element
     * @returns {HTMLElement} The component element
     */
    getElement() {
        return this.element;
    }
    
    /**
     * Check if component is initialized
     * @returns {boolean} Initialization status
     */
    isReady() {
        return this.isInitialized;
    }
    
    /**
     * Get component options
     * @returns {Object} Current options
     */
    getOptions() {
        return { ...this.options };
    }
    
    /**
     * Set component option
     * @param {string} key - Option key
     * @param {*} value - Option value
     */
    setOption(key, value) {
        this.options[key] = value;
        this.emit('optionChanged', { key, value });
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuroraBaseComponent;
} else if (typeof window !== 'undefined') {
    window.AuroraBaseComponent = AuroraBaseComponent;
}


