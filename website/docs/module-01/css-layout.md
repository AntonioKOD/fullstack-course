---
sidebar_position: 5
title: CSS Layout — Flexbox & Grid
---

# CSS Layout — Flexbox & Grid

:::info Learning Objectives
By the end of this lesson you will be able to:
- Explain the difference between Flexbox and Grid and choose the right one for any layout problem
- Use Flexbox's main axis and cross axis to align and distribute items in a row or column
- Use CSS Grid to define two-dimensional layouts with named areas
- Apply `repeat(auto-fit, minmax())` to build responsive grids without any media queries
- Write mobile-first CSS using `min-width` media queries to scale up from small screens
:::

## Why This Matters

Before Flexbox and Grid, CSS layout was done with floats and absolute positioning — techniques that were designed for other purposes and repurposed for layout in ways that were fragile and hard to reason about. If you have ever wondered why centering something in CSS used to be a meme, floats are the answer.

Flexbox and Grid are purpose-built for layout. Once you understand the mental models behind them, layout problems that previously took dozens of lines of fragile CSS become three or four properties. In Module 03 when you build your portfolio site, every layout decision — nav bars, project card grids, hero sections, full-page structure — will use exactly what you learn here.

## The Mental Model: Two Different Tools

Before writing a single line, understand what each system is for. They solve different problems and you will use them together.

:::note Mental Model
**Flexbox** = arrange items in a line.

You have a row of things (buttons, nav links, cards) or a column of things (form fields, stacked sections), and you want to control how they are spaced and aligned along that line.

**Grid** = place items on a map.

You have a two-dimensional space (a full page, a dashboard, a gallery), and you want to define rows and columns and put things in specific cells.

When you are thinking "I have a bunch of items and I want to control how they flow," reach for Flexbox. When you are thinking "I want to divide this space into regions and put specific things in specific places," reach for Grid.
:::

You will often use them together: Grid for the overall page structure, Flexbox for the components inside each region.

## Flexbox: Arranging Items in a Line

Flexbox works by designating a parent element as a flex container. Doing so turns all of its direct children into flex items that participate in a flex layout.

```css
.container {
  display: flex;
}
```

That single property transforms the children from stacking vertically (the default block behavior) into sitting side by side in a row.

### The Two Axes

Everything in Flexbox revolves around two axes:

```
FLEX-DIRECTION: ROW (default)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                    ← MAIN AXIS →
         ┌──────┐   ┌──────┐   ┌──────┐
         │ item │   │ item │   │ item │
         └──────┘   └──────┘   └──────┘
  ↑                                        ↑
  │              CROSS AXIS                │
  ↓                                        ↓

justify-content → controls spacing along the MAIN AXIS
align-items     → controls alignment along the CROSS AXIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FLEX-DIRECTION: COLUMN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
             ←  CROSS AXIS  →

  ┌────────────────────────────┐      ↑
  │           item             │      │
  └────────────────────────────┘      │
  ┌────────────────────────────┐   MAIN
  │           item             │   AXIS
  └────────────────────────────┘      │
  ┌────────────────────────────┐      │
  │           item             │      ↓

justify-content → now controls vertical spacing
align-items     → now controls horizontal alignment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The critical insight: **the axes flip when you change `flex-direction`**. `justify-content` always controls the main axis, and `align-items` always controls the cross axis — but which direction is "main" depends on `flex-direction`.

:::warning Common Mistake
Adding `align-items: center` to center something horizontally when the container has `flex-direction: column`. In a column, the cross axis is horizontal — so `align-items` controls left/right alignment. For vertical centering in a column, use `justify-content: center`. Get in the habit of asking "which axis am I on?" before reaching for these properties.
:::

### justify-content: Distributing Items on the Main Axis

`justify-content` controls how items are distributed along the main axis. The visual difference between the values is dramatic:

```
justify-content: flex-start  (default)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ [A][B][C]                               │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

justify-content: center
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│              [A][B][C]                  │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

justify-content: flex-end
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│                        [A][B][C]        │
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

