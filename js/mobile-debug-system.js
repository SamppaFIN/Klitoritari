/**
 * @fileoverview [IN_DEVELOPMENT] Mobile Debug System - Comprehensive mobile testing and debugging tools
 * @status IN_DEVELOPMENT - Phase 5 mobile debug tools and testing
 * @feature #feature-mobile-debug-system
 * @feature #feature-mobile-performance-testing
 * @feature #feature-mobile-error-handling
 * @last_updated 2025-01-28
 * @dependencies Mobile Encounter System, Step Currency System, Trail System
 * @warning Mobile debug system - comprehensive testing and monitoring tools
 * 
 * Mobile Debug System
 * Comprehensive debugging and testing tools for mobile optimization
 * Real-time monitoring, performance testing, and error handling
 */

class MobileDebugSystem {
    constructor() {
        this.isInitialized = false;
        this.isDebugMode = false;
        this.debugPanel = null;
        this.metrics = {
            performance: {
                fps: 0,
                memoryUsage: 0,
                batteryLevel: 0,
                networkStatus: 'unknown',
                lastUpdate: 0
            },
            mobile: {
                isMobile: false,
                screenSize: { width: 0, height: 0 },
                orientation: 'unknown',
                touchSupport: false,
                vibrationSupport: false,
                wakeLockSupport: false
            },
            systems: {
                stepCurrency: { status: 'unknown', lastUpdate: 0 },
                trailSystem: { status: 'unknown', markers: 0 },
                encounterSystem: { status: 'unknown', encounters: 0 },
                geolocation: { status: 'unknown', accuracy: 0 }
            },
            errors: []
        };
        
        // Debug settings
        this.debugSettings = {
            autoRefresh: true,
            refreshInterval: 1000, // 1 second
            logLevel: 'info', // debug, info, warn, error
            showPerformance: true,
            showMobile: true,
            showSystems: true,
            showErrors: true
        };
        
        // Performance monitoring
        this.performanceMonitor = {
            frameCount: 0,
            lastFrameTime: 0,
            fpsHistory: [],
            memoryHistory: [],
            maxHistoryLength: 60 // 1 minute at 1fps
        };
        
        console.log('🔧 Mobile Debug System initialized');
    }
    
