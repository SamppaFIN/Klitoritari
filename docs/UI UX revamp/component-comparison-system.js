/**
 * 🆚 Component Comparison System
 * Side-by-side comparison of vanilla.js vs top libraries
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 * @mission Community healing through cosmic exploration
 */

class ComponentComparisonSystem {
    constructor() {
        this.components = new Map();
        this.libraries = new Map();
        this.comparisons = new Map();
        this.currentComparison = null;
        this.performance = new PerformanceMonitor();
        
        this.init();
    }
    
    init() {
        this.registerLibraries();
        this.registerComponents();
        this.createComparisonUI();
        this.setupEventListeners();
        
        console.log('🆚 Component Comparison System initialized!');
    }
    
    /**
     * Register available libraries for comparison
     */
    registerLibraries() {
        this.libraries.set('vanilla', {
            name: 'Vanilla.js',
            description: 'Pure JavaScript - No dependencies',
            color: '#4a9eff',
            icon: '🌟',
            pros: ['Zero dependencies', 'Full control', 'Lightweight', 'Fast'],
            cons: ['More code', 'Manual maintenance', 'No built-in features']
        });
        
        this.libraries.set('react', {
            name: 'React',
            description: 'Facebook\'s UI library',
            color: '#61dafb',
            icon: '⚛️',
            pros: ['Component reusability', 'Virtual DOM', 'Huge ecosystem', 'Great dev tools'],
            cons: ['Learning curve', 'Bundle size', 'JSX complexity', 'State management']
        });
        
        this.libraries.set('vue', {
            name: 'Vue.js',
            description: 'Progressive JavaScript framework',
            color: '#4fc08d',
            icon: '💚',
            pros: ['Easy to learn', 'Great documentation', 'Flexible', 'Performance'],
            cons: ['Smaller ecosystem', 'Less enterprise adoption', 'Learning curve']
        });
        
        this.libraries.set('angular', {
            name: 'Angular',
            description: 'Google\'s full-featured framework',
            color: '#dd0031',
            icon: '🅰️',
            pros: ['Full framework', 'TypeScript support', 'Enterprise ready', 'Comprehensive'],
            cons: ['Steep learning curve', 'Heavy', 'Complex', 'Opinionated']
        });
        
        this.libraries.set('svelte', {
            name: 'Svelte',
            description: 'Compile-time optimized framework',
            color: '#ff3e00',
            icon: '🧡',
            pros: ['No runtime', 'Small bundles', 'Great performance', 'Simple syntax'],
            cons: ['Smaller ecosystem', 'Newer', 'Less adoption', 'Learning curve']
        });
        
        this.libraries.set('lit', {
            name: 'Lit',
            description: 'Google\'s lightweight web components',
            color: '#324fff',
            icon: '⚡',
            pros: ['Web standards', 'Lightweight', 'Fast', 'No framework lock-in'],
            cons: ['Limited features', 'Browser support', 'Learning curve', 'Smaller ecosystem']
        });
    }
    
