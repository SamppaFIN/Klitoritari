/**
 * Base System - Player base establishment and territory management
 * Handles base creation, territory expansion, and community connections
 */

class BaseSystem {
    constructor() {
        this.playerBase = null;
        this.territoryPoints = [];
        this.nearbyBases = [];
        this.isExpandingTerritory = false;
        this.territoryExpansionInterval = null;
        this.onBaseEstablished = null;
        this.onTerritoryUpdated = null;
        this.onNearbyBaseFound = null;
    }

    init() {
        this.setupUI();
        this.loadPlayerBase();
        this.loadNearbyBases();
        console.log('🏗️ Base system initialized');
    }

    setupUI() {
        // Add base establishment button to header
        this.addBaseEstablishmentButton();
        
        // Create base management panel
        this.createBaseManagementPanel();
        
        // Setup event listeners
        this.setupEventListeners();
    }

    addBaseEstablishmentButton() {
        const header = document.getElementById('header');
        if (!header) return;

        // Check if button already exists
        if (document.getElementById('establish-base-btn')) return;

        const baseButton = document.createElement('button');
        baseButton.id = 'establish-base-btn';
        baseButton.className = 'sacred-button base-button';
        baseButton.innerHTML = '<span class="icon">🏗️</span> Establish Base';
        baseButton.style.cssText = `
            margin-left: 10px;
            font-size: 0.8rem;
            padding: 8px 15px;
        `;

        baseButton.addEventListener('click', () => this.showBaseEstablishmentModal());
        header.appendChild(baseButton);
    }

    createBaseManagementPanel() {
        // Add base management panel to UI overlay
        const uiOverlay = document.getElementById('ui-overlay');
        if (!uiOverlay) return;

        const basePanel = document.createElement('div');
        basePanel.id = 'base-management-panel';
        basePanel.className = 'control-panel hidden';
        basePanel.style.cssText = `
            top: 100px;
            right: 20px;
            min-width: 280px;
        `;

        basePanel.innerHTML = `
            <h3>🏗️ Base Management</h3>
            <div id="base-info">
                <div class="base-status">No base established</div>
                <div class="base-stats hidden">
                    <div class="stat-item">
                        <span class="stat-label">Territory Size:</span>
                        <span id="territory-size">0m²</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Connected Bases:</span>
                        <span id="connected-bases">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Nearby Explorers:</span>
                        <span id="nearby-explorers">0</span>
                    </div>
                </div>
            </div>
            <div id="base-actions" class="hidden">
                <button id="expand-territory-btn" class="sacred-button">
                    <span class="icon">🎨</span> Expand Territory
                </button>
                <button id="manage-base-btn" class="sacred-button secondary">
                    <span class="icon">⚙️</span> Manage Base
                </button>
            </div>
            <div id="territory-expansion" class="hidden">
                <div class="expansion-info">
                    <div class="expansion-status">Territory expansion active</div>
                    <div class="expansion-progress">
                        <div class="progress-bar">
                            <div id="territory-progress" class="progress-fill"></div>
                        </div>
                        <span id="territory-progress-text">0%</span>
                    </div>
                </div>
                <button id="stop-expansion-btn" class="sacred-button secondary">
                    <span class="icon">⏹️</span> Stop Expansion
                </button>
            </div>
        `;

        uiOverlay.appendChild(basePanel);
    }

    setupEventListeners() {
        // Base establishment modal events
        const establishBtn = document.getElementById('establish-base-btn');
        if (establishBtn) {
            establishBtn.addEventListener('click', () => this.showBaseEstablishmentModal());
        }

        // Base management panel events
        const expandBtn = document.getElementById('expand-territory-btn');
        if (expandBtn) {
            expandBtn.addEventListener('click', () => this.startTerritoryExpansion());
        }

        const stopBtn = document.getElementById('stop-expansion-btn');
        if (stopBtn) {
            stopBtn.addEventListener('click', () => this.stopTerritoryExpansion());
        }

        const manageBtn = document.getElementById('manage-base-btn');
        if (manageBtn) {
            manageBtn.addEventListener('click', () => this.showBaseManagementModal());
        }
    }

