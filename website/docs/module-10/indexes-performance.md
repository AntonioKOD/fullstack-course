---
sidebar_position: 1
title: Indexes & Performance
---

# Indexes & Performance

## What Is an Index?

An index is a data structure that speeds up queries on a column. Without an index, the database scans every row (full table scan). With an index, it can jump directly to matching rows.

```sql
-- Create index on frequently queried column
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_posts_author_id ON posts(author_id);

-- Composite index (when you filter by both columns together)
CREATE INDEX idx_posts_author_published ON posts(author_id, published);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- Check if query uses index
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'alice@example.com';
```

**Rules:**
- Index columns used in WHERE, JOIN ON, ORDER BY
- Don't over-index — indexes slow down INSERT/UPDATE/DELETE
- Every foreign key should have an index
