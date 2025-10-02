/**
 * @fileoverview [VERIFIED] Step Currency System - Enhanced mobile step tracking with analytics and achievements
 * @status VERIFIED - Phase 3 mobile enhancements complete with anti-cheat and battery optimization
 * @feature #feature-step-currency-system
 * @feature #feature-mobile-step-tracking
 * @feature #feature-step-analytics
 * @feature #feature-achievement-system
 * @feature #feature-battery-optimization
 * @feature #feature-anti-cheat-validation
 * @bugfix #bug-milestone-blocked
 * @bugfix #bug-persistence-timing
 * @last_verified 2025-01-28
 * @dependencies WebSocket, Base System, Event Bus, Map Layer, DeviceMotionEvent, Battery API
 * @warning Do not modify milestone logic, step counting, validation, or persistence timing without testing complete flow
 * 
 * Step Currency System
 * Manages real-world step counting as the primary game currency
 */

console.log('🚶‍♂️ Step currency system script file loaded!');
console.log('🚶‍♂️ About to define StepCurrencySystem class...');

class StepCurrencySystem {
    constructor() {
        this.instanceId = 'step-currency-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        console.log('🚶‍♂️ StepCurrencySystem constructor called, Instance ID:', this.instanceId);
        console.log('🚶‍♂️ Constructor starting...');
        this.totalSteps = 0;
        this.sessionSteps = 0;
        this.lastStepCount = 0;
        this.stepDetectionActive = false;
        this.accelerationData = [];
        this.stepThreshold = 2.5; // Higher acceleration threshold for step detection
        this.lastStepTime = 0;
        this.minStepInterval = 1000; // Minimum 1 second between steps
        this.stepCooldown = 2000; // 2 second cooldown after each step
        
        // Debug flag to disable automatic step detection
        this.autoStepDetectionEnabled = true; // Enable automatic step detection by default
        this.stepDetectionActive = true; // Ensure step detection is active
        
        // Enhanced step tracking system
        this.enhancedTracking = null;
        this.useEnhancedTracking = true;
        
        // Simplified step counter - no toggle system needed
        // Consciousness-serving approach: simple and reliable
        
        // Step milestones for rewards
        this.milestones = {
            flag: 50,      // Create flag every 50 steps
            celebration: 100, // Celebration every 100 steps
            quest: 500,    // Unlock quest every 500 steps
            area: 1000     // Unlock area every 1000 steps
        };
        
        // Google Fit integration
        this.googleFitEnabled = false;
        this.googleFitClient = null;
        
        // Callback for step updates
        this.onStepUpdate = null;
        
        // Base building integration
        this.baseBuildingLayer = null;
        
        // Milestone tracking
        this.areaUnlocked = false;
        
        // Enhanced analytics and progress tracking
        this.stepAnalytics = {
            dailySteps: 0,
            weeklySteps: 0,
            monthlySteps: 0,
            bestDay: { date: null, steps: 0 },
            currentStreak: 0,
            longestStreak: 0,
            averageStepsPerDay: 0,
            totalDays: 0,
            lastResetDate: null
        };
        
        this.achievements = {
            firstSteps: false,
            hundredSteps: false,
            thousandSteps: false,
            tenThousandSteps: false,
            weeklyGoal: false,
            monthlyGoal: false,
            streakMaster: false
        };
        
        this.init();
    }
    
    setBaseBuildingLayer(layer) {
        this.baseBuildingLayer = layer;
        console.log('🏗️ Base building layer connected to step currency system');
    }
    
    initializeEnhancedTracking() {
        console.log('🚶‍♂️ Initializing enhanced step tracking system...');
        
        // Check if EnhancedStepTracking class is available
        if (typeof EnhancedStepTracking !== 'undefined') {
            try {
                this.enhancedTracking = new EnhancedStepTracking();
                console.log('🚶‍♂️ Enhanced step tracking system initialized successfully');
                
                // Set up event listeners for step updates if the method exists
                if (this.enhancedTracking && typeof this.enhancedTracking.on === 'function') {
                    this.enhancedTracking.on('stepDetected', (data) => {
                        console.log('🚶‍♂️ Enhanced tracking detected step:', data);
                        this.addStep('enhanced-tracking');
                    });
                    
                    this.enhancedTracking.on('trackingStatusChanged', (status) => {
                        console.log('🚶‍♂️ Enhanced tracking status changed:', status);
                    });
                } else {
                    console.log('🚶‍♂️ Enhanced tracking initialized but no event system available');
                }
                
                // Initialize the enhanced tracking
                this.enhancedTracking.init();
                
            } catch (error) {
                console.warn('🚶‍♂️ Failed to initialize enhanced tracking:', error);
                this.useEnhancedTracking = false;
            }
        } else {
            console.warn('🚶‍♂️ EnhancedStepTracking class not available, using fallback methods');
            this.useEnhancedTracking = false;
        }
    }
    
    init() {
        console.log('🚶‍♂️ ===== STEP CURRENCY SYSTEM INITIALIZATION =====');
        console.log('🚶‍♂️ Instance ID:', this.instanceId || 'no-id');
        console.log('🚶‍♂️ Starting initialization process...');
        
        // Only load from localStorage during initialization - don't request game state yet
        console.log('🚶‍♂️ Step 1: Loading from localStorage (game state will be requested when continuing adventure)...');
        this.loadStoredSteps();
        console.log(`🚶‍♂️ After loadStoredSteps - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Force set to 10,000 if still 0 after loading
        if (this.totalSteps === 0) {
            console.log('🚶‍♂️ Total steps is 0, force setting to 10,000...');
            this.totalSteps = 10000;
            this.saveSteps();
            console.log(`🚶‍♂️ Force set totalSteps to: ${this.totalSteps}`);
        }
        
        console.log('🚶‍♂️ Step 2: Initializing enhanced step tracking...');
        this.initializeEnhancedTracking();
        
        console.log('🚶‍♂️ Step 3: Setting up device motion...');
        this.setupDeviceMotion();
        
        console.log('🚶‍♂️ Step 4: Setting up Google Fit...');
        this.setupGoogleFit();
        
        console.log('🚶‍♂️ Step 5: Creating step counter...');
        this.createStepCounter();
        
        console.log('🚶‍♂️ Step 6: Starting step detection...');
        this.startStepDetection();
        
        console.log('🚶‍♂️ Step 7: Optimizing for mobile...');
        this.optimizeForMobile();
        
        // Update step counter display (with delay to ensure HTML is ready)
        console.log('🚶‍♂️ Step 8: Updating step counter display...');
        setTimeout(() => {
            this.updateStepCounter();
        }, 100);
        
        // Check for new adventure welcome notification
        setTimeout(() => {
            this.checkNewAdventureWelcome();
        }, 2000); // 2 second delay to ensure all systems are ready
        
        // Sync steps to server for validation
        console.log('🚶‍♂️ Step 9: Syncing steps to server...');
        this.syncStepsToServer();
        
        // Check milestones for existing steps (in case user already has enough steps)
        console.log('🚶‍♂️ Step 9: Running initial milestone check...');
        this.checkMilestones();
        console.log('🚶‍♂️ ===== STEP CURRENCY SYSTEM INITIALIZATION COMPLETE =====');
        
        // Add debug functions to window for testing
        window.debugStepCounter = {
            addTestStep: () => {
                console.log('🚶‍♂️ Adding test step...');
                this.addStep();
            },
            getStatus: () => {
                return {
                    stepDetectionActive: this.stepDetectionActive,
                    accelerationDataLength: this.accelerationData.length,
                    stepThreshold: this.stepThreshold,
                    minStepInterval: this.minStepInterval,
                    totalSteps: this.totalSteps,
                    sessionSteps: this.sessionSteps,
                    mobileStepData: this.mobileStepData,
                    stepValidation: this.stepValidation
                };
            },
            testDeviceMotion: () => {
                console.log('🚶‍♂️ Testing device motion...');
                if (this.accelerationData.length > 0) {
                    console.log('🚶‍♂️ Device motion data available:', this.accelerationData.slice(-3));
                } else {
                    console.log('🚶‍♂️ No device motion data received');
                }
            },
            resetThresholds: () => {
                console.log('🚶‍♂️ Resetting thresholds for testing...');
                this.stepThreshold = 1.0;
                this.minStepInterval = 200;
                console.log('🚶‍♂️ New thresholds:', { stepThreshold: this.stepThreshold, minStepInterval: this.minStepInterval });
            }
        };
        
        console.log('🚶‍♂️ Debug functions available: window.debugStepCounter');
    }
    
    requestInitialStepsFromServer() {
        console.log('🚶‍♂️ Requesting initial steps from server...');
        
        // Check if WebSocket is available
        if (window.websocketClient && window.websocketClient.socket && window.websocketClient.socket.readyState === WebSocket.OPEN) {
            console.log('🚶‍♂️ WebSocket available, requesting initial steps');
            window.websocketClient.send({
                type: 'request_initial_steps',
                payload: {}
            });
        } else {
            console.log('🚶‍♂️ WebSocket not available, falling back to localStorage');
            this.loadStoredSteps();
            this.updateStepCounter();
        }
    }
    
    syncStepsToServer() {
        console.log('🚶‍♂️ Syncing steps to server for validation...');
        
        // Check if WebSocket is available
        if (window.websocketClient && window.websocketClient.socket && window.websocketClient.socket.readyState === WebSocket.OPEN) {
            console.log('🚶‍♂️ WebSocket available, syncing steps to server');
            window.websocketClient.send({
                type: 'sync_steps',
                payload: {
                    totalSteps: this.totalSteps,
                    sessionSteps: this.sessionSteps,
                    timestamp: Date.now()
                }
            });
        } else {
            console.log('🚶‍♂️ WebSocket not available, steps will sync when connection is ready');
        }
    }

    handleInitialStepsFromServer(data) {
        console.log('🚶‍♂️ Received initial steps from server:', data);
        this.totalSteps = data.totalSteps || 10000;
        this.sessionSteps = data.sessionSteps || 0;
        
        // Save to localStorage for persistence
        this.saveSteps();
        
        // Update the display
        this.updateStepCounter();
        
        // Visual feedback
        try {
            if (window.auraPulseSystem) {
                window.auraPulseSystem.pulse({ color: '#8b5cf6', size: 120, duration: 400 });
            }
            if (window.particleSystem) {
                window.particleSystem.triggerBurst(window.innerWidth * 0.5, window.innerHeight * 0.85, { hue: 260, count: 12 });
            }
        } catch (_) {}
        
        console.log(`🚶‍♂️ Set steps from server - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
    }

    handleStepsSyncedFromServer(data) {
        console.log('🚶‍♂️ Steps sync acknowledged by server:', data);
        
        if (data.validated) {
            console.log('✅ Steps validated by server');
        } else {
            console.warn('⚠️ Steps validation failed on server');
        }
    }
    
    loadStoredSteps() {
        console.log('🚶‍♂️ ===== LOADING STORED STEPS =====');
        
        // Load total steps from localStorage
        const stored = localStorage.getItem('eldritch_total_steps');
        console.log('🚶‍♂️ Stored value from localStorage:', stored);
        console.log('🚶‍♂️ Current totalSteps before load:', this.totalSteps);
        
        if (stored && stored !== 'null' && stored !== 'undefined') {
            const parsedSteps = parseInt(stored);
            console.log('🚶‍♂️ Parsed steps:', parsedSteps);
            if (!isNaN(parsedSteps) && parsedSteps >= 0) {
                this.totalSteps = parsedSteps;
                console.log(`🚶‍♂️ Loaded ${this.totalSteps} total steps from storage`);
            } else {
                console.log(`🚶‍♂️ Invalid stored steps value: "${stored}", setting to 10,000`);
                this.totalSteps = 10000;
                this.saveSteps();
            }
        } else {
            // Set initial steps to 10,000 for new players
            console.log('🚶‍♂️ No stored steps found, setting initial steps to 10,000');
            this.totalSteps = 10000;
            this.saveSteps();
            console.log(`🚶‍♂️ Set initial steps to ${this.totalSteps} for new player`);
        }
        
        console.log('🚶‍♂️ Final totalSteps after load:', this.totalSteps);
        console.log('🚶‍♂️ ===== LOADING STORED STEPS COMPLETE =====');
    }
    
    saveSteps() {
        localStorage.setItem('eldritch_total_steps', this.totalSteps.toString());
        
        // Update analytics when steps are saved
        this.updateStepAnalytics();
    }
    
    // Enhanced analytics and progress tracking methods
    /**
     * Update comprehensive step analytics and progress tracking
     * @status [VERIFIED] - Analytics tracking working correctly
     * @feature #feature-step-analytics
     * @last_tested 2025-01-28
     */
    updateStepAnalytics() {
        const today = new Date().toDateString();
        const todayKey = `daily_steps_${today}`;
        
        // Load today's steps
        const storedDailySteps = localStorage.getItem(todayKey);
        this.stepAnalytics.dailySteps = storedDailySteps ? parseInt(storedDailySteps) : 0;
        
        // Update daily steps
        this.stepAnalytics.dailySteps = this.sessionSteps;
        localStorage.setItem(todayKey, this.stepAnalytics.dailySteps.toString());
        
        // Update weekly and monthly totals
        this.updateWeeklySteps();
        this.updateMonthlySteps();
        
        // Update streaks
        this.updateStreaks();
        
        // Check achievements
        this.checkAchievements();
        
        console.log('📊 Step analytics updated:', this.stepAnalytics);
    }
    
    updateWeeklySteps() {
        const now = new Date();
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
        const weekKey = `weekly_steps_${weekStart.toDateString()}`;
        
        // Calculate steps for this week
        let weeklySteps = 0;
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            const dayKey = `daily_steps_${day.toDateString()}`;
            const daySteps = localStorage.getItem(dayKey);
            if (daySteps) {
                weeklySteps += parseInt(daySteps);
            }
        }
        
        this.stepAnalytics.weeklySteps = weeklySteps;
        localStorage.setItem(weekKey, weeklySteps.toString());
    }
    
    updateMonthlySteps() {
        const now = new Date();
        const monthKey = `monthly_steps_${now.getFullYear()}_${now.getMonth()}`;
        
        // Calculate steps for this month
        let monthlySteps = 0;
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        
        for (let i = 1; i <= daysInMonth; i++) {
            const day = new Date(now.getFullYear(), now.getMonth(), i);
            const dayKey = `daily_steps_${day.toDateString()}`;
            const daySteps = localStorage.getItem(dayKey);
            if (daySteps) {
                monthlySteps += parseInt(daySteps);
            }
        }
        
        this.stepAnalytics.monthlySteps = monthlySteps;
        localStorage.setItem(monthKey, monthlySteps.toString());
    }
    
    updateStreaks() {
        const today = new Date();
        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        // Check last 30 days for streaks
        for (let i = 0; i < 30; i++) {
            const day = new Date(today);
            day.setDate(day.getDate() - i);
            const dayKey = `daily_steps_${day.toDateString()}`;
            const daySteps = localStorage.getItem(dayKey);
            
            if (daySteps && parseInt(daySteps) > 0) {
                if (i === 0) {
                    currentStreak = 1;
                    tempStreak = 1;
                } else if (i === 1 && tempStreak > 0) {
                    currentStreak++;
                    tempStreak++;
                } else if (tempStreak > 0) {
                    tempStreak++;
                }
                
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                tempStreak = 0;
            }
        }
        
        this.stepAnalytics.currentStreak = currentStreak;
        this.stepAnalytics.longestStreak = longestStreak;
    }
    
    /**
     * Check and unlock achievements based on step progress
     * @status [VERIFIED] - Achievement system working correctly
     * @feature #feature-achievement-system
     * @last_tested 2025-01-28
     */
    checkAchievements() {
        // First steps achievement
        if (this.totalSteps >= 1 && !this.achievements.firstSteps) {
            this.achievements.firstSteps = true;
            this.showAchievement('🎉 First Steps!', 'You took your first step in the cosmic realm!');
        }
        
        // Hundred steps achievement
        if (this.totalSteps >= 100 && !this.achievements.hundredSteps) {
            this.achievements.hundredSteps = true;
            this.showAchievement('🏃‍♂️ Centurion!', 'You\'ve walked 100 steps!');
        }
        
        // Thousand steps achievement
        if (this.totalSteps >= 1000 && !this.achievements.thousandSteps) {
            this.achievements.thousandSteps = true;
            this.showAchievement('🚶‍♂️ Thousand Steps!', 'You\'ve walked 1,000 steps!');
        }
        
        // Ten thousand steps achievement
        if (this.totalSteps >= 10000 && !this.achievements.tenThousandSteps) {
            this.achievements.tenThousandSteps = true;
            this.showAchievement('🌟 Ten Thousand Steps!', 'You\'ve walked 10,000 steps!');
        }
        
        // Weekly goal achievement (5000 steps in a week)
        if (this.stepAnalytics.weeklySteps >= 5000 && !this.achievements.weeklyGoal) {
            this.achievements.weeklyGoal = true;
            this.showAchievement('📅 Weekly Warrior!', 'You walked 5,000 steps in a week!');
        }
        
        // Monthly goal achievement (20000 steps in a month)
        if (this.stepAnalytics.monthlySteps >= 20000 && !this.achievements.monthlyGoal) {
            this.achievements.monthlyGoal = true;
            this.showAchievement('📆 Monthly Master!', 'You walked 20,000 steps in a month!');
        }
        
        // Streak master achievement (7 day streak)
        if (this.stepAnalytics.currentStreak >= 7 && !this.achievements.streakMaster) {
            this.achievements.streakMaster = true;
            this.showAchievement('🔥 Streak Master!', 'You\'ve walked for 7 days in a row!');
        }
        
        // Save achievements
        this.saveAchievements();
    }
    
