"use client";

import {
  BookOpen,
  Clock3,
  UserRound,
  Plus,
  Trash2,
} from "lucide-react";

import {useState} from "react";
import { Button } from "@/components/ui/button";

import type { TimetableGridData } from "../types/timetable-grid";
import { AssignTimetableDialog } from "./assign-timetable-dialog";
import { DeleteTimetableDialog } from "./delete-timetable-dialog";

type Props = {
  data?: TimetableGridData;
  isLoading?: boolean;
  classId: string;
  sectionId: string;
  academicYearId: string;
};

const DAYS = [
  {
    key: "MONDAY" as const,
    label: "Monday",
  },
  {
    key: "TUESDAY" as const,
    label: "Tuesday",
  },
  {
    key: "WEDNESDAY" as const,
    label: "Wednesday",
  },
  {
    key: "THURSDAY" as const,
    label: "Thursday",
  },
  {
    key: "FRIDAY" as const,
    label: "Friday",
  },
  {
    key: "SATURDAY" as const,
    label: "Saturday",
  },
];

function formatTime(time: string) {
  const [hourString, minute] = time.split(":");

  const hour = Number(hourString);

  const suffix = hour >= 12 ? "PM" : "AM";

  const formattedHour =
    hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedHour}:${minute} ${suffix}`;
}

export function TimetableGrid({
  data,
  isLoading = false,
  classId,
  sectionId,
  academicYearId
}: Props) {

  const periods = data
    ? Array.from(
        new Map(
          Object.values(data)
            .flat()
            .map((entry) => [
              entry.period_id,
              entry,
            ]),
        ).values(),
      ).sort((a, b) =>
        a.start_time.localeCompare(
          b.start_time,
        ),
      )
    : [];

    const [assignmentTarget, setAssignmentTarget] =
    useState<{
      periodId: string;
      day: string;
    } | null>(null);

    const [deleteTarget, setDeleteTarget] =
    useState<{
      timetableId: string;
      subjectName?: string;
      teacherName?: string;
      day?: string;
      startTime?: string;
      endTime?: string;
    } | null>(null);

  return (
    <div className="overflow-hidden border bg-card shadow-xl">
      {/* Card Header */}
      <div className="border-b px-5 py-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold tracking-tight">
            Weekly Timetable
          </h2>

          <p className="text-sm text-muted-foreground">
            Class 8 · Section A
          </p>
        </div>
      </div>

      {/* Horizontal + Vertical Scroll Area */}
      <div className="max-h-[calc(100vh-360px)] overflow-auto">
        <div className="min-w-[1100px]">
          {/* Day Header */}
          <div className="sticky top-0 z-20 grid grid-cols-[110px_repeat(6,minmax(150px,1fr))] border-b bg-muted/95 backdrop-blur">
            <div className="border-r px-4 py-4">
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Period
              </span>
            </div>

            {DAYS.map((day) => (
              <div
                key={day.key}
                className="border-r px-4 py-4 text-center last:border-r-0"
              >
                <p className="text-sm font-semibold">
                  {day.label}
                </p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  {day.key === "SATURDAY"
                    ? "Weekend"
                    : "School Day"}
                </p>
              </div>
            ))}
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="flex min-h-[240px] items-center justify-center">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock3 className="size-4 animate-pulse" />
                Loading timetable...
              </div>
            </div>
          )}

          {/* Empty */}
          {!isLoading && periods.length === 0 && (
            <div className="flex min-h-[240px] items-center justify-center px-6">
              <div className="text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-muted">
                  <Clock3 className="size-5 text-muted-foreground" />
                </div>

                <p className="mt-3 text-sm font-medium">
                  No timetable found
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  No periods have been assigned to this
                  class and section yet.
                </p>
              </div>
            </div>
          )}

          {/* Period Rows */}
          {!isLoading &&
            periods.map((period) => (
              <div
                key={period.period_id}
                className="grid grid-cols-[110px_repeat(6,minmax(150px,1fr))] border-b last:border-b-0"
              >
                {/* Period */}
                <div className="flex flex-col justify-center border-r bg-muted/10 px-4 py-4">
                  <span className="text-sm font-semibold">
                    {period.period}
                  </span>

                  <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock3 className="size-3" />

                    {formatTime(
                      period.start_time,
                    )}

                    {" – "}

                    {formatTime(
                      period.end_time,
                    )}
                  </span>
                </div>

                {/* Days */}
                {DAYS.map((day) => {
                  const entry = data?.[day.key]?.find(
                    (item) =>
                      item.period_id ===
                      period.period_id,
                  );

                  if (!entry || !entry.subject) {
                    return (
                      <div
                        key={day.key}
                        className="border-r p-2 last:border-r-0"
                      >
                        <div className="flex min-h-[116px] items-center justify-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-10 rounded-full"
                            onClick={() =>
                              setAssignmentTarget({
                                periodId:
                                  period.period_id,
                                day: day.key,
                              })
                            }
                          >
                            <Plus className="size-5" />
                          </Button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={day.key}
                      className="border-r p-2 last:border-r-0"
                    >
                      <div className="group relative min-h-[116px] rounded-xl bg-background p-3 transition-all hover:-translate-y-0.5">
                  
                        {/* Delete Button */}
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="
                            absolute right-2 top-2
                            size-7
                            opacity-0
                            text-muted-foreground
                            transition-all
                            hover:bg-destructive/10
                            hover:text-destructive
                            group-hover:opacity-100
                          "
                          aria-label={`Delete ${entry.subject ?? "timetable"} entry`}
                          onClick={() => {
                            if (!entry.timetable_id) {
                              return;
                            }
                  
                            setDeleteTarget({
                              timetableId: entry.timetable_id,
                              subjectName:
                                entry.subject ?? undefined,
                              teacherName:
                                entry.teacher ?? undefined,
                              day: day.label,
                              startTime:
                                formatTime(entry.start_time),
                              endTime:
                                formatTime(entry.end_time),
                            });
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                  
                        {/* Subject */}
                        <div className="flex items-start gap-2 pr-7">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <BookOpen className="size-4 text-muted-foreground" />
                          </div>
                  
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">
                              {entry.subject ?? "Not assigned"}
                            </p>
                  
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {formatTime(entry.start_time)}
                              {" – "}
                              {formatTime(entry.end_time)}
                            </p>
                          </div>
                        </div>
                  
                        {/* Teacher */}
                        {entry.teacher && (
                          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <UserRound className="size-3.5 shrink-0" />
                  
                            <span className="truncate">
                              {entry.teacher}
                            </span>
                          </div>
                        )}
                  
                        {/* Hover indicator */}
                        <div className="pointer-events-none absolute inset-x-3 bottom-2 h-px scale-x-0 bg-foreground/10 transition-transform group-hover:scale-x-100" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
      
      {assignmentTarget && (
        <AssignTimetableDialog
          open={Boolean(assignmentTarget)}
          onOpenChange={(open) => {
            if (!open) {
              setAssignmentTarget(null);
            }
          }}
          classId={classId}
          sectionId={sectionId}
          academicYearId={academicYearId}
          periodId={assignmentTarget?.periodId ?? ""}
          day={assignmentTarget?.day ?? ""}
        />
      )}

    {deleteTarget && (
      <DeleteTimetableDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        timetableId={deleteTarget.timetableId}
        classId={classId}
        sectionId={sectionId}
        subjectName={deleteTarget.subjectName}
        teacherName={deleteTarget.teacherName}
        day={deleteTarget.day}
        startTime={deleteTarget.startTime}
        endTime={deleteTarget.endTime}
      />
    )}
    </div>
  );
}