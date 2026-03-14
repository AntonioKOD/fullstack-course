---
sidebar_position: 5
title: Challenge — AI Assistant
---

# Challenge — AI Assistant with Tool Use

## Objective

Build a full-stack AI assistant that uses **Claude with tool use** to answer questions about real-world data — weather, database queries, or external APIs.

## Requirements

### Backend (50 points)

- [ ] Express or NestJS API with a `POST /api/agent` endpoint
- [ ] At least **3 tools** defined and implemented:
  - [ ] Tool 1: Search/query your own database (e.g., products, users, posts)
  - [ ] Tool 2: Weather or external API call
  - [ ] Tool 3: A computational tool (e.g., calculate, format, convert)
- [ ] Proper agentic loop — handles multi-step tool use
- [ ] Parallel tool execution with `Promise.all`
- [ ] Error handling per tool — returns error message to Claude instead of crashing
- [ ] All tool inputs validated with Zod before execution

### Frontend (30 points)

- [ ] Chat UI (React) — user can send messages and see responses
- [ ] Tool call visualization — show which tools were called and their results
- [ ] Streaming responses using SSE (from Module 23 streaming lesson)
- [ ] Message history preserved during session
- [ ] Loading state while agent is working

### Quality (20 points)

- [ ] TypeScript throughout — tools have typed inputs/outputs
- [ ] Conversation history maintained correctly across multiple turns
- [ ] Rate limiting on the agent endpoint
- [ ] Error messages shown in the UI gracefully

## Tool Ideas

Choose tools that make sense together:

**Option A: Product Assistant**
1. `search_products(query, category?, maxPrice?)` — Prisma
2. `get_product_details(productId)` — Prisma
3. `check_stock(productIds[])` — mock or real
4. `calculate_discount(price, couponCode)` — computation

**Option B: Travel Assistant**
1. `get_weather(city, days?)` — OpenWeatherMap API
2. `search_flights(from, to, date)` — Amadeus or mock
3. `convert_currency(amount, from, to)` — ExchangeRate API
4. `translate_text(text, targetLanguage)` — LibreTranslate

**Option C: Code Assistant**
1. `run_code(language, code)` — execute in a sandbox
2. `search_npm(query)` — npm registry API
3. `get_github_repo(owner, repo)` — GitHub API
4. `check_cve(packageName, version)` — Snyk API

## Grading

| Criteria | Points |
|----------|--------|
| Agent loop correctly handles tool calls | 15 |
| 3 tools defined with proper schemas | 15 |
| Tools actually execute and return data | 15 |
| Parallel tool execution | 5 |
| Chat UI functional | 15 |
| Tool call visualization | 10 |
| Streaming responses | 5 |
| Error handling (per tool + global) | 10 |
| TypeScript quality | 5 |
| Rate limiting | 5 |
| **Total** | **100** |

## Example Interaction

```
User: "I'm planning a trip from NYC to London next month.
       What's the weather like there, and how much is $2000 in GBP?"

Claude: [calls get_weather("London") and convert_currency(2000, "USD", "GBP") in parallel]

Claude: "London in [month] is typically cool and rainy — expect around 12°C with overcast
         skies. Your $2,000 budget converts to approximately £1,580 GBP at today's rate
         of 0.79. That should cover a comfortable week-long stay!"
```

## Bonus

- Persist conversation history per user in the database
- Memory tool: `remember(fact)` and `recall(topic)` — stores and retrieves user preferences
- Multi-agent: one orchestrator Claude calls specialized sub-agents
- Deploy the agent to production (Railway + Vercel)
