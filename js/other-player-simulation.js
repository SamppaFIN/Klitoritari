/**
 * Other Player Simulation - Simulates other players for testing PvP encounters
 * Creates AI-controlled players that move around and can trigger encounters
 */

class OtherPlayerSimulation {
    constructor() {
        this.isInitialized = false;
        this.otherPlayers = [];
        this.playerMarkers = [];
        this.movementInterval = null;
        this.encounterCheckInterval = null;
        this.encounterDistance = 50; // meters
        this.movementSpeed = 0.0001; // degrees per update
        this.updateInterval = 2000; // 2 seconds
    }

    init() {
        console.log('👥 Other player simulation initialized');
        this.isInitialized = true;
        this.createDebugControls();
        // Temporarily disabled for tutorial-first approach
        // this.generateTestPlayers();
        this.startPlayerMovement();
        this.startEncounterDetection();
    }

    createDebugControls() {
        // Debug controls are now handled by the unified debug panel
        // No need to create duplicate controls
    }

    setupDebugEvents() {
        // Debug events are now handled by the unified debug panel
        // No need to set up duplicate events
    }

    generateTestPlayers() {
        // Temporarily disabled for tutorial-first approach
        console.log('👥 Other player generation disabled for tutorial-first approach');
        return;
        
        // Create 2-3 test players
        const playerCount = 2;
        for (let i = 0; i < playerCount; i++) {
            this.addRandomPlayer();
        }
    }

    addRandomPlayer() {
        // Temporarily disabled for tutorial-first approach
        console.log('👥 Random player creation disabled for tutorial-first approach');
        return;
        
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) {
            console.log('👥 Map not ready for player generation');
            return;
        }

