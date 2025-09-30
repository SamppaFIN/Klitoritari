/**
 * Debug Logger - Writes debug information to a file that can be accessed by AI
 * This helps with debugging when we can't directly access the browser console
 */

class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Keep last 1000 logs
        this.isEnabled = false; // Start disabled to avoid performance issues
        this.isCapturing = false; // Only capture when explicitly requested
        
        // Store original console.log
        this.originalConsoleLog = console.log;
        
        console.log('🔍 Debug Logger initialized (minimal mode)');
    }
    
    /**
     * Start capturing logs (only when export is requested)
     */
    startCapturing() {
        if (this.isCapturing) return;
        
        this.isCapturing = true;
        this.isEnabled = true;
        this.setupConsoleCapture();
        console.log('🔍 Debug Logger: Started capturing logs');
    }
    
    /**
     * Stop capturing logs
     */
    stopCapturing() {
        this.isCapturing = false;
        this.isEnabled = false;
        this.restoreConsole();
        console.log('🔍 Debug Logger: Stopped capturing logs');
    }
    
    setupConsoleCapture() {
        const self = this;
        console.log = function(...args) {
            // Call original console.log
            self.originalConsoleLog.apply(console, args);
            
            // Only capture logs if we're actively capturing
            if (self.isCapturing && self.isEnabled) {
                const message = args.join(' ');
                if (message.includes('🏗️') || message.includes('🎮') || message.includes('📍') || 
                    message.includes('🌌') || message.includes('🎭') || message.includes('👤') ||
                    message.includes('🚶‍♂️') || message.includes('🎯') || message.includes('🧪')) {
                    self.addLog(message);
                }
            }
        };
    }
    
    restoreConsole() {
        if (console.log !== this.originalConsoleLog) {
            console.log = this.originalConsoleLog;
        }
    }
    
    addLog(message) {
        if (!this.isEnabled || !this.isCapturing) return;
        
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            message,
            type: this.getLogType(message)
        };
        
        this.logs.push(logEntry);
        
        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        
        // Only write to file every 50 logs to reduce performance impact
        if (this.logs.length % 50 === 0) {
            this.writeToFile();
        }
    }
    
    getLogType(message) {
        if (message.includes('🏗️')) return 'base';
        if (message.includes('🎮')) return 'map';
        if (message.includes('📍')) return 'location';
        if (message.includes('🌌')) return 'system';
        if (message.includes('🎭')) return 'quest';
        if (message.includes('👤')) return 'player';
        return 'general';
    }
    
    writeToFile() {
        // Only write every 50 logs to avoid too many file writes
        if (this.logs.length % 50 === 0) {
            this.saveLogsToFile();
        }
    }
    
    saveLogsToFile() {
        try {
            const logData = {
                timestamp: new Date().toISOString(),
                totalLogs: this.logs.length,
                logs: this.logs.slice(-100) // Last 100 logs
            };
            
            // Create a downloadable file
            const dataStr = JSON.stringify(logData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            // Store in localStorage as backup
            localStorage.setItem('debug_logs', dataStr);
            
            // Only send logs to server in development
            if (window.location.hostname === 'localhost') {
                this.sendLogsToServer(logData);
            }
            
            console.log('🔍 Debug logs saved to localStorage');
        } catch (error) {
            console.error('🔍 Error saving debug logs:', error);
        }
    }
    
    async sendLogsToServer(logData) {
        try {
            // Send logs to server endpoint
            const response = await fetch('/api/debug-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(logData)
            });
            
            if (response.ok) {
                console.log('🔍 Debug logs sent to server');
            }
        } catch (error) {
            // Silently fail - server might not have the endpoint yet
            console.log('🔍 Could not send logs to server (this is normal)');
        }
    }
    
    /**
     * Perform full system check and export logs
     */
    async performSystemCheck() {
        console.log('🔍 Starting full system check...');
        
        // Start capturing logs
        this.startCapturing();
        
        // Wait a moment to capture some logs
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Perform system check
        const systemCheck = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + ' MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + ' MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
            } : 'Not available',
            timing: {
                loadTime: Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart) + ' ms',
                domReady: Math.round(performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart) + ' ms'
            },
            gameState: {
                stepCount: window.stepCurrencySystem?.totalSteps || 0,
                health: window.headerIntegration?.getHealth() || 0,
                sanity: window.headerIntegration?.getSanity() || 0,
                playerName: window.headerIntegration?.getPlayerName() || 'Unknown'
            },
            enhancedTracking: window.enhancedTracking ? {
                isActive: window.enhancedTracking.isActive,
                method: window.enhancedTracking.currentMethod,
                stepCount: window.enhancedTracking.stepCount
            } : 'Not available'
        };
        
        // Add system check to logs
        this.addLog(`🔍 System Check: ${JSON.stringify(systemCheck, null, 2)}`);
        
        // Export logs
        this.exportLogs();
        
        // Stop capturing after export
        this.stopCapturing();
        
        console.log('🔍 System check completed and logs exported');
        return systemCheck;
    }
    
    getLogs() {
        return this.logs;
    }
    
    getLogsByType(type) {
        return this.logs.filter(log => log.type === type);
    }
    
    getRecentLogs(count = 20) {
        return this.logs.slice(-count);
    }
    
    clearLogs() {
        this.logs = [];
        localStorage.removeItem('debug_logs');
    }
    
    exportLogs() {
        this.saveLogsToFile();
        return localStorage.getItem('debug_logs');
    }
}

// Initialize debug logger
window.debugLogger = new DebugLogger();

// Add some helper functions to window for easy access
window.getDebugLogs = () => window.debugLogger.getLogs();
window.getBaseLogs = () => window.debugLogger.getLogsByType('base');
window.getMapLogs = () => window.debugLogger.getLogsByType('map');
window.getPlayerLogs = () => window.debugLogger.getLogsByType('player');
window.exportDebugLogs = () => window.debugLogger.performSystemCheck();
window.clearDebugLogs = () => window.debugLogger.clearLogs();

console.log('🔍 Debug Logger ready! Use exportDebugLogs() to perform system check and export logs');
