import { z } from "zod";

export const maintenanceCategoryValues = [
  "plumbing",
  "electrical",
  "hvac",
  "appliance",
  "structural",
  "pest_control",
  "other",
] as const;

export const maintenancePriorityValues = [
  "low",
  "medium",
  "high",
  "urgent",
] as const;

export const maintenanceStatusValues = [
  "open",
  "in_progress",
  "resolved",
  "cancelled",
] as const;

export const createMaintenanceRequestSchema = z.object({
  lease_uuid: z.string().min(1, "Select a lease"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be at most 255 characters"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(5000, "Description must be at most 5000 characters"),
  category: z.enum(maintenanceCategoryValues),
  priority: z.enum(maintenancePriorityValues),
});

export type CreateMaintenanceRequestFormValues = z.infer<
  typeof createMaintenanceRequestSchema
>;

export const updateMaintenanceStatusSchema = z.object({
  status: z.enum(maintenanceStatusValues),
  notes: z
    .string()
    .trim()
    .max(2000, "Notes must be at most 2000 characters")
    .optional(),
  assigned_to_uuid: z.string().optional(),
});

export type UpdateMaintenanceStatusFormValues = z.infer<
  typeof updateMaintenanceStatusSchema
>;
