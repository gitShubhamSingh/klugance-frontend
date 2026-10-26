import type { PortalRole } from "../roles/portal-config";

/**
 * Per-role look for the navbar (neutral, matching school-admin).
 * Notifications come from the API (features/notifications).
 */

export const roleAccent: Record<
  PortalRole,
  { label: string; badge: string; dot: string; ring: string }
> = {
  teacher: {
    label: "Teacher",
    badge: "bg-muted text-foreground",
    dot: "bg-muted-foreground",
    ring: "ring-border",
  },
  student: {
    label: "Student",
    badge: "bg-muted text-foreground",
    dot: "bg-muted-foreground",
    ring: "ring-border",
  },
  parent: {
    label: "Parent",
    badge: "bg-muted text-foreground",
    dot: "bg-muted-foreground",
    ring: "ring-border",
  },
};
