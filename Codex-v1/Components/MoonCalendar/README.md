# 🌙 MoonCalendar (Blueprint)

## Purpose
Lunar UI: always-visible icon, lite modal with apex bands, countdown, full-screen page.

## Props
```ts
export interface MoonWidgetProps {
  phase: string;           // e.g., 'First Quarter'
  illumination: number;    // 0..100
  apexInMs: number;        // countdown
  onOpen?: () => void;
}
```

## Example: MoonWidget.svelte
```svelte
<script lang="ts">
  export let phase: string;
  export let illumination: number;
  export let apexInMs: number;
  export let onOpen: () => void = () => {};
  $: countdown = Math.max(0, Math.floor(apexInMs/1000));
</script>

<button class="moon-widget" on:click={onOpen} aria-label={`Moon ${phase}`}>
  <span class="moon-glyph" data-phase={phase} />
  <span class="illum">{illumination}%</span>
  <span class="countdown">{countdown}s</span>
</button>

<style>
  .moon-widget{display:flex;gap:6px;align-items:center}
  .moon-glyph{width:16px;height:16px;border-radius:50%;background:radial-gradient(#fff,#99f)}
</style>
```

## Example: MoonCalendarModal.svelte
```svelte
<script lang="ts">
  export let monthDays: { date: string; phase: string; isApex: boolean }[] = [];
  export let onClose: () => void = () => {};
</script>

<div class="modal">
  <header>
    <h3>Moon Calendar</h3>
    <button on:click={onClose}>×</button>
  </header>
  <div class="grid">
    {#each monthDays as d}
      <div class="cell" class:apex={d.isApex} title={`${d.date} — ${d.phase}`}>
        <span class="dot" />
      </div>
    {/each}
  </div>
</div>

<style>
  .grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px}
  .cell{aspect-ratio:1/1;background:#0b1020;border-radius:6px;display:grid;place-items:center}
  .cell.apex{outline:2px solid #8b5cf6}
  .dot{width:8px;height:8px;border-radius:50%;background:#cbd5e1}
</style>
```

## API
```ts
// GET /api/moon/month?yyyy-mm
// Returns: { days: { date, phase, isApex, illumination }[] }
```

## Tests (outline)
```ts
it('renders apex rings on apex days', () => {/* … */});
it('shows countdown on widget', () => {/* … */});
```