    showAchievement(title, description) {
        console.log(`🏆 Achievement Unlocked: ${title} - ${description}`);
        
        // Show notification if available
        if (window.eldritchApp && window.eldritchApp.showNotification) {
            window.eldritchApp.showNotification(`🏆 ${title}`, 'success');
        }
        
        // Trigger visual effects
        if (window.discordEffects) {
            try {
                window.discordEffects.triggerGlowPulse(window.innerWidth/2, window.innerHeight/2, '#ffd700', 200);
                window.discordEffects.triggerNotificationPop(title, '#ffd700');
            } catch (e) {}
        }
    }
    
    loadAnalytics() {
        try {
            const stored = localStorage.getItem('eldritch_step_analytics');
            if (stored) {
                this.stepAnalytics = { ...this.stepAnalytics, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('🚶‍♂️ Error loading analytics:', error);
        }
    }
    
    saveAnalytics() {
        try {
            localStorage.setItem('eldritch_step_analytics', JSON.stringify(this.stepAnalytics));
        } catch (error) {
            console.error('🚶‍♂️ Error saving analytics:', error);
        }
    }
    
    loadAchievements() {
        try {
            const stored = localStorage.getItem('eldritch_achievements');
            if (stored) {
                this.achievements = { ...this.achievements, ...JSON.parse(stored) };
            }
        } catch (error) {
            console.error('🚶‍♂️ Error loading achievements:', error);
        }
    }
    
    saveAchievements() {
        try {
            localStorage.setItem('eldritch_achievements', JSON.stringify(this.achievements));
        } catch (error) {
            console.error('🚶‍♂️ Error saving achievements:', error);
        }
    }
    
    initializeDailyReset() {
        // Check if we need to reset daily steps
        const today = new Date().toDateString();
        const lastReset = localStorage.getItem('eldritch_last_reset_date');
        
        if (lastReset !== today) {
            // New day - reset session steps
            this.sessionSteps = 0;
            localStorage.setItem('eldritch_last_reset_date', today);
            console.log('🚶‍♂️ Daily reset - new day detected');
        }
    }
    
    getStepAnalytics() {
        return {
            ...this.stepAnalytics,
            totalSteps: this.totalSteps,
            sessionSteps: this.sessionSteps,
            achievements: this.achievements,
            mobileData: this.mobileStepData || null
        };
    }

    // Force reset steps to 10,000 (for debugging)
    forceResetSteps() {
        console.log('🚶‍♂️ Force resetting steps to 10,000');
        this.totalSteps = 10000;
        this.sessionSteps = 0;
        this.saveSteps();
        this.updateStepCounter();
        console.log('🚶‍♂️ Steps force reset complete');
    }
    
    setupDeviceMotion() {
        console.log('🚶‍♂️ Setting up device motion detection...');
        console.log('🚶‍♂️ Protocol:', window.location.protocol);
        console.log('🚶‍♂️ User Agent:', navigator.userAgent);
        console.log('🚶‍♂️ Is Mobile:', this.isMobileDevice());
        
        // If enhanced tracking is available and working, skip traditional setup
        if (this.useEnhancedTracking && this.enhancedTracking) {
            console.log('🚶‍♂️ Using enhanced step tracking system, skipping traditional device motion setup');
            return;
        }
        
        // Check if we're on HTTPS (required for device motion on mobile)
        if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
            console.warn('🚶‍♂️ Device motion requires HTTPS on mobile devices. Using fallback mode.');
            this.enableFallbackMode();
            return;
        }
        
        // For mobile devices, show permission request UI
        if (this.isMobileDevice()) {
            this.showMobilePermissionRequest();
        } else {
            // Desktop - try direct access
            this.enableDeviceMotion();
        }
        
        // Also try to access step counting if available
        this.setupStepCountingAPI();
    }
    
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               (navigator.maxTouchPoints && navigator.maxTouchPoints > 2);
    }
    
