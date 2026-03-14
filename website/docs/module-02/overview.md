---
sidebar_position: 1
title: Module 02 Overview
---

# Module 02 — Tailwind CSS

## Why Tailwind, Not Bootstrap?

Bootstrap was the industry standard in 2015–2019. In 2025, **Tailwind CSS** is the dominant choice for professional frontend work. Here's why:

| | Bootstrap | Tailwind |
|--|-----------|---------|
| Approach | Pre-built components | Utility classes |
| Bundle size | ~30KB (with PurgeCSS) | ~5KB (after purge) |
| Customization | Override with `!important` | Configure the design system |
| Design consistency | Bootstrap-looking sites | Your brand, not a framework's |
| Company adoption | Declining | GitHub, Vercel, Linear, Shopify |

Tailwind gives you **all of CSS** in utility classes — you're writing real CSS properties, just with shorter names directly in your HTML.

## What You'll Learn

- Install and configure Tailwind with Vite
- Use utility classes for spacing, colors, typography, and layout
- Build responsive designs with Tailwind breakpoints
- Implement dark mode with `dark:` variants
- Extract reusable patterns with `@apply` and component classes
- Customize the Tailwind config for your design system

## Learning Objectives

By the end of this module you can:

- Convert any CSS design to Tailwind without looking at the docs
- Build a fully responsive layout from scratch
- Toggle dark mode with a class or `prefers-color-scheme`
- Know when to use `@apply` vs inline utilities

## Module Lessons

1. [Tailwind Setup](./tailwind-setup)
2. [Utility Classes](./utility-classes)
3. [Responsive Design](./responsive-design)
4. [Dark Mode](./dark-mode)
5. [Custom Components](./custom-components)

## Challenge

Build a fully responsive landing page for a SaaS product using only Tailwind:

- Hero section
- Features grid (3 columns → 1 column on mobile)
- Pricing cards
- CTA section
- Footer

[View Challenge →](./challenge)
