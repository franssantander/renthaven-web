import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { amenityService } from "@/features/properties/services/amenity-service";
import type { PropertyUnitFormValues } from "../schemas/property-unit-schema";
import { propertyUnitService } from "../services/property-unit-service";

const DEFAULT_PER_PAGE = 15;

export function usePropertyUnitsInfiniteQuery(
  propertyUuid: string,
  perPage: number = DEFAULT_PER_PAGE,
) {
  return useInfiniteQuery({
    queryKey: ["property-units", propertyUuid],
    queryFn: ({ pageParam }) =>
      propertyUnitService.list({
        property_uuid: propertyUuid,
        page: pageParam,
        per_page: perPage,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.meta.current_page < lastPage.meta.last_page
        ? lastPage.meta.current_page + 1
        : undefined,
  });
}

export function usePropertyUnitQuery(uuid: string) {
  return useQuery({
    queryKey: ["property-units", "detail", uuid],
    queryFn: () => propertyUnitService.get(uuid),
    enabled: Boolean(uuid),
  });
}

export function usePropertyUnitDashboardQuery(propertyUuid: string) {
  return useQuery({
    queryKey: ["property-units", propertyUuid, "dashboard"],
    queryFn: () => propertyUnitService.dashboard(propertyUuid),
  });
}

export function useUnitAmenitiesQuery() {
  return useQuery({
    queryKey: ["amenities"],
    queryFn: amenityService.list,
    select: (amenities) =>
      amenities.filter(
        (amenity) => amenity.scope === "unit" || amenity.scope === "both",
      ),
  });
}

export function useCreatePropertyUnitMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (units: PropertyUnitFormValues[]) =>
      propertyUnitService.create(propertyUuid, units),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useUpdatePropertyUnitMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: Partial<PropertyUnitFormValues>;
    }) => propertyUnitService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useDeletePropertyUnitMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => propertyUnitService.remove(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useSyncPropertyUnitAmenitiesMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      amenityUuids,
    }: {
      uuid: string;
      amenityUuids: string[];
    }) => propertyUnitService.syncAmenities(uuid, amenityUuids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useUploadPropertyUnitAttachmentsMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      images,
      captions,
    }: {
      uuid: string;
      images: File[];
      captions?: string[];
    }) => propertyUnitService.uploadAttachments(uuid, images, captions),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useDeletePropertyUnitAttachmentMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      attachmentUuid,
    }: {
      uuid: string;
      attachmentUuid: string;
    }) => propertyUnitService.removeAttachment(uuid, attachmentUuid),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}

export function useReorderPropertyUnitAttachmentsMutation(propertyUuid: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      attachmentUuids,
    }: {
      uuid: string;
      attachmentUuids: string[];
    }) => propertyUnitService.reorderAttachments(uuid, attachmentUuids),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["property-units", propertyUuid],
      });
    },
  });
}
