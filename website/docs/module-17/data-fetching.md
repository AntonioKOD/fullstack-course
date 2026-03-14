---
sidebar_position: 4
title: Data Fetching
---

# Data Fetching in Next.js 15

Next.js 15 App Router gives you multiple data-fetching strategies. The right one depends on how fresh the data needs to be and who's fetching it.

## Server Component Fetching (default)

Server Components can `fetch` directly — no useEffect, no loading state:

```tsx
// app/posts/page.tsx — Server Component (default)
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    next: { revalidate: 60 }, // cache for 60 seconds
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json() as Promise<Post[]>;
}

export default async function PostsPage() {
  const posts = await getPosts(); // runs on server, no waterfall

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

## Caching Strategies

Next.js extends `fetch` with caching options:

```ts
// Cache forever (static) — rebuild to update
fetch(url, { cache: 'force-cache' });

// Cache with revalidation interval (ISR)
fetch(url, { next: { revalidate: 3600 } }); // re-fetch after 1 hour

// No cache — fresh on every request (SSR)
fetch(url, { cache: 'no-store' });

// Tag-based revalidation — revalidate on demand
fetch(url, { next: { tags: ['posts'] } });
```

```ts
// On-demand revalidation in a Server Action
import { revalidateTag, revalidatePath } from 'next/cache';

async function publishPost(id: string) {
  'use server';
  await db.post.update({ where: { id }, data: { published: true } });
  revalidateTag('posts');       // revalidate all fetches tagged 'posts'
  revalidatePath('/posts');     // or revalidate a specific path
}
```

## Fetching with Prisma (Database Access)

In Server Components, you can query the database directly:

```tsx
// app/posts/page.tsx
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return (
    <div className="grid gap-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

> **Important**: Never expose Prisma client to the browser. Server Components run exclusively on the server — Prisma stays safe.

## Parallel Data Fetching

Avoid sequential waterfalls by fetching in parallel:

```tsx
//  Sequential — slow (second fetch waits for first)
const user = await getUser(id);
const posts = await getPostsByUser(user.id);

// ✓ Parallel — both fire at the same time
const [user, posts] = await Promise.all([
  getUser(id),
  getPostsByUser(id),
]);
```

## Streaming with Suspense

Stream parts of the page as they become ready:

```tsx
// app/dashboard/page.tsx
import { Suspense } from 'react';
import { RecentActivity } from './RecentActivity';
import { StatsPanel } from './StatsPanel';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Renders immediately */}
      <h1>Dashboard</h1>

      {/* Streams in independently */}
      <Suspense fallback={<Skeleton className="h-48" />}>
        <StatsPanel /> {/* async Server Component */}
      </Suspense>

      <Suspense fallback={<Skeleton className="h-96" />}>
        <RecentActivity /> {/* async Server Component */}
      </Suspense>
    </div>
  );
}
```

## Client-Side Fetching

For data that must be fresh on every interaction, use TanStack Query in Client Components:

```tsx
// app/search/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function SearchPage() {
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(`/api/search?q=${query}`).then(r => r.json()),
    enabled: query.length > 2,
  });

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {isLoading && <Spinner />}
      {data?.results.map(r => <Result key={r.id} {...r} />)}
    </div>
  );
}
```

## API Routes

For public APIs or external webhooks, use Route Handlers:

```ts
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page') ?? '1');
  const limit = 10;

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.count({ where: { published: true } }),
  ]);

  return NextResponse.json({ posts, total, page });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const post = await prisma.post.create({ data: body });
  return NextResponse.json(post, { status: 201 });
}
```

## Choosing the Right Strategy

| Scenario | Strategy |
|----------|----------|
| Static marketing pages | `cache: 'force-cache'` |
| Blog posts (update occasionally) | `revalidate: 3600` |
| User dashboards | `cache: 'no-store'` or Prisma in Server Component |
| Real-time search | Client Component + TanStack Query |
| Mutations | Server Actions (see Module 17 - Server Actions) |
