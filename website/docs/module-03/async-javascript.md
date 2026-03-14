---
sidebar_position: 5
title: Async JavaScript
---

# Async JavaScript

JavaScript runs on a single thread but handles asynchronous operations (network requests, timers, file I/O) through an **event loop**. Understanding this is fundamental.

## The Event Loop

```
Call Stack      Web APIs         Task Queue

main()          setTimeout       callback
fetch(url)      fetch            resolve
                DOM events     
```

1. Synchronous code runs on the **call stack**
2. Async operations are handed to **Web APIs** (browser) or **libuv** (Node.js)
3. When they complete, their callbacks go to the **task queue**
4. The event loop moves items from the queue to the call stack when the stack is empty

## Callbacks → Promises → async/await

### Callbacks (old pattern — avoid for async flow)

```js
// Callback hell — deeply nested, hard to read and handle errors
getUser(id, (err, user) => {
  if (err) return handleError(err);
  getPosts(user.id, (err, posts) => {
    if (err) return handleError(err);
    getComments(posts[0].id, (err, comments) => {
      //  "callback hell"
    });
  });
});
```

### Promises

```js
// A Promise represents a value that will be available in the future
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    const success = Math.random() > 0.5;
    if (success) resolve({ data: 'success' });
    else reject(new Error('Something failed'));
  }, 1000);
});

promise
  .then(data => console.log(data))
  .catch(err => console.error(err))
  .finally(() => console.log('done'));

// Chaining
fetchUser(id)
  .then(user => fetchPosts(user.id))
  .then(posts => fetchComments(posts[0].id))
  .then(comments => render(comments))
  .catch(handleError);

// Parallel execution
const [user, settings, notifications] = await Promise.all([
  fetchUser(id),
  fetchSettings(id),
  fetchNotifications(id),
]);

// First one to resolve
const fastest = await Promise.race([fetchFromPrimary(), fetchFromBackup()]);

// All settle (don't fail if one rejects)
const results = await Promise.allSettled([p1, p2, p3]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log(r.value);
  else console.error(r.reason);
});
```

### async/await — The Modern Standard

`async/await` is syntactic sugar over Promises — it makes async code look and behave like synchronous code:

```js
//  async/await is much more readable
async function loadUserData(userId) {
  const user = await fetchUser(userId);
  const posts = await fetchPosts(user.id);
  const comments = await fetchComments(posts[0].id);
  return { user, posts, comments };
}

// Must be called with await or .then()
const data = await loadUserData(42);
```

### Error Handling with async/await

```js
// Option 1: try/catch
async function fetchUserProfile(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Failed to fetch user:', err);
    throw err;  // re-throw so the caller can handle it too
  }
}

// Option 2: utility wrapper (avoids try/catch everywhere)
async function safeAwait(promise) {
  try {
    const data = await promise;
    return [null, data];
  } catch (err) {
    return [err, null];
  }
}

const [err, user] = await safeAwait(fetchUser(id));
if (err) return handleError(err);
// user is guaranteed here
```

## The Fetch API

```js
// GET request
async function getUsers() {
  const res = await fetch('https://api.example.com/users');

  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  return res.json();  // parses JSON and returns the object
}

// POST with JSON body
async function createUser(userData) {
  const res = await fetch('https://api.example.com/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  }

  return res.json();
}

// With auth header
async function getProtectedResource(token) {
  const res = await fetch('/api/protected', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
```

## Async Patterns

### Sequential vs Parallel

```js
//  Sequential — waits 3 seconds total (3 × 1s)
const a = await fetch('/api/a');  // wait 1s
const b = await fetch('/api/b');  // wait 1s
const c = await fetch('/api/c');  // wait 1s

//  Parallel — waits 1 second total
const [a, b, c] = await Promise.all([
  fetch('/api/a'),
  fetch('/api/b'),
  fetch('/api/c'),
]);
```

### Async Iteration

```js
// for await...of — iterate async iterables
async function processStream(stream) {
  for await (const chunk of stream) {
    process(chunk);
  }
}

// Process array items sequentially with async
async function processSequential(items) {
  for (const item of items) {
    await processItem(item);  // waits for each before continuing
  }
}

// Process all in parallel
async function processParallel(items) {
  await Promise.all(items.map(item => processItem(item)));
}
```

### AbortController — Cancel Requests

```js
const controller = new AbortController();

// Cancel after 5 seconds
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const res = await fetch('/api/data', { signal: controller.signal });
  const data = await res.json();
  clearTimeout(timeout);
  return data;
} catch (err) {
  if (err.name === 'AbortError') {
    console.log('Request was cancelled');
  } else {
    throw err;
  }
}
```
