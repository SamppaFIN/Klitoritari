/**
 * UI Controls Layer
 * Manages all floating buttons, overlays, and UI controls in a single layer
 */

class UIControlsLayer extends RenderLayer {
    constructor() {
        super('uiControls', 35, 'auto'); // High z-index for UI controls
        this.controls = new Map();
        this.isInitialized = false;
        
        console.log('›ï¸ Initializing UI Controls Layer...');
        this.init();
    }

    init() {
        super.init();
        this.setupControlContainer();
        this.createMobileLogger();
        this.createDebugControls();
        this.isInitialized = true;
        console.log('… UI Controls Layer initialized');
    }

    setupControlContainer() {
        // Create a container for all UI controls
        this.controlContainer = document.createElement('div');
        this.controlContainer.id = 'ui-controls-container';
        this.controlContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2000;
        `;
        document.body.appendChild(this.controlContainer);
    }

    createMobileLogger() {
        // Mobile logging button
        const logButton = document.createElement('div');
        logButton.id = 'mobile-log-button';
        logButton.innerHTML = 'ðŸ“±';
        logButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 70px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 2px solid #00ff88;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
            transition: all 0.3s ease;
        `;
        
        // Mobile log panel
        const logPanel = document.createElement('div');
        logPanel.id = 'mobile-log-panel';
        logPanel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            width: 300px;
            height: 400px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #00ff88;
            border-radius: 10px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            overflow-y: auto;
            pointer-events: auto;
            display: none;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        `;

        // Add filter button
        const filterButton = document.createElement('button');
        filterButton.innerHTML = 'All';
        filterButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 100px;
            background: #4444ff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
        `;
        filterButton.onclick = () => this.toggleLogFilter();
        logPanel.appendChild(filterButton);

        // Add clear button
        const clearButton = document.createElement('button');
        clearButton.innerHTML = 'Clear';
        clearButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 5px;
            background: #ff4444;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
        `;
        clearButton.onclick = () => this.clearLogs();
        logPanel.appendChild(clearButton);

        // Add export button
        const exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 50px;
            background: #44ff44;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
        `;
        exportButton.onclick = () => this.exportLogs();
        logPanel.appendChild(exportButton);

        // Log content area
        const logContent = document.createElement('div');
        logContent.id = 'log-content';
        logContent.style.cssText = `
            margin-top: 30px;
            height: calc(100% - 40px);
            overflow-y: auto;
        `;
        logPanel.appendChild(logContent);

        // Toggle functionality
        logButton.onclick = () => this.toggleLogPanel();
        
        this.controlContainer.appendChild(logButton);
        this.controlContainer.appendChild(logPanel);
        
        this.controls.set('mobileLogger', {
            button: logButton,
            panel: logPanel,
            content: logContent,
            isVisible: false,
            filterLevel: 'all'
        });
    }

