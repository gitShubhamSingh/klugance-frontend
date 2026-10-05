"use client";

import { useQuery } from "@tanstack/react-query";

import { getTimetableGrid } from "../api/get-timetable-grid";

export const timetableGridKeys = {
  all: ["timetable-grid"] as const,

  grid: (
    classId: string,
    sectionId: string,
  ) =>
    [
      ...timetableGridKeys.all,
      classId,
      sectionId,
    ] as const,
};

export function useTimetableGrid(
  classId: string,
  sectionId: string,
) {
  return useQuery({
    queryKey: timetableGridKeys.grid(
      classId,
      sectionId,
    ),

    queryFn: () =>
      getTimetableGrid(
        classId,
        sectionId,
      ),

    enabled: Boolean(
      classId && sectionId,
    ),
  });
}