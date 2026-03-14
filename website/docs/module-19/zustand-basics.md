---
sidebar_position: 2
title: Zustand Basics
---

# Zustand Basics

```bash
npm install zustand
```

## Creating a Store

```ts title="src/stores/counterStore.ts"
import { create } from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setCount: (value: number) => void;
}

export const useCounterStore = create<CounterState>((set) => ({
  count: 0,

  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (value) => set({ count: value }),
}));
```

## Using the Store in Components

```tsx
import { useCounterStore } from '@/stores/counterStore';

// Select only what you need — prevents unnecessary re-renders
function Counter() {
  const count = useCounterStore(s => s.count);
  const increment = useCounterStore(s => s.increment);
  const reset = useCounterStore(s => s.reset);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

// Or use multiple selectors in one call (use shallow for objects)
import { useShallow } from 'zustand/react/shallow';

function CounterControls() {
  const { increment, decrement, reset } = useCounterStore(
    useShallow(s => ({ increment: s.increment, decrement: s.decrement, reset: s.reset }))
  );
  // ...
}
```

## A Real Cart Store

```ts title="src/stores/cartStore.ts"
import { create } from 'zustand';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  total: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.id === item.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (id) =>
    set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

  updateQuantity: (id, quantity) =>
    set((state) => ({
      items:
        quantity === 0
          ? state.items.filter((i) => i.id !== id)
          : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
    })),

  clearCart: () => set({ items: [] }),

  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  // Computed values — call get() for current state
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  itemCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
}));
```

```tsx
// Usage
function AddToCartButton({ product }: { product: Product }) {
  const addItem = useCartStore(s => s.addItem);

  return (
    <button onClick={() => addItem(product)} className="btn-primary">
      Add to Cart
    </button>
  );
}

function CartIcon() {
  const itemCount = useCartStore(s => s.itemCount());
  const toggleCart = useCartStore(s => s.toggleCart);

  return (
    <button onClick={toggleCart} className="relative">
      
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </button>
  );
}
```

## DevTools + Persist Middleware

```ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get) => ({
        // ... same store definition
      }),
      {
        name: 'cart-storage',                  // localStorage key
        partialize: (state) => ({ items: state.items }), // only persist items, not isOpen
      }
    ),
    { name: 'CartStore' }                      // devtools label
  )
);
```
