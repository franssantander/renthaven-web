import { axiosClient } from "@/lib/axios";
import type { PropertyFormValues } from "../schemas/property-schema";
import type {
  ApiSuccess,
  PaginatedProperties,
  Property,
  PropertyListParams,
} from "../types";

export const propertyService = {
  list(params: PropertyListParams = {}) {
    return axiosClient
      .get<PaginatedProperties>("/property", { params })
      .then((res) => res.data);
  },
  create(data: PropertyFormValues) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("address", data.address);
    formData.append("type", data.type);
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image);
    }

    return axiosClient
      .post<ApiSuccess<Property>>("/property", formData, {
        headers: { "Content-Type": undefined },
      })
      .then((res) => res.data.data);
  },
  update(uuid: string, data: Partial<PropertyFormValues>) {
    const formData = new FormData();
    formData.append("_method", "PUT");
    if (data.name !== undefined) formData.append("name", data.name);
    if (data.address !== undefined) formData.append("address", data.address);
    if (data.type !== undefined) formData.append("type", data.type);
    if (data.profile_image) {
      formData.append("profile_image", data.profile_image);
    }

    return axiosClient
      .post<ApiSuccess<Property>>(`/property/${uuid}`, formData, {
        headers: { "Content-Type": undefined },
      })
      .then((res) => res.data.data);
  },
  remove(uuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(`/property/${uuid}`);
  },
  syncAmenities(uuid: string, amenityUuids: string[]) {
    return axiosClient
      .put<ApiSuccess<Property>>(`/property/${uuid}/amenities`, {
        amenity_uuids: amenityUuids,
      })
      .then((res) => res.data.data);
  },
  removeAttachment(uuid: string, attachmentUuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(
      `/property/${uuid}/attachments/${attachmentUuid}`,
    );
  },
};
