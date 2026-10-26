"use client";

import { useAuthStore } from "@/core/auth/store/auth.store";
import { getPortalRole } from "@/core/auth/utils/portal-role";

import { ParentDashboard } from "./parent/parent-dashboard";
import { StudentDashboard } from "./student/student-dashboard";
import { TeacherDashboard } from "./teacher/teacher-dashboard";

/**
 * Single entry point for /dashboard. Picks the dashboard experience that
 * matches the signed-in user's portal role.
 */
export function RoleDashboard() {
  const user = useAuthStore((state) => state.user);

  if (!user) return null;

  switch (getPortalRole(user)) {
    case "TEACHER":
      return <TeacherDashboard user={user} />;
    case "STUDENT":
      return <StudentDashboard user={user} />;
    case "PARENT":
      return <ParentDashboard user={user} />;
    default:
      return null;
  }
}
