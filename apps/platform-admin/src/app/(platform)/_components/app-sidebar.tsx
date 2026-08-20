"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  School,
  CreditCard,
  Users,
  ShieldCheck,
  UserCog,
  LifeBuoy,
  Settings,
  Boxes
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigation = [
    {
      label: "OVERVIEW",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
  
    {
      label: "MANAGEMENT",
      items: [
        {
            title:"Products",
            url:"/products",
            icon: Boxes
        },
        {
          title: "Schools",
          url: "/schools",
          icon: School,
        },
        {
          title: "Subscriptions",
          url: "/subscriptions",
          icon: CreditCard,
        },
        {
          title: "School Admins",
          url: "/school-admins",
          icon: ShieldCheck,
        },
        {
          title: "Platform Users",
          url: "/platform-users",
          icon: UserCog,
        },
      ],
    },
  
    {
      label: "SYSTEM",
      items: [
        {
          title: "Support",
          url: "/support",
          icon: LifeBuoy,
        },
        {
          title: "Settings",
          url: "/settings",
          icon: Settings,
        },
      ],
    },
  ];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar 
        collapsible="icon"
        className="bg-background border-r shadow-sm"
        >
      <SidebarHeader className="border-b border-border px-5 py-5">
        <div className="flex items-center gap-3 ransition-all duration-300">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-sm">
            K
            </div>

            <div className="flex flex-col overflow-hidden">
            <span className="truncate text-base font-bold tracking-wide">
                KLUGANCE
            </span>

            <span className="truncate text-xs text-muted-foreground">
                AI Powered School Platform
            </span>
            </div>
        </div>
    </SidebarHeader>

    <SidebarContent className="px-3 py-4">

{navigation.map((group) => (
  <SidebarGroup
    key={group.label}
    className="mb-6 p-0"
  >
    <div className="mb-2 px-3 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
      {group.label}
    </div>

    <SidebarGroupContent>
      <SidebarMenu>

        {group.items.map((item) => {
          const active =
            pathname === item.url;

          return (
            <SidebarMenuItem key={item.url}>

                <SidebarMenuButton
                render={
                    <Link
                    href={item.url}
                    className="flex w-full items-center gap-3"
                    />
                }
                tooltip={item.title}
                className={`
                    group
                    relative
                    h-11
                    rounded-xl
                    px-3
                    transition-all
                    duration-200
                    ${
                    active
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "hover:bg-accent"
                    }
                `}
                >
                {active && (
                    <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary-foreground" />
                )}

                <item.icon
                    className="size-5 shrink-0"
                    strokeWidth={2}
                />

                <span className="truncate font-medium">
                    {item.title}
                </span>
                </SidebarMenuButton>

            </SidebarMenuItem>
          );
        })}

      </SidebarMenu>
        </SidebarGroupContent>
        </SidebarGroup>
        ))}

    </SidebarContent>

    <SidebarFooter className="border-t p-4">

        <button
            className="
            flex
            w-full
            items-center
            gap-3
            rounded-xl
            p-3
            transition-colors
            hover:bg-accent
            "
        >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
            K
            </div>

            <div className="flex flex-col items-start">
            <span className="text-sm font-semibold">
                Platform Owner
            </span>

            <span className="text-xs text-muted-foreground">
                owner@klugance.com
            </span>
            </div>
        </button>

    </SidebarFooter>
    </Sidebar>
  );
}