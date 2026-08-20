"use client";

import {
  GraduationCap,
} from "lucide-react";

import type {
  SchoolAdminSchool,
} from "../../types";

interface SchoolCellProps {
  school: SchoolAdminSchool;
}

export function SchoolCell({
  school,
}: SchoolCellProps) {
  return (
    <div className="flex min-w-[180px] items-center gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted/70">
        <GraduationCap className="size-4 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <div
          className="max-w-[220px] truncate text-sm font-medium"
          title={school.name}
        >
          {school.name}
        </div>

        <div className="mt-0.5 font-mono text-xs text-muted-foreground/70">
          {school.code}
        </div>
      </div>
    </div>
  );
}