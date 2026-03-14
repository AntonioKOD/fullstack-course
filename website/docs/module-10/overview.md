---
sidebar_position: 1
title: Module 10 Overview
---

# Module 10 — PostgreSQL & SQL

## Why You Need to Know SQL

Even if you use an ORM like Prisma for day-to-day work, understanding SQL makes you far more effective:

- Debug ORM-generated queries
- Write efficient complex queries an ORM can't express cleanly
- Understand indexes and performance
- Migrate data safely
- Pass technical interviews

## Learning Objectives

- Create databases and tables with correct data types
- Write SELECT, INSERT, UPDATE, DELETE queries
- Use WHERE, ORDER BY, GROUP BY, LIMIT
- Join tables with INNER JOIN, LEFT JOIN
- Use aggregate functions: COUNT, SUM, AVG, MAX, MIN
- Create indexes and understand when to use them
- Understand ACID guarantees

## Module Lessons

1. [Databases Intro](./databases-intro)
2. [SQL Fundamentals](./sql-fundamentals)
3. [Joins & Relations](./joins-relations)
4. [Indexes & Performance](./indexes-performance)

## Tools

```bash
# Install PostgreSQL (Mac)
brew install postgresql@16
brew services start postgresql@16

# Or use Docker (recommended)
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16

# Connect with psql
psql -U postgres

# GUI: TablePlus (free tier) or pgAdmin
```

## Challenge

Build an **Employee Tracker CMS** — a CLI app that manages a company's employees, roles, and departments using a real PostgreSQL database.

[View Challenge →](./challenge)
