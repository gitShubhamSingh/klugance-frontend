"use client";

import { LucideIcon } from "lucide-react";

interface DetailEmptyProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function DetailEmpty({
  icon: Icon,
  title,
  description,
}: DetailEmptyProps) {
  return (
    <div className="flex min-h-28 items-center gap-4 rounded-lg border border-dashed bg-muted/20 p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border bg-background">
        <Icon className="size-5 text-muted-foreground" />
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}