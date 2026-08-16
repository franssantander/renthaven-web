import type { MaintenanceCategory } from "../types";

export const MAINTENANCE_CATEGORY_OPTIONS: {
  value: MaintenanceCategory;
  label: string;
}[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electrical", label: "Electrical" },
  { value: "hvac", label: "HVAC" },
  { value: "appliance", label: "Appliance" },
  { value: "structural", label: "Structural" },
  { value: "pest_control", label: "Pest control" },
  { value: "other", label: "Other" },
];

export function getMaintenanceCategoryLabel(
  category: MaintenanceCategory,
): string {
  return (
    MAINTENANCE_CATEGORY_OPTIONS.find((option) => option.value === category)
      ?.label ?? category
  );
}
