---
sidebar_position: 6
title: Challenge — Production Deployment
---

# Challenge — Production Deployment

## Objective

Deploy a full-stack app to production: **NestJS API on Railway**, **Next.js frontend on Vercel**, **PostgreSQL on Supabase** — with monitoring, CI/CD, and Docker.

## Requirements

### Infrastructure (50 points)

- [ ] Supabase project created with production database
- [ ] Prisma schema migrated to Supabase (`migrate deploy`)
- [ ] NestJS API deployed to Railway via Docker
- [ ] Next.js frontend deployed to Vercel
- [ ] Frontend can make requests to the Railway API (CORS configured)
- [ ] Both services using Supabase as their database

### Quality (30 points)

- [ ] Environment variables set in Railway and Vercel dashboards (not in code)
- [ ] `env.ts` Zod validation — app crashes on startup if vars missing
- [ ] Health check endpoint at `GET /health` returning `{ status: 'ok' }`
- [ ] Railway health check configured pointing to `/health`
- [ ] Uptime monitor watching the health endpoint

### Monitoring (20 points)

- [ ] Sentry configured for both frontend and backend
- [ ] Structured logging with Pino (or NestJS Logger) in the API
- [ ] Vercel Analytics on the frontend
- [ ] Demonstrate: trigger an error, verify it appears in Sentry

## Deployment Architecture

```
         Users
           |
    +------+------+
    |             |
Vercel (CDN)  Railway API
Next.js App   NestJS + Docker
vercel.app    railway.app
                  |
             Supabase
             PostgreSQL
```

## Grading

| Criteria | Points |
|----------|--------|
| Supabase database live with migrations | 10 |
| NestJS live on Railway (accessible URL) | 15 |
| Next.js live on Vercel (accessible URL) | 15 |
| API responding to requests from frontend | 10 |
| Health check endpoint working | 5 |
| Env vars in platform dashboards | 10 |
| Zod env validation | 5 |
| Sentry configured (both ends) | 10 |
| Uptime monitor active | 5 |
| CI/CD triggers on push to main | 15 |
| **Total** | **100** |

## Submission

Submit:
1. Frontend URL (Vercel)
2. API URL (Railway)
3. Screenshot of Railway dashboard showing your service running
4. Screenshot of Vercel dashboard showing your deployment
5. Screenshot of Sentry showing at least one event captured
6. Link to your GitHub repo with CI/CD workflows

## Bonus

- Blue/green deployments (zero downtime)
- Separate staging environment (auto-deploy on PR)
- Database read replica on Supabase
- CDN for static assets (Cloudflare R2)
- Custom domain with SSL for both services
