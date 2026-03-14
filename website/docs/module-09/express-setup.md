---
sidebar_position: 2
title: Express Setup
---

# Express 5 Setup

## Installation

```bash
mkdir my-api && cd my-api
npm init -y
npm install express
npm install -D typescript @types/node @types/express tsx
npx tsc --init
```

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Minimal Server

```ts title="src/index.ts"
import express from 'express';
import { env } from './env.js';

const app = express();

// Middleware
app.use(express.json());                    // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse form data

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});

export default app;
```

## Recommended Project Structure

```
src/
 index.ts              # entry point
 env.ts                # env variable validation
 app.ts                # express app (separate from server start for testing)
 routes/
    index.ts          # mount all routers
    users.routes.ts
    posts.routes.ts
 controllers/
    users.controller.ts
    posts.controller.ts
 middleware/
    auth.middleware.ts
    validate.middleware.ts
    error.middleware.ts
 types/
    index.ts
 utils/
     responses.ts
```

## app.ts vs index.ts

Separate the Express app from the server start — this makes testing easier:

```ts title="src/app.ts"
import express from 'express';
import { usersRouter } from './routes/users.routes.js';
import { postsRouter } from './routes/posts.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/logger.middleware.js';

export const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api/users', usersRouter);
app.use('/api/posts', postsRouter);

app.use(errorHandler);  // must be last
```

```ts title="src/index.ts"
import { app } from './app.js';
import { env } from './env.js';

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
```

## Response Helpers

Consistent response shape across all endpoints:

```ts title="src/utils/responses.ts"
import type { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200
): void {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(
  res: Response,
  message: string,
  statusCode = 500,
  details?: unknown
): void {
  res.status(statusCode).json({
    success: false,
    error: { message, details },
    timestamp: new Date().toISOString(),
  });
}
```
