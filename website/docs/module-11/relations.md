---
sidebar_position: 5
title: Relations
---
# Prisma Relations

## One-to-Many

```prisma
model User {
  id    String @id @default(cuid())
  posts Post[]
}

model Post {
  id       String @id @default(cuid())
  authorId String
  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

## Many-to-Many (implicit)

```prisma
model Post {
  id   String @id @default(cuid())
  tags Tag[]
}

model Tag {
  id    String @id @default(cuid())
  posts Post[]
}
// Prisma auto-creates the junction table
```

## Many-to-Many (explicit — when you need extra fields)

```prisma
model User  { id String @id; follows Following[] @relation("follower"); followers Following[] @relation("following") }
model Following {
  followerId  String; follower  User @relation("follower",  fields: [followerId],  references: [id])
  followingId String; following User @relation("following", fields: [followingId], references: [id])
  createdAt   DateTime @default(now())
  @@id([followerId, followingId])
}
```
