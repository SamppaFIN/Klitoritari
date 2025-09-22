/**
 * Device Testing Suite - Comprehensive testing for Eldritch Sanctuary
 * Tests device compatibility, step detection, UI interactions, and game flows
 */

class DeviceTestingSuite {
    constructor() {
        this.testResults = new Map();
        this.isRunning = false;
        this.currentTest = null;
        this.testQueue = [];
        this.deviceInfo = this.detectDeviceInfo();
        this.testStartTime = null;
        
        console.log('🧪 Device Testing Suite initialized');
        console.log('📱 Device Info:', this.deviceInfo);
    }
    
    /**
     * Detect device information
     */
    detectDeviceInfo() {
        const userAgent = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
        const isDesktop = !isMobile && !isTablet;
        
        return {
            userAgent,
            isMobile,
            isTablet,
            isDesktop,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio || 1,
            orientation: screen.orientation ? screen.orientation.type : 'unknown',
            touchSupport: 'ontouchstart' in window,
            webGLSupport: this.checkWebGLSupport(),
            webAudioSupport: this.checkWebAudioSupport(),
            geolocationSupport: 'geolocation' in navigator,
            localStorageSupport: this.checkLocalStorageSupport(),
            websocketSupport: 'WebSocket' in window
        };
    }
    
