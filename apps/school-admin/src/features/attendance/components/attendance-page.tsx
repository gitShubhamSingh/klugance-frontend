"use client";

import { AttendanceHeader } from "./attendance-header";


import { AttendanceGrid } from "./attendance-grid";

import { dummyAttendance } from "../data/dummy-attendance";

export function AttendancePage() {
  const students = dummyAttendance.students;

  return (
    <div className="space-y-6 p-6">
      <AttendanceHeader />

      <AttendanceGrid
        students={students}
      />
    </div>
  );
}