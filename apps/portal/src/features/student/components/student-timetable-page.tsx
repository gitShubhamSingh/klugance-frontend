"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { LoadErrorState } from "@/features/parent-children";
import { formatTime, toMinutes } from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { useStudentTimetable } from "../hooks/use-student";
import type { StudentTimetableEntry } from "../types/student";

const DAYS = [
  { key: "MONDAY", short: "Mon", js: 1 },
  { key: "TUESDAY", short: "Tue", js: 2 },
  { key: "WEDNESDAY", short: "Wed", js: 3 },
  { key: "THURSDAY", short: "Thu", js: 4 },
  { key: "FRIDAY", short: "Fri", js: 5 },
  { key: "SATURDAY", short: "Sat", js: 6 },
  { key: "SUNDAY", short: "Sun", js: 0 },
];

/** Re-renders every 30s so the current period moves on its own. */
function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

export function StudentTimetablePage() {
  const now = useNow();
  const query = useStudentTimetable();
  const data = query.data;

  const todayKey = DAYS.find((d) => d.js === now.getDay())?.key;
  const [day, setDay] = useState(todayKey && todayKey !== "SUNDAY" ? todayKey : "MONDAY");

  const { days, slots, grid } = useMemo(() => {
    const entries = data?.entries ?? [];
    const usedDays = DAYS.filter((d) => d.key !== "SUNDAY" || entries.some((e) => e.day_of_week === "SUNDAY"));
    // Rows: every distinct period time used in the week, in order.
    const times = [
      ...new Map(entries.map((e) => [`${e.start_time}-${e.end_time}`, { start: e.start_time, end: e.end_time }])).values(),
    ].sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
    const map = new Map<string, StudentTimetableEntry>();
    entries.forEach((e) => {
      const key = `${e.day_of_week}|${e.start_time}-${e.end_time}`;
      if (!map.has(key)) map.set(key, e);
    });
    return { days: usedDays, slots: times, grid: map };
  }, [data]);

  const mins = now.getHours() * 60 + now.getMinutes();
  const isNow = (dayKey: string, start: string, end: string) =>
    dayKey === todayKey && mins >= toMinutes(start) && mins < toMinutes(end);

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Timetable</h1>
          <p className="mt-2 text-muted-foreground">
            {data?.class_name
              ? `${data.class_name}${data.section_name ? ` – ${data.section_name}` : ""} · weekly schedule`
              : "Your weekly class schedule"}
          </p>
        </div>

        {query.isLoading ? (
          <Skeleton className="h-96 rounded-2xl" role="status" aria-label="Loading timetable" />
        ) : query.isError || !data ? (
          <LoadErrorState
            title="Unable to load your timetable"
            message={getErrorMessage(query.error)}
            onRetry={() => void query.refetch()}
          />
        ) : slots.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <CalendarDays className="mx-auto size-7 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">No timetable yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your classes appear here once the school publishes the timetable.</p>
          </div>
        ) : (
          <>
            {/* Day view (phones) */}
            <div className="space-y-3 lg:hidden">
              <div role="tablist" aria-label="Choose day" className="grid grid-cols-6 gap-1 rounded-xl bg-muted p-1">
                {days.slice(0, 6).map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    role="tab"
                    aria-selected={d.key === day}
                    onClick={() => setDay(d.key)}
                    className={cn(
                      "rounded-lg py-2 text-sm font-medium transition-colors",
                      d.key === day ? "bg-background text-foreground shadow-sm" : "text-muted-foreground",
                    )}
                  >
                    {d.short}
                  </button>
                ))}
              </div>
              <ol className="overflow-hidden rounded-2xl border bg-card">
                {slots.map((slot) => {
                  const entry = grid.get(`${day}|${slot.start}-${slot.end}`);
                  const live = isNow(day, slot.start, slot.end);
                  return (
                    <li key={`${slot.start}-${slot.end}`} className={cn("flex gap-3 border-b px-4 py-3 last:border-b-0", live && "bg-muted/60")}>
                      <p className="w-16 shrink-0 text-2xs leading-tight text-muted-foreground tabular-nums">
                        {formatTime(slot.start)}
                        <br />
                        {formatTime(slot.end)}
                      </p>
                      {entry ? (
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {entry.subject_name}
                            {live && <span className="ml-2 rounded-full bg-primary px-1.5 py-px text-4xs font-semibold text-primary-foreground uppercase">Now</span>}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {entry.period_name}
                            {entry.teacher_name && ` · ${entry.teacher_name}`}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Free</p>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* Week grid (desktop) */}
            <div className="hidden overflow-x-auto rounded-2xl border bg-card lg:block">
              <table className="w-full min-w-[800px] table-fixed border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="w-24 border-b px-3 py-3 text-left text-xs font-semibold text-muted-foreground">Time</th>
                    {days.map((d) => (
                      <th key={d.key} className={cn("border-b px-1.5 py-3 text-center", d.key === todayKey && "bg-muted/60")}>
                        <span
                          className={cn(
                            "inline-flex rounded-full px-3 py-1 text-sm font-semibold",
                            d.key === todayKey ? "bg-primary text-primary-foreground" : "",
                          )}
                        >
                          {d.short}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map((slot) => (
                    <tr key={`${slot.start}-${slot.end}`}>
                      <td className="border-b px-3 py-2 align-top text-2xs leading-tight text-muted-foreground tabular-nums">
                        {formatTime(slot.start)}
                        <br />
                        {formatTime(slot.end)}
                      </td>
                      {days.map((d) => {
                        const entry = grid.get(`${d.key}|${slot.start}-${slot.end}`);
                        const live = isNow(d.key, slot.start, slot.end);
                        return (
                          <td key={d.key} className={cn("h-20 border-b p-1.5 align-top", d.key === todayKey && "bg-muted/60")}>
                            {entry ? (
                              <div
                                className={cn(
                                  "flex h-full min-h-16 flex-col justify-between rounded-xl border bg-card p-2.5",
                                  live && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                                )}
                              >
                                <p className="truncate text-sm font-semibold">{entry.subject_name}</p>
                                <p className="truncate text-2xs text-muted-foreground">{entry.teacher_name ?? entry.period_name}</p>
                              </div>
                            ) : (
                              <div className="flex h-full min-h-16 items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground/60">
                                Free
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}
