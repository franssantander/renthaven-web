"use client";

import { useState } from "react";
import {
  Bell,
  CircleAlert,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  UserPlus,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { NotificationRealtime } from "./notification-realtime";
import {
  useMarkAllReadMutation,
  useMarkReadMutation,
  useNotificationsQuery,
  useUnreadCountQuery,
} from "../queries/notification-query";
import type { Notification, NotificationReadFilter } from "../types";

type NotificationBellProps = {
  userId: number | undefined;
};

function NotificationIcon({ module }: { module: string }) {
  const iconClassName = "size-4";

  switch (module) {
    case "maintenance_request":
      return <Wrench className={iconClassName} />;
    case "billing":
      return <ReceiptText className={iconClassName} />;
    case "user_management":
    case "lease":
      return <UserPlus className={iconClassName} />;
    default:
      return <Bell className={iconClassName} />;
  }
}

function NotificationSkeleton() {
  return (
    <div className="flex gap-3 px-3 py-3">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3.5 w-2/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (uuid: string) => void;
}) {
  return (
    <DropdownMenuItem
      className={cn(
        "items-start gap-3 rounded-none border-b border-border/60 px-3 py-3 last:border-0",
        !notification.is_read && "bg-primary/5",
      )}
      onClick={() => {
        if (!notification.is_read) onRead(notification.uuid);
      }}
    >
      <span
        className={cn(
          "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground",
          !notification.is_read && "bg-primary/10 text-primary",
        )}
      >
        <NotificationIcon module={notification.module} />
      </span>
      <span className="min-w-0 flex-1 space-y-0.5">
        <span className="flex items-start gap-2">
          <span className="line-clamp-1 flex-1 font-medium">
            {notification.title}
          </span>
          {!notification.is_read ? (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          ) : null}
        </span>
        {notification.message ? (
          <span className="line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
            {notification.message}
          </span>
        ) : null}
        <span className="block text-[11px] text-muted-foreground">
          {notification.time_ago}
        </span>
      </span>
    </DropdownMenuItem>
  );
}

export function NotificationBell({ userId }: NotificationBellProps) {
  const [filter, setFilter] = useState<NotificationReadFilter>("all");
  const notificationsQuery = useNotificationsQuery(filter);
  const unreadCountQuery = useUnreadCountQuery();
  const markRead = useMarkReadMutation();
  const markAllRead = useMarkAllReadMutation();

  const notifications = notificationsQuery.data?.data ?? [];
  const unreadCount = unreadCountQuery.data?.data.unread_count ?? 0;
  const badgeLabel = unreadCount > 99 ? "99+" : String(unreadCount);
  const emptyState = {
    all: {
      title: "No notifications yet",
      description: "New activity will appear here.",
    },
    read: {
      title: "No read notifications",
      description: "Notifications you read will appear here.",
    },
    unread: {
      title: "You are all caught up",
      description: "You have no unread notifications.",
    },
  }[filter];

  return (
    <>
      <NotificationRealtime userId={userId} />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="icon"
              className="relative"
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
            />
          }
        >
          <Bell className="size-4" />
          {unreadCount > 0 ? (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-4.5 items-center justify-center rounded-full border-2 border-background bg-destructive px-1 text-[10px] font-semibold leading-4 text-white">
              {badgeLabel}
            </span>
          ) : null}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={8}
          className="w-[min(24rem,calc(100vw-2rem))] overflow-hidden p-0"
        >
          <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
            <div>
              <p className="text-sm font-semibold">Notifications</p>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You are all caught up"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="xs"
              disabled={unreadCount === 0 || markAllRead.isPending}
              onClick={() => markAllRead.mutate()}
            >
              {markAllRead.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : null}
              Mark all read
            </Button>
          </div>

          <Tabs
            value={filter}
            onValueChange={(value) =>
              setFilter(value as NotificationReadFilter)
            }
          >
            <TabsList className="mx-3 mt-3 grid w-auto grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>

            {(["all", "read", "unread"] as const).map((tab) => (
              <TabsContent key={tab} value={tab}>
                {filter === tab ? (
                  <div className="max-h-[min(25rem,62vh)] overflow-y-auto">
                    {notificationsQuery.isLoading ? (
                      <>
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                        <NotificationSkeleton />
                      </>
                    ) : notificationsQuery.isError ? (
                      <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                        <CircleAlert className="size-7 text-destructive" />
                        <div>
                          <p className="text-sm font-medium">
                            Unable to load notifications
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Check your connection and try again.
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void notificationsQuery.refetch()}
                        >
                          <RefreshCw />
                          Try again
                        </Button>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 px-6 py-10 text-center">
                        <span className="flex size-11 items-center justify-center rounded-full bg-muted">
                          <Bell className="size-5 text-muted-foreground" />
                        </span>
                        <div>
                          <p className="text-sm font-medium">
                            {emptyState.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {emptyState.description}
                          </p>
                        </div>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <NotificationRow
                          key={notification.id}
                          notification={notification}
                          onRead={(uuid) => markRead.mutate(uuid)}
                        />
                      ))
                    )}
                  </div>
                ) : null}
              </TabsContent>
            ))}
          </Tabs>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
