---
sidebar_position: 6
title: tsconfig.json
---

# tsconfig.json

The `tsconfig.json` file controls how TypeScript compiles your code. Most projects inherit from a base config and only override what they need.

## Recommended Config for Node.js Projects

```json title="tsconfig.json"
{
  "compilerOptions": {
    /* Language */
    "target": "ES2022",            // JS version to compile to
    "lib": ["ES2022"],             // type definitions to include
    "module": "NodeNext",          // module system (ESM for modern Node)
    "moduleResolution": "NodeNext",

    /* Output */
    "outDir": "./dist",            // compiled output directory
    "rootDir": "./src",            // source files directory
    "declaration": true,           // generate .d.ts files
    "declarationMap": true,        // source maps for .d.ts
    "sourceMap": true,             // source maps for debugging

    /* Strictness — turn ALL of these on */
    "strict": true,                // enables all strict checks below
    "noUncheckedIndexedAccess": true, // arr[0] is T | undefined
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,

    /* Module resolution */
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "forceConsistentCasingInFileNames": true,

    /* Paths (optional — for cleaner imports) */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Recommended Config for React/Vite Projects

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],  // include DOM types
    "module": "ESNext",
    "moduleResolution": "Bundler",             // Vite handles resolution

    "jsx": "react-jsx",                        // React 17+ JSX transform
    "jsxImportSource": "react",

    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,

    "esModuleInterop": true,
    "resolveJsonModule": true,
    "isolatedModules": true,                   // required for Vite
    "skipLibCheck": true,                      // skip .d.ts file checks (faster)

    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## Recommended Config for Next.js

```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,                            // Next.js handles compilation
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",                         // Next.js transforms JSX
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

## Key Options Explained

| Option | What It Does |
|--------|-------------|
| `strict: true` | Enables `strictNullChecks`, `noImplicitAny`, and 6 other checks |
| `strictNullChecks` | `null` and `undefined` are distinct types (prevents most null errors) |
| `noImplicitAny` | Forbids implicit `any` — forces you to annotate |
| `noUncheckedIndexedAccess` | `arr[0]` returns `T \| undefined` — safer array access |
| `target` | What JS version to emit |
| `module` | What module syntax to emit |
| `skipLibCheck` | Skips type-checking of `.d.ts` files — speeds up builds |

:::tip Always enable `strict: true`
It enables multiple checks that prevent the most common TypeScript bugs. Never turn it off.
:::

## Path Aliases

Configure `@/` to point to `src/` for cleaner imports:

```ts
// Without path alias
import { formatDate } from '../../../utils/format';

// With @/* alias
import { formatDate } from '@/utils/format';
```

Vite also needs the alias configured:

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```
