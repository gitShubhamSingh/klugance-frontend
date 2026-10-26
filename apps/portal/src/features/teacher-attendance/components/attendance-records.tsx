"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  Search,
  TriangleAlert,
  Trophy,
  UserCheck,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getErrorMessage } from "@/core/api/get-error-message";
import { chartTooltipLabelStyle, chartTooltipStyle } from "@/features/dashboard/components/shared/chart-tooltip";
import { SectionCard } from "@/features/dashboard/components/shared/section-card";
import { cn } from "@/lib/utils";

import { useAttendanceRecords } from "../hooks/use-teacher-attendance";
import { studentName } from "../lib/attendance-utils";
import { dayStatusLabels, type DayStatus } from "../types/teacher-attendance";

type Props = {
  sectionId: string;
  sectionLabel: string;
  /** Local "YYYY-MM" of today; the latest month that can be shown. */
  currentMonth: string;
};

const cellStyles: Record<DayStatus, string> = {
  PRESENT: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  LATE: "bg-amber-400 text-amber-950",
  PARTIAL: "bg-amber-200 text-amber-900 dark:bg-amber-500/40 dark:text-amber-100",
  ABSENT: "bg-rose-500 text-white",
  LEAVE: "bg-muted text-muted-foreground",
};

const cellLetter: Record<DayStatus, string> = { PRESENT: "P", LATE: "L", PARTIAL: "½", ABSENT: "A", LEAVE: "LV" };

