/**
 * 📚 Tutorial System Components
 * Comprehensive tutorial system for teaching advanced UI/UX techniques
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🎓 Interactive Tutorial Component
 */
class InteractiveTutorialComponent extends BaseComponent {
    constructor() {
        super('Interactive Tutorial', 'Step-by-step interactive learning system', 'tutorial');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'tutorial-container';
        
        const label = document.createElement('label');
        label.textContent = 'Interactive Tutorial System';
        label.className = 'tutorial-label';
        
        const tutorial = document.createElement('div');
        tutorial.className = 'vanilla-tutorial';
        
        const header = document.createElement('div');
        header.className = 'tutorial-header';
        header.innerHTML = `
            <div class="tutorial-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">Step 1 of 5</span>
            </div>
            <div class="tutorial-controls">
                <button class="tutorial-btn" id="prev-step" disabled>← Previous</button>
                <button class="tutorial-btn" id="next-step">Next →</button>
                <button class="tutorial-btn" id="reset-tutorial">Reset</button>
            </div>
        `;
        
        const content = document.createElement('div');
        content.className = 'tutorial-content';
        content.innerHTML = `
            <div class="tutorial-step" id="step-1">
                <h3>Welcome to Vanilla.js Mastery</h3>
                <p>Learn advanced UI/UX techniques using pure vanilla JavaScript. This tutorial will guide you through creating stunning, performant components.</p>
                <div class="tutorial-demo">
                    <div class="demo-button" id="demo-btn-1">Click me!</div>
                </div>
            </div>
        `;
        
        const sidebar = document.createElement('div');
        sidebar.className = 'tutorial-sidebar';
        sidebar.innerHTML = `
            <h4>Tutorial Steps</h4>
            <div class="step-list">
                <div class="step-item active" data-step="1">
                    <span class="step-number">1</span>
                    <span class="step-title">Introduction</span>
                </div>
                <div class="step-item" data-step="2">
                    <span class="step-number">2</span>
                    <span class="step-title">Basic Components</span>
                </div>
                <div class="step-item" data-step="3">
                    <span class="step-number">3</span>
                    <span class="step-title">Advanced Animations</span>
                </div>
                <div class="step-item" data-step="4">
                    <span class="step-number">4</span>
                    <span class="step-title">Performance Tips</span>
                </div>
                <div class="step-item" data-step="5">
                    <span class="step-number">5</span>
                    <span class="step-title">Best Practices</span>
                </div>
            </div>
        `;
        
        tutorial.appendChild(header);
        tutorial.appendChild(content);
        tutorial.appendChild(sidebar);
        container.appendChild(label);
        container.appendChild(tutorial);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'tutorial-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Interactive Tutorial`;
        label.className = 'tutorial-label';
        
        const tutorial = document.createElement('div');
        tutorial.className = `library-tutorial ${libraryId}-tutorial`;
        
        const header = document.createElement('div');
        header.className = 'tutorial-header';
        header.innerHTML = `
            <div class="tutorial-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
                <span class="progress-text">Step 1 of 5</span>
            </div>
            <div class="tutorial-controls">
                <button class="tutorial-btn" id="prev-step-lib" disabled>← Previous</button>
                <button class="tutorial-btn" id="next-step-lib">Next →</button>
                <button class="tutorial-btn" id="reset-tutorial-lib">Reset</button>
            </div>
        `;
        
        const content = document.createElement('div');
        content.className = 'tutorial-content';
        content.innerHTML = `
            <div class="tutorial-step" id="step-1-lib">
                <h3>Welcome to Vanilla.js Mastery</h3>
                <p>Learn advanced UI/UX techniques using pure vanilla JavaScript. This tutorial will guide you through creating stunning, performant components.</p>
                <div class="tutorial-demo">
                    <div class="demo-button" id="demo-btn-1-lib">Click me!</div>
                </div>
            </div>
        `;
        
        const sidebar = document.createElement('div');
        sidebar.className = 'tutorial-sidebar';
        sidebar.innerHTML = `
            <h4>Tutorial Steps</h4>
            <div class="step-list">
                <div class="step-item active" data-step="1">
                    <span class="step-number">1</span>
                    <span class="step-title">Introduction</span>
                </div>
                <div class="step-item" data-step="2">
                    <span class="step-number">2</span>
                    <span class="step-title">Basic Components</span>
                </div>
                <div class="step-item" data-step="3">
                    <span class="step-number">3</span>
                    <span class="step-title">Advanced Animations</span>
                </div>
                <div class="step-item" data-step="4">
                    <span class="step-number">4</span>
                    <span class="step-title">Performance Tips</span>
                </div>
                <div class="step-item" data-step="5">
                    <span class="step-number">5</span>
                    <span class="step-title">Best Practices</span>
                </div>
            </div>
        `;
        
        tutorial.appendChild(header);
        tutorial.appendChild(content);
        tutorial.appendChild(sidebar);
        container.appendChild(label);
        container.appendChild(tutorial);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const prevBtn = element.querySelector('#prev-step');
        const nextBtn = element.querySelector('#next-step');
        const resetBtn = element.querySelector('#reset-tutorial');
        const stepItems = element.querySelectorAll('.step-item');
        const progressFill = element.querySelector('.progress-fill');
        const progressText = element.querySelector('.progress-text');
        
        // Initialize tutorial
        this.initTutorial(element);
        
        // Navigation controls
        prevBtn.addEventListener('click', () => {
            this.previousStep(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextStep(element);
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetTutorial(element);
        });
        
        // Step navigation
        stepItems.forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                this.goToStep(element, step);
            });
        });
        
        // Demo interactions
        this.setupDemoInteractions(element);
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const prevBtn = element.querySelector('#prev-step-lib');
        const nextBtn = element.querySelector('#next-step-lib');
        const resetBtn = element.querySelector('#reset-tutorial-lib');
        const stepItems = element.querySelectorAll('.step-item');
        const progressFill = element.querySelector('.progress-fill');
        const progressText = element.querySelector('.progress-text');
        
        this.initTutorial(element);
        
        prevBtn.addEventListener('click', () => {
            this.previousStep(element);
        });
        
        nextBtn.addEventListener('click', () => {
            this.nextStep(element);
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetTutorial(element);
        });
        
        stepItems.forEach(item => {
            item.addEventListener('click', () => {
                const step = parseInt(item.dataset.step);
                this.goToStep(element, step);
            });
        });
        
        this.setupDemoInteractions(element);
    }
    
    initTutorial(element) {
        element.tutorialData = {
            currentStep: 1,
            totalSteps: 5,
            completedSteps: [],
            stepContent: this.getStepContent()
        };
        
        this.updateTutorialUI(element);
    }
    
    getStepContent() {
        return {
            1: {
                title: 'Introduction to Vanilla.js',
                content: `
                    <h3>Welcome to Vanilla.js Mastery</h3>
                    <p>Learn advanced UI/UX techniques using pure vanilla JavaScript. This tutorial will guide you through creating stunning, performant components.</p>
                    <div class="tutorial-demo">
                        <div class="demo-button" id="demo-btn-1">Click me!</div>
                    </div>
                    <div class="tutorial-tip">
                        <strong>💡 Tip:</strong> Vanilla.js gives you complete control over your components without framework overhead.
                    </div>
                `
            },
            2: {
                title: 'Basic Components',
                content: `
                    <h3>Creating Basic Components</h3>
                    <p>Let's start with fundamental UI components. Here's how to create a button with hover effects:</p>
                    <div class="code-example">
                        <pre><code>const button = document.createElement('button');
button.textContent = 'Click me';
button.addEventListener('click', () => {
    console.log('Button clicked!');
});</code></pre>
                    </div>
                    <div class="tutorial-demo">
                        <button class="demo-button" id="demo-btn-2">Hover me!</button>
                    </div>
                    <div class="tutorial-tip">
                        <strong>💡 Tip:</strong> Always use semantic HTML elements for better accessibility.
                    </div>
                `
            },
            3: {
                title: 'Advanced Animations',
                content: `
                    <h3>CSS3 Animations & Transitions</h3>
                    <p>Create smooth animations using CSS3 and JavaScript. Here's a morphing card example:</p>
                    <div class="code-example">
                        <pre><code>.morphing-card {
    transition: all 0.3s ease;
    transform: scale(1);
}

.morphing-card:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 25px rgba(0,0,0,0.3);
}</code></pre>
                    </div>
                    <div class="tutorial-demo">
                        <div class="morphing-card" id="demo-card-3">
                            <h4>Morphing Card</h4>
                            <p>Hover to see the effect!</p>
                        </div>
                    </div>
                    <div class="tutorial-tip">
                        <strong>💡 Tip:</strong> Use CSS transforms for better performance than changing layout properties.
                    </div>
                `
            },
            4: {
                title: 'Performance Optimization',
                content: `
                    <h3>Performance Best Practices</h3>
                    <p>Optimize your components for 60fps performance. Here are key techniques:</p>
                    <ul class="tutorial-list">
                        <li>Use requestAnimationFrame for animations</li>
                        <li>Implement object pooling for frequent operations</li>
                        <li>Debounce scroll and resize events</li>
                        <li>Use CSS transforms instead of layout changes</li>
                    </ul>
                    <div class="tutorial-demo">
                        <div class="performance-demo" id="demo-perf-4">
                            <div class="particle"></div>
                            <div class="particle"></div>
                            <div class="particle"></div>
                        </div>
                    </div>
                    <div class="tutorial-tip">
                        <strong>💡 Tip:</strong> Always measure performance with DevTools before optimizing.
                    </div>
                `
            },
            5: {
                title: 'Best Practices & Patterns',
                content: `
                    <h3>Component Architecture Patterns</h3>
                    <p>Organize your code with these proven patterns:</p>
                    <div class="pattern-example">
                        <h4>Base Component Pattern</h4>
                        <pre><code>class BaseComponent {
    constructor(name) {
        this.name = name;
        this.element = null;
    }
    
    render() {
        // Override in subclasses
    }
    
    destroy() {
        if (this.element) {
            this.element.remove();
        }
    }
}</code></pre>
                    </div>
                    <div class="tutorial-demo">
                        <div class="final-demo" id="demo-final-5">
                            <h4>🎉 Congratulations!</h4>
                            <p>You've completed the Vanilla.js Mastery tutorial!</p>
                        </div>
                    </div>
                    <div class="tutorial-tip">
                        <strong>💡 Tip:</strong> Always follow the single responsibility principle for maintainable code.
                    </div>
                `
            }
        };
    }
    
    nextStep(element) {
        const data = element.tutorialData;
        if (data.currentStep < data.totalSteps) {
            data.currentStep++;
            this.updateTutorialUI(element);
        }
    }
    
    previousStep(element) {
        const data = element.tutorialData;
        if (data.currentStep > 1) {
            data.currentStep--;
            this.updateTutorialUI(element);
        }
    }
    
    goToStep(element, step) {
        const data = element.tutorialData;
        if (step >= 1 && step <= data.totalSteps) {
            data.currentStep = step;
            this.updateTutorialUI(element);
        }
    }
    
    resetTutorial(element) {
        const data = element.tutorialData;
        data.currentStep = 1;
        data.completedSteps = [];
        this.updateTutorialUI(element);
    }
    
    updateTutorialUI(element) {
        const data = element.tutorialData;
        const content = element.querySelector('.tutorial-content');
        const progressFill = element.querySelector('.progress-fill');
        const progressText = element.querySelector('.progress-text');
        const prevBtn = element.querySelector('[id*="prev-step"]');
        const nextBtn = element.querySelector('[id*="next-step"]');
        const stepItems = element.querySelectorAll('.step-item');
        
        // Update content
        const stepContent = data.stepContent[data.currentStep];
        content.innerHTML = stepContent.content;
        
        // Update progress
        const progress = (data.currentStep / data.totalSteps) * 100;
        progressFill.style.width = `${progress}%`;
        progressText.textContent = `Step ${data.currentStep} of ${data.totalSteps}`;
        
        // Update buttons
        prevBtn.disabled = data.currentStep === 1;
        nextBtn.disabled = data.currentStep === data.totalSteps;
        
        // Update step items
        stepItems.forEach((item, index) => {
            const stepNumber = index + 1;
            item.classList.toggle('active', stepNumber === data.currentStep);
            item.classList.toggle('completed', stepNumber < data.currentStep);
        });
        
        // Setup demo interactions for current step
        this.setupDemoInteractions(element);
    }
    
    setupDemoInteractions(element) {
        const data = element.tutorialData;
        
        switch(data.currentStep) {
            case 1:
                this.setupStep1Demo(element);
                break;
            case 2:
                this.setupStep2Demo(element);
                break;
            case 3:
                this.setupStep3Demo(element);
                break;
            case 4:
                this.setupStep4Demo(element);
                break;
            case 5:
                this.setupStep5Demo(element);
                break;
        }
    }
    
    setupStep1Demo(element) {
        const demoBtn = element.querySelector('[id*="demo-btn-1"]');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                demoBtn.style.transform = 'scale(0.95)';
                demoBtn.textContent = 'Clicked!';
                setTimeout(() => {
                    demoBtn.style.transform = 'scale(1)';
                    demoBtn.textContent = 'Click me!';
                }, 200);
            });
        }
    }
    
    setupStep2Demo(element) {
        const demoBtn = element.querySelector('[id*="demo-btn-2"]');
        if (demoBtn) {
            demoBtn.addEventListener('mouseenter', () => {
                demoBtn.style.background = 'var(--cosmic-accent)';
                demoBtn.style.transform = 'translateY(-2px)';
            });
            
            demoBtn.addEventListener('mouseleave', () => {
                demoBtn.style.background = 'var(--cosmic-primary)';
                demoBtn.style.transform = 'translateY(0)';
            });
        }
    }
    
    setupStep3Demo(element) {
        const demoCard = element.querySelector('[id*="demo-card-3"]');
        if (demoCard) {
            demoCard.addEventListener('mouseenter', () => {
                demoCard.style.transform = 'scale(1.05) rotate(2deg)';
                demoCard.style.boxShadow = '0 8px 25px rgba(74, 158, 255, 0.3)';
            });
            
            demoCard.addEventListener('mouseleave', () => {
                demoCard.style.transform = 'scale(1) rotate(0deg)';
                demoCard.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            });
        }
    }
    
    setupStep4Demo(element) {
        const demoPerf = element.querySelector('[id*="demo-perf-4"]');
        if (demoPerf) {
            const particles = demoPerf.querySelectorAll('.particle');
            particles.forEach((particle, index) => {
                particle.style.animationDelay = `${index * 0.2}s`;
            });
        }
    }
    
    setupStep5Demo(element) {
        const demoFinal = element.querySelector('[id*="demo-final-5"]');
        if (demoFinal) {
            demoFinal.style.animation = 'pulse 2s ease-in-out infinite';
        }
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('interactive-tutorial', `
            .tutorial-container {
                margin: 1rem 0;
            }
            
            .tutorial-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-tutorial {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                display: grid;
                grid-template-columns: 1fr 250px;
                gap: 2rem;
            }
            
            .tutorial-header {
                grid-column: 1 / -1;
                margin-bottom: 1rem;
            }
            
            .tutorial-progress {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .progress-bar {
                flex: 1;
                height: 8px;
                background: var(--cosmic-neutral);
                border-radius: 4px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--cosmic-primary), var(--cosmic-accent));
                transition: width 0.3s ease;
            }
            
            .progress-text {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
                min-width: 100px;
            }
            
            .tutorial-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .tutorial-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .tutorial-btn:hover:not(:disabled) {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            .tutorial-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .tutorial-content {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 2rem;
                min-height: 400px;
            }
            
            .tutorial-content h3 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .tutorial-content p {
                color: var(--cosmic-neutral);
                font-family: var(--font-secondary);
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }
            
            .tutorial-demo {
                background: var(--cosmic-dark);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1.5rem;
                margin: 1.5rem 0;
                text-align: center;
            }
            
            .demo-button {
                display: inline-block;
                padding: 1rem 2rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 8px;
                font-family: var(--font-primary);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .demo-button:hover {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            .morphing-card {
                display: inline-block;
                background: var(--cosmic-primary);
                color: white;
                padding: 2rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            
            .morphing-card h4 {
                margin: 0 0 0.5rem 0;
                font-family: var(--font-primary);
            }
            
            .morphing-card p {
                margin: 0;
                font-family: var(--font-secondary);
            }
            
            .performance-demo {
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin: 1rem 0;
            }
            
            .particle {
                width: 20px;
                height: 20px;
                background: var(--cosmic-accent);
                border-radius: 50%;
                animation: float 2s ease-in-out infinite;
            }
            
            .final-demo {
                background: linear-gradient(135deg, var(--cosmic-primary), var(--cosmic-accent));
                color: white;
                padding: 2rem;
                border-radius: 12px;
                text-align: center;
            }
            
            .final-demo h4 {
                margin: 0 0 1rem 0;
                font-family: var(--font-primary);
                font-size: 1.5rem;
            }
            
            .final-demo p {
                margin: 0;
                font-family: var(--font-secondary);
            }
            
            .tutorial-tip {
                background: rgba(74, 158, 255, 0.1);
                border: 1px solid var(--cosmic-primary);
                border-radius: 6px;
                padding: 1rem;
                margin: 1rem 0;
            }
            
            .tutorial-tip strong {
                color: var(--cosmic-accent);
            }
            
            .code-example {
                background: #1a1a2e;
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                padding: 1rem;
                margin: 1rem 0;
                overflow-x: auto;
            }
            
            .code-example pre {
                margin: 0;
                color: var(--cosmic-light);
                font-family: 'Courier New', monospace;
                font-size: 0.875rem;
            }
            
            .tutorial-list {
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
                padding-left: 1.5rem;
            }
            
            .tutorial-list li {
                margin-bottom: 0.5rem;
            }
            
            .pattern-example {
                background: var(--cosmic-dark);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                padding: 1rem;
                margin: 1rem 0;
            }
            
            .pattern-example h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .tutorial-sidebar {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1.5rem;
                height: fit-content;
            }
            
            .tutorial-sidebar h4 {
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                margin: 0 0 1rem 0;
            }
            
            .step-list {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }
            
            .step-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .step-item:hover {
                background: var(--cosmic-neutral);
            }
            
            .step-item.active {
                background: var(--cosmic-primary);
                color: white;
            }
            
            .step-item.completed {
                background: var(--cosmic-accent);
                color: var(--cosmic-dark);
            }
            
            .step-number {
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: var(--font-primary);
                font-weight: 600;
                font-size: 0.875rem;
            }
            
            .step-item.active .step-number,
            .step-item.completed .step-number {
                background: rgba(255, 255, 255, 0.3);
            }
            
            .step-title {
                font-family: var(--font-secondary);
                font-weight: 500;
            }
            
            @keyframes float {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.05); }
            }
            
            @media (max-width: 768px) {
                .vanilla-tutorial {
                    grid-template-columns: 1fr;
                }
                
                .tutorial-sidebar {
                    order: -1;
                }
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('interactive-tutorial-library', `
            .library-tutorial {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
                display: grid;
                grid-template-columns: 1fr 250px;
                gap: 2rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        InteractiveTutorialComponent
    };
}
