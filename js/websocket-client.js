/**
 * @fileoverview [VERIFIED] WebSocket Client - Real-time multiplayer communication
 * @status VERIFIED - WebSocket communication, persistence, and marker restoration working correctly
 * @feature #feature-websocket-communication
 * @feature #feature-persistence-system
 * @bugfix #bug-persistence-timing
 * @last_verified 2024-01-28
 * @dependencies Server WebSocket, Player ID management, Map Layer
 * @warning Do not modify connection logic, message handling, or persistence restoration without testing complete flow
 * 
 * WebSocket Client - Real-time multiplayer communication
 * Handles connection to server, position sharing, and investigation updates
 */

class WebSocketClient {
    constructor() {
        this.socket = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // Start with 1 second
        this.playerId = this.loadOrGeneratePlayerId();
        this.otherPlayers = new Map();
        this.onConnectionChange = null;
        this.onPlayerUpdate = null;
        this.onInvestigationUpdate = null;
        this.markerQueue = []; // Queue for markers created before connection
    }

    init() {
        this.setupUI();
        this.connect();
        console.log(' WebSocket client initialized');
    }

    setupUI() {
        // Connection status will be updated by updateConnectionStatus()
    }

    loadOrGeneratePlayerId() {
        // Consciousness-serving: Delegate to single method for consistency
        return this.getCurrentPlayerId();
    }

    /**
     * Generate a unique player ID with consciousness-serving beauty
     * @returns {string} Unique player identifier
     */
    generatePlayerId() {
        const timestamp = Date.now();
        const randomSuffix = Math.random().toString(36).substr(2, 9);
        const playerId = `player_${timestamp}_${randomSuffix}`;
        
        // Validate generated ID
        if (!playerId || playerId.length < 10) {
            console.error('❌ Failed to generate valid player ID');
            return `player_${Date.now()}_fallback`;
        }
        
        return playerId;
    }

    /**
     * Generate a new player ID and save it to localStorage
     * This should be called when starting a fresh adventure
     */
    generateNewPlayerId() {
        // Clear existing player ID first
        localStorage.removeItem('eldritch_player_id');
        
        // Generate and save new player ID
        const newPlayerId = this.getCurrentPlayerId();
        this.playerId = newPlayerId;
        console.log('🎮 Generated new player ID for fresh adventure:', newPlayerId);
        return newPlayerId;
    }

    /**
     * Check if player has an active player ID
     */
    hasActivePlayerId() {
        // Check multiple possible player ID keys
        const playerId = localStorage.getItem('playerId') || 
                        localStorage.getItem('eldritch_player_id') ||
                        localStorage.getItem('eldritch-player-id') ||
                        localStorage.getItem('player_id');
        return !!playerId;
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = window.location.port || (protocol === 'wss:' ? '443' : '80');
        const wsUrl = `${protocol}//${host}:${port}/ws`;
        console.log(' WebSocketClient connecting to:', wsUrl);

        try {
            this.socket = new WebSocket(wsUrl);
            this.setupEventListeners();
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            this.handleConnectionError();
        }
    }

