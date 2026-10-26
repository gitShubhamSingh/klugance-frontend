"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getStudentAttendance,
  getStudentDashboard,
  getStudentExams,
  getStudentHomework,
  getStudentTimetable,
} from "../api/student";

export const studentKeys = {
  all: ["student"] as const,
  dashboard: (date: string) => [...studentKeys.all, "dashboard", date] as const,
  attendance: (date: string, month: string) => [...studentKeys.all, "attendance", date, month] as const,
  homework: (date: string) => [...studentKeys.all, "homework", date] as const,
  exams: (date: string) => [...studentKeys.all, "exams", date] as const,
  timetable: () => [...studentKeys.all, "timetable"] as const,
};

export function useStudentDashboard(date: string) {
  return useQuery({
    queryKey: studentKeys.dashboard(date),
    queryFn: () => getStudentDashboard(date),
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useStudentAttendance(date: string, month: string) {
  return useQuery({
    queryKey: studentKeys.attendance(date, month),
    queryFn: () => getStudentAttendance(date, month),
  });
}

export function useStudentHomework(date: string) {
  return useQuery({
    queryKey: studentKeys.homework(date),
    queryFn: () => getStudentHomework(date),
  });
}

export function useStudentExams(date: string) {
  return useQuery({
    queryKey: studentKeys.exams(date),
    queryFn: () => getStudentExams(date),
  });
}

export function useStudentTimetable() {
  return useQuery({
    queryKey: studentKeys.timetable(),
    queryFn: getStudentTimetable,
  });
}
