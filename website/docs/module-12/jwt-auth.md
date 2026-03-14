---
sidebar_position: 2
title: JWT Authentication
---

# JWT Authentication

## What Is a JWT?

A JSON Web Token (JWT) is a compact, URL-safe way to transmit claims between parties. It has three parts separated by dots:

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.signature
    HEADER                          PAYLOAD                        SIGNATURE
```

- **Header** — algorithm used (HS256, RS256)
- **Payload** — claims (userId, role, expiry) — **not encrypted, only signed**
- **Signature** — proves the token hasn't been tampered with

:::warning JWTs are not encrypted
Anyone can decode the payload of a JWT. Never put sensitive data (passwords, SSNs, PII) in a JWT payload.
:::

## Setup

```bash
npm install jsonwebtoken
npm install -D @types/jsonwebtoken
```

## Token Service

```ts title="src/lib/tokens.ts"
import jwt from 'jsonwebtoken';
import { env } from '../env.js';

interface AccessTokenPayload {
  sub: string;    // user ID (subject)
  role: string;
}

interface RefreshTokenPayload {
  sub: string;
  tokenVersion: number;  // increment to invalidate all tokens
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: '15m',   // short-lived — 15 minutes
  });
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',    // long-lived — 7 days
  });
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
```

## Auth Controller

```ts title="src/controllers/auth.controller.ts"
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/tokens.js';
import { ConflictError, UnauthorizedError } from '../lib/errors.js';

export async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new ConflictError('Email already in use');

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
    select: { id: true, name: true, email: true, role: true },
  });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: 0 });

  setRefreshTokenCookie(res, refreshToken);

  res.status(201).json({
    success: true,
    data: { user, accessToken },
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new UnauthorizedError('Invalid credentials');

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, tokenVersion: user.tokenVersion });

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      accessToken,
    },
  });
}

export async function logout(req: Request, res: Response) {
  res.clearCookie('refreshToken', { path: '/api/auth/refresh' });
  res.json({ success: true });
}

// Helper — set httpOnly cookie (safer than localStorage for refresh tokens)
function setRefreshTokenCookie(res: Response, token: string) {
  res.cookie('refreshToken', token, {
    httpOnly: true,     // not accessible via JavaScript
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'strict',
    path: '/api/auth/refresh',  // only sent to this path
    maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in ms
  });
}
```

## Routes

```ts title="src/routes/auth.routes.ts"
import { Router } from 'express';
import { register, login, logout, refresh, me } from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

export const authRouter = Router();

authRouter.post('/register', validate(registerSchema), register);
authRouter.post('/login',    validate(loginSchema), login);
authRouter.post('/logout',   logout);
authRouter.post('/refresh',  refresh);
authRouter.get('/me',        authenticate, me);
```

## Where to Store Tokens

| Storage | XSS Safe | CSRF Safe | Recommended |
|---------|---------|---------|------------|
| `localStorage` |  |  |  for refresh tokens |
| `sessionStorage` |  |  |  |
| httpOnly Cookie |  |  (need CSRF token) |  for refresh tokens |
| In-memory (variable) |  |  |  for access tokens |

**Recommended pattern:**
- Access token: store in memory (lost on page refresh — intentional)
- Refresh token: httpOnly cookie (XSS-safe, used to get new access tokens silently)
