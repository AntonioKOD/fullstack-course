---
sidebar_position: 4
title: Arrays & Objects
---

# Arrays & Objects

:::info Learning Objectives
By the end of this lesson you will be able to:
- Use `map`, `filter`, and `reduce` to transform a real dataset without mutating the original array
- Read and write object destructuring, the spread operator, and `Object.entries()` in the context of working with API data
- Explain the difference between *mutating* an array and *returning a new array*, and say why it matters for React
- Chain array methods together to express multi-step data transformations in a readable way
:::

## Why This Matters

When you fetch data from an API in Module 06, it almost always arrives as an **array of objects** — a list of products, a feed of posts, a collection of users. Your job as a frontend developer is to take that raw data and transform it into something meaningful for the user: filter it by price, sort it by date, calculate a total, group it by category, and turn each item into a card on the page.

Every one of those transformations is a job for the array and object tools in this lesson. In Module 16, React's state management is built almost entirely on the idea of *never mutating data* but instead creating new transformed copies of it. The habits you build here will carry you through the entire course.

---

## Arrays: Ordered Shopping Lists

An array is an ordered collection of values. Think of it like a numbered shopping list — each item has a position (index), starting at 0.

```js
// An array of product objects — the kind of data you will receive from an API
const products = [
  { id: 1, name: 'Mechanical Keyboard', price: 129.99, category: 'electronics', inStock: true },
  { id: 2, name: 'Standing Desk',       price: 449.00, category: 'furniture',   inStock: true },
  { id: 3, name: 'Monitor Stand',       price: 39.99,  category: 'furniture',   inStock: false },
  { id: 4, name: 'USB-C Hub',           price: 49.99,  category: 'electronics', inStock: true },
  { id: 5, name: 'Ergonomic Chair',     price: 299.00, category: 'furniture',   inStock: true },
];

// Access by index (0-based)
products[0]; // { id: 1, name: 'Mechanical Keyboard', ... }
products[2]; // { id: 3, name: 'Monitor Stand', ... }

// Length
products.length; // 5

// Last item — two ways
products[products.length - 1];  // old way
products.at(-1);                // modern way — negative indices count from the end
products.at(-2);                // { id: 4, name: 'USB-C Hub', ... }
```

We will use this `products` array throughout this lesson to show how each method works on real data.

---

## The Three Pillars: map, filter, reduce

These three methods are the most important tools in your JavaScript toolkit. Every data transformation you will ever write is some combination of these three.

### `.map()` — Transform Every Item

`.map()` creates a **new array** by applying a function to every element of the original array. The original is never changed. Think of it as: "give me a new list that is this list, but with each item changed in this way."

```js
// Get just the names — transform an array of objects into an array of strings
const productNames = products.map(product => product.name);
// ['Mechanical Keyboard', 'Standing Desk', 'Monitor Stand', 'USB-C Hub', 'Ergonomic Chair']

// Get just the prices
const prices = products.map(p => p.price);
// [129.99, 449.00, 39.99, 49.99, 299.00]

// Transform the shape — create new objects with a subset of fields
const productCards = products.map(p => ({
  id:    p.id,
  title: p.name,
  cost:  `$${p.price.toFixed(2)}`,
}));
// [
//   { id: 1, title: 'Mechanical Keyboard', cost: '$129.99' },
//   { id: 2, title: 'Standing Desk', cost: '$449.00' },
//   ...
// ]

// Apply a price increase to every item (for a sale price display)
const discounted = products.map(p => ({
  ...p,
  salePrice: (p.price * 0.9).toFixed(2), // 10% off
}));
// Original products array is unchanged
```

Notice the last example carefully. We use the spread operator (`...p`) to copy all existing properties into the new object, then add `salePrice`. This is the standard pattern for adding or overriding a property without mutating the original.

:::warning Common Mistake: Mutating inside map
`.map()` is meant to return a new array without touching the original. If you mutate the original objects inside the map callback, you are corrupting your source data:
```js
// WRONG — mutates each object in the original array
const discounted = products.map(p => {
  p.price = p.price * 0.9; // mutating! original products array is now broken
  return p;
});

// RIGHT — spread to create a new object for each item
const discounted = products.map(p => ({
  ...p,
  price: p.price * 0.9, // new object with modified price
}));
```
In React, mutating state directly causes the component not to re-render. Building the habit of returning new objects from `.map()` now will save you hours of debugging later.
:::

