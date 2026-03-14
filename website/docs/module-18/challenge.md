---
sidebar_position: 6
title: Challenge — tRPC Task Manager
---

# Challenge — tRPC Task Manager

## Objective

Build a full-stack **Task Manager** using Next.js 15 + tRPC + Prisma with end-to-end type safety.

## Requirements

### tRPC Router (40 points)

Create the following procedures:

**`tasks` router:**
- [ ] `list` — protected query, returns tasks for current user
- [ ] `byId` — protected query, input: `{ id: string }`
- [ ] `create` — protected mutation, input: title, description?, priority?, dueDate?
- [ ] `update` — protected mutation, input: id + partial task fields
- [ ] `delete` — protected mutation, input: `{ id: string }`
- [ ] `complete` — protected mutation, input: `{ id: string }` — toggles completed

**`projects` router:**
- [ ] `list` — protected query
- [ ] `create` — protected mutation
- [ ] `tasksFor` — protected query, input: `{ projectId: string }`

### React Client (40 points)

- [ ] Task list using `trpc.tasks.list.useQuery()`
- [ ] Create task form using `trpc.tasks.create.useMutation()`
- [ ] Check/uncheck task with **optimistic update**
- [ ] Delete task with confirmation (optimistic update)
- [ ] Filter tasks by project using query input

### Quality (20 points)

- [ ] All inputs validated with Zod (min/max lengths, valid dates, etc.)
- [ ] `TRPCError` thrown for unauthorized access / not found
- [ ] TypeScript: no `any`
- [ ] Loading and error states on all queries/mutations

## Grading

| Criteria | Points |
|----------|--------|
| tRPC server setup (router, context, auth) | 15 |
| All task procedures implemented | 20 |
| Project procedures | 10 |
| React query hooks working | 15 |
| Optimistic updates on complete/delete | 15 |
| Zod validation on all inputs | 10 |
| Error handling (401, 404) | 10 |
| TypeScript quality | 5 |
| **Total** | **100** |

## Schema

```prisma
model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  completed   Boolean   @default(false)
  priority    Priority  @default(MEDIUM)
  dueDate     DateTime?
  userId      String
  user        User      @relation(fields: [userId], references: [id])
  projectId   String?
  project     Project?  @relation(fields: [projectId], references: [id])
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Project {
  id        String   @id @default(cuid())
  name      String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  tasks     Task[]
  createdAt DateTime @default(now())
}

enum Priority { LOW MEDIUM HIGH }
```

## Bonus

- Drag-and-drop task reordering (update a `position` field)
- tRPC subscriptions for real-time task updates (WebSocket)
- Generate a REST API from tRPC using `trpc-openapi`
- E2E tests with Playwright