justify-content: space-between
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│ [A]              [B]              [C]   │
  ^ items at edges, equal space between
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

justify-content: space-around
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│   [A]          [B]          [C]         │
  ^ equal space on both sides of each item
    (so edge gaps are half the inner gaps)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

justify-content: space-evenly
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
│     [A]          [B]          [C]       │
  ^ equal space between all items AND edges
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

`space-between` is the most commonly used — it pushes the first item to the start, the last item to the end, and distributes the rest evenly between them. This is the pattern for nav bars (logo on left, links on right).

### The Container Properties

```css
.container {
  display: flex;

  /* Direction of the main axis */
  flex-direction: row;          /* → default: left to right */
  flex-direction: row-reverse;  /* ← right to left */
  flex-direction: column;       /* ↓ top to bottom */
  flex-direction: column-reverse; /* ↑ bottom to top */

  /* Distribution on the main axis */
  justify-content: flex-start;    /* default — pack items at start */
  justify-content: center;        /* center items */
  justify-content: flex-end;      /* pack items at end */
  justify-content: space-between; /* first to start, last to end, rest even */
  justify-content: space-around;  /* equal margins on each side */
  justify-content: space-evenly;  /* equal gaps everywhere */

  /* Alignment on the cross axis */
  align-items: stretch;     /* default — items fill container height */
  align-items: center;      /* center items on cross axis */
  align-items: flex-start;  /* align items to start of cross axis */
  align-items: flex-end;    /* align items to end of cross axis */
  align-items: baseline;    /* align items by their text baseline */

  /* Wrap behavior */
  flex-wrap: nowrap;   /* default — all items on one line, may overflow */
  flex-wrap: wrap;     /* items wrap to next line when they overflow */

  /* Spacing between items — replaces the margin hack */
  gap: 1rem;            /* same gap in all directions */
  gap: 1rem 2rem;       /* row-gap column-gap */
  row-gap: 1rem;
  column-gap: 2rem;
}
```

### Flex Item Properties

These go on the children, not the container:

```css
.item {
  /* How much the item grows to fill available space */
  /* flex-grow: 1 means "take an equal share of leftover space" */
  flex-grow: 0;   /* default — do not grow */
  flex-grow: 1;   /* grow to fill available space */

  /* How much the item shrinks when there is not enough space */
  flex-shrink: 1;   /* default — shrink proportionally */
  flex-shrink: 0;   /* do not shrink — stay at base size */

  /* The starting size before grow/shrink is applied */
  flex-basis: auto;   /* default — use the element's natural size */
  flex-basis: 200px;  /* start at 200px, then grow/shrink */
  flex-basis: 0;      /* start at 0, then grow (used with flex-grow) */

  /* Shorthand: flex: grow shrink basis */
  flex: 1;           /* flex: 1 1 0 — grow and shrink equally */
  flex: 0 0 auto;    /* do not grow or shrink — fixed natural size */
  flex: 1 1 280px;   /* grow and shrink, but start at 280px minimum */

  /* Override cross-axis alignment for just this one item */
  align-self: flex-end;

  /* Move item to a different visual position without changing the DOM */
  order: -1;   /* move to the visual front */
  order: 2;    /* move to after any items with order 0 or 1 */
}
```

### Common Flexbox Patterns

**Navigation bar — logo on left, links on right:**

```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between; /* pushes logo and links to opposite ends */
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.navbar__links {
  display: flex;       /* the links list is ALSO a flex container */
  gap: 2rem;
  list-style: none;
}
```

**Perfectly centered element (the classic CSS challenge):**

```css
.hero {
  display: flex;
  flex-direction: column;    /* stack children vertically */
  align-items: center;       /* center horizontally */
  justify-content: center;   /* center vertically */
  min-height: 100vh;         /* fill the viewport height */
  text-align: center;
}
```

**Responsive card row that wraps:**

