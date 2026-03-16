---
sidebar_position: 6
title: ES Modules
---

# ES Modules

:::info Learning Objectives
By the end of this lesson you will be able to:
- Explain why modules exist and what problem they solve compared to stacking multiple `<script>` tags
- Write named exports, default exports, and import each correctly
- Create a barrel file (`index.js`) that consolidates imports from several sub-modules
- Describe the difference between ES Modules and CommonJS, and know which to use when
:::

## Why This Matters

Every React project you build starting in Module 16 will use ES Modules. Every Node.js project in Module 18. The `import` and `export` keywords are in every single file of every modern JavaScript codebase. Understanding not just the syntax but the *why* behind modules will help you structure your projects professionally and debug import-related errors when they appear.

---

## The Problem Modules Solve: Script Tag Soup

Before modules existed, the standard way to include JavaScript on a page was to stack `<script>` tags in your HTML:

```html
<!-- index.html from 2010 — a real nightmare -->
<script src="jquery.js"></script>
<script src="jquery-ui.js"></script>
<script src="utils.js"></script>
<script src="helpers.js"></script>
<script src="api.js"></script>
<script src="app.js"></script>
```

This caused several painful problems:

**Problem 1: Global namespace pollution.** Every variable and function declared in any of those scripts was added to the global `window` object. If `utils.js` defined a function called `formatDate` and `helpers.js` also defined a function called `formatDate`, one would silently overwrite the other depending on which script loaded last. Tracking down those bugs was miserable.

**Problem 2: Order dependency.** If `app.js` used a function from `api.js`, `api.js` had to appear first in the HTML. As your project grew, maintaining the correct order across dozens of files became a constant source of errors.

**Problem 3: No explicit dependencies.** Looking at `app.js`, you could not tell what it depended on without reading every line and knowing which globals were defined by which files. There was no declaration at the top saying "this file needs these things."

**Problem 4: No encapsulation.** Every function and variable was public and accessible from anywhere, by accident or on purpose. Writing code that could not be touched or broken by other scripts was nearly impossible.

ES Modules solve all of these problems. Each file explicitly declares what it exports (makes available to others) and what it imports (what it depends on). The module system handles the loading order automatically. Nothing is accidentally global.

---

## Named Exports

A named export is a value you explicitly share from a module. You can have as many named exports as you need in a single file, and they all keep their names when imported.

```js title="src/utils/math.js"
// Inline named exports — the most common form
export function add(a, b) {
  return a + b;
}

export function subtract(a, b) {
  return a - b;
}

export const PI = 3.14159265358979;

// You can also declare first and export at the bottom
const multiply = (a, b) => a * b;
const divide   = (a, b) => a / b;

export { multiply, divide };
// This is equivalent to exporting inline — just a different style
```

Named exports are the right choice when a file provides several related utilities. A `math.js` file might export `add`, `subtract`, `multiply`, and `divide`. A `validation.js` file might export `isEmail`, `isPhone`, and `isRequired`. Grouping related things into one file and exporting them all by name keeps your codebase organized.

---

## Default Exports

A default export represents the "main thing" a module provides. Every file can have at most one default export. The convention is: if your file's entire purpose is to define one thing (a class, a component, a function), use a default export.

```js title="src/components/ProductCard.js"
// Default export — this file IS a ProductCard
export default function ProductCard({ name, price, inStock }) {
  const availability = inStock ? 'In Stock' : 'Out of Stock';
  return `
    <div class="product-card">
      <h3>${name}</h3>
      <p>$${price.toFixed(2)}</p>
      <span class="${inStock ? 'green' : 'red'}">${availability}</span>
    </div>
  `;
}
```

```js title="src/services/ApiClient.js"
class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async get(path) {
    const res = await fetch(`${this.baseUrl}${path}`);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }

  async post(path, data) {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
  }
}

export default ApiClient;
```

---

## Importing

How you import something depends on how it was exported.

