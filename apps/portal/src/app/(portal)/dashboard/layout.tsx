"use client";

import type { ReactNode } from "react";

import { PortalShell } from "@/components/layout/portal-shell";
import { ProtectedRoute } from "@/core/auth/components/protected-route";
import { useAuthStore } from "@/core/auth/store/auth.store";
import { getPortalRole } from "@/core/auth/utils/portal-role";
import { toShellRole } from "@/features/dashboard/lib/dashboard-utils";

/**
 * Shared /dashboard route for every portal role (teacher, parent, student).
 * ProtectedRoute without `allowedRole` admits any authenticated portal user.
 */
export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = useAuthStore((state) => state.user);
  const role = user ? getPortalRole(user) : null;

  return (
    <ProtectedRoute>
      {role && (
        <PortalShell role={toShellRole(role)}>{children}</PortalShell>
      )}
    </ProtectedRoute>
  );
}
