---
sidebar_position: 5
title: Challenge — Blog API
---

# Challenge — Blog API with MongoDB

## Objective

Build a REST API for a blog platform using **Express + Mongoose + TypeScript**. Focus on data modeling decisions and aggregation queries.

## Requirements

### Data Models (30 points)

Design and implement the following schemas:

**User**
- `name`, `email` (unique), `passwordHash`, `role` (author/admin)
- `profile`: embedded object with `bio`, `avatar`
- `timestamps`

**Post**
- `title`, `slug` (unique, auto-generated from title), `content`, `excerpt`
- `authorId`: reference to User
- `tags`: array of strings
- `status`: draft/published
- `views`: counter
- `timestamps`

**Comment**
- Embed comments directly in Post documents
- Each comment: `userId`, `text`, `createdAt`
- Maximum 100 comments per post (validate this)

### Endpoints (40 points)

```
GET    /posts                    — paginated list, filter by tag/status
GET    /posts/:slug              — single post + increment view count
POST   /posts                   — create (auth required)
PATCH  /posts/:id               — update (author or admin only)
DELETE /posts/:id               — soft delete (set status to 'deleted')

POST   /posts/:id/comments      — add comment (auth required)
DELETE /posts/:id/comments/:cid — delete comment (owner or admin)

GET    /stats/top-authors       — aggregation: top 5 authors by total views
GET    /stats/popular-tags      — aggregation: top 10 tags by usage count
```

### Aggregations (30 points)

- [ ] `GET /stats/top-authors` — use `$group`, `$lookup`, `$sort`, `$limit`
- [ ] `GET /stats/popular-tags` — use `$unwind` on tags array, `$group`, `$sort`
- [ ] `GET /posts` with pagination — use `$facet` to return items + total count in one query

## Grading

| Criteria | Points |
|----------|--------|
| Schema design with proper types | 15 |
| Embedded vs referenced decisions justified | 15 |
| All CRUD endpoints functional | 20 |
| Pagination with $facet | 10 |
| Top authors aggregation | 10 |
| Popular tags aggregation | 10 |
| Slug auto-generation on save | 10 |
| 404 / validation error handling | 10 |
| **Total** | **100** |

## Setup

```bash
mkdir blog-api && cd blog-api
npm init -y
npm install express mongoose zod dotenv
npm install -D typescript tsx @types/express @types/node vitest
```

## Slug Helper

```ts
import { Schema } from 'mongoose';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// In your schema:
postSchema.pre('save', function () {
  if (this.isModified('title')) {
    this.slug = generateSlug(this.title);
  }
});
```

## Bonus

- Full-text search with MongoDB text index (`$text: { $search: '...' }`)
- RSS feed endpoint returning XML
- Rate limiting on the comment endpoint (max 5 comments per user per hour)
- Tag autocomplete endpoint using regex queries
