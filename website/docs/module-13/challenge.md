---
sidebar_position: 6
title: Challenge — Algorithm Toolkit
---

# Challenge — Algorithm Toolkit

## Objective

Build a TypeScript library of algorithms and data structures, with tests written in Vitest.

## Requirements

### Part 1 — Data Structures (50 points)

Implement the following with full TypeScript generics:

- [ ] `Stack<T>` — push, pop, peek, isEmpty, size
- [ ] `Queue<T>` — enqueue, dequeue, front, isEmpty, size
- [ ] `LinkedList<T>` — append, prepend, remove, toArray, size
- [ ] `HashMap<K, V>` — set, get, has, delete, keys, values (use built-in Map internally)
- [ ] `BinarySearchTree<T>` — insert, contains, inOrder, preOrder, height

### Part 2 — Algorithms (30 points)

- [ ] `mergeSort(arr: number[]): number[]`
- [ ] `quickSort(arr: number[]): number[]`
- [ ] `binarySearch<T>(arr: T[], target: T): number`
- [ ] `deepFlatten<T>(arr: NestedArray<T>): T[]`
- [ ] `memoize<T>(fn: (...args: unknown[]) => T): (...args: unknown[]) => T`

### Part 3 — Tests (20 points)

Write Vitest tests covering:

- [ ] Edge cases: empty inputs, single elements, duplicates
- [ ] Performance: large inputs (n=10,000) complete in under 100ms
- [ ] Type safety: TypeScript compiles with no errors

## Project Structure

```
algorithm-toolkit/
 src/
    structures/
       Stack.ts
       Queue.ts
       LinkedList.ts
       BST.ts
    algorithms/
       sorting.ts
       searching.ts
       utils.ts
    index.ts
 tests/
    structures.test.ts
    algorithms.test.ts
 package.json
 tsconfig.json
```

## Starter Test

```ts
import { describe, it, expect } from 'vitest';
import { Stack } from '../src/structures/Stack';

describe('Stack', () => {
  it('should push and pop in LIFO order', () => {
    const stack = new Stack<number>();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    expect(stack.pop()).toBe(3);
    expect(stack.pop()).toBe(2);
  });

  it('should return undefined on pop from empty stack', () => {
    const stack = new Stack<number>();
    expect(stack.pop()).toBeUndefined();
  });

  it('should report correct size', () => {
    const stack = new Stack<string>();
    expect(stack.size).toBe(0);
    stack.push('a');
    stack.push('b');
    expect(stack.size).toBe(2);
  });
});
```

## Bonus

- Implement a `PriorityQueue<T>` using a min-heap
- Add a `Graph` class with BFS, DFS, and shortest path (Dijkstra)
- Benchmark sorting algorithms on arrays of size 100, 1000, 10000 and chart the results
