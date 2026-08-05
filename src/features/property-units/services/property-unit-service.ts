import { axiosClient } from "@/lib/axios";
import type { PropertyUnitFormValues } from "../schemas/property-unit-schema";
import type {
  ApiSuccess,
  PaginatedPropertyUnits,
  PropertyUnit,
  PropertyUnitAttachment,
  PropertyUnitDashboardMetrics,
  PropertyUnitListParams,
} from "../types";

export const propertyUnitService = {
  list(params: PropertyUnitListParams) {
    return axiosClient
      .get<PaginatedPropertyUnits>("/property-unit", { params })
      .then((res) => res.data);
  },
  dashboard(propertyUuid: string) {
    return axiosClient
      .get<ApiSuccess<PropertyUnitDashboardMetrics>>("/property-unit/dashboard", {
        params: { property_uuid: propertyUuid },
      })
      .then((res) => res.data.data);
  },
  create(propertyUuid: string, units: PropertyUnitFormValues[]) {
    return axiosClient
      .post<ApiSuccess<PropertyUnit>>("/property-unit", {
        property_uuid: propertyUuid,
        units,
      })
      .then((res) => res.data.data);
  },
  update(uuid: string, data: Partial<PropertyUnitFormValues>) {
    return axiosClient
      .put<ApiSuccess<PropertyUnit>>(`/property-unit/${uuid}`, data)
      .then((res) => res.data.data);
  },
  remove(uuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(`/property-unit/${uuid}`);
  },
  syncAmenities(uuid: string, amenityUuids: string[]) {
    return axiosClient
      .put<ApiSuccess<PropertyUnit>>(`/property-unit/${uuid}/amenities`, {
        amenity_uuids: amenityUuids,
      })
      .then((res) => res.data.data);
  },
  uploadAttachments(uuid: string, images: File[], captions: string[] = []) {
    const formData = new FormData();
    images.forEach((file) => formData.append("images[]", file));
    captions.forEach((caption) => formData.append("captions[]", caption));

    return axiosClient
      .post<ApiSuccess<PropertyUnitAttachment[]>>(
        `/property-unit/${uuid}/attachments`,
        formData,
        { headers: { "Content-Type": undefined } },
      )
      .then((res) => res.data.data);
  },
  removeAttachment(uuid: string, attachmentUuid: string) {
    return axiosClient.delete<ApiSuccess<null>>(
      `/property-unit/${uuid}/attachments/${attachmentUuid}`,
    );
  },
  reorderAttachments(uuid: string, attachmentUuids: string[]) {
    return axiosClient
      .put<ApiSuccess<PropertyUnit>>(
        `/property-unit/${uuid}/attachments/reorder`,
        { attachment_uuids: attachmentUuids },
      )
      .then((res) => res.data.data);
  },
};
