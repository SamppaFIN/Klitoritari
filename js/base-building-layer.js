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
        const ant = {
            id: `ant_${Date.now()}`,
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: 8,
            type: 'ant',
            timestamp: Date.now()
        };
        
        this.flags.push(ant);
        this.saveFlags();
        
        console.log(`🐜 Ant added! Total ants: ${this.flags.filter(f => f.type === 'ant').length}`);
        window.log(`🐜 Ant added! Total ants: ${this.flags.filter(f => f.type === 'ant').length}`);
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
        
        // Base circle
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(x, y, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Base border
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Level indicator
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(level.toString(), x, y);
        
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
        } else {
            this.renderFlagIcon(x, y, size);
        }
        
        this.ctx.restore();
    }

    renderAnt(x, y, size) {
        // Simple ant SVG-like rendering
        this.ctx.fillStyle = '#8B4513'; // Brown color
        
        // Ant body (3 segments)
        this.ctx.beginPath();
        this.ctx.arc(x - size/3, y, size/4, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, size/3, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(x + size/3, y, size/4, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Ant legs
        this.ctx.strokeStyle = '#8B4513';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/3, y - size/4);
        this.ctx.lineTo(x - size/2, y - size/2);
        this.ctx.moveTo(x - size/3, y + size/4);
        this.ctx.lineTo(x - size/2, y + size/2);
        this.ctx.moveTo(x, y - size/4);
        this.ctx.lineTo(x - size/6, y - size/2);
        this.ctx.moveTo(x, y + size/4);
        this.ctx.lineTo(x - size/6, y + size/2);
        this.ctx.moveTo(x + size/3, y - size/4);
        this.ctx.lineTo(x + size/2, y - size/2);
        this.ctx.moveTo(x + size/3, y + size/4);
        this.ctx.lineTo(x + size/2, y + size/2);
        this.ctx.stroke();
        
        // Ant antennae
        this.ctx.beginPath();
        this.ctx.moveTo(x - size/3, y - size/4);
        this.ctx.lineTo(x - size/2, y - size/2);
        this.ctx.moveTo(x - size/3, y - size/4);
        this.ctx.lineTo(x - size/2, y - size/2);
        this.ctx.stroke();
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
        // Get player's selected flag type
        const flagType = localStorage.getItem('eldritch_player_path_symbol') || 'finnish';
        
        // Simple flag rendering based on type
        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(x - size/2, y - size/2, size, size);
        
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x - size/2, y - size/2, size, size);
        
        // Add flag type indicator
        this.ctx.fillStyle = '#000000';
        this.ctx.font = '10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(flagType.charAt(0).toUpperCase(), x, y);
    }

    // Public methods for external use
    addStepFromExternal() {
        this.addStep();
        console.log(`🏗️ Step added from external system. Total: ${this.steps}`);
        
        // Check if we should add an ant icon for every 50 steps
        if (this.steps % 50 === 0) {
            this.addAntIcon();
        }
    }

    // Add ant icon when player reaches 50 steps
    addAntIcon() {
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
        
        console.log(`🐜 Ant icon added at step ${this.steps}`);
        if (window.log) {
            window.log(`🐜 Ant icon added at step ${this.steps}`, 'info');
        }
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
