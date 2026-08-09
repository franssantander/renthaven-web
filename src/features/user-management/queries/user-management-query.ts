import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  userManagementService,
  type CreateUserPayload,
  type UpdateUserPayload,
} from "../services/user-management-service";
import type { UserListParams } from "../types";

export function useUsersQuery(params: UserListParams) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => userManagementService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useUserQuery(uuid: string | null) {
  return useQuery({
    queryKey: ["users", uuid],
    queryFn: () => userManagementService.get(uuid as string),
    enabled: !!uuid,
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserPayload) => userManagementService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uuid, data }: { uuid: string; data: UpdateUserPayload }) =>
      userManagementService.update(uuid, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}

export function useDeleteUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => userManagementService.remove(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
