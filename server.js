/**
 * Eldritch Sanctuary WebSocket Server
 * Handles real-time multiplayer communication for cosmic exploration
 */

const WebSocket = require('ws');
const express = require('express');
const cors = require('cors');
const path = require('path');

class EldritchSanctuaryServer {
    constructor() {
        this.app = express();
        this.server = null;
        this.wss = null;
        this.players = new Map();
        this.investigations = new Map();
        this.port = process.env.PORT || 3000;
    }

    init() {
        this.setupExpress();
        this.startServer();
        this.setupWebSocket();
    }

    setupExpress() {
        // Enable CORS for all routes
        this.app.use(cors());
        
        // Serve static files
        this.app.use(express.static(path.join(__dirname)));
        
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                players: this.players.size,
                investigations: this.investigations.size,
                timestamp: Date.now()
            });
        });

        // API endpoints
        this.app.get('/api/players', (req, res) => {
            res.json(Array.from(this.players.values()));
        });

        this.app.get('/api/investigations', (req, res) => {
            res.json(Array.from(this.investigations.values()));
        });

        // Serve main page
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }

    setupWebSocket() {
        if (!this.server) {
            console.error('HTTP server not initialized. Cannot setup WebSocket.');
            return;
        }
        
        this.wss = new WebSocket.Server({ 
            server: this.server,
            path: '/ws'
        });

        this.wss.on('connection', (ws, req) => {
            console.log('🌐 New WebSocket connection');
            
            const playerId = this.generatePlayerId();
            const player = {
                id: playerId,
                name: 'Cosmic Explorer',
                position: null,
                investigation: null,
                connectedAt: Date.now(),
                lastSeen: Date.now()
            };

            this.players.set(playerId, player);
            ws.playerId = playerId;

            // Send welcome message and current player count
            this.sendToClient(ws, {
                type: 'playerCount',
                payload: { count: this.players.size }
            });

            // Notify the connecting client about currently online players (snapshot)
            const playersSnapshot = Array.from(this.players.entries()).filter(([id]) => id !== playerId).map(([id, p]) => ({
                playerId: id,
                playerData: {
                    position: p.position,
                    profile: { name: p.name },
                    timestamp: p.lastSeen || Date.now()
                }
            }));
            this.sendToClient(ws, { type: 'players_snapshot', payload: playersSnapshot });

            // Notify other players and update count (use snake_case for client compatibility)
            this.broadcastToOthers(playerId, {
                type: 'player_join',
                playerId: player.id,
                playerData: {
                    position: player.position,
                    profile: { name: player.name },
                    timestamp: player.lastSeen
                }
            });
            this.broadcastToAll({ type: 'playerCount', payload: { count: this.players.size } });

            // Handle incoming messages
            ws.on('message', (data) => {
                try {
                    const message = JSON.parse(data);
                    this.handleMessage(ws, message);
                } catch (error) {
                    console.error('Invalid message received:', error);
                }
            });

            // Handle disconnection
            ws.on('close', () => {
                console.log(`🌐 Player ${playerId} disconnected`);
                this.handlePlayerDisconnect(playerId);
            });

            // Handle errors
            ws.on('error', (error) => {
                console.error(`WebSocket error for player ${playerId}:`, error);
            });
        });
    }

    handleMessage(ws, message) {
        const playerId = ws.playerId;
        const player = this.players.get(playerId);

        if (!player) return;

        // Rate limiting
        if (!this.checkRateLimit(playerId)) {
            console.log(`Rate limit exceeded for player ${playerId}`);
            return;
        }

        switch (message.type) {
            case 'playerJoin':
                this.handlePlayerJoin(ws, message.payload);
                break;
            case 'player_join': {
                // Normalize to legacy handler and broadcast
                const data = message.playerData || {};
                const player = this.players.get(ws.playerId);
                if (player) {
                    player.name = (data.profile && data.profile.name) || player.name;
                    player.position = data.position || player.position;
                    player.lastSeen = Date.now();
                }
                this.broadcastToOthers(ws.playerId, {
                    type: 'player_join',
                    playerId: ws.playerId,
                    playerData: data
                });
                this.broadcastToAll({ type: 'playerCount', payload: { count: this.players.size } });
                break;
            }
            case 'player_update': {
                // Relay player state to others
                this.broadcastToOthers(ws.playerId, {
                    type: 'player_update',
                    playerId: message.playerId,
                    playerData: message.playerData
                });
                break;
            }
                
            case 'positionUpdate':
                this.handlePositionUpdate(ws, message.payload);
                break;
                
            case 'investigationStart':
                this.handleInvestigationStart(ws, message.payload);
                break;
                
            case 'investigationComplete':
                this.handleInvestigationComplete(ws, message.payload);
                break;
                
            case 'zoneEntry':
                this.handleZoneEntry(ws, message.payload);
                break;
            case 'flag_update': {
                // Broadcast flag update to everyone except sender
                this.broadcastToOthers(ws.playerId, {
                    type: 'flag_update',
                    flagId: message.flagId,
                    flagData: message.flagData
                });
                break;
            }
            case 'request_flags': {
                // Ask everyone except requester to re-broadcast their flags
                this.broadcastToOthers(ws.playerId, {
                    type: 'request_flags',
                    requesterId: ws.playerId,
                    timestamp: Date.now()
                });
                break;
            }
                
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handlePlayerJoin(ws, payload) {
        const player = this.players.get(ws.playerId);
        if (player) {
            player.name = payload.name || 'Cosmic Explorer';
            player.lastSeen = Date.now();
            
            // Broadcast to all players
            this.broadcastToAll({
                type: 'playerJoin',
                payload: {
                    playerId: player.id,
                    name: player.name,
                    timestamp: Date.now()
                }
            });
        }
    }

    handlePositionUpdate(ws, payload) {
        const player = this.players.get(ws.playerId);
        if (player) {
            player.position = payload.position;
            player.lastSeen = Date.now();
            
            // Broadcast to other players
            this.broadcastToOthers(ws.playerId, {
                type: 'positionUpdate',
                payload: {
                    playerId: player.id,
                    position: payload.position,
                    timestamp: Date.now()
                }
            });
        }
    }

    handleInvestigationStart(ws, payload) {
        const player = this.players.get(ws.playerId);
        if (player) {
            player.investigation = payload.investigation;
            player.lastSeen = Date.now();
            
            // Store investigation
            this.investigations.set(payload.investigation.id, {
                ...payload.investigation,
                playerId: player.id,
                startTime: Date.now()
            });
            
            // Broadcast to other players
            this.broadcastToOthers(ws.playerId, {
                type: 'investigationStart',
                payload: {
                    playerId: player.id,
                    investigation: payload.investigation,
                    timestamp: Date.now()
                }
            });
        }
    }

    handleInvestigationComplete(ws, payload) {
        const player = this.players.get(ws.playerId);
        if (player) {
            player.investigation = null;
            player.lastSeen = Date.now();
            
            // Remove investigation
            this.investigations.delete(payload.investigation.id);
            
            // Broadcast to other players
            this.broadcastToOthers(ws.playerId, {
                type: 'investigationComplete',
                payload: {
                    playerId: player.id,
                    investigation: payload.investigation,
                    timestamp: Date.now()
                }
            });
        }
    }

    handleZoneEntry(ws, payload) {
        const player = this.players.get(ws.playerId);
        if (player) {
            player.lastSeen = Date.now();
            
            // Broadcast to other players
            this.broadcastToOthers(ws.playerId, {
                type: 'zoneEntry',
                payload: {
                    playerId: player.id,
                    zoneType: payload.zoneType,
                    timestamp: Date.now()
                }
            });
        }
    }

    handlePlayerDisconnect(playerId) {
        const player = this.players.get(playerId);
        if (player) {
            // Remove player's investigation
            if (player.investigation) {
                this.investigations.delete(player.investigation.id);
            }
            
            // Remove player
            this.players.delete(playerId);
            
            // Notify other players
            this.broadcastToAll({
                type: 'playerLeave',
                payload: {
                    playerId: playerId,
                    timestamp: Date.now()
                }
            });
            
            // Update player count
            this.broadcastToAll({
                type: 'playerCount',
                payload: { count: this.players.size }
            });
        }
    }

    checkRateLimit(playerId) {
        const player = this.players.get(playerId);
        if (!player) return false;

        const now = Date.now();
        const timeWindow = 1000; // 1 second
        const maxMessages = 10; // Max 10 messages per second

        if (!player.messageHistory) {
            player.messageHistory = [];
        }

        // Remove old messages outside time window
        player.messageHistory = player.messageHistory.filter(
            timestamp => now - timestamp < timeWindow
        );

        // Check if under rate limit
        if (player.messageHistory.length >= maxMessages) {
            return false;
        }

        // Add current message timestamp
        player.messageHistory.push(now);
        return true;
    }

    sendToClient(ws, message) {
        if (ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(message));
            } catch (error) {
                console.error('Failed to send message to client:', error);
            }
        }
    }

    broadcastToAll(message) {
        this.wss.clients.forEach(ws => {
            this.sendToClient(ws, message);
        });
    }

    broadcastToOthers(excludePlayerId, message) {
        this.wss.clients.forEach(ws => {
            if (ws.playerId !== excludePlayerId) {
                this.sendToClient(ws, message);
            }
        });
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    startServer() {
        this.server = this.app.listen(this.port, () => {
            console.log(`🌌 Eldritch Sanctuary server running on port ${this.port}`);
            console.log(`🌐 WebSocket server ready for cosmic exploration`);
            console.log(`📱 Open http://localhost:${this.port} to begin your journey`);
        });
    }

    // Cleanup
    shutdown() {
        console.log('🌌 Shutting down Eldritch Sanctuary server...');
        
        if (this.wss) {
            this.wss.close();
        }
        
        if (this.server) {
            this.server.close();
        }
        
        this.players.clear();
        this.investigations.clear();
    }
}

// Create and start server
const server = new EldritchSanctuaryServer();
server.init();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🌌 Received SIGINT, shutting down gracefully...');
    server.shutdown();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🌌 Received SIGTERM, shutting down gracefully...');
    server.shutdown();
    process.exit(0);
});

module.exports = EldritchSanctuaryServer;
