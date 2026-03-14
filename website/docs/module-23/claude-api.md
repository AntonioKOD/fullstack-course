---
sidebar_position: 2
title: Claude API
---

# Claude API with the Anthropic SDK

## Setup

```bash
npm install @anthropic-ai/sdk
```

```bash title=".env"
ANTHROPIC_API_KEY=sk-ant-...
```

## Basic Message

```ts title="src/lib/claude.ts"
import Anthropic from '@anthropic-ai/sdk';
import { env } from '../env.js';

export const claude = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
```

```ts
import { claude } from './lib/claude.js';

const response = await claude.messages.create({
  model: 'claude-sonnet-4-6',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: 'Explain closures in JavaScript in 3 sentences.',
    },
  ],
});

const text = response.content[0].type === 'text' ? response.content[0].text : '';
console.log(text);
```

## Express Endpoint

```ts title="src/routes/ai.routes.ts"
import { Router } from 'express';
import { claude } from '../lib/claude.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { z } from 'zod';

export const aiRouter = Router();

const chatSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().min(1),
  })).min(1),
  systemPrompt: z.string().optional(),
});

aiRouter.post('/chat', authenticate, validate(chatSchema), async (req, res) => {
  const { messages, systemPrompt } = req.body;

  const response = await claude.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt ?? 'You are a helpful assistant.',
    messages,
  });

  const text = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  res.json({
    success: true,
    data: {
      content: text,
      usage: response.usage,
      stopReason: response.stop_reason,
    },
  });
});
```

## Conversation History

```ts title="src/services/chat.service.ts"
import type { MessageParam } from '@anthropic-ai/sdk/resources/messages';
import { claude } from '../lib/claude.js';
import { prisma } from '../lib/prisma.js';

export class ChatService {
  async sendMessage(
    conversationId: string,
    userMessage: string,
    userId: string
  ) {
    // Load conversation history
    const history = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });

    const messages: MessageParam[] = [
      ...history.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: userMessage },
    ];

    // Call Claude
    const response = await claude.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: 'You are a helpful coding assistant.',
      messages,
    });

    const assistantMessage = response.content
      .filter(b => b.type === 'text')
      .map(b => b.text)
      .join('');

    // Save both messages to DB
    await prisma.message.createMany({
      data: [
        { conversationId, role: 'user', content: userMessage, userId },
        { conversationId, role: 'assistant', content: assistantMessage },
      ],
    });

    return assistantMessage;
  }
}
```

## React Chat UI

```tsx title="src/components/ChatUI.tsx"
'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export function ChatUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const data = await api.post<{ content: string }>('/api/ai/chat', {
        messages: [...messages, userMsg].map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.content,
      }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] border rounded-xl overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t p-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
          placeholder="Type a message..."
          className="input flex-1"
        />
        <button onClick={handleSend} disabled={isLoading} className="btn-primary">
          Send
        </button>
      </div>
    </div>
  );
}
```