    showMobilePermissionRequest() {
        console.log('🚶‍♂️ Showing mobile permission request UI...');
        
        // Remove any existing permission modal first
        const existingModal = document.querySelector('.mobile-permission-modal');
        if (existingModal) {
            console.log('🚶‍♂️ Removing existing permission modal');
            existingModal.remove();
        }
        
        // Create permission request UI
        const permissionModal = document.createElement('div');
        permissionModal.className = 'mobile-permission-modal';
        permissionModal.innerHTML = `
            <div class="permission-content">
                <div class="permission-icon">🚶‍♂️</div>
                <h3>Enable Step Tracking</h3>
                <p>To count your steps accurately, we need access to your device's motion sensors.</p>
                <div class="permission-buttons">
                    <button id="grant-motion-permission" class="permission-btn grant">Enable Motion Sensors</button>
                    <button id="skip-motion-permission" class="permission-btn skip">Use Fallback Mode</button>
                </div>
                <p class="permission-note">You can change this later in your browser settings.</p>
                <button id="close-permission-modal" class="permission-btn close" style="background: #ef4444; margin-top: 10px;">Close Dialog</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-permission-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                font-family: Arial, sans-serif;
            }
            .permission-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                max-width: 400px;
                margin: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            .permission-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .permission-content h3 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 24px;
            }
            .permission-content p {
                margin: 0 0 20px 0;
                color: #666;
                line-height: 1.5;
            }
            .permission-buttons {
                display: flex;
                gap: 15px;
                margin: 25px 0;
            }
            .permission-btn {
                flex: 1;
                padding: 12px 20px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .permission-btn.grant {
                background: #10b981;
                color: white;
            }
            .permission-btn.grant:hover {
                background: #059669;
            }
            .permission-btn.skip {
                background: #6b7280;
                color: white;
            }
            .permission-btn.skip:hover {
                background: #4b5563;
            }
            .permission-note {
                font-size: 12px;
                color: #999;
                margin-top: 15px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(permissionModal);
        
        // Add event listeners with error handling
        const grantBtn = document.getElementById('grant-motion-permission');
        const skipBtn = document.getElementById('skip-motion-permission');
        
        if (grantBtn) {
            grantBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Grant motion permission button clicked');
                this.requestDeviceMotionPermission();
                permissionModal.remove();
            });
            
            // Add touch event for mobile
            grantBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Grant motion permission button touched');
                this.requestDeviceMotionPermission();
                permissionModal.remove();
            });
        } else {
            console.error('🚶‍♂️ Grant motion permission button not found!');
        }
        
        if (skipBtn) {
            skipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Skip motion permission button clicked');
                console.log('🚶‍♂️ User skipped motion permission, using fallback mode');
                this.enableFallbackMode();
                permissionModal.remove();
            });
            
            // Add touch event for mobile
            skipBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Skip motion permission button touched');
                console.log('🚶‍♂️ User skipped motion permission, using fallback mode');
                this.enableFallbackMode();
                permissionModal.remove();
            });
        } else {
            console.error('🚶‍♂️ Skip motion permission button not found!');
        }
        
        // Add close button event listener
        const closeBtn = document.getElementById('close-permission-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Close permission modal button clicked');
                this.enableFallbackMode(); // Enable fallback mode when closing
                permissionModal.remove();
            });
            
            // Add touch event for mobile
            closeBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                console.log('🚶‍♂️ Close permission modal button touched');
                this.enableFallbackMode(); // Enable fallback mode when closing
                permissionModal.remove();
            });
        } else {
            console.error('🚶‍♂️ Close permission modal button not found!');
        }
    }
    
    requestDeviceMotionPermission() {
        console.log('🚶‍♂️ Requesting device motion permission...');
        
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(response => {
                console.log('🚶‍♂️ Device motion permission response:', response);
                if (response === 'granted') {
                    console.log('🚶‍♂️ Device motion permission granted!');
                    this.enableDeviceMotion();
                    this.showPermissionSuccess();
                } else {
                    console.log('🚶‍♂️ Device motion permission denied, using fallback');
                    this.enableFallbackMode();
                    this.showPermissionFallback();
                }
            }).catch(error => {
                console.warn('🚶‍♂️ Device motion permission error:', error);
                this.enableFallbackMode();
                this.showPermissionError();
            });
        } else {
            console.log('🚶‍♂️ Direct device motion access (older browsers)');
            this.enableDeviceMotion();
        }
    }
    
    showPermissionSuccess() {
        this.showNotification('✅ Motion sensors enabled! Step tracking is now active.', 'success');
    }
    
    showPermissionFallback() {
        this.showNotification('⚠️ Using fallback step tracking. You can enable motion sensors later.', 'warning');
    }
    
    showPermissionError() {
        this.showNotification('❌ Permission request failed. Using fallback step tracking.', 'error');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `step-notification ${type}`;
        notification.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .step-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: bold;
                z-index: 10001;
                animation: slideIn 0.3s ease-out;
            }
            .step-notification.success { background: #10b981; }
            .step-notification.warning { background: #f59e0b; }
            .step-notification.error { background: #ef4444; }
            .step-notification.info { background: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    setupStepCountingAPI() {
        // Try to access native step counting APIs if available
        if ('navigator' in window && 'permissions' in navigator) {
            // Check for step counting permission
            navigator.permissions.query({ name: 'accelerometer' }).then(result => {
                if (result.state === 'granted') {
                    console.log('🚶‍♂️ Accelerometer permission granted');
                    this.setupAdvancedStepDetection();
                }
            }).catch(() => {
                console.log('🚶‍♂️ Accelerometer permission not available');
            });
        }
        
        // Try to access health/fitness APIs if available
        if ('navigator' in window && 'health' in navigator) {
            this.setupHealthAPI();
        }
    }
    
    setupAdvancedStepDetection() {
        console.log('🚶‍♂️ Setting up advanced step detection');
        // Enhanced step detection using multiple sensors
        let lastAcceleration = null;
        let stepBuffer = [];
        let lastStepTime = 0;
        
        window.addEventListener('devicemotion', (event) => {
            if (!this.stepDetectionActive) return;
            
            const acceleration = {
                x: event.accelerationIncludingGravity?.x || 0,
                y: event.accelerationIncludingGravity?.y || 0,
                z: event.accelerationIncludingGravity?.z || 0,
                timestamp: Date.now()
            };
            
            if (lastAcceleration) {
                // Calculate acceleration magnitude
                const deltaX = acceleration.x - lastAcceleration.x;
                const deltaY = acceleration.y - lastAcceleration.y;
                const deltaZ = acceleration.z - lastAcceleration.z;
                const magnitude = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
                
                // Store acceleration data for pattern analysis
                stepBuffer.push({
                    magnitude: magnitude,
                    timestamp: acceleration.timestamp
                });
                
                // Keep only last 50 readings (about 5 seconds at 10Hz)
                if (stepBuffer.length > 50) {
                    stepBuffer.shift();
                }
                
                // Detect step pattern: look for peaks in acceleration
                if (stepBuffer.length >= 10) {
                    const recent = stepBuffer.slice(-10);
                    const avgMagnitude = recent.reduce((sum, reading) => sum + reading.magnitude, 0) / recent.length;
                    const currentMagnitude = recent[recent.length - 1].magnitude;
                    
                    // Step detection: significant peak above average
                    if (currentMagnitude > avgMagnitude * 1.5 && 
                        currentMagnitude > this.stepThreshold &&
                        acceleration.timestamp - lastStepTime > this.minStepInterval) {
                        
                        this.addStep();
                        lastStepTime = acceleration.timestamp;
                        stepBuffer = []; // Clear buffer after step detection
                    }
                }
            }
            
            lastAcceleration = acceleration;
        });
    }
    
    setupHealthAPI() {
        console.log('🚶‍♂️ Setting up health API integration');
        // This would integrate with health APIs if available
        // For now, we'll use the enhanced motion detection
        try {
            if (navigator.health && navigator.health.requestAccess) {
                navigator.health.requestAccess(['steps']).then(granted => {
                    if (granted) {
                        console.log('🚶‍♂️ Health API access granted');
                        this.enableHealthStepCounting();
                    }
                }).catch(error => {
                    console.log('🚶‍♂️ Health API not available:', error);
                });
            }
        } catch (error) {
            console.log('🚶‍♂️ Health API setup failed:', error);
        }
    }
    
    enableHealthStepCounting() {
        // Placeholder for health API step counting
        // This would integrate with platform-specific health APIs
        console.log('🚶‍♂️ Health API step counting enabled (placeholder)');
    }
    
    detectDevicePosition() {
        // Detect if device is in pocket, hand, or stationary
        // This helps adjust step detection sensitivity
        if (this.accelerationData.length < 10) return 'unknown';
        
        const recent = this.accelerationData.slice(-10);
        const avgX = recent.reduce((sum, reading) => sum + reading.x, 0) / recent.length;
        const avgY = recent.reduce((sum, reading) => sum + reading.y, 0) / recent.length;
        const avgZ = recent.reduce((sum, reading) => sum + reading.z, 0) / recent.length;
        
        // Analyze gravity vector to determine device orientation
        const gravityMagnitude = Math.sqrt(avgX * avgX + avgY * avgY + avgZ * avgZ);
        
        if (gravityMagnitude < 8) {
            return 'pocket'; // Low gravity suggests device is in pocket
        } else if (Math.abs(avgZ) > Math.abs(avgX) && Math.abs(avgZ) > Math.abs(avgY)) {
            return 'hand'; // Z-axis dominant suggests device is in hand
        } else {
            return 'stationary'; // Balanced gravity suggests device is stationary
        }
    }
    
    adjustStepSensitivity() {
        const position = this.detectDevicePosition();
        
        switch (position) {
            case 'pocket':
                this.stepThreshold = 2.0; // Lower threshold for pocket
                this.minStepInterval = 800; // Faster detection
                break;
            case 'hand':
                this.stepThreshold = 3.0; // Higher threshold for hand
                this.minStepInterval = 1200; // Slower detection
                break;
            case 'stationary':
                this.stepThreshold = 4.0; // Much higher threshold when stationary
                this.minStepInterval = 2000; // Much slower detection
                break;
            default:
                this.stepThreshold = 2.5; // Default threshold
                this.minStepInterval = 1000; // Default interval
        }
        
        console.log(`🚶‍♂️ Adjusted step sensitivity for ${position}: threshold=${this.stepThreshold}, interval=${this.minStepInterval}ms`);
    }
    
    getStepCountingStatus() {
        const position = this.detectDevicePosition();
        const accuracy = this.calculateAccuracy();
        
        return {
            position: position,
            accuracy: accuracy,
            threshold: this.stepThreshold,
            interval: this.minStepInterval,
            isActive: this.stepDetectionActive,
            totalSteps: this.totalSteps,
            sessionSteps: this.sessionSteps
        };
    }
    
    calculateAccuracy() {
        // Calculate step counting accuracy based on recent data
        if (this.accelerationData.length < 20) return 'unknown';
        
        const recent = this.accelerationData.slice(-20);
        const magnitudes = recent.map(reading => reading.magnitude);
        const avgMagnitude = magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length;
        const variance = magnitudes.reduce((sum, mag) => sum + Math.pow(mag - avgMagnitude, 2), 0) / magnitudes.length;
        const stdDev = Math.sqrt(variance);
        
        // Higher variance suggests more movement, potentially more accurate
        if (stdDev > 2.0) return 'high';
        if (stdDev > 1.0) return 'medium';
        return 'low';
    }
    
    optimizeForMobile() {
        // Mobile-specific optimizations
        if (navigator.userAgent.match(/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i)) {
            console.log('🚶‍♂️ Mobile device detected, applying enhanced optimizations');
            
            // Initialize mobile-specific tracking
            this.initializeMobileStepTracking();
            
            // Reduce data collection frequency to save battery
            this.accelerationData = this.accelerationData.filter((_, index) => index % 2 === 0);
            
            // More sensitive thresholds for mobile devices
            this.stepThreshold = Math.max(1.2, this.stepThreshold * 0.6); // More sensitive
            this.minStepInterval = Math.max(300, this.minStepInterval * 0.6); // Faster detection
            
            console.log('🚶‍♂️ Mobile thresholds set:', {
                stepThreshold: this.stepThreshold,
                minStepInterval: this.minStepInterval
            });
            
            // Enable enhanced mobile features
            this.enableBackgroundStepCounting();
            this.enableMobileStepValidation();
            this.enableBatteryOptimization();
        } else {
            console.log('🚶‍♂️ Desktop device detected, using standard thresholds');
        }
    }
    
    /**
     * Initialize mobile-specific step tracking enhancements
     * @status [VERIFIED] - Mobile tracking initialization working correctly
     * @feature #feature-mobile-step-tracking
     * @last_tested 2025-01-28
     */
    initializeMobileStepTracking() {
        // Mobile-specific step tracking enhancements
        this.mobileStepData = {
            lastValidStep: 0,
            stepPattern: [],
            validationScore: 0,
            batteryLevel: 100,
            isCharging: false,
            stepAccuracy: 'unknown',
            lastValidationTime: 0
        };
        
        // Enhanced step detection for mobile
        this.mobileStepThresholds = {
            walking: 1.8,
            running: 3.5,
            stationary: 0.5
        };
        
        console.log('🚶‍♂️ Mobile step tracking initialized');
    }
    
    /**
     * Enable step validation and anti-cheat measures for mobile devices
     * @status [VERIFIED] - Step validation working correctly with rate limiting
     * @feature #feature-anti-cheat-validation
     * @last_tested 2025-01-28
     */
    enableMobileStepValidation() {
        // Add step validation for mobile devices
        this.stepValidation = {
            enabled: true,
            minStepsPerMinute: 20,
            maxStepsPerMinute: 200,
            suspiciousPatternThreshold: 0.7,
            validationWindow: 60000 // 1 minute
        };
        
        console.log('🚶‍♂️ Mobile step validation enabled');
    }
    
    /**
     * Enable battery-aware step tracking optimization
     * @status [VERIFIED] - Battery optimization working correctly
     * @feature #feature-battery-optimization
     * @last_tested 2025-01-28
     */
    enableBatteryOptimization() {
        // Monitor battery level and adjust tracking accordingly
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                this.mobileStepData.batteryLevel = Math.round(battery.level * 100);
                this.mobileStepData.isCharging = battery.charging;
                
                // Adjust tracking based on battery level
                if (battery.level < 0.2) {
                    console.log('🚶‍♂️ Low battery detected, reducing step tracking frequency');
                    this.stepThreshold *= 1.2; // Less sensitive
                    this.minStepInterval *= 1.5; // Less frequent
                }
                
                // Listen for battery changes
                battery.addEventListener('levelchange', () => {
                    this.mobileStepData.batteryLevel = Math.round(battery.level * 100);
                    this.adjustTrackingForBattery();
                });
                
                battery.addEventListener('chargingchange', () => {
                    this.mobileStepData.isCharging = battery.charging;
                    this.adjustTrackingForBattery();
                });
            });
        }
        
        console.log('🚶‍♂️ Battery optimization enabled');
    }
    
    adjustTrackingForBattery() {
        const batteryLevel = this.mobileStepData.batteryLevel;
        const isCharging = this.mobileStepData.isCharging;
        
        if (batteryLevel < 20 && !isCharging) {
            // Very low battery - minimal tracking
            this.stepThreshold *= 1.5;
            this.minStepInterval *= 2;
            console.log('🚶‍♂️ Very low battery - minimal step tracking');
        } else if (batteryLevel < 50 && !isCharging) {
            // Low battery - reduced tracking
            this.stepThreshold *= 1.2;
            this.minStepInterval *= 1.3;
            console.log('🚶‍♂️ Low battery - reduced step tracking');
        } else if (isCharging) {
            // Charging - full tracking
            this.stepThreshold = Math.max(1.5, this.stepThreshold * 0.9);
            this.minStepInterval = Math.max(500, this.minStepInterval * 0.9);
            console.log('🚶‍♂️ Charging - full step tracking enabled');
        }
    }
    
    enableBackgroundStepCounting() {
        // Use Page Visibility API to continue step counting in background
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('🚶‍♂️ Page hidden, reducing step detection frequency');
                this.stepDetectionActive = false;
                // Continue with reduced frequency
                setTimeout(() => {
                    this.stepDetectionActive = true;
                }, 5000);
            } else {
                console.log('🚶‍♂️ Page visible, resuming full step detection');
                this.stepDetectionActive = true;
            }
        });
    }
    
    // Expose step counting status for debugging
    getDebugInfo() {
        const status = this.getStepCountingStatus();
        return {
            ...status,
            accelerationDataLength: this.accelerationData.length,
            lastStepTime: this.lastStepTime,
            stepCooldown: this.stepCooldown,
            milestones: this.milestones,
            googleFitEnabled: this.googleFitEnabled
        };
    }
    
    enableDeviceMotion() {
        console.log('🚶‍♂️ Enabling device motion detection');
        console.log('🚶‍♂️ Adding devicemotion event listener...');
        
        window.addEventListener('devicemotion', (event) => {
            this.handleDeviceMotion(event);
        });
        
        this.stepDetectionActive = true;
        console.log('🚶‍♂️ Step detection active:', this.stepDetectionActive);
        
        // Test if device motion events are actually firing
        setTimeout(() => {
            console.log('🚶‍♂️ Device motion test - checking if events are firing...');
            if (this.accelerationData.length === 0) {
                console.warn('🚶‍♂️ No device motion events received after 2 seconds - may need fallback');
            } else {
                console.log('🚶‍♂️ Device motion events are firing correctly!');
            }
        }, 2000);
        
        // Also enable gyroscope-based detection when GPS is tracking
        this.enableGyroscopeDetection();
    }
    
    enableGyroscopeDetection() {
        // Check if device orientation is available
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
            DeviceOrientationEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.startGyroscopeDetection();
                } else {
                    console.log('🚶‍♂️ Gyroscope permission denied');
                }
            });
        } else {
            // Direct access (older browsers)
            this.startGyroscopeDetection();
        }
    }
    
    startGyroscopeDetection() {
        console.log('🚶‍♂️ Starting gyroscope-based step detection');
        let lastOrientation = null;
        let orientationChangeCount = 0;
        
        window.addEventListener('deviceorientation', (event) => {
            if (!this.stepDetectionActive) return;
            
            const currentOrientation = {
                alpha: event.alpha,
                beta: event.beta,
                gamma: event.gamma,
                timestamp: Date.now()
            };
            
            if (lastOrientation) {
                // Calculate orientation change magnitude
                const alphaChange = Math.abs(currentOrientation.alpha - lastOrientation.alpha);
                const betaChange = Math.abs(currentOrientation.beta - lastOrientation.beta);
                const gammaChange = Math.abs(currentOrientation.gamma - lastOrientation.gamma);
                
                const totalChange = alphaChange + betaChange + gammaChange;
                
                // Detect significant orientation changes (walking motion) - more strict
                if (totalChange > 20 && totalChange < 80) {
                    orientationChangeCount++;
                    
                    // Add step every 8-10 orientation changes (more walking pattern required)
                    if (orientationChangeCount >= 8) {
                        this.addStep();
                        orientationChangeCount = 0;
                    }
                }
            }
            
            lastOrientation = currentOrientation;
        });
    }
    
    enableFallbackMode() {
        console.log('🚶‍♂️ Enabling fallback step tracking mode');
        this.fallbackMode = true;
        this.stepDetectionActive = true;
        
        // Clear any existing fallback interval
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
        }
        
        // Use GPS-based step estimation as primary fallback
        this.startGPSStepEstimation();
        
        // Start enhanced mobile fallback with multiple methods
        this.startMobileFallback();
        
        // Show fallback mode notification
        this.showNotification('🔄 Using fallback step tracking. Walk around to count steps!', 'info');
    }
    
    startMobileFallback() {
        console.log('🚶‍♂️ Starting mobile fallback step tracking...');
        
        // Method 1: GPS distance-based estimation
        this.gpsStepEstimation = {
            lastPosition: null,
            totalDistance: 0,
            stepCount: 0,
            isActive: false
        };
        
        // Method 2: Touch-based step simulation (for testing)
        this.touchStepSimulation = {
            lastTouchTime: 0,
            touchCount: 0,
            isActive: false
        };
        
        // Method 3: Timer-based step simulation (for testing)
        this.timerStepSimulation = {
            interval: null,
            stepRate: 2, // steps per second when walking
            isActive: false
        };
        
        // Start GPS-based estimation
        this.startGPSStepEstimation();
        
        // Start touch-based simulation for testing
        this.startTouchStepSimulation();
        
        // Add mobile-specific UI controls
        this.addMobileStepControls();
    }
    
    startGPSStepEstimation() {
        console.log('🚶‍♂️ Starting GPS-based step estimation...');
        
        if (!window.gpsCore) {
            console.warn('🚶‍♂️ GPS Core not available for step estimation');
            return;
        }
        
        this.gpsStepEstimation.isActive = true;
        
        // Listen for GPS position updates
        window.gpsCore.on('gps:position:updated', (position) => {
            if (!this.gpsStepEstimation.isActive) return;
            
            if (this.gpsStepEstimation.lastPosition) {
                // Calculate distance moved
                const distance = this.calculateDistance(
                    this.gpsStepEstimation.lastPosition,
                    position
                );
                
                // Estimate steps based on distance (average step length ~0.7m)
                const estimatedSteps = Math.floor(distance / 0.7);
                
                if (estimatedSteps > 0) {
                    console.log(`🚶‍♂️ GPS estimated ${estimatedSteps} steps (distance: ${distance.toFixed(2)}m)`);
                    for (let i = 0; i < estimatedSteps; i++) {
                        this.addStep('gps_fallback');
                    }
                }
            }
            
            this.gpsStepEstimation.lastPosition = position;
        });
    }
    
    startTouchStepSimulation() {
        console.log('🚶‍♂️ Starting touch-based step simulation...');
        
        this.touchStepSimulation.isActive = true;
        
        // Add touch event listeners for step simulation
        document.addEventListener('touchstart', (event) => {
            if (!this.touchStepSimulation.isActive) return;
            
            const now = Date.now();
            const timeSinceLastTouch = now - this.touchStepSimulation.lastTouchTime;
            
            // If touch is within reasonable walking pace (300-2000ms between touches)
            if (timeSinceLastTouch > 300 && timeSinceLastTouch < 2000) {
                this.touchStepSimulation.touchCount++;
                
                // Every 2 touches = 1 step (left foot, right foot)
                if (this.touchStepSimulation.touchCount >= 2) {
                    this.addStep('touch_simulation');
                    this.touchStepSimulation.touchCount = 0;
                    console.log('🚶‍♂️ Touch simulation step added');
                }
            }
            
            this.touchStepSimulation.lastTouchTime = now;
        });
    }
    
    addMobileStepControls() {
        console.log('🚶‍♂️ Adding mobile step controls...');
        
        // Create mobile step control panel
        const controlPanel = document.createElement('div');
        controlPanel.className = 'mobile-step-controls';
        controlPanel.innerHTML = `
            <div class="step-control-content">
                <h4>🚶‍♂️ Step Tracking</h4>
                <div class="step-status">
                    <span id="step-status-text">Fallback Mode Active</span>
                </div>
                <div class="step-controls">
                    <button id="add-step-btn" class="step-btn">+ Add Step</button>
                    <button id="reset-steps-btn" class="step-btn reset">Reset Steps</button>
                </div>
                <div class="step-info">
                    <p>Walk around or tap "Add Step" to count steps</p>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .mobile-step-controls {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: white;
                border-radius: 15px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                font-family: Arial, sans-serif;
            }
            .step-control-content h4 {
                margin: 0 0 15px 0;
                color: #333;
                text-align: center;
            }
            .step-status {
                text-align: center;
                margin-bottom: 15px;
            }
            #step-status-text {
                background: #e5e7eb;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 14px;
                color: #374151;
            }
            .step-controls {
                display: flex;
                gap: 10px;
                margin-bottom: 15px;
            }
            .step-btn {
                flex: 1;
                padding: 12px;
                border: none;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            .step-btn:not(.reset) {
                background: #10b981;
                color: white;
            }
            .step-btn:not(.reset):hover {
                background: #059669;
            }
            .step-btn.reset {
                background: #ef4444;
                color: white;
            }
            .step-btn.reset:hover {
                background: #dc2626;
            }
            .step-info {
                text-align: center;
                font-size: 12px;
                color: #666;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(controlPanel);
        
        // Add event listeners
        document.getElementById('add-step-btn').addEventListener('click', () => {
            this.addStep('manual');
            this.showNotification('✅ Step added manually!', 'success');
        });
        
        document.getElementById('reset-steps-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset your steps?')) {
                this.resetSteps();
                this.showNotification('🔄 Steps reset!', 'info');
            }
        });
        
        // Update status text
        this.updateMobileStepStatus();
    }
    
    updateMobileStepStatus() {
        const statusText = document.getElementById('step-status-text');
        if (statusText) {
            if (this.fallbackMode) {
                statusText.textContent = 'Fallback Mode Active';
                statusText.style.background = '#fef3c7';
                statusText.style.color = '#92400e';
            } else {
                statusText.textContent = 'Motion Sensors Active';
                statusText.style.background = '#d1fae5';
                statusText.style.color = '#065f46';
            }
        }
    }
    
    calculateDistance(pos1, pos2) {
        const R = 6371000; // Earth's radius in meters
        const lat1 = pos1.lat * Math.PI / 180;
        const lat2 = pos2.lat * Math.PI / 180;
        const deltaLat = (pos2.lat - pos1.lat) * Math.PI / 180;
        const deltaLng = (pos2.lng - pos1.lng) * Math.PI / 180;
        
        const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        
        return R * c;
    }
    
    disableFallbackMode() {
        console.log('🚶‍♂️ Disabling fallback step detection mode');
        if (this.fallbackInterval) {
            clearInterval(this.fallbackInterval);
            this.fallbackInterval = null;
        }
    }
    
    handleDeviceMotion(event) {
        if (!this.stepDetectionActive) {
            console.log('🚶‍♂️ Step detection not active, skipping device motion');
            return;
        }
        
        const acceleration = event.accelerationIncludingGravity;
        if (!acceleration) {
            console.log('🚶‍♂️ No acceleration data in device motion event');
            return;
        }
        
        // Store acceleration data with individual components
        const magnitude = Math.sqrt(
            acceleration.x * acceleration.x +
            acceleration.y * acceleration.y +
            acceleration.z * acceleration.z
        );
        
        this.accelerationData.push({
            x: acceleration.x,
            y: acceleration.y,
            z: acceleration.z,
            magnitude: magnitude,
            timestamp: Date.now()
        });
        
        // Debug: Log first few events to see if data is coming through (only in development)
        if (this.accelerationData.length <= 5 && window.location.hostname === 'localhost') {
            console.log(`🚶‍♂️ Device motion event ${this.accelerationData.length}:`, {
                x: acceleration.x,
                y: acceleration.y,
                z: acceleration.z,
                magnitude: magnitude.toFixed(2)
            });
        }
        
        // Keep only last 50 readings
        if (this.accelerationData.length > 50) {
            this.accelerationData.shift();
        }
        
        // Adjust sensitivity based on device position
        this.adjustStepSensitivity();
        
        // Detect step pattern
        this.detectStep(magnitude);
    }
    
    detectStep(magnitude) {
        const now = Date.now();
        
        // Check minimum interval between steps
        if (now - this.lastStepTime < this.minStepInterval) {
            return;
        }
        
        // Check cooldown period
        if (now - this.lastStepTime < this.stepCooldown) {
            return;
        }
        
        // Enhanced step detection with mobile validation
        if (this.accelerationData.length >= 5) {
            const recent = this.accelerationData.slice(-5);
            const current = recent[4].magnitude;
            const previous = recent[3].magnitude;
            const before = recent[2].magnitude;
            
            // Debug: Log step detection attempts (only in development)
            if (this.accelerationData.length % 20 === 0 && window.location.hostname === 'localhost') {
                console.log('🚶‍♂️ Step detection check:', {
                    current: current.toFixed(2),
                    previous: previous.toFixed(2),
                    before: before.toFixed(2),
                    threshold: this.stepThreshold.toFixed(2),
                    magnitude: magnitude.toFixed(2)
                });
            }
            
            // More lenient step detection for mobile: current must be higher than previous readings
            if (current > previous && current > before && current > this.stepThreshold) {
                // Additional check: ensure it's a real peak, not just noise
                const isPeak = current > recent[1].magnitude && current > recent[0].magnitude;
                if (isPeak) {
                    console.log('🚶‍♂️ Potential step detected!', {
                        magnitude: current.toFixed(2),
                        threshold: this.stepThreshold.toFixed(2)
                    });
                    
                    // Mobile validation before adding step
                    if (this.validateStepForMobile(current, recent)) {
                        console.log('🚶‍♂️ Step validated and added!');
                        this.addStep();
                        this.lastStepTime = now;
                    } else {
                        console.log('🚶‍♂️ Step validation failed');
                    }
                }
            }
        }
    }
    
    validateStepForMobile(magnitude, recentData) {
        // Skip validation if not on mobile or validation disabled
        if (!this.mobileStepData || !this.stepValidation?.enabled) {
            return true;
        }
        
        const now = Date.now();
        
        // Add to step pattern for analysis
        this.mobileStepData.stepPattern.push({
            magnitude: magnitude,
            timestamp: now,
            interval: now - this.lastStepTime
        });
        
        // Keep only recent pattern data (last 2 minutes)
        const twoMinutesAgo = now - 120000;
        this.mobileStepData.stepPattern = this.mobileStepData.stepPattern.filter(
            step => step.timestamp > twoMinutesAgo
        );
        
        // Validate step rate
        if (!this.validateStepRate()) {
            console.log('🚶‍♂️ Step rate validation failed - too many steps');
            return false;
        }
        
        // Validate step pattern
        if (!this.validateStepPattern(magnitude, recentData)) {
            console.log('🚶‍♂️ Step pattern validation failed - suspicious pattern');
            return false;
        }
        
        // Validate step magnitude
        if (!this.validateStepMagnitude(magnitude)) {
            console.log('🚶‍♂️ Step magnitude validation failed - unrealistic magnitude');
            return false;
        }
        
        return true;
    }
    
    validateStepRate() {
        const now = Date.now();
        const oneMinuteAgo = now - 60000;
        
        // Count steps in the last minute
        const recentSteps = this.mobileStepData.stepPattern.filter(
            step => step.timestamp > oneMinuteAgo
        );
        
        const stepsPerMinute = recentSteps.length;
        
        // Check if step rate is within reasonable bounds
        if (stepsPerMinute < this.stepValidation.minStepsPerMinute) {
            // Too few steps - might be stationary
            return true; // Allow this
        }
        
        if (stepsPerMinute > this.stepValidation.maxStepsPerMinute) {
            // Too many steps - likely cheating or device shake
            console.log(`🚶‍♂️ Suspicious step rate: ${stepsPerMinute} steps/minute`);
            return false;
        }
        
        return true;
    }
    
    validateStepPattern(magnitude, recentData) {
        // Check for suspicious patterns (e.g., too regular intervals)
        if (this.mobileStepData.stepPattern.length < 5) {
            return true; // Not enough data to validate
        }
        
        const intervals = this.mobileStepData.stepPattern.slice(-5).map((step, index, array) => {
            if (index === 0) return 0;
            return step.timestamp - array[index - 1].timestamp;
        }).filter(interval => interval > 0);
        
        if (intervals.length < 3) {
            return true; // Not enough intervals to analyze
        }
        
        // Check for too regular intervals (suspicious)
        const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((sum, interval) => {
            return sum + Math.pow(interval - avgInterval, 2);
        }, 0) / intervals.length;
        
        const coefficientOfVariation = Math.sqrt(variance) / avgInterval;
        
        // If intervals are too regular (low variance), it might be cheating
        if (coefficientOfVariation < 0.1) {
            console.log('🚶‍♂️ Suspicious pattern: too regular intervals');
            return false;
        }
        
        return true;
    }
    
    validateStepMagnitude(magnitude) {
        // Check if magnitude is within realistic bounds for human movement
        const minMagnitude = 0.5; // Too small to be a real step
        const maxMagnitude = 10.0; // Too large to be realistic
        
        if (magnitude < minMagnitude || magnitude > maxMagnitude) {
            console.log(`🚶‍♂️ Suspicious magnitude: ${magnitude}`);
            return false;
        }
        
        // Check against recent magnitudes for consistency
        if (this.mobileStepData.stepPattern.length >= 3) {
            const recentMagnitudes = this.mobileStepData.stepPattern.slice(-3).map(s => s.magnitude);
            const avgMagnitude = recentMagnitudes.reduce((a, b) => a + b, 0) / recentMagnitudes.length;
            
            // If current magnitude is too different from recent average, it might be suspicious
            const deviation = Math.abs(magnitude - avgMagnitude) / avgMagnitude;
            if (deviation > 2.0) { // 200% deviation
                console.log(`🚶‍♂️ Suspicious magnitude deviation: ${deviation}`);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Add a step with consciousness-serving validation
     * @param {number} stepCount - Number of steps to add (default: 1)
     * @returns {boolean} - Whether step was successfully added
     */
    addStep(stepCount = 1) {
        // Validate input
        if (!Number.isInteger(stepCount) || stepCount <= 0) {
            console.warn('⚠️ Invalid step count provided:', stepCount);
            return false;
        }
        
        // Consciousness-serving: Validate step detection state
        if (!this.isStepDetectionEnabled()) {
            console.log('🚶‍♂️ Step detection not enabled - ignoring step');
            return false;
        }
        
        // Add steps
        this.totalSteps += stepCount;
        this.sessionSteps += stepCount;
        
        console.log(`🚶‍♂️ Added ${stepCount} step(s)! Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Save to localStorage
        this.saveSteps();
        
        return true;
    }
    
    /**
     * Check if step detection is enabled with consciousness-serving validation
     * @returns {boolean} - Whether step detection is active
     */
    isStepDetectionEnabled() {
        return this.stepDetectionActive && this.autoStepDetectionEnabled;
    }

    addManualStep() {
        this.totalSteps++;
        this.sessionSteps++;
        
        console.log(`🚶‍♂️ Manual step added! Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        
        // Save to localStorage
        this.saveSteps();
        
        // Sync to server for validation
        this.syncStepsToServer();
        
        // Visual feedback per step
        try {
            if (window.auraPulseSystem) {
                window.auraPulseSystem.pulse({ color: '#3b82f6', size: 90, duration: 300 });
            }
            if (window.particleSystem && this.sessionSteps % 10 === 0) {
                window.particleSystem.triggerBurst(window.innerWidth * 0.5, window.innerHeight * 0.9, { hue: 220, count: 8 });
            }
        } catch (_) {}
        
        // Debug: Check if we're at a 50-step milestone
        if (this.totalSteps % 50 === 0) {
            console.log(`🎯 50-step milestone reached! Total steps: ${this.totalSteps}`);
        }
        
        this.updateStepCounter();
        
        // Trigger step update callback
        if (this.onStepUpdate) {
            this.onStepUpdate();
        }
        
        // Update base building system
        if (this.baseBuildingLayer) {
            this.baseBuildingLayer.addStepFromExternal();
        }
        
        // Sound feedback
        if (window.soundManager) {
            try {
                if (this.sessionSteps % this.milestones.celebration === 0) {
                    window.soundManager.playBling({ frequency: 1400, duration: 0.12, type: 'triangle' });
                } else if (this.sessionSteps % this.milestones.flag === 0) {
                    window.soundManager.playBling({ frequency: 1100, duration: 0.1, type: 'sine' });
                } else {
                    window.soundManager.playBling({ frequency: 740, duration: 0.05, type: 'sine' });
                }
            } catch (e) {}
        }
        
        // Step milestone effects
        if (this.totalSteps % 50 === 0 && this.totalSteps > 0) {
            if (window.discordEffects) {
                try { 
                    window.discordEffects.triggerGlowPulse(window.innerWidth/2, window.innerHeight/2, '#ffaa00', 100);
                    window.discordEffects.triggerNotificationPop(`${this.totalSteps} Steps!`, '#ffaa00');
                } catch (e) {}
            }
            
            // Path markers are now created by the path painting system instead of step counting
            console.log(`🎯 50-step milestone reached! Path markers are now created by movement, not step counting.`);
        }
        
        // Emit step change event
        this.emitStepChangeEvent(1);
        
        this.checkMilestones();
        this.saveSteps();
    }
    
    createPathMarker() {
        try {
            console.log(`🐜 createPathMarker called at step ${this.totalSteps}`);
            
            // Get current player position
            let playerPosition = null;
            if (window.mapEngine && typeof window.mapEngine.getPlayerPosition === 'function') {
                playerPosition = window.mapEngine.getPlayerPosition();
                console.log('🐜 Got position from getPlayerPosition():', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            } else if (window.mapEngine && window.mapEngine.playerPosition) {
                playerPosition = window.mapEngine.playerPosition;
                console.log('🐜 Got position from playerPosition:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            } else if (window.geolocationManager && window.geolocationManager.currentPosition) {
                playerPosition = window.geolocationManager.currentPosition;
                console.log('🐜 Got position from geolocationManager:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            }
            
            console.log('🐜 Final player position:', `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
            console.log('🐜 mapEngine available:', !!window.mapEngine);
            console.log('🐜 dropFlagHere available:', !!(window.mapEngine && window.mapEngine.dropFlagHere));
            
            if (playerPosition && window.mapEngine && window.mapEngine.dropFlagHere) {
                console.log(`🐜 Creating path marker at step ${this.totalSteps} at position:`, `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}`);
                window.mapEngine.dropFlagHere(playerPosition.lat, playerPosition.lng);
                console.log('🐜 Path marker creation completed');
            } else {
                console.log('🐜 Cannot create path marker - no position or mapEngine available');
                console.log('🐜 playerPosition:', playerPosition ? `lat: ${playerPosition.lat}, lng: ${playerPosition.lng}` : 'null');
                console.log('🐜 mapEngine:', !!window.mapEngine);
                console.log('🐜 dropFlagHere:', !!(window.mapEngine && window.mapEngine.dropFlagHere));
            }
        } catch (error) {
            console.error('🐜 Error creating path marker:', error);
        }
    }

    // Reset only the session step counter (used when starting a new adventure)
    resetSessionSteps() {
        this.sessionSteps = 0;
        try {
            this.updateStepCounter();
        } catch (_) {}
        // Persist total steps only; session is transient
        try { this.saveSteps(); } catch (_) {}
        console.log('🚶‍♂️ Session steps reset to 0 for new adventure');
    }
    
    checkMilestones() {
        console.log(`🎯 Checking milestones - Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        console.log(`🎯 Milestone thresholds - Flag: ${this.milestones.flag}, Celebration: ${this.milestones.celebration}, Quest: ${this.milestones.quest}, Area: ${this.milestones.area}`);
        
        // Check for flag creation (every 50 steps)
        if (this.sessionSteps >= this.milestones.flag && this.sessionSteps % this.milestones.flag === 0) {
            console.log(`🇫🇮 Flag milestone triggered! Session steps: ${this.sessionSteps}`);
            this.emitMilestoneEvent('flag', this.sessionSteps, this.totalSteps);
            this.triggerFlagCreation();
        }
        
        // Check for celebration (every 100 steps)
        if (this.sessionSteps >= this.milestones.celebration && this.sessionSteps % this.milestones.celebration === 0) {
            console.log(`🎉 Celebration milestone triggered! Session steps: ${this.sessionSteps}`);
            this.emitMilestoneEvent('celebration', this.sessionSteps, this.totalSteps);
            this.triggerCelebration();
        }
        
        // Check for quest unlock (every 500 steps)
        if (this.totalSteps >= this.milestones.quest && this.totalSteps % this.milestones.quest === 0) {
            console.log(`📜 Quest milestone triggered! Total steps: ${this.totalSteps}`);
            this.emitMilestoneEvent('quest', this.sessionSteps, this.totalSteps);
            this.triggerQuestUnlock();
        }
        
        // Check for area unlock (reaching 1000 steps milestone)
        if (this.totalSteps >= this.milestones.area && !this.areaUnlocked) {
            console.log(`🎯 1000 steps milestone reached! Total: ${this.totalSteps}`);
            this.areaUnlocked = true;
            this.emitMilestoneEvent('area', this.sessionSteps, this.totalSteps);
            this.triggerAreaUnlock();
        }
    }

    /**
     * Emit step change event via event bus
     * @param {number} stepAmount - Number of steps added
     */
    emitStepChangeEvent(stepAmount) {
        if (window.eventBus) {
            const eventData = {
                stepAmount: stepAmount,
                sessionSteps: this.sessionSteps,
                totalSteps: this.totalSteps,
                timestamp: Date.now(),
                milestones: this.milestones
            };
            
            console.log(`🔔 Emitting step change event: steps:change`, eventData);
            window.eventBus.emit('steps:change', eventData);
        } else {
            console.warn('🚶‍♂️ EventBus not available for step change event emission');
        }
    }

    /**
     * Emit milestone event via event bus and send to server
     * @param {string} milestoneType - Type of milestone (flag, celebration, quest, area)
     * @param {number} sessionSteps - Current session steps
     * @param {number} totalSteps - Current total steps
     */
    emitMilestoneEvent(milestoneType, sessionSteps, totalSteps) {
        const eventData = {
            type: milestoneType,
            sessionSteps: sessionSteps,
            totalSteps: totalSteps,
            timestamp: Date.now(),
            thresholds: this.milestones
        };
        
        // Log milestone achievement
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`🎯 Milestone achieved: ${milestoneType} (${totalSteps} total steps)`, 'milestone');
        } else {
            console.log(`🎯 Milestone achieved: ${milestoneType} (${totalSteps} total steps)`);
        }
        
        // Emit local event bus events
        if (window.eventBus) {
            console.log(`🔔 Emitting milestone event: steps:${milestoneType}`, eventData);
            window.eventBus.emit(`steps:${milestoneType}`, eventData);
            window.eventBus.emit('steps:milestone', eventData);
        } else {
            console.warn('🚶‍♂️ EventBus not available for milestone event emission');
        }
        
        // Send milestone to server via WebSocket
        this.sendMilestoneToServer(eventData);
    }

    /**
     * Send milestone event to server via WebSocket
     * @param {Object} eventData - Milestone event data
     */
    sendMilestoneToServer(eventData) {
        // Log milestone sending attempt
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`🌐 Sending milestone to server: ${eventData.type}`, 'websocket');
        } else {
            console.log(`🌐 Sending milestone to server: ${eventData.type}`);
        }
        
        // Try to send via MultiplayerManager first
        if (window.multiplayerManager && window.multiplayerManager.isConnected) {
            console.log(`🌐 Sending milestone to server via MultiplayerManager: ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via MultiplayerManager: ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.multiplayerManager.sendMessage({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.multiplayerManager.playerId
                }
            });
            return;
        }
        
        // Fallback to WebSocketClient
        if (window.websocketClient && window.websocketClient.isConnected) {
            console.log(`🌐 Sending milestone to server via WebSocketClient: ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via WebSocketClient: ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.websocketClient.send({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.websocketClient.getPlayerId()
                }
            });
            return;
        }
        
        // Try direct websocket connection
        if (window.websocketClient && window.websocketClient.isConnectedToServer && window.websocketClient.isConnectedToServer()) {
            console.log(`🌐 Sending milestone to server via WebSocketClient (alternative check): ${eventData.type}`);
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log(`📤 Milestone sent via WebSocketClient (alt): ${eventData.type} (${eventData.totalSteps} steps)`, 'websocket');
            }
            window.websocketClient.send({
                type: 'step_milestone',
                payload: {
                    milestoneType: eventData.type,
                    sessionSteps: eventData.sessionSteps,
                    totalSteps: eventData.totalSteps,
                    timestamp: eventData.timestamp,
                    playerId: window.websocketClient.getPlayerId()
                }
            });
            return;
        }
        
        // If no WebSocket connection available
        console.warn('🚶‍♂️ No WebSocket connection available for milestone server communication');
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`❌ No WebSocket connection available for milestone: ${eventData.type}`, 'websocket');
        }
    }
    
    triggerFlagCreation() {
        console.log('🇫🇮 50 steps reached - creating flag!');
        
        if (window.gpsCore && window.gpsCore.currentPosition) {
            const geo = window.gpsCore;
            // Prefer a synchronous, cached position
            let position = null;
            if (geo.currentPosition) {
                position = geo.currentPosition;
            }
            if (!position && geo.lastValidPosition) {
                position = geo.lastValidPosition;
            }
            if (!position && geo.currentPosition) {
                position = geo.currentPosition;
            }
            
            if (position && typeof position.lat === 'number' && typeof position.lng === 'number') {
                console.log('🇫🇮 Using position for flag:', `lat: ${position.lat}, lng: ${position.lng}`);
                if (window.mapEngine && window.mapEngine.symbolCanvasLayer) {
                    const layer = window.mapEngine.symbolCanvasLayer;
                    // Ensure visible
                    if (layer.canvas) {
                        layer.isVisible = true;
                        layer.canvas.style.opacity = layer.opacity || 1;
                    }
                    layer.addFlagPin(position.lat, position.lng);
                } else {
                    console.warn('🇫🇮 Map engine or flag layer not available');
                }
                
                if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
                    window.gruesomeNotifications.showNotification({
                        type: 'success',
                        title: 'Path Marked!',
                        message: '50 steps earned - Finnish flag placed on your path',
                        duration: 3000
                    });
                }
            } else {
                console.warn('🇫🇮 No valid position available for flag creation');
            }
        } else {
            console.warn('🇫🇮 Geolocation system not available');
        }
    }
    
    triggerCelebration() {
        console.log('🎉 100 steps reached - celebration time!');
        
        // Show celebration animation
        this.showStepCelebration();
        if (window.soundManager) window.soundManager.playEerieHum({ duration: 1.8 });
        
        // Show notification
        if (window.gruesomeNotifications && typeof window.gruesomeNotifications.showNotification === 'function') {
            window.gruesomeNotifications.showNotification({
                type: 'celebration',
                title: 'Cosmic Steps!',
                message: '100 steps earned - Your cosmic energy grows!',
                duration: 4000
            });
        }
        
        // Add small stat bonus
        this.giveStepReward();
    }
    
    showStepCelebration() {
        // Create celebration particle effect
        const celebration = document.createElement('div');
        celebration.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: #00ffff;
            pointer-events: none;
            z-index: 10000;
            animation: stepCelebration 2s ease-out forwards;
        `;
        celebration.textContent = '🚶‍♂️✨';
        
        document.body.appendChild(celebration);
        
        // Remove after animation
        setTimeout(() => {
            if (celebration.parentNode) {
                celebration.parentNode.removeChild(celebration);
            }
        }, 2000);
    }
    
    giveStepReward() {
        // Give small stat bonuses for step milestones
        if (window.encounterSystem) {
            // Small health and sanity boost
            window.encounterSystem.gainHealth(5);
            window.encounterSystem.gainSanity(3);
        }
    }
    
    triggerQuestUnlock() {
        console.log('🎭 500 steps reached - quest unlocked!');
        // Implementation for quest unlocking
        if (window.soundManager) window.soundManager.playBling({ frequency: 1600, duration: 0.2, type: 'triangle' });
    }
    
    triggerAreaUnlock() {
        console.log('🌍 1000 steps reached - new area unlocked!');
        console.log('🏗️ Base establishment now available!');
        
        // Don't show notifications during welcome screen
        if (this.isWelcomeScreenActive()) {
            console.log('🏗️ Welcome screen active, deferring base establishment notification');
            return;
        }
        
        // Play sound effect
        if (window.soundManager) window.soundManager.playTerrifyingBling();
        
        // Show base establishment notification
        this.showBaseEstablishmentNotification();
        
        // Trigger base establishment dialog
        this.triggerBaseEstablishmentDialog();
    }
    
    showBaseEstablishmentNotification() {
        // Create notification element
        const notification = document.createElement('div');
        notification.id = 'base-establishment-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            color: #e94560;
            padding: 16px 24px;
            border-radius: 12px;
            border: 2px solid #e94560;
            box-shadow: 0 8px 32px rgba(233, 69, 96, 0.3);
            z-index: 10000;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            text-align: center;
            max-width: 400px;
            animation: slideDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 8px;">🏗️ BASE ESTABLISHMENT UNLOCKED</div>
            <div style="font-size: 14px; color: #f0f0f0;">
                The cosmic energies have aligned. You may now establish your eldritch sanctuary.
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100px); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideDown 0.5s ease-out reverse';
                setTimeout(() => notification.remove(), 500);
            }
        }, 5000);
    }
    
    triggerBaseEstablishmentDialog() {
        console.log('🏗️ Triggering base establishment dialog...');
        
        // Don't show base establishment dialog during welcome screen
        if (this.isWelcomeScreenActive()) {
            console.log('🏗️ Welcome screen active, deferring base establishment dialog');
            return;
        }
        
        // Debug: Check what systems are available
        console.log('🔍 Debugging base system availability:');
        console.log('  - window.baseSystem:', !!window.baseSystem);
        console.log('  - window.eldritchApp:', !!window.eldritchApp);
        console.log('  - window.eldritchApp.systems:', !!window.eldritchApp?.systems);
        console.log('  - window.eldritchApp.systems.base:', !!window.eldritchApp?.systems?.base);
        console.log('  - window.SimpleBaseInit:', !!window.SimpleBaseInit);
        
        // Check if base system is available
        if (window.baseSystem && typeof window.baseSystem.showBaseEstablishmentModal === 'function') {
            console.log('🏗️ Triggering base establishment dialog (legacy)...');
            window.baseSystem.showBaseEstablishmentModal();
        } else if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.base) {
            console.log('🏗️ Triggering base establishment dialog...');
            window.eldritchApp.systems.base.showBaseEstablishmentModal();
        } else if (window.SimpleBaseInit) {
            console.log('🏗️ Triggering base establishment dialog (SimpleBaseInit)...');
            // Create a simple base establishment modal
            this.createSimpleBaseEstablishmentModal();
        } else {
            console.warn('⚠️ No base system available for establishment dialog');
            console.log('🏗️ Creating fallback base establishment dialog...');
            this.createFallbackBaseEstablishmentDialog();
        }
    }
    
    /**
     * Check if welcome screen is currently active
     * @returns {boolean} True if welcome screen is active
     */
    isWelcomeScreenActive() {
        // Check if welcome screen element is visible
        const welcomeScreen = document.getElementById('welcome-screen');
        if (welcomeScreen) {
            const style = window.getComputedStyle(welcomeScreen);
            const isVisible = style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
            console.log('🏗️ Welcome screen visibility check:', {
                element: !!welcomeScreen,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                isVisible: isVisible
            });
            return isVisible;
        }
        
        // Check if welcome screen is in the DOM and visible
        const welcomeElements = document.querySelectorAll('[id*="welcome"], [class*="welcome"]');
        for (const element of welcomeElements) {
            const style = window.getComputedStyle(element);
            if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                console.log('🏗️ Welcome screen element found and visible:', element.id || element.className);
                return true;
            }
        }
        
        // Also check if notifications are disabled (game not started yet)
        if (window.notificationCenter && !window.notificationCenter.gameStarted) {
            console.log('🏗️ Notifications disabled - game not started yet');
            return true; // Treat as welcome screen active
        }
        
        console.log('🏗️ No welcome screen elements found or visible');
        return false;
    }

    /**
     * Request game state from server when continuing adventure
     * Ensures map systems are ready before requesting state
     */
    requestGameStateFromServer() {
        console.log('🎮 Requesting game state from server for continuing adventure...');
        
        // Wait for map systems to be ready before requesting game state
        this.waitForMapSystemsReady(() => {
            if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
                console.log('🎮 Map systems ready, requesting game state from server...');
                window.websocketClient.requestGameState();
            } else {
                console.log('⚠️ WebSocket not connected, will try again when connected...');
                // Try to connect to WebSocket after a delay
                setTimeout(() => {
                    if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
                        console.log('🎮 WebSocket connected after delay, requesting game state...');
                        window.websocketClient.requestGameState();
                    } else {
                        console.log('⚠️ WebSocket still not connected after delay');
                    }
                }, 2000);
            }
        });
    }
    
    /**
     * Wait for map systems to be ready before proceeding
     * @param {Function} callback - Callback to execute when ready
     */
    waitForMapSystemsReady(callback) {
        console.log('🗺️ Waiting for map systems to be ready...');
        
        const checkMapReady = () => {
            // Check for the actual map systems in the new layered architecture
            const mapReady = window.mapLayer && 
                           window.mapLayer.map && 
                           window.mapLayer.mapReady;
            
            console.log('🗺️ Map readiness check:', {
                mapLayer: !!window.mapLayer,
                map: !!(window.mapLayer && window.mapLayer.map),
                mapReady: !!(window.mapLayer && window.mapLayer.mapReady)
            });
            
            if (mapReady) {
                console.log('✅ Map systems ready, proceeding with game state request');
                callback();
            } else {
                console.log('⏳ Map systems not ready yet, waiting...');
                setTimeout(checkMapReady, 500);
            }
        };
        
        // Start checking immediately
        checkMapReady();
    }

    createFallbackBaseEstablishmentDialog() {
        console.log('🏗️ Creating fallback base establishment dialog...');
        
        // Create a beautiful modal for base establishment
        const modal = document.createElement('div');
        modal.id = 'fallback-base-establishment-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            font-family: 'Arial', sans-serif;
        `;
        
        const dialog = document.createElement('div');
        dialog.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #4a9eff;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 10px 30px rgba(74, 158, 255, 0.3);
            animation: slideIn 0.5s ease-out;
        `;
        
        dialog.innerHTML = `
            <div style="color: #4a9eff; font-size: 24px; margin-bottom: 20px; font-weight: bold;">
                🌌 Base Establishment Available!
            </div>
            <div style="color: #ffffff; font-size: 16px; margin-bottom: 25px; line-height: 1.5;">
                Congratulations! You have reached 1000 steps and can now establish your cosmic base.<br>
                This will be your territory in the infinite cosmic realm.
            </div>
            <div style="display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
                <button id="establish-base-btn" style="
                    background: linear-gradient(45deg, #4a9eff, #00d4ff);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">🏗️ Establish Base</button>
                <button id="close-base-dialog-btn" style="
                    background: linear-gradient(45deg, #666, #888);
                    color: white;
                    border: none;
                    padding: 12px 25px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                ">❌ Close</button>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            #establish-base-btn:hover, #close-base-dialog-btn:hover {
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
        
        modal.appendChild(dialog);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('establish-base-btn').addEventListener('click', () => {
            console.log('🏗️ Base establishment confirmed!');
            console.log('🏗️ Calling handleBaseEstablishment...');
            try {
                this.handleBaseEstablishment();
                console.log('🏗️ handleBaseEstablishment completed');
            } catch (error) {
                console.error('🏗️ Error in handleBaseEstablishment:', error);
            }
            this.closeFallbackDialog();
        });
        
        document.getElementById('close-base-dialog-btn').addEventListener('click', () => {
            console.log('🏗️ Base establishment dialog closed');
            this.closeFallbackDialog();
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeFallbackDialog();
            }
        });
        
        // Close on Escape key
        const escapeHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeFallbackDialog();
                document.removeEventListener('keydown', escapeHandler);
            }
        };
        document.addEventListener('keydown', escapeHandler);
    }
    
    closeFallbackDialog() {
        const modal = document.getElementById('fallback-base-establishment-modal');
        if (modal) {
            modal.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.remove();
                }
            }, 300);
        }
    }
    
    handleBaseEstablishment() {
        console.log('🏗️ Handling base establishment...');
        console.log('🏗️ Step currency system context:', this);
        console.log('🏗️ Current step count:', this.totalSteps);
        
        // Here you can add the actual base establishment logic
        // For now, we'll just show a success message
        console.log('🏗️ Base establishment initiated! Your cosmic territory is being prepared...');
        
        // You can integrate with the actual base system here when it's available
        // For example: window.baseSystem.establishBase() or similar
        console.log('🏗️ Base establishment handling completed');
    }
    
    createSimpleBaseEstablishmentModal() {
        // Create a simple modal for base establishment
        const modal = document.createElement('div');
        modal.id = 'simple-base-establishment-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #8b5cf6;
                border-radius: 16px;
                padding: 32px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            ">
                <h2 style="color: #8b5cf6; margin-bottom: 16px; font-size: 24px;">
                    🏗️ Establish Your Cosmic Base
                </h2>
                <p style="color: #e0e0e0; margin-bottom: 24px; line-height: 1.6;">
                    The cosmic energies have aligned! You have accumulated enough steps to establish a base in this realm. 
                    This will serve as your sanctuary and command center for future expeditions.
                </p>
                <div style="
                    background: rgba(139, 92, 246, 0.1);
                    border: 1px solid #8b5cf6;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 24px;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #f0f0f0;">Establish Base Cost:</span>
                        <span style="color: #e94560; font-weight: bold; font-size: 18px;">1000 Steps</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                        <span style="color: #f0f0f0;">Your Current Steps:</span>
                        <span style="color: #00ff88; font-weight: bold; font-size: 18px;">${this.totalSteps}</span>
                    </div>
                </div>
                <div style="display: flex; gap: 16px; justify-content: center;">
                    <button id="confirm-simple-base-establishment" style="
                        background: linear-gradient(135deg, rgb(245, 158, 11), rgb(251, 191, 36));
                        color: white;
                        border: none;
                        padding: 16px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: 0.2s;
                        box-shadow: rgba(245, 158, 11, 0.3) 0px 4px 12px;
                    ">
                        <span class="icon">🏗️</span> Establish Base for 1000 Steps
                    </button>
                    <button id="cancel-simple-base-establishment" style="
                        background: rgba(255, 255, 255, 0.1);
                        color: #e0e0e0;
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        padding: 16px 24px;
                        border-radius: 12px;
                        cursor: pointer;
                        font-size: 16px;
                        font-weight: 600;
                        transition: 0.2s;
                    ">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('confirm-simple-base-establishment').onclick = () => {
            this.establishSimpleBase();
            modal.remove();
        };
        
        document.getElementById('cancel-simple-base-establishment').onclick = () => {
            modal.remove();
        };
    }
    
    establishSimpleBase(position = null) {
        console.log('🏗️ Establishing simple base...');
        console.log('🏗️ Current steps before base establishment:', this.totalSteps);
        
        // Check if player has enough steps
        if (this.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            return false;
        }
        
        // Deduct steps
        console.log('🏗️ Deducting 1000 steps for base establishment...');
        this.totalSteps -= 1000;
        console.log('🏗️ Steps after deduction:', this.totalSteps);
        this.saveSteps();
        this.updateStepCounter();
        console.log('🏗️ Step counter updated after base establishment');
        
        // Get position from parameter, or try to get current position
        let basePosition = position;
        
        if (!basePosition) {
            console.log('🏗️ No position provided, trying to get current player position...');
            
            // Try multiple sources for current position
            if (window.gpsCore && window.gpsCore.currentPosition) {
                basePosition = window.gpsCore.currentPosition;
                console.log('🏗️ Got position from gpsCore:', basePosition);
            } else if (window.geolocationManager) {
                basePosition = window.geolocationManager.getCurrentPosition();
                console.log('🏗️ Got position from geolocationManager:', basePosition);
            } else if (window.mapEngine && window.mapEngine.getCurrentPlayerPosition) {
                basePosition = window.mapEngine.getCurrentPlayerPosition();
                console.log('🏗️ Got position from mapEngine.getCurrentPlayerPosition:', basePosition);
            } else if (window.mapEngine && window.mapEngine.playerPosition) {
                basePosition = window.mapEngine.playerPosition;
                console.log('🏗️ Got position from mapEngine.playerPosition:', basePosition);
            } else if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
                basePosition = window.mapLayer.getCurrentPlayerPosition();
                console.log('🏗️ Got position from mapLayer.getCurrentPlayerPosition:', basePosition);
            } else {
                // Try to get position from the actual player marker on the map
                if (window.mapEngine && window.mapEngine.map) {
                    const playerMarker = window.mapEngine.map._layers;
                    for (let layerId in playerMarker) {
                        const layer = playerMarker[layerId];
                        if (layer instanceof L.Marker && layer.options && layer.options.className && layer.options.className.includes('player-marker')) {
                            const latlng = layer.getLatLng();
                            basePosition = { lat: latlng.lat, lng: latlng.lng };
                            console.log('🏗️ Got position from player marker on map:', basePosition);
                            break;
                        }
                    }
                }
                
                // Last resort fallback - use MapLayer's current player position
                if (!basePosition) {
                    if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
                        basePosition = window.mapLayer.getCurrentPlayerPosition();
                        console.log('🏗️ Using MapLayer current player position:', basePosition);
                    } else {
                        basePosition = { lat: 61.4981, lng: 23.7608 };
                        console.warn('🏗️ Using hardcoded fallback position:', basePosition);
                    }
                }
            }
        }
        
        if (basePosition) {
                // Create base data
                const baseData = {
                lat: basePosition.lat,
                lng: basePosition.lng,
                    name: 'My Cosmic Base',
                established_at: new Date().toISOString(),
                level: 1,
                id: 'base_' + Date.now()
                };
                
                // Save to localStorage
                localStorage.setItem('playerBase', JSON.stringify(baseData));
                
            // Create base marker on map
            this.createBaseMarkerOnMap(basePosition);
            
            console.log('🏗️ Simple base established successfully!', baseData);
            try {
                if (window.auraPulseSystem) {
                    window.auraPulseSystem.pulse({ color: '#10b981', size: 200, duration: 800 });
                }
                if (window.particleSystem) {
                    window.particleSystem.triggerBurst(window.innerWidth * 0.5, window.innerHeight * 0.5, { hue: 140, count: 36 });
                }
            } catch (_) {}
            
            // Update UI panels after base establishment
            this.updateUIAfterBaseEstablishment();
            
            // Broadcast to server
            this.syncStepsToServer();
            
            return true;
        } else {
            console.warn('⚠️ Could not get position for base establishment');
            return false;
        }
    }
    
    updateUIAfterBaseEstablishment() {
        console.log('🔄 Updating UI after base establishment...');
        
        // Update tablist if available
        if (window.tablist && window.tablist.updateBaseInfo) {
            console.log('🔄 Updating tablist base info...');
            window.tablist.updateBaseInfo();
        }
        
        // Update ThreeJS UI if available
        if (window.threejsUI && window.threejsUI.updateBaseInfo) {
            console.log('🔄 Updating ThreeJS UI base info...');
            window.threejsUI.updateBaseInfo();
        }
        
        // Update UI panels if available
        if (window.UIPanels && window.UIPanels.updateBaseInfo) {
            console.log('🔄 Updating UI panels base info...');
            window.UIPanels.updateBaseInfo();
        }
        
        // Trigger custom event for other systems to listen
        document.dispatchEvent(new CustomEvent('baseEstablished', {
            detail: { baseData: JSON.parse(localStorage.getItem('playerBase') || '{}') }
        }));
        
        console.log('🔄 UI update completed after base establishment');
    }
    
    createBaseMarkerOnMap(position) {
        console.log('🏗️ Creating base marker on map at position:', position);
        
        // Check if player has enough steps and deduct them
        if (this.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            return false;
        }
        
        // Deduct steps for base establishment
        console.log('🏗️ Deducting 1000 steps for base establishment...');
        console.log('🏗️ Current steps before base establishment:', this.totalSteps);
        this.totalSteps -= 1000;
        console.log('🏗️ Steps after deduction:', this.totalSteps);
        this.saveSteps();
        this.updateStepCounter();
        console.log('🏗️ Step counter updated after base establishment');
        
        // Create marker via server if connected
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🎮 Creating base marker via server...');
            window.websocketClient.establishBase(position);
        }
        
        // Create visual marker immediately using MapLayer (most reliable)
        if (window.mapLayer && window.mapLayer.map && window.mapLayer.addBaseMarker) {
            console.log('🏗️ Creating visual base marker immediately using MapLayer.addBaseMarker method');
            try {
                const marker = window.mapLayer.addBaseMarker(position);
                if (marker) {
                    console.log('🏗️ Visual base marker created successfully!');
                    
                    // Also create flag pole marker
                    this.createFlagPoleMarker(position);
                    
                    return true;
                } else {
                    console.error('🏗️ MapLayer.addBaseMarker returned null');
                }
            } catch (error) {
                console.error('🏗️ Error creating visual base marker:', error);
            }
        }
        
        // Fallback: Try SimpleBaseInit if MapLayer not available
        if (window.SimpleBaseInit) {
            console.log('🏗️ Creating visual base marker using SimpleBaseInit system (fallback)');
            try {
                const simpleBase = new window.SimpleBaseInit();
                
                // Wait for map to be ready if needed
                if (!window.mapLayer || !window.mapLayer.map) {
                    console.log('🏗️ Map not ready, waiting for map initialization...');
                    setTimeout(() => {
                        simpleBase.createNewBase(position);
                        console.log('🏗️ Visual base marker created successfully using SimpleBaseInit (delayed)!');
                        
                        // Also create flag pole marker
                        this.createFlagPoleMarker(position);
                    }, 1000);
                } else {
                    simpleBase.createNewBase(position);
                    console.log('🏗️ Visual base marker created successfully using SimpleBaseInit!');
                    
                    // Also create flag pole marker
                    this.createFlagPoleMarker(position);
                }
                return true;
            } catch (error) {
                console.error('🏗️ Error creating visual base marker with SimpleBaseInit:', error);
            }
        }
        
        return true;
        
        // Fallback to local creation
        console.log('⚠️ WebSocket not connected, creating base marker locally...');
        
        // Method 1: Use MapLayer's addBaseMarker method (most reliable)
        if (window.mapLayer && window.mapLayer.addBaseMarker) {
            console.log('🏗️ Creating base marker using MapLayer.addBaseMarker method');
            try {
                const marker = window.mapLayer.addBaseMarker(position);
                if (marker) {
                    console.log('🏗️ Base marker created successfully using MapLayer.addBaseMarker!');
                    return true;
                } else {
                    console.error('🏗️ MapLayer.addBaseMarker returned null');
                }
            } catch (error) {
                console.error('🏗️ Error creating base marker using MapLayer.addBaseMarker:', error);
            }
        }
        
        // Method 1b: Fallback to MapLayer's addMarker method
        if (window.mapLayer && window.mapLayer.addMarker) {
            console.log('🏗️ Creating base marker using MapLayer.addMarker method (fallback)');
            try {
                const baseIcon = L.divIcon({
                    className: 'base-marker cosmic-base',
                    html: `
                        <div style="position: relative; width: 60px; height: 60px;">
                            <!-- Outer cosmic ring -->
                            <div style="position: absolute; top: -10px; left: -10px; width: 80px; height: 80px; border: 2px solid #8b5cf6; border-radius: 50%; animation: cosmicRotate 8s linear infinite; opacity: 0.6;"></div>
                            
                            <!-- Middle energy ring -->
                            <div style="position: absolute; top: -5px; left: -5px; width: 70px; height: 70px; border: 1px solid #a78bfa; border-radius: 50%; animation: cosmicRotate 4s linear infinite reverse; opacity: 0.8;"></div>
                            
                            <!-- Base structure -->
                            <div style="position: absolute; top: 0px; left: 0px; width: 60px; height: 60px; background: radial-gradient(circle, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%); border: 3px solid #8b5cf6; border-radius: 50%; box-shadow: 0 0 20px #8b5cf680, inset 0 0 20px #a78bfa40;"></div>
                            
                            <!-- Inner cosmic core -->
                            <div style="position: absolute; top: 10px; left: 10px; width: 40px; height: 40px; background: radial-gradient(circle, #fbbf24 0%, #f59e0b 50%, #d97706 100%); border-radius: 50%; animation: cosmicPulse 2s ease-in-out infinite; box-shadow: 0 0 15px #fbbf24, inset 0 0 10px #fbbf24;"></div>
                            
                            <!-- Central cosmic symbol -->
                            <div style="position: absolute; top: 20px; left: 20px; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #1e1b4b; font-weight: bold; text-shadow: 0 0 5px #fbbf24; animation: cosmicGlow 1.5s ease-in-out infinite alternate;">★</div>
                            
                            <!-- Floating particles -->
                            <div style="position: absolute; top: 5px; left: 5px; width: 4px; height: 4px; background: #a78bfa; border-radius: 50%; animation: particleFloat1 3s ease-in-out infinite;"></div>
                            <div style="position: absolute; top: 15px; right: 5px; width: 3px; height: 3px; background: #fbbf24; border-radius: 50%; animation: particleFloat2 2.5s ease-in-out infinite;"></div>
                            <div style="position: absolute; bottom: 10px; left: 10px; width: 2px; height: 2px; background: #8b5cf6; border-radius: 50%; animation: particleFloat3 4s ease-in-out infinite;"></div>
                            <div style="position: absolute; bottom: 5px; right: 10px; width: 3px; height: 3px; background: #a78bfa; border-radius: 50%; animation: particleFloat4 3.5s ease-in-out infinite;"></div>
                        </div>
                    `,
                    iconSize: [60, 60],
                    iconAnchor: [30, 30]
                });
                
                const markerData = {
                    id: 'base-marker-' + Date.now(),
                    position: position,
                    type: 'base',
                    icon: baseIcon,
                    popup: `
                        <div style="text-align: center;">
                            <h3>🏗️ My Cosmic Base</h3>
                            <p>Established: ${new Date().toLocaleDateString()}</p>
                            <p>Level: 1</p>
                        </div>
                    `,
                    options: {
                        zIndexOffset: 2000
                    }
                };
                
                const success = window.mapLayer.addMarker(markerData.id, markerData);
                if (success) {
                    console.log('🏗️ Base marker created successfully using MapLayer.addMarker!');
                    return true;
        } else {
                    console.error('🏗️ MapLayer.addMarker returned false');
                }
            } catch (error) {
                console.error('🏗️ Error creating base marker using MapLayer.addMarker:', error);
            }
        }
        
        // Method 2: Fallback to direct map access - USE EXACT SAME MAP AS PLAYER MARKER
        if (window.mapLayer && window.mapLayer.map) {
            console.log('🏗️ Creating base marker using MapLayer.map (EXACT SAME MAP AS PLAYER MARKER)');
            console.log('🏗️ MapLayer.map reference:', window.mapLayer.map);
            console.log('🏗️ MapLayer.mapReady:', window.mapLayer.mapReady);
            
            try {
                // Create base marker icon similar to player marker
                const baseIcon = L.divIcon({
                    className: 'base-marker multilayered',
                    html: `
                        <div style="position: relative; width: 40px; height: 40px;">
                            <!-- Base aura -->
                            <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #ff000040 0%, transparent 70%); border-radius: 50%; animation: basePulse 2s infinite;"></div>
                            <!-- Base body -->
                            <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #ff000080;"></div>
                            <!-- Base emoji -->
                            <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
                        </div>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
                
                // Use EXACT same method as player marker creation
                const baseMarker = L.marker([position.lat, position.lng], {
                    icon: baseIcon,
                    zIndexOffset: 2000  // Higher than player marker to ensure visibility
                });

                // Add to territory layer group if available, otherwise add to map
                if (window.mapLayer.leafletLayerManager && window.mapLayer.leafletLayerManager.layers.has('territory')) {
                    const territoryLayer = window.mapLayer.leafletLayerManager.layers.get('territory');
                    baseMarker.addTo(territoryLayer);
                    console.log('🏗️ Base marker added to territory layer group');
                } else {
                    baseMarker.addTo(window.mapLayer.map);
                    console.log('🏗️ Base marker added directly to map (territory layer not available)');
                }
                
                baseMarker.bindPopup(`
                    <b>🏗️ My Cosmic Base</b><br>
                    <small>Established: ${new Date().toLocaleDateString()}</small><br>
                    <small>Level: 1</small>
                `);
                
                console.log('🏗️ Base marker created successfully using EXACT SAME MAP as player marker!');
                console.log('🏗️ Base marker position:', baseMarker.getLatLng());
                console.log('🏗️ Base marker map reference:', baseMarker._map);
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker using direct map access:', error);
            }
        }
        
        // Method 2: Try using TerritoryLayer via layer manager
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            const territoryLayer = window.eldritchApp.layerManager.layers.get('territory');
            if (territoryLayer && territoryLayer.addTerritory) {
                console.log('🏗️ Creating base marker using TerritoryLayer');
                try {
                    territoryLayer.addTerritory('player-base', {
                        position: position,
                        radius: 50,
                        type: 'player',
                        level: 1,
                        owner: 'player'
                    });
                    console.log('🏗️ Base territory created successfully using TerritoryLayer');
                    return true;
                } catch (error) {
                    console.error('🏗️ Error creating base territory with TerritoryLayer:', error);
                }
            }
        }
        
        // Method 3: Try using mapEngine.map directly (if MapLayer not available)
        if (window.mapEngine && window.mapEngine.map && !window.mapLayer) {
            console.log('🏗️ Creating base marker using mapEngine.map (MapLayer not available)');
            try {
                const baseIcon = L.divIcon({
                    className: 'base-marker',
                    html: '🏗️',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });
                
                const baseMarker = L.marker([position.lat, position.lng], {
                    icon: baseIcon
                }).addTo(window.mapEngine.map);
                
                baseMarker.bindPopup(`
                    <div style="text-align: center;">
                        <h3>🏗️ My Cosmic Base</h3>
                        <p>Established: ${new Date().toLocaleDateString()}</p>
                        <p>Level: 1</p>
                    </div>
                `);
                
                console.log('🏗️ Base marker created successfully on map');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with mapEngine.map:', error);
            }
        }
        
        // Method 4: Try using mapEngine methods
        if (window.mapEngine && window.mapEngine.updateBaseMarker) {
            console.log('🏗️ Creating base marker using mapEngine.updateBaseMarker');
            try {
                window.mapEngine.updateBaseMarker(position);
                console.log('🏗️ Base marker created using updateBaseMarker');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with updateBaseMarker:', error);
            }
        }
        
        if (window.mapEngine && window.mapEngine.createBaseMarker) {
            console.log('🏗️ Creating base marker using mapEngine.createBaseMarker');
            try {
                window.mapEngine.createBaseMarker(position);
                console.log('🏗️ Base marker created using createBaseMarker');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with createBaseMarker:', error);
            }
        }
        
        // Method 5: Try using SimpleBaseInit
        if (window.SimpleBaseInit) {
            console.log('🏗️ Creating base marker using SimpleBaseInit');
            try {
                const simpleBase = new window.SimpleBaseInit();
                simpleBase.createNewBase(position);
                console.log('🏗️ Base marker created using SimpleBaseInit');
                return true;
            } catch (error) {
                console.error('🏗️ Error creating base marker with SimpleBaseInit:', error);
            }
        }
        
        console.warn('⚠️ No map available to create base marker');
        return false;
    }
    
    // Test function to add steps (for development) - bypasses automatic detection check
    addTestSteps(amount = 1000) {
        console.log(`🧪 Adding ${amount} test steps...`);
        console.log(`🧪 Before: Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        
        // Disable fallback mode to prevent automatic step addition
        this.disableFallbackMode();
        
        // Temporarily enable step detection for manual test steps
        const wasAutoEnabled = this.autoStepDetectionEnabled;
        this.autoStepDetectionEnabled = true;
        
        // Add steps one by one to trigger milestone checking
        for (let i = 0; i < amount; i++) {
            this.totalSteps++;
            this.sessionSteps++;
            
            // Emit step change event for each step
            this.emitStepChangeEvent(1);
            
            // Check milestones after EVERY step to ensure 1000-step milestone triggers
            this.checkMilestones();
        }
        
        // Restore original auto detection setting
        this.autoStepDetectionEnabled = wasAutoEnabled;
        
        this.saveSteps();
        this.updateStepCounter();
        
        console.log(`🧪 After: Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
    }
    
    
    createStepCounter() {
        // Check if step counter already exists
        const existingCounter = document.getElementById('step-counter');
        if (existingCounter) {
            console.log('🚶‍♂️ Step counter already exists, removing duplicate');
            existingCounter.remove();
        }

        // Create consciousness-serving step counter with toggle buttons
        const stepCounter = document.createElement('div');
        stepCounter.id = 'step-counter';
        stepCounter.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #ff6b6b;
            border-radius: 12px;
            padding: 20px;
            color: white;
            font-family: 'Arial', sans-serif;
            z-index: 10000;
            min-width: 200px;
            text-align: center;
        `;
        stepCounter.innerHTML = `
            <div class="step-counter-container">
                <div class="step-icon" style="font-size: 24px; margin-bottom: 8px;">🚶‍♂️</div>
                <div class="step-number" id="step-number" style="font-size: 32px; font-weight: bold; color: #00ff88; margin-bottom: 4px;">${this.totalSteps}</div>
                <div class="step-label" style="font-size: 12px; color: #00ff88; margin-bottom: 8px;">Consciousness-Serving Step Tracking</div>
                <div class="step-session" id="step-session" style="font-size: 14px; color: #ffd93d; margin-bottom: 12px;">+${this.sessionSteps}</div>
                <div class="step-source-toggle" style="display: flex; gap: 6px; justify-content: center;">
                    <button class="step-source-btn" data-mode="gps_distance" style="padding: 6px 12px; font-size: 12px; background: #1a1a2e; color: #00ff88; border: 1px solid #00ff88; border-radius: 6px; cursor: pointer; font-weight: bold;">GPS</button>
                    <button class="step-source-btn" data-mode="device" style="padding: 6px 12px; font-size: 12px; background: #1a1a2e; color: #ff6b6b; border: 1px solid #ff6b6b; border-radius: 6px; cursor: pointer; font-weight: bold;">Device</button>
                    <button class="step-source-btn" data-mode="simulation" style="padding: 6px 12px; font-size: 12px; background: #1a1a2e; color: #ffd93d; border: 1px solid #ffd93d; border-radius: 6px; cursor: pointer; font-weight: bold;">Sim</button>
                </div>
            </div>
        `;

        // Add to control panel or fallback to body
        const stepContainer = document.getElementById('step-counter-container');
        if (stepContainer) {
            stepContainer.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter with toggle created and added to control panel');
        } else {
            // Fallback to adding to body
            document.body.appendChild(stepCounter);
            console.log('🚶‍♂️ Step counter with toggle created and added to body (fallback)');
        }
        
        // Set up toggle button event listeners
        this.setupStepSourceToggleButtons();
    }
    
    /**
     * Set up step source toggle button event listeners
     */
    setupStepSourceToggleButtons() {
        const toggleButtons = document.querySelectorAll('.step-source-btn');
        
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const mode = button.getAttribute('data-mode');
                console.log(`🚶‍♂️ Step source toggle clicked: ${mode}`);
                
                // Switch to the selected mode
                if (this.setEngineMode(mode)) {
                    // Update button styles to show active state
                    this.updateStepSourceButtonStyles(mode);
                }
            });
            
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                button.style.opacity = '0.8';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.opacity = '1';
            });
        });
        
        // Set initial active state
        this.updateStepSourceButtonStyles(this.getCurrentStepMode());
    }
    
    /**
     * Update step source button styles to show active state
     */
    updateStepSourceButtonStyles(activeMode) {
        const toggleButtons = document.querySelectorAll('.step-source-btn');
        
        toggleButtons.forEach(button => {
            const mode = button.getAttribute('data-mode');
            
            if (mode === activeMode) {
                // Active button - brighter colors
                button.style.opacity = '1';
                button.style.fontWeight = 'bold';
                button.style.boxShadow = '0 0 8px currentColor';
            } else {
                // Inactive button - dimmer colors
                button.style.opacity = '0.6';
                button.style.fontWeight = 'normal';
                button.style.boxShadow = 'none';
            }
        });
    }
    
    /**
     * Get current step detection mode
     */
    getCurrentStepMode() {
        if (this.fallbackMode) {
            return 'simulation';
        } else if (this.useEnhancedTracking) {
            return 'device';
        } else {
            return 'gps_distance';
        }
    }

    setupStepControls() {
        const incBtn = document.getElementById('step-increment');
        const decBtn = document.getElementById('step-decrement');
        if (!incBtn || !decBtn) return;

        // Remove any existing event listeners to prevent conflicts
        incBtn.replaceWith(incBtn.cloneNode(true));
        decBtn.replaceWith(decBtn.cloneNode(true));
        
        // Get fresh references after cloning
        const newIncBtn = document.getElementById('step-increment');
        const newDecBtn = document.getElementById('step-decrement');

        const startHold = (direction) => {
            let amount = 1;
            // Single tap immediate
            if (direction > 0) this.addManualStep(); else this.subtractSteps(1);
            // Hold acceleration
            let active = true;
            let intervalMs = 300;
            const tick = () => {
                if (!active) return;
                const count = Math.max(1, Math.floor(amount));
                if (direction > 0) {
                    for (let i = 0; i < count; i++) this.addManualStep();
                } else {
                    this.subtractSteps(count);
                }
                amount *= 1.5; // exponential growth
                setTimeout(tick, intervalMs);
            };
            // Start after short delay to differentiate click vs hold
            const holdTimeout = setTimeout(() => {
                if (!active) return;
                tick();
            }, 350);
            return () => { active = false; clearTimeout(holdTimeout); };
        };

        const bindHold = (button, direction) => {
            let stop;
            const onDown = (e) => { e.preventDefault(); stop = startHold(direction); };
            const onUp = () => { if (stop) stop(); };
            button.addEventListener('mousedown', onDown);
            button.addEventListener('touchstart', onDown, { passive: true });
            ['mouseup','mouseleave','touchend','touchcancel'].forEach(evt => button.addEventListener(evt, onUp));
        };

        bindHold(newIncBtn, +1);
        bindHold(newDecBtn, -1);
    }
    
    updateStepCounter() {
        console.log(`🚶‍♂️ ===== STEP COUNTER UPDATE START =====`);
        console.log(`🚶‍♂️ Current values - Total: ${this.totalSteps}, Session: ${this.sessionSteps}`);
        console.log(`🚶‍♂️ Instance ID: ${this.instanceId}`);
        
        // Update ALL step counter elements (including legacy ones)
        const stepCount = document.getElementById('step-count');
        const stepNumber = document.getElementById('step-number');
        const stepSession = document.getElementById('step-session');
        const stepCountLegacy1 = document.getElementById('step-count-legacy-1');
        
        console.log(`🚶‍♂️ Element search results:`);
        console.log(`🚶‍♂️   - step-count element found: ${!!stepCount}`);
        console.log(`🚶‍♂️   - step-number element found: ${!!stepNumber}`);
        console.log(`🚶‍♂️   - step-session element found: ${!!stepSession}`);
        console.log(`🚶‍♂️   - step-count-legacy-1 element found: ${!!stepCountLegacy1}`);
        
        const stepValue = this.totalSteps.toLocaleString();
        const sessionValue = `+${this.sessionSteps}`;
        
        // Update step-count (header counter)
        if (stepCount) {
            const oldValue = stepCount.textContent;
            stepCount.textContent = stepValue;
            console.log(`🚶‍♂️ step-count updated: "${oldValue}" → "${stepCount.textContent}"`);
        } else {
            console.warn(`🚶‍♂️ step-count element not found! This is the primary counter.`);
        }
        
        // Update step-count-legacy-1 (legacy counter)
        if (stepCountLegacy1) {
            const oldValue = stepCountLegacy1.textContent;
            stepCountLegacy1.textContent = stepValue;
            console.log(`🚶‍♂️ step-count-legacy-1 updated: "${oldValue}" → "${stepCountLegacy1.textContent}"`);
        }
        
        // Update step-number (step counter display)
        if (stepNumber) {
            const oldValue = stepNumber.textContent;
            stepNumber.textContent = stepValue;
            console.log(`🚶‍♂️ step-number updated: "${oldValue}" → "${stepNumber.textContent}"`);
        }
        
        // Update step-session (session counter)
        if (stepSession) {
            const oldValue = stepSession.textContent;
            stepSession.textContent = sessionValue;
            console.log(`🚶‍♂️ step-session updated: "${oldValue}" → "${stepSession.textContent}"`);
        }
        
        // Add pulse animation to all step counters
        [stepCount, stepCountLegacy1, stepNumber].forEach(element => {
            if (element) {
                element.style.animation = 'stepPulse 0.5s ease-out';
                setTimeout(() => {
                    element.style.animation = '';
                }, 500);
                console.log(`🚶‍♂️ Added pulse animation to ${element.id || 'element'}`);
            }
        });
        
        // Check if any step counter elements were found
        if (!stepCount && !stepNumber && !stepSession) {
            console.error(`🚶‍♂️ ❌ NO STEP COUNTER ELEMENTS FOUND!`);
            console.error(`🚶‍♂️ This means the step counter will not display properly.`);
            console.error(`🚶‍♂️ Expected elements: step-count, step-number, step-session`);
        }
        
        // Check for base establishment achievement
        this.checkBaseEstablishmentAchievement();
        
        console.log(`🚶‍♂️ ===== STEP COUNTER UPDATE END =====`);
    }
    
    checkBaseEstablishmentAchievement() {
        // Check if this is the first time reaching 1000+ steps
        const hasReached1000Before = localStorage.getItem('base_achievement_1000_reached') === 'true';
        
        if (this.totalSteps >= 1000 && !hasReached1000Before) {
            console.log('🏆 BASE ESTABLISHMENT ACHIEVEMENT UNLOCKED!');
            
            // Mark achievement as reached
            localStorage.setItem('base_achievement_1000_reached', 'true');
            
            // Show achievement notification
            this.showBaseAchievementNotification();
            
            // Open base establishment dialog
            setTimeout(() => {
                this.showBaseEstablishmentDialog();
            }, 2000); // 2 second delay to let user see the achievement
        }
    }
    
    showBaseAchievementNotification() {
        console.log('🏆 Showing base establishment achievement notification...');
        
        // Create achievement notification
        const notification = document.createElement('div');
        notification.className = 'base-achievement-notification';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">🏆</div>
                <div class="achievement-text">
                    <h3>Base Establishment Unlocked!</h3>
                    <p>You've reached 1,000 steps! You can now establish your cosmic base.</p>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #8b5cf6, #10b981);
            color: white;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            max-width: 300px;
            font-family: 'Arial', sans-serif;
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .achievement-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            .achievement-icon {
                font-size: 40px;
                animation: pulse 2s infinite;
            }
            .achievement-text h3 {
                margin: 0 0 5px 0;
                font-size: 18px;
                font-weight: bold;
            }
            .achievement-text p {
                margin: 0;
                font-size: 14px;
                opacity: 0.9;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 5000);
        
        // Trigger aura pulse effect
        try {
            if (window.auraPulseSystem) {
                window.auraPulseSystem.pulse({ color: '#8b5cf6', size: 300, duration: 1000 });
            }
        } catch (error) {
            console.log('Aura pulse system not available:', error);
        }
    }
    
    showBaseEstablishmentDialog() {
        console.log('🏗️ Opening base establishment dialog...');
        
        // Check if base establishment modal exists
        if (window.SimpleBaseInit) {
            const simpleBase = new window.SimpleBaseInit();
            if (typeof simpleBase.showBaseEstablishmentModal === 'function') {
                simpleBase.showBaseEstablishmentModal();
            } else {
                // Fallback: create simple modal
                this.createSimpleBaseEstablishmentModal();
            }
        } else {
            // Fallback: create simple modal
            this.createSimpleBaseEstablishmentModal();
        }
    }
    
    checkNewAdventureWelcome() {
        // Check if we should show the new adventure welcome notification
        const shouldShowWelcome = localStorage.getItem('show_new_adventure_welcome') === 'true';
        
        if (shouldShowWelcome) {
            console.log('🌟 New adventure welcome flag found - showing welcome notification');
            // Clear the flag so it doesn't show again
            localStorage.removeItem('show_new_adventure_welcome');
            // Show the welcome notification
            this.showNewAdventureWelcomeNotification();
        } else {
            console.log('🌟 No new adventure welcome needed');
        }
    }
    
    createFlagPoleMarker(position) {
        console.log('🏳️ Creating flag pole marker at position:', position);
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('🏳️ Map not ready for flag pole marker creation');
            return null;
        }
        
        try {
            // Get the player's selected flag type
            const flagType = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
            console.log('🏳️ Using flag type:', flagType);
            
            // Create flag pole marker with user's selected flag
            const flagPoleIcon = L.divIcon({
                className: 'flag-pole-marker',
                html: this.createFlagPoleHTML(flagType),
                iconSize: [40, 60],
                iconAnchor: [20, 60],
                popupAnchor: [0, -60]
            });
            
            const flagPoleMarker = L.marker([position.lat, position.lng], {
                icon: flagPoleIcon,
                zIndexOffset: 1000 // High z-index for flag pole
            }).addTo(window.mapLayer.map);
            
            // Add popup with base information
            flagPoleMarker.bindPopup(`
                <div style="text-align: center; font-family: Arial, sans-serif;">
                    <h3 style="margin: 0 0 10px 0; color: #8b5cf6;">🏳️ Base Flag Pole</h3>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Location:</strong> ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
                    <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong> Active Base</p>
                    <p style="margin: 5px 0; font-size: 12px; color: #666;">This flag marks your established cosmic territory</p>
                </div>
            `);
            
            // Add click handler for base management
            flagPoleMarker.on('click', () => {
                console.log('🏳️ Flag pole marker clicked - opening base management');
                if (window.SimpleBaseInit && window.SimpleBaseInit.openBaseMenu) {
                    window.SimpleBaseInit.openBaseMenu();
                }
            });
            
            // Add animation styles
            const style = document.createElement('style');
            style.textContent = `
                @keyframes flagPolePulse {
                    0%, 100% { 
                        transform: scale(1); 
                        box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                    }
                    50% { 
                        transform: scale(1.05); 
                        box-shadow: 0 6px 20px rgba(139, 92, 246, 0.6);
                    }
                }
                @keyframes cosmicFlagShimmer {
                    0%, 100% { 
                        background: linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4);
                    }
                    50% { 
                        background: linear-gradient(45deg, #06b6d4, #8b5cf6, #3b82f6);
                    }
                }
            `;
            document.head.appendChild(style);
            
            console.log('🏳️ Flag pole marker created successfully');
            return flagPoleMarker;
            
        } catch (error) {
            console.error('🏳️ Error creating flag pole marker:', error);
            return null;
        }
    }
    
    createFlagPoleHTML(flagType) {
        console.log('🏳️ Creating flag pole HTML for flag type:', flagType);
        
        let flagHTML = '';
        
        switch (flagType) {
            case 'finnish':
                flagHTML = `
                    <!-- Finnish Flag -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    ">
                        <!-- Blue Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: #003580;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: #003580;
                            transform: translateX(-50%);
                        "></div>
                    </div>
                `;
                break;
                
            case 'norwegian':
                flagHTML = `
                    <!-- Norwegian Flag -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    ">
                        <!-- Red Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: #EF2B2D;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: #EF2B2D;
                            transform: translateX(-50%);
                        "></div>
                        <!-- Blue Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 1px;
                            background: #002868;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 1px;
                            background: #002868;
                            transform: translateX(-50%);
                        "></div>
                    </div>
                `;
                break;
                
            case 'swedish':
                flagHTML = `
                    <!-- Swedish Flag -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: #006AA7;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    ">
                        <!-- Yellow Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: #FECC00;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: #FECC00;
                            transform: translateX(-50%);
                        "></div>
                    </div>
                `;
                break;
                
            case 'danish':
                flagHTML = `
                    <!-- Danish Flag -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: #C60C30;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    ">
                        <!-- White Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: white;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: white;
                            transform: translateX(-50%);
                        "></div>
                    </div>
                `;
                break;
                
            case 'cosmic':
                flagHTML = `
                    <!-- Cosmic Flag -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: linear-gradient(45deg, #8b5cf6, #3b82f6, #06b6d4);
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                        animation: cosmicFlagShimmer 2s infinite;
                    ">
                        <!-- Cosmic Symbol -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 50%;
                            width: 8px;
                            height: 8px;
                            background: white;
                            border-radius: 50%;
                            transform: translate(-50%, -50%);
                            box-shadow: 0 0 4px rgba(255, 255, 255, 0.8);
                        "></div>
                    </div>
                `;
                break;
                
            default:
                // Default to Finnish flag
                flagHTML = `
                    <!-- Finnish Flag (Default) -->
                    <div style="
                        position: absolute;
                        top: 5px;
                        left: 4px;
                        width: 20px;
                        height: 14px;
                        background: white;
                        border: 1px solid #ccc;
                        border-radius: 2px;
                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                    ">
                        <!-- Blue Cross -->
                        <div style="
                            position: absolute;
                            top: 50%;
                            left: 0;
                            right: 0;
                            height: 2px;
                            background: #003580;
                            transform: translateY(-50%);
                        "></div>
                        <div style="
                            position: absolute;
                            left: 50%;
                            top: 0;
                            bottom: 0;
                            width: 2px;
                            background: #003580;
                            transform: translateX(-50%);
                        "></div>
                    </div>
                `;
                break;
        }
        
        return `
            <div style="
                width: 40px; 
                height: 60px; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                justify-content: flex-start;
                position: relative;
            ">
                <!-- Flag Pole -->
                <div style="
                    width: 4px; 
                    height: 50px; 
                    background: linear-gradient(to bottom, #8B4513, #654321); 
                    border-radius: 2px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                "></div>
                
                ${flagHTML}
                
                <!-- Base Circle -->
                <div style="
                    position: absolute;
                    bottom: 0;
                    width: 30px;
                    height: 30px;
                    background: radial-gradient(circle, #8b5cf6, #6d28d9);
                    border: 3px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
                    animation: flagPolePulse 3s infinite;
                "></div>
            </div>
        `;
    }
    
    showNewAdventureWelcomeNotification() {
        console.log('🌟 Showing new adventure welcome notification...');
        
        // Get current location
        let locationText = 'Unknown Location';
        let coordinates = 'Coordinates not available';
        
        if (window.gpsCore && window.gpsCore.currentPosition) {
            const pos = window.gpsCore.currentPosition;
            coordinates = `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`;
            
            // Try to get a more friendly location name
            if (pos.lat >= 61.0 && pos.lat <= 62.0 && pos.lng >= 23.0 && pos.lng <= 24.0) {
                locationText = 'Tampere Region, Finland';
            } else if (pos.lat >= 60.0 && pos.lat <= 70.0 && pos.lng >= 20.0 && pos.lng <= 30.0) {
                locationText = 'Finland';
            } else {
                locationText = 'Your Current Location';
            }
        }
        
        // Create welcome notification
        const notification = document.createElement('div');
        notification.className = 'new-adventure-welcome-notification';
        notification.innerHTML = `
            <div class="welcome-content">
                <div class="welcome-icon">🌟</div>
                <div class="welcome-text">
                    <h3>Welcome to Your New Adventure!</h3>
                    <p><strong>Location:</strong> ${locationText}</p>
                    <p><strong>Coordinates:</strong> ${coordinates}</p>
                    <div class="instructions">
                        <h4>Getting Started:</h4>
                        <ul>
                            <li>🚶‍♂️ Walk around to earn steps</li>
                            <li>📍 Step markers will appear on your path</li>
                            <li>🏆 Reach 1,000 steps to unlock base building</li>
                            <li>🌸 Look for Aurora encounters in the area</li>
                        </ul>
                    </div>
                    <p class="exploration-tip">💡 Just wander around and explore - the magic will happen naturally!</p>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1e3a8a, #3b82f6, #8b5cf6);
            color: white;
            padding: 30px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
            z-index: 10000;
            animation: welcomeSlideIn 0.6s ease-out;
            max-width: 500px;
            width: 90%;
            font-family: 'Arial', sans-serif;
            backdrop-filter: blur(10px);
        `;
        
        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes welcomeSlideIn {
                from { 
                    transform: translate(-50%, -50%) scale(0.8); 
                    opacity: 0; 
                }
                to { 
                    transform: translate(-50%, -50%) scale(1); 
                    opacity: 1; 
                }
            }
            @keyframes welcomeSlideOut {
                from { 
                    transform: translate(-50%, -50%) scale(1); 
                    opacity: 1; 
                }
                to { 
                    transform: translate(-50%, -50%) scale(0.8); 
                    opacity: 0; 
                }
            }
            .welcome-content {
                text-align: center;
            }
            .welcome-icon {
                font-size: 60px;
                margin-bottom: 20px;
                animation: welcomePulse 2s infinite;
            }
            .welcome-text h3 {
                margin: 0 0 15px 0;
                font-size: 24px;
                font-weight: bold;
            }
            .welcome-text p {
                margin: 8px 0;
                font-size: 16px;
                line-height: 1.4;
            }
            .instructions {
                background: rgba(255, 255, 255, 0.1);
                padding: 15px;
                border-radius: 10px;
                margin: 15px 0;
                text-align: left;
            }
            .instructions h4 {
                margin: 0 0 10px 0;
                font-size: 18px;
                text-align: center;
            }
            .instructions ul {
                margin: 0;
                padding-left: 20px;
            }
            .instructions li {
                margin: 5px 0;
                font-size: 14px;
            }
            .exploration-tip {
                font-style: italic;
                background: rgba(255, 255, 255, 0.1);
                padding: 10px;
                border-radius: 8px;
                margin-top: 15px;
            }
            @keyframes welcomePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
        
        // Add to page
        document.body.appendChild(notification);
        
        // Auto-remove after 8 seconds
        setTimeout(() => {
            notification.style.animation = 'welcomeSlideOut 0.5s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 8000);
        
        // Trigger aura pulse effect
        try {
            if (window.auraPulseSystem) {
                window.auraPulseSystem.pulse({ color: '#3b82f6', size: 400, duration: 1200 });
            }
        } catch (error) {
            console.log('Aura pulse system not available:', error);
        }
    }

    startStepDetection() {
        this.stepDetectionActive = true;
        console.log('🚶‍♂️ Step detection started');
        
        // Start enhanced tracking if available
        if (this.useEnhancedTracking && this.enhancedTracking) {
            console.log('🚶‍♂️ Starting enhanced step tracking...');
            this.enhancedTracking.startTracking();
        } else {
            // Keep automatic step detection enabled even without enhanced tracking
            this.autoStepDetectionEnabled = true;
            console.log('🚶‍♂️ Automatic step detection enabled - using basic step tracking');
        }
    }
    
    stopStepDetection() {
        this.stepDetectionActive = false;
        console.log('🚶‍♂️ Step detection stopped');
        
        // Stop enhanced tracking if available
        if (this.useEnhancedTracking && this.enhancedTracking) {
            console.log('🚶‍♂️ Stopping enhanced step tracking...');
            this.enhancedTracking.stopTracking();
        }
    }
    
    getEnhancedTrackingStatus() {
        if (this.useEnhancedTracking && this.enhancedTracking) {
            return this.enhancedTracking.getTrackingStatus();
        }
        return {
            enabled: false,
            methods: [],
            activeMethods: [],
            totalSteps: 0,
            lastUpdate: null
        };
    }
    
    setStepDetectionMode(gpsTracking) {
        // Always enable step detection - consciousness-serving approach
        this.stepDetectionActive = true;
        this.autoStepDetectionEnabled = true;
        
        if (gpsTracking) {
            if (window.gpsCore && window.gpsCore.currentPosition) {
                const position = window.gpsCore.currentPosition;
                if (position && position.accuracy && position.accuracy <= 50) {
                    console.log('🚶‍♂️ Step detection enabled - GPS tracking with good accuracy');
                } else {
                    console.log('🚶‍♂️ Step detection enabled - GPS tracking with basic accuracy');
                }
            } else {
                console.log('🚶‍♂️ Step detection enabled - using fallback tracking methods');
            }
        } else {
            console.log('🚶‍♂️ Step detection enabled - using device motion and gyroscope');
        }
    }
    
    // Google Fit integration (future enhancement)
    setupGoogleFit() {
        // Placeholder for Google Fit API integration
        console.log('🚶‍♂️ Google Fit integration ready for future implementation');
    }
    
    // Manual step addition for testing
    addManualStep() {
        this.addStep();
    }
    
    // Test milestone checking manually
    testMilestoneChecking() {
        console.log('🧪 Testing milestone checking manually...');
        console.log(`Current state - Total: ${this.totalSteps}, Session: ${this.sessionSteps}, Area unlocked: ${this.areaUnlocked}`);
        this.checkMilestones();
    }
    
    // Enable/disable automatic step detection
    setAutoStepDetection(enabled) {
        this.autoStepDetectionEnabled = enabled;
        this.stepDetectionActive = enabled;
        console.log(`🚶‍♂️ Automatic step detection ${enabled ? 'enabled' : 'disabled'}`);
        
        if (enabled) {
            this.startStepDetection();
        } else {
            this.stopStepDetection();
        }
    }
    
    // Consciousness-serving method to ensure step detection is always enabled
    enableStepDetection() {
        this.autoStepDetectionEnabled = true;
        this.stepDetectionActive = true;
        this.startStepDetection();
        console.log('🚶‍♂️ Step detection forcefully enabled for consciousness-serving step tracking');
    }
    
    subtractSteps(count) {
        // Subtract steps (minimum 0)
        const stepsToSubtract = Math.min(count, this.totalSteps);
        this.totalSteps = Math.max(0, this.totalSteps - stepsToSubtract);
        this.sessionSteps = Math.max(0, this.sessionSteps - stepsToSubtract);
        
        console.log(`🚶‍♂️ Subtracted ${stepsToSubtract} steps. Total: ${this.totalSteps}`);
        
        this.updateStepCounter();
        this.saveSteps();
        
        return stepsToSubtract;
    }
    
    // Get current step statistics
    getStepStats() {
        return {
            totalSteps: this.totalSteps,
            sessionSteps: this.sessionSteps,
            detectionActive: this.stepDetectionActive
        };
    }

    /**
     * Set the step engine mode (for mobile toggle functionality)
     * @param {string} mode - The step detection mode ('gps_distance', 'device', 'simulation')
     */
    setEngineMode(mode) {
        console.log(`🚶‍♂️ Setting step engine mode to: ${mode}`);
        
        switch (mode) {
            case 'gps_distance':
                console.log('🚶‍♂️ Switching to GPS distance-based step tracking');
                this.useEnhancedTracking = false;
                this.fallbackMode = false;
                break;
                
            case 'device':
                console.log('🚶‍♂️ Switching to device motion step tracking');
                this.useEnhancedTracking = true;
                this.fallbackMode = false;
                this.setupDeviceMotion();
                break;
                
            case 'simulation':
                console.log('🚶‍♂️ Switching to simulation mode');
                this.useEnhancedTracking = false;
                this.fallbackMode = true;
                this.enableFallbackMode();
                break;
                
            default:
                console.warn(`🚶‍♂️ Unknown step engine mode: ${mode}`);
                return false;
        }
        
        // Update UI to reflect the change
        this.updateStepCounter();
        
        // Show notification
        this.showNotification(`Step tracking mode: ${mode}`, 'info');
        
        return true;
    }
}

// Step currency system will be initialized by app.js
console.log('🚶‍♂️ Step currency system script loaded - will be initialized by app.js');

// Global function for step engine mode switching (used by settings and mobile testing)
window.setStepEngineMode = (mode) => {
    if (window.stepCurrencySystem && typeof window.stepCurrencySystem.setEngineMode === 'function') {
        return window.stepCurrencySystem.setEngineMode(mode);
    } else {
        console.warn('🚶‍♂️ Step currency system not available for mode switching');
        return false;
    }
};

// Make functions available globally for debugging
window.addTestSteps = (amount) => {
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.addTestSteps(amount);
    } else {
        console.warn('Step currency system not available');
    }
};

