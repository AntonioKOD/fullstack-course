---
sidebar_position: 5
title: Utility Types
---

# Utility Types

TypeScript ships with built-in utility types that transform existing types. These save enormous amounts of repetitive type code.

## Partial\<T\> and Required\<T\>

```ts
interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
}

// Partial — all properties become optional
type UpdateUserInput = Partial<User>;
// { id?: string; name?: string; email?: string; bio?: string; avatar?: string }

async function updateUser(id: string, data: Partial<User>): Promise<User> {
  return db.user.update({ where: { id }, data });
}

updateUser('123', { name: 'New Name' }); //  only update name

// Required — all properties become required
type StrictConfig = Required<Config>;
```

## Pick\<T, K\> and Omit\<T, K\>

```ts
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Pick — select only the fields you need
type UserProfile = Pick<User, 'id' | 'name' | 'email'>;
// { id: string; name: string; email: string }

// Omit — exclude fields
type PublicUser = Omit<User, 'password'>;
// { id: string; name: string; email: string; createdAt: Date }

type CreateUserInput = Omit<User, 'id' | 'createdAt'>;
// { name: string; email: string; password: string }
```

## Record\<K, V\>

```ts
// Map keys to values
type UserMap = Record<string, User>;
const users: UserMap = {
  'abc123': { id: 'abc123', name: 'Alice', ... },
};

// Enum keys
type RolePermissions = Record<'admin' | 'user' | 'guest', string[]>;
const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read'],
};

// Config object
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type RouteHandlers = Record<HttpMethod, (req: Request) => Response>;
```

## Readonly\<T\>

```ts
interface Config {
  host: string;
  port: number;
}

const config: Readonly<Config> = { host: 'localhost', port: 3000 };
config.port = 4000; //  Error: cannot assign to readonly property

// Useful for function parameters you should not mutate
function render(state: Readonly<AppState>): string {
  // state.count++; //  Error
  return `Count: ${state.count}`;
}
```

## ReturnType\<T\> and Parameters\<T\>

```ts
function createUser(name: string, email: string) {
  return { id: crypto.randomUUID(), name, email, createdAt: new Date() };
}

// Extract the return type
type User = ReturnType<typeof createUser>;
// { id: string; name: string; email: string; createdAt: Date }

// Extract the parameter types
type CreateUserParams = Parameters<typeof createUser>;
// [name: string, email: string]

// Useful for wrapping functions
function withLogging<T extends (...args: any[]) => any>(fn: T) {
  return (...args: Parameters<T>): ReturnType<T> => {
    console.log('Calling with:', args);
    const result = fn(...args);
    console.log('Result:', result);
    return result;
  };
}
```

## Extract\<T, U\> and Exclude\<T, U\>

```ts
type Status = 'pending' | 'active' | 'suspended' | 'deleted';

// Extract — keep only types assignable to U
type ActiveStatus = Extract<Status, 'pending' | 'active'>;
// 'pending' | 'active'

// Exclude — remove types assignable to U
type VisibleStatus = Exclude<Status, 'deleted'>;
// 'pending' | 'active' | 'suspended'

// NonNullable — remove null and undefined
type NonNullString = NonNullable<string | null | undefined>;
// string
```

## Combining Utility Types in Practice

```ts
interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// What you send when creating a post
type CreatePostInput = Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>;

// What you send when updating a post (all optional, no system fields)
type UpdatePostInput = Partial<Omit<BlogPost, 'id' | 'authorId' | 'createdAt' | 'updatedAt'>>;

// What the API returns publicly (no internal fields)
type PublicPost = Omit<BlogPost, 'authorId'> & {
  author: Pick<User, 'id' | 'name' | 'avatar'>;
};

// List view — less data
type PostSummary = Pick<BlogPost, 'id' | 'title' | 'published' | 'publishedAt'>;
```
