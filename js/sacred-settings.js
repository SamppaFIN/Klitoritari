/**
 * @fileoverview Sacred Settings System for Eldritch Sanctuary
 * @status [ACTIVE] - User control and consciousness integration
 * @feature #feature-sacred-settings
 * @feature #feature-user-control
 * @feature #feature-consciousness-integration
 * @last_updated 2025-01-29
 * @dependencies SupabaseClient
 * 
 * Sacred Settings System
 * Provides user control over immersion, privacy, accessibility, and cosmic features
 */

class SacredSettings {
    constructor() {
        this.instanceId = 'sacred-settings-' + Date.now();
        console.log('⚙️ Sacred Settings System initialized');
        
        // Default settings following Monk Muse principles
        this.defaultSettings = {
            immersion: {
                level: 'default', // 'low', 'default', 'high'
                particles: true,
                sacredGeometry: true,
                auraPulses: true,
                cosmicEffects: true,
                particleDensity: 'medium' // 'low', 'medium', 'high'
            },
            privacy: {
                shareLocation: true,
                shareSteps: false,
                shareBases: true,
                shareAnalytics: 'basic', // 'off', 'basic', 'advanced'
                shareMood: false,
                shareAura: true,
                chatAutoOpen: true
            },
            accessibility: {
                reducedMotion: false,
                highContrast: false,
                largeText: false,
                screenReader: false,
                colorBlindMode: false,
                audioDescriptions: false
            },
            cosmic: {
                moonPhase: true,
                lunarCalendar: true,
                cosmicWeather: true,
                aetherLens: 'off', // 'off', 'basic', 'advanced'
                sacredGeometry: true,
                auraVisualization: true
            },
            performance: {
                targetFPS: 60,
                particleLimit: 1000,
                markerLimit: 500,
                autoQuality: true,
                batterySaver: false
            }
        };
        
        // Current settings
        this.settings = { ...this.defaultSettings };
        
        // UI elements
        this.settingsPanel = null;
        this.settingsToggle = null;
        
        this.init();
    }
    
