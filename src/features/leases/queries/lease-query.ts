import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { leaseService } from "../services/lease-service";
import type {
  CreateLeasePayload,
  ReassignLeasePayload,
  TerminateLeasePayload,
} from "../types";

export function useUnitLeasesQuery(propertyUnitUuid: string) {
  return useQuery({
    queryKey: ["leases", propertyUnitUuid],
    queryFn: () => leaseService.list({ property_unit_uuid: propertyUnitUuid }),
    enabled: Boolean(propertyUnitUuid),
  });
}

function useInvalidateAfterLeaseChange() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["leases"] });
    queryClient.invalidateQueries({ queryKey: ["property-units"] });
  };
}

export function useAssignTenantMutation() {
  const invalidate = useInvalidateAfterLeaseChange();

  return useMutation({
    mutationFn: (data: CreateLeasePayload) => leaseService.create(data),
    onSuccess: invalidate,
  });
}

export function useReassignLeaseMutation() {
  const invalidate = useInvalidateAfterLeaseChange();

  return useMutation({
    mutationFn: ({
      leaseUuid,
      data,
    }: {
      leaseUuid: string;
      data: ReassignLeasePayload;
    }) => leaseService.reassign(leaseUuid, data),
    onSuccess: invalidate,
  });
}

export function useTerminateLeaseMutation() {
  const invalidate = useInvalidateAfterLeaseChange();

  return useMutation({
    mutationFn: ({
      leaseUuid,
      data,
    }: {
      leaseUuid: string;
      data: TerminateLeasePayload;
    }) => leaseService.terminate(leaseUuid, data),
    onSuccess: invalidate,
  });
}
