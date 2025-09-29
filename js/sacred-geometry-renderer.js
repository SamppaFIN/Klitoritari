/**
 * @fileoverview [IN_DEVELOPMENT] Sacred Geometry Background Renderer - Cosmic sacred geometry patterns
 * @status IN_DEVELOPMENT - Phase 1: Foundation implementation
 * @feature #feature-sacred-geometry-background
 * @feature #feature-cosmic-visual-effects
 * @feature #feature-leaflet-integration
 * @last_updated 2025-01-28
 * @dependencies Leaflet, Canvas2D, WebGL (optional)
 * @warning Sacred geometry rendering - do not modify without testing visual effects
 * 
 * Sacred Geometry Background Renderer
 * Creates beautiful sacred geometry patterns as background layer for cosmic exploration
 * Integrates with Leaflet map system for seamless sacred geometry experience
 */

console.log('🌌 Sacred Geometry Renderer script loaded!');

class SacredGeometryRenderer {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.isInitialized = false;
        this.isVisible = true;
        this.animationId = null;
        this.lastFrameTime = 0;
        this.frameCount = 0;
        
        // Sacred geometry patterns
        this.patterns = {
            flowerOfLife: true,
            metatronsCube: true,
            sriYantra: true,
            goldenSpiral: true,
            treeOfLife: true,
            vesicaPiscis: true,
            torusField: false // Advanced pattern
        };
        
        // Cosmic effects
        this.effects = {
            particles: true,
            aurora: true,
            cosmicGradient: true,
            sacredSigils: true,
            energyStreams: false // Advanced effect
        };
        
        // Performance settings
        this.performance = {
            targetFPS: 60,
            adaptiveQuality: true,
            maxParticles: 100,
            enableWebGL: false, // Start with Canvas2D for stability
            batteryOptimized: true
        };
        
        // Sacred geometry parameters
        this.geometry = {
            centerX: 0,
            centerY: 0,
            scale: 1,
            rotation: 0,
            animationSpeed: 0.01,
            colorScheme: 'cosmic' // cosmic, sacred, aurora
        };
        
        // Color palettes
        this.colorPalettes = {
            cosmic: {
                primary: '#1a1a2e',
                secondary: '#16213e',
                accent: '#0f3460',
                energy: '#533483',
                aurora: '#e94560',
                sacred: '#f39c12'
            },
            sacred: {
                primary: '#2c1810',
                secondary: '#8b4513',
                accent: '#daa520',
                energy: '#ffd700',
                aurora: '#ffffff',
                sacred: '#ffd700'
            },
            aurora: {
                primary: '#0a0a0a',
                secondary: '#1a1a2e',
                accent: '#16213e',
                energy: '#0f3460',
                aurora: '#533483',
                sacred: '#e94560'
            }
        };
        
        // Animation state
        this.animationState = {
            time: 0,
            phase: 0,
            pulse: 0,
            rotation: 0
        };
        
