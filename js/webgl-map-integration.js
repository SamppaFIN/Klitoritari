/**
 * WebGL Map Integration
 * Integrates WebGL renderer with existing Leaflet map system
 * Provides smooth transition from DOM-based to GPU-based rendering
 */

class WebGLMapIntegration {
    constructor(mapEngine, webglRenderer) {
        this.mapEngine = mapEngine;
        this.webglRenderer = webglRenderer;
        this.isEnabled = false;
        this.objectMap = new Map(); // Maps Leaflet markers to WebGL objects
        this.renderLoop = null;
        this.lastRenderTime = 0;
        
        // Performance settings
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        
        this.init();
    }
    
    init() {
        console.log('🌌 WebGL Map Integration initializing...');
        
        // Wait for map to be ready
        if (this.mapEngine.map) {
            this.setupIntegration();
        } else {
            this.mapEngine.onMapReady = () => this.setupIntegration();
        }
    }
    
    setupIntegration() {
        console.log('🌌 Setting up WebGL integration with Leaflet map...');
        
        // Don't enable WebGL rendering yet - wait for map to be ready
        // this.enableWebGLRendering();
        
        // Set up map event listeners
        this.setupMapEventListeners();
        
        // Start render loop
        this.startRenderLoop();
        
        console.log('🌌 WebGL integration ready (WebGL rendering disabled until map is ready)');
    }
    
    enableWebGLRendering() {
        this.isEnabled = true;
        
        // Hide existing DOM markers
        this.hideDOMMarkers();
        
        // Convert existing markers to WebGL objects
        this.convertExistingMarkers();
    }
    
    disableWebGLRendering() {
        this.isEnabled = false;
        
        // Stop render loop
        if (this.renderLoop) {
            cancelAnimationFrame(this.renderLoop);
            this.renderLoop = null;
        }
        
        // Show DOM markers
        this.showDOMMarkers();
        
        // Clear WebGL objects
        this.webglRenderer.clear();
        this.objectMap.clear();
    }
    
    hideDOMMarkers() {
        // Hide all Leaflet markers by setting opacity to 0
        // Use safe method that checks if setOpacity exists
        const hideMarker = (marker) => {
            try {
                if (marker && typeof marker.setOpacity === 'function') {
                    marker.setOpacity(0);
                } else if (marker && marker.style) {
                    // Handle DOM elements
                    marker.style.opacity = '0';
                } else if (marker && marker.setStyle) {
                    // Handle L.Circle and other Leaflet objects with setStyle
                    marker.setStyle({ opacity: 0, fillOpacity: 0 });
                } else if (marker) {
                    // Log unknown marker type for debugging
                    console.warn('🌌 Unknown marker type in hideDOMMarkers:', typeof marker, marker);
                }
            } catch (error) {
                console.error('🌌 Error hiding marker:', error, marker);
            }
        };

        if (this.mapEngine.playerMarker) {
            hideMarker(this.mapEngine.playerMarker);
        }

        if (this.mapEngine.otherPlayerMarkers && typeof this.mapEngine.otherPlayerMarkers.forEach === 'function') {
            console.log('🌌 Hiding otherPlayerMarkers:', this.mapEngine.otherPlayerMarkers.size || this.mapEngine.otherPlayerMarkers.length);
            this.mapEngine.otherPlayerMarkers.forEach(hideMarker);
        }

        if (this.mapEngine.investigationMarkers && typeof this.mapEngine.investigationMarkers.forEach === 'function') {
            console.log('🌌 Hiding investigationMarkers:', this.mapEngine.investigationMarkers.size || this.mapEngine.investigationMarkers.length);
            this.mapEngine.investigationMarkers.forEach(hideMarker);
        }

        if (this.mapEngine.mysteryZoneMarkers && typeof this.mapEngine.mysteryZoneMarkers.forEach === 'function') {
            console.log('🌌 Hiding mysteryZoneMarkers:', this.mapEngine.mysteryZoneMarkers.size || this.mapEngine.mysteryZoneMarkers.length);
            this.mapEngine.mysteryZoneMarkers.forEach(hideMarker);
        }

        if (this.mapEngine.testQuestMarkers && typeof this.mapEngine.testQuestMarkers.forEach === 'function') {
            console.log('🌌 Hiding testQuestMarkers:', this.mapEngine.testQuestMarkers.size || this.mapEngine.testQuestMarkers.length);
            this.mapEngine.testQuestMarkers.forEach(hideMarker);
        }

        if (this.mapEngine.playerBaseMarker) {
            hideMarker(this.mapEngine.playerBaseMarker);
        }

        // DON'T hide important markers - they should always be visible
        console.log('🌌 Keeping pathway markers, legendary markers, POI markers, NPCs, and quest markers visible (not hiding them)');
        
        // Quest markers are handled by the quest system and should remain visible
        if (window.unifiedQuestSystem && window.unifiedQuestSystem.questMarkers) {
            console.log('🌌 Quest markers managed by quest system, keeping visible');
            console.log('🌌 Quest markers count:', window.unifiedQuestSystem.questMarkers.size);
        }
        
        // Check for legendary markers
        if (this.mapEngine.legendaryMarkers) {
            console.log('🌌 Legendary markers count:', this.mapEngine.legendaryMarkers.length);
        }
        
        // Check for NPC markers
        if (this.mapEngine.npcMarkers) {
            console.log('🌌 NPC markers count:', this.mapEngine.npcMarkers.length);
        }
    }
    
