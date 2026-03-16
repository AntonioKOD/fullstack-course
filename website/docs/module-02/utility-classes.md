---
sidebar_position: 3
title: Utility Classes
---

# Tailwind Utility Classes

:::info Learning Objectives
By the end of this lesson you will be able to:

- Decode the Tailwind naming system to derive class names you have never looked up
- Apply spacing, typography, color, layout, and border utilities confidently
- Use state variants (`hover:`, `focus:`, `active:`, `group-hover:`) to add interactivity without JavaScript
- Build a complete styled button component from scratch using only utilities
:::

## The Naming System: Learn to Derive, Not Memorize

The most important thing to understand about Tailwind is that it has a *system*, not a random collection of names. Once you learn the system, you can often guess a class name correctly on the first try.

The pattern is:

```
{property-abbreviation}-{value}
```

For example:
- `p` = padding, `m` = margin, `w` = width, `h` = height
- `t` = top, `b` = bottom, `l` = left, `r` = right, `x` = horizontal, `y` = vertical
- `bg` = background, `text` = color or font-size, `border` = border
- Numbers follow a scale where **1 unit = 0.25rem (4px)**

So `pt-8` means "padding-top, value 8", and since 8 × 0.25rem = 2rem = 32px, you get `padding-top: 2rem`.

You do not need to memorize the scale table. You need to memorize one fact: **1 = 4px**. Then you can calculate any value in your head.

| Scale value | Rem | Pixels |
|---|---|---|
| 1 | 0.25rem | 4px |
| 2 | 0.5rem | 8px |
| 4 | 1rem | 16px |
| 6 | 1.5rem | 24px |
| 8 | 2rem | 32px |
| 12 | 3rem | 48px |
| 16 | 4rem | 64px |
| 24 | 6rem | 96px |

:::tip The mental shortcut
If a designer hands you a Figma file saying "this section needs 48px padding", you divide by 4: 48 / 4 = 12, so you use `p-12`. This works for any spacing value that is a multiple of 4.
:::

## Spacing: Padding and Margin

Here is how to visualize what padding classes actually do to a box:

```
┌─────────────────────────────────────────┐
│              p-4 (1rem all sides)        │
│   ┌─────────────────────────────────┐   │
│   │                                 │   │
│   │         your content            │   │
│   │                                 │   │
│   └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│  px-8 (2rem left/right)  py-4 (1rem top/bot) │
│  ←────→                                ←────→│
│        ┌──────────────────────────────┐       │
│        │         your content         │       │
│        └──────────────────────────────┘       │
│                                               │
└──────────────────────────────────────────────┘
```

```html
<!-- All sides -->
<div class="p-4">1rem padding on all four sides</div>

<!-- Axes (x = left+right, y = top+bottom) -->
<div class="px-8 py-4">2rem horizontal, 1rem vertical</div>

<!-- Individual sides -->
<div class="pt-8 pb-4 pl-6 pr-6">top 2rem, bottom 1rem, sides 1.5rem</div>

<!-- Margin works the same way -->
<div class="m-4">1rem margin all sides</div>
<div class="mx-auto">center horizontally (auto left+right margin)</div>
<div class="mt-16 mb-8">top 4rem, bottom 2rem</div>

<!-- Gap: spacing between flex or grid children -->
<div class="flex gap-4">children have 1rem gap between them</div>
<div class="grid grid-cols-3 gap-x-6 gap-y-4">different horizontal and vertical gaps</div>
```

After this code runs, you will see each `div` gain exactly the spacing specified. The `mx-auto` pattern is particularly important: it is how you center a block element horizontally inside its container, and you will use it on nearly every page-level container div.

:::warning Common Mistake
`mx-auto` only works when the element has a defined width. If a `div` has `width: 100%` (which is the default for block elements), there is nothing to center — it is already filling the container. You typically use `mx-auto` together with a `max-w-*` class: `class="max-w-7xl mx-auto"`.
:::

## Typography

Font sizes use named scale steps rather than numbers. This is intentional — it encourages consistent typography instead of arbitrary sizes:

