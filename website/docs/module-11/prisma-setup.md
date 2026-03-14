---
sidebar_position: 2
title: Prisma Setup
---

# Prisma Setup

## Installation

```bash
npm install prisma @prisma/client
npx prisma init
```

This creates:
- `prisma/schema.prisma` — your database schema
- `.env` — with `DATABASE_URL` placeholder

## Configure the Connection

```bash title=".env"
DATABASE_URL="postgresql://postgres:password@localhost:5432/myapp"
```

## schema.prisma

```prisma title="prisma/schema.prisma"
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
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

## Generate Client

The client is auto-generated from your schema. Regenerate after any schema change:

```bash
npx prisma generate
```

## Prisma Studio

Visual database browser:

```bash
npx prisma studio
# Opens at http://localhost:5555
```

## Prisma Client Setup

```ts title="src/lib/prisma.ts"
import { PrismaClient } from '@prisma/client';
import { env } from '../env.js';

// Singleton pattern — avoids multiple connections in development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: env.isDev ? ['query', 'error', 'warn'] : ['error'],
});

if (env.isDev) globalForPrisma.prisma = prisma;
```

```ts
// Usage in any file
import { prisma } from '../lib/prisma.js';

const users = await prisma.user.findMany();
```