    /**
     * Check WebGL support
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check Web Audio support
     */
    checkWebAudioSupport() {
        try {
            return !!(window.AudioContext || window.webkitAudioContext);
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Check localStorage support
     */
    checkLocalStorageSupport() {
        try {
            const test = 'test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * Run all tests
     */
    async runAllTests() {
        if (this.isRunning) {
            console.warn('🧪 Tests already running');
            return;
        }
        
        this.isRunning = true;
        this.testStartTime = Date.now();
        this.testResults.clear();
        
        console.log('🧪 Starting comprehensive device testing...');
        
        try {
            // Core functionality tests
            await this.runCoreTests();
            
            // UI/UX tests
            await this.runUITests();
            
            // Performance tests
            await this.runPerformanceTests();
            
            // Game flow tests
            await this.runGameFlowTests();
            
            // Step detection tests
            await this.runStepDetectionTests();
            
            // Audio tests
            await this.runAudioTests();
            
            // Map interaction tests
            await this.runMapTests();
            
            // Multiplayer tests
            await this.runMultiplayerTests();
            
            // Generate test report
            this.generateTestReport();
            
        } catch (error) {
            console.error('🧪 Test suite failed:', error);
            this.testResults.set('test_suite_error', {
                status: 'failed',
                error: error.message,
                timestamp: Date.now()
            });
        } finally {
            this.isRunning = false;
            console.log('🧪 Device testing completed');
        }
    }
    
    /**
     * Core functionality tests
     */
    async runCoreTests() {
        console.log('🧪 Running core functionality tests...');
        
        // Test 1: App initialization
        await this.runTest('app_initialization', async () => {
            if (!window.eldritchApp) {
                throw new Error('EldritchApp not available');
            }
            return { status: 'passed', message: 'App initialized successfully' };
        });
        
        // Test 2: Map engine
        await this.runTest('map_engine', async () => {
            if (!window.mapEngine) {
                throw new Error('MapEngine not available');
            }
            if (!window.mapEngine.map) {
                throw new Error('Map not initialized');
            }
            return { status: 'passed', message: 'Map engine working' };
        });
        
        // Test 3: Geolocation
        await this.runTest('geolocation', async () => {
            if (!navigator.geolocation) {
                throw new Error('Geolocation not supported');
            }
            return { status: 'passed', message: 'Geolocation supported' };
        });
        
        // Test 4: Asset Manager
        await this.runTest('asset_manager', async () => {
            if (!window.assetManager) {
                throw new Error('AssetManager not available');
            }
            return { status: 'passed', message: 'Asset manager working' };
        });
        
        // Test 5: Sound Manager
        await this.runTest('sound_manager', async () => {
            if (!window.soundManager) {
                throw new Error('SoundManager not available');
            }
            return { status: 'passed', message: 'Sound manager working' };
        });
    }
    
    /**
     * UI/UX tests
     */
    async runUITests() {
        console.log('🧪 Running UI/UX tests...');
        
        // Test 1: Header visibility
        await this.runTest('header_visibility', async () => {
            const header = document.getElementById('header');
            if (!header) {
                throw new Error('Header element not found');
            }
            const isVisible = header.offsetHeight > 0;
            return { 
                status: isVisible ? 'passed' : 'failed', 
                message: `Header visibility: ${isVisible}`,
                details: { height: header.offsetHeight }
            };
        });
        
        // Test 2: Side panel functionality
        await this.runTest('side_panel', async () => {
            const panel = document.querySelector('.glassmorphic-side-panel');
            if (!panel) {
                throw new Error('Side panel not found');
            }
            
            // Test panel opening
            if (window.panelManager) {
                window.panelManager.openPanel('debug');
                await this.wait(100);
                const isOpen = panel.classList.contains('open');
                return { 
                    status: isOpen ? 'passed' : 'failed', 
                    message: `Panel opening: ${isOpen}`,
                    details: { hasPanelManager: true, isOpen }
                };
            } else {
                return { 
                    status: 'warning', 
                    message: 'Panel manager not available',
                    details: { hasPanelManager: false }
                };
            }
        });
        
        // Test 3: Responsive design
        await this.runTest('responsive_design', async () => {
            const isMobile = this.deviceInfo.isMobile;
            const viewportWidth = this.deviceInfo.viewportWidth;
            
            let status = 'passed';
            let issues = [];
            
            if (isMobile && viewportWidth < 320) {
                status = 'warning';
                issues.push('Very narrow viewport on mobile');
            }
            
            if (viewportWidth < 280) {
                status = 'failed';
                issues.push('Viewport too narrow');
            }
            
            return { 
                status, 
                message: `Responsive design check: ${status}`,
                details: { 
                    isMobile, 
                    viewportWidth, 
                    issues 
                }
            };
        });
        
        // Test 4: Z-index issues
        await this.runTest('z_index_check', async () => {
            const elements = document.querySelectorAll('[style*="z-index"]');
            const zIndexValues = Array.from(elements).map(el => {
                const style = window.getComputedStyle(el);
                return parseInt(style.zIndex) || 0;
            });
            
            const hasConflicts = zIndexValues.some((z, i) => 
                zIndexValues.some((otherZ, j) => i !== j && z === otherZ && z > 0)
            );
            
            return { 
                status: hasConflicts ? 'warning' : 'passed', 
                message: `Z-index conflicts: ${hasConflicts}`,
                details: { zIndexValues, hasConflicts }
            };
        });
    }
    
    /**
     * Performance tests
     */
    async runPerformanceTests() {
        console.log('🧪 Running performance tests...');
        
        // Test 1: Memory usage
        await this.runTest('memory_usage', async () => {
            if (performance.memory) {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
                const totalMB = Math.round(memory.totalJSHeapSize / 1024 / 1024);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
                
                let status = 'passed';
                if (usedMB > limitMB * 0.8) {
                    status = 'warning';
                }
                if (usedMB > limitMB * 0.95) {
                    status = 'failed';
                }
                
                return { 
                    status, 
                    message: `Memory usage: ${usedMB}MB / ${limitMB}MB`,
                    details: { usedMB, totalMB, limitMB }
                };
            } else {
                return { 
                    status: 'skipped', 
                    message: 'Memory API not available' 
                };
            }
        });
        
        // Test 2: Frame rate
        await this.runTest('frame_rate', async () => {
            let frameCount = 0;
            let startTime = performance.now();
            
            const measureFrameRate = () => {
                frameCount++;
                if (frameCount < 60) {
                    requestAnimationFrame(measureFrameRate);
                } else {
                    const endTime = performance.now();
                    const fps = Math.round((frameCount * 1000) / (endTime - startTime));
                    
                    let status = 'passed';
                    if (fps < 30) {
                        status = 'warning';
                    }
                    if (fps < 15) {
                        status = 'failed';
                    }
                    
                    return { 
                        status, 
                        message: `Frame rate: ${fps} FPS`,
                        details: { fps, frameCount, duration: endTime - startTime }
                    };
                }
            };
            
            return new Promise(resolve => {
                requestAnimationFrame(() => {
                    const result = measureFrameRate();
                    if (result) resolve(result);
                });
            });
        });
        
        // Test 3: Load time
        await this.runTest('load_time', async () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            if (navigation) {
                const loadTime = Math.round(navigation.loadEventEnd - navigation.loadEventStart);
                const domContentLoaded = Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart);
                
                let status = 'passed';
                if (loadTime > 3000) {
                    status = 'warning';
                }
                if (loadTime > 5000) {
                    status = 'failed';
                }
                
                return { 
                    status, 
                    message: `Load time: ${loadTime}ms`,
                    details: { loadTime, domContentLoaded }
                };
            } else {
                return { 
                    status: 'skipped', 
                    message: 'Navigation timing not available' 
                };
            }
        });
    }
    
    /**
     * Game flow tests
     */
    async runGameFlowTests() {
        console.log('🧪 Running game flow tests...');
        
        // Test 1: Quest system initialization
        await this.runTest('quest_system_init', async () => {
            if (!window.unifiedQuestSystem) {
                throw new Error('Quest system not available');
            }
            return { status: 'passed', message: 'Quest system initialized' };
        });
        
        // Test 2: Step currency system
        await this.runTest('step_currency', async () => {
            if (!window.stepCurrencySystem) {
                throw new Error('Step currency system not available');
            }
            const steps = window.stepCurrencySystem.getCurrentSteps();
            return { 
                status: 'passed', 
                message: `Step system working, current steps: ${steps}`,
                details: { currentSteps: steps }
            };
        });
        
        // Test 3: Microgames
        await this.runTest('microgames', async () => {
            if (!window.microgamesManager) {
                throw new Error('Microgames manager not available');
            }
            return { status: 'passed', message: 'Microgames system available' };
        });
        
        // Test 4: Moral choice system
        await this.runTest('moral_choices', async () => {
            if (!window.moralChoiceSystem) {
                throw new Error('Moral choice system not available');
            }
            return { status: 'passed', message: 'Moral choice system available' };
        });
    }
    
    /**
     * Step detection tests
     */
    async runStepDetectionTests() {
        console.log('🧪 Running step detection tests...');
        
        // Test 1: Accelerometer support
        await this.runTest('accelerometer', async () => {
            if (window.DeviceMotionEvent) {
                return { status: 'passed', message: 'Device motion events supported' };
            } else {
                return { status: 'warning', message: 'Device motion events not supported' };
            }
        });
        
        // Test 2: Gyroscope support
        await this.runTest('gyroscope', async () => {
            if (window.DeviceOrientationEvent) {
                return { status: 'passed', message: 'Device orientation events supported' };
            } else {
                return { status: 'warning', message: 'Device orientation events not supported' };
            }
        });
        
        // Test 3: Step simulation
        await this.runTest('step_simulation', async () => {
            if (window.stepCurrencySystem) {
                const initialSteps = window.stepCurrencySystem.getCurrentSteps();
                window.stepCurrencySystem.addManualStep(1);
                const newSteps = window.stepCurrencySystem.getCurrentSteps();
                
                if (newSteps === initialSteps + 1) {
                    return { status: 'passed', message: 'Step simulation working' };
                } else {
                    return { status: 'failed', message: 'Step simulation failed' };
                }
            } else {
                return { status: 'failed', message: 'Step currency system not available' };
            }
        });
    }
    
    /**
     * Audio tests
     */
    async runAudioTests() {
        console.log('🧪 Running audio tests...');
        
        // Test 1: Web Audio API
        await this.runTest('web_audio', async () => {
            if (this.deviceInfo.webAudioSupport) {
                return { status: 'passed', message: 'Web Audio API supported' };
            } else {
                return { status: 'failed', message: 'Web Audio API not supported' };
            }
        });
        
        // Test 2: Sound playback
        await this.runTest('sound_playback', async () => {
            if (window.soundManager) {
                try {
                    window.soundManager.playBling();
                    return { status: 'passed', message: 'Sound playback working' };
                } catch (error) {
                    return { status: 'failed', message: `Sound playback failed: ${error.message}` };
                }
            } else {
                return { status: 'failed', message: 'Sound manager not available' };
            }
        });
        
        // Test 3: Asset audio
        await this.runTest('asset_audio', async () => {
            if (window.assetManager) {
                try {
                    const asset = window.assetManager.getAsset('step_sound');
                    if (asset) {
                        return { status: 'passed', message: 'Audio assets loaded' };
                    } else {
                        return { status: 'warning', message: 'Audio assets not loaded (using fallbacks)' };
                    }
                } catch (error) {
                    return { status: 'warning', message: `Asset audio test failed: ${error.message}` };
                }
            } else {
                return { status: 'failed', message: 'Asset manager not available' };
            }
        });
    }
    
    /**
     * Map interaction tests
     */
    async runMapTests() {
        console.log('🧪 Running map interaction tests...');
        
        // Test 1: Map rendering
        await this.runTest('map_rendering', async () => {
            if (window.mapEngine && window.mapEngine.map) {
                const mapContainer = document.getElementById('map');
                if (mapContainer && mapContainer.offsetHeight > 0) {
                    return { status: 'passed', message: 'Map rendering correctly' };
                } else {
                    return { status: 'failed', message: 'Map container not visible' };
                }
            } else {
                return { status: 'failed', message: 'Map not initialized' };
            }
        });
        
        // Test 2: Marker creation
        await this.runTest('marker_creation', async () => {
            if (window.mapEngine) {
                try {
                    // Test creating a temporary marker
                    const testMarker = L.marker([60.1699, 24.9384]).addTo(window.mapEngine.map);
                    testMarker.remove();
                    return { status: 'passed', message: 'Marker creation working' };
                } catch (error) {
                    return { status: 'failed', message: `Marker creation failed: ${error.message}` };
                }
            } else {
                return { status: 'failed', message: 'Map engine not available' };
            }
        });
        
        // Test 3: Flag layer
        await this.runTest('flag_layer', async () => {
            if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                return { status: 'passed', message: 'Flag layer available' };
            } else {
                return { status: 'warning', message: 'Flag layer not available' };
            }
        });
    }
    
    /**
     * Multiplayer tests
     */
    async runMultiplayerTests() {
        console.log('🧪 Running multiplayer tests...');
        
        // Test 1: WebSocket support
        await this.runTest('websocket_support', async () => {
            if (this.deviceInfo.websocketSupport) {
                return { status: 'passed', message: 'WebSocket supported' };
            } else {
                return { status: 'failed', message: 'WebSocket not supported' };
            }
        });
        
        // Test 2: Multiplayer manager
        await this.runTest('multiplayer_manager', async () => {
            if (window.multiplayerManager) {
                return { status: 'passed', message: 'Multiplayer manager available' };
            } else {
                return { status: 'warning', message: 'Multiplayer manager not available' };
            }
        });
    }
    
    /**
     * Run a single test
     */
    async runTest(testName, testFunction) {
        console.log(`🧪 Running test: ${testName}`);
        
        try {
            const startTime = performance.now();
            const result = await testFunction();
            const duration = Math.round(performance.now() - startTime);
            
            this.testResults.set(testName, {
                ...result,
                duration,
                timestamp: Date.now()
            });
            
            console.log(`✅ ${testName}: ${result.status} (${duration}ms)`);
            return result;
            
        } catch (error) {
            const result = {
                status: 'failed',
                error: error.message,
                duration: 0,
                timestamp: Date.now()
            };
            
            this.testResults.set(testName, result);
            console.error(`❌ ${testName}: ${error.message}`);
            return result;
        }
    }
    
    /**
     * Wait for specified milliseconds
     */
    wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Generate comprehensive test report
     */
    generateTestReport() {
        const totalTests = this.testResults.size;
        const passedTests = Array.from(this.testResults.values()).filter(r => r.status === 'passed').length;
        const failedTests = Array.from(this.testResults.values()).filter(r => r.status === 'failed').length;
        const warningTests = Array.from(this.testResults.values()).filter(r => r.status === 'warning').length;
        const skippedTests = Array.from(this.testResults.values()).filter(r => r.status === 'skipped').length;
        
        const totalDuration = Date.now() - this.testStartTime;
        
        const report = {
            summary: {
                totalTests,
                passed: passedTests,
                failed: failedTests,
                warnings: warningTests,
                skipped: skippedTests,
                duration: totalDuration,
                deviceInfo: this.deviceInfo
            },
            results: Object.fromEntries(this.testResults),
            recommendations: this.generateRecommendations()
        };
        
        console.log('🧪 Test Report Generated:');
        console.log(`📊 Total: ${totalTests} | ✅ Passed: ${passedTests} | ❌ Failed: ${failedTests} | ⚠️ Warnings: ${warningTests} | ⏭️ Skipped: ${skippedTests}`);
        console.log(`⏱️ Duration: ${totalDuration}ms`);
        
        // Store report globally for access
        window.deviceTestReport = report;
        
        return report;
    }
    
    /**
     * Generate recommendations based on test results
     */
    generateRecommendations() {
        const recommendations = [];
        const results = Array.from(this.testResults.values());
        
        // Check for critical failures
        const criticalFailures = results.filter(r => r.status === 'failed' && 
            ['app_initialization', 'map_engine', 'geolocation'].includes(r.error));
        
        if (criticalFailures.length > 0) {
            recommendations.push({
                priority: 'critical',
                message: 'Critical systems failed - game may not function properly',
                tests: criticalFailures.map(r => r.error)
            });
        }
        
        // Check for performance issues
        const performanceIssues = results.filter(r => 
            r.status === 'warning' && 
            ['memory_usage', 'frame_rate', 'load_time'].includes(r.error)
        );
        
        if (performanceIssues.length > 0) {
            recommendations.push({
                priority: 'high',
                message: 'Performance issues detected - consider optimization',
                tests: performanceIssues.map(r => r.error)
            });
        }
        
        // Check for mobile-specific issues
        if (this.deviceInfo.isMobile) {
            const mobileIssues = results.filter(r => 
                r.status === 'warning' && 
                ['responsive_design', 'accelerometer', 'gyroscope'].includes(r.error)
            );
            
            if (mobileIssues.length > 0) {
                recommendations.push({
                    priority: 'medium',
                    message: 'Mobile-specific issues detected',
                    tests: mobileIssues.map(r => r.error)
                });
            }
        }
        
        return recommendations;
    }
    
    /**
     * Export test results
     */
    exportResults() {
        const report = window.deviceTestReport;
        if (!report) {
            console.warn('🧪 No test report available');
            return;
        }
        
        const dataStr = JSON.stringify(report, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `device-test-report-${Date.now()}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
}

// Export for global access
window.DeviceTestingSuite = DeviceTestingSuite;
