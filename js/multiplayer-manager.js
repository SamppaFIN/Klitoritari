/**
 * Multiplayer Manager - WebSocket-based player synchronization
 * Handles real-time multiplayer features for Eldritch Sanctuary
 */

class MultiplayerManager {
    constructor() {
        this.isConnected = false;
        this.websocket = null;
        this.playerId = this.generatePlayerId();
        this.players = new Map(); // playerId -> player data
        this.syncRadius = 1000; // meters - only sync nearby players
        this.lastPosition = null;
        this.positionUpdateInterval = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000; // ms
        this._lastJoinSoundAt = 0;
        this._lastLeaveSoundAt = 0;
        this._flagsReconcileInterval = null;
        
        // WebSocket server URL - derive from current origin by default
        const isSecure = window.location.protocol === 'https:';
        const host = window.location.hostname;
        const port = window.location.port || (isSecure ? '443' : '80');
        this.serverUrl = `${isSecure ? 'wss' : 'ws'}://${host}:${port}/ws`;
        // Allow override via env-style global if provided
        if (window.ELDRITCH_WS_URL) {
            this.serverUrl = window.ELDRITCH_WS_URL;
        }
        
        console.log('🌐 MultiplayerManager initialized, WS URL:', this.serverUrl);
    }

    init() {
        // Initialize multiplayer manager
        console.log('🌐 Multiplayer Manager initialized');
    }
    
