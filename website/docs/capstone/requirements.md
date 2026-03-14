---
sidebar_position: 2
title: Capstone Requirements
---

# Capstone Requirements

## Proposal (Week 1)

Submit a 1-page proposal covering:

1. **Problem** — what problem does this solve? Who is the user?
2. **Features** — list your MVP features (Week 1-3) and stretch goals (Week 4+)
3. **Tech stack** — which architecture (Next.js monorepo vs separate API/frontend)?
4. **Database schema** — draw your tables/models and their relationships
5. **Wireframes** — rough sketches of key screens (hand-drawn is fine)

## MVP Milestone (Week 3)

A deployed URL must be submitted. It must have:
- Working authentication (register/login/logout)
- At least one full CRUD flow for the main resource
- Basic responsive layout

## Final Submission (Week 6)

Submit:
- Live URL
- GitHub repo link
- 3-minute recorded demo video
- README with all required sections

## Presentation (Demo Day — Week 6)

7-minute presentation:

1. (1 min) Pitch — what is it and who is it for?
2. (3 min) Live demo — walk through the main user journey
3. (1 min) Architecture walkthrough — diagram or code snippet
4. (1 min) Reflection — what was hardest? what would you add?
5. (1 min) Q&A

## Repo Requirements

- All work in `main` (or merged via PRs)
- At least 20 commits across the project
- Meaningful commit messages
- `.gitignore` excludes `.env`, `node_modules`, `dist`
- No secrets in git history

## README Template

```markdown
# Project Name

> One-sentence description

![Screenshot](./screenshot.png)

**Live:** https://your-app.com

## Features
- Feature 1
- Feature 2
- Feature 3

## Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind CSS
- **Backend:** Next.js API routes / Express / NestJS
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth v5 / JWT
- **Deployment:** Vercel + Railway + Supabase

## Getting Started

\`\`\`bash
git clone https://github.com/you/project
cd project
npm install
cp .env.example .env   # fill in your values
npx prisma migrate dev
npm run dev
\`\`\`

## Environment Variables

See `.env.example` for required variables.
```
