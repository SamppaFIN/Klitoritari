/**
 * TerritoryLayer - Base territories and influence zones
 * 
 * This layer handles:
 * - Player base territories
 * - Influence zone visualization
 * - Territory expansion effects
 * - Base connection lines
 * 
 * Z-Index: 2 (above terrain)
 */

class TerritoryLayer extends BaseLayer {
    constructor() {
        super('territory');
        this.zIndex = 2;
        this.territories = new Map();
        this.influenceZones = new Map();
        this.territoryColors = {
            player: '#4ade80',
            enemy: '#ef4444',
            neutral: '#6b7280',
            contested: '#f59e0b'
        };
        this.animationPhase = 0;
        this.territoryEffects = new Map();
    }

    init() {
        super.init();
        console.log('🏰 TerritoryLayer: Initializing territory system...');
        
        // Initialize territory data
        this.initializeTerritories();
        
        // Set up animation
        this.startAnimation();
        
        console.log('🏰 TerritoryLayer: Territory system initialized');
    }

    initializeTerritories() {
        // Load existing territories from game state
        this.loadTerritoriesFromGameState();
    }

    loadTerritoriesFromGameState() {
        if (this.gameState) {
            const bases = this.gameState.get('bases');
            if (bases && bases.forEach) {
                bases.forEach((base, id) => {
                    this.addTerritory(id, base);
                });
            }
        }
    }

    startAnimation() {
        const animate = (timestamp) => {
            if (!this.isVisible) {
                this.animationId = requestAnimationFrame(animate);
                return;
            }

            this.animationPhase += 0.01;
            if (this.animationPhase > Math.PI * 2) {
                this.animationPhase = 0;
            }

            this.animationId = requestAnimationFrame(animate);
        };

        this.animationId = requestAnimationFrame(animate);
    }

    doRender(deltaTime) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render territories
        this.renderTerritories();

        // Render influence zones
        this.renderInfluenceZones();

        // Render territory effects
        this.renderTerritoryEffects();
    }

    renderTerritories() {
        this.territories.forEach((territory, id) => {
            this.renderTerritory(territory);
        });
    }

    renderTerritory(territory) {
        const { position, radius, type, color } = territory;
        
        if (!position || !radius) return;

        // Convert GPS to screen coordinates
        const screenPos = this.gpsToScreen(position.lat, position.lng);
        if (!screenPos) return;

        this.ctx.save();

        // Draw territory circle
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 0.3;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw territory border
        this.ctx.globalAlpha = 0.8;
        this.ctx.stroke();

        // Draw territory center
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, 5, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    renderInfluenceZones() {
        this.influenceZones.forEach((zone, id) => {
            this.renderInfluenceZone(zone);
        });
    }

    renderInfluenceZone(zone) {
        const { position, radius, intensity, color } = zone;
        
        if (!position || !radius) return;

        // Convert GPS to screen coordinates
        const screenPos = this.gpsToScreen(position.lat, position.lng);
        if (!screenPos) return;

        this.ctx.save();

        // Create radial gradient for influence zone
        const gradient = this.ctx.createRadialGradient(
            screenPos.x, screenPos.y, 0,
            screenPos.x, screenPos.y, radius
        );
        gradient.addColorStop(0, `${color}${Math.floor(intensity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${color}00`);

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.restore();
    }

    renderTerritoryEffects() {
        this.territoryEffects.forEach((effect, id) => {
            this.renderTerritoryEffect(effect);
        });
    }

    renderTerritoryEffect(effect) {
        const { position, type, phase } = effect;
        
        if (!position) return;

        // Convert GPS to screen coordinates
        const screenPos = this.gpsToScreen(position.lat, position.lng);
        if (!screenPos) return;

        this.ctx.save();

        switch (type) {
            case 'expansion':
                this.renderExpansionEffect(screenPos, phase);
                break;
            case 'contraction':
                this.renderContractionEffect(screenPos, phase);
                break;
            case 'pulse':
                this.renderPulseEffect(screenPos, phase);
                break;
        }

        this.ctx.restore();
    }

    renderExpansionEffect(screenPos, phase) {
        const radius = phase * 50;
        const opacity = 1 - phase;

        this.ctx.strokeStyle = `rgba(74, 222, 128, ${opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    renderContractionEffect(screenPos, phase) {
        const radius = 50 - (phase * 50);
        const opacity = 1 - phase;

        this.ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    renderPulseEffect(screenPos, phase) {
        const radius = 20 + Math.sin(phase * Math.PI * 2) * 10;
        const opacity = 0.5 + Math.sin(phase * Math.PI * 2) * 0.3;

        this.ctx.fillStyle = `rgba(74, 222, 128, ${opacity})`;
        this.ctx.beginPath();
        this.ctx.arc(screenPos.x, screenPos.y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    // Public methods for external control
    addTerritory(id, base) {
        const territory = {
            id,
            position: base.position,
            radius: base.radius || 100,
            type: base.type || 'player',
            color: this.territoryColors[base.type] || this.territoryColors.player,
            owner: base.owner,
            level: base.level || 1,
            resources: base.resources || {}
        };

        this.territories.set(id, territory);
        console.log('🏰 TerritoryLayer: Added territory', id);
    }

    removeTerritory(id) {
        this.territories.delete(id);
        console.log('🏰 TerritoryLayer: Removed territory', id);
    }

    updateTerritory(id, updates) {
        const territory = this.territories.get(id);
        if (territory) {
            Object.assign(territory, updates);
            console.log('🏰 TerritoryLayer: Updated territory', id);
        }
    }

    addInfluenceZone(id, zone) {
        const influenceZone = {
            id,
            position: zone.position,
            radius: zone.radius || 200,
            intensity: zone.intensity || 0.5,
            color: zone.color || this.territoryColors.player
        };

        this.influenceZones.set(id, influenceZone);
        console.log('🏰 TerritoryLayer: Added influence zone', id);
    }

    removeInfluenceZone(id) {
        this.influenceZones.delete(id);
        console.log('🏰 TerritoryLayer: Removed influence zone', id);
    }

    addTerritoryEffect(id, effect) {
        const territoryEffect = {
            id,
            position: effect.position,
            type: effect.type || 'pulse',
            phase: 0,
            duration: effect.duration || 1000
        };

        this.territoryEffects.set(id, territoryEffect);
        console.log('🏰 TerritoryLayer: Added territory effect', id);
    }

    removeTerritoryEffect(id) {
        this.territoryEffects.delete(id);
        console.log('🏰 TerritoryLayer: Removed territory effect', id);
    }

    getTerritoryAt(lat, lng) {
        for (const [id, territory] of this.territories) {
            const distance = this.calculateDistance(
                lat, lng,
                territory.position.lat, territory.position.lng
            );
            if (distance <= territory.radius) {
                return territory;
            }
        }
        return null;
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    setTerritoryColor(type, color) {
        this.territoryColors[type] = color;
    }

    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        super.destroy();
        console.log('🏰 TerritoryLayer: Destroyed');
    }
}

// Make globally available
window.TerritoryLayer = TerritoryLayer;
