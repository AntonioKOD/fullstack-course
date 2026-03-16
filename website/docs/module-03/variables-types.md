---
sidebar_position: 2
title: Variables, Types & Operators
---

# Variables, Types & Operators

:::info Learning Objectives
By the end of this lesson you will be able to:
- Choose between `const`, `let`, and `var` correctly, and explain why `var` is avoided in modern code
- Name all seven JavaScript primitive types and describe when each one appears in real-world code
- Predict the result of type coercion gotchas like `"5" + 3` vs `"5" - 3`, and explain why `===` prevents bugs that `==` causes
- Use `?.` and `??` together to safely read nested data from an API response without crashing
- Read a table of truthy and falsy values and use that knowledge to write cleaner conditionals
:::

## Why This Matters

In Modules 01 and 02 you described *what* a page looks like. Now you are going to describe *what it does*. The very first thing any program must be able to do is hold information: a user's name, the number of items in a shopping cart, whether someone is logged in.

In Module 06 you will fetch real data from a server. That data arrives as raw values — strings, numbers, booleans, `null` — and you will need to store it, inspect it, transform it, and display it safely. Every operator and pattern in this lesson is something you will reach for daily in every module from here on.

---

## Variables: Labels on Boxes

Think of a variable as a label stuck to a box. The label is the name you give the variable; the box holds the value. JavaScript gives you three ways to create that label, and they behave very differently.

### The analogy

- `const` — puts a **permanent lock** on the label. Once you attach `const` to a box, you cannot peel that label off and stick it on a different box. However, if the box contains an object (like a filing cabinet), you can still open the cabinet and change what is inside it.
- `let` — a **removable label**. You can relabel the box and point it at a completely different value any time you need to.
- `var` — an old, **broken label** that sometimes wanders into the wrong room and attaches itself to the wrong box. It was the only option before 2015. Modern JavaScript has no reason to use it.

```js
// const — block-scoped, cannot be reassigned. Use this by default.
const userName = 'Alice';
userName = 'Bob'; // TypeError: Assignment to constant variable.

// const with an object — the label is locked, but the contents can change
const user = { name: 'Alice', age: 28 };
user.name = 'Carol'; // This is fine — we changed contents, not the label
user.age  = 29;      // Also fine
user = {};           // TypeError — we tried to relabel the box entirely

// let — block-scoped, can be reassigned. Use when you need to update.
let score = 0;
score = score + 10; // Fine — let allows reassignment
score += 5;         // Same thing, shorter syntax

// var — function-scoped, hoisted, confusing. Do not use.
var legacyCode = 'avoid this';
```

After the third line (`user = {}`), you get a `TypeError`. This is the core idea: `const` prevents you from pointing the variable at a completely new value. It does **not** prevent you from modifying what is already inside an object or array. Those are two different operations.

:::tip Start every variable with `const`
Write `const` first. If you later need to reassign the variable and get a TypeError, switch it to `let`. This habit signals to anyone reading your code: "this value never changes after it is created." It makes your code easier to reason about and helps catch accidental reassignment bugs early.
:::

:::warning Common Mistake: Using `var`
`var` has a behavior called *hoisting* — the JavaScript engine moves `var` declarations to the top of their function before any code runs. This means you can reference a `var` variable before the line where you wrote it, and instead of an error, you get `undefined`. This makes bugs very hard to track down.

`var` is also function-scoped, not block-scoped. A `var` declared inside an `if` block leaks out into the surrounding function. `let` and `const` stay confined to the block `{}` where they were defined. There is no scenario in modern JavaScript where `var` is the right choice.
:::

---

## The Seven Primitive Types

JavaScript has exactly **seven primitive types**. These are the simplest possible values — they cannot be broken down further. When you assign a primitive to a variable, the variable holds the actual value directly.

