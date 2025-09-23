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
        console.log('💾 Session Persistence Manager initialized');
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

    // Finnish flag pins (canvas layer)
    saveFlags(flagPins) {
        try {
            if (!Array.isArray(flagPins)) return;
            // Store compact objects: {lat,lng,size,rotation,t}
            const compact = flagPins
                .filter(p => Number.isFinite(p.lat) && Number.isFinite(p.lng))
                .map(p => ({
                    lat: +p.lat,
                    lng: +p.lng,
                    size: +p.size || 30,
                    rotation: +p.rotation || 0,
                    t: p.timestamp || Date.now()
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
}

window.sessionPersistence = new SessionPersistenceManager();
