---
sidebar_position: 3
title: Streaming Responses
---

# Streaming Responses

Streaming sends tokens to the client as they're generated — instead of waiting for the full response. This makes AI feel dramatically more responsive.

## Server: Express Streaming Endpoint

```ts title="src/routes/ai.routes.ts"
aiRouter.post('/chat/stream', authenticate, async (req, res) => {
  const { messages, systemPrompt } = req.body;

  // Set up Server-Sent Events (SSE)
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // disable Nginx buffering

  const stream = claude.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt ?? 'You are a helpful assistant.',
    messages,
  });

  stream.on('text', (text) => {
    res.write(`data: ${JSON.stringify({ text })}\n\n`);
  });

  stream.on('message', (message) => {
    res.write(`data: ${JSON.stringify({ done: true, usage: message.usage })}\n\n`);
    res.end();
  });

  stream.on('error', (err) => {
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  });

  // Abort if client disconnects
  req.on('close', () => stream.abort());
});
```

## Client: EventSource with React

```tsx title="src/components/StreamingChat.tsx"
'use client';

import { useState, useRef } from 'react';

export function StreamingChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  async function handleSend() {
    if (!input.trim() || isStreaming) return;

    const userMessage = input;
    setInput('');

    const newMessages: Message[] = [
      ...messages,
      { id: crypto.randomUUID(), role: 'user', content: userMessage },
      { id: crypto.randomUUID(), role: 'assistant', content: '' }, // placeholder
    ];

    setMessages(newMessages);
    setIsStreaming(true);

    abortRef.current = new AbortController();

    const response = await fetch('/api/ai/chat/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: newMessages.slice(0, -1).map(m => ({
          role: m.role,
          content: m.content,
        })),
      }),
      signal: abortRef.current.signal,
    });

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        try {
          const data = JSON.parse(line.slice(6));
          if (data.text) {
            // Append token to last message
            setMessages(prev =>
              prev.map((msg, i) =>
                i === prev.length - 1
                  ? { ...msg, content: msg.content + data.text }
                  : msg
              )
            );
          }
          if (data.done) {
            setIsStreaming(false);
          }
        } catch {}
      }
    }

    setIsStreaming(false);
  }

  function handleStop() {
    abortRef.current?.abort();
    setIsStreaming(false);
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* messages display */}
      <div className="flex gap-2 p-4 border-t">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="input flex-1"
        />
        {isStreaming ? (
          <button onClick={handleStop} className="btn-danger">Stop</button>
        ) : (
          <button onClick={handleSend} className="btn-primary">Send</button>
        )}
      </div>
    </div>
  );
}
```

## Next.js Route Handler with Vercel AI SDK

For Next.js, use the [Vercel AI SDK](https://sdk.vercel.ai) which abstracts streaming:

```bash
npm install ai @ai-sdk/anthropic
```

```ts title="app/api/chat/route.ts"
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge'; // runs on Vercel Edge Network

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: 'You are a helpful assistant.',
    messages,
  });

  return result.toDataStreamResponse();
}
```

```tsx title="app/page.tsx"
'use client';

import { useChat } from 'ai/react';

export default function ChatPage() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
  });

  return (
    <div>
      {messages.map(m => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  );
}
```