```js
// Named imports — use curly braces, match the exact export name
import { add, subtract, PI } from './utils/math.js';

add(2, 3);  // 5
PI;         // 3.14159...

// Rename a named import — useful when names would conflict
import { add as sumNumbers, subtract as minus } from './utils/math.js';
sumNumbers(2, 3); // 5

// Import everything as a namespace object
import * as MathUtils from './utils/math.js';
MathUtils.add(2, 3);   // 5
MathUtils.PI;           // 3.14159...

// Default import — you choose the local name (any identifier works)
import ProductCard from './components/ProductCard.js';
import ApiClient   from './services/ApiClient.js';

// Rename default import (the name is arbitrary — this is the same export)
import Card from './components/ProductCard.js'; // valid, just a different local name

// Mix default and named imports from the same file
import ApiClient, { MAX_RETRIES, DEFAULT_TIMEOUT } from './services/ApiClient.js';
```

The rule is clear: **named exports use `{}`, default exports do not.** If you find yourself guessing whether to use curly braces, ask: "Was this exported with a name (e.g., `export function add`) or as the default (e.g., `export default`)?"

:::warning Common Mistake: Confusing named and default import syntax
```js
// If ApiClient was exported as default:
export default class ApiClient { ... }

// This is WRONG — you cannot destructure a default export
import { ApiClient } from './services/ApiClient.js'; // undefined!

// This is CORRECT
import ApiClient from './services/ApiClient.js';

// Similarly, if add() was exported as named:
export function add(a, b) { return a + b; }

// This is WRONG — default import expects a default export
import add from './utils/math.js'; // undefined!

// This is CORRECT
import { add } from './utils/math.js';
```
When you see `undefined` after an import, this mismatch is the first thing to check.
:::

---

## Barrel Files: The `index.js` Pattern

As your project grows, importing things from their exact file paths gets tedious:

```js
// Without barrel files — tedious and fragile
import { formatDate }   from '../../utils/date.js';
import { formatPrice }  from '../../utils/currency.js';
import { slugify }      from '../../utils/string.js';
import { isEmail }      from '../../utils/validation.js';
```

A **barrel file** (typically named `index.js`) is a module whose only job is to re-export things from other modules. It acts as a single public interface for an entire folder:

```js title="src/utils/index.js"
// This file re-exports everything from the utils folder
export { formatDate, parseDate }    from './date.js';
export { formatPrice, formatCents } from './currency.js';
export { slugify, truncate }        from './string.js';
export { isEmail, isPhone }         from './validation.js';
```

Now any consumer can import from `./utils` instead of from individual files:

```js
// With barrel file — clean and maintainable
import { formatDate, formatPrice, isEmail } from '../../utils';
// Note: omitting /index.js is fine — Node and bundlers resolve it automatically
```

This has two benefits. First, consumers do not need to know or care which file each function lives in — that is an internal implementation detail. Second, if you later move `formatDate` to a different file inside `utils/`, you only update the barrel file, not every file that imports it.

### Folder structure with barrel files

```
src/
├── components/
│   ├── ProductCard.js
│   ├── CartItem.js
│   ├── NavBar.js
│   └── index.js          ← re-exports all components
├── utils/
│   ├── date.js
│   ├── currency.js
│   ├── string.js
│   └── index.js          ← re-exports all utilities
├── services/
│   ├── ApiClient.js
│   ├── AuthService.js
│   └── index.js          ← re-exports all services
└── main.js
```

```js title="src/components/index.js"
export { default as ProductCard } from './ProductCard.js';
export { default as CartItem }    from './CartItem.js';
export { default as NavBar }      from './NavBar.js';
```

```js title="src/main.js"
// Clean, flat imports from organized barrel files
import { ProductCard, CartItem, NavBar } from './components';
import { formatDate, formatPrice }       from './utils';
import { ApiClient }                     from './services';
```

