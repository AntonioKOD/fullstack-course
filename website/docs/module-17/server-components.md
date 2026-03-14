---
sidebar_position: 3
title: Server Components
---

# React Server Components

Server Components (RSC) run **only on the server** — they can access databases, files, and environment variables directly, with zero JavaScript sent to the browser.

## Server vs Client Components

```
Server Component (default)         Client Component ('use client')
       
 async/await                      useState, useEffect, hooks
 Direct DB access                 onClick, onChange events
 Sensitive env vars               Browser APIs (window, document)
 Zero JS in bundle                useRouter, useSearchParams
 No browser APIs                  No direct DB access
 No useState/useEffect            Larger bundle
 No event handlers
```

## Default: Server Component

All components in `app/` are Server Components by default:

```tsx title="app/posts/page.tsx"
// This runs on the server — no 'use client' needed
import { prisma } from '@/lib/prisma';

export default async function PostsPage() {
  // Direct database access — no fetch, no useEffect
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <main>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>by {post.author.name}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

## When to Add 'use client'

Only convert to a Client Component when you need:

```tsx title="app/components/ThemeToggle.tsx"
'use client'; // ← required for useState and onClick

import { useState, useEffect } from 'react';

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <button onClick={() => setDark(!dark)}>
      {dark ? '' : ''}
    </button>
  );
}
```

## Composing Server and Client Components

```tsx title="app/posts/[id]/page.tsx"
// Server Component — fetches data
import { prisma } from '@/lib/prisma';
import { LikeButton } from '@/components/LikeButton'; // 'use client'
import { CommentForm } from '@/components/CommentForm'; // 'use client'

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: params.id },
    include: { author: true, _count: { select: { likes: true } } },
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <p>by {post.author.name}</p>
      <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

      {/* Client components receive data as props */}
      <LikeButton postId={post.id} initialCount={post._count.likes} />
      <CommentForm postId={post.id} />
    </article>
  );
}
```

## Metadata and SEO

```tsx title="app/posts/[id]/page.tsx"
import type { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: 'Blog Posts',
  description: 'Read our latest articles',
};

// Dynamic metadata
export async function generateMetadata(
  { params }: { params: { id: string } }
): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      images: [post.coverImage],
    },
  };
}
```

## Loading and Error UI

```tsx title="app/posts/loading.tsx"
// Automatically shown while page is loading
export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      ))}
    </div>
  );
}
```

```tsx title="app/posts/error.tsx"
'use client'; // error components must be client components

export default function Error({ error, reset }: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold text-red-600">Something went wrong</h2>
      <p className="text-gray-600 mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 btn-primary">Try again</button>
    </div>
  );
}
```
