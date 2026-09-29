"use client";

import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function PortalHeader() {
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
            Teacher Portal
          </div>

          <div className="truncate text-xs text-muted-foreground">
            klugance
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </Button>

        <Button
          variant="ghost"
          className="h-10 gap-2 px-2"
        >
          <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
            TS
          </div>

          <div className="hidden max-w-40 text-left md:block">
            <div className="truncate text-sm font-medium">
              Teacher
            </div>

            <div className="truncate text-xs text-muted-foreground">
              Teacher Portal
            </div>
          </div>
        </Button>
      </div>
    </header>
  );
}
