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

    // Get base data from localStorage
    getBaseData() {
        try {
            // Try different localStorage keys
            const keys = ['playerBase', 'base_bases', 'eldritch-player-base'];
            
            for (const key of keys) {
                const data = localStorage.getItem(key);
                if (data) {
                    const parsed = JSON.parse(data);
                    
                    // Handle array format
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed[0];
                    }
                    
                    // Handle object format
                    if (parsed && typeof parsed === 'object') {
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

    // Create SVG-based base marker
    createSVGBaseMarker(lat, lng) {
        const svgGraphics = new window.SVGBaseGraphics();
        
        // Get base configuration from localStorage
        const baseLogoType = localStorage.getItem('eldritch_player_base_logo') || 'finnish';
        const baseColor = localStorage.getItem('eldritch_player_color') || '#8b5cf6';
        
        // Configure base appearance
        const baseConfig = {
            flagType: baseLogoType,
            colors: {
                primary: baseColor,
                secondary: '#3b82f6',
                accent: '#f59e0b',
                territory: `${baseColor}30`, // Semi-transparent
                flag: '#ffffff'
            }
        };
        
        // Create Leaflet icon using SVG graphics
        const baseIcon = L.divIcon(svgGraphics.createLeafletBaseIcon(baseConfig));
        
        // Create marker
        this.baseMarker = L.marker([lat, lng], { icon: baseIcon }).addTo(this.map);
        this.baseMarker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h3 style="margin: 0 0 10px 0; color: #8b5cf6;">🏗️ My Cosmic Base</h3>
                <p style="margin: 0 0 5px 0;">Level: ${this.baseData.level || 1}</p>
                <p style="margin: 0 0 10px 0;">Territory: ${this.baseData.territorySize || 'Small'}</p>
                <button onclick="window.SimpleBaseInit?.openBaseMenu?.()" 
                        style="background: #8b5cf6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                    Manage Base
                </button>
            </div>
        `);
        
        // Add click handler for base menu
        this.baseMarker.on('click', () => {
            this.openBaseMenu();
        });
        
        console.log('🎨 SVG base marker created successfully');
        
        // Center map on base
        this.map.setView([lat, lng], 18);
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
        
        // Fallback: Show simple base info
        this.showBaseInfo();
    }

    // Show simple base info (fallback)
    showBaseInfo() {
        const baseInfo = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: linear-gradient(135deg, #1a1a2e, #16213e);
                border: 2px solid #8b5cf6;
                border-radius: 16px;
                padding: 24px;
                max-width: 400px;
                width: 90%;
                z-index: 10000;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            ">
                <h2 style="color: #8b5cf6; margin-bottom: 16px; text-align: center;">
                    🏗️ Base Management
                </h2>
                <div style="color: #e0e0e0; margin-bottom: 20px;">
                    <p><strong>Level:</strong> ${this.baseData.level || 1}</p>
                    <p><strong>Location:</strong> ${this.baseData.lat?.toFixed(4)}, ${this.baseData.lng?.toFixed(4)}</p>
                    <p><strong>Established:</strong> ${new Date(this.baseData.timestamp).toLocaleDateString()}</p>
                </div>
                <div style="text-align: center;">
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: #8b5cf6; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; margin-right: 10px;">
                        Close
                    </button>
                    <button onclick="window.SimpleBaseInit?.relocateBase?.()" 
                            style="background: #f59e0b; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                        Relocate Base
                    </button>
                </div>
            </div>
        `;
        
        // Remove any existing base info
        const existing = document.getElementById('base-info-modal');
        if (existing) existing.remove();
        
        // Add new base info
        const modal = document.createElement('div');
        modal.id = 'base-info-modal';
        modal.innerHTML = baseInfo;
        document.body.appendChild(modal);
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
}

// Make it globally available
window.SimpleBaseInit = SimpleBaseInit;