```js
// 1. String — text, wrapped in single quotes, double quotes, or backticks
const firstName   = 'Alice';
const greeting    = "Hello, world!";
const multiLine   = `This is a
template literal`;            // backtick strings can span multiple lines

// 2. Number — one type covers both integers AND decimals
const price    = 9.99;
const quantity = 42;
const big      = 1_000_000;  // underscores are just a visual separator, ignored by JS
const notANum  = NaN;        // "Not a Number" — result of invalid math like 0/0

// 3. BigInt — for integers beyond Number's safe range (~9 quadrillion)
// You will rarely need this outside of cryptography or database IDs
const hugeId = 9007199254740993n;  // note the trailing 'n'

// 4. Boolean — exactly two possible values
const isLoggedIn = true;
const isPremium  = false;

// 5. null — intentional absence. A developer set this on purpose.
const selectedUser = null;  // "I know there is no user selected right now"

// 6. undefined — unintentional absence. No one assigned a value yet.
let pendingResult;           // JavaScript fills this with undefined automatically
console.log(pendingResult);  // undefined

// 7. Symbol — a guaranteed-unique value. Used in advanced patterns.
// You will see this in library code; you rarely write it yourself.
const uniqueKey = Symbol('id');
```

### `null` vs `undefined` — a critical distinction

This distinction trips up beginners constantly, especially when working with API data.

- `null` means **"empty on purpose."** A developer looked at this value and decided to clear it or set it to nothing.
- `undefined` means **"empty by omission."** JavaScript set it because no value was ever provided.

A practical example: you fetch a user's profile from a server. If the user has never entered their city, that field might come back as `undefined` (the property was never sent at all) or `null` (the server explicitly sent `null` to indicate "no value"). These mean slightly different things and you handle them differently.

:::tip The `null` / `undefined` mental model
When you see `undefined` in your console, it almost always means one of two things: you tried to access a property that does not exist on an object, or a function did not explicitly return a value. Both are signals that something is missing or misnamed.

When you see `null`, it was placed there deliberately. Treat it as a valid empty state.
:::

---

## Type Coercion: The Source of Most Beginner Bugs

JavaScript is *dynamically typed*, which means a variable can hold any type at any time. It also performs *type coercion* — silently converting values from one type to another when it needs to. This convenience causes some of the most confusing bugs in the language.

### The `+` operator vs arithmetic operators

The `+` operator is overloaded — it does string concatenation if either side is a string, and addition if both sides are numbers. Every other arithmetic operator (`-`, `*`, `/`) will try to convert its operands to numbers first.

```js
// + with a string — concatenation wins, number is converted to string
"5" + 3     // "53"  — the 3 becomes the string "3", then strings join
"5" + true  // "5true"

// -, *, / — always try to do math, converting strings to numbers
"5" - 3     // 2    — "5" becomes the number 5
"5" * 2     // 10
"10" / "2"  // 5

// When conversion fails, you get NaN
"hello" - 3  // NaN
undefined + 1 // NaN

// The double-plus trap: adding numbers from form inputs
const userInput = "42"; // form values are always strings
const result = userInput + 8; // "428" — not 50!

// Fix: convert to number first
const result2 = Number(userInput) + 8; // 50
const result3 = parseInt(userInput, 10) + 8; // 50
```

That last group is important. When you read a value from an HTML `<input>` field, it is **always a string**, even if the user typed a number. If you add it to another number with `+`, you get string concatenation. Always convert form inputs to numbers before doing arithmetic.

:::warning Common Mistake: Adding form input values directly
This catches almost every beginner at least once:
```js
// HTML: <input id="price" value="10">
const price = document.getElementById('price').value; // "10" — a string!
const total = price + 5;  // "105" — not 15!

// Always convert:
const total = Number(price) + 5; // 15
```
:::

### Equality: `==` vs `===`

The `==` operator performs type coercion before comparing — it tries to convert both sides to a common type using a set of rules that almost nobody has memorized correctly. The results are deeply confusing:

```js
// == (loose equality) — converts types before comparing. Avoid it entirely.
0   == false        // true  — false is converted to 0
''  == false        // true  — both convert to 0
1   == true         // true  — true converts to 1
null == undefined   // true  — special-case rule in the language spec
0   == ''           // true  — both convert to 0
0   == '0'          // true

// === (strict equality) — checks type AND value. Always use this.
0   === false       // false — different types (number vs boolean)
0   === 0           // true
null === undefined  // false — different types
null === null       // true
```

With `===`, JavaScript first asks: "Are these the same type?" If the answer is no, it immediately returns `false`. No conversion. No surprises. With `==`, it applies a complex set of conversion rules, and the results are inconsistent enough that even experienced developers sometimes get them wrong.

:::warning Always use `===`
There is no situation in modern JavaScript where `==` gives you something useful that `===` does not. Use `===` for every comparison, no exceptions. If you see `==` in code review, it is always worth questioning.
:::

---

## `typeof` — Checking a Value's Type

The `typeof` operator returns a string describing the type of a value:

```js
typeof 'hello'       // 'string'
typeof 42            // 'number'
typeof true          // 'boolean'
typeof undefined     // 'undefined'
typeof {}            // 'object'
typeof function(){}  // 'function'

// Two famous quirks you MUST know:
typeof null          // 'object'  — this is a bug from 1995, never fixed
typeof []            // 'object'  — arrays are objects in JavaScript
```

The `typeof null === 'object'` result is a decades-old bug in the language that can never be fixed because too much existing code accidentally depends on it. Similarly, arrays and objects both return `'object'`, so `typeof` alone is not enough to tell them apart.

```js
// Better checks for the tricky cases:
value === null         // the only reliable null check
Array.isArray([])      // true  — always use this for arrays, never typeof
Array.isArray({})      // false
typeof value === 'string'  // true only for strings
```

---

## Truthy and Falsy Values

In JavaScript, every value has an inherent boolean quality. When a value is used in a condition (`if`, `while`, `&&`, `||`), JavaScript converts it to `true` or `false` automatically. Values that convert to `false` are called *falsy*; everything else is *truthy*.

There are exactly **six falsy values** in JavaScript:

| Value | Type | Why it is falsy |
|---|---|---|
| `false` | Boolean | It is literally false |
| `0` | Number | Zero |
| `0n` | BigInt | Zero as BigInt |
| `""` or `''` or ` `` ` | String | Empty string |
| `null` | Null | Intentional empty |
| `undefined` | Undefined | Unset value |
| `NaN` | Number | Not a valid number |

Everything else is truthy — including empty arrays `[]`, empty objects `{}`, the string `"0"`, and the number `-1`.

```js
// Common truthy/falsy patterns in real code
const items = [];
if (items) {
  // This runs! An empty array is truthy.
  // To check if an array is empty, use items.length instead:
}
if (items.length) {
  // This does NOT run — 0 is falsy
}

const userName = '';
const displayName = userName || 'Anonymous'; // 'Anonymous' — empty string is falsy

const count = 0;
const label = count || 'none'; // 'none' — but this might be wrong if 0 is valid!
// Use ?? instead when 0 is a valid value:
const label2 = count ?? 'none'; // 0 — ?? only falls back for null/undefined
```

That last example is critical: `||` falls back for any falsy value, including `0` and `''`. If those are valid values in your data (a count of zero items, an empty string a user deliberately cleared), use `??` instead.

---

## `??` and `?.` — Essential for API Data

These two operators solve a problem you will face in nearly every project: working with data that might be missing or incomplete.

### The problem without these operators

Imagine you fetch a user object from a server. The user may not have filled out their display name. Their address might not exist at all. Without these operators, safe access looks like this:

```js
// Without ?? and ?. — verbose and easy to get wrong
const name = (user.displayName !== null && user.displayName !== undefined)
  ? user.displayName
  : 'Anonymous';

const city = (user.address !== null && user.address !== undefined)
  ? user.address.city
  : undefined;

// If user itself could be null, it gets even worse:
const city2 = user && user.address && user.address.city;
```

### `?.` — Optional Chaining

Optional chaining lets you access a property on something that might be `null` or `undefined`. If the left side is null or undefined, the whole expression short-circuits and returns `undefined` instead of throwing an error.

```js
const user = null;

// Without optional chaining — crashes:
user.address.city; // TypeError: Cannot read properties of null

// With optional chaining — returns undefined safely:
user?.address?.city; // undefined — no crash

// Works on array access too:
const firstTag = post?.tags?.[0]; // undefined if post or tags is missing

// Works on method calls:
const result = user?.getProfile?.(); // undefined if user or getProfile is missing
```

### `??` — Nullish Coalescing

The `??` operator returns the right side only when the left side is `null` or `undefined`. It is the safer alternative to `||` for providing default values.

```js
// ?? falls back only for null and undefined
null ?? 'default'       // 'default'
undefined ?? 'default'  // 'default'
0 ?? 'default'          // 0  — 0 is not null/undefined
'' ?? 'default'         // '' — empty string is not null/undefined
false ?? 'default'      // false

// || falls back for any falsy value — often too aggressive
0 || 'default'          // 'default' — but 0 might be a valid value!
'' || 'default'         // 'default' — but empty string might be intentional!
```

### Combining them — the real-world API pattern

```js
// You have a user object from an API. Some fields might be missing.
const user = {
  id: 7,
  username: 'jsmith',
  profile: {
    displayName: null,  // user never set this
    location: null,     // user never set this
  },
  settings: null,       // settings object never created
};

// Safe navigation + fallback defaults, all in one line:
const displayName = user?.profile?.displayName ?? 'Anonymous';
// 1. user?.profile — safe: if user is null, returns undefined
// 2. ?.displayName — safe: if profile is null, returns undefined
// 3. ?? 'Anonymous' — falls back because displayName is null

const theme = user?.settings?.theme ?? 'dark';
// user.settings is null, so ?.theme returns undefined, ?? gives 'dark'

const label = `Welcome, ${user?.profile?.displayName ?? user?.username ?? 'Guest'}!`;
// "Welcome, jsmith!" — displayName was null, falls to username
```

:::tip The API safety pattern
Whenever you access data from a server, use this mental model:
1. Use `?.` to safely navigate nested structures (things that might not exist)
2. Use `??` to provide a fallback when a value is missing
3. Combine: `data?.user?.profile?.name ?? 'Anonymous'`

This pattern appears in virtually every React component and API call you will write.
:::

---

## Template Literals

Template literals are strings surrounded by backtick characters. They allow embedded expressions and multi-line text, making them far more readable than string concatenation with `+`.

```js
const name  = 'Alice';
const score = 97;

// Old way — concatenation, error-prone
const msg1 = 'Hello, ' + name + '! Your score is ' + score + '.';

// Modern way — template literal
const msg2 = `Hello, ${name}! Your score is ${score}.`;

// Any valid JavaScript expression works inside ${}
const price  = 19.99;
const taxMsg = `Total with tax: $${(price * 1.08).toFixed(2)}`;
// "Total with tax: $21.59"

// Multi-line — great for building HTML fragments
const card = `
  <div class="user-card">
    <h2>${name}</h2>
    <p>Score: ${score}</p>
  </div>
`;

// Building API URLs (you will do this constantly in Module 06)
const userId  = 42;
const apiUrl  = `https://api.example.com/users/${userId}/posts`;
```

The `${}` syntax evaluates the expression inside, converts the result to a string, and inserts it. Notice the `toFixed(2)` call inside the second example — any valid JavaScript expression fits inside `${}`, not just variable names.

---

## Destructuring

Destructuring is a shorthand for pulling values out of arrays and objects into their own named variables. Think of it like unpacking a suitcase — instead of reaching back in repeatedly (`suitcase.shirt`, `suitcase.pants`, `suitcase.shoes`), you lay everything out at once.

### Object destructuring

```js
const product = {
  id: 101,
  name: 'Wireless Keyboard',
  price: 79.99,
  inStock: true,
};