:::tip Re-exporting default exports as named
When you re-export a default export through a barrel file, the convention is to give it a named export using `as`:
```js
// In index.js:
export { default as ProductCard } from './ProductCard.js';
// This takes the default export of ProductCard.js and re-exports it
// as a named export called ProductCard
```
This way, barrel file consumers can import multiple things with a single named-import syntax.
:::

---

## Circular Dependencies: A Warning

A circular dependency is when module A imports from module B, and module B imports from module A (possibly through a chain of other modules). This creates a chicken-and-egg problem:

```
// PROBLEMATIC — circular imports
// a.js imports from b.js
// b.js imports from a.js
```

```js title="a.js — circular example"
import { valueFromB } from './b.js';
export const valueFromA = 'from A: ' + valueFromB;
```

```js title="b.js — circular example"
import { valueFromA } from './a.js';
export const valueFromB = 'from B: ' + valueFromA;
```

When JavaScript tries to load `a.js`, it starts loading `b.js`, which starts loading `a.js`... which is already being loaded. JavaScript handles this by giving the partially-loaded module an `undefined` export value, which often produces confusing bugs.

The fix is usually a structural one: move the shared value to a third module that both `a.js` and `b.js` can import without creating a cycle.

```js title="shared.js — breaks the cycle"
export const sharedValue = 'the value both need';
```

```js title="a.js — fixed"
import { sharedValue } from './shared.js';
export const valueFromA = 'from A: ' + sharedValue;
```

If you ever see `undefined` being imported from a module you know exports a value, and it is not a named/default mismatch, a circular dependency is the likely culprit.

---

## Dynamic Imports: Loading on Demand

So far all the imports we have covered are *static* — they are evaluated when the module first loads, before any code runs. Dynamic imports let you load a module *on demand*, as a Promise.

```js
// Static import — always loaded, evaluated at module start
import { heavyChartLibrary } from './chart.js';

// Dynamic import — loaded on demand, returns a Promise
const loadChart = async () => {
  const { default: Chart } = await import('./chart.js');
  return new Chart(data);
};

// Only load admin tools if the user is an admin
async function initializePage(user) {
  if (user.role === 'admin') {
    const { AdminPanel } = await import('./admin/AdminPanel.js');
    const panel = new AdminPanel();
    panel.mount(document.getElementById('sidebar'));
  }
}

// Load a module when a button is clicked — loads once, uses cached module
document.getElementById('open-editor').addEventListener('click', async () => {
  const { openEditor } = await import('./editor.js');
  openEditor();
});
```

Dynamic imports are how React implements *code splitting* — splitting your app into chunks that only load when the user needs them, making the initial page load faster. You will see this in Module 16 with `React.lazy()`.

---

## ES Modules vs CommonJS

You will encounter both module systems in the wild. Here is how to recognize each:

```js
// CommonJS — the old Node.js system (files ending in .cjs, or .js without "type": "module")
const path       = require('path');
const { readFile } = require('fs/promises');
module.exports   = { myFunction, myClass };
module.exports.default = MyDefaultExport;

// ES Modules — the modern standard (files ending in .mjs, or .js with "type": "module")
import path          from 'path';
import { readFile }  from 'fs/promises';
export { myFunction, myClass };
export default MyDefaultExport;
```

To tell Node.js to treat your `.js` files as ES Modules, add `"type": "module"` to your `package.json`:

```json title="package.json"
{
  "name": "my-project",
  "type": "module"
}
```

:::warning Common Mistake: Using `require()` in browser code
`require()` is a CommonJS feature from Node.js. It does not exist in browsers. If you type `require('something')` in a browser script, you get `ReferenceError: require is not defined`.

In browser code, always use `import`/`export`. If you see `require()` in a tutorial and you are writing browser-side code, translate it to an `import` statement instead.

The confusion happens because many early Node.js tutorials and older resources use CommonJS. Modern Node.js supports ES Modules natively, and all browser-side code (including React) uses ES Modules exclusively.
:::

