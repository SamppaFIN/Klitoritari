/**
 * TerrainLayer - Ground textures and elevation data
 * 
 * This layer handles:
 * - Terrain texture mapping
 * - Elevation visualization
 * - Biome transitions
 * - Ground-level effects
 * 
 * Z-Index: 1 (above background)
 */

class TerrainLayer extends BaseLayer {
    constructor() {
        super('terrain');
        this.zIndex = 1;
        this.terrainData = null;
        this.textures = new Map();
        this.biomes = {
            forest: { color: '#2d5016', texture: 'forest' },
            mountain: { color: '#8b7355', texture: 'mountain' },
            water: { color: '#1e3a8a', texture: 'water' },
            desert: { color: '#d97706', texture: 'desert' },
            tundra: { color: '#f3f4f6', texture: 'tundra' },
            urban: { color: '#374151', texture: 'urban' }
        };
        this.elevationData = null;
        this.terrainCache = new Map();
        this.cacheSize = 100;
    }

    init() {
        super.init();
        console.log('🏔️ TerrainLayer: Initializing terrain system...');
        
        // Initialize terrain data
        this.initializeTerrainData();
        
        // Load terrain textures
        this.loadTerrainTextures();
        
        console.log('🏔️ TerrainLayer: Terrain system initialized');
    }

    initializeTerrainData() {
        // Initialize with default terrain data
        // In a real implementation, this would load from a terrain data source
        this.terrainData = {
            width: 1000,
            height: 1000,
            tileSize: 32,
            data: []
        };
        
        // Generate terrain data after structure is set up
        this.terrainData.data = this.generateDefaultTerrain();
    }

    generateDefaultTerrain() {
        const data = [];
        const width = 1000;
        const height = 1000;
        const tileSize = 32;
        
        for (let y = 0; y < height; y++) {
            const row = [];
            for (let x = 0; x < width; x++) {
                // Simple noise-based terrain generation
                const noise = this.simplexNoise(x * 0.01, y * 0.01);
                const elevation = noise * 100;
                
                let biome = 'forest';
                if (elevation > 60) biome = 'mountain';
                else if (elevation < -20) biome = 'water';
                else if (elevation > 40) biome = 'tundra';
                else if (elevation < 0) biome = 'desert';
                
                row.push({
                    biome,
                    elevation,
                    moisture: this.simplexNoise(x * 0.02, y * 0.02) * 50 + 50,
                    temperature: this.simplexNoise(x * 0.015, y * 0.015) * 30 + 20
                });
            }
            data.push(row);
        }
        
        return data;
    }

    simplexNoise(x, y) {
        // Simplified noise function for terrain generation
        // In a real implementation, use a proper noise library
        return Math.sin(x) * Math.cos(y) * 0.5 + 
               Math.sin(x * 2) * Math.cos(y * 2) * 0.25 +
               Math.sin(x * 4) * Math.cos(y * 4) * 0.125;
    }

    loadTerrainTextures() {
        // Load terrain textures
        // For now, we'll use solid colors, but in a real implementation
        // this would load actual texture images
        this.textures.set('forest', this.createTexturePattern('#2d5016', 'forest'));
        this.textures.set('mountain', this.createTexturePattern('#8b7355', 'mountain'));
        this.textures.set('water', this.createTexturePattern('#1e3a8a', 'water'));
        this.textures.set('desert', this.createTexturePattern('#d97706', 'desert'));
        this.textures.set('tundra', this.createTexturePattern('#f3f4f6', 'tundra'));
        this.textures.set('urban', this.createTexturePattern('#374151', 'urban'));
    }

    createTexturePattern(color, type) {
        // Create a simple texture pattern
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Base color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 64, 64);
        
        // Add texture based on type
        switch (type) {
            case 'forest':
                this.addForestTexture(ctx);
                break;
            case 'mountain':
                this.addMountainTexture(ctx);
                break;
            case 'water':
                this.addWaterTexture(ctx);
                break;
            case 'desert':
                this.addDesertTexture(ctx);
                break;
            case 'tundra':
                this.addTundraTexture(ctx);
                break;
            case 'urban':
                this.addUrbanTexture(ctx);
                break;
        }
        
