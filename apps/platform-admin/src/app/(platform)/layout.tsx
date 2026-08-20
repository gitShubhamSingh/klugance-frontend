"use client";

import { ReactNode } from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { AppSidebar } from "./_components/app-sidebar";
import { AppHeader } from "./_components/app-header";

type Props = {
  children: ReactNode;
};

export default function PlatformLayout({
  children,
}: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="bg-muted/30">
        <AppHeader />

        {children}
    </SidebarInset>
    </SidebarProvider>
  );
}