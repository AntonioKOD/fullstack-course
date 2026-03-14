---
sidebar_position: 1
title: Docker for Node.js APIs
---

# Docker for Node.js APIs

Docker packages your application and all its dependencies into a container — it runs the same everywhere.

## Dockerfile for a Node.js API

```dockerfile title="Dockerfile"
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production image (smaller, no devDependencies)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## .dockerignore

```dockerignore
node_modules
dist
.env
.env.local
*.log
.git
README.md
```

## docker-compose for Local Development

```yaml title="docker-compose.yml"
services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      DATABASE_URL: postgresql://postgres:password@db:5432/myapp
      JWT_SECRET: devsecret
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./src:/app/src  # hot reload in dev

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: myapp
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

```bash
# Start all services
docker compose up

# Run in background
docker compose up -d

# View logs
docker compose logs -f api

# Stop
docker compose down

# Stop and remove volumes (wipes database)
docker compose down -v
```

## Deploying to Railway with Docker

Railway auto-detects your `Dockerfile` and builds it:

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init` (in your project)
4. Add environment variables: `railway variables set JWT_SECRET=secret`
5. Deploy: `railway up`

Or connect your GitHub repo for automatic deploys on push.
