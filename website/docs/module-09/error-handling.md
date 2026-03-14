---
sidebar_position: 5
title: Error Handling
---

# Error Handling in Express 5

Express 5 improved async error handling significantly — you no longer need try/catch in every route handler.

## Custom Error Classes

```ts title="src/lib/errors.ts"
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}
```

## Global Error Handler

```ts title="src/middleware/error.middleware.ts"
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/errors.js';
import { env } from '../env.js';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction  // must be 4 params for Express to recognize as error handler
): void {
  // Known application error
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
    return;
  }

  // Unknown error — log it, don't expose internals
  console.error('[Unhandled Error]', err);

  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: env.isDev ? err.message : 'An unexpected error occurred',
      ...(env.isDev && { stack: err.stack }),
    },
  });
}
```

## Express 5 Async Error Handling

In Express 5, async errors are automatically caught and forwarded to the error handler — no need for try/catch:

```ts
// Express 5 — no try/catch needed
router.get('/:id', async (req, res) => {
  const user = await userService.getById(req.params.id);

  if (!user) throw new NotFoundError('User');

  res.json({ success: true, data: user });
  // If getById() throws, Express 5 catches it automatically
});

// Express 4 — needed try/catch or express-async-handler
router.get('/:id', async (req, res, next) => {
  try {
    const user = await userService.getById(req.params.id);
    if (!user) throw new NotFoundError('User');
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
});
```

## 404 Handler

```ts title="src/app.ts"
// After all routes, before error handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

app.use(errorHandler);  // last middleware
```

## Using Custom Errors in Controllers

```ts
import { NotFoundError, ConflictError } from '../lib/errors.js';

export async function createUser(req: Request, res: Response) {
  const { email } = req.body;

  const existing = await userService.findByEmail(email);
  if (existing) throw new ConflictError('Email already in use');

  const user = await userService.create(req.body);
  res.status(201).json({ success: true, data: user });
}

export async function getUserById(req: Request, res: Response) {
  const user = await userService.getById(req.params.id);
  if (!user) throw new NotFoundError('User');

  res.json({ success: true, data: user });
}
```
