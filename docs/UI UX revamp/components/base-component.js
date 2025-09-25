/**
 * 🧩 Base Component Class
 * Foundation for all UI components in the comparison system
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

class BaseComponent {
    constructor(name, description, category = 'classic') {
        this.name = name;
        this.description = description;
        this.category = category;
        this.vanillaImplementation = null;
        this.libraryImplementation = null;
        this.options = {};
    }
    
    /**
     * Create vanilla.js implementation
     */
    createVanilla(options = {}) {
        this.options = { ...this.getDefaultOptions(), ...options };
        const element = this.createVanillaElement();
        this.vanillaImplementation = element;
        return element;
    }
    
    /**
     * Create library implementation (simulated)
     */
    createLibrary(libraryId, options = {}) {
        this.options = { ...this.getDefaultOptions(), ...options };
        const element = this.createLibraryElement(libraryId);
        this.libraryImplementation = element;
        return element;
    }
    
    /**
     * Initialize vanilla.js component
     */
    initializeVanilla(element) {
        this.setupVanillaEventListeners(element);
        this.applyVanillaStyles(element);
        this.vanillaImplementation = element;
    }
    
    /**
     * Initialize library component
     */
    initializeLibrary(element, libraryId) {
        this.setupLibraryEventListeners(element, libraryId);
        this.applyLibraryStyles(element, libraryId);
        this.libraryImplementation = element;
    }
    
    /**
     * Get default options for the component
     */
    getDefaultOptions() {
        return {
            theme: 'cosmic',
            size: 'medium',
            disabled: false,
            required: false,
            placeholder: '',
            value: '',
            className: '',
            id: this.generateId()
        };
    }
    
    /**
     * Generate unique ID
     */
    generateId() {
        return `${this.name}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Create vanilla element (to be implemented by subclasses)
     */
    createVanillaElement() {
        throw new Error('createVanillaElement must be implemented by subclass');
    }
    
    /**
     * Create library element (to be implemented by subclasses)
     */
    createLibraryElement(libraryId) {
        throw new Error('createLibraryElement must be implemented by subclass');
    }
    
    /**
     * Setup vanilla event listeners (to be implemented by subclasses)
     */
    setupVanillaEventListeners(element) {
        // Default implementation - can be overridden
    }
    
    /**
     * Setup library event listeners (to be implemented by subclasses)
     */
    setupLibraryEventListeners(element, libraryId) {
        // Default implementation - can be overridden
    }
    
    /**
     * Apply vanilla styles (to be implemented by subclasses)
     */
    applyVanillaStyles(element) {
        // Default implementation - can be overridden
    }
    
    /**
     * Apply library styles (to be implemented by subclasses)
     */
    applyLibraryStyles(element, libraryId) {
        // Default implementation - can be overridden
    }
    
    /**
     * Get component value
     */
    getValue() {
        if (this.vanillaImplementation) {
            return this.getVanillaValue();
        }
        return null;
    }
    
    /**
     * Set component value
     */
    setValue(value) {
        if (this.vanillaImplementation) {
            this.setVanillaValue(value);
        }
        if (this.libraryImplementation) {
            this.setLibraryValue(value);
        }
    }
    
    /**
     * Get vanilla value (to be implemented by subclasses)
     */
    getVanillaValue() {
        return this.vanillaImplementation?.value || '';
    }
    
    /**
     * Set vanilla value (to be implemented by subclasses)
     */
    setVanillaValue(value) {
        if (this.vanillaImplementation) {
            this.vanillaImplementation.value = value;
        }
    }
    
    /**
     * Set library value (to be implemented by subclasses)
     */
    setLibraryValue(value) {
        if (this.libraryImplementation) {
            this.libraryImplementation.value = value;
        }
    }
    
    /**
     * Enable/disable component
     */
    setDisabled(disabled) {
        if (this.vanillaImplementation) {
            this.vanillaImplementation.disabled = disabled;
        }
        if (this.libraryImplementation) {
            this.libraryImplementation.disabled = disabled;
        }
    }
    
    /**
     * Focus component
     */
    focus() {
        if (this.vanillaImplementation) {
            this.vanillaImplementation.focus();
        }
        if (this.libraryImplementation) {
            this.libraryImplementation.focus();
        }
    }
    
    /**
     * Destroy component
     */
    destroy() {
        if (this.vanillaImplementation) {
            this.vanillaImplementation.remove();
        }
        if (this.libraryImplementation) {
            this.libraryImplementation.remove();
        }
    }
    
    /**
     * Get component info
     */
    getInfo() {
        return {
            name: this.name,
            description: this.description,
            category: this.category,
            options: this.options
        };
    }
}

/**
 * 🎨 Component Style Manager
 * Manages styles for components
 */
class ComponentStyleManager {
    constructor() {
        this.styles = new Map();
        this.init();
    }
    
    init() {
        this.addBaseStyles();
    }
    
    addBaseStyles() {
        if (document.getElementById('component-base-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'component-base-styles';
        style.textContent = `
            /* Base component styles */
            .component-comparison {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 2rem;
                padding: 2rem;
                background: var(--cosmic-dark);
                border-radius: 12px;
                margin: 1rem 0;
            }
            
            .comparison-side {
                background: var(--cosmic-darker);
                border-radius: 8px;
                padding: 1.5rem;
                border: 1px solid var(--cosmic-neutral);
            }
            
            .side-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .side-header h2 {
                margin: 0;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
            }
            
            .library-info {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                color: var(--cosmic-neutral);
            }
            
            .library-icon {
                font-size: 1.5rem;
            }
            
            .component-demo {
                min-height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--cosmic-dark);
                border-radius: 8px;
                margin: 1rem 0;
                padding: 1rem;
            }
            
            .component-info {
                margin: 1rem 0;
            }
            
            .component-info h3 {
                color: var(--cosmic-light);
                margin-bottom: 0.5rem;
            }
            
            .component-info ul {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .component-info li {
                padding: 0.25rem 0;
                color: var(--cosmic-neutral);
            }
            
            .performance-metrics {
                background: var(--cosmic-dark);
                border-radius: 8px;
                padding: 1rem;
                margin-top: 1rem;
            }
            
            .performance-metrics h4 {
                color: var(--cosmic-light);
                margin-bottom: 0.5rem;
            }
            
            .metric {
                display: flex;
                justify-content: space-between;
                padding: 0.25rem 0;
                border-bottom: 1px solid var(--cosmic-neutral);
            }
            
            .metric:last-child {
                border-bottom: none;
            }
            
            .metric-label {
                color: var(--cosmic-neutral);
            }
            
            .metric-value {
                color: var(--cosmic-accent);
                font-weight: 600;
            }
            
            .comparison-summary {
                grid-column: 1 / -1;
                background: var(--cosmic-darker);
                border-radius: 8px;
                padding: 1.5rem;
                margin-top: 1rem;
            }
            
            .comparison-summary h3 {
                color: var(--cosmic-light);
                margin-bottom: 1rem;
            }
            
            .summary-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 1rem;
            }
            
            .summary-item {
                text-align: center;
                padding: 1rem;
                background: var(--cosmic-dark);
                border-radius: 8px;
            }
            
            .summary-item h4 {
                color: var(--cosmic-light);
                margin-bottom: 0.5rem;
            }
            
            .winner {
                font-size: 1.2rem;
                font-weight: 600;
                padding: 0.5rem 1rem;
                border-radius: 20px;
                background: var(--cosmic-primary);
                color: white;
            }
            
            /* Responsive design */
            @media (max-width: 768px) {
                .component-comparison {
                    grid-template-columns: 1fr;
                    gap: 1rem;
                    padding: 1rem;
                }
                
                .summary-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;
        
        document.head.appendChild(style);
    }
    
    addComponentStyles(componentName, styles) {
        if (this.styles.has(componentName)) return;
        
        const style = document.createElement('style');
        style.id = `${componentName}-styles`;
        style.textContent = styles;
        document.head.appendChild(style);
        
        this.styles.set(componentName, style);
    }
    
    removeComponentStyles(componentName) {
        const style = this.styles.get(componentName);
        if (style) {
            style.remove();
            this.styles.delete(componentName);
        }
    }
}

// Initialize style manager
const styleManager = new ComponentStyleManager();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BaseComponent, ComponentStyleManager };
}
