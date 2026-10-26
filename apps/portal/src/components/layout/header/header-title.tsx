"use client";

import { usePathname } from "next/navigation";

import { portalConfig, type PortalRole } from "../roles/portal-config";

type Props = {
  role: PortalRole;
  schoolName?: string | null;
};

/** Shows the current section name, derived from the sidebar navigation. */
export function HeaderTitle({ role, schoolName }: Props) {
  const pathname = usePathname();
  const config = portalConfig[role];

  const match = [...config.navigation]
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));

  const title = match?.title ?? (pathname.endsWith("/settings") ? "Settings" : "Dashboard");

  return (
    <div className="min-w-0 leading-tight">
      <p className="truncate text-sm font-semibold">{title}</p>
      <p className="truncate text-xs text-muted-foreground">
        {config.label}
        {schoolName ? ` · ${schoolName}` : ""}
      </p>
    </div>
  );
}
