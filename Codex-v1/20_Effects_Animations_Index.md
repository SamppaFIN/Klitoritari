---
brdc:
  id: COD-FX-020
  title: Effects & Animations Index (Catalog + Code References)
  owner: Aurora (AI)
  status: canonical
  version: 1.0.0
  last_updated: 2025-09-30
  self: shadowcomments/Codex-v1/20_Effects_Animations_Index.md
  lifecycle: read
  ideapaths:
    - label: particle-palettes-per-moon
      description: Match particle colors to lunar gradients
      status: exploring
  related:
    - shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
    - shadowcomments/Codex-v1/18_Moon_Gradients_Tokens.md
    - shadowcomments/Codex-v1/17_Monk_Muse_Sacred_Principles.md
  tags:
    - fx
    - motion
teaching:
  when_stuck:
    - Use CPU budgets; respect reduced motion
    - Link to owning component and reuse
  always:
    - Prefer tokens over hard-coded colors
    - Keep bursts celebratory, never blocking
changelog:
  - 2025-09-30: created index
  - 2025-09-30: added BRDC metadata
---

# ✨ Effects & Animations Index (Catalog + Code References)

Purpose: Centralize all visual effects and motion primitives used across the MVP. Each entry links to its owning component or design doc and includes a minimal code reference.

## Particles & Ambient

### Ambient Particles (background fog/embers)
- Owner: `07_Immersion_DesignSystem.md`, Components/Immersion
- Use: gentle ambience; respects reduced motion; parallax optional
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
class ParticlesAmbient implements Layer {
  private particles: Particle[] = [];
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  init(container: HTMLElement, settings: ImmersionSettings) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.pointerEvents = 'none';
    container.appendChild(this.canvas);
    this.seed();
    if (get(motionEnabled)) this.start();
  }
}
```

### Burst Particles (interaction celebrations)
- Owner: `07_Immersion_DesignSystem.md`, Components/Immersion
- Trigger: reaction add/double; event bus `reaction:burst`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
class ParticlesBursts implements Layer {
  private bursts: Burst[] = [];
  init(container: HTMLElement, settings: ImmersionSettings) {
    this.canvas = document.createElement('canvas');
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '10';
    container.appendChild(this.canvas);
    EventBus.on('reaction:burst', this.handleBurst.bind(this));
  }
}
```

## Ribbons & Tooltips

### Reaction Ribbon (11 archetypes, strength 1/2)
- Owner: Components/ReactionRibbon
- Interactions: click=1, dblclick/long-press=2
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/Components/ReactionRibbon/README.md
<nav class="ribbon">
  {#each types as t}
    <button class="rxn" on:click={() => onToggle(t, 1)} on:dblclick={() => onToggle(t, 2)}>
      <span class="icon" data-type={t} />
      <span class="count">{countsByType[t] || 0}</span>
    </button>
  {/each}
</nav>
```

### Tooltip Motion (context hints)
- Owner: `07_Immersion_DesignSystem.md`
- Motion: pulse/flow variants
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
.context-animation {
  animation: contextPulse 2s ease-in-out infinite;
}
@keyframes contextPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
}
```

## Aura & Profile

### AuraRing (base + micro-bands)
- Owner: Components/AuraRing
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/Components/AuraRing/README.md
<svg viewBox="0 0 100 100">
  <circle cx="50" cy="50" r={r} fill="none" stroke={color} stroke-width="8" />
  {#each bands as b,i}
    <circle cx="50" cy="50" r={r} fill="none" stroke={b.color} stroke-width="3" stroke-dasharray={`${b.width} ${100-b.width}`} />
  {/each}
</svg>
```

### Sacred Glow (global visual language)
- Owner: `07_Immersion_DesignSystem.md`, `17_Monk_Muse_Sacred_Principles.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
.sacred-glow {
  box-shadow: 0 0 20px var(--sacred-color);
  filter: brightness(1.2);
}
```

## Moon & Gradients

### Moon Widget (phase + countdown)
- Owner: Components/MoonCalendar
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/Components/MoonCalendar/README.md
<button class="moon-widget" on:click={onOpen} aria-label={`Moon ${phase}`}>
  <span class="moon-glyph" data-phase={phase} />
  <span class="illum">{illumination}%</span>
  <span class="countdown">{countdown}s</span>
</button>
```

### Moon Gradients & Apex Ring
- Owner: `18_Moon_Gradients_Tokens.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/18_Moon_Gradients_Tokens.md
.moon-grad-full   { background: linear-gradient(160deg, var(--moon-full-start), var(--moon-full-end)); }
.moon-apex-ring {
  box-shadow: 0 0 24px var(--moon-apex-glow), inset 0 0 12px var(--moon-apex-glow);
}
```

## Notifications & Pulses

### Aura Pulse for Activity
- Owner: `08_Notifications.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/08_Notifications.md
class AuraPulseRenderer {
  private pulses: AuraPulse[] = [];
  createPulse(intensity: number, color: string, duration: number = 2000) {
    const pulse: AuraPulse = { intensity, color, duration, frequency: 2 };
    this.pulses.push(pulse);
    this.startPulseAnimation(pulse);
  }
}
```

## Immersion Toggles & Context Animations

### Immersion Toggle Component
- Owner: `07_Immersion_DesignSystem.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
const ImmersionToggle: SvelteComponent = {
  props: ['layer', 'enabled', 'onToggle'],
  template: `
    <div class="immersion-toggle">
      <label class="toggle-label">
        <input type="checkbox" bind:checked={enabled} on:change={() => onToggle(layer, enabled)} />
        <span class="toggle-slider"></span>
        <span class="toggle-text">{layer.replace('_', ' ').toUpperCase()}</span>
      </label>
    </div>
  `
};
```

## Design Tokens

### Sun Gradient (day)
- Owner: `17_Monk_Muse_Sacred_Principles.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/17_Monk_Muse_Sacred_Principles.md
.sun-gradient {
  background: linear-gradient(135deg, var(--sun-start) 0%, var(--sun-mid) 50%, var(--sun-end) 100%);
}
```

### Consciousness Colors
- Owner: `07_Immersion_DesignSystem.md`
- Code (reference):
```startLine:endLine:shadowcomments/Codex-v1/07_Immersion_DesignSystem.md
const consciousnessColors = {
  1: { primary: '#ef4444', secondary: '#fca5a5', glow: 'rgba(239, 68, 68, 0.3)' },
  7: { primary: '#ec4899', secondary: '#f9a8d4', glow: 'rgba(236, 72, 153, 0.3)' }
};
```

---

## Usage Guidance
- Respect `prefers-reduced-motion` for all animations.
- Keep particle CPU budgets (ambient <1.5ms/frame; total <2ms/frame mid devices).
- Use gradients (sun/moon) as page-level atmospherics; avoid text backgrounds.
- Celebrate with bursts on positive actions; never block input latency.

## Related
- `07_Immersion_DesignSystem.md`
- `17_Monk_Muse_Sacred_Principles.md`
- `18_Moon_Gradients_Tokens.md`
- Components/ReactionRibbon, Components/MoonCalendar, Components/AuraRing, `08_Notifications.md`
