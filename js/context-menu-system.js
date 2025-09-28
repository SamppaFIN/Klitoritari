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
            overflow: visible;
            max-height: 80vh;
        `;

        // Create menu items
        const menuItems = [
            {
                id: 'move-here',
                text: '🚀 Move Here',
                description: 'Teleport player to this location',
                action: () => this.movePlayerHere()
            },
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
                min-height: 40px;
                position: relative;
                z-index: 1;
                align-items: flex-start;
                justify-content: center;
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

    getPlayerCurrentPosition() {
        console.log('🎯 Getting player current position for base establishment...');
        
        // Try to get player position from MapLayer first
        if (window.mapLayer && typeof window.mapLayer.getCurrentPlayerPosition === 'function') {
            const playerPos = window.mapLayer.getCurrentPlayerPosition();
            console.log('🎯 Player position from MapLayer:', playerPos);
            return playerPos;
        }
        
        // Fallback: try mapEngine
        if (window.mapEngine && typeof window.mapEngine.getCurrentPlayerPosition === 'function') {
            const playerPos = window.mapEngine.getCurrentPlayerPosition();
            console.log('🎯 Player position from mapEngine:', playerPos);
            return playerPos;
        }
        
        // Fallback: try to get from player marker directly
        if (window.mapLayer && window.mapLayer.markers) {
            const playerMarker = window.mapLayer.markers.get('player');
            if (playerMarker) {
                const latlng = playerMarker.getLatLng();
                const playerPos = { lat: latlng.lat, lng: latlng.lng };
                console.log('🎯 Player position from marker:', playerPos);
                return playerPos;
            }
        }
        
        // Last resort: use current map center
        console.warn('⚠️ Could not get player position, using map center as fallback');
        return this.getMapCoordinates(window.innerWidth / 2, window.innerHeight / 2);
    }

    establishBase() {
        console.log('🏗️ Establishing base via context menu...');
        
        // Get player's current position instead of right-click position
        const playerPosition = this.getPlayerCurrentPosition();
        if (!playerPosition) {
            console.error('❌ No player position available for base establishment');
            this.hideContextMenu();
            return;
        }

        console.log('🏗️ Using player position for base establishment:', playerPosition);

        // Check if player has enough steps
        const stepSystem = window.stepCurrencySystem;
        if (!stepSystem || stepSystem.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            this.hideContextMenu();
            return;
        }

        // Send base establishment command to server using player position
        this.sendBaseEstablishToServer(playerPosition);
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

    movePlayerHere() {
        console.log('🚀 Moving player to:', this.currentPosition);
        
        if (!this.currentPosition) {
            console.error('❌ No position available for player movement');
            this.hideContextMenu();
            return;
        }

        // Use MapLayer's teleportPlayer method if available
        if (window.mapLayer && typeof window.mapLayer.teleportPlayer === 'function') {
            window.mapLayer.teleportPlayer(this.currentPosition);
            console.log('🚀 Player teleported successfully');
        } else {
            console.error('❌ MapLayer teleportPlayer method not available');
        }
        
        this.hideContextMenu();
    }

    forceCreateBaseMarker() {
        console.log('🎯 Force creating base marker...');
        
        // Get player's current position instead of right-click position
        const playerPosition = this.getPlayerCurrentPosition();
        if (!playerPosition) {
            console.error('❌ No player position available for base marker');
            this.hideContextMenu();
            return;
        }

        console.log('🎯 Using player position for force base marker:', playerPosition);

        // Send base establishment command to server (same as establishBase but without step check)
        this.sendBaseEstablishToServer(playerPosition);
    }

    sendBaseEstablishToServer(position) {
        console.log('🏗️ Sending base establishment command to server:', position);
        
        // Check if WebSocket client is available
        if (window.websocketClient && typeof window.websocketClient.establishBase === 'function') {
            window.websocketClient.establishBase(position);
            console.log('🏗️ Base establishment command sent to server');
        } else {
            console.error('❌ WebSocket client not available for base establishment');
            // Fallback to local creation if server is not available
            this.createMapObject('BASE');
        }
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
