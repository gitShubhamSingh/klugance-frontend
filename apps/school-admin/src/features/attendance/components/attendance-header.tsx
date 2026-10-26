"use client";

import { CalendarDays, ChevronLeft, ChevronRight, RefreshCw, School, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { formatDateKey, shiftDateKey } from "../lib/attendance-utils";
import type { AttendanceSummary, OverviewSection } from "../types/attendance";

type Props = {
  date: string;
  today: string;
  onDateChange: (date: string) => void;
  sections: OverviewSection[];
  sectionId: string | null;
  onSectionChange: (sectionId: string) => void;
  totals: AttendanceSummary | null;
  loading: boolean;
  refreshing: boolean;
  onRefresh: () => void;
};

export function AttendanceHeader({
  date,
  today,
  onDateChange,
  sections,
  sectionId,
  onSectionChange,
  totals,
  loading,
  refreshing,
  onRefresh,
}: Props) {
  const selected = sections.find((s) => s.section_id === sectionId);

  // Classes in order, each with its sections.
  const classes = [...new Map(sections.map((s) => [s.class_id, s.class_name])).entries()];
  const classSections = sections.filter((s) => s.class_id === selected?.class_id);

  function changeClass(classId: string) {
    const first = sections.find((s) => s.class_id === classId);
    if (first) onSectionChange(first.section_id);
  }

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        {/* Heading */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-muted">
                <CalendarDays className="size-4" />
              </div>
              <h1 className="text-lg font-semibold">Attendance</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Period-wise attendance marked by teachers, rolled up for each student&apos;s day.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => onDateChange(today)} disabled={date === today}>
              Today
            </Button>
            <Button type="button" variant="outline" size="icon" aria-label="Refresh attendance" onClick={onRefresh}>
              <RefreshCw className={cn("size-4", refreshing && "animate-spin")} />
            </Button>
          </div>
        </div>

        {/* Context: date, class, section */}
        <div className="grid gap-2 rounded-xl bg-muted/40 p-2 md:grid-cols-[minmax(13rem,1.3fr)_1fr_1fr]">
          <div className="flex items-center gap-2 rounded-lg px-2 py-2">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">
              <CalendarDays className="size-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="attendance-date" className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                Date
              </label>
              <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-xs" aria-label="Previous day" onClick={() => onDateChange(shiftDateKey(date, -1))}>
                  <ChevronLeft />
                </Button>
                <input
                  id="attendance-date"
                  type="date"
                  value={date}
                  max={today}
                  onChange={(e) => e.target.value && onDateChange(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Next day"
                  disabled={date >= today}
                  onClick={() => onDateChange(shiftDateKey(date, 1))}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </div>

          <ContextSelect
            icon={<School className="size-4 text-muted-foreground" />}
            label="Class"
            value={selected?.class_id}
            placeholder={loading ? "Loading..." : "No classes"}
            disabled={classes.length === 0}
            onChange={changeClass}
            options={classes.map(([id, name]) => ({ value: id, label: name }))}
          />

          <ContextSelect
            icon={<Users className="size-4 text-muted-foreground" />}
            label="Section"
            value={selected?.section_id}
            placeholder={loading ? "Loading..." : "No sections"}
            disabled={classSections.length === 0}
            onChange={onSectionChange}
            options={classSections.map((s) => ({ value: s.section_id, label: `Section ${s.section_name}` }))}
          />
        </div>

        {/* School totals for the day */}
        <div>
          <p className="text-sm font-medium">Whole school</p>
          <p className="text-xs text-muted-foreground">
            {formatDateKey(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
          {loading || !totals ? (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-7">
              <Stat label="Students" value={totals.total_students} />
              <Stat label="Present" value={totals.present + totals.late} hint={totals.late ? `${totals.late} late` : undefined} tone="text-green-600" />
              <Stat label="Partial" value={totals.partial} tone="text-orange-600" />
              <Stat label="Absent" value={totals.absent} tone="text-red-600" />
              <Stat label="On leave" value={totals.leave} tone="text-sky-600" />
              <Stat label="Not marked" value={totals.not_marked} />
              <Stat
                label="Periods marked"
                value={`${totals.periods_marked}/${totals.periods_scheduled}`}
                hint={totals.attendance_percent != null ? `${totals.attendance_percent}% attendance` : undefined}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number | string;
  hint?: string;
  tone?: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-xl font-semibold tabular-nums", tone)}>{value}</p>
      {hint && <p className="text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ContextSelect({
  icon,
  label,
  value,
  placeholder,
  disabled,
  onChange,
  options,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | undefined;
  placeholder: string;
  disabled: boolean;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label={label}
        className="h-auto w-full border-0 bg-transparent px-2 py-2 shadow-none hover:bg-background focus:ring-0"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background shadow-sm">{icon}</div>
          <div className="min-w-0 flex-1 text-left">
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">{label}</p>
            <SelectValue placeholder={placeholder} />
          </div>
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
