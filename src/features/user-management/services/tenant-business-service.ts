import { axiosClient } from "@/lib/axios";
import type { PaginatedTenantBusinessOptions, TenantBusinessOption } from "../types";

export const tenantBusinessOptionService = {
  list() {
    return axiosClient
      .get<PaginatedTenantBusinessOptions>("/tenant-business", {
        params: { per_page: 100 },
      })
      .then((res) => res.data.data);
  },
};

export type { TenantBusinessOption };
