---
sidebar_position: 6
title: Custom Components with @apply
---

# Custom Components with @apply

:::info Learning Objectives
By the end of this lesson you will be able to:

- Identify when repeating utilities in HTML is a maintenance problem worth solving
- Use `@apply` inside `@layer components` to extract repeated utility patterns into named classes
- Build a reusable component library covering buttons, cards, badges, inputs, and alerts
- Explain why `@apply` should be used sparingly and what the alternatives are in component-based frameworks
:::

## The Problem @apply Solves

Utility classes are fantastic for one-off elements. But what happens when the same 12 classes appear on every button across 30 HTML files?

```html
<!-- Button appears 30 times across the project. All look like this: -->
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  Save
</button>
```

If the designer decides buttons should use `rounded-xl` instead of `rounded-lg`, you now have 30 places to update. You will miss some. Your site will be inconsistent.

This is the exact problem `@apply` solves. Instead of repeating the 12 classes everywhere, you extract them into a named CSS class that you control in one place:

```css title="src/style.css"
@layer components {
  .btn-primary {
    @apply inline-flex items-center justify-center gap-2
           px-4 py-2
           bg-blue-600 hover:bg-blue-700 active:bg-blue-800
           text-white text-sm font-medium
           rounded-lg
           transition-colors duration-150
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }
}
```

Now every button is just:

```html
<button class="btn-primary">Save</button>
<button class="btn-primary">Submit</button>
<button class="btn-primary">Confirm</button>
```

When the designer changes their mind about border radius, you update one line in one file.

:::tip The analogy
`@apply` is like a function in programming. Instead of copy-pasting the same 10 lines of code everywhere, you extract them into a named function and call it. The benefit is the same: one place to read, one place to change.
:::

## What `@layer components` Means

The `@layer components` wrapper is important. Tailwind generates its CSS in three layers:

1. **base** — resets, default HTML element styles
2. **components** — your reusable class patterns (this is where `@apply` extractions go)
3. **utilities** — all the individual utility classes

By placing your custom classes in `@layer components`, you are telling Tailwind: "these classes have component-level specificity." The practical consequence is that you can still override a component class with a utility class directly in HTML. For example:

```html
<!-- The component class sets rounded-lg, but this specific button needs rounded-full -->
<button class="btn-primary rounded-full">Pill Button</button>
```

Because utilities (layer 3) have higher specificity than components (layer 2), `rounded-full` wins over the `rounded-lg` inside `.btn-primary`. If you defined your component outside any `@layer`, this override might not work as expected.

:::warning Common Mistake
Putting component classes outside of `@layer components` — either directly in the stylesheet or in `@layer utilities`. Classes in `@layer utilities` cannot be overridden by other utilities at the same specificity, which breaks the expectation that inline utilities always win. Always put `@apply` extractions in `@layer components`.
:::

## When NOT to Use @apply

Before building your component library, here is the honest caveat: `@apply` is a tool for a specific problem. Overusing it recreates the problems that Tailwind was designed to solve.

**Use `@apply` when:**
- The exact same set of utilities repeats across many elements in plain HTML
- You are building a design system for a project that does not use a component framework (React, Vue, Svelte)
- A pattern needs to be usable by non-developer teammates editing HTML directly

**Do NOT use `@apply` when:**
- You are working in React, Vue, or Svelte — in those frameworks, the component itself is the abstraction. A `<Button>` component with utility classes in its JSX is far better than a `.btn` CSS class, because the component can accept props and has co-located logic.
- You are extracting a pattern that only appears twice — at that frequency, the duplication cost is low and the abstraction cost is not worth it
- You want to add non-Tailwind CSS inside `@apply` — the directive only works with utility classes

In Module 05 (React), you will build a proper `<Button>` component and will not need `@apply` for buttons at all. For now, in a plain HTML/CSS project, `@apply` is the right tool.

## Building a Component Library

Here is a complete, production-quality set of base components. Paste this into your `style.css` after `@import "tailwindcss"`:

