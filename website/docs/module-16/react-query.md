---
sidebar_position: 5
title: TanStack Query
---

# TanStack Query (React Query)

TanStack Query is the standard for server state management in React. It handles fetching, caching, background refetching, and loading/error states — replacing most manual `useEffect` + `useState` for data fetching.

## Setup

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools
```

```tsx title="src/main.tsx"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,         // data is fresh for 1 minute
      retry: 2,
      refetchOnWindowFocus: false,   // don't refetch when tab regains focus
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools />
  </QueryClientProvider>
);
```

## useQuery — Fetching Data

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface User { id: string; name: string; email: string; }

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', userId],       // unique cache key
    queryFn: () => api.get<User>(`/api/users/${userId}`),
    enabled: !!userId,                 // don't run if no userId
    staleTime: 5 * 60 * 1000,          // override default: 5 minutes
  });

  if (isLoading) return <Spinner />;
  if (isError) return <ErrorMessage message={(error as Error).message} />;
  if (!user) return null;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

## Query Keys

Query keys are how TanStack Query identifies and caches requests:

```tsx
// Simple key
useQuery({ queryKey: ['users'], queryFn: fetchUsers })

// With ID
useQuery({ queryKey: ['users', userId], queryFn: () => fetchUser(userId) })

// With filters
useQuery({
  queryKey: ['users', { role: 'admin', page: 1 }],
  queryFn: () => fetchUsers({ role: 'admin', page: 1 })
})

// Invalidate all user queries
queryClient.invalidateQueries({ queryKey: ['users'] })

// Invalidate specific user
queryClient.invalidateQueries({ queryKey: ['users', userId] })
```

## useMutation — Creating/Updating Data

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreatePostForm() {
  const queryClient = useQueryClient();

  const createPost = useMutation({
    mutationFn: (data: CreatePostInput) =>
      api.post<Post>('/api/posts', data),

    onSuccess: (newPost) => {
      // Invalidate posts list so it refetches
      queryClient.invalidateQueries({ queryKey: ['posts'] });

      // OR add directly to cache (optimistic-like)
      queryClient.setQueryData<Post[]>(['posts'], (old = []) => [newPost, ...old]);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  function handleSubmit(data: CreatePostInput) {
    createPost.mutate(data);
  }

  return (
    <form onSubmit={...}>
      {/* ... */}
      <button
        type="submit"
        disabled={createPost.isPending}
      >
        {createPost.isPending ? 'Saving...' : 'Create Post'}
      </button>
      {createPost.isError && (
        <p className="text-red-500">{(createPost.error as Error).message}</p>
      )}
    </form>
  );
}
```

## Centralized Query Functions

```ts title="src/api/users.ts"
import { api } from '../lib/api';

export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (filters: object) => [...userKeys.lists(), filters] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: string) => [...userKeys.details(), id] as const,
};

export const userApi = {
  getAll: (filters?: object) =>
    api.get<User[]>(`/api/users?${new URLSearchParams(filters as Record<string, string>)}`),

  getById: (id: string) =>
    api.get<User>(`/api/users/${id}`),

  create: (data: CreateUserInput) =>
    api.post<User>('/api/users', data),

  update: (id: string, data: UpdateUserInput) =>
    api.patch<User>(`/api/users/${id}`, data),

  delete: (id: string) =>
    api.delete<void>(`/api/users/${id}`),
};
```

```tsx
// Usage with centralized keys
const { data: users } = useQuery({
  queryKey: userKeys.list({ role: 'admin' }),
  queryFn: () => userApi.getAll({ role: 'admin' }),
});
```
