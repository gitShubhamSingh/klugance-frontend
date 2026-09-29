"use client";

import {
  BookOpen,
  Clock3,
  MapPin,
  UserRound,
} from "lucide-react";

import type {
  TimetableDay,
  TimetableEntry,
} from "../types";

type Props = {
  entries: TimetableEntry[];
};

const DAYS: {
  key: TimetableDay;
  label: string;
}[] = [
  {
    key: "monday",
    label: "Monday",
  },
  {
    key: "tuesday",
    label: "Tuesday",
  },
  {
    key: "wednesday",
    label: "Wednesday",
  },
  {
    key: "thursday",
    label: "Thursday",
  },
  {
    key: "friday",
    label: "Friday",
  },
  {
    key: "saturday",
    label: "Saturday",
  },
];

const PERIODS = [
  {
    number: 1,
    start: "08:00",
    end: "08:45",
  },
  {
    number: 2,
    start: "08:45",
    end: "09:30",
  },
  {
    number: 3,
    start: "09:30",
    end: "10:15",
  },
  {
    number: 4,
    start: "10:15",
    end: "10:30",
  },
  {
    number: 5,
    start: "10:30",
    end: "11:15",
  },
  {
    number: 6,
    start: "11:15",
    end: "12:00",
  },
];

function getEntry(
  entries: TimetableEntry[],
  day: TimetableDay,
  period: number,
) {
  return entries.find(
    (entry) =>
      entry.day === day &&
      entry.period_number === period,
  );
}

function formatTime(time: string) {
  const [hourString, minute] = time.split(":");

  const hour = Number(hourString);

  const suffix = hour >= 12 ? "PM" : "AM";

  const formattedHour =
    hour % 12 === 0 ? 12 : hour % 12;

  return `${formattedHour}:${minute} ${suffix}`;
}

export function TimetableGrid({
  entries,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
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

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          {/* Day Header */}
          <div className="grid grid-cols-[110px_repeat(6,minmax(150px,1fr))] border-b bg-muted/30">
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
                  {day.key === "saturday"
                    ? "Weekend"
                    : "School Day"}
                </p>
              </div>
            ))}
          </div>

          {/* Period Rows */}
          {PERIODS.map((period) => (
            <div
              key={period.number}
              className="grid grid-cols-[110px_repeat(6,minmax(150px,1fr))] border-b last:border-b-0"
            >
              {/* Period */}
              <div className="flex flex-col justify-center border-r bg-muted/10 px-4 py-4">
                <span className="text-sm font-semibold">
                  {period.number === 4
                    ? "Break"
                    : `Period ${period.number}`}
                </span>

                <span className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock3 className="size-3" />

                  {formatTime(period.start)}
                </span>
              </div>

              {/* Days */}
              {DAYS.map((day) => {
                const entry = getEntry(
                  entries,
                  day.key,
                  period.number,
                );

                if (!entry) {
                  return (
                    <div
                      key={day.key}
                      className="border-r p-2 last:border-r-0"
                    >
                      <div className="flex h-full min-h-[116px] items-center justify-center rounded-xl border border-dashed bg-muted/10">
                        <span className="text-xs text-muted-foreground">
                          Not assigned
                        </span>
                      </div>
                    </div>
                  );
                }

                if (entry.is_break) {
                  return (
                    <div
                      key={day.key}
                      className="border-r p-2 last:border-r-0"
                    >
                      <div className="flex min-h-[116px] flex-col items-center justify-center rounded-xl bg-muted/50 px-3 text-center">
                        <div className="flex size-8 items-center justify-center rounded-full bg-background">
                          <Clock3 className="size-4 text-muted-foreground" />
                        </div>

                        <p className="mt-2 text-sm font-medium">
                          Break
                        </p>

                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          {formatTime(entry.start_time)} –{" "}
                          {formatTime(entry.end_time)}
                        </p>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={day.key}
                    className="border-r p-2 last:border-r-0"
                  >
                    <div className="group relative min-h-[116px] rounded-xl border bg-background p-3 transition-all hover:-translate-y-0.5 hover:shadow-md">
                      {/* Subject */}
                      <div className="flex items-start gap-2">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <BookOpen className="size-4 text-muted-foreground" />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {entry.subject}
                          </p>

                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {formatTime(entry.start_time)} –{" "}
                            {formatTime(entry.end_time)}
                          </p>
                        </div>
                      </div>

                      {/* Teacher */}
                      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                        <UserRound className="size-3.5 shrink-0" />

                        <span className="truncate">
                          {entry.teacher}
                        </span>
                      </div>

                      {/* Room */}
                      {entry.room && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="size-3.5 shrink-0" />

                          <span className="truncate">
                            {entry.room}
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
    </div>
  );
}