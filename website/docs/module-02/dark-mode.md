---
sidebar_position: 5
title: Dark Mode
---

# Dark Mode with Tailwind

Tailwind supports dark mode in two ways: automatic (follows OS setting) or manual (toggle with a class).

## Automatic Dark Mode

Configure Tailwind to use `prefers-color-scheme`:

```css title="src/style.css"
@import "tailwindcss";

@theme {
  --dark-mode: media; /* Use OS preference */
}
```

Then use `dark:` variants:

```html
<div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
  <h1 class="text-gray-900 dark:text-white">Hello</h1>
  <p class="text-gray-600 dark:text-gray-400">This adapts to your OS setting</p>
</div>
```

## Manual Dark Mode (Toggle Button)

Configure Tailwind to use a class instead of OS preference:

```css title="src/style.css"
@import "tailwindcss";

@theme {
  --dark-mode: class; /* Use .dark class on <html> */
}
```

```html
<html class="dark">  <!-- add/remove this class via JS -->
  <body class="bg-white dark:bg-gray-900">
    <button id="theme-toggle">Toggle</button>
  </body>
</html>
```

```ts title="src/theme.ts"
const toggle = document.getElementById('theme-toggle')!;
const html = document.documentElement;

// Load saved preference
if (localStorage.theme === 'dark') {
  html.classList.add('dark');
}

toggle.addEventListener('click', () => {
  html.classList.toggle('dark');
  localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});
```

## Dark Mode Patterns

```html
<!-- Cards -->
<div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
  <h2 class="text-gray-900 dark:text-white font-semibold">Card Title</h2>
  <p class="text-gray-500 dark:text-gray-400">Description text</p>
</div>

<!-- Inputs -->
<input
  class="w-full px-4 py-2 rounded-lg border
         border-gray-300 dark:border-gray-600
         bg-white dark:bg-gray-800
         text-gray-900 dark:text-gray-100
         placeholder:text-gray-400 dark:placeholder:text-gray-500
         focus:outline-none focus:ring-2 focus:ring-blue-500"
  placeholder="Enter email"
/>

<!-- Buttons -->
<button class="px-4 py-2 rounded-lg
               bg-gray-100 dark:bg-gray-700
               text-gray-900 dark:text-white
               hover:bg-gray-200 dark:hover:bg-gray-600">
  Secondary button
</button>

<!-- Dividers -->
<hr class="border-gray-200 dark:border-gray-700" />

<!-- Code blocks -->
<pre class="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 rounded-lg">
  code here
</pre>
```

## Complete Dark Mode Theme Example

```html
<!DOCTYPE html>
<html lang="en" class="">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Dark Mode Demo</title>
  <link rel="stylesheet" href="./src/style.css" />
</head>
<body class="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">

  <header class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
    <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <span class="font-bold text-lg">MyApp</span>

      <button id="theme-toggle"
        class="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Toggle dark mode">
        <!-- Sun icon (shown in dark mode) -->
        <svg class="w-5 h-5 hidden dark:block" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd" />
        </svg>
        <!-- Moon icon (shown in light mode) -->
        <svg class="w-5 h-5 block dark:hidden" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      </button>
    </div>
  </header>

  <main class="max-w-7xl mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Dark Mode Works</h1>
    <p class="mt-4 text-gray-600 dark:text-gray-400">Toggle with the button above.</p>
  </main>

  <script type="module" src="./src/theme.ts"></script>
</body>
</html>
```
