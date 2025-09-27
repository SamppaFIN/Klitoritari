/**
 * Debug Logger - Writes debug information to a file that can be accessed by AI
 * This helps with debugging when we can't directly access the browser console
 */

class DebugLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Keep last 1000 logs
        this.isEnabled = true;
        
        // Override console.log to capture logs
        this.originalConsoleLog = console.log;
        this.setupConsoleCapture();
        
        console.log('🔍 Debug Logger initialized');
    }
    
    setupConsoleCapture() {
        const self = this;
        console.log = function(...args) {
            // Call original console.log
            self.originalConsoleLog.apply(console, args);
            
            // Capture logs that start with specific prefixes
            const message = args.join(' ');
            if (message.includes('🏗️') || message.includes('🎮') || message.includes('📍') || 
                message.includes('🌌') || message.includes('🎭') || message.includes('👤')) {
                self.addLog(message);
            }
        };
    }
    
    addLog(message) {
        if (!this.isEnabled) return;
        
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
        
        // Write to file periodically
        this.writeToFile();
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
        // Only write every 10 logs to avoid too many file writes
        if (this.logs.length % 10 === 0) {
            this.saveLogsToFile();
        }
    }
    
    saveLogsToFile() {
        try {
            const logData = {
                timestamp: new Date().toISOString(),
                totalLogs: this.logs.length,
                logs: this.logs.slice(-50) // Last 50 logs
            };
            
            // Create a downloadable file
            const dataStr = JSON.stringify(logData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            
            // Store in localStorage as backup
            localStorage.setItem('debug_logs', dataStr);
            
            // Also try to send to server for AI access
            this.sendLogsToServer(logData);
            
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
window.exportDebugLogs = () => window.debugLogger.exportLogs();
window.clearDebugLogs = () => window.debugLogger.clearLogs();

console.log('🔍 Debug Logger ready! Use getDebugLogs(), getBaseLogs(), etc. to access logs');
