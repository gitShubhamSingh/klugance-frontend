"use client";

import {
  CalendarDays,
  Filter,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FeesContext() {
  return (
    <div className="rounded-2xl border bg-card p-2 shadow-sm">
      <div className="grid gap-2 lg:grid-cols-[1fr_1fr_2fr_auto]">
        <Button
          type="button"
          variant="ghost"
          className="h-12 justify-start gap-3 rounded-xl px-4"
        >
          <CalendarDays className="size-4 text-muted-foreground" />

          <div className="text-left">
            <p className="text-[11px] text-muted-foreground">
              Academic Year
            </p>

            <p className="text-sm font-medium">
              2026–27
            </p>
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-12 justify-start gap-3 rounded-xl px-4"
        >
          <CalendarDays className="size-4 text-muted-foreground" />

          <div className="text-left">
            <p className="text-[11px] text-muted-foreground">
              Collection Period
            </p>

            <p className="text-sm font-medium">
              August 2026
            </p>
          </div>
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search student or admission number..."
            className="h-12 rounded-xl pl-9"
          />
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl"
        >
          <Filter className="mr-2 size-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}