---
sidebar_position: 3
title: SQL Fundamentals
---

# SQL Fundamentals

## Creating Tables

```sql
-- Drop if exists (for development resets)
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS posts CASCADE;

-- Create users table
CREATE TABLE users (
  id          SERIAL PRIMARY KEY,        -- auto-incrementing integer
  -- or: id UUID DEFAULT gen_random_uuid() PRIMARY KEY,  -- prefer UUIDs in new projects
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(255)  NOT NULL UNIQUE,
  password    VARCHAR(255)  NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'user',
  is_active   BOOLEAN       NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Create posts table with foreign key
CREATE TABLE posts (
  id          UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(300)  NOT NULL,
  content     TEXT          NOT NULL,
  author_id   INTEGER       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  published   BOOLEAN       NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
```

## Data Types

| Type | Use For |
|------|---------|
| `SERIAL` / `BIGSERIAL` | Auto-increment IDs (legacy) |
| `UUID` | Modern unique IDs |
| `VARCHAR(n)` | Short strings with max length |
| `TEXT` | Unlimited length strings |
| `INTEGER` / `BIGINT` | Whole numbers |
| `DECIMAL(p,s)` / `NUMERIC` | Exact decimals (money) |
| `REAL` / `DOUBLE PRECISION` | Approximate decimals |
| `BOOLEAN` | True/false |
| `TIMESTAMPTZ` | Timestamp with timezone (always use this) |
| `DATE` | Date only |
| `JSONB` | JSON with indexing support |

## INSERT

```sql
-- Single row
INSERT INTO users (name, email, password)
VALUES ('Alice', 'alice@example.com', 'hashed_password');

-- Multiple rows
INSERT INTO users (name, email, password, role) VALUES
  ('Bob',   'bob@example.com',   'hash1', 'user'),
  ('Carol', 'carol@example.com', 'hash2', 'admin');

-- Return the created row
INSERT INTO users (name, email, password)
VALUES ('Dave', 'dave@example.com', 'hash')
RETURNING *;
```

## SELECT

```sql
-- All columns
SELECT * FROM users;

-- Specific columns
SELECT id, name, email FROM users;

-- Alias columns
SELECT id, name AS full_name, email AS email_address FROM users;

-- Filter
SELECT * FROM users WHERE role = 'admin';
SELECT * FROM users WHERE is_active = TRUE AND role = 'user';
SELECT * FROM users WHERE name ILIKE '%alice%';  -- case-insensitive LIKE

-- Sort
SELECT * FROM users ORDER BY created_at DESC;
SELECT * FROM users ORDER BY name ASC, created_at DESC;

-- Limit & offset (pagination)
SELECT * FROM users ORDER BY created_at DESC LIMIT 20 OFFSET 40; -- page 3

-- Count
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM users WHERE is_active = TRUE;

-- Aggregate
SELECT
  role,
  COUNT(*) AS count,
  MAX(created_at) AS latest
FROM users
GROUP BY role
ORDER BY count DESC;
```

## UPDATE

```sql
-- Update specific row
UPDATE users
SET name = 'Alice Smith', updated_at = NOW()
WHERE id = 1
RETURNING *;

-- Update multiple rows
UPDATE users
SET is_active = FALSE
WHERE last_login < NOW() - INTERVAL '1 year';
```

## DELETE

```sql
-- Delete specific row
DELETE FROM users WHERE id = 1 RETURNING *;

-- Delete with condition
DELETE FROM posts WHERE published = FALSE AND created_at < NOW() - INTERVAL '30 days';
```

## Parameterized Queries (CRITICAL for Security)

**Never concatenate user input into SQL strings.** This causes SQL injection.

```ts
//  SQL injection vulnerability
const query = `SELECT * FROM users WHERE email = '${email}'`;
// An attacker can send: alice' OR '1'='1

//  Parameterized query — safe
const { rows } = await pool.query(
  'SELECT * FROM users WHERE email = $1',
  [email]
);

//  Multiple parameters
const { rows } = await pool.query(
  'INSERT INTO posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
  [title, content, authorId]
);
```

## Using pg (node-postgres)

```bash
npm install pg
npm install -D @types/pg
```

```ts title="src/db.ts"
import pg from 'pg';
import { env } from './env.js';

const { Pool } = pg;

export const pool = new Pool({ connectionString: env.DATABASE_URL });

// Helper for typed queries
export async function query<T>(
  sql: string,
  params?: unknown[]
): Promise<T[]> {
  const { rows } = await pool.query<T>(sql, params);
  return rows;
}
```

```ts
const users = await query<User>('SELECT * FROM users WHERE role = $1', ['admin']);
```
