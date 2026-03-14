---
sidebar_position: 2
title: Why TypeScript
---

# Why TypeScript

## TypeScript = JavaScript + Types

TypeScript is not a different language — it's JavaScript with an optional type system on top. Every valid JavaScript file is also valid TypeScript.

```ts
// This is valid TypeScript AND JavaScript
const greeting = 'Hello World';
console.log(greeting);

// This is TypeScript-only — add type annotations
const greeting: string = 'Hello World';

function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

TypeScript compiles to JavaScript before it runs — browsers and Node.js only see the JS output.

## What TypeScript Catches

```ts
// Typos in property names
const user = { name: 'Alice', email: 'alice@example.com' };
console.log(user.nmae);  //  Error: Property 'nmae' does not exist

// Wrong argument types
function multiply(a: number, b: number) { return a * b; }
multiply('2', 3);  //  Error: Argument of type 'string' is not assignable to 'number'

// Missing required properties
interface Config { host: string; port: number; }
const config: Config = { host: 'localhost' };  //  Error: Property 'port' is missing

// Null/undefined errors
function getLength(str: string) { return str.length; }
getLength(null);  //  Error: Argument of type 'null' is not assignable to 'string'

// Exhaustiveness checking
type Status = 'active' | 'inactive' | 'deleted';
function handleStatus(s: Status): string {
  if (s === 'active') return 'Active';
  if (s === 'inactive') return 'Inactive';
  //  Error: Not all code paths return a value — 'deleted' is missing!
}
```

## The Productivity Gains

TypeScript is about **developer experience**, not just catching bugs:

1. **Autocomplete** — your editor knows what properties and methods are available
2. **Inline docs** — hover over anything to see its type signature
3. **Safe refactoring** — rename a function and every call site updates
4. **Jump to definition** — works across packages, not just your code
5. **Catches bugs on save** — not in production

## Setting Up TypeScript

```bash
# In a new Node.js project
npm init -y
npm install -D typescript @types/node tsx
npx tsc --init

# Run TypeScript files directly (no compile step in dev)
npx tsx src/index.ts

# Or watch mode
npx tsx watch src/index.ts
```

```bash
# In a Vite project (already includes TS)
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install
npm run dev
```

## Your First TypeScript File

```ts title="src/index.ts"
interface Product {
  id: string;
  name: string;
  price: number;
  inStock: boolean;
}

function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(price);
}

function getDiscountedPrice(product: Product, discountPercent: number): number {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new RangeError(`Invalid discount: ${discountPercent}`);
  }
  return product.price * (1 - discountPercent / 100);
}

const laptop: Product = {
  id: '1',
  name: 'MacBook Pro',
  price: 1999,
  inStock: true,
};

const discounted = getDiscountedPrice(laptop, 10);
console.log(formatPrice(discounted)); // $1,799.10
```
