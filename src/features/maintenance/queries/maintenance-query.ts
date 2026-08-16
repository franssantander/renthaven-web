import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { maintenanceService } from "../services/maintenance-service";
import type {
  CreateMaintenanceRequestPayload,
  ListMaintenanceRequestsParams,
  UpdateMaintenanceRequestStatusPayload,
} from "../types";

export function useMaintenanceRequestsQuery(
  params: ListMaintenanceRequestsParams,
) {
  return useQuery({
    queryKey: ["maintenance-requests", params],
    queryFn: () => maintenanceService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useMaintenanceRequestQuery(uuid: string) {
  return useQuery({
    queryKey: ["maintenance-requests", "detail", uuid],
    queryFn: () => maintenanceService.get(uuid),
    enabled: Boolean(uuid),
  });
}

export function useMaintenanceDashboardQuery() {
  return useQuery({
    queryKey: ["maintenance-requests", "dashboard"],
    queryFn: () => maintenanceService.dashboard(),
  });
}

function useInvalidateAfterMaintenanceChange() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["maintenance-requests"] });
  };
}

export function useCreateMaintenanceRequestMutation() {
  const invalidate = useInvalidateAfterMaintenanceChange();

  return useMutation({
    mutationFn: (data: CreateMaintenanceRequestPayload) =>
      maintenanceService.create(data),
    onSuccess: invalidate,
  });
}

export function useUpdateMaintenanceStatusMutation() {
  const invalidate = useInvalidateAfterMaintenanceChange();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: UpdateMaintenanceRequestStatusPayload;
    }) => maintenanceService.updateStatus(uuid, data),
    onSuccess: invalidate,
  });
}