    showDOMMarkers() {
        // Show all Leaflet markers by setting opacity to 1
        // Use safe method that checks if setOpacity exists
        const showMarker = (marker) => {
            try {
                if (marker && typeof marker.setOpacity === 'function') {
                    marker.setOpacity(1);
                } else if (marker && marker.style) {
                    // Handle DOM elements
                    marker.style.opacity = '1';
                } else if (marker && marker.setStyle) {
                    // Handle L.Circle and other Leaflet objects with setStyle
                    marker.setStyle({ opacity: 1, fillOpacity: 0.8 });
                } else if (marker) {
                    // Log unknown marker type for debugging
                    console.warn('🌌 Unknown marker type in showDOMMarkers:', typeof marker, marker);
                }
            } catch (error) {
                console.error('🌌 Error showing marker:', error, marker);
            }
        };

        if (this.mapEngine.playerMarker) {
            showMarker(this.mapEngine.playerMarker);
        }

        if (this.mapEngine.otherPlayerMarkers && typeof this.mapEngine.otherPlayerMarkers.forEach === 'function') {
            console.log('🌌 Processing otherPlayerMarkers:', this.mapEngine.otherPlayerMarkers.size || this.mapEngine.otherPlayerMarkers.length);
            this.mapEngine.otherPlayerMarkers.forEach(showMarker);
        }

        if (this.mapEngine.investigationMarkers && typeof this.mapEngine.investigationMarkers.forEach === 'function') {
            console.log('🌌 Processing investigationMarkers:', this.mapEngine.investigationMarkers.size || this.mapEngine.investigationMarkers.length);
            this.mapEngine.investigationMarkers.forEach(showMarker);
        }

        if (this.mapEngine.mysteryZoneMarkers && typeof this.mapEngine.mysteryZoneMarkers.forEach === 'function') {
            console.log('🌌 Processing mysteryZoneMarkers:', this.mapEngine.mysteryZoneMarkers.size || this.mapEngine.mysteryZoneMarkers.length);
            this.mapEngine.mysteryZoneMarkers.forEach(showMarker);
        }

        if (this.mapEngine.testQuestMarkers && typeof this.mapEngine.testQuestMarkers.forEach === 'function') {
            console.log('🌌 Processing testQuestMarkers:', this.mapEngine.testQuestMarkers.size || this.mapEngine.testQuestMarkers.length);
            this.mapEngine.testQuestMarkers.forEach(showMarker);
        }

        if (this.mapEngine.playerBaseMarker) {
            showMarker(this.mapEngine.playerBaseMarker);
        }

        // Ensure important markers are visible
        if (this.mapEngine.pathwayMarkers && this.mapEngine.pathwayMarkers.length > 0) {
            console.log('🌌 Ensuring pathway markers are visible:', this.mapEngine.pathwayMarkers.length);
            this.mapEngine.pathwayMarkers.forEach(showMarker);
        }
        
        if (this.mapEngine.legendaryMarkers && this.mapEngine.legendaryMarkers.length > 0) {
            console.log('🌌 Ensuring legendary markers are visible:', this.mapEngine.legendaryMarkers.length);
            this.mapEngine.legendaryMarkers.forEach(showMarker);
        }
        
        if (this.mapEngine.pointsOfInterest && this.mapEngine.pointsOfInterest.length > 0) {
            console.log('🌌 Ensuring POI markers are visible:', this.mapEngine.pointsOfInterest.length);
            this.mapEngine.pointsOfInterest.forEach(poi => {
                if (poi.marker) showMarker(poi.marker);
            });
        }
        
        // Quest markers are handled by the quest system and should remain visible
        if (window.unifiedQuestSystem && window.unifiedQuestSystem.questMarkers) {
            console.log('🌌 Ensuring quest markers are visible:', window.unifiedQuestSystem.questMarkers.size);
            window.unifiedQuestSystem.questMarkers.forEach(showMarker);
        }
        
        // Ensure NPCs are visible (check if NPC system exists)
        if (window.eldritchApp && window.eldritchApp.systems.npc && window.eldritchApp.systems.npc.npcMarkers) {
            console.log('🌌 Ensuring NPC markers are visible:', window.eldritchApp.systems.npc.npcMarkers.length);
            window.eldritchApp.systems.npc.npcMarkers.forEach(showMarker);
        }
    }
    
