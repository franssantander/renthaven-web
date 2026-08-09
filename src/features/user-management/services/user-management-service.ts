import { axiosClient } from "@/lib/axios";
import type { ApiSuccess, PaginatedUsers, SystemUser, UserListParams } from "../types";

export type CreateUserPayload = {
  first_name: string;
  middle_name?: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_uuid: string;
  tenant_business_uuid?: string;
};

export type UpdateUserPayload = Partial<CreateUserPayload>;

export const userManagementService = {
  list(params: UserListParams = {}) {
    return axiosClient
      .get<PaginatedUsers>("/user-management", { params })
      .then((res) => res.data);
  },
  get(uuid: string) {
    return axiosClient
      .get<ApiSuccess<SystemUser>>(`/user-management/${uuid}`)
      .then((res) => res.data.data);
  },
  create(data: CreateUserPayload) {
    return axiosClient
      .post<ApiSuccess<SystemUser>>("/user-management", data)
      .then((res) => res.data.data);
  },
  update(uuid: string, data: UpdateUserPayload) {
    return axiosClient
      .put<ApiSuccess<SystemUser>>(`/user-management/${uuid}`, data)
      .then((res) => res.data.data);
  },
  remove(uuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(`/user-management/${uuid}`);
  },
};
