import {
  CheckCircle2,
  ImageIcon,
  Mail,
  MoreHorizontal,
  XCircle,
} from "lucide-react";

import type { DataTableColumn } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getLedgerStatusBadgeVariant, getLedgerStatusLabel } from "./ledger-status";
import type { LedgerEntry } from "../types";

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

export type LedgerColumnActions = {
  onMarkPaid: (entry: LedgerEntry) => void;
  onReject: (entry: LedgerEntry) => void;
  onViewProof: (entry: LedgerEntry) => void;
  onSendReminder: (entry: LedgerEntry) => void;
};

type LedgerActionsCellProps = LedgerColumnActions & {
  entry: LedgerEntry;
};

function LedgerActionsCell({
  entry,
  onMarkPaid,
  onReject,
  onViewProof,
  onSendReminder,
}: LedgerActionsCellProps) {
  const canMarkPaid = entry.status !== "paid";
  const canReject = entry.status === "submitted";
  const canViewProof = !!entry.attachments?.length;
  const canSendReminder = entry.status === "overdue";
  const hasActions = canMarkPaid || canReject || canViewProof || canSendReminder;

  if (!hasActions) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canMarkPaid ? (
          <DropdownMenuItem onClick={() => onMarkPaid(entry)}>
            <CheckCircle2 className="size-4" />
            Mark paid
          </DropdownMenuItem>
        ) : null}
        {canReject ? (
          <DropdownMenuItem variant="destructive" onClick={() => onReject(entry)}>
            <XCircle className="size-4" />
            Reject claim
          </DropdownMenuItem>
        ) : null}
        {canSendReminder ? (
          <DropdownMenuItem onClick={() => onSendReminder(entry)}>
            <Mail className="size-4" />
            Send payment reminder
          </DropdownMenuItem>
        ) : null}
        {canViewProof ? (
          <DropdownMenuItem onClick={() => onViewProof(entry)}>
            <ImageIcon className="size-4" />
            View proof
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function getLedgerColumns({
  onMarkPaid,
  onReject,
  onViewProof,
  onSendReminder,
}: LedgerColumnActions): DataTableColumn<LedgerEntry>[] {
  return [
    {
      id: "tenant",
      header: "Tenant",
      cell: (entry) => (
        <p className="font-medium">
          {entry.renter
            ? `${entry.renter.first_name} ${entry.renter.last_name}`
            : "Unknown tenant"}
        </p>
      ),
    },
    {
      id: "property",
      header: "Property",
      cell: (entry) => entry.property_unit?.property?.name ?? "—",
    },
    {
      id: "unit",
      header: "Unit",
      cell: (entry) => entry.property_unit?.name ?? "—",
    },
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
      cell: (entry) => (
        <LedgerActionsCell
          entry={entry}
          onMarkPaid={onMarkPaid}
          onReject={onReject}
          onViewProof={onViewProof}
          onSendReminder={onSendReminder}
        />
      ),
    },
  ];
}
