"use client";

import { useMemo, useState } from "react";
import {
  CheckCheck,
  CheckCircle2,
  Clock3,
  Loader2,
  Pencil,
  RotateCcw,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import { formatTime } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { compareRoll, formatSubmittedAt, studentName } from "../lib/attendance-utils";
import { markLabels, type AttendanceRegister, type MarkStatus } from "../types/teacher-attendance";

type Props = {
  register: AttendanceRegister;
  isNow: boolean;
  marks: Record<string, MarkStatus>;
  editing: boolean;
  saving: boolean;
  error: string | null;
  onMark: (studentId: string, status: MarkStatus) => void;
  onMarkAll: (status: MarkStatus | null) => void;
  onSubmit: () => void;
  onEdit: () => void;
};

const options: Array<{ value: MarkStatus; short: string; active: string }> = [
  { value: "present", short: "P", active: "border-emerald-600 bg-emerald-600 text-white" },
  { value: "absent", short: "A", active: "border-rose-600 bg-rose-600 text-white" },
  { value: "late", short: "L", active: "border-amber-500 bg-amber-500 text-white" },
  { value: "leave", short: "LV", active: "border-muted-foreground bg-muted-foreground text-background" },
];

export function TakeAttendance({
  register,
  isNow,
  marks,
  editing,
  saving,
  error,
  onMark,
  onMarkAll,
  onSubmit,
  onEdit,
}: Props) {
  const [query, setQuery] = useState("");

  const submittedAt = register.submitted_at ? (formatSubmittedAt(register.submitted_at) ?? "") : undefined;
  const locked = Boolean(register.submitted_at) && !editing;

  const students = useMemo(
    () =>
      register.students
        .map((s) => ({ ...s, name: studentName(s) }))
        .sort((a, b) => compareRoll(a.roll_number, b.roll_number)),
    [register.students],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.roll_number.toLowerCase().includes(q) ||
        s.admission_number.toLowerCase().includes(q),
    );
  }, [students, query]);

  const counts = useMemo(() => {
    const c = { present: 0, absent: 0, late: 0, half_day: 0, leave: 0, unmarked: 0 };
    students.forEach((s) => {
      const m = marks[s.enrollment_id];
      if (m) c[m] += 1;
      else c.unmarked += 1;
    });
    return c;
  }, [students, marks]);

  const total = students.length;
  const inClass = counts.present + counts.late + counts.half_day;
  const attendancePct = total ? Math.round((inClass / total) * 100) : 0;
  const width = (n: number) => `${total ? (n / total) * 100 : 0}%`;

  return (
    <section className="overflow-hidden rounded-2xl border bg-card">
      {/* Class header */}
      <div className="flex flex-col gap-4 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold tracking-tight">
              {register.class_name} – {register.section_name}
            </h2>
            {isNow && !submittedAt && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-2xs font-medium text-foreground">
                In class now
              </span>
            )}
            {!register.is_my_period && (
              <span className="rounded-full border px-2 py-0.5 text-2xs font-medium text-muted-foreground">
                Covering for {register.subject_teacher_name ?? "another teacher"}
              </span>
            )}
            {submittedAt !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-2xs font-medium text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="size-3" />
                Marked{register.marked_by_name ? ` by ${register.marked_by_name}` : ""}
                {submittedAt ? ` · ${submittedAt}` : ""}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {register.subject_name}
            {register.subject_teacher_name && ` · ${register.subject_teacher_name}`} · {register.period_name} (
            {formatTime(register.start_time)} – {formatTime(register.end_time)})
          </p>
        </div>

        {/* Live summary */}
        <div className="grid grid-cols-4 gap-2 text-center sm:w-auto sm:min-w-80">
          <Count label="Present" value={counts.present} className="text-emerald-700 dark:text-emerald-400" />
          <Count label="Absent" value={counts.absent} className="text-rose-600 dark:text-rose-400" />
          <Count label="Late" value={counts.late} className="text-amber-600 dark:text-amber-400" />
          <Count label="Leave" value={counts.leave} className="text-muted-foreground" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex h-1.5 w-full bg-muted" aria-hidden>
        <div className="bg-emerald-500 transition-all" style={{ width: width(counts.present) }} />
        <div className="bg-amber-500 transition-all" style={{ width: width(counts.late + counts.half_day) }} />
        <div className="bg-muted-foreground/50 transition-all" style={{ width: width(counts.leave) }} />
        <div className="bg-rose-500 transition-all" style={{ width: width(counts.absent) }} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, roll or admission no."
            className="h-9 pl-8"
            aria-label="Search students"
          />
        </div>
        {!locked && (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" type="button" disabled={saving} onClick={() => onMarkAll("present")}>
              <CheckCheck />
              Mark all present
            </Button>
            <Button variant="ghost" size="sm" type="button" disabled={saving} onClick={() => onMarkAll(null)}>
              <RotateCcw />
              Reset
            </Button>
          </div>
        )}
      </div>

      {/* Student rows */}
      <ul className="divide-y">
        {visible.map((s) => {
          const mark = marks[s.enrollment_id];

          return (
            <li
              key={s.enrollment_id}
              className={cn(
                "flex items-center gap-3 px-4 py-3 sm:px-5",
                !mark && !locked && "bg-muted/20",
              )}
            >
              <span className="w-6 shrink-0 text-xs text-muted-foreground tabular-nums">
                {s.roll_number}
              </span>
              <InitialsAvatar name={s.name} size="sm" className="hidden sm:flex" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="flex flex-wrap items-center gap-x-2 text-2xs text-muted-foreground">
                  <span className="tabular-nums">
                    {s.attendance_percent === null
                      ? "No attendance yet"
                      : `${Math.round(s.attendance_percent)}% this year`}
                  </span>
                  {s.absent_last_day && (
                    <span className="font-medium text-rose-600 dark:text-rose-400">Absent last school day</span>
                  )}
                </p>
              </div>

              {locked ? (
                <StatusPill status={mark} />
              ) : (
                <div className="flex shrink-0 gap-1" role="radiogroup" aria-label={`Attendance for ${s.name}`}>
                  {options.map((o) => {
                    const selected = mark === o.value;
                    return (
                      <button
                        key={o.value}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={markLabels[o.value]}
                        title={markLabels[o.value]}
                        disabled={saving}
                        onClick={() => onMark(s.enrollment_id, o.value)}
                        className={cn(
                          "flex h-9 min-w-9 items-center justify-center rounded-lg border text-xs font-semibold transition-colors sm:min-w-20 sm:px-3",
                          selected ? o.active : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <span className="sm:hidden">{o.short}</span>
                        <span className="hidden sm:inline">{markLabels[o.value]}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </li>
          );
        })}
        {visible.length === 0 && (
          <li className="py-12 text-center text-sm text-muted-foreground">
            {total === 0 ? "No students are enrolled in this section yet." : "No students match your search."}
          </li>
        )}
      </ul>

      {error && (
        <p role="alert" className="border-t bg-destructive/5 px-4 py-3 text-sm text-destructive sm:px-5">
          {error}
        </p>
      )}

      {/* Submit bar */}
      <div className="sticky bottom-0 flex flex-col gap-3 border-t bg-card/95 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-sm">
          {locked ? (
            <span className="text-muted-foreground">
              <span className="font-semibold text-foreground">{attendancePct}%</span> attendance ·{" "}
              {inClass} of {total} in class
            </span>
          ) : counts.unmarked > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock3 className="size-4" />
              <span className="font-semibold text-foreground tabular-nums">{counts.unmarked}</span> students not marked yet
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 className="size-4" />
              All {total} students marked · {attendancePct}% attendance
            </span>
          )}
        </p>

        {locked ? (
          <Button variant="outline" type="button" onClick={onEdit}>
            <Pencil />
            Edit attendance
          </Button>
        ) : (
          <Button
            type="button"
            disabled={counts.unmarked > 0 || saving || total === 0}
            onClick={onSubmit}
            className="sm:min-w-44"
          >
            {saving ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
            {saving ? "Saving..." : submittedAt !== undefined ? "Update attendance" : "Submit attendance"}
          </Button>
        )}
      </div>
    </section>
  );
}

function Count({ label, value, className }: { label: string; value: number; className: string }) {
  return (
    <div className="rounded-xl bg-muted/50 px-2 py-2">
      <p className={cn("text-lg leading-none font-semibold tabular-nums", className)}>{value}</p>
      <p className="mt-1 text-2xs text-muted-foreground">{label}</p>
    </div>
  );
}

const pillStyles: Record<MarkStatus, string> = {
  present: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  absent: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  late: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  half_day: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  leave: "bg-muted text-muted-foreground",
};

function StatusPill({ status }: { status?: MarkStatus }) {
  if (!status) return <span className="text-xs text-muted-foreground">—</span>;
  return (
    <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-medium", pillStyles[status])}>
      {markLabels[status]}
    </span>
  );
}
