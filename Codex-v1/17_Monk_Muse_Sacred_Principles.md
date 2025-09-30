# 🧘 Monk Muse — Sacred Principles (Do It Once, Beautifully)

## Ethos
- Presence over haste: measure twice, ship once.
- Fewer, better primitives: reuse and refine; avoid bespoke UI.
- Motion with meaning: animation guides attention, never distracts.
- Kind defaults: privacy, accessibility, energy-awareness by default.
- Silent reliability: fast, resilient, observable, humble.

## Practice
- DB-first modeling; tighten invariants at the source.
- TDD/BRDC: tests first; bugs as tickets; green then refactor.
- Performance budgets enforced; degrade gracefully.
- Document the why; code expresses the how.
- Small surfaces, strong contracts; components not pages.

## Visual Language
- Sacred glows > harsh alerts.
- Soft gradients for life and warmth.
- Particle whispers, not storms.
- Space to breathe: 8/12/16 rhythm; no crowding.

## Accessibility
- Contrast ≥ AA; text resizes without breaking.
- Motion-respect: prefers-reduced-motion gates.
- Touch targets ≥44px; keyboard parity.
- Announce context changes for screen readers.

## Performance
- Interaction feedback ≤100ms; modal open ≤200ms.
- 60fps scroll; no CLS.
- Pause work when hidden; idle-priority tasks.

## Sun Gradient (Design Token)
```css
:root {
  --sun-start: #FDE047;  /* warm yellow */
  --sun-mid:   #FDBA74;  /* soft orange */
  --sun-end:   #F472B6;  /* rosy pink */
}

.sun-gradient {
  background: linear-gradient(135deg, var(--sun-start) 0%, var(--sun-mid) 50%, var(--sun-end) 100%);
}

/* Elevated sun ring */
.sun-ring {
  background: radial-gradient(circle at 50% 50%, rgba(253, 224, 71, 0.6) 0%, rgba(253, 186, 116, 0.0) 60%);
  filter: drop-shadow(0 0 24px rgba(253, 224, 71, 0.35));
}
```

## Component Contracts (Monk Muse Gate)
- Public props named for meaning, not mechanics.
- Events describe intent, not DOM details.
- Slots for extensibility; no DOM leaks.
- Styles via tokens; no hard-coded colors.

## Review Ritual
- Read the Base Scroll section.
- Check BRDC gates.
- Run mobile-first tests.
- Lint + type-check = zero warnings.
- Ask: does it heal confusion? does it conserve energy? does it delight?
