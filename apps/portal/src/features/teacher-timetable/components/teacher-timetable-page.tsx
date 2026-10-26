"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CalendarDays,
  Coffee,
  LayoutGrid,
  ListOrdered,
  School,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { getErrorMessage } from "@/core/api/get-error-message";
import { toneStyles } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import { useTeacherTimetable } from "../hooks/use-teacher-timetable";
import { getLesson, getPeriodSlots } from "../lib/timetable-utils";
import type { TimetableModel } from "../types/teacher-timetable";
import { DaySchedule } from "./day-schedule";
import { NowNext } from "./now-next";
import { WeekGrid } from "./week-grid";

type View = "week" | "day";

export function TeacherTimetablePage() {
  const timetableQuery = useTeacherTimetable();
  const [now, setNow] = useState(() => new Date());
  const [view, setView] = useState<View>("week");
  const [day, setDay] = useState(() => {
    const d = new Date().getDay();
    return d === 0 ? 1 : d;
  });

  // Keep "now" fresh so the live period moves on its own.
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);

  // Phones get the simpler day view by default.
  useEffect(() => {
    if (window.matchMedia("(max-width: 1023px)").matches) setView("day");
  }, []);

  const todayLabel = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(now);

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable</h1>
            <p className="mt-2 text-muted-foreground">
              {todayLabel}
              {timetableQuery.data?.academicYearName && ` · ${timetableQuery.data.academicYearName}`}
            </p>
          </div>

          <div role="tablist" aria-label="Timetable view" className="flex self-start rounded-xl bg-muted p-1 md:self-auto">
            <ViewButton active={view === "week"} onClick={() => setView("week")} icon={LayoutGrid}>
              Week
            </ViewButton>
            <ViewButton active={view === "day"} onClick={() => setView("day")} icon={ListOrdered}>
              Day
            </ViewButton>
          </div>
        </div>

        {timetableQuery.isLoading ? (
          <TimetableSkeleton />
        ) : timetableQuery.isError || !timetableQuery.data ? (
          <ErrorState
            message={getErrorMessage(timetableQuery.error)}
            onRetry={() => void timetableQuery.refetch()}
          />
        ) : timetableQuery.data.bellSchedule.length === 0 ? (
          <div className="rounded-2xl border border-dashed p-10 text-center">
            <CalendarDays className="mx-auto size-7 text-muted-foreground" />
            <h2 className="mt-3 font-semibold">No timetable yet</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your classes appear here once the school publishes the timetable.
            </p>
          </div>
        ) : (
          <TimetableBody model={timetableQuery.data} now={now} view={view} day={day} onDayChange={setDay} />
        )}
      </div>
    </PageContainer>
  );
}

function TimetableBody({
  model,
  now,
  view,
  day,
  onDayChange,
}: {
  model: TimetableModel;
  now: Date;
  view: View;
  day: number;
  onDayChange: (day: number) => void;
}) {
  const stats = useMemo(() => {
    let classes = 0;
    let free = 0;
    const slots = getPeriodSlots(model);

    model.schoolDays.forEach(({ day: d }) => {
      // Only count days the teacher actually teaches on.
      if (!model.weekly[d] || Object.keys(model.weekly[d]).length === 0) return;
      slots.forEach((slot) => {
        if (getLesson(model, d, slot.period)) classes += 1;
        else free += 1;
      });
    });

    return {
      classes,
      free,
      students: model.sections.reduce((sum, s) => sum + s.studentCount, 0),
    };
  }, [model]);

  return (
    <>
      {/* Now & next */}
      <NowNext model={model} now={now} />

      {/* Weekly summary */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Summary icon={CalendarDays} label="Classes this week" value={stats.classes} />
        <Summary icon={School} label="Sections" value={model.sections.length} />
        <Summary icon={UsersRound} label="Students taught" value={stats.students} />
        <Summary icon={Coffee} label="Free periods" value={stats.free} />
      </div>

      {/* Timetable */}
      {view === "week" ? (
        <WeekGrid model={model} now={now} />
      ) : (
        <DaySchedule model={model} day={day} onDayChange={onDayChange} now={now} />
      )}

      {/* Legend: classes per section */}
      <div className="flex flex-wrap gap-2">
        {model.sections.map((s) => {
          const tone = toneStyles[s.tone];
          return (
            <span
              key={s.id}
              className="inline-flex items-center gap-2 rounded-full border bg-card py-1 pr-3 pl-1.5 text-xs"
            >
              <span className={cn("size-3 rounded-full", tone.solid)} />
              <span className="font-medium">{s.shortName}</span>
              <span className="text-muted-foreground">
                {s.subjects} · {s.periodsPerWeek}/wk · {s.studentCount} students
              </span>
            </span>
          );
        })}
      </div>
    </>
  );
}

function TimetableSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-live="polite" aria-label="Loading timetable">
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-44 rounded-2xl" />
        <Skeleton className="h-44 rounded-2xl" />
      </div>
      <Skeleton className="h-96 rounded-2xl" />
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center rounded-2xl border p-8 text-center">
      <AlertCircle className="size-7 text-destructive" />
      <h2 className="mt-3 font-semibold">Unable to load your timetable</h2>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      <Button type="button" variant="outline" className="mt-4" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutGrid;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
        active ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}

function Summary({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border bg-card p-3.5 sm:p-4">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted">
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">{value}</p>
        <p className="truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