```css
.cards {
  display: flex;
  flex-wrap: wrap;        /* allow items to wrap to the next line */
  gap: 1.5rem;
}

.card {
  flex: 1 1 280px;  /* grow and shrink, but prefer at least 280px wide */
}
```

The `flex: 1 1 280px` pattern is powerful: items grow to fill available space, shrink when needed, but never go below 280px — so they naturally wrap to the next row when the container is too narrow for another 280px item.

## CSS Grid: Placing Items on a Map

Grid is for two-dimensional layouts — when you need to control both rows and columns. You define the structure (how many columns, how many rows, how wide each one is), and then you can place items anywhere in that structure.

### Defining a Grid

```css
.grid {
  display: grid;

  /* Define 3 equal columns */
  grid-template-columns: 1fr 1fr 1fr;

  /* Shorthand using repeat() */
  grid-template-columns: repeat(3, 1fr);

  /* Fixed + flexible columns */
  grid-template-columns: 250px 1fr;   /* sidebar + main content */

  /* Implicit rows — height is determined by content */
  grid-template-rows: auto;   /* default */

  /* Explicit row heights */
  grid-template-rows: 80px 1fr 60px;  /* header, content, footer */

  /* Space between cells */
  gap: 1.5rem;
  column-gap: 2rem;
  row-gap: 1rem;
}
```

The `fr` unit means "fraction of available space." `repeat(3, 1fr)` creates three equal columns that divide the available space between them. `250px 1fr` creates a 250px sidebar and a main column that takes everything else.

### Named Grid Areas — The Most Readable Way to Define a Layout

Named areas let you write your layout like a map of the page. You define the layout visually in `grid-template-areas`, and then assign each element to a named region.

```css
.page {
  display: grid;
  grid-template-areas:
    "header  header  header"
    "sidebar main    main"
    "footer  footer  footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: 80px 1fr 60px;
  min-height: 100vh;
}
```

What this looks like visually:

```
grid-template-areas:
  "header  header  header"     ← row 1: header spans all 3 columns
  "sidebar main    main  "     ← row 2: sidebar takes col 1, main takes cols 2-3
  "footer  footer  footer"     ← row 3: footer spans all 3 columns

┌────────────────────────────────────────────┐
│                  header                    │  80px
├──────────┬─────────────────────────────────┤
│          │                                 │
│ sidebar  │             main                │  1fr
│          │                                 │
├──────────┴─────────────────────────────────┤
│                  footer                    │  60px
└────────────────────────────────────────────┘
  250px              1fr + 1fr
```

Assign elements to their areas using `grid-area`:

```css
header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
```

The item does not need to know anything about column positions or row positions — it just announces its name, and the grid puts it in the right place. This makes the layout trivially easy to restructure: to make the sidebar go on the right instead of the left, you only change the `grid-template-areas` string.

### Spanning Columns and Rows

For grids without named areas, you can place items precisely using line numbers:

```css
/* Grid lines are numbered starting at 1 */
/* A 3-column grid has lines 1, 2, 3, 4 (4 lines, 3 gaps between them) */

.featured {
  grid-column: 1 / 3;   /* from column line 1 to column line 3 = spans 2 columns */
  grid-row: 1 / 2;      /* from row line 1 to row line 2 = one row tall */
}

/* Shorthand using span — "start at current position and span N cells" */
.wide {
  grid-column: span 2;   /* spans 2 columns from wherever it starts */
}

.tall {
  grid-row: span 3;   /* spans 3 rows from wherever it starts */
}
```

### Responsive Grid Without Media Queries

One of the most powerful things in CSS:

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

Let's break down `repeat(auto-fit, minmax(250px, 1fr))`:

- `minmax(250px, 1fr)` — each column should be at least 250px wide and at most `1fr` (an equal share)
- `auto-fit` — create as many columns as will fit in the available space, given the size constraint
- The result: on a 1200px container, you get ~4 columns. On a 600px container, you get 2. On a 300px container, you get 1. No media queries at all.