    showBaseEstablishmentModal() {
        // Check if player already has a base
        if (this.playerBase) {
            this.showNotification('You already have a base established!', 'info');
            return;
        }

        // Wait for geolocation manager and database client to be available
        if (!window.geolocationManager || !window.databaseClient || !window.databaseClient.isInitialized) {
            this.showNotification('System still initializing. Please wait a moment and try again.', 'info');
            
            // Retry after a short delay
            setTimeout(() => {
                if (window.geolocationManager && window.databaseClient && window.databaseClient.isInitialized) {
                    this.showBaseEstablishmentModal();
                } else {
                    this.showNotification('System not ready. Please refresh the page and try again.', 'error');
                }
            }, 2000);
            return;
        }

        // Get current location - try multiple approaches
        let currentPosition = null;
        
        // Try the method first
        if (window.geolocationManager && typeof window.geolocationManager.getCurrentPositionData === 'function') {
            currentPosition = window.geolocationManager.getCurrentPositionData();
        }
        
        // If method didn't work, try direct property access
        if (!currentPosition && window.geolocationManager && window.geolocationManager.currentPosition) {
            currentPosition = window.geolocationManager.currentPosition;
        }
        
        // Debug logging
        console.log('Base establishment - current position:', currentPosition);
        console.log('Geolocation manager:', window.geolocationManager);
        console.log('Database client:', window.databaseClient);
        console.log('Database client initialized:', window.databaseClient?.isInitialized);
        
        // Fallback: use simulator position if available
        if (!currentPosition && window.geolocationManager?.simulatorMode) {
            currentPosition = {
                lat: 61.4978, // Tampere Härmälä
                lng: 23.7608,
                accuracy: 5,
                timestamp: Date.now()
            };
            this.showNotification('Using simulator location for base establishment', 'info');
        }
        
        // Additional fallback: try to get position from geolocation manager directly
        if (!currentPosition && window.geolocationManager) {
            // Check if geolocation manager has current position stored
            if (window.geolocationManager.currentPosition) {
                currentPosition = window.geolocationManager.currentPosition;
                console.log('Using geolocation manager current position:', currentPosition);
            }
        }
        
        if (!currentPosition) {
            this.showNotification('Location required to establish base. Please click "Locate Me" first to enable geolocation.', 'error');
            return;
        }

        // Create base establishment modal
        this.createBaseEstablishmentModal(currentPosition);
    }

