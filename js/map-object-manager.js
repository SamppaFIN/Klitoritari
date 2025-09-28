/**
 * Map Object Manager - Unified Map Object Insertion Multitool
 * Centralized system for creating, managing, and manipulating map objects
 * 
 * Features:
 * - Unified marker creation and management
 * - Object type registry with visual styles
 * - Layer-aware object placement
 * - Event-driven communication
 * - Debug and development tools
 */

class MapObjectManager {
    constructor() {
        this.objects = new Map(); // id -> object data
        this.nextId = 1;
        this.isActive = false;
        this.selectedType = 'BASE';
        this.eventBus = null;
        
        // Initialize object type registry
        this.objectTypes = this.initializeObjectTypes();
        
        console.log('🗺️ Map Object Manager initialized');
    }

    /**
     * Initialize the object type registry with all supported map objects
     */
    initializeObjectTypes() {
        return {
            BASE: {
                id: 'BASE',
                name: 'Base Marker',
                icon: '🏗️',
                color: '#ff0000',
                layer: 'territory',
                size: [40, 40],
                zIndex: 2000,
                description: 'Player base and territory marker',
                category: 'player'
            },
            QUEST: {
                id: 'QUEST',
                name: 'Quest Marker',
                icon: '🎭',
                color: '#00bfff',
                layer: 'map',
                size: [30, 30],
                zIndex: 1500,
                description: 'Quest objective and waypoint',
                category: 'quest'
            },
            NPC: {
                id: 'NPC',
                name: 'NPC Marker',
                icon: '👑',
                color: '#ffd700',
                layer: 'map',
                size: [35, 35],
                zIndex: 1600,
                description: 'Non-player character',
                category: 'npc'
            },
            MONSTER: {
                id: 'MONSTER',
                name: 'Monster Marker',
                icon: '👹',
                color: '#8b0000',
                layer: 'map',
                size: [32, 32],
                zIndex: 1700,
                description: 'Hostile creature encounter',
                category: 'encounter'
            },
            POI: {
                id: 'POI',
                name: 'Point of Interest',
                icon: '📍',
                color: '#32cd32',
                layer: 'map',
                size: [25, 25],
                zIndex: 1400,
                description: 'Interesting location',
                category: 'location'
            },
            HEVY: {
                id: 'HEVY',
                name: 'HEVY Encounter',
                icon: '⚡',
                color: '#ffd700',
                layer: 'map',
                size: [45, 45],
                zIndex: 2500,
                description: 'Legendary cosmic guardian',
                category: 'legendary'
            },
            TEST: {
                id: 'TEST',
                name: 'Test Marker',
                icon: '🧪',
                color: '#00ff00',
                layer: 'map',
                size: [30, 30],
                zIndex: 1000,
                description: 'Debug and testing marker',
                category: 'debug'
            }
        };
    }

    /**
     * Initialize the manager with required dependencies
     */
    init(eventBus) {
        this.eventBus = eventBus;
        console.log('🗺️ Map Object Manager initialized with event bus');
    }

    /**
     * Create a new map object at the specified position
     */
    createObject(type, position, options = {}) {
        if (!this.objectTypes[type]) {
            console.error(`❌ Unknown object type: ${type}`);
            return null;
        }

        if (!this.isMapAvailable()) {
            console.error('❌ Map not available for object creation');
            return null;
        }

        const objectType = this.objectTypes[type];
        const objectId = `obj_${this.nextId++}`;
        
        // Create object data
        const objectData = {
            id: objectId,
            type: type,
            position: position,
            created: Date.now(),
            ...options
        };

        // Create the visual marker
        const marker = this.createMarkerVisual(objectType, position, objectData);
        if (!marker) {
            console.error(`❌ Failed to create marker for ${type}`);
            return null;
        }

        // Store object data
        this.objects.set(objectId, {
            ...objectData,
            marker: marker
        });

        // Emit creation event
        if (this.eventBus) {
            this.eventBus.emit('map:object:created', {
                objectId: objectId,
                type: type,
                position: position,
                data: objectData
            });
        }

        console.log(`✅ Created ${type} object at:`, position);
        return objectId;
    }

