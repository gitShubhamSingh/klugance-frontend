"use client";

import type { AttendanceStudent } from "../types";

import { AttendanceStudentCard } from "./attendance-student-card";

type Props = {
  students: AttendanceStudent[];
};

export function AttendanceGrid({
  students,
}: Props) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">
            Class 10 - Section A
          </h2>

          <p className="text-sm text-muted-foreground">
            23 August 2026
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <Legend
            className="bg-green-500"
            label="Present"
          />

          <Legend
            className="bg-red-500"
            label="Absent"
          />

          <Legend
            className="bg-muted-foreground"
            label="Not Marked"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
        {students.map((student) => (
          <AttendanceStudentCard
            key={student.id}
            student={student}
          />
        ))}
      </div>
    </div>
  );
}

function Legend({
  className,
  label,
}: {
  className: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`size-2 rounded-full ${className}`}
      />

      <span className="text-muted-foreground">
        {label}
      </span>
    </div>
  );
}