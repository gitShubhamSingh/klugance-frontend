"use client";

import { BookOpen, RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

export function HomeworkHeader({
  isRefreshing = false,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted">
          <BookOpen className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Homework
          </h1>

          <p className="text-sm text-muted-foreground">
            Review and manage homework assigned by teachers.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Refresh homework"
        disabled={isRefreshing}
        onClick={onRefresh}
      >
        <RefreshCw
          className={
            isRefreshing
              ? "size-4 animate-spin"
              : "size-4"
          }
        />
      </Button>
    </div>
  );
}