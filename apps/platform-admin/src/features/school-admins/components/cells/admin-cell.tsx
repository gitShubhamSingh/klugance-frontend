"use client";

import {
  UserRound,
} from "lucide-react";

import type {
  SchoolAdmin,
} from "../../types";

interface AdminCellProps {
  admin: SchoolAdmin;
}

export function AdminCell({
  admin,
}: AdminCellProps) {
  const fullName = [
    admin.first_name,
    admin.middle_name,
    admin.last_name,
  ]
    .filter(Boolean)
    .join(" ");

  const initials = [
    admin.first_name?.[0],
    admin.last_name?.[0],
  ]
    .filter(Boolean)
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
        {initials ? (
          <span className="text-xs font-semibold text-muted-foreground">
            {initials}
          </span>
        ) : (
          <UserRound className="size-4 text-muted-foreground" />
        )}
      </div>

      <div className="min-w-0">
        <div
          className="max-w-[240px] truncate text-sm font-medium"
          title={fullName}
        >
          {fullName}
        </div>

        <div
          className="mt-0.5 max-w-[240px] truncate text-xs text-muted-foreground"
          title={admin.email}
        >
          {admin.email}
        </div>

        <div className="mt-0.5 text-[11px] text-muted-foreground/60">
          {admin.mobile_number}
        </div>
      </div>
    </div>
  );
}