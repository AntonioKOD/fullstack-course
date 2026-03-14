---
sidebar_position: 4
title: State & Hooks
---

# State & Hooks

## useState

```tsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(c => c - 1)}>-</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
```

**State update rules:**
- Never mutate state directly — always set a new value
- For objects/arrays, create a new reference: `setUser({ ...user, name: 'Bob' })`
- Use the functional form `setCount(c => c + 1)` when new state depends on old state

## Complex State

```tsx
interface FormState {
  name: string;
  email: string;
  message: string;
}

function ContactForm() {
  const [form, setForm] = useState<FormState>({
    name: '', email: '', message: '',
  });

  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Clear error when field changes
    setErrors(prev => ({ ...prev, [name]: undefined }));
  }

  function validate(): boolean {
    const newErrors: Partial<FormState> = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'Valid email required';
    if (form.message.length < 10) newErrors.message = 'Message must be at least 10 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) setSubmitted(true);
  }

  if (submitted) return <p>Thanks! I'll be in touch.</p>;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input name="name" value={form.name} onChange={handleChange} />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>
      {/* ... */}
    </form>
  );
}
```

## useEffect

```tsx
import { useState, useEffect } from 'react';

// Run once on mount (fetch initial data)
useEffect(() => {
  fetchUsers().then(setUsers);
}, []);  // empty deps array = run once

// Run when a dependency changes
useEffect(() => {
  document.title = `${count} items`;
}, [count]);  // run when count changes

// Cleanup (subscriptions, timers, event listeners)
useEffect(() => {
  const controller = new AbortController();

  fetchUser(userId, controller.signal)
    .then(setUser)
    .catch(err => {
      if (err.name !== 'AbortError') setError(err.message);
    });

  return () => controller.abort();  // cleanup when component unmounts or userId changes
}, [userId]);

// Event listener with cleanup
useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeModal();
  }

  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
}, []);
```

:::tip The rules of hooks
1. Only call hooks at the top level — not inside loops, conditions, or nested functions
2. Only call hooks from React function components or custom hooks
:::

## useReducer — For Complex State

```tsx
type CartItem = { id: string; name: string; price: number; quantity: number };

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'UPDATE_QUANTITY'; id: string; quantity: number }
  | { type: 'CLEAR_CART' };

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find(i => i.id === action.item.id);
      if (existing) {
        return state.map(i =>
          i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...state, action.item];
    }
    case 'REMOVE_ITEM':
      return state.filter(i => i.id !== action.id);
    case 'UPDATE_QUANTITY':
      return state.map(i =>
        i.id === action.id ? { ...i, quantity: action.quantity } : i
      );
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}

function Cart() {
  const [items, dispatch] = useReducer(cartReducer, []);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div>
      {items.map(item => (
        <div key={item.id}>
          <span>{item.name}</span>
          <button onClick={() => dispatch({ type: 'REMOVE_ITEM', id: item.id })}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

## Custom Hooks

Extract reusable stateful logic into custom hooks:

```tsx
// useLocalStorage — syncs state with localStorage
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  function set(newValue: T | ((prev: T) => T)) {
    const resolved = typeof newValue === 'function'
      ? (newValue as (prev: T) => T)(value)
      : newValue;
    setValue(resolved);
    localStorage.setItem(key, JSON.stringify(resolved));
  }

  return [value, set] as const;
}

// useDebounce — delay a value update
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// Usage
function SearchBar() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery) searchApi(debouncedQuery);
  }, [debouncedQuery]);

  return <input value={query} onChange={e => setQuery(e.target.value)} />;
}
```
