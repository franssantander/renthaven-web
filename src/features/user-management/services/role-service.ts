import { axiosClient } from "@/lib/axios";
import type { ApiSuccess, UserRoleOption } from "../types";

export const roleService = {
  list() {
    return axiosClient
      .get<ApiSuccess<UserRoleOption[]>>("/roles")
      .then((res) => res.data.data);
  },
};
