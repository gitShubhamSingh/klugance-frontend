"use client";

import { CheckCircle2, UsersRound } from "lucide-react";

import { toneStyles, type Tone } from "@/features/dashboard/lib/tones";
import { cn } from "@/lib/utils";

import type { SlotState } from "../lib/timetable-utils";
import type { Lesson } from "../types/teacher-timetable";

export type Emphasis = "now" | "next" | "upcoming" | "done" | "otherDay" | "neutral";

/** Decide how prominent a slot should look relative to the current time. */
export function getEmphasis({
  focus,
  isToday,
  state,
  isNext,
}: {
  /** False on Sundays — nothing is dimmed then. */
  focus: boolean;
  isToday: boolean;
  state: SlotState;
  isNext?: boolean;
}): Emphasis {
  if (!focus) return "neutral";
  if (!isToday) return "otherDay";
  if (state === "now") return "now";
  if (state === "done") return "done";
  return isNext ? "next" : "upcoming";
}

/** Shared visual treatment for every emphasis level. */
export const emphasisClasses: Record<Emphasis, string> = {
  now: "ring-2 ring-primary ring-offset-2 ring-offset-card shadow-sm",
  next: "ring-1 ring-primary/30",
  upcoming: "opacity-80 hover:opacity-100",
  done: "opacity-35 grayscale hover:opacity-70",
  otherDay: "opacity-45 hover:opacity-100",
  neutral: "",
};

type CellProps = {
  lesson?: Lesson;
  tone: Tone;
  emphasis: Emphasis;
};

function StateTag({ emphasis }: { emphasis: Emphasis }) {
  if (emphasis === "now") {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-primary px-1.5 py-px text-4xs font-semibold tracking-wide text-primary-foreground uppercase">
        <span className="size-1.5 animate-pulse rounded-full bg-white" />
        Now
      </span>
    );
  }
  if (emphasis === "next") {
    return (
      <span className="shrink-0 rounded-full border border-primary/30 px-1.5 py-px text-4xs font-semibold tracking-wide text-foreground uppercase">
        Next
      </span>
    );
  }
  if (emphasis === "done") {
    return <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground" aria-label="Done" />;
  }
  return null;
}

/** One timetable cell: a class or a free period. */
export function LessonCell({ lesson, tone: toneName, emphasis }: CellProps) {
  const base = "relative flex h-full min-h-20 transition-all duration-300";

  if (!lesson) {
    return (
      <div
        className={cn(
          base,
          "items-center justify-center rounded-xl border border-dashed text-xs text-muted-foreground/70",
          emphasis === "now" && "border-primary bg-muted/50 font-medium text-foreground",
          emphasis !== "now" && emphasisClasses[emphasis],
        )}
      >
        {emphasis === "now" ? "Free · now" : "Free"}
      </div>
    );
  }

  const tone = toneStyles[toneName];

  return (
    <div
      className={cn(
        base,
        "flex-col justify-between overflow-hidden rounded-xl border p-2.5 pl-3.5",
        tone.soft,
        emphasisClasses[emphasis],
      )}
    >
      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", tone.solid)} />
      <div className="relative min-w-0">
        <div className="flex items-center justify-between gap-1">
          <p className={cn("truncate text-sm font-semibold", tone.text)}>{lesson.sectionName}</p>
          <StateTag emphasis={emphasis} />
        </div>
        <p className="truncate text-2xs text-foreground/80">{lesson.subject}</p>
      </div>
      <div className="relative mt-1.5 flex items-center justify-between gap-1 text-2xs text-muted-foreground">
        <span className="truncate">{lesson.periodName}</span>
        <span className="flex shrink-0 items-center gap-1 tabular-nums">
          <UsersRound className="size-3" />
          {lesson.studentCount}
        </span>
      </div>
    </div>
  );
}

/** Small key explaining the highlight states. */
export function EmphasisLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-muted ring-2 ring-primary" />
        Running now
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-muted ring-1 ring-primary/30" />
        Next up
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-muted opacity-80" />
        Upcoming
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="size-3 rounded-sm bg-muted-foreground/40 opacity-50" />
        Completed
      </span>
    </div>
  );
}
