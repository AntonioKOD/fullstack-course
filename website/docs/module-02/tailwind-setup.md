---
sidebar_position: 2
title: Tailwind Setup
---

# Tailwind CSS Setup

:::info Learning Objectives
By the end of this lesson you will be able to:

- Explain what the Tailwind JIT compiler does and why it replaced the old purge step
- Set up Tailwind CSS in a Vite project using the official Vite plugin
- Define custom design tokens (colors, fonts, spacing) using the `@theme` block
- Verify your setup is working and configure VS Code for autocomplete
:::

## Why Does Tailwind Need a Build Step?

Before we install anything, it is worth understanding what Tailwind actually does under the hood — because it is different from a traditional CSS framework.

When you write `<div class="bg-blue-500 p-4 text-white">`, there is no pre-existing CSS file that contains `.bg-blue-500`, `.p-4`, and `.text-white` waiting to be downloaded. Tailwind generates those class definitions *on demand* by scanning your HTML, JavaScript, and template files for class names it recognizes.

This happens through the **Just-in-Time (JIT) compiler**. Think of it like a custom tailor: instead of shipping every possible suit in every possible size, the tailor watches which suits you actually order and sews only those. The result is a CSS file that contains only what your project uses — often just a few kilobytes.

The old way (before JIT, before v3) was to generate a massive CSS file with every possible utility class (~3MB), then run a separate "purge" step to strip out the ones you did not use. The JIT approach flips this: it generates only what you use, as you use it, in real time during development.

:::tip The mental model
Tailwind is not a stylesheet you download. It is a program that reads your code and writes the CSS for you. The "stylesheet" is the output of that program.
:::

## Installing Tailwind with Vite

Start by creating a fresh Vite project (or use your existing Module 01 project):

```bash
npm create vite@latest my-project -- --template vanilla
cd my-project
npm install
npm install -D tailwindcss @tailwindcss/vite
```

The `@tailwindcss/vite` package is the Vite plugin that wires Tailwind's JIT compiler into Vite's build pipeline. Without it, Vite would not know to process Tailwind directives.

Next, tell Vite to use the plugin by editing (or creating) `vite.config.ts`:

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

This registers Tailwind as a Vite plugin. Now any CSS file that contains `@import "tailwindcss"` will be processed by the JIT compiler.

Finally, add the Tailwind import to your main CSS file:

```css title="src/style.css"
@import "tailwindcss";
```

This single line replaces what would have been three separate `@tailwind base`, `@tailwind components`, `@tailwind utilities` directives in older versions. Tailwind v4 consolidates it all into one import.

That is the entire setup. In Tailwind v4 there is no `tailwind.config.js` file required for basic use — the JIT compiler auto-detects your template files by scanning the project directory.

:::warning Common Mistake
Do not forget to import `style.css` in your `main.js` or `index.html`. Tailwind classes will appear in your HTML but nothing will render if the stylesheet is not loaded. Check your `main.ts` for `import './style.css'` or add a `<link>` tag in your HTML.
:::

## What the Content Scanning Does

In Tailwind v3, you had to tell Tailwind where your template files were so it could scan them for class names:

```js
// tailwind.config.js (v3 style — you do NOT need this in v4)
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts}'],
}
```

In v4, the Vite plugin handles this automatically. It watches all files in your project directory and rebuilds whenever it detects a new class name being used.

This matters because if a class name never appears in any file Tailwind scans, it will not appear in the generated CSS. That is the entire mechanism behind the tiny bundle size. The implication for you: **always write complete class names, never build them dynamically from string concatenation.**

```js
// This WILL NOT work — Tailwind cannot find "bg-red-500" in a scan
const color = 'red'
element.className = `bg-${color}-500`

// This WILL work — the full class name appears literally in the source
element.className = 'bg-red-500'
```

## Customizing Your Design System

Tailwind's default palette and spacing scale are excellent starting points, but real projects have brand colors and specific type scales. In v4, you define your design tokens inside the CSS file itself using the `@theme` block — no separate config file needed.

```css title="src/style.css"
@import "tailwindcss";

@theme {
  /* Brand colors */
  --color-brand: #3b82f6;
  --color-brand-dark: #1d4ed8;
  --color-surface: #f8fafc;
  --color-surface-dark: #0f172a;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;

  /* Custom spacing values */
  --spacing-18: 4.5rem;
  --spacing-22: 5.5rem;
}
```

Once you define a token, Tailwind automatically generates the corresponding utility classes. You do not need to write any additional configuration:

| Token defined | Classes you get |
|---|---|
| `--color-brand: #3b82f6` | `text-brand`, `bg-brand`, `border-brand` |
| `--color-surface: #f8fafc` | `text-surface`, `bg-surface`, `border-surface` |
| `--font-mono: 'JetBrains Mono'` | `font-mono` |
| `--spacing-18: 4.5rem` | `p-18`, `m-18`, `w-18`, `h-18`, etc. |

