import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { tenantService } from "../services/tenant-service";
import type {
  ListTenantTransactionsParams,
  SubmitPaymentPayload,
  TenantDashboardData,
} from "../types";

const DEFAULT_PER_PAGE = 15;

function isDefaultFirstPage(params: ListTenantTransactionsParams) {
  return (
    (params.page ?? 1) === 1 &&
    (params.per_page ?? DEFAULT_PER_PAGE) === DEFAULT_PER_PAGE &&
    !params.status
  );
}

export function useTenantDashboardQuery() {
  return useQuery({
    queryKey: ["tenant", "dashboard"],
    queryFn: () => tenantService.dashboard(),
  });
}

export function useTenantLeaseQuery() {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ["tenant", "lease"],
    queryFn: () => tenantService.getLease(),
    initialData: () =>
      queryClient.getQueryData<TenantDashboardData>(["tenant", "dashboard"])
        ?.lease,
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(["tenant", "dashboard"])?.dataUpdatedAt,
  });
}

export function useTenantTransactionsQuery(
  params: ListTenantTransactionsParams,
) {
  const queryClient = useQueryClient();
  const seedFromDashboard = isDefaultFirstPage(params);

  return useQuery({
    queryKey: ["tenant", "transactions", params],
    queryFn: () => tenantService.listTransactions(params),
    placeholderData: keepPreviousData,
    initialData: seedFromDashboard
      ? () =>
          queryClient.getQueryData<TenantDashboardData>(["tenant", "dashboard"])
            ?.transactions
      : undefined,
    initialDataUpdatedAt: seedFromDashboard
      ? () => queryClient.getQueryState(["tenant", "dashboard"])?.dataUpdatedAt
      : undefined,
  });
}

export function useSubmitPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: SubmitPaymentPayload;
    }) => tenantService.submitPayment(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenant", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["tenant", "dashboard"] });
    },
  });
}
