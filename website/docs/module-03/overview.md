---
sidebar_position: 1
title: Module 03 Overview
---

# Module 03 — JavaScript Fundamentals

:::info Learning Objectives
By the end of this module you will be able to:
- Store and manipulate data using variables, the correct types, and modern operators
- Write reusable functions and explain how scope keeps your code organized
- Transform and query collections of data using array and object methods
- Write code that waits for slow operations (network requests, timers) without freezing the page
- Split your code across multiple files using ES Modules
:::

## Welcome to Your First Programming Language

In Modules 01 and 02 you built the structure and style of web pages. HTML told the browser *what* to show; CSS told it *how* to make it look. But neither of those languages can make a decision, respond to a user's click, fetch fresh data from a server, or update the page without a full reload. For all of that, you need JavaScript.

JavaScript is the only programming language that runs natively inside every web browser in the world. Everything you will learn in the rest of this course — React, Node.js, APIs, databases — either runs *as* JavaScript or compiles *down to* JavaScript before it reaches the browser. Getting a solid foundation here pays dividends for the entire course and for your career afterward.

## This Module in the Context of the Full Course

Here is how the concepts you learn in this module map to future projects:

| What you learn here | Where you use it |
|---|---|
| Variables, types, operators | Every single file you ever write |
| Functions and scope | Module 05 (DOM), Module 06 (APIs), Module 16 (React) |
| Arrays and objects | Module 06 (API data), Module 16 (React state) |
| Async JavaScript (`fetch`, `await`) | Module 06 (server APIs), Module 18 (full-stack) |
| ES Modules (`import`/`export`) | Module 16 (React), Module 18 (Node/Express) |

## What Has Changed Since the Old Bootcamp Materials

You may encounter older JavaScript tutorials, Stack Overflow answers, and bootcamp materials that use patterns JavaScript has moved away from. Here is a quick translation table so you can recognize old code and know what the modern equivalent is:

| Old pattern | Modern equivalent (ES2015–ES2024) |
|---|---|
| `var` | `const` / `let` |
| `function foo() {}` everywhere | Arrow functions for callbacks and short helpers |
| Nested callbacks for async work | Promises, then `async/await` |
| `require()` (CommonJS) | `import` / `export` (ES Modules) |
| `for...in` on arrays | `for...of`, `.forEach()`, `.map()` |
| String concatenation with `+` | Template literals with `` ` `` |
| `arguments` object | Rest parameters (`...args`) |
| Manual object copying | Spread operator (`...`) |
| Verbose null checks | Optional chaining (`?.`) and nullish coalescing (`??`) |
| `XMLHttpRequest` | `fetch()` with `async/await` |

You do not need to memorize this table. It is here so that when you see old code in the wild, you have a mental map for translating it.

## How This Module Is Structured

Each lesson follows the same pattern: a real-world analogy first, then the code, then an explanation of what just happened, and finally a hands-on activity to cement the concept. Resist the urge to copy-paste the code examples without reading the explanations — the explanations are where the learning happens.

## Module Lessons

1. [Variables, Types & Operators](./variables-types) — How JavaScript stores and compares data
2. [Functions & Scope](./functions-scope) — Reusable blocks of logic and how variables stay organized
3. [Arrays & Objects](./arrays-objects) — Working with collections of data
4. [Async JavaScript](./async-javascript) — Writing code that waits without blocking
5. [ES Modules](./modules-esm) — Splitting your code across files

## Module Challenge

Build an **Employee Payroll Tracker** that combines every concept from this module:

- Collect employee names and salaries using `prompt()`
- Store the employees in an array of objects
- Sort the list by last name
- Display the list in a formatted HTML table
- Calculate and display the average salary
- Add a button that picks and highlights a random employee

You will not need any libraries for this — pure JavaScript, applied to the DOM.

[View Challenge Details →](./challenge)

---

:::tip A note on trying things out
Every code example in this module can be run immediately. Open your browser, press **F12** to open DevTools, click the **Console** tab, and type (or paste) any JavaScript you see. The console is your sandbox — experiment freely, make mistakes, and see what happens. That is how programmers actually learn.
:::
