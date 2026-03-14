---
sidebar_position: 4
title: Auth Middleware
---
# Auth Middleware

See the [Middleware lesson in Module 09](../../module-09/middleware) for the full implementation.

## Quick Reference

```ts
// Protect a route
router.get('/me', authenticate, getCurrentUser);

// Protect and require role
router.delete('/:id', authenticate, authorize('admin'), deleteUser);

// Extract user in controller
export async function getCurrentUser(req: Request, res: Response) {
  // req.user is set by authenticate middleware
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, role: true },
  });
  res.json({ success: true, data: user });
}
```
