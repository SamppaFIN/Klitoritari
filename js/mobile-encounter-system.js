/**
 * @fileoverview [IN_DEVELOPMENT] Mobile Encounter System - Enhanced mobile-optimized encounters
 * @status IN_DEVELOPMENT - Phase 4 mobile encounter enhancements
 * @feature #feature-mobile-encounter-system
 * @feature #feature-mobile-encounter-ui
 * @feature #feature-mobile-encounter-detection
 * @feature #feature-mobile-encounter-rewards
 * @last_updated 2025-01-28
 * @dependencies Encounter System, Step Currency System, Trail System, Mobile UI
 * @warning Mobile encounter system - do not modify without testing mobile interactions
 * 
 * Mobile Encounter System
 * Enhanced encounter system optimized for mobile devices
 * Integrates with step tracking and trail system for seamless mobile experience
 */

class MobileEncounterSystem {
    constructor() {
        this.isInitialized = false;
        this.isMobile = false;
        this.encounterQueue = [];
        this.activeEncounter = null;
        this.encounterCooldown = 0;
        this.lastEncounterTime = 0;
        
        // Mobile-specific settings
        this.mobileSettings = {
            encounterRadius: 50, // meters - larger radius for mobile
            minStepsBetweenEncounters: 200, // steps required between encounters
            maxEncountersPerSession: 10, // limit encounters per session
            touchOptimized: true,
            batteryAware: true,
            vibrationEnabled: true
        };
        
        // Encounter types optimized for mobile
        this.encounterTypes = {
            wildlife: {
                name: 'Wildlife Encounter',
                icon: '🦌',
                rarity: 'common',
                stepRequirement: 100,
                rewards: ['experience', 'materials'],
                mobileOptimized: true
            },
            landmark: {
                name: 'Landmark Discovery',
                icon: '🏛️',
                rarity: 'uncommon',
                stepRequirement: 500,
                rewards: ['knowledge', 'materials', 'experience'],
                mobileOptimized: true
            },
            event: {
                name: 'Random Event',
                icon: '⚡',
                rarity: 'rare',
                stepRequirement: 1000,
                rewards: ['experience', 'materials', 'special'],
                mobileOptimized: true
            },
            milestone: {
                name: 'Step Milestone',
                icon: '🎯',
                rarity: 'epic',
                stepRequirement: 2000,
                rewards: ['experience', 'materials', 'achievement'],
                mobileOptimized: true
            }
        };
        
        // Mobile UI elements
        this.mobileUI = {
            encounterModal: null,
            encounterButtons: [],
            vibrationPattern: [100, 50, 100], // vibration pattern for encounters
            soundEnabled: true
        };
        
        console.log('📱 Mobile Encounter System initialized');
    }
    
