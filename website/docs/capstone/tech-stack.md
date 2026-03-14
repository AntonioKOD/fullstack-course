---
sidebar_position: 3
title: Recommended Tech Stack
---

# Recommended Tech Stack

## Option A — Next.js Full-Stack (Recommended for Most Projects)

Best when: you want to ship fast, the team is small, no separate mobile app.

```
next.js 15 (App Router)
 app/
    (auth)/          # login, register pages
    (dashboard)/     # protected pages
    api/             # API routes (webhooks, etc.)
    actions/         # Server Actions for mutations
 components/          # React components
 lib/
    auth.ts          # NextAuth config
    prisma.ts        # Prisma client
 prisma/
     schema.prisma

Deployment: Vercel (free tier)
Database: Supabase PostgreSQL (free tier)
Auth: NextAuth v5
File uploads: Cloudflare R2 or Vercel Blob
```

## Option B — Separate API + Frontend

Best when: you want a standalone API (future mobile app), or want to learn NestJS properly.

```
apps/
 api/           # NestJS or Express
    src/
       modules/
       prisma/
    prisma/
    Dockerfile
 web/           # Vite + React or Next.js
     src/
         api/   # API client wrappers
         ...

Deployment:
  API  → Railway ($5/month hobby)
  Web  → Vercel (free)
  DB   → Supabase (free)
```

## Required Packages (Both Options)

```bash
# Core
npm install prisma @prisma/client
npm install zod

# Auth (Next.js)
npm install next-auth@beta

# Auth (Express/NestJS)
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# UI
npm install @tailwindcss/vite  # or built-in Next.js
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu  # headless components
npm install clsx tailwind-merge  # class utilities

# Data fetching (React/Vite)
npm install @tanstack/react-query

# State (if needed)
npm install zustand

# AI (optional)
npm install @anthropic-ai/sdk
```

## Starter Templates

```bash
# Next.js full-stack starter
npx create-next-app@latest my-app --typescript --tailwind --eslint --app --src-dir

# Vite + React starter
npm create vite@latest my-app -- --template react-ts

# NestJS API starter
npm install -g @nestjs/cli
nest new my-api
```
