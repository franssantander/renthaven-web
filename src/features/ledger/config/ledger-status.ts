import type { LedgerStatus } from "../types";

export const LEDGER_STATUS_OPTIONS: {
  value: LedgerStatus;
  label: string;
}[] = [
  { value: "pending", label: "Pending" },
  { value: "partially_paid", label: "Partially paid" },
  { value: "paid", label: "Paid" },
  { value: "overdue", label: "Overdue" },
  { value: "submitted", label: "Awaiting approval" },
];

export function getLedgerStatusLabel(status: LedgerStatus): string {
  return (
    LEDGER_STATUS_OPTIONS.find((option) => option.value === status)?.label ??
    status
  );
}

export function getLedgerStatusBadgeVariant(
  status: LedgerStatus,
): "default" | "outline" | "destructive" | "info" | "warning" {
  switch (status) {
    case "pending":
      return "outline";
    case "partially_paid":
      return "warning";
    case "paid":
      return "default";
    case "overdue":
      return "destructive";
    case "submitted":
      return "info";
  }
}
