"use client";

import { ReactNode } from "react";

interface DetailFieldProps {
  label: string;
  value?: ReactNode;
  icon?: ReactNode;
  className?: string;
}

export function DetailField({
  label,
  value,
  icon,
  className = "",
}: DetailFieldProps) {
  const empty =
    value === undefined ||
    value === null ||
    value === "";

  return (
    <div className={`min-w-0 space-y-1.5 ${className}`}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {icon}

        <span>{label}</span>
      </div>

      <div className="min-h-5 break-words text-sm font-medium text-foreground">
        {empty ? (
          <span className="font-normal text-muted-foreground">
            —
          </span>
        ) : (
          value
        )}
      </div>
    </div>
  );
}