    /**
     * Initialize mobile debug system
     * @status [IN_DEVELOPMENT] - Mobile debug initialization
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    init() {
        if (this.isInitialized) {
            console.log('🔧 Mobile debug system already initialized');
            return;
        }
        
        console.log('🔧 Initializing mobile debug system...');
        
        // Detect mobile device
        this.detectMobileCapabilities();
        
        // Create debug UI
        this.createDebugUI();
        
        // Set up monitoring
        this.setupPerformanceMonitoring();
        this.setupSystemMonitoring();
        this.setupErrorHandling();
        
        // Start auto-refresh if enabled
        if (this.debugSettings.autoRefresh) {
            this.startAutoRefresh();
        }
        
        this.isInitialized = true;
        console.log('🔧 Mobile debug system initialization complete');
    }
    
    /**
     * Detect mobile capabilities
     * @status [IN_DEVELOPMENT] - Mobile capability detection
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    detectMobileCapabilities() {
        this.metrics.mobile.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                                     window.innerWidth <= 768;
        
        this.metrics.mobile.screenSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        this.metrics.mobile.orientation = screen.orientation ? screen.orientation.type : 'unknown';
        this.metrics.mobile.touchSupport = 'ontouchstart' in window;
        this.metrics.mobile.vibrationSupport = 'vibrate' in navigator;
        this.metrics.mobile.wakeLockSupport = 'wakeLock' in navigator;
        
        console.log('🔧 Mobile capabilities detected:', this.metrics.mobile);
    }
    
    /**
     * Create debug UI
     * @status [IN_DEVELOPMENT] - Debug UI creation
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    createDebugUI() {
        // Create debug panel
        this.debugPanel = document.createElement('div');
        this.debugPanel.id = 'mobile-debug-panel';
        this.debugPanel.className = 'mobile-debug-panel';
        this.debugPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 300px;
            max-height: 80vh;
            background: rgba(0, 0, 0, 0.9);
            border: 2px solid #4a9eff;
            border-radius: 10px;
            padding: 15px;
            z-index: 10000;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #4a9eff;
            overflow-y: auto;
            display: none;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        `;
        
        // Add debug styles
        this.addDebugStyles();
        
        // Create debug content
        this.createDebugContent();
        
        // Add to document
        document.body.appendChild(this.debugPanel);
        
        // Create toggle button
        this.createDebugToggle();
        
        console.log('🔧 Debug UI created');
    }
    
    /**
     * Add debug styles
     * @status [IN_DEVELOPMENT] - Debug styling
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    addDebugStyles() {
        if (document.getElementById('mobile-debug-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'mobile-debug-styles';
        style.textContent = `
            .mobile-debug-panel {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 80vh;
                background: rgba(0, 0, 0, 0.9);
                border: 2px solid #4a9eff;
                border-radius: 10px;
                padding: 15px;
                z-index: 10000;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: #4a9eff;
                overflow-y: auto;
                display: none;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .debug-toggle {
                position: fixed;
                top: 10px;
                right: 10px;
                width: 50px;
                height: 50px;
                background: linear-gradient(45deg, #4a9eff, #2d98da);
                border: none;
                border-radius: 50%;
                color: white;
                font-size: 20px;
                cursor: pointer;
                z-index: 10001;
                box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
                transition: all 0.3s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }
            
            .debug-toggle:hover {
                transform: scale(1.1);
                box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
            }
            
            .debug-toggle:active {
                transform: scale(0.95);
            }
            
            .debug-section {
                margin-bottom: 15px;
                padding: 10px;
                background: rgba(74, 158, 255, 0.1);
                border-radius: 5px;
                border-left: 3px solid #4a9eff;
            }
            
            .debug-section h3 {
                margin: 0 0 10px 0;
                color: #4a9eff;
                font-size: 14px;
                text-shadow: 0 0 5px #4a9eff;
            }
            
            .debug-metric {
                display: flex;
                justify-content: space-between;
                margin: 5px 0;
                padding: 2px 0;
                border-bottom: 1px solid rgba(74, 158, 255, 0.2);
            }
            
            .debug-metric:last-child {
                border-bottom: none;
            }
            
            .debug-metric-label {
                color: #ccc;
                font-weight: bold;
            }
            
            .debug-metric-value {
                color: #4a9eff;
                font-weight: bold;
            }
            
            .debug-status {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 10px;
                font-weight: bold;
                text-transform: uppercase;
            }
            
            .debug-status.healthy {
                background: #4caf50;
                color: white;
            }
            
            .debug-status.warning {
                background: #ff9800;
                color: white;
            }
            
            .debug-status.error {
                background: #f44336;
                color: white;
            }
            
            .debug-status.unknown {
                background: #666;
                color: white;
            }
            
            .debug-controls {
                display: flex;
                gap: 5px;
                margin-top: 10px;
            }
            
            .debug-btn {
                padding: 5px 10px;
                background: rgba(74, 158, 255, 0.2);
                border: 1px solid #4a9eff;
                border-radius: 3px;
                color: #4a9eff;
                font-size: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .debug-btn:hover {
                background: rgba(74, 158, 255, 0.3);
                transform: scale(1.05);
            }
            
            .debug-btn:active {
                transform: scale(0.95);
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .mobile-debug-panel {
                    width: calc(100vw - 20px);
                    right: 10px;
                    left: 10px;
                    max-height: 70vh;
                }
                
                .debug-toggle {
                    width: 45px;
                    height: 45px;
                    font-size: 18px;
                }
                
                .debug-section {
                    padding: 8px;
                }
                
                .debug-metric {
                    font-size: 11px;
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🔧 Debug styles added');
    }
    
    /**
     * Create debug content
     * @status [IN_DEVELOPMENT] - Debug content creation
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    createDebugContent() {
        this.debugPanel.innerHTML = `
            <div class="debug-header" style="text-align: center; margin-bottom: 15px;">
                <h2 style="margin: 0; color: #4a9eff; text-shadow: 0 0 10px #4a9eff;">🔧 Mobile Debug</h2>
                <div class="debug-controls">
                    <button class="debug-btn" id="debug-refresh">Refresh</button>
                    <button class="debug-btn" id="debug-clear">Clear</button>
                    <button class="debug-btn" id="debug-export">Export</button>
                </div>
            </div>
            
            <div class="debug-section" id="debug-performance">
                <h3>📊 Performance</h3>
                <div id="debug-performance-content"></div>
            </div>
            
            <div class="debug-section" id="debug-mobile">
                <h3>📱 Mobile</h3>
                <div id="debug-mobile-content"></div>
            </div>
            
            <div class="debug-section" id="debug-systems">
                <h3>⚙️ Systems</h3>
                <div id="debug-systems-content"></div>
            </div>
            
            <div class="debug-section" id="debug-errors">
                <h3>❌ Errors</h3>
                <div id="debug-errors-content"></div>
            </div>
        `;
        
        // Add event listeners
        this.setupDebugEventListeners();
    }
    
    /**
     * Create debug toggle button
     * @status [IN_DEVELOPMENT] - Debug toggle creation
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    createDebugToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'debug-toggle';
        toggle.innerHTML = '🔧';
        toggle.title = 'Toggle Mobile Debug Panel';
        
        toggle.addEventListener('click', () => {
            this.toggleDebugPanel();
        });
        
        // Add touch events for mobile
        toggle.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.toggleDebugPanel();
        });
        
        document.body.appendChild(toggle);
        console.log('🔧 Debug toggle created');
    }
    
    /**
     * Set up debug event listeners
     * @status [IN_DEVELOPMENT] - Debug event setup
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    setupDebugEventListeners() {
        // Refresh button
        const refreshBtn = document.getElementById('debug-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDebugData();
            });
        }
        
        // Clear button
        const clearBtn = document.getElementById('debug-clear');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearDebugData();
            });
        }
        
        // Export button
        const exportBtn = document.getElementById('debug-export');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportDebugData();
            });
        }
    }
    
    /**
     * Toggle debug panel visibility
     * @status [IN_DEVELOPMENT] - Debug panel toggle
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    toggleDebugPanel() {
        if (this.debugPanel) {
            const isVisible = this.debugPanel.style.display !== 'none';
            this.debugPanel.style.display = isVisible ? 'none' : 'block';
            this.isDebugMode = !isVisible;
            
            if (this.isDebugMode) {
                this.refreshDebugData();
            }
            
            console.log(`🔧 Debug panel ${isVisible ? 'hidden' : 'shown'}`);
        }
    }
    
    /**
     * Refresh debug data
     * @status [IN_DEVELOPMENT] - Debug data refresh
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    refreshDebugData() {
        this.updatePerformanceMetrics();
        this.updateMobileMetrics();
        this.updateSystemMetrics();
        this.updateErrorMetrics();
        
        this.renderDebugContent();
        console.log('🔧 Debug data refreshed');
    }
    
    /**
     * Update performance metrics
     * @status [IN_DEVELOPMENT] - Performance monitoring
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    updatePerformanceMetrics() {
        // FPS calculation
        const now = performance.now();
        if (this.performanceMonitor.lastFrameTime > 0) {
            const deltaTime = now - this.performanceMonitor.lastFrameTime;
            const fps = 1000 / deltaTime;
            
            this.performanceMonitor.fpsHistory.push(fps);
            if (this.performanceMonitor.fpsHistory.length > this.performanceMonitor.maxHistoryLength) {
                this.performanceMonitor.fpsHistory.shift();
            }
            
            this.metrics.performance.fps = Math.round(fps);
        }
        this.performanceMonitor.lastFrameTime = now;
        
        // Memory usage
        if (performance.memory) {
            this.metrics.performance.memoryUsage = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024); // MB
        }
        
        // Battery level
        if (navigator.getBattery) {
            navigator.getBattery().then(battery => {
                this.metrics.performance.batteryLevel = Math.round(battery.level * 100);
            });
        }
        
        // Network status
        this.metrics.performance.networkStatus = navigator.onLine ? 'online' : 'offline';
        
        this.metrics.performance.lastUpdate = Date.now();
    }
    
    /**
     * Update mobile metrics
     * @status [IN_DEVELOPMENT] - Mobile metrics update
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    updateMobileMetrics() {
        this.metrics.mobile.screenSize = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        
        this.metrics.mobile.orientation = screen.orientation ? screen.orientation.type : 'unknown';
    }
    
    /**
     * Update system metrics
     * @status [IN_DEVELOPMENT] - System metrics update
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    updateSystemMetrics() {
        // Step currency system
        if (window.stepCurrencySystem) {
            this.metrics.systems.stepCurrency = {
                status: 'healthy',
                lastUpdate: Date.now(),
                totalSteps: window.stepCurrencySystem.totalSteps,
                sessionSteps: window.stepCurrencySystem.sessionSteps
            };
        } else {
            this.metrics.systems.stepCurrency = {
                status: 'error',
                lastUpdate: 0
            };
        }
        
        // Trail system
        if (window.trailSystem) {
            this.metrics.systems.trailSystem = {
                status: 'healthy',
                lastUpdate: Date.now(),
                markers: window.trailSystem.trailMarkers ? window.trailSystem.trailMarkers.size : 0
            };
        } else {
            this.metrics.systems.trailSystem = {
                status: 'error',
                lastUpdate: 0
            };
        }
        
        // Mobile encounter system
        if (window.mobileEncounterSystem) {
            this.metrics.systems.encounterSystem = {
                status: 'healthy',
                lastUpdate: Date.now(),
                encounters: window.mobileEncounterSystem.encounterQueue ? window.mobileEncounterSystem.encounterQueue.length : 0
            };
        } else {
            this.metrics.systems.encounterSystem = {
                status: 'error',
                lastUpdate: 0
            };
        }
        
        // Geolocation
        if (navigator.geolocation) {
            this.metrics.systems.geolocation = {
                status: 'healthy',
                lastUpdate: Date.now(),
                accuracy: 0 // Would need to track actual accuracy
            };
        } else {
            this.metrics.systems.geolocation = {
                status: 'error',
                lastUpdate: 0
            };
        }
    }
    
    /**
     * Update error metrics
     * @status [IN_DEVELOPMENT] - Error metrics update
     * @feature #feature-mobile-error-handling
     * @last_tested 2025-01-28
     */
    updateErrorMetrics() {
        // Keep only recent errors (last 10)
        if (this.metrics.errors.length > 10) {
            this.metrics.errors = this.metrics.errors.slice(-10);
        }
    }
    
