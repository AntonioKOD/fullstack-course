---
sidebar_position: 1
title: Module 09 Overview
---

# Module 09 — Express 5 + REST APIs

## What Is Express?

Express is a minimal, fast web framework for Node.js. It handles HTTP routing, middleware, and request/response parsing. In 2025 we use **Express 5** (the major release that modernized async error handling) with TypeScript.

## What You'll Build

A fully featured REST API with:
- Typed routes and middleware
- Request validation
- Structured error responses
- JSON file persistence (before we add a real database in Module 10)

## Learning Objectives

- Set up an Express 5 + TypeScript server
- Define GET, POST, PUT, PATCH, DELETE routes
- Write reusable middleware (logging, auth, validation)
- Handle errors consistently
- Follow REST conventions

## Module Lessons

1. [Express Setup](./express-setup)
2. [Routing](./routing)
3. [Middleware](./middleware)
4. [Error Handling](./error-handling)
5. [REST Conventions](./rest-conventions)

## Challenge

Build a **Note Taker API**:
- `GET /api/notes` — return all notes
- `POST /api/notes` — create a note
- `DELETE /api/notes/:id` — delete a note
- Persists to a JSON file
- Deployed to Railway

[View Challenge →](./challenge)
