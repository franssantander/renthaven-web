import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import type { PropertyFormValues } from "../schemas/property-schema";
import {
  propertyService,
  type PropertyListParams,
} from "../services/property-service";

export function usePropertiesQuery(params: PropertyListParams) {
  return useQuery({
    queryKey: ["properties", params],
    queryFn: () => propertyService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PropertyFormValues) => propertyService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      uuid,
      data,
    }: {
      uuid: string;
      data: Partial<PropertyFormValues>;
    }) => propertyService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}

export function useDeletePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => propertyService.remove(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
    },
  });
}
