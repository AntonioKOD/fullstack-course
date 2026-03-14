---
sidebar_position: 6
title: Challenge — Full-Stack Next.js App
---

# Challenge — Full-Stack Next.js App

## Objective

Build a full-stack **Notes** application using Next.js 15 App Router with authentication, Server Components, Server Actions, and Prisma.

## Requirements

### Features (70 points)

**Authentication**
- [ ] GitHub OAuth login via NextAuth v5
- [ ] Credentials login (email + password)
- [ ] Protected routes: redirect to `/login` if unauthenticated
- [ ] User session displayed in header

**Notes CRUD**
- [ ] Notes list page: shows all notes for current user (Server Component)
- [ ] Create note: Server Action with `useActionState`
- [ ] Edit note: inline edit or separate page
- [ ] Delete note: Server Action with optimistic update
- [ ] Notes are private — users only see their own

**UX**
- [ ] Loading states with `loading.tsx` and Suspense
- [ ] Error boundaries with `error.tsx`
- [ ] Toast notifications on create/update/delete

### Code Quality (30 points)

- [ ] Proper folder structure with route groups
- [ ] TypeScript throughout — no `any`
- [ ] Zod validation in Server Actions
- [ ] Prisma for all database access
- [ ] Tailwind CSS + dark mode

## Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  password      String?
  accounts      Account[]
  notes         Note[]
}

model Note {
  id        String   @id @default(cuid())
  title     String
  content   String
  pinned    Boolean  @default(false)
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Folder Structure

```
app/
 (auth)/
    login/
        page.tsx
 (app)/
    layout.tsx       # auth check + nav
    notes/
       page.tsx     # Server Component: list notes
       new/
          page.tsx # create form
       [id]/
           page.tsx # view note
           edit/
               page.tsx
 api/
     auth/
         [...nextauth]/
             route.ts
```

## Grading

| Criteria | Points |
|----------|--------|
| Auth working (at least one provider) | 20 |
| Protected routes / middleware | 10 |
| Notes list as Server Component | 10 |
| Create note with Server Action | 15 |
| Edit and delete functional | 15 |
| Loading and error states | 10 |
| TypeScript + Prisma + Zod | 10 |
| UI with Tailwind, responsive | 10 |
| **Total** | **100** |

## Bonus

- Pin/unpin notes
- Tags on notes with filter sidebar
- Markdown editor and preview
- Share a note via public URL
- Search with PostgreSQL full-text search
