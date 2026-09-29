"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  icon: ReactNode;
  label: string;
  value: string;
  onClick?: () => void;
};

export function AttendanceContextButton({
  icon,
  label,
  value,
  onClick,
}: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      className="
        h-auto
        w-full
        justify-between
        rounded-lg
        px-3
        py-3
        text-left
        hover:bg-background
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
          <span className="size-4 text-muted-foreground">
            {icon}
          </span>
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {label}
          </p>

          <p className="truncate text-sm font-semibold">
            {value}
          </p>
        </div>
      </div>

      <ChevronDown className="ml-2 size-4 shrink-0 text-muted-foreground" />
    </Button>
  );
}