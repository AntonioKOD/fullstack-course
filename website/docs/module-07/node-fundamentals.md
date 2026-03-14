---
sidebar_position: 2
title: Node.js Fundamentals
---

# Node.js Fundamentals

## What Makes Node.js Different

Node.js is built on Chrome's V8 engine with a non-blocking I/O model. One Node.js process can handle thousands of concurrent connections because it doesn't block while waiting for I/O.

```ts
import { readFile } from 'fs/promises';
import { createServer } from 'http';

// Non-blocking — handles requests while files load
const server = createServer(async (req, res) => {
  if (req.url === '/') {
    const html = await readFile('./index.html', 'utf-8');
    res.end(html);
  }
});

server.listen(3000, () => console.log('Server running'));
```

## Built-In Modules

```ts
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createHash } from 'crypto';
import { gzip } from 'zlib/promises';
import os from 'os';

// OS info
os.cpus().length;       // number of CPU cores
os.totalmem();          // total RAM in bytes
os.homedir();           // /Users/alice
os.platform();          // darwin, linux, win32

// Crypto
const hash = createHash('sha256').update('password').digest('hex');
const uuid = crypto.randomUUID(); // built-in since Node 14.17

// __dirname in ESM
const __dirname = dirname(fileURLToPath(import.meta.url));
```

## Node.js Version Management

Always use a `.nvmrc` or `.node-version` file:

```bash title=".nvmrc"
20.11.0
```

```bash
nvm use          # uses version from .nvmrc
nvm install      # installs if needed
```
