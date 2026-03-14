---
sidebar_position: 2
title: NestJS Architecture
---

# NestJS Architecture

NestJS brings an opinionated, Angular-inspired architecture to Node.js backends. Understanding the pieces helps you structure large applications that teams can navigate and extend.

## The Big Picture

```
Request → Middleware → Guards → Interceptors → Pipes → Controller → Service → Repository
                                                                              ↓
Response ← Interceptors ← Controller ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← Service
```

Each piece has a single responsibility:

| Layer | Responsibility | Decorator |
|-------|---------------|-----------|
| **Module** | Groups related components | `@Module()` |
| **Controller** | Route handling, HTTP layer | `@Controller()` |
| **Service** | Business logic | `@Injectable()` |
| **Repository** | Data access | `@Injectable()` |
| **Guard** | Authorization | `@UseGuards()` |
| **Pipe** | Validation/transformation | `@UsePipes()` |
| **Interceptor** | Cross-cutting concerns | `@UseInterceptors()` |
| **Middleware** | Request preprocessing | `configure()` |

## Modules

Modules are the fundamental organizational unit. Every NestJS app has at least one: `AppModule`.

```ts
// src/posts/posts.module.ts
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],     // other modules this depends on
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],     // what other modules can use
})
export class PostsModule {}
```

```ts
// src/app.module.ts
import { Module } from '@nestjs/common';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PostsModule, UsersModule, AuthModule],
})
export class AppModule {}
```

## Feature Module Structure

NestJS convention — one directory per feature:

```
src/
 posts/
    dto/
       create-post.dto.ts
       update-post.dto.ts
    posts.controller.ts
    posts.service.ts
    posts.module.ts
    posts.controller.spec.ts
 users/
    ...
 auth/
    ...
 prisma/
    prisma.service.ts
    prisma.module.ts
 main.ts
```

## Controllers

Controllers handle HTTP. Keep them thin — no business logic.

```ts
// src/posts/posts.controller.ts
import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, Query, UseGuards, HttpCode, HttpStatus
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  findAll(@Query('page') page = '1', @Query('limit') limit = '10') {
    return this.postsService.findAll({ page: +page, limit: +limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreatePostDto, @CurrentUser() userId: string) {
    return this.postsService.create(dto, userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
```

## Services

Services contain business logic and interact with the database.

```ts
// src/posts/posts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({ page, limit }: { page: number; limit: number }) {
    const [posts, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      }),
      this.prisma.post.count(),
    ]);

    return {
      data: posts,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } },
    });
    if (!post) throw new NotFoundException(`Post ${id} not found`);
    return post;
  }

  async create(dto: CreatePostDto, authorId: string) {
    return this.prisma.post.create({
      data: { ...dto, authorId },
    });
  }

  async update(id: string, dto: UpdatePostDto) {
    await this.findOne(id); // throws 404 if not found
    return this.prisma.post.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.post.delete({ where: { id } });
  }
}
```

## DTOs with Validation

```ts
// src/posts/dto/create-post.dto.ts
import { IsString, IsNotEmpty, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsBoolean()
  @IsOptional()
  published?: boolean;
}
```

Enable global validation pipe in `main.ts`:

```ts
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
```

## Exception Filters

NestJS has built-in HTTP exceptions:

```ts
import {
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

throw new NotFoundException('User not found');
throw new ConflictException('Email already in use');
throw new ForbiddenException('You cannot edit this post');
```

These automatically return the correct HTTP status codes with structured error bodies.
