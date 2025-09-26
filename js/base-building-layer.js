/**
 * Base Building Layer
 * Manages base building, flag placement, and step-based currency
 */

class BaseBuildingLayer extends RenderLayer {
    constructor() {
        super('baseBuilding', 15, 'none'); // Z-index 15, non-interactive
        this.bases = [];
        this.flags = [];
        this.steps = 0;
        this.selectedBase = null;
        this.baseStatsModal = null;
        this.isInitialized = false;
        this.clickableAreas = []; // Store clickable div elements
        
        console.log('🏗️ Initializing Base Building Layer...');
        this.init();
    }

    init() {
        super.init();
        this.setupEventListeners();
        this.loadBaseData();
        this.isInitialized = true;
        console.log('✅ Base Building Layer initialized');
    }

    setupEventListeners() {
        // We'll create clickable div elements for each base instead of using canvas events
        // This prevents blocking map interactions
        console.log('🏗️ Base building layer setup complete (non-interactive canvas)');
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Check if click is on a base
        for (const base of this.bases) {
            const baseSize = base.size;
            if (x >= base.x - baseSize/2 && x <= base.x + baseSize/2 &&
                y >= base.y - baseSize/2 && y <= base.y + baseSize/2) {
                this.showBaseStats(base);
                return;
            }
        }

        // Check if click is on a flag
        for (const flag of this.flags) {
            const flagSize = flag.size;
            if (x >= flag.x - flagSize/2 && x <= flag.x + flagSize/2 &&
                y >= flag.y - flagSize/2 && y <= flag.y + flagSize/2) {
                this.handleFlagClick(flag);
                return;
            }
        }
    }

    loadBaseData() {
        // Load bases from localStorage
        this.loadBasesFromStorage();
        
        // If no bases exist, don't create one automatically
        // Bases will be created when user clicks "Establish Base"
        if (this.bases.length === 0) {
            this.bases = [];
        }

        // Load flags from localStorage
        this.loadFlags();
        
        // Load steps from localStorage
        this.steps = parseInt(localStorage.getItem('base_steps') || '0');
    }

    loadFlags() {
        const savedFlags = localStorage.getItem('base_flags');
        if (savedFlags) {
            this.flags = JSON.parse(savedFlags);
        } else {
            this.flags = [];
        }
    }

    saveFlags() {
        localStorage.setItem('base_flags', JSON.stringify(this.flags));
    }

    saveSteps() {
        localStorage.setItem('base_steps', this.steps.toString());
    }

    saveBaseData() {
        localStorage.setItem('base_bases', JSON.stringify(this.bases));
    }

    loadBasesFromStorage() {
        const savedBases = localStorage.getItem('base_bases');
        if (savedBases) {
            this.bases = JSON.parse(savedBases);
        }
    }

    addStep() {
        this.steps++;
        this.saveSteps();
        
        // Every 50 steps, add an ant
        if (this.steps % 50 === 0) {
            this.addAnt();
        }
        
        console.log(`👣 Step added! Total: ${this.steps}`);
        window.log(`👣 Step added! Total: ${this.steps}`);
    }

    addAnt() {
        const playerPosition = window.geolocationManager ? window.geolocationManager.getCurrentPosition() : null;
        if (!playerPosition) return;

        const ant = {
            id: 'ant_' + Date.now(),
            lat: playerPosition.lat,
            lng: playerPosition.lng,
            type: 'ant',
            size: 15,
            color: '#ff6b35',
            timestamp: Date.now()
        };

        this.flags.push(ant);
        this.saveFlags();
        
        // Check if we should add a step icon (every 5 ants)
        const antCount = this.flags.filter(flag => flag.type === 'ant').length;
        if (antCount % 5 === 0) {
            this.addStepIcon();
        }
        
        console.log(`🐜 Ant added at step ${this.steps} (total ants: ${antCount})`);
        if (window.log) {
            window.log(`🐜 Ant added at step ${this.steps} (total ants: ${antCount})`, 'info');
        }
    }

