"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeachers } from "../api";

export const teacherKeys = {
  all: ["school-teachers"] as const,

  lists: () =>
    [
      ...teacherKeys.all,
      "list",
    ] as const,

  list: () =>
    [
      ...teacherKeys.lists(),
    ] as const,

  detail: (id: string) =>
    [
      ...teacherKeys.all,
      "detail",
      id,
    ] as const,
};

export function useTeachers() {
  return useQuery({
    queryKey: teacherKeys.list(),
    queryFn: getTeachers,
  });
}