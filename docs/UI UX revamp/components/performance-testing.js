/**
 * ⚡ Performance Testing Component
 * Advanced performance monitoring and testing utilities
 * 
 * @author Aurora - The Dawn Bringer of Digital Light
 * @version 2.0
 */

/**
 * 🚀 Performance Monitor Component
 */
class PerformanceMonitorComponent extends BaseComponent {
    constructor() {
        super('Performance Monitor', 'Real-time performance metrics and monitoring', 'performance');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'performance-monitor-container';
        
        const label = document.createElement('label');
        label.textContent = 'Performance Monitor';
        label.className = 'monitor-label';
        
        const monitor = document.createElement('div');
        monitor.className = 'vanilla-performance-monitor';
        
        const metrics = document.createElement('div');
        metrics.className = 'performance-metrics';
        metrics.innerHTML = `
            <div class="metric-card">
                <div class="metric-icon">⚡</div>
                <div class="metric-content">
                    <div class="metric-value" id="fps">60</div>
                    <div class="metric-label">FPS</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">🧠</div>
                <div class="metric-content">
                    <div class="metric-value" id="memory">0</div>
                    <div class="metric-label">Memory (MB)</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">⏱️</div>
                <div class="metric-content">
                    <div class="metric-value" id="render-time">0</div>
                    <div class="metric-label">Render (ms)</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">📊</div>
                <div class="metric-content">
                    <div class="metric-value" id="components">0</div>
                    <div class="metric-label">Components</div>
                </div>
            </div>
        `;
        
        const chart = document.createElement('div');
        chart.className = 'performance-chart';
        chart.innerHTML = `
            <canvas id="performance-canvas" width="400" height="200"></canvas>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'performance-controls';
        controls.innerHTML = `
            <button class="control-btn" id="start-monitoring">Start Monitoring</button>
            <button class="control-btn" id="stop-monitoring" disabled>Stop Monitoring</button>
            <button class="control-btn" id="reset-metrics">Reset</button>
        `;
        
        monitor.appendChild(metrics);
        monitor.appendChild(chart);
        monitor.appendChild(controls);
        container.appendChild(label);
        container.appendChild(monitor);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'performance-monitor-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Performance Monitor`;
        label.className = 'monitor-label';
        
        const monitor = document.createElement('div');
        monitor.className = `library-performance-monitor ${libraryId}-performance-monitor`;
        
        const metrics = document.createElement('div');
        metrics.className = 'performance-metrics';
        metrics.innerHTML = `
            <div class="metric-card">
                <div class="metric-icon">⚡</div>
                <div class="metric-content">
                    <div class="metric-value" id="fps-lib">60</div>
                    <div class="metric-label">FPS</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">🧠</div>
                <div class="metric-content">
                    <div class="metric-value" id="memory-lib">0</div>
                    <div class="metric-label">Memory (MB)</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">⏱️</div>
                <div class="metric-content">
                    <div class="metric-value" id="render-time-lib">0</div>
                    <div class="metric-label">Render (ms)</div>
                </div>
            </div>
            <div class="metric-card">
                <div class="metric-icon">📊</div>
                <div class="metric-content">
                    <div class="metric-value" id="components-lib">0</div>
                    <div class="metric-label">Components</div>
                </div>
            </div>
        `;
        
        const chart = document.createElement('div');
        chart.className = 'performance-chart';
        chart.innerHTML = `
            <canvas id="performance-canvas-lib" width="400" height="200"></canvas>
        `;
        
        const controls = document.createElement('div');
        controls.className = 'performance-controls';
        controls.innerHTML = `
            <button class="control-btn" id="start-monitoring-lib">Start Monitoring</button>
            <button class="control-btn" id="stop-monitoring-lib" disabled>Stop Monitoring</button>
            <button class="control-btn" id="reset-metrics-lib">Reset</button>
        `;
        
        monitor.appendChild(metrics);
        monitor.appendChild(chart);
        monitor.appendChild(controls);
        container.appendChild(label);
        container.appendChild(monitor);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const startBtn = element.querySelector('#start-monitoring');
        const stopBtn = element.querySelector('#stop-monitoring');
        const resetBtn = element.querySelector('#reset-metrics');
        const canvas = element.querySelector('#performance-canvas');
        
        let monitoring = false;
        let animationId;
        let frameCount = 0;
        let lastTime = performance.now();
        let fpsHistory = [];
        let memoryHistory = [];
        
        // Initialize performance monitoring
        this.initPerformanceMonitoring(element, canvas);
        
        startBtn.addEventListener('click', () => {
            this.startMonitoring(element, canvas);
            startBtn.disabled = true;
            stopBtn.disabled = false;
        });
        
        stopBtn.addEventListener('click', () => {
            this.stopMonitoring(element, canvas);
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetMetrics(element, canvas);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const startBtn = element.querySelector('#start-monitoring-lib');
        const stopBtn = element.querySelector('#stop-monitoring-lib');
        const resetBtn = element.querySelector('#reset-metrics-lib');
        const canvas = element.querySelector('#performance-canvas-lib');
        
        this.initPerformanceMonitoring(element, canvas);
        
        startBtn.addEventListener('click', () => {
            this.startMonitoring(element, canvas);
            startBtn.disabled = true;
            stopBtn.disabled = false;
        });
        
        stopBtn.addEventListener('click', () => {
            this.stopMonitoring(element, canvas);
            startBtn.disabled = false;
            stopBtn.disabled = true;
        });
        
        resetBtn.addEventListener('click', () => {
            this.resetMetrics(element, canvas);
        });
    }
    
    initPerformanceMonitoring(element, canvas) {
        const ctx = canvas.getContext('2d');
        element.performanceData = {
            fps: 60,
            memory: 0,
            renderTime: 0,
            components: 0,
            fpsHistory: [],
            memoryHistory: [],
            isMonitoring: false,
            animationId: null,
            frameCount: 0,
            lastTime: performance.now()
        };
        
        this.drawChart(canvas, element.performanceData);
    }
    
    startMonitoring(element, canvas) {
        const data = element.performanceData;
        data.isMonitoring = true;
        data.frameCount = 0;
        data.lastTime = performance.now();
        
        const monitor = () => {
            if (!data.isMonitoring) return;
            
            const currentTime = performance.now();
            const deltaTime = currentTime - data.lastTime;
            data.frameCount++;
            
            // Calculate FPS every second
            if (deltaTime >= 1000) {
                data.fps = Math.round((data.frameCount * 1000) / deltaTime);
                data.fpsHistory.push(data.fps);
                if (data.fpsHistory.length > 50) data.fpsHistory.shift();
                
                data.frameCount = 0;
                data.lastTime = currentTime;
            }
            
            // Get memory usage
            if (performance.memory) {
                data.memory = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                data.memoryHistory.push(data.memory);
                if (data.memoryHistory.length > 50) data.memoryHistory.shift();
            }
            
            // Calculate render time
            const renderStart = performance.now();
            this.updateMetrics(element, data);
            this.drawChart(canvas, data);
            const renderEnd = performance.now();
            data.renderTime = Math.round(renderEnd - renderStart);
            
            data.animationId = requestAnimationFrame(monitor);
        };
        
        monitor();
    }
    
    stopMonitoring(element, canvas) {
        const data = element.performanceData;
        data.isMonitoring = false;
        if (data.animationId) {
            cancelAnimationFrame(data.animationId);
        }
    }
    
    resetMetrics(element, canvas) {
        const data = element.performanceData;
        data.fpsHistory = [];
        data.memoryHistory = [];
        data.fps = 60;
        data.memory = 0;
        data.renderTime = 0;
        data.components = 0;
        
        this.updateMetrics(element, data);
        this.drawChart(canvas, data);
    }
    
    updateMetrics(element, data) {
        const fpsElement = element.querySelector('[id*="fps"]');
        const memoryElement = element.querySelector('[id*="memory"]');
        const renderTimeElement = element.querySelector('[id*="render-time"]');
        const componentsElement = element.querySelector('[id*="components"]');
        
        if (fpsElement) fpsElement.textContent = data.fps;
        if (memoryElement) memoryElement.textContent = data.memory;
        if (renderTimeElement) renderTimeElement.textContent = data.renderTime;
        if (componentsElement) componentsElement.textContent = data.components;
        
        // Count components on page
        data.components = document.querySelectorAll('[class*="component"]').length;
    }
    
    drawChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, width, height);
        
        // Draw FPS line
        if (data.fpsHistory.length > 1) {
            ctx.strokeStyle = '#4A9EFF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            data.fpsHistory.forEach((fps, index) => {
                const x = (index / (data.fpsHistory.length - 1)) * width;
                const y = height - (fps / 60) * height;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
        
        // Draw memory line
        if (data.memoryHistory.length > 1) {
            ctx.strokeStyle = '#00FF88';
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            const maxMemory = Math.max(...data.memoryHistory, 100);
            data.memoryHistory.forEach((memory, index) => {
                const x = (index / (data.memoryHistory.length - 1)) * width;
                const y = height - (memory / maxMemory) * height;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            
            ctx.stroke();
        }
        
        // Draw grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('performance-monitor', `
            .performance-monitor-container {
                margin: 1rem 0;
            }
            
            .monitor-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-performance-monitor {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
            
            .performance-metrics {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 1rem;
                margin-bottom: 1.5rem;
            }
            
            .metric-card {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                transition: all 0.3s ease;
            }
            
            .metric-card:hover {
                border-color: var(--cosmic-primary);
                transform: translateY(-2px);
            }
            
            .metric-icon {
                font-size: 1.5rem;
                opacity: 0.8;
            }
            
            .metric-content {
                flex: 1;
            }
            
            .metric-value {
                font-family: var(--font-primary);
                font-size: 1.5rem;
                font-weight: 700;
                color: var(--cosmic-accent);
                line-height: 1;
            }
            
            .metric-label {
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                color: var(--cosmic-neutral);
                margin-top: 0.25rem;
            }
            
            .performance-chart {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .performance-chart canvas {
                width: 100%;
                height: 200px;
                display: block;
            }
            
            .performance-controls {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
            }
            
            .control-btn {
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
            
            .control-btn:hover:not(:disabled) {
                background: var(--cosmic-accent);
                transform: translateY(-2px);
            }
            
            .control-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('performance-monitor-library', `
            .library-performance-monitor {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
        `);
    }
}

/**
 * 🧪 Component Tester Component
 */
class ComponentTesterComponent extends BaseComponent {
    constructor() {
        super('Component Tester', 'Automated component testing and validation', 'testing');
    }
    
    createVanillaElement() {
        const container = document.createElement('div');
        container.className = 'component-tester-container';
        
        const label = document.createElement('label');
        label.textContent = 'Component Tester';
        label.className = 'tester-label';
        
        const tester = document.createElement('div');
        tester.className = 'vanilla-component-tester';
        
        const testArea = document.createElement('div');
        testArea.className = 'test-area';
        testArea.innerHTML = `
            <div class="test-component" id="test-component">
                <button class="test-btn">Test Button</button>
                <input class="test-input" placeholder="Test Input">
                <div class="test-card">
                    <h4>Test Card</h4>
                    <p>This is a test component</p>
                </div>
            </div>
        `;
        
        const testControls = document.createElement('div');
        testControls.className = 'test-controls';
        testControls.innerHTML = `
            <button class="test-run-btn">Run Tests</button>
            <button class="test-clear-btn">Clear Results</button>
            <select class="test-select">
                <option value="all">All Tests</option>
                <option value="accessibility">Accessibility</option>
                <option value="performance">Performance</option>
                <option value="functionality">Functionality</option>
            </select>
        `;
        
        const results = document.createElement('div');
        results.className = 'test-results';
        results.innerHTML = `
            <h4>Test Results</h4>
            <div class="results-list"></div>
        `;
        
        tester.appendChild(testArea);
        tester.appendChild(testControls);
        tester.appendChild(results);
        container.appendChild(label);
        container.appendChild(tester);
        
        return container;
    }
    
    createLibraryElement(libraryId) {
        const container = document.createElement('div');
        container.className = 'component-tester-container';
        
        const label = document.createElement('label');
        label.textContent = `${libraryId.toUpperCase()} Component Tester`;
        label.className = 'tester-label';
        
        const tester = document.createElement('div');
        tester.className = `library-component-tester ${libraryId}-component-tester`;
        
        const testArea = document.createElement('div');
        testArea.className = 'test-area';
        testArea.innerHTML = `
            <div class="test-component" id="test-component-lib">
                <button class="test-btn">Test Button</button>
                <input class="test-input" placeholder="Test Input">
                <div class="test-card">
                    <h4>Test Card</h4>
                    <p>This is a test component</p>
                </div>
            </div>
        `;
        
        const testControls = document.createElement('div');
        testControls.className = 'test-controls';
        testControls.innerHTML = `
            <button class="test-run-btn">Run Tests</button>
            <button class="test-clear-btn">Clear Results</button>
            <select class="test-select">
                <option value="all">All Tests</option>
                <option value="accessibility">Accessibility</option>
                <option value="performance">Performance</option>
                <option value="functionality">Functionality</option>
            </select>
        `;
        
        const results = document.createElement('div');
        results.className = 'test-results';
        results.innerHTML = `
            <h4>Test Results</h4>
            <div class="results-list"></div>
        `;
        
        tester.appendChild(testArea);
        tester.appendChild(testControls);
        tester.appendChild(results);
        container.appendChild(label);
        tester.appendChild(tester);
        
        return container;
    }
    
    setupVanillaEventListeners(element) {
        const runBtn = element.querySelector('.test-run-btn');
        const clearBtn = element.querySelector('.test-clear-btn');
        const testSelect = element.querySelector('.test-select');
        const resultsList = element.querySelector('.results-list');
        const testComponent = element.querySelector('#test-component');
        
        runBtn.addEventListener('click', () => {
            this.runTests(testComponent, resultsList, testSelect.value);
        });
        
        clearBtn.addEventListener('click', () => {
            this.clearResults(resultsList);
        });
        
        testSelect.addEventListener('change', () => {
            this.runTests(testComponent, resultsList, testSelect.value);
        });
    }
    
    setupLibraryEventListeners(element, libraryId) {
        const runBtn = element.querySelector('.test-run-btn');
        const clearBtn = element.querySelector('.test-clear-btn');
        const testSelect = element.querySelector('.test-select');
        const resultsList = element.querySelector('.results-list');
        const testComponent = element.querySelector('#test-component-lib');
        
        runBtn.addEventListener('click', () => {
            this.runTests(testComponent, resultsList, testSelect.value);
        });
        
        clearBtn.addEventListener('click', () => {
            this.clearResults(resultsList);
        });
        
        testSelect.addEventListener('change', () => {
            this.runTests(testComponent, resultsList, testSelect.value);
        });
    }
    
    runTests(component, resultsList, testType) {
        this.clearResults(resultsList);
        
        const tests = this.getTests(testType);
        const results = [];
        
        tests.forEach(test => {
            const result = test.run(component);
            results.push({ name: test.name, result, message: test.message });
        });
        
        this.displayResults(results, resultsList);
    }
    
    getTests(testType) {
        const allTests = [
            {
                name: 'Button Accessibility',
                run: (component) => {
                    const button = component.querySelector('.test-btn');
                    return button && button.getAttribute('aria-label') !== null;
                },
                message: 'Button should have aria-label attribute'
            },
            {
                name: 'Input Focus',
                run: (component) => {
                    const input = component.querySelector('.test-input');
                    if (!input) return false;
                    input.focus();
                    return document.activeElement === input;
                },
                message: 'Input should be focusable'
            },
            {
                name: 'Component Rendering',
                run: (component) => {
                    return component.children.length > 0;
                },
                message: 'Component should render children'
            },
            {
                name: 'Performance Check',
                run: (component) => {
                    const start = performance.now();
                    // Simulate some work
                    for (let i = 0; i < 1000; i++) {
                        component.querySelector('.test-card');
                    }
                    const end = performance.now();
                    return (end - start) < 10; // Should complete in less than 10ms
                },
                message: 'Component should render quickly'
            },
            {
                name: 'Event Handling',
                run: (component) => {
                    const button = component.querySelector('.test-btn');
                    if (!button) return false;
                    
                    let clicked = false;
                    const handler = () => { clicked = true; };
                    button.addEventListener('click', handler);
                    button.click();
                    button.removeEventListener('click', handler);
                    return clicked;
                },
                message: 'Button should handle click events'
            }
        ];
        
        if (testType === 'all') return allTests;
        if (testType === 'accessibility') return allTests.filter(t => t.name.includes('Accessibility'));
        if (testType === 'performance') return allTests.filter(t => t.name.includes('Performance'));
        if (testType === 'functionality') return allTests.filter(t => t.name.includes('Event') || t.name.includes('Rendering'));
        
        return allTests;
    }
    
    displayResults(results, resultsList) {
        results.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = `result-item ${result.result ? 'pass' : 'fail'}`;
            resultItem.innerHTML = `
                <div class="result-icon">${result.result ? '✅' : '❌'}</div>
                <div class="result-content">
                    <div class="result-name">${result.name}</div>
                    <div class="result-message">${result.message}</div>
                </div>
            `;
            resultsList.appendChild(resultItem);
        });
    }
    
    clearResults(resultsList) {
        resultsList.innerHTML = '';
    }
    
    applyVanillaStyles(element) {
        styleManager.addComponentStyles('component-tester', `
            .component-tester-container {
                margin: 1rem 0;
            }
            
            .tester-label {
                display: block;
                margin-bottom: 0.5rem;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .vanilla-component-tester {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
            
            .test-area {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                margin-bottom: 1rem;
            }
            
            .test-component {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .test-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .test-input {
                padding: 0.5rem 1rem;
                background: var(--cosmic-dark);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
            }
            
            .test-card {
                background: var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
                color: var(--cosmic-light);
            }
            
            .test-card h4 {
                margin: 0 0 0.5rem 0;
                font-family: var(--font-primary);
            }
            
            .test-card p {
                margin: 0;
                font-family: var(--font-secondary);
            }
            
            .test-controls {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
                align-items: center;
            }
            
            .test-run-btn, .test-clear-btn {
                padding: 0.5rem 1rem;
                background: var(--cosmic-primary);
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-family: var(--font-primary);
                font-weight: 600;
            }
            
            .test-clear-btn {
                background: var(--cosmic-neutral);
            }
            
            .test-select {
                padding: 0.5rem;
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 6px;
                color: var(--cosmic-light);
                font-family: var(--font-secondary);
            }
            
            .test-results {
                background: var(--cosmic-darker);
                border: 1px solid var(--cosmic-neutral);
                border-radius: 8px;
                padding: 1rem;
            }
            
            .test-results h4 {
                margin: 0 0 1rem 0;
                color: var(--cosmic-light);
                font-family: var(--font-primary);
            }
            
            .result-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0.75rem;
                margin-bottom: 0.5rem;
                border-radius: 6px;
                transition: all 0.3s ease;
            }
            
            .result-item.pass {
                background: rgba(0, 255, 136, 0.1);
                border: 1px solid var(--cosmic-accent);
            }
            
            .result-item.fail {
                background: rgba(255, 51, 102, 0.1);
                border: 1px solid var(--cosmic-danger);
            }
            
            .result-icon {
                font-size: 1.2rem;
            }
            
            .result-name {
                font-family: var(--font-primary);
                font-weight: 600;
                color: var(--cosmic-light);
            }
            
            .result-message {
                font-family: var(--font-secondary);
                font-size: 0.875rem;
                color: var(--cosmic-neutral);
            }
        `);
    }
    
    applyLibraryStyles(element, libraryId) {
        styleManager.addComponentStyles('component-tester-library', `
            .library-component-tester {
                background: var(--cosmic-dark);
                border: 2px solid var(--cosmic-neutral);
                border-radius: 12px;
                padding: 1.5rem;
            }
        `);
    }
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        PerformanceMonitorComponent,
        ComponentTesterComponent
    };
}
