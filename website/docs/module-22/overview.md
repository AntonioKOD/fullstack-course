---
sidebar_position: 1
title: Module 22 Overview
---

# Module 22 — Deployment

## The Modern Deployment Stack

| Service | What It Hosts | Free Tier |
|---------|--------------|-----------|
| **Vercel** | Next.js, React frontends |  Generous |
| **Railway** | Node.js/NestJS APIs, Docker |  $5/month hobby |
| **Supabase** | PostgreSQL + Auth + Storage |  500MB database |
| **MongoDB Atlas** | MongoDB |  512MB cluster |
| **Upstash** | Redis, Kafka |  Pay per request |
| **Cloudflare R2** | File storage (S3 compatible) |  10GB |

## Learning Objectives

- Deploy a Next.js app to Vercel with environment variables
- Deploy an Express/NestJS API to Railway with a Dockerfile
- Connect to a managed PostgreSQL database on Supabase
- Monitor errors and performance in production

## Module Lessons

1. [Vercel — Next.js](./vercel-nextjs)
2. [Railway — Node.js API](./railway-nest)
3. [Supabase — PostgreSQL](./supabase-postgres)
4. [Monitoring](./monitoring)

## Challenge

Deploy your full Project 2 stack:
- Frontend → Vercel
- API → Railway
- Database → Supabase

[View Challenge →](./challenge)
