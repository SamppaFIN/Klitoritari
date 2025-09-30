# 🔔 ActivityPanel / NotificationCenter (Blueprint)

## Purpose
Centralized activity (mentions, follows, replies, moderation) with filters and seen/unseen.

## Props
```ts
export interface ActivityItem { id: string; kind: 'mention'|'reply'|'follow'|'mod'; text: string; createdAt: string; seen?: boolean }
export interface ActivityPanelProps {
  items: ActivityItem[];
  filter?: 'all'|'mention'|'reply'|'follow'|'mod';
  onMarkSeen?: (id: string) => void;
  onMarkAll?: () => void;
}
```

## Example: ActivityPanel.svelte
```svelte
<script lang="ts">
  export let items = [];
  export let filter: string = 'all';
  export let onMarkSeen = (id: string) => {};
  export let onMarkAll = () => {};
  $: visible = items.filter(i => filter==='all' || i.kind===filter);
</script>

<section class="panel">
  <header>
    <h3>Activity</h3>
    <select bind:value={filter}>
      <option value="all">All</option><option>mention</option><option>reply</option><option>follow</option><option>mod</option>
    </select>
    <button on:click={onMarkAll}>Mark all seen</button>
  </header>
  <ul>
    {#each visible as i}
      <li class:unseen={!i.seen}>
        <span class="kind">{i.kind}</span>
        <span class="text">{i.text}</span>
        <button on:click={() => onMarkSeen(i.id)}>✓</button>
      </li>
    {/each}
  </ul>
</section>

<style>
  .panel header{display:flex;gap:8px;align-items:center;justify-content:space-between}
  li{display:flex;gap:8px;align-items:center;padding:6px;border-bottom:1px solid #1f2937}
  li.unseen{background:#0b1020}
</style>
```

## Tests (outline)
```ts
it('filters by type and marks all seen', () => {/* … */});
```
