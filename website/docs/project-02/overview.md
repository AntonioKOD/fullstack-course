---
sidebar_position: 1
title: Project 02 Overview
---

# Project 02 — Full-Stack REST Application

## What This Is

Your second major project is a **full-stack collaborative application** with a real database, authenticated API, and a React frontend. This is where everything from Modules 7–16 comes together.

## Starter files

Download the backend and frontend starters and build from there:

- **[Download Project 02 API starter (ZIP)](/downloads/project-02-api.zip)** — Express 5 + TypeScript + Prisma + Zod
- **[Download Project 02 frontend starter (ZIP)](/downloads/project-02-frontend.zip)** — React + Vite + TypeScript + Tailwind + React Router + TanStack Query + Zustand

After downloading, unzip each, run `npm install` in both, set up `.env` from `.env.example`, and run the API and frontend (see each README). Connect the frontend to the API using `VITE_API_URL`.

## Technical Requirements

- **Backend:** Express 5 or NestJS + TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT (register, login, protected routes)
- **Validation:** Zod or class-validator
- **Frontend:** React + TypeScript (Vite)
- **Deployment:** API on Railway, frontend on Vercel
- **Testing:** At least 5 integration tests (Vitest)

## Must-Have Features

- [ ] User registration and login
- [ ] At least 2 resource types with a relation (e.g. users → posts)
- [ ] Full CRUD on the main resource
- [ ] Protected routes (only logged-in users can create/edit/delete)
- [ ] Pagination on list endpoints

## Project Ideas

| Idea | Resources |
|------|-----------|
| **Recipe app** | User, Recipe, Ingredient |
| **Task manager** | User, Project, Task |
| **Blog platform** | User, Post, Comment |
| **Movie watchlist** | User, Movie, WatchlistEntry |
| **Fitness tracker** | User, Workout, Exercise |

[View full requirements →](./requirements)

[View rubric →](./rubric)
