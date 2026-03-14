---
sidebar_position: 5
title: Prisma Integration
---

# Prisma Integration with NestJS

NestJS and Prisma work extremely well together. Prisma provides type-safe database access; NestJS wraps it in a singleton service with lifecycle management.

## Setting Up PrismaService

```bash
npm install @prisma/client prisma
npx prisma init
```

```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient
  implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

```ts
// src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // available in every module without importing
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

```ts
// src/app.module.ts
@Module({
  imports: [PrismaModule, PostsModule, UsersModule, AuthModule],
})
export class AppModule {}
```

## Full Schema Example

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  tags      Tag[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Tag {
  id    String @id @default(cuid())
  name  String @unique
  posts Post[]
}

enum Role {
  USER
  AUTHOR
  ADMIN
}
```

## Repository Pattern in NestJS

For complex queries, extract database logic into a repository class:

```ts
// src/posts/posts.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Post } from '@prisma/client';

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPaginated(params: {
    page: number;
    limit: number;
    where?: Prisma.PostWhereInput;
  }): Promise<{ data: Post[]; total: number }> {
    const { page, limit, where } = params;
    const [data, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { author: { select: { name: true } }, tags: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.post.count({ where }),
    ]);
    return { data, total };
  }

  async findBySlug(slug: string): Promise<Post | null> {
    return this.prisma.post.findFirst({ where: { title: { contains: slug } } });
  }

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({ data });
  }
}
```

## Transactions in Services

```ts
@Injectable()
export class PostsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly postsRepo: PostsRepository,
  ) {}

  async publishWithNotification(postId: string, authorId: string) {
    return this.prisma.$transaction(async (tx) => {
      const post = await tx.post.update({
        where: { id: postId, authorId },
        data: { published: true },
      });

      await tx.notification.create({
        data: {
          type: 'POST_PUBLISHED',
          userId: authorId,
          payload: { postId: post.id, title: post.title },
        },
      });

      return post;
    });
  }
}
```

## Handling Prisma Errors

```ts
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ConflictException, NotFoundException } from '@nestjs/common';

function handlePrismaError(error: unknown): never {
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': // Unique constraint violation
        throw new ConflictException('Record already exists');
      case 'P2025': // Record not found
        throw new NotFoundException('Record not found');
      default:
        throw error;
    }
  }
  throw error;
}

// In service methods:
async create(dto: CreatePostDto, authorId: string) {
  try {
    return await this.prisma.post.create({ data: { ...dto, authorId } });
  } catch (error) {
    handlePrismaError(error);
  }
}
```

## Seeding in NestJS

```ts
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await hash('Admin123!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Seeded:', admin.email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

```json
// package.json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
npx prisma db seed
```
