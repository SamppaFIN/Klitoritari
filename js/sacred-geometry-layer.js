/**
 * Sacred Geometry Effects Layer
 * Renders flags, paths, territories with cosmic effects and sacred geometry patterns
 * Z-Index: 10 (above map background, below clickable objects)
 */

class SacredGeometryLayer extends RenderLayer {
    constructor() {
        super('sacredGeometry', 10);
        this.flags = [];
        this.paths = [];
        this.territories = [];
        this.cosmicEffects = [];
        this.animationTime = 0;
        this.isInitialized = false;
        
        console.log('🔮 Initializing Sacred Geometry Layer...');
        this.init();
    }
    
    init() {
        super.init();
        this.setupCosmicEffects();
        this.loadExistingData();
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
        // TODO: Integrate with existing Finnish flag system
        // For now, create some test flags
        this.flags = [
            {
                id: 'flag_1',
                x: 100,
                y: 100,
                type: 'finnish',
                energy: 0.8,
                connections: []
            },
            {
                id: 'flag_2', 
                x: 300,
                y: 200,
                type: 'finnish',
                energy: 0.6,
                connections: []
            }
        ];
        
        console.log(`🔮 Loaded ${this.flags.length} flags`);
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
        const { x, y, energy, type } = flag;
        
        this.ctx.save();
        
        // Energy pulse effect
        const pulse = Math.sin(this.animationTime * 2) * 0.2 + 0.8;
        this.ctx.globalAlpha = energy * pulse * 0.9;
        
        // Flag base
        this.ctx.fillStyle = this.getCosmicColor(energy);
        this.ctx.fillRect(x - 15, y - 10, 30, 20);
        
        // Flag pole
        this.ctx.fillStyle = '#8B4513';
        this.ctx.fillRect(x - 2, y - 10, 4, 30);
        
        // Sacred geometry around flag
        this.ctx.strokeStyle = this.getCosmicColor(energy);
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = energy * 0.6;
        
        // Draw sacred circle
        this.renderSacredCircle(x, y, 25);
        
        // Draw energy field
        this.ctx.globalAlpha = energy * 0.3;
        this.ctx.fillStyle = this.getCosmicColor(energy);
        this.ctx.beginPath();
        this.ctx.arc(x, y, 35, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
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
