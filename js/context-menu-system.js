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
            padding: 0;
            min-width: 220px;
            box-shadow: 0 10px 30px rgba(74, 158, 255, 0.3);
            z-index: 10000;
            display: none;
            font-family: 'Arial', sans-serif;
            backdrop-filter: blur(10px);
            overflow: hidden;
            max-height: 80vh;
            box-sizing: border-box;
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
                text: '🎯 Force Base at Player',
                description: 'Create base marker at player marker location',
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
                padding: 12px 16px;
                color: #ffffff;
                cursor: pointer;
                transition: all 0.2s ease;
                border-bottom: 1px solid rgba(74, 158, 255, 0.2);
                display: flex;
                flex-direction: column;
                gap: 4px;
                min-height: 48px;
                position: relative;
                z-index: 1;
                align-items: flex-start;
                justify-content: center;
                box-sizing: border-box;
                width: 100%;
                overflow: hidden;
                white-space: nowrap;
            `;
            
            menuItem.innerHTML = `
                <div style="font-weight: bold; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.text}</div>
                <div style="font-size: 11px; color: #a0a0a0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.description}</div>
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
        
        // Use SAME position as POI marker (right-click position)
        if (!this.currentPosition) {
            console.error('❌ No position available for base establishment');
            this.hideContextMenu();
            return;
        }

        console.log('🏗️ Using RIGHT-CLICK position for base establishment (same as POI):', this.currentPosition);

        // Check if player has enough steps
        const stepSystem = window.stepCurrencySystem;
        if (!stepSystem || stepSystem.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base!');
            this.hideContextMenu();
            return;
        }

        // Create base marker using SAME position as POI marker
        this.createBaseMarker(this.currentPosition);
        
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

        console.log(`🗺️ Creating ${type} marker at right-click position:`, this.currentPosition);
        
        // Handle different marker types with lightweight approach
        if (type === 'POI') {
            this.createPOIMarker(this.currentPosition);
        } else if (type === 'BASE') {
            this.createBaseMarker(this.currentPosition);
        } else if (type === 'NPC') {
            this.createNPCMarker(this.currentPosition);
        } else if (type === 'MONSTER') {
            this.createMonsterMarker(this.currentPosition);
        } else {
            // For other types, use MapObjectManager if available
            if (!window.mapObjectManager) {
                console.error('❌ Map Object Manager not available');
                this.hideContextMenu();
                return;
            }
            
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
        }
        
        this.hideContextMenu();
    }

    createPOIMarker(position) {
        console.log('📍 Creating POI marker at:', position);
        
        // Create visual marker on map first
        if (window.mapLayer && window.mapLayer.map) {
            const poiIcon = L.divIcon({
                className: 'poi-marker',
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #ff6b35; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">❓</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([position.lat, position.lng], { 
                icon: poiIcon,
                zIndexOffset: 700
            }).addTo(window.mapLayer.map);

            // Add popup
            marker.bindPopup(`
                <b>Point of Interest</b><br>
                <small>❓ Mystery Location</small><br>
                <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
            `);

            console.log('📍 POI marker created visually on map');
        }

        // Send POI marker to server for persistence
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('📍 Sending POI marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'poi',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    symbol: '❓',
                    markerId: `poi_${Date.now()}`,
                    name: 'Mystery Location',
                    description: 'A mysterious point of interest discovered by the player'
                }
            });
            console.log('📍 POI marker sent to server successfully');
        } else {
            console.log('📍 WebSocket not connected, POI marker not persisted to server');
        }
    }

    /**
     * BRDC: Create lightweight base marker using direct Leaflet approach
     * 
     * This method implements the "Sacred Pattern" for marker creation:
     * 1. Direct Leaflet creation (L.marker().addTo())
     * 2. Consistent positioning (right-click coordinates)
     * 3. CSS isolation (unique class name)
     * 4. Server integration (persistence)
     * 
     * Resolves: #bug-base-marker-visibility
     * Implements: #feature-base-building
     * Uses: #feature-marker-system
     * 
     * @param {Object} position - {lat: number, lng: number} coordinates
     */
    /**
     * BRDC: Get current player ID for base ownership
     * 
     * Retrieves or generates a unique player ID for base ownership detection.
     * Implements the "Sacred Pattern" for player identification.
     * 
     * Implements: #feature-player-identification
     * Uses: #feature-persistence-system
     * 
     * @returns {string} - Current player ID
     */
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

    createBaseMarker(position) {
        console.log('🏗️ Creating SVG base marker at:', position);
        console.log('🔍 Debug - window.mapLayer:', !!window.mapLayer);
        console.log('🔍 Debug - window.mapLayer.map:', !!(window.mapLayer && window.mapLayer.map));
        console.log('🔍 Debug - window.SVGBaseGraphics:', !!window.SVGBaseGraphics);
        
        // Check if player already has a base (1 base maximum rule)
        if (window.SimpleBaseInit && window.SimpleBaseInit.baseData && window.SimpleBaseInit.baseData.established) {
            console.warn('⚠️ Player already has a base! Only 1 base allowed.');
            alert('You can only have one base at a time! Please remove your existing base first.');
            return;
        }
        
        // Create SVG base marker using the graphics system
        if (window.mapLayer && window.mapLayer.map && window.SVGBaseGraphics) {
            const baseConfig = {
                size: 120,
                colors: {
                    primary: '#8b5cf6',
                    secondary: '#3b82f6',
                    accent: '#fbbf24',
                    energy: '#ffffff',
                    territory: '#8b5cf6'
                },
                animations: {
                    territoryPulse: true,
                    energyGlow: true,
                    flagWave: true,
                    particleEffects: true
                }
            };
            
            const marker = new window.SVGBaseGraphics().createAnimatedBaseMarker(
                position,
                baseConfig,
                'finnish', // Use Finnish flag
                window.mapLayer.map,
                'own' // This is always the player's own base
            );
            
            // Add to map
            marker.addTo(window.mapLayer.map);

            // Add simple stats popup
            const popupContent = `
                <div style="text-align: center; padding: 15px; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; color: #8b5cf6; font-size: 18px;">
                        🏗️ My Cosmic Base
                    </h3>
                    <div style="margin: 10px 0; padding: 8px; background: rgba(139, 92, 246, 0.1); border-radius: 8px;">
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Level: <strong>1</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Territory: <strong>Small</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Flag: <strong>Finnish</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Location: <strong>${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}</strong></p>
                        <p style="margin: 0 0 5px 0; color: #e5e7eb;">Owner: <strong>You</strong></p>
                        <p style="margin: 0; color: #e5e7eb;">Steps: <strong>${window.stepCurrencySystem?.totalSteps || 0}</strong></p>
                    </div>
                    <button id="manage-base-btn-${Date.now()}" 
                            style="background: linear-gradient(135deg, #8b5cf6, #3b82f6); 
                                   color: white; border: none; padding: 10px 20px; 
                                   border-radius: 8px; cursor: pointer; font-weight: bold;
                                   box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
                                   transition: all 0.3s ease;">
                        Manage Base
                    </button>
                </div>
            `;
            
            marker.bindPopup(popupContent);
            
            // Add click handler for base menu - both marker click and popup button
            marker.on('click', () => {
                console.log('🎨 SVG base marker clicked - opening management menu');
                if (window.SimpleBaseInit && window.SimpleBaseInit.openBaseMenu) {
                    window.SimpleBaseInit.openBaseMenu();
                }
            });
            
            // Add popup open handler to attach button event listener
            marker.on('popupopen', () => {
                setTimeout(() => {
                    // Find the manage base button by looking for the button with the specific style
                    const buttons = document.querySelectorAll('button');
                    const manageBtn = Array.from(buttons).find(btn => 
                        btn.textContent.includes('Manage Base') && 
                        btn.style.background.includes('linear-gradient')
                    );
                    
                    if (manageBtn) {
                        console.log('🎨 Found Manage Base button, adding event listener');
                        manageBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            console.log('🎨 Manage Base button clicked');
                            if (window.SimpleBaseInit && window.SimpleBaseInit.openBaseMenu) {
                                window.SimpleBaseInit.openBaseMenu();
                            }
                        });
                    } else {
                        console.warn('⚠️ Manage Base button not found');
                    }
                }, 100);
            });

            console.log('🏗️ SVG base marker created successfully with animations');
        } else {
            console.warn('⚠️ SVG graphics not available, falling back to lightweight marker');
            
            // Fallback to lightweight marker
            if (window.mapLayer && window.mapLayer.map) {
                const baseIcon = L.divIcon({
                    className: 'base-marker-lightweight',
                    html: `
                        <div style="
                            width: 30px; 
                            height: 30px; 
                            background: #8b5cf6; 
                            border: 3px solid #ffffff; 
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            font-size: 16px;
                            color: white;
                            text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                            box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                        ">🏗️</div>
                    `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                const marker = L.marker([position.lat, position.lng], { 
                    icon: baseIcon,
                    zIndexOffset: 600
                }).addTo(window.mapLayer.map);

                marker.bindPopup(`
                    <b>Base Marker</b><br>
                    <small>🏗️ My Cosmic Base</small><br>
                    <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
                `);

                console.log('🏗️ Lightweight base marker created as fallback');
            }
        }

        // Deduct steps for base establishment
        const stepSystem = window.stepCurrencySystem;
        if (stepSystem) {
            stepSystem.totalSteps -= 1000;
            stepSystem.saveSteps();
            stepSystem.updateStepCounter();
            console.log('🏗️ Deducted 1000 steps for base establishment');
        }

        // Send base marker to server for persistence (same as POI)
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('🏗️ Sending base marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'base',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    level: 1,
                    established: true,
                    name: 'My Cosmic Base',
                    symbol: '🏗️',
                    markerId: `base_${Date.now()}`,
                    isOwnBase: true,
                    owner: 'You',
                    territorySize: 'Small',
                    playerId: this.getCurrentPlayerId()
                }
            });
            console.log('🏗️ Base marker sent to server successfully');
        } else {
            console.log('🏗️ WebSocket not connected, base marker not persisted to server');
        }
    }

    /**
     * BRDC: Create lightweight NPC marker using direct Leaflet approach
     * 
     * Implements the "Sacred Pattern" for marker creation:
     * - Direct Leaflet creation for reliability
     * - Consistent positioning system
     * - CSS isolation to prevent conflicts
     * - Server integration for persistence
     * 
     * Implements: #enhancement-npc-markers
     * Uses: #feature-marker-system
     * 
     * @param {Object} position - {lat: number, lng: number} coordinates
     */
    createNPCMarker(position) {
        console.log('👤 Creating LIGHTWEIGHT NPC marker at:', position);
        
        // Create visual marker on map first (EXACTLY like POI marker)
        if (window.mapLayer && window.mapLayer.map) {
            const npcIcon = L.divIcon({
                className: 'npc-marker-lightweight', // Different class name to avoid CSS conflicts
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #3b82f6; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">👤</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([position.lat, position.lng], { 
                icon: npcIcon,
                zIndexOffset: 500
            }).addTo(window.mapLayer.map);

            // Add popup (simple like POI)
            marker.bindPopup(`
                <b>NPC Marker</b><br>
                <small>👤 Mysterious Stranger</small><br>
                <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
            `);

            console.log('👤 LIGHTWEIGHT NPC marker created visually on map');
        }

        // Send NPC marker to server for persistence (same as POI)
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('👤 Sending NPC marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'npc',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    name: 'Mysterious Stranger',
                    symbol: '👤',
                    markerId: `npc_${Date.now()}`,
                    description: 'A mysterious NPC encountered by the player'
                }
            });
            console.log('👤 NPC marker sent to server successfully');
        } else {
            console.log('👤 WebSocket not connected, NPC marker not persisted to server');
        }
    }

    /**
     * BRDC: Create lightweight Monster marker using direct Leaflet approach
     * 
     * Implements the "Sacred Pattern" for marker creation:
     * - Direct Leaflet creation for reliability
     * - Consistent positioning system
     * - CSS isolation to prevent conflicts
     * - Server integration for persistence
     * 
     * Implements: #enhancement-monster-markers
     * Uses: #feature-marker-system
     * 
     * @param {Object} position - {lat: number, lng: number} coordinates
     */
    createMonsterMarker(position) {
        console.log('👹 Creating LIGHTWEIGHT Monster marker at:', position);
        
        // Create visual marker on map first (EXACTLY like POI marker)
        if (window.mapLayer && window.mapLayer.map) {
            const monsterIcon = L.divIcon({
                className: 'monster-marker-lightweight', // Different class name to avoid CSS conflicts
                html: `
                    <div style="
                        width: 30px; 
                        height: 30px; 
                        background: #dc2626; 
                        border: 3px solid #ffffff; 
                        border-radius: 50%; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        font-size: 16px;
                        color: white;
                        text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
                    ">👹</div>
                `,
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            const marker = L.marker([position.lat, position.lng], { 
                icon: monsterIcon,
                zIndexOffset: 400
            }).addTo(window.mapLayer.map);

            // Add popup (simple like POI)
            marker.bindPopup(`
                <b>Monster Marker</b><br>
                <small>👹 Cosmic Horror</small><br>
                <small>${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</small>
            `);

            console.log('👹 LIGHTWEIGHT Monster marker created visually on map');
        }

        // Send Monster marker to server for persistence (same as POI)
        if (window.websocketClient && window.websocketClient.isConnectedToServer()) {
            console.log('👹 Sending Monster marker to server for persistence...');
            window.websocketClient.createMarker({
                type: 'monster',
                position: { lat: position.lat, lng: position.lng },
                data: {
                    name: 'Cosmic Horror',
                    symbol: '👹',
                    markerId: `monster_${Date.now()}`,
                    description: 'A terrifying monster encountered by the player'
                }
            });
            console.log('👹 Monster marker sent to server successfully');
        } else {
            console.log('👹 WebSocket not connected, Monster marker not persisted to server');
        }
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
        console.log('🎯 Force creating base marker at PLAYER MARKER location...');
        
        // Get player's current position from player marker
        const playerPosition = this.getPlayerCurrentPosition();
        if (!playerPosition) {
            console.error('❌ No player position available for force base marker');
            this.hideContextMenu();
            return;
        }

        console.log('🎯 Using PLAYER MARKER position for force base marker:', playerPosition);

        // Check if player has enough steps (same as normal base creation)
        const stepSystem = window.stepCurrencySystem;
        if (!stepSystem || stepSystem.totalSteps < 1000) {
            console.warn('⚠️ Not enough steps to establish a base! Current steps:', stepSystem?.totalSteps || 0);
            alert('Not enough steps to establish a base! Need 1000 steps.');
            this.hideContextMenu();
            return;
        }

        // Use SAME lightweight approach as normal base creation
        this.createBaseMarker(playerPosition);
        
        console.log('🎯 Force base marker created successfully at player marker location');
        this.hideContextMenu();
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
