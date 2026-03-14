---
sidebar_position: 7
title: Challenge — E-Commerce Backend
---
# Challenge — E-Commerce Backend

Build a REST API for a simple store with Categories, Products, and Tags.

## Models

```prisma
model Category { id String @id; name String @unique; products Product[] }
model Tag       { id String @id; name String @unique; products Product[] }
model Product   {
  id         String   @id @default(cuid())
  name       String
  price      Decimal  @db.Decimal(10, 2)
  stock      Int      @default(0)
  categoryId String
  category   Category @relation(fields: [categoryId], references: [id])
  tags       Tag[]
  createdAt  DateTime @default(now())
}
```

## Endpoints
- `GET/POST /api/categories`
- `GET/PATCH/DELETE /api/categories/:id`
- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
- `GET/POST /api/tags`

## Requirements
- Prisma + PostgreSQL
- Zod validation
- Returns 404 for missing resources
- Walkthrough video required
