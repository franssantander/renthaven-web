import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { ledgerService } from "../services/ledger-service";
import type {
  ListLedgerEntriesParams,
  MarkPaidPayload,
  RejectPaymentPayload,
} from "../types";

export function useLeaseLedgerQuery(leaseUuid: string, enabled = true) {
  return useQuery({
    queryKey: ["ledger", leaseUuid],
    queryFn: () => ledgerService.list({ lease_uuid: leaseUuid }),
    enabled: enabled && Boolean(leaseUuid),
  });
}

export function useLedgerEntriesQuery(params: ListLedgerEntriesParams) {
  return useQuery({
    queryKey: ["ledger", "list", params],
    queryFn: () => ledgerService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useLedgerDashboardQuery() {
  return useQuery({
    queryKey: ["ledger", "dashboard"],
    queryFn: () => ledgerService.dashboard(),
  });
}

function useInvalidateAfterLedgerChange() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["ledger"] });
  };
}

export function useMarkPaidMutation() {
  const invalidate = useInvalidateAfterLedgerChange();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: MarkPaidPayload;
    }) => ledgerService.markPaid(uuid, data),
    onSuccess: invalidate,
  });
}

export function useRejectPaymentMutation() {
  const invalidate = useInvalidateAfterLedgerChange();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: RejectPaymentPayload;
    }) => ledgerService.rejectPayment(uuid, data),
    onSuccess: invalidate,
  });
}

export function useSendReminderMutation() {
  const invalidate = useInvalidateAfterLedgerChange();

  return useMutation({
    mutationFn: (uuid: string) => ledgerService.sendReminder(uuid),
    onSuccess: invalidate,
  });
}
