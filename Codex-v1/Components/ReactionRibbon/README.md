# 💠 ReactionRibbon (Blueprint)

## Purpose
11-type reaction palette with double-strength interactions and bursts.

## Props
```ts
export type ReactionType = 'rose'|'diamond'|'owl'|'health'|'science'|'comedy'|'sheriff'|'confusing'|'dislike'|'troll'|'coffin';
export interface ReactionRibbonProps {
  countsByType: Record<ReactionType, number>;
  onToggle?: (type: ReactionType, strength: 1|2) => void;
}
```

## Example: ReactionRibbon.svelte
```svelte
<script lang="ts">
  export let countsByType: Record<string, number> = {};
  export let onToggle = (t: string, s: 1|2) => {};
  const types = ['rose','diamond','owl','health','science','comedy','sheriff','confusing','dislike','troll','coffin'] as const;
</script>

<nav class="ribbon">
  {#each types as t}
    <button class="rxn" on:click={() => onToggle(t, 1)} on:dblclick={() => onToggle(t, 2)}>
      <span class="icon" data-type={t} />
      <span class="count">{countsByType[t] || 0}</span>
    </button>
  {/each}
</nav>

<style>
  .ribbon{display:flex;gap:8px;align-items:center}
  .rxn{display:grid;place-items:center;padding:6px 8px;border-radius:8px;background:#0b1020}
  .rxn:active{transform:scale(.97)}
</style>
```

## Events
- click -> strength 1
- double-click -> strength 2 (desktop) / long-press (mobile)

## Tests (outline)
```ts
it('emits strength 2 on dblclick', () => {/* … */});
```
