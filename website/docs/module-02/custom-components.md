---
sidebar_position: 6
title: Custom Components with @apply
---

# Custom Components with @apply

When the same set of utilities repeats across many elements, extract them into a component class using `@apply`.

## When to Use @apply

```html
<!--  Repetition — same 12 classes on every button -->
<button class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Save</button>
<button class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">Submit</button>
```

```css title="src/style.css"
@import "tailwindcss";

/*  Extract into a component class */
@layer components {
  .btn {
    @apply inline-flex items-center justify-center gap-2
           px-4 py-2 rounded-lg text-sm font-medium
           transition-colors duration-150
           focus:outline-none focus:ring-2 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn bg-blue-600 hover:bg-blue-700 text-white
           focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn bg-gray-100 hover:bg-gray-200 text-gray-900
           dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-100
           focus:ring-gray-500;
  }

  .btn-danger {
    @apply btn bg-red-600 hover:bg-red-700 text-white
           focus:ring-red-500;
  }

  .btn-ghost {
    @apply btn bg-transparent hover:bg-gray-100 text-gray-700
           dark:hover:bg-gray-800 dark:text-gray-300
           focus:ring-gray-500;
  }
}
```

```html
<!--  Clean HTML -->
<button class="btn-primary">Save</button>
<button class="btn-secondary">Cancel</button>
<button class="btn-danger">Delete</button>
```

## Building a Component Library

```css title="src/style.css"
@import "tailwindcss";

@layer components {

  /*  Card  */
  .card {
    @apply bg-white dark:bg-gray-800
           border border-gray-200 dark:border-gray-700
           rounded-xl shadow-sm p-6;
  }

  .card-hover {
    @apply card transition-shadow hover:shadow-md cursor-pointer;
  }

  /*  Badge  */
  .badge {
    @apply inline-flex items-center px-2.5 py-0.5
           rounded-full text-xs font-medium;
  }

  .badge-blue   { @apply badge bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200; }
  .badge-green  { @apply badge bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200; }
  .badge-red    { @apply badge bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200; }
  .badge-yellow { @apply badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200; }

  /*  Form inputs  */
  .input {
    @apply w-full px-4 py-2 rounded-lg text-sm
           border border-gray-300 dark:border-gray-600
           bg-white dark:bg-gray-900
           text-gray-900 dark:text-gray-100
           placeholder:text-gray-400 dark:placeholder:text-gray-500
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
           disabled:opacity-50 disabled:cursor-not-allowed
           transition-colors;
  }

  .label {
    @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1;
  }

  /*  Alert / Banner  */
  .alert {
    @apply flex items-start gap-3 p-4 rounded-lg text-sm;
  }

  .alert-info    { @apply alert bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200; }
  .alert-success { @apply alert bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-200; }
  .alert-warning { @apply alert bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200; }
  .alert-error   { @apply alert bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-200; }

  /*  Page layout  */
  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section {
    @apply py-16 lg:py-24;
  }
}
```

## Usage Example

```html
<section class="section bg-gray-50 dark:bg-gray-950">
  <div class="container">

    <h2 class="text-3xl font-bold text-center mb-12">Features</h2>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div class="card-hover">
        <span class="badge-blue mb-3">New</span>
        <h3 class="text-lg font-semibold mb-2">Type Safety</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          End-to-end types from database to UI.
        </p>
      </div>

      <div class="card-hover">
        <span class="badge-green mb-3">Stable</span>
        <h3 class="text-lg font-semibold mb-2">Fast Builds</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Vite-powered dev server with HMR.
        </p>
      </div>

      <div class="card-hover">
        <span class="badge-yellow mb-3">Beta</span>
        <h3 class="text-lg font-semibold mb-2">AI Ready</h3>
        <p class="text-gray-600 dark:text-gray-400 text-sm">
          Built-in Claude API integration.
        </p>
      </div>

    </div>

    <div class="alert-info mt-8">
      <span></span>
      <p>All components support dark mode automatically.</p>
    </div>

  </div>
</section>
```

:::tip @layer components vs utilities
Put component classes in `@layer components` and utility overrides in `@layer utilities`. This ensures Tailwind's specificity order is respected and you can still override components with utility classes in HTML.
:::

## Activity

Create a `components.css` file (imported into `style.css`) with at minimum:
- `.btn`, `.btn-primary`, `.btn-secondary`
- `.card`
- `.input` and `.label`
- `.badge` with at least 3 color variants

Then rebuild your portfolio page using only these component classes + a few inline utilities for one-off adjustments.
