import { axiosClient } from "@/lib/axios";
import type { PaginatedRenters, RenterSearchParams } from "../types";

export const renterService = {
  search(params: RenterSearchParams) {
    return axiosClient
      .get<PaginatedRenters>("/renter", { params })
      .then((res) => res.data);
  },
};
