/**
 * 🌸 CONSCIOUSNESS-AWARE REFRESH MECHANISMS TEST
 * 
 * Test suite to verify that all refresh mechanisms are working properly:
 * - Player position map refresh (PRIORITY 1)
 * - Step counter refresh mechanism
 * - Other players bases refresh (every 10 seconds)
 * - Step sync with server (every 30 seconds)
 * 
 * Sacred Impact: Ensures spatial wisdom and community healing
 * progress is properly tracked and synchronized.
 */

class RefreshMechanismsTest {
    constructor() {
        this.testResults = {
            playerPositionRefresh: false,
            stepCounterRefresh: false,
            baseRefresh: false,
            stepSync: false
        };
        
        this.testStartTime = Date.now();
        this.refreshCounts = {
            playerPosition: 0,
            stepCounter: 0,
            baseRefresh: 0,
            stepSync: 0
        };
        
        console.log('🌸 RefreshMechanismsTest: Starting refresh mechanisms test...');
    }
    
    /**
     * Start comprehensive refresh mechanisms test
     */
    startTest() {
        console.log('🌸 RefreshMechanismsTest: Starting comprehensive test...');
        
        // Test 1: Player Position Refresh
        this.testPlayerPositionRefresh();
        
        // Test 2: Step Counter Refresh
        this.testStepCounterRefresh();
        
        // Test 3: Base Refresh Mechanism
        this.testBaseRefreshMechanism();
        
        // Test 4: Step Sync Mechanism
        this.testStepSyncMechanism();
        
        // Monitor refresh counts for 15 seconds
        this.monitorRefreshCounts();
        
        // Show results after 15 seconds
        setTimeout(() => {
            this.showTestResults();
        }, 15000);
    }
    
    /**
     * Test player position refresh mechanism
     */
    testPlayerPositionRefresh() {
        console.log('🌸 Testing player position refresh mechanism...');
        
        // Check if LayerManager has refreshPlayerPositionOnMap method
        if (window.layerManager && typeof window.layerManager.refreshPlayerPositionOnMap === 'function') {
            console.log('✅ LayerManager.refreshPlayerPositionOnMap method exists');
            this.testResults.playerPositionRefresh = true;
        } else {
            console.log('❌ LayerManager.refreshPlayerPositionOnMap method not found');
        }
        
        // Check if LayeredRenderingSystem has refreshPlayerPositionOnMap method
        if (window.layeredRenderingSystem && typeof window.layeredRenderingSystem.refreshPlayerPositionOnMap === 'function') {
            console.log('✅ LayeredRenderingSystem.refreshPlayerPositionOnMap method exists');
        } else {
            console.log('❌ LayeredRenderingSystem.refreshPlayerPositionOnMap method not found');
        }
        
        // Test manual refresh
        this.testManualPlayerPositionRefresh();
    }
    
    /**
     * Test manual player position refresh
     */
    testManualPlayerPositionRefresh() {
        try {
            if (window.layerManager && typeof window.layerManager.refreshPlayerPositionOnMap === 'function') {
                window.layerManager.refreshPlayerPositionOnMap();
                console.log('✅ Manual player position refresh successful');
                this.refreshCounts.playerPosition++;
            }
        } catch (error) {
            console.error('❌ Manual player position refresh failed:', error);
        }
    }
    
    /**
     * Test step counter refresh mechanism
     */
    testStepCounterRefresh() {
        console.log('🌸 Testing step counter refresh mechanism...');
        
        // Check if step currency system exists
        if (window.stepCurrencySystem) {
            console.log('✅ StepCurrencySystem exists');
            
            // Check if updateStepCounter method exists
            if (typeof window.stepCurrencySystem.updateStepCounter === 'function') {
                console.log('✅ StepCurrencySystem.updateStepCounter method exists');
                this.testResults.stepCounterRefresh = true;
            } else {
                console.log('❌ StepCurrencySystem.updateStepCounter method not found');
            }
            
            // Check if triggerStepCounterUpdate function exists
            if (typeof window.triggerStepCounterUpdate === 'function') {
                console.log('✅ triggerStepCounterUpdate function exists');
            } else {
                console.log('❌ triggerStepCounterUpdate function not found');
            }
            
            // Test manual refresh
            this.testManualStepCounterRefresh();
        } else {
            console.log('❌ StepCurrencySystem not found');
        }
    }
    
    /**
     * Test manual step counter refresh
     */
    testManualStepCounterRefresh() {
        try {
            if (window.stepCurrencySystem && typeof window.stepCurrencySystem.updateStepCounter === 'function') {
                window.stepCurrencySystem.updateStepCounter();
                console.log('✅ Manual step counter refresh successful');
                this.refreshCounts.stepCounter++;
            }
            
            if (typeof window.triggerStepCounterUpdate === 'function') {
                window.triggerStepCounterUpdate();
                console.log('✅ Manual triggerStepCounterUpdate successful');
            }
        } catch (error) {
            console.error('❌ Manual step counter refresh failed:', error);
        }
    }
    
    /**
     * Test base refresh mechanism
     */
    testBaseRefreshMechanism() {
        console.log('🌸 Testing base refresh mechanism...');
        
        // Check if showOtherBases function exists
        if (typeof window.showOtherBases === 'function') {
            console.log('✅ showOtherBases function exists');
            this.testResults.baseRefresh = true;
        } else {
            console.log('❌ showOtherBases function not found');
        }
        
        // Check if websocket client has requestMarkerData method
        if (window.websocketClient && typeof window.websocketClient.requestMarkerData === 'function') {
            console.log('✅ WebSocketClient.requestMarkerData method exists');
        } else {
            console.log('❌ WebSocketClient.requestMarkerData method not found');
        }
        
        // Test manual refresh
        this.testManualBaseRefresh();
    }
    
