/**
 * WebGL Implementation Test Script
 * Tests the WebGL map rendering system and provides debugging tools
 */

class WebGLTestSuite {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
    }
    
    async runAllTests() {
        console.log('ðŸ§ª Starting WebGL test suite...');
        this.isRunning = true;
        this.testResults = [];
        
        try {
            await this.testWebGLSupport();
            await this.testRendererInitialization();
            await this.testObjectCreation();
            await this.testPerformance();
            await this.testIntegration();
            
            this.displayResults();
        } catch (error) {
            console.error('ðŸ§ª Test suite failed:', error);
        } finally {
            this.isRunning = false;
        }
    }
    
    async testWebGLSupport() {
        console.log('ðŸ§ª Testing WebGL support...');
        
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        
        const result = {
            name: 'WebGL Support',
            passed: !!gl,
            details: gl ? `WebGL ${gl.getParameter(gl.VERSION)}` : 'WebGL not supported'
        };
        
        this.testResults.push(result);
        console.log(result.passed ? '…' : 'âŒ', result.name, result.details);
    }
    
    async testRendererInitialization() {
        console.log('ðŸ§ª Testing WebGL renderer initialization...');
        
        try {
            const renderer = new WebGLMapRenderer();
            const result = {
                name: 'Renderer Initialization',
                passed: !!renderer && !!renderer.gl,
                details: renderer ? 'Renderer created successfully' : 'Renderer creation failed'
            };
            
            this.testResults.push(result);
            console.log(result.passed ? '…' : 'âŒ', result.name, result.details);
            
            // Clean up
            if (renderer) {
                renderer.destroy();
            }
        } catch (error) {
            const result = {
                name: 'Renderer Initialization',
                passed: false,
                details: `Error: ${error.message}`
            };
            
            this.testResults.push(result);
            console.log('âŒ', result.name, result.details);
        }
    }
    
    async testObjectCreation() {
        console.log('ðŸ§ª Testing object creation...');
        
        try {
            const renderer = new WebGLMapRenderer();
            
            // Test adding objects
            const testObject = {
                x: 0.5,
                y: 0.5,
                minZoom: 10,
                maxZoom: 20,
                size: 25,
                colorR: 1.0,
                colorG: 0.0,
                colorB: 0.0,
                type: 1
            };
            
            const added = renderer.addObject(testObject);
            const objectCount = renderer.getObjectCount();
            
            const result = {
                name: 'Object Creation',
                passed: added && objectCount === 1,
                details: `Added: ${added}, Count: ${objectCount}`
            };
            
            this.testResults.push(result);
            console.log(result.passed ? '…' : 'âŒ', result.name, result.details);
            
            // Clean up
            renderer.destroy();
        } catch (error) {
            const result = {
                name: 'Object Creation',
                passed: false,
                details: `Error: ${error.message}`
            };
            
            this.testResults.push(result);
            console.log('âŒ', result.name, result.details);
        }
    }
    
    async testPerformance() {
        console.log('ðŸ§ª Testing performance...');
        
        try {
            const renderer = new WebGLMapRenderer();
            
            // Add multiple objects
            const objectCount = 100;
            for (let i = 0; i < objectCount; i++) {
                renderer.addObject({
                    x: Math.random() * 2 - 1,
                    y: Math.random() * 2 - 1,
                    minZoom: 10,
                    maxZoom: 20,
                    size: 20,
                    type: Math.floor(Math.random() * 7) + 1
                });
            }
            
            // Measure render time
            const startTime = performance.now();
            renderer.render();
            const endTime = performance.now();
            const renderTime = endTime - startTime;
            
            const result = {
                name: 'Performance',
                passed: renderTime < 16.67, // 60 FPS threshold
                details: `Rendered ${objectCount} objects in ${renderTime.toFixed(2)}ms`
            };
            
            this.testResults.push(result);
            console.log(result.passed ? '…' : 'âŒ', result.name, result.details);
            
            // Clean up
            renderer.destroy();
        } catch (error) {
            const result = {
                name: 'Performance',
                passed: false,
                details: `Error: ${error.message}`
            };
            
            this.testResults.push(result);
            console.log('âŒ', result.name, result.details);
        }
    }
    
    async testIntegration() {
        console.log('ðŸ§ª Testing integration...');
        
        try {
            // Check if enhanced map engine is available
            const hasEnhancedEngine = typeof EnhancedMapEngine !== 'undefined';
            const hasWebGLRenderer = typeof WebGLMapRenderer !== 'undefined';
            const hasIntegration = typeof WebGLMapIntegration !== 'undefined';
            
            const result = {
                name: 'Integration',
                passed: hasEnhancedEngine && hasWebGLRenderer && hasIntegration,
                details: `Enhanced Engine: ${hasEnhancedEngine}, Renderer: ${hasWebGLRenderer}, Integration: ${hasIntegration}`
            };
            
            this.testResults.push(result);
            console.log(result.passed ? '…' : 'âŒ', result.name, result.details);
        } catch (error) {
            const result = {
                name: 'Integration',
                passed: false,
                details: `Error: ${error.message}`
            };
            
            this.testResults.push(result);
            console.log('âŒ', result.name, result.details);
        }
    }
    
    displayResults() {
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        console.log(`\nðŸ§ª Test Results: ${passed}/${total} tests passed`);
        
        // Create results panel
        this.createResultsPanel();
    }
    
    createResultsPanel() {
        // Remove existing panel
        const existing = document.getElementById('webgl-test-results');
        if (existing) {
            existing.remove();
        }
        
        // Create results panel
        const panel = document.createElement('div');
        panel.id = 'webgl-test-results';
        panel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid var(--cosmic-purple);
            border-radius: 10px;
            padding: 20px;
            color: var(--cosmic-light);
            z-index: 10000;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        const passed = this.testResults.filter(r => r.passed).length;
        const total = this.testResults.length;
        
        panel.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h3 style="color: var(--cosmic-purple); margin: 0 0 10px 0;">ðŸ§ª WebGL Test Results</h3>
                <div style="font-size: 18px; font-weight: bold; color: ${passed === total ? 'var(--cosmic-green)' : 'var(--cosmic-red)'};">
                    ${passed}/${total} tests passed
                </div>
            </div>
            <div style="margin-bottom: 20px;">
                ${this.testResults.map(result => `
                    <div style="margin-bottom: 10px; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 5px;">
                        <div style="display: flex; align-items: center; margin-bottom: 5px;">
                            <span style="margin-right: 10px; font-size: 18px;">${result.passed ? '…' : 'âŒ'}</span>
                            <strong>${result.name}</strong>
                        </div>
                        <div style="font-size: 12px; color: #ccc; margin-left: 28px;">${result.details}</div>
                    </div>
                `).join('')}
            </div>
            <div style="text-align: center;">
                <button onclick="document.getElementById('webgl-test-results').remove()" 
                        class="sacred-button" style="margin-right: 10px;">
                    Close
                </button>
                <button onclick="window.webglTestSuite.runAllTests()" 
                        class="sacred-button" style="background: var(--cosmic-green);">
                    Run Again
                </button>
            </div>
        `;
        
        document.body.appendChild(panel);
    }
    
    // Quick test for development
    quickTest() {
        console.log('ðŸ§ª Running quick WebGL test...');
        
        if (typeof WebGLMapRenderer === 'undefined') {
            console.error('âŒ WebGLMapRenderer not available');
            return false;
        }
        
        try {
            const renderer = new WebGLMapRenderer();
            const testObject = {
                x: 0, y: 0, minZoom: 10, maxZoom: 20, size: 20, type: 1
            };
            
            const added = renderer.addObject(testObject);
            const count = renderer.getObjectCount();
            
            console.log('… Quick test passed:', { added, count });
            
            renderer.destroy();
            return true;
        } catch (error) {
            console.error('âŒ Quick test failed:', error);
            return false;
        }
    }
}

// Create global test suite instance
window.webglTestSuite = new WebGLTestSuite();

// Add test button to debug panel
document.addEventListener('DOMContentLoaded', () => {
    // Wait for debug panel to be available
    setTimeout(() => {
        const debugPanel = document.getElementById('debug-panel');
        if (debugPanel) {
            const testButton = document.createElement('button');
            testButton.className = 'sacred-button';
            testButton.innerHTML = 'ðŸ§ª Test WebGL';
            testButton.style.cssText = 'margin: 5px; font-size: 12px; padding: 5px 10px;';
            testButton.addEventListener('click', () => {
                window.webglTestSuite.runAllTests();
            });
            
            debugPanel.appendChild(testButton);
        }
    }, 2000);
});

// Export for use in other modules
window.WebGLTestSuite = WebGLTestSuite;


