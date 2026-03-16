---
sidebar_position: 1
title: Capstone Overview
---

# Capstone Project

## What This Is

Your capstone is an **independent, production-grade full-stack application** of your own design. This is the project you'll demo in job interviews and feature at the top of your portfolio.

You can start from scratch or use the [Project 02 starters](/project-02/overview#starter-files) (API + frontend) as a base and extend them for your capstone.

## What Makes a Great Capstone

The best capstone projects:

1. **Solve a real problem** — something you or someone you know would actually use
2. **Use the full stack** — database, API, frontend, auth, deployment
3. **Have a polished UI** — looks like something a company would ship
4. **Have real data** — not lorem ipsum placeholder content
5. **Are on a custom domain** — shows initiative (domains cost ~$12/year)

## Technical Requirements

### Must Have

- [ ] TypeScript throughout (frontend and backend)
- [ ] Authentication (email/password or OAuth)
- [ ] PostgreSQL database with Prisma ORM
- [ ] REST or tRPC or GraphQL API
- [ ] React (Vite or Next.js App Router)
- [ ] Tailwind CSS
- [ ] Deployed and publicly accessible
- [ ] Custom domain (optional but strongly recommended)
- [ ] README with: description, screenshot, live URL, features, tech stack

### Pick One Architecture

**Option A — Monorepo (Next.js)**
- Full-stack Next.js with App Router
- Server Components + Server Actions
- Prisma + PostgreSQL (Supabase)
- NextAuth for authentication
- Deploy to Vercel

**Option B — Separate API + Frontend**
- NestJS or Express API → Deploy to Railway
- React + Vite frontend → Deploy to Vercel
- Shared TypeScript types via tRPC or manual interfaces
- JWT authentication

### Pick One AI Feature (optional but impressive)

- AI-powered content generation
- Smart search with embeddings
- Automated summaries or analysis
- Conversational interface

## Project Ideas

| Idea | Description |
|------|-------------|
| **Job Tracker** | Track applications, interviews, contacts — with AI email drafting |
| **Recipe Manager** | Save recipes, scale servings, plan meals, generate shopping lists |
| **Habit Tracker** | Daily check-ins, streaks, visualizations, AI coaching |
| **Expense Tracker** | Log spending, categorize with AI, visualize trends |
| **Dev Portfolio CMS** | Manage portfolio projects through an admin UI |
| **Flashcard App** | Spaced repetition learning with AI-generated cards from notes |
| **Event Planner** | Create events, invite attendees, RSVP system |
| **Rental Listings** | Post/browse rental properties with image upload |

## Timeline

| Week | Milestone |
|------|-----------|
| 1 | Approved proposal, wireframes, DB schema, repo created |
| 2 | Core models + API routes working, auth implemented |
| 3 | Frontend connected to API, main flows working end-to-end |
| 4 | Polish, error handling, deployment, custom domain |
| 5 | Final presentation rehearsal |
| 6 | **Demo Day** |

[View full requirements →](./requirements)

[View rubric →](./rubric)
