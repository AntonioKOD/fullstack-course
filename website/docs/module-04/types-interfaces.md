---
sidebar_position: 3
title: Types & Interfaces
---

# Types & Interfaces

## Basic Type Annotations

```ts
// Primitives
const name: string = 'Alice';
const age: number = 28;
const isActive: boolean = true;
const nothing: null = null;
const missing: undefined = undefined;

// Arrays
const scores: number[] = [85, 92, 78];
const names: string[] = ['Alice', 'Bob'];
const mixed: (string | number)[] = ['Alice', 42];

// Tuple — fixed-length array with known types at each position
const point: [number, number] = [10, 20];
const entry: [string, number] = ['price', 9.99];

// Function
const add: (a: number, b: number) => number = (a, b) => a + b;

// Type inference — TypeScript often infers the type for you
const greeting = 'Hello';  // inferred as string — no annotation needed
const count = 42;          // inferred as number
```

## interfaces

Define the shape of an object:

```ts
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';  // union type
  createdAt: Date;
  address?: {          // optional property
    city: string;
    country: string;
  };
}

// Use it
const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
  createdAt: new Date(),
};

// Extending interfaces
interface AdminUser extends User {
  permissions: string[];
  canDeleteUsers: boolean;
}
```

## type aliases

```ts
// type alias — similar to interface for objects, more flexible overall
type Point = {
  x: number;
  y: number;
};

// Union types — one of several types
type Status = 'pending' | 'active' | 'inactive' | 'deleted';
type ID = string | number;
type MaybeUser = User | null;

// Intersection types — combine multiple types
type AdminUser = User & {
  permissions: string[];
};
```

## interface vs type — When to Use Which

| | `interface` | `type` |
|--|------------|--------|
| Object shapes |  Preferred |  Works |
| Extension | `extends` | `&` intersection |
| Union types |  Cannot |  Only option |
| Primitive aliases |  Cannot |  `type ID = string` |
| Declaration merging |  Yes |  No |

:::tip
Use `interface` for object shapes that might be extended. Use `type` for unions, intersections, and primitives.
:::

## Function Types

```ts
// Parameter and return type
function greet(name: string): string {
  return `Hello, ${name}!`;
}

// Arrow function type annotation
const greet = (name: string): string => `Hello, ${name}!`;

// Optional and default parameters
function createUser(name: string, role: string = 'user', bio?: string): User {
  return { name, role, bio };
}

// Rest parameters
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}

// void — function that returns nothing
function log(message: string): void {
  console.log(message);
}

// never — function that never returns (throws or infinite loops)
function throwError(message: string): never {
  throw new Error(message);
}
```

## Union & Intersection Types

```ts
// Union — can be one OR the other
type StringOrNumber = string | number;

function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();  // TS knows it's string here
  }
  return value.toFixed(2);      // TS knows it's number here
}

// Discriminated unions — add a `type` or `kind` field to distinguish
type Shape =
  | { kind: 'circle';    radius: number }
  | { kind: 'rectangle'; width: number; height: number }
  | { kind: 'triangle';  base: number; height: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case 'circle':    return Math.PI * shape.radius ** 2;
    case 'rectangle': return shape.width * shape.height;
    case 'triangle':  return 0.5 * shape.base * shape.height;
  }
}
```

## Enums

```ts
// String enum — preferred (readable in logs and JSON)
enum Direction {
  Up = 'UP',
  Down = 'DOWN',
  Left = 'LEFT',
  Right = 'RIGHT',
}

const move = (dir: Direction) => console.log(dir);
move(Direction.Up); // 'UP'

// as const — lighter alternative to enum
const ROLES = {
  Admin: 'admin',
  User: 'user',
  Guest: 'guest',
} as const;

type Role = typeof ROLES[keyof typeof ROLES]; // 'admin' | 'user' | 'guest'
```

## Type Assertions and Narrowing

```ts
// Type assertion — you know better than TS
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const input = document.querySelector('#email') as HTMLInputElement;

// typeof narrowing
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.trim(); // string methods available
  }
  return value * 2; // number operations available
}

// instanceof narrowing
function handleError(error: unknown) {
  if (error instanceof Error) {
    console.error(error.message); // Error methods available
  }
}

// in narrowing
function move(animal: Dog | Fish) {
  if ('swim' in animal) {
    animal.swim(); // Fish
  } else {
    animal.run();  // Dog
  }
}
```
