/**
 * Unified Quest System
 * Integrates with NPC system, position tracking, and map engine
 * Provides a cohesive quest experience with Aurora as the main quest giver
 */

class UnifiedQuestSystem {
    constructor() {
        this.activeQuests = new Map();
        this.completedQuests = new Map();
        this.availableQuests = new Map();
        this.questMarkers = new Map();
        this.currentMainQuest = null;
        this.questProgress = {};
        this.npcInteractions = new Map();
        
        // Quest state
        this.isInitialized = false;
        this.positionUpdateInterval = null;
        this.lastPlayerPosition = null;
        this.isPaused = true; // Start paused until game begins
        this.visitedQuests = new Set(); // Track visited quest markers
        this.questCooldowns = new Map(); // Track quest cooldowns
        this.dialogCooldowns = new Map(); // Track dialog cooldowns
        this.currentDialog = null; // Track current dialog
        
        // Aurora as main quest giver - positioned 100m away from player
        this.aurora = {
            id: 'aurora',
            name: 'Aurora',
            lat: 61.473683430224284, // Will be updated to be 100m away
            lng: 23.726548746143216, // Will be updated to be 100m away
            interactionDistance: 20, // meters
            isQuestGiver: true,
            currentQuest: null,
            dialogue: this.getAuroraDialogue(),
            // Movement properties
            movementSpeed: 0.00001, // Slow random movement
            movementInterval: null,
            lastMoveTime: 0
        };
        
        this.initializeQuests();
        this.setupPositionTracking();
        // Don't call setupUI() here - it will be called when quest system resumes
        
        console.log('🎭 Quest system initialization complete. Available quests:', this.availableQuests.size);
    }
    
    initializeQuests() {
        console.log('🎭 Initializing unified quest system...');
        
        // Main story quests
        this.addQuest({
            id: 'corroding_lake',
            name: 'The Corroding Lake',
            type: 'main',
            status: 'available',
            giver: 'cosmic_entity',
            description: 'A mysterious fuming lake threatens the area. Follow the trail of purification to uncover ancient horrors.',
            objectives: [
                        {
                            id: 'escape_corroding_lake',
                            description: 'Navigate the fuming waters and make a crucial choice for survival',
                            status: 'incomplete',
                            type: 'proximity',
                            target: 'corroding_lake',
                            distance: 50,
                            location: { lat: 61.476173436868, lng: 23.725432936819306 }
                        },
                {
                    id: 'find_ancient_staff',
                    description: 'Discover a mystical wooden branch that could aid in your journey',
                    status: 'incomplete',
                    type: 'proximity',
                    target: 'ancient_staff',
                    distance: 50,
                    location: { lat: 61.4735, lng: 23.7325 }
                },
                {
                    id: 'meet_lunatic_sage',
                    description: 'Encounter a wise but mad sage who knows the secrets of purification',
                    status: 'incomplete',
                    type: 'proximity',
                    target: 'lunatic_sage',
                    distance: 50,
                    location: { lat: 61.4728, lng: 23.7320 }
                },
                {
                    id: 'face_troll_bridge',
                    description: 'Confront the hideous troll using your wits, staff, or courage',
                    status: 'incomplete',
                    type: 'proximity',
                    target: 'troll_bridge',
                    distance: 50,
                    location: { lat: 61.4765, lng: 23.7305 }
                },
                {
                    id: 'release_cthulhu',
                    description: 'Help the sage complete his mission and accidentally awaken Cthulhu',
                    status: 'incomplete',
                    type: 'proximity',
                    target: 'cthulhu_awakening',
                    distance: 50,
                    location: { lat: 61.4775, lng: 23.7285 }
                }
            ],
            rewards: {
                experience: 500,
                items: ['ancient_staff', 'purification_charm', 'cthulhu_insight'],
                story: 'You have awakened ancient horrors and survived to tell the tale'
            }
        });
        
        // Side quests
        this.addQuest({
            id: 'npc_interactions',
            name: 'Community Connections',
            type: 'side',
            status: 'available',
            giver: 'aurora',
            description: 'Aurora suggests you get to know the other inhabitants of the cosmic realm.',
            objectives: [
                {
                    id: 'talk_to_npcs',
                    description: 'Speak with 3 different NPCs',
                    status: 'incomplete',
                    type: 'dialogue',
                    target: 'npc',
                    progress: 0,
                    maxProgress: 3
                }
            ],
            rewards: {
                experience: 150,
                items: ['community_badge'],
                story: 'You have made connections in the cosmic community'
            }
        });
        
        console.log('🎭 Quest system initialized with', this.availableQuests.size, 'quests');
    }
    
    addQuest(questData) {
        const quest = {
            id: questData.id,
            name: questData.name,
            type: questData.type,
            status: questData.status,
            giver: questData.giver,
            description: questData.description,
            objectives: questData.objectives || [],
            rewards: questData.rewards || {},
            createdAt: Date.now(),
            completedAt: null
        };
        
        this.availableQuests.set(quest.id, quest);
        console.log('🎭 Added quest:', quest.name);
    }
    
    setupPositionTracking() {
        // Position tracking will be set up when quest system is resumed
        console.log('🎭 Position tracking setup deferred until quest system resumes');
    }
    
    setupUI() {
        // Create quest UI elements
        this.createQuestPanel();
        this.createQuestMarkers();
        console.log('🎭 Quest UI setup complete');
    }
    
    createQuestPanel() {
        // Create quest panel in the UI overlay
        const uiOverlay = document.getElementById('ui-overlay');
        if (!uiOverlay) return;
        
        const questPanel = document.createElement('div');
        questPanel.id = 'quest-panel';
        questPanel.className = 'quest-panel';
        questPanel.style.cssText = `
            position: absolute;
            top: 20px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid var(--cosmic-purple);
            border-radius: 10px;
            padding: 15px;
            color: var(--cosmic-light);
            z-index: 1000;
            min-width: 300px;
            max-width: 400px;
            backdrop-filter: blur(10px);
            display: none;
        `;
        
        questPanel.innerHTML = `
            <div class="quest-panel-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="color: var(--cosmic-purple); margin: 0;">🎭 Quest Log</h3>
                <button id="close-quest-panel" style="background: var(--cosmic-red); color: white; border: none; border-radius: 5px; padding: 5px 10px; cursor: pointer;">✕</button>
            </div>
            <div id="quest-content">
                <div id="active-quests"></div>
                <div id="available-quests"></div>
                <div id="completed-quests"></div>
            </div>
        `;
        
        uiOverlay.appendChild(questPanel);
        
        // Add close button event
        document.getElementById('close-quest-panel').addEventListener('click', () => {
            questPanel.style.display = 'none';
        });
        
        // Add quest button to header
        this.addQuestButton();
    }
    
    addQuestButton() {
        const headerControls = document.querySelector('.header-controls');
        if (!headerControls) return;
        
        const questButton = document.createElement('button');
        questButton.id = 'quest-button';
        questButton.className = 'sacred-button quest-log-btn';
        questButton.innerHTML = '<span class="quest-icon">🎭</span><span class="quest-text">QUESTS</span>';
        questButton.style.cssText = `
            background: linear-gradient(45deg, #ff9800, #ff5722);
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
        
        questButton.addEventListener('click', () => {
            this.toggleQuestPanel();
        });
        
        headerControls.appendChild(questButton);
    }
    
    toggleQuestPanel() {
        const questPanel = document.getElementById('quest-panel');
        if (questPanel) {
            const isVisible = questPanel.style.display !== 'none';
            questPanel.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.updateQuestDisplay();
            }
        }
    }
    
    updateQuestDisplay() {
        const activeQuestsEl = document.getElementById('active-quests');
        const availableQuestsEl = document.getElementById('available-quests');
        const completedQuestsEl = document.getElementById('completed-quests');
        
        if (!activeQuestsEl || !availableQuestsEl || !completedQuestsEl) return;
        
        // Active quests
        const activeQuests = Array.from(this.activeQuests.values());
        activeQuestsEl.innerHTML = `
            <h4 style="color: var(--cosmic-green); margin-bottom: 10px;">Active Quests (${activeQuests.length})</h4>
            ${activeQuests.map(quest => this.renderQuest(quest)).join('')}
        `;
        
        // Available quests
        const availableQuests = Array.from(this.availableQuests.values()).filter(q => q.status === 'available');
        availableQuestsEl.innerHTML = `
            <h4 style="color: var(--cosmic-blue); margin-bottom: 10px;">Available Quests (${availableQuests.length})</h4>
            ${availableQuests.map(quest => this.renderQuest(quest)).join('')}
        `;
        
        // Completed quests
        const completedQuests = Array.from(this.completedQuests.values());
        completedQuestsEl.innerHTML = `
            <h4 style="color: var(--cosmic-light); margin-bottom: 10px;">Completed Quests (${completedQuests.length})</h4>
            ${completedQuests.map(quest => this.renderQuest(quest)).join('')}
        `;
    }
    
    renderQuest(quest) {
        const statusColor = quest.status === 'completed' ? 'var(--cosmic-green)' : 
                           quest.status === 'active' ? 'var(--cosmic-blue)' : 'var(--cosmic-light)';
        
        return `
            <div class="quest-item" style="margin-bottom: 15px; padding: 10px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; border-left: 4px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <h5 style="margin: 0; color: ${statusColor};">${quest.name}</h5>
                    <span style="font-size: 12px; color: #ccc;">${quest.type.toUpperCase()}</span>
                </div>
                <p style="margin: 0 0 10px 0; font-size: 12px; color: #ccc;">${quest.description}</p>
                <div class="quest-objectives">
                    ${quest.objectives.map(obj => `
                        <div style="margin-bottom: 5px; font-size: 11px;">
                            <span style="color: ${obj.status === 'completed' ? 'var(--cosmic-green)' : 'var(--cosmic-light)'};">
                                ${obj.status === 'completed' ? '✓' : '○'} ${obj.description}
                            </span>
                            ${obj.progress !== undefined ? ` (${obj.progress}/${obj.maxProgress})` : ''}
                        </div>
                    `).join('')}
                </div>
                ${quest.status === 'available' ? `
                    <button onclick="window.unifiedQuestSystem.startQuest('${quest.id}')" 
                            class="sacred-button" style="font-size: 10px; padding: 4px 8px; margin-top: 8px;">
                        Start Quest
                    </button>
                ` : ''}
            </div>
        `;
    }
    
    createQuestMarkers() {
        // Create quest markers on the map
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('🎭 Map engine not ready, will create markers later');
            return;
        }
        
        console.log('🎭 Creating quest markers...');
        console.log('🎭 Map engine available:', !!window.mapEngine);
        console.log('🎭 Map available:', !!window.mapEngine.map);
        console.log('🎭 Map center:', window.mapEngine.map.getCenter());
        console.log('🎭 Map zoom:', window.mapEngine.map.getZoom());
        console.log('🎭 Quest system state:', {
            isInitialized: this.isInitialized,
            isPaused: this.isPaused,
            availableQuests: this.availableQuests.size,
            activeQuests: this.activeQuests.size
        });
        
        // Aurora is now handled by NPC system - no need to create marker here
        
        // Quest location markers
        this.createQuestLocationMarkers();
        
        // Create the first quest objective marker if quest is available
        const corrodingLakeQuest = this.availableQuests.get('corroding_lake');
        if (corrodingLakeQuest && corrodingLakeQuest.status === 'available') {
            console.log('🎭 Creating first quest objective marker for Corroding Lake');
            this.createFirstQuestObjectiveMarker(corrodingLakeQuest);
        }
        
        console.log('🎭 Quest markers created successfully');
        console.log('🎭 Total quest markers:', this.questMarkers.size);
        console.log('🎭 Quest marker keys:', Array.from(this.questMarkers.keys()));
    }
    
    createFirstQuestObjectiveMarker(quest) {
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('🎭 First quest objective marker: Map engine not ready');
            return;
        }
        
        // Find the first objective
        const firstObjective = quest.objectives.find(obj => obj.status === 'incomplete');
        if (!firstObjective) {
            console.log('🎭 No incomplete objectives found for quest:', quest.name);
            return;
        }
        
        console.log('🎭 Creating first quest objective marker for:', firstObjective.id);
        
        // Use the objective's location
        const position = firstObjective.location;
        if (!position) {
            console.log('🎭 No location found for objective:', firstObjective.id);
            return;
        }
        
        // Create the marker
        const markerKey = `${quest.id}_${firstObjective.id}`;
        const marker = this.createQuestObjectiveMarker(firstObjective, position);
        
        if (marker) {
            this.questMarkers.set(markerKey, marker);
            console.log('🎭 Created first quest objective marker:', markerKey, 'at:', position);
            
            // Show notification for new quest marker
            const objectiveIcons = {
                'escape_corroding_lake': { symbol: '🌊', color: '#00bfff', name: 'Corroding Lake' },
                'find_ancient_staff': { symbol: '🌿', color: '#8b4513', name: 'Ancient Staff' },
                'meet_lunatic_sage': { symbol: '🧙', color: '#ffd700', name: 'Lunatic Sage' },
                'face_troll_bridge': { symbol: '👹', color: '#8b0000', name: 'Troll Bridge' },
                'release_cthulhu': { symbol: '🐙', color: '#4b0082', name: 'Cthulhu\'s Depths' }
            };
            const iconData = objectiveIcons[firstObjective.id] || { symbol: '❓', color: '#95a5a6', name: 'Quest Objective' };
            this.showNewMarkerNotification(firstObjective, iconData);
        }
    }

    createAuroraMarker() {
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('🎭 Aurora marker: Map engine not ready');
            return;
        }
        
        console.log('🎭 Creating Aurora marker at:', this.aurora.lat, this.aurora.lng);
        
        const auroraIcon = L.divIcon({
            className: 'aurora-marker',
            html: `
                <div style="position: relative; width: 50px; height: 50px;">
                    <!-- Aurora's cosmic aura -->
                    <div style="position: absolute; top: -8px; left: -8px; width: 66px; height: 66px; background: radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%); border-radius: 50%; animation: auroraPulse 3s infinite;"></div>
                    <!-- Aurora's energy field -->
                    <div style="position: absolute; top: -4px; left: -4px; width: 58px; height: 58px; border: 2px solid #ff00ff; border-radius: 50%; animation: auroraRotate 4s linear infinite; opacity: 0.6;"></div>
                    <!-- Aurora's core -->
                    <div style="position: absolute; top: 5px; left: 5px; width: 40px; height: 40px; background: linear-gradient(45deg, #ff00ff, #ff66ff); border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 20px #ff00ff;"></div>
                    <!-- Aurora's symbol -->
                    <div style="position: absolute; top: 12px; left: 12px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 18px; color: #ffffff; text-shadow: 0 0 8px rgba(0, 0, 0, 0.8);">👑</div>
                </div>
            `,
            iconSize: [50, 50],
            iconAnchor: [25, 25]
        });
        
        const auroraMarker = L.marker([this.aurora.lat, this.aurora.lng], { icon: auroraIcon }).addTo(window.mapEngine.map);
        
        auroraMarker.bindPopup(`
            <div style="text-align: center; color: #ff00ff; font-weight: bold;">
                <h3>👑 Aurora</h3>
                <p style="margin: 10px 0; color: #ffffff;">The Cosmic Quest Giver</p>
                <p style="color: #ffffff; font-size: 0.9em;">A mysterious figure who knows the secrets of the Härmälä Convergence. She appears to be the key to understanding the cosmic anomalies.</p>
                <div style="margin: 15px 0; padding: 10px; background: rgba(255, 0, 255, 0.1); border-radius: 8px; border: 1px solid #ff00ff;">
                    <strong>Status:</strong> ${this.getAuroraStatus()}<br>
                    <strong>Distance:</strong> <span id="aurora-distance">Calculating...</span>
                </div>
                <button onclick="window.unifiedQuestSystem.interactWithAurora()" 
                        style="background: linear-gradient(45deg, #ff00ff, #ff66ff); color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                    👑 Speak with Aurora
                </button>
            </div>
        `);
        
        this.questMarkers.set('aurora', auroraMarker);
        console.log('🎭 Aurora marker created');
    }
    
    createQuestLocationMarkers() {
        // Create markers for quest locations
        console.log('🎭 Creating quest location markers...');
        const questLocations = [
            {
                id: 'corroding_lake',
                name: 'The Corroding Lake',
                lat: 61.476173436868,
                lng: 23.725432936819306,
                description: 'A mysterious fuming lake that threatens the area',
                icon: '🌊',
                color: '#00bfff'
            },
            {
                id: 'ancient_staff',
                name: 'Ancient Grove',
                lat: 61.4735,
                lng: 23.7325,
                description: 'A hidden grove where an ancient staff lies',
                icon: '🌿',
                color: '#8b4513'
            },
            {
                id: 'lunatic_sage',
                name: 'Sage\'s Hill',
                lat: 61.4728,
                lng: 23.7320,
                description: 'The dwelling of the Lunatic Sage',
                icon: '🧙',
                color: '#ffd700'
            },
            {
                id: 'troll_bridge',
                name: 'Troll Bridge',
                lat: 61.4765,
                lng: 23.7305,
                description: 'A bridge guarded by a hideous troll',
                icon: '👹',
                color: '#8b0000'
            },
            {
                id: 'cthulhu_awakening',
                name: 'Cthulhu\'s Depths',
                lat: 61.4775,
                lng: 23.7285,
                description: 'Where the ancient horror slumbers',
                icon: '🐙',
                color: '#4b0082'
            },
            {
                id: 'revive_shrine',
                name: 'Revive Shrine',
                lat: 61.472843139814955,
                lng: 23.72582986453225,
                description: 'A mystical shrine that restores health and sanity',
                icon: '⛩️',
                color: '#00ff00'
            }
        ];
        
        questLocations.forEach(location => {
            console.log('🎭 Creating marker for:', location.name, 'at', location.lat, location.lng);
            const locationIcon = L.divIcon({
                className: 'quest-location-marker',
                html: `
                    <div style="position: relative; width: 40px; height: 40px;">
                        <div style="position: absolute; top: -4px; left: -4px; width: 48px; height: 48px; background: radial-gradient(circle, ${location.color}33 0%, transparent 70%); border-radius: 50%; animation: questLocationPulse 2s infinite;"></div>
                        <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; background: ${location.color}; border: 3px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 20px ${location.color};"></div>
                        <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);">${location.icon}</div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            const locationMarker = L.marker([location.lat, location.lng], { icon: locationIcon }).addTo(window.mapEngine.map);
            
