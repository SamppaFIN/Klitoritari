/**
 * Sacred Geometry Effects Layer
 * Renders flags, paths, territories with cosmic effects and sacred geometry patterns
 * Z-Index: 10 (above map background, below clickable objects)
 */

class SacredGeometryLayer extends RenderLayer {
    constructor() {
        super('sacredGeometry', 10, 'none'); // pointerEvents: 'none' to not block map interactions
        this.flags = [];
        this.paths = [];
        this.territories = [];
        this.cosmicEffects = [];
        this.animationTime = 0;
        this.isInitialized = false;
        this.selectedFlag = null;
        this.statisticsModal = null;
        this.baseInfo = {
            totalFlags: 0,
            totalWeight: 0,
            averageWeight: 0,
            largestFlag: null,
            smallestFlag: null
        };
        
        console.log('🔮 Initializing Sacred Geometry Layer...');
        this.init();
        this.setupClickHandlers();
    }
    
    setupClickHandlers() {
        // Create invisible clickable areas for each flag instead of making entire canvas clickable
        this.createFlagClickAreas();
        console.log('🔮 Flag click handlers setup complete');
    }
    
    createFlagClickAreas() {
        // Remove existing click areas
        this.removeFlagClickAreas();
        
        // Create clickable divs for each flag
        this.flags.forEach((flag, index) => {
            if (flag.clickable) {
                const clickArea = document.createElement('div');
                clickArea.className = 'flag-click-area';
                clickArea.style.cssText = `
                    position: absolute;
                    left: ${flag.x - flag.currentSize/2}px;
                    top: ${flag.y - flag.currentSize * 0.6/2}px;
                    width: ${flag.currentSize}px;
                    height: ${flag.currentSize * 0.6}px;
                    z-index: 15;
                    cursor: pointer;
                    background: transparent;
                `;
                clickArea.dataset.flagIndex = index;
                clickArea.addEventListener('click', (event) => this.handleFlagClick(event, index));
                clickArea.addEventListener('touchstart', (event) => this.handleFlagClick(event, index), { passive: true });
                
                document.body.appendChild(clickArea);
            }
        });
    }
    
    removeFlagClickAreas() {
        const existingAreas = document.querySelectorAll('.flag-click-area');
        existingAreas.forEach(area => area.remove());
    }
    
    updateFlagClickAreas() {
        // Update click areas when flags move or resize
        this.createFlagClickAreas();
    }
    
    handleFlagClick(event, flagIndex) {
        event.preventDefault();
        event.stopPropagation();
        
        if (flagIndex !== undefined && this.flags[flagIndex]) {
            this.showFlagStatistics(this.flags[flagIndex]);
        }
    }
    
