"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherAssignments } from "../api/get-teacher-assignments";

export const timetableTeacherAssignmentKeys = {
  all: [
    "timetable-teacher-assignments",
  ] as const,

  list: () =>
    [
      ...timetableTeacherAssignmentKeys.all,
      "list",
    ] as const,
};

export function useTimetableTeacherAssignments() {
  return useQuery({
    queryKey:
      timetableTeacherAssignmentKeys.list(),

    queryFn: getTeacherAssignments,
  });
}