"use client";

import { CheckCircle2, Coffee, UsersRound, UtensilsCrossed } from "lucide-react";

import { toneStyles, type Tone } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import { sectionTone } from "../lib/build-timetable";
import {
  findNowAndNext,
  formatTime,
  getLesson,
  getSlotState,
  toMinutes,
} from "../lib/timetable-utils";
import type { Lesson, TimetableModel } from "../types/teacher-timetable";
import { EmphasisLegend } from "./lesson-parts";

type Props = {
  model: TimetableModel;
  day: number;
  onDayChange: (day: number) => void;
  now: Date;
};

export function DaySchedule({ model, day, onDayChange, now }: Props) {
  const { schoolDays } = model;
  const today = now.getDay();
  const isToday = day === today;
  const { next } = findNowAndNext(model, now);
  const nextPeriodToday = isToday && next && next.day === today ? next.slot.period : null;
  const slots = model.bellSchedule;

  return (
    <div className="space-y-4">
      {/* Day tabs */}
      <div
        role="tablist"
        aria-label="Choose day"
        className={cn("grid gap-1 rounded-xl bg-muted p-1", schoolDays.length === 7 ? "grid-cols-7" : "grid-cols-6")}
      >
        {schoolDays.map((d) => (
          <button
            key={d.day}
            type="button"
            role="tab"
            aria-selected={d.day === day}
            onClick={() => onDayChange(d.day)}
            className={cn(
              "relative rounded-lg py-2 text-sm font-medium transition-colors",
              d.day === day ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {d.short}
            {d.day === today && (
              <span className="absolute top-1 right-1 size-1.5 rounded-full bg-primary" aria-label="Today" />
            )}
          </button>
        ))}
      </div>

      <ol className="overflow-hidden rounded-2xl border bg-card">
        {slots.map((slot) => {
          if (slot.kind === "break") {
            const Icon = toMinutes(slot.end) - toMinutes(slot.start) >= 30 ? UtensilsCrossed : Coffee;
            const breakState = getSlotState(slot, day, now);
            const breakNow = isToday && breakState === "now";
            return (
              <li
                key={`break-${slot.start}`}
                className={cn(
                  "flex items-center gap-3 border-b px-4 py-2 text-xs last:border-b-0",
                  breakNow
                    ? "bg-muted font-medium text-foreground"
                    : "bg-muted/40 text-muted-foreground",
                  isToday && breakState === "done" && "opacity-50",
                )}
              >
                <Icon className="size-3.5" />
                <span className="font-medium tracking-wide uppercase">{slot.label}</span>
                {breakNow && (
                  <span className="rounded-full bg-primary px-1.5 py-px text-4xs font-semibold text-primary-foreground">NOW</span>
                )}
                <span className="ml-auto tabular-nums">
                  {formatTime(slot.start)} – {formatTime(slot.end)}
                </span>
              </li>
            );
          }

          const lesson = getLesson(model, day, slot.period);
          const state = getSlotState(slot, day, now);
          const live = isToday && state === "now";
          const done = isToday && state === "done";
          const isNext = slot.period === nextPeriodToday;
          const upcoming = isToday && state === "upcoming" && !isNext;

          return (
            <li
              key={slot.period}
              className={cn(
                "relative flex items-stretch gap-3 border-b px-4 py-3 transition-all duration-300 last:border-b-0",
                live && "bg-muted/60 py-4",
                done && "opacity-40 grayscale hover:opacity-70",
                upcoming && "opacity-80 hover:opacity-100",
              )}
            >
              {live && <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-primary" />}
              <div className="w-16 shrink-0">
                <p className={cn("text-sm font-semibold", live && "text-foreground")}>
                  P{slot.period}
                </p>
                <p
                  className={cn(
                    "text-2xs leading-tight tabular-nums",
                    live ? "font-medium text-foreground" : "text-muted-foreground",
                  )}
                >
                  {formatTime(slot.start)}
                  <br />
                  {formatTime(slot.end)}
                </p>
              </div>

              <div className="min-w-0 flex-1">
                {!lesson ? (
                  <div className="flex h-full items-center rounded-xl border border-dashed px-3 text-sm text-muted-foreground">
                    Free period
                  </div>
                ) : (
                  <ClassRow lesson={lesson} tone={sectionTone(model, lesson.sectionId)} live={live} />
                )}
              </div>

              <div className="hidden w-20 shrink-0 items-center justify-end sm:flex">
                {live ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-2xs font-semibold text-primary-foreground">
                    <span className="size-1.5 animate-pulse rounded-full bg-white" />
                    Now
                  </span>
                ) : isNext ? (
                  <span className="rounded-full border border-primary/30 px-2 py-0.5 text-2xs font-semibold text-foreground">
                    Next
                  </span>
                ) : done ? (
                  <span className="inline-flex items-center gap-1 text-2xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5" />
                    Done
                  </span>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
      {isToday && <EmphasisLegend />}
    </div>
  );
}

function ClassRow({ lesson, tone: toneName, live }: { lesson: Lesson; tone: Tone; live: boolean }) {
  const tone = toneStyles[toneName];

  return (
    <div
      className={cn(
        "relative flex items-center justify-between gap-3 overflow-hidden rounded-xl px-3 py-2.5 pl-4",
        tone.soft,
        live && "shadow-sm ring-2 ring-primary",
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", tone.solid)} />
      <div className="min-w-0">
        <p className={cn("truncate text-sm font-semibold", tone.text)}>
          {lesson.sectionName}
          {live && <span className="ml-2 rounded-full bg-primary px-1.5 py-px text-4xs font-semibold text-primary-foreground uppercase sm:hidden">Now</span>}
        </p>
        <p className="truncate text-xs text-foreground/75">
          {lesson.subject} · {lesson.periodName}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="inline-flex items-center gap-1 text-sm font-semibold tabular-nums">
          <UsersRound className="size-3.5 text-muted-foreground" />
          {lesson.studentCount}
        </p>
        <p className="text-3xs text-muted-foreground">students</p>
      </div>
    </div>
  );
}
