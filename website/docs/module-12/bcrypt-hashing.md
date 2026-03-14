---
sidebar_position: 3
title: bcrypt Password Hashing
---
# bcrypt Password Hashing

Never store plaintext passwords. Use bcrypt — it's slow by design (makes brute force impractical).

```bash
npm install bcryptjs && npm install -D @types/bcryptjs
```

```ts
import bcrypt from 'bcryptjs';

// Hash password (10-12 rounds is standard — higher = slower)
const hash = await bcrypt.hash('mypassword', 12);
// '$2b$12$...' — different every time even for same input

// Verify — compare plaintext to hash
const isValid = await bcrypt.compare('mypassword', hash); // true
const isValid2 = await bcrypt.compare('wrongpassword', hash); // false
```

**Rules:**
- Always hash in the service layer, never in the controller
- Never log or return password hashes
- Use `select: false` in Prisma to exclude from queries by default
- 12 rounds is a good balance (adds ~300ms per login — unnoticeable to users)
