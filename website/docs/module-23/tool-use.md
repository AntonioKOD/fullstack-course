---
sidebar_position: 4
title: Tool Use
---

# Tool Use with the Claude API

Tool use (function calling) lets Claude interact with external systems — search the web, query a database, call APIs — and reason about the results. It's how you build real AI agents.

## How Tool Use Works

1. You define tools (name, description, input schema)
2. Claude decides whether to call a tool based on the user's message
3. You execute the tool and return the result
4. Claude uses the result to formulate its final response

```
User message
    ↓
Claude reasons → decides to call tool
    ↓
Your code executes the tool
    ↓
Result returned to Claude
    ↓
Claude produces final answer
```

## Defining Tools

```ts
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const tools: Anthropic.Tool[] = [
  {
    name: 'get_weather',
    description: 'Get the current weather for a city. Returns temperature, conditions, and humidity.',
    input_schema: {
      type: 'object',
      properties: {
        city: {
          type: 'string',
          description: 'The city name, e.g. "San Francisco"',
        },
        units: {
          type: 'string',
          enum: ['celsius', 'fahrenheit'],
          description: 'Temperature units',
        },
      },
      required: ['city'],
    },
  },
  {
    name: 'search_database',
    description: 'Search the product database for items matching a query.',
    input_schema: {
      type: 'object',
      properties: {
        query: { type: 'string' },
        limit: { type: 'number', description: 'Max results to return (default 5)' },
      },
      required: ['query'],
    },
  },
];
```

## Tool Execution Loop

```ts
import { type MessageParam } from '@anthropic-ai/sdk/resources/messages';

type ToolInput = Record<string, unknown>;

async function executeAgentLoop(userMessage: string): Promise<string> {
  const messages: MessageParam[] = [
    { role: 'user', content: userMessage },
  ];

  while (true) {
    const response = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      tools,
      messages,
    });

    // Add assistant's response to message history
    messages.push({ role: 'assistant', content: response.content });

    // If Claude is done (no tool calls), return the text
    if (response.stop_reason === 'end_turn') {
      const textBlock = response.content.find(b => b.type === 'text');
      return textBlock?.type === 'text' ? textBlock.text : '';
    }

    // Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      const toolResults: Anthropic.ToolResultBlockParam[] = [];

      for (const block of response.content) {
        if (block.type !== 'tool_use') continue;

        console.log(`Calling tool: ${block.name}`, block.input);
        const result = await callTool(block.name, block.input as ToolInput);

        toolResults.push({
          type: 'tool_result',
          tool_use_id: block.id,
          content: JSON.stringify(result),
        });
      }

      // Return tool results to Claude
      messages.push({ role: 'user', content: toolResults });
    }
  }
}

async function callTool(name: string, input: ToolInput): Promise<unknown> {
  switch (name) {
    case 'get_weather':
      return fetchWeather(input.city as string, input.units as string);
    case 'search_database':
      return searchProducts(input.query as string, input.limit as number);
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
```

## Real Tool Implementations

```ts
async function fetchWeather(city: string, units = 'celsius') {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units === 'celsius' ? 'metric' : 'imperial'}&appid=${process.env.OPENWEATHER_API_KEY}`;
  const res = await fetch(url);
  if (!res.ok) return { error: `City "${city}" not found` };
  const data = await res.json();
  return {
    city: data.name,
    temperature: data.main.temp,
    conditions: data.weather[0].description,
    humidity: data.main.humidity,
    units,
  };
}

async function searchProducts(query: string, limit = 5) {
  // Search your Prisma database
  const products = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
      ],
    },
    take: limit,
    select: { id: true, name: true, price: true, inStock: true },
  });
  return { results: products, total: products.length };
}
```

## Express Endpoint

```ts
// POST /api/agent
router.post('/agent', async (req, res) => {
  const { message, history = [] } = req.body;

  try {
    const answer = await executeAgentLoop(message);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: 'Agent failed' });
  }
});
```

## Parallel Tool Calls

Claude can call multiple tools simultaneously:

```ts
// Claude might request both in one turn:
// { name: 'get_weather', input: { city: 'NYC' } }
// { name: 'get_weather', input: { city: 'LA' } }

// Execute in parallel
const toolResults = await Promise.all(
  toolUseBlocks.map(async (block) => ({
    type: 'tool_result' as const,
    tool_use_id: block.id,
    content: JSON.stringify(await callTool(block.name, block.input as ToolInput)),
  }))
);
```

## Computer Use (Advanced)

Claude's most powerful tool use mode — it can control a computer:

```ts
const response = await client.beta.messages.create({
  model: 'claude-opus-4-5',
  max_tokens: 4096,
  tools: [{ type: 'computer_20241022', name: 'computer', display_width_px: 1280, display_height_px: 800 }],
  messages: [{ role: 'user', content: 'Go to github.com and star the first trending repo' }],
  betas: ['computer-use-2024-10-22'],
});
```

This is outside the scope of this module but worth exploring.

## Safety Considerations

When building agents with tool use:

1. **Validate all tool inputs** — never trust Claude's input directly
2. **Limit tool permissions** — read-only tools are safer than write tools
3. **Rate limit tool calls** — prevent runaway loops
4. **Log all tool calls** — for auditing and debugging
5. **Human-in-the-loop** — for destructive actions, require confirmation
