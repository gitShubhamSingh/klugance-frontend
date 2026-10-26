"use client";

import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";

import { usePeriods } from "@/features/timetable/hooks/use-periods";
import { cn } from "@/lib/utils";

import { formatClock, timeToMinutes } from "../lib/dashboard-format";
import { DashboardPanel, PanelMessage, PanelSkeleton } from "./dashboard-panel";

/** The school's bell schedule, with the running period highlighted. */
export function PeriodsCard() {
  const periods = usePeriods();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  const list = [...(periods.data ?? [])].sort(
    (a, b) => timeToMinutes(a.start_time) - timeToMinutes(b.start_time),
  );
  const mins = now.getHours() * 60 + now.getMinutes();
  const first = list[0];
  const last = list[list.length - 1];

  return (
    <DashboardPanel
      title="Periods"
      description={
        first && last
          ? `${list.length} periods · ${formatClock(first.start_time)} – ${formatClock(last.end_time)}`
          : "School bell schedule"
      }
      icon={CalendarClock}
      link={{ href: "/timetable", label: "Timetable" }}
      contentClassName="p-0"
    >
      {periods.isPending ? (
        <div className="p-5">
          <PanelSkeleton rows={6} />
        </div>
      ) : periods.isError ? (
        <div className="p-5">
          <PanelMessage title="Couldn't load periods" description="Please try again in a moment." />
        </div>
      ) : list.length === 0 ? (
        <div className="p-5">
          <PanelMessage
            title="No periods yet"
            description="Add periods to start building class timetables."
            action={{ href: "/timetable", label: "Open timetable" }}
          />
        </div>
      ) : (
        <ol className="max-h-96 overflow-auto py-1">
          {list.map((p) => {
            const start = timeToMinutes(p.start_time);
            const end = timeToMinutes(p.end_time);
            const state = mins >= end ? "done" : mins >= start ? "now" : "upcoming";

            return (
              <li
                key={p.id}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-2.5 transition-opacity",
                  state === "now" && "bg-primary/5",
                  state === "done" && "opacity-45",
                )}
              >
                {state === "now" && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />}
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {formatClock(p.start_time)} – {formatClock(p.end_time)}
                </span>
                <span className="flex w-12 justify-end">
                  {state === "now" ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" />
                      Now
                    </span>
                  ) : state === "done" ? (
                    <CheckCircle2 className="size-4 text-muted-foreground" aria-label="Over" />
                  ) : null}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </DashboardPanel>
  );
}
