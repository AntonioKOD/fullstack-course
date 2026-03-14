---
sidebar_position: 3
title: Schema & Models
---
# Prisma Schema Deep Dive

## Field Types

```prisma
model Product {
  id          String   @id @default(cuid())
  name        String
  price       Decimal  @db.Decimal(10, 2)
  inventory   Int      @default(0)
  description String?
  published   Boolean  @default(false)
  tags        String[]
  metadata    Json?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Enums

```prisma
enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

model Order {
  id     String      @id @default(cuid())
  status OrderStatus @default(PENDING)
}
```

## Indexes

```prisma
model User {
  id    String @id @default(cuid())
  email String @unique
  name  String

  @@index([name])
  @@index([email, name])
}
```
