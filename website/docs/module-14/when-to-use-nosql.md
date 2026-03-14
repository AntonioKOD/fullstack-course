---
sidebar_position: 4
title: When to Use NoSQL
---

# When to Use NoSQL

The SQL vs NoSQL decision is one of the most common architecture questions. The answer depends on your data shape, access patterns, and scaling requirements — not hype.

## The Real Question: What's Your Data Shape?

**Use SQL (Postgres/MySQL) when:**
- Data is highly relational (users → orders → products → reviews)
- You need ACID transactions across multiple tables
- Your schema is stable and well-understood upfront
- You need complex JOINs and aggregations
- Regulatory compliance requires strict data integrity

**Use MongoDB when:**
- Documents are naturally hierarchical (blog post with embedded comments)
- Schema evolves rapidly (different product types have different fields)
- You're storing event logs, analytics, or audit trails
- Read performance is critical and you can denormalize
- Your team is already writing JSON everywhere

## Document Embedding vs Referencing

This is MongoDB's equivalent of SQL normalization decisions.

### Embed when:
- The data is owned by the parent and doesn't exist independently
- You always access them together
- The embedded data is small and bounded

```ts
// Good embed: address is owned by user
{
  "_id": "...",
  "name": "Alice",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "zip": "94105"
  }
}
```

### Reference when:
- The data is shared or accessed independently
- The embedded array could grow unboundedly
- Multiple documents point to the same entity

```ts
// Good reference: post references author (user is independent)
{
  "_id": "...",
  "title": "My Post",
  "authorId": ObjectId("..."),  // reference
  "tags": ["mongodb", "tutorial"]
}
```

## SQL vs MongoDB Feature Comparison

| Concept | SQL (Postgres) | MongoDB |
|---------|---------------|---------|
| Store data | Table rows | Documents |
| Relationships | Foreign keys + JOINs | Embedding or $lookup |
| Schema | Enforced by DDL | Optional validation |
| Transactions | ACID by default | Supported (replica set) |
| Query language | SQL | MQL (JSON-like) |
| Indexes | B-tree, GiST, etc. | B-tree, text, geo |
| Scaling | Vertical + read replicas | Horizontal sharding |
| Best for | Relational data | Document data |

## The "Both" Option

Many production apps use both:

- **Postgres** for users, orders, billing (relational, transactional)
- **MongoDB** for product catalog (flexible schema, nested attributes)
- **Redis** for sessions and caches
- **Elasticsearch** for full-text search

This is called polyglot persistence — use the right tool for each job.

## When MongoDB is the Wrong Choice

1. **Complex multi-collection transactions** — MongoDB supports transactions but they're more awkward than SQL
2. **Reporting and analytics** — SQL's GROUP BY, window functions, and CTEs are more expressive
3. **Strong consistency requirements** — SQL is simpler to reason about
4. **You're just storing JSON in a column anyway** — Postgres JSONB is excellent for semi-structured data in an otherwise relational app

## Postgres JSONB — The Hybrid

Postgres can store and query JSON natively:

```sql
-- Store flexible attributes as JSON
ALTER TABLE products ADD COLUMN attributes JSONB;

-- Insert
INSERT INTO products (name, attributes)
VALUES ('Laptop', '{"ram": "16GB", "storage": "512GB SSD", "color": "silver"}');

-- Query JSON fields
SELECT name FROM products
WHERE attributes->>'color' = 'silver';

-- Index a JSON field
CREATE INDEX ON products ((attributes->>'color'));
```

This gives you relational guarantees for your structured data and JSON flexibility for your unstructured data — all in one database.

## Decision Framework

```
Is your data primarily document-shaped and
accessed as a unit?
 Yes → MongoDB is a good fit
    Do you need multi-document transactions?
        Rarely → MongoDB works well
        Frequently → Consider Postgres
 No → Is your data highly relational?
     Yes → Use Postgres
     Maybe → Use Postgres with JSONB columns
```

## This Course's Recommendation

For most full-stack web apps, **Postgres + Prisma** is the right default (Module 11). Add MongoDB when you have a genuine document storage use case — content management, catalogs, event logs. Don't use MongoDB just because it's popular.
