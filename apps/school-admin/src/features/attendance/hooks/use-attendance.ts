"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAttendanceOverview, getSectionAttendance } from "../api/attendance";

export const attendanceKeys = {
  all: ["school-attendance"] as const,
  overview: (date: string) => [...attendanceKeys.all, "overview", date] as const,
  section: (sectionId: string, date: string) => [...attendanceKeys.all, "section", sectionId, date] as const,
};

// Teachers mark through the day: refresh every minute while open.
const REFRESH_MS = 60_000;

export function useAttendanceOverview(date: string) {
  return useQuery({
    queryKey: attendanceKeys.overview(date),
    queryFn: () => getAttendanceOverview(date),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  });
}

export function useSectionAttendance(sectionId: string | null, date: string) {
  return useQuery({
    queryKey: attendanceKeys.section(sectionId ?? "", date),
    queryFn: () => getSectionAttendance(sectionId!, date),
    enabled: Boolean(sectionId),
    placeholderData: keepPreviousData,
    refetchInterval: REFRESH_MS,
  });
}
