import { CreditCard } from "lucide-react";

import type { DataTableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { LedgerEntry } from "@/features/ledger/types";
import {
  getLedgerStatusBadgeVariant,
  getLedgerStatusLabel,
} from "@/features/ledger/config/ledger-status";

function formatDate(date: string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export type TenantTransactionColumnActions = {
  onSubmitPayment: (entry: LedgerEntry) => void;
};

export function getTenantTransactionColumns({
  onSubmitPayment,
}: TenantTransactionColumnActions): DataTableColumn<LedgerEntry>[] {
  return [
    {
      id: "period",
      header: "Period",
      cell: (entry) => (
        <span className="text-muted-foreground">
          {formatDate(entry.period_start)} – {formatDate(entry.period_end)}
        </span>
      ),
    },
    {
      id: "due_date",
      header: "Due date",
      cell: (entry) => formatDate(entry.due_date),
    },
    {
      id: "amount",
      header: "Amount",
      cell: (entry) => formatAmount(entry.amount),
    },
    {
      id: "amount_paid",
      header: "Paid",
      cell: (entry) => formatAmount(entry.amount_paid),
    },
    {
      id: "balance",
      header: "Balance",
      cell: (entry) => (
        <span className="font-medium">{formatAmount(entry.balance)}</span>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (entry) => (
        <Badge variant={getLedgerStatusBadgeVariant(entry.status)}>
          {getLedgerStatusLabel(entry.status)}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-10",
      cell: (entry) => {
        const canSubmitPayment =
          entry.status !== "paid" && entry.status !== "submitted";

        if (!canSubmitPayment) return null;

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSubmitPayment(entry)}
          >
            <CreditCard className="size-4" />
            Submit payment
          </Button>
        );
      },
    },
  ];
}
