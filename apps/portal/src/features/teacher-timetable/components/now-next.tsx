"use client";

import Link from "next/link";
import { CalendarCheck, Clock3, Coffee, MoonStar, UsersRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  findNowAndNext,
  formatTime,
  minutesBetween,
  toMinutes,
} from "../lib/timetable-utils";
import type { Lesson, TimetableModel } from "../types/teacher-timetable";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function dayName(day: number, today: number) {
  if (day === today) return "Today";
  if (day === (today + 1) % 7) return "Tomorrow";
  return DAY_NAMES[day] ?? "";
}

function inMinutes(mins: number) {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export function NowNext({ model, now }: { model: TimetableModel; now: Date }) {
  const { current, next, today } = findNowAndNext(model, now);
  const mins = now.getHours() * 60 + now.getMinutes();

  // What's happening if no lesson is running (based on today's own classes).
  const todays = model.bellSchedule.filter(
    (s) => s.kind === "period" && model.weekly[today]?.[s.period],
  );
  const first = todays[0];
  const last = todays[todays.length - 1];
  const idleText = !first || !last
    ? "No classes on your timetable today."
    : mins < toMinutes(first.start)
      ? `Your first class is at ${formatTime(first.start)}.`
      : mins >= toMinutes(last.end)
        ? "You're done for the day."
        : "Free period — no class right now.";

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Now */}
      <section
        className={cn(
          "relative overflow-hidden rounded-2xl border p-5",
          current ? "border-primary/20 bg-card" : "bg-card",
        )}
      >
        <div className="relative">
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-medium",
                current ? "bg-muted text-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {current ? (
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-primary" />
                </span>
              ) : (
                <Coffee className="size-3.5" />
              )}
              {current ? `Teaching now · ${current.lesson.periodName}` : "Right now"}
            </span>
            {current && (
              <span className="text-xs text-muted-foreground tabular-nums">
                {formatTime(current.slot.start)} – {formatTime(current.slot.end)}
              </span>
            )}
          </div>

          {current ? (
            <CurrentClass lesson={current.lesson} now={now} start={current.slot.start} end={current.slot.end} />
          ) : (
            <div className="mt-4 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-muted">
                <MoonStar className="size-5 text-muted-foreground" />
              </span>
              <p className="text-base font-medium">{idleText}</p>
            </div>
          )}
        </div>
      </section>

      {/* Next */}
      <section className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
            <Clock3 className="size-3.5" />
            Up next
            {next && next.day === today && ` · in ${inMinutes(minutesBetween(now, next.slot.start))}`}
          </span>
          {next && (
            <span className="text-xs text-muted-foreground tabular-nums">
              {dayName(next.day, today)} · {formatTime(next.slot.start)}
            </span>
          )}
        </div>

        {next ? (
          <NextClass lesson={next.lesson} />
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No lessons on your timetable yet.</p>
        )}
      </section>
    </div>
  );
}

function CurrentClass({
  lesson,
  now,
  start,
  end,
}: {
  lesson: Lesson;
  now: Date;
  start: string;
  end: string;
}) {
  const length = Math.max(1, toMinutes(end) - toMinutes(start));
  const left = Math.max(0, minutesBetween(now, end));
  const progress = Math.min(100, Math.round(((length - left) / length) * 100));

  return (
    <>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-semibold tracking-tight">{lesson.sectionName}</h3>
          <p className="mt-0.5 text-sm text-muted-foreground">{lesson.subject}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-semibold tabular-nums">{lesson.studentCount}</p>
          <p className="text-xs text-muted-foreground">students</p>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{left} min left</span>
      </div>
      <div className="mt-4 flex gap-2 border-t pt-4">
        <Link href="/teacher/attendance" className={buttonVariants({ size: "sm" })}>
          <CalendarCheck />
          Take attendance
        </Link>
        <Link href="/teacher/students" className={buttonVariants({ variant: "outline", size: "sm" })}>
          Class list
        </Link>
      </div>
    </>
  );
}

function NextClass({ lesson }: { lesson: Lesson }) {
  return (
    <>
      <div className="mt-4">
        <h3 className="text-xl font-semibold tracking-tight">{lesson.sectionName}</h3>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {lesson.subject} · {lesson.periodName}
        </p>
      </div>
      <dl className="mt-4 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="flex items-center gap-1 text-muted-foreground">
            <UsersRound className="size-3.5" /> Students
          </dt>
          <dd className="mt-1 text-base font-semibold tabular-nums">{lesson.studentCount}</dd>
        </div>
        <div className="rounded-xl bg-muted/50 p-3">
          <dt className="flex items-center gap-1 text-muted-foreground">
            <Clock3 className="size-3.5" /> Period
          </dt>
          <dd className="mt-1 truncate text-base font-semibold">{lesson.periodName}</dd>
        </div>
      </dl>
    </>
  );
}
