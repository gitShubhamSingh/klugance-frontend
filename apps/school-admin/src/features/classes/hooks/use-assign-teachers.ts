"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  assignTeachers,
  type AssignTeachersRequest,
} from "../api";

export function useAssignTeachers() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      payload: AssignTeachersRequest,
    ) => assignTeachers(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["school-classes", "list"],
      });
    },
  });
}