import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../services/notification-service";
import type {
  NotificationReadFilter,
  NotificationListResponse,
  UnreadCountResponse,
} from "../types";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (filter: NotificationReadFilter) =>
    [...notificationKeys.lists(), filter] as const,
  unreadCount: () => [...notificationKeys.all, "unread-count"] as const,
};

export function useNotificationsQuery(filter: NotificationReadFilter) {
  return useQuery({
    queryKey: notificationKeys.list(filter),
    queryFn: () =>
      notificationService.list({
        per_page: 10,
        read_status: filter === "all" ? undefined : filter,
      }),
  });
}

function updateListAfterMarkRead(
  current: NotificationListResponse,
  filter: NotificationReadFilter,
  uuid: string,
): NotificationListResponse {
  const target = current.data.find(
    (notification) => notification.uuid === uuid && !notification.is_read,
  );

  if (!target) return current;

  if (filter === "unread") {
    const total = Math.max(0, current.meta.total - 1);

    return {
      ...current,
      data: current.data.filter((notification) => notification.uuid !== uuid),
      meta: {
        ...current.meta,
        total,
        last_page: Math.max(1, Math.ceil(total / current.meta.per_page)),
      },
    };
  }

  return {
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
  };
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

      const previousLists =
        queryClient.getQueriesData<NotificationListResponse>({
          queryKey: notificationKeys.lists(),
        });
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      );
      const targetWasUnread = previousLists.some(([, current]) =>
        current?.data.some(
          (notification) =>
            notification.uuid === uuid && !notification.is_read,
        ),
      );

      previousLists.forEach(([queryKey, current]) => {
        if (!current) return;

        const filter = queryKey[2] as NotificationReadFilter;
        queryClient.setQueryData(
          queryKey,
          updateListAfterMarkRead(current, filter, uuid),
        );
      });

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

      return { previousLists, previousCount };
    },
    onError: (_error, _id, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
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

      const previousLists =
        queryClient.getQueriesData<NotificationListResponse>({
          queryKey: notificationKeys.lists(),
        });
      const previousCount = queryClient.getQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
      );
      const now = new Date().toISOString();

      previousLists.forEach(([queryKey, current]) => {
        if (!current) return;

        const filter = queryKey[2] as NotificationReadFilter;

        if (filter === "unread") {
          queryClient.setQueryData<NotificationListResponse>(queryKey, {
            ...current,
            data: [],
            meta: { ...current.meta, last_page: 1, total: 0 },
          });
          return;
        }

        if (filter === "all") {
          queryClient.setQueryData<NotificationListResponse>(queryKey, {
            ...current,
            data: current.data.map((notification) => ({
              ...notification,
              is_read: true,
              read_at: notification.read_at ?? now,
            })),
          });
        }
      });
      queryClient.setQueryData<UnreadCountResponse>(
        notificationKeys.unreadCount(),
        (current) =>
          current
            ? { ...current, data: { unread_count: 0 } }
            : current,
      );

      return { previousLists, previousCount };
    },
    onError: (_error, _variables, context) => {
      context?.previousLists.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
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
