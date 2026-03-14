---
sidebar_position: 3
title: CRUD & Aggregations
---

# CRUD & Aggregations

Beyond basic find/create/update/delete, MongoDB's aggregation pipeline is its most powerful feature — letting you transform, group, and analyze data server-side.

## Advanced CRUD Patterns

### Upsert

Insert if not found, update if found:

```ts
await User.findOneAndUpdate(
  { email: 'alice@example.com' },
  { $setOnInsert: { name: 'Alice', role: 'user' } },
  { upsert: true, new: true }
);
```

### Bulk Operations

```ts
await User.bulkWrite([
  { insertOne: { document: { name: 'Bob', email: 'bob@example.com' } } },
  { updateOne: { filter: { email: 'alice@example.com' }, update: { $set: { role: 'admin' } } } },
  { deleteOne: { filter: { email: 'old@example.com' } } },
]);
```

### Atomic Updates with Operators

```ts
// Increment a counter
await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

// Add to array without duplicates
await Post.findByIdAndUpdate(id, { $addToSet: { tags: 'featured' } });

// Remove from array
await Post.findByIdAndUpdate(id, { $pull: { tags: 'draft' } });

// Push to array (allows duplicates)
await Post.findByIdAndUpdate(id, { $push: { comments: newComment } });
```

## Aggregation Pipeline

The aggregation pipeline is a sequence of stages that transform documents. Each stage outputs documents to the next.

```ts
// Most common stages:
// $match — filter (like find)
// $group — group by field, compute aggregates
// $project — reshape documents
// $sort — sort
// $limit / $skip — pagination
// $lookup — join with another collection
// $unwind — flatten array fields
```

### Example: Post Analytics

```ts
const stats = await Post.aggregate([
  // Stage 1: only published posts in the last 30 days
  {
    $match: {
      published: true,
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
  },
  // Stage 2: group by author, count posts and sum views
  {
    $group: {
      _id: '$authorId',
      postCount: { $sum: 1 },
      totalViews: { $sum: '$views' },
      avgViews: { $avg: '$views' },
    },
  },
  // Stage 3: sort by total views descending
  { $sort: { totalViews: -1 } },
  // Stage 4: top 10 authors
  { $limit: 10 },
  // Stage 5: join with users collection
  {
    $lookup: {
      from: 'users',
      localField: '_id',
      foreignField: '_id',
      as: 'author',
    },
  },
  // Stage 6: unwind the joined array
  { $unwind: '$author' },
  // Stage 7: reshape output
  {
    $project: {
      _id: 0,
      authorName: '$author.name',
      postCount: 1,
      totalViews: 1,
      avgViews: { $round: ['$avgViews', 0] },
    },
  },
]);
```

### Faceted Search (multiple aggregations in one query)

```ts
const results = await Product.aggregate([
  { $match: { category: 'electronics' } },
  {
    $facet: {
      // Total count
      total: [{ $count: 'count' }],
      // Price range buckets
      priceRanges: [
        {
          $bucket: {
            groupBy: '$price',
            boundaries: [0, 50, 100, 250, 500, 1000],
            default: '1000+',
            output: { count: { $sum: 1 } },
          },
        },
      ],
      // Top brands
      brands: [
        { $group: { _id: '$brand', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
      ],
      // Paginated items
      items: [
        { $sort: { rating: -1 } },
        { $skip: 0 },
        { $limit: 20 },
        { $project: { name: 1, price: 1, rating: 1, _id: 1 } },
      ],
    },
  },
]);
```

## Typed Aggregations with Mongoose

```ts
interface PostStats {
  authorName: string;
  postCount: number;
  totalViews: number;
  avgViews: number;
}

const stats = await Post.aggregate<PostStats>([
  /* pipeline */
]);

// stats is PostStats[]
```

## Transactions

For operations that must succeed or fail together:

```ts
import mongoose from 'mongoose';

async function transferCredits(fromId: string, toId: string, amount: number) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await User.findByIdAndUpdate(
      fromId,
      { $inc: { credits: -amount } },
      { session }
    );
    await User.findByIdAndUpdate(
      toId,
      { $inc: { credits: amount } },
      { session }
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
}
```

> Transactions require a replica set. In development, run MongoDB with `--replSet rs0` or use Atlas.

## Virtual Fields

Computed properties that aren't stored in the database:

```ts
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Include virtuals in JSON output
userSchema.set('toJSON', { virtuals: true });
```
