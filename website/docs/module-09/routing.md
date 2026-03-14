---
sidebar_position: 3
title: Routing
---

# Routing in Express

## Router

Use `Router` to group related routes into their own file:

```ts title="src/routes/users.routes.ts"
import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

export const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/', createUser);
usersRouter.put('/:id', authenticate, updateUser);
usersRouter.delete('/:id', authenticate, deleteUser);
```

```ts title="src/routes/index.ts"
import { Router } from 'express';
import { usersRouter } from './users.routes.js';
import { postsRouter } from './posts.routes.js';

export const apiRouter = Router();

apiRouter.use('/users', usersRouter);
apiRouter.use('/posts', postsRouter);
```

```ts title="src/app.ts"
app.use('/api', apiRouter);
// Results in: /api/users, /api/posts
```

## Controllers

Controllers handle the request/response logic. Keep them thin — business logic belongs in a service layer:

```ts title="src/controllers/users.controller.ts"
import type { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/users.service.js';
import { sendSuccess } from '../utils/responses.js';

const userService = new UserService();

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const { page = '1', limit = '20', search } = req.query;

    const result = await userService.getUsers({
      page: parseInt(page as string, 10),
      limit: parseInt(limit as string, 10),
      search: search as string | undefined,
    });

    sendSuccess(res, result);
  } catch (err) {
    next(err);  // pass to error handler
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const user = await userService.getById(id);

    if (!user) {
      res.status(404).json({ success: false, error: { message: 'User not found' } });
      return;
    }

    sendSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await userService.create(req.body);
    sendSuccess(res, user, 201);
  } catch (err) {
    next(err);
  }
}
```

## Route Parameters

```ts
// Path parameter
app.get('/users/:id', (req, res) => {
  const { id } = req.params;  // string
});

// Multiple parameters
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
});

// Optional parameter
app.get('/users/:id?', (req, res) => {
  const id = req.params.id; // string | undefined
});
```

## Query Parameters

```ts
app.get('/products', (req, res) => {
  const {
    page = '1',
    limit = '20',
    sort = 'createdAt',
    order = 'desc',
    category,
    q,
  } = req.query;

  // req.query values are always strings or string[]
  // Parse them as needed
  const pageNum = parseInt(page as string, 10);
  const limitNum = Math.min(parseInt(limit as string, 10), 100); // cap at 100
});
```

## Request Body

```ts
app.post('/users', (req, res) => {
  const body = req.body; // parsed by express.json() middleware
  // { name: 'Alice', email: 'alice@example.com' }
});
```

## Typed Request Bodies

```ts
import type { Request, Response } from 'express';

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

export async function createUser(
  req: Request<{}, {}, CreateUserBody>,
  res: Response
) {
  const { name, email, password } = req.body;
  // TypeScript knows the types of name, email, password
}
```
