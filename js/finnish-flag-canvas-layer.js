/**
 * Finnish Flag Canvas Layer
 * Renders Finnish flags on a dedicated canvas layer with different sizes and rotations
 */

class FinnishFlagCanvasLayer {
    constructor(mapEngine) {
        this.mapEngine = mapEngine;
        this.canvas = null;
        this.ctx = null;
        this.isVisible = true;
        this.opacity = 1.0;
        this.flagPins = []; // Array of {lat, lng, size, rotation, timestamp}
        this.animationFrame = null;
        this.rotationPhase = 0;
        
        // Flag rendering settings
        this.flagSizes = [20, 30, 40, 50, 60]; // 10x larger flag sizes
        this.rotationSpeeds = [0.02, 0.03, 0.04, 0.05, 0.06]; // Different rotation speeds
        this.colors = {
            blue: '#003580',
            white: '#FFFFFF',
            cross: '#003580'
        };
        
        // Color schemes for customization
        this.colorSchemes = {
            finnish: { blue: '#003580', white: '#FFFFFF', cross: '#003580' },
            cosmic: { blue: '#4A90E2', white: '#F0F8FF', cross: '#1E3A8A' },
            fire: { blue: '#DC2626', white: '#FEF2F2', cross: '#991B1B' },
            forest: { blue: '#059669', white: '#F0FDF4', cross: '#047857' },
            royal: { blue: '#7C3AED', white: '#FAF5FF', cross: '#5B21B6' },
            sunset: { blue: '#EA580C', white: '#FFF7ED', cross: '#C2410C' }
        };
        this.currentColorScheme = 'finnish';
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEventListeners();
        this.startAnimation();
        console.log('🇫🇮 Finnish Flag Canvas Layer initialized');
    }
    
    createCanvas() {
        // Create canvas element
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'finnish-flag-canvas';
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '1000';
        this.canvas.style.opacity = this.opacity;
        
        // Add to map container
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.appendChild(this.canvas);
        }
        
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        if (!this.mapEngine || !this.mapEngine.map) return;
        
        const mapContainer = this.mapEngine.map.getContainer();
        const rect = mapContainer.getBoundingClientRect();
        
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
        
