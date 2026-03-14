---
sidebar_position: 5
title: Recursion
---

# Recursion

Recursion is a function calling itself with a smaller input until it reaches a base case. It's the natural way to solve problems with self-similar structure: trees, graphs, divide-and-conquer.

## The Two Rules

1. **Base case** — a condition that stops the recursion
2. **Recursive case** — the function calls itself with a simpler input

```ts
// Classic: factorial
function factorial(n: number): number {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1); // recursive case
}

factorial(5); // 5 * 4 * 3 * 2 * 1 = 120
```

## How the Call Stack Works

Each recursive call adds a stack frame. For `factorial(4)`:

```
factorial(4)
  → 4 * factorial(3)
       → 3 * factorial(2)
            → 2 * factorial(1)
                 → 1  ← base case
            ← 2 * 1 = 2
       ← 3 * 2 = 6
  ← 4 * 6 = 24
```

Stack overflow happens when recursion is too deep (default ~10,000 frames in V8).

## Fibonacci — Naive vs Memoized

```ts
// Naive: O(2^n) — exponential, terrible
function fibNaive(n: number): number {
  if (n <= 1) return n;
  return fibNaive(n - 1) + fibNaive(n - 2);
}

// Memoized: O(n) — cache results
function fibMemo(n: number, memo = new Map<number, number>()): number {
  if (n <= 1) return n;
  if (memo.has(n)) return memo.get(n)!;
  const result = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, result);
  return result;
}

fibMemo(50); // instant
```

## Tree Traversal

Recursion is perfect for tree structures because each subtree is also a tree.

```ts
interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

// Sum all values in a tree
function sumTree(node: TreeNode | undefined): number {
  if (!node) return 0;
  return node.value + sumTree(node.left) + sumTree(node.right);
}

// Find maximum depth
function maxDepth(node: TreeNode | undefined): number {
  if (!node) return 0;
  return 1 + Math.max(maxDepth(node.left), maxDepth(node.right));
}

// Flatten a tree to array (in-order)
function flatten(node: TreeNode | undefined): number[] {
  if (!node) return [];
  return [...flatten(node.left), node.value, ...flatten(node.right)];
}
```

## Flattening Nested Structures

```ts
type NestedArray<T> = (T | NestedArray<T>)[];

function deepFlatten<T>(arr: NestedArray<T>): T[] {
  return arr.reduce<T[]>((acc, item) => {
    if (Array.isArray(item)) return [...acc, ...deepFlatten(item)];
    return [...acc, item];
  }, []);
}

deepFlatten([1, [2, [3, [4]], 5]]); // [1, 2, 3, 4, 5]
```

## File System Traversal

Real-world recursion: traversing directories.

```ts
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

function getAllFiles(dir: string, ext?: string): string[] {
  const entries = readdirSync(dir);
  const files: string[] = [];

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext)); // recurse
    } else if (!ext || entry.endsWith(ext)) {
      files.push(fullPath);
    }
  }

  return files;
}

// Get all TypeScript files
getAllFiles('./src', '.ts');
```

## Tail Call Optimization

Tail recursion — the recursive call is the last operation. Some runtimes (not V8 currently) optimize this to avoid stack growth.

```ts
// Regular recursion — builds stack
function sum(n: number): number {
  if (n <= 0) return 0;
  return n + sum(n - 1);
}

// Tail recursive — accumulator carries the result
function sumTail(n: number, acc = 0): number {
  if (n <= 0) return acc;
  return sumTail(n - 1, acc + n); // tail call
}

// Iterative equivalent — always prefer for large n
function sumIter(n: number): number {
  let acc = 0;
  while (n > 0) acc += n--;
  return acc;
}
```

## When to Use Recursion vs Iteration

| Use recursion when | Use iteration when |
|-------------------|-------------------|
| Input is tree/graph shaped | Input is linear (array) |
| Divide-and-conquer is natural | Performance is critical |
| Code clarity matters more | Stack depth could be large |
| Depth is bounded and known | Language lacks TCO |

## Practice Problems

1. Implement `JSON.stringify` recursively for objects and arrays
2. Flatten a nested object: `{ a: { b: { c: 1 } } }` → `{ 'a.b.c': 1 }`
3. Find all permutations of a string
4. Solve the Tower of Hanoi
5. Implement deep clone (handles objects, arrays, primitives)
