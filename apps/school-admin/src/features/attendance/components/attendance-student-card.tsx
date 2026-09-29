"use client";

import type { AttendanceStudent } from "../types";

import { cn } from "@/lib/utils";

type Props = {
  student: AttendanceStudent;
};

function getStudentName(student: AttendanceStudent) {
  return [
    student.first_name,
    student.middle_name,
    student.last_name,
  ]
    .filter(Boolean)
    .join(" ");
}

export function AttendanceStudentCard({
  student,
}: Props) {
  const statusLabel =
    student.status === "present"
      ? "Present"
      : student.status === "absent"
        ? "Absent"
        : "Not Marked";

  return (
    <div
      className={cn(
        "group relative flex min-h-28 cursor-default flex-col items-center justify-center rounded-xl border p-3 transition-all",
        "hover:-translate-y-0.5 hover:shadow-md",

        student.status === "present" &&
          "border-green-200 bg-green-50/70 hover:border-green-300",

        student.status === "absent" &&
          "border-red-200 bg-red-50/70 hover:border-red-300",

        student.status === "not_marked" &&
          "border-border bg-muted/30 hover:border-border",
      )}
    >
      <div className="absolute left-3 top-3 text-xs font-semibold tabular-nums text-muted-foreground">
        {String(student.roll_number).padStart(2, "0")}
      </div>

      <div
        className={cn(
          "flex size-11 items-center justify-center rounded-full text-sm font-semibold",

          student.status === "present" &&
            "bg-green-100 text-green-700",

          student.status === "absent" &&
            "bg-red-100 text-red-700",

          student.status === "not_marked" &&
            "bg-muted text-muted-foreground",
        )}
      >
        {student.first_name.charAt(0).toUpperCase()}
        {student.last_name.charAt(0).toUpperCase()}
      </div>

      <p className="mt-2 max-w-full truncate text-center text-sm font-medium">
        {getStudentName(student)}
      </p>

      <p className="mt-0.5 text-[11px] text-muted-foreground">
        {statusLabel}
      </p>

      <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg border bg-popover p-3 text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
        <p className="font-semibold">
          {getStudentName(student)}
        </p>

        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
          <p>
            Roll Number:{" "}
            <span className="font-medium text-foreground">
              {student.roll_number}
            </span>
          </p>

          <p>
            Admission No:{" "}
            <span className="font-medium text-foreground">
              {student.admission_number}
            </span>
          </p>

          <p>
            Class:{" "}
            <span className="font-medium text-foreground">
              {student.class_name}
            </span>
          </p>

          <p>
            Section:{" "}
            <span className="font-medium text-foreground">
              {student.section_name}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}