    addStepIcon() {
        const playerPosition = window.geolocationManager ? window.geolocationManager.getCurrentPosition() : null;
        if (!playerPosition) return;

        const stepIcon = {
            id: 'step_' + Date.now(),
            lat: playerPosition.lat,
            lng: playerPosition.lng,
            type: 'step',
            size: 12,
            color: '#2ed573',
            timestamp: Date.now()
        };

        this.flags.push(stepIcon);
        this.saveFlags();
        
        console.log(`👣 Step icon added (every 5 ants)`);
        if (window.log) {
            window.log(`👣 Step icon added (every 5 ants)`, 'info');
        }
    }

    canPlaceFlag(x, y) {
        // Check if there's a joint flag nearby (within 50 pixels)
        for (const flag of this.flags) {
            const distance = Math.sqrt((x - flag.x) ** 2 + (y - flag.y) ** 2);
            if (distance <= 50) {
                return true;
            }
        }
        
        // Check if near a base
        for (const base of this.bases) {
            const distance = Math.sqrt((x - base.x) ** 2 + (y - base.y) ** 2);
            if (distance <= 60) {
                return true;
            }
        }
        
        return false;
    }

    placeFlag(x, y, type = 'flag') {
        if (!this.canPlaceFlag(x, y)) {
            console.log('🚫 Cannot place flag: no joint flag nearby');
            window.log('🚫 Cannot place flag: no joint flag nearby');
            return false;
        }

        const flag = {
            id: `flag_${Date.now()}`,
            x: x,
            y: y,
            size: 12,
            type: type,
            timestamp: Date.now()
        };

        this.flags.push(flag);
        this.saveFlags();
        
        // Check if base should grow
        this.checkBaseGrowth();
        
        console.log(`🏴 Flag placed! Total flags: ${this.flags.length}`);
        window.log(`🏴 Flag placed! Total flags: ${this.flags.length}`);
        return true;
    }

    checkBaseGrowth() {
        for (const base of this.bases) {
            const surroundingFlags = this.getSurroundingFlags(base);
            if (surroundingFlags.length >= base.maxFlags) {
                this.growBase(base);
            }
        }
    }

    getSurroundingFlags(base) {
        return this.flags.filter(flag => {
            // Calculate distance using GPS coordinates (more accurate)
            const distance = this.calculateDistance(base.lat, base.lng, flag.lat, flag.lng);
            return distance <= 50; // Within 50 meters of base
        });
    }
    
    // Calculate distance between two GPS coordinates in meters
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

