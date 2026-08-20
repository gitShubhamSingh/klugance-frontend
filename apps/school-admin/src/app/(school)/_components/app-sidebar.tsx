"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  usePathname,
} from "next/navigation";

import {
  BookOpen,
  Bus,
  CalendarCheck,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Layers3,
  LayoutDashboard,
  Megaphone,
  School,
  Settings,
  Users,
  WalletCards,
} from "lucide-react";

import {
  useAuthStore,
} from "@/core/auth";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

const navigation = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Teachers",
    href: "/teachers",
    icon: Users,
  },
  {
    title: "Students",
    href: "/students",
    icon: GraduationCap,
  },
  
] as const;

const academicNavigation = [
  {
    title: "Academic Years",
    href: "/academics/academic-years",
    icon: CalendarDays,
  },
  {
    title: "Classes",
    href: "/academics/classes",
    icon: School,
  },
  {
    title: "Sections",
    href: "/academics/sections",
    icon: Layers3,
  },
] as const;

const operationsNavigation = [
  {
    title: "Attendance",
    href: "/attendance",
    icon: CalendarCheck,
  },
  {
    title: "Homework",
    href: "/homework",
    icon: ClipboardCheck,
  },
  {
    title: "Exams",
    href: "/exams",
    icon: FileText,
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
  {
    title: "Communication",
    href: "/communication",
    icon: Megaphone,
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

export function AppSidebar() {
  const pathname = usePathname();

  const school = useAuthStore(
    (state) => state.user?.school,
  );

  const isAcademicsRoute =
    pathname === "/academics" ||
    pathname.startsWith("/academics/");

  const [
    academicsOpen,
    setAcademicsOpen,
  ] = useState(isAcademicsRoute);

  useEffect(() => {
    if (isAcademicsRoute) {
      setAcademicsOpen(true);
    }
  }, [isAcademicsRoute]);

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
              {school?.name ?? "Klugance"}
            </div>

            <div className="truncate text-xs text-muted-foreground">
              {school?.code ?? "School Admin"}
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            School
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isRouteActive(
                    pathname,
                    "/dashboard",
                  )}
                  render={
                    <Link href="/dashboard" />
                  }
                >
                  <LayoutDashboard />

                  <span>
                    Dashboard
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Academics */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  type="button"
                  isActive={isAcademicsRoute}
                  aria-expanded={
                    academicsOpen
                  }
                  aria-controls="academics-submenu"
                  onClick={() => {
                    setAcademicsOpen(
                      (current) => !current,
                    );
                  }}
                >
                  <BookOpen />

                  <span>
                    Academics
                  </span>

                  <ChevronRight
                    className={[
                      "ml-auto size-4",
                      "transition-transform duration-200",
                      academicsOpen
                        ? "rotate-90"
                        : "",
                    ].join(" ")}
                  />
                </SidebarMenuButton>

                <div
                  className={[
                    "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                    academicsOpen
                      ? "grid-rows-[1fr] opacity-100"
                      : "grid-rows-[0fr] opacity-0",
                  ].join(" ")}
                >
                  <div className="overflow-hidden">
                    <SidebarMenuSub
                      id="academics-submenu"
                    >
                      {academicNavigation.map(
                        (item) => {
                          const Icon =
                            item.icon;

                          const active =
                            isRouteActive(
                              pathname,
                              item.href,
                            );

                          return (
                            <SidebarMenuSubItem
                              key={
                                item.href
                              }
                            >
                              <SidebarMenuSubButton
                                isActive={
                                  active
                                }
                                render={
                                  <Link
                                    href={
                                      item.href
                                    }
                                  />
                                }
                              >
                                <Icon />

                                <span>
                                  {
                                    item.title
                                  }
                                </span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          );
                        },
                      )}
                    </SidebarMenuSub>
                  </div>
                </div>
              </SidebarMenuItem>
              
              {/* Teachers */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isRouteActive(
                    pathname,
                    "/teachers",
                  )}
                  render={
                    <Link href="/teachers" />
                  }
                >
                  <Users />

                  <span>
                    Teachers
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>


              {/* Students */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={isRouteActive(
                    pathname,
                    "/students",
                  )}
                  render={
                    <Link href="/students" />
                  }
                >
                  <GraduationCap />

                  <span>
                    Students
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              
              {/* Operations */}
              {operationsNavigation.map(
                (item) => {
                  const Icon = item.icon;

                  const active =
                    isRouteActive(
                      pathname,
                      item.href,
                    );

                  return (
                    <SidebarMenuItem
                      key={item.href}
                    >
                      <SidebarMenuButton
                        isActive={active}
                        render={
                          <Link
                            href={
                              item.href
                            }
                          />
                        }
                      >
                        <Icon />

                        <span>
                          {item.title}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                },
              )}
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

              <span>
                Settings
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}