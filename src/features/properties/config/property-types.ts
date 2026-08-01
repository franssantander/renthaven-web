import type { PropertyType } from "../types";

export const PROPERTY_TYPE_OPTIONS: { value: PropertyType; label: string }[] = [
  { value: "dorm", label: "Dorm" },
  { value: "apartment", label: "Apartment" },
  { value: "condo", label: "Condo" },
  { value: "town_house", label: "Townhouse" },
];

export function getPropertyTypeLabel(type: PropertyType): string {
  return (
    PROPERTY_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
    type
  );
}
