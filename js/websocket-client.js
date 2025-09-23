/**
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
        this.playerId = this.generatePlayerId();
        this.otherPlayers = new Map();
        this.onConnectionChange = null;
        this.onPlayerUpdate = null;
        this.onInvestigationUpdate = null;
    }

    init() {
        this.setupUI();
        this.connect();
        console.log('🌐 WebSocket client initialized');
    }

    setupUI() {
        // Connection status will be updated by updateConnectionStatus()
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const port = window.location.port || (protocol === 'wss:' ? '443' : '80');
        const wsUrl = `${protocol}//${host}:${port}/ws`;
        console.log('🌐 WebSocketClient connecting to:', wsUrl);

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
            console.log('🌐 WebSocket connected');
            this.isConnected = true;
            this.reconnectAttempts = 0;
            this.reconnectDelay = 1000;
            this.updateConnectionStatus('connected');
            
            // Hand off to MultiplayerManager if present to avoid double-announcements
            if (!window.multiplayerManager) {
                // Send initial player data (legacy schema)
                this.sendPlayerJoin();
            }
            
            if (this.onConnectionChange) {
                this.onConnectionChange(true);
            }
        };

        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                this.handleMessage(message);
            } catch (error) {
                console.error('Failed to parse WebSocket message:', error);
            }
        };

        this.socket.onclose = (event) => {
            console.log('🌐 WebSocket disconnected:', event.code, event.reason);
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
            console.error('🌐 WebSocket error:', error);
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

            case 'investigationStart':
                this.handleInvestigationStart(message.payload);
                break;
                
            case 'investigationComplete':
                this.handleInvestigationComplete(message.payload);
                break;
                
            case 'zoneEntry':
                this.handleZoneEntry(message.payload);
                break;
                
            default:
                console.log('Unknown message type:', message.type);
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
            
            console.log(`👤 Player joined: ${payload.name || payload.playerId}`);

            // UI/list rendering handled by MultiplayerManager; do not mutate DOM here
        }
    }

    handlePlayerLeave(payload) {
        this.otherPlayers.delete(payload.playerId);
        console.log(`👤 Player left: ${payload.playerId}`);
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
                console.log(`🔍 Player started investigation: ${payload.investigation.name}`);
            }
        }
    }

    handleInvestigationComplete(payload) {
        if (payload.playerId !== this.playerId) {
            const player = this.otherPlayers.get(payload.playerId);
            if (player) {
                player.investigation = null;
                console.log(`🎉 Player completed investigation: ${payload.investigation.name}`);
            }
        }
    }

    handleZoneEntry(payload) {
        console.log(`🌙 Player entered zone: ${payload.zoneType}`);
        
        if (this.onInvestigationUpdate) {
            this.onInvestigationUpdate(payload);
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
            console.log('🌐 Max reconnection attempts reached');
            this.updateConnectionStatus('error');
            return;
        }

        this.reconnectAttempts++;
        this.reconnectDelay = Math.min(this.reconnectDelay * 2, 30000); // Max 30 seconds
        
        console.log(`🌐 Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${this.reconnectDelay}ms`);
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