    createBaseEstablishmentModal(position) {
        const modal = document.createElement('div');
        modal.id = 'base-establishment-modal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🏗️ Establish Your Cosmic Base</h2>
                    <button id="close-base-modal" class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="base-setup-info">
                        <p>Your base will be the center of your cosmic exploration and community building.</p>
                        <div class="location-confirmation">
                            <h4>📍 Base Location</h4>
                            <div class="location-details">
                                <div class="location-coords">
                                    <strong>Coordinates:</strong> ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}
                                </div>
                                <div class="location-accuracy">
                                    <strong>Accuracy:</strong> ${Math.round(position.accuracy || 0)}m
                                </div>
                            </div>
                        </div>
                        <div class="base-naming">
                            <h4>🏷️ Base Name</h4>
                            <input type="text" id="base-name-input" placeholder="Enter your base name..." maxlength="50">
                            <div class="base-name-hint">Choose a name that represents your cosmic mission</div>
                        </div>
                        <div class="base-territory-info">
                            <h4>🌌 Territory Information</h4>
                            <div class="territory-details">
                                <div class="territory-size">
                                    <strong>Initial Territory:</strong> 50m radius
                                </div>
                                <div class="territory-expansion">
                                    <strong>Expansion:</strong> Walk around to paint your territory (up to 500m radius)
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-actions">
                        <button id="confirm-base-establishment" class="sacred-button">
                            <span class="icon">🏗️</span> Establish Base
                        </button>
                        <button id="cancel-base-establishment" class="sacred-button secondary">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // Setup modal event listeners
        this.setupBaseModalEvents(modal, position);
    }

    setupBaseModalEvents(modal, position) {
        const closeBtn = modal.querySelector('#close-base-modal');
        const cancelBtn = modal.querySelector('#cancel-base-establishment');
        const confirmBtn = modal.querySelector('#confirm-base-establishment');
        const nameInput = modal.querySelector('#base-name-input');

        // Close modal
        const closeModal = () => {
            modal.remove();
        };

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);

        // Confirm base establishment
        confirmBtn.addEventListener('click', () => {
            const baseName = nameInput.value.trim();
            if (!baseName) {
                this.showNotification('Please enter a base name', 'error');
                return;
            }

            this.establishBase(baseName, position);
            closeModal();
        });

        // Auto-focus name input
        nameInput.focus();
    }

    async establishBase(name, position) {
        try {
            // Show loading state
            this.showNotification('Establishing your cosmic base...', 'info');

            // Create base data
            const baseData = {
                name: name,
                lat: position.lat,
                lng: position.lng,
                radius: 50, // Initial radius in meters
                establishedAt: Date.now()
            };

            // Create base using database client
            const base = await window.databaseClient.createBase({
                player_id: 'local_player', // Will be replaced with actual player ID when auth is implemented
                name: name,
                latitude: position.lat,
                longitude: position.lng,
                accuracy: position.accuracy,
                territory_radius: 50.0, // Initial radius in meters
                cosmic_energy: 100,
                base_level: 1,
                community_connections: 0,
                sacred_structures: [],
                base_settings: {}
            });
            
            if (base) {
                // Store locally
                this.playerBase = {
                    id: base.id,
                    name: base.name,
                    lat: base.latitude,
                    lng: base.longitude,
                    radius: base.territory_radius,
                    establishedAt: new Date(base.established_at).getTime()
                };
                localStorage.setItem('eldritch-player-base', JSON.stringify(this.playerBase));
                
                // Log base establishment activity
                await window.databaseClient.logBaseActivity({
                    base_id: base.id,
                    player_id: base.player_id,
                    activity_type: 'establish',
                    description: `Established base: ${base.name}`,
                    latitude: base.latitude,
                    longitude: base.longitude,
                    energy_contribution: 10
                });
                
                // Update UI
                this.updateBaseUI();
                
                // Show success message
                this.showNotification(`🏗️ Base "${name}" established successfully!`, 'success');
                
                // Trigger cosmic effect
                if (window.cosmicEffects) {
                    window.cosmicEffects.createEnergyBurst(
                        window.innerWidth / 2, 
                        window.innerHeight / 2, 
                        1.5
                    );
                }

                // Notify other systems
                if (this.onBaseEstablished) {
                    this.onBaseEstablished(this.playerBase);
                }

                console.log('🏗️ Base established:', this.playerBase);
            } else {
                throw new Error('Failed to create base in database');
            }

        } catch (error) {
            console.error('Failed to establish base:', error);
            this.showNotification(`Failed to establish base: ${error.message}`, 'error');
        }
    }

    async sendBaseToServer(baseData) {
        try {
            const response = await fetch('/api/bases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...baseData,
                    playerId: window.websocketClient?.getPlayerId() || 'unknown'
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            // Fallback: store locally without server
            return {
                success: true,
                base: {
                    ...baseData,
                    id: 'local_' + Date.now(),
                    isLocal: true
                }
            };
        }
    }

    loadPlayerBase() {
        try {
            const savedBase = localStorage.getItem('eldritch-player-base');
            if (savedBase) {
                this.playerBase = JSON.parse(savedBase);
                this.updateBaseUI();
                console.log('🏗️ Loaded existing base:', this.playerBase);
            }
        } catch (error) {
            console.error('Failed to load player base:', error);
        }
    }

    loadNearbyBases() {
        // TODO: Implement nearby bases loading from server
        // For now, just initialize empty array
        this.nearbyBases = [];
        console.log('🏗️ Nearby bases loaded (empty for now)');
    }

    updateBaseUI() {
        const basePanel = document.getElementById('base-management-panel');
        const baseStatus = document.querySelector('.base-status');
        const baseStats = document.querySelector('.base-stats');
        const baseActions = document.getElementById('base-actions');
        const establishBtn = document.getElementById('establish-base-btn');

        if (!basePanel) return;

        if (this.playerBase) {
            // Show base management panel
            basePanel.classList.remove('hidden');
            
            // Update base status
            if (baseStatus) {
                baseStatus.textContent = `Base: ${this.playerBase.name}`;
            }

            // Show base stats
            if (baseStats) {
                baseStats.classList.remove('hidden');
                this.updateBaseStats();
            }

            // Show base actions
            if (baseActions) {
                baseActions.classList.remove('hidden');
            }

            // Hide establish button
            if (establishBtn) {
                establishBtn.style.display = 'none';
            }
        } else {
            // Hide base management panel
            basePanel.classList.add('hidden');
            
            // Show establish button
            if (establishBtn) {
                establishBtn.style.display = 'block';
            }
        }
    }

    updateBaseStats() {
        const territorySize = document.getElementById('territory-size');
        const connectedBases = document.getElementById('connected-bases');
        const nearbyExplorers = document.getElementById('nearby-explorers');

        if (territorySize) {
            const area = Math.PI * Math.pow(this.playerBase.radius, 2);
            territorySize.textContent = `${Math.round(area)}m²`;
        }

        if (connectedBases) {
            connectedBases.textContent = this.playerBase.connectedBases || 0;
        }

        if (nearbyExplorers) {
            nearbyExplorers.textContent = this.nearbyBases.length;
        }
    }

    startTerritoryExpansion() {
        if (!this.playerBase) {
            this.showNotification('No base established', 'error');
            return;
        }

        if (this.isExpandingTerritory) {
            this.showNotification('Territory expansion already active', 'info');
            return;
        }

        // Check geolocation
        const currentPosition = window.geolocationManager?.getCurrentPositionData();
        if (!currentPosition) {
            this.showNotification('Location required for territory expansion', 'error');
            return;
        }

        // Start territory expansion
        this.isExpandingTerritory = true;
        this.territoryPoints = [];
        
        // Show expansion UI
        const expansionPanel = document.getElementById('territory-expansion');
        if (expansionPanel) {
            expansionPanel.classList.remove('hidden');
        }

        // Start tracking territory
        this.startTerritoryTracking();

        this.showNotification('🎨 Territory expansion started! Walk around to paint your territory.', 'info');
    }

    startTerritoryTracking() {
        this.territoryExpansionInterval = setInterval(() => {
            const position = window.geolocationManager?.getCurrentPositionData();
            if (position) {
                this.addTerritoryPoint(position);
            }
        }, 2000); // Track every 2 seconds
    }

    addTerritoryPoint(position) {
        if (!this.playerBase) return;

        // Check if point is within maximum radius
        const distance = this.calculateDistance(
            this.playerBase.lat, this.playerBase.lng,
            position.lat, position.lng
        );

        if (distance > 500) { // Max 500m radius
            this.showNotification('Territory expansion limit reached (500m radius)', 'warning');
            this.stopTerritoryExpansion();
            return;
        }

        // Add territory point
        const territoryPoint = {
            lat: position.lat,
            lng: position.lng,
            timestamp: Date.now()
        };

        this.territoryPoints.push(territoryPoint);

        // Update progress
        this.updateTerritoryProgress();

        // Send to server
        this.sendTerritoryPoint(territoryPoint);

        // Notify other systems
        if (this.onTerritoryUpdated) {
            this.onTerritoryUpdated(this.territoryPoints);
        }
    }

    updateTerritoryProgress() {
        const progressFill = document.getElementById('territory-progress');
        const progressText = document.getElementById('territory-progress-text');

        if (!progressFill || !progressText) return;

        // Calculate progress based on territory points
        const maxPoints = 100; // Target number of points
        const progress = Math.min((this.territoryPoints.length / maxPoints) * 100, 100);

        progressFill.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
    }

    async sendTerritoryPoint(point) {
        try {
            await fetch('/api/territory/paint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    baseId: this.playerBase.id,
                    lat: point.lat,
                    lng: point.lng,
                    playerId: window.websocketClient?.getPlayerId() || 'unknown'
                })
            });
        } catch (error) {
            console.error('Failed to send territory point:', error);
            // Continue without server - local storage fallback
        }
    }

    stopTerritoryExpansion() {
        this.isExpandingTerritory = false;
        
        if (this.territoryExpansionInterval) {
            clearInterval(this.territoryExpansionInterval);
            this.territoryExpansionInterval = null;
        }

        // Hide expansion UI
        const expansionPanel = document.getElementById('territory-expansion');
        if (expansionPanel) {
            expansionPanel.classList.add('hidden');
        }

        this.showNotification('🎨 Territory expansion stopped', 'info');
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = this.toRadians(lat2 - lat1);
        const dLng = this.toRadians(lng2 - lng1);
        
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
                  Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `base-notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? 'var(--cosmic-red)' : 
                        type === 'success' ? 'var(--cosmic-green)' : 
                        type === 'warning' ? 'var(--cosmic-purple)' : 'var(--cosmic-blue)'};
            color: var(--cosmic-light);
            padding: 15px 20px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 3000;
            box-shadow: 0 0 20px var(--cosmic-glow);
            backdrop-filter: blur(10px);
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;

        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 3000);
    }

    showBaseManagementModal() {
        // TODO: Implement base management modal
        this.showNotification('Base management features coming soon!', 'info');
    }

    // Public API methods
    getPlayerBase() {
        return this.playerBase;
    }

    getTerritoryPoints() {
        return this.territoryPoints;
    }

    isTerritoryExpanding() {
        return this.isExpandingTerritory;
    }

    // Cleanup
    destroy() {
        this.stopTerritoryExpansion();
        this.playerBase = null;
        this.territoryPoints = [];
        this.nearbyBases = [];
    }
}

// Export for use in other modules
window.BaseSystem = BaseSystem;
