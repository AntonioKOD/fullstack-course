---
sidebar_position: 2
title: Requirements
---

# Project 2 — Requirements

## Project Overview

Project 2 is a collaborative full-stack application built with a **React frontend**, **Express or NestJS backend**, and **PostgreSQL database via Prisma**. Teams of 2-3 students.

## Technical Requirements

### Backend (must have ALL)

- [ ] **Node.js API** — Express 5 with TypeScript or NestJS
- [ ] **RESTful routes** — proper HTTP methods and status codes
- [ ] **PostgreSQL with Prisma** — at least 3 models with relationships
- [ ] **Authentication** — JWT with protected routes
- [ ] **Zod validation** — all POST/PATCH inputs validated
- [ ] **Error handling** — structured error responses, no unhandled rejections
- [ ] **Seed script** — `npm run seed` populates the database

### Frontend (must have ALL)

- [ ] **React + Vite + TypeScript** — no JavaScript files
- [ ] **React Router** — at least 4 routes including a protected route
- [ ] **TanStack Query** — all server data fetched via useQuery/useMutation
- [ ] **Zustand** — for global UI state (auth, cart, preferences, etc.)
- [ ] **Tailwind CSS** — responsive design, mobile-first
- [ ] **Error and loading states** — every async operation has feedback

### Full Stack

- [ ] **Deployed** — live URL for both frontend and backend
- [ ] **Environment variables** — `.env.example` with all required vars
- [ ] **README** — setup instructions, live URL, screenshots

## Application Ideas

Teams must choose one of the following (or propose their own):

### Option A: Marketplace
Users can list items for sale, browse listings, and contact sellers.
- Models: `User`, `Listing`, `Category`, `Message`
- Features: search with filters, user profiles, saved listings

### Option B: Event Platform
Users can create events, RSVP, and leave reviews.
- Models: `User`, `Event`, `RSVP`, `Review`
- Features: event discovery, calendar view, attendee list

### Option C: Learning Platform
Instructors create courses with lessons; students enroll and track progress.
- Models: `User`, `Course`, `Lesson`, `Enrollment`, `Progress`
- Features: enrollment, lesson completion tracking, course search

### Option D: Fitness Tracker
Users log workouts, set goals, and track progress over time.
- Models: `User`, `Workout`, `Exercise`, `Goal`, `Progress`
- Features: workout templates, progress charts, goal tracking

## Minimum Viable Product

By Week 1 demo, your app must have:
1. User registration and login working
2. At least one authenticated CRUD resource (e.g., create/list/delete listings)
3. Database with seed data
4. Frontend connecting to backend

## Grading (out of 150 points)

### Technical (100 points)

| Category | Criteria | Points |
|----------|----------|--------|
| **Backend** | Routes, models, auth, validation | 35 |
| **Frontend** | Components, routing, state management | 35 |
| **Database** | Schema design, relations, seed data | 15 |
| **Deployment** | Both services live with env vars | 15 |

### Process (50 points)

| Category | Criteria | Points |
|----------|----------|--------|
| **Git workflow** | Feature branches, meaningful commits, PRs | 15 |
| **Collaboration** | Even contribution (check GitHub insights) | 15 |
| **Presentation** | 10-min demo, explains technical decisions | 20 |

## Timeline

| Week | Deliverable |
|------|-------------|
| Week 1 | Project proposal approved, repo created, ERD designed |
| Week 2 | Backend API functional (all routes work with Postman) |
| Week 3 | Frontend connected to backend, auth working |
| Week 4 | Deployed, polished, final demo |

## Proposal Template

Submit a brief proposal with:

1. **App name and description** (2-3 sentences)
2. **Problem it solves** — who is the user, what pain point?
3. **Entity Relationship Diagram** — drawn in dbdiagram.io or similar
4. **API routes** — list all planned endpoints
5. **Team members** — GitHub usernames and role division
6. **Stretch goals** — features you'll add if time allows

## Stretch Goals (bonus)

- [ ] Real-time features with WebSockets
- [ ] Image uploads (Cloudflare R2 or Supabase Storage)
- [ ] Email notifications (Resend or Nodemailer)
- [ ] Full-text search with Postgres `tsvector`
- [ ] AI feature using the Claude API
- [ ] Unit tests with Vitest (≥ 70% coverage on services)
- [ ] CI/CD pipeline with GitHub Actions
