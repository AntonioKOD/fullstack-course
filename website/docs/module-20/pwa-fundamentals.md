---
sidebar_position: 2
title: PWA Fundamentals
---

# PWA Fundamentals

Three things make a PWA: a **web app manifest**, a **service worker**, and **HTTPS** (or localhost).

## Web App Manifest

The manifest is a JSON file that tells the browser how to display your app when installed:

```json
// public/manifest.json
{
  "name": "Recipe Book",
  "short_name": "Recipes",
  "description": "Your personal recipe collection",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#f59e0b",
  "orientation": "portrait-primary",
  "icons": [
    { "src": "/icons/icon-72.png", "sizes": "72x72", "type": "image/png" },
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    {
      "src": "/icons/icon-512-maskable.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    }
  ]
}
```

Link it in `index.html`:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#f59e0b" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

## Display Modes

| Mode | Behavior |
|------|----------|
| `standalone` | Looks like a native app — no browser UI |
| `fullscreen` | Full screen, no status bar (games) |
| `minimal-ui` | Browser chrome with minimal controls |
| `browser` | Regular browser tab |

## Installability Criteria

Chrome shows the "Install" prompt when:
1. App is served over HTTPS (or localhost)
2. `manifest.json` is present and linked
3. `name` and `short_name` are set
4. At least one 192×192 icon is present
5. A service worker is registered

Check in Chrome DevTools → Application → Manifest.

## Install Prompt

```ts
// Capture the install prompt for custom UI
let installPrompt: BeforeInstallPromptEvent | null = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  installPrompt = e as BeforeInstallPromptEvent;
});

// Show your custom install button
async function install() {
  if (!installPrompt) return;
  const result = await installPrompt.prompt();
  console.log('Install outcome:', result.outcome);
  installPrompt = null;
}
```

```tsx
// InstallButton.tsx
function InstallButton() {
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      window.__installPrompt = e as any;
      setCanInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!canInstall) return null;

  return (
    <button
      onClick={() => window.__installPrompt?.prompt()}
      className="btn-primary"
    >
       Install App
    </button>
  );
}
```

## Meta Tags for iOS

iOS Safari doesn't use the manifest for some properties:

```html
<!-- iOS-specific -->
<link rel="apple-touch-icon" href="/icons/icon-180.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-title" content="Recipes" />

<!-- Splash screens for various iPhone sizes -->
<link
  rel="apple-touch-startup-image"
  href="/splash/iphone12.png"
  media="(device-width: 390px)"
/>
```

## Testing Your Manifest

1. Chrome DevTools → Application → Manifest — check for errors
2. Lighthouse audit — "PWA" category
3. [web.dev/measure](https://web.dev/measure) — public URL analysis
4. Chrome DevTools → Application → Service Workers — view registration status
