/**
 * Aura Pulse System
 * Visual feedback for key events (steps, base creation, milestones)
 */

class AuraPulseSystem {
  constructor() {
    this.enabled = true;
    this.container = null;
    this._init();
  }

  _init() {
    this.container = document.createElement('div');
    this.container.id = 'aura-pulse-container';
    this.container.style.position = 'fixed';
    this.container.style.inset = '0';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '1000';
    document.body.appendChild(this.container);
  }

  setEnabled(enabled) {
    this.enabled = enabled;
  }

  pulse(options = {}) {
    if (!this.enabled) return;
    const { color = '#8b5cf6', size = 240, duration = 900, x, y } = options;

    const el = document.createElement('div');
    const px = x ?? window.innerWidth * 0.5;
    const py = y ?? window.innerHeight * 0.5;

    el.style.position = 'absolute';
    el.style.left = px - size / 2 + 'px';
    el.style.top = py - size / 2 + 'px';
    el.style.width = size + 'px';
    el.style.height = size + 'px';
    el.style.borderRadius = '50%';
    el.style.boxShadow = `0 0 0 0 ${this._hexToRgba(color, 0.5)}`;
    el.style.transform = 'scale(0.5)';
    el.style.opacity = '0.0';
    el.style.transition = `transform ${duration}ms ease-out, opacity ${duration}ms ease-out, box-shadow ${duration}ms ease-out`;

    this.container.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = 'scale(1.6)';
      el.style.opacity = '1';
      el.style.boxShadow = `0 0 60px 8px ${this._hexToRgba(color, 0.35)}`;
    });

    setTimeout(() => {
      el.style.opacity = '0';
      el.style.boxShadow = `0 0 0 0 ${this._hexToRgba(color, 0.0)}`;
      setTimeout(() => el.remove(), 300);
    }, duration);
  }

  _hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.auraPulseSystem = new AuraPulseSystem();
  });
} else {
  window.auraPulseSystem = new AuraPulseSystem();
}

console.log('💜 AuraPulseSystem loaded');
