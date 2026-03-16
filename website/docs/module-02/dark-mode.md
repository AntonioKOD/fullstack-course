---
sidebar_position: 5
title: Dark Mode
---

# Dark Mode with Tailwind

:::info Learning Objectives
By the end of this lesson you will be able to:

- Use `dark:` variant classes to define alternate styles for dark mode
- Configure Tailwind to use either OS preference (`media`) or a manual class toggle (`class`) for dark mode
- Write JavaScript that adds and removes the `dark` class on the `<html>` element
- Persist the user's dark mode preference in `localStorage` so it survives page refreshes
:::

## What Is the `dark:` Variant?

You already know that `hover:` applies a style only when the user hovers. The `dark:` variant works the same way — it applies a style only when dark mode is active:

```html
<div class="bg-white dark:bg-gray-900">
  I'm white in light mode, dark gray in dark mode
</div>
```

The question is: what makes dark mode "active"? Tailwind supports two answers:

1. **Media mode**: dark mode is active when the user's operating system is set to dark theme (via the `prefers-color-scheme: dark` CSS media query)
2. **Class mode**: dark mode is active when the `<html>` element has a `dark` class applied to it

The difference is control. Media mode is automatic and requires zero JavaScript — perfect for sites where you want to respect the user's OS setting and nothing more. Class mode gives you a toggle button, which most modern apps want.

## Approach 1: Media Mode (Automatic, OS-Based)

This is the simpler approach. Tailwind reads the user's OS preference and activates `dark:` classes automatically.

```css title="src/style.css"
@import "tailwindcss";

@theme {
  --dark-mode: media;
}
```

With this configuration, every `dark:` class activates when the OS is in dark mode:

```html
<body class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">

  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <h1 class="text-gray-900 dark:text-white font-bold text-xl">My App</h1>
  </header>

  <main class="p-8">
    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
      <p class="text-gray-700 dark:text-gray-300">Card content that adapts automatically.</p>
    </div>
  </main>

</body>
```

The `transition-colors duration-200` on the `<body>` makes the switch smooth when the OS theme changes — without it, the switch is an instant flash.

**When to use media mode:** informational sites, documentation, personal portfolios, any context where following the OS preference is sufficient and a manual toggle is unnecessary complexity.

## Approach 2: Class Mode (Manual Toggle)

Most apps want a toggle button. Class mode lets you control dark mode with JavaScript by adding and removing a `dark` class on the `<html>` element.

```css title="src/style.css"
@import "tailwindcss";

@theme {
  --dark-mode: class;
}
```

With this setting, `dark:` classes only activate when `<html class="dark">` is present. Toggle the class to switch modes:

```html
<html lang="en">  <!-- no class = light mode -->
<!-- OR -->
<html lang="en" class="dark">  <!-- .dark = dark mode -->
```

Here is the JavaScript to wire up a toggle button:

```ts title="src/theme.ts"
const themeToggle = document.getElementById('theme-toggle')!;
const html = document.documentElement; // the <html> element

// On page load, restore the saved preference.
// If no preference has been saved, check the OS setting as a fallback.
function applyTheme() {
  const saved = localStorage.getItem('theme');

  if (saved === 'dark') {
    html.classList.add('dark');
  } else if (saved === 'light') {
    html.classList.remove('dark');
  } else {
    // No saved preference — fall back to OS setting
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    }
  }
}

// Toggle between light and dark on button click
themeToggle.addEventListener('click', () => {
  const isDark = html.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Apply theme immediately when the page loads
applyTheme();
```

Let's walk through what this does. On page load, `applyTheme()` runs first. It checks `localStorage` for a saved theme value. If the user has explicitly chosen dark mode before, it applies it. If they have chosen light mode, it leaves the class off. If there is no saved preference at all (a first-time visitor), it checks their OS setting as a sensible default. This three-way check means the behavior is always predictable.

The toggle button handler uses `classList.toggle('dark')` which returns `true` if the class was added, `false` if it was removed. It immediately saves this new preference to `localStorage`.

:::warning Common Mistake
Applying the theme script at the bottom of the `<body>` (which is common practice for JavaScript). For theme toggling, this causes a "flash of wrong theme" — the page renders white first, then flickers to dark. Put the theme initialization in a `<script>` tag in the `<head>` so it runs before the page paints. Import other JavaScript at the bottom as usual, but theme detection is the exception.
:::

## The Dark Mode Pairing Pattern

Dark mode requires thinking in pairs. Every element that has a light-mode style needs a corresponding dark-mode override. The pattern is consistent enough that it becomes muscle memory:

```
Light mode value → Dark mode value
bg-white         → dark:bg-gray-900
bg-gray-50       → dark:bg-gray-950
bg-gray-100      → dark:bg-gray-800
text-gray-900    → dark:text-white (or dark:text-gray-100)
text-gray-600    → dark:text-gray-400
text-gray-500    → dark:text-gray-500 (medium gray works in both)
border-gray-200  → dark:border-gray-700
border-gray-100  → dark:border-gray-800
```

Notice the pattern: backgrounds invert (light → dark, dark → light), text colors mirror the inversion, and borders follow the same logic.

Let's apply this to the most common UI elements:

### Cards

```html
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
  <h2 class="text-gray-900 dark:text-white font-semibold text-lg mb-2">Card Title</h2>
  <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
    Card description text that is readable in both modes.
  </p>
</div>
```

### Form Inputs

