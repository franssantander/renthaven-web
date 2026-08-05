import { z } from "zod";

export const MAX_UNIT_PHOTOS = 4;
export const MAX_UNIT_GALLERY_PHOTOS = MAX_UNIT_PHOTOS - 1;

export const propertyUnitStatusValues = [
  "available",
  "occupied",
  "partially_occupied",
  "full",
  "maintenance",
] as const;

export const propertyUnitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be at most 255 characters"),
  capacity: z.coerce
    .number()
    .int("Capacity must be a whole number")
    .min(1, "A unit must be able to house at least one tenant"),
  rent_price: z.coerce.number().min(0, "Rent price cannot be negative"),
  status: z.enum(propertyUnitStatusValues).optional(),
  amenity_uuids: z.array(z.string()),
});

export type PropertyUnitFormValues = z.infer<typeof propertyUnitSchema>;