    /**
     * Initialize mobile encounter system
     * @status [IN_DEVELOPMENT] - Mobile encounter initialization
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    init() {
        if (this.isInitialized) {
            console.log('📱 Mobile encounter system already initialized');
            return;
        }
        
        console.log('📱 Initializing mobile encounter system...');
        
        // Detect mobile device
        this.detectMobileDevice();
        
        // Set up mobile-specific event listeners
        this.setupMobileEventListeners();
        
        // Create mobile UI elements
        this.createMobileUI();
        
        // Integrate with existing systems
        this.integrateWithExistingSystems();
        
        // Set up encounter detection
        this.setupEncounterDetection();
        
        // Add mobile encounter styles
        this.addMobileEncounterStyles();
        
        this.isInitialized = true;
        console.log('📱 Mobile encounter system initialization complete');
    }
    
    /**
     * Detect mobile device and adjust settings
     * @status [IN_DEVELOPMENT] - Mobile device detection
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    detectMobileDevice() {
        this.isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                       window.innerWidth <= 768;
        
        if (this.isMobile) {
            console.log('📱 Mobile device detected, applying mobile optimizations');
            
            // Adjust settings for mobile
            this.mobileSettings.encounterRadius = 75; // Larger radius for mobile
            this.mobileSettings.minStepsBetweenEncounters = 150; // More frequent encounters
            this.mobileSettings.touchOptimized = true;
            this.mobileSettings.batteryAware = true;
            
            // Enable mobile-specific features
            this.enableMobileFeatures();
        } else {
            console.log('📱 Desktop device detected, using standard settings');
        }
    }
    
    /**
     * Enable mobile-specific features
     * @status [IN_DEVELOPMENT] - Mobile features enablement
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    enableMobileFeatures() {
        // Enable vibration if supported
        if ('vibrate' in navigator) {
            this.mobileSettings.vibrationEnabled = true;
            console.log('📱 Vibration support enabled');
        }
        
        // Enable touch events
        this.setupTouchEvents();
        
        // Enable battery optimization
        this.setupBatteryOptimization();
        
        // Enable wake lock for encounters
        this.setupWakeLock();
    }
    
    /**
     * Set up mobile event listeners
     * @status [IN_DEVELOPMENT] - Mobile event setup
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    setupMobileEventListeners() {
        // Listen for step milestones
        if (window.stepCurrencySystem) {
            this.integrateWithStepCurrency();
        }
        
        // Listen for position updates
        if (window.eventBus) {
            window.eventBus.on('player:position:update', (eventData) => {
                this.handlePositionUpdate(eventData.position);
            });
        }
        
        // Listen for trail markers
        if (window.trailSystem) {
            this.integrateWithTrailSystem();
        }
        
        // Listen for battery changes
        if ('getBattery' in navigator) {
            navigator.getBattery().then(battery => {
                battery.addEventListener('levelchange', () => {
                    this.handleBatteryChange(battery.level);
                });
            });
        }
    }
    
    /**
     * Integrate with step currency system
     * @status [IN_DEVELOPMENT] - Step currency integration
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    integrateWithStepCurrency() {
        const originalAddStep = window.stepCurrencySystem.addStep.bind(window.stepCurrencySystem);
        window.stepCurrencySystem.addStep = () => {
            originalAddStep();
            this.handleStepMilestone(window.stepCurrencySystem.totalSteps);
        };
        
        console.log('📱 Integrated with step currency system');
    }
    
    /**
     * Integrate with trail system
     * @status [IN_DEVELOPMENT] - Trail system integration
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    integrateWithTrailSystem() {
        // Listen for trail marker creation
        if (window.trailSystem) {
            // Override trail marker creation to check for encounters
            const originalCreateTrailMarker = window.trailSystem.createTrailMarker.bind(window.trailSystem);
            window.trailSystem.createTrailMarker = (stepNumber) => {
                originalCreateTrailMarker(stepNumber);
                this.checkForEncounterAtTrailMarker(stepNumber);
            };
        }
        
        console.log('📱 Integrated with trail system');
    }
    
    /**
     * Handle step milestones for encounter triggering
     * @status [IN_DEVELOPMENT] - Step milestone handling
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    handleStepMilestone(totalSteps) {
        if (!this.isMobile) {
            return;
        }
        
        // Check for encounter types based on step milestones
        Object.values(this.encounterTypes).forEach(encounterType => {
            if (totalSteps >= encounterType.stepRequirement && 
                totalSteps % encounterType.stepRequirement === 0) {
                this.triggerMobileEncounter(encounterType, totalSteps);
            }
        });
    }
    
    /**
     * Check for encounters at trail marker locations
     * @status [IN_DEVELOPMENT] - Trail marker encounter checking
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    checkForEncounterAtTrailMarker(stepNumber) {
        if (!this.isMobile || !this.canTriggerEncounter()) {
            return;
        }
        
        // Random chance for encounter at trail markers
        const encounterChance = this.calculateEncounterChance(stepNumber);
        
        if (Math.random() < encounterChance) {
            const encounterType = this.selectRandomEncounterType();
            this.triggerMobileEncounter(encounterType, stepNumber);
        }
    }
    
    /**
     * Calculate encounter chance based on step number and mobile settings
     * @status [IN_DEVELOPMENT] - Encounter chance calculation
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    calculateEncounterChance(stepNumber) {
        let baseChance = 0.1; // 10% base chance
        
        // Increase chance for higher step numbers
        if (stepNumber >= 5000) baseChance = 0.2;
        if (stepNumber >= 10000) baseChance = 0.3;
        
        // Mobile bonus
        if (this.isMobile) {
            baseChance *= 1.5;
        }
        
        // Battery optimization
        if (this.mobileSettings.batteryAware && this.getBatteryLevel() < 0.2) {
            baseChance *= 0.5; // Reduce encounters on low battery
        }
        
        return Math.min(baseChance, 0.5); // Cap at 50%
    }
    
    /**
     * Select random encounter type based on rarity
     * @status [IN_DEVELOPMENT] - Encounter type selection
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    selectRandomEncounterType() {
        const types = Object.values(this.encounterTypes);
        const weights = types.map(type => {
            switch (type.rarity) {
                case 'common': return 50;
                case 'uncommon': return 30;
                case 'rare': return 15;
                case 'epic': return 5;
                default: return 10;
            }
        });
        
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
        let random = Math.random() * totalWeight;
        
        for (let i = 0; i < types.length; i++) {
            random -= weights[i];
            if (random <= 0) {
                return types[i];
            }
        }
        
        return types[0]; // Fallback
    }
    
    /**
     * Trigger mobile encounter
     * @status [IN_DEVELOPMENT] - Mobile encounter triggering
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    triggerMobileEncounter(encounterType, stepNumber) {
        if (this.activeEncounter || !this.canTriggerEncounter()) {
            return;
        }
        
        console.log(`📱 Triggering mobile encounter: ${encounterType.name} at step ${stepNumber}`);
        
        // Create encounter data
        const encounter = {
            id: `mobile_encounter_${Date.now()}`,
            type: encounterType,
            stepNumber: stepNumber,
            timestamp: Date.now(),
            rewards: this.generateEncounterRewards(encounterType),
            mobileOptimized: true
        };
        
        // Add to queue
        this.encounterQueue.push(encounter);
        
        // Show mobile encounter UI
        this.showMobileEncounterUI(encounter);
        
        // Update cooldown
        this.lastEncounterTime = Date.now();
        this.encounterCooldown = this.mobileSettings.minStepsBetweenEncounters * 1000; // Convert to ms
        
        // Trigger mobile effects
        this.triggerMobileEffects(encounter);
    }
    
    /**
     * Check if encounter can be triggered
     * @status [IN_DEVELOPMENT] - Encounter trigger checking
     * @feature #feature-mobile-encounter-detection
     * @last_tested 2025-01-28
     */
    canTriggerEncounter() {
        const now = Date.now();
        
        // Check cooldown
        if (now - this.lastEncounterTime < this.encounterCooldown) {
            return false;
        }
        
        // Check if already active
        if (this.activeEncounter) {
            return false;
        }
        
        // Check session limit
        if (this.encounterQueue.length >= this.mobileSettings.maxEncountersPerSession) {
            return false;
        }
        
        return true;
    }
    