```html
<input
  type="email"
  placeholder="you@example.com"
  class="w-full px-4 py-2 rounded-lg text-sm
         border border-gray-300 dark:border-gray-600
         bg-white dark:bg-gray-800
         text-gray-900 dark:text-gray-100
         placeholder:text-gray-400 dark:placeholder:text-gray-500
         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
         transition-colors"
/>
```

### Buttons

```html
<!-- Primary button — stays blue in both modes -->
<button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
  Primary Action
</button>

<!-- Secondary button — adapts between modes -->
<button class="px-4 py-2
               bg-gray-100 dark:bg-gray-700
               text-gray-900 dark:text-white
               hover:bg-gray-200 dark:hover:bg-gray-600
               rounded-lg font-medium transition-colors">
  Secondary Action
</button>
```

### Dividers

```html
<hr class="border-gray-200 dark:border-gray-700" />
```

### Code Blocks

```html
<pre class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-lg p-4 text-sm font-mono overflow-x-auto">
  <code>const greeting = "hello world";</code>
</pre>
```

## The Toggle Button Itself

The toggle button is a good example of using `dark:` classes to show different icons:

```html
<button
  id="theme-toggle"
  class="p-2 rounded-lg
         bg-gray-100 dark:bg-gray-800
         hover:bg-gray-200 dark:hover:bg-gray-700
         text-gray-600 dark:text-gray-400
         transition-colors"
  aria-label="Toggle dark mode">

  <!-- Moon icon: visible in light mode, hidden in dark mode -->
  <svg class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>

  <!-- Sun icon: hidden in light mode, visible in dark mode -->
  <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
    <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          clip-rule="evenodd" />
  </svg>

</button>
```

`block dark:hidden` means the moon icon is visible in light mode and disappears in dark mode. `hidden dark:block` is the inverse — the sun icon hides in light mode and appears in dark mode.

:::tip Why not use JavaScript to swap the icon?
You could toggle the icon with JavaScript, but using `dark:` classes means the icon swap happens with zero JavaScript and zero DOM manipulation. It is handled entirely by CSS, which is faster and less code to maintain.
:::

## A Complete Dark Mode Page

Here is everything wired together:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dark Mode Demo</title>
  <link rel="stylesheet" href="./src/style.css" />

  <!-- Theme initialization: must run before the page paints to avoid flash -->
  <script>
    (function() {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (saved === 'dark' || (!saved && prefersDark)) {
        document.documentElement.classList.add('dark');
      }
    })();
  </script>
</head>

<body class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">

  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <span class="font-bold text-lg">MyApp</span>

      <button id="theme-toggle"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode">
        <svg class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
        <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">Dark Mode Works</h1>
    <p class="text-gray-600 dark:text-gray-400 text-lg mb-8">
      Toggle with the button above. Your preference is saved.
    </p>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 class="text-gray-900 dark:text-white font-semibold mb-2">A Card</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">This card adapts to both modes.</p>
      </div>
      <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h2 class="text-gray-900 dark:text-white font-semibold mb-2">Another Card</h2>
        <p class="text-gray-500 dark:text-gray-400 text-sm">Same class pattern, consistent look.</p>
      </div>
    </div>
  </main>

  <script type="module" src="./src/theme.ts"></script>
</body>
</html>
```

Notice the inline `<script>` in the `<head>`. This is a self-invoking function (IIFE) that runs synchronously before the page renders, applying the `dark` class if needed. The rest of the JavaScript can stay at the bottom as usual.

:::warning Common Mistake
Writing `--dark-mode: class` in your `@theme` block but then wondering why dark mode does not respond to OS changes anymore. That is the correct and intended behavior — once you use class mode, Tailwind ignores the OS preference entirely. The two modes are mutually exclusive. If you want both (respect OS by default, allow manual override), you need to implement that logic in JavaScript using `window.matchMedia`.
:::

## Scaffolded Activity

Add dark mode to your Module 01 or current portfolio page.

**Requirements:**
1. Configure Tailwind for class-based dark mode
2. Add a toggle button in the navigation
3. Apply `dark:` variants to: the body background, any card backgrounds, all body text, borders, and the nav background
4. Write the JavaScript toggle with localStorage persistence
5. Add the flash-prevention script to the `<head>`

**Starter toggle button (complete the class attributes):**

```html
<!-- In your nav -->
<button id="theme-toggle" class="p-2 rounded-lg ___" aria-label="Toggle dark mode">
  <svg class="w-5 h-5 ___"><!-- moon icon --></svg>
  <svg class="w-5 h-5 ___"><!-- sun icon --></svg>
</button>
```

**Success check:**
- Clicking the toggle switches between light and dark
- Refreshing the page maintains the current mode
- On a first visit (no localStorage value), the page matches the OS setting
- There is no visible flash of wrong theme on page load

## Key Takeaways

- When you want dark mode to follow the OS automatically with no toggle, use `--dark-mode: media` — because Tailwind maps it to the `prefers-color-scheme: dark` media query with no JavaScript needed.
- When you want a manual toggle button, use `--dark-mode: class` — because Tailwind will activate `dark:` classes only when `<html>` has the `dark` class, which JavaScript can add and remove.
- When you add dark mode, think in pairs — for every `bg-white`, add a `dark:bg-gray-900` — because `dark:` classes are overrides, not replacements.
- When saving the theme preference, use `localStorage.setItem('theme', value)` — because it persists across browser sessions unlike `sessionStorage`.
- When preventing the flash of wrong theme, put the theme initialization in a synchronous `<script>` in the `<head>` — because scripts in the `<head>` run before the browser renders any visible content.