    convertExistingMarkers() {
        console.log('🌌 Converting existing markers to WebGL objects...');
        console.log('🌌 Map engine player marker:', !!this.mapEngine.playerMarker);
        console.log('🌌 Map engine other player markers:', this.mapEngine.otherPlayerMarkers?.size || 0);
        console.log('🌌 Map engine investigation markers:', this.mapEngine.investigationMarkers?.size || 0);
        console.log('🌌 Map engine test quest markers:', this.mapEngine.testQuestMarkers?.size || 0);
        console.log('🌌 Map engine player base marker:', !!this.mapEngine.playerBaseMarker);
        
        // Convert player marker
        if (this.mapEngine.playerMarker) {
            console.log('🌌 Converting player marker...');
            this.convertPlayerMarker();
        } else {
            console.warn('🌌 No player marker found to convert');
        }
        
        // Convert other player markers
        this.mapEngine.otherPlayerMarkers.forEach((marker, playerId) => {
            this.convertOtherPlayerMarker(marker, playerId);
        });
        
        // Convert investigation markers
        this.mapEngine.investigationMarkers.forEach((marker, investigationId) => {
            this.convertInvestigationMarker(marker, investigationId);
        });
        
        // Convert quest markers
        this.mapEngine.testQuestMarkers.forEach((marker, questId) => {
            this.convertQuestMarker(marker, questId);
        });
        
        // Convert base marker
        if (this.mapEngine.playerBaseMarker) {
            this.convertBaseMarker();
        }
        
        console.log(`🌌 Converted ${this.objectMap.size} markers to WebGL objects`);
    }
    