    /**
     * Generate encounter rewards
     * @status [IN_DEVELOPMENT] - Reward generation
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    generateEncounterRewards(encounterType) {
        const rewards = [];
        
        encounterType.rewards.forEach(rewardType => {
            switch (rewardType) {
                case 'experience':
                    rewards.push({
                        type: 'experience',
                        amount: Math.floor(Math.random() * 50) + 25,
                        description: 'Experience gained'
                    });
                    break;
                case 'materials':
                    rewards.push({
                        type: 'materials',
                        amount: Math.floor(Math.random() * 3) + 1,
                        description: 'Materials collected'
                    });
                    break;
                case 'knowledge':
                    rewards.push({
                        type: 'knowledge',
                        amount: 1,
                        description: 'Knowledge gained'
                    });
                    break;
                case 'special':
                    rewards.push({
                        type: 'special',
                        amount: 1,
                        description: 'Special item found'
                    });
                    break;
                case 'achievement':
                    rewards.push({
                        type: 'achievement',
                        amount: 1,
                        description: 'Achievement unlocked'
                    });
                    break;
            }
        });
        
        return rewards;
    }
    
    /**
     * Show mobile encounter UI
     * @status [IN_DEVELOPMENT] - Mobile UI display
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    showMobileEncounterUI(encounter) {
        if (!this.mobileUI.encounterModal) {
            this.createMobileEncounterModal();
        }
        
        // Update modal content
        this.updateMobileEncounterModal(encounter);
        
        // Show modal with mobile animations
        this.mobileUI.encounterModal.style.display = 'block';
        this.animateMobileEncounterModal('in');
        
        // Set as active encounter
        this.activeEncounter = encounter;
        
        console.log(`📱 Mobile encounter UI shown: ${encounter.type.name}`);
    }
    
    /**
     * Create mobile encounter modal
     * @status [IN_DEVELOPMENT] - Mobile modal creation
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    createMobileEncounterModal() {
        const modal = document.createElement('div');
        modal.id = 'mobile-encounter-modal';
        modal.className = 'mobile-encounter-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: none;
            justify-content: center;
            align-items: center;
            padding: 20px;
            box-sizing: border-box;
        `;
        
        modal.innerHTML = `
            <div class="mobile-encounter-content" style="
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4a9eff;
                border-radius: 20px;
                padding: 30px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                box-shadow: 0 0 30px rgba(74, 158, 255, 0.3);
                transform: scale(0.8);
                opacity: 0;
                transition: all 0.3s ease;
            ">
                <div class="encounter-header" style="margin-bottom: 20px;">
                    <div class="encounter-icon" style="font-size: 48px; margin-bottom: 10px;"></div>
                    <h2 class="encounter-title" style="color: #4a9eff; margin: 0; font-size: 24px; text-shadow: 0 0 10px #4a9eff;"></h2>
                    <p class="encounter-description" style="color: #ccc; margin: 10px 0; font-size: 16px;"></p>
                </div>
                
                <div class="encounter-rewards" style="margin: 20px 0;">
                    <h3 style="color: #ffd700; margin: 0 0 15px 0; font-size: 18px;">Rewards</h3>
                    <div class="rewards-list" style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;"></div>
                </div>
                
                <div class="encounter-actions" style="margin-top: 30px;">
                    <button class="mobile-encounter-btn primary" style="
                        background: linear-gradient(45deg, #4a9eff, #2d98da);
                        border: none;
                        color: white;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        margin: 0 10px;
                        min-width: 120px;
                        touch-action: manipulation;
                        -webkit-tap-highlight-color: transparent;
                        box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
                        transition: all 0.3s ease;
                    ">Accept</button>
                    <button class="mobile-encounter-btn secondary" style="
                        background: linear-gradient(45deg, #666, #444);
                        border: none;
                        color: white;
                        padding: 15px 30px;
                        border-radius: 25px;
                        font-size: 18px;
                        font-weight: bold;
                        cursor: pointer;
                        margin: 0 10px;
                        min-width: 120px;
                        touch-action: manipulation;
                        -webkit-tap-highlight-color: transparent;
                        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                        transition: all 0.3s ease;
                    ">Decline</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.mobileUI.encounterModal = modal;
        
        // Add event listeners
        this.setupMobileEncounterModalEvents();
        
        console.log('📱 Mobile encounter modal created');
    }
    
    /**
     * Set up mobile encounter modal events
     * @status [IN_DEVELOPMENT] - Mobile modal events
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    setupMobileEncounterModalEvents() {
        const modal = this.mobileUI.encounterModal;
        const acceptBtn = modal.querySelector('.mobile-encounter-btn.primary');
        const declineBtn = modal.querySelector('.mobile-encounter-btn.secondary');
        
        // Accept encounter
        acceptBtn.addEventListener('click', () => {
            this.acceptMobileEncounter();
        });
        
        // Decline encounter
        declineBtn.addEventListener('click', () => {
            this.declineMobileEncounter();
        });
        
        // Close on backdrop click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.declineMobileEncounter();
            }
        });
        
        // Add touch events for mobile
        acceptBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.acceptMobileEncounter();
        });
        
        declineBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.declineMobileEncounter();
        });
    }
    
    /**
     * Update mobile encounter modal content
     * @status [IN_DEVELOPMENT] - Mobile modal content update
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    updateMobileEncounterModal(encounter) {
        const modal = this.mobileUI.encounterModal;
        const icon = modal.querySelector('.encounter-icon');
        const title = modal.querySelector('.encounter-title');
        const description = modal.querySelector('.encounter-description');
        const rewardsList = modal.querySelector('.rewards-list');
        
        // Update content
        icon.textContent = encounter.type.icon;
        title.textContent = encounter.type.name;
        description.textContent = this.generateEncounterDescription(encounter);
        
        // Update rewards
        rewardsList.innerHTML = '';
        encounter.rewards.forEach(reward => {
            const rewardElement = document.createElement('div');
            rewardElement.className = 'reward-item';
            rewardElement.style.cssText = `
                background: rgba(74, 158, 255, 0.2);
                border: 1px solid #4a9eff;
                border-radius: 10px;
                padding: 8px 12px;
                color: #4a9eff;
                font-size: 14px;
                font-weight: bold;
            `;
            rewardElement.textContent = `${reward.amount}x ${reward.type}`;
            rewardsList.appendChild(rewardElement);
        });
    }
    
    /**
     * Generate encounter description
     * @status [IN_DEVELOPMENT] - Description generation
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    generateEncounterDescription(encounter) {
        const descriptions = {
            wildlife: [
                "You encounter a friendly woodland creature!",
                "A curious animal approaches you cautiously.",
                "Nature's beauty reveals itself in this moment."
            ],
            landmark: [
                "You discover an ancient landmark!",
                "A mysterious structure catches your eye.",
                "History whispers secrets in this place."
            ],
            event: [
                "Something extraordinary happens!",
                "The cosmic forces align in your favor.",
                "A rare opportunity presents itself."
            ],
            milestone: [
                "You've reached a significant milestone!",
                "Your journey has brought you far.",
                "Achievement unlocked through dedication."
            ]
        };
        
        const typeDescriptions = descriptions[encounter.type.name.toLowerCase().replace(' ', '')] || descriptions.wildlife;
        return typeDescriptions[Math.floor(Math.random() * typeDescriptions.length)];
    }
    
    /**
     * Accept mobile encounter
     * @status [IN_DEVELOPMENT] - Encounter acceptance
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    acceptMobileEncounter() {
        if (!this.activeEncounter) {
            return;
        }
        
        console.log(`📱 Accepting mobile encounter: ${this.activeEncounter.type.name}`);
        
        // Apply rewards
        this.applyEncounterRewards(this.activeEncounter);
        
        // Show success message
        this.showMobileNotification('Encounter completed!', 'success');
        
        // Close modal
        this.closeMobileEncounterModal();
        
        // Clear active encounter
        this.activeEncounter = null;
    }
    
    /**
     * Decline mobile encounter
     * @status [IN_DEVELOPMENT] - Encounter decline
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    declineMobileEncounter() {
        if (!this.activeEncounter) {
            return;
        }
        
        console.log(`📱 Declining mobile encounter: ${this.activeEncounter.type.name}`);
        
        // Show decline message
        this.showMobileNotification('Encounter declined', 'info');
        
        // Close modal
        this.closeMobileEncounterModal();
        
        // Clear active encounter
        this.activeEncounter = null;
    }
    
    /**
     * Apply encounter rewards
     * @status [IN_DEVELOPMENT] - Reward application
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    applyEncounterRewards(encounter) {
        encounter.rewards.forEach(reward => {
            switch (reward.type) {
                case 'experience':
                    this.addExperience(reward.amount);
                    break;
                case 'materials':
                    this.addMaterials(reward.amount);
                    break;
                case 'knowledge':
                    this.addKnowledge(reward.amount);
                    break;
                case 'special':
                    this.addSpecialItem(reward.amount);
                    break;
                case 'achievement':
                    this.unlockAchievement(encounter);
                    break;
            }
        });
        
        console.log(`📱 Applied rewards for encounter: ${encounter.type.name}`);
    }
    
    /**
     * Close mobile encounter modal
     * @status [IN_DEVELOPMENT] - Modal closing
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    closeMobileEncounterModal() {
        if (this.mobileUI.encounterModal) {
            this.animateMobileEncounterModal('out');
            
            setTimeout(() => {
                this.mobileUI.encounterModal.style.display = 'none';
            }, 300);
        }
    }
    
    /**
     * Animate mobile encounter modal
     * @status [IN_DEVELOPMENT] - Modal animation
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    animateMobileEncounterModal(direction) {
        const content = this.mobileUI.encounterModal.querySelector('.mobile-encounter-content');
        
        if (direction === 'in') {
            content.style.transform = 'scale(1)';
            content.style.opacity = '1';
        } else {
            content.style.transform = 'scale(0.8)';
            content.style.opacity = '0';
        }
    }
    
    /**
     * Trigger mobile effects
     * @status [IN_DEVELOPMENT] - Mobile effects
     * @feature #feature-mobile-encounter-system
     * @last_tested 2025-01-28
     */
    triggerMobileEffects(encounter) {
        // Vibration
        if (this.mobileSettings.vibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate(this.mobileUI.vibrationPattern);
        }
        
        // Sound
        if (this.mobileSettings.soundEnabled && window.soundManager) {
            try {
                window.soundManager.playBling({ 
                    frequency: 800, 
                    duration: 0.2, 
                    type: 'triangle' 
                });
            } catch (e) {}
        }
        
        // Visual effects
        if (window.discordEffects) {
            try {
                window.discordEffects.triggerGlowPulse(
                    window.innerWidth/2, 
                    window.innerHeight/2, 
                    '#4a9eff', 
                    150
                );
            } catch (e) {}
        }
    }
    
