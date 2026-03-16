---
sidebar_position: 5
title: Async JavaScript
---

# Async JavaScript

:::info Learning Objectives
By the end of this lesson you will be able to:
- Explain in plain English why JavaScript needs asynchronous patterns and what happens if you ignore them
- Write the same data-fetching operation three ways: with callbacks, with Promises, and with async/await — and explain the trade-offs of each
- Use `fetch()` with `async/await` to retrieve JSON from an API and display it on a page
- Handle errors properly using `try/catch` and explain what goes wrong when you forget to
:::

## Why This Matters

This is the lesson that trips up more beginners than any other. You can write perfect HTML, CSS, and JavaScript logic — but if you do not understand asynchronous code, every API call you attempt will confuse you. You will try to use data before it has arrived, log `undefined` when you expected an object, and create bugs that feel completely random.

In Module 06 you will call real APIs to build weather apps, movie search engines, and data dashboards. In Module 18 you will write the server-side code that those APIs call. In Module 16, React's data fetching with `useEffect` is built entirely on the concepts in this lesson. Every moment you invest in genuinely understanding async will pay off for the rest of the course.

---

## The Restaurant Order Analogy

Before we write a single line of code, let us build a mental model using something familiar.

You walk into a restaurant and sit down. You call the waiter over and **place your order** — "I'd like the pasta, please." The waiter writes it down and walks away to the kitchen.

Now: do you sit completely frozen at the table, unable to move or speak, waiting for the pasta to arrive? Of course not. You look at the menu, talk to the people you are with, check your phone, drink some water. The kitchen is working on your order in the background while you continue living your life.

Eventually, a **buzzer goes off** (or the waiter comes back) and your pasta is ready. Now you stop what you are doing and **pick up your food**.

JavaScript works exactly this way:

1. You **place an order** — you call a function that does something slow, like `fetch(url)` (the network is the kitchen)
2. JavaScript keeps **doing other things** — running other code, responding to user interactions
3. When the slow operation finishes, it **buzzes you** (the Promise resolves, or the callback is called)
4. You **handle the result** — you do something with the data that arrived

The key insight: JavaScript does not stop and wait. It fires off the slow operation and immediately moves on to the next line of code. This is what "asynchronous" means.

---

## Why You Cannot Just Do `const data = fetch(url)`

This is the most common beginner mistake with async code, and it comes from a reasonable assumption: "I call fetch, it returns data, I store it in a variable." Let us see exactly what goes wrong.

```js
// This looks reasonable, but it does NOT work:
const response = fetch('https://api.example.com/products');
console.log(response); // Promise { <pending> } — NOT the data!
```

`fetch()` returns immediately with a **Promise** — an object that says "I have started the operation, and I promise to have a result for you later." At the moment `fetch()` returns, the network request is still in flight. The kitchen is still cooking.

If you try to access the data right away, it does not exist yet:

```js
// This also does not work:
const response = fetch('https://api.example.com/products');
const data = response.json(); // Error! response is a Promise, not a Response object
```

You have to wait. The rest of this lesson is about three different ways to express "wait for this to finish, then do something with the result."

---

## Three Ways to Handle Async: The Evolution

### Way 1: Callbacks (how it used to be done)

In the early days of JavaScript, the standard approach was to pass a function (a "callback") to an async operation. When the operation finished, it would call your function with the result.

```js
// Imagine a made-up readFile function that uses callbacks
readFile('data.json', function(error, data) {
  if (error) {
    console.error('Could not read file:', error);
    return;
  }
  // Now I have the data — but I need user info next...
  getUser(data.userId, function(error, user) {
    if (error) {
      console.error('Could not get user:', error);
      return;
    }
    // Now I have the user — but I need their posts next...
    getPosts(user.id, function(error, posts) {
      if (error) {
        console.error('Could not get posts:', error);
        return;
      }
      // Finally have everything — render it
      render(user, posts);
    });
  });
});
```

This is called **"callback hell"** or the **"pyramid of doom."** Notice how every step has to be nested inside the previous one, the error handling repeats three times, and the code grows rightward without bound. Reading this three months after writing it is nearly impossible.

Callbacks are not wrong — they are still used in Node.js file system operations and event listeners. But for sequential async operations (where you need the result of step 1 to start step 2), they become unmanageable quickly.

### Way 2: Promises (the improvement)

