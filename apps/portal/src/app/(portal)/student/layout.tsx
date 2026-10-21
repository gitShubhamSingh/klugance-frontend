import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { ProtectedRoute } from "@/core/auth/components/protected-route";

export default function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="STUDENT">
      <PortalShell role="student">{children}</PortalShell>
    </ProtectedRoute>
  );
}