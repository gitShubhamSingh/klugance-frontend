"use client";

import { Bell, Menu, Search } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">

      {/* Left */}

      <div className="flex items-center gap-4">

        <SidebarTrigger />

        <div>
          <h1 className="text-lg font-semibold">
            Dashboard
          </h1>

          <p className="text-xs text-muted-foreground">
            Welcome back 👋
          </p>
        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-3">

        <div className="relative hidden lg:block">

          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search..."
            className="w-72 pl-9"
          />

        </div>

        <Button
          variant="ghost"
          size="icon"
        >
          <Bell className="size-5" />
        </Button>

        <Button
          variant="ghost"
          className="h-10 rounded-xl px-4"
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
            K
          </div>

          <div className="hidden text-left lg:block">
            <div className="text-sm font-medium">
              Platform Owner
            </div>

            <div className="text-xs text-muted-foreground">
              owner@klugance.com
            </div>
          </div>

        </Button>

      </div>

    </header>
  );
}