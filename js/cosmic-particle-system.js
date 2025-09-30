/**
 * Cosmic Particle System
 * Ambient and Burst layers for visual immersion
 */

class CosmicParticleSystem {
  constructor() {
    this.enabled = true;
    this.layers = {
      ambient: null,
      bursts: null,
    };
    this.container = null;
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;

    this._init();
  }

  _init() {
    const mapEl = document.getElementById('map');
    if (!mapEl) {
      console.warn('CosmicParticleSystem: #map not found');
      return;
    }

    this.container = document.createElement('div');
    this.container.style.position = 'absolute';
    this.container.style.inset = '0';
    this.container.style.pointerEvents = 'none';
    this.container.style.zIndex = '2';

    this.canvas = document.createElement('canvas');
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    mapEl.appendChild(this.container);

    this.ctx = this.canvas.getContext('2d');
    this._resize();
    window.addEventListener('resize', () => this._resize());

    this._initAmbient();
    this.start();
  }

  _resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    if (this.ctx) this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  _initAmbient() {
    // Create a gentle field of drifting particles
    const count = 60;
    this.particles = new Array(count).fill(0).map(() => this._spawnParticle());
  }

  _spawnParticle(center) {
    const w = this.canvas?.width || 800;
    const h = this.canvas?.height || 600;
    const px = center?.x ?? Math.random() * w;
    const py = center?.y ?? Math.random() * h;

    return {
      x: px,
      y: py,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.8 + Math.random() * 1.6,
      life: 0,
      maxLife: 600 + Math.random() * 600,
      hue: 260 + Math.random() * 60, // purples/blues
      alpha: 0.25 + Math.random() * 0.35,
    };
  }

  start() {
    if (this.animationId) return;
    const loop = () => {
      if (!this.enabled || !this.ctx) return;
      this._tick();
      this.animationId = requestAnimationFrame(loop);
    };
    this.animationId = requestAnimationFrame(loop);
  }

  stop() {
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.animationId = null;
  }

  _tick() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Clear with subtle fade for trails
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.clearRect(0, 0, w, h);

    // Draw particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      // Update
      p.x += p.vx;
      p.y += p.vy;
      p.life += 1;
      if (p.life > p.maxLife) {
        this.particles[i] = this._spawnParticle();
        continue;
      }
      // Wrap
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Render
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  triggerBurst(screenX, screenY, options = {}) {
    // Add a short-lived cluster of brighter particles
    const count = options.count || 24;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
      const speed = 0.8 + Math.random() * 1.6;
      const p = this._spawnParticle({ x: screenX, y: screenY });
      p.vx = Math.cos(angle) * speed;
      p.vy = Math.sin(angle) * speed;
      p.r = 1.2 + Math.random() * 2.2;
      p.alpha = 0.4 + Math.random() * 0.4;
      p.maxLife = 120 + Math.random() * 80;
      p.hue = options.hue ?? (Math.random() < 0.5 ? 200 + Math.random() * 80 : 260 + Math.random() * 40);
      this.particles.push(p);
    }
  }

  setEnabled(enabled) {
    this.enabled = enabled;
    if (enabled) this.start();
    else this.stop();
  }
}

// Bootstrap
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.particleSystem = new CosmicParticleSystem();
  });
} else {
  window.particleSystem = new CosmicParticleSystem();
}

console.log('✨ CosmicParticleSystem loaded');
