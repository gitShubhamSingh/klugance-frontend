"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toast,
} from "sonner";

import {
  deleteClassSubject,
} from "../api/class-subjects-api";

import {
  subjectQueryKeys,
} from "../api/query-keys";

interface DeleteClassSubjectVariables {
  classSubjectId: string;

  classId: string;
}

export function useDeleteClassSubject() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: ({
      classSubjectId,
    }: DeleteClassSubjectVariables) =>
      deleteClassSubject(
        classSubjectId,
      ),

    onSuccess: async (
      _,
      variables,
    ) => {
      await queryClient.invalidateQueries({
        queryKey:
          subjectQueryKeys.classSubjects(
            variables.classId,
          ),
      });

      toast.success(
        "Subject removed from this class.",
      );
    },
  });
}