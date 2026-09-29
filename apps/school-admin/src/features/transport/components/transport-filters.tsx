"use client";

import {
  BusFront,
  ListFilter,
  Search,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;
  activeView: "buses" | "routes";
  onViewChange: (
    view: "buses" | "routes",
  ) => void;
};

export function TransportFilters({
  search,
  onSearchChange,
  activeView,
  onViewChange,
}: Props) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search buses or routes..."
          className="pl-9"
        />
      </div>

      <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
        <Button
          type="button"
          size="sm"
          variant={
            activeView === "buses"
              ? "default"
              : "ghost"
          }
          onClick={() =>
            onViewChange("buses")
          }
        >
          <BusFront className="mr-2 size-4" />
          Buses
        </Button>

        <Button
          type="button"
          size="sm"
          variant={
            activeView === "routes"
              ? "default"
              : "ghost"
          }
          onClick={() =>
            onViewChange("routes")
          }
        >
          <ListFilter className="mr-2 size-4" />
          Routes
        </Button>
      </div>
    </div>
  );
}