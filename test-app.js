const puppeteer = require('puppeteer');
const fs = require('fs');

async function testApplication() {
    console.log('🧪 Starting application error testing...');
    
    let browser;
    try {
        // Launch browser
        browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: null,
            args: ['--start-maximized']
        });
        
        const page = await browser.newPage();
        
        // Listen for console messages
        const logs = [];
        page.on('console', msg => {
            const message = msg.text();
            logs.push({
                timestamp: new Date().toISOString(),
                type: msg.type(),
                message: message
            });
            console.log(`[${msg.type()}] ${message}`);
        });
        
        // Listen for page errors
        page.on('pageerror', error => {
            logs.push({
                timestamp: new Date().toISOString(),
                type: 'error',
                message: `Page Error: ${error.message}`
            });
            console.log(`❌ Page Error: ${error.message}`);
        });
        
        // Navigate to the application
        console.log('🌐 Navigating to http://localhost:8000...');
        await page.goto('http://localhost:8000', { 
            waitUntil: 'networkidle0',
            timeout: 30000 
        });
        
        // Wait for the application to load
        console.log('⏳ Waiting for application to load...');
        await page.waitForTimeout(10000);
        
        // Try to get debug logs from the application
        console.log('🔍 Attempting to get debug logs...');
        try {
            const debugLogs = await page.evaluate(() => {
                if (typeof getDebugLogs === 'function') {
                    return getDebugLogs();
                } else {
                    return 'getDebugLogs function not available';
                }
            });
            
            if (debugLogs && debugLogs !== 'getDebugLogs function not available') {
                console.log(`✅ Retrieved ${debugLogs.length} debug log entries`);
                logs.push({
                    timestamp: new Date().toISOString(),
                    type: 'debug',
                    message: `Retrieved ${debugLogs.length} debug log entries`,
                    data: debugLogs
                });
            }
        } catch (error) {
            console.log(`❌ Error getting debug logs: ${error.message}`);
        }
        
        // Check for specific errors
        const errorPatterns = [
            'ReferenceError',
            'TypeError', 
            'SyntaxError',
            'Error:',
            'Failed to',
            'Cannot read properties',
            'is not a function',
            'already initialized',
            'not defined'
        ];
        
        const errors = [];
        logs.forEach(log => {
            errorPatterns.forEach(pattern => {
                if (log.message.includes(pattern)) {
                    errors.push({
                        pattern,
                        message: log.message,
                        timestamp: log.timestamp
                    });
                }
            });
        });
        
        // Save logs to file
        const logData = {
            timestamp: new Date().toISOString(),
            totalLogs: logs.length,
            errors: errors,
            allLogs: logs
        };
        
        const filename = `debug-logs-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(filename, JSON.stringify(logData, null, 2));
        console.log(`📄 Logs saved to ${filename}`);
        
        // Report results
        if (errors.length > 0) {
            console.log(`\n❌ Found ${errors.length} errors:`);
            errors.forEach(error => {
                console.log(`  - ${error.pattern}: ${error.message}`);
            });
            return false;
        } else {
            console.log('\n✅ No errors found! Application is working correctly.');
            return true;
        }
        
    } catch (error) {
        console.error(`❌ Test failed: ${error.message}`);
        return false;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run the test
testApplication().then(success => {
    process.exit(success ? 0 : 1);
}).catch(error => {
    console.error(`❌ Test script failed: ${error.message}`);
    process.exit(1);
});
