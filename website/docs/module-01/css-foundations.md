---
sidebar_position: 4
title: CSS Foundations
---

# CSS Foundations

:::info Learning Objectives
By the end of this lesson you will be able to:
- Read and write CSS rules correctly, targeting elements by type, class, and relationship
- Explain the box model and predict how padding, border, and margin affect element dimensions
- Use CSS custom properties to build a design system with reusable values for colors, spacing, and typography
- Determine which of two conflicting CSS rules will win using specificity rules
- Add dark mode support using a media query and CSS variable overrides — with zero JavaScript
:::

## Why This Matters

In Module 02 you will learn Tailwind CSS. Tailwind is a utility-first framework where you apply styles by adding pre-built class names like `text-blue-500` or `p-4`. It is fast and popular, but it is CSS underneath every class. When something does not look right and you need to debug it — or when Tailwind's defaults are not enough — you need to understand the underlying CSS properties.

Understanding CSS also means you can read the output of any framework. When you open DevTools in a browser and inspect an element, you see raw CSS. The frameworks abstract away the syntax, but the concepts (box model, cascade, specificity, layout) are always there. This lesson gives you those concepts.

## How CSS Works

CSS stands for Cascading Style Sheets. The word "cascading" is key — it describes how the browser resolves conflicts when multiple rules try to style the same element. Understanding the cascade is what separates developers who can debug styling issues from those who just add `!important` everywhere until something works.

A CSS rule has two parts: a selector that says which elements to target, and a declaration block with property-value pairs that say how to style them.

```css
/* selector → targets which elements */
/* declaration block → says what to do */

p {
  color: #374151;        /* property: value; */
  font-size: 1rem;
  line-height: 1.6;
}
```

The selector `p` targets every `<p>` element on the page. Each line inside the curly braces is a declaration: a property name, a colon, a value, and a semicolon. The semicolon is required.

You can target elements in several ways:

```css
/* By element type — affects every p on the page */
p {
  color: #374151;
}

/* By class — affects any element with class="card" */
.card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

/* By ID — affects the single element with id="hero" */
/* Use ID selectors sparingly — see Specificity section */
#hero {
  min-height: 100vh;
}
```

CSS files are applied to an HTML page by adding a `<link>` element in the `<head>`:

```html
<link rel="stylesheet" href="./styles.css" />
```

The browser downloads and parses the CSS file, then applies the rules to the DOM it built from the HTML.

## CSS Custom Properties (Variables)

Before diving into individual properties, let's establish the most important modern CSS habit: using custom properties (also called CSS variables) to define your design's values in one place.

A custom property is a named value you define once and reuse throughout your stylesheet. If you want to change your brand's primary color, you update it in one place and it propagates everywhere — instead of searching for every instance of `#3b82f6` scattered across hundreds of lines.

Custom properties are defined with a double-dash prefix and must be inside a selector to be scoped:

```css
/* :root targets the <html> element — highest scope, available everywhere */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-border: #e5e7eb;

  /* Spacing scale — based on a 4px grid */
  --space-1: 0.25rem;   /*  4px */
  --space-2: 0.5rem;    /*  8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-16: 4rem;     /* 64px */

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-sm: 0.875rem;    /* 14px */
  --text-base: 1rem;      /* 16px */
  --text-lg: 1.125rem;    /* 18px */
  --text-xl: 1.25rem;     /* 20px */
  --text-2xl: 1.5rem;     /* 24px */
  --text-4xl: 2.25rem;    /* 36px */

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;  /* pill shape */

  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
```

Use the variables with the `var()` function:

```css
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  font-size: var(--text-base);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}

.card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
}
```

The `var()` function also accepts a fallback value as its second argument: `var(--color-primary, blue)` will use `blue` if `--color-primary` is not defined. This is useful when a variable might not be available in all contexts.

## Dark Mode with Custom Properties

One of the most powerful applications of CSS custom properties is dark mode. Because variables are defined at `:root`, you can override them all in a single `@media` block — and every element that uses those variables updates automatically.

```css
/* Light mode defaults (defined in :root above) */
:root {
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-border: #e5e7eb;
}

/* Override the variables when the OS is set to dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-bg-subtle: #1f2937;
    --color-text: #f9fafb;
    --color-text-muted: #9ca3af;
    --color-border: #374151;
  }
}

/* These rules never change — they always reference variables */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}

.card {
  background-color: var(--color-bg-subtle);
  border-color: var(--color-border);
}
```

This is how professional websites implement dark mode without any JavaScript. The `prefers-color-scheme` media query reads the user's operating system preference. Every element on the page responds because they all use variables — you do not have to write separate dark-mode styles for each component.

