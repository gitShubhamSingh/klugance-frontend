"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTeacher,
} from "../api";

import type {
  TeacherFormData,
} from "../schemas/teacher.schema";

import {
  teacherKeys,
} from "./use-teachers";

export function useCreateTeacher() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: TeacherFormData,
    ) => {
      return createTeacher(payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          teacherKeys.lists(),
      });
    },
  });
}