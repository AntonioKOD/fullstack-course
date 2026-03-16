---
sidebar_position: 3
title: Functions & Scope
---

# Functions & Scope

:::info Learning Objectives
By the end of this lesson you will be able to:
- Write a function three different ways (declaration, expression, arrow) and explain when each form is appropriate
- Trace a scope chain and predict which variables are accessible from any point in a program
- Explain what a closure is and build a simple counter that demonstrates one
- Recognize common function mistakes like forgetting `return` and misusing `this` inside arrow functions
:::

## Why This Matters

Functions are the single most important building block in JavaScript. Everything you do in this course — fetching data in Module 06, handling button clicks in Module 05, building components in Module 16 — will involve writing and calling functions. Scope determines which data those functions can see and which data stays private. Closures make it possible to build features like counters, event handlers that remember state, and the useState hook in React.

If you understand this lesson well, the rest of the course will feel like putting familiar pieces together. If you skip the explanations and only look at the code examples, scope bugs will confuse you for months.

---

## Functions Are Recipes

The best analogy for a function is a recipe. A recipe is a set of instructions you write once and can follow as many times as you need. You give it ingredients (parameters) and it produces a result (the return value). The recipe itself just sits on a shelf — it does not do anything until you actually cook (call the function).

```js
// Writing the recipe (defining the function)
function makeGreeting(name, timeOfDay) {
  const greeting = `Good ${timeOfDay}, ${name}!`;
  return greeting;
}

// Following the recipe (calling the function)
const morning = makeGreeting('Alice', 'morning');
const evening = makeGreeting('Bob', 'evening');
console.log(morning); // "Good morning, Alice!"
console.log(evening); // "Good evening, Bob!"
```

The function is defined once and used twice with different ingredients. The same set of instructions produces different results depending on what you pass in.

:::warning Common Mistake: Forgetting `return`
This is the single most common beginner mistake with functions. If you forget `return`, the function returns `undefined` automatically:
```js
function add(a, b) {
  a + b; // calculated, but thrown away — no return!
}

const result = add(2, 3);
console.log(result); // undefined — not 5!
```
If your function is supposed to give back a value, always include an explicit `return` statement. When debugging a function that seems to produce nothing, check for a missing `return` first.
:::

---

## Three Ways to Write a Function

JavaScript has three distinct syntaxes for creating functions. They are not interchangeable — each has specific use cases and behaviors.

### 1. Function Declaration

```js
// Function declaration — defined with the `function` keyword
function add(a, b) {
  return a + b;
}

// Key property: hoisted — you can call it before it appears in the file
const result = add(2, 3); // 5 — works even if add() is defined below this line
```

A function declaration is *hoisted* to the top of its scope before any code runs. The JavaScript engine processes all function declarations first, then executes code top-to-bottom. This is why you can call `add()` before the line where it is written.

**When to use it:** Top-level utility functions, named helpers in a file. Hoisting is a useful property here because you can organize your file with the most important logic at the top and helper functions at the bottom.

### 2. Function Expression

```js
// Function expression — a function assigned to a variable
const multiply = function(a, b) {
  return a * b;
};

// NOT hoisted — you cannot call it before this line
const result = multiply(4, 5); // 20
```

A function expression assigns an anonymous function to a variable. Because it is assigned like any other value, it follows the same rules as `const` and `let` — you cannot use it before the line where it is defined.

**When to use it:** When you want to pass a function as an argument, store it in an object, or explicitly prevent it from being called early.

### 3. Arrow Function

Arrow functions are the modern shorthand. They have a shorter syntax and one critical behavioral difference: they do not have their own `this` value. This matters a lot in certain contexts (covered below).

```js
// Arrow function — the most compact syntax
const divide = (a, b) => a / b;

// Arrow with a block body (when you need multiple statements)
const greet = (name) => {
  const message = `Hello, ${name}!`;
  return message; // explicit return required when using {}
};

// Single parameter — parentheses are optional (but including them is more consistent)
const double = n => n * 2;

// No parameters — empty parentheses are required
const getRandom = () => Math.random();

// Returning an object literal — wrap it in parentheses
// Without parens, JavaScript thinks { } is a function body, not an object
const makePoint = (x, y) => ({ x, y });
makePoint(3, 4); // { x: 3, y: 4 }
```

The two-liner behavior is important: when you use a block body `{ }`, you must write an explicit `return`. When you omit the braces (the one-liner form), the expression is returned automatically. This is called an *implicit return*.

