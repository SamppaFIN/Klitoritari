/**
 * Mobile Logger System
 * Provides accessible logging for mobile devices where console is not easily accessible
 */

class MobileLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 50; // Reduced to prevent clutter
        this.isVisible = false;
        this.logContainer = null;
        this.filterLevel = 'all'; // all, info, warn, error
        this.init();
    }

    init() {
        console.log('📱 Mobile Logger initialized');
        this.createLogPanel();
        this.setupEventListeners();
        this.overrideConsole();
    }

    createLogPanel() {
        // Create floating log button
        const logButton = document.createElement('div');
        logButton.id = 'mobile-log-button';
        logButton.innerHTML = '📱';
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
            z-index: 1000;
            user-select: none;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
        `;
        document.body.appendChild(logButton);

        // Create log panel
        this.logContainer = document.createElement('div');
        this.logContainer.id = 'mobile-log-panel';
        this.logContainer.style.cssText = `
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
            z-index: 1001;
            display: none;
            box-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
        `;
        document.body.appendChild(this.logContainer);

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
        filterButton.onclick = () => this.toggleFilter();
        this.logContainer.appendChild(filterButton);

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
        this.logContainer.appendChild(clearButton);

        // Add export button
        const exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.style.cssText = `
            position: absolute;
            top: 5px;
            right: 60px;
            background: #4444ff;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 10px;
        `;
        exportButton.onclick = () => this.exportLogs();
        this.logContainer.appendChild(exportButton);
    }

    setupEventListeners() {
        const logButton = document.getElementById('mobile-log-button');
        if (logButton) {
            logButton.addEventListener('click', () => this.toggleLogPanel());
        }
    }

    toggleLogPanel() {
        this.isVisible = !this.isVisible;
        this.logContainer.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible) {
            this.scrollToBottom();
        }
    }

    addLog(level, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            level,
            message,
            data: data ? JSON.stringify(data, null, 2) : null
        };

        this.logs.push(logEntry);

        // Keep only the last maxLogs entries
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Update display if visible
        if (this.isVisible) {
            this.updateDisplay();
        }

        // Also log to console
        console[level](`[${timestamp}] ${message}`, data || '');
    }

    updateDisplay() {
        if (!this.logContainer) return;

        const logContent = document.createElement('div');
        logContent.innerHTML = this.logs.map(log => {
            const levelColor = this.getLevelColor(log.level);
            return `
                <div style="margin-bottom: 5px; border-left: 3px solid ${levelColor}; padding-left: 5px;">
                    <div style="color: ${levelColor}; font-weight: bold;">
                        [${log.timestamp}] ${log.level.toUpperCase()}
                    </div>
                    <div style="color: #ccc;">${log.message}</div>
                    ${log.data ? `<div style="color: #888; font-size: 10px; margin-top: 2px;">${log.data}</div>` : ''}
                </div>
            `;
        }).join('');

        // Clear existing content (except buttons)
        const buttons = this.logContainer.querySelectorAll('button');
        this.logContainer.innerHTML = '';
        buttons.forEach(btn => this.logContainer.appendChild(btn));
        this.logContainer.appendChild(logContent);

        this.scrollToBottom();
    }

    getLevelColor(level) {
        switch (level) {
            case 'error': return '#ff4444';
            case 'warn': return '#ffaa44';
            case 'info': return '#44aaff';
            case 'log': return '#44ff44';
            default: return '#ffffff';
        }
    }

    scrollToBottom() {
        if (this.logContainer) {
            this.logContainer.scrollTop = this.logContainer.scrollHeight;
        }
    }

    clearLogs() {
        this.logs = [];
        this.updateDisplay();
    }

    exportLogs() {
        const logText = this.logs.map(log => 
            `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.data ? '\n' + log.data : ''}`
        ).join('\n');

        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eldritch-logs-${new Date().toISOString().slice(0, 19)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    overrideConsole() {
        // Override console methods to capture logs
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        console.log = (...args) => {
            originalLog.apply(console, args);
            this.addLog('log', args.join(' '));
        };

        console.error = (...args) => {
            originalError.apply(console, args);
            this.addLog('error', args.join(' '));
        };

        console.warn = (...args) => {
            originalWarn.apply(console, args);
            this.addLog('warn', args.join(' '));
        };

        console.info = (...args) => {
            originalInfo.apply(console, args);
            this.addLog('info', args.join(' '));
        };
    }

    // Public methods for manual logging
    log(message, data = null) {
        this.addLog('log', message, data);
    }

    error(message, data = null) {
        this.addLog('error', message, data);
    }

    warn(message, data = null) {
        this.addLog('warn', message, data);
    }

    info(message, data = null) {
        this.addLog('info', message, data);
    }
}

// Mobile logger is now integrated into UI Controls Layer
// This file is kept for reference but not initialized

console.log('📱 Mobile Logger system loaded');