ES6 (2015) introduced Promises. A Promise is an object representing the eventual result of an async operation. It has three states:
- **Pending** — the operation is still in progress (kitchen is still cooking)
- **Fulfilled** — the operation succeeded and has a value (pasta is ready)
- **Rejected** — the operation failed and has a reason (kitchen caught fire)

You interact with a Promise using `.then()` for success and `.catch()` for errors:

```js
// The same operations as above, using Promises
readFile('data.json')
  .then(data => getUser(data.userId))
  .then(user => getPosts(user.id))
  .then(posts => render(posts))
  .catch(error => console.error('Something failed:', error));
```

Compare this to the callback version. The code is now:
- Flat instead of nested (no pyramid)
- Error handling happens once at the end with `.catch()`
- Each step is clearly separated and readable

The `.then()` chain works because each `.then()` receives the resolved value of the previous Promise, and can return a new Promise for the next `.then()` to wait on.

```js
// Creating a Promise manually (so you understand how they work)
const buzzer = new Promise((resolve, reject) => {
  // Simulate a 2-second wait (like a network request)
  setTimeout(() => {
    const orderReady = true; // pretend the kitchen succeeded
    if (orderReady) {
      resolve({ dish: 'pasta', price: 14.99 }); // success — call resolve with the data
    } else {
      reject(new Error('Kitchen is closed')); // failure — call reject with an error
    }
  }, 2000);
});

buzzer
  .then(order => console.log('Received:', order.dish)) // "Received: pasta"
  .catch(err  => console.error('Failed:', err.message))
  .finally(() => console.log('Buzzer is done either way')); // always runs
```

### Way 3: async/await (the modern standard)

`async/await` is syntactic sugar built on top of Promises. It does not replace them — under the hood, it is still Promises — but it lets you write async code that *looks* and *reads* like synchronous code, which is much easier for humans to follow.

```js
// async/await version of the same operations
async function loadUserContent() {
  const data  = await readFile('data.json');
  const user  = await getUser(data.userId);
  const posts = await getPosts(user.id);
  render(user, posts);
}
```

Line by line: when JavaScript reaches an `await`, it pauses execution of *this function* (not the whole program!), waits for the Promise to resolve, and then continues with the resolved value. The rest of your application keeps running while this function waits.

Rules of `async/await`:
1. You can only use `await` inside an `async` function
2. An `async` function always returns a Promise — even if you return a plain value
3. `await` unwraps the Promise and gives you the resolved value

---

## The `fetch()` API with async/await

`fetch()` is the modern, built-in way to make network requests from the browser. Here is the full pattern you will use in Module 06:

```js
// Basic GET request — the complete pattern
async function getProducts() {
  const response = await fetch('https://api.example.com/products');

  // IMPORTANT: fetch() only rejects on network failure (e.g., no internet).
  // A 404 or 500 status code still "succeeds" as far as fetch is concerned.
  // You must check response.ok to catch HTTP errors.
  if (!response.ok) {
    throw new Error(`Server returned ${response.status}: ${response.statusText}`);
  }

  // response.json() is ALSO async — it reads the response body and parses the JSON.
  // You must await it too.
  const products = await response.json();
  return products;
}

// Using the function
const products = await getProducts();
console.log(products);
```

Why is there a second `await` for `response.json()`? Because when your code first gets the response, it has the HTTP headers but the body (the actual JSON data) might still be arriving. `response.json()` reads the rest of the body and parses it — another async operation.

### POST request (sending data to a server)

```js
async function createProduct(productData) {
  const response = await fetch('https://api.example.com/products', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(productData),
  });

  if (!response.ok) {
    // The server might send error details as JSON
    const errorData = await response.json();
    throw new Error(errorData.message ?? `Request failed: ${response.status}`);
  }

  return response.json(); // return the created product (server sends it back)
}

// Calling it
const newProduct = await createProduct({
  name:     'Wireless Mouse',
  price:    34.99,
  category: 'electronics',
});
```

---

## Error Handling: The Part Everyone Skips

Forgetting to handle errors is the second most common async mistake (after forgetting `await`). Unhandled Promise rejections crash silently in some environments and show ugly errors in others. Always handle them.

### `try/catch` with async/await

