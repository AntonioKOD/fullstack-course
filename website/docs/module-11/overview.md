---
sidebar_position: 1
title: Module 11 Overview
---

# Module 11 — Prisma ORM

## Why Prisma Instead of Sequelize?

Sequelize was the standard ORM for Node.js for years. Prisma is the modern replacement with dramatic improvements:

| | Sequelize | Prisma |
|--|-----------|--------|
| Type safety |  Requires manual types |  Auto-generated from schema |
| Schema definition | JavaScript models | `schema.prisma` (intuitive DSL) |
| Migrations | Complex, error-prone | `prisma migrate dev` (automatic) |
| Query API | Verbose, JS-like SQL | Intuitive, chainable, fully typed |
| Prisma Studio |  No |  Visual database browser |
| Performance | Good | Good + Accelerate for edge |
| Learning curve | High | Low |

## Learning Objectives

- Define a database schema in `schema.prisma`
- Run migrations with `prisma migrate dev`
- Perform CRUD operations with the Prisma Client
- Define relations (one-to-one, one-to-many, many-to-many)
- Use Prisma Studio to inspect data

## Module Lessons

1. [Prisma Setup](./prisma-setup)
2. [Schema & Models](./schema-models)
3. [CRUD Operations](./crud-operations)
4. [Relations](./relations)
5. [Migrations](./migrations)

## Challenge

Build the **E-Commerce Backend** — a REST API for a store with Categories, Products, and Tags, fully typed with Prisma.

[View Challenge →](./challenge)
