"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createStudent,
  type CreateStudentPayload,
} from "../api/create-student";

import { studentKeys } from "./use-students";

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateStudentPayload,
    ) => createStudent(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(),
      });
    },
  });
}