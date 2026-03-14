---
sidebar_position: 1
title: REST Conventions
---

# REST Conventions

## REST Best Practices

```
GET    /api/resources           list with pagination
GET    /api/resources/:id       single resource
POST   /api/resources           create (201)
PATCH  /api/resources/:id       partial update
DELETE /api/resources/:id       delete (204)
```

Always version your API: `/api/v1/users`

Use nouns not verbs: `/api/posts` not `/api/getPosts`

Return consistent shapes:
```json
{ "success": true, "data": { ... }, "timestamp": "2025-01-01T00:00:00Z" }
{ "success": false, "error": { "code": "NOT_FOUND", "message": "..." } }
```