```
On a 1200px container:
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ card 1 │ │ card 2 │ │ card 3 │ │ card 4 │
└────────┘ └────────┘ └────────┘ └────────┘

On a 600px container:
┌────────────┐ ┌────────────┐
│  card 1    │ │   card 2   │
└────────────┘ └────────────┘
┌────────────┐ ┌────────────┐
│  card 3    │ │   card 4   │
└────────────┘ └────────────┘

On a 300px container:
┌───────────────────────────┐
│          card 1           │
└───────────────────────────┘
┌───────────────────────────┐
│          card 2           │
└───────────────────────────┘
```

This is the single most useful one-liner in CSS. Memorize it.

### Grid Alignment

Grid items can also be aligned within their cells:

```css
.grid {
  /* Align all items horizontally within their cells */
  justify-items: start;    /* left */
  justify-items: center;   /* center */
  justify-items: end;      /* right */
  justify-items: stretch;  /* fill the cell width (default) */

  /* Align all items vertically within their cells */
  align-items: start;    /* top */
  align-items: center;   /* middle */
  align-items: end;      /* bottom */
  align-items: stretch;  /* fill the cell height (default) */

  /* Align the entire grid within its container (when grid is smaller than container) */
  justify-content: center;
  align-content: center;
}

/* Override alignment for one specific item */
.special-item {
  justify-self: end;
  align-self: start;
}
```

## When to Use Which

The question "should I use Flexbox or Grid?" usually has a clear answer:

| Use Flexbox when... | Use Grid when... |
|---------------------|-----------------|
| Items flow in one direction: a row of buttons, a column of form fields | You need rows AND columns at the same time |
| You want items to naturally size themselves and push each other around | You want to define the space first and put things in it |
| You have a nav bar, a button group, or a centered element | You have a page layout, a dashboard, an image gallery |
| The number of items is unknown or dynamic | You know the structure of the layout up front |
| You want wrapping that is driven by item size (`flex: 1 1 280px`) | You want wrapping that is driven by explicit column count or `auto-fit` |

They are not mutually exclusive. A common pattern: use Grid for the overall page structure (header, sidebar, main, footer), then use Flexbox for the nav bar inside the header, the card row inside main, and the buttons inside each card.

## Responsive Design with Media Queries

CSS is mobile-first by default in this course. "Mobile-first" means you write your base styles for small screens, then use `min-width` media queries to progressively enhance the layout for larger screens.

Why mobile-first? Because it forces you to prioritize. What does the user actually need to see? When you start from a small screen, you make deliberate choices about what matters. Adding complexity for larger screens is easier than removing complexity for smaller ones. It also produces more efficient CSS — mobile users download less code.

```css
/* Base styles: mobile, single column */
.cards {
  display: grid;
  grid-template-columns: 1fr;   /* one column */
  gap: 1rem;
}

/* Tablet and up: 640px viewport width or wider */
@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);   /* two columns */
    gap: 1.25rem;
  }
}

/* Desktop and up: 1024px viewport width or wider */
@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);   /* three columns */
    gap: 1.5rem;
  }
}
```

:::warning Common Mistake
Writing `max-width` media queries: `@media (max-width: 768px)`. This is desktop-first — you write styles for large screens and then override them for mobile. The overrides tend to fight each other and create specificity tangles. Always use `min-width` and build up.
:::

Common breakpoints (these are conventions, not rules):

| Name | min-width | Targets |
|------|-----------|---------|
| `sm` | 640px | Landscape phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Small desktops |
| `xl` | 1280px | Large desktops |
| `2xl` | 1536px | Very large screens |

You do not need to use all of them. Most layouts only need two or three breakpoints.

## A Complete Page Layout

Here is a full page structure combining both systems, with media queries for responsiveness:

