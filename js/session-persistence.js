/**
 * Session Persistence Manager - lightweight per-session state storage
 * Stores: map view, path polyline, quest adventure mode/objectives
 */

class SessionPersistenceManager {
    constructor() {
        this.storageKeyPrefix = this.computeSessionPrefix();
    }

    init() {
        // Initialize session persistence manager
        console.log('ðŸ’¾ Session Persistence Manager initialized');
    }

    computeSessionPrefix() {
        try {
            const ua = navigator.userAgent || 'ua';
            const day = new Date().toISOString().slice(0,10);
            return `es:${btoa(ua + '|' + day).slice(0,12)}:`;
        } catch (_) {
            return 'es:sess:';
        }
    }

    key(suffix) {
        return `${this.storageKeyPrefix}${suffix}`;
    }

    // Map view: center/zoom
    saveMapView(map) {
        try {
            if (!map) return;
            const center = map.getCenter();
            const zoom = map.getZoom();
            const payload = { lat: center.lat, lng: center.lng, zoom };
            localStorage.setItem(this.key('mapView'), JSON.stringify(payload));
        } catch (_) {}
    }

    restoreMapView(map) {
        try {
            const raw = localStorage.getItem(this.key('mapView'));
            if (!raw) return false;
            const { lat, lng, zoom } = JSON.parse(raw);
            if (typeof lat === 'number' && typeof lng === 'number' && typeof zoom === 'number') {
                map.setView([lat, lng], zoom, { animate: false });
                return true;
            }
        } catch (_) {}
        return false;
    }

    // Path polyline: array of [lat,lng]
    savePath(pathLatLngs) {
        try {
            if (!Array.isArray(pathLatLngs)) return;
            const compact = pathLatLngs.map(ll => Array.isArray(ll) ? [ll[0], ll[1]] : [ll.lat, ll.lng]).filter(v => Number.isFinite(v[0]) && Number.isFinite(v[1]));
            localStorage.setItem(this.key('path'), JSON.stringify(compact));
        } catch (_) {}
    }

    restorePath() {
        try {
            const raw = localStorage.getItem(this.key('path'));
            if (!raw) return null;
            const arr = JSON.parse(raw);
            if (Array.isArray(arr) && arr.length) return arr;
        } catch (_) {}
        return null;
    }

    clearPath() {
        try { localStorage.removeItem(this.key('path')); } catch (_) {}
    }

    // Quest mode (demo/game) and maybe objective positions
    saveQuestState(state) {
        try {
            localStorage.setItem(this.key('questState'), JSON.stringify(state || {}));
        } catch (_) {}
    }

    restoreQuestState() {
        try {
            const raw = localStorage.getItem(this.key('questState'));
            return raw ? JSON.parse(raw) : null;
        } catch (_) { return null; }
    }

    // Finnish flag pins (canvas layer) - persist all owners
    saveFlags(flagPins) {
        try {
            if (!Array.isArray(flagPins)) return;
            // Store compact objects: {lat,lng,size,rotation,t,symbol,owner}
            const compact = flagPins
                .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
                .map(p => ({
                    lat: +p.lat,
                    lng: +p.lng,
                    size: +p.size || 30,
                    rotation: +p.rotation || 0,
                    t: p.timestamp || Date.now(),
                    symbol: (p.symbol || 'finnish').toString(),
                    owner: p.ownerId || null
                }));
            localStorage.setItem(this.key('flags'), JSON.stringify(compact));
        } catch (_) {}
    }

    restoreFlags() {
        try {
            const raw = localStorage.getItem(this.key('flags'));
            if (!raw) return [];
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) return arr;
        } catch (_) {}
        return [];
    }

    clearFlags() {
        try { localStorage.removeItem(this.key('flags')); } catch (_) {}
    }

    // Player profile (name, symbol)
    saveProfile(profile) {
        try {
            const safe = {
                name: (profile?.name || '').toString().slice(0, 24),
                symbol: (profile?.symbol || 'finnish').toString(),
                pathColor: (profile?.pathColor || '#00ff00').toString()
            };
            localStorage.setItem(this.key('profile'), JSON.stringify(safe));
        } catch (_) {}
    }

    restoreProfile() {
        try {
            const raw = localStorage.getItem(this.key('profile'));
            return raw ? JSON.parse(raw) : null;
        } catch (_) { return null; }
    }

    // Inventory
    saveInventory(items) {
        try {
            if (!Array.isArray(items)) return;
            const compact = items.map(it => ({
                name: it.name,
                emoji: it.emoji,
                rarity: it.rarity,
                color: it.color,
                acquiredAt: it.acquiredAt || Date.now()
            }));
            localStorage.setItem(this.key('inventory'), JSON.stringify(compact));
        } catch (_) {}
    }

    restoreInventory() {
        try {
            const raw = localStorage.getItem(this.key('inventory'));
            if (!raw) return [];
            const arr = JSON.parse(raw);
            return Array.isArray(arr) ? arr : [];
        } catch (_) { return []; }
    }

    // Player stats (subset)
    saveStats(stats) {
        try {
            const keep = {
                health: stats.health,
                maxHealth: stats.maxHealth,
                sanity: stats.sanity,
                maxSanity: stats.maxSanity,
                attack: stats.attack,
                defense: stats.defense,
                luck: stats.luck,
                experience: stats.experience,
                level: stats.level
            };
            localStorage.setItem(this.key('stats'), JSON.stringify(keep));
        } catch (_) {}
    }

    restoreStats() {
        try {
            const raw = localStorage.getItem(this.key('stats'));
            return raw ? JSON.parse(raw) : null;
        } catch (_) { return null; }
    }

    // Encounter state (what the player has already interacted with)
    saveEncounterState(state) {
        try {
            const compact = {
                monsters: Array.from(state.monsters || []),
                items: Array.from(state.items || []),
                pois: Array.from(state.pois || []),
                quests: Array.from(state.quests || [])
            };
            localStorage.setItem(this.key('encounters'), JSON.stringify(compact));
        } catch (_) {}
    }

    restoreEncounterState() {
        try {
            const raw = localStorage.getItem(this.key('encounters'));
            if (!raw) return { monsters: [], items: [], pois: [], quests: [] };
            const obj = JSON.parse(raw);
            return {
                monsters: new Set(obj.monsters || []),
                items: new Set(obj.items || []),
                pois: new Set(obj.pois || []),
                quests: new Set(obj.quests || [])
            };
        } catch (_) {
            return { monsters: new Set(), items: new Set(), pois: new Set(), quests: new Set() };
        }
    }
}

window.sessionPersistence = new SessionPersistenceManager();


