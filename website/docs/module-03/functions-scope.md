---
sidebar_position: 3
title: Functions & Scope
---

# Functions & Scope

## Function Declarations vs Expressions vs Arrows

```js
// Function declaration — hoisted, callable before definition
function add(a, b) {
  return a + b;
}

// Function expression — not hoisted
const multiply = function(a, b) {
  return a * b;
};

// Arrow function — concise, no own `this`
const divide = (a, b) => a / b;

// Arrow with body
const greet = (name) => {
  const msg = `Hello, ${name}`;
  return msg;
};

// Single parameter — parens optional
const double = n => n * 2;

// No parameters — parens required
const getRandom = () => Math.random();

// Returning an object literal — wrap in parens
const makeUser = (name) => ({ name, createdAt: new Date() });
```

## Default Parameters

```js
function createPost(title, status = 'draft', tags = []) {
  return { title, status, tags };
}

createPost('Hello World');
// { title: 'Hello World', status: 'draft', tags: [] }

createPost('Hello World', 'published', ['js', 'tutorial']);
// { title: 'Hello World', status: 'published', tags: ['js', 'tutorial'] }
```

## Rest Parameters

```js
// Collect remaining arguments into an array
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}

sum(1, 2, 3, 4, 5); // 15

// Combine with named params
function log(level, ...messages) {
  console.log(`[${level}]`, ...messages);
}

log('ERROR', 'Something', 'went', 'wrong');
// [ERROR] Something went wrong
```

## Scope

```js
const global = 'I am global';  // accessible everywhere

function outer() {
  const outerVar = 'outer';

  function inner() {
    const innerVar = 'inner';
    console.log(outerVar);  //  can access outer scope
    console.log(global);    //  can access global scope
  }

  // console.log(innerVar);  //  ReferenceError
}
```

## Closures

A closure is a function that "remembers" variables from its outer scope even after the outer function has finished executing.

```js
function makeCounter(start = 0) {
  let count = start;  // this variable is "closed over"

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
    reset: () => { count = start; },
  };
}

const counter = makeCounter(10);
counter.increment(); // 11
counter.increment(); // 12
counter.decrement(); // 11
counter.value();     // 11
counter.reset();
counter.value();     // 10
```

Another classic example — factory functions:

```js
function multiply(multiplier) {
  return (number) => number * multiplier;  // closes over `multiplier`
}

const double = multiply(2);
const triple = multiply(3);

double(5);  // 10
triple(5);  // 15
```

## Higher-Order Functions

Functions that take or return other functions:

```js
// Takes a function as argument
function runTwice(fn) {
  fn();
  fn();
}

runTwice(() => console.log('hello'));

// Returns a function
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const handleSearch = debounce((query) => fetchResults(query), 300);
```

## The Call Stack

JavaScript is **single-threaded** — it executes one thing at a time using a call stack:

```js
function c() { console.log('c'); }
function b() { c(); console.log('b'); }
function a() { b(); console.log('a'); }

a();
// Call stack progression:
// → a() pushed
// → b() pushed inside a
// → c() pushed inside b
// c logs, pops
// b logs, pops
// a logs, pops
// Output: c, b, a
```

Understanding the call stack helps debug stack overflow errors (infinite recursion) and understand async behavior.

## IIFE (Immediately Invoked Function Expression)

Used to create a private scope — still appears in legacy code:

```js
(function() {
  const secret = 'not accessible outside';
  console.log('runs immediately');
})();

// Modern equivalent: just use a block with let/const
{
  const secret = 'not accessible outside';
}
```

## Pure Functions

A pure function always returns the same output for the same input and has no side effects:

```js
//  Impure — depends on external state, mutates input
let total = 0;
function addToTotal(amount) {
  total += amount;  // side effect
  return total;
}

//  Pure — predictable, testable
function add(a, b) {
  return a + b;
}

//  Impure — mutates the array
function addItem(arr, item) {
  arr.push(item);  // mutation
  return arr;
}

//  Pure — returns new array
function addItem(arr, item) {
  return [...arr, item];
}
```

Prefer pure functions — they're easier to test, debug, and reason about.
