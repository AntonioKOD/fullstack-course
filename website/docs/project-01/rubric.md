---
sidebar_position: 3
title: Rubric
---

# Project 01 — Grading Rubric

## Total: 100 points

### Functionality (35 points)

| Criteria | Points | Notes |
|----------|--------|-------|
| App works end-to-end (no broken features) | 10 | Test all user flows |
| Both APIs integrated and functional | 10 | Not just fetched — data actually shown |
| localStorage persistence works | 5 | Survives page refresh |
| Modal works (open, close, Esc key) | 5 | Accessible — focus trap, aria |
| Form validation with visible error messages | 5 | Not just browser defaults |

### Code Quality (30 points)

| Criteria | Points | Notes |
|----------|--------|-------|
| TypeScript — `tsc --noEmit` passes | 10 | Zero errors, no `any` |
| Modular code organization | 10 | API, utils, components separated |
| No `innerHTML` with user data | 5 | Security |
| Conventional commit messages | 5 | At least 5 per member |

### Design & Accessibility (20 points)

| Criteria | Points | Notes |
|----------|--------|-------|
| Responsive — works on 375px and 1280px | 8 | Test in DevTools |
| Dark mode implemented | 4 | With toggle or auto |
| Focus states visible on all interactive elements | 4 | `:focus-visible` |
| Color contrast passes WCAG AA | 4 | Use Chrome DevTools |

### Process (15 points)

| Criteria | Points | Notes |
|----------|--------|-------|
| Feature branches + PRs (no direct main commits) | 5 | Check git history |
| README with all required sections | 5 | Live URL required |
| Presentation covers all 5 points | 5 | 5-minute limit |

## Grade Thresholds

| Score | Grade |
|-------|-------|
| 90–100 | A |
| 80–89 | B |
| 70–79 | C |
| Below 70 | Needs revision |

## Automatic Deductions

- App is not deployed: **-15 points**
- API keys committed to GitHub: **-20 points**
- Direct commits to `main` branch: **-5 points**
- No README: **-10 points**
