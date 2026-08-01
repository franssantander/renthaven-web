import { axiosClient } from "@/lib/axios";
import type { PropertyFormValues } from "../schemas/property-schema";
import type { PaginatedProperties, Property } from "../types";

export type PropertyListParams = {
  page?: number;
  per_page?: number;
};

type ApiSuccess<T> = { data: T; status: number; message: string };

export const propertyService = {
  list(params: PropertyListParams = {}) {
    return axiosClient
      .get<PaginatedProperties>("/property", { params })
      .then((res) => res.data);
  },
  create(data: PropertyFormValues) {
    return axiosClient
      .post<ApiSuccess<Property>>("/property", data)
      .then((res) => res.data.data);
  },
  update(uuid: string, data: Partial<PropertyFormValues>) {
    return axiosClient
      .put<ApiSuccess<Property>>(`/property/${uuid}`, data)
      .then((res) => res.data.data);
  },
  remove(uuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(`/property/${uuid}`);
  },
};
