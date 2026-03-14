---
sidebar_position: 6
title: Challenge — PWA Recipe App
---

# Challenge — PWA Recipe App

## Objective

Build a **Progressive Web App** for saving and browsing recipes. It must be installable, work offline, and score 90+ on Lighthouse.

## Requirements

### PWA Features (40 points)

- [ ] Web app manifest with correct icons (192px, 512px, maskable)
- [ ] Service worker registered via `vite-plugin-pwa`
- [ ] App is installable (passes Chrome's criteria)
- [ ] Offline fallback page when no cache is available
- [ ] Previously viewed recipes accessible offline
- [ ] Update prompt when a new version is deployed

### App Features (40 points)

- [ ] Browse recipes from [TheMealDB API](https://www.themealdb.com/api.php) (free, no key needed)
- [ ] Search recipes by name
- [ ] View recipe detail (ingredients, instructions, YouTube video link)
- [ ] Save recipes to favorites (stored in `localStorage`)
- [ ] Offline: favorites page works without internet

### Performance (20 points)

Lighthouse audit (in production build, `npm run preview`):

- [ ] Performance: ≥ 90
- [ ] Accessibility: ≥ 95
- [ ] Best Practices: ≥ 90
- [ ] SEO: ≥ 90
- [ ] PWA: all checks green

## Caching Strategy

```ts
// vite.config.ts
workbox: {
  runtimeCaching: [
    {
      // Cache API responses — network first, 1 hour TTL
      urlPattern: /^https:\/\/www\.themealdb\.com\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'mealdb-api',
        expiration: { maxEntries: 100, maxAgeSeconds: 3600 },
      },
    },
    {
      // Cache meal images — cache first, 7 days
      urlPattern: /^https:\/\/www\.themealdb\.com\/images\//,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mealdb-images',
        expiration: { maxEntries: 50, maxAgeSeconds: 7 * 24 * 3600 },
      },
    },
  ],
}
```

## Grading

| Criteria | Points |
|----------|--------|
| Manifest with icons | 10 |
| Service worker registered | 10 |
| App installable | 10 |
| Offline page | 5 |
| Offline access to cached recipes | 5 |
| Recipe list and search | 15 |
| Recipe detail page | 10 |
| Favorites with localStorage | 15 |
| Lighthouse Performance ≥ 90 | 10 |
| Lighthouse PWA all green | 10 |
| **Total** | **100** |

## Bonus

- Push notification when a new recipe category is added (mock the server side)
- Background sync: save a recipe while offline, sync to server when reconnected
- Share recipe via Web Share API: `navigator.share({ title, url })`
- Add to home screen custom prompt with install statistics tracking