This is much cleaner than the v3 approach of editing a JavaScript config object. Your design tokens live next to your CSS, in a format that is easy to read and edit.

:::tip Why design tokens matter
If you define `--color-brand: #3b82f6` once and use `bg-brand` everywhere, changing the brand color later is a one-line edit. If you have `bg-blue-500` scattered across 40 files, you have a search-and-replace project. This is the same principle as CSS custom properties — Tailwind's `@theme` is just a structured way to create them.
:::

## CDN Approach for Quick Experiments

If you want to try Tailwind without any build step — for a quick prototype, a CodePen, or a single HTML file — there is a CDN option:

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-950 text-white p-8">
  <h1 class="text-4xl font-bold">Hello from Tailwind CDN</h1>
</body>
</html>
```

The CDN script runs Tailwind's JIT compiler directly in the browser. It is convenient but has real limitations: it is slower than the build step (compiles on every page load), does not work offline, cannot use the `@theme` customizations from a CSS file, and is not suitable for production.

**Use the CDN for experiments. Use the Vite plugin for real projects.**

:::warning Common Mistake
Students sometimes start a project with the CDN approach and then try to "switch to npm" partway through. The CDN and the Vite plugin are configured differently — custom colors that work in one do not automatically work in the other. Pick the Vite plugin from the start for any project that will grow.
:::

## VS Code Setup

The **Tailwind CSS IntelliSense** extension is not optional — it is a force multiplier that makes working with Tailwind dramatically faster. Install it from the VS Code Extensions panel (Cmd+Shift+X on Mac, Ctrl+Shift+X on Windows/Linux) by searching for "Tailwind CSS IntelliSense".

What the extension gives you:
- **Autocomplete**: type `bg-` and see every background color with a swatch
- **Hover previews**: hover over `p-4` and see the actual CSS it generates
- **Linting**: warns you when you apply two conflicting utilities to the same property
- **Sorting**: can automatically sort your utility classes in a consistent order

Add this to your `.vscode/settings.json` to enable autocomplete inside template strings (useful when you reach the JavaScript modules):

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

The `classRegex` lines tell the extension to provide autocomplete inside `clsx()` and `cn()` function calls, which you will encounter in Module 05 when building React components.

## Running the Dev Server

```bash
npm run dev
```

Open `http://localhost:5173`. Vite starts a development server with Hot Module Replacement (HMR), which means changes to your HTML or CSS appear in the browser instantly without a full page reload.

## Verifying the Setup

Open `index.html` and replace the `<body>` content with this:

```html title="index.html"
<body class="bg-gray-950 text-white min-h-screen flex items-center justify-center">
  <h1 class="text-4xl font-bold">Tailwind is working</h1>
</body>
```

You should see a dark background with large white centered text. If the page is unstyled (white background, black text in the default browser font), something in the setup is broken. Check:

1. Is `@import "tailwindcss"` in `src/style.css`?
2. Is `import './style.css'` in `main.ts` (or a `<link>` in `index.html`)?
3. Is the Vite plugin registered in `vite.config.ts`?

:::warning Common Mistake
If you see the text but no background color, you probably have `@import "tailwindcss"` in your CSS file but the CSS file is not linked in your HTML. The import statement is processed by the build tool — it has no effect if the CSS file itself is never loaded by the browser.
:::

## Scaffolded Activity

Start a fresh Vite project (or use your Module 01 project) and complete the Tailwind setup from scratch without looking at the steps above.

**Starter checklist:**
1. Create the Vite project with `npm create vite@latest`
2. Install `tailwindcss` and `@tailwindcss/vite`
3. Configure `vite.config.ts`
4. Add `@import "tailwindcss"` to the CSS file
5. Verify the CSS file is linked in your HTML
6. Install the VS Code extension

**Success check:** Your verification snippet (`bg-gray-950 text-white min-h-screen flex items-center justify-center`) renders a dark centered page. Then add this to your `@theme` block:

```css
@theme {
  --color-brand: #7c3aed;
}
```

If `class="bg-brand"` on a div gives you a purple background, your custom tokens are working.

## Key Takeaways

- When you want to try Tailwind without a build step, use the CDN approach — but switch to the Vite plugin before your project grows.
- When you need a custom brand color or font, define it in the `@theme` block in your CSS file, because Tailwind v4 will generate the utility classes automatically.
- When Tailwind classes appear to do nothing, check that your CSS file is actually imported — the JIT compiler works, but only if the output reaches the browser.
- When you write dynamic class names using string interpolation, the JIT scanner cannot find them — always use complete, literal class name strings.
