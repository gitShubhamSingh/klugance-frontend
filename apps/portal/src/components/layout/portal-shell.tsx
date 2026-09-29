"use client";

import type { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { PortalHeader } from "./portal-header";
import { PortalSidebar } from "./portal-sidebar";

type Props = {
  children: ReactNode;
};

export function PortalShell({
  children,
}: Props) {
  return (
    <SidebarProvider>
      <PortalSidebar />

      <SidebarInset className="bg-muted/30">
        <PortalHeader />

        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
