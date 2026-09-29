"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  updateStudent,
  type UpdateStudentPayload,
} from "../api/update-student";

import { studentKeys } from "./use-students";

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      studentId,
      payload,
    }: {
      studentId: string;
      payload: UpdateStudentPayload;
    }) =>
      updateStudent(
        studentId,
        payload,
      ),

    onSuccess: (updatedStudent) => {
      /*
       * Update the individual student cache
       * if it exists.
       */
      queryClient.setQueryData(
        studentKeys.detail(
          updatedStudent.id,
        ),
        updatedStudent,
      );

      /*
       * Refresh the students list.
       *
       * This is what makes the edited row
       * immediately reflect the new data.
       */
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
}