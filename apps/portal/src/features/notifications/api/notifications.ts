import { apiClient } from "@/core/api/client";
import { API_ENDPOINTS } from "@/core/api/endpoints";
import type { ApiResponse } from "@/core/api/types/api-response";

/* Always the signed-in user's own notifications (resolved server-side). */

export type NotificationRole = "teacher" | "parent" | "student";

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  /** e.g. HOMEWORK_ASSIGNED; decides where the item links to. */
  event_type: string;
  reference_id: string | null;
  is_read: boolean;
  /** UTC ISO timestamp (no zone suffix). */
  created_at: string;
};

export type NotificationList = { items: AppNotification[]; unread_count: number };

export async function getNotifications(role: NotificationRole) {
  return (await apiClient.get<ApiResponse<NotificationList>>(API_ENDPOINTS.NOTIFICATIONS(role).LIST)).data.data;
}

export async function markNotificationRead(role: NotificationRole, id: string) {
  await apiClient.put(API_ENDPOINTS.NOTIFICATIONS(role).READ(id));
}

export async function markAllNotificationsRead(role: NotificationRole) {
  await apiClient.put(API_ENDPOINTS.NOTIFICATIONS(role).READ_ALL);
}
