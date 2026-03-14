---
sidebar_position: 1
title: Module 03 Overview
---

# Module 03 — JavaScript ES2024+

## Why This Module Matters

JavaScript is the only language that runs natively in the browser. Everything else (TypeScript, React, Next.js) compiles *down to* JavaScript. Understanding JS deeply makes you a far better developer with any framework.

## What's Changed Since the Bootcamp Was Written

| Old | Modern (ES2020+) |
|-----|-----------------|
| `var` | `const` / `let` |
| `function foo() {}` | Arrow functions |
| Callbacks | Promises → `async/await` |
| `require()` CommonJS | ES Modules (`import`/`export`) |
| `for...in` on arrays | `for...of`, `.forEach`, `.map` |
| String concatenation | Template literals |
| `arguments` object | Rest parameters |
| Manual object copy | Spread operator |
| `Object.assign` | Destructuring |
| `XMLHttpRequest` | `fetch` / `async/await` |

## Learning Objectives

By the end of this module you can:

- Declare variables correctly with `const` and `let`
- Write clean functions using arrow syntax and default parameters
- Use destructuring, spread, and rest in real code
- Understand closures and how the call stack works
- Write and consume Promises using `async/await`
- Organize code with ES Modules

## Module Lessons

1. [Variables, Types & Operators](./variables-types)
2. [Functions & Scope](./functions-scope)
3. [Arrays & Objects](./arrays-objects)
4. [Async JavaScript](./async-javascript)
5. [ES Modules](./modules-esm)

## Challenge

Build an Employee Payroll Tracker with:
- Add employees via prompt (name, salary)
- Sort by last name
- Display in a table
- Calculate and display average salary
- Pick a random employee

[View Challenge →](./challenge)
