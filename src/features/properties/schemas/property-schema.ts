import { z } from "zod";

export const propertyTypeValues = [
  "dorm",
  "apartment",
  "condo",
  "town_house",
] as const;

export const propertySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  address: z.string().trim().max(1000, "Address must be at most 1000 characters"),
  type: z.enum(propertyTypeValues),
  profile_image: z
    .instanceof(File)
    .nullable()
    .optional()
    .refine(
      (file) => !file || file.type.startsWith("image/"),
      "The profile image must be a valid image file."
    )
    .refine(
      (file) => !file || file.size <= 5 * 1024 * 1024,
      "The profile image must not exceed 5MB."
    ),
  amenity_uuids: z.array(z.string()),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;
