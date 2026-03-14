---
sidebar_position: 3
title: Mongoose Schemas
---

# Mongoose Schemas with TypeScript

## Setup

```bash
npm install mongoose
```

## Defining a Schema

```ts title="src/models/User.ts"
import mongoose, { Schema, Document, Model } from 'mongoose';

// TypeScript interface for the document
export interface IUser {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  bio?: string;
  avatar?: string;
  friends: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Interface for document methods
interface IUserMethods {
  fullInfo(): string;
  friendCount(): number;
}

// Interface for static model methods
interface UserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<(Document<unknown, {}, IUser> & IUser) | null>;
}

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,  // exclude from queries by default
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    bio: String,
    avatar: String,
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,  // auto-add createdAt and updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property — computed, not stored in DB
userSchema.virtual('friendCount').get(function (this: IUser) {
  return this.friends.length;
});

// Instance method
userSchema.methods.fullInfo = function (this: IUser) {
  return `${this.name} <${this.email}>`;
};

// Static method
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

// Pre-save hook — hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const bcrypt = await import('bcryptjs');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User = mongoose.model<IUser, UserModel>('User', userSchema);
```

## Subdocuments

```ts title="src/models/Post.ts"
import mongoose, { Schema } from 'mongoose';

// Subdocument schema (embedded, not its own collection)
const reactionSchema = new Schema({
  reactionBody: {
    type: String,
    required: true,
    maxlength: 280,
  },
  username: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    get: (v: Date) => v.toISOString(),
  },
});

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reactions: [reactionSchema],  // embedded subdocuments
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true, getters: true },
  }
);

// Virtual — reaction count
postSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

export const Post = mongoose.model('Post', postSchema);
```

## Connecting to MongoDB

```ts title="src/lib/db.ts"
import mongoose from 'mongoose';
import { env } from '../env.js';

export async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected');
});
```