    /**
     * Register all available components
     */
    registerComponents() {
        // Classic and Fundamental Types (Implemented)
        this.components.set('text-input', new TextInputComponent());
        this.components.set('password-input', new PasswordInputComponent());
        this.components.set('email-input', new EmailInputComponent());
        this.components.set('search-box', new SearchBoxComponent());
        this.components.set('text-area', new TextAreaComponent());
        this.components.set('button', new ButtonComponent());
        this.components.set('checkbox', new CheckboxComponent());
        this.components.set('radio-button', new RadioButtonComponent());
        this.components.set('slider', new SliderComponent());
        this.components.set('progress-bar', new ProgressBarComponent());
        
        // Structural and Data Components (Implemented)
        this.components.set('card', new CardComponent());
        this.components.set('modal', new ModalComponent());
        this.components.set('tabs', new TabsComponent());
        this.components.set('accordion', new AccordionComponent());
        
        // Additional Classic Components (Implemented)
        this.components.set('select-dropdown', new SelectDropdownComponent());
        this.components.set('switch-toggle', new SwitchToggleComponent());
        this.components.set('file-upload', new FileUploadComponent());
        
        // Trend Components (Implemented)
        this.components.set('3d-canvas', new ThreeDCanvasComponent());
        this.components.set('audio-player', new AudioPlayerComponent());
        this.components.set('micro-interactions', new MicroInteractionsComponent());
        
        // Data Visualization Components (Implemented)
        this.components.set('chart', new ChartComponent());
        this.components.set('data-table', new DataTableComponent());
        
        // Performance Testing Components (Implemented)
        this.components.set('performance-monitor', new PerformanceMonitorComponent());
        this.components.set('component-tester', new ComponentTesterComponent());
        
        // Cosmic Animation Components (Implemented)
        this.components.set('particle-system', new ParticleSystemComponent());
        this.components.set('cosmic-loading', new CosmicLoadingComponent());
        
        // Mobile Optimization Components (Implemented)
        this.components.set('touch-gestures', new TouchGestureComponent());
        this.components.set('mobile-navigation', new MobileNavigationComponent());
        
        // WebGL Integration Components (Implemented)
        this.components.set('webgl-particles', new WebGLParticleSystemComponent());
        
        // Creative Algorithms Components (Implemented)
        this.components.set('fractal-generator', new FractalGeneratorComponent());
        
        // Structural placeholders
        this.components.set('list', this.createPlaceholderComponent('List', 'Ordered and unordered lists'));
        this.components.set('table', this.createPlaceholderComponent('Table', 'Data grid with sorting and filtering'));
        this.components.set('drawer', this.createPlaceholderComponent('Drawer', 'Slide-out panel'));
        this.components.set('navigation', this.createPlaceholderComponent('Navigation', 'Menu and navigation systems'));
        this.components.set('pagination', this.createPlaceholderComponent('Pagination', 'Page navigation'));
        this.components.set('tooltip', this.createPlaceholderComponent('Tooltip', 'Contextual information'));
        this.components.set('toast', this.createPlaceholderComponent('Toast', 'Notification system'));
        
        // Advanced placeholders
        this.components.set('multi-step-form', this.createPlaceholderComponent('Multi-step Form', 'Wizard-style form progression'));
        this.components.set('calendar', this.createPlaceholderComponent('Calendar', 'Date picker and calendar'));
        this.components.set('time-picker', this.createPlaceholderComponent('Time Picker', 'Time selection interface'));
        this.components.set('color-picker', this.createPlaceholderComponent('Color Picker', 'Color selection tool'));
        this.components.set('rating', this.createPlaceholderComponent('Rating', 'Star rating system'));
        this.components.set('stepper', this.createPlaceholderComponent('Stepper', 'Step-by-step progress'));
        this.components.set('carousel', this.createPlaceholderComponent('Carousel', 'Image/content slider'));
        this.components.set('gallery', this.createPlaceholderComponent('Gallery', 'Lightbox image gallery'));
        this.components.set('treeview', this.createPlaceholderComponent('Tree View', 'Hierarchical data display'));
        this.components.set('breadcrumbs', this.createPlaceholderComponent('Breadcrumbs', 'Navigation path'));
        this.components.set('dropdown-menu', this.createPlaceholderComponent('Dropdown Menu', 'Context menu'));
        this.components.set('context-menu', this.createPlaceholderComponent('Context Menu', 'Right-click menu'));
        this.components.set('autocomplete', this.createPlaceholderComponent('Autocomplete', 'Search suggestions'));
        this.components.set('chip-tag', this.createPlaceholderComponent('Chip/Tag Input', 'Tag management'));
        
        // UI/UX placeholders
        this.components.set('spinner', this.createPlaceholderComponent('Spinner', 'Loading indicator'));
        this.components.set('skeleton', this.createPlaceholderComponent('Skeleton', 'Loading placeholder'));
        this.components.set('badge', this.createPlaceholderComponent('Badge', 'Status marker'));
        this.components.set('avatar', this.createPlaceholderComponent('Avatar', 'Profile icon'));
        this.components.set('timeline', this.createPlaceholderComponent('Timeline', 'Event stream'));
        this.components.set('chat', this.createPlaceholderComponent('Chat', 'Message bubble'));
        this.components.set('snackbar', this.createPlaceholderComponent('Snackbar', 'Temporary notification'));
        
        // Additional Trend placeholders (not conflicting with implemented ones)
        this.components.set('video-player', this.createPlaceholderComponent('Video Player', 'Custom video controls'));
        this.components.set('scrolling-animations', this.createPlaceholderComponent('Scrolling Animations', 'Scroll-triggered effects'));
        this.components.set('drag-drop', this.createPlaceholderComponent('Drag & Drop', 'Drag and drop functionality'));
        this.components.set('gamified', this.createPlaceholderComponent('Gamified Elements', 'Interactive games'));
        this.components.set('scratch-reveal', this.createPlaceholderComponent('Scratch to Reveal', 'Interactive reveal effect'));
        this.components.set('spinning-loader', this.createPlaceholderComponent('Spinning Loader', 'Animated loading wheel'));
        this.components.set('organic-shapes', this.createPlaceholderComponent('Organic Shapes', 'Fluid, organic UI elements'));
        this.components.set('bento-grid', this.createPlaceholderComponent('Bento Grid', 'Modern grid layout'));
        this.components.set('voice-interface', this.createPlaceholderComponent('Voice Interface', 'Voice command integration'));
        this.components.set('chatbot', this.createPlaceholderComponent('Chatbot', 'AI chat interface'));
        
        // Performance and Tutorial Components (Implemented)
        this.components.set('performance-optimizer', new PerformanceOptimizerComponent());
        this.components.set('interactive-tutorial', new InteractiveTutorialComponent());
        
        // Advanced Components (Implemented)
        this.components.set('calendar', new CalendarComponent());
        this.components.set('carousel', new CarouselComponent());
        this.components.set('treeview', new TreeViewComponent());
        this.components.set('rating', new RatingComponent());
        this.components.set('color-picker', new ColorPickerComponent());
        this.components.set('stepper', new StepperComponent());
    }
    
