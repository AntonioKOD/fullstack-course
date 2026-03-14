---
sidebar_position: 5
title: Zustand vs Context API
---

# Zustand vs React Context API

React Context is built-in and fine for small apps. Zustand is better for anything non-trivial. Here's exactly when to use which.

## The Problem with Context

Context re-renders **every component** that calls `useContext` whenever any part of the context value changes.

```tsx
// Context holds user + theme + cart
const AppContext = createContext({ user, theme, cart, setTheme, addToCart });

// This component ONLY needs theme...
function Header() {
  const { theme } = useContext(AppContext);
  // ...but re-renders whenever cart changes! 
  return <header className={theme}> ... </header>;
}
```

With Zustand, components only re-render when the **specific slice they subscribe to** changes:

```ts
// ✓ Only re-renders when theme changes
function Header() {
  const theme = useThemeStore(s => s.theme);
  return <header className={theme}> ... </header>;
}
```

## Performance Comparison

| Aspect | Context | Zustand |
|--------|---------|---------|
| Re-renders | All consumers on any change | Only subscribers of changed slice |
| Boilerplate | Provider, reducer, actions | Just create() |
| DevTools | No (use React DevTools) | Yes (Redux DevTools) |
| Outside React | No | Yes (`.getState()`, `.subscribe()`) |
| Persistence | Manual | `persist` middleware |
| Async actions | Manual (useReducer + useEffect) | Built-in |
| Selector optimization | Manual (useMemo) | Automatic |

## Code Comparison

### Theme Toggle with Context

```tsx
// 1. Create context
const ThemeContext = createContext<ThemeContextType | null>(null);

// 2. Create reducer
function themeReducer(state: ThemeState, action: ThemeAction): ThemeState {
  switch (action.type) {
    case 'TOGGLE': return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    default: return state;
  }
}

// 3. Create provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(themeReducer, { theme: 'light' });
  const toggle = useCallback(() => dispatch({ type: 'TOGGLE' }), []);

  return (
    <ThemeContext.Provider value={{ ...state, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 4. Create hook
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider');
  return ctx;
}

// 5. Wrap app
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Theme Toggle with Zustand

```ts
// That's it — 8 lines
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light' as const,
      toggle: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
    }),
    { name: 'theme' }
  )
);
```

## When to Use Context

Context is still the right choice for:

1. **Theme/locale provided by a library** (Radix UI, next-themes, React Intl)
2. **Component-tree-specific state** — state that only matters within a subtree
3. **Dependency injection** — providing services/configuration down the tree
4. **Very simple apps** — if you have one or two state values, Context is fine

```tsx
// ✓ Good Context use: library integration
import { ThemeProvider } from 'next-themes';
<ThemeProvider attribute="class" defaultTheme="system">
  <App />
</ThemeProvider>

// ✓ Good Context use: component subtree state
const ModalContext = createContext<{ close: () => void } | null>(null);
function ModalProvider({ onClose, children }) {
  return <ModalContext.Provider value={{ close: onClose }}>{children}</ModalContext.Provider>;
}
```

## When to Use Zustand

Use Zustand for:

1. **Global app state** — auth, cart, notifications, UI settings
2. **State that needs to persist** — user preferences, cart
3. **State accessed outside React** — in event listeners, service workers, etc.
4. **Complex state logic** — multiple actions, derived state, async
5. **Performance-critical state** — high-frequency updates (animations, games)

## Accessing State Outside React

A Zustand store is just a plain JavaScript object. Access it anywhere:

```ts
// Outside React — in an API module, event handler, etc.
import { useAuthStore } from '@/stores/auth';

async function apiClient(path: string) {
  const token = useAuthStore.getState().token;
  const res = await fetch(path, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 401) {
    useAuthStore.getState().logout(); // call an action
  }

  return res.json();
}
```

You can't do this with Context.

## Recommendation

Start with Zustand for all global state in new projects. It has less boilerplate than Context + useReducer, performs better, and has better DX. Use Context only when integrating with third-party providers or for component-local subtree state.
