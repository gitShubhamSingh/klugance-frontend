"use client";

import { School } from "../../types/school";

interface Props {
  school: School;
}

export function SchoolCell({ school }: Props) {
  return (
    <div className="flex items-center gap-3">
      {/* Dummy Logo */}
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border bg-muted text-sm font-semibold">
        {school.name.charAt(0).toUpperCase()}
      </div>

      <div className="min-w-0 flex-1">
        <div className="truncate font-medium">
          {school.name}
        </div>

        <div className="truncate text-xs text-muted-foreground">
          {school.email}
        </div>

        <div className="mt-0.5 text-[11px] text-muted-foreground">
          {school.code}
        </div>
      </div>
    </div>
  );
}