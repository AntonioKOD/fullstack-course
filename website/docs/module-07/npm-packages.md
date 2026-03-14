---
sidebar_position: 5
title: npm & Packages
---

# npm & Packages

## package.json Essentials

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "engines": { "node": ">=20" },
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest run",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "express": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "@types/node": "^20.0.0",
    "vitest": "^1.0.0"
  }
}
```

## Essential Packages

```bash
# Runtime
npm install express zod bcryptjs jsonwebtoken dotenv
npm install @prisma/client

# Dev tools
npm install -D typescript tsx vitest
npm install -D @types/node @types/express @types/bcryptjs
npm install -D prisma eslint

# CLI tools
npm install inquirer minimist chalk
npm install -D @types/inquirer @types/minimist
```

## Semantic Versioning

```
1.2.3
   patch — backwards-compatible bug fixes
  minor — backwards-compatible new features
 major — breaking changes

^1.2.3  — allows 1.x.x (minor and patch)
~1.2.3  — allows 1.2.x (patch only)
1.2.3   — exact version only
```

## Security Audit

```bash
npm audit            # list vulnerabilities
npm audit fix        # auto-fix where possible
npm outdated         # show outdated packages
```