    showFlagStatistics(flag) {
        // Create or update statistics modal
        if (this.statisticsModal) {
            this.statisticsModal.remove();
        }
        
        this.statisticsModal = document.createElement('div');
        this.statisticsModal.className = 'flag-statistics-modal';
        this.statisticsModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #8b5cf6;
            z-index: 1000;
            font-family: Arial, sans-serif;
            min-width: 300px;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        `;
        
        this.statisticsModal.innerHTML = `
            <h3 style="margin-top: 0; color: #8b5cf6;">🏴 Flag Statistics</h3>
            <div style="margin-bottom: 10px;">
                <strong>Player:</strong> ${flag.playerName || 'Unknown'}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Player ID:</strong> ${flag.playerId}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Flag Type:</strong> ${flag.type.charAt(0).toUpperCase() + flag.type.slice(1)}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Weight (Ticks):</strong> ${Math.round(flag.weight)}
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Size:</strong> ${Math.round(flag.currentSize)}px
            </div>
            <div style="margin-bottom: 10px;">
                <strong>Energy:</strong> ${(flag.energy * 100).toFixed(1)}%
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Growth Progress:</strong> ${((flag.currentSize / flag.maxSize) * 100).toFixed(1)}%
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
            ">Close</button>
        `;
        
        document.body.appendChild(this.statisticsModal);
        
        // Auto-close after 10 seconds
        setTimeout(() => {
            if (this.statisticsModal) {
                this.statisticsModal.remove();
                this.statisticsModal = null;
            }
        }, 10000);
    }
    
    // Flag settings and customization methods
    getAvailableFlagTypes() {
        return [
            { id: 'finnish', name: 'Finnish Flag', description: 'Classic Finnish cross design' },
            { id: 'cosmic', name: 'Cosmic Flag', description: 'Starry nebula with cosmic colors' },
            { id: 'eldritch', name: 'Eldritch Flag', description: 'Dark tentacles and glowing eyes' },
            { id: 'void', name: 'Void Flag', description: 'Black hole with swirling patterns' },
            { id: 'rainbow', name: 'Rainbow Flag', description: 'Vibrant rainbow stripes' }
        ];
    }
    
    changePlayerFlagType(playerId, newType) {
        const flag = this.flags.find(f => f.playerId === playerId);
        if (flag) {
            flag.type = newType;
            console.log(`🔮 Changed flag type for player ${playerId} to ${newType}`);
            return true;
        }
        return false;
    }
    
    addPlayerFlag(playerId, playerName, x, y, type = 'cosmic') {
        const newFlag = {
            id: `flag_${playerId}`,
            playerId: playerId,
            playerName: playerName,
            x: x,
            y: y,
            type: type,
            energy: 0.5,
            weight: 0, // Start with no weight
            baseSize: 7, // 1/3 of original size
            currentSize: 7,
            maxSize: 100,
            connections: [],
            clickable: true,
            lastProximityCheck: 0,
            proximityDecayRate: 0.1
        };
        
        this.flags.push(newFlag);
        console.log(`🔮 Added new flag for player ${playerName} (${playerId})`);
        return newFlag;
    }
    
    removePlayerFlag(playerId) {
        const index = this.flags.findIndex(f => f.playerId === playerId);
        if (index !== -1) {
            this.flags.splice(index, 1);
            console.log(`🔮 Removed flag for player ${playerId}`);
            return true;
        }
        return false;
    }
    
    // Method to integrate with existing settings system
    createFlagSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'flag-settings-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 10px;
            border: 2px solid #8b5cf6;
            z-index: 1000;
            font-family: Arial, sans-serif;
            min-width: 250px;
            box-shadow: 0 0 20px rgba(139, 92, 246, 0.5);
        `;
        
        panel.innerHTML = `
            <h3 style="margin-top: 0; color: #8b5cf6;">🏴 Flag Settings</h3>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">Flag Type:</label>
                <select id="flagTypeSelect" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #8b5cf6;">
                    ${this.getAvailableFlagTypes().map(type => 
                        `<option value="${type.id}">${type.name}</option>`
                    ).join('')}
                </select>
            </div>
            <div style="margin-bottom: 10px;">
                <label style="display: block; margin-bottom: 5px;">Player ID:</label>
                <input type="text" id="playerIdInput" placeholder="Enter player ID" style="width: 100%; padding: 5px; background: #333; color: white; border: 1px solid #8b5cf6;">
            </div>
            <button onclick="window.sacredGeometryLayer?.applyFlagSettings()" style="
                background: #8b5cf6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
                margin-bottom: 10px;
            ">Apply Settings</button>
            <button onclick="this.parentElement.remove()" style="
                background: #666;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
            ">Close</button>
        `;
        
        document.body.appendChild(panel);
        
        // Make sacred geometry layer globally available for settings
        window.sacredGeometryLayer = this;
        
        // Add global function to open flag settings
        window.openFlagSettings = () => {
            if (window.sacredGeometryLayer) {
                window.sacredGeometryLayer.createFlagSettingsPanel();
            } else {
                console.error('Sacred Geometry Layer not available');
            }
        };
    }
    
    applyFlagSettings() {
        const flagTypeSelect = document.getElementById('flagTypeSelect');
        const playerIdInput = document.getElementById('playerIdInput');
        
        if (flagTypeSelect && playerIdInput) {
            const newType = flagTypeSelect.value;
            const playerId = playerIdInput.value.trim();
            
            if (playerId) {
                if (this.changePlayerFlagType(playerId, newType)) {
                    alert(`Flag type changed to ${newType} for player ${playerId}`);
                } else {
                    alert(`Player ${playerId} not found. Creating new flag...`);
                    this.addPlayerFlag(playerId, `Player ${playerId}`, 400, 300, newType);
                }
            } else {
                alert('Please enter a player ID');
            }
        }
    }
    
    init() {
        super.init();
        this.setupCosmicEffects();
        this.loadExistingData();
        this.createFlagClickAreas(); // Create click areas immediately on init
        this.isInitialized = true;
        console.log('✅ Sacred Geometry Layer initialized');
    }
    