```js
// Implicit return — the expression result is returned automatically
const square = n => n * n;

// Explicit return — required when the body uses { }
const squareVerbose = n => {
  return n * n;
};

// Common mistake — implicit return with an object
const makeUser = name => { name }; // WRONG — { name } is a block, not an object
const makeUser = name => ({ name }); // CORRECT — ({ }) tells JS "this is an object"
```

**When to use arrow functions:** Almost everywhere in modern JavaScript — callbacks for array methods like `.map()` and `.filter()`, event handlers, and any short helper function. They are the default choice for modern code.

:::tip Choosing a function form
A practical rule of thumb:
- **Arrow function** — your default for callbacks and short helpers (`array.map(x => x * 2)`)
- **Function declaration** — for named, standalone functions that benefit from hoisting
- **Function expression** — when you want to explicitly control where the function becomes available

In React, components are usually arrow functions or function declarations. Event handlers inside components are almost always arrow functions.
:::

---

## Default Parameters and Rest Parameters

### Default parameters

You can specify a default value for any parameter. The default is used when that argument is `undefined` — either because the caller omitted it or explicitly passed `undefined`.

```js
function createPost(title, status = 'draft', tags = []) {
  return { title, status, tags };
}

createPost('My First Post');
// { title: 'My First Post', status: 'draft', tags: [] }

createPost('Announcement', 'published', ['news', 'update']);
// { title: 'Announcement', status: 'published', tags: ['news', 'update'] }

// Default is triggered by undefined, not null:
createPost('Test', undefined, ['js']); // status = 'draft' (undefined triggered default)
createPost('Test', null, ['js']);       // status = null (null does NOT trigger default)
```

### Rest parameters

The rest parameter syntax collects all remaining arguments into an array. It must be the last parameter.

```js
// ...numbers collects everything after the first argument into an array
function sum(...numbers) {
  return numbers.reduce((total, n) => total + n, 0);
}

sum(1, 2, 3, 4, 5); // 15
sum(10, 20);        // 30

// Mix named params with rest — named params come first
function logMessage(level, ...messages) {
  console.log(`[${level}]`, messages.join(' '));
}

logMessage('ERROR', 'Something', 'went', 'wrong');
// [ERROR] Something went wrong
```

---

## Scope: Code Inside a Room

Scope controls which variables are visible from which parts of your code. The clearest mental model is to think of each function body as a **room with walls**. Code inside the room can see everything outside (into the hallway, into the building lobby). But code outside the room cannot see in.

```js
const buildingLobby = 'Everyone can see me'; // global scope

function outerRoom() {
  const outerVar = 'Visible inside outer and its sub-rooms';

  function innerRoom() {
    const innerVar = 'Only visible inside innerRoom';

    // innerRoom can see inward and outward:
    console.log(innerVar);     // 'Only visible inside innerRoom'
    console.log(outerVar);     // 'Visible inside outer and its sub-rooms'
    console.log(buildingLobby); // 'Everyone can see me'
  }

  // outerRoom CANNOT see into innerRoom:
  // console.log(innerVar); // ReferenceError — no access!

  innerRoom(); // call the inner function from inside outer
}

outerRoom();
```

When JavaScript looks up a variable name, it starts in the current scope and works outward — current function, then the function that contains that, then the function that contains that, all the way out to the global scope. This chain of scopes is called the *scope chain*.

### Block scope with `let` and `const`

`let` and `const` are block-scoped — they are confined to the nearest set of curly braces `{}`, which could be a function, an `if` statement, a `for` loop, or just a standalone block.

```js
function checkAge(age) {
  if (age >= 18) {
    const message = 'Access granted'; // block-scoped to this if block
    let count = 0;                    // also block-scoped
    console.log(message);             // 'Access granted'
  }
  // console.log(message); // ReferenceError — message is gone after the block closes
  // console.log(count);   // ReferenceError — count is gone too
}

// var leaks out of blocks (but not out of functions)
function example() {
  if (true) {
    var leaked = 'I escape the block!';
    let confined = 'I stay here';
  }
  console.log(leaked);   // 'I escape the block!' — var ignores block scope
  // console.log(confined); // ReferenceError
}
```

This is one of the main reasons `var` was replaced. A `var` inside a `for` loop leaks into the surrounding function, which causes subtle bugs that are very hard to track down.

---

## Closures: Functions That Remember

A closure is what happens when an inner function *remembers* variables from its outer scope even after the outer function has finished running. This sounds subtle, but it is one of the most powerful and commonly used patterns in JavaScript.

### The counter example

```js
function makeCounter(startValue = 0) {
  let count = startValue; // this variable is "closed over" by the returned functions

  return {
    increment: () => ++count,
    decrement: () => --count,
    value:     () => count,
    reset:     () => { count = startValue; },
  };
}

const counter = makeCounter(10);
```