```css
/* Mobile-first page shell */
.page {
  display: grid;
  grid-template-rows: auto 1fr auto;   /* header, content, footer */
  min-height: 100vh;                    /* fill the viewport */
}

/* Navigation — flex, horizontal */
.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(1rem, 5vw, 4rem);   /* fluid padding */
  border-bottom: 1px solid var(--color-border);
}

.nav__links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

/* Hero — flex, centered vertically and horizontally */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
}

/* Cards — grid, responsive without media queries */
.features {
  display: grid;
  grid-template-columns: 1fr;   /* one column on mobile */
  gap: 1.5rem;
  padding: 4rem clamp(1rem, 5vw, 4rem);
}

@media (min-width: 640px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .features {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Footer — grid, three-column layout */
.footer {
  display: grid;
  grid-template-columns: 1fr;   /* stack on mobile */
  gap: 2rem;
  padding: 3rem clamp(1rem, 5vw, 4rem);
  border-top: 1px solid var(--color-border);
}

@media (min-width: 768px) {
  .footer {
    grid-template-columns: repeat(3, 1fr);   /* side by side on tablet+ */
  }
}
```

## Activity

Build a portfolio page layout using only CSS Flexbox and Grid — no frameworks, no absolute positioning, no floats.

**HTML structure to use** (the structure is provided so you can focus on CSS):

```html
<body>
  <header class="nav">
    <a href="/" class="nav__logo">Your Name</a>
    <ul class="nav__links">
      <li><a href="#about">About</a></li>
      <li><a href="#projects">Projects</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </header>

  <section class="hero">
    <h1>Full-Stack Developer</h1>
    <p>I build things for the web.</p>
    <a href="#projects" class="btn">See my work</a>
  </section>

  <section class="projects" id="projects">
    <h2>Projects</h2>
    <div class="projects__grid">
      <article class="card">Project 1</article>
      <article class="card">Project 2</article>
      <article class="card">Project 3</article>
      <article class="card">Project 4</article>
      <article class="card">Project 5</article>
      <article class="card">Project 6</article>
    </div>
  </section>

  <footer class="footer">
    <div>Column 1</div>
    <div>Column 2</div>
    <div>Column 3</div>
  </footer>
</body>
```

**Steps:**

1. Style `.nav` with Flexbox so the logo sits on the left and the links sit on the right. Center them vertically.
2. Style `.nav__links` as a horizontal flex row with `gap` between items and `list-style: none`.
3. Style `.hero` as a full-viewport-height flex container that centers its children both vertically and horizontally. Use `flex-direction: column` so the heading, paragraph, and button stack vertically.
4. Style `.projects__grid` as a Grid layout. On mobile: single column. At 640px: two columns. At 1024px: three columns. Use `gap` for spacing.
5. As a bonus, replace the three media queries in step 4 with a single `repeat(auto-fit, minmax(280px, 1fr))` declaration. Observe the difference.
6. Style `.footer` as a Grid layout with a single column on mobile and three equal columns on tablet and above.
7. Verify the layout at three viewport widths: 375px (mobile), 768px (tablet), 1280px (desktop). Use DevTools to resize.

:::tip Success Check
You are done when: (1) the nav has the logo on the left and links on the right at every viewport size, (2) the hero section is vertically centered in the viewport, (3) the project cards reflow from one column to two to three as the viewport grows, (4) there are no horizontal scrollbars at any viewport width, and (5) you did not use `float`, `position: absolute`, or `margin: 0 auto` to center anything — every layout is achieved with Flexbox or Grid.
:::

## Key Takeaways

- When arranging items in one direction (a row of buttons, a nav bar, a stack), use Flexbox; when defining a two-dimensional region (a page layout, a gallery, a dashboard), use Grid
- `justify-content` controls the main axis; `align-items` controls the cross axis; when `flex-direction: column`, the axes flip — vertical becomes the main axis
- `space-between` pushes the first item to the start and the last to the end — this is the nav bar pattern
- `repeat(auto-fit, minmax(250px, 1fr))` is a responsive grid in one line — no media queries needed
- Always write base styles for mobile screens first, then use `min-width` media queries to enhance for larger screens
- Named grid areas (`grid-template-areas`) make page-level layouts readable and easy to restructure — use them for anything that has a header, sidebar, main, and footer structure