// Without destructuring — verbose
const id      = product.id;
const name    = product.name;
const price   = product.price;

// With destructuring — clean
const { id, name, price, inStock } = product;

// Rename a property while destructuring
const { name: productName, price: productPrice } = product;
// productName = 'Wireless Keyboard', productPrice = 79.99

// Provide a default value (used only when the property is undefined)
const { id, name, category = 'Uncategorized' } = product;
// category = 'Uncategorized' because product has no category property

// Nested destructuring
const order = {
  id: 55,
  customer: { name: 'Alice', city: 'Portland' },
};
const { id: orderId, customer: { name: customerName, city } } = order;
// orderId = 55, customerName = 'Alice', city = 'Portland'
```

### Array destructuring

```js
// Array destructuring is position-based, not name-based
const [first, second, third] = [10, 20, 30];
// first = 10, second = 20, third = 30

// Skip positions with commas
const [,, thirdItem] = ['a', 'b', 'c'];
// thirdItem = 'c'

// Collect remaining items with rest
const [head, ...tail] = [1, 2, 3, 4, 5];
// head = 1, tail = [2, 3, 4, 5]

// Swap two variables without a temp variable
let a = 1, b = 2;
[a, b] = [b, a];
// a = 2, b = 1
```

### Destructuring in function parameters (you will use this constantly in React)

```js
// Without destructuring — must repeat the parameter name
function displayProduct(product) {
  return `${product.name} — $${product.price}`;
}

// With destructuring — clean, documents what the function needs
function displayProduct({ name, price, inStock = true }) {
  const availability = inStock ? 'In Stock' : 'Out of Stock';
  return `${name} — $${price} (${availability})`;
}

displayProduct({ name: 'Keyboard', price: 79.99 });
// "Keyboard — $79.99 (In Stock)"
```

In React, every component receives a single `props` object. Destructuring it in the parameter list is the standard way to access individual props.

:::warning Common Mistake: Destructuring `null` or `undefined`
If the thing you are trying to destructure does not exist, you get an immediate crash:
```js
const { name } = null;      // TypeError: Cannot destructure property 'name' of 'null'
const { name } = undefined; // TypeError: Cannot destructure property 'name' of 'undefined'
```
This happens very often when API data has not loaded yet. Always check that the data exists before destructuring, or use optional chaining: `const name = user?.name`.
:::

---

## Spread Operator

The spread operator (`...`) "spreads" the contents of an array or object into a new array or object. It is the primary tool for creating copies and merging data without mutating the originals.

```js
// Spread into a new array
const fruits  = ['apple', 'banana'];
const more    = [...fruits, 'cherry', 'date'];
// ['apple', 'banana', 'cherry', 'date'] — fruits is unchanged

// Copy an array (shallow)
const original = [1, 2, 3];
const copy     = [...original]; // [1, 2, 3] — a new array, not the same reference

// Spread into a new object
const defaults = { theme: 'dark', language: 'en', fontSize: 14 };
const userPrefs = { ...defaults, theme: 'light' }; // override just theme
// { theme: 'light', language: 'en', fontSize: 14 }

// Properties listed later override earlier ones — ORDER MATTERS
const a = { x: 1, y: 2 };
const b = { y: 99, z: 3 };
const merged = { ...a, ...b }; // { x: 1, y: 99, z: 3 } — b.y wins

