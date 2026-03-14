---
sidebar_position: 2
title: Tailwind Setup
---

# Tailwind CSS Setup

## Installation with Vite

```bash
npm create vite@latest my-project -- --template vanilla
cd my-project
npm install
npm install -D tailwindcss @tailwindcss/vite
```

Configure Vite to use the Tailwind plugin:

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

Add the Tailwind import to your main CSS file:

```css title="src/style.css"
@import "tailwindcss";
```

That's it. No `tailwind.config.js` needed for basic use — Tailwind v4 auto-detects your template files.

## Customizing Your Design System

Define your design tokens inside the CSS file using `@theme`:

```css title="src/style.css"
@import "tailwindcss";

@theme {
  /* Custom colors */
  --color-brand: #3b82f6;
  --color-brand-dark: #1d4ed8;
  --color-surface: #f8fafc;

  /* Custom fonts */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Custom spacing */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}
```

These tokens become utility classes automatically:
- `text-brand` → `color: #3b82f6`
- `bg-surface` → `background-color: #f8fafc`
- `font-mono` → uses JetBrains Mono

## VS Code Setup

Install the **Tailwind CSS IntelliSense** extension — it gives you autocomplete, hover previews, and linting.

```bash
# In VS Code, open Extensions (Cmd+Shift+X) and search:
Tailwind CSS IntelliSense
```

Add to `.vscode/settings.json`:

```json
{
  "editor.quickSuggestions": {
    "strings": "on"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["cn\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

## Running the Dev Server

```bash
npm run dev
```

Open `http://localhost:5173` and start editing `index.html`.

## Verify It Works

```html title="index.html"
<body class="bg-gray-950 text-white min-h-screen flex items-center justify-center">
  <h1 class="text-4xl font-bold">Tailwind is working ✓</h1>
</body>
```

You should see a dark background with large white text.
