import { z } from 'zod';

/**
 * Example Zod schema. Use for POST/PATCH body validation.
 */
export const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().optional(),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
