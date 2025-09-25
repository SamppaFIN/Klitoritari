/**
 * 🎨 UI Techniques Showcase
 * Advanced UI/UX techniques and interactive controls demonstration
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

class UITechniquesShowcase {
    constructor() {
        this.currentTechnique = null;
        this.techniques = new Map();
        this.container = null;
        
        this.init();
    }
    
    init() {
        this.registerTechniques();
        this.createShowcaseUI();
        this.setupEventListeners();
        
        console.log('🎨 UI Techniques Showcase initialized!');
    }
    
    registerTechniques() {
        // Morphing and Transform Techniques
        this.techniques.set('morphing-cards', {
            name: 'Morphing Cards',
            description: 'Cards that transform and adapt based on user interaction',
            category: 'Transform',
            difficulty: 'Advanced',
            features: ['3D Transforms', 'Smooth Transitions', 'Interactive States']
        });
        
        this.techniques.set('magnetic-buttons', {
            name: 'Magnetic Buttons',
            description: 'Buttons that follow cursor movement with magnetic attraction',
            category: 'Interaction',
            difficulty: 'Expert',
            features: ['Cursor Tracking', 'Physics Simulation', 'Smooth Animation']
        });
        
        this.techniques.set('particle-systems', {
            name: 'Particle Systems',
            description: 'Dynamic particle effects for visual enhancement',
            category: 'Effects',
            difficulty: 'Advanced',
            features: ['WebGL Integration', 'Performance Optimization', 'Interactive Particles']
        });
        
        // Advanced Control Techniques
        this.techniques.set('gesture-controls', {
            name: 'Gesture Controls',
            description: 'Touch and mouse gesture recognition for advanced interactions',
            category: 'Controls',
            difficulty: 'Expert',
            features: ['Multi-touch', 'Gesture Recognition', 'Mobile Optimization']
        });
        
        this.techniques.set('voice-interface', {
            name: 'Voice Interface',
            description: 'Voice command integration for hands-free interaction',
            category: 'Accessibility',
            difficulty: 'Advanced',
            features: ['Speech Recognition', 'Voice Feedback', 'Command Processing']
        });
        
        this.techniques.set('ai-personalization', {
            name: 'AI Personalization',
            description: 'Machine learning-driven UI adaptation and personalization',
            category: 'Intelligence',
            difficulty: 'Expert',
            features: ['Behavior Analysis', 'Dynamic Adaptation', 'Predictive UI']
        });
        
        // Visual Effects Techniques
        this.techniques.set('glassmorphism', {
            name: 'Glassmorphism',
            description: 'Frosted glass effects with backdrop blur and transparency',
            category: 'Visual',
            difficulty: 'Intermediate',
            features: ['Backdrop Blur', 'Transparency', 'Layered Effects']
        });
        
        this.techniques.set('neomorphism', {
            name: 'Neomorphism',
            description: 'Soft, extruded plastic look with subtle shadows and highlights',
            category: 'Visual',
            difficulty: 'Intermediate',
            features: ['Soft Shadows', 'Subtle Highlights', '3D Appearance']
        });
        
        this.techniques.set('liquid-animations', {
            name: 'Liquid Animations',
            description: 'Fluid, organic animations that mimic liquid behavior',
            category: 'Animation',
            difficulty: 'Expert',
            features: ['SVG Paths', 'Morphing Shapes', 'Physics Simulation']
        });
        
        // Interaction Techniques
        this.techniques.set('micro-interactions', {
            name: 'Micro Interactions',
            description: 'Subtle feedback animations for enhanced user experience',
            category: 'Interaction',
            difficulty: 'Intermediate',
            features: ['Hover Effects', 'Click Feedback', 'State Transitions']
        });
        
        this.techniques.set('scroll-triggered', {
            name: 'Scroll Triggered',
            description: 'Animations and effects triggered by scroll position',
            category: 'Animation',
            difficulty: 'Advanced',
            features: ['Intersection Observer', 'Parallax Effects', 'Progressive Loading']
        });
        
        this.techniques.set('drag-drop-advanced', {
            name: 'Advanced Drag & Drop',
            description: 'Sophisticated drag and drop with visual feedback and constraints',
            category: 'Interaction',
            difficulty: 'Advanced',
            features: ['Visual Feedback', 'Drop Zones', 'Constraint Handling']
        });
    }
    
    createShowcaseUI() {
        const container = document.createElement('div');
        container.className = 'ui-techniques-showcase';
        container.innerHTML = `
            <div class="showcase-header">
                <h1>🎨 UI Techniques Showcase</h1>
                <p>Advanced vanilla.js techniques for modern web interfaces</p>
            </div>
            
            <div class="showcase-controls">
                <div class="filter-controls">
                    <button class="filter-btn active" data-filter="all">All</button>
                    <button class="filter-btn" data-filter="Transform">Transform</button>
                    <button class="filter-btn" data-filter="Interaction">Interaction</button>
                    <button class="filter-btn" data-filter="Effects">Effects</button>
                    <button class="filter-btn" data-filter="Visual">Visual</button>
                    <button class="filter-btn" data-filter="Animation">Animation</button>
                    <button class="filter-btn" data-filter="Controls">Controls</button>
                    <button class="filter-btn" data-filter="Accessibility">Accessibility</button>
                    <button class="filter-btn" data-filter="Intelligence">Intelligence</button>
                </div>
                
                <div class="difficulty-controls">
                    <label>Difficulty:</label>
                    <select id="difficulty-filter">
                        <option value="all">All Levels</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
            </div>
            
            <div class="techniques-grid" id="techniques-grid">
                <!-- Techniques will be rendered here -->
            </div>
            
            <div class="technique-demo" id="technique-demo" style="display: none;">
                <div class="demo-header">
                    <h2 id="demo-title">Technique Demo</h2>
                    <button class="close-demo" id="close-demo">×</button>
                </div>
                <div class="demo-content" id="demo-content">
                    <!-- Demo content will be rendered here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        this.container = container;
        this.renderTechniques();
    }
    
    renderTechniques() {
        const grid = this.container.querySelector('#techniques-grid');
        grid.innerHTML = '';
        
        this.techniques.forEach((technique, id) => {
            const card = this.createTechniqueCard(technique, id);
            grid.appendChild(card);
        });
    }
    
    createTechniqueCard(technique, id) {
        const card = document.createElement('div');
        card.className = `technique-card ${technique.category.toLowerCase()}`;
        card.dataset.techniqueId = id;
        card.dataset.category = technique.category;
        card.dataset.difficulty = technique.difficulty;
        
        const difficultyClass = technique.difficulty.toLowerCase();
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${technique.name}</h3>
                <span class="difficulty-badge ${difficultyClass}">${technique.difficulty}</span>
            </div>
            <div class="card-content">
                <p class="description">${technique.description}</p>
                <div class="features">
                    ${technique.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                </div>
            </div>
            <div class="card-footer">
                <button class="demo-btn" data-technique="${id}">Try Demo</button>
                <span class="category-tag">${technique.category}</span>
            </div>
        `;
        
        return card;
    }
    
    setupEventListeners() {
        // Filter controls
        const filterBtns = this.container.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterTechniques(e.target.dataset.filter);
                filterBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Difficulty filter
        const difficultyFilter = this.container.querySelector('#difficulty-filter');
        difficultyFilter.addEventListener('change', (e) => {
            this.filterByDifficulty(e.target.value);
        });
        
        // Demo buttons
        this.container.addEventListener('click', (e) => {
            if (e.target.classList.contains('demo-btn')) {
                const techniqueId = e.target.dataset.technique;
                this.showTechniqueDemo(techniqueId);
            }
        });
        
        // Close demo
        const closeDemo = this.container.querySelector('#close-demo');
        closeDemo.addEventListener('click', () => {
            this.hideTechniqueDemo();
        });
    }
    
    filterTechniques(category) {
        const cards = this.container.querySelectorAll('.technique-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    filterByDifficulty(difficulty) {
        const cards = this.container.querySelectorAll('.technique-card');
        cards.forEach(card => {
            if (difficulty === 'all' || card.dataset.difficulty === difficulty) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    showTechniqueDemo(techniqueId) {
        const technique = this.techniques.get(techniqueId);
        const demo = this.container.querySelector('#technique-demo');
        const title = this.container.querySelector('#demo-title');
        const content = this.container.querySelector('#demo-content');
        
        title.textContent = technique.name;
        content.innerHTML = this.createTechniqueDemo(techniqueId);
        
        demo.style.display = 'block';
        this.currentTechnique = techniqueId;
        
        // Initialize the demo
        this.initializeTechniqueDemo(techniqueId, content);
    }
    
    hideTechniqueDemo() {
        const demo = this.container.querySelector('#technique-demo');
        demo.style.display = 'none';
        this.currentTechnique = null;
    }
    
    createTechniqueDemo(techniqueId) {
        switch(techniqueId) {
            case 'morphing-cards':
                return this.createMorphingCardsDemo();
            case 'magnetic-buttons':
                return this.createMagneticButtonsDemo();
            case 'particle-systems':
                return this.createParticleSystemsDemo();
            case 'gesture-controls':
                return this.createGestureControlsDemo();
            case 'voice-interface':
                return this.createVoiceInterfaceDemo();
            case 'ai-personalization':
                return this.createAIPersonalizationDemo();
            case 'glassmorphism':
                return this.createGlassmorphismDemo();
            case 'neomorphism':
                return this.createNeomorphismDemo();
            case 'liquid-animations':
                return this.createLiquidAnimationsDemo();
            case 'micro-interactions':
                return this.createMicroInteractionsDemo();
            case 'scroll-triggered':
                return this.createScrollTriggeredDemo();
            case 'drag-drop-advanced':
                return this.createDragDropAdvancedDemo();
            default:
                return '<p>Demo not available yet.</p>';
        }
    }
    
    createMorphingCardsDemo() {
        return `
            <div class="morphing-cards-demo">
                <h3>Morphing Cards Demo</h3>
                <p>Hover over the cards to see them transform and adapt to your interaction.</p>
                
                <div class="cards-container">
                    <div class="morphing-card" data-card="1">
                        <div class="card-icon">🌟</div>
                        <h4>Cosmic Explorer</h4>
                        <p>Journey through the stars and discover new worlds beyond imagination.</p>
                        <div class="card-actions">
                            <button class="card-btn">Explore</button>
                            <button class="card-btn secondary">Learn More</button>
                        </div>
                    </div>
                    
                    <div class="morphing-card" data-card="2">
                        <div class="card-icon">⚡</div>
                        <h4>Lightning Fast</h4>
                        <p>Experience the speed of light with our optimized performance engine.</p>
                        <div class="card-actions">
                            <button class="card-btn">Speed Up</button>
                            <button class="card-btn secondary">Settings</button>
                        </div>
                    </div>
                    
                    <div class="morphing-card" data-card="3">
                        <div class="card-icon">🎨</div>
                        <h4>Creative Studio</h4>
                        <p>Unleash your creativity with our advanced design tools and templates.</p>
                        <div class="card-actions">
                            <button class="card-btn">Create</button>
                            <button class="card-btn secondary">Templates</button>
                        </div>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="reset-cards">Reset Cards</button>
                    <button class="control-btn" id="animate-all">Animate All</button>
                </div>
            </div>
        `;
    }
    
    createMagneticButtonsDemo() {
        return `
            <div class="magnetic-buttons-demo">
                <h3>Magnetic Buttons Demo</h3>
                <p>Move your cursor around the buttons to see them follow with magnetic attraction.</p>
                
                <div class="magnetic-container">
                    <button class="magnetic-btn" data-magnetic="1">Magnetic Button 1</button>
                    <button class="magnetic-btn" data-magnetic="2">Magnetic Button 2</button>
                    <button class="magnetic-btn" data-magnetic="3">Magnetic Button 3</button>
                    <button class="magnetic-btn" data-magnetic="4">Magnetic Button 4</button>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="toggle-magnetism">Toggle Magnetism</button>
                    <button class="control-btn" id="reset-positions">Reset Positions</button>
                </div>
            </div>
        `;
    }
    
    createParticleSystemsDemo() {
        return `
            <div class="particle-systems-demo">
                <h3>Particle Systems Demo</h3>
                <p>Click and drag to create particle effects. Each interaction generates unique patterns.</p>
                
                <div class="particle-canvas-container">
                    <canvas id="particle-canvas" width="600" height="400"></canvas>
                </div>
                
                <div class="particle-controls">
                    <div class="control-group">
                        <label>Particle Count:</label>
                        <input type="range" id="particle-count" min="10" max="200" value="50">
                        <span id="count-value">50</span>
                    </div>
                    <div class="control-group">
                        <label>Speed:</label>
                        <input type="range" id="particle-speed" min="0.1" max="3" step="0.1" value="1">
                        <span id="speed-value">1.0</span>
                    </div>
                    <div class="control-group">
                        <label>Size:</label>
                        <input type="range" id="particle-size" min="1" max="10" value="3">
                        <span id="size-value">3</span>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="clear-particles">Clear Particles</button>
                    <button class="control-btn" id="explosion-effect">Explosion Effect</button>
                    <button class="control-btn" id="spiral-effect">Spiral Effect</button>
                </div>
            </div>
        `;
    }
    
    createGestureControlsDemo() {
        return `
            <div class="gesture-controls-demo">
                <h3>Gesture Controls Demo</h3>
                <p>Use touch gestures or mouse movements to interact with the elements below.</p>
                
                <div class="gesture-area" id="gesture-area">
                    <div class="gesture-item" data-gesture="pan">Pan Me</div>
                    <div class="gesture-item" data-gesture="rotate">Rotate Me</div>
                    <div class="gesture-item" data-gesture="scale">Scale Me</div>
                    <div class="gesture-item" data-gesture="swipe">Swipe Me</div>
                </div>
                
                <div class="gesture-feedback">
                    <h4>Gesture Feedback:</h4>
                    <div id="gesture-log">No gestures detected yet...</div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="reset-gestures">Reset Elements</button>
                    <button class="control-btn" id="enable-gestures">Enable Gestures</button>
                </div>
            </div>
        `;
    }
    
    createVoiceInterfaceDemo() {
        return `
            <div class="voice-interface-demo">
                <h3>Voice Interface Demo</h3>
                <p>Click the microphone and try saying: "Hello", "Change color", "Create circle", "Clear all"</p>
                
                <div class="voice-controls">
                    <button class="voice-btn" id="voice-toggle">
                        <span class="mic-icon">🎤</span>
                        <span class="voice-text">Start Listening</span>
                    </button>
                    <div class="voice-status" id="voice-status">Ready to listen</div>
                </div>
                
                <div class="voice-canvas-container">
                    <canvas id="voice-canvas" width="500" height="300"></canvas>
                </div>
                
                <div class="voice-commands">
                    <h4>Available Commands:</h4>
                    <ul>
                        <li>"Hello" - Display greeting</li>
                        <li>"Change color" - Change background color</li>
                        <li>"Create circle" - Draw a circle</li>
                        <li>"Create square" - Draw a square</li>
                        <li>"Clear all" - Clear the canvas</li>
                    </ul>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="test-voice">Test Voice Recognition</button>
                    <button class="control-btn" id="clear-voice-canvas">Clear Canvas</button>
                </div>
            </div>
        `;
    }
    
    createAIPersonalizationDemo() {
        return `
            <div class="ai-personalization-demo">
                <h3>AI Personalization Demo</h3>
                <p>Watch as the interface adapts to your behavior and preferences in real-time.</p>
                
                <div class="ai-interface">
                    <div class="ai-header">
                        <h4>Adaptive Interface</h4>
                        <div class="ai-status" id="ai-status">Learning your preferences...</div>
                    </div>
                    
                    <div class="ai-content">
                        <div class="content-section" data-ai="layout">
                            <h5>Layout Preferences</h5>
                            <div class="preference-indicator" id="layout-pref">Analyzing...</div>
                        </div>
                        
                        <div class="content-section" data-ai="colors">
                            <h5>Color Preferences</h5>
                            <div class="preference-indicator" id="color-pref">Analyzing...</div>
                        </div>
                        
                        <div class="content-section" data-ai="interactions">
                            <h5>Interaction Patterns</h5>
                            <div class="preference-indicator" id="interaction-pref">Analyzing...</div>
                        </div>
                    </div>
                </div>
                
                <div class="ai-controls">
                    <button class="control-btn" id="simulate-behavior">Simulate User Behavior</button>
                    <button class="control-btn" id="reset-ai">Reset AI Learning</button>
                    <button class="control-btn" id="show-insights">Show AI Insights</button>
                </div>
            </div>
        `;
    }
    
    createGlassmorphismDemo() {
        return `
            <div class="glassmorphism-demo">
                <h3>Glassmorphism Demo</h3>
                <p>Experience the frosted glass effect with backdrop blur and transparency.</p>
                
                <div class="glassmorphism-container">
                    <div class="glass-card" data-glass="1">
                        <h4>Frosted Glass Card</h4>
                        <p>This card demonstrates the glassmorphism effect with backdrop blur.</p>
                        <button class="glass-btn">Glass Button</button>
                    </div>
                    
                    <div class="glass-card" data-glass="2">
                        <h4>Transparent Panel</h4>
                        <p>Notice how the background is visible through the transparent surface.</p>
                        <button class="glass-btn">Another Button</button>
                    </div>
                    
                    <div class="glass-card" data-glass="3">
                        <h4>Layered Effect</h4>
                        <p>Multiple layers create depth and visual hierarchy.</p>
                        <button class="glass-btn">Layered Button</button>
                    </div>
                </div>
                
                <div class="glassmorphism-controls">
                    <div class="control-group">
                        <label>Blur Intensity:</label>
                        <input type="range" id="blur-intensity" min="0" max="20" value="10">
                        <span id="blur-value">10px</span>
                    </div>
                    <div class="control-group">
                        <label>Opacity:</label>
                        <input type="range" id="glass-opacity" min="0.1" max="1" step="0.1" value="0.8">
                        <span id="opacity-value">0.8</span>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="animate-glass">Animate Glass</button>
                    <button class="control-btn" id="reset-glass">Reset Glass</button>
                </div>
            </div>
        `;
    }
    
    createNeomorphismDemo() {
        return `
            <div class="neomorphism-demo">
                <h3>Neomorphism Demo</h3>
                <p>Soft, extruded plastic look with subtle shadows and highlights.</p>
                
                <div class="neo-container">
                    <div class="neo-card" data-neo="1">
                        <div class="neo-icon">🔘</div>
                        <h4>Soft Button</h4>
                        <p>Press me to see the neomorphic effect</p>
                    </div>
                    
                    <div class="neo-card" data-neo="2">
                        <div class="neo-icon">📱</div>
                        <h4>Mobile Interface</h4>
                        <p>Touch-friendly neomorphic design</p>
                    </div>
                    
                    <div class="neo-card" data-neo="3">
                        <div class="neo-icon">🎛️</div>
                        <h4>Control Panel</h4>
                        <p>Interactive neomorphic controls</p>
                    </div>
                </div>
                
                <div class="neo-controls">
                    <div class="control-group">
                        <label>Shadow Depth:</label>
                        <input type="range" id="shadow-depth" min="1" max="20" value="8">
                        <span id="depth-value">8px</span>
                    </div>
                    <div class="control-group">
                        <label>Highlight Intensity:</label>
                        <input type="range" id="highlight-intensity" min="0.1" max="1" step="0.1" value="0.5">
                        <span id="highlight-value">0.5</span>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="toggle-neo">Toggle Neomorphism</button>
                    <button class="control-btn" id="animate-neo">Animate Elements</button>
                </div>
            </div>
        `;
    }
    
    createLiquidAnimationsDemo() {
        return `
            <div class="liquid-animations-demo">
                <h3>Liquid Animations Demo</h3>
                <p>Fluid, organic animations that mimic liquid behavior and morphing shapes.</p>
                
                <div class="liquid-container">
                    <svg class="liquid-svg" width="400" height="300" viewBox="0 0 400 300">
                        <defs>
                            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:#4a9eff;stop-opacity:1" />
                                <stop offset="100%" style="stop-color:#00ff88;stop-opacity:1" />
                            </linearGradient>
                        </defs>
                        <path id="liquid-path" d="M50,150 Q100,100 150,150 T250,150 T350,150 L350,250 L50,250 Z" fill="url(#liquidGradient)"/>
                    </svg>
                </div>
                
                <div class="liquid-controls">
                    <div class="control-group">
                        <label>Wave Frequency:</label>
                        <input type="range" id="wave-frequency" min="0.5" max="3" step="0.1" value="1">
                        <span id="freq-value">1.0</span>
                    </div>
                    <div class="control-group">
                        <label>Wave Amplitude:</label>
                        <input type="range" id="wave-amplitude" min="10" max="50" value="25">
                        <span id="amp-value">25px</span>
                    </div>
                    <div class="control-group">
                        <label>Animation Speed:</label>
                        <input type="range" id="animation-speed" min="0.5" max="3" step="0.1" value="1">
                        <span id="speed-value">1.0x</span>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="start-liquid">Start Animation</button>
                    <button class="control-btn" id="morph-liquid">Morph Shape</button>
                    <button class="control-btn" id="reset-liquid">Reset</button>
                </div>
            </div>
        `;
    }
    
    createMicroInteractionsDemo() {
        return `
            <div class="micro-interactions-demo">
                <h3>Micro Interactions Demo</h3>
                <p>Subtle feedback animations that enhance user experience and provide visual feedback.</p>
                
                <div class="micro-container">
                    <div class="micro-section">
                        <h4>Button Interactions</h4>
                        <div class="button-group">
                            <button class="micro-btn ripple">Ripple Effect</button>
                            <button class="micro-btn bounce">Bounce Effect</button>
                            <button class="micro-btn glow">Glow Effect</button>
                            <button class="micro-btn morph">Morph Effect</button>
                        </div>
                    </div>
                    
                    <div class="micro-section">
                        <h4>Input Interactions</h4>
                        <div class="input-group">
                            <div class="input-container">
                                <input type="text" class="micro-input" placeholder="Floating label effect">
                                <label class="input-label">Username</label>
                            </div>
                            <div class="input-container">
                                <input type="email" class="micro-input" placeholder="Focus animation">
                                <label class="input-label">Email</label>
                            </div>
                        </div>
                    </div>
                    
                    <div class="micro-section">
                        <h4>Card Interactions</h4>
                        <div class="card-group">
                            <div class="micro-card hover-lift">Hover to Lift</div>
                            <div class="micro-card hover-tilt">Hover to Tilt</div>
                            <div class="micro-card hover-scale">Hover to Scale</div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="trigger-all">Trigger All Effects</button>
                    <button class="control-btn" id="reset-micro">Reset Interactions</button>
                </div>
            </div>
        `;
    }
    
    createScrollTriggeredDemo() {
        return `
            <div class="scroll-triggered-demo">
                <h3>Scroll Triggered Animations Demo</h3>
                <p>Scroll down to see elements animate as they come into view. Each section has different animation effects.</p>
                
                <div class="scroll-container">
                    <div class="scroll-section" data-scroll="fade-in">
                        <h4>Fade In Animation</h4>
                        <p>This section fades in as you scroll down. Notice the smooth transition effect.</p>
                        <div class="scroll-content">
                            <div class="scroll-item">Item 1</div>
                            <div class="scroll-item">Item 2</div>
                            <div class="scroll-item">Item 3</div>
                        </div>
                    </div>
                    
                    <div class="scroll-section" data-scroll="slide-up">
                        <h4>Slide Up Animation</h4>
                        <p>This section slides up from below as it enters the viewport.</p>
                        <div class="scroll-content">
                            <div class="scroll-item">Slide Item 1</div>
                            <div class="scroll-item">Slide Item 2</div>
                            <div class="scroll-item">Slide Item 3</div>
                        </div>
                    </div>
                    
                    <div class="scroll-section" data-scroll="scale-in">
                        <h4>Scale In Animation</h4>
                        <p>This section scales in from the center with a zoom effect.</p>
                        <div class="scroll-content">
                            <div class="scroll-item">Scale Item 1</div>
                            <div class="scroll-item">Scale Item 2</div>
                            <div class="scroll-item">Scale Item 3</div>
                        </div>
                    </div>
                    
                    <div class="scroll-section" data-scroll="parallax">
                        <h4>Parallax Effect</h4>
                        <p>This section has a parallax scrolling effect with different speeds.</p>
                        <div class="parallax-content">
                            <div class="parallax-layer" data-speed="0.5">Background Layer</div>
                            <div class="parallax-layer" data-speed="1">Middle Layer</div>
                            <div class="parallax-layer" data-speed="1.5">Foreground Layer</div>
                        </div>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="scroll-to-top">Scroll to Top</button>
                    <button class="control-btn" id="reset-scroll">Reset Animations</button>
                </div>
            </div>
        `;
    }
    
    createDragDropAdvancedDemo() {
        return `
            <div class="drag-drop-advanced-demo">
                <h3>Advanced Drag & Drop Demo</h3>
                <p>Drag items between containers with visual feedback, constraints, and smooth animations.</p>
                
                <div class="drag-drop-container">
                    <div class="drag-zone" data-zone="source">
                        <h4>Source Zone</h4>
                        <div class="drag-item" data-item="1" draggable="true">
                            <div class="item-icon">📁</div>
                            <span>Document 1</span>
                        </div>
                        <div class="drag-item" data-item="2" draggable="true">
                            <div class="item-icon">📄</div>
                            <span>Document 2</span>
                        </div>
                        <div class="drag-item" data-item="3" draggable="true">
                            <div class="item-icon">📊</div>
                            <span>Document 3</span>
                        </div>
                    </div>
                    
                    <div class="drag-zone" data-zone="target">
                        <h4>Target Zone</h4>
                        <div class="drop-indicator">Drop items here</div>
                    </div>
                    
                    <div class="drag-zone" data-zone="archive">
                        <h4>Archive Zone</h4>
                        <div class="drop-indicator">Archive items here</div>
                    </div>
                </div>
                
                <div class="drag-feedback">
                    <div class="feedback-item">
                        <span>Items in Source:</span>
                        <span id="source-count">3</span>
                    </div>
                    <div class="feedback-item">
                        <span>Items in Target:</span>
                        <span id="target-count">0</span>
                    </div>
                    <div class="feedback-item">
                        <span>Items in Archive:</span>
                        <span id="archive-count">0</span>
                    </div>
                </div>
                
                <div class="demo-controls">
                    <button class="control-btn" id="reset-drag-drop">Reset Items</button>
                    <button class="control-btn" id="shuffle-items">Shuffle Items</button>
                </div>
            </div>
        `;
    }
    
    initializeTechniqueDemo(techniqueId, container) {
        switch(techniqueId) {
            case 'morphing-cards':
                this.initMorphingCardsDemo(container);
                break;
            case 'magnetic-buttons':
                this.initMagneticButtonsDemo(container);
                break;
            case 'particle-systems':
                this.initParticleSystemsDemo(container);
                break;
            case 'gesture-controls':
                this.initGestureControlsDemo(container);
                break;
            case 'voice-interface':
                this.initVoiceInterfaceDemo(container);
                break;
            case 'ai-personalization':
                this.initAIPersonalizationDemo(container);
                break;
            case 'glassmorphism':
                this.initGlassmorphismDemo(container);
                break;
            case 'neomorphism':
                this.initNeomorphismDemo(container);
                break;
            case 'liquid-animations':
                this.initLiquidAnimationsDemo(container);
                break;
            case 'micro-interactions':
                this.initMicroInteractionsDemo(container);
                break;
            case 'scroll-triggered':
                this.initScrollTriggeredDemo(container);
                break;
            case 'drag-drop-advanced':
                this.initDragDropAdvancedDemo(container);
                break;
        }
    }
    
    // Initialize methods for each technique demo
    initMorphingCardsDemo(container) {
        const cards = container.querySelectorAll('.morphing-card');
        const resetBtn = container.querySelector('#reset-cards');
        const animateBtn = container.querySelector('#animate-all');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.05) rotateY(5deg)';
                card.style.boxShadow = '0 20px 40px rgba(74, 158, 255, 0.3)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
            
            card.addEventListener('click', () => {
                card.style.transform = 'translateY(-15px) scale(1.1) rotateY(10deg)';
                setTimeout(() => {
                    card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                }, 300);
            });
        });
        
        resetBtn.addEventListener('click', () => {
            cards.forEach(card => {
                card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            });
        });
        
        animateBtn.addEventListener('click', () => {
            cards.forEach((card, index) => {
                setTimeout(() => {
                    card.style.transform = 'translateY(-10px) scale(1.05) rotateY(5deg)';
                    setTimeout(() => {
                        card.style.transform = 'translateY(0) scale(1) rotateY(0deg)';
                    }, 500);
                }, index * 200);
            });
        });
    }
    
    initMagneticButtonsDemo(container) {
        const buttons = container.querySelectorAll('.magnetic-btn');
        const toggleBtn = container.querySelector('#toggle-magnetism');
        const resetBtn = container.querySelector('#reset-positions');
        let magnetismEnabled = true;
        
        buttons.forEach(button => {
            const originalTransform = button.style.transform;
            
            button.addEventListener('mousemove', (e) => {
                if (!magnetismEnabled) return;
                
                const rect = button.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                const maxDistance = 100;
                
                if (distance < maxDistance) {
                    const strength = (maxDistance - distance) / maxDistance;
                    const moveX = deltaX * strength * 0.3;
                    const moveY = deltaY * strength * 0.3;
                    
                    button.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = originalTransform;
            });
        });
        
        toggleBtn.addEventListener('click', () => {
            magnetismEnabled = !magnetismEnabled;
            toggleBtn.textContent = magnetismEnabled ? 'Disable Magnetism' : 'Enable Magnetism';
        });
        
        resetBtn.addEventListener('click', () => {
            buttons.forEach(button => {
                button.style.transform = '';
            });
        });
    }
    
    initParticleSystemsDemo(container) {
        const canvas = container.querySelector('#particle-canvas');
        const ctx = canvas.getContext('2d');
        const particles = [];
        let animationId;
        
        // Particle class
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.life = 1.0;
                this.size = Math.random() * 3 + 1;
                this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                this.life -= 0.01;
                this.size *= 0.99;
            }
            
            draw() {
                ctx.save();
                ctx.globalAlpha = this.life;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }
        
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            particles.forEach((particle, index) => {
                particle.update();
                particle.draw();
                
                if (particle.life <= 0 || particle.size < 0.1) {
                    particles.splice(index, 1);
                }
            });
            
            animationId = requestAnimationFrame(animate);
        }
        
        // Mouse interaction
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            if (Math.random() < 0.1) {
                particles.push(new Particle(x, y));
            }
        });
        
        canvas.addEventListener('click', (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            for (let i = 0; i < 10; i++) {
                particles.push(new Particle(x, y));
            }
        });
        
        // Controls
        const countSlider = container.querySelector('#particle-count');
        const speedSlider = container.querySelector('#particle-speed');
        const sizeSlider = container.querySelector('#particle-size');
        
        countSlider.addEventListener('input', (e) => {
            container.querySelector('#count-value').textContent = e.target.value;
        });
        
        speedSlider.addEventListener('input', (e) => {
            container.querySelector('#speed-value').textContent = e.target.value;
        });
        
        sizeSlider.addEventListener('input', (e) => {
            container.querySelector('#size-value').textContent = e.target.value;
        });
        
        const clearBtn = container.querySelector('#clear-particles');
        const explosionBtn = container.querySelector('#explosion-effect');
        const spiralBtn = container.querySelector('#spiral-effect');
        
        clearBtn.addEventListener('click', () => {
            particles.length = 0;
        });
        
        explosionBtn.addEventListener('click', () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            for (let i = 0; i < 50; i++) {
                const angle = (i / 50) * Math.PI * 2;
                const distance = Math.random() * 50;
                const x = centerX + Math.cos(angle) * distance;
                const y = centerY + Math.sin(angle) * distance;
                particles.push(new Particle(x, y));
            }
        });
        
        spiralBtn.addEventListener('click', () => {
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;
            
            for (let i = 0; i < 30; i++) {
                const angle = (i / 30) * Math.PI * 4;
                const radius = i * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                particles.push(new Particle(x, y));
            }
        });
        
        // Start animation
        animate();
    }
    
    // Add more initialization methods for other techniques...
    initGestureControlsDemo(container) {
        // Gesture controls implementation
        console.log('Initializing gesture controls demo...');
    }
    
    initVoiceInterfaceDemo(container) {
        // Voice interface implementation
        console.log('Initializing voice interface demo...');
    }
    
    initAIPersonalizationDemo(container) {
        // AI personalization implementation
        console.log('Initializing AI personalization demo...');
    }
    
    initGlassmorphismDemo(container) {
        // Glassmorphism implementation
        console.log('Initializing glassmorphism demo...');
    }
    
    initNeomorphismDemo(container) {
        // Neomorphism implementation
        console.log('Initializing neomorphism demo...');
    }
    
    initLiquidAnimationsDemo(container) {
        // Liquid animations implementation
        console.log('Initializing liquid animations demo...');
    }
    
    initMicroInteractionsDemo(container) {
        // Micro interactions implementation
        console.log('Initializing micro interactions demo...');
    }
    
    initScrollTriggeredDemo(container) {
        // Scroll triggered implementation
        console.log('Initializing scroll triggered demo...');
    }
    
    initDragDropAdvancedDemo(container) {
        // Advanced drag and drop implementation
        console.log('Initializing advanced drag and drop demo...');
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UITechniquesShowcase
    };
}
