/**
 * Enhanced Path Painting System with Vector Graphics
 * Integrates Finnish flag boundaries with WebGL rendering
 */

class EnhancedPathPaintingSystem {
    constructor() {
        this.isInitialized = false;
        this.visitedPoints = [];
        this.paintedAreas = new Map();
        this.boundaryPoints = [];
        this.flagGenerator = new FinnishFlagGenerator();
        this.vectorRenderer = null;
        
        // Configuration
        this.brushSize = 0.0001; // ~10m radius in degrees
        this.minDistance = 0.00005; // ~5m minimum distance between points
        this.flagSpacing = 15; // meters between flags
        this.flagScale = 1.0;
        this.pathOpacity = 0.3;
        
        // Painting state
        this.paintingInterval = null;
        this.lastPosition = null;
        this.isPainting = false;
        this.currentBrushColor = '#FF6B6B';
        
        // WebGL integration
        this.webglCanvas = null;
        this.webglContext = null;
        this.mapEngine = null;
    }

    init() {
        console.log('🎨 Enhanced path painting system initializing...');
        
        // Wait for map engine to be ready
        this.waitForMapEngine().then(() => {
            this.setupWebGLRenderer();
            this.isInitialized = true;
            this.startPathTracking();
            this.createEnhancedDebugPanel();
            console.log('🎨 Enhanced path painting system initialized');
        });
    }

    async waitForMapEngine() {
        return new Promise((resolve) => {
            const checkMapEngine = () => {
                if (window.eldritchApp && window.eldritchApp.systems.mapEngine) {
                    this.mapEngine = window.eldritchApp.systems.mapEngine;
                    resolve();
                } else {
                    setTimeout(checkMapEngine, 100);
                }
            };
            checkMapEngine();
        });
    }

    setupWebGLRenderer() {
        // Create WebGL canvas for vector rendering
        this.webglCanvas = document.createElement('canvas');
        this.webglCanvas.id = 'vector-graphics-canvas';
        this.webglCanvas.style.position = 'absolute';
        this.webglCanvas.style.top = '0';
        this.webglCanvas.style.left = '0';
        this.webglCanvas.style.pointerEvents = 'none';
        this.webglCanvas.style.zIndex = '1000';
        
        // Add to map container
        const mapContainer = document.getElementById('map');
        if (mapContainer) {
            mapContainer.appendChild(this.webglCanvas);
        }

        // Get WebGL context
        this.webglContext = this.webglCanvas.getContext('webgl') || this.webglCanvas.getContext('experimental-webgl');
        
        if (!this.webglContext) {
            console.error('🎨 WebGL not supported for vector rendering');
            return;
        }

        // Initialize vector renderer
        this.vectorRenderer = new WebGLVectorRenderer(this.webglContext, this.webglCanvas);
        
        // Resize canvas to match map
        this.resizeCanvas();
        
        // Listen for map events
        if (this.mapEngine && this.mapEngine.map) {
            this.mapEngine.map.on('zoomend moveend', () => {
                this.updateMapState();
                // Disabled boundary rendering to prevent large blue overlays
                // this.renderBoundaries();
            });
        }
    }

    resizeCanvas() {
        if (!this.webglCanvas || !this.mapEngine || !this.mapEngine.map) return;
        
        const mapContainer = this.mapEngine.map.getContainer();
        const rect = mapContainer.getBoundingClientRect();
        
        this.webglCanvas.width = rect.width;
        this.webglCanvas.height = rect.height;
        this.webglCanvas.style.width = rect.width + 'px';
        this.webglCanvas.style.height = rect.height + 'px';
        
        this.webglContext.viewport(0, 0, rect.width, rect.height);
    }

    updateMapState() {
        if (!this.vectorRenderer || !this.mapEngine || !this.mapEngine.map) return;
        
        const zoom = this.mapEngine.map.getZoom();
        const center = this.mapEngine.map.getCenter();
        const bounds = this.mapEngine.map.getBounds();
        
        this.vectorRenderer.updateMapState(zoom, center, bounds);
    }

    startPathTracking() {
        // Track player position every 2 seconds
        this.paintingInterval = setInterval(() => {
            this.updatePlayerPath();
        }, 2000);
    }

    updatePlayerPath() {
        if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) return;

        const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
        if (!playerPos) return;

        // Check if player has moved enough to add a new point
        if (this.lastPosition) {
            const distance = this.calculateDistance(
                this.lastPosition.lat, this.lastPosition.lng,
                playerPos.lat, playerPos.lng
            );

            if (distance < this.minDistance * 111000) { // Convert to meters
                return; // Not enough movement
            }
        }

        // Add new visited point
        const visitedPoint = {
            lat: playerPos.lat,
            lng: playerPos.lng,
            timestamp: Date.now(),
            color: this.currentBrushColor,
            brushSize: this.brushSize
        };

        this.visitedPoints.push(visitedPoint);
        this.lastPosition = { lat: playerPos.lat, lng: playerPos.lng };

        // Update boundary points for flag rendering
        this.updateBoundaryPoints(visitedPoint);

        // Render boundaries with flags
        this.renderBoundaries();

