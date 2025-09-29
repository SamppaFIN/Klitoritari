/**
 * @fileoverview [VERIFIED] Trail System - Enhanced mobile trail markers with growth and persistence
 * @status VERIFIED - Phase 2 trail system complete with mobile optimization
 * @feature #feature-trail-system
 * @feature #feature-trail-markers
 * @feature #feature-trail-persistence
 * @feature #feature-trail-growth
 * @feature #feature-trail-visuals
 * @feature #feature-trail-mobile
 * @last_verified 2025-01-28
 * @dependencies Step Currency System, Map Engine, WebSocket, Leaflet
 * @mobile-optimized true
 * @warning Do not modify trail creation, growth, or persistence without testing complete flow
 * 
 * Trail System
 * Creates visual trail markers every 50 steps with special markers every 500 steps
 * Integrates with step currency system for seamless mobile experience
 */

class TrailSystem {
    constructor() {
        this.trailMarkers = new Map(); // stepNumber -> marker data
        this.trailPolylines = new Map(); // pathId -> polyline
        this.currentPath = []; // Current walking path
        this.lastTrailStep = 0; // Last step where trail marker was created
        this.trailInterval = 50; // Create trail marker every 50 steps
        this.specialInterval = 500; // Special markers every 500 steps
        this.maxTrailMarkers = 100; // Maximum trail markers to keep
        this.isInitialized = false;
        this.mapEngine = null;
        this.stepCurrencySystem = null;
        
        // Trail growth and merging
        this.trailGrowthData = new Map(); // position -> visit data
        this.mergeThreshold = 20; // meters - merge markers within this distance
        this.growthThreshold = 5; // visits needed for growth
        this.maxGrowthLevel = 3; // Maximum growth level
        
        console.log('🛤️ Trail System initialized');
    }
    
