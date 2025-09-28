/**
 * @fileoverview [VERIFIED] WebSocket Client - Real-time multiplayer communication
 * @status VERIFIED - WebSocket communication stable and working
 * @feature #feature-websocket-communication
 * @last_verified 2024-01-28
 * @dependencies Server WebSocket, Player ID management
 * @warning Do not modify connection logic or message handling without testing multiplayer features
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
        // Try to load existing player ID from localStorage
        const storedPlayerId = localStorage.getItem('eldritch_player_id');
        if (storedPlayerId) {
            console.log('🎮 Loaded existing player ID from localStorage:', storedPlayerId);
            return storedPlayerId;
        }
        
        // Generate new player ID if none exists
        const newPlayerId = this.generatePlayerId();
        localStorage.setItem('eldritch_player_id', newPlayerId);
        console.log('🎮 Generated new player ID and saved to localStorage:', newPlayerId);
        return newPlayerId;
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate a new player ID and save it to localStorage
     * This should be called when starting a fresh adventure
     */
    generateNewPlayerId() {
        const newPlayerId = this.generatePlayerId();
        localStorage.setItem('eldritch_player_id', newPlayerId);
        this.playerId = newPlayerId;
        console.log('🎮 Generated new player ID for fresh adventure:', newPlayerId);
        return newPlayerId;
    }

    /**
     * Check if player has an active player ID
     */
    hasActivePlayerId() {
        const storedPlayerId = localStorage.getItem('eldritch_player_id');
        return !!storedPlayerId;
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
            
            console.log(`ðŸ‘¤ Player joined: ${payload.name || payload.playerId}`);

            // UI/list rendering handled by MultiplayerManager; do not mutate DOM here
        }
    }

    handlePlayerLeave(payload) {
        this.otherPlayers.delete(payload.playerId);
        console.log(`ðŸ‘¤ Player left: ${payload.playerId}`);
    }

    handlePositionUpdate(payload) {
        if (payload.playerId !== this.playerId) {
            const player = this.otherPlayers.get(payload.playerId);
            if (player) {
                player.position = payload.position;
                player.lastSeen = Date.now();
                
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
            
            // Restore base if established
            if (gameState.baseEstablished && gameState.basePosition) {
                console.log('🏗️ Restoring base from server state:', gameState.basePosition);
                this.restoreBaseFromServer(gameState.basePosition);
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
        // Base is already established locally, just confirm
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
                    // Restore base marker
                    console.log('🏗️ Restoring base marker:', marker.position);
                    window.mapLayer.addBaseMarker(marker.position);
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
        // This would be implemented based on marker type
        // For now, just log the marker
        console.log('📍 Adding marker from other player:', marker);
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


