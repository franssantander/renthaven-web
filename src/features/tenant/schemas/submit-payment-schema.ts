import { z } from "zod";

export const submitPaymentSchema = z.object({
  amount: z.coerce.number().min(0.01, "Amount must be greater than zero"),
  reference_number: z
    .string()
    .trim()
    .max(255, "Reference number must be at most 255 characters")
    .optional(),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be at most 1000 characters")
    .optional(),
});

export type SubmitPaymentFormValues = z.infer<typeof submitPaymentSchema>;
