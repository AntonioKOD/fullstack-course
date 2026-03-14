---
sidebar_position: 3
title: Routers & Procedures
---

# Routers & Procedures

Routers organize procedures. Procedures are your API endpoints — with input validation, output types, and middleware all in one place.

## Procedure Types

| Type | Use |
|------|-----|
| `query` | Read data (GET equivalent) |
| `mutation` | Write data (POST/PUT/DELETE equivalent) |
| `subscription` | Real-time data via WebSockets |

```ts
const exampleRouter = router({
  // Query — fetches data
  getUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => db.user.findUnique({ where: { id: input.id } })),

  // Mutation — changes data
  createUser: publicProcedure
    .input(z.object({ name: z.string(), email: z.string().email() }))
    .mutation(({ input }) => db.user.create({ data: input })),
});
```

## Input Validation with Zod

Every procedure input is validated at runtime:

```ts
const postRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(3, 'Title must be at least 3 characters').max(200),
        content: z.string().min(10),
        tags: z.array(z.string()).max(5).optional(),
        publishedAt: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // input is fully typed — TypeScript knows all fields
      return ctx.prisma.post.create({ data: { ...input, authorId: ctx.userId } });
    }),
});
```

If input doesn't match the schema, tRPC automatically returns a `BAD_REQUEST` error with the Zod error details.

## Output Typing

tRPC infers output types from what you return:

```ts
const statsRouter = router({
  summary: publicProcedure.query(async ({ ctx }) => {
    const [userCount, postCount] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.post.count(),
    ]);
    return { userCount, postCount, generatedAt: new Date() };
    //                              ^^^^^^^ Date is preserved via superjson!
  }),
});

// Client:
const stats = trpc.stats.summary.useQuery();
stats.data?.generatedAt; // TypeScript knows this is Date
```

## Nested Routers

Organize large APIs into sub-routers:

```ts
// src/server/routers/_app.ts
export const appRouter = router({
  auth: authRouter,         // /auth.*
  posts: postsRouter,       // /posts.*
  comments: commentsRouter, // /comments.*
  admin: adminRouter,       // /admin.*
});

// Client calls:
trpc.posts.list.useQuery()
trpc.posts.create.useMutation()
trpc.admin.deleteUser.useMutation()
```

## Middleware

Middleware runs before the procedure and can modify context:

```ts
// Rate limiting middleware
const rateLimited = t.middleware(async ({ ctx, next, path }) => {
  const key = `${ctx.userId}:${path}`;
  const count = await redis.incr(key);
  await redis.expire(key, 60); // 1 minute window

  if (count > 20) {
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    });
  }

  return next({ ctx });
});

// Logging middleware
const logged = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const duration = Date.now() - start;
  console.log(`[tRPC] ${type} ${path} — ${duration}ms`);
  return result;
});

// Chain middleware
export const rateLimitedProcedure = t.procedure
  .use(logged)
  .use(rateLimited);
```

## Error Handling

tRPC maps errors to HTTP status codes:

```ts
import { TRPCError } from '@trpc/server';

// Available codes:
// PARSE_ERROR (400), BAD_REQUEST (400), UNAUTHORIZED (401)
// FORBIDDEN (403), NOT_FOUND (404), CONFLICT (409)
// TOO_MANY_REQUESTS (429), INTERNAL_SERVER_ERROR (500)

throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Post not found',
  cause: originalError, // optional — for logging
});
```

## Merging Routers

```ts
// Merge separate router files
import { mergeRouters } from '@trpc/server';

const publicRouter = router({ health: healthProcedure });
const privateRouter = router({ profile: profileProcedure });

export const appRouter = mergeRouters(publicRouter, privateRouter);
```

## Server-Side Direct Calls

Call tRPC procedures from Server Components without HTTP overhead:

```ts
// src/lib/server-client.ts
import { createCallerFactory } from '@trpc/server';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/trpc';

const createCaller = createCallerFactory(appRouter);

export async function getServerClient() {
  const ctx = await createContext({} as any);
  return createCaller(ctx);
}

// app/dashboard/page.tsx — Server Component
export default async function DashboardPage() {
  const caller = await getServerClient();
  const tasks = await caller.tasks.list(); // direct call, no HTTP
  return <TaskList tasks={tasks} />;
}
```
