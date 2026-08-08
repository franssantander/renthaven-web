import { useQuery } from "@tanstack/react-query";

import { renterService } from "../services/renter-service";

export function useRenterSearchQuery(search: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["renters", "search", search],
    queryFn: () => renterService.search({ search: search || undefined }),
    enabled,
  });
}
