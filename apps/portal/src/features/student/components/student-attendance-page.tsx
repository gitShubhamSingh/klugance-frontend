"use client";

import { useState } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { toLocalDateKey } from "@/features/dashboard/hooks/use-teacher-dashboard";

import { useStudentAttendance } from "../hooks/use-student";
import { AttendanceView, MonthPicker } from "./attendance-view";

export function StudentAttendancePage() {
  const today = toLocalDateKey(new Date());
  const currentMonth = today.slice(0, 7);
  const [month, setMonth] = useState(currentMonth);

  const query = useStudentAttendance(today, month);

  return (
    <PageContainer>
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Attendance</h1>
            <p className="mt-2 text-muted-foreground">Taken every period — see each day and each period.</p>
          </div>
          <MonthPicker month={month} currentMonth={currentMonth} onChange={setMonth} />
        </div>

        <AttendanceView query={query} today={today} />
      </div>
    </PageContainer>
  );
}
