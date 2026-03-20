import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(8, "Username must be at least 8 characters"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
