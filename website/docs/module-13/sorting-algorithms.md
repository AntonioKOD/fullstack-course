---
sidebar_position: 4
title: Sorting Algorithms
---

# Sorting Algorithms

Sorting is one of the most studied problems in CS. You'll rarely implement these from scratch, but understanding them helps you reason about `Array.sort()` and choose algorithms for specific constraints.

## The Built-in: `Array.prototype.sort`

JavaScript's `Array.sort` uses TimSort (a hybrid of merge sort + insertion sort). It's O(n log n) and stable since ES2019.

```ts
// Default sort — converts to strings (WRONG for numbers!)
[10, 9, 2, 1, 100].sort(); // [1, 10, 100, 2, 9] 

// Correct numeric sort
[10, 9, 2, 1, 100].sort((a, b) => a - b); // [1, 2, 9, 10, 100] ✓

// Sort objects
const users = [
  { name: 'Charlie', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 },
];

users.sort((a, b) => a.name.localeCompare(b.name));
// [Alice, Bob, Charlie]
```

## Bubble Sort — O(n²)

Repeatedly swap adjacent elements that are out of order. Simple but slow.

```ts
function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let swapped = false;
    for (let j = 0; j < a.length - i - 1; j++) {
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
      }
    }
    if (!swapped) break; // already sorted
  }
  return a;
}
```

**When to use**: Never in production. Good for teaching.

## Selection Sort — O(n²)

Find the minimum, swap it to the front. Fewer swaps than bubble sort.

```ts
function selectionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 0; i < a.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < a.length; j++) {
      if (a[j] < a[minIdx]) minIdx = j;
    }
    if (minIdx !== i) [a[i], a[minIdx]] = [a[minIdx], a[i]];
  }
  return a;
}
```

## Insertion Sort — O(n²) worst, O(n) best

Build a sorted portion one element at a time. Very fast on nearly-sorted data — this is why TimSort uses it for small subarrays.

```ts
function insertionSort(arr: number[]): number[] {
  const a = [...arr];
  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      a[j + 1] = a[j];
      j--;
    }
    a[j + 1] = key;
  }
  return a;
}
```

## Merge Sort — O(n log n)

Divide, sort halves recursively, merge. Stable and predictable — good for linked lists and external sorting.

```ts
function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }

  return [...result, ...left.slice(i), ...right.slice(j)];
}
```

## Quick Sort — O(n log n) average, O(n²) worst

Pick a pivot, partition, recurse. Fastest in practice due to cache locality. JavaScript engines use variations of this.

```ts
function quickSort(arr: number[], low = 0, high = arr.length - 1): number[] {
  const a = [...arr];

  function partition(lo: number, hi: number): number {
    const pivot = a[hi];
    let i = lo - 1;
    for (let j = lo; j < hi; j++) {
      if (a[j] <= pivot) {
        i++;
        [a[i], a[j]] = [a[j], a[i]];
      }
    }
    [a[i + 1], a[hi]] = [a[hi], a[i + 1]];
    return i + 1;
  }

  function sort(lo: number, hi: number): void {
    if (lo < hi) {
      const pi = partition(lo, hi);
      sort(lo, pi - 1);
      sort(pi + 1, hi);
    }
  }

  sort(low, high);
  return a;
}
```

## Algorithm Comparison

| Algorithm | Best | Average | Worst | Space | Stable |
|-----------|------|---------|-------|-------|--------|
| Bubble | O(n) | O(n²) | O(n²) | O(1) | ✓ |
| Selection | O(n²) | O(n²) | O(n²) | O(1) | ✗ |
| Insertion | O(n) | O(n²) | O(n²) | O(1) | ✓ |
| Merge | O(n log n) | O(n log n) | O(n log n) | O(n) | ✓ |
| Quick | O(n log n) | O(n log n) | O(n²) | O(log n) | ✗ |
| TimSort (JS) | O(n) | O(n log n) | O(n log n) | O(n) | ✓ |

## Binary Search

Not sorting, but closely related — requires sorted input. O(log n) search.

```ts
function binarySearch<T>(arr: T[], target: T): number {
  let low = 0;
  let high = arr.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }

  return -1; // not found
}

// Also works as "find insertion point"
function lowerBound(arr: number[], target: number): number {
  let low = 0, high = arr.length;
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (arr[mid] < target) low = mid + 1;
    else high = mid;
  }
  return low;
}
```

## Practice Problems

1. Sort an array of strings by length, then alphabetically for ties
2. Implement merge sort for a linked list
3. Find the kth largest element in O(n) average time (QuickSelect)
4. Given a sorted rotated array, find a target in O(log n)
5. Count inversions in an array using merge sort