    /**
     * Render debug content
     * @status [IN_DEVELOPMENT] - Debug content rendering
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    renderDebugContent() {
        this.renderPerformanceContent();
        this.renderMobileContent();
        this.renderSystemsContent();
        this.renderErrorsContent();
    }
    
    /**
     * Render performance content
     * @status [IN_DEVELOPMENT] - Performance content rendering
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    renderPerformanceContent() {
        const container = document.getElementById('debug-performance-content');
        if (!container) return;
        
        const fps = this.metrics.performance.fps;
        const memory = this.metrics.performance.memoryUsage;
        const battery = this.metrics.performance.batteryLevel;
        const network = this.metrics.performance.networkStatus;
        
        container.innerHTML = `
            <div class="debug-metric">
                <span class="debug-metric-label">FPS:</span>
                <span class="debug-metric-value" style="color: ${fps >= 30 ? '#4caf50' : fps >= 15 ? '#ff9800' : '#f44336'}">${fps}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Memory:</span>
                <span class="debug-metric-value">${memory} MB</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Battery:</span>
                <span class="debug-metric-value" style="color: ${battery >= 50 ? '#4caf50' : battery >= 20 ? '#ff9800' : '#f44336'}">${battery}%</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Network:</span>
                <span class="debug-metric-value" style="color: ${network === 'online' ? '#4caf50' : '#f44336'}">${network}</span>
            </div>
        `;
    }
    
    /**
     * Render mobile content
     * @status [IN_DEVELOPMENT] - Mobile content rendering
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    renderMobileContent() {
        const container = document.getElementById('debug-mobile-content');
        if (!container) return;
        
        const mobile = this.metrics.mobile;
        
        container.innerHTML = `
            <div class="debug-metric">
                <span class="debug-metric-label">Device:</span>
                <span class="debug-metric-value">${mobile.isMobile ? 'Mobile' : 'Desktop'}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Screen:</span>
                <span class="debug-metric-value">${mobile.screenSize.width}x${mobile.screenSize.height}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Orientation:</span>
                <span class="debug-metric-value">${mobile.orientation}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Touch:</span>
                <span class="debug-metric-value" style="color: ${mobile.touchSupport ? '#4caf50' : '#f44336'}">${mobile.touchSupport ? 'Yes' : 'No'}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Vibration:</span>
                <span class="debug-metric-value" style="color: ${mobile.vibrationSupport ? '#4caf50' : '#f44336'}">${mobile.vibrationSupport ? 'Yes' : 'No'}</span>
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Wake Lock:</span>
                <span class="debug-metric-value" style="color: ${mobile.wakeLockSupport ? '#4caf50' : '#f44336'}">${mobile.wakeLockSupport ? 'Yes' : 'No'}</span>
            </div>
        `;
    }
    
    /**
     * Render systems content
     * @status [IN_DEVELOPMENT] - Systems content rendering
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    renderSystemsContent() {
        const container = document.getElementById('debug-systems-content');
        if (!container) return;
        
        const systems = this.metrics.systems;
        
        container.innerHTML = `
            <div class="debug-metric">
                <span class="debug-metric-label">Step Currency:</span>
                <span class="debug-status ${systems.stepCurrency.status}">${systems.stepCurrency.status}</span>
                ${systems.stepCurrency.totalSteps ? `<span style="margin-left: 10px; color: #ccc;">${systems.stepCurrency.totalSteps} steps</span>` : ''}
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Trail System:</span>
                <span class="debug-status ${systems.trailSystem.status}">${systems.trailSystem.status}</span>
                ${systems.trailSystem.markers ? `<span style="margin-left: 10px; color: #ccc;">${systems.trailSystem.markers} markers</span>` : ''}
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Encounter System:</span>
                <span class="debug-status ${systems.encounterSystem.status}">${systems.encounterSystem.status}</span>
                ${systems.encounterSystem.encounters ? `<span style="margin-left: 10px; color: #ccc;">${systems.encounterSystem.encounters} encounters</span>` : ''}
            </div>
            <div class="debug-metric">
                <span class="debug-metric-label">Geolocation:</span>
                <span class="debug-status ${systems.geolocation.status}">${systems.geolocation.status}</span>
            </div>
        `;
    }
    
    /**
     * Render errors content
     * @status [IN_DEVELOPMENT] - Errors content rendering
     * @feature #feature-mobile-error-handling
     * @last_tested 2025-01-28
     */
    renderErrorsContent() {
        const container = document.getElementById('debug-errors-content');
        if (!container) return;
        
        if (this.metrics.errors.length === 0) {
            container.innerHTML = '<div style="color: #4caf50; text-align: center;">No errors</div>';
            return;
        }
        
        const errorsHtml = this.metrics.errors.map(error => `
            <div class="debug-metric" style="border-left: 3px solid #f44336; padding-left: 5px;">
                <div style="color: #f44336; font-weight: bold;">${error.type}</div>
                <div style="color: #ccc; font-size: 10px;">${error.message}</div>
                <div style="color: #666; font-size: 9px;">${new Date(error.timestamp).toLocaleTimeString()}</div>
            </div>
        `).join('');
        
        container.innerHTML = errorsHtml;
    }
    
