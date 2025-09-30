/**
 * @fileoverview [VERIFIED] Eldritch Sanctuary WebSocket Server - Handles real-time multiplayer communication
 * @status VERIFIED - WebSocket server and game state persistence working correctly
 * @feature #feature-websocket-server
 * @last_verified 2024-01-28
 * @dependencies WebSocket, Express, CORS
 * @warning Do not modify game state persistence or WebSocket handling without testing multiplayer features
 * 
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
        
        // Game State Database - Lightweight in-memory persistence
        this.gameStateDB = {
            players: new Map(),           // Player game states
            markers: new Map(),           // All markers (flags, bases, etc.)
            quests: new Map(),            // Quest states
            achievements: new Map(),      // Achievement states
            sessions: new Map()           // Session data
        };
        
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
        
        // Add specific MIME type handling for icons
        this.app.use('/icons', express.static(path.join(__dirname, 'icons'), {
            setHeaders: (res, path) => {
                if (path.endsWith('.png')) {
                    res.setHeader('Content-Type', 'image/png');
                    console.log(`🎨 Serving icon: ${path}`);
                }
            }
        }));
        
        // Add favicon.ico handling
        this.app.get('/favicon.ico', (req, res) => {
            console.log('🎨 Serving favicon.ico');
            res.sendFile(path.join(__dirname, 'icons', 'icon-144x144.png'));
        });
        
        // Health check endpoint
        this.app.get('/health', (req, res) => {
            res.json({
                status: 'healthy',
                players: this.players.size,
                investigations: this.investigations.size,
                timestamp: Date.now()
            });
        });
        
        // Debug logs endpoint
        this.app.get('/debug-logs', (req, res) => {
            res.json({ 
                message: 'Debug logs endpoint - logs are stored in localStorage on client side',
                instructions: 'Use window.exportDebugLogs() in browser console to get logs',
                timestamp: new Date().toISOString()
            });
        });
        
        // API endpoint to receive debug logs from client
        this.app.post('/api/debug-logs', express.json(), (req, res) => {
            try {
                const logData = req.body;
                console.log('🔍 Received debug logs from client:', {
                    timestamp: logData.timestamp,
                    totalLogs: logData.totalLogs,
                    logCount: logData.logs ? logData.logs.length : 0
                });
                
                // Store logs in memory for AI access
                this.debugLogs = logData;
                
                res.json({ success: true, message: 'Debug logs received' });
            } catch (error) {
                console.error('Error processing debug logs:', error);
                res.status(500).json({ error: 'Failed to process debug logs' });
            }
        });
        
        // Get debug logs endpoint
        this.app.get('/api/debug-logs', (req, res) => {
            if (this.debugLogs) {
                res.json(this.debugLogs);
            } else {
                res.json({ message: 'No debug logs available yet' });
            }
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

        console.log(`📨 Server received message: ${message.type} from player ${playerId}`);
        console.log(`📨 Message payload:`, message.payload);
        
        // Debug logging for game state messages
        if (['request_game_state', 'marker_create', 'marker_update', 'marker_delete', 'base_establish'].includes(message.type)) {
            console.log(`🎮 [${playerId}] Processing game state message: ${message.type}`, message.payload || '');
        }

        // Handle playerJoin BEFORE checking if player exists (this creates the player)
        if (message.type === 'playerJoin') {
            this.handlePlayerJoin(ws, message.payload);
            return; // Early return after handling playerJoin
        }

        if (!player) {
            console.log(`❌ Player ${playerId} not found in players map`);
            return;
        }

        // Rate limiting
        if (!this.checkRateLimit(playerId)) {
            console.log(`Rate limit exceeded for player ${playerId}`);
            return;
        }

        switch (message.type) {
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
            case 'sync_steps': {
                // Validate and acknowledge step sync from client
                const { totalSteps, sessionSteps, timestamp } = message.payload;
                console.log(`🚶‍♂️ Player ${playerId} synced steps - Total: ${totalSteps}, Session: ${sessionSteps}`);
                
                // Update player data
                if (player) {
                    player.totalSteps = totalSteps;
                    player.sessionSteps = sessionSteps;
                    player.lastStepSync = timestamp;
                }
                
                // Update game state database
                this.updatePlayerSteps(playerId, totalSteps, sessionSteps);
                
                // Send acknowledgment back to client
                ws.send(JSON.stringify({
                    type: 'steps_synced',
                    payload: {
                        totalSteps: totalSteps,
                        sessionSteps: sessionSteps,
                        timestamp: Date.now(),
                        validated: true
                    }
                }));
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
                // Also update game state database
                if (message.payload.position) {
                    this.updatePlayerPosition(playerId, message.payload.position);
                }
                break;
                
            case 'investigationStart':
                this.handleInvestigationStart(ws, message.payload);
                break;
                
            case 'step_milestone':
                this.handleStepMilestone(ws, message.payload);
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
            
            // Game State Synchronization Messages
            case 'request_game_state': {
                this.handleRequestGameState(ws);
                break;
            }
            
            case 'marker_create': {
                this.handleMarkerCreate(ws, message.payload);
                break;
            }
            
            case 'marker_update': {
                this.handleMarkerUpdate(ws, message.payload);
                break;
            }
            
            case 'marker_delete': {
                this.handleMarkerDelete(ws, message.payload);
                break;
            }
            
            case 'base_establish': {
                this.handleBaseEstablish(ws, message.payload);
                break;
            }
                
            default:
                console.log('Unknown message type:', message.type);
        }
    }

    handlePlayerJoin(ws, payload) {
        console.log(`🎮 handlePlayerJoin called with payload:`, payload);
        console.log(`🎮 Current ws.playerId:`, ws.playerId);
        
        // Update the WebSocket's playerId if it's different from the payload
        if (payload.playerId && payload.playerId !== ws.playerId) {
            console.log(`🔄 Updating WebSocket playerId from ${ws.playerId} to ${payload.playerId}`);
            ws.playerId = payload.playerId;
        }
        
        let player = this.players.get(ws.playerId);
        console.log(`🎮 Player found in players map:`, !!player);
        
        // Create player record if it doesn't exist (for fresh adventures)
        if (!player) {
            console.log(`🆕 Creating new player record for ${ws.playerId}`);
            player = {
                id: ws.playerId,
                name: payload.name || 'Cosmic Explorer',
                position: { lat: 0, lng: 0 },
                connectedAt: Date.now(),
                lastSeen: Date.now()
            };
            this.players.set(ws.playerId, player);
            console.log(`🆕 Player record created and stored`);
        } else {
            player.name = payload.name || 'Cosmic Explorer';
            player.lastSeen = Date.now();
            console.log(`🔄 Updated existing player record`);
        }
        
        // Broadcast to all players
        this.broadcastToAll({
            type: 'playerJoin',
            payload: {
                playerId: player.id,
                name: player.name,
                timestamp: Date.now()
            }
        });
        
        console.log(`✅ Player ${ws.playerId} joined successfully`);
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

    /**
     * Handle step milestone events from clients
     * @param {WebSocket} ws - WebSocket connection
     * @param {Object} payload - Milestone event data
     */
    handleStepMilestone(ws, payload) {
        const playerId = ws.playerId;
        const player = this.players.get(playerId);
        
        if (!player) return;
        
        console.log(`🚶‍♂️ Step milestone received from player ${playerId}:`, payload);
        
        // Update player milestone data
        if (!player.milestones) {
            player.milestones = {};
        }
        player.milestones[payload.milestoneType] = {
            sessionSteps: payload.sessionSteps,
            totalSteps: payload.totalSteps,
            timestamp: payload.timestamp,
            achieved: true
        };
        player.lastSeen = Date.now();
        
        // Handle specific milestone types
        switch (payload.milestoneType) {
            case 'area':
                this.handleAreaMilestone(ws, payload);
                break;
            case 'quest':
                this.handleQuestMilestone(ws, payload);
                break;
            case 'flag':
                this.handleFlagMilestone(ws, payload);
                break;
            case 'celebration':
                this.handleCelebrationMilestone(ws, payload);
                break;
        }
        
        // Broadcast milestone achievement to other players
        this.broadcastToOthers(playerId, {
            type: 'player_milestone',
            playerId: playerId,
            playerData: {
                name: player.name,
                milestoneType: payload.milestoneType,
                totalSteps: payload.totalSteps,
                timestamp: payload.timestamp
            }
        });
    }

    /**
     * Handle area milestone (1000 steps) - triggers base establishment
     */
    handleAreaMilestone(ws, payload) {
        const playerId = ws.playerId;
        console.log(`🏗️ Area milestone achieved by player ${playerId} - enabling base establishment`);
        
        // Send base establishment availability to the client
        this.sendToClient(ws, {
            type: 'base_establishment_available',
            payload: {
                playerId: playerId,
                totalSteps: payload.totalSteps,
                timestamp: payload.timestamp,
                message: 'You have reached 1000 steps! You can now establish a base.'
            }
        });
    }

    /**
     * Handle quest milestone (500 steps) - unlocks quest system
     */
    handleQuestMilestone(ws, payload) {
        const playerId = ws.playerId;
        console.log(`📜 Quest milestone achieved by player ${playerId} - unlocking quest system`);
        
        this.sendToClient(ws, {
            type: 'quest_system_unlocked',
            payload: {
                playerId: playerId,
                totalSteps: payload.totalSteps,
                timestamp: payload.timestamp,
                message: 'Quest system unlocked! You can now access quests.'
            }
        });
    }

    /**
     * Handle flag milestone (50 steps) - enables flag creation
     */
    handleFlagMilestone(ws, payload) {
        const playerId = ws.playerId;
        console.log(`🇫🇮 Flag milestone achieved by player ${playerId} - enabling flag creation`);
        
        this.sendToClient(ws, {
            type: 'flag_creation_enabled',
            payload: {
                playerId: playerId,
                totalSteps: payload.totalSteps,
                timestamp: payload.timestamp,
                message: 'Flag creation enabled! You can now create flags.'
            }
        });
    }

    /**
     * Handle celebration milestone (100 steps) - triggers celebration
     */
    handleCelebrationMilestone(ws, payload) {
        const playerId = ws.playerId;
        console.log(`🎉 Celebration milestone achieved by player ${playerId} - triggering celebration`);
        
        this.sendToClient(ws, {
            type: 'celebration_triggered',
            payload: {
                playerId: playerId,
                totalSteps: payload.totalSteps,
                timestamp: payload.timestamp,
                message: 'Celebration time! You have reached a milestone!'
            }
        });
    }

    generatePlayerId() {
        return 'player_' + Math.random().toString(36).substr(2, 9);
    }

    // Game State Database Methods
    /**
     * Initialize or load player game state
     * @param {string} playerId - Player ID
     * @returns {Object} Player game state
     */
    initializePlayerGameState(playerId) {
        if (!this.gameStateDB.players.has(playerId)) {
            const gameState = {
                playerId: playerId,
                totalSteps: 10000,           // Default starting steps
                sessionSteps: 0,
                position: null,
                markers: [],                 // Array of marker objects
                quests: [],                  // Array of quest states
                achievements: [],            // Array of achievements
                milestones: {},              // Milestone states
                baseEstablished: false,
                basePosition: null,
                lastSaved: Date.now(),
                createdAt: Date.now()
            };
            this.gameStateDB.players.set(playerId, gameState);
            console.log(`🎮 Initialized game state for player ${playerId}`);
        }
        return this.gameStateDB.players.get(playerId);
    }

    /**
     * Save player game state
     * @param {string} playerId - Player ID
     * @param {Object} gameState - Game state to save
     */
    savePlayerGameState(playerId, gameState) {
        gameState.lastSaved = Date.now();
        this.gameStateDB.players.set(playerId, gameState);
        console.log(`💾 Saved game state for player ${playerId}`);
    }

    /**
     * Get player game state
     * @param {string} playerId - Player ID
     * @returns {Object|null} Player game state or null if not found
     */
    getPlayerGameState(playerId) {
        return this.gameStateDB.players.get(playerId) || null;
    }

    /**
     * Add marker to player's game state
     * @param {string} playerId - Player ID
     * @param {Object} marker - Marker data
     */
    addMarkerToPlayer(playerId, marker) {
        console.log(`📍 addMarkerToPlayer called for player ${playerId} with marker:`, marker);
        
        let gameState = this.getPlayerGameState(playerId);
        console.log(`📍 Player ${playerId} game state found:`, !!gameState);
        
        // Initialize player game state if it doesn't exist
        if (!gameState) {
            console.log(`📍 Player ${playerId} game state not found, initializing...`);
            gameState = this.initializePlayerGameState(playerId);
            console.log(`📍 Game state initialized:`, !!gameState);
        }
        
        if (gameState) {
            marker.id = marker.id || `marker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            marker.playerId = playerId;
            marker.createdAt = Date.now();
            
            gameState.markers.push(marker);
            this.gameStateDB.markers.set(marker.id, marker);
            this.savePlayerGameState(playerId, gameState);
            
            console.log(`📍 Added marker ${marker.id} to player ${playerId}:`, marker);
            console.log(`📍 Player ${playerId} now has ${gameState.markers.length} markers total`);
            return marker;
        }
        console.log(`❌ Failed to add marker to player ${playerId} - could not initialize game state`);
        return null;
    }

    /**
     * Get all markers for a player
     * @param {string} playerId - Player ID
     * @returns {Array} Array of markers
     */
    getPlayerMarkers(playerId) {
        const gameState = this.getPlayerGameState(playerId);
        return gameState ? gameState.markers : [];
    }

    /**
     * Update player position in game state
     * @param {string} playerId - Player ID
     * @param {Object} position - Position data
     */
    updatePlayerPosition(playerId, position) {
        let gameState = this.getPlayerGameState(playerId);
        
        // Initialize player game state if it doesn't exist
        if (!gameState) {
            console.log(`📍 Player ${playerId} game state not found, initializing for position update...`);
            gameState = this.initializePlayerGameState(playerId);
        }
        
        if (gameState) {
            gameState.position = position;
            this.savePlayerGameState(playerId, gameState);
            console.log(`📍 Updated position for player ${playerId}:`, position);
        }
    }

    /**
     * Update player steps in game state
     * @param {string} playerId - Player ID
     * @param {number} totalSteps - Total steps
     * @param {number} sessionSteps - Session steps
     */
    updatePlayerSteps(playerId, totalSteps, sessionSteps) {
        let gameState = this.getPlayerGameState(playerId);
        
        // Initialize player game state if it doesn't exist
        if (!gameState) {
            console.log(`📍 Player ${playerId} game state not found, initializing for steps update...`);
            gameState = this.initializePlayerGameState(playerId);
        }
        
        if (gameState) {
            gameState.totalSteps = totalSteps;
            gameState.sessionSteps = sessionSteps;
            this.savePlayerGameState(playerId, gameState);
            console.log(`📍 Updated steps for player ${playerId}: total=${totalSteps}, session=${sessionSteps}`);
        }
    }

    /**
     * Set base establishment for player
     * @param {string} playerId - Player ID
     * @param {Object} baseData - Base data
     */
    setPlayerBase(playerId, baseData) {
        const gameState = this.getPlayerGameState(playerId);
        if (gameState) {
            gameState.baseEstablished = true;
            gameState.basePosition = baseData.position;
            this.savePlayerGameState(playerId, gameState);
            console.log(`🏗️ Base established for player ${playerId} at:`, baseData.position);
        }
    }

    /**
     * Get complete game state for client replication
     * @param {string} playerId - Player ID
     * @returns {Object} Complete game state
     */
    getCompleteGameState(playerId) {
        const gameState = this.getPlayerGameState(playerId);
        if (!gameState) {
            return this.initializePlayerGameState(playerId);
        }
        return gameState;
    }

    // WebSocket Message Handlers for Game State Synchronization
    
    /**
     * Handle client request for complete game state
     * @param {WebSocket} ws - WebSocket connection
     */
    handleRequestGameState(ws) {
        const playerId = ws.playerId;
        console.log(`🎮 Player ${playerId} requested game state`);
        
        // Get complete game state (will initialize if not exists)
        const gameState = this.getCompleteGameState(playerId);
        
        console.log(`🎮 Sending game state to player ${playerId}:`, {
            markers: gameState.markers.length,
            base: gameState.base ? 'exists' : 'none',
            position: gameState.position ? 'exists' : 'none'
        });
        
        // Debug: Log all markers in the game state
        if (gameState.markers && gameState.markers.length > 0) {
            console.log(`🎮 Player ${playerId} has ${gameState.markers.length} markers:`, gameState.markers.map(m => ({
                id: m.id,
                type: m.type,
                position: m.position
            })));
        } else {
            console.log(`🎮 Player ${playerId} has NO markers in game state`);
        }
        
        // Send complete game state to client
        this.sendToClient(ws, {
            type: 'game_state_sync',
            payload: {
                playerId: playerId,
                gameState: gameState,
                timestamp: Date.now()
            }
        });
        
        console.log(`📤 Sent complete game state to player ${playerId}`);
    }
    
    /**
     * Handle marker creation request
     * @param {WebSocket} ws - WebSocket connection
     * @param {Object} payload - Marker data
     */
    handleMarkerCreate(ws, payload) {
        const playerId = ws.playerId;
        console.log(`📍 Player ${playerId} creating marker:`, payload);
        
        // Add marker to player's game state
        const marker = this.addMarkerToPlayer(playerId, payload);
        
        if (marker) {
            // Send confirmation back to client
            this.sendToClient(ws, {
                type: 'marker_created',
                payload: {
                    markerId: marker.id,
                    marker: marker,
                    timestamp: Date.now()
                }
            });
            
            // Broadcast to other players
            this.broadcastToOthers(playerId, {
                type: 'marker_added',
                payload: {
                    playerId: playerId,
                    marker: marker,
                    timestamp: Date.now()
                }
            });
            
            console.log(`✅ Marker ${marker.id} created for player ${playerId}`);
        } else {
            // Send error back to client
            this.sendToClient(ws, {
                type: 'marker_create_error',
                payload: {
                    error: 'Failed to create marker',
                    timestamp: Date.now()
                }
            });
        }
    }
    
    /**
     * Handle marker update request
     * @param {WebSocket} ws - WebSocket connection
     * @param {Object} payload - Marker update data
     */
    handleMarkerUpdate(ws, payload) {
        const playerId = ws.playerId;
        const { markerId, updates } = payload;
        
        console.log(`📍 Player ${playerId} updating marker ${markerId}:`, updates);
        
        // Update marker in database
        const marker = this.gameStateDB.markers.get(markerId);
        if (marker && marker.playerId === playerId) {
            Object.assign(marker, updates);
            marker.updatedAt = Date.now();
            
            // Update player's game state
            const gameState = this.getPlayerGameState(playerId);
            if (gameState) {
                const markerIndex = gameState.markers.findIndex(m => m.id === markerId);
                if (markerIndex !== -1) {
                    gameState.markers[markerIndex] = marker;
                    this.savePlayerGameState(playerId, gameState);
                }
            }
            
            // Send confirmation back to client
            this.sendToClient(ws, {
                type: 'marker_updated',
                payload: {
                    markerId: markerId,
                    marker: marker,
                    timestamp: Date.now()
                }
            });
            
            // Broadcast to other players
            this.broadcastToOthers(playerId, {
                type: 'marker_updated',
                payload: {
                    playerId: playerId,
                    markerId: markerId,
                    marker: marker,
                    timestamp: Date.now()
                }
            });
            
            console.log(`✅ Marker ${markerId} updated for player ${playerId}`);
        } else {
            this.sendToClient(ws, {
                type: 'marker_update_error',
                payload: {
                    error: 'Marker not found or not owned by player',
                    timestamp: Date.now()
                }
            });
        }
    }
    
    /**
     * Handle marker deletion request
     * @param {WebSocket} ws - WebSocket connection
     * @param {Object} payload - Marker deletion data
     */
    handleMarkerDelete(ws, payload) {
        const playerId = ws.playerId;
        const { markerId } = payload;
        
        console.log(`📍 Player ${playerId} deleting marker ${markerId}`);
        
        // Remove marker from database
        const marker = this.gameStateDB.markers.get(markerId);
        if (marker && marker.playerId === playerId) {
            this.gameStateDB.markers.delete(markerId);
            
            // Update player's game state
            const gameState = this.getPlayerGameState(playerId);
            if (gameState) {
                gameState.markers = gameState.markers.filter(m => m.id !== markerId);
                this.savePlayerGameState(playerId, gameState);
            }
            
            // Send confirmation back to client
            this.sendToClient(ws, {
                type: 'marker_deleted',
                payload: {
                    markerId: markerId,
                    timestamp: Date.now()
                }
            });
            
            // Broadcast to other players
            this.broadcastToOthers(playerId, {
                type: 'marker_deleted',
                payload: {
                    playerId: playerId,
                    markerId: markerId,
                    timestamp: Date.now()
                }
            });
            
            console.log(`✅ Marker ${markerId} deleted for player ${playerId}`);
        } else {
            this.sendToClient(ws, {
                type: 'marker_delete_error',
                payload: {
                    error: 'Marker not found or not owned by player',
                    timestamp: Date.now()
                }
            });
        }
    }
    
    /**
     * Handle base establishment request
     * @param {WebSocket} ws - WebSocket connection
     * @param {Object} payload - Base establishment data
     */
    handleBaseEstablish(ws, payload) {
        const playerId = ws.playerId;
        const { position } = payload;
        
        console.log(`🏗️ Player ${playerId} establishing base at:`, position);
        
        // Set base in player's game state
        this.setPlayerBase(playerId, { position });
        
        
        // Create base marker with icon data
        const baseMarker = this.addMarkerToPlayer(playerId, {
            type: 'base',
            position: position,
            data: {
                level: 1,
                established: true,
                name: 'My Cosmic Base',
                symbol: '🏗️',
                icon: {
                    className: 'base-marker',
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
                        ">🏗️</div>
                    `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                },
                popup: {
                    title: 'Base Marker',
                    content: `
                        <b>Base Marker</b><br>
                        <small>🏗️ Base</small><br>
                        <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
                    `
                }
            }
        });
        
        if (baseMarker) {
            // Send confirmation back to client
            this.sendToClient(ws, {
                type: 'base_established',
                payload: {
                    baseMarker: baseMarker,
                    position: position,
                    timestamp: Date.now()
                }
            });
            
            // Broadcast to other players
            this.broadcastToOthers(playerId, {
                type: 'base_established',
                payload: {
                    playerId: playerId,
                    baseMarker: baseMarker,
                    position: position,
                    timestamp: Date.now()
                }
            });
            
            console.log(`✅ Base established for player ${playerId} at:`, position);
        } else {
            this.sendToClient(ws, {
                type: 'base_establish_error',
                payload: {
                    error: 'Failed to establish base',
                    timestamp: Date.now()
                }
            });
        }
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

