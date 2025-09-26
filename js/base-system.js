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
        this.buildings = [];
        this.territorySize = 100; // Base territory size in m²
        this.baseMarker = null;
		// Disable inline base management panel; use the modal instead
		this.enableInlineBasePanel = false;
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
        
		// Optionally create inline base management panel (disabled by default)
		if (this.enableInlineBasePanel) {
			this.createBaseManagementPanel();
		}
        
        // Setup event listeners
        this.setupEventListeners();
    }

    addBaseEstablishmentButton() {
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;

        // Check if button already exists
        if (document.getElementById('establish-base-btn')) return;

        const baseButton = document.createElement('button');
        baseButton.id = 'establish-base-btn';
        baseButton.className = 'sacred-button base-button';
        baseButton.innerHTML = '<span class="base-icon">🏗️</span><span class="base-text">ESTABLISH BASE</span>';
        baseButton.style.cssText = `
            background: linear-gradient(45deg, #4CAF50, #66BB6A);
            color: white;
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2px;
            min-width: 80px;
        `;

        baseButton.addEventListener('click', (e) => {
            console.log('🏗️ Base button clicked (header button)');
            e.stopPropagation();
            this.showBaseEstablishmentModal();
        });
        headerControls.appendChild(baseButton);
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
            <div class="panel-header">
                <h3>🏗️ Base Management</h3>
                <button id="close-base-panel" class="close-panel-btn" title="Close">&times;</button>
            </div>
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
                <button id="delete-base-btn" class="sacred-button" style="background: var(--cosmic-red);">
                    <span class="icon">🗑️</span> Delete Base
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
            establishBtn.addEventListener('click', (e) => {
                console.log('🏗️ Establish base button clicked (ID button)');
                e.stopPropagation();
                this.showBaseEstablishmentModal();
            });
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

        const deleteBtn = document.getElementById('delete-base-btn');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => this.confirmDeleteBase());
        }

        // Add delete button to base popup
        this.addDeleteButtonToBasePopup();

        const closePanelBtn = document.getElementById('close-base-panel');
        if (closePanelBtn) {
            closePanelBtn.addEventListener('click', () => this.closeBasePanel());
        }
        
        // Base management modal events - delay to ensure DOM is ready
        setTimeout(() => {
            this.setupBaseModalEvents();
        }, 100);
    }

    setupBaseModalEvents() {
        // Wait for DOM to be ready before setting up events
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBaseModalEvents());
            return;
        }

        // Close base modal button
        const closeModalBtn = document.getElementById('close-base-modal');
        console.log('🏗️ Close button found:', !!closeModalBtn);
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                console.log('🏗️ Close button clicked!');
                this.hideBaseManagementModal();
            });
        } else {
            console.error('🏗️ Close button not found!');
        }

        // Build buttons - use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('build-btn')) {
                const buildingCard = e.target.closest('.building-card');
                if (buildingCard) {
                    const building = buildingCard.dataset.building;
                    const cost = parseInt(e.target.dataset.cost);
                    this.buildStructure(building, cost);
                }
            }
        });

        // Expand buttons - use event delegation for dynamic content
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('expand-btn')) {
                const cost = parseInt(e.target.dataset.cost);
                this.expandTerritory(cost);
            }
        });

        // Establish base inside modal when user has no base
        const establishNowBtn = document.getElementById('establish-base-now-btn');
        if (establishNowBtn) {
            establishNowBtn.addEventListener('click', () => {
                this.establishBaseWithNewSystem();
            });
        }
    }

    establishBaseWithNewSystem() {
        const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
        const cost = 1000;
        
        if (steps < cost) {
            this.showNotification(`Not enough steps to establish a base (need ${cost})`, 'error');
            return;
        }

        // Check if base building layer is available
        if (!window.layeredRendering) {
            this.showNotification('Base building system not available', 'error');
            return;
        }

        const baseBuildingLayer = window.layeredRendering.getLayer('baseBuilding');
        if (!baseBuildingLayer) {
            this.showNotification('Base building layer not found', 'error');
            return;
        }

        // Deduct steps
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.subtractSteps(cost);
        }

        // Get player's current position
        const playerPosition = window.geolocationManager ? window.geolocationManager.getCurrentPosition() : null;
        if (!playerPosition) {
            this.showNotification('Unable to get your location for base establishment', 'error');
            return;
        }

        // Create a base at the player's current location
        const base = {
            id: 'player_base_' + Date.now(),
            lat: playerPosition.lat,
            lng: playerPosition.lng,
            size: 40,
            level: 1,
            flags: 0,
            steps: 0,
            maxFlags: 8,
            color: '#8b5cf6',
            owner: 'player',
            establishedAt: Date.now()
        };

        // Add base to the base building layer
        baseBuildingLayer.bases = [base];
        baseBuildingLayer.saveBaseData();

        // Add a joint flag at the base location
        const jointFlag = {
            id: 'joint_flag_' + Date.now(),
            lat: playerPosition.lat,
            lng: playerPosition.lng,
            type: 'joint',
            size: 25,
            color: '#ffd700',
            timestamp: Date.now()
        };
        baseBuildingLayer.flags.push(jointFlag);
        baseBuildingLayer.saveFlags();

        // Update UI
        this.updateBaseTabUI();
        
        // Hide the no-base section
        const noBase = document.getElementById('no-base-section');
        if (noBase) noBase.classList.add('hidden');

        this.showNotification('Base established successfully! 🏗️', 'success');
        
        // Log the establishment
        if (window.log) {
            window.log('Base established at center of screen', 'success');
        }
    }

    updateBaseTabUI() {
        const baseManagementList = document.getElementById('base-management-list');
        if (!baseManagementList) return;

        if (window.layeredRendering) {
            const baseBuildingLayer = window.layeredRendering.getLayer('baseBuilding');
            if (baseBuildingLayer && baseBuildingLayer.bases.length > 0) {
                const base = baseBuildingLayer.bases[0];
                const stats = baseBuildingLayer.getStats();
                
                baseManagementList.innerHTML = `
                    <div class="base-card">
                        <div class="base-header">
                            <h3>🏗️ Cosmic Sanctuary</h3>
                            <span class="base-level">Level ${base.level}</span>
                        </div>
                        <div class="base-stats">
                            <div class="stat">
                                <span class="stat-label">Size:</span>
                                <span class="stat-value">${base.size}px</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Flags:</span>
                                <span class="stat-value">${stats.flagsAroundBase}/${base.maxFlags}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Ants:</span>
                                <span class="stat-value">${stats.ants}</span>
                            </div>
                            <div class="stat">
                                <span class="stat-label">Steps:</span>
                                <span class="stat-value">${stats.steps}</span>
                            </div>
                        </div>
                        <div class="base-actions">
                            <button class="base-btn" onclick="this.showBaseStats()">View Stats</button>
                            <button class="base-btn" onclick="this.placeFlag()">Place Flag</button>
                        </div>
                    </div>
                `;
            } else {
                baseManagementList.innerHTML = '<div class="base-empty">No base established</div>';
            }
        }
    }

    showBaseStats() {
        if (window.layeredRendering) {
            const baseBuildingLayer = window.layeredRendering.getLayer('baseBuilding');
            if (baseBuildingLayer && baseBuildingLayer.bases.length > 0) {
                baseBuildingLayer.showBaseStats(baseBuildingLayer.bases[0]);
            }
        }
    }

    placeFlag() {
        if (window.layeredRendering) {
            const baseBuildingLayer = window.layeredRendering.getLayer('baseBuilding');
            if (baseBuildingLayer) {
                const success = baseBuildingLayer.placeFlagAtPosition();
                if (success) {
                    this.showNotification('Flag placed successfully! 🚩', 'success');
                    this.updateBaseTabUI();
                } else {
                    this.showNotification('Cannot place flag: No joint flag present', 'warn');
                }
            }
        }
    }

    showBaseEstablishmentModal() {
        // Check if player already has a base
        if (this.playerBase) {
            this.showNotification('You already have a base established!', 'info');
            return;
        }

        // Check if modal is already open to prevent duplicates
        const existingModal = document.getElementById('base-establishment-modal');
        if (existingModal) {
            console.log('🏗️ Base establishment modal already open, ignoring duplicate request');
            return;
        }

        // Debug: Check what's available
        console.log('🔍 Base establishment check:');
        console.log('  - geolocationManager:', !!window.geolocationManager);
        console.log('  - databaseClient:', !!window.databaseClient);
        console.log('  - databaseClient.isInitialized:', window.databaseClient?.isInitialized);
        console.log('  - eldritchApp:', !!window.eldritchApp);
        console.log('  - app.systems:', window.eldritchApp?.systems ? Object.keys(window.eldritchApp.systems) : 'undefined');
        
        // Try to get geolocation manager directly from app if not available globally
        if (!window.geolocationManager && window.eldritchApp) {
            console.log('🔧 Attempting to get geolocation manager from app...');
            window.geolocationManager = window.eldritchApp.getSystem('geolocation');
            console.log('  - Retrieved geolocationManager:', !!window.geolocationManager);
        }
        
        // Wait for geolocation manager and database client to be available
        if (!window.geolocationManager || !window.databaseClient || !window.databaseClient.isInitialized) {
            console.log('❌ System not ready - showing retry notification');
            this.showNotification('System still initializing. Please wait a moment and try again.', 'info');
            
            // Retry after a longer delay to ensure systems are ready
            setTimeout(() => {
                console.log('🔄 Retrying base establishment...');
                console.log('  - geolocationManager:', !!window.geolocationManager);
                console.log('  - databaseClient:', !!window.databaseClient);
                console.log('  - databaseClient.isInitialized:', window.databaseClient?.isInitialized);
                
                if (window.geolocationManager && window.databaseClient && window.databaseClient.isInitialized) {
                    this.showBaseEstablishmentModal();
                } else {
                    // Try one more time after another delay
                    setTimeout(() => {
                        console.log('🔄 Final retry...');
                        if (window.geolocationManager && window.databaseClient && window.databaseClient.isInitialized) {
                            this.showBaseEstablishmentModal();
                        } else {
                            this.showNotification('System not ready. Please refresh the page and try again.', 'error');
                        }
                    }, 3000);
                }
            }, 3000);
            return;
        }
        
        console.log('✅ System ready - proceeding with base establishment');

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
        console.log('🏗️ Creating base establishment modal with position:', currentPosition);
        this.createBaseEstablishmentModal(currentPosition);
    }

    createBaseEstablishmentModal(position) {
        console.log('🏗️ Creating base establishment modal...');
        const modal = document.createElement('div');
        modal.id = 'base-establishment-modal';
        modal.className = 'modal';
        
        // Store position data in modal dataset
        modal.dataset.lat = position.lat;
        modal.dataset.lng = position.lng;
        modal.dataset.accuracy = position.accuracy || 0;
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
                    <div class="modal-footer">
                        <button id="confirm-base-establishment" class="confirm-btn">
                            <span class="icon">🏗️</span> Establish Base
                        </button>
                        <button id="cancel-base-establishment" class="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('🏗️ Base establishment modal added to DOM');

        // Setup modal event listeners after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setupBaseEstablishmentModalEvents(modal);
        }, 100);
    }

    setupBaseEstablishmentModalEvents(modal) {
        console.log('🏗️ Setting up base establishment modal events...');
        
        // Close modal button
        const closeBtn = modal.querySelector('#close-base-modal');
        console.log('🏗️ Close button found:', !!closeBtn);
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('🏗️ Close button clicked');
                modal.remove();
            });
        }

        // Confirm establishment button
        const confirmBtn = modal.querySelector('#confirm-base-establishment');
        console.log('🏗️ Confirm button found:', !!confirmBtn);
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                console.log('🏗️ Confirm button clicked');
                const nameInput = modal.querySelector('#base-name-input');
                const baseName = nameInput ? nameInput.value.trim() : '';
                
                if (!baseName) {
                    this.showNotification('Please enter a base name', 'error');
                    return;
                }
                
                // Get position from the modal data
                const position = {
                    lat: parseFloat(modal.dataset.lat),
                    lng: parseFloat(modal.dataset.lng),
                    accuracy: parseFloat(modal.dataset.accuracy) || 0
                };
                
                console.log('🏗️ Establishing base:', baseName, 'at', position);
                this.establishBase(baseName, position);
                modal.remove();
            });
        }

        // Cancel button
        const cancelBtn = modal.querySelector('#cancel-base-establishment');
        console.log('🏗️ Cancel button found:', !!cancelBtn);
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                console.log('🏗️ Cancel button clicked');
                modal.remove();
            });
        }

        console.log('🏗️ Base establishment modal events setup complete');
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

                // Show the base panel when first established
                this.openBasePanel();

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
            // Don't automatically show panel - let user control it
            // basePanel.classList.remove('hidden');
            
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

            // Change establish button to "Open Base" when base exists
            if (establishBtn) {
                establishBtn.innerHTML = '<span class="base-icon">🏠</span><span class="base-text">OPEN BASE</span>';
                establishBtn.onclick = (e) => {
                    console.log('🏠 Open base button clicked');
                    e.stopPropagation();
                    this.showBaseManagementModal();
                };
            }
        } else {
            // Hide base management panel when no base
            basePanel.classList.add('hidden');
            
            // Reset establish button when no base exists
            if (establishBtn) {
                establishBtn.innerHTML = '<span class="base-icon">🏗️</span><span class="base-text">ESTABLISH BASE</span>';
                establishBtn.onclick = (e) => {
                    console.log('🏗️ Establish base button clicked');
                    e.stopPropagation();
                    this.showBaseEstablishmentModal();
                };
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
        // Check if modal is already open
        const baseModal = document.getElementById('base-management-modal');
        if (baseModal && !baseModal.classList.contains('hidden')) {
            console.log('🏗️ Base management modal already open, ignoring duplicate request');
            return;
        }
        
        // Show base management modal
        if (baseModal) {
            // If no base, show establish section
            const noBase = baseModal.querySelector('#no-base-section');
            if (!this.playerBase) {
                if (noBase) noBase.classList.remove('hidden');
            } else if (noBase) {
                noBase.classList.add('hidden');
            }
            baseModal.classList.remove('hidden');
            this.updateBaseModalInfo();
            
            // Add escape key listener for closing
            this.escapeKeyListener = (e) => {
                if (e.key === 'Escape') {
                    console.log('🏗️ Escape key pressed, closing modal');
                    this.hideBaseManagementModal();
                }
            };
            document.addEventListener('keydown', this.escapeKeyListener);
            
            // Add click outside to close
            this.modalOverlayListener = (e) => {
                if (e.target === baseModal) {
                    console.log('🏗️ Clicked outside modal, closing');
                    this.hideBaseManagementModal();
                }
            };
            baseModal.addEventListener('click', this.modalOverlayListener);
        }
    }

    hideBaseManagementModal() {
        console.log('🏗️ hideBaseManagementModal called');
        const baseModal = document.getElementById('base-management-modal');
        console.log('🏗️ Base modal found:', !!baseModal);
        if (baseModal) {
            baseModal.classList.add('hidden');
            console.log('🏗️ Base modal hidden');
            
            // Clean up event listeners
            if (this.escapeKeyListener) {
                document.removeEventListener('keydown', this.escapeKeyListener);
                this.escapeKeyListener = null;
            }
            if (this.modalOverlayListener) {
                baseModal.removeEventListener('click', this.modalOverlayListener);
                this.modalOverlayListener = null;
            }
        } else {
            console.error('🏗️ Base modal not found!');
        }
    }

    updateBaseModalInfo() {
        // Update base information in modal
        const baseName = document.getElementById('base-name');
        const territorySize = document.getElementById('territory-size');
        const buildingCount = document.getElementById('building-count');
        const availableSteps = document.getElementById('available-steps');

        if (baseName) baseName.textContent = this.playerBase ? this.playerBase.name : 'Cosmic Sanctuary';
        if (territorySize) territorySize.textContent = `${this.territorySize}m²`;
        if (buildingCount) buildingCount.textContent = this.buildings.length + 1; // +1 for base itself
        if (availableSteps) {
            const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
            availableSteps.textContent = Math.floor(steps);
        }

        // Update button states based on available steps
        this.updateButtonStates();
    }

    updateButtonStates() {
        const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
        
        // Update build buttons
        document.querySelectorAll('.build-btn').forEach(btn => {
            const cost = parseInt(btn.dataset.cost);
            if (steps >= cost) {
                btn.disabled = false;
                btn.textContent = 'Build';
            } else {
                btn.disabled = true;
                btn.textContent = 'Not enough steps';
            }
        });

        // Update expand buttons
        document.querySelectorAll('.expand-btn').forEach(btn => {
            const cost = parseInt(btn.dataset.cost);
            if (steps >= cost) {
                btn.disabled = false;
            } else {
                btn.disabled = true;
            }
        });
    }

    buildStructure(buildingType, cost) {
        const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
        
        if (steps < cost) {
            this.showNotification(`Not enough steps! Need ${cost}, have ${Math.floor(steps)}`, 'error');
            return;
        }

        // Check if building already exists
        if (this.buildings.find(b => b.type === buildingType)) {
            this.showNotification(`${buildingType} already built!`, 'info');
            return;
        }

        // Deduct steps
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.subtractSteps(cost);
            console.log(`🏗️ Built ${buildingType} for ${cost} steps`);
        }

        // Add building
        const building = {
            type: buildingType,
            name: this.getBuildingName(buildingType),
            cost: cost,
            builtAt: Date.now(),
            effects: this.getBuildingEffects(buildingType)
        };

        this.buildings.push(building);
        this.updateBaseModalInfo();
        this.showNotification(`🏗️ ${building.name} built successfully!`, 'success');
        
        // Apply building effects
        this.applyBuildingEffects(building);
    }

    getBuildingName(buildingType) {
        const names = {
            'watchtower': 'Watchtower',
            'energy-core': 'Energy Core',
            'research-lab': 'Research Lab',
            'defense-turret': 'Defense Turret'
        };
        return names[buildingType] || buildingType;
    }

    getBuildingEffects(buildingType) {
        const effects = {
            'watchtower': { visibility: 50, description: 'Increases territory visibility' },
            'energy-core': { energy: 100, description: 'Generates cosmic energy' },
            'research-lab': { research: 25, description: 'Unlocks new technologies' },
            'defense-turret': { defense: 75, description: 'Protects your territory' }
        };
        return effects[buildingType] || {};
    }

    applyBuildingEffects(building) {
        // Apply building effects to the game
        console.log(`🏗️ Applied effects for ${building.name}:`, building.effects);
        
        // Update territory size if watchtower
        if (building.type === 'watchtower') {
            this.territorySize += 50;
            this.updateTerritoryDisplay();
        }
    }

    expandTerritory(cost) {
        const steps = window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0;
        
        if (steps < cost) {
            this.showNotification(`Not enough steps! Need ${cost}, have ${Math.floor(steps)}`, 'error');
            return;
        }

        // Deduct steps
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.subtractSteps(cost);
            console.log(`🏗️ Built ${buildingType} for ${cost} steps`);
        }

        // Expand territory
        this.territorySize += cost * 2; // 2m² per step
        this.updateTerritoryDisplay();
        this.updateBaseModalInfo();
        
        this.showNotification(`🗺️ Territory expanded by ${cost * 2}m²!`, 'success');
        
        // Update territory on map
        this.updateTerritoryOnMap();
    }

    updateTerritoryDisplay() {
        // Update territory display in UI
        const territorySize = document.getElementById('territory-size');
        if (territorySize) {
            territorySize.textContent = `${this.territorySize}m²`;
        }
    }

    updateTerritoryOnMap() {
        // Update territory visualization on map
        if (this.baseMarker && window.eldritchApp && window.eldritchApp.systems.mapEngine) {
            // Update base marker with new territory size
            this.baseMarker.setRadius(this.territorySize);
        }
    }

    confirmDeleteBase() {
        if (!this.playerBase) {
            this.showNotification('No base to delete!', 'info');
            return;
        }

        const confirmed = confirm(
            `Are you sure you want to delete your base "${this.playerBase.name}"?\n\n` +
            'This action cannot be undone. You will need to establish a new base to continue.'
        );

        if (confirmed) {
            this.deletePlayerBase();
        }
    }

    closeBasePanel() {
        const basePanel = document.getElementById('base-management-panel');
        if (basePanel) {
            basePanel.classList.add('hidden');
        }
    }

    addDeleteButtonToBasePopup() {
        // This will be called when the base popup is created in map-engine.js
        // We'll add the delete button there
    }

    openBasePanel() {
        const basePanel = document.getElementById('base-management-panel');
        if (basePanel) {
            basePanel.classList.remove('hidden');
        }
    }

    // Public API methods
    getPlayerBase() {
        return this.playerBase;
    }

    deletePlayerBase() {
        try {
            if (!this.playerBase) {
                this.showNotification('No base to delete!', 'info');
                return false;
            }

            // Remove from local storage
            localStorage.removeItem('eldritch-player-base');
            
            // Remove from database
            if (window.databaseClient && this.playerBase.id) {
                window.databaseClient.deleteBase(this.playerBase.id);
            }

            // Clear from memory
            this.playerBase = null;

            // Update UI
            this.updateBaseUI();

            // Notify other systems
            if (this.onBaseDeleted) {
                this.onBaseDeleted();
            }

            this.showNotification('🏗️ Base deleted successfully! You can now establish a new one.', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting base:', error);
            this.showNotification('Failed to delete base. Please try again.', 'error');
            return false;
        }
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