    /**
     * Generate unique player ID
     */
    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }
    
    /**
     * Initialize multiplayer connection
     */
    async initialize() {
        console.log('🌐 Initializing multiplayer connection...');
        
        try {
            await this.connect();
            this.startPositionSync();
            if (!this._flagsReconcileInterval) {
                this._flagsReconcileInterval = setInterval(() => {
                    try { this.requestAllFlags(); } catch (_) {}
                }, 30000);
            }
            console.log('🌐 Multiplayer initialized successfully');
        } catch (error) {
            console.warn('🌐 Multiplayer initialization failed:', error);
            // Continue in single-player mode
            this.isConnected = false;
        }
    }
    
    /**
     * Connect to WebSocket server
     */
    connect() {
        return new Promise((resolve, reject) => {
            try {
                console.log('🌐 Attempting WebSocket connect to:', this.serverUrl);
                this.websocket = new WebSocket(this.serverUrl);
                
                this.websocket.onopen = () => {
                    console.log('🌐 WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    // Send initial player data using both schemas for compatibility
                    this.sendPlayerData();
                    // Avoid double-join: only send player_join if we have not yet announced
                    if (!this._announcedJoin) {
                        this._announcedJoin = true;
                        this.sendMessage({
                            type: 'player_join',
                            playerId: this.playerId,
                            playerData: this.getCurrentPlayerData() || {}
                        });
                    }
                    // After connecting, broadcast our existing flags so late joiners see them
                    setTimeout(() => this.sendExistingFlags(), 300);
                    resolve();
                };
                
                this.websocket.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };
                
                this.websocket.onclose = (ev) => {
                    console.log('🌐 WebSocket disconnected', { code: ev.code, reason: ev.reason });
                    this.isConnected = false;
                    this.attemptReconnect();
                };
                
                this.websocket.onerror = (error) => {
                    console.error('🌐 WebSocket error (verify server reachable and WS path /ws):', error);
                    reject(error);
                };
                
                // Timeout after 5 seconds
                setTimeout(() => {
                    if (!this.isConnected) {
                        reject(new Error('Connection timeout'));
                    }
                }, 5000);
                
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Broadcast all existing flags owned by this client so others can render them
     */
    sendExistingFlags() {
        try {
            if (!this.isConnected || !window.mapEngine || !window.mapEngine.finnishFlagLayer) return;
            const pins = window.mapEngine.finnishFlagLayer.flagPins || [];
            const ownerId = this.playerId;
            pins.forEach(pin => {
                // Only re-broadcast our own pins to avoid rebroadcast storms
                if (pin.ownerId && pin.ownerId !== ownerId) return;
                this.sendMessage({
                    type: 'flag_update',
                    playerId: ownerId,
                    flagId: `${pin.lat.toFixed(6)}_${pin.lng.toFixed(6)}_${pin.timestamp}`,
                    flagData: {
                        lat: pin.lat,
                        lng: pin.lng,
                        size: pin.size,
                        rotation: pin.rotation,
                        symbol: pin.symbol,
                        ownerId: ownerId,
                        timestamp: pin.timestamp
                    }
                });
            });
            console.log(`🌐 Re-broadcasted ${pins.length} existing flags for owner ${ownerId}`);
        } catch (e) {
            console.warn('🌐 Failed to send existing flags:', e);
        }
    }

    /**
     * Request all other clients to re-send their flags
     */
    requestAllFlags() {
        if (!this.isConnected) return;
        this.sendMessage({ type: 'request_flags', requesterId: this.playerId });
    }
    
    /**
     * Handle incoming WebSocket messages
     */
    handleMessage(data) {
        switch (data.type) {
            case 'player_update':
                if (data && data.playerId && data.playerData) {
                    this.updatePlayer(data.playerId, data.playerData);
                }
                break;
            case 'playerCount':
                // Server broadcast with total players online
                if (data.payload && typeof data.payload.count === 'number') {
                    this.updatePlayerCountDisplay(data.payload.count);
                }
                break;
            case 'player_join':
                this.addPlayer(data.playerId, data.playerData);
                try {
                    if (window.gruesomeNotifications) {
                        const name = data?.playerData?.profile?.name || 'Explorer';
                        window.gruesomeNotifications.showNotification(`${name} connected`, 'info');
                    }
                } catch (_) {}
                break;
            case 'player_leave':
                this.removePlayer(data.playerId);
                break;
            case 'playerJoin':
                if (data.payload) {
                    this.addPlayer(data.payload.playerId, data.payload.playerData || {});
                }
                break;
            case 'playerLeave':
                if (data.payload && data.payload.playerId) {
                    this.removePlayer(data.payload.playerId);
                }
                break;
            case 'positionUpdate':
                if (data.payload && data.payload.playerId && data.payload.position) {
                    this.updatePlayer(data.payload.playerId, { position: data.payload.position, profile: {} });
                }
                break;
            case 'players_snapshot':
                if (Array.isArray(data.payload)) {
                    data.payload.forEach(p => this.addPlayer(p.playerId, p.playerData));
                }
                break;
            case 'flag_update':
                this.updateFlag(data.flagId, data.flagData);
                break;
            case 'request_flags':
                // When someone requests flags, re-broadcast our own
                this.sendExistingFlags();
                break;
            case 'pong':
                // Heartbeat response
                break;
            default:
                console.log('🌐 Unknown message type:', data.type);
        }
    }
    
    /**
     * Send player data to server
     */
    sendPlayerData() {
        if (!this.isConnected || !this.websocket) return;
        
        const playerData = this.getCurrentPlayerData();
        this.sendMessage({
            type: 'player_update',
            playerId: this.playerId,
            playerData: playerData
        });
    }
    
    /**
     * Get current player data
     */
    getCurrentPlayerData() {
        const mapEngine = window.mapEngine;
        if (!mapEngine || !mapEngine.playerPosition) {
            return null;
        }
        
        // Profile and symbol
        let profile = null;
        try { profile = window.sessionPersistence?.restoreProfile?.(); } catch (_) {}
        const symbol = profile?.symbol || 'finnish';
        const name = profile?.name || 'Wanderer';
        // Moral nickname
        let nickname = '';
        try { nickname = window.eldritchApp?.systems?.moralChoice?.getNickname?.() || ''; } catch (_) {}

        return {
            position: {
                lat: mapEngine.playerPosition.lat,
                lng: mapEngine.playerPosition.lng
            },
            markerConfig: mapEngine.getPlayerMarkerConfig(),
            steps: window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0,
            timestamp: Date.now(),
            profile: { name, symbol, nickname }
        };
    }
    
    /**
     * Start periodic position synchronization
     */
    startPositionSync() {
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
        }
        
        this.positionUpdateInterval = setInterval(() => {
            if (this.isConnected) {
                const currentPos = this.getCurrentPlayerData();
                if (currentPos) {
                    // Always send periodic update so others see you on fresh sessions
                    this.sendPlayerData();
                    this.lastPosition = currentPos;
                }
            }
        }, 2000); // Update every 2 seconds
    }
    
    /**
     * Check if position has changed significantly
     */
    hasPositionChanged(newPos) {
        if (!this.lastPosition) return true;
        
        const latDiff = Math.abs(newPos.position.lat - this.lastPosition.position.lat);
        const lngDiff = Math.abs(newPos.position.lng - this.lastPosition.position.lng);
        
        // Update if moved more than ~10 meters
        return latDiff > 0.0001 || lngDiff > 0.0001;
    }
    
    /**
     * Update player data
     */
    updatePlayer(playerId, playerData) {
        if (playerId === this.playerId) return; // Don't update self
        if (!playerData || !playerData.position) return;
        
        this.players.set(playerId, {
            ...playerData,
            lastSeen: Date.now()
        });
        
        this.renderOtherPlayer(playerId, playerData);

        // Update player names list
        this.updatePlayerNamesDisplay();
    }
    
    /**
     * Add new player
     */
    addPlayer(playerId, playerData) {
        if (playerId === this.playerId) return;
        // De-duplicate: if already known, just update position/profile
        if (this.players.has(playerId)) {
            const prev = this.players.get(playerId) || {};
            this.players.set(playerId, { ...prev, ...playerData, lastSeen: Date.now() });
            this.renderOtherPlayer(playerId, this.players.get(playerId));
            this.updatePlayerNamesDisplay();
            return;
        }
        console.log('🌐 Player joined:', playerId);
        this.players.set(playerId, { ...playerData, lastSeen: Date.now() });
        try {
            const now = Date.now();
            if (now - this._lastJoinSoundAt > 3000 && window.soundManager?.playNotification) {
                this._lastJoinSoundAt = now;
                window.soundManager.playNotification();
            }
        } catch (_) {}
        
        this.renderOtherPlayer(playerId, playerData);
        
        // Show notification
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification(
                `Another player has joined the sanctuary!`,
                'info'
            );
        }

        // Update subtle player count (self + others we know)
        this.updatePlayerCountDisplay(this.players.size + 1);
        this.updatePlayerNamesDisplay();
    }
    
    /**
     * Remove player
     */
    removePlayer(playerId) {
        console.log('🌐 Player left:', playerId);
        this.players.delete(playerId);
        this.removeOtherPlayerMarker(playerId);
        try {
            const now = Date.now();
            if (now - this._lastLeaveSoundAt > 3000 && window.soundManager?.playNotification) {
                this._lastLeaveSoundAt = now;
                window.soundManager.playNotification();
            }
        } catch (_) {}

        // Update subtle player count (self + others we know)
        this.updatePlayerCountDisplay(this.players.size + 1);
        this.updatePlayerNamesDisplay();
    }
    
    /**
     * Render other player on map
     */
    renderOtherPlayer(playerId, playerData) {
        if (!window.mapEngine) return;
        
        const position = playerData?.position;
        if (!position) return;
        const markerConfig = playerData?.markerConfig || (window.mapEngine.getPlayerMarkerConfig ? window.mapEngine.getPlayerMarkerConfig() : {});
        const profile = playerData?.profile || {};
        
        // Check if player is within sync radius
        const distance = this.calculateDistance(
            window.mapEngine.playerPosition,
            position
        );
        
        // Relax filtering: render regardless of radius so fresh sessions see others immediately
        
        // Use map engine to add player marker
        window.mapEngine.addOtherPlayerMarker(playerId, { ...playerData, profile });

        // Update subtle player count (self + others we know)
        this.updatePlayerCountDisplay(this.players.size + 1);
    }
    
    /**
     * Remove other player marker
     */
    removeOtherPlayerMarker(playerId) {
        if (!window.mapEngine) return;
        window.mapEngine.removeOtherPlayerMarker(playerId);
    }
    
    /**
     * Calculate distance between two positions in meters
     */
    calculateDistance(pos1, pos2) {
        if (!window.mapEngine) return Infinity;
        return window.mapEngine.calculateDistance(pos1, pos2);
    }
    
    /**
     * Update flag data
     */
    updateFlag(flagId, flagData) {
        // Sync flag with other players by adding to canvas layer
        try {
            if (window.mapEngine && window.mapEngine.finnishFlagLayer && flagData) {
                const { lat, lng, size, rotation, symbol, ownerId, timestamp } = flagData;
                // Apply without re-replicating, and persist locally for offline
                window.mapEngine.finnishFlagLayer.addFlagPin(lat, lng, size, rotation, symbol, ownerId, true, timestamp);
                console.log('🌐 Flag update applied:', flagId, flagData);
            } else {
                console.log('🌐 Flag update received but layer unavailable');
            }
        } catch (e) {
            console.warn('🌐 Failed to apply flag update:', e);
        }
    }
    
    /**
     * Send message to server
     */
    sendMessage(message) {
        if (this.isConnected && this.websocket) {
            this.websocket.send(JSON.stringify(message));
        }
    }
    
    /**
     * Attempt to reconnect
     */
    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('🌐 Max reconnection attempts reached');
            return;
        }
        
        this.reconnectAttempts++;
        console.log(`🌐 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
        
        setTimeout(() => {
            this.connect().catch(() => {
                // Reconnection failed, will try again
            });
        }, this.reconnectDelay * this.reconnectAttempts);
    }
    
    /**
     * Clean up old players (remove if not seen for 30 seconds)
     */
    cleanupOldPlayers() {
        const now = Date.now();
        const maxAge = 30000; // 30 seconds
        
        for (const [playerId, playerData] of this.players.entries()) {
            if (now - playerData.lastSeen > maxAge) {
                this.removePlayer(playerId);
            }
        }
    }
    
    /**
     * Get nearby players count
     */
    getNearbyPlayersCount() {
        if (!window.mapEngine || !window.mapEngine.playerPosition) return 0;
        
        let count = 0;
        for (const [playerId, playerData] of this.players.entries()) {
            if (playerData.position) {
                const distance = this.calculateDistance(
                    window.mapEngine.playerPosition,
                    playerData.position
                );
                if (distance <= this.syncRadius) {
                    count++;
                }
            }
        }
        return count;
    }
    
    /**
     * Disconnect and cleanup
     */
    disconnect() {
        if (this.positionUpdateInterval) {
            clearInterval(this.positionUpdateInterval);
            this.positionUpdateInterval = null;
        }
        
        if (this.websocket) {
            this.websocket.close();
            this.websocket = null;
        }
        
        this.isConnected = false;
        this.players.clear();
        
        // Remove all other player markers
        if (window.mapEngine && window.mapEngine.otherPlayerMarkers) {
            for (const playerId of window.mapEngine.otherPlayerMarkers.keys()) {
                window.mapEngine.removeOtherPlayerMarker(playerId);
            }
        }
        
        console.log('🌐 Multiplayer disconnected');

        // Reflect zero/one player state (just self disconnected)
        this.updatePlayerCountDisplay(1);
    }

    /**
     * Update subtle online player count in UI
     */
    updatePlayerCountDisplay(totalCount) {
        try {
            const countEl = document.getElementById('player-count');
            if (countEl) {
                countEl.textContent = String(totalCount);
            }
            const statusText = document.getElementById('multiplayerStatusText');
            if (statusText) {
                // Keep it subtle: "Connected (N)" or "Disconnected"
                const connectedLabel = this.isConnected ? `Connected (${totalCount})` : 'Disconnected';
                statusText.textContent = connectedLabel;
            }
        } catch (_) {
            // no-op
        }
    }

    /**
     * Update the list of connected player names beneath the count
     */
    updatePlayerNamesDisplay() {
        try {
            const namesEl = document.getElementById('player-names');
            if (!namesEl) return;

            // Current player name
            let myName = 'You';
            try {
                const prof = window.sessionPersistence?.restoreProfile?.();
                if (prof?.name) myName = prof.name;
            } catch (_) {}

            const names = [myName];
            for (const [pid, pdata] of this.players.entries()) {
                const n = pdata?.profile?.name || 'Explorer';
                names.push(n);
            }
            // Limit length; show first few then +N
            const maxShown = 4;
            const shown = names.slice(0, maxShown);
            const extra = names.length - shown.length;
            namesEl.textContent = extra > 0 ? `${shown.join(', ')} +${extra}` : shown.join(', ');
        } catch (_) {}
    }
}

// Export for global access
window.MultiplayerManager = MultiplayerManager;
