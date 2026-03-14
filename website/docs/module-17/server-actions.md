---
sidebar_position: 5
title: Server Actions
---

# Server Actions

Server Actions are async functions that run on the server, called directly from client components. They replace most API route endpoints for form submissions and mutations.

## Basic Server Action

```tsx title="app/actions/posts.ts"
'use server'; // marks this file as server-only

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { z } from 'zod';

const createPostSchema = z.object({
  title: z.string().min(1).max(300),
  content: z.string().min(1),
});

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const raw = Object.fromEntries(formData);
  const data = createPostSchema.parse(raw);

  await prisma.post.create({
    data: {
      ...data,
      authorId: session.user.id,
    },
  });

  revalidatePath('/posts');        // clear the posts page cache
  redirect('/posts');              // navigate to posts page
}

export async function deletePost(postId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (post?.authorId !== session.user.id) throw new Error('Forbidden');

  await prisma.post.delete({ where: { id: postId } });
  revalidatePath('/posts');
}
```

## Using Actions in a Server Component Form

```tsx title="app/posts/new/page.tsx"
import { createPost } from '@/actions/posts';

export default function NewPostPage() {
  return (
    <form action={createPost}>  {/* ← server action as form action */}
      <input name="title" required placeholder="Post title" />
      <textarea name="content" required rows={10} />
      <button type="submit">Publish</button>
    </form>
  );
}
```

## Actions in Client Components with useActionState

```tsx title="app/components/CreatePostForm.tsx"
'use client';

import { useActionState } from 'react';
import { createPost } from '@/actions/posts';

type FormState = { error?: string } | null;

export function CreatePostForm() {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(
    async (_, formData) => {
      try {
        await createPost(formData);
        return null;
      } catch (err) {
        return { error: (err as Error).message };
      }
    },
    null
  );

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="alert-error">
          <p>{state.error}</p>
        </div>
      )}

      <div>
        <label className="label">Title</label>
        <input name="title" className="input" required />
      </div>

      <div>
        <label className="label">Content</label>
        <textarea name="content" className="input" rows={8} required />
      </div>

      <button type="submit" disabled={isPending} className="btn-primary">
        {isPending ? 'Publishing...' : 'Publish Post'}
      </button>
    </form>
  );
}
```

## Optimistic Updates

```tsx
'use client';

import { useOptimistic } from 'react';
import { toggleLike } from '@/actions/posts';

export function LikeButton({ postId, likes }: { postId: string; likes: number }) {
  const [optimisticLikes, addOptimisticLike] = useOptimistic(
    likes,
    (current, delta: number) => current + delta
  );

  async function handleLike() {
    addOptimisticLike(1);    // update UI immediately
    await toggleLike(postId); // then sync with server
  }

  return (
    <button onClick={handleLike}>
       {optimisticLikes}
    </button>
  );
}
```

## Server Action vs API Route

Use **Server Actions** when:
- Submitting forms from React components
- Mutations triggered by user interaction
- The client and server live in the same Next.js app

Use **API Routes** (`app/api/`) when:
- Building a standalone API consumed by mobile apps or external clients
- You need fine-grained HTTP control (custom status codes, streaming)
- Webhooks (need to verify signatures from `Request`)