    /**
     * Set up performance monitoring
     * @status [IN_DEVELOPMENT] - Performance monitoring setup
     * @feature #feature-mobile-performance-testing
     * @last_tested 2025-01-28
     */
    setupPerformanceMonitoring() {
        // FPS monitoring
        const monitorFPS = () => {
            this.updatePerformanceMetrics();
            requestAnimationFrame(monitorFPS);
        };
        requestAnimationFrame(monitorFPS);
        
        console.log('🔧 Performance monitoring setup complete');
    }
    
    /**
     * Set up system monitoring
     * @status [IN_DEVELOPMENT] - System monitoring setup
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    setupSystemMonitoring() {
        // Monitor system health
        setInterval(() => {
            this.updateSystemMetrics();
        }, 5000); // Every 5 seconds
        
        console.log('🔧 System monitoring setup complete');
    }
    
    /**
     * Set up error handling
     * @status [IN_DEVELOPMENT] - Error handling setup
     * @feature #feature-mobile-error-handling
     * @last_tested 2025-01-28
     */
    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.logError('JavaScript Error', event.error?.message || event.message, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno
            });
        });
        
        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.logError('Unhandled Promise Rejection', event.reason?.message || event.reason, {
                promise: event.promise
            });
        });
        
        console.log('🔧 Error handling setup complete');
    }
    
    /**
     * Log error
     * @status [IN_DEVELOPMENT] - Error logging
     * @feature #feature-mobile-error-handling
     * @last_tested 2025-01-28
     */
    logError(type, message, details = {}) {
        const error = {
            type,
            message,
            details,
            timestamp: Date.now()
        };
        
        this.metrics.errors.push(error);
        
        // Keep only recent errors
        if (this.metrics.errors.length > 10) {
            this.metrics.errors = this.metrics.errors.slice(-10);
        }
        
        console.error(`🔧 Error logged: ${type} - ${message}`, details);
    }
    
    /**
     * Start auto-refresh
     * @status [IN_DEVELOPMENT] - Auto-refresh setup
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    startAutoRefresh() {
        setInterval(() => {
            if (this.isDebugMode) {
                this.refreshDebugData();
            }
        }, this.debugSettings.refreshInterval);
        
        console.log('🔧 Auto-refresh started');
    }
    
    /**
     * Clear debug data
     * @status [IN_DEVELOPMENT] - Debug data clearing
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    clearDebugData() {
        this.metrics.errors = [];
        this.performanceMonitor.fpsHistory = [];
        this.performanceMonitor.memoryHistory = [];
        
        console.log('🔧 Debug data cleared');
    }
    
    /**
     * Export debug data
     * @status [IN_DEVELOPMENT] - Debug data export
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    exportDebugData() {
        const debugData = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            performanceHistory: {
                fps: this.performanceMonitor.fpsHistory,
                memory: this.performanceMonitor.memoryHistory
            }
        };
        
        const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobile-debug-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        
        console.log('🔧 Debug data exported');
    }
    
    /**
     * Get debug statistics
     * @status [IN_DEVELOPMENT] - Debug statistics
     * @feature #feature-mobile-debug-system
     * @last_tested 2025-01-28
     */
    getDebugStats() {
        return {
            isInitialized: this.isInitialized,
            isDebugMode: this.isDebugMode,
            metrics: this.metrics,
            performanceHistory: {
                fps: this.performanceMonitor.fpsHistory,
                memory: this.performanceMonitor.memoryHistory
            }
        };
    }
}

// Export for global use
window.MobileDebugSystem = MobileDebugSystem;

console.log('🔧 Mobile Debug System loaded');
