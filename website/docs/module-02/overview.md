---
sidebar_position: 1
title: Module 02 Overview
---

# Module 02 — Tailwind CSS

:::info Learning Objectives
By the end of this module you will be able to:

- Explain why utility-first CSS solves real problems that traditional stylesheets create at scale
- Install and configure Tailwind CSS in a Vite project from scratch
- Build a fully responsive layout using breakpoint prefixes without writing a single media query in CSS
- Toggle dark mode programmatically and persist the user's preference in localStorage
- Know when to extract repeated utilities into a component class using `@apply` and when to leave them inline
:::

## What Is This Module About?

In Module 01 you learned how CSS works: the cascade, the box model, flexbox, grid. You wrote rules in a `.css` file, gave elements class names, and connected the dots between the HTML and the styles.

That approach works fine for small projects. But it has a friction problem that shows up the moment a project grows: you spend as much time *naming things* and *switching between files* as you do actually styling. You name a div `.hero-content-wrapper`, flip to your CSS file, write the rules, flip back to HTML, realize you misspelled the class, fix it, and repeat. Every new component needs a new name you have to invent.

Tailwind CSS takes a different bet: what if the class names *were* the CSS properties, and you wrote everything right in the HTML? No context switching. No naming. No cascade collisions. Just write `p-4 bg-blue-600 text-white rounded-lg` and you're done.

That is the utility-first philosophy, and it is now the dominant approach in professional frontend development.

## Why Tailwind, Not Bootstrap?

You may have heard of Bootstrap, which was the go-to CSS framework from roughly 2013 to 2019. Bootstrap gives you pre-built components: a `.btn` class, a `.card` class, a `.navbar` class. You drop them in and they look fine — but they look like Bootstrap. Customizing them means fighting the cascade with `!important` overrides.

Tailwind gives you the opposite: no pre-built components, only low-level building blocks. You compose them yourself. The result looks exactly like your design, not a framework's default.

| | Bootstrap | Tailwind |
|--|-----------|---------|
| Approach | Pre-built components | Utility classes you compose |
| Bundle size | ~30KB (with PurgeCSS) | ~5KB (after content scanning) |
| Customization | Override with `!important` | Configure your own design tokens |
| Design result | Looks like Bootstrap | Looks like your brand |
| Industry trend | Declining use | GitHub, Vercel, Linear, Shopify, Stripe |

## How This Module Connects to the Rest of the Course

Every module from here forward uses Tailwind. In Module 03 (JavaScript) you will add interactivity to Tailwind-styled components. In Module 05 (React) you will compose Tailwind utility classes inside JSX. In the capstone project, you will build a full production UI entirely in Tailwind.

The investment you make learning the utility naming system in this module pays off every single day after it.

## What You Will Learn

| Lesson | What You Will Be Able To Do |
|--------|-----------------------------|
| [Tailwind Setup](./tailwind-setup) | Install Tailwind with Vite, configure custom design tokens, use the VS Code extension |
| [Utility Classes](./utility-classes) | Use spacing, typography, color, layout, and state utilities; read the naming system to derive new class names |
| [Responsive Design](./responsive-design) | Apply breakpoint prefixes mobile-first, build a responsive grid and navigation |
| [Dark Mode](./dark-mode) | Use `dark:` variants, configure class-based toggling, persist preference in localStorage |
| [Custom Components](./custom-components) | Extract repeated utility patterns with `@apply`, build a reusable button/card/badge system |

## Module Challenge

Build a fully responsive landing page for a fictional SaaS product using only Tailwind. No custom CSS file except for `@apply` component extractions.

Required sections:
- Hero with headline, subheadline, and two CTA buttons
- Features grid (3 columns on desktop → 1 column on mobile)
- Pricing cards (side by side on desktop, stacked on mobile)
- Call-to-action banner
- Footer with links

Required features:
- Fully responsive at 375px, 768px, and 1280px
- Dark mode toggle that persists across page refreshes
- All interactive elements have visible focus states

[View Challenge →](./challenge)
