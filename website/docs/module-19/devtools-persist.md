---
sidebar_position: 4
title: DevTools & Persistence
---

# DevTools & Persistence

Two of Zustand's most useful middleware: `devtools` for debugging with Redux DevTools, and `persist` for saving state across page refreshes.

## Redux DevTools

Zustand integrates with the Redux DevTools browser extension out of the box.

```bash
# Install Redux DevTools Extension in Chrome/Firefox
# https://chrome.google.com/webstore/detail/redux-devtools/
```

```ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useCounterStore = create<CounterState>()(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 }), false, 'increment'),
      decrement: () => set(state => ({ count: state.count - 1 }), false, 'decrement'),
      reset: () => set({ count: 0 }, false, 'reset'),
    }),
    { name: 'CounterStore' } // appears in DevTools
  )
);
```

The third argument to `set` is the **action name** — shown in DevTools time-travel.

## persist Middleware

Save and rehydrate state from `localStorage`, `sessionStorage`, or any custom storage:

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'sm' | 'md' | 'lg';
  setTheme: (theme: ThemeState['theme']) => void;
  setFontSize: (size: ThemeState['fontSize']) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'system',
      fontSize: 'md',
      setTheme: (theme) => set({ theme }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      name: 'theme-preferences', // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

## Persist Only Some Fields

Use `partialize` to exclude sensitive data:

```ts
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      preferences: { notifications: true, darkMode: false },
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        // user and token NOT persisted (sensitive + handled by cookies)
      }),
    }
  )
);
```

## sessionStorage

For state that should clear when the browser closes:

```ts
persist(
  (set) => ({ /* ... */ }),
  {
    name: 'session-data',
    storage: createJSONStorage(() => sessionStorage),
  }
)
```

## Custom Storage (IndexedDB)

```ts
import { get, set, del } from 'idb-keyval';

const idbStorage = {
  getItem: async (name: string) => (await get(name)) ?? null,
  setItem: (name: string, value: string) => set(name, value),
  removeItem: (name: string) => del(name),
};

persist(
  (set) => ({ /* ... */ }),
  {
    name: 'large-data',
    storage: idbStorage,
  }
)
```

## Combining devtools + persist

Middleware is composed with each wrapping the next:

```ts
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        addItem: (item) => set(s => ({ items: [...s.items, item] }), false, 'cart/addItem'),
        clearCart: () => set({ items: [] }, false, 'cart/clear'),
      }),
      { name: 'cart' }
    ),
    { name: 'CartStore' }
  )
);
```

## Handling Hydration in Next.js

`localStorage` doesn't exist on the server, causing hydration mismatches. Fix with a mounted check:

```tsx
'use client';

import { useState, useEffect } from 'react';

export function CartIcon() {
  const items = useCartStore(s => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Don't render count until client-side hydration is complete
  if (!mounted) return <ShoppingCartIcon />;

  return (
    <div className="relative">
      <ShoppingCartIcon />
      {items.length > 0 && (
        <span className="badge">{items.length}</span>
      )}
    </div>
  );
}
```

Or use Zustand's built-in `skipHydration`:

```ts
persist(/* ... */, {
  name: 'cart',
  skipHydration: true, // manually call rehydrate
})

// In your app layout:
useEffect(() => {
  useCartStore.persist.rehydrate();
}, []);
```
