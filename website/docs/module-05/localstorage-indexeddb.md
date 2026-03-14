---
sidebar_position: 5
title: localStorage & IndexedDB
---

# Client-Side Storage

## localStorage

`localStorage` stores strings persistently — survives page refreshes and browser restarts.

```ts
// Store (must serialize objects to JSON)
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Alice' }));

// Retrieve
const theme = localStorage.getItem('theme');    // 'dark' or null
const raw = localStorage.getItem('user');
const user = raw ? JSON.parse(raw) : null;

// Remove
localStorage.removeItem('theme');

// Clear all
localStorage.clear();
```

### Type-Safe localStorage Wrapper

```ts
// src/storage.ts

function get<T>(key: string): T | null {
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  localStorage.removeItem(key);
}

export const storage = { get, set, remove };
```

```ts
// Usage
import { storage } from './storage';

storage.set('todos', todos);
const saved = storage.get<Todo[]>('todos') ?? [];
```

### Storage Events (Cross-Tab Sync)

```ts
// Listen for changes made in OTHER tabs
window.addEventListener('storage', (e: StorageEvent) => {
  if (e.key === 'cart') {
    const cart = JSON.parse(e.newValue ?? '[]');
    updateCartUI(cart);
  }
});
```

## sessionStorage

Same API as `localStorage`, but data is cleared when the tab/browser closes:

```ts
sessionStorage.setItem('draft', JSON.stringify(formData));
const draft = sessionStorage.getItem('draft');
```

## Cookies (when to use)

| Storage | Persists | Size | Sent to server | Use Case |
|---------|---------|------|---------------|---------|
| localStorage | Until cleared | ~5MB |  No | UI preferences, cached data |
| sessionStorage | Tab session | ~5MB |  No | Multi-step forms, temp state |
| Cookie | Configurable | ~4KB |  Yes | Auth tokens (httpOnly), session |
| IndexedDB | Until cleared | Hundreds MB |  No | Offline data, files |

## IndexedDB

IndexedDB is a full client-side database — supports large amounts of structured data, transactions, indexes, and works offline.

The raw API is verbose. Use the `idb` wrapper library:

```bash
npm install idb
```

```ts
import { openDB } from 'idb';

// Open or create database
const db = await openDB('my-app', 1, {
  upgrade(db) {
    // Create object stores (like tables) on first run or version bump
    const todoStore = db.createObjectStore('todos', {
      keyPath: 'id',
      autoIncrement: false,
    });
    todoStore.createIndex('by-status', 'status');
  },
});

// CRUD operations
await db.add('todos', { id: crypto.randomUUID(), text: 'Learn IDB', status: 'pending' });
await db.put('todos', { id: '123', text: 'Updated', status: 'done' }); // add or update
const todo = await db.get('todos', '123');
const all  = await db.getAll('todos');
await db.delete('todos', '123');

// Query by index
const pending = await db.getAllFromIndex('todos', 'by-status', 'pending');

// Transactions
const tx = db.transaction('todos', 'readwrite');
await tx.store.put(todoA);
await tx.store.put(todoB);
await tx.done;
```

### When to Use IndexedDB vs localStorage

Use **localStorage** for:
- User preferences (theme, language)
- Cached API responses (small)
- Simple key-value state

Use **IndexedDB** for:
- Offline-capable apps
- Large datasets (images, files, many records)
- Need to query or filter data
- PWAs with background sync