        return canvas;
    }

    addForestTexture(ctx) {
        // Add forest-like texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 20; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 3 + 1;
            ctx.fillRect(x, y, size, size);
        }
    }

    addMountainTexture(ctx) {
        // Add mountain-like texture
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * 64, Math.random() * 64);
            ctx.lineTo(Math.random() * 64, Math.random() * 64);
            ctx.stroke();
        }
    }

    addWaterTexture(ctx) {
        // Add water-like texture
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 2 + 1;
            ctx.fillRect(x, y, size, size);
        }
    }

    addDesertTexture(ctx) {
        // Add desert-like texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        for (let i = 0; i < 30; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 2 + 0.5;
            ctx.fillRect(x, y, size, size);
        }
    }

    addTundraTexture(ctx) {
        // Add tundra-like texture
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        for (let i = 0; i < 25; i++) {
            const x = Math.random() * 64;
            const y = Math.random() * 64;
            const size = Math.random() * 1.5 + 0.5;
            ctx.fillRect(x, y, size, size);
        }
    }

    addUrbanTexture(ctx) {
        // Add urban-like texture
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * 16);
            ctx.lineTo(64, i * 16);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(i * 16, 0);
            ctx.lineTo(i * 16, 64);
            ctx.stroke();
        }
    }

    doRender(deltaTime) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Render terrain
        this.renderTerrain();
    }

    renderTerrain() {
        if (!this.terrainData) return;

        const { width, height, tileSize } = this.terrainData;
        const tilesX = Math.ceil(this.canvas.width / tileSize) + 1;
        const tilesY = Math.ceil(this.canvas.height / tileSize) + 1;

        for (let y = 0; y < tilesY; y++) {
            for (let x = 0; x < tilesX; x++) {
                const tileX = x % width;
                const tileY = y % height;
                const terrain = this.terrainData.data[tileY][tileX];
                
                this.renderTerrainTile(x * tileSize, y * tileSize, terrain);
            }
        }
    }

    renderTerrainTile(x, y, terrain) {
        const { tileSize } = this.terrainData;
        const biome = this.biomes[terrain.biome];
        
        if (!biome) return;

        // Get texture from cache or create new one
        let texture = this.terrainCache.get(terrain.biome);
        if (!texture) {
            texture = this.textures.get(terrain.biome);
            if (this.terrainCache.size >= this.cacheSize) {
                // Remove oldest entry
                const firstKey = this.terrainCache.keys().next().value;
                this.terrainCache.delete(firstKey);
            }
            this.terrainCache.set(terrain.biome, texture);
        }

        // Draw texture
        this.ctx.drawImage(texture, x, y, tileSize, tileSize);

        // Add elevation shading
        const elevationFactor = (terrain.elevation + 100) / 200; // Normalize to 0-1
        this.ctx.fillStyle = `rgba(0, 0, 0, ${(1 - elevationFactor) * 0.3})`;
        this.ctx.fillRect(x, y, tileSize, tileSize);
    }

    // Public methods for external control
    getTerrainAt(x, y) {
        if (!this.terrainData) return null;

        const { width, height, tileSize } = this.terrainData;
        const tileX = Math.floor(x / tileSize) % width;
        const tileY = Math.floor(y / tileSize) % height;

        return this.terrainData.data[tileY][tileX];
    }

    getElevationAt(x, y) {
        const terrain = this.getTerrainAt(x, y);
        return terrain ? terrain.elevation : 0;
    }

    getBiomeAt(x, y) {
        const terrain = this.getTerrainAt(x, y);
        return terrain ? terrain.biome : 'forest';
    }

    updateTerrainData(newData) {
        this.terrainData = newData;
        this.terrainCache.clear();
    }

    setBiomeColor(biome, color) {
        if (this.biomes[biome]) {
            this.biomes[biome].color = color;
            this.textures.set(biome, this.createTexturePattern(color, biome));
        }
    }
}

// Make globally available
window.TerrainLayer = TerrainLayer;
