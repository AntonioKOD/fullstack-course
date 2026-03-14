---
sidebar_position: 3
title: Utility Classes
---

# Tailwind Utility Classes

Tailwind utility classes map directly to CSS properties. Once you learn the naming pattern, you rarely need to look at the docs.

## Naming Pattern

```
{property}-{value}
```

Examples:
- `text-lg` → `font-size: 1.125rem`
- `p-4` → `padding: 1rem`
- `mt-8` → `margin-top: 2rem`
- `bg-blue-500` → `background-color: #3b82f6`
- `flex` → `display: flex`
- `rounded-lg` → `border-radius: 0.5rem`

## Spacing

Tailwind uses a scale where `1 = 0.25rem`:

```html
<!-- padding -->
<div class="p-4">1rem all sides</div>
<div class="px-4 py-2">horizontal 1rem, vertical 0.5rem</div>
<div class="pt-8 pb-4">top 2rem, bottom 1rem</div>

<!-- margin -->
<div class="m-4">1rem all sides</div>
<div class="mx-auto">centered horizontally</div>
<div class="mt-16">margin-top: 4rem</div>

<!-- gap (for flex/grid) -->
<div class="flex gap-4">gap: 1rem between items</div>
```

Key values: `1=0.25rem`, `2=0.5rem`, `4=1rem`, `6=1.5rem`, `8=2rem`, `12=3rem`, `16=4rem`, `24=6rem`

## Typography

```html
<!-- Font size -->
<p class="text-sm">0.875rem</p>
<p class="text-base">1rem</p>
<p class="text-lg">1.125rem</p>
<p class="text-xl">1.25rem</p>
<p class="text-2xl">1.5rem</p>
<p class="text-4xl">2.25rem</p>
<p class="text-6xl">3.75rem</p>

<!-- Font weight -->
<p class="font-normal">400</p>
<p class="font-medium">500</p>
<p class="font-semibold">600</p>
<p class="font-bold">700</p>

<!-- Line height -->
<p class="leading-none">1</p>
<p class="leading-tight">1.25</p>
<p class="leading-normal">1.5</p>
<p class="leading-relaxed">1.625</p>

<!-- Text alignment -->
<p class="text-left">left</p>
<p class="text-center">center</p>

<!-- Text color -->
<p class="text-gray-900">dark text</p>
<p class="text-gray-500">muted text</p>
<p class="text-blue-600">brand color</p>
```

## Colors

Tailwind has a built-in palette with shades 50–950:

```html
<div class="bg-blue-500">primary blue</div>
<div class="bg-blue-600 hover:bg-blue-700">darker on hover</div>

<div class="bg-gray-100 text-gray-900">light card</div>
<div class="bg-gray-900 text-gray-100">dark card</div>

<div class="bg-green-100 text-green-800">success</div>
<div class="bg-red-100 text-red-800">error</div>
<div class="bg-yellow-100 text-yellow-800">warning</div>
```

## Layout

```html
<!-- Flexbox -->
<div class="flex items-center justify-between gap-4">
  <span>Left</span>
  <span>Right</span>
</div>

<div class="flex flex-col items-center gap-8">
  <h1>Centered Column</h1>
  <p>Content below</p>
</div>

<!-- Grid -->
<div class="grid grid-cols-3 gap-6">
  <div>Col 1</div>
  <div>Col 2</div>
  <div>Col 3</div>
</div>

<div class="grid grid-cols-12 gap-4">
  <aside class="col-span-3">Sidebar</aside>
  <main class="col-span-9">Content</main>
</div>
```

## Sizing

```html
<!-- Width -->
<div class="w-full">100%</div>
<div class="w-1/2">50%</div>
<div class="w-64">16rem</div>
<div class="w-screen">100vw</div>
<div class="max-w-2xl mx-auto">max 42rem, centered</div>
<div class="max-w-7xl mx-auto px-4">common page container</div>

<!-- Height -->
<div class="h-screen">100vh</div>
<div class="min-h-screen">at least 100vh</div>
<div class="h-64">16rem</div>
```

## Borders & Shadows

```html
<!-- Border -->
<div class="border border-gray-200">1px solid</div>
<div class="border-2 border-blue-500">2px blue</div>
<div class="border-b border-gray-100">bottom only</div>

<!-- Border radius -->
<div class="rounded">0.25rem</div>
<div class="rounded-lg">0.5rem</div>
<div class="rounded-xl">0.75rem</div>
<div class="rounded-2xl">1rem</div>
<div class="rounded-full">9999px (circle/pill)</div>

<!-- Shadow -->
<div class="shadow-sm">subtle shadow</div>
<div class="shadow">default shadow</div>
<div class="shadow-md">medium shadow</div>
<div class="shadow-lg">large shadow</div>
<div class="shadow-xl">extra large</div>
```

## State Variants

```html
<!-- Hover -->
<button class="bg-blue-500 hover:bg-blue-600">Hover me</button>

<!-- Focus -->
<input class="border focus:outline-none focus:ring-2 focus:ring-blue-500" />

<!-- Active -->
<button class="active:scale-95 transition-transform">Press me</button>

<!-- Disabled -->
<button class="disabled:opacity-50 disabled:cursor-not-allowed" disabled>Disabled</button>

<!-- Group hover — change child when parent is hovered -->
<div class="group">
  <p class="text-gray-500 group-hover:text-blue-600">I change on parent hover</p>
</div>
```

## A Real Button Component

```html
<button class="
  inline-flex items-center gap-2
  px-4 py-2
  bg-blue-600 hover:bg-blue-700 active:bg-blue-800
  text-white text-sm font-medium
  rounded-lg
  shadow-sm
  transition-colors duration-150
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Get Started
</button>
```

## Activity

Rebuild your Module 01 layout using Tailwind instead of custom CSS:

1. Remove your `styles.css` link (keep the reset, add Tailwind)
2. Recreate the navbar, hero, cards, and footer using only Tailwind utilities
3. Use `hover:` variants on all interactive elements
4. Add `focus:ring` styles to all form inputs
