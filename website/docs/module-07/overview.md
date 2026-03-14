---
sidebar_position: 1
title: Module 07 Overview
---

# Module 07 — Node.js + TypeScript

## Welcome to the Backend

So far everything ran in the browser. Node.js lets you run JavaScript (and TypeScript) on a server — handling HTTP requests, reading files, connecting to databases, and anything that requires access to the operating system.

## What's Different from the Browser

| Browser | Node.js |
|---------|---------|
| `window`, `document` | `process`, `__dirname` |
| `fetch` (built-in) | `fetch` (built-in v18+) or `node-fetch` |
| `localStorage` | File system (`fs`) |
| Single user | Many concurrent users |
| Runs JS only | Runs JS/TS with `tsx` or compiled output |

## Learning Objectives

- Run TypeScript files directly with `tsx`
- Use Node's built-in modules: `fs`, `path`, `os`, `crypto`
- Parse command-line arguments
- Read and write files (sync and async)
- Organize code into npm packages

## Module Lessons

1. [Node.js Fundamentals](./node-fundamentals)
2. [TypeScript in Node](./typescript-node)
3. [File System](./file-system)
4. [npm Packages](./npm-packages)

## Challenge

Build a CLI tool — a **README generator** that prompts the user with questions (using `inquirer`) and outputs a formatted `README.md`.

[View Challenge →](./challenge)
