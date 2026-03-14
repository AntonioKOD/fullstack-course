---
sidebar_position: 2
title: Vite + React Setup
---

# Vite + React Setup

Vite is the modern build tool for React projects. It starts instantly, HMR updates in milliseconds, and the production build is optimized out of the box.

## Creating a React + TypeScript Project

```bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
```

That's it. You're running React 18 + TypeScript + Vite on `http://localhost:5173`.

## Project Structure

```
my-app/
 public/          # static assets (favicon, robots.txt)
 src/
    assets/      # imported assets (images, SVGs)
    components/  # reusable UI components
    hooks/       # custom hooks
    pages/       # page-level components
    lib/         # API client, utilities
    types/       # TypeScript interfaces
    App.tsx
    main.tsx     # entry point
 index.html       # Vite entry HTML
 vite.config.ts
 tsconfig.json
```

## Vite Config

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // use @/components instead of ../../components
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

Update `tsconfig.json` to recognize the alias:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Adding Tailwind CSS

```bash
npm install -D tailwindcss @tailwindcss/vite
```

```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

```css
/* src/index.css */
@import "tailwindcss";
```

```tsx
// src/main.tsx
import './index.css';
```

## Environment Variables

Vite uses `.env` files. Variables must be prefixed with `VITE_` to be exposed to the browser:

```env
# .env.local
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=My App
```

```ts
// Access in your code (fully typed)
const apiUrl = import.meta.env.VITE_API_URL;
```

Type the env vars:

```ts
// src/vite-env.d.ts (extend the existing file)
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}
```

## Dev vs Production

```bash
npm run dev      # development server with HMR
npm run build    # TypeScript check + production build
npm run preview  # preview the production build locally
```

The `dist/` folder is your deployable output — static HTML, CSS, and JS.

## VS Code Setup

Recommended extensions for React development:

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag"
  ]
}
```

## ESLint Configuration

```bash
npm install -D eslint @eslint/js typescript-eslint eslint-plugin-react-hooks
```

```ts
// eslint.config.ts
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'error',
    },
  }
);
```
