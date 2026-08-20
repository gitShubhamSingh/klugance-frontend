"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  schoolAdminService,
} from "../services";

import type {
  CreateSchoolAdminFormValues,
} from "../schemas";

export function useCreateSchoolAdmin() {
  const queryClient =
    useQueryClient();

  const mutation =
    useMutation({
      mutationFn: (
        payload: CreateSchoolAdminFormValues,
      ) =>
        schoolAdminService.create(
          payload,
        ),

      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [
            "school-admins",
          ],
        });
      },
    });

  return {
    createSchoolAdmin:
      mutation.mutateAsync,

    isCreating:
      mutation.isPending,

    error:
      mutation.error,

    reset:
      mutation.reset,
  };
}