/**
 * @fileoverview Sacred Geometry Engine for Eldritch Sanctuary
 * @status [ACTIVE] - Consciousness-aware geometric patterns
 * @feature #feature-sacred-geometry
 * @feature #feature-consciousness-integration
 * @feature #feature-visual-immersion
 * @last_updated 2025-01-29
 * @dependencies SacredSettings, MapLayer
 * 
 * Sacred Geometry Engine
 * Renders consciousness-aware geometric patterns on the cosmic map
 */

class SacredGeometryEngine {
    constructor() {
        this.instanceId = 'sacred-geometry-engine-' + Date.now();
        console.log('🔮 Sacred Geometry Engine initialized');
        
        // Pattern definitions
        this.patterns = {
            flowerOfLife: new FlowerOfLifePattern(),
            metatronCube: new MetatronCubePattern(),
            fibonacciSpiral: new FibonacciSpiralPattern(),
            goldenRatio: new GoldenRatioPattern(),
            vesicaPiscis: new VesicaPiscisPattern(),
            seedOfLife: new SeedOfLifePattern()
        };
        
        // Rendering settings
        this.settings = {
            enabled: true,
            opacity: 0.3,
            strokeWidth: 1,
            colors: {
                primary: '#8b5cf6',
                secondary: '#3b82f6',
                accent: '#fbbf24',
                energy: '#ffffff'
            },
            animation: {
                enabled: true,
                speed: 1.0,
                pulse: true,
                rotation: false
            }
        };
        
        // Canvas and context
        this.canvas = null;
        this.context = null;
        this.isRendering = false;
        this.animationId = null;
        
        // Pattern instances
        this.activePatterns = new Map();
        this.patternPositions = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🔮 Initializing Sacred Geometry Engine...');
        this.createCanvas();
        this.setupEventListeners();
        this.startRendering();
        console.log('🔮 Sacred Geometry Engine ready');
    }
    
    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sacred-geometry-canvas';
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
            opacity: ${this.settings.opacity};
        `;
        
        // Add to map container
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.appendChild(this.canvas);
            this.context = this.canvas.getContext('2d');
            this.resizeCanvas();
        } else {
            console.warn('🔮 Map container not found, sacred geometry disabled');
            this.settings.enabled = false;
        }
    }
    
    resizeCanvas() {
        if (!this.canvas || !this.context) return;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Set high DPI
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;
        this.context.scale(dpr, dpr);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    setupEventListeners() {
        // Resize handler
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Settings change handler
        if (window.sacredSettings) {
            window.sacredSettings.addEventListener('settingsChanged', (event) => {
                this.updateSettings(event.detail.settings);
            });
        }
        
        // Map events
        if (window.mapLayer && window.mapLayer.map) {
            window.mapLayer.map.on('moveend', () => {
                this.updatePatternPositions();
            });
            
            window.mapLayer.map.on('zoomend', () => {
                this.updatePatternPositions();
            });
        }
    }
    
    updateSettings(settings) {
        console.log('🔮 Updating sacred geometry settings');
        
        this.settings.enabled = settings.immersion.sacredGeometry;
        this.settings.opacity = settings.immersion.level === 'high' ? 0.5 : 
                               settings.immersion.level === 'low' ? 0.1 : 0.3;
        
        if (this.canvas) {
            this.canvas.style.opacity = this.settings.opacity;
        }
        
        this.settings.animation.enabled = settings.immersion.level !== 'low';
    }
    
    startRendering() {
        if (!this.settings.enabled || this.isRendering) return;
        
        this.isRendering = true;
        this.render();
    }
    
    stopRendering() {
        this.isRendering = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    render() {
        if (!this.isRendering || !this.context || !this.settings.enabled) return;
        
        // Clear canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render active patterns
        this.activePatterns.forEach((pattern, id) => {
            this.renderPattern(pattern, id);
        });
        
        // Continue animation
        if (this.settings.animation.enabled) {
            this.animationId = requestAnimationFrame(() => this.render());
        }
    }
    
    renderPattern(pattern, id) {
        const position = this.patternPositions.get(id);
        if (!position) return;
        
        this.context.save();
        
        // Set pattern properties
        this.context.strokeStyle = pattern.color || this.settings.colors.primary;
        this.context.lineWidth = pattern.strokeWidth || this.settings.strokeWidth;
        this.context.globalAlpha = pattern.opacity || this.settings.opacity;
        
        // Apply transformations
        this.context.translate(position.x, position.y);
        
        if (this.settings.animation.rotation) {
            this.context.rotate(Date.now() * 0.0001 * this.settings.animation.speed);
        }
        
        if (this.settings.animation.pulse) {
            const scale = 1 + Math.sin(Date.now() * 0.002 * this.settings.animation.speed) * 0.1;
            this.context.scale(scale, scale);
        }
        
        // Render pattern
        pattern.render(this.context);
        
        this.context.restore();
    }
    
    addPattern(patternType, position, options = {}) {
        const pattern = this.patterns[patternType];
        if (!pattern) {
            console.warn(`🔮 Unknown pattern type: ${patternType}`);
            return null;
        }
        
        const id = `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Configure pattern
        pattern.configure({
            ...options,
            color: options.color || this.settings.colors.primary,
            strokeWidth: options.strokeWidth || this.settings.strokeWidth,
            opacity: options.opacity || this.settings.opacity
        });
        
        // Store pattern
        this.activePatterns.set(id, pattern);
        this.patternPositions.set(id, position);
        
