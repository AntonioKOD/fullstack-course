---
sidebar_position: 4
title: CSS Foundations
---

# CSS Foundations

CSS (Cascading Style Sheets) controls the visual presentation of HTML. Before learning Tailwind (Module 2), you need to understand what CSS actually does — because Tailwind is just CSS with pre-built class names.

## How CSS Works

CSS rules follow this structure:

```css
selector {
  property: value;
}
```

```css
/* Target all paragraphs */
p {
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
}

/* Target by class */
.card {
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

/* Target by ID */
#hero {
  min-height: 100vh;
}
```

## CSS Custom Properties (Variables)

This is how modern CSS handles theming and reuse — no pre-processor needed:

```css
/* Define in :root for global access */
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #1d4ed8;
  --color-text: #111827;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-bg-subtle: #f9fafb;

  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;

  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;

  /* Border radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
}

/* Use the variables */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
}
```

## Dark Mode with Custom Properties

```css
:root {
  --color-bg: #ffffff;
  --color-text: #111827;
}

/* Override when OS is in dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #111827;
    --color-text: #f9fafb;
  }
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

## The Box Model

Every element is a box with four layers:

```

           margin                
    
           border              
        
          padding            
            
          content          
            
        
    

```

```css
/* box-sizing: border-box makes padding/border NOT add to total width */
/* Put this at the top of every stylesheet */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.card {
  width: 300px;
  padding: 1.5rem;     /* space inside the box */
  border: 1px solid #e5e7eb;
  margin: 1rem;        /* space outside the box */
}
```

## Selectors You Must Know

```css
/* Element */
h1 { }

/* Class */
.card { }

/* ID (use sparingly) */
#main-header { }

/* Descendant — any p inside .card */
.card p { }

/* Direct child only */
.nav > li { }

/* Adjacent sibling */
h2 + p { }

/* Pseudo-class */
a:hover { }
input:focus { }
li:first-child { }
li:last-child { }
li:nth-child(2) { }

/* Pseudo-element */
p::first-line { }
.card::before {
  content: '';
  display: block;
}

/* Attribute selector */
input[type="email"] { }
a[href^="https"] { }  /* href starts with https */
```

## Specificity (Why Your Styles Don't Apply)

When two rules target the same element, the more *specific* one wins:

| Selector | Specificity |
|----------|-------------|
| `*` | 0 |
| `p` | 1 |
| `.card` | 10 |
| `#header` | 100 |
| Inline `style=""` | 1000 |
| `!important` | Nuclear option (avoid) |

```css
/* Specificity: 10 + 1 = 11 */
.card p {
  color: blue;
}

/* Specificity: 1 — loses to above */
p {
  color: red;
}
```

:::tip Keep specificity low
Rely on classes (specificity 10) for styling. Avoid IDs and `!important`. Flat, low-specificity CSS is easier to override and maintain.
:::

## Typography

```css
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 16px;        /* base size */
  line-height: 1.5;       /* comfortable reading */
  color: #111827;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;       /* tighter for headings */
  letter-spacing: -0.02em;
}

/* fluid typography — scales with viewport */
h1 {
  font-size: clamp(1.75rem, 4vw, 3rem);
}
```

## Activity

1. Create `styles.css` linked to your `index.html` from the previous lesson
2. Add a CSS reset at the top (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`)
3. Define at least 6 CSS custom properties in `:root`
4. Use those variables to style your page
5. Add dark mode support via `prefers-color-scheme`
6. Style the nav, headings, cards, and footer

## Key Takeaways

- Use `box-sizing: border-box` and a CSS reset on every project
- Define colors, spacing, and typography as CSS custom properties in `:root`
- Keep specificity low — rely on classes, avoid IDs for styling
- `prefers-color-scheme` lets you support dark mode with zero JavaScript
