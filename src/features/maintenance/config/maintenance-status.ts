import type { MaintenanceRequestStatus } from "../types";

export const MAINTENANCE_STATUS_OPTIONS: {
  value: MaintenanceRequestStatus;
  label: string;
}[] = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In progress" },
  { value: "resolved", label: "Resolved" },
  { value: "cancelled", label: "Cancelled" },
];

export function getMaintenanceStatusLabel(
  status: MaintenanceRequestStatus,
): string {
  return (
    MAINTENANCE_STATUS_OPTIONS.find((option) => option.value === status)
      ?.label ?? status
  );
}

export function getMaintenanceStatusBadgeVariant(
  status: MaintenanceRequestStatus,
): "default" | "secondary" | "outline" | "destructive" | "info" | "warning" {
  switch (status) {
    case "open":
      return "info";
    case "in_progress":
      return "warning";
    case "resolved":
      return "default";
    case "cancelled":
      return "outline";
    default:
      return "secondary";
  }
}

export function isTerminalStatus(status: MaintenanceRequestStatus): boolean {
  return status === "resolved" || status === "cancelled";
}
