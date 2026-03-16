# Project 02 — API (Starter)

Express 5 + TypeScript + Prisma 7 + Zod. Add JWT auth, more models, and your routes.

## Setup

```bash
npm install
cp .env.example .env   # Set DATABASE_URL and JWT_SECRET
npx prisma generate    # Generates client to generated/prisma (required in v7)
npx prisma db push     # or: npm run db:migrate
npx prisma db seed     # or: npm run seed
npm run dev
```

API runs at http://localhost:3000. Uses Prisma 7 with the `pg` driver adapter; connection is configured in `prisma.config.ts`.
