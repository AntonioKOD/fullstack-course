---
sidebar_position: 5
title: Performance Auditing
---

# Performance Auditing

Fast apps retain users. A 1-second delay in load time can reduce conversions by 7%. Lighthouse measures performance objectively — let's learn to interpret and improve the scores.

## Running Lighthouse

1. Open Chrome DevTools → Lighthouse tab
2. Select: Performance, Accessibility, Best Practices, SEO, PWA
3. Device: Mobile (harder target)
4. Click "Analyze page load"

Or run from CLI:

```bash
npx lighthouse https://yourapp.com --output html --output-path ./report.html
```

## Core Web Vitals

### LCP — Largest Contentful Paint

What: when the largest visible element finishes rendering.
Target: < 2.5 seconds.

Common causes and fixes:

```tsx
//  Slow LCP: hero image loads late
<img src="/hero.jpg" alt="Hero" />

// ✓ Fast LCP: preload and use modern formats
// In index.html:
<link rel="preload" as="image" href="/hero.webp" />

// In your component:
<img
  src="/hero.webp"
  alt="Hero"
  loading="eager"        // don't lazy-load the LCP element
  fetchpriority="high"   // hint to browser
  width={1200}
  height={600}
/>
```

### INP — Interaction to Next Paint

What: responsiveness to clicks and keyboard input.
Target: < 200ms.

```ts
//  Slow INP: blocking computation on click
function handleClick() {
  const result = expensiveComputation(data); // blocks main thread
  setState(result);
}

// ✓ Fast INP: move to Web Worker
const worker = new Worker('/workers/compute.js');
function handleClick() {
  worker.postMessage(data);
  worker.onmessage = (e) => setState(e.data);
}

// Or defer to next frame for long lists
function handleClick() {
  startTransition(() => {
    setState(processData(data)); // marked as non-urgent
  });
}
```

### CLS — Cumulative Layout Shift

What: how much elements move around during load.
Target: < 0.1.

```tsx
//  High CLS: image without dimensions (jumps when loaded)
<img src="/product.jpg" alt="Product" />

// ✓ No CLS: always specify width and height
<img src="/product.jpg" alt="Product" width={400} height={300} />

//  High CLS: font swap shifts text
// ✓ Use font-display: optional or preload fonts

//  High CLS: injecting content above existing content
// ✓ Reserve space with skeleton loaders
<div className="h-64 bg-gray-100 animate-pulse rounded" /> // skeleton
```

## Bundle Analysis

```bash
npm install -D rollup-plugin-visualizer
```

```ts
// vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({ open: true, gzipSize: true }), // opens treemap after build
  ],
});
```

```bash
npm run build  # opens stats.html in browser
```

Look for:
- Large dependencies you could replace (moment.js → date-fns)
- Duplicate packages
- Unintentional full imports (lodash → lodash-es with tree-shaking)

## Code Splitting

```tsx
//  All routes in one bundle
import { DashboardPage } from './pages/Dashboard';
import { ReportsPage } from './pages/Reports';

// ✓ Lazy-load heavy routes
import { lazy, Suspense } from 'react';
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const ReportsPage = lazy(() => import('./pages/Reports'));

// In your router
<Suspense fallback={<PageLoader />}>
  <Routes>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/reports" element={<ReportsPage />} />
  </Routes>
</Suspense>
```

## Image Optimization

```bash
npm install -D vite-imagetools
```

```tsx
import heroImage from './hero.jpg?w=800&format=webp&quality=80';

<img src={heroImage} alt="Hero" />
```

Or use responsive images:

```tsx
<picture>
  <source media="(min-width: 1024px)" srcSet="/hero-1200.webp" type="image/webp" />
  <source media="(min-width: 640px)" srcSet="/hero-800.webp" type="image/webp" />
  <img src="/hero-400.jpg" alt="Hero" width={400} height={300} />
</picture>
```

## React Performance

```tsx
// Memoize expensive computations
const sorted = useMemo(
  () => items.sort((a, b) => b.views - a.views),
  [items]
);

// Memoize callbacks passed to children
const handleDelete = useCallback(
  (id: string) => deleteItem(id),
  [deleteItem]
);

// Prevent unnecessary re-renders
const MemoizedCard = memo(ProductCard);

// Virtualize long lists (only render visible items)
import { useVirtualizer } from '@tanstack/react-virtual';
```

## Lighthouse Score Targets

| Score | Color | Meaning |
|-------|-------|---------|
| 90-100 | Green | Great |
| 50-89 | Orange | Needs improvement |
| 0-49 |  Red | Poor |

Aim for green (90+) on Performance, Accessibility, Best Practices, and SEO.
