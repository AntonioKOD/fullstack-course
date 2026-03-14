---
sidebar_position: 6
title: Challenge — REST API with NestJS
---

# Challenge — REST API with NestJS

## Objective

Build a production-grade REST API for a task management app using **NestJS + Prisma + TypeScript**.

## Requirements

### Features (60 points)

**Auth module** (`/auth`)
- [ ] `POST /auth/register` — create user, return JWT
- [ ] `POST /auth/login` — verify password, return JWT
- [ ] JWT guard applied to protected routes
- [ ] Roles: `USER` and `ADMIN`

**Projects module** (`/projects`)
- [ ] CRUD endpoints
- [ ] Users can only see/edit their own projects
- [ ] Admins can see all projects

**Tasks module** (`/tasks`)
- [ ] Belongs to a project
- [ ] Fields: `title`, `description`, `status` (todo/in-progress/done), `priority` (low/medium/high), `dueDate`
- [ ] Filter by status and priority via query params
- [ ] Assign tasks to users

### Code Quality (40 points)

- [ ] Feature modules: `AuthModule`, `ProjectsModule`, `TasksModule`, `PrismaModule`
- [ ] DTOs with `class-validator` decorators on all inputs
- [ ] Global `ValidationPipe` with `whitelist: true`
- [ ] Global `TransformInterceptor` wrapping all responses in `{ data: ... }`
- [ ] Proper HTTP status codes (201 for create, 204 for delete)
- [ ] Prisma error handling (409 for unique violations, 404 for not found)

## Schema

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique
  name      String
  password  String
  role      Role      @default(USER)
  projects  Project[]
  tasks     Task[]    @relation("AssignedTasks")
  createdAt DateTime  @default(now())
}

model Project {
  id          String   @id @default(cuid())
  name        String
  description String?
  ownerId     String
  owner       User     @relation(fields: [ownerId], references: [id])
  tasks       Task[]
  createdAt   DateTime @default(now())
}

model Task {
  id          String     @id @default(cuid())
  title       String
  description String?
  status      TaskStatus @default(TODO)
  priority    Priority   @default(MEDIUM)
  dueDate     DateTime?
  projectId   String
  project     Project    @relation(fields: [projectId], references: [id])
  assigneeId  String?
  assignee    User?      @relation("AssignedTasks", fields: [assigneeId], references: [id])
  createdAt   DateTime   @default(now())
}

enum Role { USER ADMIN }
enum TaskStatus { TODO IN_PROGRESS DONE }
enum Priority { LOW MEDIUM HIGH }
```

## Grading

| Criteria | Points |
|----------|--------|
| NestJS modules/controllers/services structure | 15 |
| JWT authentication working | 15 |
| Roles guard (user vs admin) | 10 |
| All CRUD endpoints functional | 15 |
| DTOs with validation on all inputs | 10 |
| Filtering tasks by status/priority | 10 |
| Prisma error handling | 10 |
| Response transformation interceptor | 5 |
| Seed script with sample data | 5 |
| README with setup instructions | 5 |
| **Total** | **100** |

## Bonus

- Rate limiting with `@nestjs/throttler`
- Swagger docs with `@nestjs/swagger`
- Email notifications when a task is assigned (use nodemailer or mock it)
- Soft delete for projects (mark as deleted instead of removing)