    setupCosmicEffects() {
        // Initialize cosmic effect patterns
        this.cosmicEffects = {
            energyFields: [],
            sacredCircles: [],
            cosmicConnections: [],
            particleStreams: []
        };
    }
    
    loadExistingData() {
        // Load existing flags from Finnish flag system
        this.loadFlags();
        
        // Load existing paths from path painting system
        this.loadPaths();
        
        // Load existing territories from base system
        this.loadTerritories();
    }
    
    loadFlags() {
        // Enhanced flag system with different types and customizable flags
        this.flags = [
            {
                id: 'flag_player_1',
                playerId: 'player_001',
                playerName: 'Aurora',
                x: 100,
                y: 100,
                type: 'cosmic', // cosmic, finnish, eldritch, void, rainbow
                energy: 0.8,
                weight: 150, // ticks/weight for growth
                baseSize: 7, // base flag size (1/3 of 20)
                currentSize: 7.45, // current rendered size (7 + (150/100)*0.3 = 7.45)
                maxSize: 100, // maximum size achievable
                connections: [],
                clickable: true,
                lastProximityCheck: 0,
                proximityDecayRate: 0.1 // weight loss per second when player nearby
            },
            {
                id: 'flag_player_2', 
                playerId: 'player_002',
                playerName: 'Sage',
                x: 300,
                y: 200,
                type: 'eldritch',
                energy: 0.6,
                weight: 80,
                baseSize: 7,
                currentSize: 7.24, // (7 + (80/100)*0.3 = 7.24)
                maxSize: 100,
                connections: [],
                clickable: true,
                lastProximityCheck: 0,
                proximityDecayRate: 0.1
            },
            {
                id: 'flag_player_3',
                playerId: 'player_003',
                playerName: 'Void Walker', 
                x: 500,
                y: 150,
                type: 'void',
                energy: 0.9,
                weight: 300,
                baseSize: 7,
                currentSize: 7.9, // (7 + (300/100)*0.3 = 7.9)
                maxSize: 100,
                connections: [],
                clickable: true,
                lastProximityCheck: 0,
                proximityDecayRate: 0.1
            },
            {
                id: 'flag_player_4',
                playerId: 'player_004',
                playerName: 'Rainbow Seeker',
                x: 200,
                y: 350,
                type: 'rainbow',
                energy: 0.7,
                weight: 200,
                baseSize: 7,
                currentSize: 7.6, // (7 + (200/100)*0.3 = 7.6)
                maxSize: 100,
                connections: [],
                clickable: true,
                lastProximityCheck: 0,
                proximityDecayRate: 0.1
            },
            {
                id: 'flag_player_5',
                playerId: 'player_005',
                playerName: 'Finnish Explorer',
                x: 150,
                y: 250,
                type: 'finnish',
                energy: 0.75,
                weight: 120,
                baseSize: 7,
                currentSize: 7.36, // (7 + (120/100)*0.3 = 7.36)
                maxSize: 100,
                connections: [],
                clickable: true,
                lastProximityCheck: 0,
                proximityDecayRate: 0.1
            }
        ];
        
        console.log(`🔮 Loaded ${this.flags.length} flags with customizable types`);
    }
    
    loadPaths() {
        // TODO: Integrate with existing path painting system
        // For now, create some test paths
        this.paths = [
            {
                id: 'path_1',
                points: [
                    { x: 50, y: 50 },
                    { x: 150, y: 100 },
                    { x: 250, y: 150 },
                    { x: 350, y: 200 }
                ],
                energy: 0.7,
                cosmicTrail: true
            }
        ];
        
        console.log(`🔮 Loaded ${this.paths.length} paths`);
    }
    
    loadTerritories() {
        // TODO: Integrate with existing base/territory system
        // For now, create some test territories
        this.territories = [
            {
                id: 'territory_1',
                center: { x: 200, y: 200 },
                radius: 100,
                energy: 0.9,
                sacredPattern: 'hexagon'
            }
        ];
        
        console.log(`🔮 Loaded ${this.territories.length} territories`);
    }
    
