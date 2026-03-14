---
sidebar_position: 4
title: Responsive Design
---

# Responsive Design with Tailwind

Tailwind uses a **mobile-first** approach. Base utilities apply to all screen sizes; prefixed utilities override at specific breakpoints.

## Breakpoints

| Prefix | Min Width | Typical Device |
|--------|----------|---------------|
| *(none)* | 0px | Mobile |
| `sm:` | 640px | Large mobile / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Large desktop |
| `2xl:` | 1536px | Very wide |

## How to Think About It

```html
<!-- Read left to right: mobile → tablet → desktop -->
<div class="text-sm md:text-base lg:text-lg">
  Text scales up as screen gets wider
</div>

<div class="flex-col md:flex-row">
  Stack on mobile, side-by-side on tablet+
</div>

<div class="hidden lg:block">
  Only visible on desktop
</div>

<div class="block lg:hidden">
  Only visible on mobile/tablet
</div>
```

## Responsive Grid

```html
<!-- 1 column → 2 columns → 3 columns -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <div class="bg-white rounded-xl p-6 shadow">Card 1</div>
  <div class="bg-white rounded-xl p-6 shadow">Card 2</div>
  <div class="bg-white rounded-xl p-6 shadow">Card 3</div>
  <div class="bg-white rounded-xl p-6 shadow">Card 4</div>
</div>
```

## Responsive Navigation

```html
<nav class="flex items-center justify-between p-4 lg:px-16">
  <!-- Logo: always visible -->
  <a href="/" class="text-xl font-bold">Brand</a>

  <!-- Desktop links: hidden on mobile, flex on desktop -->
  <ul class="hidden lg:flex gap-8 list-none">
    <li><a href="/about" class="text-gray-600 hover:text-gray-900">About</a></li>
    <li><a href="/work" class="text-gray-600 hover:text-gray-900">Work</a></li>
    <li><a href="/contact" class="text-gray-600 hover:text-gray-900">Contact</a></li>
  </ul>

  <!-- Mobile menu button: visible on mobile, hidden on desktop -->
  <button class="lg:hidden p-2" id="menu-toggle" aria-label="Open menu">
    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</nav>
```

## Responsive Typography

```html
<h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
  Build something people love
</h1>

<p class="text-base lg:text-lg text-gray-600 max-w-2xl">
  Longer descriptions stay readable by capping their width.
</p>
```

## Responsive Spacing

```html
<section class="py-12 lg:py-24 px-4 lg:px-8">
  <div class="max-w-7xl mx-auto">
    Content
  </div>
</section>
```

## A Full Responsive Hero

```html
<section class="min-h-screen flex items-center bg-gray-950 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
    <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

      <!-- Text content -->
      <div class="flex-1 text-center lg:text-left">
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
          Ship faster.<br />
          <span class="text-blue-400">Break nothing.</span>
        </h1>
        <p class="mt-6 text-lg lg:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
          A full-stack framework for teams who care about type safety.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a href="#" class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors">
            Get started
          </a>
          <a href="#" class="px-8 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold rounded-lg transition-colors">
            View docs
          </a>
        </div>
      </div>

      <!-- Visual content -->
      <div class="flex-1 w-full max-w-lg lg:max-w-none">
        <div class="bg-gray-800 rounded-2xl p-6 font-mono text-sm text-green-400">
          <p class="text-gray-500">// app/api/users/route.ts</p>
          <p class="mt-2">export async function GET() &#123;</p>
          <p class="pl-4">const users = await db.user.findMany();</p>
          <p class="pl-4">return Response.json(users);</p>
          <p>&#125;</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

## Activity

Take your Module 01 page and make it fully responsive:

1. The nav should collapse on mobile (hidden links, show hamburger icon)
2. The cards grid: 1 column on mobile, 2 on tablet, 3 on desktop
3. Font sizes should increase progressively on wider screens
4. Padding/margin should increase on desktop
5. Test at 375px, 768px, and 1280px widths in DevTools
