---
sidebar_position: 3
title: Fetch + Async/Await Patterns
---

# Fetch + Async/Await Patterns

## Parallel Requests

```ts
// Fetch user, posts, and notifications simultaneously
const [user, posts, notifications] = await Promise.all([
  api.get<User>(`/api/users/${id}`),
  api.get<Post[]>(`/api/users/${id}/posts`),
  api.get<Notification[]>(`/api/users/${id}/notifications`),
]);
```

## Retry Logic

```ts
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 1000
): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise(r => setTimeout(r, delayMs));
    return fetchWithRetry(fn, retries - 1, delayMs * 2);
  }
}

const data = await fetchWithRetry(() => api.get('/api/data'));
```

## Timeout Wrapper

```ts
async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

const data = await withTimeout(api.get('/api/slow'), 5000);
```
