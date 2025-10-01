/**
 * MultiplayerPanel - shows connected players and live info
 */

class MultiplayerPanel {
  constructor() {
    this.container = null;
    this.listEl = null;
    this.countEl = null;
    this.visible = true;
    this._init();
  }

  _init() {
    const panel = document.createElement('div');
    panel.id = 'multiplayer-panel';
    panel.style.cssText = 'position:fixed; bottom:120px; left:14px; z-index:10020; background:rgba(17,24,39,0.92); border:1px solid #374151; color:#e5e7eb; border-radius:10px; padding:10px 12px; width:260px; font-family:Segoe UI, sans-serif; box-shadow:0 16px 40px rgba(0,0,0,0.35)';
    panel.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
        <div style="font-weight:700;">👥 Multiplayer</div>
        <button id="mp-toggle" style="background:transparent; border:none; color:#9ca3af; cursor:pointer;">–</button>
      </div>
      <div style="font-size:12px; margin-bottom:8px;">Players connected: <span id="mp-count">0</span></div>
      <div id="mp-list" style="display:grid; gap:6px; max-height:160px; overflow:auto;"></div>
    `;
    document.body.appendChild(panel);
    this.container = panel;
    this.listEl = panel.querySelector('#mp-list');
    this.countEl = panel.querySelector('#mp-count');
    panel.querySelector('#mp-toggle').addEventListener('click', () => this._toggle());

    this._attachClient();
    this._refresh();

    // Consciousness-Serving: Enhanced multiplayer position updates
    this.positionUpdateInterval = setInterval(() => this._updatePlayerPositions(), 10000); // Every 10 seconds
    this.refreshInterval = setInterval(() => this._refresh(), 3000); // Keep existing refresh
  }

  _toggle() {
    this.visible = !this.visible;
    this.listEl.style.display = this.visible ? 'grid' : 'none';
  }

  _attachClient() {
    const attach = () => {
      if (!window.websocketClient) return;
      const prevUpdate = window.websocketClient.onPlayerUpdate;
      window.websocketClient.onPlayerUpdate = (player) => {
        try { if (prevUpdate) prevUpdate(player); } catch (_) {}
        this._refresh();
      };
      const prevLeave = window.websocketClient.handlePlayerLeave?.bind(window.websocketClient);
      if (prevLeave) {
        const wc = window.websocketClient;
        wc.handlePlayerLeave = (payload) => { try { prevLeave(payload); } catch (_) {} this._refresh(); };
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', attach); else attach();
  }

  _refresh() {
    try {
      const others = (typeof window.websocketClient?.getOtherPlayers === 'function') ? window.websocketClient.getOtherPlayers() : [];
      this.countEl.textContent = String(others.length + 1); // + self
      this.listEl.innerHTML = '';
      // self row
      this._appendRow({ name: 'You', position: this._selfPos(), isSelf: true });
      // others
      others.forEach(p => this._appendRow(p));
    } catch (e) { /* noop */ }
  }
  
  /**
   * Consciousness-Serving: Update player positions every 10 seconds
   * Promotes community connection and spatial awareness
   */
  _updatePlayerPositions() {
    console.log('👥 Multiplayer: Updating player positions (consciousness-serving)');
    
    if (!window.websocketClient) {
      console.log('👥 Multiplayer: WebSocket client not available');
      return;
    }
    
    // Get current player position
    const currentPosition = this._getCurrentPlayerPosition();
    if (!currentPosition) {
      console.log('👥 Multiplayer: No current position available');
      return;
    }
    
    // Send position update to server (consciousness-serving)
    try {
      // Use the correct WebSocket method for position updates
      if (typeof window.websocketClient.sendPositionUpdate === 'function') {
        window.websocketClient.sendPositionUpdate({
          ...currentPosition,
          timestamp: Date.now(),
          consciousnessLevel: 'community_connection'
        });
      } else if (typeof window.websocketClient.send === 'function') {
        // Fallback to generic send method
        window.websocketClient.send(JSON.stringify({
          type: 'position_update',
          payload: {
            ...currentPosition,
            timestamp: Date.now(),
            consciousnessLevel: 'community_connection'
          }
        }));
      } else {
        console.log('👥 Multiplayer: No position update method available');
        return;
      }
      
      console.log('👥 Multiplayer: Position update sent:', currentPosition);
      
      // Emit consciousness-serving event
      if (window.EventBus && typeof window.EventBus.emit === 'function') {
        window.EventBus.emit('multiplayer:position:updated', {
          position: currentPosition,
          timestamp: Date.now(),
          consciousnessLevel: 'community_connection'
        });
      }
      
    } catch (error) {
      console.error('👥 Multiplayer: Error sending position update:', error);
    }
  }
  
  /**
   * Get current player position from available sources
   */
  _getCurrentPlayerPosition() {
    // Try multiple sources for player position
    if (window.playerPosition && window.playerPosition.lat && window.playerPosition.lng) {
      return {
        lat: window.playerPosition.lat,
        lng: window.playerPosition.lng,
        accuracy: window.playerPosition.accuracy
      };
    }
    
    if (window.gpsCore && typeof window.gpsCore.getCurrentPosition === 'function') {
      const gpsPosition = window.gpsCore.getCurrentPosition();
      if (gpsPosition && gpsPosition.lat && gpsPosition.lng) {
        return {
          lat: gpsPosition.lat,
          lng: gpsPosition.lng,
          accuracy: gpsPosition.accuracy
        };
      }
    }
    
    // Try to get from localStorage
    try {
      const saved = localStorage.getItem('eldritch_last_gps');
      if (saved) {
        const position = JSON.parse(saved);
        if (position.lat && position.lng) {
          return {
            lat: position.lat,
            lng: position.lng,
            accuracy: position.accuracy || 0
          };
        }
      }
    } catch (error) {
      console.error('👥 Multiplayer: Error reading saved position:', error);
    }
    
    return null;
  }

  _appendRow(p) {
    const row = document.createElement('div');
    row.style.cssText = 'display:flex; align-items:center; justify-content:space-between; background:#0b1220; border:1px solid #1f2937; padding:6px 8px; border-radius:8px;';
    const name = p.isSelf ? 'You' : (p.name || 'Explorer');
    const pos = p.position ? `${p.position.lat.toFixed(5)}, ${p.position.lng.toFixed(5)}` : '–';
    row.innerHTML = `
      <div style="display:flex; gap:8px; align-items:center;">
        <div style="width:8px; height:8px; border-radius:50%; background:${p.isSelf ? '#10b981' : '#3b82f6'}"></div>
        <div>${name}</div>
      </div>
      <div style="font-size:11px; color:#9ca3af;">${pos}</div>
    `;
    this.listEl.appendChild(row);
  }

  _selfPos() {
    try {
      // Try new GPS Core system first
      if (window.gpsCore && typeof window.gpsCore.getCurrentPosition === 'function') {
        const pos = window.gpsCore.getCurrentPosition();
        if (pos && pos.lat != null && pos.lng != null) {
          console.log('🎮 Multiplayer: Using GPS Core position:', pos);
          return pos;
        }
      }
      
      // Try global player position
      if (window.playerPosition && window.playerPosition.lat != null && window.playerPosition.lng != null) {
        console.log('🎮 Multiplayer: Using global player position:', window.playerPosition);
        return window.playerPosition;
      }
      
      // Try localStorage position
      const storedPos = localStorage.getItem('eldritch_player_position');
      if (storedPos) {
        try {
          const pos = JSON.parse(storedPos);
          if (pos && pos.lat != null && pos.lng != null) {
            console.log('🎮 Multiplayer: Using stored position:', pos);
            return pos;
          }
        } catch (e) {
          console.warn('🎮 Multiplayer: Error parsing stored position:', e);
        }
      }
      
      // [BRDC DEPRECATED] Fallback to legacy geolocationManager
      const p = window.geolocationManager?.getCurrentPositionSafe?.();
      if (p && p.lat != null && p.lng != null) {
        console.warn('🎮 [DEPRECATED] Multiplayer using legacy geolocationManager - migrate to gpsCore');
        return p;
      }
    } catch (e) {
      console.error('🎮 Multiplayer: Error getting self position:', e);
    }
    return null;
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', ()=> { window.multiplayerPanel = new MultiplayerPanel(); });
} else {
  window.multiplayerPanel = new MultiplayerPanel();
}

console.log('👥 MultiplayerPanel loaded');
