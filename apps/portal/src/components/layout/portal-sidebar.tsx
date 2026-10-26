
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GraduationCap, Settings } from "lucide-react";

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
import { portalConfig, type PortalRole } from "./roles/portal-config";

type Props = {
  role: PortalRole;
};

export function PortalSidebar({ role }: Props) {
  const pathname = usePathname();
  const config = portalConfig[role];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <Link href={config.dashboard} className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">klugance</div>
            <div className="text-xs text-muted-foreground">{config.label}</div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {config.navigation.map((item) => {
                const Icon = item.icon;

                return (
                  <SidebarMenuItem key={item.href} className="py-1">
                    <SidebarMenuButton
                      isActive={isActive(item.href)}
                      render={<Link href={item.href} />}
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

      {/* <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={isActive(`/${role}/settings`)}
              render={<Link href={`/${role}/settings`} />}
            >
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
     */}
    </Sidebar>
  );
}
