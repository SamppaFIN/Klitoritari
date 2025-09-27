/**
 * Path Painting System - Tracks and visualizes player's journey
 * Creates a painted layer showing visited areas with brush-like effects
 */

class PathPaintingSystem {
    constructor() {
        this.isInitialized = false;
        this.visitedPoints = [];
        this.paintedLayers = [];
        this.brushSize = 0.0001; // ~10m radius in degrees
        this.paintingInterval = null;
        this.lastPosition = null;
        this.minDistance = 0.00005; // ~5m minimum distance between points
        this.pathOpacity = 0.3;
        this.isUpdating = false; // Safety flag to prevent infinite loops
        this.brushColors = [
            '#FF6B6B', // Red
            '#4ECDC4', // Teal
            '#45B7D1', // Blue
            '#96CEB4', // Green
            '#FFEAA7', // Yellow
            '#DDA0DD', // Plum
            '#98D8C8', // Mint
            '#F7DC6F'  // Gold
        ];
        this.currentBrushColor = this.brushColors[0];
        this.paintedAreas = new Map(); // Grid-based area tracking
        this.gridSize = 0.0001; // ~10m grid cells
    }

    init() {
        console.log('🎨 Path painting system initialized');
        this.isInitialized = true;
        this.loadPaintedPaths();
        this.startPathTracking();
        this.createPathDebugPanel();
        this.hideIndividualDebugPanel();
    }

    startPathTracking() {
        // Track player position every 2 seconds
        this.paintingInterval = setInterval(() => {
            this.updatePlayerPath();
        }, 2000);
    }

    updatePlayerPath() {
        console.log('🎨 updatePlayerPath called');
        
        // Safety check to prevent infinite loops
        if (this.isUpdating) {
            console.log('🎨 Path painting: Already updating, skipping...');
            return;
        }
        this.isUpdating = true;
        
        try {
            if (!window.eldritchApp || !window.eldritchApp.systems.geolocation) {
                console.log('🎨 Path painting: eldritchApp or geolocation not available');
                return;
            }

            const playerPos = window.eldritchApp.systems.geolocation.currentPosition;
            console.log('🎨 Path painting: player position:', `lat: ${playerPos.lat}, lng: ${playerPos.lng}`);
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

        // Paint the area
        this.paintArea(visitedPoint);

        // Save to local storage periodically
        if (this.visitedPoints.length % 10 === 0) {
            this.savePaintedPaths();
        }

        console.log(`🎨 Painted area at ${visitedPoint.lat.toFixed(6)}, ${visitedPoint.lng.toFixed(6)}`);
        } finally {
            // Always reset the updating flag
            this.isUpdating = false;
        }
    }

    paintArea(point) {
        if (!window.eldritchApp || !window.eldritchApp.systems.mapEngine || !window.eldritchApp.systems.mapEngine.map) {
            return;
        }

        // Create a painted circle for this area
        const paintedCircle = L.circle([point.lat, point.lng], {
            radius: this.brushSize * 111000, // Convert to meters
            color: point.color,
            weight: 0,
            opacity: 0,
            fillOpacity: this.pathOpacity,
            fillColor: point.color,
            className: 'painted-area'
        });

        // Add to map
        paintedCircle.addTo(window.eldritchApp.systems.mapEngine.map);
        this.paintedLayers.push(paintedCircle);

        // Add to grid-based tracking
        this.addToPaintedGrid(point);

        // Add pulsing effect
        this.addPulsingEffect(paintedCircle);
        
        // Create path markers every few painted areas (using Leaflet markers like base markers)
        this.createPathMarkerIfNeeded(point);
    }
    
    createPathMarkerIfNeeded(point) {
        try {
            // Create a path marker every 5 painted areas (adjustable)
            const markerInterval = 5;
            const shouldCreateMarker = (this.paintedLayers.length % markerInterval === 0);
            
            if (shouldCreateMarker && window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
                console.log(`🐜 Creating path marker at painted area ${this.paintedLayers.length} at:`, point);
                this.createLeafletPathMarker(point);
            }
        } catch (error) {
            console.error('🐜 Error creating path marker in path painting system:', error);
        }
    }
    
