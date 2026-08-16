import { axiosClient } from "@/lib/axios";
import type {
  ApiSuccess,
  ListTenantTransactionsParams,
  PaginatedLedgerEntries,
  SubmitPaymentPayload,
  TenantDashboardData,
} from "../types";
import type { Lease } from "@/features/leases/types";
import type { LedgerEntry } from "@/features/ledger/types";

export const tenantService = {
  dashboard() {
    return axiosClient
      .get<ApiSuccess<TenantDashboardData>>("/renter-portal/dashboard")
      .then((res) => res.data.data);
  },
  getLease() {
    return axiosClient
      .get<ApiSuccess<Lease | null>>("/renter-portal/lease")
      .then((res) => res.data.data);
  },
  listTransactions(params: ListTenantTransactionsParams) {
    return axiosClient
      .get<ApiSuccess<PaginatedLedgerEntries>>("/renter-portal/transactions", {
        params,
      })
      .then((res) => res.data.data);
  },
  submitPayment(uuid: string, data: SubmitPaymentPayload) {
    const formData = new FormData();
    formData.append("amount", String(data.amount));
    if (data.reference_number) {
      formData.append("reference_number", data.reference_number);
    }
    if (data.notes) {
      formData.append("notes", data.notes);
    }
    if (data.proof) {
      formData.append("proof", data.proof);
    }

    return axiosClient
      .put<ApiSuccess<LedgerEntry>>(
        `/ledger/mine/${uuid}/submit-payment`,
        formData,
        { headers: { "Content-Type": undefined } },
      )
      .then((res) => res.data.data);
  },
};
