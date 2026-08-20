"use client";

import type {
  ReactNode,
} from "react";

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import {
  ProtectedRoute,
} from "@/core/auth";

import {
  AppHeader,
} from "./app-header";

import {
  AppSidebar,
} from "./app-sidebar";

type Props = {
  children: ReactNode;
};

export function AppShell({
  children,
}: Props) {
  return (
    <ProtectedRoute>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset className="bg-muted/30">
          <AppHeader />

          {children}
        </SidebarInset>
      </SidebarProvider>
    </ProtectedRoute>
  );
}