    /**
     * Create the visual marker for the object
     */
    createMarkerVisual(objectType, position, objectData) {
        try {
            // Create multilayered marker similar to player marker
            const markerIcon = L.divIcon({
                className: `map-object-marker ${objectType.category}-marker`,
                html: `
                    <div style="position: relative; width: ${objectType.size[0]}px; height: ${objectType.size[1]}px;">
                        <!-- Object aura -->
                        <div style="position: absolute; top: -5px; left: -5px; width: ${objectType.size[0] + 10}px; height: ${objectType.size[1] + 10}px; 
                             background: radial-gradient(circle, ${objectType.color}40 0%, transparent 70%); 
                             border-radius: 50%; animation: objectPulse 2s infinite;"></div>
                        <!-- Object body -->
                        <div style="position: absolute; top: 2px; left: 2px; width: ${objectType.size[0] - 4}px; height: ${objectType.size[1] - 4}px; 
                             background: ${objectType.color}; border: 3px solid #ffffff; border-radius: 50%; 
                             box-shadow: 0 0 10px ${objectType.color}80;"></div>
                        <!-- Object emoji -->
                        <div style="position: absolute; top: 5px; left: 5px; width: ${objectType.size[0] - 10}px; height: ${objectType.size[1] - 10}px; 
                             display: flex; align-items: center; justify-content: center; font-size: ${Math.min(objectType.size[0], objectType.size[1]) * 0.4}px; 
                             text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);">${objectType.icon}</div>
                    </div>
                `,
                iconSize: objectType.size,
                iconAnchor: [objectType.size[0] / 2, objectType.size[1] / 2]
            });

            // Create marker and add to map (use new map system)
            const map = this.getMap();
            if (!map) {
                console.error('❌ No map available for marker creation');
                return null;
            }

            const marker = L.marker([position.lat, position.lng], {
                icon: markerIcon,
                zIndexOffset: objectType.zIndex
            }).addTo(map);

            // Center map on new marker for better visibility
            map.setView([position.lat, position.lng], map.getZoom(), {
                animate: true,
                duration: 0.5
            });

            // Add popup with object information
            marker.bindPopup(`
                <div style="text-align: center;">
                    <h3>${objectType.icon} ${objectType.name}</h3>
                    <p><strong>Type:</strong> ${objectType.category}</p>
                    <p><strong>Position:</strong> ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}</p>
                    <p><strong>Created:</strong> ${new Date(objectData.created).toLocaleTimeString()}</p>
                    <p><em>${objectType.description}</em></p>
                    <div style="margin-top: 10px;">
                        <button onclick="window.mapObjectManager.removeObject('${objectData.id}')" 
                                style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
                            Remove
                        </button>
                        <button onclick="window.mapObjectManager.editObject('${objectData.id}')" 
                                style="background: #4444ff; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; margin-left: 5px;">
                            Edit
                        </button>
                    </div>
                </div>
            `);

            // Ensure marker is visible
            marker.setOpacity(1);
            marker.setZIndexOffset(objectType.zIndex);

            return marker;
        } catch (error) {
            console.error('❌ Error creating marker visual:', error);
            return null;
        }
    }

    /**
     * Remove an object from the map
     */
    removeObject(objectId) {
        const object = this.objects.get(objectId);
        if (!object) {
            console.warn(`⚠️ Object ${objectId} not found`);
            return false;
        }

        try {
            // Remove marker from map
            if (object.marker) {
                const map = this.getMap();
                if (map) {
                    map.removeLayer(object.marker);
                }
            }

            // Remove from objects map
            this.objects.delete(objectId);

            // Emit removal event
            if (this.eventBus) {
                this.eventBus.emit('map:object:removed', {
                    objectId: objectId,
                    type: object.type
                });
            }

            console.log(`✅ Removed object ${objectId}`);
            return true;
        } catch (error) {
            console.error(`❌ Error removing object ${objectId}:`, error);
            return false;
        }
    }