```html
<!-- Font sizes (named scale) -->
<p class="text-xs">0.75rem — small labels, captions</p>
<p class="text-sm">0.875rem — secondary text, inputs</p>
<p class="text-base">1rem — body copy (browser default)</p>
<p class="text-lg">1.125rem — slightly emphasized text</p>
<p class="text-xl">1.25rem — small headings</p>
<p class="text-2xl">1.5rem — section headings</p>
<p class="text-3xl">1.875rem — page headings</p>
<p class="text-4xl">2.25rem — hero text</p>
<p class="text-6xl">3.75rem — large display text</p>

<!-- Font weight -->
<p class="font-normal">Regular (400) — body text</p>
<p class="font-medium">Medium (500) — slightly emphasized</p>
<p class="font-semibold">Semibold (600) — sub-headings</p>
<p class="font-bold">Bold (700) — headings, buttons</p>
<p class="font-extrabold">Extrabold (800) — hero headlines</p>

<!-- Line height -->
<p class="leading-tight">Tight (1.25) — headings</p>
<p class="leading-normal">Normal (1.5) — body text</p>
<p class="leading-relaxed">Relaxed (1.625) — longer readable text</p>

<!-- Letter spacing -->
<p class="tracking-tight">Tight tracking — large headlines</p>
<p class="tracking-normal">Normal tracking — body text</p>
<p class="tracking-wide">Wide tracking — uppercase labels</p>
<p class="tracking-widest">Widest — all-caps small labels</p>

<!-- Alignment -->
<p class="text-left">Left aligned</p>
<p class="text-center">Centered</p>
<p class="text-right">Right aligned</p>
```

A typical hero headline might combine several of these:

```html
<h1 class="text-5xl font-extrabold tracking-tight leading-tight">
  Build something people love
</h1>
```

## Colors

Tailwind ships with a full palette organized by color name and shade number. The shade goes from `50` (almost white) to `950` (almost black). The midpoint `500` is the "true" version of each color.

```
gray-50   gray-100   gray-200   gray-300   gray-400
gray-500  gray-600   gray-700   gray-800   gray-900   gray-950
                                           ↑ dark bg   ↑ darker bg
                        ↑ muted text
         ↑ light border
↑ very light bg
```

The pattern for using colors:
- **Backgrounds**: `bg-{color}-{shade}` — e.g. `bg-blue-600`
- **Text**: `text-{color}-{shade}` — e.g. `text-gray-900`
- **Borders**: `border-{color}-{shade}` — e.g. `border-gray-200`

```html
<!-- Background colors -->
<div class="bg-blue-500">True blue</div>
<div class="bg-blue-600 hover:bg-blue-700">Darker on hover</div>

<!-- Light surface with dark text (light mode card) -->
<div class="bg-gray-100 text-gray-900">Light card</div>

<!-- Dark surface with light text (dark mode card) -->
<div class="bg-gray-900 text-gray-100">Dark card</div>

<!-- Semantic status colors — use the 100/800 pairing for readable badges -->
<div class="bg-green-100 text-green-800">Success</div>
<div class="bg-red-100 text-red-800">Error</div>
<div class="bg-yellow-100 text-yellow-800">Warning</div>
<div class="bg-blue-100 text-blue-800">Info</div>
```

The 100/800 pairing (light background, dark text of the same hue) is a reliable pattern for badges and alert banners because the 8:1 contrast ratio passes accessibility guidelines for normal text.

:::tip The 500/600/700 button pattern
For interactive buttons, a common pattern is: `bg-blue-600` (default), `hover:bg-blue-700` (hover), `active:bg-blue-800` (pressed). Each step is one shade darker, giving clear visual feedback without needing to define any new colors.
:::

## Layout: Flexbox

Here is what the most common flex patterns look like visually:

```
flex items-center justify-between:
┌──────────────────────────────────────────┐
│  [item A]                      [item B]  │
└──────────────────────────────────────────┘

flex items-center justify-center gap-4:
┌──────────────────────────────────────────┐
│          [item A]  [item B]              │
└──────────────────────────────────────────┘

flex flex-col items-center gap-6:
┌──────────────────────────────────────────┐
│               [item A]                   │
│               [item B]                   │
│               [item C]                   │
└──────────────────────────────────────────┘
```

