---
sidebar_position: 4
title: Generics
---

# Generics

Generics let you write reusable code that works with multiple types while preserving type safety.

## The Problem Generics Solve

```ts
// Without generics — loses type info
function identity(value: any): any {
  return value;
}

const result = identity('hello');
result.toUpperCase(); // TS doesn't know it's a string 

// With generics — type is preserved
function identity<T>(value: T): T {
  return value;
}

const result = identity('hello');       // T = string
result.toUpperCase();                   //  TS knows it's a string

const num = identity(42);              // T = number
const user = identity({ name: 'Alice' }); // T = { name: string }
```

## Generic Functions

```ts
// Wrap a value in an array
function wrapInArray<T>(value: T): T[] {
  return [value];
}

wrapInArray('hello');   // string[]
wrapInArray(42);        // number[]
wrapInArray({ id: 1 }); // { id: number }[]

// Get first item of any array
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]);       // number | undefined
first(['a', 'b']);      // string | undefined

// Merge two objects
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 } as T & U;
}

const merged = merge({ name: 'Alice' }, { age: 28 });
// { name: string; age: number }
```

## Generic Constraints

```ts
// Constrain T to have specific properties
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: 'Alice', age: 28 };
getProperty(user, 'name');  // string
getProperty(user, 'age');   // number
getProperty(user, 'email'); //  Error: not a key of user

// Constrain to objects with an id
function findById<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(item => item.id === id);
}

// Constrain to array-like
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}

getLength('hello');    // 5
getLength([1, 2, 3]);  // 3
getLength({ length: 10 }); // 10
```

## Generic Interfaces and Types

```ts
// Generic interface
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  timestamp: string;
}

type UserResponse   = ApiResponse<User>;
type PostsResponse  = ApiResponse<Post[]>;
type CountResponse  = ApiResponse<{ count: number }>;

// Use it
async function fetchUser(id: number): Promise<ApiResponse<User>> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

// Generic pair
interface KeyValue<K, V> {
  key: K;
  value: V;
}

// Generic result (avoids try/catch everywhere)
type Result<T, E = Error> =
  | { success: true;  data: T }
  | { success: false; error: E };

async function safeCall<T>(fn: () => Promise<T>): Promise<Result<T>> {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}

// Usage
const result = await safeCall(() => fetchUser(1));
if (result.success) {
  console.log(result.data.name); // User
} else {
  console.error(result.error.message);
}
```

## Generic Classes

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items.at(-1);
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
numStack.pop(); // 2

const strStack = new Stack<string>();
strStack.push('hello');
```

## Real-World Pattern: Generic Repository

```ts
interface Repository<T extends { id: string }> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    return db.user.findUnique({ where: { id } });
  }
  // ... etc
}
```
