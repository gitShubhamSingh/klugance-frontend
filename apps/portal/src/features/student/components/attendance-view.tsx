"use client";

import { useMemo, useState } from "react";
import { CalendarCheck, CalendarX2, ChevronLeft, ChevronRight, ListChecks, UserCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import type { AttendanceStatusValue, DayStatusValue, PeriodMark } from "@/features/dashboard/types/parent-dashboard";
import { LoadErrorState } from "@/features/parent-children";
import { formatTime } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { formatDay, formatPercent } from "../lib/student-utils";
import type { AttendanceDay, StudentAttendance } from "../types/student";

export const dayStatusMeta: Record<DayStatusValue, { label: string; cell: string; dot: string }> = {
  PRESENT: { label: "Present", cell: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-300", dot: "bg-emerald-500" },
  LATE: { label: "Late", cell: "bg-amber-400/25 text-amber-800 dark:text-amber-300", dot: "bg-amber-400" },
  PARTIAL: { label: "Partly absent", cell: "bg-orange-400/25 text-orange-800 dark:text-orange-300", dot: "bg-orange-400" },
  ABSENT: { label: "Absent", cell: "bg-rose-500/15 text-rose-700 dark:text-rose-300", dot: "bg-rose-500" },
  LEAVE: { label: "Leave", cell: "bg-muted text-muted-foreground", dot: "bg-muted-foreground/50" },
};

const periodStatusMeta: Record<AttendanceStatusValue, { label: string; short: string; chip: string }> = {
  PRESENT: { label: "Present", short: "P", chip: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  LATE: { label: "Late", short: "L", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  HALF_DAY: { label: "Half day", short: "H", chip: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  ABSENT: { label: "Absent", short: "A", chip: "bg-rose-500/10 text-rose-700 dark:text-rose-300" },
  LEAVE: { label: "Leave", short: "LV", chip: "bg-muted text-muted-foreground" },
};

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y ?? 2000, (m ?? 1) - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

/** Month picker shown in the page header. */
export function MonthPicker({
  month,
  currentMonth,
  onChange,
}: {
  month: string;
  currentMonth: string;
  onChange: (month: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon-sm" aria-label="Previous month" onClick={() => onChange(shiftMonth(month, -1))}>
        <ChevronLeft />
      </Button>
      <span className="min-w-36 text-center text-sm font-medium">{monthLabel(month)}</span>
      <Button
        variant="outline"
        size="icon-sm"
        aria-label="Next month"
        disabled={month >= currentMonth}
        onClick={() => onChange(shiftMonth(month, 1))}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

type Props = {
  query: {
    data: StudentAttendance | undefined;
    isLoading: boolean;
    isError: boolean;
    error: unknown;
    refetch: () => unknown;
  };
  today: string;
  /** "your" for the student, the child's first name for parents. */
  subject?: string;
};

/**
 * Day-wise and period-wise attendance for one student. Shared by the
 * student portal and the parent portal.
 */
export function AttendanceView({ query, today, subject }: Props) {
  const data = query.data;

  if (query.isLoading) {
    return (
      <div className="space-y-4" role="status" aria-label="Loading attendance">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (query.isError || !data) {
    return (
      <LoadErrorState
        title="Unable to load attendance"
        message={getErrorMessage(query.error)}
        onRetry={() => void query.refetch()}
      />
    );
  }

  return <AttendanceBody data={data} today={today} subject={subject} />;
}

function AttendanceBody({ data, today, subject }: { data: StudentAttendance; today: string; subject?: string }) {
  const detailsByDate = useMemo(() => new Map(data.day_details.map((d) => [d.date, d])), [data.day_details]);
  const [selected, setSelected] = useState<string | null>(null);

  // Default selection: today if marked, else the latest marked day in the month.
  const selectedDay =
    (selected && detailsByDate.get(selected)) ?? (data.today && data.month === today.slice(0, 7) ? data.today : data.day_details[0]) ?? null;

  const m = data.month_summary;

  return (
    <>
      <section className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Stat
          icon={UserCheck}
          label="This year"
          value={formatPercent(data.year.attendance_percent)}
          hint={`${data.year.periods_marked} periods over ${data.year.marked_days} days`}
        />
        <Stat
          icon={CalendarCheck}
          label={monthLabel(data.month)}
          value={formatPercent(m.attendance_percent)}
          hint={`${m.periods_marked} periods over ${m.marked_days} days`}
        />
        <Stat
          icon={CalendarX2}
          label="Days absent"
          value={`${m.absent}`}
          hint={`${m.partial} partly absent · ${m.leave} on leave`}
          warn={m.absent > 0}
        />
        <Stat
          icon={ListChecks}
          label="Periods attended"
          value={`${m.periods_attended}`}
          hint={`of ${m.periods_marked} marked this month`}
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        {/* Day-wise */}
        <section className="rounded-2xl border bg-card p-5">
          <div className="mb-4">
            <h2 className="font-semibold tracking-tight">Day-wise</h2>
            <p className="text-sm text-muted-foreground">Each day combines every period. Tap a day for its periods.</p>
          </div>
          <MonthCalendar
            month={data.month}
            days={data.days}
            today={today}
            selected={selectedDay?.date ?? null}
            onSelect={setSelected}
          />
          <Legend summary={data.month_summary} />
        </section>

        {/* Period-wise for the selected day */}
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold tracking-tight">Period-wise</h2>
          {selectedDay ? (
            <DayPeriods day={selectedDay} />
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              No attendance marked for {subject ?? "you"} in {monthLabel(data.month)}.
            </p>
          )}
        </section>
      </div>

      {data.day_details.length > 0 && (
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="border-b p-4 sm:px-5">
            <h2 className="font-semibold tracking-tight">Period-wise register</h2>
            <p className="text-sm text-muted-foreground">{monthLabel(data.month)} · every period marked, by day</p>
          </div>
          <ul className="divide-y">
            {data.day_details.map((day) => (
              <li key={day.date}>
                <button
                  type="button"
                  onClick={() => setSelected(day.date)}
                  className="flex w-full flex-col gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-4 sm:px-5"
                >
                  <span className="flex w-40 shrink-0 items-center gap-2">
                    <span className={cn("size-2 rounded-full", dayStatusMeta[day.status]?.dot)} />
                    <span className="text-sm font-medium">{formatDay(day.date)}</span>
                  </span>
                  <span className="flex flex-wrap gap-1.5">
                    {day.periods.map((p) => (
                      <span
                        key={p.period_number}
                        title={`${p.period_name ?? `Period ${p.period_number}`} · ${p.subject_name ?? ""} · ${periodStatusMeta[p.status]?.label ?? p.status}`}
                        className={cn("rounded-md px-1.5 py-0.5 text-2xs font-medium", periodStatusMeta[p.status]?.chip)}
                      >
                        P{p.period_number} {periodStatusMeta[p.status]?.short ?? p.status}
                      </span>
                    ))}
                  </span>
                  <span className="text-xs text-muted-foreground sm:ml-auto">{dayStatusMeta[day.status]?.label ?? day.status}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}

function DayPeriods({ day }: { day: AttendanceDay }) {
  const meta = dayStatusMeta[day.status];
  return (
    <div className="mt-2">
      <p className="flex items-center gap-2 text-sm">
        <span className="font-medium">{formatDay(day.date, true)}</span>
        {meta && <span className={cn("rounded-full px-2 py-0.5 text-2xs font-medium", meta.cell)}>{meta.label}</span>}
      </p>
      <ol className="mt-3 divide-y rounded-xl border">
        {day.periods.map((p) => (
          <PeriodRow key={p.period_number} period={p} />
        ))}
      </ol>
    </div>
  );
}

function PeriodRow({ period: p }: { period: PeriodMark }) {
  const meta = periodStatusMeta[p.status];
  return (
    <li className="flex items-center gap-3 px-3 py-2.5">
      <span className="w-14 shrink-0 text-xs text-muted-foreground tabular-nums">
        {p.start_time ? formatTime(p.start_time) : `P${p.period_number}`}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{p.subject_name ?? "—"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {p.period_name ?? `Period ${p.period_number}`}
          {p.marked_by && ` · marked by ${p.marked_by}`}
        </p>
      </div>
      <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-2xs font-medium", meta?.chip)}>{meta?.label ?? p.status}</span>
    </li>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  hint,
  warn,
}: {
  icon: typeof UserCheck;
  label: string;
  value: string;
  hint: string;
  warn?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border bg-card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted", warn && "bg-rose-500/10 text-rose-700 dark:text-rose-300")}>
          <Icon className="size-4" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </div>
  );
}

function MonthCalendar({
  month,
  days,
  today,
  selected,
  onSelect,
}: {
  month: string;
  days: Record<string, DayStatusValue>;
  today: string;
  selected: string | null;
  onSelect: (date: string) => void;
}) {
  const cells = useMemo(() => {
    const [y, m] = month.split("-").map(Number) as [number, number];
    const daysInMonth = new Date(y, m, 0).getDate();
    // Monday-first offset
    const offset = (new Date(y, m - 1, 1).getDay() + 6) % 7;
    const result: Array<{ day: number; key: string } | null> = Array.from({ length: offset }, () => null);
    for (let day = 1; day <= daysInMonth; day++) {
      result.push({ day, key: `${month}-${String(day).padStart(2, "0")}` });
    }
    return result;
  }, [month]);

  return (
    <div>
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-2">
        {cells.map((cell, i) => {
          if (!cell) return <span key={i} />;
          const status = days[cell.key];
          const meta = status ? dayStatusMeta[status] : undefined;
          const future = cell.key > today;
          const content = (
            <>
              {cell.day}
              {meta && <span className="hidden text-3xs font-normal sm:block">{meta.label}</span>}
            </>
          );
          const className = cn(
            "flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-medium tabular-nums",
            meta ? meta.cell : future ? "text-muted-foreground/40" : "text-muted-foreground/70",
            cell.key === today && "ring-2 ring-foreground/70 ring-offset-1 ring-offset-card",
            cell.key === selected && "outline-2 outline-offset-2 outline-primary",
          );
          return meta ? (
            <button
              key={cell.key}
              type="button"
              onClick={() => onSelect(cell.key)}
              title={meta.label}
              aria-pressed={cell.key === selected}
              className={cn(className, "transition-transform hover:scale-105")}
            >
              {content}
            </button>
          ) : (
            <span key={cell.key} title={future ? "Upcoming" : "Not marked"} className={className}>
              {content}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function Legend({ summary }: { summary: StudentAttendance["month_summary"] }) {
  const counts: Record<DayStatusValue, number> = {
    PRESENT: summary.present,
    LATE: summary.late,
    PARTIAL: summary.partial,
    ABSENT: summary.absent,
    LEAVE: summary.leave,
  };

  return (
    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs text-muted-foreground">
      {(Object.keys(dayStatusMeta) as DayStatusValue[]).map((s) => (
        <span key={s} className="inline-flex items-center gap-1.5">
          <span className={cn("size-2 rounded-full", dayStatusMeta[s].dot)} />
          {dayStatusMeta[s].label}
          <span className="font-medium text-foreground tabular-nums">{counts[s]}</span>
        </span>
      ))}
    </div>
  );
}
