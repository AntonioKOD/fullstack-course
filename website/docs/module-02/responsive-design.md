---
sidebar_position: 4
title: Responsive Design
---

# Responsive Design with Tailwind

:::info Learning Objectives
By the end of this lesson you will be able to:

- Explain the mobile-first approach and why writing styles for mobile first produces better results than desktop-first
- Apply breakpoint prefixes (`sm:`, `md:`, `lg:`, `xl:`) to override utilities at specific screen widths
- Build a card grid that collapses from 3 columns on desktop to 1 column on mobile
- Hide and show navigation elements at different breakpoints without any JavaScript
:::

## What Does "Responsive" Mean?

A responsive page adjusts its layout based on the screen width. The same HTML renders as a single-column stack on a phone, a two-column layout on a tablet, and a three-column grid on a desktop.

Before Tailwind, responsive design meant writing media queries in your CSS file:

```css
/* Traditional approach */
.card-grid {
  display: grid;
  grid-template-columns: 1fr; /* mobile */
}

@media (min-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr); /* tablet */
  }
}

@media (min-width: 1024px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr); /* desktop */
  }
}
```

With Tailwind, you write this directly in your HTML:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

Same result, one line, no context switching.

## Understanding Breakpoint Prefixes

A breakpoint prefix like `md:` means "apply this utility when the screen is *at least* this wide." Think of it as a condition:

```
md:grid-cols-2 = "grid-template-columns: repeat(2, 1fr) — but only when the screen is 768px or wider"
```

The available breakpoints:

| Prefix | Min Width | What it typically targets |
|--------|----------|--------------------------|
| *(none)* | 0px | All screens (your starting point) |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets, small laptops |
| `lg:` | 1024px | Laptops, desktop browsers |
| `xl:` | 1280px | Wide desktop screens |
| `2xl:` | 1536px | Very wide monitors |

:::tip The key insight
There is no "mobile-only" prefix in Tailwind. Instead, bare utilities (no prefix) apply to *all* screen sizes, and prefixed utilities *override* those at wider screens. This is the mobile-first model: you design the mobile layout first, then progressively enhance it for larger screens.
:::

## Mobile-First Thinking

Here is how to think through a responsive design step by step.

Say you want a section that:
- Has small padding on mobile (space is tight)
- Has larger padding on tablet
- Has the most padding on desktop

In a desktop-first mindset, you would write the large padding first, then use media queries to shrink it. In Tailwind's mobile-first mindset, you write the small padding first and add prefixes to grow it:

```html
<!-- Read left to right: mobile → tablet → desktop -->
<section class="py-8 md:py-16 lg:py-24 px-4 md:px-8 lg:px-16">
  Content
</section>
```

The browser reads this as:
- All screens: `py-8 px-4` (2rem vertical, 1rem horizontal)
- 768px+: `py-16 px-8` (4rem vertical, 2rem horizontal)
- 1024px+: `py-24 px-16` (6rem vertical, 4rem horizontal)

Another example — text that scales up as the screen gets wider:

```html
<h1 class="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
  Build something people love
</h1>
```

On mobile: `text-3xl` (1.875rem). On large phones: `text-4xl` (2.25rem). On desktop: `text-6xl` (3.75rem). Each breakpoint prefix overrides the previous value.

:::warning Common Mistake
Students write `sm:text-3xl md:text-4xl lg:text-6xl` and wonder why the text is the default browser size on mobile. They forgot the base (no prefix) value. Without a base `text-*` class, the element uses the browser's default size. Always start with the mobile style, then add prefixes for larger screens.
:::

## Show and Hide at Breakpoints

A common responsive pattern is showing different elements at different screen sizes:

```html
<!-- Desktop nav links: hidden on mobile, visible as flex on large screens -->
<ul class="hidden lg:flex gap-8">
  <li><a href="/about">About</a></li>
  <li><a href="/work">Work</a></li>
</ul>

<!-- Hamburger button: visible on mobile, hidden on large screens -->
<button class="lg:hidden p-2" aria-label="Open menu">
  <!-- hamburger icon -->
</button>
```

Reading `hidden lg:flex`: "display: none by default, display: flex when screen is 1024px or wider."

Reading `lg:hidden`: "no override until 1024px, then display: none."

```
Screen width:   [  mobile  ][   tablet   ][       desktop       ]
Nav links:      [ hidden   ][ hidden     ][ flex — visible      ]
Hamburger btn:  [ visible  ][ visible    ][ hidden              ]
```

:::warning Common Mistake
Using `hidden md:hidden lg:block` when you mean `hidden lg:block`. The `md:hidden` is redundant — `hidden` already applies from 0px. Extra prefixes do not "lock in" a value for a range; each prefix simply overrides at its breakpoint. When you want something hidden on mobile and visible on desktop, you only need `hidden lg:block`.
:::

