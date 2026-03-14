---
sidebar_position: 4
title: Environment Variables
---

# Environment Variables & Secrets Management

Hard-coding secrets is one of the most common security mistakes. Proper secrets management keeps credentials out of your codebase and makes deployments configurable.

## The Golden Rules

1. **Never commit secrets** — API keys, database URLs, JWT secrets
2. **Use `.env` files locally** — git-ignored by default
3. **Use platform secrets in production** — Railway, Vercel, GitHub Actions all have secret stores
4. **Validate on startup** — fail fast if required vars are missing

## Local Development

```bash
# .env.example — committed, shows required vars (no real values)
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
JWT_SECRET=your-secret-here
REDIS_URL=redis://localhost:6379
SENDGRID_API_KEY=your-sendgrid-key

# .env.local — git-ignored, real values
DATABASE_URL=postgresql://admin:mypassword@localhost:5432/myapp_dev
JWT_SECRET=dev-secret-change-in-production-abcdef1234567890
REDIS_URL=redis://localhost:6379
SENDGRID_API_KEY=SG.xxxx
```

```bash
# .gitignore
.env
.env.local
.env.*.local
```

## Validation with Zod

Validate environment variables at startup — crash early with a clear error message rather than mysterious runtime failures:

```ts
// src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url(),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_SECRET: z.string().min(32),

  // App
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3000),

  // Optional services
  REDIS_URL: z.string().url().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().url().optional(),
});

function validateEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error(' Invalid environment variables:');
    console.error(result.error.flatten().fieldErrors);
    process.exit(1);
  }
  return result.data;
}

export const env = validateEnv();
// env.DATABASE_URL, env.PORT etc. are now fully typed
```

```ts
// src/index.ts — call at startup
import { env } from './config/env';
// env is already validated and typed
```

## GitHub Actions Secrets

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      DATABASE_URL: ${{ secrets.DATABASE_URL }}
      JWT_SECRET: ${{ secrets.JWT_SECRET }}
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
```

Set secrets in: GitHub repo → Settings → Secrets and variables → Actions.

## Railway Environment Variables

In Railway dashboard:
1. Select your service
2. Variables tab → Add Variable
3. These are injected at runtime — never in the Docker image

```bash
# Railway CLI
railway variables set JWT_SECRET=your-production-secret
railway variables set DATABASE_URL=postgresql://...
```

## Vercel Environment Variables

```bash
# Vercel CLI
vercel env add JWT_SECRET production

# Or in dashboard: Project → Settings → Environment Variables
```

Vercel has three environments: Development, Preview, Production.

## Multiple Environments

```
.env.development  — local dev defaults
.env.test         — test database, mocked services
.env.production   — validated at build time (no secrets)
.env.local        — overrides for your machine (git-ignored)
```

Loading priority (higher wins):
1. `.env.local`
2. `.env.{NODE_ENV}.local`
3. `.env.{NODE_ENV}`
4. `.env`

## What NOT to Put in Environment Variables

- Large configuration (use config files)
- Frequently changing data (use database)
- Data per user (use database)
- Feature flags (use a feature flag service)

## Rotating Secrets

When a secret is compromised:
1. Generate a new secret immediately
2. Update in all platform secret stores
3. Redeploy (doesn't require code change)
4. Invalidate all existing sessions if it was an auth secret
5. Audit logs for suspicious activity
