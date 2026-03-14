---
sidebar_position: 6
title: ES Modules
---

# ES Modules

ES Modules (ESM) are the official JavaScript module system. They replace the old CommonJS `require()` syntax used in older Node.js code.

## Named vs Default Exports

```js title="math.js"
// Named exports — can have many per file
export function add(a, b) { return a + b; }
export function subtract(a, b) { return a - b; }
export const PI = 3.14159;

// You can also export at the bottom
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;

export { multiply, divide };
```

```js title="user.js"
// Default export — one per file, represents the "main thing" the module exports
export default class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
}
```

## Importing

```js
// Named imports — must match exact export names
import { add, subtract, PI } from './math.js';

// Rename on import
import { add as sum } from './math.js';

// Import all named exports as a namespace
import * as MathUtils from './math.js';
MathUtils.add(1, 2);
MathUtils.PI;

// Default import — you choose the name
import User from './user.js';
import MyUser from './user.js';  // same export, different local name

// Mix default and named
import User, { validateEmail } from './user.js';
```

## Re-exporting (Barrel Files)

Barrel files (`index.js`) are a common pattern to simplify imports:

```js title="utils/index.js"
// Re-export everything from sub-modules
export { add, subtract, PI } from './math.js';
export { formatDate, parseDate } from './date.js';
export { slugify, truncate } from './string.js';
export { default as User } from './user.js';
```

```js title="app.js"
// Now you can import from one place
import { add, formatDate, User } from './utils/index.js';
// instead of:
// import { add } from './utils/math.js';
// import { formatDate } from './utils/date.js';
// import User from './utils/user.js';
```

## Dynamic Imports

Load modules on demand (code splitting, lazy loading):

```js
// Static import — runs at module evaluation time
import { heavyLib } from './heavy.js';  // always loaded

// Dynamic import — returns a Promise, loaded on demand
const loadChart = async () => {
  const { default: Chart } = await import('./chart.js');
  return new Chart(data);
};

// Load based on condition
if (isAdminUser) {
  const { AdminPanel } = await import('./admin.js');
}

// In the browser — triggered on user action
button.addEventListener('click', async () => {
  const { openModal } = await import('./modal.js');
  openModal();
});
```

## ESM vs CommonJS

You'll see both in the wild. Know the difference:

```js
// CommonJS (old Node.js, .js or .cjs files)
const path = require('path');
const { readFile } = require('fs');
module.exports = { myFunction };
module.exports.default = MyClass;

// ES Modules (modern, .mjs or .js with "type": "module" in package.json)
import path from 'path';
import { readFile } from 'fs';
export { myFunction };
export default MyClass;
```

```json title="package.json"
{
  "type": "module"  // Treats all .js files as ESM
}
```

:::tip Use ESM
All new projects should use ESM. TypeScript compiles to ESM by default. Vite, Next.js, and NestJS all use ESM.
:::

## Module Organization Patterns

```
src/
 index.ts               # entry point
 lib/
    auth.ts
    db.ts
    index.ts           # barrel — re-exports lib/*
 utils/
    format.ts
    validate.ts
    index.ts           # barrel — re-exports utils/*
 types/
     index.ts           # shared TypeScript types
```

```ts title="src/utils/format.ts"
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US').format(date);
}
```

```ts title="src/utils/index.ts"
export * from './format';
export * from './validate';
```

```ts title="anywhere in your app"
import { formatCurrency, formatDate } from '../utils';
```
