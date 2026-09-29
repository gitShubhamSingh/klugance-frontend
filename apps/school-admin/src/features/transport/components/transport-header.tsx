"use client";

import {
  BusFront,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type Props = {
  isRefreshing?: boolean;
  onRefresh?: () => void;
};

export function TransportHeader({
  isRefreshing = false,
  onRefresh,
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <BusFront className="size-5 text-muted-foreground" />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Transport
          </h1>

          <p className="text-sm text-muted-foreground">
            Monitor buses, routes, drivers and student
            transport assignments.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Refresh transport"
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