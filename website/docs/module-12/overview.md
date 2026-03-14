---
sidebar_position: 1
title: Module 12 Overview
---

# Module 12 — Authentication & Security

## What This Module Covers

Authentication is one of the most important (and most commonly broken) parts of any application. This module teaches you how to implement it correctly.

## Learning Objectives

- Hash passwords with bcrypt (never store plaintext)
- Sign and verify JWTs for stateless authentication
- Implement login, register, logout, and refresh token flows
- Write auth middleware that protects routes
- Understand common auth vulnerabilities and how to avoid them

## Auth Concepts

| Concept | What It Is |
|---------|-----------|
| **Authentication** | Proving who you are (login) |
| **Authorization** | What you're allowed to do (permissions) |
| **JWT** | Signed token containing claims — stateless |
| **Refresh Token** | Long-lived token used to get new access tokens |
| **bcrypt** | One-way password hashing algorithm |
| **httpOnly Cookie** | Cookie inaccessible to JavaScript (XSS-safe) |

## Module Lessons

1. [JWT Auth](./jwt-auth)
2. [bcrypt Hashing](./bcrypt-hashing)
3. [Auth Middleware](./auth-middleware)
4. [Refresh Tokens](./refresh-tokens)

## Challenge

Add full authentication to your Note Taker API:
- Register and login endpoints
- Notes are private per user
- JWT in httpOnly cookie
- Protected routes

[View Challenge →](./challenge)
