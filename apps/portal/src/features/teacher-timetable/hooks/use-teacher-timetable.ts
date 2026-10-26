"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacherTimetable } from "../api/get-teacher-timetable";
import { buildTimetable } from "../lib/build-timetable";

export const teacherTimetableKeys = {
  all: ["teacher-timetable"] as const,
};

export function useTeacherTimetable() {
  return useQuery({
    queryKey: teacherTimetableKeys.all,
    queryFn: getTeacherTimetable,
    select: buildTimetable,
  });
}
