"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationList,
  type NotificationRole,
} from "../api/notifications";

const key = (role: NotificationRole) => ["notifications", role] as const;

// No push channel yet: refresh every 30s (paused in background tabs).
export function useNotifications(role: NotificationRole) {
  return useQuery({ queryKey: key(role), queryFn: () => getNotifications(role), refetchInterval: 30_000 });
}

export function useMarkNotificationRead(role: NotificationRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => markNotificationRead(role, id),
    retry: false,
    onMutate: (id) =>
      queryClient.setQueryData<NotificationList>(key(role), (old) =>
        old
          ? {
              items: old.items.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
              unread_count: Math.max(0, old.unread_count - (old.items.some((n) => n.id === id && !n.is_read) ? 1 : 0)),
            }
          : old,
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key(role) }),
  });
}

export function useMarkAllNotificationsRead(role: NotificationRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => markAllNotificationsRead(role),
    retry: false,
    onMutate: () =>
      queryClient.setQueryData<NotificationList>(key(role), (old) =>
        old ? { items: old.items.map((n) => ({ ...n, is_read: true })), unread_count: 0 } : old,
      ),
    onSettled: () => queryClient.invalidateQueries({ queryKey: key(role) }),
  });
}
