"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherAssignments } from "../api";

export const teacherAssignmentKeys = {
  all: ["subject-teacher-assignments"] as const,

  list: () =>
    [
      ...teacherAssignmentKeys.all,
      "list",
    ] as const,
};

export function useSubjectTeacherAssignments(
  enabled = true,
) {
  return useQuery({
    queryKey:
      teacherAssignmentKeys.list(),

    queryFn:
      getTeacherAssignments,

    enabled,
  });
}