    renderContent() {
        if (!this.ctx) return;
        
        // Update animation time
        this.animationTime += 0.016; // ~60fps
        
        // Update flag growth and proximity effects
        this.updateFlagGrowth();
        this.updateProximityEffects();
        
        // Update click areas for flags
        this.updateFlagClickAreas();
        
        // Update base statistics
        this.updateBaseInfo();
        
        // Render territories first (background)
        this.renderTerritories();
        
        // Render paths (middle layer)
        this.renderPaths();
        
        // Render flags (foreground)
        this.renderFlags();
        
        // Render cosmic connections
        this.renderCosmicConnections();
        
        // Render energy fields
        this.renderEnergyFields();
        
        // Render base statistics
        this.renderBaseInfo();
    }
    
    updateFlagGrowth() {
        // Update flag sizes based on weight (100x more ticks for bigger flags)
        this.flags.forEach(flag => {
            // Calculate size based on weight: baseSize + (weight / 100) * growthFactor
            const growthFactor = 0.3; // How much size increases per 100 ticks
            const newSize = Math.min(
                flag.baseSize + (flag.weight / 100) * growthFactor,
                flag.maxSize
            );
            flag.currentSize = newSize;
            
            // Update energy based on size (bigger flags have more energy)
            flag.energy = Math.min(0.5 + (flag.currentSize / flag.maxSize) * 0.5, 1.0);
        });
    }
    
    updateProximityEffects() {
        // Get player position (if available)
        const playerPosition = this.getPlayerPosition();
        if (!playerPosition) return;
        
        const currentTime = Date.now();
        const proximityRadius = 100; // pixels
        
        this.flags.forEach(flag => {
            // Calculate distance to player
            const dx = flag.x - playerPosition.x;
            const dy = flag.y - playerPosition.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // If player is nearby, reduce flag weight
            if (distance < proximityRadius) {
                const timeSinceLastCheck = (currentTime - flag.lastProximityCheck) / 1000; // seconds
                if (timeSinceLastCheck > 0.1) { // Check every 100ms
                    const weightLoss = flag.proximityDecayRate * timeSinceLastCheck;
                    flag.weight = Math.max(0, flag.weight - weightLoss);
                    flag.lastProximityCheck = currentTime;
                    
                    // Visual effect: flag flickers when losing weight
                    flag.energy *= 0.95;
                }
            } else {
                // Gradually restore energy when player moves away
                flag.energy = Math.min(flag.energy * 1.01, 1.0);
            }
        });
    }
    
    updateBaseInfo() {
        if (this.flags.length === 0) {
            this.baseInfo = {
                totalFlags: 0,
                totalWeight: 0,
                averageWeight: 0,
                largestFlag: null,
                smallestFlag: null
            };
            return;
        }
        
        const totalWeight = this.flags.reduce((sum, flag) => sum + flag.weight, 0);
        const largestFlag = this.flags.reduce((max, flag) => flag.weight > max.weight ? flag : max, this.flags[0]);
        const smallestFlag = this.flags.reduce((min, flag) => flag.weight < min.weight ? flag : min, this.flags[0]);
        
        this.baseInfo = {
            totalFlags: this.flags.length,
            totalWeight: Math.round(totalWeight),
            averageWeight: Math.round(totalWeight / this.flags.length),
            largestFlag: largestFlag,
            smallestFlag: smallestFlag
        };
    }
    
    renderBaseInfo() {
        if (!this.ctx) return;
        
        const x = 20;
        const y = 20;
        const width = 300;
        const height = 120;
        
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x, y, width, height);
        
