---
sidebar_position: 2
title: Big-O Notation
---

# Big-O Notation

Big-O describes how an algorithm's time or space requirements grow relative to input size. It's the vocabulary developers use to compare algorithm efficiency.

## Common Complexities (Best → Worst)

| Notation | Name | Example |
|----------|------|---------|
| O(1) | Constant | Hash map lookup |
| O(log n) | Logarithmic | Binary search |
| O(n) | Linear | Array iteration |
| O(n log n) | Linearithmic | Merge sort, quicksort |
| O(n²) | Quadratic | Nested loops |
| O(2ⁿ) | Exponential | Naive recursive Fibonacci |
| O(n!) | Factorial | Brute-force permutations |

## Identifying Complexity

```ts
// O(1) — constant time, regardless of input size
function getFirst<T>(arr: T[]): T | undefined {
  return arr[0];
}

// O(n) — one pass through the array
function sum(numbers: number[]): number {
  let total = 0;
  for (const n of numbers) {  // n iterations
    total += n;
  }
  return total;
}

// O(n²) — nested loops over the same array
function hasDuplicate<T>(arr: T[]): boolean {
  for (let i = 0; i < arr.length; i++) {       // n
    for (let j = i + 1; j < arr.length; j++) { // n
      if (arr[i] === arr[j]) return true;
    }
  }
  return false;
}

// O(n) — same problem but using a Set
function hasDuplicateFast<T>(arr: T[]): boolean {
  return arr.length !== new Set(arr).size;
}

// O(log n) — halves search space each iteration
function binarySearch(sorted: number[], target: number): number {
  let left = 0;
  let right = sorted.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sorted[mid] === target) return mid;
    if (sorted[mid] < target) left = mid + 1;
    else right = mid - 1;
  }

  return -1;
}
```

## Space Complexity

```ts
// O(1) space — uses constant extra memory
function reverseInPlace(arr: number[]): void {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    left++;
    right--;
  }
}

// O(n) space — creates a new array of same size
function reverseCopy(arr: number[]): number[] {
  return [...arr].reverse();
}

// O(n) space — recursion stack depth proportional to n
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // n stack frames
}
```

## Real-World Examples

```ts
// O(n) — iterating an array to find something
const user = users.find(u => u.id === targetId);

// O(1) — Map/Set lookup (after building the map, which is O(n))
const userMap = new Map(users.map(u => [u.id, u]));
const user = userMap.get(targetId);  // O(1)

// O(n²) — filtering inside a map (common mistake)
const result = ids.map(id =>
  users.find(u => u.id === id)  // O(n) inside O(n)
);

// O(n) — build a lookup first, then map
const byId = Object.fromEntries(users.map(u => [u.id, u]));
const result = ids.map(id => byId[id]); // O(1) per lookup
```

## Drop Constants and Non-Dominant Terms

Big-O is about growth rate, not exact count:

```ts
// O(2n) → simplify to O(n)
function twoLoops(arr: number[]): void {
  for (const x of arr) console.log(x);  // n
  for (const x of arr) console.log(x);  // n
  // Total: 2n → O(n)
}

// O(n² + n) → simplify to O(n²) — n² dominates
function nestedAndFlat(arr: number[]): void {
  for (const x of arr) {              // n²
    for (const y of arr) {
      console.log(x, y);
    }
  }
  for (const x of arr) console.log(x); // n — irrelevant
}
```
