/**
 * NotificationCenter - banner + chime notifications (player events)
 */

class NotificationCenter {
  constructor() {
    this.playerEventsEnabled = false; // Disabled by default during startup
    this.gameStarted = false; // Track if game has fully started
    this.container = null;
    this._init();
  }

  _init() {
    const c = document.createElement('div');
    c.id = 'notification-center';
    c.style.cssText = 'position:fixed; top:14px; left:50%; transform:translateX(-50%); z-index:10040; display:flex; flex-direction:column; gap:8px; pointer-events:none;';
    document.body.appendChild(c);
    this.container = c;
  }

  showBanner(message, type = 'info') {
    const el = document.createElement('div');
    el.style.cssText = 'min-width:240px; max-width:80vw; padding:10px 14px; border-radius:10px; color:#fff; font-weight:600; box-shadow:0 12px 40px rgba(0,0,0,0.35); pointer-events:auto;';
    el.style.background = this._bg(type);
    el.textContent = message;
    this.container.appendChild(el);
    setTimeout(() => { el.style.transition = 'opacity .3s ease'; el.style.opacity = '0'; setTimeout(()=> el.remove(), 300); }, 2600);
  }

  chime(freq = 880, dur = 0.12, type = 'sine') {
    try {
      if (window.soundManager && window.soundManager.playBling) {
        window.soundManager.playBling({ frequency: freq, duration: dur, type });
        return;
      }
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.value = 0.06;
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      setTimeout(()=>{ osc.stop(); ctx.close(); }, dur*1000);
    } catch (_) {}
  }

  notifyPlayerJoined(name) {
    if (!this.playerEventsEnabled || !this.gameStarted) return;
    this.showBanner(`${name || 'Explorer'} entered the realm`, 'info');
    this.chime(1100, 0.12, 'triangle');
  }

  notifyPlayerBaseCreated(name) {
    if (!this.playerEventsEnabled || !this.gameStarted) return;
    this.showBanner(`${name || 'Explorer'} established a base`, 'success');
    this.chime(880, 0.14, 'sine');
  }

  // Method to enable notifications after game has fully started
  enableNotifications() {
    console.log('🔔 Enabling notifications - game has started');
    this.playerEventsEnabled = true;
    this.gameStarted = true;
  }

  // Method to disable notifications during startup
  disableNotifications() {
    console.log('🔔 Disabling notifications during startup');
    this.playerEventsEnabled = false;
    this.gameStarted = false;
  }

  _bg(type) {
    switch (type) {
      case 'success': return 'linear-gradient(135deg,#10b981,#059669)';
      case 'warning': return 'linear-gradient(135deg,#f59e0b,#d97706)';
      case 'error':   return 'linear-gradient(135deg,#ef4444,#dc2626)';
      default:        return 'linear-gradient(135deg,#3b82f6,#2563eb)';
    }
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { window.notificationCenter = new NotificationCenter(); });
} else {
  window.notificationCenter = new NotificationCenter();
}

console.log('🔔 NotificationCenter loaded');
