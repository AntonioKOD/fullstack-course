# Project 01 — Front-End Application (Starter)

Starter template for the Phase 1 front-end project. Uses Vite + TypeScript + Tailwind CSS.

## Setup

```bash
npm install
cp .env.example .env   # Add your API keys to .env
npm run dev
```

## Requirements

- At least 2 public APIs (add wrappers in `src/api/`)
- localStorage for persistence (use `src/utils/storage.ts`)
- One custom modal (see `src/components/modal.ts`)
- Responsive design + dark mode
- Deploy to Netlify or GitHub Pages

## Structure

```
src/
  main.ts           # Entry point
  style.css         # Tailwind + @apply
  types/index.ts    # Shared types
  api/              # API wrappers (fetch)
  components/       # UI components (modal, cards, etc.)
  utils/            # storage, format helpers
```