        const playerId = `other_player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const baseLat = 61.473683430224284; // Härmälänranta
        const baseLng = 23.726548746143216;
        
        // Random position within 500m radius
        const lat = baseLat + (Math.random() - 0.5) * 0.0045;
        const lng = baseLng + (Math.random() - 0.5) * 0.0045;

        const playerNames = ['CosmicWanderer', 'VoidExplorer', 'StellarSeeker', 'DimensionWalker', 'MysticTraveler'];
        const playerEmojis = ['🌟', '⚡', '🌙', '🔥', '💫'];
        const playerColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

        const player = {
            id: playerId,
            name: playerNames[Math.floor(Math.random() * playerNames.length)],
            emoji: playerEmojis[Math.floor(Math.random() * playerEmojis.length)],
            color: playerColors[Math.floor(Math.random() * playerColors.length)],
            lat: lat,
            lng: lng,
            originalLat: lat,
            originalLng: lng,
            movementRadius: 0.002, // ~200m movement radius
            direction: Math.random() * Math.PI * 2,
            speed: this.movementSpeed,
            health: 100,
            maxHealth: 100,
            level: Math.floor(Math.random() * 10) + 1,
            isHostile: Math.random() < 0.3, // 30% chance to be hostile
            lastEncounterTime: 0,
            encounterCooldown: 30000 // 30 seconds
        };

        this.otherPlayers.push(player);
        this.createPlayerMarker(player);
        this.updatePlayerCount();
        
        console.log(`👥 Added other player: ${player.name} (${player.isHostile ? 'Hostile' : 'Friendly'})`);
    }

    createPlayerMarker(player) {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) {
            return;
        }

        const playerIcon = L.divIcon({
            className: 'other-player-marker',
            html: `
                <div style="position: relative; width: 35px; height: 35px;">
                    <!-- Player aura -->
                    <div style="position: absolute; top: -5px; left: -5px; width: 45px; height: 45px; background: radial-gradient(circle, ${player.color}40 0%, transparent 70%); border-radius: 50%; animation: playerPulse 3s infinite;"></div>
                    <!-- Player body -->
                    <div style="position: absolute; top: 2px; left: 2px; width: 31px; height: 31px; background: ${player.color}; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px ${player.color}80;"></div>
                    <!-- Player emoji -->
                    <div style="position: absolute; top: 5px; left: 5px; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; font-size: 14px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">${player.emoji}</div>
                    <!-- Hostile indicator -->
                    ${player.isHostile ? '<div style="position: absolute; top: -2px; right: -2px; width: 12px; height: 12px; background: #ff0000; border: 2px solid #ffffff; border-radius: 50%; font-size: 8px; display: flex; align-items: center; justify-content: center;">⚔️</div>' : ''}
                </div>
            `,
            iconSize: [35, 35],
            iconAnchor: [17, 17]
        });

        const marker = L.marker([player.lat, player.lng], { icon: playerIcon }).addTo(window.eldritchApp.systems.mapEngine.map);
        marker.bindPopup(`
            <div style="text-align: center;">
                <h3 style="color: ${player.color}; margin: 0;">${player.emoji} ${player.name}</h3>
                <p style="margin: 5px 0; color: #666;">Level ${player.level} ${player.isHostile ? 'Hostile' : 'Friendly'} Player</p>
                <div style="margin: 10px 0;">
                    <div style="background: #ff4444; height: 4px; border-radius: 2px; margin: 2px 0;">
                        <div style="background: #00ff00; height: 100%; width: ${player.health}%; border-radius: 2px;"></div>
                    </div>
                    <small>Health: ${player.health}/${player.maxHealth}</small>
                </div>
                <button onclick="window.otherPlayerSimulation.triggerPvPEncounter('${player.id}')" 
                        style="background: ${player.isHostile ? 'linear-gradient(45deg, #ff4444, #cc0000)' : 'linear-gradient(45deg, #4CAF50, #2E7D32)'}; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-top: 5px;">
                    ${player.isHostile ? '⚔️ Challenge' : '🤝 Interact'}
                </button>
            </div>
        `);

        player.marker = marker;
        this.playerMarkers.push(marker);
    }

    startPlayerMovement() {
        this.movementInterval = setInterval(() => {
            this.otherPlayers.forEach(player => {
                this.movePlayer(player);
            });
        }, this.updateInterval);
    }

    movePlayer(player) {
        // Random movement within radius
        const angle = player.direction + (Math.random() - 0.5) * 0.5;
        const distance = player.speed * (0.5 + Math.random() * 0.5);
        
        player.lat += Math.cos(angle) * distance;
        player.lng += Math.sin(angle) * distance;
        
        // Keep within movement radius
        const distanceFromOrigin = Math.sqrt(
            Math.pow(player.lat - player.originalLat, 2) + 
            Math.pow(player.lng - player.originalLng, 2)
        );
        
        if (distanceFromOrigin > player.movementRadius) {
            // Move back towards origin
            const angleToOrigin = Math.atan2(player.originalLng - player.lng, player.originalLat - player.lat);
            player.lat += Math.cos(angleToOrigin) * distance;
            player.lng += Math.sin(angleToOrigin) * distance;
        }
        
        player.direction = angle;
        
        // Update marker position
        if (player.marker) {
            player.marker.setLatLng([player.lat, player.lng]);
        }
    }

    startEncounterDetection() {
        this.encounterCheckInterval = setInterval(() => {
            this.checkForPvPEncounters();
        }, 1000); // Check every second
    }

    checkForPvPEncounters() {
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) {
            return;
        }

        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) {
            return;
        }

        this.otherPlayers.forEach(otherPlayer => {
            const distance = this.calculateDistance(
                playerPos.lat, playerPos.lng,
                otherPlayer.lat, otherPlayer.lng
            );

            if (distance < this.encounterDistance) {
                const now = Date.now();
                if (now - otherPlayer.lastEncounterTime > otherPlayer.encounterCooldown) {
                    otherPlayer.lastEncounterTime = now;
                    this.triggerPvPEncounter(otherPlayer.id);
                }
            }
        });
    }

    triggerPvPEncounter(playerId) {
        const player = this.otherPlayers.find(p => p.id === playerId);
        if (!player) {
            console.error('Player not found:', playerId);
            return;
        }

        console.log(`⚔️ PvP Encounter triggered with ${player.name}!`);
        this.showPvPModal(player);
    }

    showPvPModal(player) {
        // Remove existing modal if it exists
        const existingModal = document.getElementById('pvp-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'pvp-modal';
        modal.className = 'encounter-modal';
        modal.innerHTML = `
            <div class="encounter-content pvp-encounter">
                <div class="encounter-header pvp-header">
                    <h2>${player.emoji} ${player.name}</h2>
                    <p class="player-level">Level ${player.level} ${player.isHostile ? 'Hostile' : 'Friendly'} Player</p>
                    <button class="close-btn" onclick="this.closest('.encounter-modal').remove()">×</button>
                </div>
                <div class="pvp-dialogue">
                    <div class="player-info">
                        <div class="player-stats">
                            <div class="stat-bar">
                                <span>Health:</span>
                                <div class="health-bar">
                                    <div class="health-fill" style="width: ${player.health}%"></div>
                                </div>
                                <span>${player.health}/${player.maxHealth}</span>
                            </div>
                        </div>
                    </div>
                    <div class="encounter-actions">
                        ${player.isHostile ? `
                            <button onclick="window.otherPlayerSimulation.startPvPCombat('${player.id}')" class="combat-btn">⚔️ Challenge to Combat</button>
                            <button onclick="window.otherPlayerSimulation.tryDiplomacy('${player.id}')" class="diplomacy-btn">🤝 Try Diplomacy</button>
                        ` : `
                            <button onclick="window.otherPlayerSimulation.startFriendlyInteraction('${player.id}')" class="friendly-btn">🤝 Friendly Chat</button>
                            <button onclick="window.otherPlayerSimulation.tradeWithPlayer('${player.id}')" class="trade-btn">💎 Trade</button>
                        `}
                        <button onclick="window.otherPlayerSimulation.ignorePlayer('${player.id}')" class="ignore-btn">😐 Ignore</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    startPvPCombat(playerId) {
        const player = this.otherPlayers.find(p => p.id === playerId);
        if (!player) return;

        console.log(`⚔️ Starting combat with ${player.name}!`);
        // Close modal and start combat
        document.getElementById('pvp-modal').remove();
        
        // Trigger combat encounter
        if (window.encounterSystem) {
            window.encounterSystem.triggerPvPCombat(player);
        }
    }

