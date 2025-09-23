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
        
        // WebSocket server URL (placeholder - would be configured in production)
        this.serverUrl = 'wss://eldritch-sanctuary.herokuapp.com/ws';
        
        // Fallback to localhost for development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            this.serverUrl = 'ws://localhost:8080/ws';
        }
        
        console.log('🌐 MultiplayerManager initialized');
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
                this.websocket = new WebSocket(this.serverUrl);
                
                this.websocket.onopen = () => {
                    console.log('🌐 WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    
                    // Send initial player data
                    this.sendPlayerData();
                    resolve();
                };
                
                this.websocket.onmessage = (event) => {
                    this.handleMessage(JSON.parse(event.data));
                };
                
                this.websocket.onclose = () => {
                    console.log('🌐 WebSocket disconnected');
                    this.isConnected = false;
                    this.attemptReconnect();
                };
                
                this.websocket.onerror = (error) => {
                    console.error('🌐 WebSocket error:', error);
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
     * Handle incoming WebSocket messages
     */
    handleMessage(data) {
        switch (data.type) {
            case 'player_update':
                this.updatePlayer(data.playerId, data.playerData);
                break;
            case 'player_join':
                this.addPlayer(data.playerId, data.playerData);
                break;
            case 'player_leave':
                this.removePlayer(data.playerId);
                break;
            case 'flag_update':
                this.updateFlag(data.flagId, data.flagData);
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
        
        return {
            position: {
                lat: mapEngine.playerPosition.lat,
                lng: mapEngine.playerPosition.lng
            },
            markerConfig: mapEngine.getPlayerMarkerConfig(),
            steps: window.stepCurrencySystem ? window.stepCurrencySystem.totalSteps : 0,
            timestamp: Date.now()
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
                if (currentPos && this.hasPositionChanged(currentPos)) {
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
        
        this.players.set(playerId, {
            ...playerData,
            lastSeen: Date.now()
        });
        
        this.renderOtherPlayer(playerId, playerData);
    }
    
    /**
     * Add new player
     */
    addPlayer(playerId, playerData) {
        console.log('🌐 Player joined:', playerId);
        this.players.set(playerId, {
            ...playerData,
            lastSeen: Date.now()
        });
        
        this.renderOtherPlayer(playerId, playerData);
        
        // Show notification
        if (window.gruesomeNotifications) {
            window.gruesomeNotifications.showNotification(
                `Another player has joined the sanctuary!`,
                'info'
            );
        }
    }
    
    /**
     * Remove player
     */
    removePlayer(playerId) {
        console.log('🌐 Player left:', playerId);
        this.players.delete(playerId);
        this.removeOtherPlayerMarker(playerId);
    }
    
    /**
     * Render other player on map
     */
    renderOtherPlayer(playerId, playerData) {
        if (!window.mapEngine) return;
        
        const { position, markerConfig } = playerData;
        if (!position || !markerConfig) return;
        
        // Check if player is within sync radius
        const distance = this.calculateDistance(
            window.mapEngine.playerPosition,
            position
        );
        
        if (distance > this.syncRadius) {
            this.removeOtherPlayerMarker(playerId);
            return;
        }
        
        // Use map engine to add player marker
        window.mapEngine.addOtherPlayerMarker(playerId, playerData);
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
                const { lat, lng, size, rotation } = flagData;
                window.mapEngine.finnishFlagLayer.addFlagPin(lat, lng, size, rotation);
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
    }
}

// Export for global access
window.MultiplayerManager = MultiplayerManager;
