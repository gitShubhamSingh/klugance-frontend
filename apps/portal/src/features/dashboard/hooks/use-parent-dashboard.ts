"use client";

import { useQuery } from "@tanstack/react-query";

import { getParentDashboard } from "../api/get-parent-dashboard";

export const parentDashboardKeys = {
  all: ["parent-dashboard"] as const,
  child: (studentId: string, date: string) =>
    [...parentDashboardKeys.all, studentId, date] as const,
};

export function useParentDashboard(studentId: string | null, date: string) {
  return useQuery({
    queryKey: parentDashboardKeys.child(studentId ?? "", date),
    queryFn: () => getParentDashboard(studentId!, date),
    enabled: Boolean(studentId),
    // Attendance and bus status change during the school day.
    refetchInterval: 5 * 60 * 1000,
  });
}
