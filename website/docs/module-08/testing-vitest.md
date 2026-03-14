---
sidebar_position: 5
title: Testing with Vitest
---
# Testing with Vitest

Vitest is a Vite-native test runner — fast, ESM-native, and compatible with the Jest API.

## Setup

```bash
npm install -D vitest @vitest/coverage-v8
```

```json title="package.json"
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Writing Tests

```ts title="src/utils/math.test.ts"
import { describe, it, expect, beforeEach } from 'vitest';
import { add, subtract, divide } from './math';

describe('math utilities', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  it('throws when dividing by zero', () => {
    expect(() => divide(10, 0)).toThrow('Division by zero');
  });
});
```

## Testing Async Code

```ts
import { describe, it, expect, vi } from 'vitest';

describe('UserService', () => {
  it('throws ConflictError if email exists', async () => {
    const mockRepo = {
      findByEmail: vi.fn().mockResolvedValue({ id: '1', email: 'alice@example.com' }),
      create: vi.fn(),
    };

    const service = new UserService(mockRepo);

    await expect(
      service.create({ name: 'Alice', email: 'alice@example.com', password: 'pass' })
    ).rejects.toThrow('Email already in use');

    expect(mockRepo.create).not.toHaveBeenCalled();
  });
});
```
