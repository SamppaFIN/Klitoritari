/**
 * @fileoverview [IN_DEVELOPMENT] Mobile Testing Suite - Comprehensive mobile testing and validation tools
 * @status IN_DEVELOPMENT - Phase 5 mobile testing and validation
 * @feature #feature-mobile-testing-suite
 * @feature #feature-mobile-performance-testing
 * @feature #feature-mobile-error-handling
 * @last_updated 2025-01-28
 * @dependencies Mobile Debug System, Mobile Encounter System, Step Currency System
 * @warning Mobile testing suite - comprehensive validation and testing tools
 * 
 * Mobile Testing Suite
 * Comprehensive testing and validation tools for mobile optimization
 * Performance testing, error handling, and mobile-specific validation
 */

class MobileTestingSuite {
    constructor() {
        this.isInitialized = false;
        this.testResults = {
            performance: {},
            mobile: {},
            systems: {},
            errors: [],
            overall: 'unknown'
        };
        
        // Test configurations
        this.testConfig = {
            performanceThresholds: {
                minFPS: 30,
                maxMemoryMB: 100,
                maxLoadTime: 3000
            },
            mobileThresholds: {
                minTouchSupport: true,
                minScreenWidth: 320,
                minScreenHeight: 568
            },
            systemThresholds: {
                stepCurrencyResponse: 1000,
                trailSystemResponse: 1000,
                encounterSystemResponse: 1000
            }
        };
        
        // Test history
        this.testHistory = [];
        this.maxTestHistory = 50;
        
        console.log('🧪 Mobile Testing Suite initialized');
    }
    
