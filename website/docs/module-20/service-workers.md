---
sidebar_position: 3
title: Service Workers
---

# Service Workers

A service worker is a JavaScript file that runs in the background, separate from your app. It intercepts network requests, enabling offline support, background sync, and push notifications.

## Lifecycle

```
Register → Install → Activate → Idle ↔ Fetch
                                  ↓
                               Terminated
```

1. **Register** — your app registers the service worker
2. **Install** — SW downloads and caches assets
3. **Activate** — SW takes control (old SW is replaced)
4. **Fetch** — SW intercepts every network request

## Caching Strategies

### Cache First (offline-first)

Serve from cache, fall back to network. Best for: static assets, app shell.

```ts
self.addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(
    caches.open('v1').then(async (cache) => {
      const cached = await cache.match(event.request);
      if (cached) return cached;

      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    })
  );
});
```

### Network First (fresh data)

Try network, fall back to cache. Best for: API responses, dynamic content.

```ts
async function networkFirst(request: Request): Promise<Response> {
  const cache = await caches.open('api-cache');
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    return new Response('Offline', { status: 503 });
  }
}
```

### Stale While Revalidate

Serve cache immediately, update cache in background. Best for: images, fonts, non-critical data.

```ts
async function staleWhileRevalidate(request: Request): Promise<Response> {
  const cache = await caches.open('assets');
  const cached = await cache.match(request);

  const networkPromise = fetch(request).then(response => {
    cache.put(request, response.clone());
    return response;
  });

  return cached ?? networkPromise;
}
```

## Writing a Service Worker

```ts
// public/sw.ts (will be at /sw.js after build)
const CACHE_NAME = 'app-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
];

// Install — precache the app shell
self.addEventListener('install', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  (self as ServiceWorkerGlobalScope).skipWaiting();
});

// Activate — clean up old caches
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    )
  );
  (self as ServiceWorkerGlobalScope).clients.claim();
});

// Fetch — route requests
self.addEventListener('fetch', (event: FetchEvent) => {
  const { request } = event;
  const url = new URL(request.url);

  // App shell — cache first
  if (url.pathname === '/' || url.pathname.endsWith('.html')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Static assets — cache first
  if (request.destination === 'script' || request.destination === 'style') {
    event.respondWith(cacheFirst(request));
    return;
  }

  // API calls — network first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Default — stale while revalidate
  event.respondWith(staleWhileRevalidate(request));
});
```

## Registering the Service Worker

```ts
// src/main.tsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => console.log('SW registered:', registration.scope),
      (error) => console.error('SW registration failed:', error)
    );
  });
}
```

## Push Notifications

```ts
// Request permission
const permission = await Notification.requestPermission();
if (permission !== 'granted') return;

// Subscribe to push
const subscription = await registration.pushManager.subscribe({
  userVisibleOnly: true,
  applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
});

// Send subscription to server
await fetch('/api/push/subscribe', {
  method: 'POST',
  body: JSON.stringify(subscription),
});
```

```ts
// In service worker — handle push
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json();
  event.waitUntil(
    (self as ServiceWorkerGlobalScope).registration.showNotification(
      data.title,
      { body: data.body, icon: '/icons/icon-192.png' }
    )
  );
});
```

## Background Sync

Queue actions when offline, replay when online:

```ts
// Register sync
async function saveOfflineAction(data: unknown) {
  const db = await openDB('actions', 1);
  await db.add('pending', data);
  await navigator.serviceWorker.ready;
  await (await navigator.serviceWorker.ready).sync.register('sync-actions');
}

// In service worker
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-actions') {
    event.waitUntil(syncPendingActions());
  }
});
```
