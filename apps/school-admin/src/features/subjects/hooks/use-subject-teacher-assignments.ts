"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getSubjectTeacherAssignments,
} from "../api";

export const subjectTeacherAssignmentKeys = {
  all: ["subject-teacher-assignments"] as const,

  bySubject: (subjectId: string) =>
    [
      ...subjectTeacherAssignmentKeys.all,
      "subject",
      subjectId,
    ] as const,
};

export function useSubjectTeacherAssignments(
  subjectId: string,
  enabled = true,
) {
  return useQuery({
    queryKey:
      subjectTeacherAssignmentKeys.bySubject(
        subjectId,
      ),

    queryFn: () =>
      getSubjectTeacherAssignments(
        subjectId,
      ),

    enabled:
      enabled &&
      Boolean(subjectId),
  });
}