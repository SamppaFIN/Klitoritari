/**
 * Database Client for Eldritch Sanctuary
 * Handles all Supabase database operations for player bases and territory
 */

class DatabaseClient {
    constructor() {
        this.supabase = null;
        this.isInitialized = false;
        this.init();
    }

    async init() {
        try {
            // Check if Supabase is available
            if (typeof supabase !== 'undefined') {
                this.supabase = supabase;
                this.isInitialized = true;
                console.log('🗄️ Database client initialized');
            } else {
                console.warn('🗄️ Supabase not available - using local storage fallback');
                this.isInitialized = false;
            }
        } catch (error) {
            console.error('🗄️ Failed to initialize database client:', error);
            this.isInitialized = false;
        }
    }

    // Player management
    async createPlayer(playerData) {
        if (!this.isInitialized) {
            return this.createPlayerLocal(playerData);
        }

        try {
            const { data, error } = await this.supabase
                .from('players')
                .insert([playerData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error creating player:', error);
            return this.createPlayerLocal(playerData);
        }
    }

    async getPlayer(playerId) {
        if (!this.isInitialized) {
            return this.getPlayerLocal(playerId);
        }

        try {
            const { data, error } = await this.supabase
                .from('players')
                .select('*')
                .eq('id', playerId)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error getting player:', error);
            return this.getPlayerLocal(playerId);
        }
    }

    // Base management
    async createBase(baseData) {
        if (!this.isInitialized) {
            return this.createBaseLocal(baseData);
        }

        try {
            const { data, error } = await this.supabase
                .from('player_bases')
                .insert([baseData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error creating base:', error);
            return this.createBaseLocal(baseData);
        }
    }

    async getPlayerBases(playerId) {
        if (!this.isInitialized) {
            return this.getPlayerBasesLocal(playerId);
        }

        try {
            const { data, error } = await this.supabase
                .from('player_bases')
                .select('*')
                .eq('player_id', playerId)
                .eq('is_active', true)
                .order('established_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('🗄️ Error getting player bases:', error);
            return this.getPlayerBasesLocal(playerId);
        }
    }

    async getNearbyBases(latitude, longitude, radiusMeters = 1000) {
        if (!this.isInitialized) {
            return this.getNearbyBasesLocal(latitude, longitude, radiusMeters);
        }

        try {
            const { data, error } = await this.supabase
                .rpc('get_nearby_bases', {
                    user_lat: latitude,
                    user_lng: longitude,
                    radius_meters: radiusMeters
                });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('🗄️ Error getting nearby bases:', error);
            return this.getNearbyBasesLocal(latitude, longitude, radiusMeters);
        }
    }

    async updateBase(baseId, updateData) {
        if (!this.isInitialized) {
            return this.updateBaseLocal(baseId, updateData);
        }

        try {
            const { data, error } = await this.supabase
                .from('player_bases')
                .update(updateData)
                .eq('id', baseId)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error updating base:', error);
            return this.updateBaseLocal(baseId, updateData);
        }
    }

    // Territory management
    async addTerritoryPoint(baseId, pointData) {
        if (!this.isInitialized) {
            return this.addTerritoryPointLocal(baseId, pointData);
        }

        try {
            const { data, error } = await this.supabase
                .from('territory_points')
                .insert([{
                    base_id: baseId,
                    ...pointData
                }])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error adding territory point:', error);
            return this.addTerritoryPointLocal(baseId, pointData);
        }
    }

    async getTerritoryPoints(baseId) {
        if (!this.isInitialized) {
            return this.getTerritoryPointsLocal(baseId);
        }

        try {
            const { data, error } = await this.supabase
                .from('territory_points')
                .select('*')
                .eq('base_id', baseId)
                .order('sequence_order', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('🗄️ Error getting territory points:', error);
            return this.getTerritoryPointsLocal(baseId);
        }
    }

    // Base activities
    async logBaseActivity(activityData) {
        if (!this.isInitialized) {
            return this.logBaseActivityLocal(activityData);
        }

        try {
            const { data, error } = await this.supabase
                .from('base_activities')
                .insert([activityData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error logging base activity:', error);
            return this.logBaseActivityLocal(activityData);
        }
    }

    // Sacred structures
    async createSacredStructure(structureData) {
        if (!this.isInitialized) {
            return this.createSacredStructureLocal(structureData);
        }

        try {
            const { data, error } = await this.supabase
                .from('sacred_structures')
                .insert([structureData])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('🗄️ Error creating sacred structure:', error);
            return this.createSacredStructureLocal(structureData);
        }
    }

    async getBaseStructures(baseId) {
        if (!this.isInitialized) {
            return this.getBaseStructuresLocal(baseId);
        }

        try {
            const { data, error } = await this.supabase
                .from('sacred_structures')
                .select('*')
                .eq('base_id', baseId)
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('🗄️ Error getting base structures:', error);
            return this.getBaseStructuresLocal(baseId);
        }
    }

    // Analytics and metrics
    async getCommunityHealingMetrics() {
        if (!this.isInitialized) {
            return this.getCommunityHealingMetricsLocal();
        }

        try {
            const { data, error } = await this.supabase
                .from('community_healing_metrics')
                .select('*')
                .limit(50);

            if (error) throw error;
            return data || [];
        } catch (error) {
            console.error('🗄️ Error getting community healing metrics:', error);
            return this.getCommunityHealingMetricsLocal();
        }
    }

    // Local storage fallback methods
    createPlayerLocal(playerData) {
        const players = this.getLocalData('players', []);
        const player = { ...playerData, id: this.generateId() };
        players.push(player);
        this.setLocalData('players', players);
        return player;
    }

    getPlayerLocal(playerId) {
        const players = this.getLocalData('players', []);
        return players.find(p => p.id === playerId) || null;
    }

    createBaseLocal(baseData) {
        const bases = this.getLocalData('player_bases', []);
        const base = { ...baseData, id: this.generateId() };
        bases.push(base);
        this.setLocalData('player_bases', bases);
        return base;
    }

    getPlayerBasesLocal(playerId) {
        const bases = this.getLocalData('player_bases', []);
        return bases.filter(b => b.player_id === playerId && b.is_active !== false);
    }

    getNearbyBasesLocal(latitude, longitude, radiusMeters) {
        const bases = this.getLocalData('player_bases', []);
        return bases.filter(base => {
            if (!base.is_active) return false;
            
            const distance = this.calculateDistance(
                latitude, longitude,
                base.latitude, base.longitude
            );
            return distance <= radiusMeters;
        });
    }

    updateBaseLocal(baseId, updateData) {
        const bases = this.getLocalData('player_bases', []);
        const index = bases.findIndex(b => b.id === baseId);
        if (index !== -1) {
            bases[index] = { ...bases[index], ...updateData };
            this.setLocalData('player_bases', bases);
            return bases[index];
        }
        return null;
    }

    addTerritoryPointLocal(baseId, pointData) {
        const points = this.getLocalData('territory_points', []);
        const point = { ...pointData, base_id: baseId, id: this.generateId() };
        points.push(point);
        this.setLocalData('territory_points', points);
        return point;
    }

    getTerritoryPointsLocal(baseId) {
        const points = this.getLocalData('territory_points', []);
        return points.filter(p => p.base_id === baseId)
                    .sort((a, b) => a.sequence_order - b.sequence_order);
    }

    logBaseActivityLocal(activityData) {
        const activities = this.getLocalData('base_activities', []);
        const activity = { ...activityData, id: this.generateId() };
        activities.push(activity);
        this.setLocalData('base_activities', activities);
        return activity;
    }

    createSacredStructureLocal(structureData) {
        const structures = this.getLocalData('sacred_structures', []);
        const structure = { ...structureData, id: this.generateId() };
        structures.push(structure);
        this.setLocalData('sacred_structures', structures);
        return structure;
    }

    getBaseStructuresLocal(baseId) {
        const structures = this.getLocalData('sacred_structures', []);
        return structures.filter(s => s.base_id === baseId && s.is_active !== false);
    }

    getCommunityHealingMetricsLocal() {
        const players = this.getLocalData('players', []);
        const bases = this.getLocalData('player_bases', []);
        
        return players.map(player => {
            const playerBases = bases.filter(b => b.player_id === player.id && b.is_active !== false);
            return {
                id: player.id,
                display_name: player.display_name,
                wisdom_level: player.wisdom_level,
                base_count: playerBases.length,
                total_territory: playerBases.reduce((sum, b) => sum + (b.territory_radius || 0), 0),
                total_energy: playerBases.reduce((sum, b) => sum + (b.cosmic_energy || 0), 0),
                healing_contribution: player.healing_contribution || 0,
                lumen_tokens: player.lumen_tokens || 0
            };
        }).sort((a, b) => b.healing_contribution - a.healing_contribution);
    }

    // Utility methods
    getLocalData(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(`eldritch_${key}`);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error(`🗄️ Error getting local data for ${key}:`, error);
            return defaultValue;
        }
    }

    setLocalData(key, data) {
        try {
            localStorage.setItem(`eldritch_${key}`, JSON.stringify(data));
        } catch (error) {
            console.error(`🗄️ Error setting local data for ${key}:`, error);
        }
    }

    generateId() {
        return 'local_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    calculateDistance(lat1, lng1, lat2, lng2) {
        const R = 6371000; // Earth's radius in meters
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }
}

// Make database client globally available
window.databaseClient = new DatabaseClient();