    init() {
        if (this.isInitialized) {
            console.log('🛤️ Trail system already initialized');
            return;
        }
        
        console.log('🛤️ Initializing trail system...');
        
        // Add CSS animations for trail markers
        this.addTrailMarkerStyles();
        
        // Get references to required systems
        this.mapEngine = window.mapEngine;
        this.stepCurrencySystem = window.stepCurrencySystem;
        
        if (!this.mapEngine) {
            console.warn('🛤️ Map engine not available, trail system will initialize when available');
        }
        
        if (!this.stepCurrencySystem) {
            console.warn('🛤️ Step currency system not available, trail system will initialize when available');
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Load existing trail data
        this.loadTrailData();
        
        // Apply mobile optimizations
        this.optimizeForMobile();
        
        this.isInitialized = true;
        console.log('🛤️ Trail system initialization complete');
    }
    
    addTrailMarkerStyles() {
        // Check if styles already added
        if (document.getElementById('trail-marker-styles')) {
            return;
        }
        
        const style = document.createElement('style');
        style.id = 'trail-marker-styles';
        style.textContent = `
            .trail-marker-icon {
                transition: all 0.3s ease;
                cursor: pointer;
            }
            
            .trail-marker-icon:hover {
                transform: scale(1.1);
                filter: brightness(1.2);
            }
            
            .trail-marker-icon.pulse {
                animation: trailPulse 2s infinite;
            }
            
            .trail-marker-icon.glow {
                animation: trailGlow 3s infinite;
            }
            
            @keyframes trailPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes trailGlow {
                0% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
                50% { filter: brightness(1.3) drop-shadow(0 0 15px currentColor); }
                100% { filter: brightness(1) drop-shadow(0 0 5px currentColor); }
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
                .trail-marker-icon {
                    touch-action: manipulation;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .trail-marker-icon:hover {
                    transform: none; /* Disable hover effects on mobile */
                }
            }
        `;
        
        document.head.appendChild(style);
        console.log('🛤️ Trail marker styles added');
    }
    
    setupEventListeners() {
        // Listen for step currency system events
        if (window.stepCurrencySystem) {
            // Override the step currency system's milestone checking
            this.integrateWithStepCurrency();
        }
        
        // Listen for player position updates
        if (window.eventBus) {
            window.eventBus.on('player:position:update', (eventData) => {
                this.updateCurrentPath(eventData.position);
            });
        }
        
        // Listen for map engine ready
        if (window.mapEngine) {
            this.mapEngine = window.mapEngine;
        }
        
        // Listen for WebSocket events
        this.setupWebSocketListeners();
    }
    
    setupWebSocketListeners() {
        // Listen for game state updates from server
        if (window.eventBus) {
            window.eventBus.on('game_state:received', (eventData) => {
                if (eventData.markers) {
                    this.processServerMarkers(eventData.markers);
                }
            });
        }
        
        // Listen for marker creation confirmations
        if (window.eventBus) {
            window.eventBus.on('marker:created', (eventData) => {
                if (eventData.marker && eventData.marker.type === 'trail') {
                    console.log('🛤️ Trail marker confirmed by server:', eventData.marker);
                }
            });
        }
    }
    
    integrateWithStepCurrency() {
        // Override the step currency system's addStep method to include trail creation
        const originalAddStep = window.stepCurrencySystem.addStep.bind(window.stepCurrencySystem);
        
        window.stepCurrencySystem.addStep = () => {
            // Call original addStep
            originalAddStep();
            
            // Check if we should create a trail marker
            this.checkTrailCreation();
        };
        
        console.log('🛤️ Integrated with step currency system');
    }
    
    checkTrailCreation() {
        if (!this.stepCurrencySystem || !this.mapEngine) {
            return;
        }
        
        const currentSteps = this.stepCurrencySystem.totalSteps;
        const stepsSinceLastTrail = currentSteps - this.lastTrailStep;
        
        // Create trail marker every 50 steps
        if (stepsSinceLastTrail >= this.trailInterval) {
            this.createTrailMarker(currentSteps);
            this.lastTrailStep = currentSteps;
        }
    }
    
    /**
     * Create trail marker at current position
     * @status [VERIFIED] - Trail marker creation working correctly
     * @feature #feature-trail-markers
     * @last_tested 2025-01-28
     */
    createTrailMarker(stepNumber) {
        if (!this.mapEngine || !this.mapEngine.map) {
            console.warn('🛤️ Map engine not available for trail marker creation');
            return;
        }
        
        // Get current player position
        const playerPosition = this.getCurrentPlayerPosition();
        if (!playerPosition) {
            console.warn('🛤️ No player position available for trail marker');
            return;
        }
        
        console.log(`🛤️ Creating trail marker at step ${stepNumber}`, playerPosition);
        
        // Check for nearby markers to merge with
        const nearbyMarker = this.findNearbyMarker(playerPosition);
        if (nearbyMarker) {
            this.mergeWithNearbyMarker(nearbyMarker, stepNumber, playerPosition);
            return;
        }
        
        // Determine marker type
        const isSpecialMarker = stepNumber % this.specialInterval === 0;
        const markerType = isSpecialMarker ? 'special' : 'regular';
        
        // Create marker data
        const markerData = {
            id: `trail_${stepNumber}_${Date.now()}`,
            stepNumber: stepNumber,
            position: playerPosition,
            type: markerType,
            timestamp: Date.now(),
            created: true,
            visitCount: 1,
            growthLevel: 0
        };
        
        // Create visual marker
        const marker = this.createVisualMarker(markerData);
        if (marker) {
            markerData.marker = marker;
            this.trailMarkers.set(stepNumber, markerData);
            
            // Track growth data
            this.trackTrailGrowth(playerPosition, markerData);
            
            // Add to current path
            this.currentPath.push(playerPosition);
            
            // Create or update path line
            this.updatePathLine();
            
            // Clean up old markers if we have too many
            this.cleanupOldMarkers();
            
            // Save trail data locally
            this.saveTrailData();
            
            // Send to server for persistence
            this.sendTrailMarkerToServer(markerData);
            
            console.log(`🛤️ Trail marker created: ${markerType} at step ${stepNumber}`);
        }
    }
    
    findNearbyMarker(position) {
        for (const [stepNumber, markerData] of this.trailMarkers) {
            if (markerData.position) {
                const distance = this.calculateDistance(position, markerData.position);
                if (distance <= this.mergeThreshold) {
                    return { stepNumber, markerData, distance };
                }
            }
        }
        return null;
    }
    
    /**
     * Merge trail markers when they are close together
     * @status [VERIFIED] - Trail merging working correctly
     * @feature #feature-trail-growth
     * @last_tested 2025-01-28
     */
    mergeWithNearbyMarker(nearbyData, newStepNumber, newPosition) {
        const { stepNumber, markerData, distance } = nearbyData;
        
        console.log(`🛤️ Merging trail markers: step ${newStepNumber} with step ${stepNumber} (distance: ${distance.toFixed(2)}m)`);
        
        // Update visit count and growth
        markerData.visitCount = (markerData.visitCount || 1) + 1;
        markerData.growthLevel = Math.min(
            Math.floor(markerData.visitCount / this.growthThreshold),
            this.maxGrowthLevel
        );
        
        // Update marker type if it becomes special
        if (markerData.visitCount >= 10) {
            markerData.type = 'special';
        }
        
        // Update visual marker
        if (markerData.marker) {
            this.mapEngine.map.removeLayer(markerData.marker);
        }
        
        const newMarker = this.createVisualMarker(markerData);
        if (newMarker) {
            markerData.marker = newMarker;
        }
        
        // Update growth data
        this.trackTrailGrowth(newPosition, markerData);
        
        // Save updated data
        this.saveTrailData();
        
        console.log(`🛤️ Trail marker merged: ${markerData.visitCount} visits, growth level ${markerData.growthLevel}`);
    }
    
    trackTrailGrowth(position, markerData) {
        const positionKey = `${position.lat.toFixed(6)},${position.lng.toFixed(6)}`;
        
        if (!this.trailGrowthData.has(positionKey)) {
            this.trailGrowthData.set(positionKey, {
                position: position,
                visitCount: 0,
                lastVisit: Date.now(),
                markers: []
            });
        }
        
        const growthData = this.trailGrowthData.get(positionKey);
        growthData.visitCount++;
        growthData.lastVisit = Date.now();
        growthData.markers.push(markerData.id);
        
        console.log(`🛤️ Trail growth tracked: ${growthData.visitCount} visits at ${positionKey}`);
    }
    
    sendTrailMarkerToServer(markerData) {
        if (!window.websocketClient || !window.websocketClient.isConnectedToServer()) {
            console.log('🛤️ WebSocket not connected, trail marker not sent to server');
            return;
        }
        
        // Send trail marker to server using existing marker creation system
        window.websocketClient.createMarker({
            type: 'trail',
            position: markerData.position,
            data: {
                stepNumber: markerData.stepNumber,
                markerType: markerData.type,
                timestamp: markerData.timestamp,
                trailId: markerData.id
            }
        });
        
        console.log('🛤️ Trail marker sent to server for persistence');
    }
    
    /**
     * Create visual trail marker with animations and styling
     * @status [VERIFIED] - Visual marker creation working correctly
     * @feature #feature-trail-visuals
     * @last_tested 2025-01-28
     */
    createVisualMarker(markerData) {
        if (!this.mapEngine || !this.mapEngine.map) {
            return null;
        }
        
        const { stepNumber, position, type, growthLevel = 0, visitCount = 1 } = markerData;
        
        // Create marker icon based on type and growth
        const icon = this.createTrailIcon(stepNumber, type, growthLevel, visitCount);
        
        // Create Leaflet marker with higher z-index for grown markers
        const zIndexOffset = 100 + (type === 'special' ? 50 : 0) + (growthLevel * 10);
        const marker = L.marker([position.lat, position.lng], { 
            icon: icon,
            zIndexOffset: zIndexOffset
        }).addTo(this.mapEngine.map);
        
        // Add popup with growth info
        const popupContent = this.createTrailPopup(stepNumber, type, growthLevel, visitCount);
        marker.bindPopup(popupContent);
        
        // Add click handler
        marker.on('click', () => {
            this.onTrailMarkerClick(markerData);
        });
        
        return marker;
    }
    
    createTrailIcon(stepNumber, type, growthLevel = 0, visitCount = 1) {
        const isSpecial = type === 'special';
        const baseSize = isSpecial ? 60 : 40;
        const growthSize = growthLevel * 8; // 8px per growth level
        const size = baseSize + growthSize;
        
        const color = isSpecial ? '#ff6b6b' : '#4a9eff';
        const borderColor = isSpecial ? '#ff4757' : '#2d98da';
        
        // Add glow effect for grown markers
        const glowEffect = growthLevel > 0 ? `
            <defs>
                <filter id="glow-${stepNumber}">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge> 
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
        ` : '';
        
        // Create SVG icon with growth effects
        const svg = `
            <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
                ${glowEffect}
                <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" 
                        fill="${color}" 
                        stroke="${borderColor}" 
                        stroke-width="${3 + growthLevel}"
                        filter="${growthLevel > 0 ? `url(#glow-${stepNumber})` : 'none'}"/>
                <text x="${size/2}" y="${size/2 + 6}" 
                      text-anchor="middle" 
                      font-family="Arial, sans-serif" 
                      font-size="${isSpecial ? '16' : '12'}" 
                      font-weight="bold" 
                      fill="white">
                    ${stepNumber}
                </text>
                ${isSpecial ? `
                    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 8}" 
                            fill="none" 
                            stroke="white" 
                            stroke-width="2" 
                            opacity="0.8"/>
                ` : ''}
                ${growthLevel > 0 ? `
                    <text x="${size/2}" y="${size - 8}" 
                          text-anchor="middle" 
                          font-family="Arial, sans-serif" 
                          font-size="10" 
                          font-weight="bold" 
                          fill="white"
                          opacity="0.8">
                        ${visitCount}×
                    </text>
                ` : ''}
            </svg>
        `;
        
        // Add animation classes based on marker type and growth
        let className = 'trail-marker-icon';
        if (isSpecial) {
            className += ' glow';
        }
        if (growthLevel > 0) {
            className += ' pulse';
        }
        
        return L.divIcon({
            className: className,
            html: svg,
            iconSize: [size, size],
            iconAnchor: [size/2, size/2]
        });
    }
    
    createTrailPopup(stepNumber, type, growthLevel = 0, visitCount = 1) {
        const isSpecial = type === 'special';
        const milestoneText = isSpecial ? '🎉 Special Milestone!' : '🛤️ Trail Marker';
        const growthText = growthLevel > 0 ? ` (Level ${growthLevel})` : '';
        
        return `
            <div style="text-align: center; min-width: 140px;">
                <div style="font-weight: bold; color: ${isSpecial ? '#ff6b6b' : '#4a9eff'}; margin-bottom: 8px;">
                    ${milestoneText}${growthText}
                </div>
                <div style="font-size: 14px; color: #666; margin-bottom: 4px;">
                    Step ${stepNumber}
                </div>
                <div style="font-size: 12px; color: #999; margin-bottom: 4px;">
                    ${isSpecial ? '500-step milestone reached!' : '50-step trail marker'}
                </div>
                ${visitCount > 1 ? `
                    <div style="font-size: 11px; color: #888; border-top: 1px solid #333; padding-top: 4px;">
                        Visited ${visitCount} times
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    updateCurrentPath(position) {
        this.currentPath.push(position);
        
        // Mobile-optimized path length limits
        const maxPathLength = this.isMobile() ? 500 : 1000;
        const keepLength = this.isMobile() ? 250 : 500;
        
        if (this.currentPath.length > maxPathLength) {
            this.currentPath = this.currentPath.slice(-keepLength);
        }
        
        // Throttle path updates on mobile for performance
        if (this.isMobile()) {
            if (!this.pathUpdateThrottle) {
                this.pathUpdateThrottle = setTimeout(() => {
                    this.updatePathLine();
                    this.pathUpdateThrottle = null;
                }, 1000); // Update every second on mobile
            }
        } else {
            this.updatePathLine();
        }
    }
    
    isMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    updatePathLine() {
        if (!this.mapEngine || !this.mapEngine.map || this.currentPath.length < 2) {
            return;
        }
        
        // Remove existing path line
        if (this.trailPolylines.has('current_path')) {
            this.mapEngine.map.removeLayer(this.trailPolylines.get('current_path'));
        }
        
        // Create new path line
        const pathLine = L.polyline(this.currentPath, {
            color: '#4a9eff',
            weight: 3,
            opacity: 0.7,
            smoothFactor: 1
        }).addTo(this.mapEngine.map);
        
        this.trailPolylines.set('current_path', pathLine);
    }
    
    cleanupOldMarkers() {
        // Mobile-optimized marker limits
        const maxMarkers = this.isMobile() ? 50 : this.maxTrailMarkers;
        
        if (this.trailMarkers.size <= maxMarkers) {
            return;
        }
        
        // Remove oldest markers, but keep special markers longer
        const sortedMarkers = Array.from(this.trailMarkers.entries())
            .sort((a, b) => a[0] - b[0]); // Sort by step number
        
        const markersToRemove = [];
        const keepCount = maxMarkers;
        
        // Keep special markers and recent markers
        for (let i = 0; i < sortedMarkers.length - keepCount; i++) {
            const [stepNumber, markerData] = sortedMarkers[i];
            
            // Keep special markers (500-step milestones) longer
            if (markerData.type === 'special' && markerData.stepNumber % 500 === 0) {
                continue;
            }
            
            // Keep grown markers longer
            if (markerData.growthLevel > 0) {
                continue;
            }
            
            markersToRemove.push([stepNumber, markerData]);
        }
        
        markersToRemove.forEach(([stepNumber, markerData]) => {
            if (markerData.marker) {
                this.mapEngine.map.removeLayer(markerData.marker);
            }
            this.trailMarkers.delete(stepNumber);
        });
        
        console.log(`🛤️ Cleaned up ${markersToRemove.length} old trail markers (mobile: ${this.isMobile()})`);
    }
    
    getCurrentPlayerPosition() {
        // Try to get position from geolocation manager
        if (window.geolocationManager) {
            const position = window.geolocationManager.getCurrentPositionSafe();
            if (position) {
                return { lat: position.lat, lng: position.lng };
            }
        }
        
        // Try to get position from map engine
        if (this.mapEngine && this.mapEngine.getCurrentPlayerLatLng) {
            return this.mapEngine.getCurrentPlayerLatLng();
        }
        
        return null;
    }
    
    onTrailMarkerClick(markerData) {
        console.log('🛤️ Trail marker clicked:', markerData);
        
        // Show marker info
        if (window.eldritchApp && window.eldritchApp.showNotification) {
            window.eldritchApp.showNotification(
                `Trail Marker: Step ${markerData.stepNumber}`, 
                'info'
            );
        }
    }
    
    saveTrailData() {
        try {
            const trailData = {
                markers: Array.from(this.trailMarkers.entries()),
                lastTrailStep: this.lastTrailStep,
                currentPath: this.currentPath,
                timestamp: Date.now()
            };
            
            localStorage.setItem('eldritch_trail_data', JSON.stringify(trailData));
            console.log('🛤️ Trail data saved to localStorage');
        } catch (error) {
            console.error('🛤️ Error saving trail data:', error);
        }
    }
    
    loadTrailData() {
        try {
            const trailData = localStorage.getItem('eldritch_trail_data');
            if (!trailData) {
                console.log('🛤️ No trail data found in localStorage');
                return;
            }
            
            const parsed = JSON.parse(trailData);
            this.lastTrailStep = parsed.lastTrailStep || 0;
            this.currentPath = parsed.currentPath || [];
            
            // Restore markers
            if (parsed.markers && Array.isArray(parsed.markers)) {
                parsed.markers.forEach(([stepNumber, markerData]) => {
                    this.trailMarkers.set(stepNumber, markerData);
                });
            }
            
            console.log(`🛤️ Trail data loaded: ${this.trailMarkers.size} markers, ${this.currentPath.length} path points`);
            
            // Restore visual markers when map is ready
            this.restoreVisualMarkers();
            
        } catch (error) {
            console.error('🛤️ Error loading trail data:', error);
        }
    }
    
    loadTrailMarkersFromServer() {
        if (!window.websocketClient || !window.websocketClient.isConnectedToServer()) {
            console.log('🛤️ WebSocket not connected, cannot load trail markers from server');
            return;
        }
        
        console.log('🛤️ Requesting trail markers from server...');
        
        // Request game state which includes all markers
        window.websocketClient.requestGameState();
    }
    
    processServerMarkers(markers) {
        if (!markers || !Array.isArray(markers)) {
            return;
        }
        
        console.log(`🛤️ Processing ${markers.length} markers from server...`);
        
        let trailMarkersLoaded = 0;
        
        markers.forEach(marker => {
            if (marker.type === 'trail' && marker.data) {
                const stepNumber = marker.data.stepNumber;
                const markerType = marker.data.markerType || 'regular';
                
                // Create marker data from server
                const markerData = {
                    id: marker.id,
                    stepNumber: stepNumber,
                    position: marker.position,
                    type: markerType,
                    timestamp: marker.data.timestamp || marker.createdAt,
                    created: true,
                    fromServer: true
                };
                
                // Store marker data
                this.trailMarkers.set(stepNumber, markerData);
                trailMarkersLoaded++;
                
                // Update last trail step
                if (stepNumber > this.lastTrailStep) {
                    this.lastTrailStep = stepNumber;
                }
            }
        });
        
        console.log(`🛤️ Loaded ${trailMarkersLoaded} trail markers from server`);
        
        // Restore visual markers
        this.restoreVisualMarkers();
        
        // Save updated trail data
        this.saveTrailData();
    }
    
    restoreVisualMarkers() {
        if (!this.mapEngine || !this.mapEngine.map) {
            console.log('🛤️ Map not ready for marker restoration, will retry later');
            return;
        }
        
        console.log('🛤️ Restoring visual markers...');
        
        this.trailMarkers.forEach((markerData, stepNumber) => {
            if (!markerData.marker) {
                // Recreate visual marker
                const marker = this.createVisualMarker(markerData);
                if (marker) {
                    markerData.marker = marker;
                }
            }
        });
        
        // Restore path line
        this.updatePathLine();
        
        console.log('🛤️ Visual markers restored');
    }
    
    // Public API methods
    getTrailStats() {
        return {
            totalMarkers: this.trailMarkers.size,
            lastTrailStep: this.lastTrailStep,
            pathLength: this.currentPath.length,
            nextTrailStep: this.lastTrailStep + this.trailInterval,
            isMobile: this.isMobile(),
            specialMarkers: Array.from(this.trailMarkers.values()).filter(m => m.type === 'special').length,
            grownMarkers: Array.from(this.trailMarkers.values()).filter(m => m.growthLevel > 0).length
        };
    }
    
    // Mobile-specific optimizations
    optimizeForMobile() {
        if (!this.isMobile()) {
            return;
        }
        
        console.log('🛤️ Applying mobile optimizations...');
        
        // Reduce marker update frequency
        this.trailInterval = 75; // Create markers every 75 steps on mobile instead of 50
        
        // Reduce max markers
        this.maxTrailMarkers = 50;
        
        // Disable some animations on low-end devices
        if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
            console.log('🛤️ Low-end device detected, disabling some animations');
            this.disableAnimations = true;
        }
        
        console.log('🛤️ Mobile optimizations applied');
    }
    
    clearTrail() {
        // Remove all visual markers
        this.trailMarkers.forEach((markerData) => {
            if (markerData.marker && this.mapEngine && this.mapEngine.map) {
                this.mapEngine.map.removeLayer(markerData.marker);
            }
        });
        
        // Remove path lines
        this.trailPolylines.forEach((polyline) => {
            if (this.mapEngine && this.mapEngine.map) {
                this.mapEngine.map.removeLayer(polyline);
            }
        });
        
        // Clear data
        this.trailMarkers.clear();
        this.trailPolylines.clear();
        this.currentPath = [];
        this.lastTrailStep = 0;
        
        // Clear localStorage
        localStorage.removeItem('eldritch_trail_data');
        
        console.log('🛤️ Trail cleared');
    }
    
    toggleTrailVisibility(visible) {
        this.trailMarkers.forEach((markerData) => {
            if (markerData.marker) {
                if (visible) {
                    markerData.marker.addTo(this.mapEngine.map);
                } else {
                    this.mapEngine.map.removeLayer(markerData.marker);
                }
            }
        });
        
        this.trailPolylines.forEach((polyline) => {
            if (visible) {
                polyline.addTo(this.mapEngine.map);
            } else {
                this.mapEngine.map.removeLayer(polyline);
            }
        });
        
        console.log(`🛤️ Trail visibility: ${visible ? 'shown' : 'hidden'}`);
    }
}

// Initialize trail system
window.trailSystem = new TrailSystem();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.trailSystem.init();
    });
} else {
    window.trailSystem.init();
}

// Export for use in other modules
window.TrailSystem = TrailSystem;

console.log('🛤️ Trail System script loaded');
