import { axiosClient } from "@/lib/axios";
import type {
  ApiSuccess,
  LedgerDashboardMetrics,
  LedgerEntry,
  ListLedgerEntriesParams,
  MarkPaidPayload,
  PaginatedLedgerEntries,
  RejectPaymentPayload,
} from "../types";

export const ledgerService = {
  list(params: ListLedgerEntriesParams) {
    return axiosClient
      .get<PaginatedLedgerEntries>("/ledger", { params })
      .then((res) => res.data);
  },
  dashboard() {
    return axiosClient
      .get<ApiSuccess<LedgerDashboardMetrics>>("/ledger/dashboard")
      .then((res) => res.data.data);
  },
  markPaid(uuid: string, data: MarkPaidPayload) {
    return axiosClient
      .put<ApiSuccess<LedgerEntry>>(`/ledger/${uuid}/pay`, data)
      .then((res) => res.data.data);
  },
  rejectPayment(uuid: string, data: RejectPaymentPayload) {
    return axiosClient
      .put<ApiSuccess<LedgerEntry>>(`/ledger/${uuid}/reject`, data)
      .then((res) => res.data.data);
  },
};
