/**
 * Debug Log Reader - Reads debug logs from the running server
 * This allows the AI to access browser console logs
 */

const fs = require('fs');
const path = require('path');

class DebugLogReader {
    constructor() {
        this.logFile = path.join(__dirname, 'debug-logs.json');
    }
    
    async readLogs() {
        try {
            // Check if log file exists
            if (fs.existsSync(this.logFile)) {
                const data = fs.readFileSync(this.logFile, 'utf8');
                return JSON.parse(data);
            } else {
                return { message: 'No debug logs file found' };
            }
        } catch (error) {
            return { error: error.message };
        }
    }
    
    async getBaseLogs() {
        const logs = await this.readLogs();
        if (logs.logs) {
            return logs.logs.filter(log => log.type === 'base');
        }
        return [];
    }
    
    async getRecentLogs(count = 20) {
        const logs = await this.readLogs();
        if (logs.logs) {
            return logs.logs.slice(-count);
        }
        return [];
    }
    
    async getLogsByType(type) {
        const logs = await this.readLogs();
        if (logs.logs) {
            return logs.logs.filter(log => log.type === type);
        }
        return [];
    }
}

// If run directly, show recent logs
if (require.main === module) {
    const reader = new DebugLogReader();
    reader.getRecentLogs(10).then(logs => {
        console.log('Recent Debug Logs:');
        logs.forEach(log => {
            console.log(`[${log.timestamp}] ${log.message}`);
        });
    });
}

module.exports = DebugLogReader;
