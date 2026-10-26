"use client";

import { cn } from "@/lib/utils";

import {
  dayStatusLabels,
  dayStatusStyle,
  periodStatusDot,
  periodStatusLabels,
  studentName,
} from "../lib/attendance-utils";
import type { AttendanceStudent } from "../types/attendance";

export function AttendanceStudentCard({
  student,
  periodNames,
}: {
  student: AttendanceStudent;
  periodNames: Map<number, string>;
}) {
  const style = dayStatusStyle(student.day_status);
  const name = studentName(student);

  return (
    <div
      tabIndex={0}
      className={cn(
        "group relative flex min-h-36 flex-col items-center justify-center rounded-xl border px-3 pt-7 pb-3 outline-none transition-all",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring",
        style.card,
      )}
    >
      <div className="absolute top-3 left-3 text-xs font-semibold text-muted-foreground tabular-nums">
        {student.roll_number.padStart(2, "0")}
      </div>

      <div className={cn("flex size-11 items-center justify-center rounded-full text-sm font-semibold", style.avatar)}>
        {student.first_name.charAt(0).toUpperCase()}
        {student.last_name.charAt(0).toUpperCase()}
      </div>

      <p className="mt-2 max-w-full truncate text-center text-sm font-medium">{name}</p>
      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {student.day_status ? dayStatusLabels[student.day_status] : "Not marked"}
      </p>

      {/* One dot per marked period, in order. */}
      {student.marks.length > 0 && (
        <div className="mt-1.5 flex gap-1" aria-hidden>
          {student.marks.map((mark) => (
            <span key={mark.period_number} className={cn("size-1.5 rounded-full", periodStatusDot[mark.status])} />
          ))}
        </div>
      )}

      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-60 -translate-x-1/2 rounded-lg border bg-popover p-3 text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <p className="font-semibold">{name}</p>
        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p>
            Roll number: <span className="font-medium text-foreground">{student.roll_number}</span>
          </p>
          <p>
            Admission no: <span className="font-medium text-foreground">{student.admission_number}</span>
          </p>
          <p>
            Periods attended:{" "}
            <span className="font-medium text-foreground">
              {student.periods_attended} of {student.periods_marked} marked
            </span>
          </p>
        </div>
        {student.marks.length > 0 && (
          <ul className="mt-2 space-y-0.5 border-t pt-2 text-xs">
            {student.marks.map((mark) => (
              <li key={mark.period_number} className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">
                  {periodNames.get(mark.period_number) ?? `Period ${mark.period_number}`}
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className={cn("size-1.5 rounded-full", periodStatusDot[mark.status])} />
                  {periodStatusLabels[mark.status]}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
