"use client";

import { useQuery } from "@tanstack/react-query";

import { getClassTeachers } from "../api/get-class-teachers";

export const subjectClassTeacherKeys = {
  all: ["subject-class-teachers"] as const,

  list: (classId: string) =>
    [
      ...subjectClassTeacherKeys.all,
      classId,
    ] as const,
};

export function useSubjectClassTeachers(
  classId: string,
  enabled = true,
) {
  return useQuery({
    queryKey:
      subjectClassTeacherKeys.list(classId),

    queryFn: () =>
      getClassTeachers(classId),

    enabled:
      enabled && Boolean(classId),
  });
}