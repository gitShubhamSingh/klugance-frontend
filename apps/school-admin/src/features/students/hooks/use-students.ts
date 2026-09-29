"use client";

import { useQuery } from "@tanstack/react-query";

import { getStudents } from "../api/get-students";

export const studentKeys = {
  all: ["students"] as const,

  lists: () =>
    [...studentKeys.all, "list"] as const,

  details: () =>
    [...studentKeys.all, "detail"] as const,

  detail: (studentId: string) =>
    [
      ...studentKeys.details(),
      studentId,
    ] as const,
};

export function useStudents() {
  return useQuery({
    queryKey: studentKeys.lists(),
    queryFn: getStudents,
  });
}

export function useStudent(
  studentId: string | null,
) {
  return useQuery({
    queryKey: studentKeys.detail(
      studentId ?? "",
    ),

    queryFn: async () => {
      if (!studentId) {
        throw new Error(
          "Student ID is required",
        );
      }

      /*
       * Your existing getStudent function
       * should be used here.
       */
      const { getStudent } =
        await import("../api/get-student");

      return getStudent(studentId);
    },

    enabled: Boolean(studentId),
  });
}