"use client";

import { useQuery } from "@tanstack/react-query";

import { getTeacher } from "../api/get-teacher";

export const teacherKeys = {
  all: ["teachers"] as const,

  lists: () => [...teacherKeys.all, "list"] as const,

  details: () => [...teacherKeys.all, "detail"] as const,

  detail: (teacherId: string) =>
    [...teacherKeys.details(), teacherId] as const,
};

export function useTeacher(
  teacherId: string | null,
) {
  return useQuery({
    queryKey: teacherKeys.detail(
      teacherId ?? "",
    ),

    queryFn: () => {
      if (!teacherId) {
        throw new Error(
          "Teacher ID is required",
        );
      }

      return getTeacher(teacherId);
    },

    enabled: Boolean(teacherId),
  });
}