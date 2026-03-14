---
sidebar_position: 4
title: Client Integration
---

# tRPC Client Integration

tRPC's React client wraps TanStack Query, giving you all the caching, refetching, and mutation features you already know — but with full type inference from your server router.

## Queries

```tsx
'use client';

import { trpc } from '@/lib/trpc';

export function TaskList() {
  const { data: tasks, isLoading, error } = trpc.tasks.list.useQuery();

  if (isLoading) return <TaskListSkeleton />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul className="space-y-2">
      {tasks?.map(task => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
```

```tsx
// Query with input
export function TaskDetail({ id }: { id: string }) {
  const { data: task } = trpc.tasks.byId.useQuery({ id });

  return <div>{task?.title}</div>;
}
```

## Mutations

```tsx
'use client';

import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';

export function CreateTaskForm() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const createTask = trpc.tasks.create.useMutation({
    onSuccess: () => {
      utils.tasks.list.invalidate(); // refetch the task list
      router.refresh();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    createTask.mutate({
      title: form.get('title') as string,
      description: form.get('description') as string,
    });
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="title" placeholder="Task title" required className="input" />
      <textarea name="description" placeholder="Description" className="input" />
      <button
        type="submit"
        disabled={createTask.isPending}
        className="btn-primary"
      >
        {createTask.isPending ? 'Creating...' : 'Create Task'}
      </button>
      {createTask.isError && (
        <p className="text-red-500">{createTask.error.message}</p>
      )}
    </form>
  );
}
```

## Optimistic Updates

Update the UI immediately, roll back on error:

```tsx
export function TaskCheckbox({ task }: { task: Task }) {
  const utils = trpc.useUtils();

  const toggle = trpc.tasks.update.useMutation({
    onMutate: async ({ id, completed }) => {
      // Cancel in-flight queries
      await utils.tasks.list.cancel();

      // Snapshot current data
      const previous = utils.tasks.list.getData();

      // Optimistically update
      utils.tasks.list.setData(undefined, (old) =>
        old?.map(t => t.id === id ? { ...t, completed: completed ?? t.completed } : t)
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      // Rollback on error
      if (context?.previous) {
        utils.tasks.list.setData(undefined, context.previous);
      }
    },
    onSettled: () => {
      // Always refetch to sync with server
      utils.tasks.list.invalidate();
    },
  });

  return (
    <input
      type="checkbox"
      checked={task.completed}
      onChange={() => toggle.mutate({ id: task.id, completed: !task.completed })}
    />
  );
}
```

## useUtils — Cache Management

```tsx
const utils = trpc.useUtils();

// Invalidate (mark stale, will refetch next render)
utils.tasks.list.invalidate();
utils.tasks.byId.invalidate({ id: '123' });

// Prefetch
utils.tasks.list.prefetch();

// Set cache directly
utils.tasks.list.setData(undefined, newTaskList);

// Get current cache
const current = utils.tasks.list.getData();
```

## Query Options (caching)

```tsx
trpc.tasks.list.useQuery(undefined, {
  staleTime: 1000 * 60 * 5, // consider fresh for 5 minutes
  refetchOnWindowFocus: false,
  refetchInterval: 30_000, // poll every 30 seconds
  enabled: !!userId,       // only run when userId is available
});
```

## Server Component + Client Component Pattern

For optimal performance, fetch initial data in a Server Component and hydrate the client cache:

```tsx
// app/tasks/page.tsx — Server Component
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { getServerClient } from '@/lib/server-client';
import { TaskList } from './TaskList';

export default async function TasksPage() {
  const caller = await getServerClient();
  const tasks = await caller.tasks.list();

  // Pre-populate the client cache
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: [['tasks', 'list']],
    queryFn: () => tasks,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TaskList /> {/* renders instantly with SSR data */}
    </HydrationBoundary>
  );
}
```

## Error Handling on Client

```tsx
const { error } = trpc.tasks.list.useQuery();

if (error) {
  switch (error.data?.code) {
    case 'UNAUTHORIZED':
      return <RedirectToLogin />;
    case 'NOT_FOUND':
      return <NotFound />;
    default:
      return <GenericError message={error.message} />;
  }
}
```
