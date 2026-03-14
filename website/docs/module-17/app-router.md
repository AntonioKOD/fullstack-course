---
sidebar_position: 2
title: App Router
---

# Next.js App Router

The App Router (introduced in Next.js 13, stable in 14, refined in 15) is a file-system-based router where folders define routes and special files define UI.

## File Conventions

```
app/
 layout.tsx          # root layout (wraps entire app)
 page.tsx            # route: /
 loading.tsx         # loading state for /
 error.tsx           # error boundary for /
 not-found.tsx       # 404 page
 globals.css

 posts/
    page.tsx        # route: /posts
    [id]/
        page.tsx    # route: /posts/[id]
        loading.tsx

 dashboard/
    layout.tsx      # nested layout (wraps all /dashboard/* routes)
    page.tsx        # route: /dashboard
    settings/
        page.tsx    # route: /dashboard/settings

 api/
     posts/
         route.ts    # API route: /api/posts
```

## Root Layout

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'My App', template: '%s | My App' },
  description: 'A Next.js 15 application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav>...</nav>
        <main>{children}</main>
        <footer>...</footer>
      </body>
    </html>
  );
}
```

## Pages

```tsx
// app/page.tsx — Home page (Server Component by default)
export default function HomePage() {
  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
}
```

## Dynamic Routes

```tsx
// app/posts/[id]/page.tsx
interface Props {
  params: Promise<{ id: string }>;
}

export default async function PostPage({ params }: Props) {
  const { id } = await params; // params is a Promise in Next.js 15
  const post = await fetchPost(id);

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Generate metadata dynamically
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const post = await fetchPost(id);
  return { title: post.title };
}
```

## Route Groups

Group routes without affecting the URL:

```
app/
 (marketing)/
    layout.tsx      # marketing layout (header/footer)
    page.tsx        # /
    about/
        page.tsx    # /about

 (app)/
     layout.tsx      # app layout (sidebar + auth)
     dashboard/
        page.tsx    # /dashboard
     settings/
         page.tsx    # /settings
```

The `(marketing)` and `(app)` folders don't appear in the URL.

## Parallel Routes

Render multiple pages simultaneously in the same layout:

```
app/
 dashboard/
     layout.tsx
     page.tsx
     @analytics/
        page.tsx    # slot: analytics panel
     @team/
         page.tsx    # slot: team panel
```

```tsx
// app/dashboard/layout.tsx
export default function DashboardLayout({
  children,
  analytics,
  team,
}: {
  children: React.ReactNode;
  analytics: React.ReactNode;
  team: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2">{children}</div>
      <div>{analytics}</div>
      <div>{team}</div>
    </div>
  );
}
```

## Intercepting Routes

Intercept a route to show it in a modal while keeping the URL:

```
app/
 posts/
    [id]/
        page.tsx        # /posts/123 full page
 (.)posts/
     [id]/
         page.tsx        # intercept: show in modal
```

## loading.tsx and error.tsx

```tsx
// app/posts/loading.tsx — shown while page.tsx is fetching
export default function Loading() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
      ))}
    </div>
  );
}
```

```tsx
// app/posts/error.tsx — catches errors thrown in page.tsx
'use client'; // error boundaries must be client components

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="text-center py-12">
      <h2 className="text-xl font-semibold text-red-600">Something went wrong</h2>
      <p className="text-gray-500 mt-2">{error.message}</p>
      <button onClick={reset} className="mt-4 btn-primary">
        Try again
      </button>
    </div>
  );
}
```