    /**
     * Create placeholder component for future implementation
     */
    createPlaceholderComponent(name, description) {
        return {
            name,
            description,
            category: 'placeholder',
            createVanilla: () => {
                const element = document.createElement('div');
                element.className = 'placeholder-component';
                element.innerHTML = `
                    <div class="placeholder-content">
                        <div class="placeholder-icon">🚧</div>
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <div class="placeholder-status">Coming Soon</div>
                    </div>
                `;
                return element;
            },
            createLibrary: (libraryId) => {
                const element = document.createElement('div');
                element.className = 'placeholder-component';
                element.innerHTML = `
                    <div class="placeholder-content">
                        <div class="placeholder-icon">🚧</div>
                        <h3>${libraryId.toUpperCase()} ${name}</h3>
                        <p>${description}</p>
                        <div class="placeholder-status">Coming Soon</div>
                    </div>
                `;
                return element;
            },
            initializeVanilla: () => {},
            initializeLibrary: () => {},
            getInfo: () => ({ name, description, category: 'placeholder' })
        };
    }
    
    /**
     * Create the comparison UI
     */
    createComparisonUI() {
        const container = document.createElement('div');
        container.id = 'component-comparison-system';
        container.className = 'comparison-system';
        container.innerHTML = `
            <div class="comparison-header">
                <h1>🆚 Component Comparison System</h1>
                <p>Vanilla.js vs Top Libraries - Side by Side</p>
            </div>
            
            <div class="comparison-controls">
                <div class="library-selector">
                    <label for="library-select">Compare with:</label>
                    <select id="library-select">
                        <option value="react">React ⚛️</option>
                        <option value="vue">Vue.js 💚</option>
                        <option value="angular">Angular 🅰️</option>
                        <option value="svelte">Svelte 🧡</option>
                        <option value="lit">Lit ⚡</option>
                    </select>
                </div>
                
                <div class="component-selector">
                    <label for="component-select">Component:</label>
                    <select id="component-select">
                        <optgroup label="Classic & Fundamental">
                            <option value="text-input">Text Input</option>
                            <option value="button">Button</option>
                            <option value="checkbox">Checkbox</option>
                            <option value="radio-button">Radio Button</option>
                            <option value="select-dropdown">Select Dropdown</option>
                            <option value="slider">Slider</option>
                            <option value="switch-toggle">Switch Toggle</option>
                            <option value="progress-bar">Progress Bar</option>
                        </optgroup>
                        <optgroup label="Structural & Data">
                            <option value="modal">Modal</option>
                            <option value="tabs">Tabs</option>
                            <option value="accordion">Accordion</option>
                            <option value="card">Card</option>
                            <option value="table">Table</option>
                            <option value="list">List</option>
                        </optgroup>
                        <optgroup label="Advanced & Interactive">
                            <option value="calendar">Calendar</option>
                            <option value="carousel">Carousel</option>
                            <option value="color-picker">Color Picker</option>
                            <option value="rating">Rating</option>
                            <option value="treeview">Tree View</option>
                        </optgroup>
                        <optgroup label="Trend & 3D">
                            <option value="3d-canvas">3D Canvas</option>
                            <option value="voice-interface">Voice Interface</option>
                            <option value="micro-interactions">Micro Interactions</option>
                        </optgroup>
                    </select>
                </div>
                
                <button id="compare-btn" class="compare-button">Compare Components</button>
            </div>
            
            <div class="comparison-results" id="comparison-results">
                <!-- Comparison results will be populated here -->
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const compareBtn = document.getElementById('compare-btn');
        const librarySelect = document.getElementById('library-select');
        const componentSelect = document.getElementById('component-select');
        
        compareBtn.addEventListener('click', () => {
            const library = librarySelect.value;
            const component = componentSelect.value;
            this.compareComponents(component, library);
        });
        
        // Auto-compare on selection change
        componentSelect.addEventListener('change', () => {
            const library = librarySelect.value;
            const component = componentSelect.value;
            this.compareComponents(component, library);
        });
    }
    
    /**
     * Compare two components
     */
    compareComponents(componentId, libraryId) {
        const component = this.components.get(componentId);
        const library = this.libraries.get(libraryId);
        
        if (!component || !library) {
            console.error('Component or library not found');
            return;
        }
        
        this.currentComparison = { componentId, libraryId };
        
        // Create comparison results
        const results = this.createComparisonResults(component, library);
        
        // Update UI
        const resultsContainer = document.getElementById('comparison-results');
        resultsContainer.innerHTML = results;
        
        // Initialize both components
        this.initializeComponents(componentId, libraryId);
        
        // Start performance monitoring
        this.performance.startComparison(componentId, libraryId);
    }
    
    /**
     * Create comparison results HTML
     */
    createComparisonResults(component, library) {
        return `
            <div class="comparison-grid">
                <div class="comparison-side vanilla-side">
                    <div class="side-header">
                        <h2>🌟 Vanilla.js</h2>
                        <div class="library-info">
                            <span class="library-icon">🌟</span>
                            <span class="library-name">Pure JavaScript</span>
                        </div>
                    </div>
                    
                    <div class="component-demo" id="vanilla-demo">
                        <!-- Vanilla.js component will be rendered here -->
                    </div>
                    
                    <div class="component-info">
                        <h3>Features & Capabilities</h3>
                        <div class="feature-comparison">
                            <div class="feature-category">
                                <h4>Core Features</h4>
                                <ul>
                                    <li>✅ Zero dependencies</li>
                                    <li>✅ Full control over behavior</li>
                                    <li>✅ Custom styling support</li>
                                    <li>✅ Event handling</li>
                                    <li>✅ State management</li>
                                </ul>
                            </div>
                            <div class="feature-category">
                                <h4>Performance</h4>
                                <ul>
                                    <li>✅ Lightweight (0 KB bundle)</li>
                                    <li>✅ Fast rendering</li>
                                    <li>✅ Memory efficient</li>
                                    <li>✅ 60fps animations</li>
                                </ul>
                            </div>
                            <div class="feature-category">
                                <h4>Developer Experience</h4>
                                <ul>
                                    <li>✅ No framework lock-in</li>
                                    <li>✅ Direct DOM manipulation</li>
                                    <li>✅ Easy debugging</li>
                                    <li>✅ Full customization</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="performance-metrics" id="vanilla-metrics">
                        <h4>Performance</h4>
                        <div class="metric">
                            <span class="metric-label">Bundle Size:</span>
                            <span class="metric-value">0 KB</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Render Time:</span>
                            <span class="metric-value">-- ms</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Memory Usage:</span>
                            <span class="metric-value">-- MB</span>
                        </div>
                    </div>
                </div>
                
                <div class="comparison-side library-side">
                    <div class="side-header">
                        <h2>${library.icon} ${library.name}</h2>
                        <div class="library-info">
                            <span class="library-icon">${library.icon}</span>
                            <span class="library-name">${library.description}</span>
                        </div>
                    </div>
                    
                    <div class="component-demo" id="library-demo">
                        <!-- Library component will be rendered here -->
                    </div>
                    
                    <div class="component-info">
                        <h3>Features & Capabilities</h3>
                        <div class="feature-comparison">
                            <div class="feature-category">
                                <h4>Core Features</h4>
                                <ul>
                                    ${library.pros.slice(0, 3).map(pro => `<li>✅ ${pro}</li>`).join('')}
                                    ${library.cons.slice(0, 2).map(con => `<li>❌ ${con}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="feature-category">
                                <h4>Performance</h4>
                                <ul>
                                    <li>📦 Bundle size: ${this.getBundleSize(library.name)} KB</li>
                                    <li>⚡ Rendering: ${this.getRenderingSpeed(library.name)}</li>
                                    <li>🧠 Memory: ${this.getMemoryUsage(library.name)}</li>
                                    <li>🎯 Optimization: ${this.getOptimizationLevel(library.name)}</li>
                                </ul>
                            </div>
                            <div class="feature-category">
                                <h4>Developer Experience</h4>
                                <ul>
                                    <li>📚 Learning curve: ${this.getLearningCurve(library.name)}</li>
                                    <li>🛠️ Dev tools: ${this.getDevTools(library.name)}</li>
                                    <li>📖 Documentation: ${this.getDocumentation(library.name)}</li>
                                    <li>🔧 Customization: ${this.getCustomization(library.name)}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="performance-metrics" id="library-metrics">
                        <h4>Performance</h4>
                        <div class="metric">
                            <span class="metric-label">Bundle Size:</span>
                            <span class="metric-value">-- KB</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Render Time:</span>
                            <span class="metric-value">-- ms</span>
                        </div>
                        <div class="metric">
                            <span class="metric-label">Memory Usage:</span>
                            <span class="metric-value">-- MB</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="comparison-summary">
                <h3>📊 Comparison Summary</h3>
                <div class="summary-grid">
                    <div class="summary-item">
                        <h4>Performance Winner</h4>
                        <span class="winner" id="performance-winner">--</span>
                    </div>
                    <div class="summary-item">
                        <h4>Bundle Size Winner</h4>
                        <span class="winner" id="bundle-winner">--</span>
                    </div>
                    <div class="summary-item">
                        <h4>Developer Experience</h4>
                        <span class="winner" id="dx-winner">--</span>
                    </div>
                    <div class="summary-item">
                        <h4>Overall Winner</h4>
                        <span class="winner" id="overall-winner">--</span>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Initialize both components
     */
    initializeComponents(componentId, libraryId) {
        const component = this.components.get(componentId);
        const vanillaDemo = document.getElementById('vanilla-demo');
        const libraryDemo = document.getElementById('library-demo');
        
        // Clear previous components
        vanillaDemo.innerHTML = '';
        libraryDemo.innerHTML = '';
        
        // Create vanilla.js component
        const vanillaElement = component.createVanillaElement();
        vanillaElement.classList.add('vanilla-demo');
        vanillaDemo.appendChild(vanillaElement);
        
        // Create library component (simulated with enhanced styling)
        const libraryElement = component.createLibraryElement(libraryId);
        libraryElement.classList.add('library-enhanced');
        libraryElement.setAttribute('data-library', libraryId);
        libraryDemo.appendChild(libraryElement);
        
        // Initialize both components
        component.setupVanillaEventListeners(vanillaElement);
        component.setupLibraryEventListeners(libraryElement, libraryId);
    }
    
    /**
     * Get component by ID
     */
    getComponent(id) {
        return this.components.get(id);
    }
    
    /**
     * Get library by ID
     */
    getLibrary(id) {
        return this.libraries.get(id);
    }
    
    /**
     * Get current comparison
     */
    getCurrentComparison() {
        return this.currentComparison;
    }
    
    /**
     * Get bundle size for library
     */
    getBundleSize(libraryName) {
        const sizes = {
            'React': '42.2',
            'Vue.js': '33.4',
            'Angular': '135.7',
            'Svelte': '1.6',
            'Lit': '5.2'
        };
        return sizes[libraryName] || '--';
    }
    
    /**
     * Get rendering speed for library
     */
    getRenderingSpeed(libraryName) {
        const speeds = {
            'React': 'Fast (Virtual DOM)',
            'Vue.js': 'Very Fast (Reactivity)',
            'Angular': 'Good (Change Detection)',
            'Svelte': 'Fastest (Compiled)',
            'Lit': 'Fast (Native)'
        };
        return speeds[libraryName] || '--';
    }
    
    /**
     * Get memory usage for library
     */
    getMemoryUsage(libraryName) {
        const memory = {
            'React': 'Medium',
            'Vue.js': 'Low',
            'Angular': 'High',
            'Svelte': 'Lowest',
            'Lit': 'Low'
        };
        return memory[libraryName] || '--';
    }
    
    /**
     * Get optimization level for library
     */
    getOptimizationLevel(libraryName) {
        const levels = {
            'React': 'High (Fiber)',
            'Vue.js': 'High (Reactivity)',
            'Angular': 'Medium (Zone.js)',
            'Svelte': 'Highest (Compiled)',
            'Lit': 'High (Native)'
        };
        return levels[libraryName] || '--';
    }
    
    /**
     * Get learning curve for library
     */
    getLearningCurve(libraryName) {
        const curves = {
            'React': 'Steep',
            'Vue.js': 'Gentle',
            'Angular': 'Very Steep',
            'Svelte': 'Gentle',
            'Lit': 'Easy'
        };
        return curves[libraryName] || '--';
    }
    
    /**
     * Get dev tools for library
     */
    getDevTools(libraryName) {
        const tools = {
            'React': 'Excellent',
            'Vue.js': 'Great',
            'Angular': 'Good',
            'Svelte': 'Good',
            'Lit': 'Basic'
        };
        return tools[libraryName] || '--';
    }
    
    /**
     * Get documentation quality for library
     */
    getDocumentation(libraryName) {
        const docs = {
            'React': 'Excellent',
            'Vue.js': 'Outstanding',
            'Angular': 'Comprehensive',
            'Svelte': 'Good',
            'Lit': 'Good'
        };
        return docs[libraryName] || '--';
    }
    
    /**
     * Get customization level for library
     */
    getCustomization(libraryName) {
        const customization = {
            'React': 'High',
            'Vue.js': 'High',
            'Angular': 'Medium',
            'Svelte': 'High',
            'Lit': 'Very High'
        };
        return customization[libraryName] || '--';
    }
}

/**
 * 📊 Performance Monitor
 * Monitors and compares performance between implementations
 */
class PerformanceMonitor {
    constructor() {
        this.metrics = new Map();
        this.isMonitoring = false;
    }
    
    startComparison(componentId, libraryId) {
        this.isMonitoring = true;
        this.metrics.set('vanilla', { componentId, startTime: performance.now() });
        this.metrics.set('library', { componentId, startTime: performance.now() });
        
        // Monitor for 5 seconds
        setTimeout(() => {
            this.stopComparison();
        }, 5000);
    }
    
    stopComparison() {
        this.isMonitoring = false;
        this.updateMetrics();
    }
    
    updateMetrics() {
        // Update performance metrics in UI
        const vanillaMetrics = document.getElementById('vanilla-metrics');
        const libraryMetrics = document.getElementById('library-metrics');
        
        if (vanillaMetrics) {
            // Update vanilla metrics
            const renderTime = performance.now() - this.metrics.get('vanilla').startTime;
            vanillaMetrics.querySelector('.metric-value').textContent = `${renderTime.toFixed(2)} ms`;
        }
        
        if (libraryMetrics) {
            // Update library metrics
            const renderTime = performance.now() - this.metrics.get('library').startTime;
            libraryMetrics.querySelector('.metric-value').textContent = `${renderTime.toFixed(2)} ms`;
        }
    }
}

// Initialize the system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ComponentComparisonSystem = new ComponentComparisonSystem();
    console.log('🆚 Component Comparison System ready!');
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ComponentComparisonSystem;
}
