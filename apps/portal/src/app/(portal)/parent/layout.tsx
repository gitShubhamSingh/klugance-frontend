import type { ReactNode } from "react";
import { PortalShell } from "@/components/layout/portal-shell";
import { ProtectedRoute } from "@/core/auth/components/protected-route";

export default function ParentLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <ProtectedRoute allowedRole="PARENT">
      <PortalShell role="parent">{children}</PortalShell>
    </ProtectedRoute>
  );
}