```js
async function loadDashboard(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);

    if (!response.ok) {
      throw new Error(`Failed to load user: ${response.status}`);
    }

    const user = await response.json();

    // Multiple awaits in a single try block — if any of them fail,
    // execution jumps to the catch block immediately
    const postsResponse = await fetch(`/api/users/${userId}/posts`);
    if (!postsResponse.ok) {
      throw new Error(`Failed to load posts: ${postsResponse.status}`);
    }
    const posts = await postsResponse.json();

    return { user, posts };

  } catch (error) {
    console.error('Dashboard failed to load:', error.message);
    // Return a safe fallback so the UI does not break entirely
    return { user: null, posts: [] };
  }
}
```

The `try/catch` block catches both:
- Actual network errors (no internet connection, DNS failure) — these cause `fetch()` to reject
- Errors you `throw` manually when the response status is bad

:::warning Common Mistake: Not checking `response.ok`
`fetch()` only throws/rejects on network-level errors. A 404 "Not Found" or 500 "Server Error" does NOT automatically reject — it resolves with a response object whose `ok` property is `false`. If you do not check `response.ok`, your code will silently succeed even when the server returned an error:

```js
// Bug: this appears to work even when the server returns a 404
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  return response.json(); // might return a "not found" error object, not a user!
}

// Correct: always check response.ok
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  if (!response.ok) {
    throw new Error(`User not found: ${response.status}`);
  }
  return response.json();
}
```
:::

### `.catch()` on Promises

When you are working directly with Promises (not async/await), attach a `.catch()` handler:

```js
fetch('/api/products')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .then(products => renderProducts(products))
  .catch(error => {
    console.error('Could not load products:', error);
    showErrorMessage('Products unavailable. Please try again.');
  });
```

:::warning Common Mistake: Forgetting `await`
This is the most common async bug, and it produces a confusing result — your variable holds a Promise instead of the data:

```js
async function getUser(id) {
  const user = fetch(`/api/users/${id}`); // forgot await!
  console.log(user); // Promise { <pending> } — not the user data!
  return user.name;  // undefined — user is a Promise, not an object
}

// Correct:
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);
  const user     = await response.json();
  console.log(user); // { id: 1, name: 'Alice', ... }
  return user.name;  // 'Alice'
}
```

If you ever log a value and see `Promise { <pending> }`, it means you forgot an `await` somewhere.
:::

---

## Sequential vs Parallel Execution

When you `await` multiple operations one after another, they run sequentially — each one waits for the previous to finish before starting. This is often slower than necessary.

```js
// Sequential — total time = 1s + 1s + 1s = ~3 seconds
async function loadSequential() {
  const user    = await fetchUser(id);    // starts, takes ~1s
  const posts   = await fetchPosts(id);   // waits for user, then takes ~1s
  const profile = await fetchProfile(id); // waits for posts, then takes ~1s
  return { user, posts, profile };
}

// Parallel — total time = ~1 second (all three start at the same time)
async function loadParallel() {
  const [user, posts, profile] = await Promise.all([
    fetchUser(id),    // all three start immediately
    fetchPosts(id),
    fetchProfile(id),
  ]);
  return { user, posts, profile };
}
```

`Promise.all()` takes an array of Promises and returns a single Promise that resolves when **all of them** resolve, with an array of their results. If **any** one rejects, `Promise.all()` rejects immediately.

