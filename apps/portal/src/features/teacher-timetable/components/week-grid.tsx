"use client";

import { Coffee, UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

import { sectionTone } from "../lib/build-timetable";
import {
  findNowAndNext,
  formatTime,
  getLesson,
  getSlotState,
  toMinutes,
} from "../lib/timetable-utils";
import type { TimetableModel } from "../types/teacher-timetable";
import { EmphasisLegend, LessonCell, getEmphasis } from "./lesson-parts";

export function WeekGrid({ model, now }: { model: TimetableModel; now: Date }) {
  const { bellSchedule, schoolDays } = model;
  const today = now.getDay();
  const focus = schoolDays.some((d) => d.day === today);
  const { next } = findNowAndNext(model, now);
  const nextPeriodToday = next && next.day === today ? next.slot.period : null;

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-2xl border bg-card">
        <table className="w-full min-w-[880px] table-fixed border-separate border-spacing-0">
          <colgroup>
            <col className="w-24" />
            {schoolDays.map((d) => (
              <col key={d.day} />
            ))}
          </colgroup>
          <thead>
            <tr>
              <th className="sticky left-0 z-10 border-b bg-card px-3 py-3 text-left text-xs font-semibold text-muted-foreground">
                Period
              </th>
              {schoolDays.map((d) => {
                const isToday = d.day === today;
                return (
                  <th
                    key={d.day}
                    className={cn(
                      "border-b px-1.5 py-3 text-center transition-opacity",
                      isToday && "bg-muted/60",
                      focus && !isToday && "opacity-50",
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold",
                        isToday ? "bg-primary text-primary-foreground" : "text-foreground",
                      )}
                    >
                      {d.short}
                      {isToday && <span className="text-3xs font-medium opacity-80">Today</span>}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {bellSchedule.map((slot) => {
              const rowState = focus ? getSlotState(slot, today, now) : "upcoming";

              if (slot.kind === "break") {
                const Icon = toMinutesSpan(slot) >= 30 ? UtensilsCrossed : Coffee;
                const isNow = focus && rowState === "now";
                return (
                  <tr key={`break-${slot.start}`}>
                    <td
                      className={cn(
                        "sticky left-0 z-10 border-b bg-card px-3 py-2 text-2xs text-muted-foreground tabular-nums",
                        focus && rowState === "done" && "opacity-50",
                      )}
                    >
                      {formatTime(slot.start)}
                    </td>
                    <td
                      colSpan={schoolDays.length}
                      className={cn(
                        "border-b px-3 py-2 transition-colors",
                        isNow ? "bg-muted" : "bg-muted/40",
                        focus && rowState === "done" && "opacity-50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex items-center justify-center gap-2 text-xs font-medium tracking-wide uppercase",
                          isNow ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        <Icon className="size-3.5" />
                        {slot.label}
                        <span className="font-normal normal-case">
                          · {formatTime(slot.start)} – {formatTime(slot.end)}
                        </span>
                        {isNow && (
                          <span className="rounded-full bg-primary px-1.5 py-px text-4xs font-semibold text-primary-foreground">NOW</span>
                        )}
                      </span>
                    </td>
                  </tr>
                );
              }

              const rowIsNow = focus && rowState === "now";
              const rowIsDone = focus && rowState === "done";

              return (
                <tr key={slot.period}>
                  <td
                    className={cn(
                      "sticky left-0 z-10 border-b bg-card px-3 py-2 align-top transition-opacity",
                      rowIsDone && "opacity-45",
                    )}
                  >
                    <p className={cn("text-sm font-semibold", rowIsNow && "text-foreground")}>
                      P{slot.period}
                    </p>
                    <p
                      className={cn(
                        "text-2xs leading-tight tabular-nums",
                        rowIsNow ? "font-medium text-foreground" : "text-muted-foreground",
                      )}
                    >
                      {formatTime(slot.start)}
                      <br />
                      {formatTime(slot.end)}
                    </p>
                  </td>
                  {schoolDays.map((d) => {
                    const isToday = d.day === today;
                    const emphasis = getEmphasis({
                      focus,
                      isToday,
                      state: getSlotState(slot, d.day, now),
                      isNext: isToday && slot.period === nextPeriodToday,
                    });
                    const lesson = getLesson(model, d.day, slot.period);
                    return (
                      <td
                        key={d.day}
                        className={cn("h-24 border-b p-1.5 align-top", isToday && "bg-muted/60")}
                      >
                        <LessonCell
                          lesson={lesson}
                          tone={lesson ? sectionTone(model, lesson.sectionId) : "indigo"}
                          emphasis={emphasis}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {focus && <EmphasisLegend />}
    </div>
  );
}

function toMinutesSpan(slot: { start: string; end: string }) {
  return toMinutes(slot.end) - toMinutes(slot.start);
}