/** Share of the day attended, for the daily chart. */
const ATTENDED: Partial<Record<DayStatus, number>> = { PRESENT: 1, LATE: 1, PARTIAL: 0.5 };

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y ?? 2000, (m ?? 1) - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y ?? 2000, (m ?? 1) - 1, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function AttendanceRecords({ sectionId, sectionLabel, currentMonth }: Props) {
  const [month, setMonth] = useState(currentMonth);
  const [query, setQuery] = useState("");

  const recordsQuery = useAttendanceRecords(sectionId, month);
  const data = recordsQuery.data;

  const rows = useMemo(() => {
    if (!data) return [];
    return data.students.map((s) => ({
      id: s.enrollment_id,
      roll: s.roll_number,
      name: studentName(s),
      days: data.dates.map((d) => s.days[d]),
      periods: data.dates.map((d) => s.periods_marked[d] ?? 0),
      absentDays: s.absent_days,
      markedDays: s.marked_days,
      pct: s.attendance_percent === null ? null : Math.round(s.attendance_percent),
    }));
  }, [data]);

  const daily = useMemo(
    () =>
      (data?.dates ?? []).map((date, i) => {
        const marked = rows.filter((r) => r.days[i]);
        const attended = marked.reduce((sum, r) => sum + (ATTENDED[r.days[i]!] ?? 0), 0);
        return {
          day: String(Number(date.slice(8, 10))),
          date,
          pct: marked.length ? Math.round((attended / marked.length) * 100) : 0,
        };
      }),
    [data, rows],
  );

  const known = rows.filter((r) => r.pct !== null);
  const stats = {
    avg: known.length ? Math.round(known.reduce((sum, r) => sum + (r.pct ?? 0), 0) / known.length) : null,
    perfect: rows.filter((r) => r.markedDays > 0 && r.absentDays === 0).length,
    low: known.filter((r) => (r.pct ?? 100) < 75).length,
    days: data?.dates.length ?? 0,
  };

  const visible = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    return !q || r.name.toLowerCase().includes(q) || r.roll.toLowerCase().includes(q);
  });

  const label = monthLabel(month);

  return (
    <div className="space-y-6">
      {/* Month picker */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {sectionLabel} · <span className="font-medium text-foreground">{label}</span>
        </p>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon-sm" aria-label="Previous month" onClick={() => setMonth(shiftMonth(month, -1))}>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next month"
            disabled={month >= currentMonth}
            onClick={() => setMonth(shiftMonth(month, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>

      {recordsQuery.isLoading ? (
        <div className="space-y-6" role="status" aria-label="Loading records">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-72 rounded-2xl" />
        </div>
      ) : recordsQuery.isError || !data ? (
        <div role="alert" className="flex flex-col items-center rounded-2xl border p-8 text-center">
          <AlertCircle className="size-7 text-destructive" />
          <h2 className="mt-3 font-semibold">Unable to load attendance records</h2>
          <p className="mt-1 max-w-md text-sm text-muted-foreground">{getErrorMessage(recordsQuery.error)}</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => void recordsQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
            <MiniStat icon={UserCheck} label="Average attendance" value={stats.avg === null ? "—" : `${stats.avg}%`} hint={label} />
            <MiniStat icon={CalendarRange} label="Days marked" value={`${stats.days}`} hint="Days with attendance taken" />
            <MiniStat icon={Trophy} label="Full attendance" value={`${stats.perfect}`} hint="No absences this month" positive />
            <MiniStat icon={TriangleAlert} label="Below 75%" value={`${stats.low}`} hint="Need follow-up" warn />
          </div>

          {data.dates.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">
              No attendance taken for {sectionLabel} in {label}.
            </div>
          ) : (
            <>
              {/* Trend */}
              <SectionCard title="Daily attendance" description={`${sectionLabel} · ${label}`} icon={BarChart3}>
                <div className="h-52 text-muted-foreground">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={daily} margin={{ top: 8, right: 4, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.12} />
                      <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                      <YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: "currentColor", fontSize: 11 }} />
                      <Tooltip
                        cursor={{ fill: "currentColor", fillOpacity: 0.05 }}
                        contentStyle={chartTooltipStyle}
                        labelStyle={chartTooltipLabelStyle}
                        labelFormatter={(_d, payload) => {
                          const date = payload?.[0]?.payload?.date as string | undefined;
                          return date
                            ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                            : "";
                        }}
                        formatter={(v) => [`${v}%`, "Attendance"]}
                      />
                      <Bar dataKey="pct" radius={[4, 4, 0, 0]} maxBarSize={22}>
                        {daily.map((d) => (
                          <Cell key={d.date} fill={d.pct >= 90 ? "#10b981" : d.pct >= 80 ? "#f59e0b" : "#f43f5e"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </SectionCard>

              {/* Register */}
              <section className="overflow-hidden rounded-2xl border bg-card">
                <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div>
                    <h2 className="font-semibold tracking-tight">Attendance register</h2>
                    <p className="text-sm text-muted-foreground">
                      {sectionLabel} · {label}
                    </p>
                  </div>
                  <div className="relative sm:w-60">
                    <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search student"
                      className="h-9 pl-8"
                      aria-label="Search register"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-separate border-spacing-0 text-xs">
                    <thead>
                      <tr className="text-muted-foreground">
                        <th className="sticky left-0 z-10 border-b bg-muted/60 px-4 py-2.5 text-left font-semibold backdrop-blur sm:px-5">
                          Student
                        </th>
                        {daily.map((d) => (
                          <th key={d.date} className="border-b bg-muted/30 px-0.5 py-2.5 text-center font-medium tabular-nums">
                            {d.day}
                          </th>
                        ))}
                        <th className="border-b bg-muted/30 px-4 py-2.5 text-right font-semibold">%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visible.map((r) => (
                        <tr key={r.id} className="group">
                          <td className="sticky left-0 z-10 border-b bg-card px-4 py-2 group-hover:bg-muted sm:px-5">
                            <div className="flex w-32 items-center gap-2 sm:w-44">
                              <span className="w-8 shrink-0 text-muted-foreground tabular-nums">{r.roll}</span>
                              <span className="truncate text-sm font-medium">{r.name}</span>
                            </div>
                          </td>
                          {r.days.map((status, i) => (
                            <td key={daily[i]?.date ?? i} className="border-b px-0.5 py-2 text-center group-hover:bg-muted/40">
                              <DayCell status={status} periods={r.periods[i] ?? 0} />
                            </td>
                          ))}
                          <td className="border-b px-4 py-2 text-right group-hover:bg-muted/40">
                            <span
                              className={cn(
                                "text-sm font-semibold tabular-nums",
                                r.pct === null
                                  ? "text-muted-foreground"
                                  : r.pct >= 90
                                    ? "text-emerald-700 dark:text-emerald-400"
                                    : r.pct >= 75
                                      ? "text-foreground"
                                      : "text-rose-600 dark:text-rose-400",
                              )}
                            >
                              {r.pct === null ? "—" : `${r.pct}%`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 border-t px-4 py-3 text-2xs text-muted-foreground sm:px-5">
                  {(Object.keys(cellStyles) as DayStatus[]).map((s) => (
                    <span key={s} className="inline-flex items-center gap-1.5">
                      <span className={cn("flex size-4 items-center justify-center rounded text-[8px] font-bold", cellStyles[s])}>
                        {cellLetter[s]}
                      </span>
                      {dayStatusLabels[s]}
                    </span>
                  ))}
                  <span className="ml-auto">Each day combines every period of the class.</span>
                </div>
              </section>
            </>
          )}
        </>
      )}
    </div>
  );
}

function DayCell({ status, periods }: { status?: DayStatus; periods: number }) {
  if (!status) return <span className="text-muted-foreground/40">·</span>;
  return (
    <span
      title={`${dayStatusLabels[status]} · ${periods} ${periods === 1 ? "period" : "periods"} marked`}
      className={cn(
        "mx-auto flex size-6 items-center justify-center rounded-md text-3xs font-semibold",
        cellStyles[status],
      )}
    >
      {status === "PRESENT" ? "" : cellLetter[status]}
    </span>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  hint,
  warn,
  positive,
}: {
  icon: typeof UserCheck;
  label: string;
  value: string;
  hint: string;
  warn?: boolean;
  positive?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border bg-card p-3.5 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="min-w-0 text-xs leading-snug font-medium text-muted-foreground sm:text-sm">{label}</span>
        <div
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted sm:size-9 sm:rounded-xl",
            warn && "bg-rose-500/10 text-rose-700 dark:text-rose-300",
            positive && "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          )}
        >
          <Icon className="size-3.5 sm:size-4.5" />
        </div>
      </div>
      <p className="mt-2.5 text-2xl font-semibold tracking-tight tabular-nums sm:mt-4 sm:text-3xl">{value}</p>
      <p className="mt-1.5 line-clamp-2 text-2xs leading-snug text-muted-foreground sm:mt-2 sm:text-xs">{hint}</p>
    </div>
  );
}
