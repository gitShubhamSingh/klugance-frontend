"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherDashboard } from "../api/get-teacher-dashboard";

export const teacherDashboardKeys = {
  all: ["teacher-dashboard"] as const,
  day: (date: string) =>
    [...teacherDashboardKeys.all, date] as const,
};

/** Local "YYYY-MM-DD" (not UTC, which can be a day off). */
export function toLocalDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useTeacherDashboard(date: string) {
  return useQuery({
    queryKey: teacherDashboardKeys.day(date),
    queryFn: () => getTeacherDashboard(date),
    // Attendance / homework counts change during the day.
    refetchInterval: 5 * 60 * 1000,
  });
}
