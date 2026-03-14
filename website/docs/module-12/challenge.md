---
sidebar_position: 6
title: Challenge — Auth API
---
# Challenge — Add Authentication to Note Taker

## Objective

Extend the Module 09 Note Taker API with full JWT authentication.

## New Endpoints

| Method | Path | Access |
|--------|------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| POST | /api/auth/logout | Authenticated |
| POST | /api/auth/refresh | Via cookie |
| GET | /api/auth/me | Authenticated |
| GET | /api/notes | Authenticated — own notes only |

## Requirements
- Notes belong to users (add userId to Note model)
- Users can only read/edit/delete their own notes
- Passwords hashed with bcrypt (12 rounds)
- JWT in Authorization header; refresh token in httpOnly cookie
- Zod validation on register and login