## A Complete Responsive Card Grid

Let's build a card grid that adapts across three breakpoints:

```
Mobile (< 640px)      Tablet (≥ 640px)       Desktop (≥ 1024px)
┌────────────┐        ┌──────┐ ┌──────┐      ┌────┐ ┌────┐ ┌────┐
│   Card 1   │        │Card 1│ │Card 2│      │ C1 │ │ C2 │ │ C3 │
└────────────┘        └──────┘ └──────┘      └────┘ └────┘ └────┘
┌────────────┐        ┌──────┐ ┌──────┐      ┌────┐ ┌────┐ ┌────┐
│   Card 2   │        │Card 3│ │Card 4│      │ C4 │ │ C5 │ │ C6 │
└────────────┘        └──────┘ └──────┘      └────┘ └────┘ └────┘
    1 column              2 columns               3 columns
```

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

  <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
    <div class="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
      <span class="text-blue-600 font-bold">01</span>
    </div>
    <h3 class="text-gray-900 font-semibold text-lg mb-2">Feature One</h3>
    <p class="text-gray-500 text-sm leading-relaxed">
      A brief description of this feature and why it matters to your users.
    </p>
  </div>

  <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
    <div class="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mb-4">
      <span class="text-green-600 font-bold">02</span>
    </div>
    <h3 class="text-gray-900 font-semibold text-lg mb-2">Feature Two</h3>
    <p class="text-gray-500 text-sm leading-relaxed">
      Another key feature with a concise explanation.
    </p>
  </div>

  <div class="bg-white rounded-xl shadow p-6 border border-gray-100">
    <div class="h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
      <span class="text-purple-600 font-bold">03</span>
    </div>
    <h3 class="text-gray-900 font-semibold text-lg mb-2">Feature Three</h3>
    <p class="text-gray-500 text-sm leading-relaxed">
      The third feature rounds out the offering.
    </p>
  </div>

</div>
```

The grid starts with `grid-cols-1` (one column for mobile), overrides to `sm:grid-cols-2` at 640px, and overrides again to `lg:grid-cols-3` at 1024px. The `gap-6` applies at all sizes, giving consistent spacing between cards regardless of layout.

## Responsive Navigation

A full responsive nav requires three things: a logo (always visible), desktop links (hidden on mobile), and a hamburger button (hidden on desktop):

```html
<nav class="bg-white border-b border-gray-200">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-16">

      <!-- Logo: always visible -->
      <a href="/" class="text-xl font-bold text-gray-900">
        Brand
      </a>

      <!-- Desktop links: hidden on mobile, flex row on lg+ -->
      <ul class="hidden lg:flex items-center gap-8 list-none m-0">
        <li>
          <a href="/about"
             class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            About
          </a>
        </li>
        <li>
          <a href="/work"
             class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            Work
          </a>
        </li>
        <li>
          <a href="/contact"
             class="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
            Contact
          </a>
        </li>
        <li>
          <a href="/start"
             class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Get Started
          </a>
        </li>
      </ul>

      <!-- Hamburger button: visible on mobile, hidden on lg+ -->
      <button
        id="menu-toggle"
        class="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
        aria-label="Open navigation menu"
        aria-expanded="false">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

    </div>
  </div>
</nav>
```

Note: this nav hides and shows the right elements at the right breakpoints, but the hamburger button does not yet *do* anything — you will wire that up with JavaScript in Module 03.

## Responsive Typography

Good responsive typography is not just about making text bigger on desktop — it is about maintaining readable line lengths and appropriate visual hierarchy at every size:

```html
<!-- Hero headline: scales dramatically -->
<h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
  Ship faster.<br />
  <span class="text-blue-500">Break nothing.</span>
</h1>

<!-- Body copy: cap the width to maintain readable line length -->
<p class="text-base lg:text-lg text-gray-600 max-w-xl leading-relaxed">
  A full-stack framework for teams who care about type safety and developer experience.
</p>

<!-- Section heading: moderate scaling -->
<h2 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
  Why teams choose us