    createDebugControls() {
        // Debug toggle button
        const debugButton = document.createElement('div');
        debugButton.id = 'debug-toggle-button';
        debugButton.innerHTML = 'ðŸ”§';
        debugButton.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border: 2px solid #ff8800;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            cursor: pointer;
            pointer-events: auto;
            user-select: none;
            box-shadow: 0 0 20px rgba(255, 136, 0, 0.3);
            transition: all 0.3s ease;
        `;

        // Debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'debug-panel';
        debugPanel.style.cssText = `
            position: fixed;
            top: 70px;
            right: 10px;
            width: 250px;
            height: 300px;
            background: rgba(0, 0, 0, 0.95);
            border: 2px solid #ff8800;
            border-radius: 10px;
            color: white;
            font-family: monospace;
            font-size: 12px;
            padding: 10px;
            overflow-y: auto;
            pointer-events: auto;
            display: none;
            box-shadow: 0 0 30px rgba(255, 136, 0, 0.5);
        `;

        debugPanel.innerHTML = `
            <h4 style="margin-top: 0; color: #ff8800;">Debug Controls</h4>
            <button onclick="window.layeredRendering?.toggleLayer('baseBuilding')" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Base Building</button>
            <button onclick="window.layeredRendering?.toggleLayer('sacredGeometry')" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Toggle Sacred Geometry</button>
            <button onclick="window.stepCurrencySystem?.addManualStep()" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Add Step</button>
            <button onclick="this.testBaseBuilding()" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Test Base Building</button>
            <button onclick="this.debugBaseState()" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Debug Base State</button>
            <button onclick="this.clearAllLogs()" style="width: 100%; margin: 5px 0; padding: 8px; background: #444; color: white; border: none; border-radius: 5px; cursor: pointer;">Clear All Logs</button>
        `;

        // Toggle functionality
        debugButton.onclick = () => this.toggleDebugPanel();
        
        this.controlContainer.appendChild(debugButton);
        this.controlContainer.appendChild(debugPanel);
        
        this.controls.set('debugControls', {
            button: debugButton,
            panel: debugPanel,
            isVisible: false
        });
    }

    toggleLogPanel() {
        const logger = this.controls.get('mobileLogger');
        if (logger) {
            logger.isVisible = !logger.isVisible;
            logger.panel.style.display = logger.isVisible ? 'block' : 'none';
            logger.button.style.background = logger.isVisible ? 'rgba(0, 255, 136, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        }
    }

    toggleDebugPanel() {
        const debug = this.controls.get('debugControls');
        if (debug) {
            debug.isVisible = !debug.isVisible;
            debug.panel.style.display = debug.isVisible ? 'block' : 'none';
            debug.button.style.background = debug.isVisible ? 'rgba(255, 136, 0, 0.8)' : 'rgba(0, 0, 0, 0.8)';
        }
    }

    toggleLogFilter() {
        const logger = this.controls.get('mobileLogger');
        if (logger) {
            const filters = ['all', 'info', 'warn', 'error'];
            const currentIndex = filters.indexOf(logger.filterLevel);
            logger.filterLevel = filters[(currentIndex + 1) % filters.length];
            
            const filterButton = logger.panel.querySelector('button');
            if (filterButton) {
                filterButton.innerHTML = logger.filterLevel.charAt(0).toUpperCase() + logger.filterLevel.slice(1);
            }
            
            this.updateLogDisplay();
        }
    }

    clearLogs() {
        const logger = this.controls.get('mobileLogger');
        if (logger && logger.content) {
            logger.content.innerHTML = '';
        }
        console.clear();
    }

    exportLogs() {
        const logger = this.controls.get('mobileLogger');
        if (logger && logger.content) {
            const logs = logger.content.innerText;
            const blob = new Blob([logs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `mobile-logs-${new Date().toISOString().slice(0, 19)}.txt`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    addLog(message, type = 'info') {
        const logger = this.controls.get('mobileLogger');
        if (logger && logger.content) {
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                margin: 2px 0;
                padding: 2px 5px;
                border-radius: 3px;
                font-size: 11px;
            `;
            
            let color = 'white';
            if (type === 'error') color = '#ff4444';
            if (type === 'warn') color = '#ffaa00';
            if (type === 'success') color = '#44ff44';
            
            logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="color: ${color};">[${type.toUpperCase()}]</span> ${message}`;
            
            logger.content.appendChild(logEntry);
            logger.content.scrollTop = logger.content.scrollHeight;
            
            // Keep only last 50 logs
            const logs = logger.content.children;
            if (logs.length > 50) {
                logger.content.removeChild(logs[0]);
            }
        }
    }

    updateLogDisplay() {
        // This would filter logs based on the current filter level
        // For now, just show all logs
    }

    // Public methods for external access
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            border: 2px solid ${type === 'error' ? '#ff4444' : type === 'warn' ? '#ffaa00' : '#00ff88'};
            z-index: 3000;
            pointer-events: auto;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        `;
        notification.textContent = message;
        
        this.controlContainer.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, duration);
    }

    // Debug base state
    debugBaseState() {
        if (window.layeredRendering) {
            const baseLayer = window.layeredRendering.getLayer('baseBuilding');
            if (baseLayer) {
                baseLayer.debugBaseState();
            } else {
                this.showNotification('Base building layer not found!', 'error');
            }
        } else {
            this.showNotification('Layered rendering system not available!', 'error');
        }
    }

    // Test function for base building
    testBaseBuilding() {
        if (window.layeredRendering) {
            const baseLayer = window.layeredRendering.getLayer('baseBuilding');
            if (baseLayer) {
                // Add some steps first
                baseLayer.addStepFromExternal();
                baseLayer.addStepFromExternal();
                baseLayer.addStepFromExternal();
                
                // Create a test base if none exists
                if (baseLayer.bases.length === 0) {
                    const base = {
                        id: 'test_base_' + Date.now(),
                        x: window.innerWidth / 2,
                        y: window.innerHeight / 2,
                        size: 40,
                        level: 1,
                        flags: 0,
                        steps: 0,
                        maxFlags: 8,
                        color: '#8b5cf6',
                        owner: 'player'
                    };
                    baseLayer.bases = [base];
                    baseLayer.saveBaseData();
                    this.showNotification('Test base created! ðŸ—ï¸', 'success');
                } else {
                    this.showNotification('Base already exists! Adding steps...', 'info');
                }
                
                // Update base tab UI if available
                if (window.baseSystem) {
                    window.baseSystem.updateBaseTabUI();
                }
            } else {
                this.showNotification('Base building layer not found!', 'error');
            }
        } else {
            this.showNotification('Layered rendering system not available!', 'error');
        }
    }

    render() {
        // This layer doesn't need canvas rendering since it uses DOM elements
        // But we can add any canvas-based UI elements here if needed
    }
}

// Export for global access
window.UIControlsLayer = UIControlsLayer;


