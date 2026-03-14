---
sidebar_position: 3
title: Components & JSX
---

# Components & JSX

React components are JavaScript functions that return JSX — a syntax extension that looks like HTML but compiles to JavaScript.

## Function Components

```tsx
// A simple component — function that returns JSX
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Arrow function style
const Greeting = ({ name }: { name: string }) => (
  <h1>Hello, {name}!</h1>
);

// Usage
<Greeting name="Alice" />
```

## Props

Props are the inputs to a component. Always define their types:

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  children?: React.ReactNode; // anything renderable
}

function Button({ label, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  const classes = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded font-medium ${classes[variant]} disabled:opacity-50`}
    >
      {label}
    </button>
  );
}
```

## JSX Rules

```tsx
// 1. Return a single root element — wrap in fragment if needed
return (
  <>
    <h1>Title</h1>
    <p>Content</p>
  </>
);

// 2. Use className instead of class
<div className="container">

// 3. Self-close empty elements
<img src="..." alt="..." />
<input type="text" />

// 4. JavaScript expressions in curly braces
const count = 42;
<p>Count: {count}</p>
<p>Double: {count * 2}</p>

// 5. Conditional rendering
{isLoading && <Spinner />}
{error ? <ErrorMessage /> : <Content />}

// 6. List rendering — always provide key
{items.map(item => (
  <li key={item.id}>{item.name}</li>
))}
```

## Composition

Build complex UIs from small pieces:

```tsx
// Card components
function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold mb-4">{title}</h2>;
};

Card.Body = function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="text-gray-600">{children}</div>;
};

// Usage
<Card>
  <Card.Header title="My Card" />
  <Card.Body>
    <p>Content goes here</p>
  </Card.Body>
</Card>
```

## Common Patterns

### Loading and Error States

```tsx
interface AsyncProps<T> {
  data: T | null;
  isLoading: boolean;
  error: Error | null;
  children: (data: T) => React.ReactNode;
}

function AsyncContent<T>({ data, isLoading, error, children }: AsyncProps<T>) {
  if (isLoading) return <div className="animate-pulse h-32 bg-gray-200 rounded" />;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (!data) return null;
  return <>{children(data)}</>;
}
```

### Render Props

```tsx
function Toggle({ children }: { children: (isOpen: boolean, toggle: () => void) => React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return <>{children(isOpen, () => setIsOpen(v => !v))}</>;
}

// Usage
<Toggle>
  {(isOpen, toggle) => (
    <>
      <button onClick={toggle}>{isOpen ? 'Close' : 'Open'}</button>
      {isOpen && <div>Content</div>}
    </>
  )}
</Toggle>
```

### forwardRef

```tsx
import { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        ref={ref}
        className={`border rounded px-3 py-2 focus:ring-2 ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
);

Input.displayName = 'Input';
```

## Component File Structure

```tsx
// src/components/PostCard.tsx

// 1. Imports
import { type Post } from '@/types';
import { formatDate } from '@/lib/utils';

// 2. Types
interface PostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

// 3. Component
export function PostCard({ post, onDelete }: PostCardProps) {
  return (
    <article className="border rounded-lg p-4">
      <h2 className="font-bold text-lg">{post.title}</h2>
      <p className="text-gray-500 text-sm">{formatDate(post.createdAt)}</p>
      <p className="mt-2">{post.excerpt}</p>
      {onDelete && (
        <button
          onClick={() => onDelete(post.id)}
          className="mt-4 text-red-600 text-sm hover:underline"
        >
          Delete
        </button>
      )}
    </article>
  );
}
```