    setupEventListeners() {
        if (!this.socket) return;

        this.socket.onopen = () => {
            console.log(' WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.updateConnectionStatus('connected');
            
            // Log connection to debug logger
            if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                window.debugLogger.log('🌐 WebSocket connected to server', 'websocket');
            }
            
            // Process queued markers
            this.processMarkerQueue();
            
            // Always send player join to ensure server knows about this player
            this.sendPlayerJoin();
            
            // Request game state for continue adventure
            this.requestGameStateForContinue();
            
            // Hand off to MultiplayerManager if present to avoid duplicate UI/state
            if (window.multiplayerManager) {
                // MultiplayerManager will handle additional player management
                console.log('🎮 MultiplayerManager present, delegating player management');
            }
            
            if (this.onConnectionChange) {
                this.onConnectionChange(true);
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                // Log all incoming messages to debug logger
                if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                    window.debugLogger.log(`📨 Received from server: ${message.type}`, 'websocket');
                }
                
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.socket.onclose = (event) => {
            console.log(' WebSocket disconnected:', event.code, event.reason);
            this.isConnected = false;
            this.updateConnectionStatus('disconnected');
            
            if (this.onConnectionChange) {
                this.onConnectionChange(false);
            }

            // Attempt to reconnect if not a clean close
            if (event.code !== 1000) {
                this.attemptReconnect();
            }
        };

        this.socket.onerror = (error) => {
            console.error(' WebSocket error:', error);
            this.handleConnectionError();
        };
    }

    handleMessage(message) {
        // If the authoritative MultiplayerManager exists, delegate and avoid duplicate UI/state
        try {
            if (window.multiplayerManager && typeof window.multiplayerManager.handleMessage === 'function') {
                window.multiplayerManager.handleMessage(message);
                return;
            }
        } catch (_) {}
        switch (message.type) {
            case 'players_snapshot': {
                try {
                    const arr = Array.isArray(message.payload) ? message.payload : [];
                    arr.forEach(p => this.handlePlayerJoin({ playerId: p.playerId, name: p.playerData?.profile?.name || 'Explorer', position: p.playerData?.position }));
                    // Do not self-adjust count here; authoritative count handled elsewhere
                } catch (_) {}
                break;
            }
            case 'playerCount':
                this.updatePlayerCount(message.payload.count);
                break;
                
            case 'initial_steps':
                this.handleInitialSteps(message.payload);
                break;
                
            case 'steps_synced':
                this.handleStepsSynced(message.payload);
                break;
                
            case 'playerJoin':
                this.handlePlayerJoin(message.payload);
                break;

            case 'player_join': {
                // Alternate schema used by server broadcast
                const playerId = message.playerId || message.payload?.playerId;
                const playerData = message.playerData || message.payload?.playerData || {};
                this.handlePlayerJoin({ playerId, name: playerData?.profile?.name || 'Explorer', position: playerData?.position });
                // Subtle notification
                try {
                    if (window.gruesomeNotifications) {
                        const name = playerData?.profile?.name || 'Explorer';
                        window.gruesomeNotifications.showNotification(`${name} connected`, 'info');
                    }
                } catch (_) {}
                break;
            }
                
            case 'playerLeave':
                this.handlePlayerLeave(message.payload.playerId);
                break;
                
            case 'positionUpdate':
                this.handlePositionUpdate(message.payload);
                break;
                
            case 'flag_update': {
                try {
                    const d = message.flagData || {};
                    if (window.mapEngine && window.mapEngine.finnishFlagLayer && d.lat && d.lng) {
                        window.mapEngine.finnishFlagLayer.addFlagPin(d.lat, d.lng, d.size, d.rotation, d.symbol, d.ownerId, true, d.timestamp);
                    }
                } catch (_) {}
                break;
            }

            case 'request_flags': {
                try {
                    // Re-broadcast our flags to requester
                    if (window.mapEngine && window.mapEngine.finnishFlagLayer) {
                        const pins = window.mapEngine.finnishFlagLayer.flagPins || [];
                        pins.forEach(pin => this.send({
                            type: 'flag_update',
                            flagId: `${pin.lat.toFixed(6)}_${pin.lng.toFixed(6)}_${pin.timestamp}`,
                            flagData: {
                                lat: pin.lat,
                                lng: pin.lng,
                                size: pin.size,
                                rotation: pin.rotation,
                                symbol: pin.symbol,
                                ownerId: pin.ownerId || this.playerId,
                                timestamp: pin.timestamp
                            }
                        }));
                    }
                } catch (_) {}
                break;
            }

            // Game State Synchronization Messages
            case 'game_state_sync': {
                this.handleGameStateSync(message.payload);
                break;
            }
            
            case 'marker_created': {
                this.handleMarkerCreated(message.payload);
                break;
            }
            
            case 'marker_updated': {
                this.handleMarkerUpdated(message.payload);
                break;
            }
            
            case 'marker_deleted': {
                this.handleMarkerDeleted(message.payload);
                break;
            }
            
            case 'marker_added': {
                this.handleMarkerAdded(message.payload);
                break;
            }
            
            case 'base_established': {
                this.handleBaseEstablished(message.payload);
                break;
            }
            
            case 'marker_create_error':
            case 'marker_update_error':
            case 'marker_delete_error':
            case 'base_establish_error': {
                console.error('❌ Server error:', message.type, message.payload);
                break;
            }

            case 'investigationStart':
                this.handleInvestigationStart(message.payload);
                break;
                
            case 'investigationComplete':
                this.handleInvestigationComplete(message.payload);
                break;
                
            case 'zoneEntry':
                this.handleZoneEntry(message.payload);
                break;
                
            case 'base_establishment_available':
                this.handleBaseEstablishmentAvailable(message.payload);
                break;
                
            case 'quest_system_unlocked':
                this.handleQuestSystemUnlocked(message.payload);
                break;
                
            case 'flag_creation_enabled':
                this.handleFlagCreationEnabled(message.payload);
                break;
                
            case 'celebration_triggered':
                this.handleCelebrationTriggered(message.payload);
                break;
                
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handleInitialSteps(payload) {
        console.log('🚶‍♂️ WebSocket received initial steps:', payload);
        
        // Forward to step currency system
        if (window.stepCurrencySystem && window.stepCurrencySystem.handleInitialStepsFromServer) {
            window.stepCurrencySystem.handleInitialStepsFromServer(payload);
        } else {
            console.warn('🚶‍♂️ Step currency system not available to handle initial steps');
        }
    }

    handleStepsSynced(payload) {
        console.log('🚶‍♂️ WebSocket received steps sync acknowledgment:', payload);
        
        // Forward to step currency system
        if (window.stepCurrencySystem && window.stepCurrencySystem.handleStepsSyncedFromServer) {
            window.stepCurrencySystem.handleStepsSyncedFromServer(payload);
        } else {
            console.warn('🚶‍♂️ Step currency system not available to handle steps sync');
        }
    }

    handlePlayerJoin(payload) {
        if (!payload || payload.playerId === this.playerId) {
            return;
        }
        try {
            if (window.gruesomeNotifications) {
                const name = payload.name || 'Explorer';
                window.gruesomeNotifications.showNotification(`${name} connected`, 'info');
            }
        } catch (_) {}

        if (payload.playerId !== this.playerId) {
            this.otherPlayers.set(payload.playerId, {
                id: payload.playerId,
                name: payload.name || 'Anonymous Explorer',
                position: payload.position,
                investigation: null,
                lastSeen: Date.now()
            });
            try { if (window.notificationCenter) window.notificationCenter.notifyPlayerJoined(payload.name); } catch (_) {}
            
            console.log(`👤 Player joined: ${payload.name || payload.playerId}`);

            // Consciousness-Serving: Create player marker for community connection
            if (payload.position && payload.position.lat && payload.position.lng) {
                this.createOtherPlayerMarker(payload, payload.playerId);
            }

            // UI/list rendering handled by MultiplayerManager; do not mutate DOM here
        }
    }

    handlePlayerLeave(payload) {
        this.otherPlayers.delete(payload.playerId);
        
        // Consciousness-Serving: Remove player marker for community connection
        this.removeOtherPlayerMarker(payload.playerId);
        console.log(`ðŸ‘¤ Player left: ${payload.playerId}`);
    }

    handlePositionUpdate(payload) {
        if (payload.playerId !== this.playerId) {
            const player = this.otherPlayers.get(payload.playerId);
            if (player) {
                player.position = payload.position;
                player.lastSeen = Date.now();
                
                // Consciousness-Serving: Update player marker position for community connection
                this.updateOtherPlayerMarker(payload.playerId, payload.position);
                
                if (this.onPlayerUpdate) {
                    this.onPlayerUpdate(player);
                }
            }
        }
    }

    handleInvestigationStart(payload) {
        if (payload.playerId !== this.playerId) {
            const player = this.otherPlayers.get(payload.playerId);
            if (player) {
                player.investigation = payload.investigation;
                console.log(`ðŸ” Player started investigation: ${payload.investigation.name}`);
            }
        }
    }

    handleInvestigationComplete(payload) {
        if (payload.playerId !== this.playerId) {
            const player = this.otherPlayers.get(payload.playerId);
            if (player) {
                player.investigation = null;
                console.log(`‰ Player completed investigation: ${payload.investigation.name}`);
            }
        }
    }

    // Game State Message Handlers
    
    /**
     * Handle complete game state sync from server
     * @param {Object} payload - Game state data
     */
    handleGameStateSync(payload) {
        console.log('🎮 Received complete game state from server:', payload);
        
        const { playerId, gameState } = payload;
        
        if (gameState) {
            // Update step currency system with server state
            if (window.stepCurrencySystem && gameState.totalSteps !== undefined) {
                console.log('🚶‍♂️ Syncing steps from server:', gameState.totalSteps);
                window.stepCurrencySystem.totalSteps = gameState.totalSteps;
                window.stepCurrencySystem.sessionSteps = gameState.sessionSteps || 0;
                window.stepCurrencySystem.updateStepCounter();
            }
            
            // Restore markers from server state
            if (gameState.markers && Array.isArray(gameState.markers)) {
                console.log('📍 Restoring markers from server state:', gameState.markers.length);
                this.restoreMarkersFromServer(gameState.markers);
            }
            
            // Restore bases from server state
            if (gameState.bases && Array.isArray(gameState.bases)) {
                console.log('🏗️ Processing base data from server:', gameState.bases.length);
                gameState.bases.forEach(base => {
                    this.restoreBaseMarkerFromServer(base);
                });
            }
            
            // Restore base if established (legacy support)
            if (gameState.baseEstablished && gameState.basePosition) {
                console.log('🏗️ Restoring base from server state (legacy):', gameState.basePosition);
                this.restoreBaseFromServer(gameState.basePosition);
            }
            
            // Restore Aurora data from server
            if (gameState.aurora) {
                console.log('🌸 Processing Aurora data from server:', gameState.aurora);
                this.restoreAuroraFromServer(gameState.aurora);
            }
            
            // Trigger game state loaded event
            if (window.eventBus) {
                window.eventBus.emit('game_state_loaded', {
                    playerId: playerId,
                    gameState: gameState
                });
            }
        }
    }
    
    /**
     * Handle marker created confirmation
     * @param {Object} payload - Marker creation data
     */
    handleMarkerCreated(payload) {
        console.log('✅ Marker created on server:', payload);
        // Marker is already created locally, just confirm
    }
    
    /**
     * Handle marker updated confirmation
     * @param {Object} payload - Marker update data
     */
    handleMarkerUpdated(payload) {
        console.log('✅ Marker updated on server:', payload);
        // Marker is already updated locally, just confirm
    }
    
    /**
     * Handle marker deleted confirmation
     * @param {Object} payload - Marker deletion data
     */
    handleMarkerDeleted(payload) {
        console.log('✅ Marker deleted on server:', payload);
        // Marker is already deleted locally, just confirm
    }
    
    /**
     * Handle marker added from another player
     * @param {Object} payload - Marker data
     */
    handleMarkerAdded(payload) {
        console.log('📍 Marker added by another player:', payload);
        const { playerId, marker } = payload;
        
        // Only add markers from other players
        if (playerId !== this.playerId && marker) {
            this.addMarkerFromOtherPlayer(marker);
        }
    }
    
    /**
     * Handle base established confirmation
     * @param {Object} payload - Base establishment data
     */
    handleBaseEstablished(payload) {
        console.log('🏗️ Base established on server:', payload);
        console.log('🏗️ Payload details:', {
            hasBaseMarker: !!payload.baseMarker,
            hasPosition: !!payload.position,
            hasPlayerId: !!payload.playerId,
            position: payload.position,
            baseMarker: payload.baseMarker,
            playerId: payload.playerId
        });
        
        // Check if this is our own base or another player's base
        const isOwnBase = !payload.playerId || payload.playerId === this.playerId;
        
        if (isOwnBase) {
            console.log('🏗️ This is our own base establishment confirmation');
            // Handle own base establishment (existing logic)
            if (payload.baseMarker && payload.position) {
                console.log('🏗️ Creating base marker from server response...');
                this.createBaseMarkerFromServer(payload.baseMarker, payload.position);
            } else {
                console.warn('⚠️ Base establishment payload missing baseMarker or position data');
                console.warn('⚠️ Payload structure:', JSON.stringify(payload, null, 2));
            }
        } else {
            console.log('🏗️ Another player created a base - showing on our map');
            // Handle other player's base establishment
            if (payload.baseMarker && payload.position) {
                console.log('🏗️ Creating other player base marker...');
                this.createOtherPlayerBaseMarker(payload.baseMarker, payload.position, payload.playerId);
                try { if (window.notificationCenter) window.notificationCenter.notifyPlayerBaseCreated(payload.playerName || payload.playerId); } catch (_) {}
            } else {
                console.warn('⚠️ Other player base establishment payload missing data');
                console.warn('⚠️ Payload structure:', JSON.stringify(payload, null, 2));
            }
        }
    }
    
    /**
     * Create base marker from server response using LIGHTWEIGHT approach (exactly like POI)
     * @param {Object} baseMarker - Base marker data from server
     * @param {Object} position - Position data
     */
    createBaseMarkerFromServer(baseMarker, position) {
        console.log('🏗️ Creating LIGHTWEIGHT base marker from server response:', { baseMarker, position });
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for base marker restoration');
            return;
        }
        
        try {
            // Use EXACTLY the same approach as POI markers
            const baseIcon = L.divIcon({
                className: 'base-marker-lightweight', // Different class name to avoid CSS conflicts
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #8b5cf6; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">${baseMarker.data?.symbol || '🏗️'}</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([position.lat, position.lng], { 
                icon: baseIcon,
                zIndexOffset: 600
            }).addTo(window.mapLayer.map);

            // Add popup (simple like POI)
            const name = baseMarker.data?.name || 'My Cosmic Base';
            const symbol = baseMarker.data?.symbol || '🏗️';
            
            marker.bindPopup(`
                <b>Base Marker</b><br>
                <small>${symbol} ${name}</small><br>
                <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
            `);

            console.log('🏗️ LIGHTWEIGHT base marker restored successfully from server');
            
            // Center map on the base marker for better visibility
            this.centerMapOnBase(position);
            
            return marker;
        } catch (error) {
            console.error('❌ Failed to restore base marker from server:', error);
        }
    }
    
    /**
     * Create other player's base marker from server broadcast
     * @param {Object} baseMarker - Base marker data from server
     * @param {Object} position - Position data
     * @param {String} playerId - Player ID who created the base
     */
    createOtherPlayerBaseMarker(baseMarker, position, playerId) {
        console.log('🏗️ Creating other player base marker:', { baseMarker, position, playerId });
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for other player base marker');
            return;
        }
        
        try {
            // Create a different visual style for other players' bases
            const otherPlayerBaseIcon = L.divIcon({
                className: 'other-player-base-marker',
                html: `
                    <div style="
                        width: 25px; 
                        height: 25px; 
                        background: #10b981; 
                        border: 2px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 14px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                        animation: pulse 2s infinite;
                    ">${baseMarker.data?.symbol || '🏗️'}</div>
                `,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([position.lat, position.lng], { 
                icon: otherPlayerBaseIcon,
                zIndexOffset: 500 // Lower z-index than own base
            }).addTo(window.mapLayer.map);

            // Consciousness-Serving: Get actual player name for authentic community relationships
            const playerName = this.getPlayerName(playerId) || this.generatePlayerName(playerId);
            const baseName = baseMarker.data?.name || `${playerName}'s Base`;
            const symbol = baseMarker.data?.symbol || '🏗️';
            
            marker.bindPopup(`
                <b>${baseName}</b><br>
                <small>${symbol} ${playerName}</small><br>
                <small>Player: ${playerName}</small><br>
                <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
            `);

            console.log('🏗️ Other player base marker created successfully');
            
            // Show notification about new base
            this.showNewBaseNotification(playerId, position);
            
            return marker;
        } catch (error) {
            console.error('❌ Failed to create other player base marker:', error);
        }
    }
    
    /**
     * Consciousness-Serving: Create other player marker from server broadcast
     * Promotes community connection and spatial awareness
     * @param {Object} playerData - Player data from server
     * @param {String} playerId - Player ID
     */
    createOtherPlayerMarker(playerData, playerId) {
        console.log('👤 Creating other player marker:', { playerData, playerId });
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for other player marker');
            return;
        }
        
        if (!playerData.position || !playerData.position.lat || !playerData.position.lng) {
            console.warn('⚠️ Invalid position data for other player marker');
            return;
        }
        
        try {
            // Consciousness-Serving: Get actual player name for authentic community relationships
            const playerName = this.getPlayerName(playerId) || this.generatePlayerName(playerId);
            
            // Create a different visual style for other players
            const otherPlayerIcon = L.divIcon({
                className: 'other-player-marker',
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #3b82f6; 
                        border: 2px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                        animation: playerPulse 2s infinite;
                    ">👤</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([playerData.position.lat, playerData.position.lng], { 
                icon: otherPlayerIcon,
                zIndexOffset: 300 // Lower z-index than own player marker
            }).addTo(window.mapLayer.map);

            // Consciousness-Serving: Add popup with player name
            marker.bindPopup(`
                <b>${playerName}</b><br>
                <small>Player: ${playerName}</small><br>
                <small>${playerData.position.lat.toFixed(6)}, ${playerData.position.lng.toFixed(6)}</small>
            `);

            console.log('👤 Other player marker created successfully');
            
            // Store marker reference for updates
            if (!this.otherPlayerMarkers) {
                this.otherPlayerMarkers = new Map();
            }
            this.otherPlayerMarkers.set(playerId, marker);
            
            return marker;
        } catch (error) {
            console.error('❌ Failed to create other player marker:', error);
        }
    }
    
    /**
     * Consciousness-Serving: Update other player marker position
     * @param {String} playerId - Player ID
     * @param {Object} position - New position
     */
    updateOtherPlayerMarker(playerId, position) {
        if (this.otherPlayerMarkers && this.otherPlayerMarkers.has(playerId)) {
            const marker = this.otherPlayerMarkers.get(playerId);
            if (marker && marker.setLatLng) {
                marker.setLatLng([position.lat, position.lng]);
                console.log('👤 Other player marker updated:', playerId);
            }
        }
    }
    
    /**
     * Consciousness-Serving: Remove other player marker
     * @param {String} playerId - Player ID
     */
    removeOtherPlayerMarker(playerId) {
        if (this.otherPlayerMarkers && this.otherPlayerMarkers.has(playerId)) {
            const marker = this.otherPlayerMarkers.get(playerId);
            if (marker && window.mapLayer && window.mapLayer.map) {
                window.mapLayer.map.removeLayer(marker);
                this.otherPlayerMarkers.delete(playerId);
                console.log('👤 Other player marker removed:', playerId);
            }
        }
    }
    
    /**
     * Consciousness-Serving: Get actual player name from stored data
     * Promotes authentic community relationships
     */
    getPlayerName(playerId) {
        // Try to get from connected players
        if (this.connectedPlayers && this.connectedPlayers[playerId]) {
            const player = this.connectedPlayers[playerId];
            if (player.name && player.name !== 'Unknown' && player.name !== 'Explorer') {
                return player.name;
            }
        }
        
        // Try to get from localStorage
        try {
            const playerData = localStorage.getItem(`eldritch_player_${playerId}`);
            if (playerData) {
                const parsed = JSON.parse(playerData);
                if (parsed.name && parsed.name !== 'Unknown' && parsed.name !== 'Explorer') {
                    return parsed.name;
                }
            }
        } catch (error) {
            console.log('👥 WebSocket: Error reading player data from localStorage:', error);
        }
        
        return null;
    }
    
    /**
     * Consciousness-Serving: Generate meaningful player name
     * Creates authentic community identity
     */
    generatePlayerName(playerId) {
        // Extract meaningful part from player ID
        const meaningfulPart = playerId.replace(/^player_/, '').substring(0, 8);
        
        // Generate consciousness-serving names based on player ID
        const cosmicNames = [
            'Cosmic Explorer', 'Stellar Wanderer', 'Lunar Guardian', 'Solar Seeker',
            'Aurora Walker', 'Nebula Scout', 'Galaxy Pioneer', 'Star Navigator',
            'Cosmic Sage', 'Celestial Guide', 'Universal Traveler', 'Space Explorer',
            'Moon Walker', 'Sun Seeker', 'Earth Guardian', 'Sky Wanderer'
        ];
        
        // Use player ID hash to select consistent name
        const hash = this.simpleHash(meaningfulPart);
        const nameIndex = hash % cosmicNames.length;
        
        return cosmicNames[nameIndex];
    }
    
    /**
     * Simple hash function for consistent name generation
     */
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
    }
    
    /**
     * Show notification when another player creates a base
     * @param {String} playerId - Player ID who created the base
     * @param {Object} position - Base position
     */
    showNewBaseNotification(playerId, position) {
        console.log('🔔 Showing new base notification for player:', playerId);
        
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        // Consciousness-Serving: Use actual player name for authentic community connection
        const playerName = this.getPlayerName(playerId) || this.generatePlayerName(playerId);
        
        notification.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 4px;">🏗️ New Base Created!</div>
            <div style="font-size: 12px; opacity: 0.9;">
                ${playerName} has established a base nearby!<br>
                <small>Location: ${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}</small>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-in';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    /**
     * Center map on base marker position
     * @param {Object} position - Base position
     */
    centerMapOnBase(position) {
        console.log('🎯 Centering map on base marker:', position);
        
        // Try different map references
        let map = null;
        
        if (window.mapLayer && window.mapLayer.map) {
            map = window.mapLayer.map;
            console.log('🎯 Using window.mapLayer.map for centering');
        } else if (window.mapEngine && window.mapEngine.map) {
            map = window.mapEngine.map;
            console.log('🎯 Using window.mapEngine.map for centering');
        }
        
        if (map && typeof map.setView === 'function') {
            map.setView([position.lat, position.lng], map.getZoom(), {
                animate: true,
                duration: 0.8
            });
            console.log('🎯 Map centered on base marker successfully');
        } else {
            console.warn('⚠️ No map available for centering on base marker');
        }
    }
    
    /**
     * Restore markers from server state
     * @param {Array} markers - Array of marker objects
     */
    restoreMarkersFromServer(markers) {
        console.log(`📍 Restoring ${markers.length} markers from server state...`);
        
        // Wait for map systems to be ready before restoring markers
        this.waitForMapSystemsReady(() => {
            this.performMarkerRestoration(markers);
        });
    }
    
    /**
     * Wait for map systems to be ready before restoring markers
     * @param {Function} callback - Callback to execute when ready
     */
    waitForMapSystemsReady(callback) {
        const checkMapReady = () => {
            // Check for the actual map systems in the new layered architecture
            const mapReady = window.mapLayer && 
                           window.mapLayer.map && 
                           window.mapLayer.mapReady;
            
            console.log('🗺️ Map readiness check for marker restoration:', {
                mapLayer: !!window.mapLayer,
                map: !!(window.mapLayer && window.mapLayer.map),
                mapReady: !!(window.mapLayer && window.mapLayer.mapReady)
            });
            
            if (mapReady) {
                console.log('✅ Map systems ready for marker restoration');
                callback();
            } else {
                console.log('⏳ Map systems not ready for marker restoration, waiting...');
                setTimeout(checkMapReady, 200);
            }
        };
        
        // Start checking immediately
        checkMapReady();
    }
    
    /**
     * Perform the actual marker restoration
     * @param {Array} markers - Array of marker objects
     */
    performMarkerRestoration(markers) {
        if (!window.mapLayer) {
            console.warn('⚠️ MapLayer not available for marker restoration');
            return;
        }
        
        console.log(`📍 Performing restoration of ${markers.length} markers...`);
        
        let restoredCount = 0;
        markers.forEach(marker => {
            try {
                if (marker.type === 'base' && marker.position) {
                    // Restore base marker using direct Leaflet approach (same as POI)
                    console.log('🏗️ Restoring base marker:', marker.position);
                    this.restoreBaseMarkerFromServer(marker);
                    restoredCount++;
                } else if (marker.type === 'flag' && marker.position) {
                    // Restore flag marker
                    console.log('🇫🇮 Restoring flag marker:', marker.position);
                    // Use the map engine's dropFlagHere method for flag restoration
                    if (window.mapEngine && typeof window.mapEngine.dropFlagHere === 'function') {
                        window.mapEngine.dropFlagHere(
                            marker.position.lat,
                            marker.position.lng
                        );
                        restoredCount++;
                    } else if (window.mapLayer && typeof window.mapLayer.addFlagMarker === 'function') {
                        // Fallback to map layer method
                        window.mapLayer.addFlagMarker(marker.position);
                        restoredCount++;
                    } else {
                        console.warn('🇫🇮 No flag restoration method available');
                    }
                } else if (marker.type === 'step' && marker.position) {
                    // Restore step marker
                    console.log('👣 Restoring step marker:', marker.position, 'step:', marker.data?.stepNumber);
                    window.mapLayer.addStepMarker(marker.position, marker.data?.stepNumber || 1);
                    restoredCount++;
                } else if (marker.type === 'path' && marker.position) {
                    // Restore path marker
                    console.log('🛤️ Restoring path marker:', marker.position);
                    window.mapLayer.addPathMarker(marker.position);
                    restoredCount++;
                } else if (marker.type === 'poi' && marker.position) {
                    // Restore POI marker
                    console.log('📍 Restoring POI marker:', marker.position);
                    this.restorePOIMarkerFromServer(marker);
                    restoredCount++;
                } else if (marker.type === 'npc' && marker.position) {
                    // Restore NPC marker
                    console.log('👤 Restoring NPC marker:', marker.position);
                    this.restoreNPCMarkerFromServer(marker);
                    restoredCount++;
                } else if (marker.type === 'monster' && marker.position) {
                    // Restore Monster marker
                    console.log('👹 Restoring Monster marker:', marker.position);
                    this.restoreMonsterMarkerFromServer(marker);
                    restoredCount++;
                } else {
                    console.log('❓ Unknown marker type:', marker.type, marker);
                }
            } catch (error) {
                console.error('❌ Error restoring marker:', marker, error);
            }
        });
        
        console.log(`✅ Marker restoration complete - ${restoredCount}/${markers.length} markers restored successfully`);
    }
    
    /**
     * Restore base from server state
     * @param {Object} position - Base position
     */
    restoreBaseFromServer(position) {
        if (window.mapLayer && position) {
            try {
                window.mapLayer.addBaseMarker(position);
                console.log('🏗️ Base restored from server state');
            } catch (error) {
                console.error('❌ Error restoring base:', error);
            }
        }
    }
    
    /**
     * Add marker from another player
     * @param {Object} marker - Marker object
     */
    addMarkerFromOtherPlayer(marker) {
        console.log('📍 Adding marker from other player:', marker);
        
        // Handle different marker types
        if (marker.type === 'base' || marker.type === 'BASE') {
            this.restoreBaseMarkerFromServer(marker);
        } else if (marker.type === 'path' || marker.type === 'step') {
            // Handle path/step markers
            this.createPathMarkerFromServer(marker);
        } else if (marker.type === 'poi') {
            // Handle POI markers
            this.restorePOIMarkerFromServer(marker);
        } else if (marker.type === 'npc') {
            // Handle NPC markers
            this.restoreNPCMarkerFromServer(marker);
        } else if (marker.type === 'monster') {
            // Handle Monster markers
            this.restoreMonsterMarkerFromServer(marker);
        } else {
            console.log('📍 Unknown marker type from other player:', marker.type);
        }
    }
    
    /**
     * Create path marker from server
     * @param {Object} marker - Path marker data
     */
    createPathMarkerFromServer(marker) {
        console.log('🛤️ Creating path marker from server:', marker);
        
        // Use MapObjectManager to create path marker
        if (window.mapObjectManager && typeof window.mapObjectManager.createObject === 'function') {
            try {
                const pathMarker = window.mapObjectManager.createObject('PATH', marker.position);
                console.log('🛤️ Path marker created successfully from server');
                return pathMarker;
            } catch (error) {
                console.error('❌ Failed to create path marker from server:', error);
            }
        }
    }
    
    /**
     * Restore POI marker from server
     * @param {Object} marker - POI marker data
     */
    restorePOIMarkerFromServer(marker) {
        console.log('📍 Restoring POI marker from server:', marker);
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for POI marker restoration');
            return;
        }
        
        try {
            const poiIcon = L.divIcon({
                className: 'poi-marker',
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #ff6b35; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">${marker.data?.symbol || '❓'}</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const poiMarker = L.marker([marker.position.lat, marker.position.lng], { 
                icon: poiIcon,
                zIndexOffset: 700
            }).addTo(window.mapLayer.map);

            // Add popup with marker data
            const name = marker.data?.name || 'Mystery Location';
            const description = marker.data?.description || 'A mysterious point of interest';
            
            poiMarker.bindPopup(`
                <b>Point of Interest</b><br>
                <small>${marker.data?.symbol || '❓'} ${name}</small><br>
                <small>${description}</small><br>
                <small>${marker.position.lat.toFixed(6)}, ${marker.position.lng.toFixed(6)}</small>
            `);

            console.log('📍 POI marker restored successfully from server');
            return poiMarker;
        } catch (error) {
            console.error('❌ Failed to restore POI marker from server:', error);
        }
    }

    /**
     * BRDC: Restore lightweight base marker from server using direct Leaflet approach
     * 
     * This method implements server-side marker restoration using the "Sacred Pattern":
     * 1. Direct Leaflet creation (L.marker().addTo())
     * 2. Consistent positioning (server coordinates)
     * 3. CSS isolation (unique class name)
     * 4. Server data integration (marker properties)
     * 
     * Resolves: #bug-base-marker-visibility
     * Implements: #feature-base-building
     * Uses: #feature-marker-system
     * 
     * @param {Object} marker - Server marker data with position and properties
     */
    /**
     * BRDC: Show player movement trails on the map
     * 
     * Creates animated polylines showing other players' movement paths.
     * Implements the "Sacred Pattern" for social exploration features.
     * 
     * Implements: #enhancement-social-exploration
     * Uses: #feature-marker-system
     * 
     * @returns {void}
     */
    showPlayerTrails() {
        console.log('🛤️ Showing player trails...');
        
        // Create a trail layer if it doesn't exist
        if (!this.trailLayer) {
            this.trailLayer = L.layerGroup().addTo(window.mapLayer.map);
        }
        
        // For now, create some sample trails (in a real implementation, this would come from server)
        const sampleTrails = [
            {
                playerId: 'other_player_1',
                playerName: 'Cosmic Explorer',
                path: [
                    [61.4720, 23.7240],
                    [61.4725, 23.7245],
                    [61.4730, 23.7250],
                    [61.4735, 23.7255]
                ],
                color: '#3b82f6'
            },
            {
                playerId: 'other_player_2', 
                playerName: 'Void Walker',
                path: [
                    [61.4710, 23.7230],
                    [61.4715, 23.7235],
                    [61.4720, 23.7240],
                    [61.4725, 23.7245]
                ],
                color: '#10b981'
            }
        ];
        
        sampleTrails.forEach(trail => {
            // Create polyline for the trail
            const polyline = L.polyline(trail.path, {
                color: trail.color,
                weight: 3,
                opacity: 0.7,
                dashArray: '5, 10'
            }).addTo(this.trailLayer);
            
            // Add popup with player info
            polyline.bindPopup(`
                <div style="text-align: center; padding: 10px;">
                    <h4 style="margin: 0 0 8px 0; color: ${trail.color};">${trail.playerName}</h4>
                    <p style="margin: 0; color: #e5e7eb; font-size: 12px;">Movement Trail</p>
                </div>
            `);
            
            // Add pulsing animation
            polyline.on('add', () => {
                polyline.getElement().style.animation = 'trailPulse 2s ease-in-out infinite';
            });
        });
        
        console.log('🛤️ Player trails displayed');
    }
    
    /**
     * BRDC: Hide player movement trails from the map
     * 
     * Removes all trail polylines and cleans up the trail layer.
     * 
     * Implements: #enhancement-social-exploration
     * Uses: #feature-marker-system
     * 
     * @returns {void}
     */
    hidePlayerTrails() {
        if (this.trailLayer) {
            this.trailLayer.clearLayers();
            console.log('🛤️ Player trails hidden');
        }
    }

    /**
     * BRDC: Get current player ID for ownership detection
     * 
     * Retrieves or generates a unique player ID for base ownership and multiplayer features.
     * Implements the "Sacred Pattern" for player identification.
     * 
     * Implements: #feature-player-identification
     * Uses: #feature-persistence-system
     * 
     * @returns {string} - Current player ID
     */
    getCurrentPlayerId() {
        // Consciousness-serving: Single key for sacred simplicity
        const PLAYER_ID_KEY = 'eldritch_player_id';
        
        // Try to get existing player ID
        let playerId = localStorage.getItem(PLAYER_ID_KEY);
        
        if (playerId) {
            console.log('🆔 Retrieved existing player ID:', playerId);
            return playerId;
        }
        
        // Generate new player ID if none exists
        const newPlayerId = this.generatePlayerId();
        localStorage.setItem(PLAYER_ID_KEY, newPlayerId);
        console.log('🆔 Generated new player ID:', newPlayerId);
        return newPlayerId;
    }

    restoreBaseMarkerFromServer(marker) {
        console.log('🏗️ Restoring SVG base marker from server:', marker);
        
        if (!window.mapLayer || !window.mapLayer.map || !window.SVGBaseGraphics) {
            console.warn('⚠️ MapLayer or SVG graphics not available for base marker restoration');
            return;
        }
        
        try {
            // Check if this is the player's own base FIRST
            const currentPlayerId = this.getCurrentPlayerId();
            const markerPlayerId = marker.data?.playerId || marker.data?.ownerId;
            const isOwnBase = marker.data?.isOwnBase || (markerPlayerId && markerPlayerId === currentPlayerId);
            
            // Use SVG graphics system for base marker restoration
            const baseConfig = {
                size: 120,
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#3b82f6',
                    accent: '#fbbf24',
                    energy: '#ffffff',
                    territory: '#8b5cf6'
                },
                animations: {
                    territoryPulse: true,
                    energyGlow: true,
                    flagWave: true,
                    particleEffects: true
                }
            };
            
            const baseMarker = new window.SVGBaseGraphics().createAnimatedBaseMarker(
                marker.position,
                baseConfig,
                'finnish', // Use Finnish flag
                window.mapLayer.map,
                isOwnBase ? 'own' : 'other' // Pass base type
            );
            
            // Add to map
            baseMarker.addTo(window.mapLayer.map);

            // Add simple stats popup
            const name = marker.data?.name || 'My Cosmic Base';
            const buttonId = `manage-base-btn-${Date.now()}`;
            
            console.log('🔍 Base ownership check:', {
                currentPlayerId,
                markerPlayerId,
                isOwnBase,
                markerData: marker.data
            });
            
            const popupContent = `
                <div style="text-align: center; padding: 15px; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 18px;">
                        🏗️ ${name}
                    </h3>
                    <div style="margin: 10px 0; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Level: <strong>${marker.data?.level || 1}</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Territory: <strong>${marker.data?.territorySize || 'Small'}</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Flag: <strong>Finnish</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Location: <strong>${marker.position.lat.toFixed(4)}, ${marker.position.lng.toFixed(4)}</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Owner: <strong>${isOwnBase ? 'You' : 'Other Player'}</strong></p>
                        ${isOwnBase ? `<p style="margin: 0; color: #e5e7eb;">Steps: <strong>${window.stepCurrencySystem?.totalSteps || 0}</strong></p>` : ''}
                    </div>
                    ${isOwnBase ? `
                        <button id="${buttonId}" 
                                style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); 
                                       color: white; border: none; padding: 10px 20px; 
                                       border-radius: 8px; cursor: pointer; font-weight: bold;
                                       box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                                       transition: all 0.3s ease;">
                            Manage Base
                        </button>
                    ` : `
                        <div style="color: #e5e7eb; font-size: 14px; padding: 10px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                            This is another player's base
                        </div>
                    `}
                </div>
            `;
            
            baseMarker.bindPopup(popupContent);
            
            // Add click handler for base menu
            baseMarker.on('click', () => {
                console.log('🎨 SVG base marker clicked - opening management menu');
                if (window.SimpleBaseInit && window.SimpleBaseInit.openBaseMenu) {
                    window.SimpleBaseInit.openBaseMenu();
                }
            });
            
            // Add popup open handler to attach button event listener
            baseMarker.on('popupopen', () => {
                setTimeout(() => {
                    const manageBtn = document.getElementById(buttonId);
                    if (manageBtn) {
                        manageBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            console.log('🎨 Manage Base button clicked');
                            if (window.SimpleBaseInit && window.SimpleBaseInit.openBaseMenu) {
                                window.SimpleBaseInit.openBaseMenu();
                            }
                        });
                    }
                }, 100);
            });

            console.log('🏗️ SVG base marker restored successfully from server');
            return baseMarker;
        } catch (error) {
            console.error('❌ Failed to restore base marker from server:', error);
        }
    }

    /**
     * BRDC: Restore lightweight NPC marker from server using direct Leaflet approach
     * 
     * Implements server-side marker restoration using the "Sacred Pattern":
     * - Direct Leaflet creation for reliability
     * - Consistent positioning from server data
     * - CSS isolation to prevent conflicts
     * - Server data integration for marker properties
     * 
     * Implements: #enhancement-npc-markers
     * Uses: #feature-marker-system
     * 
     * @param {Object} marker - Server marker data with position and properties
     */
    restoreAuroraFromServer(auroraData) {
        console.log('🌸 Restoring Aurora from server data:', auroraData);
        
        if (!window.auroraEncounter) {
            console.warn('⚠️ Aurora encounter system not available');
            return;
        }
        
        try {
            // Update Aurora state with server data
            if (window.auroraEncounter.auroraNPC) {
                window.auroraEncounter.auroraNPC.lat = auroraData.lat || window.auroraEncounter.auroraNPC.lat;
                window.auroraEncounter.auroraNPC.lng = auroraData.lng || window.auroraEncounter.auroraNPC.lng;
                window.auroraEncounter.auroraNPC.consciousnessLevel = auroraData.consciousnessLevel || 'awakening';
                
                // Recreate marker with server position
                window.auroraEncounter.createAuroraMarker();
                console.log('🌸 Aurora restored from server successfully');
            }
        } catch (error) {
            console.error('❌ Failed to restore Aurora from server:', error);
        }
    }
    
    restoreNPCMarkerFromServer(marker) {
        console.log('👤 Restoring LIGHTWEIGHT NPC marker from server:', marker);
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for NPC marker restoration');
            return;
        }
        
        try {
            // Use EXACTLY the same approach as POI marker restoration
            const npcIcon = L.divIcon({
                className: 'npc-marker-lightweight', // Different class name to avoid CSS conflicts
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #3b82f6; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">${marker.data?.symbol || '👤'}</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const npcMarker = L.marker([marker.position.lat, marker.position.lng], { 
                icon: npcIcon,
                zIndexOffset: 500
            }).addTo(window.mapLayer.map);

            // Add popup (simple like POI)
            const name = marker.data?.name || 'Mysterious Stranger';
            const symbol = marker.data?.symbol || '👤';
            
            npcMarker.bindPopup(`
                <b>NPC Marker</b><br>
                <small>${symbol} ${name}</small><br>
                <small>${marker.position.lat.toFixed(6)}, ${marker.position.lng.toFixed(6)}</small>
            `);

            console.log('👤 LIGHTWEIGHT NPC marker restored successfully from server');
            return npcMarker;
        } catch (error) {
            console.error('❌ Failed to restore NPC marker from server:', error);
        }
    }

    /**
     * BRDC: Restore lightweight Monster marker from server using direct Leaflet approach
     * 
     * Implements server-side marker restoration using the "Sacred Pattern":
     * - Direct Leaflet creation for reliability
     * - Consistent positioning from server data
     * - CSS isolation to prevent conflicts
     * - Server data integration for marker properties
     * 
     * Implements: #enhancement-monster-markers
     * Uses: #feature-marker-system
     * 
     * @param {Object} marker - Server marker data with position and properties
     */
    restoreMonsterMarkerFromServer(marker) {
        console.log('👹 Restoring LIGHTWEIGHT Monster marker from server:', marker);
        
        if (!window.mapLayer || !window.mapLayer.map) {
            console.warn('⚠️ MapLayer not available for Monster marker restoration');
            return;
        }
        
        try {
            // Use EXACTLY the same approach as POI marker restoration
            const monsterIcon = L.divIcon({
                className: 'monster-marker-lightweight', // Different class name to avoid CSS conflicts
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #dc2626; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">${marker.data?.symbol || '👹'}</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const monsterMarker = L.marker([marker.position.lat, marker.position.lng], { 
                icon: monsterIcon,
                zIndexOffset: 400
            }).addTo(window.mapLayer.map);

            // Add popup (simple like POI)
            const name = marker.data?.name || 'Cosmic Horror';
            const symbol = marker.data?.symbol || '👹';
            
            monsterMarker.bindPopup(`
                <b>Monster Marker</b><br>
                <small>${symbol} ${name}</small><br>
                <small>${marker.position.lat.toFixed(6)}, ${marker.position.lng.toFixed(6)}</small>
            `);

            console.log('👹 LIGHTWEIGHT Monster marker restored successfully from server');
            return monsterMarker;
        } catch (error) {
            console.error('❌ Failed to restore Monster marker from server:', error);
        }
    }

    handleZoneEntry(payload) {
        console.log(`™ Player entered zone: ${payload.zoneType}`);
        
        if (this.onInvestigationUpdate) {
            this.onInvestigationUpdate(payload);
        }
    }

    handleBaseEstablishmentAvailable(payload) {
        console.log(`🏗️ Base establishment available! Message: ${payload.message}`);
        
        // Log to debug logger
        if (window.debugLogger && typeof window.debugLogger.log === 'function') {
            window.debugLogger.log(`📨 Received base_establishment_available from server: ${payload.message}`, 'websocket');
        }
        
        // Debug: Check what systems are available
        console.log('🔍 Debugging base system availability:');
        console.log('  - window.baseSystem:', !!window.baseSystem);
        console.log('  - window.eldritchApp:', !!window.eldritchApp);
        console.log('  - window.eldritchApp.systems:', !!window.eldritchApp?.systems);
        console.log('  - window.eldritchApp.systems.baseBuilding:', !!window.eldritchApp?.systems?.baseBuilding);
        
        // Trigger base establishment dialog
        if (window.baseSystem && typeof window.baseSystem.showBaseEstablishmentModal === 'function') {
            console.log('🏗️ Triggering base establishment dialog via baseSystem...');
            window.baseSystem.showBaseEstablishmentModal();
        } else if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.baseBuilding) {
            console.log('🏗️ Triggering base establishment dialog via eldritchApp...');
            window.eldritchApp.systems.baseBuilding.showEstablishmentDialog();
        } else {
            // Fallback: show alert
            console.log('🏗️ No base system found, showing alert...');
            alert(`🏗️ ${payload.message}`);
        }
    }

    handleQuestSystemUnlocked(payload) {
        console.log(`📜 Quest system unlocked! Message: ${payload.message}`);
        
        // Trigger quest system unlock
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.questSystem) {
            window.eldritchApp.systems.questSystem.unlockQuestSystem();
        } else {
            // Fallback: show notification
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.showNotification(payload.message, 'success');
            }
        }
    }

    handleFlagCreationEnabled(payload) {
        console.log(`🇫🇮 Flag creation enabled! Message: ${payload.message}`);
        
        // Trigger flag creation enable
        if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.flagSystem) {
            window.eldritchApp.systems.flagSystem.enableFlagCreation();
        } else {
            // Fallback: show notification
            if (window.gruesomeNotifications) {
                window.gruesomeNotifications.showNotification(payload.message, 'info');
            }
        }
    }

    handleCelebrationTriggered(payload) {
        console.log(`🎉 Celebration triggered! Message: ${payload.message}`);
        
        // Trigger celebration effects
        if (window.discordEffects) {
            window.discordEffects.triggerGlowPulse(window.innerWidth/2, window.innerHeight/2, '#ffaa00', 100);
            window.discordEffects.triggerNotificationPop(payload.message, '#ffaa00');
        }
        
        // Show notification
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification(payload.message, 'celebration');
        }
    }

    updatePlayerCount(count) {
        const statusText = document.querySelector('.status-text');
        if (statusText) {
            statusText.textContent = `${count} explorers online`;
        }
    }

    updateConnectionStatus(status) {
        const statusDot = document.querySelector('.status-dot');
        const statusText = document.querySelector('.status-text');
        
        if (statusDot) {
            statusDot.className = 'status-dot';
            if (status === 'connected') {
                statusDot.classList.add('connected');
            } else if (status === 'connecting') {
                statusDot.classList.add('connecting');
            }
        }
        
        if (statusText) {
            switch (status) {
                case 'connected':
                    statusText.textContent = 'Connected';
                    break;
                case 'connecting':
                    statusText.textContent = 'Connecting...';
                    break;
                case 'disconnected':
                    statusText.textContent = 'Disconnected';
                    break;
                case 'error':
                    statusText.textContent = 'Connection Error';
                    break;
            }
        }
    }

    updatePlayerCountDisplay(totalCount) {
        // No-op: authoritative display handled by MultiplayerManager
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log(' Max reconnection attempts reached');
            this.updateConnectionStatus('error');
            return;
        }

        this.reconnectAttempts++;
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
        
        console.log(` Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);
        this.updateConnectionStatus('connecting');
        
        setTimeout(() => {
            this.connect();
        }, this.reconnectDelay);
    }

    handleConnectionError() {
        this.isConnected = false;
        this.updateConnectionStatus('error');
        
        if (this.onConnectionChange) {
            this.onConnectionChange(false);
        }
    }

    // Send messages to server
    sendPlayerJoin() {
        this.send({
            type: 'playerJoin',
            payload: {
                playerId: this.playerId,
                name: 'Cosmic Explorer',
                timestamp: Date.now()
            }
        });
    }

    sendPositionUpdate(position) {
        if (!this.isConnected) return;
        
        this.send({
            type: 'positionUpdate',
            payload: {
                playerId: this.playerId,
                position: position,
                timestamp: Date.now()
            }
        });
    }

    sendInvestigationStart(investigation) {
        if (!this.isConnected) return;
        
        this.send({
            type: 'investigationStart',
            payload: {
                playerId: this.playerId,
                investigation: investigation,
                timestamp: Date.now()
            }
        });
    }

    sendInvestigationComplete(investigation) {
        if (!this.isConnected) return;
        
        this.send({
            type: 'investigationComplete',
            payload: {
                playerId: this.playerId,
                investigation: investigation,
                timestamp: Date.now()
            }
        });
    }

    sendZoneEntry(zoneType) {
        if (!this.isConnected) return;
        
        this.send({
            type: 'zoneEntry',
            payload: {
                playerId: this.playerId,
                zoneType: zoneType,
                timestamp: Date.now()
            }
        });
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            try {
                // Log outgoing messages to debug logger
                if (window.debugLogger && typeof window.debugLogger.log === 'function') {
                    window.debugLogger.log(`📤 Sending to server: ${message.type}`, 'websocket');
                }
                
                this.socket.send(JSON.stringify(message));
            } catch (error) {
                console.error('Failed to send WebSocket message:', error);
            }
        }
    }

    // Get other players data
    getOtherPlayers() {
        return Array.from(this.otherPlayers.values());
    }

    // Get player ID
    getPlayerId() {
        return this.playerId;
    }

    // Check connection status
    isConnectedToServer() {
        return this.isConnected;
    }

    // Game State Synchronization Methods
    
    /**
     * Request complete game state from server
     */
    requestGameState() {
        if (this.isConnected) {
            console.log('🎮 Requesting game state from server');
            this.send({
                type: 'request_game_state'
            });
        } else {
            console.warn('⚠️ Cannot request game state - not connected to server');
        }
    }
    
    /**
     * Request game state for continue adventure
     * Only requests if player is continuing an existing adventure
     */
    requestGameStateForContinue() {
        const playerChoice = localStorage.getItem('eldritch_player_choice');
        console.log('🎮 Game state request check:', {
            playerChoice,
            isConnected: this.isConnected,
            playerId: this.playerId
        });
        
        if (playerChoice === 'continue' && this.isConnected) {
            console.log('🎮 Requesting game state for continue adventure...');
            this.requestGameState();
        } else {
            console.log('🎮 Skipping game state request - not continuing adventure or not connected');
        }
    }
    
    /**
     * Process queued markers when WebSocket connects
     */
    processMarkerQueue() {
        if (this.markerQueue.length > 0) {
            console.log(`📍 Processing ${this.markerQueue.length} queued markers...`);
            this.markerQueue.forEach(markerData => {
                console.log('📍 Sending queued marker to server:', markerData);
                this.send({
                    type: 'marker_create',
                    payload: markerData
                });
            });
            this.markerQueue = []; // Clear the queue
            console.log('📍 Marker queue processed and cleared');
        }
    }

    /**
     * Create marker via server
     * @param {Object} markerData - Marker data
     */
    createMarker(markerData) {
        if (this.isConnected) {
            console.log('📍 Creating marker via server:', markerData);
            console.log('📍 WebSocket connection status:', this.socket ? this.socket.readyState : 'no connection');
            this.send({
                type: 'marker_create',
                payload: markerData
            });
        } else {
            console.log('📍 WebSocket not connected, queuing marker for later:', markerData);
            this.markerQueue.push(markerData);
        }
    }
    
    /**
     * Update marker via server
     * @param {string} markerId - Marker ID
     * @param {Object} updates - Updates to apply
     */
    updateMarker(markerId, updates) {
        if (this.isConnected) {
            console.log('📍 Updating marker via server:', markerId, updates);
            this.send({
                type: 'marker_update',
                payload: {
                    markerId: markerId,
                    updates: updates
                }
            });
        } else {
            console.warn('⚠️ Cannot update marker - not connected to server');
        }
    }
    
    /**
     * Delete marker via server
     * @param {string} markerId - Marker ID
     */
    deleteMarker(markerId) {
        if (this.isConnected) {
            console.log('📍 Deleting marker via server:', markerId);
            this.send({
                type: 'marker_delete',
                payload: {
                    markerId: markerId
                }
            });
        } else {
            console.warn('⚠️ Cannot delete marker - not connected to server');
        }
    }
    
    /**
     * Establish base via server
     * @param {Object} position - Base position
     */
    establishBase(position) {
        if (this.isConnected) {
            console.log('🏗️ Establishing base via server:', position);
            this.send({
                type: 'base_establish',
                payload: {
                    position: position
                }
            });
        } else {
            console.warn('⚠️ Cannot establish base - not connected to server');
        }
    }

    // Cleanup
    disconnect() {
        if (this.socket) {
            this.socket.close(1000, 'Client disconnecting');
            this.socket = null;
        }
        this.isConnected = false;
        this.otherPlayers.clear();
    }

    destroy() {
        this.disconnect();
    }
}

// Export for use in other modules
window.WebSocketClient = WebSocketClient;


