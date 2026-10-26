"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Mail,
  School,
  Settings,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { sessionService } from "@/core/auth/session/session.service";
import { useAuthStore } from "@/core/auth/store/auth.store";
import { cn } from "@/lib/utils";

import type { PortalRole } from "../roles/portal-config";
import { roleAccent } from "./header-data";

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U"
  );
}

export function UserMenu({ role }: { role: PortalRole }) {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loggingOut, setLoggingOut] = useState(false);

  const accent = roleAccent[role];
  const fullName = user
    ? [user.first_name, user.last_name].filter(Boolean).join(" ")
    : accent.label;
  const initials = initialsOf(fullName);

  function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    sessionService.logout();
    router.replace("/login");
    router.refresh();
  }

  const avatar = (size: "default" | "lg") => (
    <Avatar size={size} className={cn("ring-2 ring-offset-2 ring-offset-background", accent.ring)}>
      {user?.profile_picture && <AvatarImage src={user.profile_picture} alt={fullName} />}
      <AvatarFallback className="bg-muted font-semibold text-foreground">{initials}</AvatarFallback>
    </Avatar>
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="group flex items-center gap-2.5 rounded-xl py-1 pr-2 pl-1 transition-colors outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-muted"
      >
        {avatar("default")}
        <span className="hidden min-w-0 text-left leading-tight md:block">
          <span className="block max-w-36 truncate text-sm font-medium">{fullName}</span>
          <span className="block text-2xs text-muted-foreground">{accent.label}</span>
        </span>
        <ChevronDown className="hidden size-4 text-muted-foreground transition-transform group-data-popup-open:rotate-180 md:block" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-72 p-0">
        {/* Profile card */}
        <div className="relative overflow-hidden p-4">
          <div aria-hidden className={cn("absolute inset-x-0 top-0 h-12 opacity-60", accent.badge)} />
          <div className="relative flex items-center gap-3 pt-2">
            {avatar("lg")}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{fullName}</p>
              <span className={cn("mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-2xs font-medium", accent.badge)}>
                <span className={cn("size-1.5 rounded-full", accent.dot)} />
                {accent.label}
              </span>
            </div>
          </div>

          <div className="relative mt-3 space-y-1.5 text-xs text-muted-foreground">
            {user?.email && (
              <p className="flex items-center gap-2 truncate">
                <Mail className="size-3.5 shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
            )}
            {user?.school?.name && (
              <p className="flex items-center gap-2 truncate">
                <School className="size-3.5 shrink-0" />
                <span className="truncate">{user.school.name}</span>
              </p>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="mx-0 my-0" />

        <DropdownMenuGroup className="p-1.5">
          <DropdownMenuItem render={<Link href="/dashboard" />} className="gap-2.5 px-2.5 py-2">
            <LayoutDashboard />
            Dashboard
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/${role}/profile`} />} className="gap-2.5 px-2.5 py-2">
            <UserRound />
            My profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href={`/${role}/settings`} />} className="gap-2.5 px-2.5 py-2">
            <Settings />
            Account settings
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="mx-0 my-0" />

        <div className="p-1.5">
          <DropdownMenuItem
            variant="destructive"
            disabled={loggingOut}
            onClick={handleLogout}
            className="gap-2.5 px-2.5 py-2"
          >
            <LogOut />
            {loggingOut ? "Logging out..." : "Log out"}
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