    /**
     * Update an object's properties
     */
    updateObject(objectId, updates) {
        const object = this.objects.get(objectId);
        if (!object) {
            console.warn(`⚠️ Object ${objectId} not found`);
            return false;
        }

        try {
            // Update object data
            Object.assign(object, updates);

            // Update marker position if position changed
            if (updates.position && object.marker) {
                object.marker.setLatLng([updates.position.lat, updates.position.lng]);
            }

            // Emit update event
            if (this.eventBus) {
                this.eventBus.emit('map:object:updated', {
                    objectId: objectId,
                    updates: updates
                });
            }

            console.log(`✅ Updated object ${objectId}`);
            return true;
        } catch (error) {
            console.error(`❌ Error updating object ${objectId}:`, error);
            return false;
        }
    }

    /**
     * Get object by ID
     */
    getObject(objectId) {
        return this.objects.get(objectId);
    }

    /**
     * Get all objects of a specific type
     */
    getObjectsByType(type) {
        return Array.from(this.objects.values()).filter(obj => obj.type === type);
    }

    /**
     * Get all objects
     */
    getAllObjects() {
        return Array.from(this.objects.values());
    }

    /**
     * Clear all objects of a specific type
     */
    clearObjectsByType(type) {
        const objectsToRemove = this.getObjectsByType(type);
        objectsToRemove.forEach(obj => this.removeObject(obj.id));
        console.log(`✅ Cleared ${objectsToRemove.length} ${type} objects`);
    }

    /**
     * Clear all objects
     */
    clearAllObjects() {
        const count = this.objects.size;
        this.objects.forEach((obj, id) => this.removeObject(id));
        console.log(`✅ Cleared ${count} objects`);
    }

    /**
     * Set the active object type for creation
     */
    setActiveType(type) {
        if (this.objectTypes[type]) {
            this.selectedType = type;
            console.log(`🎯 Active object type set to: ${type}`);
        } else {
            console.error(`❌ Unknown object type: ${type}`);
        }
    }

    /**
     * Toggle the multitool active state
     */
    toggleActive() {
        this.isActive = !this.isActive;
        console.log(`🎯 Map Object Manager ${this.isActive ? 'activated' : 'deactivated'}`);
        
        if (this.eventBus) {
            this.eventBus.emit('map:object:manager:toggled', {
                active: this.isActive,
                selectedType: this.selectedType
            });
        }
    }

    /**
     * Check if map is available
     */
    isMapAvailable() {
        return this.getMap() !== null;
    }

    /**
     * Get the current map instance (prefer new map system)
     */
    getMap() {
        // Try new map system first
        if (window.mapLayer && window.mapLayer.map && window.mapLayer.mapReady) {
            return window.mapLayer.map;
        }
        
        // Fallback to old map system
        if (window.mapEngine && window.mapEngine.map) {
            return window.mapEngine.map;
        }
        
        return null;
    }

    /**
     * Get statistics about current objects
     */
    getStats() {
        const stats = {
            total: this.objects.size,
            byType: {},
            byCategory: {}
        };

        this.objects.forEach(obj => {
            // Count by type
            stats.byType[obj.type] = (stats.byType[obj.type] || 0) + 1;
            
            // Count by category
            const category = this.objectTypes[obj.type]?.category || 'unknown';
            stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
        });

        return stats;
    }

    /**
     * Create objects at random positions for testing
     */
    createTestObjects(count = 5) {
        if (!this.isMapAvailable()) {
            console.error('❌ Map not available for test object creation');
            return;
        }

        const types = Object.keys(this.objectTypes);
        const center = window.mapEngine.map.getCenter();
        
        for (let i = 0; i < count; i++) {
            const type = types[Math.floor(Math.random() * types.length)];
            const offset = (Math.random() - 0.5) * 0.01; // Random offset within ~1km
            
            const position = {
                lat: center.lat + offset,
                lng: center.lng + offset
            };

            this.createObject(type, position, {
                testObject: true,
                name: `Test ${type} ${i + 1}`
            });
        }

        console.log(`✅ Created ${count} test objects`);
    }
}

// Make globally available
window.MapObjectManager = MapObjectManager;

console.log('🗺️ Map Object Manager class loaded and ready');