## The Box Model

Every element in CSS is a rectangular box. Understanding how that box is constructed — and how its dimensions are calculated — is fundamental to building layouts.

The box model has four layers, from inside to outside:

```
┌─────────────────────────────────────────────┐
│                   MARGIN                    │
│    (space outside, between elements)        │
│  ┌───────────────────────────────────────┐  │
│  │               BORDER                 │  │
│  │    (the visible edge of the box)      │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │             PADDING             │  │  │
│  │  │  (space inside, around content) │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │         CONTENT           │  │  │  │
│  │  │  │  (text, images, children) │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

By default, CSS uses `box-sizing: content-box`, which means when you set `width: 300px`, that 300px is only the content area. Padding and border are added on top of it:

```
width: 300px + padding-left: 20px + padding-right: 20px + border: 2px + border: 2px
= 344px total rendered width
```

This surprises nearly every beginner and makes precise layouts much harder to reason about. The fix is `box-sizing: border-box`, which changes the calculation so that `width: 300px` means the entire box — content, padding, and border — is 300px wide.

Put this at the top of every stylesheet you write:

```css
/* CSS reset — put this at the top of every stylesheet */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
```

The `*` selector matches every element. `*::before` and `*::after` catch pseudo-elements. Setting `margin: 0` and `padding: 0` removes browser default spacing (browsers add margins to headings, paragraphs, and lists by default — removing them gives you a clean slate).

```css
/* After the reset, you control all spacing explicitly */
.card {
  width: 300px;     /* total box width: exactly 300px */
  padding: 1.5rem;  /* space inside, does not add to 300px */
  border: 1px solid var(--color-border);  /* does not add to 300px */
  margin: 1rem;     /* space outside — does not affect width */
}
```

:::warning Common Mistake
Setting `width: 50%` on an element and then adding padding, expecting it to still fill exactly 50% of its parent. Without `box-sizing: border-box`, the padding makes it wider than 50% and causes overflow. Always include the reset.
:::

## Selectors You Must Know

CSS selectors give you fine-grained control over which elements a rule applies to. Here are the patterns you will reach for regularly:

```css
/* Element — targets all elements of that type */
h2 { font-size: var(--text-2xl); }

/* Class — targets any element with that class */
.card { border-radius: var(--radius-lg); }

/* ID — targets one specific element (use sparingly) */
#main-nav { position: sticky; top: 0; }

/* Descendant — targets any p that is inside .card, at any depth */
.card p { color: var(--color-text-muted); }

/* Direct child — targets li that is a direct child of .nav, not deeper */
.nav > li { display: inline-block; }

/* Adjacent sibling — targets the first p immediately after an h2 */
h2 + p { margin-top: var(--space-2); }

/* General sibling — targets all p elements that follow an h2 */
h2 ~ p { line-height: 1.7; }

/* Pseudo-class — a state the element can be in */
a:hover { color: var(--color-primary); }
input:focus { outline: 2px solid var(--color-primary); }
li:first-child { margin-top: 0; }
li:last-child { margin-bottom: 0; }
li:nth-child(odd) { background-color: var(--color-bg-subtle); }

/* Pseudo-element — targets a virtual part of the element */
p::first-line { font-weight: 600; }
.card::before {
  content: '';  /* required even if empty — pseudo-elements need content */
  display: block;
  height: 4px;
  background-color: var(--color-primary);
  border-radius: var(--radius-sm);
}

/* Attribute selector — targets elements based on their attributes */
input[type="email"] { padding-left: var(--space-8); }
a[href^="https"] { /* href starts with https */ }
a[href$=".pdf"]  { /* href ends with .pdf */ }
a[href*="docs"]  { /* href contains "docs" */ }
```

## Specificity — Why Your Styles Do Not Apply

When two CSS rules target the same element and set the same property, the browser has to pick one. The rule with higher *specificity* wins. Every selector has a specificity score calculated from three categories.

Think of specificity as a three-digit number where each digit is a count:

```
[ID count] - [class/attribute/pseudo-class count] - [element/pseudo-element count]
```

| Selector | IDs | Classes | Elements | Score |
|----------|-----|---------|----------|-------|
| `*` | 0 | 0 | 0 | 0-0-0 |
| `p` | 0 | 0 | 1 | 0-0-1 |
| `.card` | 0 | 1 | 0 | 0-1-0 |
| `.card p` | 0 | 1 | 1 | 0-1-1 |
| `#header` | 1 | 0 | 0 | 1-0-0 |
| `#header .nav a` | 1 | 1 | 1 | 1-1-1 |
| Inline `style=""` | — | — | — | 1-0-0-0 |

Higher is more specific. If scores are equal, the rule that appears later in the stylesheet wins.

