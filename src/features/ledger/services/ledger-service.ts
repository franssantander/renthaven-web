import { axiosClient } from "@/lib/axios";
import type { ListLedgerEntriesParams, PaginatedLedgerEntries } from "../types";

export const ledgerService = {
  list(params: ListLedgerEntriesParams) {
    return axiosClient
      .get<PaginatedLedgerEntries>("/ledger", { params })
      .then((res) => res.data);
  },
};
