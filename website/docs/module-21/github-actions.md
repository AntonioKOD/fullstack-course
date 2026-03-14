---
sidebar_position: 2
title: GitHub Actions
---

# GitHub Actions

GitHub Actions is a CI/CD platform built into GitHub. Workflows are defined in YAML files inside `.github/workflows/`.

## CI Workflow — Run on Every Push/PR

```yaml title=".github/workflows/ci.yml"
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  check:
    name: Type Check & Lint
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

  test:
    name: Tests
    runs-on: ubuntu-latest
    needs: check

    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: password
          POSTGRES_DB: testdb
        ports: ['5432:5432']
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    env:
      DATABASE_URL: postgresql://postgres:password@localhost:5432/testdb
      JWT_SECRET: test-secret

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: Run migrations
        run: npx prisma migrate deploy

      - name: Run tests
        run: npm test
```

## CD Workflow — Deploy on Merge to Main

```yaml title=".github/workflows/deploy.yml"
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-api:
    name: Deploy API to Railway
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: my-api

  deploy-web:
    name: Deploy Frontend to Vercel
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Adding Secrets to GitHub

1. Go to your repo → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add: `RAILWAY_TOKEN`, `VERCEL_TOKEN`, etc.

Never hardcode secrets in workflow files.

## Branch Protection Rules

Enforce CI passing before merging:

1. **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Check: **Require status checks to pass before merging**
4. Select your CI job names
5. Check: **Require branches to be up to date**

Now no one (including you) can merge broken code to main.
