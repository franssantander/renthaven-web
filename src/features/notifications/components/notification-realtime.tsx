"use client";

import { useEcho } from "@laravel/echo-react";
import { useQueryClient } from "@tanstack/react-query";

import { configureEchoClient } from "@/lib/echo/client";
import { notificationKeys } from "../queries/notification-query";
import type {
  Notification,
  NotificationReadFilter,
  NotificationListResponse,
  UnreadCountResponse,
} from "../types";

type NotificationRealtimeProps = {
  userId: number | undefined;
};

function NotificationRealtimeListener({ userId }: { userId: number }) {
  const queryClient = useQueryClient();

  useEcho<Notification>(
    `users.${userId}`,
    ".notification.created",
    (notification) => {
      const cachedLists =
        queryClient.getQueriesData<NotificationListResponse>({
          queryKey: notificationKeys.lists(),
        });
      const isNew = !cachedLists.some(([, current]) =>
        current?.data.some((item) => item.id === notification.id),
      );

      cachedLists.forEach(([queryKey, current]) => {
        if (!current) return;

        const filter = queryKey[2] as NotificationReadFilter;
        const matchesFilter =
          filter === "all" ||
          (filter === "read" && notification.is_read) ||
          (filter === "unread" && !notification.is_read);

        if (
          !matchesFilter ||
          current.data.some((item) => item.id === notification.id)
        ) {
          return;
        }

        queryClient.setQueryData<NotificationListResponse>(queryKey, {
          ...current,
          data: [notification, ...current.data].slice(
            0,
            current.meta.per_page,
          ),
          meta: { ...current.meta, total: current.meta.total + 1 },
        });
      });

      if (isNew && !notification.is_read) {
        queryClient.setQueryData<UnreadCountResponse>(
          notificationKeys.unreadCount(),
          (current) =>
            current
              ? {
                  ...current,
                  data: {
                    unread_count: current.data.unread_count + 1,
                  },
                }
              : current,
        );
      }

      void queryClient.invalidateQueries({
        queryKey: notificationKeys.all,
      });
    },
    [queryClient],
  );

  return null;
}

export function NotificationRealtime({ userId }: NotificationRealtimeProps) {
  if (!userId || !configureEchoClient()) return null;

  return <NotificationRealtimeListener userId={userId} />;
}
