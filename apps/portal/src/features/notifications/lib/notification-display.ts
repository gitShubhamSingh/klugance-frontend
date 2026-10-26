import { parseTimestamp } from "@/features/communication/lib/chat-utils";

import type { AppNotification, NotificationRole } from "../api/notifications";

export type NotificationKind = "info" | "warning" | "success";

/** Where a notification leads and how it looks, by event type. */
export function describeNotification(n: AppNotification, role: NotificationRole): { href: string; kind: NotificationKind } {
  switch (n.event_type) {
    case "HOMEWORK_ASSIGNED":
      return { href: `/${role}/homework`, kind: "info" };
    case "HOMEWORK_SUBMITTED":
      return { href: "/teacher/homework", kind: "info" };
    case "HOMEWORK_REVIEWED":
      return { href: `/${role}/homework`, kind: /rejected/i.test(n.title) ? "warning" : "success" };
    default:
      return { href: "/dashboard", kind: "info" };
  }
}

export function relativeTime(iso: string, now = Date.now()) {
  const seconds = Math.max(0, Math.round((now - parseTimestamp(iso).getTime()) / 1000));
  if (seconds < 60) return "Just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return parseTimestamp(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}
