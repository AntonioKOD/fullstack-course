---
sidebar_position: 4
title: Vite PWA Plugin
---

# Vite PWA Plugin

Writing service workers manually is complex. `vite-plugin-pwa` generates them automatically using **Workbox** — Google's service worker library.

## Installation

```bash
npm install -D vite-plugin-pwa
```

## Basic Configuration

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate', // or 'prompt'
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Recipe Book',
        short_name: 'Recipes',
        description: 'Your personal recipe collection',
        theme_color: '#f59e0b',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Pre-cache everything in the build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],

        // Runtime caching rules
        runtimeCaching: [
          {
            // Cache API responses for 1 hour
            urlPattern: /^https:\/\/api\.example\.com\//,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60, // 1 hour
              },
            },
          },
          {
            // Cache images for 30 days
            urlPattern: /\.(png|jpg|jpeg|gif|webp|svg)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
              },
            },
          },
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts' },
          },
        ],
      },
    }),
  ],
});
```

## Update Flow

When you deploy a new version, existing users have the old SW installed. Handle updates gracefully:

```ts
// vite.config.ts
VitePWA({
  registerType: 'prompt', // don't auto-update — show a prompt
})
```

```tsx
// src/components/UpdatePrompt.tsx
import { useRegisterSW } from 'virtual:pwa-register/react';

export function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered:', r);
    },
  });

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white border shadow-lg rounded-lg p-4 flex items-center gap-4">
      <p className="text-sm">A new version is available!</p>
      <button
        onClick={() => updateServiceWorker(true)}
        className="btn-primary text-sm"
      >
        Update
      </button>
      <button
        onClick={() => setNeedRefresh(false)}
        className="text-gray-500 text-sm"
      >
        Later
      </button>
    </div>
  );
}
```

## Offline Page

```html
<!-- public/offline.html -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Offline — Recipe Book</title>
  <style>
    body { font-family: sans-serif; display: flex; flex-direction: column;
           align-items: center; justify-content: center; min-height: 100vh;
           text-align: center; color: #333; }
    h1 { font-size: 2rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1> You're Offline</h1>
  <p>Please check your internet connection and try again.</p>
  <button onclick="location.reload()">Try Again</button>
</body>
</html>
```

```ts
// vite.config.ts — serve offline.html when network fails
workbox: {
  navigateFallback: '/offline.html',
  navigateFallbackDenylist: [/^\/api\//], // don't fallback API requests
}
```

## TypeScript Types

```bash
npm install -D @vite-pwa/assets-generator
```

Add types reference in `vite-env.d.ts`:

```ts
/// <reference types="vite-plugin-pwa/client" />
```

This enables autocompletion for `virtual:pwa-register` imports.

## Testing PWA

1. Run `npm run build && npm run preview`
2. Chrome DevTools → Application → Service Workers
3. Check "Offline" checkbox — page should still load
4. DevTools → Application → Manifest — should show green checkmarks
5. Run Lighthouse audit (PWA category)
