---
sidebar_position: 1
title: Module 01 Overview
---

# Module 01 — HTML, Git & CSS

:::info Learning Objectives
By the end of this module you will be able to:
- Write semantic, accessible HTML that passes automated accessibility audits
- Use Git for version control on real projects: branching, committing, and opening pull requests
- Apply CSS properties confidently for color, typography, spacing, and the box model
- Build page layouts using both Flexbox and CSS Grid
- Use CSS custom properties to build maintainable, themeable stylesheets
:::

## Why This Module Comes First

Every other module in this course builds on what you learn here. React components are just HTML elements with JavaScript logic attached. Tailwind CSS is just pre-built CSS class names. Node.js servers send HTML responses. Git is the thread that holds all your work together across every project, every team, and every job you will ever have.

Before you can build anything real, you need a solid foundation in three areas: how browsers understand your content (HTML), how browsers present it visually (CSS), and how you save, share, and collaborate on your code without losing work (Git). This module gives you that foundation — not as a list of facts to memorize, but as a practical toolkit you will use every single day.

You already know basic HTML and CSS. This module closes the gap between "I can make something appear on screen" and "I can write code a professional team would accept."

## What You'll Build Toward

Each lesson in this module feeds directly into the Module 01 Challenge, where you will take a broken, inaccessible website and refactor it from the ground up. By the end of that challenge you will have a page that:

- Uses proper semantic structure a screen reader can navigate
- Has a layout built entirely with Flexbox and Grid — no floats, no hacks
- Supports both light and dark mode via a single CSS variable swap
- Has a clean Git history with conventional commit messages

That refactored page will also become the foundation for your portfolio project in Module 03.

## Lesson Map

| # | Lesson | What You'll Practice |
|---|--------|---------------------|
| 1 | [HTML Fundamentals](./html-fundamentals) | Semantic elements, accessibility, forms |
| 2 | [Git Workflow](./git-workflow) | Branching, committing, pull requests |
| 3 | [CSS Foundations](./css-foundations) | Box model, selectors, specificity, custom properties |
| 4 | [CSS Layout — Flexbox & Grid](./css-layout) | Both layout systems, responsive design |

Work through them in order. The HTML lesson produces a file you'll style in the CSS lessons. The Git lesson is woven throughout — you'll commit your work after each activity.

## The Module Challenge

After completing all four lessons, apply everything at once:

- Replace every `<div>` that is acting as a structural element with the correct semantic tag (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Add `alt` attributes to every image (descriptive text for meaningful images, empty string for decorative ones)
- Fix heading hierarchy so there is exactly one `<h1>` and headings nest logically
- Add a descriptive `<title>` and `<meta name="description">`
- Ensure all text meets WCAG AA color contrast minimums (4.5:1 for normal text)
- Replace all layout code with Flexbox and Grid
- Add dark mode support using CSS custom properties

[View Challenge Details →](./challenge)

## Tools You Need Before Starting

Run these commands to confirm your environment is ready:

```bash
# Check your installs
node --version   # should be v20 or higher
git --version    # any version from the last few years is fine
code --version   # VS Code
```

If any of these commands return "command not found," install the missing tool before continuing. The setup guide in the course introduction walks you through each installation.

## How the Lessons Are Structured

Each lesson in this module follows the same pattern: plain-English explanation of the concept, then code, then a breakdown of exactly what the code is doing. There are deliberate "Common Mistake" callouts for errors that trip up almost every beginner. Each lesson ends with a hands-on activity and a success check so you know when you are done.

Read actively. When you see a code block, type it out — do not copy-paste. The act of typing forces you to read every character, and that is where the learning actually happens.
