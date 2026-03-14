---
sidebar_position: 2
title: REST Fundamentals
---

# REST Fundamentals

REST (Representational State Transfer) is the most common API style on the web. Understanding its conventions makes you fluent with any third-party API and helps you design good APIs yourself (you'll build them in Module 09).

## HTTP Methods

| Method | Meaning | Has Body |
|--------|---------|---------|
| `GET` | Retrieve data | No |
| `POST` | Create a resource | Yes |
| `PUT` | Replace a resource entirely | Yes |
| `PATCH` | Update specific fields | Yes |
| `DELETE` | Delete a resource | No |

## Status Codes

```
2xx — Success
  200 OK               — successful GET, PUT, PATCH, DELETE
  201 Created          — successful POST (resource created)
  204 No Content       — success with no response body

3xx — Redirect
  301 Moved Permanently
  302 Found (temporary redirect)

4xx — Client Error (your mistake)
  400 Bad Request      — invalid request body
  401 Unauthorized     — not logged in
  403 Forbidden        — logged in but not allowed
  404 Not Found        — resource doesn't exist
  409 Conflict         — duplicate resource
  422 Unprocessable    — validation failed
  429 Too Many Requests — rate limited

5xx — Server Error (their mistake)
  500 Internal Server Error
  502 Bad Gateway
  503 Service Unavailable
```

## REST URL Conventions

```
Collection:   GET    /api/users           — list all users
Single:       GET    /api/users/:id       — get user by ID
Create:       POST   /api/users           — create new user
Update:       PATCH  /api/users/:id       — update specific fields
Replace:      PUT    /api/users/:id       — replace entire resource
Delete:       DELETE /api/users/:id       — delete user

Nested:       GET    /api/users/:id/posts — user's posts
Action:       POST   /api/users/:id/follow— follow a user
```

## Query Parameters

Used for filtering, sorting, pagination, and search:

```
GET /api/products?category=electronics
GET /api/products?minPrice=100&maxPrice=500
GET /api/products?sort=price&order=asc
GET /api/products?page=2&limit=20
GET /api/products?q=macbook+pro
GET /api/products?include=reviews,images
```

```ts
// Building query strings in TypeScript
function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const filtered = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== '')
    .map(([k, v]) => [k, String(v)]);

  return new URLSearchParams(filtered).toString();
}

const qs = buildQueryString({ category: 'electronics', minPrice: 100, page: 2 });
// 'category=electronics&minPrice=100&page=2'

const url = `/api/products?${qs}`;
```

## Request and Response Headers

```ts
// Common request headers
const headers = {
  'Content-Type': 'application/json',          // body format
  'Authorization': `Bearer ${token}`,          // auth
  'Accept': 'application/json',                // expected response format
  'X-Request-ID': crypto.randomUUID(),         // request tracing
};

// Reading response headers
const res = await fetch('/api/data');
res.headers.get('Content-Type');               // 'application/json; charset=utf-8'
res.headers.get('X-Rate-Limit-Remaining');     // '95'
res.headers.get('X-Total-Count');              // '1234' (pagination total)
```

## Pagination Patterns

```ts
// Offset pagination
GET /api/posts?page=3&limit=20
// Response:
{
  "data": [...],
  "pagination": {
    "page": 3,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}

// Cursor pagination (more scalable)
GET /api/posts?cursor=eyJpZCI6MTAwfQ&limit=20
// Response:
{
  "data": [...],
  "nextCursor": "eyJpZCI6MTIwfQ",
  "hasMore": true
}
```

```ts
// Loading all pages
async function fetchAllPages<T>(baseUrl: string): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await api.get<{ data: T[]; pagination: { totalPages: number } }>(
      `${baseUrl}?page=${page}&limit=100`
    );
    results.push(...res.data);
    hasMore = page < res.pagination.totalPages;
    page++;
  }

  return results;
}
```
