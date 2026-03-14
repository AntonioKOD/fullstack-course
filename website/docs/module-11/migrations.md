---
sidebar_position: 6
title: Migrations
---
# Prisma Migrations

## Development Workflow

```bash
# Edit schema.prisma, then:
npx prisma migrate dev --name add_user_bio

# This:
# 1. Creates a migration SQL file in prisma/migrations/
# 2. Applies it to your dev database
# 3. Regenerates Prisma Client
```

## Migrations Folder

```
prisma/migrations/
 20240101000000_init/
    migration.sql
 20240115000000_add_user_bio/
    migration.sql
 migration_lock.toml
```

Never edit migration files — create a new migration instead.

## Production

```bash
# Apply pending migrations (no new migration created)
npx prisma migrate deploy

# Check status
npx prisma migrate status
```

## Seeding

```ts title="prisma/seed.ts"
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@example.com', password: 'hashed', role: 'ADMIN' },
  });
}

main().finally(() => prisma.$disconnect());
```

```json title="package.json"
{ "prisma": { "seed": "tsx prisma/seed.ts" } }
```

```bash
npx prisma db seed
```
