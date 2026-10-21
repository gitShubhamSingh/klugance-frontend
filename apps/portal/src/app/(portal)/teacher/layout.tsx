import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { ProtectedRoute } from "@/core/auth/components/protected-route";

export default function TeacherLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="TEACHER">
      <PortalShell role="teacher">{children}</PortalShell>
    </ProtectedRoute>
  );
}