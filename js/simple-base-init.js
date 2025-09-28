// Simple Base Initialization System
// This is a clean, minimal approach to base management

class SimpleBaseInit {
    constructor() {
        this.baseData = null;
        this.map = null;
        this.baseMarker = null;
    }

    // Main initialization function
    async init() {
        console.log('🏗️ Simple Base Init: Starting...');
        
        try {
            // 1. Get the data
            this.baseData = this.getBaseData();
            console.log('🏗️ Base data:', this.baseData);
            
            // 2. Wait for map to be ready
            await this.waitForMap();
            
            // 3. Create base marker if data exists
            if (this.baseData) {
                this.createBaseMarker();
            } else {
                console.log('🏗️ No base data - new game');
            }
            
            console.log('🏗️ Simple Base Init: Complete');
        } catch (error) {
            console.error('🏗️ Simple Base Init failed:', error);
        }
    }

    // Clear invalid base data
    clearInvalidBaseData() {
        try {
            const keys = ['playerBase', 'base_bases', 'eldritch-player-base'];
            keys.forEach(key => {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    // Clear if not a valid established base
                    if (Array.isArray(parsed)) {
                        const hasValidBase = parsed.some(base => base && base.established === true);
                        if (!hasValidBase) {
                            localStorage.removeItem(key);
                            console.log('🧹 Cleared invalid base data from', key);
                        }
                    } else if (parsed && typeof parsed === 'object' && parsed.established !== true) {
                        localStorage.removeItem(key);
                        console.log('🧹 Cleared invalid base data from', key);
                    }
                }
            });
        } catch (error) {
            console.warn('⚠️ Error clearing invalid base data:', error);
        }
    }

    // Get base data from localStorage
    getBaseData() {
        try {
            // First clear any invalid data
            this.clearInvalidBaseData();
            
            // Try different localStorage keys
            const keys = ['playerBase', 'base_bases', 'eldritch-player-base'];
            
            for (const key of keys) {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    
                    // Handle array format
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        const baseData = parsed[0];
                        // Only return if it's a valid established base
                        if (baseData && baseData.established === true) {
                            return baseData;
                        }
                    }
                    
                    // Handle object format
                    if (parsed && typeof parsed === 'object' && parsed.established === true) {
                        return parsed;
                    }
                }
            }
            
            return null;
        } catch (error) {
            console.error('🏗️ Error getting base data:', error);
            return null;
        }
    }

    // Wait for map to be ready
    async waitForMap() {
        const maxWait = 10000; // 10 seconds
        const startTime = Date.now();
        
        while (!this.map) {
            if (Date.now() - startTime > maxWait) {
                throw new Error('Map initialization timeout');
            }
            
            // Try to get map from different sources
            if (window.mapEngine && window.mapEngine.map) {
                this.map = window.mapEngine.map;
                console.log('🏗️ Map found via mapEngine');
                break;
            } else if (window.map) {
                this.map = window.map;
                console.log('🏗️ Map found via global window.map');
                break;
            }
            
            // Wait 100ms before trying again
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    // Create base marker on map
    createBaseMarker() {
        if (!this.map || !this.baseData) {
            console.warn('🏗️ Cannot create base marker - missing map or data');
            return;
        }

        try {
            // Get position from base data
            let lat, lng;
            if (this.baseData.position) {
                lat = this.baseData.position.lat;
                lng = this.baseData.position.lng;
            } else {
                lat = this.baseData.lat;
                lng = this.baseData.lng;
            }

            if (!lat || !lng) {
                console.warn('🏗️ Invalid position data:', this.baseData);
                return;
            }

            console.log('🏗️ Creating enhanced SVG base marker at:', lat, lng);

            // Use SVG Base Graphics if available, otherwise fallback to simple marker
            if (window.SVGBaseGraphics) {
                console.log('🎨 Using SVG Base Graphics system');
                this.createSVGBaseMarker(lat, lng);
            } else {
                console.log('🎨 Using simple base marker (SVG system not available)');
                this.createSimpleBaseMarker(lat, lng);
            }
            
        } catch (error) {
            console.error('🏗️ Error creating base marker:', error);
        }
    }

    /**
     * BRDC: Create SVG-based base marker using the new SVG Base Graphics system
     * 
     * This method integrates with the SVGBaseGraphics class to create animated,
     * cosmic-themed base markers with territory circles, flags, and particle effects.
     * 
     * Implements: #feature-base-building
     * Uses: #enhancement-svg-graphics
     * 
     * @param {number} lat - Latitude coordinate
     * @param {number} lng - Longitude coordinate
     */
    createSVGBaseMarker(lat, lng) {
        console.log('🎨 Creating SVG base marker with new graphics system');
        
        // Initialize SVG graphics system if not already done
        if (!window.svgBaseGraphics) {
            window.svgBaseGraphics = new window.SVGBaseGraphics();
        }
        
        // Get base configuration from localStorage
        const baseLogoType = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
        const baseColor = localStorage.getItem('eldritch_player_color') || '#8b5cf6';
        
        // Configure base appearance with cosmic theming
        const baseConfig = {
            size: 240, // 3x player icon size as specified in plan
            colors: {
                primary: baseColor,
                secondary: '#3b82f6',
                accent: '#f59e0b',
                energy: '#10b981'
            },
            animations: {
                territoryPulse: true,
                flagWave: true,
                particleEffects: true,
                energyGlow: true
            }
        };
        
        // Create animated base marker using SVG graphics system
        this.baseMarker = window.svgBaseGraphics.createAnimatedBaseMarker(
            { lat: lat, lng: lng },
            baseConfig,
            'finnish', // Force Finnish flag
            this.map, // Pass the map instance for zoom detection
            'own' // This is always the player's own base
        );
        
        // Add to map
        this.baseMarker.addTo(this.map);
        
        // Create enhanced popup with base information
        this.baseMarker.bindPopup(`
            <div style="text-align: center; padding: 15px; min-width: 200px;">
                <h3 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 18px;">
                    🏗️ My Cosmic Base
                </h3>
                <div style="margin: 10px 0; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                    <p style="margin: 0 0 5px 0; color: #e5e7eb;">Level: <strong>${this.baseData.level || 1}</strong></p>
                    <p style="margin: 0 0 5px 0; color: #e5e7eb;">Territory: <strong>${this.baseData.territorySize || 'Small'}</strong></p>
                    <p style="margin: 0; color: #e5e7eb;">Flag: <strong>${baseLogoType.charAt(0).toUpperCase() + baseLogoType.slice(1)}</strong></p>
                </div>
                <button onclick="window.SimpleBaseInit?.openBaseMenu?.()" 
                        style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); 
                               color: white; border: none; padding: 10px 20px; 
                               border-radius: 8px; cursor: pointer; font-weight: bold;
                               box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                               transition: all 0.3s ease;">
                    Manage Base
                </button>
            </div>
        `);
        
        // Add click handler for base menu
        this.baseMarker.on('click', () => {
            console.log('🎨 Base marker clicked - opening management menu');
            this.openBaseMenu();
        });
        
        console.log('🎨 SVG base marker created successfully with animations');
        
        // Center map on base with smooth animation
        this.map.setView([lat, lng], 18, { animate: true, duration: 1.0 });
    }

    // Create simple base marker (fallback)
    createSimpleBaseMarker(lat, lng) {
        const baseIcon = L.divIcon({
            className: 'simple-base-marker',
            html: `
                <div style="
                    width: 60px; 
                    height: 60px; 
                    border-radius: 50%; 
                    border: 3px solid #fff; 
                    box-shadow: 0 0 10px rgba(0,0,0,0.5);
                    background: #8b5cf6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                ">
                    🏗️
                </div>
            `,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });

        // Create marker
        this.baseMarker = L.marker([lat, lng], { icon: baseIcon }).addTo(this.map);
        this.baseMarker.bindPopup('<b>🏗️ My Base</b><br>Your established base');

        console.log('🏗️ Simple base marker created successfully');
        
        // Center map on base
        this.map.setView([lat, lng], 18);
    }

    // Get current player ID
    getCurrentPlayerId() {
        // Try to get player ID from various sources
        const playerId = localStorage.getItem('playerId') || 
                        localStorage.getItem('eldritch-player-id') ||
                        localStorage.getItem('player_id') ||
                        'default-player';
        
        // If no player ID exists, generate one
        if (!localStorage.getItem('playerId')) {
            const newPlayerId = `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('playerId', newPlayerId);
            console.log('🆔 Generated new player ID:', newPlayerId);
            return newPlayerId;
        }
        
        return playerId;
    }

    // Open base management menu
    openBaseMenu() {
        console.log('🏗️ Opening base management menu...');
        
        // Check if we have a base management system available
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            const threejsUI = window.eldritchApp.layerManager.getLayer('threejs-ui');
            if (threejsUI && threejsUI.enhancedUI) {
                console.log('🎮 Opening base menu via Three.js UI');
                threejsUI.enhancedUI.switchTab('base');
                return;
            }
        }
        
        // If Three.js UI not available, try alternative methods
        console.warn('⚠️ Three.js UI not available, trying alternative tab switching');
        
        // Try to find and click the base tab directly
        const baseTab = document.querySelector('[data-tab="base"]') || 
                       document.querySelector('button[onclick*="base"]') ||
                       document.querySelector('button:contains("Base")');
        
        if (baseTab) {
            baseTab.click();
            console.log('🎮 Opened base tab via direct click');
        } else {
            console.error('❌ Could not find base tab to open');
        }
    }

    // Establish base at current location
    establishBaseAtCurrentLocation() {
        console.log('🏗️ Establishing base at current location...');
        console.log('🔍 Debug - this.baseData before check:', this.baseData);
        
        // Check if player already has a base
        if (this.baseData) {
            console.warn('⚠️ Player already has a base! Only 1 base allowed.');
            alert('You can only have one base at a time! Please remove your existing base first.');
            return;
        }
        
        // Get current player position
        if (window.mapLayer && window.mapLayer.map) {
            const currentPos = window.mapLayer.getCurrentPlayerPosition();
            if (currentPos) {
                console.log('🏗️ Using current player position:', currentPos);
                this.establishBaseAtPosition(currentPos);
            } else {
                console.error('❌ Could not get current player position');
                alert('Could not determine your current location. Please try using the map to select a location.');
            }
        } else {
            console.error('❌ Map not available');
            alert('Map not available. Please try again later.');
        }
    }
    
    // Show base location selector
    showBaseLocationSelector() {
        console.log('🗺️ Showing base location selector...');
        
        // Check if player already has a base
        if (this.baseData) {
            console.warn('⚠️ Player already has a base! Only 1 base allowed.');
            alert('You can only have one base at a time! Please remove your existing base first.');
            return;
        }
        
        // Show instructions for map selection
        alert('🗺️ Base Location Selector\n\nRight-click on the map where you want to establish your base, then select "Create Base Marker" from the context menu.\n\nThis will establish your cosmic base at that location.');
        
        // Focus on map
        if (window.mapLayer && window.mapLayer.map) {
            window.mapLayer.map.invalidateSize();
        }
    }
    
    // Establish base at specific position
    establishBaseAtPosition(position) {
        console.log('🏗️ Establishing base at position:', position);
        
        // Check step requirements
        const stepSystem = window.stepCurrencySystem;
        if (stepSystem && stepSystem.totalSteps < 1000) {
            console.warn('⚠️ Insufficient steps for base establishment');
            alert(`Insufficient steps! You need 1,000 steps to establish a base.\n\nCurrent steps: ${stepSystem.totalSteps}\nRequired: 1,000`);
            return;
        }
        
        // Create base data
        const baseData = {
            id: `base_${Date.now()}`,
            name: 'My Cosmic Base',
            position: position,
            level: 1,
            territorySize: 'Small',
            established: true,
            establishedAt: new Date().toISOString(),
            cosmicEnergy: 100,
            communityConnections: 0,
            isOwnBase: true,
            owner: 'You',
            playerId: this.getCurrentPlayerId()
        };
        
        // Save base data
        this.baseData = baseData;
        localStorage.setItem('playerBase', JSON.stringify(baseData));
        console.log('🏗️ Base data saved to localStorage');
        
        // Create base marker
        this.createBaseMarker();
        
        // Deduct steps
        if (stepSystem) {
            stepSystem.totalSteps -= 1000;
            stepSystem.saveSteps();
            stepSystem.updateStepCounter();
            console.log('🏗️ Deducted 1,000 steps for base establishment');
        }
        
        // Send to server for persistence
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🏗️ Sending base marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'base',
                position: position,
                data: baseData
            });
        }
        
        // Show success message
        alert('🏗️ Cosmic Base Established!\n\nYour base has been successfully established at this location. You can now manage it through the Base Management tab.');
        
        // Refresh the UI to show the new base
        console.log('🔄 Refreshing UI to show new base...');
        setTimeout(() => {
            if (window.eldritchApp && window.eldritchApp.layerManager) {
                const threejsUI = window.eldritchApp.layerManager.getLayer('threejs-ui');
                if (threejsUI) {
                    // Try both refresh methods
                    if (threejsUI.enhancedUI && threejsUI.enhancedUI.refreshCurrentTab) {
                        threejsUI.enhancedUI.refreshCurrentTab();
                    }
                    if (threejsUI.forceRefreshBaseTab) {
                        threejsUI.forceRefreshBaseTab();
                    }
                    console.log('🔄 UI refreshed successfully');
                } else {
                    console.warn('⚠️ Three.js UI not available for refresh');
                }
            } else {
                console.warn('⚠️ EldritchApp not available for refresh');
            }
        }, 500);
    }


    // Relocate base
    relocateBase() {
        console.log('🏗️ Starting base relocation...');
        
        // Remove existing base marker
        if (this.baseMarker && this.map) {
            this.map.removeLayer(this.baseMarker);
        }
        
        // Enable map click for new location
        this.map.on('click', this.handleMapClickForRelocation.bind(this));
        
        // Show instruction
        alert('Click on the map to select a new location for your base.');
    }

    // Handle map click for base relocation
    handleMapClickForRelocation(e) {
        const { lat, lng } = e.latlng;
        
        console.log('🏗️ New base location selected:', lat, lng);
        
        // Remove click listener
        this.map.off('click', this.handleMapClickForRelocation);
        
        // Update base data
        this.baseData.lat = lat;
        this.baseData.lng = lng;
        this.baseData.timestamp = Date.now();
        
        // Save to localStorage
        localStorage.setItem('playerBase', JSON.stringify(this.baseData));
        
        // Create new base marker
        this.createBaseMarker();
        
        // Show success message
        alert('Base relocated successfully!');
    }

    // Create new base
    createNewBase(position) {
        console.log('🏗️ Creating new base at:', position);
        
        const baseData = {
            lat: position.lat,
            lng: position.lng,
            timestamp: Date.now(),
            level: 1
        };
        
        // Save to localStorage
        localStorage.setItem('playerBase', JSON.stringify(baseData));
        
        // Update local data
        this.baseData = baseData;
        
        // Create marker
        this.createBaseMarker();
        
        console.log('🏗️ New base created and saved');
    }
    
    // Relocate base to new position
    relocateBase() {
        console.log('📍 Relocating base...');
        
        if (!this.baseData) {
            console.warn('⚠️ No base to relocate');
            alert('You need to have a base first before relocating it.');
            return;
        }
        
        // Check step requirements for relocation
        const stepSystem = window.stepCurrencySystem;
        if (stepSystem && stepSystem.totalSteps < 500) {
            console.warn('⚠️ Insufficient steps for base relocation');
            alert(`Insufficient steps! You need 500 steps to relocate your base.\n\nCurrent steps: ${stepSystem.totalSteps}\nRequired: 500`);
            return;
        }
        
        // Show instructions for relocation
        alert('📍 Base Relocation\n\nRight-click on the map where you want to relocate your base, then select "Create Base Marker" from the context menu.\n\nThis will move your cosmic base to that new location.');
        
        // Focus on map
        if (window.mapLayer && window.mapLayer.map) {
            window.mapLayer.map.invalidateSize();
        }
    }
    
    // Purchase shop item
    purchaseShopItem(itemId) {
        console.log('🛒 Purchasing shop item:', itemId);
        
        if (!this.baseData) {
            console.warn('⚠️ No base to purchase items for');
            alert('You need to have a base first before purchasing items.');
            return;
        }
        
        // Define shop items
        const shopItems = {
            'energy-core': {
                name: 'Energy Core',
                cost: 500,
                description: 'Increases base energy production by 25%',
                effect: { energyMultiplier: 1.25 }
            },
            'shield-generator': {
                name: 'Shield Generator',
                cost: 750,
                description: 'Provides base defense against cosmic threats',
                effect: { defenseBonus: 15 }
            },
            'crystal-matrix': {
                name: 'Crystal Matrix',
                cost: 1000,
                description: 'Advanced cosmic technology for base enhancement',
                effect: { techLevel: 2 }
            },
            'void-portal': {
                name: 'Void Portal',
                cost: 1500,
                description: 'Interdimensional travel capabilities (coming soon)',
                effect: { voidAccess: true }
            }
        };
        
        const item = shopItems[itemId];
        if (!item) {
            console.error('❌ Unknown shop item:', itemId);
            return;
        }
        
        // Check step requirements
        const stepSystem = window.stepCurrencySystem;
        if (stepSystem && stepSystem.totalSteps < item.cost) {
            console.warn('⚠️ Insufficient steps for purchase');
            alert(`Insufficient steps! You need ${item.cost} steps to purchase ${item.name}.\n\nCurrent steps: ${stepSystem.totalSteps}\nRequired: ${item.cost}`);
            return;
        }
        
        // Deduct steps
        if (stepSystem) {
            stepSystem.totalSteps -= item.cost;
            stepSystem.saveSteps();
            stepSystem.updateStepCounter();
            console.log(`🛒 Deducted ${item.cost} steps for ${item.name}`);
        }
        
        // Add item to base data
        if (!this.baseData.purchasedItems) {
            this.baseData.purchasedItems = [];
        }
        
        this.baseData.purchasedItems.push({
            id: itemId,
            name: item.name,
            purchasedAt: new Date().toISOString(),
            effect: item.effect
        });
        
        // Save updated base data
        localStorage.setItem('playerBase', JSON.stringify(this.baseData));
        console.log(`🛒 Purchased ${item.name} and saved to base data`);
        
        // Show success message
        alert(`🛒 Purchase Successful!\n\nYou have purchased ${item.name}!\n\n${item.description}\n\nYour base has been enhanced with cosmic technology.`);
        
        // Refresh the UI to show updated base
        if (window.eldritchApp && window.eldritchApp.layerManager) {
            const threejsUI = window.eldritchApp.layerManager.getLayer('threejs-ui');
            if (threejsUI && threejsUI.enhancedUI) {
                threejsUI.enhancedUI.refreshCurrentTab();
            }
        }
    }
}

// Make it globally available as an instance
window.SimpleBaseInit = new SimpleBaseInit();

// Initialize the instance
window.SimpleBaseInit.init();

// Expose global functions for UI buttons
window.establishBaseAtCurrentLocation = () => {
    console.log('🔍 Global establishBaseAtCurrentLocation called');
    console.log('🔍 window.SimpleBaseInit exists:', !!window.SimpleBaseInit);
    if (window.SimpleBaseInit) {
        window.SimpleBaseInit.establishBaseAtCurrentLocation();
    } else {
        console.error('❌ SimpleBaseInit not available');
    }
};

window.showBaseLocationSelector = () => {
    if (window.SimpleBaseInit) {
        window.SimpleBaseInit.showBaseLocationSelector();
    }
};

window.relocateBase = () => {
    if (window.SimpleBaseInit) {
        window.SimpleBaseInit.relocateBase();
    }
};

window.purchaseShopItem = (itemId) => {
    if (window.SimpleBaseInit) {
        window.SimpleBaseInit.purchaseShopItem(itemId);
    }
};

// Debug function to manually refresh base tab
window.refreshBaseTab = () => {
    console.log('🔄 Manual base tab refresh requested');
    if (window.eldritchApp && window.eldritchApp.layerManager) {
        const threejsUI = window.eldritchApp.layerManager.getLayer('threejs-ui');
        if (threejsUI) {
            if (threejsUI.forceRefreshBaseTab) {
                threejsUI.forceRefreshBaseTab();
                console.log('🔄 Base tab refreshed manually');
            } else {
                console.warn('⚠️ forceRefreshBaseTab method not available');
            }
        } else {
            console.warn('⚠️ Three.js UI not available');
        }
    } else {
        console.warn('⚠️ EldritchApp not available');
    }
};

// Toggle player trails
window.togglePlayerTrails = () => {
    if (window.websocketClient) {
        if (window.websocketClient.trailLayer && window.websocketClient.trailLayer.getLayers().length > 0) {
            window.websocketClient.hidePlayerTrails();
        } else {
            window.websocketClient.showPlayerTrails();
        }
    }
};

// Show other bases (refresh markers)
window.showOtherBases = () => {
    console.log('🏗️ Refreshing other players bases...');
    if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
        // Request fresh marker data from server
        window.websocketClient.requestMarkerData();
    }
};

// Debug function to clear all base data
window.clearAllBaseData = () => {
    console.log('🧹 Clearing all base data...');
    const keys = ['playerBase', 'base_bases', 'eldritch-player-base'];
    keys.forEach(key => {
        localStorage.removeItem(key);
        console.log('🧹 Cleared', key);
    });
    
    // Clear from SimpleBaseInit
    if (window.SimpleBaseInit) {
        window.SimpleBaseInit.baseData = null;
        if (window.SimpleBaseInit.baseMarker) {
            window.SimpleBaseInit.baseMarker.remove();
            window.SimpleBaseInit.baseMarker = null;
        }
    }
    
    // Refresh the base tab
    window.refreshBaseTab();
    console.log('🧹 All base data cleared');
};