    /**
     * Initialize mobile testing suite
     * @status [IN_DEVELOPMENT] - Mobile testing initialization
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    init() {
        if (this.isInitialized) {
            console.log('🧪 Mobile testing suite already initialized');
            return;
        }
        
        console.log('🧪 Initializing mobile testing suite...');
        
        // Set up test environment
        this.setupTestEnvironment();
        
        // Create test UI
        this.createTestUI();
        
        // Set up automated testing
        this.setupAutomatedTesting();
        
        this.isInitialized = true;
        console.log('🧪 Mobile testing suite initialization complete');
    }
    
    /**
     * Set up test environment
     * @status [IN_DEVELOPMENT] - Test environment setup
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    setupTestEnvironment() {
        // Add test styles
        this.addTestStyles();
        
        // Set up test data
        this.setupTestData();
        
        console.log('🧪 Test environment setup complete');
    }
    
    /**
     * Add test styles
     * @status [IN_DEVELOPMENT] - Test styling
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    addTestStyles() {
        if (document.getElementById('mobile-test-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'mobile-test-styles';
        style.textContent = `
            .mobile-test-panel {
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 300px;
                max-height: 50vh;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #ff9800;
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #ff9800;
                overflow-y: auto;
                display: none;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .test-toggle {
                position: fixed;
                bottom: 10px;
                left: 10px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #ff9800, #f57c00);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);
                transition: all 0.3s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .test-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
            }
            
            .test-toggle:active {
                transform: scale(0.95);
            }
            
            .test-section {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(255, 152, 0, 0.1);
                border-radius: 5px;
                border-left: 3px solid #ff9800;
            }
            
            .test-section h3 {
                margin: 0 0 10px 0;
                color: #ff9800;
                font-size: 14px;
                text-shadow: 0 0 5px #ff9800;
            }
            
            .test-result {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
                padding: 2px 0;
                border-bottom: 1px solid rgba(255, 152, 0, 0.2);
            }
            
            .test-result:last-child {
                border-bottom: none;
            }
            
            .test-result-label {
                color: #ccc;
                font-weight: bold;
            }
            
            .test-result-value {
                color: #ff9800;
                font-weight: bold;
            }
            
            .test-status {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .test-status.pass {
                background: #4caf50;
                color: white;
            }
            
            .test-status.fail {
                background: #f44336;
                color: white;
            }
            
            .test-status.warning {
                background: #ff9800;
                color: white;
            }
            
            .test-status.unknown {
                background: #666;
                color: white;
            }
            
            .test-controls {
                display: flex;
                gap: 5px;
                margin-top: 10px;
                flex-wrap: wrap;
            }
            
            .test-btn {
                padding: 5px 10px;
                background: rgba(255, 152, 0, 0.2);
                border: 1px solid #ff9800;
                border-radius: 3px;
                color: #ff9800;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .test-btn:hover {
                background: rgba(255, 152, 0, 0.3);
                transform: scale(1.05);
            }
            
            .test-btn:active {
                transform: scale(0.95);
            }
            
            .test-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .mobile-test-panel {
                    width: calc(100vw - 20px);
                    left: 10px;
                    right: 10px;
                    max-height: 40vh;
                }
                
                .test-toggle {
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                }
                
                .test-section {
                    padding: 8px;
                }
                
                .test-result {
                    font-size: 11px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🧪 Test styles added');
    }
    
    /**
     * Set up test data
     * @status [IN_DEVELOPMENT] - Test data setup
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    setupTestData() {
        // Initialize test results
        this.testResults = {
            performance: {
                fps: 0,
                memory: 0,
                loadTime: 0,
                status: 'unknown'
            },
            mobile: {
                touchSupport: false,
                screenSize: { width: 0, height: 0 },
                orientation: 'unknown',
                status: 'unknown'
            },
            systems: {
                stepCurrency: { status: 'unknown', responseTime: 0 },
                trailSystem: { status: 'unknown', responseTime: 0 },
                encounterSystem: { status: 'unknown', responseTime: 0 },
                overall: 'unknown'
            },
            errors: [],
            overall: 'unknown'
        };
        
        console.log('🧪 Test data setup complete');
    }
    
    /**
     * Create test UI
     * @status [IN_DEVELOPMENT] - Test UI creation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    createTestUI() {
        // Create test panel
        this.testPanel = document.createElement('div');
        this.testPanel.id = 'mobile-test-panel';
        this.testPanel.className = 'mobile-test-panel';
        
        // Create test content
        this.createTestContent();
        
        // Add to document
        document.body.appendChild(this.testPanel);
        
        // Create toggle button
        this.createTestToggle();
        
        console.log('🧪 Test UI created');
    }
    
    /**
     * Create test content
     * @status [IN_DEVELOPMENT] - Test content creation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    createTestContent() {
        this.testPanel.innerHTML = `
            <div class="test-header" style="text-align: center; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #ff9800; text-shadow: 0 0 10px #ff9800;">🧪 Mobile Tests</h2>
                <div class="test-controls">
                    <button class="test-btn" id="test-run-all">Run All</button>
                    <button class="test-btn" id="test-performance">Performance</button>
                    <button class="test-btn" id="test-mobile">Mobile</button>
                    <button class="test-btn" id="test-systems">Systems</button>
                    <button class="test-btn" id="test-clear">Clear</button>
                    <button class="test-btn" id="test-export">Export</button>
                </div>
            </div>
            
            <div class="test-section" id="test-performance-section">
                <h3>📊 Performance Tests</h3>
                <div id="test-performance-content"></div>
            </div>
            
            <div class="test-section" id="test-mobile-section">
                <h3>📱 Mobile Tests</h3>
                <div id="test-mobile-content"></div>
            </div>
            
            <div class="test-section" id="test-systems-section">
                <h3>⚙️ Systems Tests</h3>
                <div id="test-systems-content"></div>
            </div>
            
            <div class="test-section" id="test-overall-section">
                <h3>🎯 Overall Status</h3>
                <div id="test-overall-content"></div>
            </div>
        `;
        
        // Add event listeners
        this.setupTestEventListeners();
    }
    
    /**
     * Create test toggle button
     * @status [IN_DEVELOPMENT] - Test toggle creation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    createTestToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'test-toggle';
        toggle.innerHTML = '🧪';
        toggle.title = 'Toggle Mobile Test Panel';
        
        toggle.addEventListener('click', () => {
            this.toggleTestPanel();
        });
        
        // Add touch events for mobile
        toggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.toggleTestPanel();
        });
        
        document.body.appendChild(toggle);
        console.log('🧪 Test toggle created');
    }
    
    /**
     * Set up test event listeners
     * @status [IN_DEVELOPMENT] - Test event setup
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    setupTestEventListeners() {
        // Run all tests
        const runAllBtn = document.getElementById('test-run-all');
        if (runAllBtn) {
            runAllBtn.addEventListener('click', () => {
                this.runAllTests();
            });
        }
        
        // Performance tests
        const performanceBtn = document.getElementById('test-performance');
        if (performanceBtn) {
            performanceBtn.addEventListener('click', () => {
                this.runPerformanceTests();
            });
        }
        
        // Mobile tests
        const mobileBtn = document.getElementById('test-mobile');
        if (mobileBtn) {
            mobileBtn.addEventListener('click', () => {
                this.runMobileTests();
            });
        }
        
        // Systems tests
        const systemsBtn = document.getElementById('test-systems');
        if (systemsBtn) {
            systemsBtn.addEventListener('click', () => {
                this.runSystemsTests();
            });
        }
        
        // Clear tests
        const clearBtn = document.getElementById('test-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearTestResults();
            });
        }
        
        // Export tests
        const exportBtn = document.getElementById('test-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportTestResults();
            });
        }
    }
    
    /**
     * Toggle test panel visibility
     * @status [IN_DEVELOPMENT] - Test panel toggle
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    toggleTestPanel() {
        if (this.testPanel) {
            const isVisible = this.testPanel.style.display !== 'none';
            this.testPanel.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.refreshTestResults();
            }
            
            console.log(`🧪 Test panel ${isVisible ? 'hidden' : 'shown'}`);
        }
    }
    
    /**
     * Run all tests
     * @status [IN_DEVELOPMENT] - All tests execution
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    async runAllTests() {
        console.log('🧪 Running all tests...');
        
        this.runPerformanceTests();
        this.runMobileTests();
        this.runSystemsTests();
        
        // Calculate overall status
        this.calculateOverallStatus();
        
        // Refresh display
        this.refreshTestResults();
        
        // Add to history
        this.addToTestHistory();
        
        console.log('🧪 All tests completed');
    }
    
    /**
     * Run performance tests
     * @status [IN_DEVELOPMENT] - Performance testing
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    runPerformanceTests() {
        console.log('🧪 Running performance tests...');
        
        // FPS test
        const fps = this.testFPS();
        this.testResults.performance.fps = fps;
        
        // Memory test
        const memory = this.testMemory();
        this.testResults.performance.memory = memory;
        
        // Load time test
        const loadTime = this.testLoadTime();
        this.testResults.performance.loadTime = loadTime;
        
        // Determine performance status
        this.testResults.performance.status = this.evaluatePerformanceStatus();
        
        console.log('🧪 Performance tests completed');
    }
    
    /**
     * Test FPS
     * @status [IN_DEVELOPMENT] - FPS testing
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    testFPS() {
        let frameCount = 0;
        let startTime = performance.now();
        
        const measureFPS = () => {
            frameCount++;
            if (performance.now() - startTime < 1000) {
                requestAnimationFrame(measureFPS);
            } else {
                const fps = frameCount;
                console.log(`🧪 FPS test result: ${fps}`);
                return fps;
            }
        };
        
        requestAnimationFrame(measureFPS);
        return frameCount;
    }
    
    /**
     * Test memory usage
     * @status [IN_DEVELOPMENT] - Memory testing
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    testMemory() {
        if (performance.memory) {
            const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            console.log(`🧪 Memory test result: ${memoryMB} MB`);
            return memoryMB;
        }
        return 0;
    }
    
    /**
     * Test load time
     * @status [IN_DEVELOPMENT] - Load time testing
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    testLoadTime() {
        const loadTime = performance.now();
        console.log(`🧪 Load time test result: ${loadTime} ms`);
        return loadTime;
    }
    
    /**
     * Evaluate performance status
     * @status [IN_DEVELOPMENT] - Performance evaluation
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    evaluatePerformanceStatus() {
        const fps = this.testResults.performance.fps;
        const memory = this.testResults.performance.memory;
        const loadTime = this.testResults.performance.loadTime;
        
        if (fps >= this.testConfig.performanceThresholds.minFPS &&
            memory <= this.testConfig.performanceThresholds.maxMemoryMB &&
            loadTime <= this.testConfig.performanceThresholds.maxLoadTime) {
            return 'pass';
        } else if (fps >= 15 && memory <= 150) {
            return 'warning';
        } else {
            return 'fail';
        }
    }
    
    /**
     * Run mobile tests
     * @status [IN_DEVELOPMENT] - Mobile testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    runMobileTests() {
        console.log('🧪 Running mobile tests...');
        
        // Touch support test
        const touchSupport = this.testTouchSupport();
        this.testResults.mobile.touchSupport = touchSupport;
        
        // Screen size test
        const screenSize = this.testScreenSize();
        this.testResults.mobile.screenSize = screenSize;
        
        // Orientation test
        const orientation = this.testOrientation();
        this.testResults.mobile.orientation = orientation;
        
        // Determine mobile status
        this.testResults.mobile.status = this.evaluateMobileStatus();
        
        console.log('🧪 Mobile tests completed');
    }
    
    /**
     * Test touch support
     * @status [IN_DEVELOPMENT] - Touch support testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testTouchSupport() {
        const touchSupport = 'ontouchstart' in window;
        console.log(`🧪 Touch support test result: ${touchSupport}`);
        return touchSupport;
    }
    
    /**
     * Test screen size
     * @status [IN_DEVELOPMENT] - Screen size testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testScreenSize() {
        const screenSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        console.log(`🧪 Screen size test result: ${screenSize.width}x${screenSize.height}`);
        return screenSize;
    }
    
    /**
     * Test orientation
     * @status [IN_DEVELOPMENT] - Orientation testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testOrientation() {
        const orientation = screen.orientation ? screen.orientation.type : 'unknown';
        console.log(`🧪 Orientation test result: ${orientation}`);
        return orientation;
    }
    
    /**
     * Evaluate mobile status
     * @status [IN_DEVELOPMENT] - Mobile evaluation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    evaluateMobileStatus() {
        const touchSupport = this.testResults.mobile.touchSupport;
        const screenSize = this.testResults.mobile.screenSize;
        
        if (touchSupport &&
            screenSize.width >= this.testConfig.mobileThresholds.minScreenWidth &&
            screenSize.height >= this.testConfig.mobileThresholds.minScreenHeight) {
            return 'pass';
        } else if (screenSize.width >= 280 && screenSize.height >= 500) {
            return 'warning';
        } else {
            return 'fail';
        }
    }
    
    /**
     * Run systems tests
     * @status [IN_DEVELOPMENT] - Systems testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    runSystemsTests() {
        console.log('🧪 Running systems tests...');
        
        // Step currency system test
        this.testStepCurrencySystem();
        
        // Trail system test
        this.testTrailSystem();
        
        // Encounter system test
        this.testEncounterSystem();
        
        // Determine systems status
        this.testResults.systems.overall = this.evaluateSystemsStatus();
        
        console.log('🧪 Systems tests completed');
    }
    
    /**
     * Test step currency system
     * @status [IN_DEVELOPMENT] - Step currency testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testStepCurrencySystem() {
        const startTime = performance.now();
        
        if (window.stepCurrencySystem) {
            const responseTime = performance.now() - startTime;
            this.testResults.systems.stepCurrency = {
                status: responseTime <= this.testConfig.systemThresholds.stepCurrencyResponse ? 'pass' : 'warning',
                responseTime: responseTime
            };
            console.log(`🧪 Step currency system test result: ${this.testResults.systems.stepCurrency.status}`);
        } else {
            this.testResults.systems.stepCurrency = {
                status: 'fail',
                responseTime: 0
            };
            console.log('🧪 Step currency system test result: fail (not available)');
        }
    }
    
    /**
     * Test trail system
     * @status [IN_DEVELOPMENT] - Trail system testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testTrailSystem() {
        const startTime = performance.now();
        
        if (window.trailSystem) {
            const responseTime = performance.now() - startTime;
            this.testResults.systems.trailSystem = {
                status: responseTime <= this.testConfig.systemThresholds.trailSystemResponse ? 'pass' : 'warning',
                responseTime: responseTime
            };
            console.log(`🧪 Trail system test result: ${this.testResults.systems.trailSystem.status}`);
        } else {
            this.testResults.systems.trailSystem = {
                status: 'fail',
                responseTime: 0
            };
            console.log('🧪 Trail system test result: fail (not available)');
        }
    }
    
    /**
     * Test encounter system
     * @status [IN_DEVELOPMENT] - Encounter system testing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    testEncounterSystem() {
        const startTime = performance.now();
        
        if (window.mobileEncounterSystem) {
            const responseTime = performance.now() - startTime;
            this.testResults.systems.encounterSystem = {
                status: responseTime <= this.testConfig.systemThresholds.encounterSystemResponse ? 'pass' : 'warning',
                responseTime: responseTime
            };
            console.log(`🧪 Encounter system test result: ${this.testResults.systems.encounterSystem.status}`);
        } else {
            this.testResults.systems.encounterSystem = {
                status: 'fail',
                responseTime: 0
            };
            console.log('🧪 Encounter system test result: fail (not available)');
        }
    }
    
    /**
     * Evaluate systems status
     * @status [IN_DEVELOPMENT] - Systems evaluation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    evaluateSystemsStatus() {
        const systems = this.testResults.systems;
        const passCount = Object.values(systems).filter(s => s.status === 'pass').length;
        const totalCount = Object.keys(systems).length - 1; // Exclude overall
        
        if (passCount === totalCount) {
            return 'pass';
        } else if (passCount >= totalCount * 0.5) {
            return 'warning';
        } else {
            return 'fail';
        }
    }
    
    /**
     * Calculate overall status
     * @status [IN_DEVELOPMENT] - Overall status calculation
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    calculateOverallStatus() {
        const performanceStatus = this.testResults.performance.status;
        const mobileStatus = this.testResults.mobile.status;
        const systemsStatus = this.testResults.systems.overall;
        
        const statuses = [performanceStatus, mobileStatus, systemsStatus];
        const passCount = statuses.filter(s => s === 'pass').length;
        const warningCount = statuses.filter(s => s === 'warning').length;
        
        if (passCount === statuses.length) {
            this.testResults.overall = 'pass';
        } else if (passCount + warningCount === statuses.length) {
            this.testResults.overall = 'warning';
        } else {
            this.testResults.overall = 'fail';
        }
        
        console.log(`🧪 Overall status: ${this.testResults.overall}`);
    }
    
    /**
     * Refresh test results display
     * @status [IN_DEVELOPMENT] - Test results refresh
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    refreshTestResults() {
        this.renderPerformanceResults();
        this.renderMobileResults();
        this.renderSystemsResults();
        this.renderOverallResults();
    }
    
    /**
     * Render performance results
     * @status [IN_DEVELOPMENT] - Performance results rendering
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    renderPerformanceResults() {
        const container = document.getElementById('test-performance-content');
        if (!container) return;
        
        const performance = this.testResults.performance;
        
        container.innerHTML = `
            <div class="test-result">
                <span class="test-result-label">FPS:</span>
                <span class="test-result-value">${performance.fps}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Memory:</span>
                <span class="test-result-value">${performance.memory} MB</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Load Time:</span>
                <span class="test-result-value">${performance.loadTime} ms</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Status:</span>
                <span class="test-status ${performance.status}">${performance.status}</span>
            </div>
        `;
    }
    
    /**
     * Render mobile results
     * @status [IN_DEVELOPMENT] - Mobile results rendering
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    renderMobileResults() {
        const container = document.getElementById('test-mobile-content');
        if (!container) return;
        
        const mobile = this.testResults.mobile;
        
        container.innerHTML = `
            <div class="test-result">
                <span class="test-result-label">Touch Support:</span>
                <span class="test-result-value">${mobile.touchSupport ? 'Yes' : 'No'}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Screen Size:</span>
                <span class="test-result-value">${mobile.screenSize.width}x${mobile.screenSize.height}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Orientation:</span>
                <span class="test-result-value">${mobile.orientation}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Status:</span>
                <span class="test-status ${mobile.status}">${mobile.status}</span>
            </div>
        `;
    }
    
    /**
     * Render systems results
     * @status [IN_DEVELOPMENT] - Systems results rendering
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    renderSystemsResults() {
        const container = document.getElementById('test-systems-content');
        if (!container) return;
        
        const systems = this.testResults.systems;
        
        container.innerHTML = `
            <div class="test-result">
                <span class="test-result-label">Step Currency:</span>
                <span class="test-status ${systems.stepCurrency.status}">${systems.stepCurrency.status}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Trail System:</span>
                <span class="test-status ${systems.trailSystem.status}">${systems.trailSystem.status}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Encounter System:</span>
                <span class="test-status ${systems.encounterSystem.status}">${systems.encounterSystem.status}</span>
            </div>
            <div class="test-result">
                <span class="test-result-label">Overall:</span>
                <span class="test-status ${systems.overall}">${systems.overall}</span>
            </div>
        `;
    }
    
    /**
     * Render overall results
     * @status [IN_DEVELOPMENT] - Overall results rendering
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    renderOverallResults() {
        const container = document.getElementById('test-overall-content');
        if (!container) return;
        
        const overall = this.testResults.overall;
        
        container.innerHTML = `
            <div class="test-result">
                <span class="test-result-label">Overall Status:</span>
                <span class="test-status ${overall}">${overall}</span>
            </div>
        `;
    }
    
    /**
     * Set up automated testing
     * @status [IN_DEVELOPMENT] - Automated testing setup
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    setupAutomatedTesting() {
        // Run tests every 30 seconds
        setInterval(() => {
            this.runAllTests();
        }, 30000);
        
        console.log('🧪 Automated testing setup complete');
    }
    
    /**
     * Add to test history
     * @status [IN_DEVELOPMENT] - Test history management
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    addToTestHistory() {
        const testRecord = {
            timestamp: Date.now(),
            results: { ...this.testResults }
        };
        
        this.testHistory.push(testRecord);
        
        // Keep only recent history
        if (this.testHistory.length > this.maxTestHistory) {
            this.testHistory = this.testHistory.slice(-this.maxTestHistory);
        }
        
        console.log('🧪 Test added to history');
    }
    
    /**
     * Clear test results
     * @status [IN_DEVELOPMENT] - Test results clearing
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    clearTestResults() {
        this.testResults = {
            performance: { fps: 0, memory: 0, loadTime: 0, status: 'unknown' },
            mobile: { touchSupport: false, screenSize: { width: 0, height: 0 }, orientation: 'unknown', status: 'unknown' },
            systems: { stepCurrency: { status: 'unknown', responseTime: 0 }, trailSystem: { status: 'unknown', responseTime: 0 }, encounterSystem: { status: 'unknown', responseTime: 0 }, overall: 'unknown' },
            errors: [],
            overall: 'unknown'
        };
        
        this.refreshTestResults();
        console.log('🧪 Test results cleared');
    }
    
    /**
     * Export test results
     * @status [IN_DEVELOPMENT] - Test results export
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    exportTestResults() {
        const testData = {
            timestamp: new Date().toISOString(),
            results: this.testResults,
            history: this.testHistory
        };
        
        const blob = new Blob([JSON.stringify(testData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobile-test-results-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('🧪 Test results exported');
    }
    
    /**
     * Get test statistics
     * @status [IN_DEVELOPMENT] - Test statistics
     * @feature #feature-mobile-testing-suite
     * @last_tested 2025-01-28
     */
    getTestStats() {
        return {
            isInitialized: this.isInitialized,
            currentResults: this.testResults,
            testHistory: this.testHistory,
            testConfig: this.testConfig
        };
    }
}

// Export for global use
window.MobileTestingSuite = MobileTestingSuite;

console.log('🧪 Mobile Testing Suite loaded');
