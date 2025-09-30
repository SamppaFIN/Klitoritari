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
    panel.style.cssText = 'position:fixed; bottom:14px; left:14px; z-index:10020; background:rgba(17,24,39,0.92); border:1px solid #374151; color:#e5e7eb; border-radius:10px; padding:10px 12px; width:260px; font-family:Segoe UI, sans-serif; box-shadow:0 16px 40px rgba(0,0,0,0.35)';
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

    // periodic refresh fallback
    setInterval(()=> this._refresh(), 3000);
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
      const p = window.geolocationManager?.getCurrentPositionSafe?.();
      if (p && p.lat != null && p.lng != null) return p;
    } catch (_) {}
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
