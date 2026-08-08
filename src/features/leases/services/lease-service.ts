import { axiosClient } from "@/lib/axios";
import type {
  ApiSuccess,
  CreateLeasePayload,
  Lease,
  ListLeasesParams,
  PaginatedLeases,
  ReassignLeasePayload,
  TerminateLeasePayload,
} from "../types";

export const leaseService = {
  list(params: ListLeasesParams) {
    return axiosClient
      .get<PaginatedLeases>("/lease", { params })
      .then((res) => res.data);
  },
  create(data: CreateLeasePayload) {
    return axiosClient
      .post<ApiSuccess<Lease[]>>("/lease", data)
      .then((res) => res.data.data);
  },
  reassign(leaseUuid: string, data: ReassignLeasePayload) {
    return axiosClient
      .put<ApiSuccess<Lease>>(`/lease/${leaseUuid}`, data)
      .then((res) => res.data.data);
  },
  terminate(leaseUuid: string, data: TerminateLeasePayload) {
    return axiosClient
      .delete<ApiSuccess<Lease>>(`/lease/${leaseUuid}`, { data })
      .then((res) => res.data.data);
  },
};
