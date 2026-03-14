---
sidebar_position: 2
title: Variables, Types & Operators
---

# Variables, Types & Operators

## var vs let vs const

```js
// var — function-scoped, hoisted, mutable. Never use it.
var x = 1;

// let — block-scoped, mutable. Use when you need to reassign.
let count = 0;
count++;

// const — block-scoped, cannot be reassigned. Use by default.
const name = 'Alice';
const user = { name: 'Bob' }; // the binding is const, but the object is mutable
user.name = 'Carol';          //  this is fine
user = {};                    //  TypeError: cannot reassign const
```

:::tip Default to `const`
Use `const` unless you know you need to reassign. It makes your code easier to reason about.
:::

## Primitive Types

```js
// String
const greeting = 'Hello';
const template = `Hello, ${greeting}!`;  // template literals

// Number (one type for integers and floats)
const price = 9.99;
const count = 42;
const big = 1_000_000;  // underscore separator for readability

// BigInt — for numbers larger than 2^53
const huge = 9007199254740991n;

// Boolean
const isActive = true;
const isLoggedIn = false;

// null — intentional absence of value
const user = null;

// undefined — unintentional absence of value (variable declared but not assigned)
let response;
console.log(response); // undefined

// Symbol — unique identifier (used in advanced patterns)
const id = Symbol('id');
```

## Type Checking

```js
typeof 'hello'     // 'string'
typeof 42          // 'number'
typeof true        // 'boolean'
typeof undefined   // 'undefined'
typeof null        // 'object' ← famous JS bug, null is NOT an object
typeof {}          // 'object'
typeof []          // 'object' ← arrays are objects
typeof function(){} // 'function'

// Better checks:
Array.isArray([])        // true
value === null           // true if null
typeof value === 'string' // true if string
```

## Equality: == vs ===

```js
// == (loose equality) — coerces types. Avoid it.
0 == false   // true  ← confusing
'' == false  // true  ← confusing
null == undefined // true ← confusing

// === (strict equality) — no coercion. Always use this.
0 === false   // false
0 === 0       // true
null === undefined // false
```

## Nullish Coalescing and Optional Chaining

These two operators are essential for working with real-world data:

```js
// ?? — nullish coalescing: use right side if left is null or undefined
const username = user.name ?? 'Anonymous';
const port = config.port ?? 3000;

// ?. — optional chaining: safely access nested properties
const city = user?.address?.city;        // undefined instead of throwing
const firstTag = post?.tags?.[0];        // safe array access
const result = user?.getProfile?.();     // safe method call

// Combine them
const label = user?.profile?.displayName ?? 'Guest';
```

## Logical Assignment

```js
// ||= assign if left side is falsy
user.name ||= 'Anonymous';

// ??= assign if left side is null/undefined
config.timeout ??= 5000;

// &&= assign if left side is truthy
user.profile &&= transformProfile(user.profile);
```

## Template Literals

```js
const name = 'World';
const count = 42;

// Multi-line strings
const html = `
  <div class="card">
    <h2>${name}</h2>
    <p>Count: ${count}</p>
  </div>
`;

// Expressions inside ${}
const price = 9.99;
const msg = `Total: $${(price * 1.1).toFixed(2)}`;

// Tagged templates (advanced — used by libraries like styled-components)
const query = sql`SELECT * FROM users WHERE id = ${userId}`;
```

## Destructuring

```js
// Array destructuring
const [first, second, ...rest] = [1, 2, 3, 4, 5];
// first = 1, second = 2, rest = [3, 4, 5]

// Skip elements
const [,, third] = [1, 2, 3];

// Object destructuring
const { name, age, role = 'user' } = person;  // default value for missing key

// Rename while destructuring
const { name: fullName, address: { city } } = user;

// In function parameters
function greet({ name, age = 18 }) {
  return `Hello ${name}, age ${age}`;
}
```

## Spread Operator

```js
// Spread array
const a = [1, 2, 3];
const b = [...a, 4, 5];       // [1, 2, 3, 4, 5]
const copy = [...a];           // shallow copy

// Spread object
const defaults = { theme: 'dark', lang: 'en' };
const config = { ...defaults, lang: 'fr' };  // { theme: 'dark', lang: 'fr' }

// Merge objects
const merged = { ...obj1, ...obj2 };

// Spread into function arguments
Math.max(...numbers);
```
