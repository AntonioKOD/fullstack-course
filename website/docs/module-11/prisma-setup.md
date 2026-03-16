---
sidebar_position: 2
title: Prisma Setup
---

# Prisma Setup

This module uses **Prisma ORM v7**, which uses a generated client, a config file for the CLI, and a driver adapter for the database.

## Installation

```bash
npm install prisma @prisma/adapter-pg pg dotenv
npm install -D prisma
npx prisma init
```

This creates `prisma/schema.prisma` and optionally `.env`. You also need a **Prisma config file** at the project root for v7.

## Configure the connection

**1. Environment variable** (e.g. `.env`):

```bash title=".env"
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
```

**2. Prisma config** — required in v7 so the CLI knows where the schema and database URL are:

```ts title="prisma.config.ts"
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
```

Place `prisma.config.ts` next to `package.json`. Install `dotenv` so env vars are loaded when running Prisma CLI commands.

## schema.prisma

In v7 the generator uses `prisma-client` and a required `output` path. The database URL is no longer in the schema (it lives in `prisma.config.ts`):

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  profile   Profile?

  @@map("users")
}

enum Role {
  ADMIN
  USER
  GUEST
}

model Profile {
  id     String  @id @default(cuid())
  bio    String?
  avatar String?
  userId String  @unique

  user   User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("profiles")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User    @relation(fields: [authorId], references: [id], onDelete: Cascade)
  tags      Tag[]   @relation("PostToTag")

  @@map("posts")
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[] @relation("PostToTag")

  @@map("tags")
}
```

## Migrations

```bash
# Create and apply migration (development)
npx prisma migrate dev --name init

# Apply migrations without creating new ones (CI/production)
npx prisma migrate deploy

# Reset database (DELETES ALL DATA — dev only)
npx prisma migrate reset

# Check status
npx prisma migrate status
```

## Generate client

In v7 the client is generated to the path you set in `output`. Run after any schema change:

```bash
npx prisma generate
```

Add `src/generated` (or your chosen output path) to `.gitignore` if you prefer not to commit generated code; otherwise ensure you run `prisma generate` after clone/install.

## Prisma Studio

Visual database browser:

```bash
npx prisma studio
# Opens at http://localhost:5555
```

## Prisma Client setup (v7 driver adapter)

In v7 you instantiate the client with a **driver adapter** instead of passing a URL. For PostgreSQL use `@prisma/adapter-pg`:

```ts title="src/lib/prisma.ts"
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error('DATABASE_URL is not set');

const adapter = new PrismaPg({ connectionString });
export const prisma = new PrismaClient({ adapter });
```

Use a singleton in long-running apps (e.g. Express) to avoid opening many connections:

```ts
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

```ts
// Usage in any file
import { prisma } from '../lib/prisma.js';

const users = await prisma.user.findMany();
```

## Seeding

In v7, `prisma migrate dev` no longer runs the seed automatically. Seed explicitly:

```bash
npx prisma db seed
```

The seed script path is configured in `prisma.config.ts` under `migrations.seed`.
