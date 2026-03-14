---
sidebar_position: 4
title: Middleware
---

# Middleware

Middleware are functions that run between the request arriving and the response being sent. They can modify `req`, modify `res`, end the request, or call `next()` to pass control to the next middleware.

```
Request → middleware1 → middleware2 → route handler → Response
```

## Anatomy of a Middleware

```ts
import type { Request, Response, NextFunction } from 'express';

function myMiddleware(req: Request, res: Response, next: NextFunction) {
  // Do something with req or res
  console.log(`${req.method} ${req.path}`);

  // Pass to next middleware/route
  next();

  // OR end the request here
  // res.status(401).json({ error: 'Unauthorized' });
}

app.use(myMiddleware);        // apply to all routes
app.get('/path', myMiddleware, handler);  // apply to one route
```

## Request Logger

```ts title="src/middleware/logger.middleware.ts"
import type { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const color = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m'; // red/green
    console.log(
      `${color}${req.method}\x1b[0m ${req.path} ${res.statusCode} ${duration}ms`
    );
  });

  next();
}
```

## Authentication Middleware

```ts title="src/middleware/auth.middleware.ts"
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
    }
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'No token provided' });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Role-based authorization
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }
    if (!roles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }
    next();
  };
}
```

```ts
// Usage
router.delete('/:id', authenticate, authorize('admin'), deleteUser);
```

## Validation Middleware with Zod

Use [Zod](https://zod.dev) for request validation:

```bash
npm install zod
```

```ts title="src/middleware/validate.middleware.ts"
import type { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      res.status(422).json({
        success: false,
        error: {
          message: 'Validation failed',
          details: errors,
        },
      });
      return;
    }

    req.body = result.data; // replace with parsed/coerced data
    next();
  };
}
```

```ts title="src/schemas/user.schema.ts"
import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['admin', 'user']).default('user'),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
```

```ts title="src/routes/users.routes.ts"
import { validate } from '../middleware/validate.middleware.js';
import { createUserSchema } from '../schemas/user.schema.js';

router.post('/', validate(createUserSchema), createUser);
```

## CORS Middleware

```bash
npm install cors
npm install -D @types/cors
```

```ts title="src/app.ts"
import cors from 'cors';

app.use(cors({
  origin: ['http://localhost:5173', 'https://myapp.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,  // allow cookies
}));
```
