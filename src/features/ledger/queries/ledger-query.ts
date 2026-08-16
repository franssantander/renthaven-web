import { useQuery } from "@tanstack/react-query";

import { ledgerService } from "../services/ledger-service";

export function useLeaseLedgerQuery(leaseUuid: string, enabled = true) {
  return useQuery({
    queryKey: ["ledger", leaseUuid],
    queryFn: () => ledgerService.list({ lease_uuid: leaseUuid }),
    enabled: enabled && Boolean(leaseUuid),
  });
}
