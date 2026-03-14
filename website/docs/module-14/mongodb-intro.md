---
sidebar_position: 2
title: MongoDB Introduction
---

# MongoDB Introduction

MongoDB is a document database — data is stored as JSON-like documents (BSON) instead of rows and columns. It's the right choice when your data is hierarchical, schema-flexible, or when you need to scale horizontally.

## Documents vs Rows

SQL stores data in tables with fixed columns:

```sql
-- SQL
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  author_id INTEGER REFERENCES users(id)
);
```

MongoDB stores documents — nested JSON objects with flexible structure:

```json
{
  "_id": "ObjectId('64a1b2c3...')",
  "title": "Getting Started with MongoDB",
  "author": {
    "name": "Alice",
    "avatar": "https://..."
  },
  "tags": ["mongodb", "nosql", "tutorial"],
  "published": true,
  "createdAt": "2024-01-15T10:00:00Z"
}
```

## Installation and Connection

```bash
npm install mongoose
npm install -D @types/mongoose  # not needed — mongoose ships types
```

```ts
// src/lib/mongoose.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/myapp';

let isConnected = false;

export async function connectDB(): Promise<void> {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}
```

## Defining a Schema

```ts
import { Schema, model, type Document, type Types } from 'mongoose';

// TypeScript interface for the document
interface IUser {
  name: string;
  email: string;
  role: 'user' | 'admin';
  profile: {
    bio?: string;
    website?: string;
  };
  createdAt: Date;
}

// Mongoose document type (includes _id, methods, etc.)
interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profile: {
      bio: String,
      website: String,
    },
  },
  { timestamps: true } // adds createdAt, updatedAt automatically
);

export const User = model<IUserDocument>('User', userSchema);
```

## Basic CRUD

```ts
import { User } from './models/User';

// Create
const user = await User.create({
  name: 'Alice Smith',
  email: 'alice@example.com',
});

// Read
const found = await User.findById('64a1b2c3...');
const byEmail = await User.findOne({ email: 'alice@example.com' });
const allAdmins = await User.find({ role: 'admin' });

// Update
await User.findByIdAndUpdate(
  '64a1b2c3...',
  { $set: { 'profile.bio': 'Software engineer' } },
  { new: true } // return updated document
);

// Delete
await User.findByIdAndDelete('64a1b2c3...');

// Count
const total = await User.countDocuments({ role: 'user' });
```

## Query Operators

```ts
// Comparison
await User.find({ age: { $gte: 18, $lte: 65 } });

// Array contains
await Post.find({ tags: { $in: ['mongodb', 'typescript'] } });

// Text search (requires text index)
await Post.find({ $text: { $search: 'mongodb tutorial' } });

// Field exists
await User.find({ 'profile.website': { $exists: true } });

// Sort, limit, skip (pagination)
await Post.find({ published: true })
  .sort({ createdAt: -1 })
  .limit(10)
  .skip((page - 1) * 10);
```

## Indexes

```ts
// Add to schema definition
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ name: 'text', 'profile.bio': 'text' }); // full-text search
postSchema.index({ createdAt: -1 }); // for sorting by date
postSchema.index({ tags: 1 }); // for querying by tags
```

## Local vs Cloud

| | Local (Docker) | MongoDB Atlas |
|--|----------------|---------------|
| Setup | `docker run -p 27017:27017 mongo` | Create free cluster |
| Cost | Free | Free tier (512MB) |
| Use case | Development | Production / learning |

```yaml
# docker-compose.yml — add MongoDB
services:
  mongodb:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

## Compass — Visual GUI

MongoDB Compass lets you browse documents, run queries, and analyze indexes visually. Download from [mongodb.com/products/compass](https://www.mongodb.com/products/compass).