            locationMarker.bindPopup(`
                <div style="text-align: center;">
                    <h4>${location.icon} ${location.name}</h4>
                    <p style="color: #ffffff; font-size: 0.9em;">${location.description}</p>
                    <div style="margin: 10px 0; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; border: 1px solid ${location.color};">
                        <strong>Status:</strong> Available<br>
                        <strong>Distance:</strong> <span id="location-distance-${location.id}">Calculating...</span>
                    </div>
                </div>
            `);
            
            this.questMarkers.set(location.id, locationMarker);
            console.log('🎭 Marker created and added to map:', location.name);
        });
        
        console.log('🎭 All quest location markers created. Total markers:', this.questMarkers.size);
    }
    
    // Debug method to force show all quest markers
    forceShowAllMarkers() {
        console.log('🎭 Force showing all quest markers...');
        console.log('🎭 Total markers:', this.questMarkers.size);
        
        this.questMarkers.forEach((marker, key) => {
            console.log('🎭 Showing marker:', key);
            marker.openPopup();
        });
        
        // Also try to create a test marker at a known location
        if (window.mapEngine && window.mapEngine.map) {
            const testMarker = L.marker([61.4737, 23.7240]).addTo(window.mapEngine.map);
            testMarker.bindPopup('Test Quest Marker - Corroding Lake');
            testMarker.openPopup();
            console.log('🎭 Test marker created and shown');
        }
    }
    
    updateQuestProximity() {
        // Check if quest system is paused
        if (this.isPaused) {
            console.log('🎭 Quest system is paused, skipping proximity check');
            return;
        }
        
        // Get current player position
        const playerPosition = this.getPlayerPosition();
        if (!playerPosition) {
            console.log('🎭 No player position available for quest proximity check');
            return;
        }
        
        this.lastPlayerPosition = playerPosition;
        
        console.log('🎭 Quest proximity check running for position:', playerPosition);
        
        // Check Aurora proximity
        this.checkAuroraProximity(playerPosition);
        
        // Check HEVY proximity
        this.checkHEVYProximity(playerPosition);
        
        // Check Zephyr proximity
        this.checkZephyrProximity(playerPosition);
        
        // Check quest objective proximity
        this.checkQuestObjectiveProximity(playerPosition);
        
        // Check shrine proximity
        this.checkShrineProximity(playerPosition);
    }
    
    getPlayerPosition() {
        // Try to get position from geolocation manager
        if (window.eldritchApp && window.eldritchApp.systems.geolocation) {
            const geolocation = window.eldritchApp.systems.geolocation;
            
            // Only get position if we have a valid cached position or if tracking is active
            if (geolocation.hasValidPosition() || geolocation.isTracking) {
                const position = geolocation.getCurrentPositionSafe();
                if (position) {
                    return { lat: position.lat, lng: position.lng };
                }
            }
        }
        
        // Fallback to map engine
        if (window.mapEngine) {
            return window.mapEngine.getPlayerPosition();
        }
        
        return null;
    }
    
    checkAuroraProximity(playerPosition) {
        // Get Aurora's current position from NPC system
        if (window.eldritchApp && window.eldritchApp.systems.npc) {
            const aurora = window.eldritchApp.systems.npc.npcs.find(npc => npc.name === 'Aurora');
            if (aurora) {
                const interactionDistance = 20; // meters
                const distance = this.calculateDistance(
                    playerPosition.lat, playerPosition.lng,
                    aurora.lat, aurora.lng
                );
                
                console.log(`🌟 Aurora distance: ${distance.toFixed(2)}m (interaction distance: ${interactionDistance}m)`);
                
                // Update distance display
                const distanceEl = document.getElementById('aurora-distance');
                if (distanceEl) {
                    distanceEl.textContent = `${Math.round(distance)}m`;
                }
                
                // Check if player is close enough to interact
                if (distance <= interactionDistance) {
                    console.log('🌟 Aurora proximity triggered!');
                    this.handleAuroraProximity();
                }
            } else {
                console.log('🌟 Aurora not found in NPC system');
            }
        } else {
            console.log('🌟 NPC system not available for Aurora check');
        }
    }
    
    checkHEVYProximity(playerPosition) {
        // HEVY is at a fixed location
        const heavyLat = 61.473683430224284;
        const heavyLng = 23.726548746143216;
        const interactionDistance = 20; // meters
        
        const distance = this.calculateDistance(
            playerPosition.lat, playerPosition.lng,
            heavyLat, heavyLng
        );
        
        console.log(`⚡ HEVY distance: ${distance.toFixed(2)}m (interaction distance: ${interactionDistance}m)`);
        
        // Check if player is close enough to interact
        if (distance <= interactionDistance) {
            console.log('⚡ HEVY proximity triggered!');
            this.handleHEVYProximity();
        }
    }
    
    checkZephyrProximity(playerPosition) {
        // Get Zephyr's current position from NPC system
        if (window.eldritchApp && window.eldritchApp.systems.npc) {
            const zephyr = window.eldritchApp.systems.npc.npcs.find(npc => npc.name === 'Zephyr');
            if (zephyr) {
                const interactionDistance = 20; // meters
                const distance = this.calculateDistance(
                    playerPosition.lat, playerPosition.lng,
                    zephyr.lat, zephyr.lng
                );
                
                console.log(`💨 Zephyr distance: ${distance.toFixed(2)}m (interaction distance: ${interactionDistance}m)`);
                
                // Check if player is close enough to interact
                if (distance <= interactionDistance) {
                    console.log('💨 Zephyr proximity triggered!');
                    this.handleZephyrProximity();
                }
            }
        }
    }
    
    handleAuroraProximity() {
        console.log('🌟 Handling Aurora proximity - starting chat');
        // Start chat with Aurora
        if (window.eldritchApp && window.eldritchApp.systems.npc) {
            const aurora = window.eldritchApp.systems.npc.npcs.find(npc => npc.name === 'Aurora');
            if (aurora) {
                console.log('🌟 Starting chat with Aurora');
                window.eldritchApp.systems.npc.startChat(aurora.id);
            }
        }
        
        // Check if this is the first time approaching Aurora
        const auroraQuest = this.availableQuests.get('aurora_meeting');
        if (auroraQuest && auroraQuest.status === 'available') {
            this.startQuest('aurora_meeting');
        }
    }
    
    handleHEVYProximity() {
        console.log('⚡ HEVY proximity triggered - starting encounter');
        if (window.eldritchApp && window.eldritchApp.systems.encounter) {
            window.eldritchApp.systems.encounter.testHeavyEncounter();
        }
    }
    
    handleZephyrProximity() {
        console.log('💨 Zephyr proximity triggered - starting chat');
        if (window.eldritchApp && window.eldritchApp.systems.npc) {
            const zephyr = window.eldritchApp.systems.npc.npcs.find(npc => npc.name === 'Zephyr');
            if (zephyr) {
                console.log('💨 Starting chat with Zephyr');
                window.eldritchApp.systems.npc.startChat(zephyr.id);
            }
        }
    }
    
    checkQuestObjectiveProximity(playerPosition) {
        // Check proximity to quest objectives (both active and available quests)
        const allQuests = new Map([...this.activeQuests, ...this.availableQuests]);
        
        if (allQuests.size === 0) {
            console.log('🎭 No quests available for proximity check');
            return;
        }
        
        console.log(`🎭 Checking proximity for ${allQuests.size} quests at position:`, playerPosition);
        allQuests.forEach((quest, questId) => {
            console.log(`🎭 Checking quest: ${questId} (${quest.name}) - Status: ${quest.status}`);
            quest.objectives.forEach((objective, objIndex) => {
                console.log(`🎭 Objective ${objIndex + 1}: ${objective.id} - Type: ${objective.type}, Status: ${objective.status}, Distance: ${objective.distance}m`);
                
                // Check proximity for both proximity-type objectives and quest objective markers
                if (objective.status === 'incomplete') {
                    let questLat, questLng;
                    let distance;
                    
                    if (objective.type === 'proximity') {
                        // For the new Corroding Lake quest, use the specific location
                        if (quest.id === 'corroding_lake' && objective.location) {
                            questLat = objective.location.lat;
                            questLng = objective.location.lng;
                        } else {
                            // Fallback: Calculate quest marker position 100m north of player
                            const distanceKm = 0.1; // 100 meters in kilometers
                            const bearing = 0; // North direction
                            const questPosition = this.calculateDestination(playerPosition.lat, playerPosition.lng, bearing, distanceKm);
                            questLat = questPosition.lat;
                            questLng = questPosition.lng;
                        }
                        
                        distance = this.calculateDistance(
                            playerPosition.lat, playerPosition.lng,
                            questLat, questLng
                        );
                    } else {
                        // Check quest objective markers
                        const markerKey = `${questId}_${objective.id}`;
                        const marker = this.questMarkers.get(markerKey);
                        if (marker) {
                            const markerPos = marker.getLatLng();
                            questLat = markerPos.lat;
                            questLng = markerPos.lng;
                            distance = this.calculateDistance(
                                playerPosition.lat, playerPosition.lng,
                                questLat, questLng
                            );
                        } else {
                            console.log(`🎭 No marker found for objective: ${objective.id}`);
                            // Skip this objective if no marker found - set distance to infinity
                            distance = Infinity;
                        }
                    }
                    
                    // Debug information - show distance every 5 seconds
                    if (!this.lastDistanceLog || Date.now() - this.lastDistanceLog > 5000) {
                        console.log(`🎭 Quest Distance Debug: ${distance.toFixed(2)}m to ${objective.id} at (${questLat}, ${questLng}) (trigger at 50m)`);
                        this.lastDistanceLog = Date.now();
                    }
                    
                    if (distance <= 50) { // Always trigger within 50 meters
                        console.log(`🎭 Quest triggered! Distance: ${distance.toFixed(2)}m to ${objective.id}`);
                        
                        // Check if dialog is already open
                        if (this.currentDialog) {
                            console.log('🎭 Dialog already open, skipping trigger');
                            return;
                        }
                        
                        // Check cooldown for this objective
                        const cooldownKey = `${quest.id}_${objective.id}`;
                        const lastTrigger = this.dialogCooldowns.get(cooldownKey);
                        const now = Date.now();
                        const cooldownTime = 10000; // 10 seconds cooldown
                        
                        if (lastTrigger && (now - lastTrigger) < cooldownTime) {
                            console.log(`🎭 Dialog on cooldown for ${cooldownKey}, remaining: ${Math.ceil((cooldownTime - (now - lastTrigger)) / 1000)}s`);
                            return;
                        }
                        
                        // Set cooldown
                        this.dialogCooldowns.set(cooldownKey, now);
                        
                        // If this is the first objective and quest is available, start it
                        if (quest.status === 'available' && objective.id === 'escape_corroding_lake') {
                            console.log('🎭 Starting quest automatically due to proximity');
                            this.startQuest(quest.id);
                        }
                        
                        // Show quest dialog instead of just completing objective
                        this.showQuestDialog(quest, objective);
                    }
                }
            });
        });
    }
    
    // Check proximity to revive shrine
    checkShrineProximity(playerPosition) {
        const shrineLocation = {
            lat: 61.472843139814955,
            lng: 23.72582986453225
        };
        
        const distance = this.calculateDistance(
            playerPosition.lat, playerPosition.lng,
            shrineLocation.lat, shrineLocation.lng
        );
        
        // Check if player is within 30 meters of shrine
        if (distance <= 30) {
            // Check if we've already visited this shrine recently (prevent spam)
            const now = Date.now();
            if (!this.lastShrineVisit || now - this.lastShrineVisit > 10000) { // 10 second cooldown
                console.log(`⛩️ Player near revive shrine! Distance: ${distance.toFixed(2)}m`);
                this.activateReviveShrine();
                this.lastShrineVisit = now;
            }
        }
    }
    
    // Activate the revive shrine
    activateReviveShrine() {
        console.log('⛩️ Activating revive shrine...');
        
        // Create shrine activation dialog
        const shrineOverlay = document.createElement('div');
        shrineOverlay.className = 'shrine-dialog-overlay';
        shrineOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        `;
        
        const shrineContent = document.createElement('div');
        shrineContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            border: 3px solid #00ff00;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            color: #ffffff;
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.5);
            text-align: center;
            position: relative;
            overflow: hidden;
        `;
        
        // Add mystical background effect
        const mysticalBg = document.createElement('div');
        mysticalBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 70%),
                        radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
            pointer-events: none;
        `;
        shrineContent.appendChild(mysticalBg);
        
        shrineContent.innerHTML = `
            <div style="position: relative; z-index: 1;">
                <div style="margin-bottom: 20px;">
                    <h2 style="color: #00ff00; text-shadow: 0 0 10px rgba(0, 255, 0, 0.8); margin: 0 0 15px 0; font-size: 24px;">
                        ⛩️ Revive Shrine ⛩️
                    </h2>
                    <p style="font-style: italic; color: #90ee90; margin-bottom: 20px; font-size: 16px;">
                        "The ancient shrine pulses with healing energy..."
                    </p>
                </div>
                
                <div style="background: rgba(0, 0, 0, 0.5); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #00ff00;">
                    <p style="margin: 0; line-height: 1.6; font-size: 16px;">
                        You approach the mystical shrine and feel a warm, healing energy emanating from its ancient stones. 
                        The shrine seems to call to you, offering to restore your body and mind to their full potential.
                        <br><br>
                        <em>"The cosmic forces of restoration flow through this sacred place. Will you accept their blessing?"</em>
                    </p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button class="shrine-option" data-action="revive" style="
                        background: linear-gradient(45deg, #00ff00, #00cc00);
                        border: 2px solid #ffffff;
                        color: #000000;
                        padding: 20px 30px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 16px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">
                        ⛩️ Accept the Blessing
                    </button>
                    
                    <button class="shrine-option" data-action="decline" style="
                        background: linear-gradient(45deg, #696969, #2f4f4f);
                        border: 2px solid #ffffff;
                        color: #ffffff;
                        padding: 15px 30px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">
                        🚶 Leave the Shrine
                    </button>
                </div>
                
                <div style="margin-top: 20px; color: #90ee90; font-size: 12px;">
                    The shrine's power will restore your health and sanity to maximum
                </div>
            </div>
        `;
        
        shrineOverlay.appendChild(shrineContent);
        document.body.appendChild(shrineOverlay);
        
        // Add click handlers
        const options = shrineOverlay.querySelectorAll('.shrine-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const action = option.dataset.action;
                this.handleShrineAction(action, shrineOverlay);
            });
            
            // Add hover effects
            option.addEventListener('mouseenter', () => {
                option.style.transform = 'scale(1.05)';
                option.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.5)';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'scale(1)';
                option.style.boxShadow = 'none';
            });
        });
        
        // Store reference for cleanup
        this.currentDialog = shrineOverlay;
    }
    
    // Handle shrine action
    handleShrineAction(action, dialogOverlay) {
        console.log('⛩️ Shrine action:', action);
        
        if (action === 'revive') {
            // Restore full health and sanity
            if (window.eldritchApp && window.eldritchApp.systems.encounter) {
                const encounter = window.eldritchApp.systems.encounter;
                
                // Get current max values
                const maxHealth = encounter.playerStats.maxHealth || 100;
                const maxSanity = encounter.playerStats.maxSanity || 100;
                
                // Restore to full
                encounter.playerStats.health = maxHealth;
                encounter.playerStats.sanity = maxSanity;
                
                // Update display
                if (encounter.updateStatsDisplay) {
                    encounter.updateStatsDisplay();
                }
                
                console.log('⛩️ Player fully restored! Health:', maxHealth, 'Sanity:', maxSanity);
            }
            
            // Show success message
            this.showShrineFeedback(true, dialogOverlay);
        } else {
            // Just close dialog
            dialogOverlay.remove();
        }
    }
    
    // Show shrine feedback
    showShrineFeedback(success, dialogOverlay) {
        const content = dialogOverlay.querySelector('div > div');
        if (success) {
            content.innerHTML = `
                <div style="text-align: center;">
                    <h2 style="color: #00ff00; text-shadow: 0 0 10px rgba(0, 255, 0, 0.8); margin-bottom: 20px; font-size: 24px;">
                        ✨ Blessing Received! ✨
                    </h2>
                    <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">
                        The shrine's healing energy flows through you, restoring your body and mind to perfect condition. 
                        You feel refreshed and ready to continue your cosmic journey!
                    </p>
                    <div style="background: rgba(0, 255, 0, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #00ff00;">
                        <strong style="color: #00ff00;">Health and Sanity fully restored!</strong>
                    </div>
                    <button onclick="this.closest('.shrine-dialog-overlay').remove()" style="
                        background: linear-gradient(45deg, #00ff00, #00cc00);
                        border: 2px solid #ffffff;
                        color: #000000;
                        padding: 15px 30px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 16px;
                        font-weight: bold;
                    ">
                        Continue
                    </button>
                </div>
            `;
        }
    }
    
    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI/180;
        const φ2 = lat2 * Math.PI/180;
        const Δφ = (lat2-lat1) * Math.PI/180;
        const Δλ = (lng2-lng1) * Math.PI/180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c;
    }
    
    startQuest(questId) {
        const quest = this.availableQuests.get(questId);
        if (!quest) {
            console.error('🎭 Quest not found:', questId);
            return;
        }
        
        quest.status = 'active';
        this.activeQuests.set(questId, quest);
        this.availableQuests.delete(questId);
        
        console.log('🎭 Started quest:', quest.name);
        
        // Update UI
        this.updateQuestDisplay();
        
        // Show quest started notification
        this.showQuestNotification(`Quest Started: ${quest.name}`);
    }
    
    completeObjective(questId, objectiveId) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return;
        
        const objective = quest.objectives.find(obj => obj.id === objectiveId);
        if (!objective) return;
        
        objective.status = 'completed';
        console.log('🎭 Completed objective:', objective.description);
        
        // Check if quest is complete
        const allObjectivesComplete = quest.objectives.every(obj => obj.status === 'completed');
        if (allObjectivesComplete) {
            this.completeQuest(questId);
        }
        
        // Update UI
        this.updateQuestDisplay();
    }
    
    completeQuest(questId) {
        const quest = this.activeQuests.get(questId);
        if (!quest) return;
        
        quest.status = 'completed';
        quest.completedAt = Date.now();
        
        this.activeQuests.delete(questId);
        this.completedQuests.set(questId, quest);
        
        console.log('🎭 Completed quest:', quest.name);
        
        // Show completion notification
        this.showQuestNotification(`Quest Completed: ${quest.name}`);
        
        // Unlock next quests
        this.unlockNextQuests(questId);
    }
    
    unlockNextQuests(completedQuestId) {
        // Unlock quests based on completed quest
        if (completedQuestId === 'aurora_meeting') {
            const cosmicQuest = this.availableQuests.get('cosmic_investigation');
            if (cosmicQuest) {
                cosmicQuest.status = 'available';
                console.log('🎭 Unlocked quest: Cosmic Investigation');
            }
        }
    }
    
    interactWithAurora() {
        if (!this.lastPlayerPosition) {
            this.showQuestNotification('Please wait for position to be available');
            return;
        }
        
        const distance = this.calculateDistance(
            this.lastPlayerPosition.lat, this.lastPlayerPosition.lng,
            this.aurora.lat, this.aurora.lng
        );
        
        if (distance > this.aurora.interactionDistance) {
            this.showQuestNotification(`You need to be within ${this.aurora.interactionDistance}m of Aurora to speak with her`);
            return;
        }
        
        this.showAuroraDialogue();
    }
    
    showAuroraDialogue() {
        const dialogue = this.getAuroraDialogue();
        this.showDialogueModal('Aurora', dialogue);
    }
    
    getAuroraDialogue() {
        const auroraQuest = this.activeQuests.get('aurora_meeting');
        
        if (auroraQuest) {
            return {
                greeting: "Ah, you've finally arrived. I've been waiting for someone like you to appear in this cosmic convergence.",
                main: "The Härmälä Convergence is growing stronger by the day. The cosmic entities are becoming restless, and reality itself is beginning to warp around this area. I need your help to investigate these anomalies before they consume everything we know.",
                choices: [
                    {
                        text: "I'll help you investigate the cosmic anomalies",
                        action: () => this.acceptAuroraQuest()
                    },
                    {
                        text: "Tell me more about the convergence",
                        action: () => this.showAuroraInfo()
                    },
                    {
                        text: "I need to think about this",
                        action: () => this.closeDialogue()
                    }
                ]
            };
        }
        
        return {
            greeting: "Welcome back, cosmic explorer. The convergence continues to grow stronger.",
            main: "Have you made any progress on the investigation? The anomalies are becoming more frequent and more dangerous.",
            choices: [
                {
                    text: "Show me my current quests",
                    action: () => this.toggleQuestPanel()
                },
                {
                    text: "Tell me about the convergence again",
                    action: () => this.showAuroraInfo()
                }
            ]
        };
    }
    
    showAuroraInfo() {
        const info = `
            The Härmälä Convergence is a cosmic event that occurs when multiple dimensions intersect at a single point in space-time. 
            This particular convergence is centered around the Härmälä area of Tampere, Finland, and is growing stronger with each passing day.
            
            The convergence manifests as:
            - Reality distortions and temporal anomalies
            - Cosmic entities crossing over from other dimensions
            - Objects and locations that shouldn't exist appearing in our world
            - The gradual breakdown of natural laws in the affected area
            
            If left unchecked, the convergence could expand beyond Härmälä and potentially affect the entire planet. 
            That's why I need your help to investigate and hopefully stabilize the situation.
        `;
        
        this.showDialogueModal('Aurora - The Convergence', info, [
            {
                text: "I understand. I'll help you.",
                action: () => this.acceptAuroraQuest()
            },
            {
                text: "This sounds dangerous. I need to think about it.",
                action: () => this.closeDialogue()
            }
        ]);
    }
    
    acceptAuroraQuest() {
        this.completeObjective('aurora_meeting', 'speak_with_aurora');
        this.closeDialogue();
    }
    
    showDialogueModal(title, content, choices = []) {
        // Remove existing dialogue modal
        const existing = document.getElementById('dialogue-modal');
        if (existing) {
            existing.remove();
        }
        
        // Create dialogue modal
        const modal = document.createElement('div');
        modal.id = 'dialogue-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: var(--cosmic-dark); border: 2px solid var(--cosmic-purple); border-radius: 15px; padding: 30px; max-width: 600px; max-height: 80vh; overflow-y: auto; color: var(--cosmic-light);">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: var(--cosmic-purple); margin: 0 0 10px 0;">${title}</h2>
                </div>
                <div style="margin-bottom: 20px; line-height: 1.6;">
                    ${content}
                </div>
                <div style="text-align: center;">
                    ${choices.map((choice, index) => `
                        <button onclick="window.unifiedQuestSystem.handleDialogueChoice(${index})" 
                                class="sacred-button" 
                                style="margin: 5px; font-size: 12px; padding: 8px 16px;">
                            ${choice.text}
                        </button>
                    `).join('')}
                    <button onclick="window.unifiedQuestSystem.closeDialogue()" 
                            class="sacred-button" 
                            style="background: var(--cosmic-red); margin: 5px; font-size: 12px; padding: 8px 16px;">
                        Close
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Store choices for handling
        this.currentDialogueChoices = choices;
    }
    
    handleDialogueChoice(choiceIndex) {
        const choice = this.currentDialogueChoices[choiceIndex];
        if (choice && choice.action) {
            choice.action();
        }
    }
    
    closeDialogue() {
        const modal = document.getElementById('dialogue-modal');
        if (modal) {
            modal.remove();
        }
        this.currentDialogueChoices = [];
    }
    
    showQuestNotification(message) {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--cosmic-purple);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10001;
            font-weight: bold;
            box-shadow: 0 0 20px rgba(106, 13, 173, 0.5);
            animation: slideInCenter 0.3s ease-out;
            text-align: center;
            max-width: 400px;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Add animation styles if not already added
        if (!document.getElementById('quest-notification-styles')) {
            const style = document.createElement('style');
            style.id = 'quest-notification-styles';
            style.textContent = `
                @keyframes slideInCenter {
                    from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                    to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    getAuroraStatus() {
        const auroraQuest = this.activeQuests.get('aurora_meeting');
        if (auroraQuest) {
            return 'Quest Available';
        }
        
        const cosmicQuest = this.activeQuests.get('cosmic_investigation');
        if (cosmicQuest) {
            return 'Investigation in Progress';
        }
        
        return 'Waiting for you';
    }
    
    // Public API
    getActiveQuests() {
        return Array.from(this.activeQuests.values());
    }
    
    getAvailableQuests() {
        return Array.from(this.availableQuests.values());
    }
    
    getCompletedQuests() {
        return Array.from(this.completedQuests.values());
    }
    
    // Initialize the system
    init() {
        if (this.isInitialized) return;
        
        console.log('🎭 Initializing unified quest system...');
        
        // Don't create quest markers until game starts
        // Quest markers will be created when resumeQuestSystem() is called
        
        this.isInitialized = true;
        console.log('🎭 Unified quest system initialized (paused)');
    }
    
    // Test method to manually trigger quest proximity check
    testQuestTrigger() {
        console.log('🎭 Testing quest trigger...');
        const playerPosition = this.getPlayerPosition();
        if (playerPosition) {
            console.log('🎭 Player position:', playerPosition);
            this.checkQuestObjectiveProximity(playerPosition);
        } else {
            console.log('🎭 No player position available for test');
        }
    }
    
    // Pause quest system (during start screen)
    pauseQuestSystem() {
        this.isPaused = true;
        console.log('🎭 Quest system paused');
    }
    
    // Resume quest system (when game starts)
    resumeQuestSystem() {
        console.log('🎭 ResumeQuestSystem called!');
        console.log('🎭 Current pause state:', this.isPaused);
        console.log('🎭 Resuming quest system...');
        this.isPaused = false;
        
        // Adventure mode gate: require selection once, then apply
        const selectedMode = this.getAdventureMode();
        if (!selectedMode) {
            // Show lightweight selector and defer resume until chosen
            this.showAdventureSelector();
            console.log('🎭 Awaiting adventure mode selection before creating markers');
            return;
        }
        
        // If Game mode, randomize proximity objectives around player within radius
        if (selectedMode === 'game') {
            // Scatter within ~300m by default (tunable)
            this.scatterObjectivesNearPlayer(300);
        }
        
        // Clear all caches first to ensure fresh start
        this.clearAllCaches();
        
        // Update Aurora position to be 100m away from player
        this.updateAuroraPosition();
        
        // Setup UI and create quest markers now that game has started
        this.setupUI();
        this.clearQuestMarkers();
        this.createQuestMarkers();
        
        // Start position tracking now that game has begun
        this.startPositionTracking();
        
        // Start Aurora movement
        this.startAuroraMovement();
        
        // Reset any quests that were triggered during start screen
        this.resetQuestsForGameStart();
        
        // Test: Trigger quest dialog immediately for testing
        setTimeout(() => {
            this.triggerTestQuestDialog();
        }, 500);
        
        console.log('🎭 Quest system resumed successfully');
    }

    // Persisted adventure mode helpers
    getAdventureMode() {
        try {
            return localStorage.getItem('adventureMode');
        } catch (e) {
            console.warn('🎭 localStorage unavailable for adventureMode');
            return null;
        }
    }

    setAdventureMode(mode) {
        try {
            localStorage.setItem('adventureMode', mode);
        } catch (e) {
            console.warn('🎭 Failed to persist adventureMode');
        }
    }

    // Lightweight in-DOM selector (no HTML edits needed)
    showAdventureSelector() {
        // Avoid duplicates
        if (document.getElementById('adventure-selector-modal')) return;
        const modal = document.createElement('div');
        modal.id = 'adventure-selector-modal';
        modal.style.cssText = `
            position: fixed; inset: 0; display: flex; align-items: center; justify-content: center;
            background: rgba(0,0,0,0.6); z-index: 10000;
        `;
        modal.innerHTML = `
            <div style="background: rgba(10,10,14,0.95); border: 2px solid var(--cosmic-purple);
                         border-radius: 12px; padding: 16px; width: 280px; color: var(--cosmic-light);
                         box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h3 style="margin: 0 0 8px; color: var(--cosmic-purple);">Choose Adventure</h3>
                <p style="margin: 0 0 12px; font-size: 12px; opacity: .85;">Pick a mode to begin.</p>
                <div style="display: grid; gap: 8px;">
                    <button id="mode-demo-btn" class="sacred-button" style="padding: 8px;">Demo (fixed objectives)</button>
                    <button id="mode-game-btn" class="sacred-button" style="padding: 8px; background: var(--cosmic-green);">Game (randomized nearby)</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        const onPick = (mode) => {
            this.onAdventureSelected(mode);
            modal.remove();
        };
        modal.querySelector('#mode-demo-btn').addEventListener('click', () => onPick('demo'));
        modal.querySelector('#mode-game-btn').addEventListener('click', () => onPick('game'));
    }

    onAdventureSelected(mode) {
        this.setAdventureMode(mode);
        // Apply mode immediately and continue resume flow
        if (mode === 'game') {
            this.scatterObjectivesNearPlayer(300);
        }
        this.setupUI();
        this.clearQuestMarkers();
        this.createQuestMarkers();
        this.startPositionTracking();
        this.startAuroraMovement();
        this.resetQuestsForGameStart();
        setTimeout(() => this.triggerTestQuestDialog(), 500);
        console.log('🎭 Adventure mode selected:', mode);
    }

    // Remove existing quest markers safely
    clearQuestMarkers() {
        if (!this.questMarkers) return;
        try {
            this.questMarkers.forEach((marker) => {
                if (marker && typeof marker.remove === 'function') {
                    marker.remove();
                } else if (marker && window.mapEngine && window.mapEngine.map && typeof marker.removeFrom === 'function') {
                    marker.removeFrom(window.mapEngine.map);
                }
            });
        } catch (e) {
            console.warn('🎭 Error clearing quest markers', e);
        }
        this.questMarkers.clear();
    }

    // Randomize proximity objective locations around current player within radiusMeters
    scatterObjectivesNearPlayer(radiusMeters = 300) {
        const player = this.getPlayerPosition && this.getPlayerPosition();
        if (!player || typeof player.lat !== 'number' || typeof player.lng !== 'number') {
            console.log('🎭 Cannot scatter objectives: no player position');
            return;
        }
        const radiusKm = Math.max(10, radiusMeters) / 1000; // ensure sensible minimum
        const jitterBearing = () => Math.random() * 360;
        const jitterDistanceKm = () => (Math.random() * radiusKm);
        
        this.availableQuests.forEach((quest) => {
            if (!Array.isArray(quest.objectives)) return;
            quest.objectives.forEach((obj, idx) => {
                if (obj && obj.type === 'proximity') {
                    const bearing = jitterBearing();
                    const distanceKm = jitterDistanceKm();
                    const dest = this.calculateDestination(player.lat, player.lng, bearing, distanceKm);
                    // Apply scattered location
                    obj.location = { lat: dest.lat, lng: dest.lng };
                    // Optionally, slightly vary required distance
                    if (typeof obj.distance === 'number') {
                        const delta = Math.round((Math.random() - 0.5) * 10);
                        obj.distance = Math.max(20, obj.distance + delta);
                    }
                }
            });
        });
        console.log('🎭 Objectives scattered within', radiusMeters, 'meters of player');
    }
    
    // Move a specific objective to a new distinct nearby location
    retargetObjectiveLocation(quest, objective, radiusMeters = 300, minSeparationMeters = 150) {
        const player = this.getPlayerPosition && this.getPlayerPosition();
        if (!player || typeof player.lat !== 'number' || typeof player.lng !== 'number') {
            console.log('🎭 Cannot retarget objective: no player position');
            return;
        }
        const oldLocation = objective.location;
        const radiusKm = Math.max(10, radiusMeters) / 1000;
        const minSepKm = Math.max(0, minSeparationMeters) / 1000;
        
        let attempts = 0;
        let chosen = null;
        while (attempts < 10) {
            const bearing = Math.random() * 360;
            const distanceKm = Math.random() * radiusKm;
            const dest = this.calculateDestination(player.lat, player.lng, bearing, distanceKm);
            if (!oldLocation) { chosen = dest; break; }
            const sepFromOld = this.getDistanceFromLatLonInKm(dest.lat, dest.lng, oldLocation.lat, oldLocation.lng);
            if (sepFromOld >= minSepKm) { chosen = dest; break; }
            attempts++;
        }
        if (!chosen) {
            // Fallback: nudge old location by min separation north
            chosen = this.calculateDestination(oldLocation.lat, oldLocation.lng, 0, minSepKm);
        }
        objective.location = { lat: chosen.lat, lng: chosen.lng };
        console.log('🎭 Objective retargeted:', objective.id, '→', objective.location);
    }

    // Recreate the marker for a specific objective using its updated location
    refreshObjectiveMarker(quest, objective) {
        if (!window.mapEngine || !window.mapEngine.map) return;
        const key = `${quest.id}_${objective.id}`;
        const existing = this.questMarkers.get(key);
        if (existing) {
            try { existing.remove(); } catch (e) { /* ignore */ }
            this.questMarkers.delete(key);
        }
        if (objective.location) {
            const marker = this.createQuestObjectiveMarker(objective, objective.location);
            if (marker) {
                this.questMarkers.set(key, marker);
                // Focus
                try {
                    window.mapEngine.map.setView([objective.location.lat, objective.location.lng], 18, { animate: true, duration: 1.0 });
                    if (marker.openPopup) setTimeout(() => marker.openPopup(), 300);
                } catch (e) { /* ignore */ }
            }
        }
    }
    
    // Clear all caches to ensure fresh start
    clearAllCaches() {
        console.log('🎭 Clearing all quest system caches...');
        
        // Clear visited quests and cooldowns (no longer used)
        // this.visitedQuests.clear();
        // this.questCooldowns.clear();
        
        // Clear dialog cooldowns
        this.dialogCooldowns.clear();
        
        // Close any open dialog
        this.closeQuestDialog();
        
        // Reset quest statuses
        this.availableQuests.forEach((quest, questId) => {
            quest.status = 'available';
        });
        
        // Clear active quests
        this.activeQuests.clear();
        
        // Reset last player position
        this.lastPlayerPosition = null;
        
        console.log('🎭 All caches cleared successfully');
    }
    
    // Test method to trigger quest dialog immediately
    triggerTestQuestDialog() {
        console.log('🎭 Triggering test quest dialog...');
        
        // Get the corroding lake quest
        const quest = this.availableQuests.get('corroding_lake');
        if (!quest) {
            console.log('🎭 No corroding lake quest found');
            return;
        }
        
        // Get the first objective
        const objective = quest.objectives[0];
        if (!objective) {
            console.log('🎭 No objectives found for quest');
            return;
        }
        
        // Start the quest if it's available
        if (quest.status === 'available') {
            this.startQuest('corroding_lake');
        }
        
        // Show the quest dialog
        this.showQuestDialog(quest, objective);
    }
    
    // Force trigger quest for testing
    forceTriggerQuest() {
        console.log('🎭 Force triggering quest for testing...');
        const quest = this.availableQuests.get('corroding_lake');
        if (quest) {
            this.showQuestDialog(quest, quest.objectives[0]);
        }
    }
    
    // Update Aurora position to be 100m away from player
    updateAuroraPosition() {
        const playerPosition = this.getPlayerPosition();
        if (!playerPosition) {
            console.log('🎭 No player position available for Aurora placement');
            return;
        }
        
        // Calculate position 100m north of player
        const distanceKm = 0.1; // 100 meters in kilometers
        const bearing = 0; // North direction
        
        const newPosition = this.calculateDestination(playerPosition.lat, playerPosition.lng, bearing, distanceKm);
        
        this.aurora.lat = newPosition.lat;
        this.aurora.lng = newPosition.lng;
        
        console.log('🎭 Aurora position updated to be 100m away from player:', newPosition);
    }
    
    // Calculate destination point given start point, bearing, and distance
    calculateDestination(lat, lng, bearing, distanceKm) {
        const R = 6371; // Earth's radius in kilometers
        const lat1 = lat * Math.PI / 180;
        const lng1 = lng * Math.PI / 180;
        const bearingRad = bearing * Math.PI / 180;
        
        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceKm / R) +
                              Math.cos(lat1) * Math.sin(distanceKm / R) * Math.cos(bearingRad));
        
        const lng2 = lng1 + Math.atan2(Math.sin(bearingRad) * Math.sin(distanceKm / R) * Math.cos(lat1),
                                       Math.cos(distanceKm / R) - Math.sin(lat1) * Math.sin(lat2));
        
        return {
            lat: lat2 * 180 / Math.PI,
            lng: lng2 * 180 / Math.PI
        };
    }
    
    // Start position tracking (only called when quest system resumes)
    startPositionTracking() {
        // Clear any existing interval
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
        }
        
        // Set up position tracking for proximity-based quests
        this.positionUpdateInterval = setInterval(() => {
            this.updateQuestProximity();
            this.logAllDistances(); // Add comprehensive distance logging
        }, 5000); // Check every 5 seconds to reduce spam
        
        console.log('🎭 Position tracking started');
    }
    
    // Reset quests for game start (clear any progress made during start screen)
    resetQuestsForGameStart() {
        console.log('🎭 Resetting quests for game start...');
        
        // Reset all quest objectives to incomplete
        this.activeQuests.forEach(quest => {
            quest.objectives.forEach(objective => {
                objective.status = 'incomplete';
            });
        });
        
        // Move any active quests back to available
        this.activeQuests.forEach((quest, questId) => {
            quest.status = 'available';
            this.availableQuests.set(questId, quest);
        });
        this.activeQuests.clear();
        
        console.log('🎭 Quest reset complete - all quests are now available');
        
        // Reset visited quests for new game session
        this.visitedQuests.clear();
        this.questCooldowns.clear();
        console.log('🎭 Visited quests and cooldowns reset for new game session');
        
        // Test quest system after reset
        setTimeout(() => {
            console.log('🎭 Testing quest system after game start...');
            this.testQuestTrigger();
        }, 2000); // Test after 2 seconds
    }
    
    // Show Lovecraftian/Pratchett style quest dialog
    showQuestDialog(quest, objective) {
        console.log('🎭 Showing quest dialog for:', quest.name);
        
        // If docked panel manager exists, render as docked panel and return
        if (window.panelManager) {
            const content = `
                <div style="position: relative; z-index: 1;">
                    <div style="background: rgba(0, 0, 0, 0.5); padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #00ffff;">
                        <div style="margin: 0 0 8px 0; line-height: 1.4; font-size: 13px;">
                            ${this.getQuestDialogText(quest, objective)}
                        </div>
                    </div>
                    <div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            ${this.getQuestOptions(quest, objective)}
                        </div>
                    </div>
                </div>
            `;
            const panel = window.panelManager.openPanel(`quest-${quest.id}`, { title: `📜 ${quest.name}` , content, height: 380 });
            // Wire option handlers inside panel
            this.addQuestOptionHandlers(panel, quest, objective);
            this.currentDialog = panel;
            return;
        }

        // Check if dialog is already open
        if (this.currentDialog) {
            console.log('🎭 Dialog already open, closing existing dialog first');
            this.closeQuestDialog();
        }
        
        // Create dialog overlay
        const dialogOverlay = document.createElement('div');
        dialogOverlay.className = 'quest-dialog-overlay';
        dialogOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            align-items: flex-start;
            justify-content: center;
            padding-top: 50px;
            font-family: 'Courier New', monospace;
            overflow-y: auto;
        `;
        
        // Create dialog content
        const dialogContent = document.createElement('div');
        dialogContent.className = 'quest-dialog-content';
        dialogContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 20px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            color: #ffffff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            position: relative;
            overflow: hidden;
            margin-bottom: 50px;
        `;
        
        // Add cosmic background effect
        const cosmicBg = document.createElement('div');
        cosmicBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(0, 255, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
        `;
        dialogContent.appendChild(cosmicBg);
        
        // Quest content
        const questHTML = `
            <div style="position: relative; z-index: 1;">
                <div style="text-align: center; margin-bottom: 15px;">
                    <h2 style="color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); margin: 0 0 8px 0; font-size: 20px;">
                        🌌 ${quest.name} 🌌
                    </h2>
                    <div style="color: #ffaa00; font-style: italic; font-size: 12px;">
                        A cosmic entity materializes before you...
                    </div>
                </div>
                
                <div style="background: rgba(0, 0, 0, 0.5); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00ffff;">
                    <p style="margin: 0 0 10px 0; line-height: 1.4; font-size: 14px;">
                        ${this.getQuestDialogText(quest, objective)}
                    </p>
                </div>
                
                <div style="text-align: center;">
                    <h3 style="color: #ffaa00; margin-bottom: 12px; font-size: 16px;">Choose your response:</h3>
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        ${this.getQuestOptions(quest, objective)}
                    </div>
                    <div style="margin-top: 15px;">
                        <button onclick="window.unifiedQuestSystem.closeQuestDialog()" 
                                style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); 
                                       border: 2px solid #ffaa00; 
                                       color: white; 
                                       padding: 8px 16px; 
                                       border-radius: 6px; 
                                       cursor: pointer; 
                                       font-family: 'Courier New', monospace; 
                                       font-size: 12px; 
                                       font-weight: bold; 
                                       transition: all 0.3s ease;">
                            ❌ Close Dialog
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        dialogContent.innerHTML = questHTML;
        dialogOverlay.appendChild(dialogContent);
        
        // Store dialog reference
        this.currentDialog = dialogOverlay;
        
        // Add click outside to close
        dialogOverlay.addEventListener('click', (e) => {
            if (e.target === dialogOverlay) {
                this.closeQuestDialog();
            }
        });
        
        document.body.appendChild(dialogOverlay);
        
        // Add click handlers for options
        this.addQuestOptionHandlers(dialogOverlay, quest, objective);
        
        // Store reference for cleanup
        this.currentDialog = dialogOverlay;
    }
    
    // Get quest dialog text based on quest and objective
    getQuestDialogText(quest, objective) {
        if (quest.id === 'corroding_lake') {
            switch (objective.id) {
                case 'escape_corroding_lake':
                    return `
                        <em>"The air itself burns with toxic vapors!"</em> You cough violently as you approach the fuming lake. 
                        <br><br>
                        The water shimmers with an unnatural green glow, and strange bubbles rise from its depths. The very ground around the lake is cracked and withered, as if life itself is being drained away.
                        <br><br>
                        <em>"You must choose quickly - the fumes are growing stronger!"</em> Your vision begins to blur as the toxic air takes its toll.
                    `;
                case 'find_ancient_staff':
                    return `
                        You take a wrong turn and find yourself in a hidden grove. There, embedded in the ancient earth, lies a gnarled wooden branch that seems to pulse with inner light.
                        <br><br>
                        <em>"This is no ordinary branch,"</em> you think to yourself. The wood is warm to the touch and covered in strange runes that seem to shift and change as you look at them.
                        <br><br>
                        A voice whispers in your mind: <em>"Take me, and I shall aid you in your darkest hour."</em>
                    `;
                case 'meet_lunatic_sage':
                    return `
                        At the top of the hill, you encounter a wild-eyed figure in tattered robes. His hair is matted and his eyes gleam with both madness and wisdom.
                        <br><br>
                        <em>"Ah, another seeker of truth!"</em> he cackles. <em>"I am the Sage of Purification, and I have been waiting for one such as you. The lake's corruption spreads, but I know the ancient rites to cleanse it."</em>
                        <br><br>
                        He begins to chant in a language that makes your head spin, and the air around you shimmers with mystical energy.
                    `;
                case 'face_troll_bridge':
                    return `
                        A massive, hideous troll blocks the bridge ahead. Its skin is like cracked stone, and its eyes burn with malevolent intelligence.
                        <br><br>
                        <em>"None shall pass!"</em> it roars, brandishing a club the size of a tree trunk. <em>"The bridge is mine, and I demand tribute!"</em>
                        <br><br>
                        You notice the ancient staff in your hand begins to glow softly, and you feel a strange confidence welling up inside you.
                    `;
                case 'release_cthulhu':
                    return `
                        Working alongside the lunatic sage, you complete the purification ritual. The lake's waters begin to clear, but something stirs in the depths...
                        <br><br>
                        <em>"What have we done?"</em> the sage whispers in horror as the water begins to boil and churn. Massive tentacles emerge from the depths, and a voice that defies description echoes across the landscape.
                        <br><br>
                        <em>"Cthulhu awakens!"</em> The very air trembles with the power of the ancient horror.
                    `;
            }
        }
        
        return quest.description || "A mysterious entity offers you a quest...";
    }
    
    // Get quest options with Lovecraftian/Pratchett style
    getQuestOptions(quest, objective) {
        if (quest.id === 'corroding_lake') {
            switch (objective.id) {
                case 'escape_corroding_lake':
                    return `
                        <button class="quest-option" data-outcome="swim" style="
                            background: linear-gradient(45deg, #00bfff, #0080ff);
                            border: 2px solid #00ffff;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🏊 <strong>Swim Through the Toxins</strong><br>
                            <small>Dive into the lake and swim to safety. (Risk: -25 Health, -10 Sanity)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="run" style="
                            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                            border: 2px solid #ffaa00;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🏃 <strong>Run Around the Lake</strong><br>
                            <small>Take the long way around, but the fumes are spreading. (Risk: -15 Sanity)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="die" style="
                            background: linear-gradient(45deg, #8b0000, #4b0000);
                            border: 2px solid #ff0000;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            💀 <strong>Accept Your Fate</strong><br>
                            <small>Stand still and let the toxins take you. (Instant Death)</small>
                        </button>
                    `;
                case 'find_ancient_staff':
                    return `
                        <button class="quest-option" data-outcome="take" style="
                            background: linear-gradient(45deg, #8b4513, #a0522d);
                            border: 2px solid #daa520;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🌿 <strong>Take the Ancient Staff</strong><br>
                            <small>Claim the mystical branch as your own. (+Ancient Staff, +5 Sanity)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="examine" style="
                            background: linear-gradient(45deg, #4b0082, #8a2be2);
                            border: 2px solid #ff00ff;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🔍 <strong>Examine the Runes</strong><br>
                            <small>Study the shifting symbols to understand their power. (+10 Sanity, -5 Health)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="leave" style="
                            background: linear-gradient(45deg, #696969, #2f4f4f);
                            border: 2px solid #ffffff;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🚶 <strong>Leave It Be</strong><br>
                            <small>Some things are better left untouched. (No effect)</small>
                        </button>
                    `;
                case 'meet_lunatic_sage':
                    return `
                        <button class="quest-option" data-outcome="riddle" style="
                            background: linear-gradient(45deg, #ffd700, #ffa500);
                            border: 2px solid #ffff00;
                            color: #000000;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🧩 <strong>Answer His Riddle</strong><br>
                            <small>Prove your worth by solving his cosmic puzzle. (Mini-game: Riddle)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="listen" style="
                            background: linear-gradient(45deg, #9370db, #8a2be2);
                            border: 2px solid #ff00ff;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            👂 <strong>Listen to His Chanting</strong><br>
                            <small>Absorb the ancient knowledge through his mystical words. (+15 Sanity, -5 Health)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="interrupt" style="
                            background: linear-gradient(45deg, #dc143c, #8b0000);
                            border: 2px solid #ff0000;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            ⚡ <strong>Interrupt His Ritual</strong><br>
                            <small>Stop his chanting before it's too late. (Risk: -20 Sanity, +10 Health)</small>
                        </button>
                    `;
                case 'face_troll_bridge':
                    return `
                        <button class="quest-option" data-outcome="staff" style="
                            background: linear-gradient(45deg, #8b4513, #a0522d);
                            border: 2px solid #daa520;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🌿 <strong>Attack with Ancient Staff</strong><br>
                            <small>Use your mystical weapon to defeat the troll. (Success: +20 XP, +10 Health)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="clever" style="
                            background: linear-gradient(45deg, #4b0082, #8a2be2);
                            border: 2px solid #ff00ff;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🧠 <strong>Outwit the Troll</strong><br>
                            <small>Try to outsmart the creature with words. (Risk: Instant Death if failed)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="flee" style="
                            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
                            border: 2px solid #ffaa00;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🏃 <strong>Flee in Terror</strong><br>
                            <small>Run away as fast as you can. (Risk: Instant Death)</small>
                        </button>
                    `;
                case 'release_cthulhu':
                    return `
                        <button class="quest-option" data-outcome="complete" style="
                            background: linear-gradient(45deg, #00ff00, #00cc00);
                            border: 2px solid #ffffff;
                            color: #000000;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🐙 <strong>Complete the Ritual</strong><br>
                            <small>Finish what you started and face the consequences. (Quest Complete: +50 XP, +Ancient Knowledge)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="stop" style="
                            background: linear-gradient(45deg, #ff0000, #8b0000);
                            border: 2px solid #ffff00;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            ⛔ <strong>Stop the Ritual</strong><br>
                            <small>Try to prevent Cthulhu's awakening. (Risk: -30 Sanity, Quest Failed)</small>
                        </button>
                        
                        <button class="quest-option" data-outcome="embrace" style="
                            background: linear-gradient(45deg, #8b0000, #4b0000);
                            border: 2px solid #ff0000;
                            color: white;
                            padding: 15px 20px;
                            border-radius: 8px;
                            cursor: pointer;
                            font-family: 'Courier New', monospace;
                            font-size: 14px;
                            font-weight: bold;
                            transition: all 0.3s ease;
                            text-align: left;
                        ">
                            🌊 <strong>Embrace the Madness</strong><br>
                            <small>Welcome the ancient horror and become one with the cosmic truth. (Instant Death, but Epic)</small>
                        </button>
                    `;
            }
        }
        
        return `
            <button class="quest-option" data-outcome="accept" style="
                background: linear-gradient(45deg, #00ff00, #00cc00);
                border: 2px solid #ffffff;
                color: #000000;
                padding: 15px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            ">
                Accept Quest
            </button>
        `;
    }
    
    // Add click handlers for quest options
    addQuestOptionHandlers(dialogOverlay, quest, objective) {
        const options = dialogOverlay.querySelectorAll('.quest-option');
        options.forEach(option => {
            option.addEventListener('click', () => {
                const outcome = option.dataset.outcome;
                this.handleQuestOption(quest, objective, outcome);
                this.closeQuestDialog();
            });
            
            // Add hover effects
            option.addEventListener('mouseenter', () => {
                option.style.transform = 'scale(1.05)';
                option.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
            });
            
            option.addEventListener('mouseleave', () => {
                option.style.transform = 'scale(1)';
                option.style.boxShadow = 'none';
            });
        });
    }
    
    // Handle quest option selection
    handleQuestOption(quest, objective, outcome) {
        console.log(`🎭 Quest option selected: ${outcome} for quest ${quest.name}`);
        
        let effect = null;
        let feedbackText = '';
        let shouldCompleteObjective = true;
        
        // Update encounter system stats
        if (window.eldritchApp && window.eldritchApp.systems.encounter) {
            const encounter = window.eldritchApp.systems.encounter;
            
            if (quest.id === 'corroding_lake') {
                switch (objective.id) {
                    case 'escape_corroding_lake':
                        switch (outcome) {
                            case 'swim':
                                effect = { type: 'health', amount: -25 };
                                this.applyQuestEffect(effect);
                                effect = { type: 'sanity', amount: -10 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You dive into the toxic waters! The burning sensation is unbearable, but you manage to swim through to safety. Your body and mind bear the scars of your desperate choice.";
                                break;
                            case 'run':
                                effect = { type: 'sanity', amount: -15 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You take the long way around the lake, but the spreading fumes still affect you. Your mind struggles with the toxic air, but you survive to continue your journey.";
                                break;
                            case 'die':
                                effect = { type: 'health', amount: -999 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You stand still as the toxic fumes envelop you. Your last thought is of the cosmic horror you never got to face. Game Over.";
                                shouldCompleteObjective = false;
                                break;
                        }
                        break;
                        
                    case 'find_ancient_staff':
                        switch (outcome) {
                            case 'take':
                                effect = { type: 'sanity', amount: 5 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You grasp the ancient staff and feel its power coursing through you. The runes glow softly, and you sense that this weapon will be crucial in your coming trials.";
                                break;
                            case 'examine':
                                effect = { type: 'sanity', amount: 10 };
                                this.applyQuestEffect(effect);
                                effect = { type: 'health', amount: -5 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You study the shifting runes intently. Ancient knowledge floods your mind, expanding your understanding of cosmic forces, but the mental strain takes its toll on your body.";
                                break;
                            case 'leave':
                                feedbackText = "You decide to leave the staff where it lies. Some mysteries are better left unsolved, and you continue your journey without the ancient weapon.";
                                break;
                        }
                        break;
                        
                    case 'meet_lunatic_sage':
                        switch (outcome) {
                            case 'riddle':
                                // Trigger riddle minigame
                                this.showRiddleMinigame(quest, objective);
                                return; // Don't complete objective yet
                            case 'listen':
                                effect = { type: 'sanity', amount: 15 };
                                this.applyQuestEffect(effect);
                                effect = { type: 'health', amount: -5 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You listen intently to the sage's ancient chanting. Mystical knowledge seeps into your consciousness, expanding your understanding of cosmic purification, though the mental strain is taxing.";
                                break;
                            case 'interrupt':
                                effect = { type: 'sanity', amount: -20 };
                                this.applyQuestEffect(effect);
                                effect = { type: 'health', amount: 10 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You interrupt the sage's ritual! The sudden stop causes a backlash of mystical energy, but you manage to avoid the worst of it. The sage looks at you with wild eyes.";
                                break;
                        }
                        break;
                        
                    case 'face_troll_bridge':
                        switch (outcome) {
                            case 'staff':
                                effect = { type: 'experience', amount: 20 };
                                this.applyQuestEffect(effect);
                                effect = { type: 'health', amount: 10 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You brandish the ancient staff! Its mystical power overwhelms the troll, and it crumbles to dust. The bridge is yours, and you feel stronger for the victory.";
                                break;
                            case 'clever':
                                // 50% chance of success
                                if (Math.random() < 0.5) {
                                    effect = { type: 'experience', amount: 30 };
                                    this.applyQuestEffect(effect);
                                    feedbackText = "You outwit the troll with clever wordplay! It scratches its head in confusion and steps aside. 'You may pass,' it grumbles. Your intelligence has saved the day!";
                                } else {
                                    effect = { type: 'health', amount: -999 };
                                    this.applyQuestEffect(effect);
                                    feedbackText = "The troll is not amused by your attempts at cleverness. 'Foolish mortal!' it roars, and with one mighty swing, your adventure ends. Game Over.";
                                    shouldCompleteObjective = false;
                                }
                                break;
                            case 'flee':
                                effect = { type: 'health', amount: -999 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You turn and flee in terror! But the troll is faster than you expected. Its massive club comes down with a thunderous crash, ending your journey. Game Over.";
                                shouldCompleteObjective = false;
                                break;
                        }
                        break;
                        
                    case 'release_cthulhu':
                        switch (outcome) {
                            case 'complete':
                                effect = { type: 'experience', amount: 50 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You complete the purification ritual! The lake clears, but Cthulhu awakens from his slumber. The ancient horror rises from the depths, and you have successfully completed your quest... though the world may never be the same.";
                                break;
                            case 'stop':
                                effect = { type: 'sanity', amount: -30 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You desperately try to stop the ritual, but it's too late! The cosmic forces are already in motion. Cthulhu stirs, and your mind shatters under the weight of cosmic horror. The quest fails, but you survive... barely.";
                                shouldCompleteObjective = false;
                                break;
                            case 'embrace':
                                effect = { type: 'health', amount: -999 };
                                this.applyQuestEffect(effect);
                                feedbackText = "You embrace the cosmic madness! Cthulhu's awakening fills you with ecstatic terror. You become one with the ancient horror, transcending mortal existence. Your journey ends in cosmic apotheosis. Game Over - but what an ending!";
                                shouldCompleteObjective = false;
                                break;
                        }
                        break;
                }
            } else {
                // Handle old quest system
                switch (outcome) {
                    case 'random':
                        const randomEffects = [
                            { type: 'sanity', amount: Math.random() > 0.5 ? 10 : -10 },
                            { type: 'health', amount: Math.random() > 0.5 ? 5 : -5 },
                            { type: 'experience', amount: 25 }
                        ];
                        effect = randomEffects[Math.floor(Math.random() * randomEffects.length)];
                        this.applyQuestEffect(effect);
                        
                        const randomFeedbacks = [
                            "The cosmic dice roll in your favor! The universe smiles upon your bold choice.",
                            "Reality bends and twists around your decision. Something... changes.",
                            "The cosmic forces respond to your embrace of chaos. The outcome is... unexpected.",
                            "Your willingness to accept the unknown has pleased the cosmic entities. They reward your courage."
                        ];
                        feedbackText = randomFeedbacks[Math.floor(Math.random() * randomFeedbacks.length)];
                        break;
                        
                    case 'sanity':
                        effect = { type: 'sanity', amount: -20 };
                        this.applyQuestEffect(effect);
                        feedbackText = "You dive deep into the cosmic truth, but the knowledge comes at a price. Your mind struggles to comprehend what you've learned, and your sanity wavers under the weight of forbidden knowledge.";
                        break;
                        
                    case 'health':
                        effect = { type: 'health', amount: -15 };
                        this.applyQuestEffect(effect);
                        feedbackText = "You confront the entity directly, but the cosmic horror is not to be trifled with. Your body bears the physical cost of your bravery as reality itself lashes out at your audacity.";
                        break;
                        
                    case 'accept':
                        feedbackText = "You accept the cosmic entity's offer with grace and wisdom. The quest begins, and you feel the weight of destiny settling upon your shoulders.";
                        break;
                }
            }
        }
        
        // Complete the objective only if it should be completed
        if (shouldCompleteObjective) {
            console.log(`🎭 Completing objective: ${objective.id} for quest: ${quest.id}`);
            this.completeObjective(quest.id, objective.id);
            
            // Hide current quest marker and show next one
            console.log(`🎭 Progressing quest markers for quest: ${quest.id}, objective: ${objective.id}`);
            this.progressQuestMarkers(quest, objective);
        } else {
            console.log(`🎭 Not completing objective: ${objective.id} (shouldCompleteObjective = false)`);
            // Wrong-answer retargeting: move objective to a distinct nearby location and re-highlight
            try {
                this.retargetObjectiveLocation(quest, objective, 300, 150);
                this.refreshObjectiveMarker(quest, objective);
                if (window.eldritchApp && window.eldritchApp.showNotification) {
                    window.eldritchApp.showNotification('🎯 Objective moved to a new location! Try again.', 'warning');
                }
            } catch (e) {
                console.warn('🎭 Failed to retarget objective after wrong answer', e);
            }
        }
        
        // Show feedback dialog
        this.showQuestFeedback(quest, outcome, effect, feedbackText);
    }
    
    // Show riddle minigame
    showRiddleMinigame(quest, objective) {
        console.log('🎭 Starting riddle minigame...');
        
        // Close current dialog
        this.closeQuestDialog();
        
        // Create riddle minigame overlay
        const riddleOverlay = document.createElement('div');
        riddleOverlay.className = 'riddle-minigame-overlay';
        riddleOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        `;
        
        // Riddle content
        const riddleContent = document.createElement('div');
        riddleContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            border: 3px solid #ffd700;
            border-radius: 15px;
            padding: 30px;
            max-width: 600px;
            width: 90%;
            color: #ffffff;
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.5);
            text-align: center;
        `;
        
        // Riddle questions
        const riddles = [
            {
                question: "I am not alive, but I can grow. I don't have lungs, but I need air. I don't have a mouth, but water kills me. What am I?",
                answers: ["Fire", "Plant", "Cloud", "Shadow"],
                correct: 0
            },
            {
                question: "The more you take, the more you leave behind. What am I?",
                answers: ["Footsteps", "Money", "Time", "Memories"],
                correct: 0
            },
            {
                question: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?",
                answers: ["Echo", "Whisper", "Wind", "Spirit"],
                correct: 0
            }
        ];
        
        const currentRiddle = riddles[Math.floor(Math.random() * riddles.length)];
        
        riddleContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h2 style="color: #ffd700; text-shadow: 0 0 10px rgba(255, 215, 0, 0.8); margin: 0 0 15px 0;">
                    🧙 The Sage's Riddle 🧙
                </h2>
                <p style="font-style: italic; color: #ffaa00; margin-bottom: 20px;">
                    "Answer my riddle correctly, and I shall teach you the ancient purification rites!"
                </p>
            </div>
            
            <div style="background: rgba(0, 0, 0, 0.5); padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffd700;">
                <p style="margin: 0; line-height: 1.6; font-size: 16px;">
                    ${currentRiddle.question}
                </p>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 10px;">
                ${currentRiddle.answers.map((answer, index) => `
                    <button class="riddle-answer" data-answer="${index}" style="
                        background: linear-gradient(45deg, #4b0082, #8a2be2);
                        border: 2px solid #ff00ff;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 8px;
                        cursor: pointer;
                        font-family: 'Courier New', monospace;
                        font-size: 14px;
                        font-weight: bold;
                        transition: all 0.3s ease;
                    ">
                        ${String.fromCharCode(65 + index)}. ${answer}
                    </button>
                `).join('')}
            </div>
            
            <div style="margin-top: 20px; color: #ffaa00; font-size: 12px;">
                Choose wisely - your answer will determine your fate!
            </div>
            
            <div style="margin-top: 15px;">
                <button onclick="window.unifiedQuestSystem.closeRiddleMinigame()" 
                        style="background: linear-gradient(45deg, #ff6b6b, #ee5a24); 
                               border: 2px solid #ffaa00; 
                               color: white; 
                               padding: 8px 16px; 
                               border-radius: 6px; 
                               cursor: pointer; 
                               font-family: 'Courier New', monospace; 
                               font-size: 12px; 
                               font-weight: bold; 
                               transition: all 0.3s ease;">
                    ❌ Close Riddle
                </button>
            </div>
        `;
        
        riddleOverlay.appendChild(riddleContent);
        document.body.appendChild(riddleOverlay);
        
        // Add click handlers for answers
        const answerButtons = riddleOverlay.querySelectorAll('.riddle-answer');
        answerButtons.forEach((button, index) => {
            button.addEventListener('click', () => {
                const isCorrect = index === currentRiddle.correct;
                
                if (isCorrect) {
                    // Correct answer
                    riddleContent.innerHTML = `
                        <div style="text-align: center;">
                            <h2 style="color: #00ff00; text-shadow: 0 0 10px rgba(0, 255, 0, 0.8); margin-bottom: 20px;">
                                ✅ Correct! ✅
                            </h2>
                            <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">
                                "Excellent! Your wisdom impresses me. I shall teach you the ancient purification rites!"
                            </p>
                            <button onclick="window.unifiedQuestSystem.completeRiddleMinigame(true)" style="
                                background: linear-gradient(45deg, #00ff00, #00cc00);
                                border: 2px solid #ffffff;
                                color: #000000;
                                padding: 15px 30px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-family: 'Courier New', monospace;
                                font-size: 16px;
                                font-weight: bold;
                            ">
                                Continue
                            </button>
                        </div>
                    `;
                } else {
                    // Wrong answer
                    riddleContent.innerHTML = `
                        <div style="text-align: center;">
                            <h2 style="color: #ff0000; text-shadow: 0 0 10px rgba(255, 0, 0, 0.8); margin-bottom: 20px;">
                                ❌ Incorrect! ❌
                            </h2>
                            <p style="color: #ffffff; font-size: 16px; margin-bottom: 20px;">
                                "Foolish mortal! Your ignorance has cost you dearly. The ancient knowledge remains hidden from you!"
                            </p>
                            <button onclick="window.unifiedQuestSystem.completeRiddleMinigame(false)" style="
                                background: linear-gradient(45deg, #ff0000, #cc0000);
                                border: 2px solid #ffffff;
                                color: #ffffff;
                                padding: 15px 30px;
                                border-radius: 8px;
                                cursor: pointer;
                                font-family: 'Courier New', monospace;
                                font-size: 16px;
                                font-weight: bold;
                            ">
                                Continue
                            </button>
                        </div>
                    `;
                }
            });
            
            // Add hover effects
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'scale(1.05)';
                button.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.5)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'scale(1)';
                button.style.boxShadow = 'none';
            });
        });
        
        // Store reference for cleanup
        this.currentDialog = riddleOverlay;
    }
    
    // Complete riddle minigame
    completeRiddleMinigame(success) {
        console.log('🎭 Riddle minigame completed:', success ? 'Success' : 'Failure');
        
        // Close riddle dialog
        this.closeQuestDialog();
        
        let effect = null;
        let feedbackText = '';
        
        if (success) {
            effect = { type: 'sanity', amount: 20 };
            this.applyQuestEffect(effect);
            effect = { type: 'experience', amount: 25 };
            this.applyQuestEffect(effect);
            feedbackText = "The sage is impressed by your wisdom! He teaches you the ancient purification rites, and you feel your mind expanding with cosmic knowledge. You are now ready to face the troll with confidence!";
        } else {
            effect = { type: 'sanity', amount: -15 };
            this.applyQuestEffect(effect);
            feedbackText = "The sage shakes his head in disappointment. 'You are not ready for the ancient knowledge,' he says. 'Perhaps you will learn wisdom through other means.' You feel your confidence shaken.";
        }
        
        // Complete the objective
        this.completeObjective('corroding_lake', 'meet_lunatic_sage');
        
        // Progress to next objective
        const quest = this.availableQuests.get('corroding_lake');
        if (quest) {
            this.progressQuestMarkers(quest, quest.objectives.find(obj => obj.id === 'meet_lunatic_sage'));
        }
        
        // Show feedback
        this.showQuestFeedback(quest, 'riddle', effect, feedbackText);
    }
    
    // Start Aurora movement
    startAuroraMovement() {
        if (this.aurora.movementInterval) {
            clearInterval(this.aurora.movementInterval);
        }
        
        this.aurora.movementInterval = setInterval(() => {
            this.moveAurora();
        }, 5000); // Move every 5 seconds
        
        console.log('👑 Aurora movement started');
    }
    
    // Move Aurora randomly
    moveAurora() {
        if (!this.aurora || !window.mapEngine || !window.mapEngine.map) {
            return;
        }
        
        // Random direction
        const angle = Math.random() * 2 * Math.PI;
        const distance = this.aurora.movementSpeed;
        
        // Calculate new position
        const newLat = this.aurora.lat + Math.cos(angle) * distance;
        const newLng = this.aurora.lng + Math.sin(angle) * distance;
        
        // Update Aurora position
        this.aurora.lat = newLat;
        this.aurora.lng = newLng;
        
        // Update marker position
        const auroraMarker = this.questMarkers.get('aurora');
        if (auroraMarker) {
            auroraMarker.setLatLng([newLat, newLng]);
        }
        
        console.log(`👑 Aurora moved to: ${newLat.toFixed(6)}, ${newLng.toFixed(6)}`);
    }
    
    // Show notification for new quest marker
    showNewMarkerNotification(objective, iconData) {
        if (window.eldritchApp && window.eldritchApp.showNotification) {
            const message = `🎯 New Quest Objective: ${iconData.name}`;
            window.eldritchApp.showNotification(message, 'info');
        }
        
        // Also show a more detailed notification
        setTimeout(() => {
            if (window.eldritchApp && window.eldritchApp.showNotification) {
                const description = objective.description || 'A new quest objective has appeared on the map!';
                window.eldritchApp.showNotification(`📍 ${description}`, 'quest');
            }
        }, 2000);
        
        // Animate map to focus on the new marker
        if (window.mapEngine && window.mapEngine.map && objective.location) {
            setTimeout(() => {
                window.mapEngine.map.setView([objective.location.lat, objective.location.lng], 18, {
                    animate: true,
                    duration: 1.5
                });
            }, 500);
        }
    }

    // Apply quest effects to player stats
    applyQuestEffect(effect) {
        if (window.eldritchApp && window.eldritchApp.systems.encounter) {
            const encounter = window.eldritchApp.systems.encounter;
            
            switch (effect.type) {
                case 'sanity':
                    if (effect.amount > 0) {
                        encounter.gainSanity(effect.amount, `Quest reward`);
                    } else {
                        encounter.loseSanity(Math.abs(effect.amount), `Quest consequence`);
                    }
                    console.log(`🎭 Sanity ${effect.amount > 0 ? 'gained' : 'lost'}: ${Math.abs(effect.amount)}`);
                    break;
                    
                case 'health':
                    if (effect.amount > 0) {
                        encounter.gainHealth(effect.amount, `Quest reward`);
                    } else {
                        encounter.loseHealth(Math.abs(effect.amount), `Quest consequence`);
                    }
                    console.log(`🎭 Health ${effect.amount > 0 ? 'gained' : 'lost'}: ${Math.abs(effect.amount)}`);
                    break;
                    
                case 'experience':
                    encounter.playerStats.experience += effect.amount;
                    console.log(`🎭 Experience gained: ${effect.amount}`);
                    break;
            }
            
            // Update UI - use the encounter system's updateStatsDisplay method
            if (encounter.updateStatsDisplay) {
                encounter.updateStatsDisplay();
            } else {
                console.log('🎭 Stats updated, but updateStatsDisplay method not available');
            }
        }
    }
    
    // Progress quest markers - hide current and show next
    progressQuestMarkers(quest, completedObjective) {
        console.log('🎭 Progressing quest markers for:', quest.name, 'objective:', completedObjective.id);
        console.log('🎭 Quest objectives:', quest.objectives.map(obj => ({ id: obj.id, status: obj.status })));
        console.log('🎭 Active quests:', Array.from(this.activeQuests.keys()));
        console.log('🎭 Quest in activeQuests:', this.activeQuests.has(quest.id));
        
        // Hide the current quest marker
        this.hideCurrentQuestMarker(quest, completedObjective);
        
        // Special progression for Corroding Lake quest
        if (quest.id === 'corroding_lake') {
            this.progressCorrodingLakeMarkers(completedObjective);
        } else {
            // Show the next quest marker if there's another objective
            this.showNextQuestMarker(quest);
        }
    }
    
    // Special progression for Corroding Lake quest
    progressCorrodingLakeMarkers(completedObjective) {
        console.log('🎭 Progressing Corroding Lake markers for objective:', completedObjective.id);
        console.log('🎭 Available quests:', Array.from(this.availableQuests.keys()));
        console.log('🎭 Active quests:', Array.from(this.activeQuests.keys()));
        
        const quest = this.availableQuests.get('corroding_lake') || this.activeQuests.get('corroding_lake');
        if (!quest) {
            console.log('🎭 Corroding Lake quest not found in available or active quests');
            return;
        }
        
        console.log('🎭 Found Corroding Lake quest:', quest.name, 'status:', quest.status);
        
        switch (completedObjective.id) {
            case 'escape_corroding_lake':
                // After Corroding Lake, show Ancient Grove (2) and Sage's Hill (3)
                console.log('🎭 Revealing markers 2 & 3 after Corroding Lake');
                const ancientStaffObj = quest.objectives.find(obj => obj.id === 'find_ancient_staff');
                const sageObj = quest.objectives.find(obj => obj.id === 'meet_lunatic_sage');
                
                if (ancientStaffObj) {
                    console.log('🎭 Creating Ancient Staff marker at:', ancientStaffObj.location);
                    const markerKey1 = `${quest.id}_${ancientStaffObj.id}`;
                    const marker1 = this.createQuestObjectiveMarker(ancientStaffObj, ancientStaffObj.location);
                    if (marker1) {
                        this.questMarkers.set(markerKey1, marker1);
                        console.log('🎭 Ancient Staff marker created and stored:', markerKey1);
                        this.showNewMarkerNotification(ancientStaffObj, { symbol: '🌿', color: '#8b4513', name: 'Ancient Staff' });
                    } else {
                        console.log('🎭 Failed to create Ancient Staff marker');
                    }
                } else {
                    console.log('🎭 Ancient Staff objective not found');
                }
                
                if (sageObj) {
                    console.log('🎭 Creating Sage marker at:', sageObj.location);
                    const markerKey2 = `${quest.id}_${sageObj.id}`;
                    const marker2 = this.createQuestObjectiveMarker(sageObj, sageObj.location);
                    if (marker2) {
                        this.questMarkers.set(markerKey2, marker2);
                        console.log('🎭 Sage marker created and stored:', markerKey2);
                        this.showNewMarkerNotification(sageObj, { symbol: '🧙', color: '#ffd700', name: 'Lunatic Sage' });
                    } else {
                        console.log('🎭 Failed to create Sage marker');
                    }
                } else {
                    console.log('🎭 Sage objective not found');
                }
                break;
                
            case 'meet_lunatic_sage':
                // After Sage's Hill, show Troll Bridge (4)
                console.log('🎭 Revealing marker 4 after Sage\'s Hill');
                const trollObj = quest.objectives.find(obj => obj.id === 'face_troll_bridge');
                if (trollObj) {
                    const markerKey = `${quest.id}_${trollObj.id}`;
                    const marker = this.createQuestObjectiveMarker(trollObj, trollObj.location);
                    if (marker) {
                        this.questMarkers.set(markerKey, marker);
                        this.showNewMarkerNotification(trollObj, { symbol: '👹', color: '#8b0000', name: 'Troll Bridge' });
                    }
                }
                break;
                
            case 'face_troll_bridge':
                // After Troll Bridge, show Cthulhu's Depths (5)
                console.log('🎭 Revealing marker 5 after Troll Bridge');
                const cthulhuObj = quest.objectives.find(obj => obj.id === 'release_cthulhu');
                if (cthulhuObj) {
                    const markerKey = `${quest.id}_${cthulhuObj.id}`;
                    const marker = this.createQuestObjectiveMarker(cthulhuObj, cthulhuObj.location);
                    if (marker) {
                        this.questMarkers.set(markerKey, marker);
                        this.showNewMarkerNotification(cthulhuObj, { symbol: '🐙', color: '#4b0082', name: 'Cthulhu\'s Depths' });
                    }
                }
                break;
        }
    }
    
    // Hide the current quest marker
    hideCurrentQuestMarker(quest, completedObjective) {
        // Hide Aurora marker if this was the first objective (find_cosmic_entity)
        if (completedObjective.id === 'find_cosmic_entity') {
            const auroraMarker = this.questMarkers.get('aurora');
            if (auroraMarker) {
                console.log('🎭 Hiding Aurora marker - first objective completed');
                auroraMarker.remove();
                this.questMarkers.delete('aurora');
            }
        }
        
        // Hide any other quest markers related to this objective
        const markerKey = `${quest.id}_${completedObjective.id}`;
        const marker = this.questMarkers.get(markerKey);
        if (marker) {
            console.log('🎭 Hiding quest marker:', markerKey);
            marker.remove();
            this.questMarkers.delete(markerKey);
        }
    }
    
    // Show the next quest marker
    showNextQuestMarker(quest) {
        console.log('🎭 showNextQuestMarker called for quest:', quest.name);
        console.log('🎭 Quest objectives status:', quest.objectives.map(obj => ({ id: obj.id, status: obj.status })));
        
        // Find the next incomplete objective
        const nextObjective = quest.objectives.find(obj => obj.status === 'incomplete');
        if (!nextObjective) {
            console.log('🎭 No more objectives for quest:', quest.name);
            return;
        }
        
        console.log('🎭 Found next objective:', nextObjective.id, 'status:', nextObjective.status);
        console.log('🎭 Creating marker for next objective:', nextObjective.id);
        
        // Create marker for the next objective
        this.createObjectiveMarker(quest, nextObjective);
    }
    
    // Create a marker for a specific quest objective
    createObjectiveMarker(quest, objective) {
        if (!window.mapEngine || !window.mapEngine.map) {
            console.log('🎭 Cannot create objective marker - map engine not ready');
            return;
        }
        
        // Calculate position for the next objective (100m away from player)
        const playerPos = this.getPlayerPosition();
        if (!playerPos) {
            console.log('🎭 Cannot create objective marker - no player position, using fallback position');
            // Use a fallback position if no player position is available
            playerPos = { lat: 61.4736747, lng: 23.7279444 };
        }
        
        // Position the next marker 100m in a different direction
        const nextMarkerPos = this.calculateNextMarkerPosition(playerPos, objective.id);
        
        // Create the marker
        const markerKey = `${quest.id}_${objective.id}`;
        const marker = this.createQuestObjectiveMarker(objective, nextMarkerPos);
        
        if (marker) {
            this.questMarkers.set(markerKey, marker);
            console.log('🎭 Created objective marker:', markerKey, 'at:', nextMarkerPos);
            
            // Show notification for new quest marker
            const objectiveIcons = {
                'escape_corroding_lake': { symbol: '🌊', color: '#00bfff', name: 'Corroding Lake' },
                'find_ancient_staff': { symbol: '🌿', color: '#8b4513', name: 'Ancient Staff' },
                'meet_lunatic_sage': { symbol: '🧙', color: '#ffd700', name: 'Lunatic Sage' },
                'face_troll_bridge': { symbol: '👹', color: '#8b0000', name: 'Troll Bridge' },
                'release_cthulhu': { symbol: '🐙', color: '#4b0082', name: 'Cthulhu\'s Depths' }
            };
            const iconData = objectiveIcons[objective.id] || { symbol: '❓', color: '#95a5a6', name: 'Quest Objective' };
            this.showNewMarkerNotification(objective, iconData);
        }
    }
    
    // Calculate position for the next quest marker
    calculateNextMarkerPosition(playerPos, objectiveId) {
        // Different objectives get different positions
        const directions = {
            'accept_sanity_test': { lat: 0.0009, lng: 0.0012 }, // Northeast
            'survive_insanity': { lat: -0.0009, lng: 0.0012 },  // Southeast
            'talk_to_npcs': { lat: 0.0009, lng: -0.0012 }       // Northwest
        };
        
        const direction = directions[objectiveId] || { lat: 0.0009, lng: 0.0012 };
        
        return {
            lat: playerPos.lat + direction.lat,
            lng: playerPos.lng + direction.lng
        };
    }
    
    // Create a quest objective marker
    createQuestObjectiveMarker(objective, position) {
        const objectiveIcons = {
            'escape_corroding_lake': { symbol: '🌊', color: '#00bfff', name: 'Corroding Lake' },
            'find_ancient_staff': { symbol: '🌿', color: '#8b4513', name: 'Ancient Staff' },
            'meet_lunatic_sage': { symbol: '🧙', color: '#ffd700', name: 'Lunatic Sage' },
            'face_troll_bridge': { symbol: '👹', color: '#8b0000', name: 'Troll Bridge' },
            'release_cthulhu': { symbol: '🐙', color: '#4b0082', name: 'Cthulhu\'s Depths' },
            'accept_sanity_test': { symbol: '🧠', color: '#ff6b6b', name: 'Sanity Test' },
            'survive_insanity': { symbol: '🌀', color: '#4ecdc4', name: 'Survival Challenge' },
            'talk_to_npcs': { symbol: '👥', color: '#45b7d1', name: 'Community Meeting' }
        };
        
        const iconData = objectiveIcons[objective.id] || { symbol: '❓', color: '#95a5a6', name: 'Quest Objective' };
        
        const objectiveIcon = L.divIcon({
            className: 'quest-objective-marker new-marker',
            html: `
                <div style="position: relative; width: 40px; height: 40px;">
                    <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, ${iconData.color}33 0%, transparent 70%); border-radius: 50%; animation: questObjectivePulse 2s infinite;"></div>
                    <div style="position: absolute; top: 0; left: 0; width: 40px; height: 40px; background: ${iconData.color}; border: 2px solid #ffffff; border-radius: 50%; opacity: 0.9; box-shadow: 0 0 15px ${iconData.color};"></div>
                    <div style="position: absolute; top: 8px; left: 8px; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 16px; color: #ffffff; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">${iconData.symbol}</div>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        const marker = L.marker([position.lat, position.lng], { icon: objectiveIcon }).addTo(window.mapEngine.map);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            if (marker._icon) {
                marker._icon.classList.remove('new-marker');
            }
        }, 3000); // Remove after 3 seconds
        
        // Add click event to trigger interaction
        marker.on('click', () => {
            console.log('🎭 Quest objective marker clicked:', objective.id);
            this.interactWithObjective(objective.id);
        });
        
        marker.bindPopup(`
            <div style="text-align: center;">
                <h4>${iconData.symbol} ${iconData.name}</h4>
                <p style="color: #ffffff; font-size: 0.9em;">${objective.description}</p>
                <div style="margin: 10px 0; padding: 8px; background: rgba(255, 255, 255, 0.1); border-radius: 6px; border: 1px solid ${iconData.color};">
                    <strong>Status:</strong> ${objective.status}<br>
                    <strong>Distance:</strong> <span id="objective-distance-${objective.id}">Calculating...</span>
                </div>
                <button onclick="window.unifiedQuestSystem.interactWithObjective('${objective.id}')" 
                        style="background: ${iconData.color}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 8px;">
                    ${iconData.symbol} Interact
                </button>
            </div>
        `);
        
        console.log('🎭 Quest objective marker created and added to map:', objective.id, 'at', position);
        
        return marker;
    }
    
    // Interact with a quest objective
    interactWithObjective(objectiveId) {
        console.log('🎭 Interacting with objective:', objectiveId);
        
        // Find the active quest with this objective
        for (const [questId, quest] of this.activeQuests) {
            const objective = quest.objectives.find(obj => obj.id === objectiveId);
            if (objective && objective.status === 'incomplete') {
                // Show the quest dialog for this objective
                this.showQuestDialog(quest, objective);
                break;
            }
        }
    }
    
    // Close quest dialog
    closeQuestDialog() {
        if (this.currentDialog) {
            console.log('🎭 Closing quest dialog');
            this.currentDialog.remove();
            this.currentDialog = null;
        }
        
        // Also close any riddle minigame that might be open
        this.closeRiddleMinigame();
    }
    
    // Close riddle minigame
    closeRiddleMinigame() {
        const riddleOverlay = document.querySelector('.riddle-minigame-overlay');
        if (riddleOverlay) {
            riddleOverlay.remove();
        }
    }
    
    // Show quest feedback dialog
    showQuestFeedback(quest, outcome, effect, feedbackText) {
        console.log('🎭 Showing quest feedback for:', quest.name, outcome);
        
        // Create feedback dialog overlay
        const feedbackOverlay = document.createElement('div');
        feedbackOverlay.className = 'quest-feedback-overlay';
        feedbackOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Courier New', monospace;
        `;
        
        // Create feedback content
        const feedbackContent = document.createElement('div');
        feedbackContent.className = 'quest-feedback-content';
        feedbackContent.style.cssText = `
            background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
            border: 2px solid #00ffff;
            border-radius: 15px;
            padding: 30px;
            max-width: 500px;
            width: 90%;
            color: #ffffff;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.5);
            position: relative;
            overflow: hidden;
            text-align: center;
        `;
        
        // Add cosmic background effect
        const cosmicBg = document.createElement('div');
        cosmicBg.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 20% 80%, rgba(138, 43, 226, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.3) 0%, transparent 50%),
                        radial-gradient(circle at 40% 40%, rgba(0, 255, 255, 0.2) 0%, transparent 50%);
            pointer-events: none;
        `;
        feedbackContent.appendChild(cosmicBg);
        
        // Generate effect display
        let effectDisplay = '';
        if (effect) {
            const effectIcon = effect.type === 'sanity' ? '🧠' : effect.type === 'health' ? '❤️' : '⭐';
            const effectColor = effect.amount > 0 ? '#00ff00' : '#ff6b6b';
            const effectSign = effect.amount > 0 ? '+' : '';
            effectDisplay = `
                <div style="margin: 20px 0; padding: 15px; background: rgba(0, 0, 0, 0.5); border-radius: 10px; border-left: 4px solid ${effectColor};">
                    <div style="color: ${effectColor}; font-size: 18px; font-weight: bold;">
                        ${effectIcon} ${effectSign}${effect.amount} ${effect.type.toUpperCase()}
                    </div>
                </div>
            `;
        }
        
        // Feedback content
        const feedbackHTML = `
            <div style="position: relative; z-index: 1;">
                <div style="margin-bottom: 20px;">
                    <h2 style="color: #00ffff; text-shadow: 0 0 10px rgba(0, 255, 255, 0.8); margin: 0 0 10px 0; font-size: 24px;">
                        ${this.getOutcomeTitle(outcome)}
                    </h2>
                </div>
                
                <div style="background: rgba(0, 0, 0, 0.5); padding: 20px; border-radius: 10px; margin-bottom: 25px; border-left: 4px solid #00ffff;">
                    <p style="margin: 0; line-height: 1.6; font-size: 16px; font-style: italic;">
                        ${feedbackText}
                    </p>
                </div>
                
                ${effectDisplay}
                
                <button class="quest-feedback-close" style="
                    background: linear-gradient(45deg, #00ffff, #0099cc);
                    border: 2px solid #ffffff;
                    color: #000000;
                    padding: 12px 24px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-family: 'Courier New', monospace;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                ">
                    Continue Your Journey
                </button>
            </div>
        `;
        
        feedbackContent.innerHTML = feedbackHTML;
        feedbackOverlay.appendChild(feedbackContent);
        document.body.appendChild(feedbackOverlay);
        
        // Add close button handler
        const closeBtn = feedbackContent.querySelector('.quest-feedback-close');
        closeBtn.addEventListener('click', () => {
            feedbackOverlay.remove();
        });
        
        // Add hover effects
        closeBtn.addEventListener('mouseenter', () => {
            closeBtn.style.transform = 'scale(1.05)';
            closeBtn.style.boxShadow = '0 0 20px rgba(0, 255, 255, 0.5)';
        });
        
        closeBtn.addEventListener('mouseleave', () => {
            closeBtn.style.transform = 'scale(1)';
            closeBtn.style.boxShadow = 'none';
        });
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (document.body.contains(feedbackOverlay)) {
                feedbackOverlay.remove();
            }
        }, 10000);
    }
    
    // Get outcome title based on choice
    getOutcomeTitle(outcome) {
        switch (outcome) {
            case 'random':
                return '🎲 Cosmic Chaos';
            case 'sanity':
                return '🧠 Forbidden Knowledge';
            case 'health':
                return '⚔️ Cosmic Confrontation';
            case 'accept':
                return '✅ Quest Accepted';
            default:
                return '🌌 Cosmic Response';
        }
    }
    
    // Comprehensive distance logging for all game objects
    logAllDistances() {
        // Check if quest system is paused
        if (this.isPaused) {
            console.log('🎯 Distance Log: Quest system is paused, skipping distance logging');
            return;
        }
        
        const playerPosition = this.getPlayerPosition();
        if (!playerPosition) {
            console.log('🎯 Distance Log: No player position available');
            return;
        }
        
        console.log('🎯 === DISTANCE LOG (Every 5 seconds) ===');
        console.log('🎯 Player Position:', playerPosition);
        
        // Quest markers
        if (window.eldritchApp && window.eldritchApp.systems.investigation && window.eldritchApp.systems.investigation.mysteryZones) {
            window.eldritchApp.systems.investigation.mysteryZones.forEach((zone, index) => {
                const distance = this.calculateDistance(playerPosition.lat, playerPosition.lng, zone.lat, zone.lng);
                console.log(`🎯 Quest Marker ${index + 1} (${zone.name}): ${distance.toFixed(2)}m at (${zone.lat}, ${zone.lng})`);
            });
        }
        
        // NPCs
        if (window.eldritchApp && window.eldritchApp.systems.npc && window.eldritchApp.systems.npc.npcs) {
            window.eldritchApp.systems.npc.npcs.forEach((npc, index) => {
                const distance = this.calculateDistance(playerPosition.lat, playerPosition.lng, npc.lat, npc.lng);
                console.log(`🎯 NPC ${index + 1} (${npc.name}): ${distance.toFixed(2)}m at (${npc.lat}, ${npc.lng})`);
            });
        }
        
        // Aurora
        const auroraDistance = this.calculateDistance(playerPosition.lat, playerPosition.lng, this.aurora.lat, this.aurora.lng);
        console.log(`🎯 Aurora: ${auroraDistance.toFixed(2)}m at (${this.aurora.lat}, ${this.aurora.lng})`);
        
        // Player bases
        if (window.eldritchApp && window.eldritchApp.systems.baseSystem && window.eldritchApp.systems.baseSystem.playerBase) {
            const base = window.eldritchApp.systems.baseSystem.playerBase;
            const baseDistance = this.calculateDistance(playerPosition.lat, playerPosition.lng, base.lat, base.lng);
            console.log(`🎯 Player Base: ${baseDistance.toFixed(2)}m at (${base.lat}, ${base.lng})`);
        }
        
        // Flag layer pins
        if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.finnishFlagLayer) {
            const flagLayer = window.eldritchApp.systems.mapEngine.finnishFlagLayer;
            if (flagLayer.flagPins && flagLayer.flagPins.length > 0) {
                console.log(`🎯 Flag Pins: ${flagLayer.flagPins.length} total`);
                flagLayer.flagPins.forEach((pin, index) => {
                    const distance = this.calculateDistance(playerPosition.lat, playerPosition.lng, pin.lat, pin.lng);
                    console.log(`🎯 Flag Pin ${index + 1}: ${distance.toFixed(2)}m at (${pin.lat}, ${pin.lng})`);
                });
            }
        }
        
        console.log('🎯 === END DISTANCE LOG ===');
    }
}

// Export for use in other modules
window.UnifiedQuestSystem = UnifiedQuestSystem;
