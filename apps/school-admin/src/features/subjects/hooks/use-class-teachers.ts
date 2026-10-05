"use client";

import { useQuery } from "@tanstack/react-query";

import { getClassTeachers } from "../api";

export const subjectTeacherKeys = {
  all: ["subject-teachers"] as const,

  classTeachers: (classId: string) =>
    [
      ...subjectTeacherKeys.all,
      "class",
      classId,
    ] as const,
};

export function useSubjectClassTeachers(
  classId: string,
  enabled = true,
) {
  return useQuery({
    queryKey:
      subjectTeacherKeys.classTeachers(
        classId,
      ),

    queryFn: () =>
      getClassTeachers(classId),

    enabled:
      enabled && Boolean(classId),
  });
}