```css title="src/style.css"
@import "tailwindcss";

@layer components {

  /* ===== BUTTONS ===== */

  /* Base button: shared structure and behavior, no color */
  .btn {
    @apply inline-flex items-center justify-center gap-2
           px-4 py-2 rounded-lg text-sm font-medium
           transition-colors duration-150
           focus:outline-none focus:ring-2 focus:ring-offset-2
           disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .btn-primary {
    @apply btn
           bg-blue-600 hover:bg-blue-700 active:bg-blue-800
           text-white
           focus:ring-blue-500;
  }

  .btn-secondary {
    @apply btn
           bg-gray-100 hover:bg-gray-200 active:bg-gray-300
           dark:bg-gray-700 dark:hover:bg-gray-600
           text-gray-900 dark:text-gray-100
           focus:ring-gray-400;
  }

  .btn-danger {
    @apply btn
           bg-red-600 hover:bg-red-700 active:bg-red-800
           text-white
           focus:ring-red-500;
  }

  .btn-ghost {
    @apply btn
           bg-transparent hover:bg-gray-100 active:bg-gray-200
           dark:hover:bg-gray-800
           text-gray-700 dark:text-gray-300
           focus:ring-gray-400;
  }

  /* ===== CARDS ===== */

  .card {
    @apply bg-white dark:bg-gray-800
           border border-gray-200 dark:border-gray-700
           rounded-xl shadow-sm p-6;
  }

  /* Card with hover effect — for clickable cards */
  .card-hover {
    @apply card cursor-pointer
           transition-shadow duration-200
           hover:shadow-md;
  }

  /* ===== BADGES ===== */

  /* Base badge: shared structure, no color */
  .badge {
    @apply inline-flex items-center
           px-2.5 py-0.5
           rounded-full text-xs font-medium;
  }

  .badge-blue   { @apply badge bg-blue-100   text-blue-800   dark:bg-blue-900   dark:text-blue-200; }
  .badge-green  { @apply badge bg-green-100  text-green-800  dark:bg-green-900  dark:text-green-200; }
  .badge-red    { @apply badge bg-red-100    text-red-800    dark:bg-red-900    dark:text-red-200; }
  .badge-yellow { @apply badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200; }
  .badge-gray   { @apply badge bg-gray-100   text-gray-700   dark:bg-gray-700   dark:text-gray-300; }

  /* ===== FORM ELEMENTS ===== */

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
    @apply block text-sm font-medium
           text-gray-700 dark:text-gray-300
           mb-1;
  }

  /* ===== ALERTS / BANNERS ===== */

  .alert {
    @apply flex items-start gap-3 p-4 rounded-lg text-sm;
  }

  .alert-info    { @apply alert bg-blue-50   text-blue-800   dark:bg-blue-950   dark:text-blue-200; }
  .alert-success { @apply alert bg-green-50  text-green-800  dark:bg-green-950  dark:text-green-200; }
  .alert-warning { @apply alert bg-yellow-50 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200; }
  .alert-error   { @apply alert bg-red-50    text-red-800    dark:bg-red-950    dark:text-red-200; }

  /* ===== PAGE LAYOUT ===== */

  .container {
    @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .section {
    @apply py-16 lg:py-24;
  }

}
```

Let's walk through the structural decisions here.

The `.btn` base class contains everything that is the same across all button variants: the flex layout, the padding, the border radius, the transitions, the focus ring structure, and the disabled state. The variant classes (`.btn-primary`, `.btn-secondary`) then compose on top of `.btn` using `@apply btn ...`. This is the same principle as class inheritance: define the shared behavior once, then specialize.

The `.badge` and `.alert` classes use the same pattern. The base class defines structure; color-specific subclasses compose from the base.

Notice that `.container` and `.section` are layout utilities. These are convenient for pages that reuse the same page-level spacing, but they are an example of where `@apply` starts to blur into "just defining global CSS classes." Use judgment — if you find yourself creating dozens of one-off component classes, you may be recreating Bootstrap rather than using Tailwind's strengths.

## Using the Component Library

Here is a features section built entirely from the component classes above, with only a few one-off utilities for layout:

