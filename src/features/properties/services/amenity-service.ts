import { axiosClient } from "@/lib/axios";
import type { ApiSuccess, Amenity } from "../types";

export const amenityService = {
  list() {
    return axiosClient
      .get<ApiSuccess<Amenity[]>>("/amenity")
      .then((res) => res.data.data);
  },
};
