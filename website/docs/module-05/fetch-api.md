---
sidebar_position: 4
title: Fetch API
---

# Fetch API

The Fetch API is the native browser interface for making HTTP requests. No jQuery, no axios needed for most use cases.

## Basic Usage

```ts
// GET
const res = await fetch('https://api.github.com/users/octocat');
const user = await res.json();

// Check status before using response
if (!res.ok) {
  throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}
```

## A Typed Fetch Helper

Build this once per project and use it everywhere:

```ts title="src/lib/api.ts"
class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'HttpError';
  }
}

async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.message ?? message;
    } catch {}
    throw new HttpError(res.status, message);
  }

  return res.json() as Promise<T>;
}

export const api = {
  get: <T>(url: string, init?: RequestInit) =>
    apiFetch<T>(url, { ...init, method: 'GET' }),

  post: <T>(url: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(url, {
      ...init,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(url: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(url, {
      ...init,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  patch: <T>(url: string, body: unknown, init?: RequestInit) =>
    apiFetch<T>(url, {
      ...init,
      method: 'PATCH',
      body: JSON.stringify(body),
    }),

  delete: <T>(url: string, init?: RequestInit) =>
    apiFetch<T>(url, { ...init, method: 'DELETE' }),
};
```

```ts title="Usage"
import { api } from '@/lib/api';

interface User { id: number; name: string; email: string; }

// GET
const user = await api.get<User>('/api/users/1');

// POST
const newUser = await api.post<User>('/api/users', { name: 'Alice', email: 'alice@example.com' });

// Error handling
try {
  const data = await api.get<User[]>('/api/users');
} catch (err) {
  if (err instanceof HttpError && err.status === 404) {
    showNotFound();
  } else {
    showError('Something went wrong');
  }
}
```

## Loading States Pattern

```ts
interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

async function loadUsers(): Promise<void> {
  const state: FetchState<User[]> = { data: null, loading: true, error: null };
  renderState(state);

  try {
    state.data = await api.get<User[]>('/api/users');
    state.loading = false;
  } catch (err) {
    state.error = err instanceof Error ? err.message : 'Failed to load users';
    state.loading = false;
  }

  renderState(state);
}

function renderState(state: FetchState<User[]>) {
  const container = document.querySelector('#users')!;

  if (state.loading) {
    container.innerHTML = '<div class="spinner">Loading...</div>';
  } else if (state.error) {
    container.innerHTML = `<div class="error">${state.error}</div>`;
  } else if (state.data) {
    container.innerHTML = state.data.map(renderUser).join('');
  }
}
```

## Cancelling Requests

```ts
// Search with debounce + cancel previous request
let currentController: AbortController | null = null;

async function search(query: string): Promise<void> {
  // Cancel previous request if still pending
  currentController?.abort();
  currentController = new AbortController();

  try {
    const results = await api.get<Result[]>(
      `/api/search?q=${encodeURIComponent(query)}`,
      { signal: currentController.signal }
    );
    renderResults(results);
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return; // expected
    showError(err);
  }
}

// Debounce
const debouncedSearch = debounce(search, 300);
searchInput.addEventListener('input', (e) => {
  debouncedSearch((e.target as HTMLInputElement).value);
});
```
