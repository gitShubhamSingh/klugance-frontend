"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateTeacherStatus,
  type UpdateTeacherStatusPayload,
} from "../api/update-teacher-status";

import { teacherKeys } from "./use-teachers";

export function useUpdateTeacherStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      teacherId,
      payload,
    }: {
      teacherId: string;
      payload: UpdateTeacherStatusPayload;
    }) =>
      updateTeacherStatus(
        teacherId,
        payload,
      ),

    onSuccess: (updatedTeacher) => {
      /*
       * Update the detail cache.
       */
      queryClient.setQueryData(
        teacherKeys.detail(
          updatedTeacher.id,
        ),
        updatedTeacher,
      );

      /*
       * Refresh the teachers list.
       *
       * This makes the table reflect
       * the new status immediately.
       */
      queryClient.invalidateQueries({
        queryKey: teacherKeys.lists(),
      });
    },
  });
}