---

## Using ES Modules in the Browser

To use ES Modules directly in the browser without a build tool, add `type="module"` to your `<script>` tag:

```html
<!-- index.html -->
<script type="module" src="./main.js"></script>
```

With `type="module"`, the script:
- Can use `import` and `export`
- Is deferred automatically (runs after the DOM is ready, like `defer`)
- Runs in strict mode by default
- Has its own scope — variables declared inside do not leak to `window`

```js title="main.js"
import { formatPrice } from './utils/currency.js';
import ProductCard     from './components/ProductCard.js';

const products = await fetch('/api/products').then(r => r.json());
document.getElementById('grid').innerHTML = products
  .map(p => ProductCard({ ...p, formattedPrice: formatPrice(p.price) }))
  .join('');
```

Note that top-level `await` (using `await` outside of an async function) only works in module scripts (`type="module"`), not in classic scripts.

---

## Key Takeaways

- Modules solve the "script tag soup" problem by giving each file its own scope and explicit dependency declarations.
- Named exports (`export function foo`) are for files that provide multiple related utilities. Import them with `{}`.
- Default exports (`export default`) are for files whose entire purpose is one thing. Import them without `{}`.
- Barrel files (`index.js`) consolidate imports from a folder into a single, clean entry point.
- Circular dependencies cause `undefined` imports. Fix them by extracting shared values to a third module.
- Dynamic imports (`await import(...)`) load modules on demand — useful for code splitting and conditional features.
- Use `import`/`export` (ES Modules) everywhere in modern JavaScript. `require()` is CommonJS and does not work in the browser.

---

## Activity: Organize a Mini Utility Library

**Goal:** Practice named exports, default exports, and barrel files by splitting a collection of helper functions across multiple files.

**The scenario:** You have been given this pile of functions all in one file. Your task is to reorganize them into a proper module structure.

```js
// everything.js — all mixed together, no exports
function formatDate(date) {
  return new Intl.DateTimeFormat('en-US').format(date);
}

function formatPrice(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency', currency
  }).format(amount);
}

function slugify(text) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function truncate(text, maxLength = 100) {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

class Logger {
  constructor(prefix) {
    this.prefix = prefix;
  }
  log(message) {
    console.log(`[${this.prefix}] ${message}`);
  }
}
```

**Your task — step by step:**

```
src/
├── utils/
│   ├── date.js       ← formatDate
│   ├── currency.js   ← formatPrice
│   ├── string.js     ← slugify, truncate
│   ├── validation.js ← isEmail
│   └── index.js      ← barrel file re-exporting all of the above
├── Logger.js         ← Logger class as a default export
└── main.js           ← imports from './utils' and './Logger'
```

1. Create each utility file with the appropriate named exports
2. Create `Logger.js` with `Logger` as a default export
3. Create `utils/index.js` that re-exports everything from the four utility files
4. In `main.js`, import only from `'./utils'` (the barrel) and `'./Logger'` — no direct imports from individual utility files

**In `main.js`, verify your imports work:**

```js
import Logger from './Logger.js';
import { formatDate, formatPrice, slugify, truncate, isEmail } from './utils/index.js';

const log = new Logger('App');

log.log(formatDate(new Date()));              // [App] 3/16/2026
log.log(formatPrice(49.99));                  // [App] $49.99
log.log(slugify('Hello World! This is Cool')); // [App] hello-world-this-is-cool
log.log(isEmail('test@example.com').toString()); // [App] true
```

**Success check:** All five functions and the Logger class work correctly when imported through the barrel file. You should be able to delete `everything.js` and have `main.js` continue to work without any changes.

**Stretch goal:** Add a `formatRelativeTime` function to `date.js` that returns strings like `"2 hours ago"` or `"just now"` for a given Date. Make sure it is exported from `date.js` and re-exported from the barrel file without changing `main.js` imports.
