---
sidebar_position: 3
title: Async Actions
---

# Async Actions in Zustand

Zustand stores can contain async actions that fetch data and update state — keeping server state and UI state co-located when TanStack Query isn't needed.

## Basic Async Action Pattern

```ts
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchCurrentUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const { message } = await res.json();
        throw new Error(message);
      }

      const { user } = await res.json();
      set({ user, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'Login failed',
        isLoading: false,
      });
    }
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null });
  },

  fetchCurrentUser: async () => {
    const { user } = get();
    if (user) return; // already have user

    set({ isLoading: true });
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const user = await res.json();
        set({ user, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch {
      set({ isLoading: false });
    }
  },
}));
```

## Zustand vs TanStack Query

Use Zustand for async state when:
- The state is UI-specific (auth, theme, notifications)
- You need the data throughout the app lifecycle (not just in components)
- There's no automatic caching/refetching needed

Use TanStack Query for async state when:
- You're fetching server data that can go stale
- You need automatic background refetching
- Multiple components use the same data and benefit from caching

```ts
// ✓ Zustand: auth state (app-wide, long-lived)
const { user, login } = useAuthStore();

// ✓ TanStack Query: post list (frequently refetched, cached)
const { data: posts } = useQuery({ queryKey: ['posts'], queryFn: getPosts });
```

## Shopping Cart with Async Persistence

```ts
interface CartState {
  items: CartItem[];
  isSyncing: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  syncToServer: () => Promise<void>;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isSyncing: false,

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find(i => i.productId === product.id);
          if (existing) {
            return {
              items: state.items.map(i =>
                i.productId === product.id
                  ? { ...i, quantity: i.quantity + 1 }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { productId: product.id, product, quantity: 1 }],
          };
        });

        // Fire-and-forget sync
        get().syncToServer();
      },

      removeItem: (productId) => {
        set(state => ({ items: state.items.filter(i => i.productId !== productId) }));
        get().syncToServer();
      },

      syncToServer: async () => {
        const { items } = get();
        set({ isSyncing: true });
        try {
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
          });
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    { name: 'cart-storage' }
  )
);
```

## Combining Stores

Stores can reference each other via `getState()`:

```ts
// In notification store, reference auth store
import { useAuthStore } from './auth';

const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  fetchNotifications: async () => {
    const userId = useAuthStore.getState().user?.id;
    if (!userId) return;

    const notifications = await getNotifications(userId);
    set({ notifications });
  },
}));
```

## Slices Pattern (large stores)

Split a large store into slices:

```ts
// slices/ui.ts
const createUISlice = (set: SetState<AppState>) => ({
  theme: 'light' as 'light' | 'dark',
  sidebarOpen: false,
  toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
});

// slices/auth.ts
const createAuthSlice = (set: SetState<AppState>) => ({
  user: null as User | null,
  login: async (email: string, password: string) => { /* ... */ },
});

// store.ts — combine slices
export const useAppStore = create<AppState>()((...args) => ({
  ...createUISlice(...args),
  ...createAuthSlice(...args),
}));
```
