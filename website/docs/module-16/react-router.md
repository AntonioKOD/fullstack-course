---
sidebar_position: 6
title: React Router
---

# React Router v7

React Router is the standard client-side routing library for React SPAs. Version 7 introduces a framework mode (similar to Next.js), but we'll focus on the library mode for Vite apps.

## Installation

```bash
npm install react-router
```

## Basic Setup

```tsx
// src/main.tsx
import { BrowserRouter } from 'react-router';
import { createRoot } from 'react-dom/client';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

```tsx
// src/App.tsx
import { Routes, Route, Navigate } from 'react-router';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { PostsPage } from '@/pages/PostsPage';
import { PostDetailPage } from '@/pages/PostDetailPage';
import { LoginPage } from '@/pages/LoginPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/posts" element={<PostsPage />} />
        <Route path="/posts/:id" element={<PostDetailPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
```

## Layout with Outlet

```tsx
// src/components/Layout.tsx
import { Outlet, NavLink } from 'react-router';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white border-b px-6 py-4 flex items-center gap-6">
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/posts"
          className={({ isActive }) =>
            isActive ? 'text-blue-600 font-semibold' : 'text-gray-600 hover:text-gray-900'
          }
        >
          Posts
        </NavLink>
      </nav>

      <main className="flex-1 container mx-auto px-6 py-8">
        <Outlet /> {/* child routes render here */}
      </main>
    </div>
  );
}
```

## Route Params & Search Params

```tsx
// src/pages/PostDetailPage.tsx
import { useParams, useSearchParams } from 'react-router';

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>();

  return <div>Post ID: {id}</div>;
}

// src/pages/PostsPage.tsx — pagination via URL
export function PostsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? '1');
  const tag = searchParams.get('tag') ?? '';

  function setPage(newPage: number) {
    setSearchParams(prev => {
      prev.set('page', String(newPage));
      return prev;
    });
  }

  return (
    <div>
      <input
        value={tag}
        onChange={e => setSearchParams({ tag: e.target.value, page: '1' })}
        placeholder="Filter by tag..."
      />
      {/* posts list */}
      <button onClick={() => setPage(page + 1)}>Next page</button>
    </div>
  );
}
```

## Protected Routes

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from '@/stores/auth';

export function ProtectedRoute() {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    // Redirect to login, preserving the attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
```

```tsx
// After login, redirect back to the original URL
import { useNavigate, useLocation } from 'react-router';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/dashboard';

  async function handleLogin(data: LoginFormData) {
    await login(data);
    navigate(from, { replace: true });
  }
}
```

## Programmatic Navigation

```tsx
import { useNavigate } from 'react-router';

function DeleteButton({ id }: { id: string }) {
  const navigate = useNavigate();

  async function handleDelete() {
    await deletePost(id);
    navigate('/posts', { replace: true }); // go to posts, don't allow back
  }

  return <button onClick={handleDelete}>Delete</button>;
}
```

## useNavigate vs Link vs NavLink

| Use | When |
|-----|------|
| `<Link to="...">` | Regular navigation |
| `<NavLink to="...">` | Navigation with active state styling |
| `useNavigate()` | Programmatic navigation after an action |
| `<Navigate to="...">` | Declarative redirect in JSX |
