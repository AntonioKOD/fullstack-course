---
sidebar_position: 3
title: Dependency Injection
---

# Dependency Injection

Dependency Injection (DI) is the mechanism that makes NestJS components loosely coupled and testable. Instead of creating dependencies yourself, you declare what you need and NestJS provides them.

## The Problem DI Solves

Without DI, you'd hardcode dependencies:

```ts
//  Tightly coupled — can't test without a real database
class PostsService {
  private db = new PrismaClient(); // hardcoded dependency

  async findAll() {
    return this.db.post.findMany();
  }
}
```

With DI, you declare what you need:

```ts
// ✓ Loosely coupled — inject a mock in tests
@Injectable()
class PostsService {
  constructor(private readonly prisma: PrismaService) {} // declared, not created

  async findAll() {
    return this.prisma.post.findMany();
  }
}
```

## How NestJS DI Works

1. Mark a class as injectable with `@Injectable()`
2. Declare it as a `provider` in a module
3. Request it in a constructor — NestJS creates and injects it

```ts
// 1. Injectable service
@Injectable()
export class EmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    // email logic
  }
}

// 2. Register in module
@Module({
  providers: [EmailService, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}

// 3. Inject where needed
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly email: EmailService, // auto-injected
  ) {}

  async register(data: RegisterDto) {
    const user = await this.prisma.user.create({ data });
    await this.email.send(user.email, 'Welcome!', '...');
    return user;
  }
}
```

## Provider Types

### Value Provider

Inject a constant value:

```ts
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: { maxUploadSize: 10 * 1024 * 1024 },
    },
  ],
})
```

Inject it with `@Inject`:

```ts
constructor(@Inject('APP_CONFIG') private config: AppConfig) {}
```

### Factory Provider

Compute the value at startup:

```ts
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: () => {
        return new Redis({ host: process.env.REDIS_HOST });
      },
    },
  ],
})
```

### Class Provider (default)

```ts
// These are equivalent
providers: [PostsService]
providers: [{ provide: PostsService, useClass: PostsService }]

// Swap implementation (great for testing/mocking)
providers: [{ provide: PostsService, useClass: MockPostsService }]
```

## Scopes

By default, providers are singletons (one instance per app). You can change this:

```ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class RequestLogger {
  // New instance created per HTTP request
  // Has access to the current request context
}
```

| Scope | Behavior |
|-------|----------|
| `DEFAULT` | Singleton — shared across entire app |
| `REQUEST` | New instance per HTTP request |
| `TRANSIENT` | New instance every time it's injected |

For most use cases, `DEFAULT` (singleton) is correct and most performant.

## Testing with DI

DI makes unit testing straightforward — swap real implementations for mocks:

```ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostsService } from './posts.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PostsService', () => {
  let service: PostsService;

  const mockPrisma = {
    post: {
      findMany: vi.fn().mockResolvedValue([]),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: PrismaService, useValue: mockPrisma }, // inject mock
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  it('should return an array of posts', async () => {
    const result = await service.findAll({ page: 1, limit: 10 });
    expect(result.data).toEqual([]);
    expect(mockPrisma.post.findMany).toHaveBeenCalled();
  });
});
```

## Circular Dependencies

Sometimes Module A needs Module B and Module B needs Module A. Use `forwardRef` to resolve:

```ts
// auth.module.ts
@Module({
  imports: [forwardRef(() => UsersModule)],
})

// users.module.ts
@Module({
  imports: [forwardRef(() => AuthModule)],
})
```

> Circular dependencies are usually a sign of a design problem. Try to break the cycle by extracting a shared service into a third module.

## Global Providers

Providers registered globally don't need to be imported in every module:

```ts
@Module({
  providers: [AppConfigService],
  exports: [AppConfigService],
})
@Global() // Available everywhere without importing
export class ConfigModule {}
```