### `.filter()` — Keep Only the Matching Items

`.filter()` creates a **new array** containing only the elements for which the callback returns `true`. The callback is called a *predicate* — it returns a boolean. Elements where the predicate returns `false` are excluded.

```js
// Only products that are in stock
const available = products.filter(p => p.inStock);
// [Mechanical Keyboard, Standing Desk, USB-C Hub, Ergonomic Chair]

// Only furniture
const furniture = products.filter(p => p.category === 'furniture');
// [Standing Desk, Monitor Stand, Ergonomic Chair]

// Only products under $100
const affordable = products.filter(p => p.price < 100);
// [Monitor Stand ($39.99), USB-C Hub ($49.99)]

// Combine multiple conditions with &&
const affordableAndAvailable = products.filter(p => p.price < 100 && p.inStock);
// [USB-C Hub] — Monitor Stand is out of stock, so it is excluded

// Remove an item by id (common pattern for cart removal)
const cartAfterRemoval = products.filter(p => p.id !== 3);
// Returns every product except the one with id 3
```

The filter callback must return a truthy or falsy value. Any value that is truthy keeps the element; any falsy value removes it. You can even use a field directly as the predicate if that field is boolean:

```js
products.filter(p => p.inStock)  // same as filter(p => p.inStock === true)
```

### `.reduce()` — Collapse the Whole Array into One Value

`.reduce()` is the most powerful and most misunderstood of the three. It takes all the elements in an array and combines them into a single value — which can be a number, a string, an object, or even another array.

The callback receives two arguments: `accumulator` (the running result so far) and `currentValue` (the current element). The second argument to `.reduce()` itself is the starting value for the accumulator.

```js
// Sum all prices
const totalValue = products.reduce((total, p) => total + p.price, 0);
// 0 + 129.99 + 449.00 + 39.99 + 49.99 + 299.00 = 967.97

// Find the most expensive product
const mostExpensive = products.reduce((winner, p) =>
  p.price > winner.price ? p : winner
);
// { id: 2, name: 'Standing Desk', price: 449.00, ... }

// Count products per category
const countByCategory = products.reduce((counts, p) => {
  counts[p.category] = (counts[p.category] ?? 0) + 1;
  return counts;
}, {});
// { electronics: 2, furniture: 3 }
```

Let us trace through the sum example step by step so the mechanics are clear:

| Step | `total` (accumulator) | `p.price` | new `total` |
|---|---|---|---|
| Start | 0 | — | 0 |
| Product 1 | 0 | 129.99 | 129.99 |
| Product 2 | 129.99 | 449.00 | 578.99 |
| Product 3 | 578.99 | 39.99 | 618.98 |
| Product 4 | 618.98 | 49.99 | 668.97 |
| Product 5 | 668.97 | 299.00 | 967.97 |

The accumulator carries forward from one step to the next. The starting value (`0`) is what `total` holds before any product is processed.

The category grouping example is more advanced but extremely common in real applications. The accumulator starts as an empty object `{}`. For each product, we check if that category already has a count — if not, we start at 0, then add 1.

---

## Chaining Methods

Because `.map()`, `.filter()`, and other array methods return new arrays, you can chain them together. Each method operates on the array returned by the previous one.

```js
// Real scenario: get the names of available electronics, sorted alphabetically
const featuredElectronics = products
  .filter(p => p.category === 'electronics')  // keep only electronics
  .filter(p => p.inStock)                      // keep only in-stock ones
  .map(p => p.name)                            // extract just the names
  .sort();                                     // sort alphabetically
// ['Mechanical Keyboard', 'USB-C Hub']

// Get total value of in-stock items only
const inStockTotal = products
  .filter(p => p.inStock)
  .reduce((sum, p) => sum + p.price, 0);
// 129.99 + 449.00 + 49.99 + 299.00 = 927.98
```

