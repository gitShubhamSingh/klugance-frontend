"use client";

import type {
  SchoolAdminStatus,
} from "../../types";

interface StatusCellProps {
  status: SchoolAdminStatus;
}

export function StatusCell({
  status,
}: StatusCellProps) {
  if (status === "ACTIVE") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
        <span className="size-1.5 rounded-full bg-emerald-500" />

        Active
      </div>
    );
  }

  if (status === "SUSPENDED") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-medium text-destructive">
        <span className="size-1.5 rounded-full bg-destructive" />

        Suspended
      </div>
    );
  }

  if (status === "LOCKED") {
    return (
      <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
        <span className="size-1.5 rounded-full bg-amber-500" />

        Locked
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <span className="size-1.5 rounded-full bg-muted-foreground" />

      {formatStatus(status)}
    </div>
  );
}

function formatStatus(
  status: SchoolAdminStatus,
) {
  return status
    .toLowerCase()
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}