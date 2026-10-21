
"use client";

import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { PortalHeader } from "./portal-header";
import { PortalSidebar } from "./portal-sidebar";
import type { PortalRole } from "./roles/portal-config";

type Props = {
  children: ReactNode;
  role: PortalRole;
};

export function PortalShell({ children, role }: Props) {
  return (
    <SidebarProvider>
      <PortalSidebar role={role} />
      <SidebarInset className="bg-muted/30">
        <PortalHeader role={role} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