    createLeafletPathMarker(point) {
        try {
            const map = window.eldritchApp.systems.mapEngine.map;
            
            // Determine which symbol to use (alternating pattern)
            const markerIndex = this.paintedLayers.length;
            const isPathMarker = (markerIndex % 5 === 0); // Every 5th marker is a path marker (aurora)
            const symbol = isPathMarker ? 'aurora' : 'ant';
            
            console.log(`🐜 Creating ${symbol} marker at index ${markerIndex}`);
            
            // Create the marker HTML (similar to base markers but smaller)
            const markerHtml = this.createPathMarkerHTML(symbol);
            
            // Create Leaflet divIcon
            const markerIcon = L.divIcon({
                className: 'path-marker-icon',
                html: markerHtml,
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            });
            
            // Create and add marker to map
            const marker = L.marker([point.lat, point.lng], { icon: markerIcon }).addTo(map);
            
            // Store reference for potential cleanup
            if (!this.pathMarkers) {
                this.pathMarkers = [];
            }
            this.pathMarkers.push(marker);
            
            console.log(`🐜 Path marker created successfully: ${symbol}`);
            
        } catch (error) {
            console.error('🐜 Error creating Leaflet path marker:', error);
        }
    }
    
    createPathMarkerHTML(symbol) {
        if (symbol === 'aurora') {
            return `
                <div style="
                    width: 20px; 
                    height: 20px; 
                    border-radius: 50%; 
                    border: 2px solid #00FF88; 
                    box-shadow: 0 0 8px rgba(0,255,136,0.6);
                    background: #001122;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg width="16" height="16" viewBox="-8 -8 16 16" style="overflow: visible;">
                        <defs>
                            <style>
                                .aurora-line { stroke: #00FF88; stroke-width: 1.5; fill: none; }
                                .aurora-circle { fill: #00FF88; }
                            </style>
                        </defs>
                        <!-- Aurora wavy line -->
                        <path class="aurora-line" d="M 0,-6.4 
                            Q -1.2,-4.8 0,-3.2 
                            Q 1.2,-1.6 0,0 
                            Q -1.2,1.6 0,3.2 
                            Q 1.2,4.8 0,6.4" />
                        <!-- Aurora circle at top -->
                        <circle class="aurora-circle" cx="0" cy="-6.4" r="1.2" />
                    </svg>
                </div>
            `;
        } else { // ant
            return `
                <div style="
                    width: 20px; 
                    height: 20px; 
                    border-radius: 50%; 
                    border: 2px solid #8B4513; 
                    box-shadow: 0 0 8px rgba(139,69,19,0.6);
                    background: #654321;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <svg width="16" height="16" viewBox="-8 -8 16 16" style="overflow: visible;">
                        <defs>
                            <style>
                                .ant-body { fill: #8B4513; stroke: #654321; stroke-width: 0.5; }
                                .ant-head { fill: #8B4513; stroke: #654321; stroke-width: 0.5; }
                                .ant-leg { stroke: #654321; stroke-width: 0.5; fill: none; }
                            </style>
                        </defs>
                        <!-- Ant body (oval) -->
                        <ellipse class="ant-body" cx="0" cy="0" rx="4.8" ry="2.4" />
                        <!-- Ant head (circle) -->
                        <circle class="ant-head" cx="-3.2" cy="0" r="1.6" />
                        <!-- Ant legs (6 legs, 3 on each side) -->
                        <line class="ant-leg" x1="-2.4" y1="-1.6" x2="-4.8" y2="-1.2" />
                        <line class="ant-leg" x1="-2.4" y1="0" x2="-4.8" y2="0" />
                        <line class="ant-leg" x1="-2.4" y1="1.6" x2="-4.8" y2="1.2" />
                        <line class="ant-leg" x1="2.4" y1="-1.6" x2="4.8" y2="-1.2" />
                        <line class="ant-leg" x1="2.4" y1="0" x2="4.8" y2="0" />
                        <line class="ant-leg" x1="2.4" y1="1.6" x2="4.8" y2="1.2" />
                    </svg>
                </div>
            `;
        }
    }
    
