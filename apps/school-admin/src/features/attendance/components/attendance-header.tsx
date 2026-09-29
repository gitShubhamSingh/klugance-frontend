"use client";

import { useState } from "react";
import {
  CalendarDays,
  RefreshCw,
  School,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { AttendanceContextButton } from "./attendance-context-button";

export function AttendanceHeader() {
  const [selectedDate, setSelectedDate] = useState(
    new Date(),
  );

  function goToToday() {
    setSelectedDate(new Date());
  }

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                <CalendarDays className="size-4" />
              </div>

              <h2 className="text-lg font-semibold">
                Attendance
              </h2>
            </div>

            <p className="mt-1 text-sm text-muted-foreground">
              Review and manage student attendance records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={goToToday}
            >
              Today
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Refresh attendance"
            >
              <RefreshCw className="size-4" />
            </Button>
          </div>

        </div>

        {/* Context */}
        <div className="rounded-xl bg-muted/40 p-2">
          <div className="grid gap-2 sm:grid-cols-3">

            <AttendanceContextButton
              icon={<CalendarDays className="size-4" />}
              label="Date"
              value={formatDate(selectedDate)}
            />

            <AttendanceContextButton
              icon={<School className="size-4" />}
              label="Class"
              value="Class 8"
            />

            <AttendanceContextButton
              icon={<Users className="size-4" />}
              label="Section"
              value="Section A"
            />

          </div>
        </div>

       {/* Attendance information */}
        <div className="flex flex-col gap-4">

        <div>
            <p className="text-sm font-medium">
            Class 8 · Section A
            </p>

            <p className="text-xs text-muted-foreground">
            {new Intl.DateTimeFormat("en-IN", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
            }).format(selectedDate)}
            </p>
        </div>
        
            
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

            {/* Total */}
            <div className="rounded-xl bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">
                Total Students
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
                42
            </p>
            </div>

            {/* Present */}
            <div className="rounded-xl bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">
                Present
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
                36
            </p>
            </div>

            {/* Absent */}
            <div className="rounded-xl bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">
                Absent
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
                4
            </p>
            </div>

            {/* Not Marked */}
            <div className="rounded-xl bg-muted/40 px-4 py-3">
            <p className="text-xs text-muted-foreground">
                Not Marked
            </p>

            <p className="mt-1 text-xl font-semibold tabular-nums">
                2
            </p>
            </div>

        </div>

        </div>

      </div>
    </div>
  );
}