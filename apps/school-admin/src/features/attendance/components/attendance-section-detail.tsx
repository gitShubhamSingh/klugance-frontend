"use client";

import { CheckCircle2, Clock3 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

import { dayStatusLabels, dayStatusStyle, formatDateKey, formatTime } from "../lib/attendance-utils";
import type { AttendancePeriod, DayStatus, SectionAttendance } from "../types/attendance";
import { Stat } from "./attendance-header";
import { AttendanceStudentCard } from "./attendance-student-card";

const LEGEND: Array<DayStatus | null> = ["PRESENT", "LATE", "PARTIAL", "ABSENT", "LEAVE", null];

export function AttendanceSectionDetail({
  date,
  data,
  loading,
  error,
}: {
  date: string;
  data: SectionAttendance | null;
  loading: boolean;
  error: string | null;
}) {
  if (error && !data) {
    return (
      <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm">
        {error}
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="space-y-4 rounded-xl border bg-card p-5" role="status" aria-label="Loading section attendance">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const { summary, periods, students } = data;
  const periodNames = new Map(periods.map((p) => [p.period_number, p.period_name]));

  return (
    <div className="space-y-5 rounded-xl border bg-card p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-semibold">
            {data.class_name} – Section {data.section_name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {formatDateKey(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
          {LEGEND.map((status) => (
            <span key={status ?? "none"} className="flex items-center gap-1.5 text-muted-foreground">
              <span className={cn("size-2 rounded-full", dayStatusStyle(status).dot)} />
              {status ? dayStatusLabels[status] : "Not marked"}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Students" value={summary.total_students} />
        <Stat label="Present" value={summary.present + summary.late} hint={summary.late ? `${summary.late} late` : undefined} tone="text-green-600" />
        <Stat label="Partial" value={summary.partial} tone="text-orange-600" />
        <Stat label="Absent" value={summary.absent} tone="text-red-600" />
        <Stat label="On leave" value={summary.leave} tone="text-sky-600" />
        <Stat label="Not marked" value={summary.not_marked} />
      </div>

      {/* Periods */}
      <section aria-label="Periods">
        <div className="mb-2 flex items-baseline justify-between">
          <h3 className="text-sm font-medium">Periods</h3>
          <p className="text-xs text-muted-foreground">
            {summary.periods_marked} of {summary.periods_scheduled} marked
            {summary.attendance_percent != null && ` · ${summary.attendance_percent}% attendance`}
          </p>
        </div>
        {periods.length === 0 ? (
          <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            No periods on the timetable for this day.
          </p>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {periods.map((period) => (
              <PeriodCard key={period.period_number} period={period} />
            ))}
          </div>
        )}
      </section>

      {/* Students */}
      <section aria-label="Students">
        <h3 className="mb-2 text-sm font-medium">Students</h3>
        {students.length === 0 ? (
          <p className="rounded-xl border border-dashed p-4 text-center text-sm text-muted-foreground">
            No students are enrolled in this section this year.
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(8.5rem,1fr))] gap-3">
            {students.map((student) => (
              <AttendanceStudentCard key={student.enrollment_id} student={student} periodNames={periodNames} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PeriodCard({ period }: { period: AttendancePeriod }) {
  const time = period.start_time ? `${formatTime(period.start_time)} – ${formatTime(period.end_time)}` : "Off timetable";

  return (
    <div className={cn("rounded-xl border p-3", period.marked ? "bg-background" : "border-dashed bg-muted/30")}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{period.period_name}</p>
        <span className="text-[11px] text-muted-foreground tabular-nums">{time}</span>
      </div>
      <p className="mt-0.5 truncate text-xs text-muted-foreground">
        {[period.subject_name, period.teacher_name].filter(Boolean).join(" · ") || "—"}
      </p>
      {period.marked ? (
        <>
          <p className="mt-2 flex items-center gap-1 text-[11px] text-green-700 dark:text-green-400">
            <CheckCircle2 className="size-3.5" />
            Marked{period.marked_by_name ? ` by ${period.marked_by_name}` : ""}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground tabular-nums">
            {period.present + period.late} present
            {period.late ? ` (${period.late} late)` : ""} · {period.absent} absent
            {period.half_day ? ` · ${period.half_day} half day` : ""}
            {period.leave ? ` · ${period.leave} leave` : ""}
          </p>
        </>
      ) : (
        <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock3 className="size-3.5" />
          Not marked yet
        </p>
      )}
    </div>
  );
}
