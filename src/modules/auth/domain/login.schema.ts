import { z } from "zod";

export const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  remember: z.boolean().default(false),
});

export type LoginCredentials = z.infer<typeof loginSchema>;
