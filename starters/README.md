# Course project starters

These folders are the source for the downloadable starter zips used in the course docs.

| Starter | Used in | Description |
|--------|--------|-------------|
| `project-01-frontend/` | Project 01 | Vite + TypeScript + Tailwind (vanilla TS, 2 APIs, localStorage, modal) |
| `project-02-api/` | Project 02 | Express 5 + TypeScript + Prisma + Zod |
| `project-02-frontend/` | Project 02 | React + Vite + TypeScript + Tailwind + React Router + TanStack Query + Zustand |

## Regenerating the zip files

From the repo root:

```bash
cd website && npm run build-downloads
```

This writes `project-01-frontend.zip`, `project-02-api.zip`, and `project-02-frontend.zip` into `website/static/downloads/`. The site serves them at `/downloads/...`. Commit the updated zips after changing any starter.