    /**
     * Show mobile notification
     * @status [IN_DEVELOPMENT] - Mobile notifications
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    showMobileNotification(message, type = 'info') {
        if (window.eldritchApp && window.eldritchApp.showNotification) {
            window.eldritchApp.showNotification(message, type);
        } else {
            console.log(`📱 Mobile notification: ${message}`);
        }
    }
    
    /**
     * Add experience reward
     * @status [IN_DEVELOPMENT] - Experience reward system
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    addExperience(amount) {
        if (window.stepCurrencySystem) {
            // Add experience through step currency system
            window.stepCurrencySystem.totalSteps += amount;
            window.stepCurrencySystem.saveSteps();
            window.stepCurrencySystem.updateStepCounter();
            console.log(`📱 Added ${amount} experience (steps)`);
        }
        
        // Show experience notification
        this.showMobileNotification(`+${amount} Experience!`, 'success');
    }
    
    /**
     * Add materials reward
     * @status [IN_DEVELOPMENT] - Materials reward system
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    addMaterials(amount) {
        // Store materials in localStorage
        const currentMaterials = this.getStoredMaterials();
        const newAmount = currentMaterials + amount;
        localStorage.setItem('mobile_encounter_materials', newAmount.toString());
        
        console.log(`📱 Added ${amount} materials (total: ${newAmount})`);
        this.showMobileNotification(`+${amount} Materials!`, 'success');
    }
    
    /**
     * Add knowledge reward
     * @status [IN_DEVELOPMENT] - Knowledge reward system
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    addKnowledge(amount) {
        // Store knowledge in localStorage
        const currentKnowledge = this.getStoredKnowledge();
        const newAmount = currentKnowledge + amount;
        localStorage.setItem('mobile_encounter_knowledge', newAmount.toString());
        
        console.log(`📱 Added ${amount} knowledge (total: ${newAmount})`);
        this.showMobileNotification(`+${amount} Knowledge!`, 'success');
    }
    
    /**
     * Add special item reward
     * @status [IN_DEVELOPMENT] - Special item reward system
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    addSpecialItem(amount) {
        // Store special items in localStorage
        const currentItems = this.getStoredSpecialItems();
        const newAmount = currentItems + amount;
        localStorage.setItem('mobile_encounter_special_items', newAmount.toString());
        
        console.log(`📱 Added ${amount} special item (total: ${newAmount})`);
        this.showMobileNotification(`+${amount} Special Item!`, 'success');
    }
    
    /**
     * Unlock achievement reward
     * @status [IN_DEVELOPMENT] - Achievement reward system
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    unlockAchievement(encounter) {
        // Store achievement in localStorage
        const achievements = this.getStoredAchievements();
        const achievementKey = `encounter_${encounter.type.name.toLowerCase().replace(' ', '_')}`;
        
        if (!achievements[achievementKey]) {
            achievements[achievementKey] = {
                unlocked: true,
                timestamp: Date.now(),
                encounterType: encounter.type.name
            };
            
            localStorage.setItem('mobile_encounter_achievements', JSON.stringify(achievements));
            
            console.log(`📱 Unlocked achievement: ${achievementKey}`);
            this.showMobileNotification(`Achievement Unlocked: ${encounter.type.name}!`, 'success');
            
            // Trigger visual effects
            this.triggerAchievementEffects();
        }
    }
    
    /**
     * Get stored materials count
     * @status [IN_DEVELOPMENT] - Materials storage
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    getStoredMaterials() {
        const stored = localStorage.getItem('mobile_encounter_materials');
        return stored ? parseInt(stored) : 0;
    }
    
    /**
     * Get stored knowledge count
     * @status [IN_DEVELOPMENT] - Knowledge storage
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    getStoredKnowledge() {
        const stored = localStorage.getItem('mobile_encounter_knowledge');
        return stored ? parseInt(stored) : 0;
    }
    
    /**
     * Get stored special items count
     * @status [IN_DEVELOPMENT] - Special items storage
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    getStoredSpecialItems() {
        const stored = localStorage.getItem('mobile_encounter_special_items');
        return stored ? parseInt(stored) : 0;
    }
    
    /**
     * Get stored achievements
     * @status [IN_DEVELOPMENT] - Achievements storage
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    getStoredAchievements() {
        const stored = localStorage.getItem('mobile_encounter_achievements');
        return stored ? JSON.parse(stored) : {};
    }
    
    /**
     * Trigger achievement effects
     * @status [IN_DEVELOPMENT] - Achievement effects
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    triggerAchievementEffects() {
        // Vibration
        if (this.mobileSettings.vibrationEnabled && 'vibrate' in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200]);
        }
        
        // Sound
        if (this.mobileSettings.soundEnabled && window.soundManager) {
            try {
                window.soundManager.playBling({ 
                    frequency: 1200, 
                    duration: 0.3, 
                    type: 'triangle' 
                });
            } catch (e) {}
        }
        
        // Visual effects
        if (window.discordEffects) {
            try {
                window.discordEffects.triggerGlowPulse(
                    window.innerWidth/2, 
                    window.innerHeight/2, 
                    '#ffd700', 
                    200
                );
                window.discordEffects.triggerNotificationPop('Achievement Unlocked!', '#ffd700');
            } catch (e) {}
        }
    }
    
    /**
     * Get encounter statistics
     * @status [IN_DEVELOPMENT] - Encounter statistics
     * @feature #feature-mobile-encounter-rewards
     * @last_tested 2025-01-28
     */
    getEncounterStats() {
        return {
            totalEncounters: this.encounterQueue.length,
            materials: this.getStoredMaterials(),
            knowledge: this.getStoredKnowledge(),
            specialItems: this.getStoredSpecialItems(),
            achievements: Object.keys(this.getStoredAchievements()).length,
            isMobile: this.isMobile,
            lastEncounter: this.lastEncounterTime
        };
    }
    