    convertPlayerMarker() {
        const latlng = this.mapEngine.playerMarker.getLatLng();
        const normalizedPos = this.latLngToNormalized(latlng.lat, latlng.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 10,
            maxZoom: 20,
            size: 25,
            colorR: 0.0,
            colorG: 1.0,
            colorB: 0.0,
            animationSpeed: 2.0,
            glowIntensity: 0.8,
            pulseSpeed: 1.5,
            type: this.webglRenderer.objectTypes.PLAYER,
            flags: 1, // Player flag
            animation: 1 // Pulsing animation
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        console.log('🌌 Player marker converted to WebGL object:', { index, webglObject, normalizedPos });
        this.objectMap.set('player', { index, marker: this.mapEngine.playerMarker });
    }
    
    convertOtherPlayerMarker(marker, playerId) {
        const latlng = marker.getLatLng();
        const normalizedPos = this.latLngToNormalized(latlng.lat, latlng.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 10,
            maxZoom: 20,
            size: 15,
            colorR: 0.4,
            colorG: 0.0,
            colorB: 0.8,
            animationSpeed: 1.0,
            glowIntensity: 0.6,
            pulseSpeed: 1.0,
            type: this.webglRenderer.objectTypes.PLAYER,
            flags: 2, // Other player flag
            animation: 0
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set(`otherPlayer_${playerId}`, { index, marker });
    }
    
    convertInvestigationMarker(marker, investigationId) {
        const latlng = marker.getLatLng();
        const normalizedPos = this.latLngToNormalized(latlng.lat, latlng.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 12,
            maxZoom: 20,
            size: 20,
            colorR: 0.4,
            colorG: 0.0,
            colorB: 0.8,
            animationSpeed: 1.5,
            glowIntensity: 0.7,
            pulseSpeed: 2.0,
            type: this.webglRenderer.objectTypes.INVESTIGATION,
            flags: 4, // Investigation flag
            animation: 2 // Pulsing animation
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set(`investigation_${investigationId}`, { index, marker });
    }
    
    convertQuestMarker(marker, questId) {
        const latlng = marker.getLatLng();
        const normalizedPos = this.latLngToNormalized(latlng.lat, latlng.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 10,
            maxZoom: 20,
            size: 30,
            colorR: 0.0,
            colorG: 1.0,
            colorB: 0.5,
            animationSpeed: 2.0,
            glowIntensity: 0.9,
            pulseSpeed: 1.8,
            type: this.webglRenderer.objectTypes.QUEST,
            flags: 8, // Quest flag
            animation: 3 // Rotating animation
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set(`quest_${questId}`, { index, marker });
    }
    
    convertBaseMarker() {
        const latlng = this.mapEngine.playerBaseMarker.getLatLng();
        const normalizedPos = this.latLngToNormalized(latlng.lat, latlng.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 8,
            maxZoom: 20,
            size: 35,
            colorR: 1.0,
            colorG: 0.0,
            colorB: 0.0,
            animationSpeed: 1.0,
            glowIntensity: 1.0,
            pulseSpeed: 1.2,
            type: this.webglRenderer.objectTypes.BASE,
            flags: 16, // Base flag
            animation: 4 // Energy field animation
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set('base', { index, marker: this.mapEngine.playerBaseMarker });
    }
    
    setupMapEventListeners() {
        // Listen for map zoom changes
        this.mapEngine.map.on('zoomend', () => {
            this.updateMapState();
        });
        
        // Listen for map move events
        this.mapEngine.map.on('moveend', () => {
            this.updateMapState();
        });
        
        // Listen for marker updates
        this.setupMarkerUpdateListeners();
    }
    
    setupMarkerUpdateListeners() {
        // Override map engine methods to update WebGL objects
        const originalUpdatePlayerPosition = this.mapEngine.updatePlayerPosition.bind(this.mapEngine);
        this.mapEngine.updatePlayerPosition = (position) => {
            originalUpdatePlayerPosition(position);
            this.updatePlayerPosition(position);
        };
        
        const originalUpdateOtherPlayer = this.mapEngine.updateOtherPlayer.bind(this.mapEngine);
        this.mapEngine.updateOtherPlayer = (player) => {
            originalUpdateOtherPlayer(player);
            this.updateOtherPlayer(player);
        };
        
        const originalAddInvestigationMarker = this.mapEngine.addInvestigationMarker.bind(this.mapEngine);
        this.mapEngine.addInvestigationMarker = (investigation) => {
            originalAddInvestigationMarker(investigation);
            this.addInvestigationMarker(investigation);
        };
    }
    
    updatePlayerPosition(position) {
        if (!this.isEnabled) return;
        
        const normalizedPos = this.latLngToNormalized(position.lat, position.lng);
        const playerObj = this.objectMap.get('player');
        
        if (playerObj) {
            this.webglRenderer.updateObject(playerObj.index, {
                x: normalizedPos.x,
                y: normalizedPos.y
            });
        }
    }
    
    updateOtherPlayer(player) {
        if (!this.isEnabled) return;
        
        const normalizedPos = this.latLngToNormalized(player.position.lat, player.position.lng);
        const playerObj = this.objectMap.get(`otherPlayer_${player.id}`);
        
        if (playerObj) {
            this.webglRenderer.updateObject(playerObj.index, {
                x: normalizedPos.x,
                y: normalizedPos.y
            });
        } else {
            // Add new other player
            this.addOtherPlayer(player);
        }
    }
    
    addOtherPlayer(player) {
        const normalizedPos = this.latLngToNormalized(player.position.lat, player.position.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 10,
            maxZoom: 20,
            size: 15,
            colorR: 0.4,
            colorG: 0.0,
            colorB: 0.8,
            animationSpeed: 1.0,
            glowIntensity: 0.6,
            pulseSpeed: 1.0,
            type: this.webglRenderer.objectTypes.PLAYER,
            flags: 2,
            animation: 0
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set(`otherPlayer_${player.id}`, { index, marker: null });
    }
    
    addInvestigationMarker(investigation) {
        if (!this.isEnabled) return;
        
        const normalizedPos = this.latLngToNormalized(investigation.lat, investigation.lng);
        
        const webglObject = {
            x: normalizedPos.x,
            y: normalizedPos.y,
            minZoom: 12,
            maxZoom: 20,
            size: 20,
            colorR: 0.4,
            colorG: 0.0,
            colorB: 0.8,
            animationSpeed: 1.5,
            glowIntensity: 0.7,
            pulseSpeed: 2.0,
            type: this.webglRenderer.objectTypes.INVESTIGATION,
            flags: 4,
            animation: 2
        };
        
        const index = this.webglRenderer.addObject(webglObject);
        this.objectMap.set(`investigation_${investigation.id}`, { index, marker: null });
    }
    
    updateMapState() {
        if (!this.isEnabled) return;
        
        const zoom = this.mapEngine.map.getZoom();
        const center = this.mapEngine.map.getCenter();
        const bounds = this.mapEngine.map.getBounds();
        
        // Convert bounds to normalized coordinates
        const normalizedBounds = {
            min: this.latLngToNormalized(bounds.getSouth(), bounds.getWest()),
            max: this.latLngToNormalized(bounds.getNorth(), bounds.getEast())
        };
        
        const normalizedCenter = this.latLngToNormalized(center.lat, center.lng);
        
        this.webglRenderer.updateMapState(zoom, normalizedCenter, normalizedBounds);
    }
    
    latLngToNormalized(lat, lng) {
        // Convert lat/lng to normalized coordinates (-1 to 1)
        // Use current map center and bounds for proper conversion
        if (!this.mapEngine.map) {
            console.warn('🌌 Map not available for coordinate conversion');
            return { x: 0, y: 0 };
        }
        
        const mapCenter = this.mapEngine.map.getCenter();
        const mapBounds = this.mapEngine.map.getBounds();
        
        // Calculate normalized coordinates relative to current map view
        const lngRange = mapBounds.getEast() - mapBounds.getWest();
        const latRange = mapBounds.getNorth() - mapBounds.getSouth();
        
        const x = ((lng - mapCenter.lng) / (lngRange / 2)) * 0.8; // Scale to fit in view
        const y = ((lat - mapCenter.lat) / (latRange / 2)) * 0.8;
        
        console.log('🌌 Converting coordinates:', { lat, lng, x, y, mapCenter, lngRange, latRange });
        
        return { x, y };
    }
    
    startRenderLoop() {
        const render = (currentTime) => {
            if (!this.isEnabled) return;
            
            // Throttle rendering to target FPS
            if (currentTime - this.lastRenderTime >= this.frameInterval) {
                this.webglRenderer.render();
                this.lastRenderTime = currentTime;
            }
            
            this.renderLoop = requestAnimationFrame(render);
        };
        
        this.renderLoop = requestAnimationFrame(render);
    }
    
    // Public API for toggling WebGL rendering
    toggleWebGLRendering() {
        if (this.isEnabled) {
            this.disableWebGLRendering();
            console.log('🌌 WebGL rendering disabled');
        } else {
            this.enableWebGLRendering();
            console.log('🌌 WebGL rendering enabled');
        }
    }
    
    // Get performance stats
    getPerformanceStats() {
        return {
            objectCount: this.webglRenderer.getObjectCount(),
            isEnabled: this.isEnabled,
            targetFPS: this.targetFPS
        };
    }
}

// Export for use in other modules
window.WebGLMapIntegration = WebGLMapIntegration;