        // Border
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);
        
        // Text
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '16px Arial';
        this.ctx.textAlign = 'left';
        
        const info = this.baseInfo;
        this.ctx.fillText(`🏴 Base Statistics`, x + 10, y + 25);
        this.ctx.fillText(`Total Flags: ${info.totalFlags}`, x + 10, y + 45);
        this.ctx.fillText(`Combined Weight: ${info.totalWeight}`, x + 10, y + 65);
        this.ctx.fillText(`Average Weight: ${info.averageWeight}`, x + 10, y + 85);
        
        if (info.largestFlag) {
            this.ctx.fillText(`Largest: ${info.largestFlag.playerName} (${Math.round(info.largestFlag.weight)})`, x + 10, y + 105);
        }
    }
    
    getPlayerPosition() {
        // Try to get player position from various sources
        if (window.mapEngine && window.mapEngine.playerPosition) {
            const pos = window.mapEngine.playerPosition;
            // Convert lat/lng to screen coordinates using proper map projection
            const mapContainer = document.querySelector('.leaflet-container');
            if (mapContainer) {
                const mapBounds = mapContainer.getBoundingClientRect();
                // Use map center and zoom to calculate screen position
                const mapCenter = window.mapEngine.map.getCenter();
                const zoom = window.mapEngine.map.getZoom();
                
                // Simple conversion - in production this should use proper map projection
                const scale = Math.pow(2, zoom);
                const x = mapBounds.width / 2 + (pos.lng - mapCenter.lng) * scale * 100;
                const y = mapBounds.height / 2 - (pos.lat - mapCenter.lat) * scale * 100;
                
                return { x, y };
            }
        }
        
        // Try geolocation system
        if (window.geolocationManager && window.geolocationManager.currentPosition) {
            const pos = window.geolocationManager.currentPosition;
            const mapContainer = document.querySelector('.leaflet-container');
            if (mapContainer) {
                const mapBounds = mapContainer.getBoundingClientRect();
                return {
                    x: mapBounds.width / 2,
                    y: mapBounds.height / 2
                };
            }
        }
        
        // Fallback: return center of screen
        return {
            x: this.canvas.width / 2,
            y: this.canvas.height / 2
        };
    }
    
    renderTerritories() {
        this.territories.forEach(territory => {
            this.renderTerritory(territory);
        });
    }
    
    renderTerritory(territory) {
        const { center, radius, energy, sacredPattern } = territory;
        
        // Base energy field
        this.ctx.save();
        this.ctx.globalAlpha = energy * 0.3;
        this.ctx.fillStyle = this.getCosmicColor(energy);
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sacred geometry pattern
        this.ctx.globalAlpha = energy * 0.6;
        this.ctx.strokeStyle = this.getCosmicColor(energy);
        this.ctx.lineWidth = 2;
        
        if (sacredPattern === 'hexagon') {
            this.renderHexagon(center.x, center.y, radius * 0.8);
        } else if (sacredPattern === 'circle') {
            this.renderSacredCircle(center.x, center.y, radius * 0.9);
        }
        
        this.ctx.restore();
    }
    
    renderPaths() {
        this.paths.forEach(path => {
            this.renderPath(path);
        });
    }
    
    renderPath(path) {
        const { points, energy, cosmicTrail } = path;
        
        if (points.length < 2) return;
        
        this.ctx.save();
        this.ctx.globalAlpha = energy * 0.8;
        this.ctx.strokeStyle = this.getCosmicColor(energy);
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Draw main path
        this.ctx.beginPath();
        this.ctx.moveTo(points[0].x, points[0].y);
        
        for (let i = 1; i < points.length; i++) {
            this.ctx.lineTo(points[i].x, points[i].y);
        }
        
        this.ctx.stroke();
        
        // Add cosmic trail effect
        if (cosmicTrail) {
            this.renderCosmicTrail(points, energy);
        }
        
        this.ctx.restore();
    }
    
    renderFlags() {
        this.flags.forEach(flag => {
            this.renderFlag(flag);
        });
    }
    
    renderFlag(flag) {
        const { x, y, energy, type, currentSize, weight, playerId, playerName } = flag;
        
        this.ctx.save();
        
        // Energy pulse effect
        const pulse = Math.sin(this.animationTime * 2) * 0.2 + 0.8;
        this.ctx.globalAlpha = energy * pulse * 0.9;
        
        // Calculate flag dimensions based on current size
        const flagWidth = currentSize;
        const flagHeight = currentSize * 0.6;
        const poleWidth = Math.max(2, currentSize * 0.1);
        const poleHeight = currentSize * 1.5;
        
        // Render different flag types
        this.renderFlagByType(flag, x, y, flagWidth, flagHeight);
        
        // Flag pole
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - poleWidth/2, y - flagHeight/2, poleWidth, poleHeight);
        
        // Sacred geometry around flag (scales with flag size)
        this.ctx.strokeStyle = this.getCosmicColor(energy);
        this.ctx.lineWidth = Math.max(1, currentSize * 0.05);
        this.ctx.globalAlpha = energy * 0.6;
        
        // Draw sacred circle (scales with flag size)
        this.renderSacredCircle(x, y, currentSize * 1.5);
        
        // Draw energy field (scales with flag size)
        this.ctx.globalAlpha = energy * 0.3;
        this.ctx.fillStyle = this.getCosmicColor(energy);
        this.ctx.beginPath();
        this.ctx.arc(x, y, currentSize * 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add clickable indicator for flags with statistics
        if (flag.clickable) {
            this.ctx.globalAlpha = 0.8;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(x + flagWidth/2 + 5, y - flagHeight/2 - 5, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    renderFlagByType(flag, x, y, width, height) {
        const { type, energy, currentSize } = flag;
        
        switch (type) {
            case 'finnish':
                this.renderFinnishFlag(x, y, width, height);
                break;
            case 'cosmic':
                this.renderCosmicFlag(x, y, width, height, energy);
                break;
            case 'eldritch':
                this.renderEldritchFlag(x, y, width, height, energy);
                break;
            case 'void':
                this.renderVoidFlag(x, y, width, height, energy);
                break;
            case 'rainbow':
                this.renderRainbowFlag(x, y, width, height, energy);
                break;
            default:
                this.renderCosmicFlag(x, y, width, height, energy);
        }
    }
    
    renderFinnishFlag(x, y, width, height) {
        // Finnish flag colors
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Finnish flag cross
        this.ctx.fillStyle = '#003580';
        this.ctx.fillRect(x - width/2, y - height/6, width, height/3);
        this.ctx.fillRect(x - width/6, y - height/2, width/3, height);
    }
    
    renderCosmicFlag(x, y, width, height, energy) {
        // Cosmic flag with stars and nebula colors
        const gradient = this.ctx.createLinearGradient(x - width/2, y - height/2, x + width/2, y + height/2);
        gradient.addColorStop(0, '#1a1a2e');
        gradient.addColorStop(0.5, '#16213e');
        gradient.addColorStop(1, '#0f3460');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Stars
        this.ctx.fillStyle = '#FFFFFF';
        for (let i = 0; i < 5; i++) {
            const starX = x - width/2 + (width * i / 4);
            const starY = y - height/2 + (height * Math.random());
            this.ctx.beginPath();
            this.ctx.arc(starX, starY, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    renderEldritchFlag(x, y, width, height, energy) {
        // Eldritch flag with tentacles and dark colors
        this.ctx.fillStyle = '#2d1b69';
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Tentacle pattern
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - width/3, y - height/2);
        this.ctx.quadraticCurveTo(x, y, x + width/3, y + height/2);
        this.ctx.stroke();
        
        // Eyes
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.beginPath();
        this.ctx.arc(x - width/4, y - height/4, 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(x + width/4, y + height/4, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    renderVoidFlag(x, y, width, height, energy) {
        // Void flag with black hole effect
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, width/2);
        gradient.addColorStop(0, '#000000');
        gradient.addColorStop(0.7, '#1a1a1a');
        gradient.addColorStop(1, '#2d2d2d');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x - width/2, y - height/2, width, height);
        
        // Void swirl
        this.ctx.strokeStyle = '#4a4a4a';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const radius = (width/4) * (i + 1);
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        this.ctx.stroke();
    }
    
    renderRainbowFlag(x, y, width, height, energy) {
        // Rainbow flag with vibrant colors
        const colors = ['#ff0000', '#ff8000', '#ffff00', '#00ff00', '#0080ff', '#8000ff'];
        const stripeHeight = height / colors.length;
        
        colors.forEach((color, index) => {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(
                x - width/2, 
                y - height/2 + (stripeHeight * index), 
                width, 
                stripeHeight
            );
        });
    }
    
    renderCosmicConnections() {
        // Draw connections between flags
        for (let i = 0; i < this.flags.length; i++) {
            for (let j = i + 1; j < this.flags.length; j++) {
                const flag1 = this.flags[i];
                const flag2 = this.flags[j];
                
                // Calculate distance
                const dx = flag2.x - flag1.x;
                const dy = flag2.y - flag1.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Only connect nearby flags
                if (distance < 200) {
                    this.renderCosmicConnection(flag1, flag2, distance);
                }
            }
        }
    }
    
    renderCosmicConnection(flag1, flag2, distance) {
        this.ctx.save();
        
        // Energy strength based on distance
        const energy = Math.max(0, 1 - distance / 200);
        this.ctx.globalAlpha = energy * 0.4;
        this.ctx.strokeStyle = this.getCosmicColor(energy);
        this.ctx.lineWidth = 1;
        
        // Draw connection line
        this.ctx.beginPath();
        this.ctx.moveTo(flag1.x, flag1.y);
        this.ctx.lineTo(flag2.x, flag2.y);
        this.ctx.stroke();
        
        // Add energy particles along the line
        const particleCount = Math.floor(distance / 20);
        for (let i = 0; i < particleCount; i++) {
            const t = i / particleCount;
            const x = flag1.x + (flag2.x - flag1.x) * t;
            const y = flag1.y + (flag2.y - flag1.y) * t;
            
            this.ctx.globalAlpha = energy * 0.8;
            this.ctx.fillStyle = this.getCosmicColor(energy);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    renderEnergyFields() {
        // Render ambient energy fields
        this.ctx.save();
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillStyle = '#9C27B0';
        
        // Create pulsing energy fields
        const fieldCount = 5;
        for (let i = 0; i < fieldCount; i++) {
            const x = (window.innerWidth / fieldCount) * i + window.innerWidth / (fieldCount * 2);
            const y = window.innerHeight / 2;
            const radius = 100 + Math.sin(this.animationTime + i) * 20;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }
    
    renderCosmicTrail(points, energy) {
        // Add particle effects along the path
        this.ctx.save();
        this.ctx.globalAlpha = energy * 0.6;
        
        for (let i = 0; i < points.length - 1; i++) {
            const point1 = points[i];
            const point2 = points[i + 1];
            
            // Add particles along the line segment
            const particleCount = 3;
            for (let j = 0; j < particleCount; j++) {
                const t = j / particleCount;
                const x = point1.x + (point2.x - point1.x) * t;
                const y = point1.y + (point2.y - point1.y) * t;
                
                // Animate particles
                const offset = Math.sin(this.animationTime * 3 + i + j) * 5;
                
                this.ctx.fillStyle = this.getCosmicColor(energy);
                this.ctx.beginPath();
                this.ctx.arc(x + offset, y + offset, 2, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        
        this.ctx.restore();
    }
    
    renderHexagon(x, y, radius) {
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const px = x + radius * Math.cos(angle);
            const py = y + radius * Math.sin(angle);
            
            if (i === 0) {
                this.ctx.moveTo(px, py);
            } else {
                this.ctx.lineTo(px, py);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }
    
    renderSacredCircle(x, y, radius) {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Add inner circle
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius * 0.6, 0, Math.PI * 2);
        this.ctx.stroke();
    }
    
    getCosmicColor(energy) {
        // Generate cosmic colors based on energy level
        const colors = [
            '#9C27B0', // Purple
            '#3F51B5', // Indigo
            '#2196F3', // Blue
            '#00BCD4', // Cyan
            '#4CAF50', // Green
            '#FFEB3B', // Yellow
            '#FF9800', // Orange
            '#F44336'  // Red
        ];
        
        const colorIndex = Math.floor(energy * (colors.length - 1));
        return colors[colorIndex];
    }
    
    // Public methods for adding/removing elements
    addFlag(flag) {
        this.flags.push(flag);
        console.log(`🔮 Added flag: ${flag.id}`);
    }
    
    removeFlag(flagId) {
        this.flags = this.flags.filter(flag => flag.id !== flagId);
        console.log(`🔮 Removed flag: ${flagId}`);
    }
    
    addPath(path) {
        this.paths.push(path);
        console.log(`🔮 Added path: ${path.id}`);
    }
    
    removePath(pathId) {
        this.paths = this.paths.filter(path => path.id !== pathId);
        console.log(`🔮 Removed path: ${pathId}`);
    }
    
    addTerritory(territory) {
        this.territories.push(territory);
        console.log(`🔮 Added territory: ${territory.id}`);
    }
    
    removeTerritory(territoryId) {
        this.territories = this.territories.filter(territory => territory.id !== territoryId);
        console.log(`🔮 Removed territory: ${territoryId}`);
    }
    
    // Integration methods for existing systems
    integrateWithFinnishFlags() {
        // TODO: Integrate with existing Finnish flag system
        console.log('🔮 Integrating with Finnish flag system...');
    }
    
    integrateWithPathPainting() {
        // TODO: Integrate with existing path painting system
        console.log('🔮 Integrating with path painting system...');
    }
    
    integrateWithBaseSystem() {
        // TODO: Integrate with existing base/territory system
        console.log('🔮 Integrating with base system...');
    }
}

// Export for global access
window.SacredGeometryLayer = SacredGeometryLayer;

console.log('🔮 Sacred Geometry Layer loaded');
