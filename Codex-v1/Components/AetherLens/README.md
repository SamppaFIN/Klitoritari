# 🜂 ÆtherLens (Blueprint)

## Purpose
Opt-in analytics and insights (personal diary, public weather k≥50), export.

## Props
```ts
export interface AetherLensProps {
  scope: 'Off'|'Basic'|'Advanced';
  insights: {
    moodSeries: { t: string; mood: string }[];
    correlations: { phase: string; value: number }[];
  };
  onScopeChange?: (s: AetherLensProps['scope']) => void;
  onExport?: () => void;
}
```

## Example: AetherLensPanel.svelte
```svelte
<script lang="ts">
  export let scope: 'Off'|'Basic'|'Advanced' = 'Off';
  export let insights; export let onScopeChange = () => {}; export let onExport = () => {};
</script>

<section class="ael">
  <header>
    <h3>ÆtherLens</h3>
    <select bind:value={scope} on:change={() => onScopeChange(scope)}>
      <option>Off</option><option>Basic</option><option>Advanced</option>
    </select>
    <button on:click={onExport}>Export</button>
  </header>
  <div class="charts">
    <!-- placeholder charts -->
    <div class="chart">Mood 30d</div>
    <div class="chart">Moon Correlation</div>
  </div>
</section>

<style>
  .ael header{display:flex;gap:8px;align-items:center;justify-content:space-between}
  .charts{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  .chart{height:160px;background:#0f172a;border:1px solid #1f2937;border-radius:8px}
</style>
```

## API
```ts
// GET /api/ael/insights -> { insights, scope }
// PUT /api/ael/scope { scope }
// GET /api/ael/export -> file
```

## Tests (outline)
```ts
it('switches scope and persists', () => {/* … */});
it('exports data on click', () => {/* … */});
```
