import type { CurrentUser } from "../types/auth.types";

export type PortalRole = "TEACHER" | "PARENT" | "STUDENT";

export const PORTAL_DASHBOARDS: Record<PortalRole, string> = {
  TEACHER: "/teacher/dashboard",
  PARENT: "/parent/dashboard",
  STUDENT: "/student/dashboard",
};

const PORTAL_ROLES = new Set<string>([
  "TEACHER",
  "PARENT",
  "STUDENT",
]);

export function getPortalRole(
  user: CurrentUser,
): PortalRole | null {
  const roles = [
    ...new Set(
      user.roles
        .map((role) => role.code)
        .filter((code) => PORTAL_ROLES.has(code)),
    ),
  ];

  return roles.length === 1
    ? (roles[0] as PortalRole)
    : null;
}