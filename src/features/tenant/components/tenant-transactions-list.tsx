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
import { LEDGER_STATUS_OPTIONS } from "@/features/ledger/config/ledger-status";
import type { LedgerStatus } from "@/features/ledger/types";
import { getTenantTransactionColumns } from "../config/tenant-transaction-columns";
import { useTenantTransactionsList } from "../hooks/use-tenant-transactions-list";
import { SubmitPaymentDialog } from "./submit-payment-dialog";

export function TenantTransactionsList() {
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
    submittingEntry,
    setSubmittingEntry,
  } = useTenantTransactionsList();

  const columns = getTenantTransactionColumns({
    onSubmitPayment: setSubmittingEntry,
  });

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Transaction history</CardTitle>
          <CardDescription>
            Track your rent charges and submit proof of payment.
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
            emptyMessage="No transactions yet."
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

      <SubmitPaymentDialog
        open={!!submittingEntry}
        onOpenChange={(open) => {
          if (!open) setSubmittingEntry(null);
        }}
        entry={submittingEntry}
      />
    </>
  );
}
