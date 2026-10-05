"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createTeacherAssignment,
} from "../api";

import type {
  CreateTeacherAssignmentPayload,
} from "../api";

import {
  teacherAssignmentKeys,
} from "./use-teacher-assignments";

export function useCreateTeacherAssignment() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateTeacherAssignmentPayload,
    ) =>
      createTeacherAssignment(
        payload,
      ),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey:
          teacherAssignmentKeys.all,
      });
    },
  });
}