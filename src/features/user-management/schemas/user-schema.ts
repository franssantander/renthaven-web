import { z } from "zod";

export const userBaseSchema = z.object({
  first_name: z
    .string()
    .trim()
    .min(1, "First name is required")
    .max(255, "First name must be at most 255 characters"),
  middle_name: z
    .string()
    .trim()
    .max(255, "Middle name must be at most 255 characters")
    .optional()
    .or(z.literal("")),
  last_name: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .max(255, "Last name must be at most 255 characters"),
  username: z
    .string()
    .trim()
    .min(1, "Username is required")
    .max(255, "Username must be at most 255 characters"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(255, "Email must be at most 255 characters"),
  role_uuid: z.string().uuid("Please select a role"),
  tenant_business_uuid: z.string().uuid().optional().or(z.literal("")),
});

export const createUserSchema = userBaseSchema
  .extend({
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export const updateUserSchema = userBaseSchema
  .extend({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .optional()
      .or(z.literal("")),
    password_confirmation: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => !data.password || data.password === data.password_confirmation,
    {
      message: "Passwords do not match",
      path: ["password_confirmation"],
    },
  );

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
export type UserFormValues = CreateUserFormValues | UpdateUserFormValues;