        console.log(`🎨 Painted area at ${visitedPoint.lat.toFixed(6)}, ${visitedPoint.lng.toFixed(6)}`);
    }

    updateBoundaryPoints(point) {
        // Add point to boundary if it's far enough from existing points
        if (this.boundaryPoints.length === 0) {
            this.boundaryPoints.push(point);
            return;
        }

        const lastBoundaryPoint = this.boundaryPoints[this.boundaryPoints.length - 1];
        const distance = this.calculateDistance(
            lastBoundaryPoint.lat, lastBoundaryPoint.lng,
            point.lat, point.lng
        );

        if (distance > this.flagSpacing) {
            this.boundaryPoints.push(point);
        }
    }

    renderBoundaries() {
        // Disabled to prevent large blue overlays
        console.log('🎨 Boundary rendering disabled to prevent large blue overlays');
        return;
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

    createEnhancedDebugPanel() {
        // Create enhanced debug panel
        const debugPanel = document.createElement('div');
        debugPanel.id = 'enhanced-path-debug-panel';
        debugPanel.className = 'debug-panel';
        debugPanel.innerHTML = `
            <h3>🎨 Enhanced Path Painting</h3>
            <div class="debug-section">
                <label>Flag Spacing: <span id="flag-spacing-value">${this.flagSpacing}m</span></label>
                <input type="range" id="flag-spacing-slider" min="5" max="50" value="${this.flagSpacing}" step="5">
            </div>
            <div class="debug-section">
                <label>Flag Scale: <span id="flag-scale-value">${this.flagScale}</span></label>
                <input type="range" id="flag-scale-slider" min="0.5" max="3" value="${this.flagScale}" step="0.1">
            </div>
            <div class="debug-section">
                <button id="clear-boundaries-btn">Clear Boundaries</button>
                <button id="toggle-painting-btn">${this.isPainting ? 'Stop' : 'Start'} Painting</button>
            </div>
            <div class="debug-section">
                <div>Points: <span id="boundary-points-count">${this.boundaryPoints.length}</span></div>
                <div>Visited: <span id="visited-points-count">${this.visitedPoints.length}</span></div>
            </div>
        `;

        // Add to debug container
        const debugContainer = document.getElementById('debug-container');
        if (debugContainer) {
            debugContainer.appendChild(debugPanel);
        }

        // Add event listeners
        this.setupDebugEventListeners();
    }

    setupDebugEventListeners() {
        // Flag spacing slider
        const flagSpacingSlider = document.getElementById('flag-spacing-slider');
        const flagSpacingValue = document.getElementById('flag-spacing-value');
        if (flagSpacingSlider && flagSpacingValue) {
            flagSpacingSlider.addEventListener('input', (e) => {
                this.flagSpacing = parseInt(e.target.value);
                flagSpacingValue.textContent = `${this.flagSpacing}m`;
                this.renderBoundaries();
            });
        }

        // Flag scale slider
        const flagScaleSlider = document.getElementById('flag-scale-slider');
        const flagScaleValue = document.getElementById('flag-scale-value');
        if (flagScaleSlider && flagScaleValue) {
            flagScaleSlider.addEventListener('input', (e) => {
                this.flagScale = parseFloat(e.target.value);
                flagScaleValue.textContent = this.flagScale;
                this.renderBoundaries();
            });
        }

        // Clear boundaries button
        const clearBtn = document.getElementById('clear-boundaries-btn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearBoundaries();
            });
        }

        // Toggle painting button
        const toggleBtn = document.getElementById('toggle-painting-btn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.togglePainting();
            });
        }
    }

    clearBoundaries() {
        this.boundaryPoints = [];
        this.visitedPoints = [];
        if (this.vectorRenderer) {
            this.vectorRenderer.clear();
        }
        this.updateDebugCounts();
        console.log('🎨 Boundaries cleared');
    }

    togglePainting() {
        this.isPainting = !this.isPainting;
        const toggleBtn = document.getElementById('toggle-painting-btn');
        if (toggleBtn) {
            toggleBtn.textContent = this.isPainting ? 'Stop' : 'Start' + ' Painting';
        }
        console.log(`🎨 Painting ${this.isPainting ? 'started' : 'stopped'}`);
    }

    updateDebugCounts() {
        const boundaryCount = document.getElementById('boundary-points-count');
        const visitedCount = document.getElementById('visited-points-count');
        
        if (boundaryCount) boundaryCount.textContent = this.boundaryPoints.length;
        if (visitedCount) visitedCount.textContent = this.visitedPoints.length;
    }

    // Public API methods
    getBoundaryData() {
        return {
            boundaryPoints: this.boundaryPoints,
            visitedPoints: this.visitedPoints,
            flagSpacing: this.flagSpacing,
            flagScale: this.flagScale
        };
    }

    setFlagSpacing(spacing) {
        this.flagSpacing = spacing;
        this.renderBoundaries();
    }

    setFlagScale(scale) {
        this.flagScale = scale;
        this.renderBoundaries();
    }

    destroy() {
        if (this.paintingInterval) {
            clearInterval(this.paintingInterval);
        }
        if (this.vectorRenderer) {
            this.vectorRenderer.destroy();
        }
        if (this.webglCanvas && this.webglCanvas.parentNode) {
            this.webglCanvas.parentNode.removeChild(this.webglCanvas);
        }
    }
}

// Make it globally available
window.EnhancedPathPaintingSystem = EnhancedPathPaintingSystem;