    tryDiplomacy(playerId) {
        const player = this.otherPlayers.find(p => p.id === playerId);
        if (!player) return;

        console.log(`🤝 Attempting diplomacy with ${player.name}...`);
        // Add diplomacy logic here
        document.getElementById('pvp-modal').remove();
    }

    startFriendlyInteraction(playerId) {
        const player = this.otherPlayers.find(p => p.id === playerId);
        if (!player) return;

        console.log(`🤝 Starting friendly interaction with ${player.name}!`);
        // Add friendly interaction logic here
        document.getElementById('pvp-modal').remove();
    }

    tradeWithPlayer(playerId) {
        const player = this.otherPlayers.find(p => p.id === playerId);
        if (!player) return;

        console.log(`💎 Trading with ${player.name}!`);
        // Add trade logic here
        document.getElementById('pvp-modal').remove();
    }

    ignorePlayer(playerId) {
        console.log(`😐 Ignoring player ${playerId}`);
        document.getElementById('pvp-modal').remove();
    }

    testPvPEncounter() {
        // Temporarily disabled for tutorial-first approach
        console.log('👥 PvP encounter testing disabled for tutorial-first approach');
        return;
        
        if (this.otherPlayers.length === 0) {
            this.addRandomPlayer();
        }
        const randomPlayer = this.otherPlayers[Math.floor(Math.random() * this.otherPlayers.length)];
        this.triggerPvPEncounter(randomPlayer.id);
    }

    removeAllPlayers() {
        this.otherPlayers.forEach(player => {
            if (player.marker) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(player.marker);
            }
        });
        this.otherPlayers = [];
        this.playerMarkers = [];
        this.updatePlayerCount();
        console.log('👥 Removed all other players');
    }

    updatePlayerCount() {
        const countElement = document.getElementById('other-player-count');
        if (countElement) {
            countElement.textContent = this.otherPlayers.length;
        }
    }

    // Methods called by debug panel - these are already implemented above
    // addRandomPlayer() - already exists
    // removeAllPlayers() - already exists  
    // testPvPEncounter() - already exists

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

    destroy() {
        if (this.movementInterval) {
            clearInterval(this.movementInterval);
        }
        if (this.encounterCheckInterval) {
            clearInterval(this.encounterCheckInterval);
        }
        this.removeAllPlayers();
    }
}

// Make it globally available
window.OtherPlayerSimulation = OtherPlayerSimulation;