    clearPathMarkers() {
        if (this.pathMarkers) {
            this.pathMarkers.forEach(marker => {
                if (marker && marker.remove) {
                    marker.remove();
                }
            });
            this.pathMarkers = [];
            console.log('🐜 All path markers cleared');
        }
    }

    addToPaintedGrid(point) {
        const gridX = Math.floor(point.lat / this.gridSize);
        const gridY = Math.floor(point.lng / this.gridSize);
        const gridKey = `${gridX},${gridY}`;

        if (!this.paintedAreas.has(gridKey)) {
            this.paintedAreas.set(gridKey, {
                x: gridX,
                y: gridY,
                lat: gridX * this.gridSize,
                lng: gridY * this.gridSize,
                color: point.color,
                intensity: 1,
                lastPainted: point.timestamp
            });
        } else {
            const area = this.paintedAreas.get(gridKey);
            area.intensity = Math.min(area.intensity + 0.1, 1.0);
            area.lastPainted = point.timestamp;
            area.color = this.blendColors(area.color, point.color);
        }
    }

    blendColors(color1, color2) {
        // Simple color blending - in a real implementation, you'd use proper color mixing
        return Math.random() > 0.5 ? color1 : color2;
    }

    addPulsingEffect(circle) {
        let pulseDirection = 1;
        const pulseInterval = setInterval(() => {
            const currentOpacity = circle.options.fillOpacity;
            const newOpacity = currentOpacity + (pulseDirection * 0.05);
            
            if (newOpacity >= this.pathOpacity + 0.2) {
                pulseDirection = -1;
            } else if (newOpacity <= this.pathOpacity - 0.1) {
                pulseDirection = 1;
            }
            
            circle.setStyle({ fillOpacity: newOpacity });
        }, 100);

        // Stop pulsing after 3 seconds
        setTimeout(() => {
            clearInterval(pulseInterval);
            circle.setStyle({ fillOpacity: this.pathOpacity });
        }, 3000);
    }

