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

            console.log('🏗️ Creating base marker at:', lat, lng);

            // Create simple base marker
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

            console.log('🏗️ Base marker created successfully');
            
            // Center map on base
            this.map.setView([lat, lng], 18);
            
        } catch (error) {
            console.error('🏗️ Error creating base marker:', error);
        }
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
