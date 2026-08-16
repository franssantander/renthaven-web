import type { Lease } from "@/features/leases/types";
import type { LedgerStatus, PaginatedLedgerEntries } from "@/features/ledger/types";
import type { ApiSuccess } from "@/features/properties/types";

export type TenantDashboardData = {
  lease: Lease | null;
  transactions: PaginatedLedgerEntries;
};

export type ListTenantTransactionsParams = {
  status?: LedgerStatus;
  page?: number;
  per_page?: number;
};

export type SubmitPaymentPayload = {
  amount: number;
  reference_number?: string;
  notes?: string;
  proof?: File;
};

export type { ApiSuccess, Lease, PaginatedLedgerEntries };