    init() {
        console.log('⚙️ Initializing Sacred Settings System...');
        this.loadSettings();
        this.createSettingsPanel();
        this.setupEventListeners();
        this.applySettings();
        console.log('⚙️ Sacred Settings System ready');
    }
    
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('eldritch_sacred_settings');
            if (savedSettings) {
                const parsed = JSON.parse(savedSettings);
                this.settings = this.mergeSettings(this.defaultSettings, parsed);
                console.log('⚙️ Sacred settings loaded from storage');
            } else {
                console.log('⚙️ Using default sacred settings');
            }
        } catch (error) {
            console.error('❌ Failed to load sacred settings:', error);
            this.settings = { ...this.defaultSettings };
        }
    }
    
    saveSettings() {
        try {
            localStorage.setItem('eldritch_sacred_settings', JSON.stringify(this.settings));
            console.log('⚙️ Sacred settings saved to storage');
            
            // Log settings change event
            if (window.supabaseClient) {
                window.supabaseClient.logEvent({
                    type: 'settings_changed',
                    data: { settings: this.settings }
                });
            }
        } catch (error) {
            console.error('❌ Failed to save sacred settings:', error);
        }
    }
    
    mergeSettings(defaults, saved) {
        const merged = { ...defaults };
        
        for (const category in saved) {
            if (merged[category]) {
                merged[category] = { ...merged[category], ...saved[category] };
            }
        }
        
        return merged;
    }
    
    createSettingsPanel() {
        // Create settings panel container
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.id = 'sacred-settings-panel';
        this.settingsPanel.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 600px;
            max-height: 80vh;
            background: linear-gradient(135deg, #1f2937, #374151);
            border: 2px solid #8b5cf6;
            border-radius: 16px;
            padding: 24px;
            z-index: 10001;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: #e5e7eb;
            display: none;
            overflow-y: auto;
        `;
        
        // Create panel content
        this.settingsPanel.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 24px; text-align: center;">
                    ⚙️ Sacred Settings
                </h2>
                <p style="margin: 0; color: #9ca3af; text-align: center; font-size: 14px;">
                    Control your cosmic exploration experience
                </p>
            </div>
            
            <div style="display: grid; gap: 20px;">
                <!-- Immersion Settings -->
                <div class="settings-section">
                    <h3 style="margin: 0 0 15px 0; color: #d1d5db; font-size: 18px;">
                        🌌 Immersion
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Immersion Level</span>
                                <select id="immersion-level" style="padding: 6px; border-radius: 4px; background: #374151; color: #e5e7eb; border: 1px solid #4b5563;">
                                    <option value="low">Low</option>
                                    <option value="default">Default</option>
                                    <option value="high">High</option>
                                </select>
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Particle Effects</span>
                                <input type="checkbox" id="particles-enabled" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Sacred Geometry</span>
                                <input type="checkbox" id="sacred-geometry-enabled" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Aura Pulses</span>
                                <input type="checkbox" id="aura-pulses-enabled" style="transform: scale(1.2);">
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Privacy Settings -->
                <div class="settings-section">
                    <h3 style="margin: 0 0 15px 0; color: #d1d5db; font-size: 18px;">
                        🔒 Privacy
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Share Location</span>
                                <input type="checkbox" id="share-location" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Share Steps</span>
                                <input type="checkbox" id="share-steps" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Share Bases</span>
                                <input type="checkbox" id="share-bases" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Analytics Level</span>
                                <select id="analytics-level" style="padding: 6px; border-radius: 4px; background: #374151; color: #e5e7eb; border: 1px solid #4b5563;">
                                    <option value="off">Off</option>
                                    <option value="basic">Basic</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </label>
                        </div>
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Auto-open Proximity Chat</span>
                                <input type="checkbox" id="chat-auto-open" style="transform: scale(1.2);">
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Accessibility Settings -->
                <div class="settings-section">
                    <h3 style="margin: 0 0 15px 0; color: #d1d5db; font-size: 18px;">
                        ♿ Accessibility
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Reduced Motion</span>
                                <input type="checkbox" id="reduced-motion" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>High Contrast</span>
                                <input type="checkbox" id="high-contrast" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Large Text</span>
                                <input type="checkbox" id="large-text" style="transform: scale(1.2);">
                            </label>
                        </div>
                    </div>
                </div>
                
                <!-- Cosmic Settings -->
                <div class="settings-section">
                    <h3 style="margin: 0 0 15px 0; color: #d1d5db; font-size: 18px;">
                        🌙 Cosmic
                    </h3>
                    <div style="display: grid; gap: 12px;">
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Moon Phase</span>
                                <input type="checkbox" id="moon-phase" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Lunar Calendar</span>
                                <input type="checkbox" id="lunar-calendar" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>Cosmic Weather</span>
                                <input type="checkbox" id="cosmic-weather" style="transform: scale(1.2);">
                            </label>
                        </div>
                        
                        <div class="setting-item">
                            <label style="display: flex; align-items: center; justify-content: space-between;">
                                <span>AetherLens</span>
                                <select id="aether-lens" style="padding: 6px; border-radius: 4px; background: #374151; color: #e5e7eb; border: 1px solid #4b5563;">
                                    <option value="off">Off</option>
                                    <option value="basic">Basic</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="margin-top: 24px; display: flex; gap: 12px; justify-content: center;">
                <button id="sacred-settings-reset" style="
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #6b7280, #4b5563);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    Reset to Defaults
                </button>
                
                <button id="sacred-settings-close" style="
                    padding: 10px 20px;
                    background: linear-gradient(135deg, #8b5cf6, #6d28d9);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    Close
                </button>
            </div>
        `;
        
        // Add to document
        document.body.appendChild(this.settingsPanel);
        
        // Create settings toggle button
        this.createSettingsToggle();
    }
    
    createSettingsToggle() {
        this.settingsToggle = document.createElement('button');
        this.settingsToggle.id = 'sacred-settings-toggle';
        this.settingsToggle.innerHTML = '⚙️';
        this.settingsToggle.title = 'Sacred Settings';
        this.settingsToggle.style.cssText = `
            position: fixed;
            top: 130px;
            right: 10px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #8b5cf6, #6d28d9);
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
            transition: all 0.3s ease;
        `;
        
        this.settingsToggle.addEventListener('click', () => {
            this.toggleSettingsPanel();
        });
        
        this.settingsToggle.addEventListener('mouseenter', () => {
            this.settingsToggle.style.transform = 'scale(1.1)';
        });
        
        this.settingsToggle.addEventListener('mouseleave', () => {
            this.settingsToggle.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(this.settingsToggle);
    }
    
    setupEventListeners() {
        // Settings panel event listeners
        const closeButton = document.getElementById('sacred-settings-close');
        const resetButton = document.getElementById('sacred-settings-reset');
        
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.hideSettingsPanel();
            });
        }
        
        if (resetButton) {
            resetButton.addEventListener('click', () => {
                this.resetToDefaults();
            });
        }
        
        // Settings change listeners
        this.setupSettingListeners();
    }
    
    setupSettingListeners() {
        // Immersion settings
        const immersionLevel = document.getElementById('immersion-level');
        const particlesEnabled = document.getElementById('particles-enabled');
        const sacredGeometryEnabled = document.getElementById('sacred-geometry-enabled');
        const auraPulsesEnabled = document.getElementById('aura-pulses-enabled');
        
        if (immersionLevel) {
            immersionLevel.addEventListener('change', (e) => {
                this.updateSetting('immersion', 'level', e.target.value);
            });
        }
        
        if (particlesEnabled) {
            particlesEnabled.addEventListener('change', (e) => {
                this.updateSetting('immersion', 'particles', e.target.checked);
            });
        }
        
        if (sacredGeometryEnabled) {
            sacredGeometryEnabled.addEventListener('change', (e) => {
                this.updateSetting('immersion', 'sacredGeometry', e.target.checked);
            });
        }
        
        if (auraPulsesEnabled) {
            auraPulsesEnabled.addEventListener('change', (e) => {
                this.updateSetting('immersion', 'auraPulses', e.target.checked);
            });
        }
        
        // Privacy settings
        const shareLocation = document.getElementById('share-location');
        const shareSteps = document.getElementById('share-steps');
        const shareBases = document.getElementById('share-bases');
        const analyticsLevel = document.getElementById('analytics-level');
        const chatAutoOpen = document.getElementById('chat-auto-open');
        
        if (shareLocation) {
            shareLocation.addEventListener('change', (e) => {
                this.updateSetting('privacy', 'shareLocation', e.target.checked);
            });
        }
        
        if (shareSteps) {
            shareSteps.addEventListener('change', (e) => {
                this.updateSetting('privacy', 'shareSteps', e.target.checked);
            });
        }
        
        if (shareBases) {
            shareBases.addEventListener('change', (e) => {
                this.updateSetting('privacy', 'shareBases', e.target.checked);
            });
        }
        
        if (analyticsLevel) {
            analyticsLevel.addEventListener('change', (e) => {
                this.updateSetting('privacy', 'shareAnalytics', e.target.value);
            });
        }
        
        if (chatAutoOpen) {
            chatAutoOpen.addEventListener('change', (e) => {
                this.updateSetting('privacy', 'chatAutoOpen', e.target.checked);
            });
        }
        
        // Accessibility settings
        const reducedMotion = document.getElementById('reduced-motion');
        const highContrast = document.getElementById('high-contrast');
        const largeText = document.getElementById('large-text');
        
        if (reducedMotion) {
            reducedMotion.addEventListener('change', (e) => {
                this.updateSetting('accessibility', 'reducedMotion', e.target.checked);
            });
        }
        
        if (highContrast) {
            highContrast.addEventListener('change', (e) => {
                this.updateSetting('accessibility', 'highContrast', e.target.checked);
            });
        }
        
        if (largeText) {
            largeText.addEventListener('change', (e) => {
                this.updateSetting('accessibility', 'largeText', e.target.checked);
            });
        }
        
        // Cosmic settings
        const moonPhase = document.getElementById('moon-phase');
        const lunarCalendar = document.getElementById('lunar-calendar');
        const cosmicWeather = document.getElementById('cosmic-weather');
        const aetherLens = document.getElementById('aether-lens');
        
        if (moonPhase) {
            moonPhase.addEventListener('change', (e) => {
                this.updateSetting('cosmic', 'moonPhase', e.target.checked);
            });
        }
        
        if (lunarCalendar) {
            lunarCalendar.addEventListener('change', (e) => {
                this.updateSetting('cosmic', 'lunarCalendar', e.target.checked);
            });
        }
        
        if (cosmicWeather) {
            cosmicWeather.addEventListener('change', (e) => {
                this.updateSetting('cosmic', 'cosmicWeather', e.target.checked);
            });
        }
        
        if (aetherLens) {
            aetherLens.addEventListener('change', (e) => {
                this.updateSetting('cosmic', 'aetherLens', e.target.value);
            });
        }
    }
    
    updateSetting(category, key, value) {
        console.log(`⚙️ Updating setting: ${category}.${key} = ${value}`);
        
        this.settings[category][key] = value;
        this.saveSettings();
        this.applySettings();
        
        // Show notification
        this.showNotification(`Setting updated: ${category}.${key}`);
    }
    
    applySettings() {
        console.log('⚙️ Applying sacred settings...');
        
        // Apply immersion settings
        this.applyImmersionSettings();
        
        // Apply privacy settings
        this.applyPrivacySettings();
        
        // Apply accessibility settings
        this.applyAccessibilitySettings();
        
        // Apply cosmic settings
        this.applyCosmicSettings();
        
        // Update UI
        this.updateSettingsUI();
    }
    
    applyImmersionSettings() {
        const { level, particles, sacredGeometry, auraPulses } = this.settings.immersion;
        
        // Apply immersion level
        document.body.setAttribute('data-immersion-level', level);
        
        // Apply particle effects
        if (window.particleSystem) {
            window.particleSystem.setEnabled(particles);
        }
        
        // Apply sacred geometry
        if (window.sacredGeometryEngine) {
            window.sacredGeometryEngine.setEnabled(sacredGeometry);
        }
        
        // Apply aura pulses
        if (window.auraPulseSystem) {
            window.auraPulseSystem.setEnabled(auraPulses);
        }
    }
    
    applyPrivacySettings() {
        const { shareLocation, shareSteps, shareBases, shareAnalytics, chatAutoOpen } = this.settings.privacy;
        
        // Apply privacy settings to systems
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.setPrivacySettings({
                shareSteps: shareSteps,
                shareAnalytics: shareAnalytics
            });
        }
        
        if (window.mapLayer) {
            window.mapLayer.setPrivacySettings({
                shareLocation: shareLocation,
                shareBases: shareBases
            });
        }
        
        if (window.playerChatSystem) {
            window.playerChatSystem.enabled = this.settings.privacy.chatAutoOpen;
        }
    }
    
    applyAccessibilitySettings() {
        const { reducedMotion, highContrast, largeText } = this.settings.accessibility;
        
        // Apply reduced motion
        if (reducedMotion) {
            document.body.classList.add('reduced-motion');
        } else {
            document.body.classList.remove('reduced-motion');
        }
        
        // Apply high contrast
        if (highContrast) {
            document.body.classList.add('high-contrast');
        } else {
            document.body.classList.remove('high-contrast');
        }
        
        // Apply large text
        if (largeText) {
            document.body.classList.add('large-text');
        } else {
            document.body.classList.remove('large-text');
        }
    }
    
    applyCosmicSettings() {
        const { moonPhase, lunarCalendar, cosmicWeather, aetherLens } = this.settings.cosmic;
        
        // Apply cosmic settings
        document.body.setAttribute('data-moon-phase', moonPhase);
        document.body.setAttribute('data-lunar-calendar', lunarCalendar);
        document.body.setAttribute('data-cosmic-weather', cosmicWeather);
        document.body.setAttribute('data-aether-lens', aetherLens);
    }
    
    updateSettingsUI() {
        // Update immersion settings
        const immersionLevel = document.getElementById('immersion-level');
        const particlesEnabled = document.getElementById('particles-enabled');
        const sacredGeometryEnabled = document.getElementById('sacred-geometry-enabled');
        const auraPulsesEnabled = document.getElementById('aura-pulses-enabled');
        
        if (immersionLevel) immersionLevel.value = this.settings.immersion.level;
        if (particlesEnabled) particlesEnabled.checked = this.settings.immersion.particles;
        if (sacredGeometryEnabled) sacredGeometryEnabled.checked = this.settings.immersion.sacredGeometry;
        if (auraPulsesEnabled) auraPulsesEnabled.checked = this.settings.immersion.auraPulses;
        
        // Update privacy settings
        const shareLocation = document.getElementById('share-location');
        const shareSteps = document.getElementById('share-steps');
        const shareBases = document.getElementById('share-bases');
        const analyticsLevel = document.getElementById('analytics-level');
        const chatAutoOpen = document.getElementById('chat-auto-open');
        
        if (shareLocation) shareLocation.checked = this.settings.privacy.shareLocation;
        if (shareSteps) shareSteps.checked = this.settings.privacy.shareSteps;
        if (shareBases) shareBases.checked = this.settings.privacy.shareBases;
        if (analyticsLevel) analyticsLevel.value = this.settings.privacy.shareAnalytics;
        if (chatAutoOpen) chatAutoOpen.checked = this.settings.privacy.chatAutoOpen;
        
        // Update accessibility settings
        const reducedMotion = document.getElementById('reduced-motion');
        const highContrast = document.getElementById('high-contrast');
        const largeText = document.getElementById('large-text');
        
        if (reducedMotion) reducedMotion.checked = this.settings.accessibility.reducedMotion;
        if (highContrast) highContrast.checked = this.settings.accessibility.highContrast;
        if (largeText) largeText.checked = this.settings.accessibility.largeText;
        
        // Update cosmic settings
        const moonPhase = document.getElementById('moon-phase');
        const lunarCalendar = document.getElementById('lunar-calendar');
        const cosmicWeather = document.getElementById('cosmic-weather');
        const aetherLens = document.getElementById('aether-lens');
        
        if (moonPhase) moonPhase.checked = this.settings.cosmic.moonPhase;
        if (lunarCalendar) lunarCalendar.checked = this.settings.cosmic.lunarCalendar;
        if (cosmicWeather) cosmicWeather.checked = this.settings.cosmic.cosmicWeather;
        if (aetherLens) aetherLens.value = this.settings.cosmic.aetherLens;
    }
    
    toggleSettingsPanel() {
        if (this.settingsPanel) {
            const isVisible = this.settingsPanel.style.display !== 'none';
            this.settingsPanel.style.display = isVisible ? 'none' : 'block';
            console.log('⚙️ Sacred settings panel:', isVisible ? 'hidden' : 'shown');
        }
    }
    
    showSettingsPanel() {
        if (this.settingsPanel) {
            this.settingsPanel.style.display = 'block';
        }
    }
    
    hideSettingsPanel() {
        if (this.settingsPanel) {
            this.settingsPanel.style.display = 'none';
        }
    }
    
    resetToDefaults() {
        console.log('⚙️ Resetting settings to defaults');
        
        this.settings = { ...this.defaultSettings };
        this.saveSettings();
        this.applySettings();
        this.updateSettingsUI();
        
        this.showNotification('Settings reset to defaults');
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 12px 24px;
            background: linear-gradient(135deg, #8b5cf6, #6d28d9);
            color: white;
            border-radius: 8px;
            font-weight: bold;
            z-index: 10002;
            animation: slideInDown 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutUp 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    getSettings() {
        return { ...this.settings };
    }
    
    getSetting(category, key) {
        return this.settings[category]?.[key];
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sacredSettings = new SacredSettings();
    });
} else {
    window.sacredSettings = new SacredSettings();
}

console.log('⚙️ Sacred Settings System script loaded');
