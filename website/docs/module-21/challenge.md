---
sidebar_position: 5
title: Challenge — CI/CD Pipeline
---

# Challenge — CI/CD Pipeline

## Objective

Set up a complete CI/CD pipeline for a full-stack app using **GitHub Actions** — automated testing on every push, Docker builds, and deployment to Railway and Vercel.

## Requirements

### CI Pipeline (40 points)

Create `.github/workflows/ci.yml` that runs on every push and PR:

- [ ] Checkout code and set up Node.js 20
- [ ] Install dependencies with `npm ci`
- [ ] Run TypeScript type check (`tsc --noEmit`)
- [ ] Run linter (`npm run lint`)
- [ ] Run tests with Vitest
- [ ] Start a PostgreSQL service container for integration tests
- [ ] Upload test coverage to Codecov (or just collect it)
- [ ] Build the app to verify it compiles

### CD Pipeline (40 points)

Create `.github/workflows/deploy.yml` that runs on push to `main`:

- [ ] Run CI checks first (use `needs:`)
- [ ] Build and push Docker image to GitHub Container Registry (ghcr.io)
- [ ] Deploy to Railway (API)
- [ ] Deploy to Vercel (frontend)
- [ ] Post deployment status to a Slack channel (or just log it)

### Environment Variables (20 points)

- [ ] All secrets in GitHub Secrets (not hardcoded)
- [ ] `env.ts` with Zod validation in the Node.js app
- [ ] `.env.example` with all required variables documented
- [ ] Different values for `test`, `staging`, and `production`

## CI Workflow Template

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Type check
        run: npm run type-check

      - name: Lint
        run: npm run lint

      - name: Run tests
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/testdb
          JWT_SECRET: test-secret-that-is-at-least-32-characters-long
        run: |
          npx prisma migrate deploy
          npm test -- --coverage

      - name: Build
        run: npm run build
```

## CD Workflow Template

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    name: Deploy API
    runs-on: ubuntu-latest
    needs: [test]  # from ci.yml

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: api
```

## Grading

| Criteria | Points |
|----------|--------|
| CI workflow runs on push/PR | 10 |
| TypeScript type check in CI | 10 |
| Tests run with PostgreSQL service | 15 |
| Build succeeds in CI | 5 |
| CD runs after CI passes | 10 |
| Docker image built and pushed | 15 |
| Railway deployment configured | 10 |
| Vercel deployment configured | 10 |
| Secrets in GitHub, not code | 10 |
| `.env.example` documented | 5 |
| **Total** | **100** |

## Bonus

- Semantic versioning with `semantic-release`
- Slack/Discord notifications on deploy
- E2E tests with Playwright in CI
- Staging environment that deploys on PR
- Dependabot for automatic dependency updates