    createPathDebugPanel() {
        const existingPanel = document.getElementById('path-debug-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const panel = document.createElement('div');
        panel.id = 'path-debug-panel';
        panel.className = 'path-debug-panel';
        panel.innerHTML = `
            <div class="path-debug-content">
                <h3>🎨 Path Painting Debug</h3>
                <div class="debug-section">
                    <h4>Brush Settings</h4>
                    <label for="brush-size">Brush Size (m):</label>
                    <input type="range" id="brush-size" min="5" max="50" value="10">
                    <span id="brush-size-value">10m</span>
                    <label for="brush-opacity">Opacity:</label>
                    <input type="range" id="brush-opacity" min="0.1" max="0.8" step="0.1" value="0.3">
                    <span id="brush-opacity-value">0.3</span>
                </div>
                <div class="debug-section">
                    <h4>Brush Colors</h4>
                    <div class="color-palette">
                        ${this.brushColors.map((color, index) => 
                            `<button class="color-btn" style="background: ${color}" data-color="${color}" title="${color}"></button>`
                        ).join('')}
                    </div>
                </div>
                <div class="debug-section">
                    <h4>Path Controls</h4>
                    <button id="clear-painted-paths" class="debug-btn">Clear All Paths</button>
                    <button id="export-paths" class="debug-btn">Export Paths</button>
                    <button id="import-paths" class="debug-btn">Import Paths</button>
                </div>
                <div class="debug-section">
                    <h4>Info</h4>
                    <div id="path-stats">Points: 0 | Areas: 0</div>
                    <div id="current-brush">Brush: Red (10m)</div>
                </div>
                <button id="toggle-path-debug" class="debug-btn">Toggle Path Debug</button>
            </div>
        `;
        
        document.body.appendChild(panel);
        this.setupPathDebugEventListeners();
    }

    hideIndividualDebugPanel() {
        const panel = document.getElementById('path-debug-panel');
        if (panel) {
            panel.classList.add('hidden');
        }
    }

    setupPathDebugEventListeners() {
        // Brush size control
        const brushSizeSlider = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');
        brushSizeSlider.addEventListener('input', (e) => {
            this.brushSize = (parseInt(e.target.value) / 111000); // Convert meters to degrees
            brushSizeValue.textContent = `${e.target.value}m`;
            this.updateDebugInfo();
        });

        // Brush opacity control
        const brushOpacitySlider = document.getElementById('brush-opacity');
        const brushOpacityValue = document.getElementById('brush-opacity-value');
        brushOpacitySlider.addEventListener('input', (e) => {
            this.pathOpacity = parseFloat(e.target.value);
            brushOpacityValue.textContent = e.target.value;
            this.updateDebugInfo();
        });

        // Color palette
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentBrushColor = e.target.dataset.color;
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
                e.target.classList.add('selected');
                this.updateDebugInfo();
            });
        });

        // Path controls
        document.getElementById('clear-painted-paths').addEventListener('click', () => this.clearAllPaths());
        document.getElementById('export-paths').addEventListener('click', () => this.exportPaths());
        document.getElementById('import-paths').addEventListener('click', () => this.importPaths());
        
        // Toggle panel
        document.getElementById('toggle-path-debug').addEventListener('click', () => {
            const panel = document.getElementById('path-debug-panel');
            panel.classList.toggle('hidden');
        });

        // Select first color by default
        document.querySelector('.color-btn').classList.add('selected');
    }

    clearAllPaths() {
        // Remove all painted layers from map
        this.paintedLayers.forEach(layer => {
            if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(layer);
            }
        });

        // Clear data
        this.paintedLayers = [];
        this.visitedPoints = [];
        this.paintedAreas.clear();
        this.lastPosition = null;

        // Clear local storage
        localStorage.removeItem('eldritch_painted_paths');

        console.log('🎨 Cleared all painted paths');
        this.updateDebugInfo();
    }

    exportPaths() {
        const pathData = {
            visitedPoints: this.visitedPoints,
            paintedAreas: Array.from(this.paintedAreas.entries()),
            exportTime: Date.now()
        };

        const dataStr = JSON.stringify(pathData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `eldritch_paths_${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        console.log('🎨 Exported painted paths');
    }

    importPaths() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const pathData = JSON.parse(e.target.result);
                        this.loadPathData(pathData);
                        console.log('🎨 Imported painted paths');
                    } catch (error) {
                        console.error('🎨 Error importing paths:', error);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    loadPathData(pathData) {
        // Clear existing paths
        this.clearAllPaths();

        // Load visited points
        if (pathData.visitedPoints) {
            this.visitedPoints = pathData.visitedPoints;
            this.paintedAreas = new Map(pathData.paintedAreas);
            
            // Repaint all areas
            this.visitedPoints.forEach(point => {
                this.paintArea(point);
            });
        }

        this.updateDebugInfo();
    }

    savePaintedPaths() {
        const pathData = {
            visitedPoints: this.visitedPoints,
            paintedAreas: Array.from(this.paintedAreas.entries()),
            saveTime: Date.now()
        };

        localStorage.setItem('eldritch_painted_paths', JSON.stringify(pathData));
    }

    loadPaintedPaths() {
        try {
            const savedData = localStorage.getItem('eldritch_painted_paths');
            if (savedData) {
                const pathData = JSON.parse(savedData);
                this.loadPathData(pathData);
                console.log('🎨 Loaded painted paths from storage');
            }
        } catch (error) {
            console.error('🎨 Error loading painted paths:', error);
        }
    }

    updateDebugInfo() {
        const pathStats = document.getElementById('path-stats');
        const currentBrush = document.getElementById('current-brush');
        
        if (pathStats) {
            pathStats.textContent = `Points: ${this.visitedPoints.length} | Areas: ${this.paintedAreas.size}`;
        }
        
        if (currentBrush) {
            const brushSizeM = Math.round(this.brushSize * 111000);
            currentBrush.textContent = `Brush: ${this.currentBrushColor} (${brushSizeM}m)`;
        }
    }

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

    destroy() {
        if (this.paintingInterval) {
            clearInterval(this.paintingInterval);
        }
        
        this.paintedLayers.forEach(layer => {
            if (window.eldritchApp && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
                window.eldritchApp.systems.mapEngine.map.removeLayer(layer);
            }
        });
        
        const panel = document.getElementById('path-debug-panel');
        if (panel) {
            panel.remove();
        }
    }
}

// Make path painting system globally available
window.PathPaintingSystem = PathPaintingSystem;
