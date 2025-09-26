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
            const distance = Math.sqrt((flag.x - base.x) ** 2 + (flag.y - base.y) ** 2);
            return distance <= 80; // Within 80 pixels of base
        });
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

        this.baseStatsModal = document.createElement('div');
        this.baseStatsModal.className = 'base-stats-modal';
        this.baseStatsModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.95);
            color: white;
            padding: 20px;
            border-radius: 15px;
            border: 3px solid ${base.color};
            z-index: 1000;
            font-family: Arial, sans-serif;
            min-width: 300px;
            box-shadow: 0 0 30px ${base.color}50;
        `;

        const surroundingFlags = this.getSurroundingFlags(base);
        const ants = this.flags.filter(f => f.type === 'ant').length;

        this.baseStatsModal.innerHTML = `
            <h3 style="margin-top: 0; color: ${base.color}; text-align: center;">🏗️ Base Stats</h3>
            <div style="margin-bottom: 15px;">
                <strong>Level:</strong> ${base.level}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Size:</strong> ${base.size}px
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Flags Around Base:</strong> ${surroundingFlags.length}/${base.maxFlags}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Total Flags:</strong> ${this.flags.length}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Ants (Steps/50):</strong> ${ants}
            </div>
            <div style="margin-bottom: 15px;">
                <strong>Total Steps:</strong> ${this.steps}
            </div>
            <div style="margin-bottom: 20px;">
                <strong>Next Growth:</strong> ${base.maxFlags - surroundingFlags.length} more flags needed
            </div>
            <button onclick="this.parentElement.remove()" style="
                background: ${base.color};
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                width: 100%;
            ">Close</button>
        `;

        document.body.appendChild(this.baseStatsModal);
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

    renderBase(base) {
        const { x, y, size, color, level } = base;
        
        console.log(`🏗️ Rendering base at (${x}, ${y}) with size ${size}`);
        
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
        const { x, y, size, type } = flag;
        
        this.ctx.save();
        
        if (type === 'ant') {
            this.renderAnt(x, y, size);
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
    }

    placeFlagAtPosition(x, y) {
        return this.placeFlag(x, y);
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
            const clickableArea = document.createElement('div');
            clickableArea.className = 'base-clickable-area';
            clickableArea.style.cssText = `
                position: absolute;
                left: ${base.x - base.size/2}px;
                top: ${base.y - base.size/2}px;
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
                x: base.x,
                y: base.y,
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
