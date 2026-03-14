---
sidebar_position: 1
title: Module 21 Overview
---

# Module 21 — CI/CD & DevOps Basics

## What Is CI/CD?

**Continuous Integration (CI)** — automatically run tests, linting, and type checks on every push.
**Continuous Deployment (CD)** — automatically deploy when CI passes on the main branch.

This catches bugs before they reach users and makes deployment a non-event.

## Learning Objectives

- Write GitHub Actions workflows
- Run tests and type checks in CI
- Use Docker to containerize your Node.js API
- Manage environment variables securely
- Set up automated deployment on merge

## Module Lessons

1. [GitHub Actions](./github-actions)
2. [Docker Basics](./docker-basics)
3. [Environment Variables](./environment-variables)

## Challenge

Set up a full CI/CD pipeline for your Express API:
- CI: TypeScript check + tests on every PR
- CD: Auto-deploy to Railway on merge to main

[View Challenge →](./challenge)