When `makeCounter(10)` is called, it runs, sets `count = 10`, and then returns an object. The outer function is done — it is finished executing. But here is what makes closures remarkable: the four inner functions (`increment`, `decrement`, `value`, `reset`) still have access to `count`, because they were created inside `makeCounter` and captured a reference to that variable.

```js
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.value();     // 11
counter.reset();
counter.value();     // 10

// Each counter has its own independent count:
const counterA = makeCounter(0);
const counterB = makeCounter(100);

counterA.increment(); // 1
counterA.increment(); // 2
counterB.increment(); // 101
counterA.value();     // 2 — completely independent from counterB
counterB.value();     // 101
```

Each call to `makeCounter` creates a completely new `count` variable. The two counters do not share any state. This is the power of closures — they let you create private, encapsulated state without needing classes or global variables.

### Where you will see closures

Closures appear everywhere in real JavaScript code:

```js
// Event handlers capturing variables from their surrounding function
function setupButton(buttonElement, userId) {
  buttonElement.addEventListener('click', () => {
    // This callback closes over `userId`
    // Even after setupButton returns, the callback still remembers userId
    fetchUserData(userId);
  });
}

// Factory functions — create specialized versions of a function
function createMultiplier(factor) {
  return (number) => number * factor; // closes over `factor`
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

double(5); // 10
triple(5); // 15
double(7); // 14

// setTimeout closing over a variable
function greetAfterDelay(name, delayMs) {
  setTimeout(() => {
    console.log(`Hello, ${name}!`); // closes over `name`
  }, delayMs);
}
```

:::tip The closure mental model
When you see a function defined inside another function, ask: "What variables from the outer function does this inner function use?" Those variables are "closed over" — they stay alive as long as the inner function exists, even after the outer function is done.

In React, the useState hook and useEffect hook are both built on closures. When you pass a callback to `useEffect`, it closes over the component's state variables. Understanding closures now will make Hooks much less mysterious later.
:::

---

## Higher-Order Functions

A higher-order function is one that either takes a function as an argument or returns a function. This is a concept you already use every time you call `.map()` or `.filter()` — those are higher-order functions built into JavaScript.

```js
// .map() is a higher-order function — it takes a function as an argument
const prices  = [10, 20, 30];
const withTax = prices.map(price => price * 1.1);
// [11, 22, 33]

// Writing your own higher-order function
function runTwice(fn) {
  fn();
  fn();
}

runTwice(() => console.log('hello'));
// hello
// hello

// Returning a function (this creates a closure)
function makeAdder(x) {
  return (y) => x + y; // the returned function closes over `x`
}

const add5 = makeAdder(5);
const add10 = makeAdder(10);
add5(3);  // 8
add10(3); // 13
```

Higher-order functions let you write flexible, reusable code by treating behavior as data that can be passed around.

---

## `this` and Why Arrow Functions Are Different

`this` is one of JavaScript's most confusing features. For now, the key thing to understand is that `this` has different values depending on how a function is called, and arrow functions handle it very differently from regular functions.

```js
// Regular function — `this` depends on how it was called
const user = {
  name: 'Alice',
  greet: function() {
    return `Hello, I am ${this.name}`; // `this` = the user object
  },
};
user.greet(); // "Hello, I am Alice"

// Arrow function — `this` is inherited from the surrounding scope, not the caller
const user2 = {
  name: 'Bob',
  greet: () => {
    return `Hello, I am ${this.name}`; // `this` here is NOT the user2 object!
    // `this` is whatever it was in the code that surrounds user2 (likely window or undefined)
  },
};
user2.greet(); // "Hello, I am undefined" — a common bug!
```

:::warning Common Mistake: Using `this` inside an arrow function for an object method
Arrow functions do not have their own `this`. They capture `this` from wherever they were defined. This means you should **not** use arrow functions as methods on objects when you need `this` to refer to the object.

```js
// Wrong — arrow function loses the object's `this`
const timer = {
  seconds: 0,
  start: () => {
    setInterval(() => {
      this.seconds++; // `this` is not timer! Bug!
    }, 1000);
  },
};

// Right — use a regular function for the method
const timer = {
  seconds: 0,
  start: function() {
    setInterval(() => {
      this.seconds++; // `this` is timer — the arrow inherits `this` from start()
    }, 1000);
  },
};
```

In React, you rarely write object methods manually — components use hooks instead. But this distinction matters whenever you work with event listeners and class-based patterns.
:::

---

## Pure Functions

