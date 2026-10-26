"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherStudents } from "../api/get-teacher-students";
import { mapTeacherStudents } from "../lib/map-teacher-students";

export const teacherStudentKeys = {
  all: ["teacher-students"] as const,
  day: (date: string) =>
    [...teacherStudentKeys.all, date] as const,
};

export function useTeacherStudents(date: string) {
  return useQuery({
    queryKey: teacherStudentKeys.day(date),
    queryFn: () => getTeacherStudents(date),
    select: mapTeacherStudents,
    // "Present today" changes as attendance is marked.
    refetchInterval: 5 * 60 * 1000,
  });
}
