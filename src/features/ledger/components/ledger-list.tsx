"use client";

import { DataTable } from "@/components/shared/data-table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getLedgerColumns } from "../config/ledger-columns";
import { LEDGER_STATUS_OPTIONS } from "../config/ledger-status";
import { useLedgerList } from "../hooks/use-ledger-list";
import type { LedgerEntry, LedgerStatus } from "../types";
import { LedgerDashboardCards } from "./ledger-dashboard-cards";
import { MarkPaidDialog } from "./mark-paid-dialog";
import { RejectPaymentDialog } from "./reject-payment-dialog";

export function LedgerList() {
  const {
    entries,
    meta,
    isLoading,
    isFetching,
    isError,
    error,
    page,
    setPage,
    perPage,
    handlePerPageChange,
    status,
    handleStatusChange,
    refetch,
    payingEntry,
    setPayingEntry,
    rejectingEntry,
    setRejectingEntry,
  } = useLedgerList();

  const handleViewProof = (entry: LedgerEntry) => {
    const attachment = entry.attachments?.[0];
    if (attachment) {
      window.open(attachment.url, "_blank", "noopener,noreferrer");
    }
  };

  const columns = getLedgerColumns({
    onMarkPaid: setPayingEntry,
    onReject: setRejectingEntry,
    onViewProof: handleViewProof,
  });

  return (
    <div className="flex flex-col gap-6">
      <LedgerDashboardCards />

      <Card>
        <CardHeader>
          <CardTitle>Ledger</CardTitle>
          <CardDescription>
            Track rent billing and payments across your properties.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={entries}
            getRowId={(entry) => entry.uuid}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            errorMessage={error?.message}
            emptyMessage="No ledger entries yet."
            onRefresh={refetch}
            page={page}
            onPageChange={setPage}
            lastPage={meta?.last_page}
            perPage={perPage}
            onPerPageChange={handlePerPageChange}
            toolbarActions={
              <Select
                value={status}
                onValueChange={(value: LedgerStatus | "all" | null) =>
                  value && handleStatusChange(value)
                }
              >
                <SelectTrigger size="sm">
                  <SelectValue>
                    {(value: LedgerStatus | "all") =>
                      value === "all"
                        ? "All statuses"
                        : LEDGER_STATUS_OPTIONS.find(
                            (option) => option.value === value,
                          )?.label
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {LEDGER_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
        </CardContent>
      </Card>

      <MarkPaidDialog
        open={!!payingEntry}
        onOpenChange={(open) => {
          if (!open) setPayingEntry(null);
        }}
        entry={payingEntry}
      />

      <RejectPaymentDialog
        open={!!rejectingEntry}
        onOpenChange={(open) => {
          if (!open) setRejectingEntry(null);
        }}
        entry={rejectingEntry}
      />
    </div>
  );
}