A pure function always returns the same output for the same input and does not change anything outside itself (no *side effects*). Pure functions are easier to test, debug, and reason about.

```js
// Impure — depends on external state, cannot predict output without knowing total
let runningTotal = 0;
function addToTotal(amount) {
  runningTotal += amount; // side effect: modifying external state
  return runningTotal;    // result depends on external state, not just arguments
}

// Pure — same input always produces same output, nothing changed outside
function add(a, b) {
  return a + b;
}

// Impure — mutates the original array
function addItem(arr, item) {
  arr.push(item); // mutation: changing the original array
  return arr;
}

// Pure — returns a new array, original untouched
function addItemPure(arr, item) {
  return [...arr, item]; // spread creates a new array
}
```

In React, you must write pure functions for your components — the same props must always produce the same rendered output. Keeping your functions pure (especially when working with arrays and objects) is a habit worth building now.

---

## The Call Stack

JavaScript executes one thing at a time using a **call stack** — a record of which functions are currently running. When a function is called, it is pushed onto the stack. When it returns, it is popped off.

```js
function c() {
  console.log('c is running');
  return 'c done';
}

function b() {
  console.log('b is running, about to call c');
  const result = c();
  console.log('c returned:', result);
  return 'b done';
}

function a() {
  console.log('a is running, about to call b');
  const result = b();
  console.log('b returned:', result);
}

a();
// Output:
// a is running, about to call b
// b is running, about to call c
// c is running
// c returned: c done
// b returned: b done
```

The stack at its deepest point looks like this (bottom is oldest):
```
c()  ← currently executing
b()  ← waiting for c to return
a()  ← waiting for b to return
```

Understanding the call stack helps you read error stack traces. When you see a long red error in the browser console, the stack trace shows you the exact sequence of function calls that led to the problem — read it bottom-to-top to trace the path.

---

## Key Takeaways

- Functions are recipes: written once, reusable as many times as you need, parameterized with inputs and a return value.
- The three function forms (declaration, expression, arrow) are not interchangeable. Arrow functions are the modern default for callbacks; function declarations are good for top-level named functions.
- Always include an explicit `return` statement if the function is supposed to produce a value.
- Scope is like nested rooms: code can see outward but not inward. `let` and `const` are block-scoped; `var` is function-scoped (and leaks from blocks).
- Closures let inner functions remember variables from their outer scope even after the outer function is done running.
- Do not use arrow functions as object methods if you need `this` to refer to the object.
- Prefer pure functions — same input, same output, no side effects.

---

## Activity: Function Workshop

**Goal:** Practice function declarations, arrow functions, closures, and scope through four progressively harder challenges.

### Challenge 1 — Basic function writing

Write a function called `formatPrice` that takes a number and returns a string like `"$19.99"`. It should always show exactly two decimal places.

```js
// Starter
function formatPrice(price) {
  // your code here
}

// Expected results:
formatPrice(9.99);   // "$9.99"
formatPrice(100);    // "$100.00"
formatPrice(5.5);    // "$5.50"
```

**Hint:** Look up `toFixed()` on MDN. The result of `toFixed` is a string, not a number.

### Challenge 2 — Default parameters

Rewrite `formatPrice` as an arrow function that accepts a second parameter `currency` with a default value of `'$'`.

```js
const formatPrice = (/* your parameters */) => /* your implementation */;

formatPrice(9.99);        // "$9.99"
formatPrice(9.99, '€');   // "€9.99"
formatPrice(9.99, '£');   // "£9.99"
```

### Challenge 3 — Closures

Write a function `makeGreeter` that takes a `greeting` string and returns a new function. The returned function should take a `name` and return a personalized greeting string.

```js
// Starter
function makeGreeter(greeting) {
  // return a function that closes over `greeting`
}

const sayHello = makeGreeter('Hello');
const sayHowdy = makeGreeter('Howdy');

sayHello('Alice');  // "Hello, Alice!"
sayHello('Bob');    // "Hello, Bob!"
sayHowdy('Carol');  // "Howdy, Carol!"
```

### Challenge 4 — Scope prediction

Before running this code, predict what each `console.log` will print. Then run it to check yourself.

```js
const x = 'global';

function outer() {
  const x = 'outer';
  function inner() {
    const x = 'inner';
    console.log('A:', x); // predict this
  }
  inner();
  console.log('B:', x); // predict this
}

outer();
console.log('C:', x); // predict this
```

**Success check:** You should get `'$9.99'` for Challenge 1, a working `makeGreeter` factory for Challenge 3, and your scope predictions should match the actual output for Challenge 4. If Challenge 4 surprised you, re-read the "Scope: Code Inside a Room" section.
