---
sidebar_position: 2
title: Deploying Next.js to Vercel
---

# Deploying Next.js to Vercel

Vercel is the company behind Next.js. Their platform is purpose-built for it — zero-config deployment, automatic preview URLs, and edge-optimized delivery.

## Setup

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/yourusername/my-nextjs-app.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Vercel auto-detects Next.js — no config needed
4. Click Deploy

Your app is live in ~30 seconds.

## Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```
NEXTAUTH_SECRET=your-production-secret
NEXTAUTH_URL=https://your-app.vercel.app
DATABASE_URL=postgresql://...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

Choose the environment (Production / Preview / Development):
- **Production** — main branch deploys
- **Preview** — every PR gets its own deploy URL
- **Development** — `vercel dev` local

## Vercel CLI

```bash
npm install -g vercel
vercel login
vercel          # deploy from current directory
vercel --prod   # deploy to production
vercel env pull # download environment variables to .env.local
```

## Preview Deployments

Every pull request automatically gets a unique URL:

```
https://my-app-git-feature-auth-username.vercel.app
```

Share it with your team for review before merging. This is production parity — same build, same infrastructure.

## Custom Domains

1. Dashboard → Project → Settings → Domains
2. Add your domain (e.g., `myapp.com`)
3. Update DNS with the CNAME or A record Vercel provides
4. SSL is automatic

## `vercel.json` Configuration

```json
{
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://myapp.com" }
      ]
    }
  ],
  "redirects": [
    { "source": "/old-path", "destination": "/new-path", "permanent": true }
  ]
}
```

## Next.js Output Modes

```ts
// next.config.ts
const nextConfig = {
  output: 'standalone', // optimal for Docker / custom servers
  // output: 'export',  // fully static (no server features)
  // default: undefined  // optimal for Vercel
};
```

For Vercel: don't set `output` — let Vercel handle it.

## ISR & Edge Functions

Next.js on Vercel supports:

```ts
// Incremental Static Regeneration
export const revalidate = 3600; // rebuild this page every hour

// Edge Runtime (faster, lower latency, more geographic distribution)
export const runtime = 'edge';
```

## Monorepo Support

If your repo has both `frontend/` and `api/`:

```
my-monorepo/
 apps/
    web/    ← Next.js app
    api/    ← NestJS API
 packages/
     types/  ← Shared TypeScript types
```

In Vercel project settings → Root Directory → set to `apps/web`.

## Deployment Checklist

- [ ] `npm run build` passes locally
- [ ] Environment variables set in Vercel dashboard
- [ ] `NEXTAUTH_URL` set to production URL
- [ ] Database URL pointing to production database (Supabase)
- [ ] Custom domain configured
- [ ] Analytics enabled (Vercel Analytics → free for hobby)
