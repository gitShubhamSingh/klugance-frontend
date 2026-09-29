"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  toast,
} from "sonner";

import {
  createSubjectForClass,
  type CreateSubjectForClassPayload,
} from "../api/create-subject-for-class";

import {
  subjectQueryKeys,
} from "../api/query-keys";


export function useCreateSubjectForClass() {
  const queryClient =
    useQueryClient();

  return useMutation({
    mutationFn: (
      payload: CreateSubjectForClassPayload,
    ) =>
      createSubjectForClass(payload),

    onSuccess: async (
      _data,
      variables,
    ) => {

      /* =========================================== */
      /* REFETCH SUBJECTS FOR THIS CLASS */
      /* =========================================== */

      await queryClient.invalidateQueries({
        queryKey:
          subjectQueryKeys.classSubjects(
            variables.class_id,
          ),
      });


      /* =========================================== */
      /* SUCCESS MESSAGE */
      /* =========================================== */

      toast.success(
        "Subject created and assigned successfully.",
      );
    },
  });
}