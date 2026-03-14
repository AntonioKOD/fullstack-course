---
sidebar_position: 4
title: Design Patterns
---
# Common Design Patterns

## Factory Pattern

Create objects without specifying exact class:

```ts
type NotificationType = 'email' | 'sms' | 'push';

interface Notification {
  send(to: string, message: string): Promise<void>;
}

class EmailNotification implements Notification {
  async send(to: string, message: string) {
    console.log(`Email to ${to}: ${message}`);
  }
}

class SmsNotification implements Notification {
  async send(to: string, message: string) {
    console.log(`SMS to ${to}: ${message}`);
  }
}

function createNotification(type: NotificationType): Notification {
  switch (type) {
    case 'email': return new EmailNotification();
    case 'sms':   return new SmsNotification();
    default: throw new Error(`Unknown type: ${type}`);
  }
}

const notifier = createNotification('email');
await notifier.send('alice@example.com', 'Hello!');
```

## Repository Pattern

Abstract data access:

```ts
interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserInput): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  findById(id: string) { return this.prisma.user.findUnique({ where: { id } }); }
  findByEmail(email: string) { return this.prisma.user.findUnique({ where: { email } }); }
  create(data: CreateUserInput) { return this.prisma.user.create({ data }); }
  update(id: string, data: Partial<User>) { return this.prisma.user.update({ where: { id }, data }); }
  async delete(id: string) { await this.prisma.user.delete({ where: { id } }); }
}

// For tests — swap with in-memory implementation
class InMemoryUserRepository implements UserRepository {
  private users: User[] = [];
  async findById(id: string) { return this.users.find(u => u.id === id) ?? null; }
  // ...
}
```
