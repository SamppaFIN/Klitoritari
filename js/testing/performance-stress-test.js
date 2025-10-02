/**
 * 🌸 Aurora's Consciousness-Aware Performance Stress Test
 * Tests the app with tons of objects to ensure lightning-fast performance
 */

class PerformanceStressTest {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
        this.objectCounts = [100, 500, 1000, 1500, 2000]; // Reduced for better performance
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
        // Create toggle button first
        const toggleButton = document.createElement('button');
        toggleButton.id = 'stress-test-toggle';
        toggleButton.innerHTML = '🌸 Stress Test';
        toggleButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(255, 107, 107, 0.9);
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 5px;
            font-family: monospace;
            font-size: 11px;
            z-index: 10003;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        `;
        
        // Create test control panel
        const testPanel = document.createElement('div');
        testPanel.id = 'performance-stress-test-panel';
        testPanel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 10px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10002;
            min-width: 300px;
            display: none;
        `;
        
         testPanel.innerHTML = `
             <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">🌸 Performance Stress Test</h3>
             <div id="test-status">Ready to test consciousness-aware optimizations</div>
             <div id="emergency-status" style="margin: 5px 0; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 3px; font-size: 11px;"></div>
             <div id="test-progress" style="margin: 10px 0;"></div>
             <div id="test-results" style="margin: 10px 0;"></div>
             <button id="start-test" style="background: #4ecdc4; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer;">Start Stress Test</button>
             <button id="stop-test" style="background: #ff6b6b; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; margin-left: 10px;" disabled>Stop Test</button>
         `;
        
        document.body.appendChild(toggleButton);
        document.body.appendChild(testPanel);
        
        // Set up event listeners
        toggleButton.addEventListener('click', () => {
            const isVisible = testPanel.style.display !== 'none';
            testPanel.style.display = isVisible ? 'none' : 'block';
            toggleButton.innerHTML = isVisible ? '🌸 Stress Test' : '🌸 Hide Test';
        });
        
        document.getElementById('start-test').addEventListener('click', () => this.startTest());
        document.getElementById('stop-test').addEventListener('click', () => this.stopTest());
        
        // Update emergency status periodically
        this.updateEmergencyStatus();
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
     * Create test objects with proper coordinate conversion
     */
    createTestObjects(count) {
        const objects = [];
        
        // Get current map bounds for realistic positioning
        let mapBounds = null;
        if (window.map && window.map.getBounds) {
            mapBounds = window.map.getBounds();
        } else {
            // Default to Tampere area
            mapBounds = {
                getNorth: () => 61.5078,
                getSouth: () => 61.4878,
                getEast: () => 23.7708,
                getWest: () => 23.7508
            };
        }
        
        for (let i = 0; i < count; i++) {
            // Create realistic coordinates within map bounds
            const lat = mapBounds.getSouth() + Math.random() * (mapBounds.getNorth() - mapBounds.getSouth());
            const lng = mapBounds.getWest() + Math.random() * (mapBounds.getEast() - mapBounds.getWest());
            
            const object = {
                id: `stress_test_obj_${i}`,
                type: 'POI',
                position: { lat, lng },
                size: Math.random() * 30 + 10,
                color: {
                    r: Math.random(),
                    g: Math.random(),
                    b: Math.random()
                },
                created: Date.now()
            };
            
            objects.push(object);
            
            // Add to map object manager (primary system)
            if (window.mapObjectManager) {
                try {
                    const objectId = window.mapObjectManager.createObject('POI', object.position, {
                        size: object.size,
                        color: object.color,
                        testObject: true
                    });
                    object.mapObjectId = objectId;
                } catch (error) {
                    console.warn(`Failed to create map object ${i}:`, error);
                }
            }
            
            // Add to viewport culler if available
            if (window.viewportCuller) {
                window.viewportCuller.addObject(object.id, {
                    position: object.position,
                    size: object.size
                });
            }
        }
        
        console.log(`🌸 Created ${objects.length} test objects`);
        return objects;
    }
    
    /**
     * Measure performance with proper rendering integration
     */
    async measurePerformance(objects) {
        const measurements = [];
        const measurementCount = 30; // Reduced for faster testing
        
        // Wait for systems to stabilize
        await this.sleep(200);
        
        // Measure performance
        for (let i = 0; i < measurementCount; i++) {
            const startTime = performance.now();
            
            // Trigger proper rendering through layer manager
            if (window.layerManager) {
                window.layerManager.render();
            }
            
            // Also trigger map rendering if available
            if (window.map && window.map.invalidateSize) {
                window.map.invalidateSize();
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
     * Clean up test objects properly
     */
    cleanupTestObjects(objects) {
        console.log(`🌸 Cleaning up ${objects.length} test objects...`);
        
        objects.forEach(obj => {
            // Remove from map object manager
            if (obj.mapObjectId && window.mapObjectManager) {
                try {
                    window.mapObjectManager.removeObject(obj.mapObjectId);
                } catch (error) {
                    console.warn(`Failed to remove map object ${obj.mapObjectId}:`, error);
                }
            }
            
            // Remove from viewport culler
            if (window.viewportCuller) {
                window.viewportCuller.removeObject(obj.id);
            }
        });
        
        // Trigger memory cleanup
        if (window.memoryManager) {
            window.memoryManager.performCleanup();
        }
        
        console.log('🌸 Test objects cleaned up');
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
     * Update emergency status display
     */
    updateEmergencyStatus() {
        const statusDiv = document.getElementById('emergency-status');
        if (!statusDiv) return;
        
        if (window.emergencyPerformanceManager) {
            const status = window.emergencyPerformanceManager.getStatus();
            const color = status.isActive ? '#ff6b6b' : '#4ecdc4';
            const icon = status.isActive ? '🚨' : '✅';
            
            statusDiv.innerHTML = `
                ${icon} Emergency Mode: ${status.isActive ? 'ACTIVE' : 'Normal'} | 
                Objects: ${status.objectCount} | 
                FPS: ${status.fps.toFixed(1)} | 
                Memory: ${status.memoryUsage.toFixed(1)}MB
            `;
            statusDiv.style.color = color;
        } else {
            statusDiv.innerHTML = '⚠️ Emergency Manager not available';
            statusDiv.style.color = '#ff6b6b';
        }
        
        // Update every 2 seconds
        setTimeout(() => this.updateEmergencyStatus(), 2000);
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

// Auto-initialize if not already done - RE-ENABLED with proper positioning
if (!window.performanceStressTest) {
    window.performanceStressTest = new PerformanceStressTest();
}
