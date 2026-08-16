"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getLedgerStatusBadgeVariant,
  getLedgerStatusLabel,
} from "@/features/ledger/config/ledger-status";
import type { LedgerEntry } from "@/features/ledger/types";
import { useTenantDetail } from "../hooks/use-tenant-detail";

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

type TenantDetailViewProps = {
  leaseUuid: string;
  unitUuid: string | null;
};

export function TenantDetailView({ leaseUuid, unitUuid }: TenantDetailViewProps) {
  const { lease, ledgerEntries, isLoading, isError, notFound } =
    useTenantDetail(leaseUuid, unitUuid);

  if (notFound) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          Can&apos;t load this tenant. Go back to the Tenants list and try
          again.
        </CardContent>
      </Card>
    );
  }

  if (isLoading || !lease) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-destructive">
          Failed to load tenant details.
        </CardContent>
      </Card>
    );
  }

  const renter = lease.renter;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {renter ? `${renter.first_name} ${renter.last_name}` : "Unknown tenant"}
          </CardTitle>
          <CardDescription>{renter?.email}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Unit</p>
            <p className="font-medium">
              {lease.property_unit?.property?.name} — {lease.property_unit?.name}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Term</p>
            <p className="font-medium">
              {lease.term_type === "monthly" ? "Monthly" : "Fixed term"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={lease.is_active ? "default" : "outline"}>
              {lease.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Start date</p>
            <p className="font-medium">{formatDate(lease.start_date)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">End date</p>
            <p className="font-medium">{formatDate(lease.end_date)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Security deposit</p>
            <p className="font-medium">{formatAmount(lease.security_deposit)}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>Billing and payment history for this lease.</CardDescription>
        </CardHeader>
        <CardContent>
          {ledgerEntries.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No ledger entries yet.
            </p>
          ) : (
            <div className="overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due date</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ledgerEntries.map((entry: LedgerEntry) => (
                    <TableRow key={entry.uuid}>
                      <TableCell>{formatDate(entry.due_date)}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(entry.period_start)} – {formatDate(entry.period_end)}
                      </TableCell>
                      <TableCell>{formatAmount(entry.amount)}</TableCell>
                      <TableCell>{formatAmount(entry.amount_paid)}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(entry.balance)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getLedgerStatusBadgeVariant(entry.status)}>
                          {getLedgerStatusLabel(entry.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
