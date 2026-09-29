"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  Bus,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Megaphone,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Students",
    href: "/students",
    icon: Users,
  },
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Homework",
    href: "/homework",
    icon: BookOpen,
  },
  {
    title: "Exams",
    href: "/exams",
    icon: FileText,
  },
  {
    title: "Timetable",
    href: "/timetable",
    icon: CalendarDays,
  },
  {
    title: "Communication",
    href: "/communication",
    icon: Megaphone,
  },
  {
    title: "Fees",
    href: "/fees",
    icon: WalletCards,
  },
  {
    title: "Transport",
    href: "/transport",
    icon: Bus,
  },
] as const;

function isRouteActive(
  pathname: string,
  href: string,
) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return (
    pathname === href ||
    pathname.startsWith(`${href}/`)
  );
}

export function PortalSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link
          href="/dashboard"
          className="flex min-w-0 items-center gap-3"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="truncate text-sm font-semibold">
              klugance
            </div>

            <div className="truncate text-xs text-muted-foreground">
              Teacher Portal
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Portal
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                const active = isRouteActive(
                  pathname,
                  item.href,
                );

                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="py-1"
                  >
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        <Link href={item.href} />
                      }
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isRouteActive(
                pathname,
                "/settings",
              )}
              render={
                <Link href="/settings" />
              }
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
