---
sidebar_position: 7
title: Challenge — Note Taker API
---

# Challenge — Note Taker API

## Objective

Build a REST API for a note-taking app. Notes are persisted to a JSON file. Deploy to Railway.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/notes` | Return all notes |
| `GET` | `/api/notes/:id` | Return a single note |
| `POST` | `/api/notes` | Create a new note |
| `PATCH` | `/api/notes/:id` | Update a note |
| `DELETE` | `/api/notes/:id` | Delete a note |
| `GET` | `/health` | Health check |

## Data Shape

```ts
interface Note {
  id: string;           // crypto.randomUUID()
  title: string;
  content: string;
  createdAt: string;    // ISO date
  updatedAt: string;    // ISO date
}

type CreateNoteInput = Pick<Note, 'title' | 'content'>;
type UpdateNoteInput = Partial<Pick<Note, 'title' | 'content'>>;
```

## Validation (Zod)

```ts
const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
});

const updateNoteSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  content: z.string().min(1).optional(),
}).refine(data => data.title || data.content, {
  message: 'At least one field must be provided',
});
```

## Requirements

- [ ] All 5 endpoints working and returning correct status codes
- [ ] Zod validation on POST and PATCH
- [ ] Returns 404 with descriptive message when note not found
- [ ] Custom error handler middleware
- [ ] Data persists to `data/notes.json`
- [ ] TypeScript strict mode — zero errors
- [ ] CORS enabled for `http://localhost:5173`
- [ ] Deployed to Railway (submit live URL)
- [ ] Test all endpoints with Insomnia or Hoppscotch (record a short walkthrough)

## Bonus

- Add a simple static HTML/JS frontend that uses your API
- Add basic rate limiting (100 requests per 15 min per IP)
- Add search: `GET /api/notes?q=query`

## Grading

| Criteria | Points |
|----------|--------|
| All endpoints functional | 30 |
| Correct status codes | 15 |
| Validation with Zod | 20 |
| Custom error handler | 10 |
| TypeScript (no errors) | 15 |
| Deployed URL submitted | 10 |
| **Total** | **100** |