Chained methods read almost like a sentence in English: "filter to in-stock items, then sum their prices." This clarity is one of the main reasons modern JavaScript favors this style over manual `for` loops.

---

## Other Essential Array Methods

### `.find()` and `.findIndex()` — Search for a Single Item

```js
// find() returns the first element that matches, or undefined
const keyboard = products.find(p => p.id === 1);
// { id: 1, name: 'Mechanical Keyboard', ... }

const notFound = products.find(p => p.id === 99);
// undefined — no product has id 99

// findIndex() returns the index, or -1 if not found
const standIndex = products.findIndex(p => p.name === 'Monitor Stand');
// 2

// Common pattern: update one item in an array by id
const updatedProducts = products.map(p =>
  p.id === 3 ? { ...p, inStock: true } : p
);
// All products unchanged except id 3, which now has inStock: true
```

### `.some()` and `.every()` — Check the Whole Collection

```js
// some() — true if AT LEAST ONE element matches
const hasOutOfStock = products.some(p => !p.inStock); // true
const hasUnder10    = products.some(p => p.price < 10); // false

// every() — true only if ALL elements match
const allInStock   = products.every(p => p.inStock);  // false
const allUnder500  = products.every(p => p.price < 500); // true
```

### `.sort()` — Careful, This One Mutates

`.sort()` is the dangerous outlier in the array method family — it mutates the original array in place. Always sort a copy.

```js
// WRONG — mutates the original products array
products.sort((a, b) => a.price - b.price);

// RIGHT — sort a copy using spread
const byPriceAsc  = [...products].sort((a, b) => a.price - b.price);
const byPriceDesc = [...products].sort((a, b) => b.price - a.price);

// Sort strings alphabetically
const byName = [...products].sort((a, b) => a.name.localeCompare(b.name));

// Default sort (no callback) sorts by string value — dangerous for numbers!
[10, 9, 100].sort();          // [10, 100, 9] — "100" < "9" alphabetically!
[10, 9, 100].sort((a, b) => a - b); // [9, 10, 100] — correct numerical sort
```

The sort callback returns a negative number, zero, or a positive number to indicate order. `a - b` means "sort ascending" (smaller values first). `b - a` means "sort descending."

### `Array.from()` — Create Arrays From Other Things

```js
// From a string
Array.from('hello');  // ['h', 'e', 'l', 'l', 'o']

// Generate a range of numbers (very useful for rendering a number of items)
Array.from({ length: 5 }, (_, i) => i + 1);  // [1, 2, 3, 4, 5]

// From a NodeList (DOM elements — you will use this in Module 05)
const listItems = Array.from(document.querySelectorAll('li'));
listItems.filter(el => el.classList.contains('active')); // now you can filter DOM nodes
```

---

## Objects: Labeled Filing Cabinets

An object is an unordered collection of key-value pairs. Think of it as a labeled filing cabinet — each drawer has a label (the key) and contains something inside (the value).

```js
// An object literal
const product = {
  id: 1,
  name: 'Mechanical Keyboard',
  price: 129.99,
  category: 'electronics',
  inStock: true,
};

// Access properties — two syntaxes
product.name;          // 'Mechanical Keyboard' — dot notation (preferred when key is known)
product['price'];      // 129.99 — bracket notation (needed for dynamic keys)

// Dynamic key access
const field = 'category';
product[field];        // 'electronics' — useful when the key name is in a variable
```

### Shorthand property names and computed keys

```js
const name  = 'Alice';
const score = 97;

// Without shorthand
const user1 = { name: name, score: score };

// With shorthand — when variable name matches the key name
const user2 = { name, score }; // same result: { name: 'Alice', score: 97 }

// Computed property names — when the key name is dynamic
const field  = 'role';
const config = { [field]: 'admin' }; // { role: 'admin' }

// This is useful when building objects programmatically
function createSetting(key, value) {
  return { [key]: value };
}
createSetting('theme', 'dark');   // { theme: 'dark' }
createSetting('language', 'en'); // { language: 'en' }
```

### Object Utility Methods

JavaScript provides three methods on `Object` for iterating over object data. You will use these constantly when working with API responses.

