"use client";

import {
  Bell,
} from "lucide-react";

import {
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  Button,
} from "@/components/ui/button";

import {
  Separator,
} from "@/components/ui/separator";

import {
  useAuthStore,
} from "@/core/auth";

import {
  UserNav,
} from "./user-nav";

export function AppHeader() {
  const school =
    useAuthStore(
      (state) =>
        state.user?.school,
    );

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger />

        <Separator
          orientation="vertical"
          className="h-5"
        />

        <div className="min-w-0">
          <div className="truncate text-sm font-medium">
            {school?.name ??
              "School Administration"}
          </div>

          {school?.code && (
            <div className="truncate text-xs text-muted-foreground">
              {school.code}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <UserNav />
      </div>
    </header>
  );
}