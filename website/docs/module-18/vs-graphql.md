---
sidebar_position: 5
title: tRPC vs GraphQL vs REST
---

# tRPC vs GraphQL vs REST

Each API style has a place. Understanding the trade-offs helps you choose the right one for each project.

## REST

The default choice for web APIs.

**Strengths:**
- Universal — any language, any client
- Cacheable with HTTP semantics
- Simple and well-understood
- No build step or tooling required

**Weaknesses:**
- Over/under-fetching (get too much or too little data)
- Types must be maintained manually between server and client
- No standard for real-time

**Best for:** Public APIs, microservices, anything with external clients.

```ts
// Server — manually typed
app.get('/posts/:id', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { id: req.params.id } });
  res.json(post);
});

// Client — type cast required (or use a codegen tool)
const post = await fetch('/posts/1').then(r => r.json()) as Post;
```

## GraphQL

A query language that lets clients specify exactly what data they need.

**Strengths:**
- Client controls the shape of the response
- Single endpoint, no over-fetching
- Strong type system (schema-first)
- Excellent for complex, deeply nested data
- Subscriptions for real-time

**Weaknesses:**
- Significant setup (schema, resolvers, codegen)
- N+1 problem (requires DataLoader)
- Overkill for simple CRUD APIs
- Caching is harder than REST

**Best for:** Complex data graphs, multiple clients with different data needs, public developer APIs.

```graphql
# Client sends a query
query GetPost($id: ID!) {
  post(id: $id) {
    title
    author { name }
    comments { text }
  }
}
```

## tRPC

TypeScript-first RPC — your server functions become directly callable from the client.

**Strengths:**
- Zero type duplication — types inferred from server code
- Excellent DX with IDE autocomplete end-to-end
- Built on TanStack Query (caching, loading states, mutations)
- Simple setup, no schema files
- Works great with monorepos

**Weaknesses:**
- TypeScript only — no cross-language support
- Not suitable for public APIs
- Less control over HTTP caching than REST
- Not widely known outside the TS ecosystem

**Best for:** TypeScript monorepos, internal APIs, Next.js full-stack apps, teams that want type safety without the GraphQL complexity.

```ts
// Server type → automatically on client
const post = await trpc.posts.byId.query({ id: '1' });
//     ^^ TypeScript knows the exact shape
```

## Side-by-Side Comparison

| Feature | REST | GraphQL | tRPC |
|---------|------|---------|------|
| Type safety | Manual | Codegen | Automatic |
| Over-fetching | Yes | No | Varies |
| Learning curve | Low | High | Medium |
| Setup complexity | Low | High | Low |
| Public API? | ✓ | ✓ | ✗ |
| Real-time | Via SSE/WS | Subscriptions | Subscriptions |
| Client language | Any | Any | TypeScript only |
| Caching | HTTP native | Apollo/cache | TanStack Query |
| Best with | Any stack | Complex graphs | TS monorepos |

## When to Use Each

```
External API or multiple client types?
 REST (OpenAPI for types) or GraphQL (for complex queries)

Internal TypeScript full-stack app (Next.js, etc.)?
 tRPC

Complex data requirements, multiple clients with different needs?
 GraphQL

Simple CRUD with a public API?
 REST
```

## Hybrid Approach

These aren't mutually exclusive. A real app might use:

- **tRPC** for internal frontend↔backend communication (most endpoints)
- **REST** for webhooks and third-party integrations
- **GraphQL** for a partner API that needs flexible querying

## tRPC with OpenAPI

If you need REST compatibility from tRPC (e.g., for mobile clients or external partners):

```ts
import { generateOpenApiDocument } from 'trpc-openapi';

export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'My API',
  version: '1.0.0',
  baseUrl: 'https://api.example.com',
});
```

This gives you tRPC type safety internally + standard REST endpoints externally.