```js
const inventory = {
  keyboard: 42,
  monitor:  15,
  mouse:    88,
  webcam:   7,
};

// Object.keys() — array of all key names
Object.keys(inventory);    // ['keyboard', 'monitor', 'mouse', 'webcam']

// Object.values() — array of all values
Object.values(inventory);  // [42, 15, 88, 7]

// Object.entries() — array of [key, value] pairs
Object.entries(inventory);
// [['keyboard', 42], ['monitor', 15], ['mouse', 88], ['webcam', 7]]

// Iterate over an object's key-value pairs
for (const [item, count] of Object.entries(inventory)) {
  if (count < 20) {
    console.log(`Low stock: ${item} (${count} remaining)`);
  }
}
// Low stock: monitor (15 remaining)
// Low stock: webcam (7 remaining)

// Transform all values — map over entries and rebuild
const doubledInventory = Object.fromEntries(
  Object.entries(inventory).map(([key, value]) => [key, value * 2])
);
// { keyboard: 84, monitor: 30, mouse: 176, webcam: 14 }
```

The `Object.entries()` → transform → `Object.fromEntries()` pattern is the equivalent of `.map()` for objects. You will see it frequently in data transformation code.

---

## Immutable Update Patterns

This section is crucial for React. The rule is: **never modify an object or array that you received as data.** Instead, create a new copy with the changes applied. This is called an *immutable update*.

Why? Because JavaScript passes objects by reference, not by value. When you mutate an object, everyone who has a reference to that object sees the change — including React, which uses reference equality to decide whether to re-render.

```js
const user = {
  id: 1,
  name: 'Alice',
  address: { city: 'Portland', zip: '97201' },
  hobbies: ['cycling', 'reading'],
};

// Update a top-level property — spread and override
const renamed = { ...user, name: 'Alice Smith' };
// user.name is still 'Alice'; renamed.name is 'Alice Smith'

// Update a nested property — must spread at each level
const moved = {
  ...user,
  address: { ...user.address, city: 'Seattle' },
};
// user.address.city is still 'Portland'; moved.address.city is 'Seattle'

// Add an item to a nested array — spread the array
const withNewHobby = {
  ...user,
  hobbies: [...user.hobbies, 'hiking'],
};
// user.hobbies is still ['cycling', 'reading']
// withNewHobby.hobbies is ['cycling', 'reading', 'hiking']

// Remove a property — use destructuring with rest
const { address, ...userWithoutAddress } = user;
// address = { city: 'Portland', zip: '97201' }
// userWithoutAddress = { id: 1, name: 'Alice', hobbies: [...] }
```

### Immutable array operations

```js
const cart = [
  { id: 1, name: 'Keyboard', qty: 1 },
  { id: 2, name: 'Mouse',    qty: 2 },
  { id: 3, name: 'Webcam',   qty: 1 },
];

// Add an item
const withNewItem = [...cart, { id: 4, name: 'USB Hub', qty: 1 }];

// Remove an item by id
const withoutMouse = cart.filter(item => item.id !== 2);

// Update one item's quantity
const updatedCart = cart.map(item =>
  item.id === 1 ? { ...item, qty: item.qty + 1 } : item
);
// item with id 1 now has qty: 2, all others unchanged

// Replace an item entirely
const replacedCart = cart.map(item =>
  item.id === 3 ? { id: 3, name: 'HD Webcam', qty: 1 } : item
);
```

Each of these operations produces a **new array** with the change applied, leaving `cart` untouched. This is exactly the pattern React's `useState` hook expects.

---

## Flattening: `.flat()` and `.flatMap()`

Sometimes your data has nested arrays that you need to merge into a single level.