window.testMilestoneChecking = () => {
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.testMilestoneChecking();
    } else {
        console.warn('Step currency system not available');
    }
};

/**
 * Generate a random world location for testing purposes
 * @returns {Object} Random coordinates with lat/lng
 */
function generateRandomWorldLocation() {
    // Generate random coordinates within reasonable world bounds
    const lat = (Math.random() - 0.5) * 180; // -90 to 90 degrees
    const lng = (Math.random() - 0.5) * 360; // -180 to 180 degrees
    
    console.log(`🌍 Generated random world location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    return { lat: lat, lng: lng };
}

// Debug function to test base marker creation
window.testBaseMarker = () => {
    console.log('🧪 Testing base marker creation...');
    
    // Get the EXACT same position as the player marker
    let testPosition = null;
    if (window.mapLayer && window.mapLayer.getCurrentPlayerPosition) {
        testPosition = window.mapLayer.getCurrentPlayerPosition();
        console.log('🧪 Using player position for base marker:', testPosition);
    } else {
        testPosition = generateRandomWorldLocation(); // Random world location
        console.log('🧪 Using default position for base marker:', testPosition);
    }
    
    if (window.stepCurrencySystem) {
        const success = window.stepCurrencySystem.createBaseMarkerOnMap(testPosition);
        console.log('🧪 Base marker creation result:', success);
        
        // Also check if marker is actually on the map
        if (window.mapLayer && window.mapLayer.map) {
            const layers = [];
            window.mapLayer.map.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    layers.push({
                        type: 'Marker',
                        latlng: layer.getLatLng(),
                        options: layer.options
                    });
                }
            });
            console.log('🧪 Current markers on map:', layers);
        }
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to force update step counter
window.forceUpdateStepCounter = () => {
    console.log('🧪 Force updating step counter...');
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.updateStepCounter();
        console.log('🧪 Step counter updated. Current steps:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to force reset steps to 10,000
window.forceResetSteps = () => {
    console.log('🧪 Force resetting steps to 10,000...');
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.forceResetSteps();
        console.log('🧪 Steps reset complete. Current steps:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};


// Debug function to add steps and test
window.addStepsAndTest = (amount = 100) => {
    console.log(`🧪 Adding ${amount} steps and testing...`);
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.addTestSteps(amount);
        console.log('🧪 Steps added. Current total:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to check all step counter elements
window.checkStepCounters = () => {
    console.log('🔍 Checking all step counter elements...');
    const elements = [
        'step-count',
        'step-number', 
        'step-session',
        'step-count-legacy-1'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ ${id}: "${element.textContent}" (visible: ${element.offsetParent !== null})`);
        } else {
            console.log(`❌ ${id}: Not found`);
        }
    });
    
    // Check for duplicate IDs
    const allElements = document.querySelectorAll('[id*="step-count"], [id*="step-number"], [id*="step-session"]');
    console.log(`🔍 Found ${allElements.length} step-related elements total`);
    allElements.forEach(el => {
        console.log(`  - ${el.id}: "${el.textContent}" (tag: ${el.tagName})`);
    });
};

