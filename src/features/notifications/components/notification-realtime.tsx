"use client";

import { useEcho } from "@laravel/echo-react";
import { useQueryClient } from "@tanstack/react-query";

import { configureEchoClient } from "@/lib/echo/client";
import { notificationKeys } from "../queries/notification-query";
import type {
  Notification,
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
      let isNew = true;

      queryClient.setQueryData<NotificationListResponse>(
        notificationKeys.list(),
        (current) => {
          if (!current) return current;

          if (current.data.some((item) => item.id === notification.id)) {
            isNew = false;
            return current;
          }

          return {
            ...current,
            data: [notification, ...current.data].slice(
              0,
              current.meta.per_page,
            ),
            meta: { ...current.meta, total: current.meta.total + 1 },
          };
        },
      );

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
