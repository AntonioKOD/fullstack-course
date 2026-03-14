---
sidebar_position: 4
title: Supabase & PostgreSQL
---

# Supabase PostgreSQL

Supabase provides a managed PostgreSQL database with extras: a REST API, realtime subscriptions, auth, and storage. We use it as the production database for both Railway and Vercel deployments.

## Why Supabase

- Free tier: 500MB storage, 2 databases
- Full PostgreSQL 15 — all features, no restrictions
- Connection pooling with PgBouncer (important for serverless)
- Automatic backups
- Browser-based SQL editor
- Built-in database UI (like a hosted pgAdmin)

## Setup

1. Go to [supabase.com](https://supabase.com) → New Project
2. Choose region closest to your users
3. Set a strong database password
4. Wait ~1 minute for provisioning

## Connection Strings

Supabase provides two connection strings:

```
# Direct connection (use for migrations, seeding)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres

# Session mode pooler (use for most apps)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres?pgbouncer=true

# Transaction mode pooler (use for serverless/Edge)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

For a **Next.js on Vercel** app, use transaction mode pooler:

```env
# .env.production
DATABASE_URL=postgresql://...6543/postgres  # transaction pooler (serverless)
DIRECT_URL=postgresql://...5432/postgres    # direct (for Prisma migrations)
```

```prisma
// prisma/schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")  // Prisma uses this for migrations
}
```

## Running Migrations

```bash
# Run migrations against production
DATABASE_URL=postgresql://[direct-url] npx prisma migrate deploy

# In CI/CD
- name: Run migrations
  env:
    DATABASE_URL: ${{ secrets.DIRECT_DATABASE_URL }}
  run: npx prisma migrate deploy
```

## Row Level Security (RLS)

Supabase encourages RLS for security when using the Supabase client directly. With Prisma + a backend API, you control access at the API layer — RLS is optional but recommended as defense in depth:

```sql
-- In Supabase SQL editor
-- Enable RLS on a table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own posts
CREATE POLICY "own_posts" ON posts
  FOR ALL USING (auth.uid()::text = user_id);
```

## Connection Limits

Supabase free tier allows 60 concurrent connections. With serverless (Vercel), you can quickly exhaust these.

**Prisma solution**: use the `$connect` pattern with connection limits:

```ts
// src/lib/prisma.ts (for Next.js / serverless)
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
    datasources: {
      db: {
        url: process.env.DATABASE_URL, // use pooler URL
      },
    },
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

## Supabase Realtime (Optional)

Subscribe to database changes without polling:

```ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Subscribe to new messages
const channel = supabase
  .channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();

// Cleanup
channel.unsubscribe();
```

## Backup and Restore

Supabase free tier: daily automated backups (7-day retention).

```bash
# Manual backup
pg_dump postgresql://[connection-string] > backup.sql

# Restore
psql postgresql://[connection-string] < backup.sql
```

## Monitoring

Supabase Dashboard → Reports:
- Query performance (slow queries)
- Database size
- Connection counts
- Row counts per table
