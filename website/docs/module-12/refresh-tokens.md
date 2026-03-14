---
sidebar_position: 5
title: Refresh Tokens
---
# Refresh Token Flow

Access tokens expire quickly (15m). Refresh tokens allow getting new access tokens without re-login.

## Flow

```
1. User logs in → receives access token (15m) + refresh token cookie (7d)
2. Access token expires
3. Client sends POST /api/auth/refresh with refresh token cookie
4. Server validates refresh token → issues new access token
5. If refresh token expired → user must log in again
```

## Refresh Endpoint

```ts
export async function refresh(req: Request, res: Response) {
  const token = req.cookies['refreshToken'];
  if (!token) throw new UnauthorizedError('No refresh token');

  const payload = verifyRefreshToken(token); // throws if invalid/expired

  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new UnauthorizedError('Token invalidated');
  }

  const newAccessToken = signAccessToken({ sub: user.id, role: user.role });
  res.json({ success: true, data: { accessToken: newAccessToken } });
}
```

## Revoking All Sessions (Logout Everywhere)

```ts
// Increment tokenVersion — all existing refresh tokens become invalid
await prisma.user.update({
  where: { id: userId },
  data: { tokenVersion: { increment: 1 } },
});
```
