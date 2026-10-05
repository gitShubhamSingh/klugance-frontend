"use client";

import { useQuery } from "@tanstack/react-query";

import { getClassTeachers } from "../api/get-class-teachers";

export const timetableClassTeacherKeys = {
  all: ["timetable-class-teachers"] as const,

  list: (classId: string) =>
    [
      ...timetableClassTeacherKeys.all,
      classId,
    ] as const,
};

export function useTimetableClassTeachers(
  classId: string,
) {
  return useQuery({
    queryKey:
      timetableClassTeacherKeys.list(classId),

    queryFn: () =>
      getClassTeachers(classId),

    enabled: Boolean(classId),
  });
}