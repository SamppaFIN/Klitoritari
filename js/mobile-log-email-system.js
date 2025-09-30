/**
 * @fileoverview [IN_DEVELOPMENT] Mobile Log Email System - Send mobile logs via email
 * @status IN_DEVELOPMENT - Mobile log collection and email system
 * @feature #feature-mobile-log-email
 * @feature #feature-debug-logging
 * @last_updated 2025-01-28
 * @dependencies EmailJS, Console API, LocalStorage
 * @warning Mobile log email system - do not modify without testing email functionality
 * 
 * Mobile Log Email System
 * Collects mobile logs and sends them via email for debugging
 */

console.log('📧 Mobile Log Email System script loaded!');

class MobileLogEmailSystem {
    constructor() {
        this.isInitialized = false;
        this.logs = [];
        this.maxLogs = 1000;
        this.emailConfig = {
            serviceId: 'service_mobile_logs',
            templateId: 'template_mobile_logs',
            userId: 'user_mobile_logs'
        };
        
        // Email template data
        this.emailData = {
            to_email: 'raisanen.sami@gmail.com', // Your actual email address
            from_name: 'Eldritch Sanctuary Mobile',
            subject: 'Mobile Debug Logs - Eldritch Sanctuary',
            device_info: '',
            logs_content: '',
            timestamp: ''
        };
        
        console.log('📧 Mobile Log Email System initialized');
    }
    
