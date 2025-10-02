/**
 * 🌸 QA DASHBOARD CLIENT
 * 
 * Client-side QA dashboard for monitoring server logs and performance.
 * Provides real-time access to server monitoring data for QA testing.
 * 
 * Sacred Purpose: Enables comprehensive QA monitoring of server logs,
 * performance metrics, and connection status for consciousness-aware testing.
 * 
 * @author Aurora AI Persona
 * @version 1.0.0
 * @since 2025-01-27
 */

class QADashboard {
    constructor() {
        this.isVisible = false;
        this.refreshInterval = null;
        this.serverData = {
            status: null,
            performance: null,
            logs: [],
            errors: [],
            connections: []
        };
        
        this.setupDashboard();
        console.log('🌸 QA Dashboard initialized');
    }
    
    /**
     * Setup QA dashboard UI
     */
    setupDashboard() {
        // Create dashboard container
        this.dashboardContainer = document.createElement('div');
        this.dashboardContainer.id = 'qa-dashboard';
        this.dashboardContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 99999;
            display: none;
            overflow-y: auto;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        // Create dashboard content
        this.dashboardContainer.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid #333; padding-bottom: 10px;">
                <h2 style="margin: 0; color: #8a2be2;">🌸 QA Dashboard - Server Monitoring</h2>
                <div>
                    <button id="qa-refresh" style="margin-right: 10px; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Refresh</button>
                    <button id="qa-close" style="padding: 5px 10px; background: #f44336; color: white; border: none; border-radius: 3px; cursor: pointer;">Close</button>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Server Status -->
                <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px solid #333;">
                    <h3 style="margin: 0 0 10px 0; color: #8a2be2;">Server Status</h3>
                    <div id="qa-server-status">Loading...</div>
                </div>
                
                <!-- Performance Metrics -->
                <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px solid #333;">
                    <h3 style="margin: 0 0 10px 0; color: #8a2be2;">Performance</h3>
                    <div id="qa-performance">Loading...</div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <!-- Server Logs -->
                <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px solid #333;">
                    <h3 style="margin: 0 0 10px 0; color: #8a2be2;">Server Logs</h3>
                    <div style="margin-bottom: 10px;">
                        <select id="qa-log-filter" style="padding: 5px; background: #333; color: white; border: 1px solid #555;">
                            <option value="all">All Logs</option>
                            <option value="log">Info</option>
                            <option value="error">Errors</option>
                            <option value="warn">Warnings</option>
                            <option value="request">Requests</option>
                        </select>
                        <button id="qa-clear-logs" style="margin-left: 10px; padding: 5px 10px; background: #ff9800; color: white; border: none; border-radius: 3px; cursor: pointer;">Clear</button>
                    </div>
                    <div id="qa-server-logs" style="height: 200px; overflow-y: auto; background: #000; padding: 10px; border-radius: 3px; font-size: 11px;"></div>
                </div>
                
                <!-- Server Errors -->
                <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px solid #333;">
                    <h3 style="margin: 0 0 10px 0; color: #ff6b6b;">Server Errors</h3>
                    <div id="qa-server-errors" style="height: 200px; overflow-y: auto; background: #000; padding: 10px; border-radius: 3px; font-size: 11px;"></div>
                </div>
            </div>
            
            <!-- Active Connections -->
            <div style="background: #1a1a1a; padding: 15px; border-radius: 5px; border: 1px solid #333;">
                <h3 style="margin: 0 0 10px 0; color: #8a2be2;">Active Connections</h3>
                <div id="qa-connections" style="height: 150px; overflow-y: auto; background: #000; padding: 10px; border-radius: 3px; font-size: 11px;"></div>
            </div>
        `;
        
        document.body.appendChild(this.dashboardContainer);
        
        // Setup event listeners
        this.setupEventListeners();
    }
    
    /**
     * Setup dashboard event listeners
     */
    setupEventListeners() {
        // Close button
        document.getElementById('qa-close').addEventListener('click', () => {
            this.hide();
        });
        
        // Refresh button
        document.getElementById('qa-refresh').addEventListener('click', () => {
            this.refreshAllData();
        });
        
        // Log filter
        document.getElementById('qa-log-filter').addEventListener('change', (e) => {
            this.updateLogDisplay(e.target.value);
        });
        
        // Clear logs button
        document.getElementById('qa-clear-logs').addEventListener('click', () => {
            this.clearServerLogs();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'Q') {
                e.preventDefault();
                this.toggle();
            }
        });
    }
    
    /**
     * Show QA dashboard
     */
    show() {
        this.isVisible = true;
        this.dashboardContainer.style.display = 'block';
        this.refreshAllData();
        this.startAutoRefresh();
        console.log('🌸 QA Dashboard opened');
    }
    
    /**
     * Hide QA dashboard
     */
    hide() {
        this.isVisible = false;
        this.dashboardContainer.style.display = 'none';
        this.stopAutoRefresh();
        console.log('🌸 QA Dashboard closed');
    }
    
    /**
     * Toggle QA dashboard visibility
     */
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    /**
     * Start auto-refresh
     */
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.refreshAllData();
        }, 5000); // Refresh every 5 seconds
    }
    
    /**
     * Stop auto-refresh
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }
    
    /**
     * Refresh all dashboard data
     */
    async refreshAllData() {
        try {
            await Promise.all([
                this.fetchServerStatus(),
                this.fetchPerformance(),
                this.fetchServerLogs(),
                this.fetchServerErrors(),
                this.fetchConnections()
            ]);
        } catch (error) {
            console.error('🌸 Error refreshing QA dashboard:', error);
        }
    }
    
    /**
     * Fetch server status
     */
    async fetchServerStatus() {
        try {
            const response = await fetch('/api/qa/status');
            const data = await response.json();
            this.serverData.status = data;
            this.updateServerStatusDisplay(data);
        } catch (error) {
            console.error('🌸 Error fetching server status:', error);
            document.getElementById('qa-server-status').innerHTML = '<span style="color: #ff6b6b;">Error fetching status</span>';
        }
    }
    
    /**
     * Fetch performance metrics
     */
    async fetchPerformance() {
        try {
            const response = await fetch('/api/qa/performance');
            const data = await response.json();
            this.serverData.performance = data.performance;
            this.updatePerformanceDisplay(data.performance);
        } catch (error) {
            console.error('🌸 Error fetching performance:', error);
            document.getElementById('qa-performance').innerHTML = '<span style="color: #ff6b6b;">Error fetching performance</span>';
        }
    }
    
    /**
     * Fetch server logs
     */
    async fetchServerLogs() {
        try {
            const response = await fetch('/api/qa/server-logs?limit=100');
            const data = await response.json();
            this.serverData.logs = data.logs;
            this.updateLogDisplay();
        } catch (error) {
            console.error('🌸 Error fetching server logs:', error);
        }
    }
    
    /**
     * Fetch server errors
     */
    async fetchServerErrors() {
        try {
            const response = await fetch('/api/qa/errors?limit=50');
            const data = await response.json();
            this.serverData.errors = data.errors;
            this.updateErrorsDisplay(data.errors);
        } catch (error) {
            console.error('🌸 Error fetching server errors:', error);
        }
    }
    
    /**
     * Fetch active connections
     */
    async fetchConnections() {
        try {
            const response = await fetch('/api/qa/report');
            const data = await response.json();
            this.serverData.connections = data.connections.activeConnections;
            this.updateConnectionsDisplay(data.connections);
        } catch (error) {
            console.error('🌸 Error fetching connections:', error);
        }
    }
    
    /**
     * Update server status display
     */
    updateServerStatusDisplay(status) {
        const html = `
            <div style="margin-bottom: 5px;"><strong>Status:</strong> <span style="color: #4CAF50;">${status.server.status}</span></div>
            <div style="margin-bottom: 5px;"><strong>Uptime:</strong> ${this.formatUptime(status.server.uptime)}</div>
            <div style="margin-bottom: 5px;"><strong>Port:</strong> ${status.server.port}</div>
            <div style="margin-bottom: 5px;"><strong>PID:</strong> ${status.server.pid}</div>
            <div style="margin-bottom: 5px;"><strong>Platform:</strong> ${status.server.platform}</div>
            <div style="margin-bottom: 5px;"><strong>Node:</strong> ${status.server.nodeVersion}</div>
            <div style="margin-bottom: 5px;"><strong>WebSocket:</strong> ${status.connections.websocket} connections</div>
            <div style="margin-bottom: 5px;"><strong>Players:</strong> ${status.connections.players}</div>
            <div style="margin-bottom: 5px;"><strong>Investigations:</strong> ${status.connections.investigations}</div>
        `;
        document.getElementById('qa-server-status').innerHTML = html;
    }
    
    /**
     * Update performance display
     */
    updatePerformanceDisplay(performance) {
        const html = `
            <div style="margin-bottom: 5px;"><strong>Requests:</strong> ${performance.requestCount}</div>
            <div style="margin-bottom: 5px;"><strong>Memory:</strong> ${this.formatBytes(performance.memoryUsage.heapUsed)} / ${this.formatBytes(performance.memoryUsage.heapTotal)}</div>
            <div style="margin-bottom: 5px;"><strong>RSS:</strong> ${this.formatBytes(performance.memoryUsage.rss)}</div>
            <div style="margin-bottom: 5px;"><strong>External:</strong> ${this.formatBytes(performance.memoryUsage.external)}</div>
            <div style="margin-bottom: 5px;"><strong>CPU User:</strong> ${performance.cpuUsage ? (performance.cpuUsage.user / 1000000).toFixed(2) : 'N/A'}s</div>
            <div style="margin-bottom: 5px;"><strong>CPU System:</strong> ${performance.cpuUsage ? (performance.cpuUsage.system / 1000000).toFixed(2) : 'N/A'}s</div>
        `;
        document.getElementById('qa-performance').innerHTML = html;
    }
    
    /**
     * Update log display
     */
    updateLogDisplay(filter = 'all') {
        const logs = filter === 'all' ? this.serverData.logs : this.serverData.logs.filter(log => log.type === filter);
        
        const html = logs.slice(-50).reverse().map(log => {
            const color = this.getLogColor(log.type);
            const time = new Date(log.timestamp).toLocaleTimeString();
            return `<div style="color: ${color}; margin-bottom: 2px;">[${time}] ${log.type.toUpperCase()}: ${log.message}</div>`;
        }).join('');
        
        document.getElementById('qa-server-logs').innerHTML = html || '<div style="color: #666;">No logs available</div>';
    }
    
    /**
     * Update errors display
     */
    updateErrorsDisplay(errors) {
        const html = errors.slice(-20).reverse().map(error => {
            const time = new Date(error.timestamp).toLocaleTimeString();
            return `<div style="color: #ff6b6b; margin-bottom: 5px;">
                <div>[${time}] ${error.message}</div>
                <div style="color: #999; font-size: 10px; margin-left: 10px;">${error.stack ? error.stack.split('\n')[1] : ''}</div>
            </div>`;
        }).join('');
        
        document.getElementById('qa-server-errors').innerHTML = html || '<div style="color: #666;">No errors</div>';
    }
    
    /**
     * Update connections display
     */
    updateConnectionsDisplay(connections) {
        const html = `
            <div style="margin-bottom: 5px;"><strong>WebSocket:</strong> ${connections.websocket}</div>
            <div style="margin-bottom: 5px;"><strong>Players:</strong> ${connections.players}</div>
            <div style="margin-bottom: 5px;"><strong>Investigations:</strong> ${connections.investigations}</div>
            <div style="margin-top: 10px;">
                <strong>Active Connections:</strong>
                ${connections.activeConnections.map(conn => `
                    <div style="margin-left: 10px; margin-top: 5px; padding: 5px; background: #333; border-radius: 3px;">
                        <div><strong>ID:</strong> ${conn.id}</div>
                        <div><strong>Player:</strong> ${conn.playerId || 'N/A'}</div>
                        <div><strong>IP:</strong> ${conn.ip}</div>
                        <div><strong>Connected:</strong> ${new Date(conn.connectedAt).toLocaleTimeString()}</div>
                        <div><strong>Last Activity:</strong> ${new Date(conn.lastActivity).toLocaleTimeString()}</div>
                    </div>
                `).join('')}
            </div>
        `;
        document.getElementById('qa-connections').innerHTML = html;
    }
    
    /**
     * Clear server logs
     */
    async clearServerLogs() {
        try {
            const response = await fetch('/api/qa/clear-logs', { method: 'POST' });
            const data = await response.json();
            console.log('🌸 Server logs cleared:', data.message);
            this.refreshAllData();
        } catch (error) {
            console.error('🌸 Error clearing server logs:', error);
        }
    }
    
    /**
     * Get log color based on type
     */
    getLogColor(type) {
        switch (type) {
            case 'error': return '#ff6b6b';
            case 'warn': return '#ffa726';
            case 'request': return '#42a5f5';
            case 'log': return '#66bb6a';
            default: return '#ffffff';
        }
    }
    
    /**
     * Format uptime
     */
    formatUptime(ms) {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        
        if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
        if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
        if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
        return `${seconds}s`;
    }
    
    /**
     * Format bytes
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    /**
     * Get comprehensive QA report
     */
    async getQAReport() {
        try {
            const response = await fetch('/api/qa/report');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('🌸 Error fetching QA report:', error);
            return null;
        }
    }
    
    /**
     * Export QA data
     */
    exportQAData() {
        const qaData = {
            timestamp: new Date().toISOString(),
            serverData: this.serverData,
            clientInfo: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language,
                screenSize: `${screen.width}x${screen.height}`,
                windowSize: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        const blob = new Blob([JSON.stringify(qaData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `qa-dashboard-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('🌸 QA data exported');
    }
}

// Initialize global QA dashboard
window.QADashboard = QADashboard;
window.qaDashboard = new QADashboard();

// Add global QA functions
window.openQADashboard = () => {
    window.qaDashboard.show();
};

window.closeQADashboard = () => {
    window.qaDashboard.hide();
};

window.toggleQADashboard = () => {
    window.qaDashboard.toggle();
};

window.getQAReport = () => {
    return window.qaDashboard.getQAReport();
};

window.exportQAData = () => {
    return window.qaDashboard.exportQAData();
};

console.log('🌸 QA Dashboard ready - Press Ctrl+Shift+Q to open');
console.log('🌸 QA Dashboard functions: openQADashboard(), closeQADashboard(), toggleQADashboard(), getQAReport(), exportQAData()');
