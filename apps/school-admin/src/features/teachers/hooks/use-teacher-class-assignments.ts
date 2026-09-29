"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getTeacherClassAssignments,
} from "../api";

export const teacherClassAssignmentKeys = {
  all: ["teacher-class-assignments"] as const,

  byTeacher: (teacherId: string) =>
    [
      ...teacherClassAssignmentKeys.all,
      "teacher",
      teacherId,
    ] as const,
};

export function useTeacherClassAssignments(
  teacherId: string | null,
  enabled = true,
) {
  return useQuery({
    queryKey: teacherClassAssignmentKeys.byTeacher(
      teacherId ?? "",
    ),

    queryFn: () =>
      getTeacherClassAssignments(
        teacherId!,
      ),

    enabled:
      enabled &&
      Boolean(teacherId),
  });
}