---
sidebar_position: 4
title: Arrays & Objects
---

# Arrays & Objects

## Array Methods You Must Know

### Transforming: .map()

Returns a **new array** with each element transformed:

```js
const prices = [10, 20, 30];
const withTax = prices.map(p => p * 1.1);
// [11, 22, 33]

const users = [{ name: 'Alice', age: 28 }, { name: 'Bob', age: 34 }];
const names = users.map(u => u.name);
// ['Alice', 'Bob']
```

### Filtering: .filter()

Returns a **new array** with only elements that pass the test:

```js
const numbers = [1, 2, 3, 4, 5, 6];
const evens = numbers.filter(n => n % 2 === 0);
// [2, 4, 6]

const activeUsers = users.filter(u => u.isActive);
```

### Reducing: .reduce()

Combines all elements into a single value:

```js
const numbers = [1, 2, 3, 4, 5];

// Sum
const sum = numbers.reduce((acc, n) => acc + n, 0);  // 15

// Max
const max = numbers.reduce((a, b) => Math.max(a, b), -Infinity);

// Group by
const people = [
  { name: 'Alice', dept: 'eng' },
  { name: 'Bob', dept: 'design' },
  { name: 'Carol', dept: 'eng' },
];

const byDept = people.reduce((groups, person) => {
  const dept = person.dept;
  groups[dept] = groups[dept] ?? [];
  groups[dept].push(person);
  return groups;
}, {});

// { eng: [Alice, Carol], design: [Bob] }
```

### Finding: .find() and .findIndex()

```js
const users = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

const user = users.find(u => u.id === 2);      // { id: 2, name: 'Bob' }
const idx  = users.findIndex(u => u.id === 2); // 1
```

### Checking: .some() and .every()

```js
const scores = [85, 92, 78, 95];

scores.some(s => s >= 90);   // true — at least one passes
scores.every(s => s >= 70);  // true — all pass
scores.every(s => s >= 90);  // false — not all pass
```

### Flattening: .flat() and .flatMap()

```js
const nested = [1, [2, 3], [4, [5, 6]]];
nested.flat();    // [1, 2, 3, 4, [5, 6]]
nested.flat(2);   // [1, 2, 3, 4, 5, 6]

// flatMap = map + flat(1)
const sentences = ['hello world', 'foo bar'];
sentences.flatMap(s => s.split(' '));
// ['hello', 'world', 'foo', 'bar']
```

### Sorting: .sort()

```js
//  sort() mutates the original array — sort a copy!
const nums = [3, 1, 4, 1, 5, 9];
const sorted = [...nums].sort((a, b) => a - b);  // ascending
const desc = [...nums].sort((a, b) => b - a);    // descending

// Sort objects by property
const users = [{ name: 'Charlie' }, { name: 'Alice' }, { name: 'Bob' }];
const alpha = [...users].sort((a, b) => a.name.localeCompare(b.name));
```

### Other Essentials

```js
// includes
[1, 2, 3].includes(2);  // true

// Array.from — create array from iterable or array-like
Array.from('hello');          // ['h', 'e', 'l', 'l', 'o']
Array.from({ length: 5 }, (_, i) => i); // [0, 1, 2, 3, 4]

// at() — negative indexing
const last = arr.at(-1);   // last element
const second = arr.at(-2);

// Chaining methods
const result = users
  .filter(u => u.isActive)
  .map(u => u.name)
  .sort()
  .slice(0, 10);
```

## Objects

### Creating and Shorthand

```js
const name = 'Alice';
const age = 28;

// Shorthand property names (ES6)
const user = { name, age };  // same as { name: name, age: age }

// Computed property names
const key = 'role';
const obj = { [key]: 'admin' };  // { role: 'admin' }

// Methods shorthand
const calculator = {
  value: 0,
  add(n) { this.value += n; return this; },
  subtract(n) { this.value -= n; return this; },
  result() { return this.value; },
};

calculator.add(10).add(5).subtract(3).result(); // 12
```

### Object Utility Methods

```js
const user = { name: 'Alice', age: 28, role: 'admin' };

// Keys, values, entries
Object.keys(user);    // ['name', 'age', 'role']
Object.values(user);  // ['Alice', 28, 'admin']
Object.entries(user); // [['name', 'Alice'], ['age', 28], ['role', 'admin']]

// Iterate entries
for (const [key, value] of Object.entries(user)) {
  console.log(`${key}: ${value}`);
}

// Build object from entries
const doubled = Object.fromEntries(
  Object.entries(scores).map(([k, v]) => [k, v * 2])
);

// Freeze (make immutable — shallow)
const config = Object.freeze({ port: 3000, host: 'localhost' });
```

### Immutable Update Patterns

Never mutate objects directly — return new objects:

```js
const user = { name: 'Alice', address: { city: 'NYC', zip: '10001' } };

//  Shallow update
const updated = { ...user, name: 'Bob' };

//  Nested update
const movedUser = {
  ...user,
  address: { ...user.address, city: 'LA' }
};

//  Add/remove keys
const { password, ...safeUser } = user;  // omit password

//  Update array item by index
const newItems = items.map((item, i) =>
  i === targetIndex ? { ...item, done: true } : item
);

//  Remove from array
const filtered = items.filter(item => item.id !== removeId);
```
