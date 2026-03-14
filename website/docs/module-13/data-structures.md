---
sidebar_position: 3
title: Data Structures
---

# Data Structures in TypeScript

Understanding core data structures makes you a better engineer — you'll recognize patterns, reason about performance, and choose the right tool for the job.

## Stack

Last-in, first-out (LIFO). Think: browser history, undo/redo, call stack.

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
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

// Usage
const history = new Stack<string>();
history.push('/home');
history.push('/about');
history.push('/contact');
history.pop(); // '/contact'
history.peek(); // '/about'
```

## Queue

First-in, first-out (FIFO). Think: job queues, print spoolers, BFS traversal.

```ts
class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  front(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}
```

> **Performance note**: `Array.shift()` is O(n) because it re-indexes. For high-throughput queues, use a linked list or circular buffer.

## Linked List

Nodes linked by pointers. O(1) prepend, O(n) access by index.

```ts
interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}

class LinkedList<T> {
  private head: ListNode<T> | null = null;
  private _size = 0;

  prepend(value: T): void {
    this.head = { value, next: this.head };
    this._size++;
  }

  append(value: T): void {
    const node: ListNode<T> = { value, next: null };
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) current = current.next;
      current.next = node;
    }
    this._size++;
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }

  get size(): number {
    return this._size;
  }
}
```

## Hash Map

O(1) average lookup, insert, delete. JavaScript's `Map` and objects are hash maps under the hood.

```ts
// Built-in Map — prefer over plain objects for arbitrary keys
const wordCount = new Map<string, number>();

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];

for (const word of words) {
  wordCount.set(word, (wordCount.get(word) ?? 0) + 1);
}

console.log(wordCount.get('apple')); // 3

// Checking for anagrams using frequency maps
function areAnagrams(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const freq = new Map<string, number>();
  for (const ch of a) freq.set(ch, (freq.get(ch) ?? 0) + 1);
  for (const ch of b) {
    const count = freq.get(ch);
    if (!count) return false;
    freq.set(ch, count - 1);
  }
  return true;
}
```

## Binary Search Tree

Ordered storage, O(log n) search on balanced trees.

```ts
interface BSTNode<T> {
  value: T;
  left: BSTNode<T> | null;
  right: BSTNode<T> | null;
}

class BST<T extends number | string> {
  private root: BSTNode<T> | null = null;

  insert(value: T): void {
    this.root = this.insertNode(this.root, value);
  }

  private insertNode(node: BSTNode<T> | null, value: T): BSTNode<T> {
    if (!node) return { value, left: null, right: null };
    if (value < node.value) node.left = this.insertNode(node.left, value);
    else if (value > node.value) node.right = this.insertNode(node.right, value);
    return node;
  }

  contains(value: T): boolean {
    let current = this.root;
    while (current) {
      if (value === current.value) return true;
      current = value < current.value ? current.left : current.right;
    }
    return false;
  }

  // In-order traversal yields sorted values
  inOrder(): T[] {
    const result: T[] = [];
    const traverse = (node: BSTNode<T> | null) => {
      if (!node) return;
      traverse(node.left);
      result.push(node.value);
      traverse(node.right);
    };
    traverse(this.root);
    return result;
  }
}

const tree = new BST<number>();
[5, 3, 7, 1, 4].forEach(n => tree.insert(n));
console.log(tree.inOrder()); // [1, 3, 4, 5, 7]
```

## Graph

Nodes (vertices) connected by edges. Used for social networks, dependency trees, routing.

```ts
type AdjacencyList = Map<string, Set<string>>;

class Graph {
  private adj: AdjacencyList = new Map();

  addVertex(v: string): void {
    if (!this.adj.has(v)) this.adj.set(v, new Set());
  }

  addEdge(v: string, w: string): void {
    this.addVertex(v);
    this.addVertex(w);
    this.adj.get(v)!.add(w);
    this.adj.get(w)!.add(v); // undirected
  }

  // Breadth-first search
  bfs(start: string): string[] {
    const visited = new Set<string>();
    const queue: string[] = [start];
    const result: string[] = [];
    visited.add(start);

    while (queue.length) {
      const vertex = queue.shift()!;
      result.push(vertex);
      for (const neighbor of this.adj.get(vertex) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return result;
  }

  // Depth-first search (iterative)
  dfs(start: string): string[] {
    const visited = new Set<string>();
    const stack: string[] = [start];
    const result: string[] = [];

    while (stack.length) {
      const vertex = stack.pop()!;
      if (visited.has(vertex)) continue;
      visited.add(vertex);
      result.push(vertex);
      for (const neighbor of this.adj.get(vertex) ?? []) {
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
    return result;
  }
}
```

## Choosing the Right Structure

| Need | Use |
|------|-----|
| LIFO (undo, call stack) | Stack |
| FIFO (job queue, BFS) | Queue |
| O(1) lookup by key | Map / Hash Map |
| Sorted data, range queries | BST / sorted array |
| Relationships / traversal | Graph |
| Ordered dynamic list | Array or Linked List |

## Practice Problems

1. Implement a stack using two queues
2. Detect a cycle in a linked list (Floyd's algorithm)
3. Find the first non-repeating character using a Map
4. Check if a binary tree is balanced
5. Find the shortest path between two nodes in a graph using BFS