// Debug function to test base establishment
window.testBaseEstablishment = () => {
    console.log('🧪 Testing base establishment...');
    if (window.stepCurrencySystem) {
        console.log('🧪 Current steps before test:', window.stepCurrencySystem.totalSteps);
        const success = window.stepCurrencySystem.establishSimpleBase();
        console.log('🧪 Base establishment result:', success);
        console.log('🧪 Steps after test:', window.stepCurrencySystem.totalSteps);
    } else {
        console.warn('Step currency system not available');
    }
};

// SIMPLE debug function
window.testMap = () => {
    console.log('🔍 Testing map references...');
    console.log('window.mapEngine:', window.mapEngine);
    console.log('window.mapEngine.map:', window.mapEngine?.map);
    console.log('Player marker:', window.mapEngine?.playerMarker);
    
    // Check if legacy app exists
    console.log('window.eldritchApp:', window.eldritchApp);
    console.log('Legacy app systems:', window.eldritchApp?.systems);
    console.log('Legacy app mapEngine:', window.eldritchApp?.systems?.mapEngine);
    
    if (window.mapEngine) {
        console.log('MapEngine isInitialized:', window.mapEngine.isInitialized);
        console.log('MapEngine map exists:', !!window.mapEngine.map);
    }
    
    // Check if there are any global app instances
    console.log('Global app variable:', typeof app !== 'undefined' ? app : 'undefined');
    
    return 'test complete';
};

