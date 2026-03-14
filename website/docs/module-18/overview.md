---
sidebar_position: 1
title: Module 18 Overview
---

# Module 18 — tRPC: End-to-End Type Safety

## What You'll Build

A full-stack type-safe API layer using **tRPC** — where your TypeScript types flow automatically from the server to the client, eliminating an entire category of bugs.

## The Problem tRPC Solves

With traditional REST or GraphQL:

```ts
// Server defines this
app.get('/users/:id', (req, res) => {
  res.json({ id: req.params.id, name: 'Alice', role: 'admin' });
});

// Client has to manually write matching types
interface User { id: string; name: string; role: string; }
const user = await fetch('/users/1').then(r => r.json()) as User; // ← runtime risk
```

With tRPC:

```ts
// Server defines the router with types
const userRouter = router({
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => prisma.user.findUnique({ where: { id: input.id } })),
});

// Client gets full type inference — no duplication!
const user = await trpc.user.getById.query({ id: '1' });
//     ^^ TypeScript knows this is User | null
```

## What You'll Learn

- Setting up tRPC with Next.js App Router
- Defining routers, procedures, and input validation with Zod
- Integrating tRPC client with TanStack Query
- Protected procedures with context and middleware
- Comparing tRPC vs REST vs GraphQL

## Prerequisites

- TypeScript (Module 04)
- React + TanStack Query (Module 16)
- Next.js App Router (Module 17)
- Prisma (Module 11)
- Zod (covered in Module 09)

## Tech Stack

| Package | Version | Purpose |
|---------|---------|---------|
| `@trpc/server` | 11.x | Server-side router |
| `@trpc/client` | 11.x | Type-safe client |
| `@trpc/react-query` | 11.x | React hooks integration |
| `@trpc/next` | 11.x | Next.js adapter |
| `zod` | 3.x | Input validation |
| `@tanstack/react-query` | 5.x | Caching and state |

## Project: Task API

By the end of this module you'll have a tRPC-powered task management API with authentication, full CRUD, and a typed React client — all without a single manually-written HTTP type.