        console.log('🇫🇮 Canvas resized to:', rect.width, 'x', rect.height);
    }
    
    setupEventListeners() {
        if (this.mapEngine && this.mapEngine.map) {
            this.mapEngine.map.on('zoomend moveend resize', () => {
                this.resizeCanvas();
                this.render();
            });
        }
    }
    
    addFlagPin(lat, lng, size = null, rotation = null) {
        // Check for nearby flags and determine size
        const nearbyFlag = this.findNearbyFlag(lat, lng);
        let flagSize;
        
        if (nearbyFlag) {
            // Make the nearby flag bigger
            const currentSizeIndex = this.flagSizes.indexOf(nearbyFlag.size);
            const newSizeIndex = Math.min(currentSizeIndex + 1, this.flagSizes.length - 1);
            nearbyFlag.size = this.flagSizes[newSizeIndex];
            nearbyFlag.timestamp = Date.now(); // Update timestamp
            console.log(`🇫🇮 Enlarged nearby flag to size ${nearbyFlag.size} (was ${this.flagSizes[currentSizeIndex]})`);
            
            // Don't add a new flag, just update the existing one
            this.render();
            return;
        } else {
            // No nearby flag found, add a new one with smallest size
            flagSize = this.flagSizes[0]; // Start with smallest size
        }
        
        const pin = {
            lat: lat,
            lng: lng,
            size: size || flagSize,
            rotation: rotation || Math.random() * Math.PI * 2,
            timestamp: Date.now()
        };
        
        this.flagPins.push(pin);
        console.log('🇫🇮 Added new flag pin:', pin);
        
        // Limit number of pins to prevent performance issues
        if (this.flagPins.length > 1000) {
            this.flagPins = this.flagPins.slice(-500); // Keep last 500 pins
        }
        
        this.render();
    }
    
    findNearbyFlag(lat, lng, maxDistance = 10) {
        // Check if there's already a flag within maxDistance meters
        for (let i = 0; i < this.flagPins.length; i++) {
            const flag = this.flagPins[i];
            const distance = this.calculateDistance(lat, lng, flag.lat, flag.lng);
            
            if (distance <= maxDistance) {
                console.log(`🇫🇮 Found nearby flag at distance ${distance.toFixed(2)}m`);
                return flag;
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
        return R * c; // Distance in meters
    }
    
    getFlagStatistics() {
        const stats = {
            totalFlags: this.flagPins.length,
            sizeDistribution: {}
        };
        
        // Count flags by size
        this.flagSizes.forEach(size => {
            stats.sizeDistribution[size] = this.flagPins.filter(flag => flag.size === size).length;
        });
        
        return stats;
    }
    
    latLngToCanvas(lat, lng) {
        if (!this.mapEngine || !this.mapEngine.map) return { x: 0, y: 0 };
        
        const point = this.mapEngine.map.latLngToContainerPoint([lat, lng]);
        return {
            x: point.x,
            y: point.y
        };
    }
    
    drawFinnishFlag(x, y, size, rotation) {
        const ctx = this.ctx;
        const halfSize = size / 2;
        const crossWidth = Math.max(2, size / 8);
        const colors = this.colorSchemes[this.currentColorScheme];
        
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        // Draw white background
        ctx.fillStyle = colors.white;
        ctx.fillRect(-halfSize, -halfSize, size, size);
        
        // Draw blue border
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 2;
        ctx.strokeRect(-halfSize, -halfSize, size, size);
        
        // Draw horizontal cross
        ctx.fillStyle = colors.cross;
        ctx.fillRect(-halfSize, -crossWidth/2, size, crossWidth);
        
        // Draw vertical cross
        ctx.fillRect(-crossWidth/2, -halfSize, crossWidth, size);
        
        // Add some glow effect
        ctx.shadowColor = colors.blue;
        ctx.shadowBlur = 2;
        ctx.strokeStyle = colors.blue;
        ctx.lineWidth = 0.5;
        ctx.strokeRect(-halfSize, -halfSize, size, size);
        
        ctx.restore();
    }
    
    render() {
        if (!this.ctx || !this.isVisible) return;
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw all flag pins
        this.flagPins.forEach(pin => {
            const canvasPos = this.latLngToCanvas(pin.lat, pin.lng);
            if (canvasPos.x >= 0 && canvasPos.x <= this.canvas.width && 
                canvasPos.y >= 0 && canvasPos.y <= this.canvas.height) {
                
                // Add rotation animation
                const animatedRotation = pin.rotation + (this.rotationPhase * 0.1);
                
                this.drawFinnishFlag(canvasPos.x, canvasPos.y, pin.size, animatedRotation);
            }
        });
    }
    
    startAnimation() {
        const animate = () => {
            this.rotationPhase += 0.1;
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }
    
    stopAnimation() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
    
    toggleVisibility() {
        this.isVisible = !this.isVisible;
        this.canvas.style.opacity = this.isVisible ? this.opacity : 0;
        console.log('🇫🇮 Flag layer visibility:', this.isVisible ? 'ON' : 'OFF');
    }
    
    setOpacity(opacity) {
        this.opacity = Math.max(0, Math.min(1, opacity));
        this.canvas.style.opacity = this.opacity;
        console.log('🇫🇮 Flag layer opacity set to:', this.opacity);
    }
    
    clearFlags() {
        this.flagPins = [];
        this.render();
        console.log('🇫🇮 All flags cleared');
    }
    
    getFlagCount() {
        return this.flagPins.length;
    }
    
    setColorScheme(schemeName) {
        if (this.colorSchemes[schemeName]) {
            this.currentColorScheme = schemeName;
            console.log('🇫🇮 Color scheme changed to:', schemeName);
            this.render(); // Re-render with new colors
        } else {
            console.warn('🇫🇮 Unknown color scheme:', schemeName);
        }
    }
    
    getAvailableColorSchemes() {
        return Object.keys(this.colorSchemes);
    }
    
    cycleColorScheme() {
        const schemes = this.getAvailableColorSchemes();
        const currentIndex = schemes.indexOf(this.currentColorScheme);
        const nextIndex = (currentIndex + 1) % schemes.length;
        this.setColorScheme(schemes[nextIndex]);
    }
    
    destroy() {
        this.stopAnimation();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        console.log('🇫🇮 Finnish Flag Canvas Layer destroyed');
    }
}

// Make it globally available
window.FinnishFlagCanvasLayer = FinnishFlagCanvasLayer;
