import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification-service";
import type {
  NotificationListResponse,
  UnreadCountResponse,
} from "../types";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: () => notificationService.list({ per_page: 10 }),
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: () => notificationService.unreadCount(),
  });
}

export function useMarkReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (uuid: string) => notificationService.markRead(uuid),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousList =
        queryClient.getQueryData<NotificationListResponse>(
          notificationKeys.list(),
        );
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      );
      const targetWasUnread = previousList?.data.some(
        (notification) =>
          notification.uuid === uuid && !notification.is_read,
      );

      queryClient.setQueryData<NotificationListResponse>(
        notificationKeys.list(),
        (current) =>
          current
            ? {
                ...current,
                data: current.data.map((notification) =>
                  notification.uuid === uuid
                    ? {
                        ...notification,
                        is_read: true,
                        read_at: new Date().toISOString(),
                      }
                    : notification,
                ),
              }
            : current,
      );

      if (targetWasUnread) {
        queryClient.setQueryData<UnreadCountResponse>(
          notificationKeys.unreadCount(),
          (current) =>
            current
              ? {
                  ...current,
                  data: {
                    unread_count: Math.max(
                      0,
                      current.data.unread_count - 1,
                    ),
                  },
                }
              : current,
        );
      }

      return { previousList, previousCount };
    },
    onError: (_error, _id, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(
          notificationKeys.list(),
          context.previousList,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          context.previousCount,
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previousList =
        queryClient.getQueryData<NotificationListResponse>(
          notificationKeys.list(),
        );
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      );
      const now = new Date().toISOString();

      queryClient.setQueryData<NotificationListResponse>(
        notificationKeys.list(),
        (current) =>
          current
            ? {
                ...current,
                data: current.data.map((notification) => ({
                  ...notification,
                  is_read: true,
                  read_at: notification.read_at ?? now,
                })),
              }
            : current,
      );
      queryClient.setQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
        (current) =>
          current
            ? { ...current, data: { unread_count: 0 } }
            : current,
      );

      return { previousList, previousCount };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(
          notificationKeys.list(),
          context.previousList,
        );
      }
      if (context?.previousCount) {
        queryClient.setQueryData(
          notificationKeys.unreadCount(),
          context.previousCount,
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
