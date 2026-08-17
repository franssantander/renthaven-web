export type Notification = {
  id: number;
  uuid: string;
  module: string;
  module_label: string;
  action: string;
  action_label: string;
  title: string;
  message: string | null;
  data: Record<string, unknown> | null;
  is_read: boolean;
  read_at: string | null;
  timestamp: string;
  timezone: string;
  time_ago: string;
};

export type NotificationListMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type NotificationListResponse = {
  data: Notification[];
  meta: NotificationListMeta;
};

export type UnreadCountResponse = {
  data: { unread_count: number };
  status: number;
  message: string;
};

export type NotificationResponse = {
  data: Notification;
  status: number;
  message: string;
};
