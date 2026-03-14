---
sidebar_position: 1
title: Databases Introduction
---

# Databases Introduction

## Relational vs Non-Relational

A **relational database** (PostgreSQL, MySQL) stores data in tables with rows and columns. Tables relate to each other via foreign keys.

A **document database** (MongoDB) stores data as JSON-like documents.

## When to Use PostgreSQL

- Financial data (ACID guarantees)
- Complex relations
- Need for complex queries
- Strong consistency required

## PostgreSQL Setup

```bash
# Docker (recommended)
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:16

# Connect
psql -h localhost -U postgres

# Create database
CREATE DATABASE myapp;
```
