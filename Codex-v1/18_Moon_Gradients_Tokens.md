# 🌕 Moon Gradients — Design Tokens (Aurora Archives)

Lunar modes reflect phases and apex energy. Tokens derived from Moon Calendar + Immersion docs.

## Tokens
```css
:root {
  /* New Moon: deep indigo → midnight */
  --moon-new-start: #0B1020;
  --moon-new-end:   #111827;

  /* First Quarter: cobalt → violet */
  --moon-fq-start:  #1E3A8A;
  --moon-fq-end:    #6D28D9;

  /* Full Moon: silver → pale blue */
  --moon-full-start:#E5E7EB;
  --moon-full-end:  #BFDBFE;

  /* Last Quarter: teal → slate */
  --moon-lq-start:  #0E7490;
  --moon-lq-end:    #334155;

  /* Apex band glow */
  --moon-apex-glow: rgba(139, 92, 246, 0.35);
}

.moon-grad-new    { background: linear-gradient(160deg, var(--moon-new-start),  var(--moon-new-end)); }
.moon-grad-fq     { background: linear-gradient(160deg, var(--moon-fq-start),   var(--moon-fq-end)); }
.moon-grad-full   { background: linear-gradient(160deg, var(--moon-full-start), var(--moon-full-end)); }
.moon-grad-lq     { background: linear-gradient(160deg, var(--moon-lq-start),   var(--moon-lq-end)); }

/* Apex ring utility */
.moon-apex-ring {
  box-shadow: 0 0 24px var(--moon-apex-glow), inset 0 0 12px var(--moon-apex-glow);
}
```

## Usage
```html
<div class="moon-grad-full moon-apex-ring" style="border-radius:12px; padding:16px;">
  <!-- Full moon panel content -->
</div>
```

## Notes
- Respect prefers-reduced-motion: gradients static; no animated shifts.
- Pair with `MoonWidget` and `MoonCalendarModal` for consistent visual language.
- Apex days should add `.moon-apex-ring` to emphasize energy.
