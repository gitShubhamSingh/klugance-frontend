"use client";

import { useQuery } from "@tanstack/react-query";

import { getClassSubjects } from "../api/get-class-subjects";

export const timetableClassSubjectKeys = {
  all: ["timetable-class-subjects"] as const,

  list: (classId: string) =>
    [
      ...timetableClassSubjectKeys.all,
      classId,
    ] as const,
};

export function useTimetableClassSubjects(
  classId: string,
) {
  return useQuery({
    queryKey:
      timetableClassSubjectKeys.list(
        classId,
      ),

    queryFn: () =>
      getClassSubjects(classId),

    enabled: Boolean(classId),
  });
}