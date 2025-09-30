/**
 * ProximityManager - universal distance/event system (enter/leave within radius)
 */

class ProximityManager {
  constructor() {
    this.targets = new Map(); // id -> { getPosition, radius, inside }
    this.listeners = { enter: new Map(), leave: new Map(), update: new Map() };
    this.interval = null;
    this.pollMs = 1000;
    this.enabled = true;
    this._start();
  }

  _start() {
    if (this.interval) return;
    this.interval = setInterval(() => this._tick(), this.pollMs);
  }

  destroy() {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
    this.targets.clear();
    this.listeners.enter.clear();
    this.listeners.leave.clear();
    this.listeners.update.clear();
  }

  addTarget(id, getPosition, radiusMeters) {
    this.targets.set(id, { getPosition, radius: radiusMeters, inside: false, lastDistance: null });
  }

  removeTarget(id) {
    this.targets.delete(id);
    this.listeners.enter.delete(id);
    this.listeners.leave.delete(id);
    this.listeners.update.delete(id);
  }

  on(id, event, callback) {
    const map = this.listeners[event];
    if (!map) return;
    const list = map.get(id) || [];
    list.push(callback);
    map.set(id, list);
  }

  off(id, event, callback) {
    const map = this.listeners[event];
    if (!map) return;
    const list = (map.get(id) || []).filter(cb => cb !== callback);
    map.set(id, list);
  }

  _emit(id, event, payload) {
    const list = this.listeners[event]?.get(id) || [];
    for (const cb of list) {
      try { cb(payload); } catch (_) {}
    }
  }

  _tick() {
    if (!this.enabled) return;
    const self = this._getSelf();
    if (!self) return;
    for (const [id, target] of this.targets.entries()) {
      let pos = null;
      try { pos = target.getPosition?.(); } catch (_) {}
      if (!pos || pos.lat == null || pos.lng == null) continue;
      const d = this._distance(self.lat, self.lng, pos.lat, pos.lng);
      const wasInside = target.inside;
      const isInside = d <= target.radius;
      target.lastDistance = d;
      if (!wasInside && isInside) {
        target.inside = true;
        this._emit(id, 'enter', { id, distance: d });
      } else if (wasInside && !isInside) {
        target.inside = false;
        this._emit(id, 'leave', { id, distance: d });
      }
      this._emit(id, 'update', { id, distance: d, inside: isInside });
    }
  }

  _getSelf() {
    try {
      if (window.geolocationManager && typeof window.geolocationManager.getCurrentPositionSafe === 'function') {
        const p = window.geolocationManager.getCurrentPositionSafe();
        if (p && p.lat != null && p.lng != null) return p;
      }
    } catch (_) {}
    return null;
  }

  _distance(lat1, lon1, lat2, lon2) {
    const R = 6371000;
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.proximityManager = new ProximityManager(); });
} else {
  window.proximityManager = new ProximityManager();
}

console.log('📏 ProximityManager loaded');
