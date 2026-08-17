import { axiosClient } from "@/lib/axios";
import type {
  NotificationListResponse,
  NotificationResponse,
  UnreadCountResponse,
} from "../types";

export const notificationService = {
  list(params?: { per_page?: number; unread_only?: boolean }) {
    return axiosClient
      .get<NotificationListResponse>("/notifications", { params })
      .then((res) => res.data);
  },
  unreadCount() {
    return axiosClient
      .get<UnreadCountResponse>("/notifications/unread-count")
      .then((res) => res.data);
  },
  markRead(uuid: string) {
    return axiosClient
      .put<NotificationResponse>(`/notifications/${uuid}/read`)
      .then((res) => res.data);
  },
  markAllRead() {
    return axiosClient
      .put<{ data: { marked_read: number }; status: number; message: string }>(
        "/notifications/read-all",
      )
      .then((res) => res.data);
  },
};
