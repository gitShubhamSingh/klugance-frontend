"use client";

import { useState } from "react";
import { Bell, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { sessionService } from "@/core/auth/session/session.service";
import { portalConfig, type PortalRole } from "./roles/portal-config";

type Props = {
  role: PortalRole;
};

export function PortalHeader({ role }: Props) {
  const config = portalConfig[role];
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    sessionService.logout();
    router.replace("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b bg-background/95 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-5" />
        <div>
          <div className="text-sm font-medium">{config.label}</div>
          <div className="text-xs text-muted-foreground">klugance</div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <div className="hidden text-right sm:block">
          <div className="text-sm font-medium capitalize">{role}</div>
          <div className="text-xs text-muted-foreground">{config.label}</div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          <LogOut className="mr-2 size-4" />
          {loggingOut ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </header>
  );
}