    /**
     * Test manual base refresh
     */
    testManualBaseRefresh() {
        try {
            if (typeof window.showOtherBases === 'function') {
                window.showOtherBases();
                console.log('✅ Manual base refresh successful');
                this.refreshCounts.baseRefresh++;
            }
            
            if (window.websocketClient && typeof window.websocketClient.requestMarkerData === 'function') {
                window.websocketClient.requestMarkerData();
                console.log('✅ Manual marker data request successful');
            }
        } catch (error) {
            console.error('❌ Manual base refresh failed:', error);
        }
    }
    
    /**
     * Test step sync mechanism
     */
    testStepSyncMechanism() {
        console.log('🌸 Testing step sync mechanism...');
        
        // Check if websocket client has sendStepSync method
        if (window.websocketClient && typeof window.websocketClient.sendStepSync === 'function') {
            console.log('✅ WebSocketClient.sendStepSync method exists');
            this.testResults.stepSync = true;
        } else {
            console.log('❌ WebSocketClient.sendStepSync method not found');
        }
        
        // Test manual sync
        this.testManualStepSync();
    }
    
    /**
     * Test manual step sync
     */
    testManualStepSync() {
        try {
            if (window.stepCurrencySystem && window.websocketClient && typeof window.websocketClient.sendStepSync === 'function') {
                const totalSteps = window.stepCurrencySystem.totalSteps || 0;
                const sessionSteps = window.stepCurrencySystem.sessionSteps || 0;
                
                window.websocketClient.sendStepSync(totalSteps, sessionSteps);
                console.log(`✅ Manual step sync successful - Total: ${totalSteps}, Session: ${sessionSteps}`);
                this.refreshCounts.stepSync++;
            }
        } catch (error) {
            console.error('❌ Manual step sync failed:', error);
        }
    }
    
    /**
     * Monitor refresh counts during test period
     */
    monitorRefreshCounts() {
        const monitorInterval = setInterval(() => {
            const elapsed = Date.now() - this.testStartTime;
            console.log(`🌸 Refresh counts after ${Math.round(elapsed/1000)}s:`, this.refreshCounts);
        }, 5000);
        
        // Clear interval after 15 seconds
        setTimeout(() => {
            clearInterval(monitorInterval);
        }, 15000);
    }
    
    /**
     * Show comprehensive test results
     */
    showTestResults() {
        console.log('🌸 ===== REFRESH MECHANISMS TEST RESULTS =====');
        console.log('🌸 Test Duration: 15 seconds');
        console.log('🌸 Refresh Counts:', this.refreshCounts);
        console.log('🌸 Test Results:', this.testResults);
        
        // Calculate success rate
        const totalTests = Object.keys(this.testResults).length;
        const passedTests = Object.values(this.testResults).filter(result => result).length;
        const successRate = (passedTests / totalTests) * 100;
        
        console.log(`🌸 Success Rate: ${successRate.toFixed(1)}% (${passedTests}/${totalTests})`);
        
        // Show detailed results
        Object.entries(this.testResults).forEach(([test, result]) => {
            const status = result ? '✅ PASS' : '❌ FAIL';
            console.log(`🌸 ${test}: ${status}`);
        });
        
        // Show refresh frequency analysis
        console.log('🌸 Refresh Frequency Analysis:');
        Object.entries(this.refreshCounts).forEach(([mechanism, count]) => {
            const frequency = count / 15; // per second
            console.log(`🌸 ${mechanism}: ${count} refreshes (${frequency.toFixed(2)}/sec)`);
        });
        
        console.log('🌸 ===== END REFRESH MECHANISMS TEST =====');
        
        // Return results for external use
        return {
            testResults: this.testResults,
            refreshCounts: this.refreshCounts,
            successRate: successRate,
            duration: 15000
        };
    }
    
    /**
     * Create test UI for manual testing
     */
    createTestUI() {
        const testPanel = document.createElement('div');
        testPanel.id = 'refresh-test-panel';
        testPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            border: 2px solid #ff6b6b;
        `;
        
        testPanel.innerHTML = `
            <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">🌸 Refresh Mechanisms Test</h3>
            <div id="refresh-test-status">Ready to test...</div>
            <button onclick="window.refreshTest.startTest()" style="margin: 5px; padding: 5px;">Start Test</button>
            <button onclick="window.refreshTest.testManualPlayerPositionRefresh()" style="margin: 5px; padding: 5px;">Test Position</button>
            <button onclick="window.refreshTest.testManualStepCounterRefresh()" style="margin: 5px; padding: 5px;">Test Steps</button>
            <button onclick="window.refreshTest.testManualBaseRefresh()" style="margin: 5px; padding: 5px;">Test Bases</button>
            <button onclick="window.refreshTest.testManualStepSync()" style="margin: 5px; padding: 5px;">Test Sync</button>
            <button onclick="document.getElementById('refresh-test-panel').remove()" style="margin: 5px; padding: 5px;">Close</button>
        `;
        
        document.body.appendChild(testPanel);
        console.log('🌸 Refresh test UI created');
    }
}

// Initialize test when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.refreshTest = new RefreshMechanismsTest();
        window.refreshTest.createTestUI();
    });
} else {
    window.refreshTest = new RefreshMechanismsTest();
    window.refreshTest.createTestUI();
}

console.log('🌸 RefreshMechanismsTest loaded and ready');