        console.log(`🔮 Added ${patternType} pattern at`, position);
        return id;
    }
    
    removePattern(id) {
        this.activePatterns.delete(id);
        this.patternPositions.delete(id);
        console.log(`🔮 Removed pattern: ${id}`);
    }
    
    updatePatternPositions() {
        // Update pattern positions based on map view
        this.patternPositions.forEach((position, id) => {
            // Convert lat/lng to screen coordinates if needed
            if (position.lat && position.lng) {
                const screenPos = this.latLngToScreen(position.lat, position.lng);
                this.patternPositions.set(id, screenPos);
            }
        });
    }
    
    latLngToScreen(lat, lng) {
        if (!window.mapLayer || !window.mapLayer.map) {
            return { x: 0, y: 0 };
        }
        
        const point = window.mapLayer.map.latLngToContainerPoint([lat, lng]);
        return { x: point.x, y: point.y };
    }
    
    setEnabled(enabled) {
        this.settings.enabled = enabled;
        
        if (enabled) {
            this.startRendering();
        } else {
            this.stopRendering();
        }
        
        console.log(`🔮 Sacred Geometry Engine ${enabled ? 'enabled' : 'disabled'}`);
    }
}

// Sacred Geometry Pattern Classes
class FlowerOfLifePattern {
    constructor() {
        this.name = 'Flower of Life';
        this.radius = 50;
        this.color = '#8b5cf6';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const radius = this.radius;
        const centerX = 0;
        const centerY = 0;
        
        // Draw central circle
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        
        // Draw surrounding circles (simplified Flower of Life)
        const angles = [0, 60, 120, 180, 240, 300];
        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.stroke();
        });
    }
}

class MetatronCubePattern {
    constructor() {
        this.name = 'Metatron\'s Cube';
        this.size = 60;
        this.color = '#3b82f6';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const size = this.size;
        const centerX = 0;
        const centerY = 0;
        
        // Draw Metatron's Cube (simplified)
        context.beginPath();
        
        // Central hexagon
        const hexPoints = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * 60 * Math.PI) / 180;
            const x = centerX + size * Math.cos(angle);
            const y = centerY + size * Math.sin(angle);
            hexPoints.push({ x, y });
        }
        
        // Draw hexagon
        context.moveTo(hexPoints[0].x, hexPoints[0].y);
        for (let i = 1; i < hexPoints.length; i++) {
            context.lineTo(hexPoints[i].x, hexPoints[i].y);
        }
        context.closePath();
        context.stroke();
        
        // Draw connecting lines
        context.beginPath();
        for (let i = 0; i < hexPoints.length; i++) {
            const next = (i + 2) % hexPoints.length;
            context.moveTo(hexPoints[i].x, hexPoints[i].y);
            context.lineTo(hexPoints[next].x, hexPoints[next].y);
        }
        context.stroke();
    }
}

class FibonacciSpiralPattern {
    constructor() {
        this.name = 'Fibonacci Spiral';
        this.size = 80;
        this.color = '#fbbf24';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const size = this.size;
        const centerX = 0;
        const centerY = 0;
        
        // Draw Fibonacci spiral (simplified)
        context.beginPath();
        
        let x = centerX;
        let y = centerY;
        let radius = 1;
        
        for (let i = 0; i < 8; i++) {
            const angle = i * Math.PI / 2;
            const nextRadius = radius * 1.618; // Golden ratio
            
            context.arc(x, y, radius, angle, angle + Math.PI / 2);
            
            x += (nextRadius - radius) * Math.cos(angle + Math.PI / 2);
            y += (nextRadius - radius) * Math.sin(angle + Math.PI / 2);
            radius = nextRadius;
        }
        
        context.stroke();
    }
}

class GoldenRatioPattern {
    constructor() {
        this.name = 'Golden Ratio';
        this.size = 100;
        this.color = '#ffffff';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const size = this.size;
        const centerX = 0;
        const centerY = 0;
        
        // Draw golden ratio rectangles
        const phi = 1.618; // Golden ratio
        let width = size;
        let height = size / phi;
        
        context.beginPath();
        
        for (let i = 0; i < 5; i++) {
            const x = centerX - width / 2;
            const y = centerY - height / 2;
            
            context.rect(x, y, width, height);
            
            // Rotate for next iteration
            const temp = width;
            width = height;
            height = temp / phi;
        }
        
        context.stroke();
    }
}

class VesicaPiscisPattern {
    constructor() {
        this.name = 'Vesica Piscis';
        this.radius = 40;
        this.color = '#8b5cf6';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const radius = this.radius;
        const centerX = 0;
        const centerY = 0;
        
        // Draw Vesica Piscis (two overlapping circles)
        context.beginPath();
        context.arc(centerX - radius/2, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        
        context.beginPath();
        context.arc(centerX + radius/2, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
    }
}

class SeedOfLifePattern {
    constructor() {
        this.name = 'Seed of Life';
        this.radius = 30;
        this.color = '#3b82f6';
        this.strokeWidth = 1;
        this.opacity = 0.3;
    }
    
    configure(options) {
        Object.assign(this, options);
    }
    
    render(context) {
        const radius = this.radius;
        const centerX = 0;
        const centerY = 0;
        
        // Draw Seed of Life (7 circles)
        const angles = [0, 60, 120, 180, 240, 300];
        
        // Central circle
        context.beginPath();
        context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        context.stroke();
        
        // Surrounding circles
        angles.forEach(angle => {
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad);
            const y = centerY + radius * Math.sin(rad);
            
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.stroke();
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.sacredGeometryEngine = new SacredGeometryEngine();
    });
} else {
    window.sacredGeometryEngine = new SacredGeometryEngine();
}

console.log('🔮 Sacred Geometry Engine script loaded');
