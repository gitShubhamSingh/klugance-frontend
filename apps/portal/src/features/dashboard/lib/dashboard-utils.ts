import type { CurrentUser } from "@/core/auth/types/auth.types";
import type { PortalRole } from "@/core/auth/utils/portal-role";
import type { PortalRole as ShellRole } from "@/components/layout/roles/portal-config";

export function getGreeting(date: Date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export function formatToday(date: Date = new Date()) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getDisplayName(user: CurrentUser) {
  return user.first_name?.trim() || "there";
}

export function getFullName(user: CurrentUser) {
  return [user.first_name, user.middle_name, user.last_name]
    .filter(Boolean)
    .join(" ");
}

/** Maps the auth role code (TEACHER) to the layout shell role (teacher). */
export function toShellRole(role: PortalRole): ShellRole {
  return role.toLowerCase() as ShellRole;
}
