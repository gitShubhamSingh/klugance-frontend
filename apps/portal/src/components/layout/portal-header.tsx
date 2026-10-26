"use client";

import { CalendarDays } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthStore } from "@/core/auth/store/auth.store";

import { HeaderTitle } from "./header/header-title";
import { NotificationsMenu } from "./header/notifications-menu";
import { UserMenu } from "./header/user-menu";
import type { PortalRole } from "./roles/portal-config";

type Props = {
  role: PortalRole;
};

export function PortalHeader({ role }: Props) {
  const schoolName = useAuthStore((state) => state.user?.school?.name);

  const today = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/70 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <HeaderTitle role={role} schoolName={schoolName} />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <span className="hidden items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-muted-foreground lg:inline-flex">
          <CalendarDays className="size-3.5" />
          {today}
        </span>

        <NotificationsMenu role={role} />

        <Separator orientation="vertical" className="mx-1 hidden h-6 sm:block" />

        <UserMenu role={role} />
      </div>
    </header>
  );
}