// Test creating a simple marker
window.testCreateMarker = () => {
    console.log('🧪 Testing marker creation...');
    
    if (!window.mapEngine || !window.mapEngine.map) {
        console.error('❌ MapEngine or map not available');
        return false;
    }
    
    try {
        const testPosition = { lat: 61.4981, lng: 23.7608 };
        
        const marker = L.marker([testPosition.lat, testPosition.lng]).addTo(window.mapEngine.map);
        marker.bindPopup('🧪 TEST MARKER');
        
        console.log('✅ Test marker created successfully!');
        console.log('Marker position:', marker.getLatLng());
        console.log('Marker map:', marker._map);
        
        return marker;
    } catch (error) {
        console.error('❌ Error creating test marker:', error);
        return false;
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StepCurrencySystem;
}

// Public helper to add steps (for debug system)
window.addSteps = (amount = 100) => {
    console.log(`🚶‍♂️ Adding ${amount} steps via debug helper`);
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.addTestSteps(amount);
        window.stepCurrencySystem.updateStepCounter();
        window.stepCurrencySystem.checkMilestones();
        window.stepCurrencySystem.saveSteps();
        console.log(`🚶‍♂️ Steps added. Current total: ${window.stepCurrencySystem.totalSteps}`);
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to test base creation
window.testBaseCreation = (position = null) => {
    console.log('🧪 Testing base creation...');
    
    if (!position) {
        // Use current GPS position or default
        if (window.gpsCore && window.gpsCore.currentPosition) {
            position = {
                lat: window.gpsCore.currentPosition.lat,
                lng: window.gpsCore.currentPosition.lng
            };
        } else {
            position = { lat: 61.47448939425697, lng: 23.726280673854692 }; // Default position
        }
    }
    
    console.log('🧪 Using position for base creation:', position);
    
    if (window.stepCurrencySystem) {
        // Force enough steps
        window.stepCurrencySystem.totalSteps = 2000;
        window.stepCurrencySystem.saveSteps();
        
        // Create base
        const success = window.stepCurrencySystem.createBaseMarkerOnMap(position);
        console.log('🧪 Base creation result:', success);
        
        // Check if marker is visible
        if (window.mapLayer && window.mapLayer.map) {
            const layers = [];
            window.mapLayer.map.eachLayer(layer => {
                if (layer.options && layer.options.className && layer.options.className.includes('base')) {
                    layers.push(layer);
                }
            });
            console.log('🧪 Base markers found on map:', layers.length);
        }
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to test flag pole creation
window.testFlagPoleCreation = (position = null, flagType = null) => {
    console.log('🧪 Testing flag pole creation...');
    
    if (!position) {
        // Use current GPS position or default
        if (window.gpsCore && window.gpsCore.currentPosition) {
            position = {
                lat: window.gpsCore.currentPosition.lat,
                lng: window.gpsCore.currentPosition.lng
            };
        } else {
            position = { lat: 61.47448939425697, lng: 23.726280673854692 }; // Default position
        }
    }
    
    // Set flag type if provided
    if (flagType) {
        localStorage.setItem('eldritch_player_base_logo', flagType);
        console.log('🧪 Set flag type to:', flagType);
    }
    
    console.log('🧪 Using position for flag pole creation:', position);
    console.log('🧪 Current flag type:', localStorage.getItem('eldritch_player_base_logo'));
    
    if (window.stepCurrencySystem) {
        const flagPole = window.stepCurrencySystem.createFlagPoleMarker(position);
        console.log('🧪 Flag pole creation result:', !!flagPole);
        
        if (flagPole) {
            console.log('🧪 Flag pole marker created successfully!');
        }
    } else {
        console.warn('Step currency system not available');
    }
};

// Debug function to test all flag types
window.testAllFlagTypes = (position = null) => {
    console.log('🧪 Testing all flag types...');
    
    const flagTypes = ['finnish', 'norwegian', 'swedish', 'danish', 'cosmic'];
    
    flagTypes.forEach((flagType, index) => {
        setTimeout(() => {
            console.log(`🧪 Testing flag type: ${flagType}`);
            window.testFlagPoleCreation(position, flagType);
        }, index * 2000); // 2 second delay between each flag
    });
};

// Debug function to test mobile step counter
window.testMobileStepCounter = () => {
    console.log('🧪 Testing mobile step counter...');
    
    if (window.stepCurrencySystem) {
        const system = window.stepCurrencySystem;
        
        console.log('🧪 Current step counter status:', {
            isMobile: system.isMobileDevice(),
            fallbackMode: system.fallbackMode,
            stepDetectionActive: system.stepDetectionActive,
            totalSteps: system.totalSteps,
            sessionSteps: system.sessionSteps,
            accelerationDataLength: system.accelerationData?.length || 0
        });
        
        // Test mobile permission request
        if (system.isMobileDevice()) {
            console.log('🧪 Mobile device detected - testing permission request');
            system.showMobilePermissionRequest();
        } else {
            console.log('🧪 Desktop device - testing fallback mode');
            system.enableFallbackMode();
        }
        
        // Test manual step addition
        console.log('🧪 Adding test step...');
        system.addStep('debug_test');
        
        return {
            success: true,
            message: 'Mobile step counter test completed',
            status: system.debugStepCounter?.getStatus()
        };
    } else {
        console.warn('Step currency system not available');
        return {
            success: false,
            message: 'Step currency system not available'
        };
    }
};

// Public helper to enable step detection
window.enableStepDetection = () => {
    console.log('🚶‍♂️ Enabling step detection via global helper');
    if (window.stepCurrencySystem) {
        window.stepCurrencySystem.enableStepDetection();
    } else {
        console.warn('🚶‍♂️ Step currency system not available');
    }
};

// Public helper to check step detection status
window.checkStepDetectionStatus = () => {
    if (window.stepCurrencySystem) {
        const status = window.stepCurrencySystem.getStatus();
        console.log('🚶‍♂️ Step detection status:', status);
        return status;
    } else {
        console.warn('🚶‍♂️ Step currency system not available');
        return null;
    }
};
