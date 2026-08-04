import type { PropertyUnitStatus } from "../types";

export const UNIT_STATUS_OPTIONS: { value: PropertyUnitStatus; label: string }[] = [
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "partially_occupied", label: "Partially occupied" },
  { value: "full", label: "Full" },
  { value: "maintenance", label: "Maintenance" },
];

export function getUnitStatusLabel(status: PropertyUnitStatus): string {
  return (
    UNIT_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function getUnitStatusBadgeVariant(
  status: PropertyUnitStatus,
): "default" | "secondary" | "outline" | "destructive" {
  switch (status) {
    case "available":
      return "default";
    case "maintenance":
      return "destructive";
    case "occupied":
    case "full":
      return "secondary";
    default:
      return "outline";
  }
}
