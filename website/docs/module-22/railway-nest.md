---
sidebar_position: 3
title: Deploying NestJS to Railway
---

# Deploying NestJS to Railway

Railway is a PaaS (Platform as a Service) that makes deploying Node.js APIs straightforward. It supports Docker, managed databases, and automatic deployments from GitHub.

## Why Railway for APIs

- Zero-config if your app has a `Dockerfile` or is a standard Node.js app
- Managed PostgreSQL (same region as your app)
- Environment variable management
- Automatic deploys on git push
- Free tier available (hobby projects)

## Preparing Your NestJS App

### Health Check Endpoint

Railway checks if your app is healthy:

```ts
// src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
```

### Production Port

Railway injects `PORT` as an environment variable:

```ts
// src/main.ts
const port = process.env.PORT ?? 3000;
await app.listen(port, '0.0.0.0'); // bind to all interfaces
console.log(`Application running on port ${port}`);
```

### Dockerfile

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
RUN npx prisma generate
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Start Script

```json
// package.json
{
  "scripts": {
    "start:prod": "node dist/main.js",
    "build": "nest build"
  }
}
```

## Deploying to Railway

### Option A: From GitHub

1. Go to [railway.app](https://railway.app) → New Project
2. Deploy from GitHub repo
3. Railway auto-detects Node.js and runs `npm install && npm run build && npm run start:prod`

### Option B: Railway CLI

```bash
npm install -g @railway/cli
railway login
railway init       # creates a new project
railway up         # deploy current directory
```

## Environment Variables

In Railway dashboard → Service → Variables:

```
DATABASE_URL=postgresql://...  # auto-set if you add Railway PostgreSQL
JWT_SECRET=your-production-secret
NODE_ENV=production
```

Or via CLI:

```bash
railway variables set JWT_SECRET=secret
railway variables set NODE_ENV=production
```

## Database (Railway PostgreSQL)

Add a database to your project:
1. Dashboard → New → Database → PostgreSQL
2. Railway auto-injects `DATABASE_URL` into your service

Run migrations on deploy:

```json
// package.json
{
  "scripts": {
    "start:prod": "npx prisma migrate deploy && node dist/main.js"
  }
}
```

Or as a separate Railway process (more reliable):

```bash
# Railway Start Command (in service settings)
npx prisma migrate deploy && node dist/main.js
```

## Custom Domain

1. Service → Settings → Domains → Add Domain
2. Update DNS: CNAME → `yourservice.up.railway.app`
3. SSL is automatic

## GitHub Actions + Railway

```yaml
# .github/workflows/deploy.yml
- name: Deploy to Railway
  env:
    RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
  run: |
    npm install -g @railway/cli
    railway up --service api
```

Get your `RAILWAY_TOKEN` from: Railway Dashboard → Account Settings → Tokens.

## Monitoring

Railway provides:
- **Metrics** — CPU, memory, network usage
- **Logs** — real-time, searchable (last 7 days on free tier)
- **Deployments** — history with rollback

```bash
# View logs via CLI
railway logs --tail
```

## Scaling

```bash
# Scale up (more CPU/RAM) in Railway dashboard
# Service → Settings → Resources

# Scale out (multiple instances) — Pro plan
# Service → Settings → Replicas
```

For most apps, Railway's default 512MB RAM / 0.5 vCPU is sufficient at launch.
