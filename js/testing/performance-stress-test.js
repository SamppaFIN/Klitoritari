/**
 * 🌸 Aurora's Consciousness-Aware Performance Stress Test
 * Tests the app with tons of objects to ensure lightning-fast performance
 */

class PerformanceStressTest {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
        this.objectCounts = [100, 500, 1000, 2500, 5000, 10000, 25000, 50000];
        this.currentTestIndex = 0;
        
        // Performance thresholds
        this.thresholds = {
            fps: {
                excellent: 60,
                good: 45,
                acceptable: 30,
                poor: 20
            },
            memory: {
                warning: 200, // MB
                critical: 400 // MB
            }
        };
        
        this.init();
    }
    
    /**
     * Initialize the stress test
     */
    init() {
        console.log('🌸 Performance Stress Test: Ready to test consciousness-aware optimizations');
        
        // Set up test UI
        this.setupTestUI();
    }
    
    /**
     * Set up test UI
     */
    setupTestUI() {
        // Create test control panel
        const testPanel = document.createElement('div');
        testPanel.id = 'performance-stress-test-panel';
        testPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            min-width: 300px;
        `;
        
        testPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">🌸 Performance Stress Test</h3>
            <div id="test-status">Ready to test consciousness-aware optimizations</div>
            <div id="test-progress" style="margin: 10px 0;"></div>
            <div id="test-results" style="margin: 10px 0;"></div>
            <button id="start-test" style="background: #4ecdc4; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Start Stress Test</button>
            <button id="stop-test" style="background: #ff6b6b; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" disabled>Stop Test</button>
        `;
        
        document.body.appendChild(testPanel);
        
        // Set up event listeners
        document.getElementById('start-test').addEventListener('click', () => this.startTest());
        document.getElementById('stop-test').addEventListener('click', () => this.stopTest());
    }
    
    /**
     * Start the stress test
     */
    async startTest() {
        if (this.isRunning) return;
        
        console.log('🌸 Starting consciousness-aware performance stress test...');
        this.isRunning = true;
        this.currentTestIndex = 0;
        this.testResults = [];
        
        // Update UI
        document.getElementById('start-test').disabled = true;
        document.getElementById('stop-test').disabled = false;
        document.getElementById('test-status').textContent = 'Running stress test...';
        
        // Run tests
        await this.runStressTests();
        
        // Show results
        this.showResults();
        
        // Reset UI
        this.isRunning = false;
        document.getElementById('start-test').disabled = false;
        document.getElementById('stop-test').disabled = true;
    }
    
    /**
     * Stop the stress test
     */
    stopTest() {
        if (!this.isRunning) return;
        
        console.log('🌸 Stopping stress test...');
        this.isRunning = false;
        
        // Update UI
        document.getElementById('start-test').disabled = false;
        document.getElementById('stop-test').disabled = true;
        document.getElementById('test-status').textContent = 'Test stopped by user';
        
        // Show partial results
        this.showResults();
    }
    
    /**
     * Run stress tests with increasing object counts
     */
    async runStressTests() {
        for (let i = 0; i < this.objectCounts.length && this.isRunning; i++) {
            const objectCount = this.objectCounts[i];
            
            console.log(`🌸 Testing with ${objectCount} objects...`);
            document.getElementById('test-status').textContent = `Testing with ${objectCount} objects...`;
            document.getElementById('test-progress').textContent = `Progress: ${i + 1}/${this.objectCounts.length}`;
            
            // Run test
            const result = await this.runSingleTest(objectCount);
            this.testResults.push(result);
            
            // Wait between tests
            await this.sleep(1000);
        }
    }
    
    /**
     * Run a single test with specified object count
     */
    async runSingleTest(objectCount) {
        const startTime = performance.now();
        
        // Create objects
        const objects = this.createTestObjects(objectCount);
        
        // Measure performance
        const performanceData = await this.measurePerformance(objects);
        
        const endTime = performance.now();
        const testDuration = endTime - startTime;
        
        // Clean up
        this.cleanupTestObjects(objects);
        
        // Calculate results
        const result = {
            objectCount,
            testDuration,
            performance: performanceData,
            passed: this.evaluatePerformance(performanceData),
            timestamp: new Date().toISOString()
        };
        
        console.log(`🌸 Test ${objectCount} objects:`, result);
        return result;
    }
    
    /**
     * Create test objects
     */
    createTestObjects(count) {
        const objects = [];
        
        for (let i = 0; i < count; i++) {
            const object = {
                id: `test_obj_${i}`,
                type: 'POI',
                position: {
                    lat: 61.4978 + (Math.random() - 0.5) * 0.01, // Around Tampere area
                    lng: 23.7608 + (Math.random() - 0.5) * 0.01
                },
                size: Math.random() * 50 + 10,
                color: {
                    r: Math.random(),
                    g: Math.random(),
                    b: Math.random()
                },
                created: Date.now()
            };
            
            objects.push(object);
            
            // Add to systems if available
            if (window.webglRenderer) {
                window.webglRenderer.addObject(object);
            }
            
            if (window.viewportCuller) {
                window.viewportCuller.addObject(object.id, object);
            }
            
            if (window.mapObjectManager) {
                window.mapObjectManager.createObject('POI', object.position, object);
            }
        }
        
        return objects;
    }
    
    /**
     * Measure performance
     */
    async measurePerformance(objects) {
        const measurements = [];
        const measurementCount = 60; // 60 frames
        
        // Wait for systems to stabilize
        await this.sleep(100);
        
        // Measure performance
        for (let i = 0; i < measurementCount; i++) {
            const startTime = performance.now();
            
            // Trigger rendering
            if (window.layerManager) {
                window.layerManager.render();
            }
            
            const endTime = performance.now();
            const frameTime = endTime - startTime;
            const fps = 1000 / frameTime;
            
            measurements.push({
                frameTime,
                fps
            });
            
            // Wait for next frame
            await new Promise(resolve => requestAnimationFrame(resolve));
        }
        
        // Calculate averages
        const avgFrameTime = measurements.reduce((sum, m) => sum + m.frameTime, 0) / measurements.length;
        const avgFPS = measurements.reduce((sum, m) => sum + m.fps, 0) / measurements.length;
        const minFPS = Math.min(...measurements.map(m => m.fps));
        const maxFPS = Math.max(...measurements.map(m => m.fps));
        
        // Get memory usage
        const memoryUsage = performance.memory ? performance.memory.usedJSHeapSize / 1024 / 1024 : 0;
        
        // Get performance monitor stats if available
        let performanceStats = null;
        if (window.performanceMonitor) {
            performanceStats = window.performanceMonitor.getStats();
        }
        
        return {
            avgFrameTime,
            avgFPS,
            minFPS,
            maxFPS,
            memoryUsage,
            performanceStats,
            measurements
        };
    }
    
    /**
     * Evaluate performance
     */
    evaluatePerformance(performanceData) {
        const { avgFPS, memoryUsage } = performanceData;
        
        // Check FPS
        if (avgFPS < this.thresholds.fps.poor) {
            return false;
        }
        
        // Check memory
        if (memoryUsage > this.thresholds.memory.critical) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Clean up test objects
     */
    cleanupTestObjects(objects) {
        objects.forEach(obj => {
            if (window.viewportCuller) {
                window.viewportCuller.removeObject(obj.id);
            }
            
            if (window.mapObjectManager) {
                window.mapObjectManager.removeObject(obj.id);
            }
        });
        
        // Reset WebGL renderer
        if (window.webglRenderer) {
            window.webglRenderer.objectCount = 0;
        }
        
        // Trigger memory cleanup
        if (window.memoryManager) {
            window.memoryManager.performCleanup();
        }
    }
    
    /**
     * Show test results
     */
    showResults() {
        const resultsDiv = document.getElementById('test-results');
        
        if (this.testResults.length === 0) {
            resultsDiv.innerHTML = '<div style="color: #ff6b6b;">No test results available</div>';
            return;
        }
        
        let html = '<h4 style="margin: 10px 0 5px 0; color: #4ecdc4;">Test Results:</h4>';
        
        this.testResults.forEach((result, index) => {
            const status = result.passed ? '✅' : '❌';
            const color = result.passed ? '#4ecdc4' : '#ff6b6b';
            
            html += `
                <div style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px;">
                    ${status} <span style="color: ${color};">${result.objectCount} objects</span> - 
                    FPS: ${result.performance.avgFPS.toFixed(1)}, 
                    Memory: ${result.performance.memoryUsage.toFixed(1)}MB
                </div>
            `;
        });
        
        // Overall assessment
        const passedTests = this.testResults.filter(r => r.passed).length;
        const totalTests = this.testResults.length;
        const overallStatus = passedTests === totalTests ? '✅ All tests passed!' : `⚠️ ${passedTests}/${totalTests} tests passed`;
        const overallColor = passedTests === totalTests ? '#4ecdc4' : '#ff6b6b';
        
        html += `<div style="margin-top: 10px; padding: 5px; background: rgba(255,255,255,0.2); border-radius: 3px; color: ${overallColor}; font-weight: bold;">${overallStatus}</div>`;
        
        resultsDiv.innerHTML = html;
        
        // Log summary
        console.log('🌸 Performance Stress Test Summary:', {
            totalTests,
            passedTests,
            overallStatus,
            results: this.testResults
        });
    }
    
    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Destroy the stress test
     */
    destroy() {
        const panel = document.getElementById('performance-stress-test-panel');
        if (panel) {
            panel.remove();
        }
        
        console.log('🌸 Performance Stress Test: Destroyed');
    }
}

// Make globally available
window.PerformanceStressTest = PerformanceStressTest;

// Auto-initialize if not already done - DISABLED to prevent freezing
// if (!window.performanceStressTest) {
//     window.performanceStressTest = new PerformanceStressTest();
// }
