"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateTeacher,
  type UpdateTeacherPayload,
} from "../api/update-teacher";

import { teacherKeys } from "./use-teachers";

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teacherId,
      payload,
    }: {
      teacherId: string;
      payload: UpdateTeacherPayload;
    }) =>
      updateTeacher(
        teacherId,
        payload,
      ),

    onSuccess: (updatedTeacher) => {
      /*
       * 1. Update the individual teacher cache.
       *
       * Existing key:
       * ["teachers", "detail", teacherId]
       */
      queryClient.setQueryData(
        teacherKeys.detail(
          updatedTeacher.id,
        ),
        updatedTeacher,
      );

      /*
       * 2. Refresh the teachers LIST.
       *
       * Existing key:
       * ["teachers", "list"]
       *
       * This makes the table immediately reflect
       * the updated teacher.
       */
      queryClient.invalidateQueries({
        queryKey: teacherKeys.lists(),
      });
    },
  });
}