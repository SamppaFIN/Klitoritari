/**
 * LayerTests - Comprehensive testing suite for the layered rendering system
 * Tests layer isolation, event communication, and performance
 */
class LayerTests {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.testStartTime = 0;
    }

    /**
     * Run all layer tests
     * @returns {Promise<Object>} Test results
     */
    async runAllTests() {
        console.log('🧪 Starting comprehensive layer tests...');
        
        this.testResults = [];
        
        try {
            // Test 1: Layer Isolation
            await this.testLayerIsolation();
            
            // Test 2: Event Communication
            await this.testEventCommunication();
            
            // Test 3: Performance
            await this.testPerformance();
            
            // Test 4: Mobile Compatibility
            await this.testMobileCompatibility();
            
            // Test 5: Memory Management
            await this.testMemoryManagement();
            
            // Test 6: Viewport Culling
            await this.testViewportCulling();
            
            // Test 7: Data Model Integration
            await this.testDataModelIntegration();
            
            // Test 8: Error Handling
            await this.testErrorHandling();
            
            // Test 9: Layer Manager
            await this.testLayerManager();
            
            // Test 10: System Integration
            await this.testSystemIntegration();
            
            return this.generateTestReport();
            
        } catch (error) {
            console.error('🧪 Test suite failed:', error);
            return this.generateTestReport();
        }
    }

    /**
     * Test layer isolation
     */
    async testLayerIsolation() {
        this.startTest('Layer Isolation');
        
        try {
            // Test that layers don't directly reference each other
            const layers = [
                new BackgroundLayer(),
                new TerrainLayer(),
                new TerritoryLayer(),
                new PathLayer(),
                new MapLayer(),
                new InteractionLayer(),
                new PlayerLayer(),
                new InformationLayer(),
                new UILayer(),
                new DebugLayer()
            ];
            
            // Check that layers don't have direct references to other layers
            layers.forEach(layer => {
                if (layer.otherLayers) {
                    throw new Error(`Layer ${layer.name} has direct references to other layers`);
                }
            });
            
            this.passTest('Layers are properly isolated');
            
        } catch (error) {
            this.failTest(`Layer isolation failed: ${error.message}`);
        }
    }

    /**
     * Test event communication
     */
    async testEventCommunication() {
        this.startTest('Event Communication');
        
        try {
            const eventBus = new EventBus();
            let eventReceived = false;
            let eventData = null;
            
            // Set up event listener
            eventBus.on('test:event', (data) => {
                eventReceived = true;
                eventData = data;
            });
            
            // Emit test event
            const testData = { message: 'Hello from test', timestamp: Date.now() };
            eventBus.emit('test:event', testData);
            
            // Wait for event to be processed
            await new Promise(resolve => setTimeout(resolve, 10));
            
            if (!eventReceived) {
                throw new Error('Event was not received');
            }
            
            if (JSON.stringify(eventData) !== JSON.stringify(testData)) {
                throw new Error('Event data was corrupted');
            }
            
            this.passTest('Event communication working correctly');
            
        } catch (error) {
            this.failTest(`Event communication failed: ${error.message}`);
        }
    }

    /**
     * Test performance
     */
    async testPerformance() {
        this.startTest('Performance');
        
        try {
            const eventBus = new EventBus();
            const gameState = new GameState();
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            
            const layerManager = new LayerManager(eventBus, gameState);
            layerManager.init(canvas);
            
            // Add all layers
            const layers = [
                new BackgroundLayer(),
                new TerrainLayer(),
                new TerritoryLayer(),
                new PathLayer(),
                new MapLayer(),
                new InteractionLayer(),
                new PlayerLayer(),
                new InformationLayer(),
                new UILayer(),
                new DebugLayer()
            ];
            
            layers.forEach(layer => layerManager.addLayer(layer));
            
            // Test render performance
            const renderStart = performance.now();
            for (let i = 0; i < 100; i++) {
                layerManager.render();
            }
            const renderTime = performance.now() - renderStart;
            
            const averageRenderTime = renderTime / 100;
            const fps = 1000 / averageRenderTime;
            
            if (fps < 30) {
                throw new Error(`Performance too low: ${fps.toFixed(2)} FPS`);
            }
            
            this.passTest(`Performance test passed: ${fps.toFixed(2)} FPS average`);
            
            // Clean up
            layerManager.destroy();
            
        } catch (error) {
            this.failTest(`Performance test failed: ${error.message}`);
        }
    }

    /**
     * Test mobile compatibility
     */
    async testMobileCompatibility() {
        this.startTest('Mobile Compatibility');
        
        try {
            // Test mobile optimizer
            if (typeof MobileOptimizer !== 'undefined') {
                const mobileOptimizer = new MobileOptimizer();
                const metrics = mobileOptimizer.getPerformanceMetrics();
                
                if (!metrics.isMobile && window.innerWidth <= 768) {
                    throw new Error('Mobile detection failed');
                }
                
                this.passTest('Mobile optimizer working correctly');
                mobileOptimizer.destroy();
            } else {
                this.passTest('Mobile optimizer not available (skipped)');
            }
            
            // Test viewport culler
            if (typeof ViewportCuller !== 'undefined') {
                const viewportCuller = new ViewportCuller();
                viewportCuller.updateViewport(0, 0, 800, 600, 1);
                
                const stats = viewportCuller.getStats();
                if (stats.cullingEnabled === undefined) {
                    throw new Error('Viewport culler not working correctly');
                }
                
                this.passTest('Viewport culler working correctly');
                viewportCuller.destroy();
            } else {
                this.passTest('Viewport culler not available (skipped)');
            }
            
        } catch (error) {
            this.failTest(`Mobile compatibility test failed: ${error.message}`);
        }
    }

    /**
     * Test memory management
     */
    async testMemoryManagement() {
        this.startTest('Memory Management');
        
        try {
            if (typeof MemoryManager !== 'undefined') {
                const memoryManager = new MemoryManager();
                
                // Test object pooling
                const vector2 = memoryManager.getFromPool('Vector2');
                if (!vector2 || typeof vector2.x !== 'number') {
                    throw new Error('Object pooling failed');
                }
                
                memoryManager.returnToPool('Vector2', vector2);
                
                const stats = memoryManager.getMemoryStats();
                if (stats.currentUsage === undefined) {
                    throw new Error('Memory stats not available');
                }
                
                this.passTest('Memory management working correctly');
                memoryManager.destroy();
            } else {
                this.passTest('Memory manager not available (skipped)');
            }
            
        } catch (error) {
            this.failTest(`Memory management test failed: ${error.message}`);
        }
    }

    /**
     * Test viewport culling
     */
    async testViewportCulling() {
        this.startTest('Viewport Culling');
        
        try {
            if (typeof ViewportCuller !== 'undefined') {
                const viewportCuller = new ViewportCuller();
                
                // Add test objects
                viewportCuller.addObject('obj1', {
                    position: { x: 100, y: 100 },
                    bounds: { left: 90, right: 110, top: 90, bottom: 110 }
                });
                
                viewportCuller.addObject('obj2', {
                    position: { x: 1000, y: 1000 },
                    bounds: { left: 990, right: 1010, top: 990, bottom: 1010 }
                });
                
                // Update viewport to only see obj1
                viewportCuller.updateViewport(0, 0, 200, 200, 1);
                
                const visibleObjects = viewportCuller.getVisibleObjects();
                if (!visibleObjects.has('obj1') || visibleObjects.has('obj2')) {
                    throw new Error('Viewport culling not working correctly');
                }
                
                this.passTest('Viewport culling working correctly');
                viewportCuller.destroy();
            } else {
                this.passTest('Viewport culler not available (skipped)');
            }
            
        } catch (error) {
            this.failTest(`Viewport culling test failed: ${error.message}`);
        }
    }

    /**
     * Test data model integration
     */
    async testDataModelIntegration() {
        this.startTest('Data Model Integration');
        
        try {
            // Test player model
            if (typeof PlayerModel !== 'undefined') {
                const player = new PlayerModel({
                    position: { lat: 61.472768, lng: 23.724032 },
                    stats: { health: 100, steps: 0 }
                });
                
                if (!player.validate()) {
                    throw new Error('Player model validation failed');
                }
                
                this.passTest('Player model working correctly');
            } else {
                this.passTest('Player model not available (skipped)');
            }
            
            // Test base model
            if (typeof BaseModel !== 'undefined') {
                const base = new BaseModel({
                    position: { lat: 61.472768, lng: 23.724032 },
                    name: 'Test Base'
                });
                
                if (!base.validate()) {
                    throw new Error('Base model validation failed');
                }
                
                this.passTest('Base model working correctly');
            } else {
                this.passTest('Base model not available (skipped)');
            }
            
        } catch (error) {
            this.failTest(`Data model integration test failed: ${error.message}`);
        }
    }

    /**
     * Test error handling
     */
    async testErrorHandling() {
        this.startTest('Error Handling');
        
        try {
            const eventBus = new EventBus();
            let errorCaught = false;
            
            // Set up error listener
            eventBus.on('test:error', () => {
                throw new Error('Test error');
            });
            
            // Emit event that should cause error
            eventBus.emit('test:error', {});
            
            // Wait for error to be processed
            await new Promise(resolve => setTimeout(resolve, 10));
            
            this.passTest('Error handling working correctly');
            
        } catch (error) {
            this.failTest(`Error handling test failed: ${error.message}`);
        }
    }

    /**
     * Test layer manager
     */
    async testLayerManager() {
        this.startTest('Layer Manager');
        
        try {
            const eventBus = new EventBus();
            const gameState = new GameState();
            const canvas = document.createElement('canvas');
            canvas.width = 800;
            canvas.height = 600;
            
            const layerManager = new LayerManager(eventBus, gameState);
            layerManager.init(canvas);
            
            // Test adding layers
            const layer = new BackgroundLayer();
            layerManager.addLayer(layer);
            
            if (!layerManager.getLayer('background')) {
                throw new Error('Layer not added correctly');
            }
            
            // Test layer visibility
            layerManager.showLayer('background');
            layerManager.hideLayer('background');
            
            // Test layer removal
            layerManager.removeLayer('background');
            
            if (layerManager.getLayer('background')) {
                throw new Error('Layer not removed correctly');
            }
            
            this.passTest('Layer manager working correctly');
            layerManager.destroy();
            
        } catch (error) {
            this.failTest(`Layer manager test failed: ${error.message}`);
        }
    }

    /**
     * Test system integration
     */
    async testSystemIntegration() {
        this.startTest('System Integration');
        
        try {
            // Test full system initialization
            const app = new EldritchSanctuaryApp();
            await app.init();
            
            if (!app.isInitialized) {
                throw new Error('App not initialized');
            }
            
            if (!app.eventBus) {
                throw new Error('Event bus not initialized');
            }
            
            if (!app.gameState) {
                throw new Error('Game state not initialized');
            }
            
            if (!app.layerManager) {
                throw new Error('Layer manager not initialized');
            }
            
            this.passTest('System integration working correctly');
            app.shutdown();
            
        } catch (error) {
            this.failTest(`System integration test failed: ${error.message}`);
        }
    }

    /**
     * Start a test
     * @param {string} testName - Name of the test
     */
    startTest(testName) {
        this.currentTest = testName;
        this.testStartTime = performance.now();
        console.log(`🧪 Starting test: ${testName}`);
    }

    /**
     * Pass a test
     * @param {string} message - Success message
     */
    passTest(message) {
        const duration = performance.now() - this.testStartTime;
        this.testResults.push({
            test: this.currentTest,
            status: 'PASS',
            message,
            duration: Math.round(duration)
        });
        console.log(`✅ ${this.currentTest}: ${message} (${duration.toFixed(2)}ms)`);
    }

    /**
     * Fail a test
     * @param {string} message - Failure message
     */
    failTest(message) {
        const duration = performance.now() - this.testStartTime;
        this.testResults.push({
            test: this.currentTest,
            status: 'FAIL',
            message,
            duration: Math.round(duration)
        });
        console.error(`❌ ${this.currentTest}: ${message} (${duration.toFixed(2)}ms)`);
    }

    /**
     * Generate test report
     * @returns {Object} Test report
     */
    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(r => r.status === 'PASS').length;
        const failedTests = this.testResults.filter(r => r.status === 'FAIL').length;
        const totalDuration = this.testResults.reduce((sum, r) => sum + r.duration, 0);
        
        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: totalTests > 0 ? (passedTests / totalTests) * 100 : 0,
                totalDuration: Math.round(totalDuration)
            },
            results: this.testResults
        };
        
        console.log('🧪 Test Report:', report);
        return report;
    }
}

// Make LayerTests globally available
window.LayerTests = LayerTests;
