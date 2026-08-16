"use client";

import type { ReactNode } from "react";
import { RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { DepositStatus, LeaseTermType } from "@/features/leases/types";
import { cn } from "@/lib/utils/utils";
import { useTenantLeaseQuery } from "../queries/tenant-query";

const TERM_TYPE_LABELS: Record<LeaseTermType, string> = {
  fixed_term: "Fixed term",
  monthly: "Monthly",
};

const DEPOSIT_STATUS_LABELS: Record<DepositStatus, string> = {
  held: "Held",
  partially_refunded: "Partially refunded",
  refunded: "Refunded",
  forfeited: "Forfeited",
};

function formatDate(date: string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatAmount(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function LeaseField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export function TenantLeaseCard() {
  const {
    data: lease,
    isLoading,
    isFetching,
    refetch,
  } = useTenantLeaseQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!lease) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Current lease</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You don&apos;t have an active lease on file.
          </p>
        </CardContent>
      </Card>
    );
  }

  const propertyUnit = lease.property_unit;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Current lease
          <Badge variant={lease.is_active ? "default" : "outline"}>
            {lease.is_active ? "Active" : "Inactive"}
          </Badge>
        </CardTitle>
        <CardAction>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="Refresh lease"
          >
            <RefreshCw
              className={cn("size-4", isFetching && "animate-spin")}
            />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <LeaseField
          label="Property / unit"
          value={
            propertyUnit
              ? propertyUnit.property?.name
                ? `${propertyUnit.property.name} – ${propertyUnit.name}`
                : propertyUnit.name
              : "—"
          }
        />
        <LeaseField
          label="Term type"
          value={TERM_TYPE_LABELS[lease.term_type]}
        />
        <LeaseField
          label="Lease period"
          value={`${formatDate(lease.start_date)} – ${formatDate(lease.end_date)}`}
        />
        <LeaseField
          label="Security deposit"
          value={formatAmount(lease.security_deposit)}
        />
        <LeaseField
          label="Advance rent"
          value={
            lease.advance_rent_applied_at
              ? `${formatAmount(lease.advance_rent)} (applied ${formatDate(lease.advance_rent_applied_at)})`
              : formatAmount(lease.advance_rent)
          }
        />
        <LeaseField
          label="Deposit status"
          value={DEPOSIT_STATUS_LABELS[lease.deposit_status]}
        />
        {lease.deposit_refunded_amount !== null ? (
          <LeaseField
            label="Deposit refunded"
            value={`${formatAmount(lease.deposit_refunded_amount)}${
              lease.deposit_refunded_at
                ? ` on ${formatDate(lease.deposit_refunded_at)}`
                : ""
            }`}
          />
        ) : null}
        {lease.deposit_deductions && lease.deposit_deductions.length > 0 ? (
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs text-muted-foreground">
              Deposit deductions
            </p>
            <ul className="mt-1 space-y-1 text-sm">
              {lease.deposit_deductions.map((deduction, index) => (
                <li key={index} className="flex justify-between gap-4">
                  <span>{deduction.description}</span>
                  <span className="font-medium">
                    {formatAmount(deduction.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
