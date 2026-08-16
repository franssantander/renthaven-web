import { axiosClient } from "@/lib/axios";
import type {
  ApiSuccess,
  CreateMaintenanceRequestPayload,
  ListMaintenanceRequestsParams,
  MaintenanceDashboardMetrics,
  MaintenanceRequest,
  PaginatedMaintenanceRequests,
  UpdateMaintenanceRequestStatusPayload,
} from "../types";

export const maintenanceService = {
  list(params: ListMaintenanceRequestsParams) {
    return axiosClient
      .get<PaginatedMaintenanceRequests>("/maintenance-request", { params })
      .then((res) => res.data);
  },
  get(uuid: string) {
    return axiosClient
      .get<ApiSuccess<MaintenanceRequest>>(`/maintenance-request/${uuid}`)
      .then((res) => res.data.data);
  },
  dashboard() {
    return axiosClient
      .get<ApiSuccess<MaintenanceDashboardMetrics>>(
        "/maintenance-request/dashboard",
      )
      .then((res) => res.data.data);
  },
  create(data: CreateMaintenanceRequestPayload) {
    return axiosClient
      .post<ApiSuccess<MaintenanceRequest>>("/maintenance-request", data)
      .then((res) => res.data.data);
  },
  updateStatus(uuid: string, data: UpdateMaintenanceRequestStatusPayload) {
    return axiosClient
      .put<ApiSuccess<MaintenanceRequest>>(
        `/maintenance-request/${uuid}/status`,
        data,
      )
      .then((res) => res.data.data);
  },
};