        console.log('🌌 Sacred Geometry Renderer initialized');
    }
    
    /**
     * Initialize the sacred geometry renderer
     * @status [IN_DEVELOPMENT] - Initialization process
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    init(container) {
        if (this.isInitialized) {
            console.log('🌌 Sacred Geometry Renderer already initialized');
            return;
        }
        
        console.log('🌌 Initializing Sacred Geometry Renderer...');
        
        try {
            // Create canvas element
            this.createCanvas(container);
            
            // Set up rendering context
            this.setupRenderingContext();
            
            // Initialize sacred patterns
            this.initializePatterns();
            
            // Start animation loop
            this.startAnimation();
            
            this.isInitialized = true;
            console.log('🌌 Sacred Geometry Renderer initialization complete');
            
        } catch (error) {
            console.error('🌌 Sacred Geometry Renderer initialization failed:', error);
        }
    }
    
    /**
     * Create canvas element for sacred geometry rendering
     * @status [IN_DEVELOPMENT] - Canvas creation
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    createCanvas(container) {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'sacred-geometry-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1'; // Behind map but above background
        this.canvas.style.opacity = '0.3'; // Subtle sacred geometry
        
        // Set canvas size
        this.resizeCanvas();
        
        // Add to container
        if (container) {
            container.appendChild(this.canvas);
        } else {
            document.body.appendChild(this.canvas);
        }
        
        console.log('🌌 Sacred geometry canvas created');
    }
    
    /**
     * Set up rendering context and performance settings
     * @status [IN_DEVELOPMENT] - Context setup
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    setupRenderingContext() {
        this.ctx = this.canvas.getContext('2d');
        
        // Enable high DPI rendering
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Set rendering quality
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'high';
        
        console.log('🌌 Rendering context setup complete');
    }
    
    /**
     * Initialize sacred geometry patterns
     * @status [IN_DEVELOPMENT] - Pattern initialization
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    initializePatterns() {
        console.log('🌌 Initializing sacred geometry patterns...');
        
        // Set up pattern parameters
        this.geometry.centerX = this.canvas.width / 2;
        this.geometry.centerY = this.canvas.height / 2;
        this.geometry.scale = Math.min(this.canvas.width, this.canvas.height) / 400;
        
        console.log('🌌 Sacred geometry patterns initialized');
    }
    
    /**
     * Start the sacred geometry animation loop
     * @status [IN_DEVELOPMENT] - Animation loop
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    startAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        const animate = (currentTime) => {
            if (!this.isVisible) {
                this.animationId = requestAnimationFrame(animate);
                return;
            }
            
            // Calculate delta time
            const deltaTime = currentTime - this.lastFrameTime;
            this.lastFrameTime = currentTime;
            
            // Update animation state
            this.updateAnimationState(deltaTime);
            
            // Render sacred geometry
            this.render();
            
            // Continue animation
            this.animationId = requestAnimationFrame(animate);
        };
        
        this.animationId = requestAnimationFrame(animate);
        console.log('🌌 Sacred geometry animation started');
    }
    
    /**
     * Update animation state for sacred geometry
     * @status [IN_DEVELOPMENT] - Animation state update
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    updateAnimationState(deltaTime) {
        this.animationState.time += deltaTime * 0.001;
        this.animationState.phase = Math.sin(this.animationState.time * 0.5) * 0.5 + 0.5;
        this.animationState.pulse = Math.sin(this.animationState.time * 2) * 0.3 + 0.7;
        this.animationState.rotation += deltaTime * 0.0001;
    }
    
    /**
     * Render sacred geometry patterns
     * @status [IN_DEVELOPMENT] - Main rendering function
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    render() {
        if (!this.ctx || !this.isVisible) return;
        
        // Clear canvas with cosmic background
        this.clearCanvas();
        
        // Draw cosmic gradient background
        this.drawCosmicGradient();
        
        // Draw sacred geometry patterns
        if (this.patterns.flowerOfLife) this.drawFlowerOfLife();
        if (this.patterns.metatronsCube) this.drawMetatronsCube();
        if (this.patterns.sriYantra) this.drawSriYantra();
        if (this.patterns.goldenSpiral) this.drawGoldenSpiral();
        if (this.patterns.treeOfLife) this.drawTreeOfLife();
        if (this.patterns.vesicaPiscis) this.drawVesicaPiscis();
        
        // Draw cosmic effects
        if (this.effects.aurora) this.drawAuroraEffect();
        if (this.effects.particles) this.drawCosmicParticles();
        if (this.effects.sacredSigils) this.drawSacredSigils();
        
        this.frameCount++;
    }
    
    /**
     * Clear canvas with cosmic background
     * @status [IN_DEVELOPMENT] - Canvas clearing
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    clearCanvas() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        this.ctx.fillStyle = colors.primary;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw cosmic gradient background
     * @status [IN_DEVELOPMENT] - Gradient background
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawCosmicGradient() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const gradient = this.ctx.createRadialGradient(
            this.geometry.centerX, this.geometry.centerY, 0,
            this.geometry.centerX, this.geometry.centerY, Math.max(this.canvas.width, this.canvas.height) / 2
        );
        
        gradient.addColorStop(0, colors.secondary + '40');
        gradient.addColorStop(0.5, colors.accent + '20');
        gradient.addColorStop(1, colors.primary + '10');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw Flower of Life pattern
     * @status [IN_DEVELOPMENT] - Flower of Life pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawFlowerOfLife() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX;
        const centerY = this.geometry.centerY;
        const radius = 50 * this.geometry.scale * this.animationState.pulse;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(this.animationState.rotation);
        
        // Draw 19 overlapping circles
        this.ctx.strokeStyle = colors.sacred + '30';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        
        for (let i = 0; i < 19; i++) {
            const angle = (i * Math.PI * 2) / 19;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Draw Metatron's Cube pattern
     * @status [IN_DEVELOPMENT] - Metatron's Cube pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawMetatronsCube() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX + 100;
        const centerY = this.geometry.centerY + 100;
        const radius = 40 * this.geometry.scale;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(-this.animationState.rotation);
        
        // Draw 13 circles forming cube
        this.ctx.strokeStyle = colors.energy + '40';
        this.ctx.lineWidth = 1;
        
        // Central circle
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // 12 surrounding circles
        for (let i = 0; i < 12; i++) {
            const angle = (i * Math.PI * 2) / 12;
            const x = Math.cos(angle) * radius * 1.5;
            const y = Math.sin(angle) * radius * 1.5;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius * 0.5, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Draw Sri Yantra pattern
     * @status [IN_DEVELOPMENT] - Sri Yantra pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawSriYantra() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX - 100;
        const centerY = this.geometry.centerY - 100;
        const size = 60 * this.geometry.scale;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Draw nine interlocking triangles
        this.ctx.strokeStyle = colors.aurora + '50';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 9; i++) {
            const angle = (i * Math.PI * 2) / 9;
            const scale = 0.8 + (this.animationState.phase * 0.2);
            
            this.ctx.save();
            this.ctx.rotate(angle);
            this.ctx.scale(scale, scale);
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, -size);
            this.ctx.lineTo(size * 0.866, size * 0.5);
            this.ctx.lineTo(-size * 0.866, size * 0.5);
            this.ctx.closePath();
            this.ctx.stroke();
            
            this.ctx.restore();
        }
        
        this.ctx.restore();
    }
    
    /**
     * Draw Golden Spiral pattern
     * @status [IN_DEVELOPMENT] - Golden Spiral pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawGoldenSpiral() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX + 150;
        const centerY = this.geometry.centerY - 150;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Golden ratio
        const phi = (1 + Math.sqrt(5)) / 2;
        const scale = 20 * this.geometry.scale;
        
        this.ctx.strokeStyle = colors.sacred + '60';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        let x = 0, y = 0;
        let radius = scale;
        
        for (let i = 0; i < 100; i++) {
            const angle = i * 0.1;
            const newRadius = radius * Math.pow(phi, angle / (Math.PI * 2));
            
            x = Math.cos(angle) * newRadius;
            y = Math.sin(angle) * newRadius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    /**
     * Draw Tree of Life pattern
     * @status [IN_DEVELOPMENT] - Tree of Life pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawTreeOfLife() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX - 150;
        const centerY = this.geometry.centerY + 150;
        const size = 40 * this.geometry.scale;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Draw 10 spheres (Sephirot)
        this.ctx.fillStyle = colors.energy + '40';
        this.ctx.strokeStyle = colors.sacred + '60';
        this.ctx.lineWidth = 1;
        
        const sephirot = [
            { x: 0, y: -size * 2 },      // Kether
            { x: -size, y: -size },      // Chokmah
            { x: size, y: -size },       // Binah
            { x: -size * 1.5, y: 0 },   // Chesed
            { x: -size * 0.5, y: 0 },    // Geburah
            { x: size * 0.5, y: 0 },    // Tiphareth
            { x: size * 1.5, y: 0 },    // Netzach
            { x: -size, y: size },      // Hod
            { x: size, y: size },       // Yesod
            { x: 0, y: size * 2 }       // Malkuth
        ];
        
        // Draw spheres
        sephirot.forEach((sephira, index) => {
            this.ctx.beginPath();
            this.ctx.arc(sephira.x, sephira.y, size * 0.3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.stroke();
        });
        
        // Draw connecting paths
        this.ctx.strokeStyle = colors.aurora + '30';
        this.ctx.lineWidth = 1;
        
        const paths = [
            [0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6],
            [3, 4], [4, 5], [5, 6], [3, 7], [4, 7], [5, 8],
            [6, 8], [7, 8], [7, 9], [8, 9]
        ];
        
        paths.forEach(([from, to]) => {
            this.ctx.beginPath();
            this.ctx.moveTo(sephirot[from].x, sephirot[from].y);
            this.ctx.lineTo(sephirot[to].x, sephirot[to].y);
            this.ctx.stroke();
        });
        
        this.ctx.restore();
    }
    
    /**
     * Draw Vesica Piscis pattern
     * @status [IN_DEVELOPMENT] - Vesica Piscis pattern
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawVesicaPiscis() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const centerX = this.geometry.centerX + 200;
        const centerY = this.geometry.centerY + 200;
        const radius = 30 * this.geometry.scale;
        
        this.ctx.save();
        this.ctx.translate(centerX, centerY);
        
        // Draw two overlapping circles
        this.ctx.strokeStyle = colors.sacred + '50';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.arc(-radius * 0.5, 0, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(radius * 0.5, 0, radius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.restore();
    }
    
    /**
     * Draw aurora effect
     * @status [IN_DEVELOPMENT] - Aurora effect
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawAuroraEffect() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        
        gradient.addColorStop(0, colors.aurora + '20');
        gradient.addColorStop(0.5, colors.energy + '10');
        gradient.addColorStop(1, colors.primary + '05');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Draw cosmic particles
     * @status [IN_DEVELOPMENT] - Cosmic particles
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawCosmicParticles() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const particleCount = Math.min(50, this.performance.maxParticles);
        
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.sin(this.animationState.time + i) * 0.5 + 0.5) * this.canvas.width;
            const y = (Math.cos(this.animationState.time * 0.7 + i) * 0.5 + 0.5) * this.canvas.height;
            const size = Math.sin(this.animationState.time * 2 + i) * 2 + 3;
            
            this.ctx.fillStyle = colors.sacred + '30';
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    /**
     * Draw sacred sigils
     * @status [IN_DEVELOPMENT] - Sacred sigils
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    drawSacredSigils() {
        const colors = this.colorPalettes[this.geometry.colorScheme];
        const sigilCount = 5;
        
        for (let i = 0; i < sigilCount; i++) {
            const x = (Math.sin(this.animationState.time * 0.3 + i * 2) * 0.5 + 0.5) * this.canvas.width;
            const y = (Math.cos(this.animationState.time * 0.4 + i * 3) * 0.5 + 0.5) * this.canvas.height;
            const size = 20 * this.geometry.scale;
            
            this.ctx.strokeStyle = colors.energy + '40';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            
            // Draw simple sigil pattern
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI * 2) / 6;
                const radius = size * (0.5 + Math.sin(this.animationState.time + j) * 0.3);
                const sigilX = x + Math.cos(angle) * radius;
                const sigilY = y + Math.sin(angle) * radius;
                
                if (j === 0) {
                    this.ctx.moveTo(sigilX, sigilY);
                } else {
                    this.ctx.lineTo(sigilX, sigilY);
                }
            }
            
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }
    
    /**
     * Resize canvas to match container
     * @status [IN_DEVELOPMENT] - Canvas resizing
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    resizeCanvas() {
        if (!this.canvas) return;
        
        const container = this.canvas.parentElement;
        if (container) {
            this.canvas.width = container.offsetWidth;
            this.canvas.height = container.offsetHeight;
        } else {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }
        
        // Update geometry parameters
        this.geometry.centerX = this.canvas.width / 2;
        this.geometry.centerY = this.canvas.height / 2;
        this.geometry.scale = Math.min(this.canvas.width, this.canvas.height) / 400;
        
        console.log('🌌 Sacred geometry canvas resized');
    }
    
    /**
     * Show/hide sacred geometry
     * @status [IN_DEVELOPMENT] - Visibility control
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    setVisible(visible) {
        this.isVisible = visible;
        if (this.canvas) {
            this.canvas.style.display = visible ? 'block' : 'none';
        }
    }
    
    /**
     * Update color scheme
     * @status [IN_DEVELOPMENT] - Color scheme update
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    setColorScheme(scheme) {
        if (this.colorPalettes[scheme]) {
            this.geometry.colorScheme = scheme;
            console.log('🌌 Sacred geometry color scheme changed to:', scheme);
        }
    }
    
    /**
     * Toggle pattern visibility
     * @status [IN_DEVELOPMENT] - Pattern control
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    togglePattern(patternName) {
        if (this.patterns.hasOwnProperty(patternName)) {
            this.patterns[patternName] = !this.patterns[patternName];
            console.log('🌌 Sacred geometry pattern toggled:', patternName, this.patterns[patternName]);
        }
    }
    
    /**
     * Get performance statistics
     * @status [IN_DEVELOPMENT] - Performance monitoring
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    getPerformanceStats() {
        return {
            frameCount: this.frameCount,
            isVisible: this.isVisible,
            patterns: this.patterns,
            effects: this.effects,
            performance: this.performance
        };
    }
    
    /**
     * Destroy the sacred geometry renderer
     * @status [IN_DEVELOPMENT] - Cleanup
     * @feature #feature-sacred-geometry-background
     * @last_tested 2025-01-28
     */
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        if (this.canvas && this.canvas.parentElement) {
            this.canvas.parentElement.removeChild(this.canvas);
        }
        
        this.isInitialized = false;
        console.log('🌌 Sacred Geometry Renderer destroyed');
    }
}

// Make globally available
window.SacredGeometryRenderer = SacredGeometryRenderer;

console.log('🌌 Sacred Geometry Renderer ready for cosmic exploration!');