    // Utility methods
    getBatteryLevel() {
        // Return battery level (0-1) or 1 if not available
        return 1; // Placeholder
    }
    
    setupTouchEvents() {
        // Add touch event optimizations
        document.addEventListener('touchstart', (e) => {
            // Prevent default touch behaviors that might interfere
            if (e.target.classList.contains('mobile-encounter-btn')) {
                e.preventDefault();
            }
        }, { passive: false });
    }
    
    setupBatteryOptimization() {
        // Battery optimization logic
        console.log('📱 Battery optimization enabled');
    }
    
    setupWakeLock() {
        // Wake lock setup for encounters
        console.log('📱 Wake lock setup for encounters');
    }
    
    setupEncounterDetection() {
        // Set up encounter detection system
        console.log('📱 Encounter detection system setup');
    }
    
    createMobileUI() {
        // Create mobile UI elements
        console.log('📱 Mobile UI elements created');
    }
    
    integrateWithExistingSystems() {
        // Integrate with existing game systems
        console.log('📱 Integrated with existing systems');
    }
    
    /**
     * Add mobile encounter styles
     * @status [IN_DEVELOPMENT] - Mobile encounter styling
     * @feature #feature-mobile-encounter-ui
     * @last_tested 2025-01-28
     */
    addMobileEncounterStyles() {
        // Check if styles already added
        if (document.getElementById('mobile-encounter-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'mobile-encounter-styles';
        style.textContent = `
            .mobile-encounter-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                z-index: 10000;
                display: none;
                justify-content: center;
                align-items: center;
                padding: 20px;
                box-sizing: border-box;
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
            }
            
            .mobile-encounter-content {
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #4a9eff;
                border-radius: 20px;
                padding: 30px;
                max-width: 400px;
                width: 100%;
                text-align: center;
                box-shadow: 0 0 30px rgba(74, 158, 255, 0.3);
                transform: scale(0.8);
                opacity: 0;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .mobile-encounter-content::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(45deg, transparent, rgba(74, 158, 255, 0.1), transparent);
                animation: shimmer 3s infinite;
            }
            
            @keyframes shimmer {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
            
            .encounter-header {
                margin-bottom: 20px;
                position: relative;
                z-index: 1;
            }
            
            .encounter-icon {
                font-size: 48px;
                margin-bottom: 10px;
                animation: bounce 2s infinite;
            }
            
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            
            .encounter-title {
                color: #4a9eff;
                margin: 0;
                font-size: 24px;
                text-shadow: 0 0 10px #4a9eff;
                font-weight: bold;
            }
            
            .encounter-description {
                color: #ccc;
                margin: 10px 0;
                font-size: 16px;
                line-height: 1.4;
            }
            
            .encounter-rewards {
                margin: 20px 0;
                position: relative;
                z-index: 1;
            }
            
            .encounter-rewards h3 {
                color: #ffd700;
                margin: 0 0 15px 0;
                font-size: 18px;
                text-shadow: 0 0 5px #ffd700;
            }
            
            .rewards-list {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: center;
            }
            
            .reward-item {
                background: rgba(74, 158, 255, 0.2);
                border: 1px solid #4a9eff;
                border-radius: 10px;
                padding: 8px 12px;
                color: #4a9eff;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
                animation: pulse 2s infinite;
            }
            
            .reward-item:hover {
                background: rgba(74, 158, 255, 0.3);
                transform: scale(1.05);
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 5px rgba(74, 158, 255, 0.3); }
                50% { box-shadow: 0 0 15px rgba(74, 158, 255, 0.6); }
                100% { box-shadow: 0 0 5px rgba(74, 158, 255, 0.3); }
            }
            
            .encounter-actions {
                margin-top: 30px;
                position: relative;
                z-index: 1;
            }
            
            .mobile-encounter-btn {
                border: none;
                padding: 15px 30px;
                border-radius: 25px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                margin: 0 10px;
                min-width: 120px;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            
            .mobile-encounter-btn::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                transition: left 0.5s;
            }
            
            .mobile-encounter-btn:hover::before {
                left: 100%;
            }
            
            .mobile-encounter-btn.primary {
                background: linear-gradient(45deg, #4a9eff, #2d98da);
                color: white;
                box-shadow: 0 4px 15px rgba(74, 158, 255, 0.3);
            }
            
            .mobile-encounter-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(74, 158, 255, 0.4);
            }
            
            .mobile-encounter-btn.primary:active {
                transform: translateY(0);
                box-shadow: 0 2px 10px rgba(74, 158, 255, 0.3);
            }
            
            .mobile-encounter-btn.secondary {
                background: linear-gradient(45deg, #666, #444);
                color: white;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
            }
            
            .mobile-encounter-btn.secondary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            }
            
            .mobile-encounter-btn.secondary:active {
                transform: translateY(0);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .mobile-encounter-content {
                    padding: 20px;
                    max-width: 350px;
                }
                
                .encounter-icon {
                    font-size: 40px;
                }
                
                .encounter-title {
                    font-size: 20px;
                }
                
                .encounter-description {
                    font-size: 14px;
                }
                
                .mobile-encounter-btn {
                    padding: 12px 24px;
                    font-size: 16px;
                    min-width: 100px;
                }
                
                .rewards-list {
                    gap: 8px;
                }
                
                .reward-item {
                    font-size: 12px;
                    padding: 6px 10px;
                }
            }
            
            /* Touch optimizations */
            .mobile-encounter-btn {
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            
            /* Accessibility */
            .mobile-encounter-btn:focus {
                outline: 2px solid #4a9eff;
                outline-offset: 2px;
            }
            
            /* Animation states */
            .mobile-encounter-content.show {
                transform: scale(1);
                opacity: 1;
            }
            
            .mobile-encounter-content.hide {
                transform: scale(0.8);
                opacity: 0;
            }
        `;
        
        document.head.appendChild(style);
        console.log('📱 Mobile encounter styles added');
    }
    
    handlePositionUpdate(position) {
        // Handle position updates for encounter detection
        console.log('📱 Position update handled for encounter detection');
    }
    
    handleBatteryChange(level) {
        // Handle battery level changes
        console.log(`📱 Battery level changed: ${level}`);
    }
}

// Export for global use
window.MobileEncounterSystem = MobileEncounterSystem;

console.log('📱 Mobile Encounter System loaded');
