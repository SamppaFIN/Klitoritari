/**
 * Player Chat System - Opens chat when another player is within proximity (default 100m)
 */

class PlayerChatSystem {
  constructor() {
    this.enabled = true;
    this.distanceThresholdM = 100; // meters
    this.activeChatPlayerId = null;
    this.cooldownMs = 60 * 1000; // 1 minute between auto-opens per player
    this.lastOpenedByPlayer = new Map();
    this.modal = null;
    this.messagesEl = null;
    this.inputEl = null;
    this.titleEl = null;
    this._init();
  }

  _init() {
    this._ensureModal();
    // Hook into websocket player updates
    const attach = () => {
      if (!window.websocketClient) return;
      const prev = window.websocketClient.onPlayerUpdate;
      window.websocketClient.onPlayerUpdate = (player) => {
        try { if (prev) prev(player); } catch (_) {}
        this._handleOtherPlayerUpdate(player);
      };
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attach);
    } else {
      attach();
    }
  }

  _ensureModal() {
    if (this.modal) return;
    const modal = document.createElement('div');
    modal.id = 'player-chat-modal';
    modal.style.cssText = 'position:fixed; inset:0; display:none; align-items:center; justify-content:center; z-index:10050;';
    modal.innerHTML = `
      <div style="background:#111827; border:1px solid #374151; border-radius:12px; width:92%; max-width:420px; box-shadow:0 20px 60px rgba(0,0,0,0.5); overflow:hidden;">
        <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 14px; background:#1f2937;">
          <h3 id="player-chat-title" style="margin:0; color:#e5e7eb; font-size:16px;">Chat</h3>
          <button id="player-chat-close" style="background:transparent; border:none; color:#9ca3af; font-size:20px; cursor:pointer;">×</button>
        </div>
        <div id="player-chat-messages" style="height:260px; overflow:auto; padding:12px; color:#e5e7eb; background:#0b1220;"></div>
        <div style="display:flex; gap:8px; padding:12px; background:#0b1220; border-top:1px solid #1f2937;">
          <input id="player-chat-input" type="text" placeholder="Type a message..." style="flex:1; padding:10px; background:#111827; border:1px solid #374151; color:#e5e7eb; border-radius:8px;" />
          <button id="player-chat-send" style="padding:10px 14px; background:linear-gradient(135deg,#8b5cf6,#6d28d9); color:#fff; border:none; border-radius:8px; cursor:pointer;">Send</button>
        </div>
      </div>`;
    document.body.appendChild(modal);
    this.modal = modal;
    this.messagesEl = modal.querySelector('#player-chat-messages');
    this.inputEl = modal.querySelector('#player-chat-input');
    this.titleEl = modal.querySelector('#player-chat-title');
    modal.querySelector('#player-chat-close').addEventListener('click', () => this.hide());
    modal.querySelector('#player-chat-send').addEventListener('click', () => this._sendCurrent());
    this.inputEl.addEventListener('keypress', (e) => { if (e.key === 'Enter') this._sendCurrent(); });
  }

  _sendCurrent() {
    const text = (this.inputEl.value || '').trim();
    if (!text) return;
    this._appendMessage('You', text);
    this.inputEl.value = '';
    // TODO: send via websocket when private chat implemented
  }

  _appendMessage(sender, text) {
    const row = document.createElement('div');
    row.style.marginBottom = '8px';
    row.innerHTML = `<strong style="color:#c4b5fd;">${sender}:</strong> <span>${this._escape(text)}</span>`;
    this.messagesEl.appendChild(row);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  _escape(s) { return s.replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

  _handleOtherPlayerUpdate(player) {
    if (!this.enabled || !player || !player.position) return;
    const selfPos = this._getSelfPosition();
    if (!selfPos) return;

    const distance = this._distanceMeters(selfPos.lat, selfPos.lng, player.position.lat, player.position.lng);
    if (distance <= this.distanceThresholdM) {
      const now = Date.now();
      const last = this.lastOpenedByPlayer.get(player.playerId) || 0;
      if (now - last < this.cooldownMs) return;
      this.lastOpenedByPlayer.set(player.playerId, now);
      this.open(player);
    }
  }

  _getSelfPosition() {
    try {
      if (window.geolocationManager && typeof window.geolocationManager.getCurrentPositionSafe === 'function') {
        const p = window.geolocationManager.getCurrentPositionSafe();
        if (p && p.lat != null && p.lng != null) return p;
      }
    } catch (_) {}
    return null;
  }

  _distanceMeters(lat1, lon1, lat2, lon2) {
    const R = 6371000; // m
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon/2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  open(player) {
    this.activeChatPlayerId = player.playerId;
    if (this.titleEl) this.titleEl.textContent = `Chat with ${player.name || 'Traveller'}`;
    this.messagesEl.innerHTML = '';
    this._appendMessage(player.name || 'Traveller', 'You are nearby. Start a conversation!');
    this.modal.style.display = 'flex';
  }

  hide() {
    this.activeChatPlayerId = null;
    if (this.modal) this.modal.style.display = 'none';
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.playerChatSystem = new PlayerChatSystem(); });
} else {
  window.playerChatSystem = new PlayerChatSystem();
}

console.log('💬 PlayerChatSystem loaded');
