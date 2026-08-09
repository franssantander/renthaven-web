import { useQuery } from "@tanstack/react-query";

import { tenantBusinessOptionService } from "../services/tenant-business-service";

export function useTenantBusinessOptionsQuery(enabled: boolean) {
  return useQuery({
    queryKey: ["tenant-business-options"],
    queryFn: () => tenantBusinessOptionService.list(),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
