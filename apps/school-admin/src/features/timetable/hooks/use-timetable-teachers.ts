"use client";

import { useQuery } from "@tanstack/react-query";

import { getTimetableTeachers } from "../api/get-timetable-teachers";

export const timetableTeacherKeys = {
  all: ["timetable-teachers"] as const,

  list: () =>
    [
      ...timetableTeacherKeys.all,
      "list",
    ] as const,
};

export function useTimetableTeachers() {
  return useQuery({
    queryKey:
      timetableTeacherKeys.list(),

    queryFn: getTimetableTeachers,
  });
}