```js
// .flat() — flattens one level of nesting by default
const nested = [[1, 2], [3, 4], [5, 6]];
nested.flat(); // [1, 2, 3, 4, 5, 6]

// .flat(depth) — specify how many levels to flatten
const deep = [1, [2, [3, [4]]]];
deep.flat(1);    // [1, 2, [3, [4]]]
deep.flat(2);    // [1, 2, 3, [4]]
deep.flat(Infinity); // [1, 2, 3, 4] — flatten completely

// .flatMap() — map + flat(1) in one step (more efficient)
// Use case: each item transforms into zero or more items
const sentences = ['the quick brown fox', 'jumps over the lazy dog'];
const words = sentences.flatMap(sentence => sentence.split(' '));
// ['the', 'quick', 'brown', 'fox', 'jumps', 'over', 'the', 'lazy', 'dog']

// More realistic: each order has multiple items, and you want a flat list of all items
const orders = [
  { id: 1, items: ['Keyboard', 'Mouse'] },
  { id: 2, items: ['Monitor', 'Desk', 'Chair'] },
];
const allItems = orders.flatMap(order => order.items);
// ['Keyboard', 'Mouse', 'Monitor', 'Desk', 'Chair']
```

---

## Key Takeaways

- Arrays are ordered, objects are labeled. Both are your main containers for real application data.
- `.map()` transforms every item into something new. `.filter()` keeps only the matching items. `.reduce()` collapses everything into one value.
- All three return new arrays — the original is never touched. This is the behavior React depends on.
- `.sort()` is the exception: it mutates. Always sort a copy: `[...array].sort(...)`.
- Use `Object.entries()` to iterate over objects, `Object.fromEntries()` to rebuild them.
- Immutable update patterns (spread + override) are essential for React state. Never mutate objects or arrays you received as data.
- Chain array methods to express multi-step transformations in readable, declarative code.

---

## Activity: Product Dashboard

**Goal:** Practice all the major array and object methods by building a small product data pipeline.

**Setup:** Copy this dataset into your browser console:

```js
const products = [
  { id: 1, name: 'Mechanical Keyboard', price: 129.99, category: 'electronics', inStock: true,  rating: 4.8 },
  { id: 2, name: 'Standing Desk',       price: 449.00, category: 'furniture',   inStock: true,  rating: 4.5 },
  { id: 3, name: 'Monitor Stand',       price: 39.99,  category: 'furniture',   inStock: false, rating: 4.2 },
  { id: 4, name: 'USB-C Hub',           price: 49.99,  category: 'electronics', inStock: true,  rating: 4.6 },
  { id: 5, name: 'Ergonomic Chair',     price: 299.00, category: 'furniture',   inStock: true,  rating: 4.9 },
  { id: 6, name: 'Laptop Stand',        price: 59.99,  category: 'electronics', inStock: false, rating: 4.3 },
];
```

Work through these steps. Each one builds on the previous:

```js
// Step 1 — Get an array of just the names of in-stock products.
// Expected: ['Mechanical Keyboard', 'Standing Desk', 'USB-C Hub', 'Ergonomic Chair']
const inStockNames = /* your code */;

// Step 2 — Get the total price of all in-stock products.
// Expected: 928.98
const inStockTotal = /* your code — chain filter and reduce */;

// Step 3 — Get a new array of product objects that adds a `discountedPrice` property
// (10% off the original price, rounded to 2 decimal places). Leave the original array unchanged.
// Expected: each product object now has a discountedPrice field
const withDiscount = /* your code — use map + spread */;

// Step 4 — Sort a COPY of the products array by rating descending (highest first).
// Expected first item: Ergonomic Chair (4.9)
const byRating = /* your code — spread then sort */;

// Step 5 — Build an object that groups product names by category.
// Expected: { electronics: ['Mechanical Keyboard', 'USB-C Hub', 'Laptop Stand'],
//             furniture: ['Standing Desk', 'Monitor Stand', 'Ergonomic Chair'] }
const byCategory = /* your code — use reduce */;

// Step 6 — Find the cheapest in-stock product.
// Expected: { id: 4, name: 'USB-C Hub', price: 49.99, ... }
const cheapestInStock = /* your code — filter then reduce, or filter then sort */;
```

**Success check:**
- `inStockTotal` should be `928.98`
- `byRating[0].name` should be `'Ergonomic Chair'`
- The original `products` array should be completely unchanged after all your operations
- `byCategory.electronics.length` should be `3`

**Stretch goal:** Write a function `searchProducts(query)` that takes a search string and returns all products whose name includes that string (case-insensitive). Use `.filter()` and `.toLowerCase()`.
