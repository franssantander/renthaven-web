import { z } from "zod";

export const leaseTermTypeValues = ["fixed_term", "monthly"] as const;

export const tenantModeValues = ["existing", "new"] as const;

export const assignTenantSchema = z.object({
  mode: z.enum(tenantModeValues),
  renter_uuid: z.string().optional(),
  first_name: z.string().trim().optional(),
  last_name: z.string().trim().optional(),
  email: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  term_type: z.enum(leaseTermTypeValues),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  security_deposit: z.coerce
    .number()
    .min(0, "Security deposit cannot be negative"),
  advance_rent: z.coerce.number().min(0, "Advance rent cannot be negative"),
});

export type AssignTenantFormValues = z.infer<typeof assignTenantSchema>;

export const reassignLeaseSchema = z.object({
  property_unit_uuid: z.string().min(1, "Select a unit"),
  move_date: z.string().optional(),
});

export type ReassignLeaseFormValues = z.infer<typeof reassignLeaseSchema>;

export const terminateLeaseSchema = z.object({
  move_out_date: z.string().min(1, "Move-out date is required"),
  notes: z
    .string()
    .trim()
    .max(1000, "Notes must be at most 1000 characters")
    .optional(),
});

export type TerminateLeaseFormValues = z.infer<typeof terminateLeaseSchema>;
