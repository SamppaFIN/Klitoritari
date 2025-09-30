# 📱 Mobile-First User Tests

Scope: Validate MVP on mobile devices first. Focus on touch targets, performance, accessibility, and critical paths.

## Test Matrix (Devices/Viewports)
- 360x640 (Android small)
- 390x844 (iPhone 12/13/14)
- 414x896 (Plus/Max)
- 768x1024 (iPad portrait)

## Scenarios & Acceptance Criteria

### 1) Reaction Ribbon (mobile variant)
- AC:
  - Touch targets ≥44px
  - Long-press toggles strength 2
  - Ribbon does not overlap input fields
  - 60fps during scroll while ribbon visible

### 2) Moon Widget + Modal
- AC:
  - Always-visible widget is tappable
  - Modal opens within 200ms
  - Apex bands visible; countdown updates every second
  - Full-screen calendar toggles and is scrollable

### 3) AetherLens Panel
- AC:
  - Scope selector operable via touch
  - Export button reachable and triggers action
  - Charts degrade gracefully on low-end devices

### 4) Activity Panel / Notification Center
- AC:
  - Filter dropdown reachable
  - Mark-all-seen works; items render as seen without reload
  - Infinite list does not jank (virtualization or pagination)

### 5) Mentions & Block
- AC:
  - @mention suggestions appear; selectable via touch
  - Block/unblock reachable; updates UI optimistically

### 6) Feeds & Search
- AC:
  - Input + filters usable without zoom
  - Results load <100ms p95 on cached datasets
  - Scrolling remains smooth with images disabled

### 7) Profiles & AuraRing
- AC:
  - AuraRing renders at 60fps; no layout shift
  - Tabs reachable; content lazy-loads

### 8) Immersion Layers
- AC:
  - Reduced motion respected by system setting
  - Particles pause when tab/backgrounded

## Performance Gates
- TTI < 3.5s
- LCP < 2.5s
- FID < 100ms
- CLS < 0.1

## Accessibility Gates
- Screen reader labels on all controls
- Sufficient contrast in dark mode
- Keyboard navigation fallback (Bluetooth keyboards)

## Test Scripts (Playwright snippets)
```ts
import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 } });

test('moon widget opens modal fast', async ({ page }) => {
  await page.goto('/');
  const t0 = Date.now();
  await page.getByRole('button', { name: /moon/i }).click();
  await expect(page.getByRole('dialog', { name: /moon/i })).toBeVisible();
  expect(Date.now() - t0).toBeLessThan(200);
});

test('reaction long-press strength 2', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('.rxn').first();
  await btn.dispatchEvent('pointerdown');
  await page.waitForTimeout(550);
  await btn.dispatchEvent('pointerup');
  // assert strength 2 event (implementation-specific)
});
```
