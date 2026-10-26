"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Clock3,
  MoonStar,
  UserX,
  UsersRound,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { InitialsAvatar } from "@/features/dashboard/components/shared/initials-avatar";
import type { TeacherDashboardPeriod } from "@/features/dashboard/types/teacher-dashboard";
import {
  formatTime,
  minutesBetween,
  toMinutes,
} from "@/features/teacher-timetable/lib/timetable-utils";
import { cn } from "@/lib/utils";

import { getAttentionReason, getStudentFlag } from "../lib/student-insights";
import type { ClassSection, TeacherStudent } from "../types/teacher-students";

type Props = {
  sections: ClassSection[];
  students: TeacherStudent[];
  /** Today's periods from the teacher dashboard API, sorted by start time. */
  schedule: TeacherDashboardPeriod[];
  now: Date;
  onSelectSection: (sectionId: string) => void;
  onSelectStudent: (student: TeacherStudent) => void;
};

function formatStartsIn(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${minutes % 60} min`;
}

export function ClassContextCards({
  sections,
  students,
  schedule,
  now,
  onSelectSection,
  onSelectStudent,
}: Props) {
  const mins = now.getHours() * 60 + now.getMinutes();
  const current = schedule.find(
    (p) => mins >= toMinutes(p.start_time) && mins < toMinutes(p.end_time),
  );
  const next = schedule.find((p) => toMinutes(p.start_time) > mins);

  if (!current && !next) return null;

  const sectionById = new Map(sections.map((s) => [s.id, s]));

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {current ? (
        <CurrentCard
          period={current}
          section={sectionById.get(current.section_id)}
          students={students.filter((s) => s.sectionId === current.section_id)}
          now={now}
          onSelectSection={onSelectSection}
          onSelectStudent={onSelectStudent}
        />
      ) : (
        <section className="flex flex-col justify-center rounded-2xl border border-dashed bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-muted">
              <MoonStar className="size-5 text-muted-foreground" />
            </span>
            <div>
              <p className="font-medium">No class right now</p>
              <p className="text-sm text-muted-foreground">
                {next ? `Next class at ${formatTime(next.start_time)}` : "No more classes today"}
              </p>
            </div>
          </div>
        </section>
      )}

      {next ? (
        <NextCard
          period={next}
          students={students.filter((s) => s.sectionId === next.section_id)}
          now={now}
          onSelectSection={onSelectSection}
          onSelectStudent={onSelectStudent}
        />
      ) : (
        <section className="flex items-center justify-center rounded-2xl border border-dashed p-5 text-sm text-muted-foreground">
          No more classes today
        </section>
      )}
    </div>
  );
}

function CurrentCard({
  period,
  section,
  students,
  now,
  onSelectSection,
  onSelectStudent,
}: {
  period: TeacherDashboardPeriod;
  section: ClassSection | undefined;
  students: TeacherStudent[];
  now: Date;
  onSelectSection: (sectionId: string) => void;
  onSelectStudent: (student: TeacherStudent) => void;
}) {
  const marked = students.filter((s) => s.presentToday !== null);
  const absent = students.filter((s) => s.presentToday === false);
  const present = marked.length - absent.length;

  const length = Math.max(1, toMinutes(period.end_time) - toMinutes(period.start_time));
  const left = Math.max(0, minutesBetween(now, period.end_time));

  return (
    <section className="relative overflow-hidden rounded-2xl border border-primary/20 bg-card">
      <div className="relative p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            In class now · {period.period_name}
          </span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {formatTime(period.start_time)} – {formatTime(period.end_time)}
          </span>
        </div>

        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-tight">
              {section?.name ?? `${period.class_name} – ${period.section_name}`}
            </h3>
            <p className="mt-0.5 truncate text-sm text-muted-foreground">
              {period.subject_name} · {left} min left
            </p>
          </div>
          <div className="text-right">
            {marked.length > 0 ? (
              <>
                <p className="text-2xl font-semibold tabular-nums">
                  {present}
                  <span className="text-base text-muted-foreground">/{students.length}</span>
                </p>
                <p className="text-xs text-muted-foreground">present</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-semibold tabular-nums">{students.length}</p>
                <p className="text-xs text-muted-foreground">students</p>
              </>
            )}
          </div>
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, ((length - left) / length) * 100)}%` }}
          />
        </div>

        <div className="mt-4">
          {marked.length === 0 ? (
            <p className="text-sm text-muted-foreground">Attendance not marked yet today.</p>
          ) : (
            <>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <UserX className="size-3.5" />
                Absent today ({absent.length})
              </p>
              {absent.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {absent.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onSelectStudent(s)}
                      className="inline-flex items-center gap-2 rounded-full border bg-background py-1 pr-3 pl-1 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      <InitialsAvatar name={s.name} size="sm" className="size-6 text-3xs" />
                      {s.name}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                  Full attendance today 🎉
                </p>
              )}
            </>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t pt-4">
          {!period.attendance_marked && (
            <Link href="/teacher/attendance" className={buttonVariants({ size: "sm" })}>
              <CalendarCheck />
              Mark attendance
            </Link>
          )}
          <button
            type="button"
            onClick={() => onSelectSection(period.section_id)}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            View class list
          </button>
        </div>
      </div>
    </section>
  );
}

function NextCard({
  period,
  students,
  now,
  onSelectSection,
  onSelectStudent,
}: {
  period: TeacherDashboardPeriod;
  students: TeacherStudent[];
  now: Date;
  onSelectSection: (sectionId: string) => void;
  onSelectStudent: (student: TeacherStudent) => void;
}) {
  const absent = students.filter((s) => s.presentToday === false);
  const watch = students.filter((s) => getStudentFlag(s) === "attention").slice(0, 3);

  return (
    <section className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
          <Clock3 className="size-3.5" />
          Up next · in {formatStartsIn(minutesBetween(now, period.start_time))}
        </span>
        <span className="text-xs text-muted-foreground tabular-nums">
          {formatTime(period.start_time)} – {formatTime(period.end_time)}
        </span>
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-semibold tracking-tight">
          {period.class_name} – {period.section_name}
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted-foreground">
          {period.subject_name} · {period.period_name}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="flex items-center gap-1 text-muted-foreground">
            <UsersRound className="size-3.5" /> Students
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums">{students.length}</dd>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="flex items-center gap-1 text-muted-foreground">
            <UserX className="size-3.5" /> Absent today
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums">{absent.length}</dd>
        </div>
      </dl>

      {watch.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-medium text-muted-foreground">Keep an eye on</p>
          <ul className="mt-2 space-y-1">
            {watch.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => onSelectStudent(s)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-muted/60"
                >
                  <InitialsAvatar name={s.name} size="sm" className="size-7 text-3xs" />
                  <span className="truncate text-sm font-medium">{s.name}</span>
                  <span className="ml-auto truncate text-xs text-rose-600 dark:text-rose-400">
                    {getAttentionReason(s)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        onClick={() => onSelectSection(period.section_id)}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-3")}
      >
        View class list
        <ArrowRight />
      </button>
    </section>
  );
}