</h2>
```

The `max-w-xl` on the body copy is not just decoration — it keeps the paragraph from stretching to an unreadable 100+ characters per line on wide screens. A comfortable line length is 60–80 characters.

## A Full Responsive Hero Section

Here is how responsive techniques combine in a real component:

```html
<section class="min-h-screen flex items-center bg-gray-950 text-white">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

    <!-- On mobile: stack vertically. On desktop: side by side. -->
    <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

      <!-- Text: centered on mobile, left-aligned on desktop -->
      <div class="flex-1 text-center lg:text-left">
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight">
          Ship faster.<br />
          <span class="text-blue-400">Break nothing.</span>
        </h1>

        <p class="mt-6 text-lg lg:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
          A full-stack framework for teams who care about type safety.
        </p>

        <!-- Buttons: stacked on mobile, side by side on sm+ -->
        <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <a href="#"
             class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors text-center">
            Get started
          </a>
          <a href="#"
             class="px-8 py-3 border border-gray-700 hover:border-gray-500 text-gray-300 font-semibold rounded-lg transition-colors text-center">
            View docs
          </a>
        </div>
      </div>

      <!-- Code panel: full width on mobile, right column on desktop -->
      <div class="flex-1 w-full max-w-lg lg:max-w-none">
        <div class="bg-gray-800 rounded-2xl p-6 font-mono text-sm text-green-400 shadow-2xl">
          <p class="text-gray-500 mb-2">// app/api/users/route.ts</p>
          <p>export async function GET() &#123;</p>
          <p class="pl-4">const users = await db.user.findMany();</p>
          <p class="pl-4">return Response.json(users);</p>
          <p>&#125;</p>
        </div>
      </div>

    </div>
  </div>
</section>
```

Walk through the responsive behavior:
- The outer flex container is `flex-col` on mobile (text above, code below) and `lg:flex-row` on desktop (text left, code right)
- The headline scales from `text-4xl` to `text-7xl` across breakpoints
- The text alignment shifts from `text-center` on mobile to `lg:text-left` on desktop
- The paragraph uses `mx-auto` to center on mobile and `lg:mx-0` to left-align on desktop
- The button row is `flex-col` (stacked) on mobile and `sm:flex-row` (side by side) on small tablets and up
- Button justify is `justify-center` by default and `lg:justify-start` on desktop

This is 6 responsive decisions in 40 lines of HTML. Equivalent CSS would be 60+ lines split between the stylesheet and at least 3 media query blocks.

## Testing Responsiveness

Open Chrome or Firefox DevTools and click the device toolbar icon (or press Cmd+Shift+M on Mac). Test your layout at these three sizes:
- **375px** — iPhone SE / smallest modern phone
- **768px** — iPad portrait
- **1280px** — standard laptop

:::tip Quick test method
Resize your browser window by dragging the edge. Watch where your layout breaks. If something looks wrong at 520px, you can add `sm:` prefix adjustments to fix it. You do not need to target every device — you need to find the widths where your layout stops looking right and add breakpoints there.
:::

## Scaffolded Activity

Take the card grid and navigation from your Module 01 project and make them fully responsive.

**Starter structure (add the breakpoint classes):**

```html
<!-- Navigation: complete these class attributes -->
<nav class="border-b border-gray-200 bg-white">
  <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
    <a href="/" class="font-bold text-lg">Brand</a>

    <!-- Add: hidden on mobile, flex on lg+ -->
    <ul class="___">
      <li><a href="#">About</a></li>
      <li><a href="#">Work</a></li>
    </ul>

    <!-- Add: visible on mobile, hidden on lg+ -->
    <button class="___">Menu</button>
  </div>
</nav>

<!-- Card grid: 1 col → 2 col → 3 col -->
<div class="grid ___ gap-6 max-w-7xl mx-auto px-4 py-12">
  <div class="bg-white rounded-xl shadow p-6">Card 1</div>
  <div class="bg-white rounded-xl shadow p-6">Card 2</div>
  <div class="bg-white rounded-xl shadow p-6">Card 3</div>
  <div class="bg-white rounded-xl shadow p-6">Card 4</div>
  <div class="bg-white rounded-xl shadow p-6">Card 5</div>
  <div class="bg-white rounded-xl shadow p-6">Card 6</div>
</div>
```

**Success check:**
- At 375px: single-column cards, hamburger button visible, nav links hidden
- At 768px: two-column cards, hamburger button still visible
- At 1280px: three-column cards, nav links visible, hamburger hidden

## Key Takeaways

- When you write responsive classes, always start with the mobile style (no prefix), then override with `sm:`, `md:`, `lg:` as screens get wider — because Tailwind uses a mobile-first min-width model.
- When you need to hide something on mobile and show it on desktop, write `hidden lg:block` (two classes) — because `hidden` sets the base, and `lg:block` overrides it at the breakpoint.
- When a layout has two columns on desktop and one on mobile, use `grid-cols-1 lg:grid-cols-2` on the grid container — because breakpoint prefixes override the base value, not a range.
- When body copy is too wide on large screens, add `max-w-prose` or `max-w-xl` — because readable line length is a design concern, not just a visual one.
