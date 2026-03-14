---
sidebar_position: 7
title: Challenge — SaaS Landing Page
---

# Challenge — SaaS Landing Page

## Brief

Build a fully responsive landing page for a fictional SaaS product using **only Tailwind CSS**. No external component libraries.

## Requirements

### Sections (60 points)

| Section | Required Elements |
|---------|-----------------|
| **Nav** | Logo, links (hidden on mobile), CTA button, hamburger menu toggle |
| **Hero** | Headline, subheadline, 2 CTA buttons, a code/screenshot mockup |
| **Features** | 3–6 feature cards in a responsive grid |
| **Pricing** | 3 pricing tiers (Free, Pro, Enterprise), highlighted middle tier |
| **FAQ** | At least 4 questions (accordion or static) |
| **Footer** | Links, copyright, social icons |

### Technical (40 points)

- [ ] Fully responsive — tested at 375px, 768px, 1280px
- [ ] Dark mode support using `dark:` variants
- [ ] Manual dark mode toggle with `localStorage` persistence
- [ ] Custom component classes via `@apply` for buttons, cards, badges
- [ ] All interactive elements have `:hover`, `:focus-visible` states
- [ ] Passes Lighthouse accessibility audit ≥ 90

## Design Tips

- Use `gray-950` as dark background, `gray-50` as light background
- Use a single accent color throughout (blue-600 is safe, try indigo or violet for personality)
- The "Pro" pricing card should use your accent color (`bg-blue-600`) to stand out
- Use `clamp()` for fluid headings: `font-size: clamp(2rem, 5vw, 4rem)`

## Grading

| Criteria | Points |
|----------|--------|
| All required sections present | 30 |
| Responsive across breakpoints | 20 |
| Dark mode works + toggles | 15 |
| @apply component classes | 10 |
| Focus/hover states | 10 |
| Lighthouse ≥ 90 | 15 |
| **Total** | **100** |

## Bonus (up to 20 extra points)

- Add a smooth scroll-triggered animation (Intersection Observer or CSS `@keyframes`)
- Make the mobile menu actually open/close with JavaScript
- Add a toast notification when copying a code snippet

## Submission

Push to GitHub Pages or Netlify, submit the live URL + repo link.