```css
/* Specificity: 0-1-0 = 10 */
.card {
  color: blue;
}

/* Specificity: 0-0-1 = 1 — loses, because .card is more specific */
p {
  color: red;
}

/* Specificity: 0-2-1 = 21 — wins over .card */
.sidebar .card p {
  color: green;
}
```

:::warning Common Mistake
Using `!important` to override a style you cannot figure out. `!important` does not fix a specificity problem — it creates a new one. The next time you need to override that style, you need another `!important`. And then another. It escalates. Instead: open DevTools, inspect the element, find which rule is winning and why, then write a more specific (or later) rule to override it properly.
:::

The best approach: keep specificity low by styling with classes (specificity score: 10). Avoid ID selectors for styling, avoid deeply nested selectors, and never use `!important` except as a last resort in a utility class.

## Typography

Typography is the invisible structure that makes text readable. A few well-set properties do most of the work:

```css
body {
  font-family: var(--font-sans);
  font-size: 16px;      /* base font size — rem values will scale from this */
  line-height: 1.5;     /* comfortable reading: line height = 1.5 × font size */
  color: var(--color-text);
}

h1 {
  font-size: var(--text-4xl);   /* 2.25rem = 36px at default browser settings */
  font-weight: 700;
  line-height: 1.2;             /* tighter line height for headings — they are larger */
  letter-spacing: -0.02em;      /* slight tightening, common in modern design */
}

h2 {
  font-size: var(--text-2xl);
  font-weight: 600;
  line-height: 1.3;
}

/* Fluid typography: scales smoothly with viewport width */
/* clamp(min, preferred, max) — never smaller than min, never larger than max */
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}
```

A few values to know:
- `line-height` without a unit (like `1.5`) is a multiplier of the current font size. This is usually better than a fixed pixel value, because it scales automatically when font size changes.
- `letter-spacing` in `em` units is relative to the current font size, so it scales correctly across different heading levels.
- `clamp()` takes three arguments: minimum value, ideal value, maximum value. It gives you fluid typography without media queries.

## Putting It Together: A Styled Card Component

Here is how everything in this lesson combines to produce a real component:

```css
/* 1. Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 2. Design tokens */
:root {
  --color-primary: #3b82f6;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-border: #e5e7eb;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --radius-lg: 1rem;
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* 3. Component styles using variables */
.card {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  font-family: var(--font-sans);
}

/* 4. Descendant selector to style content within the card */
.card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-2);
}

.card p {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.6;
}

/* 5. Pseudo-class for interactive state */
.card a:hover {
  color: var(--color-primary);
}
```

## Activity

You will build a complete CSS file that styles the `index.html` from the HTML Fundamentals activity. By the end, it should look like a real webpage — not a wall of unstyled text.

**Steps:**

1. Create `styles.css` in the same folder as your `index.html` and link it in the `<head>`.
2. Write the CSS reset at the very top: `*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`.
3. Add a `:root` block with at least 8 custom properties: two colors, a text color, a muted text color, a background color, two spacing values, and a border-radius value.
4. Add dark mode support: write a `@media (prefers-color-scheme: dark)` block inside `:root` that overrides at least the background and text color variables.
5. Style the `body`: set `font-family`, `font-size`, `line-height`, `background-color`, and `color` — all using your variables.
6. Style the `header`: give it a background, some padding, and a bottom border.
7. Style the `nav ul` and `nav li`: use `list-style: none` and display the links horizontally with spacing between them.
8. Style the heading levels with different sizes using your typography variables.
9. Style at least one `<article>` as a card: background, border, padding, and border-radius from your variables.
10. Add a hover state to the nav links with a color change using `a:hover`.

:::tip Success Check
You are done when: (1) the page looks styled and readable in the browser with no unstyled elements, (2) opening DevTools and removing your `:root` CSS custom properties causes the page to lose its styles, (3) switching your OS to dark mode (Settings > Appearance > Dark) changes the page colors without reloading, and (4) DevTools shows no unresolved `var()` references (those appear as empty values).
:::

## Key Takeaways

- When X is your base font size and you write `line-height: 1.5`, use it without a unit — it scales automatically with the font size
- Use `box-sizing: border-box` and a CSS reset on every project — add it before writing any other styles
- Define all colors, spacing, and typography as CSS custom properties in `:root`; `prefers-color-scheme` lets you support dark mode with zero JavaScript by overriding those variables
- When a style is not applying, open DevTools, find the crossed-out rule, and read its specificity score — the fix is usually writing a more specific selector, not adding `!important`
- Keep selectors flat and low-specificity: `.card p` is usually better than `main section.projects article.card p`