// Spread to pass array as function arguments
const numbers = [3, 1, 4, 1, 5, 9];
Math.max(...numbers); // 9 — same as Math.max(3, 1, 4, 1, 5, 9)
```

The important thing about spread is that it creates a *shallow copy*. Top-level values are duplicated, but nested objects are still shared by reference. If you spread an object and then change a nested property, you change it in both the original and the copy. For truly nested updates you need to spread at each level.

```js
// Shallow copy — nested objects still share a reference
const user    = { name: 'Alice', address: { city: 'Portland' } };
const updated = { ...user, name: 'Alice Smith' };
updated.address.city = 'Seattle'; // also changes user.address.city!

// Correct — spread at each level
const safeUpdate = {
  ...user,
  address: { ...user.address, city: 'Seattle' }, // new address object
};
// Now user.address.city is still 'Portland'
```

:::tip Spread for React state updates
In React, you are **never allowed to mutate state directly**. Spread is your main tool for creating updated copies:
```js
// Wrong in React:
user.name = 'Bob';
setState(user); // React does not see the change!

// Right in React:
setState({ ...user, name: 'Bob' }); // a new object, React detects the change
```
This pattern appears in essentially every React application you will build.
:::

---

## Key Takeaways

- When you declare a variable, start with `const`. Change to `let` only if you need to reassign it. Never use `var`.
- When you compare values, always use `===`. The `==` operator performs type coercion and creates unpredictable bugs.
- `"5" + 3` is `"53"` (string concatenation). `"5" - 3` is `2` (arithmetic). The `+` operator is the tricky one.
- `null` means "empty on purpose." `undefined` means "empty by omission."
- `?.` lets you navigate nested objects safely when something might be `null` or `undefined`.
- `??` provides a fallback only for `null` and `undefined` — safer than `||` when `0` or `''` are valid values.
- Template literals (backticks) make building strings with variables clean and readable.
- Destructuring unpacks objects and arrays into named variables — use it in function parameters especially.
- Spread creates shallow copies of arrays and objects — essential for React state updates.

---

## Activity: User Profile Card

**Goal:** Practice all the key concepts from this lesson together — variables, type checking, optional chaining, nullish coalescing, destructuring, and template literals.

**The scenario:** Your application receives this raw user object from an API. Not every field is filled out, and one section is missing entirely.

```js
const apiResponse = {
  id: 7,
  username: 'jsmith',
  email: 'j@example.com',
  profile: {
    displayName: null,        // user never set a display name
    bio: 'I love JavaScript',
    location: null,           // user never set a location
  },
  settings: null,             // settings object was never created for this user
};
```

Work through each step in order in your browser console:

```js
// Step 1 — Destructure `id`, `username`, and `profile` from apiResponse.
// Do not destructure `settings` yet.
const { /* your code */ } = apiResponse;

// Step 2 — Destructure `displayName`, `bio`, and `location` from profile.
// Provide a default of 'Anonymous' for displayName in case it is null or missing.
// Remember: default values in destructuring only apply when the value is `undefined`,
// not when it is `null`. You will need ?? for the null case.
const { /* your code */ } = profile;

// Step 3 — Safely access apiResponse.settings.theme using optional chaining.
// This should return undefined without crashing, because settings is null.
const theme = /* your code here */;
console.log(theme); // expected: undefined

// Step 4 — Build a template literal that produces this exact string:
// "Profile #7: jsmith — I love JavaScript (Location: Unknown)"
// Use nullish coalescing (??) to show "Unknown" when location is null.
const card = /* your template literal */;
console.log(card);

// Step 5 — Use typeof to log the type of `id`, `bio`, and `theme`.
// Expected: 'number', 'string', 'undefined'
```

**Success check:** Your console should log `undefined` for `theme`, and `"Profile #7: jsmith — I love JavaScript (Location: Unknown)"` for `card` — with zero errors, even though `settings` is `null` and `location` is `null`.

**Stretch goal:** Refactor steps 1–4 into a single function called `buildProfileCard(apiResponse)` that takes the API response object and returns the card string. What happens if you call it with `buildProfileCard(null)`? Fix it so it does not crash.
