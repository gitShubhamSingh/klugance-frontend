"use client";

import Link from "next/link";
import { Bell, CheckCheck, CircleAlert, CircleCheck, Info } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from "@/features/notifications/hooks/use-notifications";
import { describeNotification, relativeTime, type NotificationKind } from "@/features/notifications/lib/notification-display";
import { cn } from "@/lib/utils";

import type { PortalRole } from "../roles/portal-config";

const kindStyles: Record<NotificationKind, { icon: typeof Info; className: string }> = {
  info: { icon: Info, className: "bg-muted text-muted-foreground" },
  warning: { icon: CircleAlert, className: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  success: { icon: CircleCheck, className: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
};

export function NotificationsMenu({ role }: { role: PortalRole }) {
  const query = useNotifications(role);
  const markRead = useMarkNotificationRead(role);
  const markAll = useMarkAllNotificationsRead(role);

  const items = query.data?.items ?? [];
  const unread = query.data?.unread_count ?? 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted data-popup-open:text-foreground"
      >
        <Bell className="size-4.5" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 flex min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-3xs leading-4 font-semibold text-white ring-2 ring-background">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-[min(22rem,calc(100vw-2rem))] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-xs text-muted-foreground">{unread ? `${unread} unread` : "You're all caught up"}</p>
          </div>
          {unread > 0 && (
            <button
              type="button"
              onClick={() => markAll.mutate()}
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <CheckCheck className="size-3.5" />
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="max-h-96 overflow-y-auto p-1.5">
          {query.isLoading ? (
            <p className="p-6 text-center text-xs text-muted-foreground">Loading…</p>
          ) : items.length === 0 ? (
            <p className="p-6 text-center text-xs text-muted-foreground">No notifications yet.</p>
          ) : (
            items.map((n) => {
              const { href, kind } = describeNotification(n, role);
              const style = kindStyles[kind];
              const Icon = style.icon;
              return (
                <DropdownMenuItem
                  key={n.id}
                  render={<Link href={href} />}
                  onClick={() => !n.is_read && markRead.mutate(n.id)}
                  className="items-start gap-3 rounded-lg p-2.5"
                >
                  <span className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg", style.className)}>
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center justify-between gap-2">
                      <span className={cn("truncate text-sm", !n.is_read ? "font-semibold" : "font-medium text-muted-foreground")}>
                        {n.title}
                      </span>
                      <span className="shrink-0 text-2xs text-muted-foreground">{relativeTime(n.created_at)}</span>
                    </span>
                    <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">{n.body}</span>
                  </span>
                  {!n.is_read && <span className="mt-2 size-2 shrink-0 rounded-full bg-rose-500" />}
                </DropdownMenuItem>
              );
            })
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
