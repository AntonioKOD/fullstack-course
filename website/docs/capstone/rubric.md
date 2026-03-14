---
sidebar_position: 4
title: Capstone Rubric
---

# Capstone Grading Rubric

## Total: 200 points

### Functionality (60 points)

| Criteria | Points |
|----------|--------|
| Core features work end-to-end (no broken flows) | 20 |
| Authentication works (login, logout, protected routes) | 15 |
| CRUD operations for main resource | 15 |
| Error handling — user-facing error messages, no crashes | 10 |

### Code Quality (50 points)

| Criteria | Points |
|----------|--------|
| TypeScript — `tsc --noEmit` passes, no `any` | 15 |
| Database schema is well-designed (normalized, proper relations) | 10 |
| API follows REST conventions or tRPC correctly | 10 |
| Code is organized (no 500-line files, sensible module structure) | 10 |
| Input validation on all user-submitted data | 5 |

### Frontend (40 points)

| Criteria | Points |
|----------|--------|
| Responsive — works on 375px and 1280px | 10 |
| Dark mode support | 5 |
| Loading states for all async operations | 10 |
| Accessible (focus states, alt text, labels) | 10 |
| Polished, professional design | 5 |

### Deployment & Process (30 points)

| Criteria | Points |
|----------|--------|
| Deployed and publicly accessible | 15 |
| Environment variables managed correctly (no exposed secrets) | 5 |
| CI passes (GitHub Actions) | 5 |
| README complete (description, screenshot, URL, setup instructions) | 5 |

### Presentation (20 points)

| Criteria | Points |
|----------|--------|
| Demo covers all core features | 10 |
| Can explain architectural decisions | 5 |
| Addresses what you'd improve with more time | 5 |

## Bonus (up to 30 points)

| Feature | Points |
|---------|--------|
| AI integration (Claude API) | +15 |
| Custom domain | +5 |
| Full test suite (unit + integration) | +10 |
| Real-time features (WebSockets) | +10 |
| Image upload (S3/Cloudflare R2) | +5 |
| Excellent Lighthouse scores (90+ all categories) | +5 |

## Grade Thresholds

| Score | Grade |
|-------|-------|
| 180–200 | A+ |
| 160–179 | A |
| 140–159 | B |
| 120–139 | C |
| Below 120 | Needs revision |