```html
<!-- Row with items pushed apart (navbar pattern) -->
<div class="flex items-center justify-between">
  <span>Logo</span>
  <nav>Links</nav>
</div>

<!-- Centered row (button group, tag list) -->
<div class="flex items-center justify-center gap-4">
  <button>One</button>
  <button>Two</button>
</div>

<!-- Column stack (card body, form fields) -->
<div class="flex flex-col gap-4">
  <label>Name</label>
  <input type="text" />
  <button>Submit</button>
</div>

<!-- Flex child grows to fill available space -->
<div class="flex gap-4">
  <aside class="w-64">Fixed sidebar</aside>
  <main class="flex-1">This takes remaining width</main>
</div>
```

## Layout: Grid

Grid shines when you have multiple columns of equal or predictable widths:

```
grid grid-cols-3 gap-6:
┌──────────┐  ┌──────────┐  ┌──────────┐
│  card 1  │  │  card 2  │  │  card 3  │
└──────────┘  └──────────┘  └──────────┘
┌──────────┐  ┌──────────┐  ┌──────────┐
│  card 4  │  │  card 5  │  │  card 6  │
└──────────┘  └──────────┘  └──────────┘

grid grid-cols-12 gap-4 with col-span:
┌──────┐  ┌────────────────────────────┐
│  3   │  │            9               │
│ cols │  │           cols             │
└──────┘  └────────────────────────────┘
```

```html
<!-- Equal three-column card grid -->
<div class="grid grid-cols-3 gap-6">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Classic sidebar + content layout using 12-column grid -->
<div class="grid grid-cols-12 gap-6">
  <aside class="col-span-3">Sidebar</aside>
  <main class="col-span-9">Content</main>
</div>

<!-- Auto-fit grid: columns resize to fill space, minimum 250px wide -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6">
  <div>Auto-sizing card</div>
</div>
```

:::warning Common Mistake
`grid-cols-3` does not make children that are 1/3 wide — it creates three column *tracks*. Each child automatically fills one track. If you have 4 children in a `grid-cols-3` container, the 4th child wraps to the second row and fills the first track of that row (not the full width). This is usually what you want, but confuses people who expect it to behave like flexbox.
:::

## Sizing

```html
<!-- Width -->
<div class="w-full">100% of parent</div>
<div class="w-1/2">50% of parent</div>
<div class="w-64">16rem (256px)</div>
<div class="w-screen">100vw — full viewport width</div>

<!-- Max width — crucial for readable line length -->
<div class="max-w-2xl mx-auto">Max 42rem, centered</div>
<div class="max-w-7xl mx-auto px-4">Common page container (1280px max)</div>

<!-- Height -->
<div class="h-screen">100vh — fills viewport</div>
<div class="min-h-screen">At least 100vh — grows with content</div>
<div class="h-64">16rem tall</div>
```

Use `min-h-screen` instead of `h-screen` for page-level containers. `h-screen` sets the height to exactly 100vh, which means the page stops there even if the content is taller. `min-h-screen` sets the *minimum* height to 100vh, so short pages fill the viewport but tall pages still scroll.

## Borders and Shadows

```html
<!-- Border width and color -->
<div class="border border-gray-200">1px solid, light gray</div>
<div class="border-2 border-blue-500">2px solid, blue</div>
<div class="border-b border-gray-100">Bottom border only (divider)</div>

<!-- Border radius -->
<div class="rounded">4px — subtle rounding</div>
<div class="rounded-lg">8px — standard cards, buttons</div>
<div class="rounded-xl">12px — larger cards</div>
<div class="rounded-2xl">16px — prominent cards</div>
<div class="rounded-full">9999px — perfect circles or pill buttons</div>

<!-- Box shadows -->
<div class="shadow-sm">Barely there — inputs, secondary elements</div>
<div class="shadow">Default — cards</div>
<div class="shadow-md">Medium — floating elements</div>
<div class="shadow-lg">Prominent — modals, dropdowns</div>
<div class="shadow-xl">Strong — overlays</div>
```

## State Variants

State variants apply styles conditionally based on user interaction. The syntax is `{variant}:{utility}`:

