---
sidebar_position: 5
title: Monitoring & Observability
---

# Monitoring & Observability

Deploying is just the beginning. You need to know when things break, how fast your app is, and why users are leaving.

## The Three Pillars

| Pillar | What | Tools |
|--------|------|-------|
| **Logs** | Structured records of events | Railway logs, Logtail, Papertrail |
| **Metrics** | Numeric measurements over time | Railway metrics, Prometheus |
| **Traces** | Request lifecycle across services | OpenTelemetry, Sentry |

## Structured Logging with Pino

Plain `console.log` is hard to search. Structured JSON logs are queryable:

```bash
npm install pino pino-pretty
npm install -D @types/pino
```

```ts
// src/lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  ...(process.env.NODE_ENV !== 'production' && {
    transport: {
      target: 'pino-pretty',
      options: { colorize: true },
    },
  }),
});

// NestJS integration
import { Logger } from '@nestjs/common';

@Injectable()
export class PostsService {
  private readonly logger = new Logger(PostsService.name);

  async create(dto: CreatePostDto) {
    this.logger.log(`Creating post: ${dto.title}`);
    try {
      const post = await this.prisma.post.create({ data: dto });
      this.logger.log({ msg: 'Post created', postId: post.id });
      return post;
    } catch (error) {
      this.logger.error({ msg: 'Failed to create post', error });
      throw error;
    }
  }
}
```

## Error Tracking with Sentry

```bash
npm install @sentry/nestjs @sentry/node
# or for Next.js:
npm install @sentry/nextjs
```

```ts
// NestJS
import * as Sentry from '@sentry/nestjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
});

// In main.ts — capture unhandled errors
app.useGlobalFilters(new SentryFilter());
```

```ts
// Next.js — sentry.server.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1, // record 10% of sessions
});
```

Sentry captures:
- Unhandled exceptions
- Performance traces
- User sessions (Session Replay)
- Custom events: `Sentry.captureMessage('Payment failed', { extra: { orderId } })`

## Health Check Endpoint

```ts
// NestJS with @nestjs/terminus
npm install @nestjs/terminus @nestjs/axios

// src/health/health.module.ts
@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
})
export class HealthModule {}

// src/health/health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: PrismaHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
```

Railway uses `GET /health` to determine if your service is up.

## Uptime Monitoring

**BetterStack** (free tier):
1. Create a monitor pointing to `https://your-api.up.railway.app/health`
2. Check interval: 1 minute
3. Alert via email/Slack if down

**Alternatives**: Upptime (GitHub-based, free), UptimeRobot, Freshping.

## Performance Monitoring

### Next.js — Vercel Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
```

Vercel Analytics shows Core Web Vitals per page, per country, per device.

### API Response Times

```ts
// Custom middleware to log response times
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
    });
    if (duration > 1000) {
      logger.warn({ msg: 'Slow request', path: req.path, duration });
    }
  });
  next();
});
```

## Alerting

Set up alerts so you know before users complain:

1. **Error rate spike** → Sentry alert rule
2. **Response time > 2s** → Sentry performance alert
3. **Downtime** → BetterStack / UptimeRobot
4. **Database connection exhaustion** → Supabase dashboard alert

## The Production Checklist

Before going live:

- [ ] `NODE_ENV=production` set
- [ ] All secrets in platform secrets (not code)
- [ ] Health check endpoint returning 200
- [ ] Sentry DSN configured
- [ ] Uptime monitor pointing to health endpoint
- [ ] Database connection string using pooler (for serverless)
- [ ] Migrations run against production DB
- [ ] Error pages (404, 500) customized
- [ ] Rate limiting on public endpoints
- [ ] CORS configured to allow only your frontend domain