Use sequential when the second operation depends on the result of the first (you need the user's ID before you can fetch their posts). Use parallel when the operations are independent of each other.

```js
// Must be sequential — need user before fetching their posts
async function loadUserAndPosts(userId) {
  const user  = await fetchUser(userId);           // need user first
  const posts = await fetchPosts(user.id);          // now use user.id
  return { user, posts };
}

// Can be parallel — settings and notifications are independent
async function loadDashboard(userId) {
  const [user, settings, notifications] = await Promise.all([
    fetchUser(userId),
    fetchSettings(userId),
    fetchNotifications(userId),
  ]);
  return { user, settings, notifications };
}
```

### `Promise.allSettled()` — When You Want All Results Even If Some Fail

```js
// Promise.all() fails fast — if any promise rejects, the whole thing rejects
// Promise.allSettled() waits for all, regardless of success or failure
const results = await Promise.allSettled([
  fetchUser(1),
  fetchUser(999),  // this one might 404
  fetchUser(3),
]);

results.forEach((result, index) => {
  if (result.status === 'fulfilled') {
    console.log(`User ${index + 1}:`, result.value.name);
  } else {
    console.error(`User ${index + 1} failed:`, result.reason.message);
  }
});
```

Use `allSettled` when you want to load multiple independent pieces of data and display what you can, even if some requests fail.

---

## The Event Loop (What Is Actually Happening)

Now that you have used async code, here is what is happening under the hood. JavaScript runs on a single thread — it can only do one thing at a time. The **event loop** is the mechanism that makes async behavior possible.

```
Your Code (Call Stack)     Browser/Node (Web APIs)     Waiting Room (Task Queue)

main() runs
fetch(url) called  ──────► Network request starts ──► (request in flight)
console.log('sent')
main() returns (stack empty)
                                                        response arrives
                           callback queued ────────────► .then() callback
Event loop sees empty stack
and item in queue ────────► run .then() callback
                             (logs the data)
```

1. Your synchronous code runs on the **call stack**
2. Async operations (`fetch`, `setTimeout`) are handed off to the browser's built-in APIs, which run them in the background
3. When they complete, their callbacks go into the **task queue**
4. The **event loop** constantly checks: "Is the call stack empty? Is there anything in the task queue?" If both are true, it moves the next callback onto the stack to run

This is why you can never just "get" the result of a fetch synchronously — the result does not exist yet when the next line of code runs. The request is sitting in the browser's hands while JavaScript has already moved on.

---

## A Complete Working Example

Here is a realistic, complete async function you could use in a real project:

```js
// Fetch a list of products and render them to the page
async function loadAndDisplayProducts() {
  const container = document.getElementById('products');
  container.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=6');

    if (!response.ok) {
      throw new Error(`Could not load products (${response.status})`);
    }

    const products = await response.json();

    container.innerHTML = products
      .map(p => `
        <div class="product-card">
          <img src="${p.image}" alt="${p.title}">
          <h3>${p.title}</h3>
          <p>$${p.price.toFixed(2)}</p>
        </div>
      `)
      .join('');

  } catch (error) {
    container.innerHTML = `
      <p class="error">
        Failed to load products: ${error.message}
      </p>
    `;
  }
}

// Call it when the page loads
document.addEventListener('DOMContentLoaded', loadAndDisplayProducts);
```

This example uses a real, free API (`fakestoreapi.com`). Notice the full pattern: loading state before the request, `response.ok` check, proper `try/catch`, and a user-facing error message.

---

## Key Takeaways

- JavaScript is single-threaded. Async code lets it start slow operations (network, timers) and keep responding to users while those operations are in progress.
- `fetch()` returns a **Promise**, not the data. You must `await` it to get the response object.
- `response.json()` is also async — you must `await` it too to get the parsed data.
- `fetch()` only rejects on network failure. You must check `response.ok` for HTTP errors like 404 or 500.
- Use `async/await` for readability. Use `.then()/.catch()` when you cannot use async (e.g., in a constructor).
- Use `Promise.all()` to run independent operations in parallel and cut your total wait time.
- Always handle errors with `try/catch` or `.catch()`. Unhandled rejections produce hard-to-debug behavior.

---

## Activity: Fetch and Display

**Goal:** Write a real async function that fetches data from a public API, handles errors, and renders the results to the page.

**Setup:** Create an `index.html` with a `<div id="output"></div>` and link a `main.js` script. Add `type="module"` to your script tag if you want to use `import`/`export` syntax.

```js
// main.js — starter code

const OUTPUT = document.getElementById('output');

async function fetchPost(postId) {
  // Step 1: Show a loading message while the request is in flight
  OUTPUT.textContent = 'Loading...';

  // Step 2: Fetch from this URL:
  // https://jsonplaceholder.typicode.com/posts/${postId}
  // (JSONPlaceholder is a free fake API perfect for practice)

  // Step 3: Check response.ok — if the request failed, throw a descriptive Error

  // Step 4: Parse the JSON body

  // Step 5: Display the post's title and body in OUTPUT using a template literal

  // Step 6: Wrap everything in try/catch and display the error message if something fails
}

// Test your function:
fetchPost(1);   // should display post #1
fetchPost(999); // JSONPlaceholder returns 404 for this — your error handler should catch it
```

**Success check:**
- `fetchPost(1)` shows "Loading..." briefly, then displays the post title and body
- `fetchPost(999)` shows "Loading..." briefly, then shows a user-friendly error message
- The page does not crash or show a blank screen for either call

**Stretch goal:** Add three buttons to the HTML, each calling `fetchPost` with a different ID (1, 5, 10). Make the active post's button highlighted while its data is loading. Use `finally` to ensure the highlight is removed after the request finishes, whether it succeeded or failed.
