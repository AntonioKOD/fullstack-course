---
sidebar_position: 6
title: Challenge — Accessibility Refactor
---

# Challenge — Accessibility Refactor

## Scenario

You've been given a poorly written legacy website. Your job is to refactor it to be fully accessible, semantic, and visually polished — without changing the visible design.

## Starter Code

Download the starter files from the course repo: `/code-examples/module-01/challenge/starter/`

## Requirements

### HTML (40 points)
- [ ] Replace all `<div class="header">` → `<header>`
- [ ] Replace `<div class="nav">` → `<nav>`
- [ ] Replace `<div class="main">` → `<main>`
- [ ] Replace `<div class="footer">` → `<footer>`
- [ ] Replace content `<div>`s with `<article>`, `<section>`, or `<aside>` as appropriate
- [ ] Ensure exactly one `<h1>` per page
- [ ] Fix heading hierarchy — no skipped levels
- [ ] Add descriptive `alt` text to all images
- [ ] Add a descriptive `<title>` and `<meta name="description">`
- [ ] All form inputs have `<label>` elements with matching `for`/`id`

### CSS (30 points)
- [ ] Add a CSS reset (`box-sizing: border-box`, zero margins/padding)
- [ ] Define a color palette using CSS custom properties
- [ ] Add dark mode support via `prefers-color-scheme`
- [ ] Layout the page using Flexbox and/or Grid (no `float` or `position: absolute` hacks)

### Git (30 points)
- [ ] Repo is on GitHub
- [ ] At least 4 commits with conventional commit messages
- [ ] Has a proper `.gitignore`
- [ ] README includes: description, screenshot, what you changed and why

## Grading

| Criteria | Points |
|----------|--------|
| Semantic HTML | 40 |
| CSS quality + dark mode | 30 |
| Git history + README | 30 |
| **Total** | **100** |

## Bonus

- Achieve a Lighthouse accessibility score of 95+
- Add a skip-to-main-content link for keyboard users
- Add `:focus-visible` styles for keyboard navigation

## Submission

Push your code to GitHub and submit your repo URL.
