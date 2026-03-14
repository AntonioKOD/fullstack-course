---
sidebar_position: 1
title: Module 14 Overview
---

# Module 14 — MongoDB & Mongoose

## SQL vs NoSQL — When to Use Each

| | PostgreSQL (SQL) | MongoDB (NoSQL) |
|--|-----------------|----------------|
| Data shape | Structured, fixed schema | Flexible, schema-optional |
| Relations | Strong (foreign keys) | Weak (manual references) |
| Queries | SQL — powerful and standardized | MongoDB query language |
| Scaling | Vertical (bigger server) | Horizontal (more servers) |
| Best for | Financial data, relations | Documents, flexible content |
| Use case | E-commerce, banking | CMS, analytics, real-time |

**Use both.** Most real applications use SQL for core data and MongoDB for flexible/high-volume content.

## Learning Objectives

- Create MongoDB databases and collections
- Perform CRUD operations with the MongoDB shell and Mongoose
- Define schemas with validation in Mongoose
- Work with subdocuments and references
- Use aggregation pipelines for complex queries

## Module Lessons

1. [MongoDB Intro](./mongodb-intro)
2. [Mongoose Schemas](./mongoose-schemas)
3. [CRUD & Aggregations](./crud-aggregations)
4. [When to Use NoSQL](./when-to-use-nosql)

## Challenge

Build a **Social Network API** — users, thoughts (posts), reactions (comments), and friends.

[View Challenge →](./challenge)
