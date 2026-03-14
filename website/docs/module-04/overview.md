---
sidebar_position: 1
title: Module 04 Overview
---

# Module 04 — TypeScript Fundamentals

## Why TypeScript?

TypeScript is a **superset of JavaScript** that adds static types. It compiles to plain JavaScript but catches an entire class of bugs before your code ever runs.

```ts
// JavaScript — no error until runtime
function getUser(id) {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
getUser(undefined);  // silent bug

// TypeScript — caught at compile time
function getUser(id: number): Promise<User> {
  return fetch(`/api/users/${id}`).then(r => r.json());
}
getUser(undefined);  //  Error: Argument of type 'undefined' is not assignable to 'number'
```

## Industry Adoption

TypeScript is now the default for serious frontend and backend projects:

- **React** — all official docs use TypeScript
- **Next.js** — TypeScript by default
- **NestJS** — written in TypeScript, requires it
- **Prisma** — generates TypeScript types from your schema
- **tRPC** — only works with TypeScript

## Learning Objectives

By the end of this module you can:

- Annotate variables, function parameters, and return types
- Define object shapes with `interface` and `type`
- Write reusable logic with generics
- Use built-in utility types (`Partial`, `Required`, `Pick`, `Omit`, etc.)
- Configure `tsconfig.json` for a real project

## Module Lessons

1. [Why TypeScript](./why-typescript)
2. [Types & Interfaces](./types-interfaces)
3. [Generics](./generics)
4. [Utility Types](./utility-types)
5. [tsconfig](./tsconfig)

## Challenge

Migrate the Module 03 Payroll Tracker from JavaScript to TypeScript:
- Add types to all functions and variables
- Create `Employee` and `PayrollState` interfaces
- Use generic utility types where appropriate

[View Challenge →](./challenge)
