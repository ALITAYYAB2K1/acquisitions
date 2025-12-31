import { z } from 'zod';

export const updateUserSchema = z.object({
  name: z.string().min(3).max(255).trim().optional(),
  email: z.string().email().max(255).toLowerCase().trim().optional(),
  role: z.enum(['user', 'admin']).optional(),
});
