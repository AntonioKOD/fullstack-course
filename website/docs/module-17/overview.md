---
sidebar_position: 1
title: Module 17 Overview
---

# Module 17 — Next.js App Router

## What Is Next.js?

Next.js is a React framework that adds server-side rendering, static generation, file-based routing, API routes, and edge computing on top of React. It's the most popular way to build production React applications.

## App Router vs Pages Router

Next.js 13+ introduced the **App Router** — a complete rethinking based on React Server Components. The old Pages Router still works but the App Router is the future.

| App Router (current) | Pages Router (legacy) |
|---------------------|----------------------|
| `app/` directory | `pages/` directory |
| Server Components by default | Client Components by default |
| `async` components | `getServerSideProps` |
| Nested layouts | `_app.tsx`, `_document.tsx` |
| Server Actions | API routes only |
| Streaming + Suspense | Manual loading states |

## Learning Objectives

- Understand the App Router directory structure
- Use Server Components for data fetching
- Add `'use client'` only when necessary
- Implement layouts and loading/error states
- Use Server Actions to mutate data
- Add authentication with NextAuth v5

## Module Lessons

1. [App Router](./app-router)
2. [Server Components](./server-components)
3. [Data Fetching](./data-fetching)
4. [Server Actions](./server-actions)
5. [NextAuth v5](./nextauth)

## Challenge

Build a **full-stack blog** with Next.js App Router:
- Public blog posts (SSG)
- Admin dashboard (protected routes)
- Create/edit posts with Server Actions
- GitHub OAuth via NextAuth

[View Challenge →](./challenge)
