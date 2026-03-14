---
sidebar_position: 1
title: Module 19 Overview
---

# Module 19 — State Management with Zustand

## Context API vs Zustand

React's built-in Context API works well for simple global state (theme, auth user). For anything more complex, it causes unnecessary re-renders and becomes unwieldy.

**Zustand** is a tiny (~1KB), fast, unopinionated state manager that solves these problems with a minimal API.

| | Context API | Zustand |
|--|-------------|---------|
| Bundle size | Built-in | ~1KB |
| Boilerplate | High (Provider, useContext, etc.) | Minimal |
| Re-renders | All consumers re-render | Only subscribed components |
| DevTools |  No |  Redux DevTools compatible |
| Async actions | Manual | First-class |
| Persist to storage | Manual | `zustand/middleware` |

## Learning Objectives

- Create stores with `create()`
- Subscribe from components with auto-optimized re-renders
- Handle async actions inside stores
- Use devtools and persist middleware
- Know when Zustand beats Context API

## Module Lessons

1. [Zustand Basics](./zustand-basics)
2. [Async Actions](./async-actions)
3. [DevTools & Persist](./devtools-persist)
4. [vs Context API](./vs-context-api)

## Challenge

Migrate the React Portfolio's state (theme, active section) to Zustand, and add a cart store for a product page.

[View Challenge →](./challenge)
