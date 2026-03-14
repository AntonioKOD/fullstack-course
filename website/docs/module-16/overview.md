---
sidebar_position: 1
title: Module 16 Overview
---

# Module 16 — React + TypeScript

## Why React?

React is the most widely-used frontend library in the industry. It lets you build complex UIs as a tree of composable, reusable components with predictable state management.

## Vite, Not Create React App

Create React App is dead (unmaintained). We use **Vite** — it's 10–100x faster:

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app && npm install
npm run dev
```

## Learning Objectives

- Create and compose functional components
- Manage state with `useState`, `useReducer`
- Sync with external systems using `useEffect`
- Fetch and cache server data with TanStack Query
- Navigate between pages with React Router v6

## Module Lessons

1. [Vite + TypeScript Setup](./vite-setup)
2. [Components & JSX](./components-jsx)
3. [State & Hooks](./state-hooks)
4. [TanStack Query](./react-query)
5. [React Router v6](./react-router)

## Challenge

Build a **React Portfolio** — a single-page app with About, Projects, Contact, and Resume sections, deployed to Netlify.

[View Challenge →](./challenge)
