---
sidebar_position: 1
title: Module 15 Overview
---

# Module 15 — NestJS

## What Is NestJS?

NestJS is an opinionated Node.js framework built on top of Express (or Fastify), written entirely in TypeScript. It brings Angular-style architecture to the backend: **modules, controllers, services, and dependency injection**.

## Why NestJS?

Express gives you total freedom — which can be a problem on large teams or large codebases. NestJS enforces a consistent structure:

| Express | NestJS |
|---------|--------|
| No enforced structure | Modules + Controllers + Services |
| Manual DI | Built-in dependency injection |
| Manual decorators | `@Controller`, `@Get`, `@Post`, `@Body` |
| Manual pipe validation | `@UsePipes(new ValidationPipe())` |
| Manual OpenAPI | `@nestjs/swagger` auto-generates docs |

NestJS is used at companies like Adidas, GitLab, and Roche for its scalability and developer experience.

## Learning Objectives

- Understand the Module/Controller/Service architecture
- Use NestJS decorators to define routes and validate input
- Implement dependency injection
- Add Guards for auth and Pipes for validation
- Integrate Prisma as the data layer

## Module Lessons

1. [NestJS Architecture](./nest-architecture)
2. [Modules, Controllers & Services](./modules-controllers-services)
3. [Dependency Injection](./dependency-injection)
4. [Guards & Pipes](./guards-pipes)
5. [Prisma Integration](./prisma-integration)

## Challenge

Build a full **Blog REST API** with NestJS:
- Users, Posts, Comments
- JWT authentication with Guards
- Full CRUD with Prisma
- Swagger docs auto-generated

[View Challenge →](./challenge)