```html
<section class="section bg-gray-50 dark:bg-gray-950">
  <div class="container">

    <div class="text-center mb-12">
      <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Everything You Need
      </h2>
      <p class="text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
        A complete platform for building and shipping modern applications.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

      <div class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Type Safety
          </h3>
          <span class="badge-blue">New</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          End-to-end TypeScript types from your database schema all the way to the UI.
        </p>
      </div>

      <div class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            Fast Builds
          </h3>
          <span class="badge-green">Stable</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Vite-powered dev server with Hot Module Replacement for instant feedback.
        </p>
      </div>

      <div class="card-hover">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
            AI Ready
          </h3>
          <span class="badge-yellow">Beta</span>
        </div>
        <p class="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Built-in Claude API integration with streaming support out of the box.
        </p>
      </div>

    </div>

    <div class="alert-info mt-8">
      <span class="text-lg">ℹ</span>
      <p>All components support dark mode automatically through the paired dark: classes.</p>
    </div>

    <div class="flex justify-center gap-4 mt-10">
      <a href="#" class="btn-primary">Get Started Free</a>
      <a href="#" class="btn-ghost">View Documentation</a>
    </div>

  </div>
</section>
```

Read through this HTML and notice how self-documenting it is. `card-hover` tells you this card is clickable. `badge-blue` tells you the color of the badge. `btn-primary` tells you this is the main action. The purpose of every element is legible from its class name — which is exactly what good component naming should achieve.

:::tip When to add a variant vs a one-off utility
If you need a large button just once, write `btn-primary text-base px-6 py-3` in the HTML and override the base classes with inline utilities. Do not create a `btn-primary-large` class for a single use. Create variants only when you genuinely need them in multiple places.
:::

## Keeping @apply Manageable

Here are the rules of thumb for a healthy `@apply` usage in a plain HTML project:

**Good candidates for `@apply` extraction:**
- Any pattern that appears more than 3 times
- Button variants (you will use buttons everywhere)
- Card styles (consistent across pages)
- Form inputs (identical markup in every form)
- Alert/banner patterns (semantic status messages)

**Poor candidates for `@apply` extraction:**
- One-off section layouts (`hero-content-wrapper`, `pricing-grid`)
- Page-specific decorative elements
- Any class you would only use once or twice

**The test:** before extracting a pattern, ask "if this changes, how many places would I need to update?" If the answer is 1 or 2, leave it as inline utilities. If the answer is 10 or more, extract it.

## Scaffolded Activity

Create a `src/components.css` file that you import into `style.css`, and build the following component classes:

**Required:**
- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger` — with working dark mode variants
- `.card` and `.card-hover`
- `.input` and `.label`
- `.badge` with at least three color variants

**Then rebuild your portfolio page (from Module 01) using only these component classes plus one-off utility classes for layout.** The goal is that no raw Tailwind class appears more than twice for the same pattern — any repeated pattern should become a component class.

**Starter `components.css`:**

```css
/* src/components.css */
/* Import this file from style.css: @import "./components.css"; */

@layer components {

  /* Buttons */
  .btn {
    /* Your base button styles here */
    @apply /* ... */;
  }

  .btn-primary {
    @apply btn /* ... */;
  }

  /* Continue with .btn-secondary, .btn-danger */

  /* Cards */
  .card {
    @apply /* ... */;
  }

  /* Badges */
  .badge {
    @apply /* ... */;
  }

  /* Add color variants */

  /* Form elements */
  .input {
    @apply /* ... */;
  }

  .label {
    @apply /* ... */;
  }

}
```

**Success check:**
- All buttons look identical across the page and change together when you modify `.btn`
- Cards have consistent corners, shadows, and padding
- All inputs have focus rings and work in dark mode
- The overall page is clean and uses significantly fewer ad-hoc classes than the Module 01 version

## Key Takeaways

- When the same set of utilities appears on 5+ elements across the project, extract them with `@apply` into a named class in `@layer components` — because a single source of truth is cheaper to maintain than distributed copies.
- When you work in React or another component framework, skip `@apply` for component patterns — because the component file itself is the abstraction, and duplicating that into CSS creates two sources of truth.
- When overriding a component class with inline utilities, put the override in the HTML class attribute and ensure your component is in `@layer components` — because utilities (layer 3) automatically win over components (layer 2) in the cascade.
- When naming component classes, use semantic names that describe what the element IS, not how it looks — `.btn-primary` instead of `.blue-rounded-button` — because semantics survive design changes.
