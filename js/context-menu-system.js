/**
 * Context Menu System - Right-click context menu for base creation
 * Integrates with existing base systems for seamless base establishment
 */

class ContextMenuSystem {
    constructor() {
        this.contextMenu = null;
        this.isVisible = false;
        this.currentPosition = null;
        this.init();
    }

    init() {
        console.log('🎯 ContextMenuSystem initialized');
        this.createContextMenu();
        this.setupEventListeners();
    }

    createContextMenu() {
        // Create context menu element
        this.contextMenu = document.createElement('div');
        this.contextMenu.id = 'base-context-menu';
        this.contextMenu.style.cssText = `
            position: fixed;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #4a9eff;
            border-radius: 10px;
            padding: 10px 0;
            min-width: 200px;
            box-shadow: 0 10px 30px rgba(74, 158, 255, 0.3);
            z-index: 10000;
            display: none;
            font-family: 'Arial', sans-serif;
            backdrop-filter: blur(10px);
        `;

        // Create menu items
        const menuItems = [
            {
                id: 'establish-base',
                text: '🏗️ Establish Base',
                description: 'Create a new base at this location',
                action: () => this.establishBase()
            },
            {
                id: 'force-base-marker',
                text: '🎯 Force Base Marker',
                description: 'Force create a base marker on map',
                action: () => this.forceCreateBaseMarker()
            },
            {
                id: 'create-quest',
                text: '🎭 Create Quest Marker',
                description: 'Create a quest marker at this location',
                action: () => this.createMapObject('QUEST')
            },
            {
                id: 'create-npc',
                text: '👑 Create NPC Marker',
                description: 'Create an NPC marker at this location',
                action: () => this.createMapObject('NPC')
            },
            {
                id: 'create-monster',
                text: '👹 Create Monster Marker',
                description: 'Create a monster marker at this location',
                action: () => this.createMapObject('MONSTER')
            },
            {
                id: 'create-poi',
                text: '📍 Create POI Marker',
                description: 'Create a point of interest marker',
                action: () => this.createMapObject('POI')
            },
            {
                id: 'create-test',
                text: '🧪 Create Test Marker',
                description: 'Create a test marker for debugging',
                action: () => this.createMapObject('TEST')
            },
            {
                id: 'check-location',
                text: '📍 Check Location',
                description: 'View coordinates and area info',
                action: () => this.checkLocation()
            },
            {
                id: 'close-menu',
                text: '❌ Close',
                description: 'Close this menu',
                action: () => this.hideContextMenu()
            }
        ];

        menuItems.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = 'context-menu-item';
            menuItem.style.cssText = `
                padding: 8px 16px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid rgba(74, 158, 255, 0.2);
                display: flex;
                flex-direction: column;
                gap: 2px;
                min-height: 32px;
            `;
            
            menuItem.innerHTML = `
                <div style="font-weight: bold; font-size: 13px;">${item.text}</div>
                <div style="font-size: 11px; color: #a0a0a0;">${item.description}</div>
            `;

            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                item.action();
            });

            menuItem.addEventListener('mouseenter', () => {
                menuItem.style.background = 'rgba(74, 158, 255, 0.2)';
            });

            menuItem.addEventListener('mouseleave', () => {
                menuItem.style.background = 'transparent';
            });

            this.contextMenu.appendChild(menuItem);
        });

        // Remove border from last item
        const lastItem = this.contextMenu.lastElementChild;
        if (lastItem) {
            lastItem.style.borderBottom = 'none';
        }

        document.body.appendChild(this.contextMenu);
    }

    setupEventListeners() {
        // Right-click on map
        document.addEventListener('contextmenu', (e) => {
            // Check if we're clicking on the map (not on UI elements)
            if (this.isMapClick(e)) {
                e.preventDefault();
                this.showContextMenu(e.clientX, e.clientY);
            }
        });

        // Click outside to close
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideContextMenu();
            }
        });
    }

    isMapClick(e) {
        // Check if the click is on the map container or map tiles
        const target = e.target;
        const mapContainer = document.getElementById('map') || document.querySelector('.leaflet-container');
        
        if (!mapContainer) return false;
        
        // Check if click is within map bounds
        const rect = mapContainer.getBoundingClientRect();
        return (
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom
        );
    }

    showContextMenu(x, y) {
        if (this.isVisible) {
            this.hideContextMenu();
            return;
        }

        // Get map coordinates from click position
        this.currentPosition = this.getMapCoordinates(x, y);
        
        // Position the context menu
        this.contextMenu.style.left = x + 'px';
        this.contextMenu.style.top = y + 'px';
        this.contextMenu.style.display = 'block';
        this.isVisible = true;

        // Add animation
        this.contextMenu.style.opacity = '0';
        this.contextMenu.style.transform = 'scale(0.8)';
        
        requestAnimationFrame(() => {
            this.contextMenu.style.transition = 'all 0.2s ease';
            this.contextMenu.style.opacity = '1';
            this.contextMenu.style.transform = 'scale(1)';
        });

        console.log('🎯 Context menu shown at:', this.currentPosition);
    }

    hideContextMenu() {
        if (!this.isVisible) return;

        this.contextMenu.style.transition = 'all 0.2s ease';
        this.contextMenu.style.opacity = '0';
        this.contextMenu.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            this.contextMenu.style.display = 'none';
            this.isVisible = false;
        }, 200);
    }

    getMapCoordinates(x, y) {
        // Get the map from the correct reference
        const map = window.mapLayer?.map || window.mapEngine?.map;
        
        if (map && typeof map.containerPointToLatLng === 'function') {
            try {
                // Get the map container's position and size
                const mapContainer = map.getContainer();
                const rect = mapContainer.getBoundingClientRect();
                
                // Convert screen coordinates to map container coordinates
                const containerX = x - rect.left;
                const containerY = y - rect.top;
                
                console.log('🎯 Converting coordinates:', {
                    screenX: x, screenY: y,
                    containerX: containerX, containerY: containerY,
                    mapRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
                });
                
                // Convert container point to lat/lng
                const point = L.point(containerX, containerY);
                const latLng = map.containerPointToLatLng(point);
                
                console.log('🎯 Converted to lat/lng:', latLng);
                return { lat: latLng.lat, lng: latLng.lng };
            } catch (error) {
                console.warn('⚠️ Error converting coordinates:', error);
            }
        }

        // Fallback: return approximate coordinates
        console.warn('⚠️ Using fallback coordinates - map not available');
        return { lat: 61.4981, lng: 23.7608 }; // Default to Tampere coordinates
    }

    establishBase() {
        console.log('🏗️ Establishing base via context menu...');
        
        if (!this.currentPosition) {
            console.error('❌ No position available for base establishment');
            return;
        }

        // Check if player has enough steps
        const stepSystem = window.stepCurrencySystem;
        if (!stepSystem || stepSystem.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            this.hideContextMenu();
            return;
        }

        // Try different base establishment methods
        this.tryEstablishBase(this.currentPosition);
        this.hideContextMenu();
    }

    tryEstablishBase(position) {
        console.log('🏗️ Attempting base establishment at:', position);

        // Method 1: Try BaseSystem
        if (window.baseSystem && typeof window.baseSystem.establishBaseWithNewSystem === 'function') {
            console.log('🏗️ Using BaseSystem.establishBaseWithNewSystem');
            try {
                window.baseSystem.establishBaseWithNewSystem();
                console.log('🏗️ Base established successfully!');
                return;
            } catch (error) {
                console.error('❌ BaseSystem method failed:', error);
            }
        }

        // Method 2: Try SimpleBaseInit
        if (window.SimpleBaseInit) {
            console.log('🏗️ Using SimpleBaseInit');
            try {
                const simpleBase = new window.SimpleBaseInit();
                simpleBase.createNewBase(position);
                console.log('🏗️ Base established successfully!');
                return;
            } catch (error) {
                console.error('❌ SimpleBaseInit method failed:', error);
            }
        }

        // Method 3: Try step currency system method
        if (window.stepCurrencySystem && typeof window.stepCurrencySystem.establishSimpleBase === 'function') {
            console.log('🏗️ Using StepCurrencySystem.establishSimpleBase');
            try {
                const success = window.stepCurrencySystem.establishSimpleBase(position);
                if (success) {
                    console.log('🏗️ Base established successfully!');
                } else {
                    console.error('❌ Failed to establish base');
                }
                return;
            } catch (error) {
                console.error('❌ StepCurrencySystem method failed:', error);
            }
        }

        // Method 4: Manual base creation
        console.log('🏗️ Using manual base creation');
        this.createBaseManually(position);
    }

    createBaseManually(position) {
        console.log('🏗️ Creating base manually at:', position);
        
        // Deduct steps
        if (window.stepCurrencySystem) {
            window.stepCurrencySystem.totalSteps -= 1000;
            window.stepCurrencySystem.saveSteps();
            window.stepCurrencySystem.updateStepCounter();
        }

        // Create base data
        const baseData = {
            lat: position.lat,
            lng: position.lng,
            name: 'My Cosmic Base',
            established_at: new Date().toISOString(),
            level: 1,
            id: 'base_' + Date.now()
        };

        // Save to localStorage
        localStorage.setItem('playerBase', JSON.stringify(baseData));

        // Create visual marker if map is available
        const map = window.mapEngine?.map || window.eldritchApp?.systems?.mapEngine?.map;
        if (map && typeof L === 'object') {
            const baseMarker = L.marker([position.lat, position.lng], {
                icon: L.divIcon({
                    className: 'base-marker',
                    html: '🏗️',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            }).addTo(map);

            baseMarker.bindPopup(`
                <div style="text-align: center;">
                    <h3>🏗️ My Cosmic Base</h3>
                    <p>Established: ${new Date().toLocaleDateString()}</p>
                    <p>Level: 1</p>
                </div>
            `);
        }

        console.log('🏗️ Base established successfully!');
        console.log('🏗️ Base created and saved:', baseData);
    }

    checkLocation() {
        if (!this.currentPosition) {
            console.warn('⚠️ No location data available');
            return;
        }

        const message = `
            📍 Location Information:
            Latitude: ${this.currentPosition.lat.toFixed(6)}
            Longitude: ${this.currentPosition.lng.toFixed(6)}
            
            Click "Establish Base" to create your base here!
        `;

        alert(message);
    }

    createMapObject(type) {
        if (!this.currentPosition) {
            console.log('❌ No position available for map object creation');
            this.hideContextMenu();
            return;
        }

        if (!window.mapObjectManager) {
            console.error('❌ Map Object Manager not available');
            this.hideContextMenu();
            return;
        }

        console.log(`🗺️ Creating ${type} marker at:`, this.currentPosition);
        
        try {
            const objectId = window.mapObjectManager.createObject(type, this.currentPosition);
            if (objectId) {
                console.log(`✅ ${type} marker created successfully with ID: ${objectId}`);
            } else {
                console.error(`❌ Failed to create ${type} marker`);
            }
        } catch (error) {
            console.error(`❌ Error creating ${type} marker:`, error);
        }
        
        this.hideContextMenu();
    }

    forceCreateBaseMarker() {
        console.log('🎯 Force creating base marker...');
        
        if (!this.currentPosition) {
            console.error('❌ No position available for base marker');
            this.hideContextMenu();
            return;
        }

        // Try multiple methods to create a base marker
        let success = false;

        // Method 1: Try using step currency system
        if (window.stepCurrencySystem && window.stepCurrencySystem.createBaseMarkerOnMap) {
            console.log('🎯 Using step currency system to create base marker');
            success = window.stepCurrencySystem.createBaseMarkerOnMap(this.currentPosition);
            if (success) {
                console.log('🎯 Base marker created successfully via step currency system');
                this.hideContextMenu();
                return;
            }
        }

        // Method 2: Use MapLayer's addBaseMarker method (most reliable)
        if (window.mapLayer && typeof window.mapLayer.addBaseMarker === 'function') {
            console.log('🎯 Creating base marker using MapLayer.addBaseMarker method');
            try {
                const marker = window.mapLayer.addBaseMarker(this.currentPosition);
                if (marker) {
                    console.log('🎯 Base marker created successfully using MapLayer.addBaseMarker!');
                    success = true;
                } else {
                    console.error('🎯 MapLayer.addBaseMarker returned null');
                }
            } catch (error) {
                console.error('🎯 Error creating base marker using MapLayer.addBaseMarker:', error);
            }
        }
        
        // Method 3: Use SAME approach as player marker (fallback)
        if (!success && window.mapEngine && window.mapEngine.map && typeof L === 'object') {
            console.log('🎯 Creating base marker using SAME method as player marker (fallback)');
            try {
                // Create base marker icon similar to player marker
                const baseIcon = L.divIcon({
                    className: 'base-marker multilayered',
                    html: `
                        <div style="position: relative; width: 40px; height: 40px;">
                            <!-- Base aura -->
                            <div style="position: absolute; top: -5px; left: -5px; width: 50px; height: 50px; background: radial-gradient(circle, #ff000040 0%, transparent 70%); border-radius: 50%; animation: basePulse 2s infinite;"></div>
                            <!-- Base body -->
                            <div style="position: absolute; top: 2px; left: 2px; width: 36px; height: 36px; background: #ff0000; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px #ff000080;"></div>
                            <!-- Base emoji -->
                            <div style="position: absolute; top: 5px; left: 5px; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">🏗️</div>
                        </div>
                    `,
                    iconSize: [40, 40],
                    iconAnchor: [20, 20]
                });
                
                const baseMarker = L.marker([this.currentPosition.lat, this.currentPosition.lng], { 
                    icon: baseIcon,
                    zIndexOffset: 2000
                }).addTo(window.mapEngine.map);
                
                baseMarker.bindPopup(`
                    <div style="text-align: center;">
                        <h3>🏗️ My Cosmic Base</h3>
                        <p>Established: ${new Date().toLocaleDateString()}</p>
                        <p>Level: 1</p>
                        <p>Force Created</p>
                    </div>
                `);
                
                // Ensure marker is visible (same as player marker)
                baseMarker.setOpacity(1);
                baseMarker.setZIndexOffset(2000);
                
                console.log('🎯 Base marker created using SAME method as player!');
                console.log('🎯 Position:', this.currentPosition);
                console.log('🎯 Map center:', window.mapEngine.map.getCenter());
                console.log('🎯 Map zoom:', window.mapEngine.map.getZoom());
                
                // Center map on marker
                window.mapEngine.map.setView([this.currentPosition.lat, this.currentPosition.lng], 18);
                
                success = true;
            } catch (error) {
                console.error('🎯 Error creating base marker:', error);
            }
        }

        // Method 3: Try using layer manager
        if (!success && window.eldritchApp && window.eldritchApp.layerManager) {
            const mapLayer = window.eldritchApp.layerManager.layers.get('map');
            if (mapLayer && mapLayer.addMarker) {
                console.log('🎯 Creating base marker using MapLayer');
                try {
                    const baseIcon = L.divIcon({
                        className: 'base-marker',
                        html: '🏗️',
                        iconSize: [30, 30],
                        iconAnchor: [15, 15]
                    });
                    
                    const marker = mapLayer.addMarker('force-base-marker', {
                        position: this.currentPosition,
                        icon: baseIcon,
                        popup: `
                            <div style="text-align: center;">
                                <h3>🏗️ My Cosmic Base</h3>
                                <p>Established: ${new Date().toLocaleDateString()}</p>
                                <p>Level: 1</p>
                                <p>Force Created</p>
                            </div>
                        `
                    });
                    
                    if (marker) {
                        console.log('🎯 Base marker created successfully using MapLayer');
                        success = true;
                    }
                } catch (error) {
                    console.error('🎯 Error creating base marker with MapLayer:', error);
                }
            }
        }

        if (success) {
            console.log('🎯 Base marker force creation successful!');
        } else {
            console.error('❌ Failed to create base marker with any method');
        }

        this.hideContextMenu();
    }

    // Simple test function
    testMapReferences() {
        console.log('🔍 Testing map references from context menu...');
        console.log('window.mapEngine:', window.mapEngine);
        console.log('window.mapEngine.map:', window.mapEngine?.map);
        console.log('Player marker:', window.mapEngine?.playerMarker);
        
        // Check if legacy app exists
        console.log('window.eldritchApp:', window.eldritchApp);
        console.log('Legacy app systems:', window.eldritchApp?.systems);
        console.log('Legacy app mapEngine:', window.eldritchApp?.systems?.mapEngine);
        
        // Check if there are any global app instances
        console.log('Global app variable:', typeof app !== 'undefined' ? app : 'undefined');
        
        if (window.mapEngine && window.mapEngine.playerMarker) {
            console.log('Player marker map:', window.mapEngine.playerMarker._map);
            console.log('Player marker position:', window.mapEngine.playerMarker.getLatLng());
        }
        
        return 'test complete';
    }
    
    // Test creating a marker
    testCreateMarker() {
        console.log('🧪 Testing marker creation from context menu...');
        
        // Try different map sources
        let map = null;
        
        if (window.mapEngine && window.mapEngine.map) {
            map = window.mapEngine.map;
            console.log('Using window.mapEngine.map');
        } else if (window.eldritchApp && window.eldritchApp.systems && window.eldritchApp.systems.mapEngine && window.eldritchApp.systems.mapEngine.map) {
            map = window.eldritchApp.systems.mapEngine.map;
            console.log('Using eldritchApp.systems.mapEngine.map');
        } else {
            console.error('❌ No map found in any location');
            return false;
        }
        
        try {
            const testPosition = { lat: 61.4981, lng: 23.7608 };
            
            const marker = L.marker([testPosition.lat, testPosition.lng]).addTo(map);
            marker.bindPopup('🧪 TEST MARKER FROM CONTEXT MENU');
            
            console.log('✅ Test marker created successfully!');
            console.log('Marker position:', marker.getLatLng());
            console.log('Marker map:', marker._map);
            
            return marker;
        } catch (error) {
            console.error('❌ Error creating test marker:', error);
            return false;
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'linear-gradient(45deg, #4CAF50, #45a049)' : 
                        type === 'error' ? 'linear-gradient(45deg, #f44336, #d32f2f)' : 
                        'linear-gradient(45deg, #2196F3, #1976D2)'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-weight: bold;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);

        // Add CSS animations
        if (!document.getElementById('context-menu-styles')) {
            const style = document.createElement('style');
            style.id = 'context-menu-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize context menu system when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contextMenuSystem = new ContextMenuSystem();
    });
} else {
    window.contextMenuSystem = new ContextMenuSystem();
}

console.log('🎯 Context Menu System loaded');
