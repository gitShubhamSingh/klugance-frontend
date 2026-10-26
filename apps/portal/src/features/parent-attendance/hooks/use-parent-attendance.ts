"use client";

import { useQuery } from "@tanstack/react-query";

import { getParentAttendance } from "../api/get-parent-attendance";

export const parentAttendanceKeys = {
  all: ["parent-attendance"] as const,
  child: (studentId: string, date: string, month: string) =>
    [...parentAttendanceKeys.all, studentId, date, month] as const,
};

export function useParentAttendance(studentId: string | null, date: string, month: string) {
  return useQuery({
    queryKey: parentAttendanceKeys.child(studentId ?? "", date, month),
    queryFn: () => getParentAttendance(studentId!, date, month),
    enabled: Boolean(studentId),
  });
}
