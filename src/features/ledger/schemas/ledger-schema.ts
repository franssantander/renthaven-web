import { z } from "zod";

export const markPaidSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero").optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be at most 1000 characters")
    .optional(),
});

export type MarkPaidFormValues = z.infer<typeof markPaidSchema>;

export const rejectPaymentSchema = z.object({
  reason: z
    .string()
    .trim()
    .max(1000, "Reason must be at most 1000 characters")
    .optional(),
});

export type RejectPaymentFormValues = z.infer<typeof rejectPaymentSchema>;
