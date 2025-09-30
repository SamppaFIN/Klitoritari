# 💍 AuraRing (Blueprint)

## Purpose
Visualizes positivity/negativity; micro-bands for writer/supporter.

## Props
```ts
export interface AuraRingProps {
  color: string;                 // base aura color
  bands?: { color: string; width: number }[]; // micro-bands
  avatarUrl: string;
  size?: 'sm'|'md'|'lg';
}
```

## Example: AuraRing.svelte
```svelte
<script lang="ts">
  export let color = '#60a5fa';
  export let bands: { color: string; width: number }[] = [];
  export let avatarUrl = '';
  export let size: 'sm'|'md'|'lg' = 'md';
  const r = 45;
</script>

<div class={`aura ${size}`}>
  <svg viewBox="0 0 100 100">
    <circle cx="50" cy="50" r={r} fill="none" stroke={color} stroke-width="8" />
    {#each bands as b,i}
      <circle cx="50" cy="50" r={r} fill="none" stroke={b.color} stroke-width="3" stroke-dasharray={`${b.width} ${100-b.width}`} />
    {/each}
  </svg>
  <img class="avatar" {avatarUrl} alt="avatar" />
</div>

<style>
  .aura{position:relative;width:96px;height:96px}
  .aura.sm{width:64px;height:64px}.aura.lg{width:128px;height:128px}
  .avatar{position:absolute;inset:50% auto auto 50%;transform:translate(-50%,-50%);width:56%;height:56%;border-radius:50%}
</style>
```
