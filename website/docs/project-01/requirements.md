---
sidebar_position: 2
title: Requirements
---

# Project 01 — Requirements

## Team

- 2–3 students per team
- Solo projects allowed but not recommended

## Technical Requirements

### Must Have
- Vite + TypeScript (strict mode)
- Tailwind CSS (with `@apply` component classes)
- Minimum 2 external APIs
- localStorage for at least one persistent feature
- One custom modal (built with `<dialog>` or a positioned `<div>`)
- Responsive design (breakpoints at 640px and 1024px minimum)
- Dark mode
- Netlify or GitHub Pages deployment

### Code Standards
- No `any` types
- ES Modules throughout
- No inline event handlers (`onclick=""` in HTML)
- All user-generated content inserted via `textContent` (not `innerHTML`)
- `.env` file for API keys — never committed

## Deliverables

### Repository
- Public GitHub repo
- Meaningful `.gitignore` (excludes `.env`, `node_modules`, `dist`)
- At least 5 commits per member with conventional commit messages
- Feature branches + pull requests (no direct pushes to `main`)

### README.md
Must include:
1. App name and 1-sentence description
2. Screenshot or demo GIF
3. Live deployment URL
4. APIs used with links
5. Installation instructions (`npm install && npm run dev`)
6. List of features
7. Team members with GitHub links

### Presentation (5 minutes)
1. 30-second elevator pitch — what problem does it solve?
2. Demo of the app
3. Walk through one interesting piece of code
4. What was the hardest challenge?
5. What would you add with more time?

## Get the starter

[Download the Project 01 starter (ZIP)](/downloads/project-01-frontend.zip) and unzip it to get the suggested structure below.

## Suggested Tech Stack

```
my-project/
 index.html
 vite.config.ts
 tsconfig.json
 tailwind.config.ts  (if using config file)
 .env                (gitignored)
 .gitignore
 package.json
 README.md
 src/
     main.ts         # entry point
     style.css       # Tailwind + @apply
     types/
        index.ts    # shared types
     api/
        weather.ts  # API 1 wrapper
        flights.ts  # API 2 wrapper
     components/
        modal.ts
        card.ts
     utils/
         storage.ts
         format.ts
```
