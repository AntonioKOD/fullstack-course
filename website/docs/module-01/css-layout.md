---
sidebar_position: 5
title: CSS Layout — Flexbox & Grid
---

# CSS Layout — Flexbox & Grid

Modern CSS has two powerful layout systems: **Flexbox** (one-dimensional) and **Grid** (two-dimensional). You'll use both — they complement each other.

## Flexbox

Use Flexbox for **one-dimensional** layouts: a row of buttons, a navigation bar, centering an element.

```css
.container {
  display: flex;

  /* Main axis direction */
  flex-direction: row;         /* default — left to right */
  flex-direction: column;      /* top to bottom */

  /* Alignment on main axis */
  justify-content: flex-start;   /* default */
  justify-content: center;
  justify-content: flex-end;
  justify-content: space-between;
  justify-content: space-around;

  /* Alignment on cross axis */
  align-items: stretch;   /* default */
  align-items: center;
  align-items: flex-start;
  align-items: flex-end;

  /* Wrap items when they overflow */
  flex-wrap: nowrap;   /* default */
  flex-wrap: wrap;

  /* Gap between items */
  gap: 1rem;
  gap: 1rem 2rem;   /* row-gap column-gap */
}
```

### Common Flexbox Patterns

**Centered hero section:**
```css
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}
```

**Navigation bar:**
```css
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
}

.navbar__links {
  display: flex;
  gap: 2rem;
  list-style: none;
}
```

**Card row:**
```css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.card {
  flex: 1 1 280px;   /* grow, shrink, minimum width */
}
```

### Flex Item Properties

```css
.item {
  flex-grow: 1;     /* take up remaining space */
  flex-shrink: 0;   /* don't shrink below base size */
  flex-basis: 200px; /* starting size */

  /* Shorthand */
  flex: 1;          /* flex: 1 1 0 */
  flex: 0 0 auto;   /* don't grow or shrink */

  /* Override cross-axis alignment for this item */
  align-self: flex-end;

  /* Move item to specific position */
  order: -1;   /* move to front */
}
```

## CSS Grid

Use Grid for **two-dimensional** layouts: page structure, image galleries, dashboards.

```css
.grid {
  display: grid;

  /* Define columns */
  grid-template-columns: 200px 1fr 1fr;      /* fixed + flexible */
  grid-template-columns: repeat(3, 1fr);     /* 3 equal columns */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* responsive */

  /* Define rows */
  grid-template-rows: auto 1fr auto;   /* header, content, footer */

  /* Gap */
  gap: 1.5rem;
  column-gap: 2rem;
  row-gap: 1rem;
}
```

### Named Grid Areas (the killer feature)

```css
.page {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main   main"
    "footer  footer footer";
  grid-template-columns: 250px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

header  { grid-area: header; }
.sidebar { grid-area: sidebar; }
main    { grid-area: main; }
footer  { grid-area: footer; }
```

### Spanning Columns and Rows

```css
.featured-card {
  grid-column: 1 / 3;   /* spans columns 1 to 3 */
  grid-row: 1 / 3;      /* spans rows 1 to 3 */
}

/* Shorthand with span */
.wide {
  grid-column: span 2;
}
```

### Responsive Grid Without Media Queries

```css
/* Cards auto-fit into available space, min 250px each */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}
```

## When to Use Which

| Use Flexbox | Use Grid |
|------------|---------|
| Navigation bars | Page layouts |
| Button groups | Image galleries |
| Centering one item | Dashboards |
| Single row/column | Complex 2D structures |
| Small components | Full-page structure |

## Responsive Design with Media Queries

```css
/* Mobile first — base styles apply to all screens */
.cards {
  display: grid;
  grid-template-columns: 1fr;  /* 1 column on mobile */
  gap: 1rem;
}

/* Tablet and up */
@media (min-width: 640px) {
  .cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

:::tip Mobile-First
Always write base styles for mobile, then use `min-width` media queries to enhance for larger screens. This is the correct approach and avoids specificity fights.
:::

## A Complete Page Layout

```css
/* Modern page structure using both */
.page {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem clamp(1rem, 5vw, 4rem);
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 1rem;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  padding: 4rem clamp(1rem, 5vw, 4rem);
}
```

## Activity

Build a portfolio page layout using Flexbox and Grid:

1. A `<nav>` with logo on left, links on right (Flexbox)
2. A hero section centered vertically and horizontally (Flexbox)
3. A "projects" section with a 3-column grid that collapses to 1 column on mobile (Grid + media queries)
4. A footer with 3 columns using Grid

No frameworks — pure CSS only.

## Key Takeaways

- Flexbox = one dimension (row OR column)
- Grid = two dimensions (rows AND columns)
- `repeat(auto-fit, minmax(X, 1fr))` is the most powerful one-liner in CSS
- Always write mobile-first styles, then use `min-width` media queries to scale up
