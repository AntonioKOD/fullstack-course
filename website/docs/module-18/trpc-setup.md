---
sidebar_position: 2
title: tRPC Setup
---

# tRPC Setup with Next.js

## Installation

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next
npm install @tanstack/react-query zod
```

## Server-Side Setup

### 1. Create the tRPC Instance

```ts
// src/server/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { auth } from '@/auth'; // NextAuth
import { prisma } from '@/lib/prisma';
import superjson from 'superjson';

// Context — passed to every procedure
export async function createContext(opts: FetchCreateContextFnOptions) {
  const session = await auth();
  return {
    prisma,
    session,
    userId: session?.user?.id ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create({
  transformer: superjson, // handles Dates, Maps, Sets correctly
});

// Export reusable builders
export const router = t.router;
export const publicProcedure = t.procedure;

// Middleware: require authenticated user
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }
  return next({ ctx: { ...ctx, userId: ctx.userId } });
});

export const protectedProcedure = t.procedure.use(isAuthed);
```

### 2. Define Routers

```ts
// src/server/routers/tasks.ts
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const tasksRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.task.findMany({
      where: { userId: ctx.userId },
      orderBy: { createdAt: 'desc' },
    })
  ),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({ where: { id: input.id } });
      if (!task || task.userId !== ctx.userId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return task;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().optional(),
        dueDate: z.date().optional(),
      })
    )
    .mutation(({ ctx, input }) =>
      ctx.prisma.task.create({
        data: { ...input, userId: ctx.userId },
      })
    ),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).max(200).optional(),
        completed: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const task = await ctx.prisma.task.findUnique({ where: { id } });
      if (!task || task.userId !== ctx.userId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      return ctx.prisma.task.update({ where: { id }, data });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({ where: { id: input.id } });
      if (!task || task.userId !== ctx.userId) {
        throw new TRPCError({ code: 'NOT_FOUND' });
      }
      await ctx.prisma.task.delete({ where: { id: input.id } });
      return { success: true };
    }),
});
```

### 3. Root Router

```ts
// src/server/routers/_app.ts
import { router } from '../trpc';
import { tasksRouter } from './tasks';
import { usersRouter } from './users';

export const appRouter = router({
  tasks: tasksRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
```

### 4. Next.js Route Handler

```ts
// app/api/trpc/[trpc]/route.ts
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/server/routers/_app';
import { createContext } from '@/server/trpc';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createContext({ req } as any),
  });

export { handler as GET, handler as POST };
```

## Client-Side Setup

```ts
// src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@/server/routers/_app';

export const trpc = createTRPCReact<AppRouter>();
```

```tsx
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from '@/lib/trpc';
import superjson from 'superjson';
import { useState } from 'react';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

```tsx
// app/layout.tsx
import { TRPCProvider } from './providers';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}
```
