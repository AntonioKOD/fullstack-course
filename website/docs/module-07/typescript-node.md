---
sidebar_position: 3
title: TypeScript in Node.js
---

# TypeScript in Node.js

## Project Setup

```bash
mkdir my-cli && cd my-cli
npm init -y
npm install -D typescript @types/node tsx
npx tsc --init
```

Minimal `tsconfig.json` for Node.js:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

```json title="package.json"
{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

## Running TypeScript Directly

`tsx` compiles and runs TypeScript with zero config — perfect for development:

```bash
# Run once
npx tsx src/index.ts

# Watch mode — re-runs on save
npx tsx watch src/index.ts

# Pass arguments
npx tsx src/index.ts --name Alice --age 28
```

## Environment Variables

Never hardcode secrets. Use `.env` files:

```bash
npm install dotenv
```

```bash title=".env"
DATABASE_URL=postgresql://user:pass@localhost:5432/mydb
PORT=3000
JWT_SECRET=supersecret
NODE_ENV=development
```

```ts title="src/env.ts"
import 'dotenv/config';

// Validate required env vars at startup
function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

export const env = {
  DATABASE_URL: requireEnv('DATABASE_URL'),
  PORT: parseInt(process.env['PORT'] ?? '3000', 10),
  JWT_SECRET: requireEnv('JWT_SECRET'),
  NODE_ENV: (process.env['NODE_ENV'] ?? 'development') as 'development' | 'production' | 'test',
  isDev: process.env['NODE_ENV'] !== 'production',
};
```

```ts title="src/index.ts"
import { env } from './env.js';  // .js extension required with NodeNext

console.log(`Starting on port ${env.PORT}`);
```

## process Object

```ts
// Arguments: node script.ts arg1 arg2
const args = process.argv.slice(2);  // remove 'node' and script path

// Environment
process.env['NODE_ENV'];
process.env['PATH'];

// Exit
process.exit(0);   // success
process.exit(1);   // failure

// Current directory
process.cwd();     // /Users/you/my-project

// Platform
process.platform;  // 'darwin', 'linux', 'win32'

// Events
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});
```

## Parsing CLI Arguments with minimist

```bash
npm install minimist
npm install -D @types/minimist
```

```ts
import minimist from 'minimist';

const args = minimist(process.argv.slice(2), {
  string: ['name', 'output'],
  boolean: ['verbose', 'help'],
  alias: { n: 'name', o: 'output', v: 'verbose', h: 'help' },
  default: { output: './README.md' },
});

if (args['help']) {
  console.log(`
Usage: gen-readme [options]

Options:
  -n, --name     Project name
  -o, --output   Output file (default: ./README.md)
  -v, --verbose  Verbose output
  -h, --help     Show help
  `);
  process.exit(0);
}

console.log(`Generating README for: ${args['name']}`);
```