    /**
     * Initialize the mobile log email system
     * @status [IN_DEVELOPMENT] - System initialization
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    init() {
        if (this.isInitialized) {
            console.log('📧 Mobile Log Email System already initialized');
            return;
        }
        
        console.log('📧 Initializing Mobile Log Email System...');
        
        try {
            // Set up console log interception
            this.setupConsoleInterception();
            
            // Set up error logging
            this.setupErrorLogging();
            
            // Create email button in UI
            this.createEmailButton();
            
            this.isInitialized = true;
            console.log('📧 Mobile Log Email System initialization complete');
            
        } catch (error) {
            console.error('📧 Mobile Log Email System initialization failed:', error);
        }
    }
    
    /**
     * Set up console log interception - DISABLED for performance
     * @status [IN_DEVELOPMENT] - Console interception
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    setupConsoleInterception() {
        // DISABLED: Console interception disabled for performance
        // The debug logger handles log collection when needed
        console.log('📧 Console log interception disabled for performance');
    }
    
    /**
     * Set up error logging - DISABLED for performance
     * @status [IN_DEVELOPMENT] - Error logging setup
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    setupErrorLogging() {
        // DISABLED: Error logging disabled for performance
        // The debug logger handles error collection when needed
        console.log('📧 Error logging disabled for performance');
    }
    
    /**
     * Add log entry
     * @status [IN_DEVELOPMENT] - Log entry addition
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    addLog(type, message) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            type: type,
            message: message,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.logs.push(logEntry);
        
        // Keep only recent logs
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Store in localStorage as backup
        try {
            localStorage.setItem('mobile_logs', JSON.stringify(this.logs));
        } catch (error) {
            console.warn('📧 Could not store logs in localStorage:', error);
        }
    }
    
    /**
     * Create email button in UI - DISABLED to avoid conflicts with debug panel
     * @status [IN_DEVELOPMENT] - UI button creation
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    createEmailButton() {
        // DISABLED: Don't create separate button to avoid conflicts with debug panel
        // The debug panel's "Export Logs" button will handle log export
        console.log('📧 Mobile log email button creation disabled - using debug panel instead');
    }
    
    /**
     * Send logs via email
     * @status [IN_DEVELOPMENT] - Email sending
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    async sendLogsViaEmail() {
        console.log('📧 Preparing to send mobile logs via email...');
        
        try {
            // Get device information
            const deviceInfo = this.getDeviceInfo();
            
            // Format logs for email
            const logsContent = this.formatLogsForEmail();
            
            // Update email data
            this.emailData.device_info = deviceInfo;
            this.emailData.logs_content = logsContent;
            this.emailData.timestamp = new Date().toISOString();
            
            // Try multiple email methods
            await this.tryEmailMethods();
            
        } catch (error) {
            console.error('📧 Error sending logs via email:', error);
            this.showEmailError(error);
        }
    }
    
    /**
     * Get device information
     * @status [IN_DEVELOPMENT] - Device info collection
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    getDeviceInfo() {
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            windowSize: `${window.innerWidth}x${window.innerHeight}`,
            devicePixelRatio: window.devicePixelRatio,
            connection: navigator.connection ? {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt
            } : 'Not available',
            battery: 'Battery API not available',
            memory: navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Not available',
            hardwareConcurrency: navigator.hardwareConcurrency || 'Not available',
            url: window.location.href,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Format logs for email
     * @status [IN_DEVELOPMENT] - Log formatting
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    formatLogsForEmail() {
        const recentLogs = this.logs.slice(-100); // Last 100 logs
        
        let formattedLogs = 'MOBILE DEBUG LOGS\n';
        formattedLogs += '==================\n\n';
        
        recentLogs.forEach((log, index) => {
            formattedLogs += `${index + 1}. [${log.timestamp}] ${log.type.toUpperCase()}: ${log.message}\n`;
        });
        
        return formattedLogs;
    }
    
    /**
     * Try multiple email methods
     * @status [IN_DEVELOPMENT] - Email method attempts
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    async tryEmailMethods() {
        // Method 1: Try EmailJS (if available)
        if (typeof emailjs !== 'undefined') {
            try {
                await this.sendViaEmailJS();
                return;
            } catch (error) {
                console.log('📧 EmailJS method failed:', error);
            }
        }
        
        // Method 2: Try mailto link
        try {
            await this.sendViaMailto();
            return;
        } catch (error) {
            console.log('📧 Mailto method failed:', error);
        }
        
        // Method 3: Copy to clipboard
        try {
            await this.copyToClipboard();
            return;
        } catch (error) {
            console.log('📧 Clipboard method failed:', error);
        }
        
        // Method 4: Download as file
        this.downloadAsFile();
    }
    
    /**
     * Send via EmailJS
     * @status [IN_DEVELOPMENT] - EmailJS sending
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    async sendViaEmailJS() {
        const result = await emailjs.send(
            this.emailConfig.serviceId,
            this.emailConfig.templateId,
            this.emailData
        );
        
        console.log('📧 Logs sent via EmailJS:', result);
        this.showSuccessMessage('Logs sent via EmailJS!');
    }
    
    /**
     * Send via mailto link
     * @status [IN_DEVELOPMENT] - Mailto sending
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    async sendViaMailto() {
        const subject = encodeURIComponent(this.emailData.subject);
        const body = encodeURIComponent(
            `Device Info:\n${JSON.stringify(this.emailData.device_info, null, 2)}\n\n` +
            `Logs:\n${this.emailData.logs_content}`
        );
        
        const mailtoLink = `mailto:${this.emailData.to_email}?subject=${subject}&body=${body}`;
        
        window.open(mailtoLink);
        this.showSuccessMessage('Mailto link opened!');
    }
    
    /**
     * Copy to clipboard
     * @status [IN_DEVELOPMENT] - Clipboard copying
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    async copyToClipboard() {
        const logText = `Device Info:\n${JSON.stringify(this.emailData.device_info, null, 2)}\n\nLogs:\n${this.emailData.logs_content}`;
        
        await navigator.clipboard.writeText(logText);
        this.showSuccessMessage('Logs copied to clipboard!');
    }
    
    /**
     * Download as file
     * @status [IN_DEVELOPMENT] - File download
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    downloadAsFile() {
        const logText = `Device Info:\n${JSON.stringify(this.emailData.device_info, null, 2)}\n\nLogs:\n${this.emailData.logs_content}`;
        
        const blob = new Blob([logText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobile-logs-${new Date().toISOString().slice(0, 19)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage('Logs downloaded as file!');
    }
    
    /**
     * Show success message
     * @status [IN_DEVELOPMENT] - Success notification
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #10b981;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    /**
     * Show error message
     * @status [IN_DEVELOPMENT] - Error notification
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    showEmailError(error) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #ef4444;
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10001;
            font-size: 16px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;
        notification.textContent = `Email Error: ${error.message}`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 5000);
    }
    
    /**
     * Get logs count
     * @status [IN_DEVELOPMENT] - Log count
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    getLogsCount() {
        return this.logs.length;
    }
    
    /**
     * Clear logs
     * @status [IN_DEVELOPMENT] - Log clearing
     * @feature #feature-mobile-log-email
     * @last_tested 2025-01-28
     */
    clearLogs() {
        this.logs = [];
        localStorage.removeItem('mobile_logs');
        console.log('📧 Mobile logs cleared');
    }
}

// Make globally available
window.MobileLogEmailSystem = MobileLogEmailSystem;

console.log('📧 Mobile Log Email System ready!');