```html
<!-- Hover state -->
<button class="bg-blue-500 hover:bg-blue-600 transition-colors">
  Color changes on hover
</button>

<!-- Focus state (important for accessibility) -->
<input class="border focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

<!-- Active state (pressed) -->
<button class="active:scale-95 transition-transform">
  Scales down when pressed
</button>

<!-- Disabled state -->
<button class="opacity-100 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
  Visually disabled
</button>
```

The `transition-colors` and `transition-transform` utilities add CSS transitions so state changes animate smoothly instead of snapping instantly.

### Group Hover

Sometimes you need a child element to respond when its *parent* is hovered. This is the `group` pattern:

```html
<!-- Add "group" to the parent -->
<div class="group cursor-pointer rounded-xl p-6 bg-white border border-gray-200">

  <!-- Children use "group-hover:" to respond to the parent's hover state -->
  <h3 class="text-gray-900 group-hover:text-blue-600 transition-colors font-semibold">
    Card Title
  </h3>
  <p class="text-gray-500 group-hover:text-gray-700 transition-colors text-sm">
    Descriptive text that subtly changes too
  </p>

  <!-- Arrow that only appears on hover -->
  <span class="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm">
    Learn more →
  </span>

</div>
```

When you hover over the outer `div` (which has the `group` class), all three child elements respond simultaneously — the title turns blue, the text darkens, and the arrow appears. This is pure CSS with no JavaScript.

:::warning Common Mistake
Forgetting `transition-colors` (or the appropriate transition) on elements with hover states. Without it, the color change is instantaneous and looks janky. Always pair `hover:bg-*` or `hover:text-*` with `transition-colors duration-150` for polished results.
:::

## Putting It Together: A Complete Button

Here is a production-quality button built entirely from utilities. Study each line and notice how every class has a clear reason:

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

Reading through it: the button lays out its contents in a flex row with a small gap (for when you add an icon). It has balanced padding. The background has three states: default, hover, active. The text is white, small, and medium-weight. Corners are rounded. There is a subtle shadow. Color changes transition smoothly. The focus ring is visible for keyboard users. When disabled, it fades out and shows a no-cursor icon.

This is about 12 classes for a complete, accessible, production-ready button. In vanilla CSS this would be 25+ lines across two files.

## Scaffolded Activity

Rebuild the card component from your Module 01 layout using only Tailwind utilities. No custom CSS.

**Starter HTML:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="./src/style.css" />
  <title>Utility Classes Practice</title>
</head>
<body class="bg-gray-50 min-h-screen p-8">

  <!-- Your task: style this card using only Tailwind utility classes -->
  <!-- No editing the CSS file — everything goes in the class="" attributes -->

  <div class="">  <!-- outer card container -->
    <div class="">  <!-- image placeholder -->
      <!-- Make this a 48px tall gray box with rounded top corners -->
    </div>
    <div class="">  <!-- card body -->
      <span class="">New</span>  <!-- badge: blue background, blue text, small, rounded-full -->
      <h3 class="">Card Title</h3>  <!-- semibold, gray-900, text-lg, mt-2 -->
      <p class="">Short description of the card content goes here.</p>  <!-- gray-500, text-sm, mt-1 -->
      <button class="">Read More</button>  <!-- full button treatment from the lesson -->
    </div>
  </div>

</body>
</html>
```

**Success check:**
- The card has a white background, rounded corners, and a visible shadow
- The badge is pill-shaped with a blue tint
- The button changes color on hover and shows a focus ring when tabbed to
- All text is legible with appropriate size contrast between title and description

## Key Takeaways

- When you see a spacing value in pixels and it is a multiple of 4, divide by 4 to get the Tailwind scale number — because the scale is 1 = 4px.
- When you need a color, pick the `500` shade as your starting point and go up (600, 700) for hover/active states, because the 500 shade is the "true" version of each color.
- When an element needs to respond to parent hover, add `group` to the parent and `group-hover:` to the children — because Tailwind generates the necessary `:hover` CSS selector on your behalf.
- When you add hover state colors, always pair them with `transition-colors duration-150` — because instant color changes look cheap.