        return R * c; // Distance in meters
    }

    growBase(base) {
        base.level++;
        base.size += 10;
        base.maxFlags += 4;
        
        console.log(`🏗️ Base grew to level ${base.level}! Size: ${base.size}px`);
        window.log(`🏗️ Base grew to level ${base.level}! Size: ${base.size}px`);
    }

    showBaseStats(base) {
        if (this.baseStatsModal) {
            this.baseStatsModal.remove();
        }

        // Calculate stats
        const surroundingFlags = this.getSurroundingFlags(base);
        const totalSteps = this.steps || 0;
        const antsCount = this.flags.filter(flag => flag.type === 'ant').length;
        const areaTaken = this.calculateAreaTaken(base, surroundingFlags);

        this.baseStatsModal = document.createElement('div');
        this.baseStatsModal.className = 'base-stats-modal';
        this.baseStatsModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #8b5cf6;
            border-radius: 15px;
            padding: 20px;
            z-index: 1000;
            color: white;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
            min-width: 300px;
            max-width: 400px;
        `;
        
        this.baseStatsModal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #8b5cf6; font-size: 18px;">🏗️ Base Statistics</h3>
                <button id="close-base-stats" style="background: #ff4757; border: none; color: white; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 16px;">×</button>
            </div>
            
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>🏗️ Base Level:</span>
                    <span style="color: #8b5cf6; font-weight: bold;">${base.level || 1}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>🚩 Flags Around:</span>
                    <span style="color: #ffd700; font-weight: bold;">${surroundingFlags.length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>📏 Area Taken:</span>
                    <span style="color: #00d2d3; font-weight: bold;">${areaTaken.toFixed(1)}m²</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>🐜 Ants (Steps):</span>
                    <span style="color: #ff6b35; font-weight: bold;">${antsCount} (${totalSteps})</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span>💰 Step Currency:</span>
                    <span style="color: #2ed573; font-weight: bold;">${totalSteps} steps</span>
                </div>
            </div>
            
            <div style="background: rgba(139, 92, 246, 0.1); padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                <div style="font-size: 12px; color: #a4b0be; margin-bottom: 5px;">Base Growth Progress:</div>
                <div style="background: #2c2c54; height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="background: linear-gradient(90deg, #8b5cf6, #ffd700); height: 100%; width: ${Math.min((surroundingFlags.length / 3) * 100, 100)}%; transition: width 0.3s ease;"></div>
                </div>
                <div style="font-size: 11px; color: #a4b0be; margin-top: 5px;">
                    ${surroundingFlags.length}/3 flags needed for next level
                </div>
            </div>
            
            <div style="display: flex; gap: 10px;">
                <button id="place-flag-btn" style="flex: 1; background: #8b5cf6; border: none; color: white; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    🚩 Place Flag
                </button>
                <button id="upgrade-base-btn" style="flex: 1; background: #ffd700; border: none; color: #000; padding: 10px; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    ⬆️ Upgrade
                </button>
            </div>
        `;
        
        // Add to DOM
        document.body.appendChild(this.baseStatsModal);
        
        // Add event listeners
        document.getElementById('close-base-stats').addEventListener('click', () => {
            document.body.removeChild(this.baseStatsModal);
            this.baseStatsModal = null;
        });
        
        document.getElementById('place-flag-btn').addEventListener('click', () => {
            this.placeFlagAtPosition();
            document.body.removeChild(this.baseStatsModal);
            this.baseStatsModal = null;
            this.updateClickableAreas(); // Refresh the display
        });
        
        document.getElementById('upgrade-base-btn').addEventListener('click', () => {
            this.upgradeBase(base);
            document.body.removeChild(this.baseStatsModal);
            this.baseStatsModal = null;
            this.updateClickableAreas(); // Refresh the display
        });
        
        // Close on outside click
        this.baseStatsModal.addEventListener('click', (e) => {
            if (e.target === this.baseStatsModal) {
                document.body.removeChild(this.baseStatsModal);
                this.baseStatsModal = null;
            }
        });
    }

    handleFlagClick(flag) {
        console.log(`🏴 Flag clicked: ${flag.type}`);
        window.log(`🏴 Flag clicked: ${flag.type}`);
    }

    render() {
        if (!this.isInitialized || !this.visible) return;
        
        // Clear canvas
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        // Debug logging
        if (this.bases.length > 0) {
            console.log(`🏗️ Base Building Layer rendering ${this.bases.length} bases and ${this.flags.length} flags`);
        }
        
        this.renderContent();
        this.updateClickableAreas();
    }

    renderContent() {
        if (!this.ctx) return;

        // Render bases
        this.bases.forEach(base => {
            this.renderBase(base);
        });

        // Render flags
        this.flags.forEach(flag => {
            this.renderFlag(flag);
        });
    }

    // Convert GPS coordinates to screen coordinates using Leaflet map
    gpsToScreen(lat, lng) {
        if (!window.mapEngine || !window.mapEngine.map) {
            console.warn('🏗️ Map engine not available for GPS conversion');
            return null;
        }

        try {
            const map = window.mapEngine.map;
            const point = map.latLngToContainerPoint([lat, lng]);
            return { x: point.x, y: point.y };
        } catch (error) {
            console.warn('🏗️ Error converting GPS to screen coordinates:', error);
            return null;
        }
    }

    renderBase(base) {
        // Convert GPS coordinates to screen coordinates
        const screenPos = this.gpsToScreen(base.lat, base.lng);
        if (!screenPos) return; // Skip if conversion failed
        
        const { x, y } = screenPos;
        const { size, color, level } = base;
        
        console.log(`🏗️ Rendering base at GPS (${base.lat}, ${base.lng}) -> Screen (${x}, ${y}) with size ${size}`);
        
        this.ctx.save();
        
        // Base glow effect
        this.ctx.shadowColor = color;
        this.ctx.shadowBlur = 15;
        
        // Render base using player's selected flag symbol
        this.renderFlagSymbol(x, y, size, 'base');
        
        // Level indicator (smaller, positioned at bottom right)
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(level.toString(), x + size/3, y + size/3);
        
        // Clickable indicator
        this.ctx.fillStyle = '#ffff00';
        this.ctx.beginPath();
        this.ctx.arc(x + size/2 + 5, y - size/2 - 5, 4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
    }

    renderFlag(flag) {
        // Convert GPS coordinates to screen coordinates
        const screenPos = this.gpsToScreen(flag.lat, flag.lng);
        if (!screenPos) return; // Skip if conversion failed
        
        const { x, y } = screenPos;
        const { size, type } = flag;
        
        this.ctx.save();
        
        if (type === 'ant') {
            this.renderAnt(x, y, size);
        } else if (type === 'joint') {
            this.renderJointFlag(x, y, size);
        } else if (type === 'step') {
            this.renderStepIcon(x, y, size);
        } else {
            this.renderFlagIcon(x, y, size);
        }
        
        this.ctx.restore();
    }

    renderAnt(x, y, size) {
        // Use player's selected symbol for walking trail instead of ant
        this.renderWalkingSymbol(x, y, size);
    }

    renderJointFlag(x, y, size) {
        // Golden joint flag rendering
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add golden border
        this.ctx.strokeStyle = '#ffed4e';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Add "J" for joint
        this.ctx.fillStyle = '#000000';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('J', x, y);
    }

    renderFlagIcon(x, y, size) {
        // Use player's selected walking symbol for regular flags
        this.renderWalkingSymbol(x, y, size);
    }

    // Render walking symbol for player trail (from Symbol section)
    renderWalkingSymbol(x, y, size) {
        const symbolType = localStorage.getItem('eldritch_player_symbol') || 'sun';
        
        this.ctx.save();
        
        if (symbolType === 'sun') {
            this.renderSunSymbol(x, y, size);
        } else if (symbolType === 'star') {
            this.renderStarSymbol(x, y, size);
        } else if (symbolType === 'sparkle') {
            this.renderSparkleSymbol(x, y, size);
        } else if (symbolType === 'crescent') {
            this.renderCrescentSymbol(x, y, size);
        } else if (symbolType === 'diamond') {
            this.renderDiamondSymbol(x, y, size);
        } else if (symbolType === 'aurora') {
            this.renderAuroraSymbol(x, y, size);
        } else if (symbolType === 'lightning') {
            this.renderLightningSymbol(x, y, size);
        } else if (symbolType === 'flame') {
            this.renderFlameSymbol(x, y, size);
        } else if (symbolType === 'snowflake') {
            this.renderSnowflakeSymbol(x, y, size);
        } else if (symbolType === 'wave') {
            this.renderWaveSymbol(x, y, size);
        } else {
            // Default to a simple circle
            this.ctx.fillStyle = '#ff6b35';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        this.ctx.restore();
    }

    // Render flag symbol for bases and flags (from Path Symbol section)
    renderFlagSymbol(x, y, size, context = 'flag') {
        const flagType = localStorage.getItem('eldritch_player_path_symbol') || 'finnish';
        
        // Base gets a larger, more prominent symbol
        const symbolSize = context === 'base' ? size * 0.8 : size;
        
        this.ctx.save();
        
        if (flagType === 'finnish') {
            this.renderFinnishFlag(x, y, symbolSize);
        } else if (flagType === 'swedish') {
            this.renderSwedishFlag(x, y, symbolSize);
        } else if (flagType === 'norwegian') {
            this.renderNorwegianFlag(x, y, symbolSize);
        } else if (flagType === 'flower_of_life') {
            this.renderFlowerOfLifeSymbol(x, y, symbolSize);
        } else if (flagType === 'sacred_triangle') {
            this.renderSacredTriangleSymbol(x, y, symbolSize);
        } else if (flagType === 'hexagon') {
            this.renderHexagonSymbol(x, y, symbolSize);
        } else if (flagType === 'cosmic_spiral') {
            this.renderCosmicSpiralSymbol(x, y, symbolSize);
        } else if (flagType === 'star') {
            this.renderStarSymbol(x, y, symbolSize);
        } else {
            // Default to a simple circle with symbol
            this.ctx.fillStyle = '#8b5cf6';
            this.ctx.beginPath();
            this.ctx.arc(x, y, symbolSize/2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText('?', x, y);
        }
        
        this.ctx.restore();
    }

    // Render Finnish flag
    renderFinnishFlag(x, y, size) {
        // White background
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // Blue cross
        this.ctx.fillStyle = '#003580';
        const crossWidth = size * 0.15;
        const crossHeight = size * 0.4;
        
        // Horizontal bar
        this.ctx.fillRect(x - size/2, y - crossWidth/2, size, crossWidth);
        // Vertical bar
        this.ctx.fillRect(x - crossWidth/2, y - size/2, crossWidth, size);
    }

    // Render Swedish flag
    renderSwedishFlag(x, y, size) {
        // Blue background
        this.ctx.fillStyle = '#006AA7';
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // Yellow cross
        this.ctx.fillStyle = '#FECC00';
        const crossWidth = size * 0.15;
        const crossHeight = size * 0.4;
        
        // Horizontal bar
        this.ctx.fillRect(x - size/2, y - crossWidth/2, size, crossWidth);
        // Vertical bar
        this.ctx.fillRect(x - crossWidth/2, y - size/2, crossWidth, size);
    }

    // Render Norwegian flag
    renderNorwegianFlag(x, y, size) {
        // Red background
        this.ctx.fillStyle = '#EF2B2D';
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        
        // White cross
        this.ctx.fillStyle = '#ffffff';
        const crossWidth = size * 0.12;
        
        // Horizontal bar
        this.ctx.fillRect(x - size/2, y - crossWidth/2, size, crossWidth);
        // Vertical bar
        this.ctx.fillRect(x - crossWidth/2, y - size/2, crossWidth, size);
        
        // Blue cross on top
        this.ctx.fillStyle = '#002868';
        const blueCrossWidth = size * 0.08;
        
        // Horizontal bar
        this.ctx.fillRect(x - size/2, y - blueCrossWidth/2, size, blueCrossWidth);
        // Vertical bar
        this.ctx.fillRect(x - blueCrossWidth/2, y - size/2, blueCrossWidth, size);
    }

    // Render cosmic symbol
    renderCosmicSymbol(x, y, size) {
        // Cosmic star symbol
        this.ctx.fillStyle = '#8b5cf6';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Star points
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x1 = x + Math.cos(angle) * (size/2 - 2);
            const y1 = y + Math.sin(angle) * (size/2 - 2);
            const x2 = x + Math.cos(angle) * (size/2 + 2);
            const y2 = y + Math.sin(angle) * (size/2 + 2);
            
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
            this.ctx.lineTo(x2, y2);
        }
        this.ctx.stroke();
    }

    // Render eldritch symbol
    renderEldritchSymbol(x, y, size) {
        // Dark circle
        this.ctx.fillStyle = '#2d1b69';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Tentacle-like lines
        this.ctx.strokeStyle = '#ff6b35';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x1 = x + Math.cos(angle) * (size/4);
            const y1 = y + Math.sin(angle) * (size/4);
            const x2 = x + Math.cos(angle) * (size/2 + 2);
            const y2 = y + Math.sin(angle) * (size/2 + 2);
            
            this.ctx.moveTo(x1, y1);
            this.ctx.quadraticCurveTo(x1 + (x2-x1)/2, y1 + (y2-y1)/2 + 3, x2, y2);
        }
        this.ctx.stroke();
    }

    // Render step icon (small footprint)
    renderStepIcon(x, y, size) {
        this.ctx.fillStyle = '#2ed573';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Small footprint shape
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('👣', x, y);
    }

    // Walking symbol rendering methods (from Symbol section)
    renderSunSymbol(x, y, size) {
        // Yellow sunburst
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sun rays
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const angle = (i * Math.PI) / 4;
            const x1 = x + Math.cos(angle) * (size/2 + 2);
            const y1 = y + Math.sin(angle) * (size/2 + 2);
            const x2 = x + Math.cos(angle) * (size/2 + 6);
            const y2 = y + Math.sin(angle) * (size/2 + 6);
            
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
        }
        this.ctx.stroke();
    }

    renderStarSymbol(x, y, size) {
        // Five-pointed star
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const x1 = x + Math.cos(angle) * (size/2);
            const y1 = y + Math.sin(angle) * (size/2);
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
        }
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderSparkleSymbol(x, y, size) {
        // Sparkling star
        this.ctx.fillStyle = '#ff8c00';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Sparkle lines
        this.ctx.strokeStyle = '#ffd700';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/2, y);
        this.ctx.lineTo(x + size/2, y);
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x, y + size/2);
        this.ctx.moveTo(x - size/3, y - size/3);
        this.ctx.lineTo(x + size/3, y + size/3);
        this.ctx.moveTo(x - size/3, y + size/3);
        this.ctx.lineTo(x + size/3, y - size/3);
        this.ctx.stroke();
    }

    renderCrescentSymbol(x, y, size) {
        // Crescent moon
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Cut out crescent shape
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(x + size/4, y, size/2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    renderDiamondSymbol(x, y, size) {
        // Diamond shape
        this.ctx.fillStyle = '#87ceeb';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x + size/2, y);
        this.ctx.lineTo(x, y + size/2);
        this.ctx.lineTo(x - size/2, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderAuroraSymbol(x, y, size) {
        // Aurora-like wavy lines
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * size/6;
            this.ctx.moveTo(x - size/2, y + offset);
            for (let j = 0; j <= 10; j++) {
                const t = j / 10;
                const waveX = x - size/2 + (size * t);
                const waveY = y + offset + Math.sin(t * Math.PI * 3) * size/8;
                this.ctx.lineTo(waveX, waveY);
            }
        }
        this.ctx.stroke();
    }

    renderLightningSymbol(x, y, size) {
        // Lightning bolt
        this.ctx.fillStyle = '#ffd700';
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/4, y - size/2);
        this.ctx.lineTo(x + size/4, y - size/6);
        this.ctx.lineTo(x - size/6, y);
        this.ctx.lineTo(x + size/4, y + size/2);
        this.ctx.lineTo(x - size/4, y + size/6);
        this.ctx.lineTo(x + size/6, y);
        this.ctx.closePath();
        this.ctx.fill();
    }

    renderFlameSymbol(x, y, size) {
        // Flame shape
        this.ctx.fillStyle = '#ff6b35';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y + size/2);
        this.ctx.quadraticCurveTo(x - size/3, y - size/2, x, y - size/2);
        this.ctx.quadraticCurveTo(x + size/3, y - size/2, x, y + size/2);
        this.ctx.fill();
    }

    renderSnowflakeSymbol(x, y, size) {
        // Snowflake
        this.ctx.strokeStyle = '#87ceeb';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Main cross
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x, y + size/2);
        this.ctx.moveTo(x - size/2, y);
        this.ctx.lineTo(x + size/2, y);
        // Diagonal lines
        this.ctx.moveTo(x - size/3, y - size/3);
        this.ctx.lineTo(x + size/3, y + size/3);
        this.ctx.moveTo(x - size/3, y + size/3);
        this.ctx.lineTo(x + size/3, y - size/3);
        this.ctx.stroke();
    }

    renderWaveSymbol(x, y, size) {
        // Wave
        this.ctx.strokeStyle = '#87ceeb';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/2, y);
        for (let i = 0; i <= 10; i++) {
            const t = i / 10;
            const waveX = x - size/2 + (size * t);
            const waveY = y + Math.sin(t * Math.PI * 2) * size/4;
            this.ctx.lineTo(waveX, waveY);
        }
        this.ctx.stroke();
    }

    // Path symbol rendering methods (from Path Symbol section)
    renderFlowerOfLifeSymbol(x, y, size) {
        // Flower of Life pattern (simplified)
        this.ctx.strokeStyle = '#8b5cf6';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        // Central circle
        this.ctx.arc(x, y, size/4, 0, Math.PI * 2);
        
        // Six surrounding circles
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const circleX = x + Math.cos(angle) * size/3;
            const circleY = y + Math.sin(angle) * size/3;
            this.ctx.arc(circleX, circleY, size/6, 0, Math.PI * 2);
        }
        
        this.ctx.stroke();
    }

    renderSacredTriangleSymbol(x, y, size) {
        // Sacred triangle
        this.ctx.strokeStyle = '#2ed573';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - size/2);
        this.ctx.lineTo(x - size/2, y + size/2);
        this.ctx.lineTo(x + size/2, y + size/2);
        this.ctx.closePath();
        this.ctx.stroke();
    }

    renderHexagonSymbol(x, y, size) {
        // Hexagon
        this.ctx.strokeStyle = '#ff6b35';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            const x1 = x + Math.cos(angle) * (size/2);
            const y1 = y + Math.sin(angle) * (size/2);
            if (i === 0) {
                this.ctx.moveTo(x1, y1);
            } else {
                this.ctx.lineTo(x1, y1);
            }
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    renderCosmicSpiralSymbol(x, y, size) {
        // Cosmic spiral (infinity symbol)
        this.ctx.strokeStyle = '#ff69b4';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        
        const centerX = x;
        const centerY = y;
        const radius = size/3;
        
        // Left loop
        this.ctx.arc(centerX - radius/2, centerY, radius/2, 0, Math.PI * 2);
        // Right loop
        this.ctx.arc(centerX + radius/2, centerY, radius/2, 0, Math.PI * 2);
        
        this.ctx.stroke();
    }

    // Public methods for external use
    addStepFromExternal() {
        this.addStep();
        console.log(`🏗️ Step added from external system. Total: ${this.steps}`);
    }


    placeFlagAtPosition() {
        // Check if there's a joint flag present
        const hasJointFlag = this.flags.some(flag => flag.type === 'joint');
        if (!hasJointFlag) {
            if (window.log) {
                window.log('🚩 Cannot place flag: No joint flag present', 'warn');
            }
            return false;
        }

        const playerPosition = window.geolocationManager ? window.geolocationManager.getCurrentPosition() : null;
        if (!playerPosition) {
            if (window.log) {
                window.log('🚩 Cannot place flag: No player position', 'warn');
            }
            return false;
        }

        const flag = {
            id: 'flag_' + Date.now(),
            lat: playerPosition.lat,
            lng: playerPosition.lng,
            type: 'player',
            size: 20,
            color: '#8b5cf6',
            timestamp: Date.now()
        };

        this.flags.push(flag);
        this.saveFlags();
        
        // Check if base should grow
        this.checkBaseGrowth();
        
        console.log(`🚩 Flag placed at (${playerPosition.lat}, ${playerPosition.lng})`);
        if (window.log) {
            window.log(`🚩 Flag placed at (${playerPosition.lat}, ${playerPosition.lng})`, 'success');
        }
        
        return true;
    }

    // Check if base should grow when surrounded by flags
    checkBaseGrowth() {
        this.bases.forEach(base => {
            const surroundingFlags = this.getSurroundingFlags(base);
            if (surroundingFlags.length >= 3) { // Base grows when surrounded by 3+ flags
                this.growBase(base);
            }
        });
    }

    getStats() {
        const mainBase = this.bases[0];
        if (!mainBase) {
            return {
                steps: this.steps,
                flags: this.flags.length,
                ants: 0,
                baseLevel: 0,
                baseSize: 0,
                flagsAroundBase: 0,
                maxFlags: 0
            };
        }
        
        const surroundingFlags = this.getSurroundingFlags(mainBase);
        const ants = this.flags.filter(f => f.type === 'ant').length;
        
        return {
            steps: this.steps,
            flags: this.flags.length,
            ants: ants,
            baseLevel: mainBase.level,
            baseSize: mainBase.size,
            flagsAroundBase: surroundingFlags.length,
            maxFlags: mainBase.maxFlags
        };
    }

    // Create clickable areas for bases
    createClickableAreas() {
        // Remove existing clickable areas
        this.removeClickableAreas();
        
        // Create clickable areas for each base
        this.bases.forEach((base, index) => {
            // Convert GPS coordinates to screen coordinates
            const screenPos = this.gpsToScreen(base.lat, base.lng);
            if (!screenPos) return; // Skip if conversion failed
            
            const clickableArea = document.createElement('div');
            clickableArea.className = 'base-clickable-area';
            clickableArea.style.cssText = `
                position: absolute;
                left: ${screenPos.x - base.size/2}px;
                top: ${screenPos.y - base.size/2}px;
                width: ${base.size}px;
                height: ${base.size}px;
                border-radius: 50%;
                background: transparent;
                cursor: pointer;
                z-index: 16;
                pointer-events: auto;
            `;
            
            // Add click handler
            clickableArea.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showBaseStats(base);
            });
            
            // Add to DOM
            document.body.appendChild(clickableArea);
            this.clickableAreas.push(clickableArea);
        });
    }
    
    // Remove all clickable areas
    removeClickableAreas() {
        this.clickableAreas.forEach(area => {
            if (area.parentNode) {
                area.parentNode.removeChild(area);
            }
        });
        this.clickableAreas = [];
    }
    
    // Update clickable areas when bases change
    updateClickableAreas() {
        this.createClickableAreas();
    }
    
    // Cleanup method
    destroy() {
        this.removeClickableAreas();
        super.destroy();
    }

    // Calculate area taken by flags around a base
    calculateAreaTaken(base, surroundingFlags) {
        if (surroundingFlags.length === 0) return 0;
        
        // Simple area calculation based on flag count and base size
        const baseArea = Math.PI * Math.pow(base.size / 2, 2);
        const flagArea = surroundingFlags.length * Math.PI * Math.pow(20 / 2, 2); // Assuming 20px flag radius
        return baseArea + flagArea;
    }
    
    // Upgrade base (if player has enough steps)
    upgradeBase(base) {
        const upgradeCost = base.level * 100; // 100 steps per level
        const currentSteps = this.steps || 0;
        
        if (currentSteps < upgradeCost) {
            if (window.log) {
                window.log(`🏗️ Not enough steps to upgrade base. Need ${upgradeCost}, have ${currentSteps}`, 'warn');
            }
            return false;
        }
        
        // Deduct steps
        this.steps -= upgradeCost;
        this.saveSteps();
        
        // Upgrade base
        base.level = (base.level || 1) + 1;
        base.size = Math.min(base.size + 10, 100); // Max size 100px
        base.maxFlags = (base.maxFlags || 8) + 2; // Increase max flags
        
        this.saveBaseData();
        
        if (window.log) {
            window.log(`🏗️ Base upgraded to level ${base.level}! Size: ${base.size}px, Max flags: ${base.maxFlags}`, 'success');
        }
        
        return true;
    }

    // Debug method to check base state
    debugBaseState() {
        console.log('🏗️ Base Building Layer Debug:');
        console.log('- Bases:', this.bases.length);
        console.log('- Flags:', this.flags.length);
        console.log('- Steps:', this.steps);
        console.log('- Canvas visible:', this.canvas.style.display !== 'none');
        console.log('- Canvas size:', this.canvas.width, 'x', this.canvas.height);
        console.log('- Clickable areas:', this.clickableAreas.length);
        
        if (this.bases.length > 0) {
            const base = this.bases[0];
            console.log('- First base:', {
                id: base.id,
                lat: base.lat,
                lng: base.lng,
                size: base.size,
                level: base.level
            });
        }
        
        if (window.log) {
            window.log(`Base Building Debug: ${this.bases.length} bases, ${this.flags.length} flags, ${this.steps} steps`, 'info');
        }
    }
}

// Export for global access
window.BaseBuildingLayer = BaseBuildingLayer;
