import type { MaintenancePriority } from "../types";

export const MAINTENANCE_PRIORITY_OPTIONS: {
  value: MaintenancePriority;
  label: string;
}[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export function getMaintenancePriorityLabel(
  priority: MaintenancePriority,
): string {
  return (
    MAINTENANCE_PRIORITY_OPTIONS.find((option) => option.value === priority)
      ?.label ?? priority
  );
}

export function getMaintenancePriorityBadgeVariant(
  priority: MaintenancePriority,
): "secondary" | "info" | "warning" | "destructive" {
  switch (priority) {
    case "low":
      return "secondary";
    case "medium":
      return "info";
    case "high":
      return "warning";
    case "urgent":
      return "destructive";
  }
}
