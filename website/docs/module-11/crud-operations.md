---
sidebar_position: 4
title: CRUD Operations
---

# CRUD Operations with Prisma

## Create

```ts
// Create a single record
const user = await prisma.user.create({
  data: {
    name: 'Alice',
    email: 'alice@example.com',
    password: await bcrypt.hash('password', 12),
  },
});

// Create with nested relation
const post = await prisma.post.create({
  data: {
    title: 'Hello World',
    content: 'My first post',
    author: {
      connect: { id: userId },  // link to existing user
    },
    tags: {
      connectOrCreate: [
        { where: { name: 'javascript' }, create: { name: 'javascript' } },
        { where: { name: 'typescript' }, create: { name: 'typescript' } },
      ],
    },
  },
  include: { author: true, tags: true },  // return relations
});

// Create many
await prisma.tag.createMany({
  data: [{ name: 'js' }, { name: 'ts' }, { name: 'react' }],
  skipDuplicates: true,
});
```

## Read

```ts
// Find by unique field
const user = await prisma.user.findUnique({
  where: { id: '123' },
});
// user is User | null

// Find by unique — throws if not found
const user = await prisma.user.findUniqueOrThrow({
  where: { email: 'alice@example.com' },
});

// Find first match
const user = await prisma.user.findFirst({
  where: { role: 'ADMIN', isActive: true },
  orderBy: { createdAt: 'desc' },
});

// Find many with filters
const posts = await prisma.post.findMany({
  where: {
    published: true,
    author: {
      role: 'ADMIN',
    },
    title: {
      contains: 'typescript',
      mode: 'insensitive',  // case-insensitive
    },
    createdAt: {
      gte: new Date('2024-01-01'),  // greater than or equal
    },
  },
  include: {
    author: {
      select: { id: true, name: true, avatar: true },  // only these fields
    },
    tags: true,
  },
  orderBy: [
    { published: 'desc' },
    { createdAt: 'desc' },
  ],
  skip: (page - 1) * limit,
  take: limit,
});

// Count
const count = await prisma.post.count({
  where: { published: true },
});

// Pagination with total count
const [posts, total] = await prisma.$transaction([
  prisma.post.findMany({
    skip: (page - 1) * limit,
    take: limit,
    where: filter,
  }),
  prisma.post.count({ where: filter }),
]);
```

## Update

```ts
// Update by unique field
const user = await prisma.user.update({
  where: { id: '123' },
  data: {
    name: 'Alice Smith',
    updatedAt: new Date(),
  },
});

// Upsert — create if not exists, update if exists
const profile = await prisma.profile.upsert({
  where: { userId: user.id },
  create: {
    userId: user.id,
    bio: 'New bio',
  },
  update: {
    bio: 'Updated bio',
  },
});

// Update many
const { count } = await prisma.post.updateMany({
  where: { authorId: userId },
  data: { published: false },
});
```

## Delete

```ts
// Delete single
await prisma.user.delete({
  where: { id: '123' },
});

// Delete many
const { count } = await prisma.post.deleteMany({
  where: {
    published: false,
    createdAt: { lt: new Date('2024-01-01') },
  },
});
```

## Transactions

```ts
// Sequential transactions
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData }),
]);

// Interactive transaction (use for complex logic)
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({
    where: { id: userId },
    data: { balance: { decrement: amount } },
  });

  if (user.balance < 0) {
    throw new Error('Insufficient funds');  // rolls back
  }

  const payment = await tx.payment.create({
    data: { userId, amount },
  });

  return payment;
});
```

## Raw Queries (when you need them)

```ts
// Raw query — returns unknown[], needs type assertion
const users = await prisma.$queryRaw<User[]>`
  SELECT * FROM users
  WHERE role = ${role}
  AND created_at > ${since}
`;

// Raw execute (INSERT, UPDATE, DELETE)
const { count } = await prisma.$executeRaw`
  UPDATE users
  SET last_login = NOW()
  WHERE id = ${userId}
`;
```
