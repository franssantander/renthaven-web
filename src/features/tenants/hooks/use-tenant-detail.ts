"use client";

import { useLeaseLedgerQuery } from "@/features/ledger/queries/ledger-query";
import { useUnitLeasesQuery } from "@/features/leases/queries/lease-query";

export function useTenantDetail(leaseUuid: string, unitUuid: string | null) {
  const unitLeases = useUnitLeasesQuery(unitUuid ?? "");
  const lease = unitLeases.data?.data.find((entry) => entry.uuid === leaseUuid);

  const ledger = useLeaseLedgerQuery(leaseUuid, Boolean(lease));

  const notFound =
    !unitUuid ||
    (!unitLeases.isLoading && !unitLeases.isFetching && !lease);

  return {
    lease,
    ledgerEntries: ledger.data?.data ?? [],
    isLoading: unitLeases.isLoading || (Boolean(lease) && ledger.isLoading),
    isError: unitLeases.isError || ledger.isError,
    notFound,
  };
}
