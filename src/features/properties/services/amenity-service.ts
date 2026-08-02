import { axiosClient } from "@/lib/axios";
import type { Amenity } from "../types";

type ApiSuccess<T> = { data: T; status: number; message: string };

export const amenityService = {
  list() {
    return axiosClient
      .get<ApiSuccess<Amenity[]>>("/amenity")
      .then((res) => res.data.data);
  },
};
