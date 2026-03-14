---
sidebar_position: 4
title: File System
---

# File System

Node's built-in `fs` module lets you read, write, and manipulate files. Always use the `promises` API (async) over the callback or sync versions.

## Reading Files

```ts
import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

// Read a file as string
const content = await readFile('./README.md', 'utf-8');

// Read as Buffer (for binary files)
const buffer = await readFile('./image.png');

// Read JSON file
async function readJson<T>(filePath: string): Promise<T> {
  const content = await readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

const config = await readJson<AppConfig>('./config.json');

// List directory contents
const files = await readdir('./src');
// ['index.ts', 'utils.ts', 'types.ts']

// File metadata
const info = await stat('./package.json');
info.size;          // bytes
info.isFile();      // true
info.isDirectory(); // false
info.mtime;         // last modified Date
```

## Writing Files

```ts
import { writeFile, appendFile, mkdir } from 'fs/promises';

// Write (creates or overwrites)
await writeFile('./output.txt', 'Hello World', 'utf-8');

// Write JSON
async function writeJson(filePath: string, data: unknown): Promise<void> {
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// Append
await appendFile('./log.txt', `${new Date().toISOString()} - Event occurred\n`);

// Create directories
await mkdir('./src/utils', { recursive: true }); // like mkdir -p
```

## Path Utilities

```ts
import { join, resolve, dirname, basename, extname, parse } from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Join paths safely (handles OS-specific separators)
const filePath = join(__dirname, 'data', 'users.json');
// '/Users/me/project/data/users.json'

// Resolve to absolute path
const abs = resolve('./src/index.ts');

// Get parts of a path
basename('/path/to/file.ts');       // 'file.ts'
basename('/path/to/file.ts', '.ts'); // 'file'
extname('/path/to/file.ts');         // '.ts'
dirname('/path/to/file.ts');         // '/path/to'

parse('/path/to/file.ts');
// { root: '/', dir: '/path/to', base: 'file.ts', ext: '.ts', name: 'file' }
```

## Checking if File Exists

```ts
import { access } from 'fs/promises';
import { constants } from 'fs';

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

if (await exists('./data.json')) {
  const data = await readJson('./data.json');
}
```

## Walking a Directory (Recursive)

```ts
import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function* walkDir(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const info = await stat(fullPath);

    if (info.isDirectory()) {
      yield* walkDir(fullPath); // recurse
    } else {
      yield fullPath;
    }
  }
}

// List all .ts files
for await (const file of walkDir('./src')) {
  if (file.endsWith('.ts')) console.log(file);
}
```

## A Simple JSON Database

For small CLI tools, you can use a JSON file as a lightweight database:

```ts title="src/db.ts"
import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, '..', 'data', 'db.json');

interface Database {
  users: User[];
  posts: Post[];
}

async function readDb(): Promise<Database> {
  try {
    const content = await readFile(DB_PATH, 'utf-8');
    return JSON.parse(content) as Database;
  } catch {
    return { users: [], posts: [] };
  }
}

async function writeDb(data: Database): Promise<void> {
  await writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
  const db = await readDb();
  const newUser: User = { ...user, id: crypto.randomUUID() };
  db.users.push(newUser);
  await writeDb(db);
  return newUser;
}

export async function getUsers(): Promise<User[]> {
  const db = await readDb();
  return db.users;
}
```
